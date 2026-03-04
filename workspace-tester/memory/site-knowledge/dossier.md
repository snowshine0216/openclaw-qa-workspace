# Site Knowledge: dossier

> Components: 16

### AdvancedSort
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SortEditor` | `.mstrmojo-AdvancedSortEditorReact` | element |
| `SortByDropdownList` | `.mstr-advanced-sort-orderSelect-dropdown__dropdown-list` | dropdown |
| `OrderDropdownList` | `.mstr-advanced-sort-sortSelect-dropdown__dropdown-list` | dropdown |

**Actions**
| Signature |
|-----------|
| `hoverOnAdvanceEditor()` |
| `getEditorBtn(text)` |
| `openDropdown(el)` |
| `openSortByDropdown(rowNum)` |
| `openOrderDropdown(rowNum)` |
| `selectSortByDropdownItem(item)` |
| `selectOrderDropdownItem(item)` |
| `openAndselectSortBy(rowNum, item)` |
| `openAndSelectOrder(rowNum, item)` |
| `openAndselectSortByAndOrder(rowNum, sortby, order)` |
| `delete(rowNum)` |
| `switchToRows()` |
| `switchToColumns()` |
| `save()` |
| `cancel()` |
| `scrollListToBottom()` |
| `getSortRowsCount()` |
| `getSortByListItemsCount()` |
| `getOrderListItemsCount()` |
| `getSortBySelectedText(rowNum)` |
| `getOrderSelectedText(rowNum)` |
| `isRowsSelected()` |
| `isColumnsSelected()` |
| `isSortByDisabled()` |
| `isAdvancedSortEditorPresent()` |

**Sub-components**
- dossierPage
- getSortRulesContainer
- getSortRulesPanel

---

### Bookmark
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `BookmarkIcon` | `.mstr-nav-icon.icon-tb_bookmarks_n:not([disabled])` | element |
| `NewBookmarkReminder` | `.mstrd-Badge--show` | element |
| `Panel` | `.mstrd-DropdownMenu-main` | dropdown |
| `NoBookmarks` | `.mstrd-DropdownMenu-content` | dropdown |
| `SaveChangesDialog` | `.mstrd-SaveChangesDialog-inner` | element |
| `LabelInTitle` | `.mstrd-NavBarTitle-item-active` | element |
| `BookmarkIconDisabled` | `.mstrd-NavItemWrapper.mstrd-BookmarkNavItem.mstr-navbar-item[disabled]` | element |
| `AddNewButtonDisabled` | `.mstrd-BookmarkDropdownMenuContainer-bMsHeaderIcon.icon-pnl_add-new[disabled]` | dropdown |
| `Notification` | `.ant-popover-inner-content ` | element |
| `NoPrivillegeTooltip` | `.ant-tooltip.mstrd-Tooltip .ant-tooltip-inner` | element |
| `BookmarkSpinner` | `.mstrd-BookmarkDropdownMenuContainer-addNewSection .mstrd-Spinner` | dropdown |

**Actions**
| Signature |
|-----------|
| `getLabelInTitle()` |
| `getBookmarkListHeight()` |
| `getBookmarkContainerHeight()` |
| `getNoPrivillegeTooltip()` |
| `openPanel()` |
| `cancelInputName()` |
| `closePanel()` |
| `addNewBookmark(name)` |
| `hoverOnBookmark(name, sectionName = 'MY BOOKMARKS')` |
| `deleteBookmark(name, sectionName = 'MY BOOKMARKS')` |
| `deleteBookmarkWithoutConfirm(name, sectionName = 'MY BOOKMARKS')` |
| `renameBookmark(name, newName)` |
| `applyBookmark(name, sectionName = 'MY BOOKMARKS', option = { isWait: true })` |
| `updateBookmark(name)` |
| `shareBookmark(name, sectionName)` |
| `ignoreSaveReminder()` |
| `keepSaveReminder()` |
| `createBookmarksByDefault(number)` |
| `deleteBookmarksByDefault(number)` |
| `editBulkDeleteBookmarks()` |
| `selectBookmarkToDeleteByName(name)` |
| `selectAllToDelete()` |
| `bulkDeleteBookmarks()` |
| `confirmDelete()` |
| `cancelDelete()` |
| `confirmNotification()` |
| `dismissNotification()` |
| `ignoreNotification()` |
| `dismissTooltip()` |
| `createSnapshot(name, sectionName = 'MY BOOKMARKS')` |
| `isPanelOpen()` |
| `bookmarkCount(sectionName = 'MY BOOKMARKS')` |
| `bookmarkTotalCount()` |
| `getAddBookmarkErrorMsg()` |
| `waitForBookmarkPanelPresent()` |
| `isBookmarkEnabled()` |
| `isBookmarkPresent(name, sectionName = 'MY BOOKMARKS')` |
| `isSaveChangesDialogPresent()` |
| `isBookmarkLabelPresent()` |
| `isErrorInputDialogPresent()` |
| `isSharedIconPresent(name)` |
| `isNotificationPresent()` |
| `isSharedStatusIconPresent(name)` |
| `isSendIconPresent(name)` |
| `isSharedBMPresent(name, sectionName)` |
| `isDeleteBMPresent(name, sectionName)` |
| `isUpdateBMPresent(name, sectionName = 'MY BOOKMARKS')` |
| `hideBookmarkTimeStamp()` |
| `showBookmarkTimeStamp()` |
| `clickAddBtn()` |
| `saveBookmark()` |
| `waitForBookmarkLoading()` |
| `labelInTitle()` |
| `isNewBookmarkIconPresent()` |
| `getNewBookmarkNumber()` |
| `getNotificationMsg()` |
| `getNotificationErrorMessage()` |
| `isNotificationErrorPresent()` |
| `getCapsureText(name)` |
| `isNoBookmarksPanelPresent()` |
| `isBookmarkAddtoLibraryMsgPresent()` |
| `isNoPrivillegeTooltipDisplayed()` |
| `isCreateSnapshotIconPresent(name, sectionName)` |
| `getBookmarkTooltipText()` |

**Sub-components**
- getPanel
- getBookmarksContainer

---

### DashboardMenuBar
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `DashboardMenuBarContainer` | `.mstrmojo-RootView-menubar` | element |
| `SubMenuContainer` | `.mstrmojo-ui-Menu-item-container` | element |

**Actions**
| Signature |
|-----------|
| `clickDashboardMenuBar({ menu, subMenu, isClose = true })` |
| `toggleSetAsTemplate()` |
| `toggleCertify()` |
| `openFileMenu()` |
| `clickSaveInMenuBar()` |
| `isTemplateIconDisplayedInTitleBar()` |
| `isCertifiedIconDisplayedInTitleBar()` |

**Sub-components**
- getDashboardMenuBarContainer
- getTitleContainer
- getSubMenuContainer

---

### DossierAuthoringPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SaveDossierButton` | `.item.mb.save-dropdown .btn` | button |
| `DirectSaveDossierButton` | `.item.btn.save .btn` | button |
| `SaveDossierDropdownItem` | `.item.save1.mstrmojo-ui-Menu-item` | element |
| `SaveAndOpenDropdownItem` | `.item.saveAndOpen.mstrmojo-ui-Menu-item` | element |
| `SaveDossierFolderButton` | `.mstrmojo-Button.mstrmojo-WebButton.hot.okButton` | button |
| `SaveInProgressBox` | `.mstrmojo-Editor.mstrWaitBox.saving-in-progress` | element |
| `SaveAsDossierButton` | `.item.saveAs` | element |
| `CloseDossierButton` | `.item.btn.close` | button |
| `LibraryIcon` | `.item.btn.library` | button |
| `DossierView` | `.mstrmojo-DocPanel-wrapper.mstrmojo-scrollbar-host` | element |
| `VizView` | `.gm-main-container` | element |
| `SaveAsEditor` | `.mstrmojo-SaveAsEditor` | element |
| `AutoDashboardWelcomePopup` | `.ai-assistant-tooltip` | element |
| `ApplyButton` | `.item.btn.apply` | button |
| `DisabledApplyButton` | `.item.btn.apply.disabled` | button |
| `CancelButton` | `.item.btn.cancel` | button |
| `DossierTitleText` | `.mstr-macro-texts` | element |
| `DownloadButton` | `.item.download` | element |
| `SelectDatasetDiag` | `.mstrmojo-vi-dataset-picker.mstrmojo-vi-dataset-picker` | element |
| `ContextMenu` | `.mstrmojo-ui-Menu-item-container` | element |
| `DatasetPanel` | `.mstrmojo-RootView-datasets` | element |
| `RefreshButtonOnToolbar` | `.item.btn.refresh` | button |
| `TocPanel` | `.mstrmojo-TableOfContents` | element |
| `DashboardPropertiesEditor` | `.mstrmojo-DocProps-Editor` | element |
| `PanelStackHeader` | `.mstrmojo-PanelTabStrip` | element |
| `MaxRestoreBtn` | `.hover-btn.hover-max-restore-btn.visible` | button |
| `TitleMaxRestoreBtn` | `.maximize.mstrmojo-UnitContainer-titleButton-small` | button |
| `PanelStackLeftArrow` | `.left-arrow-btn.visible` | button |
| `FreeformLayoutPage` | `.mstrmojo-DocSubPanel-containerNode` | element |
| `ToggleBar` | `.mstrmojo-RootView-togglebar` | element |
| `ChangeViewModeButton` | `.item.changeViewMode` | element |
| `PageSizeButton` | `.item.pageSetting` | element |

