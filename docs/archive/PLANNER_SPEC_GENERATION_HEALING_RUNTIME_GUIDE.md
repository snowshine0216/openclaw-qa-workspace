# Planner Spec Generation & Healing: Runtime Guide

**Date:** 2026-03-03  
**Workflow:** `workspace-tester/.agents/workflows/planner-spec-generation-healing.md`  
**Scope:** Shell-heavy workflow architecture, missing-command workarounds, Codex vs OpenClaw runtime options, Chromium-only execution

---

## 1. How the Shell-Heavy Workflow Works

### 1.1 Overview

The planner-spec-generation-healing workflow is a **shell-heavy** design: orchestration logic lives in Node.js and shell scripts; the workflow markdown is a thin reference. This enables deterministic, CI/CD-friendly execution without requiring an AI agent at runtime.

### 1.2 Entry Layer: Shell Scripts

All entry points are thin bash scripts that delegate to `runner.mjs`:

```
workspace-tester/src/tester-flow/
├── common.sh          # Sets RUNNER_PATH, WORKSPACE_TESTER_ROOT
├── run_r0.sh          # node runner.mjs r0 "$@"
├── run_phase0.sh      # node runner.mjs phase0 "$@"
├── run_phase1.sh      # node runner.mjs phase1 "$@"
├── run_phase2.sh      # node runner.mjs phase2 "$@"
├── run_phase3.sh      # node runner.mjs phase3 "$@"
├── run_phase4.sh      # node runner.mjs phase4 "$@"
├── run_phase5.sh      # node runner.mjs phase5 "$@"
└── run_full_flow.sh   # node runner.mjs full "$@"
```

Each script sources `common.sh` and runs `node "${RUNNER_PATH}" <command> "$@"`.

### 1.3 Orchestrator: runner.mjs

`runner.mjs` is the Node.js orchestrator. It:

- Parses CLI args (`--work-item-key`, `--execution-mode`, `--generator-cmd`, `--healer-cmd`, `--notify-cmd`)
- Implements commands: `r0`, `phase0`, `phase1`, `phase2`, `phase3`, `phase4`, `phase5`, `full`
- Runs phases in sequence and persists state

**`full` command flow:**

```
commandFull(args) →
  commandR0(...)        # Intent normalization, planner artifacts
  commandPhase0(...)    # Idempotency gate, mode gate
  commandPhase1(...)    # Intake + manifest
  commandPhase2(...)    # Generation (PLAYWRIGHT_GENERATOR_CMD or fallback)
  commandPhase3(...)    # Execution (npx playwright test)
  commandPhase4(...)    # Healing (PLAYWRIGHT_HEALER_CMD or skip)
  commandPhase5(...)    # Finalize + notification (FEISHU_NOTIFY_CMD or store in run.json)
```

### 1.4 Phase Logic Summary

| Phase | What it does |
|-------|--------------|
| **R0** | Resolves intent (work-item-key), checks planner artifacts, optionally runs `PLANNER_PRESOLVE_CMD`, sets execution mode |
| **Phase 0** | Idempotency via `classifyReportState()` (FINAL_EXISTS/DRAFT_EXISTS/CONTEXT_ONLY/FRESH), mode gate, framework profile |
| **Phase 1** | Copies specs into intake dir, builds manifest via `manifest_builder.mjs`, writes `spec_manifest.json` |
| **Phase 2** | For each spec in manifest: runs `PLAYWRIGHT_GENERATOR_CMD` (or fallback stub), retries once on failure |
| **Phase 3** | Runs `npx playwright test --project=chromium` (or `PLAYWRIGHT_TEST_PROJECT` / `--project`) on generated specs, collects failures into `failed_specs` |
| **Phase 4** | Healing loop: runs `PLAYWRIGHT_HEALER_CMD` on failed specs, re-runs tests with Chromium-only, max 3 rounds |
| **Phase 5** | Writes `execution-summary.md`, sends Feishu notification (or stores in `notification_pending` on failure) |

### 1.5 State Management

- **state_io.mjs**: Load/save `task.json` and `run.json` under `memory/tester-flow/runs/<work_item_key>/`
- **validate_inputs.mjs**: Normalizes execution mode, resolves plan inputs, seed handling
- **manifest_builder.mjs**: Walks intake `.md` files, builds `spec_manifest.json` with source→target mapping

