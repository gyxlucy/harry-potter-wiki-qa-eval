/** Turn a Cavia transcript (UIMessage[]) into what the grader and the run table need. Pure, no network. */

export const API_HOST = "lucygao--4fec7bbec93b11f1be841607ee4eb77e.web.val.run";

export const nrm = (s: string) =>
  s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[’‘`]/g, "'").replace(/\s+/g, " ").trim();

/** Remove reasoning text. An unclosed <think> swallows the rest, as a truncated reasoning block would. */
export function stripThink(s: string): string {
  return s.replace(/<think>[\s\S]*?<\/think>/g, "").replace(/<think>[\s\S]*$/, "").trim();
}

export type Reply = { answer: string; sources: string[]; format_ok: boolean; has_think: boolean };

/** Parse `Answer: … / Sources: A ; B`. Tolerant (Answer: optional, `Sources :` ok); `format_ok` records strict conformance. */
export function parseReply(raw: string): Reply {
  const has_think = /<think>/i.test(raw);
  const text = stripThink(raw);
  const m = text.match(/^(.*?)(?:\n|^)[ \t]*Sources?[ \t]*:[ \t]*([^\n]*)\s*$/is);
  const body = m ? m[1] : text;
  const sources = m ? m[2].split(/\s*;\s*/).map((s) => s.trim()).filter((s) => s && !/^(none|aucune?|无|没有)\.?$/i.test(s)) : [];
  const answer = body.replace(/^\s*Answer[ \t]*:[ \t]*/i, "").trim();
  const t = raw.trim();
  const format_ok = !has_think && /^Answer:/.test(t) && /\nSources: [^\n]+$/.test(t) && !!m;
  return { answer, sources, format_ok, has_think };
}

export type RunFacts = {
  output: string; // final assistant text (all text after the last tool call), raw
  passages: string; // tool output text the agent saw, for the fabrication check
  retrievedTitles: string[];
  steps: number;
  tool_calls: number;
  tool_errors: number;
  outside_fetches: string[]; // URLs not on the val API host, and non-bash/readFile tools used
};

const titleRe = /"title"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
const redirRe = /"redirected_from"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
const titlesArrRe = /"titles"\s*:\s*\[([\s\S]*?)\]/g;
const unq = (s: string) => { try { return JSON.parse(`"${s}"`) as string; } catch { return s; } };

export function titlesIn(stdout: string): string[] {
  const out = new Set<string>();
  for (const m of stdout.matchAll(titleRe)) out.add(unq(m[1]));
  for (const m of stdout.matchAll(titlesArrRe)) for (const t of m[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)) out.add(unq(t[1]));
  return [...out];
}

export function extractRun(transcript: any[], maxPassageChars = 150_000): RunFacts {
  const parts: any[] = transcript.filter((m) => m.role === "assistant").flatMap((m) => m.parts ?? []);
  const isTool = (p: any) => typeof p.type === "string" && (p.type.startsWith("tool-") || p.type === "dynamic-tool");
  const lastTool = parts.findLastIndex(isTool);
  const output = parts.slice(lastTool + 1).filter((p) => p.type === "text").map((p) => p.text).join("").trim();

  const titles = new Set<string>();
  const outside: string[] = [];
  let passages = "", calls = 0, errs = 0;
  for (const p of parts) {
    if (p.type === "step-start") continue;
    if (!isTool(p)) continue;
    calls++;
    const name = String(p.toolName ?? p.type.replace(/^tool-/, ""));
    const input = p.input ?? {};
    const out = p.output ?? {};
    if (p.state === "output-error" || (typeof out.exitCode === "number" && out.exitCode !== 0)) errs++;
    if (name !== "bash" && name !== "readFile") outside.push(`tool:${name}`);
    if (name === "bash") {
      for (const m of String(input.command ?? "").matchAll(/https?:\/\/[^\s"'\\)]+/g)) {
        try { if (new URL(m[0]).host !== API_HOST) outside.push(m[0]); } catch { outside.push(m[0]); }
      }
    }
    const text = typeof out === "string" ? out : (out.stdout ?? out.content ?? "");
    const isSkill = name === "readFile" && /SKILL\.md$/.test(String(input.path ?? ""));
    if (typeof text === "string" && text && !isSkill) {
      passages += `\n[${name} ${String(input.command ?? input.path ?? "").slice(0, 200)}]\n${text}\n`;
      if (name === "bash") {
        for (const t of titlesIn(text)) titles.add(t);
        for (const m of text.matchAll(redirRe)) titles.add(unq(m[1]));
      }
    }
  }
  const steps = parts.filter((p) => p.type === "step-start").length;
  return {
    output,
    passages: passages.slice(0, maxPassageChars),
    retrievedTitles: [...titles],
    steps, tool_calls: calls, tool_errors: errs, outside_fetches: outside,
  };
}
