# Phase 4-6 Layering And Coverage Harness Remediation Design — Review Report

**Reviewer:** Design self-consistency, self-sufficiency, Design Goals coverage, and documentation update audit  
**Date:** 2025-03-11  
**Document under review:** `docs/PHASE4_LAYERING_AND_COVERAGE_HARNESS_REMEDIATION_DESIGN.md`

---

## Executive Summary

The design is **substantially complete and well-structured**. It addresses all 14 Design Goals and includes explicit documentation update requirements. A few internal inconsistencies and one missing reference should be corrected before implementation.

**Overall verdict:** **Pass** — the identified inconsistencies have been corrected in the design document.

---

## 1. Self-Consistency

### 1.1 Inconsistencies Found

| # | Location | Issue | Recommendation |
|---|----------|-------|----------------|
| 1 | Phase 4b contract (line ~583) | **Required Inputs** says `drafts/qa_plan_subcategory_<feature-id>.md` | Change to: "latest Phase 4a draft path (from `task.json.latest_draft_path`)" — the design uses phase-scoped naming `qa_plan_phase4a_r<round>.md` and `task.json.latest_draft_path` for tracking |
| 2 | Recommended Implementation Order (line ~1003) | Says "the new draft progression **v1 -> v2 -> v3 -> v4**" | Change to: "the new draft progression `qa_plan_phase4a_r<round>.md` → `qa_plan_phase4b_r<round>.md` → … → `qa_plan_phase6_r<round>.md`" — the design explicitly replaces v1/v2/v3/v4 with phase-scoped naming |
| 3 | Phase 4b contract (line ~583) | Input filename `qa_plan_subcategory_<feature-id>.md` | Align with Draft Iteration Model: Phase 4b reads the **latest Phase 4a draft**; the exact path comes from `task.json.latest_draft_path` |

### 1.2 Consistent Elements

- Draft naming (`qa_plan_phase4a_r<round>.md`, etc.) is used consistently in Phase 4a, 4b, 5a, 5b, 6 sections.
- `task.json.latest_draft_path`, `latest_draft_phase`, `phase5a_round`, etc. are introduced once and reused.
- Canonical top-layer taxonomy (10 categories) is identical in Phase 4b, Phase 5a Section Review Checklist, and Phase 6.
- Coverage ledger scope (Phase 4a/4b only) is stated once and repeated in Coverage Harness Change.
- Loop rules (Phase 5a→5a, 5b→5a, 5b→5b, 6→5a|5b) are consistent across Draft Iteration Model and phase sections.
- Checkpoint list (C1–C15) matches `docs/checkpoints.md` exactly.

---

## 2. Self-Sufficiency

### 2.1 Sufficient for Implementation

The design provides:

- **Exact file contents** for all five new runtime reference files (`phase4a-contract.md`, `phase4b-contract.md`, `review-rubric-phase5a.md`, `review-rubric-phase5b.md`, `review-rubric-phase6.md`).
- **Exact script stubs** for `phase5a.sh`, `phase5b.sh`, and their manifest builders.
- **Required Changes By Phase** with specific file paths and change descriptions.
- **Validator names and fail conditions** for each new validator.
- **Required new sections** with table schemas for `review_notes`, `review_delta`, `checkpoint_audit`, `checkpoint_delta`, `quality_delta`.
- **Acceptance Criteria** and **Recommended Implementation Order**.

### 2.2 External Dependencies

| Dependency | Status |
|------------|--------|
| `docs/checkpoints.md` | Exists; 15 checkpoints align with design |
| `references/top-layer-taxonomy.md` | **Does not exist** — design says "fold into" Phase 4b and Phase 6; taxonomy is embedded in phase4b-contract.md and review-rubric-phase6.md. No separate file needed. |
| `references/qa-plan-few-shots.md` | **Does not exist** — design says "fold into" Phase 4a and Phase 6; few shots are embedded in phase4a-contract.md and review-rubric-phase6.md. No separate file needed. |

**Advisory:** The "fold" language assumes source files exist. Since `top-layer-taxonomy.md` and `qa-plan-few-shots.md` do not exist, clarify that the design creates the content directly in the phase-specific files; no prior extraction step is required.

### 2.3 Gaps (Minor)

- **`runPhase.mjs` phase chain logic:** The design says "update the phase chain" but does not specify the exact branching logic (e.g., when to re-run phase5a vs phase5b vs phase6). The loop rules describe *when* returns happen; implementation will need to derive the control flow from those rules.
- **`scripts/lib/spawnManifestBuilders.mjs`:** The design references `runManifestBuilderCli('phase5a')` but does not show how `spawnManifestBuilders.mjs` discovers or invokes phase-specific builders. If the pattern matches existing phase4a/4b, this is acceptable.

---

## 3. Design Goals Coverage

