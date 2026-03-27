# TODOS

## Skill Artifact Roots

### Add A Concrete In-Repo Artifact Discovery Exclusion Helper When A Real Caller Exists

**What:** Add a concrete in-repo discovery/context-assembly exclusion helper only when a named production caller is identified and migrated to it.

**Why:** The artifact-root convention needs one real enforcement point eventually, but adding a helper before a caller exists would be speculative infrastructure.

**Context:** During `/plan-eng-review` of `docs/SKILL_ARTIFACT_ROOT_EXTRACTION_PLAN.md`, the review accepted deferring `.agents/skills/lib/artifactDiscoveryPolicy.mjs` until a real scanner or context-assembler is in scope. The current plan should document the boundary and ignore rules now, then introduce a helper only when there is a concrete production caller to wire up in the same change set.

**Effort:** M
**Priority:** P2
**Depends on:** Identification of a concrete production caller that scans repo paths for active skills or context inputs

## PPT Agent

### Lock The Phase 1 Create-Mode Build Path And `pptx` Integration Contract

**What:** Make the Phase 1 create workflow explicit about whether deck production is primarily scratch generation through `pptx`, template-editing-first, or another concrete path, and document the exact boundary between `ppt-agent` orchestration and `pptx` mechanics.

**Why:** The current plan still says references/templates are used when available without fully defining how they change the actual build path. That ambiguity lets different implementers make incompatible assumptions about how create-mode works.

**Context:** The current plan correctly says `ppt-agent` owns orchestration and `pptx` owns mechanics, but it does not fully lock what the dominant create-mode assembly path is. This was flagged by the independent outside-voice review as the highest-severity remaining gap.

**Effort:** M
**Priority:** P1
**Depends on:** None

### Define A Concrete Run-State And Artifact-Manifest Contract For Phase 1

**What:** Define the run-state model for `ppt-agent` Phase 1, including artifact directory layout, naming/versioning, cache keying, resume/discovery behavior, and invalidation rules for intermediate outputs.

**Why:** The plan has a reuse policy, but it does not yet define the concrete storage and lookup contract that makes reuse real. Without that, implementation will either fake idempotency or invent inconsistent artifact behavior ad hoc.

**Context:** The independent outside-voice review flagged the current reuse/idempotency story as too abstract. The plan says which artifacts should be reusable, but not where they live, how they are keyed, or how a later run finds and validates them.

**Effort:** L
**Priority:** P1
**Depends on:** Lock The Phase 1 Create-Mode Build Path And `pptx` Integration Contract

### Create A Repo-Level `DESIGN.md` For Presentation Output And Review Artifacts

**What:** Create a shared `DESIGN.md` that defines the design-system rules for presentation-related output and human-facing review artifacts in this repository.

**Why:** The `ppt-agent` Phase 2 design had to define its own local design-alignment rules because there is no repo-level design source of truth. A shared `DESIGN.md` would reduce repeated ambiguity in future presentation and review plans.

**Context:** During `/plan-design-review` of `PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN.md`, no repo-level `DESIGN.md` was found. The Phase 2 plan is design-complete on its own, but future presentation-related plans will face the same design-authority question unless a shared design system is created.

**Effort:** M
**Priority:** P2
**Depends on:** None

### Define Artifact Retention Policy For Enriched Phase 2 Edit Runs

**What:** Define retention tiers and cleanup rules for enriched `ppt-agent` Phase 2 run artifacts, including which intermediate files must persist for resume/debugging and which can be pruned safely.

**Why:** The enriched edit workflow will produce more artifacts per run, such as slide briefs, source-theme snapshots, image prompts, rebuilt slide packages, and richer render/eval outputs. Without a retention policy, disk usage and run-folder sprawl will grow quickly.

**Context:** Added during `/plan-eng-review` of `PPT_AGENT_EDIT_ENRICHMENT_PLAN.md`. The reviewed plan intentionally expands Phase 2 artifact volume to improve trust, resume behavior, and auditability, but it does not yet define artifact lifecycle or cleanup boundaries.

**Effort:** S
**Priority:** P2
**Depends on:** Finalized enriched Phase 2 artifact contract

### Define Single-Slide Package Artifact Naming Convention

**What:** Add deterministic naming for single-slide package artifacts (e.g., `artifacts/rebuilt-slide-{slideNumber}.pptx`).

**Why:** The merge-back algorithm produces single-slide packages but doesn't specify where they're stored or how they're named, creating ambiguity about artifact layout.

**Pros:** Enables resume behavior, auditability, and debugging.

**Cons:** Adds one more artifact type to manage.

**Context:** Identified during `/plan-eng-review` of `PPT_AGENT_EDIT_ENRICHMENT_PLAN_PART2.md`. The merge-back algorithm needs a deterministic path for the single-slide package artifact it produces.

**Effort:** S
**Priority:** P1
**Depends on:** None

