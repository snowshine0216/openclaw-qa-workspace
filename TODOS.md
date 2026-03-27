# TODOS

Outstanding work items tracked by component and priority.

## Completed

- **qa-summary: LLM-driven report generation** — Replaced static script-based generation (`buildDefectSummary.mjs`, `buildSummaryDraft.mjs`, `applyReviewRefactor.mjs`) with spawn-manifest pattern across Phase 2, 3, and 4. Removed `qa-summary-review` and `report-quality-reviewer` dependencies. Added rubric files and 73 new tests. **Completed:** v0.1.8.0 (2026-03-27)

- **defects-analysis: LLM-driven Phase 5 report generation** — Replaced static Phase 5 with subagent spawn manifest pattern; added `build_report_spawn_manifest.mjs`, `validate_report_review.mjs`, rubric files. **Completed:** v0.1.7.0 (2026-03-27)
