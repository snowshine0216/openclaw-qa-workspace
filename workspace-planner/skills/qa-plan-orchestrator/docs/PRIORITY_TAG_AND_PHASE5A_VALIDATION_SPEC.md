# Round Progression And Phase 5a Coverage Validation Spec

**Date:** 2026-03-11
**Status:** Proposed
**Scope:** `workspace-planner/skills/qa-plan-orchestrator`
**This document is docs-first only:** no runtime or validator changes are part of this spec artifact itself.

## 1. Purpose

This spec is a focused companion to:

- `docs/QA_PLAN_ORCHESTRATOR_RENAME_AND_RUNS_RELAYOUT_DESIGN.md`

It exists to lock the behavior contract that must survive the skill reshape.

This spec covers the planning failures that are currently coupled to the same review and validation surface:

1. Phase 4 and Phase 5 reruns can collapse back to `r1`
2. current evaluation and refactor behavior can narrow the QA plan by deleting or demoting nodes just because they are not restated in the latest design summary
3. `Out of Scope / Assumptions` is too easy to misuse as a sink for live concerns

The goal is to make the later implementation pass deterministic:

1. fix phase round progression
2. force review and refactor rounds to preserve or enrich coverage instead of shrinking it
3. update `reference.md` and active contracts so the reshaped `qa-plan-orchestrator` skill describes the real behavior
4. leave priority behavior unchanged for now and do not make it part of this implementation scope

## 2. Design Goals

This focused spec must stay aligned with the broader rename and runs-relayout design.

Primary goals:

1. fix Phase 4a, 4b, 5a, 5b, and 6 round numbering so reruns advance to the next real round instead of reusing `r1`
2. stop evaluation and refactor from silently narrowing the QA plan scope
3. enforce this review rule:

```text
Do not remove, defer, or move a concern to Out of Scope.
Only do so when source evidence or explicit user direction requires it.
Otherwise enrich the QA plan by preserving, splitting, clarifying, or extending coverage.
```

4. make each later round coverage-positive or at least coverage-preserving
5. add one explicit `Phase 5a Acceptance Gate`:
   - Phase 5a cannot return `accept` when any priority, round-integrity, or coverage-preservation audit item remains `rewrite_required` or otherwise unresolved
6. update `reference.md`, `SKILL.md`, `references/*.md`, and tests to reflect the reshaped `qa-plan-orchestrator` package and the corrected behavior rules
7. explicitly defer priority placement and priority correctness review so this plan does not try to solve them now
8. explicitly encourage bounded supplemental research during review when the existing artifacts are not sufficient to support evaluation or when more knowledge is required to preserve or deepen coverage

Current implementation note:

1. current Phase 5a and Phase 5b spawning already permits one bounded supplemental research pass
2. this design change is therefore primarily a contract and wording clarification
3. no spawn-script change is required just to allow this behavior
4. future script or validator changes are only required if the workspace wants to:
   - require the agent to record whether research was used
   - fail the round when evidence was insufficient but no bounded research was attempted
   - enforce a stricter search-before-scope-reduction rule

## 3. Problem Statement

The current skill package has three overlapping problems.

### 3.1 Broken round progression

Phase 4 and Phase 5 reruns can behave as if the destination draft is still `r1`, even when the run is clearly on a later revision path.

That breaks:

1. draft lineage
2. review traceability
3. `latest_draft_path`
4. refactor accountability

### 3.2 Scope shrinkage during evaluation and refactor

The current evaluation posture can narrow the QA plan just because a concern is absent from a narrower design summary or from a later restatement.

That is the wrong direction.

Once a concern is evidence-backed and in scope, later rounds should prefer:

1. preserving it
2. splitting it
3. clarifying it
4. adding stronger observable outcomes
5. upgrading traceability
6. using bounded supplemental research when the existing artifact set is not sufficient to evaluate the concern confidently

They should not default to:

1. deleting it
2. deferring it
3. moving it to `Out of Scope / Assumptions`
4. downgrading it without evidence

### 3.3 Priority is not in scope for this pass

Priority remains a known area of ambiguity, but this spec intentionally does not change priority placement or priority correctness behavior.

For this plan:

1. priority stays as-is
2. no new priority validator is required
3. no Phase 5a priority audit is required
4. priority can be revisited in a later focused design

## 4. Decision Summary

This spec proposes one integrated contract.

1. Phase 4a, 4b, 5a, 5b, and 6 reruns must always emit the next real draft round.
2. Phase 5a becomes the authoritative review phase for:
   - coverage preservation
   - illegal scope shrinkage detection
