# Review Rubric

## Review Inputs

Reviewer must read:
- `context_index_<feature-id>.md`
- `coverage_ledger_<feature-id>.md`
- `coverage_gaps_<feature-id>.md`
- current draft
- prior review artifact when applicable

## Blocking Findings

Blocking findings include:
- missing mandatory coverage candidate
- merged `must_stand_alone` scenario units
- missing required EndToEnd coverage
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

- `review_qa_plan_<feature-id>.md`
- `review_rewrite_requests_<feature-id>.md`
- verdict: `accept` | `accept_with_advisories` | `reject`

`review_rewrite_requests_<feature-id>.md` must include structured rows with:

- `request_id`
- `scenario_id` or candidate ids
- `problem_type`
- `required action`
- `status`

Use `split_required` when a merged testcase must become separate scenarios before approval.

## Approval Contract

- Review cannot approve a draft that is structurally valid but not executable.
- Review cannot emit `accept` or `accept_with_advisories` when blocking findings remain unresolved in the review artifact.
- `accept_with_advisories` is allowed only when no blocking finding remains and advisories are explicitly documented.

## Unresolved Executability Handling

- Review cannot silently drop an unclear step.
- It must be rewritten, researched, or preserved with a comment and next action.
