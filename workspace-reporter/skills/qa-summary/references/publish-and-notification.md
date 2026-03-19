# QA Summary Publish And Notification

## Publish Composition Rules

- `qa_plan_final.md` remains the planner-owned base Markdown.
- The reporter draft is merged into the target page or page-body artifact as the full QA Summary portion, including the planner-sourced Section 1 table.
- When updating an existing Confluence page:
  - preserve content outside the QA Summary section
  - replace the entire QA Summary section with the latest reviewed draft
  - preserve existing Confluence content for an individual row only when the user explicitly rejects replacing a row that would otherwise downgrade to `[PENDING]`
- When creating a new Confluence page:
  - use the planner Markdown as the base document
  - append the reviewed full QA Summary section after the planner content
  - **Merge deduplication:** If the planner Markdown already contains a `## 📊 QA Summary` block, the merge logic must **replace** that block with the reporter summary (do not concatenate). Use the same replacement logic as `update_existing`: locate the `## 📊 QA Summary` heading and replace from that heading through the next `##` or end-of-document with the reporter summary content.

## Publish Rules

| Publish mode | Required input | Behavior |
|---|---|---|
| `skip` | none | finalize locally, do not call Confluence |
| `update_existing` | page URL or exact page ID from user | read page, merge summary, update page |
| `create_new` | user confirmation; optional parent link or page metadata | create a page from planner Markdown plus reporter summary |

Rules:

- Never publish without explicit user confirmation after the reviewed draft is shown.
- Existing-page updates require user-provided page identity. The workflow must not guess a target page.
- If Confluence access validation fails, stop and keep local final artifacts intact.

## Notification Contract

Preferred agent-orchestrated path:

```text
FEISHU_NOTIFY: chat_id=<id> feature=<feature-key> final=<path> page=<url-or-none>
```

Fallback path:

- `scripts/notify_feishu.sh` invokes the shared `feishu-notify` skill
- **Path resolution:** Resolve `skill-path-registrar` first using this fallback order: `SKILL_PATH_REGISTRAR_SCRIPT`, repo-local `.agents/skills/skill-path-registrar`, `$CODEX_HOME/skills/skill-path-registrar`, `~/.agents/skills/skill-path-registrar`, `~/.openclaw/skills/skill-path-registrar`. Then use the registrar to resolve `feishu-notify/scripts/send-feishu-notification.js` with the canonical shared-skill fallback order.
- on failure, persist the retry payload under `run.json.notification_pending`

## Validation Commands

- `node --test workspace-reporter/skills/qa-summary/scripts/test/`
