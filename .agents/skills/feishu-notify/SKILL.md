---
name: feishu-notify
description: Send a notification to a Feishu chat by reading the target chat_id from a workspace-local TOOLS.md file. Use when Codex needs to post a status update, workflow result, or report link to a workspace's configured Feishu chat.
---

# Feishu Notify

## Overview

Use this shared skill to send a Feishu message for any supported workspace without hard-coding chat IDs into workflow code.

## Inputs

- Use exactly one of:
  - `--file <path>` to send file contents as the message body
  - `--message <text>` to send inline text
- Optional: `--workspace <path>` to point at a workspace root containing `TOOLS.md`
- If `--workspace` is omitted, the entrypoint resolves the nearest parent directory that contains `TOOLS.md`

`TOOLS.md` must contain a Feishu section shaped like:

```markdown
## Feishu
- chat_id: oc_...
```

## Behavior

1. Resolve the target workspace.
2. Read `chat_id` from `TOOLS.md`.
3. Send the message through `openclaw message send --channel feishu`.
4. If delivery fails, print a manual fallback command and exit non-zero.

## Entrypoint

Run:

```bash
.agents/skills/feishu-notify/scripts/run-feishu-notify.sh --workspace workspace-daily --file summary.md
```

Or from inside a workspace subtree:

```bash
.agents/skills/feishu-notify/scripts/run-feishu-notify.sh --message "Daily check complete"
```
