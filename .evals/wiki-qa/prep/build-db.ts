#!/usr/bin/env bun
/**
 * build-db.ts — turn articles.jsonl (from extract-latest.ts) into a SQLite file the
 * agent queries from its sandbox.
 *
 *   bun build-db.ts <articles.jsonl> <out.sqlite>
 *
 * Schema
 *   pages(id, title, rev_id, timestamp, wikitext, plain)   latest revision of every article
 *   redirects(title, target)                               #REDIRECTION pages
 *   pages_fts  FTS5 over (title, plain), accent-insensitive, contentless-linked to pages by rowid
 *   meta(key, value)                                       snapshot provenance
 *
 * `wikitext` is the raw page (infobox fields like Patronus, Naissance live here);
 * `plain` is a deterministic, lossy cleanup for reading and full-text search.
 */
import { Database } from "bun:sqlite";
import { existsSync, readFileSync, rmSync } from "node:fs";

const [src, out] = process.argv.slice(2);
if (!src || !out) throw new Error("usage: bun build-db.ts <articles.jsonl> <out.sqlite>");

/** Lossy wikitext -> text. Keeps infobox `|Key=value` lines (as `Key: value`) because they hold the facts. */
export function toPlain(w: string): string {
  let t = w;
  t = t.replace(/<!--[\s\S]*?-->/g, "");
  t = t.replace(/<ref[^>/]*\/>/g, "").replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, "");
  t = t.replace(/<\/?(?:br|small|big|center|div|span|sup|sub|u|s|nowiki|gallery|poem|noinclude|includeonly|onlyinclude)[^>]*>/gi, " ");
  t = t.replace(/\[\[(?:Fichier|File|Image|Catégorie|Category):[^\]]*(?:\[\[[^\]]*\]\][^\]]*)*\]\]/gi, "");
  // unwrap templates with no useful payload; keep text of simple ones
  // {{Comment|x}} carries facts (who coined a nickname, "maître seulement"): keep it as " (x)".
  for (let i = 0; i < 4; i++) t = t.replace(/\{\{Comment\s*\|([^{}]*)\}\}/gi, (_m, c) => ` (${c.trim()})`);
  for (let i = 0; i < 4; i++) t = t.replace(/\{\{(?:Référence|Eng|Chap|Ébauche|Cite|Réf)[^{}]*\}\}/gi, "");
  t = t.replace(/\{\{Infobox[^|\n}]*/gi, "[Infobox]");
  t = t.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2").replace(/\[\[([^\]]+)\]\]/g, "$1");
  t = t.replace(/\[(?:https?:\/\/\S+)\s+([^\]]+)\]/g, "$1").replace(/\[https?:\/\/\S+\]/g, "");
  t = t.replace(/'{2,5}/g, "");
  t = t.replace(/^\|[ \t]*([^=|\n]+?)[ \t]*=[ \t]*/gm, "$1: ");
  t = t.replace(/^(={2,6})\s*(.*?)\s*\1\s*$/gm, (_m, _e, h) => `\n## ${h}`);
  t = t.replace(/^[*#:;]+\s*/gm, "- ");
  t = t.replace(/\{\{|\}\}|\{\||\|\}|^\|-.*$/gm, "");
  t = t.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n");
  return t.trim();
}

if (import.meta.main) {
  if (existsSync(out)) rmSync(out);
  const db = new Database(out);
  db.run("PRAGMA journal_mode = OFF");
  db.run(`CREATE TABLE pages (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE, rev_id INTEGER, timestamp TEXT, wikitext TEXT NOT NULL, plain TEXT NOT NULL)`);
  db.run(`CREATE TABLE redirects (title TEXT PRIMARY KEY, target TEXT NOT NULL)`);
  db.run(`CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT)`);
  const insPage = db.prepare("INSERT INTO pages (id, title, rev_id, timestamp, wikitext, plain) VALUES (?,?,?,?,?,?)");
  const insRd = db.prepare("INSERT OR IGNORE INTO redirects (title, target) VALUES (?,?)");

  // The dump can export a page more than once (e.g. across API batches): keep the newest per id/title.
  const byId = new Map<number, any>();
  const redirectRows: any[] = [];
  let dupes = 0;
  for (const line of readFileSync(src, "utf8").split("\n")) {
    if (!line) continue;
    const r = JSON.parse(line);
    if (r.redirect_to) { redirectRows.push(r); continue; }
    const prev = byId.get(r.id);
    if (prev) dupes++;
    if (!prev || r.timestamp > prev.timestamp) byId.set(r.id, r);
  }
  const seenTitles = new Set<string>();
  let pages = 0, redirects = 0;
  db.transaction(() => {
    for (const r of [...byId.values()].sort((a, b) => a.id - b.id)) {
      if (seenTitles.has(r.title)) { dupes++; continue; }
      seenTitles.add(r.title);
      insPage.run(r.id, r.title, r.rev_id, r.timestamp, r.text, toPlain(r.text));
      pages++;
    }
    for (const r of redirectRows) { if (!seenTitles.has(r.title)) { insRd.run(r.title, r.redirect_to); redirects++; } }
  })();
  console.error(`dupes dropped: ${dupes}`);

  db.run(`CREATE VIRTUAL TABLE pages_fts USING fts5(title, plain, content='pages', content_rowid='id', tokenize='unicode61 remove_diacritics 2')`);
  db.run(`INSERT INTO pages_fts(rowid, title, plain) SELECT id, title, plain FROM pages`);
  db.run(`INSERT INTO pages_fts(pages_fts) VALUES('optimize')`);
  const ins = db.prepare("INSERT INTO meta VALUES (?,?)");
  ins.run("source", "harrypotterfandomcom_fr-20200215-history.xml (latest revision per mainspace page)");
  ins.run("wiki", "Wiki Harry Potter (French), harrypotter.fandom.com/fr");
  ins.run("snapshot_date", "2020-02-15");
  ins.run("pages", String(pages));
  ins.run("redirects", String(redirects));
  db.run("VACUUM");
  db.close();
  console.log(JSON.stringify({ out, pages, redirects }));
}
