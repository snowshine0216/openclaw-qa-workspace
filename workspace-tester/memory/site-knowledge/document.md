# Site Knowledge: Document Domain

## Overview

- **Domain key:** `document`
- **Components covered:** BIWebRsdEditablePage, DocumentPage, DocumentToolbar, GridAndGraph, GroupBy, Layout, PanelSelector, PanelStack, RsdContextMenu, RsdFilterPanel, RsdGraph, RsdGrid, RsdInfoWindow, RSDMenu, TextField, TitleBar, ViewFilterEditor
- **Spec files scanned:** 13
- **POM files scanned:** 17

## Components

### BIWebRsdEditablePage
- **CSS root:** `.mstrAlert`
- **User-visible elements:**
  - Error Message (`.mstrAlert`)
  - Wait Curtain (`#mstrWeb_waitCurtain`)
- **Component actions:**
  - `getAccountName()`
  - `getDocName()`
  - `waitForCurtainDisappear(timeout = this.DEFAULT_LOADING_TIMEOUT)`
  - `waitForErrorMessage()`
  - `waitForRsdLoad(timeout = this.DEFAULT_LOADING_TIMEOUT, message = timeout)`
- **Related components:** getPage

### DocumentPage
- **CSS root:** `.mstr-nav-icon.icon-library`
- **User-visible elements:**
  - Library Icon (`.mstr-nav-icon.icon-library`)
- **Component actions:**
  - `backToFolder(sleep = 2000)`
  - `clickBtnByText(text)`
  - `clickWidgetSelectionCheckbox(widgetKey)`
  - `findShareDialog()`
  - `goToLibrary()`
  - `isDocContentPresent()`
  - `open(projectID, documentID, libraryUrl = browser.options.baseUrl)`
  - `openDocument(documentID)`
  - `openRunWithPrompt(documentID)`
  - `runWithPrompt()`
  - `runWithPrompt()`
  - `selectLayout(tabName)`
  - `waitAllToBeLoaded()`
  - `waitNewPageLoadByTitle(title)`
- **Related components:** waitForPage, waitPage

### DocumentToolbar
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickButton(buttonTitle)`
  - `openTab(tabName)`
  - `select(tabName, menus)`
- **Related components:** _none_

### GridAndGraph
- **CSS root:** `.mstrmojo-portlet-titlebar.floating.visible`
- **User-visible elements:**
  - Quick Switch Toolbar (`.mstrmojo-portlet-titlebar.floating.visible`)
- **Component actions:**
  - `openQuickSwitchMenu(menuItem, fromFixedTitleBar)`
  - `showQuickSwitch()`
  - `switchMode(modeName, fromFixedTitleBar)`
  - `switchModeToGraph(fromFixedTitleBar)`
  - `switchModeToGrid(fromFixedTitleBar)`
  - `titleBarHasQuickSwitch()`
- **Related components:** _none_

### GroupBy
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `changeGroupBy(name)`
  - `getCurrentSelection()`
- **Related components:** _none_

### Layout
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `getSelectedLayout()`
  - `selectLayout(name, sleep = 2000)`
- **Related components:** _none_

### PanelSelector
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `getPanelBackgroundColorByName(name)`
  - `hoverToPanelByName(name)`
  - `selectPanelByName(name)`
- **Related components:** getPanel, setContainer

### PanelStack
- **CSS root:** `.mstrmojo-DocSubPanel-content`
- **User-visible elements:**
  - Close Icon (`.mstrmojo-portlet-slot-toolbar .mstrmojo-ToolBar-outercell`)
  - Content (`.mstrmojo-DocSubPanel-content`)
  - Panel Stack Context Menu (`.mstrmojo-ui-Menu`)
- **Component actions:**
  - `clickPanelStackContextMenuItem(panelName, itemName)`
  - `close()`
  - `closeInfoWindow()`
  - `hasPanelScrollBar(key)`
  - `hoverOnPanelstack()`
  - `isPanelPresent()`
- **Related components:** dossierPage, getPanel

### RsdContextMenu
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `isMenuPathPresent(menuPaths)`
  - `select(menuPaths)`
- **Related components:** _none_

### RsdFilterPanel
- **CSS root:** `#mstrFilterPanelMenu`
- **User-visible elements:**
  - Menu List Items (`#mstrFilterPanelMenu`)
