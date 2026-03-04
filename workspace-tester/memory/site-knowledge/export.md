# Site Knowledge: export

> Components: 9

### ExportToCSV
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ExportCSVPanel` | `.mstrd-DossierCsvPanel` | element |
| `ReportCsvPanel` | `.mstrd-ReportCsvPanel` | element |
| `CSVRangeSetting` | `label=Range` | element |
| `RangeDropDownContents` | `.mstrd-DropDown-content` | dropdown |
| `RangeAll` | `.mstrd-Tree-all .mstrd-TriStateCheckbox` | element |
| `InfoWindowExportButton` | `.mstrd-ExportPanelInLibrary-submitButton` | button |
| `CSVDelimiterDropdown` | `label=Delimiter` | element |
| `DelimiterInput` | `.mstrd-ExportPanel-options` | element |
| `InfoWindowCSVExportDialog` | `.mstrd-ExportPanelInLibrary-content` | element |
| `IWExportCSVButton` | `.mstr-menu-icon.icon-share_csv` | element |
| `ContextMenu` | `.mstrd-ContextMenu.mstrd-DossierContextMenu` | element |

**Actions**
| Signature |
|-----------|
| `inputDelimiter(option)` |
| `clickCSVDelimiterDropdown()` |
| `clickDelimiterOption(option)` |
| `clickCSVRangeSetting()` |
| `clickExportButton()` |
| `clickRangeDropdown()` |
| `clickRangeAll()` |
| `clickArrowByChapterName(name)` |
| `clickCheckboxByPageName(name)` |
| `clickCheckboxByChapterName(name)` |
| `clickOnlyByPageName(name)` |
| `clickOnlyByChapterName(name)` |
| `clickInfoWindowExportButton()` |
| `clickExportPageByInfoCheckbox()` |
| `clickExpandPageByCheckbox()` |
| `clickReportExportButton()` |
| `clickExportCSVButton()` |
| `hoverOnContextMenuShareItem()` |
| `clickExportToCsvItemInContextMenu()` |
| `clickTitlebarExportCSVButton(vizName)` |

**Sub-components**
- getExportCSVPanel
- getReportCsvPanel
- getCheckboxByPage
- getPage
- getOnlyButtonByPage
- getExportPage
- getExpandPage

---

### ExportToExcel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ExportExcelPanel` | `.mstrd-DossierExcelPanel` | element |
| `InfoWindowExportExcelButton` | `.mstrd-ExportPanelInLibrary-buttons` | button |
| `ExportExcelSettingsPanel` | `.mstrd-DossierExcelPanel` | element |
| `ReportExportExcelSettingsPanel` | `.mstrd-ReportExcelPanel` | element |
| `ExportExcelPanelContent` | `.mstrd-ExportPanelInLibrary-content` | element |
| `RSDExportExcelPanel` | `.mstrd-MenuPanel.mstrd-DocumentExcelPanel` | element |
| `InfoWindowReportExportButton` | `.mstrd-ExportPanelInLibrary-submitButton` | button |
| `ExcelRangeSettings` | `.mstrd-ExcelExportPagesSetting` | element |
| `ExcelContentsSetting` | `label=Contents` | element |
| `ExcelContents` | `label=Contents` | element |
| `ExcelRangeSetting` | `label=Range` | element |
| `ExcelRange` | `label=Range` | element |
| `ExcelDropDownContents` | `.mstrd-DropDown-content` | dropdown |
| `VizList` | `.mstrd-DossierExcelForm-vizList` | element |
| `VizualizationExportExcelDialog` | `.mstrd-ExportExcelDialog` | element |
| `ReportMoreSettingsArrow` | `.mstrd-ExportPanel-options .mstrd-ExportForm-collapsibleArea .icon-menu-arrow` | element |
| `ReportExportToExcelDialog` | `.mstrd-ReportExcelPanel` | element |
| `ReportIWExportCancel` | `.mstrd-ReportExcelPanelInLibrary` | element |
| `ShowFiltersCheckbox` | `.mstrd-Checkbox-shape.icon-checkmark` | element |
| `LoadingButton` | `.mstrd-Spinner-blade` | element |

**Actions**
| Signature |
|-----------|
| `clickVisualizationExportButton()` |
| `isVizualizationExportExcelDialogwOpen()` |
| `clickLibraryExportButton()` |
| `isLibraryExportExcelWindowOpen()` |
| `openExcelRangeSetting()` |
| `openExcelContentsSetting()` |
| `selectExcelContents(content)` |
| `clickArrowByChapterName(name)` |
| `clickCheckboxByPageName(name)` |
| `clickCheckboxByChapterName(name)` |
| `clickOnlyByChapterName(name)` |
| `clickOnlyByPageName(name)` |
| `selectGrid(gridName)` |
| `hoverOnGrid(gridName)` |
| `clickExportButton()` |
| `clickInfoWindowExportButton()` |
| `clickInfoWindowReportExportButton()` |
| `clickShareMenuExportButton()` |
| `clickReportShareMenuExportButton()` |
| `clickRSDExportButton()` |
| `selectGridOnly(gridName)` |
| `_selectDropDownItemOption({ dropDownOption, dropDownItems })` |
| `selectExcelRange(dropDownOption)` |
| `isExportDisabled()` |
| `clickReportMoreSettings()` |
| `clickReportExportPageByInfoCheckbox()` |
| `clickExportReportTitleCheckbox()` |
| `clickReportIWExportCancelButton()` |
| `clickShowFiltersCheckbox()` |
| `waitForExportLoadingButtonToDisappear(timeout = 60000)` |
| `clickTitlebarExportExcelButton(vizName)` |
| `waitForExportComplete(appearTimeout = 10000)` |

