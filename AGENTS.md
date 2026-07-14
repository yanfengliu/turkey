# AGENTS.md

## Headless-first execution

Always work headlessly by default. This is a mandatory execution rule, not an adaptable default. Use a visible browser window, desktop application, GUI automation, or another non-headless interaction only when it is absolutely necessary to complete or adequately verify the task and no headless alternative is sufficient. State the reason before launching the non-headless path.

## Work delivery

During substantial multi-step work, treat each minimal coherent unit as a delivery boundary: review it as soon as it is coherent, resolve substantive findings, then run or rerun applicable verification on the final scoped diff before promptly staging only that unit's files and committing it before unrelated completed units accumulate in the worktree or diff. Self-review trivial changes; adversarially review behavior and public-contract changes. Never commit failing, in-flight, or partial work merely as a checkpoint.
