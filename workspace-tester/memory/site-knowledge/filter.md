# Site Knowledge: Filter Domain

## Overview

- **Domain key:** `filter`
- **Components covered:** AttributeSlider, CalendarDynamicPanel, CalendarHeader, CalendarWidget, CalenderFilter, ChartVisualizationFilter, CheckboxFilter, CheckboxFilter, DynamicFilter, FilterSummaryBar, MQFilter, MQSliderFilter, RadiobuttonFilter, SearchBoxFilter, Timezone, VisualizationFilter
- **Spec files scanned:** 42
- **POM files scanned:** 16

## Components

### AttributeSlider
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickHandle(name)`
  - `clickLowerHandle(name)`
  - `clickUpperHandle(name)`
  - `dragAndDropHandle(name, pos)`
  - `dragAndDropLowerHandle(name, pos)`
  - `dragAndDropUpperHandle(name, pos)`
  - `hoverOnMaxValue(name)`
  - `hoverOnMinValue(name)`
  - `hoverOnSummaryLabel(name)`
  - `hoverOnUpperHandle(name)`
  - `isSliderHighlighted(name)`
  - `isSummaryInExcludeMode(name)`
  - `isSummaryPresent(name)`
  - `maxValue(name)`
  - `minValue(name)`
  - `sliderTooltip()`
  - `summary(name)`
- **Related components:** getFilterContainer

### CalendarDynamicPanel
- **CSS root:** `.mstr-date-time-range-picker-last-next-input`
- **User-visible elements:**
  - Custom Operator Time Input (`.mstr-time-picker__container input`)
  - Last Next Context Menu Container (`.mstr-date-time-range-picker-last-next-input`)
- **Component actions:**
  - `clickApplyButton()`
  - `displayTextOfCustomFrom()`
  - `displayTextOfCustomOperator()`
  - `displayTextOfCustomTo()`
  - `displayTextOfFrom()`
  - `displayTextOfTo()`
  - `getCalendarInputValue(el)`
  - `getSelectedDynamicOption()`
  - `isCalendarLocked()`
  - `openCustomOperatorDatePicker()`
  - `openFromDatePicker()`
  - `openToDatePicker()`
  - `selectCustomOperatorOption(name)`
  - `selectDynamicOption(radio)`
  - `setCustomOperatorInput(value)`
  - `setFromInputValue(value)`
  - `setLastNextNumberInputWithValue(value, expectedValue)`
  - `setLastNextRelativeRange({ prefix, value, unit, expectedValue = value })`
  - `setTimeInputValue({ operator = 'Between', ele = 'from', timeValue })`
  - `setToInputValue(value)`
- **Related components:** getContainer, getLastNextContextMenuContainer

### CalendarHeader
- **CSS root:** `.mstrd-CalStyleFilterDetailsPanel-header`
- **User-visible elements:**
  - Date Input Box (`.mstrd-DateInput-wrapper`)
  - Dynamic Date Context Menu (`.mstrd-CalFilterTypeDropdownSelector-dropdownMenu`)
  - Header Container (`.mstrd-CalStyleFilterDetailsPanel-header`)
- **Component actions:**
  - `dateOnWidgetHeader()`
  - `dynamicHeaderSummaryText()`
  - `expandDynamicDateOptions()`
  - `inputAMPMOfBeforeAfter()`
  - `inputAMPMOfFrom()`
  - `inputAMPMOfTo()`
  - `inputDayOfBeforeAfter()`
  - `inputDayOfFrom()`
  - `inputDayOfTo()`
  - `inputHourOfBeforeAfter()`
  - `inputHourOfFrom()`
  - `inputHourOfTo()`
  - `inputMinuteOfBeforeAfter()`
  - `inputMinuteOfFrom()`
  - `inputMinuteOfTo()`
  - `inputMonthOfBeforeAfter()`
  - `inputMonthOfFrom()`
  - `inputMonthOfTo()`
  - `inputYearOfBeforeAfter()`
  - `inputYearOfFrom()`
  - `inputYearOfTo()`
  - `isAfterSelected()`
  - `isBeforeSelected()`
  - `isInputAfterUnset()`
  - `isInputAnyDateSelected()`
  - `isInputBeforeUnset()`
  - `isInputBoxUnset()`
  - `isOnSelected()`
  - `isTimeInputPresent()`
  - `selectDynamicDateOptions(name)`
  - `selectInputDayOfBeforeAfter()`
  - `selectInputDayOfFrom()`
  - `selectInputDayOfTo()`
  - `selectInputMonthOfBeforeAfter()`
  - `selectInputMonthOfFrom()`
  - `selectInputMonthOfTo()`
  - `selectInputYearOfBeforeAfter()`
  - `selectInputYearOfFrom()`
  - `selectInputYearOfTo()`
  - `sendKeyToInput(theKey)`
  - `setInputDateOfBeforeAfter({ customMonth, customDay, customYear })`
  - `setInputDateOfFrom({ customMonth, customDay, customYear })`
  - `setInputDateOfTo({ customMonth, customDay, customYear })`
  - `setInputDateUnitWithValue({ partialDate, customValue })`
  - `setInputTimeOfBeforeAfter({ customHour, customMin, customSec, customAMPM })`
  - `setInputTimeOfFrom({ customHour, customMin, customSec, customAMPM })`
  - `setInputTimeOfOnFrom({ customHour, customMin, customSec, customAMPM })`
  - `setInputTimeOfOnTo({ customHour, customMin, customSec, customAMPM })`
  - `setInputTimeOfTo({ customHour, customMin, customSec, customAMPM })`
  - `setInputTimeUnitWithValue({ partialTime, customValue })`
- **Related components:** getHeaderContainer

### CalendarWidget
- **CSS root:** `.mstrd-Calendar-widget-container`
- **User-visible elements:**
  - Widget Container (`.mstrd-Calendar-widget-container`)
  - Widget Day Of From (`.mstrd-rc-Day--from`)
  - Widget Day Of To (`.mstrd-rc-Day--to`)
  - Widget Day Selected (`.mstrd-rc-Day--selected`)
- **Component actions:**
  - `getWidgetHeaderMonthYear()`
  - `goToNextMonth()`
  - `goToNextYear()`
  - `goToPreviousMonth()`
  - `goToPreviousYear()`
  - `isDateSelectedInWidget({ monthYear, day })`
  - `isSingleDateSelected()`
  - `scrollWidgetToBottom()`
  - `selectDateInWidget({ monthYear, day })`
  - `widgetDayOfFrom()`
  - `widgetDayOfSelected()`
  - `widgetDayOfTo()`
  - `widgetMonthOfFrom()`
  - `widgetMonthOfTo()`
  - `widgetTextAsSelected()`
- **Related components:** getDateInWidget, getHeaderTextInWidget, getLeftHeaderInWidget, getMonthYearInWidget, getRightHeaderInWidget, getWidget, getWidgetContainer

### CalenderFilter
- **CSS root:** `.mstrd-FilterDetailPanelFooter`
- **User-visible elements:**
  - Clear Selection (`.mstrd-FilterDetailPanelFooter`)
- **Component actions:**
  - `capsuleDateTime(filterName)`
  - `clearSelection()`
  - `composeCapsuleDateTime(filterName)`
  - `composeInputDate({ mmFun, ddFun, yyFun })`
  - `composeInputTime({ hourFun, minFun, ampmFun })`
  - `composeWidgetDate({ mmyyFun, ddFun })`
  - `dynamicDisplayTextOfFrom()`
  - `dynamicDisplayTextOfTo()`
  - `expandDynamicDateOptions()`
  - `expandPopUpCalendarForFrom()`
  - `expandPopUpCalendarForTo()`
  - `filterSummaryBarText(filterName)`
  - `getDateOnWidgetHeader()`
  - `getWidgetMonthYear()`
  - `goToNextMonth()`
  - `goToNextYear()`
  - `goToPreviousMonth()`
  - `goToPreviousYear()`
  - `isAfterSelected()`
  - `isBeforeSelected()`
  - `isCapsuleDynamic(filterName)`
  - `isCapsuleExcluded(filterName)`
  - `isCapsulePresent(filterName)`
  - `isClearSelectionEnabled()`
  - `isDynamicOptionSelected(option)`
  - `isInputAfterUnset()`
  - `isInputAnyDateSelected()`
  - `isInputBeforeUnset()`
  - `isInputBoxUnset()`
  - `isInputEqualToCapsule(filterName)`
  - `isInputEqualToWidget({ widgetmmyyFun, widgetddFun, inputmmFun, inputddFun, inputyyFun })`
  - `isInputEqualToWidgetForFrom()`
  - `isInputEqualToWidgetForTo()`
  - `isLastNextContextMenuContainerPresent()`
  - `isOnSelected()`
  - `isTimeInputPresent()`
  - `removeCapsule(filterName)`
  - `scrollWidgetToBottom()`
  - `selectDateInWidget({ monthYear, day })`
  - `selectDynamicDateOptions(name, useOld = false)`
  - `selectDynamicOption(radio)`
  - `selectInputDayOfBeforeAfter()`
  - `selectInputDayOfFrom()`
  - `selectInputDayOfTo()`
  - `selectInputMonthOfBeforeAfter()`
  - `selectInputMonthOfFrom()`
  - `selectInputMonthOfTo()`
  - `selectInputYearOfBeforeAfter()`
  - `selectInputYearOfFrom()`
  - `selectInputYearOfTo()`
  - `sendKeyToInput(theKey)`
  - `setFromForCustom({
        option, prefix, value, unit, fixedOption, monthYear, day, customMonth, customDay, customYear, customHour, customMin, customSec, customAMPM, })`
  - `setInputDateOfBeforeAfter({ customMonth, customDay, customYear })`
  - `setInputDateOfFrom({ customMonth, customDay, customYear })`
  - `setInputDateOfTo({ customMonth, customDay, customYear })`
  - `setInputTimeOfBeforeAfter({ customHour, customMin, customSec, customAMPM })`
  - `setInputTimeOfFrom({ customHour, customMin, customSec, customAMPM })`
  - `setInputTimeOfOnFrom({ customHour, customMin, customSec, customAMPM })`
  - `setInputTimeOfOnTo({ customHour, customMin, customSec, customAMPM })`
  - `setInputTimeOfTo({ customHour, customMin, customSec, customAMPM })`
  - `setLastNextRelativeRange({ prefix, value, unit, expectedValue })`
  - `setToForCustom({
        option, prefix, value, unit, fixedOption, monthYear, day, customMonth, customDay, customYear, customHour, customMin, customSec, customAMPM, })`
  - `widgetStartWeekDay()`
- **Related components:** composeWidget, dynamicPanel, getFilterContainer, isInputEqualToWidget

### ChartVisualizationFilter
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickChartElementByIndex(index, chartType)`
  - `elementIndexInXAxisByName(eleName)`
  - `getChartElementByName(elementName, chartType)`
  - `selectElementsInAreaByIndex(index, chartType)`
  - `selectElementsInAreaByName(elementName, chartType)`
  - `selectOrDeselectChartElementByName(elementName, chartType)`
  - `valueOfToolTipInChart(elementName, chartType)`
- **Related components:** _none_

### CheckboxFilter
- **CSS root:** `.mstrd-FilterItemsList`
- **User-visible elements:**
  - Filter Item List (`.mstrd-FilterItemsList`)
- **Component actions:**
  - `capsuleCount(filterName)`
  - `clearAll()`
  - `clearSearch()`
  - `elementByOrder(index)`
  - `getCheckboxByName(name)`
  - `getCheckBoxElementsCount()`
  - `getCheckBoxElementsText()`
  - `hoverOnElement(name)`
  - `isCapsuleExcluded({ filterName, capsuleName })`
  - `isCapsulePresent({ filterName, capsuleName })`
  - `isClearAllEnabled()`
  - `isClearSearchIconPresent()`
  - `isElementPresent(name)`
  - `isElementSelected(name)`
  - `isKeepOnlyLinkDisplayed(name)`
  - `isSelectAllEnabled()`
  - `isViewSelectedEnabled()`
  - `keepOnly(name)`
  - `keyword()`
  - `message()`
  - `openSecondaryPanel(filterName)`
  - `scrollSecondaryPanelToBottom()`
  - `search(keyword)`
  - `selectAll()`
  - `selectElementByName(name)`
  - `selectElementsByNames(names)`
  - `toggleViewSelectedOption()`
  - `toggleViewSelectedOptionOn()`
  - `uncheckElementByName(name)`
  - `visibleSelectedElementCount()`
- **Related components:** getFilterContainer, getSecondaryFilterPanel

