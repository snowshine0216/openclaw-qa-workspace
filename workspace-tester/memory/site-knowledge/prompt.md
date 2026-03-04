# Site Knowledge: Prompt Domain

## Overview

- **Domain key:** `prompt`
- **Components covered:** AEPrompt, CalendarPicker, CalendarStyle, CheckboxStyle, HierarchyPrompt, ObjectPrompt, PersonalAnswer, PromptObject, PullDownStyle, QualificationPrompt, QualificationPullDownStyle, RadioButtonStyle, ShoppingCartStyle, TextboxStyle, TimePicker, TreeStyle, ValuePrompt
- **Spec files scanned:** 47
- **POM files scanned:** 17

## Components

### AEPrompt
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - _none_
- **Related components:** _none_

### CalendarPicker
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `checkAdjustmentInDynamicCalendar()`
  - `checkExcludeWeekendsInDynamicCalendar()`
  - `clearAndInputYear(year)`
  - `clickDoneButtonInDynamicCalendar()`
  - `getAdjustmentDaysOptionsCountInDynamicCalendar()`
  - `getMonthValue()`
  - `getMonthYearValueInCalendar()`
  - `getNewResolvedDateInDynamicCalendar()`
  - `getYearValue()`
  - `inputAdjustmentDaysInDynamicCalendar(days)`
  - `isCalendarOpen()`
  - `isDynamicToggleOn()`
  - `isDynamicToggleShow()`
  - `openAdjustmentDateInputInDynamicCalendar()`
  - `openAdjustmentMonthDayInputInDynamicCalendar()`
  - `openMonthDropDownMenu()`
  - `selectAdjustDateInDynamicCalendar(dateName)`
  - `selectAdjustmentPeriodInDynamicCalendar(period)`
  - `selectAdjustmentSubtypeInDynamicCalendar(subtype)`
  - `selectDay(day)`
  - `selectDayOfWeekForAdjustmentInDynamicCalendar(dayOfWeeks)`
  - `selectMonth(month)`
  - `selectMonthAndDayInAdjustmentDateInputInDynamicCalendar(month, day)`
  - `selectToday()`
  - `selectYearAndMonth(year, month)`
  - `setOffsetByInputValueInDynamicCalendar({period, offsetOperator, value})`
  - `setOffsetInDynamicCalendar({period, offsetOperator, directions, times})`
  - `switchToLastMonth()`
  - `switchToLastYear()`
  - `switchToNextMonth()`
  - `switchToNextYear()`
  - `toggleDynamicCalendar()`
  - `uncheckAdjustmentInDynamicCalendar()`
  - `uncheckExcludeWeekendsInDynamicCalendar()`
- **Related components:** getCalendarWidget, getDynamicCalendarWidget

### CalendarStyle
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `checkAdjustmentInDynamicCalendar(promptElement)`
  - `checkExcludeWeekendsInDynamicCalendar(promptElement)`
  - `clearAndInputHour(promptElement, hour)`
  - `clearAndInputMinute(promptElement, minute)`
  - `clearAndInputSecond(promptElement, second)`
  - `clearAndInputYear(promptElement, year)`
  - `clickDoneButtonInDynamicCalendar(promptElement)`
  - `clickHour(promptElement)`
  - `clickMinute(promptElement)`
  - `clickSecond(promptElement)`
  - `closeCalendar(promptElement)`
  - `getAdjustmentDaysOptionsCountInDynamicCalendar(promptElement)`
  - `getHourValue(promptElement)`
  - `getMinuteValue(promptElement)`
  - `getMonthValue(promptElement)`
  - `getMonthYearValueInCalendar(promptElement)`
  - `getNewResolvedDateInDynamicCalendar(promptElement)`
  - `getSecondValue(promptElement)`
  - `getYearValue(promptElement)`
  - `inputAdjustmentDaysInDynamicCalendar(promptElement, days)`
  - `isCalendarOpen(promptElement)`
  - `isDynamicSelection(promptElement)`
  - `isDynamicToggleOn(promptElement)`
  - `isDynamicToggleShow(promptElement)`
  - `openAdjustmentDateInputInDynamicCalendar(promptElement)`
  - `openAdjustmentMonthDayInputInDynamicCalendar(promptElement)`
  - `openCalendar(promptElement)`
  - `openMonthDropDownMenu(promptElement)`
  - `selectAdjustDateInDynamicCalendar(promptElement, dateName)`
  - `selectAdjustmentPeriodInDynamicCalendar(promptElement, period)`
  - `selectAdjustmentSubtypeInDynamicCalendar(promptElement, subtype)`
  - `selectDay(promptElement, day)`
  - `selectDayOfWeekForAdjustmentInDynamicCalendar(promptElement, dayOfWeeks)`
  - `selectMonth(promptElement, month)`
  - `selectMonthAndDayInAdjustmentDateInputInDynamicCalendar(promptElement, month, day)`
  - `selectToday(promptElement)`
  - `selectYearAndMonth(promptElement, year, month)`
  - `setOffsetInDynamicCalendar(promptElement, {period, offsetOperator, directions, times})`
  - `switchToLastMonth(promptElement)`
  - `switchToLastYear(promptElement)`
  - `switchToNextMonth(promptElement)`
  - `switchToNextYear(promptElement)`
  - `toggleDynamicCalendar(promptElement)`
  - `uncheckAdjustmentInDynamicCalendar(promptElement)`
  - `uncheckExcludeWeekendsInDynamicCalendar(promptElement)`
- **Related components:** getCalendarWidget, getTimeWidget

### CheckboxStyle
- **CSS root:** `.mstrCheckListReadyState`
- **User-visible elements:**
  - Loading State (`.mstrCheckListReadyState`)
- **Component actions:**
  - `clearSearch(promptElement)`
  - `clickCheckboxByName(promptElement, itemName)`
  - `clickMatchCase(promptElement)`
  - `goToFirstPage(promptElement)`
  - `goToLastPage(promptElement)`
  - `goToNextPage(promptElement)`
  - `goToPreviousPage(promptElement)`
  - `isFirstItemSelected(promptElement)`
  - `isItemSelected(promptElement, itemName)`
  - `isLastItemSelected(promptElement)`
  - `searchFor(promptElement, text)`
  - `selectedItemCount(promptElement)`
- **Related components:** _none_

### HierarchyPrompt
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - _none_
- **Related components:** _none_

### ObjectPrompt
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - _none_
- **Related components:** _none_

### PersonalAnswer
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `addPersonalAnswer(promptElement, answerName)`
  - `clickRememberThisAnswer(promptElement)`
  - `deletePersonalAnswer(promptElement, name)`
  - `isPersonalAnswerPresent(promptElement)`
  - `loadPersonalAnswer(promptElement, name)`
  - `openPersonalAnswers(promptElement)`
  - `openSavedAnswersPopup(promptElement)`
  - `personalAnswerCount(promptElement)`
  - `renamePersonalAnswer(promptElement, oldName, newName)`
- **Related components:** _none_

### PromptObject
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickItemCountText(promptElement)`
  - `getItemCountText(promptElement)`
  - `getWarningMsg(promptElement)`
  - `goToFirstPage(promptElement)`
  - `goToLastPage(promptElement)`
  - `goToNextPage(promptElement)`
  - `goToPreviousPage(promptElement)`
  - `isInvalidAnswer(promptElement)`
  - `isMessagePresent(promptElement)`
  - `waitForMessage(promptElement)`
- **Related components:** _none_

### PullDownStyle
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clearSearch(promptElement)`
  - `clickMatchCase(promptElement)`
  - `getSelectedItem(promptElement)`
  - `isFirstSelected(promptElement)`
  - `isItemInList(promptElement, text)`
  - `isLastSelected(promptElement)`
  - `isOnlyAllInList(promptElement)`
  - `multiSelectListItem(promptElement, items)`
  - `scrollDownList(promptElement)`
  - `searchFor(promptElement, text)`
  - `selectListItem(promptElement, text)`
  - `selectPullDownItem(promptElement, text)`
  - `togglePullDownList(promptElement)`
