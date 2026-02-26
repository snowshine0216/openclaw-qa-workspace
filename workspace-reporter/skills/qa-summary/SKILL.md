---
name: qa-summary
description: Draft generation guide for QA Summary documents. Provides the canonical section template, data source mapping, placeholder policy, and Confluence formatting rules. Invoke in Phase 2 to build the QA summary draft section-by-section from defect-analysis output.
---

# `qa-summary` Skill

## Goal

Guide the agent in constructing a well-structured QA Summary draft (`<KEY>_QA_SUMMARY_DRAFT.md`) from the defect-analysis output. This skill defines what each section must contain, where the data comes from, how to handle missing data, and what formatting rules apply.

---

## Inputs

Before generating the draft, the agent must have access to:

1. `projects/defects-analysis/<KEY>/<KEY>_REPORT_FINAL.md` — primary source of truth for defect counts, risk, PR analysis.
2. `projects/defects-analysis/<KEY>/context/jira_raw.json` — raw Jira issues for cross-referencing.
3. `projects/defects-analysis/<KEY>/context/prs/<PR_ID>_impact.md` — per-PR fix risk analyses.
4. `projects/qa-summaries/<KEY>/run.json` — Confluence page ID and run metadata.

**Never read from `_REPORT_DRAFT.md`. Always use `_REPORT_FINAL.md` as the source.**

---

## Section Template

The draft must use the following heading structure. **No `5.x` numeric prefixes. No tables except where explicitly specified below.**

```markdown
## 🔍 QA Summary

### 1. Overall QA Status
### 2. Code Changes Summary        ← TABLE REQUIRED
### 3. Defect Status Summary       ← TABLE REQUIRED
### 4. Resolved Defects Detail     ← TABLE REQUIRED (P0/P1 only)
### 5. Test Coverage
### 6. Performance
### 7. Security / Compliance
### 8. Regression Testing
### 9. Automation Coverage
```

---

## Section-by-Section Generation Guide

### 1. Overall QA Status

**Data source:** Risk rating and open defect summary from `_REPORT_FINAL.md`.

**Format:** Bullet list. No table.

**Required content:**
- Overall risk level (HIGH / MEDIUM / LOW) with one-sentence rationale.
- Total defects logged (number).
- Currently open defects (number and priority breakdown, e.g. "2 High, 1 Medium").
- One-line release recommendation (e.g. "Ready for release with monitoring" or "Block release — open High defects").

---

### 2. Code Changes Summary

**Data source:** PR impact files in `context/prs/`. Fall back to PR links in `jira_raw.json`.

**Format:** Markdown table. Columns: `Repository`, `PR`, `Files Changed`, `Risk Level`, `Notes`.

**Rules:**
- One row per merged PR.
- Risk Level: HIGH / MEDIUM / LOW (from `_impact.md` fix risk rating).
- Notes: one-line summary of the change scope.
- If a PR impact file is missing: use `[PENDING — PR analysis not available]` in the Notes cell.

---

### 3. Defect Status Summary

**Data source:** Defect counts from `_REPORT_FINAL.md` and `jira_raw.json`.

**Format:** Markdown table. Columns: `Status`, `P0 / Critical`, `P1 / High`, `P2 / Medium`, `P3 / Low`, `Total`.

**Rules:**
- Rows: Open, Resolved, Won't Fix, Total.
- Counts must exactly match `_REPORT_FINAL.md`. Any discrepancy must be flagged as a `[MISMATCH — verify]` note.

---

### 4. Resolved Defects Detail

**Data source:** Resolved issues from `jira_raw.json` filtered to P0/P1 only.

**Format:** Markdown table. Columns: `Defect ID`, `Summary`, `Priority`, `Resolution`, `Notes`.

**Rules:**
- Include **only P0 / Critical and P1 / High** resolved issues.
- After the table, append a count line:
  > *"X additional resolved defects (P2/P3) not shown. Full list: [Jira filter link]."*
- Omit the count line only if there are genuinely zero P2/P3 resolved defects.
- Defect ID must be a hyperlink to the Jira issue.

---

### 5. Test Coverage

**Data source:** Testing notes and functional area breakdown from `_REPORT_FINAL.md`.

**Format:** Bullet list. No table.

**Required content:**
- Functional areas tested and coverage level (Full / Partial / Skipped).
- Notable gaps or areas with limited coverage.
- Manual vs. automated breakdown if available.

---

### 6. Performance

**Data source:** PR notes or dedicated performance test results if available.

**Format:** Bullet list. No table.

**Required content:**
- Performance test outcome (Pass / Fail / Not run).
- Any regressions observed.
- If no performance data: `[PENDING — No performance test results available.]`

---

### 7. Security / Compliance

**Data source:** Security-related defects or review notes in `_REPORT_FINAL.md`.

**Format:** Bullet list. No table.

**Required content:**
- Security test outcome.
- Any open security defects.
- Compliance status if applicable.
- If no data: `[PENDING — No security review data available.]`

---

### 8. Regression Testing

**Data source:** Regression scope from `_REPORT_FINAL.md` or Jira labels/components.

**Format:** Bullet list. No table.

**Required content:**
- Regression test scope (what was run).
- Pass/Fail summary.
- Any regressions found with defect IDs linked.
- If not run: `[PENDING — Regression suite not executed for this cycle.]`

---

### 9. Automation Coverage

**Data source:** Automation labels or notes in Jira issues and PR descriptions.

**Format:** Bullet list. No table.

**Required content:**
- Automated test coverage percentage or scope (if known).
- New automated cases added in this release.
- Any manual-only areas flagged for future automation.
- If no data: `[PENDING — Automation coverage data not available.]`

---

## Placeholder Policy (MANDATORY)

- Every section (1–9) **must** be present in the draft, even if data is missing.
- If data is unavailable for a section, write: `[PENDING — <specific reason>]`.
- Never leave a section blank or omit it.
- `[PENDING]` in table cells must not break table structure — place in the `Notes` column or as a full-row note below the table.

---

## Formatting Rules (MANDATORY)

| Rule | Requirement |
|---|---|
| Top-level heading | `## 🔍 QA Summary` — emoji prefix, no numeric prefix |
| Subsection headings | `### 1.` through `### 9.` — local 1-based numbering, no `5.x` |
| Tables | ONLY for sections 2, 3, 4 (Code Changes, Defect Status, Resolved Defects) |
| All other sections | Bullet lists (`-`) or plain prose — no tables |
| Hyperlinks | All Jira issue IDs and GitHub PR numbers must be markdown hyperlinks |
| Raw Markdown in tables | Not allowed — no `**bold**` or `` ` `` ` `` in table cell content |

---

## Output

Save the completed draft to:
```
projects/qa-summaries/<KEY>/<KEY>_QA_SUMMARY_DRAFT.md
```

After saving, pass the draft to the `qa-summary-review` skill (Phase 3) for quality gate review.
