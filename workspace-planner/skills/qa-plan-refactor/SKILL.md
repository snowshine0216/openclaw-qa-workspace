---
name: qa-plan-refactor
description: Applies consolidated review findings to the XMind testcase draft using the canonical testcase contract. Use in Phase 7 after a consolidated review artifact is available.
---

# QA Plan Refactor

Update only the XMind testcase draft. Do not generate QA plan narrative.

## Inputs

Required:
- `drafts/test_key_points_xmind_v<N>.md`
- `context/review_consolidated_<id>.md`

Optional cached context for clarification:
- `context/qa_plan_github_traceability_<id>.md`
- `context/jira_issue_<id>.md`
- any artifact already listed in `## 📎 Artifacts Used`

## Refactor mapping

- `ST-1` → add the missing canonical heading in the correct position
- `ST-2` → rename the fixed heading back to the canonical name
- `ST-3` → add `N/A — <reason>` under the affected fixed heading
- `ST-4` → move content under the correct canonical heading and remove the illegal top-level heading
- `EX-1` → rewrite the testcase trigger so it names the exact branch or condition
- `EX-2` → rewrite the user action so it states the exact UI operation
- `EX-3` → rewrite the expected result so it states the visible success condition
- `EX-4` → replace code wording with user-facing wording or move the case to `AUTO`
- `EX-5` → split the testcase by surface
- `EX-6` → move the testcase to `## AUTO: Automation-Only Tests`

## Guardrails

- Never delete a fixed heading.
- Never add a new custom top-level heading.
- Never resolve ambiguity with generic wording.
- If context still does not answer a detail, keep `<!-- TODO -->` instead of inventing a vague case.

## Validation

Run after every refactor pass:

```bash
validate_context.sh <feature-id> --validate-testcase-structure "drafts/test_key_points_xmind_v<N+1>.md"
validate_context.sh <feature-id> --validate-testcase-executability "drafts/test_key_points_xmind_v<N+1>.md"
```

If validation fails:
- apply one more deterministic refactor pass
- validate again
- if still failing, stop and report the remaining violations

## Output

- Write `drafts/test_key_points_xmind_v<N+1>.md`
- Preserve `## 📎 Artifacts Used`
- Preserve existing valid content that was not flagged by review
