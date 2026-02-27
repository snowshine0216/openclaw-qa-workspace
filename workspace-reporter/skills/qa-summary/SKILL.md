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

The draft represents the sections the reporter **appends** to the existing Confluence QA Summary section. Section 1 (`Code Changes`) already exists on the Confluence page from the QA plan and must **not** be regenerated.

**No `5.x` numeric prefixes. No tables except where explicitly specified below.**

```markdown
## 📊 QA Summary
(Note: Section 1 "Code Changes" already exists on the Confluence page from the QA plan.
This draft contains sections 2–10 to be appended after it.)

### 2. Defects Code Changes        ← TABLE REQUIRED
### 3. Overall QA Status
### 4. Defect Status Summary       ← TABLE REQUIRED
### 5. Resolved Defects Detail     ← TABLE REQUIRED (P0/P1 only)
### 6. Test Coverage
### 7. Performance
### 8. Security / Compliance
### 9. Regression Testing
### 10. Automation Coverage
```

---

## Section-by-Section Generation Guide

### 2. Defects Code Changes

**Data source:** PR impact files in `context/prs/` — filter to PRs that fix defects (linked Jira issues with type Bug/Defect). Fall back to PR links from defect issues in `jira_raw.json`.

**Format:** Markdown table. Columns: `Repository`, `PR`, `Defects Fixed`, `Risk Level`, `Notes`.

**Rules:**
- One row per defect-fixing PR.
- `Defects Fixed`: comma-separated hyperlinked Jira IDs (e.g. `[ISSUE-101](url), [ISSUE-102](url)`).
- Risk Level: HIGH / MEDIUM / LOW (from `_impact.md` fix risk rating).
- Notes: one-line summary of the fix scope.
- If a PR impact file is missing: use `[PENDING — PR analysis not available]` in the Notes cell.
- If there are no defect-fixing PRs: include a single row with `—` in all data columns and a note: `No defect-fixing PRs identified in this release.`

---

### 3. Overall QA Status

**Data source:** Risk rating and open defect summary from `_REPORT_FINAL.md`.

**Format:** Bullet list. No table.

**Required content:**
- Overall risk level (HIGH / MEDIUM / LOW) with one-sentence rationale.
- Total defects logged (number).
- Currently open defects (number and priority breakdown, e.g. "2 High, 1 Medium").
- One-line release recommendation (e.g. "Ready for release with monitoring" or "Block release — open High defects").

---

### 4. Defect Status Summary

**Data source:** Defect counts from `_REPORT_FINAL.md` and `jira_raw.json`.

**Format:** Markdown table. Columns: `Status`, `P0 / Critical`, `P1 / High`, `P2 / Medium`, `P3 / Low`, `Total`.

**Rules:**
- Rows: Open, Resolved, Won't Fix, Total.
- Counts must exactly match `_REPORT_FINAL.md`. Any discrepancy must be flagged as a `[MISMATCH — verify]` note.

---

### 5. Resolved Defects Detail

**Data source:** Resolved issues from `jira_raw.json` filtered to P0/P1 only.

**Format:** Markdown table. Columns: `Defect ID`, `Summary`, `Priority`, `Resolution`, `Notes`.

**Rules:**
- Include **only P0 / Critical and P1 / High** resolved issues.
- After the table, append a count line:
  > *"X additional resolved defects (P2/P3) not shown. Full list: [Jira filter link]."*
- Omit the count line only if there are genuinely zero P2/P3 resolved defects.
- Defect ID must be a hyperlink to the Jira issue.

---

### 6. Test Coverage

**Data source:** Testing notes and functional area breakdown from `_REPORT_FINAL.md`.

**Format:** Bullet list. No table.

**Required content:**
- Functional areas tested and coverage level (Full / Partial / Skipped).
- Notable gaps or areas with limited coverage.
- Manual vs. automated breakdown if available.

---

### 7. Performance

**Data source:** PR notes or dedicated performance test results if available.

**Format:** Bullet list. No table.

**Required content:**
- Performance test outcome (Pass / Fail / Not run).
- Any regressions observed.
- If no performance data: `[PENDING — No performance test results available.]`

---

### 8. Security / Compliance

**Data source:** Security-related defects or review notes in `_REPORT_FINAL.md`.

**Format:** Bullet list. No table.

**Required content:**
- Security test outcome.
- Any open security defects.
- Compliance status if applicable.
- If no data: `[PENDING — No security review data available.]`

---

### 9. Regression Testing

**Data source:** Regression scope from `_REPORT_FINAL.md` or Jira labels/components.

**Format:** Bullet list. No table.

**Required content:**
- Regression test scope (what was run).
- Pass/Fail summary.
- Any regressions found with defect IDs linked.
- If not run: `[PENDING — Regression suite not executed for this cycle.]`

---

### 10. Automation Coverage

**Data source:** Automation labels or notes in Jira issues and PR descriptions.

**Format:** Bullet list. No table.

**Required content:**
- Automated test coverage percentage or scope (if known).
- New automated cases added in this release.
- Any manual-only areas flagged for future automation.
- If no data: `[PENDING — Automation coverage data not available.]`

---

## Confluence Merge Strategy (MANDATORY)

This draft is appended to the existing Confluence QA Summary section — it does **NOT** replace the full section. During Phase 5 (Confluence Update):

1. **Locate** the `## 📊 QA Summary` section on the Confluence page, which should be located at the **very end** of the document.
2. **Preserve** the existing `### 1. Code Changes` subsection (from the QA plan) — do not overwrite it.
3. **Append** sections 2–10 from this draft immediately after the existing Code Changes table (since it's at the end of the document, this naturally appends to the end of the page).
4. **Do not duplicate** any subsection already present on the page.

---

## Placeholder Policy (MANDATORY)

- Every section (2–10) **must** be present in the draft, even if data is missing.
- If data is unavailable for a section, write: `[PENDING — <specific reason>]`.
- Never leave a section blank or omit it.
- `[PENDING]` in table cells must not break table structure — place in the `Notes` column or as a full-row note below the table.

---

## Formatting Rules (MANDATORY)

| Rule | Requirement |
|---|---|
| Top-level heading | `## 📊 QA Summary` — emoji prefix, no numeric prefix |
| Subsection headings | `### 2.` through `### 10.` — numbering starts at 2 (section 1 is plan's Code Changes) |
| Tables | ONLY for sections 2, 4, 5 (Defects Code Changes, Defect Status Summary, Resolved Defects) |
| All other sections | Bullet lists (`-`) or plain prose — no tables |
| Hyperlinks | All Jira issue IDs and GitHub PR numbers must be markdown hyperlinks |
| Raw Markdown in tables | Not allowed — no `**bold**` or backtick spans in table cell content |

---

## Output

Save the completed draft to:
```
projects/qa-summaries/<KEY>/<KEY>_QA_SUMMARY_DRAFT.md
```

After saving, pass the draft to the `qa-summary-review` skill (Phase 3) for quality gate review.
