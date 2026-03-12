# OpenClaw Agent Design — Reference

## State Machine: `REPORT_STATE` Handling

| `REPORT_STATE` | Action |
|---|---|
| `FINAL_EXISTS` | Show freshness. STOP. Options: (A) Use Existing (B) Smart Refresh (C) Full Regenerate. If (C), archive first. |
| `DRAFT_EXISTS` | STOP. Options: (A) Resume (B) Smart Refresh (C) Full Regenerate. |
| `CONTEXT_ONLY` | STOP. Options: (A) Generate from Cache (B) Re-fetch + Regenerate. |
| `FRESH` | Proceed. Initialize `task.json`. |

This table is the canonical Phase 0 contract for designs that produce persistent artifacts.

## Non-Regression Rules

When redesigning a workflow into skill-first form:

- Start with the existing Phase 0 check before creating new artifacts.
- Preserve current `REPORT_STATE` semantics by default.
- Preserve existing `task.json` / `run.json` semantics by default.
- Any schema or transition change must be additive, backward-compatible, and justified in both the design doc and reviewer report.

## Shared vs Local Skill Placement

| Capability Type | Canonical Path | Rule |
|---|---|---|
| Shared reusable skill | `.agents/skills/<skill-name>/` | Use when multiple agents or workspaces can reuse it |
| Workspace-local skill | `<workspace>/skills/<skill-name>/` | Use when behavior is tightly coupled to one workspace or agent family |
| Skill helper automation | `<skill-root>/scripts/` | Shell/Node helpers that implement the skill contract |

## Existing Shared Skills to Reuse Directly

Use these existing shared skills directly when they fit:

- `jira-cli`
- `confluence`
- `feishu-notify`

Create a wrapper only when direct reuse cannot express the needed higher-level contract.

## Design Patterns (from qa-plan-orchestrator)

### Phase 0 Environment Check

When the workflow uses jira-cli, github, or confluence in Phase 0 or before spawning subagents:

| Source | Validation command | Skill |
|--------|--------------------|-------|
| Jira | `jira me` (via jira-run.sh with env loaded) | jira-cli |
| GitHub | `gh auth status` | github |
| Confluence | `confluence spaces` or workspace-specific check | confluence |

- Run validation before Phase 1 or any spawn that fetches from these sources.
- Output `context/runtime_setup_<run-key>.json` with `setup_entries[].status` (pass/blocked).
- If any required source is blocked, set `task.json.overall_status = "blocked"` and stop.

### Example Scripts (Copy-Ready)

Copy from `.agents/skills/openclaw-agent-design/examples/` into your skill's `scripts/`:

- `check_runtime_env.sh` — wrapper
- `check_runtime_env.mjs` — standalone env validation (jira, confluence, github)
- `send_feishu_with_retry.template.sh` — Feishu notification with retry-on-failure (store notification_pending in run.json)

Usage: `bash scripts/check_runtime_env.sh <run-key> <jira,confluence,github> [output-dir]`

Output: `runtime_setup_<run-key>.json`, `runtime_setup_<run-key>.md` in output-dir (default: `./runs/<run-key>/context/` when omitted).

Feishu: Copy `send_feishu_with_retry.template.sh`, adapt `load_feishu_chat_id`, `set_run_field`, and paths. Reference: rca-orchestrator phase5_finalize.sh lines 69–77.

### Runtime Output Location

**All runtime output must live under `<skill-root>/runs/<run-key>/`.**

- `task.json`, `run.json` → `runs/<run-key>/`
- `context/`, `drafts/` → `runs/<run-key>/context/`, `runs/<run-key>/drafts/`
- Phase manifests → `runs/<run-key>/phaseN_spawn_manifest.json`
- Final artifacts → `runs/<run-key>/` (e.g. `qa_plan_final.md`)

No runtime artifacts outside `runs/`. This keeps skill output predictable and isolated per run.

### Intermediate Artifacts Per Phase

Every phase must persist artifacts under `runs/<run-key>/`. Examples:

| Phase | Artifacts |
|-------|-----------|
| Phase 0 | `runs/<key>/context/runtime_setup_*.md`, `runtime_setup_*.json`, `request_fulfillment_*.md` |
| Phase 1 | `runs/<key>/phase1_spawn_manifest.json`, `runs/<key>/context/<source>_*.md` |
| Phase N | `runs/<key>/phaseN_spawn_manifest.json`, `runs/<key>/drafts/`, `runs/<key>/context/artifact_lookup_*.md` |

