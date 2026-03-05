# Skill Shell Workflow Enhancement — Design Doc

> **Design ID:** `skill-shell-workflow-v1`
> **Date:** 2026-03-05
> **Status:** Draft
> **Scope:** Enhance `openclaw-agent-design` and `openclaw-agent-design-review` skills to replace the NLG-described workflow sections with concrete shell-script-driven automation, following the RCA Daily workflow pattern.
>
> **Constraint:** This is a design artifact only. Do not implement until approved by user.

---

## 0. Problem Statement

### Current State

Both skills currently describe workflow execution in **NLG (natural language)** form:

- `openclaw-agent-design` — Section 4 (Workflow Design) describes phases as prose instructions for a human/agent reader to interpret.
- `openclaw-agent-design-review` — Review Process uses NLG steps, and its bundled scripts (`validate_paths.sh`, `check_design_evidence.sh`) are referenced but never composed into a runnable orchestration layer.

### Pain Points

| #   | Problem                                                                                                                                 |
| --- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | NLG phases are ambiguous — agents re-interpret them differently each run, causing non-reproducible results.                             |
| 2   | No single entry-point to run the full pipeline; each phase depends on agent memory of prior-phase output.                               |
| 3   | Agent spawning (`sessions_spawn`) only works in CLI mode. Automation needs `generate-rcas-via-agent.js`-style Node.js spawning instead. |
| 4   | Feishu notification is described in NLG but has no guaranteed delivery path (no fallback file written by script).                       |
| 5   | Code quality: existing scripts mix data collection, orchestration, and side effects inside one monolithic function.                     |

### Target State

Replace NLG workflow sections with **shell script orchestrators** that:

1. Are deterministic and idempotent.
2. Produce a manifest (JSON) for agent reading.
3. Spawn sub-agents via `generate-rcas-via-agent.js`-style Node.js (not `sessions_spawn`).
4. Handle Feishu notifications with file-based fallback persistence.
5. Follow functional + modular coding standards (each function ≤ 20 lines, pure where possible, TDD stubs included).

---

## 1. Design Deliverables

| Action | Path                                                                           | Notes                                                       |
| ------ | ------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| UPDATE | `.cursor/skills/openclaw-agent-design/SKILL.md`                                | Replace Section 4 NLG default with shell-script default; update frontmatter `description` to include shell-script workflow mode and `spawn-agents.js` (not `sessions_spawn`) per skill-creator |
| UPDATE | `.cursor/skills/openclaw-agent-design/reference.md`                            | Add shell workflow architecture diagram, script conventions |
| CREATE | `.cursor/skills/openclaw-agent-design/scripts/run-agent-workflow.sh`           | Main orchestrator entry point                               |
| CREATE | `.cursor/skills/openclaw-agent-design/scripts/create-manifest.sh`              | Collects inputs → writes manifest JSON                      |
| CREATE | `.cursor/skills/openclaw-agent-design/scripts/spawn-agents.js`                 | Node.js sub-agent spawner (replaces sessions_spawn)         |
| CREATE | `.cursor/skills/openclaw-agent-design/scripts/post-workflow.sh`                | Jira update + Feishu notification phase                     |
| CREATE | `.cursor/skills/openclaw-agent-design/scripts/lib/manifest.sh`                 | Pure manifest read/write helpers                            |
| CREATE | `.cursor/skills/openclaw-agent-design/scripts/lib/feishu.sh`                   | Feishu send + fallback helpers                              |
| CREATE | `.cursor/skills/openclaw-agent-design/scripts/lib/logging.sh`                  | Structured log helpers                                      |
| CREATE | `.cursor/skills/openclaw-agent-design/scripts/test/run-agent-workflow.test.sh` | Smoke/unit test harness                                     |
| UPDATE | `.cursor/skills/openclaw-agent-design-review/SKILL.md`                         | Add shell-script review checklist gate; update frontmatter `description` to include shell script compliance (SHELL-\* checks, spawn-agents.js) per skill-creator |
| UPDATE | `.cursor/skills/openclaw-agent-design-review/reference.md`                     | Add shell script quality rubric                             |
| UPDATE | `.cursor/skills/openclaw-agent-design-review/scripts/check_design_evidence.sh` | Extend to check shell-script contract compliance            |
| UPDATE | `AGENTS.md`                                                                    | Sync: document shell-workflow path, new scripts             |