3. Review and refactor are enrichment passes, not narrowing passes.
4. `Out of Scope / Assumptions` stays available only for justified exceptions.
5. Priority behavior is deferred and left unchanged in this pass.
6. Review and refactor should use bounded supplemental research when the existing artifact set is not sufficient to support evaluation or when more knowledge is required to preserve or deepen coverage


This separates two kinds of correctness in this pass:

1. round correctness
2. coverage correctness

## 5. Round Progression Contract

This spec adds an explicit draft-round contract because the current behavior can keep falling back to `r1`.

Required rule:

1. the first successful draft for a phase writes `r1`
2. every later rerun for that same phase writes the next real round
3. rerouting through `return_to_phase` must not reset the destination phase counter
4. no rerun may overwrite an earlier round artifact name
5. `latest_draft_path` must always point to the newest accepted draft

This applies to:

1. `phase4a_round`
2. `phase4b_round`
3. `phase5a_round`
4. `phase5b_round`
5. `phase6_round`

## 6. Coverage Preservation Contract

This spec explicitly rejects the current narrowing behavior.

Review and refactor rounds must treat the QA plan as something to preserve or enrich.

Rules:

1. an evidence-backed concern discovered in an earlier round stays in scope unless evidence or the user explicitly removes it
2. a later design summary is not sufficient reason to delete a previously supported node
3. a concern must not be removed, deferred, or moved to `Out of Scope / Assumptions` just because it does not appear in the latest design doc restatement
4. later rounds should prefer:
   - preserve the node
   - split the node
   - clarify the node
   - add missing expected outcomes
   - deepen traceability
   - add missing coverage implied by the saved evidence
5. later rounds should not silently:
   - delete the node
   - demote the node
   - move the node to `Out of Scope / Assumptions`
   - reduce coverage breadth

When the current artifact set is not sufficient to evaluate a concern or to decide how to rewrite it, review phases should prefer bounded supplemental research over scope reduction.

Encouraged behavior:

1. use local run artifacts first
2. if those artifacts still cannot support evaluation, do one bounded supplemental research pass
3. use only approved search and evidence tools:
   - `jira-cli`
   - `confluence`
   - `tavily-search`
4. save every new research artifact under `context/`
5. fold the new evidence back into the rewritten QA plan instead of shrinking scope

Implementation boundary:

1. the current spawned task text already allows this bounded supplemental research behavior
2. this spec does not require an immediate spawn-script change merely to permit it
3. a later implementation change is only needed if the workspace wants deterministic enforcement or auditability around whether the research pass was actually attempted and recorded

## 7. Out Of Scope Contract

`Out of Scope / Assumptions` remains valid, but only as a justified exception section.

Allowed uses:

1. explicit unsupported path
2. explicit product exclusion
3. explicit user-confirmed deferral
4. explicit missing dependency that is proven by evidence

Forbidden use:

1. hiding a live concern because a later review wants a smaller plan
2. dropping a previously evidence-backed node because the latest design summary is narrower
3. using the section as a cleanup bucket for unresolved coverage

Required reviewer language:

```text
Do not remove, defer, or move a concern to Out of Scope.
Only do so when source evidence or explicit user direction requires it.
Otherwise enrich the plan by preserving, splitting, clarifying, or extending coverage.
```

## 8. Phase 5a Acceptance Gate

`Phase 5a Acceptance Gate`:

1. Phase 5a cannot return `accept` when any round-integrity or coverage-preservation audit item remains `rewrite_required` or otherwise unresolved

## 9. Phase 5a Ownership

Phase 5a should become the phase that answers all of the following:

1. did the refactor preserve or enrich earlier evidence-backed coverage
2. did the round produce a real next-round artifact
3. if anything is wrong, was it rewritten and recorded
4. when the current artifact set was not enough, did the review use bounded supplemental research instead of narrowing the plan prematurely

Phase 5a should not silently accept inherited structure from Phase 4b.
It must explicitly review it against the evidence set and the prior-round scope.

## 10. Required Phase 5a Review Additions

Later implementation should extend the Phase 5a review contract with one explicit audit family.

Required additions:

1. `review_notes_<feature-id>.md` must include:
   - `## Coverage Preservation Audit`
2. every reviewed affected node must record:
   - rendered plan path
   - prior-round status
   - current-round status
   - evidence source
   - disposition (`pass` | `rewrite_required`)
   - reason
3. every removed, deferred, or out-of-scope treatment must be audited against prior evidence
4. `review_delta_<feature-id>.md` must record how coverage regressions were fixed
5. the `Phase 5a Acceptance Gate` applies:
   - Phase 5a cannot return `accept` when any round-integrity or coverage-preservation audit item remains `rewrite_required` or otherwise unresolved
6. when local evidence was insufficient, the review notes and delta should record whether bounded supplemental research was used and what new artifact was added

