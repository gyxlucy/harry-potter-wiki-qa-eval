# Migrated from Claude Desktop eval `hp_wiki_qa_eval`

Source: `~/Library/Application Support/Claude/scratch-workspaces/…/scratch-2026-10-09-b0452f/hp_wiki_qa_eval`
(Chinese questions over the same French wiki dump, 2020-02-15.)

## What was copied

| here | from | note |
|---|---|---|
| `cases.jsonl` | `cases.jsonl` | 37 rows, **unchanged** (`prompt_id, prompt, tags, origin, expected{key_points[{text,source}], note}`). Authoritative copy for the runner. |
| `legacy/cases.md`, `legacy/cases_hard.md` | same | human-readable review versions the user already knows |
| `legacy/make_cases.py`, `legacy/hard_cases.py` | same | generators / provenance |
| `legacy/rubric.md`, `legacy/grader/judge.mjs` | same | judge prompt + schema + scoring (to be wrapped, not rewritten) |
| `legacy/app/` | `app/` | the OLD app (own BM25 retrieval). Reference only. |
| `legacy/EXPERIMENT_SUMMARY.md` | same | previous results, limitations |

Not copied: `node_modules`, `data/articles.jsonl` (18 MB, we have our own extraction), `test/`, `.claude/hillclimb/`, `run-eval.mjs`
(the old harness calls the Claude API directly; ours runs real Cavia tasks).

## Provenance of the gold (to record as a tag)

- Questions: 3 user-written (E01–E03), 19 synthesized by Claude, 15 "hard set" written by Claude. H05 was dropped by the author (wiki itself says "Elvis Marvolo Gaunt").
- Key points: written by Claude from wiki text, each with a `source` French fragment; the author script-checked that the fragments exist in the old wiki build.
- No human verification of the key points is recorded.

## Tier-1 audit (free; `audit/tier1.ts`, re-run against OUR `prep/wiki.sqlite`)

- Schema clean, no duplicate ids/prompts. 16 explain / 15 fact / 6 abstain. 1–7 key points per case (median 3). Prompts 13–105 chars.
- 109 key-point sources: 96 found automatically in our snapshot; 11 flagged by the checker. 9 of the 11 were checked by hand and are real (parser limits: multi-title sources, markup); 2 are annotations rather than quotes (`F02 … 页同`, `U02 … 只列出三个孩子`).
- Corpus-wide absence claims re-confirmed: 0 pages mention "Hogwarts Legacy" / "Héritage de Poudlard" (U03); no private-vault page for Dumbledore, while "coffre 713" exists only in the Philosopher's-Stone letter (U04 trap is valid).
- **Gold the hosted API cannot serve**: the API returns `plain`, which drops `{{Comment|…}}` annotations (1,574 pages use them). Two cases depend on them:
  - E07 key point 2: Drago = "maître seulement", Tom Jedusor = "propriétaire seulement".
  - H06 key points 2–4: who coined each of Dumbledore's nicknames ("par Peeves", Mrs Cole, …).
  In `plain` these read as bare lists. Other cases may be affected (not detectable automatically).

## Decisions (user-confirmed)

- **Comment tags fixed in the API text.** `prep/build-db.ts` `toPlain` now keeps `{{Comment|x}}` as ` (x)`. Rebuilt `prep/wiki.sqlite`
  (7,486 pages, 1,927 redirects, unchanged counts). New `wiki.sqlite.gz` sha256 `fa0ada3a…e914c` (old: `324c52e9…8c8c`).
  **The hosted val still serves the old file until the user re-uploads it.** E07 / H06 are not valid tests until then.
- **Provenance / representativeness:** user says the cases are representative of real traffic. Gold = "Claude-written from wiki text,
  script-checked against the snapshot, not human-verified" (E01–E03 user-written).
- **Judge:** keep `claude-sonnet-5`, called directly via the Anthropic API (key from the environment only).
- **Prompt:** length rule relaxed for explain/list questions, `Answer:`/`Sources:` format tightened (see `agents/wiki-qa/system-prompt.md`).
- **Uploaded to the val (done 2026-10-17).** The val stores plain-text shards, not SQLite. `prep/make-val-shards.ts` regenerates
  `data/pages-01..15.txt` from `wiki.sqlite`; all 15 were pushed to `lucygao/harry-potter-wiki-api`. Live check: 7,486 pages / 1,927
  redirects, 154 pages (random 150 + 4 key pages) byte-identical to the DB, Comment annotations present.
