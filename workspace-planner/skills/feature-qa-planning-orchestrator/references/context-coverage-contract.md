# Context Coverage Contract

## Source Families

Requested source families are mandatory for the run. Unrequested source families are optional and must not be fabricated into the workflow.

## Required Planning Outputs

Before drafting:
- raw evidence saved under `context/`
- `runtime_setup_<feature-id>.md`
- `artifact_lookup_<feature-id>.md`
- `coverage_ledger_<feature-id>.md`
- `review_notes_<feature-id>.md` after the review/refactor phase
- `review_delta_<feature-id>.md` after the review/refactor phase

## Mandatory Coverage Candidate Rules

- No source artifact may influence the draft unless it is first saved under `context/` and visible from `artifact_lookup_<feature-id>.md`.
- Only artifacts collected through approved source-family paths may influence the draft.
- No artifact row may disappear between Phase 2 and the draft/refactor phases without a deliberate explanation in review notes or review delta.
- If a source introduces a known regression or risk, the draft must include either a regression scenario or a written out-of-scope reason.
- Required splits identified during review must stay split in the resulting draft.

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

## Approved Source Collection Paths

- Jira evidence: shared `jira-cli`
- Confluence evidence: shared `confluence`
- GitHub evidence: shared `github`
- Figma evidence: browser flow or approved local snapshots

Forbidden for primary system-of-record collection:

- browser fetch for Jira, Confluence, or GitHub
- generic web fetch for Jira, Confluence, or GitHub

## Example Mapping

- Context item: report creation journey
- Source artifact: `jira_issue_BCED-2416.md`
- Coverage type: `E2E`
- Planned section: `EndToEnd`
- Planned scenario: `Create report from primary entry point`
