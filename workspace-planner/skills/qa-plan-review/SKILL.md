---
name: qa-plan-review
description: Reviews unified QA-plan drafts against the canonical QA-plan contract. Use after the draft is written to validate coverage, simplicity, structure, wording, and executability before refactor.
---

# QA Plan Review

Use this skill in `mode=review`.

## Invocation contract

Input arrives through `context.json`.

```json
{
  "mode": "review",
  "feature_id": "BCIN-6709",
  "draft": "drafts/qa_plan_v1.md",
  "review_output": "context/review_qa_plan_BCIN-6709.md"
}
```

If `review_output` is omitted, default to `context/review_qa_plan_<feature-id>.md`.

Resolve scripts from `projects/feature-plan/scripts/` and persist the completed review with:

```bash
"$SCRIPTS/save_context.sh" "$FEATURE_ID" "review_qa_plan_$FEATURE_ID" "<review-file-or-inline-content>"
```

Do not hand off Phase 3 until the review artifact exists at the deterministic path above.

## Shared review contract

Always review against:
- `references/canonical-testcase-contract.md`
- `templates/qa-plan-template.md`
- relevant cached `context/` artifacts

Always run:

```bash
validate_context.sh <feature-id> --validate-testcase-structure "<file>"
validate_context.sh <feature-id> --validate-testcase-executability "<file>"
```

## Finding taxonomy

### Structural findings

- `ST-1` required section missing
- `ST-2` section no longer maps cleanly to the required semantic bucket
- `ST-3` non-applicable section removed instead of marked `N/A`
- `ST-4` illegal custom top-level section

### Coverage findings

- `CV-1` required behavior missing from the draft
- `CV-2` available saved evidence not reflected where it should strengthen coverage
- `CV-3` source family used in the wrong role and distorts the draft

### Executability findings

- `EX-1` vague trigger
- `EX-2` vague user action
- `EX-3` vague expected result
- `EX-4` code or implementation wording appears in a manual testcase

### Quality findings

- `QL-1` section is over-compressed and hard to scan
- `QL-2` wording is repetitive or source-driven instead of user-facing
- `QL-3` plan shape diverges from the acceptance quality bar of `docs/BCIN-6709_qa_plan.md`

## Review duties

- Confirm the draft preserves the required section set.
- Confirm the draft is readable, grouped, and concise.
- Confirm Confluence drives the main behavior.
- Confirm Jira supplies repro fixtures where available.
- Confirm GitHub strengthens edge cases and boundaries without leaking code terms into manual steps.
- Confirm Figma tightens copy and visible-state expectations without inventing unsupported branches.
- Confirm all reused evidence was saved.

## Required review output format

Every review artifact must use this structure:

```md
## Status
Pass | Pass with Findings | Fail

## Structural Findings
- ST-1 ...

## Coverage Findings
- CV-1 ...

## Executability Findings
- EX-1 ...

## Quality Findings
- QL-1 ...

## Evidence Gaps
- Missing or unresolved evidence

## Required Refactors
- Deterministic rewrite actions

## Pass/Fail Summary
- Short disposition
```

## Approval rule

Do not approve a review artifact if:
- any required section is missing
- a required section was effectively replaced
- the draft requires the tester to guess trigger, action, or visible result
- the draft materially fails the acceptance quality bar

## Output artifact contract

- Save exactly one Phase 3 review artifact to `context/review_qa_plan_<feature-id>.md`.
- Always save the artifact, even when the disposition is `Fail`.
- Return the saved artifact path in the completion message so `qa-plan-refactor` can consume it without re-inferring filenames.
