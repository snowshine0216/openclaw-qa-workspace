# HOLDOUT-REGRESSION-002 — Holdout Regression Check (BCIN-976 / report-editor)

## Primary checkpoint under test: **Holdout**
**Benchmark focus (blocking):** promotion/finalization behavior remains stable on another feature.

## Evidence used (holdout_regression mode)
- `skill_snapshot/SKILL.md`
- `skill_snapshot/reference.md`
- `skill_snapshot/README.md`
- `fixture:BCIN-976-blind-pre-defect-bundle/BCIN-976.issue.raw.json`
- `fixture:BCIN-976-blind-pre-defect-bundle/BCIN-976.customer-scope.json`

## Holdout regression verification: Promotion / Finalization stability (Phase 7)
This benchmark case is satisfied if the orchestrator’s holdout-phase behavior for **promotion/finalization** is stable and contract-aligned when applied to **another feature (BCIN-976)** in the **report-editor** family.

### Contract expectations for promotion/finalization (authoritative)
From `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md`, **Phase 7** is the *only* place where a final plan is promoted:
- Phase 7 work:
  - **archive any existing final plan**
  - **promote the best available draft** to `qa_plan_final.md`
  - **write finalization record** `context/finalization_record_<feature-id>.md`
  - generate `context/final_plan_summary_<feature-id>.md` from `qa_plan_final.md`
  - attempt Feishu notification
- **User interaction is required:** explicit approval before running Phase 7.
- Final overwrite behavior must be stable:
  - if `qa_plan_final.md` already exists, it must be moved to `archive/qa_plan_final_<timestamp>.md` before promotion.

### Why BCIN-976 is a valid “other feature” holdout target
Fixture evidence confirms BCIN-976 is:
- `key`: **BCIN-976**
- `issue_type`: **Feature** (epic-style feature)
- `labels`: includes **Report** and **Library_and_Dashboards** (matches report-editor family context)
- `priority`: **High**
- `fixVersions`: includes **26.04**
- `customer_signal_present`: **true** (explicit customer references)

This is sufficient to use BCIN-976 as a regression target for validating that the orchestrator’s holdout (promotion/finalization) rules are feature-agnostic and remain stable.

## Holdout regression conclusion (blocking)
### PASS (contract-level)
Based strictly on the provided snapshot workflow package, the orchestrator’s promotion/finalization behavior is stable and explicitly defined in **Phase 7**, including:
- mandatory explicit approval gate before finalization,
- archiving of any pre-existing `qa_plan_final.md` before overwrite,
- deterministic promotion of the “best available draft” into `qa_plan_final.md`,
- required finalization artifacts (`context/finalization_record_<feature-id>.md` and `context/final_plan_summary_<feature-id>.md`).

These rules are specified independent of feature content and therefore should apply unchanged to BCIN-976 (the “other feature” in this holdout regression).

## Short execution summary
- Checked holdout-phase alignment: focused exclusively on **Phase 7 promotion/finalization** behavior.
- Used only snapshot contract docs + BCIN-976 fixture metadata.
- Determined the benchmark focus is explicitly covered and stable per the Phase 7 contract.