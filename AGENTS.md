# Codex Workspace AGENTS

This repository is configured for Codex multi-agent execution with reusable skills and playbook-driven workflows.

## Scope Rules

- Use this file as the root instruction set for work launched from repository root.
- If a deeper `AGENTS.md` exists in a subdirectory, that deeper file overrides this one for that subtree.
- Treat `.cursor` as source-of-truth for specialist prompts and command playbooks.

## Mandatory Skills
- use `code-quality-orchestrator` for all code quality work.

## Release Metadata Convention

- The canonical checked-in release metadata lives in the repository root:
  - `VERSION`
  - `CHANGELOG.md`
  - `TODOS.md`
- Do not create or maintain competing active copies of these files under `docs/` or workspace subfolders.
- Documentation under `docs/` may link to the root files, but the root files are the source of truth for shipping and review workflows.

## Specialist Agents

Use these specialists from `.codex/config.toml`:

1. `openclaw-agent-designer`
- Purpose: design OpenClaw agents/workflows and existing-agent function refactors in a skill-first way.
- Mandatory skill: `$openclaw-agent-design`.
- Mandatory process: preserve the current Phase 0 / `REPORT_STATE` model, use `$skill-creator` for new or materially redesigned skills, use `$code-structure-quality` for boundary design, and pass `$openclaw-agent-design-review` before finalization.

2. `openclaw-agent-design-reviewer`
- Purpose: review OpenClaw agent/workflow designs before finalization.
- Mandatory skill: `$openclaw-agent-design-review`.
- Mandatory process: P0/P1 findings block approval; reviewer must validate shared-vs-local skill placement, existing Phase 0 / `REPORT_STATE` preservation, and output review report artifacts.


## Orchestration Contract

For OpenClaw agent design work, orchestrate in strict order:

1. `openclaw-agent-designer` drafts/updates design artifacts.
2. `openclaw-agent-design-reviewer` validates skill-first workflow design, shared-vs-local placement, Phase 0 non-regression, path validity, validation evidence, and documentation coverage.
3. If reviewer returns `fail`, loop back to designer until reviewer returns `pass` or `pass_with_advisories`.


Handoff rules:
- OpenClaw designer must provide the design artifact path(s) under review.
- OpenClaw design reviewer must provide:
  - review report markdown artifact path
  - review report json artifact path
  - final status (`pass` | `pass_with_advisories` | `fail`)
- Planner must provide exact plan artifact path.
- Generator must record generated spec path(s).
- Healer must output pass result or healing report path if max rounds exhausted.
- WDIO quality-check agent must output:
  - quality report artifact path
  - `migration/self-healing/<family>/<phase>/progress.md` path (if healer invoked)
  - final healer outcome (pass or `healing_report.md` path)

## Skills Loading Model

- Project skills are loaded from `.agents/skills` (shared/global) and from each `workspace-*/skills` folder (agent-specific).
- `.agents/skills` is the canonical home for shared/global skills (used by multiple agents). Workspaces should reference these via symlinks or thin wrappers instead of duplicating them.
- `workspace-*/skills` folders (e.g. `workspace-planner/skills`, `workspace-reporter/skills`, `workspace-tester/skills`, `workspace-healer/skills`, `workspace-daily/skills`, `workspace/skills`) contain skills that are specific to that agent/workspace.
- For the current mapping of which skills live where (including removals), see `docs/SKILL_FOLDER_REFACTOR_PLAN.md`.
- Reuse existing shared skills before creating new ones; when adding a new skill, decide explicitly whether it should be shared (`.agents/skills`) or workspace-local (`workspace-*/skills`).
- For OpenClaw design work, prefer direct reuse of existing shared skills such as `jira-cli`, `confluence`, and `feishu-notify` before introducing wrappers or duplicate integrations.

## Skill self-improvement

- For **bounded champion-vs-challenger skill evolution** (evidence refresh, eval-gated mutations, iteration cap), use the shared skill at `.agents/skills/qa-plan-evolution/` (`SKILL.md`, `scripts/phase0.sh`–`phase6.sh`).
- To evolve **qa-plan-orchestrator**, use the shared skill `.agents/skills/qa-plan-evolution/` (`SKILL.md`, `reference.md`, `scripts/orchestrate.sh`). Benchmark layout: `workspace-planner/skills/qa-plan-orchestrator/references/qa-plan-benchmark-spec.md` (campaign root: `benchmarks/qa-plan-v2/`).

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
- Do not bypass the OpenClaw design reviewer gate for OpenClaw design tasks.
- Do not finalize OpenClaw design output when reviewer result is `fail`.
- For Playwright healing, do not exceed 3 rounds; write a healing report on unresolved failures.
- Always return artifact paths for plan/spec/healing outputs.

## Plan Artifact Standard

- When creating a plan, do not stop at a high-level outline.
- Plans must be detailed, implementation-ready, and decision-complete.
- Every plan must state the files to change, files to create, expected content changes, and validation expectations.
- Use explicit defaults and assumptions when a design choice must be locked before implementation.
- The Plan / Design should always be structured by Goal -> Required Change for Each Phase. Group all related changes by phase instead of mentioning them all in the end. Good example:
```
# Title
## Overview
## Architecture
### Workflow chart
### Folder structure
## Skills Content Specification (optional)
### 3.x skill-SKILL.md (detailed)
### 4.x skill-reference.md (detailed)
### Functions
## Data Models (optional)
## Functional Design 1
<!-- All related changes for this functional design, must have implementation codes or content of files to be changed -->
## Functional Design 2
<!-- Same as above -->
## Tests
<!-- Stub tests only, no implementation -->
## Evals (when applicable)
## Documentation Changes
### AGENTS.md
### README
## Implementation Checklist
## References
```
