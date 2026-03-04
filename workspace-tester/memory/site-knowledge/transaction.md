# Site Knowledge: Transaction Domain

## Overview

- **Domain key:** `transaction`
- **Components covered:** CalendarDIC, LikertScale, ListDIC, RadioList, Slider, StarRating, Stepper, Survey, Switch, TimePicker, Toggle, TransactionPage
- **Spec files scanned:** 35
- **POM files scanned:** 12

## Components

### CalendarDIC
- **CSS root:** `.mstrmojo-DateTextBox .mstrmojo-DateTextBox-icon`
- **User-visible elements:**
  - Date Icon (`.mstrmojo-DateTextBox .mstrmojo-DateTextBox-icon`)
  - Input Box (`.mstrmojo-DateTextBox .mstrmojo-DateTextBox-input`)
- **Component actions:**
  - `chooseCalendar(year, month, day)`
  - `chooseTime(hour, meridiem, minute, second)`
  - `confirm()`
  - `setTimeWithInput(dateTime)`
  - `showCalendarByDateIcon()`
- **Related components:** _none_

### LikertScale
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `chooseValue(value)`
  - `getHighest()`
  - `getHighestRating()`
  - `getLowest()`
  - `getLowestRating()`
  - `getSelectedItem()`
- **Related components:** _none_

### ListDIC
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickSearchableListIconNode()`
  - `getListItem(name)`
  - `getListSelection()`
  - `getSearchableListSelectedTxt()`
  - `getSelectedTxt()`
  - `isListDropdownPresent()`
  - `selectListItem(name)`
  - `selectSearchableListItem(name)`
  - `selectSearchableListItemBySearch(value)`
- **Related components:** _none_

### RadioList
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `getSelectedItem()`
  - `isItemSelected(name)`
  - `selectItem(name)`
- **Related components:** _none_

### Slider
- **CSS root:** `.mstrmojo-Button.mstrmojo-oivmSprite.tbApply`
- **User-visible elements:**
  - Apply Btn (`.mstrmojo-Button.mstrmojo-oivmSprite.tbApply`)
  - Cancel Btn (`.mstrmojo-Button.mstrmojo-oivmSprite.tbCancel`)
- **Component actions:**
  - `apply()`
  - `cancel()`
  - `dragSlider(toOffset)`
- **Related components:** _none_

### StarRating
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `chooseValue(value)`
- **Related components:** _none_

### Stepper
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickMinusBtn(times = 1)`
  - `clickPlusBtn(times = 1)`
  - `getValue()`
  - `isBtnDisabled(text)`
- **Related components:** _none_

### Survey
- **CSS root:** `.mstrmojo-SurveyVis`
- **User-visible elements:**
  - Dropdown List (`.mstrmojo-Pulldown-Popup`)
  - Survey Container (`.mstrmojo-SurveyVis`)
- **Component actions:**
  - `chooseDropDownList(name, item)`
  - `chooseList(name, item)`
  - `goNext()`
  - `inputTextArea(name, text)`
  - `inputTextField(name, text)`
  - `waitWidgetLoaded()`
- **Related components:** getSurveyContainer, scrollPage

