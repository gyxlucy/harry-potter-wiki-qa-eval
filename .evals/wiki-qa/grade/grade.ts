/**
 * Grading adapter for wiki-qa. Wraps the legacy checklist judge (legacy/grader/judge.mjs) unchanged:
 * same prompt, schema, verdict scores, fabrication and false_abstain rules. Only the two programmatic checks
 * are adapted to this agent's reply format.
 *
 * Metrics per run (kept separate; only `coverage` is the headline):
 *   coverage       covered 1, partial 0.5, missing/contradicted 0, mean over key points   (higher better)
 *   fabrication    1 if the answer states specifics found in neither the passages nor the key points (lower better)
 *   false_abstain  1 if a case that HAS an answer is declined (always 0 on abstain cases)   (lower better)
 *   cites_ok       1 if every title in `Sources:` was retrieved (accent/case-insensitive) and at least one is cited unless declining / abstain case
 *   lang_ok        1 if the answer's language matches the question's language (CJK vs Latin)
 *   format_ok      side metric: reply is exactly `Answer: …` / `Sources: …` with no <think>
 */
// @ts-ignore legacy JS module, wrapped not rewritten
import { JUDGE_MODEL, judgeCase } from "../legacy/grader/judge.mjs";
import { type Reply, type RunFacts, nrm, parseReply } from "./transcript.ts";

export type Case = { prompt_id: string; prompt: string; tags: string[]; expected: { key_points: { text: string; source: string }[]; note?: string } };
export type Grade = { coverage: number; fabrication: number; false_abstain: number; cites_ok: number; lang_ok: number; format_ok: number };
export type GradeResult =
  | { ok: true; grade: Grade; explanation: Record<string, string>; reply: Reply; judge_model: string; judge_usage: unknown }
  | { ok: false; failure_class: string; message: string; judge_model?: string; judge_usage?: unknown };

const cjk = (s: string) => (s.match(/[一-鿿]/g) || []).length;
const latin = (s: string) => (s.match(/[A-Za-zÀ-ÿ]/g) || []).length;
const isCjkText = (s: string) => cjk(s) + latin(s) > 0 && cjk(s) / (cjk(s) + latin(s)) >= 0.5;

/** Answer language == question language. French/other glosses in parentheses and quoted titles are ignored. */
export function langMatches(prompt: string, answer: string): number {
  const prose = answer.replace(/[(（][^)）]*[)）]/g, "").replace(/[“"«][^”"»]*[”"»]/g, "");
  if (cjk(prose) + latin(prose) === 0) return 0;
  return isCjkText(prose) === isCjkText(prompt) ? 1 : 0;
}

/** The legacy cites_ok parses 【title】 and compares to retrieved titles exactly. Render `Sources:` that way, mapping
 *  each cited title to the retrieved title it matches ignoring accent and case. */
export function legacyShape(reply: Reply, retrievedTitles: string[]): string {
  const byNorm = new Map(retrievedTitles.map((t) => [nrm(t), t]));
  return reply.answer + (reply.sources.length ? "\n" + reply.sources.map((s) => `【${byNorm.get(nrm(s)) ?? s}】`).join("") : "");
}

export async function gradeRun(client: any, c: Case, run: Pick<RunFacts, "output" | "passages" | "retrievedTitles">, opts: { model?: string } = {}): Promise<GradeResult> {
  const reply = parseReply(run.output);
  const model = opts.model ?? JUDGE_MODEL;
  try {
    const out = await judgeCase(
      client, c,
      { output: legacyShape(reply, run.retrievedTitles), passages: run.passages, retrievedTitles: run.retrievedTitles },
      { model },
    );
    if (!String(out.judge_model).startsWith(model)) {
      return { ok: false, failure_class: "judge_model_mismatch", message: `asked ${model}, served ${out.judge_model}`, judge_model: out.judge_model, judge_usage: out.judge_usage };
    }
    const grade: Grade = { ...out.grade, lang_ok: langMatches(c.prompt, reply.answer), format_ok: reply.format_ok ? 1 : 0 };
    return { ok: true, grade, explanation: out.explanation, reply, judge_model: out.judge_model, judge_usage: out.judge_usage };
  } catch (e: any) {
    return { ok: false, failure_class: e.failure_class ?? "judge_error", message: String(e.message ?? e), judge_model: e.judge_model, judge_usage: e.judge_usage };
  }
}
