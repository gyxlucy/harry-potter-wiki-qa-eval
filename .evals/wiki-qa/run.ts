#!/usr/bin/env bun
/**
 * run.ts — run the wiki-qa agent on every case as real Cavia tasks, grade each run, write the flow tree.
 *
 *   bun run.ts --variant baseline --model bright-rain --reps 3 [--concurrency 6] [--timeout-s 600] [--cases E01,F02] [--dry]
 *
 * Layout written under .evals/wiki-qa/<variant>/ (see eval-hillclimb.md Step 3):
 *   results.jsonl   one row per (case, rep) that produced a gradable run; appended as each finishes
 *   errors.jsonl    attempts with NO scorable result (infra error, timeout, judge failure ...). Never scored as 0.
 *   traces/<id>_rep<k>.json   verbatim conversation as {role, content, thinking?, name?} turns
 *   raw/<id>_rep<k>.json      the Cavia UIMessage transcript + task facts; lets a failed grade be retried without re-running the agent
 *   summary.json, progress.txt
 * Resume is idempotent at (case, rep): rows already in results.jsonl are skipped; a saved raw run with a missing
 * row is re-graded, not re-run.
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { loadAgent, runAgent } from "./run-agent.ts";
import { anthropicClient } from "./grade/anthropic.ts";
import { gradeRun, type Case } from "./grade/grade.ts";
import { extractRun, stripThink } from "./grade/transcript.ts";

const ROOT = import.meta.dir;
const AGENT_DIR = join(ROOT, "../../agents/wiki-qa");
const JUDGE_MODEL = "claude-sonnet-5";

const args = new Map<string, string>();
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith("--")) args.set(a.slice(2), process.argv[i + 1]?.startsWith("--") || process.argv[i + 1] === undefined ? "1" : process.argv[++i]);
}
const variant = args.get("variant") ?? "baseline";
const model = args.get("model") ?? "";
const reps = Number(args.get("reps") ?? 3);
const concurrency = Number(args.get("concurrency") ?? 6);
const timeoutS = Number(args.get("timeout-s") ?? 600);
const only = args.get("cases")?.split(",");
const casesFile = args.get("cases-file") ?? "cases.jsonl";
if (!model) throw new Error("--model is required (the Cavia model, e.g. bright-rain)");

const sha = (s: string | Buffer) => createHash("sha256").update(s).digest("hex");
const cases: Case[] = readFileSync(join(ROOT, casesFile), "utf8").trim().split("\n").map((l) => JSON.parse(l));
const selected = cases.filter((c) => !only || only.includes(c.prompt_id));
const agent = loadAgent(AGENT_DIR) as any;
const systemPrompt: string = agent.system_prompt;

const dir = join(ROOT, variant);
for (const d of ["traces", "raw"]) mkdirSync(join(dir, d), { recursive: true });
const resultsPath = join(dir, "results.jsonl");
const errorsPath = join(dir, "errors.jsonl");

// ---- environment fingerprint: refuse to mix rows from different setups in one variant ----
const read = (p: string) => readFileSync(join(ROOT, p));
const fingerprint = {
  model, judge_model: JUDGE_MODEL,
  system_prompt_sha: sha(systemPrompt),
  request_json_sha: sha(readFileSync(join(AGENT_DIR, "request.json"))),
  skill_digests: (agent.skills ?? []).map((s: any) => s.digest ?? null),
  cases_file: casesFile, cases_sha: sha(read(casesFile)),
  grader_sha: sha(["grade/grade.ts", "grade/transcript.ts", "grade/anthropic.ts", "legacy/grader/judge.mjs"].map((p) => sha(read(p))).join("")),
  runner_sha: sha(read("run.ts")),
};
const statePath = join(ROOT, "_state.json");
const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : {};
state.fingerprints ??= {};
const prev = state.fingerprints[variant];
if (prev) {
  const diff = Object.keys(fingerprint).filter((k) => k !== "runner_sha" && JSON.stringify((prev as any)[k]) !== JSON.stringify((fingerprint as any)[k]));
  if (diff.length) { console.error(`fingerprint for variant "${variant}" changed (${diff.join(", ")}); use a new --variant`); process.exit(2); }
}
const nTotal = selected.length * reps;
if (args.has("dry")) { console.log(JSON.stringify({ variant, model, reps, cases: selected.length, runs: nTotal, fingerprint }, null, 1)); process.exit(0); }
if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not set");

const metrics = [
  { id: "coverage", kind: "judge", label: "Coverage" },
  { id: "fabrication", kind: "judge", label: "Fabrication", better: "lower" },
  { id: "false_abstain", kind: "judge", label: "False abstain", better: "lower" },
  { id: "cites_ok", kind: "float", label: "Cites ok" },
  { id: "lang_ok", kind: "float", label: "Lang ok" },
  { id: "format_ok", kind: "float", label: "Format ok" },
];
Object.assign(state, {
  flow: "wiki-qa", current_round: Math.max(state.current_round ?? 0, 0), reps,
  no_split: true, train_ids: [], test_ids: [],
  goal: { target: "coverage", direction: "higher", hold: ["fabrication", "false_abstain", "cites_ok", "lang_ok"] },
  harness_paths: ["run.ts", "run-agent.ts", "grade/grade.ts", "grade/transcript.ts", "grade/anthropic.ts", "legacy/grader/judge.mjs", "cases.jsonl"],
  metrics, perf_fields: [{ id: "latency_s", label: "Latency", unit: "s" }],
  cost: "not measured (no approved pricing function)",
});
state.fingerprints[variant] = fingerprint;
writeFileSync(statePath, JSON.stringify(state, null, 2));
if (!existsSync(join(dir, "summary.json"))) {
  writeFileSync(join(dir, "summary.json"), JSON.stringify({ description: variant === "baseline" ? "Unmodified wiki-qa agent (system-prompt.md + harry-potter-wiki skill)" : variant, target: "system_prompt" }, null, 2));
}

// ---- helpers ----
const jl = (p: string) => (existsSync(p) ? readFileSync(p, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);
const done = new Set(jl(resultsPath).map((r) => `${r.prompt_id}#${r.rep}`));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const key = (id: string, rep: number) => `${id}_rep${rep}`;
const logErr = (o: object) => appendFileSync(errorsPath, JSON.stringify({ ts: new Date().toISOString(), variant, model, ...o }) + "\n");

/** UIMessage[] -> the report's {role, content, thinking?, name?} turns. */
function toTurns(prompt: string, transcript: any[]) {
  const turns: any[] = [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }];
  for (const m of transcript) {
    if (m.role !== "assistant") continue;
    for (const p of m.parts ?? []) {
      if (p.type === "text" && p.text) {
        const thinking = [...p.text.matchAll(/<think>([\s\S]*?)(?:<\/think>|$)/g)].map((x) => x[1].trim()).join("\n");
        turns.push({ role: "assistant", content: stripThink(p.text), ...(thinking ? { thinking } : {}) });
      } else if (typeof p.type === "string" && (p.type.startsWith("tool-") || p.type === "dynamic-tool")) {
        const name = String(p.toolName ?? p.type.replace(/^tool-/, ""));
        turns.push({ role: "tool_call", name, content: JSON.stringify(p.input ?? {}) });
        const out = p.output;
        const text = typeof out === "string" ? out : JSON.stringify(out ?? p.errorText ?? "");
        turns.push({ role: "tool_result", name, content: text.length > 20_000 ? text.slice(0, 20_000) + `\n…[truncated ${text.length - 20_000} chars in this trace; full output in raw/]` : text });
      }
    }
  }
  return turns;
}

