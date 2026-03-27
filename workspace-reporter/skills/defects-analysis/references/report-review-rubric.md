# Report Review Rubric

This rubric governs the self-review pass that follows report generation. After writing the draft report, review it against every criterion below and write your findings to the required output files.

## Required Outputs

You must produce both files before the review pass is complete:

**`context/report_review_notes.md`** — per-criterion assessment (see format below)
**`context/report_review_delta.md`** — summary of blocking findings + terminal verdict

---

## Review Criteria

Evaluate each criterion. Record verdict as `pass` or `fail` with a brief explanation.

### C1 — All 12 sections present
- **Check**: Draft contains all 12 headings with exact text: "## 1. Report Header", "## 2. Executive Summary", ..., "## 12. Appendix: Defect Reference List"
- **Pass**: All 12 present
- **Fail**: Any heading is missing or renamed

### C2 — Executive summary has priority breakdown table
- **Check**: Section 2 contains a markdown table with at least columns for Priority, Total, and Open
- **Pass**: Table present with data rows
- **Fail**: Section 2 is prose only, or table has no data rows

### C3 — Executive summary names specific defect keys
- **Check**: Section 2 text references at least one defect key (e.g. "BCIN-7669") in the risk narrative
- **Pass**: At least one defect key cited in narrative
- **Fail**: Section 2 is entirely generic with no specific key references

### C4 — Functional areas are domain-specific (not "General")
- **Check**: Section 4 table rows do not use "General", "Miscellaneous", "Other" as the primary area for more than 20% of defects
- **Pass**: All named areas are domain-specific (e.g. "Save / Save-As Flows", "Prompt Handling")
- **Fail**: "General" or equivalent covers the majority of defects

### C5 — Every open High/Critical defect key appears in the body
- **Check**: For each defect with status Open/In Progress and priority High or Critical, its key appears somewhere in sections 2–11 (not just the appendix)
- **Pass**: All such keys cited at least once
- **Fail**: Any open High/Critical key absent from sections 2–11

### C6 — PR risk levels are differentiated
- **Check**: Section 6 does not assign MEDIUM risk to every PR; at least one PR has a different level if data supports it
- **Pass**: Risk levels vary across PRs, or only one PR exists
- **Fail**: All PRs rated uniformly MEDIUM with no reasoning

### C7 — Section 6 synthesizes (no delegation)
- **Check**: Section 6 does not contain "See context/prs/", "refer to PR context", or equivalent delegating phrases
- **Pass**: Each PR has inline synthesis
- **Fail**: Any delegation phrase found

### C8 — Residual risk table has specific defect keys
- **Check**: Section 7 table names specific defect keys in the Risk column for open High/Critical defects
- **Pass**: At least one row per open High/Critical defect with its key named
- **Fail**: Section 7 is generic bullets or has no rows when blocking defects exist

### C9 — QA focus areas are actionable (no filler)
- **Check**: Section 8 does not contain phrases like "Review open defects and prioritize", "Continue monitoring", "Address remaining issues", "Ensure thorough testing"
- **Pass**: Each item maps to a specific defect key or PR
- **Fail**: Any filler phrase found

### C10 — Verification checklist covers all blocking defects
- **Check**: Section 10 has at least one checklist item per open High/Critical defect
- **Pass**: All blocking defects covered
- **Fail**: Any blocking defect absent from checklist

### C11 — Conclusion has explicit verdict
- **Check**: Section 11 contains one of: **HOLD**, **CONDITIONAL GO**, or **GO** (bolded)
- **Pass**: Verdict present and matches risk data (HOLD if open High/Critical defects exist)
- **Fail**: No explicit verdict, or verdict contradicts data (GO when open Critical defects exist)

### C12 — No prohibited filler phrases anywhere
- **Check**: Entire report does not contain: "Review open defects and prioritize testing", "See context/prs/ for details", "Continue to monitor", "Ensure comprehensive testing"
- **Pass**: None found
- **Fail**: Any found

---

## Pass / Return Rules

After evaluating all criteria:

- **`accept`**: All 12 criteria pass
- **`return phase5`**: Any criterion fails — list the failing criteria IDs and explanations in `report_review_delta.md`

Only one terminal verdict is allowed. Do not write both.

---

## report_review_notes.md Format

```markdown
## Report Review Notes

### C1 — All 12 sections present
**Verdict**: pass | fail
**Explanation**: <one sentence>

### C2 — Executive summary has priority breakdown table
...

(repeat for all 12 criteria)
```

---

## report_review_delta.md Format

```markdown
## Blocking Findings

| Criterion | Finding | Status |
|-----------|---------|--------|
| C3 | Executive summary mentions no defect keys | fail |
| C6 | All 5 PRs rated MEDIUM with identical wording | fail |

(use "none" row if no failures)

## Verdict

- accept
```

or

```markdown
## Verdict

- return phase5
```

The `## Verdict` section must end with exactly one bullet: either `- accept` or `- return phase5`.
