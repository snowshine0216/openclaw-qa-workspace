# Site Knowledge: selector

> Components: 14

### ButtonBar
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectNthItem(index, text)` |
| `getSelectedItemText()` |
| `selectItemByText(text)` |
| `multiSelectNth(items)` |
| `isItemSelected(index, text)` |
| `isItemTextSelected(text)` |
| `getSeletedItemsCount()` |
| `isItemExisted(item)` |

**Sub-components**
- dossierPage

---

### Calendar
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getFromDate()` |
| `getToDate()` |
| `getInputDate()` |
| `inputDate(dimension, date)` |
| `openFromCalendar()` |
| `openDateTimePicker()` |
| `openToCalendar()` |
| `selectYear(year)` |
| `selectMonth(month)` |
| `selectDay(day)` |
| `selectDate(year, month, day)` |
| `selectDateWithOKBtn(year, month, day)` |
| `selectHour(hour, meridiem)` |
| `selectMinute(minute)` |
| `selectSecond(second)` |
| `selectDayTime(year, month, day, hour, minute, second, meridiem = 'AM')` |
| `clickOkButton()` |
| `clickDynamicDateCheckBox()` |
| `openDynamicDayDropdown()` |
| `openDynamicMonthDropdown()` |
| `selectDynamicCalendarDropdownItem(index, text)` |
| `selectDynamicDayDropdownItem(index, text)` |
| `selectDynamicMonthDropdownItem(index, text)` |
| `clickDynamicDayStepperNext(times)` |
| `clickDynamicDayStepperPrev(times)` |
| `clickDynamicMonthStepperNext(times)` |
| `clickDynamicMonthStepperPrev()` |
| `clickDynamicCalendarButton(btnName)` |
| `isDynamicDateChecked()` |

**Sub-components**
- dossierPage
- getCalendarWidget

---

### CheckBox
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickItemByText(text)` |
| `selectItemByText(text)` |
| `selectLevelInSearchBar(levelText)` |
| `search(searchKey)` |
| `clearSearch()` |
| `selectSearchResults(results)` |
| `selectLevel(levelText)` |
| `expandItemByText(text)` |
| `expandItemsByText(texts)` |
| `collapseItemByText(text)` |
| `collapseItemsByText(texts)` |
| `dismissLevelDropdown()` |
| `singleSelectItemByText(text)` |
| `levelSelectItemByText(text, level)` |
| `branchSelectItemByTexts(texts)` |
| `clickSelectAll()` |
| `clickClearAll()` |
| `clickItems(texts)` |
| `isItemsChecked(texts)` |
| `isItemExisted(item)` |
| `getSelectedItemsText()` |
| `getItemMode(text)` |
| `getSelectedItemsCount()` |
| `isItemExpanded(text)` |
| `isItemLeafNode(text)` |
| `getItemSelectedStatus(text)` |
| `getSelectedItemsInSearchResults()` |
| `getAllItemsInSearchResults()` |

**Sub-components**
_none_

---

### Dropdown
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `openDropdownNoWait()` |
| `clickDropdown()` |
| `openDropdown()` |
| `closeDropdown()` |
| `lastItemText()` |
| `selectNthItem(index, text)` |
| `selectItemByText(text, checkDocumentLoaded = true)` |
| `selectMultiItemByText(texts)` |
| `clickOKBtn(checkDocumentLoaded = true)` |
| `clickCancelBtn()` |
| `openDropdownAndMultiSelect(texts)` |
| `scrollDropdown(toPosition)` |
| `scrollAndSelectDropDown(rootElement, option)` |
| `getShownSelectedText()` |
| `dropdownItemsCount()` |
| `isItemExisted(item)` |
| `isItemSelected(item)` |
| `isDropdownListPresent()` |

**Sub-components**
- dossierPage

---

### InCanvasSelector
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ContextMenu` | `.mstrmojo-ListBase.mstrmojo-ui-Menu` | element |
| `SlideTooltip` | `.mstrmojo-Tooltip` | element |

**Actions**
| Signature |
|-----------|
| `getItem(elemName)` |
| `getItemWithExactName(elemName)` |
| `getItemDeleteCapsure(elemName)` |
| `getSelectedDrodownItem()` |
| `getSliderText()` |
| `inputText(text)` |
| `selectItemByKey(key, itemName)` |
| `selectItem(itemName)` |
| `selectItems(itemNames)` |
| `selectItemWithExactName(itemName)` |
| `multiSelect(items)` |
| `openDropdownMenu()` |
| `searchInDropdown(text)` |
| `closeDropdownMenu()` |
| `selectDropdownItems(items)` |
| `chooseDropdownItems(items)` |
| `clickDropdownBtn(text)` |
| `openDropdownAndSelect(items)` |
| `openContextMenu()` |
| `selectOptionInMenu(option)` |
| `openAndSelectContextMenu(option)` |
| `search(text)` |
| `searchSearchbox(text, isPreloaded = false)` |
| `clearSearch()` |
| `deleteSearchboxItems(items)` |
| `selectSearchBoxItem(item, isPreloaded = false)` |
| `selectSearchBoxItems(items, isDismissPreload = true)` |
| `selectSearchBoxItemsForPreload({ items, isPreloaded = false, isSingleSelection = true })` |
| `dismissSuggestionList()` |
| `dismissPreloadElementList()` |
| `dragSlider(toOffset, position = 'end')` |
| `getSliderTooltipText(position = 'end')` |
| `clickApplyButtonInPauseMode()` |
| `isOptionInMenu(option)` |
| `isItemSelected(item)` |
| `getSelectedItemsCount()` |
| `isLinkItemSelected(item)` |
| `dateAndTimeText()` |
| `textBoxInputText()` |
| `selectedSearchItemCount()` |
| `getMandatoryWarningMessageText()` |
| `isMandatoryWarningDisplayed()` |
| `getSelectedItemsText(isSearchBox = false)` |
| `getItemsText()` |
| `getItemsNumber()` |
| `getSliderSelectedText()` |
| `getDropdownSelectedText()` |
| `getSearchBoxMandatoryWarningMessageText()` |
| `isSearchBoxMandatoryWarningDisplayed()` |
| `getDropdownItemsCount()` |
| `getAriaLabel()` |
| `getICSTargetTooltipText(isValueParameter = false)` |
| `getICSTitleTooltipText()` |
| `isICSTargetTooltipDisplayed()` |
| `isICSTitleTooltipDisplayed()` |
| `getSelectedSearchSuggestItemsText()` |
| `getSearchSuggestItemsText()` |
| `getSearchSuggestItemIndex(item)` |
| `getSelectedSearchSuggestItemsIndex()` |
| `getSearchSuggestItemsCount()` |
| `clickEditButtonInPauseMode()` |
| `getSelectedItemsInLevelDropdown()` |

