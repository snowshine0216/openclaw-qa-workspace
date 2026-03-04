# Site Knowledge: web_preference

> Components: 23

### BasePreference
> Extends: `WebBasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `PreferencePanel` | `.mstrPanelPortrait` | element |
| `PreferencesBody` | `.mstrPanelBody` | element |
| `PreferenceToolbar` | `.mstrToolbarGroup` | element |
| `PanelButtonBar` | `.mstrPanelButtonBar` | button |
| `UpdateConfirmation` | `.mstrPrefUpdateConfirmation` | element |
| `ErrorAlert` | `.mstrAlertTitle` | element |
| `ConfirmMessage` | `.mstrPrefUpdateConfirmation, .mstrAlertTitle` | element |
| `AlertDialog` | `.mstrmojo-Editor.mstrmojo-alert.modal` | element |

**Actions**
| Signature |
|-----------|
| `applyChanges()` |
| `closePreferencePage()` |
| `apply()` |
| `clickLoadDefaultValueBtn()` |
| `loadDefaultValue(level, page)` |
| `check(el)` |
| `checkSetting(value)` |
| `uncheck(el)` |
| `uncheckSetting(value)` |
| `inputSetting(label, value)` |
| `clickChangePasswordBtn()` |
| `waitForComfirmMessageAppear()` |
| `scrollPreferenceIntoView()` |
| `clickLevelPreferencePage(level, page)` |
| `setValueForDropdown(dropdown, value)` |
| `setValueForDropdownsetting(value, option)` |
| `setApplyTo(value)` |
| `getUpdateConfirmationText()` |
| `getErrorAlertText()` |
| `isLoadDefaultValueBtnExisted()` |
| `clickDefaultStartPage(index)` |
| `isSettingChecked(value)` |
| `isDropdownOptionSelected(value, option)` |
| `getInputboxText(label)` |
| `getCellCssValue(label, cssName)` |

**Sub-components**
- getPanel
- getPreferencePanel
- clickLevelPreferencePage
- scrollWebPage
- getDefaultStartPage

---

### ChangePasswordForm
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getSuccessMessage()` |
| `inputOldPassword(oldPassword)` |
| `inputNewPassword(newPassword)` |
| `inputNewPasswordVerification(newPassword)` |
| `clickChangePassword()` |
| `clickCancel()` |
| `clickContinue()` |

**Sub-components**
_none_

---

