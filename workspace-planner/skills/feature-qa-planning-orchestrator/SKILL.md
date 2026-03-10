---
name: feature-qa-planning-orchestrator
description: Master orchestrator for feature QA planning. Use whenever creating QA plans, test plans, or test strategies from Jira/Confluence/GitHub/Figma evidence. Covers runtime preparation, evidence gathering, context normalization, coverage mapping, unified draft writing, structured review, deterministic refactor, and final publication. Prefer this skill for artifact-first, multi-source QA planning even if the user only says "write a test plan" or "create QA coverage."
---

# Feature QA Planning Orchestrator

This skill owns the full QA-plan workflow.

## Always-read references

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
- Evidence influences the plan only after it is saved under `context/`.
- Phase 7 is the only user approval checkpoint before promotion to `qa_plan_final.md`.
- Runtime state, artifact naming, phase gates, and source-routing rules are owned by `reference.md`, not by this file.

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

## Phase 0 expectations

- Validate requested source families before collection starts.
- Use the approved shared skill path for each source family.
- Do not use browser or generic web fetch for Jira, Confluence, or GitHub primary evidence.
- Browser-based exploration is reserved for Figma or explicitly approved visual exploration.

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

## Writing expectations

- Preserve source-backed scenario granularity through normalization and coverage mapping.
- Do not collapse distinct visible workflows into one umbrella testcase when trigger, outcome, or user risk differs.
- Use review rewrite requests and review delta artifacts to prove Phase 6 changes.

## Runtime contract

For artifact names, phase gates, validator inventory, `task.json`, `run.json`, `runtime_setup`, and structured spawn-history requirements, follow `reference.md`.

## Completion gate

Do not finalize the workflow unless:
- required source evidence is saved to `context/`
- no mandatory coverage candidate was silently dropped
- manual cases are concrete enough to execute
- required validators pass for the current phase
