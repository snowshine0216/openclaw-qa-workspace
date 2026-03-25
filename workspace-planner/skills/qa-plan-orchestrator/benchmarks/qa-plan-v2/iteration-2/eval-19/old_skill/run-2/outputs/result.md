# Benchmark Assessment — VIZ-P4A-HEATMAP-HIGHLIGHT-001 (BCVE-6797)

## Verdict (phase4a / advisory)
**Not satisfied (insufficient evidence).**

The benchmark expects **Phase 4a** output coverage for **heatmap highlighting effect scenarios** explicitly covering:
- **activation** (how highlight starts)
- **persistence** (how long it stays / what interactions keep it)
- **reset behavior** (how it clears)

Under the provided **blind_pre_defect** evidence, there is **no Phase 4a artifact** (e.g., `drafts/qa_plan_phase4a_r1.md`) and no Phase 4a spawn output to confirm that these scenarios are authored at the **subcategory-only** level required by the **Phase 4a contract**.

## What can be asserted from the evidence (and what cannot)
### Confirmed from fixture evidence
- Feature under test: **BCVE-6797** (visualization family)
- Linked work indicates the target behavior area includes **iOS heatmap highlight effect**:
  - **BCDA-8396**: *“iOS mobile - Optimize the highlight effect for Visualizations - Heatmap”*

### Not present in the benchmark evidence
- Any Phase 4a draft (`drafts/qa_plan_phase4a_r<round>.md`) to inspect for:
  - explicit scenarios for highlight activation/persistence/reset
  - Phase 4a structure compliance (subcategory-only, atomic steps, observable leaves)
- Any `context/coverage_ledger_<feature-id>.md` or `context/artifact_lookup_<feature-id>.md` to show mapped coverage supporting those scenarios

## Phase4a alignment check (contract-level)
The Phase 4a contract requires a **subcategory-only QA draft** and forbids canonical top-level grouping. Because the Phase 4a draft artifact is not included in evidence, **alignment to phase4a cannot be demonstrated**.

## Blockers to passing this benchmark
1. Missing Phase 4a deliverable evidence:
   - `drafts/qa_plan_phase4a_r1.md` (or later round)
2. Missing Phase 4a required inputs evidence:
   - `context/artifact_lookup_BCVE-6797.md`
   - `context/coverage_ledger_BCVE-6797.md`

## Minimal Phase 4a scenario set expected for this case focus (for evaluation criteria)
If the Phase 4a draft were available, the benchmark’s focus would be considered explicitly covered only if it includes heatmap highlight scenarios such as:
- **Heatmap highlight activation**
  - Tap a single cell → highlight applied; non-selected cells dim (or equivalent observable effect)
  - Tap a row/column header (if supported) → corresponding highlight applied
- **Heatmap highlight persistence**
  - Highlight remains while panning/scrolling within the visualization
  - Highlight remains after transient UI actions (e.g., tooltip open/close) if designed
- **Heatmap highlight reset behavior**
  - Tap empty space / tap selected cell again → highlight cleared
  - Switch to a different visualization / navigate away and back → highlight cleared or restored (explicitly defined)
  - Apply a filter / change attribute selection → highlight updates or clears (explicitly defined)

(These must appear as **subcategory → scenario → atomic action chain → observable verification leaves**, consistent with Phase 4a rules.)