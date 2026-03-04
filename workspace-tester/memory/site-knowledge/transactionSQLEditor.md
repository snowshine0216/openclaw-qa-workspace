# Site Knowledge: transactionSQLEditor

> Components: 11

### DataSourceEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getAllTablePreviewColumnRowNames(length)` |
| `selectDataSourceItem(dbName)` |
| `selectItem(type, itemName)` |
| `scrollAndSelectItem(type, itemName)` |
| `selectItemInSuggestionList(type, searchKey, stringType)` |
| `clickNamespaceListButton(buttonName)` |
| `setNamespaceCheckbox(namespaceName, isActionCheck)` |
| `typeParameterToInputField(el, parameter)` |
| `searchForObject(objectName)` |
| `clearSearchForObject()` |
| `clickButtonOnFooter(name)` |
| `validateNamespaceCheckbox(namespaceName, expectedStatus)` |
| `openDatasourceFilter()` |
| `clickSelectAllFilter()` |
| `setCheckboxForSelectAll(isActionCheck)` |
| `searchDatasource(searchText)` |
| `clickDatasourceFilterCheckbox(index)` |
| `getSelectedDatasourceFilterCheckboxCount()` |
| `validatePreviewColumn(index, iconType, columnName, typeName)` |
| `validatePreviewColumnWIOOrder(length, iconType, columnName, typeName)` |
| `validateTableColumn(index, iconType, columnName, dbName, namespaceName, tableName)` |

**Sub-components**
- getDatasourceListContainer

---

### DatabaseTable
> Extends: `TransactionConfigEditor`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `setColumnCheckbox(name, isCheck)` |
| `clickSearchButton()` |
| `clickReplaceTableButton()` |
| `searchForObject(objectName)` |
| `clearSearchForObject()` |
| `getDeleteButtonByRow(row)` |

**Sub-components**
_none_

---

### InputConfiguration
> Extends: `TransactionConfigEditor`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `isInputConfigPanelDisplayed()` |
| `clickExpandIcon()` |
| `clickControlTypeSettingButton(value, txnType = 'SQL')` |
| `getDropdownOptionsCount()` |
| `setDropdown(type, value, currentSelection, option)` |
| `clickDropdown(type, value, currentOption)` |
| `clickDropdownOption(type, value, option)` |
| `isDropdownDisabled(type, value, expectedFlag)` |
| `getControlTypeForPython(value)` |
| `getControlTypeTextForPython(value)` |
| `clickControlType(value)` |
| `isControlTypeAvailable(value)` |
| `setControlType(type)` |
| `setControlTypeForVariable(type, value)` |
| `setGridFieldForPython(value, currentSelection, option)` |
| `setCheckbox(type, value, isActionCheck)` |
| `validateDropdown(type, value, currentSelection, isDisabled)` |
| `validateCheckbox(type, value, expectedEditStatus)` |
| `getDeleteButtonByRow(row)` |

**Sub-components**
- getTabContainer
- tabContainer
- getInputConfigPanel

---

### MappingEditor
> Extends: `TransactionConfigEditor`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `setDropdown(columnName, currentSelection, option)` |
| `setWritebackCondition(columnName, isActionCheck)` |
| `deleteMappingItemRow(columnName)` |
| `validateDataTypeIcon(index, type)` |
| `validatTableColumnName(index, columnName)` |
| `validateDropdown(columnName, currentSelection)` |
| `validateConditionStatus(index, status)` |
| `getDropdownOptions(columnName, currentSelection = 'placeholder')` |
| `getDeleteButtonByRow(row)` |

**Sub-components**
_none_

---

