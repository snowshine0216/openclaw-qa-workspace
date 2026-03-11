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

### Structural

- `ST-1` → add the missing required coverage in the clearest feature-fit section, or create a new section only when no existing section can own it cleanly
- `ST-2` → rename or reshape the section so it maps back to the required semantic bucket
- `ST-3` → make omission intent reviewable with clearer section ownership, an ownership comment, or concise rationale instead of forcing an empty placeholder section
- `ST-4` → replace weak E2E with a better top-level section when feature is error-handling-focused

### Coverage (including checkpoint-based repairs)

- `CV-1` → add the missing behavior using saved evidence only
- `CV-2` → strengthen the affected case with the saved evidence that review identified
- `CV-3` → rewrite the affected case so the source is used in the correct role
- `CV-4` → add boundary / validation / privilege / compatibility cases per checkpoint finding
- `CV-5` → add missing scenario family to existing section, or split broad section into two clearer sections
- `CV-6` → move coverage to the better-owned section
- `CV-7` → add concise placeholder coverage for low-signal but relevant domain, or explicit N/A with reasoning

### Executability

- `EX-1` → rewrite the trigger so it names the exact branch or condition
- `EX-2` → rewrite the user action so it states the exact UI operation
- `EX-3` → rewrite the expected result so it states the visible success condition
- `EX-4` → replace code wording with user-facing wording

### Quality

- `QL-1` → split or regroup the section so it scans cleanly
- `QL-2` → simplify repetitive or source-driven wording
- `QL-3` → align the draft with the quality bar from `docs/BCIN-6709_qa_plan.md`

### Checkpoint repair actions (apply section by section)

- add missing scenario family to an existing section
- split one broad section into two clearer sections
- move coverage to a better-owned section
- add boundary / validation / privilege / compatibility cases
- add concise placeholder coverage for low-signal but relevant domains
- preserve omission notes only when genuinely unsupported by evidence

## Guardrails

- Never remove required coverage without moving ownership to a clearer section.
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
