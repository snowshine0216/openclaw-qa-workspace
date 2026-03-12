# Triggering Evals on Skill Invocation

Codex and Claude Code do **not** provide a native "skill invoked" hook. Evals run manually or via the mechanisms below.

## Option 1: Agent post-task instruction (recommended for "every time")

Add to the **openclaw-agent-designer** agent config (`.codex/agents/openclaw-agent-designer.toml`) so the agent runs evals after completing a design task:

```toml
developer_instructions = """
...
- After completing each design task, run a quick eval smoke check:
  node .agents/skills/openclaw-agent-design/evals/run_evals.mjs --dry-run
  and verify the design artifact passes scripts/check_design_evidence.sh.
  For full evals, run: node evals/run_evals.mjs, spawn runs, grade, then ./evals/post_run.sh.
"""
```

**Lightweight variant** (no full evals, just evidence check):

```toml
- After producing a design artifact, run check_design_evidence.sh on it:
  bash .agents/skills/openclaw-agent-design-review/scripts/check_design_evidence.sh <design-path>
```

## Option 2: UserPromptSubmit hook (design-related prompts)

Run evals when the user submits a prompt that matches design-related keywords. Create `.codex/settings.json` or `.claude/settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "design agent|agent design|workflow design|openclaw.*design",
        "hooks": [
          {
            "type": "command",
            "command": "node .agents/skills/openclaw-agent-design/evals/run_evals.mjs --dry-run 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

**Note:** This runs when the user *submits* a design-related prompt, not when the skill is actually used. The matcher is heuristic and may miss or over-trigger.

## Option 3: CI on skill file changes

Run evals in CI when skill files change:

```yaml
# .github/workflows/skill-evals.yml
on:
  push:
    paths:
      - '.agents/skills/openclaw-agent-design/**'
      - '.agents/skills/openclaw-agent-design-review/**'
jobs:
  evals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: node .agents/skills/openclaw-agent-design/evals/run_evals.mjs --dry-run
      - run: node .agents/skills/openclaw-agent-design-review/evals/run_evals.mjs --dry-run
```

## Option 4: Scheduled runs

Run evals on a schedule (cron, GitHub Actions scheduled workflow) to catch regressions.

## Summary

| Goal | Approach |
|------|----------|
| Evals after every design task | Option 1 — add post-task instruction to agent config |
| Evals when user asks design questions | Option 2 — UserPromptSubmit hook with matcher |
| Evals when skill code changes | Option 3 — CI on path changes |
| Periodic regression check | Option 4 — scheduled workflow |

For **"evals every time the skill is called"**, Option 1 is the closest: the agent runs a check (lightweight or full) after each design task.
