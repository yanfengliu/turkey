# AGENTS.md — turkey

## What this is

An Amazon Mechanical Turk turn-key image-annotation tool in plain JavaScript (with jQuery and Bootstrap): per-image configurable polygon, bounding-box, dot, and link annotation modes, with import of prior human- or algorithm-generated annotations.
`src/MTurk.html` is what gets pasted into a HIT; `src/localDemo.html` exercises it without Turk; `example/reviewAnnotations.m` is a MATLAB UI for reviewing downloaded results.

<!-- FLEET-CANON:BEGIN sha=f3fc55a93a9a generated from fleet/FLEET.md by `npm run sync-canon` — do not edit inside this block; this repo's own rules go in docs/policies/local-rules.md -->
## Fleet constitution

- Work headlessly by default. If only a browser or GUI can finish or verify the task, say why, and close what you opened.
- Concurrent sessions share one worktree and one index: commit by explicit pathspec (`git commit -- <files>`), never `git commit -a`, `git add -A`, or `git add .` — a sweeping commit captures whatever another session has staged. (voxel c024b33.)
- Commit each verified unit to `main` promptly without being asked, and push at the end of the task; never commit failing or partial work as a checkpoint. Gates pass before any commit that touches code; a dependency change re-runs the audit gate.
- Toolchain baseline is Node 24, pinned per repo in `.nvmrc`. A repo that must keep an older major says so in its Gates section and keeps a CI job proving it.
- Runtime model calls are authorized and already paid for — this fleet has one user, with Claude Code and Codex subscriptions — so a program here may call a model at runtime, vision included, wherever that beats a hand-written heuristic. Model output proposes; a deterministic check disposes.
- A fix is done when the failing case has been rerun and a regression test or fixture fails if the fix reverts. A diff is not evidence.
- High-risk work — persistence/migrations, security/auth, concurrency, money, supply chain, edits that reach sibling repos — escalates to the multi-cli-review skill.
- Error messages are a product surface: audit them as a class, including paths the task did not touch. Every path that rejects or throws names what happened, which input caused it, and what would satisfy it — never a bare `Validation failed`.
- Docs are part of the change: update every affected surface in the same commit, and write prose one line per paragraph (no hard wrapping).
- Task-run evidence — raw traces, per-sample results, screenshots, recordings, generated reports, archives — lives only under ignored paths and is deleted once nothing active needs it; never commit, push, or move it to LFS. Tracked docs keep conclusions and provenance only. Such output enters Git only when review promotes it into a genuine repository input — a fixture, golden, snapshot, or contract.
- Git blob ceilings: a new or changed blob over 256 KiB needs an explicit repository-input reason; over 512 KiB binary, or 1 MiB anything, never enters ordinary Git. An external asset store or LFS requires explicit user approval, and an existing oversized blob is never precedent for another.
- Steering compounds: when the user gives a direction that outlives the immediate task, land it that same session — `../fleet/FLEET.md` if fleet-wide, else this repo's `docs/policies/local-rules.md` — and say where it went.
- Citations are part of the deliverable: anything with a public answer — a numerical method, a library's behaviour, an engine parameter, a format, a protocol — carries the source it was read from, and so does any mechanism offered to explain a measured result. A dependency's source is one call away (`gh api repos/<owner>/<repo>/contents/<path>`).
- Reviewer model pins live only in `../fleet/docs/skills/multi-cli-review.md`; a model a product itself calls is pinned in the repo that calls it. Never hardcode a model ID anywhere else.
<!-- FLEET-CANON:END -->

## Gates

`npm test` (Vitest unit tests in `test/`) · `npm run test:e2e` (Playwright, Chromium) — both before every code commit. CI (`.github/workflows/test.yml`) runs the same pair; note this repo's default branch is `master`, not `main`.