No phase should produce only in-memory state; all outputs must be files under `runs/<run-key>/`.

### Script-Driven Orchestrator

- Orchestrator: (1) call `phaseN.sh`, (2) handle user prompts (REPORT_STATE, approvals), (3) spawn from manifests and wait.
- Scripts: own all logic, validators, artifact writes.
- Canonical example: `workspace-planner/skills/qa-plan-orchestrator`.

### Spawn Bridge (Script-Driven Context)

When the orchestrator is a script (not an agent with sessions_spawn tool), copy from `examples/`:

- **Generic**: `spawn_from_manifest.mjs` — reads `phaseN_spawn_manifest.json` (requests[].openclaw.args), runs `openclaw sessions spawn` per request.
- **Domain-specific**: `openclaw-spawn-bridge.template.js` — implements `spawnBatch(requests, context)` contract. Copy into your skill, customize task extraction for your manifest format. Uses `openclaw agent` (--agent reporter). Invoke only from TUI (orchestrator workflow), not from CLI directly.
- **Feishu notification**: `send_feishu_with_retry.template.sh` — sends summary via feishu-notify; on failure stores `notification_pending` in run.json for retry. Reference: rca-orchestrator phase5_finalize.sh.

### Feishu Notification (Finalize Phase)

When the workflow sends a summary or report to Feishu at finalization:

