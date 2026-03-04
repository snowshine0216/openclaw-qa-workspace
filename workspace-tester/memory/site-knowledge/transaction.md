# Site Knowledge: transaction

> Components: 13

### CalendarDIC
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `InputBox` | `.mstrmojo-DateTextBox .mstrmojo-DateTextBox-input` | input |
| `DateIcon` | `.mstrmojo-DateTextBox .mstrmojo-DateTextBox-icon` | element |

**Actions**
| Signature |
|-----------|
| `chooseCalendar(year, month, day)` |
| `chooseTime(hour, meridiem, minute, second)` |
| `confirm()` |
| `setTimeWithInput(dateTime)` |
| `showCalendarByDateIcon()` |

**Sub-components**
_none_

---

### FormPanel
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getFormPanelByAriaLabel(name)` |
| `getDocSelectorForButton(name)` |
| `isDocSelectorDisabled(container)` |
| `clickSubmitButton(name = 'Submit')` |
| `clickResetButton(name = 'Reset')` |
| `hasGhostImageContainer(index)` |
| `getFormUnavailableMessageText()` |
| `isFormUnavailableMessageDisplayed(expectedText = 'Form is currently not available.')` |
| `waitForSubmitChangesDialog({ timeout = 10000 } = {})` |
| `waitForSubmitChangesDialogDismissed({ timeout = 10000 } = {})` |
| `getSubmitChangesDialogTitle()` |
| `getSubmitChangesDialogMessageLines()` |
| `isSubmitChangesDialogDisplayed()` |
| `clickSubmitChangesDialogButton(label)` |
| `getSubmitButtonTooltip(name = 'Submit')` |
| `getResetButtonTooltip(name = 'Reset')` |
| `getTextboxDIC(name)` |
| `getTextAreaDIC(name)` |
| `getSliderDIC(name)` |
| `getDropdownDIC(name, options = {})` |
| `getDropdownInteractiveElement(dropdown)` |
| `getDropdownPopup(name, panelNameOrOptions = {})` |
| `getDropdownOptionElements(name, panelNameOrOptions = {})` |
| `getDropdownOptionTexts(name, panelNameOrOptions = {})` |
| `doesDropdownOptionExist(name, optionText, panelNameOrOptions = {})` |
| `clickDropdown(name, panelNameOrOptions = {})` |
| `isDropdownExpanded(name, panelNameOrOptions = {})` |
| `getSwitchDIC(name)` |
| `getSwitchElement(name)` |
| `getSwitchClickTarget(name)` |
| `isSwitchOn(name)` |
| `toggleSwitch(name, turnOn = null)` |
| `isSubmitButtonDisabled(name = 'Submit')` |
| `isResetButtonDisabled(name = 'Reset')` |
| `getHoverMenuButton(name, panelRef)` |
| `openContextMenu(name)` |
| `clickConfigureTransactionMenuItem()` |
| `clickEditTransactionMenuItem()` |
| `clickClearTransactionMenuItem()` |
| `clickDuplicateMenuItem()` |
| `isConfigureTransactionMenuItemDisabled()` |
| `hoverOnFormPanelByName(name)` |
| `isFormPanelDisplayed(name)` |
| `isResetButtonNotExisting()` |
| `hoverOnResetButton(name = 'Reset')` |
| `hoverOnSubmitButton(name = 'Submit')` |
| `waitForTransactionNotificationDisplayed({ timeout = 5000 } = {})` |
| `waitForTransactionNotificationDismissed({ timeout = 5000 } = {})` |
| `clickTransactionNotificationButton(label)` |
| `dismissTransactionNotification()` |
| `clickConfigureTransactionContinue()` |
| `isConfigureTransactionNotificationVisible()` |
| `setInputValue(getInputFn, value)` |
| `setTextboxAndEnter(name, value = '')` |
| `getTextboxValue(name)` |
| `getSwitchValue(name)` |
| `hoverOnTextbox(name)` |
| `getTooltipMessage()` |
| `setTextAreaAndEnter(name, value = '')` |
| `hoverOnTextArea(name)` |
| `getSliderValue(name)` |

**Sub-components**
- getFormPanel

---

### LikertScale
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getLowest()` |
| `getHighest()` |
| `chooseValue(value)` |
| `getLowestRating()` |
| `getHighestRating()` |
| `getSelectedItem()` |

