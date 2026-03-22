# BCED-2416 phase4b output

## Scope and evidence boundary

- Phase: `phase4b`
- Case focus: canonical top-layer grouping without collapsing scenarios
- Evidence mode: `blind_pre_defect`
- Priority: advisory
- Allowed evidence used:
  - `benchmark_request.json`
  - `inputs/fixtures/BCED-2416-blind-pre-defect-bundle/materials/BCED-2416.customer-scope.json`
  - `inputs/fixtures/BCED-2416-blind-pre-defect-bundle/materials/BCED-2416.issue.raw.json`
  - `inputs/fixtures/BCED-2416-blind-pre-defect-bundle/materials/BCED-2416-embedding-dashboard-editor-workstation.md` only as bundled feature-level workflow restatement
- Customer-only constraint handling:
  - Customer signal is present at feature level.
  - Separate customer-linked issues are not present in the bundle (`linked_issue_count: 0`, `subtask_count: 0`).
  - Top-layer grouping therefore stays anchored to customer-backed feature workflows and does not use non-customer issue trees.
- Explicit customer references in scope:
  - All customer refs: ABANCA, Bank Of America, Lowe's Companies Inc, OBI Smart Technologies GmbH, Schwarz IT KG, Starbucks Coffee Company, Yahoo Holdings Inc.
  - Committed customer refs: Bank Of America, OBI Smart Technologies GmbH, Starbucks Coffee Company, Yahoo Holdings Inc.
- Exclusions applied:
  - Non-customer defect IDs and non-customer issue clusters in bundled materials were not used as grouping drivers.
  - Lower-layer test design, step breakdown, and execution planning are intentionally out of scope for `phase4b`.

## Canonical top-layer grouping

### 1. Editor entry and launch routing

Why this is one top layer:
All of these are distinct entry routes into the same authoring surface.

Scenarios retained separately:

- Enable the new editor from `Help -> Enable New Dashboard Editor`.
- Create a new dashboard from the create entry point, select a dataset, and open the new editor.
- Edit an existing dashboard from the dashboard context menu.
- Use `Edit without data` and enter pause mode.
- Create a dashboard directly from a dataset context action.

### 2. In-editor authoring session controls

Why this is one top layer:
These scenarios govern the authoring session after the editor is already open.

Scenarios retained separately:

- Switch from authoring to presentation mode and return to editing.
- Save an existing dashboard through the native Workstation save dialog.
- Save As through the native Workstation save dialog.
- Cancel execution from the cancel control.
- Close the editor from the X control and cancel any active execution cleanly.

### 3. Deployment mode and version compatibility

Why this is one top layer:
These scenarios determine which editor experience is active based on environment, version, and rollout state.

Scenarios retained separately:

- Local mode continues to use the legacy editor during the transition window.
- In local mode, Save As to MD does not change the current page, but reopening the saved dashboard uses the new editor style.
- Supported server versions route to the embedded WebView editor.
- Pre-cutoff server versions fall back to the legacy editor without breaking the workflow.
- In `25.09`, the feature is disabled by default until the Help menu setting is enabled.

### 4. Access and parity guardrails

Why this is one top layer:
These scenarios constrain whether the routed experience is allowed and whether it meets the parity objective.

Scenarios retained separately:

- Users without the required privilege or ACL cannot enter authoring.
- Core authoring workflows should match Library Web behavior rather than maintain a separate Workstation-only logic path.
- Core create/edit/save/save-as coverage remains a parity check and does not justify collapsing entry and session scenarios into one bucket.

## Anti-collapse notes

- Keep `create new dashboard`, `edit existing dashboard`, `edit without data`, and `create from dataset` as separate scenarios under the same top layer. Do not merge them into a single `open editor` item.
- Keep `Save` and `Save As` separate.
- Keep `local mode`, `server fallback`, and `default-off rollout gate` separate.
- Do not reorganize the grouping around defect IDs or non-customer issue clusters. The blind evidence policy excludes that taxonomy here.

## Phase contract check

- Explicitly covers canonical top-layer grouping without collapsing scenarios: Yes.
- Aligned to primary phase `phase4b`: Yes. This artifact stops at top-layer grouping and does not descend into lower-layer test cases, step matrices, or execution planning.
