# Spawn Agent Session Reference

## Canonical Inputs

The normalized request contract supports these request fields:

- `agent_id`: target model or agent identifier
- `mode`: caller-selected execution mode such as `run`
- `runtime`: caller-selected runtime such as `acp` or `subagent`
- `task`: fully rendered task text for the spawned session
- `attachments`: optional array of attachment objects
- `label`: optional caller-supplied stable label
- `thread`: optional boolean thread preference

Attachment objects must include `name` plus either string `path` or string `content`.

## Canonical Output Shape

The helper keeps the normalized request in snake_case for caller-side contracts and also emits an OpenClaw-ready `sessions_spawn` payload in camelCase. The OpenClaw projection preserves `attachments` and `thread` so documented canonical inputs are not lost at the tool boundary.


```json
{
  "version": 1,
  "source_kind": "canonical",
  "count": 1,
  "requests": [
    {
      "request": {
        "agent_id": "gpt-5.3-codex",
        "mode": "run",
        "runtime": "subagent",
        "task": "Generate RCA for BCIN-1234 using attached payload",
        "attachments": [
          {
            "name": "rca-input.json",
            "path": "/tmp/rca-input-BCIN-1234.json"
          }
        ],
        "label": "rca-BCIN-1234",
        "thread": false
      },
      "openclaw": {
        "tool": "sessions_spawn",
        "args": {
          "task": "Generate RCA for BCIN-1234 using attached payload",
          "agentId": "gpt-5.3-codex",
          "label": "rca-BCIN-1234",
          "mode": "run",
          "runtime": "subagent",
          "attachments": [
            {
              "name": "rca-input.json",
              "path": "/tmp/rca-input-BCIN-1234.json"
            }
          ],
          "thread": false
        }
      },
      "handoff": {
        "label": "rca-BCIN-1234",
        "session_key_hint": "spawn-agent-session:rca-BCIN-1234",
        "result_contract": {
          "kind": "structured-result",
          "expected_outputs": [],
          "success_field": "session_result",
          "error_field": "session_error"
        }
      },
      "source": {
        "kind": "canonical",
        "index": 0
      }
    }
  ]
}
```

## Legacy RCA Manifest Compatibility

The CLI accepts a legacy manifest file containing `rca_inputs[]` and expands it into one normalized request per issue. Callers must provide runtime defaults via CLI flags so the helper does not invent workflow-specific execution policy.

Required flags for legacy manifests:
- `--agent-id`
- `--mode`
- `--runtime`
- `--task-template`

Optional flags:
- `--label-template` default: `spawn-{{issue_key}}`
- `--thread` default: `false`

Supported template placeholders come from each manifest entry, for example:
- `{{issue_key}}`
- `{{input_file}}`
- `{{output_file}}`

Unknown placeholders are rejected so callers do not accidentally emit incomplete tasks or labels.

The helper maps legacy `input_file` to a single attachment and maps legacy `output_file` to `handoff.result_contract.expected_outputs`. For OpenClaw compatibility, include file paths in the rendered task text because the local `sessions_spawn` examples are task-centric.

## CLI and TUI Compatibility

This skill only normalizes payloads. It does not call spawn APIs directly. Use `requests[].openclaw.args` as the argument object for `sessions_spawn(...)`; the payload preserves canonical `attachments` and `thread` when present.

That boundary keeps the contract reusable across:
- CLI flows that later call a session-spawn tool
- TUI flows that need the same payload shape
- workspace-local orchestrators that need deterministic handoff metadata

## Failure Semantics

The helper exits non-zero or throws for:
- missing input file path
- nonexistent input file
- invalid JSON
- missing required canonical fields
- malformed attachments
- unsupported CLI flags
- unknown template placeholders
- legacy manifest use without required runtime flags

Error messages are plain text so callers can surface them directly in logs or wrapper UIs.
