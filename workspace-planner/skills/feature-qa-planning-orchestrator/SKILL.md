---
name: feature-qa-planning-orchestrator
description: Master orchestrator for feature QA planning. Use for artifact-first QA plan generation across runtime preparation, evidence gathering, context normalization, coverage mapping, unified draft writing, structured review, deterministic refactor, and final publication.
---

# Feature QA Planning Orchestrator

This skill owns the full QA-plan workflow.

## Required references

Always use:
- `reference.md`
- `references/qa-plan-contract.md`
- `references/context-coverage-contract.md`
- `references/executable-step-rubric.md`
- `references/review-rubric.md`
- `references/context-index-schema.md`
- `references/e2e-coverage-rules.md`
- `templates/qa-plan-template.md`

## Core invariants

- Final output is a unified QA plan in valid XMindMark.
- `markxmind` is mandatory for final plan structure validation.
- `context/` stores every intermediate artifact needed for resume, review, or later phases.
- `drafts/` stores draft QA plans only.
- No fetched or background-research artifact may influence the draft before it is saved to `context/`.
- Phase 7 is the only user approval checkpoint before promotion to `qa_plan_final.md`.

## Required inputs

- `feature_id`
- one or more requested source families
- Jira key and/or equivalent source-of-truth issue reference when applicable
- optional Confluence URL
- optional GitHub PR or compare URLs
- optional Figma URL or approved snapshots

## Phase overview

1. Phase 0 - runtime preparation and existing-state check
2. Phase 1 - evidence gathering
3. Phase 2 - context normalization
4. Phase 3 - coverage mapping
5. Phase 4 - unified draft writing
6. Phase 5 - structured review
7. Phase 6 - deterministic refactor
8. Phase 7 - finalization

## Artifact persistence rule

Every phase must save its required artifacts before the next phase starts.

- `context/` holds evidence, normalization notes, ledgers, review artifacts, validation results, and finalization records.
- `drafts/` holds candidate QA-plan outputs only.
- `qa_plan_final.md` is promotion-only and must never be used as a scratch draft.

## Sub-agent policy

Spawn is allowed only for bounded, source-scoped, artifact-producing work:
- Phase 1 source collection
- Phase 2 source-family normalization
- Phase 3 coverage-map proposal when context is large
- bounded section-scoped helpers in Phases 4 and 5

These phases remain orchestrator-owned:
- Phase 4 final unified draft writing
- Phase 5 final review verdict
- Phase 6 final refactor acceptance decision
- Phase 7 finalization and promotion

Spawned outputs are invalid until:
- saved under `context/`
- recorded in `task.json.artifacts`
- recorded in `run.json.spawn_history`

## Phase gates

- Phase 0: do not enter Phase 1 unless runtime artifacts exist, `requested_source_families` is non-empty, and runtime blockers are absent.
- Phase 1: do not enter Phase 2 unless every required source family is `retrieved`.
- Phase 2: do not enter Phase 3 unless the context index is structurally valid and classification/E2E rules are satisfied.
- Phase 3: do not enter Phase 4 unless every mandatory coverage candidate is classified.
- Phase 4: do not enter Phase 5 unless draft validation has no blocking failures.
- Phase 5: do not enter Phase 6 unless review verdict is saved as `accept`, `accept_with_advisories`, or `reject`.
- Phase 6: do not enter Phase 7 unless blocking findings are all `resolved`, validation passes, and no mandatory coverage candidate was dropped.
- Phase 7: do not promote unless the user explicitly approves.

## Completion gate

Do not finalize the workflow unless all of the following are true:
- required source evidence is saved to `context/`
- no mandatory coverage candidate was silently dropped
- manual cases are concrete enough to execute
- required validators pass for the current phase
- every phase saved its required artifacts before handoff
