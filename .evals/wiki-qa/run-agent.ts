#!/usr/bin/env bun
/**
 * run-agent.ts — reference: run one Cavia task until its first turn ends and
 * keep what Cavia keeps: the transcript, usage, stop reason, and error.
 *
 *   bun run-agent.ts agents/<name> <model> "<prompt>" > run.json      (or the prompt on stdin)
 *
 * An agent is a directory; the model and the prompt are per-run inputs:
 *   system-prompt.md   the system prompt
 *   skills/<name>/...  optional, local skill directories (each with SKILL.md), sent inline as { files }
 *   request.json       optional, more POST /v1/tasks fields, e.g. { "skills": [{ "url": "https://..." }], "env": { "VAR": "..." } }
 *
 * CAVIA_BASE_URL defaults to https://cavia.tabbyml.workers.dev. Needs the
 * `agents` package for the WebSocket client.
 *
 * API used:
 *   POST /v1/tasks                       → { task_id }; the turn runs in the background
 *   WS   /v1/tasks/:id                   → state { config, status, usage, last_error }, pushed on every change
 *   GET  /v1/tasks/:id/transcript        → UIMessage[], full history; saved for grading
 *   GET  /v1/tasks/:id/fs?path=...&raw=1 → a workspace file, when the agent's output is a file
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { AgentClient } from "agents/client";
import type { UIMessage } from "ai";

/** Each assistant message carries its usage and stop reason. */
type Message = UIMessage<{ stop_reason?: string; usage?: Record<string, number> }>;
/** `status` is "running" from creation until the turn is over; then `last_error` says whether it failed. */
type State = { status: "running" | "idle"; usage: Record<string, number>; last_error: { message: string } | null };

const base = new URL(process.env.CAVIA_BASE_URL ?? "https://cavia.tabbyml.workers.dev");

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(new URL(path, base), { headers: { "content-type": "application/json" }, ...init });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

export function loadAgent(dir: string): object {
  const request = join(dir, "request.json");
  const cfg = existsSync(request) ? JSON.parse(readFileSync(request, "utf8")) : {};
  const skillsDir = join(dir, "skills");
  const localSkills = existsSync(skillsDir)
    ? readdirSync(skillsDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => {
          const root = join(skillsDir, d.name);
          const files = Object.fromEntries(
            readdirSync(root, { withFileTypes: true, recursive: true })
              .filter((f) => f.isFile() && !f.name.startsWith("."))
              .map((f) => [
                join(f.parentPath, f.name).slice(root.length + 1).replaceAll("\\", "/"),
                readFileSync(join(f.parentPath, f.name), "utf8"),
              ]),
          );
          return { files };
        })
    : [];
  const skills = [...(cfg.skills ?? []), ...localSkills];
  return {
    ...cfg,
    system_prompt: readFileSync(join(dir, "system-prompt.md"), "utf8"),
    ...(skills.length ? { skills } : {}),
  };
}

export async function runAgent(agent: object, model: string, prompt: string, timeoutMs = 900_000) {
  const body = JSON.stringify({ ...agent, model, prompt });
  const { task_id } = await api<{ task_id: string }>("/v1/tasks", { method: "POST", body });
  const idle = Promise.withResolvers<false>();
  let state: State | undefined;
  const client = new AgentClient<State>({
    agent: "cavia-agent",
    basePath: `v1/tasks/${task_id}`,
    host: base.host,
    protocol: base.protocol === "https:" ? "wss" : "ws",
    onStateUpdate: (next) => {
      state = next;
      if (next.status === "idle") idle.resolve(false);
    },
  });
  // Local fix: Bun's WebSocket rejects partysocket's default binaryType "blob", which silently
  // breaks the connection (state updates never arrive, so every run looked like a timeout).
  client.binaryType = "arraybuffer";
  let timer: Timer | undefined;
  try {
    const timeout = new Promise<true>((resolve) => (timer = setTimeout(resolve, timeoutMs, true)));
    // On timeout the task keeps running server-side.
    const timedOut = await Promise.race([idle.promise, timeout]);
    const transcript = await api<Message[]>(`/v1/tasks/${task_id}/transcript`);
    return {
      task_id,
      model,
      stop_reason: transcript.findLast((m) => m.role === "assistant")?.metadata?.stop_reason ?? null,
      error: timedOut ? "timeout" : (state?.last_error?.message ?? null),
      usage: state?.usage, // task total; 0 can mean "not reported"
      transcript,
    };
  } finally {
    clearTimeout(timer);
    client.close();
  }
}

if (import.meta.main) {
  const [agentDir, model, arg] = process.argv.slice(2);
  // Read stdin only when no prompt argument was given and something is piped in.
  const prompt = arg ?? (process.stdin.isTTY ? "" : await Bun.stdin.text());
  if (!agentDir || !model || !prompt.trim()) {
    throw new Error("usage: bun run-agent.ts <agent-dir> <model> <prompt>   (or pipe the prompt on stdin)");
  }
  console.log(JSON.stringify(await runAgent(loadAgent(agentDir), model, prompt), null, 2));
  process.exit(0);
}
