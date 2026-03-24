# HOLDOUT-REGRESSION-001 — Holdout Regression Check (BCIN-6709, report-editor)

## Primary phase under test: **holdout**

### Pass/Fail verdict (blocking)
**PASS (no regression demonstrated in holdout scope)**

### What this holdout regression is checking
This benchmark’s holdout-regression focus is:

- **Skill improvements for the `report-editor` family must not regress a different feature planning flow.**

Under the script-driven orchestrator contract, “not regressing a different planning flow” is primarily demonstrated by:

- Maintaining the **phase model boundaries** (orchestrator only runs `phaseN.sh`, spawns subagents from `phaseN_spawn_manifest.json`, then runs `phaseN.sh --post`).
- Ensuring **report-editor-specific enhancements** (e.g., Tavily-first deep research rules, report-editor knowledge pack references) remain scoped to the **appropriate phases** (notably Phase 3 deep research and later drafting/review phases), without altering unrelated feature-family flows.

### Evidence used (holdout_regression fixture)
The provided fixture (`embedding-dashboard-editor-compare-result/compare-result.md`) is a cross-feature comparison artifact contrasting two QA plans:

- **Plan 1**: stronger on **report-editor capability coverage** and executable steps.
- **Plan 2**: stronger on **embedding-migration shell / regression / routing** coverage.

Key signals relevant to cross-feature non-regression:

- The fixture explicitly identifies **two distinct planning flows** with different emphases:
  - Report-editor depth (objects, filters, prompts, SQL view, subtotals, formatting/themes, undo/redo, save/export, etc.).
  - Embedding/dashboard editor migration-shell concerns (toggle, routing, save/cancel ownership, perf, menu parity, auth/ACL, regression pools).
- The fixture recommends a **hybrid** approach:
  - Use the report-editor plan as base, *borrow* migration-shell/regression sections.

### Why this satisfies holdout regression expectations
- The orchestrator contract in the snapshot evidence is **phase-script driven** and **feature-family neutral** at the orchestration layer (it does not embed report-editor logic inline).
- Report-editor-specific policy (e.g., “Tavily-first deep research must run before Confluence fallback”) is defined as a **guardrail for report-editor deep research** (Phase 3), which does **not** inherently alter how a different feature-family plan would be orchestrated.
- The fixture confirms that **non-report-editor planning content** (embedding migration-shell/regression coverage) remains a separable, preservable planning flow, and can be imported without being overwritten by report-editor capability mapping.

### Holdout conclusion
Within the holdout-regression evidence provided, there is **no indication** that report-editor skill improvements collapse, replace, or otherwise regress a different feature planning flow (e.g., embedding/dashboard editor migration-shell planning). The comparison fixture reinforces that these flows remain distinguishable and can be combined intentionally rather than one unintentionally supplanting the other.