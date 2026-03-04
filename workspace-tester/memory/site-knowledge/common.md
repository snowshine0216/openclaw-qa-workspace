# Site Knowledge: common

> Components: 34

### Alert
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AlertMessage` | `#mojoAlertx9` | element |

**Actions**
| Signature |
|-----------|
| `clickOnButtonByName(name, time = 0)` |
| `clickOnButtonByNameNoWait(name)` |
| `clickRepublishButton()` |
| `getAlertMessage()` |
| `isAlertDisplay()` |

**Sub-components**
_none_

---

### AntdMessage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AntdMessage` | `.ant-message-notice` | element |

**Actions**
| Signature |
|-----------|
| `isAntdMessageCloseButtonVisible()` |
| `isAntdMessageVisible()` |

**Sub-components**
_none_

---

### AuthoringFilters
> Extends: `FilterPanel`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FilterApplyButton` | `.fp-btnbar .mstrmojo-Button` | button |
| `FilterContextMenuContainer` | `.mstrmojo-ui-Menu-item-container` | element |
| `DropdownOkButton` | `.mstrmojo-ui-CheckList, .mstrmojo-PopupList` | element |
| `FilterPanelWarning` | `.mstrmojo-Label.subtitle.warning` | element |

**Actions**
| Signature |
|-----------|
| `hoverFilterPanelWarning()` |
| `moveFilterToCanvas(elementName, visualizationTitle)` |
| `createDossierAndImportSampleFiles(sampleFileIdx = 0)` |
| `waitLoadingDataPopUpIsNotDisplayed()` |
| `createBasicCustomGroup(attributeName, groupElement)` |
| `switchToFilterPanel()` |
| `changeShowOptionForAll()` |
| `addFilterToFilterPanel(attributesMetricsName)` |
| `openFilterContextMenu(filterName)` |
| `clickFilterContextMenuOption(filterName, contextMenuOptions)` |
| `clickDisplayStyleOption(optionName)` |
| `selectDisplayStyleForFilterItem(filterName, displayStyle)` |
| `selectDisplayStyleForInCanvasItem(filterName, dragButtonIdx, inCanvasContainerIdx, displayStyle)` |
| `selectDynamicSelectionMode(filterName, mode, quantity, index=0)` |
| `selectFilterPanelFilterCheckboxOption(filterName, optionName)` |
| `selectInCanvasFilterCheckboxOption(filterName, optionName)` |
| `createInCanvasFilter(objectName)` |
| `createSimpleObjectSelector(attrName)` |
| `createSimpleObjectSelectorWithReplacement({ objectName, replacementName })` |
| `selectInCanvasContextOption(objectName, optionName, waitForLoadingAfter = true)` |
| `selectInCanvasDynamicSelectionMode(objectName, mode, quantity, idx)` |
| `selectFilterPanelOptionByDisplayStyle(displayStyle, filterName, optionName, idx = 1)` |
| `selectInCanvasPanelFilterCheckboxOptionByDisplayStyle(displayStyle, filterName, optionName, extra)` |
| `setFilterToSelectorContainer(filterName, index)` |
| `checkSearchBoxItemSelected(filterName, optionName)` |
| `checkFilterMenuItemSelectedByDisplayStyle(displayStyle, filterName, optionName)` |
| `addVisualizationFilterToFilterPanel(usedObjectName)` |
| `createPanelStack()` |
| `getInCanvasEmptyWarningByDisplayStyle(displayStyle, filterName, expectedEmptyText = 'Make at least one selection.')` |
| `getInCanvasElementSelectedByDisplayStyle(displayStyle, filterName, filterElementName)` |
| `selectItemOptionByDisplayStyle(displayStyle, name, extra = {})` |
| `removeInCanvasElementByDisplayStyle(displayStyle, filterObject, elementName, idx = 2)` |
| `selectFiltersOption(optionName)` |
| `changeToDynamicSelection(filterName)` |
| `selectFilterItem(filterName)` |
| `selectFilterItems(nameList)` |
| `clickDynamicButton(filterName)` |
| `clickDynamicButtons(nameList)` |
| `isDynamicButtonPresent(filterName)` |
| `isDynamicButtonEnabled(filterName)` |
| `getDescriptionTooltipText(filterName)` |
| `isFilterInfoIconDisplayed(filterName)` |
| `isScopeFilterDisplayed()` |
| `isDashboardFilterDisplayed()` |
| `getScopeFilterInfoMessage()` |
| `getFilterWarningMessage(filterName, index = 0)` |
| `collapseFilter(filterName, index = 0)` |
| `expandFilter(filterName, index = 0)` |
| `getFilterSummary(filterName, index = 0)` |
| `isFilterItemMenuDisplayed(filterName, index = 0)` |
| `isFilterItemGlobalIconDisplayed(filterName, index = 0)` |
| `isFilterItemMandatoryIconDisplayed(filterName)` |
| `isFilterOptionDisplayed(optionName)` |
| `applyFilter()` |

**Sub-components**
- selectTargetInLayersPanel
- getFilterPanel
- getFilterContextMenuContainer
- getNewInCanvasFilterContainer
- getInCanvasFilterContainer
- getCreatePanel
- getStandardFilterContainer
- getSelectionRequiredFilterPanel

---

### for


**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FolderBrowserTreePopover` | `.mstr-folder-tree-style:not(.ant-select-dropdown-hidden) .ant-select-tree-list-holder` | dropdown |
| `SearchLoadingIcon` | `.search-loading-spinner` | element |
| `TooltipContainer` | `.ant-tooltip.object-tooltip-container` | element |
| `ContextMenu` | `.mstr-context-menu:not(.ant-dropdown-hidden)` | dropdown |