---

## 2. AGENTS.md Sync

Sections to update in the root-level `AGENTS.md`:

- **Skills Reference**: note that `openclaw-agent-design` now supports shell-script workflow mode alongside NLG mode.
- **Conventions**: add "Shell Workflow" section with entry-point convention (`scripts/run-agent-workflow.sh`).
- **Agent Spawning**: document that sub-agents must use `spawn-agents.js` (NOT `sessions_spawn`) to remain compatible with non-CLI contexts.

---

## 3. Workflow Architecture

The new shell-script workflow mirrors the RCA Daily pattern:

```
  Bash Script (run-agent-workflow.sh)
        │
        ├── Step 1: check_resume.sh (idempotency gate)
        │         └── exits early if FINAL_EXISTS + user pick is "use existing"
        │
        ├── Step 2: create-manifest.sh
        │         └── writes output/<key>/manifest-<timestamp>.json
        │
        └── Step 3: spawn-agents.js <manifest>
                  └── reads manifest
                  └── spawns N sub-agents via OpenClaw agent API (NOT sessions_spawn)
                  └── prints stdout handoff block (parent Agent assumes control)

  (Post-Script Execution by Parent Agent via NLG Instructions)
        │
        ▼
   post-workflow.sh (called manually by agent after sub-agents complete)
        ├── Step A: Jira update per output artifact
        └── Step B: Feishu notification
                  └── on failure: persists payload → run.json.notification_pending
```

**Key constraint**: `spawn-agents.js` must **not** use `sessions_spawn` (CLI-only). It uses the same pattern as `generate-rcas-via-agent.js` — prints a structured manifest to stdout for the calling OpenClaw agent to act on, OR uses OpenClaw's REST agent-spawn API if available in the execution context.

---

## 4. Script Design (TDD + Functional + Modular)

### Rules applied to all scripts

1. Each function: max 20 lines.
2. No mutation of global state inside functions — pass args, return/echo results.
3. No side effects inside pure helper functions (lib/\*.sh).
4. Every script has a corresponding test stub in `test/`.
5. All scripts begin with `set -euo pipefail`.
6. **Minimal mocks rule:** Unit and integration tests MUST use minimal mocks. Prefer:
   - Real filesystem (temp dirs), real `jq`/`node` invocations where cheap
   - Stub only external APIs (Jira, Feishu, GitHub) and slow/network-bound calls
   - Avoid mocking internal helpers; test them directly with small fixtures
   - Mock at the boundary: e.g. mock `send-feishu-notification.js` via a wrapper, not every `curl` call

---

### 4.1 `scripts/lib/logging.sh` — Structured log helpers

**Purpose**: Provide `log_info`, `log_error`, `log_step` functions with timestamps. Zero side effects — just echo to stderr/stdout.

```bash
#!/usr/bin/env bash
# lib/logging.sh — Pure logging helpers. Source this file; do not execute directly.

log_info()  { echo "[INFO]  $(date -u +%FT%TZ) $*" >&2; }
log_error() { echo "[ERROR] $(date -u +%FT%TZ) $*" >&2; }
log_step()  { echo ""; echo "=== $* ==="; echo ""; }
```

**Test stub** (`test/lib/logging.test.sh`): No mocks — pure echo; assert output format.

```bash
source ../lib/logging.sh
log_info "test info"   # expect: [INFO] ... test info
log_error "test error" # expect: [ERROR] ... test error
```

---

### 4.2 `scripts/lib/manifest.sh` — Manifest read/write helpers

**Purpose**: Create, read, and validate the JSON manifest file. Pure functions; caller passes paths as args.

Planned function signatures:

- `manifest_create <output_dir> <timestamp> <total>` → prints manifest JSON skeleton to stdout
- `manifest_add_entry <issue_key> <input_file> <output_file>` → prints one JSON entry to stdout
- `manifest_validate <manifest_path>` → exits non-zero if required fields missing

Each function: ≤ 20 lines, no global state mutation.

