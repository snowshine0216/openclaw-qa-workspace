# Report Editor Playwright Tests

Executable specs live in `tests/specs/report-editor/`. This README documents page objects and test scopes.

---

## 1. Page Objects and When to Use

| Page Object | Path | Scope | When to Use |
|-------------|------|-------|-------------|
| **LoginPage** | `page-objects/library/login-page.ts` | Library auth | Login before report/dossier access |
| **LibraryPage** | `page-objects/library/library-page.ts` | Library navigation | `editReportByUrl`, `openDefaultApp`, `handleError` |
| **ReportToolbar** | `page-objects/report/report-toolbar.ts` | Report toolbar | `switchToDesignMode`, play/pause |
| **ReportEditorPanel** | `page-objects/report/report-editor-panel.ts` | Dropzones, context menus | Columns/rows/metrics dropzone, percent-to-total, rank, transformation |
| **ReportDatasetPanel** | `page-objects/report/report-dataset-panel.ts` | Dataset panel, object browser | `selectItemInObjectList`, `addObjectToPageBy`, `clickFolderUpIcon`, context menus |
| **ReportPageBy** | `page-objects/report/report-page-by.ts` | Page-by selectors | `getSelector`, `openDropdownFromSelector`, `openSelectorContextMenu`, `getPageBySelectorText` |
| **ReportPageBySorting** | `page-objects/report/report-page-by-sorting.ts` | Sort options dialog | `openDropdown`, `selectFromDropdown`, `removeRow`, `clickBtn`, `clickContextMenuOption` |
| **ReportGridView** | `page-objects/report/report-grid-view.ts` | Grid, context menu | `getGridCellTextByPos`, `clickContextMenuOption`, `grid` |
| **ReportFilterPanel** | `page-objects/report/report-filter-panel.ts` | Report filter area | Filter interactions |
| **ReportTOC** | `page-objects/report/report-toc.ts` | Table of contents | TOC navigation |
| **ReportPromptEditor** | `page-objects/report/report-prompt-editor.ts` | Prompt dialog | Prompt apply, prompts |
| **ReportDerivedMetricEditor** | `page-objects/report/report-derived-metric-editor.ts` | Metric editor | Derived metrics, formula |
| **ReportFormatPanel** | `page-objects/report/report-format-panel.ts` | Format panel | Number/format settings |
| **ThresholdEditor** | `page-objects/report/threshold-editor.ts` | Thresholds | Threshold rules |
| **ReportSubtotalsEditor** | `page-objects/report/report-subtotals-editor.ts` | Subtotals | Subtotal config |
| **ReportContextualLinkingDialog** | `page-objects/report/report-contextual-linking-dialog.ts` | Linking dialog | Contextual linking |
| **BaseContainer** | `page-objects/report/base-container.ts` | Base layout | Shared layout |
| **DossierCreator** | `page-objects/library/dossier-creator.ts` | Create New Report dialog | `createNewReport`, `switchProjectByName`, `selectTemplate`, `searchTemplate`, `clickCreateButton`, `resetLocalStorage` |

---

## 2. Test Suite Scopes

| Suite | Path | Tests | Dossier/Data |
|-------|------|-------|---------------|
| **reportUndoRedo** | `tests/specs/report-editor/report-undo-redo/` | 5 files | `reportUndoRedoData` |
| **reportShortcutMetrics** | `tests/specs/report-editor/report-shortcut-metrics/` | 6 files | `reportShortcutMetricsData` |
| **reportPageBySorting** | `tests/specs/report-editor/report-page-by-sorting/` | 8 files | `reportPageBySortingData` |
| **reportPageBy** | `tests/specs/report-editor/report-page-by/` | 3 files | `reportPageByData` |
| **reportCreator** | `tests/specs/report-editor/report-creator/` | 6 files | `reportCreatorData` |

---

## 3. How to Run

```bash
# Single suite
npm run test:reportUndoRedo
npm run test:reportShortcutMetrics
npm run test:reportPageBySorting
npm run test:reportPageBy
npm run test:reportCreator

# All reportEditor tests
npm run test:reportEditor

# List tests
npm run test:reportEditor:list
```

---

## 4. Environment

Configure `tests/config/.env.report` with:

- `reportTestUrl` — Base URL (e.g. MicroStrategy Library)
- `reportTestUser` / `reportTestPassword` — Default login (shared password for all users)
- **Optional reportCreator users:** `reportCubePrivUser`, `reportSubsetUser`, `reportTemplateNoExecuteUser`, `reportTemplateUser` — used by createByCubePrivilege, createByCube, reportTemplateSecurity. If unset, specs fall back to `reportCreatorData` usernames.

See [docs/ENV_MANAGEMENT.md](../../docs/ENV_MANAGEMENT.md) for full env config and adding new users.
