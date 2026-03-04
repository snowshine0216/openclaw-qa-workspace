# Site Knowledge: Transaction SQL Domain

## Overview

- **Domain key:** `transactionSQL`
- **Components covered:** AgGrid, BulkDelete, BulkEdit, BulkUpdate, InlineEdit, InsertData, TxnFirstUserExperience, TxnPopup, TxnSwitch
- **Spec files scanned:** 5
- **POM files scanned:** 9

## Components

### AgGrid
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickActiontoOpenTransactionEditor(actionName)`
  - `clickErrorWindowButton(text)`
  - `getAfterSubmissionText(text)`
  - `getConfirmationPopupButton(option)`
  - `getHeaderPencilIcon(index)`
  - `getPulldownOptionCount()`
  - `getSearchableDropdownAmplifier()`
  - `getTransactionDialogText(containerName)`
  - `getTransactionDialogTextHeight(containerName, text)`
  - `getWarningTooltip(text)`
  - `selectConfirmationPopupOption(option)`
  - `selectDropdownOption(option)`
  - `selectSearchableDropdownOption(searchText, option)`
  - `waitForConsumptionModeToRefresh()`
  - `waitForTransactionSliderDisplayed()`
- **Related components:** FormatPanel, getContainer, LibraryAuthoringPage

### BulkDelete
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `getCheckedDeleteCheckbox(rowIndex, bulkMode = 'Delete Data')`
  - `getCheckedDeleteRow(rowIndex, bulkMode = 'Delete Data')`
  - `getDeleteButtonByRow(row)`
  - `getDeleteCell(rowIndex, bulkMode = 'Delete Data')`
  - `setDeleteHeaderCheckbox(isActionCheck, bulkMode)`
- **Related components:** getBulkTxnContainer

### BulkEdit
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickBulkMode(bulkMode)`
  - `clickBulkTxnGridCellByPosition(row, col, bulkMode, hasError)`
  - `clickBulkTxnModeIcon(visName)`
  - `clickOnBulkEditSubmitButton(containerName, transactionMode)`
  - `enterBulkTxnMode(bulkMode, visName)`
  - `getBulkEditSubmitButton(containerName, transactionMode)`
  - `getBulkEditSubmitButtonEnabled(containerName, transactionMode)`
  - `getBulkTxnGridCellErrorByPosition(row, col, bulkMode)`
  - `getDeleteButtonByRow(row)`
  - `getTxnChangeText(containerName)`
  - `getTxnNodesToChange(containerName, text)`
  - `getVisualizationTxnButton(visualizationName)`
  - `InputValueInBulkTxnGridCell(row, col, bulkMode, value)`
  - `IsMenuButtonValid(visName, buttonName)`
  - `resizeColumn(col, xPixels, bulkMode)`
- **Related components:** getBulkEditContainer, getBulkTxnContainer, getContainer, hoverOnVisualizationContainer

### BulkUpdate
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `enterOnInput()`
  - `getDeleteButtonByRow(row)`
  - `getInputField()`
  - `getUpdatedCell(row, col)`
  - `getUpdatedRow(rowIndex)`
- **Related components:** getBulkTxnContainer

