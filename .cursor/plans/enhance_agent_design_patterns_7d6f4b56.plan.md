---
name: Enhance Agent Design Patterns
overview: "Enhance openclaw-agent-design SKILL.md and reference.md with reusable design patterns from qa-plan-orchestrator and rca-orchestrator: Phase 0 environment check, intermediate artifact output per phase, script-driven orchestrator, and Feishu notification with retry-on-failure. Keep SKILL.md concise; move detailed patterns to reference.md."
todos: []
isProject: false
---

# Enhance OpenClaw Agent Design with qa-plan-orchestrator Patterns

## Goal

Make [openclaw-agent-design/SKILL.md](.agents/skills/openclaw-agent-design/SKILL.md) richer with reusable patterns from [qa-plan-orchestrator/SKILL.md](workspace-planner/skills/qa-plan-orchestrator/SKILL.md), while keeping it concise. Patterns to capture:

1. **Phase 0 environment check** — when using jira-cli, github, or confluence, verify access before spawning subagents
2. **Intermediate artifacts per phase** — every workflow phase must output explicit artifacts
3. **Script-driven orchestrator** — orchestrator calls scripts only; scripts own logic

## Source Patterns (from qa-plan-orchestrator)


| Pattern                | qa-plan-orchestrator implementation                                                                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Phase 0 env check      | `check_runtime_env.sh` / `runtimeEnv.mjs` validates jira (`jira me`), confluence (`confluence spaces`), github (`gh auth status`) before Phase 1 spawns                                                                  |
| Intermediate artifacts | Phase 0: `runtime_setup_*.md`, `runtime_setup_*.json`; Phase 1: `phase1_spawn_manifest.json`; Phase 2: `artifact_lookup_*.md`; etc.                                                                                      |
| Script-driven          | Orchestrator: call `phaseN.sh`, handle user interaction, spawn from manifests; scripts own all logic                                                                                                                     |
| Evidence policy        | Jira/GitHub/Confluence via approved skills only; never `web_fetch` for system-of-record                                                                                                                                  |
| Feishu notification    | Finalize phase sends summary via feishu-notify; on failure store `notification_pending` in run.json for retry (see [phase5_finalize.sh](workspace-daily/skills/rca-orchestrator/scripts/phase5_finalize.sh) lines 69–77) |


Reference: [workspace-planner/AGENTS.md](workspace-planner/AGENTS.md) lines 95–103 ("During Phase 0, verify access first..."), [runtimeEnv.mjs](workspace-planner/skills/qa-plan-orchestrator/scripts/lib/runtimeEnv.mjs) SOURCE_COMMANDS, [phase5_finalize.sh](workspace-daily/skills/rca-orchestrator/scripts/phase5_finalize.sh) send_feishu pattern.

---

## Implementation Plan

### 1. Add Design Patterns Section to openclaw-agent-design SKILL.md

**File:** [.agents/skills/openclaw-agent-design/SKILL.md](.agents/skills/openclaw-agent-design/SKILL.md)

Add a short **Design Patterns** section after Key Rules (before "When Sections Are Required"):

