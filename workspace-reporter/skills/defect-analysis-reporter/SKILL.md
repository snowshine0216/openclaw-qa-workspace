---
name: defect-analysis-reporter
description: >
  Given aggregated defect data (Jira issues JSON + PR impact Markdown summaries),
  generate a comprehensive QA Risk & Defect Analysis Report in the standardized
  format defined in REPORTER_AGENT_DESIGN.md Section 6. This skill is used by
  the defect-analysis workflow (Phase 3: Synthesis) and can also be consumed by
  the Feature Summary Workflow as a sub-step output.
---

# Defect Analysis Reporter Skill

## What This Skill Does

This skill transforms aggregated defect and PR data into a standardized Markdown QA risk report. It is purely a **rendering/formatting** skill — it does not call external APIs. All data must be pre-fetched and provided as input files before invoking this skill.

---

## Inputs

The skill expects the following files to exist in the working directory before it is invoked:

| File | Description |
|---|---|
| `context/jira_raw.json` | Full list of Jira issues (including status, priority, assignee, resolution date) |
| `context/prs/<PR_ID>_impact.md` | One Markdown file per PR with Fix Risk Analysis (files changed, complexity, regression risk) |

---

## Output

The skill produces a single Markdown file placed at:
```
projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REPORT_DRAFT.md
```

---

## Report Sections (Required — in order)

Follow the exact structure below. Do not omit any section.

### 1. Report Header
```markdown
# QA Risk & Defect Analysis Report
## <FEATURE_KEY>: <Feature Summary>

**Report Date:** <YYYY-MM-DD>
**Feature:** <Feature Title>
**Total Defects Analyzed:** <N>
```

### 2. Executive Summary
- **Defect Distribution Table**: Counts and percentages (Total, Completed, In Progress, To Do, High Priority, Medium/Low).
- **Risk Rating**: HIGH / MEDIUM / LOW, followed by 2-3 sentences explaining the assessment based on defect count and functional areas.

### 3. Defect Breakdown by Status
- **✅ Completed Defects**: `| ID | Summary | Priority | Fixed Date | Fix Risk Analysis |` (or omit Fix Risk Analysis if using section 5 exclusively).
- **🔄 In Progress Defects**: `| ID | Summary | Priority | Assignee |`
- **📋 To Do Defects**: `| ID | Summary | Priority | Assignee |`
- **📊 Additional Open Defects**: `| ID | Summary | Priority | Assignee |`

### 4. Risk Analysis by Functional Area
Categorize defects into functional areas using emojis (🔴 HIGH, 🟡 MEDIUM, 🟢 LOW). Include Defect Count, Status summary, Issues (bullet points), Impact, and Testing Focus checklists.

### 5. Defect Analysis by Priority
Section highlighting High Priority vs Medium/Low Priority completion rates and calling out critical open items.

### 6. Code Change Analysis
A section that parses `context/prs/*.md` (or changelog) to populate a Fix Complexity Assessment table (`| Complexity | Count | Examples |`). If no PRs found, add a note: "**Note:** PR links were not found in the Jira issue comments."

### 7. Residual Risk Assessment
Outline the Overall Risk Level (HIGH/MEDIUM/LOW) and list detailed Risk Factors (e.g. Complex Interaction, Edge Case Sensitivity) mapped to risk scales.

### 8. Recommended QA Focus Areas
Provide checklists using `Priority: CRITICAL / HIGH / MEDIUM / LOW` blocks. Include Exploratory Testing Recommendations.

### 9. Test Environment Recommendations
Required Test Instances, Feature Flag details, and Test Data Requirements.

### 10. Verification Checklist for Release
Provide a pre-release validation checklist and document Known Limitations.

### 11. Conclusion
Describe the Risk Mitigation Strategy (Immediate, Pre-Release, Post-Release) and state the Recommended Action (DO NOT RELEASE / READY FOR RELEASE).

### 12. Appendix: Defect Reference List
Markdown table `| # | ID | Link |` linking directly to Atlassian tickets.

---

## Functional Guidelines

1. **Parse statistics first** — compute all counts and percentages before writing any section.
2. **Never leave placeholder text** in the final output — every `<X>` must be replaced with actual data.
3. **Keep Fix Risk Analysis concise** — inline, max 20 words per PR. Not a full paragraph.
4. **Functional area inference** — if an issue's summary or description mentions "pin", "freeze", "hide" → group under "Pin/Freeze/Hide". Adjust groupings based on actual defect content.
5. **Graceful handling of missing PR data** — if `context/prs/` is empty or a PR file is missing, note this in Fix Risk Analysis column rather than failing.

---

## How to Invoke This Skill

The orchestrator agent calls this skill in Phase 3 of the defect-analysis workflow:

```
Read this SKILL.md.
Input files:
  - context/jira_raw.json
  - context/prs/*.md
Output target:
  - projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REPORT_DRAFT.md
Generate the report following all sections in order.
```
