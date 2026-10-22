#!/usr/bin/env bun
/** Grade the saved pilot runs with the real grader (3 judge calls). Pilot gold is hand-written, not the dataset. */
import { anthropicClient } from "./anthropic.ts";
import { gradeRun } from "./grade.ts";
import { extractRun } from "./transcript.ts";

const pilots = [
  { file: "pilot/p1-single-fact.v2.run.json", kp: "Le Patronus d'Hermione Granger est la loutre." },
  { file: "pilot/p2-multi-hop.v2.run.json", kp: "L'époux d'Hermione Granger est Ron Weasley, dont le Patronus est un Jack Russell terrier." },
  { file: "pilot/p3-unanswerable.run.json", kp: "Doit dire que le wiki ne contient pas cette information (couleur du pyjama de Rogue)." },
];
const client = anthropicClient();
const out: any[] = [];
for (const p of pilots) {
  const r = await Bun.file(p.file).json();
  const facts = extractRun(r.transcript);
  const c: any = { prompt_id: r.id, prompt: r.prompt, tags: [r.id.includes("unanswerable") ? "abstain" : "fact"], expected: { key_points: [{ text: p.kp, source: "pilot" }] } };
  const g = await gradeRun(client, c, facts);
  out.push({ id: r.id, prompt: r.prompt, raw_output: facts.output, steps: facts.steps, tool_calls: facts.tool_calls, tool_errors: facts.tool_errors, outside_fetches: facts.outside_fetches, retrieved: facts.retrievedTitles.length, result: g });
}
await Bun.write("pilot/graded.json", JSON.stringify(out, null, 1));
for (const o of out) {
  const g: any = o.result;
  console.log(`\n## ${o.id}  ${o.prompt}\nraw: ${JSON.stringify(o.raw_output).slice(0, 300)}\ntools=${o.tool_calls} errs=${o.tool_errors} outside=${o.outside_fetches.length} retrieved_titles=${o.retrieved}`);
  console.log(g.ok ? `grade=${JSON.stringify(g.grade)}\nwhy: ${JSON.stringify(g.explanation)}\nparsed: ${JSON.stringify(g.reply)}` : `ERROR ${g.failure_class} ${g.message}`);
}
