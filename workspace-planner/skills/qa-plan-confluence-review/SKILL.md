---
name: qa-plan-confluence-review
description: Full quality gate for a published QA Plan Confluence page. Verifies formatting compliance (emoji headers, numbered sub-categories, table restrictions), structural completeness (all required sections present), and cross-artifact accuracy (Jira AC coverage, PR coverage, Figma notes). Invoked after publication in `feature-qa-planning-orchestrator`.
---

# `qa-plan-confluence-review` Skill

## Goal

Act as the final quality gate after a QA Plan has been published to Confluence. This skill does **not** generate or edit content — it reviews the live Confluence page against three axes: **Formatting**, **Structure**, and **Cross-Artifact Accuracy**. It produces a structured review file and either passes or returns actionable fixes.

---

## When to Use

- After Step 4 (Publication) of the `feature-qa-planning` workflow
- When a user asks to "verify the Confluence QA plan page"
- When re-running formatting compliance after a manual edit

---

## Inputs

1. **Confluence page** — fetch the live page content using the `confluence` skill:
   ```
   confluence read <page-id>
   ```
2. `projects/feature-plan/<feature-id>/context/jira.json` — Jira issue for AC cross-check
3. `projects/feature-plan/<feature-id>/context/github_pr.json` — PR metadata for PR coverage check
4. `projects/feature-plan/<feature-id>/context/github_diff.md` — diff for file coverage check
5. `projects/feature-plan/<feature-id>/qa_plan_final.md` — the approved local plan for comparison

---

## Review Axis 1: Formatting

Verify that the published Confluence page matches the canonical QA plan formatting rules.

### F1 — Main Section Headers: Emoji Prefix, No Numeric Prefix

**Required:** All top-level (`##`) section headers must have an emoji prefix and NO numeric prefix.

Required headers (exact emoji + name):
- `## 📊 Summary`
- `## 📝 Background`
- `## 🎯 QA Goals`
- `## 🧪 Test Key Points`
- `## ⚠️ Risk & Mitigation`
- `## 📎 Consolidated Reference Data`
- `## 🎯 Sign-off Checklist`
- `## 📊 QA Summary`
- `## 📝 Notes`

**Pass:** All top-level section headers found with emoji, no number prefix.
**Fail:** Header uses numeric prefix (e.g., `## 2. QA Goals`) or is missing emoji. Log each violation. Do NOT auto-fix — return to plan generation.

---

### F2 — Sub-Category/Subsection Headers: Numbered

**Required:** All `###`-level headers within a section must use 1-based local numbering.

Check each section's subsections:
- Background: `### 1. Key Problem Statement`, `### 2. Solution`, `### 3. Business Context`
- QA Goals: `### 1. E2E`, `### 2. FUN`, `### 3. UX`, `### 4. PERF`, `### 5. SEC`, `### 6. ACC`, `### 7. CER`, `### 8. UPG`, `### 9. INT`, `### 10. AUTO`
- QA Plan Test Key Points: numbered subsections (e.g., `### 1. UI Testing`, `### 2. Backend Testing`, etc.)
- Risk & Mitigation: `### 1. Technical Risks`, `### 2. Data Risks`, `### 3. UX Risks`
- Consolidated Reference Data: `### 1. Source Documents`, `### 2. Stakeholders`, `### 3. Test Data`, `### 4. Dependencies`
- Sign-off Checklist: `### 1. Development Team`, `### 2. QA Team`, `### 3. Product Team`, `### 4. Security Team`, `### 5. Release Readiness`
- QA Summary: `### 1. Code Changes` (no number needed — only one subsection)

**Pass:** All subsections are numbered correctly within their parent section.
**Fail:** Any unnumbered subsection at `###` level. Log: *"⚠️ Section [X] subsection [Y] is missing its numeric prefix."* Do NOT auto-fix.

---

### F3 — Table Usage Compliance

Tables are permitted **only** in:
1. `## 📊 Summary` — the feature summary table at the top
2. `## 🧪Test Key Points` — one table per test category subsection
3. `## ⚠️ Risk & Mitigation` — one table per risk category subsection
4. `## 📊 QA Summary` → `### 1. Code Changes` — Code Changes table only

Tables are **forbidden** in:
- `## 📝 Background`
- `## 🎯 QA Goals`
- `## 📎 Consolidated Reference Data`
- `## 🎯 Sign-off Checklist`
- `## 📝 Notes`

**Pass:** Table presence matches the rules above for all sections.
**Fail (unexpected table):** Log: *"⚠️ Table found in [section name] — this section must use bullet lists only."* Do NOT auto-fix (requires human edit in Confluence).
**Fail (missing required table):** Log: *"⚠️ [Section name] subsection [Y] is missing the required table."* Do NOT auto-fix.

---

### F4 — QA Summary Contains Only Code Changes (Plan Stage)

**Required:** `## 📊 QA Summary` must contain `### 1. Code Changes` with a table having columns: `PR`, `Files Changed`, `PR Summary`. 
*Note: During the QA Plan stage, no other subsections are permitted. However, if the page has already entered the QA Summary Stage (Reporter Agent has run), sections 2-10 will be appended. The presence of sections 2-10 is valid if it's acknowledged as the Reporter Agent's output.*

