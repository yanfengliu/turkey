# AGENTS.md — turkey

## What this is

An Amazon Mechanical Turk turn-key image-annotation tool in plain JavaScript (with jQuery and Bootstrap): per-image configurable polygon, bounding-box, dot, and link annotation modes, with import of prior human- or algorithm-generated annotations.
`src/MTurk.html` is what gets pasted into a HIT; `src/localDemo.html` exercises it without Turk; `example/reviewAnnotations.m` is a MATLAB UI for reviewing downloaded results.

<!-- FLEET-CANON:BEGIN sha=eaeb98145f81 generated from ../fleet/FLEET.md by `npm run sync-canon` — do not edit inside this block; this repo's own rules go in docs/policies/local-rules.md -->
## Fleet constitution

- Verify visual work visually: capture the rendered result — screenshot, frame, recording — and look at it, because a passing test says nothing about what the pixels do. Work with no visual surface runs headlessly.
- Commit each verified unit of change to `main` without being asked, and push. Gates pass before any commit that touches code; a dependency change re-runs the audit gate.
- A repo chooses its own language and toolchain — Node, Python, and Rust all run here. Each pins its version where its own tooling reads it (`.nvmrc`, `requires-python`, `rust-toolchain.toml`) and names it in Gates, so a version mismatch is not read as a code failure. Node repos baseline at 24; an older major keeps a CI job proving it.
- Runtime model calls are authorized and already paid for — this fleet has one user, with Claude Code and Codex subscriptions — so a program here may call a model at runtime, vision included.
- The top reasoning tier is rationed: spend it only on the hardest problem, or on directing the workhorse tier that does the work — and only at maximum effort or orchestration.
- Two failed attempts at one problem escalate to the hard-problem skill: a search across deliberately different approaches, run to a result rather than to a report. Spending real budget there is authorized — a third pass at the approach that already failed is the expensive mistake. Return the working result, or the strongest proved part with its exact remaining gap.
- High-risk work — persistence/migrations, security/auth, concurrency, money, supply chain, edits that reach sibling repos — escalates to the multi-cli-review skill. That is a review you run yourself, not permission you ask the user for; nothing in this canon requires asking.
- Error messages are a product surface: audit them as a class, including paths the task did not touch. Each names what happened, which input caused it, and what would satisfy it — never a bare `Validation failed`.
- When blocked, hand over the raw artifact — screenshot, rendered page, log line, data row — as soon as the blocker is named rather than after the analysis: your description of it is filtered through the misunderstanding that caused the block, so it cannot contain what you failed to notice.
- Task-run evidence lives only under ignored paths and is deleted once nothing active needs it; it enters Git only when review promotes it into a repository input — a fixture, golden, snapshot, or contract. Tracked docs keep conclusions and provenance only. Blob ceilings for anything promoted: over 256 KiB needs a stated reason, over 512 KiB binary or 1 MiB of anything never enters ordinary Git, and an asset store or LFS needs the user's approval.
- Write prose one line per paragraph (no hard wrapping).
- Keep a devlog: one short dated line per behaviour-changing session in `docs/devlog/summary.md`, newest first, and a section in `docs/devlog/detailed/` for anything a later session could trip over — what was believed and proved false, what a reviewer caught that the author missed, what number moved and from what. It is history, not status. Both shapes are in `../fleet/docs/devlog-template.md`.
- Read `docs/learning/lessons.md` at session start: the one-line index of what this repo has already paid to learn, with each entry's war story and anchor in `lessons-evidence.md`. A lesson lands the session it is learned, anchored to a measurement, commit, or test id; unanchored, it is folklore. When a lesson becomes a gate — a test, a lint rule, a fixed command — delete both halves. Shape: `../fleet/docs/lessons-template.md`.
- Steering compounds: a direction that outlives the immediate task lands that same session — `../fleet/FLEET.md` if fleet-wide, else this repo's `docs/policies/local-rules.md` — and you say where it went.
- Reviewer model pins live only in `../fleet/docs/skills/multi-cli-review.md`; a model a product itself calls is pinned in the repo that calls it. Never hardcode a model ID anywhere else.
<!-- FLEET-CANON:END -->

## Gates

`npm test` (Vitest unit tests in `test/`) · `npm run test:e2e` (Playwright, Chromium) — both before every code commit. CI (`.github/workflows/test.yml`) runs the same pair; note this repo's default branch is `master`, not `main`.
