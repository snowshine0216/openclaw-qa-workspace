# EXPORT-P1-CONTEXT-INTAKE-001 — Phase 1 Contract Check (Advisory)

## Benchmark focus (must be preserved before scenario drafting)
Context intake for **BCVE-6678** must explicitly preserve:
1. **Google Sheets export entry points** (where the user initiates export to Google Sheets)
2. **Scope boundaries** (what is in/out of scope for this feature)
3. **Format constraints** (Google Sheets export format/behavior constraints)

Primary phase under test: **Phase 1** (spawn manifest generation for evidence collection).

## What Phase 1 is required to do (per skill snapshot)
Per `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md`, **Phase 1** must:
- **Generate one spawn request per requested source family** (e.g., Jira/Confluence/GitHub), plus support-only Jira digestion when supporting issues are provided.
- Produce `phase1_spawn_manifest.json`.
- In `--post`, validate evidence completeness and non-defect routing; on failure exit `2` with `REMEDIATION_REQUIRED: <source_family>`.

This benchmark’s “context intake preserves entry points/scope/format constraints” can only be satisfied in Phase 1 by ensuring the manifest will collect **sufficient authoritative evidence** (typically from Jira description/acceptance notes + adjacent story/defects) to capture those three items **before any scenario drafting**.

## Evidence available in this benchmark bundle (blind pre-defect)
From fixture `BCVE-6678-blind-pre-defect-bundle`:
- `BCVE-6678.issue.raw.json` (Jira issue payload; description is truncated in provided evidence)
- `BCVE-6678.customer-scope.json` (explicitly: no customer signal)
- `BCVE-6678.adjacent-issues.summary.json` (3 parented issues: 2 defects, 1 story)
  - **BCIN-7106** (Story): *"[Report]Application Level Default value for Google Sheets Export"*
  - **BCIN-7636** (Defect): strings under report export setting dialog
  - **BCIN-7595** (Defect): header retention on scroll in report export settings UI

## Phase 1 contract alignment assessment (advisory)
### Pass/Fail vs benchmark expectation
**Result: Cannot be demonstrated as satisfied with provided evidence (insufficient Phase 1 artifact).**

Reason: The benchmark requires checking that Phase 1 context intake preserves Google Sheets export entry points, scope boundaries, and format constraints **before scenario drafting**. Under the orchestrator’s phase model, that preservation is operationalized by **Phase 1 producing a spawn manifest** that will fetch/assemble the relevant evidence into `context/`.

However, this benchmark packet does **not** include:
- a produced `phase1_spawn_manifest.json`, nor
- any Phase 1 `--post` validation output,
so we cannot verify that Phase 1 actually routed evidence collection to cover:
- the **primary feature issue** (BCVE-6678)
- the **adjacent story** BCIN-7106 (likely to define default behavior/constraints)
- the **adjacent UI defects** (likely to define entry points and UI scope)

### What Phase 1 would need to include to satisfy the benchmark focus
To preserve the three focus areas *at intake time*, Phase 1 should (at minimum) plan to collect Jira evidence for:
- **BCVE-6678** (feature) — primary description/acceptance/scope
- **BCIN-7106** (story) — Google Sheets export default value behavior/constraints
- **BCIN-7636, BCIN-7595** (defects) — export settings dialog strings and scrolling header behavior (UI entry point/context)

And it should ensure the evidence collected can be summarized later into:
- **Entry points**: locations/menus/dialogs where “Export → Google Sheets” is initiated
- **Scope boundaries**: whether this feature is limited to application-level defaults vs report-level overrides, and which surfaces (library/dashboards) are included
- **Format constraints**: any constraints around Google Sheets output, authentication/Google Workspace integration expectations, or default-value/setting persistence behavior

## Alignment with Phase 1 (checkpoint correctness)
This report intentionally stays within **Phase 1 contract**: it assesses whether the orchestrator output (spawn manifest) exists and is sufficient to intake context for later phases. Since Phase 1 artifacts are not present in the evidence, we do not draft scenarios or infer detailed constraints beyond what’s in the fixture summaries.

## Advisory finding
- **Blocker to passing this benchmark check:** Missing `phase1_spawn_manifest.json` (and any `phase1 --post` validation result). Without it, we cannot confirm Phase 1 context intake is set up to preserve Google Sheets export entry points, scope boundaries, and format constraints prior to scenario drafting.