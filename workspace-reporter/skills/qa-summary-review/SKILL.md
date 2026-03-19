---
name: qa-summary-review
description: Used when reviewing qa summary draft.  Reviews the draft for Coverage completeness (defect counts, risk coherence, section presence) and Formatting compliance (emoji headings, 1-based numbering, table/bullet rules, P0/P1 resolved defect filter).
---

# `qa-summary-review` Skill

## Goal

Act as the quality gate for a generated QA summary draft before it reaches the check_runtime_env iuser approval gate. This skill does not generate content — it reviews the existing draft against two axes: **Coverage** and **Formatting**. It produces a structured review file and either passes the draft or returns actionable fixes. Phase 4 applies fixes from the review output and re-invokes this skill until the verdict is `pass`. If the user later provides approval-time revision feedback, qa-summary regenerates the draft from persisted context before invoking this skill again.

---

## Inputs

Paths are resolved from the qa-summary run root passed by Phase 4. The `defects_run_root` comes from `task.json` in the run dir.

1. **Draft:** `<qa-summary-skill-root>/runs/<feature-key>/drafts/<feature-key>_QA_SUMMARY_DRAFT.md`
2. **Defect report:** `<defects_run_root>/<feature-key>/<feature-key>_REPORT_FINAL.md` (default: `workspace-reporter/skills/defects-analysis/runs/<feature-key>/`)
3. **Jira raw:** `<defects_run_root>/<feature-key>/context/jira_raw.json`
4. **Fallback (no-defect flow):** When `_REPORT_FINAL.md` is absent, use `<qa-summary-run-root>/context/defect_summary.json` or `context/no_defects.json` for count cross-check.

---

## Review Axis 1: Coverage

Verify that the draft adequately covers all required testing dimensions and that all numbers are accurate.

### C1 — All 10 Sections Present

The draft contains sections **1–10**. Section 1 ("Feature Overview") is planner-sourced but materialized in the draft by qa-summary Phase 1/3; the reviewer verifies it is present and populated. Sections 2–10 are reporter-generated. Check that each of the following headings exists in the draft (exact name match, case-insensitive), under `## 📊 QA Summary`:
- `1. Feature Overview` ← TABLE REQUIRED
- `2. Code Changes Summary` ← TABLE REQUIRED
- `3. Overall QA Status` ← BULLET LIST REQUIRED
- `4. Defect Status Summary` ← TABLE REQUIRED
- `5. Resolved Defects Detail` ← TABLE REQUIRED
- `6. Test Coverage` ← BULLET LIST REQUIRED
- `7. Performance` ← BULLET LIST REQUIRED
- `8. Security / Compliance` ← BULLET LIST REQUIRED
- `9. Regression Testing` ← BULLET LIST REQUIRED
- `10. Automation Coverage` ← BULLET LIST REQUIRED

**Pass:** All 10 present (with content or a valid `[PENDING]` placeholder).
**Fail:** Any section missing or empty without a placeholder. Auto-fix: insert the section with a `[PENDING — section not generated]` placeholder and log.

---

### C2 — Defect Count Accuracy

Cross-check the following numbers between the draft and the defect source. **Source:** `_REPORT_FINAL.md` when present; otherwise `context/defect_summary.json` or `context/no_defects.json` (no-defect flow).

| Field | Draft location | Source |
|---|---|---|
| Total logged defects | Section 3 (Overall QA Status) | Defect source total defect count |
| Currently open defects | Section 3 + Section 4 table | Defect source open defect count |
| Resolved defects count | Section 4 table (Resolved row) | Defect source resolved count |

**Pass:** All three counts match the source exactly.
**Fail:** Any mismatch. Auto-fix: update the count in the draft to match the defect source and log the correction. If the source itself is ambiguous, flag as a `[MISMATCH — verify: draft says X, source says Y]` warning.

---

### C3 — Risk Assessment Coherence

Verify the Overall Risk Level stated in Section 3 (Overall QA Status) is logically consistent with the defect data:

- If any P0/Critical or P1/High defects are **open** → risk must be **HIGH**.
- If only P2/Medium open defects remain → risk must be at least **MEDIUM**.
- If zero open defects → risk may be **LOW**.

**Pass:** Risk level is consistent with open defect priority distribution.
**Fail:** Risk level contradicts the data. Do NOT auto-fix — emit a warning:
> *"⚠️ Risk Assessment mismatch: draft states MEDIUM risk but 2 open High-priority defects exist in REPORT_FINAL."*

---

