---
name: qa-plan-refactor
description: Applies review findings to a unified QA-plan draft using the canonical QA-plan contract. Use after review to make deterministic rewrites and revalidate the updated draft.
---

# QA Plan Refactor

Update only the unified QA-plan draft. Do not redesign the workflow inside this step.

## Inputs

Required:
- `drafts/qa_plan_v<N>.md`
- `context/review_qa_plan_<id>.md`

The review artifact path is deterministic. Do not guess or rename it during Phase 4 handoff.

Optional cached context for clarification:
- `context/qa_plan_atlassian_<id>.md`
- `context/qa_plan_github_<id>.md`
- `context/qa_plan_github_traceability_<id>.md`
- `context/qa_plan_figma_<id>.md`

## Refactor mapping

- `ST-1` → add the missing required section in the correct position
- `ST-2` → rename or reshape the section so it maps back to the required semantic bucket
- `ST-3` → add `N/A — <reason>` under the affected section
- `ST-4` → move content under the correct section and remove the illegal section
- `CV-1` → add the missing behavior using saved evidence only
- `CV-2` → strengthen the affected case with the saved evidence that review identified
- `CV-3` → rewrite the affected case so the source is used in the correct role
- `EX-1` → rewrite the trigger so it names the exact branch or condition
- `EX-2` → rewrite the user action so it states the exact UI operation
- `EX-3` → rewrite the expected result so it states the visible success condition
- `EX-4` → replace code wording with user-facing wording
- `QL-1` → split or regroup the section so it scans cleanly
- `QL-2` → simplify repetitive or source-driven wording
- `QL-3` → align the draft with the quality bar from `docs/BCIN-6709_qa_plan.md`

## Guardrails

- Never remove a required section.
- Never invent a branch when saved evidence is missing.
- Never replace one vague sentence with another vague sentence.
- Preserve valid content that review did not flag.
- If context still does not answer a detail, keep `<!-- TODO -->` instead of making the draft softer or less honest.

## Validation

Run after every refactor pass:

```bash
validate_context.sh <feature-id> --validate-testcase-structure "drafts/qa_plan_v<N+1>.md"
validate_context.sh <feature-id> --validate-testcase-executability "drafts/qa_plan_v<N+1>.md"
```

If validation fails:
- apply one more deterministic refactor pass
- validate again
- if still failing, stop and report the remaining violations

## Output

- Write `drafts/qa_plan_v<N+1>.md`
- Preserve valid rationale comments
- Preserve saved-evidence references when they clarify why a branch exists
- Treat Phase 4 as incomplete until `drafts/qa_plan_v<N+1>.md` exists and both validators pass against that saved file