### ChangePWD
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SuccessMessage` | `.message` | element |
| `ErrorMessage` | `.mstrAlertMessage` | element |

**Actions**
| Signature |
|-----------|
| `openChangePasswordPage()` |
| `inputOldPassword(oldPassword)` |
| `inputNewPassword(newPassword)` |
| `inputNewPasswordVerification(newPassword)` |
| `clickChangePassword()` |
| `clickCancel()` |
| `changePassword(oldPassword, newPassword)` |
| `changePasswordWithError(oldPassword, newPassword)` |
| `clickContinue()` |
| `getSuccessMessageText()` |
| `getErrorMessageText()` |

**Sub-components**
_none_

---

### ColorPalettePage
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `PaletteList` | `.mstrmojo-Box.mstrmojo-PaletteList` | element |
| `AddAPaletteButton` | `.mstrmojo-Label.newPalette` | element |
| `PaletteEditorNameInputBox` | `.mstrmojo-TextBoxWithLabel.paletteName .mstrmojo-TextBox` | element |
| `ColorPickerSwatchBtn` | `.acpBtn.acpSwatchBtn` | button |
| `ColorPickerPaletteBtn` | `.acpBtn.acpPaletteBtn` | button |
| `ColorList` | `.mstrmojo-ListBase.mstrmojo-ui-ColorList` | element |
| `ColorWheel` | `.mstrmojo-ui-ColorWheel` | element |
| `ColorHandle` | `.cwHandle` | element |
| `ColorHEXInputBox` | `.mstrmojo-TextBoxWithLabel.on .mstrmojo-TextBox` | element |
| `SelectedColorList` | `.mstrmojo-ListBase.mstrmojo-PaletteColorList.mstrmojo-ui-ColorList .ColorsContainer` | element |
| `OkButtonFromColorEditor` | `.mstrmojo-Button.mstrmojo-WebButton.hot.mstrmojo-Editor-button .mstrmojo-Button-text` | button |
| `PaletteContainerMenu` | `.mstrmojo-ui-Menu-item-container` | element |
| `ConfirmDeleteDialog` | `.mstrmojo-Editor.mstrmojo-alert.modal` | element |
| `SelectedColorTooltip` | `.mstrmojo-Tooltip-content.mstrmojo-scrollNode` | element |
| `SelectDefaultPaletteDropdown` | `.mstrmojo-ui-PreviewButton .cf .btn` | button |
| `PaletteDropdownList` | `.mstrmojo-popupList-scrollBar.mstrmojo-scrollNode` | element |
| `DefaultPalette` | `.mstrmojo-ui-PreviewButton .cf .preview .paletteColors` | button |

**Actions**
| Signature |
|-----------|
| `addPalette(name, colorlist, colorwheel)` |
| `renamePaletteInPaletteEditor(text)` |
| `addColorFromColorList(colorlist)` |
| `addColorFromColorWheel(colorwheel)` |
| `removeColorFromSelectedColorList(color)` |
| `renamePaletteInPaletteListPage(text1, text2)` |
| `savePalette()` |
| `openPaletteEditor(text)` |
| `deletePalette(palettelist)` |
| `waitForCircleDisappear(text)` |
| `waitForPaletteDisappear(palette)` |
| `checkSpecifiedPaletteCheckbox(text)` |
| `uncheckSpecifiedPaletteCheckbox(text)` |
| `selectDefaultPalette(text)` |
| `deleteAllEditablePalettes()` |
| `addPaletteWithAlert(colorlist)` |
| `clickOkOnAlertDialog()` |
| `isSpecifiedColorPaletteExist(text)` |
| `isSpecifiedColorPaletteCheckboxChecked(text)` |
| `getDefaultPaletteTitle()` |
| `numberOfEditablePalettes()` |
| `getNoprivilegeAlertText()` |

**Sub-components**
- getPaletteContainer
- scrollPage
- getSpecifiedPaletteContainer
- getPreferencePanel
- getEditablePaletteContainer

---

### DistributionServicesPage
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `addAddressBtn` | `.addressNew .mstrLink` | element |
| `AddressNameInputBox` | `#dispName` | element |
| `PhysicalAddressInputBox` | `#addressValue` | element |
| `DeviceDropDown` | `#deviceID` | element |
| `AddressList` | `.addressesList.mstrListView tbody` | element |

**Actions**
| Signature |
|-----------|
| `inputAddressName(text)` |
| `inputPhysicalAddress(text)` |
| `setValueForDeviceDropDown(value)` |
| `saveNewlyAddedAddress()` |
| `addAddress({ addressName, physicalAddress, device })` |
| `editAddress(text, { addressName, physicalAddress, device })` |
| `deleteSpecifiedAddressItem(text)` |
| `setDefault(text)` |
| `deleteAllAddresses()` |
| `isSpecifiedAddressItemPresent(text)` |
| `isaddAddressBtnExist()` |
| `isRadioBtnSelected(text)` |
| `numberOfContents()` |

**Sub-components**
_none_

---

### DrillModePage
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `setKeepParent(level, page, value)` |
| `setKeepThresholds(level, page, value)` |
| `checkOpenInNewWindow(level, page)` |
| `setDrillWithinBehavior(level, page, value)` |
| `checkGroupDrill(level, page)` |
| `checkSortDrillPath(level, page)` |
| `checkDisableHyperLink(level, page)` |
| `setReportDrillOption(level, page, value)` |
| `uncheckEnableContextMenuDrilling(level, page)` |
| `selectDisplayAdvancedDrillAsSubMenus(level, page)` |
| `setRsdDrillOption(level, page, value)` |

**Sub-components**
- clickLevelPreferencePage

---

### DynamicAddressList
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `CreateDialog` | `.mstrmojo-Editor.mstrmojo-DRLEditor.modal` | element |
| `SelectReportDialog` | `.mstrmojo-Editor.SREditor.modal` | element |
| `SearchResultList` | `.mstrmojo-Booklet.mstrmojo-OB-booklet` | element |
| `AddressList` | `.mstrmojo-DataGrid-itemsContainer .mstrmojo-itemwrap-table` | element |
| `DeleteConfirmDialog` | `.mstrmojo-Editor.mstrmojo-alert.modal` | element |

