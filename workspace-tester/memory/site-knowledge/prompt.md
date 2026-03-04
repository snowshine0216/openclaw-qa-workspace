# Site Knowledge: prompt

> Components: 17

### AEPrompt
> Extends: `BasePrompt`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| _none_ |

**Sub-components**
_none_

---

### CalendarPicker
> Extends: `basePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `openMonthDropDownMenu()` |
| `selectMonth(month)` |
| `clearAndInputYear(year)` |
| `selectYearAndMonth(year, month)` |
| `selectDay(day)` |
| `switchToLastYear()` |
| `switchToNextYear()` |
| `switchToLastMonth()` |
| `switchToNextMonth()` |
| `selectToday()` |
| `toggleDynamicCalendar()` |
| `setOffsetInDynamicCalendar({period, offsetOperator, directions, times})` |
| `setOffsetByInputValueInDynamicCalendar({period, offsetOperator, value})` |
| `checkExcludeWeekendsInDynamicCalendar()` |
| `uncheckExcludeWeekendsInDynamicCalendar()` |
| `checkAdjustmentInDynamicCalendar()` |
| `uncheckAdjustmentInDynamicCalendar()` |
| `selectAdjustmentSubtypeInDynamicCalendar(subtype)` |
| `selectAdjustmentPeriodInDynamicCalendar(period)` |
| `inputAdjustmentDaysInDynamicCalendar(days)` |
| `selectDayOfWeekForAdjustmentInDynamicCalendar(dayOfWeeks)` |
| `selectAdjustDateInDynamicCalendar(dateName)` |
| `openAdjustmentMonthDayInputInDynamicCalendar()` |
| `openAdjustmentDateInputInDynamicCalendar()` |
| `selectMonthAndDayInAdjustmentDateInputInDynamicCalendar(month, day)` |
| `clickDoneButtonInDynamicCalendar()` |
| `isCalendarOpen()` |
| `getMonthValue()` |
| `getYearValue()` |
| `isDynamicToggleOn()` |
| `isDynamicToggleShow()` |
| `getNewResolvedDateInDynamicCalendar()` |
| `getMonthYearValueInCalendar()` |
| `getAdjustmentDaysOptionsCountInDynamicCalendar()` |

**Sub-components**
- getCalendarWidget
- getDynamicCalendarWidget

---

### CalendarStyle
> Extends: `BasePrompt`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `openCalendar(promptElement)` |
| `closeCalendar(promptElement)` |
| `openMonthDropDownMenu(promptElement)` |
| `selectMonth(promptElement, month)` |
| `clearAndInputYear(promptElement, year)` |
| `selectYearAndMonth(promptElement, year, month)` |
| `selectDay(promptElement, day)` |
| `switchToLastYear(promptElement)` |
| `switchToNextYear(promptElement)` |
| `switchToLastMonth(promptElement)` |
| `switchToNextMonth(promptElement)` |
| `selectToday(promptElement)` |
| `clickHour(promptElement)` |
| `clickMinute(promptElement)` |
| `clickSecond(promptElement)` |
| `clearAndInputHour(promptElement, hour)` |
| `clearAndInputMinute(promptElement, minute)` |
| `clearAndInputSecond(promptElement, second)` |
| `toggleDynamicCalendar(promptElement)` |
| `setOffsetInDynamicCalendar(promptElement, {period, offsetOperator, directions, times})` |
| `checkExcludeWeekendsInDynamicCalendar(promptElement)` |
| `uncheckExcludeWeekendsInDynamicCalendar(promptElement)` |
| `checkAdjustmentInDynamicCalendar(promptElement)` |
| `uncheckAdjustmentInDynamicCalendar(promptElement)` |
| `selectAdjustmentSubtypeInDynamicCalendar(promptElement, subtype)` |
| `selectAdjustmentPeriodInDynamicCalendar(promptElement, period)` |
| `inputAdjustmentDaysInDynamicCalendar(promptElement, days)` |
| `selectDayOfWeekForAdjustmentInDynamicCalendar(promptElement, dayOfWeeks)` |
| `selectAdjustDateInDynamicCalendar(promptElement, dateName)` |
| `openAdjustmentMonthDayInputInDynamicCalendar(promptElement)` |
| `openAdjustmentDateInputInDynamicCalendar(promptElement)` |
| `selectMonthAndDayInAdjustmentDateInputInDynamicCalendar(promptElement, month, day)` |
| `clickDoneButtonInDynamicCalendar(promptElement)` |
| `isCalendarOpen(promptElement)` |
| `getMonthValue(promptElement)` |
| `getYearValue(promptElement)` |
| `getHourValue(promptElement)` |
| `getMinuteValue(promptElement)` |
| `getSecondValue(promptElement)` |
| `isDynamicToggleOn(promptElement)` |
| `isDynamicToggleShow(promptElement)` |
| `getNewResolvedDateInDynamicCalendar(promptElement)` |
| `isDynamicSelection(promptElement)` |
| `getMonthYearValueInCalendar(promptElement)` |
| `getAdjustmentDaysOptionsCountInDynamicCalendar(promptElement)` |

**Sub-components**
- getTimeWidget
- getCalendarWidget

---

### CheckboxStyle
> Extends: `BasePrompt`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `LoadingState` | `.mstrCheckListReadyState` | element |

**Actions**
| Signature |
|-----------|
| `clickCheckboxByName(promptElement, itemName)` |
| `searchFor(promptElement, text)` |
| `clearSearch(promptElement)` |
| `clickMatchCase(promptElement)` |
| `goToFirstPage(promptElement)` |
| `goToPreviousPage(promptElement)` |
| `goToNextPage(promptElement)` |
| `goToLastPage(promptElement)` |
| `selectedItemCount(promptElement)` |
| `isItemSelected(promptElement, itemName)` |
| `isFirstItemSelected(promptElement)` |
| `isLastItemSelected(promptElement)` |

**Sub-components**
_none_

---

### HierarchyPrompt
> Extends: `BasePrompt`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| _none_ |

**Sub-components**
_none_

---

### ObjectPrompt
> Extends: `BasePrompt`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| _none_ |

**Sub-components**
_none_

---

### PersonalAnswer
> Extends: `BasePrompt`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickRememberThisAnswer(promptElement)` |
| `addPersonalAnswer(promptElement, answerName)` |
| `openPersonalAnswers(promptElement)` |
| `loadPersonalAnswer(promptElement, name)` |
| `openSavedAnswersPopup(promptElement)` |
| `renamePersonalAnswer(promptElement, oldName, newName)` |
| `deletePersonalAnswer(promptElement, name)` |
| `personalAnswerCount(promptElement)` |
| `isPersonalAnswerPresent(promptElement)` |

