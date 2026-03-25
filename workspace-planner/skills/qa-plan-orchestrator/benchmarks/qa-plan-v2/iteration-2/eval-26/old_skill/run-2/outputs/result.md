# GRID-P1-CONTEXT-INTAKE-001 — Phase 1 (Context Intake) Contract Check

**Primary feature:** BCIN-7231  
**Feature family / knowledge pack:** modern-grid  
**Primary phase under test:** phase1  
**Evidence mode:** blind_pre_defect  
**Priority:** advisory  
**Benchmark focus:** *context intake preserves banding requirements, style constraints, and rendering assumptions before scenario drafting*

## Phase 1 contract alignment (what Phase 1 must do)
Per `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md`, **Phase 1** is limited to:
- Generating **one spawn request per requested source family** (and support-only Jira digestion spawns when provided).
- Producing `phase1_spawn_manifest.json`.
- In `--post`, validating spawn policy + evidence completeness and exiting with remediation instructions if incomplete.

Therefore, for this benchmark’s “context intake preserves … before scenario drafting”, **Phase 1 success criteria** are:
1. The Phase 1 spawn plan explicitly targets evidence needed to preserve:
   - **Banding requirements** (rows/columns/header-driven banding behavior)
   - **Style constraints** (formatting/colors/customization limits)
   - **Rendering assumptions** (modern grid behavior in dashboards vs legacy Report)
2. No scenario drafting is performed in Phase 1; instead, the manifest sets up evidence capture that will later populate `context/` artifacts used by Phase 2+.

## Context intake requirements extracted from the provided fixture evidence (BCIN-7231)
From the Jira issue fixture (`BCIN-7231.issue.raw.json` description excerpt):
- Modern Grid currently supports **row banding enablement only**.
- Gaps to address (must be preserved as intake constraints/requirements):
  - Cannot **format banding colors** (style constraint)
  - Cannot enable **banding in columns** (banding requirement)
  - Cannot apply **banding color by row/column header** (banding + rendering/behavior requirement)
- Additional assumption stated: these capabilities are supported in **Report** and need to be brought to **Modern Grid in dashboards** (rendering / product-surface assumption).

Customer scope fixture (`BCIN-7231.customer-scope.json`) indicates explicit customer signal presence but does not add technical requirements beyond prioritization context.

## Phase 1 deliverable expectation for this benchmark
To satisfy this benchmark case in Phase 1, the orchestrator workflow should ensure `phase1_spawn_manifest.json` includes spawns that will collect (at minimum) the authoritative sources needed to lock the above banding/style/rendering constraints into `context/` before drafting begins.

Concretely, a Phase 1 spawn manifest that meets the benchmark focus would:
- Include a **Jira** evidence collection request for BCIN-7231 (already represented by the fixture in this benchmark, but Phase 1 must plan for it).
- If the “requested source families” include design/spec sources (not provided here), include spawns for them (e.g., Confluence spec, Figma, GitHub implementation notes) so that:
  - Banding behavior definitions (row vs column; header-driven application) are captured
  - Styling constraints (color formatting rules) are captured
  - Rendering assumptions (dashboard modern grid vs Report parity, any known differences) are captured

## Benchmark verdict (based only on provided evidence)
**Verdict: INDETERMINATE (insufficient Phase 1 runtime artifacts provided).**

Reasoning:
- The provided evidence includes the **skill snapshot** (which defines the Phase 1 contract) and **fixture data** for BCIN-7231 (which contains the banding/style/rendering requirements).
- However, **no Phase 1 runtime outputs** are included in the evidence bundle (notably `phase1_spawn_manifest.json`, nor any `context/` artifacts produced by spawned source-family collectors).
- Without the Phase 1 spawn manifest, we cannot verify that context intake *operationally* preserved these requirements (i.e., that Phase 1 planned and routed evidence gathering correctly) before scenario drafting.

## What would demonstrate pass (artifact-level acceptance, Phase 1 only)
If available, review of `phase1_spawn_manifest.json` would be sufficient to mark this benchmark **PASS** if it:
- Spawns Jira collection for BCIN-7231 (and any required linked/support context if specified).
- Spawns all requested source families relevant to modern-grid banding parity (spec/design/implementation), ensuring the workflow captures:
  - Row vs column banding enablement
  - Banding color formatting capabilities/constraints
  - Header-driven banding application behavior
  - Dashboard Modern Grid parity assumptions vs Report

If the manifest omitted evidence sources beyond Jira when they are required/declared requested, or routed them incorrectly, this benchmark would **FAIL** for Phase 1.

---

## Short execution summary
Checked the Phase 1 contract from the skill snapshot and extracted the benchmark-relevant banding/style/rendering constraints from the BCIN-7231 fixture. No Phase 1 runtime artifact (especially `phase1_spawn_manifest.json`) was provided, so compliance with “context intake preserves … before scenario drafting” cannot be fully verified and is marked **indeterminate**.