**Actions**
| Signature |
|-----------|
| `setForPropertyDropdown(property, value)` |
| `clickAddNewBtn()` |
| `clickEditBtn(value)` |
| `openSearchReportDialog()` |
| `searchReport(name)` |
| `setForStoreDropdown(dropdown, value)` |
| `selectReport(name, store)` |
| `addDynamicAddressList({ name, store, physicaladdress })` |
| `editDynamicAddressList({ name1, name2, store, physicaladdress })` |
| `deleteSpecifiedAddressItem(value)` |
| `deleteAllAddresses()` |
| `isSpecifiedAddressItemPresent(value)` |
| `numberOfContents()` |

**Sub-components**
- getPreferencePanel

---

### ExportReportsPage
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ExportGridToExcelRadioButton` | `#exportFormatGrids_excelPlaintextIServer` | element |
| `ExportGridToCsvRadioButton` | `#exportFormatGrids_csvIServer` | element |
| `ExportGridToExcelWithFormattingRadioButton` | `#exportFormatGrids_excelFormattingGridsIServer` | element |
| `ExportGridToHtmlRadioButton` | `#exportFormatGrids_htmlGrids` | element |
| `ExportGridToPlainTextRadioButton` | `#exportFormatGrids_plaintextIServer` | element |
| `ExportGraphToExcelRadioButton` | `#exportFormatGraphs_excelFormattingGraphsIServer` | element |
| `ExportGraphToHtmlRadioButton` | `#exportFormatGraphs_htmlGraphs` | element |
| `ExportHtmlToHtmlRadioButton` | `#exportFormatDocuments_htmlDocuments` | element |
| `ExportHtmlToExcelRadioButton` | `#exportFormatDocuments_excelWithoutFormatting` | element |

**Actions**
| Signature |
|-----------|
| `setExportReportsDropdown(value, option)` |
| `setExportGridToExcel()` |
| `setExportGridToCsv()` |
| `setExportGridToExcelWithFormatting()` |
| `setExportGridToHtml()` |
| `setExportGridToPlainText()` |
| `setExportGraphToExcel()` |
| `setExportGraphToHtml()` |
| `setHtmlGraphToHtml()` |
| `setExportHtmlToExcel()` |
| `isExportGridToExcelSelected()` |
| `isExportGridToCsvSelected()` |
| `isExportGridToExcelWithFormattingSelected()` |
| `isExportGridToHtmlSelected()` |
| `isExportGridToPlainTextSelected()` |
| `isExportGraphToExcelSelected()` |
| `isExportGraphToHtmlSelected()` |
| `isExportHtmlToHtmlSelected()` |
| `isExportHtmlToExcelSelected()` |

**Sub-components**
_none_

---

### FolderBrowsingPage
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ShowFooterPathCheckbox` | `#showFooterPath` | element |
| `HideMyReportsCheckbox` | `#hideMyReports` | element |

**Actions**
| Signature |
|-----------|
| `checkShowFooterPath()` |
| `checkHideMyReports()` |
| `isShowFooterPathChecked()` |
| `isHideMyReportsChecked()` |

**Sub-components**
_none_

---

### GeneralPage
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AvailableFonts` | `#availableFonts` | element |
| `AddButton` | `#addFont` | element |
| `RemoveButton` | `#removeFont` | element |
| `SelectedFonts` | `#selectedFonts` | dropdown |
| `MoveFontUpButton` | `#moveFontUp` | element |
| `CustomFontSizeInputBox` | `#fontSize` | element |
| `MSTRLibraryConfigInputBox` | `#consumerWebBaseURL` | element |
| `MSTRLibraryConfigExample` | `#consumerWebBaseURL_label` | element |
| `LinkToDocBtn` | `.preferenceList tr a` | element |
| `ConnectorsUrlInputBox` | `#connectorWebBaseURL` | element |
| `AvailableBox` | `#availableObjectsList` | element |
| `SelectedBox` | `#selectedObjectsList` | dropdown |
| `RemoveFromSelectedButton` | `.mstrIcon-btn.mstrIcon-btnArrowLeft` | button |
| `LocaleDropdown` | `#locale` | element |

