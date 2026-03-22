# P4B-LAYERING-001 - Phase4b Contract Check for BCED-2416

## Verdict

Pass for the stated advisory contract. This output stays in `phase4b`, uses canonical top-layer grouping, and keeps distinct scenarios separate instead of collapsing them into broad workflow buckets.

## Phase Scope

- Primary phase: `phase4b`
- Feature: `BCED-2416`
- Feature family: `report-editor`
- Evidence mode: `blind_pre_defect`
- Blind policy applied: `all_customer_issues_only`
- Non-customer linked issues were excluded from evidence use

`phase4b` interpretation for this baseline run: provide the top-layer scenario grouping artifact only, without dropping to step-level test design, defect triage, or execution sequencing.

## Evidence Boundary

Used evidence:

- `./benchmark_request.json`
- `./inputs/fixtures/BCED-2416-blind-pre-defect-bundle/materials/BCED-2416.issue.raw.json`
- `./inputs/fixtures/BCED-2416-blind-pre-defect-bundle/materials/BCED-2416.customer-scope.json`
- `./inputs/fixtures/BCED-2416-blind-pre-defect-bundle/materials/BCED-2416-embedding-dashboard-editor-workstation.md`

Customer signal present in the bundled customer-scope export:

- ABANCA
- Bank Of America
- Lowe's Companies Inc
- OBI Smart Technologies GmbH
- Schwarz IT KG
- Starbucks Coffee Company
- Yahoo Holdings Inc.

Evidence handling note:

- The workstation markdown was used only for feature-level summary confirmation.
- Linked child issues and non-customer issue references named inside the markdown or Jira description were not treated as separate evidence units.

## Phase4b Output

Canonical top-layer grouping for `BCED-2416`, with scenarios intentionally preserved as separate leaves.

### 1. Editor Entry And Mode Selection

- Enable the new dashboard editor from the Workstation Help menu.
- Create a new dashboard from the create-dashboard entry point.
- Create a new dashboard after dataset selection from the popup flow.
- Edit an existing dashboard from the dashboard context menu.
- Use "Edit without data" and enter pause mode.
- Create a dashboard from the dataset context menu.

### 2. Authoring Session Behavior

- Open the embedded editor with the expected menu structure.
- Show the theme controls on the menu bar in the embedded experience.
- Enter presentation mode from authoring and return back to edit mode.
- Continue authoring in the new WebView-based editor rather than the legacy native editor for eligible server-backed flows.

### 3. Save, Close, And Session Lifecycle

- Save through the native Workstation save dialog.
- Save As through the native Workstation save dialog.
- Cancel execution through the explicit cancel control.
- Cancel execution by closing the editor with the window `X`.

### 4. Compatibility And Rollout Guardrails

- On `25.08+` server builds, use the new WebView editor.
- On pre-`25.08` server builds, fall back to the legacy editor without breaking the workflow.
- In `25.09`, keep the feature disabled by default until the user enables it.
- Keep local-mode editing on the legacy editor until the later retirement window.
- After local-mode Save As to MD, reopening the saved dashboard shows the new editor style.

### 5. Quality Gates And Access Controls

- Functional parity target covers create, edit, save, and save-as authoring workflows.
- Performance expectation remains a separate scenario group, not merged into functionality.
- Upgrade compatibility remains a separate scenario group, not merged into launch behavior.
- Security remains a separate scenario group: users without required privileges or ACL must not be able to edit.
- Automation remains a separate scenario group: Workstation automation coverage is required for the authoring workflows.

## Non-Collapse Check

The following scenario pairs were kept distinct on purpose because collapsing them would violate the benchmark focus:

- "Create new dashboard" vs. "Create dashboard from dataset"
- "Edit existing dashboard" vs. "Edit without data"
- "Save" vs. "Save As"
- "Cancel via cancel control" vs. "Cancel via window X"
- "`25.08+` server behavior" vs. "pre-`25.08` fallback behavior"
- "Server-backed new editor flow" vs. "local-mode legacy editor flow"
- "Functionality" vs. "Performance" vs. "Security" vs. "Automation"

## Expectation Check

- `[phase_contract][advisory] Case focus is explicitly covered: canonical top-layer grouping without collapsing scenarios` -> satisfied by the grouped phase4b artifact and explicit non-collapse check above.
- `[phase_contract][advisory] Output aligns with primary phase phase4b` -> satisfied because the output stops at the grouping layer and does not expand into downstream planning or execution artifacts.
