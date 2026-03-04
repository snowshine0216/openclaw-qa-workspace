# Site Knowledge: Selector Domain

## Overview

- **Domain key:** `selector`
- **Components covered:** ButtonBar, Calendar, CheckBox, Dropdown, InCanvasSelector, LinkBar, ListBox, MetricQualification, MetricSlider, RadioButton, SearchBox, SelectorObject, SelectorPanel, Slider
- **Spec files scanned:** 27
- **POM files scanned:** 14

## Components

### ButtonBar
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `getSelectedItemText()`
  - `getSeletedItemsCount()`
  - `isItemExisted(item)`
  - `isItemSelected(index, text)`
  - `isItemTextSelected(text)`
  - `multiSelectNth(items)`
  - `selectItemByText(text)`
  - `selectNthItem(index, text)`
- **Related components:** dossierPage

### Calendar
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickDynamicCalendarButton(btnName)`
  - `clickDynamicDateCheckBox()`
  - `clickDynamicDayStepperNext(times)`
  - `clickDynamicDayStepperPrev(times)`
  - `clickDynamicMonthStepperNext(times)`
  - `clickDynamicMonthStepperPrev()`
  - `clickOkButton()`
  - `getFromDate()`
  - `getInputDate()`
  - `getToDate()`
  - `inputDate(dimension, date)`
  - `isDynamicDateChecked()`
  - `openDateTimePicker()`
  - `openDynamicDayDropdown()`
  - `openDynamicMonthDropdown()`
  - `openFromCalendar()`
  - `openToCalendar()`
  - `selectDate(year, month, day)`
  - `selectDateWithOKBtn(year, month, day)`
  - `selectDay(day)`
  - `selectDayTime(year, month, day, hour, minute, second, meridiem = 'AM')`
  - `selectDynamicCalendarDropdownItem(index, text)`
  - `selectDynamicDayDropdownItem(index, text)`
  - `selectDynamicMonthDropdownItem(index, text)`
  - `selectHour(hour, meridiem)`
  - `selectMinute(minute)`
  - `selectMonth(month)`
  - `selectSecond(second)`
  - `selectYear(year)`
- **Related components:** dossierPage, getCalendarWidget

### CheckBox
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `branchSelectItemByTexts(texts)`
  - `clearSearch()`
  - `clickClearAll()`
  - `clickItemByText(text)`
  - `clickItems(texts)`
  - `clickSelectAll()`
  - `collapseItemByText(text)`
  - `collapseItemsByText(texts)`
  - `dismissLevelDropdown()`
  - `expandItemByText(text)`
  - `expandItemsByText(texts)`
  - `getAllItemsInSearchResults()`
  - `getItemMode(text)`
  - `getItemSelectedStatus(text)`
  - `getSelectedItemsCount()`
  - `getSelectedItemsInSearchResults()`
  - `getSelectedItemsText()`
  - `isItemExisted(item)`
  - `isItemExpanded(text)`
  - `isItemLeafNode(text)`
  - `isItemsChecked(texts)`
  - `levelSelectItemByText(text, level)`
  - `search(searchKey)`
  - `selectItemByText(text)`
  - `selectLevel(levelText)`
  - `selectLevelInSearchBar(levelText)`
  - `selectSearchResults(results)`
  - `singleSelectItemByText(text)`
- **Related components:** _none_

### Dropdown
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickCancelBtn()`
  - `clickDropdown()`
  - `clickOKBtn(checkDocumentLoaded = true)`
  - `closeDropdown()`
  - `dropdownItemsCount()`
  - `getShownSelectedText()`
  - `isDropdownListPresent()`
  - `isItemExisted(item)`
  - `isItemSelected(item)`
  - `lastItemText()`
  - `openDropdown()`
  - `openDropdownAndMultiSelect(texts)`
  - `openDropdownNoWait()`
  - `scrollAndSelectDropDown(rootElement, option)`
  - `scrollDropdown(toPosition)`
  - `selectItemByText(text, checkDocumentLoaded = true)`
  - `selectMultiItemByText(texts)`
  - `selectNthItem(index, text)`
- **Related components:** dossierPage

### InCanvasSelector
- **CSS root:** `.mstrmojo-ListBase.mstrmojo-ui-Menu`
- **User-visible elements:**
  - Context Menu (`.mstrmojo-ListBase.mstrmojo-ui-Menu`)
  - Slide Tooltip (`.mstrmojo-Tooltip`)
- **Component actions:**
  - `chooseDropdownItems(items)`
  - `clearSearch()`
  - `clickApplyButtonInPauseMode()`
  - `clickDropdownBtn(text)`
  - `clickEditButtonInPauseMode()`
  - `closeDropdownMenu()`
  - `dateAndTimeText()`
  - `deleteSearchboxItems(items)`
  - `dismissPreloadElementList()`
  - `dismissSuggestionList()`
  - `dragSlider(toOffset, position = 'end')`
  - `getAriaLabel()`
  - `getDropdownItemsCount()`
  - `getDropdownSelectedText()`
  - `getICSTargetTooltipText(isValueParameter = false)`
  - `getICSTitleTooltipText()`
  - `getItem(elemName)`
  - `getItemDeleteCapsure(elemName)`
  - `getItemsNumber()`
  - `getItemsText()`
  - `getItemWithExactName(elemName)`
  - `getMandatoryWarningMessageText()`
  - `getSearchBoxMandatoryWarningMessageText()`
  - `getSearchSuggestItemIndex(item)`
  - `getSearchSuggestItemsCount()`
  - `getSearchSuggestItemsText()`
  - `getSelectedDrodownItem()`
  - `getSelectedItemsCount()`
  - `getSelectedItemsInLevelDropdown()`
  - `getSelectedItemsText(isSearchBox = false)`
  - `getSelectedSearchSuggestItemsIndex()`
  - `getSelectedSearchSuggestItemsText()`
  - `getSliderSelectedText()`
  - `getSliderText()`
  - `getSliderTooltipText(position = 'end')`
  - `inputText(text)`
  - `isICSTargetTooltipDisplayed()`
  - `isICSTitleTooltipDisplayed()`
  - `isItemSelected(item)`
  - `isLinkItemSelected(item)`
  - `isMandatoryWarningDisplayed()`
  - `isOptionInMenu(option)`
  - `isSearchBoxMandatoryWarningDisplayed()`
  - `multiSelect(items)`
  - `openAndSelectContextMenu(option)`
  - `openContextMenu()`
  - `openDropdownAndSelect(items)`
  - `openDropdownMenu()`
  - `search(text)`
  - `searchInDropdown(text)`
  - `searchSearchbox(text, isPreloaded = false)`
  - `selectDropdownItems(items)`
  - `selectedSearchItemCount()`
  - `selectItem(itemName)`
  - `selectItemByKey(key, itemName)`
  - `selectItems(itemNames)`
  - `selectItemWithExactName(itemName)`
  - `selectOptionInMenu(option)`
  - `selectSearchBoxItem(item, isPreloaded = false)`
  - `selectSearchBoxItems(items, isDismissPreload = true)`
  - `selectSearchBoxItemsForPreload({ items, isPreloaded = false, isSingleSelection = true })`
  - `textBoxInputText()`