**Actions**
| Signature |
|-----------|
| `scrollObjectBrowserPopoverToTop()` |
| `openFolderBrowserPopover()` |
| `scrollToBottomInTreePopover()` |
| `scrollToTopInTreePopover()` |
| `hoverOnCurrentFolderSelector()` |
| `waitForTooltipVisible()` |
| `waitForLoading()` |
| `navigateInObjectBrowserPopover(paths)` |
| `searchObject(name, option = {})` |
| `clearSearchBox()` |
| `clickFolderUpButton()` |
| `selectObjectInFlatView(name)` |
| `doubleClickObject(objectName)` |
| `navigateInObjectBrowserFlatView(paths)` |
| `clickDoneButton()` |
| `openContextMenuOnObject({ name, isWait = true })` |
| `isFolderUpButtonDisabled()` |
| `getCurrentSelectedFolder()` |
| `getTooltipText()` |
| `isObjectPresentInFlatView(name)` |
| `getTotalObjectCount(isByLabel = true)` |

**Sub-components**
- getDatasetSelectContainer
- getTooltipContainer

---

### Checkbox


**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `findAll(container)` |
| `isChecked()` |
| `getLabelText()` |
| `click()` |

**Sub-components**
_none_

---

### CollaborationDB
> Extends: `PostgresService`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `deleteAllComments(dburl, dossierID)` |
| `deleteAllNotifications(dburl, userID)` |
| `deleteAllTopics(dburl, dossierID)` |
| `disconnect()` |

**Sub-components**
_none_

---

### Email
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `recieveEmail(userName)` |
| `getSharedMsg(userName)` |
| `getMentionTitle(userName)` |
| `getMentionMessage(userName)` |
| `getInviteContent(userName, trim = true)` |
| `getInviteMessage(userName, trim = true)` |
| `getBrowserLink(userName)` |
| `getAddedContent(userName)` |
| `openViewInBrowserLink(userName)` |
| `clearMsgBox()` |

**Sub-components**
- dossierPage
- libraryPage

---

### EmbedPromptEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `waitForLoading()` |
| `clickDoneButton()` |
| `clickCancelButton()` |

**Sub-components**
- getPromptEditorContainer
- getButtonsContainer
- getPromptSummaryContainer

---

### FilterCapsule
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `removeCapsuleByName({ filterElementFinder, name })` |
| `removeCapsuleByOrder({ filterElementFinder, index })` |
| `highlightCapsuleByName({ filterElementFinder, name })` |
| `capsuleCount(filterElementFinder)` |
| `capsuleName({ filterElementFinder, index })` |
| `isCapsulePresent({ filterElementFinder, name })` |
| `isCapsuleHighlighted({ filterElementFinder, name })` |
| `isCapsuleExcluded({ filterElementFinder, name })` |
| `isCapsuleExcludedByOrder({ filterElementFinder, index })` |
| `isCapsuleDynamicByOrder({ filterElementFinder, index })` |

**Sub-components**
_none_

---

### FilterDropdown
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `openDropdownMenu(filterElementFinder)` |
| `selectOption(filterElementFinder, option)` |
| `updateValue({ elem, valueLower, valueUpper })` |
| `updateValueWithEnter({ elem, valueLower, valueUpper })` |
| `selectedOption(filterElementFinder)` |
| `inputBoxValue(filterElementFinder)` |

**Sub-components**
- getDropDownContainer

---