- **Component actions:**
  - `clickApply()`
  - `clickMenuNthItem(index, text)`
  - `clickSelectorMenu(name)`
  - `clickUnset()`
  - `openAndChooseMenuByText(text)`
  - `openMenu()`
  - `scrollFilterPanel(toPosition)`
  - `scrollFilterPanelToBottom()`
  - `scrollFilterPanelToTop()`
- **Related components:** getScrollContainer

### RsdGraph
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickGraphCell(graphIndex, cellText)`
  - `clickOnRectArea(item)`
  - `getTooltipOnRectArea(item)`
  - `IsMenuPresentOnContextMenu(item, menuPaths)`
  - `isRsdGraphPresent()`
  - `rightClickOnRectArea(item)`
  - `selectContextMenuOnRectArea(item, menuPaths)`
  - `waitForGraphLoading()`
- **Related components:** _none_

### RsdGrid
- **CSS root:** `.mstrmojo-Xtab-content `
- **User-visible elements:**
  - Rsd Grid (`.mstrmojo-Xtab-content `)
- **Component actions:**
  - `adjustColumnWidth(index, toOffset)`
  - `clickCell(cell)`
  - `clickCellFromLocation(row, column)`
  - `dragGridColumnWidth(index, toOffsetParam)`
  - `getData(opts = {})`
  - `getFirstGridCell()`
  - `getFirstGridCellInRow(row)`
  - `getGridCellInRow(row, column)`
  - `getGridRows()`
  - `getOneRowData(row)`
  - `getTableWidth()`
  - `getTotalRows()`
  - `isCellClickable(cell, index = 1)`
  - `isCellDisplayed(name)`
  - `isGridCellInRowPresent(row, column)`
  - `isGridCellPresent(cell)`
  - `isGridPresnt()`
  - `IsMenuPresentOnContextMenu(cell, menuPaths)`
  - `rightClickCell(cell)`
  - `scrollGridCellIntoView(cell)`
  - `scrollInGridToBottom()`
  - `scrollInGridToTop()`
  - `selectCellInOneRow(row, startColumn, endColumn)`
  - `selectContextMenuOnCell(cell, menuPaths)`
  - `selectContextMenuOnCells(cells, menuPaths)`
  - `selectGridContextMenuOption(cell, optionText)`
  - `selectGridContextMenuOptionByOffset({ cell, optionText, x = 0, y = 0, checkClickable = true })`
  - `waitForGridLoaded()`
  - `waitForLoaddingDisappear()`
- **Related components:** _none_

### RsdInfoWindow
- **CSS root:** `.mstrmojo-DocInfoWindow`
- **User-visible elements:**
  - Close Btn (`.mstrmojo-DocInfoWindow`)
- **Component actions:**
  - `closeInfoWindow(offset)`
  - `createByPanelStackName(name)`
  - `getInfoWindowLocation()`
  - `isCloseBtnDisplayed()`
  - `isDisplayed()`
  - `waitInfoWindowShown()`
- **Related components:** _none_

### RSDMenu
- **CSS root:** `#dialogBeforeSave`
- **User-visible elements:**
  - Save Confirm Button (`#dialogBeforeSave`)
  - Toolbar (`#mstrHamburger`)
  - Toolbar List (`#mstrToolbarList`)
- **Component actions:**
  - `clickNthItemOfToolbarList(text, index)`
  - `clickNthItemOfZoomPopup(text, index)`
  - `closeToolBarList()`
  - `confirmSave()`
  - `isMenuItemPresent(item)`
  - `openMenu(menuPaths)`
  - `openToolBarList()`