**Sub-components**
- getExportExcelPanel
- getExportExcelSettingsPanel
- getReportExportExcelSettingsPanel
- getRSDExportExcelPanel
- _getDropDownContainer
- getCheckboxByPage
- getPage
- getOnlyButtonByPage
- getReportExportPage

---

### ExportExcelDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ExportExcelPanel` | `.mstrd-ExportExcelDialog` | element |

**Actions**
| Signature |
|-----------|
| `clickExportButton()` |

**Sub-components**
- getExportExcelPanel

---

### ExportNotification
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ExportCompleteNotification` | `.ant-notification.ant-notification-bottomRight` | element |

**Actions**
| Signature |
|-----------|
| `clickExportCompleteCloseButton()` |
| `isExportCompleteNotificationVisible()` |
| `isExportCompleteCloseButtonVisible()` |
| `getExportCompleteDescriptionText()` |

**Sub-components**
_none_

---

### LibraryAuthoringExcelExport
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `openRangeDropdown()` |
| `openContentDropdown()` |
| `selectExcelRange(option)` |
| `selectExcelContent(option)` |
| `clickShowFiltersCheckbox()` |
| `clickOKButton()` |
| `clickReactDropdownOption(dropdownLabel, optionText)` |
| `clickReactShowFiltersCheckbox()` |

**Sub-components**
_none_

---

### LibraryAuthoringPDFExport
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `PDFSettings` | `.mstrmojo-DocProps-Editor-PdfSettings` | element |
| `PortraitButton` | `.mstrmojo-DashboardPdfSettings-portrait` | element |
| `LandscapeButton` | `.mstrmojo-DashboardPdfSettings-landscape` | element |
| `ReactShowFilterDropdown` | `.mstr-docprops-container` | element |
| `ReactMarginLeftTextbox` | `.mstr-docprops-shared-customMargin` | element |
| `ReactMarginRightTextbox` | `.mstr-docprops-shared-customMargin` | element |
| `ReactMarginTopTextbox` | `.mstr-docprops-shared-customMargin` | element |
| `ReactMarginBottomTextbox` | `.mstr-docprops-shared-customMargin` | element |
| `ZoomInputBox` | `.mstrmojo-vi-ui-DashboardExportPanel-scaleControl .mstrmojo-TextBox` | element |
| `ZoomInIcon` | `.mstrmojo-vi-ui-DashboardExportPanel-zoomIn` | element |
| `ZoomOutIcon` | `.mstrmojo-vi-ui-DashboardExportPanel-zoomOut` | element |
| `ZoomSliderIcon` | `.sd .t2` | element |
| `MojoPdfExportSettings` | `.mstrmojo-RootView-exportControl` | element |
| `ExportPreview` | `.mstrmojo-vi-ui-rw-DashboardPrintLayout-page` | element |
| `FormatImageInputBox` | `.ant-input` | input |
| `FormatImageOKBtn` | `.abaloc-button-editurl .ant-btn` | button |
| `FormatFontSizeInput` | `.ant-input-number-input` | input |
| `FormatColorPicker` | `.color-picker-arrow-button` | button |
| `MarginLeftTextbox` | `.mstrmojo-DashboardPdfSettings-marginIconLeft` | element |
| `MarginRightTextbox` | `.mstrmojo-DashboardPdfSettings-marginIconRight` | element |
| `MarginTopTextbox` | `.mstrmojo-DashboardPdfSettings-marginIconTop` | element |
| `MarginBottomTextbox` | `.mstrmojo-DashboardPdfSettings-marginIconBottom` | element |

**Actions**
| Signature |
|-----------|
| `clickReactAdjustMarginCheckbox()` |
| `setReactMarginLeft(marginLeft)` |
| `setReactMarginRight(marginRight)` |
| `setReactMarginTop(marginTop)` |
| `setReactMarginBottom(marginBottom)` |
| `inputZoomValue(value)` |
| `clickZoomInIcon()` |
| `clickZoomOutIcon()` |
| `dragZoomSlider(direction, pixels)` |
| `openRangeDropdown()` |
| `openContentDropdown()` |
| `selectPDFRange(option)` |
| `selectPDFContent(option)` |
| `clickScaleToPageWidthRadio()` |
| `clickExtenColumnsOverPagesRadio()` |
| `clickRepeatColumnsCheckbox()` |
| `openPaperSizeDropdown()` |
| `selectPaperSize(option)` |
| `clickPortraitButton()` |
| `clickLandscapeButton()` |
| `clickReactShowTableOfContentsCheckbox()` |
| `clickShowHeaderCheckbox()` |
| `clickShowPageNumbersCheckbox()` |
| `clickShowFiltersCheckbox()` |
| `openReactShowFilterDropdown()` |
| `selectReactFilteroption(option)` |
| `clickOKButton()` |
| `clickCustomizedDropdown(option)` |
| `clickFooterCustomizedDropdown(option)` |
| `selectCustomizedSetting(option)` |
| `selectLeftCustomizedOptions(option1, option2)` |
| `selectLeftCustomizedDropdown(option)` |
| `setLeftCustomizedText(option, text)` |
| `setFooterLeftCustomizedText(option, text)` |
| `setLeftCustomizedImage(option, image)` |
| `selectCenterCustomizedOptions(option1, option2)` |
| `setCenterCustomizedText(option, text)` |
| `setFooterCenterCustomizedText(option, text)` |
| `setCenterCustomizedImage(option, image)` |
| `selectRightCustomizedOptions(option1, option2)` |
| `setRightCustomizedText(option, text)` |
| `setFooterRightCustomizedText(option, text)` |
| `setRightCustomizedImage(option, image)` |
| `clickReactLockButton(option)` |
| `clickExpandGridCheckbox()` |
| `clickScaleGridCheckbox()` |
| `clickReactDropdownOption(dropdownLabel, optionText)` |
| `clickReactPaperSizeDropdownOption(dropdownLabel, optionText)` |
| `clickReactAdvanceMode()` |
| `customizeHeaderFooterWithText(index, text)` |
| `customizeHeaderFooterWithImage(index)` |
| `selectFormatSegmentControl(option)` |
| `setFontStyle(index)` |
| `setFontSize(value)` |
| `setFontColor(index)` |
| `setFontHorizontalAlignment(index)` |
| `setFontVerticalAlignment(index)` |
| `clickAdvanceModeOkButton()` |
| `clickAdvanceModeCancelButton()` |
| `selectExportToPDFOnVisualizationMenu(title)` |
| `clickReactVizExportButton()` |
| `clickDropdownOption(dropdownLabel, optionText)` |
| `clickShowTableOfContentsCheckbox()` |
| `clickLockButton(option)` |
| `openShowFilterDropdown()` |
| `selectFilteroption(option)` |
| `clickAdjustMarginCheckbox()` |
| `setMarginLeft(marginLeft)` |
| `setMarginRight(marginRight)` |
| `setMarginTop(marginTop)` |
| `setMarginBottom(marginBottom)` |
| `clickReactPortraitButton()` |
| `clickReactLandscapeButton()` |
| `clickReactExpandGridCheckbox()` |
| `clickReactScaleGridCheckbox()` |

**Sub-components**
- getScaleToPage
- getExtenColumnsOverPage
- getShowPage

---

### PDFExport
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `MoreSettingsButton` | `.mstrd-ExportDetailsPanel-moreSettingsTitle` | element |
| `DetailLevelSettings` | `.mstrd-ExportContentSetting` | element |
| `FilterSummarySettings` | `.mstrd-ExportFilterSummary` | element |
| `PageSizeSettings` | `.mstrd-ExportPagerSizeSetting` | element |
| `PDFRangeSetting` | `label=Range` | element |
| `RangeDropDownContents` | `.mstrd-ExportDetailsPanel-options` | element |
| `RSDRangeDropDownContents` | `.mstrd-DropDown-content` | dropdown |
| `RangeAll` | `.mstrd-Tree-all .mstrd-TriStateCheckbox` | element |
| `GridSettings` | `.mstrd-ExportGrid` | element |
| `TableofContentsCheckBox` | `.mstrd-ExportPageInfo` | element |
| `HeaderCheckBox` | `.mstrd-ExportPageInfo` | element |
| `PageNumbersCheckBox` | `.mstrd-ExportPageInfo` | element |
| `RepeatAttributeColumnsCheckBox` | `.mstrd-ExportGrid-item-repeatColumn` | element |
| `ExpandAllGridDataCheckBox` | `.mstrd-ExportGrid-item-expandGrid` | element |
| `Orientation` | `.mstrd-ExportOrientationSetting-body` | element |
| `ShareSpinningIcon` | `.mstrd-spinner-export` | element |
| `PDFExportIcon` | `.mstr-menu-icon.icon-share_pdf` | element |
| `ExcelExportIcon` | `.icon-share_excel.mstr-menu-icon` | element |
| `CSVExportIcon` | `.icon-share_csv.mstr-menu-icon` | element |
| `GoogleSheetsExportIcon` | `.icon-share_google_sheets.mstr-menu-icon` | element |
| `ExportLoadingSpinner` | `.mstrd-Spinner` | element |
| `ExportIsCompleteNotification` | `.ant-notification.ant-notification-bottomRight` | element |
| `MojoPDFExportSettingsEditor` | `.mstrmojo-ExportPDFEditor` | element |
| `MojoPDFExportDisplayOption` | `.mstrmojo-Box.displayOption` | element |
| `LibraryExportPDFWindow` | `.mstrd-ExportDetailsPanelInLibrary` | element |
| `DossierExportPDFPanel` | `.mstrd-ExportDetailsPanel` | element |
| `ExportPageInfo` | `.mstrd-ExportPageInfo` | element |
| `ReportExportPDFPanel` | `.mstrd-MenuPanel.mstrd-ReportPdfPanel` | element |
| `PDFRange` | `label=Range` | element |
| `FilterSummaryTabOptionsView` | `.mstrd-ExportFilterSummary` | element |
| `AdvancedSettingsButton` | `.mstrd-ExportDetailsPanel-advancedSettingBarText` | element |
| `AdvancedSettingsPanel` | `.mstrd-ExportDetailsPanel-advancedSettingsPanel` | element |
| `PaperSizeDropDownButton` | `.mstrd-ExportPagerSizeSetting-dropdown .mstrd-DropDownBox-selected` | dropdown |
| `ExportButtonContainer` | `.mstrd-ExportDetailsPanel-buttonContainer, .mstrd-ExportDetailsPanelInLibrary-buttons` | button |
| `RSDExportDialog` | `.mstrd-MenuPanel.mstrd-ExportDetailsPanel` | element |
| `RSDVisualizationMenu` | `.mstrmojo-Button.mstrmojo-oivmSprite.tbDown` | button |
| `MarginOption` | `.mstrd-ExportMarginOptions` | element |

**Actions**
| Signature |
|-----------|
| `clickPDFRangeSetting()` |
| `clickRangeDropdown()` |
| `clickRangeAll()` |
| `clickArrowByChapterName(name)` |
| `clickCheckboxByPageName(name)` |
| `clickCheckboxByChapterName(name)` |
| `clickOnlyByPageName(name)` |
| `clickOnlyByChapterName(name)` |
| `selectDetailLevel(dropDownOption)` |
| `selectPageSize(dropDownOption)` |
| `selectFilterSummary(dropDownOption)` |
| `_selectDropDownItemOption({ dropDownOption, dropDownItems })` |
| `selectGridSettings(buttonName)` |
| `isRepeatAttributeColumnsEnabled()` |
| `toggleHeaderCheckBox()` |
| `togglePageNumbersCheckBox()` |
| `toggleFilterSummaryCheckBox()` |
| `toggleRepeatAttributeColumnsCheckBox()` |
| `toggleExpandAllGridDataCheckBox()` |
| `toggleTableofContentsCheckBox()` |
| `openVisualizationMenu({ elem, offset })` |
| `selectVisualizationMenuOptions({ elem, offset, firstOption, secondOption, thirdOption })` |
| `clickContextMenu(el, prompted = false)` |
| `clickMenuOptionInLevel({ level, option }, prompted = false)` |
| `selectExportToPDFOnVisualizationMenu(title)` |
| `selectMojoFilterSummary(dropDownOption)` |
| `selectMojoPageSize(dropDownOption)` |
| `selectMojoOrientation(option)` |
| `toggleMojoGridSettings(option)` |
| `toggleMojoGridRepeatColumns()` |
| `toggleMojoShowHeader()` |
| `toggleMojoShowPageNumber()` |
| `waitForExportComplete({ name, fileType })` |
| `close()` |
| `cancelExportSettingsVisualization()` |
| `exportSubmitPrompt()` |
| `exportSubmitLibrary()` |
| `exportByTab()` |
| `exportSubmitDossier()` |
| `exportSubmitVisualization()` |
| `openAdvancedSettingsPanel()` |
| `selectContentDropDownItemOption(dropDownOption)` |
| `selectPaperSizeDropDownItemOption(dropDownOption)` |
| `selectCheckBox(elem, shouldDeselect = false)` |
| `deselectCheckBox(elem)` |
| `_clickCheckbox(elem)` |
| `OpenDocumentSingleVisualizationMenuButton(title)` |
| `ExportDocumentSingleVisualization(type)` |
| `clickMoreSettings()` |
| `detailLevelSelectedItem()` |
| `pageSizeSelectedItem()` |
| `FilterSummarySelectedItem()` |
| `_isOrientationButtonSelected(orientationButton)` |
| `_isDropDownListOpen(elem)` |
| `isRangeDropDownListOpen()` |
| `isRSDRangeDropDownListOpen()` |
| `isLayoutTabSelected()` |
| `isFilterSummaryTabSelected()` |
| `isLibraryExportPDFSettingsWindowOpen()` |
| `isDossierExportPDFSettingsWindowOpen()` |
| `isVisExportPDFSettingsWindowOpen()` |
| `isAutoOrientationButtonSelected()` |
| `isPortraitOrientationButtonSelected()` |
| `isLandScapeOrientationButtonSelected()` |
| `_isCheckBoxSelected(elem)` |
| `isExportIndvlVizsCheckBoxSelected()` |
| `isHeaderCheckBoxSelected()` |
| `isPageNumbersCheckBoxSelected()` |
| `isExportLoadingSpinnerPresent()` |
| `isExportCompleteNotificationPresent()` |
| `closeExportCompleteNotification()` |
| `isExporttoPDFPresent()` |
| `isExporttoExcelPresent()` |
| `isExporttoCSVPresent()` |
| `isExporttoGoogleSheetsPresent()` |
| `isRSDExportTypePresent(type)` |
| `isRSDExportButtonPresent(title)` |
| `selectRange(option)` |
| `openRangeDialog()` |
| `openRSDVisualizationMenu()` |
| `clickReportShareMenuExportButton()` |
| `clickExpandPageBy()` |
| `clickAdjuectMarginCheckbox()` |
| `setMarginLeft(marginLeft)` |
| `setMarginRight(marginRight)` |
| `setMarginTop(marginTop)` |
| `setMarginBottom(marginBottom)` |
| `isHeaderCheckBoxEnabled()` |
| `isFooterCheckBoxEnabled()` |
| `clickExpandGridCheckbox()` |
| `clickScaleGridCheckbox()` |
| `clickVizExportButton()` |
| `clickTitlebarExportPDFButton(vizName)` |

**Sub-components**
- _getDropDownContainer
- getCheckboxByPage
- getPage
- getOnlyButtonByPage
- _getMojoDropDownContainer
- getMojoShowPage
- getReportExportPDFPanel
- _getExportButtonContainer
- getDossierExportPDFPanel
- getAdvancedSettingsPanel
- getExpandPage

---

### SubscriptionManagement
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SubscriptionEditor` | `.mstrd-SubscriptionEditor` | element |
| `ScheduleSettings` | `.mstrd-SubscriptionSettings-schedule` | element |
| `ContentSettings` | `.mstrd-SubscriptionSettings-content` | element |
| `FormatSettings` | `.mstrd-SubscriptionSettings-format .mstrd-Select-selected` | dropdown |
| `BookmarkSettings` | `.mstrd-SubscriptionSettings-content .mstrd-Select-selected` | dropdown |
| `SortDropdown` | `.mstrd-SortDropdown` | dropdown |
| `BookmarkLabel` | `.mstrd-SubscriptionSettings-content` | element |
| `ScheduleSelector` | `.mstrd-SubscriptionSettings-schedule` | element |
| `SubscriptionPanel` | `.mstrd-SubscribeDetailsPanel` | element |
| `SubscribeButton` | `.mstrd-MenuPanel-buttonArea` | button |
| `InfoWindowSubscriptionPanel` | `.mstrd-SubscriptionInfo` | element |
| `SharePanel` | `.mstrd-DropdownMenu-main` | dropdown |
| `InfoWindowEdit` | `.mstr-menu-icon.icon-subscrip_edit` | element |
| `SubscriptionRunNowButton` | `.icon-subscrip_run` | element |
| `SubscriptionEditButton` | `.icon-subscrip_edit` | element |
| `UnsubscribeButton` | `.icon-subscrip_unsubscribe` | element |
| `SubscribeIcon` | `.icon-group_recents.mstr-menu-icon` | element |
| `SubscriptionNoteButton` | `.icon-subscrip_notes` | element |
| `SendNowCheckbox` | `.mstrd-SubscriptionSettings-sendNow .mstrd-Checkbox-label` | element |
| `SendPreviewNowCheckbox` | `.mstrd-SubscriptionSettings-sendNow [role=checkbox]` | element |
| `SubscriptionFilterContainer` | `.mstrd-SubscriptionFilterDropdown` | dropdown |
| `UnsubscribeDisabled` | `.mstr-menu-icon.icon-subscrip_unsubscribe.disabled` | element |
| `PDFSettingsPanel` | `.mstrd-MenuPanel.mstrd-ExportDetailsPanel` | element |
| `InfoWindowPDFSettingsPanel` | `.mstrd-ExportDetailsPanelInLibrary` | element |
| `InfoWindowEditPanel` | `.mstrd-RecommendationsContainer-content` | element |
| `SubscriptionInfoIcon` | `.mstrd-SubscriptionEditor-title .mstrd-InfoIcon` | element |
| `SidebarPDFSettingsPanel` | `.mstrd-SubscriptionEditDialog-main` | element |
| `RecipientSearchBox` | `.mstrd-RecipientSearchSection .mstrd-RecipientSearchSection-searchBox` | element |
| `RecipientSearchSection` | `.mstrd-RecipientSearchSection` | element |
| `RangePanel` | `.mstrd-SubscriptionSettings-rangeSetting .mstrd-DropDown-content` | dropdown |
| `SubscriptionName` | `.mstrd-SubscriptionSettings-name` | element |
| `SubscriptionSidebarList` | `.mstrd-SubscriptionListContainer` | element |
| `SubscriptionSidebarEditDialog` | `.mstrd-SubscriptionEditDialog-main` | element |
| `SubscriptionSidebarResipientList` | `.mstrd-SubscriptionEditDialog-main .mstrd-RecipientSearchSection-searchList` | element |
| `SubscriptionShareResipientList` | `.mstrd-RecipientSearchSection-searchList` | element |
| `SubscriptionEmptyContent` | `.mstrd-EmptyContent` | element |
| `ExcelContentsSetting` | `label=Contents` | element |
| `ExcelRangeSetting` | `label=Range` | element |
| `ContentsSetting` | `.mstrd-SubscriptionSettings-excelContent` | element |
| `ExcelDropDownContents` | `.mstrd-DropDown-content` | dropdown |
| `SearchLoadingSpinner` | `.mstrd-RecipientSearchResults-loadingSpinner` | element |
| `SaveButtonWhenEditSubscription` | `.mstrd-SubscriptionEditor-saveButton` | button |
| `AllowUnsubscribe` | `.mstrd-SubscriptionSettings-unsubscribe .mstrd-Checkbox-label` | element |
| `SidebarContainer` | `.mstrd-SidebarContainer` | element |
| `FiltersApplyButton` | `.mstrd-BaseFilterPanel-applyBtn` | button |
| `ClearAllFiltersButton` | `.mstrd-BaseFilterPanel-clearBtn` | button |
| `LoadingButton` | `.mstrd-Spinner-blade` | element |
| `FormatDropdown` | `.mstrd-SubscriptionSettings-format` | element |
| `AllCheckboxStatus` | `.mstrd-Tree-all` | element |
| `BookmarkDropdown` | `.mstrd-SubscriptionSettings-content` | element |

