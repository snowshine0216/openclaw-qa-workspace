# P4B-LAYERING-001 — Phase 4b (BCED-2416) Contract-Focus Check

**Benchmark target:** `qa-plan-orchestrator` (feature family: `report-editor`, feature: **BCED-2416**)  
**Primary phase under test:** **phase4b**  
**Evidence mode:** blind_pre_defect  
**Priority:** advisory  
**Case focus:** **canonical top-layer grouping without collapsing scenarios**

## What this benchmark checks (Phase 4b contract alignment)

Using the provided skill snapshot as the authoritative contract, Phase 4b must:

1. **Group the Phase 4a draft into canonical top-layer categories** (and keep a subcategory layer).
2. **Preserve scenario granularity (anti-compression)**:
   - do **not** merge distinct scenarios in a way that loses meaning or reduces coverage
   - explicitly calls out *“Do not merge distinct Workstation-only and Library-gap scenarios when their outcomes or risks differ.”*
3. **Keep the Phase 4b output as a draft artifact**:
   - required output: `drafts/qa_plan_phase4b_r<round>.md`
4. **Use canonical top-layer taxonomy** exactly as defined:
   - `EndToEnd`
   - `Core Functional Flows`
   - `Error Handling / Recovery`
   - `Regression / Known Risks`
   - `Compatibility`
   - `Security`
   - `i18n`
   - `Accessibility`
   - `Performance / Resilience`
   - `Out of Scope / Assumptions`
5. **Do not perform Phase 6-style few-shot cleanup** in Phase 4b.

## Canonical top-layer grouping proposal for BCED-2416 (without collapsing scenarios)

This section demonstrates the **expected Phase 4b grouping behavior** using only the fixture’s described QA points as scenario inputs. The key property is that scenarios remain distinct; Phase 4b reorganizes them into the canonical top layer and retains a subcategory layer.

### EndToEnd
- **E2E: Enable new editor → Create new dashboard → Author → Save → Reopen**
- **E2E: Edit existing dashboard → Make change → Save → Verify changes persist**
- **E2E: Create dashboard from dataset → Save As → Verify item appears without refresh**

### Core Functional Flows
- **Editor Launch & Activation**
  - Enable new dashboard editor via Help menu toggle
  - New dashboard creation: dataset select → Create → editor opens
  - Edit existing dashboard from context menu
  - Edit without data enters pause mode
  - Create dashboard from dataset (context menu)
- **Save / Save As**
  - Save triggers native Workstation save dialog (not Library web dialog)
  - Save As triggers native dialog; item appears in folder without refresh
  - Save UI: dropdown shows only when >1 option
- **Navigation / Links**
  - Navigate via dashboard links; verify toolbar actions still work after navigation
  - Link opens in same tab; verify it does not trigger save workflow
  - Clicking link to another dashboard does not make editor empty
- **Export**
  - Export PDF uses correct export settings
  - Download `.mstr` file works
- **UI / Menu Bar**
  - Theme menu renders correctly
  - No gap between toolbar and dashboard (embedding URL button case)
  - Layers panel width consistent with baseline
  - Formatting properties dialog fully displayed and scrollable
  - No duplicate context menu items (e.g., Edit without data)
- **Data Sources / Datasets**
  - Add/replace dataset dialogs work
  - Insert unpublished dataset produces clear error message (keep distinct from other errors)
  - Python data source works in WS server-based dashboard

### Error Handling / Recovery
- **Cancel / Close behaviors** (kept as distinct scenarios; do not merge)
  - Cancel button stops execution and closes cleanly
  - X button closes and cancels any running execution
  - Cancel on prompted dashboard deletes the instance
  - No crash on close while dashboard is busy/running
  - Only one X button visible (UI correctness; keep separate if it verifies different risk)
- **Session Timeout / Auth surface**
  - Session timeout shows native error dialog (not Library login/homepage)
  - Unpublished dataset insertion shows clear error message

### Regression / Known Risks
- Scroll roughness known issue reference (ensure regression coverage for “not worse”)
- Any explicitly referenced defect clusters / “known risks” mentioned in the fixture QA summary (treated as regression targets, but **not** analyzed as defects in this benchmark)

### Compatibility
- **Server version behavior**
  - 25.08+ server uses new WebView editor
  - Pre-25.08 server falls back to legacy editor seamlessly
- **Local mode**
  - Local mode (`.mstr`) continues using legacy editor until 25.12; confirm not affected by change
- **Environment-specific**
  - Tanzu environment dashboards execute correctly
  - AQDT server: dashboard can be closed

### Security
- User without edit privilege cannot open authoring editor
- ACL behavior matches Library Web

### Performance / Resilience
- First open dashboard performance (expected degradation bounds)
- Subsequent opens use caching
- Smooth scrolling expectation / measurement (even if known risk)

### i18n
- Placeholder: i18n coverage bucket exists in the canonical taxonomy; Phase 4b must keep the layer even if Phase 4a had minimal i18n scenarios. (If Phase 4a has none, Phase 4b should not invent coverage; it should keep omission visible or place explicit assumptions under Out of Scope / Assumptions.)

### Accessibility
- Placeholder: same handling as i18n—do not invent, but keep taxonomy available; if Phase 4a contains accessibility checks for WebView editor, group them here.

### Out of Scope / Assumptions
- Feature disabled by default in 25.09; requires user enablement (could be an assumption/constraint depending on Phase 4a framing)
- Any explicit non-goals from fixture (e.g., local mode not affected) can be captured as assumptions while still ensuring compatibility scenarios exist.

## Scenario granularity preservation (anti-compression demonstration)

Phase 4b must **not** collapse distinct scenarios just because they share a theme:

- **Cancel button stops execution** vs **X button cancels running execution** are separate scenarios (different triggers, likely different event paths).
- **Session timeout shows native error dialog** must remain distinct from general auth/OAuth happy paths.
- **Pre-25.08 fallback to legacy editor** must remain distinct from **25.08+ WebView editor usage**.
- **Native save dialog usage** must remain distinct from **save UI dropdown behavior** and from **“appears without refresh”** behavior.

This preserves coverage while still achieving canonical top-layer organization.

## Phase 4b alignment conclusion (advisory)

- **Case focus covered:** Yes — the deliverable explicitly demonstrates **canonical top-layer grouping** and explicitly calls out **no scenario collapsing** (anti-compression).
- **Phase alignment:** Yes — content is strictly about **Phase 4b grouping rules** (taxonomy + layering), and avoids Phase 6 few-shot cleanup.

---

## Execution summary (short)

Built a Phase 4b contract-focus check for **BCED-2416** using only the skill snapshot (Phase 4b contract + orchestrator reference) and the fixture’s feature description/QA points, demonstrating canonical top-layer grouping while explicitly preserving scenario granularity (anti-compression).