**Sub-components**
_none_

---

### ListDIC
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getListItem(name)` |
| `clickSearchableListIconNode()` |
| `selectListItem(name)` |
| `selectSearchableListItem(name)` |
| `selectSearchableListItemBySearch(value)` |
| `getListSelection()` |
| `isListDropdownPresent()` |
| `getSelectedTxt()` |
| `getSearchableListSelectedTxt()` |

**Sub-components**
_none_

---

### RadioList
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectItem(name)` |
| `getSelectedItem()` |
| `isItemSelected(name)` |

**Sub-components**
_none_

---

### Slider
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ApplyBtn` | `.mstrmojo-Button.mstrmojo-oivmSprite.tbApply` | button |
| `CancelBtn` | `.mstrmojo-Button.mstrmojo-oivmSprite.tbCancel` | button |

**Actions**
| Signature |
|-----------|
| `dragSlider(toOffset)` |
| `apply()` |
| `cancel()` |

**Sub-components**
_none_

---

### StarRating
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `chooseValue(value)` |

**Sub-components**
_none_

---

### Stepper
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickMinusBtn(times = 1)` |
| `clickPlusBtn(times = 1)` |
| `isBtnDisabled(text)` |
| `getValue()` |

**Sub-components**
_none_

---

### Survey
> Extends: `TransactionPage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SurveyContainer` | `.mstrmojo-SurveyVis` | element |
| `DropdownList` | `.mstrmojo-Pulldown-Popup` | element |

**Actions**
| Signature |
|-----------|
| `inputTextField(name, text)` |
| `inputTextArea(name, text)` |
| `chooseList(name, item)` |
| `chooseDropDownList(name, item)` |
| `goNext()` |
| `waitWidgetLoaded()` |

**Sub-components**
- getSurveyContainer
- scrollPage

---

### Switch
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickCheckbox()` |
| `isGrayed()` |
| `isChecked()` |

**Sub-components**
_none_

---

### TimePicker
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ApplyBtn` | `.mstrmojo-Button.mstrmojo-oivmSprite.tbApply` | button |
| `CancelBtn` | `.mstrmojo-Button.mstrmojo-oivmSprite.tbCancel` | button |

**Actions**
| Signature |
|-----------|
| `clickStepperUpBtn(times = 1)` |
| `clickStepperDownBtn()` |
| `clickApplyBtn()` |
| `clickCancelBtn()` |
| `isApplyBtnsDisabled()` |

**Sub-components**
_none_

---

### Toggle
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `changeValue()` |
| `getCurrentValue()` |

**Sub-components**
_none_

---

### TransactionPage
> Extends: `DossierPage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `TextFieldDIC` | `.dataInputControl .mstrmojo-TextBox.mstrmojo-TextFieldDIC` | input |
| `WaitMask` | `.mstrmojo-Box.fullscreen-mask` | element |

**Actions**
| Signature |
|-----------|
| `submitChanges()` |
| `sumbitChangesWithNoWait()` |
| `submitChangesWithPageFreshed()` |
| `recalculateChanges()` |
| `discardChanges()` |
| `inputTextFieldByKey(key, text)` |
| `inputTextField(text)` |
| `inputTextArea(text)` |
| `inputTextAreaByName(name, text)` |
| `inputTextFieldByName(name, text, flag = true)` |
| `inputTextFieldByValue(value, text)` |
| `clickOnContainerByKey(key)` |
| `fieldValueBy(key)` |
| `waitForPageReload()` |
| `waitForMaskDisappear()` |
| `clickOnDocLayout()` |
| `hasDirtyFlag(el)` |
| `isDirtyFlagDisappear(el)` |
| `isPageRefreshed()` |
| `getTextFieldValue(name)` |
| `getTextAreaValue()` |
| `getTextAreaValueByName(name)` |
| `isActionButtonDisplayed(name)` |

**Sub-components**
- waitPage
- clickOnContainer
- getContainer