**Actions**
| Signature |
|-----------|
| `setValueForGeneralDropdown(value, option)` |
| `setValueForDropdownInSection(section, value, option)` |
| `checkGeneralSetting(value)` |
| `uncheckGeneralSetting(value)` |
| `setCustomFont(font)` |
| `setCustomFontSize(text)` |
| `linkToDoc()` |
| `inputLibraryConfigUrl(text)` |
| `inputConnectorUrl(text)` |
| `setSearchAutoCompleteDelay(value)` |
| `removeFromSelected(value)` |
| `uncheckAllowQuickSearch()` |
| `checkAllowQuickSearch()` |
| `uncheckAllowAutoSubmitSearch()` |
| `uncheckAllowGridViewSearch()` |
| `uncheckSearchObjectType(value)` |
| `setRerunAgainstWarehouse()` |
| `setAdminInfo(text)` |
| `setValueForDropDownWithID(id, value)` |
| `setLanguage(value)` |
| `setLanguageSection(value, unit, timezone)` |
| `showAdvancedOptions()` |
| `setNumberDate(value)` |
| `setMetadata(value)` |
| `setWHData(value)` |
| `setIServerMsg(value)` |
| `setUnits(value)` |
| `setTimeZone(value)` |
| `inputMaxSortNumber(value)` |
| `isGeneralDropdownOptionSelected(value, option)` |
| `isDropdownOptionSelectedInSection(section, value, option)` |
| `isGeneralSettingChecked(value)` |
| `isUseDefaultFontSelected()` |
| `isUseDefaultFontSizeSelected()` |
| `getLibraryConfigText()` |
| `getMSTRLibraryConfigExampleText()` |
| `getConnectorsUrlText()` |
| `getSearchAutoCompleteDelayText()` |
| `isItemExistInAvailableList(value)` |
| `isRerunAgainstWarehouseSelected()` |
| `localeText()` |

**Sub-components**
- getPreferencePanel

---

### GraphDisplayPage
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `setUseSettingStored()` |
| `setUseCustomSetting()` |
| `inputWidth(width)` |
| `inputHeight(height)` |
| `checkGraphShowGridGraph()` |
| `setImageFormat(value)` |
| `isUseSettingStoredSelected()` |
| `isUseCustomSettingSelected()` |
| `getWidthText()` |
| `getHeightText()` |
| `isGraphShowGridGraphChecked()` |
| `getImageFormatText()` |

**Sub-components**
_none_

---

### GridDisplayPage
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `setGridStyle(value)` |
| `setDefaultGridStyle(value)` |
| `inputMaxRows(text)` |
| `inputMaxColumns(text)` |
| `setShowAttr(value)` |
| `checkShowPivot()` |
| `checkShowSort()` |
| `checkShowUnusedAttr()` |
| `uncheckDisplayAxes()` |
| `uncheckEnableWSFormsSorting()` |
| `uncheckAutoPageBy()` |
| `checkShowPageBy()` |
| `uncheckUseImageForOutlineMode()` |
| `uncheckWrapRowHeader()` |
| `checkWrapMetricValue()` |
| `checkShowDescriptionAsTooltip()` |
| `uncheckAllowLinkDrillingOnHeader()` |
| `chooseGridOption(name, isChecked)` |
| `isOptionChecked(name)` |
| `getGridStyleText()` |
| `getDefaultGridStyleText()` |
| `getMaxRowText()` |
| `getMaxColumnText()` |
| `getShowAttrText()` |
| `isShowPivotButtonChecked()` |
| `isShowSortButtonChecked()` |
| `isShowUnusedAttrChecked()` |
| `isDisplayAxesChecked()` |
| `isEnableWSFormsSortingChecked()` |
| `isAutoPageByChecked()` |
| `isShowPageByChecked()` |
| `isUseImageForOutlineModeChecked()` |
| `isWrapRowHeaderChecked()` |
| `isWrapMetricValueChecked()` |
| `isShowDescriptionAsTooltipChecked()` |
| `isAllowLinkDrillingOnHeaderChecked()` |

**Sub-components**
- getAutoPage
- getShowPage
- getPage

---

### HistoryListPage
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `WorkingSetSizeInputBox` | `#workingSetSize` | element |
| `NewScheduledCheckbox` | `#inboxReuseMessage` | element |
| `ScheduledRWDFormat` | `#scheduledRWDFormat` | element |
| `DuplicateMessageCheckbox` | `#newHistoryListMessageUponReprompt` | element |

