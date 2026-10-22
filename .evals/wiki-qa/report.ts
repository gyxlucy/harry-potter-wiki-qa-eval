#!/usr/bin/env bun
/**
 * report.ts — build report.html and trajectory/scores.tsv from the finished variant dirs. Run only after run.ts exits.
 *   bun report.ts
 * Every string from rows (prompts, answers, judge text) goes through esc(); nothing is interpolated raw.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = import.meta.dir;
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const jl = (p: string) => (existsSync(p) ? readFileSync(p, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);
const mean = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const sd = (a: number[]) => { const m = mean(a); return a.length > 1 ? Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)) : 0; };
const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : NaN; };
const f = (x: number, d = 2) => (Number.isFinite(x) ? x.toFixed(d) : "–");

const state = JSON.parse(readFileSync(join(ROOT, "_state.json"), "utf8"));
const metrics: { id: string; label: string; better?: string }[] = state.metrics;
const variants = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(ROOT, d.name, "results.jsonl")))
  .map((d) => d.name)
  .sort((a, b) => (a === "baseline" ? -1 : b === "baseline" ? 1 : a.localeCompare(b, undefined, { numeric: true })));

type Row = any;
const out: string[] = [];
const tsv: Record<string, Record<string, number>> = {};
const tok = (r: Row) => (r.usage?.input_tokens ?? 0) + (r.usage?.output_tokens ?? 0);

for (const v of variants) {
  const rows: Row[] = jl(join(ROOT, v, "results.jsonl"));
  const errors: Row[] = jl(join(ROOT, v, "errors.jsonl"));
  const summary = existsSync(join(ROOT, v, "summary.json")) ? JSON.parse(readFileSync(join(ROOT, v, "summary.json"), "utf8")) : {};
  const ok = rows.filter((r) => r.status === "ok");
  const truncated = rows.length - ok.length;
  const ids = [...new Set(rows.map((r) => r.prompt_id))];
  const byCase = (id: string) => ok.filter((r) => r.prompt_id === id);
  const caseMean = (id: string, m: string) => mean(byCase(id).map((r) => r.grade[m]));
  for (const id of ids) (tsv[id] ??= {})[v] = caseMean(id, "coverage");

  out.push(`<h2>${esc(v)}</h2><p>${esc(summary.description ?? "")}</p>`);
  out.push(`<p>${ids.length} cases, ${rows.length} graded rows (${truncated} truncated, left out of means), <b>${errors.length} errors</b> in errors.jsonl. Agent model: <code>${esc(rows[0]?.model)}</code>; judge: <code>${esc(rows[0]?.judge_model)}</code>. Cost: not measured.</p>`);

  // headline + side metrics, with a case-clustered 95% CI
  out.push(`<table><tr><th>metric</th><th>mean</th><th>95% CI (over cases)</th><th>better</th></tr>`);
  for (const m of metrics) {
    const per = ids.map((id) => caseMean(id, m.id)).filter(Number.isFinite);
    const mu = mean(per), hw = per.length > 1 ? 1.96 * sd(per) / Math.sqrt(per.length) : NaN;
    out.push(`<tr><td>${esc(m.label)}${m.id === "coverage" ? " (headline)" : ""}</td><td>${f(mu, 3)}</td><td>±${f(hw, 3)}</td><td>${m.better ?? "higher"}</td></tr>`);
  }
  out.push(`</table>`);

  // inter-rep consistency of the headline
  const within = ids.map((id) => sd(byCase(id).map((r) => r.grade.coverage)));
  const flips = ids.filter((id) => { const c = byCase(id).map((r) => r.grade.coverage); return c.length > 1 && Math.max(...c) - Math.min(...c) >= 0.5; }).length;
  out.push(`<p>Rep noise on coverage: mean within-case SD ${f(mean(within), 3)}; ${flips}/${ids.length} cases differ by ≥0.5 between reps.</p>`);

  // by tag
  const tags = [...new Set(rows.map((r) => r.tags[0]))];
  out.push(`<table><tr><th>tag</th><th>cases</th>${metrics.map((m) => `<th>${esc(m.label)}</th>`).join("")}</tr>`);
  for (const t of tags) {
    const tids = ids.filter((id) => rows.find((r) => r.prompt_id === id)?.tags[0] === t);
    out.push(`<tr><td>${esc(t)}</td><td>${tids.length}</td>${metrics.map((m) => `<td>${f(mean(tids.map((id) => caseMean(id, m.id)).filter(Number.isFinite)), 2)}</td>`).join("")}</tr>`);
  }
  out.push(`</table>`);

  // perf (absolute numbers)
  const lat = ok.map((r) => r.latency_s), tk = ok.map(tok), st = ok.map((r) => r.meta?.steps ?? 0), tc = ok.map((r) => r.tool_calls ?? 0);
  const stat = (a: number[], d = 1) => `${f(Math.min(...a), d)} / ${f(median(a), d)} / ${f(Math.max(...a), d)} (mean ${f(mean(a), d)})`;
  out.push(`<table><tr><th>per run</th><th>min / median / max</th></tr>
<tr><td>latency (s)</td><td>${stat(lat)}</td></tr>
<tr><td>agent tokens (in+out)</td><td>${stat(tk, 0)}</td></tr>
<tr><td>steps</td><td>${stat(st, 0)}</td></tr>
<tr><td>tool calls</td><td>${stat(tc, 0)}</td></tr></table>`);
  const toolErr = ok.reduce((s, r) => s + (r.meta?.tool_errors ?? 0), 0);
  const outside = ok.filter((r) => (r.meta?.outside_fetches ?? []).length);
  out.push(`<p>Tool errors across runs: ${toolErr}. Runs with a fetch outside the wiki API or a non-bash/readFile tool: ${outside.length}${outside.length ? " (" + outside.map((r) => esc(r.prompt_id + "#" + r.rep)).join(", ") + ")" : ""}.</p>`);

  if (errors.length) {
    const cls: Record<string, number> = {};
    for (const e of errors) cls[e.failure_class] = (cls[e.failure_class] ?? 0) + 1;
    out.push(`<p>Errors by class: ${Object.entries(cls).map(([k, n]) => `${esc(k)}=${n}`).join(", ")}</p>`);
  }

  // per case
  out.push(`<h3>Cases</h3><table class="cases"><tr><th>id</th><th>tag</th><th>question</th><th>coverage per rep</th><th>fab</th><th>f.abst</th><th>cites</th><th>lang</th><th>fmt</th><th>lat s</th><th>tokens</th><th>steps</th><th>traces</th></tr>`);
  for (const id of ids) {
    const rs = byCase(id).sort((a, b) => a.rep - b.rep);
    const all = rows.filter((r) => r.prompt_id === id).sort((a, b) => a.rep - b.rep);
    const m = (k: string) => f(mean(rs.map((r) => r.grade[k])), 2);
    const r0 = all[0];
    out.push(`<tr><td>${esc(id)}</td><td>${esc(r0.tags[0])}</td><td>${esc(r0.prompt.slice(0, 80))}</td><td>${rs.map((r) => f(r.grade.coverage, 2)).join(" / ")}</td><td>${m("fabrication")}</td><td>${m("false_abstain")}</td><td>${m("cites_ok")}</td><td>${m("lang_ok")}</td><td>${m("format_ok")}</td><td>${f(mean(rs.map((r) => r.latency_s)), 1)}</td><td>${f(mean(rs.map(tok)), 0)}</td><td>${f(mean(rs.map((r) => r.meta?.steps ?? 0)), 1)}</td><td>${all.map((r) => `<a href="${esc(v)}/traces/${esc(id)}_rep${r.rep}.json">${r.rep}</a>`).join(" ")}</td></tr>`);
    out.push(`<tr class="d"><td colspan="13"><details><summary>answers and judge reasoning</summary>${all.map((r) => `<div class="rep"><b>rep ${r.rep}</b> (${esc(r.status)}) — <i>${esc(r.prompt)}</i><pre>${esc(r.meta?.answer)}\nSources: ${esc((r.meta?.sources ?? []).join(" ; "))}</pre><pre>${esc(Object.entries(r.explanation ?? {}).map(([k, x]) => `${k}: ${x}`).join("\n"))}</pre></div>`).join("")}</details></td></tr>`);
  }
  out.push(`</table>`);
}

const html = `<!doctype html><meta charset="utf-8"><title>wiki-qa eval</title><style>
body{font:14px/1.45 system-ui,sans-serif;max-width:1200px;margin:24px auto;padding:0 16px}table{border-collapse:collapse;margin:8px 0}
td,th{border:1px solid #ccc;padding:3px 8px;text-align:left;vertical-align:top}th{background:#f3f3f3}pre{white-space:pre-wrap;background:#f8f8f8;padding:6px;margin:4px 0}
tr.d td{border-top:0}code{background:#f0f0f0;padding:0 3px}.rep{border-top:1px dashed #ccc;margin-top:6px}
</style><h1>wiki-qa eval</h1>
<p>Headline: key-point <b>coverage</b> (covered 1, partial 0.5, missing/contradicted 0), judged by claude-sonnet-5. The other metrics are reported separately and never folded into it. Gold is Claude-written from wiki text, script-checked against the snapshot, not human-verified (E01–E03 are user-written). See <code>metrics.md</code>.</p>
${out.join("\n")}`;
writeFileSync(join(ROOT, "report.html"), html);
mkdirSync(join(ROOT, "trajectory"), { recursive: true });
writeFileSync(join(ROOT, "trajectory/scores.tsv"), ["prompt_id\t" + variants.join("\t"), ...Object.entries(tsv).map(([id, o]) => id + "\t" + variants.map((v) => f(o[v], 3)).join("\t"))].join("\n") + "\n");
console.log(`wrote report.html for ${variants.join(", ")}`);
