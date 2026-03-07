---
name: spawn-agent-session
description: Normalize reusable OpenClaw agent/session spawn requests for CLI and TUI callers. Use when Codex needs one canonical way to turn a task plus runtime settings into structured spawn payloads, label/session correlation metadata, or manifest-driven multi-request handoff data.
---

# Spawn Agent Session

Normalize spawn inputs before any workflow calls session-spawning tools directly.

## Quick Start

1. Prepare either a canonical single-request JSON object or a legacy RCA manifest JSON file.
2. Run `node .agents/skills/spawn-agent-session/scripts/normalize-spawn-request.js <input-file> ...flags`.
3. Pass `requests[].openclaw.args` directly to OpenClaw `sessions_spawn(...)`; it preserves the normalized `attachments` and `thread` values alongside the required spawn fields.

## Use This Skill

Use this skill when a workflow needs reusable spawning behavior instead of embedding one-off session-wrapper logic in local scripts.

Typical triggers:
- A shared or workspace-local workflow needs to spawn one agent session from a structured task payload.
- A caller needs stable label-to-session correlation metadata before or after spawning.
- A legacy manifest must be converted into a normalized multi-request payload without carrying over workflow-specific business logic.
- CLI and TUI callers need the same request shape and result handoff contract.

## Input Modes

### Canonical single request

Provide a JSON object with:
- `agent_id`
- `mode`
- `runtime`
- `task`
- optional `attachments`
- optional `label`
- optional `thread`

### Legacy RCA manifest compatibility

Provide the legacy manifest JSON plus CLI flags:
- `--agent-id`
- `--mode`
- `--runtime`
- `--task-template`
- optional `--label-template`
- optional `--thread`

The helper expands one normalized request per `rca_inputs[]` entry and uses the manifest only as input data. It does not perform RCA generation, Jira updates, or orchestration.

## Output Contract

The helper emits machine-readable JSON with:
- `version`
- `source_kind`
- `count`
- `requests[]`

Each normalized request contains:
- `request` — the normalized spawn payload
- `openclaw.tool` / `openclaw.args` — ready-to-call OpenClaw `sessions_spawn(...)` payload
- `handoff.label` — stable caller-facing label
- `handoff.session_key_hint` — deterministic correlation key for callers
- `handoff.result_contract` — expected result fields and output-path hints
- `source` — where the normalized request came from

## Resources

- Detailed field definitions and compatibility notes: `reference.md`
- Reusable CLI helper: `scripts/normalize-spawn-request.js`