### C4 — Open Defects Table Completeness

Verify that the "Currently Open Defects" in Section 4 (Defect Status Summary) reflects the open issues in `jira_raw.json`:

- Every open defect in `jira_raw.json` with status not in `[Resolved, Closed, Won't Fix]` must appear in the table.
- Table columns must include: `Defect ID`, `Summary`, `Status`, `Priority`, `Notes`.
- All `Defect ID` values must be hyperlinks.

**Pass:** All open defects represented with correct columns and hyperlinks.
**Fail:** Missing defects or missing columns. Auto-fix missing hyperlinks. Log missing defects as:
> *"⚠️ Open defect ISSUE-123 present in jira_raw.json but missing from open defects table."*

---

### C5 — Defect-Fixing PR Coverage Reflected

Check that every defect-fixing PR referenced in `_REPORT_FINAL.md` or `context/prs/` appears in Section 2 (Code Changes Summary):

- A defect-fixing PR is any PR linked to a Jira issue of type Bug/Defect.
- If a defect-fixing PR is in the analysis context but absent from the table → warn.
- Do NOT auto-fix missing PR rows (requires human judgment on scope). Emit:
> *"⚠️ Defect-fixing PR #456 found in context/prs/ but not reflected in Code Changes Summary table."*

---

## Review Axis 2: Formatting

Verify that the draft complies with the Confluence formatting rules defined in Enhancement 7.

### F1 — Top-Level Heading Format

**Required:** The QA Summary section heading must be `## 📊 QA Summary`.

**Pass:** Heading found with emoji prefix, no numeric prefix.
**Fail:** Heading uses `5. QA Summary`, `## 🔍 QA Summary`, `## QA Summary` (no emoji), or any other variant. Auto-fix: replace with `## 📊 QA Summary` and log.

---

### F2 — Subsection Numbering

**Required:** Subsections must use `### 1.` through `### 10.` numbering. The draft is self-contained with section 1 (Feature Overview) materialized from planner context; all 10 sections use sequential numbering.

**Pass:** All subsections use the correct 1–10 sequential numbering.
**Fail:** Any subsection using `1.x`, `5.x`, or any non-sequential prefix. Auto-fix: renumber to the correct sequence (1–10) and log.

---

### F3 — Table Usage Compliance

**Required tables (must have a table):** Section 2 (Code Changes Summary), Section 4 (Defect Status Summary), Section 5 (Resolved Defects Detail). Section 1 (Feature Overview) is planner-owned; if present in the draft, verify it has a table.

**Forbidden tables (must NOT have a table):** Sections 3, 6, 7, 8, 9, 10.

Check each section:
- Sections 2, 4, 5: Verify a Markdown table (`|`) is present with at least a header row and one data/placeholder row.
- Sections 3, 6–10: Verify no Markdown table is present.

**Pass:** Table presence matches the requirement for all 10 sections.
**Fail (missing table):** Log: *"⚠️ Section [N] is missing the required table."* Phase 4 applies the fix from the review output and re-invokes this skill.
**Fail (unexpected table):** Auto-fix: convert the table to a bullet list representation and log.

---

### F4 — Resolved Defects Priority Filter

**Required:** Section 5 (Resolved Defects Detail) table contains only P0/Critical and P1/High resolved issues.

Check each row in the Resolved Defects table against `jira_raw.json` for priority:
- Any P2/Medium or lower priority row → auto-fix: remove the row from the table.
- After the table, verify a trailing count line exists if any P2/P3 resolved issues exist in `jira_raw.json`:
  > *"X additional resolved defects (P2/P3) not shown."*
- Auto-fix: add the count line if missing.

**Pass:** Table contains only P0/P1 rows; trailing count line present (or absent when genuinely no P2/P3).
**Fail:** P2/P3 rows in table (auto-fix: remove) or missing trailing count line (auto-fix: add).

---

### F5 — Hyperlink Completeness

All Jira issue IDs (format: `[A-Z]+-[0-9]+`) and GitHub PR references (`#NNN` or `PR-NNN`) in the draft must be Markdown hyperlinks `[text](url)`.

**Pass:** All references hyperlinked.
**Fail:** Any bare reference found. Auto-fix: wrap as `[ISSUE-123](https://jira.company.com/browse/ISSUE-123)` using the base URL from `run.json` or a known default. Log each fix.

---

### F6 — No Raw Markdown Leakage

Verify that table cells do not contain raw Markdown syntax that would render incorrectly in Confluence:
- No `**text**` inside table cells (use plain text instead).
- No backtick code spans inside table cells (move to Notes outside the table).
- No nested `|` characters in table cells (escape or rephrase).

