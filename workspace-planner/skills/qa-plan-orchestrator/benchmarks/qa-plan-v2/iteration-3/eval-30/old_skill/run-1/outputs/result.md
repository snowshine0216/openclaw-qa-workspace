# EXPORT-P1-CONTEXT-INTAKE-001 — Phase 1 (Context Intake) Contract Check

Primary feature: **BCVE-6678**  
Feature family: **export**  
Primary phase under test: **phase1**  
Evidence mode: **blind_pre_defect**  
Priority: **advisory**

## What this benchmark is checking (Phase 1)
Phase 1 must preserve *context intake* inputs needed **before any scenario drafting**, specifically for **Google Sheets export**:

1. **Entry points** (where the user initiates Google Sheets export)
2. **Scope boundaries** (what is and isn’t included)
3. **Format constraints** (file/content/structure constraints)

In the orchestrator contract, Phase 1 work is *not to draft scenarios*, but to **generate spawn requests** to collect/record evidence per requested source families, so that later phases can draft with correct boundaries and constraints.

## Evidence available in this benchmark bundle (blind pre-defect)
From the fixture bundle for **BCVE-6678**:

- **BCVE-6678.issue.raw.json**
  - Confirms feature identity and basic classification context.
  - Labels include **"Export"** and **"Library_and_Dashboards"**.
- **BCVE-6678.customer-scope.json**
  - Explicitly notes: **no customer signal present** and no explicit customer references at export time.
- **BCVE-6678.adjacent-issues.summary.json**
  - Adjacent/parented issues frozen set (3 total):
    - **BCIN-7106 (Story)**: "[Report]Application Level Default value for Google Sheets Export"
    - **BCIN-7636 (Defect)**: "Update some strings under application's report export setting dialog"
    - **BCIN-7595 (Defect)**: "[Application editor] Refine UI to keep \"REPORT EXPORT SETTINGS\" header when scroll is triggered"

## Phase 1 contract alignment assessment (advisory)
### What Phase 1 *should* do to preserve Google Sheets export context
Given the goal (preserve entry points / scope boundaries / format constraints **before drafting**), Phase 1 must at minimum create spawn requests that will collect evidence from the authoritative sources that describe:

- The **UI surfaces/dialogs** for report export settings (likely where Google Sheets export options live)
- The **feature/story spec** for "Application Level Default value for Google Sheets Export" (BCIN-7106)
- Any linked work that clarifies **strings and UI behavior** in the export settings dialog (BCIN-7636, BCIN-7595)

Under the **qa-plan-orchestrator** contract (SKILL snapshot):
- Phase 1 generates **one spawn request per requested source family** and includes **support-only Jira digestion requests when provided**.
- It must ensure evidence completeness and correct routing before proceeding (`phase1.sh --post` validation).

### What can be verified with provided evidence
This benchmark evidence does **not** include:
- Any produced `phase1_spawn_manifest.json`
- Any `context/` artifacts produced by Phase 1 (relation map, summaries, etc.)
- Any declared `requested_source_families` for this run

Therefore, we cannot directly verify that Phase 1 preserved Google Sheets export entry points/scope/format constraints via actual spawn requests or collected context artifacts.

### Advisory verdict for this benchmark case
**Not demonstrated (insufficient Phase 1 artifacts in evidence).**

Reason: The provided bundle contains only frozen Jira exports/summaries and does not include the Phase 1 deliverable (`phase1_spawn_manifest.json`) or the resulting context artifacts that would show the orchestrator preserved the Google Sheets export entry points, scope boundaries, and format constraints prior to scenario drafting.

## What would need to be present to pass (Phase 1-specific)
To demonstrate Phase 1 satisfies this benchmark focus, evidence should include at least:

- `phase1_spawn_manifest.json` showing spawn requests that will ingest:
  - Jira evidence for BCVE-6678 and adjacent issues (notably **BCIN-7106**)
  - Any required source family relevant to export UI/specs (e.g., Jira + Confluence/GitHub if they are requested families in task.json)
- Post-spawn context artifacts under `context/` that capture the Google Sheets export **entry points**, **scope boundaries**, and **format constraints** as “context intake” inputs (even if only as summaries/relation mapping), before Phase 4a drafting.

---

## Short execution summary
- Reviewed only the provided benchmark evidence (skill snapshot + BCVE-6678 blind pre-defect fixture bundle).  
- Phase 1 compliance with the specific benchmark focus cannot be demonstrated because the Phase 1 output (`phase1_spawn_manifest.json`) and Phase 1-produced context artifacts are not included in evidence.