### FilterElement
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SecondaryFilterPanel` | `.mstrd-FilterDetailsPanel-wrapper` | element |
| `ViewSelectedIcon` | `.mstrd-Switch` | element |
| `EnabledToggle` | `.mstrd-Switch.mstrd-Switch--checked` | element |
| `GDDEUpdate` | `.mstrd-FilterItemTitle-gddeStatus > .loading-spinner` | element |

**Actions**
| Signature |
|-----------|
| `waitForGDDEUpdate()` |
| `selectElementByName(name)` |
| `selectRadioButtonByName(name)` |
| `selectSearchElementByName(name)` |
| `hoverOnElement(name)` |
| `hoverOnRadioButton(name)` |
| `hoverOnSearchElement(name)` |
| `keepOnly(name)` |
| `keepOnlyForSearchElement(name)` |
| `toggleViewSelectedOption()` |
| `toggleViewSelectedOptionOn()` |
| `selectAll()` |
| `clearAll()` |
| `bulkSelection(option)` |
| `clickFooterButton(option)` |
| `isElementPresent(name)` |
| `isElementSelected(name)` |
| `isRadioButtonPresent(name)` |
| `isRadioButtonSelected(name)` |
| `isSearchElementSelected(name)` |
| `elementByOrder(index)` |
| `radioButtonByOrder(index)` |
| `message()` |
| `isKeepOnlyLinkDisplayed(name)` |
| `isKeepOnlyLinkDisplayedForSearchElement(name)` |
| `isViewSelectedEnabled()` |
| `isViewSelectedPresent()` |
| `visibleElementCount()` |
| `visibleRadioButtonCount()` |
| `visibleSearchElementCount()` |
| `visibleSelectedElementCount()` |
| `visibleSelectedRadioButtonCount()` |
| `isSelectAllEnabled()` |
| `isClearAllEnabled()` |
| `getCheckBoxElementsCount()` |
| `isFooterButtonPresent(option)` |
| `isFooterButtonDisabled(option)` |
| `getSearchResultsText()` |
| `getElementIndex(name)` |

**Sub-components**
- getSecondaryFilterPanel

---

### FilterPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FilterIcon` | `.mstr-nav-icon.icon-tb_filter_n` | element |
| `FilterIconOnLeft` | `.mstrd-NavBar-left .mstr-nav-icon.icon-tb_filter_n` | element |
| `OpenedFilterIconOnLeft` | `.mstrd-NavBar-left .mstr-nav-icon.icon-tb_filter_a` | element |
| `FilterIconOfOpenedFilterPanel` | `.mstr-nav-icon.icon-tb_filter_a` | element |
| `FilterPanel` | `.mstrd-FilterDropdownMenuContainer` | dropdown |
| `FilterMainPanel` | `.mstrd-DropdownMenu-main, .mstrd-MobileSliderMenu-slider` | dropdown |
| `FilterPanelDropdown` | `.mstrd-FilterDropdownMenuContainer .mstrd-DropdownMenu-content` | dropdown |
| `FilterDetailsPanel` | `.mstrd-FilterDetailsPanel` | element |
| `FilterPanelWrapper` | `.mstrd-DropdownMenu-main` | dropdown |
| `FilterPanelContent` | `.mstrd-FilterPanel-content` | element |
| `FilterPanelFooter` | `.mstrd-FilterPanelFooterContainer` | element |
| `MoreSettingIcon` | `.mstrd-DropdownMenu-headerIcon.icon-pnl_more-options` | dropdown |
| `ApplyButton` | `.mstr-apply-button` | button |
| `DisabledApplyButton` | `.mstr-apply-button.apply-disabled` | button |
| `ClearFilter` | `.mstr-clear-text` | element |
| `DisabledClearFilterButton` | `.mstr-clear-text.inactive` | element |
| `Tooltip` | `.ant-tooltip-inner` | element |
| `FilterDisabledMessage` | `.mstrd-LockFilterMessageSection` | element |
| `GDDEError` | `.mstrd-FilterItemTitle.mstrd-FilterItemTitle-gddeStatus` | element |
| `GDDEUpdate` | `.mstrd-FilterItemTitle-gddeStatus > .loading-spinner` | element |
| `RetryGDDE` | `.mstrd-FilterItemTitle-filterRetry` | element |
| `CancelGDDE` | `.mstrd-FilterItemTitle-filterCancel` | element |
| `GDDEWarningIcon` | `.icon-warning` | element |
| `ViewSelected` | `.mstrd-FilterViewSelected .mstrd-Switch` | dropdown |
| `AddFilterButton` | `.mstrd-DropdownMenu-headerIcon.icon-pnl_add-new.addFilter` | dropdown |
| `AddFilterMenu` | `.mstrd-FilterPanelAddFilter-menu` | element |
| `EmptyFilter` | `.mstrd-FilterPanel-empty` | element |
| `SecondaryFilterPanel` | `.mstrd-FilterDetailsPanel.mstrd-FilterDetailsPanel-filter-panel` | element |

**Actions**
| Signature |
|-----------|
| `getFilterPanelWrapperHeight()` |
| `getFilterPanelContentHeight()` |
| `getFilterPanelHeaderHeight()` |
| `getFilterPanelFooterHeight()` |
| `openFilterPanel()` |
| `closeFilterPanel()` |
| `closeFilterPanelByCloseIcon()` |
| `dockFilterPanel()` |
| `undockFilterPanel()` |
| `toggleFilterSummary()` |
| `apply()` |
| `applyAndReopenPanel(optionalFilter)` |
| `applyWithoutWaiting(isWait = true)` |
| `waitForGDDE()` |
| `clearFilter()` |
| `resetAllFilters()` |
| `clearAllFilters()` |
| `filterName({ index })` |
| `scrollFilterPanelContentToBottom()` |
| `selectFilterItem(name)` |
| `selectFilterItems(nameList)` |
| `unselectFilterItem(name)` |
| `clickAddFilterMenuButton(name)` |
| `isMainPanelOpen()` |
| `isFilterIconPresent()` |
| `isMoreSettingPresent()` |
| `isPanelCloseIconDisplayed()` |
| `isDockIconDisplayed()` |
| `isUndockIconDisplayed()` |
| `isLeftDocked()` |
| `isRightDocked()` |
| `isPanelDocked()` |
| `isApplyEnabled()` |
| `isClearFilterDisabled()` |
| `isFilterContentOverlapsWithFooter()` |
| `isFilterItemLocked(name)` |
| `isWarningMessagePresent(name)` |
| `warningMessageText(name)` |
| `isGlobalFilterIconExist(name, index = 0)` |
| `hoverFilterByName(name)` |
| `getTooltipText()` |
| `clickFilterByName(name)` |
| `isAttrFilterDetailsPanelLocked(name)` |
| `isVizFilterDetailsPanelLocked(name)` |
| `isCalFilterDetailsPanelLocked(name)` |
| `clickViewSelected()` |
| `isResetAllFiltersButtonPresent()` |
| `isResetAllFiltersButtonDisabled()` |
| `getFilterDisabledMessageText()` |
| `isFilterIconDisabled()` |
| `isFilterDisplayedInFilterPanel(name)` |
| `isFilterInfoIconDisplayed(name)` |
| `getDescriptionTooltipText(name)` |
| `clickAddFilterButton()` |
| `clickAttributeInAddFilter(attrName)` |
| `isAttributeDisplayedInAddFilter(attrName)` |
| `clickAddOrCancelButtonInAddFilter(btnName)` |
| `filterItemText()` |
| `switchToFilterPanel()` |
| `isFilterPanelEmpty()` |
| `hoverFilterPanelIcon()` |