**TDD stub** (`test/lib/manifest.test.sh`): Minimal mocks — real `jq`, temp dirs; no network.

```bash
source ../lib/manifest.sh
# Test: manifest_create emits valid JSON (real jq, no mocks)
result=$(manifest_create "/tmp/out" "20260305-120000" "3")
echo "$result" | jq '.total_issues' # expect: 3

# Test: manifest_validate rejects missing timestamp (real stdin, no mocks)
echo '{"rca_inputs":[]}' | manifest_validate /dev/stdin && exit 1 || echo "PASS"
```

---

### 4.3 `scripts/lib/feishu.sh` — Feishu send + fallback helpers

**Purpose**: Send Feishu notification via `send-feishu-notification.js`. On failure, write the pending payload to `run.json`.

Planned functions:

- `feishu_send <summary_file> <chat_id>` → calls Node script, returns exit code
- `feishu_persist_fallback <run_json_path> <payload>` → writes `notification_pending` field to run.json
- `feishu_retry_if_pending <run_json_path> <chat_id>` → reads pending payload; retries if non-null

Each function: ≤ 20 lines.

**TDD stub** (`test/lib/feishu.test.sh`): Minimal mocks — real filesystem + `jq`; mock only `send-feishu-notification.js` (or use `--dry-run` stub script).

```bash
source ../lib/feishu.sh
# Test: feishu_persist_fallback writes correct JSON (real fs, no Feishu API)
feishu_persist_fallback /tmp/run.json "test payload"
jq -r '.notification_pending' /tmp/run.json # expect: "test payload"
```

---

### 4.4 `scripts/create-manifest.sh` — Data collection → manifest

**Purpose**: Scans the output directory for `<key>-input-*.json` files, calls `manifest_create` + `manifest_add_entry`, and writes the final manifest file. Calls `log_step` / `log_info`.

Decomposed into:

- `find_input_files <output_dir>` → prints file list
- `build_manifest <output_dir> <timestamp>` → orchestrates creation of full manifest JSON
- `write_manifest <json> <manifest_path>` → atomic write (tmp → rename)
- `main` — ≤ 20 lines driver

**TDD stub** (`test/create-manifest.test.sh`): Minimal mocks — real temp dir + real input JSON; no Jira/GitHub.

```bash
# Setup: real fixture files (no mocks)
mkdir -p /tmp/test-out
echo '{"issue_key":"BCIN-001","rca_output_path":"/tmp/out/001.md"}' > /tmp/test-out/test-input-BCIN-001.json

bash create-manifest.sh /tmp/test-out 20260305-000000
jq '.total_issues' /tmp/test-out/manifest-*.json # expect: 1
```

---

### 4.5 `scripts/spawn-agents.js` — Sub-agent spawner (Node.js)

**Purpose**: Read manifest JSON. For each entry, emit a structured `AGENT_SPAWN_REQUEST:` line to stdout. The calling OpenClaw agent reads stdout and performs the actual spawning. Mirrors `generate-rcas-via-agent.js` stdout handoff pattern exactly.

> **Critical design constraint**: `sessions_spawn` is CLI-only. `spawn-agents.js` must use the **stdout handoff pattern** — the same approach as `generate-rcas-via-agent.js`:
>
> - Print `MANIFEST_JSON:` + structured JSON to stdout.
> - The calling OpenClaw agent reads stdout, picks up the manifest, and spawns sub-agents itself.
> - Do **not** call the OpenClaw REST API directly. Do **not** use `sessions_spawn`.

Decomposed into:

- `readManifest(manifestPath)` → `Manifest` — pure, no side effects
- `buildSpawnLine(entry)` → `string` — pure, formats `AGENT_SPAWN_REQUEST: <json>` stdout line
- `emitSpawnLines(manifest)` → `void` — maps entries through `buildSpawnLine`, prints each to stdout
- `printManifestSummary(manifest)` → `void` — prints `MANIFEST_JSON: <json>` header line
- `main()` — ≤ 20 lines, handles CLI args + error exit

**stdout handoff contract** (matches `generate-rcas-via-agent.js`):

