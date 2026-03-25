# EXPORT-P1-CONTEXT-INTAKE-001 — Phase 1 (Context Intake) Contract Check

**Primary feature:** BCVE-6678  
**Feature family:** export  
**Primary phase under test:** phase1  
**Evidence mode:** blind_pre_defect  
**Priority:** advisory  
**Benchmark focus:** *Context intake preserves Google Sheets export entry points, scope boundaries, and format constraints before scenario drafting.*

## What Phase 1 must accomplish (per orchestrator contract)
Phase 1 in this workflow is **not scenario drafting**. It must:
- Generate a **Phase 1 spawn manifest** with **one request per requested source family** (and any support-only Jira digestion requests, if provided).
- Ensure the resulting context intake (via spawned evidence collection) is sufficient to preserve:
  - **Google Sheets export entry points** (where users initiate the export)
  - **Scope boundaries** (what is / is not included)
  - **Format constraints** (Google Sheets-specific output limitations/behavior)
- Pass Phase 1 `--post` validation gates: spawn policy, evidence completeness, support-only routing (when applicable).

## Context extracted from provided fixture evidence (what must be preserved)
From the BCVE-6678 fixture bundle:

### Feature identification and family context
- Feature key: **BCVE-6678**
- Labels include: **Export** (export family)
- Parent initiative: **PRD-75 — Google Workspace (GWS) Integration**

### Directly relevant adjacent scope indicators (critical for Phase 1 context intake)
Adjacent (parented) issues under BCVE-6678 (frozen set):
- **BCIN-7106 (Story):** *[Report] Application Level Default value for Google Sheets Export*  
  - Strong signal this feature concerns **Google Sheets export behavior**, likely defaults at application level.
- **BCIN-7636 (Defect):** *Update some strings under application's report export setting dialog*  
  - Signal that **Report Export Settings dialog** is an **entry point**/UI surface.
- **BCIN-7595 (Defect):** *Refine UI to keep "REPORT EXPORT SETTINGS" header when scroll is triggered*  
  - Reinforces the same **Report Export Settings** UI surface as an entry point.

### Scope boundary signals
- No explicit customer/support signals in provided exports:
  - `customer_signal_present: false` in customer-scope export
  - `support_signal_issue_keys: []` in adjacent issues export
- No linked issues or subtasks included in the provided scope export (`linked_issue_count: 0`, `subtask_count: 0`).

### Format constraint signals (what we can and cannot claim yet)
- The fixture evidence **does not contain** explicit Google Sheets format constraints (e.g., size limits, formatting rules, sheet naming rules, cell type conversions).
- Therefore, Phase 1 must ensure evidence collection includes authoritative sources (e.g., story/spec, UX notes, implementation notes) that define these constraints before drafting.

## Phase 1 adequacy assessment vs. benchmark focus (advisory)
Given only the provided evidence, the **minimum preserved context** for later phases should include:

1. **Google Sheets export is in scope**
   - Supported by adjacent Story **BCIN-7106**.
2. **Primary entry point likely includes “Report Export Settings” UI**
   - Supported by adjacent defects **BCIN-7636** and **BCIN-7595**.
3. **Scope boundaries are not fully defined in the provided bundle**
   - We can only infer the UI surface and that it relates to application/report export settings.
4. **Format constraints are not present in the provided bundle**
   - Must be captured by Phase 1 evidence-intake spawns in a real run.

**Contract implication for Phase 1:** The orchestrator must produce a spawn manifest that routes evidence collection to sources that will capture:
- the Story details for BCIN-7106 (default value behavior, any constraints)
- the UI/UX details around “Report Export Settings” entry points
- any referenced requirements/specs that enumerate Google Sheets export output constraints

## Pass/Fail (phase1 contract alignment)
**Result: Inconclusive with this blind fixture alone (advisory).**

Reason:
- The provided benchmark evidence includes feature + adjacency summaries, but **does not include the Phase 1 spawn manifest** (`phase1_spawn_manifest.json`) or any spawned context artifacts under `context/`.
- Phase 1 is specifically responsible for generating the spawn manifest and driving evidence collection; without the manifest (or its post-validation outputs), we cannot confirm the orchestrator preserved entry points/scope/format constraints *before* scenario drafting.

## Required Phase 1 outputs to demonstrate benchmark satisfaction
To demonstrate this benchmark case is satisfied, the run would need, at minimum:
- `phase1_spawn_manifest.json` containing spawn requests for the relevant source families (at least **jira**), explicitly including evidence capture for:
  - BCVE-6678 (feature)
  - BCIN-7106 (Google Sheets export defaults)
  - BCIN-7636 / BCIN-7595 (Report Export Settings dialog entry point)
- Phase 1 `--post` validation outcome (no `REMEDIATION_REQUIRED`).

---

## Short execution summary
- Reviewed the orchestrator Phase 1 contract from the provided skill snapshot and compared it to the BCVE-6678 blind pre-defect fixture bundle.
- Identified the minimal context signals that Phase 1 must preserve for Google Sheets export entry points and scope (via adjacent issues).
- Could not verify Phase 1 compliance end-to-end because the Phase 1 spawn manifest and spawned context artifacts are not included in the provided evidence set.