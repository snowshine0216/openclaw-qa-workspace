# Site Knowledge: Transaction SQLEditor Domain

## Overview

- **Domain key:** `transactionSQLEditor`
- **Components covered:** DatabaseTable, DataSourceEditor, InputConfiguration, MappingEditor, TransactionConfigEditor, TXNConfigSQLEditor, TXNSQLEditorCheckbox, TXNSQLEditorDropdown, TXNSQLEditorInputNumField, TXNSQLEditorPopup, TXNSQLEditorTextField
- **Spec files scanned:** 0
- **POM files scanned:** 11

## Components

### DatabaseTable
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clearSearchForObject()`
  - `clickReplaceTableButton()`
  - `clickSearchButton()`
  - `getDeleteButtonByRow(row)`
  - `searchForObject(objectName)`
  - `setColumnCheckbox(name, isCheck)`
- **Related components:** _none_

### DataSourceEditor
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clearSearchForObject()`
  - `clickButtonOnFooter(name)`
  - `clickDatasourceFilterCheckbox(index)`
  - `clickNamespaceListButton(buttonName)`
  - `clickSelectAllFilter()`
  - `getAllTablePreviewColumnRowNames(length)`
  - `getSelectedDatasourceFilterCheckboxCount()`
  - `openDatasourceFilter()`
  - `scrollAndSelectItem(type, itemName)`
  - `searchDatasource(searchText)`
  - `searchForObject(objectName)`
  - `selectDataSourceItem(dbName)`
  - `selectItem(type, itemName)`
  - `selectItemInSuggestionList(type, searchKey, stringType)`
  - `setCheckboxForSelectAll(isActionCheck)`
  - `setNamespaceCheckbox(namespaceName, isActionCheck)`
  - `typeParameterToInputField(el, parameter)`
  - `validateNamespaceCheckbox(namespaceName, expectedStatus)`
  - `validatePreviewColumn(index, iconType, columnName, typeName)`
  - `validatePreviewColumnWIOOrder(length, iconType, columnName, typeName)`
  - `validateTableColumn(index, iconType, columnName, dbName, namespaceName, tableName)`
- **Related components:** getDatasourceListContainer

### InputConfiguration
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickControlType(value)`
  - `clickControlTypeSettingButton(value, txnType = 'SQL')`
  - `clickDropdown(type, value, currentOption)`
  - `clickDropdownOption(type, value, option)`
  - `clickExpandIcon()`
  - `getControlTypeForPython(value)`
  - `getControlTypeTextForPython(value)`
  - `getDeleteButtonByRow(row)`
  - `getDropdownOptionsCount()`
  - `isControlTypeAvailable(value)`
  - `isDropdownDisabled(type, value, expectedFlag)`
  - `isInputConfigPanelDisplayed()`
  - `setCheckbox(type, value, isActionCheck)`
  - `setControlType(type)`
  - `setControlTypeForVariable(type, value)`
  - `setDropdown(type, value, currentSelection, option)`
  - `setGridFieldForPython(value, currentSelection, option)`
  - `validateCheckbox(type, value, expectedEditStatus)`
  - `validateDropdown(type, value, currentSelection, isDisabled)`
- **Related components:** getInputConfigPanel, getTabContainer, tabContainer

### MappingEditor
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `deleteMappingItemRow(columnName)`
  - `getDeleteButtonByRow(row)`
  - `getDropdownOptions(columnName, currentSelection = 'placeholder')`
  - `setDropdown(columnName, currentSelection, option)`
  - `setWritebackCondition(columnName, isActionCheck)`
  - `validateConditionStatus(index, status)`
  - `validateDataTypeIcon(index, type)`
  - `validateDropdown(columnName, currentSelection)`
  - `validatTableColumnName(index, columnName)`
- **Related components:** _none_

### TransactionConfigEditor
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickAddTableButtonByText(name)`
  - `clickAfterSubmissionIcon()`
  - `clickButton(name, type='SQL')`
  - `clickFooterButtonByText(name)`
  - `clickMappedTable(tableName)`
  - `clickSwitchToMappingNotificationButton(buttonText)`
  - `clickTableColumn(columnName)`
  - `clickTableNameToAdd(name)`
  - `clickWhereClauseButtons(columnName)`
  - `getActionName()`
  - `getActiveTxnTab()`
  - `getDeleteButtonByRow(row)`
  - `getSubmissionErrorMessage(errorMessage)`
  - `getTopBarInTransactionEditor()`
  - `getWarningMessage(message)`
  - `inputConfigurationHeader(row)`
  - `modifyActionName(actionName)`
  - `selectTxnTab(name)`
  - `setPauseActions(isActionToggle)`
  - `waitForTransactionEditorLoaded()`