### Add Theme Snapshot Artifact To Baseline Verification

**What:** Write a `source-theme-snapshot.json` artifact during baseline verification that captures the source deck's theme tokens (colors, fonts, spacing).

**Why:** The structured renderer needs to preserve source-deck theme identity during `structured_rebuild`, but it currently has no mechanism to read theme from the source deck.

**Pros:** Enables theme preservation without coupling the renderer to unpacked deck state.

**Cons:** Adds one more artifact to baseline verification.

**Context:** Identified during `/plan-eng-review` of `PPT_AGENT_EDIT_ENRICHMENT_PLAN_PART2.md`. The plan says rebuilt slides must preserve source-deck theme identity, but doesn't specify how theme tokens are passed to the renderer.

**Effort:** M
**Priority:** P1
**Depends on:** None

### Clarify Fail-Closed Behavior For Structured Rebuild

**What:** Document that 'fail closed' means abort the entire run, preserve the working deck untouched, and emit a structured error artifact for debugging.

**Why:** The plan says 'fail closed' but doesn't define what that means concretely — it could mean abort the run, abort just that slide, or fall back to a different strategy.

**Pros:** Eliminates ambiguity about error handling.

**Cons:** None.

**Context:** Identified during `/plan-eng-review` of `PPT_AGENT_EDIT_ENRICHMENT_PLAN_PART2.md`. The merge-back algorithm needs explicit fail-closed semantics.

**Effort:** S
**Priority:** P2
**Depends on:** None

### Update PPT Agent Edit Enrichment Plan Part 1 With Engineering Review Findings

**What:** Update `PPT_AGENT_EDIT_ENRICHMENT_PLAN_PART1.md` to incorporate the 8 architectural and code quality issues identified during `/plan-eng-review`: (1) add edit-workflow.js to FD1 to replace deriveFindings() stub, (2) add deck-analysis.js to FD2 for theme extraction, (3) add pptx-edit-ops.js + merge-back.js to FD3 for OOXML merge-back, (4) add explicit artifact derivation order section, (5) add build-pptx-from-handoff.js to FD3 for single-slide rendering, (6) create shared-constants.js for enums/validation, (7) add all 34 missing tests as requirements, (8) add parallelization guidance for per-slide derivations.

**Why:** The review identified critical gaps in file ownership, artifact derivation order, test coverage, and performance that must be addressed before implementation. Without these updates, the plan will lead to ad hoc implementation decisions, missing tests, and performance issues.

**Pros:** Makes the plan complete and unambiguous. Prevents implementation drift and ensures full test coverage from day 1.

**Cons:** Increases plan complexity slightly (adds 6 files, 34 tests).

**Context:** Identified during `/plan-eng-review` of `PPT_AGENT_EDIT_ENRICHMENT_PLAN_PART1.md` on 2026-03-26. All 8 issues were approved by the user with recommendation to choose the complete option (Completeness: 10/10 for all).

**Effort:** M
**Priority:** P1
**Depends on:** None

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

### Implement Phase 2 Edit Workflow For `ppt-agent`

**What:** Implemented the Phase 2 edit workflow for `ppt-agent`, including slide analysis, update planning, targeted slide editing scaffolding, and before-vs-after evaluation.

**Why:** The Phase 1 create path intentionally shipped first to reduce blast radius. This follow-up closes the designed product contract and keeps the edit path inside the same artifact/run-state model instead of inventing a separate system later.

**Context:** Implemented on 2026-03-25 following the Phase 2 edit-workflow design. The skill now ships `edit-run.js`, `apply-edit-run.js`, `finalize-edit-run.js`, `caption-image.js`, `summarize-doc.js`, and `eval-presentation.js` with artifact-driven Phase 2A -> Phase 2B coverage.

**Effort:** L
**Priority:** P1
**Depends on:** Phase 1 create workflow stabilization

**Completed:** v0.1.0.0 (2026-03-25)

### Implement Merge-Back Contract And Structured-Slide-Spec For ppt-agent

**What:** Implemented the OOXML merge-back algorithm (6 explicit exported step-functions) and the `structured-slide-spec.js` brief-to-spec converter as specified in `PPT_AGENT_EDIT_ENRICHMENT_PLAN_PART2.md`. Added `structured_rebuild` action dispatch in `edit-handoff.js` and validation in `update-plan.js`.

**Why:** The edit enrichment plan required a fail-closed, independently-testable merge-back contract for single-slide rebuild without triggering a full-deck re-render.

**Context:** Implemented on 2026-03-27. Includes 48 new tests covering all 4 critical fail-closed paths. Renderer integration (build-pptx-from-handoff.js + render-slide-from-spec.js) is deferred to follow-up PRs.

**Effort:** L
**Priority:** P1
**Depends on:** PPT Agent Phase 2 edit workflow

**Completed:** v0.1.8.0 (2026-03-27)
