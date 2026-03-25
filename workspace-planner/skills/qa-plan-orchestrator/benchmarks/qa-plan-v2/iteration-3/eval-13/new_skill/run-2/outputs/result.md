# HOLDOUT-REGRESSION-001 — Holdout Regression Check (BCIN-6709, report-editor)

## Verdict (primary phase: **holdout**)
**PASS** — The qa-plan-orchestrator skill snapshot shows no workflow changes that would regress a *different feature planning flow* when operating on **report-editor** improvements. The orchestrator contract remains phase-script driven and feature-family/knowledge-pack routing is additive and scoped.

## What was checked (holdout focus)
This benchmark’s blocking requirement is:
> Skill improvements for **report-editor** do not regress a **different feature planning flow**.

Given evidence mode is **holdout_regression**, we limit to validating that the snapshot’s orchestrator behavior remains:
- **Phase-aligned** (orchestrator only calls `phaseN.sh`, handles spawn manifests, and runs `--post` per contract)
- **Feature-family/pack scoped** (report-editor additions don’t change other feature-family behavior)
- **No cross-feature coupling** introduced (no global assumptions that would break non-report-editor planning flows)

## Evidence-based findings
### 1) Orchestrator responsibilities remain narrow and phase-script driven
From `SKILL.md`, the orchestrator is constrained to:
1) call `phaseN.sh`
2) interact with user only for approvals / `REPORT_STATE` choices
3) spawn subagents strictly from `phaseN_spawn_manifest.json`, then call `phaseN.sh --post`

This design reduces the chance that report-editor-specific improvements leak into other feature flows because logic is pushed into per-phase scripts and manifests rather than hardcoded in the orchestrator.

### 2) Knowledge pack behavior is explicitly optional and resolution-scoped
From `reference.md`:
- Knowledge pack fields are **additive** to `task.json`/`run.json` and include a defined resolution source (`provided | feature_family | cases_lookup | default_general | null_pack`).
- Phase manifests carry pack metadata in a controlled way (Phase 1 gets summary; Phase 3 gets retrieval; later phases get retrieval + `knowledge_pack_active`).

This indicates report-editor pack activation is a *configuration outcome*, not a hardcoded orchestrator-only path that would affect unrelated features.

### 3) Report-editor deep-research policy is scoped and ordered, not globally invasive
The snapshot introduces a report-editor policy:
- “report-editor deep research must run `tavily-search` first and use `confluence` only as a recorded fallback”

This is expressed as a **deep_research_policy** field and phase-3 validation expectations. It should not regress other feature flows because:
- It is tied to **deep research topics** and pack usage (Phase 3 behavior), not the orchestrator loop itself.
- Non-report-editor features can resolve to different packs or `null_pack`, and the orchestrator still follows the same spawn/`--post` pattern.

### 4) Spawn contract is generalized and protects cross-feature stability
From `reference.md` spawn contract:
- Orchestrator must pass `requests[].openclaw.args` **exactly as-is** to `sessions_spawn`.
- Must **not** add `streamTo` (subagent runtime incompatibility).

This is a cross-feature stability safeguard; it reduces regression risk across all feature planning flows.

## Fixture check (cross-feature regression sensitivity)
The provided fixture (`embedding-dashboard-editor-compare-result/compare-result.md`) compares two plans emphasizing:
- report-editor breadth vs embedding-migration shell coverage
- risk of drift into “dashboard wording” within report-editor plans

This fixture reinforces the benchmark’s concern (cross-feature drift), but nothing in the orchestrator snapshot indicates new coupling that would force report-editor improvements to alter embedding/dashboard-editor planning flows.

## Holdout conclusion
Within holdout_regression evidence constraints, the orchestrator snapshot demonstrates **phase-aligned**, **feature-scoped**, and **pack-scoped** behavior. No evidence indicates a regression path where report-editor improvements would break or alter a different feature planning flow.