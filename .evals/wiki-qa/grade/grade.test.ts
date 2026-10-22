/** Free tests: parsing, the adapted programmatic checks, and the judge wrapper with a mock client. `bun test grade/` */
import { expect, test } from "bun:test";
import { gradeRun, langMatches } from "./grade.ts";
import { extractRun, parseReply, stripThink, titlesIn } from "./transcript.ts";

const kase = (tags = ["explain"], n = 2): any => ({
  prompt_id: "T1", prompt: "伏地魔为什么杀不死哈利?", tags,
  expected: { key_points: Array.from({ length: n }, (_, i) => ({ text: `kp${i + 1}`, source: "x" })) },
});
const mock = (j: any, model = "claude-sonnet-5-20261001") => ({
  messages: { create: async () => ({ model, usage: { input_tokens: 10, output_tokens: 5 }, content: [{ type: "text", text: typeof j === "string" ? j : JSON.stringify(j) }] }) },
});
const verdicts = (...v: string[]) => ({ verdicts: v.map((verdict, i) => ({ index: i + 1, verdict, reason: "r" })), fabricated: false, fabricated_claims: [], declines_to_answer: false });
const run = (output: string, retrievedTitles = ["Ron Weasley", "Lily Potter"]) => ({ output, passages: "p", retrievedTitles });

test("stripThink removes closed and unclosed reasoning", () => {
  expect(stripThink("<think>a</think>Answer: x")).toBe("Answer: x");
  expect(stripThink("Answer: x<think>cut off")).toBe("Answer: x");
});

test("parseReply: strict, drifted, none", () => {
  const strict = parseReply("Answer: Une loutre.\nSources: Hermione Granger ; Ron Weasley");
  expect(strict).toMatchObject({ answer: "Une loutre.", sources: ["Hermione Granger", "Ron Weasley"], format_ok: true });
  const drift = parseReply("Le Patronus est une loutre.\n\nSources : Hermione Granger");
  expect(drift).toMatchObject({ answer: "Le Patronus est une loutre.", sources: ["Hermione Granger"], format_ok: false });
  expect(parseReply("<think>x</think>Answer: a\n\nSources: B")).toMatchObject({ answer: "a", sources: ["B"], format_ok: false, has_think: true });
  expect(parseReply("Answer: 资料中没有。\nSources: none")).toMatchObject({ sources: [], format_ok: true });
  expect(parseReply("")).toMatchObject({ answer: "", sources: [], format_ok: false });
});

test("langMatches follows the question language", () => {
  expect(langMatches("为什么?", "因为爱 (Lily Potter 的牺牲)")).toBe(1);
  expect(langMatches("为什么?", "Because of love.")).toBe(0);
  expect(langMatches("Pourquoi ?", "Parce que de l'amour.")).toBe(1);
  expect(langMatches("Pourquoi ?", "因为爱。")).toBe(0);
  expect(langMatches("为什么?", "")).toBe(0);
});

test("coverage is the mean of verdict scores", async () => {
  const r = await gradeRun(mock(verdicts("covered", "partial")), kase(), run("Answer: 因为爱。\nSources: Lily Potter"));
  expect(r.ok && r.grade.coverage).toBe(0.75);
  expect(r.ok && r.grade.cites_ok).toBe(1);
  expect(r.ok && r.grade.lang_ok).toBe(1);
  expect(r.ok && r.grade.format_ok).toBe(1);
});

test("cites_ok: accent/case-insensitive match passes, unretrieved title fails", async () => {
  const ok = await gradeRun(mock(verdicts("covered", "covered")), kase(), run("Answer: 好。\nSources: ron weasley"));
  expect(ok.ok && ok.grade.cites_ok).toBe(1);
  const bad = await gradeRun(mock(verdicts("covered", "covered")), kase(), run("Answer: 好。\nSources: Harry Potter (Wikipedia)"));
  expect(bad.ok && bad.grade.cites_ok).toBe(0);
  const none = await gradeRun(mock(verdicts("covered", "covered")), kase(), run("Answer: 好。\nSources: none"));
  expect(none.ok && none.grade.cites_ok).toBe(0); // answers without citing anything
});

test("abstain case: `Sources: none` is fine", async () => {
  const r = await gradeRun(mock(verdicts("covered")), kase(["abstain"], 1), run("Answer: 资料中没有。\nSources: none"));
  expect(r.ok && r.grade.cites_ok).toBe(1);
  expect(r.ok && r.grade.false_abstain).toBe(0);
});

test("judge failures are errors, not zeros", async () => {
  const bad = await gradeRun(mock("not json"), kase(), run("Answer: x\nSources: none"));
  expect(bad).toMatchObject({ ok: false, failure_class: "judge_parse" });
  const missing = await gradeRun(mock(verdicts("covered")), kase(), run("Answer: x\nSources: none")); // 2 key points, 1 verdict
  expect(missing).toMatchObject({ ok: false, failure_class: "judge_parse" });
  const wrong = await gradeRun(mock(verdicts("covered", "covered"), "claude-haiku-4"), kase(), run("Answer: x\nSources: none"));
  expect(wrong).toMatchObject({ ok: false, failure_class: "judge_model_mismatch" });
  const boom = await gradeRun({ messages: { create: async () => { throw Object.assign(new Error("429"), { failure_class: "judge_api" }); } } }, kase(), run("x"));
  expect(boom).toMatchObject({ ok: false, failure_class: "judge_api" });
});

test("titlesIn / extractRun on a synthetic transcript", () => {
  expect(titlesIn('{"results":[{"title":"A","snippet":"x"},{"title":"B é"}]}').sort()).toEqual(["A", "B é"]);
  expect(titlesIn('{"titles":["X","Y"]}').sort()).toEqual(["X", "Y"]);
  const bash = (command: string, stdout: string, exitCode = 0) => ({ type: "tool-bash", toolName: "bash", state: "output-available", input: { command }, output: { exitCode, stdout } });
  const t = [{ role: "user", parts: [{ type: "text", text: "q" }] }, { role: "assistant", parts: [
    { type: "step-start" }, { type: "text", text: "<think>t</think>interim" },
    { type: "tool-readFile", state: "output-available", input: { path: "/skills/harry-potter-wiki/SKILL.md" }, output: { content: "skill" } },
    bash('curl -s "https://lucygao--4fec7bbec93b11f1be841607ee4eb77e.web.val.run/page?title=Ron"', '{"title":"Ron Weasley","redirected_from":"Ron","text":"Patronus"}'),
    bash("curl -s https://example.com/x", "oops", 7),
    { type: "step-start" }, { type: "text", text: "<think>t</think>Answer: ok\nSources: Ron Weasley" },
  ] }];
  const r = extractRun(t);
  expect(r.output).toBe("<think>t</think>Answer: ok\nSources: Ron Weasley");
  expect(r.retrievedTitles.sort()).toEqual(["Ron", "Ron Weasley"]);
  expect(r).toMatchObject({ steps: 2, tool_calls: 3, tool_errors: 1, outside_fetches: ["https://example.com/x"] });
  expect(r.passages).not.toContain("skill");
});