**Actions**
| Signature |
|-----------|
| `getPaletteNames()` |
| `isPaletteChecked(paletteName)` |
| `clickOnCheckboxWithTitle(title)` |
| `clickOnExecutionMode()` |
| `clickOnDashboardPropertiesEditorButton(buttonName)` |
| `clickTextFormatBtn(type)` |
| `changeNoDataTextColor(color)` |
| `isNoDataFormatButtonSelected(type)` |
| `inputNoDataText(text)` |
| `clickBtnWithLabel(label)` |
| `waitForAuthoringPageLoading()` |
| `dismissAutoDashboardWelcomePopup()` |
| `actionOnToolbar(buttonName)` |
| `actionOnMenubar(menuOption)` |
| `actionOnSubmenuNoContinue(subOption)` |
| `actionOnSubmenu(subOption, notShow = false)` |
| `actionOnMenubarWithSubmenu(menuOption, subOption, seconds = 20, notShow = false)` |
| `checkNotShowAgain()` |
| `actionOnEditorDialog(option)` |
| `clickCloseDossierButton()` |
| `closeDossierWithoutSaving()` |
| `goToLibrary()` |
| `saveNewObjectCommon(objectName, saveButton)` |
| `saveNewObject(objectName)` |
| `saveNewADC(objectName)` |
| `saveAsNewObject(objectName)` |
| `inputDossierNameAndSave(objectName)` |
| `saveNewDossier(dossierName)` |
| `clickSaveDossierButton(dossierName)` |
| `clickSaveDossierButtonWithWait()` |
| `saveAndOpen()` |
| `clickToDismissPopups()` |
| `refreshDossier()` |
| `downLoadDossier()` |
| `isEditorWindowOpened()` |
| `isPaletteSelected(subOption)` |
| `notSaveDossier()` |
| `searchSelectDataset(text)` |
| `searchDataset(text)` |
| `isDatasetlistEmpty()` |
| `getMenueItemCount()` |
| `openMenuByClick(el)` |
| `isOptionExistInMenu(subOption)` |
| `isOptionDisabledInMenu(subOption)` |
| `addExistingObjects()` |
| `addNewSampleData(sampleDataIndex, prepare)` |
| `addNewSampleDataSaaS(sampleDataIndex, prepare)` |
| `isApplyButtonDisabled()` |
| `linkToOtherDataset(datasetName, itemName)` |
| `clickLoadingDataCancelButton()` |
| `switchToPanelTab(tab)` |
| `getDatasetNamesInDatasetsPanel()` |
| `addParameterToFilterPanel(name)` |
| `addParameterToParameterSelector(name, index)` |
| `addDatasetElementToDropzone(name, dropzoneName)` |
| `isDatasetElementPresent(name)` |
| `deleteUnstructuredDataItem(name)` |
| `hoverOnPanelStack()` |
| `hoverOnVisualizationByLabel(label = 'Visualization 1 copy')` |
| `clickVisualizationByLabel(label = 'Visualization 1 copy')` |
| `clickMaxRestoreBtn()` |
| `clickTitleMaxRestoreBtn()` |
| `openPanelStackTitleContainerFormatPanel()` |
| `openInfoWindowContainerFormatPanel()` |
| `isBtnDisabled(buttonName)` |
| `getTitleBarSetting()` |
| `getTitleStyle(value)` |
| `setTitleStyle(value)` |
| `getTitleFontFamily(line)` |
| `getTitleFontSize(line)` |
| `getTitleFontColor(line)` |
| `switchPageInAuthoring(pageName)` |
| `copyQueryDetails()` |
| `closeQueryDetail()` |
| `getCurrentChangeViewModeText()` |
| `clickChangeViewModeButton()` |
| `changeViewModeTo(optionText)` |
| `clickPageSizeButton()` |
| `clickPageSizeFromMoreOptions()` |
| `selectPageSize(optionText)` |
| `closeSavedSuccessfullyToast()` |

