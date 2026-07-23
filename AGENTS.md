# AGENTS.md — turkey

## What this is

An Amazon Mechanical Turk turn-key image-annotation tool in plain JavaScript (with jQuery and Bootstrap): per-image configurable polygon, bounding-box, dot, and link annotation modes, with import of prior human- or algorithm-generated annotations.
`src/MTurk.html` is what gets pasted into a HIT; `src/localDemo.html` exercises it without Turk; `example/reviewAnnotations.m` is a MATLAB UI for reviewing downloaded results.

## Fleet constitution

- Work headlessly by default; go non-headless only when nothing else can complete or verify the task, and say why.
- These rules are strong defaults, not law: when one would make the work worse, deviate and say why.
- Scale the approach to the task: trivial changes directly; substantial work as explore → plan → implement → verify, with subagents when work is genuinely parallel.
- Delivery boundary: each minimal coherent verified unit is reviewed, staged (scoped files only), and committed promptly — never commit failing or partial work as a checkpoint. Commit to `main`; push at the end of every task.
- Concurrent sessions share one worktree and one index: commit by explicit pathspec (`git commit -- <files>`), never `git commit -a`, `git add -A`, or `git add .` — a sweeping commit captures whatever another session has staged. (Evidence: voxel c024b33, 2026-07-17.)
- The repo's gates must pass before every commit that touches code; doc-only changes need a self-reviewed diff.
- Review: self-review trivial changes; adversarially review non-trivial ones — independent agents that try to refute the change against the live code. High-risk work (persistence/migrations, security/auth, concurrency, money, supply chain, edits that reach sibling repos) escalates to the multi-cli-review skill. Reviewers must read the live code; verify reviewer claims against the codebase before acting on them; substantive findings outweigh approval votes.
- Dependency changes: re-resolve the lockfile, run the repo's audit gate (a new HIGH/CRITICAL is a blocker), and note the audit result in the commit message.
- Docs are part of the change: update every affected surface in the same commit; write prose one line per paragraph (no hard wrapping); never reference or mandate files that don't exist.
- Bias to continue: work through the whole accepted plan without mid-plan check-ins; context management is the harness's job, never a reason to stop. Stop only for a genuine blocker, a direction-changing decision, or an explicit stop. (Established 2026-05-01; reinforced 2026-07-05.)
- Error messages are a product surface: whenever code rejects, fails, or throws, say what happened, which specific input caused it, and what would satisfy it — never a bare `Validation failed`, `invalid input`, or a silent boolean false. A diagnostic that forces a human or an agent to read the source to learn why is itself a defect; fix the message in the same change as the bug. Applies equally to validators, CLI output, and assertion text. (Established 2026-07-18, after city's `placeService` answered five rejected placements with only "Validation failed".)
- Steering compounds: when the user gives a direction that generalizes past the immediate task, land it in the canon in that same session — here if it is fleet-wide, else the repo's AGENTS.md or lessons file — so the next run inherits it instead of relearning it, and say what was captured and where. (Established 2026-07-18.)
- Model pins live only in `../loop-ops/docs/skills/multi-cli-review.md` — never hardcode model IDs anywhere else.
- Lessons files (`docs/learning/lessons.md` where present) require evidence anchors — source, fix commit, test id, behavior delta; unanchored lessons are folklore.
- Recursive loop: before running or driving a pass, read `../loop-ops/docs/skills/recursive-playtest.md`; before building loop machinery, read `../loop-ops/docs/skills/building-recursive-loop.md`.

## Gates

`npm test` (Vitest unit tests in `test/`) · `npm run test:e2e` (Playwright, Chromium) — both before every code commit. CI (`.github/workflows/test.yml`) runs the same pair; note this repo's default branch is `master`, not `main`.
