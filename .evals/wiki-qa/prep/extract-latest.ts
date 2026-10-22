#!/usr/bin/env bun
/**
 * extract-latest.ts — stream the full-history MediaWiki XML dump and keep, for every
 * mainspace (ns=0) page, only the most recent revision. Redirects become
 * { id, title, redirect_to } rows.
 *
 *   bun extract-latest.ts <history.xml> <out.jsonl>
 *
 * Article row: { id, title, rev_id, timestamp, bytes, text }
 * No model calls; the output is derived data and is gitignored.
 */
import { createReadStream, writeFileSync, appendFileSync } from "node:fs";

const [src, out] = process.argv.slice(2);
if (!src || !out) throw new Error("usage: bun extract-latest.ts <history.xml> <out.jsonl>");

const decode = (s: string) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
const tag = (s: string, name: string) => {
  const m = s.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? m[1] : "";
};

writeFileSync(out, "");
let buf = "";
let pages = 0, kept = 0, redirects = 0, other = 0;
const flush = (page: string) => {
  pages++;
  const ns = tag(page, "ns").trim();
  if (ns !== "0") { other++; return; }
  const revs = page.match(/<revision>[\s\S]*?<\/revision>/g);
  if (!revs?.length) return;
  // pick the newest by timestamp (dump order is ascending but do not rely on it)
  let best = revs[0], bestTs = tag(best, "timestamp");
  for (const r of revs) { const ts = tag(r, "timestamp"); if (ts > bestTs) { best = r; bestTs = ts; } }
  const text = decode(tag(best, "text"));
  const rd = text.match(/^\s*#(?:REDIRECTION|REDIRECT)\s*:?\s*\[\[([^\]|#]+)/i);
  if (rd) {
    redirects++;
    appendFileSync(out, JSON.stringify({ id: Number(tag(page, "id").trim()), title: decode(tag(page, "title")), redirect_to: rd[1].trim() }) + "\n");
    return;
  }
  if (!text.trim()) return;
  kept++;
  appendFileSync(out, JSON.stringify({
    id: Number(tag(page, "id").trim()),
    title: decode(tag(page, "title")),
    rev_id: Number(tag(best, "id").trim()),
    timestamp: bestTs,
    bytes: Buffer.byteLength(text),
    text,
  }) + "\n");
};

const stream = createReadStream(src, { encoding: "utf8", highWaterMark: 1 << 24 });
for await (const chunk of stream) {
  buf += chunk;
  let end;
  while ((end = buf.indexOf("</page>")) !== -1) {
    const start = buf.indexOf("<page>");
    if (start !== -1 && start < end) flush(buf.slice(start, end));
    buf = buf.slice(end + 7);
  }
}
console.log(JSON.stringify({ pages, kept, redirects, non_mainspace: other }));
