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
- `artifact_lookup_<feature-id>.md` under `context/`
- versioned draft QA plans under `drafts/` (`qa_plan_subcategory`, `qa_plan_v1`, `qa_plan_v2`, `qa_plan_v3`)
- phase spawn manifests under the project root
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

## Phase-to-Reference Mapping

Each spawned subagent receives explicit instructions in its task text to read these files before starting.

| Phase   | References                                                                                                                       | Purpose                                                  |
| ------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Phase 1 | `reference.md`, `references/context-coverage-contract.md`                                                                          | Source routing, approved collection paths                |
| Phase 3 | `references/context-coverage-contract.md`, `references/context-index-schema.md`                                                   | Coverage ledger rules, artifact lookup structure         |
| Phase 4a | `references/qa-plan-contract.md`, `references/executable-step-rubric.md`, `templates/qa-plan-template.md`                         | XMindMark structure, executable steps, scaffold          |
| Phase 4b | Same as 4a                                                                                                                        | Top-category grouping                                    |
| Phase 5 | `references/review-rubric.md`, `references/qa-plan-contract.md`, `references/executable-step-rubric.md`                          | Review inputs/outputs, blocking findings, refactor rules |
| Phase 6 | `references/executable-step-rubric.md`, `references/review-rubric.md`, `references/e2e-coverage-rules.md`, `templates/qa-plan-template.md` | Quality pass, E2E minimum, format rules                  |
