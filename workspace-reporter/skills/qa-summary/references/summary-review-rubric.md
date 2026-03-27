# QA Summary Review Rubric

Use this rubric to self-review a generated QA Summary draft. Evaluate every criterion. If any criterion fails, the verdict must be `return phase3` (or `return phase4` for Phase 4 review). Only when all criteria pass may the verdict be `accept`.

---

## Criteria

### C1 — All 10 sections present with correct headings

**Pass**: The draft contains all 10 of these exact headings in order:

```
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

**Fail**: Any heading is missing, renamed, or out of order.

---

### C2 — Section 1 has a populated Feature Overview table

**Pass**: Section 1 contains a Markdown table with rows for `Feature`, `Release`, `QA Owner`, `SE Design`, `UX Design`. Values may be `[PENDING — ...]` but must be present.

**Fail**: No table, table missing required rows, or table has empty cells without a PENDING placeholder.

---

### C3 — Section 2 has a Code Changes Summary table

**Pass**: Section 2 contains a Markdown table with columns: `Repository | PR | Type | Defects Fixed | Risk Level | Notes`. At least one data row is present (PENDING row is acceptable when no PRs exist).

**Fail**: No table, wrong columns, or empty section.

---

### C4 — Section 3 states all four required status points

**Pass**: Section 3 bullet list explicitly mentions: risk level, total defect count, open defect count, and a release recommendation.

**Fail**: Any of the four points is absent. Vague bullets that do not reference actual counts fail.

---

### C5 — Section 4 has a Defect Status Summary table

**Pass**: Section 4 contains a Markdown table with columns `Status | P0 / Critical | P1 / High | P2 / Medium | P3 / Low | Total` and rows `Open`, `Resolved`, `Total`.

**Fail**: No table, missing columns, or missing rows.

---

### C6 — Section 5 has a Resolved Defects Detail table

**Pass**: Section 5 contains a Markdown table with columns `Defect ID | Summary | Priority | Resolution | Notes`. When no resolved P0/P1 defects exist, an explanatory row is present.

**Fail**: No table, wrong columns, or empty section without explanation.

---

### C7 — Sections 6–10 are bullet lists with no empty content

**Pass**: Each of Sections 6–10 contains at least one bullet (`- ...`). When data is missing, the bullet uses the form `- [PENDING — <specific reason>]`.

**Fail**: Any section in 6–10 has no bullets at all, or has prose paragraphs instead of bullets.

---

### C8 — No prohibited filler phrases

**Pass**: The draft contains no vague filler such as:
- "Continue monitoring"
- "Review open defects"
- "See context/" or any delegation to file paths
- "TBD", "N/A" without a PENDING explanation

**Fail**: Any of the above patterns appear anywhere in the draft.

---

### C9 — Defect counts in prose match source data

**Pass**: All numeric defect counts stated in Sections 3 and 4 are consistent with each other and with the totals in the source artifact (`defect_summary.json` or `no_defects.json`).

**Fail**: Any discrepancy between counts in different sections, or counts that do not match the source.

---

### C10 — No section completely absent

**Pass**: Every section heading is followed by content (table, bullet list, or PENDING placeholder). No section is a bare heading with no body.

**Fail**: Any `### N. Title` heading is followed immediately by the next `###` heading or end of file.

---

## Output Format

Write your review to the declared review notes file as follows:

```markdown
# QA Summary Self-Review

## Criterion Verdicts

| Criterion | Status | Finding |
|-----------|--------|---------|
| C1 | pass/fail | <brief finding or "ok"> |
| C2 | pass/fail | <brief finding or "ok"> |
| C3 | pass/fail | <brief finding or "ok"> |
| C4 | pass/fail | <brief finding or "ok"> |
| C5 | pass/fail | <brief finding or "ok"> |
| C6 | pass/fail | <brief finding or "ok"> |
| C7 | pass/fail | <brief finding or "ok"> |
| C8 | pass/fail | <brief finding or "ok"> |
| C9 | pass/fail | <brief finding or "ok"> |
| C10 | pass/fail | <brief finding or "ok"> |

## Blocking Findings

<List each failing criterion with specific location and required fix. Write "none" if all pass.>

## Verdict

- accept
```

or

```markdown
## Verdict

- return phase3
```

(Use `- return phase4` when reviewing in Phase 4.)

**Rule**: The verdict line must be `- accept` **only** when every criterion is `pass`. If any single criterion is `fail`, the verdict must be the return bullet.
