# Site Knowledge: Export Domain

## Overview

- **Domain key:** `export`
- **Components covered:** ExportExcelDialog, ExportNotification, ExportToCSV, ExportToExcel, LibraryAuthoringExcelExport, LibraryAuthoringPDFExport, PDFExport, SubscriptionDialog, SubscriptionManagement
- **Spec files scanned:** 50
- **POM files scanned:** 9

## Components

### ExportExcelDialog
- **CSS root:** `.mstrd-ExportExcelDialog`
- **User-visible elements:**
  - Export Excel Panel (`.mstrd-ExportExcelDialog`)
- **Component actions:**
  - `clickExportButton()`
- **Related components:** getExportExcelPanel

### ExportNotification
- **CSS root:** `.ant-notification.ant-notification-bottomRight`
- **User-visible elements:**
  - Export Complete Notification (`.ant-notification.ant-notification-bottomRight`)
- **Component actions:**
  - `clickExportCompleteCloseButton()`
  - `getExportCompleteDescriptionText()`
  - `isExportCompleteCloseButtonVisible()`
  - `isExportCompleteNotificationVisible()`
- **Related components:** _none_

### ExportToCSV
- **CSS root:** `.mstrd-ExportPanel-options`
- **User-visible elements:**
  - Context Menu (`.mstrd-ContextMenu.mstrd-DossierContextMenu`)
  - CSVDelimiter Dropdown (`label=Delimiter`)
  - CSVRange Setting (`label=Range`)
  - Delimiter Input (`.mstrd-ExportPanel-options`)
  - Export CSVPanel (`.mstrd-DossierCsvPanel`)
  - Info Window CSVExport Dialog (`.mstrd-ExportPanelInLibrary-content`)
  - Info Window Export Button (`.mstrd-ExportPanelInLibrary-submitButton`)
  - IWExport CSVButton (`.mstr-menu-icon.icon-share_csv`)
  - Range All (`.mstrd-Tree-all .mstrd-TriStateCheckbox`)
  - Range Drop Down Contents (`.mstrd-DropDown-content`)
  - Report Csv Panel (`.mstrd-ReportCsvPanel`)
- **Component actions:**
  - `clickArrowByChapterName(name)`
  - `clickCheckboxByChapterName(name)`
  - `clickCheckboxByPageName(name)`
  - `clickCSVDelimiterDropdown()`
  - `clickCSVRangeSetting()`
  - `clickDelimiterOption(option)`
  - `clickExpandPageByCheckbox()`
  - `clickExportButton()`
  - `clickExportCSVButton()`
  - `clickExportPageByInfoCheckbox()`
  - `clickExportToCsvItemInContextMenu()`
  - `clickInfoWindowExportButton()`
  - `clickOnlyByChapterName(name)`
  - `clickOnlyByPageName(name)`
  - `clickRangeAll()`
  - `clickRangeDropdown()`
  - `clickReportExportButton()`
  - `clickTitlebarExportCSVButton(vizName)`
  - `hoverOnContextMenuShareItem()`
  - `inputDelimiter(option)`
- **Related components:** getCheckboxByPage, getExpandPage, getExportCSVPanel, getExportPage, getOnlyButtonByPage, getPage, getReportCsvPanel

### ExportToExcel
- **CSS root:** `.mstrd-DossierExcelPanel`
- **User-visible elements:**
  - Excel Contents (`label=Contents`)
  - Excel Contents Setting (`label=Contents`)
  - Excel Drop Down Contents (`.mstrd-DropDown-content`)
  - Excel Range (`label=Range`)
  - Excel Range Setting (`label=Range`)
  - Excel Range Settings (`.mstrd-ExcelExportPagesSetting`)
  - Export Excel Panel (`.mstrd-DossierExcelPanel`)
  - Export Excel Panel Content (`.mstrd-ExportPanelInLibrary-content`)
  - Export Excel Settings Panel (`.mstrd-DossierExcelPanel`)
  - Info Window Export Excel Button (`.mstrd-ExportPanelInLibrary-buttons`)
  - Info Window Report Export Button (`.mstrd-ExportPanelInLibrary-submitButton`)
  - Loading Button (`.mstrd-Spinner-blade`)
  - Report Export Excel Settings Panel (`.mstrd-ReportExcelPanel`)
  - Report Export To Excel Dialog (`.mstrd-ReportExcelPanel`)
  - Report IWExport Cancel (`.mstrd-ReportExcelPanelInLibrary`)
  - Report More Settings Arrow (`.mstrd-ExportPanel-options .mstrd-ExportForm-collapsibleArea .icon-menu-arrow`)
  - RSDExport Excel Panel (`.mstrd-MenuPanel.mstrd-DocumentExcelPanel`)
  - Show Filters Checkbox (`.mstrd-Checkbox-shape.icon-checkmark`)
  - Viz List (`.mstrd-DossierExcelForm-vizList`)
  - Vizualization Export Excel Dialog (`.mstrd-ExportExcelDialog`)
- **Component actions:**
  - `_selectDropDownItemOption({ dropDownOption, dropDownItems })`
  - `clickArrowByChapterName(name)`
  - `clickCheckboxByChapterName(name)`
  - `clickCheckboxByPageName(name)`
  - `clickExportButton()`
  - `clickExportReportTitleCheckbox()`
  - `clickInfoWindowExportButton()`
  - `clickInfoWindowReportExportButton()`
  - `clickLibraryExportButton()`
  - `clickOnlyByChapterName(name)`
  - `clickOnlyByPageName(name)`
  - `clickReportExportPageByInfoCheckbox()`
  - `clickReportIWExportCancelButton()`
  - `clickReportMoreSettings()`
  - `clickReportShareMenuExportButton()`
  - `clickRSDExportButton()`
  - `clickShareMenuExportButton()`
  - `clickShowFiltersCheckbox()`
  - `clickTitlebarExportExcelButton(vizName)`
  - `clickVisualizationExportButton()`
  - `hoverOnGrid(gridName)`
  - `isExportDisabled()`
  - `isLibraryExportExcelWindowOpen()`
  - `isVizualizationExportExcelDialogwOpen()`
  - `openExcelContentsSetting()`
  - `openExcelRangeSetting()`
  - `selectExcelContents(content)`
  - `selectExcelRange(dropDownOption)`
  - `selectGrid(gridName)`
  - `selectGridOnly(gridName)`
  - `waitForExportComplete(appearTimeout = 10000)`
  - `waitForExportLoadingButtonToDisappear(timeout = 60000)`
- **Related components:** _getDropDownContainer, getCheckboxByPage, getExportExcelPanel, getExportExcelSettingsPanel, getOnlyButtonByPage, getPage, getReportExportExcelSettingsPanel, getReportExportPage, getRSDExportExcelPanel