**Sub-components**
- dossierPage
- libraryAuthoringPage
- datasetsPanel
- editorPanel
- baseFormatPanel
- togglePanel
- datasetPanel
- getDatasetPanel
- dossierAuthoringPage
- waitForAuthoringPage
- switchToPanel
- getPanel
- getTitleAndContainer
- getInfoWindowByLabelInLayersPanel
- getAuthoringPage
- getPage

---

### DossierPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `HamburgerIcon` | `.mstrd-HamburgerIconContainer-icon` | element |
| `LeftNavBar` | `.mstrd-NavBar.mstrd-NavBar-left` | element |
| `PageLoadingIcon` | `.mstrd-LoadingIcon-loader` | element |
| `PageTitle` | `.mstrd-NavBarTitle-item.mstrd-NavBarTitle-item-active` | element |
| `LibraryIcon` | `.mstr-nav-icon.icon-library,.mstrd-LibraryNavItem-link` | element |
| `SaaSLibraryIcon` | `.mstrd-LibraryNavItem-link` | element |
| `ActivePageContainer` | `.mstrd-Page.activePage` | element |
| `PageIndicator` | `.mstrd-DossierPageIndicator` | element |
| `ShowPageIndicator` | `.mstrd-DossierPageIndicator.mstrd-show` | element |
| `DossierLinkNav` | `.mstrd-BackNavItem, .icon-backarrow` | element |
| `DossierView` | `.mstrd-DossierViewContainer-main` | element |
| `VizView` | `.gm-main-container` | element |
| `NavigationBar` | `.mstrd-NavBarWrapper` | element |
| `NavigationBarCollapsedIcon` | `.mstrd-NavBarTriggerWrapper` | element |
| `HomeIcon` | `.mstr-nav-icon[class*=icon-tb_home]` | element |
| `FavoriteIcon` | `.mstrd-FavoriteIconButton` | button |
| `UndoIcon` | `.mstrd-UndoNavItem .icon-tb_undo` | element |
| `RedoIcon` | `.mstrd-RedoNavItem .icon-tb_redo` | element |
| `SharePanel` | `.mstrd-ShareDropdownMenuContainer` | dropdown |
| `CommentsIcon` | `.mstrd-CommentIcon` | element |
| `DossierViewModeIcon` | `.mstrd-ViewModeNavItemContainer` | element |
| `RevertFilter` | `.mstrd-Button.mstrd-Button--primary` | button |
| `VisualizationMenuButton` | `.hover-menu-btn` | button |
| `AddToLibrary` | `.mstrd-PublishButton` | button |
| `InfoWindowLoadingIcon` | `mstrd-CursorSpinner--visible` | element |
| `RunInBackgroundButton` | `.mstrd-AddToHistoryButton` | button |
| `CancelExecutionButton` | `.mstrd-CancelExecutionButton` | button |
| `EditIcon` | `.icon-info_edit` | element |
| `RightNavBar` | `.mstrd-NavBar.mstrd-NavBar-right` | element |
| `DuplicateButton` | `.mstrd-DuplicateNavItem` | element |
| `Tooltip` | `.ant-tooltip:not(.ant-tooltip-hidden)` | element |
| `ResetIcon` | `.icon-tb_reset` | element |
| `ConfirmResetButton` | `.mstrd-ConfirmationDialog-button` | button |
| `TemplateIcon` | `.mstrd-DossierTitle .mstrd-TemplateIcon` | element |
| `CertifiedIcon` | `.mstrd-DossierTitle .mstrd-CertifiedIcon` | element |
| `DossierPageNotLoadIndicator` | `.mstrd-DossierPageNotLoadIndicator` | element |
| `FloatLoadingIndicator` | `.mstrd-dashboard-float-loading` | element |

