# RCA Cron: `agentTurn` vs `systemEvent` — Findings

> **Date:** 2026-03-12
> **Context:** Based on `RCA_DAILY_SKILL_REFACTOR_DESIGN.md`
> **Question:** Can the cron job invoke an agent and tell it to run the command itself, instead of triggering the script directly? Does it fix the issues?

---

## Current Design

The design specifies the entry point as a shell script:

> "OpenClaw scheduling invokes `scripts/run.sh`; no live human prompt is part of normal execution."

This implies a `systemEvent` payload injected into the **main session**, which then invokes the script. This requires the main session to be alive and responsive at cron fire time.

---

## Proposed Alternative: `agentTurn` in an Isolated Session

Configure the cron job using `sessionTarget: "isolated"` and `payload.kind: "agentTurn"`:

```json
{
  "name": "rca-daily",
  "schedule": {
    "kind": "cron",
    "expr": "0 9 * * 1-5",
    "tz": "Asia/Shanghai"
  },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "You are the RCA orchestrator. Read workspace-daily/skills/rca-orchestrator/SKILL.md then run:\n\nbash workspace-daily/skills/rca-orchestrator/scripts/run.sh $(TZ=Asia/Shanghai date +%Y-%m-%d) smart_refresh\n\nIf the script fails, send a Feishu alert to the chat in TOOLS.md with the error. Announce completion with the daily summary count."
  },
  "delivery": { "mode": "announce" }
}
```

The agent wakes up in isolation, reads the skill, runs the shell script, and announces results — fully independent of the main session.

---

## Comparison: Does It Fix the Issues?

| Problem | `systemEvent` (current implied) | `agentTurn` (proposed) |
|---|---|---|
| Main session must be alive at cron time | ✅ Required | ❌ Not needed — isolated session |
| Script failure = silent unless main session handles it | ✅ Risk | ❌ Agent can catch, log, and notify |
| Feishu fallback if Phase 5 fails | Must be handled entirely inside Phase 5 script | Agent can send Feishu directly as fallback |
| Run date must be pre-computed or hardcoded | ✅ Either | Agent computes `TZ=Asia/Shanghai date +%Y-%m-%d` at runtime |
| Error state visibility | Only via `run.json.last_error` / Phase 5 | Agent can summarize and announce to channel |
| Scheduling reliability | Depends on main session health | Fully autonomous — no session dependency |

**Short answer: Yes, `agentTurn` fixes the main-session dependency problem** and adds intelligent fallback error handling without changing the underlying shell scripts.

---

## Execution Tree

Phase 3 already spawns sub-agents internally. Using `agentTurn` at the top level produces a clean nested tree:

```
Cron (agentTurn) → isolated agent session
  └── reads SKILL.md
  └── exec: run.sh [date] smart_refresh
        ├── phase0_check_resume.sh
        ├── phase1_fetch_owners.sh
        ├── phase2_fetch_issues.sh
        ├── phase3_generate_rcas.sh
        │     └── sessions_spawn (sub-agents, batches of 5)
        ├── phase4_publish_to_jira.sh
        └── phase5_finalize.sh
```

Nested spawning works fine. The top-level isolated agent simply waits for `run.sh` to complete, then announces results.

---

## Design Doc Alignment

The design doc is already structured to support this approach:

- Section §0 states the workflow is "fully autonomous" — `agentTurn` fulfils this more completely than `systemEvent`.
- Phase 5's `notification_pending` fallback in `run.json` was added precisely because Feishu can fail inside the script. With `agentTurn`, the agent layer provides a second notification path without modifying the scripts.
- The `rca-orchestrator/SKILL.md` already defines invocation as `bash scripts/run.sh [date] [refresh_mode]` — the agent just reads and follows it.

**No changes to the shell scripts are required.** Only the cron payload configuration changes.

---

## Recommendation

Use `agentTurn` with `sessionTarget: "isolated"`. It is the correct invocation pattern for this workflow because:

1. **Main session independence** — runs even if the main session is idle or restarted.
2. **Built-in error fallback** — agent can catch failures and send Feishu alerts the script cannot.
3. **SKILL.md-driven** — agent reads and follows `rca-orchestrator/SKILL.md`, keeping orchestration logic in one place.
4. **No script changes needed** — the shell scripts remain identical; only the cron job configuration changes.
5. **Consistent with OpenClaw patterns** — `agentTurn` + `isolated` is the standard pattern for autonomous scheduled agent tasks.

---

## Implementation Note

When registering the cron job via the `cron` tool:

```json
{
  "name": "rca-daily",
  "schedule": { "kind": "cron", "expr": "0 9 * * 1-5", "tz": "Asia/Shanghai" },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "You are the RCA orchestrator. Read workspace-daily/skills/rca-orchestrator/SKILL.md then run:\n\nbash workspace-daily/skills/rca-orchestrator/scripts/run.sh $(TZ=Asia/Shanghai date +%Y-%m-%d) smart_refresh\n\nIf the script fails, send a Feishu alert to the chat_id in workspace-daily/TOOLS.md with the error summary. Announce completion with the total issues processed and published counts."
  },
  "delivery": { "mode": "announce" }
}
```

> **Note:** `$(TZ=Asia/Shanghai date +%Y-%m-%d)` in the message text will be evaluated by the agent's shell when it runs the command — not at cron registration time. This ensures the correct date is always used.

---

*Generated: 2026-03-12 | Source: RCA_DAILY_SKILL_REFACTOR_DESIGN.md analysis*