- **Related components:** getDropdownWidget, getSearchContainer

### LinkBar
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `getSelectedItemText()`
  - `getSeletedItemsCount()`
  - `isItemExisted(item)`
  - `isItemSelected(index, text)`
  - `isItemSelectedByText(text)`
  - `multiSelectNth(items)`
  - `selectItemByText(text, checkDocumentLoaded = true)`
  - `selectNthItem(index, text)`
- **Related components:** dossierPage

### ListBox
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `getSelectedItemText()`
  - `getSeletedItemsCount()`
  - `isItemExisted(item)`
  - `isItemSelected(index, text)`
  - `isItemTextSelected(text)`
  - `multiSelect(items)`
  - `selectItemByText(text, checkDocumentLoaded = true)`
  - `selectNthItem(index, text)`
- **Related components:** _none_

### MetricQualification
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `apply()`
  - `getInputValue()`
  - `getMQExpression()`
  - `getSelectedPatternText()`
  - `inputValue(value, index = 1)`
  - `inputValueDirectly(value, index = 1)`
  - `inputValueWithoutApply(value, index = 1)`
  - `openDropdownOperation()`
  - `openPatternDropdown()`
  - `selectDropdownOperation(name, iswait = true)`
  - `selectNthItem(index, text)`
- **Related components:** dossierPage

### MetricSlider
- **CSS root:** `.mstrmojo-PopupList`
- **User-visible elements:**
  - Qualification Dropdown (`.mstrmojo-PopupList`)
- **Component actions:**
  - `getSliderLabel()`
  - `getSliderSummary()`
  - `openQualificationDropdown()`
  - `selectQualificationOperation(name, iswait = true)`
- **Related components:** _none_

### RadioButton
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `getSelectedItemText()`
  - `getSeletedItemsCount()`
  - `isEmptySelector()`
  - `isItemExisted(item)`
  - `isItemSelected(index, text)`
  - `isItemSelectedByText(text)`
  - `selectItemByText(text, checkDocumentLoaded = true)`
  - `selectNthItem(index, text)`
- **Related components:** dossierPage

