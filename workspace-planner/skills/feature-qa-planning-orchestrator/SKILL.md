---
name: feature-qa-planning-orchestrator
description: Master orchestrator for feature QA planning. Use for artifact-first QA plan generation across runtime preparation, evidence gathering, unified plan writing, review, deterministic refactor, and final publication.
---

# Feature QA Planning Orchestrator

This skill owns the full QA-plan workflow.

## Required references

Always use:
- `reference.md`
- `references/canonical-testcase-contract.md`
- `templates/qa-plan-template.md`

## Core invariants

- Final output is a unified QA plan, not an XMind synthesis tree.
- Required plan sections must remain present in semantic order.
- Small heading adjustments are allowed only when they still map to the same section intent.
- The final plan should read like `docs/BCIN-6709_qa_plan.md`: structured, concise, and easy to understand.
- Manual steps must be concrete enough to execute without guessing.
- No phase may silently publish a draft that fails structure or executability validation.
- No fetched or background-research artifact may influence the draft before it is saved to `context/`.

## Required inputs

- `feature_id`
- Jira key and/or equivalent source-of-truth issue reference
- optional Confluence URL
- optional GitHub PR or compare URLs
- optional Figma URL or approved snapshots

## Phase overview

1. Phase 0 — existing-state check and runtime preparation
2. Phase 1 — context gathering
3. Phase 2 — unified QA-plan writing
4. Phase 3 — unified QA-plan review
5. Phase 4 — deterministic QA-plan refactor
6. Phase 5 — finalize and notify

## Stage artifact contract

Every phase must leave a deterministic on-disk artifact before the next phase begins:

| Phase | Required artifact(s) |
| --- | --- |
| Phase 0 | current `task.json`, current `run.json`, and deployed runtime scripts under `projects/feature-plan/scripts/` |
| Phase 1 | saved context artifacts under `context/` such as `qa_plan_atlassian_<id>.md`, `qa_plan_github_<id>.md`, `qa_plan_github_traceability_<id>.md`, and `qa_plan_figma_<id>.md` |
| Phase 2 | `drafts/qa_plan_v<N>.md` |
| Phase 3 | `context/review_qa_plan_<id>.md` |
| Phase 4 | `drafts/qa_plan_v<N+1>.md` |
| Phase 5 | `qa_plan_final.md` plus the archived prior final when overwrite occurs |

Do not advance phases on in-memory output alone. Each handoff must reference the saved stage artifact path.

## Phase 0 — Preparation

- Load state from `task.json` and `run.json`.
- Preserve the existing `REPORT_STATE` behavior from `reference.md`.
- Ensure `projects/feature-plan/scripts/` exists.
- Deploy these scripts from `scripts/lib/` into the runtime scripts directory before any other phase uses them:
  - `save_context.sh`
  - `validate_context.sh`
  - `validate_testcase_structure.sh`
  - `validate_testcase_executability.sh`
- Use `scripts/lib/deploy_runtime_context_tools.sh` for the runtime copy step.
- Stop immediately if the runtime directory is missing the deployed scripts after the copy step.
- Do not auto-select destructive resume options.

## Phase 1 — Context gathering

- Spawn `qa-plan-write` per applicable source family with `mode=context`.
- Require raw evidence to be saved immediately after fetch.
- Require background searches to be saved immediately before their results are reused.
- Save per-source summaries and update the evidence manifest.
- Stop on missing primary system-of-record access.

## Phase 2 — Unified QA-plan writing

- Invoke `qa-plan-write` with `mode=write-plan`.
- Pass only saved artifacts and runtime script paths.
- Require the writer to use sources one by one:
  - Confluence for main behavior and flow
  - Jira for repro fixtures and missing coverage
  - GitHub for edge cases, boundaries, automation-only reasoning, and performance-sensitive risks
  - Figma/UX evidence for wording, workflow, and visible-state expectations
- Require the draft to preserve the generalized QA-plan section contract.
- Require the draft to match the quality bar of `docs/BCIN-6709_qa_plan.md`.
- Before accepting the draft, run:

```bash
validate_context.sh <feature-id> --validate-testcase-structure "drafts/qa_plan_v<N>.md"
validate_context.sh <feature-id> --validate-testcase-executability "drafts/qa_plan_v<N>.md"
```

- If validation fails, rewrite once before the orchestrator accepts the draft.

## Phase 3 — Unified QA-plan review

- Invoke `qa-plan-review` with `mode=review`.
- Require the reviewer to save the completed review to `context/review_qa_plan_<feature-id>.md` before Phase 4 starts.
- Review the unified draft against:
  - section preservation
  - coverage
  - simplicity
  - structure
  - wording
  - executability
- Fail the phase if:
  - a required plan section is removed
  - a section becomes too vague to execute
  - saved evidence is missing for a claim used in the draft

## Phase 4 — Deterministic QA-plan refactor

- Invoke `qa-plan-refactor` using the reviewed unified draft.
- Pass the saved review artifact path `context/review_qa_plan_<feature-id>.md` directly; do not infer a review filename from prose.
- Apply only the requested review fixes.
- Re-run both validators on the rewritten draft.
- Allow at most one retry after the initial refactor pass.
- If the draft still fails validation, stop and report the remaining blockers.

## Phase 5 — Finalize + notify

- Ask the user for final approval before promoting the draft to `qa_plan_final.md`.
- Archive the prior final artifact before overwrite.
- Notify via `feishu-notify` after finalization.

## Completion gate

Do not finalize the workflow unless all of the following are true:
- required semantic sections are present
- no section was silently removed
- manual cases are concrete enough to execute
- the draft passed structure validation
- the draft passed executability validation
- all reused evidence was saved to `context/`
- every phase saved its required stage artifact before handoff