### InlineEdit
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickConfirmContainerIcon(row, col, visualizationName, iconName)`
  - `doubleClickGridCellByPosition(row, col, visualizationName)`
  - `getAgGridCellPulldownOptionCountByPosition(row, col, visualizationName)`
  - `getDeleteButtonByRow(row)`
  - `replaceTextInGridCell(row, col, visualizationName, value)`
  - `replaceTextInGridCellAndEnter(row, col, visualizationName, value)`
  - `replaceTextInSearchableDropdownEditor(row, col, visualizationName, value)`
  - `typeTextInGridCell(row, col, visualizationName, value)`
  - `waitForSliderForInlineEdit()`
- **Related components:** getConfirmContainer, getContainer

### InsertData
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `addNewRow()`
  - `chooseInsertDropdownOption(option)`
  - `clickButton(button)`
  - `clickDropdownInsertTextBox(headerIdx, row)`
  - `clickHeaderElement(headerText)`
  - `clickInsertDataCell(headerIdx, row)`
  - `clickOnInsertDropdown(headerIdx, row)`
  - `clickSwitchCell(row, headerIdx)`
  - `deleteRow(row)`
  - `dragSliderForInsertData(toOffset)`
  - `getAllInsertRowsCount()`
  - `getHeaderIdx(headerText)`
  - `getInsertColumn(rowIndex, columnIndex)`
  - `getInsertColumns(rowIndex)`
  - `getInsertDropdown(headerText, row)`
  - `getInsertDropdownOverlay(dropdown)`
  - `getInsertRow(rowIndex)`
  - `getInsertSlider(slider)`
  - `getInsertTextBox(headerText, row, className, tagName = 'span')`
  - `getNumberOfRows()`
  - `inputInsertTextBox(inputText, inputElement)`
  - `inputInsertTextBoxWithEnter(inputText, inputElement)`
  - `typeInsertTextBox(inputText, inputElement)`
  - `waitForSliderDisappear(IsHidden = true)`
- **Related components:** getContainer

### TxnFirstUserExperience
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickDialogButton(name)`
  - `dismissDialogIfAppear()`
  - `getDeleteButtonByRow(row)`
- **Related components:** docAuthBasePage

### TxnPopup
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickOnCheckboxWithTitle(title)`
  - `getDeleteButtonByRow(row)`
  - `selectTransactionPausePopupOption(option)`
- **Related components:** _none_

### TxnSwitch
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickSwitch(row, col, visualizationName, switchStyle)`
  - `getDeleteButtonByRow(row)`
- **Related components:** _none_

## Common Workflows (from spec.ts)