**Sub-components**
_none_

---

### PromptObject
> Extends: `BasePrompt`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `waitForMessage(promptElement)` |
| `getWarningMsg(promptElement)` |
| `isMessagePresent(promptElement)` |
| `isInvalidAnswer(promptElement)` |
| `getItemCountText(promptElement)` |
| `goToFirstPage(promptElement)` |
| `goToPreviousPage(promptElement)` |
| `goToNextPage(promptElement)` |
| `goToLastPage(promptElement)` |
| `clickItemCountText(promptElement)` |

**Sub-components**
_none_

---

### PullDownStyle
> Extends: `BasePrompt`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `togglePullDownList(promptElement)` |
| `selectPullDownItem(promptElement, text)` |
| `selectListItem(promptElement, text)` |
| `multiSelectListItem(promptElement, items)` |
| `scrollDownList(promptElement)` |
| `searchFor(promptElement, text)` |
| `clearSearch(promptElement)` |
| `clickMatchCase(promptElement)` |
| `getSelectedItem(promptElement)` |
| `isItemInList(promptElement, text)` |
| `isFirstSelected(promptElement)` |
| `isLastSelected(promptElement)` |
| `isOnlyAllInList(promptElement)` |

**Sub-components**
_none_

---

### QualificationPrompt
> Extends: `BasePrompt`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| _none_ |

**Sub-components**
_none_

---

