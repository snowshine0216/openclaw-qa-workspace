# QA Plan Unified Workflow Redesign

## Summary

This redesign changes QA-plan generation from a domain-subtestcase plus synthesis workflow into an artifact-first unified writing workflow.

Target output quality is the acceptance artifact:
- `docs/BCIN-6709_qa_plan.md`

The final QA plan should be:
- structured
- concise
- easy to understand
- grouped by user-facing behavior
- backed by saved evidence

## Workflow

1. Phase 0: idempotency check and runtime script deployment
2. Phase 1: gather and save all artifacts
3. Phase 2: write one unified QA plan from saved artifacts
4. Phase 3: review the unified draft
5. Phase 4: apply deterministic refactor fixes
6. Phase 5: finalize after approval

`qa-plan-synthesize` is not part of this workflow.

## Skill roles

### `feature-qa-planning-orchestrator`

- own phase order and gating
- deploy runtime helper scripts into `projects/feature-plan/scripts/`
- fail if runtime copies are missing
- require validation after draft writing and refactor

### `qa-plan-write`

- `mode=context`: gather and save Jira, Confluence, GitHub, Figma, and background artifacts
- `mode=write-plan`: write the full QA plan directly from saved artifacts
- use sources intentionally:
  - Confluence: main flow
  - Jira: fixtures and missing coverage
  - GitHub: boundary conditions and code-sensitive risk
  - Figma: wording and visible state

### `qa-plan-review`

- review the unified draft for:
  - section preservation
  - coverage
  - executability
  - simplicity
  - wording quality

### `qa-plan-refactor`

- apply only review findings
- preserve valid content
- revalidate after rewrite

## Required section contract

The final QA plan keeps these semantic sections in order:

1. `EndToEnd`
2. `Functional - Pause Mode`
3. `Functional - Running Mode`
4. `Functional - Modeling Service Non-Crash Path`
5. `Functional - MDX / Engine Errors`
6. `Functional - Prompt Flow`
7. `xFunctional`
8. `UI - Messaging`
9. `Platform`

Small heading adjustments are allowed only when the section still maps clearly to the same semantic bucket.

If a section is not needed, keep it and mark it:
- `N/A — <reason>`

## Runtime deployment

Canonical helper scripts stay in:
- `workspace-planner/skills/feature-qa-planning-orchestrator/scripts/lib/`

Runtime copies are required in:
- `workspace-planner/projects/feature-plan/scripts/`

Deployment is handled by:
- `deploy_runtime_context_tools.sh`

Copied scripts:
- `save_context.sh`
- `validate_context.sh`
- `validate_testcase_structure.sh`
- `validate_testcase_executability.sh`

## Acceptance criteria

- The workflow no longer depends on synthesis.
- The unified writer produces a QA plan shaped like `docs/BCIN-6709_qa_plan.md`.
- Missing sections fail review or validation.
- Unsaved background research is not allowed to influence the draft.
- Runtime helper scripts are copied into the workspace project before use.
- Review and refactor are narrower and deterministic.
