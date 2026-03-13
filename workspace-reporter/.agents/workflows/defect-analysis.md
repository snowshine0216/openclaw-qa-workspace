---
description: Compatibility shim for reporter defect analysis. Routes to the workspace-local `workspace-reporter/skills/defects-analysis` skill package.
---

# Defect Analysis Workflow (Compatibility Shim)

This workflow document is now a routing shim. The canonical implementation lives in:

- `workspace-reporter/skills/defects-analysis/SKILL.md`
- `workspace-reporter/skills/defects-analysis/reference.md`

## Trigger

- Input is a Jira issue key/URL, feature key, JQL query, or release version.
- The task is to perform defect analysis.

## Runtime Behavior

Use the skill orchestrator:

```bash
bash workspace-reporter/skills/defects-analysis/scripts/orchestrate.sh <INPUT>
```

## Routing Rule

- Single Jira `Issue`/`Bug`/`Defect` inputs are delegated in Phase 0 to `.agents/skills/single-defect-analysis`.
- `Story`/`Feature`/`Epic`, JQL, and release inputs stay in reporter scope.

## Scope Boundary

- Confluence publishing is out of scope.
- Phase 5 uses a self-review + finalize loop; exit gate is review result `pass`.
- Final delivery is Feishu notification only.
- The workflow blocks only when automated progress is unsafe or impossible.