**Sub-components**
- dossierPage
- getFilterPanel
- getFilterMainPanel
- getFilterItemContainer
- getFilterIconOfOpenedFilterPanel
- isMainPanel
- openFilterPanel
- getLockedAttrFilterDetailsPanel
- getLockedVizFilterDetailsPanel
- getLockedCalFilterDetailsPanel

---

### FilterSearch
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FilterSearchBox` | `.mstrd-FilterSearchBox` | element |
| `SearchWarningMsg` | `.mstrd-FilterItemsList-warn-msg` | element |
| `SearchResults` | `.mstrd-SearchStyleFilterDetailsPanel-result` | element |
| `EmptySearchImage` | `.mstrd-SearchStyleFilterItemsList-image` | element |

**Actions**
| Signature |
|-----------|
| `search(keyword)` |
| `clearSearch()` |
| `keyword()` |
| `isClearSearchIconPresent()` |
| `isEmptySearchDisplayed()` |
| `searchboxPlaceholder()` |
| `searchResults()` |
| `isSearchWarningMsgPresent()` |

**Sub-components**
_none_

---

### FilterSlider
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SliderTooltipContainer` | `.ant-tooltip-inner` | element |

**Actions**
| Signature |
|-----------|
| `clickLowerHandle(filterElementFinder)` |
| `clickUpperHandle(filterElementFinder)` |
| `clickHandle(filterElementFinder)` |
| `dragAndDropHandle(filterElementFinder, pos)` |
| `dragAndDropLowerHandle(filterElementFinder, pos)` |
| `dragAndDropUpperHandle(filterElementFinder, pos)` |
| `hoverOnUpperHandle(filterElementFinder)` |
| `hoverOnLowerHandle(filterElementFinder)` |
| `hoverOnHandle(filterElementFinder)` |
| `hoverOnSummaryLabel(filterElementFinder)` |
| `hoverOnMinValue(filterElementFinder)` |
| `hoverOnMaxValue(filterElementFinder)` |
| `dragToSamePosition(filterElementFinder)` |
| `updateLowerInput(filterElementFinder, value)` |
| `updateUpperInput(filterElementFinder, value)` |
| `clearSlider(filterElementFinder)` |
| `minValue(filterElementFinder)` |
| `maxValue(filterElementFinder)` |
| `summary(filterElementFinder)` |
| `lowerInput(filterElementFinder)` |
| `upperInput(filterElementFinder)` |
| `isSummaryPresent(filterElementFinder)` |
| `isSummaryInExcludeMode(name)` |
| `isSummaryInputInExcludeMode(name)` |
| `sliderTooltip()` |

**Sub-components**
- filterPanel
- getSliderTooltipContainer
- getTooltipContainer

---

### FilterSummary
> Extends: `BaseFilter`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ViewAllButton` | `.mstrd-FilterSummaryBar-right` | element |
| `ExpandedSummaryItems` | `.mstrd-FilterSummaryPanel-items` | element |
| `FilterCount` | `.mstrd-FilterSummaryBar` | element |
| `EditIcon` | `.mstrd-FilterSummaryBar` | element |

**Actions**
| Signature |
|-----------|
| `viewAllFilterItems()` |
| `hoverOnFilterSummary(filterName)` |
| `isFilterExcluded(name)` |
| `filterItems(name)` |
| `expandedFilterItems(name)` |
| `filterCount()` |

**Sub-components**
- getTooltipContainer

---

### FontPicker
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `MissingFontTooltip` | `.mstr-rc-font-selector__popover .ant-popover-content` | dropdown |
| `FontPickerDropdown` | `.ant-select-dropdown.mstr-rc-font-selector__dropdown` | dropdown |
| `InnerSelectorDropdown` | `.ant-select-dropdown.mstr-rc-font-selector__innerdropdown` | dropdown |

**Actions**
| Signature |
|-----------|
| `selectFontByName(fontName)` |
| `openFontPicker()` |
| `clickWarningIcon()` |
| `switchMode(optionName)` |
| `getCurrentSelectedFont()` |
| `getCurrentInnerSelectorMode()` |

**Sub-components**
_none_

---

### HamburgerMenu
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `HamburgerIcon` | `.mstrd-HamburgerIconContainer` | element |
| `SliderMenuContainer` | `.mstrd-MobileSliderMenu-slider` | element |
| `CrossIcon` | `.mstrd-HamburgerIconContainer-icon--open` | element |
| `LogOutButton` | `.mstrd-MobileAccountMenuItem-logout` | element |
| `ExcelRangeSettings` | `.mstrd-ExcelExportPagesSetting` | element |
| `ExportToExcelSettingsPanel` | `.mstrd-DossierExcelPanel` | element |
| `ExportToCSVSettingsPanel` | `.mstrd-ExportPanel-options` | element |
| `ExportToPDFSettingsPanel` | `.mstrd-ExportDetailsPanel` | element |
| `SubscribeToDashboardPanel` | `.mstrd-SubscribeDetailsPanel` | element |
| `FilterIcon` | `.mstrd-LibraryFilterContainer-button.icon-tb_sort-filter_n.mstr-nav-icon` | button |
| `SortAndFilterPanel` | `.mstrd-MobileSliderMenu-slider` | element |
| `CloseManageLibraryButton` | `.mstrd-MobileManageLibraryNavBarContainer-back.mstrd-Button.mstrd-Button--clear` | button |
| `UserNameInMobileView` | `.mstrd-MobileAccountMenuItem-option` | element |
| `AddFilterButtonInMobileView` | `.mstrd-MobileSliderOptionRow-addIcon.icon-pnl_add-new` | element |
| `FilterPanelInMobileView` | `.mstrd-FilterPanel` | element |
| `TimezoneEditBtnInMobileView` | `.mstrd-TimezoneDetailsPanel-mine-edit` | element |
| `BackButtonInMobleView` | `.mstrd-MobileSliderOptionRow-menuOption--hasBackAction .mstrd-MobileSliderOptionRow-backArrow` | element |

**Actions**
| Signature |
|-----------|
| `openHamburgerMenu()` |
| `closeHamburgerMenu()` |
| `clickOptionInMobileView(option)` |
| `openFilterDetailPanelInMobileView(item)` |
| `clickEditBtnInMobileView()` |
| `clickBackButtonInMobileView()` |
| `clickButton(option)` |
| `clickShare()` |
| `clickExportToExcel()` |
| `clickExportToPDF()` |
| `clickExportToCSV()` |
| `clickSubscribeToDashboard()` |
| `clickAutoAnswers()` |
| `close()` |
| `_selectDropDownItemOption({ dropDownOption, dropDownItems })` |
| `selectExcelRange(dropDownOption)` |
| `clickFilterOptionInMobileView(option)` |
| `openLibraryFilterInMobileView()` |
| `openFilterPanelInMobileView()` |
| `closeFilterPanelInMobileView()` |
| `openSortByDropdownInMobileView()` |
| `closeSortByDropdownInMobileView()` |
| `openTypesDropdownInMobileView()` |
| `closeTypesDropdownInMobileView()` |
| `closeManageLibrary()` |
| `openAutoAnswersInMobileView()` |
| `isMobileSliderMenuOpened()` |
| `getMenuOptionsCount()` |
| `clickAddFilterButtonInMobileView()` |

**Sub-components**
- getSliderMenuContainer
- _getDropDownContainer
- getSortAndFilterPanel
- getFilterPanel
- getSliderOptionContainer

---

### Legend
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getlegendColor({ elementFinder, element })` |
| `collapseLegendBox(elementFinder)` |
| `expandLegendBox(elementFinder)` |
| `hideLegendBox(elementFinder)` |
| `isLegendMinimized(elementFinder)` |
| `isLegendPresent(elementFinder)` |

