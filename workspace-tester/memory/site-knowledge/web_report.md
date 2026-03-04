# Site Knowledge: Web Report Domain

## Overview

- **Domain key:** `web_report`
- **Components covered:** BaseReportPanel, GridToolbar, ReportDetailsPage, ReportDetailsPanel, ReportGrid, ReportGridContextMenu, ReportObjectsPanel, ReportPageBy, ReportPromptDetails, ReportToolbar, ReportViewFilter, WebReportPage
- **Spec files scanned:** 0
- **POM files scanned:** 12

## Components

### BaseReportPanel
- **CSS root:** `#td_mstrWeb_dockLeft`
- **User-visible elements:**
  - Panel (`#td_mstrWeb_dockLeft`)
- **Component actions:**
  - `chooseTab(name)`
- **Related components:** getPanel

### GridToolbar
- **CSS root:** `#report_toolbar`
- **User-visible elements:**
  - Toolbar (`#report_toolbar`)
- **Component actions:**
  - `getDataColumns()`
  - `getDataRows()`
  - `isReportBarPresent()`
  - `switchToNextColumnPage()`
  - `switchToNextPage()`
- **Related components:** _none_

### ReportDetailsPage
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickAdvanvcedBtn()`
  - `close()`
  - `getAdvancedColsNum()`
  - `getAdvancedRowsNum()`
  - `waitForDetailsPageLoaded()`
  - `waitForReportDetailsLoaded()`
- **Related components:** _none_

### ReportDetailsPanel
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `close()`
  - `filterIsEmpty()`
  - `getFilterText()`
  - `getViewFilterText()`
  - `isDetailsPanelPresent()`
- **Related components:** _none_

### ReportGrid
- **CSS root:** `.graphImgContainer`
- **User-visible elements:**
  - Graph (`.graphImgContainer`)
  - Grid (`#table_UniqueReportID`)
  - Report Grid (`#reportViewAllModes`)
- **Component actions:**
  - `clickHeaderSortIcon(cellText)`
  - `getCellValueByPosition(row, column)`
  - `getGridMode()`
  - `getHeaderSortIcon(cellText)`
  - `getSortIconTitle(cellText)`
  - `isCellOnGrid(cellText)`
- **Related components:** _none_

### ReportGridContextMenu
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickCancel()`
  - `clickOk()`
  - `isMenuPathPresent(menuPaths)`
  - `select(menus)`
  - `selectMenuEditorItems(itemTexts)`
- **Related components:** _none_

### ReportObjectsPanel
- **CSS root:** `.mstrContextMenuRight`
- **User-visible elements:**
  - Context Menu (`.mstrContextMenuRight`)
- **Component actions:**
  - `expandItem(item)`
  - `isDerivedAttribute(name)`
  - `isDerivedMetric(name)`
  - `isItemAttrFormPresent(item, attrForm)`
  - `isItemPresent(item)`
  - `openContextMenu(item)`
  - `selectContextMenu(menuPaths)`
- **Related components:** getReportObjectPanel

### ReportPageBy
- **CSS root:** `#pbb_PageByStyle`
- **User-visible elements:**
  - Report Page By (`#pbb_PageByStyle`)
  - Search Results List (`.mstrmojo-ReportQuickSearch-Suggest`)
- **Component actions:**
  - `clearSearch()`
  - `close()`
  - `getSearchResultCount()`
  - `isItemSelected(attr, item)`
  - `isPageByDisplayed()`
  - `pageBy(attr, item)`
  - `search(text)`
- **Related components:** getSearchboxContainer

### ReportPromptDetails
- **CSS root:** `#promptDetails_PromptDetailsStyle`
- **User-visible elements:**
  - Element (`#promptDetails_PromptDetailsStyle`)
- **Component actions:**
  - `getPromptDetailsText()`
  - `isPromptDetailsPresent()`
- **Related components:** _none_

### ReportToolbar
- **CSS root:** `#ribbonToolbarTabsListContainer`
- **User-visible elements:**
  - First Toolbar (`#ribbonToolbarTabsListContainer`)
  - Floating Menu (`.select-free.mstrFloatingMenu`)
