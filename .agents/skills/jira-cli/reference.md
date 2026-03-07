# Jira Publishing Reference

Use this reference when the task needs Jira REST writes that `jira-cli` alone does not model well, especially ADF description updates and comment bodies with user mentions.

## Contracts

### Description update

Required inputs:
- `issue_key`: Jira issue key like `BCIN-5286`
- `adf_path` or `adf_json`: Atlassian Document Format document

Default target field:
- `description`

Expected wire payload:

```json
{
  "fields": {
    "description": {
      "version": 1,
      "type": "doc",
      "content": []
    }
  }
}
```

Success criteria:
- Jira returns a successful `PUT /rest/api/3/issue/{issueKey}` response
- The workflow records that description publish succeeded before any follow-up comment is treated as done

### Comment with mentions

Required inputs:
- `issue_key`: Jira issue key
- `text`: final comment text without guessed users
- `mentions[]`: explicit Jira mention metadata

Mention entry shape:

```json
{
  "id": "5b10a2844c20165700ede21g",
  "text": "@Liz Hu",
  "displayName": "Liz Hu",
  "emailAddress": "lizhu@microstrategy.com"
}
```

Only `id` is required for the ADF mention node. `text`, `displayName`, and `emailAddress` are retained so the payload stays human-auditable during manual testing.

Expected wire payload:

```json
{
  "body": {
    "version": 1,
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          { "type": "mention", "attrs": { "id": "...", "text": "@Liz Hu" } },
          { "type": "text", "text": " Executive summary is ready." }
        ]
      }
    ]
  }
}
```

Success criteria:
- Jira returns a successful `POST /rest/api/3/issue/{issueKey}/comment` response
- The caller records the returned comment identifier when Jira includes one

## Playground flow

1. Build ADF from markdown with `scripts/build-adf.sh`.
2. Resolve mention candidates with `scripts/resolve-jira-user.sh`.
3. Build a comment payload with `scripts/build-comment-payload.sh`.
4. Preview or publish with `scripts/jira-publish-playground.sh`.

Prefer explicit mention metadata over guessing. If the owner identity is ambiguous, stop at preview or publish without the optional owner mention.
