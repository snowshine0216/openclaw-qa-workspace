# TODOS

## DONE: Implement Phase 2 Edit Workflow For `ppt-agent`

**What:** Implemented the Phase 2 edit workflow for `ppt-agent`, including slide analysis, update planning, targeted slide editing scaffolding, and before-vs-after evaluation.

**Concrete design:** See [PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN.md) and review artifacts [PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN_REVIEW.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN_REVIEW.md), [PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN_REVIEW.json](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN_REVIEW.json).

**Why:** The current plan intentionally shipped Phase 1 create-mode first to reduce blast radius. This follow-up closes the designed product contract and keeps the edit path inside the same artifact/run-state model instead of inventing a separate system later.

**Pros:**
- completes the product contract described in [PPT_AGENT_SKILL_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_SKILL_DESIGN.md)
- reuses the create-mode architecture and evaluation patterns instead of inventing a separate later system
- gives users a style-preserving update path for existing decks

**Cons:**
- higher implementation risk than create-mode because it depends on conversion, analysis, preservation rules, and comparison logic
- larger test surface and more failure modes

**Context:** Implemented on 2026-03-25 following [PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN.md). The skill now ships `edit-run.js`, `apply-edit-run.js`, `finalize-edit-run.js`, `caption-image.js`, `summarize-doc.js`, and `eval-presentation.js` with artifact-driven Phase 2A -> Phase 2B coverage.

**Depends on / blocked by:** Completed after Phase 1 create workflow stabilization.

## TODO: Lock The Phase 1 Create-Mode Build Path And `pptx` Integration Contract

**What:** Make the Phase 1 create workflow explicit about whether deck production is primarily scratch generation through `pptx`, template-editing-first, or another concrete path, and document the exact boundary between `ppt-agent` orchestration and `pptx` mechanics.

**Why:** The outside-voice review found that the plan still says references/templates are used when available without fully defining how they change the actual build path. That ambiguity is an architectural risk because different implementers can make incompatible assumptions about how create-mode works.

**Pros:**
- removes the biggest remaining Phase 1 architecture ambiguity
- prevents drift between `ppt-agent` orchestration logic and `pptx` implementation mechanics
- makes test scope and failure handling more concrete

**Cons:**
- requires one more explicit architectural decision before implementation
- may force small plan edits across workflow, test, and documentation sections

**Context:** The current plan correctly says `ppt-agent` owns orchestration and `pptx` owns mechanics, but it does not fully lock what the dominant create-mode assembly path is. This was flagged by the independent outside-voice review as the highest-severity remaining gap.

**Depends on / blocked by:** Should be resolved before Phase 1 implementation starts, because it affects workflow sequencing, the test plan, and the contract between `SKILL.md` and the `pptx` dependency.

## TODO: Define A Concrete Run-State And Artifact-Manifest Contract For Phase 1

**What:** Define the run-state model for `ppt-agent` Phase 1, including artifact directory layout, naming/versioning, cache keying, resume/discovery behavior, and invalidation rules for intermediate outputs.

**Why:** The plan now has a reuse policy, but it still does not define the concrete storage and lookup contract that makes reuse real. Without that, implementation will either fake idempotency or invent inconsistent artifact behavior ad hoc.

**Pros:**
- turns the reuse policy into an implementable contract
- makes retries and partial reruns predictable
- reduces the chance of stale or mismatched artifacts contaminating a run

**Cons:**
- adds one more explicit systems-design step before implementation
- may require coordinated updates to workflow, tests, and documentation

**Context:** The independent outside-voice review flagged the current reuse/idempotency story as too abstract. The plan says which artifacts should be reusable, but not where they live, how they are keyed, or how a later run finds and validates them. That is a Phase 1 engineering concern because the create workflow already includes refinement loops and partial reruns.

**Depends on / blocked by:** Should be resolved before Phase 1 implementation if artifact reuse is treated as a real feature rather than a best-effort optimization. It also depends on the create-mode build path being clearly locked, because artifact boundaries follow the chosen build path.

## TODO: Create A Repo-Level `DESIGN.md` For Presentation Output And Review Artifacts

**What:** Create a shared `DESIGN.md` that defines the design-system rules for presentation-related output and human-facing review artifacts in this repository.

**Why:** The `ppt-agent` Phase 2 design had to define its own local design-alignment rules because there is no repo-level design source of truth. A shared `DESIGN.md` would reduce repeated ambiguity in future presentation and review plans.

**Pros:**
- gives future plans a single design authority instead of repeating local design rules
- reduces drift between create-mode, edit-mode, and review-artifact presentation behavior
- makes later design reviews faster because alignment rules already exist

**Cons:**
- adds up-front design-system work outside the immediate Phase 2 implementation scope
- may require reconciling different presentation and reporting patterns already present in the repo

**Context:** During `/plan-design-review` of [PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN.md](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/docs/PPT_AGENT_PHASE2_EDIT_WORKFLOW_DESIGN.md), no repo-level `DESIGN.md` was found. The Phase 2 plan is now design-complete on its own, but future presentation-related plans will face the same design-authority question unless a shared design system is created.

**Depends on / blocked by:** Not blocked by Phase 2 implementation. Should be done before a second major presentation or review-artifact workflow is designed, so design rules do not fork across plans.
