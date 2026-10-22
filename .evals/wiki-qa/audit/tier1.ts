#!/usr/bin/env bun
/**
 * Tier-1 (free, no model calls) audit of cases.jsonl, per eval-audit.md §1:
 *   - schema / duplicates / balance / length distributions
 *   - every key point's `source` re-checked against OUR wiki.sqlite (the snapshot the agent's hosted API serves)
 *
 *   bun audit/tier1.ts [cases.jsonl] [../prep/wiki.sqlite]
 */
import { Database } from "bun:sqlite";
import { readFileSync } from "node:fs";

const casesPath = process.argv[2] ?? "cases.jsonl";
const dbPath = process.argv[3] ?? "prep/wiki.sqlite";
const cases = readFileSync(casesPath, "utf8").trim().split("\n").map((l) => JSON.parse(l));
const db = new Database(dbPath, { readonly: true });

const norm = (s: string) =>
  s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[’‘`]/g, "'").replace(/[^\p{L}\p{N}= ]+/gu, " ").replace(/\s+/g, " ").trim();

// ---- schema / dupes / balance
const issues: string[] = [];
const ids = new Set<string>();
for (const c of cases) {
  if (ids.has(c.prompt_id)) issues.push(`duplicate id ${c.prompt_id}`);
  ids.add(c.prompt_id);
  if (!c.prompt?.trim()) issues.push(`${c.prompt_id}: empty prompt`);
  if (!Array.isArray(c.tags) || !c.tags.length) issues.push(`${c.prompt_id}: no tags`);
  const kp = c.expected?.key_points;
  if (!Array.isArray(kp) || !kp.length) issues.push(`${c.prompt_id}: no key_points`);
  for (const k of kp ?? []) if (!k.text || !k.source) issues.push(`${c.prompt_id}: key point missing text/source`);
}
const promptSet = new Set(cases.map((c) => norm(c.prompt)));
if (promptSet.size !== cases.length) issues.push("near-duplicate prompts present");
const count = (f: (c: any) => string) => {
  const m = new Map<string, number>();
  for (const c of cases) m.set(f(c), (m.get(f(c)) ?? 0) + 1);
  return Object.fromEntries([...m].sort());
};
const stats = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return { min: s[0], median: s[Math.floor(s.length / 2)], max: s.at(-1) };
};
const summary = {
  n: cases.length,
  by_tag0: count((c) => c.tags[0]),
  by_origin: count((c) => String(c.origin).replace(/ \(.*/, "")),
  key_points_per_case: stats(cases.map((c) => c.expected.key_points.length)),
  prompt_chars: stats(cases.map((c) => [...c.prompt].length)),
  id_gaps: ["H05"].filter((x) => !ids.has(x)),
  schema_issues: issues,
};
console.log(JSON.stringify(summary, null, 1));

// ---- source verification against wiki.sqlite
const pageByNorm = new Map<string, { title: string; text: string }>();
for (const r of db.query("select title, plain, wikitext from pages").all() as any[]) {
  pageByNorm.set(norm(r.title), { title: r.title, text: norm(r.plain + "\n" + r.wikitext) });
}
for (const r of db.query("select title, target from redirects").all() as any[]) {
  const t = pageByNorm.get(norm(r.target));
  if (t && !pageByNorm.has(norm(r.title))) pageByNorm.set(norm(r.title), t);
}
const titlesDesc = [...pageByNorm.keys()].sort((a, b) => b.length - a.length);

type Res = { id: string; source: string; status: "ok" | "title_missing" | "fragment_missing" | "unchecked"; detail?: string };
const results: Res[] = [];
for (const c of cases) {
  for (const k of c.expected.key_points) {
    const src: string = k.source;
    if (/^全库检索/.test(src)) { results.push({ id: c.prompt_id, source: src, status: "unchecked", detail: "corpus-wide claim; see below" }); continue; }
    let currentTitles: string[] = [];
    let ok = true, titleMiss = false;
    const detail: string[] = [];
    for (const piece of src.split(";")) {
      const ci = piece.indexOf(":");
      let fragmentRaw = piece;
      let head = "";
      if (ci >= 0) { head = piece.slice(0, ci); fragmentRaw = piece.slice(ci + 1); }
      else if (/^[^=]+(信息框|首句)\s*$/.test(piece.trim())) { head = piece; fragmentRaw = ""; }
      if (head) {
        const heads = head.split(/ ?(?:信息框|首句|===.*?===)/)[0].trim().split(/;/).map((s) => s.trim());
        currentTitles = [];
        const hn = norm(heads[0]);
        const t = titlesDesc.find((x) => x === hn);
        if (t) currentTitles = [t]; else { titleMiss = true; detail.push(`no page "${heads[0]}"`); }
      }
      if (/^[^=]+(信息框|首句)\s*$/.test(piece.trim())) continue;
      const frags = fragmentRaw.split(/…|\.\.\./).map((s) => norm(s)).filter(Boolean);
      for (const fr of frags) {
        // allow "Field = value" to match either "field value" or "field: value"
        const variants = [fr, fr.replace(/ ?= ?/g, " "), ...fr.split(" = ")];
        const hit = currentTitles.some((t) => variants.some((v) => v && pageByNorm.get(t)!.text.replace(/[:|]/g, " ").replace(/\s+/g, " ").includes(v.replace(/=/g, "").replace(/\s+/g, " ").trim())));
        if (!hit) { ok = false; detail.push(`fragment not found: "${fr.slice(0, 60)}"`); }
      }
    }
    results.push({ id: c.prompt_id, source: src, status: titleMiss ? "title_missing" : ok ? "ok" : "fragment_missing", detail: detail.join("; ") || undefined });
  }
}
const by = (s: string) => results.filter((r) => r.status === s).length;
console.log(JSON.stringify({ sources: results.length, ok: by("ok"), fragment_missing: by("fragment_missing"), title_missing: by("title_missing"), unchecked: by("unchecked") }));
for (const r of results.filter((r) => r.status !== "ok")) console.log(`${r.status.padEnd(16)} ${r.id}  ${r.source}  ${r.detail ?? ""}`);

// ---- corpus-wide absence claims (U03, U04)
const fts = (q: string) => (db.query(`select p.title from pages_fts join pages p on p.id = pages_fts.rowid where pages_fts match ? order by bm25(pages_fts,10.0,1.0) limit 5`).all(q) as any[]).map((r) => r.title);
console.log("\nabsence checks");
for (const q of ['"hogwarts legacy"', '"heritage de poudlard"', '"hogwarts" AND "legacy"', 'dumbledore AND (gringotts OR gringott) AND coffre AND prive', '"coffre 713"']) {
  console.log(q.padEnd(60), JSON.stringify(fts(q)));
}
const like = (pat: string) => (db.query("select count(*) n from pages where plain like ? or wikitext like ?").get(pat, pat) as any).n;
console.log("pages mentioning 'Hogwarts Legacy':", like("%Hogwarts Legacy%"), " 'Héritage de Poudlard':", like("%Héritage de Poudlard%"));
