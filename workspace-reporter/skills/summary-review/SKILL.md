---
name: summary-review
description: Provide comprehensive self-review for generated QA summaries against Confluence formatting rules and requirements.
---

# Summary Review Skill

This skill is designed to thoroughly evaluate and critique drafted QA Summary pages before they are submitted to users for approval and published to Confluence. It enforces strict structural and informational requirements.

## 🎯 Review Criteria

When utilizing this skill, you must evaluate the generated markdown document against the following criteria:

### 1. Structural Integrity (The Template)
Verify that **ALL** of the following sections are present, explicitly named, and properly nested:
- `5. QA Summary` (Or equivalent heading like "QA Summary")
  - `5.1 Code Changes Summary` (Must be a table with: Repository, PR, Files Changed, Status, Notes)
  - `5.2 E2E Testing & Functionality` (Must contain: Status, Totally Logged defects, Risk Assessment, Currently Open Defects table, Limitations)
  - `5.3 Performance`
  - `5.4 Security`
  - `5.5 Platform Certifications`
  - `5.6 Upgrade and Compatibility`
  - `5.7 Internationalization`
  - `5.8 Automation`
  - `5.9 Accessibility`

### 2. Information Accuracy (Defect Analysis Sync)
- Are the defect counts ("Totally Logged defects", "Currently Open Defects") directly and accurately derived from the `defect-analysis` sub-agent's output without contradiction?
- Does the "Risk Assessment" logically align with the defect distribution? For instance, High Risk implies severe/multiple open defects.
- Is the "Currently Open Defects" section a table with the headings: `Defect ID`, `Summary`, `Status`, `Notes`?

### 3. Formatting & Linking
- Are all Jira Issues and GitHub PRs properly formatted as markdown hyperlinks?
- **MANDATORY Placeholders Policy:** Are sections with missing data properly marked with `[PENDING — <reason>]` placeholder text? Blanks are not accepted.
- Are tables correctly aligned without markdown syntax errors?

## 📝 Expected Output

Upon reviewing the document, output your critique in the following structured format:

1. **Pass/Fail Assessment**: State whether the drafted document `PASSES` or `FAILS` review.
2. **Structural Checklist**: Briefly confirm the presence of all required sections.
3. **Data Discrepancies**: Note any missing information directly requested from the defect-analysis sub-agent.
4. **Actionable Fixes**: If the review `FAILS`, provide line-by-line instructions on what needs to be fixed before the draft can be advanced to the "User Approval" phase.
5. **Fixed Draft (Optional)**: If minor fixes were required, provide the automatically corrected markdown snippet.

**Crucial Step:** Once the self-review passes (or is automatically fixed), you MUST explicitly write down (render) the concised QA summary final version directly into the chat/console so the user can read the content without having to open the file.

**IMPORTANT:** Always prioritize checking that section **5.2 E2E Testing & Functionality** accurately encompasses the risk rationale and numerical defect data.
