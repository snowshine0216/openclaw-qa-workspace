# GRID-P1-CONTEXT-INTAKE-001 — Phase 1 (Context Intake) Contract Check

Primary feature: **BCIN-7231**  
Feature family / knowledge pack: **modern-grid**  
Primary phase under test: **phase1**  
Evidence mode: **blind_pre_defect** (no defect analysis; context-only)

## What Phase 1 must ensure (contract)
Phase 1 is limited to **context intake orchestration**: it must generate a **Phase 1 spawn manifest** that will collect/prepare evidence inputs (per requested source family + any support-only Jira digestion) and preserve key requirements **before any scenario drafting**.

For this benchmark, the context-intake focus that must be preserved is:
- **Banding requirements** (rows + columns, header-based application, formatting/colors)
- **Style constraints** (formatting options, how colors are configured)
- **Rendering assumptions** (how Modern Grid displays banding; readability intent)

## Evidence-derived context that must be captured as requirements (from the fixture)
From `BCIN-7231.issue.raw.json` (description excerpt):
- Current limitation in Modern Grid: user can only enable banding in rows.
- Missing capabilities to bring from Report to Modern Grid dashboards:
  - Cannot **format the colors** (banding color configuration)
  - Cannot enable **banding in columns**
  - Cannot apply the banding color by **row/column header**
- Rationale: banding improves grid readability; needs parity with Report.

Additionally, `BCIN-7231.customer-scope.json` indicates explicit customer signal is present and should be retained as context (still not defect analysis).

## Phase 1 alignment assessment (pass/fail against expectations)
### [phase_contract][advisory] Case focus explicitly covered
**Pass (advisory)** — The workflow package’s Phase 1 contract requires that Phase 1 produce one spawn request per requested source family and (when provided) support-only Jira digestion requests, with all artifacts saved under `context/`.

Given the BCIN-7231 description, the orchestrator’s Phase 1 manifest generation is the correct place to preserve:
- banding scope (rows/columns)
- color formatting controls
- header-based application behavior
- Modern Grid dashboard rendering expectations

This preservation happens by ensuring the Phase 1 spawn tasks are framed to extract/retain these requirements into Phase 1/2 context artifacts (to be indexed later), without drafting scenarios.

### [phase_contract][advisory] Output aligns with primary phase phase1
**Pass (advisory)** — The authoritative workflow defines Phase 1 output strictly as:
- `phase1_spawn_manifest.json`

and Phase 1 responsibilities as spawn orchestration only (no inline logic, no drafting).

## Notes on evidence-mode compliance
- Evidence mode is **blind_pre_defect**; Phase 1 must not route into defect analysis. The workflow explicitly enforces support-only issues as `context_only_no_defect_analysis` and Phase 1 `--post` validates non-defect routing.

## Conclusion
The provided workflow package (skill snapshot) demonstrates a Phase 1 model that is capable of preserving the required **banding/style/rendering context** for BCIN-7231 before scenario drafting by:
- constraining Phase 1 to evidence/spawn orchestration,
- persisting resulting artifacts under `context/`, and
- validating spawn policy and non-defect routing in Phase 1 `--post`.

---

# Short execution summary
Reviewed only the provided benchmark evidence (skill snapshot contracts + BCIN-7231 fixture). Verified Phase 1 contract and outputs align with the benchmark’s context-intake focus (banding/style/rendering requirements preserved pre-drafting via Phase 1 spawn/evidence collection design).