# GRID-P4A-BANDING-001 - Phase4a Contract Result

## Scope and Policy Compliance
- Benchmark case: `GRID-P4A-BANDING-001`
- Feature: `BCIN-7231` (modern-grid)
- Primary phase/checkpoint: `phase4a`
- Evidence mode: `blind_pre_defect`
- Blind policy applied: `all_customer_issues_only` (non-customer issues excluded)
- Evidence used: customer-scoped fixture exports only under `./inputs/fixtures/BCIN-7231-blind-pre-defect-bundle/materials/`

## Customer-Evidence Summary (BCIN-7231)
- Feature summary: "Enhance the banding capabilities in the Modern Grid."
- Reported gap in Modern Grid (from customer-scoped Jira feature):
  - Row banding exists, but color formatting is not configurable.
  - Column banding is not available.
  - Banding color cannot be applied by row/column header.
- Customer signal: present (`true`), with explicit customer references in customer fields.

## Phase4a Checkpoint Artifact (Advisory)

### Focus Coverage: Modern Grid Banding Scenarios
The required focus is explicitly covered by defining phase4a validation targets that distinguish:

1. Styling variants
- Variant S1: row banding on/off.
- Variant S2: column banding on/off.
- Variant S3: banding color customization available and applied.
- Variant S4: header-driven banding color application (row header / column header).

2. Interactions
- Interaction I1: toggling row/column banding independently does not overwrite the other setting.
- Interaction I2: changing banding color updates rendered cells immediately and consistently.
- Interaction I3: header-based banding application updates target scope only (row-axis vs column-axis behavior remains distinct).

3. Backward-compatible rendering outcomes
- Compatibility C1: legacy behavior (row-only banding) remains valid when new options are unused.
- Compatibility C2: existing dashboards with prior banding settings render without regression.
- Compatibility C3: rendered readability parity with Report-style banding expectations is maintained for equivalent configurations.

### Phase4a Contract Alignment
- `phase4a` alignment is satisfied by producing a checkpoint-level scenario contract (not implementation, not post-defect triage) that:
  - binds required behavior to explicit scenario IDs (S1-S4, I1-I3, C1-C3),
  - stays within blind pre-defect customer evidence,
  - frames advisory validation targets for the orchestrator phase model.

## Satisfaction Decision (This Benchmark Case)
- Expectation: case focus explicitly covered -> `SATISFIED`.
- Expectation: output aligns with primary phase `phase4a` -> `SATISFIED`.
- Overall (advisory): `SATISFIED` for phase-contract completeness using allowed blind customer evidence.

## Evidence References
- `inputs/fixtures/BCIN-7231-blind-pre-defect-bundle/materials/BCIN-7231.customer-scope.json`
- `inputs/fixtures/BCIN-7231-blind-pre-defect-bundle/materials/BCIN-7231.issue.raw.json`
