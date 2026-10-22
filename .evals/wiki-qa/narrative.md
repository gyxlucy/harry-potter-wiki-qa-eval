# wiki-qa eval: baseline

| variant | change | cases × reps | coverage (95% CI over cases) | fabrication | false abstain | cites ok | lang ok | format ok | latency s (median / mean) | agent tokens/run (median) | errors | cost |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| baseline | none (bright-rain, system-prompt.md + harry-potter-wiki skill) | 37 × 3 = 111 | 0.794 ± 0.078 | 0.063 | 0.009 | 0.964 | 0.514 | 0.009 | 11.8 / 13.3 | 23,461 | 8 (`no_final_answer`) | not measured |

Directional only: no train/test split, gold is Claude-written and script-checked, not human-verified (E01–E03 are user-written).

Totals: agent tokens 3,630,744 (+18,691 billed on failed attempts); judge tokens 1,147,791.

By tag (coverage): explain 0.65, fact 0.90, abstain 0.92.

Rep noise: mean within-case SD of coverage 0.18 (see `report.html`).

Findings:
- All 37 prompts are Chinese. The agent answered in French on 54 of 111 runs (`lang_ok` 0.514), against the system prompt's "answer in the language of the question".
- `format_ok` is 0.009: the reply is almost never exactly `Answer: …` / `Sources: …`. 95 of 111 final messages contain `<think>` text.
- 8 attempts ended with no final text (`stop_reason: other` right after a tool result) on 7 slots. They are in `errors.jsonl` as `no_final_answer` with their billed usage. They were retried; 1 slot (F02 rep 1) failed twice before succeeding. Rate: 8 failed attempts of 119.
- Weakest cases on coverage: H15 0.28, E03 0.33, H03 0.33, E02 0.37, H04 0.44, E01 0.46.
- Fabrication flagged on 7 rows (E08, E09, E10, E12, H09, H12, H15). False abstain on 1 row (E03 rep 1).
- No fetch outside the wiki API in any run; 3 tool errors across all runs.
