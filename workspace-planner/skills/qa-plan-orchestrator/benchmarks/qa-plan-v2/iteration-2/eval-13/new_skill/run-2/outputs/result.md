# HOLDOUT-REGRESSION-001 — Holdout Regression Check (BCIN-6709, report-editor)

## Primary checkpoint under test: **holdout**

### What this holdout regression is checking
This case verifies that **recent skill improvements for the `report-editor` feature family do not regress a different feature planning flow**.

Because the orchestrator is contractually constrained to:
- only call phase scripts,
- only handle user approvals/REPORT_STATE choices,
- only spawn subagents from manifests,

…the holdout focus is whether any of the **report-editor-specific additions** (knowledge pack behavior, Tavily-first deep research, etc.) improperly leak into or alter **other feature-family planning flows**.

## Evidence-based assessment (holdout)
Using only the provided skill snapshot and fixture evidence, the workflow package indicates **no cross-feature regression risk introduced by orchestrator logic**, because:

1. **Orchestrator behavior is feature-family agnostic by contract**
   - The orchestrator does not implement phase logic inline; it only runs `scripts/phaseN.sh` and follows spawn-manifest instructions (SKILL.md).
   - This architecture strongly limits accidental cross-feature behavioral drift at the orchestrator layer.

2. **Report-editor-specific behavior is isolated to phase scripts + manifests, not orchestrator branching**
   - Report-editor deep research constraints (“Tavily-first, Confluence fallback with insufficiency reason”) are explicitly Phase 3 artifact requirements and validations (SKILL.md, reference.md).
   - Knowledge-pack retrieval/indexing details are Phase 3 responsibilities (reference.md, README.md).
   - The orchestrator’s spawn behavior is strictly: read `requests[].openclaw.args` and pass through unchanged; no feature-family branching (reference.md).

3. **Cross-feature planning flows remain protected by fixed routing and tool constraints**
   - Source routing is restricted to specific evidence skills (Jira/Confluence/GitHub) and is described as a general workflow rule, not report-editor-only (reference.md).
   - The `sessions_spawn` contract is uniform and prohibits adding `streamTo`, preventing a class of runtime regressions that would affect any feature flow (reference.md).

## Fixture usage relevance
The fixture `embedding-dashboard-editor-compare-result/compare-result.md` demonstrates a **cross-feature boundary** between:
- a report-editor plan that is deep on report-editor capability families (Plan 1), and
- an embedding/migration-shell focused plan (Plan 2).

This supports the holdout-regression intent: improvements targeting report-editor depth should not distort planning for adjacent but different scopes (e.g., embedding/migration shell).

However, the fixture is comparative content evidence, not a script-run trace; it does not show an orchestrator malfunction.

## Holdout verdict (blocking priority)
**PASS (no regression indicated by provided evidence)**

Rationale: The provided authoritative workflow package shows the orchestrator is structurally prevented from embedding report-editor-specific logic into other feature flows; report-editor special handling is pushed into phase scripts, manifests, and validations. No evidence suggests the orchestrator changed in a way that could regress a different feature planning flow.

## Blockers / limits of this holdout result
- No phase script outputs, `run.json`, or spawn manifests for an actual non-report-editor feature run were provided; therefore this holdout verdict is limited to **contract inspection + fixture boundary evidence**, not an empirical A/B execution trace.