- Use the shared `feishu-notify` skill: `node <feishu-notify>/scripts/send-feishu-notification.js --chat-id <id> --file <path>`.
- Load `chat_id` from workspace `TOOLS.md` (grep `oc_[a-zA-Z0-9_]+` or use feishu-notify's resolve).
- **On failure**: Store `notification_pending` in `run.json` so a retry step can resend later. Example:

```bash
# From rca-orchestrator phase5_finalize.sh (lines 69–77)
send_feishu() {
  local pending=false
  load_feishu_chat_id
  if ! node "${FEISHU_NOTIFY_SCRIPT}" --chat-id "${FEISHU_CHAT_ID}" --file "${SUMMARY_FILE}"; then
    set_run_field "${RUN_DATE}" ".notification_pending = {chat_id: \"${FEISHU_CHAT_ID}\", file: \"${SUMMARY_FILE}\"}"
    pending=true
  fi
  ${pending} || set_run_field "${RUN_DATE}" '.notification_pending = null'
}
```

- **On success**: Clear `notification_pending` in run.json.
- Copy `send_feishu_with_retry.template.sh` from `examples/` — adapt `load_feishu_chat_id`, `set_run_field`, and paths for your skill.

## Script-Bearing Skill Rule

A skill is script-bearing if either of these is true:
- the deliverables include `scripts/` under the skill package, or
- the Script Inventory contains one or more scripts.

Docs-only skills are exempt from script-specific test-stub requirements.

## OpenClaw Test Layout Exception

For OpenClaw skill-package design work, `scripts/test/` is the canonical test location for script-bearing skills. This is a domain-specific exception that overrides the generic top-level `tests/` preference from `code-quality-orchestrator` for this design domain.

## `agent-idempotency` Mapping

| `agent-idempotency` State | `check_resume.sh` `REPORT_STATE` |
|---|---|
| Final output exists | `FINAL_EXISTS` |
| Draft exists, no final | `DRAFT_EXISTS` |
| Cache only | `CONTEXT_ONLY` |
| Fresh | `FRESH` |

## `task.json` Example

```json
{
  "run_key": "BCIN-1234",
  "overall_status": "in_progress",
  "current_phase": "context_gathering",
  "updated_at": "2026-03-05T02:00:00Z",
  "phases": {
    "context_gathering": { "status": "in_progress" },
    "plan_generation": { "status": "pending" }
  }
}
```

## `run.json` Example

```json
{
  "data_fetched_at": "2026-03-05T01:00:00Z",
  "output_generated_at": "2026-03-05T02:30:00Z",
  "notification_pending": null,
  "updated_at": "2026-03-05T02:31:00Z"
}
```


## Workflow Chart Template

Place under **Architecture > Workflow chart**. Include Phase 0 and status transitions.

```markdown
### Workflow chart

[Use mermaid flowchart or table]

Phase 0: Existing-State Check
- Run REPORT_STATE check (see reference.md)
- If using jira-cli/github/confluence: run env check, output runtime_setup_*.json
- Present options by state (FINAL_EXISTS, DRAFT_EXISTS, CONTEXT_ONLY, FRESH)
- Archive prior output if regenerate selected
- Initialize task.json / run.json

Phase N: <Phase Name>
- <actions>

| From | Event | To |
|------|-------|----|
| <status> | <event> | <status> |
| any | unrecoverable error | failed |
```

## Folder Structure Template

Place under **Architecture > Folder structure**.

**Docs-only skill:**
```text
<skill-root>/
├── SKILL.md
└── reference.md
```

**Script-bearing skill:**
```text
<skill-root>/
├── SKILL.md
├── reference.md
└── scripts/
    ├── <entrypoint-or-helper>
    ├── lib/
    └── test/
```

**Script-bearing skill (with runtime output):**
```text
<skill-root>/
├── SKILL.md
├── reference.md
├── runs/
│   └── <run-key>/
│       ├── context/
│       ├── drafts/
│       ├── task.json
│       ├── run.json
│       ├── phaseN_spawn_manifest.json
│       └── <final-artifact>.md
└── scripts/
    ├── <entrypoint-or-helper>
    ├── lib/
    └── test/          # Stub tests; every script must have a row in Tests table
```

**Runtime output rule:** All runtime artifacts (task.json, run.json, context/, drafts/, manifests, final output) must live under `<skill-root>/runs/<run-key>/`. No runtime output outside `runs/`.

OpenClaw uses `scripts/test/` as package-local exception (not top-level `tests/`).

## Skills Content Template

**When design creates or materially redesigns skills:** Design must include the actual SKILL.md content, not an outline. **When design only updates functions:** No skill-related md files need updating; Skills Content Spec is not required.

Structure:

```markdown
### 3.x `<skill-path>/SKILL.md` (exact content)

---
name: <skill-name>
description: <one-line description>
---

# <Skill Title>

<concrete content — e.g. "The orchestrator has exactly three responsibilities:", "## Required References", "## Runtime Layout", etc.>

## Phase Contract (or equivalent)

### Phase 0
- Entry: `scripts/phase0.sh`
- Work: <concrete description>
- Output: <exact paths>
- User interaction: <concrete options>

...
```

## `reference.md` Content Template

Same scope as Skills Content Template above. Include the exact content of reference.md. Do not list "Must include" bullets — write the actual content.

## Script Function Spec Template

For each script, include:
- Path
- **Implementation detail**: actual implementation code


## Script Test Stub Matrix Template

```markdown
| Script Path | Test Stub Path | Scenarios | Smoke Command |
|-------------|----------------|-----------|---------------|
| `<skill-root>/scripts/foo.sh` | `<skill-root>/scripts/test/foo.test.js` | success; required-arg failure; dependency/error path | `node --test <skill-root>/scripts/test/foo.test.js` |
```

### Test Stub Coverage (Required for Script-Bearing Skills)

Every script-bearing design must include:
1. Script-to-test stub table (existing)
2. **Detailed test stub functions**: For each test file, include actual `test('...', () => { ... })` or `describe` blocks with:
   - Concrete test name
   - Setup/teardown skeleton
   - Assertion placeholder or mock call
   - No placeholder-only text like "Stub scenarios: - returns X when Y"

| Script Path | Test Stub Path | Scenarios (stub) |
|-------------|----------------|------------------|
| `scripts/phase0.sh` | `scripts/test/phase0.test.sh` | success; missing-run-key |
| `scripts/lib/foo.mjs` | `scripts/test/foo.test.mjs` | parseInput; validateOutput; error-path |
| `scripts/bar.sh` | `scripts/test/bar.test.sh` | success; required-arg failure |

**Coverage rule:** Each script in the design must have a corresponding test stub row. Include detailed `test()` blocks with concrete names, setup, and assertions — not just scenario names.

## Backfill Coverage Table Template

```markdown
| Script Path | Test Stub Path | Failure-Path Stub |
|-------------|----------------|-------------------|
| `<skill-root>/scripts/foo.sh` | `<skill-root>/scripts/test/foo.test.js` | required-arg failure |
```

## Evals Template (when applicable)

Place under **Evals** when the design creates or materially redesigns skills.

```markdown
## Evals (when applicable)

- Eval scenarios: <describe what to measure>
- Metrics: <trigger accuracy, output quality, etc.>
- Tool: Use skill-creator evals or equivalent benchmarks
- Validation: Run evals before finalizing skill changes
```

## Final Notification Template

```text
✅ <Workflow> completed
  Key:      <ISSUE_KEY>
  Output:   <path or URL>
  Updated:  <UTC TIME>
Published by <Agent Name>.
```