### 1.6 Single Command Execution

```bash
cd workspace-tester
src/tester-flow/run_full_flow.sh --work-item-key BCIN-6709 --execution-mode planner_first
```

This runs the full pipeline without an agent: R0 → Phase 0–5 in one process, with state persisted between phases.

---

## 2. Built-in Behavior When Commands Are Missing (Codex / Standalone)

### 2.1 Default Behavior

The runner has built-in fallbacks when env vars or CLI flags are not set:

| Command | Env Var | CLI Flag | When Unset | Behavior |
|---------|---------|----------|------------|----------|
| **Generator** | `PLAYWRIGHT_GENERATOR_CMD` | `--generator-cmd` | Empty | Uses `writeFallbackGeneratedSpec()` → writes stub `.spec.ts` with `expect(true).toBe(true)` |
| **Healer** | `PLAYWRIGHT_HEALER_CMD` | `--healer-cmd` | Empty | `invokeHealer` returns success → healing is skipped (no-op) |
| **Notification** | `FEISHU_NOTIFY_CMD` | `--notify-cmd` | Empty | Stores payload in `run.json.notification_pending` instead of sending |

### 2.2 How to Fix in Codex (Using Codex Agents)

To get real generation and healing when running in Codex:

#### Option A: Set Environment Variables

```bash
export PLAYWRIGHT_GENERATOR_CMD="codex run playwright-test-generator -- ..."
export PLAYWRIGHT_HEALER_CMD="codex run playwright-test-healer -- ..."
export FEISHU_NOTIFY_CMD="node path/to/send-feishu.mjs"
```

**Note:** Codex agents are interactive; the exact `codex run` invocation may need a wrapper script that constructs the task prompt from env vars and passes it to the agent.

#### Option B: Pass Commands via CLI Flags

```bash
src/tester-flow/run_full_flow.sh \
  --work-item-key BCIN-6709 \
  --generator-cmd "codex run playwright-test-generator -- 'Generate spec from SOURCE_MARKDOWN=$SOURCE_MARKDOWN to TARGET_SPEC_PATH=$TARGET_SPEC_PATH'" \
  --healer-cmd "codex run playwright-test-healer -- 'Heal FAILED_SPECS=$FAILED_SPECS'" \
  --notify-cmd "node scripts/send-feishu.mjs"
```

#### Option C: Wrapper Scripts

Create wrapper scripts that invoke Codex agents with the correct context:

**`workspace-tester/src/tester-flow/scripts/invoke-generator-codex.sh`:**

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
codex run playwright-test-generator -- \
  "Generate a Playwright spec from SOURCE_MARKDOWN=$SOURCE_MARKDOWN, write to TARGET_SPEC_PATH=$TARGET_SPEC_PATH. Seed: $SEED_REFERENCE. Framework profile: $FRAMEWORK_PROFILE_PATH. Working dir: projects/library-automation."
```

Then:

```bash
export PLAYWRIGHT_GENERATOR_CMD="workspace-tester/src/tester-flow/scripts/invoke-generator-codex.sh"
```

### 2.3 Verifying Codex Agent Integration

| Check | Command / Action |
|-------|------------------|
| Codex agents exist | `codex agents list` or verify `.codex/agents/playwright-test-*.toml` |
| Multi-agent enabled | `codex features list` → `multi_agent` enabled |
| Run with fallback | `run_full_flow.sh --work-item-key X` → stub specs generated, flow completes |
| Run with generator | Set `PLAYWRIGHT_GENERATOR_CMD`, run Phase 2 → real `.spec.ts` files |
| Run with healer | Set `PLAYWRIGHT_HEALER_CMD`, run Phase 4 with failing specs → healer invoked |

---

## 3. How to Fix the Problem in OpenClaw

### 3.1 The Gap

OpenClaw uses `sessions_spawn` to delegate to subagents. The runner expects `PLAYWRIGHT_GENERATOR_CMD` and `PLAYWRIGHT_HEALER_CMD` as CLI commands. OpenClaw agents cannot "set env vars" for a subprocess in the same way—they spawn subagents with task strings.

### 3.2 Architecture: Run Workflow Inside Tester Agent

Run the planner-spec-generation-healing workflow **inside** the OpenClaw Tester agent (qa-test), and delegate Phase 2/4 to subagents instead of env-based commands:

```
User → Master → Tester (qa-test)
                    │
                    ├─ Phase 0–1: run shell scripts (run_phase0.sh, run_phase1.sh)
                    ├─ Phase 2: sessions_spawn → playwright-test-generator (per spec)
                    ├─ Phase 3: exec npx playwright test
                    ├─ Phase 4: sessions_spawn → playwright-test-healer
                    └─ Phase 5: run script + Feishu
