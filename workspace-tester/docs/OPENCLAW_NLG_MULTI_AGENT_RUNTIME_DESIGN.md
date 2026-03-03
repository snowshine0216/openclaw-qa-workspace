# OpenClaw NLG Multi-Agent Runtime Design

## Summary

This document defines a decision-complete runtime design for planner to generation to execution to healing with:

1. OpenClaw orchestration via `sessions_spawn` subagents in Phase 2 and Phase 4.
2. Codex orchestration via existing runner hook commands and wrapper scripts.
3. Canonical state and path compliance under `workspace-tester/.agents` and `workspace-tester/memory/tester-flow/runs/*`.
4. Reuse of existing subagent prompts in `projects/library-automation/.claude/agents/` and existing framework profile.

## Locked Decisions

1. Scope is full design package.
2. Codex integration uses wrapper commands via runner hooks.
3. OpenClaw subagent capability reuses existing prompts/profile without creating a new skill package.

## Canonical Paths

All paths are resolved from `workspace-tester/`.

1. Workflow root: `.agents/workflows/`
2. Runtime entrypoints: `src/tester-flow/`
3. Run state root: `memory/tester-flow/runs/<work_item_key>/`
4. Intake specs root: `projects/library-automation/specs/feature-plan/<work_item_key>/`
5. Generated specs root: `projects/library-automation/tests/specs/feature-plan/<work_item_key>/`
6. Framework profile: `projects/library-automation/.agents/context/framework-profile.json`
7. OpenClaw subagent prompts:
   - `projects/library-automation/.claude/agents/playwright-test-planner.md`
   - `projects/library-automation/.claude/agents/playwright-test-generator.md`
   - `projects/library-automation/.claude/agents/playwright-test-healer.md`

## Orchestration Design

### OpenClaw Runtime

1. Phase R0:
   - Normalize `feature-id` or `issue-key` to `work_item_key`.
   - Validate planner artifacts existence.
   - If missing, run planner pre-step by spawning planner subagent using NLG template.
2. Phase 0:
   - Enforce mode gate and idempotency classification.
   - Persist state to canonical `task.json` and `run.json`.
3. Phase 1:
   - Build intake and deterministic `spec_manifest.json`.
4. Phase 2:
   - For each manifest item, spawn `playwright-test-generator` subagent.
   - Pass `SOURCE_MARKDOWN`, `TARGET_SPEC_PATH`, `SEED_REFERENCE`, `FRAMEWORK_PROFILE_PATH`, `RUN_DIR`, `WORK_ITEM_KEY`.
   - Retry failed generation once per item.
5. Phase 3:
   - Execute generated specs with Chromium-only project and retries disabled.
6. Phase 4:
   - If `failed_specs` is non-empty, spawn `playwright-test-healer` with failed list.
   - Re-run failed set only after each heal round.
   - Stop when pass-all or at round 3.
   - Write `healing_report.md` if unresolved after round 3.
7. Phase 5:
   - Finalize summary.
   - Send Feishu notification.
   - On failure, write full payload to `run.json.notification_pending`.

### Codex Runtime

Use existing runner hook contracts in `runner.mjs`:

1. Planner hook:
   - `PLANNER_PRESOLVE_CMD` or `--planner-presolve-cmd`
2. Generator hook:
   - `PLAYWRIGHT_GENERATOR_CMD` or `--generator-cmd`
3. Healer hook:
   - `PLAYWRIGHT_HEALER_CMD` or `--healer-cmd`
4. Notification hook:
   - `FEISHU_NOTIFY_CMD` or `--notify-cmd`
5. Browser project:
   - default `PLAYWRIGHT_TEST_PROJECT=chromium` (or `--project chromium`)

Codex wrapper scripts must map hook inputs to specialist agents and return non-zero on failure.

## Interface Contracts

### Generator Contract

Required environment inputs:

1. `WORK_ITEM_KEY`
2. `SOURCE_MARKDOWN`
3. `TARGET_SPEC_PATH`
4. `SEED_REFERENCE`
5. `FRAMEWORK_PROFILE_PATH`
6. `RUN_DIR`

Success condition:

1. Exit code 0.
2. Spec created at `TARGET_SPEC_PATH`.

### Healer Contract

Required environment inputs:

1. `WORK_ITEM_KEY`
2. `FAILED_SPECS` (comma-separated)
3. `FRAMEWORK_PROFILE_PATH`
4. `RUN_DIR`

Success condition:

1. Exit code 0 for completed healing attempt.
2. Subsequent phase rerun updates `failed_specs`.

### Planner Presolve Contract

Required environment input:

1. `WORK_ITEM_KEY`

Success condition:

1. Planner artifacts exist after presolve:
   - `../workspace-planner/projects/feature-plan/<work_item_key>/qa_plan_final.md`
   - `../workspace-planner/projects/feature-plan/<work_item_key>/specs/`

## State Compatibility Requirements

No schema-breaking change is introduced.

Required persisted controls:

1. `task.json.execution_mode`
2. `task.json.pre_route_status`
3. `task.json.healing.max_rounds=3`
4. `run.json.pre_route_decision_log`
5. `run.json.generated_specs`
6. `run.json.failed_specs`
7. `run.json.notification_pending` fallback

## Quality Gates

1. OpenClaw design must apply idempotency controls in Phase 0.
2. Design must be reviewed by `openclaw-agent-design-reviewer`.
3. Review status must be `pass` or `pass_with_advisories`.
4. If status is `fail`, redesign and re-review until passing status.

## Risks and Mitigations

1. Hook and subagent contract drift:
   - Mitigation: treat hook env keys as single source of truth.
2. Missing framework profile:
   - Mitigation: enforce preflight profile generation before generation/healing.
3. Subagent timeout/hang:
   - Mitigation: bounded retries, phase-level failure reporting, unresolved artifact output.
4. Notification delivery failures:
   - Mitigation: always persist `notification_pending` with full payload.

## Implementation Scope for Documented Change Set

1. Update `.agents/workflows/planner-spec-generation-healing.md` with explicit NLG spawn guidance for Phase 2 and Phase 4.
2. Update `workspace-tester/AGENTS.md` to codify NLG subagent orchestration path.
3. Add Codex wrapper scripts under `src/tester-flow/scripts/` for planner/generator/healer.
4. Keep existing `.claude/agents/playwright-test-*.md` prompts and framework profile as reusable assets.
