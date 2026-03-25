# GRID-P1-CONTEXT-INTAKE-001 — Phase 1 Context Intake Contract Check

**Primary feature:** BCIN-7231  
**Feature family / knowledge pack:** modern-grid  
**Primary phase under test:** phase1  
**Evidence mode:** blind_pre_defect  
**Priority:** advisory  
**Benchmark focus:** *Context intake preserves banding requirements, style constraints, and rendering assumptions before scenario drafting.*

## Phase 1 contract alignment (what Phase 1 must do)
Per the skill snapshot, **Phase 1 is limited to generating a spawn manifest** (one request per requested source family, plus support-only Jira digestion requests when provided) and then validating spawn policy/evidence completeness in `--post`. Phase 1 **does not draft scenarios**.

Therefore, to satisfy this benchmark’s focus, Phase 1 must ensure that the **evidence collection spawned in Phase 1 will capture** (and preserve into `context/`) the key *banding requirements*, *style constraints*, and *rendering assumptions* from the primary feature before any drafting begins in later phases.

## Context intake must preserve (from provided evidence)
From the fixture Jira issue JSON for **BCIN-7231**, the description states the current Modern Grid limitations and the intended requirement expansion:

- Current limitations in Modern Grid (must be captured as “as-is” baseline):
  - Banding can only be enabled in **rows**.
  - Users cannot **format the colors**.
  - Users cannot enable banding in **columns**.
  - Users cannot apply banding color by **row/column header**.
- Target requirement (must be captured as “to-be” intent):
  - “Bring **all the banding functions** to Modern Grid in dashboards.”

These statements directly map to the benchmark focus:
- **Banding requirements:** row banding + column banding + header-driven banding behavior.
- **Style constraints:** ability to format banding colors.
- **Rendering assumptions:** banding affects grid readability; implies visual rendering/striping behavior across rows/columns and possibly headers.

## Phase 1 deliverable expectation for this benchmark
To be aligned with **Phase 1**, the orchestrator should produce (via the Phase 1 script) a `phase1_spawn_manifest.json` that, at minimum:

1. **Includes a Jira evidence request** for the primary feature BCIN-7231 (source family: `jira`), so the banding/style/rendering requirements are preserved as source-of-truth evidence under `context/`.
2. If there are supporting issues (none are present in the provided fixture), Phase 1 would additionally spawn **support-only Jira digestion** in `context_only_no_defect_analysis` mode; however, **no supporting keys are provided in the benchmark evidence**, so this cannot be asserted here.

## Assessment (based only on provided benchmark evidence)
### What can be verified
- The skill snapshot clearly defines Phase 1 scope: **spawn manifest generation** + `--post` validation.
- The fixture provides enough primary-feature context to define what must be preserved during intake: row/column banding, color formatting, header-based application.

### What cannot be verified from the provided evidence
- The actual contents of `phase1_spawn_manifest.json` for this run are not included in the benchmark evidence bundle.
- The list of “requested source families” for BCIN-7231 (from `task.json`) is not included; thus we cannot confirm whether the orchestrator would request additional evidence sources beyond Jira.

## Advisory verdict for the benchmark focus (phase1)
**Status:** *Inconclusive based on evidence provided* (advisory)

Rationale: The benchmark requires demonstrating that Phase 1 context intake preserves banding/style/rendering assumptions *before scenario drafting*. The evidence provided includes the requirements to preserve (from Jira), and the Phase 1 contract indicating that preservation happens by spawning the right evidence collection. However, without the produced `phase1_spawn_manifest.json` (or Phase 1 script stdout), we cannot confirm the orchestrator actually spawned the Jira collection necessary to preserve these requirements into `context/`.

## Minimal acceptance criteria for Phase 1 (to satisfy this case)
If the Phase 1 outputs were available, this case would be satisfied by confirming:
- `phase1_spawn_manifest.json` contains a `jira` request that targets **BCIN-7231**.
- The spawned Jira digestion persists the issue evidence under `context/` such that downstream phases can reference:
  - row banding vs column banding requirements,
  - banding color formatting requirements,
  - header-based banding application requirements,
  - and the visual readability/rendering motivation.

---

## Execution summary
- Reviewed the **qa-plan-orchestrator** Phase 1 contract from `SKILL.md` / `reference.md`.
- Extracted the benchmark-focus requirements (banding/style/rendering) from the provided **BCIN-7231** fixture Jira JSON.
- Could not verify the actual Phase 1 spawn manifest because it is not included in the provided benchmark evidence; therefore the benchmark result is **inconclusive** under blind pre-defect evidence mode.