**Actions**
| Signature |
|-----------|
| `setAutoAdd()` |
| `inputWorkingSetSize(text)` |
| `uncheckNewScheduled()` |
| `setScheduledRWDFormat(value)` |
| `checkDuplicateMessage()` |
| `isAutoAddSelected()` |
| `getWorkingSetSizeText()` |
| `isNewScheduledChecked()` |
| `getScheduledRWDFormatText()` |
| `isDuplicateMessageChecked()` |

**Sub-components**
_none_

---

### NavigationBar
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `PreferencePanel` | `.mstrPanelPortrait` | element |
| `LeftToolbar` | `.prefsToolbar` | element |

**Actions**
| Signature |
|-----------|
| `clickItemInLeftToolbar(text)` |
| `clickLevelPreferencePage(level, page)` |
| `isItemExistInLeftToolbar(text)` |

**Sub-components**
- getSelectedPage
- getPreferencePanel

---

### OfficePage
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `PreferenceList` | `.preferenceList tbody td table` | element |
| `RefreshReportCheckbox` | `#exportReportOfficeRefresh` | element |

**Actions**
| Signature |
|-----------|
| `uncheckRefreshDocument()` |
| `checkRefreshReport()` |
| `isRefreshDocumentChecked()` |
| `isRefreshReportChecked()` |

**Sub-components**
_none_

---

### WebPreferencePage
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `PreferencesBody` | `.mstr-page-prefs` | element |
| `LanguageSection` | `#locale-section` | element |
| `LeftToolbar` | `.prefsToolbar` | element |
| `HierarchicalSortSection` | `#hierarchicalSort` | element |

**Actions**
| Signature |
|-----------|
| `setValueForDropDown(id, value)` |
| `clickItemInLeftToolbar(text)` |
| `setLanguage(value)` |
| `setNumberDate(value)` |
| `setMetadata(value)` |
| `setWHData(value)` |
| `setIServerMsg(value)` |
| `setUnits(value)` |
| `setTimeZone(value)` |
| `setHierarchicalSort(value)` |
| `getHierarchicalSortType()` |
| `applyChanges()` |
| `waitForPageDisplayed()` |
| `isPreferenceSaved()` |

**Sub-components**
- generalPage

---

### PrintReportsPage
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `setAdjustFontTo(text)` |
| `setFitToPagesWide(text)` |
| `setFitToPagesTall(text)` |
| `setAdjustFont()` |
| `setFitTo()` |
| `setPrintToPortrait()` |
| `setPrintToLandscape()` |
| `setPrintWithFilterDetails()` |
| `setPrintWithReportDetails()` |
| `setCoverPageBeforeReport()` |
| `setCoverPageAfterReport()` |
| `setPrintReportsDropdown(value, option)` |
| `getAdjustFontToText()` |
| `isSetAdjustFont()` |
| `isSetFitTo()` |
| `isSetPrintToPortrait()` |
| `isSetPrintToLandscape()` |
| `isSetPrintWithFilterDetails()` |
| `isSetPrintWithReportDetails()` |
| `isSetCoverPageBeforeReport()` |
| `isSetCoverPageAfterReport()` |

**Sub-components**
- getPrintCoverPage
- getFitToPage
- getCoverPage

---

### ProjectDispalyPage
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ProjectAliasInputBox` | `#projectAlias` | element |
| `ProjectSortIndexInputBox` | `#projectIndex` | element |
| `ProjectHeaderTextInputBox` | `#projectHeader` | element |
| `ProjectHeader` | `.mstrProjectHeader` | element |

**Actions**
| Signature |
|-----------|
| `inputProjectHeaderText(text)` |
| `inputProjectSortIndex(text)` |
| `inputProjectAlias(text)` |
| `isProjectHeaderPresent()` |
| `projectHeaderText()` |
| `projectAliasText()` |
| `sortIndexText()` |

**Sub-components**
_none_

---

### PromptPage
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectSeparatePage(level, page)` |
| `checkPreserveWhiteSpace(level, page)` |
| `checkPromptsRequiredFirst(level, page)` |
| `checkShowPromptDetails(level, page)` |
| `checkPromptsMatchCaseSensitivity(level, page)` |
| `checkPromptsRenameReport(level, page)` |
| `checkShowObjectDescription(level, page)` |
| `checkPersonalAnswer(level, page)` |
| `checkTrimWarehouseData(level, page)` |
| `setMQDefaultOperatorDropDown(level, page, value)` |
| `setAQHQDefaultOperatorDropDown(level, page, value)` |

**Sub-components**
- clickLevelPreferencePage
- getSeparatePage

---

### ReportServicesPage
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `DPIInputBox` | `#dpiConversion` | element |

