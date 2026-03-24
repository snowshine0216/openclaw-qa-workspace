# GRID-P4A-BANDING-001 — Phase 4a Contract Check (advisory)

Feature: **BCIN-7231**  
Feature family / knowledge pack: **modern-grid**  
Primary phase under test: **phase4a**  
Evidence mode: **blind_pre_defect**

## Determination
**Not demonstrably satisfied for Phase 4a** with the provided benchmark evidence.

Reason: The Phase 4a contract requires a **Phase 4a subcategory-only QA draft** output (`drafts/qa_plan_phase4a_r<round>.md`) generated from required inputs (`context/artifact_lookup_...`, `context/coverage_ledger_...`, etc.). The benchmark evidence provided contains only the skill snapshot contracts plus a Jira fixture for BCIN-7231; it does **not** include the Phase 4a spawn manifest or the Phase 4a draft artifact to verify alignment.

## What Phase 4a must cover (case focus)
The case focus is: **modern grid banding scenarios** that distinguish:
1) **Styling variants** (e.g., configurable banding colors, banding by rows vs columns, applying banding based on headers)  
2) **Interactions** (e.g., toggles/controls in formatting UI, behavior changes when switching banding direction, persistence)  
3) **Backward-compatible rendering outcomes** (e.g., parity with “Report” behavior, expected rendering when banding settings exist in legacy/report definitions)

From the BCIN-7231 Jira description (fixture), the explicit gaps to cover in scenarios are:
- Cannot **format the colors** (banding color configuration)
- Cannot enable **banding in columns**
- Cannot apply banding color by **row/column header**
- Goal: bring all banding functions from **Report** to **Modern Grid** in dashboards

A Phase 4a-compliant draft should therefore be organized by **subcategories** (not top-level canonical buckets) such as:
- Banding: row banding
- Banding: column banding
- Banding: color configuration
- Banding: header-based application
- Banding: rendering parity / backward compatibility

…and each scenario must be written as **atomic nested steps** with **observable verification leaves**, while avoiding forbidden Phase 4a structure (no top-category leakage like “Compatibility/EndToEnd/Security”).

## Missing contract artifacts preventing verification
To confirm the orchestrator met the Phase 4a contract and the benchmark focus, the following are required but not present in evidence:
- `drafts/qa_plan_phase4a_r<round>.md` (primary artifact to validate)
- `phase4a_spawn_manifest.json` (to confirm script-driven spawn behavior)
- Prerequisite inputs named by the Phase 4a contract (at minimum):
  - `context/artifact_lookup_BCIN-7231.md`
  - `context/coverage_ledger_BCIN-7231.md`

## Advisory notes (phase4a alignment)
- Ensure the Phase 4a writer output remains **subcategory-first** and does not introduce canonical groupings.
- Ensure scenarios explicitly cover the banding feature deltas stated in BCIN-7231 and include **backward-compatible rendering outcomes** as observable leaves (e.g., what user sees in grid cells/headers after applying banding settings).

---

## Short execution summary
Using only the provided skill snapshot and the BCIN-7231 fixture evidence, I can restate the Phase 4a contract expectations and the banding-focused scenario areas implied by BCIN-7231, but I cannot verify Phase 4a compliance because the required Phase 4a output draft (and its prerequisite context artifacts) are not included in the benchmark evidence bundle.