### Switch
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickCheckbox()`
  - `isChecked()`
  - `isGrayed()`
- **Related components:** _none_

### TimePicker
- **CSS root:** `.mstrmojo-Button.mstrmojo-oivmSprite.tbApply`
- **User-visible elements:**
  - Apply Btn (`.mstrmojo-Button.mstrmojo-oivmSprite.tbApply`)
  - Cancel Btn (`.mstrmojo-Button.mstrmojo-oivmSprite.tbCancel`)
- **Component actions:**
  - `clickApplyBtn()`
  - `clickCancelBtn()`
  - `clickStepperDownBtn()`
  - `clickStepperUpBtn(times = 1)`
  - `isApplyBtnsDisabled()`
- **Related components:** _none_

### Toggle
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `changeValue()`
  - `getCurrentValue()`
- **Related components:** _none_

### TransactionPage
- **CSS root:** `.dataInputControl .mstrmojo-TextBox.mstrmojo-TextFieldDIC`
- **User-visible elements:**
  - Text Field DIC (`.dataInputControl .mstrmojo-TextBox.mstrmojo-TextFieldDIC`)
  - Wait Mask (`.mstrmojo-Box.fullscreen-mask`)
- **Component actions:**
  - `clickOnContainerByKey(key)`
  - `clickOnDocLayout()`
  - `discardChanges()`
  - `fieldValueBy(key)`
  - `getTextAreaValue()`
  - `getTextAreaValueByName(name)`
  - `getTextFieldValue(name)`
  - `hasDirtyFlag(el)`
  - `inputTextArea(text)`
  - `inputTextAreaByName(name, text)`
  - `inputTextField(text)`
  - `inputTextFieldByKey(key, text)`
  - `inputTextFieldByName(name, text, flag = true)`
  - `inputTextFieldByValue(value, text)`
  - `isActionButtonDisplayed(name)`
  - `isDirtyFlagDisappear(el)`
  - `isPageRefreshed()`
  - `recalculateChanges()`
  - `submitChanges()`
  - `submitChangesWithPageFreshed()`
  - `sumbitChangesWithNoWait()`
  - `waitForMaskDisappear()`
  - `waitForPageReload()`
- **Related components:** clickOnContainer, getContainer, waitPage

## Common Workflows (from spec.ts)

1. 24.07 Dossier Transaction support slider as the control type (used in 4 specs)
2. [QAC255_1] Apply 1 line title theme to normal grid (used in 2 specs)
3. [QAC255_10] Apply 1 line heatmap network waterfall Theme (used in 2 specs)
4. [QAC255_11] Apply 2 lines+button heatmap network waterfall Theme (used in 2 specs)
5. [QAC255_12] Apply 1 line Histogram Box Plot theme (used in 2 specs)
6. [QAC255_13] Apply 2 lines+button Histogram Box Plot theme (used in 2 specs)
7. [QAC255_14] Apply Sankey and Time Series theme (used in 2 specs)
8. [QAC255_15] Apply Sankey and Time Series 2 lines+button theme (used in 2 specs)
9. [QAC255_16] Apply Keydriver and NLG Theme (used in 2 specs)
10. [QAC255_17] Apply Keydriver and NLG 2 lines+button Theme (used in 2 specs)
11. [QAC255_18] Apply Forcast + Trend 1 line theme (used in 2 specs)
12. [QAC255_19] Apply Forcast2 + Trendline2 theme (used in 2 specs)
13. [QAC255_2] Apply 2 lines title theme to normal grid (used in 2 specs)
14. [QAC255_20] Apply control + field theme (used in 2 specs)
15. [QAC255_21] Apply panel stack theme (used in 2 specs)
16. [QAC255_22] Copy Paste on the same type viz (used in 2 specs)
17. [QAC255_3] Apply 2 lines+button theme to normal grid (used in 2 specs)
18. [QAC255_4] Apply 2lines+button AG grid theme to grid (used in 2 specs)
19. [QAC255_5] Apply 2LineTitles AG grid theme to grid (used in 2 specs)
20. [QAC255_6] Apply GM theme to GM (used in 2 specs)
21. [QAC255_7] Apply Map theme to Map (used in 2 specs)
22. [QAC255_8] Apply 1 line KPI Theme to KPI (used in 2 specs)
23. [QAC255_9] Apply 2 lines+button KPI Theme to KPI (used in 2 specs)
24. [TC77270_1] Dossier Transaction Configuration & Consumption | E2E (used in 2 specs)
25. [TC77270_2] Dossier Transaction Configuration & Consumption | E2E (used in 2 specs)
26. [TC77270_3] Dossier Transaction Configuration & Consumption | E2E (used in 2 specs)
27. [TC77270_4] Dossier Transaction Configuration & Consumption | E2E (used in 2 specs)
28. [TC91680_1] user does not have Execute Transaction privilege (used in 2 specs)
29. [TC91680_2] user does not have Use Python Scripts privilege (used in 2 specs)
30. [TC91680_3] user does not have Web Config Transaction privilege (used in 2 specs)
31. [TC93353_1] Dossier Transaction in canvas selector/DDIC - Case 1 (used in 2 specs)
32. [TC93353_2] Dossier Transaction in canvas selector/DDIC - Case 2 (used in 2 specs)
33. [TC93353_3] Dossier Transaction in canvas selector/DDIC - Case 3 (used in 2 specs)
34. [TC98287_1] Grid as source (used in 2 specs)
35. [TC98287_2] Map layer1 as source (used in 2 specs)
36. [TC98287_3] Map layer2 as source (used in 2 specs)
37. [TC98288_1] Viz Target DDIC_Configuration_Switch mode (used in 2 specs)
38. [TC98288_2] Viz Target DDIC_Configuration_PanelStack (used in 2 specs)
39. [TC98288_3] Viz Target DDIC_Consumption_Intersection (used in 2 specs)
40. [TC98288_4] Viz Target DDIC_Consumption_Last Selection (used in 2 specs)
41. [TC99393_1] Define a slider for Python Transaction (used in 2 specs)
42. [TC99393_2] Consumption for Python Transaction with Slider (used in 2 specs)
43. [TC99393_3] Validate date type to define slider for SQL Transaction (used in 2 specs)
44. [TC99393_4] Define a slider for SQL Transaction (used in 2 specs)
45. [TC99393_5] Inline Edit Consumption for SQL Transaction with Slider (used in 2 specs)
46. [TC99393_6] Bulk Edit Consumption for SQL Transaction with Slider (used in 2 specs)
47. [TC99393_7] Bulk Add Consumption for SQL Transaction with Slider (used in 2 specs)
48. [TC99393_8] TXN slider defects (used in 2 specs)
49. [TC99393_9] Verify German User Experience for TXN Slider (used in 2 specs)
50. [TC99394_1] Pencil should show correctly when grid header is right aligned or empty (used in 2 specs)
51. [TC99559_1] normal grid enable subtitle and button (used in 2 specs)
52. [TC99559_10] Customizable Title Bar Defects (used in 2 specs)
53. [TC99559_11] GM and Map to enable titles and buttons (used in 2 specs)
54. [TC99559_12] German User for action name (used in 2 specs)
55. [TC99559_2] compound grid enable subtitle and button (used in 2 specs)
56. [TC99559_3] AG grid title and subtitle enabled - 1 (used in 2 specs)
57. [TC99559_4] AG grid title and subtitle enabled - 2 (used in 2 specs)
58. [TC99559_5] AG grid title and subtitle enabled - 3 (used in 2 specs)
59. [TC99559_6] AG grid title and subtitle enabled without txn- 4 (used in 2 specs)
60. [TC99559_7] title bar xfunctional test (used in 2 specs)
61. [TC99559_8] Customize action names in SQL Transaction (used in 2 specs)
62. [TC99559_9] Customizable Title Bar Consumption (used in 2 specs)
63. 24.03 Dossier Transaction in canvas selector can filter DDIC list (used in 2 specs)
64. 24.05 Dossier Transaction Visualization can filter DDIC list - Xfunc (used in 2 specs)
65. 25.06 python TXN and actions privilege (used in 2 specs)
66. 25.09 Customizable Title Bar (used in 2 specs)
67. 25.10 Dashboard Level Formatting (used in 2 specs)
68. Dossier SQL Transaction X-func (used in 2 specs)
69. Dossier Transaction Configuration & Consumption | E2E (used in 2 specs)
70. Visualization target ddic Test - component level (used in 2 specs)
71. [TC18088] Verify Submit transaction action selector button Subsequent actions on Library RSD (used in 1 specs)
72. [TC18090] Verify Transaction DDIC on grid on Library RSD (used in 1 specs)
73. [TC18091] Verify Transaction DDIC on field group on Library RSD (used in 1 specs)
74. [TC66368] Validate Data refreshed for submit after do reset and linkdrill in transaction on library RSD (used in 1 specs)
75. [TC79802] Verify Control style - Calendar of TXN service on Library RSD - Field (used in 1 specs)
76. [TC79807] Verify Control style - Likert-Scalel of TXN service on Library RSD -Field (used in 1 specs)
77. [TC79809] Verify Control style - List of TXN service on Library RSD -Field (used in 1 specs)
78. [TC79820] Verify Control style - Slider of TXN service on Library RSD -Field (used in 1 specs)
79. [TC79832] Verify Control style - Star Rating of TXN service on Library RSD -Field (used in 1 specs)
80. [TC79836] Verify Control style - Stepper of TXN service on Library RSD -Field (used in 1 specs)
81. [TC79837] Verify Minus/Max buttons of stepper on Library RSD (used in 1 specs)
82. [TC79842] Verify Control style - Switch of TXN service on Library RSD -Field (used in 1 specs)
83. [TC79843] Veirfy Control style - Text Area of TXN service on Library RSD -Field (used in 1 specs)
84. [TC79855] Verify Control style - Text Field of TXN service on Library RSD -Field (used in 1 specs)
85. [TC79856] Verify Control style - Time Picker of TXN service on Library RSD -Field (used in 1 specs)
86. [TC79862] Verify Control style - Star Rating of TXN service on Library RSD -Field (used in 1 specs)
87. [TC79863] Verify transaction validations on MSTR Web (used in 1 specs)
88. [TC79864] Verify Conditional Logic on MSTR Web (used in 1 specs)
89. [TC79865] Verify Survey Widget on Library RSD (used in 1 specs)
90. [TC80281] Verify Control style - Calendar of TXN service on Library RSD -Grid (used in 1 specs)
91. [TC80282] Verify Control style - Likert-Scalel of TXN service -Grid (used in 1 specs)
92. [TC80283] Verify Control style - List of TXN service on MSTR Web -Grid (used in 1 specs)
93. [TC80284] Verify Control style - Slider of TXN service on Library RSD -Grid (used in 1 specs)
94. [TC80285] Verify Control style - Star Rating of TXN service on Library RSD -Grid (used in 1 specs)
95. [TC80286] Verify Control style - Stepper of TXN service on Library RSD -Grid (used in 1 specs)
96. [TC80287] Verify Control style - Switch of TXN service on Library RSD -Grid (used in 1 specs)
97. [TC80288] Veirfy Control style - Text Area of TXN service on Library RSD -Grid (used in 1 specs)
98. [TC80289] Verify Control style - Text Field TXN service on Library RSD -Grid (used in 1 specs)
99. [TC80290] Verify Control style - Time Picker of TXN service on Library RSD -Grid (used in 1 specs)
100. [TC80291] Verify Control style - Star Rating of TXN service on Library RSD -Grid (used in 1 specs)
101. Calendar control for TXN Test (used in 1 specs)
102. Conditional TXN test (used in 1 specs)
103. LikertScale for TXN test (used in 1 specs)
104. List control for TXN test (used in 1 specs)
105. Slider control for TXN Test (used in 1 specs)
106. StarRating for TXN test (used in 1 specs)
107. Stepper for TXN test (used in 1 specs)
108. Survey for TXN test (used in 1 specs)
109. Switch for TXN Test (used in 1 specs)
110. TextArea control for TXN Test (used in 1 specs)
111. TextField for TXN test (used in 1 specs)
112. Time Picker control for TXN Test (used in 1 specs)
113. Toggle for TXN test (used in 1 specs)
114. Transaction Regression Test (used in 1 specs)
115. Validation TXN test (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getTitleBarContainer -- frequency: 406
2. getGridContainer -- frequency: 258
3. getGridCellByPosition -- frequency: 128
4. getInsertDropdown -- frequency: 118
5. getInsertTextBox -- frequency: 106
6. getInsertSlider -- frequency: 62
7. getBulkTxnGridCellByPosition -- frequency: 60
8. getInsertDropdownOverlay -- frequency: 58
9. getAllAgGridObjectCount -- frequency: 52
10. getCSSProperty -- frequency: 46
11. getTargetButton -- frequency: 46
12. getTransactionSlider -- frequency: 46
13. getManualInputCell -- frequency: 40
14. getAgGridColsContainer -- frequency: 36
15. getDDICcandidatePicker -- frequency: 34
16. getPopup -- frequency: 34
17. getDDICcandidatePickerPullDownOption -- frequency: 32
18. getConfirmationPopup -- frequency: 30
19. getElement -- frequency: 30
20. getActiveTxnTab -- frequency: 28
21. getPulldownOptionCount -- frequency: 28
22. getTitleBarSetting -- frequency: 28
23. getTitleButton -- frequency: 26
24. getContextMenuOption -- frequency: 24
25. getCurrentSelectionInDropdown -- frequency: 24
26. getDDICPullDownText -- frequency: 24
27. getAgGridViewPort -- frequency: 22
28. getInsertSliderWithoutClick -- frequency: 22
29. getInputField -- frequency: 20
30. getEditableFieldByName -- frequency: 18
31. getEditableField -- frequency: 17
32. getText -- frequency: 16
33. getTransactionDialogText -- frequency: 16
34. getAlertEditorWithTitle -- frequency: 14
35. getAlertMessage -- frequency: 14
36. getTitle -- frequency: 14
37. getActionName -- frequency: 12
38. getInputNumField -- frequency: 12
39. getSliderWidth -- frequency: 12
40. getSelectedItem -- frequency: 11
41. getAllInsertDropdownOptions -- frequency: 10
42. getCurrentPage -- frequency: 10
43. getDossierView -- frequency: 10
44. getSourceButton -- frequency: 10
45. getTitleStyle -- frequency: 10
46. getBadInput -- frequency: 8
47. getBulkEditSubmitButton -- frequency: 8
48. getBulkEditToolbar -- frequency: 8
49. getButtonFormatPopup -- frequency: 8
50. getRsdGridByKey -- frequency: 8
51. getSettingMenu -- frequency: 8
52. getTextFieldValue -- frequency: 8
53. getTopBarInTransactionEditor -- frequency: 8
54. getValue -- frequency: 8
55. getVisualizationTitleBarRoot -- frequency: 8
56. D7 F6 F0 -- frequency: 6
57. getBulkEditSubmitButtonEnabled -- frequency: 6
58. getDropdownInsertTextBox -- frequency: 6
59. getErrorInputNumField -- frequency: 6
60. getPageTitleText -- frequency: 6
61. getVisualizationSubTitleBarRoot -- frequency: 6
62. 5 C388 C -- frequency: 4
63. ABABAB -- frequency: 4
64. div.ag-header-row.ag-header-row-column -- frequency: 4
65. div.mstrmojo-Button-text=SimpleCase -- frequency: 4
66. FCC95 A -- frequency: 4
67. getButton -- frequency: 4
68. getCheckedDeleteRow -- frequency: 4
69. getControlTypeTextForPython -- frequency: 4
70. getCurrentValue -- frequency: 4
71. getEnterTXNModeBtn -- frequency: 4
72. getFilterTypeDropDown -- frequency: 4
73. getHeader -- frequency: 4
74. getHTMLNode -- frequency: 4
75. getImageBoxByIndex -- frequency: 4
76. getInputValuesWithConfigurations -- frequency: 4
77. getInsertContainer -- frequency: 4
78. getManualInputErrorCell -- frequency: 4
79. getNumberOfRows -- frequency: 4
80. getPanelByID -- frequency: 4
81. getTextNode -- frequency: 4
82. getTooltipsText -- frequency: 4
83. getUpdatedCell -- frequency: 4
84. getVisualizationTitleBarTextArea -- frequency: 4
85. getOneRowData -- frequency: 3
86. 38 AE6 F -- frequency: 2
87. 834 FBD -- frequency: 2
88. Apply Btn -- frequency: 2
89. BCB1 E2 -- frequency: 2
90. Cancel Btn -- frequency: 2
91. D76322 -- frequency: 2
92. DF77 A8 -- frequency: 2
93. div.mstrmojo-Label.dont-show-popup-text -- frequency: 2
94. div.mtxt=Action Button -- frequency: 2
95. F56 E21 -- frequency: 2
96. getActiveView -- frequency: 2
97. getAttrOrMetricSelectorContainerUsingId -- frequency: 2
98. getBulkTxnGridCellErrorByPosition -- frequency: 2
99. getCellByTypeAndInputValue -- frequency: 2
100. getConfirmContainer -- frequency: 2
101. getControlTypeSettingErrorButton -- frequency: 2
102. getDDICdropdownElements -- frequency: 2
103. getEditGridCellAtPosition -- frequency: 2
104. getElementOrValueFilterByTitle -- frequency: 2
105. getGridCellTextByPosition -- frequency: 2
106. getHighestRating -- frequency: 2
107. getInlineInsertContainer -- frequency: 2
108. getInputConfig -- frequency: 2
109. getInsertInputElements -- frequency: 2
110. getItemInSuggestionList -- frequency: 2
111. getLowestRating -- frequency: 2
112. getMappingEditorTableColumns -- frequency: 2
113. getMappingEditorTableColumnsAndInputValues -- frequency: 2
114. getSelectedNamespace -- frequency: 2
115. getSqlText -- frequency: 2
116. getSurveyContainer -- frequency: 2
117. getTableColumnsAndInputValues -- frequency: 2
118. getTabScreenshot -- frequency: 2
119. getTextAreaValue -- frequency: 2
120. getTitleFontColor -- frequency: 2
121. getTitleFontFamily -- frequency: 2
122. getTitleFontSize -- frequency: 2
123. getTransactionDialogTextHeight -- frequency: 2
124. body -- frequency: 1
125. Date Icon -- frequency: 1
126. Dropdown List -- frequency: 1
127. getEditableFiledByValue -- frequency: 1
128. getSelectedTxt -- frequency: 1
129. getTextAreaValueByName -- frequency: 1
130. Input Box -- frequency: 1
131. Survey Container -- frequency: 1
132. Text Field DIC -- frequency: 1
133. Wait Mask -- frequency: 1

## Key Actions

- `getTitleBarContainer()` -- used in 406 specs
- `getCSSProperty()` -- used in 294 specs
- `getGridContainer()` -- used in 258 specs
- `getText()` -- used in 244 specs
- `isDisplayed()` -- used in 173 specs
- `clickBulkTxnGridCellByPosition()` -- used in 130 specs
- `getGridCellByPosition()` -- used in 128 specs
- `waitForAuthoringPageLoading()` -- used in 126 specs
- `getInsertDropdown()` -- used in 120 specs
- `getInsertTextBox()` -- used in 106 specs
- `isExisting()` -- used in 100 specs
- `goToPage()` -- used in 98 specs
- `waitForCurtainDisappear()` -- used in 98 specs
- `editDossierByUrl()` -- used in 86 specs
- `setInputNumField()` -- used in 70 specs
- `setManualInputCell()` -- used in 66 specs
- `getInsertSlider()` -- used in 62 specs
- `getBulkTxnGridCellByPosition()` -- used in 60 specs
- `getInsertDropdownOverlay()` -- used in 58 specs
- `getAttribute()` -- used in 56 specs
- `clickButton()` -- used in 54 specs
- `openContextMenu()` -- used in 54 specs
- `openDossier()` -- used in 54 specs
- `openPageFromTocMenu()` -- used in 54 specs
- `setDropdown()` -- used in 54 specs
- `getAllAgGridObjectCount()` -- used in 52 specs
- `sleep()` -- used in 51 specs
- `getValue()` -- used in 50 specs
- `clickOnBulkEditSubmitButton()` -- used in 48 specs
- `hasDDICcandidatePicker()` -- used in 48 specs
- `openDossierById()` -- used in 48 specs
- `goToLibrary()` -- used in 47 specs
- `actionOnMenubar()` -- used in 46 specs
- `actionOnSubmenuNoContinue()` -- used in 46 specs
- `applyTheme()` -- used in 46 specs
- `clickControlTypeSettingButton()` -- used in 46 specs
- `getTargetButton()` -- used in 46 specs
- `getTransactionSlider()` -- used in 46 specs
- `selectConfirmationPopupOption()` -- used in 46 specs
- `selectContextMenuOption()` -- used in 46 specs
- `typeInsertTextBox()` -- used in 46 specs
- `waitLoadingDataPopUpIsNotDisplayed()` -- used in 46 specs
- `searchTheme()` -- used in 44 specs
- `waitDataLoaded()` -- used in 43 specs
- `chooseInsertDropdownOption()` -- used in 42 specs
- `clickDropdown()` -- used in 40 specs
- `getManualInputCell()` -- used in 40 specs
- `waitForConsumptionModeToRefresh()` -- used in 40 specs
- `login()` -- used in 39 specs
- `clickAddValueButton()` -- used in 38 specs
- `enterBulkTxnMode()` -- used in 38 specs
- `clickContainer()` -- used in 36 specs
- `getAgGridColsContainer()` -- used in 36 specs
- `getDDICcandidatePickerPullDownOption()` -- used in 36 specs
- `clickVisualizationTitle()` -- used in 34 specs
- `getDDICcandidatePicker()` -- used in 34 specs
- `getPopup()` -- used in 34 specs
- `hasDirtyFlag(el)` -- used in 34 specs
- `openTitleContainerFormatPanel()` -- used in 34 specs
- `clickButtonFromToolbar()` -- used in 30 specs
- `getConfirmationPopup()` -- used in 30 specs
- `getElement()` -- used in 30 specs
- `inputInsertTextBoxWithEnter()` -- used in 30 specs
- `getActiveTxnTab()` -- used in 28 specs
- `getPulldownOptionCount()` -- used in 28 specs
- `getTitleBarSetting()` -- used in 28 specs
- `InputValueInBulkTxnGridCell()` -- used in 28 specs
- `isControlTypeAvailable()` -- used in 28 specs
- `keys()` -- used in 28 specs
- `clickOnButtonByName()` -- used in 27 specs
- `dragSlider(toOffset)` -- used in 27 specs
- `findCellFromLocation()` -- used in 27 specs
- `clickHeaderElement()` -- used in 26 specs
- `clickOnPage()` -- used in 26 specs
- `getTitleButton()` -- used in 26 specs
- `selectTxnTab()` -- used in 26 specs
- `waitForSliderDisappear()` -- used in 26 specs
- `submitChanges()` -- used in 25 specs
- `clickContainerByScript()` -- used in 24 specs
- `doubleClickGridCellByPosition()` -- used in 24 specs
- `getContextMenuOption()` -- used in 24 specs
- `getCurrentSelectionInDropdown()` -- used in 24 specs
- `getDDICPullDownText()` -- used in 24 specs
- `moveMouse()` -- used in 24 specs
- `openContextMenuItemForCellAtPosition()` -- used in 24 specs
- `toggleTitleButtons()` -- used in 24 specs
- `clickBuiltInColor()` -- used in 22 specs
- `clickColorPickerModeBtn()` -- used in 22 specs
- `getAgGridViewPort()` -- used in 22 specs
- `getInsertSliderWithoutClick()` -- used in 22 specs
- `sumbitChangesWithNoWait()` -- used in 21 specs
- `clickControlType()` -- used in 20 specs
- `getInputField()` -- used in 20 specs
- `isBtnDisabled(text)` -- used in 20 specs
- `openDefaultApp()` -- used in 20 specs
- `waitForTransactionEditorLoaded()` -- used in 20 specs
- `applyButtonForSelectTarget()` -- used in 18 specs
- `checkElementUnderDDICdropdown()` -- used in 18 specs
- `clickConfirmContainerIcon()` -- used in 18 specs
- `clickTitleBarButtonInConsumption()` -- used in 18 specs
- `getEditableFieldByName()` -- used in 18 specs
- `isAddTableButtonDisplayed()` -- used in 18 specs
- `isPresent()` -- used in 18 specs
- `modifyActionName()` -- used in 18 specs
- `getEditableField()` -- used in 17 specs
- `clickExpandIcon()` -- used in 16 specs
- `customCredentials()` -- used in 16 specs
- `getTransactionDialogText()` -- used in 16 specs
- `openDDICdropdown()` -- used in 16 specs
- `replaceTextInGridCellAndEnter()` -- used in 16 specs
- `setTitleStyle()` -- used in 16 specs
- `dragSliderForInsertData()` -- used in 14 specs
- `getAlertEditorWithTitle()` -- used in 14 specs
- `getAlertMessage()` -- used in 14 specs
- `getTitle()` -- used in 14 specs
- `selectDropdownOption()` -- used in 14 specs
- `selectElementsInDropdown()` -- used in 14 specs
- `setControlType()` -- used in 14 specs
- `actionOnMenubarWithSubmenu()` -- used in 12 specs
- `clickButtonBackgroundColorBtn()` -- used in 12 specs
- `clickDossierPanelStackSwitchTab()` -- used in 12 specs
- `editTargetVisualizations()` -- used in 12 specs
- `getActionName()` -- used in 12 specs
- `getInputNumField()` -- used in 12 specs
- `getSliderWidth()` -- used in 12 specs
- `isActionButtonDisplayed(name)` -- used in 12 specs
- `selectItem(name)` -- used in 12 specs
- `getSelectedItem()` -- used in 11 specs
- `clickButtonFormatIcon()` -- used in 10 specs
- `clickVisualizationTitleContainer()` -- used in 10 specs
- `dismissButtonFormatPopup()` -- used in 10 specs
- `getAllInsertDropdownOptions()` -- used in 10 specs
- `getCurrentPage()` -- used in 10 specs
- `getDossierView()` -- used in 10 specs
- `getSourceButton()` -- used in 10 specs
- `getTitleStyle()` -- used in 10 specs
- `selectTargetButton()` -- used in 10 specs
- `selectTargetVisualizations()` -- used in 10 specs
- `toggleTitles()` -- used in 10 specs
- `chooseCalendar(year, month, day)` -- used in 9 specs
- `addNewRow()` -- used in 8 specs
- `chooseList(name, item)` -- used in 8 specs
- `chooseValue(value)` -- used in 8 specs
- `clickButtonIconColorBtn()` -- used in 8 specs
- `clickButtonTextFontColorBtn()` -- used in 8 specs
- `clickCheckbox()` -- used in 8 specs
- `clickDDICdropdownBtn()` -- used in 8 specs
- `clickHtBtnOnAlert()` -- used in 8 specs
- `clickOKButtonInDropdown()` -- used in 8 specs
- `clickOnElement()` -- used in 8 specs
- `clickOnInsertDropdown()` -- used in 8 specs
- `clickTitleBackgroundColorBtn()` -- used in 8 specs
- `contextMenuOnPage()` -- used in 8 specs
- `findCell()` -- used in 8 specs
- `getBadInput()` -- used in 8 specs
- `getBulkEditSubmitButton()` -- used in 8 specs
- `getBulkEditToolbar()` -- used in 8 specs
- `getButtonFormatPopup()` -- used in 8 specs
- `GetMapType()` -- used in 8 specs
- `getRsdGridByKey()` -- used in 8 specs
- `getSettingMenu()` -- used in 8 specs
- `getTextFieldValue(name)` -- used in 8 specs
- `getTopBarInTransactionEditor()` -- used in 8 specs
- `getVisualizationTitleBarRoot()` -- used in 8 specs
- `inputTextFieldByName(name, text, flag = true)` -- used in 8 specs
- `isChecked()` -- used in 8 specs
- `isDossierEditorDisplayed()` -- used in 8 specs
- `isTransactionConfigEditorClosed()` -- used in 8 specs
- `toggleTitleBar()` -- used in 8 specs
- `waitForLoaddingDisappear()` -- used in 8 specs
- `waitForPageReload()` -- used in 8 specs
- `inputTextField(text)` -- used in 7 specs
- `setSwitchContainer()` -- used in 7 specs
- `addObjectToVizByDoubleClick()` -- used in 6 specs
- `cancelButtonForSelectTarget()` -- used in 6 specs
- `changeFilterType()` -- used in 6 specs
- `clickActiontoOpenTransactionEditor()` -- used in 6 specs
- `clickApplyBtn()` -- used in 6 specs
- `clickButtonVisibleIcon()` -- used in 6 specs
- `clickCell()` -- used in 6 specs
- `clickChartElementByIndex()` -- used in 6 specs
- `clickOnAGGridCell()` -- used in 6 specs
- `getBulkEditSubmitButtonEnabled()` -- used in 6 specs
- `getDropdownInsertTextBox()` -- used in 6 specs
- `getErrorInputNumField()` -- used in 6 specs
- `getPageTitleText()` -- used in 6 specs
- `getVisualizationSubTitleBarRoot()` -- used in 6 specs
- `handleError()` -- used in 6 specs
- `inputTextArea(text)` -- used in 6 specs
- `IsMenuButtonValid()` -- used in 6 specs
- `isPageRefreshed()` -- used in 6 specs
- `openDossierByID()` -- used in 6 specs
- `openTxnConfigEditorByContextMenu()` -- used in 6 specs
- `openVizFormatPanel()` -- used in 6 specs
- `renameVisualizationByDoubleClick()` -- used in 6 specs
- `replaceTextInGridCell()` -- used in 6 specs
- `selectGridElement()` -- used in 6 specs
- `switchToEditorPanel()` -- used in 6 specs
- `waitForDisplayed()` -- used in 6 specs
- `waitForSliderForInlineEdit()` -- used in 6 specs
- `waitLibraryLoadingIsNotDisplayed()` -- used in 6 specs
- `clickMinusBtn(times = 1)` -- used in 5 specs
- `clickStepperUpBtn(times = 1)` -- used in 5 specs
- `selectSearchableListItem(name)` -- used in 5 specs
- `setListContainer()` -- used in 5 specs
- `actionOnmenubarWithSubmenu()` -- used in 4 specs
- `actionOnToolbar()` -- used in 4 specs
- `addManualInputRow()` -- used in 4 specs
- `apply()` -- used in 4 specs
- `changeButtonFillColorOpacity()` -- used in 4 specs
- `changeValue()` -- used in 4 specs
- `checkTableColumn()` -- used in 4 specs
- `clickBulkMode()` -- used in 4 specs
- `clickButtonBorderColorBtn()` -- used in 4 specs
- `clickButtonOnFooter()` -- used in 4 specs
- `clickInsertDataCell()` -- used in 4 specs
- `clickMappedTable()` -- used in 4 specs
- `clickNamespaceListButton()` -- used in 4 specs
- `clickTableColumn()` -- used in 4 specs
- `doubleClick()` -- used in 4 specs
- `enterOnInput()` -- used in 4 specs
- `getButton()` -- used in 4 specs
- `getCheckedDeleteRow()` -- used in 4 specs
- `getControlTypeTextForPython()` -- used in 4 specs
- `getCurrentValue()` -- used in 4 specs
- `getEnterTXNModeBtn()` -- used in 4 specs
- `getFilterTypeDropDown()` -- used in 4 specs
- `getHeader()` -- used in 4 specs
- `getHTMLNode()` -- used in 4 specs
- `getImageBoxByIndex()` -- used in 4 specs
- `getInputValuesWithConfigurations()` -- used in 4 specs
- `getInsertContainer()` -- used in 4 specs
- `getManualInputErrorCell()` -- used in 4 specs
- `getNumberOfRows()` -- used in 4 specs
- `getPanelByID()` -- used in 4 specs
- `getTextNode()` -- used in 4 specs
- `getTooltipsText()` -- used in 4 specs
- `getUpdatedCell()` -- used in 4 specs
- `getVisualizationTitleBarTextArea()` -- used in 4 specs
- `hoverOnAGGridCell()` -- used in 4 specs
- `hoverOnErrorInputNumField()` -- used in 4 specs
- `hoverTitleBarButton()` -- used in 4 specs
- `includes()` -- used in 4 specs
- `isSelected()` -- used in 4 specs
- `isTooltipDisplayed()` -- used in 4 specs
- `matchScreenshot()` -- used in 4 specs
- `openButtonBorderPullDown()` -- used in 4 specs
- `openDossierByIDInPresentationMode()` -- used in 4 specs
- `saveInMyReport()` -- used in 4 specs
- `scrollAndSelectItem()` -- used in 4 specs
- `searchForObject()` -- used in 4 specs
- `selectButtonBorderStyle()` -- used in 4 specs
- `selectButtonRadius()` -- used in 4 specs
- `selectButtonSize()` -- used in 4 specs
- `selectButtonTextFontStyle()` -- used in 4 specs
- `selectFontAlign()` -- used in 4 specs
- `selectFontStyle()` -- used in 4 specs
- `selectItemInSuggestionList()` -- used in 4 specs
- `selectTitleOption()` -- used in 4 specs
- `setButtonLabelOption()` -- used in 4 specs
- `setCheckbox()` -- used in 4 specs
- `setNamespaceCheckbox()` -- used in 4 specs
- `setStarRatingContainer()` -- used in 4 specs
- `setStepperContainer()` -- used in 4 specs
- `setToggleContainer()` -- used in 4 specs
- `submitChangesWithPageFreshed()` -- used in 4 specs
- `switchToTransactionOptionsSection()` -- used in 4 specs
- `switchUser()` -- used in 4 specs
- `validateNamespaceCheckbox()` -- used in 4 specs
- `waitForInfoWindowLoading()` -- used in 4 specs
- `chooseTime(hour, meridiem, minute, second)` -- used in 3 specs
- `clickPlusBtn(times = 1)` -- used in 3 specs
- `confirm()` -- used in 3 specs
- `getOneRowData()` -- used in 3 specs
- `isCellDisplayed()` -- used in 3 specs
- `isItemSelected(name)` -- used in 3 specs
- `changeGroupBy()` -- used in 2 specs
- `changeViz()` -- used in 2 specs
- `checkWhereClauseButtons()` -- used in 2 specs
- `clear()` -- used in 2 specs
- `clearAllTextInSqlEditor()` -- used in 2 specs
- `clearTxnConfigByContextMenu()` -- used in 2 specs
- `clickBulkTxnModeIcon()` -- used in 2 specs
- `clickCancelBtn()` -- used in 2 specs
- `clickCloseBtn()` -- used in 2 specs
- `clickDropdownInsertTextBox()` -- used in 2 specs
- `clickEditIcon()` -- used in 2 specs
- `clickFontColorBtn()` -- used in 2 specs
- `clickOnContainerTitle()` -- used in 2 specs
- `clickOnDocLayout()` -- used in 2 specs
- `clickOnGridElement()` -- used in 2 specs
- `clickPanelStackContextMenuItem()` -- used in 2 specs
- `clickStepperDownBtn()` -- used in 2 specs
- `clickTxnTypeOnFormatPanel()` -- used in 2 specs
- `clickVisibleButtonByAriaLabel()` -- used in 2 specs
- `clickWhereClauseButtons()` -- used in 2 specs
- `closeDossierWithoutSaving()` -- used in 2 specs
- `deleteRow()` -- used in 2 specs
- `dismissColorPicker()` -- used in 2 specs
- `dismissMissingFontPopup()` -- used in 2 specs
- `editTxnConfigByContextMenu()` -- used in 2 specs
- `execute()` -- used in 2 specs
- `executeScript()` -- used in 2 specs
- `findTextAreaButtonFromLocation()` -- used in 2 specs
- `getActiveView()` -- used in 2 specs
- `getAttrOrMetricSelectorContainerUsingId()` -- used in 2 specs
- `getBulkTxnGridCellErrorByPosition()` -- used in 2 specs
- `getCellByTypeAndInputValue()` -- used in 2 specs
- `getConfirmContainer()` -- used in 2 specs
- `getControlTypeSettingErrorButton()` -- used in 2 specs
- `getDDICdropdownElements()` -- used in 2 specs
- `getEditGridCellAtPosition()` -- used in 2 specs
- `getElementOrValueFilterByTitle()` -- used in 2 specs
- `getGridCellTextByPosition()` -- used in 2 specs
- `getHighestRating()` -- used in 2 specs
- `getInlineInsertContainer()` -- used in 2 specs
- `getInputConfig()` -- used in 2 specs
- `getInsertInputElements()` -- used in 2 specs
- `getItemInSuggestionList()` -- used in 2 specs
- `getLowestRating()` -- used in 2 specs
- `getMappingEditorTableColumns()` -- used in 2 specs
- `getMappingEditorTableColumnsAndInputValues()` -- used in 2 specs
- `getSelectedNamespace()` -- used in 2 specs
- `getSqlText()` -- used in 2 specs
- `getSurveyContainer()` -- used in 2 specs
- `getTableColumnsAndInputValues()` -- used in 2 specs
- `getTabScreenshot()` -- used in 2 specs
- `getTextAreaValue()` -- used in 2 specs
- `getTitleFontColor()` -- used in 2 specs
- `getTitleFontFamily()` -- used in 2 specs
- `getTitleFontSize()` -- used in 2 specs
- `getTransactionDialogTextHeight()` -- used in 2 specs
- `hoverOnVisualizationContainer()` -- used in 2 specs
- `inputTextFieldByValue(value, text)` -- used in 2 specs
- `isApplyBtnsDisabled()` -- used in 2 specs
- `isCheckboxChecked()` -- used in 2 specs
- `isDialogDisplayed()` -- used in 2 specs
- `isDialogHidden()` -- used in 2 specs
- `isEditorClosed()` -- used in 2 specs
- `isEnabled()` -- used in 2 specs
- `isFontAlignButtonDisabled()` -- used in 2 specs
- `isGrayed()` -- used in 2 specs
- `isListDropdownPresent()` -- used in 2 specs
- `log()` -- used in 2 specs
- `navigateLinkByKey()` -- used in 2 specs
- `openContextMenu3()` -- used in 2 specs
- `openContextMenuItemForValue()` -- used in 2 specs
- `openContextSubMenuItemForHeader()` -- used in 2 specs
- `openLayerSelection()` -- used in 2 specs
- `scrollHorizontally()` -- used in 2 specs
- `scrollVerticallyToBottom()` -- used in 2 specs
- `selectButtonTextFont()` -- used in 2 specs
- `selectDDICitems()` -- used in 2 specs
- `selectNewLayer()` -- used in 2 specs
- `selectTextFont()` -- used in 2 specs
- `selectTxnView()` -- used in 2 specs
- `setButtonAlias()` -- used in 2 specs
- `setExportButtonOption()` -- used in 2 specs
- `setGridFieldForPython()` -- used in 2 specs
- `setLikertScaleContainer()` -- used in 2 specs
- `setTextFontSize()` -- used in 2 specs
- `toBeTruthy()` -- used in 2 specs
- `toggleTxnTypeOnFormatPanel()` -- used in 2 specs
- `toMatchBaseline()` -- used in 2 specs
- `toString()` -- used in 2 specs
- `typeInSqlEditor()` -- used in 2 specs
- `verifyTableColumns()` -- used in 2 specs
- `waitForTransactionSliderDisplayed()` -- used in 2 specs
- `waitPageLoading()` -- used in 2 specs
- `waitPageRefresh()` -- used in 2 specs
- `cancel()` -- used in 1 specs
- `chooseDropDownList(name, item)` -- used in 1 specs
- `confirmReset()` -- used in 1 specs
- `discardChanges()` -- used in 1 specs
- `findGridByKey()` -- used in 1 specs
- `getEditableFiledByValue()` -- used in 1 specs
- `getSelectedTxt()` -- used in 1 specs
- `getTextAreaValueByName(name)` -- used in 1 specs
- `goBackFromDossierLink()` -- used in 1 specs
- `goNext()` -- used in 1 specs
- `inputTextAreaByName(name, text)` -- used in 1 specs
- `isDirtyFlagDisappear(el)` -- used in 1 specs
- `recalculateChanges()` -- used in 1 specs
- `scrollOnPage()` -- used in 1 specs
- `selectCellInOneRow()` -- used in 1 specs
- `selectListItem(name)` -- used in 1 specs
- `selectReset()` -- used in 1 specs
- `selectSearchableListItemBySearch(value)` -- used in 1 specs
- `setSliderContainer()` -- used in 1 specs
- `setTimeWithInput(dateTime)` -- used in 1 specs
- `showCalendarByDateIcon()` -- used in 1 specs
- `waitForGridLoaded()` -- used in 1 specs
- `waitWidgetLoaded()` -- used in 1 specs
- `clickOnContainerByKey(key)` -- used in 0 specs
- `clickSearchableListIconNode()` -- used in 0 specs
- `fieldValueBy(key)` -- used in 0 specs
- `getHighest()` -- used in 0 specs
- `getListItem(name)` -- used in 0 specs
- `getListSelection()` -- used in 0 specs
- `getLowest()` -- used in 0 specs
- `getSearchableListSelectedTxt()` -- used in 0 specs
- `inputTextArea(name, text)` -- used in 0 specs
- `inputTextField(name, text)` -- used in 0 specs
- `inputTextFieldByKey(key, text)` -- used in 0 specs
- `waitForMaskDisappear()` -- used in 0 specs

## Source Coverage

- `pageObjects/transaction/**/*.js`
- `specs/regression/transaction/**/*.{ts,js}`
- `specs/regression/DossierTransaction/**/*.{ts,js}`
- `specs/regression/DossierTransaction/Component/**/*.{ts,js}`
- `specs/regression/DossierTransaction/PythonTransaction/**/*.{ts,js}`
- `specs/regression/DossierTransaction/SQLTransaction/**/*.{ts,js}`
