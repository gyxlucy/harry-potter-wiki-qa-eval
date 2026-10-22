// Retrieval over the French Harry Potter wiki (latest revision of each main-namespace page).
// No dependencies: wikitext cleaning, ~2000-char chunking, BM25 over chunks, and a title lookup
// so that "which page is this about" questions get the page's infobox + intro even when the
// keywords are spread thin.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_ARTICLES = join(HERE, '..', 'data', 'articles.jsonl');

const STOP = new Set(('le la les l de des du d un une et en au aux a à il elle ils elles que qui quoi dans pour par sur sous est sont ' +
  'son sa ses se s ne pas plus ou ce cet cette ces leur leurs lui y qu avec sans tout tous être avoir fait comme mais ni on nous vous ' +
  'the of and in to is').split(/\s+/));

export function fold(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/œ/g, 'oe').replace(/æ/g, 'ae');
}
export function tokenize(s) {
  const out = [];
  for (const t of fold(s).split(/[^a-z0-9]+/)) {
    if (t.length < 2 || STOP.has(t)) continue;
    out.push(t.length > 4 && t.endsWith('s') ? t.slice(0, -1) : t);  // crude plural strip
  }
  return out;
}

// --- wikitext -> readable text ------------------------------------------------
export function cleanWikitext(raw) {
  let s = raw;
  s = s.replace(/<ref[^>/]*\/>/g, '').replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '');
  s = s.replace(/<!--[\s\S]*?-->/g, '').replace(/<\/?(?:noinclude|includeonly|onlyinclude|br|center|small|sup|sub|div|span)[^>]*>/gi, ' ');
  s = s.replace(/\[\[(?:Fichier|File|Image):[^\]]*\]\]/gi, '');
  s = s.replace(/^\s*(?:thumb|left|right|\d+px)\b.*$/gim, '');
  // templates, innermost first: {{Comment|x}} -> (x); everything else dropped
  for (let i = 0; i < 6; i++) {
    const before = s;
    s = s.replace(/\{\{(?:Comment|comment)\|([^{}|]*)\}\}/g, '($1)')
         .replace(/\{\{(?:Chap|HP|Référence|Eng|Citation|Dialogue[^|]*)\|?[^{}]*\}\}/g, '')
         .replace(/\{\{(?!Infobox)[^{}]*\}\}/g, '');
    if (s === before) break;
  }
  // infobox: "|Key=value" lines -> "Key: value"
  s = s.replace(/\{\{Infobox[^\n]*\n?/gi, 'Infobox\n').replace(/^\s*\|([^=\n|]+)=/gm, '$1: ').replace(/^\s*\}\}\s*$/gm, '');
  s = s.replace(/\|\s*([A-Za-zÀ-ÿ ()]+?)=/g, '\n$1: ');   // infobox fields that were run together on one line
  s = s.replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1').replace(/\[https?:[^\s\]]+\s*([^\]]*)\]/g, '$1');
  s = s.replace(/'{2,}/g, '').replace(/^\s*\[\[Catégorie:[^\]]*\]\]\s*$/gim, '').replace(/^[a-z]{2,3}(?:-[a-z]+)?:\S[^\n]*$/gm, '');   // interlanguage links ("en:10 August"); infobox lines have a space after the colon
  s = s.replace(/\{\{|\}\}/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n');
  return s.trim();
}

export function chunkText(text, target = 2000) {
  const paras = text.split(/\n\s*\n/);
  const chunks = [];
  let cur = '';
  for (const p of paras) {
    if (cur && cur.length + p.length > target) { chunks.push(cur.trim()); cur = ''; }
    if (p.length > target * 1.5) {            // very long paragraph/list: hard split on line ends
      for (const line of p.split('\n')) {
        if (cur && cur.length + line.length > target) { chunks.push(cur.trim()); cur = ''; }
        cur += line + '\n';
      }
      cur += '\n';
    } else cur += p + '\n\n';
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks;
}

// --- index ----------------------------------------------------------------------
export function buildIndex(articlesPath = DEFAULT_ARTICLES, { chunkSize = 2000 } = {}) {
  const docs = [];            // {title, n, text}
  const byTitle = new Map();  // folded title -> page idx list of chunk ids
  const df = new Map();
  const postings = new Map(); // term -> [[docId, tf], ...]
  let totalLen = 0;
  for (const line of readFileSync(articlesPath, 'utf8').split('\n')) {
    if (!line) continue;
    const a = JSON.parse(line);
    const chunks = chunkText(cleanWikitext(a.text), chunkSize);
    const ids = [];
    chunks.forEach((c, n) => {
      const id = docs.length;
      docs.push({ title: a.title, n, text: c });
      ids.push(id);
      // title tokens count 3x so the page a name belongs to outranks pages that merely mention it
      const toks = [...tokenize(a.title), ...tokenize(a.title), ...tokenize(a.title), ...tokenize(c)];
      totalLen += toks.length;
      docs[id].len = toks.length;
      const tf = new Map();
      for (const t of toks) tf.set(t, (tf.get(t) || 0) + 1);
      for (const [t, f] of tf) {
        let p = postings.get(t); if (!p) postings.set(t, p = []);
        p.push([id, f]);
        df.set(t, (df.get(t) || 0) + 1);
      }
    });
    byTitle.set(fold(a.title), ids);
  }
  return { docs, byTitle, df, postings, avgLen: totalLen / docs.length, N: docs.length };
}

export function bm25(index, queryTokens, k1 = 1.2, b = 0.75) {
  const scores = new Map();
  for (const t of new Set(queryTokens)) {
    const p = index.postings.get(t);
    if (!p) continue;
    const idf = Math.log(1 + (index.N - p.length + 0.5) / (p.length + 0.5));
    for (const [id, f] of p) {
      const len = index.docs[id].len;
      const s = idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * len / index.avgLen));
      scores.set(id, (scores.get(id) || 0) + s);
    }
  }
  return scores;
}

