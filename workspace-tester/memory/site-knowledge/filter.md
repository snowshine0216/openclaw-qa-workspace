# Site Knowledge: filter

> Components: 16

### AttributeSlider
> Extends: `BaseFilter`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickLowerHandle(name)` |
| `clickUpperHandle(name)` |
| `clickHandle(name)` |
| `dragAndDropLowerHandle(name, pos)` |
| `dragAndDropUpperHandle(name, pos)` |
| `dragAndDropHandle(name, pos)` |
| `hoverOnSummaryLabel(name)` |
| `hoverOnMinValue(name)` |
| `hoverOnMaxValue(name)` |
| `hoverOnUpperHandle(name)` |
| `minValue(name)` |
| `maxValue(name)` |
| `summary(name)` |
| `isSummaryPresent(name)` |
| `isSummaryInExcludeMode(name)` |
| `isSliderHighlighted(name)` |
| `sliderTooltip()` |

**Sub-components**
- getFilterContainer

---

### CalendarDynamicPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `CustomOperatorTimeInput` | `.mstr-time-picker__container input` | input |
| `LastNextContextMenuContainer` | `.mstr-date-time-range-picker-last-next-input` | input |

**Actions**
| Signature |
|-----------|
| `selectDynamicOption(radio)` |
| `selectCustomOperatorOption(name)` |
| `openFromDatePicker()` |
| `openToDatePicker()` |
| `openCustomOperatorDatePicker()` |
| `setCustomOperatorInput(value)` |
| `setFromInputValue(value)` |
| `setToInputValue(value)` |
| `setLastNextNumberInputWithValue(value, expectedValue)` |
| `setLastNextRelativeRange({ prefix, value, unit, expectedValue = value })` |
| `setTimeInputValue({ operator = 'Between', ele = 'from', timeValue })` |
| `clickApplyButton()` |
| `displayTextOfFrom()` |
| `displayTextOfTo()` |
| `displayTextOfCustomOperator()` |
| `getCalendarInputValue(el)` |
| `displayTextOfCustomFrom()` |
| `displayTextOfCustomTo()` |
| `getSelectedDynamicOption()` |
| `isCalendarLocked()` |

**Sub-components**
- getContainer
- getLastNextContextMenuContainer

---

### CalenderFilter
> Extends: `BaseFilter`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ClearSelection` | `.mstrd-FilterDetailPanelFooter` | element |

**Actions**
| Signature |
|-----------|
| `expandDynamicDateOptions()` |
| `selectDynamicDateOptions(name, useOld = false)` |
| `setInputDateOfFrom({ customMonth, customDay, customYear })` |
| `setInputDateOfTo({ customMonth, customDay, customYear })` |
| `setInputTimeOfFrom({ customHour, customMin, customSec, customAMPM })` |
| `setInputTimeOfTo({ customHour, customMin, customSec, customAMPM })` |
| `setInputDateOfBeforeAfter({ customMonth, customDay, customYear })` |
| `setInputTimeOfBeforeAfter({ customHour, customMin, customSec, customAMPM })` |
| `setInputTimeOfOnFrom({ customHour, customMin, customSec, customAMPM })` |
| `setInputTimeOfOnTo({ customHour, customMin, customSec, customAMPM })` |
| `selectInputMonthOfFrom()` |
| `selectInputDayOfFrom()` |
| `selectInputYearOfFrom()` |
| `selectInputMonthOfTo()` |
| `selectInputDayOfTo()` |
| `selectInputYearOfTo()` |
| `selectInputMonthOfBeforeAfter()` |
| `selectInputDayOfBeforeAfter()` |
| `selectInputYearOfBeforeAfter()` |
| `sendKeyToInput(theKey)` |
| `goToPreviousMonth()` |
| `goToNextMonth()` |
| `goToPreviousYear()` |
| `goToNextYear()` |
| `selectDateInWidget({ monthYear, day })` |
| `scrollWidgetToBottom()` |
| `removeCapsule(filterName)` |
| `clearSelection()` |
| `selectDynamicOption(radio)` |
| `setLastNextRelativeRange({ prefix, value, unit, expectedValue })` |
| `setFromForCustom({
        option, prefix, value, unit, fixedOption, monthYear, day, customMonth, customDay, customYear, customHour, customMin, customSec, customAMPM, })` |
| `setToForCustom({
        option, prefix, value, unit, fixedOption, monthYear, day, customMonth, customDay, customYear, customHour, customMin, customSec, customAMPM, })` |
