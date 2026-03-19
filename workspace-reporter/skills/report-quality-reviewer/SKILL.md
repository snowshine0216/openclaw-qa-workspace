---
name: report-quality-reviewer
description: Evaluates draft defect analysis reports against quality criteria and acts as a preliminary quality gate before human review.
---

# `report-quality-reviewer` Skill

## **Goal**
Act as a quality gatekeeper for defect analysis draft reports. Ensure the report meets completeness, consistency, and formatting standards before presentation for human approval. Apply the 20/80 QA principle to highlight areas of highest vulnerability.

---

## **Run Directory**

When invoked by the defects-analysis skill, all paths are relative to:

```text
<run-dir> = <skill-root>/runs/<run-key>/
```

Where `<skill-root>` = `workspace-reporter/skills/defects-analysis` and `<run-key>` is the run identifier (e.g. `BCIN-5809`, `release_26.03`, `jql_<sha1_12>`).

---

## **Invocation**

This skill is invoked by `defect-analysis` Phase 5 with `<run-dir>` as the working directory. The caller provides the run directory path; the reviewer reads and writes all artifacts relative to it.

---

## **Required References**

- `workspace-reporter/skills/defects-analysis/reference.md` — run layout (context/, drafts/, reports/, archive/, task.json, run.json) and report format

---

## **Inputs**

Provide the reviewer with:
1. `<run-dir>/<run-key>_REPORT_DRAFT.md` (The draft report)
2. `<run-dir>/context/jira_raw.json` (Raw defects data)
3. `<run-dir>/context/prs/*.md` (PR analysis metadata and diff info)
4. Previous final reports (if available) in `<run-dir>/archive/` for trend comparison.

---

## **Process / Checklist**

### 1. **Section Completeness**
- Verify all required 12 sections are present, as defined in defects-analysis reference (Section 1–12).
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
`<run-dir>/<run-key>_REVIEW_SUMMARY.md`

### **Review Result**

The summary must include a machine-parseable status line as the **first H2** in the document. Phase 5 uses this to decide whether to finalize or auto-fix. Use exactly one of:

```markdown
## Review Result: pass
```
```markdown
## Review Result: pass_with_advisories
```
```markdown
## Review Result: fail
```

- **pass**: All objective checks pass; no blocking issues.
- **pass_with_advisories**: Objective checks pass; subjective warnings present. The exit gate is satisfied by this status.
- **fail**: Objective errors (missing sections, defect count mismatch, etc.) that require auto-fix or regeneration.

### **Format of the Summary**

The summary must include:
1. **Review Result (machine-parseable)**: The `## Review Result: <status>` line as the first H2 in the document.
2. **Focus Areas (20/80)**: Call out where the human reviewer should spend 80% of their attention.
3. **Actionable Fixes**: If objective errors (like a missing section or mismatching defect count) were encountered, explain what they were so they can be (or have been) auto-fixed.
4. **Recommendations for the Reviewer**: Outline the subjective concerns (warnings) that require human judgment.

---

## **Hybrid Auto-fix Protocol Integration**

When applying this skill in a workflow:
- **Objective Errors** (Rule 1 & Rule 2): Emit `## Review Result: fail`. Auto-fix the draft and regenerate up to 1-2 times before failing.
- **Subjective Warnings** (Rules 3, 4, 5, 6): DO NOT auto-fix. Emit `## Review Result: pass_with_advisories` and include warnings in `<run-dir>/<run-key>_REVIEW_SUMMARY.md` to be presented to the user during the approval phase.
