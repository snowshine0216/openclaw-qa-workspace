# Site Knowledge: web_report

> Components: 12

### BaseReportPanel
> Extends: `WebBasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Panel` | `#td_mstrWeb_dockLeft` | element |

**Actions**
| Signature |
|-----------|
| `chooseTab(name)` |

**Sub-components**
- getPanel

---

### GridToolbar
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Toolbar` | `#report_toolbar` | element |

**Actions**
| Signature |
|-----------|
| `getDataRows()` |
| `getDataColumns()` |
| `switchToNextPage()` |
| `switchToNextColumnPage()` |
| `isReportBarPresent()` |

**Sub-components**
_none_

---

### ReportDetailsPage
> Extends: `WebBasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `close()` |
| `clickAdvanvcedBtn()` |
| `getAdvancedRowsNum()` |
| `getAdvancedColsNum()` |
| `waitForDetailsPageLoaded()` |
| `waitForReportDetailsLoaded()` |

**Sub-components**
_none_

---

### ReportDetailsPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getFilterText()` |
| `getViewFilterText()` |
| `filterIsEmpty()` |
| `close()` |
| `isDetailsPanelPresent()` |

**Sub-components**
_none_

---

### ReportGrid
> Extends: `WebBaseGrid`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Grid` | `#table_UniqueReportID` | element |
| `Graph` | `.graphImgContainer` | element |
| `ReportGrid` | `#reportViewAllModes` | element |

**Actions**
| Signature |
|-----------|
| `getCellValueByPosition(row, column)` |
| `getHeaderSortIcon(cellText)` |
| `clickHeaderSortIcon(cellText)` |
| `isCellOnGrid(cellText)` |
| `getSortIconTitle(cellText)` |
| `getGridMode()` |

**Sub-components**
_none_

---

### ReportGridContextMenu
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `select(menus)` |
| `clickOk()` |
| `clickCancel()` |
| `selectMenuEditorItems(itemTexts)` |
| `isMenuPathPresent(menuPaths)` |

**Sub-components**
_none_

---

### ReportObjectsPanel
> Extends: `BaseReportPanel`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ContextMenu` | `.mstrContextMenuRight` | element |

**Actions**
| Signature |
|-----------|
| `openContextMenu(item)` |
| `selectContextMenu(menuPaths)` |
| `expandItem(item)` |
| `isDerivedMetric(name)` |
| `isDerivedAttribute(name)` |
| `isItemPresent(item)` |
| `isItemAttrFormPresent(item, attrForm)` |

**Sub-components**
- getReportObjectPanel

---

### ReportPageBy
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ReportPageBy` | `#pbb_PageByStyle` | element |
| `SearchResultsList` | `.mstrmojo-ReportQuickSearch-Suggest` | element |

**Actions**
| Signature |
|-----------|
| `pageBy(attr, item)` |
| `search(text)` |
| `clearSearch()` |
| `close()` |
| `isPageByDisplayed()` |
| `getSearchResultCount()` |
| `isItemSelected(attr, item)` |

**Sub-components**
- getSearchboxContainer

---

### ReportPromptDetails
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Element` | `#promptDetails_PromptDetailsStyle` | element |

**Actions**
| Signature |
|-----------|
| `getPromptDetailsText()` |
| `isPromptDetailsPresent()` |

**Sub-components**
_none_

---

### ReportToolbar
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FirstToolbar` | `#ribbonToolbarTabsListContainer` | element |
| `FloatingMenu` | `.select-free.mstrFloatingMenu` | dropdown |

**Actions**
| Signature |
|-----------|
| `openTab(tabName)` |
| `openFloatingMenu(tabName)` |
| `select(tabName, menus)` |
| `clickButton(buttonTitle)` |
| `openToolsMenu(tabName, menuItem)` |
| `isButtonEnabled(buttonTitle)` |
| `isButtonDisabled(buttonTitle)` |
| `isMenuItemDisplayed(menuItem)` |
| `isMenuItemSelected(menuItem)` |
| `cancelReport()` |

**Sub-components**
_none_

---

### ReportViewFilter
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ViewFilterContainer` | `#vfep_pane` | element |
| `ConditionFunctionTypeDropDown` | `#functionAndFunctionTypeCombo` | element |

**Actions**
| Signature |
|-----------|
| `getFilterRemoveButton(item)` |
| `getFilterShiftDownButton(item, orientation)` |
| `openFilterEditPanel(item)` |
| `applyFilter()` |
| `removeFilter(item)` |
| `addCondition()` |
| `selectFilterOption(optionName)` |
| `selectFilterActionType(typeName)` |
| `selectConditionDataType(optionName)` |
| `selectConditionFunctionType(optionName)` |
| `inputValueForQualify(value)` |
| `applyCondition()` |
| `clearAllFilter()` |
| `clearAllFilterAndSave()` |
| `selectAvailableOption(optionName)` |
| `removeSelectedOption(optionName)` |
| `inputSearchText(text)` |
| `getAvailableOptionText()` |
| `getSelectOptionText()` |
| `multiSelectAvailableOptions(options)` |
| `multiRemoveSelectedOptions(options)` |
| `addAllSelections()` |
| `removeAllSelections()` |
| `clickAutoApplyButton()` |
| `clickApplyChangesButton()` |
| `shiftFilter(filterName, orientation)` |
| `applyGroupByIndex(index)` |
| `cancelGroupByIndex(index)` |
| `openCalendarTable()` |
| `SelectDayInCalendar(day)` |
| `closeViewFilterPanel()` |

**Sub-components**
- getPanel

---

### WebReportPage
> Extends: `WebBasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ReportLayout` | `.repLayout.viewMode` | element |

**Actions**
| Signature |
|-----------|
| `open(reportID, params)` |
| `findShareDialog()` |
| `openReportToolbarMenu(tab, menuPaths)` |
| `openReportPanel(name)` |
| `waitContentLoading()` |

**Sub-components**
- reportPage
- reportObjectsPanel
- reportDetailsPage
- baseReportPanel
