# Site Knowledge: base

> Components: 12

### BaseAuthoring
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `MenuContainer` | `.mstrmojo-ui-Menu-item-container` | element |

**Actions**
| Signature |
|-----------|
| `clickMenuOptionInLevel({ level, option })` |
| `clickMenuOptions({ firstOption, secondOption, thirdOption })` |

**Sub-components**
- getMenuContainer

---

### BaseBotConfigTab
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Tooltip` | `.mstr-ai-chatbot-Tooltip` | element |
| `BotTitle` | `.mstrd-DossierTitle-segment` | element |

**Actions**
| Signature |
|-----------|
| `getTooltipFullText()` |
| `getTooltipDisplayedText()` |
| `waitForTooltipDisplayed()` |
| `scrollToBottom()` |
| `scrollToTop()` |
| `resetInput({ elem })` |
| `dismissFocus()` |

**Sub-components**
- getCurrentTabContainer

---

### BaseComponent
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `scrollIntoView(option)` |

**Sub-components**
_none_

---

### BaseDialog
> Extends: `WebBasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Dialog` | `.mstrDialogBone` | element |

**Actions**
| Signature |
|-----------|
| `apply()` |
| `confirm()` |
| `cancel()` |

**Sub-components**
_none_

---

### BaseFilter
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FilterMainPanel` | `.mstrd-FilterPanel` | element |
| `SecondaryPanel` | `.mstrd-FilterDetailsPanel` | element |
| `ContextMenu` | `.mstrd-FilterItemContextMenu-menu` | element |
| `ErrorTooltip` | `.ant-tooltip-content` | element |

**Actions**
| Signature |
|-----------|
| `openSecondaryPanel(filterName)` |
| `closeSecondaryPanel(filterName)` |
| `openContextMenu(filterName)` |
| `selectContextMenuOption(filterName, menuName)` |
| `hoverOnCircularIcon(filterName)` |
| `hoverOnFilterName(filterName)` |
| `removeCapsuleByName({ filterName, capsuleName })` |
| `isCapsuleExcluded({ filterName, capsuleName })` |
| `isCapsuleHighlighted(filterName, capsuleName)` |
| `capsuleCount(filterName)` |
| `filterSelectionInfo(name)` |
| `capsuleName(filterName, index = 0)` |
| `isCapsulePresent({ filterName, capsuleName })` |
| `isSecondaryPanelPresent()` |
| `isCircularFilterIconPresent(filterName)` |
| `isDotLineHighlighted(filterName)` |
| `isResetOptionPresent()` |
| `appliedFilterCount()` |
| `isContextMenuOptionPresent(option)` |
| `isContextMenuOptionDisabled(option)` |
| `isContextMenuDotsPresent(filterName)` |
| `isMendatoryIconByNameDisplayed(filterName)` |
| `filterContainers()` |
| `isGlobalFilterIconPresent(filterName)` |
| `getFilterWarningText(name)` |
| `getFilterErrorTooltipText()` |
| `getFilterDateRangeWarningText(name)` |
| `isFilterDateRangeWarningDisplayed(name)` |

**Sub-components**
- filterPanel
- getFilterContainer
- getSecondaryPanel

---

### BaseGrid
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Grid` | `#table_UniqueReportID` | element |

**Actions**
| Signature |
|-----------|
| `clickCell(cell, index = 1)` |
| `clickCellFromLocation(row, column)` |
| `clickCellLink(link)` |
| `selectContextMenuOnCell(cell, menuPaths)` |
| `selectContextMenuOnCells(cells, menuPaths)` |
| `getTableWidth()` |
| `getColumnWidth(cellContent)` |
| `getCellData(row, column)` |
| `getOneRowData(row)` |
| `getOneRowDataFromBottom(row)` |
| `getCellCssValue(row, column, cssName)` |
| `openContextMenu(cell)` |
| `IsMenuPresentOnContextMenu(cell, menuPaths)` |
| `waitForGridLoaded()` |
| `getRowCount()` |
| `isCellClickable(cell, index = 1)` |
| `isCellDisplayed(name)` |

**Sub-components**
_none_

---

