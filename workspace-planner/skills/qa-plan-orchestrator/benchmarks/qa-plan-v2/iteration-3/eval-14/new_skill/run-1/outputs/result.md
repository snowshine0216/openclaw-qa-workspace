# HOLDOUT-REGRESSION-002 — qa-plan-orchestrator holdout regression

## Benchmark target
- **Feature:** BCIN-976
- **Feature family / Knowledge pack:** report-editor
- **Primary phase under test:** **Holdout**
- **Evidence mode:** holdout_regression
- **Priority:** blocking
- **Case focus (must be explicitly covered):** **promotion/finalization behavior remains stable on another feature**
- **Fixture reference:** BCIN-976-blind-pre-defect-bundle

## What is being verified (holdout checkpoint)
This holdout regression case checks that the **new script-driven orchestrator contract** preserves **promotion/finalization stability** (Phase 7 behavior and related gating) when run against a different feature in the same family (report-editor), here **BCIN-976**, without requiring any additional non-provided evidence.

Concretely, the skill must continue to:
1. **Treat promotion/finalization as Phase 7 only**, with **explicit user approval** before running Phase 7.
2. **Promote only from an existing “best available draft”** into `qa_plan_final.md`.
3. **Archive any existing final** before overwriting (`archive/qa_plan_final_<timestamp>.md`).
4. **Write finalization artifacts** (`context/finalization_record_<feature-id>.md`, plus `context/final_plan_summary_<feature-id>.md` derived from `qa_plan_final.md`).
5. **Not finalize early / inline** in other phases (orchestrator never writes artifacts directly).

## Evidence-based holdout assessment
### Promotion/finalization stability is explicitly defined and unchanged by feature
From the skill snapshot contract:
- The orchestrator’s responsibilities are limited to running phase scripts, spawning from manifests, waiting, and running `--post` where applicable; it **does not perform phase logic inline** and **does not write artifacts** itself. (SKILL.md)
- **Phase 7** is the only phase that performs promotion/finalization:
  - archive existing final plan,
  - promote best available draft to `qa_plan_final.md`,
  - write `context/finalization_record_<feature-id>.md`,
  - generate `context/final_plan_summary_<feature-id>.md` from `qa_plan_final.md`,
  - attempt Feishu notification,
  - and requires **explicit user approval** before running. (SKILL.md; reference.md)
- `REPORT_STATE` gating exists to prevent accidental overwrites and to route user choice via `apply_user_choice.sh` before continuing. (reference.md)

These behaviors are specified **independently of any single feature**; therefore, when switching to “another feature” (BCIN-976) within the report-editor family, the promotion/finalization contract remains stable.

### Holdout alignment (primary phase = holdout)
This benchmark’s holdout focus is addressed by validating the **Phase 7 finalization contract** and its invariants (approval gate, archive-on-overwrite, deterministic output paths), rather than generating a full QA plan.

### Feature fixture confirms we are indeed operating on “another feature” in the family
The fixture evidence shows:
- `feature_id`: **BCIN-976**
- labels include `Library_and_Dashboards` and `Report` (report-editor family context)
- customer signal present (customer references exist in Jira custom fields), which is relevant to context handling but does not change Phase 7 promotion/finalization semantics.

## Verdict (blocking)
**PASS** for HOLDOUT-REGRESSION-002 based on the provided holdout regression evidence:
- The workflow package explicitly defines Phase 7 promotion/finalization behavior and approval gating.
- The contract is feature-agnostic; applying it to BCIN-976 should not change promotion/finalization stability.
- No evidence indicates any feature-specific branching that would alter Phase 7 behavior.

---

## Short execution summary
Reviewed the authoritative skill snapshot contracts (SKILL.md + reference.md + README.md) and the BCIN-976 fixture bundle to confirm that Phase 7 promotion/finalization behavior (approval gate, archive-on-overwrite, finalization record and summary generation) is explicitly specified and remains stable when applied to another report-editor feature.