- **Related components:** getContainer

### TextField
- **CSS root:** `body`
- **User-visible elements:**
  - Text Fields (`body`)
- **Component actions:**
  - `clickTextField(textFieldText)`
  - `clickTextFieldByKey(key, checkDocumentLoaded = true)`
  - `getHeight(textFieldText)`
  - `getTextFiledTitle(text)`
  - `isTextPresent(text)`
- **Related components:** _none_

### TitleBar
- **CSS root:** `#mstrSelectorMenu`
- **User-visible elements:**
  - Selector Menu (`#mstrSelectorMenu`)
- **Component actions:**
  - `clickLeftArrow()`
  - `clickMenuItem(text)`
  - `clickRightArrow()`
  - `clickTitle()`
  - `clickTriageButton()`
  - `getTitleText()`
  - `isItemSelected(text)`
- **Related components:** _none_

### ViewFilterEditor
- **CSS root:** `.mstrmojo-ElementsEditor.modal`
- **User-visible elements:**
  - Browse Elements Popup (`.mstrmojo-ElementsEditor.modal`)
  - View Filter (`.mstrmojo-Editor.mstrmojo-charcoalboxe.mstrmojo-FE.modal`)
- **Component actions:**
  - `addCondition(conditionPaths)`
  - `addNewCondition()`
  - `applyCondition()`
  - `cancelCondition()`
  - `cancelViewFilter()`
  - `editCurrentCondition(conditionPaths)`
  - `getConditionCount()`
  - `inputValue(value)`
  - `isConditionItemPresent(item)`
  - `isNthOperatorGrouped(index)`
  - `openConditionCreateSetPanel(condition)`
  - `openConditon(conditionName)`
  - `removeAllConditions()`
  - `removeCondition(condition)`
  - `renameDynamicCondition(originName, newName)`
  - `saveViewFilter()`
  - `searchAndSelectElements(searchText, selectItems)`
  - `selectItemInCreateSetPanel(items)`
  - `selectNthGroupOperator(index, option)`
  - `selectRelatedByItem(item)`
  - `switchConditionCreateType(buttonText)`
  - `switchNthGroupOperator(index)`
- **Related components:** getOKButtonInCreateSetPanel, getSetItemInCreateSetPanel

## Common Workflows (from spec.ts)

