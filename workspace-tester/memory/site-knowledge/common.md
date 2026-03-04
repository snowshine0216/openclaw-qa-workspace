# Site Knowledge: Common Domain

## Overview

- **Domain key:** `common`
- **Components covered:** Alert, AntdMessage, AuthoringFilters, Checkbox, CollaborationDB, Email, EmbedPromptEditor, FilterCapsule, FilterDropdown, FilterElement, FilterPanel, FilterSearch, FilterSlider, FilterSummary, FontPicker, for, HamburgerMenu, Legend, LibraryFilter, LibraryItem, LibraryNotification, LibrarySort, ObjectFolderBrowser, PADb, Panel, PromptEditor, PromptSearchbox, SaveAsEditor, SearchBox, Select, ShowDataDialog, TOCMenu, UserAccount, UserPreference
- **Spec files scanned:** 5
- **POM files scanned:** 34

## Components

### Alert
- **CSS root:** `#mojoAlertx9`
- **User-visible elements:**
  - Alert Message (`#mojoAlertx9`)
- **Component actions:**
  - `clickOnButtonByName(name, time = 0)`
  - `clickOnButtonByNameNoWait(name)`
  - `clickRepublishButton()`
  - `getAlertMessage()`
  - `isAlertDisplay()`
- **Related components:** _none_

### AntdMessage
- **CSS root:** `.ant-message-notice`
- **User-visible elements:**
  - Antd Message (`.ant-message-notice`)
- **Component actions:**
  - `isAntdMessageCloseButtonVisible()`
  - `isAntdMessageVisible()`
- **Related components:** _none_

### AuthoringFilters
- **CSS root:** `.mstrmojo-ui-Menu-item-container`
- **User-visible elements:**
  - Dropdown Ok Button (`.mstrmojo-ui-CheckList, .mstrmojo-PopupList`)
  - Filter Apply Button (`.fp-btnbar .mstrmojo-Button`)
  - Filter Context Menu Container (`.mstrmojo-ui-Menu-item-container`)
  - Filter Panel Warning (`.mstrmojo-Label.subtitle.warning`)
- **Component actions:**
  - `addFilterToFilterPanel(attributesMetricsName)`
  - `addVisualizationFilterToFilterPanel(usedObjectName)`
  - `applyFilter()`
  - `changeShowOptionForAll()`
  - `changeToDynamicSelection(filterName)`
  - `checkFilterMenuItemSelectedByDisplayStyle(displayStyle, filterName, optionName)`
  - `checkSearchBoxItemSelected(filterName, optionName)`
  - `clickDisplayStyleOption(optionName)`
  - `clickDynamicButton(filterName)`
  - `clickDynamicButtons(nameList)`
  - `clickFilterContextMenuOption(filterName, contextMenuOptions)`
  - `collapseFilter(filterName, index = 0)`
  - `createBasicCustomGroup(attributeName, groupElement)`
  - `createDossierAndImportSampleFiles(sampleFileIdx = 0)`
  - `createInCanvasFilter(objectName)`
  - `createPanelStack()`
  - `createSimpleObjectSelector(attrName)`
  - `createSimpleObjectSelectorWithReplacement({ objectName, replacementName })`
  - `expandFilter(filterName, index = 0)`
  - `getDescriptionTooltipText(filterName)`
  - `getFilterSummary(filterName, index = 0)`
  - `getFilterWarningMessage(filterName, index = 0)`
  - `getInCanvasElementSelectedByDisplayStyle(displayStyle, filterName, filterElementName)`
  - `getInCanvasEmptyWarningByDisplayStyle(displayStyle, filterName, expectedEmptyText = 'Make at least one selection.')`
  - `getScopeFilterInfoMessage()`
  - `hoverFilterPanelWarning()`
  - `isDashboardFilterDisplayed()`
  - `isDynamicButtonEnabled(filterName)`
  - `isDynamicButtonPresent(filterName)`
  - `isFilterInfoIconDisplayed(filterName)`
  - `isFilterItemGlobalIconDisplayed(filterName, index = 0)`
  - `isFilterItemMandatoryIconDisplayed(filterName)`
  - `isFilterItemMenuDisplayed(filterName, index = 0)`
  - `isFilterOptionDisplayed(optionName)`
  - `isScopeFilterDisplayed()`
  - `moveFilterToCanvas(elementName, visualizationTitle)`
  - `openFilterContextMenu(filterName)`
  - `removeInCanvasElementByDisplayStyle(displayStyle, filterObject, elementName, idx = 2)`
  - `selectDisplayStyleForFilterItem(filterName, displayStyle)`
  - `selectDisplayStyleForInCanvasItem(filterName, dragButtonIdx, inCanvasContainerIdx, displayStyle)`
  - `selectDynamicSelectionMode(filterName, mode, quantity, index=0)`
  - `selectFilterItem(filterName)`
  - `selectFilterItems(nameList)`
  - `selectFilterPanelFilterCheckboxOption(filterName, optionName)`
  - `selectFilterPanelOptionByDisplayStyle(displayStyle, filterName, optionName, idx = 1)`
  - `selectFiltersOption(optionName)`
  - `selectInCanvasContextOption(objectName, optionName, waitForLoadingAfter = true)`
  - `selectInCanvasDynamicSelectionMode(objectName, mode, quantity, idx)`
  - `selectInCanvasFilterCheckboxOption(filterName, optionName)`
  - `selectInCanvasPanelFilterCheckboxOptionByDisplayStyle(displayStyle, filterName, optionName, extra)`
  - `selectItemOptionByDisplayStyle(displayStyle, name, extra = {})`
  - `setFilterToSelectorContainer(filterName, index)`
  - `switchToFilterPanel()`
  - `waitLoadingDataPopUpIsNotDisplayed()`
- **Related components:** getCreatePanel, getFilterContextMenuContainer, getFilterPanel, getInCanvasFilterContainer, getNewInCanvasFilterContainer, getSelectionRequiredFilterPanel, getStandardFilterContainer, selectTargetInLayersPanel

### Checkbox
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `click()`
  - `findAll(container)`
  - `getLabelText()`
  - `isChecked()`
- **Related components:** _none_

### CollaborationDB
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `deleteAllComments(dburl, dossierID)`
  - `deleteAllNotifications(dburl, userID)`
  - `deleteAllTopics(dburl, dossierID)`
  - `disconnect()`
- **Related components:** _none_

### Email
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clearMsgBox()`
  - `getAddedContent(userName)`
  - `getBrowserLink(userName)`
  - `getInviteContent(userName, trim = true)`
  - `getInviteMessage(userName, trim = true)`
  - `getMentionMessage(userName)`
  - `getMentionTitle(userName)`
  - `getSharedMsg(userName)`
  - `openViewInBrowserLink(userName)`
  - `recieveEmail(userName)`
- **Related components:** dossierPage, libraryPage

### EmbedPromptEditor
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickCancelButton()`
  - `clickDoneButton()`
  - `waitForLoading()`
- **Related components:** getButtonsContainer, getPromptEditorContainer, getPromptSummaryContainer

### FilterCapsule
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `capsuleCount(filterElementFinder)`
  - `capsuleName({ filterElementFinder, index })`
  - `highlightCapsuleByName({ filterElementFinder, name })`
  - `isCapsuleDynamicByOrder({ filterElementFinder, index })`
  - `isCapsuleExcluded({ filterElementFinder, name })`
  - `isCapsuleExcludedByOrder({ filterElementFinder, index })`
  - `isCapsuleHighlighted({ filterElementFinder, name })`
  - `isCapsulePresent({ filterElementFinder, name })`
  - `removeCapsuleByName({ filterElementFinder, name })`
  - `removeCapsuleByOrder({ filterElementFinder, index })`
- **Related components:** _none_

### FilterDropdown
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `inputBoxValue(filterElementFinder)`
  - `openDropdownMenu(filterElementFinder)`
  - `selectedOption(filterElementFinder)`
  - `selectOption(filterElementFinder, option)`
  - `updateValue({ elem, valueLower, valueUpper })`
  - `updateValueWithEnter({ elem, valueLower, valueUpper })`
- **Related components:** getDropDownContainer

### FilterElement
- **CSS root:** `.mstrd-FilterDetailsPanel-wrapper`
- **User-visible elements:**
  - Enabled Toggle (`.mstrd-Switch.mstrd-Switch--checked`)
  - GDDEUpdate (`.mstrd-FilterItemTitle-gddeStatus > .loading-spinner`)
  - Secondary Filter Panel (`.mstrd-FilterDetailsPanel-wrapper`)
  - View Selected Icon (`.mstrd-Switch`)
- **Component actions:**
  - `bulkSelection(option)`
  - `clearAll()`
  - `clickFooterButton(option)`
  - `elementByOrder(index)`
  - `getCheckBoxElementsCount()`
  - `getElementIndex(name)`
  - `getSearchResultsText()`
  - `hoverOnElement(name)`
  - `hoverOnRadioButton(name)`
  - `hoverOnSearchElement(name)`
  - `isClearAllEnabled()`
  - `isElementPresent(name)`
  - `isElementSelected(name)`
  - `isFooterButtonDisabled(option)`
  - `isFooterButtonPresent(option)`
  - `isKeepOnlyLinkDisplayed(name)`
  - `isKeepOnlyLinkDisplayedForSearchElement(name)`
  - `isRadioButtonPresent(name)`
  - `isRadioButtonSelected(name)`
  - `isSearchElementSelected(name)`
  - `isSelectAllEnabled()`
  - `isViewSelectedEnabled()`
  - `isViewSelectedPresent()`
  - `keepOnly(name)`
  - `keepOnlyForSearchElement(name)`
  - `message()`
  - `radioButtonByOrder(index)`
  - `selectAll()`
  - `selectElementByName(name)`
  - `selectRadioButtonByName(name)`
  - `selectSearchElementByName(name)`
  - `toggleViewSelectedOption()`
  - `toggleViewSelectedOptionOn()`
  - `visibleElementCount()`
  - `visibleRadioButtonCount()`
  - `visibleSearchElementCount()`
  - `visibleSelectedElementCount()`
  - `visibleSelectedRadioButtonCount()`
  - `waitForGDDEUpdate()`
- **Related components:** getSecondaryFilterPanel