**Pass:** No raw Markdown syntax in table cells.
**Fail:** Auto-fix where unambiguous (e.g. strip `**`). Log all changes.

---

## Auto-Fix vs. Warn Protocol

| Check | On Fail |
|---|---|
| C1 — Missing section | Auto-fix: insert `[PENDING]` placeholder |
| C2 — Defect count mismatch | Auto-fix: update count to match defect source; flag ambiguous cases |
| C3 — Risk assessment incoherent | Warn only — human judgment required |
| C4 — Open defects table incomplete | Auto-fix hyperlinks; warn about missing defect rows |
| C5 — PR not reflected | Warn only |
| F1 — Wrong top-level heading | Auto-fix |
| F2 — Wrong subsection numbering | Auto-fix |
| F3 — Missing required table | Phase 4 applies fix and re-invokes this skill |
| F3 — Unexpected table in prose section | Auto-fix: convert to bullet list |
| F4 — P2/P3 in resolved table | Auto-fix: remove rows; add trailing count line |
| F5 — Missing hyperlinks | Auto-fix |
| F6 — Raw Markdown in tables | Auto-fix where unambiguous |

---

## Output

Save the review result to two artifacts:

1. **Human-readable review file:**
```
<qa-summary-skill-root>/runs/<feature-key>/<feature-key>_QA_SUMMARY_REVIEW.md
```

2. **Machine-readable control-plane output (required):**
```
<qa-summary-skill-root>/runs/<feature-key>/context/review_result.json
```

The `context/review_result.json` file must follow this schema and is consumed by Phase 4 for verdict handling:

```json
{
  "verdict": "pass",
  "autoFixesApplied": 2,
  "warnings": ["Performance section uses pending placeholder."],
  "requiresRefactor": false,
  "reviewOutputPath": "<feature-key>_QA_SUMMARY_REVIEW.md",
  "updatedDraftPath": "drafts/<feature-key>_QA_SUMMARY_DRAFT.md"
}
```

- `verdict`: `pass` or `fail`
- `requiresRefactor`: `true` when Phase 4 should apply a refactor pass and requeue review
- `updatedDraftPath`: path to the draft after auto-fixes (run-dir-relative)

### Review File Format

```markdown
# QA Summary Review — <KEY>

**Verdict:** PASS | FAIL
**Auto-fixes applied:** <N>
**Warnings requiring human attention:** <N>

## Coverage Checklist
- [x] C1 — All 10 sections present (sections 1–10)
- [x] C2 — Defect counts accurate (Total: 12, Open: 3, Resolved: 9)
- [ ] C3 — Risk Assessment coherent ⚠️ WARNING: see below
- [x] C4 — Open defects table complete (section 4)
- [x] C5 — Defect-fixing PR coverage reflected (section 2: Code Changes Summary)

## Formatting Checklist
- [x] F1 — Top-level heading: `## 📊 QA Summary`
- [x] F2 — Subsection numbering: sequential 1–10
- [x] F3 — Table usage compliant (sections 2, 4, 5 have tables; sections 3, 6–10 use bullets; section 2 = Code Changes Summary)
- [x] F4 — Resolved Defects (section 5): P0/P1 only (3 P2 rows removed, count line added)
- [x] F5 — All references hyperlinked
- [x] F6 — No raw Markdown in tables

## Auto-Fixes Applied
1. Section 5: Removed 3 P2 rows (ISSUE-201, ISSUE-202, ISSUE-203). Added trailing count line.
2. F5: Hyperlinked 2 bare Jira references (ISSUE-198, ISSUE-199).

## Warnings (Human Review Required)
- ⚠️ C3: Risk stated as MEDIUM but ISSUE-197 (P1/High) is open. Confirm risk level before approving.
- ⚠️ C5: Defect-fixing PR #512 found in context/prs/ but not in Code Changes Summary. Was this PR in scope?
```

---

## After Review

- **PASS (with or without auto-fixes):** Update the draft file with any auto-fixes applied. Render the final summarized draft to the console/chat so the user can read it without opening the file. Proceed to the user approval gate (APPROVE or revision feedback).
- **FAIL:** Do NOT return to Phase 2. The review file lists required fixes. Phase 4 applies them via `applyReviewRefactor` and re-invokes this skill until the verdict is `pass`. Do NOT render to console on FAIL.
- **Warnings:** Always surface warnings in the approval prompt, even on PASS.
