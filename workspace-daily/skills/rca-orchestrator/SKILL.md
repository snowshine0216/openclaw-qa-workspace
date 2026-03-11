---
name: rca-orchestrator
description: Orchestrate the daily RCA workflow for workspace-daily by running the shell entrypoint, resuming safely by date, collecting Jira and GitHub context, spawning one RCA worker per issue, publishing results back to Jira, and sending a final Feishu summary. Use for daily RCA generation, RCA reruns by date, or any request to operate the workspace-daily RCA pipeline.
---

# RCA Orchestrator

## Purpose

Run the date-scoped RCA workflow for all issues that require an RCA in `workspace-daily`.

## Entry Point

```bash
bash workspace-daily/skills/rca-orchestrator/scripts/run.sh [YYYY-MM-DD] [refresh_mode]
```

## Refresh Modes

- `smart_refresh`: resume incomplete work for the date; stop immediately if the final summary already exists
- `full_regenerate`: archive prior outputs for the date, wipe state, then rebuild from scratch
- `fresh`: wipe state for the date without archiving, then rebuild from scratch

## Phases

1. Phase 0: classify the run state and decide stop vs resume vs reset
2. Phase 1: fetch owners API data and build `manifest.json`
3. Phase 2: fetch Jira details and GitHub PR diffs, then write `rca-input` payloads
4. Phase 3: spawn RCA workers in batches and reconcile terminal generation state for every manifest issue
5. Phase 4: publish successful RCA results to Jira
6. Phase 5: write the daily summary and send the Feishu notification

## Configuration

### Manager Tagging

Every Jira comment posted in Phase 4 tags the manager(s) defined in `config/owner-manager-mapping.json`. Default: Lingping Zhu. See [README.md](README.md) for how to change the mapping.

## Skills Used

- `.agents/skills/rca/SKILL.md`
- `.agents/skills/jira-cli/SKILL.md`
- `.agents/skills/feishu-notify/SKILL.md`

## Error Policy

- Persist phase failures to `task.json` and `run.json.last_error`.
- Continue across per-issue failures where the phase contract says terminal item status is enough.
- Treat non-generated issues as ineligible for Jira publish, even if stale RCA files exist.
- Keep notification failure non-blocking by storing the pending payload in `run.json.notification_pending`.
