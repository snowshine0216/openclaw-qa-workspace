# GRID-P1-CONTEXT-INTAKE-001 — Phase 1 (Context Intake) Contract Check

**Benchmark feature:** BCIN-7231  
**Feature family / knowledge pack:** modern-grid  
**Primary phase under test:** phase1  
**Evidence mode:** blind_pre_defect  
**Priority:** advisory  
**Benchmark profile:** global-cross-feature-v1  
**Focus:** Ensure **context intake** preserves **banding requirements, style constraints, and rendering assumptions** *before* any scenario drafting.

## What Phase 1 must do (per orchestrator contract)
Per the skill snapshot contract, **Phase 1 is limited to evidence-intake spawning**:
- Run `scripts/phase1.sh` to **generate `phase1_spawn_manifest.json`** with **one spawn request per requested source family** plus any **support-only Jira digestion** requests.
- After spawns complete, Phase 1 `--post` must validate:
  - spawn policy
  - evidence completeness
  - supporting issue relation map + summaries (if supporting issues exist)
  - **non-defect routing** for support-only issues

Critically for this benchmark’s focus: Phase 1 must ensure the intake work **captures the requirements context** (here: modern-grid banding) and stores it as evidence under `context/` so later phases draft scenarios with the correct constraints.

## Context intake requirements detected from the provided BCIN-7231 evidence
From the fixture Jira issue content for **BCIN-7231**:
- Current modern grid limitation statement (existing behavior):
  - banding can only be enabled in **rows**
  - cannot **format banding colors**
  - cannot enable banding in **columns**
  - cannot apply banding color by **row/column header**
- Desired state: “bring all the banding functions to Modern Grid in dashboards.”

These are the key **banding requirements** that context intake must preserve as evidence for later scenario drafting.

## Phase 1 alignment to benchmark focus (banding + style + rendering)
### Banding requirements
- The evidence bundle explicitly contains the banding requirements at a **high-level functional** layer (rows/columns enablement, color formatting, header-based application).
- Phase 1’s contract supports preserving this by spawning the Jira evidence ingestion so the raw content and any extracted summary can be saved under `context/`.

### Style constraints & rendering assumptions
- The provided evidence excerpt does **not** enumerate explicit UI style constraints (e.g., theme interactions, accessibility contrast rules, conditional formatting precedence) or rendering assumptions (e.g., virtualization behavior, export/print parity, pixel alignment) beyond the functional limitations.
- Under the phase1 contract, the correct response is not to invent these constraints during Phase 1, but to ensure evidence intake is set up such that:
  - Jira descriptions/attachments/spec links (if present in the issue) are pulled into `context/`
  - any additional source families (e.g., Confluence spec, Figma) are requested via spawn manifest **if they are part of the requested source families**

## Pass/Fail determination for this benchmark case (phase1 contract)
**Status: Advisory PASS (contract-level), with an evidence-scope caveat.**

- **PASS (Phase 1 contract alignment):** The orchestrator’s Phase 1 responsibilities and outputs (spawn manifest, evidence completeness validation, context-only support routing) are consistent with “context intake before scenario drafting.”
- **Caveat (evidence completeness vs. benchmark focus):** Within the provided blind bundle excerpt, only functional banding requirements are explicitly visible. Explicit **style constraints** and **rendering assumptions** are not demonstrated in the provided evidence; therefore, Phase 1 can only preserve what is present/collectable from sources. The benchmark expectation is satisfied at the orchestration-contract level (Phase 1 spawns evidence collection and validates completeness), but the evidence shown here does not prove the presence of additional style/rendering constraints.

## What should exist after Phase 1 completes (to satisfy the intent)
Based on the contract, Phase 1 should result in:
- `phase1_spawn_manifest.json` that includes at least Jira ingestion for BCIN-7231 as a requested source family
- evidence artifacts saved under `context/` representing BCIN-7231’s banding requirements (raw issue content and/or extracted summary)
- if supporting issues were specified (none are shown in the provided fixture), then:
  - `context/supporting_issue_relation_map_BCIN-7231.md`
  - `context/supporting_issue_summary_<issue-key>_BCIN-7231.md` and/or `context/supporting_issue_summary_BCIN-7231.md`

---

## Execution summary (short)
- Reviewed the phase1 contract in the skill snapshot and checked the provided BCIN-7231 fixture evidence for banding requirements.
- Confirmed Phase 1 is structurally designed to preserve this context via spawned evidence intake and post-validation before any drafting phases.
- Noted that the provided evidence excerpt contains functional banding requirements but does not explicitly show style constraints or rendering assumptions.