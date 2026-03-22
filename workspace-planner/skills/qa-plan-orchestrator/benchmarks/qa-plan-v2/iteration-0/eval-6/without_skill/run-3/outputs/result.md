# Phase4b Result

## Benchmark
- Case: `P4B-LAYERING-001`
- Feature: `BCED-2416`
- Feature family: `report-editor`
- Primary phase: `phase4b`
- Evidence mode: `blind_pre_defect`
- Priority: `advisory`

## Evidence Boundary
- Included evidence:
  - `inputs/fixtures/BCED-2416-blind-pre-defect-bundle/materials/BCED-2416.customer-scope.json`
  - `inputs/fixtures/BCED-2416-blind-pre-defect-bundle/materials/BCED-2416.issue.raw.json`
- Excluded by blind policy:
  - non-customer linked issues, defects, stories, and internal work items referenced inside the raw Jira export
  - any external sources and any skill-package content
- Customer signal present in scope export:
  - ABANCA
  - Bank Of America
  - Lowe's Companies Inc
  - OBI Smart Technologies GmbH
  - Schwarz IT KG
  - Starbucks Coffee Company
  - Yahoo Holdings Inc.
- Limitation:
  - The blind bundle exposes customer references but no standalone customer-issue narratives. Because of that, this phase4b output stays at the feature-scenario layer rather than inventing customer-specific variants.

## Phase4b Canonical Top-Layer Grouping
Phase4b requires canonical top-layer grouping while preserving distinct scenario leaves. The grouping below keeps separate entry points, lifecycle paths, and routing cases instead of merging them.

### 1. Access and Entry
- S1. Enable the new dashboard editor from the Workstation Help menu before using the embedded experience.
- S2. Create a new dashboard from the create-dashboard icon or Workstation menu, including dataset selection before editor launch.
- S3. Create a dashboard directly from a dataset context action.
- S4. Open an existing dashboard through `Edit`.
- S5. Open an existing dashboard through `Edit without Data` and enter pause mode.

### 2. Embedded Authoring Lifecycle
- S6. Land in the embedded Library-based authoring editor with the expected editor/menu structure.
- S7. Switch to presentation mode and return to authoring.
- S8. Save from the editor and receive the native Workstation save dialog.
- S9. Use `Save As` from the editor and receive the native Workstation save dialog.

### 3. Exit and Execution Control
- S10. Use the `Cancel` button to stop execution and leave the editor safely.
- S11. Use the window close or `X` action to stop execution and close the editor safely.

### 4. Mode Routing and Compatibility
- S12. Route server-backed Workstation authoring to the embedded Library web authoring path.
- S13. Keep local mode on the legacy editor through `25.12` because this feature does not change local-mode editing.
- S14. Re-open a locally saved dashboard for edit and show the new editor style where the feature description says it should appear.
- S15. Fall back to the legacy editor for pre-`25.08` server connections.
- S16. Use the new WebView editor for `25.08+` server connections.

### 5. Security and Access Guardrails
- S17. Prevent authoring when the user lacks the required edit privilege or ACL.
- S18. Keep ACL behavior aligned with Library Web.

## Separation Rationale
- New-dashboard creation, dataset-driven creation, existing-dashboard edit, and `Edit without Data` remain separate because they start from different entry states and have different expected transitions.
- `Save` and `Save As` remain separate because the feature explicitly calls out both flows.
- `Cancel` and `X` close remain separate because both are explicitly required to cancel execution.
- Server-backed routing, legacy fallback, and local-mode behavior remain separate because the feature intentionally differentiates them.

## Contract Check
- `[phase_contract][advisory]` Case focus is explicitly covered: yes. The output uses canonical top-layer buckets and preserves distinct scenarios instead of collapsing them.
- `[phase_contract][advisory]` Output aligns with primary phase `phase4b`: yes. The artifact stops at scenario grouping/layering and does not expand into later-phase test design.
