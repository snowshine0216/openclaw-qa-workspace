# VIZ-P5B-CHECKPOINT-001 — Phase5b Checkpoint Enforcement (BCVE-6797)

## Benchmark intent (advisory, checkpoint enforcement)
Validate that **Phase 5b** (shipment checkpoint review + refactor) can explicitly cover and gate the case focus:
- **Highlight activation**
- **Highlight persistence**
- **Highlight deselection**
- **Interaction safety**

…for both:
- **Bar chart**
- **Heatmap**

Feature under test: **BCVE-6797** (visualization family).

## Evidence available (blind_pre_defect)
From the provided fixture bundle:
- BCVE-6797 links to two cloned feature issues:
  - **BCIN-7329** — “Optimize the highlight effect for Visualizations Bar Chart”
  - **BCDA-8396** — “Optimize the highlight effect for Visualizations - Heatmap”

This is sufficient evidence that **shipment checkpoints must explicitly include highlight-effect behavior** for bar chart and heatmap.

## Phase5b contract alignment (what must exist / be enforced)
Per `references/review-rubric-phase5b.md` (authoritative):

### Required Phase 5b outputs
- `context/checkpoint_audit_<feature-id>.md`
- `context/checkpoint_delta_<feature-id>.md`
- `drafts/qa_plan_phase5b_r<round>.md`

### Required Phase 5b behaviors relevant to this benchmark
- Phase 5b is a **shipment-readiness checkpoint pass** after Phase 5a.
- It must **evaluate every checkpoint** and **refactor the plan** for checkpoint-backed gaps that are fixable in-round.
- It must provide a **Release Recommendation** consistent with checkpoint findings.
- `checkpoint_delta` must end with an explicit disposition: **`accept` / `return phase5a` / `return phase5b`**.

## Checkpoint enforcement for the case focus (advisory)
To satisfy this benchmark case, Phase 5b must ensure the QA plan draft includes explicit, testable coverage for the highlight lifecycle + interaction safety for both bar chart and heatmap.

### What “explicitly covered” means for Phase 5b
In Phase 5b terms, the checkpoint review must:
1. **Detect gaps** (if the Phase 5a plan draft lacks these behaviors).
2. **Refactor the plan** in the Phase 5b draft to add scenarios/steps for:
   - Bar chart highlight: activation, persistence, deselection, interaction safety
   - Heatmap highlight: activation, persistence, deselection, interaction safety
3. Record the change in:
   - `checkpoint_audit` (as advisory checkpoint notes if not blocking)
   - `checkpoint_delta` (what was added/changed and why)
4. If not addressable within Phase 5b (e.g., foundational plan structure issues), route via:
   - `return phase5a` (foundational issues)
   - `return phase5b` (still incomplete shipment-checkpoint fixes)

### Concrete plan coverage that Phase 5b should enforce (minimum expectations)
The Phase 5b reviewed/refactored plan should contain scenarios that at least cover:

#### Bar chart — highlight lifecycle
- Activation
  - Tap/click a bar to highlight
  - Multi-series / stacked behavior (if applicable) does not produce inconsistent highlight state
- Persistence
  - Highlight remains after minor interactions (e.g., tooltip open/close, axis label interaction) unless expected to clear
  - Highlight state remains stable across scroll/pan/zoom (if supported)
- Deselection
  - Tap/click on empty space clears highlight
  - Tapping the same bar again toggles off (if expected) or keeps selected (if expected)—must be asserted
- Interaction safety
  - No crash/freeze when rapidly selecting different bars
  - No stuck state when interacting with legend/filter controls while highlighted

#### Heatmap — highlight lifecycle
- Activation
  - Tap/click a cell to highlight
  - If row/column header interactions exist: confirm highlight applies only to the intended element
- Persistence
  - Highlight persists through tooltip interactions and minor navigation within the viz container
- Deselection
  - Clear highlight via tapping empty space or a second tap (per intended behavior)
- Interaction safety
  - Rapid cell switching does not cause incorrect highlight overlays or lag
  - No inconsistent highlight when the heatmap re-renders (e.g., resizing container)

## Benchmark verdict (against the orchestrator’s phase model)
### Pass criteria (this benchmark)
This benchmark is satisfied if the **Phase 5b checkpoint mechanism is explicitly the phase used to enforce shipment readiness coverage** and it is contractually required to:
- produce the Phase 5b checkpoint artifacts
- gate acceptance via `checkpoint_delta` disposition
- drive refactors for shipment-readiness gaps

### Assessment with provided evidence
- The Phase 5b rubric explicitly mandates shipment checkpoints and a checkpoint audit/delta with disposition.
- The fixture evidence ties BCVE-6797 to **highlight effect optimization** in both **bar chart** and **heatmap**, making the stated focus appropriate and enforceable at Phase 5b.

Given the evidence available in this benchmark (workflow contract + feature linkage evidence), **Phase 5b is correctly positioned and contractually capable of enforcing this checkpoint focus**.

**Result: PASS (advisory checkpoint enforcement is supported and aligned to Phase 5b).**

---

## Short execution summary
Used only provided benchmark evidence to verify that the Phase 5b shipment-checkpoint contract requires checkpoint audit/delta + disposition gating and can enforce explicit plan coverage for highlight activation/persistence/deselection/interaction safety for bar chart and heatmap, supported by BCVE-6797’s linked highlight-focused issues (BCIN-7329, BCDA-8396).