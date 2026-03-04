# Site Knowledge: Web Preference Domain

## Overview

- **Domain key:** `web_preference`
- **Components covered:** BasePreference, ChangePasswordForm, ChangePWD, ColorPalettePage, DistributionServicesPage, DrillModePage, DynamicAddressList, ExportReportsPage, FolderBrowsingPage, GeneralPage, GraphDisplayPage, GridDisplayPage, HistoryListPage, NavigationBar, OfficePage, PrintReportsPage, ProjectDispalyPage, PromptPage, ReportServicesPage, SchedulePage, SecurityPage, ToolBar, WebPreferencePage
- **Spec files scanned:** 0
- **POM files scanned:** 23

## Components

### BasePreference
- **CSS root:** `.mstrPanelButtonBar`
- **User-visible elements:**
  - Alert Dialog (`.mstrmojo-Editor.mstrmojo-alert.modal`)
  - Confirm Message (`.mstrPrefUpdateConfirmation, .mstrAlertTitle`)
  - Error Alert (`.mstrAlertTitle`)
  - Panel Button Bar (`.mstrPanelButtonBar`)
  - Preference Panel (`.mstrPanelPortrait`)
  - Preferences Body (`.mstrPanelBody`)
  - Preference Toolbar (`.mstrToolbarGroup`)
  - Update Confirmation (`.mstrPrefUpdateConfirmation`)
- **Component actions:**
  - `apply()`
  - `applyChanges()`
  - `check(el)`
  - `checkSetting(value)`
  - `clickChangePasswordBtn()`
  - `clickDefaultStartPage(index)`
  - `clickLevelPreferencePage(level, page)`
  - `clickLoadDefaultValueBtn()`
  - `closePreferencePage()`
  - `getCellCssValue(label, cssName)`
  - `getErrorAlertText()`
  - `getInputboxText(label)`
  - `getUpdateConfirmationText()`
  - `inputSetting(label, value)`
  - `isDropdownOptionSelected(value, option)`
  - `isLoadDefaultValueBtnExisted()`
  - `isSettingChecked(value)`
  - `loadDefaultValue(level, page)`
  - `scrollPreferenceIntoView()`
  - `setApplyTo(value)`
  - `setValueForDropdown(dropdown, value)`
  - `setValueForDropdownsetting(value, option)`
  - `uncheck(el)`
  - `uncheckSetting(value)`
  - `waitForComfirmMessageAppear()`
- **Related components:** clickLevelPreferencePage, getDefaultStartPage, getPanel, getPreferencePanel, scrollWebPage

### ChangePasswordForm
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickCancel()`
  - `clickChangePassword()`
  - `clickContinue()`
  - `getSuccessMessage()`
  - `inputNewPassword(newPassword)`
  - `inputNewPasswordVerification(newPassword)`
  - `inputOldPassword(oldPassword)`
- **Related components:** _none_

### ChangePWD
- **CSS root:** `.mstrAlertMessage`
- **User-visible elements:**
  - Error Message (`.mstrAlertMessage`)
  - Success Message (`.message`)
- **Component actions:**
  - `changePassword(oldPassword, newPassword)`
  - `changePasswordWithError(oldPassword, newPassword)`
  - `clickCancel()`
  - `clickChangePassword()`
  - `clickContinue()`
  - `getErrorMessageText()`
  - `getSuccessMessageText()`
  - `inputNewPassword(newPassword)`
  - `inputNewPasswordVerification(newPassword)`
  - `inputOldPassword(oldPassword)`
  - `openChangePasswordPage()`
- **Related components:** _none_

### ColorPalettePage
- **CSS root:** `.mstrmojo-ui-Menu-item-container`
- **User-visible elements:**
  - Add APalette Button (`.mstrmojo-Label.newPalette`)
  - Color Handle (`.cwHandle`)
  - Color HEXInput Box (`.mstrmojo-TextBoxWithLabel.on .mstrmojo-TextBox`)
  - Color List (`.mstrmojo-ListBase.mstrmojo-ui-ColorList`)
  - Color Picker Palette Btn (`.acpBtn.acpPaletteBtn`)
  - Color Picker Swatch Btn (`.acpBtn.acpSwatchBtn`)
  - Color Wheel (`.mstrmojo-ui-ColorWheel`)
  - Confirm Delete Dialog (`.mstrmojo-Editor.mstrmojo-alert.modal`)
  - Default Palette (`.mstrmojo-ui-PreviewButton .cf .preview .paletteColors`)
  - Ok Button From Color Editor (`.mstrmojo-Button.mstrmojo-WebButton.hot.mstrmojo-Editor-button .mstrmojo-Button-text`)
  - Palette Container Menu (`.mstrmojo-ui-Menu-item-container`)
  - Palette Dropdown List (`.mstrmojo-popupList-scrollBar.mstrmojo-scrollNode`)
  - Palette Editor Name Input Box (`.mstrmojo-TextBoxWithLabel.paletteName .mstrmojo-TextBox`)
  - Palette List (`.mstrmojo-Box.mstrmojo-PaletteList`)
  - Select Default Palette Dropdown (`.mstrmojo-ui-PreviewButton .cf .btn`)
  - Selected Color List (`.mstrmojo-ListBase.mstrmojo-PaletteColorList.mstrmojo-ui-ColorList .ColorsContainer`)
  - Selected Color Tooltip (`.mstrmojo-Tooltip-content.mstrmojo-scrollNode`)
- **Component actions:**
  - `addColorFromColorList(colorlist)`
  - `addColorFromColorWheel(colorwheel)`
  - `addPalette(name, colorlist, colorwheel)`
  - `addPaletteWithAlert(colorlist)`
  - `checkSpecifiedPaletteCheckbox(text)`
  - `clickOkOnAlertDialog()`
  - `deleteAllEditablePalettes()`
  - `deletePalette(palettelist)`
  - `getDefaultPaletteTitle()`
  - `getNoprivilegeAlertText()`
  - `isSpecifiedColorPaletteCheckboxChecked(text)`
  - `isSpecifiedColorPaletteExist(text)`
  - `numberOfEditablePalettes()`
  - `openPaletteEditor(text)`
  - `removeColorFromSelectedColorList(color)`
  - `renamePaletteInPaletteEditor(text)`
  - `renamePaletteInPaletteListPage(text1, text2)`
  - `savePalette()`
  - `selectDefaultPalette(text)`
  - `uncheckSpecifiedPaletteCheckbox(text)`
  - `waitForCircleDisappear(text)`
  - `waitForPaletteDisappear(palette)`
- **Related components:** getEditablePaletteContainer, getPaletteContainer, getPreferencePanel, getSpecifiedPaletteContainer, scrollPage

### DistributionServicesPage
- **CSS root:** `.addressesList.mstrListView tbody`
- **User-visible elements:**
  - Address List (`.addressesList.mstrListView tbody`)
  - Address Name Input Box (`#dispName`)
  - Device Drop Down (`#deviceID`)
  - Physical Address Input Box (`#addressValue`)
