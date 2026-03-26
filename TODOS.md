# TODOS

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

## Completed

### Implement Phase 2 Edit Workflow For `ppt-agent`

**What:** Implemented the Phase 2 edit workflow for `ppt-agent`, including slide analysis, update planning, targeted slide editing scaffolding, and before-vs-after evaluation.

**Why:** The Phase 1 create path intentionally shipped first to reduce blast radius. This follow-up closes the designed product contract and keeps the edit path inside the same artifact/run-state model instead of inventing a separate system later.

**Context:** Implemented on 2026-03-25 following the Phase 2 edit-workflow design. The skill now ships `edit-run.js`, `apply-edit-run.js`, `finalize-edit-run.js`, `caption-image.js`, `summarize-doc.js`, and `eval-presentation.js` with artifact-driven Phase 2A -> Phase 2B coverage.

**Effort:** L
**Priority:** P1
**Depends on:** Phase 1 create workflow stabilization

**Completed:** v0.1.0.0 (2026-03-25)