### BaseLibrary
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `DossierListContainer` | `.ReactVirtualized__Grid` | element |
| `DossierListContainerHeight` | `.ReactVirtualized__Grid__innerScrollContainer` | element |
| `DossierContextMenu` | `.mstrd-ContextMenu` | element |
| `ContextMenuDropdown` | `.ant-popover-inner-content` | element |
| `DossierContextMenuMobile` | `.mstrd-ContextMenu-menu` | element |
| `DossierSecondaryContextMenu` | `.ant-dropdown-menu.ant-dropdown-menu-sub` | dropdown |
| `MultiSelectButton` | `.mstrd-SelectionModeNavItemContainer-icon` | dropdown |
| `EmptyLibrary` | `.mstrd-EmptyLibrary` | element |
| `ClearFilterButton` | `.mstrd-EmptyLibraryFromFilter-clear` | element |
| `DeleteConfirmationWindow` | `.mstrd-MessageBox-main` | element |
| `TitleElement` | `.mstrd-NavBarTitle > .mstrd-NavBarTitle-item.mstrd-NavBarTitle-item-active` | element |

**Actions**
| Signature |
|-----------|
| `getItemsCount()` |
| `getLastItem()` |
| `moveDossierIntoViewPort(name, owner = null)` |
| `renderNextBlock(count)` |
| `loadUntilRendered({ name, count = 0, attempt = 1, owner = null })` |
| `scrollToBottom()` |
| `scrollToTop()` |
| `isDossierItemElementInViewport(dossierItemElem)` |
| `openSortMenu()` |
| `openCombinedModeSortMenu()` |
| `quickSort()` |
| `closeSortMenu()` |
| `selectSortOption(option = 'Content Name')` |
| `selectSortOrder(order)` |
| `hoverQuickSort()` |
| `hoverFilter()` |
| `clickFilterIcon()` |
| `closeFilterPanel()` |
| `selectFilterOptionButton(option)` |
| `clickFilterApply()` |
| `clickFilterClearAll()` |
| `clearFilters()` |
| `isItemViewable(name, owner = null)` |
| `currentSortOption()` |
| `hoverOnDossierName(dossierName)` |
| `confirmDelete()` |
| `cancelDelete()` |
| `title()` |
| `itemInfo(name)` |
| `itemSharedByTimeInfo(name)` |
| `isItemCertified(name)` |
| `isItemDocument(name)` |
| `isCommentCountDisplayed(name)` |
| `currentSortStatus()` |
| `currentSortOrder()` |
| `isSortMenuOpen()` |
| `isDossierSelected()` |
| `isEditIconDisplayedInContextMenu()` |
| `isItemDisplayedInContextMenu(item)` |
| `allItemList()` |
| `lastItem()` |
| `firstTwoItems()` |
| `isDeleteWindowPresent()` |
| `titleFont()` |
| `getContextMenuList(isMobile = false)` |

**Sub-components**
- getDossierListContainer

---

### BasePage


**Locators**
| Name | CSS | Type |
|------|-----|------|
| `MstrRoot` | `#mstrd-Root` | element |
| `BackButton` | `.mstr-nav-icon.icon-backarrow_rsd` | element |
| `TooltipContainer` | `[class*=tooltip-inner]` | element |
| `MojoTooltip` | `.mstrmojo-Tooltip-content` | element |
| `DocView` | `.mstrmojo-DocLayoutViewer-layout` | element |
| `Tooltip` | `.ant-tooltip-inner` | element |
| `TooltipText` | `.ant-tooltip-inner` | element |
| `ErrorMessage` | `#mstrWeb_error .mstrAlertMessage` | element |
| `AntDropdown` | `.ant-select-dropdown:not(.ant-select-dropdown-hidden)` | dropdown |
| `MojoWait` | `.mojo-overlay-wait` | element |
| `LoadingLabel` | `.mstrd-Loadable-icon` | element |
| `ErrorDialogue` | `.mstrd-MessageBox` | element |
| `MojoErrorDialogue` | `.mstrmojo-Editor.mstrmojo-alert.modal` | element |
| `ProgressBar` | `.mstrd-progressBar` | element |

