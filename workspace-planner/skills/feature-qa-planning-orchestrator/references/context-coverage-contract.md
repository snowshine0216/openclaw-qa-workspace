# Context Coverage Contract

## Source Families

Requested source families are mandatory for the run. Unrequested source families are optional and must not be fabricated into the workflow.

## Required Normalization Outputs

Before drafting:
- raw evidence saved under `context/`
- `context_index_<feature-id>.md`
- `coverage_ledger_<feature-id>.md`
- `coverage_gaps_<feature-id>.md`

## Mandatory Coverage Candidate Rules

- No source artifact may influence the draft unless it is first represented in `context_index`.
- No context index item may disappear between normalization and drafting without appearing in `coverage_ledger` as covered, deferred, blocked, or out_of_scope.
- If a source introduces a known regression or risk, the draft must include either a regression scenario or a written out-of-scope reason.

## Silent-Drop Prohibition

Every capability family, user journey, and risk discovered during normalization must land in one of:
- `E2E`
- `Functional`
- `Error`
- `Regression`
- `Compatibility`
- `Security`
- `Performance`
- `OutOfScope`

## Example Mapping

- Context item: report creation journey
- Source artifact: `jira_issue_BCED-2416.md`
- Coverage type: `E2E`
- Planned section: `EndToEnd`
- Planned scenario: `Create report from primary entry point`
