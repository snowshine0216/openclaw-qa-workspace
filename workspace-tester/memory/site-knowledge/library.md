# Site Knowledge: Library Domain

## Overview

- **Domain key:** `library`
- **Components covered:** BookmarkBlade, ContentDiscovery, CopyMoveWindow, CoverImageDialog, DataModel, DossierCreator, InfoWindow, InfoWindowSnapshot, LibraryAuthoringPage, libraryConditionalDisplay, LibraryHomeBookmark, LibraryPage, LibrarySearch, ListView, ListViewAGGrid, ManageLibrary, MissingNuggetsDialog, OnBoarding, PendoGuide, Search, SearchPage, SecurityFilter
- **Spec files scanned:** 126
- **POM files scanned:** 22

## Components

### BookmarkBlade
- **CSS root:** `.ant-popover-inner-content`
- **User-visible elements:**
  - Inline Error (`.ant-popover-inner-content`)
- **Component actions:**
  - `createSnapshotOnBookmark(bookmarkName)`
  - `deleteBookmark(bookmarkName)`
  - `favoriteBookmarks(bookmarkNames)`
  - `getBookmarkListNames()`
  - `getBookmarkListNumberFromTitle()`
  - `getFavoriteBookmarkNumberFromTitle()`
  - `getInlineErrorMessage()`
  - `getTotalBookmarkNumber()`
  - `isBookmarksGroupVisible()`
  - `isEditButtonVisible(bookmarkName)`
  - `isFavoriteGroupVisible()`
  - `isSharedBookmark(bookmarkName)`
  - `openBookmark(bookmarkName)`
  - `openBookmark(bookmarkName)`
  - `renameBookmark(bookmarkName, newName)`
  - `renameBookmarkWithoutEnter(bookmarkName, newName)`
  - `shareBookmark(bookmarkName)`
  - `unfavoriteBookmarks(bookmarkNames)`
- **Related components:** getDossiersListViewContainer

### ContentDiscovery
- **CSS root:** `.mstrd-searchComboBoxSelect-inputContainer`
- **User-visible elements:**
  - Back Arrow In Mobile View (`.icon-backarrow`)
  - Close Button (`.mstrd-folderPanel-closeButton`)
  - Content Discovery Panel Detail Panel (`.mstrd-content-discovery-detail-panel`)
  - Content Discovery Title (`.mstrd-content-discovery-detail-panel-title`)
  - Context Menu (`.mstrd-DossierContextMenu-menu`)
  - Empty Content Page (`.mstrd-EmptyLibrary-content`)
  - Empty List (`.mstrd-searchComboBoxSelectDropdown-noData`)
  - Folder Context Menu (`.mstrd-ContextMenu-menu`)
  - Folder Panel (`.mstrd-folderPanel`)
  - Folder Panel Tree (`.mstrd-folderPanel-tree`)
  - Folder Panel Tree Scrollable (`.mstrd-folderPanel-treeScrollable`)
  - Folder Path (`ol.mstrd-folderPath`)
  - Folder Path Dropdown Menu (`.mstrd-navigationMenu-content`)
  - Folder Rename Textbox (`.mstrd-FolderTreeRow .mstr-rc-input`)
  - Info Window (`.mstrd-RecommendationsMainInfo-top`)
  - Loading Row (`.mstrd-FolderTreeRow.mstrd-FolderTreeRow--loadingRow`)
  - Project Dropdown (`.mstrd-DropDown-content`)
  - Project Header (`.mstrd-folderPanel-header`)
  - Project Search (`.mstrd-searchComboBoxSelect-inputContainer`)
  - Search Selector (`.mstrd-searchComboBoxSelect-inputContainer input`)
  - Tree Skeleton (`.mstrd-folderPanel-treeSkeleton`)
- **Component actions:**
  - `clickBackButtonInMobileView()`
  - `clickFolderInDropdownList(folderName)`
  - `closeFolderPanel()`
  - `collapseFolder(folderName)`
  - `dismissContextMenu()`
  - `dragFolderPanelWidth(offset)`
  - `expandFolderByPath(folderPath)`
  - `folderPanelWidth()`
  - `folderPath()`
  - `hoverDotsInFolderPath()`
  - `isEmptyContent()`
  - `isEmptyListPresent()`
  - `isFolderContextMenuExisted()`
  - `isFolderContextMenuItemExisted(item)`
  - `isFolderExist(folderName)`
  - `isFolderExpanded(folderName)`
  - `isFolderPanelOpened()`
  - `isProjectGrayedOut()`
  - `isShortcutFolder(folderName)`
  - `moveFolderIntoViewPort(folder)`
  - `openContextMenu(objectName)`
  - `openFolderByPath(folderPath)`
  - `openFolderFromFolderPath(folderName)`
  - `openFolderPanel()`
  - `openFromContextMenuForFloder(folderName, item)`
  - `openInfoWindowInTeams(objectName)`
  - `openProjectList()`
  - `renameFolder(newName)`
  - `rightClickToOpenContextMenu(folderName, isWaitCtxMenu = true)`
  - `scrollToBottomFolderTree()`
  - `scrollToTopFolderTree()`
  - `searchProject(text)`
  - `selectedFolder()`
  - `selectedProject()`
  - `selectProject(projectName)`
- **Related components:** getEmptyContentPage, getFolderPanel, isFolderPanel

### CopyMoveWindow
- **CSS root:** `.mstr-rc-icon-button`
- **User-visible elements:**
  - Clear Search Box Button (`.mstr-rc-icon-button`)
  - Copy Move Window (`.mstrd-operation-dialog`)
  - Perform Search Button (`.mstr-icons.icon-common-search-big`)
  - Project (`.mstrd-tree-section-header`)
- **Component actions:**
  - `clickCancel()`
  - `clickCreate()`
  - `clickCreateAndWaitForProcessor()`
  - `clickCreateNewFolder()`
  - `closeWindow()`
  - `expandFolderPath(folderPath)`
  - `isCreateButtonEnabled()`
  - `isRenameTextboxDisplayed()`
  - `isWindowPrensent()`
  - `moveFolderIntoView(folderName)`
  - `openFolder(folderName)`
  - `openFolderByPath(folderPath)`
  - `renameDossier(newName)`
  - `scrollToBottomFolderTree()`
  - `scrollToTopFolderTree()`
- **Related components:** getFolderPanel

### CoverImageDialog
- **CSS root:** `.mstrd-ChangeCoverContainer-main`
- **User-visible elements:**
  - Dialog (`.mstrd-ChangeCoverContainer-main`)
- **Component actions:**
  - `cancelChange()`
  - `changeCoverImageByDemoImageIndex(index)`
  - `changeCoverImageByPath(path)`
  - `closeDialog()`
  - `inputImagePath(path)`
  - `saveCoverImage()`
  - `selectDemoImageByIndex(index)`
- **Related components:** _none_

### DataModel
- **CSS root:** `.datasource-list-container`
- **User-visible elements:**
  - Data Source Container (`.datasource-list-container`)
  - DBSkeleton (`.dbRoles-skeleton`)
  - DILeft Panel (`.mstr-di-left-panel-aol-ol`)
  - Empty Table Pnel (`.auto-table-panel`)
  - Library Icon (`.mstr-di-toolbar__lib-icon`)
  - Wait Curtain (`.mstrmojo-Box.mstrIcon-wait`)
  - Wait Msg (`.mstrmojo-Label.mstrWaitMsg`)
  - Workspace Loading (`.mstr-workspace-content-loading`)
- **Component actions:**
  - `clickLibraryIcon()`
  - `waitForDMCurtainDisappear()`
  - `waitForEditDataModelLoading()`
  - `waitForNewDataModelLoading()`
- **Related components:** getDataSourceContainer

### DossierCreator
- **CSS root:** `.dossier-creator-err-container`
- **User-visible elements:**
  - Add All Datasets Checkbox (`.ag-header-select-all:not(.ag-hidden)`)
  - Certified Control (`.object-selector-header-certified-control`)
  - Create New Dossier Add Data Tree Mode (`.browsing-mode-icon.template-library-theme`)
  - Create New Dossier Confirmation Dialog (`.confirmation-dialog`)
  - Create New Dossier Panel (`.ant-modal-content`)
  - Create New Dossier Panel Create Btn (`.footer.library-theme .create-btn`)
  - Create New Dossier Panel Footer (`.template-info-footer`)
  - Create New Dossier Project List (`.rc-virtual-list-holder-inner`)
  - Create New Dossier Search Box Data (`.mstr-rc-input`)
  - Create New Dossier Select Template Info Panel (`.main-info-container`)
  - Create New Dossier Select Template Info Update Timestamp (`.updated-icon ~div .info-string`)
  - Create New Dossier Tabs (`.tab-view-container`)
  - Data Grid Container (`.ag-root-wrapper`)
  - Dossier Creator Error Message (`.dossier-creator-err-msg`)
  - Error Container (`.dossier-creator-err-container`)
  - Library Dossier Context Menu Item (`.ant-dropdown-menu-title-content`)
  - Library Navigation Bar (`.mstrd-NavBarWrapper`)
  - No Data Overlay (`.ag-overlay-no-rows-wrapper .mstr-rc-screen-with-icon`)
  - Project Picker (`.projectPicker`)
  - Selected Template Name In Grid View (`.template-item.selected`)
  - Selection Count Text (`.template-info-selection-count`)
  - Switch Project Loading Btn (`.mstr-rc-loading-dot-icon`)
  - Template Info Data (`.main-info-container .dataset-icon ~ div .info-string`)
  - Warning Message Element (`.unset-warning-popup-text`)
- **Component actions:**
  - `autoResize()`
  - `cancelCreateButton()`
  - `cancelDefaultTemplate()`
  - `cancelSwitchProject()`
  - `checkTemplateInfo(templateName)`
  - `clearSearchData()`
  - `clearSearchTemplate()`
  - `clickBlankDossierBtn()`
  - `clickCreateButton()`
  - `clickCreateButtonInNewAgentPanel()`
  - `clickDatasetCheckbox(datasetArray)`
  - `clickNameCheckbox()`
  - `clickOnToolMenu(name)`
  - `clickOnToolSubMenu(name)`
  - `closeNewDossierPanel()`
  - `closeTemplateInfo()`
  - `confirmSwitchProject()`
  - `createBlankTemplate()`
  - `createNewDossier()`
  - `createNewReport()`
  - `dismissTooltipsByClickTitle()`
  - `doubleClickOnAgGrid(folderName)`
  - `doubleClickOnTreeView(folderName)`
  - `expandTreeView(folderName, nextLevelFolder)`
  - `fakeDateModifiedColumns()`
  - `fakeUpdateTimestamp()`
  - `getActiveTabHeaderText()`
  - `getAddButtonColor()`
  - `getAddButtonCSSProperty(property)`
  - `getClearSearchTextBtn()`
  - `getCreateDossierTabNames()`
  - `getCreateNewDossierSearchBoxData()`
  - `getDataGridRow(index)`
  - `getRowCountInTemplateList()`
  - `getRowDataInAddDataTab(index)`
  - `getRowDataInListView(index, functionName)`
  - `getRowDataInTemplateListView(index)`
  - `getSelectedDatasetsCount()`
  - `getSelectedTemplateNameInGridView()`
  - `getSelectionCountText()`
  - `getTemplateInfoData()`
  - `getTemplateItemNameInGridView(index)`
  - `getTemplateItemsCntInGridView()`
  - `getTemplateListHeaders()`
  - `getTemplateListRow(index)`
  - `getTemplateNamesInGridView()`
  - `getWarningMessageText()`
  - `isAllDatasetChecked()`
  - `isAllTemplateCertified()`
  - `isBlankTemplateSelected()`
  - `isConfirmSwitchProjectPopupDisplayed()`
  - `isCreateButtonEnabled()`
  - `isDataSelected(index)`
  - `isDataSetsOrderedByDateCreatedAscending()`
  - `isNoDataDisplayed()`
  - `isTemplateHasCoverImageInGridView(templateName)`
  - `isTemplateHasCoverImageInListView(templateName)`
  - `isTemplateSelectedInGridView(templateName)`
  - `resetLocalStorage()`
  - `searchData(inputText)`
  - `searchSelectAndCreateDossier(datasetArray)`
  - `searchTemplate(inputText)`
  - `selectExecutionMode()`
  - `selectPauseMode()`
  - `selectReportCube({ name, index = 0, isWait = true })`
  - `selectTemplate(templateName)`
  - `selectViewMode(isPauseMode = true)`
  - `ShowOrHideColumns(columnNames)`
  - `ShowOrHideColumnsSetting()`
  - `sortDataByHeaderName(headerName)`
  - `sortTemplateByHeaderName(headerName)`
  - `switchAddDataTab(tab)`
  - `switchProjectByName(projectName)`
  - `switchTabViewer(type)`
  - `switchToCubesTab(language = Locales.English)`
  - `switchToDatasetTab()`
  - `switchToGridView()`
  - `switchToListView()`
  - `switchToMdxSourceTab(language = Locales.English)`
  - `switchToReportTab()`
  - `switchToSmartMode()`
  - `switchToTemplateTab(language = Locales.English)`
  - `switchToTreeMode()`
  - `toggleCertifiedOnlyForData()`
  - `toggleCertifiedOnlyForTemplate()`
  - `waitTemplateLoading()`
- **Related components:** getCreateNewAgentPanel, getCreateNewDossierPanel, getCreateNewDossierSelectTemplateInfoPanel

### InfoWindow
- **CSS root:** `.mstrd-RecommendationsList-container`
- **User-visible elements:**
  - Bot Active Switch (`.mstrd-RecommendationsMainInfo-activeSwitch`)
  - Certified Details (`.mstrd-RecommendationsMainInfo-certifiedText`)
  - Create ADCBtn (`.mstr-menu-icon-create-adc-icon`)
  - Create Bot Btn (`.mstrd-RecommendationsMainInfo-createBot`)
  - Create Dashboard Btn (`.mstrd-RecommendationsMainInfo-createDashboard`)
  - Dossier Name Inactive Substring (`.mstrd-RecommendationsMainInfo-name-inactive`)
  - Download Button (`.mstr-menu-icon-download-icon`)
  - Edit Button (`.icon-info_edit`)
  - Export Google Sheets Button (`.mstr-menu-icon.icon-share_google_sheets`)
  - Export MSTRFile From Info Window (`.icon-info_download.mstr-menu-icon`)
  - Export To PDFFrom Info Window (`.icon-info_pdf.mstr-menu-icon`)
  - Id In Info Window (`.icon-info_object_id.object-type-icon-container`)
  - Info Window (`.mstrd-RecommendationsContainer-main`)
  - Info Window Object Type Icon (`.mstrd-RecommendationsMainInfo-information`)
  - Info Window Time Stamp (`.mstr-menu-icon .icon-info_updated`)
  - Info Window User Name (`.icon-person.mstr-menu-icon`)
  - Item Share (`.mstrd-RecommendationsMainInfo-share`)
  - Loading Button (`.mstrd-Spinner-blade`)
  - Object Id (`.icon-info_object_id`)
  - Path Info (`.icon-info_folder.mstr-menu-icon`)
  - Path In Info Window (`.mstrd-shrinkableFolderPath`)
  - Recommendation Loading Icon (`.mstrd-RecommendationsList-loading`)
  - Recommendations List (`.mstrd-RecommendationsList`)
  - Related Content Container (`.mstrd-RecommendationsList-container`)
  - Replace Button (`.mstr-menu-icon-replace-icon`)
  - Security Filter Btn (`.icon-mstrd_security_filter`)
  - Tooltip (`.ant-tooltip:not(.ant-tooltip-hidden)`)
- **Component actions:**
  - `activeBot()`
  - `addTag(key, values)`
  - `botActiveSwitchText()`
  - `cancelRemove()`
  - `cancelReset()`
  - `cancelTags()`
  - `certifiedDetails()`
  - `clickCoverImage()`
  - `clickCreateADCButton()`
  - `clickCreateBotButton()`
  - `clickCreateDashboardButton()`
  - `clickDownloadButton()`
  - `clickEditButton()`
  - `clickExportCSVButton()`
  - `clickExportExcelButton()`
  - `clickExportGoogleSheetsButton()`
  - `clickFavoriteIcon()`
  - `clickInfoActionButtonByFeatureId(featureId, actionName = 'Info action button')`
  - `clickManageSubscriptionsButton()`
  - `clickReplaceButton()`
  - `clickSecurityFilterButton()`
  - `clickSnapshotCancelButton({ name, index = 0 })`
  - `clickSnapshotDoneButton({ name, index = 0 })`
  - `clickViewMoreButton()`
  - `close()`
  - `confirmRemove()`
  - `confirmReset()`
  - `confirmResetWithPrompt()`
  - `deleteItemFromInfoWindow()`
  - `deleteSnapshot({ name, index = 0 })`
  - `deleteTagKey(key)`
  - `deleteTagValue(key, value)`
  - `disableForAI()`
  - `downloadDossier()`
  - `editSnapshotName({ name, index = 0, text = '', save = true })`
  - `enableForAI(skipWaiting = false, timeout = this.DEFAULT_LOADING_TIMEOUT)`
  - `expand(dossierName)`
  - `exportRSD()`
  - `fakeTimestamp()`
  - `favorite()`
  - `favoriteData()`
  - `favoriteDossier(dossierName)`
  - `favoriteWithoutScroll()`
  - `getActionButtonsName()`
  - `getConfirmMessageText()`
  - `getDossierInRecommendationsListContainer({ name = '', index = 0 })`
  - `getDossierNameInactiveSubstringText()`
  - `getIdInInfoWindow()`
  - `getSnapshotDateTime(index = 0)`
  - `getSnapshotErrorText()`
  - `getSnapshotItemCount()`
  - `getSnapshotItems()`
  - `getSnapshotName({ name, index = 0 })`
  - `getSnapshotSection()`
  - `getSnapshotSectionBackgroundColor()`
  - `getSnapshotsHeader()`
  - `getSnapshotTitleText({ name, index = 0 })`
  - `getTagKeyValuesCount(key)`
  - `getTagsCount()`
  - `hideCertifiedDetailsText()`
  - `hideIdInInfoWindow()`
  - `hideRelatedContentContainer()`
  - `hideRelatedContentItem()`
  - `hoverOnCertifiedIcon(name)`
  - `hoverOnSnapshotItem({ name, index = 0 })`
  - `hoverOnTemplateIcon(name)`
  - `inactiveBot()`
  - `isActiveToggleButtonOn()`
  - `isAIEnabled()`
  - `isBotActive()`
  - `isCertifiedPresent()`
  - `isCreateADCButtonDisplayed()`
  - `isCreateBotPresent()`
  - `isCreateDashboardPresent()`
  - `isDossierNameInactiveSubstringPresent()`
  - `isDownloadDossierEnabled()`
  - `isDownloadDossierPresent()`
  - `isEditIconPresent()`
  - `isEmbeddedBotPresent()`
  - `isEnabledForAIIconInactive()`
  - `isEnableForAIDisplayed()`
  - `isExportCSVEnabled()`
  - `isExportExcelButtonPresent()`
  - `isExportExcelEnabled()`
  - `isExportGoogleSheetsEnabled()`
  - `isExportPDFEnabled()`
  - `isExportPDFPresent()`
  - `isFavoritesBtnPresent()`
  - `isFavoritesBtnSelected()`
  - `isFolderPathTruncated()`
  - `isManageAccessEnabled()`
  - `isManageAccessPresent()`
  - `isObjectIDPresentInInfoWindow()`
  - `isObjectTypeInInfoWindowPresent()`
  - `isOpen()`
  - `isRecommendationListPresentInInfoWindow()`
  - `isRelatedContentTitlePresent()`
  - `isRemovePresent()`
  - `isResetDisabled()`
  - `isResetPresent()`
  - `isSecurityFilterPresent()`
  - `isShareDisabled()`
  - `isSharePresent()`
  - `isSnapshotContentSectionPresent()`
  - `isTagsDisplayed()`
  - `moveTagIntoViewPort()`
  - `objectTypeInInfoWindow()`
  - `openDossierFromRecommendationsList(dossierName)`
  - `openDossierFromRecommendationsListByIndex(index)`
  - `openExportPDFSettingsWindow()`
  - `openItemInAuthoring()`
  - `openManageAccessDialog()`
  - `openSnapshotFromInfoWindow({ name, index = 0 })`
  - `pathInInfoWindow()`
  - `removeDossier()`
  - `removeFavorite()`
  - `removeFavoriteDossier(dossierName)`
  - `resetFromInfoWindow(wait = true)`
  - `saveTags()`
  - `scrollSnapshotPanelToBottom()`
  - `scrollSnapshotPanelToTop()`
  - `selectRemove()`
  - `selectReset()`
  - `shareDossier()`
  - `showIconTooltip({ option })`
  - `showTooltipOfExportPDFIcon()`
  - `waitForDownloadComplete({ name, fileType })`
  - `waitForExportLoadingButtonToDisappear(timeout = 60000)`
  - `waitForInfoIconAppear()`
  - `waitForNoSubscriptionButton()`
  - `waitForSnapshotSection()`
- **Related components:** dossierPage, getDossierInRecommendationsListContainer, getEnableForAIStatusContainer, getInfoWindowTimeStampTextContainer, getRelatedContentContainer, getTagsContainer, libraryPage

### InfoWindowSnapshot
- **CSS root:** `.mstrd-Spinner-blade`
- **User-visible elements:**
  - Loading Button (`.mstrd-Spinner-blade`)
  - Snapshot Content Title (`.mstrd-SnapshotList-title`)
  - Snapshot Icon In Bookmark Drop Down (`.mstrd-RecommendationsMainInfo-bookmarkOption .mstrd-SnapshotIconButton`)
  - Snapshot Icon In Info Window (`.mstrd-RecommendationsMainInfo-snapshot.mstrd-SnapshotIconButton`)
  - Snapshot Section (`.mstrd-SnapshotList`)
- **Component actions:**
  - `clickSnapshotCancelButton({ name, index = 0 })`
  - `clickSnapshotDoneButton({ name, index = 0 })`
  - `clickSnapshotIconInInfoWindow()`
  - `deleteSnapshot({ name, index = 0 })`
  - `editSnapshotName({ name, index = 0, text = '', save = true })`
  - `getSnapshotCancelButton({ name, index = 0 })`
  - `getSnapshotDateTime(index = 0)`
  - `getSnapshotDeleteButton({ name, index = 0 })`
  - `getSnapshotDoneButton({ name, index = 0 })`
  - `getSnapshotEditButton({ name, index = 0 })`
  - `getSnapshotErrorText()`
  - `getSnapshotInput({ name, index = 0 })`
  - `getSnapshotItem({ name, index = 0 })`
  - `getSnapshotItemBackgroundColor({ name, index = 0 })`
  - `getSnapshotItemCount()`
  - `getSnapshotItemCSSProperty({ name, index = 0, property })`
  - `getSnapshotItemHeight({ name, index = 0 })`
  - `getSnapshotItemWidth({ name, index = 0 })`
  - `getSnapshotListErrorText()`
  - `getSnapshotName({ name, index = 0 })`
  - `getSnapshotSectionBackgroundColor()`
  - `getSnapshotsHeader()`
  - `getSnapshotsItemCount()`
  - `getSnapshotTitle({ name, index = 0 })`
  - `getSnapshotTitleText({ name, index = 0 })`
  - `getSnapshotTooltipText()`
  - `hoverOnSnapshotItem({ name, index = 0 })`
  - `isSnapshotContentSectionPresent()`
  - `isSnapshotIconInBookmarkDropDownExisting()`
  - `isSnapshotIconInInfoWindowDisplayed()`
  - `isSnapshotSectionVisible()`
  - `openSnapshotFromInfoWindow({ name, index = 0 })`
  - `scrollSnapshotPanelToBottom()`
  - `scrollSnapshotPanelToTop()`
  - `waitForExportLoadingButtonToDisappear(timeout = 60000)`
  - `waitForSnapshotSection()`
- **Related components:** _none_

### LibraryAuthoringPage
- **CSS root:** `.mstrd-CreateDossierDropdownMenuContainer`
- **User-visible elements:**
  - Add Button In Unstructured Data Panel (`.mstrd-UnstructuredDataUploadDialog-uploadBtn`)
  - Change Project (`.ant-select-selection-item`)
  - Clear Input Button In Dataset Panel (`.mstr-filter-search-input-btn`)
  - Confirmation Dialog (`.mstr-react-dossier-creator-confirmation-dialog`)
  - Contents Panel (`.mstrmojo-TableOfContents`)
  - Create Dossier Dropdown Menu (`.mstrd-CreateDossierDropdownMenuContainer`)
  - Create New Bot Button (`.mstrd-CreateDossierDropdownMenuContainer-text-wrapper.icon-mstrd_custom_bot_normal`)
  - Create New Panel Content (`.mstrd-DropdownMenu-main`)
  - Create With New Data Button (`.blank-dossier-btn`)
  - Dashboard Formatting Button (`.item.dashboardStyles.mstrmojo-ui-Menu-item`)
  - Dashboard Formatting Pop Up (`.mstrmojo-Editor.DashboardStyles.modal`)
  - Dashboard Properties Button (`.item.docProps.mstrmojo-ui-Menu-item`)
  - Dashboard Properties Export To Excel Dialog (`.mstr-docprops-container`)
  - Dashboard Properties Export To PDFDialog (`.mstr-docprops-container`)
  - Data Import Dialog (`.mstrmojo-di-popup`)
  - Data Set Loading Indicator After Select Project (`.mstr-rc-loading-dot-icon`)
  - Direct Save Button (`.item.btn.save .btn`)
  - Dropdown Menu (`.mstrd-DropdownMenu-main`)
  - Edit Btn On Library Toolbar (`.mstr-nav-icon.icon-info_edit`)
  - File Button (`.item.mb.file`)
  - Format Button (`.item.mb.style`)
  - Home Icon (`.mstr-nav-icon.icon-library`)
  - Layer Panel (`.mstrmojo-RootView-vizControl`)
  - Library Loading (`.mstrd-LoadingIcon-content`)
  - Loading In Save Editor (`.mstrmojo-BookletLoader`)
  - Lock Page Size Check Box (`.mstrmojo-CheckBox.pageSize`)
  - Lock Page Size Helper Icon (`.mstrmojo-Box.helpIcon`)
  - Maximize Visualization Dropdown List (`.mstr-docprops-select-dropdown__dropdown-list`)
  - New Dataset Dialog (`.mstrmojo-di-view-popup.new-dataset`)
  - New Dataset Selector Diag (`.mstrmojo-vi-ui-editors-NewDatasetSelectorContainer`)
  - New Document Button (`.mstrd-CreateDossierDropdownMenuContainer-create-document`)
  - New Dossier Icon (`.mstrd-CreateDossierNavItemContainer-icon`)
  - New Dossier Project Selection Dropdown List (`.mstr-select-container__menu`)
  - Project Selection Preloader (`.mstr-react-dossier-creator-preloader`)
  - Project Selection Window (`.ant-modal-wrap`)
  - Project Selection Window Title (`.ant-modal-title`)
  - Saved In Folder Dropdown (`.mstrmojo-Popup-content.mstrmojo-OBNavigatorPopup`)
  - Save Overwrite Confirmation (`.mstrmojo-alert.modal`)
  - Search Data Set Input Box (`.object-selector-header-search-input input`)
  - Unstructured Filelist (`.mstrd-UnstructuredDataUploadDialog-fileList`)
  - Upload Btn (`.upload-button`)
  - Viz Doc (`.mstrmojo-VIDocLayout`)