Suggested coverage-preservation audit row:

```text
- Core Functional Flows > Save As dialog | present in phase4b_r2 and backed by jira_issue_BCIN-123.md | removed in phase5a_r1 | rewrite_required | restore as standalone scenario
```

## 11. Validation Plan

This spec proposes three deterministic validation areas in the later implementation pass.

### 11.1 Round progression validator

Purpose:

1. verify that repeated Phase 4 and Phase 5 runs advance to the next real round
2. reject any rerun that reuses `r1` or points `latest_draft_path` backward

Expected runtime use:

1. manifest builder and post-validation checks for Phase 4a, 4b, 5a, 5b, and 6

### 11.2 Coverage preservation validator

Purpose:

1. detect silent node removal, unjustified demotion, or illegal moves to `Out of Scope / Assumptions`
2. require review and delta artifacts to explain and fix any such regression
3. confirm that missing local evidence triggered bounded supplemental research before scope was reduced

Expected runtime use:

1. Phase 5a post validation
2. Phase 5b and Phase 6 checks where they consume prior reviewed drafts

### 11.3 Phase 5a acceptance-gate validator

Purpose:

1. verify that Phase 5a cannot return `accept` while any round-integrity or coverage-preservation audit item remains unresolved

Expected runtime use:

1. Phase 5a post validation

## 12. Required `reference.md` Updates

This spec must be reflected in:

- `workspace-planner/skills/qa-plan-orchestrator/reference.md`

Required additions:

1. explicit round progression contract for Phase 4a, 4b, 5a, 5b, and 6
2. explicit coverage-preservation contract
3. explicit `Out of Scope / Assumptions` restriction
4. explicit `Phase 5a Acceptance Gate`
5. validator inventory updated to include:
   - round progression
   - coverage preservation
   - Phase 5a acceptance gate
6. phase gate language updated so Phase 5a cannot return `accept` while any round-integrity or coverage-preservation audit item remains unresolved
7. explicit note that priority behavior is deferred and unchanged in this pass
8. explicit encouragement that review phases should use bounded supplemental research with `jira-cli`, `confluence`, and `tavily-search` when the current artifact set cannot support evaluation
9. explicit note that current spawn task generation already permits bounded supplemental research, so implementation changes are optional unless stronger enforcement is desired

## 13. File Changes For The Later Implementation Pass

The follow-up implementation should update these files.

### 13.1 Active contracts and templates

1. `workspace-planner/skills/qa-plan-orchestrator/references/context-index-schema.md`
   - document that priority behavior is not changing in this pass
2. `workspace-planner/skills/qa-plan-orchestrator/references/phase4a-contract.md`
   - state the round progression expectation
3. `workspace-planner/skills/qa-plan-orchestrator/references/phase4b-contract.md`
   - state that grouping and refactor may not silently shrink coverage
4. `workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5a.md`
   - add coverage-preservation audit
   - add the "Do not remove, defer, or move a concern to Out of Scope" rule
   - encourage bounded supplemental research when existing artifacts cannot support evaluation
5. `workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5b.md`
   - preserve the same no-silent-shrinkage rule
   - encourage bounded supplemental research when checkpoint evidence is insufficient
6. `workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase6.md`
   - state that Phase 6 preserves reviewed coverage scope
7. `workspace-planner/skills/qa-plan-orchestrator/templates/qa-plan-template.md`
   - no priority rewrite required in this pass
8. `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`
   - mention that Phase 5a audits round integrity and coverage preservation
9. `workspace-planner/skills/qa-plan-orchestrator/reference.md`
   - add the contracts listed in Section 12

### 13.2 Runtime validation code

1. `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/qaPlanValidators.mjs`
   - add deterministic round-progression validation support
   - add deterministic coverage-preservation validation
   - keep room for evidence-of-bounded-research checks in review artifacts
2. `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/validate_plan_artifact.mjs`
   - expose the new validators
3. `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/runPhase.mjs`
   - call round and coverage validation in Phase 5a
4. `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/workflowState.mjs`
   - fix next-round derivation for repeated Phase 4 and Phase 5 runs
5. `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/spawnManifestBuilders.mjs`
   - ensure output draft paths use the corrected next-round calculation
   - current implementation already permits bounded supplemental research
   - update spawned task wording if the workspace wants the stronger contract language reflected directly in Phase 5a / 5b subagent prompts
   - no logic change is required merely to permit bounded supplemental research unless stricter enforcement or explicit audit logging is later approved

### 13.3 Tests