**Actions**
| Signature |
|-----------|
| `dragHeaderWidth(name, offset)` |
| `getSubscriptionPropertyBySubscriptionName(subscriptionName, propertyName)` |
| `openSubscriptionSnapshotByName(name)` |
| `clickSubscriptionSortByOption(name)` |
| `isGetAllowUnsubscribePresent()` |
| `hoverSubscription(name)` |
| `clickEditButtonInSidebar(name, index = 1)` |
| `getGroupMemberCount(name)` |
| `searchRecipientByName(searchKey)` |
| `selectRecipients(userList, groupName = 'None')` |
| `selectRecipientGroup(groupName)` |
| `selectSidebarRecipients(userList, groupName = 'None')` |
| `openExcelContentsSetting()` |
| `selectExcelContents(content)` |
| `getFormatDropdown()` |
| `selectFormat(dropDownOption)` |
| `clickRangeDropdown()` |
| `clickRangeAll()` |
| `clickRangeItem(name)` |
| `clickItemOnly()` |
| `clickEdit(name)` |
| `waitForSubscriptionActionButtonsTobeEnabled(elem)` |
| `waitForBookmarkLoaded()` |
| `clickRunNowInSubscriptionListByName(name, index = 1)` |
| `getAllCheckboxStatus()` |
| `getScheduleDropdown()` |
| `selectSchedule(dropDownOption)` |
| `getBookmarkDropdown()` |
| `selectBookmark(dropDownOption)` |
| `inputName(text)` |
| `inputBookmark(text)` |
| `inputNote(text)` |
| `clickSend()` |
| `createSubscription()` |
| `waitForSubscriptionCreated()` |
| `toggleSendPreviewNow(toggleOn = true)` |
| `clickInfoWindowEdit(isValid = true)` |
| `clickInWindowRunNow()` |
| `clickSave()` |
| `clickUnsubscribe()` |
| `clickUnsubscribeYes()` |
| `clickSwitchRight()` |
| `clickSwitchLeft()` |
| `closeSubscribe()` |
| `clickSidebarUnsubscribe(name)` |
| `clickSidebarSave()` |
| `isUnsubscribeDisabledPresent()` |
| `isSubscriptionRunNowPresent()` |
| `isSubscriptionEditPresent()` |
| `isUnSubscribePresent()` |
| `isSubscribePresent()` |
| `isSubscriptionNotePresent()` |
| `isSendNowPresent()` |
| `isSubscriptionEmptyContentPresent()` |
| `isSidebarContainerPrenent()` |
| `clickSubscriptionFilter()` |
| `clickFilterContent()` |
| `clickFilterType()` |
| `clickFilterOption(name)` |
| `clickFiltersApplyButton()` |
| `clickClearAllFiltersButton()` |
| `clickFilterOptionOnly(name)` |
| `clickFiltersOption(option)` |
| `clickFiltersOptionOnly(option)` |
| `clickSubscriptionFilterApply()` |
| `clickClearAll()` |
| `clickSelectAllButton()` |
| `clickClearAllButton()` |
| `clickSelectAll()` |
| `clickFiltersType()` |
| `clickSubscriptionClearFilters()` |
| `clickSortByDropdown()` |
| `openPDFSettingsMenu()` |
| `exitPDFSettingsMenu()` |
| `exitInfoWindowPDFSettingsMenu()` |
| `clickSidebarCancel()` |
| `searchRecipient(name)` |
| `searchSidebarRecipient(name)` |
| `selectRecipient(name)` |
| `deleteRecipient(name)` |
| `clickAllowUnsubscribe()` |
| `getSubscriptionNameText()` |
| `isSubscriptionExisted(name)` |
| `getScheduleItem()` |
| `getFormatItem()` |
| `getFormatDropdownOptionValues()` |
| `getScheduleDropdownOptionValues()` |
| `clickOnlyByChapterName(name)` |
| `getRangeCheckboxStatus(name)` |
| `clickCheckboxByChapterName(name)` |
| `clickArrowByChapterName(name)` |
| `clickCheckboxByPageName(name)` |
| `isUnSubscribePresentByName(name)` |
| `isSidebarEditPresentByName(name)` |
| `isSidebarRunNowPresentByName(name)` |
| `selectSortDirection(dir)` |
| `getCurrentBookmarkSelection()` |
| `getConditionTooltipText()` |
| `waitForLoadingButtonToDisappear(timeout = 60000)` |

