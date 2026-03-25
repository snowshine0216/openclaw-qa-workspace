# EXPORT-P1-CONTEXT-INTAKE-001 — Phase 1 Contract Check (BCVE-6678)

## Benchmark intent (phase1)
Demonstrate whether **Phase 1 (context intake / spawn planning)** preserves **Google Sheets export entry points, scope boundaries, and format constraints** *before* any scenario drafting.

This is an **advisory** phase-contract benchmark in **blind_pre_defect** mode, so the check is limited to what Phase 1 is responsible for:
- generating spawn requests per requested source family
- (when applicable) support-only Jira digestion spawn requests
- ensuring the resulting context collection will be sufficient and properly routed for later phases (no inline analysis/drafting)

## Evidence available in this benchmark bundle
From the provided fixture bundle for **BCVE-6678**:
- Feature issue raw export: `BCVE-6678.issue.raw.json` (truncated but shows key metadata)
- Customer scope export: `BCVE-6678.customer-scope.json`
- Adjacent issues summary export: `BCVE-6678.adjacent-issues.summary.json`

Key context signals we can reliably intake from evidence:
- Feature family: **export** (labels include `Export`)
- Primary target area: **Google Sheets export** (initiative parent is “Google Workspace (GWS) Integration”; adjacent story explicitly mentions Google Sheets export defaults)
- Adjacent implementation issues exist and should be treated as **core Jira evidence** (not “support-only”):
  - **BCIN-7106** (Story): *[Report] Application Level Default value for Google Sheets Export*
  - **BCIN-7636** (Defect): *Update some strings under application's report export setting dialog*
  - **BCIN-7595** (Defect): *Refine UI to keep "REPORT EXPORT SETTINGS" header when scroll is triggered*
- No customer/support-signal issues were detected in the fixture exports:
  - `support_signal_issue_keys: []`
  - `customer_signal_present: false`

## Phase 1 expectations for this case focus
To “preserve Google Sheets export entry points, scope boundaries, and format constraints before scenario drafting”, Phase 1 must at minimum ensure the spawn/evidence plan will capture:
1) **Entry points** into Google Sheets export (e.g., application/report export settings UI surfaces implied by adjacent issues)
2) **Scope boundaries** (what is in/out, especially around “application-level default value” vs other export formats)
3) **Format constraints** relevant to Sheets export (implied by the “default value for Google Sheets export” story and “export settings” UI defects)

In the orchestrator’s phase model, that preservation happens **only indirectly** in Phase 1: by selecting the correct **source families** and **Jira targets** to fetch into `context/`.

## Contract alignment assessment (Phase 1)
### What Phase 1 is contractually able to do
Per `skill_snapshot/SKILL.md` + `skill_snapshot/reference.md`, Phase 1 outputs:
- `phase1_spawn_manifest.json` with **one spawn request per requested source family**
- plus **support-only Jira digestion** requests *when provided*
- and Phase 1 `--post` validates spawn policy/evidence completeness/non-defect routing

### What we can and cannot verify in this benchmark run
Because the benchmark evidence does **not** include the generated `phase1_spawn_manifest.json` (nor any run directory artifacts), we cannot verify:
- whether the manifest included the correct source families for export (e.g., Jira)
- whether it targeted the adjacent issues (BCIN-7106/7636/7595) for context ingestion
- whether Phase 1 `--post` would pass or emit `REMEDIATION_REQUIRED`

### Determination (advisory)
**Result: BLOCKED (insufficient Phase 1 artifact evidence).**

This benchmark specifically checks that context intake (Phase 1) preserves key Sheets-export context before scenario drafting. The only direct, auditable Phase 1 deliverable is **`phase1_spawn_manifest.json`** (and any implied spawned context artifacts). That artifact is not present in the provided evidence set, so conformance cannot be demonstrated.

## What Phase 1 should have captured (requirements to satisfy the benchmark)
If the skill is operating correctly for BCVE-6678 in Phase 1, the spawn plan should ensure Jira evidence ingestion that covers:
- **Feature Jira**: BCVE-6678 (primary feature context)
- **Adjacent Jira work items** (core context, not support-only):
  - BCIN-7106 (Sheets export default behavior; likely defines scope/constraints)
  - BCIN-7636 (string updates in export settings dialog; affects entry-point/UI copy)
  - BCIN-7595 (export settings header behavior on scroll; affects entry-point/UI behavior)
- A clear separation that **no support-only digestion** is needed here (fixture indicates no support-signal issues)

This is the minimum Phase 1 intake necessary to preserve:
- **Entry points**: “report export settings” dialog and its UI behavior
- **Scope boundaries**: “application-level default value” for Google Sheets export
- **Format constraints**: any constraints documented in BCIN-7106 and/or BCVE-6678 description (not available in full due to truncation)

## Pass/Fail against benchmark expectations
- **[phase_contract][advisory] Case focus explicitly covered**: **PARTIALLY (by inference only)**
  - Evidence indicates relevant context exists (adjacent issues), but Phase 1 artifact proving it was preserved is missing.
- **[phase_contract][advisory] Output aligns with phase1**: **BLOCKED**
  - No Phase 1 output artifact (`phase1_spawn_manifest.json`) is available to assess.

## Recommendation (what to provide to complete this benchmark)
To conclusively demonstrate Phase 1 satisfies this case, include (from the run directory):
- `<run>/phase1_spawn_manifest.json`
- any Phase 1 spawned Jira context artifacts under `<run>/context/` showing BCVE-6678 and adjacent issues were ingested

---

# Short execution summary
Checked the Phase 1 contract requirements for the orchestrator against the provided BCVE-6678 blind-pre-defect fixture evidence. The bundle establishes Sheets-export-relevant adjacent Jira items (BCIN-7106/7636/7595) but does not include Phase 1’s required output artifact (`phase1_spawn_manifest.json`), so the benchmark cannot verify that context intake preserved entry points, scope boundaries, and format constraints prior to drafting. Marked as **BLOCKED due to missing Phase 1 artifacts in evidence**.