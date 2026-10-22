#!/usr/bin/env bun
/** Pilot: run the real wiki-qa agent as Cavia tasks on a few hand-picked questions. NOT the dataset. */
import { writeFileSync } from "node:fs";
import { loadAgent, runAgent } from "../run-agent.ts";

const model = process.argv[2];
if (!model) throw new Error("usage: bun pilot.ts <model>");
const only = process.argv[3]?.split(","); // optional: run only these case ids
const cases = [
  { id: "p1-single-fact", prompt: "Quel est le Patronus d'Hermione Granger ?", gold: "Loutre" },
  { id: "p2-multi-hop", prompt: "Quel est le Patronus de l'époux d'Hermione Granger ?", gold: "Jack Russell terrier" },
  { id: "p3-unanswerable", prompt: "Quelle est la couleur du pyjama préféré de Severus Rogue ?", gold: "Not found" },
].filter((c) => !only || only.some((o) => c.id.startsWith(o)));
const agent = loadAgent("../../../agents/wiki-qa");
const t0 = Date.now();
const runs = await Promise.all(cases.map(async (c) => {
  const s = Date.now();
  const r = await runAgent(agent, model, c.prompt, 600_000);
  return { ...c, latency_s: (Date.now() - s) / 1000, ...r };
}));
for (const r of runs) writeFileSync(`${r.id}${process.env.PILOT_SUFFIX ?? ""}.run.json`, JSON.stringify(r, null, 2));
console.log(JSON.stringify({ wall_s: (Date.now() - t0) / 1000, runs: runs.map(({ transcript, ...r }) => ({ ...r, steps: transcript.length })) }, null, 2));
process.exit(0);
