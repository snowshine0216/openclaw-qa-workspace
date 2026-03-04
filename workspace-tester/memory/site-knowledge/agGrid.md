# Site Knowledge: agGrid

> Components: 4

### AgGridVisualization
> Extends: `BaseContainer`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getGridCellTextByPosition(row, col, visualizationName)` |
| `getGridCellTextByPos(row, col, visualizationName)` |
| `getAGGridLoadingIcon()` |
| `getColumnsCount(isLeftPinArea, visualizationName)` |
| `getFirstOrLastPinnedColumns(isLeftPinArea, visualizationName)` |
| `getFirstOrLastPinnedColumn(isLeftPinArea, visualizationName)` |
| `getPinnedAreaIndicator(isLeftPinArea, visualizationName)` |
| `function(input)` |
| `getGridCellStyle(row, col, visualizationName, style)` |
| `addColumnSet()` |
| `addMicrochartSet()` |
| `toggleShowTotalsFromMetric(objectName, visualizationName)` |
| `toggleShowTotalsByContextMenu(visualizationName)` |
| `openMoreOptionsDialog(visualizationName)` |
| `setIncrementalFetchValue(value)` |
| `hoverIncrementalFetchHelpIcon()` |
| `applyIncrementalFetchSuggestedValue()` |
| `saveAndCloseMoreOptionsDialog()` |
| `cancelAndCloseMoreOptionsDialog()` |
| `clickOnColumnHeaderElement(elementName, visualizationName)` |
| `clickOnColumnHeaderElementTextArea(elementName, visualizationName)` |
| `openContextMenuItemForHeader(elementName, menuItem, visualizationName)` |
| `rightMouseClickOnElement(elem)` |
| `metricSortFromAgGrid(objectName, visualizationName, order)` |
| `RMConColumnHeaderElement(elementName, visualizationName)` |
| `openContextMenuItemForDZUnit(elementName, elementType, setName, menuItem)` |
| `clickOnSubMenuItem(menuItem, subMenuItem)` |
| `openAndClickSubMenuItemForElement(el, menuItem, subMenuItem)` |
| `openContextSubMenuItemForElement(el, menuItem, subMenuItem)` |
| `openContextSubMenuItemForHeader(elementName, menuItem, subMenuItem, visualizationName)` |
| `openContextSubMenuItemForCell(elementName, menuItem, subMenuItem, visualizationName)` |
| `clickOnSecondaryContextMenu(submenu)` |
| `clickOnAGGridCell(elementName, visualizationName)` |
| `hoverOnAGGridCell(elementName, visualizationName)` |
| `clickOnAGGridCells(elementNames, visualizationName)` |
| `doubleClickOnAGGridCells(elementNames, visualizationName, waitForLoadingDialog)` |
| `openContextMenuItemForValue(elementName, menuItem, visualizationName, waitForLoadingDialog = true)` |
| `openContextMenuItemForCellAtPosition(row, col, menuItem, visualizationName, waitForLoadingDialog = true)` |
| `openRMCMenuForValue(elementName, visualizationName)` |
| `openRMCMenuForCellAtPosition(row, col, visualizationName)` |
| `openRMCMenuForCellAtPositionAndSelectFromCM(row, col, visualizationName, option)` |
| `openRMCMenuForMicrochartAtPositionAndSelectFromCM(row, col, visualizationName, option)` |
| `openContextMenuItemForValues(elementNames, menuItem, visualizationName)` |
| `openContextMenuItemForHeaders(elementNames, menuItem, visualizationName)` |
| `openMenuItem(elementName, menuItem, visualizationName)` |
| `isContextMenuOptionPresentInHeaderCell(menuOption, cellText, visualizationName)` |
| `isPinIndicatorVisible(pinArea, visualization)` |
| `sortAscendingBySortIcon(elementName, visualizationName)` |
| `sortDescendingBySortIcon(elementName, visualizationName)` |
| `clearSortBySortIcon(elementName, visualizationName)` |
| `clickSortIcon(sortOrder)` |
| `toggleShowTotalsFromAttribute(objectName, visualizationName, subtotalOptions)` |
| `scrollVertically(direction, pixels, vizName)` |
| `scrollVerticallyDownToNextSlice(number, vizName)` |
| `scrollVerticallyToMiddle(vizName)` |
| `scrollVerticallyToBottom(vizName)` |
| `scrollHorizontally(direction, pixels, vizName)` |
| `scrollHorizontallyToNextSlice(number, vizName)` |
| `moveHorizontalScrollBar(direction, pixels, vizName)` |
| `moveVerticalScrollBar(direction, pixels, vizName)` |
| `moveVerticalScrollBarToBottom(vizName, pos)` |
| `scrollToGridCell(visualizationName, elementName)` |
| `selectMultipleElements(elements, visualizationName, waitForLoadingDialog = true)` |
| `expandGroupCell(el)` |
| `selectGroupHeaderUsingShift(elements_1, elements_2, menuItem, visualizationName)` |
| `collapseGroupCell(el)` |
| `getGridCellIconByPos(row, col, iconName, visualizationName)` |
| `getGridCellExpandIconByPos(row, col, visualizationName)` |
| `getGridCellCollapseIconByPos(row, col, visualizationName)` |
| `openThresholdEditorFromViz(objectName, visualizationName)` |
| `dragHeaderCellToRow(objectToDrag, position, targetHeader)` |
| `dragHeaderCellToCol(objectToDrag, position, targetHeader)` |
| `getCellAlignment(cell)` |
| `dragDSObjectToAGGridWithPositionInRow(objectName, objectTypeName, datasetName, desPosition, elementInRow, vizName)` |
| `dragDSObjectToAGGridWithPositionInColumnHeader(objectName, objectTypeName, datasetName, desPosition, elementInRow, vizName)` |
| `moveObjectToAGGridWithPositionInRow(objectName, desPosition, elementInRow, vizName)` |
| `clickSaveButtonOnGroup()` |
| `isAgGridCellHasTextDisplayed(row, col, visualizationName, text)` |
| `moveAttributeFormColumnToLeftFromContextMenu(row, col, visualizationName)` |
| `moveAttributeFormColumnToRightFromContextMenu(row, col, visualizationName)` |
| `getGridCellStyleByPos(row, col, style)` |
| `getGridCellStyleByCols(rowStart, rowEnd, col, style)` |
| `getGridCellStyleByRows(colStart, colEnd, row, style)` |
| `clickButtonInColumnLimitEditor(btn)` |
| `setColumnLimitInputBox(minOrMax, txt)` |
| `resizeAgColumnByMovingBorder(colIndex, pixels, direction, vizName)` |
| `clickSetColumnLimitLabel()` |
| `changeSubtotalPosition(cellToClick, newPosition, visualizationName, isHeader)` |
| `expandRA(elementName, visualizationName)` |
| `expandRAOnColumnHeader(headerName, visualizationName)` |
| `collapseRA(elementName, visualizationName)` |
| `collapseRAOnColumnHeader(headerName, visualizationName)` |
| `getRowIndexByCellText(cellText, visualizationName)` |
| `drillfromAttributeHeader(attributeName, drillToItem, visualizationName)` |
| `drillfromAttributeElement(elementName, drillToItem, visualizationName)` |
| `waitForAgGridLoadingIconNotDisplayed()` |
| `isCellInGridDisplayed(cellText, visualizationName)` |

**Sub-components**
- datasetPanel
- datasetsPanel
- dossierPage
- getContainer

---

### DashboardSubtotalsEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickButton(label)` |
| `closeSubtotalEditorByCancel()` |
| `saveAndCloseSubtotalEditor()` |
| `selectTypeCheckbox(type)` |
| `expandAcrossLevelSelector(type)` |
| `selectAttributeAcrossLevel(attribute)` |
| `selectAllAttributesAcrossLevel()` |
| `waitForSubtotalEditorVisible()` |
| `clickAddCustomSubtotalButton()` |
| `renameCustomSubtotalsName(newName)` |
| `customSubtotalsClickButton(label)` |
| `editCustomSubtotal()` |
| `removeCustomSubtotal()` |
| `hoverOverCustomSubtotalOptions(customSubtotalName)` |
| `clickSubtotalSelector(metricName)` |
| `setSubtotalTypeTo(metricName, subtotalType)` |

**Sub-components**
_none_

---

### DatabarConfigDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `isDatabarDialogOpened()` |
| `dataBarDialogTitleIsDisplayed(title)` |
| `changeDropdown(label, newOption)` |
| `clickBtn(btnTxt)` |
| `isMinMaxInputDisabled(minORmax)` |
| `isMinMaxInputInvalid(minORmax)` |
| `typeMinMaxValue(minORmax, value)` |
| `clickColorPicker(positiveORnegative)` |
| `verfiyPulldownCurrSelection(label, option)` |
| `clickCheckboxbyLabel(label)` |
| `isCheckboxchecked(label)` |

**Sub-components**
_none_

---

### MicrochartConfigDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `renameChart(name)` |
| `selectType(type)` |
| `selectObject(pulldownIndex, optionText)` |
| `confirmDialog()` |
| `cancelDialog()` |

**Sub-components**
_none_
