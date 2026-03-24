# GRID-P4A-HYPERLINK-STYLE-001 — Phase 4a phase-contract check (advisory)

## Benchmark intent
Validate that **phase4a** outputs (subcategory-only QA draft) explicitly cover the case focus:

- **Modern grid hyperlink-style coverage separates contextual-link styling from ordinary element rendering**

This is an **advisory** phase-contract check in **blind_pre_defect** evidence mode.

## Evidence available (blind pre-defect)
From fixture Jira issue BCIN-7547:
- The feature description states: 
  - Contextual links applied to **attributes/metrics in grids** should be **discoverable and intuitive**.
  - Objects with contextual links must be **visually distinguishable** (example: **blue/underlined hyperlink styling** plus an **indicator icon**).

## Phase 4a alignment requirements (contract)
Phase 4a must produce a **subcategory-only** draft (no canonical top-layer categories), with scenarios written as:
- central topic → subcategory → scenario → atomic action chain → observable verification leaves

## Coverage expectation for this benchmark focus (must appear as Phase 4a scenarios)
To satisfy the benchmark focus, the phase4a draft should include subcategory-first scenarios that **separate**:

1) **Contextual-link styling** (only items that have contextual links get hyperlink styling and indicator)
- Scenarios that verify:
  - A grid cell representing an attribute/metric **with a contextual link** renders in hyperlink style (blue/underlined) and shows an indicator icon.
  - The styling/indicator is visible/discoverable at rest (before interaction).

2) **Ordinary element rendering** (items without contextual links must not look like hyperlinks)
- Scenarios that verify:
  - A grid cell representing an attribute/metric **without a contextual link** renders as normal text (no hyperlink styling, no indicator icon).
  - There is no “false positive” hyperlink affordance on non-linked objects.

3) **Differentiation / side-by-side comparison** (explicit separation in coverage, not implied)
- Scenarios that verify in the same grid (or same report):
  - Linked vs non-linked objects are **visually distinguishable**.
  - Toggling or changing which objects have contextual links (via configuration or data) updates the styling correspondingly (no stale styling).

## Verdict (phase_contract, advisory)
**BLOCKED (insufficient phase4a artifacts in provided evidence).**

Reason: The benchmark is specifically about whether the **phase4a output draft** demonstrates the required separation in coverage. The provided benchmark evidence includes:
- the orchestrator workflow/contracts (skill snapshot)
- the Jira feature description (fixture)

…but does **not** include any Phase 4a runtime artifacts such as:
- `drafts/qa_plan_phase4a_r1.md`
- `phase4a_spawn_manifest.json`
- `context/artifact_lookup_<feature-id>.md`
- `context/coverage_ledger_<feature-id>.md`

Without the phase4a draft, it is not possible to confirm the required **scenario-level separation** between contextual-link styling and ordinary rendering.

## What would constitute a pass for this case (phase4a)
A Phase 4a draft that contains subcategory-level scenarios (no top-layer categories like “Compatibility/Security”) including at least:
- A scenario validating **hyperlink styling + indicator icon** appears for grid cells with contextual links.
- A scenario validating **no hyperlink styling/indicator** for grid cells without contextual links.
- A scenario validating the **difference is visually clear** (discoverability) and does not bleed to ordinary elements.

---

## Short execution summary
Checked the Phase 4a contract requirements against the benchmark focus and the available BCIN-7547 fixture description. Determined the case cannot be fully evaluated because the Phase 4a draft artifact is not included in the provided evidence bundle.