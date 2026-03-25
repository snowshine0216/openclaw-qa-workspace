# HOLDOUT-REGRESSION-002 — qa-plan-orchestrator — Holdout Regression Assessment

**Primary benchmark feature:** BCIN-976

**Feature family / knowledge pack:** report-editor / report-editor

**Primary phase under test:** **holdout**

**Evidence mode:** holdout_regression

**Priority:** blocking

## Decision

**BLOCKED (cannot verify holdout regression expectation with provided evidence)**

## What this benchmark is checking (holdout phase alignment)

This holdout-regression case requires demonstrating that **promotion/finalization behavior remains stable on another feature** (BCIN-976), i.e., the orchestrator’s **Phase 7** contract behavior:

- archive any existing `qa_plan_final.md`
- promote the best available draft to `qa_plan_final.md`
- write `context/finalization_record_<feature-id>.md`
- generate `context/final_plan_summary_<feature-id>.md` via `scripts/lib/finalPlanSummary.mjs`
- require explicit user approval before running Phase 7

## What the provided evidence contains

From the provided benchmark evidence, we have:

- The **skill contract** (script-driven orchestrator responsibilities and phase gates), including Phase 7 promotion/finalization requirements.
- A **fixture bundle** containing **Jira issue raw JSON** and **customer-scope JSON** for **BCIN-976**.

## Why this is blocked

The evidence does **not** include any run artifacts or script outputs for BCIN-976 (or any other feature run) that would allow us to confirm holdout stability of promotion/finalization behavior, such as:

- `runs/BCIN-976/qa_plan_final.md` (or an archived prior final)
- `runs/BCIN-976/context/finalization_record_BCIN-976.md`
- `runs/BCIN-976/context/final_plan_summary_BCIN-976.md`
- Any Phase 7 execution log / stdout indicating user-approval gating and successful promotion
- Any `run.json` / `task.json` showing `finalized_at` updates or archival actions

With only contracts + a Jira fixture, we can restate expected behavior, but we **cannot demonstrate** that the behavior “remains stable” in holdout execution.

## Minimum evidence needed to pass this holdout-regression check

To satisfy the holdout checkpoint for BCIN-976, the benchmark would need at least one of:

1. **Phase 7 stdout transcript** for a BCIN-976 run showing:
   - approval prompt occurred
   - archive/promotion steps executed
   - finalization record and summary generation occurred

and/or

2. The resulting **Phase 7 artifacts** under a BCIN-976 run directory:
   - `qa_plan_final.md`
   - `context/finalization_record_BCIN-976.md`
   - `context/final_plan_summary_BCIN-976.md`
   - optional: `archive/qa_plan_final_<timestamp>.md` if overwriting an existing final

## Holdout regression focus coverage (explicit)

- **Focus:** “promotion/finalization behavior remains stable on another feature”
- **Status:** **Not verifiable** with provided evidence; only Phase 7 contract text is available.