# ReportEditor Full Migration Plan — WDIO to Playwright

This document outlines the complete migration plan for all `reportEditor` specs from `workspace-tester/projects/wdio/specs/regression/reportEditor` to Playwright, building on [PLAYWRIGHT_MIGRATION_PLAN.md](./PLAYWRIGHT_MIGRATION_PLAN.md) and [PLAYWRIGHT_MIGRATION_PHASE1_EXECUTION.md](./PLAYWRIGHT_MIGRATION_PHASE1_EXECUTION.md). **Skipped:** reportUndoRedo (already migrated). **Final step:** Run migrated tests to ensure all pass before sign-off.

**Main entry for Playwright scripts:** `workspace-tester/projects/library-automation`

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
| 2i | reportFormatting | `reportFormatting/` | 8 |
| 2j | reportCancel | `reportCancel/` | 2 |
| 2k | reportSqlView | `reportSqlView/` | 5 |
| 2l | mdx | `mdx/` | 5 |
| 2m | reportUICheck | `reportUICheck/` | 8 |
| 2n | reportFolderBrowsing | `reportFolderBrowsing/` | 1 |
| 2o | Root-level / Other | (root) | 16 |

---

## 2. Target File Inventory (Per Phase)

### Phase 2a: reportShortcutMetrics (6)

| # | WDIO File |
|---|-----------|
| 1 | `ReportEditor_createPercentToTotalForMetrics.spec.js` |
| 2 | `ReportEditor_createRankMetrics.spec.js` |
| 3 | `ReportEditor_createTransformationMetrics.spec.js` |
| 4 | `ReportEditor_createPercentToTotalForAttribute.spec.js` |
| 5 | `ReportEditor_MetricEditor.spec.js` |
| 6 | `ReportEditor_createPageGrandPercentToTotalMetrics.spec.js` |

### Phase 2b: reportPageBySorting (8)

| # | WDIO File |
|---|-----------|
| 1-8 | `ReportEditor_PageBySorting1.spec.js` … `ReportEditor_PageBySorting8.spec.js` |

### Phase 2c: reportCreator (6)

| # | WDIO File |
|---|-----------|
| 1 | `ReportEditor_reportCreator.spec.js` |
| 2 | `ReportEditor_createByCubePrivilege.spec.js` |
| 3 | `ReportEditor_templateByExecutionMode.spec.js` |
| 4 | `ReportEditor_template.spec.js` |
| 5 | `ReportEditor_createByCube.spec.js` |
| 6 | `ReportEditor_reportTemplateSecurity.spec.js` |

### Phase 2d: reportSubset (3)

| # | WDIO File |
|---|-----------|
| 1 | `ReportEditor_replace_cube.spec.js` |
| 2 | `ReportEditor_create_embedded_prompt.spec.js` |
| 3 | `ReportEditor_add_prompt_to_viewfilter.spec.js` |

### Phase 2e: reportPageBy (3)

| # | WDIO File |
|---|-----------|
| 1-3 | `ReportPageBy1.spec.js`, `ReportPageBy2.spec.js`, `ReportPageBy3.spec.js` |

### Phase 2f: reportThreshold (2)

| # | WDIO File |
|---|-----------|
| 1 | `ReportEditor_threshold.spec.js` |
| 2 | `ReportEditor_threshold_TC86548.spec.js` |

### Phase 2g: reportTheme (3)

| # | WDIO File |
|---|-----------|
| 1 | `ReportEditor_theme_apply.spec.js` |
| 2 | `ReportEditor_theme_general.spec.js` |
| 3 | `ReportEditor_theme_security.spec.js` |

### Phase 2h: reportScopeFilter (4)

| # | WDIO File |
|---|-----------|
| 1 | `ReportEditor_scopeFilterOfAttributeQualification.spec.js` |
| 2 | `ReportEditor_scopeFilterOfAttributeElement.spec.js` |
| 3 | `ReportEditor_scopeFilterInAuthoring.spec.js` |
| 4 | `ReportEditor_scopeFilterOfDatetime.spec.js` |

### Phase 2i: reportFormatting (8)

| # | WDIO File |
|---|-----------|
| 1 | `ReportEditor_outlineMode.spec.js` |
| 2 | `ReportEditor_wrapText.spec.js` |
| 3 | `ReportEditor_formatPanelChanges.spec.js` |
| 4 | `ReportEditor_advancedBanding.spec.js` |
| 5 | `ReportEditor_minimumColumnWidth.spec.js` |
| 6 | `ReportEditor_lockHeaders.spec.js` |
| 7 | `ReportEditor_advancedPadding.spec.js` |
| 8 | `ReportEditor_fontPicker.spec.js` |

### Phase 2j: reportCancel (2)

| # | WDIO File |
|---|-----------|
| 1 | `Report_consumption_cancel_execution.spec.js` |
| 2 | `Report_authoring_cancel_execution.spec.js` |

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

### Step 4.8: Fixtures and Config

1. Add project to `playwright.config.ts` if feature has unique timeout/env needs.
2. Extend `tests/fixtures/index.ts` with feature-specific fixtures.
3. Ensure `tests/seed.spec.ts` covers shared auth/setup.

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

### 6.4 Recommended npm Scripts (Add to package.json)

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
   d. migrate_to_playwright (per file)
   e. Post-process for semantic locators
   f. refactor_to_pom
   g. Extract test data
   h. playwright-cli validation (complex flows)
   i. Fixtures/config
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
- [ ] Specs migrated to `.spec.ts`
- [ ] POMs created/updated
- [ ] Test data extracted
- [ ] Semantic locators enforced
- [ ] Fixtures wired
- [ ] `--list` succeeds
- [ ] Local run (with env) reaches final steps or fails with clear message

---

## 10. References

- [PLAYWRIGHT_MIGRATION_PLAN.md](./PLAYWRIGHT_MIGRATION_PLAN.md) — Overall migration strategy
- [PLAYWRIGHT_MIGRATION_PHASE1_EXECUTION.md](./PLAYWRIGHT_MIGRATION_PHASE1_EXECUTION.md) — Step-by-step execution
- [PLAYWRIGHT_MIGRATION_QA.md](./PLAYWRIGHT_MIGRATION_QA.md) — Design constraints
- [TESTER_AGENT_DESIGN.md](../../../docs/TESTER_AGENT_DESIGN.md) — Tester / Healer workflows
- **WDIO source:** `workspace-tester/projects/wdio/specs/regression/reportEditor/`
- **Playwright output:** `workspace-tester/projects/library-automation/`