/**
 * retrieve(index, {titles, keywords}, {maxChunks, titleChunks, titleMode, withinK})
 *  - titles: page titles the question is probably about (exact folded match)
 *  - keywords: free-form French search strings (BM25 over all chunks)
 * titleMode 'first'  (original): a matched page contributes its first `titleChunks` chunks (infobox + intro).
 * titleMode 'within': a matched page contributes its first chunk (infobox) plus the `withinK` chunks of THAT page
 *                     that score best for the query, so evidence deep in a correctly identified page is found.
 * The remaining budget is filled by global BM25. Returns chunks [{title, n, text, via}] in display order.
 */
export function retrieve(index, { titles = [], keywords = [] }, { maxChunks = 12, titleChunks = 2, titleMode = 'first', withinK = 1, shortPage = 0, reserve = 0 } = {}) {
  const picked = [];
  const seen = new Set();
  const add = (id, via, limit = maxChunks) => { if (!seen.has(id) && picked.length < limit) { seen.add(id); picked.push({ ...index.docs[id], id, via }); } };
  const titleLimit = maxChunks - reserve;   // keep `reserve` slots for global BM25 hits so guessed pages cannot crowd them out
  const q = tokenize([...titles, ...keywords].join(' '));
  const scores = bm25(index, q);
  for (const t of titles) {
    const ids = index.byTitle.get(fold(t));
    if (!ids) continue;
    if (shortPage && ids.length <= shortPage) { ids.forEach(id => add(id, 'whole', titleLimit)); continue; }   // a short page is cheap to include whole
    if (titleMode === 'within') {
      add(ids[0], 'title', titleLimit);
      ids.slice(1).map(id => [id, scores.get(id) || 0]).filter(([, sc]) => sc > 0)
        .sort((a, b) => b[1] - a[1]).slice(0, withinK).forEach(([id]) => add(id, 'within', titleLimit));
    } else ids.slice(0, titleChunks).forEach(id => add(id, 'title', titleLimit));
  }
  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  for (const [id] of ranked) { if (picked.length >= maxChunks) break; add(id, 'bm25'); }
  return picked;
}

export function formatPassages(chunks) {
  return chunks.map((c, i) => `[P${i + 1}] 页面:${c.title}(第 ${c.n + 1} 段)\n${c.text}`).join('\n\n---\n\n');
}
