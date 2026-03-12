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

- **send_feishu_with_retry.template.sh** — sends summary via feishu-notify; on failure stores `notification_pending` in run.json for retry

Copy into your skill, adapt `load_feishu_chat_id`, `set_run_field`, and paths. Reference: rca-orchestrator phase5_finalize.sh lines 69–77.

## Test Stub Coverage

| Script Path | Test Stub Path | Scenarios (stub) |
|-------------|----------------|------------------|
| check_runtime_env.mjs | test/check_runtime_env.test.mjs | success; blocked-source; missing-args |
| check_runtime_env.sh | (covered by .mjs test) | — |
| spawn_from_manifest.mjs | test/spawn_from_manifest.test.mjs | success; manifest-not-found; spawn-failure |
| openclaw-spawn-bridge.template.js | test/openclaw-spawn-bridge.test.js | spawnBatch-success; spawnBatch-partial-failure |
| send_feishu_with_retry.template.sh | test/send_feishu_with_retry.test.sh | success; feishu-failure-sets-pending |
