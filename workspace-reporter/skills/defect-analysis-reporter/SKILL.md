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

---

## Testing Plan Output (Single-Issue Mode)

Used by **Phase 5** of the single-defect-analysis workflow.

### Inputs

| Field | Source |
|-------|--------|
| Issue summary, description, priority, labels | `context/issue.json` |
| PR diff analysis | `context/prs/<PR_ID>_impact.md` |
| FC risk level + score | Computed in Phase -1.4 |
| Affected domains | Inferred from PR diff file paths |

### Output

Single file placed at:
```
projects/defects-analysis/<ISSUE_KEY>/<ISSUE_KEY>_TESTING_PLAN.md
```

### Required Sections (in order)

#### Section 1: Issue Header
```markdown
# Testing Plan: <ISSUE_KEY>

## Issue
**Summary:** <summary>
**Priority:** <priority> | **Status:** <status>
**Labels:** <labels (comma-separated)>
**Risk Level:** <HIGH | MEDIUM | LOW> (Score: <N>)
```

#### Section 2: Fix Summary
```markdown
## Fix Summary
<PR URL(s) if available, or "No fix PR linked.">
**Affected Domains:** <comma-separated domains>
**Fix Risk Analysis:** <≤30-word summary per PR — files changed, complexity, regression risk>
```

#### Section 3: FC Verification Steps *(required)*
```markdown
## 1. FC Verification Steps

> Mandatory smoke steps to verify the reported bug is fixed.

| Step | Action | Expected Result |
|------|--------|-----------------|
| FC-01 | <specific reproduction step from issue description> | <what proves the fix works> |
| FC-02 | <second step if multi-step repro> | <expected> |

**Pre-conditions:**
- Environment: <staging URL / feature flag if known, or "standard staging">
- Test data: <if specified in issue, or "none">
```

**Rules for FC steps:**
- Derive steps directly from issue description / repro steps.
- If repro steps are vague, generate the most likely steps based on issue summary + affected component.
- Minimum 1 step, maximum 5 steps. Each step must be independently executable.
- Expected result must be a binary observable outcome (pass / fail).

#### Section 4: Exploratory Testing *(conditional)*

> Include **only if** `risk_level` is `MEDIUM` or `HIGH`. Omit entirely for `LOW` risk.

```markdown
## 2. Exploratory Testing

### 2.1 Regression Areas

Based on the fix scope, the following adjacent areas carry regression risk:

| Area | Risk | Suggested Exploration |
|------|------|-----------------------|
| <component / domain name> | <High | Medium> | <1-sentence exploration hint> |

### 2.2 Exploratory Charter

- **Target:** <Feature area — e.g. "CalendarFilter reset behaviour on Library page">
- **Focus:** <What to look for — e.g. "UI glitches after date selection, incorrect filter counts">
- **Time-box:** <15 min for MEDIUM | 30 min for HIGH>
- **Heuristics:** CRUD, boundary values, error paths, state transitions
```

**Rules for exploratory section:**
- Regression areas must come from the PR diff domain map (`affected_domains`).
- Charter must be scoped to one specific user journey, not an entire feature.
- Time-box must be stated explicitly.

### Functional Guidelines

1. **Never fabricate repro steps.** If the issue description has no repro steps, write "Steps derived from issue summary" and explain your inference.
2. **Never leave `<placeholders>` in the final output.** Every field must be populated.
3. **FC steps must be atomic.** Each step = one user action in the browser.
4. **If no PR is linked:** omit PR URL row in Fix Summary. Add note: "No fix PR found — FC steps based on issue description only."