**Sub-components**
_none_

---

### LibraryFilter
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FilterIcon` | `.mstrd-LibraryFilterContainer-button` | button |
| `FilterContainer` | `.mstrd-LibraryFilterDropdown-filterPanel` | dropdown |
| `BaseFilterContainer` | `.mstrd-BaseFilterPanel-body` | element |
| `Curtain` | `.mstrd-LibraryViewCurtain--transparent` | element |
| `LibraryFilterApplyCount` | `.mstrd-LibraryFilterContainer-applyCount` | element |
| `FilterDetailsPanel` | `.mstrd-BaseFilterDetailPanel` | element |
| `FilterCount` | `.mstrd-LibraryFilterContainer-applyCount` | element |

**Actions**
| Signature |
|-----------|
| `hoverFilter()` |
| `clickFilterIcon()` |
| `closeFilterPanel()` |
| `openFilterTypeDropdown()` |
| `openFilterDetailPanel(type, index = 0)` |
| `checkFilterType(option)` |
| `selectFilterOptionButton(option)` |
| `uncheckFilterType(option)` |
| `selectFilter(path, index = 0)` |
| `selectFilterDetailsPanelItem(option)` |
| `isFilterTypeItemPresent(option)` |
| `selectCertifiedOnly()` |
| `selectOptionInCheckbox(name)` |
| `clickClearAllButton()` |
| `clickApplyButton()` |
| `keepOnlyOption(name)` |
| `clickFilterDetailsPanelButton(button)` |
| `toggleViewSelected()` |
| `searchFilterItem(name)` |
| `clearSearch()` |
| `isDossierSelected()` |
| `isDocumentSelected()` |
| `isFilterTypeChecked(option)` |
| `isNewtSelected()` |
| `isUpdatedSelected()` |
| `isCertifiedSelected()` |
| `filterTypes()` |
| `filterApplyCount()` |
| `getFilterDropdownOptionsNames()` |
| `getFilterOptions()` |
| `getFilterTypeItemsNames()` |
| `isFilterOpen()` |
| `isCertifiedSwitchFocused()` |
| `isApplyButtonEnable()` |
| `getDetailsPanelItemsCount()` |
| `changeTypesTo(option)` |
| `clearTypesSelection()` |
| `clearAllFilters()` |
| `filterCount()` |
| `isFilterCountDisplayed()` |
| `noElementText()` |
| `isLibraryFilterDisplay()` |

**Sub-components**
- getFilterContainer
- getFilterDetailsPanel
- getFilterDetailPanel
- getOptionInCheckboxDetailPanel
- getTooltipContainer
- openFilterDetailPanel
- selectFilterDetailsPanel

---

### LibraryItem
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Tooltip` | `.ant-tooltip:not(.ant-tooltip-hidden)` | element |
| `CertifyTooltip` | `.ant-tooltip-inner` | element |
| `DossierNameFont` | `.mstrd-DossierItem-name-text` | element |

**Actions**
| Signature |
|-----------|
| `openItemByIndex(index)` |
| `hoverOnCertifiedIcon(name)` |
| `hoverOnObjectTypeIcon(name)` |
| `itemInfo(name)` |
| `itemSharedByTimeInfo(name)` |
| `hoverOnUserName(name)` |
| `isItemCertified(name)` |
| `isItemDocument(name)` |
| `isItemViewable(name, owner = null)` |
| `isCommentCountDisplayed(name)` |
| `getTooltipText()` |
| `hoverOnTemplateIcon(name)` |
| `isBotCoverGreyed(name)` |
| `isBotHasInactiveInName(name, i18nText = ' (Inactive)` |
| `isObjectTypeIconDisplayed(name)` |
| `isRunAsExcelIconPresent(name)` |
| `isRunAsPDFIconPresent(name)` |
| `getDossierNameFont()` |
| `getAllItemsCount()` |
| `isAddToLibraryIconDisplayed(name)` |