```

### 3.3 Register Specialist Agents in OpenClaw

Add to `~/.openclaw/openclaw.json` (or equivalent config):

```json5
"playwright-test-generator": {
  workspace: "./workspace-tester/projects/library-automation",
  model: "github-copilot/claude-sonnet-4.5",
  systemPromptOverride: [
    { path: "./workspace-tester/projects/library-automation/.claude/agents/playwright-test-generator.md" }
  ],
  skillsAllowlist: ["mcporter", "read", "write", "grep", "glob"]
},
"playwright-test-healer": {
  workspace: "./workspace-tester/projects/library-automation",
  model: "github-copilot/claude-sonnet-4.5",
  systemPromptOverride: [
    { path: "./workspace-tester/projects/library-automation/.claude/agents/playwright-test-healer.md" }
  ],
  skillsAllowlist: ["mcporter", "read", "write", "edit", "grep", "glob"]
},
"playwright-test-planner": {
  workspace: "./workspace-tester/projects/library-automation",
  model: "github-copilot/claude-sonnet-4.5",
  systemPromptOverride: [
    { path: "./workspace-tester/projects/library-automation/.claude/agents/playwright-test-planner.md" }
  ],
  skillsAllowlist: ["mcporter", "read", "write", "grep", "glob"]
}
```

### 3.4 MCP via mcporter

The playwright-test agents use MCP tools (`mcp__playwright-test__*`). In OpenClaw, use the **mcporter** skill:

```bash
mcporter config add playwright-test --stdio "npx playwright run-test-mcp-server"
```

Agents can then call tools via mcporter:

```bash
mcporter call playwright-test.generator_setup_page url="https://..."
mcporter call playwright-test.generator_write_test file="path/to/spec.ts" content="..."
```

### 3.5 Tester Agent Workflow (NLG-Style)

Update the Tester agent's AGENTS.md so Phase 2/4 use `sessions_spawn`:

**Phase 2 (Generation):**

```
For each spec in memory/tester-flow/runs/<work_item_key>/context/spec_manifest.json:
  1. Read spec.source_path, spec.target_spec_path, and the markdown content
  2. sessions_spawn to playwright-test-generator with task:
     "Generate a Playwright spec from SOURCE_MARKDOWN=<abs_path>, write to TARGET_SPEC_PATH=<abs_path>.
      Seed: <from **Seed:** in markdown>. Framework profile: .agents/context/framework-profile.json.
      Working dir: projects/library-automation."
  3. Wait for subagent completion
  4. Verify target .spec.ts exists
```

**Phase 4 (Healing):**

```
If state.run.failed_specs is non-empty:
  1. sessions_spawn to playwright-test-healer with task:
     "Heal failing specs: <FAILED_SPECS>. Run dir: <run_dir>. Framework profile: .agents/context/framework-profile.json.
      Run npx playwright test --project=chromium on the failed specs, debug, fix, re-run. Max 3 rounds."
  2. Wait for subagent completion
  3. Re-read failed_specs from run state