const judge = anthropicClient();

async function grade(c: Case, rep: number, raw: any) {
  const id = c.prompt_id;
  const facts = extractRun(raw.transcript);
  const g = await gradeRun(judge, c, facts, { model: JUDGE_MODEL });
  if (!g.ok) { logErr({ prompt_id: id, rep, task_id: raw.task_id, failure_class: g.failure_class, message: g.message, judge_model: g.judge_model, judge_usage: g.judge_usage, stage: "grade" }); return false; }
  const u = raw.usage ?? {};
  const row = {
    prompt_id: id, rep, prompt: c.prompt, tags: c.tags,
    status: /length|max/i.test(String(raw.stop_reason)) ? "truncated" : "ok",
    stop_reason: raw.stop_reason,
    grade: g.grade, explanation: g.explanation,
    model: raw.model, judge_model: g.judge_model, judge_usage: g.judge_usage,
    task_id: raw.task_id, latency_s: raw.latency_s,
    tool_calls: facts.tool_calls,
    usage: { input_tokens: u.input_tokens, output_tokens: u.output_tokens, ...(u.cached_tokens ? { cache_read_input_tokens: u.cached_tokens } : {}) },
    meta: {
      steps: facts.steps, tool_errors: facts.tool_errors, outside_fetches: facts.outside_fetches,
      origin: (c as any).origin, retrieved_titles: facts.retrievedTitles.length, empty_output: facts.output.length === 0,
      answer: g.reply.answer, sources: g.reply.sources, has_think: g.reply.has_think,
    },
  };
  appendFileSync(resultsPath, JSON.stringify(row) + "\n");
  done.add(`${id}#${rep}`);
  return true;
}