| `expandPopUpCalendarForFrom()` |
| `expandPopUpCalendarForTo()` |
| `capsuleDateTime(filterName)` |
| `isCapsuleDynamic(filterName)` |
| `filterSummaryBarText(filterName)` |
| `composeInputDate({ mmFun, ddFun, yyFun })` |
| `composeInputTime({ hourFun, minFun, ampmFun })` |
| `composeWidgetDate({ mmyyFun, ddFun })` |
| `composeCapsuleDateTime(filterName)` |
| `isInputEqualToCapsule(filterName)` |
| `isInputEqualToWidget({ widgetmmyyFun, widgetddFun, inputmmFun, inputddFun, inputyyFun })` |
| `isInputEqualToWidgetForFrom()` |
| `isInputEqualToWidgetForTo()` |
| `isInputBoxUnset()` |
| `isInputBeforeUnset()` |
| `isInputAfterUnset()` |
| `isInputAnyDateSelected()` |
| `isTimeInputPresent()` |
| `isCapsulePresent(filterName)` |
| `isCapsuleExcluded(filterName)` |
| `isClearSelectionEnabled()` |
| `isBeforeSelected()` |
| `isAfterSelected()` |
| `isOnSelected()` |
| `widgetStartWeekDay()` |
| `getDateOnWidgetHeader()` |
| `getWidgetMonthYear()` |
| `dynamicDisplayTextOfFrom()` |
| `dynamicDisplayTextOfTo()` |
| `isDynamicOptionSelected(option)` |
| `isLastNextContextMenuContainerPresent()` |

**Sub-components**
- dynamicPanel
- getFilterContainer
- composeWidget
- isInputEqualToWidget

---

### CalendarHeader
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `HeaderContainer` | `.mstrd-CalStyleFilterDetailsPanel-header` | element |
| `DynamicDateContextMenu` | `.mstrd-CalFilterTypeDropdownSelector-dropdownMenu` | dropdown |
| `DateInputBox` | `.mstrd-DateInput-wrapper` | input |

**Actions**
| Signature |
|-----------|
| `expandDynamicDateOptions()` |
| `selectDynamicDateOptions(name)` |
| `setInputDateUnitWithValue({ partialDate, customValue })` |
| `setInputTimeUnitWithValue({ partialTime, customValue })` |
| `setInputDateOfFrom({ customMonth, customDay, customYear })` |
| `setInputDateOfTo({ customMonth, customDay, customYear })` |
| `setInputTimeOfFrom({ customHour, customMin, customSec, customAMPM })` |
| `setInputTimeOfTo({ customHour, customMin, customSec, customAMPM })` |
| `setInputDateOfBeforeAfter({ customMonth, customDay, customYear })` |
| `setInputTimeOfBeforeAfter({ customHour, customMin, customSec, customAMPM })` |
| `setInputTimeOfOnFrom({ customHour, customMin, customSec, customAMPM })` |
| `setInputTimeOfOnTo({ customHour, customMin, customSec, customAMPM })` |
| `selectInputMonthOfFrom()` |
| `selectInputDayOfFrom()` |
| `selectInputYearOfFrom()` |
| `selectInputMonthOfTo()` |
| `selectInputDayOfTo()` |
| `selectInputYearOfTo()` |
| `selectInputMonthOfBeforeAfter()` |
| `selectInputDayOfBeforeAfter()` |
| `selectInputYearOfBeforeAfter()` |
| `sendKeyToInput(theKey)` |
| `inputMonthOfFrom()` |
| `inputDayOfFrom()` |
| `inputYearOfFrom()` |
| `inputHourOfFrom()` |
| `inputMinuteOfFrom()` |
| `inputAMPMOfFrom()` |
| `inputMonthOfTo()` |
| `inputDayOfTo()` |
| `inputYearOfTo()` |
| `inputHourOfTo()` |
| `inputMinuteOfTo()` |
| `inputAMPMOfTo()` |
| `inputMonthOfBeforeAfter()` |
| `inputDayOfBeforeAfter()` |
| `inputYearOfBeforeAfter()` |
| `inputHourOfBeforeAfter()` |
| `inputMinuteOfBeforeAfter()` |
| `inputAMPMOfBeforeAfter()` |
| `isInputBoxUnset()` |
| `isInputBeforeUnset()` |
| `isInputAfterUnset()` |
| `isInputAnyDateSelected()` |
| `isTimeInputPresent()` |
| `isBeforeSelected()` |
| `isAfterSelected()` |
| `isOnSelected()` |
| `dynamicHeaderSummaryText()` |
| `dateOnWidgetHeader()` |

