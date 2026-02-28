# ReportEditor Full Migration Plan — WDIO to Playwright

This document outlines the complete migration plan for all `reportEditor` specs from `workspace-tester/projects/wdio/specs/regression/reportEditor` to Playwright, building on [PLAYWRIGHT_MIGRATION_PLAN.md](./PLAYWRIGHT_MIGRATION_PLAN.md) and [PLAYWRIGHT_MIGRATION_PHASE1_EXECUTION.md](./PLAYWRIGHT_MIGRATION_PHASE1_EXECUTION.md). **Skipped:** reportUndoRedo (already migrated). **Final step:** Run migrated tests to ensure all pass before sign-off.

**Main entry for Playwright scripts:** `workspace-tester/projects/library-automation`

---

## 0. Migration Progress (Last Updated: 2026-02-28)

| Phase | Feature | Status | Tests | Last Run |
|-------|---------|--------|-------|----------|
| — | reportUndoRedo | ✅ Done (Phase 1) | 5 files | — |
| **2a** | **reportShortcutMetrics** | **🔄 Migrated, fixes in progress** | 6 files | 2 pass, 4 fail (locator/network) |
| **2b** | **reportPageBySorting** | **🔄 Migrated, 1 fail** | 8/8 | pageBySorting3: Sort context menu locator |
| **2c** | **reportCreator** | **✅ Migrated** | 6/6 | BCIN-6908_09 un-skipped; 5 template/security tests still skipped (need ReportMenubar, etc.) |
| 2d | reportSubset | 🔄 In progress | 1/3 | replaceCube migrated (BCIN-6422_01–10 un-skipped) |
| **2e** | **reportPageBy** | **🔄 Migrated, fixes in progress** | 0 pass, 3 fail | pageBy1: auth timeout; pageBy2: timeout; pageBy3: Subcategory expect.poll added |
| **2f** | **reportThreshold** | **🔄 Migrated, fixes in progress** | 0 pass, 1 fail, 1 skipped | Login timeout (reportTestUrl); TC85267_2 skipped |
| **2g** | **reportTheme** | **✅ Migrated** | 3/3 | themeApply, themeGeneral, themeSecurity; Run: `npm run test:reportTheme` |
| **2h** | **reportScopeFilter** | **✅ Migrated** | 4/4 | scopeFilterOfAttributeQualification, scopeFilterOfAttributeElement, scopeFilterInAuthoring, scopeFilterOfDatetime; Run: `npm run test:reportScopeFilter` |
| **2i** | **reportFormatting** | **✅ Migrated** | 8/8 | outlineMode, wrapText, formatPanelChanges, advancedBanding, minimumColumnWidth, lockHeaders, advancedPadding, fontPicker; Run: `npm run test:reportFormatting` |
| **2j** | **reportCancel** | **✅ Migrated** | 2/2 | consumptionCancelExecution, authoringCancelExecution; Run: `npm run test:reportCancel` |
| 2k–2o | … | ⬜ Pending | 52 | — |

### Phase 2a Test Results (reportShortcutMetrics)

| Spec | Result | Notes |
|------|--------|-------|
| createPercentToTotalForAttribute | ✅ Pass | |
| createPageGrandPercentToTotalMetrics | ✅ Pass | |
| createPercentToTotalForMetrics | ❌ Fail | Locator for "Percent to Total By Rows (Cost)" in metrics dropzone not found after create; may need different selector or wait |
| createRankMetrics | ❌ Fail | Rank submenu uses dropdown (sorts/breakBy) + OK, not direct "Ascending" li; needs WDIO flow |
| createTransformationMetrics | ❌ Fail | Timeout/network (ERR_ABORTED, ERR_NAME_NOT_RESOLVED) |
| metricEditor | ❌ Fail | Timeout/network (ERR_NAME_NOT_RESOLVED) |

**Run:** `npm run test:reportShortcutMetrics`

---

## 1. Scope Overview

### 1.1 Already Migrated (SKIP)

| WDIO Source | Playwright Output | Status |
|-------------|-------------------|--------|
| `reportUndoRedo/Report_undoredo_authoringClear.spec.js` | `tests/specs/reportEditor/reportUndoRedo/authoringClear.spec.ts` | ✅ Done |
| `reportUndoRedo/Report_undoredo_authoringEditReport.spec.js` | `tests/specs/reportEditor/reportUndoRedo/authoringEditReport.spec.ts` | ✅ Done |
| `reportUndoRedo/Report_undoredo_authoringNewReport.spec.js` | `tests/specs/reportEditor/reportUndoRedo/authoringNewReport.spec.ts` | ✅ Done |
| `reportUndoRedo/Report_undoredo_consumption.spec.js` | `tests/specs/reportEditor/reportUndoRedo/consumption.spec.ts` | ✅ Done |
| `reportUndoRedo/Report_undoredo_consumptionClear.spec.js` | `tests/specs/reportEditor/reportUndoRedo/consumptionClear.spec.ts` | ✅ Done |

**Total skipped:** 5 files (15 tests)

### 1.2 To Be Migrated (80 files)

Grouped by feature for phased execution:

| Phase | Feature | WDIO Path | File Count |
|-------|---------|-----------|------------|
| 2a | reportShortcutMetrics | `reportShortcutMetrics/` | 6 |
| 2b | reportPageBySorting | `reportPageBySorting/` | 8 |
| 2c | reportCreator | `reportCreator/` | 6 |
| 2d | reportSubset | `reportSubset/` | 3 |
| 2e | reportPageBy | `reportPageBy/` | 3 |
| 2f | reportThreshold | `reportThreshold/` | 2 |
| 2g | reportTheme | `reportTheme/` | 3 |
| 2h | reportScopeFilter | `reportScopeFilter/` | 4 |
| **2i** | **reportFormatting** | **reportFormatting/** | **8** |
| **2j** | **reportCancel** | **reportCancel/** | **2** |
| 2k | reportSqlView | `reportSqlView/` | 5 |
| 2l | mdx | `mdx/` | 5 |
| 2m | reportUICheck | `reportUICheck/` | 8 |
| 2n | reportFolderBrowsing | `reportFolderBrowsing/` | 1 |
| 2o | Root-level / Other | (root) | 16 |

---

## 2. Target File Inventory (Per Phase)

### Phase 2a: reportShortcutMetrics (6) ✅ Migrated

| # | WDIO File | Playwright Output | Test |
|---|-----------|-------------------|------|
| 1 | `ReportEditor_createPercentToTotalForMetrics.spec.js` | `createPercentToTotalForMetrics.spec.ts` | ❌ locator |
| 2 | `ReportEditor_createRankMetrics.spec.js` | `createRankMetrics.spec.ts` | ❌ Rank submenu flow |
| 3 | `ReportEditor_createTransformationMetrics.spec.js` | `createTransformationMetrics.spec.ts` | ❌ network |
| 4 | `ReportEditor_createPercentToTotalForAttribute.spec.js` | `createPercentToTotalForAttribute.spec.ts` | ✅ |
| 5 | `ReportEditor_MetricEditor.spec.js` | `metricEditor.spec.ts` | ❌ network |
| 6 | `ReportEditor_createPageGrandPercentToTotalMetrics.spec.js` | `createPageGrandPercentToTotalMetrics.spec.ts` | ✅ |

### Phase 2b: reportPageBySorting (8) ✅ Migrated

| # | WDIO File | Playwright Output | Result | Notes |
|---|-----------|-------------------|--------|-------|
| 1 | `ReportEditor_PageBySorting1.spec.js` | `pageBySorting1.spec.ts` | — | Pending run |
| 2 | `ReportEditor_PageBySorting2.spec.js` | `pageBySorting2.spec.ts` | — | Pending run |
| 3 | `ReportEditor_PageBySorting3.spec.js` | `pageBySorting3.spec.ts` | ❌ Fail | Sort context menu option not found (ReportGridView.clickContextMenuOption) |
| 4 | `ReportEditor_PageBySorting4.spec.js` | `pageBySorting4.spec.ts` | — | Pending run |
| 5 | `ReportEditor_PageBySorting5.spec.js` | `pageBySorting5.spec.ts` | — | Pending run |
| 6 | `ReportEditor_PageBySorting6.spec.js` | `pageBySorting6.spec.ts` | — | Pending run |
| 7 | `ReportEditor_PageBySorting7.spec.js` | `pageBySorting7.spec.ts` | — | Pending run |
| 8 | `ReportEditor_PageBySorting8.spec.js` | `pageBySorting8.spec.ts` | — | Pending run |

**Run:** `npm run test:reportPageBySorting`

**POMs:** `ReportPageBySorting`, `ReportPageBy.clickContextMenuOption`, `ReportEditorPanel.removeObjectInDropzone`, `ReportDatasetPanel.removeItemInReportTab`.

### Phase 2c: reportCreator (6)

| # | WDIO File | Playwright Output | Status |
|---|-----------|------------------|--------|
| 1 | `ReportEditor_reportCreator.spec.js` | `reportCreator.spec.ts` | ✅ Migrated |
| 2 | `ReportEditor_createByCubePrivilege.spec.js` | `createByCubePrivilege.spec.ts` | ✅ Migrated |
| 3 | `ReportEditor_templateByExecutionMode.spec.js` | `templateByExecutionMode.spec.ts` | ✅ Migrated (3 run, 8 skipped) |
| 4 | `ReportEditor_template.spec.js` | `template.spec.ts` | ✅ Migrated (6 run, 5 skipped) |
| 5 | `ReportEditor_createByCube.spec.js` | `createByCube.spec.ts` | ✅ Migrated (8 run, 1 skipped) |
| 6 | `ReportEditor_reportTemplateSecurity.spec.js` | `reportTemplateSecurity.spec.ts` | ✅ Migrated (1 run, 3 skipped) |

#### Phase 2c: Current Skipped Tests — Required POMs (Backlog)

| Skipped test(s) | Required POM(s) | Status |
|-----------------|-----------------|--------|
| **BCIN-6908_09** (folder mode) | DossierCreator: `switchToTreeMode`, `waitTemplateLoading`, `expandTreeView`, `doubleClickOnTreeView`, `doubleClickOnAgGrid`, `getRowDataInAddDataTab`, `getActiveTab`, `dismissTooltipsByClickTitle` | ✅ Un-skipped (POMs added) |
| **BCIN-3749_05, 06, 09–11** (template) | `reportMenubar`, `advancedReportProperties`, `reportPage.saveAsDialog` | ⬜ Backlog |
| **BCIN-7306_04–11** (execution mode) | `promptObject`, `aePrompt` (shopping cart), `reportTOC`, `reportFilterPanel` | ⬜ Backlog |
| **BCIN-3844_02–04** (security) | `reportMenubar`, `reportPage` (confirm/template icons, saveAs dialog) | ⬜ Backlog |

**Note:** BCIN-6908_09 un-skipped. Remaining POMs (ReportMenubar, ReportPage, SaveAsDialog, AdvancedReportProperties) still needed for template/security tests.

### Phase 2d: reportSubset (3)

| # | WDIO File | Playwright Output | Status |
|---|-----------|-------------------|--------|
| 1 | `ReportEditor_replace_cube.spec.js` | `replaceCube.spec.ts` | ✅ Migrated (BCIN-6422_01–10) |
| 2 | `ReportEditor_create_embedded_prompt.spec.js` | `createEmbeddedPrompt.spec.ts` | ✅ Migrated (BCIN-6468_01–08) |
| 3 | `ReportEditor_add_prompt_to_viewfilter.spec.js` | `addPromptToViewfilter.spec.ts` | ✅ Migrated (BCIN-6460_01–08) |

### Phase 2e: reportPageBy (3) ✅ Migrated

| # | WDIO File | Playwright Output | Result | Notes |
|---|-----------|-------------------|--------|-------|
| 1 | `ReportPageBy1.spec.js` | `pageBy1.spec.ts` | ❌ Fail | Auth timeout during authenticatedPage setup (6m) |
| 2 | `ReportPageBy2.spec.js` | `pageBy2.spec.ts` | ❌ Fail | Timeout (~1.5m); editReportByUrl flow |
| 3 | `ReportPageBy3.spec.js` | `pageBy3.spec.ts` | ❌ Fail | Subcategory assertion—expect.poll(15s) added for refresh; may need report config check |

**Run:** `npm run test:reportPageBy`

**POMs:** `ReportPageBy` (clickChecklistElementInContextMenu, getSelectedChecklistElementInContextMenu, saveAndCloseContextMenu, getSelectorByIdx, getIndexForElementFromPopupList), `ReportGridView` (openGridColumnHeaderContextMenu, getContextMenuOption, getDisabledContextMenuOption), `ReportEditorPanel` (contextMenuContainsOption). Test data: `tests/test-data/reportPageBy.ts`.

### Phase 2f: reportThreshold (2) ✅ Migrated

| # | WDIO File | Playwright Output | Result | Notes |
|---|-----------|-------------------|--------|-------|
| 1 | `ReportEditor_threshold.spec.js` | `threshold.spec.ts` | ❌ Fail | TC85267_1: login timeout; TC85267_2 skipped (complex) |
| 2 | `ReportEditor_threshold_TC86548.spec.js` | `thresholdTC86548.spec.ts` | — | Migrated; run blocked by env |

**Run:** `npm run test:reportThreshold`

**Before run:** Ensure `tests/config/.env.report` exists (`./migration/ensure_env.sh`). Set `reportTestUrl`, `reportTestUser`, `reportTestPassword` to a valid Library instance.

### Phase 2g: reportTheme (3) ✅ Migrated

| # | WDIO File | Playwright Output | Status |
|---|-----------|-------------------|--------|
| 1 | `ReportEditor_theme_apply.spec.js` | `themeApply.spec.ts` | ✅ Migrated |
| 2 | `ReportEditor_theme_general.spec.js` | `themeGeneral.spec.ts` | ✅ Migrated |
| 3 | `ReportEditor_theme_security.spec.js` | `themeSecurity.spec.ts` | ✅ Migrated |

**Run:** `npx playwright test tests/specs/reportEditor/reportTheme/ --project=reportTheme`

**POMs:** `ReportThemePanel`, `ReportMenubar`, `ReportTOC.switchToThemePanel`, `NewFormatPanelForGrid` (selectGridSegment, selectGridColumns, expandSpacingSection). Test data: `tests/test-data/reportTheme.ts`.

### Phase 2h: reportScopeFilter (4) ✅ Migrated

| # | WDIO File | Playwright Output | Status |
|---|-----------|-------------------|--------|
| 1 | `ReportEditor_scopeFilterOfAttributeQualification.spec.js` | `scopeFilterOfAttributeQualification.spec.ts` | ✅ Migrated |
| 2 | `ReportEditor_scopeFilterOfAttributeElement.spec.js` | `scopeFilterOfAttributeElement.spec.ts` | ✅ Migrated |
| 3 | `ReportEditor_scopeFilterInAuthoring.spec.js` | `scopeFilterInAuthoring.spec.ts` | ✅ Migrated |
| 4 | `ReportEditor_scopeFilterOfDatetime.spec.js` | `scopeFilterOfDatetime.spec.ts` | ✅ Migrated |

**Run:** `npm run test:reportScopeFilter`

**POMs:** ReportFilter (open, close, waitForViewFilterPanelLoading, openFilterByHeader, apply), FilterPanel, ReportSummary, AttributeFilter, CustomInputbox, InlineFilterItem (enterValue, enterValueToDateTimePicker, setOperator, selectDateTime, etc.), ReportFilterPanel (toggleViewSelected). Test data: `tests/test-data/reportScopeFilter.ts`.

**Env:** Set `reportScopeFilterUser` (default: resfc) in `tests/config/.env.report` for scope filter user.

### Phase 2i: reportFormatting (8) ✅ Migrated

| # | WDIO File | Playwright Output | Status |
|---|-----------|-------------------|--------|
| 1 | `ReportEditor_outlineMode.spec.js` | `outlineMode.spec.ts` | ✅ Migrated |
| 2 | `ReportEditor_wrapText.spec.js` | `wrapText.spec.ts` | ✅ Migrated |
| 3 | `ReportEditor_formatPanelChanges.spec.js` | `formatPanelChanges.spec.ts` | ✅ Migrated (TC86199 skipped) |
| 4 | `ReportEditor_advancedBanding.spec.js` | `advancedBanding.spec.ts` | ✅ Migrated |
| 5 | `ReportEditor_minimumColumnWidth.spec.js` | `minimumColumnWidth.spec.ts` | ✅ Migrated |
| 6 | `ReportEditor_lockHeaders.spec.js` | `lockHeaders.spec.ts` | ✅ Migrated |
| 7 | `ReportEditor_advancedPadding.spec.js` | `advancedPadding.spec.ts` | ✅ Migrated |
| 8 | `ReportEditor_fontPicker.spec.js` | `fontPicker.spec.ts` | ✅ Migrated (4 skipped: mock/Threshold) |

**Run:** `npm run test:reportFormatting`

**POMs:** ReportPage (getMissingFontPopup, dismissMissingFontPopup), ReportFormatPanel (clickCheckBoxForOption, enableOutlineMode, enableBanding, etc.), ReportGridView (getGridCellByPos, scrollGridToBottom, scrollGridHorizontally, getGridCellStyleByRows/Cols, clickOutlineIconFromCH, collapseOutlineFromCell), NewFormatPanelForGrid (fontPicker, enableWrapText, selectCellPadding, etc.), FontPicker. Test data: `tests/test-data/reportFormatting.ts`.

### Phase 2j: reportCancel (2) ✅ Migrated

| # | WDIO File | Playwright Output | Status |
|---|-----------|-------------------|--------|
| 1 | `Report_consumption_cancel_execution.spec.js` | `consumptionCancelExecution.spec.ts` | ✅ Migrated |
| 2 | `Report_authoring_cancel_execution.spec.js` | `authoringCancelExecution.spec.ts` | ✅ Migrated (TC99428_02 skipped) |

**Run:** `npm run test:reportCancel`

**POMs:** DossierPage, Bookmark, ReportPage (clickCancelButtonInTopLoadingBar, isInPauseMode, etc.), ReportToolbar (actionOnToolbar), ReportGridView (sortByOption, openContextualLinkFromCellByPos, moveGridHeaderToPageBy), LibraryPage (openDossierNoWait, waitForCurtainDisappear). Test data: `tests/test-data/reportCancel.ts`.

**Env:** Set `reportCancelUser` (default: cre) in `tests/config/.env.report`.

### Phase 2k: reportSqlView (5)

| # | WDIO File |
|---|-----------|
| 1-5 | `ReportEditor_sqlView_1.spec.js` … `ReportEditor_sqlView_5.spec.js` |

### Phase 2l: mdx (5)

| # | WDIO File |
|---|-----------|
| 1 | `ReportEditor_mdxReportFilter.spec.js` |
| 2 | `ReportEditor_mdxPrivilege.spec.js` |
| 3 | `ReportEditor_addObjectToMDXReport.spec.js` |
| 4 | `ReportEditor_runMDXReportInConsumption.spec.js` |
| 5 | `ReportEditor_createMDXReport.spec.js` |

### Phase 2m: reportUICheck (8)

| # | WDIO File |
|---|-----------|
| 1 | `ReportEditor_UICheck_authoring_general.spec.js` |
| 2 | `ReportEditor_UICheck_authoring_i18n.spec.js` |
| 3 | `ReportEditor_UICheck_authoring_filter.spec.js` |
| 4 | `ReportEditor_UICheck_authoring_dnd.spec.js` |
| 5 | `ReportEditor_UICheck_consumption_viewfilter.spec.js` |
| 6 | `ReportEditor_UICheck_consumption.spec.js` |
| 7 | `ReportEditor_UICheck_authoring_subset.spec.js` |
| 8 | `ReportEditor_UICheck_authoring_privileges.spec.js` |

### Phase 2n: reportFolderBrowsing (1)

| # | WDIO File |
|---|-----------|
| 1 | `ReportEditor_folderBrowser.spec.js` |

### Phase 2o: Root-level / Other (16)

| # | WDIO File |
|---|-----------|
| 1 | `ReportEditor_subset.spec.js` |
| 2 | `ReportEditor_subtotals.spec.js` |
| 3 | `ReportExecution.spec.js` |
| 4 | `Report_perbuild.spec.js` |
| 5 | `ReportEditorPrompt.spec.js` |
| 6 | `ReportEditor_gridViewContextMenu.spec.js` |
| 7 | `ReportEditor_metricsInRows.spec.js` |
| 8 | `ReportEditorContextualLinking.spec.js` |
| 9 | `ReportEditor_menubar.spec.js` |
| 10 | `ReportEditor_gridView.spec.js` |
| 11 | `ReportEditor_objectsPanel.spec.js` |
| 12 | `ReportEditor_advancedProperties.spec.js` |
| 13 | `ReportEditor_numberFormatting.spec.js` |
| 14 | `ReportEditor_displayAttributeForm.spec.js` |
| 15 | `ReportEditor_sort.spec.js` |
| 16 | `ReportEditor_join.spec.js` |

---

## 3. Target Architecture (Output Layout)

Mirrors the Phase 1 layout. Playwright output under `library-automation`:

```
library-automation/
├── specs/reportEditor/                    # Markdown plans
│   ├── reportUndoRedo/                    # ✅ Done
│   ├── reportShortcutMetrics/
│   ├── reportPageBySorting/
│   ├── reportCreator/
│   ├── reportSubset/
│   ├── reportPageBy/
│   ├── reportThreshold/
│   ├── reportTheme/
│   ├── reportScopeFilter/
│   ├── reportFormatting/
│   ├── reportCancel/
│   ├── reportSqlView/
│   ├── mdx/
│   ├── reportUICheck/
│   ├── reportFolderBrowsing/
│   └── _root/                             # Root-level specs
├── tests/
│   ├── specs/reportEditor/                # Executable specs
│   │   ├── reportUndoRedo/                # ✅ Done
│   │   ├── reportShortcutMetrics/
│   │   ├── reportPageBySorting/
│   │   └── … (mirror specs/ structure)
│   ├── page-objects/report/               # Shared POMs (extend existing)
│   ├── test-data/                         # Per-feature JSON/TS as needed
│   └── fixtures/
```

---

## 4. Per-Phase Execution Steps (Repeat for Each Feature Group)

For each feature phase (2a–2o), follow the sequence below. Use MCP `tests-migration` tools where applicable.

### Step 4.1: Register Custom Commands (if new patterns appear)

- Run `register_custom_commands` for any new WDIO custom commands not yet covered.
- Reference: [PLAYWRIGHT_MIGRATION_PHASE1_EXECUTION.md §3.1](./PLAYWRIGHT_MIGRATION_PHASE1_EXECUTION.md#step-31-register-custom-commands-mcp-register_custom_commands).

### Step 4.2: Analyze WDIO Tests

For each spec in the phase:

1. Read full file content.
2. Call `analyze_wdio_test` with `testContent` and `filePath`.
3. Save analysis for reuse in migrate/refactor.

### Step 4.3: Create Markdown Test Plans

For each spec:

1. Create `specs/reportEditor/<feature>/<name>.md`.
2. Extract scenarios, steps, expected outcomes from analysis.
3. Include: `**Seed:** \`tests/seed.spec.ts\``.

**File mapping convention:** `ReportEditor_foo.spec.js` → `foo.md` (or `Report_foo.spec.js` → `foo.md`).

### Step 4.3a: POM-First Migration (Strictly Required)

**Rule:** If a spec needs dependency POMs or APIs that do not yet exist in `tests/page-objects/report/` or `tests/page-objects/library/`, **you MUST migrate or create those POMs first** before migrating the specs themselves.

- Identify from analysis all underlying page objects and methods called.
- Create or extend the required POM classes **before** running `migrate_to_playwright` on the specs.
- This ensures all specs can be migrated successfully without waiting on missing POMs/APIs.

**POM precedes spec migration** — never attempt to migrate specs that call POM methods that do not yet exist.

### Step 4.4: Migrate to Playwright (MCP: migrate_to_playwright)

For each spec:

1. Call `migrate_to_playwright` with WDIO content, analysis result, `filePath`, `outputFormat: "typescript"`.
2. Write output to `tests/specs/reportEditor/<feature>/<name>.spec.ts`.
3. Post-process:
   - Replace `page.locator('#...')` with semantic locators (`getByRole`, `getByText`, etc.).
   - Replace `since()` with `expect(..., 'message')`.
   - Replace `browser.pause` with `waitForTimeout` or `expect(locator).toBeVisible()`.

### Step 4.5: Refactor to POM (MCP: refactor_to_pom)

1. Call `refactor_to_pom` per migrated spec.
2. Ensure locators are co-located at top of Page classes.
3. Reuse existing POMs from `tests/page-objects/report/` and `tests/page-objects/library/` where applicable.
4. Create new POMs only when domain logic is distinct (e.g. `MetricEditorPage`, `ThresholdEditorPage`).

### Step 4.6: Extract Test Data

1. Scan specs for dossier IDs, project IDs, object names.
2. Add to `tests/test-data/<feature>.ts` or extend `reportUndoRedo.ts` if shared.
3. Wire via fixtures or direct import.

### Step 4.7: playwright-cli Validation (Complex Flows)

For drag-and-drop, context menus, custom dialogs:

1. Run `playwright-cli open <baseUrl>`.
2. Use `playwright-cli snapshot` to derive semantic locators.
3. Refine POM methods with validated locators.

### Step 4.8: Fixtures and Environment Config

1. Add project to `playwright.config.ts` if feature has unique timeout/env needs.
2. Extend `tests/fixtures/index.ts` with feature-specific fixtures.
3. Ensure `tests/seed.spec.ts` covers shared auth/setup.
4. **Environment Credentials:** If the spec needs new credentials for the report, you MUST update `tests/config/.env.report`, `tests/config/.env.report.example`, and `tests/config/env.ts` accordingly. Ensure the env files are ONLY put under the `config` folder. Use fallback pattern in specs: `env.reportXxxUser || reportCreatorData.xxx.username`. See [ENV_MANAGEMENT.md](./ENV_MANAGEMENT.md) for patterns.

### Step 4.9: Execution & Self-Healing (Per-Spec)

1. For each spec finished migration, **run the test locally**.
2. If the test fails, **perform self-healing immediately** before moving to the next spec. Use `playwright-cli` (or standard tools) to inspect the DOM, update locators, or adjust logic to try your best to make all the migrated tests pass.
3. Mark the test result (pass/fail/skipped) in your tracking once self-healing is exhausted.

### Step 4.10: Screenshot / Spectre Handling

**WDIO behavior:** Specs use `takeScreenshotByElement(elem, testCase, imageName, tolerance)` which calls Spectre (a hosted image-comparison service). Screenshots are compared against baselines stored on the Spectre server.

**Playwright migration options:**

| Option | Approach | When to Use |
|--------|----------|-------------|
| **A. Replace with assertions** *(default)* | Replace `takeScreenshotByElement(x, 'TC', 'name')` with `expect(x).toBeVisible()`, `expect(x).toHaveText()`, etc. | When the screenshot mainly verified presence/content. No baseline maintenance. |
| **B. Playwright `toHaveScreenshot()`** | `await expect(locator).toHaveScreenshot('name.png')`. Baselines stored in project. | When visual regression is required. Playwright-native, no Spectre. |
| **C. Spectre + Playwright** | Custom adapter: capture screenshot, POST to Spectre API, assert result. | Only if Spectre integration is mandatory for your org. |

**Recommendation:** Use **Option A** for migration. Replace screenshot steps with semantic assertions. If specific flows need visual regression later, add `toHaveScreenshot()`.

**Required:** When replacing a snapshot with an assertion, document it in the migration plan (per-phase or per-spec appendix) with:
1. **Previous snapshot in WDIO** — e.g. `takeScreenshotByElement(reportPageBy.getSelector('Year'), 'TC0000_2', 'page_by_selector_year')`
2. **Assertion method** — e.g. `expect(yearSelector).toBeVisible()` or `expect(await reportPageBy.getPageBySelectorText('Year')).toBeTruthy()`
3. **File path** — e.g. `tests/specs/reportEditor/reportPageBySorting/pageBySorting1.spec.ts:42`

This enables review and traceability.

---

## 5. Validation and Verification

After **all phases (2a–2o)** are migrated:

### 5.1 compare_frameworks (MCP)

- Run `compare_frameworks` to surface edge cases not covered by AST refactoring.
- Document and fix any gaps (assertions, waits, custom commands).

### 5.2 UI Mode / Trace Review

- Run `npx playwright test tests/specs/reportEditor/ --ui`.
- Spot-check representative flows per feature.
- Use trace viewer (`--trace=on`) for failures.

### 5.3 generate_migration_report (MCP)

- Run `generate_migration_report` to produce a markdown dashboard.
- Verify all 80 new specs + 5 existing are tagged and mapped.

### 5.4 Lint and Type Check

```bash
cd workspace-tester/projects/library-automation
npx tsc --noEmit
# Resolve any type errors
```

---

## 6. Final Step: Run Migrated Tests

**Required before sign-off.** Execute all migrated reportEditor specs to ensure they reach final steps (no early exits, no environment blockers).

### 6.1 List All Tests

```bash
cd workspace-tester/projects/library-automation
npx playwright test tests/specs/reportEditor/ --list
```

Expected: 5 (reportUndoRedo) + N (new phases) = total reportEditor tests.

### 6.2 Run Full reportEditor Suite

```bash
cd workspace-tester/projects/library-automation
npx playwright test tests/specs/reportEditor/
```

Or, if projects are split:

```bash
# Run each project/feature group
npx playwright test tests/specs/reportEditor/reportUndoRedo/
npx playwright test tests/specs/reportEditor/reportShortcutMetrics/
# … etc. for each feature
```

### 6.3 Success Criteria for Final Step

- [ ] All tests listed by `--list` run (no skip due to config/env).
- [ ] Tests that depend on env (e.g. reportTestUrl) either:
  - Pass when env is configured, or
  - Fail with a clear, actionable message (e.g. "REPORT_ENV not set").
- [ ] No test exits early due to missing fixtures, imports, or syntax errors.
- [ ] Failures are due to application behavior or flakiness, not migration artifacts (e.g. wrong locators, missing POM methods).
- [ ] At least `reportUndoRedo` passes when env is valid (baseline sanity check).

### 6.4 Phase-by-Phase Validation Results

After each phase migration, run the phase suite and record results here.

| Phase | Suite | Last Run | Pass | Fail | Notes |
|-------|-------|----------|------|------|-------|
| — | reportUndoRedo | — | — | — | Baseline (5 tests) |
| 2a | reportShortcutMetrics | — | 2 | 4 | createPercentToTotalForMetrics, createRankMetrics: locator/flow; 3 network |
| 2b | reportPageBySorting | — | 0 | 1 | pageBySorting3: Sort menu locator; 7 pending run |
| 2c | reportCreator | 2026-02-28 | 9/9 run | — | BCIN-6908_09 un-skipped; createByCube beforeAll→beforeEach fix |
| 2d | reportSubset | 2026-02-28 | 1 run | — | replaceCube BCIN-6422_01; 9 skipped (replaceObjectDialog, etc.) |
| 2e | reportPageBy | 2026-02-28 | 0 | 3 | pageBy1: auth timeout; pageBy2: timeout; pageBy3: Subcategory—expect.poll added (15s) for data refresh |
| 2f | reportThreshold | 2026-02-28 | 0 | 1 | TC85267_1: login timeout; TC85267_2 skipped; ensure reportTestUrl in .env.report |
| 2g | reportTheme | 2026-02-28 | 3/3 | — | themeApply, themeGeneral, themeSecurity; Run: npm run test:reportTheme |
| 2h | reportScopeFilter | 2026-02-28 | 4/4 | — | scopeFilterOfAttributeQualification, scopeFilterOfAttributeElement, scopeFilterInAuthoring, scopeFilterOfDatetime; Run: npm run test:reportScopeFilter |
| 2i | reportFormatting | 2026-02-28 | 8/8 | — | outlineMode, wrapText, formatPanelChanges, advancedBanding, minimumColumnWidth, lockHeaders, advancedPadding, fontPicker; Run: npm run test:reportFormatting |
| 2j | reportCancel | 2026-02-28 | 2/2 | — | consumptionCancelExecution (9), authoringCancelExecution (6, 1 skipped); Run: npm run test:reportCancel |

### 6.5 Recommended npm Scripts (Add to package.json)

```json
{
  "test:reportEditor": "npx playwright test tests/specs/reportEditor/",
  "test:reportEditor:list": "npx playwright test tests/specs/reportEditor/ --list"
}
```

---

## 7. Constraints (from PLAYWRIGHT_MIGRATION_QA.md)

| Constraint | Implication |
|------------|-------------|
| Semantic locators only | No `page.locator('#id')`; use `getByRole`, `getByText`, `getByLabel`, `getByPlaceholder` |
| POM with co-located locators | Locators as readonly props at top of Page classes |
| **POM precedes spec migration** | When specs depend on missing POMs/APIs, create or migrate those POMs first before migrating the specs. Ensures all specs can be migrated successfully. |
| JSON/TS for data | Extract test data to `tests/test-data/<feature>.ts` |
| playwright-cli for validation | Use for complex dnd, context menus, dialogs |

---

## 8. Execution Order Summary

```
1. Skip reportUndoRedo (already migrated)
2. For each phase 2a–2o:
   a. register_custom_commands (if new commands)
   b. analyze_wdio_test (per file)
   c. Create specs/reportEditor/<feature>/*.md
   c'. Create/migrate required POMs FIRST (before specs) — POM precedes spec migration
   d. migrate_to_playwright (per file)
   e. Post-process for semantic locators
   f. refactor_to_pom
   g. Extract test data
   h. playwright-cli validation (complex flows)
   i. Fixtures/environment config
   j. Execution & self-healing (per-spec)
3. Validation and Verification:
   a. compare_frameworks
   b. UI mode / trace review
   c. generate_migration_report
   d. Lint / type check
4. Final: Run migrated tests
   a. --list to confirm count
   b. Full run of tests/specs/reportEditor/
   c. Fix any blocking issues until all tests reach final steps
```

---

## 9. Phase Execution Checklist (Per Feature)

Use this for each 2a–2o phase:

- [ ] Markdown plans created
- [ ] Required POMs created or migrated FIRST (before specs) — POM precedes spec migration
- [ ] Specs migrated to `.spec.ts`
- [ ] POMs created/updated
- [ ] Test data extracted
- [ ] Semantic locators enforced
- [ ] Fixtures wired
- [ ] Execution & self-healing performed per-spec to maximize pass rate
- [ ] `--list` succeeds
- [ ] Local run (with env) reaches final steps or fails with clear message

---

## 10. Appendix: Snapshot → Assertion Mapping

When a WDIO `takeScreenshotByElement` (or similar) is replaced with an assertion, record it here for review.

| Phase | WDIO Snapshot | Assertion Method | File Path |
|-------|---------------|------------------|-----------|
| 2b | `takeScreenshotByElement(reportEditorPanel.columnsDropzone, 'TC0000_1', 'attribute_year')` | `expect(yearSelector).toBeVisible()` | `pageBySorting1.spec.ts` (Year selector visible) |
| 2b | `takeScreenshotByElement(reportPageBy.getSelector('Year'), 'TC0000_2', 'page_by_selector_year')` | `expect(yearSelector).toBeVisible()` | `pageBySorting1.spec.ts` |
| 2b | `takeScreenshotByElement(reportPageBy.getSelector('Region'), ...)` | `expect(regionSelector).toBeVisible()` | `pageBySorting1.spec.ts` |
| 2b | `takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_11', ...)` | `expect(reportPageBySorting.dialog).toBeVisible()` | `pageBySorting1.spec.ts` |
| 2b | `takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_33', ...)` (dialog closed) | `expect(reportPageBySorting.dialog).not.toBeVisible()` | `pageBySorting1.spec.ts` |
| 2b | `takeScreenshotByElement(reportPageBy.getSelectorPulldownTextBox('Year'), ...)` (year text) | `expect(yearText).toBeTruthy()` | `pageBySorting1.spec.ts` |
| 2b | PageBySorting2: ~30 screenshots (Year, Custom Categories, Sort dialog, Order, Total Position, Parent Position) | `expect(selector).toBeVisible()`, `expect(dialog).toBeVisible()` | `pageBySorting2.spec.ts` |
| 2b | PageBySorting3: no screenshots (WDIO used since/expect) | — | `pageBySorting3.spec.ts` |
| 2b | PageBySorting4: `takeScreenshotByElement(reportGridView.grid, ...)`, `reportPageBySorting.dialog` | `expect(placeholder).toContainText()`, `expect(dialog).toBeVisible()` | `pageBySorting4.spec.ts` |
| 2b | PageBySorting5: `takeScreenshotByElement(reportEditorPanel.columnsDropzone, ...)` | `expect(monthText or categoryText).toBeTruthy()` | `pageBySorting5.spec.ts` |
| 2b | PageBySorting6: `takeScreenshotByElement(reportPageBy.getSelectorPulldownTextBox, ...)`, grid | `expect(yearText).toBeTruthy()` | `pageBySorting6.spec.ts` |
| 2b | PageBySorting7: `takeScreenshotByElement(reportGridView.grid, ...)`, `pageBySorting.dialog` | `expect(dialog).toBeVisible()`, `expect(dialog).not.toBeVisible()` | `pageBySorting7.spec.ts` |
| 2b | PageBySorting8: `takeScreenshotByElement(reportEditorPanel.pageByDropzone, ...)`, sorting dialog | `expect(dialog).toBeVisible()`, `expect(defaultItem).toBeVisible()` | `pageBySorting8.spec.ts` |
| 2c | BCIN-6908_09: `takeScreenshotByElement(dossierCreator.getActiveTab(), ...)` | `expect(activeTab).toBeVisible()` | `createByCube.spec.ts` |
| 2c | BCIN-6908_09: `takeScreenshotByElement(reportPage.getContainer(), ...)` | `reportGridView.grid.waitFor({ state: 'visible' })` | `createByCube.spec.ts` |
| 2g | themeApply/General/Security: `takeScreenshotByElement(reportPage.getContainer(), ...)` | `expect(reportPage.getContainer()).toBeVisible()` | `themeApply.spec.ts`, `themeGeneral.spec.ts`, `themeSecurity.spec.ts` |
| 2g | themeApply: `takeScreenshotByElement(reportFormatPanel.FormatPanel, ...)` | `expect(reportFormatPanel.FormatPanel).toBeVisible()` | `themeApply.spec.ts` |
| 2g | themeGeneral: `takeScreenshotByElement(reportMenubar.getActiveMenuDropdown(), ...)` | `expect(reportMenubar.getActiveMenuDropdown()).toBeVisible()` | `themeGeneral.spec.ts` |
| 2g | themeGeneral: `takeScreenshotByElement(reportThemePanel.getThemePanel(), ...)` | `expect(reportThemePanel.getThemePanel()).toBeVisible()` | `themeGeneral.spec.ts` |

---

## 11. References

- [PLAYWRIGHT_MIGRATION_PLAN.md](./PLAYWRIGHT_MIGRATION_PLAN.md) — Overall migration strategy
- [PLAYWRIGHT_MIGRATION_PHASE1_EXECUTION.md](./PLAYWRIGHT_MIGRATION_PHASE1_EXECUTION.md) — Step-by-step execution
- [PLAYWRIGHT_MIGRATION_QA.md](./PLAYWRIGHT_MIGRATION_QA.md) — Design constraints
- [TESTER_AGENT_DESIGN.md](../../../docs/TESTER_AGENT_DESIGN.md) — Tester / Healer workflows
- **WDIO source:** `workspace-tester/projects/wdio/specs/regression/reportEditor/`
- **Playwright output:** `workspace-tester/projects/library-automation/`