**Sub-components**
- getSearchContainer
- getDropdownWidget

---

### LinkBar
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectNthItem(index, text)` |
| `selectItemByText(text, checkDocumentLoaded = true)` |
| `multiSelectNth(items)` |
| `getSelectedItemText()` |
| `getSeletedItemsCount()` |
| `isItemSelected(index, text)` |
| `isItemSelectedByText(text)` |
| `isItemExisted(item)` |

**Sub-components**
- dossierPage

---

### ListBox
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectNthItem(index, text)` |
| `selectItemByText(text, checkDocumentLoaded = true)` |
| `multiSelect(items)` |
| `isItemSelected(index, text)` |
| `isItemTextSelected(text)` |
| `isItemExisted(item)` |
| `getSeletedItemsCount()` |
| `getSelectedItemText()` |

**Sub-components**
_none_

---

### MetricQualification
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `openPatternDropdown()` |
| `selectDropdownOperation(name, iswait = true)` |
| `openDropdownOperation()` |
| `selectNthItem(index, text)` |
| `inputValue(value, index = 1)` |
| `inputValueDirectly(value, index = 1)` |
| `inputValueWithoutApply(value, index = 1)` |
| `getInputValue()` |
| `apply()` |
| `getSelectedPatternText()` |
| `getMQExpression()` |

**Sub-components**
- dossierPage

---

### MetricSlider
> Extends: `Slider`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `QualificationDropdown` | `.mstrmojo-PopupList` | element |

**Actions**
| Signature |
|-----------|
| `getSliderLabel()` |
| `getSliderSummary()` |
| `selectQualificationOperation(name, iswait = true)` |
| `openQualificationDropdown()` |

**Sub-components**
_none_

---

### RadioButton
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectNthItem(index, text)` |
| `getSelectedItemText()` |
| `selectItemByText(text, checkDocumentLoaded = true)` |
| `isItemSelected(index, text)` |
| `isItemSelectedByText(text)` |
| `isEmptySelector()` |
| `isItemExisted(item)` |
| `getSeletedItemsCount()` |

**Sub-components**
- dossierPage

---

### SearchBox
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getSuggestionListText()` |
| `deleteItemByText(itemText)` |
| `inputAndNoWait(text)` |
| `input(text)` |
| `clickOnInputBox()` |
| `inputAndWaitForFirstSuggestion(text)` |
| `clearAndInputAndWaitForFirstSuggestion(text)` |
| `selectNthItem(index, text)` |
| `selectItemByText(text)` |
| `selectItemsByText(texts)` |
| `selectItemsByTextForPreload({ texts, isPreload = false, isSingleSelection = true})` |
| `moveToSuggetionItem(index)` |
| `clearAllSelections()` |
| `isSearchEnabled()` |
| `isSearchResultPresent()` |
| `isSearchboxEmpty()` |
| `getSelectedItemsText()` |
| `getSuggestListItemsText()` |
| `getSearchBoxInputValue()` |
| `dismissPreloadElementList()` |
| `dismissSuggestionList()` |
| `getSearchSuggestItemIndex(itemText)` |

**Sub-components**
- dossierPage

---

### SelectorObject
> Extends: `BaseComponent`

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

### SelectorPanel
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `applySelection()` |
| `cancelSelection()` |
| `getApplyButtonTooltip()` |
| `getCancelButtonTooltip()` |
| `isApplyButtonDisabled()` |

**Sub-components**
_none_

---

### Slider
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `InputPopup` | `.mstrmojo-Popup.edvl` | element |
| `Tooltip` | `.mstrmojo-Tooltip` | element |

**Actions**
| Signature |
|-----------|
| `getSliderWidth()` |
| `dragSlider(toOffset, sliderByClass = 'middle', wait = true)` |
| `dragSliderForInsertData(toOffset)` |
| `inputValue(buttonLocator, text)` |
| `inputToStartPoint(text)` |
| `inputToPoint(text)` |
| `inputToEndPoint(text)` |
| `clickSliderBar(offset)` |
| `getTooltipText(buttonLocator)` |
| `getStartTooltipText()` |
| `getEndTooltipText()` |
| `getSingleTooltipText()` |

**Sub-components**
- dossierPage
