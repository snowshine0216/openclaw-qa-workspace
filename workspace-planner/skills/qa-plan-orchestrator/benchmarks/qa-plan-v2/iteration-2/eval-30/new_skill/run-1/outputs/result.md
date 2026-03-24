# EXPORT-P1-CONTEXT-INTAKE-001 — Phase 1 Contract Check (BCVE-6678)

## Benchmark intent (Phase 1 / advisory)
Verify that **Phase 1 (context intake / spawn planning)** preserves, *before any scenario drafting*, the key **Google Sheets export**:
- **Entry points** (where the user triggers the export)
- **Scope boundaries** (what’s in/out of scope per available context)
- **Format constraints** (what formats/settings are implied)

This benchmark is **blind_pre_defect** and **phase1** only: the expected Phase 1 behavior is to produce a **Phase 1 spawn manifest** that will fetch the needed evidence to preserve these constraints downstream; Phase 1 should not draft scenarios.

## Evidence available in this benchmark bundle (blind)
From the fixture evidence for **BCVE-6678**:
- The feature is in the **export** family (label: `Export`) and is under an initiative “Google Workspace (GWS) Integration”.
- Adjacent issues (frozen set):
  - **BCIN-7106 (Story)**: *"[Report]Application Level Default value for Google Sheets Export"*
  - **BCIN-7636 (Defect)**: *"Update some strings under application's report export setting dialog"*
  - **BCIN-7595 (Defect)**: *"[Application editor] Refine UI to keep \"REPORT EXPORT SETTINGS\" header when scroll is triggered"*
- There are **no linked issues** on the feature export; **no customer signal** detected in the provided customer scope snapshot.

## Phase 1 contract alignment (what should exist)
Per the qa-plan-orchestrator Phase 1 contract (snapshot `SKILL.md` / `reference.md`):
- Phase 1 must **generate one spawn request per requested source family**.
- Phase 1 output must be a **`phase1_spawn_manifest.json`**.
- If supporting issues are provided/used, Phase 1 must ensure summaries are explicitly labeled **`context_only_no_defect_analysis`** and are **never defect-analysis triggers**.

## Assessment against the benchmark focus
### Does the provided evidence demonstrate that Phase 1 preserves Google Sheets export entry points, scope boundaries, and format constraints *before* drafting?
**Not demonstrable from the provided evidence.**

Reason: the benchmark bundle includes only Jira-export snapshots (feature raw JSON + adjacent-issues summary + customer-scope summary). It does **not** include:
- A produced **`phase1_spawn_manifest.json`**, or
- Any Phase 1 generated context-intake artifacts (e.g., support relation map / support summaries), or
- Any recorded determination of **requested source families** for BCVE-6678.

Therefore, we cannot verify that Phase 1 is:
- Capturing/fetching evidence needed to lock **Google Sheets export entry points** (e.g., where “Export to Google Sheets” is initiated—Report UI, Application editor export settings, etc.).
- Preserving **scope boundaries** (e.g., application-level defaults vs report-level export actions) before drafting.
- Preserving **format constraints** (e.g., what settings/strings/headers exist in “Report Export Settings”, default values, export format options).

### What Phase 1 would need to request (context-intake preservation targets)
Given the adjacent issue summaries, Phase 1 should ensure evidence collection covers at least these context areas (as source-family spawns), so downstream phases can preserve the required constraints:
- **Jira source family**: fetch BCVE-6678 plus adjacent issues (BCIN-7106/7595/7636) details to establish:
  - The **entry points** involved (report export action vs application-level export settings dialog).
  - The **scope boundaries** between “application level default” and “report export” flows.
  - Any stated **format/setting constraints** (strings, headers, defaults).
- If additional source families were requested by the task (not provided in evidence), Phase 1 should also spawn those; however, this benchmark bundle does not specify them.

## Benchmark verdict (advisory)
- **Phase alignment:** Phase 1 only — respected.
- **Pass/Fail (advisory):** **Blocked / Cannot Evaluate** with current evidence.
- **Primary gap:** missing Phase 1 deliverable (**`phase1_spawn_manifest.json`**) and thus no demonstrable preservation of Google Sheets export entry points/scope/format constraints prior to drafting.

---

## Short execution summary
Reviewed only the provided snapshot contracts and the BCVE-6678 blind-pre-defect fixture exports. The benchmark requires Phase 1 context-intake/spawn planning evidence (not scenario drafting). The bundle does not include a Phase 1 spawn manifest or Phase 1-generated context artifacts, so compliance with the “preserve Google Sheets export entry points, scope boundaries, and format constraints before scenario drafting” focus cannot be verified.