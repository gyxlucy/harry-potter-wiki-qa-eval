/** Minimal Anthropic Messages client with the `client.messages.create(body)` shape the legacy judge expects.
 *  Reads ANTHROPIC_API_KEY from the environment only. Retries 429/5xx/529 with jittered backoff. */
export function anthropicClient(apiKey = process.env.ANTHROPIC_API_KEY, baseUrl = "https://api.anthropic.com") {
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  return {
    messages: {
      async create(body: unknown, tries = 5): Promise<any> {
        let last: Error | undefined;
        for (let i = 0; i < tries; i++) {
          let res: Response;
          try {
            res = await fetch(`${baseUrl}/v1/messages`, {
              method: "POST",
              headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
              body: JSON.stringify(body),
              signal: AbortSignal.timeout(180_000),
            });
          } catch (e) { last = e as Error; await sleep(i); continue; }
          if (res.ok) return res.json();
          const text = await res.text();
          last = Object.assign(new Error(`Anthropic HTTP ${res.status}: ${text.slice(0, 300)}`), { failure_class: "judge_api" });
          if (res.status !== 429 && res.status < 500) throw last;
          await sleep(i);
        }
        throw Object.assign(last ?? new Error("judge request failed"), { failure_class: "judge_api" });
      },
    },
  };
}
const sleep = (i: number) => new Promise((r) => setTimeout(r, 1000 * 2 ** i * (0.5 + Math.random())));