**Sub-components**
- getHeaderContainer

---

### CalendarWidget
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `WidgetContainer` | `.mstrd-Calendar-widget-container` | element |
| `WidgetDayOfFrom` | `.mstrd-rc-Day--from` | element |
| `WidgetDayOfTo` | `.mstrd-rc-Day--to` | element |
| `WidgetDaySelected` | `.mstrd-rc-Day--selected` | dropdown |

**Actions**
| Signature |
|-----------|
| `goToPreviousMonth()` |
| `goToNextMonth()` |
| `goToPreviousYear()` |
| `goToNextYear()` |
| `selectDateInWidget({ monthYear, day })` |
| `scrollWidgetToBottom()` |
| `widgetMonthOfFrom()` |
| `widgetDayOfFrom()` |
| `widgetMonthOfTo()` |
| `widgetDayOfTo()` |
| `widgetDayOfSelected()` |
| `widgetTextAsSelected()` |
| `isDateSelectedInWidget({ monthYear, day })` |
| `isSingleDateSelected()` |
| `getWidgetHeaderMonthYear()` |

**Sub-components**
- getWidgetContainer
- getMonthYearInWidget
- getLeftHeaderInWidget
- getRightHeaderInWidget
- getWidget
- getDateInWidget
- getHeaderTextInWidget

---

### ChartVisualizationFilter
> Extends: `VisualizationFilter`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getChartElementByName(elementName, chartType)` |
| `elementIndexInXAxisByName(eleName)` |
| `valueOfToolTipInChart(elementName, chartType)` |
| `selectElementsInAreaByName(elementName, chartType)` |
| `selectElementsInAreaByIndex(index, chartType)` |
| `clickChartElementByIndex(index, chartType)` |
| `selectOrDeselectChartElementByName(elementName, chartType)` |

**Sub-components**
_none_

---

### CheckboxFilter
> Extends: `BaseFilter`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FilterItemList` | `.mstrd-FilterItemsList` | element |

**Actions**
| Signature |
|-----------|
| `getCheckboxByName(name)` |
| `openSecondaryPanel(filterName)` |
| `selectElementByName(name)` |
| `selectElementsByNames(names)` |
| `uncheckElementByName(name)` |
| `keepOnly(name)` |
| `hoverOnElement(name)` |
| `toggleViewSelectedOption()` |
| `toggleViewSelectedOptionOn()` |
| `selectAll()` |
| `clearAll()` |
| `search(keyword)` |
| `clearSearch()` |
| `scrollSecondaryPanelToBottom()` |
| `isElementPresent(name)` |
| `isElementSelected(name)` |
| `elementByOrder(index)` |
| `message()` |
| `isKeepOnlyLinkDisplayed(name)` |
| `isViewSelectedEnabled()` |
| `isCapsulePresent({ filterName, capsuleName })` |
| `capsuleCount(filterName)` |
| `isCapsuleExcluded({ filterName, capsuleName })` |
| `keyword()` |
| `isClearSearchIconPresent()` |
| `visibleSelectedElementCount()` |
| `isSelectAllEnabled()` |
| `isClearAllEnabled()` |
| `getCheckBoxElementsCount()` |
| `getCheckBoxElementsText()` |

**Sub-components**
- getSecondaryFilterPanel
- getFilterContainer

---

### DynamicFilter
> Extends: `BaseFilter`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `LevelIcon` | `.mstrd-AttrElemDetailsPanel-header` | element |
| `LockedLevelIcon` | `.mstrd-AttrElemDetailsPanel-header` | element |
| `LevelSelectionDropdown` | `.mstrd-LevelSelectionContextMenu-menu` | dropdown |
| `LevelList` | `.ant-popover-content` | element |
| `ClearSearchIcon` | `.icon-clearsearch.mstrd-FilterSearchBox-manual-search` | element |
| `CurrentSearchLevel` | `.mstrd-AttrElemDetailsPanel-LevelSearchBox` | element |
| `LockedSecondaryPanel` | `.mstrd-AttrElemDetailsPanel-locked` | element |
| `FilterSearchBox` | `.mstrd-FilterSearchBox-search-box` | element |
| `HierarchyCheckboxSpinner` | `.mstrd-Spinner.mstrd-HierarchyCheckbox-expandSpin` | element |

