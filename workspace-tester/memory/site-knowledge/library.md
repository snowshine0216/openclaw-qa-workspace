# Site Knowledge: library

> Components: 22

### BookmarkBlade
> Extends: `ListView`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `InlineError` | `.ant-popover-inner-content` | element |

**Actions**
| Signature |
|-----------|
| `openBookmark(bookmarkName)` |
| `favoriteBookmarks(bookmarkNames)` |
| `unfavoriteBookmarks(bookmarkNames)` |
| `shareBookmark(bookmarkName)` |
| `renameBookmark(bookmarkName, newName)` |
| `renameBookmarkWithoutEnter(bookmarkName, newName)` |
| `deleteBookmark(bookmarkName)` |
| `createSnapshotOnBookmark(bookmarkName)` |
| `openBookmark(bookmarkName)` |
| `getFavoriteBookmarkNumberFromTitle()` |
| `getBookmarkListNumberFromTitle()` |
| `isFavoriteGroupVisible()` |
| `isBookmarksGroupVisible()` |
| `getTotalBookmarkNumber()` |
| `getBookmarkListNames()` |
| `isSharedBookmark(bookmarkName)` |
| `isEditButtonVisible(bookmarkName)` |
| `getInlineErrorMessage()` |

**Sub-components**
- getDossiersListViewContainer

---

### ContentDiscovery
> Extends: `BaseLibrary`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FolderPanel` | `.mstrd-folderPanel` | element |
| `CloseButton` | `.mstrd-folderPanel-closeButton` | button |
| `ProjectDropdown` | `.mstrd-DropDown-content` | dropdown |
| `ProjectHeader` | `.mstrd-folderPanel-header` | element |
| `ProjectSearch` | `.mstrd-searchComboBoxSelect-inputContainer` | input |
| `SearchSelector` | `.mstrd-searchComboBoxSelect-inputContainer input` | input |
| `EmptyList` | `.mstrd-searchComboBoxSelectDropdown-noData` | dropdown |
| `TreeSkeleton` | `.mstrd-folderPanel-treeSkeleton` | element |
| `FolderPanelTree` | `.mstrd-folderPanel-tree` | element |
| `FolderPanelTreeScrollable` | `.mstrd-folderPanel-treeScrollable` | element |
| `FolderContextMenu` | `.mstrd-ContextMenu-menu` | element |
| `LoadingRow` | `.mstrd-FolderTreeRow.mstrd-FolderTreeRow--loadingRow` | element |
| `BackArrowInMobileView` | `.icon-backarrow` | element |
| `FolderRenameTextbox` | `.mstrd-FolderTreeRow .mstr-rc-input` | input |
| `ContentDiscoveryPanelDetailPanel` | `.mstrd-content-discovery-detail-panel` | element |
| `EmptyContentPage` | `.mstrd-EmptyLibrary-content` | element |
| `FolderPath` | `ol.mstrd-folderPath` | element |
| `FolderPathDropdownMenu` | `.mstrd-navigationMenu-content` | element |
| `ContentDiscoveryTitle` | `.mstrd-content-discovery-detail-panel-title` | element |
| `ContextMenu` | `.mstrd-DossierContextMenu-menu` | element |
| `InfoWindow` | `.mstrd-RecommendationsMainInfo-top` | element |

**Actions**
| Signature |
|-----------|
| `dragFolderPanelWidth(offset)` |
| `openProjectList()` |
| `searchProject(text)` |
| `selectProject(projectName)` |
| `moveFolderIntoViewPort(folder)` |
| `openFolderByPath(folderPath)` |
| `expandFolderByPath(folderPath)` |
| `collapseFolder(folderName)` |
| `closeFolderPanel()` |
| `openFolderPanel()` |
| `hoverDotsInFolderPath()` |
| `clickFolderInDropdownList(folderName)` |
| `openFolderFromFolderPath(folderName)` |
| `clickBackButtonInMobileView()` |
| `rightClickToOpenContextMenu(folderName, isWaitCtxMenu = true)` |
| `dismissContextMenu()` |
| `openFromContextMenuForFloder(folderName, item)` |
| `renameFolder(newName)` |
| `scrollToTopFolderTree()` |
| `scrollToBottomFolderTree()` |
| `isFolderPanelOpened()` |
| `selectedProject()` |
| `isEmptyListPresent()` |
| `folderPath()` |
| `selectedFolder()` |
| `isProjectGrayedOut()` |
| `isFolderExpanded(folderName)` |
| `folderPanelWidth()` |
| `isEmptyContent()` |
| `isShortcutFolder(folderName)` |
| `isFolderExist(folderName)` |
| `isFolderContextMenuItemExisted(item)` |
| `isFolderContextMenuExisted()` |
| `openContextMenu(objectName)` |
| `openInfoWindowInTeams(objectName)` |

**Sub-components**
- getFolderPanel
- isFolderPanel
- getEmptyContentPage

---

### CopyMoveWindow
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `CopyMoveWindow` | `.mstrd-operation-dialog` | element |
| `PerformSearchButton` | `.mstr-icons.icon-common-search-big` | element |
| `ClearSearchBoxButton` | `.mstr-rc-icon-button` | button |
| `Project` | `.mstrd-tree-section-header` | element |

**Actions**
| Signature |
|-----------|
| `closeWindow()` |
| `clickCancel()` |
| `clickCreateAndWaitForProcessor()` |
| `clickCreate()` |
| `clickCreateNewFolder()` |
| `moveFolderIntoView(folderName)` |
| `scrollToTopFolderTree()` |
| `scrollToBottomFolderTree()` |
| `expandFolderPath(folderPath)` |
| `openFolder(folderName)` |
| `openFolderByPath(folderPath)` |
| `renameDossier(newName)` |
| `isRenameTextboxDisplayed()` |
| `isCreateButtonEnabled()` |
| `isWindowPrensent()` |

**Sub-components**
- getFolderPanel

---

### CoverImageDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Dialog` | `.mstrd-ChangeCoverContainer-main` | element |

**Actions**
| Signature |
|-----------|
| `closeDialog()` |
| `inputImagePath(path)` |
| `selectDemoImageByIndex(index)` |
| `saveCoverImage()` |
| `cancelChange()` |
| `changeCoverImageByPath(path)` |
| `changeCoverImageByDemoImageIndex(index)` |

**Sub-components**
_none_

---

### DataModel
> Extends: `BaseLibrary`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `WaitMsg` | `.mstrmojo-Label.mstrWaitMsg` | element |
| `WaitCurtain` | `.mstrmojo-Box.mstrIcon-wait` | element |
| `DBSkeleton` | `.dbRoles-skeleton` | element |
| `WorkspaceLoading` | `.mstr-workspace-content-loading` | element |
| `LibraryIcon` | `.mstr-di-toolbar__lib-icon` | element |
| `DataSourceContainer` | `.datasource-list-container` | element |
| `EmptyTablePnel` | `.auto-table-panel` | element |
| `DILeftPanel` | `.mstr-di-left-panel-aol-ol` | element |

**Actions**
| Signature |
|-----------|
| `waitForDMCurtainDisappear()` |
| `waitForNewDataModelLoading()` |
| `waitForEditDataModelLoading()` |
| `clickLibraryIcon()` |

**Sub-components**
- getDataSourceContainer

---

### DossierCreator
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `LibraryNavigationBar` | `.mstrd-NavBarWrapper` | element |
| `NoDataOverlay` | `.ag-overlay-no-rows-wrapper .mstr-rc-screen-with-icon` | element |
| `SwitchProjectLoadingBtn` | `.mstr-rc-loading-dot-icon` | element |
| `CreateNewDossierPanel` | `.ant-modal-content` | element |
| `ErrorContainer` | `.dossier-creator-err-container` | element |
| `ProjectPicker` | `.projectPicker` | element |
| `DossierCreatorErrorMessage` | `.dossier-creator-err-msg` | element |
| `CreateNewDossierPanelFooter` | `.template-info-footer` | element |
| `CreateNewDossierConfirmationDialog` | `.confirmation-dialog` | element |
| `CreateNewDossierPanelCreateBtn` | `.footer.library-theme .create-btn` | button |
| `CreateNewDossierProjectList` | `.rc-virtual-list-holder-inner` | element |
| `CreateNewDossierTabs` | `.tab-view-container` | element |
| `CreateNewDossierSearchBoxData` | `.mstr-rc-input` | input |
| `CertifiedControl` | `.object-selector-header-certified-control` | dropdown |
| `CreateNewDossierAddDataTreeMode` | `.browsing-mode-icon.template-library-theme` | element |
| `DataGridContainer` | `.ag-root-wrapper` | element |
| `AddAllDatasetsCheckbox` | `.ag-header-select-all:not(.ag-hidden)` | dropdown |
| `CreateNewDossierSelectTemplateInfoPanel` | `.main-info-container` | element |
| `CreateNewDossierSelectTemplateInfoUpdateTimestamp` | `.updated-icon ~div .info-string` | element |
| `LibraryDossierContextMenuItem` | `.ant-dropdown-menu-title-content` | dropdown |
| `WarningMessageElement` | `.unset-warning-popup-text` | element |
| `SelectedTemplateNameInGridView` | `.template-item.selected` | dropdown |
| `SelectionCountText` | `.template-info-selection-count` | dropdown |
| `TemplateInfoData` | `.main-info-container .dataset-icon ~ div .info-string` | element |

