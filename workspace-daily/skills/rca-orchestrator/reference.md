# RCA Orchestrator Reference

## Artifact Root

All run artifacts live under:

```text
workspace-daily/skills/rca-orchestrator/scripts/runs/<YYYY-MM-DD>/
```

## State Files

- `task.json`: phase state and per-issue state
- `run.json`: timestamps, spawn metadata, Jira publish results, notification state, and last error

## Terminal Item Statuses

### Phase 2

- `fetch_ready`
- `fetch_failed`

### Phase 3

- `generated`
- `generation_failed`
- `generation_skipped_fetch_failed`

### Phase 4

- `published`
- `publish_partial_success`
- `publish_failed`
- `publish_skipped_no_rca`

## Publish Eligibility

Phase 4 may publish an issue only when `task.json.items.<issue>.status == "generated"`.
Existing RCA files do not make an issue publish-eligible on their own.

## Spawn Bridge

`scripts/lib/generate-rcas-via-agent.js` is manifest-driven and requires a runtime bridge module through `RCA_ORCHESTRATOR_SPAWN_BRIDGE` or `--bridge-module`.
This keeps the shell workflow stable while isolating the OpenClaw-specific spawn/wait surface to one adapter boundary.