- **Component actions:**
  - `cancelSaveAs()`
  - `changeProjectTo(project)`
  - `clearSearch()`
  - `clickCancelButton()`
  - `clickCloseButtonIfVisible()`
  - `clickComponentFromLayerPanel(componentName)`
  - `clickConfirmationDialogOkButton()`
  - `clickCreateBotOption()`
  - `clickCreateButton()`
  - `clickCreateButtonForPendo()`
  - `clickCreateWithNewDataButton()`
  - `clickDashboardPropertiesOkButton()`
  - `clickDataImportDialogCancelButton()`
  - `clickDataImportDialogCreateButton()`
  - `clickDataImportDialogImportButton()`
  - `clickDataImportDialogPrepareDataButton()`
  - `clickDataImportDialogSampleFiles()`
  - `clickDatasetCheckbox(dataset)`
  - `clickDatasetTypeInAddDataPanel(datasetType)`
  - `clickDatasetTypeInDatasetPanel(datasetType)`
  - `clickExportToExcelTab()`
  - `clickExportToPDFTab()`
  - `clickFormatCheckbox(format)`
  - `clickHomeIcon()`
  - `clickLockPageSizeCheckBox()`
  - `clickLockPageSizeHelperIcon()`
  - `clickMaximizeVisualizationOption(optionLabel)`
  - `clickMaximizeVisualizationSelectColumn()`
  - `clickNewADCButton()`
  - `clickNewBot2Button()`
  - `clickNewBotButton()`
  - `clickNewDataModelButton()`
  - `clickNewDossierButton(waitForDataset = true)`
  - `clickNewDossierIcon()`
  - `clickNewReportButton()`
  - `clickOKButton()`
  - `clickPreviewButton()`
  - `clickUploadButton()`
  - `closeDataImportDialog()`
  - `createADCWithDataset({ project = 'MicroStrategy Tutorial', dataset })`
  - `createADCWithUnstructuredData({ project = 'MicroStrategy Tutorial', unstructuredData })`
  - `createBlankDashboard()`
  - `createBlankDashboardFromLibrary()`
  - `createBlankDashboardFromSaaSLibrary()`
  - `createBotWithADC({ project = 'MicroStrategy Tutorial', aiDataCollection })`
  - `createBotWithDataset({ project = 'MicroStrategy Tutorial', dataset })`
  - `createBotWithNewData({ project = 'MicroStrategy Tutorial' })`
  - `createBotWithNewDataInDefaultProject()`
  - `createBotWithReports({ project = 'MicroStrategy Tutorial', reports = [] })`
  - `createDashboardWithDataset({ project = 'MicroStrategy Tutorial', dataset })`
  - `createDashboardWithReport({ project = 'MicroStrategy Tutorial', report })`
  - `createDocumentFromLibrary(projectName)`
  - `createDossierFromLibrary()`
  - `createReportFromLibrary(projectName = 'MicroStrategy Tutorial')`
  - `deleteUnstructuredDataInUploadDialog(filename)`
  - `editDossierFromLibrary()`
  - `editDossierFromLibraryWithNoWait()`
  - `getCheckboxOfBotDataset(dataset)`
  - `getConfirmationDialogMessage()`
  - `getCreateBotText()`
  - `getCreateNewMenuItemsText()`
  - `getDatasetNameCheckbox(dataset)`
  - `getFocusedMenuOptionLabel()`
  - `getMaximizeVisualizationRow()`
  - `getMaximizeVisualizationSelectColumn()`
  - `getObjectNameInPathPreview()`
  - `getProjectSelectionWindowTitle()`
  - `getRowOfBotDataset(dataset)`
  - `getSaveInFolderDropdownOptionsText()`
  - `getSaveInFolderSelectionText()`
  - `goToHome()`
  - `hasASelectedDataSource()`
  - `isBotCreateWithNewDataButtonVisible(text = 'Create with New Data')`
  - `isBotDatasetDisplayedInViewport(datasetName)`
  - `isBrowingExplorerDisplayed()`
  - `isBrowsingFolderPresent(folderName)`
  - `isCloseButtonVisible()`
  - `isConfirmationDialogDisplay()`
  - `isCreateADCOptionPresent()`
  - `isCreateBotOptionPresent()`
  - `isCreateDashboardBtnPresent()`
  - `isCreateDataModelBtnPresent()`
  - `isCreateNewButtonPresent()`
  - `isCreateNewDropdownOpen()`
  - `isDataImportDialogPrepareDataButtonDisabled()`
  - `isDataImportDialogPresent()`
  - `isDatasetDisabledInDatasetPanel(dataset)`
  - `isDatasetDisplayedInViewport(datasetName)`
  - `isDatasetExistedInDatasetPanel(dataset)`
  - `isEditIconPresent()`
  - `isHomeIconPresent()`
  - `isNewBotButtonPresent()`
  - `isNewDossierWindowCertifiedEnabled()`
  - `isNewFolderButtonDisplayed()`
  - `isNoDataScreenPresent()`
  - `isProjectGrayedOut()`
  - `isProjectSelectionWindowPresent()`
  - `isProjectSelectionWindowVisible()`
  - `isPromptOptionsInSaveAsEditorDisplayed()`
  - `isSaveOverwriteConfirmation()`
  - `isSmartExplorerDisplayed()`
  - `isUploadBtnDisplayed()`
  - `openCreateNewBotDialog()`
  - `openDashboardFormatting()`
  - `openDashboardFormattingMenu()`
  - `openDashboardPropertiesMenu()`
  - `openDefaultZoomDropDown()`
  - `openFileMenu()`
  - `openFormatMenu()`
  - `saveAsDashboard(dashboardName)`
  - `saveDashboard(dashboardName)`
  - `saveDashboardInMyReports(dashboardName)`
  - `saveDashboardProperties()`
  - `saveInMyReport(name, path)`
  - `saveProjectSelection()`
  - `saveToFolder(name, path, parentFolder = 'Shared Reports')`
  - `saveUnstructuredDataToMD(path)`
  - `scrollDatasetListsToBottom()`
  - `searchDataSet(string)`
  - `searchForDataByName(name)`
  - `searchForProject(projectName)`
  - `selectDatasetAfterSelectBotTemplate(dataset)`
  - `selectDataSetByName(datasetName)`
  - `selectDatasets(datasets, create = false)`
  - `selectMaximizeVisualizationCurrentPanel()`
  - `selectMaximizeVisualizationEntireDashboard()`
  - `selectMaximizeVisualizationMode(optionLabel)`
  - `selectProject(projectName)`
  - `selectProjectAndADCAndDataset(project, dataset, preview = false)`
  - `selectProjectAndAIBots(project, datasets, skipProject = false)`
  - `selectProjectAndDataset(project, dataset)`
  - `selectProjectAndReport(project, report)`
  - `selectProjectAndUnstructuredData(project, unstructuredData)`
  - `selectProjectAndUnstructuredDataPanel(project)`
  - `selectSampleFileByIndex(index)`
  - `selectSubBotInUnversalBot(subbots)`
  - `selectUnstructuredData(unstructuredData)`
  - `simpleSaveDashboard()`
  - `switchToBrowsingMode()`
  - `switchToProject(newProjectName)`
  - `switchToSmarkMode()`
  - `toggleNewDossierCertifiedSwitch()`
  - `uploadUnstructuredData(filePaths)`
  - `uploadUnstructuredFileFromDisk(filePath)`
  - `waitForAddDataSelectionWindowAppear()`
  - `waitForAddUnstructuredDataDialogAppear()`
  - `waitForAllUnstructuredFileUploadComplete(timeout = 180000)`
  - `waitForDataPreviewWindowAppear()`
  - `waitForProjectSelectionWindowAppear()`
  - `waitForUnstructuredFileUploadComplete(filename, timeout = 180000)`
  - `waitLibraryLoadingDisplayedAndThenNotDisplayed(seconds = 10)`
  - `waitLibraryLoadingIsNotDisplayed(seconds = 10)`
  - `waitLoadingDataPopUpIsNotDisplayed(seconds = 10)`
- **Related components:** aibotChatPanel, clickDatasetTypeInAddDataPanel, clickDatasetTypeInDatasetPanel, dossierPage, getAddButtonInUnstructuredDataPanel, getClearInputButtonInDatasetPanel, getComponentFromLayerPanel, getCreateNewPanel, getDatabaseTablePanel, getDataPreviewContainer, getDataseListContainer, getLayerPanel, getLockPage, libraryPage, selectProjectAndUnstructuredDataPanel

### libraryConditionalDisplay
- **CSS root:** `.mstrmojo-unit-container-menu`
- **User-visible elements:**
  - Conditional Display Dialog (`.cf-editor`)
  - Layer Element List (`.ant-tree.ant-tree-directory`)
  - New Condition Dialog (`.mstrmojo-vi-ui-ConditionEditor`)
  - Right Click Menu (`.mstrmojo-unit-container-menu`)
- **Component actions:**
  - `applyConditionalDisplaySettings()`
  - `chooseElement(option)`
  - `clickConditionalDisplayOKButton()`
  - `closeConditionalDisplayDialog()`
  - `closeNewConditionDialog()`
  - `deleteCondition()`
  - `deleteConditionByElement(option)`
  - `getConditionTitle(option)`
  - `hoverOnConditionName(option)`
  - `IsConditionalDisplayDialogButtonEnabled(buttonName)`
  - `openConditionalDisplayDialog()`
  - `openConditionalRelationDropdown(option)`
  - `OpenElementMenu(option)`
  - `openNewConditionDialog(option)`
  - `selectConditionRelation(option)`
  - `selectElementInList(option)`
  - `selectNewConditionElement(option)`
- **Related components:** libraryPage

### LibraryHomeBookmark
- **CSS root:** `.mstrd-DropDown-content .mstrd-DropDown-children`
- **User-visible elements:**
  - Bookmark Dropdown (`.mstrd-DropDown-content .mstrd-DropDown-children`)
  - Bookmark Entry (`.mstrd-DropDown .mstrd-DropDownButton`)
- **Component actions:**
  - `applyBookmark(bookmarkName)`
  - `clickDefaultOption()`
  - `clickMyBookmarkLabel()`
  - `isBookmarkDropdownDisplayed()`
  - `isBookmarkEntryDisplayed()`
  - `isSharedBookmarkDisplayed()`
  - `openBookmarkDropdown()`
- **Related components:** _none_

### LibraryPage
- **CSS root:** `.mstrd-LibraryViewContainer`
- **User-visible elements:**
  - Authoring Close Btn (`.mstrmojo-RootView-menubar .item.btn.close`)
  - Blurred App Container (`.mstrd-AppContainer-mainContent--blur`)
  - Dossier Name Input (`.mstrd-DossierItem-nameInput,.mstrd-DossierItemRow-renameInput`)
  - Dossiers List Container (`.mstrd-DossiersListContainer`)
  - Empty Library From Filter (`.mstrd-EmptyLibraryFromFilter-content`)
  - Hamburger Icon (`.mstrd-HamburgerIconContainer`)
  - Instruction Title In Sider Section (`.mstrd-SaasPlaceholder-description`)
  - Library Content Container (`.mstrd-ContentListContainer`)
  - Library Curtain (`.mstrd-LibraryViewCurtain`)
  - Library Icon (`.mstr-nav-icon.icon-library,.mstrd-LibraryNavItem-link`)
  - List Container Header (`.mstrd-DossiersListContainer-header`)
  - Message Box Container (`.mstrd-MessageBox-main.mstrd-MessageBox-main--modal`)
  - Missing Font Popup (`.win.mstrmojo-Editor`)
  - Multi Selection Toolbar (`.mstrd-MultiSelectionToolbar`)
  - Navigation Bar (`.mstrd-NavBarWrapper`)
  - Navigation Bar Collapsed Icon (`.mstrd-NavBarTriggerIcon`)
  - Notification Icon (`.mstrd-NotificationIcon`)
  - OKButton (`.ok-button`)
  - Recommendation Loading Icon (`.mstrd-RecommendationsList-loading`)
  - Title (`.mstrd-NavBarTitle > .mstrd-NavBarTitle-item.mstrd-NavBarTitle-item-active`)
  - Trial Wrapper (`.mstrd-ContentListContainer-trialWrapper`)
  - Upgrade Button In Sider Section (`.mstrd-SaasPlaceholder-description .mstrd-SaasUpgradeButton-button`)
  - View Container (`.mstrd-LibraryViewContainer`)
- **Component actions:**
  - `clickAccountOption(text)`
  - `clickAuthoringCloseBtn()`
  - `clickDossierContextMenuItem(item1, item2 = '', isMobile = false)`
  - `clickDossierContextMenuItemNoWait(item)`
  - `clickDossierFavoriteIcon(name)`
  - `clickDossierSecondaryMenuItem(item)`
  - `clickFavoriteByImageIcon(name, selected = true)`
  - `clickLibraryIcon()`
  - `clickMultiSelectBtn()`
  - `clickNarvigationBar()`
  - `clickUpgradeButtonInSiderSection()`
  - `clickUpgradeButtonInTrialBanner()`
  - `closeSidebar()`
  - `closeSystemStatusBar(index)`
  - `closeUserAccountMenu()`
  - `collectLineCoverageInfo(outputFolderString, testName)`
  - `createNewDashboardByUrl({ projectId = 'B628A31F11E7BD953EAE0080EF0583BD' }, handleError = true)`
  - `createNewReportByUrl({ projectId = 'B628A31F11E7BD953EAE0080EF0583BD' }, handleError = true)`
  - `dismissMissingFontPopup()`
  - `dismissQuickSearch()`
  - `dissmissPopup()`
  - `editBotByUrl({ appId = 'C2B2023642F6753A2EF159A75E0CFF29', projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', botId }, handleError = true)`
  - `editDossierByUrl({ projectId, dossierId }, handleError = true)`
  - `editDossierByUrlwithMissingFont({ projectId, dossierId }, handleError = true)`
  - `editDossierByUrlwithPrompt({ projectId, dossierId }, handleError = false)`
  - `editDossierWithPageKeyByUrl({ projectId, dossierId, pageKey }, handleError = true)`
  - `editReportByUrl({ projectId, dossierId }, handleError = true)`
  - `enableReactIntegration()`
  - `expandCollapsedNavBar()`
  - `favoriteByImageIcon(name)`
  - `getAllCountFromTitle()`
  - `getBotCount()`
  - `getDataModelCountFromTitle()`
  - `getDossierCount()`
  - `getFavoritesCountFromTitle()`
  - `getFirstDossierName()`
  - `getGroupCountFromTitle(group)`
  - `getInstructionTitleInSiderSectionText()`
  - `getItemsCount(name, owner = null)`
  - `getListContainerHeaderFont()`
  - `getListContainerHeaderText()`
  - `getMenuContextItemCount()`
  - `getTitleText()`
  - `getTrialBannerMessageText()`
  - `handleError()`
  - `hideDossierListContainer()`
  - `hoverDossier(name)`
  - `hoverHomeCardAIDisabledIcon(name)`
  - `hoverHomeCardAIEnabledIcon(name)`
  - `hoverOnShare()`
  - `isAccountIconPresent()`
  - `isAccountOptionPresent(text)`
  - `isAIEnabled(name)`
  - `isAuthoringCloseButtonDisplayed()`
  - `isBackgroundBlurred()`
  - `isCodeCoverageEnabled()`
  - `isDossierContextMenuItemExisted(item)`
  - `isDossierDeprecated(dossierName)`
  - `isDossierIconGrayscale(dossierName)`
  - `isDossierInactive(dossierName)`
  - `isDossierInLibrary(dossier)`
  - `isDossierPresent(dossierName)`
  - `isFavoriteIconPresent(name)`
  - `isFavoritesIconSelected(name)`
  - `isFavoritesPresent()`
  - `isLibraryEmpty()`
  - `isLibraryEmptyFromFilter()`
  - `isLibraryIconPresent()`
  - `isLogoutPresent()`
  - `isMultiSelectBtnActive()`
  - `isMultiSelectBtnPresent()`
  - `isNavBarExpandBtnPresent()`
  - `isNavigationBarPresent()`
  - `isNotificationIconPresent()`
  - `isSecondaryContextMenuItemDisabled(name)`
  - `isSecondaryContextMenuItemExisted(name)`
  - `isSelectedSidebarItem(item)`
  - `isSessionTimeoutAlertDisplayed()`
  - `isSidebarOpened()`
  - `isSystemStatusBarDisplayed(index)`
  - `isSystemStatusCloseBtnDisplayed(index)`
  - `isTitleDisaplayed()`
  - `isUpgradeButtonInSiderSectionPresent()`
  - `isUpgradeButtonInTrialBannerPresent()`
  - `isViewCurtainPresent()`
  - `logout(options = {})`
  - `logoutClearCacheAndLogin(credentials, skipOpenAccountMenu = false)`
  - `openBot(name)`
  - `openBotById({
        appId = 'C2B2023642F6753A2EF159A75E0CFF29', projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', botId, handleError = true, useDefaultApp = false, })`
  - `openBotByIdAndWait({
        appId = 'C2B2023642F6753A2EF159A75E0CFF29', projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', botId, })`
  - `openBotByUrl(url, handleError = true)`
  - `openBotNoWait(name)`
  - `openDebugMode(debugBundles)`
  - `openDocumentNoWait(name)`
  - `openDossier(name, owner = null)`
  - `openDossierAndRunPrompt(name)`
  - `openDossierById({ projectId, dossierId, applicationId = null }, handleError = true)`
  - `openDossierByUrl(url, handleError = true)`
  - `openDossierContextMenu(name, isMobile = false)`
  - `openDossierContextMenuNoWait(name)`
  - `openDossierInfoWindow(dossierName)`
  - `openDossierNoWait(name, owner = null)`
  - `openDossierWithKeyboard(name)`
  - `openFirstBot()`
  - `openHamburgerMenu()`
  - `openInvalidUrl(suffix, libraryUrl = browser.options.baseUrl)`
  - `openPreferencePanel()`
  - `openReportByUrl({ projectId, documentId, prompt = false, noWait = false })`
  - `openReportNoWait(name)`
  - `openSidebar(hasSubmenu = false)`
  - `openSidebarOnly()`
  - `openSnapshotById({
        appId = 'C2B2023642F6753A2EF159A75E0CFF29', projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', objectId, messageId, handleError = true, useDefaultApp = true, })`
  - `openSnapshotByUrl(url, handleError = true)`
  - `openUrl(projectID, documentID, libraryUrl = browser.options.baseUrl, handleError = true)`
  - `openUrlWithPage(projectID, documentID, pageID, libraryUrl = browser.options.baseUrl)`
  - `openUserAccountMenu()`
  - `performanceData(actionList)`
  - `refresh()`
  - `reload()`
  - `removeDossierFromLibrary(usercredentials, targetDossier, flag = true, isLogout = true)`
  - `removeFavoriteByImageIcon(name)`
  - `renameDossier(newName)`
  - `resetToLibraryHome()`
  - `selectDossier(name)`
  - `showDossierListContainer()`
  - `switchUser(credentials)`
  - `waitForEnableAIReady(name)`
  - `waitForLibraryLoading()`
  - `waitForProgressBarGone()`
- **Related components:** dossierPage, getBlurredAppContainer, getDossiersListContainer, getLibraryContentContainer, getListContainer, getMessageBoxContainer, loginPage

### LibrarySearch
- **CSS root:** `.mstrd-QuickSearchDropDownView`
- **User-visible elements:**
  - Results (`.mstrd-QuickSearchDropDownView`)
- **Component actions:**
  - `attributeCount({ section, index })`
  - `checkMatchItems(section)`
  - `clearAllRecentlySearchedItems()`
  - `clearRecentlySearchedItem(index)`
  - `clearSearch()`
  - `dismissSearch()`
  - `dossierNameInResultItem({ section, index })`
  - `executeRecentlySearchedItem(index)`
  - `executeResultItem({ section, index })`
  - `isClearSearchIconDisplayed()`
  - `isInputBoxEmpty()`
  - `isRecentlySearchedListPresent()`
  - `isRecentlySearchedResultEmpty()`
  - `isResultEmpty()`
  - `isSectionPresent(section)`
  - `isTextHighlighted(text)`
  - `isUserProfileDisplayed()`
  - `localSearch(text)`
  - `matchCount(section)`
  - `metricCount({ section, index })`
  - `objectNameInResultItemByIndex({ section, index, objectIndex })`
  - `openSearchBox()`
  - `pressEnter()`
  - `recentlySearchedItem(index)`
  - `recentlySearchedItemCount()`
  - `resultItem({ section, index })`
  - `search(text)`
- **Related components:** dossierPage, libraryPage, searchPage

### ListView
- **CSS root:** `.mstrd-LibraryViewContainer`
- **User-visible elements:**
  - Dossiers List View Container (`#mstrd-Root .mstrd-DossiersListContainer`)
  - Edit Option In IW (`.mstrd-WebEditIcon.icon-info_edit`)
  - Extra Buttons Dropdown (`.mstrd-ExtraButtonsDropdown-popover`)
  - Grid View Button For Mobile (`.mstrd-NavBarViewModeSwitch .icon-tb_resp_gridview`)
  - Library View Container (`.mstrd-LibraryViewContainer`)
  - List View Button For Mobile (`.mstrd-NavBarViewModeSwitch .icon-tb_resp_listview`)
  - List View Grid (`.mstrd-DossiersListAGGridList`)
  - List View Info Window (`.mstrd-InfoPanelSidebarContainer-content`)
  - List View Info Window Container For Mobile (`.mstrd-InfoPanelSidebarContainer-drawer`)
  - List View Info Window Main Panel (`.mstrd-RecommendationsMainInfo`)
  - List View Info Window Top (`.mstrd-RecommendationsMainInfo-top`)
  - Manage Access Dialog (`.mstrd-ManageAccessContainer`)
  - More Optiob Drop Down In IW (`.mstrd-ExtraButtonsDropdown-popover`)
  - More Option In IW (`.icon-group_options.mstr-menu-icon`)
  - Owner Text (`.mstrd-RecommendationsMainInfo-information`)
  - Remove Confirmation Dialog (`.mstrd-ConfirmationDialog`)
  - Sort Bar (`.mstrd-SortTypeHeaderBar`)
  - Updated Text (`.mstrd-RecommendationsMainInfo-information`)
  - View Mode Switch (`.mstrd-NavBarViewModeSwitch-segmentedControl`)
- **Component actions:**
  - `cancelRemoveFromInfoWindow()`
  - `clickBackArrow()`
  - `clickCloseIcon()`
  - `clickContextMenuItem(item)`
  - `clickCopyFromIW()`
  - `clickCoverImageOnInfoWindow()`
  - `clickCreateADCFromIW()`
  - `clickCreateBotFromIW()`
  - `clickCreateShortcutFromIW()`
  - `clickDeleteFromIW()`
  - `clickDossierEditIcon(name, isMobileView = false)`
  - `clickDownloadDossierFromIW()`
  - `clickEmbedBotFromIW()`
  - `clickExportButtonOnExcelPanel()`
  - `clickExportExcelFromIW()`
  - `clickExportPDFIcon()`
  - `clickExportPDFIconFromIW()`
  - `clickManageAccessFromIW()`
  - `clickMoreMenuFromIW()`
  - `clickMoveFromIW()`
  - `clickRemoveFromInfoWindow(name)`
  - `clickRenameFromIW()`
  - `clickReportLinkInExcelExportWindow()`
  - `clickSelectAllFromListView()`
  - `clickShareFromIW()`
  - `clickSortBarColumn(columnType, sortOrder)`
  - `contentPath(name, isMobileView = false)`
  - `contentProject(name, isMobileView = false)`
  - `contentUpdatedTime(name, isMobileView = false)`
  - `deselectItemInListView(name)`
  - `deselectListViewMode()`
  - `deselectListViewModeMobile()`
  - `disableForAI()`
  - `enableForAI()`
  - `getDeleteIconTooltipInInfoWindow()`
  - `getInfoWindowActionCount()`
  - `getInfoWindowMorActionAcount()`
  - `getLastDossierName()`
  - `getLastDossierOwner()`
  - `getRemoveConfirmationMessageText()`
  - `hoverDossier(name, isMobileView = false)`
  - `hoverEnabledForAIIndicator(name)`
  - `isAddToLibraryIconPresent(name, isMobileView = false)`
  - `isAIEnabledInInfoWindow()`
  - `isAIEnabledInListColumn(name)`
  - `isAllSelectionCheckboxChecked()`
  - `isBotInInfoWindowActive()`
  - `isCertifiedPresentInInfoWindow()`
  - `isCopyIconPresentInInfoWindow()`
  - `isCreateShortcutIconPresentInInfoWindow()`
  - `isDateColumnSorted(sortOrder)`
  - `isDeleteIconPresentInInfoWindow()`
  - `isDossierDownloadIconPresent(name, isMobileView = false)`
  - `isDossierEditIconPresent(name, isMobileView = false)`
  - `isDossierResetIconPresent(name, isMobileView = false)`
  - `isDossierShareIconDisabled(name, isMobileView = false)`
  - `isDossierShareIconPresent(name, isMobileView = false)`
  - `isDossiersListViewContainerPresent()`
  - `isEditButtonPresentInIW()`
  - `isEnabledForAIIconInactive()`
  - `isFavoritesIconPresent(name, isMobileView = false)`
  - `isListViewInfoWindowPresent()`
  - `isListViewModeSelected()`
  - `isListViewModeSelectedMobile()`
  - `isManageAccessIconPresentInInfoWindow()`
  - `isMobileInfoWindowOpened()`
  - `isMoreMenuIconPresentInInfoWindow()`
  - `isMoveIconPresentInInfoWindow()`
  - `isNameColumnSorted(sortOrder)`
  - `isOnOriginalInfoWindowPage()`
  - `isOwnerColumnSorted(sortOrder)`
  - `isRenameIconPresentInInfoWindow()`
  - `isShareDisabled()`
  - `isShareIconPresentInInfoWindow()`
  - `isSingleSelectionCheckboxChecked(name)`
  - `isSortBarColumnActive(columnType)`
  - `isSortBarColumnAscending(columnType)`
  - `isSortBarPresent()`
  - `isTagsDisplayed()`
  - `isViewModeSwitchPresent()`
  - `objectTypeInListMobileViewDisplayed(name, isMobileView = true)`
  - `objectTypeInListViewIndoWindow()`
  - `openContextMenu(name)`
  - `openDossier(name, isMobileView = false)`
  - `openInfoWindowFromListView(name)`
  - `openInfoWindowFromMobileView(name)`
  - `openShareFromListView(name)`
  - `pathInListViewInfoWindow()`
  - `rightClickToOpenContextMenu({ name, isMobileView = false, isWaitCtxMenu = true })`
  - `selectItemInListView(name)`
  - `selectListViewMode()`
  - `selectListViewModeMobile()`
- **Related components:** dossierPage, getDossiersListViewContainer, getEnableForAIStatusContainer, getListViewInfoWindowContainer, getTagsContainer, libraryPage

### ListViewAGGrid
- **CSS root:** `.mstrd-DossiersListAGGridList .ag-center-cols-viewport`
- **User-visible elements:**
  - AGGrid Container Content Height (`.mstrd-DossiersListAGGridList .ag-center-cols-viewport`)
  - AGGrid Container Scroll Height (`.mstrd-DossiersListAGGridList .ag-body-viewport`)
  - Checkbox Select All (`.ag-header-select-all`)
  - Context Menu (`.mstrd-ContextMenu.mstrd-DossierContextMenu`)
  - Dossier Rename Textbox (`.mstrd-DossierItemRow-folderObjectRename .mstr-rc-input`)
  - Item Context Menu (`.mstrd-ContextMenu-menu`)
  - Side Columns Panel (`.ag-tool-panel-wrapper .ag-column-panel`)
  - Side Container In List View (`.mstrd-InfoPanelSidebarContainer`)
