# TODOS

Outstanding work items tracked by component and priority.

### Wire Single-Slide Package Path In build-pptx-from-handoff.js

**What:** Extend `build-pptx-from-handoff.js` to emit a deterministic single-slide package artifact at `artifacts/rebuilt-slide-{slideNumber}.pptx` for `structured_rebuild` actions.

**Why:** The `applyStructuredRebuildAction()` in `edit-handoff.js` currently returns `status: "planned"` — the spec and merge-back contract are ready but the actual renderer wiring is deferred.

**Context:** Deferred from plan `PPT_AGENT_EDIT_ENRICHMENT_PLAN_PART2.md` during shipping on 2026-03-27. The merge-back algorithm and structured-slide-spec contract are complete and tested.

**Effort:** M
**Priority:** P1
**Depends on:** Completion of `structured-slide-spec.js` and `merge-back.js` (done)

### Wire Single-Slide Rendering In render-slide-from-spec.js

**What:** Extend `render-slide-from-spec.js` to support single-slide package output for the `structured_rebuild` path.

**Why:** The renderer currently produces full deck packages; single-slide output is needed for the merge-back algorithm to work end-to-end.

**Context:** Deferred from plan `PPT_AGENT_EDIT_ENRICHMENT_PLAN_PART2.md` during shipping on 2026-03-27. Depends on the build-pptx-from-handoff.js single-slide path wiring above.

**Effort:** M
**Priority:** P1
**Depends on:** Wire Single-Slide Package Path In build-pptx-from-handoff.js

### Fix 33 Pre-Existing Test Failures In ppt-agent Test Suite

**What:** Investigate and fix 33 pre-existing test failures across: build-pptx-from-handoff, create-run, edit-run, evaluate-run, finalize-edit-run, caption-image, summarize-doc, eval-presentation, plan, workflow-create-partial-success, workflow-edit-resume, workflow-edit-smoke, generate-image, load-config test files.

**Why:** These failures were present before the merge-back/structured-slide-spec implementation on branch `claude/vibrant-hugle` and are unrelated to those changes. They block future CI validation and may hide real regressions.

**Context:** Noticed on branch `claude/vibrant-hugle` (2026-03-27) during `/ship`. Root causes appear to include missing Python venv (`.venv/bin/activate` not found), missing external CLIs (markitdown), and possibly missing test fixtures. Our 48 new tests pass cleanly.

**Effort:** L
**Priority:** P0
**Depends on:** None

## Completed

- **qa-summary: LLM-driven report generation** — Replaced static script-based generation (`buildDefectSummary.mjs`, `buildSummaryDraft.mjs`, `applyReviewRefactor.mjs`) with spawn-manifest pattern across Phase 2, 3, and 4. Removed `qa-summary-review` and `report-quality-reviewer` dependencies. Added rubric files and 73 new tests. **Completed:** v0.1.8.0 (2026-03-27)
- **defects-analysis: LLM-driven Phase 5 report generation** — Replaced static Phase 5 with subagent spawn manifest pattern; added `build_report_spawn_manifest.mjs`, `validate_report_review.mjs`, rubric files. **Completed:** v0.1.7.0 (2026-03-27)
- **ppt-agent: Phase 2 edit workflow** — Implemented `edit-run.js`, `apply-edit-run.js`, `finalize-edit-run.js`, `caption-image.js`, `summarize-doc.js`, `eval-presentation.js` with artifact-driven Phase 2A -> Phase 2B coverage. **Completed:** v0.1.0.0 (2026-03-25)
- **ppt-agent: merge-back contract and structured-slide-spec** — OOXML merge-back algorithm (6 explicit step-functions) and `structured-slide-spec.js` brief-to-spec converter. Added `structured_rebuild` dispatch in `edit-handoff.js`, validation in `update-plan.js`. 48 new tests covering all 4 critical fail-closed paths. **Completed:** v0.1.9.0 (2026-03-27)