- **Component actions:**
  - `addAddress({ addressName, physicalAddress, device })`
  - `deleteAllAddresses()`
  - `deleteSpecifiedAddressItem(text)`
  - `editAddress(text, { addressName, physicalAddress, device })`
  - `inputAddressName(text)`
  - `inputPhysicalAddress(text)`
  - `isaddAddressBtnExist()`
  - `isRadioBtnSelected(text)`
  - `isSpecifiedAddressItemPresent(text)`
  - `numberOfContents()`
  - `saveNewlyAddedAddress()`
  - `setDefault(text)`
  - `setValueForDeviceDropDown(value)`
- **Related components:** _none_

### DrillModePage
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `checkDisableHyperLink(level, page)`
  - `checkGroupDrill(level, page)`
  - `checkOpenInNewWindow(level, page)`
  - `checkSortDrillPath(level, page)`
  - `selectDisplayAdvancedDrillAsSubMenus(level, page)`
  - `setDrillWithinBehavior(level, page, value)`
  - `setKeepParent(level, page, value)`
  - `setKeepThresholds(level, page, value)`
  - `setReportDrillOption(level, page, value)`
  - `setRsdDrillOption(level, page, value)`
  - `uncheckEnableContextMenuDrilling(level, page)`
- **Related components:** clickLevelPreferencePage

### DynamicAddressList
- **CSS root:** `.mstrmojo-DataGrid-itemsContainer .mstrmojo-itemwrap-table`
- **User-visible elements:**
  - Address List (`.mstrmojo-DataGrid-itemsContainer .mstrmojo-itemwrap-table`)
  - Create Dialog (`.mstrmojo-Editor.mstrmojo-DRLEditor.modal`)
  - Delete Confirm Dialog (`.mstrmojo-Editor.mstrmojo-alert.modal`)
  - Search Result List (`.mstrmojo-Booklet.mstrmojo-OB-booklet`)
  - Select Report Dialog (`.mstrmojo-Editor.SREditor.modal`)
- **Component actions:**
  - `addDynamicAddressList({ name, store, physicaladdress })`
  - `clickAddNewBtn()`
  - `clickEditBtn(value)`
  - `deleteAllAddresses()`
  - `deleteSpecifiedAddressItem(value)`
  - `editDynamicAddressList({ name1, name2, store, physicaladdress })`
  - `isSpecifiedAddressItemPresent(value)`
  - `numberOfContents()`
  - `openSearchReportDialog()`
  - `searchReport(name)`
  - `selectReport(name, store)`
  - `setForPropertyDropdown(property, value)`
  - `setForStoreDropdown(dropdown, value)`
- **Related components:** getPreferencePanel

### ExportReportsPage
- **CSS root:** `#exportFormatGraphs_excelFormattingGraphsIServer`
- **User-visible elements:**
  - Export Graph To Excel Radio Button (`#exportFormatGraphs_excelFormattingGraphsIServer`)
  - Export Graph To Html Radio Button (`#exportFormatGraphs_htmlGraphs`)
  - Export Grid To Csv Radio Button (`#exportFormatGrids_csvIServer`)
  - Export Grid To Excel Radio Button (`#exportFormatGrids_excelPlaintextIServer`)
  - Export Grid To Excel With Formatting Radio Button (`#exportFormatGrids_excelFormattingGridsIServer`)
  - Export Grid To Html Radio Button (`#exportFormatGrids_htmlGrids`)
  - Export Grid To Plain Text Radio Button (`#exportFormatGrids_plaintextIServer`)
  - Export Html To Excel Radio Button (`#exportFormatDocuments_excelWithoutFormatting`)
  - Export Html To Html Radio Button (`#exportFormatDocuments_htmlDocuments`)
- **Component actions:**
  - `isExportGraphToExcelSelected()`
  - `isExportGraphToHtmlSelected()`
  - `isExportGridToCsvSelected()`
  - `isExportGridToExcelSelected()`
  - `isExportGridToExcelWithFormattingSelected()`
  - `isExportGridToHtmlSelected()`
  - `isExportGridToPlainTextSelected()`
  - `isExportHtmlToExcelSelected()`
  - `isExportHtmlToHtmlSelected()`
  - `setExportGraphToExcel()`
  - `setExportGraphToHtml()`
  - `setExportGridToCsv()`
  - `setExportGridToExcel()`
  - `setExportGridToExcelWithFormatting()`
  - `setExportGridToHtml()`
  - `setExportGridToPlainText()`
  - `setExportHtmlToExcel()`
  - `setExportReportsDropdown(value, option)`
  - `setHtmlGraphToHtml()`
- **Related components:** _none_

### FolderBrowsingPage
- **CSS root:** `#hideMyReports`
- **User-visible elements:**
  - Hide My Reports Checkbox (`#hideMyReports`)
  - Show Footer Path Checkbox (`#showFooterPath`)
- **Component actions:**
  - `checkHideMyReports()`
  - `checkShowFooterPath()`
  - `isHideMyReportsChecked()`
  - `isShowFooterPathChecked()`
- **Related components:** _none_

### GeneralPage
- **CSS root:** `#addFont`
- **User-visible elements:**
  - Add Button (`#addFont`)
  - Available Box (`#availableObjectsList`)
  - Available Fonts (`#availableFonts`)
  - Connectors Url Input Box (`#connectorWebBaseURL`)
  - Custom Font Size Input Box (`#fontSize`)
  - Link To Doc Btn (`.preferenceList tr a`)
  - Locale Dropdown (`#locale`)
  - Move Font Up Button (`#moveFontUp`)
  - MSTRLibrary Config Example (`#consumerWebBaseURL_label`)
  - MSTRLibrary Config Input Box (`#consumerWebBaseURL`)
  - Remove Button (`#removeFont`)
  - Remove From Selected Button (`.mstrIcon-btn.mstrIcon-btnArrowLeft`)
  - Selected Box (`#selectedObjectsList`)
  - Selected Fonts (`#selectedFonts`)
