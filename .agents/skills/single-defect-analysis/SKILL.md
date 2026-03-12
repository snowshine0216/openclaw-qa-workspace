---
name: single-defect-analysis
description: Generates single-defect testing analysis outputs (FC risk, testing plan) for downstream workflows. Analysis-only; stops at Phase 4 with no Jira mutation or callback ownership.
---

# Single Defect Analysis Skill

This skill produces testing analysis artifacts for one Jira issue. It is analysis-only and ends at Phase 4.

## Required References

Always read:
- `reference.md`

## Runtime Layout

All artifacts for a run live under `<skill-root>/runs/<issue_key>/`:

```text
<skill-root>/runs/<issue_key>/
  context/
  drafts/
  task.json
  run.json
  phase2_spawn_manifest.json
  <issue_key>_TESTING_PLAN.md
```

## Orchestrator Loop

1. Set `FEISHU_CHAT_ID=<chat_id>` from TOOLS.md before running `orchestrate.sh`.
2. Run `scripts/phaseN.sh <issue_key> <run-dir>` for phases 0 to 4.
3. If phase 2 prints `SPAWN_MANIFEST: <path>`, spawn requests and rerun `phase2.sh --post`.
4. If any phase prints `FEISHU_NOTIFY: chat_id=<id> issue=<key> risk=<level> plan=<path>`, send a formatted Feishu message via the `message` tool (NOT the CLI) to that chat_id. The CLI path (openclaw message send subprocess) cannot send to group chats reliably — use gateway `message` tool directly.
5. Stop on non-zero exit.

## Input Contract

- `issue_key` (required)
- `issue_url` (optional)
- `refresh_mode` (optional)
- `invoked_by` (optional)
- `notification_target` (optional)

## Output Contract

- `<skill-root>/runs/<issue_key>/<issue_key>_TESTING_PLAN.md`
- `<skill-root>/runs/<issue_key>/tester_handoff.json`
- `<skill-root>/runs/<issue_key>/task.json`
- `<skill-root>/runs/<issue_key>/run.json`
- `<skill-root>/runs/<issue_key>/phase2_spawn_manifest.json` (when PR analysis spawn is required)

When run from a workspace that contains `workspace-reporter`, Phase 4 also emits legacy artifacts for downstream defect-test consumers:
- `workspace-reporter/projects/defects-analysis/<issue_key>/<issue_key>_TESTING_PLAN.md`
- `workspace-reporter/projects/defects-analysis/<issue_key>/tester_handoff.json`

## Shared Skill Reuse

- Direct reuse: `jira-cli`, `github`, `feishu-notify`
- Explicit non-use: `confluence`

## Boundary Exclusions

- No tester callback intake ownership
- No Jira mutation ownership
- No post-analysis defect state-transition ownership