**Actions**
| Signature |
|-----------|
| `hoverOnVizGroup()` |
| `openShareDropDown()` |
| `favorite()` |
| `removeFavorite()` |
| `closeShareDropDown()` |
| `reload()` |
| `goBack()` |
| `getNavigationBarBackgroundColor()` |
| `getCurrentPageByKey()` |
| `pageTitle()` |
| `clickPageTitle()` |
| `clickSaaSLibraryIcon()` |
| `clickBtnByTitle(text)` |
| `clickTextfieldByTitle(text)` |
| `hoverOnTextfieldByTitle(text)` |
| `clickImage()` |
| `clickShape()` |
| `clickImageLinkByTitle(text)` |
| `selectLinkFromContextMenu(btnText, menuItemText)` |
| `clickHamburgerMenu()` |
| `waitForDossierLoading()` |
| `waitForPageLoading()` |
| `waitForPageLoadingMoreWaitTime(waitTime)` |
| `waitForInfoWindowLoading()` |
| `goToLibrary()` |
| `switchPageByKey(direction, delay)` |
| `goBackFromDossierLink()` |
| `openUserAccountMenu()` |
| `closeUserAccountMenu()` |
| `clickDuplicateButton()` |
| `logout(options = {})` |
| `addToLibrary()` |
| `cancelAddToLibrary()` |
| `clickUndo()` |
| `clickOpenDashboardOnSnapshotBanner()` |
| `dismissSnapshotBanner()` |
| `clickUndoInDossier()` |
| `clickRedo()` |
| `clickRedoInDossier()` |
| `resetDossier()` |
| `resetDossierNoWait()` |
| `resetDossierIfPossible()` |
| `waitForPageIndicatorDisappear()` |
| `hidePageIndicator()` |
| `clickHomeIcon()` |
| `isLibraryIconPresent()` |
| `isBackIconPresent()` |
| `isNavigationBarPresent()` |
| `isPageTitlePresent()` |
| `isAccountIconPresent()` |
| `isAccountDividerPresent()` |
| `isAccountOptionPresent(text)` |
| `isLogoutPresent()` |
| `isAddToLibraryDisplayed()` |
| `isNavigationBarCollapsedIconPresent()` |
| `title()` |
| `currentPageIndicator()` |
| `isOnDossierPage()` |
| `isRevertFilterDisplayed()` |
| `clickAddToLibraryButton()` |
| `clickDossierPanelStackSwitchTab(text)` |
| `clickDossierPanelStackRightSwitchArrow()` |
| `clickDossierPanelStackLeftSwitchArrow()` |
| `closePopupsByClickBlankPathinRsd()` |
| `expandCollapsedNavBar()` |
| `hoverOnCertifiedIcon()` |
| `hoverOnTemplateIcon()` |
| `isButtonConntextMenuPresent(btnText)` |
| `hoverOnLibraryIcon()` |
| `isImagePresent(text)` |
| `isHomeIconPresent()` |
| `isFavoriteSelected()` |
| `getDossierChapterTooltip()` |
| `getDossierPageTooltip()` |
| `isEditIconPresent()` |
| `clickEditIcon()` |
| `clickCloseBtn()` |
| `clickVisibleButtonByAriaLabel(labelText = 'Cancel')` |
| `isUndoEnabled()` |
| `isRedoEnabled()` |
| `waitForDossierPageNotLoadIndicator()` |
| `getLibraryHomeTooltipText()` |
| `checkImageCompareForDocView(testCase, imageName)` |
| `takeScreenshotByDocView(testCase, imageName, tolerance = 0.5)` |
| `doesMstrRootHaveErrorClass()` |
| `isDuplicateButtonDisplayed()` |
| `switchViewMode(viewMode)` |
| `getFavoriteTooltipText()` |
| `closeInfoWindow()` |
| `clickRunInBackgroundButton()` |
| `isRunInBackgroundButtonDisplayed()` |
| `getMessageContainerInSnapshotBannerText()` |
| `clickCancelExecutionButton(option)` |
| `clickCancelExecutionButtonInCurrentPage(option)` |
| `isCancelButtonDisplayed()` |
| `hoverOnSwiperPage()` |
| `hoverOnVisualizationMenuButton()` |
| `unhoverOnVisualizationMenuButton()` |

