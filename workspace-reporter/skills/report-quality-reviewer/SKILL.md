---
name: report-quality-reviewer
description: Evaluates draft defect analysis reports against quality criteria and acts as a preliminary quality gate before human review.
---

# `report-quality-reviewer` Skill

## **Goal**
Act as a quality gatekeeper for defect analysis draft reports. Ensure the report meets completeness, consistency, and formatting standards before presentation for human approval. Apply the 20/80 QA principle to highlight areas of highest vulnerability.

---

## **Inputs**
Provide the reviewer with:
1. `projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REPORT_DRAFT.md` (The draft report)
2. `projects/defects-analysis/<FEATURE_KEY>/context/jira_raw.json` (Raw defects data)
3. `projects/defects-analysis/<FEATURE_KEY>/context/prs/*.md` (PR analysis metadata and diff info)
4. Previous final reports (if available) for trend comparison.

---

## **Process / Checklist**

### 1. **Section Completeness**
- Verify all required 12 sections are present, as defined in `defect-analysis-reporter` skill.
- Ensure there are **no** `[TODO]` or placeholder `<X>` values left unpopulated.

### 2. **Defect Count & Consistency**
- Verify the total number of defects explicitly mentioned in the report matches the number of defects found in `jira_raw.json`.
- Ensure no duplicate defects are counted or missing from the summary.

### 3. **20/80 Identification (Risk Focus)**
Identify the top areas representing the majority of the risk:
- Highlight the top 2-3 functional areas.
- Highlight any area containing >30% of total defects.
- Flag any area containing unresolved **High** priority defects.

### 4. **Risk Rating Coherence**
- Ensure the Overall Risk Rating is **HIGH** if there are open High-priority defects > N (where N is usually 0, meaning any open High priority defect flags a HIGH risk).
- Ensure MEDIUM/LOW risk aligns consistently with the defect distribution map shown in the report.

### 5. **PR Coverage**
- Review `context/prs/`. If there are PRs mentioned in the context, but they are lacking reflection or omitted entirely from the "Code Change Analysis" section, flag this as an omission.

### 6. **Warnings & Subjective Flags**
- Generate warnings for things such as:
  - Open High priority defects.
  - Flaky issues or issues frequently reopening.
  - Stale PRs.
  - Vague descriptions requiring human attention.

---

## **Output Requirements**

Generate a structured review summary saved as:
`projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REVIEW_SUMMARY.md`

### **Format of the Summary**

The summary must include:
1. **Pass/Warn/Fail Status**: State explicitly the outcome of the review.
2. **Focus Areas (20/80)**: Call out where the human reviewer should spend 80% of their attention.
3. **Actionable Fixes**: If objective errors (like a missing section or mismatching defect count) were encountered, explain what they were so they can be (or have been) auto-fixed.
4. **Recommendations for the Reviewer**: Outline the subjective concerns (warnings) that require human judgment.

---

## **Hybrid Auto-fix Protocol Integration**

When applying this skill in a workflow:
- **Objective Errors** (Rule 1 & Rule 2): Auto-fix the draft and regenerate up to 1-2 times before failing.
- **Subjective Warnings** (Rules 3, 4, 5, 6): DO NOT auto-fix. Emit warnings directly into `_REVIEW_SUMMARY.md` to be presented to the user during the approval phase.
