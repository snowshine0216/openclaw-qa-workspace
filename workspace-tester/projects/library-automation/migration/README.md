# ReportEditor Migration State

This directory holds state files for the WDIO→Playwright ReportEditor migration workflow.

## task.json Schema

```json
{
  "run_key": "reportEditor-migration",
  "current_phase": "2c",
  "overall_status": "in_progress",
  "phases": {
    "2a": {
      "status": "done",
      "last_run": "2026-02-28",
      "pass": 2,
      "fail": 4,
      "notes": "createPercentToTotalForMetrics, createRankMetrics: locator/flow; 3 network"
    },
    "2b": {
      "status": "done",
      "last_run": "2026-02-28",
      "pass": 8,
      "fail": 0
    },
    "2c": {
      "status": "in_progress",
      "resume_from": "4.4"
    }
  },
  "data_fetched_at": null,
  "subtask_timestamps": {
    "2c_analyze": "2026-02-28T10:00:00Z",
    "2c_specs": "2026-02-28T10:15:00Z",
    "2c_migrate": "2026-02-28T10:30:00Z"
  }
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `run_key` | string | Fixed: `reportEditor-migration` |
| `current_phase` | string | Target phase being migrated (e.g. `2c`) |
| `overall_status` | string | `in_progress` or `completed` |
| `phases` | object | Per-phase state. Keys: `2a`–`2o`. |
| `phases.<id>.status` | string | `pending`, `in_progress`, `done` |
| `phases.<id>.last_run` | string | Date of last suite run (YYYY-MM-DD) |
| `phases.<id>.pass` | number | Pass count from last run |
| `phases.<id>.fail` | number | Fail count from last run |
| `phases.<id>.resume_from` | string | Step to resume from (e.g. `4.4`) — only when `in_progress` |
| `phases.<id>.notes` | string | Optional notes |
| `data_fetched_at` | string \| null | ISO timestamp for primary data (N/A for migration) |
| `subtask_timestamps` | object | Per-step timestamps for staleness display |

### subtask_timestamps Keys

Per phase and step: `{phase}_register`, `{phase}_analyze`, `{phase}_specs`, `{phase}_migrate`, `{phase}_pom`, `{phase}_testdata`, `{phase}_validate`, `{phase}_fixtures`, `{phase}_snapshot_mapping`.

Example: `2c_analyze`, `2c_migrate`.