**Sub-components**
- getActivePageContainer
- getPage
- getSharePanel
- getSnapshotBannerContainer
- getCurrentPage
- waitForPage
- getShowPage
- getDossierPanel
- getTooltipContainer
- getTitle_Page
- getDossierPage
- getDisplayedPage
- getMessageContainer
- getCancelExecutionButtonByPage

---

### DossierTextField
> Extends: `BaseContainer`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `TextFields` | `body` | element |

**Actions**
| Signature |
|-----------|
| `clickTextFieldByTextContent(text)` |
| `getRichTextBoxByContent(textContent)` |
| `clickRichTextBoxByContent(textContent)` |
| `getRichTextBoxByAriaLabel(ariaLabel)` |
| `clickRichTextBoxByAriaLabel(ariaLabel)` |
| `clickRichTextBoxElement(richTextBox)` |
| `getHeight(textFieldText)` |
| `clickTextField(textFieldText)` |
| `doubleClickTextField(textFieldText)` |
| `getTextFieldText(textField)` |
| `editTextFieldbyDoubleClick(textField, newText)` |
| `pasteTextFieldbyDoubleClick(textField)` |
| `getTextFiledTitle(text)` |
| `isTextPresent(text)` |

**Sub-components**
- getContainer

---

### HtmlContainer
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| _none_ |

**Sub-components**
_none_

---

### HTMLPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `textBGC(index)` |

**Sub-components**
_none_

---

### LimitElementSource
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `openLimitElementSourceMenu(attributesMetricsName)` |
| `selectElementSource(attributesMetricsName, source)` |
| `clickOutside()` |
| `clickOutsideElementSourceSelection(attributesMetricsName)` |
| `openLimitElementSourceMenuInCanvas(attributesMetricsName)` |
| `selectElementSourceInFilterInCanvas(attributesMetricsName, source)` |

**Sub-components**
- dossierAuthoringPage

---

### LinkAttributes
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `linkToOtherDataset(datasetName, itemName, attributeToLinkTo)` |

**Sub-components**
- dossierPage
- libraryAuthoringPage
- datasetsPanel
- dossierAuthoringPage

