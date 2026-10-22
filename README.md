# Harry Potter wiki Q&A: agent and eval

A question-answering agent that answers **only** from a French Harry Potter wiki snapshot (Wiki Harry Potter, 2020-02-15), and the eval used to measure it. The agent is a [Cavia](https://cavia.tabbyml.workers.dev) task config; the eval runs it as real Cavia tasks and grades each answer against hand-checked key points.

**→ All 67 eval cases, with their key points and scores: [CASES.md](CASES.md)**

## The agent

[`agents/wiki-qa/`](agents/wiki-qa/): `system-prompt.md` and `request.json`. It calls a small search API over the wiki, answers in the language of the question, and replies in the format `Answer: … / Sources: …`. When the snapshot lacks the answer it must say so instead of guessing.

The API (a [Val Town](https://www.val.town) val) serves plain text: `/search?q=&limit=&mode=`, `/page?title=&offset=&limit=`, `/titles?q=`. It holds 7,486 pages and 1,927 redirects. The build scripts are in [`.evals/wiki-qa/prep/`](.evals/wiki-qa/prep/). The wiki dump itself is not in this repo.

## The eval cases

| Set | Cases | Language | Status |
|---|---|---|---|
| Existing | 37 | 中文 | Gold written by Claude from the wiki text, script-checked, not human-verified. 3 questions were written by the owner, 18 synthesized by Claude, 15 form a Claude-written hard set. |
| New candidates | 30 | English | Real questions from the web (21 from scifi.stackexchange.com, 9 from Reddit), checked against the wiki. **Not yet approved.** |

A case is a question and 1–7 key points. Each key point has a `source`: a page title and an exact French fragment from the snapshot, which a script checks is really on that page. Kinds are `fact`, `explain` and `abstain` (the wiki does not answer). Many cases also carry a hard tag: multi-hop, count, conflict between pages, false premise, date arithmetic, and so on.

The new candidates deliberately avoid the Dumbledore / Voldemort / Horcrux topics that dominate the existing set. They cover films and cast, magic rules, biographies and family trees, Hogwarts and institutions, history beyond Britain, and abstain and false-premise cases. Their provenance files are in [`.evals/wiki-qa/new-cases/`](.evals/wiki-qa/new-cases/), including the web source of each question.

Source files:
- [`cases.jsonl`](.evals/wiki-qa/cases.jsonl): the existing 37
- [`new-cases-candidates.jsonl`](.evals/wiki-qa/new-cases-candidates.jsonl): the 30 candidates
- [`all-cases.jsonl`](.evals/wiki-qa/all-cases.jsonl): both, as run

`CASES.md` is generated: `cd .evals/wiki-qa && bun render-cases.ts`.

## Results so far

Headline metric: key-point **coverage** (covered 1, partial 0.5, missing or contradicted 0), 3 runs per case, judged by `claude-sonnet-5`. The ± is a 95% interval over cases. Cost is not measured.

| Run | Cases | Coverage | Fabrication | False abstain | Format ok |
|---|---|---|---|---|---|
| `bright-rain` (existing) | 37 | 0.794 ±0.078 | 0.063 | 0.009 | 0.009 |
| `washed-bacon` (existing) | 37 | 0.716 ±0.084 | 0.099 | 0.063 | 0.117 |
| `claude-haiku-5-5` (existing) | 37 | 0.841 ±0.065 | 0.018 | 0.018 | 1.000 |
| `claude-haiku-5-5` (new candidates) | 30 | 0.687 ±0.073 | 0.011 | 0.122 | 1.000 |
| `claude-haiku-5-5` (all) | 67 | 0.772 ±0.051 | 0.015 | 0.065 | 1.000 |

Read these as directional: the intervals overlap, and the gold is not human-verified. Metric definitions are in [`metrics.md`](.evals/wiki-qa/metrics.md). Per-run folders (`baseline/`, `washed-bacon/`, `haiku-5-5/`) hold `results.jsonl` (one graded row per case and run, with the Cavia `task_id`), `errors.jsonl` and `traces/`. [`report.html`](.evals/wiki-qa/report.html) is the earlier report for the first two runs.

Caveats for the new candidates: only cases whose first tag is `abstain` are exempt from the false-abstain flag, so a case that rightly says "the wiki does not say" for part of its answer can be flagged. A few are inference-heavy (BI01, BI05, SC03), which is noted in each case's judge note.

## Running it

Needs [Bun](https://bun.sh), `ANTHROPIC_API_KEY` for the judge, and access to the Cavia API.

```sh
cd .evals/wiki-qa
bun install
bun run.ts --variant my-run --model <cavia-model> --cases-file all-cases.jsonl --reps 3 --concurrency 6
```

Runs are resumable per (case, rep). `--dry` prints the run fingerprint without any paid call; `--cases N01,BY05` runs a subset. The eval follows the `cavia-agent` skill (see `skills-lock.json`).

## Data and licence

The wiki text belongs to its contributors (Fandom, CC BY-SA). Harry Potter is a trademark of its owners. This is an unofficial fan project.
