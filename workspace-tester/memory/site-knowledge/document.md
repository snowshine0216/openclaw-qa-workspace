# Site Knowledge: document

> Components: 17

### BIWebRsdEditablePage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `WaitCurtain` | `#mstrWeb_waitCurtain` | element |
| `ErrorMessage` | `.mstrAlert` | element |

**Actions**
| Signature |
|-----------|
| `waitForErrorMessage()` |
| `getDocName()` |
| `getAccountName()` |
| `waitForCurtainDisappear(timeout = this.DEFAULT_LOADING_TIMEOUT)` |
| `waitForRsdLoad(timeout = this.DEFAULT_LOADING_TIMEOUT, message = timeout)` |

**Sub-components**
- getPage

---

### DocumentPage
> Extends: `WebBasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `LibraryIcon` | `.mstr-nav-icon.icon-library` | element |

**Actions**
| Signature |
|-----------|
| `goToLibrary()` |
| `findShareDialog()` |
| `open(projectID, documentID, libraryUrl = browser.options.baseUrl)` |
| `openDocument(documentID)` |
| `openRunWithPrompt(documentID)` |
| `runWithPrompt()` |
| `waitAllToBeLoaded()` |
| `backToFolder(sleep = 2000)` |
| `waitNewPageLoadByTitle(title)` |
| `selectLayout(tabName)` |
| `runWithPrompt()` |
| `clickBtnByText(text)` |
| `isDocContentPresent()` |
| `clickWidgetSelectionCheckbox(widgetKey)` |

**Sub-components**
- waitPage
- waitForPage

---

### DocumentToolbar
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `openTab(tabName)` |
| `select(tabName, menus)` |
| `clickButton(buttonTitle)` |

**Sub-components**
_none_

---

### GridAndGraph
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `QuickSwitchToolbar` | `.mstrmojo-portlet-titlebar.floating.visible` | element |

**Actions**
| Signature |
|-----------|
| `switchMode(modeName, fromFixedTitleBar)` |
| `titleBarHasQuickSwitch()` |
| `switchModeToGrid(fromFixedTitleBar)` |
| `switchModeToGraph(fromFixedTitleBar)` |
| `showQuickSwitch()` |
| `openQuickSwitchMenu(menuItem, fromFixedTitleBar)` |

**Sub-components**
_none_

---

### GroupBy
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `changeGroupBy(name)` |
| `getCurrentSelection()` |

**Sub-components**
_none_

---

### Layout
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectLayout(name, sleep = 2000)` |
| `getSelectedLayout()` |

**Sub-components**
_none_

---

### PanelSelector
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectPanelByName(name)` |
| `hoverToPanelByName(name)` |
| `getPanelBackgroundColorByName(name)` |

**Sub-components**
- setContainer
- getPanel

---

### PanelStack
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Content` | `.mstrmojo-DocSubPanel-content` | element |
| `CloseIcon` | `.mstrmojo-portlet-slot-toolbar .mstrmojo-ToolBar-outercell` | element |
| `PanelStackContextMenu` | `.mstrmojo-ui-Menu` | element |

**Actions**
| Signature |
|-----------|
| `closeInfoWindow()` |
| `hoverOnPanelstack()` |
| `hasPanelScrollBar(key)` |
| `isPanelPresent()` |
| `close()` |
| `clickPanelStackContextMenuItem(panelName, itemName)` |

**Sub-components**
- dossierPage
- getPanel

---

### RSDMenu
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Toolbar` | `#mstrHamburger` | element |
| `ToolbarList` | `#mstrToolbarList` | element |
| `SaveConfirmButton` | `#dialogBeforeSave` | element |

**Actions**
| Signature |
|-----------|
| `confirmSave()` |
| `openMenu(menuPaths)` |
| `openToolBarList()` |
| `closeToolBarList()` |
| `clickNthItemOfToolbarList(text, index)` |
| `clickNthItemOfZoomPopup(text, index)` |
| `isMenuItemPresent(item)` |

**Sub-components**
- getContainer

---

### RsdContextMenu
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `select(menuPaths)` |
| `isMenuPathPresent(menuPaths)` |

**Sub-components**
_none_

---

### RsdFilterPanel
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `MenuListItems` | `#mstrFilterPanelMenu` | element |

**Actions**
| Signature |
|-----------|
| `clickUnset()` |
| `clickApply()` |
| `openMenu()` |
| `clickSelectorMenu(name)` |
| `openAndChooseMenuByText(text)` |
| `scrollFilterPanel(toPosition)` |
| `scrollFilterPanelToBottom()` |
| `scrollFilterPanelToTop()` |
| `clickMenuNthItem(index, text)` |

