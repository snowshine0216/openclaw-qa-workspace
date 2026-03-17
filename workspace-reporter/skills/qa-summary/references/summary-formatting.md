# QA Summary Formatting Contract

The composed QA Summary section is headed by:

```markdown
## 📊 QA Summary
```

Section `1` is planner-sourced context and must be materialized into the draft artifact during Phase 3. Sections `2` through `10` are generated from defect and planner context by reporter scripts.

Composed page structure:

```markdown
## 📊 QA Summary
### 1. Feature Overview ← TABLE REQUIRED
### 2. Code Changes Summary
### 3. Overall QA Status ← BULLET LIST REQUIRED
### 4. Defect Status Summary ← TABLE REQUIRED
### 5. Resolved Defects Detail ← TABLE REQUIRED
### 6. Test Coverage ← BULLET LIST REQUIRED
### 7. Performance ← BULLET LIST REQUIRED
### 8. Security / Compliance ← BULLET LIST REQUIRED
### 9. Regression Testing ← BULLET LIST REQUIRED
### 10. Automation Coverage ← BULLET LIST REQUIRED
```

Draft structure used in report-draft mode and review:

```markdown
## 📊 QA Summary
### 1. Feature Overview
### 2. Code Changes Summary
### 3. Overall QA Status
### 4. Defect Status Summary
### 5. Resolved Defects Detail
### 6. Test Coverage
### 7. Performance
### 8. Security / Compliance
### 9. Regression Testing
### 10. Automation Coverage
```

## Section Rules

### 1. Feature Overview

- Planner-sourced section materialized by `buildFeatureOverviewTable.mjs` and included by `buildSummaryDraft.mjs`.
- `qa-summary-review` must verify that the section is present and the table is populated (real values or `[PENDING]` placeholders).
- Markdown table required
- Rows: `Feature`, `Release`, `QA Owner`, `SE Design`, `UX Design`
- When no SE Design or UX Design is provided, use `[PENDING — No SE Design or UX Design available.]`

### 2. Code Changes Summary

- Markdown table required
- Columns: `Repository`, `PR`, `Type`, `Defects Fixed`, `Risk Level`, `Notes`
- The section must include both defect-fix PRs and feature-level PRs from `defect_summary.json` or `no_defects.json`.
- `Type` is `Defect Fix` when `sourceKind = defect_fix` and `Feature PR` when `sourceKind = feature_change`.
- When no github PRs exist, use one placeholder row explaining that no github prs were identified.

### 3. Overall QA Status

- Bullet list or short prose only
- Must state risk, total defects, open defects, and release recommendation
- When no defects exist, state that no feature defects were found in the chosen defect-analysis scope

### 4. Defect Status Summary

- Markdown table required
- Columns: `Status`, `P0 / Critical`, `P1 / High`, `P2 / Medium`, `P3 / Low`, `Total`
- When no defects exist, the table still renders with zero counts

### 5. Resolved Defects Detail

- Markdown table required
- Columns: `Defect ID`, `Summary`, `Priority`, `Resolution`, `Notes`
- Only P0 and P1 resolved defects appear in the table
- Append a trailing count line when P2/P3 resolved defects were omitted
- When no defects exist, render a single explanatory row

### 6. Test Coverage

- Bullet list or short prose only
- Use planner artifact plus defect-analysis context

### 7. Performance

- Bullet list or short prose only
- If data is missing: `[PENDING — No performance data available.]`

### 8. Security / Compliance

- Bullet list or short prose only
- If data is missing: `[PENDING — No security or compliance data available.]`

### 9. Regression Testing

- Bullet list or short prose only
- If no regression evidence exists: `[PENDING — Regression execution evidence was not provided.]`

### 10. Automation Coverage

- Bullet list or short prose only
- If no coverage data exists: `[PENDING — Automation coverage data is not available.]`

## Placeholder Policy

- Every section `1` through `10` must be present in the draft artifact.
- Missing data uses `[PENDING — <specific reason>]`.
- No section may be omitted.
- Placeholder table content must keep table structure valid.
