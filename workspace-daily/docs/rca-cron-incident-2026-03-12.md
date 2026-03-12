# RCA Cron Job — Incident Report & Fix Log

**Date:** 2026-03-12  
**Author:** Atlas Daily (QA Daily Check Agent)  
**Status:** Partially fixed; one improvement still pending

---

## 1. Problems Encountered

### P1 — Wrong CLI command: `sessions spawn` does not exist
- **Symptom:** All 3 RCA workers failed with `error: unknown command 'session'`
- **Root cause:** `openclaw-spawn-bridge.js` called `openclaw sessions spawn --runtime subagent`, but `sessions spawn` is not a valid CLI subcommand in OpenClaw 2026.3.x
- **Impact:** 0/3 RCAs generated, cron job reported partial failure

### P2 — `--runtime` is an unknown option
- **Symptom:** After fixing `sessions` → `sessions spawn`, workers failed with `error: unknown option '--runtime'`
- **Root cause:** The `openclaw sessions spawn` CLI never existed; `--runtime` is a `sessions_spawn` **tool** parameter, not a CLI flag
- **Impact:** Same as P1 — all workers skipped

### P3 — Session file lock contention
- **Symptom:** `openclaw agent --agent daily` timed out with `session file locked (timeout 10000ms): pid=... /agents/daily/sessions/dbebd0ef-...`
- **Root cause:** `openclaw agent --agent daily` targets the daily agent's **main session file**, which is already held by the active chat session. Each RCA worker spawn blocked waiting for the lock for up to 6 minutes
- **Impact:** Cron job timed out after the full 30-minute limit (1800s), no RCAs generated

### P4 — Feishu delivery config missing on cron job
- **Symptom:** Cron job `status: "error"` with `Delivering to Feishu requires target <chatId|...>`
- **Root cause:** The cron job's `delivery` field had no `channel` or `to` set
- **Impact:** Even when the agent run completed, the Feishu notification was not delivered and the job was marked as error

### P5 — `task.json` generation status not updated by spawn-bridge
- **Symptom:** Phase 4 (publish to Jira) reported `skipped_no_rca` for all 3 issues even though RCA files existed on disk
- **Root cause:** When RCA workers failed (P1–P3), `task.json` was never updated to `status: "generated"`. Phase 4 checks this status field and skips issues that aren't marked `generated`
- **Impact:** RCAs written manually were not published to Jira until `task.json` was patched manually

### P6 — Feishu send in phase5 uses CLI which fails with error 230002
- **Symptom:** `phase5_finalize.sh` → `send-feishu-notification.js` → `openclaw message send --channel feishu` fails with Feishu error `230002: Bot/User can NOT be out of the chat`
- **Root cause:** The CLI-based Feishu send uses a different API path than the gateway `message` tool. The bot account used by the CLI is not a member of the target group chat
- **Impact:** Phase 5 completes but Feishu notification is always sent via fallback manual path; the cron delivery (which works) is the actual send path

---

## 2. Fixes Applied (2026-03-12)

### Fix 1 — CLI command corrected
- **File:** `skills/rca-orchestrator/scripts/lib/openclaw-spawn-bridge.js`
- **Change:** Replaced `openclaw sessions spawn --runtime subagent --mode run --label ... --wait --task ...` with `openclaw agent --agent daily --session-id <unique> --message <task> --timeout 360 --json`

### Fix 2 — Agent changed to avoid session lock
- **File:** `skills/rca-orchestrator/scripts/lib/openclaw-spawn-bridge.js`
- **Change:** Changed `--agent daily` → `--agent reporter` to use a separate agent whose session file is never held by active chat sessions
- **Status:** ✅ Works — validated with a test turn

### Fix 3 — Feishu delivery config added to cron job
- **Method:** `cron update` on job `4fa432f0-29ef-4def-af41-e32f4d95f2f4`
- **Change:** Added `delivery: { mode: "announce", channel: "feishu", to: "oc_f15b73b877ad243886efaa1e99018807" }`
- **Status:** ✅ Applied