### FilterPanel
- **CSS root:** `.mstrd-FilterDropdownMenuContainer`
- **User-visible elements:**
  - Add Filter Button (`.mstrd-DropdownMenu-headerIcon.icon-pnl_add-new.addFilter`)
  - Add Filter Menu (`.mstrd-FilterPanelAddFilter-menu`)
  - Apply Button (`.mstr-apply-button`)
  - Cancel GDDE (`.mstrd-FilterItemTitle-filterCancel`)
  - Clear Filter (`.mstr-clear-text`)
  - Disabled Apply Button (`.mstr-apply-button.apply-disabled`)
  - Disabled Clear Filter Button (`.mstr-clear-text.inactive`)
  - Empty Filter (`.mstrd-FilterPanel-empty`)
  - Filter Details Panel (`.mstrd-FilterDetailsPanel`)
  - Filter Disabled Message (`.mstrd-LockFilterMessageSection`)
  - Filter Icon (`.mstr-nav-icon.icon-tb_filter_n`)
  - Filter Icon Of Opened Filter Panel (`.mstr-nav-icon.icon-tb_filter_a`)
  - Filter Icon On Left (`.mstrd-NavBar-left .mstr-nav-icon.icon-tb_filter_n`)
  - Filter Main Panel (`.mstrd-DropdownMenu-main, .mstrd-MobileSliderMenu-slider`)
  - Filter Panel (`.mstrd-FilterDropdownMenuContainer`)
  - Filter Panel Content (`.mstrd-FilterPanel-content`)
  - Filter Panel Dropdown (`.mstrd-FilterDropdownMenuContainer .mstrd-DropdownMenu-content`)
  - Filter Panel Footer (`.mstrd-FilterPanelFooterContainer`)
  - Filter Panel Wrapper (`.mstrd-DropdownMenu-main`)
  - GDDEError (`.mstrd-FilterItemTitle.mstrd-FilterItemTitle-gddeStatus`)
  - GDDEUpdate (`.mstrd-FilterItemTitle-gddeStatus > .loading-spinner`)
  - GDDEWarning Icon (`.icon-warning`)
  - More Setting Icon (`.mstrd-DropdownMenu-headerIcon.icon-pnl_more-options`)
  - Opened Filter Icon On Left (`.mstrd-NavBar-left .mstr-nav-icon.icon-tb_filter_a`)
  - Retry GDDE (`.mstrd-FilterItemTitle-filterRetry`)
  - Secondary Filter Panel (`.mstrd-FilterDetailsPanel.mstrd-FilterDetailsPanel-filter-panel`)
  - Tooltip (`.ant-tooltip-inner`)
  - View Selected (`.mstrd-FilterViewSelected .mstrd-Switch`)
- **Component actions:**
  - `apply()`
  - `applyAndReopenPanel(optionalFilter)`
  - `applyWithoutWaiting(isWait = true)`
  - `clearAllFilters()`
  - `clearFilter()`
  - `clickAddFilterButton()`
  - `clickAddFilterMenuButton(name)`
  - `clickAddOrCancelButtonInAddFilter(btnName)`
  - `clickAttributeInAddFilter(attrName)`
  - `clickFilterByName(name)`
  - `clickViewSelected()`
  - `closeFilterPanel()`
  - `closeFilterPanelByCloseIcon()`
  - `dockFilterPanel()`
  - `filterItemText()`
  - `filterName({ index })`
  - `getDescriptionTooltipText(name)`
  - `getFilterDisabledMessageText()`
  - `getFilterPanelContentHeight()`
  - `getFilterPanelFooterHeight()`
  - `getFilterPanelHeaderHeight()`
  - `getFilterPanelWrapperHeight()`
  - `getTooltipText()`
  - `hoverFilterByName(name)`
  - `hoverFilterPanelIcon()`
  - `isApplyEnabled()`
  - `isAttrFilterDetailsPanelLocked(name)`
  - `isAttributeDisplayedInAddFilter(attrName)`
  - `isCalFilterDetailsPanelLocked(name)`
  - `isClearFilterDisabled()`
  - `isDockIconDisplayed()`
  - `isFilterContentOverlapsWithFooter()`
  - `isFilterDisplayedInFilterPanel(name)`
  - `isFilterIconDisabled()`
  - `isFilterIconPresent()`
  - `isFilterInfoIconDisplayed(name)`
  - `isFilterItemLocked(name)`
  - `isFilterPanelEmpty()`
  - `isGlobalFilterIconExist(name, index = 0)`
  - `isLeftDocked()`
  - `isMainPanelOpen()`
  - `isMoreSettingPresent()`
  - `isPanelCloseIconDisplayed()`
  - `isPanelDocked()`
  - `isResetAllFiltersButtonDisabled()`
  - `isResetAllFiltersButtonPresent()`
  - `isRightDocked()`
  - `isUndockIconDisplayed()`
  - `isVizFilterDetailsPanelLocked(name)`
  - `isWarningMessagePresent(name)`
  - `openFilterPanel()`
  - `resetAllFilters()`
  - `scrollFilterPanelContentToBottom()`
  - `selectFilterItem(name)`
  - `selectFilterItems(nameList)`
  - `switchToFilterPanel()`
  - `toggleFilterSummary()`
  - `undockFilterPanel()`
  - `unselectFilterItem(name)`
  - `waitForGDDE()`
  - `warningMessageText(name)`
- **Related components:** dossierPage, getFilterIconOfOpenedFilterPanel, getFilterItemContainer, getFilterMainPanel, getFilterPanel, getLockedAttrFilterDetailsPanel, getLockedCalFilterDetailsPanel, getLockedVizFilterDetailsPanel, isMainPanel, openFilterPanel

### FilterSearch
- **CSS root:** `.mstrd-SearchStyleFilterDetailsPanel-result`
- **User-visible elements:**
  - Empty Search Image (`.mstrd-SearchStyleFilterItemsList-image`)
  - Filter Search Box (`.mstrd-FilterSearchBox`)
  - Search Results (`.mstrd-SearchStyleFilterDetailsPanel-result`)
  - Search Warning Msg (`.mstrd-FilterItemsList-warn-msg`)
- **Component actions:**
  - `clearSearch()`
  - `isClearSearchIconPresent()`
  - `isEmptySearchDisplayed()`
  - `isSearchWarningMsgPresent()`
  - `keyword()`
  - `search(keyword)`
  - `searchboxPlaceholder()`
  - `searchResults()`
- **Related components:** _none_

### FilterSlider
- **CSS root:** `.ant-tooltip-inner`
- **User-visible elements:**
  - Slider Tooltip Container (`.ant-tooltip-inner`)
- **Component actions:**
  - `clearSlider(filterElementFinder)`
  - `clickHandle(filterElementFinder)`
  - `clickLowerHandle(filterElementFinder)`
  - `clickUpperHandle(filterElementFinder)`
  - `dragAndDropHandle(filterElementFinder, pos)`
  - `dragAndDropLowerHandle(filterElementFinder, pos)`
  - `dragAndDropUpperHandle(filterElementFinder, pos)`
  - `dragToSamePosition(filterElementFinder)`
  - `hoverOnHandle(filterElementFinder)`
  - `hoverOnLowerHandle(filterElementFinder)`
  - `hoverOnMaxValue(filterElementFinder)`
  - `hoverOnMinValue(filterElementFinder)`
  - `hoverOnSummaryLabel(filterElementFinder)`
  - `hoverOnUpperHandle(filterElementFinder)`
  - `isSummaryInExcludeMode(name)`
  - `isSummaryInputInExcludeMode(name)`
  - `isSummaryPresent(filterElementFinder)`
  - `lowerInput(filterElementFinder)`
  - `maxValue(filterElementFinder)`
  - `minValue(filterElementFinder)`
  - `sliderTooltip()`
  - `summary(filterElementFinder)`
  - `updateLowerInput(filterElementFinder, value)`
  - `updateUpperInput(filterElementFinder, value)`
  - `upperInput(filterElementFinder)`
- **Related components:** filterPanel, getSliderTooltipContainer, getTooltipContainer

### FilterSummary
- **CSS root:** `.mstrd-FilterSummaryPanel-items`
- **User-visible elements:**
  - Edit Icon (`.mstrd-FilterSummaryBar`)
  - Expanded Summary Items (`.mstrd-FilterSummaryPanel-items`)
  - Filter Count (`.mstrd-FilterSummaryBar`)
  - View All Button (`.mstrd-FilterSummaryBar-right`)
- **Component actions:**
  - `expandedFilterItems(name)`
  - `filterCount()`
  - `filterItems(name)`
  - `hoverOnFilterSummary(filterName)`
  - `isFilterExcluded(name)`
  - `viewAllFilterItems()`
- **Related components:** getTooltipContainer

### FontPicker
- **CSS root:** `.ant-select-dropdown.mstr-rc-font-selector__dropdown`
- **User-visible elements:**
  - Font Picker Dropdown (`.ant-select-dropdown.mstr-rc-font-selector__dropdown`)
  - Inner Selector Dropdown (`.ant-select-dropdown.mstr-rc-font-selector__innerdropdown`)
  - Missing Font Tooltip (`.mstr-rc-font-selector__popover .ant-popover-content`)
- **Component actions:**
  - `clickWarningIcon()`
  - `getCurrentInnerSelectorMode()`
  - `getCurrentSelectedFont()`
  - `openFontPicker()`
  - `selectFontByName(fontName)`
  - `switchMode(optionName)`
- **Related components:** _none_

### for
- **CSS root:** `.ant-tooltip.object-tooltip-container`
- **User-visible elements:**
  - Context Menu (`.mstr-context-menu:not(.ant-dropdown-hidden)`)
  - Folder Browser Tree Popover (`.mstr-folder-tree-style:not(.ant-select-dropdown-hidden) .ant-select-tree-list-holder`)
  - Search Loading Icon (`.search-loading-spinner`)
  - Tooltip Container (`.ant-tooltip.object-tooltip-container`)
- **Component actions:**
  - `clearSearchBox()`
  - `clickDoneButton()`
  - `clickFolderUpButton()`
  - `doubleClickObject(objectName)`
  - `getCurrentSelectedFolder()`
  - `getTooltipText()`
  - `getTotalObjectCount(isByLabel = true)`
  - `hoverOnCurrentFolderSelector()`
  - `isFolderUpButtonDisabled()`
  - `isObjectPresentInFlatView(name)`
  - `navigateInObjectBrowserFlatView(paths)`
  - `navigateInObjectBrowserPopover(paths)`
  - `openContextMenuOnObject({ name, isWait = true })`
  - `openFolderBrowserPopover()`
  - `scrollObjectBrowserPopoverToTop()`
  - `scrollToBottomInTreePopover()`
  - `scrollToTopInTreePopover()`
  - `searchObject(name, option = {})`
  - `selectObjectInFlatView(name)`
  - `waitForLoading()`
  - `waitForTooltipVisible()`
- **Related components:** getDatasetSelectContainer, getTooltipContainer

### HamburgerMenu
- **CSS root:** `.mstrd-MobileSliderMenu-slider`
- **User-visible elements:**
  - Add Filter Button In Mobile View (`.mstrd-MobileSliderOptionRow-addIcon.icon-pnl_add-new`)
  - Back Button In Moble View (`.mstrd-MobileSliderOptionRow-menuOption--hasBackAction .mstrd-MobileSliderOptionRow-backArrow`)
  - Close Manage Library Button (`.mstrd-MobileManageLibraryNavBarContainer-back.mstrd-Button.mstrd-Button--clear`)
  - Cross Icon (`.mstrd-HamburgerIconContainer-icon--open`)
  - Excel Range Settings (`.mstrd-ExcelExportPagesSetting`)
  - Export To CSVSettings Panel (`.mstrd-ExportPanel-options`)
  - Export To Excel Settings Panel (`.mstrd-DossierExcelPanel`)
  - Export To PDFSettings Panel (`.mstrd-ExportDetailsPanel`)
  - Filter Icon (`.mstrd-LibraryFilterContainer-button.icon-tb_sort-filter_n.mstr-nav-icon`)
  - Filter Panel In Mobile View (`.mstrd-FilterPanel`)
  - Hamburger Icon (`.mstrd-HamburgerIconContainer`)
  - Log Out Button (`.mstrd-MobileAccountMenuItem-logout`)
  - Slider Menu Container (`.mstrd-MobileSliderMenu-slider`)
  - Sort And Filter Panel (`.mstrd-MobileSliderMenu-slider`)
  - Subscribe To Dashboard Panel (`.mstrd-SubscribeDetailsPanel`)
  - Timezone Edit Btn In Mobile View (`.mstrd-TimezoneDetailsPanel-mine-edit`)
  - User Name In Mobile View (`.mstrd-MobileAccountMenuItem-option`)
