# Feature QA Planning Orchestrator Remediation Spec

**Date:** 2026-03-10
**Status:** Proposed
**Scope:** `workspace-planner/skills/feature-qa-planning-orchestrator`

## 1. Purpose

This spec defines a focused remediation for the current orchestrator quality gap:

1. Context normalization is too lossy and collapses distinct user workflows into broad capability buckets.
2. Validation proves coverage presence, but not scenario granularity or testcase usefulness.
3. Phase 6 can claim a refactor happened even when the draft, candidate, and final artifacts are unchanged.

The goal is not a broad redesign. The goal is to make the existing workflow reliably preserve source-level testcase detail through normalization, drafting, review, refactor, and promotion.

## 2. Problem Statement

The BCIN-7289 run exposed a repeatable failure mode:

1. Rich source evidence existed for separate save, save as, comments, template, convert, subset, Python, SQL, drill, and error-outcome flows.
2. The normalization layer merged those flows into larger capability families.
3. The draft inherited the merged structure.
4. Review noticed the compression, but the refactor stage did not split the cases back out.
5. Phase 7 promoted the unchanged candidate anyway.

This means the workflow currently optimizes for structural compliance over manual-test usefulness.

## 3. Desired Outcome

After this remediation:

1. Distinct source-backed user workflows remain distinct planning candidates through Phase 3.
2. The coverage ledger maps candidate ids to concrete scenarios, not only to broad families.
3. Phase 5 review must produce explicit rewrite instructions for merged or vague cases.
4. Phase 6 must emit a review delta artifact proving how each blocking or required refactor was resolved.
5. Promotion is blocked when the candidate is unchanged while required refactors remain unresolved.

## 4. Remediation Summary

The remediation has three required changes:

1. Change normalization so it preserves scenario-level planning units.
2. Add a new validator that detects scenario compression and unresolved required rewrites.
3. Strengthen Phase 6 and Phase 7 so promotion requires real testcase splitting and auditable delta artifacts.

This remediation also adds two contract tightenings that should be implemented in the same pass:

4. Strengthen sub-agent spawn rules so source collection is bounded, skill-routed, and artifact-first.
5. Strengthen Phase 0 environment setup so source access is validated through the correct shared skills before any evidence gathering begins.
6. Keep the multi-file reference model, but remove ownership overlap and archive non-authoritative historical docs.

## 5. Normalization Changes

### 5.1 Root cause

The current schema and index encourage "capability family" bullets as the main normalized unit. That is too coarse for QA planning when source evidence contains multiple independent user-visible flows inside the same family.

Examples:

- `save`, `save as`, `comments dialog`, and `set/unset template` should not collapse into one row.
- `subset`, `dataset-origin`, `MDX-origin`, and `cube-origin` creation should not collapse into one row.
- `Mojo-handled error` and `Library-handled error` should not collapse into one row when the visible outcome differs.

### 5.2 Required design change

Add a second normalization layer below capability families:

1. Capability family
2. Scenario unit

Capability families remain useful for grouping, but scenario units become the required traceability object for drafting and validation.

### 5.3 Required artifact changes

Update the context model so Phase 2 and Phase 3 persist both grouping and scenario granularity.

Required artifacts:

1. Keep `context/context_index_<feature-id>.md`
2. Add `context/scenario_units_<feature-id>.md`
3. Replace the current ledger shape with a scenario-level mapping table

### 5.4 `scenario_units` contract

Each scenario unit must contain:

1. `scenario_id`
2. `family_id`
3. `scenario_title`
4. `user-visible trigger`
5. `required visible outcome`
6. `recommended section`
7. `priority`
8. `source artifacts`
9. `merge policy`

`merge policy` must be one of:

1. `must_stand_alone`
2. `may_merge_with_same_outcome`
3. `out_of_scope_only_with_reason`

Default rule:

- If two source-backed flows have different triggers, different visible outcomes, or different user risks, they must be separate `must_stand_alone` units.

### 5.5 File-level changes

Update these files:

1. `workspace-planner/skills/feature-qa-planning-orchestrator/references/context-index-schema.md`
   - Add a `Scenario Units` section.
   - Clarify that capability families are grouping aids, not sufficient planning units.