**Sub-components**
- getScrollContainer

---

### RsdGraph
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectContextMenuOnRectArea(item, menuPaths)` |
| `rightClickOnRectArea(item)` |
| `clickGraphCell(graphIndex, cellText)` |
| `clickOnRectArea(item)` |
| `waitForGraphLoading()` |
| `getTooltipOnRectArea(item)` |
| `IsMenuPresentOnContextMenu(item, menuPaths)` |
| `isRsdGraphPresent()` |

**Sub-components**
_none_

---

### RsdGrid
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `RsdGrid` | `.mstrmojo-Xtab-content ` | element |

**Actions**
| Signature |
|-----------|
| `clickCell(cell)` |
| `rightClickCell(cell)` |
| `clickCellFromLocation(row, column)` |
| `scrollInGridToBottom()` |
| `scrollInGridToTop()` |
| `scrollGridCellIntoView(cell)` |
| `selectGridContextMenuOption(cell, optionText)` |
| `selectGridContextMenuOptionByOffset({ cell, optionText, x = 0, y = 0, checkClickable = true })` |
| `selectContextMenuOnCell(cell, menuPaths)` |
| `selectContextMenuOnCells(cells, menuPaths)` |
| `dragGridColumnWidth(index, toOffsetParam)` |
| `getData(opts = {})` |
| `getOneRowData(row)` |
| `adjustColumnWidth(index, toOffset)` |
| `getTableWidth()` |
| `IsMenuPresentOnContextMenu(cell, menuPaths)` |
| `isCellClickable(cell, index = 1)` |
| `selectCellInOneRow(row, startColumn, endColumn)` |
| `waitForGridLoaded()` |
| `isGridCellPresent(cell)` |
| `waitForLoaddingDisappear()` |
| `isCellDisplayed(name)` |
| `getFirstGridCell()` |
| `getFirstGridCellInRow(row)` |
| `getGridRows()` |
| `getTotalRows()` |
| `getGridCellInRow(row, column)` |
| `isGridCellInRowPresent(row, column)` |
| `isGridPresnt()` |

**Sub-components**
_none_

---

### RsdInfoWindow
> Extends: `PanelStack`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `CloseBtn` | `.mstrmojo-DocInfoWindow` | element |

**Actions**
| Signature |
|-----------|
| `createByPanelStackName(name)` |
| `closeInfoWindow(offset)` |
| `getInfoWindowLocation()` |
| `waitInfoWindowShown()` |
| `isDisplayed()` |
| `isCloseBtnDisplayed()` |

**Sub-components**
_none_

---

### TextField
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `TextFields` | `body` | element |

**Actions**
| Signature |
|-----------|
| `getHeight(textFieldText)` |
| `clickTextField(textFieldText)` |
| `clickTextFieldByKey(key, checkDocumentLoaded = true)` |
| `getTextFiledTitle(text)` |
| `isTextPresent(text)` |

**Sub-components**
_none_

---

### TitleBar
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SelectorMenu` | `#mstrSelectorMenu` | dropdown |

**Actions**
| Signature |
|-----------|
| `getTitleText()` |
| `clickTriageButton()` |
| `clickMenuItem(text)` |
| `clickTitle()` |
| `clickLeftArrow()` |
| `clickRightArrow()` |
| `isItemSelected(text)` |

**Sub-components**
_none_

---

### ViewFilterEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ViewFilter` | `.mstrmojo-Editor.mstrmojo-charcoalboxe.mstrmojo-FE.modal` | element |
| `BrowseElementsPopup` | `.mstrmojo-ElementsEditor.modal` | element |

**Actions**
| Signature |
|-----------|
| `addNewCondition()` |
| `switchConditionCreateType(buttonText)` |
| `addCondition(conditionPaths)` |
| `editCurrentCondition(conditionPaths)` |
| `applyCondition()` |
| `cancelCondition()` |
| `inputValue(value)` |
| `saveViewFilter()` |
| `cancelViewFilter()` |
| `openConditon(conditionName)` |
| `removeCondition(condition)` |
| `removeAllConditions()` |
| `switchNthGroupOperator(index)` |
| `selectNthGroupOperator(index, option)` |
| `openConditionCreateSetPanel(condition)` |
| `selectItemInCreateSetPanel(items)` |
| `selectRelatedByItem(item)` |
| `renameDynamicCondition(originName, newName)` |
| `searchAndSelectElements(searchText, selectItems)` |
| `getConditionCount()` |
| `isConditionItemPresent(item)` |
| `isNthOperatorGrouped(index)` |

**Sub-components**
- getSetItemInCreateSetPanel
- getOKButtonInCreateSetPanel
