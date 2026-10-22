#!/usr/bin/env bun
/** Live judge sanity check (paid, ~10 judge calls): oracle answers should score ~1, null answers 0.
 *  bun grade/oracle-null.ts > grade/oracle-null.out.json */
import { readFileSync } from "node:fs";
import { anthropicClient } from "./anthropic.ts";
import { gradeRun } from "./grade.ts";

const cases: any[] = readFileSync(new URL("../cases.jsonl", import.meta.url), "utf8").trim().split("\n").map((l) => JSON.parse(l));
const by = (id: string) => cases.find((c) => c.prompt_id === id)!;
const kp = (id: string) => by(id).expected.key_points.map((k: any) => `- ${k.text}`).join("\n");
const client = anthropicClient();
const rows: any[] = [];
const go = async (id: string, kind: string, answer: string) => {
  const r = await gradeRun(client, by(id), { output: answer, passages: "", retrievedTitles: [] });
  rows.push({ id, kind, answer: answer.slice(0, 60), ...(r.ok ? { ...r.grade, judge_model: r.judge_model, usage: r.judge_usage } : r) });
};
await Promise.all([
  ...["E07", "F04", "U03"].map((id) => go(id, "oracle", `Answer: ${kp(id)}\nSources: none`)),
  go("E07", "null:empty", ""), go("E07", "null:dont-know", "Answer: 我不知道。\nSources: none"), go("E07", "null:wrong-question", `Answer: ${kp("E01")}\nSources: none`),
  go("F04", "null:empty", ""), go("F04", "null:dont-know", "Answer: 我不知道。\nSources: none"), go("F04", "null:wrong-question", `Answer: ${kp("F05")}\nSources: none`),
  go("U03", "null:wrong-question", `Answer: ${kp("F05")}\nSources: none`),
]);
rows.sort((a, b) => a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id));
const tokens = rows.reduce((a, r) => a + (r.usage?.input_tokens ?? 0) + (r.usage?.output_tokens ?? 0), 0);
console.log(JSON.stringify({ judge_calls: rows.length, judge_tokens: tokens, rows }, null, 1));
