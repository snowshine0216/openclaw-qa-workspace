# Runtime Setup — BCIN-7289

## Requested source families
jira, confluence, background-research

## Setup entries

| source_family | approved_skill | availability_validation | auth_validation | status | route_approved | blockers |
|---|---|---|---|---|---|---|
| jira | jira-cli | /Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/jira-cli/scripts/jira-run.sh me | /Users/xuyin/Documents/Repository/openclaw-qa-workspace/.agents/skills/jira-cli/scripts/jira-run.sh returned success | pass | true | — |
| confluence | confluence | confluence spaces | failed | blocked | false | Error: getaddrinfo ENOTFOUND microstrategy.atlassian.net |
| background-research | unknown | not resolved | failed | blocked | false | unknown source family |

## has_supporting_artifacts
false

## Failures

- Runtime setup for confluence must have pass status.
- Runtime setup for confluence must explicitly mark the canonical route as approved.
- No approved source rule defined for source family: background-research
