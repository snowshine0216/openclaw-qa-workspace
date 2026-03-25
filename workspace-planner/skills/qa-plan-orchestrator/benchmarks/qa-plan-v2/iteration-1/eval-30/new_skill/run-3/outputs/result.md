# EXPORT-P1-CONTEXT-INTAKE-001 — Phase 1 (Context Intake Contract) Assessment

Feature: **BCVE-6678**  
Feature family: **export**  
Primary phase under test: **phase1**  
Evidence mode: **blind_pre_defect**  
Priority: **advisory**

## What Phase 1 must preserve (before scenario drafting)
This benchmark’s focus is that **context intake** must preserve:
1. **Google Sheets export entry points** (where users access Google Sheets export settings/flows)
2. **Scope boundaries** (what’s in vs out)
3. **Format constraints** (Google Sheets export-specific constraints)

Under the orchestrator contract, Phase 1 does **not** draft scenarios; it should **prepare evidence collection** via **`phase1_spawn_manifest.json`** so later phases can draft scenarios without losing those critical context constraints.

## Evidence available in this benchmark bundle (blind pre-defect)
From the provided fixture evidence for BCVE-6678:

- The primary Jira feature issue exists and is labeled **Export** (plus other labels).  
  Source: `fixture:BCVE-6678-blind-pre-defect-bundle/BCVE-6678.issue.raw.json`

- Adjacent issues under BCVE-6678 include:
  - **BCIN-7106 (Story):** "[Report]Application Level Default value for Google Sheets Export"  
  - **BCIN-7636 (Defect):** "Update some strings under application's report export setting dialog"  
  - **BCIN-7595 (Defect):** "[Application editor] Refine UI to keep \"REPORT EXPORT SETTINGS\" header when scroll is triggered"  
  Source: `fixture:BCVE-6678-blind-pre-defect-bundle/BCVE-6678.adjacent-issues.summary.json`

- No customer/support signal is present in the exported customer scope snapshot.  
  Source: `fixture:BCVE-6678-blind-pre-defect-bundle/BCVE-6678.customer-scope.json`

## Phase 1 contract check (what we can/can’t verify from provided evidence)
Phase 1’s required output per skill contract is **`phase1_spawn_manifest.json`**, with one spawn request per requested source family, and (if provided) support-only Jira digestion requests.

### Can we confirm the benchmark focus is preserved in Phase 1?
**Cannot be confirmed from the provided evidence.**

Reason: the bundle does **not** include the Phase 1 runtime artifacts (notably `phase1_spawn_manifest.json`), nor does it provide any Phase 1-generated context artifacts under `context/`.

However, we can still assess whether the *available intake inputs* (feature + adjacency) contain the necessary signals that Phase 1 should ensure are captured:

- **Google Sheets export entry points:** The adjacency set includes a Google Sheets export story (BCIN-7106) and export settings UI items (BCIN-7636/BCIN-7595). These strongly imply key entry points are in **Application editor / report export settings dialog** and **application-level default settings** for Google Sheets export.
- **Scope boundaries:** Not explicitly stated in the fixture summaries; would require reading the underlying issue descriptions/acceptance criteria from Jira evidence collection.
- **Format constraints:** Not present in the fixture summaries; would require Jira details and/or product docs.

### What Phase 1 would need to do (per contract) to satisfy this benchmark
To preserve the focus before drafting, Phase 1 must (at minimum) ensure spawn coverage includes:
- Jira evidence collection for **BCVE-6678** (primary feature context)
- Jira evidence collection for **adjacent issues** (at least BCIN-7106, BCIN-7636, BCIN-7595) to extract:
  - the **UI entry points** (where export is initiated/configured)
  - explicit **in-scope / out-of-scope** statements
  - **Google Sheets-specific format constraints** (limits, data typing, sheet structure, permissions/auth handoff, etc.)

This should be represented by Phase 1 in a `phase1_spawn_manifest.json` that requests the correct source-family pulls (Jira) and saves outputs under `context/` for downstream phases.

## Verdict (phase1 advisory)
**Status:** `insufficient_evidence_to_verify`  

The benchmark expects a Phase 1-aligned output demonstrating that context intake preserves Google Sheets export entry points, scope boundaries, and format constraints. The provided evidence bundle does not include Phase 1 artifacts (especially `phase1_spawn_manifest.json`) or Phase 1-generated context outputs, so we cannot verify compliance.

## Blockers / Missing artifacts needed to prove compliance
- Missing: **`phase1_spawn_manifest.json`** for BCVE-6678
- Missing: any Phase 1-produced `context/` evidence artifacts showing that Jira details were fetched for BCVE-6678 and its adjacent Google Sheets/export-settings issues

If those were present, we would validate that Phase 1 routed evidence collection to capture Google Sheets export entry points + constraints *before* any scenario drafting phases (4a+).