2. `workspace-planner/skills/feature-qa-planning-orchestrator/references/context-coverage-contract.md`
   - Add a rule that every `must_stand_alone` unit must map to a standalone scenario or an explicit exclusion.
3. `workspace-planner/skills/feature-qa-planning-orchestrator/references/qa-plan-contract.md`
   - Add a scenario distinctness rule.
4. `workspace-planner/skills/feature-qa-planning-orchestrator/reference.md`
   - Add the new artifact naming requirements.
5. `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`
   - Update Phase 2 and Phase 3 instructions so the writer generates `scenario_units` before drafting.

## 6. Source Access and Environment Setup Contract

### 6.1 Goal

Phase 0 must stop acting like a lightweight preflight and become a strict source-access gate. The orchestrator should not begin evidence gathering until it has validated that the correct skill and credential path exist for each requested source family.

### 6.2 Tool-routing policy

The orchestrator contract must define one canonical source-access path per source family:

1. Jira
   - Use the shared `jira-cli` skill.
   - Load the environment exactly as required by the planner workspace.
   - Do not use browser fetch or generic web fetch for Jira evidence.
2. Confluence
   - Use the shared `confluence` skill.
   - Do not use browser fetch or generic web fetch for Confluence evidence.
3. GitHub
   - Use the shared `github` skill.
   - Do not use browser fetch or generic web fetch for GitHub evidence.
4. Figma
   - Browser-based exploration is allowed when the run explicitly requests Figma or approved visual exploration.
   - Local approved snapshots remain allowed.

Default rule:

- Browser or generic web fetch is forbidden for primary system-of-record artifact collection unless the source family is Figma.

### 6.3 Phase 0 setup requirements

Phase 0 must validate the runtime path for each requested source family before Phase 1 can start.

Required checks:

1. Jira requested
   - verify `jira-cli` skill path is available
   - verify the required Jira environment file can be sourced
   - verify access with the workspace-approved Jira access command
2. Confluence requested
   - verify `confluence` skill path is available
   - verify the runtime has the expected Confluence access path
   - verify access with the workspace-approved Confluence check
3. GitHub requested
   - verify `github` skill path is available
   - verify GitHub authentication is available for the workspace
   - verify access with the workspace-approved GitHub auth check
4. Figma requested
   - verify browser path or approved snapshot path is available

If any requested source family fails setup validation, Phase 0 must stop and mark the run `blocked`.

### 6.4 Required runtime artifact

Add:

- `context/runtime_setup_<feature-id>.md`

It must record:

1. requested source families
2. chosen skill or access path per source family
3. setup command or validation method used
4. pass or fail result
5. blocker summary when applicable

### 6.5 File-level changes

Update these files:

1. `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`
   - Add a Phase 0 tool-routing contract.
2. `workspace-planner/skills/feature-qa-planning-orchestrator/reference.md`
   - Add `runtime_setup_<feature-id>.md` to the canonical artifact list.
3. `workspace-planner/skills/feature-qa-planning-orchestrator/README.md`
   - Clarify the allowed source-access methods.
4. `workspace-planner/skills/feature-qa-planning-orchestrator/references/context-coverage-contract.md`
   - Clarify that only saved system-of-record artifacts collected through approved source paths may influence the draft.

## 7. Sub-Agent Spawn Contract

### 7.1 Goal

Spawns should be deterministic collection jobs, not freeform research sessions.

### 7.2 Required spawn rules

Each Phase 1 or Phase 2 spawn must declare:

1. `source_family`
2. `approved_skill`
3. `input target`
4. `expected output artifact path`
5. `disallowed tools for this spawn`

Examples:

1. Jira spawn
   - `source_family: jira`
   - `approved_skill: jira-cli`
   - `disallowed_tools: browser, generic web fetch`
2. Confluence spawn
   - `source_family: confluence`
   - `approved_skill: confluence`
   - `disallowed_tools: browser, generic web fetch`
3. GitHub spawn
   - `source_family: github`
   - `approved_skill: github`
   - `disallowed_tools: browser, generic web fetch`
4. Figma spawn
   - `source_family: figma`
   - `approved_skill: browser flow or approved local snapshot path`
   - `browser use allowed: yes`

