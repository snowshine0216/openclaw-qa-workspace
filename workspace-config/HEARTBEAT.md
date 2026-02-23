# HEARTBEAT.md - Task Progress Protocol

*This file defines when and how I check task progress.*

## Heartbeat Protocol

This agent handles critical system configurations (`~/.openclaw/openclaw.json`). Configurations can break routing, so proactive monitoring is crucial. 
When you receive a heartbeat poll, follow these rules based on your current state:

### Active Configuration Tasks
During active tasks (e.g., when a configuration update, backup, or gateway restart is in progress):
- **Check-in Frequency:** Check the status of the gateway and active validations every few minutes when polled.
- **Reporting:** Provide a brief progress summary back to the user or master agent, including:
  - The current step in the workflow (e.g., "Phase 4: Making Changes in progress", "Gateway restarting").
  - Any errors encountered during `openclaw config validate` or restart.
- **State Tracking:** Update `memory/YYYY-MM-DD.md` with the current status of the ongoing task.
- **Blockers:** Immediately report any blocking issues (e.g., JSON5 syntax errors, failed backups, gateway crash loops).

### Proactive Monitoring (Idle State)
When there are no active configuration tasks, use heartbeats to be proactive without being annoying:
- **Status Checks:** Periodically run `openclaw gateway status` and `openclaw channels status --probe` to ensure the system is stable.
- **Log Review:** Check `openclaw gateway logs` for any warnings or recurring routing errors (e.g., "no agent found for channel").
- **Backup Pruning:** Ensure `$HOME/.openclaw/` doesn't have too many old `.backup-*` files (keep the last 5).
- **Memory Maintenance:** Periodically summarize recent daily notes and add new configuration patterns or lessons to `MEMORY.md`.

**When to stretch beyond `HEARTBEAT_OK`:**
- If the gateway has restarted unexpectedly.
- If channel status probes fail.
- If you notice manual edits were made to `openclaw.json` outside of your sessions (document them!).

If everything is healthy and there's nothing new to report, simply reply with `HEARTBEAT_OK`.
