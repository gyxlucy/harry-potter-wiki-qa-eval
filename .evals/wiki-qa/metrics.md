# wiki-qa metrics

Grader: legacy checklist judge (`legacy/grader/judge.mjs`, prompt in `legacy/rubric.md`) run on `claude-sonnet-5` through the Anthropic API, wrapped by `grade/grade.ts`. Judge failures go to `errors.jsonl`, never to a zero.

| id | meaning | better |
|---|---|---|
| `coverage` (headline) | Mean over the case's key points: covered 1, partial 0.5, missing or contradicted 0. | higher |
| `fabrication` | 1 if the answer states specific facts found in neither the retrieved passages nor the key points. | lower |
| `false_abstain` | 1 if a case that has an answer is answered with "the wiki doesn't say". Always 0 on abstain cases. | lower |
| `cites_ok` | 1 if every title in `Sources:` was actually retrieved (accent and case insensitive), and at least one is cited unless the answer declines or the case is an abstain case. | higher |
| `lang_ok` | 1 if the answer's language (Chinese or Latin script) matches the question's. | higher |
| `format_ok` | 1 if the reply starts with `Answer:`, ends with a `Sources: …` line and has no `<think>`. Side metric; it does not affect coverage. | higher |

Side metrics shown: latency per run (`latency_s`), tokens (in + out) and steps. Cost: not measured (no approved pricing function).

Dataset: 37 cases migrated from the Claude Desktop eval (16 explain, 15 fact, 6 abstain). No train/test split; scores are whole-set and directional. Gold provenance: Claude-written from wiki text, script-checked against the snapshot, not human-verified; E01–E03 are user-written.

Noise: the report shows a 95% CI over cases and the within-case SD across reps.