**Actions**
| Signature |
|-----------|
| `getCreateDossierTabNames()` |
| `getCreateNewDossierSearchBoxData()` |
| `getClearSearchTextBtn()` |
| `getAddButtonCSSProperty(property)` |
| `getAddButtonColor()` |
| `getTemplateItemNameInGridView(index)` |
| `getDataGridRow(index)` |
| `getTemplateListRow(index)` |
| `getWarningMessageText()` |
| `switchToTemplateTab(language = Locales.English)` |
| `switchToMdxSourceTab(language = Locales.English)` |
| `switchToCubesTab(language = Locales.English)` |
| `selectReportCube({ name, index = 0, isWait = true })` |
| `waitTemplateLoading()` |
| `createNewDossier()` |
| `createNewReport()` |
| `searchData(inputText)` |
| `clearSearchData()` |
| `searchTemplate(inputText)` |
| `clearSearchTemplate()` |
| `clickDatasetCheckbox(datasetArray)` |
| `searchSelectAndCreateDossier(datasetArray)` |
| `switchToDatasetTab()` |
| `switchProjectByName(projectName)` |
| `cancelSwitchProject()` |
| `confirmSwitchProject()` |
| `switchTabViewer(type)` |
| `switchToReportTab()` |
| `switchAddDataTab(tab)` |
| `toggleCertifiedOnlyForData()` |
| `toggleCertifiedOnlyForTemplate()` |
| `switchToSmartMode()` |
| `switchToTreeMode()` |
| `expandTreeView(folderName, nextLevelFolder)` |
| `doubleClickOnTreeView(folderName)` |
| `doubleClickOnAgGrid(folderName)` |
| `clickNameCheckbox()` |
| `sortDataByHeaderName(headerName)` |
| `sortTemplateByHeaderName(headerName)` |
| `selectTemplate(templateName)` |
| `selectViewMode(isPauseMode = true)` |
| `selectPauseMode()` |
| `selectExecutionMode()` |
| `clickCreateButton()` |
| `clickCreateButtonInNewAgentPanel()` |
| `cancelCreateButton()` |
| `closeNewDossierPanel()` |
| `createBlankTemplate()` |
| `clickBlankDossierBtn()` |
| `checkTemplateInfo(templateName)` |
| `closeTemplateInfo()` |
| `switchToGridView()` |
| `switchToListView()` |
| `autoResize()` |
| `ShowOrHideColumns(columnNames)` |
| `ShowOrHideColumnsSetting()` |
| `fakeUpdateTimestamp()` |
| `fakeDateModifiedColumns()` |
| `clickOnToolMenu(name)` |
| `clickOnToolSubMenu(name)` |
| `cancelDefaultTemplate()` |
| `dismissTooltipsByClickTitle()` |
| `resetLocalStorage()` |
| `isBlankTemplateSelected()` |
| `getTemplateNamesInGridView()` |
| `getSelectedTemplateNameInGridView()` |
| `isTemplateSelectedInGridView(templateName)` |
| `isAllDatasetChecked()` |
| `getSelectionCountText()` |
| `getSelectedDatasetsCount()` |
| `isDataSetsOrderedByDateCreatedAscending()` |
| `getTemplateListHeaders()` |
| `getRowCountInTemplateList()` |
| `getRowDataInListView(index, functionName)` |
| `getRowDataInTemplateListView(index)` |
| `getRowDataInAddDataTab(index)` |
| `getTemplateItemsCntInGridView()` |
| `isAllTemplateCertified()` |
| `isNoDataDisplayed()` |
| `isDataSelected(index)` |
| `getTemplateInfoData()` |
| `isTemplateHasCoverImageInListView(templateName)` |
| `isTemplateHasCoverImageInGridView(templateName)` |
| `isCreateButtonEnabled()` |
| `isConfirmSwitchProjectPopupDisplayed()` |
| `getActiveTabHeaderText()` |

**Sub-components**
- getCreateNewDossierPanel
- getCreateNewAgentPanel
- getCreateNewDossierSelectTemplateInfoPanel

---

### InfoWindow
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `InfoWindow` | `.mstrd-RecommendationsContainer-main` | element |
| `ExportGoogleSheetsButton` | `.mstr-menu-icon.icon-share_google_sheets` | element |
| `BotActiveSwitch` | `.mstrd-RecommendationsMainInfo-activeSwitch` | element |
| `ExportMSTRFileFromInfoWindow` | `.icon-info_download.mstr-menu-icon` | element |
| `ExportToPDFFromInfoWindow` | `.icon-info_pdf.mstr-menu-icon` | element |
| `ItemShare` | `.mstrd-RecommendationsMainInfo-share` | element |
| `EditButton` | `.icon-info_edit` | element |
| `RecommendationsList` | `.mstrd-RecommendationsList` | element |
| `InfoWindowUserName` | `.icon-person.mstr-menu-icon` | element |
| `RelatedContentContainer` | `.mstrd-RecommendationsList-container` | element |
| `CertifiedDetails` | `.mstrd-RecommendationsMainInfo-certifiedText` | element |
| `InfoWindowTimeStamp` | `.mstr-menu-icon .icon-info_updated` | element |
| `ObjectId` | `.icon-info_object_id` | element |
| `PathInfo` | `.icon-info_folder.mstr-menu-icon` | element |
| `Tooltip` | `.ant-tooltip:not(.ant-tooltip-hidden)` | element |
| `DossierNameInactiveSubstring` | `.mstrd-RecommendationsMainInfo-name-inactive` | element |
| `RecommendationLoadingIcon` | `.mstrd-RecommendationsList-loading` | element |
| `CreateDashboardBtn` | `.mstrd-RecommendationsMainInfo-createDashboard` | element |
| `CreateBotBtn` | `.mstrd-RecommendationsMainInfo-createBot` | element |
| `CreateADCBtn` | `.mstr-menu-icon-create-adc-icon` | element |
| `DownloadButton` | `.mstr-menu-icon-download-icon` | element |
| `ReplaceButton` | `.mstr-menu-icon-replace-icon` | element |
| `SecurityFilterBtn` | `.icon-mstrd_security_filter` | element |
| `InfoWindowObjectTypeIcon` | `.mstrd-RecommendationsMainInfo-information` | element |
| `IdInInfoWindow` | `.icon-info_object_id.object-type-icon-container` | element |
| `PathInInfoWindow` | `.mstrd-shrinkableFolderPath` | element |
| `LoadingButton` | `.mstrd-Spinner-blade` | element |