- **Component actions:**
  - `_selectDropDownItemOption({ dropDownOption, dropDownItems })`
  - `clickAddFilterButtonInMobileView()`
  - `clickAutoAnswers()`
  - `clickBackButtonInMobileView()`
  - `clickButton(option)`
  - `clickEditBtnInMobileView()`
  - `clickExportToCSV()`
  - `clickExportToExcel()`
  - `clickExportToPDF()`
  - `clickFilterOptionInMobileView(option)`
  - `clickOptionInMobileView(option)`
  - `clickShare()`
  - `clickSubscribeToDashboard()`
  - `close()`
  - `closeFilterPanelInMobileView()`
  - `closeHamburgerMenu()`
  - `closeManageLibrary()`
  - `closeSortByDropdownInMobileView()`
  - `closeTypesDropdownInMobileView()`
  - `getMenuOptionsCount()`
  - `isMobileSliderMenuOpened()`
  - `openAutoAnswersInMobileView()`
  - `openFilterDetailPanelInMobileView(item)`
  - `openFilterPanelInMobileView()`
  - `openHamburgerMenu()`
  - `openLibraryFilterInMobileView()`
  - `openSortByDropdownInMobileView()`
  - `openTypesDropdownInMobileView()`
  - `selectExcelRange(dropDownOption)`
- **Related components:** _getDropDownContainer, getFilterPanel, getSliderMenuContainer, getSliderOptionContainer, getSortAndFilterPanel

### Legend
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `collapseLegendBox(elementFinder)`
  - `expandLegendBox(elementFinder)`
  - `getlegendColor({ elementFinder, element })`
  - `hideLegendBox(elementFinder)`
  - `isLegendMinimized(elementFinder)`
  - `isLegendPresent(elementFinder)`
- **Related components:** _none_

### LibraryFilter
- **CSS root:** `.mstrd-LibraryFilterDropdown-filterPanel`
- **User-visible elements:**
  - Base Filter Container (`.mstrd-BaseFilterPanel-body`)
  - Curtain (`.mstrd-LibraryViewCurtain--transparent`)
  - Filter Container (`.mstrd-LibraryFilterDropdown-filterPanel`)
  - Filter Count (`.mstrd-LibraryFilterContainer-applyCount`)
  - Filter Details Panel (`.mstrd-BaseFilterDetailPanel`)
  - Filter Icon (`.mstrd-LibraryFilterContainer-button`)
  - Library Filter Apply Count (`.mstrd-LibraryFilterContainer-applyCount`)
- **Component actions:**
  - `changeTypesTo(option)`
  - `checkFilterType(option)`
  - `clearAllFilters()`
  - `clearSearch()`
  - `clearTypesSelection()`
  - `clickApplyButton()`
  - `clickClearAllButton()`
  - `clickFilterDetailsPanelButton(button)`
  - `clickFilterIcon()`
  - `closeFilterPanel()`
  - `filterApplyCount()`
  - `filterCount()`
  - `filterTypes()`
  - `getDetailsPanelItemsCount()`
  - `getFilterDropdownOptionsNames()`
  - `getFilterOptions()`
  - `getFilterTypeItemsNames()`
  - `hoverFilter()`
  - `isApplyButtonEnable()`
  - `isCertifiedSelected()`
  - `isCertifiedSwitchFocused()`
  - `isDocumentSelected()`
  - `isDossierSelected()`
  - `isFilterCountDisplayed()`
  - `isFilterOpen()`
  - `isFilterTypeChecked(option)`
  - `isFilterTypeItemPresent(option)`
  - `isLibraryFilterDisplay()`
  - `isNewtSelected()`
  - `isUpdatedSelected()`
  - `keepOnlyOption(name)`
  - `noElementText()`
  - `openFilterDetailPanel(type, index = 0)`
  - `openFilterTypeDropdown()`
  - `searchFilterItem(name)`
  - `selectCertifiedOnly()`
  - `selectFilter(path, index = 0)`
  - `selectFilterDetailsPanelItem(option)`
  - `selectFilterOptionButton(option)`
  - `selectOptionInCheckbox(name)`
  - `toggleViewSelected()`
  - `uncheckFilterType(option)`
- **Related components:** getFilterContainer, getFilterDetailPanel, getFilterDetailsPanel, getOptionInCheckboxDetailPanel, getTooltipContainer, openFilterDetailPanel, selectFilterDetailsPanel

### LibraryItem
- **CSS root:** `.ant-tooltip-inner`
- **User-visible elements:**
  - Certify Tooltip (`.ant-tooltip-inner`)
  - Dossier Name Font (`.mstrd-DossierItem-name-text`)
  - Tooltip (`.ant-tooltip:not(.ant-tooltip-hidden)`)
- **Component actions:**
  - `getAllItemsCount()`
  - `getDossierNameFont()`
  - `getTooltipText()`
  - `hoverOnCertifiedIcon(name)`
  - `hoverOnObjectTypeIcon(name)`
  - `hoverOnTemplateIcon(name)`
  - `hoverOnUserName(name)`
  - `isAddToLibraryIconDisplayed(name)`
  - `isBotCoverGreyed(name)`
  - `isBotHasInactiveInName(name, i18nText = ' (Inactive)`
  - `isCommentCountDisplayed(name)`
  - `isItemCertified(name)`
  - `isItemDocument(name)`
  - `isItemViewable(name, owner = null)`
  - `isObjectTypeIconDisplayed(name)`
  - `isRunAsExcelIconPresent(name)`
  - `isRunAsPDFIconPresent(name)`
  - `itemInfo(name)`
  - `itemSharedByTimeInfo(name)`
  - `openItemByIndex(index)`
- **Related components:** _none_

### LibraryNotification
- **CSS root:** `.mstrd-FloatNotifications`
- **User-visible elements:**
  - Float Notification (`.mstrd-FloatNotifications`)
  - Mobile Smart Banner (`.mstrd-SmartBanner`)
  - Notification Section (`.ant-notification.ant-notification-bottomRight`)
- **Component actions:**
  - `clickNotificationCloseButton()`
  - `closeSnapshotNotificationByName(notificationName)`
  - `getAllNotificationMessages()`
  - `getNotificationCount()`
  - `getNotificationDescriptionTextByIndex(index = 0)`
  - `getNotificationMessage(notificationName)`
  - `getNotificationMessageTextByIndex(index = 0)`
  - `getSnapshotNotificationDescriptionText(notificationName)`
  - `getSnapshotNotificationMessageText(notificationName)`
  - `isNotificationCloseButtonVisible()`
  - `isNotificationVisible()`
  - `isSmartBannerVisible()`
  - `isSnapshotInProgressNotificationVisible(notificationName)`
  - `isSnapshotReadyNotificationVisible(notificationName)`
  - `openReadyNotificationByName(notificationName)`
  - `waitForAllNotificationShown(cnt = 2)`
- **Related components:** _none_

### LibrarySort
- **CSS root:** `.mstrd-SortContainer`
- **User-visible elements:**
  - Combined Mode Sort Box (`.mstrd-SortBox-sortbycontent`)
  - Curtain (`.mstrd-LibraryViewCurtain--transparent`)
  - Sort Arrow (`.mstrd-SortArrow`)
  - Sort Box (`.mstrd-SortBox-content`)
  - Sort Menu (`.mstrd-SortContainer`)
  - Sort Option (`.mstrd-SortBox-selected`)
- **Component actions:**
  - `closeSortMenu()`
  - `currentSortOption()`
  - `currentSortOrder()`
  - `currentSortStatus()`
  - `getAllSortOptionsText()`
  - `getSortOptionFont()`
  - `hoverQuickSort()`
  - `isSortDisplay()`
  - `isSortMenuOpen()`
  - `isSortOptionExist(option)`
  - `isSortOptionTabFocused(option)`
  - `openCombinedModeSortMenu()`
  - `openSortMenu()`
  - `quickSort()`
  - `selectSortOption(option)`
  - `selectSortOrder(order)`
- **Related components:** getTooltipContainer

### ObjectFolderBrowser
- **CSS root:** `.mstr-object-browser-container`
- **User-visible elements:**
  - Folder Browser Container (`.mstr-object-browser-container`)
- **Component actions:**
  - `chooseFolderByName(name)`
  - `openFolderByPath(path)`
  - `openObjectSelector()`
- **Related components:** getFolderBrowserContainer

### PADb
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `disconnect()`
  - `queryTelemetry(dburl, { jobId, userName = 'telemetry_user', objectId = null })`
- **Related components:** _none_

### Panel
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `closePanel(panelFinder)`
  - `dockPanel(panelFinder)`
  - `isDockIconDisplayed(panelFinder)`
  - `isLeftDocked(panelFinder)`
  - `isPanelCloseIconDisplayed(panelFinder)`
  - `isPanelDocked(panelFinder)`
  - `isRightDocked(panelFinder)`
  - `isUndockIconDisplayed(panelFinder)`
  - `undockPanel(panelFinder)`
- **Related components:** getDockPanel

### PromptEditor
- **CSS root:** `.mstrd-PromptEditorContainer-overlay`
- **User-visible elements:**
  - Close Index Icon (`.mstrPromptEditorCellTOC`)
  - Document Content (`[class*=mstrd-ViDocRenderer]`)
  - Dossier Content (`[class*=mstrmojo-VIDocument]`)
  - Message Box (`.mstrd-MessageBox`)
  - Msg Name Input On Web (`.mstrPromptEditorCellRenameMsgToolbar`)
  - Open Index Icon (`.mstrPromptEditorCellTOC`)
  - Page Start Input (`.mstrPopupOpaqueContainer`)
  - Promprt Editor Selectable Mode (`.mstrd-PromptEditor.mstrd-PromptEditor--selectableMode`)
  - Prompt Container (`.mstrd-PromptEditorContainer-overlay`)
  - Prompt Editor (`#mstrdossierPromptEditor, .mstrPromptEditor`)
  - Reprompt Icon (`.mstr-nav-icon.icon-tb_prompt`)
  - Web Prompt Summary (`.mstrPromptTOCSummaryButton`)
- **Component actions:**
  - `backPrompt()`
  - `cancelEditor()`
  - `cancelResolvePrompt()`
  - `checkDynamicSummary(promptName)`
  - `checkEmptySummary(promptName)`
  - `checkEmptySummaryByIndex(index)`
  - `checkListSummary(promptName)`
  - `checkListSummaryByIndex(index)`
  - `checkMultiQualSummary(promptName)`
  - `checkQualSummary(promptName)`
  - `checkQualSummaryOfDefault(promptName)`
  - `checkTextSummary(promptName)`
  - `clickButtonByName(name)`
  - `clickButtonByNameAndNoWait(name)`
  - `clickPromptIndexByTitle(title)`
  - `clickPromptIndexByTitleWithNoWait(title)`
  - `clickSelectButton()`
  - `clickWebPromptSummary()`
  - `closeEditor()`
  - `closeIndex()`
  - `findPrompt(title)`
  - `getPromptCountInViewSummary()`
  - `getSummaryText(promptName)`
  - `isEditorOpen()`
  - `isEditorSelectableModeOpen()`
  - `isRenameBoxPresent()`
  - `isRepromptIconPresent()`
  - `isViewSummaryEnabled()`
  - `openIndex()`
  - `renameReportMsgOnWeb(newName)`
  - `reprompt()`
  - `run()`
  - `runNoWait()`
  - `runPromptInPrompt()`
  - `runWithERR()`
  - `runWithPIP()`
  - `runWithWaitForCancel()`
  - `scrollEditorToBottom()`
  - `scrollEditorToTop()`
  - `scrollWindowToRightmost()`
  - `selectPromptByName(promptName)`
  - `selectPromptItems(promptList)`
  - `setPageStartIndex(index)`
  - `switchDynamicByName(promptName)`
  - `switchDynamicItems(promptList)`
  - `toggleViewSummary()`
  - `waitForEditor()`
  - `waitForEditorClose()`
  - `waitForEditorSelectableMode()`
  - `waitForError()`
  - `waitForMessageBox()`
  - `waitForPromptLoading()`
  - `waitForRepromptLoading()`
  - `waitForSummaryItem(promptName)`
