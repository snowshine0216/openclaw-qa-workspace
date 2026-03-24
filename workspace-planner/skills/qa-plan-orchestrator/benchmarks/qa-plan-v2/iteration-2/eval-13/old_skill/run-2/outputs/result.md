# HOLDOUT-REGRESSION-001 — Holdout Regression Check (BCIN-6709, report-editor)

## Primary checkpoint under test
**Phase model alignment:** This benchmark is explicitly scoped to the **holdout** phase/checkpoint.

## What is being validated (case focus)
**[holdout_regression][blocking]** Confirm that **skill improvements for the _report-editor_ feature family do not regress a different feature planning flow**.

This is a cross-feature regression guard: the orchestrator must keep the same strict, script-driven contract and must not “inline” planning logic or change behavior that would break planning for other feature families.

## Evidence used (authoritative)
Only the benchmark-provided evidence was used:

1) **Skill snapshot (qa-plan-orchestrator contract)**
- `skill_snapshot/SKILL.md`
- `skill_snapshot/reference.md`
- `skill_snapshot/README.md`

2) **Fixture reference (cross-feature comparison / expected non-regression context)**
- `fixture:embedding-dashboard-editor-compare-result/compare-result.md`

## Holdout regression assessment
### 1) Orchestrator contract remains cross-feature and script-driven
From `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md`, the orchestrator is constrained to:
- Call `scripts/phaseN.sh`.
- Spawn subagents strictly from `phaseN_spawn_manifest.json`.
- Wait for completion, then call `phaseN.sh --post`.
- **Not** perform phase logic inline, **not** write artifacts directly, **not** run validators directly, and **not** make per-phase decisions outside the script contract.

**Holdout regression conclusion:** These rules are **feature-family agnostic** and therefore protect “a different feature planning flow” from report-editor-specific logic accidentally leaking into the orchestrator.

### 2) Source routing and spawn contract are stable across features
From `skill_snapshot/reference.md`:
- Source routing is explicitly limited to the primary evidence skills (`jira-cli`, `confluence`, `github`, approved figma/browser).
- Spawn manifests must pass `requests[].openclaw.args` to `sessions_spawn` **exactly as-is**; specifically **do not add `streamTo`** for `runtime: "subagent"` manifests.

**Holdout regression conclusion:** This is an orchestrator-level integration constraint that applies to *all* feature families. Retaining it avoids regressions where non-report-editor planning flows would fail spawns.

### 3) Report-editor-specific research guardrails are isolated to deep research policy
The snapshot includes report-editor policy details (e.g., Tavily-first, Confluence fallback recording) as runtime inputs and phase-3 validation expectations.

Critically, per `SKILL.md`:
- The orchestrator itself does not implement this logic; it only runs phase scripts and spawns manifests.

**Holdout regression conclusion:** Report-editor improvements are implemented as **phase-script/subagent contract requirements**, not orchestrator logic. This minimizes risk of regressing other feature planning flows.

### 4) Fixture demonstrates cross-feature context (embedding/dashboard vs report-editor)
The fixture `embedding-dashboard-editor-compare-result/compare-result.md` compares a report-editor-heavy plan vs a migration/embedding-shell-heavy plan, highlighting differences in:
- report-editor capability breadth vs embedding-migration shell/regression focus
- how context evidence is translated to coverage

**Holdout regression implication:** The orchestrator must support both kinds of planning flows without bias (report breadth vs embedding shell regression framing). The snapshot contract remains neutral: the orchestrator doesn’t choose content strategy; it delegates to phase scripts/subagents.

## Pass/Fail determination (holdout)
**PASS (blocking holdout regression checkpoint satisfied)**

Rationale (based only on provided evidence):
- The orchestrator contract is explicitly **script-driven** and prohibits inline, feature-specific decisioning.
- The spawn manifest and routing rules are stable and **cross-feature**.
- Report-editor enhancements are framed as **runtime inputs and phase/subagent requirements**, not orchestrator logic, which reduces regression risk to other feature planning flows.

## Short execution summary
Reviewed the skill snapshot contract (SKILL.md/reference.md/README.md) and the provided embedding/dashboard vs report-editor comparison fixture to verify that report-editor-specific improvements are isolated to phase policy and do not alter the orchestrator’s cross-feature, script-driven workflow. Determination: **PASS** for holdout regression guard.