async function attempt(c: Case, rep: number) {
  const id = c.prompt_id, k = key(id, rep), rawPath = join(dir, "raw", `${k}.json`);
  if (existsSync(rawPath)) { await grade(c, rep, JSON.parse(readFileSync(rawPath, "utf8"))); return; } // re-grade only
  for (let tryNo = 1; tryNo <= 3; tryNo++) {
    const t0 = Date.now();
    let r: Awaited<ReturnType<typeof runAgent>>;
    try {
      r = await Promise.race([
        runAgent(agent, model, c.prompt, timeoutS * 1000),
        sleep((timeoutS + 60) * 1000).then(() => { throw new Error("hard ceiling exceeded"); }),
      ]);
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      const transient = /HTTP (429|5\d\d)|fetch failed|ECONN|ETIMEDOUT|network|socket/i.test(msg);
      if (transient && tryNo < 3) { await sleep(2000 * 2 ** tryNo * (0.5 + Math.random())); continue; }
      logErr({ prompt_id: id, rep, failure_class: /hard ceiling/.test(msg) ? "timeout" : "harness_error", attempt: tryNo, message: msg, stage: "run" });
      return;
    }
    const latency_s = (Date.now() - t0) / 1000;
    if (r.error === "timeout") { logErr({ prompt_id: id, rep, task_id: r.task_id, failure_class: "timeout", attempt: tryNo, latency_s, usage: r.usage, stage: "run" }); return; }
    if (r.error) {
      const transient = /429|5\d\d|overloaded|rate.?limit|timed? ?out/i.test(r.error);
      logErr({ prompt_id: id, rep, task_id: r.task_id, failure_class: "task_error", attempt: tryNo, message: r.error, latency_s, usage: r.usage, stage: "run" });
      if (transient && tryNo < 3) { await sleep(2000 * 2 ** tryNo * (0.5 + Math.random())); continue; }
      return;
    }
    if (!r.usage || !(r.usage.output_tokens > 0)) { logErr({ prompt_id: id, rep, task_id: r.task_id, failure_class: "usage_missing", attempt: tryNo, latency_s, usage: r.usage, stage: "run" }); return; }
    // A turn that ends with no final text (stop_reason "other" right after a tool result) is not a scorable answer:
    // log it with its billed usage, keep the transcript for inspection, and retry the slot.
    if (extractRun(r.transcript).output === "") {
      mkdirSync(join(dir, "raw-failed"), { recursive: true });
      writeFileSync(join(dir, "raw-failed", `${k}_try${tryNo}.json`), JSON.stringify({ task_id: r.task_id, stop_reason: r.stop_reason, usage: r.usage, transcript: r.transcript }));
      logErr({ prompt_id: id, rep, task_id: r.task_id, failure_class: "no_final_answer", attempt: tryNo, stop_reason: r.stop_reason, latency_s, usage: r.usage, stage: "run" });
      if (tryNo < 3) { await sleep(1000 * (0.5 + Math.random())); continue; }
      return;
    }
    const raw = { task_id: r.task_id, model: r.model, stop_reason: r.stop_reason, usage: r.usage, latency_s, prompt: c.prompt, transcript: r.transcript };
    writeFileSync(rawPath, JSON.stringify(raw));
    writeFileSync(join(dir, "traces", `${k}.json`), JSON.stringify(toTurns(c.prompt, r.transcript), null, 1));
    await grade(c, rep, raw);
    return;
  }
}

// ---- pool ----
const queue = selected.flatMap((c) => Array.from({ length: reps }, (_, rep) => ({ c, rep }))).filter(({ c, rep }) => !done.has(`${c.prompt_id}#${rep}`));
const startedAt = Date.now();
let finished = 0;
const todo = queue.length;
const tick = setInterval(() => {
  const el = (Date.now() - startedAt) / 1000;
  const left = finished ? Math.round((el / finished) * (todo - finished)) : "?";
  const errs = jl(errorsPath).length;
  const line = `${done.size}/${nTotal} rows, ${finished}/${todo} attempted this launch, ${errs} errors logged, ~${left}s left`;
  writeFileSync(join(dir, "progress.txt"), line + "\n");
  console.log(line);
}, 30_000);
async function worker() {
  for (let item = queue.shift(); item; item = queue.shift()) {
    try { await attempt(item.c, item.rep); } catch (e: any) { logErr({ prompt_id: item.c.prompt_id, rep: item.rep, failure_class: "runner_exception", message: String(e?.stack ?? e) }); }
    finished++;
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));
clearInterval(tick);
const rows = jl(resultsPath), errs = jl(errorsPath);
const line = `${rows.length}/${nTotal} rows, ${errs.length} errors logged, wall ${Math.round((Date.now() - startedAt) / 1000)}s`;
writeFileSync(join(dir, "progress.txt"), line + "\n");
console.log(line);
process.exit(rows.length === nTotal ? 0 : 1);
