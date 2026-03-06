# OpenClaw Agent Design — Reference

## State Machine: `REPORT_STATE` Handling

| `REPORT_STATE` | Action |
|---|---|
| `FINAL_EXISTS` | Show freshness. STOP. Options: (A) Use Existing (B) Smart Refresh (C) Full Regenerate. If (C), archive first. |
| `DRAFT_EXISTS` | STOP. Options: (A) Resume (B) Smart Refresh (C) Full Regenerate. |
| `CONTEXT_ONLY` | STOP. Options: (A) Generate from Cache (B) Re-fetch + Regenerate. |
| `FRESH` | Proceed. Initialize `task.json`. |

This table is the canonical Phase 0 contract for designs that produce persistent artifacts.

## Non-Regression Rules

When redesigning a workflow into skill-first form:

- Start with the existing Phase 0 check before creating new artifacts.
- Preserve current `REPORT_STATE` semantics by default.
- Preserve existing `task.json` / `run.json` semantics by default.
- Any schema or transition change must be additive, backward-compatible, and justified in both the design doc and reviewer report.

## Shared vs Local Skill Placement

| Capability Type | Canonical Path | Rule |
|---|---|---|
| Shared reusable skill | `.agents/skills/<skill-name>/` | Use when multiple agents or workspaces can reuse it |
| Workspace-local skill | `<workspace>/skills/<skill-name>/` | Use when behavior is tightly coupled to one workspace or agent family |
| Skill helper automation | `<skill-root>/scripts/` | Shell/Node helpers that implement the skill contract |

## Existing Shared Skills to Reuse Directly

Use these existing shared skills directly when they fit:

- `jira-cli`
- `confluence`
- `feishu-notify`

Create a wrapper only when direct reuse cannot express the needed higher-level contract.

## `agent-idempotency` Mapping

| `agent-idempotency` State | `check_resume.sh` `REPORT_STATE` |
|---|---|
| Final output exists | `FINAL_EXISTS` |
| Draft exists, no final | `DRAFT_EXISTS` |
| Cache only | `CONTEXT_ONLY` |
| Fresh | `FRESH` |

Reference workflows:
- `workspace-reporter/.agents/workflows/qa-summary.md`
- `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`

## `task.json` Example

```json
{
  "run_key": "BCIN-1234",
  "overall_status": "in_progress",
  "current_phase": "context_gathering",
  "updated_at": "2026-03-05T02:00:00Z",
  "phases": {
    "context_gathering": { "status": "in_progress" },
    "plan_generation": { "status": "pending" }
  }
}
```

## `run.json` Example

```json
{
  "data_fetched_at": "2026-03-05T01:00:00Z",
  "output_generated_at": "2026-03-05T02:30:00Z",
  "notification_pending": null,
  "updated_at": "2026-03-05T02:31:00Z"
}
```

If Feishu notification fails: `notification_pending` should contain the pending message payload for retry or manual handling.

## Design Doc Deliverables Table Format

Use this in Section 1 of every design doc:

```markdown
| Action | Path | Notes |
|--------|------|-------|
| UPDATE | `.agents/skills/<entrypoint-skill>/SKILL.md` | entrypoint skill contract |
| UPDATE | `.agents/skills/<entrypoint-skill>/reference.md` | canonical behavior notes |
| CREATE/UPDATE | `.agents/skills/<shared-skill>/SKILL.md` | shared capability via skill-creator |
| CREATE/UPDATE | `<workspace>/skills/<local-skill>/SKILL.md` | workspace-local capability via skill-creator |
| UPDATE | `AGENTS.md` | sync design and skill references |
```

## Design Doc Header Block

Paste at top of every design doc:

```markdown
> **Design ID:** `<id>`
> **Date:** YYYY-MM-DD
> **Status:** Draft
> **Scope:** <one-line>
>
> **Constraint:** This is a design artifact. Do not implement until approved.
```

## Per-Phase User Interaction Template

```markdown
### Phase N: <Phase Name>

Actions:
1. <step>

User Interaction:
1. Done: <completed items>
2. Blocked: <blockers>
3. Questions: <user decisions required>
4. Assumption policy: if any key detail is unclear, stop and ask before continuing.

State Updates:
1. `task.json.current_phase = "phase_N_<name>"`

Verification:
```bash
# spot-check command
```
```

## Final Notification Template

```text
✅ <Workflow> completed
  Key:      <ISSUE_KEY>
  Output:   <path or URL>
  Updated:  <UTC TIME>
Published by <Agent Name>.
```

If formatting or send check failed: append `⚠️ Manual adjustments may be needed.`