### TXNConfigSQLEditor
> Extends: `TransactionConfigEditor`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickTableRefreshIcon()` |
| `selectTxnView(name)` |
| `selectSuggestionItem(name)` |
| `getAutoCompleteItem(index)` |
| `validateAutoCompleteItem(rowItem, itemName, iconType)` |

**Sub-components**
_none_

---

### TXNSQLEditorCheckbox
> Extends: `TransactionConfigEditor`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `setCheckbox(rootElement, isActionCheck)` |
| `getDeleteButtonByRow(row)` |

**Sub-components**
_none_

---

### TXNSQLEditorDropdown
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickOnDropdown(rootElement, currentSelection)` |
| `setSelection(rootElement, currentSelection, selection)` |
| `setSelectionWithIcon(rootElement, currentSelection, selection)` |
| `setSelectionWithError(rootElement, selection)` |
| `setSelectionForElement(currentSelectionElement, optionElement)` |
| `clickOption(ddItem, ContentWindow_Height = 150)` |
| `scrollAndCountOptions(ContentWindow_Height = 350)` |
| `getAllOptionNames()` |
| `getDeleteButtonByRow(row)` |

**Sub-components**
_none_

---

### TXNSQLEditorInputNumField
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `setInputNumField(rootElement, value)` |
| `getDeleteButtonByRow(row)` |

**Sub-components**
_none_

---

### TXNSQLEditorPopup
> Extends: `InputConfiguration`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `replaceTextByClickingOnElement(element, newValue)` |
| `replaceTextBySelectingElement(element, newValue)` |
| `setManualInputCell(title, rowIndex, colIndex, newValue)` |
| `clickAddValueButton(title)` |
| `clickManualInputRowCloseIcon(title, rowIndex)` |
| `getSwitchInputCell(title, row, col)` |
| `getSwitchErrorCell(title, row, col)` |
| `setSwitchInputCell(title, row, col, newValue)` |
| `getInputErrorTooltip(tooltipMessage)` |
| `getDropdownOptionsCount()` |
| `getDropdownOptionsForDatasetProperty(title, label)` |
| `setDropdown(title, label, currentSelection, option)` |
| `setDropdownWithIcon(title, label, currentSelection, option)` |
| `setDropdownWithError(title, label, option)` |
| `clickDropdown(title, label, currentOption)` |
| `clickDropdownOption(option)` |
| `isDropdownDisabled(title, label, expectedFlag)` |
| `setCheckbox(title, label, isActionCheck)` |
| `validateDropdown(title, label, currentSelection, isDisabled)` |
| `validateCheckbox(title, label, expectedEditStatus)` |
| `setInputNumField(title, label, newValue)` |
| `hoverOnErrorInputNumField(title, label)` |
| `setDisplayMsgInput(title, newValue)` |
| `setTextField(title, label, newValue)` |

**Sub-components**
_none_

---

### TXNSQLEditorTextField


**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `setTextField(rootElement, value)` |

**Sub-components**
_none_

---

### TransactionConfigEditor
> Extends: `DossierMojoEditor`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickTableNameToAdd(name)` |
| `clickSwitchToMappingNotificationButton(buttonText)` |
| `getActiveTxnTab()` |
| `selectTxnTab(name)` |
| `clickButton(name, type='SQL')` |
| `clickTableColumn(columnName)` |
| `clickWhereClauseButtons(columnName)` |
| `clickAddTableButtonByText(name)` |
| `clickFooterButtonByText(name)` |
| `clickAfterSubmissionIcon()` |
| `setPauseActions(isActionToggle)` |
| `getSubmissionErrorMessage(errorMessage)` |
| `getWarningMessage(message)` |
| `clickMappedTable(tableName)` |
| `getDeleteButtonByRow(row)` |
| `modifyActionName(actionName)` |
| `waitForTransactionEditorLoaded()` |
| `getActionName()` |
| `getTopBarInTransactionEditor()` |
| `inputConfigurationHeader(row)` |
| `clickDisabledTxnTab(name)` |
| `hoverDisabledTxnTab(name)` |
| `getTransactionTypeTooltipText()` |

**Sub-components**
- baseFormatPanel
