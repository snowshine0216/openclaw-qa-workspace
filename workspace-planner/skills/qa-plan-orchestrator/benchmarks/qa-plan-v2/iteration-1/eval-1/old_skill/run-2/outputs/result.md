# Benchmark Result — P0-IDEMPOTENCY-001 (BCIN-976)

## Verdict (phase0 / phase contract)
**FAIL (blocking).**

The provided workflow package establishes Phase 0 requirements for **REPORT_STATE classification** and **resume semantics** (including mandatory user choice handling + `apply_user_choice.sh` invocation for specific states). However, the benchmark evidence set contains **no Phase 0 run outputs** (e.g., `context/runtime_setup_BCIN-976.json`) and **no script stdout/state artifacts** (e.g., `task.json`, `run.json`) demonstrating that:

- `REPORT_STATE` is computed and persisted deterministically, and
- resume semantics (reuse/resume vs smart_refresh vs full_regenerate) remain stable across reruns.

Because this is a **phase contract** benchmark for **phase0**, and evidence mode is **blind pre defect**, the benchmark requires demonstrating the contract behaviors using artifacts/output aligned to phase0. With only the contract text and a Jira fixture present, **the stability/idempotency claim cannot be validated**.

## Required phase0 behaviors that must be evidenced (but are not present)
From the skill snapshot contract (SKILL.md + reference.md), Phase 0 must:

1. **Classify `REPORT_STATE`** as one of: `FINAL_EXISTS`, `DRAFT_EXISTS`, `CONTEXT_ONLY`, `FRESH`.
2. **Persist phase0 outputs** under `context/`:
   - `context/runtime_setup_<feature-id>.md`
   - `context/runtime_setup_<feature-id>.json` (must report `ok: true` per gate)
   - `context/supporting_issue_request_<feature-id>.md`
   - `context/request_fulfillment_<feature-id>.md`
   - `context/request_fulfillment_<feature-id>.json`
3. **Enforce resume semantics** when `REPORT_STATE` is `FINAL_EXISTS`, `DRAFT_EXISTS`, or `CONTEXT_ONLY`:
   - present options to the user
   - run `scripts/apply_user_choice.sh <mode> <feature-id> <run-dir>`
   - branch correctly:
     - `full_regenerate` → rerun phase0
     - `smart_refresh` → jump to phase2
     - `reuse`/`resume` → continue from current phase

**None of these outputs or interaction traces are provided in the benchmark evidence**, so the benchmark’s explicit focus (“REPORT_STATE and resume semantics remain stable”) is not demonstrably covered.

## Evidence alignment to BCIN-976 (what we do have)
Fixture evidence confirms the feature identity and family context but does not exercise Phase 0:

- `BCIN-976.issue.raw.json` — Jira issue payload for BCIN-976
- `BCIN-976.customer-scope.json` — indicates customer signals present and policy notes

These help initialize a run, but they do not constitute Phase 0 runtime state artifacts.

## What would be needed to pass this benchmark (phase0-aligned)
To demonstrate the benchmark focus, the evidence set would need one of:

- A Phase 0 run directory snapshot for BCIN-976 containing at minimum:
  - `context/runtime_setup_BCIN-976.json` (showing `report_state` and `ok: true`)
  - `task.json` (showing `report_state`, `current_phase`, and `selected_mode` after choice)
  - `run.json` (timestamps and any `blocking_issues` entries)
  - the Phase 0 context artifacts listed above

and, for idempotency/resume stability specifically, either:

- two consecutive Phase 0 executions showing stable `REPORT_STATE` classification given the same filesystem state, and/or
- an execution trace showing correct branching after `apply_user_choice.sh` for `DRAFT_EXISTS`/`CONTEXT_ONLY`/`FINAL_EXISTS`.

---

# Short execution summary
Assessed Phase 0 contract requirements from the authoritative skill snapshot and checked the provided BCIN-976 fixture bundle for Phase 0 runtime artifacts needed to verify `REPORT_STATE` classification and resume semantics stability. No Phase 0 outputs/state traces were included, so the benchmark focus cannot be validated; marked as blocking fail.