### LibraryAuthoringExcelExport
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickOKButton()`
  - `clickReactDropdownOption(dropdownLabel, optionText)`
  - `clickReactShowFiltersCheckbox()`
  - `clickShowFiltersCheckbox()`
  - `openContentDropdown()`
  - `openRangeDropdown()`
  - `selectExcelContent(option)`
  - `selectExcelRange(option)`
- **Related components:** _none_

### LibraryAuthoringPDFExport
- **CSS root:** `.mstr-docprops-container`
- **User-visible elements:**
  - Export Preview (`.mstrmojo-vi-ui-rw-DashboardPrintLayout-page`)
  - Format Color Picker (`.color-picker-arrow-button`)
  - Format Font Size Input (`.ant-input-number-input`)
  - Format Image Input Box (`.ant-input`)
  - Format Image OKBtn (`.abaloc-button-editurl .ant-btn`)
  - Landscape Button (`.mstrmojo-DashboardPdfSettings-landscape`)
  - Margin Bottom Textbox (`.mstrmojo-DashboardPdfSettings-marginIconBottom`)
  - Margin Left Textbox (`.mstrmojo-DashboardPdfSettings-marginIconLeft`)
  - Margin Right Textbox (`.mstrmojo-DashboardPdfSettings-marginIconRight`)
  - Margin Top Textbox (`.mstrmojo-DashboardPdfSettings-marginIconTop`)
  - Mojo Pdf Export Settings (`.mstrmojo-RootView-exportControl`)
  - PDFSettings (`.mstrmojo-DocProps-Editor-PdfSettings`)
  - Portrait Button (`.mstrmojo-DashboardPdfSettings-portrait`)
  - React Margin Bottom Textbox (`.mstr-docprops-shared-customMargin`)
  - React Margin Left Textbox (`.mstr-docprops-shared-customMargin`)
  - React Margin Right Textbox (`.mstr-docprops-shared-customMargin`)
  - React Margin Top Textbox (`.mstr-docprops-shared-customMargin`)
  - React Show Filter Dropdown (`.mstr-docprops-container`)
  - Zoom In Icon (`.mstrmojo-vi-ui-DashboardExportPanel-zoomIn`)
  - Zoom Input Box (`.mstrmojo-vi-ui-DashboardExportPanel-scaleControl .mstrmojo-TextBox`)
  - Zoom Out Icon (`.mstrmojo-vi-ui-DashboardExportPanel-zoomOut`)
  - Zoom Slider Icon (`.sd .t2`)
- **Component actions:**
  - `clickAdjustMarginCheckbox()`
  - `clickAdvanceModeCancelButton()`
  - `clickAdvanceModeOkButton()`
  - `clickCustomizedDropdown(option)`
  - `clickDropdownOption(dropdownLabel, optionText)`
  - `clickExpandGridCheckbox()`
  - `clickExtenColumnsOverPagesRadio()`
  - `clickFooterCustomizedDropdown(option)`
  - `clickLandscapeButton()`
  - `clickLockButton(option)`
  - `clickOKButton()`
  - `clickPortraitButton()`
  - `clickReactAdjustMarginCheckbox()`
  - `clickReactAdvanceMode()`
  - `clickReactDropdownOption(dropdownLabel, optionText)`
  - `clickReactExpandGridCheckbox()`
  - `clickReactLandscapeButton()`
  - `clickReactLockButton(option)`
  - `clickReactPaperSizeDropdownOption(dropdownLabel, optionText)`
  - `clickReactPortraitButton()`
  - `clickReactScaleGridCheckbox()`
  - `clickReactShowTableOfContentsCheckbox()`
  - `clickReactVizExportButton()`
  - `clickRepeatColumnsCheckbox()`
  - `clickScaleGridCheckbox()`
  - `clickScaleToPageWidthRadio()`
  - `clickShowFiltersCheckbox()`
  - `clickShowHeaderCheckbox()`
  - `clickShowPageNumbersCheckbox()`
  - `clickShowTableOfContentsCheckbox()`
  - `clickZoomInIcon()`
  - `clickZoomOutIcon()`
  - `customizeHeaderFooterWithImage(index)`
  - `customizeHeaderFooterWithText(index, text)`
  - `dragZoomSlider(direction, pixels)`
  - `inputZoomValue(value)`
  - `openContentDropdown()`
  - `openPaperSizeDropdown()`
  - `openRangeDropdown()`
  - `openReactShowFilterDropdown()`
  - `openShowFilterDropdown()`
  - `selectCenterCustomizedOptions(option1, option2)`
  - `selectCustomizedSetting(option)`
  - `selectExportToPDFOnVisualizationMenu(title)`
  - `selectFilteroption(option)`
  - `selectFormatSegmentControl(option)`
  - `selectLeftCustomizedDropdown(option)`
  - `selectLeftCustomizedOptions(option1, option2)`
  - `selectPaperSize(option)`
  - `selectPDFContent(option)`
  - `selectPDFRange(option)`
  - `selectReactFilteroption(option)`
  - `selectRightCustomizedOptions(option1, option2)`
  - `setCenterCustomizedImage(option, image)`
  - `setCenterCustomizedText(option, text)`
  - `setFontColor(index)`
  - `setFontHorizontalAlignment(index)`
  - `setFontSize(value)`
  - `setFontStyle(index)`
  - `setFontVerticalAlignment(index)`
  - `setFooterCenterCustomizedText(option, text)`
  - `setFooterLeftCustomizedText(option, text)`
  - `setFooterRightCustomizedText(option, text)`
  - `setLeftCustomizedImage(option, image)`
  - `setLeftCustomizedText(option, text)`
  - `setMarginBottom(marginBottom)`
  - `setMarginLeft(marginLeft)`
  - `setMarginRight(marginRight)`
  - `setMarginTop(marginTop)`
  - `setReactMarginBottom(marginBottom)`
  - `setReactMarginLeft(marginLeft)`
  - `setReactMarginRight(marginRight)`
  - `setReactMarginTop(marginTop)`
  - `setRightCustomizedImage(option, image)`
  - `setRightCustomizedText(option, text)`
- **Related components:** getExtenColumnsOverPage, getScaleToPage, getShowPage

### PDFExport
- **CSS root:** `.mstrd-ExportDetailsPanel-buttonContainer, .mstrd-ExportDetailsPanelInLibrary-buttons`
- **User-visible elements:**
  - Advanced Settings Button (`.mstrd-ExportDetailsPanel-advancedSettingBarText`)
  - Advanced Settings Panel (`.mstrd-ExportDetailsPanel-advancedSettingsPanel`)
  - CSVExport Icon (`.icon-share_csv.mstr-menu-icon`)
  - Detail Level Settings (`.mstrd-ExportContentSetting`)
  - Dossier Export PDFPanel (`.mstrd-ExportDetailsPanel`)
  - Excel Export Icon (`.icon-share_excel.mstr-menu-icon`)
  - Expand All Grid Data Check Box (`.mstrd-ExportGrid-item-expandGrid`)
  - Export Button Container (`.mstrd-ExportDetailsPanel-buttonContainer, .mstrd-ExportDetailsPanelInLibrary-buttons`)
  - Export Is Complete Notification (`.ant-notification.ant-notification-bottomRight`)
  - Export Loading Spinner (`.mstrd-Spinner`)
  - Export Page Info (`.mstrd-ExportPageInfo`)
  - Filter Summary Settings (`.mstrd-ExportFilterSummary`)
  - Filter Summary Tab Options View (`.mstrd-ExportFilterSummary`)
  - Google Sheets Export Icon (`.icon-share_google_sheets.mstr-menu-icon`)
  - Grid Settings (`.mstrd-ExportGrid`)
  - Header Check Box (`.mstrd-ExportPageInfo`)
  - Library Export PDFWindow (`.mstrd-ExportDetailsPanelInLibrary`)
  - Margin Option (`.mstrd-ExportMarginOptions`)
  - Mojo PDFExport Display Option (`.mstrmojo-Box.displayOption`)
  - Mojo PDFExport Settings Editor (`.mstrmojo-ExportPDFEditor`)
  - More Settings Button (`.mstrd-ExportDetailsPanel-moreSettingsTitle`)
  - Orientation (`.mstrd-ExportOrientationSetting-body`)
  - Page Numbers Check Box (`.mstrd-ExportPageInfo`)
  - Page Size Settings (`.mstrd-ExportPagerSizeSetting`)
  - Paper Size Drop Down Button (`.mstrd-ExportPagerSizeSetting-dropdown .mstrd-DropDownBox-selected`)
  - PDFExport Icon (`.mstr-menu-icon.icon-share_pdf`)
  - PDFRange (`label=Range`)
  - PDFRange Setting (`label=Range`)
  - Range All (`.mstrd-Tree-all .mstrd-TriStateCheckbox`)
  - Range Drop Down Contents (`.mstrd-ExportDetailsPanel-options`)
  - Repeat Attribute Columns Check Box (`.mstrd-ExportGrid-item-repeatColumn`)
  - Report Export PDFPanel (`.mstrd-MenuPanel.mstrd-ReportPdfPanel`)
  - RSDExport Dialog (`.mstrd-MenuPanel.mstrd-ExportDetailsPanel`)
  - RSDRange Drop Down Contents (`.mstrd-DropDown-content`)
  - RSDVisualization Menu (`.mstrmojo-Button.mstrmojo-oivmSprite.tbDown`)
  - Share Spinning Icon (`.mstrd-spinner-export`)
  - Tableof Contents Check Box (`.mstrd-ExportPageInfo`)
- **Component actions:**
  - `_clickCheckbox(elem)`
  - `_isCheckBoxSelected(elem)`
  - `_isDropDownListOpen(elem)`
  - `_isOrientationButtonSelected(orientationButton)`
  - `_selectDropDownItemOption({ dropDownOption, dropDownItems })`
  - `cancelExportSettingsVisualization()`
  - `clickAdjuectMarginCheckbox()`
  - `clickArrowByChapterName(name)`
  - `clickCheckboxByChapterName(name)`
  - `clickCheckboxByPageName(name)`
  - `clickContextMenu(el, prompted = false)`
  - `clickExpandGridCheckbox()`
  - `clickExpandPageBy()`
  - `clickMenuOptionInLevel({ level, option }, prompted = false)`
  - `clickMoreSettings()`
  - `clickOnlyByChapterName(name)`
  - `clickOnlyByPageName(name)`
  - `clickPDFRangeSetting()`
  - `clickRangeAll()`
  - `clickRangeDropdown()`
  - `clickReportShareMenuExportButton()`
  - `clickScaleGridCheckbox()`
  - `clickTitlebarExportPDFButton(vizName)`
  - `clickVizExportButton()`
  - `close()`
  - `closeExportCompleteNotification()`
  - `deselectCheckBox(elem)`
  - `detailLevelSelectedItem()`
  - `exportByTab()`
  - `ExportDocumentSingleVisualization(type)`
  - `exportSubmitDossier()`
  - `exportSubmitLibrary()`
  - `exportSubmitPrompt()`
  - `exportSubmitVisualization()`
  - `FilterSummarySelectedItem()`
  - `isAutoOrientationButtonSelected()`
  - `isDossierExportPDFSettingsWindowOpen()`
  - `isExportCompleteNotificationPresent()`
  - `isExportIndvlVizsCheckBoxSelected()`
  - `isExportLoadingSpinnerPresent()`
  - `isExporttoCSVPresent()`
  - `isExporttoExcelPresent()`
  - `isExporttoGoogleSheetsPresent()`
  - `isExporttoPDFPresent()`
  - `isFilterSummaryTabSelected()`
  - `isFooterCheckBoxEnabled()`
  - `isHeaderCheckBoxEnabled()`
  - `isHeaderCheckBoxSelected()`
  - `isLandScapeOrientationButtonSelected()`
  - `isLayoutTabSelected()`
  - `isLibraryExportPDFSettingsWindowOpen()`
  - `isPageNumbersCheckBoxSelected()`
  - `isPortraitOrientationButtonSelected()`
  - `isRangeDropDownListOpen()`
  - `isRepeatAttributeColumnsEnabled()`
  - `isRSDExportButtonPresent(title)`
  - `isRSDExportTypePresent(type)`
  - `isRSDRangeDropDownListOpen()`
  - `isVisExportPDFSettingsWindowOpen()`
  - `openAdvancedSettingsPanel()`
  - `OpenDocumentSingleVisualizationMenuButton(title)`
  - `openRangeDialog()`
  - `openRSDVisualizationMenu()`
  - `openVisualizationMenu({ elem, offset })`
  - `pageSizeSelectedItem()`
  - `selectCheckBox(elem, shouldDeselect = false)`
  - `selectContentDropDownItemOption(dropDownOption)`
  - `selectDetailLevel(dropDownOption)`
  - `selectExportToPDFOnVisualizationMenu(title)`
  - `selectFilterSummary(dropDownOption)`
  - `selectGridSettings(buttonName)`
  - `selectMojoFilterSummary(dropDownOption)`
  - `selectMojoOrientation(option)`
  - `selectMojoPageSize(dropDownOption)`
  - `selectPageSize(dropDownOption)`
  - `selectPaperSizeDropDownItemOption(dropDownOption)`
  - `selectRange(option)`
  - `selectVisualizationMenuOptions({ elem, offset, firstOption, secondOption, thirdOption })`
  - `setMarginBottom(marginBottom)`
  - `setMarginLeft(marginLeft)`
  - `setMarginRight(marginRight)`
  - `setMarginTop(marginTop)`
  - `toggleExpandAllGridDataCheckBox()`
  - `toggleFilterSummaryCheckBox()`
  - `toggleHeaderCheckBox()`
  - `toggleMojoGridRepeatColumns()`
  - `toggleMojoGridSettings(option)`
  - `toggleMojoShowHeader()`
  - `toggleMojoShowPageNumber()`
  - `togglePageNumbersCheckBox()`
  - `toggleRepeatAttributeColumnsCheckBox()`
  - `toggleTableofContentsCheckBox()`
  - `waitForExportComplete({ name, fileType })`
- **Related components:** _getDropDownContainer, _getExportButtonContainer, _getMojoDropDownContainer, getAdvancedSettingsPanel, getCheckboxByPage, getDossierExportPDFPanel, getExpandPage, getMojoShowPage, getOnlyButtonByPage, getPage, getReportExportPDFPanel

### SubscriptionDialog
- **CSS root:** `.mstrd-SubscriptionContentSettings-bookmark`
- **User-visible elements:**
  - Add New Address Button (`.mstrd-RecipientComboBox-addNew`)
  - Address Cancel Button (`.mstrd-PersonalAddressEditor .mstrd-Button--secondary`)
  - Address Name Text Box (`.mstrd-PersonalAddressEditor .mstrd-Input:not([type])`)
  - Advanced Settings Dialog (`.mstrd-SubscriptionAdvancedSettings-main `)
  - All Checkbox Status (`.mstrd-Tree-all`)
  - Bookmark Dropdown (`.mstrd-SubscriptionContentSettings-bookmark`)
  - Bookmark Picker Container (`.mstrd-SubscriptionContentSettings-bookmark`)
  - Bookmark Textbox (`.mstrd-SubscriptionContentSettings-newBookmarkName`)
  - Clear All Filters Button (`.mstrd-BaseFilterPanel-clearBtn`)
  - Compress Zip Checkbox (`.mstrd-SubscriptionAdvancedCompressionSettings`)
  - Content Panel (`.mstrd-Dialog-content`)
  - Content Settings Section (`.mstrd-SubscriptionForm.mstrd-SubscriptionContentSettings`)
  - Delivery Dialog (`.mstrd-SubscriptionDeliverySettings`)
  - Delivery Settings Section (`.mstrd-SubscriptionDeliverySettings`)
  - Dialog Panel (`.mstrd-SubscriptionDialog-panel`)
  - Filters Apply Button (`.mstrd-BaseFilterPanel-applyBtn`)
  - Format Option Dropdown (`label=Format`)
  - FTPSettings Dialog (`.mstrd-SubscriptionForm.mstrd-SubscriptionFTPSettings`)
  - Info Window Edit (`.mstr-menu-icon.icon-subscrip_edit`)
  - Info Window Subscription Panel (`.mstrd-SubscriptionInfo`)
  - Loading Button (`.mstrd-Spinner-blade`)
  - Prompt Button (`.mstrd-SubscriptionForm-enterButton`)
  - Prompt Dialog (`.mstrd-SubscriptionDialog--prompt`)
  - Recipients Settings Section (`.mstrd-SubscriptionRecipientSettings`)
  - Recipient Textbox (`.mstrd-CapsuleComboBox-value`)
  - Schedule Options Dialog (`.mstrd-SubscriptionDeliverySettings-schedule`)
  - Schedule Selector Dropdown (`.mstrd-CapsuleComboBox-popup`)
  - Subscribe Button (`.mstrd-Dialog-buttonArea`)
  - Subscription Empty Content (`.mstrd-EmptyContent`)
  - Subscription Name (`.mstrd-SubscriptionTopSettings-name .mstrd-Input`)
  - Subscription Name Edit Button (`.mstrd-SubscriptionTopSettings-name`)
  - Subscription Panel (`.mstrd-SubscriptionDialog`)
  - View Summary Toggle (`.mstrPromptEditorSwitchSummary > label`)
- **Component actions:**
  - `addRecipient(name)`
  - `clickAddNewAddressButton()`
  - `clickAddressCancelButton()`
  - `clickAddressNameTextBox()`
  - `clickAdvancedSettingsButton()`
  - `clickAllowChangeDeliveryCheckbox()`
  - `clickAllowChangePersonalizationCheckbox()`
  - `clickAllowUnsubscribeCheckbox()`
  - `clickApplyButton()`
  - `clickArrowByChapterName(name)`
  - `clickBackButton()`
  - `clickCheckboxByChapterName(name)`
  - `clickCheckboxByPageName(name)`
  - `clickCheckboxByPageName(name)`
  - `clickClearAllButton()`
  - `clickClearAllFiltersButton()`
  - `clickCloseButton()`
  - `clickCompressZipFileCheckbox()`
  - `clickCustomizeHeaderFooter()`
  - `clickEditButtonInSidebar(name, index = 1)`
  - `clickEditContentArrow()`
  - `clickEmailAddressTextBox()`
  - `clickEventScheduleOptions(options)`
  - `clickExpandAllPageByFields()`
  - `clickExpandGridCheckbox()`
  - `clickExpandLayoutsCheckbox()`
  - `clickExpandPageByCheckbox()`
  - `clickExportFilterDetails()`
  - `clickExportPageByInformation()`
  - `clickExportReportTitle()`
  - `clickFilterContent()`
  - `clickFilterOption(name)`
  - `clickFilterOptionOnly(name)`
  - `clickFiltersApplyButton()`
  - `clickFiltersOption(option)`
  - `clickFiltersOptionOnly(option)`
  - `clickFilterType()`
  - `clickFormatDropdown()`
  - `clickInfoWindowEdit(isValid = true)`
  - `clickPromptButton()`
  - `clickRangeAll()`
  - `clickRangeDropdown()`
  - `clickSave()`
  - `clickScaleGridCheckbox()`
  - `clickScheduleOKButton()`
  - `clickSelectAllButton()`
  - `clickSendNotificationCheckbox()`
  - `clickSendNowCheckbox()`
  - `clickSidebarCancel()`
  - `clickSidebarSave()`
  - `clickSidebarUnsubscribe(name)`
  - `clickSubFolderRadioButton()`
  - `clickSubscriptionFilter()`
  - `clickSubscriptionFilterApply()`
  - `clickSubscriptionNameEditButton()`
  - `clickSubscriptionSortByOption(name)`
  - `clickSwitchRight()`
  - `clickTimeScheduleOptions(options)`
  - `clickUnsubscribe()`
  - `clickUnsubscribeYes()`
  - `clickUnsubscribeYes()`
  - `clickUsersRadioButton()`
  - `clickUseTimezonesCheckbox()`
  - `clickViewPromptToggle()`
  - `closeSubscribe()`
  - `createSubscription()`
  - `disableSendNowInReport()`
  - `editPromptInSubscription(name)`
  - `enableSendNowInReport()`
  - `getAllCheckboxStatus()`
  - `getBookmarkDropdown()`
  - `getDataDelimiterDropdown()`
  - `getDeviceDropdown()`
  - `getExcelExpandAllPagebyDropdown()`
  - `getFormatDropdown()`
  - `getFormatDropdownOptionValues()`
  - `getRangeCheckboxStatus(name)`
  - `getScheduleDropdown()`
  - `getScheduleDropdownOptionValues()`
  - `getTypeDropdown()`
  - `getTypeDropdown()`
  - `hoverSubscription(name)`
  - `hoverSubscription(name)`
  - `inputBookmarkName(name)`
  - `inputCustomizeFooter(name)`
  - `inputCustomizeHeader(name)`
  - `inputDataDelimiter(Delimiter)`
  - `inputDeviceSubFolder(text)`
  - `inputEmailSubject(subject)`
  - `inputFileName(name)`
  - `inputFileNameDelimiter(character)`
  - `inputMessage(note)`
  - `inputNote(note)`
  - `inputRecipient(name)`
  - `inputSubscriptionName(text)`
  - `inputZipFileName(text)`
  - `inputZipFilePW(text)`
  - `isSendNowPresent()`
  - `isSubFolderRadioAvailable()`
  - `isSubscriptionEmptyContentPresent()`
  - `isUseTimezonesCheckboxChecked()`
  - `openContentByOrder(i)`
  - `openScheduleDropdown()`
  - `OpenScheduleOptions()`
  - `selectBookmark(dropDownOption)`
  - `selectDataDelimiter(dropDownOption)`
  - `selectExcelExpandAllPageby(dropDownOption)`
  - `selectFormat(dropDownOption)`
  - `selectRecipient(name)`
  - `selectSchedule(dropDownOption)`
  - `selectSubscriptionDevice(dropDownOption)`
  - `selectType(dropDownOption)`
  - `toggleScheduleTab()`
  - `updateSubscriptionName(name)`
  - `waitForLoadingButtonToDisappear(timeout = 60000)`
  - `waitForSelectedBookmarkLoaded()`
  - `waitForSelectedFormatLoaded()`
  - `waitForSelectedScheduleLoaded()`
  - `waitForSubscriptionActionButtonsTobeEnabled(elem)`
- **Related components:** getBookmarkPickerContainer, getCheckboxByPage, getContentPanel, getExcelExpandAllPage, getExpandAllPage, getExpandPage, getExportPage, getFormatPickerContainer, getInfoWindowEditButtonContainer, getSchedulePickerContainer

### SubscriptionManagement
- **CSS root:** `.mstrd-SubscriptionFilterDropdown`
- **User-visible elements:**
  - All Checkbox Status (`.mstrd-Tree-all`)
  - Allow Unsubscribe (`.mstrd-SubscriptionSettings-unsubscribe .mstrd-Checkbox-label`)
  - Bookmark Dropdown (`.mstrd-SubscriptionSettings-content`)
  - Bookmark Label (`.mstrd-SubscriptionSettings-content`)
  - Bookmark Settings (`.mstrd-SubscriptionSettings-content .mstrd-Select-selected`)
  - Clear All Filters Button (`.mstrd-BaseFilterPanel-clearBtn`)
  - Content Settings (`.mstrd-SubscriptionSettings-content`)
  - Contents Setting (`.mstrd-SubscriptionSettings-excelContent`)
  - Excel Contents Setting (`label=Contents`)
  - Excel Drop Down Contents (`.mstrd-DropDown-content`)
  - Excel Range Setting (`label=Range`)
  - Filters Apply Button (`.mstrd-BaseFilterPanel-applyBtn`)
  - Format Dropdown (`.mstrd-SubscriptionSettings-format`)
  - Format Settings (`.mstrd-SubscriptionSettings-format .mstrd-Select-selected`)
  - Info Window Edit (`.mstr-menu-icon.icon-subscrip_edit`)
  - Info Window Edit Panel (`.mstrd-RecommendationsContainer-content`)
  - Info Window PDFSettings Panel (`.mstrd-ExportDetailsPanelInLibrary`)
  - Info Window Subscription Panel (`.mstrd-SubscriptionInfo`)
  - Loading Button (`.mstrd-Spinner-blade`)
  - PDFSettings Panel (`.mstrd-MenuPanel.mstrd-ExportDetailsPanel`)
  - Range Panel (`.mstrd-SubscriptionSettings-rangeSetting .mstrd-DropDown-content`)
  - Recipient Search Box (`.mstrd-RecipientSearchSection .mstrd-RecipientSearchSection-searchBox`)
  - Recipient Search Section (`.mstrd-RecipientSearchSection`)
  - Save Button When Edit Subscription (`.mstrd-SubscriptionEditor-saveButton`)
  - Schedule Selector (`.mstrd-SubscriptionSettings-schedule`)
  - Schedule Settings (`.mstrd-SubscriptionSettings-schedule`)
  - Search Loading Spinner (`.mstrd-RecipientSearchResults-loadingSpinner`)
  - Send Now Checkbox (`.mstrd-SubscriptionSettings-sendNow .mstrd-Checkbox-label`)
  - Send Preview Now Checkbox (`.mstrd-SubscriptionSettings-sendNow [role=checkbox]`)
  - Share Panel (`.mstrd-DropdownMenu-main`)
  - Sidebar Container (`.mstrd-SidebarContainer`)
  - Sidebar PDFSettings Panel (`.mstrd-SubscriptionEditDialog-main`)
  - Sort Dropdown (`.mstrd-SortDropdown`)
  - Subscribe Button (`.mstrd-MenuPanel-buttonArea`)
  - Subscribe Icon (`.icon-group_recents.mstr-menu-icon`)
  - Subscription Edit Button (`.icon-subscrip_edit`)
  - Subscription Editor (`.mstrd-SubscriptionEditor`)
  - Subscription Empty Content (`.mstrd-EmptyContent`)
  - Subscription Filter Container (`.mstrd-SubscriptionFilterDropdown`)
  - Subscription Info Icon (`.mstrd-SubscriptionEditor-title .mstrd-InfoIcon`)
  - Subscription Name (`.mstrd-SubscriptionSettings-name`)
  - Subscription Note Button (`.icon-subscrip_notes`)
  - Subscription Panel (`.mstrd-SubscribeDetailsPanel`)
  - Subscription Run Now Button (`.icon-subscrip_run`)
  - Subscription Share Resipient List (`.mstrd-RecipientSearchSection-searchList`)
  - Subscription Sidebar Edit Dialog (`.mstrd-SubscriptionEditDialog-main`)
  - Subscription Sidebar List (`.mstrd-SubscriptionListContainer`)
  - Subscription Sidebar Resipient List (`.mstrd-SubscriptionEditDialog-main .mstrd-RecipientSearchSection-searchList`)
  - Unsubscribe Button (`.icon-subscrip_unsubscribe`)
  - Unsubscribe Disabled (`.mstr-menu-icon.icon-subscrip_unsubscribe.disabled`)
- **Component actions:**
  - `clickAllowUnsubscribe()`
  - `clickArrowByChapterName(name)`
  - `clickCheckboxByChapterName(name)`
  - `clickCheckboxByPageName(name)`
  - `clickClearAll()`
  - `clickClearAllButton()`
  - `clickClearAllFiltersButton()`
  - `clickEdit(name)`
  - `clickEditButtonInSidebar(name, index = 1)`
  - `clickFilterContent()`
  - `clickFilterOption(name)`
  - `clickFilterOptionOnly(name)`
  - `clickFiltersApplyButton()`
  - `clickFiltersOption(option)`
  - `clickFiltersOptionOnly(option)`
  - `clickFiltersType()`
  - `clickFilterType()`
  - `clickInfoWindowEdit(isValid = true)`
  - `clickInWindowRunNow()`
  - `clickItemOnly()`
  - `clickOnlyByChapterName(name)`
  - `clickRangeAll()`
  - `clickRangeDropdown()`
  - `clickRangeItem(name)`
  - `clickRunNowInSubscriptionListByName(name, index = 1)`
  - `clickSave()`
  - `clickSelectAll()`
  - `clickSelectAllButton()`
  - `clickSend()`
  - `clickSidebarCancel()`
  - `clickSidebarSave()`
  - `clickSidebarUnsubscribe(name)`
  - `clickSortByDropdown()`
  - `clickSubscriptionClearFilters()`
  - `clickSubscriptionFilter()`
  - `clickSubscriptionFilterApply()`
  - `clickSubscriptionSortByOption(name)`
  - `clickSwitchLeft()`
  - `clickSwitchRight()`
  - `clickUnsubscribe()`
  - `clickUnsubscribeYes()`
  - `closeSubscribe()`
  - `createSubscription()`
  - `deleteRecipient(name)`
  - `dragHeaderWidth(name, offset)`
  - `exitInfoWindowPDFSettingsMenu()`
  - `exitPDFSettingsMenu()`
  - `getAllCheckboxStatus()`
  - `getBookmarkDropdown()`
  - `getConditionTooltipText()`
  - `getCurrentBookmarkSelection()`
  - `getFormatDropdown()`
  - `getFormatDropdownOptionValues()`
  - `getFormatItem()`
  - `getGroupMemberCount(name)`
  - `getRangeCheckboxStatus(name)`
  - `getScheduleDropdown()`
  - `getScheduleDropdownOptionValues()`
  - `getScheduleItem()`
  - `getSubscriptionNameText()`
  - `getSubscriptionPropertyBySubscriptionName(subscriptionName, propertyName)`
  - `hoverSubscription(name)`
  - `inputBookmark(text)`
  - `inputName(text)`
  - `inputNote(text)`
  - `isGetAllowUnsubscribePresent()`
  - `isSendNowPresent()`
  - `isSidebarContainerPrenent()`
  - `isSidebarEditPresentByName(name)`
  - `isSidebarRunNowPresentByName(name)`
  - `isSubscribePresent()`
  - `isSubscriptionEditPresent()`
  - `isSubscriptionEmptyContentPresent()`
  - `isSubscriptionExisted(name)`
  - `isSubscriptionNotePresent()`
  - `isSubscriptionRunNowPresent()`
  - `isUnsubscribeDisabledPresent()`
  - `isUnSubscribePresent()`
  - `isUnSubscribePresentByName(name)`
  - `openExcelContentsSetting()`
  - `openPDFSettingsMenu()`
  - `openSubscriptionSnapshotByName(name)`
  - `searchRecipient(name)`
  - `searchRecipientByName(searchKey)`
  - `searchSidebarRecipient(name)`
  - `selectBookmark(dropDownOption)`
  - `selectExcelContents(content)`
  - `selectFormat(dropDownOption)`
  - `selectRecipient(name)`
  - `selectRecipientGroup(groupName)`
  - `selectRecipients(userList, groupName = 'None')`
  - `selectSchedule(dropDownOption)`
  - `selectSidebarRecipients(userList, groupName = 'None')`
  - `selectSortDirection(dir)`
  - `toggleSendPreviewNow(toggleOn = true)`
  - `waitForBookmarkLoaded()`
  - `waitForLoadingButtonToDisappear(timeout = 60000)`
  - `waitForSubscriptionActionButtonsTobeEnabled(elem)`
  - `waitForSubscriptionCreated()`
- **Related components:** _getDropDownContainer, getCheckboxByPage, getContainer, getInfoWindowEditButtonContainer, getInfoWindowRunowButtonContainer, getSidebarContainer, getSubscriptionContainer, getSubscriptionFilterContainer, getSubscriptionPanel

## Common Workflows (from spec.ts)

1. Export - Export a Dossier to PDF (used in 7 specs)
2. Automation for Subscription - Create and Manage Subscription in Library (used in 3 specs)
3. LibraryExportToPDF - Check Default Settings (used in 3 specs)
4. [TC77677] [Tanzu] Export dossier to PDF from entry Info Window (used in 2 specs)
5. [TC77678] [Tanzu] Export dossier to PDF from entry Share Panel (used in 2 specs)
6. [TC77680] [Tanzu] Export dossier to Excel from entry Share Panel (used in 2 specs)
7. [TC77681] [Tanzu] Export to Excel - Check grid can be export to excel from visualization (used in 2 specs)
8. [TC78192] [Tanzu] Export dossier to Excel from entry Info Window (used in 2 specs)
9. [TC82727] [Tanzu] Export OOTB dossier to PDF (used in 2 specs)
10. [TC90029] Exporting RSD to PDF from info window (used in 2 specs)
11. [TC90030] Exporting RSD to PDF from share panel (used in 2 specs)
12. [TC90031] Exporting RSD to Excel from info window (used in 2 specs)
13. [TC90032] Exporting RSD to Excel from share panel (used in 2 specs)
14. Export - Export Dashboard to PDF (used in 2 specs)
15. ExportToPDF - Tanzu Sanity Test (used in 2 specs)
16. Library Authoring - Manipulations related to PDF export (used in 2 specs)
17. LibraryExport - Export Dashboard to Excel_CheckExportSettings (used in 2 specs)
18. LibrarySubscription - Check subscription privilege in Library (used in 2 specs)
19. Run As Export (used in 2 specs)
20. [BCVE-4222] Check three dot menu button for visualization with hidden title (used in 1 specs)
21. [BCVE-4989_01] Export prompted dashboard to Google Sheets from info window after answering prompt (used in 1 specs)
22. [BCVE-4989_02] Export prompted report to Google Sheets from info window after answering prompt (used in 1 specs)
23. [BCVE-4989_03] Verify Google Sheets export is not available in NoExportOptions application (used in 1 specs)
24. [BCVE-5242_01] Create Dashboard FTP subscription from share panel (used in 1 specs)
25. [BCVE-5242_02] Manage Dashboard FTP subscription from info window (used in 1 specs)
26. [BCVE-5242_03] Manage Dashboard FTP subscription from sidebar (used in 1 specs)
27. [BCVE-5242_04] Manage Report FTP subscription from sidebar (used in 1 specs)
28. [BCVE-5242_05] Check create sub-folder function for user without privilege (used in 1 specs)
29. [BCVE-5272_01] In pause mode, check PDF export options: Dashboard Properties -> Advanced Mode (used in 1 specs)
30. [BCVE-5272_02] Remove dataset, check PDF export options: Dashboard Properties -> Advanced Mode (used in 1 specs)
31. [BCVE-5498_InfoWindow] Export entire dashboard to Google Sheets from info window (used in 1 specs)
32. [BCVE-5498_ListView] Export entire dashboard to Google Sheets from list view (used in 1 specs)
33. [BCVE-5498_SharePanel] Export dashboard with selected chapter to Google Sheets from share panel (used in 1 specs)
34. [BCVE-5498_VizMenu] Export grid to Google Sheets from visualization menu (used in 1 specs)
35. [Demo_1] Check end to end work flow of exporting dashboard to Excel (used in 1 specs)
36. [F38421_1] Export Report_PageBy to CSV from Info Window (used in 1 specs)
37. [F38421_2] Modify export option and export Report_PageBy to CSV from Share Panel (used in 1 specs)
38. [F38421_3] Modify export option and export Report_NoPageBy to CSV from Share Panel (used in 1 specs)
39. [F38421_4] Export Report_NoPageBy to CSV from List View Info Window (used in 1 specs)
40. [F38421_5] Export Report_PageBy to CSV from Context Menu in List View (used in 1 specs)
41. [F41877] Export visualization to CSV from title bar export button (used in 1 specs)
42. [F41877] Export visualization to Excel from title bar export button (used in 1 specs)
43. [F41877] Export visualization to PDF from title bar export button (used in 1 specs)
44. [F42327_ManipulationsubscriptiontoCSV] Modify report_Pageby subscription to CSV (used in 1 specs)
45. [F42327_ManipulationsubscriptiontoExcel] Modify report_Pageby subscription to Excel (used in 1 specs)
46. [F42327_Reportpagebysubscription] Check GUI of report_Pageby subscription to Excel/CSV/PDF (used in 1 specs)
47. [F42327_Reportsubscription] Check GUI of report subscription to Excel/CSV/PDF (used in 1 specs)
48. [F42962_AddAddress] Add personal address (used in 1 specs)
49. [F43008_1] Set Available Formats in Authoring (used in 1 specs)
50. [F43008_2] Check Available Formats from Entry of Info Window (used in 1 specs)
51. [F43008_3] Check Available Formats from Entries inside Dashboard for dossier_Auto_Format_AllowExcel (used in 1 specs)
52. [F43008_4] Check Available Formats from Entry of Context Menu in List View (used in 1 specs)
53. [F43008_5] Check available formats for subscription when creating from share panel (used in 1 specs)
54. [F43008_6] Check available formats for subscription when editing in info window an sidebar (used in 1 specs)
55. [F43156_01] Create Excel subscription from share panel (used in 1 specs)
56. [F43156_02] Manage subscription from info window (used in 1 specs)
57. [F43156_03] Manage subscription from sidebar (used in 1 specs)
58. [F43156_04] Check subscription filter in sidebar (used in 1 specs)
59. [F43156_11] Manage Email subscription for Report from info window (used in 1 specs)
60. [F43156_12] Manage Email subscription for RSD from info window (used in 1 specs)
61. [F43156_13] Manage Email subscription for Report from sidebar (used in 1 specs)
62. [F43156_14] Manage Email subscription for RSD from sidebar (used in 1 specs)
63. [F43156_15] Check multi-content subscription from sidebar (used in 1 specs)
64. [F43156_3] Manage subscription from sidebar (used in 1 specs)
65. [F43156_DashboardWithPrompt] Check prompt for dashboard subscription in Library (used in 1 specs)
66. [F43156_fullPrivilege] Check privileges for subscription in Library (used in 1 specs)
67. [F43156_noPrivilege] Check privileges for subscription in Library (used in 1 specs)
68. [F43156_Privilege1] Check privileges for subscription in Library (used in 1 specs)
69. [F43156_Privilege2] Check privileges for subscription in Library (used in 1 specs)
70. [F43156_ReportWithPrompt] Check prompt for report subscription in Library (used in 1 specs)
71. [F43156_RSDWithPrompt] Check prompt for document subscription in Library (used in 1 specs)
72. [F43170_01] Check PDF export options: Dashboard Properties -> Advanced Mode (used in 1 specs)
73. [F43170_02] Check PDF export options: Advanced Mode -> Dashboard Properties (used in 1 specs)
74. [F43170_03] Format Header & Footer in PDF export options: Advanced Mode -> Dashboard Properties (used in 1 specs)
75. [F43272_1] Set default Excel export setting in dashboard properties (used in 1 specs)
76. [F43272_2] Check configured Excel export setting from Info Window (used in 1 specs)
77. [F43272_3] Check configured Excel export setting, modify and export from Share Panel (used in 1 specs)
78. [F43272_4] Do manipulations and check Excel export settings from Share Panel (used in 1 specs)
79. [F6494_1] Set Customized PDF Header and Footer in Library Authoring (used in 1 specs)
80. [F6494_2] Check Locked PDF Header and Footer in Library Consumption from Info Window (used in 1 specs)
81. [F6494_3] Check Locked PDF Header and Footer in Library Consumption from Share Panel (used in 1 specs)
82. [F6494_4] Check Locked PDF Header and Footer in Library Consumption from Visualization (used in 1 specs)
83. [TC0001] Configure PDF export settings in Library Authoring (used in 1 specs)
84. [TC0002] Check and modify PDF export settings from Share Dialog (used in 1 specs)
85. [TC0003] Check and modify PDF export settings from Info Window (used in 1 specs)
86. [TC0004] Check and modify PDF export settings from Subscription Dialog (used in 1 specs)
87. [TC20650] Export to PDF - Verify Export Document from title bar of grid and graph in Library Web (used in 1 specs)
88. [TC20889] Export to PDF - Verify Export RSD to PDF with Watermark in Library (used in 1 specs)
89. [TC31788_exportAll] Check Privileges for Exporting in All Formats in Library (used in 1 specs)
90. [TC31788_exportExcel] Check Privileges for Exporting Excel in Library (used in 1 specs)
91. [TC31788_exportGoogleSheets] Check Privileges for Exporting Google Sheets in Library (used in 1 specs)
92. [TC31788_exportPDF] Check Privileges for Exporting PDF in Library (used in 1 specs)
93. [TC31788_exportText] Check Privileges for Exporting Text in Library (used in 1 specs)
94. [TC31788_NoExportPrivilege] Check Privileges for NoExportPrivilege user in Library (used in 1 specs)
95. [TC56136_RSD_exportAll] Check Privileges for RSD Exporting in Library (used in 1 specs)
96. [TC56136_RSD_exportExcel] Check Privileges for RSD Exporting in Library (used in 1 specs)
97. [TC56136_RSD_exportPDF] Check Privileges for RSD Exporting in Library (used in 1 specs)
98. [TC56136_RSD_NoExportPrivilege] Check Privileges for RSD Exporting in Library (used in 1 specs)
99. [TC56909] Export to PDF - Check for Export icon enabled and show tooltip (used in 1 specs)
100. [TC56910] Export to PDF - Check fo GUI of Export panel and cancel exporting (used in 1 specs)
101. [TC56911] Export to PDF - Check for default export settings and directly export (used in 1 specs)
102. [TC56912] Export to PDF - Modify settings to check controllers functionality, and then export (used in 1 specs)
103. [TC56914] Export to PDF - Check for GUI of Export panel, cancel, and export with default settings (used in 1 specs)
104. [TC56916] Export to PDF - Check default settings, cancel, and export from visualization (Grid) (used in 1 specs)
105. [TC56917] Export to PDF - Modify settings to check controllers functionality, and export from visualization (Grid) (used in 1 specs)
106. [TC56918] Export to PDF - Check default settings and export from visualization with customized settings (not Grid) (used in 1 specs)
107. [TC58930] Export to PDF - Verify Export RSD from info Window (used in 1 specs)
108. [TC58931] Export to PDF - Verify Export RSD from dossier (used in 1 specs)
109. [TC61449] Export to PDF - the selector of exporting pdf range in RSD cannot draw back after clicking at the blank space or itself (used in 1 specs)
110. [TC61649] Export to Excel - Verify export grid to Excel from end to end (used in 1 specs)
111. [TC61650] Export to Excel - Empty grid can export as Excel (used in 1 specs)
112. [TC61651] Export to Excel - One grid page should export directly (used in 1 specs)
113. [TC61652] Export to Excel - Check Compound grid can be export to excel (used in 1 specs)
114. [TC61654] Export to Excel - Check long grid name can display well in Grid list (used in 1 specs)
115. [TC61656] Export to Excel - Check grid can be export to excel from visualization (used in 1 specs)
116. [TC61657] Export to Excel - Verify the responsiveness of export grid to excel (used in 1 specs)
117. [TC63338] Validation of DE163594: [Library][Export Dialog] Inconsistent string between the selected one and string in list in Info Window of Library (used in 1 specs)
118. [TC65772] Export to Excel - Verify export grid to Excel from end to end (used in 1 specs)
119. [TC71400] Export to PDF - Verify Export with Grid Expanding and TOC enabled from Info Window by click. (used in 1 specs)
120. [TC71403] Export to PDF - Verify Export with Grid Expanding and TOC enabled from Export Dialog by click. (used in 1 specs)
121. [TC74132] Export grid in panel stack to Excel from Library (used in 1 specs)
122. [TC75549] Export to PDF - Export grid to PDF from entry Show Data. (used in 1 specs)
123. [TC76451_InfoWindow] Export entire dossier to Excel in Library (used in 1 specs)
124. [TC76451_SharePanel] Export entire dossier to Excel in Library (used in 1 specs)
125. [TC76458_fullPrivilege] Check privileges for subscription in Library (used in 1 specs)
126. [TC76458_noPrivilege] Check privileges for subscription in Library (used in 1 specs)
127. [TC76458_Privilege1] Check privileges for subscription in Library (used in 1 specs)
128. [TC76458_Privilege2] Check privileges for subscription in Library (used in 1 specs)
129. [TC77679] [Tanzu] Export dossier to PDF from entry Viz Menu (used in 1 specs)
130. [TC79674] Create PDF subscription from share panel (used in 1 specs)
131. [TC79675] Manage PDF subscription from info window (used in 1 specs)
132. [TC79676] Manage PDF subscription from sidebar (used in 1 specs)
133. [TC79872] Create subscription for other recipients (used in 1 specs)
134. [TC79891] Check subscriptions for recipients in entry of info window (used in 1 specs)
135. [TC79892] Check subscriptions for recipients in entry of sidebar (used in 1 specs)
136. [TC82125] PerBuild - Subscription - Create subscription in entry Share Panel (used in 1 specs)
137. [TC82126] PerBuild - Subscription - Edit subscription in entry Info Window (used in 1 specs)
138. [TC82127] PerBuild - Subscription - Manage subscription in entry Sidebar (used in 1 specs)
139. [TC82679] Check PDF smart default settings after linking to other page (used in 1 specs)
140. [TC85172] Export to PDF - Export visualization key driver to PDF. (used in 1 specs)
141. [TC90584_1] Check existing Conditional Display settings (used in 1 specs)
142. [TC90584_2] Delete existing Conditional Display settings (used in 1 specs)
143. [TC90584_3] Update existing Conditional Display settings (used in 1 specs)
144. [TC93946_1] Check Excel export setting from Info Window (used in 1 specs)
145. [TC93946_2] Check Excel export setting from Share Menu_Auto_GridsGraphs (used in 1 specs)
146. [TC93946_3] Check Excel export setting from Share Menu_Auto_NonVizOnly (used in 1 specs)
147. [TC93946_4] Check Excel export setting from Share Menu_Auto_Freeform (used in 1 specs)
148. [TC93946_5] Check Excel export setting from Share Menu_Auto_Mix (used in 1 specs)
149. [TC93946_8] Switch dashboard page and check Excel export setting from Share Menu (used in 1 specs)
150. [TC93946_9] Check Excel Export Settings from Share Panel in Mobile View (used in 1 specs)
151. [TC94328_1] Check PDF export setting from Share Menu_Auto_GridsGraphs (used in 1 specs)
152. [TC94328_2] Check PDF export setting from Share Menu_Auto_Freeform (used in 1 specs)
153. [TC94328_3] Check PDF export setting from Share Menu_Auto_NonVizOnly (used in 1 specs)
154. [TC94328_4] Check PDF export setting from Share Menu_Auto_SingleGrid (used in 1 specs)
155. [TC94328_5] Switch page and check PDF export setting from Share Menu_Auto_Export_3 (used in 1 specs)
156. [TC94328_6] Do manipulation and check PDF export setting from Share Menu_Auto_Mix (used in 1 specs)
157. [TC94328_7] Check PDF Export Settings from Share Panel in Mobile View (used in 1 specs)
158. [TC94908_1] Check Excel Subscription Settings from Share Panel (used in 1 specs)
159. [TC94908_2] Check Existing Excel Subscriptions from Info Window (used in 1 specs)
160. [TC94908_3] Edit Subscription in Info Window and Check from Sidebar (used in 1 specs)
161. [TC94908_5] Check Subscriptions from Share Panel in Mobile View (used in 1 specs)
162. [TC95175_0] Check PDF Export Settings stored in MD (used in 1 specs)
163. [TC95175_1] Set Default PDF Export Settings in Library Authoring (used in 1 specs)
164. [TC95175_10] Modify export settings and export to PDF in viz menu, share menu, and info window separately (not default) (used in 1 specs)
165. [TC95175_11] InfoWindow_Do manipulations and check export dialog (used in 1 specs)
166. [TC95175_12] SharePanel_Do manipulations and check export dialog (used in 1 specs)
167. [TC95175_13] VizMenu_Do manipulations and check export dialog (used in 1 specs)
168. [TC95175_2] InfoWindow_Check PDF Export Settings in Library Consumption (used in 1 specs)
169. [TC95175_3] Share_Check PDF Export Settings in Library Consumption (used in 1 specs)
170. [TC95175_4] VizMenu_Check PDF Export Settings in Library Consumption (used in 1 specs)
171. [TC95175_5] SearchWindow_Check Default PDF Export Settings in Library Consumption (used in 1 specs)
172. [TC95175_6] Export dossier with default settings from info window and share panel, and viz menu (used in 1 specs)
173. [TC95175_7] Modify export settings in info Window and export from share panel (default) (used in 1 specs)
174. [TC95175_8] Modify export settings in share panel and export from info window (default) (used in 1 specs)
175. [TC95175_9] Modify export settings and export to PDF in info window and share panel separately (not default) (used in 1 specs)
176. [TC97317] Change application, create and check new subscription (used in 1 specs)
177. [TC97618_1] Check Excel export settings of Report_PageBy for application exportReportDefault (used in 1 specs)
178. [TC97618_2] Check Excel export settings of Report_NoPageBy for application exportReportDefault (used in 1 specs)
179. [TC97618_3] Check Excel export settings of Report_PageBy for application exportReportCheckAll (used in 1 specs)
180. [TC97618_4] Check Excel export settings of Report_NoPageBy for application exportReportCheckAll (used in 1 specs)
181. [TC97618_5] Check Excel export settings of Report_PageBy with manipulations (used in 1 specs)
182. [TC98620_1] Check PDF export settings of Report_PageBy for application exportReportDefault (used in 1 specs)
183. [TC98620_2] Check PDF export settings of Report_NoPageBy for application exportReportDefault (used in 1 specs)
184. [TC98620_3] Check PDF export settings of Report_PageBy for application uncheckPageBy (used in 1 specs)
185. [TC98620_4] Check PDF export settings of Report_NoPageBy for application uncheckPageBy (used in 1 specs)
186. [TC98620_5] Check PDF export settings of Report_PageBy with manipulations (used in 1 specs)
187. [TC98741_1] Check Subscription Sort Function from Sidebar (used in 1 specs)
188. [TC98741_2] Check Subscription Filter Content from Sidebar (used in 1 specs)
189. [TC98741_3] Check Subscription Filter Type from Sidebar (used in 1 specs)
190. [TC98741_4] Resize Subscription Column from Sidebar (used in 1 specs)
191. [TC98741_5] Switch Application and Check Subscription Column from Sidebar (used in 1 specs)
192. [TC98932_1] Create subscription for groups (used in 1 specs)
193. [TC98932_2] Create subscription for groups and recipients (used in 1 specs)
194. [TC98932_3] Check status of empty group (used in 1 specs)
195. [TC98932_4] Check Recipients in DeliverTo after Manipulations (used in 1 specs)
196. [TC98981_1] Open Subscription Snapshot and Export to PDF from Share Menu (used in 1 specs)
197. [TC98981_2] Open Subscription Snapshot and Export to PDF from Visualization Menu (used in 1 specs)
198. [TC99102_1] Export dashboard to CSV from Info Window (used in 1 specs)
199. [TC99102_2] Switch page and check CSV export settings from Share Panel (used in 1 specs)
200. [TC99102_3] Modify range and export dashboard to CSV from Share Panel (used in 1 specs)
201. [TC99102_4] Check default range and export dashboard to CSV in Mobile View (used in 1 specs)
202. [TC99171_1] Set PDF Margin in Library Authoring (used in 1 specs)
203. [TC99171_2] Check saved PDF Margin in Library Consumption from Info Window (used in 1 specs)
204. [TC99171_3] Check saved PDF Margin and Update them in Library Consumption from Share Panel (used in 1 specs)
205. [TC99171_4] Select different paper sizes/orientations and check corresponding margin value (used in 1 specs)
206. [TC99171_5] Set valid and invalid margin value and check the frontend behavior (used in 1 specs)
207. [TC99198_01] Validate Run As Export for Dashboard - Run (used in 1 specs)
208. [TC99198_02] Validate Run As Export for Dashboard - Run By URL (used in 1 specs)
209. [TC99198_03] Validate Run As Export for Dashboard - Document Linking - Link Via Object (used in 1 specs)
210. [TC99198_04] Validate Run As Export for Dashboard - Document Linking - Link Via URL (used in 1 specs)
211. [TC99198_05] Validate Run As Export for Dashboard - Dashboard Linking (used in 1 specs)
212. [TC99198_06] Validate dossier linking of passing filter to target run as export (used in 1 specs)
213. ABA - Automation for Subscription - Create and Manage Subscription in Library (used in 1 specs)
214. ABA Export Subscription Snapshot to PDF (used in 1 specs)
215. Automation for defects (used in 1 specs)
216. Automation for FTP Subscription - Create and Manage FTP Subscription in Library (used in 1 specs)
217. Automation for Subscription - Add Address in Library (used in 1 specs)
218. Automation for Subscription - Report Subscription in Library (used in 1 specs)
219. Export - Check Available Export Formats for Dashboards (used in 1 specs)
220. Export - Export Dashboard to CSV (used in 1 specs)
221. Export - Export Dashboard to Excel (used in 1 specs)
222. Export - Export dashboard to Google Sheets (used in 1 specs)
223. Export - Export Grids to Excel (used in 1 specs)
224. Export - Export prompted dashboard to Google Sheets (XFunction) (used in 1 specs)
225. Export - Export Report to CSV (used in 1 specs)
226. Export - Test privileges of export functions (used in 1 specs)
227. LibraryExport - Check Sort, Filter and Resize Functions for Subscription from Sidebar (used in 1 specs)
228. LibraryExport - Create and Manage Subscription in Library (used in 1 specs)
229. LibraryExport - Export Dashboard to PDF (used in 1 specs)
230. LibraryExport - Export Report to Excel (used in 1 specs)
231. LibraryExport - Export Report to PDF (used in 1 specs)
232. LibrarySubscription - Create and Manage PDF Subscription in Library (used in 1 specs)
233. LibrarySubscription - Create and Manage Subscription for Group as Recipients in Library (used in 1 specs)
234. LibrarySubscription - Create and Manage Subscription for other recipients in Library (used in 1 specs)
235. LibrarySubscription - Manage subscriptions which contains prompts in Library (used in 1 specs)
236. Subscribe - Tanzu Sanity Test (used in 1 specs)
237. tmp test for export (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. pdf -- frequency: 79
2. getRequestPostData -- frequency: 75
3. xlsx -- frequency: 70
4. getDossierExportPDFPanel -- frequency: 61
5. getContentSettingsSection -- frequency: 37
6. getAdvancedSettingsDialog -- frequency: 29
7. getInfoWindowExportDetails -- frequency: 29
8. getFilterDropdownMainDialg -- frequency: 21
9. getMojoPDFExportSettingsEditor -- frequency: 20
10. getSubscriptionPanel -- frequency: 20
11. getExportExcelPanel -- frequency: 17
12. getExportExcelPanelContent -- frequency: 17
13. getSubscriptionSidebarList -- frequency: 17
14. getContentPanel -- frequency: 16
15. getInfoWindowSubscriptionPanel -- frequency: 16
16. getExportExcelSettingsPanel -- frequency: 13
17. getRangeCheckboxStatus -- frequency: 12
18. getRSDExportDialog -- frequency: 10
19. getRangePanel -- frequency: 9
20. getScheduleOptionsDialog -- frequency: 9
21. getDashboardPropertiesExportToPDFDialog -- frequency: 8
22. getInfoWindowCSVExportDialog -- frequency: 8
23. getAllCheckboxStatus -- frequency: 7
24. getContentsSetting -- frequency: 7
25. getMarginOption -- frequency: 7
26. csv -- frequency: 6
27. getExportPreview -- frequency: 6
28. getMenuContent -- frequency: 6
29. getReportExportPDFPanel -- frequency: 6
30. getReportExportToExcelDialog -- frequency: 6
31. getVizList -- frequency: 6
32. getConditionalDisplayDialog -- frequency: 5
33. getDeliverySettingsSection -- frequency: 5
34. getExportCSVPanel -- frequency: 5
35. getInfoWindow -- frequency: 5
36. getPDFRange -- frequency: 5
37. getPromptByName -- frequency: 5
38. getRecipientsSettingsSection -- frequency: 5
39. getSidebarPDFSettingsPanel -- frequency: 5
40. getExcelContents -- frequency: 4
41. getPDFSettingsPanel -- frequency: 4
42. getReportCsvPanel -- frequency: 4
43. getSharePanel -- frequency: 4
44. getDialogPanel -- frequency: 3
45. getExportExcelButton -- frequency: 3
46. getExportPDFButton -- frequency: 3
47. getFTPSettingsDialog -- frequency: 3
48. getInfoWindowEditPanel -- frequency: 3
49. getInfoWindowPDFSettingsPanel -- frequency: 3
50. getMojoPdfExportSettings -- frequency: 3
51. getPromptDialog -- frequency: 3
52. getVisualizationMenuButton -- frequency: 3
53. Loading Button -- frequency: 3
54. All Checkbox Status -- frequency: 2
55. Bookmark Dropdown -- frequency: 2
56. Clear All Filters Button -- frequency: 2
57. Excel Contents Setting -- frequency: 2
58. Excel Drop Down Contents -- frequency: 2
59. Excel Range Setting -- frequency: 2
60. Export Excel Panel -- frequency: 2
61. Filters Apply Button -- frequency: 2
62. getExcelDropDownContents -- frequency: 2
63. getExcelRange -- frequency: 2
64. getExportButton -- frequency: 2
65. getExportPageInfo -- frequency: 2
66. getFormatOptionDropdown -- frequency: 2
67. getGridList -- frequency: 2
68. getMainInfo -- frequency: 2
69. getNewConditionDialog -- frequency: 2
70. getPromptEditor -- frequency: 2
71. getRangeDropDownContents -- frequency: 2
72. getRSDExportExcelPanel -- frequency: 2
73. getRsdGridByKey -- frequency: 2
74. Info Window Edit -- frequency: 2
75. Info Window Subscription Panel -- frequency: 2
76. mstrd Recipient Combo Box dialog -- frequency: 2
77. Range All -- frequency: 2
78. Range Drop Down Contents -- frequency: 2
79. Subscribe Button -- frequency: 2
80. Subscription Empty Content -- frequency: 2
81. Subscription Name -- frequency: 2
82. Subscription Panel -- frequency: 2
83. Add New Address Button -- frequency: 1
84. Address Cancel Button -- frequency: 1
85. Address Name Text Box -- frequency: 1
86. Advanced Settings Button -- frequency: 1
87. Advanced Settings Dialog -- frequency: 1
88. Advanced Settings Panel -- frequency: 1
89. Allow Unsubscribe -- frequency: 1
90. Bookmark Label -- frequency: 1
91. Bookmark Picker Container -- frequency: 1
92. Bookmark Settings -- frequency: 1
93. Bookmark Textbox -- frequency: 1
94. Compress Zip Checkbox -- frequency: 1
95. Content Panel -- frequency: 1
96. Content Settings -- frequency: 1
97. Content Settings Section -- frequency: 1
98. Contents Setting -- frequency: 1
99. Context Menu -- frequency: 1
100. CSVDelimiter Dropdown -- frequency: 1
101. CSVExport Icon -- frequency: 1
102. CSVRange Setting -- frequency: 1
103. Delimiter Input -- frequency: 1
104. Delivery Dialog -- frequency: 1
105. Delivery Settings Section -- frequency: 1
106. Detail Level Settings -- frequency: 1
107. Dialog Panel -- frequency: 1
108. Dossier Export PDFPanel -- frequency: 1
109. Excel Contents -- frequency: 1
110. Excel Export Icon -- frequency: 1
111. Excel Range -- frequency: 1
112. Excel Range Settings -- frequency: 1
113. Expand All Grid Data Check Box -- frequency: 1
114. Export Button Container -- frequency: 1
115. Export Complete Notification -- frequency: 1
116. Export CSVPanel -- frequency: 1
117. Export Excel Panel Content -- frequency: 1
118. Export Excel Settings Panel -- frequency: 1
119. Export Is Complete Notification -- frequency: 1
120. Export Loading Spinner -- frequency: 1
121. Export Page Info -- frequency: 1
122. Export Preview -- frequency: 1
123. Filter Summary Settings -- frequency: 1
124. Filter Summary Tab Options View -- frequency: 1
125. Format Color Picker -- frequency: 1
126. Format Dropdown -- frequency: 1
127. Format Font Size Input -- frequency: 1
128. Format Image Input Box -- frequency: 1
129. Format Image OKBtn -- frequency: 1
130. Format Option Dropdown -- frequency: 1
131. Format Settings -- frequency: 1
132. FTPSettings Dialog -- frequency: 1
133. getDashboardPropertiesExportToExcelDialog -- frequency: 1
134. getExportToCSVSettingsPanel -- frequency: 1
135. getExportToExcelSettingsPanel -- frequency: 1
136. getExportToPDFSettingsPanel -- frequency: 1
137. getLink -- frequency: 1
138. getMojoPDFExportButton -- frequency: 1
139. getRecipientSearchSection -- frequency: 1
140. getRightClickMenu -- frequency: 1
141. getSubscribeToDashboardPanel -- frequency: 1
142. getSubscriptionShareResipientList -- frequency: 1
143. getSubscriptionSidebarEditDialog -- frequency: 1
144. Google Sheets Export Icon -- frequency: 1
145. Grid Settings -- frequency: 1
146. Header Check Box -- frequency: 1
147. Info Window CSVExport Dialog -- frequency: 1
148. Info Window Edit Panel -- frequency: 1
149. Info Window Export Button -- frequency: 1
150. Info Window Export Excel Button -- frequency: 1
151. Info Window PDFSettings Panel -- frequency: 1
152. Info Window Report Export Button -- frequency: 1
153. IWExport CSVButton -- frequency: 1
154. Landscape Button -- frequency: 1
155. Library Export PDFWindow -- frequency: 1
156. Margin Bottom Textbox -- frequency: 1
157. Margin Left Textbox -- frequency: 1
158. Margin Option -- frequency: 1
159. Margin Right Textbox -- frequency: 1
160. Margin Top Textbox -- frequency: 1
161. Mojo Pdf Export Settings -- frequency: 1
162. Mojo PDFExport Display Option -- frequency: 1
163. Mojo PDFExport Settings Editor -- frequency: 1
164. More Settings Button -- frequency: 1
165. Orientation -- frequency: 1
166. Page Numbers Check Box -- frequency: 1
167. Page Size Settings -- frequency: 1
168. Paper Size Drop Down Button -- frequency: 1
169. PDFExport Icon -- frequency: 1
170. PDFRange -- frequency: 1
171. PDFRange Setting -- frequency: 1
172. PDFSettings -- frequency: 1
173. PDFSettings Panel -- frequency: 1
174. Portrait Button -- frequency: 1
175. Prompt Button -- frequency: 1
176. Prompt Dialog -- frequency: 1
177. Range Panel -- frequency: 1
178. React Margin Bottom Textbox -- frequency: 1
179. React Margin Left Textbox -- frequency: 1
180. React Margin Right Textbox -- frequency: 1
181. React Margin Top Textbox -- frequency: 1
182. React Show Filter Dropdown -- frequency: 1
183. Recipient Search Box -- frequency: 1
184. Recipient Search Section -- frequency: 1
185. Recipient Textbox -- frequency: 1
186. Recipients Settings Section -- frequency: 1
187. Repeat Attribute Columns Check Box -- frequency: 1
188. Report Csv Panel -- frequency: 1
189. Report Export Excel Settings Panel -- frequency: 1
190. Report Export PDFPanel -- frequency: 1
191. Report Export To Excel Dialog -- frequency: 1
192. Report IWExport Cancel -- frequency: 1
193. Report More Settings Arrow -- frequency: 1
194. RSDExport Dialog -- frequency: 1
195. RSDExport Excel Panel -- frequency: 1
196. RSDRange Drop Down Contents -- frequency: 1
197. RSDVisualization Menu -- frequency: 1
198. Save Button When Edit Subscription -- frequency: 1
199. Schedule Options Dialog -- frequency: 1
200. Schedule Selector -- frequency: 1
201. Schedule Selector Dropdown -- frequency: 1
202. Schedule Settings -- frequency: 1
203. Search Loading Spinner -- frequency: 1
204. Send Now Checkbox -- frequency: 1
205. Send Preview Now Checkbox -- frequency: 1
206. Share Panel -- frequency: 1
207. Share Spinning Icon -- frequency: 1
208. Show Filters Checkbox -- frequency: 1
209. Sidebar Container -- frequency: 1
210. Sidebar PDFSettings Panel -- frequency: 1
211. Sort Dropdown -- frequency: 1
212. Subscribe Icon -- frequency: 1
213. Subscription Edit Button -- frequency: 1
214. Subscription Editor -- frequency: 1
215. Subscription Filter Container -- frequency: 1
216. Subscription Info Icon -- frequency: 1
217. Subscription Name Edit Button -- frequency: 1
218. Subscription Note Button -- frequency: 1
219. Subscription Run Now Button -- frequency: 1
220. Subscription Share Resipient List -- frequency: 1
221. Subscription Sidebar Edit Dialog -- frequency: 1
222. Subscription Sidebar List -- frequency: 1
223. Subscription Sidebar Resipient List -- frequency: 1
224. Tableof Contents Check Box -- frequency: 1
225. Unsubscribe Button -- frequency: 1
226. Unsubscribe Disabled -- frequency: 1
227. View Summary Toggle -- frequency: 1
228. Viz List -- frequency: 1
229. Vizualization Export Excel Dialog -- frequency: 1
230. zip -- frequency: 1
231. Zoom In Icon -- frequency: 1
232. Zoom Input Box -- frequency: 1
233. Zoom Out Icon -- frequency: 1
234. Zoom Slider Icon -- frequency: 1

## Key Actions

- `sleep()` -- used in 645 specs
- `goToLibrary()` -- used in 235 specs
- `join()` -- used in 201 specs
- `moveDossierIntoViewPort()` -- used in 125 specs
- `openExportPDFSettingsWindow()` -- used in 102 specs
- `login()` -- used in 99 specs
- `openDossierInfoWindow()` -- used in 96 specs
- `openDossier()` -- used in 91 specs
- `openShareDropDown()` -- used in 84 specs
- `waitForDossierLoading()` -- used in 76 specs
- `getRequestPostData()` -- used in 75 specs
- `getDossierExportPDFPanel()` -- used in 61 specs
- `reload()` -- used in 54 specs
- `close()` -- used in 53 specs
- `toMatchPdf()` -- used in 52 specs
- `openSharePanel()` -- used in 48 specs
- `openUrl()` -- used in 45 specs
- `closeSharePanel()` -- used in 44 specs
- `waitForDownloadComplete()` -- used in 43 specs
- `hoverSubscription(name)` -- used in 41 specs
- `logout()` -- used in 39 specs
- `openUserAccountMenu()` -- used in 39 specs
- `getContentSettingsSection()` -- used in 37 specs
- `clickLibraryIcon()` -- used in 36 specs
- `openSubscriptions()` -- used in 35 specs
- `setWindowSize()` -- used in 34 specs
- `clickSave()` -- used in 31 specs
- `exportSubmitLibrary()` -- used in 31 specs
- `clickManageSubscriptionsButton()` -- used in 30 specs
- `clickFiltersApplyButton()` -- used in 29 specs
- `clickSubscriptionFilter()` -- used in 29 specs
- `getAdvancedSettingsDialog()` -- used in 29 specs
- `getInfoWindowExportDetails()` -- used in 29 specs
- `selectFormat(dropDownOption)` -- used in 29 specs
- `selectPageSize(dropDownOption)` -- used in 29 specs
- `mock()` -- used in 28 specs
- `clear()` -- used in 27 specs
- `isVisualizationExportTypePresent()` -- used in 27 specs
- `clickExportToExcel()` -- used in 26 specs
- `switchToTab()` -- used in 26 specs
- `clickEditButtonInSidebar(name, index = 1)` -- used in 25 specs
- `openPageFromTocMenu()` -- used in 25 specs
- `clickMoreSettings()` -- used in 24 specs
- `openSubscribeSettingsWindow()` -- used in 23 specs
- `clickSubscriptionNameEditButton()` -- used in 22 specs
- `closeTab()` -- used in 22 specs
- `cwd()` -- used in 22 specs
- `clickSendNowCheckbox()` -- used in 21 specs
- `getFilterDropdownMainDialg()` -- used in 21 specs
- `createSubscription()` -- used in 20 specs
- `enter()` -- used in 20 specs
- `getMojoPDFExportSettingsEditor()` -- used in 20 specs
- `getSubscriptionPanel()` -- used in 20 specs
- `selectExcelContents(content)` -- used in 19 specs
- `clickRangeAll()` -- used in 18 specs
- `clickRangeDropdown()` -- used in 18 specs
- `dragHeaderWidth(name, offset)` -- used in 18 specs
- `exportSubmitDossier()` -- used in 18 specs
- `getText()` -- used in 18 specs
- `inputFileName(name)` -- used in 18 specs
- `clickAdvancedSettingsButton()` -- used in 17 specs
- `clickCheckboxByPageName(name)` -- used in 17 specs
- `getExportExcelPanel()` -- used in 17 specs
- `getExportExcelPanelContent()` -- used in 17 specs
- `getSubscriptionSidebarList()` -- used in 17 specs
- `inputNote(note)` -- used in 17 specs
- `isExportDisabled()` -- used in 17 specs
- `isExporttoPDFPresent()` -- used in 17 specs
- `openCustomAppById()` -- used in 17 specs
- `selectDetailLevel(dropDownOption)` -- used in 17 specs
- `selectExportToPDFOnVisualizationMenu(title)` -- used in 17 specs
- `selectFilterSummary(dropDownOption)` -- used in 17 specs
- `tabForward()` -- used in 17 specs
- `togglePageNumbersCheckBox()` -- used in 17 specs
- `clickExportButton()` -- used in 16 specs
- `clickFilterOption(name)` -- used in 16 specs
- `closeSubscribe()` -- used in 16 specs
- `getContentPanel()` -- used in 16 specs
- `getInfoWindowSubscriptionPanel()` -- used in 16 specs
- `inputName(text)` -- used in 16 specs
- `isSidebarEditPresentByName(name)` -- used in 16 specs
- `isSidebarRunNowPresentByName(name)` -- used in 16 specs
- `isSubscriptionEditPresent()` -- used in 16 specs
- `isSubscriptionRunNowPresent()` -- used in 16 specs
- `isUnSubscribePresent()` -- used in 16 specs
- `isUnSubscribePresentByName(name)` -- used in 16 specs
- `navigateLink()` -- used in 16 specs
- `searchRecipient(name)` -- used in 16 specs
- `clickExportExcelButton()` -- used in 15 specs
- `clickInfoWindowEdit(isValid = true)` -- used in 15 specs
- `clickSend()` -- used in 15 specs
- `isShowDataExportTypePresent()` -- used in 15 specs
- `selectGrid(gridName)` -- used in 15 specs
- `selectListViewMode()` -- used in 15 specs
- `selectPortraitOrientation()` -- used in 15 specs
- `waitForLoadingButtonToDisappear(timeout = 60000)` -- used in 15 specs
- `clickArrowByChapterName(name)` -- used in 14 specs
- `isLibraryExportPDFSettingsWindowOpen()` -- used in 14 specs
- `keys()` -- used in 14 specs
- `clickClearAllFiltersButton()` -- used in 13 specs
- `getExportExcelSettingsPanel()` -- used in 13 specs
- `isExportPDFEnabled()` -- used in 13 specs
- `linkToTargetByGridContextMenu()` -- used in 13 specs
- `openExcelRangeSetting()` -- used in 13 specs
- `selectSchedule(dropDownOption)` -- used in 13 specs
- `toMatchExcel()` -- used in 13 specs
- `clickApplyButton()` -- used in 12 specs
- `clickUnsubscribeYes()` -- used in 12 specs
- `editDossierFromLibrary()` -- used in 12 specs
- `getRangeCheckboxStatus(name)` -- used in 12 specs
- `isExporttoCSVPresent()` -- used in 12 specs
- `isExporttoExcelPresent()` -- used in 12 specs
- `openReportNoWait()` -- used in 12 specs
- `selectRecipients(userList, groupName = 'None')` -- used in 12 specs
- `clickBackButton()` -- used in 11 specs
- `clickCompressZipFileCheckbox()` -- used in 11 specs
- `clickVizExportButton()` -- used in 11 specs
- `inputBookmark(text)` -- used in 11 specs
- `openDashboardPropertiesMenu()` -- used in 11 specs
- `openFileMenu()` -- used in 11 specs
- `waitForLibraryLoading()` -- used in 11 specs
- `clickEventScheduleOptions(options)` -- used in 10 specs
- `clickExpandPageByCheckbox()` -- used in 10 specs
- `clickReportShareMenuExportButton()` -- used in 10 specs
- `clickShowDataCloseButton()` -- used in 10 specs
- `getRSDExportDialog()` -- used in 10 specs
- `log()` -- used in 10 specs
- `openAllSectionList()` -- used in 10 specs
- `openPDFSettingsMenu()` -- used in 10 specs
- `OpenScheduleOptions()` -- used in 10 specs
- `selectLandscapeOrientation()` -- used in 10 specs
- `selectShowDataOnVisualizationMenu()` -- used in 10 specs
- `waitForExportComplete({ name, fileType })` -- used in 10 specs
- `clickExportToPDFTab()` -- used in 9 specs
- `clickFilterContent()` -- used in 9 specs
- `clickOKButton()` -- used in 9 specs
- `clickReportExportToExcel()` -- used in 9 specs
- `clickShareMenuExportButton()` -- used in 9 specs
- `clickSubscriptionSortByOption(name)` -- used in 9 specs
- `clickVisualizationExportButton()` -- used in 9 specs
- `deselectListViewMode()` -- used in 9 specs
- `editPromptInSubscription(name)` -- used in 9 specs
- `getRangePanel()` -- used in 9 specs
- `getScheduleOptionsDialog()` -- used in 9 specs
- `isExporttoGoogleSheetsPresent()` -- used in 9 specs
- `isSubscriptionNotePresent()` -- used in 9 specs
- `isVizualizationExportExcelDialogwOpen()` -- used in 9 specs
- `openInfoWindowFromListView()` -- used in 9 specs
- `selectExportToExcelOnVisualizationMenu()` -- used in 9 specs
- `toggleTableofContentsCheckBox()` -- used in 9 specs
- `waitForItemLoading()` -- used in 9 specs
- `clickCheckboxByChapterName(name)` -- used in 8 specs
- `clickFilterType()` -- used in 8 specs
- `clickPDFRangeSetting()` -- used in 8 specs
- `clickPromptIndexByTitle()` -- used in 8 specs
- `clickShowDataExportButton()` -- used in 8 specs
- `clickSidebarUnsubscribe(name)` -- used in 8 specs
- `exportRSD()` -- used in 8 specs
- `getDashboardPropertiesExportToPDFDialog()` -- used in 8 specs
- `getInfoWindowCSVExportDialog()` -- used in 8 specs
- `inputEmailSubject(subject)` -- used in 8 specs
- `selectMojoOrientation(option)` -- used in 8 specs
- `selectMojoPageSize(dropDownOption)` -- used in 8 specs
- `setFontStyle(index)` -- used in 8 specs
- `clickCloseButton()` -- used in 7 specs
- `clickCSVDelimiterDropdown()` -- used in 7 specs
- `clickDelimiterOption(option)` -- used in 7 specs
- `clickInfoWindowExportButton()` -- used in 7 specs
- `clickSidebarCancel()` -- used in 7 specs
- `clickSwitchRight()` -- used in 7 specs
- `getAllCheckboxStatus()` -- used in 7 specs
- `getContentsSetting()` -- used in 7 specs
- `getMarginOption()` -- used in 7 specs
- `inputSubscriptionName(text)` -- used in 7 specs
- `inputZipFileName(text)` -- used in 7 specs
- `inputZipFilePW(text)` -- used in 7 specs
- `isExportExcelDisable()` -- used in 7 specs
- `selectGridOnly(gridName)` -- used in 7 specs
- `selectMojoFilterSummary(dropDownOption)` -- used in 7 specs
- `toggleHeaderCheckBox()` -- used in 7 specs
- `checkGoogleSheetsURLPrefix()` -- used in 6 specs
- `clickCloseDossierButton()` -- used in 6 specs
- `clickOnlyByChapterName(name)` -- used in 6 specs
- `clickReportMoreSettings()` -- used in 6 specs
- `clickSaveDossierButton()` -- used in 6 specs
- `exitInfoWindowPDFSettingsMenu()` -- used in 6 specs
- `getExportPreview()` -- used in 6 specs
- `getMenuContent()` -- used in 6 specs
- `getReportExportPDFPanel()` -- used in 6 specs
- `getReportExportToExcelDialog()` -- used in 6 specs
- `getVizList()` -- used in 6 specs
- `isGetAllowUnsubscribePresent()` -- used in 6 specs
- `isRSDExportTypePresent(type)` -- used in 6 specs
- `isVisExportPDFSettingsWindowOpen()` -- used in 6 specs
- `openExportCSVSettingsWindow()` -- used in 6 specs
- `run()` -- used in 6 specs
- `selectExportOnVisualizationMenu()` -- used in 6 specs
- `selectRecipientGroup(groupName)` -- used in 6 specs
- `waitForExist()` -- used in 6 specs
- `clickAllowChangeDeliveryCheckbox()` -- used in 5 specs
- `clickAllowChangePersonalizationCheckbox()` -- used in 5 specs
- `clickExpandAllPageByFields()` -- used in 5 specs
- `clickExpandLayoutsCheckbox()` -- used in 5 specs
- `clickExportExcelFromIW()` -- used in 5 specs
- `clickExportPageByInfoCheckbox()` -- used in 5 specs
- `clickExportPageByInformation()` -- used in 5 specs
- `clickFilterOptionOnly(name)` -- used in 5 specs
- `clickHamburgerMenu()` -- used in 5 specs
- `clickInfoWindowReportExportButton()` -- used in 5 specs
- `clickReactAdvanceMode()` -- used in 5 specs
- `clickShare()` -- used in 5 specs
- `clickUndo()` -- used in 5 specs
- `deleteRecipient(name)` -- used in 5 specs
- `getConditionalDisplayDialog()` -- used in 5 specs
- `getDeliverySettingsSection()` -- used in 5 specs
- `getExportCSVPanel()` -- used in 5 specs
- `getInfoWindow()` -- used in 5 specs
- `getPDFRange()` -- used in 5 specs
- `getPromptByName()` -- used in 5 specs
- `getRecipientsSettingsSection()` -- used in 5 specs
- `getSidebarPDFSettingsPanel()` -- used in 5 specs
- `goToPage()` -- used in 5 specs
- `inputBookmarkName(name)` -- used in 5 specs
- `isSubscribePresent()` -- used in 5 specs
- `moveDossierIntoViewPortAGGrid()` -- used in 5 specs
- `openMenu()` -- used in 5 specs
- `selectRange(option)` -- used in 5 specs
- `setMarginBottom(marginBottom)` -- used in 5 specs
- `setMarginLeft(marginLeft)` -- used in 5 specs
- `setMarginRight(marginRight)` -- used in 5 specs
- `setMarginTop(marginTop)` -- used in 5 specs
- `url()` -- used in 5 specs
- `clickAllowUnsubscribeCheckbox()` -- used in 4 specs
- `clickAllTab()` -- used in 4 specs
- `clickContextMenuIconInGrid()` -- used in 4 specs
- `clickCustomizedDropdown(option)` -- used in 4 specs
- `clickCustomizeHeaderFooter()` -- used in 4 specs
- `clickDropdownOption(dropdownLabel, optionText)` -- used in 4 specs
- `clickExpandGridCheckbox()` -- used in 4 specs
- `clickExportGoogleSheetsButton()` -- used in 4 specs
- `clickExportPDFIcon()` -- used in 4 specs
- `clickFormatDropdown()` -- used in 4 specs
- `clickReactDropdownOption(dropdownLabel, optionText)` -- used in 4 specs
- `clickSidebarSave()` -- used in 4 specs
- `clickTextfieldByTitle()` -- used in 4 specs
- `clickTimeScheduleOptions(options)` -- used in 4 specs
- `clickUnsubscribe()` -- used in 4 specs
- `clickUseTimezonesCheckbox()` -- used in 4 specs
- `closeExportCompleteNotification()` -- used in 4 specs
- `confirmValues()` -- used in 4 specs
- `customizeHeaderFooterWithText(index, text)` -- used in 4 specs
- `exitPDFSettingsMenu()` -- used in 4 specs
- `getExcelContents()` -- used in 4 specs
- `getPDFSettingsPanel()` -- used in 4 specs
- `getReportCsvPanel()` -- used in 4 specs
- `getSharePanel()` -- used in 4 specs
- `isDisplayed()` -- used in 4 specs
- `isDossierExportPDFSettingsWindowOpen()` -- used in 4 specs
- `isExportCompleteNotificationPresent()` -- used in 4 specs
- `isExportCSVEnabled()` -- used in 4 specs
- `openMQFirstValue()` -- used in 4 specs
- `openSearchSlider()` -- used in 4 specs
- `selectBookmark(dropDownOption)` -- used in 4 specs
- `selectExcelRange(option)` -- used in 4 specs
- `waitForSearchLoading()` -- used in 4 specs
- `addSingle()` -- used in 3 specs
- `checkListSummary()` -- used in 3 specs
- `chooseElement()` -- used in 3 specs
- `clickAdvanceModeOkButton()` -- used in 3 specs
- `clickClearAllButton()` -- used in 3 specs
- `clickEditContentArrow()` -- used in 3 specs
- `clickElmInAvailableList()` -- used in 3 specs
- `clickExportCSVButton()` -- used in 3 specs
- `clickExportFilterDetails()` -- used in 3 specs
- `clickExportReportTitle()` -- used in 3 specs
- `clickFormatCheckbox()` -- used in 3 specs
- `clickLibraryExportButton()` -- used in 3 specs
- `clickSelectAllButton()` -- used in 3 specs
- `clickShowFiltersCheckbox()` -- used in 3 specs
- `closeConditionalDisplayDialog()` -- used in 3 specs
- `customCredentials()` -- used in 3 specs
- `getDialogPanel()` -- used in 3 specs
- `getExportExcelButton()` -- used in 3 specs
- `getExportPDFButton()` -- used in 3 specs
- `getFTPSettingsDialog()` -- used in 3 specs
- `getInfoWindowEditPanel()` -- used in 3 specs
- `getInfoWindowPDFSettingsPanel()` -- used in 3 specs
- `getMojoPdfExportSettings()` -- used in 3 specs
- `getPromptDialog()` -- used in 3 specs
- `getVisualizationMenuButton()` -- used in 3 specs
- `goBackFromDossierLink()` -- used in 3 specs
- `hoverOnContextMenuShareItem()` -- used in 3 specs
- `inputCustomizeFooter(name)` -- used in 3 specs
- `inputCustomizeHeader(name)` -- used in 3 specs
- `inputTextAndSearch()` -- used in 3 specs
- `isExportGoogleSheetsEnabled()` -- used in 3 specs
- `isLibraryExportExcelWindowOpen()` -- used in 3 specs
- `isRunAsExcelIconPresent()` -- used in 3 specs
- `isRunAsPDFIconPresent()` -- used in 3 specs
- `isShowDataExportButtonAvailable()` -- used in 3 specs
- `isUseTimezonesCheckboxChecked()` -- used in 3 specs
- `openConditionalDisplayDialog()` -- used in 3 specs
- `openContentByOrder(i)` -- used in 3 specs
- `OpenDocumentSingleVisualizationMenuButton(title)` -- used in 3 specs
- `OpenElementMenu()` -- used in 3 specs
- `openGlobalResultInfoWindow()` -- used in 3 specs
- `openInfoWindow()` -- used in 3 specs
- `openRangeDialog()` -- used in 3 specs
- `pressEnter()` -- used in 3 specs
- `resetDossierIfPossible()` -- used in 3 specs
- `search()` -- used in 3 specs
- `searchRecipientByName(searchKey)` -- used in 3 specs
- `selectDataDelimiter(dropDownOption)` -- used in 3 specs
- `selectExcelExpandAllPageby(dropDownOption)` -- used in 3 specs
- `selectGridSettings(buttonName)` -- used in 3 specs
- `toBeUndefined()` -- used in 3 specs
- `waitForEditor()` -- used in 3 specs
- `waitForExportLoadingButtonToDisappear(timeout = 60000)` -- used in 3 specs
- `addAll()` -- used in 2 specs
- `arrowDown()` -- used in 2 specs
- `cancelExportSettingsVisualization()` -- used in 2 specs
- `checkMultiQualSummary()` -- used in 2 specs
- `clearAndInputValues()` -- used in 2 specs
- `clickAdjuectMarginCheckbox()` -- used in 2 specs
- `clickCell()` -- used in 2 specs
- `clickCSVRangeSetting()` -- used in 2 specs
- `clickExportReportTitleCheckbox()` -- used in 2 specs
- `clickInfoWindowIconInGrid()` -- used in 2 specs
- `clickOnlyByPageName(name)` -- used in 2 specs
- `clickReactAdjustMarginCheckbox()` -- used in 2 specs
- `clickReactLockButton(option)` -- used in 2 specs
- `clickReactVizExportButton()` -- used in 2 specs
- `clickReportExportButton()` -- used in 2 specs
- `clickReportExportPageByInfoCheckbox()` -- used in 2 specs
- `clickRSDExportButton()` -- used in 2 specs
- `clickSendNotificationCheckbox()` -- used in 2 specs
- `closeExportPDFSettingsWindow()` -- used in 2 specs
- `customizeHeaderFooterWithImage(index)` -- used in 2 specs
- `detailLevelSelectedItem()` -- used in 2 specs
- `dragZoomSlider(direction, pixels)` -- used in 2 specs
- `editDossierByUrl()` -- used in 2 specs
- `enableABAlocator()` -- used in 2 specs
- `ExportDocumentSingleVisualization(type)` -- used in 2 specs
- `exportShowData()` -- used in 2 specs
- `FilterSummarySelectedItem()` -- used in 2 specs
- `getExcelDropDownContents()` -- used in 2 specs
- `getExcelRange()` -- used in 2 specs
- `getExportButton()` -- used in 2 specs
- `getExportPageInfo()` -- used in 2 specs
- `getFormatOptionDropdown()` -- used in 2 specs
- `getGridList()` -- used in 2 specs
- `getMainInfo()` -- used in 2 specs
- `getNewConditionDialog()` -- used in 2 specs
- `getPromptEditor()` -- used in 2 specs
- `getRangeDropDownContents()` -- used in 2 specs
- `getRSDExportExcelPanel()` -- used in 2 specs
- `getRsdGridByKey()` -- used in 2 specs
- `hoverOnGrid(gridName)` -- used in 2 specs
- `input()` -- used in 2 specs
- `inputDataDelimiter(Delimiter)` -- used in 2 specs
- `inputDelimiter(option)` -- used in 2 specs
- `inputMessage(note)` -- used in 2 specs
- `inputRecipient(name)` -- used in 2 specs
- `inputValues()` -- used in 2 specs
- `isExportExcelButtonPresent()` -- used in 2 specs
- `isExportExcelEnabled()` -- used in 2 specs
- `isPortraitOrientationButtonSelected()` -- used in 2 specs
- `isRangeDropDownListOpen()` -- used in 2 specs
- `isRSDRangeDropDownListOpen()` -- used in 2 specs
- `isSendNowPresent()` -- used in 2 specs
- `isSingleVisualizationExportSpinnerPresent()` -- used in 2 specs
- `logoutClearCacheAndLogin()` -- used in 2 specs
- `navigateLinkByText()` -- used in 2 specs
- `openConditionDropdown()` -- used in 2 specs
- `openRSDVisualizationMenu()` -- used in 2 specs
- `openShowFilterDropdown()` -- used in 2 specs
- `openSubscriptionSnapshotByName(name)` -- used in 2 specs
- `pageSizeSelectedItem()` -- used in 2 specs
- `selectCondition()` -- used in 2 specs
- `selectCustomizedSetting(option)` -- used in 2 specs
- `selectFilteroption(option)` -- used in 2 specs
- `selectFontType()` -- used in 2 specs
- `selectRecipient(name)` -- used in 2 specs
- `selectType(dropDownOption)` -- used in 2 specs
- `setFontColor(index)` -- used in 2 specs
- `setFontHorizontalAlignment(index)` -- used in 2 specs
- `setFontSize(value)` -- used in 2 specs
- `setFontVerticalAlignment(index)` -- used in 2 specs
- `setReactMarginBottom(marginBottom)` -- used in 2 specs
- `setReactMarginLeft(marginLeft)` -- used in 2 specs
- `setReactMarginRight(marginRight)` -- used in 2 specs
- `setReactMarginTop(marginTop)` -- used in 2 specs
- `showTooltipOfExportPDFIcon()` -- used in 2 specs
- `switchCustomApp()` -- used in 2 specs
- `toggleExpandAllGridDataCheckBox()` -- used in 2 specs
- `toggleFilterSummaryCheckBox()` -- used in 2 specs
- `toggleMojoShowHeader()` -- used in 2 specs
- `toggleRepeatAttributeColumnsCheckBox()` -- used in 2 specs
- `waitForGridLoaded()` -- used in 2 specs
- `waitForSummaryItem()` -- used in 2 specs
- `waitLoadingDataPopUpIsNotDisplayed()` -- used in 2 specs
- `actionOnToolbar()` -- used in 1 specs
- `addRecipient(name)` -- used in 1 specs
- `backToLibrary()` -- used in 1 specs
- `clickAddNewAddressButton()` -- used in 1 specs
- `clickAddressCancelButton()` -- used in 1 specs
- `clickAddressNameTextBox()` -- used in 1 specs
- `clickAddToLibraryButton()` -- used in 1 specs
- `clickAdjustMarginCheckbox()` -- used in 1 specs
- `clickAllowUnsubscribe()` -- used in 1 specs
- `clickDossierContextMenuItem()` -- used in 1 specs
- `clickDossierRow()` -- used in 1 specs
- `clickDropdown()` -- used in 1 specs
- `clickEmailAddressTextBox()` -- used in 1 specs
- `clickExpandPageBy()` -- used in 1 specs
- `clickExportToCSV()` -- used in 1 specs
- `clickExportToCsvItemInContextMenu()` -- used in 1 specs
- `clickExportToExcelTab()` -- used in 1 specs
- `clickExportToPDF()` -- used in 1 specs
- `clickLockButton(option)` -- used in 1 specs
- `clickReactExpandGridCheckbox()` -- used in 1 specs
- `clickReactLandscapeButton()` -- used in 1 specs
- `clickReactPaperSizeDropdownOption(dropdownLabel, optionText)` -- used in 1 specs
- `clickReactScaleGridCheckbox()` -- used in 1 specs
- `clickReactShowFiltersCheckbox()` -- used in 1 specs
- `clickReactShowTableOfContentsCheckbox()` -- used in 1 specs
- `clickReportIWExportCancelButton()` -- used in 1 specs
- `clickRunNowInSubscriptionListByName(name, index = 1)` -- used in 1 specs
- `clickScaleGridCheckbox()` -- used in 1 specs
- `clickShareIconInGrid()` -- used in 1 specs
- `clickShowDataExportButtonNoPrivilege()` -- used in 1 specs
- `clickShowTableOfContentsCheckbox()` -- used in 1 specs
- `clickSubFolderRadioButton()` -- used in 1 specs
- `clickSubscribeToDashboard()` -- used in 1 specs
- `clickTitlebarExportCSVButton(vizName)` -- used in 1 specs
- `clickTitlebarExportExcelButton(vizName)` -- used in 1 specs
- `clickTitlebarExportPDFButton(vizName)` -- used in 1 specs
- `clickUsersRadioButton()` -- used in 1 specs
- `clickViewAll()` -- used in 1 specs
- `clickZoomInIcon()` -- used in 1 specs
- `clickZoomOutIcon()` -- used in 1 specs
- `closeDialog()` -- used in 1 specs
- `closeNewConditionDialog()` -- used in 1 specs
- `deleteConditionByElement()` -- used in 1 specs
- `deleteDataset()` -- used in 1 specs
- `exportDataset()` -- used in 1 specs
- `exportSubmitVisualization()` -- used in 1 specs
- `findSelectorByName()` -- used in 1 specs
- `getDashboardPropertiesExportToExcelDialog()` -- used in 1 specs
- `getExportToCSVSettingsPanel()` -- used in 1 specs
- `getExportToExcelSettingsPanel()` -- used in 1 specs
- `getExportToPDFSettingsPanel()` -- used in 1 specs
- `getLink()` -- used in 1 specs
- `getMojoPDFExportButton()` -- used in 1 specs
- `getRecipientSearchSection()` -- used in 1 specs
- `getRightClickMenu()` -- used in 1 specs
- `getSubscribeToDashboardPanel()` -- used in 1 specs
- `getSubscriptionShareResipientList()` -- used in 1 specs
- `getSubscriptionSidebarEditDialog()` -- used in 1 specs
- `hoverOnVisualizationMenuButton()` -- used in 1 specs
- `inputDeviceSubFolder(text)` -- used in 1 specs
- `inputText()` -- used in 1 specs
- `inputZoomValue(value)` -- used in 1 specs
- `isAddToLibraryDisplayed()` -- used in 1 specs
- `isExportLoadingSpinnerPresent()` -- used in 1 specs
- `isRSDExportButtonPresent(title)` -- used in 1 specs
- `isRunAsExcelIconPresentInSearchResults()` -- used in 1 specs
- `isSearchSuggestionRunAsIconDisplayed()` -- used in 1 specs
- `isSubFolderRadioAvailable()` -- used in 1 specs
- `isSubscriptionEmptyContentPresent()` -- used in 1 specs
- `openConditionalRelationDropdown()` -- used in 1 specs
- `openContentDiscovery()` -- used in 1 specs
- `openContentDropdown()` -- used in 1 specs
- `openDossierByUrl()` -- used in 1 specs
- `openDossierFromSearchResults()` -- used in 1 specs
- `openExportToGoogleSheetsDialog()` -- used in 1 specs
- `openFolderByPath()` -- used in 1 specs
- `openMenuOnVisualization()` -- used in 1 specs
- `openNewConditionDialog()` -- used in 1 specs
- `openPaperSizeDropdown()` -- used in 1 specs
- `openRangeDropdown()` -- used in 1 specs
- `openReactShowFilterDropdown()` -- used in 1 specs
- `openSidebarOnly()` -- used in 1 specs
- `removeAll()` -- used in 1 specs
- `selectConditionRelation()` -- used in 1 specs
- `selectElementInList()` -- used in 1 specs
- `selectExportToGoogleSheetsOnVisualizationMenu()` -- used in 1 specs
- `selectItemByText()` -- used in 1 specs
- `selectNewConditionElement()` -- used in 1 specs
- `selectPaperSize(option)` -- used in 1 specs
- `selectPDFContent(option)` -- used in 1 specs
- `selectPDFRange(option)` -- used in 1 specs
- `selectReactFilteroption(option)` -- used in 1 specs
- `selectSubscriptionDevice(dropDownOption)` -- used in 1 specs
- `switchUser()` -- used in 1 specs
- `toggleMojoGridRepeatColumns()` -- used in 1 specs
- `toggleMojoGridSettings(option)` -- used in 1 specs
- `toggleMojoShowPageNumber()` -- used in 1 specs
- `toString()` -- used in 1 specs
- `unhoverOnVisualizationMenuButton()` -- used in 1 specs
- `waitForSuggestionResponse()` -- used in 1 specs
- `xit()` -- used in 1 specs
- `_clickCheckbox(elem)` -- used in 0 specs
- `_isCheckBoxSelected(elem)` -- used in 0 specs
- `_isDropDownListOpen(elem)` -- used in 0 specs
- `_isOrientationButtonSelected(orientationButton)` -- used in 0 specs
- `_selectDropDownItemOption({ dropDownOption, dropDownItems })` -- used in 0 specs
- `clickAdvanceModeCancelButton()` -- used in 0 specs
- `clickClearAll()` -- used in 0 specs
- `clickContextMenu(el, prompted = false)` -- used in 0 specs
- `clickEdit(name)` -- used in 0 specs
- `clickExportCompleteCloseButton()` -- used in 0 specs
- `clickExtenColumnsOverPagesRadio()` -- used in 0 specs
- `clickFiltersOption(option)` -- used in 0 specs
- `clickFiltersOptionOnly(option)` -- used in 0 specs
- `clickFiltersType()` -- used in 0 specs
- `clickFooterCustomizedDropdown(option)` -- used in 0 specs
- `clickInWindowRunNow()` -- used in 0 specs
- `clickItemOnly()` -- used in 0 specs
- `clickLandscapeButton()` -- used in 0 specs
- `clickMenuOptionInLevel({ level, option }, prompted = false)` -- used in 0 specs
- `clickPortraitButton()` -- used in 0 specs
- `clickPromptButton()` -- used in 0 specs
- `clickRangeItem(name)` -- used in 0 specs
- `clickReactPortraitButton()` -- used in 0 specs
- `clickRepeatColumnsCheckbox()` -- used in 0 specs
- `clickScaleToPageWidthRadio()` -- used in 0 specs
- `clickScheduleOKButton()` -- used in 0 specs
- `clickSelectAll()` -- used in 0 specs
- `clickShowHeaderCheckbox()` -- used in 0 specs
- `clickShowPageNumbersCheckbox()` -- used in 0 specs
- `clickSortByDropdown()` -- used in 0 specs
- `clickSubscriptionClearFilters()` -- used in 0 specs
- `clickSubscriptionFilterApply()` -- used in 0 specs
- `clickSwitchLeft()` -- used in 0 specs
- `clickViewPromptToggle()` -- used in 0 specs
- `deselectCheckBox(elem)` -- used in 0 specs
- `disableSendNowInReport()` -- used in 0 specs
- `enableSendNowInReport()` -- used in 0 specs
- `exportByTab()` -- used in 0 specs
- `exportSubmitPrompt()` -- used in 0 specs
- `getBookmarkDropdown()` -- used in 0 specs
- `getConditionTooltipText()` -- used in 0 specs
- `getCurrentBookmarkSelection()` -- used in 0 specs
- `getDataDelimiterDropdown()` -- used in 0 specs
- `getDeviceDropdown()` -- used in 0 specs
- `getExcelExpandAllPagebyDropdown()` -- used in 0 specs
- `getExportCompleteDescriptionText()` -- used in 0 specs
- `getFormatDropdown()` -- used in 0 specs
- `getFormatDropdownOptionValues()` -- used in 0 specs
- `getFormatItem()` -- used in 0 specs
- `getGroupMemberCount(name)` -- used in 0 specs
- `getScheduleDropdown()` -- used in 0 specs
- `getScheduleDropdownOptionValues()` -- used in 0 specs
- `getScheduleItem()` -- used in 0 specs
- `getSubscriptionNameText()` -- used in 0 specs
- `getSubscriptionPropertyBySubscriptionName(subscriptionName, propertyName)` -- used in 0 specs
- `getTypeDropdown()` -- used in 0 specs
- `inputFileNameDelimiter(character)` -- used in 0 specs
- `inputNote(text)` -- used in 0 specs
- `isAutoOrientationButtonSelected()` -- used in 0 specs
- `isExportCompleteCloseButtonVisible()` -- used in 0 specs
- `isExportCompleteNotificationVisible()` -- used in 0 specs
- `isExportIndvlVizsCheckBoxSelected()` -- used in 0 specs
- `isFilterSummaryTabSelected()` -- used in 0 specs
- `isFooterCheckBoxEnabled()` -- used in 0 specs
- `isHeaderCheckBoxEnabled()` -- used in 0 specs
- `isHeaderCheckBoxSelected()` -- used in 0 specs
- `isLandScapeOrientationButtonSelected()` -- used in 0 specs
- `isLayoutTabSelected()` -- used in 0 specs
- `isPageNumbersCheckBoxSelected()` -- used in 0 specs
- `isRepeatAttributeColumnsEnabled()` -- used in 0 specs
- `isSidebarContainerPrenent()` -- used in 0 specs
- `isSubscriptionExisted(name)` -- used in 0 specs
- `isUnsubscribeDisabledPresent()` -- used in 0 specs
- `openAdvancedSettingsPanel()` -- used in 0 specs
- `openExcelContentsSetting()` -- used in 0 specs
- `openScheduleDropdown()` -- used in 0 specs
- `openVisualizationMenu({ elem, offset })` -- used in 0 specs
- `searchSidebarRecipient(name)` -- used in 0 specs
- `selectCenterCustomizedOptions(option1, option2)` -- used in 0 specs
- `selectCheckBox(elem, shouldDeselect = false)` -- used in 0 specs
- `selectContentDropDownItemOption(dropDownOption)` -- used in 0 specs
- `selectExcelContent(option)` -- used in 0 specs
- `selectExcelRange(dropDownOption)` -- used in 0 specs
- `selectFormatSegmentControl(option)` -- used in 0 specs
- `selectLeftCustomizedDropdown(option)` -- used in 0 specs
- `selectLeftCustomizedOptions(option1, option2)` -- used in 0 specs
- `selectPaperSizeDropDownItemOption(dropDownOption)` -- used in 0 specs
- `selectRightCustomizedOptions(option1, option2)` -- used in 0 specs
- `selectSidebarRecipients(userList, groupName = 'None')` -- used in 0 specs
- `selectSortDirection(dir)` -- used in 0 specs
- `selectVisualizationMenuOptions({ elem, offset, firstOption, secondOption, thirdOption })` -- used in 0 specs
- `setCenterCustomizedImage(option, image)` -- used in 0 specs
- `setCenterCustomizedText(option, text)` -- used in 0 specs
- `setFooterCenterCustomizedText(option, text)` -- used in 0 specs
- `setFooterLeftCustomizedText(option, text)` -- used in 0 specs
- `setFooterRightCustomizedText(option, text)` -- used in 0 specs
- `setLeftCustomizedImage(option, image)` -- used in 0 specs
- `setLeftCustomizedText(option, text)` -- used in 0 specs
- `setRightCustomizedImage(option, image)` -- used in 0 specs
- `setRightCustomizedText(option, text)` -- used in 0 specs
- `toggleScheduleTab()` -- used in 0 specs
- `toggleSendPreviewNow(toggleOn = true)` -- used in 0 specs
- `updateSubscriptionName(name)` -- used in 0 specs
- `waitForBookmarkLoaded()` -- used in 0 specs
- `waitForExportComplete(appearTimeout = 10000)` -- used in 0 specs
- `waitForSelectedBookmarkLoaded()` -- used in 0 specs
- `waitForSelectedFormatLoaded()` -- used in 0 specs
- `waitForSelectedScheduleLoaded()` -- used in 0 specs
- `waitForSubscriptionActionButtonsTobeEnabled(elem)` -- used in 0 specs
- `waitForSubscriptionCreated()` -- used in 0 specs

## Source Coverage

- `pageObjects/export/**/*.js`
- `specs/regression/export/**/*.{ts,js}`
- `specs/regression/libraryExport/**/*.{ts,js}`
- `specs/regression/runAsExport/**/*.{ts,js}`