- **Component actions:**
  - `checkAllowQuickSearch()`
  - `checkGeneralSetting(value)`
  - `getConnectorsUrlText()`
  - `getLibraryConfigText()`
  - `getMSTRLibraryConfigExampleText()`
  - `getSearchAutoCompleteDelayText()`
  - `inputConnectorUrl(text)`
  - `inputLibraryConfigUrl(text)`
  - `inputMaxSortNumber(value)`
  - `isDropdownOptionSelectedInSection(section, value, option)`
  - `isGeneralDropdownOptionSelected(value, option)`
  - `isGeneralSettingChecked(value)`
  - `isItemExistInAvailableList(value)`
  - `isRerunAgainstWarehouseSelected()`
  - `isUseDefaultFontSelected()`
  - `isUseDefaultFontSizeSelected()`
  - `linkToDoc()`
  - `localeText()`
  - `removeFromSelected(value)`
  - `setAdminInfo(text)`
  - `setCustomFont(font)`
  - `setCustomFontSize(text)`
  - `setIServerMsg(value)`
  - `setLanguage(value)`
  - `setLanguageSection(value, unit, timezone)`
  - `setMetadata(value)`
  - `setNumberDate(value)`
  - `setRerunAgainstWarehouse()`
  - `setSearchAutoCompleteDelay(value)`
  - `setTimeZone(value)`
  - `setUnits(value)`
  - `setValueForDropdownInSection(section, value, option)`
  - `setValueForDropDownWithID(id, value)`
  - `setValueForGeneralDropdown(value, option)`
  - `setWHData(value)`
  - `showAdvancedOptions()`
  - `uncheckAllowAutoSubmitSearch()`
  - `uncheckAllowGridViewSearch()`
  - `uncheckAllowQuickSearch()`
  - `uncheckGeneralSetting(value)`
  - `uncheckSearchObjectType(value)`
- **Related components:** getPreferencePanel

### GraphDisplayPage
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `checkGraphShowGridGraph()`
  - `getHeightText()`
  - `getImageFormatText()`
  - `getWidthText()`
  - `inputHeight(height)`
  - `inputWidth(width)`
  - `isGraphShowGridGraphChecked()`
  - `isUseCustomSettingSelected()`
  - `isUseSettingStoredSelected()`
  - `setImageFormat(value)`
  - `setUseCustomSetting()`
  - `setUseSettingStored()`
- **Related components:** _none_

### GridDisplayPage
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `checkShowDescriptionAsTooltip()`
  - `checkShowPageBy()`
  - `checkShowPivot()`
  - `checkShowSort()`
  - `checkShowUnusedAttr()`
  - `checkWrapMetricValue()`
  - `chooseGridOption(name, isChecked)`
  - `getDefaultGridStyleText()`
  - `getGridStyleText()`
  - `getMaxColumnText()`
  - `getMaxRowText()`
  - `getShowAttrText()`
  - `inputMaxColumns(text)`
  - `inputMaxRows(text)`
  - `isAllowLinkDrillingOnHeaderChecked()`
  - `isAutoPageByChecked()`
  - `isDisplayAxesChecked()`
  - `isEnableWSFormsSortingChecked()`
  - `isOptionChecked(name)`
  - `isShowDescriptionAsTooltipChecked()`
  - `isShowPageByChecked()`
  - `isShowPivotButtonChecked()`
  - `isShowSortButtonChecked()`
  - `isShowUnusedAttrChecked()`
  - `isUseImageForOutlineModeChecked()`
  - `isWrapMetricValueChecked()`
  - `isWrapRowHeaderChecked()`
  - `setDefaultGridStyle(value)`
  - `setGridStyle(value)`
  - `setShowAttr(value)`
  - `uncheckAllowLinkDrillingOnHeader()`
  - `uncheckAutoPageBy()`
  - `uncheckDisplayAxes()`
  - `uncheckEnableWSFormsSorting()`
  - `uncheckUseImageForOutlineMode()`
  - `uncheckWrapRowHeader()`
- **Related components:** getAutoPage, getPage, getShowPage

### HistoryListPage
- **CSS root:** `#newHistoryListMessageUponReprompt`
- **User-visible elements:**
  - Duplicate Message Checkbox (`#newHistoryListMessageUponReprompt`)
  - New Scheduled Checkbox (`#inboxReuseMessage`)
  - Scheduled RWDFormat (`#scheduledRWDFormat`)
  - Working Set Size Input Box (`#workingSetSize`)
- **Component actions:**
  - `checkDuplicateMessage()`
  - `getScheduledRWDFormatText()`
  - `getWorkingSetSizeText()`
  - `inputWorkingSetSize(text)`
  - `isAutoAddSelected()`
  - `isDuplicateMessageChecked()`
  - `isNewScheduledChecked()`
  - `setAutoAdd()`
  - `setScheduledRWDFormat(value)`
  - `uncheckNewScheduled()`
- **Related components:** _none_

### NavigationBar
- **CSS root:** `.mstrPanelPortrait`
- **User-visible elements:**
  - Left Toolbar (`.prefsToolbar`)
  - Preference Panel (`.mstrPanelPortrait`)
- **Component actions:**
  - `clickItemInLeftToolbar(text)`
  - `clickLevelPreferencePage(level, page)`
  - `isItemExistInLeftToolbar(text)`
- **Related components:** getPreferencePanel, getSelectedPage

### OfficePage
- **CSS root:** `.preferenceList tbody td table`
- **User-visible elements:**
  - Preference List (`.preferenceList tbody td table`)
  - Refresh Report Checkbox (`#exportReportOfficeRefresh`)
- **Component actions:**
  - `checkRefreshReport()`
  - `isRefreshDocumentChecked()`
  - `isRefreshReportChecked()`
  - `uncheckRefreshDocument()`
- **Related components:** _none_

### PrintReportsPage
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `getAdjustFontToText()`
  - `isSetAdjustFont()`
  - `isSetCoverPageAfterReport()`
  - `isSetCoverPageBeforeReport()`
  - `isSetFitTo()`
  - `isSetPrintToLandscape()`
  - `isSetPrintToPortrait()`
  - `isSetPrintWithFilterDetails()`
  - `isSetPrintWithReportDetails()`
  - `setAdjustFont()`
  - `setAdjustFontTo(text)`
  - `setCoverPageAfterReport()`
  - `setCoverPageBeforeReport()`
  - `setFitTo()`
  - `setFitToPagesTall(text)`
  - `setFitToPagesWide(text)`
  - `setPrintReportsDropdown(value, option)`
  - `setPrintToLandscape()`
  - `setPrintToPortrait()`
  - `setPrintWithFilterDetails()`
  - `setPrintWithReportDetails()`