```
MANIFEST_JSON: {"timestamp":"...","total_issues":2,...}
AGENT_SPAWN_REQUEST: {"issue_key":"BCIN-001","input_file":"...","output_file":"..."}
AGENT_SPAWN_REQUEST: {"issue_key":"BCIN-002","input_file":"...","output_file":"..."}
✅ Manifest ready for agent processing
👉 Next: OpenClaw agent should process each AGENT_SPAWN_REQUEST line
```

**TDD stub** (`test/spawn-agents.test.js`): Minimal mocks — real fixture JSON file; no agent API or network.

```js
const {
  readManifest,
  buildSpawnLine,
  emitSpawnLines,
} = require("./spawn-agents");

// Test: readManifest returns parsed object (real file read, no mocks)
const m = readManifest("./fixtures/manifest-sample.json");
assert.strictEqual(m.total_issues, 2);

// Test: buildSpawnLine produces correct stdout format (pure function, no mocks)
const line = buildSpawnLine({
  issue_key: "BCIN-001",
  input_file: "/tmp/f.json",
  output_file: "/tmp/o.md",
});
assert.ok(line.startsWith("AGENT_SPAWN_REQUEST:"));
assert.ok(
  JSON.parse(line.replace("AGENT_SPAWN_REQUEST: ", "")).issue_key ===
    "BCIN-001",
);

// Test: sessions_spawn must NOT appear anywhere in spawn-agents.js (static analysis, no mocks)
const src = require("fs").readFileSync("./spawn-agents.js", "utf8");
assert.ok(
  !src.includes("sessions_spawn"),
  "SHELL-001 violation: sessions_spawn found",
);
```

---

### 4.6 `scripts/post-workflow.sh` — Jira update + Feishu notification

**Purpose**: Called after all sub-agents have completed. Loops over output `.md` files, updates Jira, then sends Feishu summary. Uses `lib/feishu.sh` for fallback persistence.

Decomposed into:

- `update_jira_for_all <rca_dir> <script_dir>` → loops rca files, calls `update-jira-latest-status.sh`
- `generate_summary <rca_dir> <output_dir> <timestamp>` → writes `feishu-summary-*.md`
- `notify_feishu <summary_file> <chat_id> <run_json>` → calls `feishu_send`; on fail calls `feishu_persist_fallback`
- `main` — ≤ 20 lines driver

**TDD stub** (`test/post-workflow.test.sh`): Minimal mocks — real RCA markdown fixtures; mock Jira/Feishu via `--dry-run` (no external API calls).

```bash
# Test: generate_summary produces table with correct row count (real files, --dry-run skips Jira/Feishu)
mkdir -p /tmp/rca
echo "## 1. Incident Summary" >> /tmp/rca/BCIN-001-rca.md
bash post-workflow.sh --dry-run /tmp/rca
cat /tmp/out/feishu-summary-*.md | grep "BCIN-001" || exit 1
```

---

### 4.7 `scripts/run-agent-workflow.sh` — Main entry point

**Purpose**: Orchestrates the full pipeline. Delegates each step to sub-scripts. Never contains business logic — only step sequencing.

```
run-agent-workflow.sh <key> [--dry-run]
  Step 0: ensure task.json and run.json exist (initialize if FRESH)
  Step 1: check_resume.sh <key>          → idempotency gate
  Step 2: create-manifest.sh             → build manifest
  Step 3: node spawn-agents.js <manifest> → spawn sub-agents
```

_(Note: `post-workflow.sh` is NOT orchestrated by `run-agent-workflow.sh`. It is executed by the parent OpenClaw Agent after sub-agents complete.)_

**TDD stub** (`test/run-agent-workflow.test.sh`): Minimal mocks — `--dry-run` skips external APIs; real scripts, temp dirs.

```bash
# Smoke test: dry-run completes without error (no Jira/Feishu/agent spawn)
bash run-agent-workflow.sh BCIN-TEST --dry-run
echo $? # expect: 0
```

---

## 5. Updates to `openclaw-agent-design` SKILL.md

### Section 4 replacement: Workflow Design (Shell + NLG coexistence)

**Replace**:

