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

## Script-Bearing Skill Rule

A skill is script-bearing if either of these is true:
- the deliverables include `scripts/` under the skill package, or
- the Script Inventory contains one or more scripts.

Docs-only skills are exempt from script-specific test-stub requirements.

## Evals Folder Rule

When a skill has behavioral contracts, state changes, or validation rules, include `evals/` with `evals.json` per skill-creator compatible format.

- **When to add:** Skill has behavioral contracts, state transitions, or validation rules that should be regression-tested.
- **Format:** `evals/evals.json` with `skill_name`, `evals` array (id, prompt, expected_output, files).
- **Governance:** Any contract change must update evals (per DOCS_GOVERNANCE pattern).
- **Exempt:** Docs-only skills with no behavioral contracts; optional for docs-only skills; required for script-bearing or contract-heavy skills.

## OpenClaw Test Layout Exception

For OpenClaw skill-package design work, `scripts/test/` is the canonical test location for script-bearing skills. This is a domain-specific exception that overrides the generic top-level `tests/` preference from `code-quality-orchestrator` for this design domain.

## `agent-idempotency` Mapping

| `agent-idempotency` State | `check_resume.sh` `REPORT_STATE` |
|---|---|
| Final output exists | `FINAL_EXISTS` |
| Draft exists, no final | `DRAFT_EXISTS` |
| Cache only | `CONTEXT_ONLY` |
| Fresh | `FRESH` |

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

## Plan / Design Document Outline Template

Plans and design docs must be detailed, implementation-ready, and decision-complete. Structure by Goal → Required Change for Each Phase; group all related changes by phase instead of listing them at the end.

```markdown
# Title
## Overview
## Architecture
### Workflow chart
### Folder structure
## Skills Content Specification
### skill-SKILL.md (detailed)
<!-- Put all related changes for this skill into this section, must have detailed content -->
### skill-reference.md (detailed)
<!-- Put all related changes for this skill into this section, must have detailed content -->
### skill-other-files.md (detailed)
### skill-evals
## Data Models
## Functions
<!-- Put all related functions here; every function should have detailed implementaion codes or content of files to be changed-->
### Function1
<!-- Put all related functions here; every function should have detailed implementaion codes or content of files to be changed-->
### Functional2
<!-- Put all related changes for this functional design into this section, must have implenmentation codes, or content of files to be changed -->
## AGENTS.md (to change)
<!-- Put all related changes for this AGENTS.md into this section, must have detailed content -->
## Tests
<!-- Put all test stub funcions in to table, include happy path, failure path, and error path, boundry case-->
## Documentation Changes
<!-- if README.md or other documentation needs changing, put it here -->
## Implementation Checklist

## References
```