**Sub-components**
_none_

---

### LibraryNotification
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FloatNotification` | `.mstrd-FloatNotifications` | element |
| `MobileSmartBanner` | `.mstrd-SmartBanner` | element |
| `NotificationSection` | `.ant-notification.ant-notification-bottomRight` | element |

**Actions**
| Signature |
|-----------|
| `getNotificationMessageTextByIndex(index = 0)` |
| `getNotificationDescriptionTextByIndex(index = 0)` |
| `clickNotificationCloseButton()` |
| `openReadyNotificationByName(notificationName)` |
| `closeSnapshotNotificationByName(notificationName)` |
| `isSmartBannerVisible()` |
| `isNotificationVisible()` |
| `isNotificationCloseButtonVisible()` |
| `isSnapshotInProgressNotificationVisible(notificationName)` |
| `isSnapshotReadyNotificationVisible(notificationName)` |
| `getSnapshotNotificationDescriptionText(notificationName)` |
| `getSnapshotNotificationMessageText(notificationName)` |
| `getNotificationMessage(notificationName)` |
| `getAllNotificationMessages()` |
| `getNotificationCount()` |
| `waitForAllNotificationShown(cnt = 2)` |

**Sub-components**
_none_

---

### LibrarySort
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SortBox` | `.mstrd-SortBox-content` | element |
| `CombinedModeSortBox` | `.mstrd-SortBox-sortbycontent` | element |
| `SortMenu` | `.mstrd-SortContainer` | element |
| `SortOption` | `.mstrd-SortBox-selected` | dropdown |
| `SortArrow` | `.mstrd-SortArrow` | element |
| `Curtain` | `.mstrd-LibraryViewCurtain--transparent` | element |

**Actions**
| Signature |
|-----------|
| `openSortMenu()` |
| `openCombinedModeSortMenu()` |
| `selectSortOption(option)` |
| `selectSortOrder(order)` |
| `quickSort()` |
| `closeSortMenu()` |
| `hoverQuickSort()` |
| `currentSortOption()` |
| `currentSortStatus()` |
| `currentSortOrder()` |
| `isSortMenuOpen()` |
| `isSortOptionTabFocused(option)` |
| `isSortOptionExist(option)` |
| `getSortOptionFont()` |
| `isSortDisplay()` |
| `getAllSortOptionsText()` |

**Sub-components**
- getTooltipContainer

---

### ObjectFolderBrowser
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FolderBrowserContainer` | `.mstr-object-browser-container` | element |

**Actions**
| Signature |
|-----------|
| `openObjectSelector()` |
| `openFolderByPath(path)` |
| `chooseFolderByName(name)` |

**Sub-components**
- getFolderBrowserContainer

---

### PADb
> Extends: `PostgresService`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `queryTelemetry(dburl, { jobId, userName = 'telemetry_user', objectId = null })` |
| `disconnect()` |

**Sub-components**
_none_

---

### Panel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `closePanel(panelFinder)` |
| `dockPanel(panelFinder)` |
| `undockPanel(panelFinder)` |
| `isPanelCloseIconDisplayed(panelFinder)` |
| `isDockIconDisplayed(panelFinder)` |
| `isUndockIconDisplayed(panelFinder)` |
| `isLeftDocked(panelFinder)` |
| `isRightDocked(panelFinder)` |
| `isPanelDocked(panelFinder)` |

**Sub-components**
- getDockPanel

---

### PromptEditor
> Extends: `WebBasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `RepromptIcon` | `.mstr-nav-icon.icon-tb_prompt` | element |
| `PromptEditor` | `#mstrdossierPromptEditor, .mstrPromptEditor` | element |
| `PromptContainer` | `.mstrd-PromptEditorContainer-overlay` | element |
| `CloseIndexIcon` | `.mstrPromptEditorCellTOC` | element |
| `OpenIndexIcon` | `.mstrPromptEditorCellTOC` | element |
| `MsgNameInputOnWeb` | `.mstrPromptEditorCellRenameMsgToolbar` | element |
| `PageStartInput` | `.mstrPopupOpaqueContainer` | element |
| `MessageBox` | `.mstrd-MessageBox` | element |
| `WebPromptSummary` | `.mstrPromptTOCSummaryButton` | button |
| `DocumentContent` | `[class*=mstrd-ViDocRenderer]` | element |
| `DossierContent` | `[class*=mstrmojo-VIDocument]` | element |
| `PromprtEditorSelectableMode` | `.mstrd-PromptEditor.mstrd-PromptEditor--selectableMode` | dropdown |