1. [QAC255_1] Apply 1 line title theme to normal grid (used in 1 specs)
2. [QAC255_10] Apply 1 line heatmap network waterfall Theme (used in 1 specs)
3. [QAC255_11] Apply 2 lines+button heatmap network waterfall Theme (used in 1 specs)
4. [QAC255_12] Apply 1 line Histogram Box Plot theme (used in 1 specs)
5. [QAC255_13] Apply 2 lines+button Histogram Box Plot theme (used in 1 specs)
6. [QAC255_14] Apply Sankey and Time Series theme (used in 1 specs)
7. [QAC255_15] Apply Sankey and Time Series 2 lines+button theme (used in 1 specs)
8. [QAC255_16] Apply Keydriver and NLG Theme (used in 1 specs)
9. [QAC255_17] Apply Keydriver and NLG 2 lines+button Theme (used in 1 specs)
10. [QAC255_18] Apply Forcast + Trend 1 line theme (used in 1 specs)
11. [QAC255_19] Apply Forcast2 + Trendline2 theme (used in 1 specs)
12. [QAC255_2] Apply 2 lines title theme to normal grid (used in 1 specs)
13. [QAC255_20] Apply control + field theme (used in 1 specs)
14. [QAC255_21] Apply panel stack theme (used in 1 specs)
15. [QAC255_22] Copy Paste on the same type viz (used in 1 specs)
16. [QAC255_3] Apply 2 lines+button theme to normal grid (used in 1 specs)
17. [QAC255_4] Apply 2lines+button AG grid theme to grid (used in 1 specs)
18. [QAC255_5] Apply 2LineTitles AG grid theme to grid (used in 1 specs)
19. [QAC255_6] Apply GM theme to GM (used in 1 specs)
20. [QAC255_7] Apply Map theme to Map (used in 1 specs)
21. [QAC255_8] Apply 1 line KPI Theme to KPI (used in 1 specs)
22. [QAC255_9] Apply 2 lines+button KPI Theme to KPI (used in 1 specs)
23. [TC77270_1] Dossier Transaction Configuration & Consumption | E2E (used in 1 specs)
24. [TC77270_2] Dossier Transaction Configuration & Consumption | E2E (used in 1 specs)
25. [TC77270_3] Dossier Transaction Configuration & Consumption | E2E (used in 1 specs)
26. [TC77270_4] Dossier Transaction Configuration & Consumption | E2E (used in 1 specs)
27. [TC99393_3] Validate date type to define slider for SQL Transaction (used in 1 specs)
28. [TC99393_4] Define a slider for SQL Transaction (used in 1 specs)
29. [TC99393_5] Inline Edit Consumption for SQL Transaction with Slider (used in 1 specs)
30. [TC99393_6] Bulk Edit Consumption for SQL Transaction with Slider (used in 1 specs)
31. [TC99393_7] Bulk Add Consumption for SQL Transaction with Slider (used in 1 specs)
32. [TC99393_8] TXN slider defects (used in 1 specs)
33. [TC99393_9] Verify German User Experience for TXN Slider (used in 1 specs)
34. [TC99394_1] Pencil should show correctly when grid header is right aligned or empty (used in 1 specs)
35. [TC99559_1] normal grid enable subtitle and button (used in 1 specs)
36. [TC99559_10] Customizable Title Bar Defects (used in 1 specs)
37. [TC99559_11] GM and Map to enable titles and buttons (used in 1 specs)
38. [TC99559_12] German User for action name (used in 1 specs)
39. [TC99559_2] compound grid enable subtitle and button (used in 1 specs)
40. [TC99559_3] AG grid title and subtitle enabled - 1 (used in 1 specs)
41. [TC99559_4] AG grid title and subtitle enabled - 2 (used in 1 specs)
42. [TC99559_5] AG grid title and subtitle enabled - 3 (used in 1 specs)
43. [TC99559_6] AG grid title and subtitle enabled without txn- 4 (used in 1 specs)
44. [TC99559_7] title bar xfunctional test (used in 1 specs)
45. [TC99559_8] Customize action names in SQL Transaction (used in 1 specs)
46. [TC99559_9] Customizable Title Bar Consumption (used in 1 specs)
47. 24.07 Dossier Transaction support slider as the control type (used in 1 specs)
48. 25.09 Customizable Title Bar (used in 1 specs)
49. 25.10 Dashboard Level Formatting (used in 1 specs)
50. Dossier SQL Transaction X-func (used in 1 specs)
51. Dossier Transaction Configuration & Consumption | E2E (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getTitleBarContainer -- frequency: 203
2. getGridContainer -- frequency: 129
3. getGridCellByPosition -- frequency: 29
4. getInsertTextBox -- frequency: 24
5. getCSSProperty -- frequency: 23
6. getInsertDropdown -- frequency: 22
7. getBulkTxnGridCellByPosition -- frequency: 19
8. getAgGridColsContainer -- frequency: 18
9. getManualInputCell -- frequency: 18
10. getInsertSlider -- frequency: 16
11. getActiveTxnTab -- frequency: 14
12. getTitleBarSetting -- frequency: 14
13. getTitleButton -- frequency: 13
14. getCurrentSelectionInDropdown -- frequency: 12
15. getTransactionSlider -- frequency: 12
16. getInputField -- frequency: 10
17. getAlertEditorWithTitle -- frequency: 7
18. getContextMenuOption -- frequency: 7
19. getPopup -- frequency: 7
20. getActionName -- frequency: 6
21. getConfirmationPopup -- frequency: 6
22. getInputNumField -- frequency: 6
23. getInsertDropdownOverlay -- frequency: 6
24. getInsertSliderWithoutClick -- frequency: 6
25. getDossierView -- frequency: 5
26. getTitle -- frequency: 5
27. getTitleStyle -- frequency: 5
28. getBadInput -- frequency: 4
29. getBulkEditToolbar -- frequency: 4
30. getButtonFormatPopup -- frequency: 4
31. getSettingMenu -- frequency: 4
32. getTopBarInTransactionEditor -- frequency: 4
33. getVisualizationTitleBarRoot -- frequency: 4
34. D7 F6 F0 -- frequency: 3
35. getAgGridViewPort -- frequency: 3
36. getSliderWidth -- frequency: 3
37. getTransactionDialogText -- frequency: 3
38. getVisualizationSubTitleBarRoot -- frequency: 3
39. 5 C388 C -- frequency: 2
40. ABABAB -- frequency: 2
41. div.ag-header-row.ag-header-row-column -- frequency: 2
42. FCC95 A -- frequency: 2
43. getBulkEditSubmitButton -- frequency: 2
44. getCheckedDeleteRow -- frequency: 2
45. getCurrentPage -- frequency: 2
46. getHeader -- frequency: 2
47. getHTMLNode -- frequency: 2
48. getImageBoxByIndex -- frequency: 2
49. getInputValuesWithConfigurations -- frequency: 2
50. getNumberOfRows -- frequency: 2
51. getPanelByID -- frequency: 2
52. getTextNode -- frequency: 2
53. getTooltipsText -- frequency: 2
54. getUpdatedCell -- frequency: 2
55. getVisualizationTitleBarTextArea -- frequency: 2
56. 38 AE6 F -- frequency: 1
57. 834 FBD -- frequency: 1
58. BCB1 E2 -- frequency: 1
59. D76322 -- frequency: 1
60. DF77 A8 -- frequency: 1
61. F56 E21 -- frequency: 1
62. getActiveView -- frequency: 1
63. getAttrOrMetricSelectorContainerUsingId -- frequency: 1
64. getBulkEditSubmitButtonEnabled -- frequency: 1
65. getButton -- frequency: 1
66. getCellByTypeAndInputValue -- frequency: 1
67. getConfirmContainer -- frequency: 1
68. getEditGridCellAtPosition -- frequency: 1
69. getElementOrValueFilterByTitle -- frequency: 1
70. getInlineInsertContainer -- frequency: 1
71. getInputConfig -- frequency: 1
72. getInsertContainer -- frequency: 1
73. getInsertInputElements -- frequency: 1
74. getItemInSuggestionList -- frequency: 1
75. getMappingEditorTableColumns -- frequency: 1
76. getMappingEditorTableColumnsAndInputValues -- frequency: 1
77. getSelectedNamespace -- frequency: 1
78. getSqlText -- frequency: 1
79. getTableColumnsAndInputValues -- frequency: 1
80. getTabScreenshot -- frequency: 1
81. getTitleFontColor -- frequency: 1
82. getTitleFontFamily -- frequency: 1
83. getTitleFontSize -- frequency: 1

## Key Actions

- `getTitleBarContainer()` -- used in 203 specs
- `getCSSProperty()` -- used in 147 specs
- `getGridContainer()` -- used in 129 specs
- `waitForAuthoringPageLoading()` -- used in 62 specs
- `getText()` -- used in 61 specs
- `goToPage()` -- used in 46 specs
- `waitForCurtainDisappear()` -- used in 45 specs
- `isDisplayed()` -- used in 39 specs
- `editDossierByUrl()` -- used in 36 specs
- `getGridCellByPosition()` -- used in 29 specs
- `clickBulkTxnGridCellByPosition(row, col, bulkMode, hasError)` -- used in 27 specs
- `getInsertTextBox(headerText, row, className, tagName = 'span')` -- used in 24 specs
- `actionOnMenubar()` -- used in 23 specs
- `actionOnSubmenuNoContinue()` -- used in 23 specs
- `applyTheme()` -- used in 23 specs
- `setDropdown()` -- used in 23 specs
- `getInsertDropdown(headerText, row)` -- used in 22 specs
- `openContextMenu()` -- used in 22 specs
- `searchTheme()` -- used in 22 specs
- `clickButton(button)` -- used in 21 specs
- `clickDropdown()` -- used in 20 specs
- `selectContextMenuOption()` -- used in 20 specs
- `getBulkTxnGridCellByPosition()` -- used in 19 specs
- `getValue()` -- used in 19 specs
- `sleep()` -- used in 19 specs
- `getAgGridColsContainer()` -- used in 18 specs
- `getManualInputCell()` -- used in 18 specs
- `openPageFromTocMenu()` -- used in 18 specs
- `setManualInputCell()` -- used in 18 specs
- `clickVisualizationTitle()` -- used in 17 specs
- `openTitleContainerFormatPanel()` -- used in 17 specs
- `getInsertSlider(slider)` -- used in 16 specs
- `clickButtonFromToolbar()` -- used in 15 specs
- `waitForConsumptionModeToRefresh()` -- used in 15 specs
- `getActiveTxnTab()` -- used in 14 specs
- `getTitleBarSetting()` -- used in 14 specs
- `getTitleButton()` -- used in 13 specs
- `selectConfirmationPopupOption(option)` -- used in 13 specs
- `selectTxnTab()` -- used in 13 specs
- `setInputNumField()` -- used in 13 specs
- `clickControlTypeSettingButton()` -- used in 12 specs
- `doubleClickGridCellByPosition(row, col, visualizationName)` -- used in 12 specs
- `getAttribute()` -- used in 12 specs
- `getCurrentSelectionInDropdown()` -- used in 12 specs
- `getTransactionSlider()` -- used in 12 specs
- `isExisting()` -- used in 12 specs
- `moveMouse()` -- used in 12 specs
- `openDossierById()` -- used in 12 specs
- `toggleTitleButtons()` -- used in 12 specs
- `waitLoadingDataPopUpIsNotDisplayed()` -- used in 12 specs
- `clickBuiltInColor()` -- used in 11 specs
- `clickColorPickerModeBtn()` -- used in 11 specs
- `clickOnBulkEditSubmitButton(containerName, transactionMode)` -- used in 11 specs
- `clickHeaderElement(headerText)` -- used in 10 specs
- `getInputField()` -- used in 10 specs
- `isControlTypeAvailable()` -- used in 10 specs
- `waitForTransactionEditorLoaded()` -- used in 10 specs
- `clickConfirmContainerIcon(row, col, visualizationName, iconName)` -- used in 9 specs
- `clickTitleBarButtonInConsumption()` -- used in 9 specs
- `isAddTableButtonDisplayed()` -- used in 9 specs
- `isPresent()` -- used in 9 specs
- `modifyActionName()` -- used in 9 specs
- `clickExpandIcon()` -- used in 8 specs
- `replaceTextInGridCellAndEnter(row, col, visualizationName, value)` -- used in 8 specs
- `setTitleStyle()` -- used in 8 specs
- `typeInsertTextBox(inputText, inputElement)` -- used in 8 specs
- `clickAddValueButton()` -- used in 7 specs
- `enterBulkTxnMode(bulkMode, visName)` -- used in 7 specs
- `getAlertEditorWithTitle()` -- used in 7 specs
- `getContextMenuOption()` -- used in 7 specs
- `getPopup()` -- used in 7 specs
- `InputValueInBulkTxnGridCell(row, col, bulkMode, value)` -- used in 7 specs
- `keys()` -- used in 7 specs
- `openContextMenuItemForCellAtPosition()` -- used in 7 specs
- `waitForSliderDisappear(IsHidden = true)` -- used in 7 specs
- `chooseInsertDropdownOption(option)` -- used in 6 specs
- `clickButtonBackgroundColorBtn()` -- used in 6 specs
- `dragSlider()` -- used in 6 specs
- `getActionName()` -- used in 6 specs
- `getConfirmationPopup()` -- used in 6 specs
- `getInputNumField()` -- used in 6 specs
- `getInsertDropdownOverlay(dropdown)` -- used in 6 specs
- `getInsertSliderWithoutClick()` -- used in 6 specs
- `inputInsertTextBoxWithEnter(inputText, inputElement)` -- used in 6 specs
- `clickButtonFormatIcon()` -- used in 5 specs
- `clickOnPage()` -- used in 5 specs
- `clickVisualizationTitleContainer()` -- used in 5 specs
- `dismissButtonFormatPopup()` -- used in 5 specs
- `getDossierView()` -- used in 5 specs
- `getTitle()` -- used in 5 specs
- `getTitleStyle()` -- used in 5 specs
- `goToLibrary()` -- used in 5 specs
- `login()` -- used in 5 specs
- `openDefaultApp()` -- used in 5 specs
- `toggleTitles()` -- used in 5 specs
- `clickButtonIconColorBtn()` -- used in 4 specs
- `clickButtonTextFontColorBtn()` -- used in 4 specs
- `clickHtBtnOnAlert()` -- used in 4 specs
- `clickTitleBackgroundColorBtn()` -- used in 4 specs
- `dragSliderForInsertData(toOffset)` -- used in 4 specs
- `getBadInput()` -- used in 4 specs
- `getBulkEditToolbar()` -- used in 4 specs
- `getButtonFormatPopup()` -- used in 4 specs
- `GetMapType()` -- used in 4 specs
- `getSettingMenu()` -- used in 4 specs
- `getTopBarInTransactionEditor()` -- used in 4 specs
- `getVisualizationTitleBarRoot()` -- used in 4 specs
- `isDossierEditorDisplayed()` -- used in 4 specs
- `isTransactionConfigEditorClosed()` -- used in 4 specs
- `toggleTitleBar()` -- used in 4 specs
- `addNewRow()` -- used in 3 specs
- `addObjectToVizByDoubleClick()` -- used in 3 specs
- `clickButtonVisibleIcon()` -- used in 3 specs
- `getAgGridViewPort()` -- used in 3 specs
- `getSliderWidth()` -- used in 3 specs
- `getTransactionDialogText(containerName)` -- used in 3 specs
- `getVisualizationSubTitleBarRoot()` -- used in 3 specs
- `IsMenuButtonValid(visName, buttonName)` -- used in 3 specs
- `openDossierByID()` -- used in 3 specs
- `openTxnConfigEditorByContextMenu()` -- used in 3 specs
- `openVizFormatPanel()` -- used in 3 specs
- `renameVisualizationByDoubleClick()` -- used in 3 specs
- `replaceTextInGridCell(row, col, visualizationName, value)` -- used in 3 specs
- `waitForSliderForInlineEdit()` -- used in 3 specs
- `waitLibraryLoadingIsNotDisplayed()` -- used in 3 specs
- `actionOnmenubarWithSubmenu()` -- used in 2 specs
- `actionOnToolbar()` -- used in 2 specs
- `addManualInputRow()` -- used in 2 specs
- `changeButtonFillColorOpacity()` -- used in 2 specs
- `checkTableColumn()` -- used in 2 specs
- `clickBulkMode(bulkMode)` -- used in 2 specs
- `clickButtonBorderColorBtn()` -- used in 2 specs
- `clickButtonOnFooter()` -- used in 2 specs
- `clickMappedTable()` -- used in 2 specs
- `clickNamespaceListButton()` -- used in 2 specs
- `clickTableColumn()` -- used in 2 specs
- `doubleClick()` -- used in 2 specs
- `enterOnInput()` -- used in 2 specs
- `getBulkEditSubmitButton(containerName, transactionMode)` -- used in 2 specs
- `getCheckedDeleteRow(rowIndex, bulkMode = 'Delete Data')` -- used in 2 specs
- `getCurrentPage()` -- used in 2 specs
- `getHeader()` -- used in 2 specs
- `getHTMLNode()` -- used in 2 specs
- `getImageBoxByIndex()` -- used in 2 specs
- `getInputValuesWithConfigurations()` -- used in 2 specs
- `getNumberOfRows()` -- used in 2 specs
- `getPanelByID()` -- used in 2 specs
- `getTextNode()` -- used in 2 specs
- `getTooltipsText()` -- used in 2 specs
- `getUpdatedCell(row, col)` -- used in 2 specs
- `getVisualizationTitleBarTextArea()` -- used in 2 specs
- `hoverTitleBarButton()` -- used in 2 specs
- `matchScreenshot()` -- used in 2 specs
- `openButtonBorderPullDown()` -- used in 2 specs
- `openDossierByIDInPresentationMode()` -- used in 2 specs
- `scrollAndSelectItem()` -- used in 2 specs
- `searchForObject()` -- used in 2 specs
- `selectButtonBorderStyle()` -- used in 2 specs
- `selectButtonRadius()` -- used in 2 specs
- `selectButtonSize()` -- used in 2 specs
- `selectButtonTextFontStyle()` -- used in 2 specs
- `selectDropdownOption(option)` -- used in 2 specs
- `selectFontAlign()` -- used in 2 specs
- `selectFontStyle()` -- used in 2 specs
- `selectItemInSuggestionList()` -- used in 2 specs
- `selectTitleOption()` -- used in 2 specs
- `setButtonLabelOption()` -- used in 2 specs
- `setNamespaceCheckbox()` -- used in 2 specs
- `switchToTransactionOptionsSection()` -- used in 2 specs
- `switchUser()` -- used in 2 specs
- `validateNamespaceCheckbox()` -- used in 2 specs
- `waitForDisplayed()` -- used in 2 specs
- `waitForInfoWindowLoading()` -- used in 2 specs
- `actionOnMenubarWithSubmenu()` -- used in 1 specs
- `changeViz()` -- used in 1 specs
- `checkWhereClauseButtons()` -- used in 1 specs
- `clearAllTextInSqlEditor()` -- used in 1 specs
- `clearTxnConfigByContextMenu()` -- used in 1 specs
- `clickBulkTxnModeIcon(visName)` -- used in 1 specs
- `clickFontColorBtn()` -- used in 1 specs
- `clickOnContainerTitle()` -- used in 1 specs
- `clickOnGridElement()` -- used in 1 specs
- `clickTxnTypeOnFormatPanel()` -- used in 1 specs
- `clickWhereClauseButtons()` -- used in 1 specs
- `closeDossierWithoutSaving()` -- used in 1 specs
- `contextMenuOnPage()` -- used in 1 specs
- `deleteRow(row)` -- used in 1 specs
- `dismissColorPicker()` -- used in 1 specs
- `editTxnConfigByContextMenu()` -- used in 1 specs
- `getActiveView()` -- used in 1 specs
- `getAttrOrMetricSelectorContainerUsingId()` -- used in 1 specs
- `getBulkEditSubmitButtonEnabled(containerName, transactionMode)` -- used in 1 specs
- `getButton()` -- used in 1 specs
- `getCellByTypeAndInputValue()` -- used in 1 specs
- `getConfirmContainer()` -- used in 1 specs
- `getEditGridCellAtPosition()` -- used in 1 specs
- `getElementOrValueFilterByTitle()` -- used in 1 specs
- `getInlineInsertContainer()` -- used in 1 specs
- `getInputConfig()` -- used in 1 specs
- `getInsertContainer()` -- used in 1 specs
- `getInsertInputElements()` -- used in 1 specs
- `getItemInSuggestionList()` -- used in 1 specs
- `getMappingEditorTableColumns()` -- used in 1 specs
- `getMappingEditorTableColumnsAndInputValues()` -- used in 1 specs
- `getSelectedNamespace()` -- used in 1 specs
- `getSqlText()` -- used in 1 specs
- `getTableColumnsAndInputValues()` -- used in 1 specs
- `getTabScreenshot()` -- used in 1 specs
- `getTitleFontColor()` -- used in 1 specs
- `getTitleFontFamily()` -- used in 1 specs
- `getTitleFontSize()` -- used in 1 specs
- `handleError()` -- used in 1 specs
- `hoverOnVisualizationContainer()` -- used in 1 specs
- `isCheckboxChecked()` -- used in 1 specs
- `isDialogDisplayed()` -- used in 1 specs
- `isDialogHidden()` -- used in 1 specs
- `isEditorClosed()` -- used in 1 specs
- `isEnabled()` -- used in 1 specs
- `isFontAlignButtonDisabled()` -- used in 1 specs
- `navigateLinkByKey()` -- used in 1 specs
- `openContextMenuItemForValue()` -- used in 1 specs
- `openContextSubMenuItemForHeader()` -- used in 1 specs
- `saveInMyReport()` -- used in 1 specs
- `scrollHorizontally()` -- used in 1 specs
- `scrollVerticallyToBottom()` -- used in 1 specs
- `selectButtonTextFont()` -- used in 1 specs
- `selectTextFont()` -- used in 1 specs
- `selectTxnView()` -- used in 1 specs
- `setButtonAlias()` -- used in 1 specs
- `setCheckbox()` -- used in 1 specs
- `setExportButtonOption()` -- used in 1 specs
- `setTextFontSize()` -- used in 1 specs
- `toBeTruthy()` -- used in 1 specs
- `toggleTxnTypeOnFormatPanel()` -- used in 1 specs
- `toMatchBaseline()` -- used in 1 specs
- `toString()` -- used in 1 specs
- `typeInSqlEditor()` -- used in 1 specs
- `verifyTableColumns()` -- used in 1 specs
- `waitForTransactionSliderDisplayed()` -- used in 1 specs
- `clickActiontoOpenTransactionEditor(actionName)` -- used in 0 specs
- `clickDialogButton(name)` -- used in 0 specs
- `clickDropdownInsertTextBox(headerIdx, row)` -- used in 0 specs
- `clickErrorWindowButton(text)` -- used in 0 specs
- `clickInsertDataCell(headerIdx, row)` -- used in 0 specs
- `clickOnCheckboxWithTitle(title)` -- used in 0 specs
- `clickOnInsertDropdown(headerIdx, row)` -- used in 0 specs
- `clickSwitch(row, col, visualizationName, switchStyle)` -- used in 0 specs
- `clickSwitchCell(row, headerIdx)` -- used in 0 specs
- `dismissDialogIfAppear()` -- used in 0 specs
- `getAfterSubmissionText(text)` -- used in 0 specs
- `getAgGridCellPulldownOptionCountByPosition(row, col, visualizationName)` -- used in 0 specs
- `getAllInsertRowsCount()` -- used in 0 specs
- `getBulkTxnGridCellErrorByPosition(row, col, bulkMode)` -- used in 0 specs
- `getCheckedDeleteCheckbox(rowIndex, bulkMode = 'Delete Data')` -- used in 0 specs
- `getConfirmationPopupButton(option)` -- used in 0 specs
- `getDeleteButtonByRow(row)` -- used in 0 specs
- `getDeleteCell(rowIndex, bulkMode = 'Delete Data')` -- used in 0 specs
- `getHeaderIdx(headerText)` -- used in 0 specs
- `getHeaderPencilIcon(index)` -- used in 0 specs
- `getInsertColumn(rowIndex, columnIndex)` -- used in 0 specs
- `getInsertColumns(rowIndex)` -- used in 0 specs
- `getInsertRow(rowIndex)` -- used in 0 specs
- `getPulldownOptionCount()` -- used in 0 specs
- `getSearchableDropdownAmplifier()` -- used in 0 specs
- `getTransactionDialogTextHeight(containerName, text)` -- used in 0 specs
- `getTxnChangeText(containerName)` -- used in 0 specs
- `getTxnNodesToChange(containerName, text)` -- used in 0 specs
- `getUpdatedRow(rowIndex)` -- used in 0 specs
- `getVisualizationTxnButton(visualizationName)` -- used in 0 specs
- `getWarningTooltip(text)` -- used in 0 specs
- `inputInsertTextBox(inputText, inputElement)` -- used in 0 specs
- `replaceTextInSearchableDropdownEditor(row, col, visualizationName, value)` -- used in 0 specs
- `resizeColumn(col, xPixels, bulkMode)` -- used in 0 specs
- `selectSearchableDropdownOption(searchText, option)` -- used in 0 specs
- `selectTransactionPausePopupOption(option)` -- used in 0 specs
- `setDeleteHeaderCheckbox(isActionCheck, bulkMode)` -- used in 0 specs
- `typeTextInGridCell(row, col, visualizationName, value)` -- used in 0 specs

## Source Coverage

- `pageObjects/transactionSQL/**/*.js`
- `specs/regression/DossierTransaction/SQLTransaction/**/*.{ts,js}`
