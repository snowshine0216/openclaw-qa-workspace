# Examples: Jira CLI Skill

## Update issue description from RCA markdown

```bash
bash .agents/skills/jira-cli/scripts/build-adf.sh \
  .agents/skills/jira-cli/scripts/templates/sample-rca.md \
  /tmp/BCIN-5286-description.json

bash .agents/skills/jira-cli/scripts/jira-publish-playground.sh \
  --issue BCIN-5286 \
  --description-file /tmp/BCIN-5286-description.json \
  --update-description
```

Add `--post` only when the target issue is a sandbox issue and you are ready to write.

## Resolve a mention target from email

```bash
bash .agents/skills/jira-cli/scripts/resolve-jira-user.sh lizhu@microstrategy.com | jq
```

Copy one result into a mentions file:

```json
[
  {
    "id": "5b10a2844c20165700ede21g",
    "text": "@Liz Hu",
    "displayName": "Liz Hu",
    "emailAddress": "lizhu@microstrategy.com"
  }
]
```

## Build an executive-summary comment with mentions

```bash
bash .agents/skills/jira-cli/scripts/build-comment-payload.sh \
  --text "Executive summary is ready. Please review the updated description." \
  --mentions-file .agents/skills/jira-cli/scripts/templates/mentions.sample.json \
  --output /tmp/BCIN-5286-comment.json
```

## Publish description and comment together on a sandbox issue

```bash
bash .agents/skills/jira-cli/scripts/jira-publish-playground.sh \
  --issue BCIN-5286 \
  --description-file /tmp/BCIN-5286-description.json \
  --comment-file /tmp/BCIN-5286-comment.json \
  --update-description \
  --add-comment \
  --post
```

## Partial-success path when owner resolution is missing

```bash
bash .agents/skills/jira-cli/scripts/build-comment-payload.sh \
  --text "Executive summary is ready. Owner mention is pending verification." \
  --mentions-file .agents/skills/jira-cli/scripts/templates/mentions.sample.json \
  --output /tmp/BCIN-5286-comment.json
```

Use only the fixed stakeholder mention until owner evidence is traceable.

## Find issues linked or parented to a Jira ticket

```bash
bash .agents/skills/jira-cli/scripts/search-jira.sh \
  --jql 'issue in linkedIssues("BCIN-6709") OR parent = BCIN-6709 OR "Parent Link" = BCIN-6709' \
  --plain \
  --columns key,summary,status,priority,assignee
```

Use this when you want a single query that catches standard links, subtasks, and Advanced Roadmaps parent links.

## Find this week's high-priority issues across multiple projects

```bash
bash .agents/skills/jira-cli/scripts/search-jira.sh \
  --jql 'project in (BCFR, BCEN, BCED, BCDA, BCVE, BCIN) AND priority in (High, Highest) AND created >= startOfWeek()' \
  --plain \
  --columns key,summary,priority,status,assignee
```

Adjust the project list, priority set, or date window to match the reporting scope you need.

## Inspect a single issue before building follow-up JQL

```bash
bash .agents/skills/jira-cli/scripts/jira-run.sh issue view BCIN-6709 --raw | jq '{
  key: .key,
  parent: .fields.parent.key,
  issuelinks: [.fields.issuelinks[]? | {
    type: .type.name,
    inward: .inwardIssue.key,
    outward: .outwardIssue.key
  }],
  subtasks: [.fields.subtasks[]? | {key, summary: .fields.summary}]
}'
```

Use raw issue output when you need to confirm which relationship fields are populated before writing a broader search.