### CheckboxFilter
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clearInput(name)`
  - `inputPlaceholder(name)`
  - `inputValue(name, value)`
  - `inputValueForLongString(name, value, repeat = 1)`
- **Related components:** getFilterContainer

### DynamicFilter
- **CSS root:** `.mstrd-AttrElemDetailsPanel-LevelSearchBox`
- **User-visible elements:**
  - Clear Search Icon (`.icon-clearsearch.mstrd-FilterSearchBox-manual-search`)
  - Current Search Level (`.mstrd-AttrElemDetailsPanel-LevelSearchBox`)
  - Filter Search Box (`.mstrd-FilterSearchBox-search-box`)
  - Hierarchy Checkbox Spinner (`.mstrd-Spinner.mstrd-HierarchyCheckbox-expandSpin`)
  - Level Icon (`.mstrd-AttrElemDetailsPanel-header`)
  - Level List (`.ant-popover-content`)
  - Level Selection Dropdown (`.mstrd-LevelSelectionContextMenu-menu`)
  - Locked Level Icon (`.mstrd-AttrElemDetailsPanel-header`)
  - Locked Secondary Panel (`.mstrd-AttrElemDetailsPanel-locked`)
- **Component actions:**
  - `capsuleCount(filterName)`
  - `capsuleName(filterName, index)`
  - `clearAll()`
  - `clearLevelByName(name)`
  - `clearSearch()`
  - `clickBranchSelectionButton(name)`
  - `clickLevelIcon()`
  - `clickLevelInBranchButton(name)`
  - `closeLevelInBranchContextMenu(name)`
  - `collapseElement(name)`
  - `contractFullScreen()`
  - `currentSearchLevel()`
  - `expandElement(name)`
  - `expandFullScreen()`
  - `hoverOnHierarchyElement(name)`
  - `inputSearch(text)`
  - `isBranchSelectionButtonDisabled(name)`
  - `isCapsuleExcluded(filterName, capsuleName)`
  - `isCollapsed(name)`
  - `isDynamic(name)`
  - `isExpanded(name)`
  - `isLevelInBranchButtonPresent(name)`
  - `isLevelSelected(name)`
  - `isLevelSelectIconLocked()`
  - `isSecondaryPanelLocked()`
  - `isSelected(name)`
  - `searchByClick(text)`
  - `searchByEnter(text)`
  - `searchResultCount()`
  - `selectAll()`
  - `selectedResultCount()`
  - `selectLevelByName(name)`
  - `selectNthSearchLevel(n)`
  - `singleDeselectElement(name)`
  - `singleSelectElement(name)`
- **Related components:** getFilterContainer, getLockedSecondaryPanel

### FilterSummaryBar
- **CSS root:** `.mstrd-FilterSummary-barContainer`
- **User-visible elements:**
  - Expanded Filter Summary Items (`.mstrd-FilterSummaryPanel-items`)
  - Filter Bar Item (`.mstrd-FilterSummaryBar-items`)
  - Filter Summary Bar (`.mstrd-FilterSummaryBar`)
  - Filter Summary Bar Container (`.mstrd-FilterSummary-barContainer`)
  - Filter Summary Bar No Filter Label (`.mstrd-FilterSummaryBar-noFilter`)
  - Filter Summary Panel (`.mstrd-FilterSummaryPanel`)
  - View All Button (`.mstrd-FilterSummaryBar-right`)
  - View Less Button (`.mstrd-FilterSummaryViewButton--expanded`)
- **Component actions:**
  - `clickPencilIconByName(name)`
  - `collapseViewAllItems()`
  - `filterBarItemCount()`
  - `filterCountString()`
  - `filterItemCountExpanded()`
  - `filterItems(name, index = 0)`
  - `filterPanelItems(name, index = 0)`
  - `filterPanelItemsCount(name)`
  - `filterSummaryBarText()`
  - `isFilterExcludedinExpandedView(name)`
  - `isFilterSummaryPresent()`
  - `isPencilIconPresent(name)`
  - `isTruncateDotsPresent(name)`
  - `viewAllButtonisDisplayed()`
  - `viewAllButtonIsPresent()`
  - `viewAllFilterItems()`
- **Related components:** getFilterPanel, getFilterSummaryBarContainer

### MQFilter
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickOutOfDropdown()`
  - `hoverOnFilter(filterName)`
  - `inputBoxValue(name)`
  - `openDropdownMenu(name)`
  - `selectedOption(name)`
  - `selectOption(name, option)`
  - `updateValue({ filterName, valueLower, valueUpper })`
  - `updateValueWithEnter({ filterName, valueLower, valueUpper })`
- **Related components:** getFilterContainer

### MQSliderFilter
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clearSlider(name)`
  - `dragToSamePosition(name)`
  - `hoverOnHandle(name)`
  - `hoverOnLowerHandle(name)`
  - `hoverOnUpperHandle(name)`
  - `inputBoxValue(name)`
  - `lowerInput(name)`
  - `maxValue(name)`
  - `minValue(name)`
  - `moveLowerFilterHandle(filterName, position)`
  - `moveUpperFilterHandle(filterName, position)`
  - `openDropdownMenu(name)`
  - `selectedOption(name)`
  - `selectOption(name, option)`
  - `sliderTooltip()`
  - `updateLowerInput(name, value)`
  - `updateSliderInput(name, lowerValue, upperValue)`
  - `updateUpperInput(name, value)`
  - `updateValue({ filterName, valueLower, valueUpper })`
  - `upperInput(name)`
- **Related components:** getFilterContainer

### RadiobuttonFilter
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clearSearch()`
  - `clearSelection()`
  - `elementByOrder(index)`
  - `hoverOnElement(name)`
  - `isCapsuleExcluded({ filterName, capsuleName })`
  - `isCapsulePresent({ filterName, capsuleName })`
  - `isClearSearchIconPresent()`
  - `isElementPresent(name)`
  - `isElementSelected(name)`
  - `isViewSelectedPresent()`
  - `keyword()`
  - `message()`
  - `search(keyword)`
  - `selectElementByName(name)`
  - `visibleSelectedElementCount()`
- **Related components:** getFilterContainer