- **Related components:** _none_

### QualificationPrompt
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - _none_
- **Related components:** _none_

### QualificationPullDownStyle
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clearAndInputLowserValue(promptElement, value)`
  - `clearAndInputUpperValue(promptElement, value)`
  - `clearInputLowerValue(promptElement)`
  - `clearUppperValue(promptElement)`
  - `clickInputValueInput(promptElement)`
  - `clickUpperValue(promptElement)`
  - `closeDropDownList(promptElement)`
  - `closeMQConditionList(promptElement)`
  - `closeMQLevelList(promptElement)`
  - `confirmBrowserValues(promptElement)`
  - `currentDropdownSelection(promptElement)`
  - `editAttrSelection(promptElement)`
  - `getAQConditionTextNoAttr(promptElement)`
  - `getDefaultAnswerText(promptElement)`
  - `getValueSelectionListCount(promptElement)`
  - `inputLowerValue(promptElement, value)`
  - `inputUpperValue(promptElement, value)`
  - `isBrowseValueVisible(promptElement)`
  - `isDynamicIconVisibleInLowerInput(promptElement)`
  - `isDynamicIconVisibleInUpperInput(promptElement)`
  - `isImportFileVisible(promptElement)`
  - `isLowerValueInputVisible(promptElement)`
  - `isUpperValueInputVisible(promptElement)`
  - `openAQCondotion(promptElement)`
  - `openAQSelectCondotion(promptElement)`
  - `openAttrFormList(promptElement)`
  - `openBrowseValuesWindow(promptElement)`
  - `openChooseAttributesWindow(promptElement)`
  - `openDropDownList(promptElement)`
  - `openImportFileWindow(promptElement)`
  - `openLowerInputCalendar(promptElement)`
  - `openMQConditionList(promptElement)`
  - `openMQLevelList(promptElement)`
  - `openUpperInputCalendar(promptElement)`
  - `scrollDownConditionList(promptElement, offset)`
  - `selectAQCondition(promptElement, form)`
  - `selectAQSelectCondition(promptElement, form)`
  - `selectAQType(promptElement, type)`
  - `selectAttrForm(promptElement, form)`
  - `selectDefaultSelection(promptElement)`
  - `selectDropDownItem(promptElement, text)`
  - `selectMQCondition(promptElement, conName)`
  - `selectMQLevel(promptElement, levelName)`
  - `selectYourSelection(promptElement)`
  - `selectYourSelectionIcon(promptElement)`
- **Related components:** _none_

### RadioButtonStyle
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clearSearch(promptElement)`
  - `clickMatchCase(promptElement)`
  - `currentIndex(promptName)`
  - `getAllItemCount(promptElement)`
  - `getSelectedItemName(promptElement)`
  - `isFirstItemSelected(promptElement)`
  - `isItemSelected(promptElement, itemName)`
  - `isLastItemSelected(promptElement)`
  - `searchFor(promptElement, text)`
  - `selectRadioButtonByName(promptElement, itemName)`
  - `visibleSelectedItemCount(promptElement)`
- **Related components:** indexPage

### ShoppingCartStyle
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `addAll(promptElement, isInnerShoppingCart = false)`
  - `addNewCondition(promptElement)`
  - `addRight(promptElement)`
  - `addSingle(promptElement, isInnerShoppingCart = false)`
  - `addSingleForWeb(promptElement, elementName)`
  - `backToTop(promptElement)`
  - `cancelFileEditor(promptElement)`
  - `cancelValues(promptElement)`
  - `chooseAllSelections(promptElement)`
  - `chooseAnySelection(promptElement)`
  - `chooseNthExpr(promptElement, index)`
  - `clearAndInputValues(promptElement, value)`
  - `clearAndSearch(promptElement, text)`
  - `clearByKeyboard(promptElement)`
  - `clearSearch(promptElement)`
  - `clearValues(promptElement)`
  - `clickButton(promptElement, content)`
  - `clickConditionItem(promptElement, text)`
  - `clickdeleteConditionIcon(promptElement)`
  - `clickElmInAvailableList(promptElement, elmName, isInnerShoppingCart = false)`
  - `clickElmInSelectedList(promptElement, elmName)`
  - `clickElmInSelectedListToEdit(promptElement, itemText)`
  - `clickElmLinkInAvailableList(promptElement, elmName)`
  - `clickFetchFirst(promptElement)`
  - `clickFetchLast(promptElement)`
  - `clickFetchNext(promptElement)`
  - `clickFetchPrevious(promptElement)`
  - `clickMatchCase(promptElement)`
  - `clickNthSelectedItem(promptElement, index, isBasedOnRoot = false)`
  - `clickNthSelectedItemWithOffset(promptElement, index, isBasedOnRoot = false)`
  - `clickNthSelectedObj(promptElement, index, isBasedOnRoot = false)`
  - `clickOKCancel(promptElement, content)`
  - `clickOKinCustomization(Customization, promptElement)`
  - `clickValueInput(promptElement)`
  - `confirmFileEditor(promptElement)`
  - `confirmValues(promptElement)`
  - `deleteCondition(promptElement, index, isBasedOnRoot = false)`
  - `deleteSingle(promptElement, index, isBasedOnRoot = false)`
  - `getAvailableCartItemCount(promptElement, isInnerShoppingCart = false)`
  - `getCartItemCount(cart)`
  - `getItemCountText(promptElement)`
  - `getItemInAvailableListCount(promptElement, elmName)`
  - `getItemInSelectedCount(promptElement, elmName)`
  - `getMQValuePartText(promptElement, index)`
  - `getNthExprText(promptElement, index)`
  - `getNthSelectedItemText(promptElement, index)`
  - `getSelectedCartItemCount(promptElement, isInnerShoppingCart = false)`
  - `getSelectedConditionItemCount(promptElement)`
  - `getSelectedListCount(promptElement)`
  - `getSelectedObjectListText(promptElement)`
  - `groupItems(promptElement)`
  - `importFile(promptElement)`
  - `inputTextinImportFile(promptElement, value)`
  - `inputValues(promptElement, value)`
  - `isButtonEnabled(promptElement, button)`
  - `isImportFileEditorDisplay(promptElement)`
  - `isItemInAvailableList(promptElement, itemText)`
  - `isItemInSelectedList(promptElement, itemText)`
  - `isItemInSelectedListToEdit(promptElement, itemText, isBasedOnRoot = false)`
  - `isValuePart1ListEditorDisplay(promptElement)`
  - `moveDown(promptElement)`
  - `moveUp(promptElement)`
  - `openBrowseValuesWindow(promptElement)`
  - `openConditionDropdown(promptElement, index)`
  - `openEditValueWindow(promptElement, index)`
  - `openFormDropdown(promptElement, index)`
  - `openImportbyIcon(promptElement)`
  - `openImportFileWindow(promptElement)`
  - `openLevelDropdown(promptElement, index)`
  - `openMQFirstValue(promptElement, index)`
  - `openMQSecondValue(promptElement, index)`
  - `openNthExprMenu(promptElement, index)`
  - `openTypeDropdown(promptElement, index)`
  - `openValueListEditor(promptElement, index)`
  - `openValuePart1Calendar(promptElement)`
  - `openValuePart1Editor(promptElement, index)`
  - `openValuePart2Calendar(promptElement)`
  - `openValuePart2Editor(promptElement, index)`
  - `removeAll(promptElement, isInnerShoppingCart = false)`
  - `removeSingle(promptElement, isInnerShoppingCart = false)`
  - `scrollAvailableList(promptElement, offset)`
  - `scrollDownConditionList(promptElement, offset)`
  - `searchFor(promptElement, text)`
  - `selectCondition(promptElement, conditionText)`
  - `selectForm(promptElement, formText)`
  - `selectLevel(promptElement, levelName)`
  - `selectType(promptElement, typeText)`
  - `switchEnterValues(promptElement)`
  - `ungroupItems(promptElement)`
  - `upOneLevel(promptElement)`
  - `waitForShoppingCart(promptElement)`
