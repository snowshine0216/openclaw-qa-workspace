# GRID-P1-CONTEXT-INTAKE-001 — Phase 1 Contract Check (BCIN-7231)

## Benchmark intent (phase1, advisory)
Verify that **context intake** for feature **BCIN-7231** (feature family: **modern-grid**) preserves the **banding requirements**, **style constraints**, and **rendering assumptions** *before* any scenario drafting occurs, and that the workflow/output aligns with the **Phase 1** orchestrator contract.

## What Phase 1 is contractually responsible for (from skill snapshot)
Per `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md`, **Phase 1**:
- Generates a **spawn request per requested source family** (plus support-only Jira digestion requests if provided).
- Produces **only**: `phase1_spawn_manifest.json`.
- After spawns, Phase 1 `--post` validates: spawn policy, evidence completeness, support relation map/summaries, and non-defect routing.

**Key benchmark focus mapping to Phase 1:**
- “Preserves banding requirements, style constraints, rendering assumptions before scenario drafting” must be achieved by ensuring Phase 1’s evidence intake/spawn plan explicitly targets sources that can capture these requirements/constraints/assumptions and persists them under `context/` (later indexed in Phase 2), rather than losing them or deferring them implicitly.

## Evidence available in this benchmark bundle (blind_pre_defect)
From fixture evidence for **BCIN-7231**:
- Jira description states current Modern Grid limitations and target capability expansion:
  - user can only enable **banding in rows**
  - cannot **format colors**
  - cannot enable **banding in columns**
  - cannot apply banding color by **row/column header**
  - goal: bring banding functions to Modern Grid in dashboards

This is strong **requirements** signal, but it is not yet a complete capture of:
- precise **style constraints** (e.g., color rules, theme interactions, formatting precedence)
- concrete **rendering assumptions** (e.g., export/print behavior, virtualization, performance, density modes)

## Phase 1 deliverable presence and alignment
### Required Phase 1 artifact
- `phase1_spawn_manifest.json`

### Assessment (based on provided benchmark evidence only)
- **FAIL (cannot verify / artifact missing in evidence):** The benchmark evidence provided does **not** include `phase1_spawn_manifest.json` (or any run directory artifacts under `runs/BCIN-7231/`).
- Because the manifest is the sole Phase 1 output, the benchmark cannot confirm that Phase 1 correctly planned context intake to preserve:
  - banding requirements
  - style constraints
  - rendering assumptions

## What would have been required to pass this benchmark (Phase 1 expectations)
To satisfy “context intake preserves … before scenario drafting” at Phase 1, the manifest would need to show spawn requests that explicitly gather/record:
- **Authoritative requirements** (Jira feature + any linked design/spec sources)
- **Style/formatting constraints** sources (e.g., product doc, design system, formatting rules)
- **Rendering assumptions** sources (e.g., grid rendering behavior documentation, platform constraints)

At minimum, given the Jira description, Phase 1 context intake should ensure evidence collection covers:
- row/column banding enablement requirements
- banding color formatting requirements
- applying banding color by row/column header requirements

…but without the Phase 1 manifest and resulting context artifacts, compliance cannot be demonstrated.

## Conclusion (phase1, advisory)
- **Benchmark outcome:** **Not Demonstrated / Blocked by missing Phase 1 artifact in provided evidence**.
- **Reason:** Phase 1 contract centers on producing `phase1_spawn_manifest.json`; it is not present in the evidence bundle, so we cannot verify that the orchestrator preserved banding/style/rendering context intake requirements prior to scenario drafting.