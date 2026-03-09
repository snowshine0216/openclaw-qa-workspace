# BCIN-6709 Atlassian Context Refresh

## Evidence Status
- Main Jira issue fetched: `BCIN-6709`
- Related issue set fetched via canonical JQL path: `issue in linkedIssues("BCIN-6709") OR parent = BCIN-6709 OR "Parent Link" = BCIN-6709`
- Jira comment-derived related evidence fetched: `BCEN-4129`
- Confluence design doc fetched: `5901516841`
- Figma search result: no Figma URL found in fetched Jira or Confluence evidence

## Raw Evidence Files
- `jira_issue_BCIN-6709.md`
- `jira_related_issues_BCIN-6709.md`
- `jira_issue_BCEN-4129.md`
- `jira_issue_BCEN-4843.md`
- `jira_issue_BCIN-6485.md`
- `jira_issue_BCIN-6574.md`
- `jira_issue_BCIN-6706.md`
- `jira_issue_BCIN-7543.md`
- `jira_issue_BCIN-974.md`
- `confluence_design_doc_BCIN-6709.md`
- `figma_link_BCIN-6709.md`

## Main Requirement Signal
`BCIN-6709` captures the user pain directly: when a report execution/manipulation error occurs during authoring in Library, the user is forced out of the report or gets stuck, and prior edits are lost. A PR link in the Jira comment points to `biweb/pull/33041`.

## Canonical Related Jira Set
The required JQL query returned six linked/parent-related issues:
- `BCIN-7543` — implementation story for improving report error handling
- `BCEN-4843` — core defect for allowing continued operations after report error
- `BCIN-6706` — parity request around failed report recovery / continued editing
- `BCIN-6574` — error details intermittently missing in Library
- `BCIN-6485` — hang / nothing works after removing an attribute used in view filter
- `BCIN-974` — loading forever after pause partial data retrieval on an unexecutable report

## Comment-Derived Jira References
Testing-relevant Jira references surfaced in comments include:
- `BCEN-4129` — cited in `BCEN-4843` comments as a similar long-standing recovery problem for MDX/report editor failures
- `BCIN-6485` — cited in `BCEN-4129` comments as another concrete manifestation of the same broken-instance / lost-progress pattern

## Confluence Design Highlights
The design page frames the solution around recovering authoring flow after execution/manipulation failures instead of ejecting the user back to Library home.

Key testing themes from the design:
- Return to pause mode with previous manipulations preserved after normal manipulation failure
- Differentiate crashed-instance recovery from non-crashed modeling-service failures
- Preserve or reset undo/redo conditionally depending on manipulation category
- Keep document view/grid state consistent after error recovery
- Handle prompt / reprompt recovery without losing prior prompt answers
- Support both pause-mode and running-mode failure paths

## Testing-Relevant Links Captured
`figma_link_BCIN-6709.md` contains the extracted web-link inventory. Most useful links are:
- GitHub PRs: `biweb/pull/33041`, `mojojs/pull/8873`, `productstrings/pull/15008`, `productstrings/pull/15012`, `web-dossier/pull/22468`, `server/pull/10905`
- Similar / historical Jira issues: `BCEN-4129`, `BCEN-4843`, `BCIN-6485`, `BCIN-6574`, `BCIN-6706`, `BCIN-6709`, `BCIN-7543`, `BCIN-974`
- Confluence design anchors for specific issues and recovery branches under page `5901516841`
- Repro/API examples from the design doc (`/manipulations`, `/rePrompt`, `/promptsAnswers`, `/api/model/reports/...`)

## Notes
- `BCIN-7543` exposes nine subtasks (`BCIN-7582` through `BCIN-7590`) inside the issue body, but they did not come from the required related-issue JQL query path and were not separately fetched in this refresh.
- The fetched evidence is sufficient for Atlassian context gathering requested here because all mandatory Jira and Confluence artifacts were retrieved successfully.
