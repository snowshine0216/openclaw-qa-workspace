# TODOS

Outstanding work items tracked by component and priority.

## Completed

- **ppt-agent: wire single-slide package path and rendering** — Added `buildSlideFromStructuredSpec()` and `executeStructuredRebuilds()` to `build-pptx-from-handoff.js`; converted `apply-edit-run.js` main() to async and wired structured_rebuild job execution post-`applyEditRun()`; added 10 TDD tests in `build-pptx-structured-rebuild.test.js`. Single-slide rendering for `structured_rebuild` is now fully end-to-end. **Completed:** v0.1.10.0 (2026-03-27)
- **ppt-agent: fix 33 pre-existing test failures** — Three root causes resolved: (1) `node_modules` empty in worktree — `npm install` now required after worktree creation; (2) `spawnSync("node", ...)` fails when `node` not in PATH — fixed to `spawnSync(process.execPath, ...)` in 4 test files; (3) `PPT_AGENT_SKILL_DESIGN.md` moved to `docs/archive/ppt-agent/` — paths updated in 3 test files. Also added `.venv` symlink in worktree root and documented Python environment in CLAUDE.md. **Completed:** v0.1.10.0 (2026-03-27)
- **qa-summary: LLM-driven report generation** — Replaced static script-based generation (`buildDefectSummary.mjs`, `buildSummaryDraft.mjs`, `applyReviewRefactor.mjs`) with spawn-manifest pattern across Phase 2, 3, and 4. Removed `qa-summary-review` and `report-quality-reviewer` dependencies. Added rubric files and 73 new tests. **Completed:** v0.1.8.0 (2026-03-27)
- **defects-analysis: LLM-driven Phase 5 report generation** — Replaced static Phase 5 with subagent spawn manifest pattern; added `build_report_spawn_manifest.mjs`, `validate_report_review.mjs`, rubric files. **Completed:** v0.1.7.0 (2026-03-27)
- **ppt-agent: Phase 2 edit workflow** — Implemented `edit-run.js`, `apply-edit-run.js`, `finalize-edit-run.js`, `caption-image.js`, `summarize-doc.js`, `eval-presentation.js` with artifact-driven Phase 2A -> Phase 2B coverage. **Completed:** v0.1.0.0 (2026-03-25)
- **ppt-agent: merge-back contract and structured-slide-spec** — OOXML merge-back algorithm (6 explicit step-functions) and `structured-slide-spec.js` brief-to-spec converter. Added `structured_rebuild` dispatch in `edit-handoff.js`, validation in `update-plan.js`. 48 new tests covering all 4 critical fail-closed paths. **Completed:** v0.1.9.0 (2026-03-27)