> `## 4. Workflow Design (NLG)` — _Default: NLG workflow. Phases are plain-language instructions. Use bash scripts only when the design explicitly requires automation._

**With**:

> `## 4. Workflow Design`
>
> Shell scripts are the **default** for all automatable phases (data collection, manifest creation, agent spawning, Jira updates, Feishu notification).
>
> NLG phases **coexist** for phases that explicitly require a **human confirmation gate** — for example:
>
> - Phase 0: user selects resume / regenerate / skip option
> - Any phase where destructive action requires explicit approval
>
> Rule: if a phase can run unattended without human judgment, it **must** be a shell script. If it requires stopping for user input, it **must** be NLG with explicit `User Interaction` block.

### Design Deliverables table change

Replace `CREATE | .agents/workflows/<name>.md | NLG workflow` row with:

| Action | Path                             | Notes                                  |
| ------ | -------------------------------- | -------------------------------------- |
| CREATE | `scripts/run-<name>-workflow.sh` | Main orchestrator                      |
| CREATE | `scripts/create-manifest.sh`     | Data collection → manifest             |
| CREATE | `scripts/spawn-agents.js`        | Sub-agent spawner (not sessions_spawn) |
| CREATE | `scripts/post-workflow.sh`       | Jira + Feishu post steps               |
| CREATE | `scripts/lib/manifest.sh`        | Manifest helpers                       |
| CREATE | `scripts/lib/feishu.sh`          | Feishu + fallback helpers              |
| CREATE | `scripts/lib/logging.sh`         | Logging helpers                        |
| CREATE | `scripts/test/`                  | TDD smoke tests                        |

### Key Rules section addition

```
### Shell + NLG Hybrid Workflow

- Automatable phases: MUST be shell scripts (data collection, manifest, spawning, Jira, Feishu).
- Human confirmation phases: MUST be NLG with explicit User Interaction block (Done / Blocked / Questions / Assumption policy).
- Sub-agent spawning: ALWAYS use spawn-agents.js stdout handoff pattern; NEVER use sessions_spawn.
- Feishu notifications: ALWAYS go through lib/feishu.sh with run.json.notification_pending fallback.
- All scripts: each function max 20 lines; TDD stubs in scripts/test/ before implementation.
- lib/ helpers: pure functions only — no side effects, no global state mutation.
- Tests: use minimal mocks — stub only external APIs; prefer real filesystem, jq, temp dirs, and small fixtures.
```

### Migration note (out of scope for this design)

All existing NLG-only workflow `.md` files (e.g. `feature-qa-planning.md`, `qa-summary.md`) will require migration to the shell+NLG hybrid pattern in future designs. This design establishes the canonical pattern; migration of existing workflows is tracked separately.

---

## 5a. Workspace-Reporter Workflow Applicability

The design applies to `workspace-reporter/.agents/workflows/` as follows.

### defect-analysis.md

| Design Element          | Applicable?      | Notes                                                                                                                         |
| ----------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `run-agent-workflow.sh` | **Partial**      | Defect analysis has multiple human gates (Phase 0, 0b, 5). Use shell for automatable steps only; NLG for confirmation blocks. |
| `create-manifest.sh`    | **Yes**          | Phase 2 outputs `context/jira_issues/<KEY>.json`; Phase 3 has N PRs. A manifest of PRs → sub-agents maps directly.            |
| `spawn-agents.js`       | **Yes**          | Phase 3 (Parallel PR Analysis) spawns sub-agents per PR. Replace `sessions_spawn` with `spawn-agents.js` stdout handoff.      |
| `post-workflow.sh`      | **Partial**      | Phase 6 (Publish) does Confluence + Feishu. Use `lib/feishu.sh` + `notification_pending`; Jira update is per-phase, not post. |
| `lib/feishu.sh`         | **Yes**          | Phase 6 REJECT path uses Feishu notification. Add fallback to `run.json.notification_pending`.                                |
| `check_resume.sh`       | **Already used** | Phase 0 already invokes it. Align with idempotency skill.                                                                     |
| Minimal mocks           | **Yes**          | Tests for `fetch-defects-for-feature.sh` should mock Jira CLI only; use real temp dirs and `jq`.                              |

