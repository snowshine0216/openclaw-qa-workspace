# Codex Multi-Agent Setup and Smoke Verification

Date: 2026-03-01
Workspace: `/Users/xuyin/Documents/Repository/openclaw-qa-workspace`

## 1. Goal

Implement and validate:

1. An `openclaw-agent` specialist flow using `.cursor/skills/openclaw-agent-design`.
2. Playwright specialists using:
- `.cursor/agents/playwright-test-planner.md`
- `.cursor/agents/playwright-test-generator.md`
- `.cursor/agents/playwright-test-healer.md`
3. Reuse everything in `.cursor`, and reference all `.cursor/commands/*` as playbooks in AGENTS instructions.

## 2. Sources Used

Official docs:

1. `https://developers.openai.com/codex/skills`
2. `https://developers.openai.com/codex/multi-agent`
3. `https://developers.openai.com/codex/guides/agents-md`

Local source files used:

1. `.cursor/skills/openclaw-agent-design/SKILL.md`
2. `.cursor/agents/playwright-test-planner.md`
3. `.cursor/agents/playwright-test-generator.md`
4. `.cursor/agents/playwright-test-healer.md`
5. `.cursor/commands/*.md` (all 15 command playbooks)

## 3. What Was Implemented

### 3.1 Codex Multi-Agent Config

Created:

1. `.codex/config.toml`
2. `.codex/agents/openclaw-agent-designer.toml`
3. `.codex/agents/playwright-test-planner.toml`
4. `.codex/agents/playwright-test-generator.toml`
5. `.codex/agents/playwright-test-healer.toml`

Configuration decisions:

1. Enabled `features.multi_agent = true`.
2. Declared specialist agents with official `[agents.<name>]` schema using `description` + `config_file`.
3. Used per-agent `developer_instructions` to bind each specialist to required skill/workflow behavior.

### 3.2 Skills Exposure from `.cursor`

Created project skills root:

1. `.agents/skills/`

Linked reusable `.cursor` skills into `.agents/skills` via symlinks, including:

1. `openclaw-agent-design`
2. `agent-idempotency`
3. Other reusable `.cursor/skills/*`

### 3.3 Wrapper Skills for Playwright Agent Specs

Created wrapper skills so Codex can invoke them by skill name:

1. `.agents/skills/playwright-test-planner/SKILL.md`
2. `.agents/skills/playwright-test-generator/SKILL.md`
3. `.agents/skills/playwright-test-healer/SKILL.md`

Each wrapper delegates to canonical `.cursor/agents/*.md` instructions.

### 3.4 Root AGENTS Instructions

Created:

1. `AGENTS.md` at repository root

Includes:

1. Specialist registry and roles.
2. Orchestration contract (`planner -> generator -> healer`).
3. Mandatory idempotency gate for openclaw workflow design.
4. Skills loading model statement (`.agents/skills`).
5. Full playbook references for all `.cursor/commands/*.md`.

## 4. Validation Performed (Completed)

### 4.1 Structure Checks

Passed:

1. `.codex/config.toml` exists and declares 4 specialists.
2. All `config_file` targets in `.codex/config.toml` exist.
3. `.agents/skills` symlinks are valid (no broken symlinks).
4. Wrapper `SKILL.md` files exist for planner/generator/healer.
5. Root `AGENTS.md` includes all 15 `.cursor/commands/*.md` entries (no missing/extra).
6. Specialist bindings (`$openclaw-agent-design`, `$agent-idempotency`, `$playwright-test-*`) are present in config/instructions.

### 4.2 CLI/Feature Checks

Passed:

1. `codex --version` -> `codex-cli 0.106.0`.
2. `codex features list` shows `multi_agent` as enabled in this environment.
3. `codex login status` -> logged in.

## 5. Live Smoke Test Attempt (Runtime)

Attempted command:

```bash
codex exec -C /Users/xuyin/Documents/Repository/openclaw-qa-workspace --json --output-last-message /tmp/codex-smoke-basic.txt "Reply with EXACTLY: SMOKE_BASIC_OK"
```

Observed failure:

1. `failed to refresh available models: Token data is not available`
2. repeated reconnect attempts
3. stream failure endpoint: `https://aicoding.2233.ai/responses`
4. final: `turn.failed` with stream disconnected before completion

Conclusion:

1. Local configuration is in place and structurally valid.
2. Runtime smoke is currently blocked by backend/model stream connectivity in this environment, not by the workspace files.

## 6. How to Verify End-to-End When Connectivity Is Healthy

Run in repo root:

```bash
cd /Users/xuyin/Documents/Repository/openclaw-qa-workspace
codex
```

In Codex session:

1. Run `/agents` and verify these exist:
- `openclaw-agent-designer`
- `playwright-test-planner`
- `playwright-test-generator`
- `playwright-test-healer`

2. Run `/skills` and verify these exist:
- `openclaw-agent-design`
- `agent-idempotency`
- `playwright-test-planner`
- `playwright-test-generator`
- `playwright-test-healer`

3. Execute specialist smoke prompts:
- OpenClaw specialist prompt:
  `Design a new openclaw agent Phase 0 and apply idempotency review before finalizing.`
- Planner prompt:
  `Create a compact test plan for a login page with happy/edge/negative flows.`
- Generator prompt:
  `Generate one Playwright spec from the approved plan.`
- Healer prompt:
  `Run healing workflow on an intentionally broken Playwright selector and stop at max 3 rounds.`

4. Verify expected artifacts and gates:
- Planner returns plan path.
- Generator returns spec path.
- Healer returns pass result or a healing report path after max rounds.
- OpenClaw design flow explicitly references idempotency in Phase 0 handling.

## 7. File Inventory Added

1. `AGENTS.md`
2. `.codex/config.toml`
3. `.codex/agents/openclaw-agent-designer.toml`
4. `.codex/agents/playwright-test-planner.toml`
5. `.codex/agents/playwright-test-generator.toml`
6. `.codex/agents/playwright-test-healer.toml`
7. `.agents/skills/playwright-test-planner/SKILL.md`
8. `.agents/skills/playwright-test-generator/SKILL.md`
9. `.agents/skills/playwright-test-healer/SKILL.md`
10. `.agents/skills/*` symlinks to `.cursor/skills/*`

## 8. Notes

1. This repository already contains unrelated in-progress changes outside this setup scope.
2. No unrelated files were modified by this setup except newly added config/instruction files.
