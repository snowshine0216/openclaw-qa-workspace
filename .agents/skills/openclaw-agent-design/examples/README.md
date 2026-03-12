# OpenClaw Agent Design — Example Scripts

Copy-ready scripts for common patterns. No dependency on qa-plan-orchestrator or rca-orchestrator.

## Env Check (Phase 0)

When Phase 0 uses jira-cli, github, or confluence:

- **check_runtime_env.sh** — thin wrapper
- **check_runtime_env.mjs** — standalone env validation (jira, confluence, github)

```bash
bash scripts/check_runtime_env.sh <run-key> <jira,confluence,github> [output-dir]
```

Output: `runtime_setup_<run-key>.json`, `runtime_setup_<run-key>.md` in output-dir (default: `./runs/<run-key>/context/`).

## Spawn Bridge (Script-Driven Orchestrator)

When the orchestrator is a script (not an agent with sessions_spawn):

- **spawn_from_manifest.mjs** — generic: reads `phaseN_spawn_manifest.json`, runs `openclaw sessions spawn` per request
- **openclaw-spawn-bridge.template.js** — domain-specific: implements `spawnBatch(requests, context)`. Copy and customize task extraction. Uses `openclaw agent` (--agent reporter). Invoke only from TUI (orchestrator workflow), not from CLI directly.

## Feishu Notification (Finalize Phase)

- **emit_feishu_notify_marker.template.sh** — (preferred for agent-orchestrated) emit `FEISHU_NOTIFY:` marker when `FEISHU_CHAT_ID` set; agent reads `chat_id` from `TOOLS.md`, catches marker, sends via gateway `message` tool. Do not use CLI subprocess (unreliable for group chats). Reference: single-defect-analysis phase4.sh.
- **send_feishu_with_retry.template.sh** — (non-agent contexts) sends summary via feishu-notify CLI; on failure stores `notification_pending` in run.json for retry. Reference: rca-orchestrator phase5_finalize.sh lines 69–77.

## Test Stub Coverage

| Script Path | Test Stub Path | Scenarios (stub) |
|-------------|----------------|------------------|
| check_runtime_env.mjs | test/check_runtime_env.test.mjs | success; blocked-source; missing-args |
| check_runtime_env.sh | (covered by .mjs test) | — |
| spawn_from_manifest.mjs | test/spawn_from_manifest.test.mjs | success; manifest-not-found; spawn-failure |
| openclaw-spawn-bridge.template.js | test/openclaw-spawn-bridge.test.js | spawnBatch-success; spawnBatch-partial-failure |
| emit_feishu_notify_marker.template.sh | test/emit_feishu_notify_marker.test.sh | emits-marker-when-chat-id-set; no-emit-when-chat-id-unset |
| send_feishu_with_retry.template.sh | test/send_feishu_with_retry.test.sh | success; feishu-failure-sets-pending |
