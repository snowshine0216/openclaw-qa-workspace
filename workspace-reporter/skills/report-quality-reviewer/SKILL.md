---
name: report-quality-reviewer
description: Evaluates draft defect analysis reports against quality criteria and acts as a preliminary quality gate before human review.
---

# `report-quality-reviewer` Skill

## **Goal**
Act as the Phase 5 quality gate for `defects-analysis` draft reports. The reviewer must reject structurally complete but shallow output, distinguish feature reports from release reports, and only allow deterministic formatting auto-fixes. Missing analytical content is a hard fail.

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
1. `<run-dir>/<run-key>_REPORT_DRAFT.md`
2. `<run-dir>/task.json` and/or `<run-dir>/context/route_decision.json` to determine feature vs release mode
3. For feature or JQL runs:
   - `<run-dir>/context/feature_metadata.json` when present
   - `<run-dir>/context/defect_index.json` or `<run-dir>/context/jira_raw.json`
   - `<run-dir>/context/pr_impact_summary.json`
4. For release runs:
   - `<run-dir>/context/release_summary_inputs.json` when present
   - `<run-dir>/features/<feature-key>/` packet directories

---

## **Process / Checklist**

### 1. **Section Completeness**
- Verify all required 12 sections are present, as defined in defects-analysis reference (Section 1–12).
- Ensure there are **no** `[TODO]` or placeholder `<X>` values left unpopulated.

### 2. **Generic Filler Rejection**
- Fail the report if core sections still contain generic boilerplate or placeholder text.
- Fail feature reports whose Code Change Analysis only points readers to `context/prs/` without synthesized conclusions.

### 3. **Feature Report Enforcement**
- If `feature_metadata.json` provides a `feature_title`, require an explicit feature-title callout in the draft.
- If defects exist, require populated functional-area analysis rather than an empty heading/table shell.
- If open high-priority defects exist, require an explicit blocking-defect callout or named defect references.
- If PRs exist, require repo-aware synthesis when `pr_impact_summary.json.repos_changed` is populated.

### 4. **Release Report Enforcement**
- Fail the report if the release run has no `features/` packet directories.
- Fail the report if it references only a generic `features/` location without per-feature packet references.
- When `release_summary_inputs.json` lists features, require packet references for each listed feature.

### 5. **Focus Areas**
- Generate concise human-review focus areas for the highest-risk issue or release packet problems that remain after objective validation.

### 6. **Auto-fix Boundary**
- Auto-fix is allowed only for deterministic formatting repairs.
- Missing analytical content, missing packet evidence, or missing synthesis are not auto-fixable by the reviewer and must remain `fail`.

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
- **pass_with_advisories**: Reserved for future use if objective checks pass and only subjective warnings remain. The exit gate is satisfied by this status.
- **fail**: Objective errors that require deterministic auto-fix or regeneration.

### **Format of the Summary**

The summary must include:
1. **Review Result (machine-parseable)**: The `## Review Result: <status>` line as the first H2 in the document.
2. **Focus Areas (20/80)**: Call out where the human reviewer should spend 80% of their attention.
3. **Actionable Fixes**: If objective errors (like a missing section or mismatching defect count) were encountered, explain what they were so they can be (or have been) auto-fixed.
4. **Recommendations for the Reviewer**: Outline the subjective concerns (warnings) that require human judgment.

---

## **Hybrid Auto-fix Protocol Integration**

When applying this skill in a workflow:
- **Objective Errors** (missing sections, generic filler, missing feature title callout, empty functional-area analysis, missing blocking-defect callout, missing PR synthesis, missing release packet evidence): Emit `## Review Result: fail`.
- **Deterministic formatting repairs only**: Allow the caller to retry with auto-fix for formatting normalization.
- **Missing analytical content**: DO NOT auto-fix. Leave the run in `fail` so the report is regenerated with real analysis.
