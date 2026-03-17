---
description: Run QA Summary workflow. Invokes workspace-reporter/skills/qa-summary. Always confirms with user before Confluence publish.
---

# QA Summary Workflow

**Entrypoint:** Use `workspace-reporter/skills/qa-summary` skill.

```bash
bash workspace-reporter/skills/qa-summary/scripts/orchestrate.sh <FEATURE_KEY>
```

The skill orchestrates:
- Planner artifact resolution from `workspace-planner/skills/qa-plan-orchestrator/runs/<feature-key>/`
- Defect context from `workspace-reporter/skills/defects-analysis`
- Draft generation (sections 1–10)
- `qa-summary-review` quality gate
- Optional Confluence publish (requires explicit user approval)

**Design:** `workspace-reporter/docs/QA_SUMMARY_SKILL_DESIGN.md`