**Pass:** QA Summary has exactly one subsection (Code Changes), OR contains sections 2-10 appended by the Reporter.
**Fail:** Any extra subsections during plan generation stage. Log: *"⚠️ QA Summary contains unexpected subsection [X] — plan-stage QA Summary must only contain Code Changes."*

---

### F5 — QA Summary Position

**Required:** `## 📊 QA Summary` must appear at the **very end** of the document, after all other sections including `## 📝 Notes`.

**Pass:** QA Summary appears at the very end.
**Fail:** QA Summary is not the last section. Log: *"⚠️ QA Summary is out of position — must be at the very end of the document after Notes."*

---

### F6 — Hyperlink Completeness

All Jira issue keys (`[A-Z]+-[0-9]+`) and GitHub PR references (`#NNN` or `PR #NNN`) must be hyperlinks.

**Pass:** All references are hyperlinked.
**Fail:** Any bare reference found. Log each instance. Do NOT auto-fix on Confluence (provide the corrected text for the human to apply).

---

## Review Axis 2: Structure

Verify all required sections and subsections are present with non-empty content.

### S1 — All Required Sections Present

Check that each of the following top-level sections exists in the published page (emoji + name, case-insensitive):

- `📊 Summary`
- `📝 Background`
- `🎯 QA Goals`
- `🧪 Test Key Points`
- `⚠️ Risk & Mitigation`
- `📎 Consolidated Reference Data`
- `🎯 Sign-off Checklist`
- `📊 QA Summary`
- `📝 Notes`

**Pass:** All 9 sections present with at least one non-empty content line.
**Fail:** Any section missing or empty. Log: *"⚠️ Section [X] is missing or empty."*

---

### S2 — QA Goals: All 10 Sub-Categories Present

Check that all 10 goal sub-categories exist in `## 🎯 QA Goals`:

`1. E2E`, `2. FUN`, `3. UX`, `4. PERF`, `5. SEC`, `6. ACC`, `7. CER`, `8. UPG`, `9. INT`, `10. AUTO`

Each must contain at least one bullet point.

**Pass:** All 10 sub-categories present with at least one bullet.
**Fail:** Any missing. Log: *"⚠️ QA Goals sub-category [X] is missing."*

---

### S3 — Test Key Points: At Least One Subsection with a Table

**Required:** `## 🧪 Test Key Points` must have at least one numbered subsection containing a table with columns `Priority`, `Related Code Change`, `Test Key Points`, `Expected Results` (additional columns allowed). `Related Code Change` is strictly required for traceability.

**Pass:** At least one subsection with a properly-structured table present including the `Related Code Change` column.
**Fail:** No tables in Test Key Points, or the table is missing the required columns. Log: *"⚠️ Test Key Points missing required table or missing required column 'Related Code Change'."*

---

### S4 — Risk & Mitigation: At Least One Subsection with a Table

**Required:** `## ⚠️ Risk & Mitigation` must have at least one numbered subsection containing a table with columns `Risk`, `Impact`, `Likelihood`, `Mitigation Strategy` (additional columns allowed).

**Pass:** At least one subsection with a properly-structured table.
**Fail:** No tables in Risk & Mitigation. Log: *"⚠️ Risk & Mitigation has no risk tables."*

---

### S5 — Summary Table Fields

**Required:** The `## 📊 Summary` table must include at minimum:

| Field | Required |
|-------|----------|
| Feature Link (Jira) | ✅ |
| Release Version | ✅ |
| QA Owner | ✅ |
| SE Design Link (Confluence) | ✅ if available |
| UX Design Link (Figma) | ✅ if available |
| GitHub PR Link | ✅ |
| Date Generated | ✅ |
| Plan Status | ✅ |

**Pass:** All required fields present (non-placeholder values where data is available).
**Fail:** Any required field missing. Log: *"⚠️ Summary table missing field: [X]."*

---

## Review Axis 3: Cross-Artifact Accuracy

Cross-check the published plan against the source artifacts to verify accuracy.

### A1 — Jira AC Coverage

For each Acceptance Criterion listed in `context/jira.json`:
- Verify at least one test scenario in `## 🧪 Test Key Points` traces back to it (by Jira key reference or explicit AC description match).

**Pass:** All ACs have at least one corresponding test scenario.
**Fail:** Any AC not covered. Log: *"⚠️ Acceptance Criterion [X] from Jira has no corresponding test in Test Key Points."*
**Warn only** — do not auto-fix.

---

### A2 — PR Coverage in QA Summary Code Changes

For each PR in `context/github_pr.json`:
- Verify the PR appears in the `### 1. Code Changes` table in `## 📊 QA Summary`.
- Verify the `Files Changed` cell lists at least one file from the PR diff in `context/github_diff.md`.

**Pass:** All PRs represented with correct file references.
**Fail:** Missing PR. Log: *"⚠️ PR #[NNN] from context/github_pr.json not found in QA Summary Code Changes table."*
**Warn only** — do not auto-fix.

