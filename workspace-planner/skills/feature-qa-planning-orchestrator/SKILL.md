---
name: feature-qa-planning-orchestrator
description: Master orchestrator for feature QA planning. Use for end-to-end QA plan generation across Phase 0 through Phase 8, including canonical testcase structure enforcement, manual executability gates, versioned draft generation, and final publication.
---

# Feature QA Planning Orchestrator

This skill owns the full QA planning workflow.

## Required references

Always use:
- `reference.md`
- `references/canonical-testcase-contract.md`
- `templates/test-case-template.md`

## Core invariants

- Only `EndToEnd` and `Functional` may be renamed.
- All other fixed testcase headings must remain present.
- Manual testcase text must be concrete enough to execute without guessing.
- No phase may silently publish a draft that fails structure or executability validation.

## Required inputs

- `feature_id`
- Jira key and/or equivalent source-of-truth issue reference
- optional Confluence URL
- optional GitHub PR or compare URLs
- optional Figma URL or approved snapshots

## Phase Overview

1. Phase 0 — existing-state check and preparation
2. Phase 1 — context gathering
3. Phase 2 — domain sub testcase generation
4. Phase 3 — domain review
5. Phase 4 — domain refactor
6. Phase 5 — synthesis
7. Phase 6 — consolidated XMind review
8. Phase 7 — final refactor
9. Phase 8 — finalize and notify

## Phase 0 — Preparation

- Load state from `task.json` and `run.json`.
- Preserve the existing `REPORT_STATE` behavior from `reference.md`.
- Ensure `projects/feature-plan/scripts/` exists.
- Deploy these scripts from `scripts/lib/` into the runtime scripts directory:
  - `save_context.sh`
  - `validate_context.sh`
  - `validate_testcase_structure.sh`
  - `validate_testcase_executability.sh`
- Do not auto-select destructive resume options.

## Phase 1 — Context gathering

- Spawn `qa-plan-write` per applicable domain with `mode=context`.
- Require raw evidence to be saved immediately after fetch.
- Stop on missing primary system-of-record access.

## Phase 2 — Domain sub testcase generation

- Spawn `qa-plan-write` per applicable domain with `mode=testcase`.
- Require every domain output to follow the canonical testcase contract.
- Before accepting each domain artifact, require:

```bash
validate_context.sh <feature-id> --validate-testcase-structure "context/sub_test_cases_<domain>_<id>.md"
validate_context.sh <feature-id> --validate-testcase-executability "context/sub_test_cases_<domain>_<id>.md"
```

- If a domain artifact fails validation, the domain agent must rewrite once before the orchestrator accepts it.

## Phase 3 — Domain review

- Spawn `qa-plan-review` with `mode=review` for `jira`, `confluence`, `github`, and `figma` as applicable.
- Require review outputs to use the `ST-*` and `EX-*` taxonomy.
- Review cannot pass if fixed headings are missing or manual steps remain vague.

## Phase 4 — Domain refactor

- Spawn `qa-plan-review` with `mode=refactor` for `atlassian`, `github`, and `figma` as applicable.
- Accept `_v2` outputs only after both validators pass.

## Phase 5 — Synthesis

- Resolve latest per-domain inputs with `validate_context.sh --resolve-sub-testcases`.
- Invoke `qa-plan-synthesize` with the resolved paths.
- Require the synthesized draft to pass structure and executability validation before the phase can complete.
- Fail closed on validation errors; do not continue with a weak Phase 5 draft.

## Phase 6 — Consolidated XMind review

- Invoke `qa-plan-review` with `mode=consolidated` on the synthesized draft.
- Require the review artifact to include validator output and the `ST-*` / `EX-*` taxonomy.
- If the consolidated review fails, phase output is `review_consolidated_<id>.md` plus required refactors.

## Phase 7 — Final refactor

- Invoke `qa-plan-refactor` using `review_consolidated_<id>.md`.
- Re-run both validators on the new draft.
- Allow at most one retry after the initial refactor pass.
- If the draft still fails validation, stop and report the remaining blockers.

## Phase 8 — Finalize + notify

- Ask the user for final approval before promoting the draft to `test_key_points_xmind_final.md`.
- Archive the prior final artifact before overwrite.
- Notify via `feishu-notify` after finalization.

## Completion gate

Do not finalize the workflow unless all of the following are true:
- required headings are present
- only `EndToEnd` and `Functional` were renamed
- all fixed headings remain present
- non-applicable fixed headings use `N/A — <reason>`
- manual cases are concrete enough to execute