**Actions**
| Signature |
|-----------|
| `getDossierInRecommendationsListContainer({ name = '', index = 0 })` |
| `getIdInInfoWindow()` |
| `expand(dossierName)` |
| `shareDossier()` |
| `openManageAccessDialog()` |
| `openExportPDFSettingsWindow()` |
| `clickExportExcelButton()` |
| `clickExportGoogleSheetsButton()` |
| `clickExportCSVButton()` |
| `clickManageSubscriptionsButton()` |
| `exportRSD()` |
| `downloadDossier()` |
| `clickFavoriteIcon()` |
| `favoriteWithoutScroll()` |
| `favorite()` |
| `favoriteData()` |
| `favoriteDossier(dossierName)` |
| `removeFavorite()` |
| `removeFavoriteDossier(dossierName)` |
| `close()` |
| `isExportExcelButtonPresent()` |
| `showTooltipOfExportPDFIcon()` |
| `waitForDownloadComplete({ name, fileType })` |
| `showIconTooltip({ option })` |
| `selectReset()` |
| `confirmReset()` |
| `resetFromInfoWindow(wait = true)` |
| `cancelReset()` |
| `confirmResetWithPrompt()` |
| `clickEditButton()` |
| `clickInfoActionButtonByFeatureId(featureId, actionName = 'Info action button')` |
| `openItemInAuthoring()` |
| `selectRemove()` |
| `deleteItemFromInfoWindow()` |
| `confirmRemove()` |
| `cancelRemove()` |
| `clickViewMoreButton()` |
| `openDossierFromRecommendationsList(dossierName)` |
| `openDossierFromRecommendationsListByIndex(index)` |
| `hideRelatedContentItem()` |
| `hideRelatedContentContainer()` |
| `hoverOnCertifiedIcon(name)` |
| `hoverOnTemplateIcon(name)` |
| `clickCoverImage()` |
| `clickCreateDashboardButton()` |
| `clickCreateBotButton()` |
| `clickCreateADCButton()` |
| `clickDownloadButton()` |
| `clickReplaceButton()` |
| `clickSecurityFilterButton()` |
| `getSnapshotTitleText({ name, index = 0 })` |
| `hoverOnSnapshotItem({ name, index = 0 })` |
| `clickSnapshotCancelButton({ name, index = 0 })` |
| `clickSnapshotDoneButton({ name, index = 0 })` |
| `editSnapshotName({ name, index = 0, text = '', save = true })` |
| `deleteSnapshot({ name, index = 0 })` |
| `openSnapshotFromInfoWindow({ name, index = 0 })` |
| `scrollSnapshotPanelToTop()` |
| `scrollSnapshotPanelToBottom()` |
| `hideCertifiedDetailsText()` |
| `fakeTimestamp()` |
| `activeBot()` |
| `inactiveBot()` |
| `enableForAI(skipWaiting = false, timeout = this.DEFAULT_LOADING_TIMEOUT)` |
| `disableForAI()` |
| `moveTagIntoViewPort()` |
| `addTag(key, values)` |
| `deleteTagValue(key, value)` |
| `deleteTagKey(key)` |
| `saveTags()` |
| `cancelTags()` |
| `isExportPDFEnabled()` |
| `isExportCSVEnabled()` |
| `isExportExcelEnabled()` |
| `isExportGoogleSheetsEnabled()` |
| `isDownloadDossierEnabled()` |
| `isOpen()` |
| `isResetDisabled()` |
| `isDownloadDossierPresent()` |
| `isExportPDFPresent()` |
| `isEditIconPresent()` |
| `isFavoritesBtnPresent()` |
| `isFavoritesBtnSelected()` |
| `isSharePresent()` |
| `isShareDisabled()` |
| `isManageAccessPresent()` |
| `isManageAccessEnabled()` |
| `isResetPresent()` |
| `isRemovePresent()` |
| `isEmbeddedBotPresent()` |
| `isRelatedContentTitlePresent()` |
| `isCreateDashboardPresent()` |
| `isCreateBotPresent()` |
| `isSecurityFilterPresent()` |
| `isEnabledForAIIconInactive()` |
| `isEnableForAIDisplayed()` |
| `isAIEnabled()` |
| `isTagsDisplayed()` |
| `isCreateADCButtonDisplayed()` |
| `getTagsCount()` |
| `getTagKeyValuesCount(key)` |
| `removeDossier()` |
| `certifiedDetails()` |
| `waitForNoSubscriptionButton()` |
| `isBotActive()` |
| `botActiveSwitchText()` |
| `isDossierNameInactiveSubstringPresent()` |
| `getDossierNameInactiveSubstringText()` |
| `getActionButtonsName()` |
| `getConfirmMessageText()` |
| `isObjectIDPresentInInfoWindow()` |
| `isRecommendationListPresentInInfoWindow()` |
| `waitForInfoIconAppear()` |
| `isActiveToggleButtonOn()` |
| `isFolderPathTruncated()` |
| `objectTypeInInfoWindow()` |
| `isObjectTypeInInfoWindowPresent()` |
| `isCertifiedPresent()` |
| `hideIdInInfoWindow()` |
| `pathInInfoWindow()` |
| `isSnapshotContentSectionPresent()` |
| `waitForSnapshotSection()` |
| `getSnapshotsHeader()` |
| `getSnapshotItemCount()` |
| `getSnapshotDateTime(index = 0)` |
| `getSnapshotItems()` |
| `getSnapshotName({ name, index = 0 })` |
| `getSnapshotSection()` |
| `getSnapshotErrorText()` |
| `getSnapshotSectionBackgroundColor()` |
| `waitForExportLoadingButtonToDisappear(timeout = 60000)` |

**Sub-components**
- getTagsContainer
- libraryPage
- getDossierInRecommendationsListContainer
- dossierPage
- getRelatedContentContainer
- getInfoWindowTimeStampTextContainer
- getEnableForAIStatusContainer

---

