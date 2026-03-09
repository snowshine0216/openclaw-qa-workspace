# Feature QA Planning Orchestrator

> **Skill path:** `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`
> **Last Updated:** 2026-03-09

## What it does

Give it a feature ID plus Jira, Confluence, GitHub, and optional UX evidence, and it produces:

| Output | What it is |
|--------|------------|
| `context/qa_plan_*_<id>.md` | saved Phase 1 evidence summaries |
| `drafts/qa_plan_v<N>.md` | unified QA-plan draft |
| `context/review_qa_plan_<id>.md` | saved Phase 3 review artifact |
| `qa_plan_final.md` | approved final QA plan |

## Phase overview

| Phase | Action | Who |
|-------|--------|-----|
| 0 | Idempotency check and runtime script deployment | Orchestrator |
| 1 | Context gathering — **spawns subagents** per source (atlassian, github, figma) | Orchestrator spawns |
| 2 | Write — 2 steps (scenarios+test cases → group+priority). XMindMark via **markxmind** | Orchestrator (internal) |
| 3 | Review draft against contract | Orchestrator (internal) |
| 4 | Refactor — apply review findings | Orchestrator (internal) |
| 5 | Finalize + Feishu notify | Orchestrator + feishu-notify |

**Workflow note**: Phase 1 spawns subagents to collect context. Phases 2–4 are done internally by the orchestrator (no qa-plan-write, qa-plan-review, qa-plan-refactor spawns). The orchestrator decides how many review→refactor rounds (may loop until satisfied or max retries).

## Stage artifacts

Each phase hands off a saved artifact, not just a status message:

- Phase 0: `task.json`, `run.json`, deployed scripts in `projects/feature-plan/scripts/`
- Phase 1: `context/qa_plan_*_<id>.md`
- Phase 2: `drafts/qa_plan_v<N>.md`
- Phase 3: `context/review_qa_plan_<id>.md`
- Phase 4: `drafts/qa_plan_v<N+1>.md`
- Phase 5: `qa_plan_final.md`

## Runtime scripts

Phase 0 assumes a working `node` executable (markxmind validator requires it).

| Script | Purpose |
|--------|---------|
| `check_resume.sh` | idempotency state check |
| `deploy_runtime_context_tools.sh` | copy helper scripts into the runtime project |
| `save_context.sh` | save any fetched artifact to `context/` |

**Validation**: XMindMark structure only — run `node .agents/skills/markxmind/scripts/validate_xmindmark.mjs <path>` after Phase 2 and after each Phase 4 refactor. No other checks.

## Quality bar

The final plan should read like `docs/BCIN-6709_qa_plan.md`:

- structured
- concise
- easy to understand
- grouped by user-facing behavior
- source-backed without reading like source silos

## Related skills

| Skill | Used in |
|-------|---------|
| `markxmind` | Phase 2 — XMindMark output |
| `qa-plan-atlassian`, `qa-plan-github`, `qa-plan-figma` | Phase 1 — spawned subagents for context |
| `jira-cli` | evidence gathering (via Phase 1 subagents) |
| `confluence` | design evidence gathering |
| `github` | PR and boundary evidence gathering |
| `feishu-notify` | Phase 5 notification |

**Deprecated for this workflow**: `qa-plan-write`, `qa-plan-review`, `qa-plan-refactor` — orchestrator performs write, review, refactor internally.