**Actions**
| Signature |
|-----------|
| `getCurrentPageByKey()` |
| `getDocLayout()` |
| `safeGetElement(target, desc, waitTime = this.DEFAULT_LOADING_TIMEOUT)` |
| `viewErrorDetails()` |
| `errorMessage()` |
| `executeScript(...args)` |
| `sleep(duration)` |
| `wait(...condition)` |
| `resizeWindow(width, height)` |
| `getBrowserTabs()` |
| `switchToWindow(tabInstance)` |
| `currentURL()` |
| `closeCurrentTab()` |
| `switchToTab(tabIndex)` |
| `switchToNewWindowWithUrl(url)` |
| `switchToNewWindow()` |
| `closeTab(index)` |
| `closeAllTabs()` |
| `closeAllSecondaryTabs()` |
| `tabCount()` |
| `waitDocumentToBeLoaded(checkDocumentLoaded = true)` |
| `isWaitingPageDisplayed()` |
| `waitPageLoading()` |
| `activeElement()` |
| `activeElementText()` |
| `hideElement(el)` |
| `fakeElementText(el, text = 'fakeText')` |
| `getTitle(el)` |
| `getInputValue(el)` |
| `getInnerText(el)` |
| `waitDataLoaded()` |
| `waitPageRefresh()` |
| `showElement(el)` |
| `getLabelValue(el)` |
| `getHeightValue(el)` |
| `getFontFamily(el)` |
| `getCSSProperty(el, property)` |
| `dismissError()` |
| `dismissErrorByText(text)` |
| `waitForMojoError()` |
| `waitForError()` |
| `dismissMojoError()` |
| `clickMojoErrorButton(text)` |
| `clickErrorActionButton(buttonName)` |
| `clickErrorActionButtonNoWait(buttonName)` |
| `getI18NFormattedDate(day, month, year)` |
| `setTextToClipboard(text)` |
| `getI18NCalendarStartWeekDay()` |
| `openCustomAppById({ id, dossier = false, check_flag = true })` |
| `openDefaultApp()` |
| `previousPage()` |
| `input(keyword)` |
| `enter()` |
| `arrow(direction)` |
| `delete()` |
| `ctrlA()` |
| `ctrlF()` |
| `copy()` |
| `paste()` |
| `esc()` |
| `space()` |
| `tab(repeatTimes = 0)` |
| `f6(loopCount = 1)` |
| `home()` |
| `end()` |
| `ctrlHome()` |
| `ctrlEnd()` |
| `shiftTab(repeatTimes = 0)` |
| `shiftEnter()` |
| `navigateUpWithArrow(loopCount = 1)` |
| `navigateUpUsingShiftArrow(loopCount)` |
| `navigateDownWithArrow(loopCount = 1)` |
| `navigateDownUsingShiftArrow(loopCount)` |
| `navigateRightWithArrow(loopCount = 1)` |
| `navigateLeftWithArrow(loopCount = 1)` |
| `tabForward(loopCount = 1)` |
| `tabBackward(loopCount = 1)` |
| `tabToElement(elem, options = {})` |
| `isFocused(elem)` |
| `isFocusedElement(elem)` |
| `arrowUp()` |
| `arrowDown()` |
| `arrowLeft()` |
| `arrowRight()` |
| `clickAndNoWait({ elem, offset = { x: 0, y: 0 } }, checkClickable = true)` |
| `performClickAction({ type = 'pointer', button = 0, x = 0, y = 0 })` |
| `clickByXYPosition({ elem, x = 0, y = 0, checkClickable = true })` |
| `clickByXYPositionNoWait({ elem, x, y })` |
| `clickWithOffset({ elem, offset = { x: 0, y: 0 } })` |
| `click({ elem, offset = { x: 0, y: 0 }, checkClickable = true })` |
| `clickOnElement(elem)` |
| `clickByForce({ elem, offset = { x: 0, y: 0 } })` |
| `clickByPresence({ elem, offset = { x: 0, y: 0 } })` |
| `clickForSafari(elem)` |
| `doubleClick({ elem, offset = { x: 0, y: 0 } })` |
| `doubleClickOnElement(elem)` |
| `ctrlClick({ elem, offset = { x: 0, y: 0 }, checkClickable = true })` |
| `moveAndClickByOffsetFromMultiElements({ elements, offset = { x: 0, y: 0 } })` |
| `clear({ elem }, isPrompted = false)` |
| `rightClick({ elem, offset = { x: 0, y: 0 }, checkClickable = true })` |
| `rightClickByXYPosition({ elem, x = 0, y = 0, checkClickable = true })` |
| `rightClickWithOffset({ elem, offset = { x: 0, y: 0 } })` |
| `rightMouseClickOnElement(elem)` |
| `hoverWithoutWait({ elem, offset = { x: 0, y: 0 }, useBrowserActionForSafari = false })` |
| `hover({ elem, offset = { x: 0, y: 0 }, useBrowserActionForSafari = false })` |
| `hoverMouseOnElement(elem)` |
| `hoverMouseAndClickOnElement(element)` |
| `hoverForICSTooltip({ elem, offset = { x: 0, y: 0 } })` |
| `dismissPreloadDropdown({ elem, offset = { x: 0, y: 0 } })` |
| `hoverWithoutPause({ elem, offset = { x: 0, y: 0 } })` |
| `elemSupportsActionOnSafari(elem)` |
| `hoverForSafari({ elem, offset = { x: 0, y: 0 } })` |
| `multiSelectElements({ elem1, elem2 })` |
| `shiftClick({ elem, offset = { x: 0, y: 0 } })` |
| `multiSelectElementsUsingShift(headElement, tailElement)` |
| `selectAll(elem)` |
| `dragAndDrop({ fromElem, fromOffset = { x: 0, y: 0 }, toElem, toOffset = { x: 0, y: 0 } })` |
| `dragAndDropForCondition({ fromElem, toElem })` |
| `dragAndDropByInterval({ fromElem, fromOffset = { x: 0, y: 0 }, toElem, toOffset = { x: 0, y: 0 } })` |
| `dragAndDropForSafari({ fromElem, fromOffset = { x: 0, y: 0 }, toElem, toOffset = { x: 0, y: 0 } })` |
| `dragAndDropForAuthoring({ fromElem, fromOffset = { x: 0, y: 0 }, toElem, toOffset = { x: 0, y: 0 } })` |
| `dragAndDropForAuthoringWithOffset({
        fromElem, fromOffset = { x: 0, y: 0 }, toElem, toOffset = { x: 0, y: 0 }, speedFactor = 1, })` |
