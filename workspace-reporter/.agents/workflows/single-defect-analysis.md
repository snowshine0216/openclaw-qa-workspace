---
description: Compatibility shim for single-issue defect analysis. Routes to the shared `.agents/skills/single-defect-analysis` package. Analysis-only scope (Phase 0 to Phase 4).
---

# Single-Defect Analysis Workflow (Compatibility Shim)

This workflow document is a routing shim. The canonical implementation now lives in:

- `.agents/skills/single-defect-analysis/SKILL.md`
- `.agents/skills/single-defect-analysis/reference.md`

## Trigger

- Input is exactly one Jira issue key or one Jira issue URL.
- No feature-level QA plan is provided.

## Runtime Behavior

Use the shared skill orchestrator:

```bash
bash .agents/skills/single-defect-analysis/scripts/orchestrate.sh <ISSUE_KEY>
```

## Scope Boundary

- The shared skill is analysis-only and ends at **Phase 4**.
- Outputs:
  - `.agents/skills/single-defect-analysis/runs/<ISSUE_KEY>/<ISSUE_KEY>_TESTING_PLAN.md`
  - `.agents/skills/single-defect-analysis/runs/<ISSUE_KEY>/task.json`
  - `.agents/skills/single-defect-analysis/runs/<ISSUE_KEY>/run.json`
- Out of scope:
  - tester callback intake
  - Jira mutation (comment/transition/create)
  - post-analysis defect lifecycle transitions

## User Interaction Rules

- Keep explicit user approval for destructive actions. No destructive actions are part of this workflow.
- Phase 0 respects canonical `REPORT_STATE` options before regenerating outputs.