**Sub-components**
- getSubscriptionContainer
- getContainer
- _getDropDownContainer
- getSubscriptionPanel
- getSubscriptionFilterContainer
- getInfoWindowEditButtonContainer
- getInfoWindowRunowButtonContainer
- getSidebarContainer
- getCheckboxByPage

---

### SubscriptionDialog
> Extends: `SubscriptionManagement`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SubscriptionPanel` | `.mstrd-SubscriptionDialog` | element |
| `ContentPanel` | `.mstrd-Dialog-content` | element |
| `SubscriptionName` | `.mstrd-SubscriptionTopSettings-name .mstrd-Input` | input |
| `SubscriptionNameEditButton` | `.mstrd-SubscriptionTopSettings-name` | element |
| `BookmarkTextbox` | `.mstrd-SubscriptionContentSettings-newBookmarkName` | element |
| `ContentSettingsSection` | `.mstrd-SubscriptionForm.mstrd-SubscriptionContentSettings` | element |
| `BookmarkPickerContainer` | `.mstrd-SubscriptionContentSettings-bookmark` | element |
| `RecipientsSettingsSection` | `.mstrd-SubscriptionRecipientSettings` | element |
| `DeliverySettingsSection` | `.mstrd-SubscriptionDeliverySettings` | element |
| `DeliveryDialog` | `.mstrd-SubscriptionDeliverySettings` | element |
| `ScheduleSelectorDropdown` | `.mstrd-CapsuleComboBox-popup` | element |
| `SubscribeButton` | `.mstrd-Dialog-buttonArea` | button |
| `LoadingButton` | `.mstrd-Spinner-blade` | element |
| `InfoWindowSubscriptionPanel` | `.mstrd-SubscriptionInfo` | element |
| `InfoWindowEdit` | `.mstr-menu-icon.icon-subscrip_edit` | element |
| `FiltersApplyButton` | `.mstrd-BaseFilterPanel-applyBtn` | button |
| `ClearAllFiltersButton` | `.mstrd-BaseFilterPanel-clearBtn` | button |
| `RecipientTextbox` | `.mstrd-CapsuleComboBox-value` | element |
| `SubscriptionEmptyContent` | `.mstrd-EmptyContent` | element |
| `AdvancedSettingsDialog` | `.mstrd-SubscriptionAdvancedSettings-main ` | element |
| `CompressZipCheckbox` | `.mstrd-SubscriptionAdvancedCompressionSettings` | element |
| `PromptButton` | `.mstrd-SubscriptionForm-enterButton` | button |
| `PromptDialog` | `.mstrd-SubscriptionDialog--prompt` | element |
| `ViewSummaryToggle` | `.mstrPromptEditorSwitchSummary > label` | element |
| `AddNewAddressButton` | `.mstrd-RecipientComboBox-addNew` | element |
| `AddressNameTextBox` | `.mstrd-PersonalAddressEditor .mstrd-Input:not([type])` | input |
| `AddressCancelButton` | `.mstrd-PersonalAddressEditor .mstrd-Button--secondary` | button |
| `FormatOptionDropdown` | `label=Format` | element |
| `DialogPanel` | `.mstrd-SubscriptionDialog-panel` | element |
| `FTPSettingsDialog` | `.mstrd-SubscriptionForm.mstrd-SubscriptionFTPSettings` | element |
| `ScheduleOptionsDialog` | `.mstrd-SubscriptionDeliverySettings-schedule` | element |
| `AllCheckboxStatus` | `.mstrd-Tree-all` | element |
| `BookmarkDropdown` | `.mstrd-SubscriptionContentSettings-bookmark` | element |

**Actions**
| Signature |
|-----------|
| `enableSendNowInReport()` |
| `disableSendNowInReport()` |
| `getFormatDropdown()` |
| `getTypeDropdown()` |
| `getDeviceDropdown()` |
| `getDataDelimiterDropdown()` |
| `getExcelExpandAllPagebyDropdown()` |
| `waitForSelectedFormatLoaded()` |
| `waitForSelectedScheduleLoaded()` |
| `waitForSelectedBookmarkLoaded()` |
| `getFormatDropdownOptionValues()` |
| `getScheduleDropdownOptionValues()` |
| `inputSubscriptionName(text)` |
| `updateSubscriptionName(name)` |
| `clickSubscriptionNameEditButton()` |
| `inputFileName(name)` |
| `inputBookmarkName(name)` |
| `inputEmailSubject(subject)` |
| `inputNote(note)` |
| `inputMessage(note)` |
| `inputFileNameDelimiter(character)` |
| `inputDataDelimiter(Delimiter)` |
| `createSubscription()` |
| `getScheduleDropdown()` |
| `openScheduleDropdown()` |
| `selectSchedule(dropDownOption)` |
| `toggleScheduleTab()` |
| `selectFormat(dropDownOption)` |
| `selectDataDelimiter(dropDownOption)` |
| `selectExcelExpandAllPageby(dropDownOption)` |
| `waitForLoadingButtonToDisappear(timeout = 60000)` |
| `clickAllowUnsubscribeCheckbox()` |
| `clickCustomizeHeaderFooter()` |
| `clickExpandAllPageByFields()` |
| `clickExportPageByInformation()` |
| `clickExportReportTitle()` |
| `clickExportFilterDetails()` |
| `clickSendNowCheckbox()` |
| `clickSave()` |
| `waitForSubscriptionActionButtonsTobeEnabled(elem)` |
| `clickInfoWindowEdit(isValid = true)` |
| `closeSubscribe()` |
| `hoverSubscription(name)` |
| `editPromptInSubscription(name)` |
| `clickEditButtonInSidebar(name, index = 1)` |
| `clickSidebarUnsubscribe(name)` |
| `clickUnsubscribeYes()` |
| `clickSubscriptionSortByOption(name)` |
| `clickSubscriptionFilter()` |
| `clickFilterContent()` |
| `clickFilterType()` |
| `clickFilterOption(name)` |
| `clickFiltersApplyButton()` |
| `clickClearAllFiltersButton()` |
| `clickFilterOptionOnly(name)` |
| `clickFiltersOption(option)` |
| `clickFiltersOptionOnly(option)` |
| `clickSubscriptionFilterApply()` |
| `clickClearAllButton()` |
| `clickSelectAllButton()` |
| `clickRangeDropdown()` |
| `clickRangeAll()` |
| `clickCheckboxByPageName(name)` |
| `getRangeCheckboxStatus(name)` |
| `clickCheckboxByChapterName(name)` |
| `clickArrowByChapterName(name)` |
| `clickCheckboxByPageName(name)` |
| `getAllCheckboxStatus()` |
| `inputRecipient(name)` |
| `addRecipient(name)` |
| `inputCustomizeHeader(name)` |
| `inputCustomizeFooter(name)` |
| `selectRecipient(name)` |
| `getBookmarkDropdown()` |
| `selectBookmark(dropDownOption)` |
| `clickSwitchRight()` |
| `clickUnsubscribe()` |
| `clickUnsubscribeYes()` |
| `clickSidebarSave()` |
| `hoverSubscription(name)` |
| `clickSidebarCancel()` |
| `isSubscriptionEmptyContentPresent()` |
| `clickAdvancedSettingsButton()` |
| `clickCompressZipFileCheckbox()` |
| `inputZipFileName(text)` |
| `inputZipFilePW(text)` |
| `clickBackButton()` |
| `clickExpandLayoutsCheckbox()` |
| `clickExpandPageByCheckbox()` |
| `clickAllowChangeDeliveryCheckbox()` |
| `clickAllowChangePersonalizationCheckbox()` |
| `openContentByOrder(i)` |
| `clickEditContentArrow()` |
| `clickCloseButton()` |
| `isSendNowPresent()` |
| `clickPromptButton()` |
| `clickViewPromptToggle()` |
| `clickApplyButton()` |
| `clickAddNewAddressButton()` |
| `clickAddressNameTextBox()` |
| `clickEmailAddressTextBox()` |
| `clickAddressCancelButton()` |
| `clickFormatDropdown()` |
| `clickExpandGridCheckbox()` |
| `clickScaleGridCheckbox()` |
| `clickUseTimezonesCheckbox()` |
| `isUseTimezonesCheckboxChecked()` |
| `getTypeDropdown()` |
| `selectType(dropDownOption)` |
| `clickSendNotificationCheckbox()` |
| `clickUsersRadioButton()` |
| `clickSubFolderRadioButton()` |
| `selectSubscriptionDevice(dropDownOption)` |
| `inputDeviceSubFolder(text)` |
| `isSubFolderRadioAvailable()` |
| `OpenScheduleOptions()` |
| `clickEventScheduleOptions(options)` |
| `clickTimeScheduleOptions(options)` |
| `clickScheduleOKButton()` |

**Sub-components**
- getFormatPickerContainer
- getSchedulePickerContainer
- getBookmarkPickerContainer
- getContentPanel
- getExcelExpandAllPage
- getExpandAllPage
- getExportPage
- getInfoWindowEditButtonContainer
- getCheckboxByPage
- getExpandPage