```

### 3.6 Tester Agent Skills

Ensure the Tester agent has:

- `sessions_spawn` — delegate to generator/healer
- `mcporter` — if it needs to call MCP tools directly
- `exec` — run shell scripts and `npx playwright test`

---

## 4. Codex vs OpenClaw: How to Verify Each

### 4.1 Decision Matrix

| Runtime | When to Use | Generator/Healer Invocation | Verification |
|---------|-------------|-----------------------------|--------------|
| **Standalone (shell only)** | CI/CD, no agent | Env vars or fallback stubs | `run_full_flow.sh` completes; check `memory/tester-flow/runs/<key>/` |
| **Codex** | Codex multi-agent | `codex run playwright-test-*` via env or wrapper | `codex agents list`; run with `--generator-cmd` |
| **OpenClaw** | Clawdbot/OpenClaw | `sessions_spawn` to specialist agents | Agents registered; Tester spawns subagents |

### 4.2 Verifying Codex Runtime

| Step | Action |
|------|--------|
| 1 | `codex --version` and `codex features list` |
| 2 | Confirm `.codex/agents/playwright-test-generator.toml` (and healer, planner) exist |
| 3 | Run `run_full_flow.sh` without commands → stub specs, flow completes |
| 4 | Set `PLAYWRIGHT_GENERATOR_CMD` to a Codex wrapper, run Phase 2 → real specs |
| 5 | Check `memory/tester-flow/runs/<key>/run.json` for `generated_specs`, `failed_specs` |

### 4.3 Verifying OpenClaw Runtime

| Step | Action |
|------|--------|
| 1 | `openclaw gateway status` |
| 2 | Confirm playwright-test-generator, playwright-test-healer in agent list |
| 3 | Tester agent has `sessions_spawn` in skillsAllowlist |
| 4 | Send task to Master: "Run planner-spec-generation-healing for BCIN-6709" |
| 5 | Master delegates to Tester; Tester runs phases, spawns generator/healer for Phase 2/4 |
| 6 | Check `memory/tester-flow/runs/<key>/` for artifacts |

### 4.4 Vice-Versa Checklist

| If running in... | Ensure... |
|------------------|------------|
| **Codex** | Codex agents (playwright-test-*) are configured; use env vars or `--generator-cmd`/`--healer-cmd` for real generation/healing |
| **OpenClaw** | Specialist agents registered; Tester uses `sessions_spawn` instead of env-based commands; mcporter + MCP configured |
| **Standalone** | No agent required; fallbacks work; optional env vars for custom generator/healer scripts |

---

## 5. Chromium-Only Execution (Mandatory)

### 5.1 Design Requirement

The planner-spec-generation-healing runtime **must** force Chromium-only execution for Phase 3 (baseline execution) and Phase 4 (healing reruns). This ensures:

- Deterministic, single-browser results
- Faster runs (no Firefox/WebKit)
- Consistent behavior for generator/healer agents (MCP and agents assume Chromium)

### 5.2 Implementation

| Mechanism | Value | Where |
|-----------|-------|-------|
| **Default project** | `chromium` | `runner.mjs` — when `PLAYWRIGHT_TEST_PROJECT` and `--project` are unset, use `chromium` |
| **Env override** | `PLAYWRIGHT_TEST_PROJECT=chromium` | Set in shell or CI to enforce |
| **CLI override** | `--project chromium` | Pass to `run_phase3.sh`, `run_phase4.sh`, or `run_full_flow.sh` |

The runner passes `--project=<value>` to `npx playwright test`. Valid project names come from `playwright.config.ts` (e.g. `chromium`, `firefox`, `webkit`, or feature-specific projects like `report-undo-redo`).

### 5.3 Usage

```bash
# Default: Chromium-only (enforced by runner)
src/tester-flow/run_full_flow.sh --work-item-key BCIN-6709

# Explicit override via env
PLAYWRIGHT_TEST_PROJECT=chromium src/tester-flow/run_full_flow.sh --work-item-key BCIN-6709

# Override via CLI (e.g. for a different project)
src/tester-flow/run_full_flow.sh --work-item-key BCIN-6709 --project chromium
```

### 5.4 Generator and Healer Agents

When using playwright-test-generator or playwright-test-healer (Codex or OpenClaw):

- **Generator**: Uses Playwright MCP tools; ensure MCP server runs with Chromium (default for `playwright run-test-mcp-server`).
- **Healer**: Runs `npx playwright test`; pass `--project=chromium` in the healer task or ensure `PLAYWRIGHT_TEST_PROJECT=chromium` in the environment.

### 5.5 Verification

```bash
# Confirm Chromium-only: check that only one browser runs
cd workspace-tester/projects/library-automation
PLAYWRIGHT_TEST_PROJECT=chromium npx playwright test tests/specs/feature-plan/BCIN-6709/ --list
# Output should show tests under the chromium project only
```

---

## 6. Reference

- **Workflow:** `workspace-tester/.agents/workflows/planner-spec-generation-healing.md`
- **Runner:** `workspace-tester/src/tester-flow/runner.mjs`
- **Agent definitions:** `workspace-tester/projects/library-automation/.claude/agents/playwright-test-*.md`
- **Codex config:** `.codex/agents/playwright-test-*.toml`
- **MCP config:** `workspace-tester/projects/library-automation/.mcp.json`