### InfoWindowSnapshot
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SnapshotContentTitle` | `.mstrd-SnapshotList-title` | element |
| `SnapshotSection` | `.mstrd-SnapshotList` | element |
| `LoadingButton` | `.mstrd-Spinner-blade` | element |
| `SnapshotIconInBookmarkDropDown` | `.mstrd-RecommendationsMainInfo-bookmarkOption .mstrd-SnapshotIconButton` | button |
| `SnapshotIconInInfoWindow` | `.mstrd-RecommendationsMainInfo-snapshot.mstrd-SnapshotIconButton` | button |

**Actions**
| Signature |
|-----------|
| `getSnapshotSectionBackgroundColor()` |
| `getSnapshotItemBackgroundColor({ name, index = 0 })` |
| `getSnapshotItemWidth({ name, index = 0 })` |
| `getSnapshotItemHeight({ name, index = 0 })` |
| `getSnapshotItemCSSProperty({ name, index = 0, property })` |
| `getSnapshotsItemCount()` |
| `getSnapshotItem({ name, index = 0 })` |
| `getSnapshotTitle({ name, index = 0 })` |
| `getSnapshotEditButton({ name, index = 0 })` |
| `getSnapshotDeleteButton({ name, index = 0 })` |
| `getSnapshotDoneButton({ name, index = 0 })` |
| `getSnapshotCancelButton({ name, index = 0 })` |
| `getSnapshotInput({ name, index = 0 })` |
| `getSnapshotErrorText()` |
| `getSnapshotListErrorText()` |
| `getSnapshotTitleText({ name, index = 0 })` |
| `getSnapshotName({ name, index = 0 })` |
| `getSnapshotTooltipText()` |
| `getSnapshotsHeader()` |
| `getSnapshotItemCount()` |
| `getSnapshotDateTime(index = 0)` |
| `hoverOnSnapshotItem({ name, index = 0 })` |
| `clickSnapshotCancelButton({ name, index = 0 })` |
| `clickSnapshotDoneButton({ name, index = 0 })` |
| `editSnapshotName({ name, index = 0, text = '', save = true })` |
| `deleteSnapshot({ name, index = 0 })` |
| `openSnapshotFromInfoWindow({ name, index = 0 })` |
| `scrollSnapshotPanelToTop()` |
| `scrollSnapshotPanelToBottom()` |
| `isSnapshotContentSectionPresent()` |
| `waitForSnapshotSection()` |
| `waitForExportLoadingButtonToDisappear(timeout = 60000)` |
| `isSnapshotIconInBookmarkDropDownExisting()` |
| `isSnapshotIconInInfoWindowDisplayed()` |
| `clickSnapshotIconInInfoWindow()` |
| `isSnapshotSectionVisible()` |

**Sub-components**
_none_

---

### LibraryAuthoringPage
> Extends: `BaseAuthoring`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `LibraryLoading` | `.mstrd-LoadingIcon-content` | element |
| `NewDossierIcon` | `.mstrd-CreateDossierNavItemContainer-icon` | element |
| `ProjectSelectionWindow` | `.ant-modal-wrap` | element |
| `NewDocumentButton` | `.mstrd-CreateDossierDropdownMenuContainer-create-document` | dropdown |
| `DropdownMenu` | `.mstrd-DropdownMenu-main` | dropdown |
| `NewDossierProjectSelectionDropdownList` | `.mstr-select-container__menu` | dropdown |
| `ConfirmationDialog` | `.mstr-react-dossier-creator-confirmation-dialog` | element |
| `ChangeProject` | `.ant-select-selection-item` | dropdown |
| `ProjectSelectionPreloader` | `.mstr-react-dossier-creator-preloader` | element |
| `DataImportDialog` | `.mstrmojo-di-popup` | element |
| `HomeIcon` | `.mstr-nav-icon.icon-library` | element |
| `EditBtnOnLibraryToolbar` | `.mstr-nav-icon.icon-info_edit` | element |
| `ProjectSelectionWindowTitle` | `.ant-modal-title` | element |
| `CreateNewPanelContent` | `.mstrd-DropdownMenu-main` | dropdown |
| `LayerPanel` | `.mstrmojo-RootView-vizControl` | element |
| `SearchDataSetInputBox` | `.object-selector-header-search-input input` | input |
| `DataSetLoadingIndicatorAfterSelectProject` | `.mstr-rc-loading-dot-icon` | element |
| `CreateWithNewDataButton` | `.blank-dossier-btn` | button |
| `CreateNewBotButton` | `.mstrd-CreateDossierDropdownMenuContainer-text-wrapper.icon-mstrd_custom_bot_normal` | dropdown |
| `NewDatasetDialog` | `.mstrmojo-di-view-popup.new-dataset` | element |
| `CreateDossierDropdownMenu` | `.mstrd-CreateDossierDropdownMenuContainer` | dropdown |
| `FileButton` | `.item.mb.file` | element |
| `DashboardPropertiesButton` | `.item.docProps.mstrmojo-ui-Menu-item` | element |
| `DashboardPropertiesExportToPDFDialog` | `.mstr-docprops-container` | element |
| `DashboardPropertiesExportToExcelDialog` | `.mstr-docprops-container` | element |
| `DirectSaveButton` | `.item.btn.save .btn` | button |
| `NewDatasetSelectorDiag` | `.mstrmojo-vi-ui-editors-NewDatasetSelectorContainer` | dropdown |
| `SavedInFolderDropdown` | `.mstrmojo-Popup-content.mstrmojo-OBNavigatorPopup` | element |
| `SaveOverwriteConfirmation` | `.mstrmojo-alert.modal` | element |
| `ClearInputButtonInDatasetPanel` | `.mstr-filter-search-input-btn` | button |
| `FormatButton` | `.item.mb.style` | element |
| `DashboardFormattingButton` | `.item.dashboardStyles.mstrmojo-ui-Menu-item` | element |
| `LockPageSizeCheckBox` | `.mstrmojo-CheckBox.pageSize` | element |
| `LockPageSizeHelperIcon` | `.mstrmojo-Box.helpIcon` | element |
| `DashboardFormattingPopUp` | `.mstrmojo-Editor.DashboardStyles.modal` | element |
| `LoadingInSaveEditor` | `.mstrmojo-BookletLoader` | element |
| `VizDoc` | `.mstrmojo-VIDocLayout` | element |
| `ContentsPanel` | `.mstrmojo-TableOfContents` | element |
| `UploadBtn` | `.upload-button` | button |
| `UnstructuredFilelist` | `.mstrd-UnstructuredDataUploadDialog-fileList` | element |
| `AddButtonInUnstructuredDataPanel` | `.mstrd-UnstructuredDataUploadDialog-uploadBtn` | button |
| `MaximizeVisualizationDropdownList` | `.mstr-docprops-select-dropdown__dropdown-list` | dropdown |

**Actions**
| Signature |
|-----------|
| `getConfirmationDialogMessage()` |
| `getObjectNameInPathPreview()` |
| `getProjectSelectionWindowTitle()` |
| `getRowOfBotDataset(dataset)` |
| `getCheckboxOfBotDataset(dataset)` |
| `getDatasetNameCheckbox(dataset)` |
| `openFileMenu()` |
| `openFormatMenu()` |
| `openDashboardPropertiesMenu()` |
| `openDashboardFormattingMenu()` |
| `openDashboardFormatting()` |
| `clickLockPageSizeCheckBox()` |
| `clickLockPageSizeHelperIcon()` |
| `saveDashboardProperties()` |
| `clickComponentFromLayerPanel(componentName)` |
| `openDefaultZoomDropDown()` |
| `clickExportToPDFTab()` |
| `clickExportToExcelTab()` |
| `clickNewDossierIcon()` |
| `clickNewBotButton()` |
| `clickNewDossierButton(waitForDataset = true)` |
| `clickNewReportButton()` |
| `clickCreateButtonForPendo()` |
| `openCreateNewBotDialog()` |
| `clickNewDataModelButton()` |
| `clickNewADCButton()` |
| `clickNewBot2Button()` |
| `toggleNewDossierCertifiedSwitch()` |
| `clickCancelButton()` |
| `clickPreviewButton()` |
| `clickDatasetCheckbox(dataset)` |
| `clickCreateButton()` |
| `clickCloseButtonIfVisible()` |
| `editDossierFromLibrary()` |
| `editDossierFromLibraryWithNoWait()` |
| `createDossierFromLibrary()` |
| `createReportFromLibrary(projectName = 'MicroStrategy Tutorial')` |
| `createBlankDashboardFromLibrary()` |
| `createBlankDashboardFromSaaSLibrary()` |
| `createBlankDashboard()` |
| `createDocumentFromLibrary(projectName)` |
| `clickCreateBotOption()` |
| `switchToProject(newProjectName)` |
| `searchDataSet(string)` |
| `clearSearch()` |
| `switchToSmarkMode()` |
| `switchToBrowsingMode()` |
| `selectDataSetByName(datasetName)` |
| `clickConfirmationDialogOkButton()` |
| `clickCreateWithNewDataButton()` |
| `clickDataImportDialogCancelButton()` |
| `clickDataImportDialogCreateButton()` |
| `clickDataImportDialogImportButton()` |
| `clickDataImportDialogPrepareDataButton()` |
| `clickDataImportDialogSampleFiles()` |
| `clickHomeIcon()` |
| `selectSampleFileByIndex(index)` |
| `closeDataImportDialog()` |
| `selectProject(projectName)` |
| `saveProjectSelection()` |
| `waitLoadingDataPopUpIsNotDisplayed(seconds = 10)` |
| `waitLibraryLoadingIsNotDisplayed(seconds = 10)` |
| `waitLibraryLoadingDisplayedAndThenNotDisplayed(seconds = 10)` |
| `scrollDatasetListsToBottom()` |
| `isDatasetDisplayedInViewport(datasetName)` |
| `isBotDatasetDisplayedInViewport(datasetName)` |
| `isProjectSelectionWindowPresent()` |
| `isNewDossierWindowCertifiedEnabled()` |
| `isNoDataScreenPresent()` |
| `isBrowingExplorerDisplayed()` |
| `isSmartExplorerDisplayed()` |
| `isConfirmationDialogDisplay()` |
| `isSaveOverwriteConfirmation()` |
| `hasASelectedDataSource()` |
| `isDataImportDialogPrepareDataButtonDisabled()` |
| `isHomeIconPresent()` |
| `isDataImportDialogPresent()` |
| `isEditIconPresent()` |
| `isCreateBotOptionPresent()` |
| `isCreateADCOptionPresent()` |
| `getCreateBotText()` |
| `isProjectSelectionWindowVisible()` |
| `isCloseButtonVisible()` |
| `isBotCreateWithNewDataButtonVisible(text = 'Create with New Data')` |
| `changeProjectTo(project)` |
| `waitForProjectSelectionWindowAppear()` |
| `waitForAddDataSelectionWindowAppear()` |
| `waitForDataPreviewWindowAppear()` |
| `selectProjectAndDataset(project, dataset)` |
| `selectDatasets(datasets, create = false)` |
| `selectDatasetAfterSelectBotTemplate(dataset)` |
| `selectProjectAndReport(project, report)` |
| `selectProjectAndADCAndDataset(project, dataset, preview = false)` |
| `selectProjectAndUnstructuredDataPanel(project)` |
| `selectProjectAndUnstructuredData(project, unstructuredData)` |
| `selectUnstructuredData(unstructuredData)` |
| `clickUploadButton()` |
| `waitForAddUnstructuredDataDialogAppear()` |
| `uploadUnstructuredFileFromDisk(filePath)` |
| `uploadUnstructuredData(filePaths)` |
| `deleteUnstructuredDataInUploadDialog(filename)` |
| `saveUnstructuredDataToMD(path)` |
| `waitForUnstructuredFileUploadComplete(filename, timeout = 180000)` |
| `waitForAllUnstructuredFileUploadComplete(timeout = 180000)` |
| `checkUnstructuredDataUploadSuccess()` |
| `selectProjectAndAIBots(project, datasets, skipProject = false)` |
| `selectSubBotInUnversalBot(subbots)` |
| `createDashboardWithDataset({ project = 'MicroStrategy Tutorial', dataset })` |
| `createDashboardWithReport({ project = 'MicroStrategy Tutorial', report })` |
| `createBotWithDataset({ project = 'MicroStrategy Tutorial', dataset })` |
| `createBotWithADC({ project = 'MicroStrategy Tutorial', aiDataCollection })` |
| `createADCWithDataset({ project = 'MicroStrategy Tutorial', dataset })` |
| `createADCWithUnstructuredData({ project = 'MicroStrategy Tutorial', unstructuredData })` |
| `createBotWithNewData({ project = 'MicroStrategy Tutorial' })` |
| `createBotWithNewDataInDefaultProject()` |
| `createBotWithReports({ project = 'MicroStrategy Tutorial', reports = [] })` |
| `clickDatasetTypeInDatasetPanel(datasetType)` |
| `clickDatasetTypeInAddDataPanel(datasetType)` |
| `searchForDataByName(name)` |
| `getCreateNewMenuItemsText()` |
| `isCreateNewButtonPresent()` |
| `isNewBotButtonPresent()` |
| `isCreateNewDropdownOpen()` |
| `getFocusedMenuOptionLabel()` |
| `simpleSaveDashboard()` |
| `saveDashboard(dashboardName)` |
| `saveDashboardInMyReports(dashboardName)` |
| `saveInMyReport(name, path)` |
| `saveToFolder(name, path, parentFolder = 'Shared Reports')` |
| `cancelSaveAs()` |
| `saveAsDashboard(dashboardName)` |
| `goToHome()` |
| `searchForProject(projectName)` |
| `isCreateDataModelBtnPresent()` |
| `isCreateDashboardBtnPresent()` |
| `isBrowsingFolderPresent(folderName)` |
| `getSaveInFolderSelectionText()` |
| `getSaveInFolderDropdownOptionsText()` |
| `isNewFolderButtonDisplayed()` |
| `isPromptOptionsInSaveAsEditorDisplayed()` |
| `isDatasetExistedInDatasetPanel(dataset)` |
| `isDatasetDisabledInDatasetPanel(dataset)` |
| `isProjectGrayedOut()` |
| `isUploadBtnDisplayed()` |
| `clickFormatCheckbox(format)` |
| `clickOKButton()` |
| `getMaximizeVisualizationRow()` |
| `getMaximizeVisualizationSelectColumn()` |
| `clickMaximizeVisualizationSelectColumn()` |
| `clickMaximizeVisualizationOption(optionLabel)` |
| `selectMaximizeVisualizationMode(optionLabel)` |
| `selectMaximizeVisualizationEntireDashboard()` |
| `selectMaximizeVisualizationCurrentPanel()` |
| `clickDashboardPropertiesOkButton()` |

**Sub-components**
- libraryPage
- aibotChatPanel
- dossierPage
- getLayerPanel
- getAddButtonInUnstructuredDataPanel
- getLockPage
- getComponentFromLayerPanel
- getDatabaseTablePanel
- getDataPreviewContainer
- getDataseListContainer
- clickDatasetTypeInDatasetPanel
- selectProjectAndUnstructuredDataPanel
- clickDatasetTypeInAddDataPanel
- getClearInputButtonInDatasetPanel
- getCreateNewPanel

---

### libraryConditionalDisplay
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `LayerElementList` | `.ant-tree.ant-tree-directory` | element |
| `RightClickMenu` | `.mstrmojo-unit-container-menu` | element |
| `ConditionalDisplayDialog` | `.cf-editor` | element |
| `NewConditionDialog` | `.mstrmojo-vi-ui-ConditionEditor` | element |
| `NewConditionDialog` | `.mstrmojo-vi-ui-ConditionEditor` | element |

**Actions**
| Signature |
|-----------|
| `getConditionTitle(option)` |
| `chooseElement(option)` |
| `OpenElementMenu(option)` |
| `openConditionalDisplayDialog()` |
| `closeConditionalDisplayDialog()` |
| `applyConditionalDisplaySettings()` |
| `clickConditionalDisplayOKButton()` |
| `hoverOnConditionName(option)` |
| `IsConditionalDisplayDialogButtonEnabled(buttonName)` |
| `openNewConditionDialog(option)` |
| `closeNewConditionDialog()` |
| `deleteCondition()` |
| `deleteConditionByElement(option)` |
| `openConditionalRelationDropdown(option)` |
| `selectConditionRelation(option)` |
| `selectNewConditionElement(option)` |
| `selectElementInList(option)` |

**Sub-components**
- libraryPage

---

### LibraryHomeBookmark
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `BookmarkEntry` | `.mstrd-DropDown .mstrd-DropDownButton` | button |
| `BookmarkDropdown` | `.mstrd-DropDown-content .mstrd-DropDown-children` | dropdown |

**Actions**
| Signature |
|-----------|
| `openBookmarkDropdown()` |
| `clickDefaultOption()` |
| `applyBookmark(bookmarkName)` |
| `clickMyBookmarkLabel()` |
| `isBookmarkEntryDisplayed()` |
| `isBookmarkDropdownDisplayed()` |
| `isSharedBookmarkDisplayed()` |

**Sub-components**
_none_

---

### LibraryPage
> Extends: `BaseLibrary`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ViewContainer` | `.mstrd-LibraryViewContainer` | element |
| `RecommendationLoadingIcon` | `.mstrd-RecommendationsList-loading` | element |
| `AuthoringCloseBtn` | `.mstrmojo-RootView-menubar .item.btn.close` | button |
| `LibraryIcon` | `.mstr-nav-icon.icon-library,.mstrd-LibraryNavItem-link` | element |
| `LibraryCurtain` | `.mstrd-LibraryViewCurtain` | element |
| `NavigationBar` | `.mstrd-NavBarWrapper` | element |
| `HamburgerIcon` | `.mstrd-HamburgerIconContainer` | element |
| `NotificationIcon` | `.mstrd-NotificationIcon` | element |
| `DossiersListContainer` | `.mstrd-DossiersListContainer` | element |
| `TrialWrapper` | `.mstrd-ContentListContainer-trialWrapper` | element |
| `UpgradeButtonInSiderSection` | `.mstrd-SaasPlaceholder-description .mstrd-SaasUpgradeButton-button` | button |
| `InstructionTitleInSiderSection` | `.mstrd-SaasPlaceholder-description` | element |
| `Title` | `.mstrd-NavBarTitle > .mstrd-NavBarTitle-item.mstrd-NavBarTitle-item-active` | element |
| `EmptyLibraryFromFilter` | `.mstrd-EmptyLibraryFromFilter-content` | element |
| `NavigationBarCollapsedIcon` | `.mstrd-NavBarTriggerIcon` | element |
| `LibraryContentContainer` | `.mstrd-ContentListContainer` | element |
| `MultiSelectionToolbar` | `.mstrd-MultiSelectionToolbar` | dropdown |
| `ListContainerHeader` | `.mstrd-DossiersListContainer-header` | element |
| `DossierNameInput` | `.mstrd-DossierItem-nameInput,.mstrd-DossierItemRow-renameInput` | input |
| `MessageBoxContainer` | `.mstrd-MessageBox-main.mstrd-MessageBox-main--modal` | element |
| `BlurredAppContainer` | `.mstrd-AppContainer-mainContent--blur` | element |
| `MissingFontPopup` | `.win.mstrmojo-Editor` | element |
| `OKButton` | `.ok-button` | button |