### QualificationPullDownStyle
> Extends: `BasePrompt`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clearInputLowerValue(promptElement)` |
| `clickInputValueInput(promptElement)` |
| `openDropDownList(promptElement)` |
| `closeDropDownList(promptElement)` |
| `selectDropDownItem(promptElement, text)` |
| `currentDropdownSelection(promptElement)` |
| `inputLowerValue(promptElement, value)` |
| `clearAndInputLowserValue(promptElement, value)` |
| `clearAndInputUpperValue(promptElement, value)` |
| `clearUppperValue(promptElement)` |
| `clickUpperValue(promptElement)` |
| `inputUpperValue(promptElement, value)` |
| `openBrowseValuesWindow(promptElement)` |
| `openImportFileWindow(promptElement)` |
| `openChooseAttributesWindow(promptElement)` |
| `confirmBrowserValues(promptElement)` |
| `editAttrSelection(promptElement)` |
| `openMQConditionList(promptElement)` |
| `closeMQConditionList(promptElement)` |
| `openMQLevelList(promptElement)` |
| `closeMQLevelList(promptElement)` |
| `selectMQCondition(promptElement, conName)` |
| `selectMQLevel(promptElement, levelName)` |
| `openAttrFormList(promptElement)` |
| `openAQCondotion(promptElement)` |
| `openAQSelectCondotion(promptElement)` |
| `selectYourSelection(promptElement)` |
| `selectYourSelectionIcon(promptElement)` |
| `selectDefaultSelection(promptElement)` |
| `getDefaultAnswerText(promptElement)` |
| `selectAttrForm(promptElement, form)` |
| `scrollDownConditionList(promptElement, offset)` |
| `selectAQCondition(promptElement, form)` |
| `selectAQSelectCondition(promptElement, form)` |
| `selectAQType(promptElement, type)` |
| `openLowerInputCalendar(promptElement)` |
| `openUpperInputCalendar(promptElement)` |
| `isLowerValueInputVisible(promptElement)` |
| `isUpperValueInputVisible(promptElement)` |
| `isBrowseValueVisible(promptElement)` |
| `isImportFileVisible(promptElement)` |
| `getAQConditionTextNoAttr(promptElement)` |
| `getValueSelectionListCount(promptElement)` |
| `isDynamicIconVisibleInLowerInput(promptElement)` |
| `isDynamicIconVisibleInUpperInput(promptElement)` |

**Sub-components**
_none_

---

### RadioButtonStyle
> Extends: `BasePrompt`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectRadioButtonByName(promptElement, itemName)` |
| `visibleSelectedItemCount(promptElement)` |
| `currentIndex(promptName)` |
| `getAllItemCount(promptElement)` |
| `getSelectedItemName(promptElement)` |
| `searchFor(promptElement, text)` |
| `clearSearch(promptElement)` |
| `clickMatchCase(promptElement)` |
| `isItemSelected(promptElement, itemName)` |
| `isFirstItemSelected(promptElement)` |
| `isLastItemSelected(promptElement)` |

**Sub-components**
- indexPage

---

