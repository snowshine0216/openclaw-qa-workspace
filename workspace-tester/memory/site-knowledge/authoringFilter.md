# Site Knowledge: Authoring Filter Domain

## Overview

- **Domain key:** `authoringFilter`
- **Components covered:** BaseAuthoringFilters, MetricFilter, ParameterEditor, ParameterFilter
- **Spec files scanned:** 0
- **POM files scanned:** 4

## Components

### BaseAuthoringFilters
- **CSS root:** `.mstrmojo-Editor.mstrWaitBox.modal`
- **User-visible elements:**
  - Authoring Wait Loading (`.mstrmojo-Editor.mstrWaitBox.modal`)
- **Component actions:**
  - _none_
- **Related components:** _none_

### MetricFilter
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `changeMetricSliderByInputBox({ filterName, handle, value })`
  - `changeMetricSliderSelection({ filterName, optionName = null, lowerpos = null, upperpos = null })`
  - `changeMQSelection({ filterName, optionName, value1 = null, value2 = null })`
  - `clickHandle({ filterName, handle })`
- **Related components:** getMQContainer

### ParameterEditor
- **CSS root:** `.mstr-select-container__menu`
- **User-visible elements:**
  - Allowed Value Container (`.embedded-parameter-editor-dropdown`)
  - Allowed Value Dropdown (`#embedded-parameter-editor-allowed-value-control`)
  - Attribute Select Input (`.mstr-rc-standard-select__input`)
  - Close Btn (`.edt-title-btn.mstrmojo-Editor-close`)
  - Data Type Dropdown (`#embedded-parameter-editor-param-type-control`)
  - Data Type Dropdown Container (`.embedded-parameter-editor-dropdown`)
  - Description Input Box (`#embedded-parameter-editor-desc-input`)
  - Element List Dropdown (`.embedded-parameter-editor-dropdown`)
  - Object Select Dialog (`.mstr-rc-dialog-content`)
  - Parameter Editor (`.mstrmojo-Editor.mstrmojo-vi-ui-ParameterEditor.modal`)
  - Select Object Type Dropdown Container (`.mstr-select-container__menu`)
  - Tree Browser Loading Icon (`.mstrmojo-TreeBrowser.loading`)
  - Tree Node Loading (`.mstrmojo-TreeNode-text.loading`)
- **Component actions:**
  - `addDatasetObject({ type, folder, itemList })`
  - `availableItemCountForDashboardOP()`
  - `changeAllowedValue(allowedValue)`
  - `changeDataType(dataType)`
  - `clearSearchInput()`
  - `clickParameterEditorButton(btn)`
  - `clickSelectButton()`
  - `clickSelectFromBtn()`
  - `closeParameterEditor()`
  - `createDashboardObjectParameter({ name, description, objectList })`
  - `createElementListParameter(name, description, attributeName)`
  - `createReportObjectParameter({ name, description, object })`
  - `createValueParameter(name, description, dataType, allowedValue)`
  - `dragAndDropSelectedItem(itemFrom, itemTo, index = 0)`
  - `emptyTreeNodeText(folder)`
  - `emptyTreeNodeTextInSearchResult()`
  - `inputParameterDescription(description)`
  - `inputParameterName(name)`
  - `isItemChecked(item)`
  - `isItemDisabled(item)`
  - `isSelectBtnEnabled()`
  - `itemIcon(item)`
  - `moveFolderIntoViewPort(folder)`
  - `moveItemIntoViewPort(item)`
  - `moveObjectIntoViewPort(object)`
  - `multiSelectItem({ itemFrom, itemTo })`
  - `openFolder(folder)`
  - `removeSelectedItem(item)`
  - `searchObject(text)`
  - `selectAttribute(attribute)`
  - `selectedObjectItemCount()`
  - `selectedObjectItemText()`
  - `selectItemByText(text)`
  - `selectObjectType(objectType)`
- **Related components:** getAllowedValueContainer, getDataTypeDropdownContainer, getSelectObjectTypeDropdownContainer

### ParameterFilter
- **CSS root:** `.mstrmojo-DateTextBox-calendar`
- **User-visible elements:**
  - Calendar Container (`.mstrmojo-DateTextBox-calendar`)