| `dragAndDropPixelByPixel(src_location, tar_location)` |
| `dragAndDropByPixel(element, xPixels = 0, yPixels = 0, waitForLoadingDialog)` |
| `releasePointer()` |
| `getElementPositionOfScreen(elem, offset = { x: 0, y: 0 })` |
| `typeKeyboard(keys)` |
| `mouseClick(el, eventData)` |
| `moveToElement(el, offset = { x: 0, y: 0 })` |
| `moveToPosition({ x, y })` |
| `getElementHeight(element)` |
| `scrollDownToTargetOption(listContent, wholeList, item, pixel = 150)` |
| `renameTextField(newName)` |
| `scrollDown(elem, offset)` |
| `scrollOnPage(toPosition)` |
| `scrollPageToTop()` |
| `scrollPageToBottom()` |
| `waitForElementPresence(el, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' })` |
| `waitForElementInvisible(el, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '', interval: undefined })` |
| `waitForElementStaleness(el, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' })` |
| `waitForTextPresentInElementValue(el, txt, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' })` |
| `waitForElementClickable(el, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' })` |
| `waitForElementEnabled(el, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' })` |
| `waitForElementDisabled(el, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' })` |
| `waitForDynamicElementLoading()` |
| `waitForLibraryLoading()` |
| `waitForItemLoading()` |
| `waitForPageIndicatorInvisible()` |
| `waitForCurtainDisappear()` |
| `waitForCondition(conditionFunc, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' })` |
| `waitForElementVisible(el, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' })` |
| `waitForElementVisibleInTeams(el, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' })` |
| `waitForEitherElemmentVisible(el1, el2, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' })` |
| `waitForElementExsiting(el, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' })` |
| `waitForTextAppearInElement(el, text, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' })` |
| `waitForTextUpdated(el, text, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' })` |
| `waitForElementAppearAndGone(el)` |
| `waitForPageLoadByTitle(title, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' })` |
| `waitForPageLoadByUrl(title, options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' })` |
| `waitForPendoToBeInitialized(options = { timeout: this.DEFAULT_LOADING_TIMEOUT, msg: '' })` |
| `waitForProcessorDisappear()` |
| `waitForErrorMessage()` |
| `tooltip()` |
| `mojoTooltip()` |
| `isTooltipDisplayed(tooltip)` |
| `isErrorPresent()` |
| `isErrorActionButtonPresent(buttonName)` |
| `isMojoErrorPresent()` |
| `errorTitle()` |
| `showDetails()` |
| `errorDetails()` |
| `getBrowserData(script, domElement)` |
| `dragMoveAndDrop(source, target)` |
| `dragAndDropObjectWithExtraMove(movingElement, targetElement, moveX = 0, moveY = 0, waitForLoadingDialog = false)` |
| `clickOnElementByInjectingScript(element)` |
| `isSelected(el, key = 'selected')` |
| `isUnSelected(el, key = 'unselected')` |
| `isChecked(el)` |
| `isCollapsed(el)` |
| `isOn(el)` |
| `getSelected(els, key = 'selected')` |
| `elemSupportsClickMethodOnSafari(elem)` |
| `errorMsg()` |
| `mojoErrorMsg()` |
| `isDisabled(el)` |
| `isAriaDisabled(el)` |
| `isAriaReadOnly(el)` |
| `isAriaChecked(el)` |
| `isAiraSelected(el)` |
| `isDisabledStatus(el)` |
| `isHidden(el)` |
| `isActive(el)` |
| `isExpanded(el)` |
| `isExisted(item, els, attribute = 'value')` |
| `switchToNewWindowWithLink(link)` |
| `waitForDownloadComplete(name, fileType)` |
| `getClipboardText()` |
| `moveToTopLeftCorner()` |
| `clickTopLeftCorner()` |
| `isElementVisible(element, timeout = this.DEFAULT_LOADING_TIMEOUT)` |
| `isElementPresent(element)` |
| `scrollIntoView(element, options = { block: 'nearest', inline: 'nearest', behavior: 'smooth' }, attributeName = 'class')` |
| `setValueByJavaScript({ element, value, shouldEnter = false })` |
| `setInputValue({ element, value})` |

