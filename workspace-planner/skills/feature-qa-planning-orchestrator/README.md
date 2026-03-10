# Feature QA Planning Orchestrator

> **Skill path:** `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`
> **Last Updated:** 2026-03-10

## What it does

Given a feature ID plus requested evidence sources, this skill produces a resumable, reviewable QA-plan workflow with:

- saved evidence under `context/`
- normalized planning artifacts under `context/`
- versioned draft QA plans under `drafts/`
- a promoted `qa_plan_final.md` only after user approval

## Workflow

| Phase | Action | Owner |
|-------|--------|-------|
| 0 | Runtime preparation and existing-state check | Orchestrator |
| 1 | Evidence gathering | Orchestrator + source-bounded helpers |
| 2 | Context normalization | Orchestrator + source-bounded helpers |
| 3 | Coverage mapping | Orchestrator + optional coverage helper |
| 4 | Unified draft writing | Orchestrator |
| 5 | Structured review | Orchestrator |
| 6 | Deterministic refactor | Orchestrator |
| 7 | Finalization | Orchestrator + user approval |

## Key artifacts

- `context/context_index_<feature-id>.md`
- `context/coverage_ledger_<feature-id>.md`
- `context/coverage_gaps_<feature-id>.md`
- `context/e2e_journey_map_<feature-id>.md`
- `context/review_qa_plan_<feature-id>.md`
- `context/review_delta_<feature-id>.md`
- `drafts/qa_plan_v<N>.md`
- `qa_plan_final.md`

## Runtime helpers

Deployed into `projects/feature-plan/scripts/` by `deploy_runtime_context_tools.sh`:

- `save_context.sh`
- `validate_context.sh`
- `validate_testcase_structure.sh`
- `qaPlanValidators.mjs`
- `validate_plan_artifact.mjs`

## Contract docs

- `reference.md` — runtime state, artifact, and validator contract
- `references/qa-plan-contract.md` — hard QA-plan contract
- `references/context-coverage-contract.md` — source-to-coverage rules
- `references/executable-step-rubric.md` — manual-step executability rules
- `references/review-rubric.md` — review contract and verdict rules
- `references/context-index-schema.md` — context-index schema
- `references/e2e-coverage-rules.md` — E2E minimum rules
- `docs/DOCS_GOVERNANCE.md` — doc freshness and sync rules
