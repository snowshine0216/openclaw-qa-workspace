# Reporter Scripts

| Script | Source | Notes |
|--------|--------|------|
| `retry.sh` | Symlink → `workspace-planner/projects/feature-plan/scripts/retry.sh` | Shared, no duplication |
| `confluence/` | Symlink → `workspace-planner/scripts/confluence/` | Shared md-to-confluence converter |
| `check_resume.sh` | Local (reporter-specific) | Detects `REPORT_STATE` (FINAL/DRAFT/CONTEXT_ONLY/FRESH) + freshness timestamps + resume check. Run first in Phase 0. |
| `archive_report.sh` | Local (reporter-specific) | Moves FINAL or DRAFT to `archive/<KEY>_REPORT_<TYPE>_<YYYYMMDD>.md`. Handles same-day collision. Updates `task.json archive_log`. Exit 2 = nothing to archive (non-fatal). |

**Do not copy** shared scripts — reference via symlinks to avoid duplication.