### SearchBoxFilter
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clearAll()`
  - `clearSearch()`
  - `clearSelection()`
  - `elementByOrder(index)`
  - `getCheckboxByName(name)`
  - `getCheckboxLabelByIndex(index)`
  - `getElementIndexInSearchResults(name)`
  - `getSearchResultsText(isWaitSearchResults = false)`
  - `hoverOnElement(name)`
  - `isCheckboxSelected(name)`
  - `isClearAllEnabled()`
  - `isElementPresent(name)`
  - `isElementSelected(name)`
  - `isEmptySearchDisplayed()`
  - `isKeepOnlyLinkDisplayed(name)`
  - `isSelectAllEnabled()`
  - `keepOnly(name)`
  - `message()`
  - `scrollFilterToBottom()`
  - `search(keyword)`
  - `searchboxPlaceholder()`
  - `searchResults()`
  - `selectAll()`
  - `selectCheckboxByName(name)`
  - `selectElementByName(name)`
  - `selectElementsByNames(names)`
  - `toggleViewSelectedOption()`
  - `toggleViewSelectedOptionOn()`
  - `visibleElementCount()`
  - `visibleSelectedElementCount()`
- **Related components:** getSecondaryPanel

### Timezone
- **CSS root:** `.mstrd-FilterItemContainer--hasDetailPanel`
- **User-visible elements:**
  - My Timezone Section (`.mstrd-TimezoneDetailsPanel-mine`)
  - Timezone Detail Panel (`.mstrd-TimezoneDetailsPanel`)
  - Timezone List (`.mstrd-FilterItemsList`)
  - Unlock Timezone Container (`.mstrd-FilterItemContainer--hasDetailPanel`)
- **Component actions:**
  - `clearSearch()`
  - `editTimezone()`
  - `firstTimezoneItemText()`
  - `getMyTimezoneText()`
  - `getTimezoneItemText()`
  - `getTimezoneNumber()`
  - `isEditButtonPresent()`
  - `isMyTimeZoneSelected()`
  - `isSearchWarningMsgPresent()`
  - `isTimezoneLocked()`
  - `openTimezoneSecondaryPanel()`
  - `search(keyword)`
  - `selectFixedTimezone(value)`
  - `selectMyTimezone()`
- **Related components:** getFilterContainer, getTimezoneContainer, getTimezoneItemContainer, getUnlockTimezoneContainer, openSecondaryPanel

### VisualizationFilter
- **CSS root:** `.mstrd-VisFilterDetailsPanel-Body`
- **User-visible elements:**
  - Clear All (`.mstrd-VisFilterHeader-ClearAll`)
  - Viz Filter Detials Body (`.mstrd-VisFilterDetailsPanel-Body`)
  - Viz Filter Header (`.mstrd-VisFilterHeader`)
  - Viz Filter Lock Message (`.mstrd-VisFilterHeader-lockedMsg`)
- **Component actions:**
  - `clearAll()`
  - `closeVizSecondaryPanel(filterName)`
  - `getVizFilterLockMessageText()`
  - `hideVizFilterDetailsBody()`
  - `isClearAllDisabled()`
  - `openVizFilterContextMenu(filterName)`
  - `openVizSecondaryPanel(filterName)`
  - `selectVizFilterContextMenuOption(filterName, menuName)`
  - `showVizFilterDetailsBody()`
  - `vizFilterHeaderSelectedInfo()`
  - `vizFilterSelectionInfo(name)`
- **Related components:** filterPanel, getSecondaryPanel, getVizFilterContainer

## Common Workflows (from spec.ts)

1. Chapter Filter (used in 2 specs)
2. Dossier level filter (used in 2 specs)
3. FirstNLastN-DisableClearing (used in 2 specs)
4. Function test for Object Parameter (used in 2 specs)
5. Lock Filter (used in 2 specs)
6. [TC18661]RA filter -- add security filter (used in 1 specs)
7. [TC56114] Validate attribute with special characters in filter panel (used in 1 specs)
8. [TC56660]Branch selection (used in 1 specs)
9. [TC56662]Single selection (used in 1 specs)
10. [TC56663]Level selection (used in 1 specs)
11. [TC56666]Level in branch (used in 1 specs)
12. [TC56667]Search (used in 1 specs)
13. [TC56668]Hierarchical Attributes with Drop-down style (used in 1 specs)
14. [TC56669]Hierarchical Attributes with Search-box style (used in 1 specs)
15. [TC56670]Full screen (used in 1 specs)
16. [TC56671]Search NDE with different tree level (used in 1 specs)
17. [TC56672] Search NDE with different key word (used in 1 specs)
18. [TC56673] Selection status update on search results (used in 1 specs)
19. [TC56677] Apply search results (used in 1 specs)
20. [TC56679] Clear search results (used in 1 specs)
21. [TC56683] Search NDE on filter panel within searchBox (used in 1 specs)
22. [TC61498] Verify calendar start week day and date format in different locale (used in 1 specs)
23. [TC61499] Verify calendar month days(espcially first day) should show completely without missing (used in 1 specs)
24. [TC63730] Validate rendering and manipulations for checkbox filter with FirstN/LastN in Library filter panel (used in 1 specs)
25. [TC63731] Validate rendering and manipulations for search box filter with FirstN/LastN in Library filter panel (used in 1 specs)
26. [TC63735] Validate rendering and manipulations for radio button filter with FirstN/LastN in Library filter panel (used in 1 specs)
27. [TC63736] Validate rendering and manipulations for dropdown filter with FirstN/LastN in Library filter panel (used in 1 specs)
28. [TC63737] Validate filter with FirstN/LastN can be passed in dossier linking in Library (used in 1 specs)
29. [TC63745] Validate rendering for in-canvas selector with FirstN/LastN in Library (used in 1 specs)
30. [TC63765] Calendar filter with time - different dynamic options (used in 1 specs)
31. [TC66180]RA filter -- GDDE (used in 1 specs)
32. [TC67833_01] Validate dossier level filter in same style can sync in Library - checkbox (used in 1 specs)
33. [TC67833_02] Validate dossier level filter in same style can sync in Library - slider (used in 1 specs)
34. [TC67833_03] Validate dossier level filter in same style can sync in Library - radio button (used in 1 specs)
35. [TC67833_04] Validate dossier level filter in same style can sync in Library - searchbox (used in 1 specs)
36. [TC67833_05] Validate dossier level filter in same style can sync in Library - dropdown (used in 1 specs)
37. [TC67833_06] Validate dossier level filter in same style can sync in Library - calendar (used in 1 specs)
38. [TC67834] Validate dossier level filter in different styles can sync in Library (used in 1 specs)
39. [TC67835] Validate dossier level filter-metric filter can sync in Library (used in 1 specs)
40. [TC67837_01] Validate dossier level filter in dynamic status(FirstN/LastN) can sync in Library - checkbox (used in 1 specs)
41. [TC67837_02] Validate dossier level filter in dynamic status(FirstN/LastN) can sync in Library - slider (used in 1 specs)
42. [TC67837_03] Validate dossier level filter in dynamic status(FirstN/LastN) can sync in Library - radio button (used in 1 specs)
43. [TC67837_04] Validate dossier level filter in dynamic status(FirstN/LastN) can sync in Library - searchbox (used in 1 specs)
44. [TC67837_05] Validate dossier level filter in dynamic status(FirstN/LastN) can sync in Library - dropdown (used in 1 specs)
45. [TC67838] Validate dossier level filter with CGB can sync in Library (used in 1 specs)
46. [TC67840] Validate dossier level filter as target filter in GDDE (used in 1 specs)
47. [TC67842] Validate dossier level filter can be added to bookmark (used in 1 specs)
48. [TC67843] Validate dossier level filter can be passed in dossier linking (used in 1 specs)
49. [TC67973] Calendar Filter - Last/next month and year on calendar header (used in 1 specs)
50. [TC67989] Calendar filter with time with exclude mode on authoring (used in 1 specs)
51. [TC67995] Validate GDDE in checkbox style can work for filter with FirstN/LastN in Library (used in 1 specs)
52. [TC68425_02] Dynamic calendar - select Last/Next weeks with time (used in 1 specs)
53. [TC68425] Calendar filter with time - Custom (used in 1 specs)
54. [TC68552_01] Validate SF with day for library consumption and authoring (used in 1 specs)
55. [TC68552_02] Validate SF with calendar for library consumption and authoring (used in 1 specs)
56. [TC68552_03] Validate SF with qualification for contains for library consumption and authoring (used in 1 specs)
57. [TC68552_04] Validate SF with qualification for between for library consumption and authoring (used in 1 specs)
58. [TC68552_05] Validate SF with AE - checkbox for library consumption and authoring (used in 1 specs)
59. [TC68552_06] Validate SF with AE - different style for library authoring (used in 1 specs)
60. [TC68552_07] Validate SF with AE - different style for library consumption (used in 1 specs)
61. [TC68705_01] Dynamic calendar - select Last/Next days (used in 1 specs)
62. [TC68705_02] Dynamic calendar - select Last/Next weeks (used in 1 specs)
63. [TC68705_03] Dynamic calendar - select Last/Next months (used in 1 specs)
64. [TC68705_04] Dynamic calendar - select Last/Next quarters (used in 1 specs)
65. [TC68705_05] Dynamic calendar - select Last/Next years (used in 1 specs)
66. [TC68715] Calendar Filter - Between from Date input format (used in 1 specs)
67. [TC68981] Error handling - Dynamic calendar - error handling when From date is later than To date (used in 1 specs)
68. [TC68983] XFunc - Calendar Filter - filter summary date selection and edit (used in 1 specs)
69. [TC68984] Dynamic calendar - select Last X days when X is different values (used in 1 specs)
70. [TC69468] Validate dossier level filter with NDE can sync in Library (used in 1 specs)
71. [TC69469] Validate dossier level filter with RA can sync in Library (used in 1 specs)
72. [TC69656] Validate rendering and manipulations for attribute slider filter with FirstN/LastN in Library filter panel (used in 1 specs)
73. [TC69658] Validate rendering and manipulations for CGB with FirstN/LastN in Library filter panel (used in 1 specs)
74. [TC69659] Validate rendering and manipulations for NDE with FirstN/LastN in Library filter panel (used in 1 specs)
75. [TC69661] Validate filter with FirstN/LastN can be added to bookmark in Library (used in 1 specs)
76. [TC69662] Validate filter with FirstN/LastN can be filtered by same attribute prompt in Library (used in 1 specs)
77. [TC69696] Validate reset button status for filter in different modes in Library filter panel (used in 1 specs)
78. [TC71553] Validate manipulations for dossier level filter can sync when chapter has server cache (used in 1 specs)
79. [TC73767]RA filter -- GDDE in NDE (used in 1 specs)
80. [TC78896_01] Validate Functionality for remove the length limit of the single element in Filter Summary - single element - short (used in 1 specs)
81. [TC78896_02] Validate Functionality for remove the length limit of the single element in Filter Summary - single element - more than 1 row but less than 3 rows (used in 1 specs)
82. [TC78896_03] Validate Functionality for remove the length limit of the single element in Filter Summary - single element - more than 3 rows (used in 1 specs)
83. [TC79287_01] Validate Functionality for remove the length limit of the single element in Filter Summary - multiElements - short+medium (used in 1 specs)
84. [TC79287_02] Validate Functionality for remove the length limit of the single element in Filter Summary - multiElements - short+long (used in 1 specs)
85. [TC79287_03] Validate Functionality for remove the length limit of the single element in Filter Summary - multiElements - medium+short (used in 1 specs)
86. [TC79287_05] Validate Functionality for remove the length limit of the single element in Filter Summary - multiElements - medium+long (used in 1 specs)
87. [TC79287_06] Validate Functionality for remove the length limit of the single element in Filter Summary - multiElements - short+medium+long (used in 1 specs)
88. [TC79306] Validate Functionality for remove the length limit of the single element in Filter Summary - RA Filter (used in 1 specs)
89. [TC80663_06] RA filter in pause mode - checkbox with manipulations (used in 1 specs)
90. [TC80663_07] RA filter in pause mode - xfunc with normal mode (used in 1 specs)
91. [TC80663_08] RA filter in pause mode - checkbox ICS (used in 1 specs)
92. [TC80914_01] [Lock Filter] Acceptance test for Disabling interactions with a filter in Library - AttributeSelector (used in 1 specs)
93. [TC80914_02] [Lock Filter] Acceptance test for Disabling interactions with a filter in Library - Calendar_SearchBox (used in 1 specs)
94. [TC80914_03] [Lock Filter] Acceptance test for Disabling interactions with a filter in Library - MetricQualification (used in 1 specs)
95. [TC80914_04] [Lock Filter] Acceptance test for Disabling interactions with a filter in Library - VizSelector (used in 1 specs)
96. [TC82211] Report filter summary - filters with scrollbar (used in 1 specs)
97. [TC83165] [Lock Filter] Validate X-func of Disabling interactions with a filter in Library - GDDE (used in 1 specs)
98. [TC83166] [Lock Filter] Validate X-func of Disabling interactions with a filter in Library - Dossier Linking (used in 1 specs)
99. [TC83167] [Lock Filter] Validate X-func of Disabling interactions with a filter in Library - Bookmark (used in 1 specs)
100. [TC833337] [Lock Filter] Validate Disabling interactions with a filter in Library - MDX (used in 1 specs)
101. [TC85147_01] Validate functionality for prevent consumers from clearing (unsetting) filters - Checkbox - in dynamic on status (used in 1 specs)
102. [TC85147_02] Validate functionality for prevent consumers from clearing (unsetting) filters - Checkbox - in static status (used in 1 specs)
103. [TC85168_01] Validate x-func for prevent consumers from clearing (unsetting) filters - Global Filter - Reset (used in 1 specs)
104. [TC85168_02] Validate x-func for prevent consumers from clearing (unsetting) filters - Global Filter - reset to dynamic (used in 1 specs)
105. [TC85295_01] Validate functionality for prevent consumers from clearing (unsetting) filters - Radio Button - in dynamic on status (used in 1 specs)
106. [TC85295_02] Validate functionality for prevent consumers from clearing (unsetting) filters - Radio Button - in static status (used in 1 specs)
107. [TC85296_01] Validate functionality for prevent consumers from clearing (unsetting) filters - searchbox - allow multi selection - in static status (used in 1 specs)
108. [TC85296_02] Validate functionality for prevent consumers from clearing (unsetting) filters - searchbox - allow multi selection - in dynamic status (used in 1 specs)
109. [TC85296_03] Validate functionality for prevent consumers from clearing (unsetting) filters - searchbox - single selection - in static status (used in 1 specs)
110. [TC85296_04] Validate functionality for prevent consumers from clearing (unsetting) filters - searchbox - single selection - in dynamic status (used in 1 specs)
111. [TC85296_05] Validate functionality for prevent consumers from clearing (unsetting) filters - searchbox - incremental search (used in 1 specs)
112. [TC85297] Validate functionality for prevent consumers from clearing (unsetting) filters - Attribute Slider (used in 1 specs)
113. [TC85298_01] Validate functionality for prevent consumers from clearing (unsetting) filters - Dropdown - multi selection (used in 1 specs)
114. [TC85298_02] Validate functionality for prevent consumers from clearing (unsetting) filters - Dropdown - single selection (used in 1 specs)
115. [TC85299] Validate UI for prevent consumers from clearing (unsetting) filters (used in 1 specs)
116. [TC85304_01] Validate functionality for prevent consumers from clearing (unsetting) filters - Reset All Filters - All filters set to dynamic and disable setting on (used in 1 specs)
117. [TC85304_02] Validate functionality for prevent consumers from clearing (unsetting) filters - Reset All Filters - Mixed dynamic on and off (used in 1 specs)
118. [TC85304_03] Validate functionality for prevent consumers from clearing (unsetting) filters - Reset All Filters - Mixed dynamic and setting mixed on and off (used in 1 specs)
119. [TC85377_01] Validate x-func for prevent consumers from clearing (unsetting) filters - Lock Filter - reset (used in 1 specs)
120. [TC85377_02] Validate x-func for prevent consumers from clearing (unsetting) filters - Lock Filter - no warning message when no selection (used in 1 specs)
121. [TC85377_03] Validate x-func for prevent consumers from clearing (unsetting) filters - Lock Filter - not reset to dynamic when apply (used in 1 specs)
122. [TC85936_01] Verify Functionality of Clear All Filters button when there is no item selected - unset (used in 1 specs)
123. [TC85936_02] Verify Functionality of Clear All Filters button when there is no item selected - not unset but has been cleared - clear in context menu (used in 1 specs)
124. [TC85936_03] Verify Functionality of Clear All Filters button when there is no item selected - not unset but has been cleared - clear selections (used in 1 specs)
125. [TC85936_04] Verify Functionality of Clear All Filters button when there is no item selected - not unset but has been cleared - clear all (used in 1 specs)
126. [TC85936_05] Verify Functionality of Clear All Filters button when there is no item selected - not unset but has been cleared - deselect (used in 1 specs)
127. [TC85936_06] Verify Functionality of Clear All Filters button - Source pass filter to target, target does not include the filter element (used in 1 specs)
128. [TC85936_07] Verify Functionality of Clear All Filters button - circular target (used in 1 specs)
129. [TC85936_08] Verify Functionality of Clear All Filters button - deselect all (used in 1 specs)
130. [TC85936_09] Verify Functionality of Clear All Filters button - intersection of prompt and filter is empty (used in 1 specs)
131. [TC85936_10] Verify Functionality of Clear All Filters button - no privilege (used in 1 specs)
132. [TC86442_01] Validate Functionality of search filter GDDE fetch Liminit - searchbox - multi select (used in 1 specs)
133. [TC86442_02] Validate Functionality of search filter GDDE fetch Liminit - searchbox - single select (used in 1 specs)
134. [TC86442_03] Validate Functionality of search filter GDDE fetch Liminit - other styles (used in 1 specs)
135. [TC86442_04] Validate GDDE for calendar as source (used in 1 specs)
136. [TC86442_05] Validate GDDE for calendar as target (used in 1 specs)
137. [TC86442_06] Validate GDDE for calendar as source on web authoring (used in 1 specs)
138. [TC86781] Report filter summary - report with attribute filters (used in 1 specs)
139. [TC86787] Report filter summary - report with metric filters (used in 1 specs)
140. [TC86794] Report filter summary - report with set filters (used in 1 specs)
141. [TC86795] Report filter summary - report with group filters (used in 1 specs)
142. [TC86796] Report filter summary - report with NOT filters (used in 1 specs)
143. [TC86797] Report filter summary - Report with Date (used in 1 specs)
144. [TC86798] Report filter summary - report with different filter types(report,custom expression, etc ) (used in 1 specs)
145. [TC86800] Report filter summary - filters with different operators (used in 1 specs)
146. [TC86801] Report filter summary - report with diffrent numbers of filters (0, 1 and N) (used in 1 specs)
147. [TC86803] Report filter summary - view more and view less (used in 1 specs)
148. [TC86804] Report filter summary - filter summary bar (used in 1 specs)
149. [TC86805_01] Report filter summary - Drill manipulation from web - Drill within (used in 1 specs)
150. [TC86805_02] Report filter summary - Drill manipulation from web - Drill out (used in 1 specs)
151. [TC86806] Report filter summary - Do Drill manipulation in library - Drill anywhere (used in 1 specs)
152. [TC86807] Report filter summary - filters with special chars (used in 1 specs)
153. [TC87434_01] Validate functionality for prevent consumers from clearing (unsetting) filters - warining message - manually removing the last selection (used in 1 specs)
154. [TC87434_02] Validate functionality for prevent consumers from clearing (unsetting) filters - warining message - initial rendering (used in 1 specs)
155. [TC87434_03] Validate functionality for prevent consumers from clearing (unsetting) filters - warining message - set target searchbox filter to dynamic (used in 1 specs)
156. [TC87435_01] Validate functionality for prevent consumers from clearing (unsetting) filters - reset target filter when current selection is excluded by the parents new selection (used in 1 specs)
157. [TC87435_02] Validate functionality for prevent consumers from clearing (unsetting) filters - reset target filter when current selection is excluded by the parents new selection (used in 1 specs)
158. [TC87516] Report filter - attribute filter - qualify on elements: search and select (used in 1 specs)
159. [TC87517] Report filter - attribute filter - qualify on elements: select in view, clear all (used in 1 specs)
160. [TC87518] Report filter - attribute filter - qualify on elements: In list (used in 1 specs)
161. [TC87519] Report filter - attribute filter - qualify on elements: Not In list (used in 1 specs)
162. [TC87521] Report filter - attribute filter - qualify on attribute form (used in 1 specs)
163. [TC87613] Report filter - metric filter - function by metric value (used in 1 specs)
164. [TC87614] Report filter - metric filter - function by rank (used in 1 specs)
165. [TC87615] Report filter - metric filter - function by percentage (used in 1 specs)
166. [TC87624] Report filter - set filter - related by system default (used in 1 specs)
167. [TC87625] Report filter - set filter - set filter when related by metric (used in 1 specs)
168. [TC87656] Validate x-func for prevent consumers from clearing (unsetting) filters - Custom Group and Consolidation (used in 1 specs)
169. [TC87690] Report filter - edit filter - edit attribute filter (used in 1 specs)
170. [TC87691] Report filter - edit filter - edit metric filter (used in 1 specs)
171. [TC87692] Report filter - edit filter - edit set filter (used in 1 specs)
172. [TC87760] Report fitler - group - group qualificaiton filter (used in 1 specs)
173. [TC87761] Report fitler - group - group set filter (used in 1 specs)
174. [TC87762] Report filter - group - change group relationship( And, Or, Not) (used in 1 specs)
175. [TC87763] Report filter - group - NOT a single filter (used in 1 specs)
176. [TC87764] Report filter - group - NOT a group filter (used in 1 specs)
177. [TC87765] Report filter - group - group for aggregation filter (used in 1 specs)
178. [TC87787] Report filter - setting - use as aggregation filter (used in 1 specs)
179. [TC87788] Report filter - setting - use as view filter (used in 1 specs)
180. [TC87789] Report filter - setting - advanced (used in 1 specs)
181. [TC87790] Report filter - setting - delete (used in 1 specs)
182. [TC87791] Report filter - setting - add qualificaiton (used in 1 specs)
183. [TC87792] Report filter - setting - remove set (used in 1 specs)
184. [TC87793] Report filter - setting - remove all filters (used in 1 specs)
185. [TC87794] Report filter - setting - hide filter summary (used in 1 specs)
186. [TC87795] Report filter - setting - pin and unpin filter panel (used in 1 specs)
187. [TC87866] Report filter - filter panel - filter panel render under 0,1, N filter (used in 1 specs)
188. [TC87867] Report filter - filter panel - filter panel interact with filter summary (used in 1 specs)
189. [TC87873] Report filter - filter panel - apply filter with valid and invalid filter (used in 1 specs)
190. [TC87874] Report filter - filter panel - user without priviledge is not able to see filter panel (used in 1 specs)
191. [TC87875] Report filter - setting - edit (used in 1 specs)
192. [TC87876] Report filter - setting - setting for empty expression (used in 1 specs)
193. [TC87877] Report filter - pin - new and edit filter (used in 1 specs)
194. [TC87878] Report filter - pin - large filters (under pin and unpin) (used in 1 specs)
195. [TC87879] Report filter - edit filter - inline edit filter (used in 1 specs)
196. [TC88124] Report filter summary - All kinds of normal prompt display (used in 1 specs)
197. [TC88127] Report filter summary - value prompt display (used in 1 specs)
198. [TC88128] Report filter summary - prompt in prompt display (used in 1 specs)
199. [TC88129] Report filter - date - select static day (used in 1 specs)
200. [TC88130] Report filter - date - select dynamic day (used in 1 specs)
201. [TC88134] Report filter - date - select static hour (used in 1 specs)
202. [TC88135] Report filter - date - select dynamic hour (used in 1 specs)
203. [TC88136] Report filter - operator - list of values for In/Not in (used in 1 specs)
204. [TC90698] Report filter - I18N - Attribute (used in 1 specs)
205. [TC90699] Report filter - I18N - Metric (used in 1 specs)
206. [TC92779] Mandatory Filters - Mobile Dossier Consumption (used in 1 specs)
207. [TC92783] Mandatory Filters - Internationalization (used in 1 specs)
208. [TC92785_01] Validate functionality for mandatory filter - warning message - manually removing the last selection (used in 1 specs)
209. [TC92785_02] Validate functionality for mandatory filter - warning message - initial rendering (used in 1 specs)
210. [TC92785_03] Validate functionality for mandatory filter - gdde (used in 1 specs)
211. [TC92785_06] Validate functionality for mandatory filter - mixed setting on and off (used in 1 specs)
212. [TC92785_07] Validate UI for mandatory filter (used in 1 specs)
213. [TC94425_0] Create dashboard with dataset and search filter, save dashboard. (used in 1 specs)
214. [TC94425_1] Open a dashboard with search box filter applied. (used in 1 specs)
215. [TC94425_2] Open filter panel, click on the filter, search for a two-word phrase. (used in 1 specs)
216. [TC95091_0] Create dashboard with dataset and search filter (used in 1 specs)
217. [TC95091_1] Test search behaviour in filter panel (used in 1 specs)
218. [TC95091_2] Test search behaviour in canvas (used in 1 specs)
219. [TC95091_3] Save and reopen a dashboard with search box filter applied. (used in 1 specs)
220. [TC95091_4] Test search behaviour in canvas in consumption (used in 1 specs)
221. [TC97406_01] Validate x-func for mandatory filter - Global Filter (used in 1 specs)
222. [TC97406_02] Validate x-func for mandatory filter - Lock Filter (used in 1 specs)
223. [TC97406_03] Validate x-func for mandatory filter - Custom Group and Consolidation (used in 1 specs)
224. [TC99017] ACC | Adding attributes to the filter panel from Consumption (used in 1 specs)
225. [TC99124_01] Verify Functionality of Multi Select Option - Normal Grid (used in 1 specs)
226. [TC99124_02] Verify Functionality of Multi Select Option - Compound Grid (used in 1 specs)
227. [TC99124_03] Verify Functionality of Multi Select Option - Modern Grid (used in 1 specs)
228. [TC99124_04] Verify Functionality of Multi Select Option - UndoRedo (used in 1 specs)
229. [TC99124_05] Verify Functionality of Multi Select Option - Object Parameter (used in 1 specs)
230. [TC99124_06] Verify Functionality of Multi Select Option - Mobile View (used in 1 specs)
231. [TC99133_01] Verify Functionality of Parameter Entry - Create Parameter (used in 1 specs)
232. [TC99133_02] Verify Functionality of Parameter Entry - Keep Changes Locale (used in 1 specs)
233. [TC99162] Verify Functionality of URL API pass Object Parameter (used in 1 specs)
234. [TC99357_01] Verify Functionality of Object Parameter Editor - Create Dataset Object Parameter (used in 1 specs)
235. [TC99357_02] Verify Functionality of Object Parameter Editor - Search (used in 1 specs)
236. [TC99357_03] Verify Functionality of Object Parameter Editor - Edit Dataset Object Parameter (used in 1 specs)
237. [TC99357_04] Verify Functionality of Object Parameter Editor - Create Dashboard Object Parameter (used in 1 specs)
238. [TC99357_05] Verify Functionality of Object Parameter Editor - Edit Dashboard Object Parameter (used in 1 specs)
239. [TC99357_06] With object parameter added to grid, cannot change title and container formattings (used in 1 specs)
240. [TC99381_01] Verify Functionality of Object Parameter in Consumption - Incanvas Selector (used in 1 specs)
241. [TC99381_02] Verify Functionality of Object Parameter in Consumption - Filter Panel (used in 1 specs)
242. [TC99381_03] Verify Functionality of Object Parameter in Consumption - Add the newly added objects into filter panel (used in 1 specs)
243. [TC99381_04] Verify Functionality of Object Parameter in Consumption - Sort on Attribute OP in Modern Grid (used in 1 specs)
244. [TC99381_05] Verify Functionality of Object Parameter in Consumption - Sort on Metric OP in Modern Grid (used in 1 specs)
245. [TC99381_06] Verify Functionality of Object Parameter in Consumption - Show Data (used in 1 specs)
246. [TC99381_07] Verify Functionality of Object Parameter in Consumption - Replace With (used in 1 specs)
247. [TC99386_01] DE327242 Unspecified error when opening dashboard in Library after upgrade (used in 1 specs)
248. [TC99386_02] DE323056 Cannot search for multiple items separated by a blank space after migrating to MicroStrategy ONE (December 2024). (used in 1 specs)
249. [TC99448_01] Verify E2E workflow of Dashboard Dynamic Object Parameter - Authoring (used in 1 specs)
250. [TC99448_02] Verify E2E workflow of Dataset Dynamic Object Parameter - Authoring (used in 1 specs)
251. [TC99448_03] Verify E2E workflow of Dashboard Dynamic Object Parameter - Consumption (used in 1 specs)
252. [TC99448_04] Verify E2E workflow of Dataset Dynamic Object Parameter - Consumption (used in 1 specs)
253. [TC99448_05] Verify FUN of Dashboard Dynamic Object Parameter - Authoring (used in 1 specs)
254. [TC99448_06] Verify FUN of Dataset Dynamic Object Parameter - Authoring (used in 1 specs)
255. [TC99448_07] Verify the FUN for Dynamic Object Parameter - Defect Automation in Authoring (used in 1 specs)
256. [TC99448_08] Verify the FUN for Dynamic Object Parameter - Defect Automation in Consumption (used in 1 specs)
257. [TC99552_01] Attribute Element - default selections by exclude (used in 1 specs)
258. [TC99552_02] Attribute Element - update editable scope filter on consumption (used in 1 specs)
259. [TC99552_03] Attribute Element - check default filter summary (used in 1 specs)
260. [TC99552_04] Attribute Element - update filter and verify in filter summary (used in 1 specs)
261. [TC99552_05] Attribute Element - incremental fetch in element list (used in 1 specs)
262. [TC99552_06] Attribute Element - ready only filter (used in 1 specs)
263. [TC99552_07] Attribute Element - hidden filter (used in 1 specs)
264. [TC99552_08] check scope filter tooltip (used in 1 specs)
265. [TC99553_01] Scope filter - Attribute Qualification - default selections contains and not contains (used in 1 specs)
266. [TC99553_02] Attribute Qualification - update AQ desc contains (used in 1 specs)
267. [TC99553_03] Attribute Qualification - update AQ not contains and check filter summary (used in 1 specs)
268. [TC99553_04] Attribute Qualification - id form not in (used in 1 specs)
269. [TC99553_05] Attribute Qualification - update from filter summary (used in 1 specs)
270. [TC99553_06] Attribute Qualification - operator is equal (used in 1 specs)
271. [TC99553_07] Attribute Qualification - update filter for equals by id and check filter summary (used in 1 specs)
272. [TC99553_08] Attribute Qualification - operator is between for DESC form (used in 1 specs)
273. [TC99553_09] Attribute Qualification - update filter for between by desc and check filter summary (used in 1 specs)
274. [TC99553_10] Attribute Qualification - operator is contains (used in 1 specs)
275. [TC99553_11] Attribute Qualification - update filter for contains by desc and check filter summary (used in 1 specs)
276. [TC99553_12] Attribute Qualification - operator is greater than (used in 1 specs)
277. [TC99554_01] Scope filter - Attribute Qualification - default selections for calendar (used in 1 specs)
278. [TC99554_02] Scope filter - Attribute Qualification - operator is greater than (used in 1 specs)
279. [TC99554_03] Scope filter - Attribute Qualification - available operators (used in 1 specs)
280. [TC99554_04] Scope filter - Attribute Qualification - change operator to less than (used in 1 specs)
281. [TC99554_05] Scope filter - Attribute Qualification - change month by date time picker (used in 1 specs)
282. [TC99554_06] Scope filter - Attribute Qualification - set dynamic date to today (used in 1 specs)
283. [TC99554_07] Scope filter - Attribute Qualification - set dynamic date to today + 100 (used in 1 specs)
284. [TC99554_08] Scope filter - Attribute Qualification - edit from filter summary (used in 1 specs)
285. [TC99554_09] Scope filter - Attribute Qualification - operator is between (used in 1 specs)
286. [TC99643_01] Scope filter - switch to design mode (used in 1 specs)
287. [TC99643_02] Scope filter - show scope filter after execute report (used in 1 specs)
288. [TC99643_03] Scope filter - AE - default selection (used in 1 specs)
289. [TC99643_04] Scope filter - AE - update filter (used in 1 specs)
290. [TC99643_05] Scope filter - AE - warning when no selection (used in 1 specs)
291. [TC99643_06] Scope filter - AQ - update filter by operator is contains (used in 1 specs)
292. [TC99643_07] Scope filter - AE - ready only (used in 1 specs)
293. [TC99643_08] Scope filter - remove from dropzone (used in 1 specs)
294. [TC99643_09] Scope filter - remove from dataset (used in 1 specs)
295. Allow users to add their own filters on-the-fly while consuming dashboards without having to access the editor (used in 1 specs)
296. Checkbox Filter (used in 1 specs)
297. Dynamic Calendar Filter (used in 1 specs)
298. Dynamic Filter (used in 1 specs)
299. E2E test for Dynamic Object Parameter (used in 1 specs)
300. Filter - Clear All Filters (used in 1 specs)
301. Filter Panel Customer Issue RCA (used in 1 specs)
302. Filter Summary (used in 1 specs)
303. FirstNLastN-Checkbox (used in 1 specs)
304. FirstNLastN-DisableClearing-XFunc (used in 1 specs)
305. FirstNLastN-dropdown (used in 1 specs)
306. FirstNLastN-radio button (used in 1 specs)
307. FirstNLastN-searchbox (used in 1 specs)
308. FirstNLastN-slider (used in 1 specs)
309. Function test for Multi Select Option (used in 1 specs)
310. Function test for Parameter Create Entry (used in 1 specs)
311. Functionality test for GDDE Limit (used in 1 specs)
312. Library Report Filter Summary - Drill (used in 1 specs)
313. Library Report Filter Summary - Prompt (used in 1 specs)
314. Library Report Filter Summary - report filter (used in 1 specs)
315. Library Report View Filter - Filters (used in 1 specs)
316. Library Report View Filter - Group (used in 1 specs)
317. Library Report View Filter - Setting (used in 1 specs)
318. Mandatory Filter (used in 1 specs)
319. Mandatory Filter - XFunc (used in 1 specs)
320. MDX Filter - pause mode (used in 1 specs)
321. Scope Filter - Attribute element list (used in 1 specs)
322. Scope Filter - Attribute element qualification (used in 1 specs)
323. Scope Filter - authoring (used in 1 specs)
324. Scope Filter - Date time (used in 1 specs)
325. ScopeFilter (used in 1 specs)
326. Search on NDE (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. {actual} -- frequency: 370
2. {expected} -- frequency: 368
3. getOneRowData -- frequency: 76
4. getReportFilterRowValue -- frequency: 53
5. getMainPanel -- frequency: 43
6. getSummaryBarText -- frequency: 40
7. getViewFilterCount -- frequency: 39
8. getFilterPanelWrapper -- frequency: 38
9. getGridCellText -- frequency: 38
10. getDossierView -- frequency: 34
11. getText -- frequency: 28
12. getFilterPanelDropdown -- frequency: 25
13. getDetailedPanel -- frequency: 24
14. getExpressionGroupCount -- frequency: 23
15. getSecondaryFilterPanel -- frequency: 22
16. getSuggestionListItems -- frequency: 22
17. getRowsCount -- frequency: 21
18. getViewFilterRowValue -- frequency: 21
19. getAggregationFilterCount -- frequency: 18
20. getPromptByName -- frequency: 17
21. getSecondaryPanel -- frequency: 17
22. getSummaryContainer -- frequency: 15
23. getNOTCount -- frequency: 14
24. getFilterPanel -- frequency: 12
25. getFilterSummary -- frequency: 12
26. getItemSelectedStatus -- frequency: 12
27. getTitle -- frequency: 12
28. getElementListCount -- frequency: 11
29. getFilterContextMenuOption -- frequency: 10
30. getDynamicModeDropdown -- frequency: 9
31. getFilterSummaryPanel -- frequency: 9
32. getSelectedDynamicOption -- frequency: 9
33. getContainer -- frequency: 8
34. getDateTimePicker -- frequency: 8
35. getDynamicSelectionMenu -- frequency: 8
36. getOptionItemsCount -- frequency: 8
37. getReportFooter -- frequency: 8
38. getSelectedOperator -- frequency: 8
39. getContextMenu -- frequency: 7
40. getGroupActionLinkCount -- frequency: 7
41. getInputDate -- frequency: 7
42. getAddDataList -- frequency: 6
43. getOperatorText -- frequency: 6
44. getReportFilterSetValue -- frequency: 6
45. getSetText -- frequency: 6
46. getSliderMenuContainer -- frequency: 6
47. getCustomContainer -- frequency: 5
48. getDynamicModeOkButton -- frequency: 5
49. getDynamicModeOption -- frequency: 5
50. getFilterMainPanel -- frequency: 5
51. getFilterPanelItem -- frequency: 5
52. getFilterWarningMessage -- frequency: 5
53. getFilterWarningText -- frequency: 5
54. getInCanvasFilterContainer -- frequency: 5
55. getNewResolvedDateInDynamicCalendar -- frequency: 5
56. getSelectedItemsText -- frequency: 5
57. getSortBySelectedText -- frequency: 5
58. getSummarySection -- frequency: 5
59. getAttributeElementFilterSubpanel -- frequency: 4
60. getBaseOnText -- frequency: 4
61. getDynamicModeQuantityInput -- frequency: 4
62. getDynamicSelectionDropdownList -- frequency: 4
63. getFilterLabelName -- frequency: 4
64. getGroupOperatorCount -- frequency: 4
65. getHeaderText -- frequency: 4
66. getSelectedForm -- frequency: 4
67. getSelectedRelatedBy -- frequency: 4
68. getSetPopover -- frequency: 4
69. getSummaryPanel -- frequency: 4
70. getThreeDotsButtonInFilterInCanvas -- frequency: 4
71. getTooltipText -- frequency: 4
72. getValidationText -- frequency: 4
73. getDynamicIcon -- frequency: 3
74. getEmptySearchImage -- frequency: 3
75. getFilterDetailsPanel -- frequency: 3
76. getFilterDisabledMessageText -- frequency: 3
77. getHeadersInshowDataGrid -- frequency: 3
78. getOpenedSelectionList -- frequency: 3
79. getPanelWidth -- frequency: 3
80. getSelectedBreakBy -- frequency: 3
81. getSelectedCartItemCount -- frequency: 3
82. getSelectedSetOf -- frequency: 3
83. getSummaryBar -- frequency: 3
84. getVizFilterLockMessageText -- frequency: 3
85. .. -- frequency: 2
86. getAddFilterMenu -- frequency: 2
87. getAttributeOptionCount -- frequency: 2
88. getClipboardText -- frequency: 2
89. getContextMenuOption -- frequency: 2
90. getCurrentInputText -- frequency: 2
91. getDynamicOnIcon -- frequency: 2
92. getFilterContextMenuButton -- frequency: 2
93. getFilterIcon -- frequency: 2
94. getI18NFormattedDate -- frequency: 2
95. getItemsText -- frequency: 2
96. getOneColumnData -- frequency: 2
97. getSelectedFunction -- frequency: 2
98. getTimeValue -- frequency: 2
99. C1292 F -- frequency: 1
100. Clear All -- frequency: 1
101. Clear Search Icon -- frequency: 1
102. Clear Selection -- frequency: 1
103. Current Search Level -- frequency: 1
104. Custom Operator Time Input -- frequency: 1
105. Date Input Box -- frequency: 1
106. Dynamic Date Context Menu -- frequency: 1
107. Expanded Filter Summary Items -- frequency: 1
108. Filter Bar Item -- frequency: 1
109. Filter Item List -- frequency: 1
110. Filter Search Box -- frequency: 1
111. Filter Summary Bar -- frequency: 1
112. Filter Summary Bar Container -- frequency: 1
113. Filter Summary Bar No Filter Label -- frequency: 1
114. Filter Summary Panel -- frequency: 1
115. getAllItemsInSearchResults -- frequency: 1
116. getCSSProperty -- frequency: 1
117. getDatasetDialog -- frequency: 1
118. getDatasetsPanel -- frequency: 1
119. getDateTimeInputValue -- frequency: 1
120. getDateTimePickerIcon -- frequency: 1
121. getDescriptionTooltipText -- frequency: 1
122. getDynamicDateTimePicker -- frequency: 1
123. getElementCountByType -- frequency: 1
124. getFilterDateRangeWarning -- frequency: 1
125. getFilterMenu -- frequency: 1
126. getFromDate -- frequency: 1
127. getGroupOperatorItemCount -- frequency: 1
128. getNotCount -- frequency: 1
129. getOneRowInGrid -- frequency: 1
130. getOperatorDropdown -- frequency: 1
131. getParameterSelectorContainerUsingId -- frequency: 1
132. getScopeFilterInfoMessage -- frequency: 1
133. getSelectedItemsInLevelDropdown -- frequency: 1
134. getSelectedItemsInSearchResults -- frequency: 1
135. getSortByListItemsCount -- frequency: 1
136. getVisualizationTitleBarRoot -- frequency: 1
137. getVizFilterHeader -- frequency: 1
138. Header Container -- frequency: 1
139. Hierarchy Checkbox Spinner -- frequency: 1
140. Last Next Context Menu Container -- frequency: 1
141. Level Icon -- frequency: 1
142. Level List -- frequency: 1
143. Level Selection Dropdown -- frequency: 1
144. Locked Level Icon -- frequency: 1
145. Locked Secondary Panel -- frequency: 1
146. My Timezone Section -- frequency: 1
147. Timezone Detail Panel -- frequency: 1
148. Timezone List -- frequency: 1
149. Unlock Timezone Container -- frequency: 1
150. View All Button -- frequency: 1
151. View Less Button -- frequency: 1
152. Viz Filter Detials Body -- frequency: 1
153. Viz Filter Header -- frequency: 1
154. Viz Filter Lock Message -- frequency: 1
155. Widget Container -- frequency: 1
156. Widget Day Of From -- frequency: 1
157. Widget Day Of To -- frequency: 1
158. Widget Day Selected -- frequency: 1

## Key Actions

- `openFilterPanel()` -- used in 324 specs
- `apply()` -- used in 229 specs
- `openSecondaryPanel(filterName)` -- used in 203 specs
- `openPageFromTocMenu()` -- used in 200 specs
- `openDossier()` -- used in 161 specs
- `filterSelectionInfo()` -- used in 152 specs
- `filterItems(name, index = 0)` -- used in 123 specs
- `selectElementByName(name)` -- used in 100 specs
- `open()` -- used in 97 specs
- `selectContextMenuOption()` -- used in 79 specs
- `waitForReportLoading()` -- used in 78 specs
- `getOneRowData()` -- used in 76 specs
- `openContextMenu()` -- used in 75 specs
- `isFooterButtonDisabled()` -- used in 74 specs
- `getText()` -- used in 62 specs
- `getReportFilterRowValue()` -- used in 53 specs
- `goToLibrary()` -- used in 51 specs
- `isWarningMessagePresent()` -- used in 48 specs
- `close()` -- used in 47 specs
- `login()` -- used in 45 specs
- `search(keyword)` -- used in 45 specs
- `getMainPanel()` -- used in 43 specs
- `filterSummaryText()` -- used in 42 specs
- `isFilterItemLocked()` -- used in 41 specs
- `getSummaryBarText()` -- used in 40 specs
- `viewAll()` -- used in 40 specs
- `getViewFilterCount()` -- used in 39 specs
- `applyAndReopenPanel()` -- used in 38 specs
- `getFilterPanelWrapper()` -- used in 38 specs
- `getGridCellText()` -- used in 38 specs
- `capsuleDateTime(filterName)` -- used in 36 specs
- `isContextMenuOptionPresent()` -- used in 36 specs
- `customCredentials()` -- used in 34 specs
- `getDossierView()` -- used in 34 specs
- `selectExpressionContextMenu()` -- used in 34 specs
- `switchToFilterPanel()` -- used in 33 specs
- `waitForAuthoringPageLoading()` -- used in 32 specs
- `clearSearch()` -- used in 30 specs
- `selectDynamicOption(radio)` -- used in 30 specs
- `openReportByUrl()` -- used in 29 specs
- `isFilterDisplayedInFilterPanel()` -- used in 27 specs
- `waitForViewFilterPanelLoading()` -- used in 26 specs
- `clearFilter()` -- used in 25 specs
- `filterSummaryBarText()` -- used in 25 specs
- `getFilterPanelDropdown()` -- used in 25 specs
- `sleep()` -- used in 25 specs
- `getDetailedPanel()` -- used in 24 specs
- `removeCapsuleByName()` -- used in 24 specs
- `selectDynamicDateOptions(name)` -- used in 24 specs
- `clickDoneButtonInDynamicCalendar()` -- used in 23 specs
- `done()` -- used in 23 specs
- `getExpressionGroupCount()` -- used in 23 specs
- `selectDay()` -- used in 23 specs
- `createByTitle()` -- used in 22 specs
- `getSecondaryFilterPanel()` -- used in 22 specs
- `getSuggestionListItems()` -- used in 22 specs
- `isAgGridCellHasTextDisplayed()` -- used in 22 specs
- `openCustomOperatorDatePicker()` -- used in 22 specs
- `displayTextOfTo()` -- used in 21 specs
- `getRowsCount()` -- used in 21 specs
- `getViewFilterRowValue()` -- used in 21 specs
- `displayTextOfFrom()` -- used in 20 specs
- `enterValue()` -- used in 20 specs
- `findInlineFilterItem()` -- used in 20 specs
- `toggleDynamicCalendar()` -- used in 20 specs
- `selectItemByText()` -- used in 19 specs
- `capsuleCount(filterName)` -- used in 18 specs
- `clickFooterButton()` -- used in 18 specs
- `getAggregationFilterCount()` -- used in 18 specs
- `goToPage()` -- used in 18 specs
- `isAttributeDisplayedInAddFilter()` -- used in 18 specs
- `selectGridContextMenuOption()` -- used in 18 specs
- `selectYearAndMonth()` -- used in 18 specs
- `waitForCurtainDisappear()` -- used in 18 specs
- `clickMenuOptions()` -- used in 17 specs
- `getPromptByName()` -- used in 17 specs
- `getSecondaryPanel()` -- used in 17 specs
- `selectItem()` -- used in 17 specs
- `clickBranchSelectionButton(name)` -- used in 16 specs
- `filterPanelItems(name, index = 0)` -- used in 16 specs
- `isApplyEnabled()` -- used in 16 specs
- `isCapsuleDynamic(filterName)` -- used in 16 specs
- `setTimeInputValue({ operator = 'Between', ele = 'from', timeValue })` -- used in 16 specs
- `viewAllFilterItems()` -- used in 16 specs
- `getSummaryContainer()` -- used in 15 specs
- `isContextMenuDotsPresent()` -- used in 15 specs
- `openGridElmContextMenu()` -- used in 15 specs
- `getNOTCount()` -- used in 14 specs
- `isSelected(name)` -- used in 14 specs
- `isVizEmpty()` -- used in 14 specs
- `openSelector()` -- used in 14 specs
- `displayTextOfCustomFrom()` -- used in 13 specs
- `displayTextOfCustomTo()` -- used in 13 specs
- `editDossierWithPageKeyByUrl()` -- used in 13 specs
- `expandElement(name)` -- used in 13 specs
- `filterSummaryBoxValue()` -- used in 13 specs
- `openToDatePicker()` -- used in 13 specs
- `selectAll()` -- used in 13 specs
- `setLastNextRelativeRange({ prefix, value, unit, expectedValue })` -- used in 13 specs
- `waitForGDDE()` -- used in 13 specs
- `applyButtonEnabled()` -- used in 12 specs
- `checkPresenceOfDynamicSelIcon()` -- used in 12 specs
- `clickBasedOn()` -- used in 12 specs
- `clickParameterEditorButton()` -- used in 12 specs
- `create()` -- used in 12 specs
- `displayTextOfCustomOperator()` -- used in 12 specs
- `getFilterPanel()` -- used in 12 specs
- `getFilterSummary()` -- used in 12 specs
- `getItemSelectedStatus()` -- used in 12 specs
- `getTitle()` -- used in 12 specs
- `isFooterButtonPresent()` -- used in 12 specs
- `selectBasedOnObject()` -- used in 12 specs
- `setFilterToAQSelectorContainer()` -- used in 12 specs
- `getElementListCount()` -- used in 11 specs
- `openFilterByHeader()` -- used in 11 specs
- `openFromDatePicker()` -- used in 11 specs
- `run()` -- used in 11 specs
- `searchByEnter(text)` -- used in 11 specs
- `selectedResultCount()` -- used in 11 specs
- `selectOption(name, option)` -- used in 11 specs
- `toggleViewSelected()` -- used in 11 specs
- `clickAddFilterButton()` -- used in 10 specs
- `clickLevelIcon()` -- used in 10 specs
- `getFilterContextMenuOption()` -- used in 10 specs
- `goBackFromDossierLink()` -- used in 10 specs
- `isElementSelected(name)` -- used in 10 specs
- `selectExpression()` -- used in 10 specs
- `setOffsetInDynamicCalendar()` -- used in 10 specs
- `toggleViewSelectedOptionOn()` -- used in 10 specs
- `waitForDossierLoading()` -- used in 10 specs
- `clickApplyButton()` -- used in 9 specs
- `closeFilterPanelByCloseIcon()` -- used in 9 specs
- `collapseFilter()` -- used in 9 specs
- `edit()` -- used in 9 specs
- `editDossierFromLibrary()` -- used in 9 specs
- `editReportByUrl()` -- used in 9 specs
- `expandFilter()` -- used in 9 specs
- `filterContainers()` -- used in 9 specs
- `getDynamicModeDropdown()` -- used in 9 specs
- `getFilterSummaryPanel()` -- used in 9 specs
- `getSelectedDynamicOption()` -- used in 9 specs
- `openDateTimePicker()` -- used in 9 specs
- `searchResultCount()` -- used in 9 specs
- `selectItemWithExactName()` -- used in 9 specs
- `setOffsetByInputValueInDynamicCalendar()` -- used in 9 specs
- `switchToDesignMode()` -- used in 9 specs
- `addSingle()` -- used in 8 specs
- `checkExcludeWeekendsInDynamicCalendar()` -- used in 8 specs
- `clickElmInAvailableList()` -- used in 8 specs
- `doneButtonEnabled()` -- used in 8 specs
- `getContainer()` -- used in 8 specs
- `getDateTimePicker()` -- used in 8 specs
- `getDynamicSelectionMenu()` -- used in 8 specs
- `getOptionItemsCount()` -- used in 8 specs
- `getReportFooter()` -- used in 8 specs
- `getSelectedOperator()` -- used in 8 specs
- `isCapsulePresent({ filterName, capsuleName })` -- used in 8 specs
- `isDisplayed()` -- used in 8 specs
- `linkToTargetByGridContextMenu()` -- used in 8 specs
- `openDefaultApp()` -- used in 8 specs
- `selectAttributeElements()` -- used in 8 specs
- `selectFilterPanelFilterCheckboxOption()` -- used in 8 specs
- `selectObjectType()` -- used in 8 specs
- `updateValue({ filterName, valueLower, valueUpper })` -- used in 8 specs
- `clearAll()` -- used in 7 specs
- `clickFilterByName()` -- used in 7 specs
- `clickFilterHeader()` -- used in 7 specs
- `clickSelectButton()` -- used in 7 specs
- `clickSelectFromBtn()` -- used in 7 specs
- `closeFilterPanel()` -- used in 7 specs
- `getContextMenu()` -- used in 7 specs
- `getGroupActionLinkCount()` -- used in 7 specs
- `getInputDate()` -- used in 7 specs
- `isAttrFilterDetailsPanelLocked()` -- used in 7 specs
- `keepOnly(name)` -- used in 7 specs
- `rightClickAttributeMetric()` -- used in 7 specs
- `selectLevelByName(name)` -- used in 7 specs
- `selectOptionInMenu()` -- used in 7 specs
- `uncheckElementByName(name)` -- used in 7 specs
- `actionOnToolbar()` -- used in 6 specs
- `checkAdjustmentInDynamicCalendar()` -- used in 6 specs
- `clickButtonFromToolbar()` -- used in 6 specs
- `clickCheckboxByName()` -- used in 6 specs
- `clickFilterContextMenuOption()` -- used in 6 specs
- `clickUpdateDatasetBtn()` -- used in 6 specs
- `closeSelector()` -- used in 6 specs
- `collapseViewAllItems()` -- used in 6 specs
- `dragAndDropSelectedItem()` -- used in 6 specs
- `findSelectorByName()` -- used in 6 specs
- `getAddDataList()` -- used in 6 specs
- `getOperatorText()` -- used in 6 specs
- `getReportFilterSetValue()` -- used in 6 specs
- `getSetText()` -- used in 6 specs
- `getSliderMenuContainer()` -- used in 6 specs
- `hoverMouseOnElement()` -- used in 6 specs
- `inputValueDirectly()` -- used in 6 specs
- `isDetailedPanelPresent()` -- used in 6 specs
- `isGlobalFilterIconExist()` -- used in 6 specs
- `isResetAllFiltersButtonDisabled()` -- used in 6 specs
- `isResetOptionPresent()` -- used in 6 specs
- `log()` -- used in 6 specs
- `openFolder()` -- used in 6 specs
- `resetAllFilters()` -- used in 6 specs
- `selectFilterItems()` -- used in 6 specs
- `setCustomOperatorInput(value)` -- used in 6 specs
- `waitForElementListLoading()` -- used in 6 specs
- `clickCreateObjectsBtn()` -- used in 5 specs
- `clickDatasetMenuIcon()` -- used in 5 specs
- `clickLevelInBranchButton(name)` -- used in 5 specs
- `clickSettingIcon()` -- used in 5 specs
- `expandItemsByText()` -- used in 5 specs
- `getAttribute()` -- used in 5 specs
- `getCustomContainer()` -- used in 5 specs
- `getDynamicModeOkButton()` -- used in 5 specs
- `getDynamicModeOption()` -- used in 5 specs
- `getFilterMainPanel()` -- used in 5 specs
- `getFilterPanelItem()` -- used in 5 specs
- `getFilterWarningMessage()` -- used in 5 specs
- `getFilterWarningText()` -- used in 5 specs
- `getInCanvasFilterContainer()` -- used in 5 specs
- `getNewResolvedDateInDynamicCalendar()` -- used in 5 specs
- `getSelectedItemsText()` -- used in 5 specs
- `getSortBySelectedText()` -- used in 5 specs
- `getSummarySection()` -- used in 5 specs
- `hoverFilterByName()` -- used in 5 specs
- `inlineEnterValue()` -- used in 5 specs
- `isTruncateDotsPresent(name)` -- used in 5 specs
- `openMenu()` -- used in 5 specs
- `save()` -- used in 5 specs
- `selectDynamicSelectionMode()` -- used in 5 specs
- `selectElementsByNames(names)` -- used in 5 specs
- `selectNthSearchLevel(n)` -- used in 5 specs
- `selectSetting()` -- used in 5 specs
- `singleDeselectElement(name)` -- used in 5 specs
- `waitForEditor()` -- used in 5 specs
- `addElementToDataset()` -- used in 4 specs
- `applyBookmark()` -- used in 4 specs
- `applyFilter()` -- used in 4 specs
- `clearAllFilters()` -- used in 4 specs
- `clearAndInputAndWaitForFirstSuggestion()` -- used in 4 specs
- `clearAndInputText()` -- used in 4 specs
- `clickAddFilterMenuButton()` -- used in 4 specs
- `clickOptionInMobileView()` -- used in 4 specs
- `clickUndo()` -- used in 4 specs
- `closeHamburgerMenu()` -- used in 4 specs
- `editObject()` -- used in 4 specs
- `execute()` -- used in 4 specs
- `getAttributeElementFilterSubpanel()` -- used in 4 specs
- `getBaseOnText()` -- used in 4 specs
- `getDynamicModeQuantityInput()` -- used in 4 specs
- `getDynamicSelectionDropdownList()` -- used in 4 specs
- `getFilterLabelName()` -- used in 4 specs
- `getGroupOperatorCount()` -- used in 4 specs
- `getHeaderText()` -- used in 4 specs
- `getSelectedForm()` -- used in 4 specs
- `getSelectedRelatedBy()` -- used in 4 specs
- `getSetPopover()` -- used in 4 specs
- `getSummaryPanel()` -- used in 4 specs
- `getThreeDotsButtonInFilterInCanvas()` -- used in 4 specs
- `getTooltipText()` -- used in 4 specs
- `getValidationText()` -- used in 4 specs
- `groupFilter()` -- used in 4 specs
- `inlineChangeOperator()` -- used in 4 specs
- `inputAdjustmentDaysInDynamicCalendar()` -- used in 4 specs
- `inputListOfValue()` -- used in 4 specs
- `inputParameterName()` -- used in 4 specs
- `isBackIconPresent()` -- used in 4 specs
- `isFilterDateRangeWarningDisplayed()` -- used in 4 specs
- `isFilterItemGlobalIconDisplayed()` -- used in 4 specs
- `isGroupLinkPresent()` -- used in 4 specs
- `isItemDisabled()` -- used in 4 specs
- `isItemSelected()` -- used in 4 specs
- `isMendatoryIconByNameDisplayed()` -- used in 4 specs
- `isPanelDocked()` -- used in 4 specs
- `isSummaryBarPresent()` -- used in 4 specs
- `isUngroupLinkPresent()` -- used in 4 specs
- `openFilterContextMenu()` -- used in 4 specs
- `openHamburgerMenu()` -- used in 4 specs
- `openPanel()` -- used in 4 specs
- `removeSelectedItem()` -- used in 4 specs
- `reprompt()` -- used in 4 specs
- `selectAdjustmentPeriodInDynamicCalendar()` -- used in 4 specs
- `selectAdjustmentSubtypeInDynamicCalendar()` -- used in 4 specs
- `selectOptions()` -- used in 4 specs
- `selectSearchResults()` -- used in 4 specs
- `toString()` -- used in 4 specs
- `waitForElementClickable()` -- used in 4 specs
- `waitForPageLoading()` -- used in 4 specs
- `attributeSearch()` -- used in 3 specs
- `branchSelectItemByTexts()` -- used in 3 specs
- `clearLevelByName(name)` -- used in 3 specs
- `clearSelection()` -- used in 3 specs
- `clickAddDataButton()` -- used in 3 specs
- `clickAddDataOkButton()` -- used in 3 specs
- `clickAddOrCancelButtonInAddFilter()` -- used in 3 specs
- `clickApplyButtonInPauseMode()` -- used in 3 specs
- `clickAttributeInAddFilter()` -- used in 3 specs
- `clickClearAll()` -- used in 3 specs
- `clickQualifyOn()` -- used in 3 specs
- `clickSaveDossierButton()` -- used in 3 specs
- `clickShowDataCloseButton()` -- used in 3 specs
- `clickTextfieldByTitle()` -- used in 3 specs
- `currentSearchLevel()` -- used in 3 specs
- `getDynamicIcon()` -- used in 3 specs
- `getEmptySearchImage()` -- used in 3 specs
- `getFilterDetailsPanel()` -- used in 3 specs
- `getFilterDisabledMessageText()` -- used in 3 specs
- `getHeadersInshowDataGrid()` -- used in 3 specs
- `getOpenedSelectionList()` -- used in 3 specs
- `getPanelWidth()` -- used in 3 specs
- `getSelectedBreakBy()` -- used in 3 specs
- `getSelectedCartItemCount()` -- used in 3 specs
- `getSelectedSetOf()` -- used in 3 specs
- `getSummaryBar()` -- used in 3 specs
- `getVizFilterLockMessageText()` -- used in 3 specs
- `hover()` -- used in 3 specs
- `isAdvancedOptionChecked()` -- used in 3 specs
- `isCellInGridDisplayed()` -- used in 3 specs
- `isClearAllDisabled()` -- used in 3 specs
- `isExpressionPresent()` -- used in 3 specs
- `isFilterItemMandatoryIconDisplayed()` -- used in 3 specs
- `isFilterItemMenuDisplayed()` -- used in 3 specs
- `isFilterSummaryPanelPresent()` -- used in 3 specs
- `isMainPanelPresent()` -- used in 3 specs
- `isVizFilterDetailsPanelLocked()` -- used in 3 specs
- `logout()` -- used in 3 specs
- `NOTGroupFilter()` -- used in 3 specs
- `openDossierById()` -- used in 3 specs
- `openDossierByUrl()` -- used in 3 specs
- `openGroupOperator()` -- used in 3 specs
- `openSet()` -- used in 3 specs
- `openUserAccountMenu()` -- used in 3 specs
- `pin()` -- used in 3 specs
- `resetDossierIfPossible()` -- used in 3 specs
- `searchBoxSelectorWithoutSelecting()` -- used in 3 specs
- `searchObject()` -- used in 3 specs
- `selectAttributeFormOption()` -- used in 3 specs
- `selectDateTime()` -- used in 3 specs
- `selectGroupOperator()` -- used in 3 specs
- `selectInView()` -- used in 3 specs
- `selectMonthAndDayInAdjustmentDateInputInDynamicCalendar()` -- used in 3 specs
- `selectShowDataOnVisualizationMenu()` -- used in 3 specs
- `setOperator()` -- used in 3 specs
- `switchUser()` -- used in 3 specs
- `toBeGreaterThan()` -- used in 3 specs
- `unpin()` -- used in 3 specs
- `url()` -- used in 3 specs
- `viewLess()` -- used in 3 specs
- `waitForElementVisible()` -- used in 3 specs
- `waitForStatusBarText()` -- used in 3 specs
- `actionOnMenubarWithSubmenu()` -- used in 2 specs
- `actionOnSubmenu()` -- used in 2 specs
- `addAll()` -- used in 2 specs
- `addFilterToFilterPanel()` -- used in 2 specs
- `appliedFilterCount()` -- used in 2 specs
- `availableItemCountForDashboardOP()` -- used in 2 specs
- `cancel()` -- used in 2 specs
- `changeDisplayStyle()` -- used in 2 specs
- `changeToDynamicSelection()` -- used in 2 specs
- `clearByKeyboard()` -- used in 2 specs
- `clearSearchBox()` -- used in 2 specs
- `clickAdvancedOptionButton()` -- used in 2 specs
- `clickCloseDossierButton()` -- used in 2 specs
- `clickDoneButtonInDynamicDatePicker()` -- used in 2 specs
- `clickDossierContextMenuItem()` -- used in 2 specs
- `clickDropdown()` -- used in 2 specs
- `clickEditButtonInPauseMode()` -- used in 2 specs
- `clickFilterApplyButton()` -- used in 2 specs
- `clickGenerateLinkButton()` -- used in 2 specs
- `clickNthSelectedObj()` -- used in 2 specs
- `clickPencilIconByName(name)` -- used in 2 specs
- `clickURLGeneratorButton()` -- used in 2 specs
- `clickViewFilterArrow()` -- used in 2 specs
- `closeSecondaryPanel()` -- used in 2 specs
- `collapseElement(name)` -- used in 2 specs
- `commitTimeChange()` -- used in 2 specs
- `createDashboardWithDataset()` -- used in 2 specs
- `dismissTooltip()` -- used in 2 specs
- `dockFilterPanel()` -- used in 2 specs
- `dragAndDropLowerHandle(name, pos)` -- used in 2 specs
- `dragAndDropUpperHandle(name, pos)` -- used in 2 specs
- `editDossierByUrl()` -- used in 2 specs
- `elementByOrder(index)` -- used in 2 specs
- `enterValueToDateTimePicker()` -- used in 2 specs
- `expandItemByText()` -- used in 2 specs
- `filterCountString()` -- used in 2 specs
- `firstElmOfHeader()` -- used in 2 specs
- `getAddFilterMenu()` -- used in 2 specs
- `getAttributeOptionCount()` -- used in 2 specs
- `getClipboardText()` -- used in 2 specs
- `getContextMenuOption()` -- used in 2 specs
- `getCurrentInputText()` -- used in 2 specs
- `getDynamicOnIcon()` -- used in 2 specs
- `getFilterContextMenuButton()` -- used in 2 specs
- `getFilterIcon()` -- used in 2 specs
- `getI18NFormattedDate()` -- used in 2 specs
- `getItemsText()` -- used in 2 specs
- `getOneColumnData()` -- used in 2 specs
- `getSelectedFunction()` -- used in 2 specs
- `getTimeValue()` -- used in 2 specs
- `goToHome()` -- used in 2 specs
- `inlineDeleteElement()` -- used in 2 specs
- `inputAndWaitForFirstSuggestion()` -- used in 2 specs
- `isAdjustmentAreaPresent()` -- used in 2 specs
- `isAdvancedChecked()` -- used in 2 specs
- `isAttributeListOperatorSelected()` -- used in 2 specs
- `isAttributeMetricDisplayed()` -- used in 2 specs
- `isCalendarLocked()` -- used in 2 specs
- `isClearFilterDisabled()` -- used in 2 specs
- `isDashboardFilterDisplayed()` -- used in 2 specs
- `isFilterPanelEmpty()` -- used in 2 specs
- `isItemChecked()` -- used in 2 specs
- `isKeepChangesLocalContainerPresent()` -- used in 2 specs
- `isNewEnabled()` -- used in 2 specs
- `isResetAllFiltersButtonPresent()` -- used in 2 specs
- `isScopeFilterDisplayed()` -- used in 2 specs
- `isSelectBtnEnabled()` -- used in 2 specs
- `isViewFilterCollapsed()` -- used in 2 specs
- `isViewSelectedOn()` -- used in 2 specs
- `itemIcon()` -- used in 2 specs
- `keys()` -- used in 2 specs
- `moveFilterToCanvas()` -- used in 2 specs
- `openDatePicker()` -- used in 2 specs
- `openDossierContextMenu()` -- used in 2 specs
- `openDossierNoWait()` -- used in 2 specs
- `openDynamicDateTimePicker()` -- used in 2 specs
- `openTimePicker()` -- used in 2 specs
- `reload()` -- used in 2 specs
- `removeItem()` -- used in 2 specs
- `removeObjectFromList()` -- used in 2 specs
- `removeSingle()` -- used in 2 specs
- `replace()` -- used in 2 specs
- `saveDashboard()` -- used in 2 specs
- `saveInMyReport()` -- used in 2 specs
- `scrollFilterPanelContentToBottom()` -- used in 2 specs
- `scrollListToBottom()` -- used in 2 specs
- `scrollToBottom()` -- used in 2 specs
- `searchSelectDataset()` -- used in 2 specs
- `selectAttributeFormOperator()` -- used in 2 specs
- `selectDayOfWeekForAdjustmentInDynamicCalendar()` -- used in 2 specs
- `selectDropdownItems()` -- used in 2 specs
- `selectedObjectItemCount()` -- used in 2 specs
- `selectElements()` -- used in 2 specs
- `selectInCanvasDynamicSelectionMode()` -- used in 2 specs
- `selectInCanvasFilterCheckboxOption()` -- used in 2 specs
- `selectOperator()` -- used in 2 specs
- `selectPromptByIndex()` -- used in 2 specs
- `selectReportGridContextMenuOption()` -- used in 2 specs
- `setFromInputValue(value)` -- used in 2 specs
- `setItem()` -- used in 2 specs
- `setToInputValue(value)` -- used in 2 specs
- `singleSelectElement(name)` -- used in 2 specs
- `singleSelectItemByText()` -- used in 2 specs
- `summary(name)` -- used in 2 specs
- `switchDatasetsTab()` -- used in 2 specs
- `tab()` -- used in 2 specs
- `title()` -- used in 2 specs
- `toggleDynamicSelectionIcon()` -- used in 2 specs
- `ungroupFilter()` -- used in 2 specs
- `validate()` -- used in 2 specs
- `validateAndWait()` -- used in 2 specs
- `waitForAttributeListValueUpdate()` -- used in 2 specs
- `waitForItemLoading()` -- used in 2 specs
- `capsuleName(filterName, index)` -- used in 1 specs
- `changeContainerTitleFillColor()` -- used in 1 specs
- `checkKeepChangesLocalCheckbox()` -- used in 1 specs
- `clear()` -- used in 1 specs
- `clearAndInputLowserValue()` -- used in 1 specs
- `clearAttributeSearch()` -- used in 1 specs
- `clearSearchInput()` -- used in 1 specs
- `clickAddFilterButtonInMobileView()` -- used in 1 specs
- `clickAdjustmentBtn()` -- used in 1 specs
- `clickAdvancedCheckbox()` -- used in 1 specs
- `clickAdvancedOptionCheckbox()` -- used in 1 specs
- `clickBackButtonInMobileView()` -- used in 1 specs
- `clickCancelBtn()` -- used in 1 specs
- `clickContainer()` -- used in 1 specs
- `clickCreateParameterBtn()` -- used in 1 specs
- `clickDisplayStyleOption()` -- used in 1 specs
- `clickDynamicDateCheckBox()` -- used in 1 specs
- `clickExcludeWeekendButton()` -- used in 1 specs
- `clickFilterOptionInMobileView()` -- used in 1 specs
- `clickLastMonth()` -- used in 1 specs
- `clickNextYear()` -- used in 1 specs
- `clickNotificationWarningBtn()` -- used in 1 specs
- `clickOKBtn()` -- used in 1 specs
- `clickOkButton()` -- used in 1 specs
- `clickRedo()` -- used in 1 specs
- `closeDossierWithoutSaving()` -- used in 1 specs
- `closeLevelInBranchContextMenu(name)` -- used in 1 specs
- `closeTab()` -- used in 1 specs
- `commitDynamicDate()` -- used in 1 specs
- `contractFullScreen()` -- used in 1 specs
- `createBlankDashboard()` -- used in 1 specs
- `createByAriaLable()` -- used in 1 specs
- `createDashboardObjectParameter()` -- used in 1 specs
- `createElementListParameter()` -- used in 1 specs
- `createValueParameter()` -- used in 1 specs
- `deleteItemByText()` -- used in 1 specs
- `dragAndDropHandle(name, pos)` -- used in 1 specs
- `dragFilterWidth()` -- used in 1 specs
- `dragSlider()` -- used in 1 specs
- `emptyTreeNodeTextInSearchResult()` -- used in 1 specs
- `executeScript()` -- used in 1 specs
- `expandFullScreen()` -- used in 1 specs
- `exportFile()` -- used in 1 specs
- `filterItemCountExpanded()` -- used in 1 specs
- `filterItemText()` -- used in 1 specs
- `getAllItemsInSearchResults()` -- used in 1 specs
- `getCSSProperty()` -- used in 1 specs
- `getDatasetDialog()` -- used in 1 specs
- `getDatasetsPanel()` -- used in 1 specs
- `getDateTimeInputValue()` -- used in 1 specs
- `getDateTimePickerIcon()` -- used in 1 specs
- `getDescriptionTooltipText()` -- used in 1 specs
- `getDynamicDateTimePicker()` -- used in 1 specs
- `getElementCountByType()` -- used in 1 specs
- `getFilterDateRangeWarning()` -- used in 1 specs
- `getFilterMenu()` -- used in 1 specs
- `getFromDate()` -- used in 1 specs
- `getGroupOperatorItemCount()` -- used in 1 specs
- `getNotCount()` -- used in 1 specs
- `getOneRowInGrid()` -- used in 1 specs
- `getOperatorDropdown()` -- used in 1 specs
- `getParameterSelectorContainerUsingId()` -- used in 1 specs
- `getScopeFilterInfoMessage()` -- used in 1 specs
- `getSelectedItemsInLevelDropdown()` -- used in 1 specs
- `getSelectedItemsInSearchResults()` -- used in 1 specs
- `getSortByListItemsCount()` -- used in 1 specs
- `getVisualizationTitleBarRoot()` -- used in 1 specs
- `getVizFilterHeader()` -- used in 1 specs
- `hideContainer()` -- used in 1 specs
- `hoverOnCancelBtn()` -- used in 1 specs
- `hoverOnElement(name)` -- used in 1 specs
- `hoverOnLibraryIcon()` -- used in 1 specs
- `ignoreSaveReminder()` -- used in 1 specs
- `input()` -- used in 1 specs
- `inputDynamicHour()` -- used in 1 specs
- `inputDynamicMinute()` -- used in 1 specs
- `inputParameterDescription()` -- used in 1 specs
- `isBranchSelectionButtonDisabled(name)` -- used in 1 specs
- `isCalFilterDetailsPanelLocked()` -- used in 1 specs
- `isCollapsed(name)` -- used in 1 specs
- `isDatasetElementPresent()` -- used in 1 specs
- `isDynamicDatePickerPresent()` -- used in 1 specs
- `isExpanded(name)` -- used in 1 specs
- `isFilterOptionDisplayed()` -- used in 1 specs
- `isKeepOnlyLinkDisplayed(name)` -- used in 1 specs
- `isLevelInBranchButtonPresent(name)` -- used in 1 specs
- `isLoginPageDisplayed()` -- used in 1 specs
- `isMainPanelOpen()` -- used in 1 specs
- `isSecondaryPanelLocked()` -- used in 1 specs
- `isSelectAllEnabled()` -- used in 1 specs
- `levelSelectItemByText()` -- used in 1 specs
- `message()` -- used in 1 specs
- `moveLowerFilterHandle(filterName, position)` -- used in 1 specs
- `multiSelectItem()` -- used in 1 specs
- `navigateLink()` -- used in 1 specs
- `openDropDownList()` -- used in 1 specs
- `openDropdownMenu(name)` -- used in 1 specs
- `openFilterPanelInMobileView()` -- used in 1 specs
- `openFromCalendar()` -- used in 1 specs
- `openMQConditionList()` -- used in 1 specs
- `openOperatorDropdown()` -- used in 1 specs
- `openOrderDropdown()` -- used in 1 specs
- `openSortByDropdown()` -- used in 1 specs
- `openTocInMobileView()` -- used in 1 specs
- `removeAttributeInRowsDropZone()` -- used in 1 specs
- `removeItemInReportTab()` -- used in 1 specs
- `resetDossier()` -- used in 1 specs
- `saveAndCloseQualificationEditor()` -- used in 1 specs
- `scrollSecondaryPanelToBottom()` -- used in 1 specs
- `searchByClick(text)` -- used in 1 specs
- `searchLoadingText()` -- used in 1 specs
- `searchResults()` -- used in 1 specs
- `searchText()` -- used in 1 specs
- `selectAttributeElement()` -- used in 1 specs
- `selectAttributeListOperator()` -- used in 1 specs
- `selectDateInWidget({ monthYear, day })` -- used in 1 specs
- `selectDisplayStyleForFilterItem()` -- used in 1 specs
- `selectDropDownItem()` -- used in 1 specs
- `selectedItemCount()` -- used in 1 specs
- `selectedObjectItemText()` -- used in 1 specs
- `selectFiltersOption()` -- used in 1 specs
- `selectHour()` -- used in 1 specs
- `selectInCanvasContextOption()` -- used in 1 specs
- `selectItemsByTextForPreload()` -- used in 1 specs
- `selectLevelInSearchBar()` -- used in 1 specs
- `selectMinute()` -- used in 1 specs
- `selectMQCondition()` -- used in 1 specs
- `selectSecond()` -- used in 1 specs
- `selectSortByDropdownItem()` -- used in 1 specs
- `setDynamicDate()` -- used in 1 specs
- `switchSection()` -- used in 1 specs
- `switchToDynamicDate()` -- used in 1 specs
- `switchToEditorPanel()` -- used in 1 specs
- `switchToLastMonth()` -- used in 1 specs
- `switchToLastYear()` -- used in 1 specs
- `switchToNextMonth()` -- used in 1 specs
- `switchToNextYear()` -- used in 1 specs
- `switchToPauseMode()` -- used in 1 specs
- `switchToStaticDate()` -- used in 1 specs
- `switchToTab()` -- used in 1 specs
- `toBeLessThan()` -- used in 1 specs
- `toBeTrue()` -- used in 1 specs
- `triggerFilterSectionInfoIcon()` -- used in 1 specs
- `unsetSelectorFilter()` -- used in 1 specs
- `viewSelectedButtnEnabled()` -- used in 1 specs
- `visibleElementCount()` -- used in 1 specs
- `visibleSelectedElementCount()` -- used in 1 specs
- `waitForDrillNotificationBox()` -- used in 1 specs
- `waitForPageIndicatorDisappear()` -- used in 1 specs
- `waitLoadingDataPopUpIsNotDisplayed()` -- used in 1 specs
- `warningMessageText()` -- used in 1 specs
- `clearInput(name)` -- used in 0 specs
- `clearSlider(name)` -- used in 0 specs
- `clickChartElementByIndex(index, chartType)` -- used in 0 specs
- `clickHandle(name)` -- used in 0 specs
- `clickLowerHandle(name)` -- used in 0 specs
- `clickOutOfDropdown()` -- used in 0 specs
- `clickUpperHandle(name)` -- used in 0 specs
- `closeVizSecondaryPanel(filterName)` -- used in 0 specs
- `composeCapsuleDateTime(filterName)` -- used in 0 specs
- `composeInputDate({ mmFun, ddFun, yyFun })` -- used in 0 specs
- `composeInputTime({ hourFun, minFun, ampmFun })` -- used in 0 specs
- `composeWidgetDate({ mmyyFun, ddFun })` -- used in 0 specs
- `dateOnWidgetHeader()` -- used in 0 specs
- `dragToSamePosition(name)` -- used in 0 specs
- `dynamicDisplayTextOfFrom()` -- used in 0 specs
- `dynamicDisplayTextOfTo()` -- used in 0 specs
- `dynamicHeaderSummaryText()` -- used in 0 specs
- `editTimezone()` -- used in 0 specs
- `elementIndexInXAxisByName(eleName)` -- used in 0 specs
- `expandDynamicDateOptions()` -- used in 0 specs
- `expandPopUpCalendarForFrom()` -- used in 0 specs
- `expandPopUpCalendarForTo()` -- used in 0 specs
- `filterBarItemCount()` -- used in 0 specs
- `filterPanelItemsCount(name)` -- used in 0 specs
- `filterSummaryBarText(filterName)` -- used in 0 specs
- `firstTimezoneItemText()` -- used in 0 specs
- `getCalendarInputValue(el)` -- used in 0 specs
- `getChartElementByName(elementName, chartType)` -- used in 0 specs
- `getCheckboxByName(name)` -- used in 0 specs
- `getCheckBoxElementsCount()` -- used in 0 specs
- `getCheckBoxElementsText()` -- used in 0 specs
- `getCheckboxLabelByIndex(index)` -- used in 0 specs
- `getDateOnWidgetHeader()` -- used in 0 specs
- `getElementIndexInSearchResults(name)` -- used in 0 specs
- `getMyTimezoneText()` -- used in 0 specs
- `getSearchResultsText(isWaitSearchResults = false)` -- used in 0 specs
- `getTimezoneItemText()` -- used in 0 specs
- `getTimezoneNumber()` -- used in 0 specs
- `getWidgetHeaderMonthYear()` -- used in 0 specs
- `getWidgetMonthYear()` -- used in 0 specs
- `goToNextMonth()` -- used in 0 specs
- `goToNextYear()` -- used in 0 specs
- `goToPreviousMonth()` -- used in 0 specs
- `goToPreviousYear()` -- used in 0 specs
- `hideVizFilterDetailsBody()` -- used in 0 specs
- `hoverOnFilter(filterName)` -- used in 0 specs
- `hoverOnHandle(name)` -- used in 0 specs
- `hoverOnHierarchyElement(name)` -- used in 0 specs
- `hoverOnLowerHandle(name)` -- used in 0 specs
- `hoverOnMaxValue(name)` -- used in 0 specs
- `hoverOnMinValue(name)` -- used in 0 specs
- `hoverOnSummaryLabel(name)` -- used in 0 specs
- `hoverOnUpperHandle(name)` -- used in 0 specs
- `inputAMPMOfBeforeAfter()` -- used in 0 specs
- `inputAMPMOfFrom()` -- used in 0 specs
- `inputAMPMOfTo()` -- used in 0 specs
- `inputBoxValue(name)` -- used in 0 specs
- `inputDayOfBeforeAfter()` -- used in 0 specs
- `inputDayOfFrom()` -- used in 0 specs
- `inputDayOfTo()` -- used in 0 specs
- `inputHourOfBeforeAfter()` -- used in 0 specs
- `inputHourOfFrom()` -- used in 0 specs
- `inputHourOfTo()` -- used in 0 specs
- `inputMinuteOfBeforeAfter()` -- used in 0 specs
- `inputMinuteOfFrom()` -- used in 0 specs
- `inputMinuteOfTo()` -- used in 0 specs
- `inputMonthOfBeforeAfter()` -- used in 0 specs
- `inputMonthOfFrom()` -- used in 0 specs
- `inputMonthOfTo()` -- used in 0 specs
- `inputPlaceholder(name)` -- used in 0 specs
- `inputSearch(text)` -- used in 0 specs
- `inputValue(name, value)` -- used in 0 specs
- `inputValueForLongString(name, value, repeat = 1)` -- used in 0 specs
- `inputYearOfBeforeAfter()` -- used in 0 specs
- `inputYearOfFrom()` -- used in 0 specs
- `inputYearOfTo()` -- used in 0 specs
- `isAfterSelected()` -- used in 0 specs
- `isBeforeSelected()` -- used in 0 specs
- `isCapsuleExcluded({ filterName, capsuleName })` -- used in 0 specs
- `isCapsuleExcluded(filterName, capsuleName)` -- used in 0 specs
- `isCapsuleExcluded(filterName)` -- used in 0 specs
- `isCapsulePresent(filterName)` -- used in 0 specs
- `isCheckboxSelected(name)` -- used in 0 specs
- `isClearAllEnabled()` -- used in 0 specs
- `isClearSearchIconPresent()` -- used in 0 specs
- `isClearSelectionEnabled()` -- used in 0 specs
- `isDateSelectedInWidget({ monthYear, day })` -- used in 0 specs
- `isDynamic(name)` -- used in 0 specs
- `isDynamicOptionSelected(option)` -- used in 0 specs
- `isEditButtonPresent()` -- used in 0 specs
- `isElementPresent(name)` -- used in 0 specs
- `isEmptySearchDisplayed()` -- used in 0 specs
- `isFilterExcludedinExpandedView(name)` -- used in 0 specs
- `isFilterSummaryPresent()` -- used in 0 specs
- `isInputAfterUnset()` -- used in 0 specs
- `isInputAnyDateSelected()` -- used in 0 specs
- `isInputBeforeUnset()` -- used in 0 specs
- `isInputBoxUnset()` -- used in 0 specs
- `isInputEqualToCapsule(filterName)` -- used in 0 specs
- `isInputEqualToWidget({ widgetmmyyFun, widgetddFun, inputmmFun, inputddFun, inputyyFun })` -- used in 0 specs
- `isInputEqualToWidgetForFrom()` -- used in 0 specs
- `isInputEqualToWidgetForTo()` -- used in 0 specs
- `isLastNextContextMenuContainerPresent()` -- used in 0 specs
- `isLevelSelected(name)` -- used in 0 specs
- `isLevelSelectIconLocked()` -- used in 0 specs
- `isMyTimeZoneSelected()` -- used in 0 specs
- `isOnSelected()` -- used in 0 specs
- `isPencilIconPresent(name)` -- used in 0 specs
- `isSearchWarningMsgPresent()` -- used in 0 specs
- `isSingleDateSelected()` -- used in 0 specs
- `isSliderHighlighted(name)` -- used in 0 specs
- `isSummaryInExcludeMode(name)` -- used in 0 specs
- `isSummaryPresent(name)` -- used in 0 specs
- `isTimeInputPresent()` -- used in 0 specs
- `isTimezoneLocked()` -- used in 0 specs
- `isViewSelectedEnabled()` -- used in 0 specs
- `isViewSelectedPresent()` -- used in 0 specs
- `keyword()` -- used in 0 specs
- `lowerInput(name)` -- used in 0 specs
- `maxValue(name)` -- used in 0 specs
- `minValue(name)` -- used in 0 specs
- `moveUpperFilterHandle(filterName, position)` -- used in 0 specs
- `openTimezoneSecondaryPanel()` -- used in 0 specs
- `openVizFilterContextMenu(filterName)` -- used in 0 specs
- `openVizSecondaryPanel(filterName)` -- used in 0 specs
- `removeCapsule(filterName)` -- used in 0 specs
- `scrollFilterToBottom()` -- used in 0 specs
- `scrollWidgetToBottom()` -- used in 0 specs
- `searchboxPlaceholder()` -- used in 0 specs
- `selectCheckboxByName(name)` -- used in 0 specs
- `selectCustomOperatorOption(name)` -- used in 0 specs
- `selectDynamicDateOptions(name, useOld = false)` -- used in 0 specs
- `selectedOption(name)` -- used in 0 specs
- `selectElementsInAreaByIndex(index, chartType)` -- used in 0 specs
- `selectElementsInAreaByName(elementName, chartType)` -- used in 0 specs
- `selectFixedTimezone(value)` -- used in 0 specs
- `selectInputDayOfBeforeAfter()` -- used in 0 specs
- `selectInputDayOfFrom()` -- used in 0 specs
- `selectInputDayOfTo()` -- used in 0 specs
- `selectInputMonthOfBeforeAfter()` -- used in 0 specs
- `selectInputMonthOfFrom()` -- used in 0 specs
- `selectInputMonthOfTo()` -- used in 0 specs
- `selectInputYearOfBeforeAfter()` -- used in 0 specs
- `selectInputYearOfFrom()` -- used in 0 specs
- `selectInputYearOfTo()` -- used in 0 specs
- `selectMyTimezone()` -- used in 0 specs
- `selectOrDeselectChartElementByName(elementName, chartType)` -- used in 0 specs
- `selectVizFilterContextMenuOption(filterName, menuName)` -- used in 0 specs
- `sendKeyToInput(theKey)` -- used in 0 specs
- `setFromForCustom({
        option, prefix, value, unit, fixedOption, monthYear, day, customMonth, customDay, customYear, customHour, customMin, customSec, customAMPM, })` -- used in 0 specs
- `setInputDateOfBeforeAfter({ customMonth, customDay, customYear })` -- used in 0 specs
- `setInputDateOfFrom({ customMonth, customDay, customYear })` -- used in 0 specs
- `setInputDateOfTo({ customMonth, customDay, customYear })` -- used in 0 specs
- `setInputDateUnitWithValue({ partialDate, customValue })` -- used in 0 specs
- `setInputTimeOfBeforeAfter({ customHour, customMin, customSec, customAMPM })` -- used in 0 specs
- `setInputTimeOfFrom({ customHour, customMin, customSec, customAMPM })` -- used in 0 specs
- `setInputTimeOfOnFrom({ customHour, customMin, customSec, customAMPM })` -- used in 0 specs
- `setInputTimeOfOnTo({ customHour, customMin, customSec, customAMPM })` -- used in 0 specs
- `setInputTimeOfTo({ customHour, customMin, customSec, customAMPM })` -- used in 0 specs
- `setInputTimeUnitWithValue({ partialTime, customValue })` -- used in 0 specs
- `setLastNextNumberInputWithValue(value, expectedValue)` -- used in 0 specs
- `setLastNextRelativeRange({ prefix, value, unit, expectedValue = value })` -- used in 0 specs
- `setToForCustom({
        option, prefix, value, unit, fixedOption, monthYear, day, customMonth, customDay, customYear, customHour, customMin, customSec, customAMPM, })` -- used in 0 specs
- `showVizFilterDetailsBody()` -- used in 0 specs
- `sliderTooltip()` -- used in 0 specs
- `toggleViewSelectedOption()` -- used in 0 specs
- `updateLowerInput(name, value)` -- used in 0 specs
- `updateSliderInput(name, lowerValue, upperValue)` -- used in 0 specs
- `updateUpperInput(name, value)` -- used in 0 specs
- `updateValueWithEnter({ filterName, valueLower, valueUpper })` -- used in 0 specs
- `upperInput(name)` -- used in 0 specs
- `valueOfToolTipInChart(elementName, chartType)` -- used in 0 specs
- `viewAllButtonisDisplayed()` -- used in 0 specs
- `viewAllButtonIsPresent()` -- used in 0 specs
- `vizFilterHeaderSelectedInfo()` -- used in 0 specs
- `vizFilterSelectionInfo(name)` -- used in 0 specs
- `widgetDayOfFrom()` -- used in 0 specs
- `widgetDayOfSelected()` -- used in 0 specs
- `widgetDayOfTo()` -- used in 0 specs
- `widgetMonthOfFrom()` -- used in 0 specs
- `widgetMonthOfTo()` -- used in 0 specs
- `widgetStartWeekDay()` -- used in 0 specs
- `widgetTextAsSelected()` -- used in 0 specs

## Source Coverage

- `pageObjects/filter/**/*.js`
- `specs/regression/filter/**/*.{ts,js}`
- `specs/regression/filterSearch/**/*.{ts,js}`
- `specs/regression/reportEditor/reportScopeFilter/**/*.{ts,js}`
- `specs/regression/reportFilter/**/*.{ts,js}`
- `specs/regression/scopefilter/**/*.{ts,js}`
