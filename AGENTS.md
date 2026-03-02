# Codex Workspace AGENTS

This repository is configured for Codex multi-agent execution with reusable skills and playbook-driven workflows.

## Scope Rules

- Use this file as the root instruction set for work launched from repository root.
- If a deeper `AGENTS.md` exists in a subdirectory, that deeper file overrides this one for that subtree.
- Treat `.cursor` as source-of-truth for specialist prompts and command playbooks.

## Specialist Agents

Use these specialists from `.codex/config.toml`:

1. `openclaw-agent-designer`
- Purpose: design OpenClaw agents/workflows.
- Mandatory skill: `$openclaw-agent-design`.
- Mandatory process: Phase 0 must pass `$agent-idempotency` review before finalization.

2. `playwright-test-planner`
- Purpose: explore UI and create comprehensive plan docs.
- Canonical workflow: `.cursor/agents/playwright-test-planner.md`.

3. `playwright-test-generator`
- Purpose: generate Playwright specs from approved plans.
- Canonical workflow: `.cursor/agents/playwright-test-generator.md`.

4. `playwright-test-healer`
- Purpose: debug and fix failing Playwright tests.
- Canonical workflow: `.cursor/agents/playwright-test-healer.md`.

5. `wdio-to-playwright-check`
- Purpose: run WDIO→Playwright migration quality checks and orchestrate healing.
- Canonical workflow: `workspace-tester/projects/library-automation/.agents/workflows/script-migration-quality-check.md`.

## Orchestration Contract

For test automation work, orchestrate in strict order unless explicitly overridden:

1. `playwright-test-planner` outputs plan markdown.
2. `playwright-test-generator` consumes plan and outputs spec(s).
3. `playwright-test-healer` executes and fixes failing spec(s), with max 3 rounds.

For migration quality-check work:

1. `wdio-to-playwright-check` runs the quality dimensions and execution gate.
2. On execution failures, `wdio-to-playwright-check` invokes `playwright-test-healer` (max 3 rounds).
3. `wdio-to-playwright-check` re-runs phase tests after each round and updates progress artifacts.

Handoff rules:
- Planner must provide exact plan artifact path.
- Generator must record generated spec path(s).
- Healer must output pass result or healing report path if max rounds exhausted.
- WDIO quality-check agent must output:
  - quality report artifact path
  - `migration/self-healing/<family>/<phase>/progress.md` path (if healer invoked)
  - final healer outcome (pass or `healing_report.md` path)

## Skills Loading Model

- Project skills are loaded from `.agents/skills`.
- `.agents/skills` contains symlinks to `.cursor/skills/*` and wrapper skills for playwright specialist docs.
- Reuse existing skills before creating duplicate instructions.

## Command Playbooks (.cursor/commands)

Treat each file below as a reusable playbook. Select the closest match by user intent and follow it as procedural guidance.

1. `.cursor/commands/add-a-small-feature.md`
2. `.cursor/commands/create-tests.md`
3. `.cursor/commands/explain-code.md`
4. `.cursor/commands/explain-to-nontech.md`
5. `.cursor/commands/fix-bugs.md`
6. `.cursor/commands/get-employable.md`
7. `.cursor/commands/instant-ship.md`
8. `.cursor/commands/learn-things.md`
9. `.cursor/commands/logs-metrics-review.md`
10. `.cursor/commands/performance-review.md`
11. `.cursor/commands/review-pr.md`
12. `.cursor/commands/rewrite-requirements.md`
13. `.cursor/commands/scability-review.md`
14. `.cursor/commands/switch-context.md`
15. `.cursor/commands/write-documentation.md`

## Quality Gates

- Do not silently skip required specialist steps.
- Do not bypass idempotency checks for OpenClaw workflow design.
- For Playwright healing, do not exceed 3 rounds; write a healing report on unresolved failures.
- Always return artifact paths for plan/spec/healing outputs.
