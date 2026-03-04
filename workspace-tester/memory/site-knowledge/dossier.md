# Site Knowledge: Dossier Domain

## Overview

- **Domain key:** `dossier`
- **Components covered:** AdvancedSort, Bookmark, DashboardMenuBar, DossierAuthoringPage, DossierPage, DossierTextField, HtmlContainer, HTMLPage, LimitElementSource, LinkAttributes, ManageAccessDialog, ManageAccessEditor, Reset, Share, ShareDossierDialog, TOC
- **Spec files scanned:** 69
- **POM files scanned:** 16

## Components

### AdvancedSort
- **CSS root:** `.mstr-advanced-sort-sortSelect-dropdown__dropdown-list`
- **User-visible elements:**
  - Order Dropdown List (`.mstr-advanced-sort-sortSelect-dropdown__dropdown-list`)
  - Sort By Dropdown List (`.mstr-advanced-sort-orderSelect-dropdown__dropdown-list`)
  - Sort Editor (`.mstrmojo-AdvancedSortEditorReact`)
- **Component actions:**
  - `cancel()`
  - `delete(rowNum)`
  - `getEditorBtn(text)`
  - `getOrderListItemsCount()`
  - `getOrderSelectedText(rowNum)`
  - `getSortByListItemsCount()`
  - `getSortBySelectedText(rowNum)`
  - `getSortRowsCount()`
  - `hoverOnAdvanceEditor()`
  - `isAdvancedSortEditorPresent()`
  - `isColumnsSelected()`
  - `isRowsSelected()`
  - `isSortByDisabled()`
  - `openAndSelectOrder(rowNum, item)`
  - `openAndselectSortBy(rowNum, item)`
  - `openAndselectSortByAndOrder(rowNum, sortby, order)`
  - `openDropdown(el)`
  - `openOrderDropdown(rowNum)`
  - `openSortByDropdown(rowNum)`
  - `save()`
  - `scrollListToBottom()`
  - `selectOrderDropdownItem(item)`
  - `selectSortByDropdownItem(item)`
  - `switchToColumns()`
  - `switchToRows()`
- **Related components:** dossierPage, getSortRulesContainer, getSortRulesPanel

### Bookmark
- **CSS root:** `.mstrd-BookmarkDropdownMenuContainer-bMsHeaderIcon.icon-pnl_add-new[disabled]`
- **User-visible elements:**
  - Add New Button Disabled (`.mstrd-BookmarkDropdownMenuContainer-bMsHeaderIcon.icon-pnl_add-new[disabled]`)
  - Bookmark Icon (`.mstr-nav-icon.icon-tb_bookmarks_n:not([disabled])`)
  - Bookmark Icon Disabled (`.mstrd-NavItemWrapper.mstrd-BookmarkNavItem.mstr-navbar-item[disabled]`)
  - Bookmark Spinner (`.mstrd-BookmarkDropdownMenuContainer-addNewSection .mstrd-Spinner`)
  - Label In Title (`.mstrd-NavBarTitle-item-active`)
  - New Bookmark Reminder (`.mstrd-Badge--show`)
  - No Bookmarks (`.mstrd-DropdownMenu-content`)
  - No Privillege Tooltip (`.ant-tooltip.mstrd-Tooltip .ant-tooltip-inner`)
  - Notification (`.ant-popover-inner-content `)
  - Panel (`.mstrd-DropdownMenu-main`)
  - Save Changes Dialog (`.mstrd-SaveChangesDialog-inner`)
- **Component actions:**
  - `addNewBookmark(name)`
  - `applyBookmark(name, sectionName = 'MY BOOKMARKS', option = { isWait: true })`
  - `bookmarkCount(sectionName = 'MY BOOKMARKS')`
  - `bookmarkTotalCount()`
  - `bulkDeleteBookmarks()`
  - `cancelDelete()`
  - `cancelInputName()`
  - `clickAddBtn()`
  - `closePanel()`
  - `confirmDelete()`
  - `confirmNotification()`
  - `createBookmarksByDefault(number)`
  - `createSnapshot(name, sectionName = 'MY BOOKMARKS')`
  - `deleteBookmark(name, sectionName = 'MY BOOKMARKS')`
  - `deleteBookmarksByDefault(number)`
  - `deleteBookmarkWithoutConfirm(name, sectionName = 'MY BOOKMARKS')`
  - `dismissNotification()`
  - `dismissTooltip()`
  - `editBulkDeleteBookmarks()`
  - `getAddBookmarkErrorMsg()`
  - `getBookmarkContainerHeight()`
  - `getBookmarkListHeight()`
  - `getBookmarkTooltipText()`
  - `getCapsureText(name)`
  - `getLabelInTitle()`
  - `getNewBookmarkNumber()`
  - `getNoPrivillegeTooltip()`
  - `getNotificationErrorMessage()`
  - `getNotificationMsg()`
  - `hideBookmarkTimeStamp()`
  - `hoverOnBookmark(name, sectionName = 'MY BOOKMARKS')`
  - `ignoreNotification()`
  - `ignoreSaveReminder()`
  - `isBookmarkAddtoLibraryMsgPresent()`
  - `isBookmarkEnabled()`
  - `isBookmarkLabelPresent()`
  - `isBookmarkPresent(name, sectionName = 'MY BOOKMARKS')`
  - `isCreateSnapshotIconPresent(name, sectionName)`
  - `isDeleteBMPresent(name, sectionName)`
  - `isErrorInputDialogPresent()`
  - `isNewBookmarkIconPresent()`
  - `isNoBookmarksPanelPresent()`
  - `isNoPrivillegeTooltipDisplayed()`
  - `isNotificationErrorPresent()`
  - `isNotificationPresent()`
  - `isPanelOpen()`
  - `isSaveChangesDialogPresent()`
  - `isSendIconPresent(name)`
  - `isSharedBMPresent(name, sectionName)`
  - `isSharedIconPresent(name)`
  - `isSharedStatusIconPresent(name)`
  - `isUpdateBMPresent(name, sectionName = 'MY BOOKMARKS')`
  - `keepSaveReminder()`
  - `labelInTitle()`
  - `openPanel()`
  - `renameBookmark(name, newName)`
  - `saveBookmark()`
  - `selectAllToDelete()`
  - `selectBookmarkToDeleteByName(name)`
  - `shareBookmark(name, sectionName)`
  - `showBookmarkTimeStamp()`
  - `updateBookmark(name)`
  - `waitForBookmarkLoading()`
  - `waitForBookmarkPanelPresent()`
- **Related components:** getBookmarksContainer, getPanel

### DashboardMenuBar
- **CSS root:** `.mstrmojo-RootView-menubar`
- **User-visible elements:**
  - Dashboard Menu Bar Container (`.mstrmojo-RootView-menubar`)
  - Sub Menu Container (`.mstrmojo-ui-Menu-item-container`)
- **Component actions:**
  - `clickDashboardMenuBar({ menu, subMenu, isClose = true })`
  - `clickSaveInMenuBar()`
  - `isCertifiedIconDisplayedInTitleBar()`
  - `isTemplateIconDisplayedInTitleBar()`
  - `openFileMenu()`
  - `toggleCertify()`
  - `toggleSetAsTemplate()`
- **Related components:** getDashboardMenuBarContainer, getSubMenuContainer, getTitleContainer

### DossierAuthoringPage
- **CSS root:** `.mstrmojo-ui-Menu-item-container`
- **User-visible elements:**
  - Apply Button (`.item.btn.apply`)
  - Auto Dashboard Welcome Popup (`.ai-assistant-tooltip`)
  - Cancel Button (`.item.btn.cancel`)
  - Change View Mode Button (`.item.changeViewMode`)
  - Close Dossier Button (`.item.btn.close`)
  - Context Menu (`.mstrmojo-ui-Menu-item-container`)
  - Dashboard Properties Editor (`.mstrmojo-DocProps-Editor`)
  - Dataset Panel (`.mstrmojo-RootView-datasets`)
  - Direct Save Dossier Button (`.item.btn.save .btn`)
  - Disabled Apply Button (`.item.btn.apply.disabled`)
  - Dossier Title Text (`.mstr-macro-texts`)
  - Dossier View (`.mstrmojo-DocPanel-wrapper.mstrmojo-scrollbar-host`)
  - Download Button (`.item.download`)
  - Freeform Layout Page (`.mstrmojo-DocSubPanel-containerNode`)
  - Library Icon (`.item.btn.library`)
  - Max Restore Btn (`.hover-btn.hover-max-restore-btn.visible`)
  - Page Size Button (`.item.pageSetting`)
  - Panel Stack Header (`.mstrmojo-PanelTabStrip`)
  - Panel Stack Left Arrow (`.left-arrow-btn.visible`)
  - Query Details Content (`#sqlViewer .mstrmojo-Editor-content .mstr-SQLV-content-container`)
  - Refresh Button On Toolbar (`.item.btn.refresh`)
  - Save And Open Dropdown Item (`.item.saveAndOpen.mstrmojo-ui-Menu-item`)
  - Save As Dossier Button (`.item.saveAs`)
  - Save As Editor (`.mstrmojo-SaveAsEditor`)
  - Save Dossier Button (`.item.mb.save-dropdown .btn`)
  - Save Dossier Dropdown Item (`.item.save1.mstrmojo-ui-Menu-item`)
  - Save Dossier Folder Button (`.mstrmojo-Button.mstrmojo-WebButton.hot.okButton`)
  - Save In Progress Box (`.mstrmojo-Editor.mstrWaitBox.saving-in-progress`)
  - Select Dataset Diag (`.mstrmojo-vi-dataset-picker.mstrmojo-vi-dataset-picker`)
  - Success Icon (`.success-icon`)
  - Title Max Restore Btn (`.maximize.mstrmojo-UnitContainer-titleButton-small`)
  - Toaster Label (`.mstr-SQLV-message-label`)
  - Toc Panel (`.mstrmojo-TableOfContents`)
  - Toggle Bar (`.mstrmojo-RootView-togglebar`)
  - Viz View (`.gm-main-container`)
- **Component actions:**
  - `actionOnEditorDialog(option)`
  - `actionOnMenubar(menuOption)`
  - `actionOnMenubarWithSubmenu(menuOption, subOption, seconds = 20, notShow = false)`
  - `actionOnSubmenu(subOption, notShow = false)`
  - `actionOnSubmenuNoContinue(subOption)`
  - `actionOnToolbar(buttonName)`
  - `addDatasetElementToDropzone(name, dropzoneName)`
  - `addExistingObjects()`
  - `addNewSampleData(sampleDataIndex, prepare)`
  - `addNewSampleDataSaaS(sampleDataIndex, prepare)`
  - `addParameterToFilterPanel(name)`
  - `addParameterToParameterSelector(name, index)`
  - `changeNoDataTextColor(color)`
  - `changeViewModeTo(optionText)`
  - `checkNotShowAgain()`
  - `clickBtnWithLabel(label)`
  - `clickChangeViewModeButton()`
  - `clickCloseDossierButton()`
  - `clickLoadingDataCancelButton()`
  - `clickMaxRestoreBtn()`
  - `clickOnCheckboxWithTitle(title)`
  - `clickOnDashboardPropertiesEditorButton(buttonName)`
  - `clickOnExecutionMode()`
  - `clickPageSizeButton()`
  - `clickPageSizeFromMoreOptions()`
  - `clickSaveDossierButton(dossierName)`
  - `clickSaveDossierButtonWithWait()`
  - `clickTextFormatBtn(type)`
  - `clickTitleMaxRestoreBtn()`
  - `clickToDismissPopups()`
  - `clickVisualizationByLabel(label = 'Visualization 1 copy')`
  - `closeDossierWithoutSaving()`
  - `closeQueryDetail()`
  - `closeSavedSuccessfullyToast()`
  - `copyQueryDetails()`
  - `deleteUnstructuredDataItem(name)`
  - `dismissAutoDashboardWelcomePopup()`
  - `downLoadDossier()`
  - `getCurrentChangeViewModeText()`
  - `getDatasetNamesInDatasetsPanel()`
  - `getMenueItemCount()`
  - `getPaletteNames()`
  - `getTitleBarSetting()`
  - `getTitleFontColor(line)`
  - `getTitleFontFamily(line)`
  - `getTitleFontSize(line)`
  - `getTitleStyle(value)`
  - `goToLibrary()`
  - `hoverOnPanelStack()`
  - `hoverOnVisualizationByLabel(label = 'Visualization 1 copy')`
  - `inputDossierNameAndSave(objectName)`
  - `inputNoDataText(text)`
  - `isApplyButtonDisabled()`
  - `isBtnDisabled(buttonName)`
  - `isDatasetElementPresent(name)`
  - `isDatasetlistEmpty()`
  - `isEditorWindowOpened()`
  - `isNoDataFormatButtonSelected(type)`
  - `isOptionDisabledInMenu(subOption)`
  - `isOptionExistInMenu(subOption)`
  - `isPaletteChecked(paletteName)`
  - `isPaletteSelected(subOption)`
  - `linkToOtherDataset(datasetName, itemName)`
  - `notSaveDossier()`
  - `openInfoWindowContainerFormatPanel()`
  - `openMenuByClick(el)`
  - `openPanelStackTitleContainerFormatPanel()`
  - `refreshDossier()`
  - `saveAndOpen()`
  - `saveAsNewObject(objectName)`
  - `saveNewADC(objectName)`
  - `saveNewDossier(dossierName)`
  - `saveNewObject(objectName)`
  - `saveNewObjectCommon(objectName, saveButton)`
  - `searchDataset(text)`
  - `searchSelectDataset(text)`
  - `selectPageSize(optionText)`
  - `setTitleStyle(value)`
  - `switchPageInAuthoring(pageName)`
  - `switchToPanelTab(tab)`
  - `waitForAuthoringPageLoading()`
- **Related components:** baseFormatPanel, datasetPanel, datasetsPanel, dossierAuthoringPage, dossierPage, editorPanel, getAuthoringPage, getDatasetPanel, getInfoWindowByLabelInLayersPanel, getPage, getPanel, getTitleAndContainer, libraryAuthoringPage, switchToPanel, togglePanel, waitForAuthoringPage

### DossierPage
- **CSS root:** `.mstrd-Page.activePage`
- **User-visible elements:**
  - Active Page Container (`.mstrd-Page.activePage`)
  - Add To Library (`.mstrd-PublishButton`)
  - Cancel Execution Button (`.mstrd-CancelExecutionButton`)
  - Certified Icon (`.mstrd-DossierTitle .mstrd-CertifiedIcon`)
  - Comments Icon (`.mstrd-CommentIcon`)
  - Confirm Reset Button (`.mstrd-ConfirmationDialog-button`)
  - Dossier Link Nav (`.mstrd-BackNavItem, .icon-backarrow`)
  - Dossier Page Not Load Indicator (`.mstrd-DossierPageNotLoadIndicator`)
  - Dossier View (`.mstrd-DossierViewContainer-main`)
  - Dossier View Mode Icon (`.mstrd-ViewModeNavItemContainer`)
  - Duplicate Button (`.mstrd-DuplicateNavItem`)
  - Edit Icon (`.icon-info_edit`)
  - Favorite Icon (`.mstrd-FavoriteIconButton`)
  - Hamburger Icon (`.mstrd-HamburgerIconContainer-icon`)
  - Home Icon (`.mstr-nav-icon[class*=icon-tb_home]`)
  - Info Window Loading Icon (`mstrd-CursorSpinner--visible`)
  - Left Nav Bar (`.mstrd-NavBar.mstrd-NavBar-left`)
  - Library Icon (`.mstr-nav-icon.icon-library,.mstrd-LibraryNavItem-link`)
  - Navigation Bar (`.mstrd-NavBarWrapper`)
  - Navigation Bar Collapsed Icon (`.mstrd-NavBarTriggerWrapper`)
  - Page Indicator (`.mstrd-DossierPageIndicator`)
  - Page Loading Icon (`.mstrd-LoadingIcon-loader`)
  - Page Title (`.mstrd-NavBarTitle-item.mstrd-NavBarTitle-item-active`)
  - Redo Icon (`.mstrd-RedoNavItem .icon-tb_redo`)
  - Reset Icon (`.icon-tb_reset`)
  - Revert Filter (`.mstrd-Button.mstrd-Button--primary`)
  - Right Nav Bar (`.mstrd-NavBar.mstrd-NavBar-right`)
  - Run In Background Button (`.mstrd-AddToHistoryButton`)
  - Saa SLibrary Icon (`.mstrd-LibraryNavItem-link`)
  - Share Panel (`.mstrd-ShareDropdownMenuContainer`)
  - Show Page Indicator (`.mstrd-DossierPageIndicator.mstrd-show`)
  - Template Icon (`.mstrd-DossierTitle .mstrd-TemplateIcon`)
  - Tooltip (`.ant-tooltip:not(.ant-tooltip-hidden)`)
  - Undo Icon (`.mstrd-UndoNavItem .icon-tb_undo`)
  - Visualization Menu Button (`.hover-menu-btn`)
  - Viz View (`.gm-main-container`)
- **Component actions:**
  - `addToLibrary()`
  - `cancelAddToLibrary()`
  - `checkImageCompareForDocView(testCase, imageName)`
  - `clickAddToLibraryButton()`
  - `clickBtnByTitle(text)`
  - `clickCancelExecutionButton(option)`
  - `clickCancelExecutionButtonInCurrentPage(option)`
  - `clickCloseBtn()`
  - `clickDossierPanelStackLeftSwitchArrow()`
  - `clickDossierPanelStackRightSwitchArrow()`
  - `clickDossierPanelStackSwitchTab(text)`
  - `clickDuplicateButton()`
  - `clickEditIcon()`
  - `clickHamburgerMenu()`
  - `clickHomeIcon()`
  - `clickImage()`
  - `clickImageLinkByTitle(text)`
  - `clickOpenDashboardOnSnapshotBanner()`
  - `clickPageTitle()`
  - `clickRedo()`
  - `clickRedoInDossier()`
  - `clickRunInBackgroundButton()`
  - `clickSaaSLibraryIcon()`
  - `clickShape()`
  - `clickTextfieldByTitle(text)`
  - `clickUndo()`
  - `clickUndoInDossier()`
  - `clickVisibleButtonByAriaLabel(labelText = 'Cancel')`
  - `closeInfoWindow()`
  - `closePopupsByClickBlankPathinRsd()`
  - `closeShareDropDown()`
  - `closeUserAccountMenu()`
  - `currentPageIndicator()`
  - `dismissSnapshotBanner()`
  - `doesMstrRootHaveErrorClass()`
  - `expandCollapsedNavBar()`
  - `favorite()`
  - `getCurrentPageByKey()`
  - `getDossierChapterTooltip()`
  - `getDossierPageTooltip()`
  - `getFavoriteTooltipText()`
  - `getLibraryHomeTooltipText()`
  - `getMessageContainerInSnapshotBannerText()`
  - `getNavigationBarBackgroundColor()`
  - `goBack()`
  - `goBackFromDossierLink()`
  - `goToLibrary()`
  - `hidePageIndicator()`
  - `hoverOnCertifiedIcon()`
  - `hoverOnLibraryIcon()`
  - `hoverOnSwiperPage()`
  - `hoverOnTemplateIcon()`
  - `hoverOnTextfieldByTitle(text)`
  - `hoverOnVisualizationMenuButton()`
  - `hoverOnVizGroup()`
  - `isAccountDividerPresent()`
  - `isAccountIconPresent()`
  - `isAccountOptionPresent(text)`
  - `isAddToLibraryDisplayed()`
  - `isBackIconPresent()`
  - `isButtonConntextMenuPresent(btnText)`
  - `isCancelButtonDisplayed()`
  - `isDuplicateButtonDisplayed()`
  - `isEditIconPresent()`
  - `isFavoriteSelected()`
  - `isHomeIconPresent()`
  - `isImagePresent(text)`
  - `isLibraryIconPresent()`
  - `isLogoutPresent()`
  - `isNavigationBarCollapsedIconPresent()`
  - `isNavigationBarPresent()`
  - `isOnDossierPage()`
  - `isPageTitlePresent()`
  - `isRedoEnabled()`
  - `isRevertFilterDisplayed()`
  - `isRunInBackgroundButtonDisplayed()`
  - `isUndoEnabled()`
  - `logout(options = {})`
  - `openShareDropDown()`
  - `openUserAccountMenu()`
  - `pageTitle()`
  - `reload()`
  - `removeFavorite()`
  - `resetDossier()`
  - `resetDossierIfPossible()`
  - `resetDossierNoWait()`
  - `selectLinkFromContextMenu(btnText, menuItemText)`
  - `switchPageByKey(direction, delay)`
  - `switchViewMode(viewMode)`
  - `takeScreenshotByDocView(testCase, imageName, tolerance = 0.5)`
  - `title()`
  - `unhoverOnVisualizationMenuButton()`
  - `waitForDossierLoading()`
  - `waitForDossierPageNotLoadIndicator()`
  - `waitForInfoWindowLoading()`
  - `waitForPageIndicatorDisappear()`
  - `waitForPageLoading()`
  - `waitForPageLoadingMoreWaitTime(waitTime)`
- **Related components:** getActivePageContainer, getCancelExecutionButtonByPage, getCurrentPage, getDisplayedPage, getDossierPage, getDossierPanel, getMessageContainer, getPage, getSharePanel, getShowPage, getSnapshotBannerContainer, getTitle_Page, getTooltipContainer, waitForPage

### DossierTextField
- **CSS root:** `body`
- **User-visible elements:**
  - Text Fields (`body`)