**Actions**
| Signature |
|-----------|
| `reprompt()` |
| `clickPromptIndexByTitle(title)` |
| `clickPromptIndexByTitleWithNoWait(title)` |
| `closeEditor()` |
| `cancelEditor()` |
| `run()` |
| `cancelResolvePrompt()` |
| `clickButtonByNameAndNoWait(name)` |
| `waitForError()` |
| `clickButtonByName(name)` |
| `renameReportMsgOnWeb(newName)` |
| `setPageStartIndex(index)` |
| `runPromptInPrompt()` |
| `runNoWait()` |
| `runWithPIP()` |
| `runWithWaitForCancel()` |
| `runWithERR()` |
| `waitForEditor()` |
| `waitForEditorClose()` |
| `waitForRepromptLoading()` |
| `waitForPromptLoading()` |
| `waitForMessageBox()` |
| `toggleViewSummary()` |
| `waitForSummaryItem(promptName)` |
| `clickWebPromptSummary()` |
| `backPrompt()` |
| `scrollEditorToBottom()` |
| `scrollEditorToTop()` |
| `scrollWindowToRightmost()` |
| `isRepromptIconPresent()` |
| `isEditorOpen()` |
| `isViewSummaryEnabled()` |
| `checkEmptySummary(promptName)` |
| `checkEmptySummaryByIndex(index)` |
| `checkListSummary(promptName)` |
| `checkListSummaryByIndex(index)` |
| `checkQualSummary(promptName)` |
| `checkQualSummaryOfDefault(promptName)` |
| `checkDynamicSummary(promptName)` |
| `checkMultiQualSummary(promptName)` |
| `checkTextSummary(promptName)` |
| `getPromptCountInViewSummary()` |
| `getSummaryText(promptName)` |
| `selectPromptByName(promptName)` |
| `selectPromptItems(promptList)` |
| `switchDynamicByName(promptName)` |
| `switchDynamicItems(promptList)` |
| `findPrompt(title)` |
| `clickSelectButton()` |
| `isEditorSelectableModeOpen()` |
| `waitForEditorSelectableMode()` |
| `closeIndex()` |
| `openIndex()` |
| `isRenameBoxPresent()` |

**Sub-components**
- getPromptContainer
- getSummaryContainer
- getPage

---

### PromptSearchbox
> Extends: `BasePrompt`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickMatchCase(promptElement)` |
| `searchFor(promptElement, text)` |
| `clearSearch(promptElement)` |

**Sub-components**
_none_

---

### SaveAsEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SaveAsEditor` | `.mstrmojo-SaveAsEditor` | element |
| `ObjectBrowserDropDown` | `.mstrmojo-OBNavigatorPopup` | element |
| `SavingModalView` | `.saving-in-progress.modal` | element |

**Actions**
| Signature |
|-----------|
| `changeInputBotNameInSaveAsDialog(name)` |
| `changeCertifyCheckBoxInSaveAsDialog(certified)` |
| `changeSetAsTemplateCheckBoxInSaveAsDialog()` |
| `openObjectBrowser()` |
| `searchByName(text)` |
| `browseFolderInSaveAsDialog(folderName)` |
| `waitForSaving()` |
| `clickSaveButtonInSaveAsDialog()` |
| `clickCancelButtonInSaveAsDialog()` |
| `isCertifyCheckBoxCheckedInSaveAsDialog()` |
| `isCertifyCheckBoxPresentInSaveAsDialog()` |
| `getBotNameInSaveDialog()` |

**Sub-components**
- getFolderContainer

---

### SearchBox
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SearchBox` | `.mstrd-SearchBox` | element |
| `SearchIcon` | `.mstrd-SearchNavItemContainer .icon-search_tb_box` | element |
| `RecentlySearchedContainer` | `.mstrd-SearchNavItemContainer-results--recent` | element |

**Actions**
| Signature |
|-----------|
| `search(text)` |
| `clearSearch()` |
| `pressEnter()` |
| `clearRecentlySearchedItem(index)` |
| `clearAllRecentlySearchedItems()` |
| `isInputBoxEmpty()` |
| `isClearSearchIconDisplayed()` |
| `isRecentlySearchedPresent()` |
| `recentlySearchedItemCount()` |
| `isRecentlySearchedResultEmpty()` |
| `isSearchBoxOpened()` |

**Sub-components**
- getRecentlySearchedContainer

---

### Select


**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `click()` |
| `open()` |

**Sub-components**
_none_

---

### ShowDataDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ShowDataDialog` | `.mstrmojo-ViewDataDialog.modal` | element |
| `ShowDataPopup` | `.mstrmojo-ViewDataDialog.mstrmojo-popup-widget-hosted` | element |
| `RowCount` | `.mstrmojo-ViewDataDialog .mstrmojo-rowcount` | element |
| `ShowDataExportTypeContainer` | `.mstrmojo-ListBase.mstrmojo-ui-Menu` | element |

**Actions**
| Signature |
|-----------|
| `getAddDataElementCheckbox({ title, elem })` |
| `clickAddDataButton()` |
| `addElementToDataset({ title, elem })` |
| `clickAddDataOkButton()` |
| `clickShowDataExportButton()` |
| `clickShowDataExportButtonNoPrivilege()` |
| `clickShowDataCloseButton()` |
| `exportShowData(fileType)` |
| `scrollDatasetToBottom()` |
| `sortByColumnHeader(headerName)` |
| `selectColumnSetOption(option)` |
| `getDatasetRowCount()` |
| `getColumnSetOptionText()` |
| `isShowDataExportTypePresent(type)` |
| `isShowDataExportButtonAvailable()` |
| `isShowDataDialogDisplayed()` |
| `closeShowDataDialog(authoring = false)` |
| `changeColumnSetInAgGrid(columnSetName)` |
| `getHeadersInshowDataGrid()` |
| `sortShowDataGridbyClickingHeader(objectName)` |
| `getAddDataList(title)` |
| `addGridToViz()` |
| `selectUnitsInUnitSelectionPopup(objectNames)` |
| `applyAndCloseUnitSelectionPopup()` |
| `cancelAndCloseUnitSelectionPopup()` |
| `moveShowDataVerticalScrollBarToBottom(pos)` |
| `moveObjectByColumnBorder(objectName, colNum)` |
| `dragCellToRowHeader(objectToDrag, position, targetHeader)` |
| `dragCellToColHeader(objectToDrag, position, targetHeader)` |
| `isRowCountEqual(num)` |
| `resizeColumnByMovingBorder(colNum, pixels, direction)` |

