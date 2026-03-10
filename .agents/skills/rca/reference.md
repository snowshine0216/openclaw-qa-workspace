# RCA Reference

## Field Map

- `issue_key` -> document title, references, and automation section
- `issue_summary` -> incident summary and happened section
- `jira_json_path` -> timeline, comments, customer, and status history
- `pr_data_path` -> corrective actions, preventive actions, and Five Whys evidence
- `automation_status` -> automation section
- `pr_list` -> references and automation section

## Missing Data Rules

- Missing customer, comment, or timestamp details -> `Data unavailable`
- No PRs found -> say so explicitly in sections 2, 5, 7, and 9 when relevant
- Conflicting evidence -> prefer the most concrete timestamped source and note ambiguity briefly

## Tone

- Keep the writing operational and specific.
- Prefer short bullets for sections 6, 7, 8, and 9.
- Avoid blame language; focus on what happened and how to prevent recurrence.
