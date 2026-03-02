# OpenClaw Agent Design — Reference

## agent-idempotency Integration

Phase 0 must align with the agent-idempotency skill. The check_resume.sh pattern maps to agent-idempotency's **Tiered Existence Check**:

| agent-idempotency State | check_resume.sh REPORT_STATE |
|-------------------------|-----------------------------|
| Final output exists | FINAL_EXISTS |
| Draft exists, no final | DRAFT_EXISTS |
| Cache only | CONTEXT_ONLY |
| Fresh | FRESH |

Reference workflows: `workspace-reporter/.agents/workflows/qa-summary.md`, `workspace-planner/.agents/workflows/feature-qa-planning.md`

---

## State Machine Examples

### task.json (feature-qa-planning)

```json
{
  "overall_status": "in_progress",
  "current_phase": "context_gathering",
  "feature_name": "BCIN-1234",
  "updated_at": "2026-02-28T12:00:00Z",
  "defect_analysis": "not_applicable",
  "phases": {
    "context_gathering": { "status": "in_progress" },
    "plan_generation": { "status": "pending" },
    "plan_synthesize": { "status": "pending" },
    "review_refactor": { "status": "pending" },
    "publication": { "status": "pending" },
    "confluence_review": { "status": "pending" }
  },
  "data_fetched_at": "2026-02-28T11:30:00Z",
  "output_generated_at": null
}
```

### run.json (qa-summary) with notification fallback

```json
{
  "confluence_page_id": "12345",
  "data_fetched_at": "2026-02-28T11:00:00Z",
  "output_generated_at": "2026-02-28T12:30:00Z",
  "notification_pending": null
}
```

If Feishu fails: `"notification_pending": "✅ QA Summary updated on Confluence\n  Feature: BCIN-1234\n  ..."`

## REPORT_STATE Handling (Phase 0)

| REPORT_STATE | Action |
|--------------|--------|
| **FINAL_EXISTS** | Display freshness. STOP. Options: (A) Use Existing (B) Smart Refresh (C) Full Regenerate. If (C), archive before proceeding. |
| **DRAFT_EXISTS** | STOP. Options: (A) Resume to Approval (B) Smart Refresh (C) Full Regenerate. |
| **CONTEXT_ONLY** | STOP. Options: (A) Generate from Cache (B) Re-fetch + Regenerate. |
| **FRESH** | Proceed. Initialize task.json. |

## DEFECT_ANALYSIS_RESUME Handling

When `defect_analysis` in task.json is `in_progress` or `pending`:

| Emitted Value | Action |
|---------------|--------|
| **COMPLETED** | Copy report to context, set `defect_analysis: "completed"`, proceed to Phase 2b. |
| **AWAITING_APPROVAL** | Prompt: (A) Open for approval (B) Skip. |
| **NOT_FOUND** | Prompt: Resume or skip. |

## Feishu Notification Template (QA Summary)

```
✅ QA Summary updated on Confluence
  Feature:   <FEATURE_KEY>
  Page:      <Title>
  URL:       <URL>
  Updated:   <UTC TIME>
  Sections:  1–9 (⚠️ <List with placeholders> have placeholders)
Published by QA Summary Agent.
```

*(If formatting self-check failed and user chose manual fix, append: `⚠️ Confluence formatting check failed. Manual adjustments needed on the page.`)*

## Script Path Convention

- Feature dir: `projects/feature-plan/<feature-id>/`
- From feature dir: `../scripts/check_resume.sh <feature-id>`
- Reporter defects: `../workspace-reporter/projects/defects-analysis/<feature-id>/`