- **Component actions:**
  - `clickRichTextBoxByAriaLabel(ariaLabel)`
  - `clickRichTextBoxByContent(textContent)`
  - `clickRichTextBoxElement(richTextBox)`
  - `clickTextField(textFieldText)`
  - `clickTextFieldByTextContent(text)`
  - `doubleClickTextField(textFieldText)`
  - `editTextFieldbyDoubleClick(textField, newText)`
  - `getHeight(textFieldText)`
  - `getRichTextBoxByAriaLabel(ariaLabel)`
  - `getRichTextBoxByContent(textContent)`
  - `getTextFieldText(textField)`
  - `getTextFiledTitle(text)`
  - `isTextPresent(text)`
  - `pasteTextFieldbyDoubleClick(textField)`
- **Related components:** getContainer

### HtmlContainer
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - _none_
- **Related components:** _none_

### HTMLPage
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `textBGC(index)`
- **Related components:** _none_

### LimitElementSource
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickOutside()`
  - `clickOutsideElementSourceSelection(attributesMetricsName)`
  - `openLimitElementSourceMenu(attributesMetricsName)`
  - `openLimitElementSourceMenuInCanvas(attributesMetricsName)`
  - `selectElementSource(attributesMetricsName, source)`
  - `selectElementSourceInFilterInCanvas(attributesMetricsName, source)`
- **Related components:** dossierAuthoringPage

### LinkAttributes
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `linkToOtherDataset(datasetName, itemName, attributeToLinkTo)`
- **Related components:** datasetsPanel, dossierAuthoringPage, dossierPage, libraryAuthoringPage

### ManageAccessDialog
- **CSS root:** `.mstrd-ManageAccessContainer-main`
- **User-visible elements:**
  - Manage Access Dialog (`.mstrd-ManageAccessContainer-main`)
  - Manage Access Dialog Content (`.mstrd-ManageAccessContainer-content`)
  - Manage Access Dialog Header (`.mstrd-ManageAccessContainer-header`)
  - Success Toast (`.mstrd-FloatNotifications`)
  - Success Toast Close Button (`.mstrd-FloatNotifications-closeButton`)
- **Component actions:**
  - `addACL(userList, groupList, targetACL)`
  - `cancelManageAccessChange()`
  - `closeDialog()`
  - `getACLItemscount()`
  - `getChangeACLButtonByName(user)`
  - `getChangeACLDropDownMenu(user)`
  - `getRemoveButtonByName(user)`
  - `getTargetACLItem(user, targetACL)`
  - `getUserCurrentACL(user)`
  - `getUserItemByName(user)`
  - `hoverACL(name)`
  - `isAddButtonEnabled()`
  - `isCancelButtonEnabled()`
  - `isManageAccessPresent()`
  - `isSaveButtonEnabled()`
  - `isUserACLExisted(user)`
  - `openACL(name)`
  - `openACLInSearchSection()`
  - `removeACL(name)`
  - `saveManageAccessChange(waitForSuccessToast = true)`
  - `searchRecipient(searchKey)`
  - `selectApplyToAll()`
  - `selectGroupRecipient(name)`
  - `selectOverwriteForAll()`
  - `selectRecipient(user)`
  - `updateACL(name, targetACL)`
  - `waitForManageAccessLoading()`
- **Related components:** _none_

### ManageAccessEditor
- **CSS root:** `.mstrmojo-SimpleObjectInputBox-container`
- **User-visible elements:**
  - Add User Group Search Area (`.mstrmojo-SimpleObjectInputBox-container`)
  - Existing User Group Search Box (`.mstrmojo-TextBox.acl-filter-box`)
  - Manage Access Editor (`.mstrmojo-ManageAccess-Editor`)
  - Manage Access Editor Content View (`.mstrmojo-Box .content-view`)
  - Search Suggest List (`.mstrmojo-suggest-list.acl-list`)
- **Component actions:**
  - `chapterIsDisplayedInTOC(chapterName)`
  - `chapterIsLocked(chapterName)`
  - `chapterIsUnLocked(chapterName)`
  - `checkUserOrGroupFromExistingList(userOrGroup)`
  - `clickAddUserButton()`
  - `clickButton(btnName)`
  - `clickShowDetails()`
  - `errorMsgIsDisplayed(errorMsg)`
  - `openManageAccessEditor(chapterName)`
  - `searchInSelectedList(userOrGroup)`
  - `searchUserGroup(userOrGroup)`
  - `selectFromSuggestList(userOrGroup)`
  - `setPulldown(newOption)`
  - `switchChapterInEditor(chapterName)`
  - `switchPulldown(currentOption, newOption)`
  - `toggleViewSelectedButton()`
  - `userOrGroupIsAdded(userOrGroup)`
  - `userOrGroupIsChecked(userOrGroup)`
  - `userOrGroupIsNotChecked(userOrGroup)`
- **Related components:** dossierAuthoringPage

### Reset
- **CSS root:** `.mstrd-SliderConfirmDialog-content`
- **User-visible elements:**
  - Confirm Dialog (`.mstrd-SliderConfirmDialog-content`)
  - Page Loading Icon (`.mstrd-LoadingIcon-content--visible`)
  - Reset Button (`.mstrd-NavItemWrapper.mstrd-ResetNavItem.mstr-navbar-item`)
- **Component actions:**
  - `cancelReset()`
  - `confirmReset(isPrompted)`
  - `confirmResetNoWait()`
  - `hoverOnResetButton()`
  - `isResetDisabled()`
  - `isResetPresent()`
  - `resetIfEnabled()`
  - `selectReset()`
- **Related components:** dossierPage

### Share
- **CSS root:** `.mstrd-ShareDossierContainer-imageHolder`
- **User-visible elements:**
  - Content In Pin In Teams Dialog (`.mstrd-PinToTeamsTabDialog-content`)
  - Cover Image (`.mstrd-ShareDossierContainer-imageHolder`)
  - Disabled Channel Selector (`.ant-select-disabled`)
  - Frequently Invited Panel (`.mstrd-InviteListFreqItems`)
  - Header Pin In Teams Dialog (`.mstrd-PinToTeamsTabDialog-top`)
  - Invite Detail Panel (`.mstrd-InviteListDetailsPanel`)
  - Invite LIst Search Results (`.mstrd-InviteListSearchResults`)
  - Invite Search Box (`.mstrd-InviteSearchBox-input`)
  - Name And Time In Share Dossier Dialog (`.mstrd-ShareDossierContainer-nameAndTime`)
  - Pin Bot Toast (`.ant-message-notice-content`)
  - Pin In Pin To Team Dialog (`button.mstrd-PinToTeamsTabDialog-pinBtn`)
  - Pin In Teams Dialog (`.mstrd-PinToTeamsTabDialog-main`)
  - Share Dossier Panel (`.mstrd-ShareDossierContainer-main`)
  - Share Icon (`.mstr-nav-icon.icon-tb_share_n`)
  - Share Panel (`.mstrd-ShareDropdownMenuContainer .mstrd-DropdownMenu-main`)
  - Subscribe Details Panel (`.mstrd-SubscriptionDialog`)
  - Team Selector (`.ant-select-show-search`)
  - View In Tab Button (`.mstrd-PinToTeamsTabSuccessMessage-goToTab`)
- **Component actions:**
  - `clickCopyButton()`
  - `clickExportToExcel()`
  - `clickInviteButton()`
  - `clickInviteUser()`
  - `clickPinInTeams()`
  - `clickReportExportToExcel()`
  - `clickShareInTeams()`
  - `closeExportPDFSettingsWindow()`
  - `closeShareDossierPanel()`
  - `closeSharePanel()`
  - `dismissCursorInSelector()`
  - `downloadDossier()`
  - `getShareButtonText()`
  - `getShareDossierPanelItemsName()`
  - `hideOwnerAndTimestampInShareDashboardDialog()`
  - `inviteUser(option, param)`
  - `isCoverImageBlank()`
  - `isDownloadDossierEnabled()`
  - `isDownloadDossierPresent()`
  - `isExportExcelDisable()`
  - `isExportPDFEnabled()`
  - `isExportPDFPresent()`
  - `isGetLinkPresent()`
  - `isInviteEnabled()`
  - `isInviteUserPresent()`
  - `isManageAccessPresent()`
  - `isSendEmailPresent()`
  - `isSendEmailPresent()`
  - `isShareBotPresent()`
  - `isShareDossierPresent()`
  - `isShareIconDisabled()`
  - `isShareIconPresent()`
  - `isSharePanelItemExisted(name)`
  - `openExportCSVSettingsWindow()`
  - `openExportPDFSettingsWindow()`
  - `openExportToGoogleSheetsDialog()`
  - `openManageAccessDialog()`
  - `openPinInTeamsDialog()`
  - `openShareBotDialog()`
  - `openShareDossierDialog()`
  - `openSharePanel()`
  - `openSubscribeSettingsWindow()`
  - `pinBot()`
  - `selectChannelAndPinBot({ team: teamName, channel: channelName })`
  - `selectChannelToPinBot({ team: teamName, channel: channelName })`
  - `selectSuggestionItem(option, param)`
  - `shareInTeams()`
  - `viewPinnedObjectInTab()`
  - `waitForDownloadComplete({ name, fileType })`
- **Related components:** excelExportPanel, getCloseShareDossierPanel, getFrequentlyInvitedPanel, getInviteDetailPanel, getShareButtonInShareInTeamsPanel, getShareDossierPanel, getSharePanel, getSubscribeDetailsPanel, openSharePanel

### ShareDossierDialog
- **CSS root:** `.mstrd-ShareDossierContainer-nameAndTime`
- **User-visible elements:**
  - Change ACLButton (`.mstrd-RecipientSearchSection-aclDropdown`)
  - Change ACLDrop Down Menu (`.mstrd-RecipientSearchSection-option .mstrd-DropDown-children`)
  - Copied Tooltip (`.mstrd-LinkSection-popover`)
  - Name And Time (`.mstrd-ShareDossierContainer-nameAndTime`)
  - Search List (`.mstrd-RecipientSearchResults, .mstrd-RecipientSearchSection-searchList`)
  - Search Loading Spinner (`.mstrd-RecipientSearchResults-loadingSpinner, .mstrd-RecipientTree-loadingSpinner`)
  - Share Dossier Dialog (`.mstrd-ShareDossierContainer-main`)
  - Success Toast (`.mstrd-FloatNotifications`)
  - Success Toast Close Button (`.mstrd-FloatNotifications-closeButton`)
- **Component actions:**
  - `addMessage(msg)`
  - `addUserForSaaS(userList)`
  - `changeACLTo(targetACL)`
  - `closeDialog()`
  - `closeShareBookmarkDropDown()`
  - `copyLink(waitForSuccessToast = false)`
  - `deleteRecipients(userList)`
  - `dismissRecipientSearchList()`
  - `expandGroup(name)`
  - `getCurrentSelectionText()`
  - `getGroupCheckBoxStatus(name)`
  - `getGroupMemberCount(name)`
  - `getRecipientDefaultHintText()`
  - `getSearchResultText()`
  - `getSelectedCount()`
  - `getShareAllBookmarksLink()`
  - `getShareDialogTitle()`
  - `hideBookmarkTimeStamp()`
  - `hideSharedUrl()`
  - `hideTimeAndName()`
  - `includeAllBookmarksInTeams()`
  - `includeBookmark()`
  - `isAddMessageTextAreaDisabled()`
  - `isAllOptionPresent()`
  - `isBMListPresent()`
  - `isChangeACLPresent()`
  - `isGroupItemDisabled(name)`
  - `isGroupMemberPresent(name)`
  - `isIncludeBMPresent()`
  - `isRecipientSearchBoxDisabled()`
  - `isShareButtonEnabled()`
  - `openACL()`
  - `openBMList()`
  - `searchRecipient(searchKey, waitForShareDialog = true)`
  - `selectGroupRecipient(name)`
  - `selectRecipients(userList, groupName = 'None')`
  - `selectSharedBookmark(bookmarkList, sectionName = 'MY BOOKMARKS')`
  - `shareAllBookmarksFromIWToUser(dossier, userName)`
  - `shareDossier(waitForSuccessToast = false)`
  - `showBookmarkTimeStamp()`
  - `showSharedUrl()`
  - `showTimeAndName()`
  - `slelectAllForGroupRecipient(name)`
  - `waitForSearchListPresent()`
- **Related components:** getBMListContainer, libraryPage

### TOC
- **CSS root:** `.mstrd-MobileDossierNavBarToc-menu`
- **User-visible elements:**
  - Close Icon (`.mstrd-DropdownMenu-headerIcon.icon-pnl_close.visible`)
  - Consumption Horizontal TOCBar (`.mstrd-DossierMenuBarToCContainer-ToC.mstr-toc`)
  - Dossier Title In Mobile View (`.mstrd-MobileDossierNavBarTitle`)
  - Horizontal Toc Menu Content (`.mstr-toc-menuBarContent`)
  - Menu Container (`.mstrd-MobileDossierNavBarToc-menu`)
  - Mobile TOC (`.mstrd-MobileDossierNavBarTitle`)
  - Selected Favorites Icon (`.mstrd-FavoriteIconButton--selected`)
  - Toc Header (`.mstrd-ToCDropdownMenuContainer-headerInfo`)
  - TOCIcon (`.mstr-nav-icon[class*=icon-tb_toc]`)
  - Toc Info (`.mstrd-ToCDropdownMenuContainer-headerInfo`)
  - TOCPanel (`.mstrd-DropdownMenu-main`)
  - TOCTitle Name (`div.mstrd-DropdownMenu-headerTitle`)
- **Component actions:**
  - `browseloop(testcase)`
  - `clickFavoritesIcon()`
  - `clickHorizontalTocMenu(pageName)`
  - `clickLeftArrow()`
  - `clickPageInHorizontalTocMenu(pageName)`
  - `clickRightArrow()`
  - `closeMenu({ icon = 'toc' })`
  - `closeMenuWithoutWait({ icon = 'toc' })`
  - `favoriteByTOC()`
  - `getFavoritesIcon()`
  - `getHorizontalTocButton(pageName)`
  - `getMenuContainer()`
  - `getPage({ chapterName, pageName })`
  - `getTOCPin()`
  - `getTOCUnpin()`
  - `goToPage({ chapterName, pageName })`
  - `goToPagenoWait({ chapterName, pageName })`
  - `goToPageWait({ chapterName, pageName })`
  - `hideTocTimeStamp()`
  - `hoverHorizontalTocMenu(pageName)`
  - `hoverOnTocItem({ chapterName, pageName })`
  - `hoverPageInHorizontalTocMenu(pageName)`
  - `isFavoritesIconPresent()`
  - `isFavoritesIconSelected()`
  - `isTOCDocked()`
  - `isTOCMenuOpen()`
  - `openMenu()`
  - `openMenuNoCheck()`
  - `openPageFromTocMenu({ chapterName, pageName })`
  - `openPageFromTocMenunoWait({ chapterName, pageName })`
  - `openPageFromTocMenuWait({ chapterName, pageName })`
  - `openTocInMobileView()`
  - `pinTOC()`
  - `removeFavoriteByTOC()`
  - `showTocTimeStamp()`
  - `tocTitleName()`
  - `unpinTOC()`
- **Related components:** dossierPage, getMenuContainer, getPage, goToPage, waitForPage

## Common Workflows (from spec.ts)

1. 24.07 Dossier Transaction support slider as the control type (used in 4 specs)
2. [QAC255_1] Apply 1 line title theme to normal grid (used in 2 specs)
3. [QAC255_10] Apply 1 line heatmap network waterfall Theme (used in 2 specs)
4. [QAC255_11] Apply 2 lines+button heatmap network waterfall Theme (used in 2 specs)
5. [QAC255_12] Apply 1 line Histogram Box Plot theme (used in 2 specs)
6. [QAC255_13] Apply 2 lines+button Histogram Box Plot theme (used in 2 specs)
7. [QAC255_14] Apply Sankey and Time Series theme (used in 2 specs)
8. [QAC255_15] Apply Sankey and Time Series 2 lines+button theme (used in 2 specs)
9. [QAC255_16] Apply Keydriver and NLG Theme (used in 2 specs)
10. [QAC255_17] Apply Keydriver and NLG 2 lines+button Theme (used in 2 specs)
11. [QAC255_18] Apply Forcast + Trend 1 line theme (used in 2 specs)
12. [QAC255_19] Apply Forcast2 + Trendline2 theme (used in 2 specs)
13. [QAC255_2] Apply 2 lines title theme to normal grid (used in 2 specs)
14. [QAC255_20] Apply control + field theme (used in 2 specs)
15. [QAC255_21] Apply panel stack theme (used in 2 specs)
16. [QAC255_22] Copy Paste on the same type viz (used in 2 specs)
17. [QAC255_3] Apply 2 lines+button theme to normal grid (used in 2 specs)
18. [QAC255_4] Apply 2lines+button AG grid theme to grid (used in 2 specs)
19. [QAC255_5] Apply 2LineTitles AG grid theme to grid (used in 2 specs)
20. [QAC255_6] Apply GM theme to GM (used in 2 specs)
21. [QAC255_7] Apply Map theme to Map (used in 2 specs)
22. [QAC255_8] Apply 1 line KPI Theme to KPI (used in 2 specs)
23. [QAC255_9] Apply 2 lines+button KPI Theme to KPI (used in 2 specs)
24. [TC77270_1] Dossier Transaction Configuration & Consumption | E2E (used in 2 specs)
25. [TC77270_2] Dossier Transaction Configuration & Consumption | E2E (used in 2 specs)
26. [TC77270_3] Dossier Transaction Configuration & Consumption | E2E (used in 2 specs)
27. [TC77270_4] Dossier Transaction Configuration & Consumption | E2E (used in 2 specs)
28. [TC91680_1] user does not have Execute Transaction privilege (used in 2 specs)
29. [TC91680_2] user does not have Use Python Scripts privilege (used in 2 specs)
30. [TC91680_3] user does not have Web Config Transaction privilege (used in 2 specs)
31. [TC93353_1] Dossier Transaction in canvas selector/DDIC - Case 1 (used in 2 specs)
32. [TC93353_2] Dossier Transaction in canvas selector/DDIC - Case 2 (used in 2 specs)
33. [TC93353_3] Dossier Transaction in canvas selector/DDIC - Case 3 (used in 2 specs)
34. [TC98287_1] Grid as source (used in 2 specs)
35. [TC98287_2] Map layer1 as source (used in 2 specs)
36. [TC98287_3] Map layer2 as source (used in 2 specs)
37. [TC98288_1] Viz Target DDIC_Configuration_Switch mode (used in 2 specs)
38. [TC98288_2] Viz Target DDIC_Configuration_PanelStack (used in 2 specs)
39. [TC98288_3] Viz Target DDIC_Consumption_Intersection (used in 2 specs)
40. [TC98288_4] Viz Target DDIC_Consumption_Last Selection (used in 2 specs)
41. [TC99393_1] Define a slider for Python Transaction (used in 2 specs)
42. [TC99393_2] Consumption for Python Transaction with Slider (used in 2 specs)
43. [TC99393_3] Validate date type to define slider for SQL Transaction (used in 2 specs)
44. [TC99393_4] Define a slider for SQL Transaction (used in 2 specs)
45. [TC99393_5] Inline Edit Consumption for SQL Transaction with Slider (used in 2 specs)
46. [TC99393_6] Bulk Edit Consumption for SQL Transaction with Slider (used in 2 specs)
47. [TC99393_7] Bulk Add Consumption for SQL Transaction with Slider (used in 2 specs)
48. [TC99393_8] TXN slider defects (used in 2 specs)
49. [TC99393_9] Verify German User Experience for TXN Slider (used in 2 specs)
50. [TC99394_1] Pencil should show correctly when grid header is right aligned or empty (used in 2 specs)
51. [TC99559_1] normal grid enable subtitle and button (used in 2 specs)
52. [TC99559_10] Customizable Title Bar Defects (used in 2 specs)
53. [TC99559_11] GM and Map to enable titles and buttons (used in 2 specs)
54. [TC99559_12] German User for action name (used in 2 specs)
55. [TC99559_2] compound grid enable subtitle and button (used in 2 specs)
56. [TC99559_3] AG grid title and subtitle enabled - 1 (used in 2 specs)
57. [TC99559_4] AG grid title and subtitle enabled - 2 (used in 2 specs)
58. [TC99559_5] AG grid title and subtitle enabled - 3 (used in 2 specs)
59. [TC99559_6] AG grid title and subtitle enabled without txn- 4 (used in 2 specs)
60. [TC99559_7] title bar xfunctional test (used in 2 specs)
61. [TC99559_8] Customize action names in SQL Transaction (used in 2 specs)
62. [TC99559_9] Customizable Title Bar Consumption (used in 2 specs)
63. 24.03 Dossier Transaction in canvas selector can filter DDIC list (used in 2 specs)
64. 24.05 Dossier Transaction Visualization can filter DDIC list - Xfunc (used in 2 specs)
65. 25.06 python TXN and actions privilege (used in 2 specs)
66. 25.09 Customizable Title Bar (used in 2 specs)
67. 25.10 Dashboard Level Formatting (used in 2 specs)
68. Dossier SQL Transaction X-func (used in 2 specs)
69. Dossier Transaction Configuration & Consumption | E2E (used in 2 specs)
70. Url Generator (used in 2 specs)
71. Visualization target ddic Test - component level (used in 2 specs)
72. [TC28197] Check for reset enabling after navigating to another page (used in 1 specs)
73. [TC28198] Check for reset enabling due to manipulation on the visualization (used in 1 specs)
74. [TC28199] Checking reset state after applying a filter and clearing it & Cancel filter functionality (used in 1 specs)
75. [TC28200] Checking reset state after opening a dossier with previous modifications (used in 1 specs)
76. [TC28201] Check for reset enabling due to bookmarks created at the original state of dossier (used in 1 specs)
77. [TC28202] Check for reset enabling due to bookmarks created after changing original state of dossier (used in 1 specs)
78. [TC31543] Check TOC title & if TOC can be closed in 2 ways (used in 1 specs)
79. [TC31544] Check if clicking on page name navigates to the correct page and chapter (used in 1 specs)
80. [TC31545] Check if clicking on Chapter name navigates to the first page of the chapter (used in 1 specs)
81. [TC31546] Check if TOC is scrollable & correct page numbers are displayed (used in 1 specs)
82. [TC31547] Tooltip for truncated chapter and page names (used in 1 specs)
83. [TC42243] Verify HTML Container rendering with different kinds of tags in Library dossier (used in 1 specs)
84. [TC55273] Verify that Show Data window can be used effectively by Library end-users when using different types of visualizations (i.e. charts, graphs) (used in 1 specs)
85. [TC55274] Verify that Show Data window can be used effectively by Library end-users for visualizations with special features (i.e. thresholds, totals) (used in 1 specs)
86. [TC55275] Verify that Show Data window can be used effectively by Library end-users to read through on a grid and perform manipulations to that grid (i.e. sort, scroll) (used in 1 specs)
87. [TC55278] Verify that Show Data window can be used effectively by Library end-users to export data to Excel, PDF or CSV file (used in 1 specs)
88. [TC56141] Dossier - Reset -- Swipe pages after reset dossier (used in 1 specs)
89. [TC56654_01] CancelExecution -- WithoutPrompt (used in 1 specs)
90. [TC56654_02] CancelExecution -- WithPrompt (used in 1 specs)
91. [TC56654_03] CancelExecution -- WithPIP (used in 1 specs)
92. [TC56654_04] CancelExecution -- Filter (used in 1 specs)
93. [TC56654] Bookmark -- Create/Rename Bookmark (used in 1 specs)
94. [TC56656_01] Bookmark Blade - create/sort/filter/search (used in 1 specs)
95. [TC56656_02] Bookmark Blade - share/favorite (used in 1 specs)
96. [TC56656_03] Bookmark Blade - rename/delete/add snapshot (used in 1 specs)
97. [TC56656_04] change cover image for rwd/report/dashboard (used in 1 specs)
98. [TC56656] Bookmark -- Update Bookmark (used in 1 specs)
99. [TC56657] Bookmark -- Apply Bookmark (used in 1 specs)
100. [TC56658] Bookmark -- Delete Bookmark and long Bookmark list (used in 1 specs)
101. [TC56659] Bookmark -- Disable BM on RSD | Compatibility (used in 1 specs)
102. [TC56739] Check for reset state of new added dossier (used in 1 specs)
103. [TC56740] Check for tooltip and cancel/confirm reset (used in 1 specs)
104. [TC56741] Check for grid due to reset from info window after navigating to another page (used in 1 specs)
105. [TC56742] Check for grid due to reset from info window after manipulation on the visualization after (used in 1 specs)
106. [TC56743] Check for bookmarks after reset from info window (used in 1 specs)
107. [TC56744] After reset a dossier with prompt from info window, prompt panel should show (used in 1 specs)
108. [TC56745] Reset a RSD without prompt from info window (in search) (used in 1 specs)
109. [TC56746] After reset a RSD with prompt from info window, prompt panel should show (used in 1 specs)
110. [TC56748] Responsive UI Check (used in 1 specs)
111. [TC57256] Verify that Show Data window can be used effectively by Library end-users with a compound baseVisualization (used in 1 specs)
112. [TC58429] Verify that Show Data window can be used effectively by Library end-users for dossier with Filter (used in 1 specs)
113. [TC58606] Verify that Show Data window can be used effectively by Library end-users for visualizations with target and in-canvas selector (used in 1 specs)
114. [TC58902_01] Verify different prompt answer types can be passed correctly to target dossier - Grid/Viz (Prompt user,default answer,use selected prompt) (used in 1 specs)
115. [TC58902_02] Verify different prompt answer types can be passed correctly to target dossier - Grid/Viz(use same, ignore prompt) (used in 1 specs)
116. [TC58904_01] Verify pass prompt answer are supported on different prompt type - Grid/Viz(MQ,AQ,AE prompt) (used in 1 specs)
117. [TC58904_02] Verify pass prompt answer are supported on different prompt type - Grid/Viz (HQ,Value,Object prompt) (used in 1 specs)
118. [TC58906] Verify multiple prompt can be passed together to target - Grid/Viz (used in 1 specs)
119. [TC58907] Verify different filters can be passed to target dossier - Grid/Viz (used in 1 specs)
120. [TC58908_01] Verify dossier linking on Text - Link to Page (used in 1 specs)
121. [TC58908_02] Verify dossier linking on Text - Link to File (used in 1 specs)
122. [TC58909] Verify dossier linking on Image (used in 1 specs)
123. [TC58910] Verify dossier linking on Grid (used in 1 specs)
124. [TC58911] Verify dossier linking on Viz (used in 1 specs)
125. [TC58912] Verify dossier linking on MDX RA (used in 1 specs)
126. [TC58913] Verify dossier multiple links and backs work as expected (used in 1 specs)
127. [TC58915_01] Verify selected elements can be passed to target dossier as view filter(attribute, metric value/header) (used in 1 specs)
128. [TC58915_02] Verify selected elements can be passed to target dossier as view filter (group value, multiple values) (used in 1 specs)
129. [TC58916] Verify target dossier can be linked by context menu and tooltip (used in 1 specs)
130. [TC58917] Verify dossier linking error handling when target dossier page is deleted (used in 1 specs)
131. [TC59232] Bookmark -- Validating Bulk delete for BM (used in 1 specs)
132. [TC59359] Bookmark -- Validating BM with prompt (used in 1 specs)
133. [TC66098] Dossier - Reset -- No reset icon for dossier not in the Library (used in 1 specs)
134. [TC66262] Verify end-to-end Show Data functionality (used in 1 specs)
135. [TC66263] Verify different filters can be passed to target dossier - Text/Image (used in 1 specs)
136. [TC66265_01] Verify pass prompt answer are supported on different prompt type - Text/Image(AE,AQ,MQ prompt) (used in 1 specs)
137. [TC66265_02] Verify pass prompt answer are supported on different prompt type - Text/Image (HQ, Value, Object prompt) (used in 1 specs)
138. [TC66266] Verify multiple prompt can be passed together to target - Text/Image (used in 1 specs)
139. [TC66267] Verify different prompt answer types can be passed correctly to target dossier - Text/Image (used in 1 specs)
140. [TC66305] Dossier General - Dossier Title - Check title of Dossier with long dossier name(F30379) (used in 1 specs)
141. [TC66308] Dossier General - Dossier Title - Apply bookmark and check dossier title (F30379) (used in 1 specs)
142. [TC66400] Verify highlight is always disabled when hover on viz group in Library (used in 1 specs)
143. [TC67279] Verify different filters can be passed to itself (used in 1 specs)
144. [TC67839] Favorites - Favorites and remove from favorites by toolbar (used in 1 specs)
145. [TC68122] Dossier General - Dossier Title - Check title of Dossier with short dossier name (F30379) (used in 1 specs)
146. [TC69344_01] Verify pass prompt answer are supported on different prompt type - open in new window(AE,AQ,MQ) (used in 1 specs)
147. [TC69344_02] Verify pass prompt answer are supported on different prompt type - open in new window(HQ,Value,Object prompt) (used in 1 specs)
148. [TC69370_01] Verify different prompt answer type can be passed to target dossier - open in new window(prompt user,use selected,use default) (used in 1 specs)
149. [TC69370_02] Verify different prompt answer type can be passed to target dossier - open in new window(use same,ignore prompt) (used in 1 specs)
150. [TC69371] Verify filter can be passed to target dossier - open in new window (used in 1 specs)
151. [TC69372] Verify selected elements can be passed to target dossier as view filter - open in new window (used in 1 specs)
152. [TC69373] Verify dossier multiple links and backs work as expected - open in new window (used in 1 specs)
153. [TC70060_01] Validate URL API pass filter in Dossier without prompt (used in 1 specs)
154. [TC70060_03] Validate URL API pass filter in Dossier with prompt need answer (used in 1 specs)
155. [TC70781_01] Validate X-func for Default View on Library Web Working as expected- Auto Refresh (used in 1 specs)
156. [TC70781_02] Validate X-func for Default View on Library Web Working as expected- Reset (used in 1 specs)
157. [TC70781_03] Validate X-func for Default View on Library Web Working as expected - Dossier Linking (used in 1 specs)
158. [TC70781_04] Validate X-func for Default View on Library Web Working as expected - Link Drill (used in 1 specs)
159. [TC70781_05] Validate X-func for Default View on Library Web Working as expected - Bookmark (used in 1 specs)
160. [TC70781_07] Validate X-func for Default View on Library Web Working as expected - useCurrentAnswer Prompt (used in 1 specs)
161. [TC70781_08] Validate X-func for Default View on Library Web Working as expected - doNotDisplay Prompt (used in 1 specs)
162. [TC70781_09] Validate X-func for Default View on Library Web Working as expected - discardCurrentAnswers Prompt (used in 1 specs)
163. [TC70781_10] Validate X-func for Default View on Library Web Working as expected - show data (used in 1 specs)
164. [TC71915] Favorites - Favorites and remove from favorites by favorite icon (used in 1 specs)
165. [TC71916] Favorites - Favorites and remove from favorites by info-window on homepage (used in 1 specs)
166. [TC71917] Favorites - Favorites and remove from favorites by context menu (used in 1 specs)
167. [TC71920] Favorites - Favorites on multi-selection mode (used in 1 specs)
168. [TC72089] Favorites - Favorites and remove from favorites by info-window on global search (used in 1 specs)
169. [TC72091] Favorites - Favorites status async among favorite icon, info-window, favorite section and favorite list (used in 1 specs)
170. [TC72534_01] Verify embedded MSTR web and Library with HTML Container in Library dossier (used in 1 specs)
171. [TC72534] Verify embedded MSTR web and Library with HTML Container in Library dossier (used in 1 specs)
172. [TC72540] Verify embedded MSTR web with HTML Container in Library dossier (used in 1 specs)
173. [TC72675] Verify out sourcing website with HTML Container in Library dossier (used in 1 specs)
174. [TC72677] Verify embedded video with HTML Container in Library dossier (used in 1 specs)
175. [TC72678] Verify embedded video with HTML Container in Library dossier (used in 1 specs)
176. [TC73323] Verify Pin TOC end-to-end journey on Library web (used in 1 specs)
177. [TC73329] Verify Pin TOC functionality in different dossier on Library web (used in 1 specs)
178. [TC73330] Verify Pin TOC functionality for different user on Library web (used in 1 specs)
179. [TC73331] Verify UI of TOC responsive mode on Library web (used in 1 specs)
180. [TC74080] Validate dossier panel stack switching and rendering in Library Web (used in 1 specs)
181. [TC74081] Validate dossier panel stack with linking in Library Web (used in 1 specs)
182. [TC74082] Validate dossier panel stack with prompt in Library Web (used in 1 specs)
183. [TC75869] Validate the height of image in dossier HTML container and grid on library is the same as that on web (used in 1 specs)
184. [TC77170] Verify TOC working as expected when there is only page in a chapter (used in 1 specs)
185. [TC77542] Verify pass filter panel to target prompt on text/image (used in 1 specs)
186. [TC77545] Verify pass filter panel to target prompt by date (used in 1 specs)
187. [TC78621] Validate special chars as source element to link to target dosssier(%, &, <>, +) (used in 1 specs)
188. [TC78911] Validate Dossier image with different absolute/relative path in Library Web (used in 1 specs)
189. [TC78917] Validate RSD image with different absolute/relative path in Library Web (used in 1 specs)
190. [TC79672] Validate special chars as source element to link to target dosssier - open in new tab(%, &,<>,+) (used in 1 specs)
191. [TC80298] Validate URL API can pass filter values to a specific page in a Dossier created from crosstab report in library web (used in 1 specs)
192. [TC80480] Validate dossier information window rendering in Library Web (used in 1 specs)
193. [TC80481] Validate dossier information window manipulation in Library Web (used in 1 specs)
194. [TC80482] Validate dossier information window switching in Library Web (used in 1 specs)
195. [TC82133] Verify pass filter panel to target prompt on grid/viz (used in 1 specs)
196. [TC82134] Verify pass filter panel to target prompt from different filter setting (used in 1 specs)
197. [TC82135] Verify pass filter panel to target prompt from different filter type (used in 1 specs)
198. [TC82136] Verify pass filter panel to target prompt with prompt answer optional (used in 1 specs)
199. [TC82137] Verify pass filter panel to target prompt with prompt answer required (used in 1 specs)
200. [TC82138] Verify filter panel can be passed to target dossier as prompt answer - open in new window (used in 1 specs)
201. [TC82593] Verify embedded dossier with iframe in Library dossier (used in 1 specs)
202. [TC82595] Verify page linking when dossier page is loaded on demand (used in 1 specs)
203. [TC82766] Validate dossier switch page from text/image in panel stack in Library Web with load chapters on demand setting (used in 1 specs)
204. [TC82816] Verify page linking when dossier page is loaded on demand (used in 1 specs)
205. [TC82897_01] Add Data Tab in Dossier Creator (used in 1 specs)
206. [TC82897_02] Select Template Tab in Dossier Creator (used in 1 specs)
207. [TC82897_03] DE253419 in Dossier Creator (used in 1 specs)
208. [TC82897_04] Library Add Dossier Report Bar in Dossier Creator (used in 1 specs)
209. [TC82908_01] test page actions (used in 1 specs)
210. [TC82908_02] test selector when create from template (used in 1 specs)
211. [TC82908_03] search service is not ready (used in 1 specs)
212. [TC82908_04] select multiple dataset (used in 1 specs)
213. [TC82908_05] check library menu styling (used in 1 specs)
214. [TC83902] Verify pass prompt answer to itself (used in 1 specs)
215. [TC84218] Dossier toolbar UI when open dossier via url other than from library home (used in 1 specs)
216. [TC84221] Dossier toolbar UI when open dossier via library authoring page other than from library home (used in 1 specs)
217. [TC85331] Verify different in-canvas selectors types and properties can be passed to target dossier (used in 1 specs)
218. [TC85332] Verify different in-canvas selectors can be passed to target dossier by text/Image (used in 1 specs)
219. [TC85333] Verify different in-canvas selectors can be passed when open in new tab (used in 1 specs)
220. [TC86817] Check for Report reset from info window (used in 1 specs)
221. [TC88549] Dossier linking - Support bookmark - check bookmark when target dossier NOT in my library (used in 1 specs)
222. [TC89232] Dossier linking - Support bookmark - check bookmark when target dossier in my library (used in 1 specs)
223. [TC89233] Dossier linking - Support bookmark - bookmark manipulation on target dossier (used in 1 specs)
224. [TC89234] Dossier linking - Support bookmark - share dossier and share bookmark on target dossier (used in 1 specs)
225. [TC89248] Dossier linking - Support bookmark - check target dossier change will be temporarily kept and will not auto-saved (used in 1 specs)
226. [TC89295] Dossier linking - Support bookmark - mixed link (A- B Page1 - B Page2 - C) (used in 1 specs)
227. [TC89297] Dossier linking - Support bookmark - dossier linking with document in the journey (used in 1 specs)
228. [TC89311] Dossier linking - Support bookmark - dossier linking with report in the journey (used in 1 specs)
229. [TC89313] Dossier linking - Support bookmark - check x-func between bookmark and prompt on target dossier (used in 1 specs)
230. [TC89314] Dossier linking - Support bookmark - bookmark linking when open in new tab (used in 1 specs)
231. [TC89315] Dossier linking - Support bookmark - link to iteself (used in 1 specs)
232. [TC94178] Validate URL API pass Element filter in Library Web (used in 1 specs)
233. [TC94179] Validate URL API pass Value filter in Library Web (used in 1 specs)
234. [TC94180] Validate URL API pass Attribute/Metric selector in Library Web (used in 1 specs)
235. [TC94181] Validate URL API pass Panel selector in Library Web (used in 1 specs)
236. [TC94182_01] Validate URL API pass Value Parameter selector in Library Web - Text Parameter (used in 1 specs)
237. [TC94182_02] Validate URL API pass Value Parameter selector in Library Web - Reset (used in 1 specs)
238. [TC94185] Validate URL API pass Element List Parameter in Library Web (used in 1 specs)
239. [TC94311] Validate URL API pass Attribute filter in Library Web (used in 1 specs)
240. [TC95183_01] Validate URL API pass Element List Parameter Filter in Library Web (used in 1 specs)
241. [TC95183_02] Validate URL API pass Element List Parameter Filter in Library Web - select all/clear all (used in 1 specs)
242. [TC95365] Validate URL API pass Value Parameter Filter in Library Web (used in 1 specs)
243. [TC95366] Validate URL API pass Parameter Filter in Library Web - error handling (used in 1 specs)
244. [TC95367_01] Validate URL API pass Metric filter in Library Web - Metric Qualification (used in 1 specs)
245. [TC95367_02] Validate URL API pass Metric filter in Library Web - Metric Slider (used in 1 specs)
246. [TC95434_01] Validate X-func for URL API pass parameter filter in Library Web - Dynamic filter (used in 1 specs)
247. [TC95434_02] Validate X-func for URL API pass parameter filter in Library Web - Lock Filter (used in 1 specs)
248. [TC95434_03] Validate X-func for URL API pass parameter filter in Library Web - GDDE (used in 1 specs)
249. [TC95434_04] Validate X-func for URL API pass parameter filter in Library Web - Selection Required (used in 1 specs)
250. [TC96789_02] Validate URL API pass Value prompt in Library Web - Time, Numeric, Text Prompt (used in 1 specs)
251. [TC96789_03] Validate URL API pass Value prompt in Library Web - dynamic date (used in 1 specs)
252. [TC96789_04] Validate URL API pass Value prompt in Library Web - dynamic value (used in 1 specs)
253. [TC96789_05] Validate URL API pass Value prompt in Library Web - dashboard in library without default answer (used in 1 specs)
254. [TC96789_06] Validate URL API pass Value prompt in Library Web - dashboard in library with default answer (used in 1 specs)
255. [TC96789] Validate URL API pass Value prompt in Library Web - Big Decimal, Date (used in 1 specs)
256. [TC96806_01] Verify URL Generation in Library Web - Xfunc - Dynamic Selection (used in 1 specs)
257. [TC96806_02] Verify URL Generation in Library Web - Xfunc - Disable Interaction (used in 1 specs)
258. [TC96806_03] Verify URL Generation in Library Web - Xfunc - Selection Required (used in 1 specs)
259. [TC96806_04] Verify URL Generation in Library Web - Xfunc - Consolidation and Custom group (used in 1 specs)
260. [TC96806_05] Verify URL Generation in Library Web - Xfunc - Global Filter (used in 1 specs)
261. [TC96806_06] Verify URL Generation in Library Web - Xfunc - Auto Apply (used in 1 specs)
262. [TC96807] Verify Compatibility of URL Generation (used in 1 specs)
263. [TC96808] Verify internalization of URL Generation (used in 1 specs)
264. [TC97336_01] Verify cross project dossier linking (used in 1 specs)
265. [TC97336_02] Verify cross project dossier linking (used in 1 specs)
266. [TC97336_03] Verify cross project dossier linking (used in 1 specs)
267. [TC97336_04] Verify cross project dossier linking (used in 1 specs)
268. [TC97659] Verify URL Generation in Library Web - Panel Selector/AttributeMetric Selector (used in 1 specs)
269. [TC97660_01] Verify URL Generation in Library Web - Metric Filter/Selector - Metric Qualification (used in 1 specs)
270. [TC97660_02] Verify URL Generation in Library Web - Metric Filter/Selector - Metric Slider (used in 1 specs)
271. [TC97660_03] Verify URL Generation in Library Web - Metric Filter/Selector - Dynamic Link for Metric Qualification (used in 1 specs)
272. [TC97660_04] Verify URL Generation in Library Web - Metric Filter/Selector - Dynamic Link for Metric Slider (used in 1 specs)
273. [TC97663_01] Verify URL Generation in Library Web - Element List Parameter (used in 1 specs)
274. [TC97663_02] Verify URL Generation in Library Web - Element List Parameter - Dynamic Link (used in 1 specs)
275. [TC97664_01] Verify URL Generation in Library Web - Value Parameter (used in 1 specs)
276. [TC97664_02] Verify URL Generation in Library Web - Value Parameter - Dynamic Link (used in 1 specs)
277. [TC97696_02] Validate URL API pass Value prompt in PIP in Library Web - 2 nested PIP and filter (used in 1 specs)
278. [TC97696_03] Validate URL API pass Value prompt in PIP in Library Web - 3 nested PIP (used in 1 specs)
279. [TC97696] Validate URL API pass Value prompt in PIP in Library Web - 2 nested PIP (used in 1 specs)
280. [TC97704_02] Validate URL API pass Value prompt and filter in Library Web - prompt not required (used in 1 specs)
281. [TC97704_03] Validate URL API pass Value prompt and filter in Library Web - prompt required and discard current answer (used in 1 specs)
282. [TC97704_04] Validate URL API pass Value prompt and filter in Library Web - prompt required and display prompt and use current answer (used in 1 specs)
283. [TC97704_05] Validate URL API pass Value prompt and filter in Library Web - prompt required not display prompt and use current answer (used in 1 specs)
284. [TC97704_06] Validate URL API pass Value prompt and filter in Library Web - old filter format (used in 1 specs)
285. [TC97704_07] Validate URL API pass Value prompt and filter in Library Web - dashboard in library with default answer (used in 1 specs)
286. [TC97704] Validate URL API pass Value prompt and filter in Library Web (used in 1 specs)
287. [TC97705_02] Validate URL API pass Value prompt with different setting in Library Web - value prompt required (used in 1 specs)
288. [TC97705_03] Validate URL API pass Value prompt with different setting in Library Web - AE prompt required (used in 1 specs)
289. [TC97705] Validate URL API pass Value prompt with different setting in Library Web (used in 1 specs)
290. [TC97765_01] Verify url links on dashboard - open in new window (used in 1 specs)
291. [TC97765_02] Verify url links on dashboard - open in new window_link editor (used in 1 specs)
292. [TC97765_03] Verify url links on dashboard - open in new window - upgrading case (used in 1 specs)
293. [TC97765_04] Verify url link editor (used in 1 specs)
294. [TC97765_05] Verify contextual link editor with prompt (used in 1 specs)
295. [TC97765_06] Verify contextual link editor for cross projects (used in 1 specs)
296. [TC97794] Verify URL Generation Button is desabled when dashboard has not been saved (used in 1 specs)
297. [TC97814_02] Validate generate URL API pass Value prompt link Library Web - multi value prompt (used in 1 specs)
298. [TC97814_03] Validate generate URL API pass Value prompt link Library Web - dynamic link (used in 1 specs)
299. [TC97814_04] Validate generate URL API pass Value prompt link Library Web - edit without data (used in 1 specs)
300. [TC97814_05] Validate generate URL API pass Value prompt link Library Web - no value prompt (used in 1 specs)
301. [TC97814_06] Validate generate URL API pass Element List prompt link Library Web - Static Link (used in 1 specs)
302. [TC97814_07] Validate generate URL API pass Element List prompt link Library Web - Dynamic Link (used in 1 specs)
303. [TC97814_08] Validate URL API pass Element List prompt link Library Web - AE Setting (used in 1 specs)
304. [TC97814_09] Validate URL API pass Element List prompt link Library Web - OriginMessageID+Prompt+Filter (used in 1 specs)
305. [TC97814_10] Validate URL API pass Element List prompt link Library Web - Export (used in 1 specs)
306. [TC97814_11] Validate URL API pass Element List prompt link Library Web - Prompt In Prompt (used in 1 specs)
307. [TC97814] Validate generate URL API pass Value prompt link Library Web - PIP with not display prompt (used in 1 specs)
308. [TC97826_01] Validate URL API pass Attribute filter in Library Web (used in 1 specs)
309. [TC97894_02] Validate Function of Image Alternative Text in Library Web - Metric Thresholds - Authoring (used in 1 specs)
310. [TC97894_03] Validate Function of Image Alternative Text in Library Web - Attribute Thresholds - Authoring (used in 1 specs)
311. [TC97894_04] Validate Function of Image Alternative Text in Library Web - Thresholds break image - Authoring (used in 1 specs)
312. [TC97894_05] Validate Function of Image Alternative Text in Library Web - Image - Consumption (used in 1 specs)
313. [TC97894_06] Validate Function of Image Alternative Text in Library Web - normalgrid - Consumption (used in 1 specs)
314. [TC97894_07] Validate Function of Image Alternative Text in Library Web - grid swap - Consumption (used in 1 specs)
315. [TC97894_08] Validate Function of Image Alternative Text in Library Web - grid outline - Consumption (used in 1 specs)
316. [TC97894_09] Validate Function of Image Alternative Text in Library Web - grid outline swap - Consumption (used in 1 specs)
317. [TC97894_10] Validate Function of Image Alternative Text in Library Web - compound grid - Consumption (used in 1 specs)
318. [TC97894_11] Validate Function of Image Alternative Text in Library Web - AG grid - Consumption (used in 1 specs)
319. [TC97894] Validate Function of Image Alternative Text in Library Web - Image - Authoring (used in 1 specs)
320. [TC98700_02] Verify page linking in Library from different source - from image (used in 1 specs)
321. [TC98700_03] Verify page linking in Library from different source - from grid (used in 1 specs)
322. [TC98700_04] Verify page linking in Library from different source - from viz (used in 1 specs)
323. [TC98700] Verify page linking in Library from different source - from text (used in 1 specs)
324. [TC99020_01] create blank dashboard and set as template (used in 1 specs)
325. [TC99020_02] Create dossier based on blank template (used in 1 specs)
326. [TC99020_03] Create dossier based on default template (used in 1 specs)
327. [TC99020_04] Create dashboard based on dataset (used in 1 specs)
328. [TC99020_05] Create dossier based on report (used in 1 specs)
329. [TC99020_06] Create dossier based on a user template (used in 1 specs)
330. [TC99020_07] Create dossier based on dataset + report + user template (used in 1 specs)
331. [TC99020_08] Open a template dossier and unset the template (used in 1 specs)
332. [TC99020_09] Create a dossier based on dataset to be republished (used in 1 specs)
333. [TC99020_10] Select more than 10 datasets to create dossier (used in 1 specs)
334. [TC99020_11] Update cover image in share menu (used in 1 specs)
335. [TC99020_12] Check template info when DI triggered (used in 1 specs)
336. [TC99021_01] user without set template privilege (used in 1 specs)
337. [TC99021_02] user no read acl to default template (used in 1 specs)
338. [TC99021_03] user no write acl to dashboard (used in 1 specs)
339. [TC99021_04] Project level set template privilege check (used in 1 specs)
340. [TC99021_05] use acl for datasets (used in 1 specs)
341. [TC99021_06] use and execute acl for report (used in 1 specs)
342. [TC99022_01] dashboard creator in Chinese (used in 1 specs)
343. [TC99022_02] Create dashboard by template in Chinese (used in 1 specs)
344. [TC99022_03] Set template menu in Chinese (used in 1 specs)
345. [TC99022_04] search service is not ready (used in 1 specs)
346. [TC99138] Custom No Data Message E2E (used in 1 specs)
347. [TC99378_1] Dossier | No execute access on Text consumption mode (used in 1 specs)
348. [TC99378_10] Dossier | No execute access on Text with Filtered Target PS with CGB desired status consumption mode (used in 1 specs)
349. [TC99378_11] Dossier | No execute access on Text edit mode (used in 1 specs)
350. [TC99378_12] Dossier | No execute access on rich text and sort edit mode (used in 1 specs)
351. [TC99378_13] Dossier | No execute access on HTML and Image edit mode (used in 1 specs)
352. [TC99378_14] Dossier | No execute access on URL link edit mode (used in 1 specs)
353. [TC99378_15] Dossier | No execute access on Conditional Display edit mode (used in 1 specs)
354. [TC99378_16] Dossier | No execute access on Filtered Target PS edit mode (used in 1 specs)
355. [TC99378_17] Dossier | No execute access on the candidates of the object parameter (used in 1 specs)
356. [TC99378_2] Dossier | No execute access on Rich Text consumption mode (used in 1 specs)
357. [TC99378_3] Dossier | No execute access on HTML in consumption mode (used in 1 specs)
358. [TC99378_4] Dossier | No execute access on Image consumption mode (used in 1 specs)
359. [TC99378_5] Dossier | No execute access on URL consumption mode (used in 1 specs)
360. [TC99378_6] Dossier | No execute access on URL Image consumption mode (used in 1 specs)
361. [TC99378_7] Dossier | No execute access on Text with Conditional Display consumption mode (used in 1 specs)
362. [TC99378_8] Dossier | No execute access on Text with Filtered Target PS with unset status consumption mode (used in 1 specs)
363. [TC99378_9] Dossier | No execute access on Text with Filtered Target PS with chosen status consumption mode (used in 1 specs)
364. [TC99388_1] Dashboard | Create a Blank Dashboard (used in 1 specs)
365. [TC99388_2] Dashboard | Create a Dashboard with dataset (used in 1 specs)
366. [TC99388_3] Dashboard | Create a Dashboard on Custom Template (used in 1 specs)
367. [TC99644_01] Validate functionality of Selector Panel in authoring - Create Selector Panel (used in 1 specs)
368. [TC99644_02] Validate functionality of Selector Panel in authoring - Create selector window (used in 1 specs)
369. [TC99644_03] Validate functionality of Selector Panel in authoring - Select Target (used in 1 specs)
370. [TC99644_04] Validate functionality of Selector Panel in authoring - context menu (used in 1 specs)
371. [TC99644_05] Validate functionality of Selector Panel in authoring - Format Panel (used in 1 specs)
372. [TC99644_06] Validate functionality of Selector Panel in authoring - update automatically (used in 1 specs)
373. [TC99644_07] Validate X-functionality of Selector Panel in authoring - Pause Mode (used in 1 specs)
374. [TC99653_01] Validate functionality of Selector Panel in Consumption - AM Selector (used in 1 specs)
375. [TC99653_02] Validate functionality of Selector Panel in Consumption - Object Parameter (used in 1 specs)
376. [TC99653_03] Validate functionality of Selector Panel in Consumption - Parameter Filter - Number (used in 1 specs)
377. [TC99653_04] Validate functionality of Selector Panel in Consumption - Parameter Filter - Big Decimal (used in 1 specs)
378. [TC99653_05] Validate functionality of Selector Panel in Consumption - Parameter Filter - Text (used in 1 specs)
379. [TC99653_06] Validate functionality of Selector Panel in Consumption - Parameter Filter - DateTime (used in 1 specs)
380. [TC99653_07] Validate functionality of Selector Panel in Consumption - Parameter Filter - Element List (used in 1 specs)
381. [TC99653_08] Validate functionality of Selector Panel in Consumption - Parameter Filter - Element List Settings (used in 1 specs)
382. [TC99653_09] Validate functionality of Selector Panel in Consumption - Undo/Redo (used in 1 specs)
383. [TC99653_10] Validate functionality of Selector Panel in Consumption - Filter (used in 1 specs)
384. AltTextinAuthoring (used in 1 specs)
385. AltTextinConsumption (used in 1 specs)
386. Bookmark (used in 1 specs)
387. CancelExecution (used in 1 specs)
388. Centralized Bookmark (used in 1 specs)
389. Create a New Dashboard to check execution mode (used in 1 specs)
390. Custom No Data Str (used in 1 specs)
391. Dossier General (used in 1 specs)
392. Dossier Info Window (used in 1 specs)
393. Dossier Linking (used in 1 specs)
394. Dossier Linking - CrossProject (used in 1 specs)
395. Dossier Linking - Open in new tab (used in 1 specs)
396. Dossier Linking - Pass Filter (used in 1 specs)
397. Dossier Linking - Pass Filter Panel (used in 1 specs)
398. Dossier Linking - Pass InCanvas Selector (used in 1 specs)
399. Dossier Linking - Pass Prompt (used in 1 specs)
400. Dossier Linking - support bookmark (used in 1 specs)
401. Dossier Linking Editor (used in 1 specs)
402. Dossier Panel Stack (used in 1 specs)
403. Favorites (used in 1 specs)
404. HTML Container (used in 1 specs)
405. No Execute Access on Text (used in 1 specs)
406. Object Sizing (used in 1 specs)
407. Page Linking (used in 1 specs)
408. Reset (used in 1 specs)
409. Reset - Reset from Info Window (used in 1 specs)
410. Selector Panel Authoring (used in 1 specs)
411. Selector Panel Consumption - X func (used in 1 specs)
412. Show Data (used in 1 specs)
413. Table of Contents Menu (used in 1 specs)
414. Test Create Dashboard E2E (used in 1 specs)
415. Test Create Dashboard Panel (used in 1 specs)
416. Test Template by i18n (used in 1 specs)
417. Test Template by privilege and acl (used in 1 specs)
418. Test Template XFunc (used in 1 specs)
419. Url API pass Element List Prompt (used in 1 specs)
420. Url API pass Filter (used in 1 specs)
421. Url API pass Parameter Filter (used in 1 specs)
422. Url API pass Parameter Filter - X func (used in 1 specs)
423. Url API pass Prompt (used in 1 specs)
424. Url API pass Prompt and Filter (used in 1 specs)
425. Url API pass Prompt Generate Link (used in 1 specs)
426. Url API pass Prompt XFun (used in 1 specs)
427. Url API pass Selector (used in 1 specs)
428. URL Link - Open in new tab (used in 1 specs)
429. Viz highlight (used in 1 specs)
430. X-Func for Base View vs Last View (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getTitleBarContainer -- frequency: 406
2. getGridContainer -- frequency: 258
3. getGridCellByPosition -- frequency: 128
4. getInsertDropdown -- frequency: 118
5. getInsertTextBox -- frequency: 106
6. getDossierView -- frequency: 73
7. getInsertSlider -- frequency: 62
8. getBulkTxnGridCellByPosition -- frequency: 60
9. getInsertDropdownOverlay -- frequency: 58
10. {expected} -- frequency: 55
11. {actual} -- frequency: 53
12. getAllAgGridObjectCount -- frequency: 52
13. getPromptByName -- frequency: 51
14. getCSSProperty -- frequency: 46
15. getTargetButton -- frequency: 46
16. getTransactionSlider -- frequency: 46
17. getManualInputCell -- frequency: 40
18. getClipboardText -- frequency: 37
19. getAgGridColsContainer -- frequency: 36
20. getComputedStyle -- frequency: 34
21. getDDICcandidatePicker -- frequency: 34
22. getPopup -- frequency: 34
23. getDDICcandidatePickerPullDownOption -- frequency: 32
24. mstrmojo Doc Textfield -- frequency: 32
25. getConfirmationPopup -- frequency: 30
26. getActiveTxnTab -- frequency: 28
27. getDatasetRowCount -- frequency: 28
28. getPulldownOptionCount -- frequency: 28
29. getTitleBarSetting -- frequency: 28
30. getTitleButton -- frequency: 26
31. getContextMenuOption -- frequency: 24
32. getCurrentSelectionInDropdown -- frequency: 24
33. getDDICPullDownText -- frequency: 24
34. getAgGridViewPort -- frequency: 22
35. getInsertSliderWithoutClick -- frequency: 22
36. getOneRowData -- frequency: 22
37. getInputField -- frequency: 20
38. getViewFilterItemText -- frequency: 20
39. getAllCountFromTitle -- frequency: 19
40. getSelectedItemsText -- frequency: 19
41. getTextFieldByKey -- frequency: 19
42. getRowsCount -- frequency: 16
43. getTextNodeByText -- frequency: 16
44. getTransactionDialogText -- frequency: 16
45. getAlertEditorWithTitle -- frequency: 14
46. getTitle -- frequency: 14
47. getFavoritesCountFromTitle -- frequency: 13
48. getActionName -- frequency: 12
49. getInputNumField -- frequency: 12
50. getSelectedDrodownItem -- frequency: 12
51. getSliderWidth -- frequency: 12
52. getPanel -- frequency: 11
53. getAllInsertDropdownOptions -- frequency: 10
54. getCurrentPage -- frequency: 10
55. getSourceButton -- frequency: 10
56. getTitleStyle -- frequency: 10
57. getNavigationBar -- frequency: 9
58. getBadInput -- frequency: 8
59. getBulkEditSubmitButton -- frequency: 8
60. getBulkEditToolbar -- frequency: 8
61. getButtonFormatPopup -- frequency: 8
62. getDossierImageContainer -- frequency: 8
63. getSettingMenu -- frequency: 8
64. getTopBarInTransactionEditor -- frequency: 8
65. getVisualizationTitleBarRoot -- frequency: 8
66. getBookmarkListNames -- frequency: 7
67. getDropdownSelectedText -- frequency: 7
68. getSelectedTabName -- frequency: 7
69. getSliderText -- frequency: 7
70. getThresholdImageURL -- frequency: 7
71. D7 F6 F0 -- frequency: 6
72. getAllThresholdImageAlt -- frequency: 6
73. getBulkEditSubmitButtonEnabled -- frequency: 6
74. getCreateNewDossierPanel -- frequency: 6
75. getDropdownInsertTextBox -- frequency: 6
76. getErrorInputNumField -- frequency: 6
77. getHTMLNode -- frequency: 6
78. getOneColumnData -- frequency: 6
79. getPageTitleText -- frequency: 6
80. getPromprtEditorSelectableMode -- frequency: 6
81. getRowDataInAddDataTab -- frequency: 6
82. getSelectedTemplateNameInGridView -- frequency: 6
83. getTextNodeByKey -- frequency: 6
84. getVIDoclayout -- frequency: 6
85. getVisualizationSubTitleBarRoot -- frequency: 6
86. getFilterPanelDropdown -- frequency: 5
87. getLinkIconByTextNode -- frequency: 5
88. getNoBookmarks -- frequency: 5
89. getNoDataResetBtn -- frequency: 5
90. getPanelByID -- frequency: 5
91. getTemplateIcon -- frequency: 5
92. getThresholdImageAlt -- frequency: 5
93. getVizErrorContent -- frequency: 5
94. 5 C388 C -- frequency: 4
95. ABABAB -- frequency: 4
96. div.ag-header-row.ag-header-row-column -- frequency: 4
97. div.mstrmojo-Button-text=SimpleCase -- frequency: 4
98. FCC95 A -- frequency: 4
99. getButton -- frequency: 4
100. getCertifiedIcon -- frequency: 4
101. getCheckedDeleteRow -- frequency: 4
102. getControlTypeTextForPython -- frequency: 4
103. getCreateNewDossierSelectTemplateInfoPanel -- frequency: 4
104. getDatasetNamesInDatasetsPanel -- frequency: 4
105. getDossierCertifiedIconInTitle -- frequency: 4
106. getDossierTemplateIconInTitle -- frequency: 4
107. getEnterTXNModeBtn -- frequency: 4
108. getFilterTypeDropDown -- frequency: 4
109. getHeader -- frequency: 4
110. getImageBoxByIndex -- frequency: 4
111. getImageNodeByKey -- frequency: 4
112. getInputValuesWithConfigurations -- frequency: 4
113. getInsertContainer -- frequency: 4
114. getMainInfo -- frequency: 4
115. getManualInputErrorCell -- frequency: 4
116. getNumberOfRows -- frequency: 4
117. getSaveChangesDialog -- frequency: 4
118. getShareDossierDialog -- frequency: 4
119. getSubMenuContainer -- frequency: 4
120. getTextNode -- frequency: 4
121. getTocPanel -- frequency: 4
122. getTooltipsText -- frequency: 4
123. getUpdatedCell -- frequency: 4
124. getVisualizationTitleBarTextArea -- frequency: 4
125. getAddBookmarkErrorMsg -- frequency: 3
126. getDashbaordExecutionModeDropdown -- frequency: 3
127. getDashboardExecutionMode -- frequency: 3
128. getDossierTitleText -- frequency: 3
129. getErrorDialogMainContainer -- frequency: 3
130. getRsdGridByKey -- frequency: 3
131. getSliderSelectedText -- frequency: 3
132. getTemplateInfoData -- frequency: 3
133. getTemplateListHeaders -- frequency: 3
134. getTemplateNamesInGridView -- frequency: 3
135. pdf -- frequency: 3
136. 38 AE6 F -- frequency: 2
137. 834 FBD -- frequency: 2
138. BCB1 E2 -- frequency: 2
139. button6 -- frequency: 2
140. D76322 -- frequency: 2
141. DF77 A8 -- frequency: 2
142. div.mstrmojo-Label.dont-show-popup-text -- frequency: 2
143. div.mtxt=Action Button -- frequency: 2
144. Dossier View -- frequency: 2
145. F56 E21 -- frequency: 2
146. getAccountDropdown -- frequency: 2
147. getActiveView -- frequency: 2
148. getAddButton -- frequency: 2
149. getAdvThresholdDetail -- frequency: 2
150. getAnswerPromptOptionsText -- frequency: 2
151. getAttrOrMetricSelectorContainerUsingId -- frequency: 2
152. getBulkTxnGridCellErrorByPosition -- frequency: 2
153. getButtonbarByName -- frequency: 2
154. getButtonByName -- frequency: 2
155. getCellByTypeAndInputValue -- frequency: 2
156. getConditionalDisplayDialog -- frequency: 2
157. getConditionTitle -- frequency: 2
158. getConfirmContainer -- frequency: 2
159. getConfirmDialog -- frequency: 2
160. getConfirmSwitchProjectPopup -- frequency: 2
161. getContextMenuOptionsList -- frequency: 2
162. getContextuallinkEditor -- frequency: 2
163. getControlTypeSettingErrorButton -- frequency: 2
164. getCurrentProject -- frequency: 2
165. getDashboardPropertiesEditor -- frequency: 2
166. getDatasetPanel -- frequency: 2
167. getDDICdropdownElements -- frequency: 2
168. getDeleteConfirmMsg -- frequency: 2
169. getDossierChapterTooltip -- frequency: 2
170. getDossierPageTooltip -- frequency: 2
171. getEditGridCellAtPosition -- frequency: 2
172. getElementOrValueFilterByTitle -- frequency: 2
173. getEmptyLibraryMessage -- frequency: 2
174. getErrorContainer -- frequency: 2
175. getFavoriteBookmarkNumberFromTitle -- frequency: 2
176. getFavoriteTooltipText -- frequency: 2
177. getFilterMainPanel -- frequency: 2
178. getGridCellTextByPosition -- frequency: 2
179. getInlineErrorMessage -- frequency: 2
180. getInlineInsertContainer -- frequency: 2
181. getInputConfig -- frequency: 2
182. getInsertInputElements -- frequency: 2
183. getItemInSuggestionList -- frequency: 2
184. getLibraryIcon -- frequency: 2
185. getMappingEditorTableColumns -- frequency: 2
186. getMappingEditorTableColumnsAndInputValues -- frequency: 2
187. getMenuBarSubItemByName -- frequency: 2
188. getMojoLoadingIndicator -- frequency: 2
189. getNoDataTextCount -- frequency: 2
190. getPreviewImageInAdvThresholdEditor -- frequency: 2
191. getPromptEditor -- frequency: 2
192. getRightClickMenu -- frequency: 2
193. getRowDataInTemplateListView -- frequency: 2
194. getSecondaryPanel -- frequency: 2
195. getSelectedNamespace -- frequency: 2
196. getSelectedSearchboxItem -- frequency: 2
197. getSnapshotNames -- frequency: 2
198. getSqlText -- frequency: 2
199. getTableColumnsAndInputValues -- frequency: 2
200. getTabScreenshot -- frequency: 2
201. getText -- frequency: 2
202. getTitleFontColor -- frequency: 2
203. getTitleFontFamily -- frequency: 2
204. getTitleFontSize -- frequency: 2
205. getTOCPanel -- frequency: 2
206. getTotalBookmarkNumber -- frequency: 2
207. getTransactionDialogTextHeight -- frequency: 2
208. getURLLinkInLinkEditor -- frequency: 2
209. getVisualizationMenuButton -- frequency: 2
210. getVIVizPanel -- frequency: 2
211. Library Icon -- frequency: 2
212. mstrmojo Label.non Execute Msg -- frequency: 2
213. Page Loading Icon -- frequency: 2
214. Share Panel -- frequency: 2
215. Success Toast -- frequency: 2
216. Success Toast Close Button -- frequency: 2
217. Viz View -- frequency: 2
218. Active Page Container -- frequency: 1
219. Add New Button Disabled -- frequency: 1
220. Add To Library -- frequency: 1
221. Add User Group Search Area -- frequency: 1
222. Apply Button -- frequency: 1
223. Auto Dashboard Welcome Popup -- frequency: 1
224. Bookmark Icon -- frequency: 1
225. Bookmark Icon Disabled -- frequency: 1
226. Bookmark Spinner -- frequency: 1
227. Cancel Button -- frequency: 1
228. Cancel Execution Button -- frequency: 1
229. Certified Icon -- frequency: 1
230. Change ACLButton -- frequency: 1
231. Change ACLDrop Down Menu -- frequency: 1
232. Change View Mode Button -- frequency: 1
233. Close Dossier Button -- frequency: 1
234. Close Icon -- frequency: 1
235. Comments Icon -- frequency: 1
236. Confirm Dialog -- frequency: 1
237. Confirm Reset Button -- frequency: 1
238. Consumption Horizontal TOCBar -- frequency: 1
239. Content In Pin In Teams Dialog -- frequency: 1
240. Context Menu -- frequency: 1
241. Copied Tooltip -- frequency: 1
242. Cover Image -- frequency: 1
243. csv -- frequency: 1
244. Dashboard Menu Bar Container -- frequency: 1
245. Dashboard Properties Editor -- frequency: 1
246. Dataset Panel -- frequency: 1
247. Direct Save Dossier Button -- frequency: 1
248. Disabled Apply Button -- frequency: 1
249. Disabled Channel Selector -- frequency: 1
250. Dossier Link Nav -- frequency: 1
251. Dossier Page Not Load Indicator -- frequency: 1
252. Dossier Title In Mobile View -- frequency: 1
253. Dossier Title Text -- frequency: 1
254. Dossier View Mode Icon -- frequency: 1
255. Download Button -- frequency: 1
256. Duplicate Button -- frequency: 1
257. Edit Icon -- frequency: 1
258. Existing User Group Search Box -- frequency: 1
259. Favorite Icon -- frequency: 1
260. FF3729 -- frequency: 1
261. Freeform Layout Page -- frequency: 1
262. Frequently Invited Panel -- frequency: 1
263. getAddButtonColor -- frequency: 1
264. getAllSortOptionsText -- frequency: 1
265. getBookmarkListNumberFromTitle -- frequency: 1
266. getCertifiedControl -- frequency: 1
267. getCreateDossierTabNames -- frequency: 1
268. getCreateNewDossierPanelFooter -- frequency: 1
269. getCreateNewDossierTitleBar -- frequency: 1
270. getCurrentSelectionText -- frequency: 1
271. getDocView -- frequency: 1
272. getDossierContextMenu -- frequency: 1
273. getDossierContextMenuItem -- frequency: 1
274. getDossierCreatorErrorMessage -- frequency: 1
275. getEmptySearchImage -- frequency: 1
276. getErrCount -- frequency: 1
277. getErrorDialogue -- frequency: 1
278. getFormatDetail -- frequency: 1
279. getGhostImageContainerByIndex -- frequency: 1
280. getIncanvasSelectorByKey -- frequency: 1
281. getLayersPanel -- frequency: 1
282. getLeftNavBar -- frequency: 1
283. getMenuContainer -- frequency: 1
284. getPanelPadding -- frequency: 1
285. getProjectPicker -- frequency: 1
286. getRowTextInTemplateList -- frequency: 1
287. getSaveChangesCheckbox -- frequency: 1
288. getSelectedDatasetsCount -- frequency: 1
289. getSelectedRadioButtonItem -- frequency: 1
290. getSelectedRadioButtonItemText -- frequency: 1
291. getSeletedItemsCount -- frequency: 1
292. getSwitchProjectLoadingBtn -- frequency: 1
293. getTable -- frequency: 1
294. getTemplateItemNameInGridView -- frequency: 1
295. getTemplateItemsCntInGridView -- frequency: 1
296. getTOCPin -- frequency: 1
297. getTxtTitle_Chapter -- frequency: 1
298. getTxtTitle_Dossier -- frequency: 1
299. getVizDossierLinkingTooltip -- frequency: 1
300. getWarningMessageText -- frequency: 1
301. Hamburger Icon -- frequency: 1
302. Header Pin In Teams Dialog -- frequency: 1
303. Home Icon -- frequency: 1
304. Horizontal Toc Menu Content -- frequency: 1
305. Info Window Loading Icon -- frequency: 1
306. Invite Detail Panel -- frequency: 1
307. Invite LIst Search Results -- frequency: 1
308. Invite Search Box -- frequency: 1
309. Label In Title -- frequency: 1
310. Left Nav Bar -- frequency: 1
311. Manage Access Dialog -- frequency: 1
312. Manage Access Dialog Content -- frequency: 1
313. Manage Access Dialog Header -- frequency: 1
314. Manage Access Editor -- frequency: 1
315. Manage Access Editor Content View -- frequency: 1
316. Max Restore Btn -- frequency: 1
317. Menu Container -- frequency: 1
318. Mobile TOC -- frequency: 1
319. Name And Time -- frequency: 1
320. Name And Time In Share Dossier Dialog -- frequency: 1
321. Navigation Bar -- frequency: 1
322. Navigation Bar Collapsed Icon -- frequency: 1
323. New Bookmark Reminder -- frequency: 1
324. No Bookmarks -- frequency: 1
325. No Privillege Tooltip -- frequency: 1
326. Notification -- frequency: 1
327. Order Dropdown List -- frequency: 1
328. Page Indicator -- frequency: 1
329. Page Size Button -- frequency: 1
330. Page Title -- frequency: 1
331. Panel -- frequency: 1
332. Panel Stack Header -- frequency: 1
333. Panel Stack Left Arrow -- frequency: 1
334. Pin Bot Toast -- frequency: 1
335. Pin In Pin To Team Dialog -- frequency: 1
336. Pin In Teams Dialog -- frequency: 1
337. Query Details Content -- frequency: 1
338. Redo Icon -- frequency: 1
339. Refresh Button On Toolbar -- frequency: 1
340. Reset Button -- frequency: 1
341. Reset Icon -- frequency: 1
342. Revert Filter -- frequency: 1
343. Right Nav Bar -- frequency: 1
344. Run In Background Button -- frequency: 1
345. Saa SLibrary Icon -- frequency: 1
346. Save And Open Dropdown Item -- frequency: 1
347. Save As Dossier Button -- frequency: 1
348. Save As Editor -- frequency: 1
349. Save Changes Dialog -- frequency: 1
350. Save Dossier Button -- frequency: 1
351. Save Dossier Dropdown Item -- frequency: 1
352. Save Dossier Folder Button -- frequency: 1
353. Save In Progress Box -- frequency: 1
354. Search List -- frequency: 1
355. Search Loading Spinner -- frequency: 1
356. Search Suggest List -- frequency: 1
357. Select Dataset Diag -- frequency: 1
358. Selected Favorites Icon -- frequency: 1
359. Share Dossier Dialog -- frequency: 1
360. Share Dossier Panel -- frequency: 1
361. Share Icon -- frequency: 1
362. Show Page Indicator -- frequency: 1
363. Sort By Dropdown List -- frequency: 1
364. Sort Editor -- frequency: 1
365. Sub Menu Container -- frequency: 1
366. Subscribe Details Panel -- frequency: 1
367. Success Icon -- frequency: 1
368. Team Selector -- frequency: 1
369. Template Icon -- frequency: 1
370. Text Fields -- frequency: 1
371. Title Max Restore Btn -- frequency: 1
372. Toaster Label -- frequency: 1
373. Toc Header -- frequency: 1
374. Toc Info -- frequency: 1
375. Toc Panel -- frequency: 1
376. TOCIcon -- frequency: 1
377. TOCPanel -- frequency: 1
378. TOCTitle Name -- frequency: 1
379. Toggle Bar -- frequency: 1
380. Tooltip -- frequency: 1
381. Undo Icon -- frequency: 1
382. View In Tab Button -- frequency: 1
383. Visualization Menu Button -- frequency: 1
384. xlsx -- frequency: 1

## Key Actions

- `getTitleBarContainer()` -- used in 406 specs
- `openPageFromTocMenu({ chapterName, pageName })` -- used in 297 specs
- `getCSSProperty()` -- used in 294 specs
- `getGridContainer()` -- used in 258 specs
- `getText()` -- used in 245 specs
- `firstElmOfHeader()` -- used in 212 specs
- `isDisplayed()` -- used in 199 specs
- `waitForDossierLoading()` -- used in 171 specs
- `openDossier()` -- used in 169 specs
- `waitForAuthoringPageLoading()` -- used in 139 specs
- `waitForCurtainDisappear()` -- used in 136 specs
- `clickBulkTxnGridCellByPosition()` -- used in 130 specs
- `getGridCellByPosition()` -- used in 128 specs
- `goToPage({ chapterName, pageName })` -- used in 125 specs
- `toggleViewSummary()` -- used in 125 specs
- `goBackFromDossierLink()` -- used in 123 specs
- `getInsertDropdown()` -- used in 120 specs
- `linkToTargetByGridContextMenu()` -- used in 117 specs
- `switchToTab()` -- used in 109 specs
- `filterItems()` -- used in 108 specs
- `reprompt()` -- used in 108 specs
- `getInsertTextBox()` -- used in 106 specs
- `goToLibrary()` -- used in 106 specs
- `editDossierByUrl()` -- used in 105 specs
- `isEditorOpen()` -- used in 100 specs
- `isExisting()` -- used in 100 specs
- `closeTab()` -- used in 91 specs
- `sleep()` -- used in 91 specs
- `checkListSummary()` -- used in 89 specs
- `url()` -- used in 84 specs
- `title()` -- used in 79 specs
- `waitForSummaryItem()` -- used in 79 specs
- `run()` -- used in 78 specs
- `createByTitle()` -- used in 76 specs
- `login()` -- used in 75 specs
- `getDossierView()` -- used in 73 specs
- `isBackIconPresent()` -- used in 73 specs
- `log()` -- used in 73 specs
- `openContextMenu()` -- used in 72 specs
- `setInputNumField()` -- used in 70 specs
- `openDossierById()` -- used in 69 specs
- `openPanel()` -- used in 67 specs
- `setManualInputCell()` -- used in 66 specs
- `getAttribute()` -- used in 62 specs
- `getInsertSlider()` -- used in 62 specs
- `stringify()` -- used in 61 specs
- `cancelEditor()` -- used in 60 specs
- `getBulkTxnGridCellByPosition()` -- used in 60 specs
- `getInsertDropdownOverlay()` -- used in 58 specs
- `waitLoadingDataPopUpIsNotDisplayed()` -- used in 56 specs
- `clickButton(btnName)` -- used in 54 specs
- `setDropdown()` -- used in 54 specs
- `clickDossierPanelStackSwitchTab(text)` -- used in 53 specs
- `getAllAgGridObjectCount()` -- used in 52 specs
- `getPromptByName()` -- used in 51 specs
- `checkTextSummary()` -- used in 50 specs
- `waitForEditor()` -- used in 49 specs
- `actionOnSubmenuNoContinue(subOption)` -- used in 48 specs
- `clickOnBulkEditSubmitButton()` -- used in 48 specs
- `hasDDICcandidatePicker()` -- used in 48 specs
- `selectContextMenuOption()` -- used in 47 specs
- `actionOnMenubar(menuOption)` -- used in 46 specs
- `applyTheme()` -- used in 46 specs
- `clickControlTypeSettingButton()` -- used in 46 specs
- `getTargetButton()` -- used in 46 specs
- `getTransactionSlider()` -- used in 46 specs
- `isResetDisabled()` -- used in 46 specs
- `selectConfirmationPopupOption()` -- used in 46 specs
- `typeInsertTextBox()` -- used in 46 specs
- `clickDropdown()` -- used in 45 specs
- `getValue()` -- used in 45 specs
- `searchTheme()` -- used in 44 specs
- `clickTextfieldByTitle(text)` -- used in 43 specs
- `chooseInsertDropdownOption()` -- used in 42 specs
- `navigateLink()` -- used in 42 specs
- `closePanel()` -- used in 40 specs
- `getManualInputCell()` -- used in 40 specs
- `openDefaultApp()` -- used in 40 specs
- `openFilterPanel()` -- used in 40 specs
- `waitForConsumptionModeToRefresh()` -- used in 40 specs
- `customCredentials()` -- used in 39 specs
- `clickAddValueButton()` -- used in 38 specs
- `enterBulkTxnMode()` -- used in 38 specs
- `pageTitle()` -- used in 38 specs
- `clickGenerateLinkButton()` -- used in 37 specs
- `clickURLGeneratorButton()` -- used in 37 specs
- `getClipboardText()` -- used in 37 specs
- `clickContainer()` -- used in 36 specs
- `execute()` -- used in 36 specs
- `getAgGridColsContainer()` -- used in 36 specs
- `getDDICcandidatePickerPullDownOption()` -- used in 36 specs
- `getUrl()` -- used in 36 specs
- `isAddToLibraryDisplayed()` -- used in 35 specs
- `clickVisualizationTitle()` -- used in 34 specs
- `getComputedStyle()` -- used in 34 specs
- `getDDICcandidatePicker()` -- used in 34 specs
- `getPopup()` -- used in 34 specs
- `openTitleContainerFormatPanel()` -- used in 34 specs
- `clickButtonByName()` -- used in 33 specs
- `clickButtonFromToolbar()` -- used in 33 specs
- `clickShowDataCloseButton()` -- used in 33 specs
- `openViewFilterContainer()` -- used in 33 specs
- `checkEmptySummary()` -- used in 32 specs
- `closeViewFilterContainer()` -- used in 31 specs
- `selectReset()` -- used in 31 specs
- `selectShowDataOnVisualizationMenu()` -- used in 31 specs
- `addNewBookmark(name)` -- used in 30 specs
- `getConfirmationPopup()` -- used in 30 specs
- `inputInsertTextBoxWithEnter()` -- used in 30 specs
- `createNewDossier()` -- used in 29 specs
- `editDossierWithPageKeyByUrl()` -- used in 29 specs
- `isVizDisplayed()` -- used in 29 specs
- `selectFilterItems()` -- used in 29 specs
- `selectItem()` -- used in 29 specs
- `switchToFilterPanel()` -- used in 29 specs
- `getActiveTxnTab()` -- used in 28 specs
- `getDatasetRowCount()` -- used in 28 specs
- `getPulldownOptionCount()` -- used in 28 specs
- `getTitleBarSetting()` -- used in 28 specs
- `InputValueInBulkTxnGridCell()` -- used in 28 specs
- `isControlTypeAvailable()` -- used in 28 specs
- `keys()` -- used in 28 specs
- `clickHeaderElement()` -- used in 26 specs
- `clickOnPage()` -- used in 26 specs
- `getTitleButton()` -- used in 26 specs
- `selectTxnTab()` -- used in 26 specs
- `switchProjectByName()` -- used in 26 specs
- `waitForSliderDisappear()` -- used in 26 specs
- `dragSlider()` -- used in 25 specs
- `selectGridContextMenuOption()` -- used in 25 specs
- `viewAllFilterItems()` -- used in 25 specs
- `applyBookmark(name, sectionName = 'MY BOOKMARKS', option = { isWait: true })` -- used in 24 specs
- `clickContainerByScript()` -- used in 24 specs
- `doubleClickGridCellByPosition()` -- used in 24 specs
- `findSelectorByName()` -- used in 24 specs
- `getContextMenuOption()` -- used in 24 specs
- `getCurrentSelectionInDropdown()` -- used in 24 specs
- `getDDICPullDownText()` -- used in 24 specs
- `moveMouse()` -- used in 24 specs
- `navigateLinkInCurrentPage()` -- used in 24 specs
- `openContextMenuItemForCellAtPosition()` -- used in 24 specs
- `openSecondaryPanel()` -- used in 24 specs
- `toggleTitleButtons()` -- used in 24 specs
- `confirmReset(isPrompted)` -- used in 23 specs
- `openDossierInfoWindow()` -- used in 23 specs
- `selectItemByText()` -- used in 23 specs
- `checkQualSummary()` -- used in 22 specs
- `clickBuiltInColor()` -- used in 22 specs
- `clickColorPickerModeBtn()` -- used in 22 specs
- `expandedFilterItems()` -- used in 22 specs
- `getAgGridViewPort()` -- used in 22 specs
- `getInsertSliderWithoutClick()` -- used in 22 specs
- `getOneRowData()` -- used in 22 specs
- `openMenu()` -- used in 22 specs
- `waitForInfoWindowLoading()` -- used in 22 specs
- `navigateLinkByKey()` -- used in 21 specs
- `clickControlType()` -- used in 20 specs
- `getInputField()` -- used in 20 specs
- `getViewFilterItemText()` -- used in 20 specs
- `isViewFilterPresent()` -- used in 20 specs
- `waitForTransactionEditorLoaded()` -- used in 20 specs
- `bookmarkTotalCount()` -- used in 19 specs
- `getAllCountFromTitle()` -- used in 19 specs
- `getSelectedItemsText()` -- used in 19 specs
- `getTextFieldByKey()` -- used in 19 specs
- `isItemSelected()` -- used in 19 specs
- `applyButtonForSelectTarget()` -- used in 18 specs
- `bookmarkCount(sectionName = 'MY BOOKMARKS')` -- used in 18 specs
- `checkElementUnderDDICdropdown()` -- used in 18 specs
- `clickConfirmContainerIcon()` -- used in 18 specs
- `clickTitleBarButtonInConsumption()` -- used in 18 specs
- `isAddTableButtonDisplayed()` -- used in 18 specs
- `isPresent()` -- used in 18 specs
- `modifyActionName()` -- used in 18 specs
- `moveDossierIntoViewPort()` -- used in 18 specs
- `switchTabViewer()` -- used in 18 specs
- `switchUser()` -- used in 18 specs
- `addSingle()` -- used in 17 specs
- `filterPanelItems()` -- used in 17 specs
- `linkToTargetByPiechartContextMenu()` -- used in 17 specs
- `actionOnMenubarWithSubmenu(menuOption, subOption, seconds = 20, notShow = false)` -- used in 16 specs
- `changeMetricSliderSelection()` -- used in 16 specs
- `clickExpandIcon()` -- used in 16 specs
- `getRowsCount()` -- used in 16 specs
- `getTextNodeByText()` -- used in 16 specs
- `getTransactionDialogText()` -- used in 16 specs
- `openDDICdropdown()` -- used in 16 specs
- `replaceTextInGridCellAndEnter()` -- used in 16 specs
- `searchData()` -- used in 16 specs
- `selectOptionInMenu()` -- used in 16 specs
- `setTitleStyle(value)` -- used in 16 specs
- `apply()` -- used in 15 specs
- `changeMQSelection()` -- used in 15 specs
- `getTitle()` -- used in 15 specs
- `selectGridElement()` -- used in 15 specs
- `clickCreateButton()` -- used in 14 specs
- `dateAndTimeText()` -- used in 14 specs
- `dragSliderForInsertData()` -- used in 14 specs
- `getAlertEditorWithTitle()` -- used in 14 specs
- `hoverOnTextfieldByTitle(text)` -- used in 14 specs
- `isTOCDocked()` -- used in 14 specs
- `selectDropdownOption()` -- used in 14 specs
- `selectElementsInDropdown()` -- used in 14 specs
- `selectTab()` -- used in 14 specs
- `setControlType()` -- used in 14 specs
- `switchPageByKey(direction, delay)` -- used in 14 specs
- `clickFilterContextMenuOption()` -- used in 13 specs
- `getFavoritesCountFromTitle()` -- used in 13 specs
- `isViewFilterItemPresent()` -- used in 13 specs
- `clickButtonBackgroundColorBtn()` -- used in 12 specs
- `closeFilterPanel()` -- used in 12 specs
- `editTargetVisualizations()` -- used in 12 specs
- `getActionName()` -- used in 12 specs
- `getInputNumField()` -- used in 12 specs
- `getSelectedDrodownItem()` -- used in 12 specs
- `getSliderWidth()` -- used in 12 specs
- `isElementSelected()` -- used in 12 specs
- `labelInTitle()` -- used in 12 specs
- `selectElementByName()` -- used in 12 specs
- `selectInCanvasContextOption()` -- used in 12 specs
- `selectTemplate()` -- used in 12 specs
- `toString()` -- used in 12 specs
- `getPanel()` -- used in 11 specs
- `isErrorPresent()` -- used in 11 specs
- `navigateLinkByText()` -- used in 11 specs
- `openDossierContextMenu()` -- used in 11 specs
- `waitForPageLoading()` -- used in 11 specs
- `changeAltText()` -- used in 10 specs
- `clearAndInputText()` -- used in 10 specs
- `clickButtonFormatIcon()` -- used in 10 specs
- `clickOnElement()` -- used in 10 specs
- `clickVisualizationTitleContainer()` -- used in 10 specs
- `dismissButtonFormatPopup()` -- used in 10 specs
- `generatorBarText()` -- used in 10 specs
- `getAllInsertDropdownOptions()` -- used in 10 specs
- `getCurrentPage()` -- used in 10 specs
- `getSourceButton()` -- used in 10 specs
- `getTitleStyle(value)` -- used in 10 specs
- `hoverTextNodeByKey()` -- used in 10 specs
- `includes()` -- used in 10 specs
- `resetIfEnabled()` -- used in 10 specs
- `selectTargetButton()` -- used in 10 specs
- `selectTargetVisualizations()` -- used in 10 specs
- `toggleTitles()` -- used in 10 specs
- `waitForElementVisible()` -- used in 10 specs
- `clickDatasetCheckbox()` -- used in 9 specs
- `clickDossierContextMenuItem()` -- used in 9 specs
- `clickSelectButton()` -- used in 9 specs
- `clickSelectValuePromptButton()` -- used in 9 specs
- `confirmAdvThresholdDetail()` -- used in 9 specs
- `filterBarItemCount()` -- used in 9 specs
- `getNavigationBar()` -- used in 9 specs
- `openAdvThresholdDetail()` -- used in 9 specs
- `saveAsNewObject(objectName)` -- used in 9 specs
- `text()` -- used in 9 specs
- `waitForEditorSelectableMode()` -- used in 9 specs
- `waitForItemLoading()` -- used in 9 specs
- `actionOnToolbar(buttonName)` -- used in 8 specs
- `addNewRow()` -- used in 8 specs
- `clickAddBtn()` -- used in 8 specs
- `clickButtonIconColorBtn()` -- used in 8 specs
- `clickButtonTextFontColorBtn()` -- used in 8 specs
- `clickDDICdropdownBtn()` -- used in 8 specs
- `clickGridElementLink()` -- used in 8 specs
- `clickHtBtnOnAlert()` -- used in 8 specs
- `clickOKButtonInDropdown()` -- used in 8 specs
- `clickOnContainerFromLayersPanel()` -- used in 8 specs
- `clickOnInsertDropdown()` -- used in 8 specs
- `clickTitleBackgroundColorBtn()` -- used in 8 specs
- `confirmThreshold()` -- used in 8 specs
- `contextMenuOnPage()` -- used in 8 specs
- `getBadInput()` -- used in 8 specs
- `getBulkEditSubmitButton()` -- used in 8 specs
- `getBulkEditToolbar()` -- used in 8 specs
- `getButtonFormatPopup()` -- used in 8 specs
- `getDossierImageContainer()` -- used in 8 specs
- `GetMapType()` -- used in 8 specs
- `getSettingMenu()` -- used in 8 specs
- `getTopBarInTransactionEditor()` -- used in 8 specs
- `getVisualizationTitleBarRoot()` -- used in 8 specs
- `isBookmarkAddtoLibraryMsgPresent()` -- used in 8 specs
- `isDossierEditorDisplayed()` -- used in 8 specs
- `isTransactionConfigEditorClosed()` -- used in 8 specs
- `isURLOpenInNewTabCheckboxChecked()` -- used in 8 specs
- `openBookmarkSectionList()` -- used in 8 specs
- `openDossierByUrl()` -- used in 8 specs
- `replaceAll()` -- used in 8 specs
- `saveBookmark()` -- used in 8 specs
- `selectPromptItems()` -- used in 8 specs
- `textBoxInputText()` -- used in 8 specs
- `toggleTitleBar()` -- used in 8 specs
- `changeImageURL()` -- used in 7 specs
- `clickDynamicButtons()` -- used in 7 specs
- `expandORCollapseGroup()` -- used in 7 specs
- `getBookmarkListNames()` -- used in 7 specs
- `getDropdownSelectedText()` -- used in 7 specs
- `getSelectedTabName()` -- used in 7 specs
- `getSliderText()` -- used in 7 specs
- `getThresholdImageURL()` -- used in 7 specs
- `hideBookmarkTimeStamp()` -- used in 7 specs
- `isAllAltMatched()` -- used in 7 specs
- `isBookmarkEnabled()` -- used in 7 specs
- `isBookmarkLabelPresent()` -- used in 7 specs
- `isFavoritesPresent()` -- used in 7 specs
- `openDossierAndRunPrompt()` -- used in 7 specs
- `showBookmarkTimeStamp()` -- used in 7 specs
- `tabCount()` -- used in 7 specs
- `toggleSetAsTemplate()` -- used in 7 specs
- `addObjectToVizByDoubleClick()` -- used in 6 specs
- `cancelButtonForSelectTarget()` -- used in 6 specs
- `cancelReset()` -- used in 6 specs
- `changeFilterType()` -- used in 6 specs
- `clearFilter()` -- used in 6 specs
- `clickActiontoOpenTransactionEditor()` -- used in 6 specs
- `clickButtonVisibleIcon()` -- used in 6 specs
- `clickChartElementByIndex()` -- used in 6 specs
- `clickElmInAvailableList()` -- used in 6 specs
- `clickImageinAuthoring()` -- used in 6 specs
- `clickOnAGGridCell()` -- used in 6 specs
- `clickSaveInMenuBar()` -- used in 6 specs
- `closeEditorWithoutSaving()` -- used in 6 specs
- `deleteBookmark(name, sectionName = 'MY BOOKMARKS')` -- used in 6 specs
- `getAllThresholdImageAlt()` -- used in 6 specs
- `getBulkEditSubmitButtonEnabled()` -- used in 6 specs
- `getCreateNewDossierPanel()` -- used in 6 specs
- `getDropdownInsertTextBox()` -- used in 6 specs
- `getErrorInputNumField()` -- used in 6 specs
- `getHTMLNode()` -- used in 6 specs
- `getOneColumnData()` -- used in 6 specs
- `getPageTitleText()` -- used in 6 specs
- `getPromprtEditorSelectableMode()` -- used in 6 specs
- `getRowDataInAddDataTab()` -- used in 6 specs
- `getSelectedTemplateNameInGridView()` -- used in 6 specs
- `getTextNodeByKey()` -- used in 6 specs
- `getVIDoclayout()` -- used in 6 specs
- `getVisualizationSubTitleBarRoot()` -- used in 6 specs
- `handleError()` -- used in 6 specs
- `hover()` -- used in 6 specs
- `initial()` -- used in 6 specs
- `inputDate()` -- used in 6 specs
- `isBtnDisabled(buttonName)` -- used in 6 specs
- `IsMenuButtonValid()` -- used in 6 specs
- `isSaveChangesDialogPresent()` -- used in 6 specs
- `isSharedBookmark()` -- used in 6 specs
- `openDossierByID()` -- used in 6 specs
- `openFileMenu()` -- used in 6 specs
- `openTxnConfigEditorByContextMenu()` -- used in 6 specs
- `openVizFormatPanel()` -- used in 6 specs
- `previewImageURL()` -- used in 6 specs
- `renameVisualizationByDoubleClick()` -- used in 6 specs
- `replaceTextInGridCell()` -- used in 6 specs
- `switchToEditorPanel()` -- used in 6 specs
- `switchToReportTab()` -- used in 6 specs
- `textContent()` -- used in 6 specs
- `waitForDisplayed()` -- used in 6 specs
- `waitForSliderForInlineEdit()` -- used in 6 specs
- `waitLibraryLoadingIsNotDisplayed()` -- used in 6 specs
- `altText()` -- used in 5 specs
- `clickApplyButton()` -- used in 5 specs
- `clickPromptIndexByTitleWithNoWait()` -- used in 5 specs
- `editDossierByUrlwithPrompt()` -- used in 5 specs
- `getFilterPanelDropdown()` -- used in 5 specs
- `getLinkIconByTextNode()` -- used in 5 specs
- `getNoBookmarks()` -- used in 5 specs
- `getNoDataResetBtn()` -- used in 5 specs
- `getPanelByID()` -- used in 5 specs
- `getTemplateIcon()` -- used in 5 specs
- `getThresholdImageAlt()` -- used in 5 specs
- `getVizErrorContent()` -- used in 5 specs
- `isTOCMenuOpen()` -- used in 5 specs
- `openAllSectionList()` -- used in 5 specs
- `openDossierNoWait()` -- used in 5 specs
- `openShareDossierDialog()` -- used in 5 specs
- `openSharePanel()` -- used in 5 specs
- `openUserAccountMenu()` -- used in 5 specs
- `pinTOC()` -- used in 5 specs
- `previewImageAlt()` -- used in 5 specs
- `removeDossierFromLibrary()` -- used in 5 specs
- `renameBookmark(name, newName)` -- used in 5 specs
- `runWithPIP()` -- used in 5 specs
- `selectFiltersOption()` -- used in 5 specs
- `toggleCertify()` -- used in 5 specs
- `unpinTOC()` -- used in 5 specs
- `updateBookmark(name)` -- used in 5 specs
- `waitForPromptDetail()` -- used in 5 specs
- `actionOnmenubarWithSubmenu()` -- used in 4 specs
- `addAll()` -- used in 4 specs
- `addManualInputRow()` -- used in 4 specs
- `cancelResolvePrompt()` -- used in 4 specs
- `changeButtonFillColorOpacity()` -- used in 4 specs
- `changeMetricSliderByInputBox()` -- used in 4 specs
- `changeToDynamicSelection()` -- used in 4 specs
- `checkTableColumn()` -- used in 4 specs
- `checkTemplateInfo()` -- used in 4 specs
- `clearAllFilters()` -- used in 4 specs
- `clickBlankDossierBtn()` -- used in 4 specs
- `clickBulkMode()` -- used in 4 specs
- `clickButtonBorderColorBtn()` -- used in 4 specs
- `clickButtonOnFooter()` -- used in 4 specs
- `clickCheckboxByName()` -- used in 4 specs
- `clickErrorActionButton()` -- used in 4 specs
- `clickInsertDataCell()` -- used in 4 specs
- `clickMappedTable()` -- used in 4 specs
- `clickNamespaceListButton()` -- used in 4 specs
- `clickShowDataExportButton()` -- used in 4 specs
- `clickTableColumn()` -- used in 4 specs
- `clickTextFormatBtn(type)` -- used in 4 specs
- `clickUndo()` -- used in 4 specs
- `close()` -- used in 4 specs
- `closeMenu({ icon = 'toc' })` -- used in 4 specs
- `closeShareBookmarkDropDown()` -- used in 4 specs
- `currentPageIndicator()` -- used in 4 specs
- `doubleClick()` -- used in 4 specs
- `enterOnInput()` -- used in 4 specs
- `exportShowData()` -- used in 4 specs
- `filterSelectionInfo()` -- used in 4 specs
- `getButton()` -- used in 4 specs
- `getCertifiedIcon()` -- used in 4 specs
- `getCheckedDeleteRow()` -- used in 4 specs
- `getControlTypeTextForPython()` -- used in 4 specs
- `getCreateNewDossierSelectTemplateInfoPanel()` -- used in 4 specs
- `getDatasetNamesInDatasetsPanel()` -- used in 4 specs
- `getDossierCertifiedIconInTitle()` -- used in 4 specs
- `getDossierTemplateIconInTitle()` -- used in 4 specs
- `getEnterTXNModeBtn()` -- used in 4 specs
- `getFilterTypeDropDown()` -- used in 4 specs
- `getHeader()` -- used in 4 specs
- `getImageBoxByIndex()` -- used in 4 specs
- `getImageNodeByKey()` -- used in 4 specs
- `getInputValuesWithConfigurations()` -- used in 4 specs
- `getInsertContainer()` -- used in 4 specs
- `getlinkEditor()` -- used in 4 specs
- `getMainInfo()` -- used in 4 specs
- `getManualInputErrorCell()` -- used in 4 specs
- `getNumberOfRows()` -- used in 4 specs
- `getSaveChangesDialog()` -- used in 4 specs
- `getShareDossierDialog()` -- used in 4 specs
- `getSubMenuContainer()` -- used in 4 specs
- `getTextNode()` -- used in 4 specs
- `getTocPanel()` -- used in 4 specs
- `getTooltipsText()` -- used in 4 specs
- `getUpdatedCell()` -- used in 4 specs
- `getVisualizationTitleBarTextArea()` -- used in 4 specs
- `hoverOnAGGridCell()` -- used in 4 specs
- `hoverOnBookmark(name, sectionName = 'MY BOOKMARKS')` -- used in 4 specs
- `hoverOnErrorInputNumField()` -- used in 4 specs
- `hoverOnImageByKey()` -- used in 4 specs
- `hoverTitleBarButton()` -- used in 4 specs
- `imageAlt()` -- used in 4 specs
- `inputValueParameter()` -- used in 4 specs
- `IsConditionalDisplayDialogButtonEnabled()` -- used in 4 specs
- `isContextMenuOptionPresent()` -- used in 4 specs
- `isDashboardOpenInNewTabCheckboxChecked()` -- used in 4 specs
- `isDashboardOpenInNewTabDisplayed()` -- used in 4 specs
- `isDynamicButtonPresent()` -- used in 4 specs
- `isSelected()` -- used in 4 specs
- `isTooltipDisplayed()` -- used in 4 specs
- `isTooltipDisplayedForTextNodeByKey()` -- used in 4 specs
- `keepSaveReminder()` -- used in 4 specs
- `matchScreenshot()` -- used in 4 specs
- `openBMList()` -- used in 4 specs
- `openButtonBorderPullDown()` -- used in 4 specs
- `openDossierByIDInPresentationMode()` -- used in 4 specs
- `openSearchSlider()` -- used in 4 specs
- `openSidebar()` -- used in 4 specs
- `runNoWait()` -- used in 4 specs
- `saveInMyReport()` -- used in 4 specs
- `scrollAndSelectItem()` -- used in 4 specs
- `searchFor()` -- used in 4 specs
- `searchForObject()` -- used in 4 specs
- `selectButtonBorderStyle()` -- used in 4 specs
- `selectButtonRadius()` -- used in 4 specs
- `selectButtonSize()` -- used in 4 specs
- `selectButtonTextFontStyle()` -- used in 4 specs
- `selectDossier()` -- used in 4 specs
- `selectFilter()` -- used in 4 specs
- `selectFontAlign()` -- used in 4 specs
- `selectFontStyle()` -- used in 4 specs
- `selectItemByKey()` -- used in 4 specs
- `selectItemInSuggestionList()` -- used in 4 specs
- `selectTitleOption()` -- used in 4 specs
- `selectURLOpenInNewTabCheckbox()` -- used in 4 specs
- `setButtonLabelOption()` -- used in 4 specs
- `setCheckbox()` -- used in 4 specs
- `setNamespaceCheckbox()` -- used in 4 specs
- `switchToNewWindowWithUrl()` -- used in 4 specs
- `switchToTransactionOptionsSection()` -- used in 4 specs
- `toLowerCase()` -- used in 4 specs
- `validateNamespaceCheckbox()` -- used in 4 specs
- `bulkDeleteBookmarks()` -- used in 3 specs
- `clear()` -- used in 3 specs
- `clearAndInputYear()` -- used in 3 specs
- `clearSearchData()` -- used in 3 specs
- `clickAddToLibraryButton()` -- used in 3 specs
- `clickCancelExecutionButtonInCurrentPage(option)` -- used in 3 specs
- `clickCloseDossierButton()` -- used in 3 specs
- `clickElmInSelectedList()` -- used in 3 specs
- `clickMultiSelectBtn()` -- used in 3 specs
- `clickMyLibraryTab()` -- used in 3 specs
- `clickOnDashboardPropertiesEditorButton(buttonName)` -- used in 3 specs
- `clickOnExecutionMode()` -- used in 3 specs
- `closeDossierWithoutSaving()` -- used in 3 specs
- `confirmRemove()` -- used in 3 specs
- `contextMenuActionFromLayersPanel()` -- used in 3 specs
- `createBookmarksByDefault(number)` -- used in 3 specs
- `createByAriaLable()` -- used in 3 specs
- `doubleClickOnElement()` -- used in 3 specs
- `editDossierFromLibraryWithNoWait()` -- used in 3 specs
- `executeScript()` -- used in 3 specs
- `fakeUpdateTimestamp()` -- used in 3 specs
- `favorite()` -- used in 3 specs
- `filterCount()` -- used in 3 specs
- `filterCountString()` -- used in 3 specs
- `getAddBookmarkErrorMsg()` -- used in 3 specs
- `getDashbaordExecutionModeDropdown()` -- used in 3 specs
- `getDashboardExecutionMode()` -- used in 3 specs
- `getDossierTitleText()` -- used in 3 specs
- `getErrorDialogMainContainer()` -- used in 3 specs
- `getRsdGridByKey()` -- used in 3 specs
- `getSliderSelectedText()` -- used in 3 specs
- `getTemplateInfoData()` -- used in 3 specs
- `getTemplateListHeaders()` -- used in 3 specs
- `getTemplateNamesInGridView()` -- used in 3 specs
- `hideCertifiedDetailsText()` -- used in 3 specs
- `ignoreSaveReminder()` -- used in 3 specs
- `inputText()` -- used in 3 specs
- `inputTextAndSearch()` -- used in 3 specs
- `InputValuetoTextNodeByKey()` -- used in 3 specs
- `isCapsuleExcluded()` -- used in 3 specs
- `isDataSetsOrderedByDateCreatedAscending()` -- used in 3 specs
- `isFavoritesIconSelected()` -- used in 3 specs
- `isFilterExcludedinExpandedView()` -- used in 3 specs
- `isGridAltTagNotEmpty()` -- used in 3 specs
- `isLinkItemSelected()` -- used in 3 specs
- `isPreviewImageAltTagNotEmpty()` -- used in 3 specs
- `isSelectValuePromptButtonDisplay()` -- used in 3 specs
- `join()` -- used in 3 specs
- `logout(options = {})` -- used in 3 specs
- `openCalendar()` -- used in 3 specs
- `openInfoWindow()` -- used in 3 specs
- `openMonthDropDownMenu()` -- used in 3 specs
- `openTextLinkEditor()` -- used in 3 specs
- `refresh()` -- used in 3 specs
- `removeFavorite()` -- used in 3 specs
- `removeSingle()` -- used in 3 specs
- `rightClickOnContainerFromLayersPanel()` -- used in 3 specs
- `runWithWaitForCancel()` -- used in 3 specs
- `searchRecipient(searchKey, waitForShareDialog = true)` -- used in 3 specs
- `searchTemplate()` -- used in 3 specs
- `selectAllToDelete()` -- used in 3 specs
- `selectDay()` -- used in 3 specs
- `selectMonth()` -- used in 3 specs
- `selectRecipients(userList, groupName = 'None')` -- used in 3 specs
- `selectRemove()` -- used in 3 specs
- `shareDossier(waitForSuccessToast = false)` -- used in 3 specs
- `showDetails()` -- used in 3 specs
- `showIconTooltip()` -- used in 3 specs
- `sliceCount()` -- used in 3 specs
- `sortDataByHeaderName()` -- used in 3 specs
- `switchDynamicItems()` -- used in 3 specs
- `switchToListView()` -- used in 3 specs
- `toggleCertifiedOnlyForData()` -- used in 3 specs
- `waitForElementInvisible()` -- used in 3 specs
- `waitForExportComplete()` -- used in 3 specs
- `waitForReportLoading()` -- used in 3 specs
- `addElementToDataset()` -- used in 2 specs
- `backToLibrary()` -- used in 2 specs
- `cancelCreateButton()` -- used in 2 specs
- `cancelDelete()` -- used in 2 specs
- `cancelInputName()` -- used in 2 specs
- `changeCoverImageByPath()` -- used in 2 specs
- `changeViz()` -- used in 2 specs
- `checkWhereClauseButtons()` -- used in 2 specs
- `chooseDateInParameter()` -- used in 2 specs
- `chooseDateInParameterWithOkButton()` -- used in 2 specs
- `chooseDateTimeInParameter()` -- used in 2 specs
- `chooseElement()` -- used in 2 specs
- `chooseImageBased()` -- used in 2 specs
- `chooseTab()` -- used in 2 specs
- `clearAllTextInSqlEditor()` -- used in 2 specs
- `clearTxnConfigByContextMenu()` -- used in 2 specs
- `clickAddDataButton()` -- used in 2 specs
- `clickAddDataOkButton()` -- used in 2 specs
- `clickBtnByTitle(text)` -- used in 2 specs
- `clickBulkTxnModeIcon()` -- used in 2 specs
- `clickCell()` -- used in 2 specs
- `clickCloseBtn()` -- used in 2 specs
- `clickCloseURLGeneratorDialogButton()` -- used in 2 specs
- `clickDropdownInsertTextBox()` -- used in 2 specs
- `clickEditIcon()` -- used in 2 specs
- `clickElement()` -- used in 2 specs
- `clickFilterIcon()` -- used in 2 specs
- `clickFontColorBtn()` -- used in 2 specs
- `clickLaunchButton()` -- used in 2 specs
- `clickNameCheckbox()` -- used in 2 specs
- `clickOnContainerTitle()` -- used in 2 specs
- `clickOnGridElement()` -- used in 2 specs
- `clickPanelStackContextMenuItem()` -- used in 2 specs
- `clickRedo()` -- used in 2 specs
- `clickSaveButton()` -- used in 2 specs
- `clickTextContextMenuOptionByKey()` -- used in 2 specs
- `clickTxnTypeOnFormatPanel()` -- used in 2 specs
- `clickVisibleButtonByAriaLabel(labelText = 'Cancel')` -- used in 2 specs
- `clickWhereClauseButtons()` -- used in 2 specs
- `closeConditionalDisplayDialog()` -- used in 2 specs
- `closeDialog()` -- used in 2 specs
- `closeEditor()` -- used in 2 specs
- `closeNewDossierPanel()` -- used in 2 specs
- `closeUserAccountMenu()` -- used in 2 specs
- `confirmDelete()` -- used in 2 specs
- `confirmImageURL()` -- used in 2 specs
- `confirmResetWithPrompt()` -- used in 2 specs
- `confirmSwitchToAdvThreshold()` -- used in 2 specs
- `createSnapshotOnBookmark()` -- used in 2 specs
- `deleteRow()` -- used in 2 specs
- `dismissColorPicker()` -- used in 2 specs
- `dismissMissingFontPopup()` -- used in 2 specs
- `editBulkDeleteBookmarks()` -- used in 2 specs
- `editContextualLink()` -- used in 2 specs
- `editDossierFromLibrary()` -- used in 2 specs
- `editTxnConfigByContextMenu()` -- used in 2 specs
- `enter()` -- used in 2 specs
- `exclude()` -- used in 2 specs
- `exportSubmitVisualization()` -- used in 2 specs
- `favoriteByImageIcon()` -- used in 2 specs
- `filterSummaryBarText()` -- used in 2 specs
- `formatTitle()` -- used in 2 specs
- `getAccountDropdown()` -- used in 2 specs
- `getActiveView()` -- used in 2 specs
- `getAddButton()` -- used in 2 specs
- `getAdvThresholdDetail()` -- used in 2 specs
- `getAnswerPromptOptionsText()` -- used in 2 specs
- `getAttrOrMetricSelectorContainerUsingId()` -- used in 2 specs
- `getBulkTxnGridCellErrorByPosition()` -- used in 2 specs
- `getButtonbarByName()` -- used in 2 specs
- `getButtonByName()` -- used in 2 specs
- `getCellByTypeAndInputValue()` -- used in 2 specs
- `getConditionalDisplayDialog()` -- used in 2 specs
- `getConditionTitle()` -- used in 2 specs
- `getConfirmContainer()` -- used in 2 specs
- `getConfirmDialog()` -- used in 2 specs
- `getConfirmSwitchProjectPopup()` -- used in 2 specs
- `getContextMenuOptionsList()` -- used in 2 specs
- `getContextuallinkEditor()` -- used in 2 specs
- `getControlTypeSettingErrorButton()` -- used in 2 specs
- `getCurrentProject()` -- used in 2 specs
- `getDashboardPropertiesEditor()` -- used in 2 specs
- `getDatasetPanel()` -- used in 2 specs
- `getDDICdropdownElements()` -- used in 2 specs
- `getDeleteConfirmMsg()` -- used in 2 specs
- `getDossierChapterTooltip()` -- used in 2 specs
- `getDossierPageTooltip()` -- used in 2 specs
- `getEditGridCellAtPosition()` -- used in 2 specs
- `getElementOrValueFilterByTitle()` -- used in 2 specs
- `getEmptyLibraryMessage()` -- used in 2 specs
- `getErrorContainer()` -- used in 2 specs
- `getFavoriteBookmarkNumberFromTitle()` -- used in 2 specs
- `getFavoriteTooltipText()` -- used in 2 specs
- `getFilterMainPanel()` -- used in 2 specs
- `getGridCellTextByPosition()` -- used in 2 specs
- `getInlineErrorMessage()` -- used in 2 specs
- `getInlineInsertContainer()` -- used in 2 specs
- `getInputConfig()` -- used in 2 specs
- `getInsertInputElements()` -- used in 2 specs
- `getItemInSuggestionList()` -- used in 2 specs
- `getLibraryIcon()` -- used in 2 specs
- `getMappingEditorTableColumns()` -- used in 2 specs
- `getMappingEditorTableColumnsAndInputValues()` -- used in 2 specs
- `getMenuBarSubItemByName()` -- used in 2 specs
- `getMojoLoadingIndicator()` -- used in 2 specs
- `getNoDataTextCount()` -- used in 2 specs
- `getPreviewImageInAdvThresholdEditor()` -- used in 2 specs
- `getPromptEditor()` -- used in 2 specs
- `getRightClickMenu()` -- used in 2 specs
- `getRowDataInTemplateListView()` -- used in 2 specs
- `getSecondaryPanel()` -- used in 2 specs
- `getSelectedNamespace()` -- used in 2 specs
- `getSelectedSearchboxItem()` -- used in 2 specs
- `getSnapshotNames()` -- used in 2 specs
- `getSqlText()` -- used in 2 specs
- `getTableColumnsAndInputValues()` -- used in 2 specs
- `getTabScreenshot()` -- used in 2 specs
- `getTitleFontColor(line)` -- used in 2 specs
- `getTitleFontFamily(line)` -- used in 2 specs
- `getTitleFontSize(line)` -- used in 2 specs
- `getTOCPanel()` -- used in 2 specs
- `getTotalBookmarkNumber()` -- used in 2 specs
- `getTransactionDialogTextHeight()` -- used in 2 specs
- `getURLLinkInLinkEditor()` -- used in 2 specs
- `getVisualizationMenuButton()` -- used in 2 specs
- `getVIVizPanel()` -- used in 2 specs
- `goToHome()` -- used in 2 specs
- `hideSharedUrl()` -- used in 2 specs
- `hideTimeAndName()` -- used in 2 specs
- `hideTocTimeStamp()` -- used in 2 specs
- `hoverOnGridElementNoWait()` -- used in 2 specs
- `hoverOnTocItem({ chapterName, pageName })` -- used in 2 specs
- `hoverOnVisualizationContainer()` -- used in 2 specs
- `imageURL()` -- used in 2 specs
- `input()` -- used in 2 specs
- `inputMicroStrategyWebLink()` -- used in 2 specs
- `inputNoDataText(text)` -- used in 2 specs
- `isAllTemplateCertified()` -- used in 2 specs
- `isBookmarkPresent(name, sectionName = 'MY BOOKMARKS')` -- used in 2 specs
- `isCheckboxChecked()` -- used in 2 specs
- `isDialogDisplayed()` -- used in 2 specs
- `isDialogHidden()` -- used in 2 specs
- `isDossierInLibrary()` -- used in 2 specs
- `isEditButtonVisible()` -- used in 2 specs
- `isEditorClosed()` -- used in 2 specs
- `isEnabled()` -- used in 2 specs
- `isFavoritesBtnSelected()` -- used in 2 specs
- `isFontAlignButtonDisabled()` -- used in 2 specs
- `isIncludeBMPresent()` -- used in 2 specs
- `isLoginPageDisplayed()` -- used in 2 specs
- `isNoDataFormatButtonSelected(type)` -- used in 2 specs
- `isOpen()` -- used in 2 specs
- `isOptionDisabledInMenu(subOption)` -- used in 2 specs
- `isPopUpLinkDisplayedEditMode()` -- used in 2 specs
- `linkToTargetByGridContextMenuForRA()` -- used in 2 specs
- `linkToTargetByGridToolTip()` -- used in 2 specs
- `mojoTooltip()` -- used in 2 specs
- `multiSelect()` -- used in 2 specs
- `multiSelectGridElements()` -- used in 2 specs
- `navigateLinkEditModeByKey()` -- used in 2 specs
- `openAdminPage()` -- used in 2 specs
- `openBookmark()` -- used in 2 specs
- `openConditionalDisplayDialog()` -- used in 2 specs
- `openContextMenu3()` -- used in 2 specs
- `openContextMenuItemForValue()` -- used in 2 specs
- `openContextSubMenuItemForHeader()` -- used in 2 specs
- `OpenElementMenu()` -- used in 2 specs
- `openGridElmContextMenu()` -- used in 2 specs
- `openImageLinkEditor()` -- used in 2 specs
- `openLayerSelection()` -- used in 2 specs
- `openLinkEditorOnContainer()` -- used in 2 specs
- `openParameterCalendar()` -- used in 2 specs
- `openSnapshotsSectionList()` -- used in 2 specs
- `removeFavoriteByImageIcon()` -- used in 2 specs
- `renameBookmarkWithoutEnter()` -- used in 2 specs
- `resetLocalStorage()` -- used in 2 specs
- `resetToLibraryHome()` -- used in 2 specs
- `scrollHorizontally()` -- used in 2 specs
- `scrollVerticallyToBottom()` -- used in 2 specs
- `selectBookmarkToDeleteByName(name)` -- used in 2 specs
- `selectButtonTextFont()` -- used in 2 specs
- `selectDDICitems()` -- used in 2 specs
- `selectNewLayer()` -- used in 2 specs
- `selectReportGridContextMenuOption()` -- used in 2 specs
- `selectSharedBookmark(bookmarkList, sectionName = 'MY BOOKMARKS')` -- used in 2 specs
- `selectTextFont()` -- used in 2 specs
- `selectTxnView()` -- used in 2 specs
- `setButtonAlias()` -- used in 2 specs
- `setExportButtonOption()` -- used in 2 specs
- `setGridFieldForPython()` -- used in 2 specs
- `setTextFontSize()` -- used in 2 specs
- `showSharedUrl()` -- used in 2 specs
- `showTimeAndName()` -- used in 2 specs
- `showTocTimeStamp()` -- used in 2 specs
- `switchAdvThreshold()` -- used in 2 specs
- `switchToFrame()` -- used in 2 specs
- `toBeTruthy()` -- used in 2 specs
- `toggleCertifiedOnlyForTemplate()` -- used in 2 specs
- `togglePanel()` -- used in 2 specs
- `toggleTxnTypeOnFormatPanel()` -- used in 2 specs
- `toMatchBaseline()` -- used in 2 specs
- `tooltip()` -- used in 2 specs
- `typeInSqlEditor()` -- used in 2 specs
- `verifyTableColumns()` -- used in 2 specs
- `waitForGridRendring()` -- used in 2 specs
- `waitForPageLoadByTitle()` -- used in 2 specs
- `waitForTransactionSliderDisplayed()` -- used in 2 specs
- `waitPageLoading()` -- used in 2 specs
- `addNewSampleData(sampleDataIndex, prepare)` -- used in 1 specs
- `addParameterToParameterSelector(name, index)` -- used in 1 specs
- `allAltTexts()` -- used in 1 specs
- `applyWithoutWaiting()` -- used in 1 specs
- `autoResize()` -- used in 1 specs
- `buttonStyle()` -- used in 1 specs
- `cancelDefaultTemplate()` -- used in 1 specs
- `cancelSwitchProject()` -- used in 1 specs
- `changeCoverImageByDemoImageIndex()` -- used in 1 specs
- `changeNoDataTextColor(color)` -- used in 1 specs
- `checkQualSummaryOfDefault()` -- used in 1 specs
- `choosePrompt()` -- used in 1 specs
- `clearViewFilter()` -- used in 1 specs
- `clickAddFilterButton()` -- used in 1 specs
- `clickAddFilterMenuButton()` -- used in 1 specs
- `clickAllTab()` -- used in 1 specs
- `clickApplyButtonFromFilterBoxDialog()` -- used in 1 specs
- `clickAutoLayout()` -- used in 1 specs
- `clickBtnWithLabel(label)` -- used in 1 specs
- `clickCancelExecutionButton(option)` -- used in 1 specs
- `clickDossierPanelStackLeftSwitchArrow()` -- used in 1 specs
- `clickDossierPanelStackRightSwitchArrow()` -- used in 1 specs
- `clickEditButtonInPauseMode()` -- used in 1 specs
- `clickItems()` -- used in 1 specs
- `clickMenuItemInMobileView()` -- used in 1 specs
- `clickMenuOptionInLevel()` -- used in 1 specs
- `clickOKBtn()` -- used in 1 specs
- `clickOnCheckboxWithTitle(title)` -- used in 1 specs
- `clickOnToolMenu()` -- used in 1 specs
- `clickOnToolSubMenu()` -- used in 1 specs
- `clickSearchResultInfoIcon()` -- used in 1 specs
- `clickSelectTargetButton()` -- used in 1 specs
- `clickUndoInDossier()` -- used in 1 specs
- `closeCurrentTab()` -- used in 1 specs
- `closeTemplateInfo()` -- used in 1 specs
- `confirmSwitchProject()` -- used in 1 specs
- `confirmValues()` -- used in 1 specs
- `createBlankTemplate()` -- used in 1 specs
- `createDossierFromLibrary()` -- used in 1 specs
- `createSelectorPanel()` -- used in 1 specs
- `createSelectorWindow()` -- used in 1 specs
- `currentSortOption()` -- used in 1 specs
- `cwd()` -- used in 1 specs
- `deleteBookmarksByDefault(number)` -- used in 1 specs
- `deleteBookmarkWithoutConfirm(name, sectionName = 'MY BOOKMARKS')` -- used in 1 specs
- `dismissAutoDashboardWelcomePopup()` -- used in 1 specs
- `dismissError()` -- used in 1 specs
- `doubleClickOnAgGrid()` -- used in 1 specs
- `doubleClickOnTreeView()` -- used in 1 specs
- `dragDSObjectToSelector()` -- used in 1 specs
- `errorDetails()` -- used in 1 specs
- `errorMsg()` -- used in 1 specs
- `expandTreeView()` -- used in 1 specs
- `fakeDateModifiedColumns()` -- used in 1 specs
- `favoriteBookmarks()` -- used in 1 specs
- `getAddButtonColor()` -- used in 1 specs
- `getAllSortOptionsText()` -- used in 1 specs
- `getBookmarkListNumberFromTitle()` -- used in 1 specs
- `getCertifiedControl()` -- used in 1 specs
- `getCreateDossierTabNames()` -- used in 1 specs
- `getCreateNewDossierPanelFooter()` -- used in 1 specs
- `getCreateNewDossierTitleBar()` -- used in 1 specs
- `getCurrentSelectionText()` -- used in 1 specs
- `getDocView()` -- used in 1 specs
- `getDossierContextMenu()` -- used in 1 specs
- `getDossierContextMenuItem()` -- used in 1 specs
- `getDossierCreatorErrorMessage()` -- used in 1 specs
- `getEmptySearchImage()` -- used in 1 specs
- `getErrCount()` -- used in 1 specs
- `getErrorDialogue()` -- used in 1 specs
- `getFormatDetail()` -- used in 1 specs
- `getGhostImageContainerByIndex()` -- used in 1 specs
- `getIncanvasSelectorByKey()` -- used in 1 specs
- `getLayersPanel()` -- used in 1 specs
- `getLeftNavBar()` -- used in 1 specs
- `getMenuContainer()` -- used in 1 specs
- `getPanelPadding()` -- used in 1 specs
- `getProjectPicker()` -- used in 1 specs
- `getRowTextInTemplateList()` -- used in 1 specs
- `getSaveChangesCheckbox()` -- used in 1 specs
- `getSelectedDatasetsCount()` -- used in 1 specs
- `getSelectedRadioButtonItem()` -- used in 1 specs
- `getSelectedRadioButtonItemText()` -- used in 1 specs
- `getSeletedItemsCount()` -- used in 1 specs
- `getSwitchProjectLoadingBtn()` -- used in 1 specs
- `getTable()` -- used in 1 specs
- `getTemplateItemNameInGridView()` -- used in 1 specs
- `getTemplateItemsCntInGridView()` -- used in 1 specs
- `getTOCPin()` -- used in 1 specs
- `getTxtTitle_Chapter()` -- used in 1 specs
- `getTxtTitle_Dossier()` -- used in 1 specs
- `getVizDossierLinkingTooltip()` -- used in 1 specs
- `getWarningMessageText()` -- used in 1 specs
- `goToNextPage()` -- used in 1 specs
- `hideContainer()` -- used in 1 specs
- `hideOwnerAndTimestampInShareDashboardDialog()` -- used in 1 specs
- `hideSubPanelContainer()` -- used in 1 specs
- `hoverOnButton()` -- used in 1 specs
- `hoverOnGridElement()` -- used in 1 specs
- `hoverOnSlice()` -- used in 1 specs
- `hoverOnVizGroup()` -- used in 1 specs
- `hoverURLGeneratorButton()` -- used in 1 specs
- `includeBookmark()` -- used in 1 specs
- `inputTextAndOpenSearchPage()` -- used in 1 specs
- `inputValues()` -- used in 1 specs
- `isAllDatasetChecked()` -- used in 1 specs
- `isAltTagNotEmpty()` -- used in 1 specs
- `isAltTextNotEmpty()` -- used in 1 specs
- `isBlankTemplateSelected()` -- used in 1 specs
- `isBookmarksGroupVisible()` -- used in 1 specs
- `isButtonDisabled()` -- used in 1 specs
- `isCancelButtonDisplayed()` -- used in 1 specs
- `isCoverImageBlank()` -- used in 1 specs
- `isDataSelected()` -- used in 1 specs
- `isElementPresent()` -- used in 1 specs
- `isErrorInputDialogPresent()` -- used in 1 specs
- `isFavoriteGroupVisible()` -- used in 1 specs
- `isFavoritesBtnPresent()` -- used in 1 specs
- `isGenerateButtonDisabled()` -- used in 1 specs
- `isNoDataDisplayed()` -- used in 1 specs
- `isPanelOpen()` -- used in 1 specs
- `isPromptSectionVisible()` -- used in 1 specs
- `isResetPresent()` -- used in 1 specs
- `isTemplateIconDisplayedInTitleBar()` -- used in 1 specs
- `isUpdateBMPresent(name, sectionName = 'MY BOOKMARKS')` -- used in 1 specs
- `keepOnly()` -- used in 1 specs
- `localSearch()` -- used in 1 specs
- `lowerInput()` -- used in 1 specs
- `openConditionDropdown()` -- used in 1 specs
- `openDateTimePicker()` -- used in 1 specs
- `openDropdownMenu()` -- used in 1 specs
- `openFormDropdown()` -- used in 1 specs
- `openPieChartElmContextMenu()` -- used in 1 specs
- `openProject()` -- used in 1 specs
- `openSortMenu()` -- used in 1 specs
- `openValuePart1Editor()` -- used in 1 specs
- `openVisualizationMenu()` -- used in 1 specs
- `paths()` -- used in 1 specs
- `reload()` -- used in 1 specs
- `removeAll()` -- used in 1 specs
- `scrollDatasetToBottom()` -- used in 1 specs
- `search()` -- used in 1 specs
- `searchSearchbox()` -- used in 1 specs
- `searchSelectAndCreateDossier()` -- used in 1 specs
- `selectAll()` -- used in 1 specs
- `selectColumnSetOption()` -- used in 1 specs
- `selectCondition()` -- used in 1 specs
- `selectCopyToOnVisualizationMenu()` -- used in 1 specs
- `selectDeleteOnVisualizationMenu()` -- used in 1 specs
- `selectDisplayStyleForFilterItem()` -- used in 1 specs
- `selectDropdownItems()` -- used in 1 specs
- `selectElementsByNames()` -- used in 1 specs
- `selectFilterPanelFilterCheckboxOption()` -- used in 1 specs
- `selectForm()` -- used in 1 specs
- `selectPromptByIndex()` -- used in 1 specs
- `selectPullDownItem()` -- used in 1 specs
- `selectRadioButtonByName()` -- used in 1 specs
- `selectSearchBoxItem()` -- used in 1 specs
- `selectSecondaryContextMenuOption()` -- used in 1 specs
- `selectSortOption()` -- used in 1 specs
- `selectTargets()` -- used in 1 specs
- `selectTargetVizFromWithinSelector()` -- used in 1 specs
- `setFontColor()` -- used in 1 specs
- `setFromInputValue()` -- used in 1 specs
- `setPanelStackPaddingValue()` -- used in 1 specs
- `setRadiusValue()` -- used in 1 specs
- `setToInputValue()` -- used in 1 specs
- `shareBookmark(name, sectionName)` -- used in 1 specs
- `ShowOrHideColumns()` -- used in 1 specs
- `ShowOrHideColumnsSetting()` -- used in 1 specs
- `sortByColumnHeader()` -- used in 1 specs
- `sortTemplateByHeaderName()` -- used in 1 specs
- `standardLDAPLogin()` -- used in 1 specs
- `switchToDatasetTab()` -- used in 1 specs
- `switchToGridView()` -- used in 1 specs
- `switchToTreeMode()` -- used in 1 specs
- `toBeGreaterThan()` -- used in 1 specs
- `toBeNull()` -- used in 1 specs
- `tocTitleName()` -- used in 1 specs
- `toMatchPdf()` -- used in 1 specs
- `unfavoriteBookmarks()` -- used in 1 specs
- `updateSliderInput()` -- used in 1 specs
- `upperInput()` -- used in 1 specs
- `vizDossierLinkingTooltip()` -- used in 1 specs
- `waitForDownloadComplete({ name, fileType })` -- used in 1 specs
- `waitForEditorClose()` -- used in 1 specs
- `waitForLibraryLoading()` -- used in 1 specs
- `waitForPageIndicatorDisappear()` -- used in 1 specs
- `waitForSearchLoading()` -- used in 1 specs
- `actionOnEditorDialog(option)` -- used in 0 specs
- `actionOnSubmenu(subOption, notShow = false)` -- used in 0 specs
- `addACL(userList, groupList, targetACL)` -- used in 0 specs
- `addDatasetElementToDropzone(name, dropzoneName)` -- used in 0 specs
- `addExistingObjects()` -- used in 0 specs
- `addMessage(msg)` -- used in 0 specs
- `addNewSampleDataSaaS(sampleDataIndex, prepare)` -- used in 0 specs
- `addParameterToFilterPanel(name)` -- used in 0 specs
- `addToLibrary()` -- used in 0 specs
- `addUserForSaaS(userList)` -- used in 0 specs
- `browseloop(testcase)` -- used in 0 specs
- `cancel()` -- used in 0 specs
- `cancelAddToLibrary()` -- used in 0 specs
- `cancelManageAccessChange()` -- used in 0 specs
- `changeACLTo(targetACL)` -- used in 0 specs
- `changeViewModeTo(optionText)` -- used in 0 specs
- `chapterIsDisplayedInTOC(chapterName)` -- used in 0 specs
- `chapterIsLocked(chapterName)` -- used in 0 specs
- `chapterIsUnLocked(chapterName)` -- used in 0 specs
- `checkImageCompareForDocView(testCase, imageName)` -- used in 0 specs
- `checkNotShowAgain()` -- used in 0 specs
- `checkUserOrGroupFromExistingList(userOrGroup)` -- used in 0 specs
- `clickAddUserButton()` -- used in 0 specs
- `clickChangeViewModeButton()` -- used in 0 specs
- `clickCopyButton()` -- used in 0 specs
- `clickDashboardMenuBar({ menu, subMenu, isClose = true })` -- used in 0 specs
- `clickDuplicateButton()` -- used in 0 specs
- `clickExportToExcel()` -- used in 0 specs
- `clickFavoritesIcon()` -- used in 0 specs
- `clickHamburgerMenu()` -- used in 0 specs
- `clickHomeIcon()` -- used in 0 specs
- `clickHorizontalTocMenu(pageName)` -- used in 0 specs
- `clickImage()` -- used in 0 specs
- `clickImageLinkByTitle(text)` -- used in 0 specs
- `clickInviteButton()` -- used in 0 specs
- `clickInviteUser()` -- used in 0 specs
- `clickLeftArrow()` -- used in 0 specs
- `clickLoadingDataCancelButton()` -- used in 0 specs
- `clickMaxRestoreBtn()` -- used in 0 specs
- `clickOpenDashboardOnSnapshotBanner()` -- used in 0 specs
- `clickOutside()` -- used in 0 specs
- `clickOutsideElementSourceSelection(attributesMetricsName)` -- used in 0 specs
- `clickPageInHorizontalTocMenu(pageName)` -- used in 0 specs
- `clickPageSizeButton()` -- used in 0 specs
- `clickPageSizeFromMoreOptions()` -- used in 0 specs
- `clickPageTitle()` -- used in 0 specs
- `clickPinInTeams()` -- used in 0 specs
- `clickRedoInDossier()` -- used in 0 specs
- `clickReportExportToExcel()` -- used in 0 specs
- `clickRichTextBoxByAriaLabel(ariaLabel)` -- used in 0 specs
- `clickRichTextBoxByContent(textContent)` -- used in 0 specs
- `clickRichTextBoxElement(richTextBox)` -- used in 0 specs
- `clickRightArrow()` -- used in 0 specs
- `clickRunInBackgroundButton()` -- used in 0 specs
- `clickSaaSLibraryIcon()` -- used in 0 specs
- `clickSaveDossierButton(dossierName)` -- used in 0 specs
- `clickSaveDossierButtonWithWait()` -- used in 0 specs
- `clickShape()` -- used in 0 specs
- `clickShareInTeams()` -- used in 0 specs
- `clickShowDetails()` -- used in 0 specs
- `clickTextField(textFieldText)` -- used in 0 specs
- `clickTextFieldByTextContent(text)` -- used in 0 specs
- `clickTitleMaxRestoreBtn()` -- used in 0 specs
- `clickToDismissPopups()` -- used in 0 specs
- `clickVisualizationByLabel(label = 'Visualization 1 copy')` -- used in 0 specs
- `closeExportPDFSettingsWindow()` -- used in 0 specs
- `closeInfoWindow()` -- used in 0 specs
- `closeMenuWithoutWait({ icon = 'toc' })` -- used in 0 specs
- `closePopupsByClickBlankPathinRsd()` -- used in 0 specs
- `closeQueryDetail()` -- used in 0 specs
- `closeSavedSuccessfullyToast()` -- used in 0 specs
- `closeShareDossierPanel()` -- used in 0 specs
- `closeShareDropDown()` -- used in 0 specs
- `closeSharePanel()` -- used in 0 specs
- `confirmNotification()` -- used in 0 specs
- `confirmResetNoWait()` -- used in 0 specs
- `copyLink(waitForSuccessToast = false)` -- used in 0 specs
- `copyQueryDetails()` -- used in 0 specs
- `createSnapshot(name, sectionName = 'MY BOOKMARKS')` -- used in 0 specs
- `delete(rowNum)` -- used in 0 specs
- `deleteRecipients(userList)` -- used in 0 specs
- `deleteUnstructuredDataItem(name)` -- used in 0 specs
- `dismissCursorInSelector()` -- used in 0 specs
- `dismissNotification()` -- used in 0 specs
- `dismissRecipientSearchList()` -- used in 0 specs
- `dismissSnapshotBanner()` -- used in 0 specs
- `dismissTooltip()` -- used in 0 specs
- `doesMstrRootHaveErrorClass()` -- used in 0 specs
- `doubleClickTextField(textFieldText)` -- used in 0 specs
- `downloadDossier()` -- used in 0 specs
- `downLoadDossier()` -- used in 0 specs
- `editTextFieldbyDoubleClick(textField, newText)` -- used in 0 specs
- `errorMsgIsDisplayed(errorMsg)` -- used in 0 specs
- `expandCollapsedNavBar()` -- used in 0 specs
- `expandGroup(name)` -- used in 0 specs
- `favoriteByTOC()` -- used in 0 specs
- `getACLItemscount()` -- used in 0 specs
- `getBookmarkContainerHeight()` -- used in 0 specs
- `getBookmarkListHeight()` -- used in 0 specs
- `getBookmarkTooltipText()` -- used in 0 specs
- `getCapsureText(name)` -- used in 0 specs
- `getChangeACLButtonByName(user)` -- used in 0 specs
- `getChangeACLDropDownMenu(user)` -- used in 0 specs
- `getCurrentChangeViewModeText()` -- used in 0 specs
- `getCurrentPageByKey()` -- used in 0 specs
- `getEditorBtn(text)` -- used in 0 specs
- `getFavoritesIcon()` -- used in 0 specs
- `getGroupCheckBoxStatus(name)` -- used in 0 specs
- `getGroupMemberCount(name)` -- used in 0 specs
- `getHeight(textFieldText)` -- used in 0 specs
- `getHorizontalTocButton(pageName)` -- used in 0 specs
- `getLabelInTitle()` -- used in 0 specs
- `getLibraryHomeTooltipText()` -- used in 0 specs
- `getMenueItemCount()` -- used in 0 specs
- `getMessageContainerInSnapshotBannerText()` -- used in 0 specs
- `getNavigationBarBackgroundColor()` -- used in 0 specs
- `getNewBookmarkNumber()` -- used in 0 specs
- `getNoPrivillegeTooltip()` -- used in 0 specs
- `getNotificationErrorMessage()` -- used in 0 specs
- `getNotificationMsg()` -- used in 0 specs
- `getOrderListItemsCount()` -- used in 0 specs
- `getOrderSelectedText(rowNum)` -- used in 0 specs
- `getPage({ chapterName, pageName })` -- used in 0 specs
- `getPaletteNames()` -- used in 0 specs
- `getRecipientDefaultHintText()` -- used in 0 specs
- `getRemoveButtonByName(user)` -- used in 0 specs
- `getRichTextBoxByAriaLabel(ariaLabel)` -- used in 0 specs
- `getRichTextBoxByContent(textContent)` -- used in 0 specs
- `getSearchResultText()` -- used in 0 specs
- `getSelectedCount()` -- used in 0 specs
- `getShareAllBookmarksLink()` -- used in 0 specs
- `getShareButtonText()` -- used in 0 specs
- `getShareDialogTitle()` -- used in 0 specs
- `getShareDossierPanelItemsName()` -- used in 0 specs
- `getSortByListItemsCount()` -- used in 0 specs
- `getSortBySelectedText(rowNum)` -- used in 0 specs
- `getSortRowsCount()` -- used in 0 specs
- `getTargetACLItem(user, targetACL)` -- used in 0 specs
- `getTextFieldText(textField)` -- used in 0 specs
- `getTextFiledTitle(text)` -- used in 0 specs
- `getTOCUnpin()` -- used in 0 specs
- `getUserCurrentACL(user)` -- used in 0 specs
- `getUserItemByName(user)` -- used in 0 specs
- `goBack()` -- used in 0 specs
- `goToPagenoWait({ chapterName, pageName })` -- used in 0 specs
- `goToPageWait({ chapterName, pageName })` -- used in 0 specs
- `hidePageIndicator()` -- used in 0 specs
- `hoverACL(name)` -- used in 0 specs
- `hoverHorizontalTocMenu(pageName)` -- used in 0 specs
- `hoverOnAdvanceEditor()` -- used in 0 specs
- `hoverOnCertifiedIcon()` -- used in 0 specs
- `hoverOnLibraryIcon()` -- used in 0 specs
- `hoverOnPanelStack()` -- used in 0 specs
- `hoverOnResetButton()` -- used in 0 specs
- `hoverOnSwiperPage()` -- used in 0 specs
- `hoverOnTemplateIcon()` -- used in 0 specs
- `hoverOnVisualizationByLabel(label = 'Visualization 1 copy')` -- used in 0 specs
- `hoverOnVisualizationMenuButton()` -- used in 0 specs
- `hoverPageInHorizontalTocMenu(pageName)` -- used in 0 specs
- `ignoreNotification()` -- used in 0 specs
- `includeAllBookmarksInTeams()` -- used in 0 specs
- `inputDossierNameAndSave(objectName)` -- used in 0 specs
- `inviteUser(option, param)` -- used in 0 specs
- `isAccountDividerPresent()` -- used in 0 specs
- `isAccountIconPresent()` -- used in 0 specs
- `isAccountOptionPresent(text)` -- used in 0 specs
- `isAddButtonEnabled()` -- used in 0 specs
- `isAddMessageTextAreaDisabled()` -- used in 0 specs
- `isAdvancedSortEditorPresent()` -- used in 0 specs
- `isAllOptionPresent()` -- used in 0 specs
- `isApplyButtonDisabled()` -- used in 0 specs
- `isBMListPresent()` -- used in 0 specs
- `isButtonConntextMenuPresent(btnText)` -- used in 0 specs
- `isCancelButtonEnabled()` -- used in 0 specs
- `isCertifiedIconDisplayedInTitleBar()` -- used in 0 specs
- `isChangeACLPresent()` -- used in 0 specs
- `isColumnsSelected()` -- used in 0 specs
- `isCreateSnapshotIconPresent(name, sectionName)` -- used in 0 specs
- `isDatasetElementPresent(name)` -- used in 0 specs
- `isDatasetlistEmpty()` -- used in 0 specs
- `isDeleteBMPresent(name, sectionName)` -- used in 0 specs
- `isDownloadDossierEnabled()` -- used in 0 specs
- `isDownloadDossierPresent()` -- used in 0 specs
- `isDuplicateButtonDisplayed()` -- used in 0 specs
- `isEditIconPresent()` -- used in 0 specs
- `isEditorWindowOpened()` -- used in 0 specs
- `isExportExcelDisable()` -- used in 0 specs
- `isExportPDFEnabled()` -- used in 0 specs
- `isExportPDFPresent()` -- used in 0 specs
- `isFavoriteSelected()` -- used in 0 specs
- `isFavoritesIconPresent()` -- used in 0 specs
- `isGetLinkPresent()` -- used in 0 specs
- `isGroupItemDisabled(name)` -- used in 0 specs
- `isGroupMemberPresent(name)` -- used in 0 specs
- `isHomeIconPresent()` -- used in 0 specs
- `isImagePresent(text)` -- used in 0 specs
- `isInviteEnabled()` -- used in 0 specs
- `isInviteUserPresent()` -- used in 0 specs
- `isLibraryIconPresent()` -- used in 0 specs
- `isLogoutPresent()` -- used in 0 specs
- `isManageAccessPresent()` -- used in 0 specs
- `isNavigationBarCollapsedIconPresent()` -- used in 0 specs
- `isNavigationBarPresent()` -- used in 0 specs
- `isNewBookmarkIconPresent()` -- used in 0 specs
- `isNoBookmarksPanelPresent()` -- used in 0 specs
- `isNoPrivillegeTooltipDisplayed()` -- used in 0 specs
- `isNotificationErrorPresent()` -- used in 0 specs
- `isNotificationPresent()` -- used in 0 specs
- `isOnDossierPage()` -- used in 0 specs
- `isOptionExistInMenu(subOption)` -- used in 0 specs
- `isPageTitlePresent()` -- used in 0 specs
- `isPaletteChecked(paletteName)` -- used in 0 specs
- `isPaletteSelected(subOption)` -- used in 0 specs
- `isRecipientSearchBoxDisabled()` -- used in 0 specs
- `isRedoEnabled()` -- used in 0 specs
- `isRevertFilterDisplayed()` -- used in 0 specs
- `isRowsSelected()` -- used in 0 specs
- `isRunInBackgroundButtonDisplayed()` -- used in 0 specs
- `isSaveButtonEnabled()` -- used in 0 specs
- `isSendEmailPresent()` -- used in 0 specs
- `isSendIconPresent(name)` -- used in 0 specs
- `isShareBotPresent()` -- used in 0 specs
- `isShareButtonEnabled()` -- used in 0 specs
- `isSharedBMPresent(name, sectionName)` -- used in 0 specs
- `isSharedIconPresent(name)` -- used in 0 specs
- `isShareDossierPresent()` -- used in 0 specs
- `isSharedStatusIconPresent(name)` -- used in 0 specs
- `isShareIconDisabled()` -- used in 0 specs
- `isShareIconPresent()` -- used in 0 specs
- `isSharePanelItemExisted(name)` -- used in 0 specs
- `isSortByDisabled()` -- used in 0 specs
- `isTextPresent(text)` -- used in 0 specs
- `isUndoEnabled()` -- used in 0 specs
- `isUserACLExisted(user)` -- used in 0 specs
- `linkToOtherDataset(datasetName, itemName, attributeToLinkTo)` -- used in 0 specs
- `linkToOtherDataset(datasetName, itemName)` -- used in 0 specs
- `notSaveDossier()` -- used in 0 specs
- `openACL()` -- used in 0 specs
- `openACL(name)` -- used in 0 specs
- `openACLInSearchSection()` -- used in 0 specs
- `openAndSelectOrder(rowNum, item)` -- used in 0 specs
- `openAndselectSortBy(rowNum, item)` -- used in 0 specs
- `openAndselectSortByAndOrder(rowNum, sortby, order)` -- used in 0 specs
- `openDropdown(el)` -- used in 0 specs
- `openExportCSVSettingsWindow()` -- used in 0 specs
- `openExportPDFSettingsWindow()` -- used in 0 specs
- `openExportToGoogleSheetsDialog()` -- used in 0 specs
- `openInfoWindowContainerFormatPanel()` -- used in 0 specs
- `openLimitElementSourceMenu(attributesMetricsName)` -- used in 0 specs
- `openLimitElementSourceMenuInCanvas(attributesMetricsName)` -- used in 0 specs
- `openManageAccessDialog()` -- used in 0 specs
- `openManageAccessEditor(chapterName)` -- used in 0 specs
- `openMenuByClick(el)` -- used in 0 specs
- `openMenuNoCheck()` -- used in 0 specs
- `openOrderDropdown(rowNum)` -- used in 0 specs
- `openPageFromTocMenunoWait({ chapterName, pageName })` -- used in 0 specs
- `openPageFromTocMenuWait({ chapterName, pageName })` -- used in 0 specs
- `openPanelStackTitleContainerFormatPanel()` -- used in 0 specs
- `openPinInTeamsDialog()` -- used in 0 specs
- `openShareBotDialog()` -- used in 0 specs
- `openShareDropDown()` -- used in 0 specs
- `openSortByDropdown(rowNum)` -- used in 0 specs
- `openSubscribeSettingsWindow()` -- used in 0 specs
- `openTocInMobileView()` -- used in 0 specs
- `pasteTextFieldbyDoubleClick(textField)` -- used in 0 specs
- `pinBot()` -- used in 0 specs
- `refreshDossier()` -- used in 0 specs
- `removeACL(name)` -- used in 0 specs
- `removeFavoriteByTOC()` -- used in 0 specs
- `resetDossier()` -- used in 0 specs
- `resetDossierIfPossible()` -- used in 0 specs
- `resetDossierNoWait()` -- used in 0 specs
- `save()` -- used in 0 specs
- `saveAndOpen()` -- used in 0 specs
- `saveManageAccessChange(waitForSuccessToast = true)` -- used in 0 specs
- `saveNewADC(objectName)` -- used in 0 specs
- `saveNewDossier(dossierName)` -- used in 0 specs
- `saveNewObject(objectName)` -- used in 0 specs
- `saveNewObjectCommon(objectName, saveButton)` -- used in 0 specs
- `scrollListToBottom()` -- used in 0 specs
- `searchDataset(text)` -- used in 0 specs
- `searchInSelectedList(userOrGroup)` -- used in 0 specs
- `searchRecipient(searchKey)` -- used in 0 specs
- `searchSelectDataset(text)` -- used in 0 specs
- `searchUserGroup(userOrGroup)` -- used in 0 specs
- `selectApplyToAll()` -- used in 0 specs
- `selectChannelAndPinBot({ team: teamName, channel: channelName })` -- used in 0 specs
- `selectChannelToPinBot({ team: teamName, channel: channelName })` -- used in 0 specs
- `selectElementSource(attributesMetricsName, source)` -- used in 0 specs
- `selectElementSourceInFilterInCanvas(attributesMetricsName, source)` -- used in 0 specs
- `selectFromSuggestList(userOrGroup)` -- used in 0 specs
- `selectGroupRecipient(name)` -- used in 0 specs
- `selectLinkFromContextMenu(btnText, menuItemText)` -- used in 0 specs
- `selectOrderDropdownItem(item)` -- used in 0 specs
- `selectOverwriteForAll()` -- used in 0 specs
- `selectPageSize(optionText)` -- used in 0 specs
- `selectRecipient(user)` -- used in 0 specs
- `selectSortByDropdownItem(item)` -- used in 0 specs
- `selectSuggestionItem(option, param)` -- used in 0 specs
- `setPulldown(newOption)` -- used in 0 specs
- `shareAllBookmarksFromIWToUser(dossier, userName)` -- used in 0 specs
- `shareInTeams()` -- used in 0 specs
- `slelectAllForGroupRecipient(name)` -- used in 0 specs
- `switchChapterInEditor(chapterName)` -- used in 0 specs
- `switchPageInAuthoring(pageName)` -- used in 0 specs
- `switchPulldown(currentOption, newOption)` -- used in 0 specs
- `switchToColumns()` -- used in 0 specs
- `switchToPanelTab(tab)` -- used in 0 specs
- `switchToRows()` -- used in 0 specs
- `switchViewMode(viewMode)` -- used in 0 specs
- `takeScreenshotByDocView(testCase, imageName, tolerance = 0.5)` -- used in 0 specs
- `textBGC(index)` -- used in 0 specs
- `toggleViewSelectedButton()` -- used in 0 specs
- `unhoverOnVisualizationMenuButton()` -- used in 0 specs
- `updateACL(name, targetACL)` -- used in 0 specs
- `userOrGroupIsAdded(userOrGroup)` -- used in 0 specs
- `userOrGroupIsChecked(userOrGroup)` -- used in 0 specs
- `userOrGroupIsNotChecked(userOrGroup)` -- used in 0 specs
- `viewPinnedObjectInTab()` -- used in 0 specs
- `waitForBookmarkLoading()` -- used in 0 specs
- `waitForBookmarkPanelPresent()` -- used in 0 specs
- `waitForDossierPageNotLoadIndicator()` -- used in 0 specs
- `waitForManageAccessLoading()` -- used in 0 specs
- `waitForPageLoadingMoreWaitTime(waitTime)` -- used in 0 specs
- `waitForSearchListPresent()` -- used in 0 specs

## Source Coverage

- `pageObjects/dossier/**/*.js`
- `specs/regression/dossier/**/*.{ts,js}`
- `specs/regression/dossierCreator/**/*.{ts,js}`
- `specs/regression/dossierlinking/**/*.{ts,js}`
- `specs/regression/DossierTransaction/**/*.{ts,js}`
- `specs/regression/DossierTransaction/Component/**/*.{ts,js}`
- `specs/regression/DossierTransaction/PythonTransaction/**/*.{ts,js}`
- `specs/regression/DossierTransaction/SQLTransaction/**/*.{ts,js}`