**Sub-components**
- vizPanel
- getAddDataContainer
- getShowDataExportTypeContainer
- getDatasetContainer

---

### TOCMenu
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `TOCIcon` | `.mstr-nav-icon[class*=icon-tb_toc]` | element |
| `MenuContainer` | `.mstrd-ToCDropdownMenuContainer` | dropdown |
| `DossierName` | `.mstrd-DropdownMenu-headerTitle` | dropdown |
| `ContentsPanel` | `#rootView .mstrmojo-RootView-toc` | element |

**Actions**
| Signature |
|-----------|
| `openMenu()` |
| `closeMenu()` |
| `dockTOCMenu()` |
| `undockTOCMenu()` |
| `goToPage(chapterName, pageName)` |
| `switchPageTo(pageName, delay)` |
| `goToChapter(chapterName, specType)` |
| `scrollToBottom()` |
| `isTOCIconPresent()` |
| `isPanelCloseIconDisplayed()` |
| `isDockIconDisplayed()` |
| `isUndockIconDisplayed()` |
| `isLeftDocked()` |
| `isRightDocked()` |
| `isTOCLightTheme()` |
| `assertDossierName()` |
| `getSelectedPageName()` |
| `getMenuContainerWidth()` |
| `getMenuListHeight()` |
| `getMenuListScrollHeight()` |
| `getMenuContentHeight()` |
| `getMenuContentScrollHeight()` |
| `hoverOverPage(chapterName, pageName)` |
| `hoverOverChapter(chapterName)` |
| `createNewPage()` |
| `createNewChapter()` |
| `duplicatePage(pageName)` |
| `duplicateChapter(chapterName)` |

**Sub-components**
- dossierPage
- dossierAuthoringPage
- getMenuContainer
- basePanel
- getContentsPanel
- getPage
- getSelectedPage

---

### UserAccount
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `UserAccount` | `.mstr-nav-icon[class*=icon-tb_profile_]` | element |
| `UserAccountNameElement` | `.mstrd-DropdownMenu-main` | dropdown |
| `UserAccountName` | `.mstrd-DropdownMenu-main` | dropdown |
| `AccountDropdown` | `.mstrd-AccountDropdownMenuContainer .mstrd-DropdownMenu-main` | dropdown |
| `AccountDivider` | `.mstr-nav-icon.icon-divider` | element |
| `LogoutButton` | `.mstrd-AccountDropdownMenuContainer-logout` | dropdown |
| `PreferenceSecondaryPanel` | `.mstrd-AccountDropdownMenuContainer-preferences-popover` | dropdown |
| `CurrentSelectedWorkspaceItem` | `.mstrd-WorkspacePicker-itemContainer--current` | element |
| `SwitchWorkspaceSubPanel` | `.mstrd-AccountDropdownMenuContainer-SwitchWorkspace-SubPanel` | dropdown |
| `SwitchApplicationSubPanel` | `.mstrd-AccountDropdownMenuContainer-MyLibraries-SubPanel` | dropdown |
| `CurrentApplication` | `div.mstrd-CustomApplicationPicker-itemContainer--current` | element |

**Actions**
| Signature |
|-----------|
| `clickAccountButton()` |
| `openUserAccountMenu(options = {})` |
| `clickAccountOption(text, options = {})` |
| `openUserAccountMenuWithKeyboard()` |
| `switchCustomApp(name)` |
| `switchWorkspace(name)` |
| `switchCustomAppByIndex(index)` |
| `openMyApplicationPanel()` |
| `openPreferencePanel()` |
| `clickAccountMenuOption(text)` |
| `closeUserAccountMenu()` |
| `logout(options = {})` |
| `getUserName()` |
| `canUserLogin()` |
| `canUserLogout()` |
| `isPreferencePresent()` |
| `isAccountOptionPresent(option)` |
| `getPreferenceText()` |
| `openSwitchWorkspaceSubPanel()` |
| `openSwitchApplicationSubPanel()` |
| `clickApplication(appName)` |
| `getAccountMenuOptionsNames()` |
| `getPreferenceSectionsNames()` |
| `isApplicationSelected(name)` |
| `isAccountIconFocused()` |
| `isAccountDropdownMenuPresent()` |
| `isCloseButtonFocused()` |
| `isLogoutFocused()` |

**Sub-components**
- loginPage
- getPreferenceSecondaryPanel
- getSwitchApplicationSubPanel
- openSwitchWorkspaceSubPanel
- getSwitchWorkspaceSubPanel
- openSwitchApplicationSubPanel

---

### UserPreference
> Extends: `BaseLibrary`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `PreferenceSecondaryPanel` | `.mstrd-AccountDropdownMenuContainer-preferences-popover` | dropdown |

**Actions**
| Signature |
|-----------|
| `openTimezoneList()` |
| `changeUserTimezone(timezone)` |
| `openPreferenceList(section)` |
| `changePreference(section, preference)` |
| `savePreference()` |
| `cancelChange()` |
| `waitForPreferencePanelPresent()` |
| `changePersistentNotificationSetting(enable = true)` |
| `isChangeDescPresent()` |
| `selectedTimezone()` |
| `selectedPreference(section)` |
| `isPreferenceSecondaryPanelPresent()` |
| `isPersistentNotificationEnabled()` |

**Sub-components**
- getPreferenceSecondaryPanel