- **Related components:** baseFormatPanel

### TXNConfigSQLEditor
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickTableRefreshIcon()`
  - `getAutoCompleteItem(index)`
  - `selectSuggestionItem(name)`
  - `selectTxnView(name)`
  - `validateAutoCompleteItem(rowItem, itemName, iconType)`
- **Related components:** _none_

### TXNSQLEditorCheckbox
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `getDeleteButtonByRow(row)`
  - `setCheckbox(rootElement, isActionCheck)`
- **Related components:** _none_

### TXNSQLEditorDropdown
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickOnDropdown(rootElement, currentSelection)`
  - `clickOption(ddItem, ContentWindow_Height = 150)`
  - `getAllOptionNames()`
  - `getDeleteButtonByRow(row)`
  - `scrollAndCountOptions(ContentWindow_Height = 350)`
  - `setSelection(rootElement, currentSelection, selection)`
  - `setSelectionForElement(currentSelectionElement, optionElement)`
  - `setSelectionWithError(rootElement, selection)`
  - `setSelectionWithIcon(rootElement, currentSelection, selection)`
- **Related components:** _none_

### TXNSQLEditorInputNumField
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `getDeleteButtonByRow(row)`
  - `setInputNumField(rootElement, value)`
- **Related components:** _none_

### TXNSQLEditorPopup
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickAddValueButton(title)`
  - `clickDropdown(title, label, currentOption)`
  - `clickDropdownOption(option)`
  - `clickManualInputRowCloseIcon(title, rowIndex)`
  - `getDropdownOptionsCount()`
  - `getDropdownOptionsForDatasetProperty(title, label)`
  - `getInputErrorTooltip(tooltipMessage)`
  - `getSwitchErrorCell(title, row, col)`
  - `getSwitchInputCell(title, row, col)`
  - `hoverOnErrorInputNumField(title, label)`
  - `isDropdownDisabled(title, label, expectedFlag)`
  - `replaceTextByClickingOnElement(element, newValue)`
  - `setCheckbox(title, label, isActionCheck)`
  - `setDisplayMsgInput(title, newValue)`
  - `setDropdown(title, label, currentSelection, option)`
  - `setDropdownWithError(title, label, option)`
  - `setDropdownWithIcon(title, label, currentSelection, option)`
  - `setInputNumField(title, label, newValue)`
  - `setManualInputCell(title, rowIndex, colIndex, newValue)`
  - `setSwitchInputCell(title, row, col, newValue)`
  - `setTextField(title, label, newValue)`
  - `validateCheckbox(title, label, expectedEditStatus)`
  - `validateDropdown(title, label, currentSelection, isDisabled)`
- **Related components:** _none_

### TXNSQLEditorTextField
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `setTextField(rootElement, value)`
- **Related components:** _none_

## Common Workflows (from spec.ts)

1. _none_

## Common Elements (from POM + spec.ts)

1. _none_

## Key Actions

- `clearSearchForObject()` -- used in 0 specs
- `clickAddTableButtonByText(name)` -- used in 0 specs
- `clickAddValueButton(title)` -- used in 0 specs
- `clickAfterSubmissionIcon()` -- used in 0 specs
- `clickButton(name, type='SQL')` -- used in 0 specs
- `clickButtonOnFooter(name)` -- used in 0 specs
- `clickControlType(value)` -- used in 0 specs
- `clickControlTypeSettingButton(value, txnType = 'SQL')` -- used in 0 specs
- `clickDatasourceFilterCheckbox(index)` -- used in 0 specs
- `clickDropdown(title, label, currentOption)` -- used in 0 specs
- `clickDropdown(type, value, currentOption)` -- used in 0 specs
- `clickDropdownOption(option)` -- used in 0 specs
- `clickDropdownOption(type, value, option)` -- used in 0 specs
- `clickExpandIcon()` -- used in 0 specs
- `clickFooterButtonByText(name)` -- used in 0 specs
- `clickManualInputRowCloseIcon(title, rowIndex)` -- used in 0 specs
- `clickMappedTable(tableName)` -- used in 0 specs
- `clickNamespaceListButton(buttonName)` -- used in 0 specs
- `clickOnDropdown(rootElement, currentSelection)` -- used in 0 specs
- `clickOption(ddItem, ContentWindow_Height = 150)` -- used in 0 specs
- `clickReplaceTableButton()` -- used in 0 specs
- `clickSearchButton()` -- used in 0 specs
- `clickSelectAllFilter()` -- used in 0 specs
- `clickSwitchToMappingNotificationButton(buttonText)` -- used in 0 specs
- `clickTableColumn(columnName)` -- used in 0 specs
- `clickTableNameToAdd(name)` -- used in 0 specs
- `clickTableRefreshIcon()` -- used in 0 specs
- `clickWhereClauseButtons(columnName)` -- used in 0 specs
- `deleteMappingItemRow(columnName)` -- used in 0 specs
- `getActionName()` -- used in 0 specs
- `getActiveTxnTab()` -- used in 0 specs
- `getAllOptionNames()` -- used in 0 specs
- `getAllTablePreviewColumnRowNames(length)` -- used in 0 specs
- `getAutoCompleteItem(index)` -- used in 0 specs
- `getControlTypeForPython(value)` -- used in 0 specs
- `getControlTypeTextForPython(value)` -- used in 0 specs
- `getDeleteButtonByRow(row)` -- used in 0 specs
- `getDropdownOptions(columnName, currentSelection = 'placeholder')` -- used in 0 specs
- `getDropdownOptionsCount()` -- used in 0 specs
- `getDropdownOptionsForDatasetProperty(title, label)` -- used in 0 specs
- `getInputErrorTooltip(tooltipMessage)` -- used in 0 specs
- `getSelectedDatasourceFilterCheckboxCount()` -- used in 0 specs
- `getSubmissionErrorMessage(errorMessage)` -- used in 0 specs
- `getSwitchErrorCell(title, row, col)` -- used in 0 specs
- `getSwitchInputCell(title, row, col)` -- used in 0 specs
- `getTopBarInTransactionEditor()` -- used in 0 specs
- `getWarningMessage(message)` -- used in 0 specs
- `hoverOnErrorInputNumField(title, label)` -- used in 0 specs
- `inputConfigurationHeader(row)` -- used in 0 specs
- `isControlTypeAvailable(value)` -- used in 0 specs
- `isDropdownDisabled(title, label, expectedFlag)` -- used in 0 specs
- `isDropdownDisabled(type, value, expectedFlag)` -- used in 0 specs
- `isInputConfigPanelDisplayed()` -- used in 0 specs
- `modifyActionName(actionName)` -- used in 0 specs
- `openDatasourceFilter()` -- used in 0 specs
- `replaceTextByClickingOnElement(element, newValue)` -- used in 0 specs
- `scrollAndCountOptions(ContentWindow_Height = 350)` -- used in 0 specs
- `scrollAndSelectItem(type, itemName)` -- used in 0 specs
- `searchDatasource(searchText)` -- used in 0 specs
- `searchForObject(objectName)` -- used in 0 specs
- `selectDataSourceItem(dbName)` -- used in 0 specs
- `selectItem(type, itemName)` -- used in 0 specs
- `selectItemInSuggestionList(type, searchKey, stringType)` -- used in 0 specs
- `selectSuggestionItem(name)` -- used in 0 specs
- `selectTxnTab(name)` -- used in 0 specs
- `selectTxnView(name)` -- used in 0 specs
- `setCheckbox(rootElement, isActionCheck)` -- used in 0 specs
- `setCheckbox(title, label, isActionCheck)` -- used in 0 specs
- `setCheckbox(type, value, isActionCheck)` -- used in 0 specs
- `setCheckboxForSelectAll(isActionCheck)` -- used in 0 specs
- `setColumnCheckbox(name, isCheck)` -- used in 0 specs
- `setControlType(type)` -- used in 0 specs
- `setControlTypeForVariable(type, value)` -- used in 0 specs
- `setDisplayMsgInput(title, newValue)` -- used in 0 specs
- `setDropdown(columnName, currentSelection, option)` -- used in 0 specs
- `setDropdown(title, label, currentSelection, option)` -- used in 0 specs
- `setDropdown(type, value, currentSelection, option)` -- used in 0 specs
- `setDropdownWithError(title, label, option)` -- used in 0 specs
- `setDropdownWithIcon(title, label, currentSelection, option)` -- used in 0 specs
- `setGridFieldForPython(value, currentSelection, option)` -- used in 0 specs
- `setInputNumField(rootElement, value)` -- used in 0 specs
- `setInputNumField(title, label, newValue)` -- used in 0 specs
- `setManualInputCell(title, rowIndex, colIndex, newValue)` -- used in 0 specs
- `setNamespaceCheckbox(namespaceName, isActionCheck)` -- used in 0 specs
- `setPauseActions(isActionToggle)` -- used in 0 specs
- `setSelection(rootElement, currentSelection, selection)` -- used in 0 specs
- `setSelectionForElement(currentSelectionElement, optionElement)` -- used in 0 specs
- `setSelectionWithError(rootElement, selection)` -- used in 0 specs
- `setSelectionWithIcon(rootElement, currentSelection, selection)` -- used in 0 specs
- `setSwitchInputCell(title, row, col, newValue)` -- used in 0 specs
- `setTextField(rootElement, value)` -- used in 0 specs
- `setTextField(title, label, newValue)` -- used in 0 specs
- `setWritebackCondition(columnName, isActionCheck)` -- used in 0 specs
- `typeParameterToInputField(el, parameter)` -- used in 0 specs
- `validateAutoCompleteItem(rowItem, itemName, iconType)` -- used in 0 specs
- `validateCheckbox(title, label, expectedEditStatus)` -- used in 0 specs
- `validateCheckbox(type, value, expectedEditStatus)` -- used in 0 specs
- `validateConditionStatus(index, status)` -- used in 0 specs
- `validateDataTypeIcon(index, type)` -- used in 0 specs
- `validateDropdown(columnName, currentSelection)` -- used in 0 specs
- `validateDropdown(title, label, currentSelection, isDisabled)` -- used in 0 specs
- `validateDropdown(type, value, currentSelection, isDisabled)` -- used in 0 specs
- `validateNamespaceCheckbox(namespaceName, expectedStatus)` -- used in 0 specs
- `validatePreviewColumn(index, iconType, columnName, typeName)` -- used in 0 specs
- `validatePreviewColumnWIOOrder(length, iconType, columnName, typeName)` -- used in 0 specs
- `validateTableColumn(index, iconType, columnName, dbName, namespaceName, tableName)` -- used in 0 specs
- `validatTableColumnName(index, columnName)` -- used in 0 specs
- `waitForTransactionEditorLoaded()` -- used in 0 specs

## Source Coverage

- `pageObjects/transactionSQLEditor/**/*.js`
