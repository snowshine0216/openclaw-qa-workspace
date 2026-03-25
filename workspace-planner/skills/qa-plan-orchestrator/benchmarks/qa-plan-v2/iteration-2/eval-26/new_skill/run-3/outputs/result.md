# GRID-P1-CONTEXT-INTAKE-001 — Phase 1 (Context Intake) Contract Check

**Primary feature:** BCIN-7231  
**Feature family / knowledge pack:** modern-grid  
**Primary phase under test:** phase1  
**Evidence mode:** blind_pre_defect  
**Priority:** advisory  
**Benchmark focus:** Ensure context intake preserves **banding requirements**, **style constraints**, and **rendering assumptions** *before* scenario drafting.

## What Phase 1 must accomplish (per orchestrator contract)
Phase 1 is **spawn-planning only**:
- Generate `phase1_spawn_manifest.json` with **one spawn request per requested source family** (plus support-only Jira digestion requests when provided).
- Ensure any supporting Jira issues are explicitly routed as **`context_only_no_defect_analysis`** (context evidence only; never defect-analysis triggers).
- Do **not** draft scenarios here; only preserve/route intake context for later phases.

## Context that must be preserved for later phases (from provided fixture evidence)
From `BCIN-7231.issue.raw.json` description (Modern Grid banding parity):
- Current limitations in **Modern Grid**:
  - Banding can only be enabled in **rows**.
  - Users **cannot format colors** (style constraint / formatting gap).
  - Users **cannot enable banding in columns**.
  - Users **cannot apply banding color by row/column header** (rendering / application behavior expectation).
- Requirement direction:
  - “Bring all the banding functions to Modern Grid in dashboards.”

These items are exactly the benchmark’s target categories:
- **Banding requirements:** rows + columns banding support, header-driven application.
- **Style constraints:** ability to format/choose banding colors.
- **Rendering assumptions:** how/where banding color is applied (row/column header-driven behavior).

## Assessment against Phase 1 contract (with only provided evidence)
### What can be confirmed
- The feature evidence clearly contains the **banding + formatting + header-application** requirements that must be carried forward into context artifacts and later scenario drafting.

### What cannot be confirmed (blockers)
Because the benchmark evidence does **not** include any Phase 1 runtime outputs, we cannot verify that the orchestrator/phase1 script actually:
- Produced `phase1_spawn_manifest.json`.
- Included correct `requested_source_families` coverage and proper source routing.
- Encoded the **non-defect support policy** (if any supporting issues existed) into spawn tasks.
- Preserved the above banding/style/rendering requirements as explicit “context intake” instructions for the downstream evidence collectors.

## Advisory verdict (phase1)
**Not verifiable from provided evidence.** The requirement content to preserve is present in the fixture, but there is no Phase 1 manifest/artifact to evaluate whether the orchestrator preserved and routed these constraints correctly prior to scenario drafting.

## What would be required to pass this benchmark (phase1-specific)
To demonstrate compliance for BCIN-7231 in Phase 1, the run would need to show (at minimum):
- `./runs/BCIN-7231/phase1_spawn_manifest.json` exists.
- The spawn request(s) explicitly instruct collectors to capture evidence for:
  - row banding (existing behavior),
  - column banding (missing behavior),
  - banding color formatting (missing behavior),
  - applying banding color by row/column header (missing behavior / rendering expectation),
  - “dashboards Modern Grid” scope.
- If supporting issues are present, their spawn tasks/summaries explicitly state **`context_only_no_defect_analysis`**.

---

## Short execution summary
- Extracted the benchmark-relevant **banding/style/rendering** requirements from the provided BCIN-7231 Jira fixture.
- Compared what Phase 1 is contractually responsible for vs. what evidence is available.
- Determined Phase 1 compliance is **not verifiable** because the Phase 1 spawn manifest and post-validation outputs are not included in the evidence bundle.