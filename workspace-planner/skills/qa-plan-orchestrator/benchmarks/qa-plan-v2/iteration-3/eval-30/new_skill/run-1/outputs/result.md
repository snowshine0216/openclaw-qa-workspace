# EXPORT-P1-CONTEXT-INTAKE-001 — Phase 1 (Context Intake) Contract Check

Primary feature: **BCVE-6678**  
Feature family / knowledge pack: **export**  
Primary phase under test: **Phase 1**  
Evidence mode: **blind_pre_defect**  
Priority: **advisory**

## What Phase 1 must preserve before scenario drafting (benchmark focus)
This benchmark checks that **context intake (Phase 1)** preserves, in the runtime evidence plan, the following *Google Sheets export* specifics **before any scenario drafting**:

1. **Google Sheets export entry points**
2. **Scope boundaries** (what is in/out)
3. **Format constraints** (Sheets-specific output/format/limits)

Per the orchestrator contract, Phase 1’s only artifact is a **spawn manifest** that requests evidence collection by source family; Phase 1 should set up evidence gathering such that these three items are captured in `context/` artifacts later.

## Evidence available in this benchmark bundle (blind, pre-defect)
From the provided fixture evidence:

- **BCVE-6678** is labeled **Export** and is a Feature under initiative **PRD-75 Google Workspace (GWS) Integration**.
- Adjacent (parented) issues under BCVE-6678 include:
  - **BCIN-7106 (Story):** “Application Level Default value for Google Sheets Export”
  - **BCIN-7636 (Defect):** “Update some strings under application's report export setting dialog”
  - **BCIN-7595 (Defect):** “Refine UI to keep \"REPORT EXPORT SETTINGS\" header when scroll is triggered”
- No customer/support signal issues were exported in adjacency or customer-scope snapshots.

## Phase 1 alignment check (contract vs benchmark focus)
### What we can verify with the provided evidence
- **Phase alignment:** The skill snapshot defines Phase 1 as producing `phase1_spawn_manifest.json` that creates **one spawn request per requested source family** (plus support-only Jira digestion requests when provided), and then `--post` validates policy and evidence completeness.
- **Context intake intent:** With BCVE-6678 being an export feature and explicitly tied to Google Workspace integration plus an adjacent story explicitly about **Google Sheets export**, Phase 1 context intake **should** ensure the evidence-collection plan includes Jira source collection sufficient to capture:
  - where the Google Sheets export is surfaced (entry points)
  - what part of the product/settings it covers (scope boundaries)
  - what “default value / export settings / strings” imply about format/constraints

### What we cannot verify in this benchmark run (blocker)
The benchmark evidence bundle does **not** include:
- an actual **Phase 1 spawn manifest** (`phase1_spawn_manifest.json`) for BCVE-6678, nor
- any Phase 1 produced `context/` artifacts (e.g., issue digests, relation maps, summaries).

Because of that, we cannot directly confirm that Phase 1’s context-intake output (the spawn requests) **explicitly preserves Google Sheets export entry points, scope boundaries, and format constraints** prior to drafting.

## Advisory verdict for this benchmark case
- **Phase 1 output alignment:** *Indeterminable from provided bundle* (manifest not present).
- **Benchmark focus (Sheets entry points / scope / format constraints preserved pre-drafting):** *Not verifiable from provided bundle.*

## Minimum expected Phase 1 evidence plan (what should exist if the skill satisfies this case)
To satisfy the benchmark focus in Phase 1, the produced `phase1_spawn_manifest.json` would need to drive collection of Jira evidence covering:

- **BCVE-6678 feature description/AC** (to determine scope boundaries)
- **BCIN-7106 story** (explicit Google Sheets export behavior defaults)
- Any UI/settings references around “Report Export Settings” that define **where the Sheets export option is configured/triggered** (entry points)
- Any explicit export output constraints (e.g., formatting, limitations, mapping to spreadsheet) if stated in Jira descriptions/AC

(Phase 1 should only *plan/spawn* this evidence gathering; scenario drafting happens later.)

---

## Execution summary
This benchmark run could only evaluate the **Phase 1 contract intent** from the skill snapshot and the **feature adjacency context** from the fixture bundle. The required Phase 1 artifact (`phase1_spawn_manifest.json`) was not included in the evidence, so preservation of Google Sheets export entry points, scope boundaries, and format constraints prior to drafting is **not directly verifiable** here.