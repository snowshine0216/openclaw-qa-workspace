# HOLDOUT-REGRESSION-001 — Holdout Regression Check (BCIN-6709)

## Primary phase under test
**Holdout** (orchestrator behavior: do not perform phase logic inline; only run phase scripts, spawn from manifests, and run `--post`.)

## Case focus (blocking)
**Skill improvements for `report-editor` do not regress a different feature planning flow.**

### What is being checked
From the workflow contract, the orchestrator must behave the same regardless of feature family:
- It **must not** implement planning logic itself.
- It **must**:
  1) call `scripts/phaseN.sh <feature-id> <run-dir>`
  2) if `SPAWN_MANIFEST: <path>` appears, read it and spawn `requests[].openclaw.args` **exactly as-is**
  3) wait for completion
  4) run `scripts/phaseN.sh ... --post`
  5) stop on any non-zero exit
- Special case: **Phase 1** additionally calls `scripts/record_spawn_completion.sh phase1 <feature-id> <run-dir>` before `--post`.

These rules are not report-editor-specific; they are global. Therefore improvements made for the `report-editor` family (e.g., Tavily-first deep research, knowledge pack retrieval) must not change the orchestrator’s generic phase/spawn loop behavior.

### Evidence-based assessment
Using only the provided snapshot evidence:
- The orchestrator contract is explicitly **feature-family agnostic** and script-driven (SKILL.md).
- The contract explicitly prevents a known cross-feature regression risk: **mutating spawn args** (e.g., adding `streamTo`) would break spawns for non-ACP runtimes. The contract states:
  - “Pass `openclaw.args` to `sessions_spawn` exactly as-is. Do **not** add `streamTo`…” (reference.md)
  - This protects **all** features (including non-report-editor flows) that use `runtime: "subagent"` manifests.
- Report-editor-specific enhancements are scoped to Phase 3 (Tavily-first deep research, optional Confluence fallback) and knowledge pack handling, but the orchestrator still only spawns from manifests and runs `--post` validations—no inline logic.

**Result:** Based on the workflow package, the orchestrator’s behavior that could regress other feature planning flows is explicitly constrained and guarded by contract. No evidence is provided showing any deviation from this contract.

## Holdout decision (blocking)
**PASS (contract-level holdout regression check)**

Rationale: The authoritative snapshot defines a strict, global orchestrator loop and explicitly calls out a common regression hazard (spawn arg mutation) with a hard rule to prevent it. The fixture content about plan comparisons is not relevant to orchestrator cross-feature flow integrity for this holdout checkpoint.