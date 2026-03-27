# QA Summary Generation Rubric

Use this rubric when generating the QA Summary draft. Every rule is a hard constraint. Violation means the draft must be regenerated.

## Required Structure

The draft must open with exactly this heading:

```markdown
## 📊 QA Summary
```

Followed immediately by exactly 12 numbered sections in this order:

```markdown
### 1. Feature Overview
### 2. Background & Solution
### 3. Code Changes Summary
### 4. Overall QA Status
### 5. Defect Status Summary
### 6. Resolved Defects Detail
### 7. Test Coverage
### 8. Performance
### 9. Security / Compliance
### 10. Regression Testing
### 11. Automation Coverage
### 12. Known Limitations
```

No section may be omitted. No additional top-level sections may be inserted between them.

---

## Section-by-Section Rules

### Section 1. Feature Overview

- **Required**: Markdown table with exactly these rows: `Feature`, `Release`, `QA Owner`, `SE Design`, `UX Design`.
- Source: `context/feature_overview_table.md` — copy it verbatim.
- If a row value is missing in the source: use `[PENDING — <field> not available in planner artifact.]`.
- Do not add prose above or below the table.

### Section 2. Background & Solution

- **Required**: Bullet list only.
- Source: `context/background_solution_seed.md` or `context/background_solution_seed.json`.
- Include bullets for Background, Problem, Solution, and Out of Scope when present.
- If no background context is available: `- [PENDING — No background or solution context found in planner artifacts. Please provide manually.]`

### Section 3. Code Changes Summary

- **Required**: Markdown table with columns: `Repository | PR | Type | Defects Fixed | Risk Level | Notes`.
- Source: `prs` array from `context/defect_summary.json` or `context/no_defects.json`.
- `Type` must be `Defect Fix` when `sourceKind = defect_fix`, `Feature PR` when `sourceKind = feature_change`.
- `Defects Fixed` must list linked defect keys (e.g. `BCIN-1234`) or `—` when none.
- `Risk Level` must be derived from `riskLevel` in the source; do not uniformly assign `MEDIUM`.
- When no PRs exist: one row with `—` in all data columns and a note explaining no PRs were identified.
- **Hard constraint**: Do not write "See context/prs/" or delegate to any file. Synthesize inline.

### Section 4. Overall QA Status

- **Required**: Bullet list only (no tables, no prose paragraphs).
- Must state all four of: current risk level, total defect count, open defect count, release recommendation.
- When no defects: state explicitly that no feature defects were found in the chosen scope.
- **Hard constraint**: No vague bullets like "Continue monitoring" or "Review open defects". Every bullet must reference specific data.

### Section 5. Defect Status Summary

- **Required**: Markdown table with columns: `Status | P0 / Critical | P1 / High | P2 / Medium | P3 / Low | Total`.
- Rows: `Open`, `Resolved`, `Total`.
- Values must come from `defect_summary.json` counters. Zero counts are fine — use `0`, not `—`.
- When no defects: render the table with all zeros.

### Section 6. Resolved Defects Detail

- **Required**: Markdown table with columns: `Defect ID | Summary | Priority | Resolution | Notes`.
- Include only P0 and P1 resolved defects.
- When P2/P3 resolved defects were omitted: append a trailing line `_N lower-priority resolved defects omitted._`
- When no defects exist: one row with a single explanatory cell explaining no defects were found.
- Defect ID must be a hyperlink: `[KEY](url)`.

### Section 7. Test Coverage

- **Required**: Bullet list only.
- Source: planner artifact test coverage sections + defect-analysis context.
- If no coverage data: `- [PENDING — No test coverage data available from planner or defect context.]`

### Section 8. Performance

- **Required**: Bullet list only.
- If no performance data: `- [PENDING — No performance data available.]`

### Section 9. Security / Compliance

- **Required**: Bullet list only.
- If no security data: `- [PENDING — No security or compliance data available.]`

### Section 10. Regression Testing

- **Required**: Bullet list only.
- If no regression evidence: `- [PENDING — Regression execution evidence was not provided.]`

### Section 11. Automation Coverage

- **Required**: Bullet list only.
- If no coverage data: `- [PENDING — Automation coverage data is not available.]`

### Section 12. Known Limitations

- **Required**: Bullet list only.
- Source: `context/known_limitations_seed.json` — use the `lines` array. Each line becomes one bullet.
- If `lines` is empty or the file is absent: `- [PENDING — No known limitations identified from planner artifacts.]`
- Do not duplicate items already in Section 2 Out of Scope bullets.

---

## Placeholder Policy

- Every missing data point uses exactly: `[PENDING — <specific reason>]`
- Never omit a section because data is missing. Use the PENDING placeholder.
- Never use generic placeholders like `[TBD]` or `[N/A]`.
- Tables with no real rows must still include a header row and at least one data row (PENDING or zero-count).

---

## Hard Constraints (violation = generation failure)

- ❌ No filler prose: "See defect report", "Refer to context files", "Continue monitoring"
- ❌ No delegation to file paths in the draft content
- ❌ No fabricated defect keys, PR numbers, or counts not present in source artifacts
- ❌ No uniform risk levels — `Risk Level` must differ across PRs when source data differs
- ❌ No missing section headings — all 12 `### N. Title` headings must appear
- ✅ Use only data from `context/defect_summary.json`, `context/no_defects.json`, `context/feature_overview_table.md`, `context/planner_summary_seed.md`, `context/background_solution_seed.md`, and `context/known_limitations_seed.json`