**Actions**
| Signature |
|-----------|
| `reload()` |
| `refresh()` |
| `getTitleText()` |
| `handleError()` |
| `openDossier(name, owner = null)` |
| `openDossierNoWait(name, owner = null)` |
| `openBotByUrl(url, handleError = true)` |
| `openBotById({
        appId = 'C2B2023642F6753A2EF159A75E0CFF29', projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', botId, handleError = true, useDefaultApp = false, })` |
| `openBotByIdAndWait({
        appId = 'C2B2023642F6753A2EF159A75E0CFF29', projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', botId, })` |
| `openBotNoWait(name)` |
| `openBot(name)` |
| `openFirstBot()` |
| `editBotByUrl({ appId = 'C2B2023642F6753A2EF159A75E0CFF29', projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', botId }, handleError = true)` |
| `openSnapshotById({
        appId = 'C2B2023642F6753A2EF159A75E0CFF29', projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', objectId, messageId, handleError = true, useDefaultApp = true, })` |
| `openSnapshotByUrl(url, handleError = true)` |
| `dismissMissingFontPopup()` |
| `openDossierByUrl(url, handleError = true)` |
| `openDossierById({ projectId, dossierId, applicationId = null }, handleError = true)` |
| `editDossierByUrl({ projectId, dossierId }, handleError = true)` |
| `enableReactIntegration()` |
| `editDossierByUrlwithMissingFont({ projectId, dossierId }, handleError = true)` |
| `createNewReportByUrl({ projectId = 'B628A31F11E7BD953EAE0080EF0583BD' }, handleError = true)` |
| `createNewDashboardByUrl({ projectId = 'B628A31F11E7BD953EAE0080EF0583BD' }, handleError = true)` |
| `editDossierByUrlwithPrompt({ projectId, dossierId }, handleError = false)` |
| `editDossierWithPageKeyByUrl({ projectId, dossierId, pageKey }, handleError = true)` |
| `openDossierWithKeyboard(name)` |
| `openUrl(projectID, documentID, libraryUrl = browser.options.baseUrl, handleError = true)` |
| `openUrlWithPage(projectID, documentID, pageID, libraryUrl = browser.options.baseUrl)` |
| `editReportByUrl({ projectId, dossierId }, handleError = true)` |
| `openReportByUrl({ projectId, documentId, prompt = false, noWait = false })` |
| `openDossierAndRunPrompt(name)` |
| `openReportNoWait(name)` |
| `openDocumentNoWait(name)` |
| `openUserAccountMenu()` |
| `clickAccountOption(text)` |
| `logout(options = {})` |
| `openPreferencePanel()` |
| `closeUserAccountMenu()` |
| `switchUser(credentials)` |
| `dismissQuickSearch()` |
| `dissmissPopup()` |
| `logoutClearCacheAndLogin(credentials, skipOpenAccountMenu = false)` |
| `removeDossierFromLibrary(usercredentials, targetDossier, flag = true, isLogout = true)` |
| `hoverDossier(name)` |
| `clickDossierFavoriteIcon(name)` |
| `clickFavoriteByImageIcon(name, selected = true)` |
| `favoriteByImageIcon(name)` |
| `removeFavoriteByImageIcon(name)` |
| `isFavoriteIconPresent(name)` |
| `getGroupCountFromTitle(group)` |
| `getFavoritesCountFromTitle()` |
| `getAllCountFromTitle()` |
| `getDataModelCountFromTitle()` |
| `openDossierContextMenuNoWait(name)` |
| `openDossierContextMenu(name, isMobile = false)` |
| `clickDossierContextMenuItem(item1, item2 = '', isMobile = false)` |
| `clickDossierContextMenuItemNoWait(item)` |
| `clickDossierSecondaryMenuItem(item)` |
| `clickLibraryIcon()` |
| `openSidebarOnly()` |
| `openSidebar(hasSubmenu = false)` |
| `closeSidebar()` |
| `clickMultiSelectBtn()` |
| `selectDossier(name)` |
| `openHamburgerMenu()` |
| `clickAuthoringCloseBtn()` |
| `hoverOnShare()` |
| `openDossierInfoWindow(dossierName)` |
| `openInvalidUrl(suffix, libraryUrl = browser.options.baseUrl)` |
| `renameDossier(newName)` |
| `clickUpgradeButtonInSiderSection()` |
| `clickUpgradeButtonInTrialBanner()` |
| `resetToLibraryHome()` |
| `performanceData(actionList)` |
| `waitForProgressBarGone()` |
| `hoverHomeCardAIDisabledIcon(name)` |
| `hoverHomeCardAIEnabledIcon(name)` |
| `waitForEnableAIReady(name)` |
| `isAccountIconPresent()` |
| `isAccountOptionPresent(text)` |
| `isLogoutPresent()` |
| `isViewCurtainPresent()` |
| `isFavoritesPresent()` |
| `isFavoritesIconSelected(name)` |
| `isDossierContextMenuItemExisted(item)` |
| `isSecondaryContextMenuItemExisted(name)` |
| `isSecondaryContextMenuItemDisabled(name)` |
| `isMultiSelectBtnActive()` |
| `isLibraryEmpty()` |
| `getFirstDossierName()` |
| `getDossierCount()` |
| `waitForLibraryLoading()` |
| `expandCollapsedNavBar()` |
| `clickNarvigationBar()` |
| `isCodeCoverageEnabled()` |
| `openDebugMode(debugBundles)` |
| `collectLineCoverageInfo(outputFolderString, testName)` |
| `isDossierInLibrary(dossier)` |
| `isLibraryIconPresent()` |
| `isNavigationBarPresent()` |
| `isSidebarOpened()` |
| `isNotificationIconPresent()` |
| `isMultiSelectBtnPresent()` |
| `isNavBarExpandBtnPresent()` |
| `isTitleDisaplayed()` |
| `getListContainerHeaderText()` |
| `getTrialBannerMessageText()` |
| `getInstructionTitleInSiderSectionText()` |
| `isUpgradeButtonInSiderSectionPresent()` |
| `isUpgradeButtonInTrialBannerPresent()` |
| `isSelectedSidebarItem(item)` |
| `getBotCount()` |
| `getMenuContextItemCount()` |
| `isLibraryEmptyFromFilter()` |
| `hideDossierListContainer()` |
| `showDossierListContainer()` |
| `isSessionTimeoutAlertDisplayed()` |
| `isBackgroundBlurred()` |
| `getItemsCount(name, owner = null)` |
| `getListContainerHeaderFont()` |
| `isAuthoringCloseButtonDisplayed()` |
| `closeSystemStatusBar(index)` |
| `isSystemStatusBarDisplayed(index)` |
| `isSystemStatusCloseBtnDisplayed(index)` |
| `isDossierPresent(dossierName)` |
| `isDossierInactive(dossierName)` |
| `isDossierDeprecated(dossierName)` |
| `isDossierIconGrayscale(dossierName)` |
| `isAIEnabled(name)` |