- **Related components:** getCoverPage, getFitToPage, getPrintCoverPage

### ProjectDispalyPage
- **CSS root:** `#projectAlias`
- **User-visible elements:**
  - Project Alias Input Box (`#projectAlias`)
  - Project Header (`.mstrProjectHeader`)
  - Project Header Text Input Box (`#projectHeader`)
  - Project Sort Index Input Box (`#projectIndex`)
- **Component actions:**
  - `inputProjectAlias(text)`
  - `inputProjectHeaderText(text)`
  - `inputProjectSortIndex(text)`
  - `isProjectHeaderPresent()`
  - `projectAliasText()`
  - `projectHeaderText()`
  - `sortIndexText()`
- **Related components:** _none_

### PromptPage
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `checkPersonalAnswer(level, page)`
  - `checkPreserveWhiteSpace(level, page)`
  - `checkPromptsMatchCaseSensitivity(level, page)`
  - `checkPromptsRenameReport(level, page)`
  - `checkPromptsRequiredFirst(level, page)`
  - `checkShowObjectDescription(level, page)`
  - `checkShowPromptDetails(level, page)`
  - `checkTrimWarehouseData(level, page)`
  - `selectSeparatePage(level, page)`
  - `setAQHQDefaultOperatorDropDown(level, page, value)`
  - `setMQDefaultOperatorDropDown(level, page, value)`
- **Related components:** clickLevelPreferencePage, getSeparatePage

### ReportServicesPage
- **CSS root:** `#dpiConversion`
- **User-visible elements:**
  - DPIInput Box (`#dpiConversion`)
- **Component actions:**
  - `getContentAlignmentText()`
  - `getDefaultThemeText()`
  - `getDPIText()`
  - `getEmbedFontModeText()`
  - `getGridDensityText()`
  - `getPingServerTimeText()`
  - `getRsdExecutionModeText()`
  - `getRsdSectionHeightModeText()`
  - `getRsdWidthModeText()`
  - `getSelectionBehaviorText()`
  - `inputDotPerInch(text)`
  - `inputPingServerTime(text)`
  - `isFloatingApplySelectorChecked()`
  - `isOfficeExportRefreshChecked()`
  - `isUseNLPChecked()`
  - `setContentAlignment(value)`
  - `setDefaultTheme(value)`
  - `setEmbedFontMode(value)`
  - `setGridDensity(value)`
  - `setRsdExecutionMode(value)`
  - `setRsdSectionHeightMode(value)`
  - `setRsdWidthMode(value)`
  - `setSelectionBehavior(value)`
  - `uncheckFloatingApplySelector()`
  - `uncheckOfficeExportRefresh()`
  - `uncheckUseNLP()`
- **Related components:** _none_

### SchedulePage
- **CSS root:** `.mstrIcon-btn.mstrIcon-btnAddAll`
- **User-visible elements:**
  - Add All Btn (`.mstrIcon-btn.mstrIcon-btnAddAll`)
  - Add Btn (`.mstrIcon-btn.mstrIcon-btnArrowRight`)
  - Available Schedules List (`#availableSchedulesList`)
  - Remove Btn (`.mstrIcon-btn.mstrIcon-btnArrowLeft`)
  - Selected Schedules List (`#selectedSchedulesList`)
- **Component actions:**
  - `addAllElementsToSelections()`
  - `addItemsToSelections(items)`
  - `getSelectedScheduleItemsText()`
  - `removeFromSelections(item)`
  - `save()`
  - `selectSchedules(item)`
  - `setAllowAll()`
  - `setOnlyAllow()`
- **Related components:** _none_

### SecurityPage
- **CSS root:** `.mstrButton.prefs-addNewURL-btn`
- **User-visible elements:**
  - Export URLAdd Btn (`.mstrButton.prefs-addNewURL-btn`)
  - Export URLApply Edit Icon (`.listTableView-url-apply`)
  - Export URLCancel Edit Icon (`.listTableView-url-cancel`)
  - Export URLEdit Box (`.listTableView-url-edit`)
  - Export URLInput Box (`.prefs-addNewURL`)
  - Export URLList View (`.mstrListView.urlList`)
  - Export URLMsg (`#prefs-url-msg`)
  - Login Modes List (`.preferenceList`)
- **Component actions:**
  - `addExportURL(url, action = 'addButton')`
  - `applyExportURLEdit(action = 'confirmButton')`
  - `cancelExportURLEdit()`
  - `deleteAllExportURLs()`
  - `deleteExportURL(url)`
  - `editExportURL(baseURL, newURL, action = 'editButton')`
  - `enableGuestMode()`
  - `getAllowedURLListCount()`
  - `getExportURLMsg()`
  - `isOnlyTheReadMessagesSelected()`
  - `isYesRadioBtnForCancelPendingRequestSelected()`
  - `isYesRadioBtnForRemoveFinishedJobsSelected()`
  - `setDefaultLoginMode(modeName)`
  - `setLoginMode(loginMode, isSet)`
  - `setOnlyTheReadMessages()`
  - `setYesForCancelPendingRequests()`
  - `setYesForRemoveFinishedJobs()`
  - `uncheckShowCancelSession()`
  - `uncheckShowRemoveFinishedJobs()`
- **Related components:** getExportURLListContainer, getPreferencePanel

### ToolBar
- **CSS root:** `#projectLevel`
- **User-visible elements:**
  - Apply To Dropdown (`#projectLevel`)
  - Close Btn (`.mstrIconNoTextDecoration.mstrVerticalLine`)
  - Navigation Bar (`#preferencesToolbar`)
- **Component actions:**
  - `applyChanges()`
  - `close()`
- **Related components:** _none_

### WebPreferencePage
- **CSS root:** `#hierarchicalSort`
- **User-visible elements:**
  - Hierarchical Sort Section (`#hierarchicalSort`)
  - Language Section (`#locale-section`)
  - Left Toolbar (`.prefsToolbar`)
  - Preferences Body (`.mstr-page-prefs`)