### 7.3 Forbidden spawn behavior

The contract must explicitly forbid:

1. using browser or generic web fetch for Jira, Confluence, or GitHub primary evidence,
2. spawning a source-collection agent without an artifact path,
3. allowing a spawned agent to produce analysis that influences drafting before the artifact is saved under `context/`,
4. using one spawn to collect mixed source families unless the user explicitly asked for a combined exploration task.

### 7.4 Phase-gate change

Phase 1 cannot complete unless every requested source family is both:

1. collected through its approved skill path, and
2. persisted under `context/` with a recorded artifact path.

### 7.5 Required `run.json` change

Each spawn-history entry should be upgraded from a freeform label to a structured record containing:

1. `spawn_id`
2. `phase`
3. `source_family`
4. `approved_skill`
5. `artifact_paths`
6. `status`

This makes it auditable whether the run used the right access path.

## 8. Skill Package Structure Recommendation

### 8.1 Best-practice conclusion

Using multiple reference files is not inherently a problem. Under the `skill-creator` guidance, it is good practice when the package uses progressive disclosure correctly:

1. `SKILL.md` stays concise.
2. Reference files are loaded only when needed.
3. Each reference file owns one concern.
4. Historical design docs do not compete with active contract docs.

The current orchestrator mostly satisfies item 1 and item 2. The main weakness is ownership overlap:

1. `SKILL.md`, `reference.md`, and `README.md` all summarize workflow and artifact rules.
2. Large historical docs remain in the main `docs/` folder, which makes it less obvious what is active contract versus historical design context.

The best remediation is not "merge everything." The best remediation is "keep the layered structure, but make authority boundaries explicit."

### 8.2 Recommended steady-state structure

Keep this structure:

1. `SKILL.md`
   - entrypoint only
   - workflow summary only
   - mandatory references list only
2. `reference.md`
   - runtime state
   - artifact naming
   - validator inventory
   - phase gates
   - source-routing contract
3. `references/qa-plan-contract.md`
   - final QA-plan shape and scenario contract
4. `references/context-coverage-contract.md`
   - source normalization and source-to-coverage rules
5. `references/executable-step-rubric.md`
   - step-quality rules
6. `references/review-rubric.md`
   - review and rewrite contract
7. `references/context-index-schema.md`
   - structure-only schema for context index and scenario units
8. `templates/qa-plan-template.md`
   - output scaffold only

This is still a multi-file design, but it is a good multi-file design because each file answers a different question.

### 8.3 What to consolidate

Consolidate or trim these areas:

1. `README.md`
   - keep it human-facing and short
   - remove duplicated workflow, artifact, and validator detail already owned by `SKILL.md` or `reference.md`
2. `SKILL.md`
   - do not repeat artifact naming tables or validator lists that belong in `reference.md`
3. `docs/*.md`
   - keep only active governance and current design docs in the main `docs/` folder
   - move superseded plans, reviews, and one-off design iterations into `docs/archive/`

### 8.4 What not to consolidate

Do not merge these solely to reduce file count:

1. `qa-plan-contract.md` and `review-rubric.md`
2. `context-coverage-contract.md` and `context-index-schema.md`
3. `executable-step-rubric.md` and `qa-plan-contract.md`

Those pairs are separate concerns. Merging them would save a few files but make the skill harder to load selectively and harder to maintain.

### 8.5 Required packaging changes

1. `SKILL.md` should clearly distinguish always-read references from conditional references.
2. `README.md` should become a short operator guide, not a second contract summary.
3. `DOCS_GOVERNANCE.md` should define which docs are active and which belong in archive.
4. Historical docs in `docs/` should be marked `Superseded` or moved to `docs/archive/`.

### 8.6 Packaging acceptance criteria

This packaging cleanup is complete only when:

1. a new reader can identify the authoritative runtime contract in one place,
2. a new reader can identify the authoritative writer and reviewer rules without comparing three summary files,
3. `README.md` no longer duplicates active contract content,
4. superseded design docs no longer look authoritative.

## 9. New Validator

### 9.1 Validator goal

Add a validator that fails when required scenario granularity is lost between normalization and the draft.