**Sub-components**
- loginPage
- dossierPage
- getLibraryContentContainer
- getListContainer
- getDossiersListContainer
- getMessageBoxContainer
- getBlurredAppContainer

---

### LibrarySearch
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Results` | `.mstrd-QuickSearchDropDownView` | dropdown |

**Actions**
| Signature |
|-----------|
| `executeRecentlySearchedItem(index)` |
| `clearRecentlySearchedItem(index)` |
| `clearAllRecentlySearchedItems()` |
| `openSearchBox()` |
| `search(text)` |
| `localSearch(text)` |
| `executeResultItem({ section, index })` |
| `checkMatchItems(section)` |
| `clearSearch()` |
| `pressEnter()` |
| `dismissSearch()` |
| `isInputBoxEmpty()` |
| `isRecentlySearchedListPresent()` |
| `recentlySearchedItemCount()` |
| `recentlySearchedItem(index)` |
| `isRecentlySearchedResultEmpty()` |
| `isClearSearchIconDisplayed()` |
| `isResultEmpty()` |
| `isTextHighlighted(text)` |
| `isUserProfileDisplayed()` |
| `isSectionPresent(section)` |
| `resultItem({ section, index })` |
| `dossierNameInResultItem({ section, index })` |
| `objectNameInResultItemByIndex({ section, index, objectIndex })` |
| `attributeCount({ section, index })` |
| `metricCount({ section, index })` |
| `matchCount(section)` |

**Sub-components**
- searchPage
- dossierPage
- libraryPage

---

### ListView
> Extends: `BaseLibrary`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `LibraryViewContainer` | `.mstrd-LibraryViewContainer` | element |
| `ViewModeSwitch` | `.mstrd-NavBarViewModeSwitch-segmentedControl` | element |
| `ListViewButtonForMobile` | `.mstrd-NavBarViewModeSwitch .icon-tb_resp_listview` | element |
| `GridViewButtonForMobile` | `.mstrd-NavBarViewModeSwitch .icon-tb_resp_gridview` | element |
| `DossiersListViewContainer` | `#mstrd-Root .mstrd-DossiersListContainer` | element |
| `MoreOptionInIW` | `.icon-group_options.mstr-menu-icon` | element |
| `EditOptionInIW` | `.mstrd-WebEditIcon.icon-info_edit` | element |
| `MoreOptiobDropDownInIW` | `.mstrd-ExtraButtonsDropdown-popover` | button |
| `SortBar` | `.mstrd-SortTypeHeaderBar` | element |
| `ListViewInfoWindow` | `.mstrd-InfoPanelSidebarContainer-content` | element |
| `ListViewInfoWindowMainPanel` | `.mstrd-RecommendationsMainInfo` | element |
| `ListViewInfoWindowTop` | `.mstrd-RecommendationsMainInfo-top` | element |
| `ListViewInfoWindowContainerForMobile` | `.mstrd-InfoPanelSidebarContainer-drawer` | element |
| `OwnerText` | `.mstrd-RecommendationsMainInfo-information` | element |
| `UpdatedText` | `.mstrd-RecommendationsMainInfo-information` | element |
| `ManageAccessDialog` | `.mstrd-ManageAccessContainer` | element |
| `ExtraButtonsDropdown` | `.mstrd-ExtraButtonsDropdown-popover` | button |
| `ListViewGrid` | `.mstrd-DossiersListAGGridList` | element |
| `RemoveConfirmationDialog` | `.mstrd-ConfirmationDialog` | element |