1. `workspace-planner/skills/qa-plan-orchestrator/tests/planValidators.test.mjs`
   - add unit tests for coverage-preservation failures:
     - node removed from draft without evidence or Coverage Preservation Audit entry
     - node moved to Out of Scope without justification
     - review_notes missing `## Coverage Preservation Audit` when prior-round had more nodes
   - add unit tests for Phase 5a acceptance-gate failures:
     - `accept` verdict with audit item `rewrite_required`
     - `accept` verdict with unresolved round-integrity finding
2. `workspace-planner/skills/qa-plan-orchestrator/tests/workflowState.test.mjs`
   - add tests proving Phase 4 and Phase 5 reruns advance the phase round:
     - when `phase4b_r1` exists, next run writes `phase4b_r2` (not r1)
     - when `return_to_phase` is phase5a, round counter is not reset
     - `latest_draft_path` never points to an earlier round than a later-produced draft
3. `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase4b.test.sh`
   - no priority-specific fixture rewrite required in this pass
4. `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase5a.test.sh`
   - add fixtures proving Phase 5a rejects silent scope shrinkage:
     - phase4b draft has scenario X (evidence-backed); phase5a draft lacks X; review_notes lack Coverage Preservation Audit → post-validation fails
     - phase5a draft has `accept` verdict but Coverage Preservation Audit contains `rewrite_required` → post-validation fails
5. `workspace-planner/skills/qa-plan-orchestrator/scripts/test/phase6.test.sh`
   - update pass fixtures so final drafts preserve reviewed coverage breadth:
     - phase5b draft has N scenarios; phase6 draft must have at least N (or explicit exclusion with evidence)

### 13.4 Evals

1. `workspace-planner/skills/qa-plan-orchestrator/evals/evals.json`
   - add eval_groups per Section 14.1 (round_progression, coverage_preservation, phase5a_acceptance_gate)
   - optionally extend eval id 1 and existing eval_groups per Section 14.2

## 14. Evals Updates

The evals in `evals/evals.json` must be updated to cover the new validation contracts.

### 14.1 New eval_groups (or extend existing)

When implementation starts, add or extend:

1. **`round_progression`** (blocking)
   - prompt: Verify that Phase 4a, 4b, 5a, 5b, and 6 reruns advance to the next real round (r2, r3, …) and never reuse r1
   - expected_pass_behavior: Draft paths use incremented round numbers; `latest_draft_path` never points backward
   - expected_failure_signals: `r1` reused on rerun, `latest_draft_path` regression

2. **`coverage_preservation`** (blocking)
   - prompt: Verify that Phase 5a review notes include Coverage Preservation Audit and that no evidence-backed node is silently removed, demoted, or moved to Out of Scope without justification
   - expected_pass_behavior: Coverage Preservation Audit present; removed/deferred/out-of-scope items have evidence or user confirmation
   - expected_failure_signals: silent node removal, unjustified Out of Scope move, missing Coverage Preservation Audit

3. **`phase5a_acceptance_gate`** (blocking)
   - prompt: Verify that Phase 5a cannot return `accept` when any round-integrity or coverage-preservation audit item remains `rewrite_required` or unresolved
   - expected_pass_behavior: `accept` only when all audit items are `pass` or resolved
   - expected_failure_signals: `accept` with `rewrite_required` or unresolved audit items

### 14.2 Extend existing evals (optional)

- **eval id 1** (full QA plan): Add expectation that phase-scoped drafts use correct round progression (e.g., phase5a_r2 on second run)
- **eval_groups `context_usage`**: Add `silent drop` to expected_failure_signals if not already covered
- **eval_groups `review_delta`**: Align with Phase 5a acceptance gate (blocking findings resolved before accept)

## 15. Acceptance Criteria

This spec should be considered implemented only when all of the following are true:

1. Phase 4 and Phase 5 reruns no longer collapse back to `r1`
2. Phase 5a has deterministic validation for coverage preservation
3. Phase 5a cannot return `accept` while round-integrity or coverage-preservation audit items remain unresolved
4. `reference.md` reflects the reshaped skill and the corrected contracts
5. test fixtures and validator tests all use the same behavior contract
6. priority behavior remains unchanged by this implementation pass
7. evals (and eval_groups) cover round progression, coverage preservation, and Phase 5a acceptance gate

## 16. Recommended Execution Order

When implementation starts, the safest order is:

1. update active contracts and examples
2. update `reference.md` and the Phase 5a rubric
3. add or update validator tests
4. fix round derivation helpers
5. implement runtime validators
6. wire validators into phase post-validation
7. update shell fixtures
8. add or extend evals in `evals/evals.json` (Section 14)
9. run targeted tests first, then the full skill test suite, then evals

That order avoids the same bad intermediate state that caused the current drift:

1. docs say one thing
2. fixtures show another
3. runtime enforces a third