**Conclusion:** Design applies. Introduce `scripts/create-pr-manifest.sh` and `scripts/spawn-pr-analyzers.js` for Phase 3; keep Phase 0/0b/5 as NLG with explicit User Interaction blocks.

### qa-summary.md

| Design Element          | Applicable? | Notes                                                                                           |
| ----------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| `run-agent-workflow.sh` | **Yes**     | Phases 0–6 are mostly automatable. Phase 4 is human approval gate (NLG).                        |
| `create-manifest.sh`    | **Partial** | QA Summary has one sub-agent (defect-analysis). Manifest is single-entry or feature list.       |
| `spawn-agents.js`       | **Yes**     | Phase 1 spawns defect-analysis sub-agent. Use stdout handoff; do not use `sessions_spawn`.      |
| `post-workflow.sh`      | **Yes**     | Phase 5 (Confluence update) + Phase 6 (Feishu). Matches post-workflow pattern.                  |
| `lib/feishu.sh`         | **Yes**     | Phase 6 already documents `run.json.notification_pending`. Use `lib/feishu.sh` for consistency. |
| Minimal mocks           | **Yes**     | Mock Confluence/Feishu APIs; use real `run.json`, temp dirs, and markdown fixtures.             |

**Conclusion:** Design applies well. QA Summary is a natural fit for `run-qa-summary-workflow.sh` + `spawn-agents.js` (single defect-analysis sub-agent) + `post-workflow.sh`.

### single-defect-analysis.md

| Design Element          | Applicable? | Notes                                                                                                |
| ----------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `run-agent-workflow.sh` | **Partial** | Single-issue flow; no N-way manifest. Use shell for Phase 2–5; Phase 7 is callback (NLG).            |
| `create-manifest.sh`    | **No**      | Single issue → single output. No manifest needed.                                                    |
| `spawn-agents.js`       | **No**      | Invoked _by_ Tester via `session_spawn`; does not spawn sub-agents.                                  |
| `post-workflow.sh`      | **Partial** | Phase 7 (Jira close/comment) is human-gated. Feishu notification in Phase 6 can use `lib/feishu.sh`. |
| `lib/feishu.sh`         | **Yes**     | Phase 6 notify Tester; Phase 7 outcome notification. Add fallback.                                   |
| `check_resume.sh`       | **Yes**     | Phase 1 already uses it. Extend for `TESTING_PLAN_EXISTS` state.                                     |
| Minimal mocks           | **Yes**     | Mock Jira `issue view` and `gh pr`; use real temp dirs, `jq`, and markdown fixtures.                 |

**Conclusion:** Design applies partially. Use `lib/feishu.sh`, `lib/logging.sh`, and modular script structure. No `spawn-agents.js`; keep single-issue linear flow. Phase 7 remains NLG (user approval for Jira actions).

---

## 6. Updates to `openclaw-agent-design-review` SKILL.md

### New Quality Gate: Shell Script Compliance

Add a new gate to the Review Process (Step 3.5):

**3.5 Shell Script Contract Check** — Verify the following when design prescribes shell workflow:

| Check                                                            | Severity if Missing |
| ---------------------------------------------------------------- | ------------------- |
| `run-<name>-workflow.sh` exists or is in deliverables            | P1                  |
| `spawn-agents.js` used instead of `sessions_spawn`               | P0                  |
| Each function ≤ 20 lines (checked by `check_design_evidence.sh`) | P1                  |
| `lib/feishu.sh` (or equivalent) used for notification            | P1                  |
| `notification_pending` fallback written to `run.json`            | P1                  |
| TDD test stubs exist in `scripts/test/`                          | P1                  |
| Tests use minimal mocks (stub only external APIs)                | P2                  |
| Scripts are modular (no monolithic files > 100 lines)            | P2                  |

### New Finding IDs