- **Component actions:**
  - `cancelReport()`
  - `clickButton(buttonTitle)`
  - `isButtonDisabled(buttonTitle)`
  - `isButtonEnabled(buttonTitle)`
  - `isMenuItemDisplayed(menuItem)`
  - `isMenuItemSelected(menuItem)`
  - `openFloatingMenu(tabName)`
  - `openTab(tabName)`
  - `openToolsMenu(tabName, menuItem)`
  - `select(tabName, menus)`
- **Related components:** _none_

### ReportViewFilter
- **CSS root:** `#vfep_pane`
- **User-visible elements:**
  - Condition Function Type Drop Down (`#functionAndFunctionTypeCombo`)
  - View Filter Container (`#vfep_pane`)
- **Component actions:**
  - `addAllSelections()`
  - `addCondition()`
  - `applyCondition()`
  - `applyFilter()`
  - `applyGroupByIndex(index)`
  - `cancelGroupByIndex(index)`
  - `clearAllFilter()`
  - `clearAllFilterAndSave()`
  - `clickApplyChangesButton()`
  - `clickAutoApplyButton()`
  - `closeViewFilterPanel()`
  - `getAvailableOptionText()`
  - `getFilterRemoveButton(item)`
  - `getFilterShiftDownButton(item, orientation)`
  - `getSelectOptionText()`
  - `inputSearchText(text)`
  - `inputValueForQualify(value)`
  - `multiRemoveSelectedOptions(options)`
  - `multiSelectAvailableOptions(options)`
  - `openCalendarTable()`
  - `openFilterEditPanel(item)`
  - `removeAllSelections()`
  - `removeFilter(item)`
  - `removeSelectedOption(optionName)`
  - `selectAvailableOption(optionName)`
  - `selectConditionDataType(optionName)`
  - `selectConditionFunctionType(optionName)`
  - `SelectDayInCalendar(day)`
  - `selectFilterActionType(typeName)`
  - `selectFilterOption(optionName)`
  - `shiftFilter(filterName, orientation)`
- **Related components:** getPanel

### WebReportPage
- **CSS root:** `.repLayout.viewMode`
- **User-visible elements:**
  - Report Layout (`.repLayout.viewMode`)
- **Component actions:**
  - `findShareDialog()`
  - `open(reportID, params)`
  - `openReportPanel(name)`
  - `openReportToolbarMenu(tab, menuPaths)`
  - `waitContentLoading()`
- **Related components:** baseReportPanel, reportDetailsPage, reportObjectsPanel, reportPage

## Common Workflows (from spec.ts)

1. _none_

## Common Elements (from POM + spec.ts)

1. Condition Function Type Drop Down -- frequency: 1
2. Context Menu -- frequency: 1
3. Element -- frequency: 1
4. First Toolbar -- frequency: 1
5. Floating Menu -- frequency: 1
6. Graph -- frequency: 1
7. Grid -- frequency: 1
8. Panel -- frequency: 1
9. Report Grid -- frequency: 1
10. Report Layout -- frequency: 1
11. Report Page By -- frequency: 1
12. Search Results List -- frequency: 1
13. Toolbar -- frequency: 1
14. View Filter Container -- frequency: 1

## Key Actions

