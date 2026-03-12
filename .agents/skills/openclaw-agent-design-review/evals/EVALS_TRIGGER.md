# Triggering Evals on Skill Invocation

Codex and Claude Code do **not** provide a native "skill invoked" hook. Evals run manually or via the mechanisms below.

## Option 1: Agent post-task instruction (recommended for "every time")

Add to the **openclaw-agent-design-reviewer** agent config (`.codex/agents/openclaw-agent-design-reviewer.toml`) so the agent runs evals after completing a review task:

```toml
developer_instructions = """
...
- After completing each review task, run a quick eval smoke check:
  node .agents/skills/openclaw-agent-design-review/evals/run_evals.mjs --dry-run
  and verify the review report has required fields (design_review_report.md, design_review_report.json, final status).
  For full evals, run: node evals/run_evals.mjs, spawn runs, grade, then ./evals/post_run.sh.
"""
```

## Option 2: UserPromptSubmit hook (review-related prompts)

Run evals when the user submits a prompt that matches review-related keywords. Create `.codex/settings.json` or `.claude/settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "review design|design review|openclaw.*review",
        "hooks": [
          {
            "type": "command",
            "command": "node .agents/skills/openclaw-agent-design-review/evals/run_evals.mjs --dry-run 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

**Note:** This runs when the user *submits* a review-related prompt, not when the skill is actually used.

## Option 3: CI on skill file changes

Run evals in CI when skill files change:

```yaml
on:
  push:
    paths:
      - '.agents/skills/openclaw-agent-design-review/**'
```

## Option 4: Scheduled runs

Run evals on a schedule (cron, GitHub Actions) to catch regressions.


## Summary

| Goal | Approach |
|------|----------|
| Evals after every review task | Option 1 — add post-task instruction to agent config |
| Evals when user asks review questions | Option 2 — UserPromptSubmit hook with matcher |
| Evals when skill code changes | Option 3 — CI on path changes |
| Periodic regression check | Option 4 — scheduled workflow |

For **"evals every time the skill is called"**, Option 1 is the closest: the agent runs a check after each review task.