**Actions**
| Signature |
|-----------|
| `getLastDossierName()` |
| `getLastDossierOwner()` |
| `selectListViewMode()` |
| `deselectListViewMode()` |
| `selectListViewModeMobile()` |
| `deselectListViewModeMobile()` |
| `clickSortBarColumn(columnType, sortOrder)` |
| `clickExportPDFIcon()` |
| `clickBackArrow()` |
| `clickCloseIcon()` |
| `hoverDossier(name, isMobileView = false)` |
| `openDossier(name, isMobileView = false)` |
| `rightClickToOpenContextMenu({ name, isMobileView = false, isWaitCtxMenu = true })` |
| `openInfoWindowFromListView(name)` |
| `openShareFromListView(name)` |
| `openInfoWindowFromMobileView(name)` |
| `clickExportExcelFromIW()` |
| `openContextMenu(name)` |
| `clickExportButtonOnExcelPanel()` |
| `clickEmbedBotFromIW()` |
| `clickDownloadDossierFromIW()` |
| `clickReportLinkInExcelExportWindow()` |
| `selectItemInListView(name)` |
| `deselectItemInListView(name)` |
| `clickSelectAllFromListView()` |
| `clickRemoveFromInfoWindow(name)` |
| `clickMoreMenuFromIW()` |
| `clickExportPDFIconFromIW()` |
| `clickCreateBotFromIW()` |
| `clickCreateADCFromIW()` |
| `clickManageAccessFromIW()` |
| `clickShareFromIW()` |
| `clickRenameFromIW()` |
| `clickCopyFromIW()` |
| `clickMoveFromIW()` |
| `cancelRemoveFromInfoWindow()` |
| `clickDeleteFromIW()` |
| `clickCreateShortcutFromIW()` |
| `clickDossierEditIcon(name, isMobileView = false)` |
| `clickContextMenuItem(item)` |
| `clickCoverImageOnInfoWindow()` |
| `enableForAI()` |
| `disableForAI()` |
| `hoverEnabledForAIIndicator(name)` |
| `isListViewInfoWindowPresent()` |
| `isViewModeSwitchPresent()` |
| `isListViewModeSelected()` |
| `isListViewModeSelectedMobile()` |
| `isDossiersListViewContainerPresent()` |
| `isDossierEditIconPresent(name, isMobileView = false)` |
| `isDossierShareIconPresent(name, isMobileView = false)` |
| `isDossierShareIconDisabled(name, isMobileView = false)` |
| `isDossierDownloadIconPresent(name, isMobileView = false)` |
| `isDossierResetIconPresent(name, isMobileView = false)` |
| `isFavoritesIconPresent(name, isMobileView = false)` |
| `isAddToLibraryIconPresent(name, isMobileView = false)` |
| `isSortBarPresent()` |
| `isSortBarColumnActive(columnType)` |
| `isSortBarColumnAscending(columnType)` |
| `isNameColumnSorted(sortOrder)` |
| `isOwnerColumnSorted(sortOrder)` |
| `isDateColumnSorted(sortOrder)` |
| `isOnOriginalInfoWindowPage()` |
| `isMobileInfoWindowOpened()` |
| `contentUpdatedTime(name, isMobileView = false)` |
| `contentProject(name, isMobileView = false)` |
| `contentPath(name, isMobileView = false)` |
| `isAllSelectionCheckboxChecked()` |
| `isSingleSelectionCheckboxChecked(name)` |
| `isBotInInfoWindowActive()` |
| `isShareDisabled()` |
| `objectTypeInListMobileViewDisplayed(name, isMobileView = true)` |
| `objectTypeInListViewIndoWindow()` |
| `isRenameIconPresentInInfoWindow()` |
| `isCopyIconPresentInInfoWindow()` |
| `isMoveIconPresentInInfoWindow()` |
| `isDeleteIconPresentInInfoWindow()` |
| `getDeleteIconTooltipInInfoWindow()` |
| `isCreateShortcutIconPresentInInfoWindow()` |
| `isMoreMenuIconPresentInInfoWindow()` |
| `isEditButtonPresentInIW()` |
| `getRemoveConfirmationMessageText()` |
| `isShareIconPresentInInfoWindow()` |
| `isManageAccessIconPresentInInfoWindow()` |
| `getInfoWindowActionCount()` |
| `getInfoWindowMorActionAcount()` |
| `isCertifiedPresentInInfoWindow()` |
| `pathInListViewInfoWindow()` |
| `isEnabledForAIIconInactive()` |
| `isAIEnabledInInfoWindow()` |
| `isAIEnabledInListColumn(name)` |
| `isTagsDisplayed()` |

**Sub-components**
- libraryPage
- dossierPage
- getDossiersListViewContainer
- getEnableForAIStatusContainer
- getListViewInfoWindowContainer
- getTagsContainer

---

### ListViewAGGrid
> Extends: `ListView`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AGGridContainerContentHeight` | `.mstrd-DossiersListAGGridList .ag-center-cols-viewport` | element |
| `AGGridContainerScrollHeight` | `.mstrd-DossiersListAGGridList .ag-body-viewport` | element |
| `CheckboxSelectAll` | `.ag-header-select-all` | dropdown |
| `DossierRenameTextbox` | `.mstrd-DossierItemRow-folderObjectRename .mstr-rc-input` | input |
| `SideContainerInListView` | `.mstrd-InfoPanelSidebarContainer` | element |
| `SideColumnsPanel` | `.ag-tool-panel-wrapper .ag-column-panel` | element |
| `ItemContextMenu` | `.mstrd-ContextMenu-menu` | element |
| `ContextMenu` | `.mstrd-ContextMenu.mstrd-DossierContextMenu` | element |

**Actions**
| Signature |
|-----------|
| `getLastDossierName()` |
| `getLastDossierOwner()` |
| `clickDossierRow(name)` |
| `clickSortBarColumn(columnLabel, sortOrder)` |
| `scrollToBottomAGGrid()` |
| `moveDossierIntoViewPortAGGrid(name, scrollToTop = false)` |
| `renderNextBlockAGGrid(count)` |
| `loadUntilRenderedAGGrid({ name, count = 0, attempt = 1 })` |
| `hoverDossier(name)` |
| `hoverDossierByIndex(index)` |
| `clickFavoriteByImageIcon(name, selected = true)` |
| `favoriteByImageIcon(name)` |
| `removeFavoriteByImageIcon(name)` |
| `clickInfoWindowIconInGrid(name)` |
| `clickInfoWindowIconInGridByIndex(index)` |
| `clickEditIconInGrid(name)` |
| `clickShareIconInGrid(name)` |
| `clickExportPDFIconInGrid(name)` |
| `clickResetIconInGrid(name)` |
| `clickAddToLibraryIconInGrid(name)` |
| `clickEmbeddedBotButtonInGrid(name)` |
| `clickContextMenuIconInGrid(name)` |
| `clickContextMenuIconInGridByIndex(index)` |
| `rightClickToOpenContextMenuByIndex(index)` |
| `clickCheckboxInGrid(name)` |
| `clickCheckboxInGridByIndex(index)` |
| `clickCheckboxSelectAll()` |
| `renameDossierInGrid(newName)` |
| `clickColumnsButton()` |
| `clickAutoResizeButton()` |
| `clickSideLabelInListView(buttonLabel)` |
| `clickColumnCheckboxByIndex(posIndex, isChecked)` |
| `addColumnByTickCheckbox(posIndex)` |
| `addColumnByNameList(nameList)` |
| `removeColumnByNameList(nameList)` |
| `removeColumnByByTickCheckbox(posIndex)` |
| `clickCreateSnapshotButton()` |
| `isSortBarPresent()` |
| `isSortBarColumnElementPresent(columnLabel)` |
| `isSortBarColumnActive(columnLabel)` |
| `isSortBarColumnAscending(columnLabel)` |
| `isNameColumnSorted(sortOrder)` |
| `isOwnerColumnSorted(sortOrder)` |
| `isDateColumnSorted(sortOrder)` |
| `isAddToLibraryIconPresent(name)` |
| `isDossierEditIconPresent(name)` |
| `isDossierShareIconPresent(name)` |
| `isDossierInfoIconPresent(name)` |
| `isExportToPDFIconPresent(name)` |
| `isBotEmbedIconPresent(name)` |
| `isDossierDownloadIconPresent(name)` |
| `isDossierResetIconPresent(name)` |
| `isFavoritesIconSelected(name)` |
| `isAGDossierItemElementInViewport(dossierItemElem)` |
| `isAGGridTitlePresent(title)` |
| `isAGGridSideBtnPresent(buttonLabel)` |
| `isAGGridColumnSelectHidden()` |
| `isToolPanelHidden()` |
| `isDossierPresent(name)` |
| `isShortcutPresent(name)` |
| `isBotCoverGreyedOut(name)` |
| `isCertifiedPresent(name)` |
| `isEmbeddedBotButtonPresent(name)` |
| `isShareIconPresentInSideContainer()` |
| `isEmbeddedBotIconPresentInSideContainer()` |
| `lastDossierName()` |
| `isRunAsExcelIconPresent(name)` |
| `isRunAsPDFIconPresent(name)` |
| `getAGGridGroupItemCount(groupName)` |
| `getAGGridItemCount()` |
| `hoverOnContextMenuShareItem()` |
| `isExporttoPDFPresent()` |
| `isExporttoExcelPresent()` |
| `isExporttoCSVPresent()` |
| `isCreateSnapshotPresentInContextMenu()` |

**Sub-components**
- libraryPage
- getDossiersListViewContainer
- getSideContainer
- getSideColumnsPanel
- getAGGridContainer
- getItemInColumnsPanel
- getShareIconInSideContainer
- getEmbeddedBotIconInSideContainer

---

### ManageLibrary
> Extends: `BaseLibrary`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `RemoveButton` | `.delete-button` | button |
| `DeleteDossierDialog` | `.mstrd-ConfirmationDialog` | element |
| `RemoveSpinner` | `.mstrd-ConfirmationDialog-spinner` | element |
| `CloseButton` | `.mstrd-Button.mstrd-Button--primary` | button |

**Actions**
| Signature |
|-----------|
| `editName({ option, name, newName })` |
| `cancelRename(name)` |
| `selectItem(name)` |
| `deselectItem(name)` |
| `hitRemoveButton()` |
| `confirmRemoval()` |
| `cancelRemoval()` |
| `closeManageMyLibrary()` |
| `selectAll()` |
| `clearAll()` |
| `hoverDossier(name)` |
| `isSelectAllEnabled()` |
| `isClearAllEnabled()` |
| `isRemoveButtonEnabled()` |
| `isItemSelected(name)` |
| `isEditNameIconClickable(name)` |
| `isSelectItemIconClickable(name)` |
| `selectedItemCount()` |

**Sub-components**
- getTooltipContainer

---

### MissingNuggetsDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `NuggetsNotificationDialog` | `.ant-modal .mstrd-NuggetsNotificationDialog-main` | element |

**Actions**
| Signature |
|-----------|
| `clickReuploadButtonOnNuggetsMissingDialog()` |
| `clickCancelButtonOnNuggetsMissingDialog()` |

**Sub-components**
_none_

---

### OnBoarding
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Carousel` | `.slick-slide.slick-active.slick-current` | element |
| `MoveToRightItem` | `.slick-arrow.slick-next` | element |
| `MoveToLeftItem` | `.slick-arrow.slick-prev` | element |
| `IntroToLibraryGotIt` | `.mstrd-OnboardingCarousel-Button--got` | button |
| `ContinueTour` | `.mstrd-OnboardingCarousel-Button--continue` | button |