### SearchBox
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clearAllSelections()`
  - `clearAndInputAndWaitForFirstSuggestion(text)`
  - `clickOnInputBox()`
  - `deleteItemByText(itemText)`
  - `dismissPreloadElementList()`
  - `dismissSuggestionList()`
  - `getSearchBoxInputValue()`
  - `getSearchSuggestItemIndex(itemText)`
  - `getSelectedItemsText()`
  - `getSuggestionListText()`
  - `getSuggestListItemsText()`
  - `input(text)`
  - `inputAndNoWait(text)`
  - `inputAndWaitForFirstSuggestion(text)`
  - `isSearchboxEmpty()`
  - `isSearchEnabled()`
  - `isSearchResultPresent()`
  - `moveToSuggetionItem(index)`
  - `selectItemByText(text)`
  - `selectItemsByText(texts)`
  - `selectItemsByTextForPreload({ texts, isPreload = false, isSingleSelection = true})`
  - `selectNthItem(index, text)`
- **Related components:** dossierPage

### SelectorObject
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - _none_
- **Related components:** _none_

### SelectorPanel
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `applySelection()`
  - `cancelSelection()`
  - `getApplyButtonTooltip()`
  - `getCancelButtonTooltip()`
  - `isApplyButtonDisabled()`
- **Related components:** _none_

### Slider
- **CSS root:** `.mstrmojo-Popup.edvl`
- **User-visible elements:**
  - Input Popup (`.mstrmojo-Popup.edvl`)
  - Tooltip (`.mstrmojo-Tooltip`)
- **Component actions:**
  - `clickSliderBar(offset)`
  - `dragSlider(toOffset, sliderByClass = 'middle', wait = true)`
  - `dragSliderForInsertData(toOffset)`
  - `getEndTooltipText()`
  - `getSingleTooltipText()`
  - `getSliderWidth()`
  - `getStartTooltipText()`
  - `getTooltipText(buttonLocator)`
  - `inputToEndPoint(text)`
  - `inputToPoint(text)`
  - `inputToStartPoint(text)`
  - `inputValue(buttonLocator, text)`
- **Related components:** dossierPage

## Common Workflows (from spec.ts)

1. [TC25967] Verify In-canvas Selector in different styles and status in Library Web (used in 1 specs)
2. [TC68670_01] Verify attribute selector in selector panel with different styles (used in 1 specs)
3. [TC68670_02] Verify value selector in selector panel with different styles (used in 1 specs)
4. [TC68670_03] x-func for selector panel (used in 1 specs)
5. [TC68670_04] GDDE selector panel (A->B) (used in 1 specs)
6. [TC68670_05] GDDE selector panel (A->B->C) (used in 1 specs)
7. [TC68670_06] GDDE selector panel (A->B->C + A->C) (used in 1 specs)
8. [TC68670_07] GDDE selector panel (A->C + B->C) (used in 1 specs)
9. [TC68670_08] GDDE selector panel (A->B + A->C) (used in 1 specs)
10. [TC68670_09] GDDE selector panel (A<->B) (used in 1 specs)
11. [TC72038_01] Verify in-canvas selector with new format in Library - Linkbar (used in 1 specs)
12. [TC72038_02] Verify in-canvas selector with new format in Library - Slider (used in 1 specs)
13. [TC72038_03] Verify in-canvas selector with new format in Library - Checkbox (used in 1 specs)
14. [TC72038_04] Verify in-canvas selector with new format in Library - Searchbox (used in 1 specs)
15. [TC72038_05] Verify in-canvas selector with new format in Library - Radiobutton (used in 1 specs)
16. [TC72038_06] Verify in-canvas selector with new format in Library - Drop-down (used in 1 specs)
17. [TC72038_07] Verify in-canvas selector with new format in Library - Metric Qualification and Metric Slider (used in 1 specs)
18. [TC72038_08] Verify in-canvas selector with new format in Library - Metric Slider (used in 1 specs)
19. [TC72038] Verify in-canvas selector with dynamic selection in Library (used in 1 specs)
20. [TC72039] Verify context menu for in-canvas selector in Library (used in 1 specs)
21. [TC79941] Library | X-Func: Validate selection works fine wen switch page back on library (used in 1 specs)
22. [TC80312] Library | Button bar selector - Property (used in 1 specs)
23. [TC80320] Library | Button bar selector - Foramt (used in 1 specs)
24. [TC80321] Library | Button bar selector - Source and Target (used in 1 specs)
25. [TC80322] Library | Button bar selector - Manipulation (used in 1 specs)
26. [TC80323] Library | Validate Calendar selector - Property (used in 1 specs)
27. [TC80324] Library | Calendar selector - Foramt (used in 1 specs)
28. [TC80325] Library | Calendar selector - Source and Target (used in 1 specs)
29. [TC80326] Library | Calendar selector - Manipulation (used in 1 specs)
30. [TC80327] Library | Validate Checkbox selector - Property (used in 1 specs)
31. [TC80328] Library | Checkbox selector - Foramt (used in 1 specs)
32. [TC80329] Library | Checkbox selector - Source and Target (used in 1 specs)
33. [TC80330] Library | Checkbox selector - Manipulation (used in 1 specs)
34. [TC80331] Library | Checkbox selector - Check and unchecking all selections (used in 1 specs)
35. [TC80332] Library | Checkbox selector - Property fit to content with show title enabled (used in 1 specs)
36. [TC80333] Library | Dropdown selector - Property (used in 1 specs)
37. [TC80334] Library | Dropdown selector - Foramt (used in 1 specs)
38. [TC80335] Library | Dropdown selector - Source and Target (used in 1 specs)
39. [TC80336] Library | Dropdown selector - Manipulation (used in 1 specs)
40. [TC80337] Library | Dropdown selector - Select elements using the numeric keyboard (used in 1 specs)
41. [TC80338] Library | Dropdown selector - Scroll inside and outside of dropdown selector (used in 1 specs)
42. [TC80339] Library | Dropdown selector - Multi-Select manipulation on select and cancel (used in 1 specs)
43. [TC80341] Library | Dropdown selector - Multi-Select combine with different selector properties (used in 1 specs)
44. [TC80342] Library | Dropdown selector - Multi-Select on derived attribute,consolidation and custom group (used in 1 specs)
45. [TC80343] Library | Dropdown selector - Multi-Select when select metric (used in 1 specs)
46. [TC80344] Library | Dropdown selector - Multi-Select when target to dataset (used in 1 specs)
47. [TC80345] Library | Dropdown selector - Multi-Select when target to selector (used in 1 specs)
48. [TC80346] Library | Dropdown selector - Multi-Select error handling when no source or target (used in 1 specs)
49. [TC80347] Library | Dropdown selector - Multi-Select Xfunc with filter panel (used in 1 specs)
50. [TC80348] Library | Dropdown selector - Multi-Select Xfunc with panel stak (used in 1 specs)
51. [TC80349] Library | Dropdown selector - Multi-Select Xfunc with info-window (used in 1 specs)
52. [TC80350] Library | Dropdown selector - Multi-Select Xfunc with link drill (used in 1 specs)
53. [TC80351] Library | Link Bar selector - Property (used in 1 specs)
54. [TC80352] Library | Link Bar selector - Format (used in 1 specs)
55. [TC80353] Library | Link Bar selector - Source and Target (used in 1 specs)
56. [TC80354] Library | Link Bar selector - Manipulation (used in 1 specs)
57. [TC80355] Library | List Box selector - Property (used in 1 specs)
58. [TC80356] Library | List Box selector - Foramt (used in 1 specs)
59. [TC80357] Library | List Box selector - Source and Target (used in 1 specs)
60. [TC80358] Library | List Box selector - Manipulation (used in 1 specs)
61. [TC80359] Library | Metric Qualification selector - Property (used in 1 specs)
62. [TC80360] Library | Metric Qualification selector - Foramt (used in 1 specs)
63. [TC80361] Library | Metric Qualification selector - Source and Target (used in 1 specs)
64. [TC80362] Library | Metric Qualification selector - Manipulation (used in 1 specs)
65. [TC80363] Library | Metric slider selector - Property (used in 1 specs)
66. [TC80364] Library | Metric slider selector - Foramt (used in 1 specs)
67. [TC80365] Library | Metric slider selector - Source and Target (used in 1 specs)
68. [TC80366] Library | Metric slider selector - Manipulation (used in 1 specs)
69. [TC80367] Library | Metric slider selector - Tooltip of large percentage (used in 1 specs)
70. [TC80369] Library | Radio button selector - Property (used in 1 specs)
71. [TC80370] Library | Radio button selector - Foramt (used in 1 specs)
72. [TC80371] Library | Radio button selector - Source and Target (used in 1 specs)
73. [TC80372] Library | Radio button selector - Manipulation (used in 1 specs)
74. [TC80373] Library | Searchbox selector - Property (used in 1 specs)
75. [TC80374] Library | Searchbox selector - Foramt (used in 1 specs)
76. [TC80375] Library | Searchbox selector - Source and Target (used in 1 specs)
77. [TC80376] Library | Searchbox selector - Manipulation (used in 1 specs)
78. [TC80377] Validate Search box selector - Different search keyword (used in 1 specs)
79. [TC80378] Validate Search box selector - Delete and reset selection (used in 1 specs)
80. [TC80379] Customer issue - Document and Selector | 045.003: Verify selectors not cut of when document height can shrink (used in 1 specs)
81. [TC80380] Customer issue - FilterPanel and Selector | 045.003: Filters (selectors) in a filter panel do not display the initial total number of selections (used in 1 specs)
82. [TC80381] Customer issue - FilterPanel and Selector | Using the filter panel option to clear all filters (used in 1 specs)
83. [TC80382] Customer issue - Grid and Selector | Quick Switch unresponsive after selection on Selector Targeting a Dataset (used in 1 specs)
84. [TC80383] Customer issue - Grid and Selector | Grid selector is not working in Presentation mode when disable drill in specific document (used in 1 specs)
85. [TC80384] Customer issue - Grid and Selector | 045.003: Special characters in attribute ID form grid selectors (used in 1 specs)
86. [TC80385] Customer issue - Grid and Selector | Grid selections are not highlighted in a report service document when there are attribute selectors in the rows and columns. (used in 1 specs)
87. [TC80386] Customer issue - Grid and Selector | RS grids shift (with fixed column) when change the selector after column resized on Non 100% zoom (used in 1 specs)
88. [TC80387] Customer issue - Selector | Null data on different types of selector (used in 1 specs)
89. [TC80388] Customer issue - Selector | Search box suggested box work fine for attributes with long names (used in 1 specs)
90. [TC80389] Customer issue - Grid and Selector | After upgrade from 10.7 to 10.11 grid font increases in size when changing selector on filter panel that targets grid for multiple documents (used in 1 specs)
91. [TC80390] Customer issue - Selector | Validate XSS code is encoded on attribute when using as Selector (used in 1 specs)
92. [TC80391] Library | X-Func: Validate selectors works with consolidation (used in 1 specs)
93. [TC80392] Library | X-Func: Validate selectors works with custom group (used in 1 specs)
94. [TC80393] Library | X-Func: Validate selectors works with panel stack (used in 1 specs)
95. [TC80394] Library | X-Func: Validate selectors works with filter panel (used in 1 specs)
96. [TC80395] Library | X-Func: Validate selectors works with information window (used in 1 specs)
97. [TC80396] Library | X-Func: Validate selector check and uncheck All with filter panel (used in 1 specs)
98. [TC80397] Library | X-Func: Validate selector with filter panel unset all filters (used in 1 specs)
99. [TC80398] Library | X-Func: Validate selectors works with information window when there are two selectors (used in 1 specs)
100. [TC80400] Library | X-Func: Validate selectors works with dynamic text (used in 1 specs)
101. [TC80401] Library | Slider selector - Property (used in 1 specs)
102. [TC80402] Library | Slider selector - Foramt (used in 1 specs)
103. [TC80403] Library | Slider selector - Source and Target (used in 1 specs)
104. [TC80404] Library | Slider selector - Manipulation (used in 1 specs)
105. [TC80405] Library | Template selector selector - Property (used in 1 specs)
106. [TC80406] Library | Template selector selector - Graph selector (used in 1 specs)
107. [TC80407] Library | Template selector selector - Grid and graph selector (used in 1 specs)
108. [TC80408] Library | Template selector selector - Grid selector (used in 1 specs)
109. [TC80409] Library | Validate Template selector - Document converted from dossier (used in 1 specs)
110. [TC80605_01] verify create element/value filter (used in 1 specs)
111. [TC80605_02] verify create attribute/metric filter (used in 1 specs)
112. [TC80605_03] verify create panel filter (used in 1 specs)
113. [TC80605_04] verify create parameter filter (used in 1 specs)
114. [TC80605] Incanvas selector - button bar - property, format and source & target (used in 1 specs)
115. [TC80606] Incanvas selector - button bar - manipulation (used in 1 specs)
116. [TC80608] Incanvas selector - checkbox - manipulation (used in 1 specs)
117. [TC80609] Incanvas selector - checkbox - property, format and source & target (used in 1 specs)
118. [TC80610] Incanvas selector - linkbar - property, format and source & target (used in 1 specs)
119. [TC80611] Incanvas selector - linkbar - manipulation (used in 1 specs)
120. [TC80614] Incanvas selector - listbox - property, format and source & target (used in 1 specs)
121. [TC80615] Incanvas selector - listbox - manipulation (used in 1 specs)
122. [TC80616] Incanvas selector - radio button - property, format and source & target (used in 1 specs)
123. [TC80617] Incanvas selector - radio button - manipulation (used in 1 specs)
124. [TC80657] Incanvas selector - dropdown - property, format and source & target (used in 1 specs)
125. [TC80658] Incanvas selector - dropdown - manipulation (used in 1 specs)
126. [TC80660] Incanvas selector - searchbox - property, format and source & target (used in 1 specs)
127. [TC80663_01] Incanvas selector and filter - searchbox with preload - consumption (used in 1 specs)
128. [TC80663_02] Incanvas selector and filter - searchbox with preload - authoring (used in 1 specs)
129. [TC80663_03] new element search - consumption && authoring (used in 1 specs)
130. [TC80663_04] new element search with parameter - consumption && authoring (used in 1 specs)
131. [TC80663_05] new element search for RSD - consumption (used in 1 specs)
132. [TC80663] Incanvas selector - searchbox - manipulation (used in 1 specs)
133. [TC80684] Incanvas selector - slider - property, format and source & target (used in 1 specs)
134. [TC80685] Incanvas selector - slider - manipulation (used in 1 specs)
135. [TC97291_01] Validate mandatory InCanvas selector with different style on Library (used in 1 specs)
136. [TC97291_02] Validate mandatory InCanvas selector with different style on Library (used in 1 specs)
137. [TC97291_03] Validate mandatory InCanvas selector with different style on Library (used in 1 specs)
138. [TC97291_04] Validate mandatory InCanvas selector with different style on Library (used in 1 specs)
139. [TC97291_05] Validate mandatory InCanvas selector with different style on Library (used in 1 specs)
140. [TC97291_06] Validate mandatory InCanvas selector with different style on Library (used in 1 specs)
141. [TC97291_07] Validate mandatory InCanvas selector with different style on Library (used in 1 specs)
142. [TC97291_08] Validate mandatory InCanvas selector with different style on Library (used in 1 specs)
143. [TC97308] Validate mandatory InCanvas selector for parameter (used in 1 specs)
144. [TC97309] Validate mandatory InCanvas selector with GDDE (used in 1 specs)
145. Calendar Selector (used in 1 specs)
146. Checkbox Selector (used in 1 specs)
147. Dropdown Selector (used in 1 specs)
148. Dropdown Selector - MultiSelect (used in 1 specs)
149. In-canvas selector (used in 1 specs)
150. Incanvas Selector - Button Bar (used in 1 specs)
151. Incanvas Selector - checkbox (used in 1 specs)
152. Incanvas Selector - dropdown (used in 1 specs)
153. Incanvas Selector - linkbar (used in 1 specs)
154. Incanvas Selector - listbox (used in 1 specs)
155. Incanvas Selector - Mandatory (used in 1 specs)
156. Incanvas Selector - radio button (used in 1 specs)
157. Incanvas Selector - searchbox (used in 1 specs)
158. Incanvas Selector - slider (used in 1 specs)
159. Incanvas selector authoring with different types (used in 1 specs)
160. Library Selector - Button Bar Selector (used in 1 specs)
161. Library Selector - Searchbox Selector (used in 1 specs)
162. Library Selector Customer Issues (used in 1 specs)
163. Link Bar Selector (used in 1 specs)
164. List Box Selector (used in 1 specs)
165. Metric Qualification Selector (used in 1 specs)
166. Metric slider Selector (used in 1 specs)
167. Radio button Selector (used in 1 specs)
168. Selector X-Func (used in 1 specs)
169. SelectorPanel (used in 1 specs)
170. Slider Selector (used in 1 specs)
171. Template Selector (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getElement -- frequency: 104
2. getFirstGridCell -- frequency: 85
3. getDocLayoutViewer -- frequency: 47
4. getShownSelectedText -- frequency: 47
5. getSelectedItemsText -- frequency: 33
6. getInstance -- frequency: 32
7. getInCanvasSelectorByAriaLabel -- frequency: 26
8. getOneRowData -- frequency: 24
9. getMandatoryWarningMessageText -- frequency: 20
10. getSeletedItemsCount -- frequency: 20
11. getSliderSummary -- frequency: 15
12. getMandatoryWarningBorder -- frequency: 14
13. getMandatoryWarningMessage -- frequency: 14
14. getSelectedItemsCount -- frequency: 14
15. getSelectedItems -- frequency: 12
16. getContent -- frequency: 10
17. getSelectedItemText -- frequency: 10
18. getTitle -- frequency: 10
19. getSearchSuggestItemsText -- frequency: 9
20. getSingleTooltipText -- frequency: 9
21. getTextAndFormContent -- frequency: 9
22. getToDate -- frequency: 9
23. {actual} -- frequency: 8
24. {expected} -- frequency: 8
25. getDropdownWidget -- frequency: 8
26. getFromDate -- frequency: 8
27. getListTable -- frequency: 8
28. getSuggestionListItems -- frequency: 8
29. getSuggestListItemsText -- frequency: 8
30. getTitleText -- frequency: 8
31. getSearchBoxMandatoryWarningMessageText -- frequency: 7
32. getOuterContainer -- frequency: 6
33. getSearchResultsText -- frequency: 6
34. getSearchSuggestItemsCount -- frequency: 6
35. getSelectedSearchboxItem -- frequency: 6
36. getEndTooltipText -- frequency: 5
37. getSelectedDrodownItem -- frequency: 5
38. getButtonByName -- frequency: 4
39. getFiledText -- frequency: 4
40. getItemsNumber -- frequency: 4
41. getListBoxListItems -- frequency: 4
42. getSearchSuggestItemIndex -- frequency: 4
43. getStartTooltipText -- frequency: 4
44. getButtonbarItems -- frequency: 3
45. getChecklistItems -- frequency: 3
46. getDropdown -- frequency: 3
47. getDropdownList -- frequency: 3
48. getFirstGridCellInRow -- frequency: 3
49. getItemsText -- frequency: 3
50. getRadioListItems -- frequency: 3
51. getSearchSuggest -- frequency: 3
52. getSelectedSearchSuggestItemsText -- frequency: 3
53. getTableWidth -- frequency: 3
54. getDropdownItemsCount -- frequency: 2
55. getLinkListItems -- frequency: 2
56. getSearchBoxInputValue -- frequency: 2
57. getSearchBoxMandatoryWarningBorder -- frequency: 2
58. getSelectedPanelText -- frequency: 2
59. getSelectedPatternText -- frequency: 2
60. getSelectorMenu -- frequency: 2
61. getSliderLabel -- frequency: 2
62. getSliderText -- frequency: 2
63. getSliderTooltipText -- frequency: 2
64. getSuggestionListText -- frequency: 2
65. Context Menu -- frequency: 1
66. getApplyButtonTooltip -- frequency: 1
67. getDropdownSelectedText -- frequency: 1
68. getElementIndexInSearchResults -- frequency: 1
69. getGridCellInRow -- frequency: 1
70. getItemMode -- frequency: 1
71. getLibraryIcon -- frequency: 1
72. getMQExpression -- frequency: 1
73. getSelectedSearchSuggestItemsIndex -- frequency: 1
74. getSliderSelectedText -- frequency: 1
75. getTextFiledTitle -- frequency: 1
76. Input Popup -- frequency: 1
77. Qualification Dropdown -- frequency: 1
78. Slide Tooltip -- frequency: 1
79. Tooltip -- frequency: 1

## Key Actions

- `openUrl()` -- used in 144 specs
- `openPageFromTocMenu()` -- used in 134 specs
- `getElement()` -- used in 104 specs
- `createByTitle()` -- used in 95 specs
- `findSelectorByName()` -- used in 95 specs
- `getFirstGridCell()` -- used in 85 specs
- `selectItemByText(text)` -- used in 62 specs
- `selectNthItem(index, text)` -- used in 60 specs
- `isCellDisplayed()` -- used in 55 specs
- `waitAllToBeLoaded()` -- used in 54 specs
- `isItemSelected(index, text)` -- used in 52 specs
- `getDocLayoutViewer()` -- used in 47 specs
- `getShownSelectedText()` -- used in 47 specs
- `firstElmOfHeader()` -- used in 41 specs
- `openDossier()` -- used in 38 specs
- `selectItem(itemName)` -- used in 38 specs
- `searchSearchbox(text, isPreloaded = false)` -- used in 37 specs
- `goToLibrary()` -- used in 36 specs
- `isMandatoryWarningDisplayed()` -- used in 36 specs
- `getSelectedItemsText()` -- used in 33 specs
- `input(text)` -- used in 33 specs
- `getInstance()` -- used in 32 specs
- `openAndSelectContextMenu(option)` -- used in 32 specs
- `applySelection()` -- used in 31 specs
- `openDropdown()` -- used in 30 specs
- `isItemsChecked(texts)` -- used in 29 specs
- `customCredentials()` -- used in 27 specs
- `login()` -- used in 27 specs
- `clickItems(texts)` -- used in 26 specs
- `getInCanvasSelectorByAriaLabel()` -- used in 26 specs
- `openContextMenu()` -- used in 26 specs
- `selectOptionInMenu(option)` -- used in 26 specs
- `dragSlider(toOffset, sliderByClass = 'middle', wait = true)` -- used in 24 specs
- `getOneRowData()` -- used in 24 specs
- `dismissSuggestionList()` -- used in 23 specs
- `isItemSelectedByText(text)` -- used in 23 specs
- `apply()` -- used in 20 specs
- `getMandatoryWarningMessageText()` -- used in 20 specs
- `getSeletedItemsCount()` -- used in 20 specs
- `isItemExisted(item)` -- used in 20 specs
- `selectItems(itemNames)` -- used in 20 specs
- `clickCell()` -- used in 19 specs
- `goToPage()` -- used in 17 specs
- `sleep()` -- used in 17 specs
- `editDossierFromLibrary()` -- used in 16 specs
- `initial()` -- used in 16 specs
- `openDropdownMenu()` -- used in 16 specs
- `openPatternDropdown()` -- used in 16 specs
- `getSliderSummary()` -- used in 15 specs
- `findGridById()` -- used in 14 specs
- `getMandatoryWarningBorder()` -- used in 14 specs
- `getMandatoryWarningMessage()` -- used in 14 specs
- `getSelectedItemsCount()` -- used in 14 specs
- `isItemTextSelected(text)` -- used in 13 specs
- `search(text)` -- used in 13 specs
- `getSelectedItems()` -- used in 12 specs
- `selectSearchBoxItemsForPreload({ items, isPreloaded = false, isSingleSelection = true })` -- used in 12 specs
- `clickTextfieldByTitle()` -- used in 11 specs
- `getTitle()` -- used in 11 specs
- `openDropdownAndMultiSelect(texts)` -- used in 11 specs
- `selectDate(year, month, day)` -- used in 11 specs
- `selectMultiItemByText(texts)` -- used in 11 specs
- `createByAriaLable()` -- used in 10 specs
- `getContent()` -- used in 10 specs
- `getSelectedItemText()` -- used in 10 specs
- `cancelSelection()` -- used in 9 specs
- `clickOKBtn(checkDocumentLoaded = true)` -- used in 9 specs
- `closeDossierWithoutSaving()` -- used in 9 specs
- `dropdownItemsCount()` -- used in 9 specs
- `getSearchSuggestItemsText()` -- used in 9 specs
- `getSingleTooltipText()` -- used in 9 specs
- `getTextAndFormContent()` -- used in 9 specs
- `getToDate()` -- used in 9 specs
- `inputValue(buttonLocator, text)` -- used in 9 specs
- `openToCalendar()` -- used in 9 specs
- `switchToFormatPanel()` -- used in 9 specs
- `switchToTextAndFormTab()` -- used in 9 specs
- `clickTriageButton()` -- used in 8 specs
- `getDropdownWidget()` -- used in 8 specs
- `getFromDate()` -- used in 8 specs
- `getListTable()` -- used in 8 specs
- `getSuggestionListItems()` -- used in 8 specs
- `getSuggestListItemsText()` -- used in 8 specs
- `getTitleText()` -- used in 8 specs
- `openSecondaryPanel()` -- used in 8 specs
- `selectItemsByTextForPreload({ texts, isPreload = false, isSingleSelection = true})` -- used in 8 specs
- `selectSearchBoxItem(item, isPreloaded = false)` -- used in 8 specs
- `clearSearch()` -- used in 7 specs
- `clickMenuItem()` -- used in 7 specs
- `getSearchBoxMandatoryWarningMessageText()` -- used in 7 specs
- `isPanelPresent()` -- used in 7 specs
- `clickItemByText(text)` -- used in 6 specs
- `deleteSearchboxItems(items)` -- used in 6 specs
- `getOuterContainer()` -- used in 6 specs
- `getSearchResultsText()` -- used in 6 specs
- `getSearchSuggestItemsCount()` -- used in 6 specs
- `getSelectedSearchboxItem()` -- used in 6 specs
- `multiSelect(items)` -- used in 6 specs
- `openFromCalendar()` -- used in 6 specs
- `setFilterToSelectorContainer()` -- used in 6 specs
- `findFilterPanelByName()` -- used in 5 specs
- `getEndTooltipText()` -- used in 5 specs
- `getSelectedDrodownItem()` -- used in 5 specs
- `checkElementListByIndex()` -- used in 4 specs
- `clearAllSelections()` -- used in 4 specs
- `clickCloseDossierButton()` -- used in 4 specs
- `clickDropdownBtn(text)` -- used in 4 specs
- `createByName()` -- used in 4 specs
- `filterSelectionInfo()` -- used in 4 specs
- `findGridByKey()` -- used in 4 specs
- `findPanelStackByName()` -- used in 4 specs
- `getButtonByName()` -- used in 4 specs
- `getFiledText()` -- used in 4 specs
- `getItemsNumber()` -- used in 4 specs
- `getListBoxListItems()` -- used in 4 specs
- `getSearchSuggestItemIndex(itemText)` -- used in 4 specs
- `getStartTooltipText()` -- used in 4 specs
- `isApplyButtonDisabled()` -- used in 4 specs
- `openDropdownNoWait()` -- used in 4 specs
- `openFilterPanel()` -- used in 4 specs
- `openMenu()` -- used in 4 specs
- `selectElementsByNames()` -- used in 4 specs
- `waitForCurtainDisappear()` -- used in 4 specs
- `clickDynamicCalendarButton(btnName)` -- used in 3 specs
- `clickMenuNthItem()` -- used in 3 specs
- `clickOnRectArea()` -- used in 3 specs
- `clickPageTitle()` -- used in 3 specs
- `dragDSObjectToSelector()` -- used in 3 specs
- `getButtonbarItems()` -- used in 3 specs
- `getChecklistItems()` -- used in 3 specs
- `getDropdown()` -- used in 3 specs
- `getDropdownList()` -- used in 3 specs
- `getFirstGridCellInRow()` -- used in 3 specs
- `getItemsText()` -- used in 3 specs
- `getRadioListItems()` -- used in 3 specs
- `getSearchSuggest()` -- used in 3 specs
- `getSelectedSearchSuggestItemsText()` -- used in 3 specs
- `getTableWidth()` -- used in 3 specs
- `includes()` -- used in 3 specs
- `inputToStartPoint(text)` -- used in 3 specs
- `inputValueDirectly(value, index = 1)` -- used in 3 specs
- `isDropdownListPresent()` -- used in 3 specs
- `openDropdownOperation()` -- used in 3 specs
- `searchResults()` -- used in 3 specs
- `selectAll()` -- used in 3 specs
- `selectDropdownItems(items)` -- used in 3 specs
- `selectDropdownOperation(name, iswait = true)` -- used in 3 specs
- `selectTargetVizFromWithinSelector()` -- used in 3 specs
- `switchToFilterPanel()` -- used in 3 specs
- `typeKeyboard()` -- used in 3 specs
- `chooseDropdownItems(items)` -- used in 2 specs
- `clickCancelBtn()` -- used in 2 specs
- `clickDynamicDateCheckBox()` -- used in 2 specs
- `clickDynamicDayStepperNext(times)` -- used in 2 specs
- `clickDynamicMonthStepperNext(times)` -- used in 2 specs
- `clickDynamicMonthStepperPrev()` -- used in 2 specs
- `closeDropdownMenu()` -- used in 2 specs
- `findGraphByIdContains()` -- used in 2 specs
- `findSelectorByKey()` -- used in 2 specs
- `getDropdownItemsCount()` -- used in 2 specs
- `getLinkListItems()` -- used in 2 specs
- `getSearchBoxInputValue()` -- used in 2 specs
- `getSearchBoxMandatoryWarningBorder()` -- used in 2 specs
- `getSelectedPanelText()` -- used in 2 specs
- `getSelectedPatternText()` -- used in 2 specs
- `getSelectorMenu()` -- used in 2 specs
- `getSliderLabel()` -- used in 2 specs
- `getSliderText()` -- used in 2 specs
- `getSliderTooltipText(position = 'end')` -- used in 2 specs
- `getSuggestionListText()` -- used in 2 specs
- `inputToEndPoint(text)` -- used in 2 specs
- `isGridPresnt()` -- used in 2 specs
- `isRsdGraphPresent()` -- used in 2 specs
- `isSearchResultPresent()` -- used in 2 specs
- `isTextPresent()` -- used in 2 specs
- `linkOrButtonBarSelector()` -- used in 2 specs
- `scrollDropdown(toPosition)` -- used in 2 specs
- `scrollFilterPanelToBottom()` -- used in 2 specs
- `selectContextMenuOnCell()` -- used in 2 specs
- `selectDynamicDayDropdownItem(index, text)` -- used in 2 specs
- `selectDynamicMonthDropdownItem(index, text)` -- used in 2 specs
- `selectElementByName()` -- used in 2 specs
- `selectSearchBoxItems(items, isDismissPreload = true)` -- used in 2 specs
- `toggleViewSelectedOptionOn()` -- used in 2 specs
- `waitDocumentToBeLoaded()` -- used in 2 specs
- `adjustColumnWidth()` -- used in 1 specs
- `changeGroupBy()` -- used in 1 specs
- `clickApply()` -- used in 1 specs
- `clickLeftArrow()` -- used in 1 specs
- `clickOkButton()` -- used in 1 specs
- `clickSliderBar(offset)` -- used in 1 specs
- `clickUnset()` -- used in 1 specs
- `close()` -- used in 1 specs
- `closeDropdown()` -- used in 1 specs
- `closeFilterPanel()` -- used in 1 specs
- `createNewAttributeMetricFilter()` -- used in 1 specs
- `createNewElementFilter()` -- used in 1 specs
- `createNewPanelFilter()` -- used in 1 specs
- `createNewParameterFilter()` -- used in 1 specs
- `deleteItemByText(itemText)` -- used in 1 specs
- `dismissPreloadElementList()` -- used in 1 specs
- `findGridAndGraphByName()` -- used in 1 specs
- `getApplyButtonTooltip()` -- used in 1 specs
- `getDropdownSelectedText()` -- used in 1 specs
- `getElementIndexInSearchResults()` -- used in 1 specs
- `getGridCellInRow()` -- used in 1 specs
- `getItemMode(text)` -- used in 1 specs
- `getLibraryIcon()` -- used in 1 specs
- `getMQExpression()` -- used in 1 specs
- `getSelectedSearchSuggestItemsIndex()` -- used in 1 specs
- `getSliderSelectedText()` -- used in 1 specs
- `getTextFiledTitle()` -- used in 1 specs
- `hover()` -- used in 1 specs
- `inputDate(dimension, date)` -- used in 1 specs
- `inputValueWithoutApply(value, index = 1)` -- used in 1 specs
- `isDynamicDateChecked()` -- used in 1 specs
- `isSearchboxEmpty()` -- used in 1 specs
- `isSearchEnabled()` -- used in 1 specs
- `moveToSuggetionItem(index)` -- used in 1 specs
- `multiSelectNth(items)` -- used in 1 specs
- `scrollFilterPanelToTop()` -- used in 1 specs
- `scrollFilterToBottom()` -- used in 1 specs
- `scrollOnPage()` -- used in 1 specs
- `searchInDropdown(text)` -- used in 1 specs
- `selectDayTime(year, month, day, hour, minute, second, meridiem = 'AM')` -- used in 1 specs
- `showQuickSwitch()` -- used in 1 specs
- `switchModeToGraph()` -- used in 1 specs
- `toBeGreaterThan()` -- used in 1 specs
- `toBeLessThan()` -- used in 1 specs
- `branchSelectItemByTexts(texts)` -- used in 0 specs
- `clearAndInputAndWaitForFirstSuggestion(text)` -- used in 0 specs
- `clickApplyButtonInPauseMode()` -- used in 0 specs
- `clickClearAll()` -- used in 0 specs
- `clickDropdown()` -- used in 0 specs
- `clickDynamicDayStepperPrev(times)` -- used in 0 specs
- `clickEditButtonInPauseMode()` -- used in 0 specs
- `clickOnInputBox()` -- used in 0 specs
- `clickSelectAll()` -- used in 0 specs
- `collapseItemByText(text)` -- used in 0 specs
- `collapseItemsByText(texts)` -- used in 0 specs
- `dateAndTimeText()` -- used in 0 specs
- `dismissLevelDropdown()` -- used in 0 specs
- `dragSlider(toOffset, position = 'end')` -- used in 0 specs
- `dragSliderForInsertData(toOffset)` -- used in 0 specs
- `expandItemByText(text)` -- used in 0 specs
- `expandItemsByText(texts)` -- used in 0 specs
- `getAllItemsInSearchResults()` -- used in 0 specs
- `getAriaLabel()` -- used in 0 specs
- `getCancelButtonTooltip()` -- used in 0 specs
- `getICSTargetTooltipText(isValueParameter = false)` -- used in 0 specs
- `getICSTitleTooltipText()` -- used in 0 specs
- `getInputDate()` -- used in 0 specs
- `getInputValue()` -- used in 0 specs
- `getItem(elemName)` -- used in 0 specs
- `getItemDeleteCapsure(elemName)` -- used in 0 specs
- `getItemSelectedStatus(text)` -- used in 0 specs
- `getItemWithExactName(elemName)` -- used in 0 specs
- `getSearchSuggestItemIndex(item)` -- used in 0 specs
- `getSelectedItemsInLevelDropdown()` -- used in 0 specs
- `getSelectedItemsInSearchResults()` -- used in 0 specs
- `getSelectedItemsText(isSearchBox = false)` -- used in 0 specs
- `getSliderWidth()` -- used in 0 specs
- `getTooltipText(buttonLocator)` -- used in 0 specs
- `inputAndNoWait(text)` -- used in 0 specs
- `inputAndWaitForFirstSuggestion(text)` -- used in 0 specs
- `inputText(text)` -- used in 0 specs
- `inputToPoint(text)` -- used in 0 specs
- `inputValue(value, index = 1)` -- used in 0 specs
- `isEmptySelector()` -- used in 0 specs
- `isICSTargetTooltipDisplayed()` -- used in 0 specs
- `isICSTitleTooltipDisplayed()` -- used in 0 specs
- `isItemExpanded(text)` -- used in 0 specs
- `isItemLeafNode(text)` -- used in 0 specs
- `isItemSelected(item)` -- used in 0 specs
- `isLinkItemSelected(item)` -- used in 0 specs
- `isOptionInMenu(option)` -- used in 0 specs
- `isSearchBoxMandatoryWarningDisplayed()` -- used in 0 specs
- `lastItemText()` -- used in 0 specs
- `levelSelectItemByText(text, level)` -- used in 0 specs
- `openDateTimePicker()` -- used in 0 specs
- `openDropdownAndSelect(items)` -- used in 0 specs
- `openDynamicDayDropdown()` -- used in 0 specs
- `openDynamicMonthDropdown()` -- used in 0 specs
- `openQualificationDropdown()` -- used in 0 specs
- `scrollAndSelectDropDown(rootElement, option)` -- used in 0 specs
- `search(searchKey)` -- used in 0 specs
- `selectDateWithOKBtn(year, month, day)` -- used in 0 specs
- `selectDay(day)` -- used in 0 specs
- `selectDynamicCalendarDropdownItem(index, text)` -- used in 0 specs
- `selectedSearchItemCount()` -- used in 0 specs
- `selectHour(hour, meridiem)` -- used in 0 specs
- `selectItemByKey(key, itemName)` -- used in 0 specs
- `selectItemByText(text, checkDocumentLoaded = true)` -- used in 0 specs
- `selectItemsByText(texts)` -- used in 0 specs
- `selectItemWithExactName(itemName)` -- used in 0 specs
- `selectLevel(levelText)` -- used in 0 specs
- `selectLevelInSearchBar(levelText)` -- used in 0 specs
- `selectMinute(minute)` -- used in 0 specs
- `selectMonth(month)` -- used in 0 specs
- `selectQualificationOperation(name, iswait = true)` -- used in 0 specs
- `selectSearchResults(results)` -- used in 0 specs
- `selectSecond(second)` -- used in 0 specs
- `selectYear(year)` -- used in 0 specs
- `singleSelectItemByText(text)` -- used in 0 specs
- `textBoxInputText()` -- used in 0 specs

## Source Coverage

- `pageObjects/selector/**/*.js`
- `specs/regression/selector/**/*.{ts,js}`
- `specs/regression/IncanvasSelector/**/*.{ts,js}`
- `specs/regression/selectorPanel/**/*.{ts,js}`
