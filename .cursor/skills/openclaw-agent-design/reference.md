# OpenClaw Agent Design — Reference

## State Machine: REPORT_STATE Handling

| REPORT_STATE | Action |
|---|---|
| `FINAL_EXISTS` | Show freshness. STOP. Options: (A) Use Existing (B) Smart Refresh (C) Full Regenerate. If (C), archive first. |
| `DRAFT_EXISTS` | STOP. Options: (A) Resume (B) Smart Refresh (C) Full Regenerate. |
| `CONTEXT_ONLY` | STOP. Options: (A) Generate from Cache (B) Re-fetch + Regenerate. |
| `FRESH` | Proceed. Initialize task.json. |

Archive naming: `<key>_OUTPUT_FINAL_<YYYYMMDD>.md`, same-day collision: append `_HHmm`.

---

## agent-idempotency Mapping

| agent-idempotency State | check_resume.sh REPORT_STATE |
|---|---|
| Final output exists | `FINAL_EXISTS` |
| Draft exists, no final | `DRAFT_EXISTS` |
| Cache only | `CONTEXT_ONLY` |
| Fresh | `FRESH` |

Reference workflows: `workspace-reporter/.agents/workflows/qa-summary.md`, `workspace-planner/.agents/workflows/feature-qa-planning.md`

---

## task.json Example (feature-qa-planning)

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

---

## run.json Example (with notification fallback)

```json
{
  "data_fetched_at": "2026-03-05T01:00:00Z",
  "output_generated_at": "2026-03-05T02:30:00Z",
  "notification_pending": null,
  "updated_at": "2026-03-05T02:31:00Z"
}
```

If Feishu fails: `"notification_pending": "✅ <Workflow> completed\n  Key: BCIN-1234\n  ..."`

---

## Design Doc Deliverables Table Format

Use this in Section 1 of every design doc:

```markdown
| Action | Path | Notes |
|--------|------|-------|
| CREATE | `.agents/workflows/<name>.md` | NLG workflow |
| CREATE | `skills/<name>/SKILL.md` | via skill-creator |
| UPDATE | `AGENTS.md` | sync skill + workflow refs |
| CREATE | `scripts/check_resume.sh` | idempotency |
```

---

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

---

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

---

## Feishu Notification Template

```
✅ <Workflow> completed
  Key:      <ISSUE_KEY>
  Output:   <path or URL>
  Updated:  <UTC TIME>
Published by <Agent Name>.
```

If formatting check failed: append `⚠️ Manual adjustments may be needed.`

---

## Script Path Conventions

| Context | Path |
|---|---|
| Working dir | `projects/<type>/<key>/` |
| Script call from working dir | `../scripts/check_resume.sh <key>` |
| Cross-workspace artifact | `../../../<workspace>/projects/...` |