**Actions**
| Signature |
|-----------|
| `clickMoveRightItem()` |
| `clickMoveLeftItem()` |
| `clickIntroToLibraryGotIt()` |
| `clickIntroToLibrarySkip()` |
| `clickContinueTour()` |
| `clickLibraryOnboardingButton(area, option)` |
| `clickDossierOnboardingButton(area, option)` |
| `clickSkipButton()` |
| `clickDock(text)` |
| `hasLibraryIntroduction()` |
| `isLibraryIntroductionPresent()` |
| `isLibraryIntroduction2Present()` |
| `isLibraryIntroduction3Present()` |
| `isLibraryOnboardingAreaPresent(area)` |
| `isDossierOnboardingAreaPresent(area)` |
| `waitForToCOnboardingAreaPresent()` |
| `waitForLibraryAreaPresent(area)` |
| `waitForDossierAreaPresent(area)` |
| `getIntroductionToLibraryTitleText()` |
| `getDossierViewOnboardingTitleText(area)` |
| `hasSkipButton()` |
| `skip()` |

**Sub-components**
_none_

---

### PendoGuide
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `LibraryPendoContainer` | `._pendo-step-container-styles` | element |
| `CloseButton` | `._pendo-close-guide` | element |
| `DossierPendoContainer` | `._pendo-step-container-size` | element |
| `LibraryIconForSaas` | `.mstr-nav-icon.app-theme-webLogo.container` | element |

**Actions**
| Signature |
|-----------|
| `waitForPendoGuide()` |
| `clickPendoButton(text)` |
| `closePendoGuide()` |
| `clickPendoLinkButton(text)` |
| `isLibraryPendoContainerPresent()` |
| `isDossierPendoContainerPresent()` |
| `getLibraryPendoContainerTitleText()` |
| `getDossierPendoContainerText(index)` |
| `goToLibrary()` |
| `openSidebar()` |
| `closeSidebar()` |

**Sub-components**
- getLibraryPendoContainer
- getDossierPendoContainer

---

### Search
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SearchIcon` | `.icon-search_tb_box` | element |
| `SearchContainer` | `.mstrd-SearchNavItemContainer-container .mstrd-SearchBox` | element |
| `FilterOptionsContainer` | `.mstrd-SearchFilter` | element |
| `DossierFilterOption` | `.mstrd-SearchFilter-option.icon-dossier_rs` | element |
| `SearchSuggestion` | `.mstrd-SearchSuggestionTextView` | element |
| `ClearIcon` | `.icon-clearsearch` | element |
| `QuickSearchView` | `.mstrd-QuickSearchDropDownView` | dropdown |

**Actions**
| Signature |
|-----------|
| `openSearchSlider()` |
| `clickSearchResultInfoIcon(title)` |
| `clickDossierFilterOption()` |
| `inputTextAndOpenSearchPage(text)` |
| `inputText(text)` |
| `inputTextAndSearch(text)` |
| `clearInput()` |
| `isSearchIconPresent()` |

**Sub-components**
- getSearchContainer

---

### SearchPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `EmptyResult` | `.mstrd-NoSearchResults-inner` | element |
| `ScrollableContainer` | `.mstrd-SearchResultsListContainer` | element |
| `ResultListContainer` | `.mstrd-SearchResultsListContainer-content` | element |

**Actions**
| Signature |
|-----------|
| `goToLibrary()` |
| `browseAllDossiers()` |
| `scrollToBottom()` |
| `switchToOption(option)` |
| `clearSearch()` |
| `search(text)` |
| `openInfoWindow(title)` |
| `closeInfoWindow()` |
| `openGlobalResultInfoWindow(title)` |
| `executeResultItem(title)` |
| `executeGlobalResultItem(title)` |
| `hoverOnObject({ title, object, objectIndex = 0 })` |
| `searchString()` |
| `isFilterOptionSelected(option)` |
| `matchCount(option)` |
| `sortOption()` |
| `switchSortOrder()` |
| `isResultEmpty()` |
| `isItemDisplayed(title)` |
| `isItemCertified(title)` |
| `isDossierImageDisplayed(title)` |
| `isRSDImageDisplayed(title)` |
| `isCustomImageDisplayed(title)` |
| `isTimestampDisplayed(title)` |
| `isInfoIconDisplayed(title)` |
| `isInfoWindowOpen()` |
| `visualizationCount(title)` |
| `attributeCount(title)` |
| `metricCount(title)` |
| `objectNameInResultItem({ title, object, objectIndex = 0 })` |
| `isInfoIconFocused(title)` |

**Sub-components**
- getResultListContainer
- getPage
- getScrollableContainer
- dossierPage
- getTooltipContainer

---

### SecurityFilter
> Extends: `BaseLibrary`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SecurityFilterContainer` | `.data-model-security-filter-modal` | element |
| `NewSecurityDialog` | `.mstr-security-filter-dialog` | element |

**Actions**
| Signature |
|-----------|
| `clickNewIcon()` |
| `cancelSecurityFilterDialog()` |
| `saveSecurityFilterDialog()` |
| `saveNewSecurity()` |
| `cancelNewSecurity()` |
| `clickNewQualificaiton()` |
| `cancelNewQualification()` |
| `closeDialogue()` |
| `waitForSecurityFilterLoading()` |
| `isSecurityFilterDialogPresent()` |
| `isNewSecurityDialogPresent()` |
| `isNewQualificationEditorPresent()` |

**Sub-components**
- getSecurityFilterContainer