```markdown
## Design Patterns

Apply these when the workflow uses external integrations or multi-phase orchestration:

- **Phase 0 env check**: If Phase 0 uses `jira-cli`, `github`, or `confluence`, verify access before spawning subagents (`jira me`, `gh auth status`, Confluence spaces). Output `runtime_setup_*.json` with per-source status. Block if any required source fails. Copy `check_runtime_env.sh` and `check_runtime_env.mjs` from `examples/` — no need to rewrite.
- **Runtime output location**: All runtime output (task.json, run.json, context/, drafts/, manifests, final artifacts) must live under `<skill-root>/runs/<run-key>/`. No runtime artifacts outside `runs/`.
- **Intermediate artifacts**: Every phase must output explicit artifacts (e.g. `context/`, `drafts/`, manifests). No phase produces only in-memory state.
- **Script-driven orchestrator**: Orchestrator calls `phaseN.sh` only; scripts own logic. Orchestrator handles user prompts and spawn-from-manifest.
- **Spawn from script**: When orchestrator is script-driven, copy `spawn_from_manifest.mjs` or `openclaw-spawn-bridge.template.js` from `examples/`. No need to rewrite openclaw CLI invocation.
- **Evidence policy**: Use approved skills (jira-cli, confluence, github) for system-of-record; never `web_fetch` for Jira/GitHub/Confluence.
- **Feishu notification**: When finalizing, send summary via feishu-notify skill. On failure, store `notification_pending` in run.json for later retry. Copy `send_feishu_with_retry.template.sh` from `examples/` — no need to rewrite.

See [reference.md](reference.md) for pattern details. All reusable scripts live in `examples/` — no dependency on other workspaces.
```

Keep the section to ~8 lines. No expansion of existing content.

### 2. Add Pattern Details to openclaw-agent-design reference.md

**File:** [.agents/skills/openclaw-agent-design/reference.md](.agents/skills/openclaw-agent-design/reference.md)

Add a new section **Design Patterns (from qa-plan-orchestrator)** after "Existing Shared Skills to Reuse Directly":

```markdown
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

```

### 3. Add Runtime Output Rule to reference.md Folder Structure Template

**File:** [.agents/skills/openclaw-agent-design/reference.md](.agents/skills/openclaw-agent-design/reference.md)

Update the **Folder Structure Template** for script-bearing skills to include `runs/` and the runtime output rule:

```markdown
**Script-bearing skill (with runtime output):**
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
    └── test/

**Runtime output rule:** All runtime artifacts (task.json, run.json, context/, drafts/, manifests, final output) must live under `<skill-root>/runs/<run-key>/`. No runtime output outside `runs/`.
```

### 4. Update Design Doc Template Guidance

**File:** [.agents/skills/openclaw-agent-design/SKILL.md](.agents/skills/openclaw-agent-design/SKILL.md)

In the **Architecture > Workflow chart** guidance (or via reference.md Workflow Chart Template), add a one-line reminder:

- "If workflow uses jira-cli/github/confluence: Phase 0 must include env check and `runtime_setup_*.json` output."

This can be added to the reference.md Workflow Chart Template comment rather than SKILL.md to avoid verbosity.

### 5. Update reference.md Workflow Chart Template

**File:** [.agents/skills/openclaw-agent-design/reference.md](.agents/skills/openclaw-agent-design/reference.md)

In the Workflow Chart Template, add a bullet under Phase 0:

```markdown
Phase 0: Existing-State Check
- Run REPORT_STATE check (see reference.md)
- If using jira-cli/github/confluence: run env check, output runtime_setup_*.json
- Present options by state (FINAL_EXISTS, DRAFT_EXISTS, CONTEXT_ONLY, FRESH)
- Archive prior output if regenerate selected
- Initialize task.json / run.json
```

### 6. Add Example Scripts (Copy-Ready)

**Purpose:** Provide standalone, copy-ready env check scripts so each new agent design does not need to rewrite them.

**Location:** `.agents/skills/openclaw-agent-design/examples/`

**Files to create:**


| File                                          | Purpose                                                                   |
| --------------------------------------------- | ------------------------------------------------------------------------- |
| `examples/check_runtime_env.sh`               | Thin wrapper; invokes `check_runtime_env.mjs`                             |
| `examples/check_runtime_env.mjs`              | Standalone Node script (no deps on qa-plan-orchestrator)                  |
| `examples/send_feishu_with_retry.template.sh` | Feishu notification with retry-on-failure (from phase5_finalize.sh 69–77) |


**check_runtime_env.mjs** — standalone implementation:

- SOURCE_COMMANDS: jira (jira-run.sh me or jira me), confluence (confluence spaces), github (gh auth status)
- Resolution order for jira: JIRA_CLI_SCRIPT env → repo `.agents/skills/jira-cli/scripts/jira-run.sh` → `~/.agents/skills/jira-cli/scripts/jira-run.sh` → `~/.openclaw/skills/jira-cli/scripts/jira-run.sh`
- Input: `<run-key> <requested-sources> [output-dir]` (e.g. `BCIN-1234 jira,confluence,github ./context`)
- Output: `runtime_setup_<run-key>.json`, `runtime_setup_<run-key>.md`
- Exit 1 if any required source is blocked; exit 0 otherwise
- No imports from qa-plan-orchestrator; use only Node built-ins

**check_runtime_env.sh:**

```bash
#!/bin/bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
node "$SCRIPT_DIR/check_runtime_env.mjs" "$@"
```

**send_feishu_with_retry.template.sh** — copy-ready Feishu notification with retry-on-failure:

- Based on [phase5_finalize.sh](workspace-daily/skills/rca-orchestrator/scripts/phase5_finalize.sh) lines 69–77.
- Requires: `load_feishu_chat_id` (from TOOLS.md), `set_run_field` (jq-based run.json update), `FEISHU_NOTIFY_SCRIPT` (default: `$REPO_ROOT/.agents/skills/feishu-notify/scripts/send-feishu-notification.js`).
- Input: `RUN_KEY`, `SUMMARY_FILE` (or equivalent), `RUN_DIR` for run.json.
- On success: clear `notification_pending` in run.json.
- On failure: set `notification_pending = {chat_id, file}` in run.json for later retry.
- Template includes inline comments for adapting to your skill's `run_dir`, `set_run_field`, and TOOLS path.

**reference.md update:** Add subsection under "Phase 0 Environment Check":

```markdown
### Example Scripts (Copy-Ready)

Copy from `.agents/skills/openclaw-agent-design/examples/` into your skill's `scripts/`:

- `check_runtime_env.sh` — wrapper
- `check_runtime_env.mjs` — standalone env validation (jira, confluence, github)
- `send_feishu_with_retry.template.sh` — Feishu notification with retry-on-failure (store notification_pending in run.json)

Usage: `bash scripts/check_runtime_env.sh <run-key> <jira,confluence,github> [output-dir]`

Output: `runtime_setup_<run-key>.json`, `runtime_setup_<run-key>.md` in output-dir (default: `./runs/<run-key>/context/` when omitted).

Feishu: Copy `send_feishu_with_retry.template.sh`, adapt `load_feishu_chat_id`, `set_run_field`, and paths. Reference: [phase5_finalize.sh](workspace-daily/skills/rca-orchestrator/scripts/phase5_finalize.sh) lines 69–77.
```

**SKILL.md update:** In Design Patterns, add one line:

- "Use example scripts in `examples/` — copy `check_runtime_env.sh` and `check_runtime_env.mjs` when Phase 0 needs jira/github/confluence validation."

### 7. Add Spawn Bridge Example (Script-Driven Subagent Spawn)

