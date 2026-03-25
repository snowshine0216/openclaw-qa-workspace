# Superseded: Design Review: Feature QA Planning Orchestrator Enhancement Plan

**Reviewer:** Design self-consistency and workflow audit  
**Date:** 2026-03-10  
**Document under review:** `FEATURE_QA_PLANNING_ORCHESTRATOR_ENHANCEMENT_PLAN.md`

---

## Executive Summary

The design is now broadly self-consistent and the state-transition model is materially stronger than the earlier revisions. The remaining concerns are advisory rather than blocking. Current assessment: **pass_with_advisories**.

---

## Findings

### P2 — Phase-level idempotency expectations are still implicit

The design now defines resumable state, artifact persistence, blocking branches, and phase gates, but it still does not spell out phase-by-phase idempotency rules for re-running a partially completed phase. The implementation can infer the intent from `task.json`, `run.json`, and the persisted artifacts, but the contract would be stronger if each phase explicitly stated whether it reuses, overwrites, or version-bumps its outputs on resume.

**Why it matters**

- Resume behavior is central to this orchestrator design.
- Phase 0 preserves `REPORT_STATE`, but downstream re-entry behavior is still partly implied.
- The implementation may otherwise have to infer whether to regenerate or reuse artifacts in some blocked/resume branches.

**Suggested follow-up**

Add one short idempotency rule per phase, for example:

1. reuse saved artifacts when the phase input contract is unchanged
2. overwrite only the current phase's in-progress artifact when rerunning the same phase
3. version-bump draft outputs when the phase produces a new reviewed draft candidate

Evidence:

- [FEATURE_QA_PLANNING_ORCHESTRATOR_ENHANCEMENT_PLAN.md:592](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/docs/FEATURE_QA_PLANNING_ORCHESTRATOR_ENHANCEMENT_PLAN.md:592)
- [FEATURE_QA_PLANNING_ORCHESTRATOR_ENHANCEMENT_PLAN.md:648](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/docs/FEATURE_QA_PLANNING_ORCHESTRATOR_ENHANCEMENT_PLAN.md:648)
- [FEATURE_QA_PLANNING_ORCHESTRATOR_ENHANCEMENT_PLAN.md:1219](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/docs/FEATURE_QA_PLANNING_ORCHESTRATOR_ENHANCEMENT_PLAN.md:1219)

### P2 — Notification behavior is defined for approval success but not for non-success terminal states

The design now defines `notification_pending` on approval-path failure, which is the most important case. It still does not say whether blocked terminal states should generate a notification or be explicitly silent. That is not a workflow blocker, but it is still an implementation choice that should be made once.

**Suggested follow-up**

State one rule in the Phase 7 section or in `reference.md` sync expectations:

- notify only on successful finalization, or
- notify on both successful finalization and blocked terminal exits

Evidence:

- [FEATURE_QA_PLANNING_ORCHESTRATOR_ENHANCEMENT_PLAN.md:578](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/docs/FEATURE_QA_PLANNING_ORCHESTRATOR_ENHANCEMENT_PLAN.md:578)
- [FEATURE_QA_PLANNING_ORCHESTRATOR_ENHANCEMENT_PLAN.md:1270](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/docs/FEATURE_QA_PLANNING_ORCHESTRATOR_ENHANCEMENT_PLAN.md:1270)
- [FEATURE_QA_PLANNING_ORCHESTRATOR_ENHANCEMENT_PLAN.md:1289](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/docs/FEATURE_QA_PLANNING_ORCHESTRATOR_ENHANCEMENT_PLAN.md:1289)

---

## Current Assessment

### Self-consistency

**Pass**

- Phase numbering is aligned with the 0-7 phase model.
- Verdict enums, review delta states, and finalization artifact contracts are now internally consistent.
- The context-index schema, validator expectations, and E2E classification rule now point to the same required heading.

### Workflow and state transitions

**Pass**

- Phase 0 now blocks on empty source-family selection, runtime blockers, and same-feature concurrent runs.
- Phase 1 now correctly requires required sources to be `retrieved` rather than merely documented as missing.
- Phase 2 now defines the blocked branch for empty mandatory coverage candidates.
- Finalization rejection now forces a fresh structured review before another finalization attempt.

### Review-note reliability

**Pass**

- This review file now reflects the current design state and supersedes older blocker lists from earlier revisions.

---

## Verdict

| Dimension | Result |
|-----------|--------|
| Self-consistency | **Pass** |
| Workflow/state transitions | **Pass** |
| Review artifact currency | **Pass** |
| Residual advisories | **Pass with advisories** |

**Overall:** **pass_with_advisories**
