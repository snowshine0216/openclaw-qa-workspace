# ReportEditor Migration State

This directory holds state files for the WDIO→Playwright ReportEditor migration workflow.

## Before Running Tests

Ensure env is configured:

```bash
./migration/ensure_env.sh   # Creates tests/config/.env.report from example if missing
```

Then set `reportTestUrl`, `reportTestUser`, `reportTestPassword` in `tests/config/.env.report` to a valid MicroStrategy Library instance.

## script_families.json Schema

Please refer to `script_families.json` in this directory which now serves as the single source of truth for phase state tracking and paths. All states previously stored in `task.json` have been merged into the `progress` fields.