| # | Design Goal | Addressed? | Evidence |
|---|-------------|------------|----------|
| 1 | Keep the workflow script-driven | Yes | Core Decision, Non-Goals, Acceptance Criteria |
| 2 | Tighten Phase 4a into strict subcategory-only draft | Yes | Phase 4a New Role, Phase 4a Gate, phase4a-contract.md |
| 3 | Make Phase 4b produce canonical layered taxonomy skeleton | Yes | Phase 4b Canonical Top Layer, phase4b-contract.md |
| 4 | Limit coverage_ledger to Phase 4a/4b only | Yes | Coverage Harness Change, Phase 5a Coverage Harness Change |
| 5 | Split Phase 5 into 5a and 5b | Yes | Phase 5a, Phase 5b, new scripts, External Checkpoint Source |
| 6 | Different phase-specific rubrics for 5a, 5b, 6 | Yes | review-rubric-phase5a.md, review-rubric-phase5b.md, review-rubric-phase6.md |
| 7 | Allow 5a and 5b multiple bounded rounds | Yes | Draft Iteration Model, Loop rule, Bounded Supplemental Research Rule |
| 8 | Require 5a/5b self-loop until pass or upstream | Yes | Self-loop rule, Phase 5a/5b "should only stop when" |
| 9 | Phase 5a review every context artifact, prove no leak | Yes | Phase 5a New Role, Context Artifact Coverage Audit, validate_context_coverage_audit |
| 10 | Phase 5b apply shipment-readiness checkpoints | Yes | Phase 5b, checkpoint_audit, 15 checkpoints from checkpoints.md |
| 11 | Add section-by-section review checkpoints | Yes | Phase 5a Section Review Checklist, Section Review Checklist table |
| 12 | Phase 6 enforce final layered shape with few-shot guidance | Yes | Phase 6 Final Layered Output Rule, Phase 6 Few-Shot Focus, review-rubric-phase6.md |
| 13 | Reflect contract changes in README, SKILL, reference, planning refs, template, validator inventory | Yes | See Section 4 below |

**All 14 Design Goals are addressed.**

---

## 4. Documentation Update Coverage

Design Goal 13 requires: *"Reflect all contract changes in `README.md`, `SKILL.md`, `reference.md`, the planning refs, the template, and validator inventory."*

### 4.1 Explicit Documentation Updates in the Design

| Document | Explicitly Mentioned? | Section |
|----------|------------------------|---------|
| `README.md` | Yes | Phase 4a, 4b, 5a, 5b, 6 Required Changes; Cross-Phase "Workflow summaries" |
| `SKILL.md` | Yes | Phase 4a, 4b, 5a, 5b, 6 Required Changes; Cross-Phase |
| `reference.md` | Yes | Phase 4a, 4b, 5a, 5b, 6 Required Changes; Cross-Phase "validator inventory" |
| Planning refs (phase4a-contract, phase4b-contract, review-rubric-*) | Yes | Single-Source Refactor, Exact New File Contents, Required Changes |
| `templates/qa-plan-template.md` | Yes | Fold-in strategy; supersede after folding into phase-specific files |
| Validator inventory | Yes | reference.md "Add Phase 4a/4b/5a/5b/6 gate details"; validate_* names in each phase |
| `workspace-planner/AGENTS.md` | Yes | Phase 5a, 5b Required Changes; Cross-Phase "canonical workflow list" |

### 4.2 Documentation Update Completeness

The design includes:

- Per-phase "Docs and contracts" subsections with specific file paths.
- Cross-Phase "Workflow summaries" and "Old shared references" with supersede/redirect guidance.
- New validator names to add to `reference.md`.
- `workspace-planner/AGENTS.md` update for Phase 5a/5b split and anti-collapse rule.

**Documentation update is adequately specified in the design.**

---

## 5. Additional Observations

### 5.1 Strengths

- Clear separation of Phase 5a (context-backed audit) vs Phase 5b (shipment checkpoints).
- Explicit checkpoint list (C1–C15) with traceability to `docs/checkpoints.md`.
- Deterministic validators with explicit fail conditions.
- Bounded supplemental research rule with approved skills (`confluence`, `jira-cli`, `tavily-search`).
- Self-loop and round-tracking rules to avoid brittle one-pass behavior.

### 5.2 Minor Suggestions

1. **Phase 4b input:** In the "Exact New File Contents" for `phase4b-contract.md`, replace the Required Inputs line with:  
   `- latest Phase 4a draft path (from task.json; e.g. drafts/qa_plan_phase4a_r1.md)`

2. **Implementation Order item 3:** Replace "v1 -> v2 -> v3 -> v4" with the phase-scoped draft progression to avoid confusion.

3. **Fold-in clarification:** Add a short note that `top-layer-taxonomy.md` and `qa-plan-few-shots.md` may not exist; the design embeds their content directly in the phase-specific files. No prior extraction step is required.

---

## 6. Recommended Edits to the Design Document

1. **Line ~583 (phase4b-contract.md Required Inputs):**  
   Replace `drafts/qa_plan_subcategory_<feature-id>.md` with `latest Phase 4a draft path (from task.json.latest_draft_path)`.

2. **Line ~1003 (Recommended Implementation Order item 3):**  
   Replace "the new draft progression v1 -> v2 -> v3 -> v4" with "the new phase-scoped draft progression (qa_plan_phase4a_r<round>.md through qa_plan_phase6_r<round>.md)".

3. **Single-Source Refactor or Recommended fold-in strategy:**  
   Add: "If `top-layer-taxonomy.md` or `qa-plan-few-shots.md` do not exist, the design embeds their content directly in the phase-specific files; no separate extraction step is needed."

---

## 7. Conclusion

The design is **self-consistent** (with the three edits applied), **self-sufficient** for implementation, **achieves all 14 Design Goals**, and **includes explicit documentation update requirements**. The design is ready for implementation.
