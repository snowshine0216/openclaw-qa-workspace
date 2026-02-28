# Report Editor Playwright Tests

Executable specs live in `tests/specs/reportEditor/`. This README documents page objects and test scopes.

---

## 1. Page Objects and When to Use

| Page Object | Path | Scope | When to Use |
|-------------|------|-------|-------------|
| **LoginPage** | `page-objects/library/LoginPage.ts` | Library auth | Login before report/dossier access |
| **LibraryPage** | `page-objects/library/LibraryPage.ts` | Library navigation | `editReportByUrl`, `openDefaultApp`, `handleError` |
| **ReportToolbar** | `page-objects/report/ReportToolbar.ts` | Report toolbar | `switchToDesignMode`, play/pause |
| **ReportEditorPanel** | `page-objects/report/ReportEditorPanel.ts` | Dropzones, context menus | Columns/rows/metrics dropzone, percent-to-total, rank, transformation |
| **ReportDatasetPanel** | `page-objects/report/ReportDatasetPanel.ts` | Dataset panel, object browser | `selectItemInObjectList`, `addObjectToPageBy`, `clickFolderUpIcon`, context menus |
| **ReportPageBy** | `page-objects/report/ReportPageBy.ts` | Page-by selectors | `getSelector`, `openDropdownFromSelector`, `openSelectorContextMenu`, `getPageBySelectorText` |
| **ReportPageBySorting** | `page-objects/report/ReportPageBySorting.ts` | Sort options dialog | `openDropdown`, `selectFromDropdown`, `removeRow`, `clickBtn`, `clickContextMenuOption` |
| **ReportGridView** | `page-objects/report/ReportGridView.ts` | Grid, context menu | `getGridCellTextByPos`, `clickContextMenuOption`, `grid` |
| **ReportFilterPanel** | `page-objects/report/ReportFilterPanel.ts` | Report filter area | Filter interactions |
| **ReportTOC** | `page-objects/report/ReportTOC.ts` | Table of contents | TOC navigation |
| **ReportPromptEditor** | `page-objects/report/ReportPromptEditor.ts` | Prompt dialog | Prompt apply, prompts |
| **ReportDerivedMetricEditor** | `page-objects/report/ReportDerivedMetricEditor.ts` | Metric editor | Derived metrics, formula |
| **ReportFormatPanel** | `page-objects/report/ReportFormatPanel.ts` | Format panel | Number/format settings |
| **ThresholdEditor** | `page-objects/report/ThresholdEditor.ts` | Thresholds | Threshold rules |
| **ReportSubtotalsEditor** | `page-objects/report/ReportSubtotalsEditor.ts` | Subtotals | Subtotal config |
| **ReportContextualLinkingDialog** | `page-objects/report/ReportContextualLinkingDialog.ts` | Linking dialog | Contextual linking |
| **BaseContainer** | `page-objects/report/BaseContainer.ts` | Base layout | Shared layout |
| **DossierCreator** | `page-objects/library/DossierCreator.ts` | Create New Report dialog | `createNewReport`, `switchProjectByName`, `selectTemplate`, `searchTemplate`, `clickCreateButton`, `resetLocalStorage` |

---

## 2. Test Suite Scopes

| Suite | Path | Tests | Dossier/Data |
|-------|------|-------|---------------|
| **reportUndoRedo** | `tests/specs/reportEditor/reportUndoRedo/` | 5 files | `reportUndoRedoData` |
| **reportShortcutMetrics** | `tests/specs/reportEditor/reportShortcutMetrics/` | 6 files | `reportShortcutMetricsData` |
| **reportPageBySorting** | `tests/specs/reportEditor/reportPageBySorting/` | 8 files | `reportPageBySortingData` |
| **reportPageBy** | `tests/specs/reportEditor/reportPageBy/` | 1 file | — |
| **reportCreator** | `tests/specs/reportEditor/reportCreator/` | 6 files | `reportCreatorData` |

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