- **Related components:** _none_

### TextboxStyle
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `checkTextPromptComplexAnswer(promptElement)`
  - `clearAndInputText(promptElement, value)`
  - `clearValue(promptElement, value)`
  - `clickTextBoxInput(promptElement)`
  - `inputText(promptElement, value)`
  - `text(promptElement)`
- **Related components:** _none_

### TimePicker
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `selectHour(hour)`
  - `selectMinute(minute)`
  - `selectSecond(second)`
- **Related components:** _none_

### TreeStyle
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clearSearchInEle(promptElement, eleName)`
  - `clickEleName(promptElement, eleName)`
  - `collapseEle(promptElement, eleName)`
  - `countCSSByLevel(promptElement, level)`
  - `expandEle(promptElement, eleName)`
  - `goToNextPage(promptElement, attrName)`
  - `isCollapseIconPresent(promptElement, attrName)`
  - `isExpandIconPresent(promptElement, attrName)`
  - `openErrorDetails(promptElement)`
  - `scrollTreeToBottom(promptElement)`
  - `searchInEle(promptElement, eleName, text)`
- **Related components:** _none_

### ValuePrompt
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - _none_
- **Related components:** _none_

## Common Workflows (from spec.ts)

1. Library OIDC login with user system prompt & nested group (used in 2 specs)
2. [BR-2217-01] Server settings off, user without system prompt - should login successfully but open report should fail (used in 1 specs)
3. [BR-2217-02] Server settings off, user with system prompt - should login successfully but open report should fail (used in 1 specs)
4. [BR-2217-03] Server settings on, user without system prompt - should login successfully but report should fail (used in 1 specs)
5. [BR-2217-04] Server settings on, user with system prompt - should login successfully and report should succeed (used in 1 specs)
6. [TC56106] Verify rendering report with object(exclude template) prompt in Library (used in 1 specs)
7. [TC58007]Validating Attribute Qualification Prompt with Pull Down style - Check default answer and customized answer in Library Web (used in 1 specs)
8. [TC58008] Validating Attribute Qualification Prompt with Pulldown style - Manipulation on prompt selection in Library Web (used in 1 specs)
9. [TC58009] Validating Attribute Qualification Prompt with Pulldown style - Check browser value window in Library Web (used in 1 specs)
10. [TC58010] Validating Attribute Qualification Prompt with Pulldown style- Check default operator and MinMax answer in Library Web (used in 1 specs)
11. [TC58011] AE - Shopping Cart - Search (used in 1 specs)
12. [TC58012] AE - Shopping Cart - MinMax prompt answer required (used in 1 specs)
13. [TC58013] AE - List - Single selection (used in 1 specs)
14. [TC58014] AE - List - Multiple selection (used in 1 specs)
15. [TC58017] AE - Radio Button - Re-prompt with different answers (used in 1 specs)
16. [TC58018] AE - Check Box - Check previous selections are kept via search and switch page (used in 1 specs)
17. [TC58019] AE - Check Box – Check prompt answer numbers with min/max limitation (used in 1 specs)
18. [TC58020_02] AE - Check Box – Check your selection (used in 1 specs)
19. [TC58020] AE - Check Box – Check first selection in search box (used in 1 specs)
20. [TC58922]Validating Attribute Qualification Prompt with Shopping Cart style- Check answer required and MinMax answer in Library Web (used in 1 specs)
21. [TC58923]Validating Attribute Qualification Prompt with Shopping Cart style- Check answer required and MinMax answer in Library Web (used in 1 specs)
22. [TC58925]Validating Attribute Qualification Prompt with Shopping Cart style- Check different qualification expression in Library Web (used in 1 specs)
23. [TC58927]Validating Attribute Qualification Prompt with Shopping Cart style- Check different select expression in Library Web (used in 1 specs)
24. [TC58953]Validating Attribute Qualification Prompt with Textbox style- Check different value input in Library Web (used in 1 specs)
25. [TC58954]Validating Attribute Qualification Prompt with Textbox style- Check default operator and browser form in Library Web (used in 1 specs)
26. [TC58956]Validating Attribute Qualification Prompt with Pulldown style- Check different qualification expressions in Library Web (used in 1 specs)
27. [TC58957_01]Validating Attribute Qualification Prompt with dynamic date as default answer_pull down (used in 1 specs)
28. [TC58957_02]Validating Attribute Qualification Prompt with static date as default answer_shoppingcart (used in 1 specs)
29. [TC58957]Validating Attribute Qualification Prompt with Pull Down style- Check radio button style will be changed to pull down style (used in 1 specs)
30. [TC59294]Metric Qualification Prompt with Textbox style- Check default answer and answer prompt (used in 1 specs)
31. [TC59295]MQ-Pull Down Initial rendering and check prompt page (used in 1 specs)
32. [TC59296]MQ-Pull Down check different conditions (used in 1 specs)
33. [TC59297]MQ-Pull Down check conditions with special chars (used in 1 specs)
34. [TC59298]MQ-Pull Down choose attributes window (used in 1 specs)
35. [TC59423]Metric Qualification Prompt with List style- Check answer required and answer prompt (used in 1 specs)
36. [TC59618]Metric Qualification Prompt with Radio Button style- answer prompt (used in 1 specs)
37. [TC59619]Metric Qualification Prompt with Shopping Cart style- check answer limitation (used in 1 specs)
38. [TC59622]Metric Qualification Prompt with Shopping Cart style- check independent operators (used in 1 specs)
39. [TC59624]Metric Qualification Prompt with Shopping Cart style- search all metrics in folder structure (used in 1 specs)
40. [TC59770]FFSQL - value prompt with multiple answers (used in 1 specs)
41. [TC60348] Value prompt with Calendar style - Check calendar window (used in 1 specs)
42. [TC60349] Value prompt with Calendar style - Check date limitation and answer prompt (used in 1 specs)
43. [TC60350] Value prompt with Calendar style - Answer prompt with datetime (used in 1 specs)
44. [TC60351] Value(Text) prompt - Answer prompt in different values (used in 1 specs)
45. [TC61393]Metric Qualification Prompt with Shopping Cart style- prompt name with special chars (used in 1 specs)
46. [TC63940]Validating qualification prompt with datetime format in Library (used in 1 specs)
47. [TC65001] Level prompt - check default answer and answer prompt with different levels (used in 1 specs)
48. [TC65002] Level prompt - search for different attributes (used in 1 specs)
49. [TC65003] Level prompt - check answer count limitation (used in 1 specs)
50. [TC65004] Level prompt - switch page and check answers in different pages (used in 1 specs)
51. [TC65005] Level prompt - check answer required and answer prompt with hierarchy (used in 1 specs)
52. [TC65393]HQ with Shopping Cart style - Answer prompt in all hierarchies (used in 1 specs)
53. [TC65394]HQ with Shopping Cart style - Check search required (used in 1 specs)
54. [TC65395]HQ with Tree style - Search required (used in 1 specs)
55. [TC65396]HQ with Tree style - Check tree view and answer prompt (used in 1 specs)
56. [TC65397]HQ with Tree style - Check date/year format in searching and answering prompt (used in 1 specs)
57. [TC65399]HQ with Tree style - Check search in folder structure (used in 1 specs)
58. [TC65636]Check qualification prompt with multiple selections for day attribute (used in 1 specs)
59. [TC65944_01] Value(Dateime) prompt - Default Dynamic prompt answer (used in 1 specs)
60. [TC65944_02] Value(Dateime) prompt - Default static prompt answer (used in 1 specs)
61. [TC65944] Value(Date) prompt - Default Dynamic prompt answer (used in 1 specs)
62. [TC66079] Value(Numeric) prompt with Stepper style (used in 1 specs)
63. [TC66081] Value(Numeric) prompt with textbox style set Min0Max100 (used in 1 specs)
64. [TC66082] Value(Numeric) prompt with wheel style set max100 (used in 1 specs)
65. [TC66083] Value(Numeric) prompt with slider style (used in 1 specs)
66. [TC66084] Value(Numeric) prompt with switch style disable prompt (used in 1 specs)
67. [TC66200] Value(Big decimal) prompt - Answer prompt in different values (used in 1 specs)
68. [TC66977] Object prompt - Run dossier created based on report builder (used in 1 specs)
69. [TC66978] Object prompt using filter as object (used in 1 specs)
70. [TC66979] Object prompt - Validate filter prompt used in Metric Conditionality (used in 1 specs)
71. [TC66980] Object prompt using filter with prompt in prompt as object (used in 1 specs)
72. [TC66981] Object prompt using fact as object (used in 1 specs)
73. [TC66982] Object prompt using consolidation as object (used in 1 specs)
74. [TC66983] Object prompt using custom group as object (used in 1 specs)
75. [TC66984] Object prompt using combination of attribute, consolidation and custom group as object (used in 1 specs)
76. [TC66985] Object prompt using template as object (used in 1 specs)
77. [TC66986] Object prompt using report as object (used in 1 specs)
78. [TC67045] Object prompt using attributes as object with tree style (used in 1 specs)
79. [TC67310] Prompt in prompt 2 prompts to 1 nested prompt (used in 1 specs)
80. [TC67311] Prompt in prompt 1 prompt to 2 nested prompt (used in 1 specs)
81. [TC67312] Prompt in prompt 2 groups of prompt in prompt (used in 1 specs)
82. [TC67313] Prompt in prompt 3 tiers of prompts (used in 1 specs)
83. [TC67314] Prompt in prompt using prompted report in filter (used in 1 specs)
84. [TC67315] Prompt in prompt using value prompt in filter (used in 1 specs)
85. [TC67985]AQ with Shopping Cart style- Edit/Remove answer when answer is not completed (used in 1 specs)
86. [TC76805]Validate Attribute Qualification and Hierarchy Qualification prompt with long attribute form in Library (used in 1 specs)
87. [TC78971_01] Validate search function in prompt for attribute with redefined form format in library web (used in 1 specs)
88. [TC78971_02] Validate search function in prompt for attribute with redefined form format in library web (used in 1 specs)
89. [TC79197]Validate search function in AQ prompt for attribute with redefined form format in library web (used in 1 specs)
90. [TC79923] Validate grid/graph/grid and graph report with AE prompt in library web (used in 1 specs)
91. [TC80172] Validate grid/graph/grid and graph report with object prompt in library web (used in 1 specs)
92. [TC80173] Validate grid/graph/grid and graph report with template object prompt in library web (used in 1 specs)
93. [TC80231] Validate system prompt in library (used in 1 specs)
94. [TC80232] Validating the search in the prompt of sub set report (reports based on Intelligent Cube) in Library Web (used in 1 specs)
95. [TC80235] Verify order for object prompt answer keeps same in grid (used in 1 specs)
96. [TC80238] Validate Attribute Qualification Prompt with attribute elements that have special chars (used in 1 specs)
97. [TC80251] Validate search function for attribute element prompt with multi forms (used in 1 specs)
98. [TC80253] Validate search function for attribute qualification prompt with multi forms (used in 1 specs)
99. [TC83470] Validate Prompt with long name/desc and no blank space in Library (used in 1 specs)
100. [TC84903_01] Validate Hierarchy node variable SAP prompt with different settings Library Web - multi condition (used in 1 specs)
101. [TC84903_02] Validate Hierarchy node variable SAP prompt with different settings Library Web - single condition and hierarchy (used in 1 specs)
102. [TC84903_03] Validate Hierarchy node variable SAP prompt with different settings Library Web - multi hierarchy (used in 1 specs)
103. [TC85325] Validate Characteristic Value Variable SAP prompt in Library Web (used in 1 specs)
104. [TC85326_01] Validate Characteristic Value Variable SAP prompt with Hierarchy Node SAP prompt in Library Web (used in 1 specs)
105. [TC85326_02] Validate Characteristic Value Variable SAP prompt with Authentication Hierarchy Node SAP prompt in Library Web (used in 1 specs)
106. [TC85327] Validate Formula Variable SAP prompt in Library Web (used in 1 specs)
107. [TC85328] Validate Date Variable SAP prompt in Library Web (used in 1 specs)
108. [TC85329] Validate Hierarchy Node Variable SAP prompt in Library Web (used in 1 specs)
109. [TC85330] Validate X-Func of Hierarchy Node Variable SAP prompt in Library Web - Dossier Linking (used in 1 specs)
110. [TC85372] Validate X-Func of Hierarchy Node Variable SAP prompt in Library Web - RSD Linkdrill (used in 1 specs)
111. [TC87658_01]Validating the browse and import elements option setting of Prompt in Library Web (used in 1 specs)
112. [TC87658_02]Validating the browse and import elements option setting of Prompt in Library Web (used in 1 specs)
113. [TC89830] Validate the accessibility of List Style in AE Prompt (used in 1 specs)
114. [TC89831] Validate the accessibility of Pull Down Style in AE Prompt (used in 1 specs)
115. [TC89832] Validate the accessibility of Radio button Style in AE Prompt (used in 1 specs)
116. [TC89833] Validate the accessibility of Shopping Cart Style in AE Prompt (used in 1 specs)
117. [TC91053] Validate the Axe scan of AE Prompt accessibility (used in 1 specs)
118. [TC91054] Validate the Axe scan of Value Prompt accessibility (used in 1 specs)
119. [TC92085] Validate the accessibility of prompt summary in AE Prompt (used in 1 specs)
120. [TC92110] Validate the accessibility of Check Box Style in AE Prompt (used in 1 specs)
121. [TC92864_01]AQ/HQ/MQ with Shopping Cart style - Check delete group condition in Library prompt (used in 1 specs)
122. [TC92864_02]AQ/HQ/MQ with Shopping Cart style - Check delete group condition in Library prompt (used in 1 specs)
123. [TC92867] Prompt Customization in Library Web - Customization in UI (used in 1 specs)
124. [TC92869_01] Prompt Customization in Library Web - Customization in actions in AQ prompt (used in 1 specs)
125. [TC92869_02] Prompt Customization in Library Web - Customization in actions in MQ prompt (used in 1 specs)
126. [TC96782] check OIDC Login and relogin with new OIDCConfigure.json (used in 1 specs)
127. [TC96783] check text and numeric system prompt with dossier (used in 1 specs)
128. [TC96784] Verify error handling of OIDC user claim mapping and user group (used in 1 specs)
129. [TC97681] switch user - no filter on age and gender (used in 1 specs)
130. [TC97682] check date system prompt with document (used in 1 specs)
131. [TC97683] check OIDC seamless login to BIWeb (used in 1 specs)
132. [TC97685] check date system prompt with document - not in group (used in 1 specs)
133. [TC97686] check system prompt with report filter (used in 1 specs)
134. [TC97687] check system prompt with report filter - change user (used in 1 specs)
135. [TC97691] Verify nested group with OIDC login (used in 1 specs)
136. [TC99103_1] check SAML Login and relogin with new MstrConfig.xml (used in 1 specs)
137. [TC99103_2] check SAML seamless login to BIWeb (used in 1 specs)
138. [TC99103_3] check SAML text and numeric system prompt with dossier (used in 1 specs)
139. [TC99103_4] check SAML date system prompt with document (used in 1 specs)
140. [TC99103_5] check SAML relay state (used in 1 specs)
141. Accessibility test of AE prompt (used in 1 specs)
142. AE Prompt - Checkbox (used in 1 specs)
143. AE Prompt - Customer Issue (used in 1 specs)
144. AE Prompt - List (used in 1 specs)
145. AE Prompt - Pulldown (used in 1 specs)
146. AE Prompt - Radio Button (used in 1 specs)
147. AE Prompt - Shopping Cart (used in 1 specs)
148. AQ Prompt - Customer Issue (used in 1 specs)
149. AQ Prompt - Pull Down (used in 1 specs)
150. AQ Prompt - Shopping Cart (used in 1 specs)
151. AQ Prompt - Text Box (used in 1 specs)
152. E2E Library of OIDC Azure (used in 1 specs)
153. E2E Library of OIDC Keycloak error handling case (used in 1 specs)
154. FFSQL Prompt - value (used in 1 specs)
155. HQ Prompt - Shopping Cart (used in 1 specs)
156. HQ Prompt - Tree (used in 1 specs)
157. Level Prompt (used in 1 specs)
158. MQ Prompt - List (used in 1 specs)
159. MQ Prompt - Pull Down (used in 1 specs)
160. MQ Prompt - Radio Button (used in 1 specs)
161. MQ Prompt - Shopping Cart (used in 1 specs)
162. MQ Prompt - Text Box (used in 1 specs)
163. Object Prompt - Filter (used in 1 specs)
164. Object Prompt - Report Builder (used in 1 specs)
165. Object Prompt - Standalone (used in 1 specs)
166. OIDC nested group (used in 1 specs)
167. Prompt - Accessibility (used in 1 specs)
168. Prompt Customization (used in 1 specs)
169. Prompt in Prompt - AE prompt in filter (used in 1 specs)
170. Prompt in Prompt - Prompted report in filter (used in 1 specs)
171. Prompt in Prompt - Value prompt in filter (used in 1 specs)
172. Prompt UI Issues (used in 1 specs)
173. Report with Object Prompt (used in 1 specs)
174. Report with Object Prompt - Diff View (used in 1 specs)
175. SAP_CharacteristicValueVariable (used in 1 specs)
176. SAP_DateVariable (used in 1 specs)
177. SAP_FormulaVariable (used in 1 specs)
178. SAP_HierarchyNodeVariable (used in 1 specs)
179. SAP_HierarchyNodeVariableXFun (used in 1 specs)
180. System Prompt (used in 1 specs)
181. System Prompts with SSO Login Tests (used in 1 specs)
182. Value Prompt - Big Decimal (used in 1 specs)
183. Value Prompt - Date&Time (used in 1 specs)
184. Value Prompt - Numeric (used in 1 specs)
185. Value Prompt - Text (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getPromptByName -- frequency: 254
2. {actual} -- frequency: 145
3. {expected} -- frequency: 145
4. getPromptEditor -- frequency: 139
5. getOneRowData -- frequency: 96
6. getRowsCount -- frequency: 61
7. getAvailableCartItemCount -- frequency: 51
8. getNthSelectedItemText -- frequency: 37
9. getRsdGridByKey -- frequency: 34
10. getWarningMsg -- frequency: 29
11. getSelectedCartItemCount -- frequency: 20
12. getSelectedItem -- frequency: 20
13. getItemCountText -- frequency: 19
14. getReportFooter -- frequency: 19
15. getUserName -- frequency: 15
16. getSelectedConditionItemCount -- frequency: 10
17. getLowerValueInputValue -- frequency: 8
18. mstrd Prompt Editor -- frequency: 8
19. getHourValue -- frequency: 7
20. getMinuteValue -- frequency: 7
21. getSecondValue -- frequency: 7
22. getAQConditionTextNoAttr -- frequency: 6
23. getCheckListContainer -- frequency: 6
24. getErrorMsg -- frequency: 6
25. getHeaderCount -- frequency: 6
26. getSummaryBarText -- frequency: 6
27. getYearValue -- frequency: 6
28. getDossierView -- frequency: 5
29. getMonthValue -- frequency: 5
30. getNewResolvedDateInDynamicCalendar -- frequency: 5
31. getAttibuteShoppingCart -- frequency: 3
32. getCheckListTableContainer -- frequency: 3
33. getListContainer -- frequency: 3
34. getPullDownContainer -- frequency: 3
35. getReportHeaderText -- frequency: 3
36. getValueSelectionListCount -- frequency: 3
37. getAccountName -- frequency: 2
38. getAddButton -- frequency: 2
39. getAllItemCount -- frequency: 2
40. getDocName -- frequency: 2
41. getDropDownMenu -- frequency: 2
42. getRunButton -- frequency: 2
43. getSelectedPrompt -- frequency: 2
44. getSummaryTitleBar -- frequency: 2
45. getAdjustmentDaysOptionsCountInDynamicCalendar -- frequency: 1
46. getAllPromptSummary -- frequency: 1
47. getComplexAnswer -- frequency: 1
48. getComplexAnswerValue -- frequency: 1
49. getNthExprText -- frequency: 1
50. getSearchBoxContainer -- frequency: 1
51. getSelectedListCount -- frequency: 1
52. getSwitchSummaryButton -- frequency: 1
53. getTitleText -- frequency: 1
54. getToggleViewSummary -- frequency: 1
55. getValueListEditor -- frequency: 1
56. getValuePart1Editor -- frequency: 1
57. getYesButton -- frequency: 1
58. Loading State -- frequency: 1
59. mstr Calendar.mstr As Popup -- frequency: 1
60. mstr List Block.mstr As Popup -- frequency: 1
61. mstr LQQButton -- frequency: 1
62. mstr Popup.mstr As Popup -- frequency: 1
63. showlist -- frequency: 1

## Key Actions

- `run()` -- used in 297 specs
- `toggleViewSummary()` -- used in 293 specs
- `getPromptByName()` -- used in 254 specs
- `waitForDossierLoading()` -- used in 244 specs
- `waitForSummaryItem()` -- used in 197 specs
- `reprompt()` -- used in 145 specs
- `firstElmOfHeader()` -- used in 140 specs
- `addSingle(promptElement, isInnerShoppingCart = false)` -- used in 139 specs
- `getPromptEditor()` -- used in 139 specs
- `waitForEditor()` -- used in 138 specs
- `openDossierNoWait()` -- used in 104 specs
- `getOneRowData()` -- used in 96 specs
- `clickElmInAvailableList(promptElement, elmName, isInnerShoppingCart = false)` -- used in 71 specs
- `searchFor(promptElement, text)` -- used in 69 specs
- `checkQualSummary()` -- used in 67 specs
- `log()` -- used in 66 specs
- `confirmValues(promptElement)` -- used in 64 specs
- `getRowsCount()` -- used in 61 specs
- `checkListSummary()` -- used in 60 specs
- `login()` -- used in 57 specs
- `getAvailableCartItemCount(promptElement, isInnerShoppingCart = false)` -- used in 51 specs
- `customCredentials()` -- used in 41 specs
- `goToLibrary()` -- used in 40 specs
- `clearAndInputText(promptElement, value)` -- used in 39 specs
- `enter()` -- used in 38 specs
- `getNthSelectedItemText(promptElement, index)` -- used in 37 specs
- `openValuePart1Editor(promptElement, index)` -- used in 36 specs
- `clearSearch(promptElement)` -- used in 35 specs
- `dismissError()` -- used in 35 specs
- `getRsdGridByKey()` -- used in 34 specs
- `clickCheckboxByName(promptElement, itemName)` -- used in 31 specs
- `openConditionDropdown(promptElement, index)` -- used in 31 specs
- `scrollDownConditionList(promptElement, offset)` -- used in 31 specs
- `selectCondition(promptElement, conditionText)` -- used in 30 specs
- `getWarningMsg(promptElement)` -- used in 29 specs
- `removeSingle(promptElement, isInnerShoppingCart = false)` -- used in 29 specs
- `inputValues(promptElement, value)` -- used in 24 specs
- `checkMultiQualSummary()` -- used in 22 specs
- `deleteSingle(promptElement, index, isBasedOnRoot = false)` -- used in 22 specs
- `openUserAccountMenu()` -- used in 22 specs
- `clearAndInputLowserValue(promptElement, value)` -- used in 21 specs
- `clickEleName(promptElement, eleName)` -- used in 21 specs
- `expandEle(promptElement, eleName)` -- used in 21 specs
- `isButtonEnabled(promptElement, button)` -- used in 21 specs
- `waitForPromptDetail()` -- used in 21 specs
- `addAll(promptElement, isInnerShoppingCart = false)` -- used in 20 specs
- `cancelEditor()` -- used in 20 specs
- `clearAndSearch(promptElement, text)` -- used in 20 specs
- `errorMsg()` -- used in 20 specs
- `getSelectedCartItemCount(promptElement, isInnerShoppingCart = false)` -- used in 20 specs
- `getSelectedItem(promptElement)` -- used in 20 specs
- `isErrorPresent()` -- used in 20 specs
- `openDropDownList(promptElement)` -- used in 20 specs
- `selectDropDownItem(promptElement, text)` -- used in 20 specs
- `clickElmInSelectedList(promptElement, elmName)` -- used in 19 specs
- `clickNthSelectedObj(promptElement, index, isBasedOnRoot = false)` -- used in 19 specs
- `clickTextfieldByTitle()` -- used in 19 specs
- `getItemCountText(promptElement)` -- used in 19 specs
- `getReportFooter()` -- used in 19 specs
- `getText()` -- used in 19 specs
- `openCalendar(promptElement)` -- used in 19 specs
- `waitForLibraryLoading()` -- used in 19 specs
- `selectDay(promptElement, day)` -- used in 18 specs
- `selectPromptByIndex()` -- used in 18 specs
- `isTableExist()` -- used in 17 specs
- `openAQCondotion(promptElement)` -- used in 17 specs
- `openDossier()` -- used in 17 specs
- `selectAQCondition(promptElement, form)` -- used in 17 specs
- `tabForward()` -- used in 17 specs
- `checkTextSummary()` -- used in 16 specs
- `isEditorOpen()` -- used in 16 specs
- `selectPullDownItem(promptElement, text)` -- used in 16 specs
- `closeUserAccountMenu()` -- used in 15 specs
- `getUserName()` -- used in 15 specs
- `clickNthSelectedItem(promptElement, index, isBasedOnRoot = false)` -- used in 14 specs
- `openValueListEditor(promptElement, index)` -- used in 14 specs
- `checkEmptySummary()` -- used in 12 specs
- `text(promptElement)` -- used in 12 specs
- `waitForReportLoading()` -- used in 12 specs
- `checkDynamicSummary()` -- used in 11 specs
- `isItemInSelectedListToEdit(promptElement, itemText, isBasedOnRoot = false)` -- used in 11 specs
- `navigateDownWithArrow()` -- used in 11 specs
- `oidcRelogin()` -- used in 11 specs
- `removeAll(promptElement, isInnerShoppingCart = false)` -- used in 11 specs
- `sleep()` -- used in 11 specs
- `waitForMessageBox()` -- used in 11 specs
- `clickTextBoxInput(promptElement)` -- used in 10 specs
- `closeTab()` -- used in 10 specs
- `getSelectedConditionItemCount(promptElement)` -- used in 10 specs
- `goBackFromDossierLink()` -- used in 10 specs
- `openBrowseValuesWindow(promptElement)` -- used in 10 specs
- `openMQConditionList(promptElement)` -- used in 10 specs
- `openMQFirstValue(promptElement, index)` -- used in 10 specs
- `openTypeDropdown(promptElement, index)` -- used in 10 specs
- `switchToTab()` -- used in 10 specs
- `clearAndInputValues(promptElement, value)` -- used in 9 specs
- `selectMQCondition(promptElement, conName)` -- used in 9 specs
- `selectYearAndMonth(promptElement, year, month)` -- used in 9 specs
- `toggleDynamicCalendar(promptElement)` -- used in 9 specs
- `getLowerValueInputValue()` -- used in 8 specs
- `inputLowerValue(promptElement, value)` -- used in 8 specs
- `isDynamicSelection(promptElement)` -- used in 8 specs
- `openFormDropdown(promptElement, index)` -- used in 8 specs
- `openMQLevelList(promptElement)` -- used in 8 specs
- `scrollTreeToBottom(promptElement)` -- used in 8 specs
- `selectForm(promptElement, formText)` -- used in 8 specs
- `selectType(promptElement, typeText)` -- used in 8 specs
- `tab()` -- used in 8 specs
- `checkTextPromptComplexAnswer(promptElement)` -- used in 7 specs
- `clickDoneButtonInDynamicCalendar(promptElement)` -- used in 7 specs
- `countCSSByLevel(promptElement, level)` -- used in 7 specs
- `f6()` -- used in 7 specs
- `getHourValue(promptElement)` -- used in 7 specs
- `getMinuteValue(promptElement)` -- used in 7 specs
- `getSecondValue(promptElement)` -- used in 7 specs
- `goToNextPage(promptElement, attrName)` -- used in 7 specs
- `isBrowseValueVisible(promptElement)` -- used in 7 specs
- `logout()` -- used in 7 specs
- `openMonthDropDownMenu(promptElement)` -- used in 7 specs
- `selectYourSelection(promptElement)` -- used in 7 specs
- `setIsSearch()` -- used in 7 specs
- `clearAndInputYear(promptElement, year)` -- used in 6 specs
- `clickMatchCase(promptElement)` -- used in 6 specs
- `getAQConditionTextNoAttr(promptElement)` -- used in 6 specs
- `getCheckListContainer()` -- used in 6 specs
- `getErrorMsg()` -- used in 6 specs
- `getHeaderCount()` -- used in 6 specs
- `getSummaryBarText()` -- used in 6 specs
- `getYearValue(promptElement)` -- used in 6 specs
- `openLowerInputCalendar(promptElement)` -- used in 6 specs
- `selectMonth(promptElement, month)` -- used in 6 specs
- `clearAndInputHour(promptElement, hour)` -- used in 5 specs
- `clearInputLowerValue(promptElement)` -- used in 5 specs
- `clickElmLinkInAvailableList(promptElement, elmName)` -- used in 5 specs
- `getDossierView()` -- used in 5 specs
- `getMonthValue(promptElement)` -- used in 5 specs
- `getNewResolvedDateInDynamicCalendar(promptElement)` -- used in 5 specs
- `goToLastPage(promptElement)` -- used in 5 specs
- `goToPreviousPage(promptElement)` -- used in 5 specs
- `isFirstSelected(promptElement)` -- used in 5 specs
- `isLastSelected(promptElement)` -- used in 5 specs
- `openNthExprMenu(promptElement, index)` -- used in 5 specs
- `samlRelogin()` -- used in 5 specs
- `setOffsetInDynamicCalendar(promptElement, {period, offsetOperator, directions, times})` -- used in 5 specs
- `cancelValues(promptElement)` -- used in 4 specs
- `checkExcludeWeekendsInDynamicCalendar(promptElement)` -- used in 4 specs
- `checkQualSummaryOfDefault()` -- used in 4 specs
- `chooseNthExpr(promptElement, index)` -- used in 4 specs
- `collapseEle(promptElement, eleName)` -- used in 4 specs
- `goToFirstPage(promptElement)` -- used in 4 specs
- `isFirstItemSelected(promptElement)` -- used in 4 specs
- `isGridPresnt()` -- used in 4 specs
- `isItemSelected(promptElement, itemName)` -- used in 4 specs
- `navigateLink()` -- used in 4 specs
- `openAttrFormList(promptElement)` -- used in 4 specs
- `openChooseAttributesWindow(promptElement)` -- used in 4 specs
- `waitForShoppingCart(promptElement)` -- used in 4 specs
- `checkAdjustmentInDynamicCalendar(promptElement)` -- used in 3 specs
- `clearValues(promptElement)` -- used in 3 specs
- `clickMinute(promptElement)` -- used in 3 specs
- `confirmReset()` -- used in 3 specs
- `getAttibuteShoppingCart()` -- used in 3 specs
- `getCheckListTableContainer()` -- used in 3 specs
- `getListContainer()` -- used in 3 specs
- `getPullDownContainer()` -- used in 3 specs
- `getReportHeaderText()` -- used in 3 specs
- `getValueSelectionListCount(promptElement)` -- used in 3 specs
- `isDynamicIconVisibleInLowerInput(promptElement)` -- used in 3 specs
- `isMessagePresent(promptElement)` -- used in 3 specs
- `openDocumentNoWait()` -- used in 3 specs
- `searchInEle(promptElement, eleName, text)` -- used in 3 specs
- `selectAdjustmentPeriodInDynamicCalendar(promptElement, period)` -- used in 3 specs
- `selectAdjustmentSubtypeInDynamicCalendar(promptElement, subtype)` -- used in 3 specs
- `selectAttrForm(promptElement, form)` -- used in 3 specs
- `selectRadioButtonByName(promptElement, itemName)` -- used in 3 specs
- `selectReset()` -- used in 3 specs
- `tabBackward()` -- used in 3 specs
- `arrowDown()` -- used in 2 specs
- `chooseAllSelections(promptElement)` -- used in 2 specs
- `clearAndInputMinute(promptElement, minute)` -- used in 2 specs
- `clearAndInputSecond(promptElement, second)` -- used in 2 specs
- `clearSearchInEle(promptElement, eleName)` -- used in 2 specs
- `clickEditButton()` -- used in 2 specs
- `clickHour(promptElement)` -- used in 2 specs
- `clickSecond(promptElement)` -- used in 2 specs
- `close()` -- used in 2 specs
- `editAttrSelection(promptElement)` -- used in 2 specs
- `getAccountName()` -- used in 2 specs
- `getAddButton()` -- used in 2 specs
- `getAllItemCount(promptElement)` -- used in 2 specs
- `getDocName()` -- used in 2 specs
- `getDropDownMenu()` -- used in 2 specs
- `getRunButton()` -- used in 2 specs
- `getSelectedPrompt()` -- used in 2 specs
- `getSummaryTitleBar()` -- used in 2 specs
- `inputAdjustmentDaysInDynamicCalendar(promptElement, days)` -- used in 2 specs
- `isCalendarOpen(promptElement)` -- used in 2 specs
- `isCollapseIconPresent(promptElement, attrName)` -- used in 2 specs
- `isDynamicToggleOn(promptElement)` -- used in 2 specs
- `isEditIconPresent()` -- used in 2 specs
- `isOnlyAllInList(promptElement)` -- used in 2 specs
- `moveDown(promptElement)` -- used in 2 specs
- `openCustomAppById()` -- used in 2 specs
- `openDossierInfoWindow()` -- used in 2 specs
- `openErrorDetails(promptElement)` -- used in 2 specs
- `openReportNoWait()` -- used in 2 specs
- `openValuePart1Calendar(promptElement)` -- used in 2 specs
- `selectMQLevel(promptElement, levelName)` -- used in 2 specs
- `togglePullDownList(promptElement)` -- used in 2 specs
- `waitForBlankReportLoading()` -- used in 2 specs
- `waitForItemLoading()` -- used in 2 specs
- `waitForRsdLoad()` -- used in 2 specs
- `clearAndInputUpperValue(promptElement, value)` -- used in 1 specs
- `clearByKeyboard(promptElement)` -- used in 1 specs
- `clearUppperValue(promptElement)` -- used in 1 specs
- `clickElmInSelectedListToEdit(promptElement, itemText)` -- used in 1 specs
- `clickFetchNext(promptElement)` -- used in 1 specs
- `clickInputValueInput(promptElement)` -- used in 1 specs
- `clickItemCountText(promptElement)` -- used in 1 specs
- `clickNextButton()` -- used in 1 specs
- `clickNthSelectedItemWithOffset(promptElement, index, isBasedOnRoot = false)` -- used in 1 specs
- `clickOKinCustomization(Customization, promptElement)` -- used in 1 specs
- `clickSkipButton()` -- used in 1 specs
- `clickUpperValue(promptElement)` -- used in 1 specs
- `clickValueInput(promptElement)` -- used in 1 specs
- `closeCalendar(promptElement)` -- used in 1 specs
- `closeEditor()` -- used in 1 specs
- `closeMQConditionList(promptElement)` -- used in 1 specs
- `closeMQLevelList(promptElement)` -- used in 1 specs
- `continueAzureLogin()` -- used in 1 specs
- `ctrlEnd()` -- used in 1 specs
- `ctrlHome()` -- used in 1 specs
- `currentDropdownSelection(promptElement)` -- used in 1 specs
- `dismissErrorByText()` -- used in 1 specs
- `end()` -- used in 1 specs
- `esc()` -- used in 1 specs
- `getAdjustmentDaysOptionsCountInDynamicCalendar(promptElement)` -- used in 1 specs
- `getAllPromptSummary()` -- used in 1 specs
- `getComplexAnswer()` -- used in 1 specs
- `getComplexAnswerValue()` -- used in 1 specs
- `getNthExprText(promptElement, index)` -- used in 1 specs
- `getSearchBoxContainer()` -- used in 1 specs
- `getSelectedListCount(promptElement)` -- used in 1 specs
- `getSwitchSummaryButton()` -- used in 1 specs
- `getTitleText()` -- used in 1 specs
- `getToggleViewSummary()` -- used in 1 specs
- `getValueListEditor()` -- used in 1 specs
- `getValuePart1Editor()` -- used in 1 specs
- `getYesButton()` -- used in 1 specs
- `groupItems(promptElement)` -- used in 1 specs
- `home()` -- used in 1 specs
- `inputUpperValue(promptElement, value)` -- used in 1 specs
- `isDisplayed()` -- used in 1 specs
- `isDynamicIconVisibleInUpperInput(promptElement)` -- used in 1 specs
- `isDynamicToggleShow(promptElement)` -- used in 1 specs
- `isExpandIconPresent(promptElement, attrName)` -- used in 1 specs
- `isItemInAvailableList(promptElement, itemText)` -- used in 1 specs
- `isItemInList(promptElement, text)` -- used in 1 specs
- `isItemInSelectedList(promptElement, itemText)` -- used in 1 specs
- `isItemViewable()` -- used in 1 specs
- `loginToAzure()` -- used in 1 specs
- `loginWithPassword()` -- used in 1 specs
- `navigateUpWithArrow()` -- used in 1 specs
- `openLevelDropdown(promptElement, index)` -- used in 1 specs
- `openMQSecondValue(promptElement, index)` -- used in 1 specs
- `openSortMenu()` -- used in 1 specs
- `openUpperInputCalendar(promptElement)` -- used in 1 specs
- `openValuePart2Calendar(promptElement)` -- used in 1 specs
- `openValuePart2Editor(promptElement, index)` -- used in 1 specs
- `selectDayOfWeekForAdjustmentInDynamicCalendar(promptElement, dayOfWeeks)` -- used in 1 specs
- `selectLevel(promptElement, levelName)` -- used in 1 specs
- `selectMonthAndDayInAdjustmentDateInputInDynamicCalendar(promptElement, month, day)` -- used in 1 specs
- `selectSortOption()` -- used in 1 specs
- `selectToday(promptElement)` -- used in 1 specs
- `selectYourSelectionIcon(promptElement)` -- used in 1 specs
- `shiftEnter()` -- used in 1 specs
- `switchToLastMonth(promptElement)` -- used in 1 specs
- `switchToLastYear(promptElement)` -- used in 1 specs
- `switchToNextMonth(promptElement)` -- used in 1 specs
- `switchToNextYear(promptElement)` -- used in 1 specs
- `toggleAndcheckQualSummary()` -- used in 1 specs
- `ungroupItems(promptElement)` -- used in 1 specs
- `viewErrorDetails()` -- used in 1 specs
- `addNewCondition(promptElement)` -- used in 0 specs
- `addPersonalAnswer(promptElement, answerName)` -- used in 0 specs
- `addRight(promptElement)` -- used in 0 specs
- `addSingleForWeb(promptElement, elementName)` -- used in 0 specs
- `backToTop(promptElement)` -- used in 0 specs
- `cancelFileEditor(promptElement)` -- used in 0 specs
- `checkAdjustmentInDynamicCalendar()` -- used in 0 specs
- `checkExcludeWeekendsInDynamicCalendar()` -- used in 0 specs
- `chooseAnySelection(promptElement)` -- used in 0 specs
- `clearAndInputYear(year)` -- used in 0 specs
- `clearValue(promptElement, value)` -- used in 0 specs
- `clickButton(promptElement, content)` -- used in 0 specs
- `clickConditionItem(promptElement, text)` -- used in 0 specs
- `clickdeleteConditionIcon(promptElement)` -- used in 0 specs
- `clickDoneButtonInDynamicCalendar()` -- used in 0 specs
- `clickFetchFirst(promptElement)` -- used in 0 specs
- `clickFetchLast(promptElement)` -- used in 0 specs
- `clickFetchPrevious(promptElement)` -- used in 0 specs
- `clickOKCancel(promptElement, content)` -- used in 0 specs
- `clickRememberThisAnswer(promptElement)` -- used in 0 specs
- `closeDropDownList(promptElement)` -- used in 0 specs
- `confirmBrowserValues(promptElement)` -- used in 0 specs
- `confirmFileEditor(promptElement)` -- used in 0 specs
- `currentIndex(promptName)` -- used in 0 specs
- `deleteCondition(promptElement, index, isBasedOnRoot = false)` -- used in 0 specs
- `deletePersonalAnswer(promptElement, name)` -- used in 0 specs
- `getAdjustmentDaysOptionsCountInDynamicCalendar()` -- used in 0 specs
- `getCartItemCount(cart)` -- used in 0 specs
- `getDefaultAnswerText(promptElement)` -- used in 0 specs
- `getItemInAvailableListCount(promptElement, elmName)` -- used in 0 specs
- `getItemInSelectedCount(promptElement, elmName)` -- used in 0 specs
- `getMonthValue()` -- used in 0 specs
- `getMonthYearValueInCalendar()` -- used in 0 specs
- `getMonthYearValueInCalendar(promptElement)` -- used in 0 specs
- `getMQValuePartText(promptElement, index)` -- used in 0 specs
- `getNewResolvedDateInDynamicCalendar()` -- used in 0 specs
- `getSelectedItemName(promptElement)` -- used in 0 specs
- `getSelectedObjectListText(promptElement)` -- used in 0 specs
- `getYearValue()` -- used in 0 specs
- `goToNextPage(promptElement)` -- used in 0 specs
- `importFile(promptElement)` -- used in 0 specs
- `inputAdjustmentDaysInDynamicCalendar(days)` -- used in 0 specs
- `inputText(promptElement, value)` -- used in 0 specs
- `inputTextinImportFile(promptElement, value)` -- used in 0 specs
- `isCalendarOpen()` -- used in 0 specs
- `isDynamicToggleOn()` -- used in 0 specs
- `isDynamicToggleShow()` -- used in 0 specs
- `isImportFileEditorDisplay(promptElement)` -- used in 0 specs
- `isImportFileVisible(promptElement)` -- used in 0 specs
- `isInvalidAnswer(promptElement)` -- used in 0 specs
- `isLastItemSelected(promptElement)` -- used in 0 specs
- `isLowerValueInputVisible(promptElement)` -- used in 0 specs
- `isPersonalAnswerPresent(promptElement)` -- used in 0 specs
- `isUpperValueInputVisible(promptElement)` -- used in 0 specs
- `isValuePart1ListEditorDisplay(promptElement)` -- used in 0 specs
- `loadPersonalAnswer(promptElement, name)` -- used in 0 specs
- `moveUp(promptElement)` -- used in 0 specs
- `multiSelectListItem(promptElement, items)` -- used in 0 specs
- `openAdjustmentDateInputInDynamicCalendar()` -- used in 0 specs
- `openAdjustmentDateInputInDynamicCalendar(promptElement)` -- used in 0 specs
- `openAdjustmentMonthDayInputInDynamicCalendar()` -- used in 0 specs
- `openAdjustmentMonthDayInputInDynamicCalendar(promptElement)` -- used in 0 specs
- `openAQSelectCondotion(promptElement)` -- used in 0 specs
- `openEditValueWindow(promptElement, index)` -- used in 0 specs
- `openImportbyIcon(promptElement)` -- used in 0 specs
- `openImportFileWindow(promptElement)` -- used in 0 specs
- `openMonthDropDownMenu()` -- used in 0 specs
- `openPersonalAnswers(promptElement)` -- used in 0 specs
- `openSavedAnswersPopup(promptElement)` -- used in 0 specs
- `personalAnswerCount(promptElement)` -- used in 0 specs
- `renamePersonalAnswer(promptElement, oldName, newName)` -- used in 0 specs
- `scrollAvailableList(promptElement, offset)` -- used in 0 specs
- `scrollDownList(promptElement)` -- used in 0 specs
- `selectAdjustDateInDynamicCalendar(dateName)` -- used in 0 specs
- `selectAdjustDateInDynamicCalendar(promptElement, dateName)` -- used in 0 specs
- `selectAdjustmentPeriodInDynamicCalendar(period)` -- used in 0 specs
- `selectAdjustmentSubtypeInDynamicCalendar(subtype)` -- used in 0 specs
- `selectAQSelectCondition(promptElement, form)` -- used in 0 specs
- `selectAQType(promptElement, type)` -- used in 0 specs
- `selectDay(day)` -- used in 0 specs
- `selectDayOfWeekForAdjustmentInDynamicCalendar(dayOfWeeks)` -- used in 0 specs
- `selectDefaultSelection(promptElement)` -- used in 0 specs
- `selectedItemCount(promptElement)` -- used in 0 specs
- `selectHour(hour)` -- used in 0 specs
- `selectListItem(promptElement, text)` -- used in 0 specs
- `selectMinute(minute)` -- used in 0 specs
- `selectMonth(month)` -- used in 0 specs
- `selectMonthAndDayInAdjustmentDateInputInDynamicCalendar(month, day)` -- used in 0 specs
- `selectSecond(second)` -- used in 0 specs
- `selectToday()` -- used in 0 specs
- `selectYearAndMonth(year, month)` -- used in 0 specs
- `setOffsetByInputValueInDynamicCalendar({period, offsetOperator, value})` -- used in 0 specs
- `setOffsetInDynamicCalendar({period, offsetOperator, directions, times})` -- used in 0 specs
- `switchEnterValues(promptElement)` -- used in 0 specs
- `switchToLastMonth()` -- used in 0 specs
- `switchToLastYear()` -- used in 0 specs
- `switchToNextMonth()` -- used in 0 specs
- `switchToNextYear()` -- used in 0 specs
- `toggleDynamicCalendar()` -- used in 0 specs
- `uncheckAdjustmentInDynamicCalendar()` -- used in 0 specs
- `uncheckAdjustmentInDynamicCalendar(promptElement)` -- used in 0 specs
- `uncheckExcludeWeekendsInDynamicCalendar()` -- used in 0 specs
- `uncheckExcludeWeekendsInDynamicCalendar(promptElement)` -- used in 0 specs
- `upOneLevel(promptElement)` -- used in 0 specs
- `visibleSelectedItemCount(promptElement)` -- used in 0 specs
- `waitForMessage(promptElement)` -- used in 0 specs

## Source Coverage

- `pageObjects/prompt/**/*.js`
- `specs/regression/prompt/**/*.{ts,js}`
- `specs/regression/authentication/oidcSystemPrompt/**/*.{ts,js}`
- `specs/regression/authentication/samlSystemPrompt/**/*.{ts,js}`
- `specs/regression/systemprompts/**/*.{ts,js}`
