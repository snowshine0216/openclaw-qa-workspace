# Robust Agent Design Reference

This document provides technical mapping and references for implementing the `robust-agent-design` skill in agent workflows.

## 1. Progress State Reference
- **Recommended File**: `task.json` (or `workflow_state.json`)
- **Location**: Store relative to the agent's working directory or project root.
- **Fields Expected**:
  - `status`: "running", "paused", "completed"
  - `phase`: Current logical step (e.g., "Jira Extraction")
  - `total_items`: Number of items to process
  - `processed_items`: Number of items handled
  - `started_at`: ISO timestamp of start
  - `last_updated_at`: ISO timestamp of last heartbeat
  - `errors`: Array of encountered errors

## 2. Checkpointing Artifacts structure
- Root: `projects/<domain_name>/context/`
- Pattern:
  - Raw Dumps: `/raw/jira_payload.json`, `/raw/github_pr_diff.diff`
  - Parsed Items: `/issues/<issue_key>.json`, `/prs/<pr_number>_summary.md`
- Logic: Check if artifact exists before invoking the API.

## 3. Worker / Concurrency Mapping
- Sub-agents: Should be spawned via background processes or managed thread pools.
- Parallel Limit: Recommended `MAX_CONCURRENT=5` to avoid API ratelimits.
- Paginated Fetch: When querying APIs like Jira JQL or GitHub Search, always use `limit` and `offset`/`page` tokens.

## 4. Human Approval Interface
- Output the drafted document path (e.g., `REPORT_DRAFT.md`).
- Prompt User: `"Please review the draft at <path>. Reply with 'approve' to proceed with Confluence publishing, or provide feedback."`
- Halt execution thread until explicit user confirmation is received.
