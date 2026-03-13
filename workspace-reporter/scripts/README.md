# Reporter Scripts

## Canonical Defect Analysis Entrypoint

**Use the skill orchestrator for defect analysis:**

```bash
bash workspace-reporter/skills/defects-analysis/scripts/orchestrate.sh <INPUT>
```

- `<INPUT>`: Jira issue key/URL, feature key, JQL query, or release version
- Single Jira `Issue`/`Bug`/`Defect` inputs are delegated in Phase 0 to `.agents/skills/single-defect-analysis`
- `Story`/`Feature`/`Epic`, JQL, and release inputs stay in reporter scope
- `workspace-reporter/.agents/workflows/defect-analysis.md` is a **compatibility shim** — it routes to the skill; do not treat it as the canonical workflow body

## Script Inventory

| Script | Source | Notes |
|--------|--------|------|
| `retry.sh` | Symlink → `workspace-planner/projects/feature-plan/scripts/retry.sh` | Shared, no duplication |
| `fetch-defects-for-feature.sh` | Local (reporter-specific) | Phase 0a + Phase 1 in one: loads `.env`, refreshes project cache if stale, runs cross-project JQL, writes to `projects/defects-analysis/<KEY>/context/jira_raw.json`. Prints `DEFECT_COUNT=N`. Used by defect-analysis Phase 1 and planner Phase 2a auto-detect. |
| `check_resume.sh` | Local (reporter-specific) | Detects `REPORT_STATE` (FINAL/DRAFT/CONTEXT_ONLY/FRESH) + freshness timestamps + resume check. Run first in Phase 0. |
| `archive_report.sh` | Local (reporter-specific) | Moves FINAL or DRAFT to `archive/<KEY>_REPORT_<TYPE>_<YYYYMMDD>.md`. Handles same-day collision. Updates `task.json archive_log`. Exit 2 = nothing to archive (non-fatal). |

**Do not copy** shared scripts — reference via symlinks to avoid duplication.
