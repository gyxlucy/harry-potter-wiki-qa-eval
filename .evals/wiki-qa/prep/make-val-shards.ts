#!/usr/bin/env bun
/** Pack wiki.sqlite `plain` text into the val shards (data/pages-NN.txt, <1 MB each). Usage: bun make-val-shards.ts <wiki.sqlite> <outdir> */
import { Database } from "bun:sqlite";
const db = new Database(process.argv[2], { readonly: true });
const rows = db.query("select title, plain from pages order by id").all() as { title: string; plain: string }[];
const enc = new TextEncoder();
const chunks = rows.map((r) => `@@@@ PAGE: ${r.title}\n${r.plain}\n`);
const sizes = chunks.map((c) => enc.encode(c).length);
const total = sizes.reduce((a, b) => a + b, 0);
const LIMIT = 1_000_000;
const N = 15;
const shards: string[][] = [[]];
let cur = 0, acc = 0;
for (let i = 0; i < chunks.length; i++) {
  const target = (total / N) * shards.length;
  if (cur > 0 && (cur + sizes[i] > LIMIT || (acc + sizes[i] / 2 > target && shards.length < N))) { shards.push([]); cur = 0; }
  shards.at(-1)!.push(chunks[i]); cur += sizes[i]; acc += sizes[i];
}
console.log("shards", shards.length, "total", total);
for (const [i, s] of shards.entries()) {
  const t = s.join("");
  await Bun.write(`${process.argv[3]}/pages-${String(i + 1).padStart(2, "0")}.txt`, t);
  console.log(i + 1, s.length, enc.encode(t).length);
}