- `addAllSelections()` -- used in 0 specs
- `addCondition()` -- used in 0 specs
- `applyCondition()` -- used in 0 specs
- `applyFilter()` -- used in 0 specs
- `applyGroupByIndex(index)` -- used in 0 specs
- `cancelGroupByIndex(index)` -- used in 0 specs
- `cancelReport()` -- used in 0 specs
- `chooseTab(name)` -- used in 0 specs
- `clearAllFilter()` -- used in 0 specs
- `clearAllFilterAndSave()` -- used in 0 specs
- `clearSearch()` -- used in 0 specs
- `clickAdvanvcedBtn()` -- used in 0 specs
- `clickApplyChangesButton()` -- used in 0 specs
- `clickAutoApplyButton()` -- used in 0 specs
- `clickButton(buttonTitle)` -- used in 0 specs
- `clickCancel()` -- used in 0 specs
- `clickHeaderSortIcon(cellText)` -- used in 0 specs
- `clickOk()` -- used in 0 specs
- `close()` -- used in 0 specs
- `closeViewFilterPanel()` -- used in 0 specs
- `expandItem(item)` -- used in 0 specs
- `filterIsEmpty()` -- used in 0 specs
- `findShareDialog()` -- used in 0 specs
- `getAdvancedColsNum()` -- used in 0 specs
- `getAdvancedRowsNum()` -- used in 0 specs
- `getAvailableOptionText()` -- used in 0 specs
- `getCellValueByPosition(row, column)` -- used in 0 specs
- `getDataColumns()` -- used in 0 specs
- `getDataRows()` -- used in 0 specs
- `getFilterRemoveButton(item)` -- used in 0 specs
- `getFilterShiftDownButton(item, orientation)` -- used in 0 specs
- `getFilterText()` -- used in 0 specs
- `getGridMode()` -- used in 0 specs
- `getHeaderSortIcon(cellText)` -- used in 0 specs
- `getPromptDetailsText()` -- used in 0 specs
- `getSearchResultCount()` -- used in 0 specs
- `getSelectOptionText()` -- used in 0 specs
- `getSortIconTitle(cellText)` -- used in 0 specs
- `getViewFilterText()` -- used in 0 specs
- `inputSearchText(text)` -- used in 0 specs
- `inputValueForQualify(value)` -- used in 0 specs
- `isButtonDisabled(buttonTitle)` -- used in 0 specs
- `isButtonEnabled(buttonTitle)` -- used in 0 specs
- `isCellOnGrid(cellText)` -- used in 0 specs
- `isDerivedAttribute(name)` -- used in 0 specs
- `isDerivedMetric(name)` -- used in 0 specs
- `isDetailsPanelPresent()` -- used in 0 specs
- `isItemAttrFormPresent(item, attrForm)` -- used in 0 specs
- `isItemPresent(item)` -- used in 0 specs
- `isItemSelected(attr, item)` -- used in 0 specs
- `isMenuItemDisplayed(menuItem)` -- used in 0 specs
- `isMenuItemSelected(menuItem)` -- used in 0 specs
- `isMenuPathPresent(menuPaths)` -- used in 0 specs
- `isPageByDisplayed()` -- used in 0 specs
- `isPromptDetailsPresent()` -- used in 0 specs
- `isReportBarPresent()` -- used in 0 specs
- `multiRemoveSelectedOptions(options)` -- used in 0 specs
- `multiSelectAvailableOptions(options)` -- used in 0 specs
- `open(reportID, params)` -- used in 0 specs
- `openCalendarTable()` -- used in 0 specs
- `openContextMenu(item)` -- used in 0 specs
- `openFilterEditPanel(item)` -- used in 0 specs
- `openFloatingMenu(tabName)` -- used in 0 specs
- `openReportPanel(name)` -- used in 0 specs
- `openReportToolbarMenu(tab, menuPaths)` -- used in 0 specs
- `openTab(tabName)` -- used in 0 specs
- `openToolsMenu(tabName, menuItem)` -- used in 0 specs
- `pageBy(attr, item)` -- used in 0 specs
- `removeAllSelections()` -- used in 0 specs
- `removeFilter(item)` -- used in 0 specs
- `removeSelectedOption(optionName)` -- used in 0 specs
- `search(text)` -- used in 0 specs
- `select(menus)` -- used in 0 specs
- `select(tabName, menus)` -- used in 0 specs
- `selectAvailableOption(optionName)` -- used in 0 specs
- `selectConditionDataType(optionName)` -- used in 0 specs
- `selectConditionFunctionType(optionName)` -- used in 0 specs
- `selectContextMenu(menuPaths)` -- used in 0 specs
- `SelectDayInCalendar(day)` -- used in 0 specs
- `selectFilterActionType(typeName)` -- used in 0 specs
- `selectFilterOption(optionName)` -- used in 0 specs
- `selectMenuEditorItems(itemTexts)` -- used in 0 specs
- `shiftFilter(filterName, orientation)` -- used in 0 specs
- `switchToNextColumnPage()` -- used in 0 specs
- `switchToNextPage()` -- used in 0 specs
- `waitContentLoading()` -- used in 0 specs
- `waitForDetailsPageLoaded()` -- used in 0 specs
- `waitForReportDetailsLoaded()` -- used in 0 specs

## Source Coverage

- `pageObjects/web_report/**/*.js`
