# Review Rubric

## Review Inputs

Reviewer must read:
- `artifact_lookup_<feature-id>.md`
- `coverage_ledger_<feature-id>.md`
- current draft (`qa_plan_v1.md` for the combined review/refactor phase)
- prior review artifact when applicable

## Blocking Findings

Blocking findings include:
- missing required coverage flow
- merged scenarios that should stay split
- missing required end-to-end journey coverage
- non-executable wording
- implementation-heavy manual wording
- unresolved blocking issue from the prior reviewed draft

## Non-Blocking Findings

Advisories include:
- readability improvements
- deduplication opportunities
- non-essential priority tuning

## Scoring Rules

Dimensions:
- context completeness
- coverage translation
- e2e completeness
- executability
- evidence usage
- readability
- unresolved-gap handling

Score scale:
- `0 = missing`
- `1 = weak`
- `2 = acceptable`
- `3 = strong`

## Required Review Outputs

- `review_notes_<feature-id>.md`
- `review_delta_<feature-id>.md`
- refactored draft output (`qa_plan_v2.md`)

## Approval Contract

- Review cannot approve a draft that is structurally valid but not executable.
- Review cannot emit `accept` or `accept_with_advisories` when blocking findings remain unresolved in the review artifact.
- `accept_with_advisories` is allowed only when no blocking finding remains and advisories are explicitly documented.

## Unresolved Executability Handling

- Review cannot silently drop an unclear step.
- It must be rewritten, researched, or preserved with a comment and next action.
