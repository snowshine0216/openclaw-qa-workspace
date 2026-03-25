# EXPORT-P1-CONTEXT-INTAKE-001 — Phase 1 (Context Intake) Contract Check

## Benchmark focus (must be preserved before scenario drafting)
This case checks whether **Phase 1 context intake** preserves, as explicit context constraints:
- **Google Sheets export entry points**
- **Scope boundaries** (what’s in/out)
- **Format constraints** (what export formats/settings are implicated)

Evidence mode: **blind_pre_defect** (do not infer/diagnose defects; only capture context and evidence needs).

## Available benchmark evidence (from fixture)
From the provided bundle, the only explicit, reliable context we can intake at Phase 1 is:
- Feature: **BCVE-6678**
- Labels: **Export**, **Library_and_Dashboards**
- Parent initiative: **PRD-75 Google Workspace (GWS) Integration**
- Adjacent (parented) issues (frozen set):
  - **BCIN-7106** (Story): *[Report] Application Level Default value for Google Sheets Export*
  - **BCIN-7636** (Defect): *Update some strings under application's report export setting dialog*
  - **BCIN-7595** (Defect): *[Application editor] Refine UI to keep "REPORT EXPORT SETTINGS" header when scroll is triggered*

## Phase 1 intake assessment against focus
### 1) Google Sheets export entry points
- **Partially present** via adjacent story BCIN-7106 indicating **application-level default value** for **Google Sheets export**.
- **Missing from evidence**: concrete *entry points* (where user triggers export to Google Sheets), such as:
  - Report UI export menu location(s)
  - Application editor export settings dialog path
  - Library vs Dashboard vs Report surface entry points

### 2) Scope boundaries
- **Weakly implied** by labels (**Library_and_Dashboards**) and adjacent issues referencing **application editor** and **report export setting dialog**.
- **Missing from evidence**: explicit in-scope/out-of-scope statements for:
  - Which surfaces: Library? Dashboards? Reports? Application editor only?
  - Which user roles/permissions?
  - Whether this is default-setting only vs actual export execution.

### 3) Format constraints
- **Implicit**: Google Sheets export is the relevant format/integration.
- **Missing from evidence**: explicit constraints such as:
  - File/format options (Sheets vs CSV/XLSX/PDF, etc.)
  - Any limitations or configuration options (e.g., default value choices, persistence scope, precedence rules)
  - Any settings names/strings (though adjacent defects suggest strings/header behavior, Phase 1 should only treat as context sources to ingest).

## Phase 1 contract alignment (orchestrator-phase model)
Under the skill contract, Phase 1 should output a **phase1_spawn_manifest.json** that spawns one request per requested source family and any support-only Jira digestion when provided.

Using only provided evidence, we can conclude:
- The benchmark requires that Phase 1 **preserve** the Google Sheets export entry points/scope/format constraints **before drafting**.
- The provided fixture evidence **does not contain enough detail** to preserve those items; therefore Phase 1 would need to spawn **Jira evidence collection** for at minimum:
  - BCVE-6678 full issue fields (including full description—truncated in the raw JSON snippet)
  - Adjacent story BCIN-7106 details
  - Adjacent defects BCIN-7636 and BCIN-7595 details (as context sources, not defect analysis)

## Pass/Fail determination for this benchmark case
**Result: BLOCKED (insufficient evidence to demonstrate compliance).**

Reason: The fixture bundle does not provide explicit entry points, scope boundaries, or format constraints beyond a high-level indication that Google Sheets export defaults and export settings UI are involved. Without additional Phase 1 spawn outputs (manifest) or the full Jira descriptions, we cannot demonstrate that Phase 1 context intake preserves the required constraints.

## What Phase 1 would need to capture (minimal context checklist)
To satisfy the benchmark focus before any scenario drafting, Phase 1 intake artifacts/evidence should explicitly record:
- **Entry points**: exact navigation paths/UI locations to reach Google Sheets export and its settings (report menu vs application editor settings; library/dashboard surfaces).
- **Scope boundaries**: where the default value applies (tenant/app/report?), precedence rules, role/permission constraints.
- **Format constraints**: supported export targets and any constraints specific to Google Sheets export and its default selection.