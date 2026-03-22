# HOLDOUT-REGRESSION-002

## Holdout Checkpoint
- Feature: `BCIN-976`
- Feature family: `report-editor`
- Primary phase: `holdout`
- Evidence mode: `holdout_regression`
- Priority: `blocking`
- Benchmark case verdict: `satisfied`
- Feature promotion/finalization decision from provided evidence: `remain in holdout; do not promote or finalize`

## Holdout Assessment
This output stays aligned with the `holdout` checkpoint and explicitly covers the required regression focus: promotion/finalization behavior remains stable on another feature in the `report-editor` family.

The blind fixture identifies BCIN-976 as the feature "Ability to export reports from edit mode in Library." The Jira description states that users want to export directly from the editor view without saving changes first. The provided snapshot shows the feature is still `In Progress`, has `High` priority, targets fix version `26.04`, and has no resolution date.

## Promotion/Finalization Stability
Promotion and finalization behavior remain stable on this holdout feature because the evidence supports a conservative checkpoint outcome instead of a readiness or completion claim.

- The feature stays at the holdout checkpoint because the snapshot status is `In Progress` and `resolutiondate` is `null`.
- The customer-scope export preserves the blind evidence boundary: `customer_signal_present: true`, `customer_issue_policy: all_customer_issues_only`, `linked_issue_count: 0`, and `subtask_count: 0`.
- Scope discussion in comments about extending export behavior to authoring mode, WS, and advanced export options is treated as contextual planning input, not as finalized scope or promotion evidence.
- No defects, downstream execution items, or release-finalization signals are invented beyond what appears in the copied fixture bundle.

## Evidence Basis
- `BCIN-976.issue.raw.json`
  - Summary: "Ability to export reports from edit mode in Library."
  - Description: users want report export directly from the editor view without saving first.
  - Status snapshot: `In Progress`
  - Resolution snapshot: `null`
  - Priority: `High`
  - Fix version: `26.04`
- `BCIN-976.customer-scope.json`
  - Exported at: `2026-03-21T05:20:34Z`
  - Customer references are present in Jira custom fields.
  - Linked issues: `0`
  - Subtasks: `0`
  - Cutoff policy: `all_customer_issues_only`

## Expectation Coverage
- Explicitly covered: promotion/finalization behavior remains stable on another feature.
- Output aligned with the primary phase: `holdout`.