**Actions**
| Signature |
|-----------|
| `expandElement(name)` |
| `collapseElement(name)` |
| `clickBranchSelectionButton(name)` |
| `hoverOnHierarchyElement(name)` |
| `singleSelectElement(name)` |
| `singleDeselectElement(name)` |
| `clickLevelIcon()` |
| `isLevelSelected(name)` |
| `selectLevelByName(name)` |
| `clearLevelByName(name)` |
| `clickLevelInBranchButton(name)` |
| `closeLevelInBranchContextMenu(name)` |
| `selectAll()` |
| `clearAll()` |
| `inputSearch(text)` |
| `searchByClick(text)` |
| `searchByEnter(text)` |
| `clearSearch()` |
| `selectNthSearchLevel(n)` |
| `expandFullScreen()` |
| `contractFullScreen()` |
| `isDynamic(name)` |
| `isSelected(name)` |
| `searchResultCount()` |
| `selectedResultCount()` |
| `isExpanded(name)` |
| `isCollapsed(name)` |
| `currentSearchLevel()` |
| `isCapsuleExcluded(filterName, capsuleName)` |
| `capsuleCount(filterName)` |
| `capsuleName(filterName, index)` |
| `isSecondaryPanelLocked()` |
| `isLevelSelectIconLocked()` |
| `isBranchSelectionButtonDisabled(name)` |
| `isLevelInBranchButtonPresent(name)` |

**Sub-components**
- getFilterContainer
- getLockedSecondaryPanel

---

### FilterSummaryBar
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FilterSummaryPanel` | `.mstrd-FilterSummaryPanel` | element |
| `FilterSummaryBarContainer` | `.mstrd-FilterSummary-barContainer` | element |
| `ViewAllButton` | `.mstrd-FilterSummaryBar-right` | element |
| `ViewLessButton` | `.mstrd-FilterSummaryViewButton--expanded` | button |
| `ExpandedFilterSummaryItems` | `.mstrd-FilterSummaryPanel-items` | element |
| `FilterSummaryBar` | `.mstrd-FilterSummaryBar` | element |
| `FilterSummaryBarNoFilterLabel` | `.mstrd-FilterSummaryBar-noFilter` | element |
| `FilterBarItem` | `.mstrd-FilterSummaryBar-items` | element |

**Actions**
| Signature |
|-----------|
| `isFilterSummaryPresent()` |
| `filterSummaryBarText()` |
| `viewAllButtonisDisplayed()` |
| `isPencilIconPresent(name)` |
| `isTruncateDotsPresent(name)` |
| `viewAllButtonIsPresent()` |
| `filterItems(name, index = 0)` |
| `filterPanelItems(name, index = 0)` |
| `filterCountString()` |
| `filterBarItemCount()` |
| `filterItemCountExpanded()` |
| `filterPanelItemsCount(name)` |
| `isFilterExcludedinExpandedView(name)` |
| `clickPencilIconByName(name)` |
| `viewAllFilterItems()` |
| `collapseViewAllItems()` |

**Sub-components**
- getFilterSummaryBarContainer
- getFilterPanel

---

### MQFilter
> Extends: `BaseFilter`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickOutOfDropdown()` |
| `openDropdownMenu(name)` |
| `updateValue({ filterName, valueLower, valueUpper })` |
| `updateValueWithEnter({ filterName, valueLower, valueUpper })` |
| `selectOption(name, option)` |
| `hoverOnFilter(filterName)` |
| `selectedOption(name)` |
| `inputBoxValue(name)` |

**Sub-components**
- getFilterContainer

---

### MQSliderFilter
> Extends: `BaseFilter`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `hoverOnUpperHandle(name)` |
| `hoverOnLowerHandle(name)` |
| `hoverOnHandle(name)` |
| `openDropdownMenu(name)` |
| `selectOption(name, option)` |
| `updateLowerInput(name, value)` |
| `updateUpperInput(name, value)` |
| `updateSliderInput(name, lowerValue, upperValue)` |
| `dragToSamePosition(name)` |
| `updateValue({ filterName, valueLower, valueUpper })` |
| `clearSlider(name)` |
| `moveLowerFilterHandle(filterName, position)` |
| `moveUpperFilterHandle(filterName, position)` |
| `sliderTooltip()` |
| `inputBoxValue(name)` |
| `lowerInput(name)` |
| `upperInput(name)` |
| `minValue(name)` |
| `maxValue(name)` |
| `selectedOption(name)` |

**Sub-components**
- getFilterContainer

---

