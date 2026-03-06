# Jira Playground

This playground is for manual testing against a sandbox Jira issue.

## Files

- `../templates/sample-rca.md`: starter markdown for ADF conversion
- `../templates/mentions.sample.json`: starter mention metadata for comment payloads

## Quick path

```bash
bash .agents/skills/jira-cli/scripts/build-adf.sh \
  .agents/skills/jira-cli/scripts/templates/sample-rca.md \
  /tmp/jira-description.json

bash .agents/skills/jira-cli/scripts/build-comment-payload.sh \
  --text "Executive summary is ready. Please review the updated description." \
  --mentions-file .agents/skills/jira-cli/scripts/templates/mentions.sample.json \
  --output /tmp/jira-comment.json

bash .agents/skills/jira-cli/scripts/jira-publish-playground.sh \
  --issue YOUR-SANDBOX-123 \
  --description-file /tmp/jira-description.json \
  --comment-file /tmp/jira-comment.json \
  --update-description \
  --add-comment
```

The last command previews only. Add `--post` for the live write.