---

### ManageAccessDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ManageAccessDialog` | `.mstrd-ManageAccessContainer-main` | element |
| `ManageAccessDialogHeader` | `.mstrd-ManageAccessContainer-header` | element |
| `ManageAccessDialogContent` | `.mstrd-ManageAccessContainer-content` | element |
| `SuccessToast` | `.mstrd-FloatNotifications` | element |
| `SuccessToastCloseButton` | `.mstrd-FloatNotifications-closeButton` | button |

**Actions**
| Signature |
|-----------|
| `getUserItemByName(user)` |
| `getRemoveButtonByName(user)` |
| `getChangeACLButtonByName(user)` |
| `getChangeACLDropDownMenu(user)` |
| `getTargetACLItem(user, targetACL)` |
| `searchRecipient(searchKey)` |
| `selectRecipient(user)` |
| `selectGroupRecipient(name)` |
| `getUserCurrentACL(user)` |
| `cancelManageAccessChange()` |
| `saveManageAccessChange(waitForSuccessToast = true)` |
| `closeDialog()` |
| `hoverACL(name)` |
| `openACL(name)` |
| `openACLInSearchSection()` |
| `removeACL(name)` |
| `updateACL(name, targetACL)` |
| `addACL(userList, groupList, targetACL)` |
| `selectApplyToAll()` |
| `selectOverwriteForAll()` |
| `waitForManageAccessLoading()` |
| `isSaveButtonEnabled()` |
| `isAddButtonEnabled()` |
| `isCancelButtonEnabled()` |
| `isManageAccessPresent()` |
| `getACLItemscount()` |
| `isUserACLExisted(user)` |

**Sub-components**
_none_

---

### ManageAccessEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ManageAccessEditor` | `.mstrmojo-ManageAccess-Editor` | element |
| `ManageAccessEditorContentView` | `.mstrmojo-Box .content-view` | element |
| `AddUserGroupSearchArea` | `.mstrmojo-SimpleObjectInputBox-container` | input |
| `SearchSuggestList` | `.mstrmojo-suggest-list.acl-list` | element |
| `ExistingUserGroupSearchBox` | `.mstrmojo-TextBox.acl-filter-box` | element |

**Actions**
| Signature |
|-----------|
| `openManageAccessEditor(chapterName)` |
| `switchPulldown(currentOption, newOption)` |
| `setPulldown(newOption)` |
| `searchUserGroup(userOrGroup)` |
| `selectFromSuggestList(userOrGroup)` |
| `clickAddUserButton()` |
| `clickButton(btnName)` |
| `searchInSelectedList(userOrGroup)` |
| `checkUserOrGroupFromExistingList(userOrGroup)` |
| `userOrGroupIsChecked(userOrGroup)` |
| `userOrGroupIsNotChecked(userOrGroup)` |
| `userOrGroupIsAdded(userOrGroup)` |
| `switchChapterInEditor(chapterName)` |
| `chapterIsLocked(chapterName)` |
| `chapterIsUnLocked(chapterName)` |
| `toggleViewSelectedButton()` |
| `chapterIsDisplayedInTOC(chapterName)` |
| `errorMsgIsDisplayed(errorMsg)` |
| `clickShowDetails()` |

**Sub-components**
- dossierAuthoringPage

---

### Reset
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ResetButton` | `.mstrd-NavItemWrapper.mstrd-ResetNavItem.mstr-navbar-item` | element |
| `ConfirmDialog` | `.mstrd-SliderConfirmDialog-content` | element |
| `PageLoadingIcon` | `.mstrd-LoadingIcon-content--visible` | element |

**Actions**
| Signature |
|-----------|
| `selectReset()` |
| `confirmReset(isPrompted)` |
| `confirmResetNoWait()` |
| `cancelReset()` |
| `resetIfEnabled()` |
| `isResetPresent()` |
| `isResetDisabled()` |
| `hoverOnResetButton()` |

**Sub-components**
- dossierPage

---

### Share
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ShareIcon` | `.mstr-nav-icon.icon-tb_share_n` | element |
| `SharePanel` | `.mstrd-ShareDropdownMenuContainer .mstrd-DropdownMenu-main` | dropdown |
| `ShareDossierPanel` | `.mstrd-ShareDossierContainer-main` | element |
| `PinInTeamsDialog` | `.mstrd-PinToTeamsTabDialog-main` | element |
| `HeaderPinInTeamsDialog` | `.mstrd-PinToTeamsTabDialog-top` | element |
| `ContentInPinInTeamsDialog` | `.mstrd-PinToTeamsTabDialog-content` | element |
| `TeamSelector` | `.ant-select-show-search` | dropdown |
| `DisabledChannelSelector` | `.ant-select-disabled` | dropdown |
| `PinInPinToTeamDialog` | `button.mstrd-PinToTeamsTabDialog-pinBtn` | button |
| `PinBotToast` | `.ant-message-notice-content` | element |
| `ViewInTabButton` | `.mstrd-PinToTeamsTabSuccessMessage-goToTab` | element |
| `CoverImage` | `.mstrd-ShareDossierContainer-imageHolder` | element |
| `InviteSearchBox` | `.mstrd-InviteSearchBox-input` | input |
| `InviteDetailPanel` | `.mstrd-InviteListDetailsPanel` | element |
| `InviteLIstSearchResults` | `.mstrd-InviteListSearchResults` | element |
| `FrequentlyInvitedPanel` | `.mstrd-InviteListFreqItems` | element |
| `NameAndTimeInShareDossierDialog` | `.mstrd-ShareDossierContainer-nameAndTime` | element |
| `SubscribeDetailsPanel` | `.mstrd-SubscriptionDialog` | element |

