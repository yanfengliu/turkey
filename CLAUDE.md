# Git Command Rules
- CRITICAL: You are strictly forbidden from using compound commands with `cd` and `git` (e.g., `cd path && git commit`). This triggers a hardcoded CLI security block that halts automation. 
- You MUST ALWAYS use the `git -C <path> <command>` syntax for all git operations. Make sure to follow this both when you and your subagents are working.