1. RSD_PanelStackIssue (used in 2 specs)
2. [TC71359_01] Validate zoom in rsd (used in 1 specs)
3. [TC71359_02] Validate HTML container in rsd (used in 1 specs)
4. [TC71359_03] Validate image in rsd (used in 1 specs)
5. [TC71359_04] Validate line and shape in rsd (used in 1 specs)
6. [TC71359_05] Validate text in rsd (used in 1 specs)
7. [TC71359_06] Validate thresdhold in rsd (used in 1 specs)
8. [TC71359_07] Verify document selector and grid sanity function (used in 1 specs)
9. [TC71359_08] Verify document selector and grid sanity function (used in 1 specs)
10. [TC71359_09] Multi_Layouts on Document (used in 1 specs)
11. [TC71360_01] Validate multi selector in filter panel (used in 1 specs)
12. [TC71360_02] Validate context menu in filter panel (used in 1 specs)
13. [TC73431] Web Platform | Dropdown selector - Multi-Select manipulation on select and cancel (used in 1 specs)
14. [TC74248_01] Validate selector can pass filter to grid in information window (used in 1 specs)
15. [TC74248_02] Validate grid can pass filter to multi graph in information window (used in 1 specs)
16. [TC74248_03] Validate nested information window in RSD with grouping (used in 1 specs)
17. [TC74248_04] Validate Format and Context menu options in information window (used in 1 specs)
18. [TC74248_05] Validate information window converted from dossier (used in 1 specs)
19. [TC74248_06] Validate information window in multi section with grouping (used in 1 specs)
20. [TC74248_07] Validate back and forth of information window (used in 1 specs)
21. [TC74248_08] Validate information window with self target (used in 1 specs)
22. [TC74248_09] Validate information window with self target (used in 1 specs)
23. [TC74248_10] Validate information window in multi layout (used in 1 specs)
24. [TC74248_11] Validate information window in multi layout (used in 1 specs)
25. [TC74248_12] Validate information window with view filter (used in 1 specs)
26. [TC74249_01] Validate multi panel with multi elements (used in 1 specs)
27. [TC74249_02] Validate multi panel with selectors (used in 1 specs)
28. [TC74249_03] Validate multi panel with selectors and threshold (used in 1 specs)
29. [TC74249_04] Validate multi panel with information window (used in 1 specs)
30. [TC78912_01] Validate open and close multi nested and circular information window in RSD on library (used in 1 specs)
31. [TC78912_02] Validate open and close multi nested and circular information window in RSD on library (used in 1 specs)
32. [TC80300] Validate collapsed all and expanded all in filter panel (used in 1 specs)
33. [TC80301] Validate Calendar selector in filter panel (used in 1 specs)
34. [TC80302_01] Validate searchbox selector in filter panel (used in 1 specs)
35. [TC80302] Validate MQ and MetricSlider selecctor in filter panel (used in 1 specs)
36. [TC80303] Validate panel stack with different format and properties (used in 1 specs)
37. [TC80304] Validate panel navigation icon shows up and works well (used in 1 specs)
38. [TC80305] Validate Clip Option for Panel Stack (used in 1 specs)
39. [TC80309] Verify the height of text field value for null is bigger than the value set in text field properties in library (used in 1 specs)
40. [TC80399] Validate open in a new window setting of Hyperlink on text/image can work well in library (used in 1 specs)
41. [TC80419] Verify Dashboard from mpp file render correctly if browser zoom is set to Fit Width/Page. (used in 1 specs)
42. [TC80421] Validate Information window display correctly in all screen sizes (used in 1 specs)
43. [TC80422] Validate Transaction in information window (used in 1 specs)
44. [TC80435] Validate Derived Metrics on RSD from R and new (used in 1 specs)
45. [TC80438] Validate Derived Elements Format (used in 1 specs)
46. [TC80439] Validate Derived Elements Group Selection (used in 1 specs)
47. [TC80440] Validate Derived Metrics Logical formula (used in 1 specs)
48. [TC80441] Validate Derived Elements Group Selection with graph mode (used in 1 specs)
49. [TC82223] Validate TextBox with different Color border and Font (used in 1 specs)
50. [TC82224] Validate TextBox using different alignment (used in 1 specs)
51. [TC82225] Validate TextBox when data is empty (used in 1 specs)
52. [TC82226] Validate TextBox on info window and hyperlink (used in 1 specs)
53. [TC82227] Validate Info Window from TextBox (used in 1 specs)
54. [TC82228] Validate TextBox using different gradient Effects (used in 1 specs)
55. [TC82229] Validate TextBox with Conditional format (used in 1 specs)
56. [TC82241] Validate Image functionality of document by converting a dossier image to RSD (used in 1 specs)
57. [TC82242] Validate Image functionality of document with different position and size (used in 1 specs)
58. [TC82243] Validate Image functionality with different image source (used in 1 specs)
59. [TC82244] Validate Image functionality of document using image not visible option (used in 1 specs)
60. [TC82245] Validate Image functionality of document for different links in same and different tab (used in 1 specs)
61. [TC82246] Validate Image functionality of document using image as attribute display in grid column (used in 1 specs)
62. [TC82247] Validate Image functionality of document using image as attribute display in grid row (used in 1 specs)
63. [TC82259] Validate Simple Threshold on Documents with Threshold on (used in 1 specs)
64. [TC82260] Validate Simple Threshold on Documents with Threshold off (used in 1 specs)
65. [TC82261] Validate Complex Threshold on Documents with Threshold off (used in 1 specs)
66. [TC82262] Validate Threshold on attribute column applies correctly for Document (used in 1 specs)
67. [TC82263_02] Validate image in grid threshold displays correctly (used in 1 specs)
68. [TC82263] Validate Threshold format displays correctly in merged and unmerged rows for documents (used in 1 specs)
69. [TC83531] Validate document with section condition format Hide section when meet threshold condition (used in 1 specs)
70. [TC83532_02] Validate RSD with Different Shrink Setting (used in 1 specs)
71. [TC83532] Validate conditional formatting hide text/image when meet condition (used in 1 specs)
72. [TC88510] Validate E2E CSP - remove eval works fine (used in 1 specs)
73. Document Selector (used in 1 specs)
74. RSD_CustomerIssue (used in 1 specs)
75. RSD_DerivedObjects (used in 1 specs)
76. RSD_FilterPanel (used in 1 specs)
77. RSD_General (used in 1 specs)
78. RSD_Image (used in 1 specs)
79. RSD_InformationWindow (used in 1 specs)
80. RSD_InfoWindowIssue (used in 1 specs)
81. RSD_PanelStack (used in 1 specs)
82. RSD_Text (used in 1 specs)
83. RSD_Threshold (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getDocView -- frequency: 175
2. getRsdGridByKey -- frequency: 51
3. getTitle -- frequency: 22
4. getShownSelectedText -- frequency: 5
5. getContent -- frequency: 4
6. getSearchboxByName -- frequency: 3
7. getSelectedItemsText -- frequency: 3
8. getButtonbarByName -- frequency: 2
9. getDropDownById -- frequency: 2
10. getSelectedItemText -- frequency: 2
11. Browse Elements Popup -- frequency: 1
12. Close Btn -- frequency: 1
13. Close Icon -- frequency: 1
14. Content -- frequency: 1
15. Error Message -- frequency: 1
16. getCalendarByName -- frequency: 1
17. getDropdownList -- frequency: 1
18. getMetricQualificationByName -- frequency: 1
19. getMetricSliderByName -- frequency: 1
20. getPanelStack -- frequency: 1
21. getSliderByName -- frequency: 1
22. Library Icon -- frequency: 1
23. Menu List Items -- frequency: 1
24. Panel Stack Context Menu -- frequency: 1
25. Quick Switch Toolbar -- frequency: 1
26. Rsd Grid -- frequency: 1
27. Save Confirm Button -- frequency: 1
28. Selector Menu -- frequency: 1
29. Text Fields -- frequency: 1
30. Toolbar -- frequency: 1
31. Toolbar List -- frequency: 1
32. View Filter -- frequency: 1
33. Wait Curtain -- frequency: 1

## Key Actions

- `getDocView()` -- used in 175 specs
- `openDossier()` -- used in 92 specs
- `waitForDossierLoading()` -- used in 62 specs
- `getRsdGridByKey()` -- used in 51 specs
- `selectCellInOneRow(row, startColumn, endColumn)` -- used in 50 specs
- `clickTextfieldByTitle()` -- used in 33 specs
- `goToLibrary()` -- used in 29 specs
- `selectItemByText()` -- used in 28 specs
- `clickCell(cell)` -- used in 25 specs
- `getTitle()` -- used in 22 specs
- `changeGroupBy(name)` -- used in 16 specs
- `closeInfoWindow(offset)` -- used in 16 specs
- `login()` -- used in 15 specs
- `openDropdown()` -- used in 15 specs
- `clickItems()` -- used in 13 specs
- `create()` -- used in 13 specs
- `clickImageLinkByTitle()` -- used in 12 specs
- `customCredentials()` -- used in 12 specs
- `openMenu()` -- used in 12 specs
- `goToPage()` -- used in 11 specs
- `clickRightArrow()` -- used in 10 specs
- `openAndChooseMenuByText(text)` -- used in 9 specs
- `waitForInfoWindowLoading()` -- used in 9 specs
- `clickBtnByTitle()` -- used in 8 specs
- `isDisplayed()` -- used in 8 specs
- `clickLeftArrow()` -- used in 6 specs
- `closeTab()` -- used in 6 specs
- `createbyName()` -- used in 6 specs
- `getTitleText()` -- used in 6 specs
- `input()` -- used in 6 specs
- `getShownSelectedText()` -- used in 5 specs
- `multiSelectNth()` -- used in 5 specs
- `selectItemsByText()` -- used in 5 specs
- `selectNthItem()` -- used in 5 specs
- `switchToTab()` -- used in 5 specs
- `createNthGrid()` -- used in 4 specs
- `getContent()` -- used in 4 specs
- `getPanelStack()` -- used in 4 specs
- `getUrl()` -- used in 4 specs
- `hasPanelScrollBar(key)` -- used in 4 specs
- `inputTextFieldByKey()` -- used in 4 specs
- `dragSlider()` -- used in 3 specs
- `getSearchboxByName()` -- used in 3 specs
- `getSelectedItemsText()` -- used in 3 specs
- `goBackFromDossierLink()` -- used in 3 specs
- `isItemExisted()` -- used in 3 specs
- `clickApply()` -- used in 2 specs
- `clickSelectorMenu(name)` -- used in 2 specs
- `clickUnset()` -- used in 2 specs
- `getButtonbarByName()` -- used in 2 specs
- `getDropDownById()` -- used in 2 specs
- `getSelectedItemText()` -- used in 2 specs
- `includes()` -- used in 2 specs
- `inputValue(value)` -- used in 2 specs
- `isImagePresent()` -- used in 2 specs
- `isItemsChecked()` -- used in 2 specs
- `logout()` -- used in 2 specs
- `openDropdownAndMultiSelect()` -- used in 2 specs
- `openUserAccountMenu()` -- used in 2 specs
- `run()` -- used in 2 specs
- `selectDate()` -- used in 2 specs
- `selectMultiItemByText()` -- used in 2 specs
- `showQuickSwitch()` -- used in 2 specs
- `submitChanges()` -- used in 2 specs
- `waitForItemLoading()` -- used in 2 specs
- `apply()` -- used in 1 specs
- `clearAllSelections()` -- used in 1 specs
- `clickCancelBtn()` -- used in 1 specs
- `clickItemByText()` -- used in 1 specs
- `clickOKBtn()` -- used in 1 specs
- `clickOnButtonByName()` -- used in 1 specs
- `clickOnRectArea(item)` -- used in 1 specs
- `closeMenu()` -- used in 1 specs
- `findGraphByIdContains()` -- used in 1 specs
- `findGridAndGraphByName()` -- used in 1 specs
- `getCalendarByName()` -- used in 1 specs
- `getDropdownList()` -- used in 1 specs
- `getMetricQualificationByName()` -- used in 1 specs
- `getMetricSliderByName()` -- used in 1 specs
- `getSliderByName()` -- used in 1 specs
- `hoverOnPanelstack()` -- used in 1 specs
- `inputToEndPoint()` -- used in 1 specs
- `isGridCellInRowPresent(row, column)` -- used in 1 specs
- `isSafari()` -- used in 1 specs
- `log()` -- used in 1 specs
- `openFromCalendar()` -- used in 1 specs
- `openPatternDropdown()` -- used in 1 specs
- `openToCalendar()` -- used in 1 specs
- `scrollFilterPanelToBottom()` -- used in 1 specs
- `scrollInGridToBottom()` -- used in 1 specs
- `selectContextMenuOnCell(cell, menuPaths)` -- used in 1 specs
- `selectGridContextMenuOption(cell, optionText)` -- used in 1 specs
- `selectListItem()` -- used in 1 specs
- `sleep()` -- used in 1 specs
- `switchModeToGraph(fromFixedTitleBar)` -- used in 1 specs
- `switchModeToGrid(fromFixedTitleBar)` -- used in 1 specs
- `switchToNewWindow()` -- used in 1 specs
- `url()` -- used in 1 specs
- `addCondition(conditionPaths)` -- used in 0 specs
- `addNewCondition()` -- used in 0 specs
- `adjustColumnWidth(index, toOffset)` -- used in 0 specs
- `applyCondition()` -- used in 0 specs
- `backToFolder(sleep = 2000)` -- used in 0 specs
- `cancelCondition()` -- used in 0 specs
- `cancelViewFilter()` -- used in 0 specs
- `clickBtnByText(text)` -- used in 0 specs
- `clickButton(buttonTitle)` -- used in 0 specs
- `clickCellFromLocation(row, column)` -- used in 0 specs
- `clickGraphCell(graphIndex, cellText)` -- used in 0 specs
- `clickMenuItem(text)` -- used in 0 specs
- `clickMenuNthItem(index, text)` -- used in 0 specs
- `clickNthItemOfToolbarList(text, index)` -- used in 0 specs
- `clickNthItemOfZoomPopup(text, index)` -- used in 0 specs
- `clickPanelStackContextMenuItem(panelName, itemName)` -- used in 0 specs
- `clickTextField(textFieldText)` -- used in 0 specs
- `clickTextFieldByKey(key, checkDocumentLoaded = true)` -- used in 0 specs
- `clickTitle()` -- used in 0 specs
- `clickTriageButton()` -- used in 0 specs
- `clickWidgetSelectionCheckbox(widgetKey)` -- used in 0 specs
- `close()` -- used in 0 specs
- `closeInfoWindow()` -- used in 0 specs
- `closeToolBarList()` -- used in 0 specs
- `confirmSave()` -- used in 0 specs
- `createByPanelStackName(name)` -- used in 0 specs
- `dragGridColumnWidth(index, toOffsetParam)` -- used in 0 specs
- `editCurrentCondition(conditionPaths)` -- used in 0 specs
- `findShareDialog()` -- used in 0 specs
- `getAccountName()` -- used in 0 specs
- `getConditionCount()` -- used in 0 specs
- `getCurrentSelection()` -- used in 0 specs
- `getData(opts = {})` -- used in 0 specs
- `getDocName()` -- used in 0 specs
- `getFirstGridCell()` -- used in 0 specs
- `getFirstGridCellInRow(row)` -- used in 0 specs
- `getGridCellInRow(row, column)` -- used in 0 specs
- `getGridRows()` -- used in 0 specs
- `getHeight(textFieldText)` -- used in 0 specs
- `getInfoWindowLocation()` -- used in 0 specs
- `getOneRowData(row)` -- used in 0 specs
- `getPanelBackgroundColorByName(name)` -- used in 0 specs
- `getSelectedLayout()` -- used in 0 specs
- `getTableWidth()` -- used in 0 specs
- `getTextFiledTitle(text)` -- used in 0 specs
- `getTooltipOnRectArea(item)` -- used in 0 specs
- `getTotalRows()` -- used in 0 specs
- `hoverToPanelByName(name)` -- used in 0 specs
- `isCellClickable(cell, index = 1)` -- used in 0 specs
- `isCellDisplayed(name)` -- used in 0 specs
- `isCloseBtnDisplayed()` -- used in 0 specs
- `isConditionItemPresent(item)` -- used in 0 specs
- `isDocContentPresent()` -- used in 0 specs
- `isGridCellPresent(cell)` -- used in 0 specs
- `isGridPresnt()` -- used in 0 specs
- `isItemSelected(text)` -- used in 0 specs
- `isMenuItemPresent(item)` -- used in 0 specs
- `isMenuPathPresent(menuPaths)` -- used in 0 specs
- `IsMenuPresentOnContextMenu(cell, menuPaths)` -- used in 0 specs
- `IsMenuPresentOnContextMenu(item, menuPaths)` -- used in 0 specs
- `isNthOperatorGrouped(index)` -- used in 0 specs
- `isPanelPresent()` -- used in 0 specs
- `isRsdGraphPresent()` -- used in 0 specs
- `isTextPresent(text)` -- used in 0 specs
- `open(projectID, documentID, libraryUrl = browser.options.baseUrl)` -- used in 0 specs
- `openConditionCreateSetPanel(condition)` -- used in 0 specs
- `openConditon(conditionName)` -- used in 0 specs
- `openDocument(documentID)` -- used in 0 specs
- `openMenu(menuPaths)` -- used in 0 specs
- `openQuickSwitchMenu(menuItem, fromFixedTitleBar)` -- used in 0 specs
- `openRunWithPrompt(documentID)` -- used in 0 specs
- `openTab(tabName)` -- used in 0 specs
- `openToolBarList()` -- used in 0 specs
- `removeAllConditions()` -- used in 0 specs
- `removeCondition(condition)` -- used in 0 specs
- `renameDynamicCondition(originName, newName)` -- used in 0 specs
- `rightClickCell(cell)` -- used in 0 specs
- `rightClickOnRectArea(item)` -- used in 0 specs
- `runWithPrompt()` -- used in 0 specs
- `saveViewFilter()` -- used in 0 specs
- `scrollFilterPanel(toPosition)` -- used in 0 specs
- `scrollFilterPanelToTop()` -- used in 0 specs
- `scrollGridCellIntoView(cell)` -- used in 0 specs
- `scrollInGridToTop()` -- used in 0 specs
- `searchAndSelectElements(searchText, selectItems)` -- used in 0 specs
- `select(menuPaths)` -- used in 0 specs
- `select(tabName, menus)` -- used in 0 specs
- `selectContextMenuOnCells(cells, menuPaths)` -- used in 0 specs
- `selectContextMenuOnRectArea(item, menuPaths)` -- used in 0 specs
- `selectGridContextMenuOptionByOffset({ cell, optionText, x = 0, y = 0, checkClickable = true })` -- used in 0 specs
- `selectItemInCreateSetPanel(items)` -- used in 0 specs
- `selectLayout(name, sleep = 2000)` -- used in 0 specs
- `selectLayout(tabName)` -- used in 0 specs
- `selectNthGroupOperator(index, option)` -- used in 0 specs
- `selectPanelByName(name)` -- used in 0 specs
- `selectRelatedByItem(item)` -- used in 0 specs
- `switchConditionCreateType(buttonText)` -- used in 0 specs
- `switchMode(modeName, fromFixedTitleBar)` -- used in 0 specs
- `switchNthGroupOperator(index)` -- used in 0 specs
- `titleBarHasQuickSwitch()` -- used in 0 specs
- `waitAllToBeLoaded()` -- used in 0 specs
- `waitForCurtainDisappear(timeout = this.DEFAULT_LOADING_TIMEOUT)` -- used in 0 specs
- `waitForErrorMessage()` -- used in 0 specs
- `waitForGraphLoading()` -- used in 0 specs
- `waitForGridLoaded()` -- used in 0 specs
- `waitForLoaddingDisappear()` -- used in 0 specs
- `waitForRsdLoad(timeout = this.DEFAULT_LOADING_TIMEOUT, message = timeout)` -- used in 0 specs
- `waitInfoWindowShown()` -- used in 0 specs
- `waitNewPageLoadByTitle(title)` -- used in 0 specs

## Source Coverage

- `pageObjects/document/**/*.js`
- `specs/regression/document/**/*.{ts,js}`
