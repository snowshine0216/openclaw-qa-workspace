---
name: rca
description: Generate a single concise 9-section RCA document for a Jira defect using prepared Jira JSON and PR diff context. Use when a workflow needs one RCA per issue, especially when the input payload already includes jira_json_path, pr_data_path, automation status, and the target output path.
---

# RCA Skill

## Purpose

Generate one RCA markdown document for one Jira issue from the orchestrator-provided payload.

## When To Use

Use this skill when:
- a parent workflow hands you one issue-specific RCA input JSON
- the task is to produce one RCA file, not to orchestrate the whole day
- the caller already decided the output path and wants the skill to fill it

## Input Contract

Read the JSON file supplied by the caller. The payload must provide:

- `issue_key`: Jira key such as `BCIN-5286`
- `issue_summary`: Jira summary line
- `jira_json_path`: full Jira JSON on disk
- `pr_data_path`: PR metadata and diff text on disk
- `automation_status`: `yes`, `no`, or `unknown`
- `pr_list`: array of PR URLs
- `rca_output_path`: markdown path to write

## Output Contract

1. Write the RCA markdown to `rca_output_path`.
2. Ensure the file exists before the task finishes.
3. Announce `RCA complete: <ISSUE_KEY>` on success.
4. Announce `RCA failed: <ISSUE_KEY>` plus one-line reason on failure.

## RCA Structure

Use this exact heading structure:

```markdown
# RCA for <ISSUE_KEY>
## 1. Incident Summary
## 2. References
## 3. Timeline (UTC)
## 4. What Happened
## 5. Five Whys
## 6. Why It Was Not Discovered Earlier
## 7. Corrective Actions
## 8. Preventive Actions
## 9. Automation Status
```

## Quality Rules

- Include all 9 sections even when some data is missing.
- Keep the RCA concise; target less than 300 words when the source material allows it.
- Section 5 must include at least 3 explicit "why" levels.
- Do not copy Jira text verbatim unless a short direct quote is necessary for fidelity.
- If data is missing after checking the provided files, write `Data unavailable` instead of guessing.

## Additional Data

If the provided files are incomplete, you may use Jira CLI and GitHub CLI to fill gaps.
Treat the provided payload as the primary source of truth and use extra lookups only to clarify missing or ambiguous details.
