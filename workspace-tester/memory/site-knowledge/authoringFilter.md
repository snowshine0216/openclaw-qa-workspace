# Site Knowledge: authoringFilter

> Components: 4

### BaseAuthoringFilters
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AuthoringWaitLoading` | `.mstrmojo-Editor.mstrWaitBox.modal` | element |

**Actions**
| Signature |
|-----------|
| _none_ |

**Sub-components**
_none_

---

### MetricFilter
> Extends: `BaseAuthoringFilter`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `changeMQSelection({ filterName, optionName, value1 = null, value2 = null })` |
| `changeMetricSliderSelection({ filterName, optionName = null, lowerpos = null, upperpos = null })` |
| `clickHandle({ filterName, handle })` |
| `changeMetricSliderByInputBox({ filterName, handle, value })` |

**Sub-components**
- getMQContainer

---

### ParameterEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ParameterEditor` | `.mstrmojo-Editor.mstrmojo-vi-ui-ParameterEditor.modal` | element |
| `DescriptionInputBox` | `#embedded-parameter-editor-desc-input` | input |
| `CloseBtn` | `.edt-title-btn.mstrmojo-Editor-close` | button |
| `ObjectSelectDialog` | `.mstr-rc-dialog-content` | element |
| `SelectObjectTypeDropdownContainer` | `.mstr-select-container__menu` | dropdown |
| `TreeNodeLoading` | `.mstrmojo-TreeNode-text.loading` | element |
| `TreeBrowserLoadingIcon` | `.mstrmojo-TreeBrowser.loading` | element |
| `AttributeSelectInput` | `.mstr-rc-standard-select__input` | input |
| `ElementListDropdown` | `.embedded-parameter-editor-dropdown` | dropdown |
| `DataTypeDropdown` | `#embedded-parameter-editor-param-type-control` | element |
| `DataTypeDropdownContainer` | `.embedded-parameter-editor-dropdown` | dropdown |
| `AllowedValueDropdown` | `#embedded-parameter-editor-allowed-value-control` | element |
| `AllowedValueContainer` | `.embedded-parameter-editor-dropdown` | dropdown |

**Actions**
| Signature |
|-----------|
| `inputParameterName(name)` |
| `inputParameterDescription(description)` |
| `clickSelectFromBtn()` |
| `dragAndDropSelectedItem(itemFrom, itemTo, index = 0)` |
| `removeSelectedItem(item)` |
| `selectObjectType(objectType)` |
| `searchObject(text)` |
| `clickSelectButton()` |
| `clickParameterEditorButton(btn)` |
| `closeParameterEditor()` |
| `moveItemIntoViewPort(item)` |
| `selectItemByText(text)` |
| `clearSearchInput()` |
| `moveFolderIntoViewPort(folder)` |
| `moveObjectIntoViewPort(object)` |
| `openFolder(folder)` |
| `multiSelectItem({ itemFrom, itemTo })` |
| `addDatasetObject({ type, folder, itemList })` |
| `createReportObjectParameter({ name, description, object })` |
| `createDashboardObjectParameter({ name, description, objectList })` |
| `selectAttribute(attribute)` |
| `createElementListParameter(name, description, attributeName)` |
| `changeDataType(dataType)` |
| `changeAllowedValue(allowedValue)` |
| `createValueParameter(name, description, dataType, allowedValue)` |
| `isItemDisabled(item)` |
| `isItemChecked(item)` |
| `itemIcon(item)` |
| `availableItemCountForDashboardOP()` |
| `isSelectBtnEnabled()` |
| `selectedObjectItemCount()` |
| `selectedObjectItemText()` |
| `emptyTreeNodeText(folder)` |
| `emptyTreeNodeTextInSearchResult()` |

**Sub-components**
- getSelectObjectTypeDropdownContainer
- getDataTypeDropdownContainer
- getAllowedValueContainer

---

### ParameterFilter
> Extends: `BaseAuthoringFilter`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `CalendarContainer` | `.mstrmojo-DateTextBox-calendar` | element |

**Actions**
| Signature |
|-----------|
| `inputValueParameter(filterName, value)` |
| `chooseDateInParameter(filterName, year, month, day)` |
| `chooseDateInParameterWithOkButton(filterName, year, month, day)` |
| `chooseDateTimeInParameter(filterName, year, month, day, hour, minute, second, meridiem)` |

**Sub-components**
- libraryAuthoringPage
- getCalendarContainer