- **Related components:** getPage, getPromptContainer, getSummaryContainer

### PromptSearchbox
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clearSearch(promptElement)`
  - `clickMatchCase(promptElement)`
  - `searchFor(promptElement, text)`
- **Related components:** _none_

### SaveAsEditor
- **CSS root:** `.mstrmojo-OBNavigatorPopup`
- **User-visible elements:**
  - Object Browser Drop Down (`.mstrmojo-OBNavigatorPopup`)
  - Save As Editor (`.mstrmojo-SaveAsEditor`)
  - Saving Modal View (`.saving-in-progress.modal`)
- **Component actions:**
  - `browseFolderInSaveAsDialog(folderName)`
  - `changeCertifyCheckBoxInSaveAsDialog(certified)`
  - `changeInputBotNameInSaveAsDialog(name)`
  - `changeSetAsTemplateCheckBoxInSaveAsDialog()`
  - `clickCancelButtonInSaveAsDialog()`
  - `clickSaveButtonInSaveAsDialog()`
  - `getBotNameInSaveDialog()`
  - `isCertifyCheckBoxCheckedInSaveAsDialog()`
  - `isCertifyCheckBoxPresentInSaveAsDialog()`
  - `openObjectBrowser()`
  - `searchByName(text)`
  - `waitForSaving()`
- **Related components:** getFolderContainer

### SearchBox
- **CSS root:** `.mstrd-SearchNavItemContainer-results--recent`
- **User-visible elements:**
  - Recently Searched Container (`.mstrd-SearchNavItemContainer-results--recent`)
  - Search Box (`.mstrd-SearchBox`)
  - Search Icon (`.mstrd-SearchNavItemContainer .icon-search_tb_box`)
- **Component actions:**
  - `clearAllRecentlySearchedItems()`
  - `clearRecentlySearchedItem(index)`
  - `clearSearch()`
  - `isClearSearchIconDisplayed()`
  - `isInputBoxEmpty()`
  - `isRecentlySearchedPresent()`
  - `isRecentlySearchedResultEmpty()`
  - `isSearchBoxOpened()`
  - `pressEnter()`
  - `recentlySearchedItemCount()`
  - `search(text)`
- **Related components:** getRecentlySearchedContainer

### Select
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `click()`
  - `open()`
- **Related components:** _none_

### ShowDataDialog
- **CSS root:** `.mstrmojo-ListBase.mstrmojo-ui-Menu`
- **User-visible elements:**
  - Row Count (`.mstrmojo-ViewDataDialog .mstrmojo-rowcount`)
  - Show Data Dialog (`.mstrmojo-ViewDataDialog.modal`)
  - Show Data Export Type Container (`.mstrmojo-ListBase.mstrmojo-ui-Menu`)
  - Show Data Popup (`.mstrmojo-ViewDataDialog.mstrmojo-popup-widget-hosted`)
- **Component actions:**
  - `addElementToDataset({ title, elem })`
  - `addGridToViz()`
  - `applyAndCloseUnitSelectionPopup()`
  - `cancelAndCloseUnitSelectionPopup()`
  - `changeColumnSetInAgGrid(columnSetName)`
  - `clickAddDataButton()`
  - `clickAddDataOkButton()`
  - `clickShowDataCloseButton()`
  - `clickShowDataExportButton()`
  - `clickShowDataExportButtonNoPrivilege()`
  - `closeShowDataDialog(authoring = false)`
  - `dragCellToColHeader(objectToDrag, position, targetHeader)`
  - `dragCellToRowHeader(objectToDrag, position, targetHeader)`
  - `exportShowData(fileType)`
  - `getAddDataElementCheckbox({ title, elem })`
  - `getAddDataList(title)`
  - `getColumnSetOptionText()`
  - `getDatasetRowCount()`
  - `getHeadersInshowDataGrid()`
  - `isRowCountEqual(num)`
  - `isShowDataDialogDisplayed()`
  - `isShowDataExportButtonAvailable()`
  - `isShowDataExportTypePresent(type)`
  - `moveObjectByColumnBorder(objectName, colNum)`
  - `moveShowDataVerticalScrollBarToBottom(pos)`
  - `resizeColumnByMovingBorder(colNum, pixels, direction)`
  - `scrollDatasetToBottom()`
  - `selectColumnSetOption(option)`
  - `selectUnitsInUnitSelectionPopup(objectNames)`
  - `sortByColumnHeader(headerName)`
  - `sortShowDataGridbyClickingHeader(objectName)`
- **Related components:** getAddDataContainer, getDatasetContainer, getShowDataExportTypeContainer, vizPanel

### TOCMenu
- **CSS root:** `.mstrd-ToCDropdownMenuContainer`
- **User-visible elements:**
  - Contents Panel (`#rootView .mstrmojo-RootView-toc`)
  - Dossier Name (`.mstrd-DropdownMenu-headerTitle`)
  - Menu Container (`.mstrd-ToCDropdownMenuContainer`)
  - TOCIcon (`.mstr-nav-icon[class*=icon-tb_toc]`)
- **Component actions:**
  - `assertDossierName()`
  - `closeMenu()`
  - `createNewChapter()`
  - `createNewPage()`
  - `dockTOCMenu()`
  - `duplicateChapter(chapterName)`
  - `duplicatePage(pageName)`
  - `getMenuContainerWidth()`
  - `getMenuContentHeight()`
  - `getMenuContentScrollHeight()`
  - `getMenuListHeight()`
  - `getMenuListScrollHeight()`
  - `getSelectedPageName()`
  - `goToChapter(chapterName, specType)`
  - `goToPage(chapterName, pageName)`
  - `hoverOverChapter(chapterName)`
  - `hoverOverPage(chapterName, pageName)`
  - `isDockIconDisplayed()`
  - `isLeftDocked()`
  - `isPanelCloseIconDisplayed()`
  - `isRightDocked()`
  - `isTOCIconPresent()`
  - `isTOCLightTheme()`
  - `isUndockIconDisplayed()`
  - `openMenu()`
  - `scrollToBottom()`
  - `switchPageTo(pageName, delay)`
  - `undockTOCMenu()`
- **Related components:** basePanel, dossierAuthoringPage, dossierPage, getContentsPanel, getMenuContainer, getPage, getSelectedPage

### UserAccount
- **CSS root:** `.mstrd-AccountDropdownMenuContainer .mstrd-DropdownMenu-main`
- **User-visible elements:**
  - Account Divider (`.mstr-nav-icon.icon-divider`)
  - Account Dropdown (`.mstrd-AccountDropdownMenuContainer .mstrd-DropdownMenu-main`)
  - Current Application (`div.mstrd-CustomApplicationPicker-itemContainer--current`)
  - Current Selected Workspace Item (`.mstrd-WorkspacePicker-itemContainer--current`)
  - Logout Button (`.mstrd-AccountDropdownMenuContainer-logout`)
  - Preference Secondary Panel (`.mstrd-AccountDropdownMenuContainer-preferences-popover`)
  - Switch Application Sub Panel (`.mstrd-AccountDropdownMenuContainer-MyLibraries-SubPanel`)
  - Switch Workspace Sub Panel (`.mstrd-AccountDropdownMenuContainer-SwitchWorkspace-SubPanel`)
  - User Account (`.mstr-nav-icon[class*=icon-tb_profile_]`)
  - User Account Name (`.mstrd-DropdownMenu-main`)
  - User Account Name Element (`.mstrd-DropdownMenu-main`)
- **Component actions:**
  - `canUserLogin()`
  - `canUserLogout()`
  - `clickAccountButton()`
  - `clickAccountMenuOption(text)`
  - `clickAccountOption(text, options = {})`
  - `clickApplication(appName)`
  - `closeUserAccountMenu()`
  - `getAccountMenuOptionsNames()`
  - `getPreferenceSectionsNames()`
  - `getPreferenceText()`
  - `getUserName()`
  - `isAccountDropdownMenuPresent()`
  - `isAccountIconFocused()`
  - `isAccountOptionPresent(option)`
  - `isApplicationSelected(name)`
  - `isCloseButtonFocused()`
  - `isLogoutFocused()`
  - `isPreferencePresent()`
  - `logout(options = {})`
  - `openMyApplicationPanel()`
  - `openPreferencePanel()`
  - `openSwitchApplicationSubPanel()`
  - `openSwitchWorkspaceSubPanel()`
  - `openUserAccountMenu(options = {})`
  - `openUserAccountMenuWithKeyboard()`
  - `switchCustomApp(name)`
  - `switchCustomAppByIndex(index)`
  - `switchWorkspace(name)`
- **Related components:** getPreferenceSecondaryPanel, getSwitchApplicationSubPanel, getSwitchWorkspaceSubPanel, loginPage, openSwitchApplicationSubPanel, openSwitchWorkspaceSubPanel

### UserPreference
- **CSS root:** `.mstrd-AccountDropdownMenuContainer-preferences-popover`
- **User-visible elements:**
  - Preference Secondary Panel (`.mstrd-AccountDropdownMenuContainer-preferences-popover`)
- **Component actions:**
  - `cancelChange()`
  - `changePersistentNotificationSetting(enable = true)`
  - `changePreference(section, preference)`
  - `changeUserTimezone(timezone)`
  - `isChangeDescPresent()`
  - `isPersistentNotificationEnabled()`
  - `isPreferenceSecondaryPanelPresent()`
  - `openPreferenceList(section)`
  - `openTimezoneList()`
  - `savePreference()`
  - `selectedPreference(section)`
  - `selectedTimezone()`
  - `waitForPreferencePanelPresent()`
- **Related components:** getPreferenceSecondaryPanel

## Common Workflows (from spec.ts)