- **Component actions:**
  - `applyChanges()`
  - `clickItemInLeftToolbar(text)`
  - `getHierarchicalSortType()`
  - `isPreferenceSaved()`
  - `setHierarchicalSort(value)`
  - `setIServerMsg(value)`
  - `setLanguage(value)`
  - `setMetadata(value)`
  - `setNumberDate(value)`
  - `setTimeZone(value)`
  - `setUnits(value)`
  - `setValueForDropDown(id, value)`
  - `setWHData(value)`
  - `waitForPageDisplayed()`
- **Related components:** generalPage

## Common Workflows (from spec.ts)

1. _none_

## Common Elements (from POM + spec.ts)

1. Address List -- frequency: 2
2. Left Toolbar -- frequency: 2
3. Preference Panel -- frequency: 2
4. Preferences Body -- frequency: 2
5. Add All Btn -- frequency: 1
6. Add APalette Button -- frequency: 1
7. Add Btn -- frequency: 1
8. Add Button -- frequency: 1
9. Address Name Input Box -- frequency: 1
10. Alert Dialog -- frequency: 1
11. Apply To Dropdown -- frequency: 1
12. Available Box -- frequency: 1
13. Available Fonts -- frequency: 1
14. Available Schedules List -- frequency: 1
15. Close Btn -- frequency: 1
16. Color Handle -- frequency: 1
17. Color HEXInput Box -- frequency: 1
18. Color List -- frequency: 1
19. Color Picker Palette Btn -- frequency: 1
20. Color Picker Swatch Btn -- frequency: 1
21. Color Wheel -- frequency: 1
22. Confirm Delete Dialog -- frequency: 1
23. Confirm Message -- frequency: 1
24. Connectors Url Input Box -- frequency: 1
25. Create Dialog -- frequency: 1
26. Custom Font Size Input Box -- frequency: 1
27. Default Palette -- frequency: 1
28. Delete Confirm Dialog -- frequency: 1
29. Device Drop Down -- frequency: 1
30. DPIInput Box -- frequency: 1
31. Duplicate Message Checkbox -- frequency: 1
32. Error Alert -- frequency: 1
33. Error Message -- frequency: 1
34. Export Graph To Excel Radio Button -- frequency: 1
35. Export Graph To Html Radio Button -- frequency: 1
36. Export Grid To Csv Radio Button -- frequency: 1
37. Export Grid To Excel Radio Button -- frequency: 1
38. Export Grid To Excel With Formatting Radio Button -- frequency: 1
39. Export Grid To Html Radio Button -- frequency: 1
40. Export Grid To Plain Text Radio Button -- frequency: 1
41. Export Html To Excel Radio Button -- frequency: 1
42. Export Html To Html Radio Button -- frequency: 1
43. Export URLAdd Btn -- frequency: 1
44. Export URLApply Edit Icon -- frequency: 1
45. Export URLCancel Edit Icon -- frequency: 1
46. Export URLEdit Box -- frequency: 1
47. Export URLInput Box -- frequency: 1
48. Export URLList View -- frequency: 1
49. Export URLMsg -- frequency: 1
50. Hide My Reports Checkbox -- frequency: 1
51. Hierarchical Sort Section -- frequency: 1
52. Language Section -- frequency: 1
53. Link To Doc Btn -- frequency: 1
54. Locale Dropdown -- frequency: 1
55. Login Modes List -- frequency: 1
56. Move Font Up Button -- frequency: 1
57. MSTRLibrary Config Example -- frequency: 1
58. MSTRLibrary Config Input Box -- frequency: 1
59. Navigation Bar -- frequency: 1
60. New Scheduled Checkbox -- frequency: 1
61. Ok Button From Color Editor -- frequency: 1
62. Palette Container Menu -- frequency: 1
63. Palette Dropdown List -- frequency: 1
64. Palette Editor Name Input Box -- frequency: 1
65. Palette List -- frequency: 1
66. Panel Button Bar -- frequency: 1
67. Physical Address Input Box -- frequency: 1
68. Preference List -- frequency: 1
69. Preference Toolbar -- frequency: 1
70. Project Alias Input Box -- frequency: 1
71. Project Header -- frequency: 1
72. Project Header Text Input Box -- frequency: 1
73. Project Sort Index Input Box -- frequency: 1
74. Refresh Report Checkbox -- frequency: 1
75. Remove Btn -- frequency: 1
76. Remove Button -- frequency: 1
77. Remove From Selected Button -- frequency: 1
78. Scheduled RWDFormat -- frequency: 1
79. Search Result List -- frequency: 1
80. Select Default Palette Dropdown -- frequency: 1
81. Select Report Dialog -- frequency: 1
82. Selected Box -- frequency: 1
83. Selected Color List -- frequency: 1
84. Selected Color Tooltip -- frequency: 1
85. Selected Fonts -- frequency: 1
86. Selected Schedules List -- frequency: 1
87. Show Footer Path Checkbox -- frequency: 1
88. Success Message -- frequency: 1
89. Update Confirmation -- frequency: 1
90. Working Set Size Input Box -- frequency: 1

## Key Actions