**Sub-components**
- getCurrentPage
- waitForPage
- getWaitingPage
- isWaitingPage
- getPage
- dossierPage
- getErrorDialogMainContainer
- getTooltipContainer

---

### BasePageDialog
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `confirm()` |
| `cancel()` |
| `close()` |
| `isDialogPresent()` |

**Sub-components**
_none_

---

### BasePrompt
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getPromptByName(promptName)` |
| `waitForPromptDetail(promptName)` |
| `selectPromptByIndex({ index, promptName })` |
| `selectPromptByTitle(promptTitle)` |
| `isAnswerRequired(index)` |
| `errorMsg(promptElement)` |
| `isErrorDisplayed(promptElement)` |
| `getPromptsNumber()` |

**Sub-components**
_none_

---

### BaseVisualization
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `VizLoadingSpinner` | `.mstrd-LoadingIcon-content` | element |
| `ViewFilterContainer` | `.mstrmojo-viz-fe-menu` | element |
| `VizTooltipContainer` | `.vis-tooltip` | element |
| `SettingMenu` | `.mstrmojo-ui-Menu-item-container` | element |

**Actions**
| Signature |
|-----------|
| `getContainerByTitleInCurrentPage(title)` |
| `getContextMenuTitlesByLevel(level, pageBy = false)` |
| `getViewFilterItemByIndex()` |
| `clickNlgCopyBtn(title)` |
| `checkNlgCopyBtnStatus(testCase, imageName, tolerance = 0.5)` |
| `checkVizContainerMenu(testCase, imageName, tolerance = 0.5)` |
| `checkVizContainerByTitle(vizTitle, testCase, imageName, tolerance = 0.5)` |
| `restoreContainer(title)` |
| `maximizeContainer(title)` |
| `minimizeLegend(title)` |
| `maximizeLegend(title)` |
| `closeLegend(title)` |
| `clickTopOfContextMenuForSafari()` |
| `clickElmAndWait(elm)` |
| `openContextMenu({ elem, offset, clickContextMenuWhenOpen = false })` |
| `rightClickTitleBoxNoWait(title)` |
| `clickContextMenu(el, prompted = false)` |
| `clickMenuOptionInLevel({ level, option }, prompted = false)` |
| `clickMenuButtonInLevel({ level, btnClass }, prompted = false)` |
| `selectContextMenuOptions({
            elem, offset, firstOption, secondOption, thirdOption, clickContextMenuWhenOpen = false, isIconSelector = false, }, prompted = false)` |
| `openVisualizationMenu({ elem, offset })` |
| `selectVisualizationMenuOptions({ elem, offset, firstOption, secondOption, thirdOption })` |
| `selectExportToPDFOnVisualizationMenu(title)` |
| `editContextualLink(title)` |
| `createContextualLink(title)` |
| `selectAddToInsightsOnVisualizationMenu(title)` |
| `openMenuOnVisualization(title)` |
| `openLinkEditorOnContainer(elem)` |
| `openMenuOnVisualizationWithouWait(title)` |
| `selectExportOnVisualizationMenu(title)` |
| `selectExportToExcelOnVisualizationMenu(title)` |
| `selectExportToGoogleSheetsOnVisualizationMenu(title)` |
| `selectExportGridDataOnVisualizationMenu(title)` |
| `clickVisualizationTitle(title)` |
| `clickVisualizationTitleContainer(title)` |
| `selectShowDataOnVisualizationMenu(title)` |
| `selectAlertOnVisualizationMenu(title)` |
| `selectDeleteOnVisualizationMenu(title)` |
| `selectAlertOnVisualizationMenu(title, name = 'Alert')` |
| `isAlertOnVisualizationMenuPresent(title)` |
| `closeContextMenu(title)` |
| `openViewFilterContainer(title)` |
| `clearViewFilter(itemText)` |
| `hoverViewFilter(itemText)` |
| `closeViewFilterContainer(title)` |
| `vizCount()` |
| `isVizEmpty(title)` |
| `getVizErrorContent(title)` |
| `getErrCount(errorMsg)` |
| `isContextMenuOptionPresent({ level, option })` |
| `isContextMenuItemSelected(option, level = 0)` |
| `isViewFilterPresent(title)` |
| `isViewFilterItemPresent(itemText)` |
| `vizTooltip()` |
| `vizDossierLinkingTooltip()` |
| `linkToTargetByGridToolTip()` |
| `waitForDownloadComplete({ name, fileType, vizName })` |
| `valueOfToolTip(vizElementFinder)` |
| `isSingleVisualizationExportSpinnerPresent(title)` |
| `isVisualizationExportTypePresent(type)` |
| `getViewFilterItemText()` |
| `isVizDisplayed(title)` |
| `hideContainer(title)` |
| `showContainer(title)` |
| `hideSubPanelContainer(title)` |
| `showSubPanelContainer(title)` |
| `isContainerSelected(title)` |
| `isContainerBorderHidden(title)` |
| `changeVizType(title, vizCategory, vizType)` |
| `dragAndDropObjectWithExtraMove(movingElement, targetElement, moveX = 0, moveY = 0, waitForLoadingDialog)` |
| `clickTitleBarButtonInConsumption(visualizationName, buttonName)` |
| `hoverTitleBarButton(visualizationName, buttonName)` |

**Sub-components**
- dossierPage
- getContainer
- getCurrentPage
- getViewFilterContainer
- getVizTooltipContainer
- getVisualizationExportTypeContainer
- getNlgContainer
- getContainerByTitleInCurrentPage
- getVizLinkingTooltipContainer
- getSubPanelContainer

---

### WebBasePage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `MstrLogo` | `#mstrLogo` | element |
| `WebWaitCurtain` | `#mstrWeb_waitCurtain` | element |

**Actions**
| Signature |
|-----------|
| `waitForAlertAppear()` |
| `getAccountName()` |
| `getFolderItem(itemName)` |
| `openHomePage()` |
| `continueLicenseWarning()` |
| `openByPath(path)` |
| `_openAll(folders)` |
| `webMovetoElement(el, offset = { x: 0, y: 0 })` |
| `backToFolder()` |
| `clickBackArrow()` |
| `backToHomePage()` |
| `closeAppPopupsByClickBlankPath()` |
| `clickPath(path)` |
| `title()` |
| `paths()` |
| `scrollWebPageToBottom()` |
| `waitForWebCurtainDisappear()` |
| `waitAllToBeLoaded()` |
| `isExportStatusPagePresent()` |
| `getCurrentPageName()` |
| `getAlertTitle()` |
| `isAlertDisplayed()` |
| `is404Page()` |
| `projectStatus()` |
| `hoverOnMSTRLogo()` |

**Sub-components**
- getFolderContainer
- getWebPage
- waitPage