1. [TC98366] E2E | Library | Run sanity tests for KPIs, Bar, Line Chart and Pie Chart in different environments (used in 2 specs)
2. [TC98367] E2E | Library | Run sanity tests for Maps, More in different environments (used in 2 specs)
3. [TC98368] E2E | Library | Run sanity tests for Insight Visualizations in different environments (used in 2 specs)
4. [TC93604_1] E2E | Verify custom visualizations with HTML elements (used in 1 specs)
5. [TC93604_2] E2E | Verify custom visualizations with HTML elements (used in 1 specs)
6. [TC98568_1] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Custom1000*1000_FitToView (used in 1 specs)
7. [TC98568_2] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Screen16_9_FillTheView (used in 1 specs)
8. [TC98568_3] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_WideScreen_Zoom100 (used in 1 specs)
9. [TC98568_4] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Screen4_3_FitToView | Consumption (used in 1 specs)
10. [TC98569_1] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Custom1000*1000_FitToView | Authoring (used in 1 specs)
11. [TC98569_2] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Fill the view | Authoring (used in 1 specs)
12. [TC98569_3] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Zoom100 | Authoring (used in 1 specs)
13. [TC98569_4] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Screen4_3_FitToView | Authoring (used in 1 specs)
14. CustomVizHTMLSanity (used in 1 specs)
15. Library Visualization Sanity (used in 1 specs)
16. library Viz Sanity SaaS (used in 1 specs)
17. ResponsiveDashboard_InsightViz (used in 1 specs)
18. ResponsiveDashboard_InsightViz_Consume (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. Filter Icon -- frequency: 3
2. Curtain -- frequency: 2
3. Filter Count -- frequency: 2
4. Filter Details Panel -- frequency: 2
5. GDDEUpdate -- frequency: 2
6. getSummaryTextByIndex -- frequency: 2
7. Preference Secondary Panel -- frequency: 2
8. Secondary Filter Panel -- frequency: 2
9. Tooltip -- frequency: 2
10. Account Divider -- frequency: 1
11. Account Dropdown -- frequency: 1
12. Add Filter Button -- frequency: 1
13. Add Filter Button In Mobile View -- frequency: 1
14. Add Filter Menu -- frequency: 1
15. Alert Message -- frequency: 1
16. Antd Message -- frequency: 1
17. Apply Button -- frequency: 1
18. Back Button In Moble View -- frequency: 1
19. Base Filter Container -- frequency: 1
20. Cancel GDDE -- frequency: 1
21. Certify Tooltip -- frequency: 1
22. Clear Filter -- frequency: 1
23. Close Index Icon -- frequency: 1
24. Close Manage Library Button -- frequency: 1
25. Combined Mode Sort Box -- frequency: 1
26. Contents Panel -- frequency: 1
27. Context Menu -- frequency: 1
28. Cross Icon -- frequency: 1
29. Current Application -- frequency: 1
30. Current Selected Workspace Item -- frequency: 1
31. Disabled Apply Button -- frequency: 1
32. Disabled Clear Filter Button -- frequency: 1
33. Document Content -- frequency: 1
34. Dossier Content -- frequency: 1
35. Dossier Name -- frequency: 1
36. Dossier Name Font -- frequency: 1
37. Dropdown Ok Button -- frequency: 1
38. Edit Icon -- frequency: 1
39. Empty Filter -- frequency: 1
40. Empty Search Image -- frequency: 1
41. Enabled Toggle -- frequency: 1
42. Excel Range Settings -- frequency: 1
43. Expanded Summary Items -- frequency: 1
44. Export To CSVSettings Panel -- frequency: 1
45. Export To Excel Settings Panel -- frequency: 1
46. Export To PDFSettings Panel -- frequency: 1
47. Filter Apply Button -- frequency: 1
48. Filter Container -- frequency: 1
49. Filter Context Menu Container -- frequency: 1
50. Filter Disabled Message -- frequency: 1
51. Filter Icon Of Opened Filter Panel -- frequency: 1
52. Filter Icon On Left -- frequency: 1
53. Filter Main Panel -- frequency: 1
54. Filter Panel -- frequency: 1
55. Filter Panel Content -- frequency: 1
56. Filter Panel Dropdown -- frequency: 1
57. Filter Panel Footer -- frequency: 1
58. Filter Panel In Mobile View -- frequency: 1
59. Filter Panel Warning -- frequency: 1
60. Filter Panel Wrapper -- frequency: 1
61. Filter Search Box -- frequency: 1
62. Float Notification -- frequency: 1
63. Folder Browser Container -- frequency: 1
64. Folder Browser Tree Popover -- frequency: 1
65. Font Picker Dropdown -- frequency: 1
66. GDDEError -- frequency: 1
67. GDDEWarning Icon -- frequency: 1
68. Hamburger Icon -- frequency: 1
69. Inner Selector Dropdown -- frequency: 1
70. Library Filter Apply Count -- frequency: 1
71. Log Out Button -- frequency: 1
72. Logout Button -- frequency: 1
73. Menu Container -- frequency: 1
74. Message Box -- frequency: 1
75. Missing Font Tooltip -- frequency: 1
76. Mobile Smart Banner -- frequency: 1
77. More Setting Icon -- frequency: 1
78. Msg Name Input On Web -- frequency: 1
79. Notification Section -- frequency: 1
80. Object Browser Drop Down -- frequency: 1
81. Open Index Icon -- frequency: 1
82. Opened Filter Icon On Left -- frequency: 1
83. Page Start Input -- frequency: 1
84. Promprt Editor Selectable Mode -- frequency: 1
85. Prompt Container -- frequency: 1
86. Prompt Editor -- frequency: 1
87. Recently Searched Container -- frequency: 1
88. Reprompt Icon -- frequency: 1
89. Retry GDDE -- frequency: 1
90. Row Count -- frequency: 1
91. Save As Editor -- frequency: 1
92. Saving Modal View -- frequency: 1
93. Search Box -- frequency: 1
94. Search Icon -- frequency: 1
95. Search Loading Icon -- frequency: 1
96. Search Results -- frequency: 1
97. Search Warning Msg -- frequency: 1
98. Show Data Dialog -- frequency: 1
99. Show Data Export Type Container -- frequency: 1
100. Show Data Popup -- frequency: 1
101. Slider Menu Container -- frequency: 1
102. Slider Tooltip Container -- frequency: 1
103. Sort And Filter Panel -- frequency: 1
104. Sort Arrow -- frequency: 1
105. Sort Box -- frequency: 1
106. Sort Menu -- frequency: 1
107. Sort Option -- frequency: 1
108. Subscribe To Dashboard Panel -- frequency: 1
109. Switch Application Sub Panel -- frequency: 1
110. Switch Workspace Sub Panel -- frequency: 1
111. Timezone Edit Btn In Mobile View -- frequency: 1
112. TOCIcon -- frequency: 1
113. Tooltip Container -- frequency: 1
114. User Account -- frequency: 1
115. User Account Name -- frequency: 1
116. User Account Name Element -- frequency: 1
117. User Name In Mobile View -- frequency: 1
118. View All Button -- frequency: 1
119. View Selected -- frequency: 1
120. View Selected Icon -- frequency: 1
121. Web Prompt Summary -- frequency: 1

## Key Actions

- `doubleClickAttributeMetric()` -- used in 102 specs
- `sleep()` -- used in 83 specs
- `takeScreenshotByDocView()` -- used in 52 specs
- `openPageFromTocMenuWait()` -- used in 48 specs
- `changeVizType()` -- used in 42 specs
- `checkVizContainerByTitle()` -- used in 42 specs
- `clickOptionOnChapterMenu()` -- used in 42 specs
- `goToPage(chapterName, pageName)` -- used in 20 specs
- `takeScreenshotByVIBoxPanel()` -- used in 20 specs
- `doubleClickAttributeMetricByName()` -- used in 16 specs
- `waitForNlgReady()` -- used in 11 specs
- `clickOnInsertVI()` -- used in 10 specs
- `openUrl()` -- used in 8 specs
- `createBlankDashboard()` -- used in 6 specs
- `disableTutorial()` -- used in 6 specs
- `hoverOnDecreaseBar()` -- used in 6 specs
- `login()` -- used in 5 specs
- `disablePendoTutorial()` -- used in 4 specs
- `editDossierByUrl()` -- used in 4 specs
- `hoverOnBar()` -- used in 4 specs
- `addNewSampleData()` -- used in 3 specs
- `addNewSampleDataSaaS()` -- used in 3 specs
- `openDefaultApp()` -- used in 3 specs
- `checkVIDoclayout()` -- used in 2 specs
- `clickOnViz()` -- used in 2 specs
- `clickOnVizCategory()` -- used in 2 specs
- `collectLineCoverageInfo()` -- used in 2 specs
- `executeScript()` -- used in 2 specs
- `getSummaryTextByIndex()` -- used in 2 specs
- `openDebugMode()` -- used in 2 specs
- `setInstruction()` -- used in 2 specs
- `stopGuides()` -- used in 2 specs
- `switchViewMode()` -- used in 2 specs
- `saasLogin()` -- used in 1 specs
- `_selectDropDownItemOption({ dropDownOption, dropDownItems })` -- used in 0 specs
- `addElementToDataset({ title, elem })` -- used in 0 specs
- `addFilterToFilterPanel(attributesMetricsName)` -- used in 0 specs
- `addGridToViz()` -- used in 0 specs
- `addVisualizationFilterToFilterPanel(usedObjectName)` -- used in 0 specs
- `apply()` -- used in 0 specs
- `applyAndCloseUnitSelectionPopup()` -- used in 0 specs
- `applyAndReopenPanel(optionalFilter)` -- used in 0 specs
- `applyFilter()` -- used in 0 specs
- `applyWithoutWaiting(isWait = true)` -- used in 0 specs
- `assertDossierName()` -- used in 0 specs
- `backPrompt()` -- used in 0 specs
- `browseFolderInSaveAsDialog(folderName)` -- used in 0 specs
- `bulkSelection(option)` -- used in 0 specs
- `cancelAndCloseUnitSelectionPopup()` -- used in 0 specs
- `cancelChange()` -- used in 0 specs
- `cancelEditor()` -- used in 0 specs
- `cancelResolvePrompt()` -- used in 0 specs
- `canUserLogin()` -- used in 0 specs
- `canUserLogout()` -- used in 0 specs
- `capsuleCount(filterElementFinder)` -- used in 0 specs
- `capsuleName({ filterElementFinder, index })` -- used in 0 specs
- `changeCertifyCheckBoxInSaveAsDialog(certified)` -- used in 0 specs
- `changeColumnSetInAgGrid(columnSetName)` -- used in 0 specs
- `changeInputBotNameInSaveAsDialog(name)` -- used in 0 specs
- `changePersistentNotificationSetting(enable = true)` -- used in 0 specs
- `changePreference(section, preference)` -- used in 0 specs
- `changeSetAsTemplateCheckBoxInSaveAsDialog()` -- used in 0 specs
- `changeShowOptionForAll()` -- used in 0 specs
- `changeToDynamicSelection(filterName)` -- used in 0 specs
- `changeTypesTo(option)` -- used in 0 specs
- `changeUserTimezone(timezone)` -- used in 0 specs
- `checkDynamicSummary(promptName)` -- used in 0 specs
- `checkEmptySummary(promptName)` -- used in 0 specs
- `checkEmptySummaryByIndex(index)` -- used in 0 specs
- `checkFilterMenuItemSelectedByDisplayStyle(displayStyle, filterName, optionName)` -- used in 0 specs
- `checkFilterType(option)` -- used in 0 specs
- `checkListSummary(promptName)` -- used in 0 specs
- `checkListSummaryByIndex(index)` -- used in 0 specs
- `checkMultiQualSummary(promptName)` -- used in 0 specs
- `checkQualSummary(promptName)` -- used in 0 specs
- `checkQualSummaryOfDefault(promptName)` -- used in 0 specs
- `checkSearchBoxItemSelected(filterName, optionName)` -- used in 0 specs
- `checkTextSummary(promptName)` -- used in 0 specs
- `chooseFolderByName(name)` -- used in 0 specs
- `clearAll()` -- used in 0 specs
- `clearAllFilters()` -- used in 0 specs
- `clearAllRecentlySearchedItems()` -- used in 0 specs
- `clearFilter()` -- used in 0 specs
- `clearMsgBox()` -- used in 0 specs
- `clearRecentlySearchedItem(index)` -- used in 0 specs
- `clearSearch()` -- used in 0 specs
- `clearSearch(promptElement)` -- used in 0 specs
- `clearSearchBox()` -- used in 0 specs
- `clearSlider(filterElementFinder)` -- used in 0 specs
- `clearTypesSelection()` -- used in 0 specs
- `click()` -- used in 0 specs
- `clickAccountButton()` -- used in 0 specs
- `clickAccountMenuOption(text)` -- used in 0 specs
- `clickAccountOption(text, options = {})` -- used in 0 specs
- `clickAddDataButton()` -- used in 0 specs
- `clickAddDataOkButton()` -- used in 0 specs
- `clickAddFilterButton()` -- used in 0 specs
- `clickAddFilterButtonInMobileView()` -- used in 0 specs
- `clickAddFilterMenuButton(name)` -- used in 0 specs
- `clickAddOrCancelButtonInAddFilter(btnName)` -- used in 0 specs
- `clickApplication(appName)` -- used in 0 specs
- `clickApplyButton()` -- used in 0 specs
- `clickAttributeInAddFilter(attrName)` -- used in 0 specs
- `clickAutoAnswers()` -- used in 0 specs
- `clickBackButtonInMobileView()` -- used in 0 specs
- `clickButton(option)` -- used in 0 specs
- `clickButtonByName(name)` -- used in 0 specs
- `clickButtonByNameAndNoWait(name)` -- used in 0 specs
- `clickCancelButton()` -- used in 0 specs
- `clickCancelButtonInSaveAsDialog()` -- used in 0 specs
- `clickClearAllButton()` -- used in 0 specs
- `clickDisplayStyleOption(optionName)` -- used in 0 specs
- `clickDoneButton()` -- used in 0 specs
- `clickDynamicButton(filterName)` -- used in 0 specs
- `clickDynamicButtons(nameList)` -- used in 0 specs
- `clickEditBtnInMobileView()` -- used in 0 specs
- `clickExportToCSV()` -- used in 0 specs
- `clickExportToExcel()` -- used in 0 specs
- `clickExportToPDF()` -- used in 0 specs
- `clickFilterByName(name)` -- used in 0 specs
- `clickFilterContextMenuOption(filterName, contextMenuOptions)` -- used in 0 specs
- `clickFilterDetailsPanelButton(button)` -- used in 0 specs
- `clickFilterIcon()` -- used in 0 specs
- `clickFilterOptionInMobileView(option)` -- used in 0 specs
- `clickFolderUpButton()` -- used in 0 specs
- `clickFooterButton(option)` -- used in 0 specs
- `clickHandle(filterElementFinder)` -- used in 0 specs
- `clickLowerHandle(filterElementFinder)` -- used in 0 specs
- `clickMatchCase(promptElement)` -- used in 0 specs
- `clickNotificationCloseButton()` -- used in 0 specs
- `clickOnButtonByName(name, time = 0)` -- used in 0 specs
- `clickOnButtonByNameNoWait(name)` -- used in 0 specs
- `clickOptionInMobileView(option)` -- used in 0 specs
- `clickPromptIndexByTitle(title)` -- used in 0 specs
- `clickPromptIndexByTitleWithNoWait(title)` -- used in 0 specs
- `clickRepublishButton()` -- used in 0 specs
- `clickSaveButtonInSaveAsDialog()` -- used in 0 specs
- `clickSelectButton()` -- used in 0 specs
- `clickShare()` -- used in 0 specs
- `clickShowDataCloseButton()` -- used in 0 specs
- `clickShowDataExportButton()` -- used in 0 specs
- `clickShowDataExportButtonNoPrivilege()` -- used in 0 specs
- `clickSubscribeToDashboard()` -- used in 0 specs
- `clickUpperHandle(filterElementFinder)` -- used in 0 specs
- `clickViewSelected()` -- used in 0 specs
- `clickWarningIcon()` -- used in 0 specs
- `clickWebPromptSummary()` -- used in 0 specs
- `close()` -- used in 0 specs
- `closeEditor()` -- used in 0 specs
- `closeFilterPanel()` -- used in 0 specs
- `closeFilterPanelByCloseIcon()` -- used in 0 specs
- `closeFilterPanelInMobileView()` -- used in 0 specs
- `closeHamburgerMenu()` -- used in 0 specs
- `closeIndex()` -- used in 0 specs
- `closeManageLibrary()` -- used in 0 specs
- `closeMenu()` -- used in 0 specs
- `closePanel(panelFinder)` -- used in 0 specs
- `closeShowDataDialog(authoring = false)` -- used in 0 specs
- `closeSnapshotNotificationByName(notificationName)` -- used in 0 specs
- `closeSortByDropdownInMobileView()` -- used in 0 specs
- `closeSortMenu()` -- used in 0 specs
- `closeTypesDropdownInMobileView()` -- used in 0 specs
- `closeUserAccountMenu()` -- used in 0 specs
- `collapseFilter(filterName, index = 0)` -- used in 0 specs
- `collapseLegendBox(elementFinder)` -- used in 0 specs
- `createBasicCustomGroup(attributeName, groupElement)` -- used in 0 specs
- `createDossierAndImportSampleFiles(sampleFileIdx = 0)` -- used in 0 specs
- `createInCanvasFilter(objectName)` -- used in 0 specs
- `createNewChapter()` -- used in 0 specs
- `createNewPage()` -- used in 0 specs
- `createPanelStack()` -- used in 0 specs
- `createSimpleObjectSelector(attrName)` -- used in 0 specs
- `createSimpleObjectSelectorWithReplacement({ objectName, replacementName })` -- used in 0 specs
- `currentSortOption()` -- used in 0 specs
- `currentSortOrder()` -- used in 0 specs
- `currentSortStatus()` -- used in 0 specs
- `deleteAllComments(dburl, dossierID)` -- used in 0 specs
- `deleteAllNotifications(dburl, userID)` -- used in 0 specs
- `deleteAllTopics(dburl, dossierID)` -- used in 0 specs
- `disconnect()` -- used in 0 specs
- `dockFilterPanel()` -- used in 0 specs
- `dockPanel(panelFinder)` -- used in 0 specs
- `dockTOCMenu()` -- used in 0 specs
- `doubleClickObject(objectName)` -- used in 0 specs
- `dragAndDropHandle(filterElementFinder, pos)` -- used in 0 specs
- `dragAndDropLowerHandle(filterElementFinder, pos)` -- used in 0 specs
- `dragAndDropUpperHandle(filterElementFinder, pos)` -- used in 0 specs
- `dragCellToColHeader(objectToDrag, position, targetHeader)` -- used in 0 specs
- `dragCellToRowHeader(objectToDrag, position, targetHeader)` -- used in 0 specs
- `dragToSamePosition(filterElementFinder)` -- used in 0 specs
- `duplicateChapter(chapterName)` -- used in 0 specs
- `duplicatePage(pageName)` -- used in 0 specs
- `elementByOrder(index)` -- used in 0 specs
- `expandedFilterItems(name)` -- used in 0 specs
- `expandFilter(filterName, index = 0)` -- used in 0 specs
- `expandLegendBox(elementFinder)` -- used in 0 specs
- `exportShowData(fileType)` -- used in 0 specs
- `filterApplyCount()` -- used in 0 specs
- `filterCount()` -- used in 0 specs
- `filterItems(name)` -- used in 0 specs
- `filterItemText()` -- used in 0 specs
- `filterName({ index })` -- used in 0 specs
- `filterTypes()` -- used in 0 specs
- `findAll(container)` -- used in 0 specs
- `findPrompt(title)` -- used in 0 specs
- `getAccountMenuOptionsNames()` -- used in 0 specs
- `getAddDataElementCheckbox({ title, elem })` -- used in 0 specs
- `getAddDataList(title)` -- used in 0 specs
- `getAddedContent(userName)` -- used in 0 specs
- `getAlertMessage()` -- used in 0 specs
- `getAllItemsCount()` -- used in 0 specs
- `getAllNotificationMessages()` -- used in 0 specs
- `getAllSortOptionsText()` -- used in 0 specs
- `getBotNameInSaveDialog()` -- used in 0 specs
- `getBrowserLink(userName)` -- used in 0 specs
- `getCheckBoxElementsCount()` -- used in 0 specs
- `getColumnSetOptionText()` -- used in 0 specs
- `getCurrentInnerSelectorMode()` -- used in 0 specs
- `getCurrentSelectedFolder()` -- used in 0 specs
- `getCurrentSelectedFont()` -- used in 0 specs
- `getDatasetRowCount()` -- used in 0 specs
- `getDescriptionTooltipText(filterName)` -- used in 0 specs
- `getDescriptionTooltipText(name)` -- used in 0 specs
- `getDetailsPanelItemsCount()` -- used in 0 specs
- `getDossierNameFont()` -- used in 0 specs
- `getElementIndex(name)` -- used in 0 specs
- `getFilterDisabledMessageText()` -- used in 0 specs
- `getFilterDropdownOptionsNames()` -- used in 0 specs
- `getFilterOptions()` -- used in 0 specs
- `getFilterPanelContentHeight()` -- used in 0 specs
- `getFilterPanelFooterHeight()` -- used in 0 specs
- `getFilterPanelHeaderHeight()` -- used in 0 specs
- `getFilterPanelWrapperHeight()` -- used in 0 specs
- `getFilterSummary(filterName, index = 0)` -- used in 0 specs
- `getFilterTypeItemsNames()` -- used in 0 specs
- `getFilterWarningMessage(filterName, index = 0)` -- used in 0 specs
- `getHeadersInshowDataGrid()` -- used in 0 specs
- `getInCanvasElementSelectedByDisplayStyle(displayStyle, filterName, filterElementName)` -- used in 0 specs
- `getInCanvasEmptyWarningByDisplayStyle(displayStyle, filterName, expectedEmptyText = 'Make at least one selection.')` -- used in 0 specs
- `getInviteContent(userName, trim = true)` -- used in 0 specs
- `getInviteMessage(userName, trim = true)` -- used in 0 specs
- `getLabelText()` -- used in 0 specs
- `getlegendColor({ elementFinder, element })` -- used in 0 specs
- `getMentionMessage(userName)` -- used in 0 specs
- `getMentionTitle(userName)` -- used in 0 specs
- `getMenuContainerWidth()` -- used in 0 specs
- `getMenuContentHeight()` -- used in 0 specs
- `getMenuContentScrollHeight()` -- used in 0 specs
- `getMenuListHeight()` -- used in 0 specs
- `getMenuListScrollHeight()` -- used in 0 specs
- `getMenuOptionsCount()` -- used in 0 specs
- `getNotificationCount()` -- used in 0 specs
- `getNotificationDescriptionTextByIndex(index = 0)` -- used in 0 specs
- `getNotificationMessage(notificationName)` -- used in 0 specs
- `getNotificationMessageTextByIndex(index = 0)` -- used in 0 specs
- `getPreferenceSectionsNames()` -- used in 0 specs
- `getPreferenceText()` -- used in 0 specs
- `getPromptCountInViewSummary()` -- used in 0 specs
- `getScopeFilterInfoMessage()` -- used in 0 specs
- `getSearchResultsText()` -- used in 0 specs
- `getSelectedPageName()` -- used in 0 specs
- `getSharedMsg(userName)` -- used in 0 specs
- `getSnapshotNotificationDescriptionText(notificationName)` -- used in 0 specs
- `getSnapshotNotificationMessageText(notificationName)` -- used in 0 specs
- `getSortOptionFont()` -- used in 0 specs
- `getSummaryText(promptName)` -- used in 0 specs
- `getTooltipText()` -- used in 0 specs
- `getTotalObjectCount(isByLabel = true)` -- used in 0 specs
- `getUserName()` -- used in 0 specs
- `goToChapter(chapterName, specType)` -- used in 0 specs
- `hideLegendBox(elementFinder)` -- used in 0 specs
- `highlightCapsuleByName({ filterElementFinder, name })` -- used in 0 specs
- `hoverFilter()` -- used in 0 specs
- `hoverFilterByName(name)` -- used in 0 specs
- `hoverFilterPanelIcon()` -- used in 0 specs
- `hoverFilterPanelWarning()` -- used in 0 specs
- `hoverOnCertifiedIcon(name)` -- used in 0 specs
- `hoverOnCurrentFolderSelector()` -- used in 0 specs
- `hoverOnElement(name)` -- used in 0 specs
- `hoverOnFilterSummary(filterName)` -- used in 0 specs
- `hoverOnHandle(filterElementFinder)` -- used in 0 specs
- `hoverOnLowerHandle(filterElementFinder)` -- used in 0 specs
- `hoverOnMaxValue(filterElementFinder)` -- used in 0 specs
- `hoverOnMinValue(filterElementFinder)` -- used in 0 specs
- `hoverOnObjectTypeIcon(name)` -- used in 0 specs
- `hoverOnRadioButton(name)` -- used in 0 specs
- `hoverOnSearchElement(name)` -- used in 0 specs
- `hoverOnSummaryLabel(filterElementFinder)` -- used in 0 specs
- `hoverOnTemplateIcon(name)` -- used in 0 specs
- `hoverOnUpperHandle(filterElementFinder)` -- used in 0 specs
- `hoverOnUserName(name)` -- used in 0 specs
- `hoverOverChapter(chapterName)` -- used in 0 specs
- `hoverOverPage(chapterName, pageName)` -- used in 0 specs
- `hoverQuickSort()` -- used in 0 specs
- `inputBoxValue(filterElementFinder)` -- used in 0 specs
- `isAccountDropdownMenuPresent()` -- used in 0 specs
- `isAccountIconFocused()` -- used in 0 specs
- `isAccountOptionPresent(option)` -- used in 0 specs
- `isAddToLibraryIconDisplayed(name)` -- used in 0 specs
- `isAlertDisplay()` -- used in 0 specs
- `isAntdMessageCloseButtonVisible()` -- used in 0 specs
- `isAntdMessageVisible()` -- used in 0 specs
- `isApplicationSelected(name)` -- used in 0 specs
- `isApplyButtonEnable()` -- used in 0 specs
- `isApplyEnabled()` -- used in 0 specs
- `isAttrFilterDetailsPanelLocked(name)` -- used in 0 specs
- `isAttributeDisplayedInAddFilter(attrName)` -- used in 0 specs
- `isBotCoverGreyed(name)` -- used in 0 specs
- `isBotHasInactiveInName(name, i18nText = ' (Inactive)` -- used in 0 specs
- `isCalFilterDetailsPanelLocked(name)` -- used in 0 specs
- `isCapsuleDynamicByOrder({ filterElementFinder, index })` -- used in 0 specs
- `isCapsuleExcluded({ filterElementFinder, name })` -- used in 0 specs
- `isCapsuleExcludedByOrder({ filterElementFinder, index })` -- used in 0 specs
- `isCapsuleHighlighted({ filterElementFinder, name })` -- used in 0 specs
- `isCapsulePresent({ filterElementFinder, name })` -- used in 0 specs
- `isCertifiedSelected()` -- used in 0 specs
- `isCertifiedSwitchFocused()` -- used in 0 specs
- `isCertifyCheckBoxCheckedInSaveAsDialog()` -- used in 0 specs
- `isCertifyCheckBoxPresentInSaveAsDialog()` -- used in 0 specs
- `isChangeDescPresent()` -- used in 0 specs
- `isChecked()` -- used in 0 specs
- `isClearAllEnabled()` -- used in 0 specs
- `isClearFilterDisabled()` -- used in 0 specs
- `isClearSearchIconDisplayed()` -- used in 0 specs
- `isClearSearchIconPresent()` -- used in 0 specs
- `isCloseButtonFocused()` -- used in 0 specs
- `isCommentCountDisplayed(name)` -- used in 0 specs
- `isDashboardFilterDisplayed()` -- used in 0 specs
- `isDockIconDisplayed()` -- used in 0 specs
- `isDockIconDisplayed(panelFinder)` -- used in 0 specs
- `isDocumentSelected()` -- used in 0 specs
- `isDossierSelected()` -- used in 0 specs
- `isDynamicButtonEnabled(filterName)` -- used in 0 specs
- `isDynamicButtonPresent(filterName)` -- used in 0 specs
- `isEditorOpen()` -- used in 0 specs
- `isEditorSelectableModeOpen()` -- used in 0 specs
- `isElementPresent(name)` -- used in 0 specs
- `isElementSelected(name)` -- used in 0 specs
- `isEmptySearchDisplayed()` -- used in 0 specs
- `isFilterContentOverlapsWithFooter()` -- used in 0 specs
- `isFilterCountDisplayed()` -- used in 0 specs
- `isFilterDisplayedInFilterPanel(name)` -- used in 0 specs
- `isFilterExcluded(name)` -- used in 0 specs
- `isFilterIconDisabled()` -- used in 0 specs
- `isFilterIconPresent()` -- used in 0 specs
- `isFilterInfoIconDisplayed(filterName)` -- used in 0 specs
- `isFilterInfoIconDisplayed(name)` -- used in 0 specs
- `isFilterItemGlobalIconDisplayed(filterName, index = 0)` -- used in 0 specs
- `isFilterItemLocked(name)` -- used in 0 specs
- `isFilterItemMandatoryIconDisplayed(filterName)` -- used in 0 specs
- `isFilterItemMenuDisplayed(filterName, index = 0)` -- used in 0 specs
- `isFilterOpen()` -- used in 0 specs
- `isFilterOptionDisplayed(optionName)` -- used in 0 specs
- `isFilterPanelEmpty()` -- used in 0 specs
- `isFilterTypeChecked(option)` -- used in 0 specs
- `isFilterTypeItemPresent(option)` -- used in 0 specs
- `isFolderUpButtonDisabled()` -- used in 0 specs
- `isFooterButtonDisabled(option)` -- used in 0 specs
- `isFooterButtonPresent(option)` -- used in 0 specs
- `isGlobalFilterIconExist(name, index = 0)` -- used in 0 specs
- `isInputBoxEmpty()` -- used in 0 specs
- `isItemCertified(name)` -- used in 0 specs
- `isItemDocument(name)` -- used in 0 specs
- `isItemViewable(name, owner = null)` -- used in 0 specs
- `isKeepOnlyLinkDisplayed(name)` -- used in 0 specs
- `isKeepOnlyLinkDisplayedForSearchElement(name)` -- used in 0 specs
- `isLeftDocked()` -- used in 0 specs
- `isLeftDocked(panelFinder)` -- used in 0 specs
- `isLegendMinimized(elementFinder)` -- used in 0 specs
- `isLegendPresent(elementFinder)` -- used in 0 specs
- `isLibraryFilterDisplay()` -- used in 0 specs
- `isLogoutFocused()` -- used in 0 specs
- `isMainPanelOpen()` -- used in 0 specs
- `isMobileSliderMenuOpened()` -- used in 0 specs
- `isMoreSettingPresent()` -- used in 0 specs
- `isNewtSelected()` -- used in 0 specs
- `isNotificationCloseButtonVisible()` -- used in 0 specs
- `isNotificationVisible()` -- used in 0 specs
- `isObjectPresentInFlatView(name)` -- used in 0 specs
- `isObjectTypeIconDisplayed(name)` -- used in 0 specs
- `isPanelCloseIconDisplayed()` -- used in 0 specs
- `isPanelCloseIconDisplayed(panelFinder)` -- used in 0 specs
- `isPanelDocked()` -- used in 0 specs
- `isPanelDocked(panelFinder)` -- used in 0 specs
- `isPersistentNotificationEnabled()` -- used in 0 specs
- `isPreferencePresent()` -- used in 0 specs
- `isPreferenceSecondaryPanelPresent()` -- used in 0 specs
- `isRadioButtonPresent(name)` -- used in 0 specs
- `isRadioButtonSelected(name)` -- used in 0 specs
- `isRecentlySearchedPresent()` -- used in 0 specs
- `isRecentlySearchedResultEmpty()` -- used in 0 specs
- `isRenameBoxPresent()` -- used in 0 specs
- `isRepromptIconPresent()` -- used in 0 specs
- `isResetAllFiltersButtonDisabled()` -- used in 0 specs
- `isResetAllFiltersButtonPresent()` -- used in 0 specs
- `isRightDocked()` -- used in 0 specs
- `isRightDocked(panelFinder)` -- used in 0 specs
- `isRowCountEqual(num)` -- used in 0 specs
- `isRunAsExcelIconPresent(name)` -- used in 0 specs
- `isRunAsPDFIconPresent(name)` -- used in 0 specs
- `isScopeFilterDisplayed()` -- used in 0 specs
- `isSearchBoxOpened()` -- used in 0 specs
- `isSearchElementSelected(name)` -- used in 0 specs
- `isSearchWarningMsgPresent()` -- used in 0 specs
- `isSelectAllEnabled()` -- used in 0 specs
- `isShowDataDialogDisplayed()` -- used in 0 specs
- `isShowDataExportButtonAvailable()` -- used in 0 specs
- `isShowDataExportTypePresent(type)` -- used in 0 specs
- `isSmartBannerVisible()` -- used in 0 specs
- `isSnapshotInProgressNotificationVisible(notificationName)` -- used in 0 specs
- `isSnapshotReadyNotificationVisible(notificationName)` -- used in 0 specs
- `isSortDisplay()` -- used in 0 specs
- `isSortMenuOpen()` -- used in 0 specs
- `isSortOptionExist(option)` -- used in 0 specs
- `isSortOptionTabFocused(option)` -- used in 0 specs
- `isSummaryInExcludeMode(name)` -- used in 0 specs
- `isSummaryInputInExcludeMode(name)` -- used in 0 specs
- `isSummaryPresent(filterElementFinder)` -- used in 0 specs
- `isTOCIconPresent()` -- used in 0 specs
- `isTOCLightTheme()` -- used in 0 specs
- `isUndockIconDisplayed()` -- used in 0 specs
- `isUndockIconDisplayed(panelFinder)` -- used in 0 specs
- `isUpdatedSelected()` -- used in 0 specs
- `isViewSelectedEnabled()` -- used in 0 specs
- `isViewSelectedPresent()` -- used in 0 specs
- `isViewSummaryEnabled()` -- used in 0 specs
- `isVizFilterDetailsPanelLocked(name)` -- used in 0 specs
- `isWarningMessagePresent(name)` -- used in 0 specs
- `itemInfo(name)` -- used in 0 specs
- `itemSharedByTimeInfo(name)` -- used in 0 specs
- `keepOnly(name)` -- used in 0 specs
- `keepOnlyForSearchElement(name)` -- used in 0 specs
- `keepOnlyOption(name)` -- used in 0 specs
- `keyword()` -- used in 0 specs
- `logout(options = {})` -- used in 0 specs
- `lowerInput(filterElementFinder)` -- used in 0 specs
- `maxValue(filterElementFinder)` -- used in 0 specs
- `message()` -- used in 0 specs
- `minValue(filterElementFinder)` -- used in 0 specs
- `moveFilterToCanvas(elementName, visualizationTitle)` -- used in 0 specs
- `moveObjectByColumnBorder(objectName, colNum)` -- used in 0 specs
- `moveShowDataVerticalScrollBarToBottom(pos)` -- used in 0 specs
- `navigateInObjectBrowserFlatView(paths)` -- used in 0 specs
- `navigateInObjectBrowserPopover(paths)` -- used in 0 specs
- `noElementText()` -- used in 0 specs
- `open()` -- used in 0 specs
- `openAutoAnswersInMobileView()` -- used in 0 specs
- `openCombinedModeSortMenu()` -- used in 0 specs
- `openContextMenuOnObject({ name, isWait = true })` -- used in 0 specs
- `openDropdownMenu(filterElementFinder)` -- used in 0 specs
- `openFilterContextMenu(filterName)` -- used in 0 specs
- `openFilterDetailPanel(type, index = 0)` -- used in 0 specs
- `openFilterDetailPanelInMobileView(item)` -- used in 0 specs
- `openFilterPanel()` -- used in 0 specs
- `openFilterPanelInMobileView()` -- used in 0 specs
- `openFilterTypeDropdown()` -- used in 0 specs
- `openFolderBrowserPopover()` -- used in 0 specs
- `openFolderByPath(path)` -- used in 0 specs
- `openFontPicker()` -- used in 0 specs
- `openHamburgerMenu()` -- used in 0 specs
- `openIndex()` -- used in 0 specs
- `openItemByIndex(index)` -- used in 0 specs
- `openLibraryFilterInMobileView()` -- used in 0 specs
- `openMenu()` -- used in 0 specs
- `openMyApplicationPanel()` -- used in 0 specs
- `openObjectBrowser()` -- used in 0 specs
- `openObjectSelector()` -- used in 0 specs
- `openPreferenceList(section)` -- used in 0 specs
- `openPreferencePanel()` -- used in 0 specs
- `openReadyNotificationByName(notificationName)` -- used in 0 specs
- `openSortByDropdownInMobileView()` -- used in 0 specs
- `openSortMenu()` -- used in 0 specs
- `openSwitchApplicationSubPanel()` -- used in 0 specs
- `openSwitchWorkspaceSubPanel()` -- used in 0 specs
- `openTimezoneList()` -- used in 0 specs
- `openTypesDropdownInMobileView()` -- used in 0 specs
- `openUserAccountMenu(options = {})` -- used in 0 specs
- `openUserAccountMenuWithKeyboard()` -- used in 0 specs
- `openViewInBrowserLink(userName)` -- used in 0 specs
- `pressEnter()` -- used in 0 specs
- `queryTelemetry(dburl, { jobId, userName = 'telemetry_user', objectId = null })` -- used in 0 specs
- `quickSort()` -- used in 0 specs
- `radioButtonByOrder(index)` -- used in 0 specs
- `recentlySearchedItemCount()` -- used in 0 specs
- `recieveEmail(userName)` -- used in 0 specs
- `removeCapsuleByName({ filterElementFinder, name })` -- used in 0 specs
- `removeCapsuleByOrder({ filterElementFinder, index })` -- used in 0 specs
- `removeInCanvasElementByDisplayStyle(displayStyle, filterObject, elementName, idx = 2)` -- used in 0 specs
- `renameReportMsgOnWeb(newName)` -- used in 0 specs
- `reprompt()` -- used in 0 specs
- `resetAllFilters()` -- used in 0 specs
- `resizeColumnByMovingBorder(colNum, pixels, direction)` -- used in 0 specs
- `run()` -- used in 0 specs
- `runNoWait()` -- used in 0 specs
- `runPromptInPrompt()` -- used in 0 specs
- `runWithERR()` -- used in 0 specs
- `runWithPIP()` -- used in 0 specs
- `runWithWaitForCancel()` -- used in 0 specs
- `savePreference()` -- used in 0 specs
- `scrollDatasetToBottom()` -- used in 0 specs
- `scrollEditorToBottom()` -- used in 0 specs
- `scrollEditorToTop()` -- used in 0 specs
- `scrollFilterPanelContentToBottom()` -- used in 0 specs
- `scrollObjectBrowserPopoverToTop()` -- used in 0 specs
- `scrollToBottom()` -- used in 0 specs
- `scrollToBottomInTreePopover()` -- used in 0 specs
- `scrollToTopInTreePopover()` -- used in 0 specs
- `scrollWindowToRightmost()` -- used in 0 specs
- `search(keyword)` -- used in 0 specs
- `search(text)` -- used in 0 specs
- `searchboxPlaceholder()` -- used in 0 specs
- `searchByName(text)` -- used in 0 specs
- `searchFilterItem(name)` -- used in 0 specs
- `searchFor(promptElement, text)` -- used in 0 specs
- `searchObject(name, option = {})` -- used in 0 specs
- `searchResults()` -- used in 0 specs
- `selectAll()` -- used in 0 specs
- `selectCertifiedOnly()` -- used in 0 specs
- `selectColumnSetOption(option)` -- used in 0 specs
- `selectDisplayStyleForFilterItem(filterName, displayStyle)` -- used in 0 specs
- `selectDisplayStyleForInCanvasItem(filterName, dragButtonIdx, inCanvasContainerIdx, displayStyle)` -- used in 0 specs
- `selectDynamicSelectionMode(filterName, mode, quantity, index=0)` -- used in 0 specs
- `selectedOption(filterElementFinder)` -- used in 0 specs
- `selectedPreference(section)` -- used in 0 specs
- `selectedTimezone()` -- used in 0 specs
- `selectElementByName(name)` -- used in 0 specs
- `selectExcelRange(dropDownOption)` -- used in 0 specs
- `selectFilter(path, index = 0)` -- used in 0 specs
- `selectFilterDetailsPanelItem(option)` -- used in 0 specs
- `selectFilterItem(filterName)` -- used in 0 specs
- `selectFilterItem(name)` -- used in 0 specs
- `selectFilterItems(nameList)` -- used in 0 specs
- `selectFilterOptionButton(option)` -- used in 0 specs
- `selectFilterPanelFilterCheckboxOption(filterName, optionName)` -- used in 0 specs
- `selectFilterPanelOptionByDisplayStyle(displayStyle, filterName, optionName, idx = 1)` -- used in 0 specs
- `selectFiltersOption(optionName)` -- used in 0 specs
- `selectFontByName(fontName)` -- used in 0 specs
- `selectInCanvasContextOption(objectName, optionName, waitForLoadingAfter = true)` -- used in 0 specs
- `selectInCanvasDynamicSelectionMode(objectName, mode, quantity, idx)` -- used in 0 specs
- `selectInCanvasFilterCheckboxOption(filterName, optionName)` -- used in 0 specs
- `selectInCanvasPanelFilterCheckboxOptionByDisplayStyle(displayStyle, filterName, optionName, extra)` -- used in 0 specs
- `selectItemOptionByDisplayStyle(displayStyle, name, extra = {})` -- used in 0 specs
- `selectObjectInFlatView(name)` -- used in 0 specs
- `selectOption(filterElementFinder, option)` -- used in 0 specs
- `selectOptionInCheckbox(name)` -- used in 0 specs
- `selectPromptByName(promptName)` -- used in 0 specs
- `selectPromptItems(promptList)` -- used in 0 specs
- `selectRadioButtonByName(name)` -- used in 0 specs
- `selectSearchElementByName(name)` -- used in 0 specs
- `selectSortOption(option)` -- used in 0 specs
- `selectSortOrder(order)` -- used in 0 specs
- `selectUnitsInUnitSelectionPopup(objectNames)` -- used in 0 specs
- `setFilterToSelectorContainer(filterName, index)` -- used in 0 specs
- `setPageStartIndex(index)` -- used in 0 specs
- `sliderTooltip()` -- used in 0 specs
- `sortByColumnHeader(headerName)` -- used in 0 specs
- `sortShowDataGridbyClickingHeader(objectName)` -- used in 0 specs
- `summary(filterElementFinder)` -- used in 0 specs
- `switchCustomApp(name)` -- used in 0 specs
- `switchCustomAppByIndex(index)` -- used in 0 specs
- `switchDynamicByName(promptName)` -- used in 0 specs
- `switchDynamicItems(promptList)` -- used in 0 specs
- `switchMode(optionName)` -- used in 0 specs
- `switchPageTo(pageName, delay)` -- used in 0 specs
- `switchToFilterPanel()` -- used in 0 specs
- `switchWorkspace(name)` -- used in 0 specs
- `toggleFilterSummary()` -- used in 0 specs
- `toggleViewSelected()` -- used in 0 specs
- `toggleViewSelectedOption()` -- used in 0 specs
- `toggleViewSelectedOptionOn()` -- used in 0 specs
- `toggleViewSummary()` -- used in 0 specs
- `uncheckFilterType(option)` -- used in 0 specs
- `undockFilterPanel()` -- used in 0 specs
- `undockPanel(panelFinder)` -- used in 0 specs
- `undockTOCMenu()` -- used in 0 specs
- `unselectFilterItem(name)` -- used in 0 specs
- `updateLowerInput(filterElementFinder, value)` -- used in 0 specs
- `updateUpperInput(filterElementFinder, value)` -- used in 0 specs
- `updateValue({ elem, valueLower, valueUpper })` -- used in 0 specs
- `updateValueWithEnter({ elem, valueLower, valueUpper })` -- used in 0 specs
- `upperInput(filterElementFinder)` -- used in 0 specs
- `viewAllFilterItems()` -- used in 0 specs
- `visibleElementCount()` -- used in 0 specs
- `visibleRadioButtonCount()` -- used in 0 specs
- `visibleSearchElementCount()` -- used in 0 specs
- `visibleSelectedElementCount()` -- used in 0 specs
- `visibleSelectedRadioButtonCount()` -- used in 0 specs
- `waitForAllNotificationShown(cnt = 2)` -- used in 0 specs
- `waitForEditor()` -- used in 0 specs
- `waitForEditorClose()` -- used in 0 specs
- `waitForEditorSelectableMode()` -- used in 0 specs
- `waitForError()` -- used in 0 specs
- `waitForGDDE()` -- used in 0 specs
- `waitForGDDEUpdate()` -- used in 0 specs
- `waitForLoading()` -- used in 0 specs
- `waitForMessageBox()` -- used in 0 specs
- `waitForPreferencePanelPresent()` -- used in 0 specs
- `waitForPromptLoading()` -- used in 0 specs
- `waitForRepromptLoading()` -- used in 0 specs
- `waitForSaving()` -- used in 0 specs
- `waitForSummaryItem(promptName)` -- used in 0 specs
- `waitForTooltipVisible()` -- used in 0 specs
- `waitLoadingDataPopUpIsNotDisplayed()` -- used in 0 specs
- `warningMessageText(name)` -- used in 0 specs

## Source Coverage

- `pageObjects/common/**/*.js`
- `specs/regression/libraryVisualizations/vizCommon/**/*.{ts,js}`
