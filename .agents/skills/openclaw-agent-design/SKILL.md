---
name: openclaw-agent-design
description: Designs OpenClaw agents and agent-function refactors as skill-first packages with preserved Phase 0 state-machine behavior, shared-vs-local skill placement, detailed SKILL.md/reference.md contracts, script inventory plus test-stub requirements, and mandatory reviewer gates. Must consult clawddocs, apply agent-idempotency, use skill-creator for new or materially redesigned skills, use code-structure-quality for skill boundaries, and invoke openclaw-agent-design-review before finalizing.
---

# OpenClaw Agent Design

## Purpose

Design or redesign OpenClaw workflows as complete skill packages. Output is a design artifact, not implementation. Designs must be decision-complete: skill package contents, `SKILL.md`/`reference.md` contracts, script inventory, test layout, and Phase 0 / `REPORT_STATE` compatibility.

## Design Process (Mandatory Steps)

1. **Consult `clawddocs`** — confirm OpenClaw architecture, workspace conventions, integration expectations.
2. **Invoke `agent-idempotency`** — preserve Phase 0 / `REPORT_STATE`, resume behavior, archive-before-overwrite, `task.json` / `run.json` compatibility.
3. **Use `skill-creator`** for each new or materially redesigned skill (shared and workspace-local).
4. **Use `code-structure-quality`** — clean boundaries, direct reuse, side-effect separation.
5. **Invoke `openclaw-agent-design-review`** — resolve all P0/P1 findings before final output.

## Design Doc Template

Every design output must follow this structure. Skills Content Specification, Functions, and Tests (script-bearing) are mandatory when the design creates or materially redesigns skills. Evals is required when skills are in scope.

```markdown
# <Agent Name> — Agent Design

> **Design ID:** `<id>`
> **Date:** YYYY-MM-DD
> **Status:** Draft
> **Scope:** <one-line scope>
>
> **Constraint:** This is a design artifact. Do not implement until approved.

---

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
<!-- Skill evals, benchmarks, or performance validation when the design introduces or materially redesigns skills -->

## Documentation Changes
### AGENTS.md
### README

## Implementation Checklist

## References
```

Detailed templates for each section live in [reference.md](reference.md).

## Key Rules

- **Skill-first**: Workflow entrypoints are skills; NLG phases and shell/Node helpers are supporting mechanisms.
- **Phase 0**: Start every output-writing workflow with the existing-status check. Use `reference.md` for canonical `REPORT_STATE`. Preserve `task.json` / `run.json` semantics; schema changes must be additive and justified.
- **Script-bearing**: A skill is script-bearing if deliverables include `scripts/` or the Script Inventory has scripts. Docs-only skills exempt from script-test requirements.
- **Test layout**: OpenClaw uses `scripts/test/` for script-bearing skills (exception to top-level `tests/`).
- **Never assume**: Stop and ask when context is missing or ambiguous. Never silently choose a destructive path.
- **Shared reuse**: Check direct reuse of `jira-cli`, `confluence`, `feishu-notify` before creating wrappers.
- **Final notification**: If workflow publishes externally visible work, include notification phase and `run.json.notification_pending` fallback.

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

## When Sections Are Required

| Section | Required when |
|---------|---------------|
| Skills Content Specification | Design creates or materially redesigns skills |
| Functions | Script-bearing skill |
| Tests (script-to-test stub table) | Script-bearing skill — every script must have a stub row |
| Evals | Design creates or materially redesigns skills — see `evals/` for skill-creator compatible evals |
| Data Models | task.json / run.json or other schemas in scope |
