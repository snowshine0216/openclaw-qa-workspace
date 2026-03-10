# Feature QA Planning Orchestrator

Human-facing guide for the skill package. This file is intentionally short.

## Start Here

- Skill entrypoint: `SKILL.md`
- Runtime and artifact contract: `reference.md`
- Writer and reviewer rules: `references/*.md`
- Active design/governance docs: `docs/`
- Historical design docs: `docs/archive/`

## What This Skill Produces

- source evidence saved under `context/`
- normalized planning artifacts under `context/`
- versioned draft QA plans under `drafts/`
- a promoted `qa_plan_final.md` only after user approval

## Active Contract Files

- `reference.md`
- `references/qa-plan-contract.md`
- `references/context-coverage-contract.md`
- `references/executable-step-rubric.md`
- `references/review-rubric.md`
- `references/context-index-schema.md`
- `references/e2e-coverage-rules.md`
- `templates/qa-plan-template.md`
- `docs/DOCS_GOVERNANCE.md`

## Runtime Helpers

Deployed by `scripts/lib/deploy_runtime_context_tools.sh`:

- `save_context.sh`
- `validate_context.sh`
- `validate_testcase_structure.sh`
- `qaPlanValidators.mjs`
- `validate_plan_artifact.mjs`