**Purpose:** When the orchestrator is script-driven (not agent-in-loop), provide reusable spawn examples in `examples/` so each design does not rewrite spawn logic. **All reusable pieces live in openclaw-agent-design/examples/** — no dependency on workspace-daily or rca-orchestrator (those workspaces may not exist in all repos).

**Applicability:** Spawn bridge is used when:

- Orchestrator runs as bash/Node (e.g. cron, `run.sh`), not as an agent with `sessions_spawn` tool
- Phase scripts output `phaseN_spawn_manifest.json`; a bridge runs the spawns via `openclaw sessions spawn --wait`

**Add to examples/ (self-contained):**


| File                                          | Purpose                                                                                                                                                                           |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `examples/spawn_from_manifest.mjs`            | Generic: read manifest, run openclaw spawn per `request.openclaw.args`, wait, return results                                                                                      |
| `examples/openclaw-spawn-bridge.template.js`  | Domain-specific template: `spawnBatch(requests, context) => Promise<result[]>`. Copy and customize task building for your manifest format. Uses `openclaw sessions spawn --wait`. |
| `examples/send_feishu_with_retry.template.sh` | Feishu notification with retry-on-failure: store `notification_pending` in run.json on failure (phase5_finalize.sh 69–77).                                                        |
| `examples/README.md`                          | Documents env check, spawn, Feishu examples, and test stub coverage table; no external workspace references required                                                              |


**spawn_from_manifest.mjs** — standalone:

- Input: `node spawn_from_manifest.mjs <manifest-path> [--cwd <dir>]`
- Read `requests` from manifest; for each `request.openclaw.args`: build `openclaw sessions spawn --task ... --label ... --mode ... --runtime subagent --wait --cwd ...`
- Run sequentially; exit 1 if any spawn fails
- Output: write `spawn_results.json` alongside manifest or to stdout

**openclaw-spawn-bridge.template.js** — copy-ready domain-specific bridge (in examples/, not external):

- Exports `spawnBatch(requests, context) => Promise<result[]>`
- Each request: extract task/label from request (customize for your manifest format), run `openclaw sessions spawn --wait`
- Return `{ label, status, started_at, finished_at, output_file?, session_error? }` per request
- Template includes placeholder for custom task building; user adapts to their manifest shape

**reference.md update:** Add subsection under "Script-Driven Orchestrator":

```markdown
### Spawn Bridge (Script-Driven Context)

When the orchestrator is a script (not an agent with sessions_spawn tool), copy from `examples/`:

- **Generic**: `spawn_from_manifest.mjs` — reads `phaseN_spawn_manifest.json` (requests[].openclaw.args), runs `openclaw sessions spawn` per request.
- **Domain-specific**: `openclaw-spawn-bridge.template.js` — implements `spawnBatch(requests, context)` contract. Copy into your skill, customize task extraction for your manifest format.
- **Feishu notification**: `send_feishu_with_retry.template.sh` — sends summary via feishu-notify; on failure stores `notification_pending` in run.json for retry. Reference: rca-orchestrator phase5_finalize.sh.
```

### 8. Add Tests / Coverage Requirements to Design Template

**Purpose:** Ensure every design doc includes a Tests section with a script-to-test stub table. Stub functions in table format are sufficient; no implementation required.

**File:** [.agents/skills/openclaw-agent-design/reference.md](.agents/skills/openclaw-agent-design/reference.md)

Add subsection **Test Stub Coverage (Required for Script-Bearing Skills)** after "Script Test Stub Matrix Template":

```markdown
### Test Stub Coverage (Required for Script-Bearing Skills)

Every script-bearing design must include a **Tests** section with a stub table. Every script in the Script Inventory must have a row. Stub tests only — no implementation.

| Script Path | Test Stub Path | Scenarios (stub) |
|-------------|----------------|------------------|
| `scripts/phase0.sh` | `scripts/test/phase0.test.sh` | success; missing-run-key |
| `scripts/lib/foo.mjs` | `scripts/test/foo.test.mjs` | parseInput; validateOutput; error-path |
| `scripts/bar.sh` | `scripts/test/bar.test.sh` | success; required-arg failure |

**Coverage rule:** Each script in the design must have a corresponding test stub row. Scenarios column lists stub scenario names (e.g. `success`, `required-arg failure`, `dependency-error`) — implementation deferred.
```

**File:** [.agents/skills/openclaw-agent-design/SKILL.md](.agents/skills/openclaw-agent-design/SKILL.md)

In "When Sections Are Required", clarify the Tests row:

```markdown
| Tests (script-to-test stub table) | Script-bearing skill — every script must have a stub row |
```

**Examples stub table** (for openclaw-agent-design/examples/ — add when creating examples):


| Script Path                                   | Test Stub Path                                 | Scenarios (stub)                               |
| --------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| `examples/check_runtime_env.mjs`              | `examples/test/check_runtime_env.test.mjs`     | success; blocked-source; missing-args          |
| `examples/check_runtime_env.sh`               | (covered by .mjs test)                         | —                                              |
| `examples/spawn_from_manifest.mjs`            | `examples/test/spawn_from_manifest.test.mjs`   | success; manifest-not-found; spawn-failure     |
| `examples/openclaw-spawn-bridge.template.js`  | `examples/test/openclaw-spawn-bridge.test.js`  | spawnBatch-success; spawnBatch-partial-failure |
| `examples/send_feishu_with_retry.template.sh` | `examples/test/send_feishu_with_retry.test.sh` | success; feishu-failure-sets-pending           |


**Files to create (stub only):**

- `examples/test/check_runtime_env.test.mjs` — stub: `success`, `blocked-source`, `missing-args`
- `examples/test/spawn_from_manifest.test.mjs` — stub: `success`, `manifest-not-found`, `spawn-failure`
- `examples/test/openclaw-spawn-bridge.test.js` — stub: `spawnBatch-success`, `spawnBatch-partial-failure`
- `examples/test/send_feishu_with_retry.test.sh` — stub: `success`, `feishu-failure-sets-pending`

Each stub file: `test('scenario-name', () => { /* TODO */ })` or equivalent; no real logic.

---

## Files To Change


| File                                                                                                   | Action                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| [.agents/skills/openclaw-agent-design/SKILL.md](.agents/skills/openclaw-agent-design/SKILL.md)         | Add Design Patterns section (~10 lines, incl. example ref)                                                                             |
| [.agents/skills/openclaw-agent-design/reference.md](.agents/skills/openclaw-agent-design/reference.md) | Add Design Patterns, Runtime Output Location, Feishu Notification, Folder Structure with runs/, example scripts ref, Workflow Template |
| `.agents/skills/openclaw-agent-design/examples/check_runtime_env.sh`                                   | Create — thin wrapper                                                                                                                  |
| `.agents/skills/openclaw-agent-design/examples/check_runtime_env.mjs`                                  | Create — standalone env validation (jira, confluence, github)                                                                          |
| `.agents/skills/openclaw-agent-design/examples/spawn_from_manifest.mjs`                                | Create — generic manifest-to-openclaw-spawn (qa-plan format)                                                                           |
| `.agents/skills/openclaw-agent-design/examples/openclaw-spawn-bridge.template.js`                      | Create — domain-specific spawnBatch template (self-contained)                                                                          |
| `.agents/skills/openclaw-agent-design/examples/send_feishu_with_retry.template.sh`                     | Create — Feishu notification with retry-on-failure (phase5_finalize.sh 69–77 pattern)                                                  |
| `.agents/skills/openclaw-agent-design/examples/README.md`                                              | Create — documents env check, spawn, and Feishu examples (no external refs)                                                            |
| `.agents/skills/openclaw-agent-design/examples/test/check_runtime_env.test.mjs`                        | Create — stub only (success, blocked-source, missing-args)                                                                             |
| `.agents/skills/openclaw-agent-design/examples/test/spawn_from_manifest.test.mjs`                      | Create — stub only (success, manifest-not-found, spawn-failure)                                                                        |
| `.agents/skills/openclaw-agent-design/examples/test/openclaw-spawn-bridge.test.js`                     | Create — stub only (spawnBatch-success, spawnBatch-partial-failure)                                                                    |
| `.agents/skills/openclaw-agent-design/examples/test/send_feishu_with_retry.test.sh`                    | Create — stub only (success, feishu-failure-sets-pending)                                                                              |


---

## Validation

- openclaw-agent-design SKILL.md remains under ~100 lines
- reference.md gains ~40 lines of pattern content
- No changes to openclaw-agent-design-review or check_design_evidence.sh (patterns are design guidance, not evidence-check requirements)