**Actions**
| Signature |
|-----------|
| `selectChannelToPinBot({ team: teamName, channel: channelName })` |
| `dismissCursorInSelector()` |
| `pinBot()` |
| `selectChannelAndPinBot({ team: teamName, channel: channelName })` |
| `viewPinnedObjectInTab()` |
| `closeShareDossierPanel()` |
| `selectSuggestionItem(option, param)` |
| `clickCopyButton()` |
| `closeSharePanel()` |
| `openExportPDFSettingsWindow()` |
| `openExportCSVSettingsWindow()` |
| `clickExportToExcel()` |
| `clickReportExportToExcel()` |
| `openSubscribeSettingsWindow()` |
| `closeExportPDFSettingsWindow()` |
| `downloadDossier()` |
| `waitForDownloadComplete({ name, fileType })` |
| `openManageAccessDialog()` |
| `openSharePanel()` |
| `clickShareInTeams()` |
| `clickPinInTeams()` |
| `shareInTeams()` |
| `openPinInTeamsDialog()` |
| `openShareDossierDialog()` |
| `openShareBotDialog()` |
| `clickInviteUser()` |
| `inviteUser(option, param)` |
| `clickInviteButton()` |
| `hideOwnerAndTimestampInShareDashboardDialog()` |
| `isInviteEnabled()` |
| `isGetLinkPresent()` |
| `isSendEmailPresent()` |
| `isExportPDFEnabled()` |
| `isDownloadDossierEnabled()` |
| `isShareIconPresent()` |
| `isShareIconDisabled()` |
| `isInviteUserPresent()` |
| `isShareDossierPresent()` |
| `isShareBotPresent()` |
| `isSharePanelItemExisted(name)` |
| `isSendEmailPresent()` |
| `isDownloadDossierPresent()` |
| `isExportPDFPresent()` |
| `isExportExcelDisable()` |
| `isCoverImageBlank()` |
| `getShareButtonText()` |
| `isManageAccessPresent()` |
| `getShareDossierPanelItemsName()` |
| `openExportToGoogleSheetsDialog()` |

**Sub-components**
- excelExportPanel
- getSharePanel
- getShareDossierPanel
- getCloseShareDossierPanel
- getInviteDetailPanel
- getSubscribeDetailsPanel
- openSharePanel
- getShareButtonInShareInTeamsPanel
- getFrequentlyInvitedPanel

---

### ShareDossierDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ShareDossierDialog` | `.mstrd-ShareDossierContainer-main` | element |
| `SearchList` | `.mstrd-RecipientSearchResults, .mstrd-RecipientSearchSection-searchList` | element |
| `SearchLoadingSpinner` | `.mstrd-RecipientSearchResults-loadingSpinner, .mstrd-RecipientTree-loadingSpinner` | element |
| `CopiedTooltip` | `.mstrd-LinkSection-popover` | element |
| `NameAndTime` | `.mstrd-ShareDossierContainer-nameAndTime` | element |
| `ChangeACLButton` | `.mstrd-RecipientSearchSection-aclDropdown` | dropdown |
| `ChangeACLDropDownMenu` | `.mstrd-RecipientSearchSection-option .mstrd-DropDown-children` | dropdown |
| `SuccessToast` | `.mstrd-FloatNotifications` | element |
| `SuccessToastCloseButton` | `.mstrd-FloatNotifications-closeButton` | button |