### CheckboxFilter
> Extends: `BaseFilter`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clearInput(name)` |
| `inputValue(name, value)` |
| `inputValueForLongString(name, value, repeat = 1)` |
| `inputPlaceholder(name)` |

**Sub-components**
- getFilterContainer

---

### RadiobuttonFilter
> Extends: `BaseFilter`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectElementByName(name)` |
| `hoverOnElement(name)` |
| `clearSelection()` |
| `search(keyword)` |
| `clearSearch()` |
| `isElementPresent(name)` |
| `isElementSelected(name)` |
| `isCapsulePresent({ filterName, capsuleName })` |
| `isCapsuleExcluded({ filterName, capsuleName })` |
| `isClearSearchIconPresent()` |
| `elementByOrder(index)` |
| `message()` |
| `keyword()` |
| `isViewSelectedPresent()` |
| `visibleSelectedElementCount()` |

**Sub-components**
- getFilterContainer

---

### SearchBoxFilter
> Extends: `BaseFilter`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getCheckboxByName(name)` |
| `selectCheckboxByName(name)` |
| `isCheckboxSelected(name)` |
| `getCheckboxLabelByIndex(index)` |
| `selectElementByName(name)` |
| `selectElementsByNames(names)` |
| `scrollFilterToBottom()` |
| `keepOnly(name)` |
| `hoverOnElement(name)` |
| `toggleViewSelectedOption()` |
| `toggleViewSelectedOptionOn()` |
| `selectAll()` |
| `clearAll()` |
| `search(keyword)` |
| `clearSearch()` |
| `clearSelection()` |
| `isElementPresent(name)` |
| `isElementSelected(name)` |
| `elementByOrder(index)` |
| `visibleElementCount()` |
| `visibleSelectedElementCount()` |
| `searchboxPlaceholder()` |
| `searchResults()` |
| `getSearchResultsText(isWaitSearchResults = false)` |
| `isEmptySearchDisplayed()` |
| `message()` |
| `isSelectAllEnabled()` |
| `isClearAllEnabled()` |
| `isKeepOnlyLinkDisplayed(name)` |
| `getElementIndexInSearchResults(name)` |

**Sub-components**
- getSecondaryPanel

---

### Timezone
> Extends: `BaseFilter`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `UnlockTimezoneContainer` | `.mstrd-FilterItemContainer--hasDetailPanel` | element |
| `TimezoneDetailPanel` | `.mstrd-TimezoneDetailsPanel` | element |
| `MyTimezoneSection` | `.mstrd-TimezoneDetailsPanel-mine` | element |
| `TimezoneList` | `.mstrd-FilterItemsList` | element |

**Actions**
| Signature |
|-----------|
| `openTimezoneSecondaryPanel()` |
| `editTimezone()` |
| `selectFixedTimezone(value)` |
| `selectMyTimezone()` |
| `search(keyword)` |
| `clearSearch()` |
| `isMyTimeZoneSelected()` |
| `getTimezoneItemText()` |
| `getMyTimezoneText()` |
| `isTimezoneLocked()` |
| `getTimezoneNumber()` |
| `isSearchWarningMsgPresent()` |
| `firstTimezoneItemText()` |
| `isEditButtonPresent()` |

**Sub-components**
- getFilterContainer
- getTimezoneContainer
- openSecondaryPanel
- getTimezoneItemContainer
- getUnlockTimezoneContainer

---

### VisualizationFilter
> Extends: `BaseFilter`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `VizFilterHeader` | `.mstrd-VisFilterHeader` | element |
| `VizFilterDetialsBody` | `.mstrd-VisFilterDetailsPanel-Body` | element |
| `ClearAll` | `.mstrd-VisFilterHeader-ClearAll` | element |
| `VizFilterLockMessage` | `.mstrd-VisFilterHeader-lockedMsg` | element |

**Actions**
| Signature |
|-----------|
| `openVizSecondaryPanel(filterName)` |
| `closeVizSecondaryPanel(filterName)` |
| `openVizFilterContextMenu(filterName)` |
| `selectVizFilterContextMenuOption(filterName, menuName)` |
| `clearAll()` |
| `vizFilterSelectionInfo(name)` |
| `vizFilterHeaderSelectedInfo()` |
| `hideVizFilterDetailsBody()` |
| `showVizFilterDetailsBody()` |
| `isClearAllDisabled()` |
| `getVizFilterLockMessageText()` |

**Sub-components**
- getVizFilterContainer
- getSecondaryPanel
- filterPanel