- `addAddress({ addressName, physicalAddress, device })` -- used in 0 specs
- `addAllElementsToSelections()` -- used in 0 specs
- `addColorFromColorList(colorlist)` -- used in 0 specs
- `addColorFromColorWheel(colorwheel)` -- used in 0 specs
- `addDynamicAddressList({ name, store, physicaladdress })` -- used in 0 specs
- `addExportURL(url, action = 'addButton')` -- used in 0 specs
- `addItemsToSelections(items)` -- used in 0 specs
- `addPalette(name, colorlist, colorwheel)` -- used in 0 specs
- `addPaletteWithAlert(colorlist)` -- used in 0 specs
- `apply()` -- used in 0 specs
- `applyChanges()` -- used in 0 specs
- `applyExportURLEdit(action = 'confirmButton')` -- used in 0 specs
- `cancelExportURLEdit()` -- used in 0 specs
- `changePassword(oldPassword, newPassword)` -- used in 0 specs
- `changePasswordWithError(oldPassword, newPassword)` -- used in 0 specs
- `check(el)` -- used in 0 specs
- `checkAllowQuickSearch()` -- used in 0 specs
- `checkDisableHyperLink(level, page)` -- used in 0 specs
- `checkDuplicateMessage()` -- used in 0 specs
- `checkGeneralSetting(value)` -- used in 0 specs
- `checkGraphShowGridGraph()` -- used in 0 specs
- `checkGroupDrill(level, page)` -- used in 0 specs
- `checkHideMyReports()` -- used in 0 specs
- `checkOpenInNewWindow(level, page)` -- used in 0 specs
- `checkPersonalAnswer(level, page)` -- used in 0 specs
- `checkPreserveWhiteSpace(level, page)` -- used in 0 specs
- `checkPromptsMatchCaseSensitivity(level, page)` -- used in 0 specs
- `checkPromptsRenameReport(level, page)` -- used in 0 specs
- `checkPromptsRequiredFirst(level, page)` -- used in 0 specs
- `checkRefreshReport()` -- used in 0 specs
- `checkSetting(value)` -- used in 0 specs
- `checkShowDescriptionAsTooltip()` -- used in 0 specs
- `checkShowFooterPath()` -- used in 0 specs
- `checkShowObjectDescription(level, page)` -- used in 0 specs
- `checkShowPageBy()` -- used in 0 specs
- `checkShowPivot()` -- used in 0 specs
- `checkShowPromptDetails(level, page)` -- used in 0 specs
- `checkShowSort()` -- used in 0 specs
- `checkShowUnusedAttr()` -- used in 0 specs
- `checkSortDrillPath(level, page)` -- used in 0 specs
- `checkSpecifiedPaletteCheckbox(text)` -- used in 0 specs
- `checkTrimWarehouseData(level, page)` -- used in 0 specs
- `checkWrapMetricValue()` -- used in 0 specs
- `chooseGridOption(name, isChecked)` -- used in 0 specs
- `clickAddNewBtn()` -- used in 0 specs
- `clickCancel()` -- used in 0 specs
- `clickChangePassword()` -- used in 0 specs
- `clickChangePasswordBtn()` -- used in 0 specs
- `clickContinue()` -- used in 0 specs
- `clickDefaultStartPage(index)` -- used in 0 specs
- `clickEditBtn(value)` -- used in 0 specs
- `clickItemInLeftToolbar(text)` -- used in 0 specs
- `clickLevelPreferencePage(level, page)` -- used in 0 specs
- `clickLoadDefaultValueBtn()` -- used in 0 specs
- `clickOkOnAlertDialog()` -- used in 0 specs
- `close()` -- used in 0 specs
- `closePreferencePage()` -- used in 0 specs
- `deleteAllAddresses()` -- used in 0 specs
- `deleteAllEditablePalettes()` -- used in 0 specs
- `deleteAllExportURLs()` -- used in 0 specs
- `deleteExportURL(url)` -- used in 0 specs
- `deletePalette(palettelist)` -- used in 0 specs
- `deleteSpecifiedAddressItem(text)` -- used in 0 specs
- `deleteSpecifiedAddressItem(value)` -- used in 0 specs
- `editAddress(text, { addressName, physicalAddress, device })` -- used in 0 specs
- `editDynamicAddressList({ name1, name2, store, physicaladdress })` -- used in 0 specs
- `editExportURL(baseURL, newURL, action = 'editButton')` -- used in 0 specs
- `enableGuestMode()` -- used in 0 specs
- `getAdjustFontToText()` -- used in 0 specs
- `getAllowedURLListCount()` -- used in 0 specs
- `getCellCssValue(label, cssName)` -- used in 0 specs
- `getConnectorsUrlText()` -- used in 0 specs
- `getContentAlignmentText()` -- used in 0 specs
- `getDefaultGridStyleText()` -- used in 0 specs
- `getDefaultPaletteTitle()` -- used in 0 specs
- `getDefaultThemeText()` -- used in 0 specs
- `getDPIText()` -- used in 0 specs
- `getEmbedFontModeText()` -- used in 0 specs
- `getErrorAlertText()` -- used in 0 specs
- `getErrorMessageText()` -- used in 0 specs
- `getExportURLMsg()` -- used in 0 specs
- `getGridDensityText()` -- used in 0 specs
- `getGridStyleText()` -- used in 0 specs
- `getHeightText()` -- used in 0 specs
- `getHierarchicalSortType()` -- used in 0 specs
- `getImageFormatText()` -- used in 0 specs
- `getInputboxText(label)` -- used in 0 specs
- `getLibraryConfigText()` -- used in 0 specs
- `getMaxColumnText()` -- used in 0 specs
- `getMaxRowText()` -- used in 0 specs
- `getMSTRLibraryConfigExampleText()` -- used in 0 specs
- `getNoprivilegeAlertText()` -- used in 0 specs
- `getPingServerTimeText()` -- used in 0 specs
- `getRsdExecutionModeText()` -- used in 0 specs
- `getRsdSectionHeightModeText()` -- used in 0 specs
- `getRsdWidthModeText()` -- used in 0 specs
- `getScheduledRWDFormatText()` -- used in 0 specs
- `getSearchAutoCompleteDelayText()` -- used in 0 specs
- `getSelectedScheduleItemsText()` -- used in 0 specs
- `getSelectionBehaviorText()` -- used in 0 specs
- `getShowAttrText()` -- used in 0 specs
- `getSuccessMessage()` -- used in 0 specs
- `getSuccessMessageText()` -- used in 0 specs
- `getUpdateConfirmationText()` -- used in 0 specs
- `getWidthText()` -- used in 0 specs
- `getWorkingSetSizeText()` -- used in 0 specs
- `inputAddressName(text)` -- used in 0 specs
- `inputConnectorUrl(text)` -- used in 0 specs
- `inputDotPerInch(text)` -- used in 0 specs
- `inputHeight(height)` -- used in 0 specs
- `inputLibraryConfigUrl(text)` -- used in 0 specs
- `inputMaxColumns(text)` -- used in 0 specs
- `inputMaxRows(text)` -- used in 0 specs
- `inputMaxSortNumber(value)` -- used in 0 specs
- `inputNewPassword(newPassword)` -- used in 0 specs
- `inputNewPasswordVerification(newPassword)` -- used in 0 specs
- `inputOldPassword(oldPassword)` -- used in 0 specs
- `inputPhysicalAddress(text)` -- used in 0 specs
- `inputPingServerTime(text)` -- used in 0 specs
- `inputProjectAlias(text)` -- used in 0 specs
- `inputProjectHeaderText(text)` -- used in 0 specs
- `inputProjectSortIndex(text)` -- used in 0 specs
- `inputSetting(label, value)` -- used in 0 specs
- `inputWidth(width)` -- used in 0 specs
- `inputWorkingSetSize(text)` -- used in 0 specs
- `isaddAddressBtnExist()` -- used in 0 specs
- `isAllowLinkDrillingOnHeaderChecked()` -- used in 0 specs
- `isAutoAddSelected()` -- used in 0 specs
- `isAutoPageByChecked()` -- used in 0 specs
- `isDisplayAxesChecked()` -- used in 0 specs
- `isDropdownOptionSelected(value, option)` -- used in 0 specs
- `isDropdownOptionSelectedInSection(section, value, option)` -- used in 0 specs
- `isDuplicateMessageChecked()` -- used in 0 specs
- `isEnableWSFormsSortingChecked()` -- used in 0 specs
- `isExportGraphToExcelSelected()` -- used in 0 specs
- `isExportGraphToHtmlSelected()` -- used in 0 specs
- `isExportGridToCsvSelected()` -- used in 0 specs
- `isExportGridToExcelSelected()` -- used in 0 specs
- `isExportGridToExcelWithFormattingSelected()` -- used in 0 specs
- `isExportGridToHtmlSelected()` -- used in 0 specs
- `isExportGridToPlainTextSelected()` -- used in 0 specs
- `isExportHtmlToExcelSelected()` -- used in 0 specs
- `isExportHtmlToHtmlSelected()` -- used in 0 specs
- `isFloatingApplySelectorChecked()` -- used in 0 specs
- `isGeneralDropdownOptionSelected(value, option)` -- used in 0 specs
- `isGeneralSettingChecked(value)` -- used in 0 specs
- `isGraphShowGridGraphChecked()` -- used in 0 specs
- `isHideMyReportsChecked()` -- used in 0 specs
- `isItemExistInAvailableList(value)` -- used in 0 specs
- `isItemExistInLeftToolbar(text)` -- used in 0 specs
- `isLoadDefaultValueBtnExisted()` -- used in 0 specs
- `isNewScheduledChecked()` -- used in 0 specs
- `isOfficeExportRefreshChecked()` -- used in 0 specs
- `isOnlyTheReadMessagesSelected()` -- used in 0 specs
- `isOptionChecked(name)` -- used in 0 specs
- `isPreferenceSaved()` -- used in 0 specs
- `isProjectHeaderPresent()` -- used in 0 specs
- `isRadioBtnSelected(text)` -- used in 0 specs
- `isRefreshDocumentChecked()` -- used in 0 specs
- `isRefreshReportChecked()` -- used in 0 specs
- `isRerunAgainstWarehouseSelected()` -- used in 0 specs
- `isSetAdjustFont()` -- used in 0 specs
- `isSetCoverPageAfterReport()` -- used in 0 specs
- `isSetCoverPageBeforeReport()` -- used in 0 specs
- `isSetFitTo()` -- used in 0 specs
- `isSetPrintToLandscape()` -- used in 0 specs
- `isSetPrintToPortrait()` -- used in 0 specs
- `isSetPrintWithFilterDetails()` -- used in 0 specs
- `isSetPrintWithReportDetails()` -- used in 0 specs
- `isSettingChecked(value)` -- used in 0 specs
- `isShowDescriptionAsTooltipChecked()` -- used in 0 specs
- `isShowFooterPathChecked()` -- used in 0 specs
- `isShowPageByChecked()` -- used in 0 specs
- `isShowPivotButtonChecked()` -- used in 0 specs
- `isShowSortButtonChecked()` -- used in 0 specs
- `isShowUnusedAttrChecked()` -- used in 0 specs
- `isSpecifiedAddressItemPresent(text)` -- used in 0 specs
- `isSpecifiedAddressItemPresent(value)` -- used in 0 specs
- `isSpecifiedColorPaletteCheckboxChecked(text)` -- used in 0 specs
- `isSpecifiedColorPaletteExist(text)` -- used in 0 specs
- `isUseCustomSettingSelected()` -- used in 0 specs
- `isUseDefaultFontSelected()` -- used in 0 specs
- `isUseDefaultFontSizeSelected()` -- used in 0 specs
- `isUseImageForOutlineModeChecked()` -- used in 0 specs
- `isUseNLPChecked()` -- used in 0 specs
- `isUseSettingStoredSelected()` -- used in 0 specs
- `isWrapMetricValueChecked()` -- used in 0 specs
- `isWrapRowHeaderChecked()` -- used in 0 specs
- `isYesRadioBtnForCancelPendingRequestSelected()` -- used in 0 specs
- `isYesRadioBtnForRemoveFinishedJobsSelected()` -- used in 0 specs
- `linkToDoc()` -- used in 0 specs
- `loadDefaultValue(level, page)` -- used in 0 specs
- `localeText()` -- used in 0 specs
- `numberOfContents()` -- used in 0 specs
- `numberOfEditablePalettes()` -- used in 0 specs
- `openChangePasswordPage()` -- used in 0 specs
- `openPaletteEditor(text)` -- used in 0 specs
- `openSearchReportDialog()` -- used in 0 specs
- `projectAliasText()` -- used in 0 specs
- `projectHeaderText()` -- used in 0 specs
- `removeColorFromSelectedColorList(color)` -- used in 0 specs
- `removeFromSelected(value)` -- used in 0 specs
- `removeFromSelections(item)` -- used in 0 specs
- `renamePaletteInPaletteEditor(text)` -- used in 0 specs
- `renamePaletteInPaletteListPage(text1, text2)` -- used in 0 specs
- `save()` -- used in 0 specs
- `saveNewlyAddedAddress()` -- used in 0 specs
- `savePalette()` -- used in 0 specs
- `scrollPreferenceIntoView()` -- used in 0 specs
- `searchReport(name)` -- used in 0 specs
- `selectDefaultPalette(text)` -- used in 0 specs
- `selectDisplayAdvancedDrillAsSubMenus(level, page)` -- used in 0 specs
- `selectReport(name, store)` -- used in 0 specs
- `selectSchedules(item)` -- used in 0 specs
- `selectSeparatePage(level, page)` -- used in 0 specs
- `setAdjustFont()` -- used in 0 specs
- `setAdjustFontTo(text)` -- used in 0 specs
- `setAdminInfo(text)` -- used in 0 specs
- `setAllowAll()` -- used in 0 specs
- `setApplyTo(value)` -- used in 0 specs
- `setAQHQDefaultOperatorDropDown(level, page, value)` -- used in 0 specs
- `setAutoAdd()` -- used in 0 specs
- `setContentAlignment(value)` -- used in 0 specs
- `setCoverPageAfterReport()` -- used in 0 specs
- `setCoverPageBeforeReport()` -- used in 0 specs
- `setCustomFont(font)` -- used in 0 specs
- `setCustomFontSize(text)` -- used in 0 specs
- `setDefault(text)` -- used in 0 specs
- `setDefaultGridStyle(value)` -- used in 0 specs
- `setDefaultLoginMode(modeName)` -- used in 0 specs
- `setDefaultTheme(value)` -- used in 0 specs
- `setDrillWithinBehavior(level, page, value)` -- used in 0 specs
- `setEmbedFontMode(value)` -- used in 0 specs
- `setExportGraphToExcel()` -- used in 0 specs
- `setExportGraphToHtml()` -- used in 0 specs
- `setExportGridToCsv()` -- used in 0 specs
- `setExportGridToExcel()` -- used in 0 specs
- `setExportGridToExcelWithFormatting()` -- used in 0 specs
- `setExportGridToHtml()` -- used in 0 specs
- `setExportGridToPlainText()` -- used in 0 specs
- `setExportHtmlToExcel()` -- used in 0 specs
- `setExportReportsDropdown(value, option)` -- used in 0 specs
- `setFitTo()` -- used in 0 specs
- `setFitToPagesTall(text)` -- used in 0 specs
- `setFitToPagesWide(text)` -- used in 0 specs
- `setForPropertyDropdown(property, value)` -- used in 0 specs
- `setForStoreDropdown(dropdown, value)` -- used in 0 specs
- `setGridDensity(value)` -- used in 0 specs
- `setGridStyle(value)` -- used in 0 specs
- `setHierarchicalSort(value)` -- used in 0 specs
- `setHtmlGraphToHtml()` -- used in 0 specs
- `setImageFormat(value)` -- used in 0 specs
- `setIServerMsg(value)` -- used in 0 specs
- `setKeepParent(level, page, value)` -- used in 0 specs
- `setKeepThresholds(level, page, value)` -- used in 0 specs
- `setLanguage(value)` -- used in 0 specs
- `setLanguageSection(value, unit, timezone)` -- used in 0 specs
- `setLoginMode(loginMode, isSet)` -- used in 0 specs
- `setMetadata(value)` -- used in 0 specs
- `setMQDefaultOperatorDropDown(level, page, value)` -- used in 0 specs
- `setNumberDate(value)` -- used in 0 specs
- `setOnlyAllow()` -- used in 0 specs
- `setOnlyTheReadMessages()` -- used in 0 specs
- `setPrintReportsDropdown(value, option)` -- used in 0 specs
- `setPrintToLandscape()` -- used in 0 specs
- `setPrintToPortrait()` -- used in 0 specs
- `setPrintWithFilterDetails()` -- used in 0 specs
- `setPrintWithReportDetails()` -- used in 0 specs
- `setReportDrillOption(level, page, value)` -- used in 0 specs
- `setRerunAgainstWarehouse()` -- used in 0 specs
- `setRsdDrillOption(level, page, value)` -- used in 0 specs
- `setRsdExecutionMode(value)` -- used in 0 specs
- `setRsdSectionHeightMode(value)` -- used in 0 specs
- `setRsdWidthMode(value)` -- used in 0 specs
- `setScheduledRWDFormat(value)` -- used in 0 specs
- `setSearchAutoCompleteDelay(value)` -- used in 0 specs
- `setSelectionBehavior(value)` -- used in 0 specs
- `setShowAttr(value)` -- used in 0 specs
- `setTimeZone(value)` -- used in 0 specs
- `setUnits(value)` -- used in 0 specs
- `setUseCustomSetting()` -- used in 0 specs
- `setUseSettingStored()` -- used in 0 specs
- `setValueForDeviceDropDown(value)` -- used in 0 specs
- `setValueForDropdown(dropdown, value)` -- used in 0 specs
- `setValueForDropDown(id, value)` -- used in 0 specs
- `setValueForDropdownInSection(section, value, option)` -- used in 0 specs
- `setValueForDropdownsetting(value, option)` -- used in 0 specs
- `setValueForDropDownWithID(id, value)` -- used in 0 specs
- `setValueForGeneralDropdown(value, option)` -- used in 0 specs
- `setWHData(value)` -- used in 0 specs
- `setYesForCancelPendingRequests()` -- used in 0 specs
- `setYesForRemoveFinishedJobs()` -- used in 0 specs
- `showAdvancedOptions()` -- used in 0 specs
- `sortIndexText()` -- used in 0 specs
- `uncheck(el)` -- used in 0 specs
- `uncheckAllowAutoSubmitSearch()` -- used in 0 specs
- `uncheckAllowGridViewSearch()` -- used in 0 specs
- `uncheckAllowLinkDrillingOnHeader()` -- used in 0 specs
- `uncheckAllowQuickSearch()` -- used in 0 specs
- `uncheckAutoPageBy()` -- used in 0 specs
- `uncheckDisplayAxes()` -- used in 0 specs
- `uncheckEnableContextMenuDrilling(level, page)` -- used in 0 specs
- `uncheckEnableWSFormsSorting()` -- used in 0 specs
- `uncheckFloatingApplySelector()` -- used in 0 specs
- `uncheckGeneralSetting(value)` -- used in 0 specs
- `uncheckNewScheduled()` -- used in 0 specs
- `uncheckOfficeExportRefresh()` -- used in 0 specs
- `uncheckRefreshDocument()` -- used in 0 specs
- `uncheckSearchObjectType(value)` -- used in 0 specs
- `uncheckSetting(value)` -- used in 0 specs
- `uncheckShowCancelSession()` -- used in 0 specs
- `uncheckShowRemoveFinishedJobs()` -- used in 0 specs
- `uncheckSpecifiedPaletteCheckbox(text)` -- used in 0 specs
- `uncheckUseImageForOutlineMode()` -- used in 0 specs
- `uncheckUseNLP()` -- used in 0 specs
- `uncheckWrapRowHeader()` -- used in 0 specs
- `waitForCircleDisappear(text)` -- used in 0 specs
- `waitForComfirmMessageAppear()` -- used in 0 specs
- `waitForPageDisplayed()` -- used in 0 specs
- `waitForPaletteDisappear(palette)` -- used in 0 specs

## Source Coverage

- `pageObjects/web_preference/**/*.js`