- **Component actions:**
  - `addColumnByNameList(nameList)`
  - `addColumnByTickCheckbox(posIndex)`
  - `clickAddToLibraryIconInGrid(name)`
  - `clickAutoResizeButton()`
  - `clickCheckboxInGrid(name)`
  - `clickCheckboxInGridByIndex(index)`
  - `clickCheckboxSelectAll()`
  - `clickColumnCheckboxByIndex(posIndex, isChecked)`
  - `clickColumnsButton()`
  - `clickContextMenuIconInGrid(name)`
  - `clickContextMenuIconInGridByIndex(index)`
  - `clickCreateSnapshotButton()`
  - `clickDossierRow(name)`
  - `clickEditIconInGrid(name)`
  - `clickEmbeddedBotButtonInGrid(name)`
  - `clickExportPDFIconInGrid(name)`
  - `clickFavoriteByImageIcon(name, selected = true)`
  - `clickInfoWindowIconInGrid(name)`
  - `clickInfoWindowIconInGridByIndex(index)`
  - `clickResetIconInGrid(name)`
  - `clickShareIconInGrid(name)`
  - `clickSideLabelInListView(buttonLabel)`
  - `clickSortBarColumn(columnLabel, sortOrder)`
  - `favoriteByImageIcon(name)`
  - `getAGGridGroupItemCount(groupName)`
  - `getAGGridItemCount()`
  - `getLastDossierName()`
  - `getLastDossierOwner()`
  - `hoverDossier(name)`
  - `hoverDossierByIndex(index)`
  - `hoverOnContextMenuShareItem()`
  - `isAddToLibraryIconPresent(name)`
  - `isAGDossierItemElementInViewport(dossierItemElem)`
  - `isAGGridColumnSelectHidden()`
  - `isAGGridSideBtnPresent(buttonLabel)`
  - `isAGGridTitlePresent(title)`
  - `isBotCoverGreyedOut(name)`
  - `isBotEmbedIconPresent(name)`
  - `isCertifiedPresent(name)`
  - `isCreateSnapshotPresentInContextMenu()`
  - `isDateColumnSorted(sortOrder)`
  - `isDossierDownloadIconPresent(name)`
  - `isDossierEditIconPresent(name)`
  - `isDossierInfoIconPresent(name)`
  - `isDossierPresent(name)`
  - `isDossierResetIconPresent(name)`
  - `isDossierShareIconPresent(name)`
  - `isEmbeddedBotButtonPresent(name)`
  - `isEmbeddedBotIconPresentInSideContainer()`
  - `isExporttoCSVPresent()`
  - `isExporttoExcelPresent()`
  - `isExportToPDFIconPresent(name)`
  - `isExporttoPDFPresent()`
  - `isFavoritesIconSelected(name)`
  - `isNameColumnSorted(sortOrder)`
  - `isOwnerColumnSorted(sortOrder)`
  - `isRunAsExcelIconPresent(name)`
  - `isRunAsPDFIconPresent(name)`
  - `isShareIconPresentInSideContainer()`
  - `isShortcutPresent(name)`
  - `isSortBarColumnActive(columnLabel)`
  - `isSortBarColumnAscending(columnLabel)`
  - `isSortBarColumnElementPresent(columnLabel)`
  - `isSortBarPresent()`
  - `isToolPanelHidden()`
  - `lastDossierName()`
  - `loadUntilRenderedAGGrid({ name, count = 0, attempt = 1 })`
  - `moveDossierIntoViewPortAGGrid(name, scrollToTop = false)`
  - `removeColumnByByTickCheckbox(posIndex)`
  - `removeColumnByNameList(nameList)`
  - `removeFavoriteByImageIcon(name)`
  - `renameDossierInGrid(newName)`
  - `renderNextBlockAGGrid(count)`
  - `rightClickToOpenContextMenuByIndex(index)`
  - `scrollToBottomAGGrid()`
- **Related components:** getAGGridContainer, getDossiersListViewContainer, getEmbeddedBotIconInSideContainer, getItemInColumnsPanel, getShareIconInSideContainer, getSideColumnsPanel, getSideContainer, libraryPage

### ManageLibrary
- **CSS root:** `.mstrd-Button.mstrd-Button--primary`
- **User-visible elements:**
  - Close Button (`.mstrd-Button.mstrd-Button--primary`)
  - Delete Dossier Dialog (`.mstrd-ConfirmationDialog`)
  - Remove Button (`.delete-button`)
  - Remove Spinner (`.mstrd-ConfirmationDialog-spinner`)
- **Component actions:**
  - `cancelRemoval()`
  - `cancelRename(name)`
  - `clearAll()`
  - `closeManageMyLibrary()`
  - `confirmRemoval()`
  - `deselectItem(name)`
  - `editName({ option, name, newName })`
  - `hitRemoveButton()`
  - `hoverDossier(name)`
  - `isClearAllEnabled()`
  - `isEditNameIconClickable(name)`
  - `isItemSelected(name)`
  - `isRemoveButtonEnabled()`
  - `isSelectAllEnabled()`
  - `isSelectItemIconClickable(name)`
  - `selectAll()`
  - `selectedItemCount()`
  - `selectItem(name)`
- **Related components:** getTooltipContainer

### MissingNuggetsDialog
- **CSS root:** `.ant-modal .mstrd-NuggetsNotificationDialog-main`
- **User-visible elements:**
  - Nuggets Notification Dialog (`.ant-modal .mstrd-NuggetsNotificationDialog-main`)
- **Component actions:**
  - `clickCancelButtonOnNuggetsMissingDialog()`
  - `clickReuploadButtonOnNuggetsMissingDialog()`
- **Related components:** _none_

### OnBoarding
- **CSS root:** `.slick-slide.slick-active.slick-current`
- **User-visible elements:**
  - Carousel (`.slick-slide.slick-active.slick-current`)
  - Continue Tour (`.mstrd-OnboardingCarousel-Button--continue`)
  - Intro To Library Got It (`.mstrd-OnboardingCarousel-Button--got`)
  - Move To Left Item (`.slick-arrow.slick-prev`)
  - Move To Right Item (`.slick-arrow.slick-next`)
- **Component actions:**
  - `clickContinueTour()`
  - `clickDock(text)`
  - `clickDossierOnboardingButton(area, option)`
  - `clickIntroToLibraryGotIt()`
  - `clickIntroToLibrarySkip()`
  - `clickLibraryOnboardingButton(area, option)`
  - `clickMoveLeftItem()`
  - `clickMoveRightItem()`
  - `clickSkipButton()`
  - `getDossierViewOnboardingTitleText(area)`
  - `getIntroductionToLibraryTitleText()`
  - `hasLibraryIntroduction()`
  - `hasSkipButton()`
  - `isDossierOnboardingAreaPresent(area)`
  - `isLibraryIntroduction2Present()`
  - `isLibraryIntroduction3Present()`
  - `isLibraryIntroductionPresent()`
  - `isLibraryOnboardingAreaPresent(area)`
  - `skip()`
  - `waitForDossierAreaPresent(area)`
  - `waitForLibraryAreaPresent(area)`
  - `waitForToCOnboardingAreaPresent()`
- **Related components:** _none_

### PendoGuide
- **CSS root:** `._pendo-step-container-styles`
- **User-visible elements:**
  - Close Button (`._pendo-close-guide`)
  - Dossier Pendo Container (`._pendo-step-container-size`)
  - Library Icon For Saas (`.mstr-nav-icon.app-theme-webLogo.container`)
  - Library Pendo Container (`._pendo-step-container-styles`)
- **Component actions:**
  - `clickPendoButton(text)`
  - `clickPendoLinkButton(text)`
  - `closePendoGuide()`
  - `closeSidebar()`
  - `getDossierPendoContainerText(index)`
  - `getLibraryPendoContainerTitleText()`
  - `goToLibrary()`
  - `isDossierPendoContainerPresent()`
  - `isLibraryPendoContainerPresent()`
  - `openSidebar()`
  - `waitForPendoGuide()`
- **Related components:** getDossierPendoContainer, getLibraryPendoContainer

### Search
- **CSS root:** `.mstrd-SearchNavItemContainer-container .mstrd-SearchBox`
- **User-visible elements:**
  - Clear Icon (`.icon-clearsearch`)
  - Dossier Filter Option (`.mstrd-SearchFilter-option.icon-dossier_rs`)
  - Filter Options Container (`.mstrd-SearchFilter`)
  - Quick Search View (`.mstrd-QuickSearchDropDownView`)
  - Search Container (`.mstrd-SearchNavItemContainer-container .mstrd-SearchBox`)
  - Search Icon (`.icon-search_tb_box`)
  - Search Suggestion (`.mstrd-SearchSuggestionTextView`)
- **Component actions:**
  - `clearInput()`
  - `clickDossierFilterOption()`
  - `clickSearchResultInfoIcon(title)`
  - `inputText(text)`
  - `inputTextAndOpenSearchPage(text)`
  - `inputTextAndSearch(text)`
  - `isSearchIconPresent()`
  - `openSearchSlider()`
- **Related components:** getSearchContainer

### SearchPage
- **CSS root:** `.mstrd-SearchResultsListContainer`
- **User-visible elements:**
  - Empty Result (`.mstrd-NoSearchResults-inner`)
  - Result List Container (`.mstrd-SearchResultsListContainer-content`)
  - Scrollable Container (`.mstrd-SearchResultsListContainer`)
- **Component actions:**
  - `attributeCount(title)`
  - `browseAllDossiers()`
  - `clearSearch()`
  - `closeInfoWindow()`
  - `executeGlobalResultItem(title)`
  - `executeResultItem(title)`
  - `goToLibrary()`
  - `hoverOnObject({ title, object, objectIndex = 0 })`
  - `isCustomImageDisplayed(title)`
  - `isDossierImageDisplayed(title)`
  - `isFilterOptionSelected(option)`
  - `isInfoIconDisplayed(title)`
  - `isInfoIconFocused(title)`
  - `isInfoWindowOpen()`
  - `isItemCertified(title)`
  - `isItemDisplayed(title)`
  - `isResultEmpty()`
  - `isRSDImageDisplayed(title)`
  - `isTimestampDisplayed(title)`
  - `matchCount(option)`
  - `metricCount(title)`
  - `objectNameInResultItem({ title, object, objectIndex = 0 })`
  - `openGlobalResultInfoWindow(title)`
  - `openInfoWindow(title)`
  - `scrollToBottom()`
  - `search(text)`
  - `searchString()`
  - `sortOption()`
  - `switchSortOrder()`
  - `switchToOption(option)`
  - `visualizationCount(title)`
- **Related components:** dossierPage, getPage, getResultListContainer, getScrollableContainer, getTooltipContainer

### SecurityFilter
- **CSS root:** `.data-model-security-filter-modal`
- **User-visible elements:**
  - New Security Dialog (`.mstr-security-filter-dialog`)
  - Security Filter Container (`.data-model-security-filter-modal`)
- **Component actions:**
  - `cancelNewQualification()`
  - `cancelNewSecurity()`
  - `cancelSecurityFilterDialog()`
  - `clickNewIcon()`
  - `clickNewQualificaiton()`
  - `closeDialogue()`
  - `isNewQualificationEditorPresent()`
  - `isNewSecurityDialogPresent()`
  - `isSecurityFilterDialogPresent()`
  - `saveNewSecurity()`
  - `saveSecurityFilterDialog()`
  - `waitForSecurityFilterLoading()`
- **Related components:** getSecurityFilterContainer

## Common Workflows (from spec.ts)