### 9.2 New validator name

Add:

- `validate_plan_artifact.mjs validate_scenario_granularity`

Implementation home:

- `workspace-planner/skills/feature-qa-planning-orchestrator/scripts/lib/qaPlanValidators.mjs`
- `workspace-planner/skills/feature-qa-planning-orchestrator/scripts/lib/validate_plan_artifact.mjs`

### 9.3 Validator inputs

The validator must consume:

1. `scenario_units_<feature-id>.md`
2. current draft or candidate QA plan
3. optional `review_rewrite_requests_<feature-id>.md`
4. optional `review_delta_<feature-id>.md`

### 9.4 Validator rules

Fail when any of the following is true:

1. A `must_stand_alone` scenario unit does not have a standalone matching scenario in the draft.
2. Two or more `must_stand_alone` units are represented by one draft scenario without an approved merge exception.
3. A required rewrite says to split or sharpen a scenario, but the candidate still maps multiple distinct scenario ids into one testcase.
4. A scenario unit requires a distinct visible outcome, but the draft uses generic wording such as "remains usable" or "works correctly" without naming the visible state.
5. The review delta claims a split occurred, but the affected draft and candidate blocks are unchanged.

### 9.5 Matching strategy

The validator does not need full semantic understanding. It can be deterministic:

1. Require each scenario row in the scenario ledger to include one or more `scenario_id` references.
2. For `must_stand_alone`, allow exactly one primary scenario id per row unless a documented approved exception exists.
3. Compare review-request ids against review-delta resolution rows.
4. Reject unchanged block text for rows marked `split_required`.

### 9.6 Supporting artifact changes

The current coverage ledger is too coarse. Replace it with a mapping table shaped like this:

| scenario_id | draft_section | draft_scenario_title | resolution_type | status |
| --- | --- | --- | --- | --- |

`resolution_type` must be one of:

1. `standalone`
2. `approved_merge`
3. `explicit_exclusion`

For `must_stand_alone`, only `standalone` is valid unless the review artifact explicitly approves otherwise.

### 9.7 Test coverage to add

Update or add tests in:

1. `workspace-planner/skills/feature-qa-planning-orchestrator/tests/planValidators.test.mjs`

Required test cases:

1. Pass when all `must_stand_alone` units map one-to-one to draft scenarios.
2. Fail when save/save as/comments/template collapse into one row.
3. Fail when Mojo-error and Library-error remain merged after a review split request.
4. Fail when review delta claims resolution but the scenario text is unchanged.

## 10. Phase 5 and Phase 6 Changes

### 10.1 Phase 5 review output must become prescriptive

The review stage currently identifies problems, but it does not force a machine-checkable rewrite contract.

Add a required artifact:

- `context/review_rewrite_requests_<feature-id>.md`

Each rewrite request must include:

1. `request_id`
2. `source scenario_id`
3. `problem_type`
4. `required action`
5. `must-change evidence`

`problem_type` must support at least:

1. `split_required`
2. `expected_result_too_vague`
3. `wrong_section`
4. `missing_visible_outcome`
5. `missing_source_traceability`

### 10.2 Phase 6 must emit a real delta artifact

Add a required artifact:

- `context/review_delta_<feature-id>.md`

Each row must record:

1. `request_id`
2. `old_scenario_title`
3. `new_scenario_title_or_titles`
4. `change_summary`
5. `status`

Allowed `status` values:

1. `resolved`
2. `blocked`

Remove permissive partial statuses for required rewrite requests.

### 10.3 Phase 6 promotion gate

Phase 6 cannot complete unless all of the following are true:

1. Every `split_required` request is marked `resolved`.
2. `validate_scenario_granularity` passes.
3. `validate_review_delta` passes.
4. The candidate differs from the reviewed draft when any required rewrite existed.

The "candidate differs from draft" rule should be deterministic:

1. If there were no required rewrites, unchanged content is allowed.
2. If there was at least one required rewrite, unchanged content is a hard failure.

### 10.4 Candidate generation rule

Phase 6 must create:

1. `drafts/qa_plan_v1.md`
2. `drafts/qa_plan_v2.md` or later, when refactor occurs
3. `qa_plan_final_candidate.md`