---

### A3 — Risk Coverage for High-Risk Code Changes

For each file in `context/github_diff.md` marked as high-churn (>50 lines changed) or in a security-critical path:
- Verify at least one risk entry in `## ⚠️ Risk & Mitigation` references it.

**Pass:** All high-risk files have corresponding risk entries.
**Fail:** Any unaddressed high-risk file. Log: *"⚠️ High-churn file [path] has no corresponding risk entry in Risk & Mitigation."*
**Warn only** — do not auto-fix.

---

### A4 — Figma Design Notes Reflected

If a Figma URL is present in the Summary table:
- Verify `## 🎯 QA Goals` sub-category `3. UX: User Experience` has at least 2 bullet points referencing UI validation.
- Verify `## 🧪 Test Key Points` has a UI Testing subsection.

**Pass:** UX goals and UI Testing subsection present with content.
**Fail:** UX goals empty or UI Testing subsection missing when a Figma URL is provided. Log: *"⚠️ Figma URL present in Summary but UX testing goals/test cases are missing."*

---

## Auto-Fix vs. Warn Protocol

| Check | On Fail |
|-------|---------|
| F1 — Wrong/missing emoji header | Log + return to generation (no auto-fix on Confluence) |
| F2 — Unnumbered subsection | Log + return to generation |
| F3 — Unexpected table in bullet-only section | Log + provide corrected text for human |
| F3 — Missing required table | Log + return to generation |
| F4 — QA Summary has extra subsections | Log (human must remove from Confluence) |
| F5 — QA Summary out of position | Log (human must reorder in Confluence) |
| F6 — Missing hyperlinks | Log + provide corrected hyperlink text |
| S1 — Missing section | Log + return to generation |
| S2 — Missing QA Goals sub-category | Log + return to generation |
| S3 — No Test Key Points table | Log + return to generation |
| S4 — No Risk & Mitigation table | Log + return to generation |
| S5 — Summary table missing fields | Log + provide missing field values if available from context |
| A1 — Jira AC not covered | Warn only |
| A2 — PR missing from Code Changes | Warn only |
| A3 — High-risk file not in Risk & Mitigation | Warn only |
| A4 — Figma notes not reflected | Warn only |

---

## Output

Save the review result to:
```
projects/feature-plan/<feature-id>/qa_plan_confluence_review_v<N>.md
```

### Review File Format

```markdown
# QA Plan Confluence Review — <feature-id>

**Confluence Page ID:** <page-id>
**Reviewed At:** <timestamp>
**Verdict:** PASS | FAIL
**Issues requiring generation fix:** <N>
**Warnings requiring human attention:** <N>

## Formatting Checklist
- [x] F1 — Main section headers: emoji prefix, no numeric prefix
- [x] F2 — Subsections numbered correctly
- [ ] F3 — Table usage compliant ⚠️ see below
- [x] F4 — QA Summary contains only Code Changes
- [x] F5 — QA Summary positioned at end
- [x] F6 — All references hyperlinked

## Structure Checklist
- [x] S1 — All 9 sections present
- [x] S2 — All 10 QA Goals sub-categories present
- [x] S3 — Test Key Points has at least one table
- [x] S4 — Risk & Mitigation has at least one table
- [x] S5 — Summary table fields complete

## Cross-Artifact Checklist
- [ ] A1 — Jira AC coverage ⚠️ WARNING: see below
- [x] A2 — All PRs in Code Changes table
- [x] A3 — High-risk files covered in Risk & Mitigation
- [x] A4 — Figma UX notes reflected

## Issues (Fix Required)
1. F3: Table found in `## 🎯 QA Goals` → sub-category `### 3. UX` — convert to bullet list.

## Warnings (Human Review Recommended)
- ⚠️ A1: AC "Given user is on mobile, when tapping submit, confirm haptic feedback" has no test case in Test Key Points.
- ⚠️ A2: PR #234 found in github_pr.json but not in QA Summary Code Changes.
```

---

## After Review

- **PASS (no issues, warnings only):** Update `task.json` phase to `completed`. Surface all warnings in the chat for human review. Do not block the workflow.
- **FAIL (issues requiring generation fix):** Do NOT mark as completed. Log which checks failed and what needs to be fixed. Return to the planner review/refactor loop, or to plan generation only if the orchestrator explicitly determines the fix requires regenerating the draft.
- **FAIL (Confluence-side manual fixes):** Provide exact corrected text for the human to apply directly in Confluence. Once human confirms the fix, re-run this skill to verify.

## 2026-03-06 Redesign Addendum

Apply these rules in addition to the existing review contract above.

### Invocation Source

This skill is invoked by `feature-qa-planning-orchestrator`, not the removed legacy workflow file.

### Versioned Output

Write live review artifacts as:
- `projects/feature-plan/<feature-id>/qa_plan_confluence_review_v<N>.md`

Do not overwrite the previous live review artifact.

### Loopback Contract

Classify failures into:
- generation fix required → return to planner review/refactor loop
- Confluence-only manual fix required → present corrected text to the user
- pass → planner may complete the run
