# QA Summary Review Rubric

Use this rubric to self-review a generated QA Summary draft. Evaluate every criterion. If any criterion fails, the verdict must be `return phase3` (or `return phase4` for Phase 4 review). Only when all criteria pass may the verdict be `accept`.

---

## Criteria

### C1 — All 12 sections present with correct headings

**Pass**: The draft contains all 12 of these exact headings in order:

```
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

**Fail**: Any heading is missing, renamed, or out of order.

---

### C2 — Section 1 has a populated Feature Overview table

**Pass**: Section 1 contains a Markdown table with rows for `Feature`, `Release`, `QA Owner`, `SE Design`, `UX Design`. Values may be `[PENDING — ...]` but must be present.

**Fail**: No table, table missing required rows, or table has empty cells without a PENDING placeholder.

---

### C3 — Section 3 has a Code Changes Summary table

**Pass**: Section 3 contains a Markdown table with columns: `Repository | PR | Type | Defects Fixed | Risk Level | Notes`. At least one data row is present (PENDING row is acceptable when no PRs exist).

**Fail**: No table, wrong columns, or empty section.

---

### C4 — Section 4 states all four required status points

**Pass**: Section 4 bullet list explicitly mentions: risk level, total defect count, open defect count, and a release recommendation.

**Fail**: Any of the four points is absent. Vague bullets that do not reference actual counts fail.

---

### C5 — Section 5 has a Defect Status Summary table

**Pass**: Section 5 contains a Markdown table with columns `Status | P0 / Critical | P1 / High | P2 / Medium | P3 / Low | Total` and rows `Open`, `Resolved`, `Total`.

**Fail**: No table, missing columns, or missing rows.

---

### C6 — Section 6 has a Resolved Defects Detail table

**Pass**: Section 6 contains a Markdown table with columns `Defect ID | Summary | Priority | Resolution | Notes`. When no resolved P0/P1 defects exist, an explanatory row is present.

**Fail**: No table, wrong columns, or empty section without explanation.

---

### C7 — Sections 7–11 are bullet lists with no empty content

**Pass**: Each of Sections 7–11 contains at least one bullet (`- ...`). When data is missing, the bullet uses the form `- [PENDING — <specific reason>]`.

**Fail**: Any section in 7–11 has no bullets at all, or has prose paragraphs instead of bullets.

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

**Pass**: All numeric defect counts stated in Sections 4 and 5 are consistent with each other and with the totals in the source artifact (`defect_summary.json` or `no_defects.json`).

**Fail**: Any discrepancy between counts in different sections, or counts that do not match the source.

---

### C10 — No section completely absent

**Pass**: Every section heading is followed by content (table, bullet list, or PENDING placeholder). No section is a bare heading with no body.

**Fail**: Any `### N. Title` heading is followed immediately by the next `###` heading or end of file.

---

### C11 — Section 2 has Background & Solution content or PENDING

**Pass**: Section 2 contains at least one bullet (`- ...`). When no background context is available, the bullet uses the PENDING placeholder.

**Fail**: Section 2 has no bullets, or contains only prose paragraphs without bullet structure.

---

### C12 — Section 12 has Known Limitations content or PENDING

**Pass**: Section 12 contains at least one bullet (`- ...`). When no known limitations are available, the bullet uses the PENDING placeholder.

**Fail**: Section 12 has no bullets, or is a bare heading with no body.

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
| C11 | pass/fail | <brief finding or "ok"> |
| C12 | pass/fail | <brief finding or "ok"> |

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

**Rule**: The verdict line must be `- accept` **only** when all 12 criteria are `pass`. If any single criterion is `fail`, the verdict must be the return bullet.