| ID          | Severity | Description                                                           |
| ----------- | -------- | --------------------------------------------------------------------- |
| `SHELL-001` | P0       | Design uses `sessions_spawn` instead of `spawn-agents.js`             |
| `SHELL-002` | P1       | Shell script function exceeds 20-line limit                           |
| `SHELL-003` | P1       | No `lib/feishu.sh` fallback for notification                          |
| `SHELL-004` | P1       | Missing `run.json.notification_pending` write on Feishu failure       |
| `SHELL-005` | P1       | Missing TDD test stubs for new scripts                                |
| `SHELL-006` | P2       | Main workflow script mixes orchestration and business logic           |
| `SHELL-007` | P2       | Tests use heavy mocks instead of minimal mocks (see Section 4 rule 6) |

### `check_design_evidence.sh` extension

**Invocation mode:** Add a second mode so SHELL checks run on actual script files:

```
check_design_evidence.sh <design-markdown-file> [--scripts-dir <dir>] [--run-json-path <path>]
```

- **Design-only mode** (no `--scripts-dir`): existing behavior — validate design markdown patterns only.
- **Design + scripts mode** (`--scripts-dir` provided): additionally run SHELL checks on script files under `<dir>`. Script paths are discovered by scanning the design doc's deliverables table or by walking `<dir>` for `.sh` and `.js` files.
- **`--run-json-path`** (optional): path to `run.json` for verification command check. If omitted, skip verification command path validation.

**SHELL checks** (run only when `--scripts-dir` is provided):

- `grep -r "sessions_spawn"` in script files under `<dir>` → fail if found (SHELL-001)
- Count lines per function: `awk '/^[a-z_]*()/{...}` → flag if > 20 (SHELL-002)
- Verify `scripts/test/` (or `<dir>/test/`) exists and has ≥ 1 `.test.sh` or `.test.js` file (SHELL-005)
- Verify test files do not over-mock: flag tests that mock internal helpers (e.g. `manifest_create`) when they could use real fixtures (SHELL-007)

---

## 7. State Schemas

### task.json

Path: `projects/<type>/<key>/task.json`

```json
{
  "run_key": "BCIN-1234",
  "overall_status": "in_progress",
  "current_phase": "phase_2_manifest",
  "manifest_path": "output/<key>/manifest-20260305-120000.json",
  "created_at": "2026-03-05T04:00:00Z",
  "updated_at": "2026-03-05T04:05:00Z"
}
```

Write rule: every shell script step updates `updated_at`. Use atomic write (tmp → rename via `jq > tmp && mv tmp dest`).
Initialization: `task.json` and `run.json` are initialized by Phase 0 instructions (NLG) or explicitly bootstrapped by `run-agent-workflow.sh` at initialization if they do not exist.

### run.json

Path: `projects/<type>/<key>/run.json`

```json
{
  "data_fetched_at": "2026-03-05T04:00:00Z",
  "manifest_created_at": "2026-03-05T04:01:00Z",
  "agents_spawned_at": "2026-03-05T04:02:00Z",
  "post_workflow_at": null,
  "notification_pending": null,
  "updated_at": "2026-03-05T04:02:00Z"
}
```

`notification_pending`: set to a `base64`-encoded string (or nested JSON object) representing the full Feishu payload on send failure (avoids `jq` escaping issues). On next `run-agent-workflow.sh` resume, `lib/feishu.sh:feishu_retry_if_pending` checks and retries before any phase.

**Verification command (workspace-specific path):** The canonical verification command is `jq -r '.notification_pending // empty' <run_json_path>`. The `run.json` path is **workspace-specific** (e.g. `projects/<type>/<key>/run.json` in this design; `memory/tester-flow/runs/<work_item_key>/run.json` in tester-flow). `check_design_evidence.sh` must accept a configurable path via `RUN_JSON_PATH` env var or `--run-json-path <path>` arg so the verification command can be validated against the design's stated path convention.

---

## 8. Files To Create / Update

1. `.cursor/skills/openclaw-agent-design/SKILL.md` — **UPDATE** (Section 4 + Key Rules)
2. `.cursor/skills/openclaw-agent-design/reference.md` — **UPDATE** (add architecture diagram + script conventions)
   2b. `.cursor/skills/openclaw-agent-design/scripts/check_resume.sh` — **EXISTS** (Already provided by idempotency templates, sync usage context)
