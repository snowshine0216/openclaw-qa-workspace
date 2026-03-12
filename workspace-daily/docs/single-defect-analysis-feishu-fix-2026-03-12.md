# Single Defect Analysis — Feishu Notification Fix

**Date:** 2026-03-12
**Issue Discovered During:** BCIN-7077 analysis run
**Skill:** `.agents/skills/single-defect-analysis`

---

## Problem Summary

When running `single-defect-analysis`, the Feishu notification at Phase 4 consistently failed with two separate issues:

### Issue 1 — `--chat-id` never passed to notification script

**File:** `scripts/notify_feishu.sh`

`phase4.sh` called `notify_feishu.sh` without forwarding a chat-id, so `send-feishu-notification.js` exited with:
```
Missing required --chat-id
Usage: send-feishu-notification.js --chat-id <chat-id> (--file <path> | --message <text>)
```

**Fix:** Added `CHAT_ID` as a 3rd argument to `notify_feishu.sh`. Updated `phase4.sh` to pass `${FEISHU_CHAT_ID:-}`. Updated `orchestrate.sh` to `export FEISHU_CHAT_ID`.

---

### Issue 2 — `openclaw message send` CLI subprocess fails on group chats (error 230002)

**Root cause:** The `openclaw` CLI binary spawned as a subprocess uses a different Feishu bot auth context than the gateway `message` tool (plugin). The CLI path consistently returns:
```
code: 230002 — Bot/User can NOT be out of the chat.
```
...even for chats where the gateway `message` tool sends successfully. This is likely related to the duplicate feishu plugin warning (`plugins.entries.feishu: duplicate plugin id detected`).

**Important:** `openclaw message send` exits with code 0 even on this error, so the shell script cannot detect the failure.

**Fix:** Changed the notification strategy entirely. `phase4.sh` now emits a structured marker line when `FEISHU_CHAT_ID` is set:
```
FEISHU_NOTIFY: chat_id=<id> issue=<key> risk=<level> plan=<path>
```
The agent (main session) catches this line and sends the Feishu message via the gateway `message` tool directly — bypassing the CLI subprocess entirely.

---

## Files Changed

| File | Change |
|------|--------|
| `scripts/phase1.sh` | Fixed `--format json` → `--raw` for `jira issue view` (separate bug; jira-cli doesn't support `--format`) |
| `scripts/notify_feishu.sh` | Added `CHAT_ID` as 3rd arg; forward to `send-feishu-notification.js --chat-id` |
| `scripts/phase4.sh` | Emit `FEISHU_NOTIFY:` marker when `FEISHU_CHAT_ID` set; fall back to CLI only when no chat-id |
| `scripts/orchestrate.sh` | `export FEISHU_CHAT_ID` so it flows through to all phase scripts |
| `SKILL.md` | Updated orchestrator loop instructions to document `FEISHU_NOTIFY:` handling and why CLI is unreliable |

---

## How to Invoke (Correct Usage)

```bash
cd /Users/vizcitest/Documents/Repository/openclaw-qa-workspace
source ~/.agents/skills/jira-cli/.env
FEISHU_CHAT_ID=oc_f15b73b877ad243886efaa1e99018807 \
  bash .agents/skills/single-defect-analysis/scripts/orchestrate.sh BCIN-XXXX
```

Or simply ask the agent:
> "use single-defect-analysis to analyze BCIN-XXXX"

The agent will set `FEISHU_CHAT_ID` from `TOOLS.md` automatically, run the orchestrator, and send the Feishu notification via the `message` tool when it sees the `FEISHU_NOTIFY:` marker in the output.

---

## Feishu Chat ID

The target chat-id is stored in `workspace-daily/TOOLS.md`:
```
oc_f15b73b877ad243886efaa1e99018807
```

Do **not** hardcode it in scripts. Always read from `TOOLS.md` at runtime.

---

## Related Warnings (Non-blocking)

- `plugins.entries.feishu: duplicate plugin id detected` — config warning on gateway startup. Does not break the gateway `message` tool but may be contributing to the CLI auth mismatch. Consider deduplicating the feishu plugin entry in `~/.openclaw/openclaw.json`.

---

*Documented by Atlas Daily 📋*