### ShoppingCartStyle
> Extends: `BasePrompt`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickOKCancel(promptElement, content)` |
| `clickOKinCustomization(Customization, promptElement)` |
| `getCartItemCount(cart)` |
| `removeAll(promptElement, isInnerShoppingCart = false)` |
| `addAll(promptElement, isInnerShoppingCart = false)` |
| `addSingle(promptElement, isInnerShoppingCart = false)` |
| `addSingleForWeb(promptElement, elementName)` |
| `removeSingle(promptElement, isInnerShoppingCart = false)` |
| `deleteSingle(promptElement, index, isBasedOnRoot = false)` |
| `clickElmInAvailableList(promptElement, elmName, isInnerShoppingCart = false)` |
| `clickElmLinkInAvailableList(promptElement, elmName)` |
| `searchFor(promptElement, text)` |
| `clearSearch(promptElement)` |
| `clearAndSearch(promptElement, text)` |
| `clickMatchCase(promptElement)` |
| `clickFetchFirst(promptElement)` |
| `clickFetchPrevious(promptElement)` |
| `clickFetchNext(promptElement)` |
| `clickFetchLast(promptElement)` |
| `clickdeleteConditionIcon(promptElement)` |
| `addNewCondition(promptElement)` |
| `openImportbyIcon(promptElement)` |
| `upOneLevel(promptElement)` |
| `importFile(promptElement)` |
| `confirmFileEditor(promptElement)` |
| `cancelFileEditor(promptElement)` |
| `deleteCondition(promptElement, index, isBasedOnRoot = false)` |
| `backToTop(promptElement)` |
| `clickNthSelectedItem(promptElement, index, isBasedOnRoot = false)` |
| `clickNthSelectedItemWithOffset(promptElement, index, isBasedOnRoot = false)` |
| `clickNthSelectedObj(promptElement, index, isBasedOnRoot = false)` |
| `openTypeDropdown(promptElement, index)` |
| `openFormDropdown(promptElement, index)` |
| `scrollDownConditionList(promptElement, offset)` |
| `scrollAvailableList(promptElement, offset)` |
| `openConditionDropdown(promptElement, index)` |
| `openLevelDropdown(promptElement, index)` |
| `openValueListEditor(promptElement, index)` |
| `openValuePart1Editor(promptElement, index)` |
| `openValuePart1Calendar(promptElement)` |
| `openValuePart2Editor(promptElement, index)` |
| `openValuePart2Calendar(promptElement)` |
| `openBrowseValuesWindow(promptElement)` |
| `openImportFileWindow(promptElement)` |
| `switchEnterValues(promptElement)` |
| `inputTextinImportFile(promptElement, value)` |
| `selectType(promptElement, typeText)` |
| `selectForm(promptElement, formText)` |
| `selectCondition(promptElement, conditionText)` |
| `selectLevel(promptElement, levelName)` |
| `chooseAnySelection(promptElement)` |
| `chooseAllSelections(promptElement)` |
| `openEditValueWindow(promptElement, index)` |
| `inputValues(promptElement, value)` |
| `clickValueInput(promptElement)` |
| `confirmValues(promptElement)` |
| `cancelValues(promptElement)` |
| `clickButton(promptElement, content)` |
| `clearValues(promptElement)` |
| `clearByKeyboard(promptElement)` |
| `clearAndInputValues(promptElement, value)` |
| `openNthExprMenu(promptElement, index)` |
| `chooseNthExpr(promptElement, index)` |
| `moveUp(promptElement)` |
| `moveDown(promptElement)` |
| `groupItems(promptElement)` |
| `ungroupItems(promptElement)` |
| `clickElmInSelectedListToEdit(promptElement, itemText)` |
| `openMQFirstValue(promptElement, index)` |
| `openMQSecondValue(promptElement, index)` |
| `getMQValuePartText(promptElement, index)` |
| `waitForShoppingCart(promptElement)` |
| `clickElmInSelectedList(promptElement, elmName)` |
| `clickConditionItem(promptElement, text)` |
| `addRight(promptElement)` |
| `getItemInAvailableListCount(promptElement, elmName)` |
| `getItemInSelectedCount(promptElement, elmName)` |
| `isButtonEnabled(promptElement, button)` |
| `getNthSelectedItemText(promptElement, index)` |
| `getItemCountText(promptElement)` |
| `getAvailableCartItemCount(promptElement, isInnerShoppingCart = false)` |
| `getSelectedCartItemCount(promptElement, isInnerShoppingCart = false)` |
| `getSelectedConditionItemCount(promptElement)` |
| `isItemInAvailableList(promptElement, itemText)` |
| `getNthExprText(promptElement, index)` |
| `isItemInSelectedListToEdit(promptElement, itemText, isBasedOnRoot = false)` |
| `isItemInSelectedList(promptElement, itemText)` |
| `getSelectedListCount(promptElement)` |
| `getSelectedObjectListText(promptElement)` |
| `isImportFileEditorDisplay(promptElement)` |
| `isValuePart1ListEditorDisplay(promptElement)` |

**Sub-components**
_none_

---

### TextboxStyle
> Extends: `BasePrompt`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickTextBoxInput(promptElement)` |
| `inputText(promptElement, value)` |
| `clearValue(promptElement, value)` |
| `clearAndInputText(promptElement, value)` |
| `text(promptElement)` |
| `checkTextPromptComplexAnswer(promptElement)` |

**Sub-components**
_none_

---

### TimePicker
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectHour(hour)` |
| `selectMinute(minute)` |
| `selectSecond(second)` |

**Sub-components**
_none_

---

### TreeStyle
> Extends: `BasePrompt`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickEleName(promptElement, eleName)` |
| `expandEle(promptElement, eleName)` |
| `collapseEle(promptElement, eleName)` |
| `searchInEle(promptElement, eleName, text)` |
| `clearSearchInEle(promptElement, eleName)` |
| `scrollTreeToBottom(promptElement)` |
| `goToNextPage(promptElement, attrName)` |
| `openErrorDetails(promptElement)` |
| `isExpandIconPresent(promptElement, attrName)` |
| `isCollapseIconPresent(promptElement, attrName)` |
| `countCSSByLevel(promptElement, level)` |

**Sub-components**
_none_

---

### ValuePrompt
> Extends: `BasePrompt`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| _none_ |

**Sub-components**
_none_