3. `.cursor/skills/openclaw-agent-design/scripts/run-agent-workflow.sh` — **CREATE**
4. `.cursor/skills/openclaw-agent-design/scripts/create-manifest.sh` — **CREATE**
5. `.cursor/skills/openclaw-agent-design/scripts/spawn-agents.js` — **CREATE**
6. `.cursor/skills/openclaw-agent-design/scripts/post-workflow.sh` — **CREATE**
7. `.cursor/skills/openclaw-agent-design/scripts/lib/manifest.sh` — **CREATE**
8. `.cursor/skills/openclaw-agent-design/scripts/lib/feishu.sh` — **CREATE**
9. `.cursor/skills/openclaw-agent-design/scripts/lib/logging.sh` — **CREATE**
10. `.cursor/skills/openclaw-agent-design/scripts/test/` (smoke tests) — **CREATE**
11. `.cursor/skills/openclaw-agent-design-review/SKILL.md` — **UPDATE** (new gate + finding IDs)
12. `.cursor/skills/openclaw-agent-design-review/reference.md` — **UPDATE** (SHELL-\* rubric)
13. `.cursor/skills/openclaw-agent-design-review/scripts/check_design_evidence.sh` — **UPDATE** (SHELL-001..005 checks)
14. `<workspace-root>/AGENTS.md` — **UPDATE** (shell workflow conventions, spawner note)

**Implementation sequence:** After all CREATE/UPDATE actions, run `package_skill.py` (or equivalent) to validate the updated skills before distribution. Per skill-creator, packaging validates frontmatter, description, and file organization.

---

## 9. Environment Setup

Scripts require:

- `jq` ≥ 1.6
- `node` ≥ 18 (via `nvm use default`)
- `bash` ≥ 5 (macOS: install via Homebrew — `brew install bash`)
- `send-feishu-notification.js` available at a known relative path (configured via `FEISHU_SCRIPT_PATH` env var)

```bash
# Verify environment
jq --version
node --version
bash --version
```

---

## 10. README Impact

- `.cursor/skills/openclaw-agent-design/README.md`: **remove if present** — per skill-creator, skills should not contain README; document shell workflow entry point and TDD conventions in SKILL.md or reference.md instead.
- `workspace-daily/README.md`: **no change** — this design is skill-level only.
- `docs/README.md`: **not applicable** — docs folder has no README at present.

---

## 11. Quality Gates

- [ ] Deliverables table complete with explicit paths and CREATE/UPDATE actions
- [ ] SKILL.md frontmatter description updated (shell-script workflow mode, spawn-agents.js)
- [ ] AGENTS.md sync sections listed (shell workflow conventions, spawner note)
- [ ] Environment setup addressed
- [ ] Shell script architecture diagram present
- [ ] `spawn-agents.js` design explicitly precludes `sessions_spawn`
- [ ] Per-script TDD stubs defined
- [ ] All functions documented with ≤ 20 line target
- [ ] `lib/feishu.sh` fallback → `run.json.notification_pending` contract defined
- [ ] `openclaw-agent-design-review` SHELL-\* gate matrix defined
- [ ] README impact explicitly addressed (remove README per skill-creator; use SKILL.md/reference.md)
- [ ] Packaging/validation step (package_skill.py) in implementation sequence
- [ ] Minimal mocks rule documented and applied to all TDD stubs
- [ ] Workspace-reporter applicability (defect-analysis, qa-summary, single-defect-analysis) analyzed
- [ ] Reviewer status (`openclaw-agent-design-review`): pending — run after approval

---

## 12. References

- RCA Daily workflow (pattern source):
  - `workspace-daily/projects/rca-daily/src/run-complete-rca-workflow.sh`
  - `workspace-daily/projects/rca-daily/src/post-rca-workflow.sh`
  - `workspace-daily/projects/rca-daily/src/generate-rcas-via-agent.js`
- Skill being updated: `.cursor/skills/openclaw-agent-design/SKILL.md`
- Review skill being updated: `.cursor/skills/openclaw-agent-design-review/SKILL.md`
- Existing review scripts: `.cursor/skills/openclaw-agent-design-review/scripts/`
- Agent idempotency: `.cursor/skills/agent-idempotency/SKILL.md`
- Skill creator: `.cursor/skills/skill-creator/SKILL.md`
