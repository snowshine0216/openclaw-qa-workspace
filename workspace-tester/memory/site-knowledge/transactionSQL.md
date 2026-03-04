# Site Knowledge: transactionSQL

> Components: 9

### AgGrid
> Extends: `AgGridVisualization`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getHeaderPencilIcon(index)` |
| `waitForTransactionSliderDisplayed()` |
| `getSearchableDropdownAmplifier()` |
| `selectDropdownOption(option)` |
| `selectSearchableDropdownOption(searchText, option)` |
| `getWarningTooltip(text)` |
| `getAfterSubmissionText(text)` |
| `getConfirmationPopupButton(option)` |
| `selectConfirmationPopupOption(option)` |
| `waitForConsumptionModeToRefresh()` |
| `clickErrorWindowButton(text)` |
| `getPulldownOptionCount()` |
| `getTransactionDialogText(containerName)` |
| `getTransactionDialogTextHeight(containerName, text)` |
| `clickActiontoOpenTransactionEditor(actionName)` |

**Sub-components**
- LibraryAuthoringPage
- getContainer
- FormatPanel

---

### BulkDelete
> Extends: `BulkEdit`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getCheckedDeleteRow(rowIndex, bulkMode = 'Delete Data')` |
| `getDeleteCell(rowIndex, bulkMode = 'Delete Data')` |
| `getCheckedDeleteCheckbox(rowIndex, bulkMode = 'Delete Data')` |
| `setDeleteHeaderCheckbox(isActionCheck, bulkMode)` |
| `getDeleteButtonByRow(row)` |

**Sub-components**
- getBulkTxnContainer

---

### BulkEdit
> Extends: `BaseContainer`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getBulkTxnGridCellErrorByPosition(row, col, bulkMode)` |
| `clickBulkTxnGridCellByPosition(row, col, bulkMode, hasError)` |
| `getBulkEditSubmitButton(containerName, transactionMode)` |
| `clickOnBulkEditSubmitButton(containerName, transactionMode)` |
| `getBulkEditSubmitButtonEnabled(containerName, transactionMode)` |
| `getTxnNodesToChange(containerName, text)` |
| `getTxnChangeText(containerName)` |
| `enterBulkTxnMode(bulkMode, visName)` |
| `clickBulkTxnModeIcon(visName)` |
| `IsMenuButtonValid(visName, buttonName)` |
| `clickBulkMode(bulkMode)` |
| `getVisualizationTxnButton(visualizationName)` |
| `resizeColumn(col, xPixels, bulkMode)` |
| `getDeleteButtonByRow(row)` |
| `InputValueInBulkTxnGridCell(row, col, bulkMode, value)` |

**Sub-components**
- getBulkTxnContainer
- getBulkEditContainer
- getContainer
- hoverOnVisualizationContainer

---

### BulkUpdate
> Extends: `BulkEdit`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getUpdatedCell(row, col)` |
| `getUpdatedRow(rowIndex)` |
| `getInputField()` |
| `enterOnInput()` |
| `getDeleteButtonByRow(row)` |

**Sub-components**
- getBulkTxnContainer

---

### InlineEdit
> Extends: `AgGridVisualization`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `waitForSliderForInlineEdit()` |
| `clickConfirmContainerIcon(row, col, visualizationName, iconName)` |
| `replaceTextInGridCellAndEnter(row, col, visualizationName, value)` |
| `replaceTextInGridCell(row, col, visualizationName, value)` |
| `typeTextInGridCell(row, col, visualizationName, value)` |
| `replaceTextInSearchableDropdownEditor(row, col, visualizationName, value)` |
| `getAgGridCellPulldownOptionCountByPosition(row, col, visualizationName)` |
| `doubleClickGridCellByPosition(row, col, visualizationName)` |
| `getDeleteButtonByRow(row)` |

**Sub-components**
- getContainer
- getConfirmContainer

---

### InsertData
> Extends: `BaseContainer`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getAllInsertRowsCount()` |
| `getInsertRow(rowIndex)` |
| `getInsertColumns(rowIndex)` |
| `getInsertColumn(rowIndex, columnIndex)` |
| `getHeaderIdx(headerText)` |
| `getInsertTextBox(headerText, row, className, tagName = 'span')` |
| `clickHeaderElement(headerText)` |
| `inputInsertTextBox(inputText, inputElement)` |
| `waitForSliderDisappear(IsHidden = true)` |
| `typeInsertTextBox(inputText, inputElement)` |
| `inputInsertTextBoxWithEnter(inputText, inputElement)` |
| `getInsertDropdown(headerText, row)` |
| `clickOnInsertDropdown(headerIdx, row)` |
| `getInsertDropdownOverlay(dropdown)` |
| `getInsertSlider(slider)` |
| `dragSliderForInsertData(toOffset)` |
| `chooseInsertDropdownOption(option)` |
| `clickButton(button)` |
| `addNewRow()` |
| `getNumberOfRows()` |
| `deleteRow(row)` |
| `clickSwitchCell(row, headerIdx)` |
| `clickInsertDataCell(headerIdx, row)` |
| `clickDropdownInsertTextBox(headerIdx, row)` |

**Sub-components**
- getContainer

---

### TxnFirstUserExperience
> Extends: `DossierMojoEditor`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickDialogButton(name)` |
| `dismissDialogIfAppear()` |
| `getDeleteButtonByRow(row)` |

**Sub-components**
- docAuthBasePage

---

### TxnPopup
> Extends: `DossierMojoEditor`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectTransactionPausePopupOption(option)` |
| `clickOnCheckboxWithTitle(title)` |
| `getDeleteButtonByRow(row)` |

**Sub-components**
_none_

---

### TxnSwitch
> Extends: `AgGrid`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickSwitch(row, col, visualizationName, switchStyle)` |
| `getDeleteButtonByRow(row)` |

**Sub-components**
_none_