### Fix 4 — Today's run completed manually
- **Actions:**
  1. Generated all 3 RCA files manually (BCED-4338, BCED-4644, BCIN-7540)
  2. Patched `task.json` to set all issues to `status: "generated"`
  3. Re-ran `phase4_publish_to_jira.sh` — all 3 published to Jira ✅
  4. Sent Feishu summary directly via gateway `message` tool ✅

---

## 3. Suggested Further Improvements

### S1 — Use `claude-cli` backend to eliminate session lock entirely (Recommended)
- **Problem it solves:** P3 (session lock), and also removes Gateway dependency for worker spawns
- **How:** Change spawn-bridge to use `openclaw agent --agent daily --model claude-cli/opus-4.6 --message <task>`
- **Why it's better than current fix:**
  - `claude-cli` backend runs Claude Code CLI **locally** — no session file written, no Gateway lock possible
  - Daily agent's system prompt + workspace context is preserved
  - Workers can be **parallelized** (no session contention) — could reduce 3-issue run from ~18 min to ~6 min
  - Falls back cleanly if Claude Code CLI is unavailable
- **Reference:** https://docs.openclaw.ai/gateway/cli-backends
- **File to change:** `skills/rca-orchestrator/scripts/lib/openclaw-spawn-bridge.js`
  ```js
  const args = [
    'agent',
    '--agent', 'daily',
    '--model', 'claude-cli/opus-4.6',
    '--message', task,
    '--timeout', '360',
    '--json',
  ];
  ```

### S2 — Fix Feishu notify script to use gateway message tool path
- **Problem it solves:** P6 (Feishu CLI send fails with 230002)
- **How:** Update `send-feishu-notification.js` to call the gateway WebSocket RPC (`message.send`) instead of shelling out to `openclaw message send` CLI
- **Alternatively:** Accept that phase5 Feishu send will always fail gracefully, and rely solely on the cron job's `delivery` config (Fix 3) for Feishu notification — this is already working
- **File:** `.agents/skills/feishu-notify/scripts/send-feishu-notification.js`

### S3 — Increase cron job `timeoutSeconds` as a safety buffer
- **Problem it solves:** Even with S1, if workers are slow, 1800s (30 min) for 3+ issues is tight
- **How:** Update cron job payload to `timeoutSeconds: 3600` (1 hour)
- **When needed:** Only if issue count grows beyond ~5 per day

### S4 — Add parallel execution to spawn-bridge
- **Problem it solves:** Sequential spawning means N issues × ~6 min = long total runtime
- **How:** Replace the sequential `for` loop in `spawnBatch` with `Promise.all()` after switching to `claude-cli` backend (S1), since there's no session lock to worry about
- **File:** `skills/rca-orchestrator/scripts/lib/openclaw-spawn-bridge.js`

---

## Summary Table

| # | Problem | Status | Fix |
|---|---------|--------|-----|
| P1 | `sessions spawn` command doesn't exist | ✅ Fixed | Changed to `openclaw agent` |
| P2 | `--runtime` unknown option | ✅ Fixed | Removed, used `agent` flags |
| P3 | Session file lock contention | ✅ Fixed (partial) | Changed to `--agent reporter` |
| P4 | Feishu delivery config missing on cron | ✅ Fixed | Added delivery config via cron update |
| P5 | `task.json` not updated → Jira publish skipped | ✅ Fixed today | Patched manually; will be fixed by P1/P2/P3 fixes |
| P6 | Feishu CLI send fails 230002 | ⚠️ Workaround | Cron delivery config handles it; CLI path still broken |
| S1 | Use `claude-cli` backend for zero lock risk | 📋 Pending | See suggested fix above |
| S2 | Fix Feishu notify script | 📋 Optional | See suggested fix above |
| S3 | Increase cron timeout | 📋 Optional | Only needed if issue count grows |
| S4 | Parallelize spawn-bridge | 📋 Future | Depends on S1 |