- **Component actions:**
  - `chooseDateInParameter(filterName, year, month, day)`
  - `chooseDateInParameterWithOkButton(filterName, year, month, day)`
  - `chooseDateTimeInParameter(filterName, year, month, day, hour, minute, second, meridiem)`
  - `inputValueParameter(filterName, value)`
- **Related components:** getCalendarContainer, libraryAuthoringPage

## Common Workflows (from spec.ts)

1. _none_

## Common Elements (from POM + spec.ts)

1. Allowed Value Container -- frequency: 1
2. Allowed Value Dropdown -- frequency: 1
3. Attribute Select Input -- frequency: 1
4. Authoring Wait Loading -- frequency: 1
5. Calendar Container -- frequency: 1
6. Close Btn -- frequency: 1
7. Data Type Dropdown -- frequency: 1
8. Data Type Dropdown Container -- frequency: 1
9. Description Input Box -- frequency: 1
10. Element List Dropdown -- frequency: 1
11. Object Select Dialog -- frequency: 1
12. Parameter Editor -- frequency: 1
13. Select Object Type Dropdown Container -- frequency: 1
14. Tree Browser Loading Icon -- frequency: 1
15. Tree Node Loading -- frequency: 1

## Key Actions

- `addDatasetObject({ type, folder, itemList })` -- used in 0 specs
- `availableItemCountForDashboardOP()` -- used in 0 specs
- `changeAllowedValue(allowedValue)` -- used in 0 specs
- `changeDataType(dataType)` -- used in 0 specs
- `changeMetricSliderByInputBox({ filterName, handle, value })` -- used in 0 specs
- `changeMetricSliderSelection({ filterName, optionName = null, lowerpos = null, upperpos = null })` -- used in 0 specs
- `changeMQSelection({ filterName, optionName, value1 = null, value2 = null })` -- used in 0 specs
- `chooseDateInParameter(filterName, year, month, day)` -- used in 0 specs
- `chooseDateInParameterWithOkButton(filterName, year, month, day)` -- used in 0 specs
- `chooseDateTimeInParameter(filterName, year, month, day, hour, minute, second, meridiem)` -- used in 0 specs
- `clearSearchInput()` -- used in 0 specs
- `clickHandle({ filterName, handle })` -- used in 0 specs
- `clickParameterEditorButton(btn)` -- used in 0 specs
- `clickSelectButton()` -- used in 0 specs
- `clickSelectFromBtn()` -- used in 0 specs
- `closeParameterEditor()` -- used in 0 specs
- `createDashboardObjectParameter({ name, description, objectList })` -- used in 0 specs
- `createElementListParameter(name, description, attributeName)` -- used in 0 specs
- `createReportObjectParameter({ name, description, object })` -- used in 0 specs
- `createValueParameter(name, description, dataType, allowedValue)` -- used in 0 specs
- `dragAndDropSelectedItem(itemFrom, itemTo, index = 0)` -- used in 0 specs
- `emptyTreeNodeText(folder)` -- used in 0 specs
- `emptyTreeNodeTextInSearchResult()` -- used in 0 specs
- `inputParameterDescription(description)` -- used in 0 specs
- `inputParameterName(name)` -- used in 0 specs
- `inputValueParameter(filterName, value)` -- used in 0 specs
- `isItemChecked(item)` -- used in 0 specs
- `isItemDisabled(item)` -- used in 0 specs
- `isSelectBtnEnabled()` -- used in 0 specs
- `itemIcon(item)` -- used in 0 specs
- `moveFolderIntoViewPort(folder)` -- used in 0 specs
- `moveItemIntoViewPort(item)` -- used in 0 specs
- `moveObjectIntoViewPort(object)` -- used in 0 specs
- `multiSelectItem({ itemFrom, itemTo })` -- used in 0 specs
- `openFolder(folder)` -- used in 0 specs
- `removeSelectedItem(item)` -- used in 0 specs
- `searchObject(text)` -- used in 0 specs
- `selectAttribute(attribute)` -- used in 0 specs
- `selectedObjectItemCount()` -- used in 0 specs
- `selectedObjectItemText()` -- used in 0 specs
- `selectItemByText(text)` -- used in 0 specs
- `selectObjectType(objectType)` -- used in 0 specs

## Source Coverage

- `pageObjects/authoringFilter/**/*.js`