**Actions**
| Signature |
|-----------|
| `includeBookmark()` |
| `includeAllBookmarksInTeams()` |
| `openBMList()` |
| `selectSharedBookmark(bookmarkList, sectionName = 'MY BOOKMARKS')` |
| `closeShareBookmarkDropDown()` |
| `searchRecipient(searchKey, waitForShareDialog = true)` |
| `addUserForSaaS(userList)` |
| `expandGroup(name)` |
| `selectGroupRecipient(name)` |
| `slelectAllForGroupRecipient(name)` |
| `selectRecipients(userList, groupName = 'None')` |
| `dismissRecipientSearchList()` |
| `deleteRecipients(userList)` |
| `addMessage(msg)` |
| `shareDossier(waitForSuccessToast = false)` |
| `copyLink(waitForSuccessToast = false)` |
| `closeDialog()` |
| `shareAllBookmarksFromIWToUser(dossier, userName)` |
| `getShareAllBookmarksLink()` |
| `hideBookmarkTimeStamp()` |
| `showBookmarkTimeStamp()` |
| `hideSharedUrl()` |
| `showSharedUrl()` |
| `hideTimeAndName()` |
| `showTimeAndName()` |
| `openACL()` |
| `changeACLTo(targetACL)` |
| `isShareButtonEnabled()` |
| `isIncludeBMPresent()` |
| `isAllOptionPresent()` |
| `isBMListPresent()` |
| `isGroupMemberPresent(name)` |
| `getSelectedCount()` |
| `getGroupMemberCount(name)` |
| `getSearchResultText()` |
| `getCurrentSelectionText()` |
| `getGroupCheckBoxStatus(name)` |
| `isGroupItemDisabled(name)` |
| `getRecipientDefaultHintText()` |
| `getShareDialogTitle()` |
| `isRecipientSearchBoxDisabled()` |
| `isAddMessageTextAreaDisabled()` |
| `waitForSearchListPresent()` |
| `isChangeACLPresent()` |

**Sub-components**
- libraryPage
- getBMListContainer

---

### TOC
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `TOCIcon` | `.mstr-nav-icon[class*=icon-tb_toc]` | element |
| `MobileTOC` | `.mstrd-MobileDossierNavBarTitle` | element |
| `TOCPanel` | `.mstrd-DropdownMenu-main` | dropdown |
| `TocInfo` | `.mstrd-ToCDropdownMenuContainer-headerInfo` | dropdown |
| `MenuContainer` | `.mstrd-MobileDossierNavBarToc-menu` | element |
| `CloseIcon` | `.mstrd-DropdownMenu-headerIcon.icon-pnl_close.visible` | dropdown |
| `TOCTitleName` | `div.mstrd-DropdownMenu-headerTitle` | dropdown |
| `DossierTitleInMobileView` | `.mstrd-MobileDossierNavBarTitle` | element |
| `TocHeader` | `.mstrd-ToCDropdownMenuContainer-headerInfo` | dropdown |
| `SelectedFavoritesIcon` | `.mstrd-FavoriteIconButton--selected` | button |
| `ConsumptionHorizontalTOCBar` | `.mstrd-DossierMenuBarToCContainer-ToC.mstr-toc` | element |
| `HorizontalTocMenuContent` | `.mstr-toc-menuBarContent` | element |

**Actions**
| Signature |
|-----------|
| `getMenuContainer()` |
| `getPage({ chapterName, pageName })` |
| `getTOCPin()` |
| `getTOCUnpin()` |
| `getFavoritesIcon()` |
| `isFavoritesIconSelected()` |
| `openMenu()` |
| `openMenuNoCheck()` |
| `closeMenu({ icon = 'toc' })` |
| `closeMenuWithoutWait({ icon = 'toc' })` |
| `goToPage({ chapterName, pageName })` |
| `goToPageWait({ chapterName, pageName })` |
| `goToPagenoWait({ chapterName, pageName })` |
| `openPageFromTocMenu({ chapterName, pageName })` |
| `openPageFromTocMenuWait({ chapterName, pageName })` |
| `openPageFromTocMenunoWait({ chapterName, pageName })` |
| `hoverOnTocItem({ chapterName, pageName })` |
| `tocTitleName()` |
| `pinTOC()` |
| `unpinTOC()` |
| `clickFavoritesIcon()` |
| `favoriteByTOC()` |
| `removeFavoriteByTOC()` |
| `browseloop(testcase)` |
| `openTocInMobileView()` |
| `isTOCMenuOpen()` |
| `isTOCDocked()` |
| `isFavoritesIconPresent()` |
| `hideTocTimeStamp()` |
| `showTocTimeStamp()` |
| `clickLeftArrow()` |
| `clickRightArrow()` |
| `getHorizontalTocButton(pageName)` |
| `clickHorizontalTocMenu(pageName)` |
| `hoverHorizontalTocMenu(pageName)` |
| `clickPageInHorizontalTocMenu(pageName)` |
| `hoverPageInHorizontalTocMenu(pageName)` |

**Sub-components**
- dossierPage
- getMenuContainer
- getPage
- waitForPage
- goToPage