Do not overwrite the original reviewed draft in place. Promotion without versioned draft history makes review enforcement un-auditable.

## 11. Phase 7 Promotion Gate

### 11.1 Required promotion checks

Phase 7 must refuse promotion when:

1. `review_rewrite_requests` exists and unresolved requests remain.
2. `review_delta` is missing.
3. `scenario_units` is missing.
4. `validate_scenario_granularity` did not pass on the candidate.
5. Required rewrites existed, but the candidate and prior reviewed draft are identical.

### 11.2 Finalization artifact change

Replace the lightweight finalization note with a fuller record:

- `context/finalization_record_<feature-id>.md`

It must include:

1. promoted source artifact
2. reviewed draft artifact
3. whether required rewrites existed
4. validator outcomes
5. whether the promoted candidate changed from the reviewed draft
6. promotion decision reason

## 12. Exact Files To Change

### Docs and contracts

1. `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`
2. `workspace-planner/skills/feature-qa-planning-orchestrator/reference.md`
3. `workspace-planner/skills/feature-qa-planning-orchestrator/references/context-index-schema.md`
4. `workspace-planner/skills/feature-qa-planning-orchestrator/references/context-coverage-contract.md`
5. `workspace-planner/skills/feature-qa-planning-orchestrator/references/qa-plan-contract.md`
6. `workspace-planner/skills/feature-qa-planning-orchestrator/references/review-rubric.md`
7. `workspace-planner/skills/feature-qa-planning-orchestrator/templates/qa-plan-template.md`
8. `workspace-planner/skills/feature-qa-planning-orchestrator/docs/DOCS_GOVERNANCE.md`
9. `workspace-planner/skills/feature-qa-planning-orchestrator/README.md`

### Runtime scripts and validators

1. `workspace-planner/skills/feature-qa-planning-orchestrator/scripts/lib/qaPlanValidators.mjs`
2. `workspace-planner/skills/feature-qa-planning-orchestrator/scripts/lib/validate_plan_artifact.mjs`
3. `workspace-planner/skills/feature-qa-planning-orchestrator/scripts/lib/deploy_runtime_context_tools.sh`

### Tests

1. `workspace-planner/skills/feature-qa-planning-orchestrator/tests/planValidators.test.mjs`
2. `workspace-planner/skills/feature-qa-planning-orchestrator/tests/docsContract.test.mjs`

## 13. Acceptance Criteria

This remediation is complete only when all of the following are true:

1. A source set containing save, save as, comments, and template flows yields four separate scenario units unless an explicit approved merge exists.
2. A source set containing different visible error outcomes yields separate scenario units and separate draft scenarios.
3. Review can require a split through a structured rewrite request artifact.
4. Phase 6 must produce a review delta showing the split.
5. Promotion fails if required rewrites exist and the candidate is unchanged.
6. Versioned drafts remain on disk so the refactor is auditable.
7. Jira evidence collection is routed only through `jira-cli`.
8. Confluence evidence collection is routed only through `confluence`.
9. GitHub evidence collection is routed only through `github`.
10. Browser or generic web fetch is not allowed for Jira, Confluence, or GitHub primary evidence collection.
11. Figma remains the only allowed browser-based source family unless the user explicitly approves another path.
12. `README.md`, `SKILL.md`, and `reference.md` have non-overlapping ownership.
13. Superseded design docs no longer appear as active contract docs.

## 14. Recommended Implementation Order

1. Update contracts and schema.
2. Add Phase 0 runtime setup and source-routing contract updates.
3. Clean up package ownership and archive or mark superseded docs.
4. Add `scenario_units` artifact generation.
5. Replace the scenario ledger format.
6. implement `validate_scenario_granularity`.
7. Add review rewrite request and review delta artifacts.
8. Tighten Phase 6 and Phase 7 gates.
9. Add validator and docs tests.

## 15. Non-Goals

This spec does not attempt to:

1. redesign the entire orchestrator workflow,
2. change source-family collection behavior,
3. define product-specific testcase content for BCIN-7289 itself.

It only strengthens the planning pipeline so future runs cannot silently compress concrete user workflows into vague umbrella cases and then promote them unchanged.