1. Test for forecast line chart (used in 10 specs)
2. Test for trend line chart (used in 10 specs)
3. Export - Export a Dossier to PDF (used in 7 specs)
4. [TC98366] E2E | Library | Run sanity tests for KPIs, Bar, Line Chart and Pie Chart in different environments (used in 4 specs)
5. [TC98367] E2E | Library | Run sanity tests for Maps, More in different environments (used in 4 specs)
6. [TC98368] E2E | Library | Run sanity tests for Insight Visualizations in different environments (used in 4 specs)
7. Automation for Subscription - Create and Manage Subscription in Library (used in 3 specs)
8. Library Visualization Sanity (used in 3 specs)
9. LibraryExportToPDF - Check Default Settings (used in 3 specs)
10. [F43676_1] FUN | Auto Summary Format & Refresh (used in 2 specs)
11. [F43676_2] FUN | Show/Not show Auto Summary in Library consumption & Refresh (used in 2 specs)
12. [F43676_3] Auto Summary Application control to hide Auto Summary (used in 2 specs)
13. [F43676_4] ACC | Auto Summary Main Workflow (used in 2 specs)
14. [SM_Reg2_00] Reg | Skip Calculation for AG Grid (used in 2 specs)
15. [SM_Reg2_01] Reg | Require Calculation for AG Grid (used in 2 specs)
16. [TC77677] [Tanzu] Export dossier to PDF from entry Info Window (used in 2 specs)
17. [TC77678] [Tanzu] Export dossier to PDF from entry Share Panel (used in 2 specs)
18. [TC77680] [Tanzu] Export dossier to Excel from entry Share Panel (used in 2 specs)
19. [TC77681] [Tanzu] Export to Excel - Check grid can be export to excel from visualization (used in 2 specs)
20. [TC78192] [Tanzu] Export dossier to Excel from entry Info Window (used in 2 specs)
21. [TC82727] [Tanzu] Export OOTB dossier to PDF (used in 2 specs)
22. [TC90029] Exporting RSD to PDF from info window (used in 2 specs)
23. [TC90030] Exporting RSD to PDF from share panel (used in 2 specs)
24. [TC90031] Exporting RSD to Excel from info window (used in 2 specs)
25. [TC90032] Exporting RSD to Excel from share panel (used in 2 specs)
26. [TC90183] ACC | Verify the viz gallery, editor panel and viz display in different status for Key Driver visualization in front-end (used in 2 specs)
27. [TC93604_1] E2E | Verify custom visualizations with HTML elements (used in 2 specs)
28. [TC93604_2] E2E | Verify custom visualizations with HTML elements (used in 2 specs)
29. [TC94279] ACC | Verify the viz format for Key Driver visualization in dossier authoring (used in 2 specs)
30. [TC94357] E2E | Library | Verify KeyDriver basic static rendering in locked mode in Library authoring. (used in 2 specs)
31. [TC94357] E2E | Library | Verify KeyDriver basic static rendering in locked mode in Library consumption. (used in 2 specs)
32. [TC94424] ACC | Verify the Key Driver visualization in dossier auto dashboard (used in 2 specs)
33. [TC94496] ACC | Verify the Key Driver visualization in dossier auto dashboard (used in 2 specs)
34. [TC94590] i18N | Verify the i18N case for Key Driver visualization in dashboard. (used in 2 specs)
35. [TC96061_2] E2E [Library Web] E2E test for PDM case in Library. (used in 2 specs)
36. [TC96061_3] Automation for DE302498. (used in 2 specs)
37. [TC96061] E2E [Library Web] E2E test for Auto Narratives Viz in Library. (used in 2 specs)
38. [TC96065_1] ACC [Library Web] Copy NLG to text box (used in 2 specs)
39. [TC96065_2] ACC [Library Web] Check Editor panel in dashboard library. (used in 2 specs)
40. [TC96065_3] ACC [Library Web] Trigger refresh in dashboard library. (used in 2 specs)
41. [TC96065_4] ACC [Library Web] Trigger auto refresh in dashboard library. (used in 2 specs)
42. [TC96065_5] ACC [Library Web] Data cut message (used in 2 specs)
43. [TC96067_1] NLG_Calculation_ABA | Chapter 1 | Min (used in 2 specs)
44. [TC96067_10] NLG_Calculation_ABA2 | Chapter 10 | Count and Distinct Dount (used in 2 specs)
45. [TC96067_11] NLG_Calculation_ABA2 | Chapter 11 | Mode (used in 2 specs)
46. [TC96067_12] NLG_Calculation_ABA2 | Chapter 12 | Production (used in 2 specs)
47. [TC96067_13] NLG_Calculation_ABA2 | Chapter 13 | Geo Mean (used in 2 specs)
48. [TC96067_2] NLG_Calculation_ABA | Chapter 2 | Max (used in 2 specs)
49. [TC96067_3] NLG_Calculation_ABA | Chapter 3 | Mean (used in 2 specs)
50. [TC96067_4] NLG_Calculation_ABA | Chapter 4 | Sum (used in 2 specs)
51. [TC96067_5] NLG_Calculation_ABA | Chapter 5 | First (used in 2 specs)
52. [TC96067_6] NLG_Calculation_ABA | Chapter 6 | Last (used in 2 specs)
53. [TC96067_7] NLG_Calculation_ABA2 | Chapter 7 | Median (used in 2 specs)
54. [TC96067_8] NLG_Calculation_ABA2 | Chapter 8 | Standard (used in 2 specs)
55. [TC96067_9] NLG_Calculation_ABA2 | Chapter 9 | Variance (used in 2 specs)
56. [TC96070_2] ACC [Library Web] Cross functions. (used in 2 specs)
57. [TC96070] ACC [Library Web] Check Format panel in dashboard library. (used in 2 specs)
58. [TC96071] FUN [Library Web] Check error handling in dashboard library. (used in 2 specs)
59. [TC97089_1] NLG_AdvancedML_ABA | Chapter 1 | Trend (used in 2 specs)
60. [TC97089_2] NLG_AdvancedML_ABA | Chapter 1 | Forecast (used in 2 specs)
61. [TC97089_3] NLG_AdvancedML_ABA | Chapter 1 | KeyDriver (used in 2 specs)
62. [TC97090_1] NLG_Subtotal_ABA | Chapter 1 | Sum (used in 2 specs)
63. [TC97090_2] NLG_Subtotal_ABA | Chapter 2 | Average (used in 2 specs)
64. [TC97090_3] NLG_Subtotal_ABA | Chapter 3 | Average (used in 2 specs)
65. [TC97090_4] NLG_Subtotal_ABA | Chapter 4 | Median (used in 2 specs)
66. [TC97090_5] NLG_Subtotal_ABA | Chapter 5 | Production (used in 2 specs)
67. [TC97090_6] NLG_Subtotal_ABA | Chapter 6 | Standard Deviation (used in 2 specs)
68. [TC97090_7] NLG_Subtotal_ABA | Chapter 7 | Variance (used in 2 specs)
69. [TC97092_1] NLG_FilterByValue_Metric | Chapter 1 | FilterByValue_Metric (used in 2 specs)
70. [TC97092_2] NLG_FilterByValue_Att | Chapter 1 | FilterByValue_Att (used in 2 specs)
71. [TC97092_3] NLG_FilterByRank | Chapter 1 | FilterByRank (used in 2 specs)
72. [TC97092_4] NLG_FilterByRank% | Chapter 1 | FilterByRank% (used in 2 specs)
73. [TC97167_1] i18N [Library Web] Check i18n string in dashboard library. (used in 2 specs)
74. [TC97167_2] i18N [Library Web] Check refresh. (used in 2 specs)
75. [TC97167_3] ACC [Library Web] Data cut message (used in 2 specs)
76. [TC98433] Verify the ForcastLineChart visualization in dossier auto dashboard (used in 2 specs)
77. [TC98434] Forcast Line Chart Check editor panel in dashboard library. (used in 2 specs)
78. [TC98435_01] ForcastLineChart Check Format panel in dashboard library 1. (used in 2 specs)
79. [TC98435_02] ForcastLineChart Check Format panel in dashboard library 2. (used in 2 specs)
80. [TC98435_03] ForcastLineChart Check Format panel in dashboard library 3. (used in 2 specs)
81. [TC98435_04] ForcastLineChart Format panel text and forms 1. (used in 2 specs)
82. [TC98435_05] ForcastLineChart Format panel text and forms 2. (used in 2 specs)
83. [TC98435_06] ForcastLineChart Format panel text and forms 3.1 (used in 2 specs)
84. [TC98435_07] ForcastLineChart Format panel text and forms 3.2 (used in 2 specs)
85. [TC98435_08] ForcastLineChart Format panel text and forms 3.3 (used in 2 specs)
86. [TC98435_09] ForcastLineChart Format panel text and forms 3.4 (used in 2 specs)
87. [TC98435_10] ForcastLineChart Format panel text and forms 4.1 (used in 2 specs)
88. [TC98435_11] ForcastLineChart Format panel text and forms 4.2 (used in 2 specs)
89. [TC98436_01] ForcastLineChart XFunctions 1 (used in 2 specs)
90. [TC98436_06] ForcastLineChart XFunctions 3 (used in 2 specs)
91. [TC98436_07] ForcastLineChart XFunctions 4.1 (used in 2 specs)
92. [TC98436_08] ForcastLineChart XFunctions 4.2 (used in 2 specs)
93. [TC98437_01] ForcastLineChart Check i18n in dashboard library 1. (used in 2 specs)
94. [TC98437_02] ForcastLineChart Check i18n in dashboard library 2. (used in 2 specs)
95. [TC98437_03] ForcastLineChart Check i18n in dashboard library 3. (used in 2 specs)
96. [TC98438] Verify the TrendLineChart visualization in dossier auto dashboard (used in 2 specs)
97. [TC98439] Trend Line Chart Check editor panel in dashboard library. (used in 2 specs)
98. [TC98440_01] TrendLineChart Check Format panel in dashboard library 1. (used in 2 specs)
99. [TC98440_02] TrendLineChart Check Format panel in dashboard library 2. (used in 2 specs)
100. [TC98440_03] TrendLineChart Check Format panel in dashboard library 3. (used in 2 specs)
101. [TC98440_04] TrendLineChart Format panel text and forms 1. (used in 2 specs)
102. [TC98440_05] TrendLineChart Format panel text and forms 2. (used in 2 specs)
103. [TC98440_06] TrendLineChart Format panel text and forms 3.1 (used in 2 specs)
104. [TC98440_07] TrendLineChart Format panel text and forms 3.2 (used in 2 specs)
105. [TC98440_08] TrendLineChart Format panel text and forms 3.3 (used in 2 specs)
106. [TC98440_09] TrendLineChart Format panel text and forms 3.4 (used in 2 specs)
107. [TC98440_10] TrendLineChart Format panel text and forms 4.1 (used in 2 specs)
108. [TC98440_11] TrendLineChart Format panel text and forms 4.2 (used in 2 specs)
109. [TC98441_01] TrendLineChart XFunctions 1 (used in 2 specs)
110. [TC98441_02] TrendLineChart XFunctions 2.1 (used in 2 specs)
111. [TC98441_06] TrendLineChart XFunctions 3 (used in 2 specs)
112. [TC98441_07] TrendLineChart XFunctions 4.1 (used in 2 specs)
113. [TC98441_08] TrendLineChart XFunctions 4.2 (used in 2 specs)
114. [TC98442_01] TrendLineChart Check i18n in dashboard library 1. (used in 2 specs)
115. [TC98442_02] TrendLineChart Check i18n in dashboard library 2. (used in 2 specs)
116. [TC98442_03] TrendLineChart Check i18n in dashboard library 3. (used in 2 specs)
117. [TC98568_1] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Custom1000*1000_FitToView (used in 2 specs)
118. [TC98568_2] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Screen16_9_FillTheView (used in 2 specs)
119. [TC98568_3] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_WideScreen_Zoom100 (used in 2 specs)
120. [TC98568_4] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Screen4_3_FitToView | Consumption (used in 2 specs)
121. [TC98569_1] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Custom1000*1000_FitToView | Authoring (used in 2 specs)
122. [TC98569_2] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Fill the view | Authoring (used in 2 specs)
123. [TC98569_3] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Zoom100 | Authoring (used in 2 specs)
124. [TC98569_4] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Screen4_3_FitToView | Authoring (used in 2 specs)
125. AutoNarratives_ACC (used in 2 specs)
126. AutoNarratives_E2E (used in 2 specs)
127. AutoNarratives_Errorhandling (used in 2 specs)
128. AutoNarratives_FUN (used in 2 specs)
129. AutoNarratives_i18n (used in 2 specs)
130. AutoNarratives_ML_Advanced (used in 2 specs)
131. AutoNarratives_ML_Basic (used in 2 specs)
132. AutoNarratives_ML_Filter (used in 2 specs)
133. AutoNarratives_ML_Subtotal (used in 2 specs)
134. AutoNarratives_SmartMetrics_FunOff (used in 2 specs)
135. AutoNarratives_SmartMetrics_FunOn (used in 2 specs)
136. AutoNarratives_SmartMetrics_Reg2 (used in 2 specs)
137. AutoNarratives_SmartMetrics_Regression (used in 2 specs)
138. AutoSummary_ACC (used in 2 specs)
139. AutoSummary_FUN (used in 2 specs)
140. CustomVizHTMLSanity (used in 2 specs)
141. Export - Export Dashboard to PDF (used in 2 specs)
142. ExportToPDF - Tanzu Sanity Test (used in 2 specs)
143. KeyDriverAutoAnswers (used in 2 specs)
144. KeyDriverAutoDashboard (used in 2 specs)
145. KeyDriverDashboardTest (used in 2 specs)
146. KeyDriverLockedPageTest (used in 2 specs)
147. Library Authoring - Manipulations related to PDF export (used in 2 specs)
148. library Viz Sanity SaaS (used in 2 specs)
149. LibraryExport - Export Dashboard to Excel_CheckExportSettings (used in 2 specs)
150. LibrarySubscription - Check subscription privilege in Library (used in 2 specs)
151. NLG_SmartMetricsACC_ComponentOff (used in 2 specs)
152. NLG_SmartMetricsACC_ComponentOn (used in 2 specs)
153. ResponsiveDashboard_InsightViz (used in 2 specs)
154. ResponsiveDashboard_InsightViz_Consume (used in 2 specs)
155. [BCVE-4222] Check three dot menu button for visualization with hidden title (used in 1 specs)
156. [BCVE-4989_01] Export prompted dashboard to Google Sheets from info window after answering prompt (used in 1 specs)
157. [BCVE-4989_02] Export prompted report to Google Sheets from info window after answering prompt (used in 1 specs)
158. [BCVE-4989_03] Verify Google Sheets export is not available in NoExportOptions application (used in 1 specs)
159. [BCVE-5242_01] Create Dashboard FTP subscription from share panel (used in 1 specs)
160. [BCVE-5242_02] Manage Dashboard FTP subscription from info window (used in 1 specs)
161. [BCVE-5242_03] Manage Dashboard FTP subscription from sidebar (used in 1 specs)
162. [BCVE-5242_04] Manage Report FTP subscription from sidebar (used in 1 specs)
163. [BCVE-5242_05] Check create sub-folder function for user without privilege (used in 1 specs)
164. [BCVE-5272_01] In pause mode, check PDF export options: Dashboard Properties -> Advanced Mode (used in 1 specs)
165. [BCVE-5272_02] Remove dataset, check PDF export options: Dashboard Properties -> Advanced Mode (used in 1 specs)
166. [BCVE-5498_InfoWindow] Export entire dashboard to Google Sheets from info window (used in 1 specs)
167. [BCVE-5498_ListView] Export entire dashboard to Google Sheets from list view (used in 1 specs)
168. [BCVE-5498_SharePanel] Export dashboard with selected chapter to Google Sheets from share panel (used in 1 specs)
169. [BCVE-5498_VizMenu] Export grid to Google Sheets from visualization menu (used in 1 specs)
170. [Demo_1] Check end to end work flow of exporting dashboard to Excel (used in 1 specs)
171. [F38421_1] Export Report_PageBy to CSV from Info Window (used in 1 specs)
172. [F38421_2] Modify export option and export Report_PageBy to CSV from Share Panel (used in 1 specs)
173. [F38421_3] Modify export option and export Report_NoPageBy to CSV from Share Panel (used in 1 specs)
174. [F38421_4] Export Report_NoPageBy to CSV from List View Info Window (used in 1 specs)
175. [F38421_5] Export Report_PageBy to CSV from Context Menu in List View (used in 1 specs)
176. [F41877] Export visualization to CSV from title bar export button (used in 1 specs)
177. [F41877] Export visualization to Excel from title bar export button (used in 1 specs)
178. [F41877] Export visualization to PDF from title bar export button (used in 1 specs)
179. [F42327_ManipulationsubscriptiontoCSV] Modify report_Pageby subscription to CSV (used in 1 specs)
180. [F42327_ManipulationsubscriptiontoExcel] Modify report_Pageby subscription to Excel (used in 1 specs)
181. [F42327_Reportpagebysubscription] Check GUI of report_Pageby subscription to Excel/CSV/PDF (used in 1 specs)
182. [F42327_Reportsubscription] Check GUI of report subscription to Excel/CSV/PDF (used in 1 specs)
183. [F42962_AddAddress] Add personal address (used in 1 specs)
184. [F43008_1] Set Available Formats in Authoring (used in 1 specs)
185. [F43008_2] Check Available Formats from Entry of Info Window (used in 1 specs)
186. [F43008_3] Check Available Formats from Entries inside Dashboard for dossier_Auto_Format_AllowExcel (used in 1 specs)
187. [F43008_4] Check Available Formats from Entry of Context Menu in List View (used in 1 specs)
188. [F43008_5] Check available formats for subscription when creating from share panel (used in 1 specs)
189. [F43008_6] Check available formats for subscription when editing in info window an sidebar (used in 1 specs)
190. [F43156_01] Create Excel subscription from share panel (used in 1 specs)
191. [F43156_02] Manage subscription from info window (used in 1 specs)
192. [F43156_03] Manage subscription from sidebar (used in 1 specs)
193. [F43156_04] Check subscription filter in sidebar (used in 1 specs)
194. [F43156_11] Manage Email subscription for Report from info window (used in 1 specs)
195. [F43156_12] Manage Email subscription for RSD from info window (used in 1 specs)
196. [F43156_13] Manage Email subscription for Report from sidebar (used in 1 specs)
197. [F43156_14] Manage Email subscription for RSD from sidebar (used in 1 specs)
198. [F43156_15] Check multi-content subscription from sidebar (used in 1 specs)
199. [F43156_3] Manage subscription from sidebar (used in 1 specs)
200. [F43156_DashboardWithPrompt] Check prompt for dashboard subscription in Library (used in 1 specs)
201. [F43156_fullPrivilege] Check privileges for subscription in Library (used in 1 specs)
202. [F43156_noPrivilege] Check privileges for subscription in Library (used in 1 specs)
203. [F43156_Privilege1] Check privileges for subscription in Library (used in 1 specs)
204. [F43156_Privilege2] Check privileges for subscription in Library (used in 1 specs)
205. [F43156_ReportWithPrompt] Check prompt for report subscription in Library (used in 1 specs)
206. [F43156_RSDWithPrompt] Check prompt for document subscription in Library (used in 1 specs)
207. [F43170_01] Check PDF export options: Dashboard Properties -> Advanced Mode (used in 1 specs)
208. [F43170_02] Check PDF export options: Advanced Mode -> Dashboard Properties (used in 1 specs)
209. [F43170_03] Format Header & Footer in PDF export options: Advanced Mode -> Dashboard Properties (used in 1 specs)
210. [F43272_1] Set default Excel export setting in dashboard properties (used in 1 specs)
211. [F43272_2] Check configured Excel export setting from Info Window (used in 1 specs)
212. [F43272_3] Check configured Excel export setting, modify and export from Share Panel (used in 1 specs)
213. [F43272_4] Do manipulations and check Excel export settings from Share Panel (used in 1 specs)
214. [F6494_1] Set Customized PDF Header and Footer in Library Authoring (used in 1 specs)
215. [F6494_2] Check Locked PDF Header and Footer in Library Consumption from Info Window (used in 1 specs)
216. [F6494_3] Check Locked PDF Header and Footer in Library Consumption from Share Panel (used in 1 specs)
217. [F6494_4] Check Locked PDF Header and Footer in Library Consumption from Visualization (used in 1 specs)
218. [TC0001] Configure PDF export settings in Library Authoring (used in 1 specs)
219. [TC0002] Check and modify PDF export settings from Share Dialog (used in 1 specs)
220. [TC0003] Check and modify PDF export settings from Info Window (used in 1 specs)
221. [TC0004] Check and modify PDF export settings from Subscription Dialog (used in 1 specs)
222. [TC20535] Dossier name got inappropriately truncated in Info Window (used in 1 specs)
223. [TC20650] Export to PDF - Verify Export Document from title bar of grid and graph in Library Web (used in 1 specs)
224. [TC20889] Export to PDF - Verify Export RSD to PDF with Watermark in Library (used in 1 specs)
225. [TC23592] Dossier | Verify Info Window Functionalities in Library Page (used in 1 specs)
226. [TC23913] Verify E2E test of Recommendation in Library Main Page (used in 1 specs)
227. [TC31788_exportAll] Check Privileges for Exporting in All Formats in Library (used in 1 specs)
228. [TC31788_exportExcel] Check Privileges for Exporting Excel in Library (used in 1 specs)
229. [TC31788_exportGoogleSheets] Check Privileges for Exporting Google Sheets in Library (used in 1 specs)
230. [TC31788_exportPDF] Check Privileges for Exporting PDF in Library (used in 1 specs)
231. [TC31788_exportText] Check Privileges for Exporting Text in Library (used in 1 specs)
232. [TC31788_NoExportPrivilege] Check Privileges for NoExportPrivilege user in Library (used in 1 specs)
233. [TC56136_RSD_exportAll] Check Privileges for RSD Exporting in Library (used in 1 specs)
234. [TC56136_RSD_exportExcel] Check Privileges for RSD Exporting in Library (used in 1 specs)
235. [TC56136_RSD_exportPDF] Check Privileges for RSD Exporting in Library (used in 1 specs)
236. [TC56136_RSD_NoExportPrivilege] Check Privileges for RSD Exporting in Library (used in 1 specs)
237. [TC56909] Export to PDF - Check for Export icon enabled and show tooltip (used in 1 specs)
238. [TC56910] Export to PDF - Check fo GUI of Export panel and cancel exporting (used in 1 specs)
239. [TC56911] Export to PDF - Check for default export settings and directly export (used in 1 specs)
240. [TC56912] Export to PDF - Modify settings to check controllers functionality, and then export (used in 1 specs)
241. [TC56914] Export to PDF - Check for GUI of Export panel, cancel, and export with default settings (used in 1 specs)
242. [TC56916] Export to PDF - Check default settings, cancel, and export from visualization (Grid) (used in 1 specs)
243. [TC56917] Export to PDF - Modify settings to check controllers functionality, and export from visualization (Grid) (used in 1 specs)
244. [TC56918] Export to PDF - Check default settings and export from visualization with customized settings (not Grid) (used in 1 specs)
245. [TC58022] Initial onboarding tutorial in library and dossier page (used in 1 specs)
246. [TC58024] Initial onboarding tutorial in rsd page (used in 1 specs)
247. [TC58025] Initial onboarding tutorial in dossier with prompt page (used in 1 specs)
248. [TC58027] Use Left/Right arrow to swipe page and check Skip in library introduction (used in 1 specs)
249. [TC58028] Use three docks to swipe page and click Show Tutorial in library page (used in 1 specs)
250. [TC58030] Check Skip of the Explore Your Library panel (used in 1 specs)
251. [TC58032] Click Skip | Show Tutorial in dossier page (used in 1 specs)
252. [TC58033] Onboarding tutorial in library/dossier page when shown with mobile (used in 1 specs)
253. [TC58034] Onboarding tutorial with empty library (used in 1 specs)
254. [TC58930] Export to PDF - Verify Export RSD from info Window (used in 1 specs)
255. [TC58931] Export to PDF - Verify Export RSD from dossier (used in 1 specs)
256. [TC61449] Export to PDF - the selector of exporting pdf range in RSD cannot draw back after clicking at the blank space or itself (used in 1 specs)
257. [TC61649] Export to Excel - Verify export grid to Excel from end to end (used in 1 specs)
258. [TC61650] Export to Excel - Empty grid can export as Excel (used in 1 specs)
259. [TC61651] Export to Excel - One grid page should export directly (used in 1 specs)
260. [TC61652] Export to Excel - Check Compound grid can be export to excel (used in 1 specs)
261. [TC61654] Export to Excel - Check long grid name can display well in Grid list (used in 1 specs)
262. [TC61656] Export to Excel - Check grid can be export to excel from visualization (used in 1 specs)
263. [TC61657] Export to Excel - Verify the responsiveness of export grid to excel (used in 1 specs)
264. [TC63338] Validation of DE163594: [Library][Export Dialog] Inconsistent string between the selected one and string in list in Info Window of Library (used in 1 specs)
265. [TC65772] Export to Excel - Verify export grid to Excel from end to end (used in 1 specs)
266. [TC71400] Export to PDF - Verify Export with Grid Expanding and TOC enabled from Info Window by click. (used in 1 specs)
267. [TC71403] Export to PDF - Verify Export with Grid Expanding and TOC enabled from Export Dialog by click. (used in 1 specs)
268. [TC73976] Dossier | Verify Library management end-to-end workflow (used in 1 specs)
269. [TC73977] Dossier | Verify Sort Dossier Items in Library Page (used in 1 specs)
270. [TC73978] Dossier | Verify Filter Dossier Items in Library Page (used in 1 specs)
271. [TC74132] Export grid in panel stack to Excel from Library (used in 1 specs)
272. [TC74160] Validating skip of the sidebar tutorial in Library Web (used in 1 specs)
273. [TC74196] Validating onboarding tutorial for empty dossier items in group in Library Web (used in 1 specs)
274. [TC74197] Validating onboarding tutorial while sidebar is opening in Library Web (used in 1 specs)
275. [TC74198] Validating onboarding tutorial for search page in Library Web (used in 1 specs)
276. [TC75549] Export to PDF - Export grid to PDF from entry Show Data. (used in 1 specs)
277. [TC76451_InfoWindow] Export entire dossier to Excel in Library (used in 1 specs)
278. [TC76451_SharePanel] Export entire dossier to Excel in Library (used in 1 specs)
279. [TC76458_fullPrivilege] Check privileges for subscription in Library (used in 1 specs)
280. [TC76458_noPrivilege] Check privileges for subscription in Library (used in 1 specs)
281. [TC76458_Privilege1] Check privileges for subscription in Library (used in 1 specs)
282. [TC76458_Privilege2] Check privileges for subscription in Library (used in 1 specs)
283. [TC77679] [Tanzu] Export dossier to PDF from entry Viz Menu (used in 1 specs)
284. [TC79674] Create PDF subscription from share panel (used in 1 specs)
285. [TC79675] Manage PDF subscription from info window (used in 1 specs)
286. [TC79676] Manage PDF subscription from sidebar (used in 1 specs)
287. [TC79872] Create subscription for other recipients (used in 1 specs)
288. [TC79891] Check subscriptions for recipients in entry of info window (used in 1 specs)
289. [TC79892] Check subscriptions for recipients in entry of sidebar (used in 1 specs)
290. [TC82125] PerBuild - Subscription - Create subscription in entry Share Panel (used in 1 specs)
291. [TC82126] PerBuild - Subscription - Edit subscription in entry Info Window (used in 1 specs)
292. [TC82127] PerBuild - Subscription - Manage subscription in entry Sidebar (used in 1 specs)
293. [TC82679] Check PDF smart default settings after linking to other page (used in 1 specs)
294. [TC83617] Verify UI in Library Main Page (used in 1 specs)
295. [TC83699] Verify user with long name displays as expected in Library Main Page (used in 1 specs)
296. [TC84217_01] Verify Library homepage displays as expected from different entrance - open from dossier page (used in 1 specs)
297. [TC84217_02] Verify Library homepage displays as expected from different entrance - open from dossierAuthoring page (used in 1 specs)
298. [TC85172] Export to PDF - Export visualization key driver to PDF. (used in 1 specs)
299. [TC87864] Dossier | Verify certify icon in Library Page (used in 1 specs)
300. [TC88548] Certification information in Info Window not update when decertify/certify dossier again (used in 1 specs)
301. [TC92806] E2E | Library | Verify basic static rendering for all visualizations. (used in 1 specs)
302. [TC93376] Acceptance | Library | Verify the display of Graph tooltips with granular HTML control. (used in 1 specs)
303. [TC93946_1] Check Excel export setting from Info Window (used in 1 specs)
304. [TC93946_2] Check Excel export setting from Share Menu_Auto_GridsGraphs (used in 1 specs)
305. [TC93946_3] Check Excel export setting from Share Menu_Auto_NonVizOnly (used in 1 specs)
306. [TC93946_4] Check Excel export setting from Share Menu_Auto_Freeform (used in 1 specs)
307. [TC93946_5] Check Excel export setting from Share Menu_Auto_Mix (used in 1 specs)
308. [TC93946_8] Switch dashboard page and check Excel export setting from Share Menu (used in 1 specs)
309. [TC93946_9] Check Excel Export Settings from Share Panel in Mobile View (used in 1 specs)
310. [TC94328_1] Check PDF export setting from Share Menu_Auto_GridsGraphs (used in 1 specs)
311. [TC94328_2] Check PDF export setting from Share Menu_Auto_Freeform (used in 1 specs)
312. [TC94328_3] Check PDF export setting from Share Menu_Auto_NonVizOnly (used in 1 specs)
313. [TC94328_4] Check PDF export setting from Share Menu_Auto_SingleGrid (used in 1 specs)
314. [TC94328_5] Switch page and check PDF export setting from Share Menu_Auto_Export_3 (used in 1 specs)
315. [TC94328_6] Do manipulation and check PDF export setting from Share Menu_Auto_Mix (used in 1 specs)
316. [TC94328_7] Check PDF Export Settings from Share Panel in Mobile View (used in 1 specs)
317. [TC94908_1] Check Excel Subscription Settings from Share Panel (used in 1 specs)
318. [TC94908_2] Check Existing Excel Subscriptions from Info Window (used in 1 specs)
319. [TC94908_3] Edit Subscription in Info Window and Check from Sidebar (used in 1 specs)
320. [TC94908_5] Check Subscriptions from Share Panel in Mobile View (used in 1 specs)
321. [TC94946] Verify UI of account panel when closed with different methods (used in 1 specs)
322. [TC95175_0] Check PDF Export Settings stored in MD (used in 1 specs)
323. [TC95175_1] Set Default PDF Export Settings in Library Authoring (used in 1 specs)
324. [TC95175_10] Modify export settings and export to PDF in viz menu, share menu, and info window separately (not default) (used in 1 specs)
325. [TC95175_11] InfoWindow_Do manipulations and check export dialog (used in 1 specs)
326. [TC95175_12] SharePanel_Do manipulations and check export dialog (used in 1 specs)
327. [TC95175_13] VizMenu_Do manipulations and check export dialog (used in 1 specs)
328. [TC95175_2] InfoWindow_Check PDF Export Settings in Library Consumption (used in 1 specs)
329. [TC95175_3] Share_Check PDF Export Settings in Library Consumption (used in 1 specs)
330. [TC95175_4] VizMenu_Check PDF Export Settings in Library Consumption (used in 1 specs)
331. [TC95175_5] SearchWindow_Check Default PDF Export Settings in Library Consumption (used in 1 specs)
332. [TC95175_6] Export dossier with default settings from info window and share panel, and viz menu (used in 1 specs)
333. [TC95175_7] Modify export settings in info Window and export from share panel (default) (used in 1 specs)
334. [TC95175_8] Modify export settings in share panel and export from info window (default) (used in 1 specs)
335. [TC95175_9] Modify export settings and export to PDF in info window and share panel separately (not default) (used in 1 specs)
336. [TC96586] Verify Library Filter for different sections (used in 1 specs)
337. [TC96588_01] Verify Library Object Type icon for Library Home - web view (used in 1 specs)
338. [TC96588_02] Verify Library Object Type icon for Library Home - mobile view (used in 1 specs)
339. [TC96588_03] Verify Library Object Type icon for Library Home - disable object in custom app (used in 1 specs)
340. [TC96685] Validating onboarding tutorial when TOC/Bookmark/Filter/Collaboration is disabled or navigation bar/action icon is hidden (used in 1 specs)
341. [TC96787] Verify Reset/Remove from Library in context menu (used in 1 specs)
342. [TC96790] Validating initial onboarding tutorial in Report page in Library Web (used in 1 specs)
343. [TC97317] Change application, create and check new subscription (used in 1 specs)
344. [TC97618_1] Check Excel export settings of Report_PageBy for application exportReportDefault (used in 1 specs)
345. [TC97618_2] Check Excel export settings of Report_NoPageBy for application exportReportDefault (used in 1 specs)
346. [TC97618_3] Check Excel export settings of Report_PageBy for application exportReportCheckAll (used in 1 specs)
347. [TC97618_4] Check Excel export settings of Report_NoPageBy for application exportReportCheckAll (used in 1 specs)
348. [TC97618_5] Check Excel export settings of Report_PageBy with manipulations (used in 1 specs)
349. [TC97830_01] Verify Functionality for Project Alias - Grid View and List View (used in 1 specs)
350. [TC97830_02] Verify Functionality for Project Alias - library filter (used in 1 specs)
351. [TC97830_03] Verify Functionality for Project Alias - content discovery (used in 1 specs)
352. [TC97830_04] Verify Functionality for Project Alias - search page (used in 1 specs)
353. [TC97830_05] Verify Functionality for Project Alias - dashboard creation (used in 1 specs)
354. [TC97830_06] Verify Functionality for Project Alias - dashboard creation (used in 1 specs)
355. [TC98620_1] Check PDF export settings of Report_PageBy for application exportReportDefault (used in 1 specs)
356. [TC98620_2] Check PDF export settings of Report_NoPageBy for application exportReportDefault (used in 1 specs)
357. [TC98620_3] Check PDF export settings of Report_PageBy for application uncheckPageBy (used in 1 specs)
358. [TC98620_4] Check PDF export settings of Report_NoPageBy for application uncheckPageBy (used in 1 specs)
359. [TC98620_5] Check PDF export settings of Report_PageBy with manipulations (used in 1 specs)
360. [TC98741_1] Check Subscription Sort Function from Sidebar (used in 1 specs)
361. [TC98741_2] Check Subscription Filter Content from Sidebar (used in 1 specs)
362. [TC98741_3] Check Subscription Filter Type from Sidebar (used in 1 specs)
363. [TC98741_4] Resize Subscription Column from Sidebar (used in 1 specs)
364. [TC98741_5] Switch Application and Check Subscription Column from Sidebar (used in 1 specs)
365. [TC98932_1] Create subscription for groups (used in 1 specs)
366. [TC98932_2] Create subscription for groups and recipients (used in 1 specs)
367. [TC98932_3] Check status of empty group (used in 1 specs)
368. [TC98932_4] Check Recipients in DeliverTo after Manipulations (used in 1 specs)
369. [TC98981_1] Open Subscription Snapshot and Export to PDF from Share Menu (used in 1 specs)
370. [TC98981_2] Open Subscription Snapshot and Export to PDF from Visualization Menu (used in 1 specs)
371. [TC99102_1] Export dashboard to CSV from Info Window (used in 1 specs)
372. [TC99102_2] Switch page and check CSV export settings from Share Panel (used in 1 specs)
373. [TC99102_3] Modify range and export dashboard to CSV from Share Panel (used in 1 specs)
374. [TC99102_4] Check default range and export dashboard to CSV in Mobile View (used in 1 specs)
375. [TC99171_1] Set PDF Margin in Library Authoring (used in 1 specs)
376. [TC99171_2] Check saved PDF Margin in Library Consumption from Info Window (used in 1 specs)
377. [TC99171_3] Check saved PDF Margin and Update them in Library Consumption from Share Panel (used in 1 specs)
378. [TC99171_4] Select different paper sizes/orientations and check corresponding margin value (used in 1 specs)
379. [TC99171_5] Set valid and invalid margin value and check the frontend behavior (used in 1 specs)
380. [TC99551_01] Validate system Status On Library Web - Top (used in 1 specs)
381. [TC99551_02] Validate system Status On Library Web - Top and Bottom (used in 1 specs)
382. ABA - Automation for Subscription - Create and Manage Subscription in Library (used in 1 specs)
383. ABA Export Subscription Snapshot to PDF (used in 1 specs)
384. Automation for defects (used in 1 specs)
385. Automation for FTP Subscription - Create and Manage FTP Subscription in Library (used in 1 specs)
386. Automation for Subscription - Add Address in Library (used in 1 specs)
387. Automation for Subscription - Report Subscription in Library (used in 1 specs)
388. Export - Check Available Export Formats for Dashboards (used in 1 specs)
389. Export - Export Dashboard to CSV (used in 1 specs)
390. Export - Export Dashboard to Excel (used in 1 specs)
391. Export - Export dashboard to Google Sheets (used in 1 specs)
392. Export - Export Grids to Excel (used in 1 specs)
393. Export - Export prompted dashboard to Google Sheets (XFunction) (used in 1 specs)
394. Export - Export Report to CSV (used in 1 specs)
395. Export - Test privileges of export functions (used in 1 specs)
396. Library main page (used in 1 specs)
397. LibraryExport - Check Sort, Filter and Resize Functions for Subscription from Sidebar (used in 1 specs)
398. LibraryExport - Create and Manage Subscription in Library (used in 1 specs)
399. LibraryExport - Export Dashboard to PDF (used in 1 specs)
400. LibraryExport - Export Report to Excel (used in 1 specs)
401. LibraryExport - Export Report to PDF (used in 1 specs)
402. libraryGraphTooltipsHTML (used in 1 specs)
403. LibrarySubscription - Create and Manage PDF Subscription in Library (used in 1 specs)
404. LibrarySubscription - Create and Manage Subscription for Group as Recipients in Library (used in 1 specs)
405. LibrarySubscription - Create and Manage Subscription for other recipients in Library (used in 1 specs)
406. LibrarySubscription - Manage subscriptions which contains prompts in Library (used in 1 specs)
407. Object Type (used in 1 specs)
408. Onboarding Tutorial (used in 1 specs)
409. Project Alias (used in 1 specs)
410. Subscribe - Tanzu Sanity Test (used in 1 specs)
411. System Status (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getSummaryTextByIndex -- frequency: 362
2. getRequestPostData -- frequency: 75
3. getDossierExportPDFPanel -- frequency: 61
4. xlsx -- frequency: 49
5. getSummaryTextByVizTitle -- frequency: 46
6. pdf -- frequency: 43
7. getContentSettingsSection -- frequency: 37
8. getContextMenuEditor -- frequency: 32
9. getSubMenu -- frequency: 32
10. getAdvancedSettingsDialog -- frequency: 29
11. getInfoWindowExportDetails -- frequency: 29
12. getContextMenu -- frequency: 24
13. getFilterDropdownMainDialg -- frequency: 21
14. getMojoPDFExportSettingsEditor -- frequency: 20
15. getSubscriptionPanel -- frequency: 20
16. getDossierView -- frequency: 19
17. getExportExcelPanel -- frequency: 17
18. getExportExcelPanelContent -- frequency: 17
19. getSubscriptionSidebarList -- frequency: 17
20. getContentPanel -- frequency: 16
21. getContextMenuByLevel -- frequency: 16
22. getInfoWindowSubscriptionPanel -- frequency: 16
23. getExportExcelSettingsPanel -- frequency: 13
24. getDossierCount -- frequency: 12
25. getRangeCheckboxStatus -- frequency: 12
26. getRSDExportDialog -- frequency: 10
27. getToolbarBtnByName -- frequency: 10
28. getInfoWindow -- frequency: 9
29. getRangePanel -- frequency: 9
30. getScheduleOptionsDialog -- frequency: 9
31. getDashboardPropertiesExportToPDFDialog -- frequency: 8
32. getInfoWindowCSVExportDialog -- frequency: 8
33. getTextFromDisplayedTooltip -- frequency: 8
34. getAllCheckboxStatus -- frequency: 7
35. getContentsSetting -- frequency: 7
36. getMarginOption -- frequency: 7
37. csv -- frequency: 6
38. getDropZoneTooltip -- frequency: 6
39. getExportPreview -- frequency: 6
40. getIntroductionToLibraryTitleText -- frequency: 6
41. getMenuContent -- frequency: 6
42. getReportExportPDFPanel -- frequency: 6
43. getReportExportToExcelDialog -- frequency: 6
44. getVizList -- frequency: 6
45. getAccountDropdown -- frequency: 5
46. getDeliverySettingsSection -- frequency: 5
47. getDossierViewOnboardingTitleText -- frequency: 5
48. getExportCSVPanel -- frequency: 5
49. getPDFRange -- frequency: 5
50. getPromptByName -- frequency: 5
51. getRecipientsSettingsSection -- frequency: 5
52. getSidebarPDFSettingsPanel -- frequency: 5
53. getTooltipText -- frequency: 5
54. getCommentsIcon -- frequency: 4
55. getDataCutInfoTooltipText -- frequency: 4
56. getDisplayedPage -- frequency: 4
57. getExcelContents -- frequency: 4
58. getFilterContainer -- frequency: 4
59. getGraph -- frequency: 4
60. getPDFSettingsPanel -- frequency: 4
61. getReportCsvPanel -- frequency: 4
62. getSharePanel -- frequency: 4
63. getShowDataDialog -- frequency: 4
64. Close Button -- frequency: 3
65. getDialogPanel -- frequency: 3
66. getExportExcelButton -- frequency: 3
67. getExportPDFButton -- frequency: 3
68. getFTPSettingsDialog -- frequency: 3
69. getInfoWindowEditPanel -- frequency: 3
70. getInfoWindowPDFSettingsPanel -- frequency: 3
71. getMainInfo -- frequency: 3
72. getMojoPdfExportSettings -- frequency: 3
73. getPromptDialog -- frequency: 3
74. getSortAndFilterPanel -- frequency: 3
75. getSortDropdown -- frequency: 3
76. getVisualizationMenuButton -- frequency: 3
77. 29313b -- frequency: 2
78. Context Menu -- frequency: 2
79. getExcelDropDownContents -- frequency: 2
80. getExcelRange -- frequency: 2
81. getExportButton -- frequency: 2
82. getExportPageInfo -- frequency: 2
83. getFilterOptions -- frequency: 2
84. getFormatOptionDropdown -- frequency: 2
85. getGridList -- frequency: 2
86. getLastDossierName -- frequency: 2
87. getPromptEditor -- frequency: 2
88. getRangeDropDownContents -- frequency: 2
89. getRSDExportExcelPanel -- frequency: 2
90. getSaveDossierButton -- frequency: 2
91. getSidebarContainer -- frequency: 2
92. Info Window -- frequency: 2
93. Library Icon -- frequency: 2
94. Loading Button -- frequency: 2
95. mstrd Recipient Combo Box dialog -- frequency: 2
96. Recommendation Loading Icon -- frequency: 2
97. Add All Datasets Checkbox -- frequency: 1
98. Add Button In Unstructured Data Panel -- frequency: 1
99. AGGrid Container Content Height -- frequency: 1
100. AGGrid Container Scroll Height -- frequency: 1
101. Authoring Close Btn -- frequency: 1
102. Back Arrow In Mobile View -- frequency: 1
103. Blurred App Container -- frequency: 1
104. Bookmark Dropdown -- frequency: 1
105. Bookmark Entry -- frequency: 1
106. Bot Active Switch -- frequency: 1
107. Carousel -- frequency: 1
108. Certified Control -- frequency: 1
109. Certified Details -- frequency: 1
110. Change Project -- frequency: 1
111. Checkbox Select All -- frequency: 1
112. Clear Icon -- frequency: 1
113. Clear Input Button In Dataset Panel -- frequency: 1
114. Clear Search Box Button -- frequency: 1
115. Conditional Display Dialog -- frequency: 1
116. Confirmation Dialog -- frequency: 1
117. Content Discovery Panel Detail Panel -- frequency: 1
118. Content Discovery Title -- frequency: 1
119. Contents Panel -- frequency: 1
120. Continue Tour -- frequency: 1
121. Copy Move Window -- frequency: 1
122. Create ADCBtn -- frequency: 1
123. Create Bot Btn -- frequency: 1
124. Create Dashboard Btn -- frequency: 1
125. Create Dossier Dropdown Menu -- frequency: 1
126. Create New Bot Button -- frequency: 1
127. Create New Dossier Add Data Tree Mode -- frequency: 1
128. Create New Dossier Confirmation Dialog -- frequency: 1
129. Create New Dossier Panel -- frequency: 1
130. Create New Dossier Panel Create Btn -- frequency: 1
131. Create New Dossier Panel Footer -- frequency: 1
132. Create New Dossier Project List -- frequency: 1
133. Create New Dossier Search Box Data -- frequency: 1
134. Create New Dossier Select Template Info Panel -- frequency: 1
135. Create New Dossier Select Template Info Update Timestamp -- frequency: 1
136. Create New Dossier Tabs -- frequency: 1
137. Create New Panel Content -- frequency: 1
138. Create With New Data Button -- frequency: 1
139. Dashboard Formatting Button -- frequency: 1
140. Dashboard Formatting Pop Up -- frequency: 1
141. Dashboard Properties Button -- frequency: 1
142. Dashboard Properties Export To Excel Dialog -- frequency: 1
143. Dashboard Properties Export To PDFDialog -- frequency: 1
144. Data Grid Container -- frequency: 1
145. Data Import Dialog -- frequency: 1
146. Data Set Loading Indicator After Select Project -- frequency: 1
147. Data Source Container -- frequency: 1
148. DBSkeleton -- frequency: 1
149. Delete Dossier Dialog -- frequency: 1
150. Dialog -- frequency: 1
151. DILeft Panel -- frequency: 1
152. Direct Save Button -- frequency: 1
153. Dossier Creator Error Message -- frequency: 1
154. Dossier Filter Option -- frequency: 1
155. Dossier Name Inactive Substring -- frequency: 1
156. Dossier Name Input -- frequency: 1
157. Dossier Pendo Container -- frequency: 1
158. Dossier Rename Textbox -- frequency: 1
159. Dossiers List Container -- frequency: 1
160. Dossiers List View Container -- frequency: 1
161. Download Button -- frequency: 1
162. Dropdown Menu -- frequency: 1
163. Edit Btn On Library Toolbar -- frequency: 1
164. Edit Button -- frequency: 1
165. Edit Option In IW -- frequency: 1
166. Empty Content Page -- frequency: 1
167. Empty Library From Filter -- frequency: 1
168. Empty List -- frequency: 1
169. Empty Result -- frequency: 1
170. Empty Table Pnel -- frequency: 1
171. Error Container -- frequency: 1
172. Export Google Sheets Button -- frequency: 1
173. Export MSTRFile From Info Window -- frequency: 1
174. Export To PDFFrom Info Window -- frequency: 1
175. Extra Buttons Dropdown -- frequency: 1
176. FFF3 B3 -- frequency: 1
177. File Button -- frequency: 1
178. Filter Options Container -- frequency: 1
179. Folder Context Menu -- frequency: 1
180. Folder Panel -- frequency: 1
181. Folder Panel Tree -- frequency: 1
182. Folder Panel Tree Scrollable -- frequency: 1
183. Folder Path -- frequency: 1
184. Folder Path Dropdown Menu -- frequency: 1
185. Folder Rename Textbox -- frequency: 1
186. Format Button -- frequency: 1
187. getDashboardPropertiesExportToExcelDialog -- frequency: 1
188. getDetailsPanelItemsCount -- frequency: 1
189. getDossierTitle -- frequency: 1
190. getExportToCSVSettingsPanel -- frequency: 1
191. getExportToExcelSettingsPanel -- frequency: 1
192. getExportToPDFSettingsPanel -- frequency: 1
193. getFavoritesCountFromTitle -- frequency: 1
194. getFilterContentsContainer -- frequency: 1
195. getFilterDetailPanelCheckboxItems -- frequency: 1
196. getFirstDossierName -- frequency: 1
197. getMojoPDFExportButton -- frequency: 1
198. getRecipientSearchSection -- frequency: 1
199. getSubscribeToDashboardPanel -- frequency: 1
200. getSubscriptionShareResipientList -- frequency: 1
201. getSubscriptionSidebarEditDialog -- frequency: 1
202. getViewContainer -- frequency: 1
203. Grid View Button For Mobile -- frequency: 1
204. Hamburger Icon -- frequency: 1
205. Home Icon -- frequency: 1
206. Id In Info Window -- frequency: 1
207. Info Window Object Type Icon -- frequency: 1
208. Info Window Time Stamp -- frequency: 1
209. Info Window User Name -- frequency: 1
210. Inline Error -- frequency: 1
211. Instruction Title In Sider Section -- frequency: 1
212. Intro To Library Got It -- frequency: 1
213. Item Context Menu -- frequency: 1
214. Item Share -- frequency: 1
215. Layer Element List -- frequency: 1
216. Layer Panel -- frequency: 1
217. Library Content Container -- frequency: 1
218. Library Curtain -- frequency: 1
219. Library Dossier Context Menu Item -- frequency: 1
220. Library Icon For Saas -- frequency: 1
221. Library Loading -- frequency: 1
222. Library Navigation Bar -- frequency: 1
223. Library Pendo Container -- frequency: 1
224. Library View Container -- frequency: 1
225. List Container Header -- frequency: 1
226. List View Button For Mobile -- frequency: 1
227. List View Grid -- frequency: 1
228. List View Info Window -- frequency: 1
229. List View Info Window Container For Mobile -- frequency: 1
230. List View Info Window Main Panel -- frequency: 1
231. List View Info Window Top -- frequency: 1
232. Loading In Save Editor -- frequency: 1
233. Loading Row -- frequency: 1
234. Lock Page Size Check Box -- frequency: 1
235. Lock Page Size Helper Icon -- frequency: 1
236. Manage Access Dialog -- frequency: 1
237. Maximize Visualization Dropdown List -- frequency: 1
238. Message Box Container -- frequency: 1
239. Missing Font Popup -- frequency: 1
240. More Optiob Drop Down In IW -- frequency: 1
241. More Option In IW -- frequency: 1
242. Move To Left Item -- frequency: 1
243. Move To Right Item -- frequency: 1
244. Multi Selection Toolbar -- frequency: 1
245. Navigation Bar -- frequency: 1
246. Navigation Bar Collapsed Icon -- frequency: 1
247. New Condition Dialog -- frequency: 1
248. New Dataset Dialog -- frequency: 1
249. New Dataset Selector Diag -- frequency: 1
250. New Document Button -- frequency: 1
251. New Dossier Icon -- frequency: 1
252. New Dossier Project Selection Dropdown List -- frequency: 1
253. New Security Dialog -- frequency: 1
254. No Data Overlay -- frequency: 1
255. Notification Icon -- frequency: 1
256. Nuggets Notification Dialog -- frequency: 1
257. Object Id -- frequency: 1
258. OKButton -- frequency: 1
259. Owner Text -- frequency: 1
260. Path In Info Window -- frequency: 1
261. Path Info -- frequency: 1
262. Perform Search Button -- frequency: 1
263. Project -- frequency: 1
264. Project Dropdown -- frequency: 1
265. Project Header -- frequency: 1
266. Project Picker -- frequency: 1
267. Project Search -- frequency: 1
268. Project Selection Preloader -- frequency: 1
269. Project Selection Window -- frequency: 1
270. Project Selection Window Title -- frequency: 1
271. Quick Search View -- frequency: 1
272. Recommendations List -- frequency: 1
273. Related Content Container -- frequency: 1
274. Remove Button -- frequency: 1
275. Remove Confirmation Dialog -- frequency: 1
276. Remove Spinner -- frequency: 1
277. Replace Button -- frequency: 1
278. Result List Container -- frequency: 1
279. Results -- frequency: 1
280. Right Click Menu -- frequency: 1
281. Save Overwrite Confirmation -- frequency: 1
282. Saved In Folder Dropdown -- frequency: 1
283. Scrollable Container -- frequency: 1
284. Search Container -- frequency: 1
285. Search Data Set Input Box -- frequency: 1
286. Search Icon -- frequency: 1
287. Search Selector -- frequency: 1
288. Search Suggestion -- frequency: 1
289. Security Filter Btn -- frequency: 1
290. Security Filter Container -- frequency: 1
291. Selected Template Name In Grid View -- frequency: 1
292. Selection Count Text -- frequency: 1
293. Side Columns Panel -- frequency: 1
294. Side Container In List View -- frequency: 1
295. Snapshot Content Title -- frequency: 1
296. Snapshot Icon In Bookmark Drop Down -- frequency: 1
297. Snapshot Icon In Info Window -- frequency: 1
298. Snapshot Section -- frequency: 1
299. Sort Bar -- frequency: 1
300. Switch Project Loading Btn -- frequency: 1
301. Template Info Data -- frequency: 1
302. Title -- frequency: 1
303. Tooltip -- frequency: 1
304. Tree Skeleton -- frequency: 1
305. Trial Wrapper -- frequency: 1
306. Unstructured Filelist -- frequency: 1
307. Updated Text -- frequency: 1
308. Upgrade Button In Sider Section -- frequency: 1
309. Upload Btn -- frequency: 1
310. View Container -- frequency: 1
311. View Mode Switch -- frequency: 1
312. Viz Doc -- frequency: 1
313. Wait Curtain -- frequency: 1
314. Wait Msg -- frequency: 1
315. Warning Message Element -- frequency: 1
316. Workspace Loading -- frequency: 1
317. zip -- frequency: 1

## Key Actions

- `sleep()` -- used in 894 specs
- `getSummaryTextByIndex()` -- used in 362 specs
- `editDossierByUrl({ projectId, dossierId }, handleError = true)` -- used in 282 specs
- `goToLibrary()` -- used in 247 specs
- `doubleClickAttributeMetric()` -- used in 222 specs
- `goToPageAndRefreshNLG()` -- used in 204 specs
- `goToPage()` -- used in 183 specs
- `login()` -- used in 179 specs
- `takeScreenshotByVIBoxPanel()` -- used in 168 specs
- `join()` -- used in 154 specs
- `moveDossierIntoViewPort()` -- used in 140 specs
- `takeScreenshotBySelectedViz()` -- used in 128 specs
- `takeScreenshotByDocView()` -- used in 122 specs
- `openDossierInfoWindow(dossierName)` -- used in 113 specs
- `openExportPDFSettingsWindow()` -- used in 102 specs
- `openDossier(name, isMobileView = false)` -- used in 97 specs
- `openPageFromTocMenuWait()` -- used in 96 specs
- `selectViz()` -- used in 96 specs
- `openUrl(projectID, documentID, libraryUrl = browser.options.baseUrl, handleError = true)` -- used in 93 specs
- `changeVizType()` -- used in 86 specs
- `checkVizContainerByTitle()` -- used in 84 specs
- `clickOptionOnChapterMenu()` -- used in 84 specs
- `openShareDropDown()` -- used in 84 specs
- `validatePageSummaryText()` -- used in 82 specs
- `waitForDossierLoading()` -- used in 79 specs
- `getRequestPostData()` -- used in 75 specs
- `openPageFromTocMenu()` -- used in 72 specs
- `disableTutorial()` -- used in 70 specs
- `dismissPopups()` -- used in 66 specs
- `switchToFormatPanel()` -- used in 66 specs
- `clickMenuItemByName()` -- used in 64 specs
- `waitForNlgReady()` -- used in 64 specs
- `openUserAccountMenu()` -- used in 63 specs
- `getDossierExportPDFPanel()` -- used in 61 specs
- `reload()` -- used in 61 specs
- `clickVizMenuItemByName()` -- used in 60 specs
- `dismissTooltip()` -- used in 60 specs
- `close()` -- used in 56 specs
- `clickAndgetVizMenu()` -- used in 48 specs
- `collectLineCoverageInfo(outputFolderString, testName)` -- used in 48 specs
- `openSharePanel()` -- used in 48 specs
- `clickOnInsertVI()` -- used in 46 specs
- `getSummaryTextByVizTitle()` -- used in 46 specs
- `closeSharePanel()` -- used in 44 specs
- `openDebugMode(debugBundles)` -- used in 44 specs
- `logout(options = {})` -- used in 43 specs
- `hoverSubscription()` -- used in 41 specs
- `clickLibraryIcon()` -- used in 40 specs
- `checkElementByImageComparison()` -- used in 38 specs
- `clickInlineDropDown()` -- used in 38 specs
- `clickInlineDropDownItem()` -- used in 38 specs
- `getContentSettingsSection()` -- used in 37 specs
- `switchToTextAndFormTab()` -- used in 36 specs
- `openSubscriptions()` -- used in 35 specs
- `setWindowSize()` -- used in 34 specs
- `clickTextAndFormDropDown()` -- used in 32 specs
- `doubleClickAttributeMetricByName()` -- used in 32 specs
- `getContextMenuEditor()` -- used in 32 specs
- `getSubMenu()` -- used in 32 specs
- `toMatchPdf()` -- used in 32 specs
- `clickSave()` -- used in 31 specs
- `exportSubmitLibrary()` -- used in 31 specs
- `checkDisclaimRefreshDisplay()` -- used in 30 specs
- `clickManageSubscriptionsButton()` -- used in 30 specs
- `clickDossierOnboardingButton(area, option)` -- used in 29 specs
- `clickFiltersApplyButton()` -- used in 29 specs
- `clickSubscriptionFilter()` -- used in 29 specs
- `getAdvancedSettingsDialog()` -- used in 29 specs
- `getInfoWindowExportDetails()` -- used in 29 specs
- `selectFormat()` -- used in 29 specs
- `selectPageSize()` -- used in 29 specs
- `clear()` -- used in 28 specs
- `clickOnVizCategory()` -- used in 28 specs
- `enableABAlocator()` -- used in 28 specs
- `mock()` -- used in 28 specs
- `isVisualizationExportTypePresent()` -- used in 27 specs
- `resetDossierIfPossible()` -- used in 27 specs
- `waitForDownloadComplete({ name, fileType })` -- used in 27 specs
- `clickExportToExcel()` -- used in 26 specs
- `clickOnViz()` -- used in 26 specs
- `waitLoadingDataPopUpIsNotDisplayed(seconds = 10)` -- used in 26 specs
- `clickEditButtonInSidebar()` -- used in 25 specs
- `clickMoreSettings()` -- used in 24 specs
- `clickSwitch()` -- used in 24 specs
- `clickTargetNameDropZone()` -- used in 24 specs
- `getContextMenu()` -- used in 24 specs
- `takeScreenshotByVIDoclayout()` -- used in 24 specs
- `clickUndo()` -- used in 23 specs
- `openCustomAppById()` -- used in 23 specs
- `openSubscribeSettingsWindow()` -- used in 23 specs
- `clickLibraryOnboardingButton(area, option)` -- used in 22 specs
- `clickSubscriptionNameEditButton()` -- used in 22 specs
- `keys()` -- used in 22 specs
- `clickSendNowCheckbox()` -- used in 21 specs
- `getFilterDropdownMainDialg()` -- used in 21 specs
- `getText()` -- used in 21 specs
- `clickApplyButton()` -- used in 20 specs
- `clickBreakByDropZone()` -- used in 20 specs
- `createSubscription()` -- used in 20 specs
- `enter()` -- used in 20 specs
- `getMojoPDFExportSettingsEditor()` -- used in 20 specs
- `getSubscriptionPanel()` -- used in 20 specs
- `switchToVizOptionTab()` -- used in 20 specs
- `getDossierView()` -- used in 19 specs
- `selectExcelContents()` -- used in 19 specs
- `clickDropDown()` -- used in 18 specs
- `clickDropDownItem()` -- used in 18 specs
- `clickRangeAll()` -- used in 18 specs
- `clickRangeDropdown()` -- used in 18 specs
- `dragHeaderWidth()` -- used in 18 specs
- `exportSubmitDossier()` -- used in 18 specs
- `hoverOnDecreaseBar()` -- used in 18 specs
- `inputFileName()` -- used in 18 specs
- `clickAdvancedSettingsButton()` -- used in 17 specs
- `clickCheckboxByPageName()` -- used in 17 specs
- `getExportExcelPanel()` -- used in 17 specs
- `getExportExcelPanelContent()` -- used in 17 specs
- `getSubscriptionSidebarList()` -- used in 17 specs
- `inputNote()` -- used in 17 specs
- `isExportDisabled()` -- used in 17 specs
- `isExporttoPDFPresent()` -- used in 17 specs
- `selectDetailLevel()` -- used in 17 specs
- `selectExportToPDFOnVisualizationMenu()` -- used in 17 specs
- `selectFilterSummary()` -- used in 17 specs
- `selectListViewMode()` -- used in 17 specs
- `tabForward()` -- used in 17 specs
- `togglePageNumbersCheckBox()` -- used in 17 specs
- `waitForElementVisible()` -- used in 17 specs
- `checkVIDoclayout()` -- used in 16 specs
- `clickAxisAndGridLines()` -- used in 16 specs
- `clickExportButton()` -- used in 16 specs
- `clickFilterOption()` -- used in 16 specs
- `clickFontStyle()` -- used in 16 specs
- `clickRotationDropDown()` -- used in 16 specs
- `clickRotationOption()` -- used in 16 specs
- `clickVizMenuSubItemByName()` -- used in 16 specs
- `closeSubscribe()` -- used in 16 specs
- `cwd()` -- used in 16 specs
- `getContentPanel()` -- used in 16 specs
- `getContextMenuByLevel()` -- used in 16 specs
- `getInfoWindowSubscriptionPanel()` -- used in 16 specs
- `inputName()` -- used in 16 specs
- `isSidebarEditPresentByName()` -- used in 16 specs
- `isSidebarRunNowPresentByName()` -- used in 16 specs
- `isSubscriptionEditPresent()` -- used in 16 specs
- `isSubscriptionRunNowPresent()` -- used in 16 specs
- `isUnSubscribePresent()` -- used in 16 specs
- `isUnSubscribePresentByName()` -- used in 16 specs
- `navigateLink()` -- used in 16 specs
- `searchRecipient()` -- used in 16 specs
- `setInstructionOnly()` -- used in 16 specs
- `verifySummaryStyleByPos()` -- used in 16 specs
- `clickExportExcelButton()` -- used in 15 specs
- `clickFilterIcon()` -- used in 15 specs
- `clickInfoWindowEdit()` -- used in 15 specs
- `clickSend()` -- used in 15 specs
- `isShowDataExportTypePresent()` -- used in 15 specs
- `selectGrid()` -- used in 15 specs
- `selectPortraitOrientation()` -- used in 15 specs
- `waitForLoadingButtonToDisappear()` -- used in 15 specs
- `checkGallery()` -- used in 14 specs
- `checkImageCompareForDocView()` -- used in 14 specs
- `chooseColorInColorPicker()` -- used in 14 specs
- `clickAccountOption(text)` -- used in 14 specs
- `clickArrowByChapterName()` -- used in 14 specs
- `clickColorPickDropDown()` -- used in 14 specs
- `hoverOnBar()` -- used in 14 specs
- `isLibraryExportPDFSettingsWindowOpen()` -- used in 14 specs
- `clickClearAllFiltersButton()` -- used in 13 specs
- `getExportExcelSettingsPanel()` -- used in 13 specs
- `isExportPDFEnabled()` -- used in 13 specs
- `openExcelRangeSetting()` -- used in 13 specs
- `openSortMenu()` -- used in 13 specs
- `selectSchedule()` -- used in 13 specs
- `clickAxisTitle()` -- used in 12 specs
- `clickGridLineOption()` -- used in 12 specs
- `clickRefreshIcon()` -- used in 12 specs
- `clickTimeAttributeDropZone()` -- used in 12 specs
- `clickUnsubscribeYes()` -- used in 12 specs
- `createBlankDashboard()` -- used in 12 specs
- `getDossierCount()` -- used in 12 specs
- `getRangeCheckboxStatus()` -- used in 12 specs
- `isExporttoCSVPresent()` -- used in 12 specs
- `isExporttoExcelPresent()` -- used in 12 specs
- `openReportNoWait(name)` -- used in 12 specs
- `selectRecipients()` -- used in 12 specs
- `setFontStyle()` -- used in 12 specs
- `setInstruction()` -- used in 12 specs
- `takeScreenshotByVIVizPanel()` -- used in 12 specs
- `clickBackButton()` -- used in 11 specs
- `clickCompressZipFileCheckbox()` -- used in 11 specs
- `clickVizExportButton()` -- used in 11 specs
- `inputBookmark()` -- used in 11 specs
- `isLibraryOnboardingAreaPresent(area)` -- used in 11 specs
- `openAllSectionList()` -- used in 11 specs
- `openDashboardPropertiesMenu()` -- used in 11 specs
- `openFileMenu()` -- used in 11 specs
- `selectSortOption()` -- used in 11 specs
- `toMatchExcel()` -- used in 11 specs
- `waitForItemLoading()` -- used in 11 specs
- `waitForLibraryLoading()` -- used in 11 specs
- `checkChatbotVizByIndex()` -- used in 10 specs
- `clickAxisLabel()` -- used in 10 specs
- `clickDock(text)` -- used in 10 specs
- `clickEventScheduleOptions()` -- used in 10 specs
- `clickExpandPageByCheckbox()` -- used in 10 specs
- `clickReportShareMenuExportButton()` -- used in 10 specs
- `clickShowDataCloseButton()` -- used in 10 specs
- `deselectListViewMode()` -- used in 10 specs
- `getRSDExportDialog()` -- used in 10 specs
- `getToolbarBtnByName()` -- used in 10 specs
- `goToPageWithNLG()` -- used in 10 specs
- `openPDFSettingsMenu()` -- used in 10 specs
- `OpenScheduleOptions()` -- used in 10 specs
- `selectLandscapeOrientation()` -- used in 10 specs
- `selectShowDataOnVisualizationMenu()` -- used in 10 specs
- `switchToEditorPanel()` -- used in 10 specs
- `waitForExportComplete()` -- used in 10 specs
- `clickContinueTour()` -- used in 9 specs
- `clickExportToPDFTab()` -- used in 9 specs
- `clickFilterContent()` -- used in 9 specs
- `clickOKButton()` -- used in 9 specs
- `clickReportExportToExcel()` -- used in 9 specs
- `clickShareMenuExportButton()` -- used in 9 specs
- `clickSubscriptionSortByOption()` -- used in 9 specs
- `clickVisualizationExportButton()` -- used in 9 specs
- `editDossierFromLibrary()` -- used in 9 specs
- `editPromptInSubscription()` -- used in 9 specs
- `getInfoWindow()` -- used in 9 specs
- `getRangePanel()` -- used in 9 specs
- `getScheduleOptionsDialog()` -- used in 9 specs
- `isExporttoGoogleSheetsPresent()` -- used in 9 specs
- `isSubscriptionNotePresent()` -- used in 9 specs
- `isVizualizationExportExcelDialogwOpen()` -- used in 9 specs
- `log()` -- used in 9 specs
- `openInfoWindowFromListView(name)` -- used in 9 specs
- `selectExportToExcelOnVisualizationMenu()` -- used in 9 specs
- `toggleTableofContentsCheckBox()` -- used in 9 specs
- `clickAlertYes()` -- used in 8 specs
- `clickAutoSummaryIcon()` -- used in 8 specs
- `clickAxesSection()` -- used in 8 specs
- `clickAxisDirection()` -- used in 8 specs
- `clickCheckboxByChapterName()` -- used in 8 specs
- `clickContainerFitDropDown()` -- used in 8 specs
- `clickContainerFitOption()` -- used in 8 specs
- `clickContainerFitSection()` -- used in 8 specs
- `clickDataLabelHideOverlappingLabels()` -- used in 8 specs
- `clickDataLabelSwitch()` -- used in 8 specs
- `clickFilterType()` -- used in 8 specs
- `clickForecastSwitch()` -- used in 8 specs
- `clickGridLines()` -- used in 8 specs
- `clickLegendSwitch()` -- used in 8 specs
- `clickLineLabelSwitch()` -- used in 8 specs
- `clickPDFRangeSetting()` -- used in 8 specs
- `clickPromptIndexByTitle()` -- used in 8 specs
- `clickReferenceLineAdd()` -- used in 8 specs
- `clickReferenceLineEnable()` -- used in 8 specs
- `clickShowDataExportButton()` -- used in 8 specs
- `clickShowTitle()` -- used in 8 specs
- `clickSidebarUnsubscribe()` -- used in 8 specs
- `clickTopLeftCorner()` -- used in 8 specs
- `clickTrendLineSwitch()` -- used in 8 specs
- `disablePendoTutorial()` -- used in 8 specs
- `exclude()` -- used in 8 specs
- `exportRSD()` -- used in 8 specs
- `getDashboardPropertiesExportToPDFDialog()` -- used in 8 specs
- `getInfoWindowCSVExportDialog()` -- used in 8 specs
- `getTextFromDisplayedTooltip()` -- used in 8 specs
- `inputEmailSubject()` -- used in 8 specs
- `isDisplayed()` -- used in 8 specs
- `isDossierOnboardingAreaPresent(area)` -- used in 8 specs
- `isObjectTypeIconDisplayed()` -- used in 8 specs
- `openFilterDetailPanel()` -- used in 8 specs
- `selectFontType()` -- used in 8 specs
- `selectItem(name)` -- used in 8 specs
- `selectMojoOrientation()` -- used in 8 specs
- `selectMojoPageSize()` -- used in 8 specs
- `switchToTitleAndContainerTab()` -- used in 8 specs
- `takeScreenshotByVizTitle()` -- used in 8 specs
- `url()` -- used in 8 specs
- `validateSummaryTextContains()` -- used in 8 specs
- `vizCreationByChat()` -- used in 8 specs
- `clickCloseButton()` -- used in 7 specs
- `clickCSVDelimiterDropdown()` -- used in 7 specs
- `clickDelimiterOption()` -- used in 7 specs
- `clickInfoWindowExportButton()` -- used in 7 specs
- `clickSidebarCancel()` -- used in 7 specs
- `clickSwitchRight()` -- used in 7 specs
- `getAllCheckboxStatus()` -- used in 7 specs
- `getContentsSetting()` -- used in 7 specs
- `getMarginOption()` -- used in 7 specs
- `hideDossierListContainer()` -- used in 7 specs
- `inputSubscriptionName()` -- used in 7 specs
- `inputZipFileName()` -- used in 7 specs
- `inputZipFilePW()` -- used in 7 specs
- `isExportExcelDisable()` -- used in 7 specs
- `isSystemStatusBarDisplayed(index)` -- used in 7 specs
- `openDefaultApp()` -- used in 7 specs
- `openSearchSlider()` -- used in 7 specs
- `selectGridOnly()` -- used in 7 specs
- `selectMojoFilterSummary()` -- used in 7 specs
- `showDossierListContainer()` -- used in 7 specs
- `switchToTab()` -- used in 7 specs
- `toggleHeaderCheckBox()` -- used in 7 specs
- `addNewSampleData()` -- used in 6 specs
- `addNewSampleDataSaaS()` -- used in 6 specs
- `allItemList()` -- used in 6 specs
- `checkGoogleSheetsURLPrefix()` -- used in 6 specs
- `clickBarLogicMetric()` -- used in 6 specs
- `clickBarLogicType()` -- used in 6 specs
- `clickBarLogicValue()` -- used in 6 specs
- `clickCloseDossierButton()` -- used in 6 specs
- `clickGenerate()` -- used in 6 specs
- `clickOnlyByChapterName()` -- used in 6 specs
- `clickReportMoreSettings()` -- used in 6 specs
- `clickSaveDossierButton()` -- used in 6 specs
- `clickSwitchTabButton()` -- used in 6 specs
- `createByAriaLable()` -- used in 6 specs
- `exitInfoWindowPDFSettingsMenu()` -- used in 6 specs
- `getDropZoneTooltip()` -- used in 6 specs
- `getExportPreview()` -- used in 6 specs
- `getIntroductionToLibraryTitleText()` -- used in 6 specs
- `getMenuContent()` -- used in 6 specs
- `getReportExportPDFPanel()` -- used in 6 specs
- `getReportExportToExcelDialog()` -- used in 6 specs
- `getVizList()` -- used in 6 specs
- `hoverOnIncreaseBar()` -- used in 6 specs
- `isGetAllowUnsubscribePresent()` -- used in 6 specs
- `isRSDExportTypePresent()` -- used in 6 specs
- `isVisExportPDFSettingsWindowOpen()` -- used in 6 specs
- `openExportCSVSettingsWindow()` -- used in 6 specs
- `selectExportOnVisualizationMenu()` -- used in 6 specs
- `selectRecipientGroup()` -- used in 6 specs
- `showIconTooltip({ option })` -- used in 6 specs
- `waitForExist()` -- used in 6 specs
- `waitForLibraryAreaPresent(area)` -- used in 6 specs
- `clickAllowChangeDeliveryCheckbox()` -- used in 5 specs
- `clickAllowChangePersonalizationCheckbox()` -- used in 5 specs
- `clickAllTab()` -- used in 5 specs
- `clickExpandAllPageByFields()` -- used in 5 specs
- `clickExpandLayoutsCheckbox()` -- used in 5 specs
- `clickExportExcelFromIW()` -- used in 5 specs
- `clickExportPageByInfoCheckbox()` -- used in 5 specs
- `clickExportPageByInformation()` -- used in 5 specs
- `clickFilterOptionOnly()` -- used in 5 specs
- `clickHamburgerMenu()` -- used in 5 specs
- `clickInfoWindowReportExportButton()` -- used in 5 specs
- `clickMoveRightItem()` -- used in 5 specs
- `clickReactAdvanceMode()` -- used in 5 specs
- `clickShare()` -- used in 5 specs
- `customCredentials()` -- used in 5 specs
- `deleteRecipient()` -- used in 5 specs
- `executeScript()` -- used in 5 specs
- `filterCount()` -- used in 5 specs
- `getAccountDropdown()` -- used in 5 specs
- `getDeliverySettingsSection()` -- used in 5 specs
- `getDossierViewOnboardingTitleText(area)` -- used in 5 specs
- `getExportCSVPanel()` -- used in 5 specs
- `getPDFRange()` -- used in 5 specs
- `getPromptByName()` -- used in 5 specs
- `getRecipientsSettingsSection()` -- used in 5 specs
- `getSidebarPDFSettingsPanel()` -- used in 5 specs
- `getTooltipText()` -- used in 5 specs
- `inputBookmarkName()` -- used in 5 specs
- `inputTextAndSearch(text)` -- used in 5 specs
- `isSubscribePresent()` -- used in 5 specs
- `moveDossierIntoViewPortAGGrid(name, scrollToTop = false)` -- used in 5 specs
- `openInfoWindow(title)` -- used in 5 specs
- `openMenu()` -- used in 5 specs
- `openMenuOnVisualization()` -- used in 5 specs
- `openUrlAndCancelAddToLibrary()` -- used in 5 specs
- `run()` -- used in 5 specs
- `selectRange()` -- used in 5 specs
- `setMarginBottom()` -- used in 5 specs
- `setMarginLeft()` -- used in 5 specs
- `setMarginRight()` -- used in 5 specs
- `setMarginTop()` -- used in 5 specs
- `skip()` -- used in 5 specs
- `waitForSearchLoading()` -- used in 5 specs
- `apply()` -- used in 4 specs
- `checkEditorPanel()` -- used in 4 specs
- `checkEmptySummary()` -- used in 4 specs
- `chooseTypeInDropDown()` -- used in 4 specs
- `clearHistory()` -- used in 4 specs
- `clickAllowUnsubscribeCheckbox()` -- used in 4 specs
- `clickAutosizeCheckbox()` -- used in 4 specs
- `clickAutoSummaryExpandButton()` -- used in 4 specs
- `clickButtonFromToolbar()` -- used in 4 specs
- `clickCloseIcon()` -- used in 4 specs
- `clickCustomizedDropdown()` -- used in 4 specs
- `clickCustomizeHeaderFooter()` -- used in 4 specs
- `clickDataLabelAndShapes()` -- used in 4 specs
- `clickDataLabelsHideOL()` -- used in 4 specs
- `clickDataLabelsSwitch()` -- used in 4 specs
- `clickDisplayInConsumption()` -- used in 4 specs
- `clickDossierContextMenuItem(item1, item2 = '', isMobile = false)` -- used in 4 specs
- `clickDropdownOption()` -- used in 4 specs
- `clickEmptySummary()` -- used in 4 specs
- `clickEntireGraph()` -- used in 4 specs
- `clickExpandGridCheckbox()` -- used in 4 specs
- `clickExportGoogleSheetsButton()` -- used in 4 specs
- `clickExportPDFIcon()` -- used in 4 specs
- `clickFontSizeDec()` -- used in 4 specs
- `clickFontSizeInc()` -- used in 4 specs
- `clickForecast()` -- used in 4 specs
- `clickForecastLengthDown()` -- used in 4 specs
- `clickForecastLengthUp()` -- used in 4 specs
- `clickFormatDropdown()` -- used in 4 specs
- `clickHorizontalAxisOption()` -- used in 4 specs
- `clickMaxMinBtn()` -- used in 4 specs
- `clickReactDropdownOption()` -- used in 4 specs
- `clickRedo()` -- used in 4 specs
- `clickReferenceLineDelete()` -- used in 4 specs
- `clickRotationCustomOption()` -- used in 4 specs
- `clickShowDataLabels()` -- used in 4 specs
- `clickShowMaker()` -- used in 4 specs
- `clickSidebarSave()` -- used in 4 specs
- `clickSubMenuItemByName()` -- used in 4 specs
- `clickTimeScheduleOptions()` -- used in 4 specs
- `clickTitleBar()` -- used in 4 specs
- `clickTrendLine()` -- used in 4 specs
- `clickTypeDropDown()` -- used in 4 specs
- `clickUnsubscribe()` -- used in 4 specs
- `clickUseTimezonesCheckbox()` -- used in 4 specs
- `clickVerticalAxisOption()` -- used in 4 specs
- `closeExportCompleteNotification()` -- used in 4 specs
- `closeFilterPanel()` -- used in 4 specs
- `closeManageMyLibrary()` -- used in 4 specs
- `closeShowDataDialog()` -- used in 4 specs
- `closeUserAccountMenu()` -- used in 4 specs
- `confirmValues()` -- used in 4 specs
- `customizeHeaderFooterWithText()` -- used in 4 specs
- `exitPDFSettingsMenu()` -- used in 4 specs
- `getCommentsIcon()` -- used in 4 specs
- `getDataCutInfoTooltipText()` -- used in 4 specs
- `getDisplayedPage()` -- used in 4 specs
- `getExcelContents()` -- used in 4 specs
- `getFilterContainer()` -- used in 4 specs
- `getGraph()` -- used in 4 specs
- `getPDFSettingsPanel()` -- used in 4 specs
- `getReportCsvPanel()` -- used in 4 specs
- `getSharePanel()` -- used in 4 specs
- `getShowDataDialog()` -- used in 4 specs
- `hoverOnAutoRefreshInfo()` -- used in 4 specs
- `hoverOnDataCutInfoIcon()` -- used in 4 specs
- `hoverOnInstructionIcon()` -- used in 4 specs
- `hoverOnViz()` -- used in 4 specs
- `isAutoSummaryExistInCanvas()` -- used in 4 specs
- `isAutoSummaryExpand()` -- used in 4 specs
- `isAutoSummaryIconSelected()` -- used in 4 specs
- `isDisplayInConsumptionChecked()` -- used in 4 specs
- `isDossierExportPDFSettingsWindowOpen()` -- used in 4 specs
- `isExportCompleteNotificationPresent()` -- used in 4 specs
- `isExportCSVEnabled()` -- used in 4 specs
- `isLibraryIntroductionPresent()` -- used in 4 specs
- `openDossierContextMenu(name, isMobile = false)` -- used in 4 specs
- `openFilterPanel()` -- used in 4 specs
- `openMQFirstValue()` -- used in 4 specs
- `openSecondaryPanel()` -- used in 4 specs
- `openSidebar()` -- used in 4 specs
- `selectBookmark()` -- used in 4 specs
- `selectCreateAutoNarrativeOnVisualizationMenu()` -- used in 4 specs
- `selectDeleteOnVisualizationMenu()` -- used in 4 specs
- `selectElementByName()` -- used in 4 specs
- `selectExcelRange()` -- used in 4 specs
- `selectGridElement()` -- used in 4 specs
- `selectOptionInCheckbox()` -- used in 4 specs
- `setFontColor()` -- used in 4 specs
- `setFontHorizontalAlignment()` -- used in 4 specs
- `setFontSize()` -- used in 4 specs
- `setFontVerticalAlignment()` -- used in 4 specs
- `setReferenceLineConstantValue()` -- used in 4 specs
- `stopGuides()` -- used in 4 specs
- `switchUser(credentials)` -- used in 4 specs
- `switchViewMode()` -- used in 4 specs
- `tooltip()` -- used in 4 specs
- `actionOnToolbar()` -- used in 3 specs
- `addSingle()` -- used in 3 specs
- `certifiedDetails()` -- used in 3 specs
- `checkListSummary()` -- used in 3 specs
- `clickAdvanceModeOkButton()` -- used in 3 specs
- `clickClearAllButton()` -- used in 3 specs
- `clickContextMenuIconInGrid(name)` -- used in 3 specs
- `clickEditContentArrow()` -- used in 3 specs
- `clickElmInAvailableList()` -- used in 3 specs
- `clickExportCSVButton()` -- used in 3 specs
- `clickExportFilterDetails()` -- used in 3 specs
- `clickExportReportTitle()` -- used in 3 specs
- `clickFilterClearAll()` -- used in 3 specs
- `clickFormatCheckbox(format)` -- used in 3 specs
- `clickInfoWindowIconInGrid(name)` -- used in 3 specs
- `clickLibraryExportButton()` -- used in 3 specs
- `clickSelectAllButton()` -- used in 3 specs
- `clickShowFiltersCheckbox()` -- used in 3 specs
- `clickViewMoreButton()` -- used in 3 specs
- `getDialogPanel()` -- used in 3 specs
- `getExportExcelButton()` -- used in 3 specs
- `getExportPDFButton()` -- used in 3 specs
- `getFTPSettingsDialog()` -- used in 3 specs
- `getInfoWindowEditPanel()` -- used in 3 specs
- `getInfoWindowPDFSettingsPanel()` -- used in 3 specs
- `getMainInfo()` -- used in 3 specs
- `getMojoPdfExportSettings()` -- used in 3 specs
- `getPromptDialog()` -- used in 3 specs
- `getSortAndFilterPanel()` -- used in 3 specs
- `getSortDropdown()` -- used in 3 specs
- `getVisualizationMenuButton()` -- used in 3 specs
- `hideRelatedContentItem()` -- used in 3 specs
- `hoverOnContextMenuShareItem()` -- used in 3 specs
- `inputCustomizeFooter()` -- used in 3 specs
- `inputCustomizeHeader()` -- used in 3 specs
- `isExportGoogleSheetsEnabled()` -- used in 3 specs
- `isLibraryExportExcelWindowOpen()` -- used in 3 specs
- `isResetDisabled()` -- used in 3 specs
- `isShowDataExportButtonAvailable()` -- used in 3 specs
- `isSortBarColumnElementPresent(columnLabel)` -- used in 3 specs
- `isUseTimezonesCheckboxChecked()` -- used in 3 specs
- `keepOnlyOption()` -- used in 3 specs
- `logoutClearCacheAndLogin(credentials, skipOpenAccountMenu = false)` -- used in 3 specs
- `objectTypeInInfoWindow()` -- used in 3 specs
- `openContentByOrder()` -- used in 3 specs
- `OpenDocumentSingleVisualizationMenuButton()` -- used in 3 specs
- `openFilterTypeDropdown()` -- used in 3 specs
- `openFolderByPath(folderPath)` -- used in 3 specs
- `openGlobalResultInfoWindow(title)` -- used in 3 specs
- `openMyApplicationPanel()` -- used in 3 specs
- `openRangeDialog()` -- used in 3 specs
- `pathInInfoWindow()` -- used in 3 specs
- `pressEnter()` -- used in 3 specs
- `removeDossierFromLibrary(usercredentials, targetDossier, flag = true, isLogout = true)` -- used in 3 specs
- `search(text)` -- used in 3 specs
- `searchFilterItem()` -- used in 3 specs
- `searchRecipientByName()` -- used in 3 specs
- `selectDataDelimiter()` -- used in 3 specs
- `selectExcelExpandAllPageby()` -- used in 3 specs
- `selectFilterOptionButton()` -- used in 3 specs
- `selectGridSettings()` -- used in 3 specs
- `toBeUndefined()` -- used in 3 specs
- `waitForDossierAreaPresent(area)` -- used in 3 specs
- `waitForEditor()` -- used in 3 specs
- `waitForExportLoadingButtonToDisappear(timeout = 60000)` -- used in 3 specs
- `waitForToCOnboardingAreaPresent()` -- used in 3 specs
- `addAll()` -- used in 2 specs
- `addAttributMetricToDropzone()` -- used in 2 specs
- `addColumnByNameList(nameList)` -- used in 2 specs
- `addLastVizToPage()` -- used in 2 specs
- `arrowDown()` -- used in 2 specs
- `backToLibrary()` -- used in 2 specs
- `cancelEditor()` -- used in 2 specs
- `cancelExportSettingsVisualization()` -- used in 2 specs
- `changeDecreaseFactorColor()` -- used in 2 specs
- `changeIncreaseFactorColor()` -- used in 2 specs
- `checkChatbotMaximizeViz()` -- used in 2 specs
- `checkDeleteVizPopupDialog()` -- used in 2 specs
- `checkInstruction()` -- used in 2 specs
- `checkInstructionTooltip()` -- used in 2 specs
- `checkMultiQualSummary()` -- used in 2 specs
- `checkPopupDialog()` -- used in 2 specs
- `checkSuggestionsPopup()` -- used in 2 specs
- `checkVIVizPanel()` -- used in 2 specs
- `checkVizContainerMenu()` -- used in 2 specs
- `checkVizInAutoDashboard()` -- used in 2 specs
- `clearAndInputValues()` -- used in 2 specs
- `clickAdjuectMarginCheckbox()` -- used in 2 specs
- `clickAllSection()` -- used in 2 specs
- `clickAutoRefresh()` -- used in 2 specs
- `clickAutoSummaryCloseButton()` -- used in 2 specs
- `clickAutoSummaryCopyButton()` -- used in 2 specs
- `clickCancelButton()` -- used in 2 specs
- `clickColumnsButton()` -- used in 2 specs
- `clickCSVRangeSetting()` -- used in 2 specs
- `clickDeleteButton()` -- used in 2 specs
- `clickErrorActionButton()` -- used in 2 specs
- `clickExportReportTitleCheckbox()` -- used in 2 specs
- `clickFilterDetailsPanelButton()` -- used in 2 specs
- `clickNewDossierIcon()` -- used in 2 specs
- `clickNlgCopyBtn()` -- used in 2 specs
- `clickOnlyByPageName()` -- used in 2 specs
- `clickOnRectArea()` -- used in 2 specs
- `clickOptionInMobileView()` -- used in 2 specs
- `clickReactAdjustMarginCheckbox()` -- used in 2 specs
- `clickReactLockButton()` -- used in 2 specs
- `clickReactVizExportButton()` -- used in 2 specs
- `clickReportExportButton()` -- used in 2 specs
- `clickReportExportPageByInfoCheckbox()` -- used in 2 specs
- `clickRSDExportButton()` -- used in 2 specs
- `clickSaveButton()` -- used in 2 specs
- `clickSendNotificationCheckbox()` -- used in 2 specs
- `clickSortBarColumn(columnLabel, sortOrder)` -- used in 2 specs
- `clickSuggenstedItemByName()` -- used in 2 specs
- `clickViewAll()` -- used in 2 specs
- `clickVisualizationTitle()` -- used in 2 specs
- `clickWrapTextCheckbox()` -- used in 2 specs
- `closeChatbotVizFocusModal()` -- used in 2 specs
- `closeExportPDFSettingsWindow()` -- used in 2 specs
- `closeTab()` -- used in 2 specs
- `contentPath(name, isMobileView = false)` -- used in 2 specs
- `customizeHeaderFooterWithImage()` -- used in 2 specs
- `detailLevelSelectedItem()` -- used in 2 specs
- `dragZoomSlider()` -- used in 2 specs
- `errorMsg()` -- used in 2 specs
- `execute()` -- used in 2 specs
- `ExportDocumentSingleVisualization()` -- used in 2 specs
- `exportShowData()` -- used in 2 specs
- `FilterSummarySelectedItem()` -- used in 2 specs
- `getExcelDropDownContents()` -- used in 2 specs
- `getExcelRange()` -- used in 2 specs
- `getExportButton()` -- used in 2 specs
- `getExportPageInfo()` -- used in 2 specs
- `getFilterOptions()` -- used in 2 specs
- `getFormatOptionDropdown()` -- used in 2 specs
- `getGridList()` -- used in 2 specs
- `getLastDossierName()` -- used in 2 specs
- `getPromptEditor()` -- used in 2 specs
- `getRangeDropDownContents()` -- used in 2 specs
- `getRSDExportExcelPanel()` -- used in 2 specs
- `getSaveDossierButton()` -- used in 2 specs
- `getSidebarContainer()` -- used in 2 specs
- `hoverOnCertifiedIcon(name)` -- used in 2 specs
- `hoverOnFootnote()` -- used in 2 specs
- `hoverOnGrid()` -- used in 2 specs
- `hoverOnObjectTypeIcon()` -- used in 2 specs
- `includes()` -- used in 2 specs
- `input()` -- used in 2 specs
- `inputDataDelimiter()` -- used in 2 specs
- `inputDelimiter()` -- used in 2 specs
- `inputMessage()` -- used in 2 specs
- `inputMicroStrategyWebLink()` -- used in 2 specs
- `inputRecipient()` -- used in 2 specs
- `inputText(text)` -- used in 2 specs
- `inputValues()` -- used in 2 specs
- `isContextMenuOptionPresent()` -- used in 2 specs
- `isEditIconPresent()` -- used in 2 specs
- `isExportExcelButtonPresent()` -- used in 2 specs
- `isExportExcelEnabled()` -- used in 2 specs
- `isFavoritesBtnSelected()` -- used in 2 specs
- `isObjectTypeIconInSearchResultsDisplayed()` -- used in 2 specs
- `isObjectTypeInInfoWindowPresent()` -- used in 2 specs
- `isPortraitOrientationButtonSelected()` -- used in 2 specs
- `isRangeDropDownListOpen()` -- used in 2 specs
- `isRSDRangeDropDownListOpen()` -- used in 2 specs
- `isSearchSuggestionObjectTypeIconDisplayed()` -- used in 2 specs
- `isSendNowPresent()` -- used in 2 specs
- `isSingleVisualizationExportSpinnerPresent()` -- used in 2 specs
- `keepOnly()` -- used in 2 specs
- `maximizeChatbotVisualization()` -- used in 2 specs
- `maximizeContainer()` -- used in 2 specs
- `objectTypeInListMobileViewDisplayed(name, isMobileView = true)` -- used in 2 specs
- `objectTypeInListViewIndoWindow()` -- used in 2 specs
- `open()` -- used in 2 specs
- `openAutoDashboard()` -- used in 2 specs
- `openConditionDropdown()` -- used in 2 specs
- `openContentDiscovery()` -- used in 2 specs
- `openInfoWindowFromMobileView(name)` -- used in 2 specs
- `openItemByIndex()` -- used in 2 specs
- `openRSDVisualizationMenu()` -- used in 2 specs
- `openShowFilterDropdown()` -- used in 2 specs
- `openSidebarOnly()` -- used in 2 specs
- `openSubscriptionSnapshotByName()` -- used in 2 specs
- `pageSizeSelectedItem()` -- used in 2 specs
- `readText()` -- used in 2 specs
- `refresh()` -- used in 2 specs
- `relogin()` -- used in 2 specs
- `saasLogin()` -- used in 2 specs
- `scrollToTop()` -- used in 2 specs
- `selectAll()` -- used in 2 specs
- `selectCondition()` -- used in 2 specs
- `selectCopyFormattingOnVisualizationMenu()` -- used in 2 specs
- `selectCustomizedSetting()` -- used in 2 specs
- `selectDuplicateOnVisualizationMenu()` -- used in 2 specs
- `selectFilteroption()` -- used in 2 specs
- `selectPasteFormattingOnVisualizationMenu()` -- used in 2 specs
- `selectProject(projectName)` -- used in 2 specs
- `selectRecipient()` -- used in 2 specs
- `selectType()` -- used in 2 specs
- `setReactMarginBottom()` -- used in 2 specs
- `setReactMarginLeft()` -- used in 2 specs
- `setReactMarginRight()` -- used in 2 specs
- `setReactMarginTop()` -- used in 2 specs
- `setValueForPositionX()` -- used in 2 specs
- `showTooltipOfExportPDFIcon()` -- used in 2 specs
- `switchAlignment()` -- used in 2 specs
- `switchCellPadding()` -- used in 2 specs
- `switchCustomApp()` -- used in 2 specs
- `switchWorkflow()` -- used in 2 specs
- `toBeTruthy()` -- used in 2 specs
- `toggleExpandAllGridDataCheckBox()` -- used in 2 specs
- `toggleFilterSummaryCheckBox()` -- used in 2 specs
- `toggleMojoShowHeader()` -- used in 2 specs
- `toggleRepeatAttributeColumnsCheckBox()` -- used in 2 specs
- `validateClipboardContains()` -- used in 2 specs
- `waitForSummaryItem()` -- used in 2 specs
- `addRecipient()` -- used in 1 specs
- `addToLibrary()` -- used in 1 specs
- `applyFilterChanged()` -- used in 1 specs
- `changeProjectTo(project)` -- used in 1 specs
- `checkFilterType()` -- used in 1 specs
- `chooseTab()` -- used in 1 specs
- `clearSearch()` -- used in 1 specs
- `clickAccountButton()` -- used in 1 specs
- `clickAddNewAddressButton()` -- used in 1 specs
- `clickAddressCancelButton()` -- used in 1 specs
- `clickAddressNameTextBox()` -- used in 1 specs
- `clickAddToLibraryButton()` -- used in 1 specs
- `clickAdjustMarginCheckbox()` -- used in 1 specs
- `clickAllowUnsubscribe()` -- used in 1 specs
- `clickCloseButtonIfVisible()` -- used in 1 specs
- `clickEditButton()` -- used in 1 specs
- `clickEmailAddressTextBox()` -- used in 1 specs
- `clickExpandPageBy()` -- used in 1 specs
- `clickExportToCSV()` -- used in 1 specs
- `clickExportToCsvItemInContextMenu()` -- used in 1 specs
- `clickExportToExcelTab()` -- used in 1 specs
- `clickExportToPDF()` -- used in 1 specs
- `clickGraphCell()` -- used in 1 specs
- `clickIntroToLibraryGotIt()` -- used in 1 specs
- `clickIntroToLibrarySkip()` -- used in 1 specs
- `clickLaunchButton()` -- used in 1 specs
- `clickLockButton()` -- used in 1 specs
- `clickMoveLeftItem()` -- used in 1 specs
- `clickMyLibraryTab()` -- used in 1 specs
- `clickNewDossierButton(waitForDataset = true)` -- used in 1 specs
- `clickNewReportButton()` -- used in 1 specs
- `clickPredefinedSection()` -- used in 1 specs
- `clickReactExpandGridCheckbox()` -- used in 1 specs
- `clickReactLandscapeButton()` -- used in 1 specs
- `clickReactPaperSizeDropdownOption()` -- used in 1 specs
- `clickReactScaleGridCheckbox()` -- used in 1 specs
- `clickReactShowFiltersCheckbox()` -- used in 1 specs
- `clickReactShowTableOfContentsCheckbox()` -- used in 1 specs
- `clickReportIWExportCancelButton()` -- used in 1 specs
- `clickRunNowInSubscriptionListByName()` -- used in 1 specs
- `clickScaleGridCheckbox()` -- used in 1 specs
- `clickShowDataExportButtonNoPrivilege()` -- used in 1 specs
- `clickShowTableOfContentsCheckbox()` -- used in 1 specs
- `clickSubFolderRadioButton()` -- used in 1 specs
- `clickSubscribeToDashboard()` -- used in 1 specs
- `clickTitlebarExportCSVButton()` -- used in 1 specs
- `clickTitlebarExportExcelButton()` -- used in 1 specs
- `clickTitlebarExportPDFButton()` -- used in 1 specs
- `clickUsersRadioButton()` -- used in 1 specs
- `clickZoomInIcon()` -- used in 1 specs
- `clickZoomOutIcon()` -- used in 1 specs
- `closeDialog()` -- used in 1 specs
- `closeFilterPanelInMobileView()` -- used in 1 specs
- `closeManageLibrary()` -- used in 1 specs
- `closeSidebar()` -- used in 1 specs
- `closeSortByDropdownInMobileView()` -- used in 1 specs
- `closeSystemStatusBar(index)` -- used in 1 specs
- `confirmRemoval()` -- used in 1 specs
- `confirmRemove()` -- used in 1 specs
- `confirmResetWithPrompt()` -- used in 1 specs
- `contentProject(name, isMobileView = false)` -- used in 1 specs
- `copyLink()` -- used in 1 specs
- `currentSortOption()` -- used in 1 specs
- `deleteDataset()` -- used in 1 specs
- `deselectListViewModeMobile()` -- used in 1 specs
- `editName({ option, name, newName })` -- used in 1 specs
- `exportDataset()` -- used in 1 specs
- `exportSubmitVisualization()` -- used in 1 specs
- `favoriteDossier(dossierName)` -- used in 1 specs
- `firstTwoItems()` -- used in 1 specs
- `folderPath()` -- used in 1 specs
- `getDashboardPropertiesExportToExcelDialog()` -- used in 1 specs
- `getDetailsPanelItemsCount()` -- used in 1 specs
- `getDossierTitle()` -- used in 1 specs
- `getExportToCSVSettingsPanel()` -- used in 1 specs
- `getExportToExcelSettingsPanel()` -- used in 1 specs
- `getExportToPDFSettingsPanel()` -- used in 1 specs
- `getFavoritesCountFromTitle()` -- used in 1 specs
- `getFilterContentsContainer()` -- used in 1 specs
- `getFilterDetailPanelCheckboxItems()` -- used in 1 specs
- `getFirstDossierName()` -- used in 1 specs
- `getMojoPDFExportButton()` -- used in 1 specs
- `getRecipientSearchSection()` -- used in 1 specs
- `getSubscribeToDashboardPanel()` -- used in 1 specs
- `getSubscriptionShareResipientList()` -- used in 1 specs
- `getSubscriptionSidebarEditDialog()` -- used in 1 specs
- `getUrl()` -- used in 1 specs
- `getViewContainer()` -- used in 1 specs
- `hasLibraryIntroduction()` -- used in 1 specs
- `hideIdInInfoWindow()` -- used in 1 specs
- `hideRelatedContentContainer()` -- used in 1 specs
- `hitRemoveButton()` -- used in 1 specs
- `hoverFilter()` -- used in 1 specs
- `hoverOnDossierName()` -- used in 1 specs
- `hoverOnUserName()` -- used in 1 specs
- `hoverOnVisualizationMenuButton()` -- used in 1 specs
- `inputDeviceSubFolder()` -- used in 1 specs
- `inputZoomValue()` -- used in 1 specs
- `isAddToLibraryBarVisible()` -- used in 1 specs
- `isAddToLibraryDisplayed()` -- used in 1 specs
- `isBrowsingFolderPresent(folderName)` -- used in 1 specs
- `isEditorOpen()` -- used in 1 specs
- `isExportLoadingSpinnerPresent()` -- used in 1 specs
- `isFilterCountDisplayed()` -- used in 1 specs
- `isItemCertified(title)` -- used in 1 specs
- `isItemSelected(name)` -- used in 1 specs
- `isItemViewable()` -- used in 1 specs
- `isLibraryEmptyFromFilter()` -- used in 1 specs
- `isLibraryFilterDisplay()` -- used in 1 specs
- `isLibraryIntroduction2Present()` -- used in 1 specs
- `isRSDExportButtonPresent()` -- used in 1 specs
- `isSortDisplay()` -- used in 1 specs
- `isSubFolderRadioAvailable()` -- used in 1 specs
- `isSubscriptionEmptyContentPresent()` -- used in 1 specs
- `isSystemStatusCloseBtnDisplayed(index)` -- used in 1 specs
- `lastItem()` -- used in 1 specs
- `loginToEditMode()` -- used in 1 specs
- `moveToPosition()` -- used in 1 specs
- `noElementText()` -- used in 1 specs
- `openAdminPage()` -- used in 1 specs
- `openContentDropdown()` -- used in 1 specs
- `openDossierAndRunPrompt(name)` -- used in 1 specs
- `openDossierFromRecommendationsListByIndex(index)` -- used in 1 specs
- `openDossierFromSearchResults()` -- used in 1 specs
- `openDossierNoWait(name, owner = null)` -- used in 1 specs
- `openExportToGoogleSheetsDialog()` -- used in 1 specs
- `openGroupSection()` -- used in 1 specs
- `openHamburgerMenu()` -- used in 1 specs
- `openLibraryFilterInMobileView()` -- used in 1 specs
- `openPaperSizeDropdown()` -- used in 1 specs
- `openProjectList()` -- used in 1 specs
- `openRangeDropdown()` -- used in 1 specs
- `openReactShowFilterDropdown()` -- used in 1 specs
- `openSearchFilterPanel()` -- used in 1 specs
- `openSortByDropdownInMobileView()` -- used in 1 specs
- `openTypesDropdownInMobileView()` -- used in 1 specs
- `pathInListViewInfoWindow()` -- used in 1 specs
- `removeAll()` -- used in 1 specs
- `removeFavoriteDossier(dossierName)` -- used in 1 specs
- `saveProjectSelection()` -- used in 1 specs
- `searchForProject(projectName)` -- used in 1 specs
- `searchOnFilter()` -- used in 1 specs
- `searchProject(text)` -- used in 1 specs
- `selectCertifiedOnly()` -- used in 1 specs
- `selectExportToGoogleSheetsOnVisualizationMenu()` -- used in 1 specs
- `selectListViewModeMobile()` -- used in 1 specs
- `selectPaperSize()` -- used in 1 specs
- `selectPDFContent()` -- used in 1 specs
- `selectPDFRange()` -- used in 1 specs
- `selectReactFilteroption()` -- used in 1 specs
- `selectRemove()` -- used in 1 specs
- `selectReset()` -- used in 1 specs
- `selectSubscriptionDevice()` -- used in 1 specs
- `shareDossier()` -- used in 1 specs
- `switchToBrowsingMode()` -- used in 1 specs
- `toggleMojoGridRepeatColumns()` -- used in 1 specs
- `toggleMojoGridSettings()` -- used in 1 specs
- `toggleMojoShowPageNumber()` -- used in 1 specs
- `toggleViewSelected()` -- used in 1 specs
- `unhoverOnVisualizationMenuButton()` -- used in 1 specs
- `xit()` -- used in 1 specs
- `activeBot()` -- used in 0 specs
- `addColumnByTickCheckbox(posIndex)` -- used in 0 specs
- `addTag(key, values)` -- used in 0 specs
- `applyBookmark(bookmarkName)` -- used in 0 specs
- `applyConditionalDisplaySettings()` -- used in 0 specs
- `attributeCount({ section, index })` -- used in 0 specs
- `attributeCount(title)` -- used in 0 specs
- `autoResize()` -- used in 0 specs
- `botActiveSwitchText()` -- used in 0 specs
- `browseAllDossiers()` -- used in 0 specs
- `cancelChange()` -- used in 0 specs
- `cancelCreateButton()` -- used in 0 specs
- `cancelDefaultTemplate()` -- used in 0 specs
- `cancelNewQualification()` -- used in 0 specs
- `cancelNewSecurity()` -- used in 0 specs
- `cancelRemoval()` -- used in 0 specs
- `cancelRemove()` -- used in 0 specs
- `cancelRemoveFromInfoWindow()` -- used in 0 specs
- `cancelRename(name)` -- used in 0 specs
- `cancelReset()` -- used in 0 specs
- `cancelSaveAs()` -- used in 0 specs
- `cancelSecurityFilterDialog()` -- used in 0 specs
- `cancelSwitchProject()` -- used in 0 specs
- `cancelTags()` -- used in 0 specs
- `changeCoverImageByDemoImageIndex(index)` -- used in 0 specs
- `changeCoverImageByPath(path)` -- used in 0 specs
- `checkMatchItems(section)` -- used in 0 specs
- `checkTemplateInfo(templateName)` -- used in 0 specs
- `chooseElement(option)` -- used in 0 specs
- `clearAll()` -- used in 0 specs
- `clearAllRecentlySearchedItems()` -- used in 0 specs
- `clearInput()` -- used in 0 specs
- `clearRecentlySearchedItem(index)` -- used in 0 specs
- `clearSearchData()` -- used in 0 specs
- `clearSearchTemplate()` -- used in 0 specs
- `clickAddToLibraryIconInGrid(name)` -- used in 0 specs
- `clickAuthoringCloseBtn()` -- used in 0 specs
- `clickAutoResizeButton()` -- used in 0 specs
- `clickBackArrow()` -- used in 0 specs
- `clickBackButtonInMobileView()` -- used in 0 specs
- `clickBlankDossierBtn()` -- used in 0 specs
- `clickCancel()` -- used in 0 specs
- `clickCancelButtonOnNuggetsMissingDialog()` -- used in 0 specs
- `clickCheckboxInGrid(name)` -- used in 0 specs
- `clickCheckboxInGridByIndex(index)` -- used in 0 specs
- `clickCheckboxSelectAll()` -- used in 0 specs
- `clickColumnCheckboxByIndex(posIndex, isChecked)` -- used in 0 specs
- `clickComponentFromLayerPanel(componentName)` -- used in 0 specs
- `clickConditionalDisplayOKButton()` -- used in 0 specs
- `clickConfirmationDialogOkButton()` -- used in 0 specs
- `clickContextMenuIconInGridByIndex(index)` -- used in 0 specs
- `clickContextMenuItem(item)` -- used in 0 specs
- `clickCopyFromIW()` -- used in 0 specs
- `clickCoverImage()` -- used in 0 specs
- `clickCoverImageOnInfoWindow()` -- used in 0 specs
- `clickCreate()` -- used in 0 specs
- `clickCreateADCButton()` -- used in 0 specs
- `clickCreateADCFromIW()` -- used in 0 specs
- `clickCreateAndWaitForProcessor()` -- used in 0 specs
- `clickCreateBotButton()` -- used in 0 specs
- `clickCreateBotFromIW()` -- used in 0 specs
- `clickCreateBotOption()` -- used in 0 specs
- `clickCreateButton()` -- used in 0 specs
- `clickCreateButtonForPendo()` -- used in 0 specs
- `clickCreateButtonInNewAgentPanel()` -- used in 0 specs
- `clickCreateDashboardButton()` -- used in 0 specs
- `clickCreateNewFolder()` -- used in 0 specs
- `clickCreateShortcutFromIW()` -- used in 0 specs
- `clickCreateSnapshotButton()` -- used in 0 specs
- `clickCreateWithNewDataButton()` -- used in 0 specs
- `clickDashboardPropertiesOkButton()` -- used in 0 specs
- `clickDataImportDialogCancelButton()` -- used in 0 specs
- `clickDataImportDialogCreateButton()` -- used in 0 specs
- `clickDataImportDialogImportButton()` -- used in 0 specs
- `clickDataImportDialogPrepareDataButton()` -- used in 0 specs
- `clickDataImportDialogSampleFiles()` -- used in 0 specs
- `clickDatasetCheckbox(dataset)` -- used in 0 specs
- `clickDatasetCheckbox(datasetArray)` -- used in 0 specs
- `clickDatasetTypeInAddDataPanel(datasetType)` -- used in 0 specs
- `clickDatasetTypeInDatasetPanel(datasetType)` -- used in 0 specs
- `clickDefaultOption()` -- used in 0 specs
- `clickDeleteFromIW()` -- used in 0 specs
- `clickDossierContextMenuItemNoWait(item)` -- used in 0 specs
- `clickDossierEditIcon(name, isMobileView = false)` -- used in 0 specs
- `clickDossierFavoriteIcon(name)` -- used in 0 specs
- `clickDossierFilterOption()` -- used in 0 specs
- `clickDossierRow(name)` -- used in 0 specs
- `clickDossierSecondaryMenuItem(item)` -- used in 0 specs
- `clickDownloadButton()` -- used in 0 specs
- `clickDownloadDossierFromIW()` -- used in 0 specs
- `clickEditIconInGrid(name)` -- used in 0 specs
- `clickEmbedBotFromIW()` -- used in 0 specs
- `clickEmbeddedBotButtonInGrid(name)` -- used in 0 specs
- `clickExportButtonOnExcelPanel()` -- used in 0 specs
- `clickExportPDFIconFromIW()` -- used in 0 specs
- `clickExportPDFIconInGrid(name)` -- used in 0 specs
- `clickFavoriteByImageIcon(name, selected = true)` -- used in 0 specs
- `clickFavoriteIcon()` -- used in 0 specs
- `clickFolderInDropdownList(folderName)` -- used in 0 specs
- `clickHomeIcon()` -- used in 0 specs
- `clickInfoActionButtonByFeatureId(featureId, actionName = 'Info action button')` -- used in 0 specs
- `clickInfoWindowIconInGridByIndex(index)` -- used in 0 specs
- `clickLockPageSizeCheckBox()` -- used in 0 specs
- `clickLockPageSizeHelperIcon()` -- used in 0 specs
- `clickManageAccessFromIW()` -- used in 0 specs
- `clickMaximizeVisualizationOption(optionLabel)` -- used in 0 specs
- `clickMaximizeVisualizationSelectColumn()` -- used in 0 specs
- `clickMoreMenuFromIW()` -- used in 0 specs
- `clickMoveFromIW()` -- used in 0 specs
- `clickMultiSelectBtn()` -- used in 0 specs
- `clickMyBookmarkLabel()` -- used in 0 specs
- `clickNameCheckbox()` -- used in 0 specs
- `clickNarvigationBar()` -- used in 0 specs
- `clickNewADCButton()` -- used in 0 specs
- `clickNewBot2Button()` -- used in 0 specs
- `clickNewBotButton()` -- used in 0 specs
- `clickNewDataModelButton()` -- used in 0 specs
- `clickNewIcon()` -- used in 0 specs
- `clickNewQualificaiton()` -- used in 0 specs
- `clickOnToolMenu(name)` -- used in 0 specs
- `clickOnToolSubMenu(name)` -- used in 0 specs
- `clickPendoButton(text)` -- used in 0 specs
- `clickPendoLinkButton(text)` -- used in 0 specs
- `clickPreviewButton()` -- used in 0 specs
- `clickRemoveFromInfoWindow(name)` -- used in 0 specs
- `clickRenameFromIW()` -- used in 0 specs
- `clickReplaceButton()` -- used in 0 specs
- `clickReportLinkInExcelExportWindow()` -- used in 0 specs
- `clickResetIconInGrid(name)` -- used in 0 specs
- `clickReuploadButtonOnNuggetsMissingDialog()` -- used in 0 specs
- `clickSearchResultInfoIcon(title)` -- used in 0 specs
- `clickSecurityFilterButton()` -- used in 0 specs
- `clickSelectAllFromListView()` -- used in 0 specs
- `clickShareFromIW()` -- used in 0 specs
- `clickShareIconInGrid(name)` -- used in 0 specs
- `clickSideLabelInListView(buttonLabel)` -- used in 0 specs
- `clickSkipButton()` -- used in 0 specs
- `clickSnapshotCancelButton({ name, index = 0 })` -- used in 0 specs
- `clickSnapshotDoneButton({ name, index = 0 })` -- used in 0 specs
- `clickSnapshotIconInInfoWindow()` -- used in 0 specs
- `clickSortBarColumn(columnType, sortOrder)` -- used in 0 specs
- `clickUpgradeButtonInSiderSection()` -- used in 0 specs
- `clickUpgradeButtonInTrialBanner()` -- used in 0 specs
- `clickUploadButton()` -- used in 0 specs
- `closeConditionalDisplayDialog()` -- used in 0 specs
- `closeDataImportDialog()` -- used in 0 specs
- `closeDialogue()` -- used in 0 specs
- `closeFolderPanel()` -- used in 0 specs
- `closeInfoWindow()` -- used in 0 specs
- `closeNewConditionDialog()` -- used in 0 specs
- `closeNewDossierPanel()` -- used in 0 specs
- `closePendoGuide()` -- used in 0 specs
- `closeTemplateInfo()` -- used in 0 specs
- `closeWindow()` -- used in 0 specs
- `collapseFolder(folderName)` -- used in 0 specs
- `confirmReset()` -- used in 0 specs
- `confirmSwitchProject()` -- used in 0 specs
- `contentUpdatedTime(name, isMobileView = false)` -- used in 0 specs
- `createADCWithDataset({ project = 'MicroStrategy Tutorial', dataset })` -- used in 0 specs
- `createADCWithUnstructuredData({ project = 'MicroStrategy Tutorial', unstructuredData })` -- used in 0 specs
- `createBlankDashboardFromLibrary()` -- used in 0 specs
- `createBlankDashboardFromSaaSLibrary()` -- used in 0 specs
- `createBlankTemplate()` -- used in 0 specs
- `createBotWithADC({ project = 'MicroStrategy Tutorial', aiDataCollection })` -- used in 0 specs
- `createBotWithDataset({ project = 'MicroStrategy Tutorial', dataset })` -- used in 0 specs
- `createBotWithNewData({ project = 'MicroStrategy Tutorial' })` -- used in 0 specs
- `createBotWithNewDataInDefaultProject()` -- used in 0 specs
- `createBotWithReports({ project = 'MicroStrategy Tutorial', reports = [] })` -- used in 0 specs
- `createDashboardWithDataset({ project = 'MicroStrategy Tutorial', dataset })` -- used in 0 specs
- `createDashboardWithReport({ project = 'MicroStrategy Tutorial', report })` -- used in 0 specs
- `createDocumentFromLibrary(projectName)` -- used in 0 specs
- `createDossierFromLibrary()` -- used in 0 specs
- `createNewDashboardByUrl({ projectId = 'B628A31F11E7BD953EAE0080EF0583BD' }, handleError = true)` -- used in 0 specs
- `createNewDossier()` -- used in 0 specs
- `createNewReport()` -- used in 0 specs
- `createNewReportByUrl({ projectId = 'B628A31F11E7BD953EAE0080EF0583BD' }, handleError = true)` -- used in 0 specs
- `createReportFromLibrary(projectName = 'MicroStrategy Tutorial')` -- used in 0 specs
- `createSnapshotOnBookmark(bookmarkName)` -- used in 0 specs
- `deleteBookmark(bookmarkName)` -- used in 0 specs
- `deleteCondition()` -- used in 0 specs
- `deleteConditionByElement(option)` -- used in 0 specs
- `deleteItemFromInfoWindow()` -- used in 0 specs
- `deleteSnapshot({ name, index = 0 })` -- used in 0 specs
- `deleteTagKey(key)` -- used in 0 specs
- `deleteTagValue(key, value)` -- used in 0 specs
- `deleteUnstructuredDataInUploadDialog(filename)` -- used in 0 specs
- `deselectItem(name)` -- used in 0 specs
- `deselectItemInListView(name)` -- used in 0 specs
- `disableForAI()` -- used in 0 specs
- `dismissContextMenu()` -- used in 0 specs
- `dismissMissingFontPopup()` -- used in 0 specs
- `dismissQuickSearch()` -- used in 0 specs
- `dismissSearch()` -- used in 0 specs
- `dismissTooltipsByClickTitle()` -- used in 0 specs
- `dissmissPopup()` -- used in 0 specs
- `dossierNameInResultItem({ section, index })` -- used in 0 specs
- `doubleClickOnAgGrid(folderName)` -- used in 0 specs
- `doubleClickOnTreeView(folderName)` -- used in 0 specs
- `downloadDossier()` -- used in 0 specs
- `dragFolderPanelWidth(offset)` -- used in 0 specs
- `editBotByUrl({ appId = 'C2B2023642F6753A2EF159A75E0CFF29', projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', botId }, handleError = true)` -- used in 0 specs
- `editDossierByUrlwithMissingFont({ projectId, dossierId }, handleError = true)` -- used in 0 specs
- `editDossierByUrlwithPrompt({ projectId, dossierId }, handleError = false)` -- used in 0 specs
- `editDossierFromLibraryWithNoWait()` -- used in 0 specs
- `editDossierWithPageKeyByUrl({ projectId, dossierId, pageKey }, handleError = true)` -- used in 0 specs
- `editReportByUrl({ projectId, dossierId }, handleError = true)` -- used in 0 specs
- `editSnapshotName({ name, index = 0, text = '', save = true })` -- used in 0 specs
- `enableForAI()` -- used in 0 specs
- `enableForAI(skipWaiting = false, timeout = this.DEFAULT_LOADING_TIMEOUT)` -- used in 0 specs
- `enableReactIntegration()` -- used in 0 specs
- `executeGlobalResultItem(title)` -- used in 0 specs
- `executeRecentlySearchedItem(index)` -- used in 0 specs
- `executeResultItem({ section, index })` -- used in 0 specs
- `executeResultItem(title)` -- used in 0 specs
- `expand(dossierName)` -- used in 0 specs
- `expandCollapsedNavBar()` -- used in 0 specs
- `expandFolderByPath(folderPath)` -- used in 0 specs
- `expandFolderPath(folderPath)` -- used in 0 specs
- `expandTreeView(folderName, nextLevelFolder)` -- used in 0 specs
- `fakeDateModifiedColumns()` -- used in 0 specs
- `fakeTimestamp()` -- used in 0 specs
- `fakeUpdateTimestamp()` -- used in 0 specs
- `favorite()` -- used in 0 specs
- `favoriteBookmarks(bookmarkNames)` -- used in 0 specs
- `favoriteByImageIcon(name)` -- used in 0 specs
- `favoriteData()` -- used in 0 specs
- `favoriteWithoutScroll()` -- used in 0 specs
- `folderPanelWidth()` -- used in 0 specs
- `getActionButtonsName()` -- used in 0 specs
- `getActiveTabHeaderText()` -- used in 0 specs
- `getAddButtonColor()` -- used in 0 specs
- `getAddButtonCSSProperty(property)` -- used in 0 specs
- `getAGGridGroupItemCount(groupName)` -- used in 0 specs
- `getAGGridItemCount()` -- used in 0 specs
- `getAllCountFromTitle()` -- used in 0 specs
- `getBookmarkListNames()` -- used in 0 specs
- `getBookmarkListNumberFromTitle()` -- used in 0 specs
- `getBotCount()` -- used in 0 specs
- `getCheckboxOfBotDataset(dataset)` -- used in 0 specs
- `getClearSearchTextBtn()` -- used in 0 specs
- `getConditionTitle(option)` -- used in 0 specs
- `getConfirmationDialogMessage()` -- used in 0 specs
- `getConfirmMessageText()` -- used in 0 specs
- `getCreateBotText()` -- used in 0 specs
- `getCreateDossierTabNames()` -- used in 0 specs
- `getCreateNewDossierSearchBoxData()` -- used in 0 specs
- `getCreateNewMenuItemsText()` -- used in 0 specs
- `getDataGridRow(index)` -- used in 0 specs
- `getDataModelCountFromTitle()` -- used in 0 specs
- `getDatasetNameCheckbox(dataset)` -- used in 0 specs
- `getDeleteIconTooltipInInfoWindow()` -- used in 0 specs
- `getDossierInRecommendationsListContainer({ name = '', index = 0 })` -- used in 0 specs
- `getDossierNameInactiveSubstringText()` -- used in 0 specs
- `getDossierPendoContainerText(index)` -- used in 0 specs
- `getFavoriteBookmarkNumberFromTitle()` -- used in 0 specs
- `getFocusedMenuOptionLabel()` -- used in 0 specs
- `getGroupCountFromTitle(group)` -- used in 0 specs
- `getIdInInfoWindow()` -- used in 0 specs
- `getInfoWindowActionCount()` -- used in 0 specs
- `getInfoWindowMorActionAcount()` -- used in 0 specs
- `getInlineErrorMessage()` -- used in 0 specs
- `getInstructionTitleInSiderSectionText()` -- used in 0 specs
- `getItemsCount(name, owner = null)` -- used in 0 specs
- `getLastDossierOwner()` -- used in 0 specs
- `getLibraryPendoContainerTitleText()` -- used in 0 specs
- `getListContainerHeaderFont()` -- used in 0 specs
- `getListContainerHeaderText()` -- used in 0 specs
- `getMaximizeVisualizationRow()` -- used in 0 specs
- `getMaximizeVisualizationSelectColumn()` -- used in 0 specs
- `getMenuContextItemCount()` -- used in 0 specs
- `getObjectNameInPathPreview()` -- used in 0 specs
- `getProjectSelectionWindowTitle()` -- used in 0 specs
- `getRemoveConfirmationMessageText()` -- used in 0 specs
- `getRowCountInTemplateList()` -- used in 0 specs
- `getRowDataInAddDataTab(index)` -- used in 0 specs
- `getRowDataInListView(index, functionName)` -- used in 0 specs
- `getRowDataInTemplateListView(index)` -- used in 0 specs
- `getRowOfBotDataset(dataset)` -- used in 0 specs
- `getSaveInFolderDropdownOptionsText()` -- used in 0 specs
- `getSaveInFolderSelectionText()` -- used in 0 specs
- `getSelectedDatasetsCount()` -- used in 0 specs
- `getSelectedTemplateNameInGridView()` -- used in 0 specs
- `getSelectionCountText()` -- used in 0 specs
- `getSnapshotCancelButton({ name, index = 0 })` -- used in 0 specs
- `getSnapshotDateTime(index = 0)` -- used in 0 specs
- `getSnapshotDeleteButton({ name, index = 0 })` -- used in 0 specs
- `getSnapshotDoneButton({ name, index = 0 })` -- used in 0 specs
- `getSnapshotEditButton({ name, index = 0 })` -- used in 0 specs
- `getSnapshotErrorText()` -- used in 0 specs
- `getSnapshotInput({ name, index = 0 })` -- used in 0 specs
- `getSnapshotItem({ name, index = 0 })` -- used in 0 specs
- `getSnapshotItemBackgroundColor({ name, index = 0 })` -- used in 0 specs
- `getSnapshotItemCount()` -- used in 0 specs
- `getSnapshotItemCSSProperty({ name, index = 0, property })` -- used in 0 specs
- `getSnapshotItemHeight({ name, index = 0 })` -- used in 0 specs
- `getSnapshotItems()` -- used in 0 specs
- `getSnapshotItemWidth({ name, index = 0 })` -- used in 0 specs
- `getSnapshotListErrorText()` -- used in 0 specs
- `getSnapshotName({ name, index = 0 })` -- used in 0 specs
- `getSnapshotSection()` -- used in 0 specs
- `getSnapshotSectionBackgroundColor()` -- used in 0 specs
- `getSnapshotsHeader()` -- used in 0 specs
- `getSnapshotsItemCount()` -- used in 0 specs
- `getSnapshotTitle({ name, index = 0 })` -- used in 0 specs
- `getSnapshotTitleText({ name, index = 0 })` -- used in 0 specs
- `getSnapshotTooltipText()` -- used in 0 specs
- `getTagKeyValuesCount(key)` -- used in 0 specs
- `getTagsCount()` -- used in 0 specs
- `getTemplateInfoData()` -- used in 0 specs
- `getTemplateItemNameInGridView(index)` -- used in 0 specs
- `getTemplateItemsCntInGridView()` -- used in 0 specs
- `getTemplateListHeaders()` -- used in 0 specs
- `getTemplateListRow(index)` -- used in 0 specs
- `getTemplateNamesInGridView()` -- used in 0 specs
- `getTitleText()` -- used in 0 specs
- `getTotalBookmarkNumber()` -- used in 0 specs
- `getTrialBannerMessageText()` -- used in 0 specs
- `getWarningMessageText()` -- used in 0 specs
- `goToHome()` -- used in 0 specs
- `handleError()` -- used in 0 specs
- `hasASelectedDataSource()` -- used in 0 specs
- `hasSkipButton()` -- used in 0 specs
- `hideCertifiedDetailsText()` -- used in 0 specs
- `hoverDossier(name, isMobileView = false)` -- used in 0 specs
- `hoverDossier(name)` -- used in 0 specs
- `hoverDossierByIndex(index)` -- used in 0 specs
- `hoverDotsInFolderPath()` -- used in 0 specs
- `hoverEnabledForAIIndicator(name)` -- used in 0 specs
- `hoverHomeCardAIDisabledIcon(name)` -- used in 0 specs
- `hoverHomeCardAIEnabledIcon(name)` -- used in 0 specs
- `hoverOnConditionName(option)` -- used in 0 specs
- `hoverOnObject({ title, object, objectIndex = 0 })` -- used in 0 specs
- `hoverOnShare()` -- used in 0 specs
- `hoverOnSnapshotItem({ name, index = 0 })` -- used in 0 specs
- `hoverOnTemplateIcon(name)` -- used in 0 specs
- `inactiveBot()` -- used in 0 specs
- `inputImagePath(path)` -- used in 0 specs
- `inputTextAndOpenSearchPage(text)` -- used in 0 specs
- `isAccountIconPresent()` -- used in 0 specs
- `isAccountOptionPresent(text)` -- used in 0 specs
- `isActiveToggleButtonOn()` -- used in 0 specs
- `isAddToLibraryIconPresent(name, isMobileView = false)` -- used in 0 specs
- `isAddToLibraryIconPresent(name)` -- used in 0 specs
- `isAGDossierItemElementInViewport(dossierItemElem)` -- used in 0 specs
- `isAGGridColumnSelectHidden()` -- used in 0 specs
- `isAGGridSideBtnPresent(buttonLabel)` -- used in 0 specs
- `isAGGridTitlePresent(title)` -- used in 0 specs
- `isAIEnabled()` -- used in 0 specs
- `isAIEnabled(name)` -- used in 0 specs
- `isAIEnabledInInfoWindow()` -- used in 0 specs
- `isAIEnabledInListColumn(name)` -- used in 0 specs
- `isAllDatasetChecked()` -- used in 0 specs
- `isAllSelectionCheckboxChecked()` -- used in 0 specs
- `isAllTemplateCertified()` -- used in 0 specs
- `isAuthoringCloseButtonDisplayed()` -- used in 0 specs
- `isBackgroundBlurred()` -- used in 0 specs
- `isBlankTemplateSelected()` -- used in 0 specs
- `isBookmarkDropdownDisplayed()` -- used in 0 specs
- `isBookmarkEntryDisplayed()` -- used in 0 specs
- `isBookmarksGroupVisible()` -- used in 0 specs
- `isBotActive()` -- used in 0 specs
- `isBotCoverGreyedOut(name)` -- used in 0 specs
- `isBotCreateWithNewDataButtonVisible(text = 'Create with New Data')` -- used in 0 specs
- `isBotDatasetDisplayedInViewport(datasetName)` -- used in 0 specs
- `isBotEmbedIconPresent(name)` -- used in 0 specs
- `isBotInInfoWindowActive()` -- used in 0 specs
- `isBrowingExplorerDisplayed()` -- used in 0 specs
- `isCertifiedPresent()` -- used in 0 specs
- `isCertifiedPresent(name)` -- used in 0 specs
- `isCertifiedPresentInInfoWindow()` -- used in 0 specs
- `isClearAllEnabled()` -- used in 0 specs
- `isClearSearchIconDisplayed()` -- used in 0 specs
- `isCloseButtonVisible()` -- used in 0 specs
- `isCodeCoverageEnabled()` -- used in 0 specs
- `IsConditionalDisplayDialogButtonEnabled(buttonName)` -- used in 0 specs
- `isConfirmationDialogDisplay()` -- used in 0 specs
- `isConfirmSwitchProjectPopupDisplayed()` -- used in 0 specs
- `isCopyIconPresentInInfoWindow()` -- used in 0 specs
- `isCreateADCButtonDisplayed()` -- used in 0 specs
- `isCreateADCOptionPresent()` -- used in 0 specs
- `isCreateBotOptionPresent()` -- used in 0 specs
- `isCreateBotPresent()` -- used in 0 specs
- `isCreateButtonEnabled()` -- used in 0 specs
- `isCreateDashboardBtnPresent()` -- used in 0 specs
- `isCreateDashboardPresent()` -- used in 0 specs
- `isCreateDataModelBtnPresent()` -- used in 0 specs
- `isCreateNewButtonPresent()` -- used in 0 specs
- `isCreateNewDropdownOpen()` -- used in 0 specs
- `isCreateShortcutIconPresentInInfoWindow()` -- used in 0 specs
- `isCreateSnapshotPresentInContextMenu()` -- used in 0 specs
- `isCustomImageDisplayed(title)` -- used in 0 specs
- `isDataImportDialogPrepareDataButtonDisabled()` -- used in 0 specs
- `isDataImportDialogPresent()` -- used in 0 specs
- `isDataSelected(index)` -- used in 0 specs
- `isDatasetDisabledInDatasetPanel(dataset)` -- used in 0 specs
- `isDatasetDisplayedInViewport(datasetName)` -- used in 0 specs
- `isDatasetExistedInDatasetPanel(dataset)` -- used in 0 specs
- `isDataSetsOrderedByDateCreatedAscending()` -- used in 0 specs
- `isDateColumnSorted(sortOrder)` -- used in 0 specs
- `isDeleteIconPresentInInfoWindow()` -- used in 0 specs
- `isDossierContextMenuItemExisted(item)` -- used in 0 specs
- `isDossierDeprecated(dossierName)` -- used in 0 specs
- `isDossierDownloadIconPresent(name, isMobileView = false)` -- used in 0 specs
- `isDossierDownloadIconPresent(name)` -- used in 0 specs
- `isDossierEditIconPresent(name, isMobileView = false)` -- used in 0 specs
- `isDossierEditIconPresent(name)` -- used in 0 specs
- `isDossierIconGrayscale(dossierName)` -- used in 0 specs
- `isDossierImageDisplayed(title)` -- used in 0 specs
- `isDossierInactive(dossierName)` -- used in 0 specs
- `isDossierInfoIconPresent(name)` -- used in 0 specs
- `isDossierInLibrary(dossier)` -- used in 0 specs
- `isDossierNameInactiveSubstringPresent()` -- used in 0 specs
- `isDossierPendoContainerPresent()` -- used in 0 specs
- `isDossierPresent(dossierName)` -- used in 0 specs
- `isDossierPresent(name)` -- used in 0 specs
- `isDossierResetIconPresent(name, isMobileView = false)` -- used in 0 specs
- `isDossierResetIconPresent(name)` -- used in 0 specs
- `isDossierShareIconDisabled(name, isMobileView = false)` -- used in 0 specs
- `isDossierShareIconPresent(name, isMobileView = false)` -- used in 0 specs
- `isDossierShareIconPresent(name)` -- used in 0 specs
- `isDossiersListViewContainerPresent()` -- used in 0 specs
- `isDownloadDossierEnabled()` -- used in 0 specs
- `isDownloadDossierPresent()` -- used in 0 specs
- `isEditButtonPresentInIW()` -- used in 0 specs
- `isEditButtonVisible(bookmarkName)` -- used in 0 specs
- `isEditNameIconClickable(name)` -- used in 0 specs
- `isEmbeddedBotButtonPresent(name)` -- used in 0 specs
- `isEmbeddedBotIconPresentInSideContainer()` -- used in 0 specs
- `isEmbeddedBotPresent()` -- used in 0 specs
- `isEmptyContent()` -- used in 0 specs
- `isEmptyListPresent()` -- used in 0 specs
- `isEnabledForAIIconInactive()` -- used in 0 specs
- `isEnableForAIDisplayed()` -- used in 0 specs
- `isExportPDFPresent()` -- used in 0 specs
- `isExportToPDFIconPresent(name)` -- used in 0 specs
- `isFavoriteGroupVisible()` -- used in 0 specs
- `isFavoriteIconPresent(name)` -- used in 0 specs
- `isFavoritesBtnPresent()` -- used in 0 specs
- `isFavoritesIconPresent(name, isMobileView = false)` -- used in 0 specs
- `isFavoritesIconSelected(name)` -- used in 0 specs
- `isFavoritesPresent()` -- used in 0 specs
- `isFilterOptionSelected(option)` -- used in 0 specs
- `isFolderContextMenuExisted()` -- used in 0 specs
- `isFolderContextMenuItemExisted(item)` -- used in 0 specs
- `isFolderExist(folderName)` -- used in 0 specs
- `isFolderExpanded(folderName)` -- used in 0 specs
- `isFolderPanelOpened()` -- used in 0 specs
- `isFolderPathTruncated()` -- used in 0 specs
- `isHomeIconPresent()` -- used in 0 specs
- `isInfoIconDisplayed(title)` -- used in 0 specs
- `isInfoIconFocused(title)` -- used in 0 specs
- `isInfoWindowOpen()` -- used in 0 specs
- `isInputBoxEmpty()` -- used in 0 specs
- `isItemDisplayed(title)` -- used in 0 specs
- `isLibraryEmpty()` -- used in 0 specs
- `isLibraryIconPresent()` -- used in 0 specs
- `isLibraryIntroduction3Present()` -- used in 0 specs
- `isLibraryPendoContainerPresent()` -- used in 0 specs
- `isListViewInfoWindowPresent()` -- used in 0 specs
- `isListViewModeSelected()` -- used in 0 specs
- `isListViewModeSelectedMobile()` -- used in 0 specs
- `isLogoutPresent()` -- used in 0 specs
- `isManageAccessEnabled()` -- used in 0 specs
- `isManageAccessIconPresentInInfoWindow()` -- used in 0 specs
- `isManageAccessPresent()` -- used in 0 specs
- `isMobileInfoWindowOpened()` -- used in 0 specs
- `isMoreMenuIconPresentInInfoWindow()` -- used in 0 specs
- `isMoveIconPresentInInfoWindow()` -- used in 0 specs
- `isMultiSelectBtnActive()` -- used in 0 specs
- `isMultiSelectBtnPresent()` -- used in 0 specs
- `isNameColumnSorted(sortOrder)` -- used in 0 specs
- `isNavBarExpandBtnPresent()` -- used in 0 specs
- `isNavigationBarPresent()` -- used in 0 specs
- `isNewBotButtonPresent()` -- used in 0 specs
- `isNewDossierWindowCertifiedEnabled()` -- used in 0 specs
- `isNewFolderButtonDisplayed()` -- used in 0 specs
- `isNewQualificationEditorPresent()` -- used in 0 specs
- `isNewSecurityDialogPresent()` -- used in 0 specs
- `isNoDataDisplayed()` -- used in 0 specs
- `isNoDataScreenPresent()` -- used in 0 specs
- `isNotificationIconPresent()` -- used in 0 specs
- `isObjectIDPresentInInfoWindow()` -- used in 0 specs
- `isOnOriginalInfoWindowPage()` -- used in 0 specs
- `isOpen()` -- used in 0 specs
- `isOwnerColumnSorted(sortOrder)` -- used in 0 specs
- `isProjectGrayedOut()` -- used in 0 specs
- `isProjectSelectionWindowPresent()` -- used in 0 specs
- `isProjectSelectionWindowVisible()` -- used in 0 specs
- `isPromptOptionsInSaveAsEditorDisplayed()` -- used in 0 specs
- `isRecentlySearchedListPresent()` -- used in 0 specs
- `isRecentlySearchedResultEmpty()` -- used in 0 specs
- `isRecommendationListPresentInInfoWindow()` -- used in 0 specs
- `isRelatedContentTitlePresent()` -- used in 0 specs
- `isRemoveButtonEnabled()` -- used in 0 specs
- `isRemovePresent()` -- used in 0 specs
- `isRenameIconPresentInInfoWindow()` -- used in 0 specs
- `isRenameTextboxDisplayed()` -- used in 0 specs
- `isResetPresent()` -- used in 0 specs
- `isResultEmpty()` -- used in 0 specs
- `isRSDImageDisplayed(title)` -- used in 0 specs
- `isRunAsExcelIconPresent(name)` -- used in 0 specs
- `isRunAsPDFIconPresent(name)` -- used in 0 specs
- `isSaveOverwriteConfirmation()` -- used in 0 specs
- `isSearchIconPresent()` -- used in 0 specs
- `isSecondaryContextMenuItemDisabled(name)` -- used in 0 specs
- `isSecondaryContextMenuItemExisted(name)` -- used in 0 specs
- `isSectionPresent(section)` -- used in 0 specs
- `isSecurityFilterDialogPresent()` -- used in 0 specs
- `isSecurityFilterPresent()` -- used in 0 specs
- `isSelectAllEnabled()` -- used in 0 specs
- `isSelectedSidebarItem(item)` -- used in 0 specs
- `isSelectItemIconClickable(name)` -- used in 0 specs
- `isSessionTimeoutAlertDisplayed()` -- used in 0 specs
- `isSharedBookmark(bookmarkName)` -- used in 0 specs
- `isSharedBookmarkDisplayed()` -- used in 0 specs
- `isShareDisabled()` -- used in 0 specs
- `isShareIconPresentInInfoWindow()` -- used in 0 specs
- `isShareIconPresentInSideContainer()` -- used in 0 specs
- `isSharePresent()` -- used in 0 specs
- `isShortcutFolder(folderName)` -- used in 0 specs
- `isShortcutPresent(name)` -- used in 0 specs
- `isSidebarOpened()` -- used in 0 specs
- `isSingleSelectionCheckboxChecked(name)` -- used in 0 specs
- `isSmartExplorerDisplayed()` -- used in 0 specs
- `isSnapshotContentSectionPresent()` -- used in 0 specs
- `isSnapshotIconInBookmarkDropDownExisting()` -- used in 0 specs
- `isSnapshotIconInInfoWindowDisplayed()` -- used in 0 specs
- `isSnapshotSectionVisible()` -- used in 0 specs
- `isSortBarColumnActive(columnLabel)` -- used in 0 specs
- `isSortBarColumnActive(columnType)` -- used in 0 specs
- `isSortBarColumnAscending(columnLabel)` -- used in 0 specs
- `isSortBarColumnAscending(columnType)` -- used in 0 specs
- `isSortBarPresent()` -- used in 0 specs
- `isTagsDisplayed()` -- used in 0 specs
- `isTemplateHasCoverImageInGridView(templateName)` -- used in 0 specs
- `isTemplateHasCoverImageInListView(templateName)` -- used in 0 specs
- `isTemplateSelectedInGridView(templateName)` -- used in 0 specs
- `isTextHighlighted(text)` -- used in 0 specs
- `isTimestampDisplayed(title)` -- used in 0 specs
- `isTitleDisaplayed()` -- used in 0 specs
- `isToolPanelHidden()` -- used in 0 specs
- `isUpgradeButtonInSiderSectionPresent()` -- used in 0 specs
- `isUpgradeButtonInTrialBannerPresent()` -- used in 0 specs
- `isUploadBtnDisplayed()` -- used in 0 specs
- `isUserProfileDisplayed()` -- used in 0 specs
- `isViewCurtainPresent()` -- used in 0 specs
- `isViewModeSwitchPresent()` -- used in 0 specs
- `isWindowPrensent()` -- used in 0 specs
- `lastDossierName()` -- used in 0 specs
- `loadUntilRenderedAGGrid({ name, count = 0, attempt = 1 })` -- used in 0 specs
- `localSearch(text)` -- used in 0 specs
- `matchCount(option)` -- used in 0 specs
- `matchCount(section)` -- used in 0 specs
- `metricCount({ section, index })` -- used in 0 specs
- `metricCount(title)` -- used in 0 specs
- `moveFolderIntoView(folderName)` -- used in 0 specs
- `moveFolderIntoViewPort(folder)` -- used in 0 specs
- `moveTagIntoViewPort()` -- used in 0 specs
- `objectNameInResultItem({ title, object, objectIndex = 0 })` -- used in 0 specs
- `objectNameInResultItemByIndex({ section, index, objectIndex })` -- used in 0 specs
- `openBookmark(bookmarkName)` -- used in 0 specs
- `openBookmarkDropdown()` -- used in 0 specs
- `openBot(name)` -- used in 0 specs
- `openBotById({
        appId = 'C2B2023642F6753A2EF159A75E0CFF29', projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', botId, handleError = true, useDefaultApp = false, })` -- used in 0 specs
- `openBotByIdAndWait({
        appId = 'C2B2023642F6753A2EF159A75E0CFF29', projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', botId, })` -- used in 0 specs
- `openBotByUrl(url, handleError = true)` -- used in 0 specs
- `openBotNoWait(name)` -- used in 0 specs
- `openConditionalDisplayDialog()` -- used in 0 specs
- `openConditionalRelationDropdown(option)` -- used in 0 specs
- `openContextMenu(name)` -- used in 0 specs
- `openContextMenu(objectName)` -- used in 0 specs
- `openCreateNewBotDialog()` -- used in 0 specs
- `openDashboardFormatting()` -- used in 0 specs
- `openDashboardFormattingMenu()` -- used in 0 specs
- `openDefaultZoomDropDown()` -- used in 0 specs
- `openDocumentNoWait(name)` -- used in 0 specs
- `openDossier(name, owner = null)` -- used in 0 specs
- `openDossierById({ projectId, dossierId, applicationId = null }, handleError = true)` -- used in 0 specs
- `openDossierByUrl(url, handleError = true)` -- used in 0 specs
- `openDossierContextMenuNoWait(name)` -- used in 0 specs
- `openDossierFromRecommendationsList(dossierName)` -- used in 0 specs
- `openDossierWithKeyboard(name)` -- used in 0 specs
- `OpenElementMenu(option)` -- used in 0 specs
- `openFirstBot()` -- used in 0 specs
- `openFolder(folderName)` -- used in 0 specs
- `openFolderFromFolderPath(folderName)` -- used in 0 specs
- `openFolderPanel()` -- used in 0 specs
- `openFormatMenu()` -- used in 0 specs
- `openFromContextMenuForFloder(folderName, item)` -- used in 0 specs
- `openInfoWindowInTeams(objectName)` -- used in 0 specs
- `openInvalidUrl(suffix, libraryUrl = browser.options.baseUrl)` -- used in 0 specs
- `openItemInAuthoring()` -- used in 0 specs
- `openManageAccessDialog()` -- used in 0 specs
- `openNewConditionDialog(option)` -- used in 0 specs
- `openPreferencePanel()` -- used in 0 specs
- `openReportByUrl({ projectId, documentId, prompt = false, noWait = false })` -- used in 0 specs
- `openSearchBox()` -- used in 0 specs
- `openShareFromListView(name)` -- used in 0 specs
- `openSidebar(hasSubmenu = false)` -- used in 0 specs
- `openSnapshotById({
        appId = 'C2B2023642F6753A2EF159A75E0CFF29', projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', objectId, messageId, handleError = true, useDefaultApp = true, })` -- used in 0 specs
- `openSnapshotByUrl(url, handleError = true)` -- used in 0 specs
- `openSnapshotFromInfoWindow({ name, index = 0 })` -- used in 0 specs
- `openUrlWithPage(projectID, documentID, pageID, libraryUrl = browser.options.baseUrl)` -- used in 0 specs
- `performanceData(actionList)` -- used in 0 specs
- `recentlySearchedItem(index)` -- used in 0 specs
- `recentlySearchedItemCount()` -- used in 0 specs
- `removeColumnByByTickCheckbox(posIndex)` -- used in 0 specs
- `removeColumnByNameList(nameList)` -- used in 0 specs
- `removeDossier()` -- used in 0 specs
- `removeFavorite()` -- used in 0 specs
- `removeFavoriteByImageIcon(name)` -- used in 0 specs
- `renameBookmark(bookmarkName, newName)` -- used in 0 specs
- `renameBookmarkWithoutEnter(bookmarkName, newName)` -- used in 0 specs
- `renameDossier(newName)` -- used in 0 specs
- `renameDossierInGrid(newName)` -- used in 0 specs
- `renameFolder(newName)` -- used in 0 specs
- `renderNextBlockAGGrid(count)` -- used in 0 specs
- `resetFromInfoWindow(wait = true)` -- used in 0 specs
- `resetLocalStorage()` -- used in 0 specs
- `resetToLibraryHome()` -- used in 0 specs
- `resultItem({ section, index })` -- used in 0 specs
- `rightClickToOpenContextMenu({ name, isMobileView = false, isWaitCtxMenu = true })` -- used in 0 specs
- `rightClickToOpenContextMenu(folderName, isWaitCtxMenu = true)` -- used in 0 specs
- `rightClickToOpenContextMenuByIndex(index)` -- used in 0 specs
- `saveAsDashboard(dashboardName)` -- used in 0 specs
- `saveCoverImage()` -- used in 0 specs
- `saveDashboard(dashboardName)` -- used in 0 specs
- `saveDashboardInMyReports(dashboardName)` -- used in 0 specs
- `saveDashboardProperties()` -- used in 0 specs
- `saveInMyReport(name, path)` -- used in 0 specs
- `saveNewSecurity()` -- used in 0 specs
- `saveSecurityFilterDialog()` -- used in 0 specs
- `saveTags()` -- used in 0 specs
- `saveToFolder(name, path, parentFolder = 'Shared Reports')` -- used in 0 specs
- `saveUnstructuredDataToMD(path)` -- used in 0 specs
- `scrollDatasetListsToBottom()` -- used in 0 specs
- `scrollSnapshotPanelToBottom()` -- used in 0 specs
- `scrollSnapshotPanelToTop()` -- used in 0 specs
- `scrollToBottom()` -- used in 0 specs
- `scrollToBottomAGGrid()` -- used in 0 specs
- `scrollToBottomFolderTree()` -- used in 0 specs
- `scrollToTopFolderTree()` -- used in 0 specs
- `searchData(inputText)` -- used in 0 specs
- `searchDataSet(string)` -- used in 0 specs
- `searchForDataByName(name)` -- used in 0 specs
- `searchSelectAndCreateDossier(datasetArray)` -- used in 0 specs
- `searchString()` -- used in 0 specs
- `searchTemplate(inputText)` -- used in 0 specs
- `selectConditionRelation(option)` -- used in 0 specs
- `selectDatasetAfterSelectBotTemplate(dataset)` -- used in 0 specs
- `selectDataSetByName(datasetName)` -- used in 0 specs
- `selectDatasets(datasets, create = false)` -- used in 0 specs
- `selectDemoImageByIndex(index)` -- used in 0 specs
- `selectDossier(name)` -- used in 0 specs
- `selectedFolder()` -- used in 0 specs
- `selectedItemCount()` -- used in 0 specs
- `selectedProject()` -- used in 0 specs
- `selectElementInList(option)` -- used in 0 specs
- `selectExecutionMode()` -- used in 0 specs
- `selectItemInListView(name)` -- used in 0 specs
- `selectMaximizeVisualizationCurrentPanel()` -- used in 0 specs
- `selectMaximizeVisualizationEntireDashboard()` -- used in 0 specs
- `selectMaximizeVisualizationMode(optionLabel)` -- used in 0 specs
- `selectNewConditionElement(option)` -- used in 0 specs
- `selectPauseMode()` -- used in 0 specs
- `selectProjectAndADCAndDataset(project, dataset, preview = false)` -- used in 0 specs
- `selectProjectAndAIBots(project, datasets, skipProject = false)` -- used in 0 specs
- `selectProjectAndDataset(project, dataset)` -- used in 0 specs
- `selectProjectAndReport(project, report)` -- used in 0 specs
- `selectProjectAndUnstructuredData(project, unstructuredData)` -- used in 0 specs
- `selectProjectAndUnstructuredDataPanel(project)` -- used in 0 specs
- `selectReportCube({ name, index = 0, isWait = true })` -- used in 0 specs
- `selectSampleFileByIndex(index)` -- used in 0 specs
- `selectSubBotInUnversalBot(subbots)` -- used in 0 specs
- `selectTemplate(templateName)` -- used in 0 specs
- `selectUnstructuredData(unstructuredData)` -- used in 0 specs
- `selectViewMode(isPauseMode = true)` -- used in 0 specs
- `shareBookmark(bookmarkName)` -- used in 0 specs
- `ShowOrHideColumns(columnNames)` -- used in 0 specs
- `ShowOrHideColumnsSetting()` -- used in 0 specs
- `simpleSaveDashboard()` -- used in 0 specs
- `sortDataByHeaderName(headerName)` -- used in 0 specs
- `sortOption()` -- used in 0 specs
- `sortTemplateByHeaderName(headerName)` -- used in 0 specs
- `switchAddDataTab(tab)` -- used in 0 specs
- `switchProjectByName(projectName)` -- used in 0 specs
- `switchSortOrder()` -- used in 0 specs
- `switchTabViewer(type)` -- used in 0 specs
- `switchToCubesTab(language = Locales.English)` -- used in 0 specs
- `switchToDatasetTab()` -- used in 0 specs
- `switchToGridView()` -- used in 0 specs
- `switchToListView()` -- used in 0 specs
- `switchToMdxSourceTab(language = Locales.English)` -- used in 0 specs
- `switchToOption(option)` -- used in 0 specs
- `switchToProject(newProjectName)` -- used in 0 specs
- `switchToReportTab()` -- used in 0 specs
- `switchToSmarkMode()` -- used in 0 specs
- `switchToSmartMode()` -- used in 0 specs
- `switchToTemplateTab(language = Locales.English)` -- used in 0 specs
- `switchToTreeMode()` -- used in 0 specs
- `toggleCertifiedOnlyForData()` -- used in 0 specs
- `toggleCertifiedOnlyForTemplate()` -- used in 0 specs
- `toggleNewDossierCertifiedSwitch()` -- used in 0 specs
- `unfavoriteBookmarks(bookmarkNames)` -- used in 0 specs
- `uploadUnstructuredData(filePaths)` -- used in 0 specs
- `uploadUnstructuredFileFromDisk(filePath)` -- used in 0 specs
- `visualizationCount(title)` -- used in 0 specs
- `waitForAddDataSelectionWindowAppear()` -- used in 0 specs
- `waitForAddUnstructuredDataDialogAppear()` -- used in 0 specs
- `waitForAllUnstructuredFileUploadComplete(timeout = 180000)` -- used in 0 specs
- `waitForDataPreviewWindowAppear()` -- used in 0 specs
- `waitForDMCurtainDisappear()` -- used in 0 specs
- `waitForEditDataModelLoading()` -- used in 0 specs
- `waitForEnableAIReady(name)` -- used in 0 specs
- `waitForInfoIconAppear()` -- used in 0 specs
- `waitForNewDataModelLoading()` -- used in 0 specs
- `waitForNoSubscriptionButton()` -- used in 0 specs
- `waitForPendoGuide()` -- used in 0 specs
- `waitForProgressBarGone()` -- used in 0 specs
- `waitForProjectSelectionWindowAppear()` -- used in 0 specs
- `waitForSecurityFilterLoading()` -- used in 0 specs
- `waitForSnapshotSection()` -- used in 0 specs
- `waitForUnstructuredFileUploadComplete(filename, timeout = 180000)` -- used in 0 specs
- `waitLibraryLoadingDisplayedAndThenNotDisplayed(seconds = 10)` -- used in 0 specs
- `waitLibraryLoadingIsNotDisplayed(seconds = 10)` -- used in 0 specs
- `waitTemplateLoading()` -- used in 0 specs

## Source Coverage

- `pageObjects/library/**/*.js`
- `specs/regression/library/**/*.{ts,js}`
- `specs/regression/config/libraryVisualization/**/*.{ts,js}`
- `specs/regression/libraryExport/**/*.{ts,js}`
- `specs/regression/libraryVisualizations/**/*.{ts,js}`
- `specs/regression/libraryVisualizations/autoNarratives/**/*.{ts,js}`
- `specs/regression/libraryVisualizations/forecast/**/*.{ts,js}`
- `specs/regression/libraryVisualizations/keyDriver/**/*.{ts,js}`
- `specs/regression/libraryVisualizations/trend/**/*.{ts,js}`
- `specs/regression/libraryVisualizations/vizCommon/**/*.{ts,js}`