**Actions**
| Signature |
|-----------|
| `inputDotPerInch(text)` |
| `setGridDensity(value)` |
| `setSelectionBehavior(value)` |
| `setRsdWidthMode(value)` |
| `setRsdSectionHeightMode(value)` |
| `uncheckOfficeExportRefresh()` |
| `uncheckFloatingApplySelector()` |
| `setEmbedFontMode(value)` |
| `setDefaultTheme(value)` |
| `inputPingServerTime(text)` |
| `setRsdExecutionMode(value)` |
| `setContentAlignment(value)` |
| `uncheckUseNLP()` |
| `getDPIText()` |
| `getGridDensityText()` |
| `getSelectionBehaviorText()` |
| `getRsdWidthModeText()` |
| `getRsdSectionHeightModeText()` |
| `isOfficeExportRefreshChecked()` |
| `isFloatingApplySelectorChecked()` |
| `getEmbedFontModeText()` |
| `getDefaultThemeText()` |
| `getPingServerTimeText()` |
| `getRsdExecutionModeText()` |
| `getContentAlignmentText()` |
| `isUseNLPChecked()` |

**Sub-components**
_none_

---

### SchedulePage
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AvailableSchedulesList` | `#availableSchedulesList` | element |
| `SelectedSchedulesList` | `#selectedSchedulesList` | dropdown |
| `AddBtn` | `.mstrIcon-btn.mstrIcon-btnArrowRight` | button |
| `AddAllBtn` | `.mstrIcon-btn.mstrIcon-btnAddAll` | button |
| `RemoveBtn` | `.mstrIcon-btn.mstrIcon-btnArrowLeft` | button |

**Actions**
| Signature |
|-----------|
| `setAllowAll()` |
| `setOnlyAllow()` |
| `addItemsToSelections(items)` |
| `addAllElementsToSelections()` |
| `removeFromSelections(item)` |
| `save()` |
| `selectSchedules(item)` |
| `getSelectedScheduleItemsText()` |

**Sub-components**
_none_

---

### SecurityPage
> Extends: `BasePreference`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ExportURLInputBox` | `.prefs-addNewURL` | element |
| `ExportURLAddBtn` | `.mstrButton.prefs-addNewURL-btn` | button |
| `ExportURLListView` | `.mstrListView.urlList` | element |
| `ExportURLMsg` | `#prefs-url-msg` | element |
| `ExportURLApplyEditIcon` | `.listTableView-url-apply` | element |
| `ExportURLCancelEditIcon` | `.listTableView-url-cancel` | element |
| `ExportURLEditBox` | `.listTableView-url-edit` | element |
| `LoginModesList` | `.preferenceList` | element |

**Actions**
| Signature |
|-----------|
| `getExportURLMsg()` |
| `addExportURL(url, action = 'addButton')` |
| `editExportURL(baseURL, newURL, action = 'editButton')` |
| `cancelExportURLEdit()` |
| `applyExportURLEdit(action = 'confirmButton')` |
| `deleteExportURL(url)` |
| `deleteAllExportURLs()` |
| `setYesForCancelPendingRequests()` |
| `setYesForRemoveFinishedJobs()` |
| `enableGuestMode()` |
| `setLoginMode(loginMode, isSet)` |
| `setDefaultLoginMode(modeName)` |
| `setOnlyTheReadMessages()` |
| `uncheckShowCancelSession()` |
| `uncheckShowRemoveFinishedJobs()` |
| `getAllowedURLListCount()` |
| `isYesRadioBtnForCancelPendingRequestSelected()` |
| `isYesRadioBtnForRemoveFinishedJobsSelected()` |
| `isOnlyTheReadMessagesSelected()` |

**Sub-components**
- getExportURLListContainer
- getPreferencePanel

---

### ToolBar
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `NavigationBar` | `#preferencesToolbar` | element |
| `ApplyToDropdown` | `#projectLevel` | element |
| `CloseBtn` | `.mstrIconNoTextDecoration.mstrVerticalLine` | element |

**Actions**
| Signature |
|-----------|
| `applyChanges()` |
| `close()` |

**Sub-components**
_none_
