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

### Phase 0 — Idempotency check and runtime script deployment
### Phase 1 — Context gathering (`qa-plan-write` in `mode=context`)
### Phase 2 — Unified QA-plan writing (`qa-plan-write` in `mode=write-plan`)
### Phase 3 — Unified QA-plan review (`qa-plan-review`)
### Phase 4 — Deterministic QA-plan refactor (`qa-plan-refactor`)
### Phase 5 — Finalize + Feishu notify

## Stage artifacts

Each phase hands off a saved artifact, not just a status message:

- Phase 0: `task.json`, `run.json`, deployed scripts in `projects/feature-plan/scripts/`
- Phase 1: `context/qa_plan_*_<id>.md`
- Phase 2: `drafts/qa_plan_v<N>.md`
- Phase 3: `context/review_qa_plan_<id>.md`
- Phase 4: `drafts/qa_plan_v<N+1>.md`
- Phase 5: `qa_plan_final.md`

## Runtime scripts

| Script | Purpose |
|--------|---------|
| `check_resume.sh` | idempotency state check |
| `deploy_runtime_context_tools.sh` | copy helper scripts from the skill into the runtime project |
| `save_context.sh` | save any fetched artifact to `context/` |
| `validate_context.sh` | gate runtime artifacts and plan validation |

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
| `qa-plan-write` | Phase 1, Phase 2 |
| `qa-plan-review` | Phase 3 |
| `qa-plan-refactor` | Phase 4 |
| `jira-cli` | evidence gathering |
| `confluence` | design evidence gathering |
| `github` | PR and boundary evidence gathering |
| `feishu-notify` | Phase 5 notification |
