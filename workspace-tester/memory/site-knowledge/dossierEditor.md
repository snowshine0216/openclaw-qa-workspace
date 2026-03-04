# Site Knowledge: dossierEditor

> Components: 16

### AutoDashboard
> Extends: `AIBotChatPanel`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AutoDashboard` | `#rootView .mstrmojo-RootView-vizControl .mstrmojo-VizControl` | element |
| `AiWelcomeImage` | `.mstrd-ChatPanelContainer-welcome` | element |
| `AiWelcomePopup` | `.ai-assistant-tooltip` | element |
| `InputBox` | `.mstr-chatbot-chat-input__textarea` | input |
| `AutoDash2InputBox` | `.mstr-chatbot-chat-input-inline__textarea` | input |
| `SendIcon` | `.mstr-chatbot-chat-input__send-btn` | button |
| `AutoDash2SendIcon` | `.mstr-chatbot-chat-input-inline__send-btn` | button |
| `AutoDash2ErrorContent` | `.mstr-ai-chatbot-ChatPanel-error-container` | element |
| `AutoDash2waitbox` | `.mstr-autodash-v2-wait` | element |
| `ClearBtn` | `.icon-mstrd_ai_clear` | element |
| `AIDiagDownloadIcon` | `.mstr-ai-chatbot-DiagnosticsTab-btns` | button |
| `AIDiagCloseIcon` | `.mstr-ai-chatbot-DiagnosticsCloseIcon` | element |
| `AutoDash2ToggleBtn` | `.item.chatPanel` | element |
| `AutoDash2BeautyModeButton` | `.mstrd-AutoDashTitlebar-beautyModeButton` | button |
| `AutoDash2BeautyModesDialog` | `.mstrd-ChatPanelAutoDashStyleModes` | element |
| `LastSummaryText` | `.mstrmojo-Label.mstrWaitMsg` | element |

**Actions**
| Signature |
|-----------|
| `getPageRecommendationByIndex(index)` |
| `getShowErrorMessage2()` |
| `clickShowErrorDetails()` |
| `clickShowErrorDetails2()` |
| `getAddToPageButton()` |
| `openAutoDashboard(isDatasetAdded = false)` |
| `closeAutoDashboard()` |
| `toggleAutoDashboard2()` |
| `clickCreateAPageSuggetion()` |
| `clickPageCreationRecommendations()` |
| `clickRecommendationByIndex(index)` |
| `sendPrompt(text)` |
| `sendPromptInAutoDash2(text)` |
| `waitAutoDash2Process()` |
| `autoPageCreationByChat(pagePrompt)` |
| `clickVizCreationRecommendationByIndex(index)` |
| `vizCreationByChat(pagePrompt)` |
| `clearHistoryVizCreationByChat(pagePrompt)` |
| `addLastVizToPage()` |
| `createDossierFromSAASLibrary()` |
| `saveDossierAndCloseEditMode()` |
| `closeEditWithoutSaving()` |
| `storeQuota()` |
| `getRemoteQuota()` |
| `getQuota()` |
| `checkVizInAutoDashboard(index, testCase, imageName, tolerance = 0.5)` |
| `clearHistory()` |
| `clickChatPanelAnalysesByName(name)` |
| `clickDontShowPopupCheckboxInput()` |
| `openLatestAIDiag()` |
| `getLastSummaryText()` |
| `downloadAIDiag()` |
| `closeAIDiag()` |
| `showDetailsIfError()` |
| `showErrorDetailsAndFail()` |
| `waitForSuggestionReady()` |
| `sendPromptInAutoDash2NoWaitManipulation(Prompt)` |
| `processAILogFromBotStream(botstream)` |
| `getAutoDash2LatestAnswerText()` |
| `clickLockPageSizeApplyNowButton()` |
| `switchAutoDash2BeautificationMode(newModeName)` |
| `uploadAutoDashImage(imageName)` |
| `isUploadImageBtnDisplayed()` |

**Sub-components**
- dossierAuthoringPage
- libraryAuthoringPage
- getPage
- getAddToPage
- getChatPanel

---

### ContentsPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ContentsPanel` | `#rootView .mstrmojo-RootView-toc` | element |
| `SwitchContentsButton` | `.mstrmojo-RootView-datasets .mstrmojo-switchTabBtn` | button |
| `ContentsPanelSettingsMenu` | `.mstrmojo-ui-Menu-item-container` | element |
| `HorizontalTOCChapterSelector` | `.mstrmojo-VIDocument-top-selector` | dropdown |
| `HorizontalTOCPageSelector` | `.mstrmojo-VIVizPanel-top-selector` | dropdown |

**Actions**
| Signature |
|-----------|
| `getPage({ chapterName, pageName })` |
| `switchContentsTab()` |
| `clickOptionOnChapterMenu(chapterName, optionName)` |
| `goToPage({ chapterName, pageName })` |
| `rightClickPage({ chapterName, pageName })` |
| `clickOptionAfterOpenMenu(optionName)` |
| `switchPageFromContents({ chapterName, pageName })` |
| `goToPageWithNLG({ chapterName, pageName })` |
| `goToPageAndRefreshNLG({ chapterName, pageName })` |
| `getPagesCount()` |
| `getChapterCount()` |
| `validatePageSummaryText(pageDetails, expectedStrings)` |
| `getCurrentPageName()` |
| `openContentsPanelSettings()` |
| `clickContentsPanelMenuOption(optionName)` |
| `clickHorizontalTOCMenuButton()` |
| `clickHorizontalTOCAddChapterButton()` |
| `clickHorizontalTOCAddPageButton()` |

**Sub-components**
- dossierAuthoringPage
- editorPanel
- getContentsPanel
- getHorizontalTOCPage
- getPage
- goToPage
- getHorizontalTOCAddPage

---

### ContextualLinkEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SelectObjectPanel` | `.mstrmojo-Editor.mstrmojo-vi-ObjectPicker.modal` | element |

**Actions**
| Signature |
|-----------|
| `choosePrompt(name)` |
| `openAnswerPromptPullDown()` |
| `cancelEditor()` |
| `clickOpenFolderButton()` |
| `cancelSelectObjectPanel()` |
| `getSelectedTabName()` |
| `getAnswerPromptOptionsText()` |
| `isPromptSectionVisible()` |
| `isProjectSlectorDisabled()` |

**Sub-components**
- getSelectObjectPanel

---

### DatasetDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ConfirmationEditDatasetDialog` | `.mstrmojo-warning-ConfirmEditDataset` | element |
| `ParameterTypeContainer` | `.mstrmojo-ui-Menu-item-container` | element |
| `UpdateDatasetAlertDialog` | `.mstrmojo-Editor.mstrmojo-alert.modal` | element |
| `NotificationWarning` | `.mstrmojo-warning.mstrmojo-alert.modal` | element |

**Actions**
| Signature |
|-----------|
| `clickConfirmationEditDatasetDialogBtn(text)` |
| `clickCreateParameterBtn(type)` |
| `clickUpdateDatasetBtn()` |
| `clickCancelBtn()` |
| `hoverOnCancelBtn()` |
| `checkKeepChangesLocalCheckbox()` |
| `isKeepChangesLocalCheckboxChecked()` |
| `isKeepChangesLocalContainerPresent()` |
| `clickNotificationWarningBtn(text)` |
| `removeObjectFromList(objectName)` |
| `editObject(objectName)` |

**Sub-components**
- getParameterTypeContainer
- getKeepChangesLocalContainer

---

### DatasetsPanel
> Extends: `BaseAuthoring`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `DatasetsPanel` | `.mstrmojo-VIDatasetObjects` | element |
| `DatasetsSortAscendingBTN` | `.item.sort-ascending` | element |
| `DatasetsSortDescendingBTN` | `.item.sort-descending` | element |
| `NewDataBtnOnPanel` | `.btn--new-data .mstrmojo-Button-text` | button |
| `DIContainer` | `#DIContainer` | element |
| `DBRoleSkeleton` | `.dbRoles-skeleton` | element |
| `DIWaitingIcon` | `.mstrmojo-Editor.mstrWaitBox` | element |
| `EditableField` | `.editable` | element |
| `ClearFormulaEditorButton` | `.mstrmojo-Button.mstrmojo-WebHoverButton.clear` | button |
| `SaveFormulaEditorButton` | `.mstrmojo-MetricEditor .mstrmojo-Editor-buttons .me-save-button` | button |

**Actions**
| Signature |
|-----------|
| `clickDatasetsPanelMenuIcon()` |
| `clickCustomViewSortIcon(order = 'ascending')` |
| `clickNewDataBtn()` |
| `clickNewDataBtnUntilShowDataSource()` |
| `clickDataSourceByIndex(index)` |
| `prepareData(prepare)` |
| `importSampleFiles(indexes, prepare = [])` |
| `addUploadURL(url)` |
| `importDataFromURL(url)` |
| `selectDataSourceCheckboxByName(name)` |
| `clickImportButton()` |
| `clickCancelButton()` |
| `clickCreateButton()` |
| `clickSaveButton()` |
| `doubleClickAttributeMetric(name)` |
| `doubleClickAttributeMetricByName(name)` |
| `rightClickAttributeMetric(name)` |
| `rightClickAttributeMetricByName(name)` |
| `ctrlClickAttributeMetric(name)` |
| `multiSelectAttributeMetric(names)` |
| `addDatasetElementToVisualization(datasetElementName)` |
| `actionOnMenu(option)` |
| `actionOnMenuSubmenu(menuItem, submenuItem)` |
| `renameObject(objectName, replaceName)` |
| `preview(objectName)` |
| `createDMByCalculation(elementList, calculateMethod)` |
| `clickDatasetMenuIcon(name)` |
| `clickCreateObjectsBtn(datasetName)` |
| `isAttributeMetricDisplayed(name)` |
| `getSwitchToFormulaEditorButton()` |
| `clickSwitchToFormulaEditorButton()` |
| `getClearFormulaEditorButton()` |
| `clickClearFormulaEditorButton()` |
| `mockTaskProcRequest()` |
| `getSaveFormulaEditorButton()` |
| `clickSaveFormulaEditorButton()` |
| `addDataFromDatasetsPanel(addDataOption)` |
| `addObjectToVizByDoubleClick(objectName, objectTypeName, datasetName)` |
| `addAttributeToVizByDoubleClick(attributeName, datasetName)` |
| `addMetricToVizByDoubleClick(metricName, datasetName)` |
| `clickSwitchTabButton()` |
| `changePanelWidthByPixel(offsetX)` |
| `selectContextMenuOption(option)` |
| `selectContextMenuOptionWithHover(option)` |
| `selectSecondaryContextMenuOption(option)` |
| `isDatasetPresentByName(name)` |
| `isDatasetExpanded(datasetName)` |
| `collapseDataset(datasetName)` |
| `expandDataset(datasetName)` |
| `rightClickAttributeMetricAndSelectOption(name, type, option)` |

**Sub-components**
- getDatasetsPanel
- getDIContainer
- getMenuContainer
- getNewDataBtnOnPanel
- clickDatasetsPanel

---

### EditorPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `EditorPanelHeader` | `.mstrmojo-VIBoxPanelContainer .edt` | element |
| `SwitchEditorButton` | `.item.editPanel` | element |

**Actions**
| Signature |
|-----------|
| `switchToEditorPanel()` |
| `enableEditorPanel()` |
| `disableEditorPanel()` |
| `clickEditorPanel()` |
| `getDropZoneTooltip(name)` |
| `getDropZoneAttMetricTooltip(name)` |
| `isObjectVisibleOnEditorPanel(objectName, objectTypeName)` |
| `isObjectVisibleInSection(objectName, objectTypeName, sectionName)` |
| `switchToFormatPanel()` |
| `getElementByXPathText(xPath, innerText)` |
| `getNthElementsByXPath(xPath, index)` |
| `getLastElementByXPath(xPath)` |
| `getElementByXPath(xPath)` |

**Sub-components**
- getEditorPanel

---

### FormatPanel
> Extends: `BaseFormatPanel`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FormatPanelHeader` | `.mstrmojo-VIBoxPanelContainer .prp` | element |
| `FormatDetail` | `.mstrmojo-VIBoxPanel.mstrmojo-vi-PropEditor.mstrmojo-scrollbar-host` | element |
| `TextAndFormTab` | `.text-format` | element |
| `TextAndFormContent` | `#reactFormatPanel .selector-layout.content` | dropdown |
| `TitleAndContainerTab` | `.title-container` | element |
| `FontFamilyDropdown` | `.mstr-rc-font-selector` | dropdown |
| `FontSizeInput` | `.ant-input-number-input` | input |
| `ColorPicker` | `.mstr-editor-color-picker` | element |
| `PanelStackPadding` | `div.container-padding-input.element.input-with-stepper` | input |
| `RadiusTextboxValue` | `.radius-input` | input |
| `FreeFormLayoutBtn` | `.layout-icons.free-form-layout` | element |
| `AutoLayoutBtn` | `.layout-icons.auto-layout` | element |
| `SwitchFormatButton` | `.item.propertiesPanel` | element |

**Actions**
| Signature |
|-----------|
| `getMarkerFillColorPicker()` |
| `getMarkerBorderColorPicker()` |
| `getBorderColorPicker()` |
| `getButtonFillColorPicker()` |
| `getButtonBorderColorPicker()` |
| `getBorderLineDropdown()` |
| `getSwitchStyleOption(style)` |
| `getOptionalInputField()` |
| `switchToFormatPanel()` |
| `enableFormatPanel()` |
| `disableFormatPanel()` |
| `switchToVizOptionTab()` |
| `switchToTextAndFormTab()` |
| `switchToTitleAndContainerTab()` |
| `setValueForPositionX(value)` |
| `openDropdown(section)` |
| `isCheckboxItemDisabled(label)` |
| `selectFontType(fontType)` |
| `setFontStyle(index)` |
| `setFontSize(value)` |
| `setFontColor(index)` |
| `setSliderColor(index)` |
| `setDropdownBackgroundColor(index)` |
| `setSelectionColor(index)` |
| `setMarkerFillColor(index)` |
| `setMarkerBorderColor(index)` |
| `setBorderColor(index)` |
| `setButtonFillColor(index)` |
| `setButtonBorderColor(index)` |
| `setBorderLineStyle(styleLabel)` |
| `setSwitchStyle(style)` |
| `setFontHorizontalAlignment(index)` |
| `setFontVerticalAlignment(index)` |
| `setInputValue(getInputFn, value)` |
| `setPanelStackPaddingValue(value = 100)` |
| `setRadiusValue(value = 40)` |
| `setPaddingValue(value = 10)` |
| `setPositionXValue(value)` |
| `setPositionYValue(value)` |
| `setSizeWidthValue(value)` |
| `setSizeHeightValue(value)` |
| `setDICDefaultValue(value)` |
| `openTextboxFormatPanel()` |
| `openTitleContainerFormatPanel()` |
| `openVizFormatPanel()` |
| `openFormatPanel()` |
| `closeFormatPanel()` |
| `clickFreeFormLayout()` |
| `clickAutoLayout()` |
| `formatTitle()` |
| `getShadowFillColor()` |
| `getShadowInputBoxValueByName(name)` |
| `slideShadowSliderByName(name, x = 50, y = 0)` |
| `setShadowInputboxByName(name, value = 10)` |
| `clickShadowFillColorBtn()` |
| `clickPageLevelColorPicker()` |
| `openFormPanelOptionsTab()` |
| `isUseSqlButtonDisabled()` |
| `getTransactionSwitchToggle(label)` |
| `isTransactionSwitchOn(label)` |
| `clickTransactionSwitch(label, { turnOn = null } = {})` |
| `setTransactionSwitch(label, turnOn)` |
| `getTransactionActionButton(label, action = 'delete')` |
| `clickTransactionActionButton(label, action = 'delete')` |
| `deleteTransaction(label)` |
| `getResetButtonToggle()` |
| `toggleResetButton(turnOn)` |
| `isResetButtonToggleDisabled()` |
| `getResetButtonLabelInput()` |
| `setButtonLabel(value)` |
| `setAutosize(turnOn)` |
| `setButtonRadius(radius)` |
| `clickSwitchLabel(label)` |
| `isStatusLabelSectionVisible()` |

**Sub-components**
- dossierAuthoringPage
- getFormatPanel
- getTitleAndContainer
- switchToFormatPanel
- getPanel
- getPage
- getFormPanel

---

### KeyDriverFormatPanel
> Extends: `FormatPanel`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `changeIncreaseFactorColor(colorName)` |
| `changeDecreaseFactorColor(colorName)` |

**Sub-components**
- dossierAuthoringPage

---

### LinkEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectTab(tabName)` |
| `selectURLOpenInNewTabCheckbox()` |
| `closeEditorWithoutSaving()` |
| `getSelectedTabName()` |
| `isURLOpenInNewTabCheckboxChecked()` |
| `isDashboardOpenInNewTabCheckboxChecked()` |
| `isDashboardOpenInNewTabDisplayed()` |
| `clearText()` |
| `inputDisplayText(inputText)` |
| `clearURL()` |
| `inputURLText(inputText)` |
| `clickOnSaveCancel(action)` |
| `createLinkWithDefaultSettings({ linkUrl, linkName })` |

**Sub-components**
_none_

---

### FormatPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ThemePanel` | `.mstrmojo-themesPanel-content` | element |
| `ThemeInfoTooltipContainer` | `.mstr-rc-tooltip-popover` | element |

**Actions**
| Signature |
|-----------|
| `getThemeApplyButton(theme)` |
| `isThemeTooltipDisplayed()` |
| `getCurrentTheme()` |
| `isCurrentThemeCertified()` |
| `isAutoStyle(theme)` |
| `getCurrentThemeCardSize()` |
| `getCoverImageUrlByName(theme)` |
| `getTooltipContent()` |
| `searchTheme(theme)` |
| `applyTheme(theme)` |
| `toggleCertifiedThemes()` |
| `hoverOnThemeInfoIcon(theme)` |

**Sub-components**
- dossierAuthoringPage
- getThemePanel
- getCurrentThemeContainer
- getThemeInfoTooltipContainer

---

### for


**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `togglePanel(name)` |

**Sub-components**
_none_

---

### Toolbar
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Toolbar` | `.mstrmojo-RootView-toolbar` | element |
| `TogglePreviewModeButton` | `.item.togglePreviewMode` | element |
| `InsertTextButton` | `.insertText` | element |
| `ItemTextButton` | `.item.insertText.mstrmojo-ui-Menu-item` | element |
| `ItemRichTextButton` | `.item.insertRichText.mstrmojo-ui-Menu-item` | element |
| `InsertPanelStackButton` | `.insertPanelStack` | element |
| `ItemPanelStackButton` | `.item.PanelStack` | element |
| `ItemSelectorPanelButton` | `.item.SelectorPanel` | dropdown |
| `ItemFormPanelButton` | `.item.FormPanel` | element |
| `InsertInfoWindowButton` | `.insertInfoWindow` | element |
| `ItemInfoWindowButton` | `.item.InfoWindow` | element |
| `ItemFormWindowButton` | `.item.FormWindow` | element |
| `ItemSelectorWindowButton` | `.item.SelectorWindow` | dropdown |
| `ToggleManualModeButton` | `.toggleManualMode .btn` | button |
| `URLGeneratorButton` | `.item.btn.toggleGenerateURL` | button |
| `URLGeneratorDialog` | `.mstrmojo-generate-url-dialog` | element |
| `SelectValuePromptButton` | `.generate-url-dialog-value-prompt-button` | button |
| `GenerateLinkButton` | `.mstrmojo-Button.mstrmojo-InteractiveButton.generate-url-dialog-generate-button` | button |
| `LinkCopiedText` | `.mstrmojo-Label.generate-url-dialog-copied-msg` | element |
| `CloseURLGeneratorDialogButton` | `.mstrmojo-Button.generate-url-dialog-close` | button |

**Actions**
| Signature |
|-----------|
| `clickButtonFromToolbar(buttonName)` |
| `clickTogglePreviewModeButton()` |
| `clickMenuItemInMobileView(buttonName)` |
| `isButtonDisabled(buttonName)` |
| `clickURLGeneratorButton()` |
| `hoverURLGeneratorButton()` |
| `isGenerateButtonDisabled()` |
| `isSelectValuePromptButtonDisplay()` |
| `clickSelectValuePromptButton()` |
| `clickGenerateLinkButton()` |
| `generatorBarText()` |
| `clickCloseURLGeneratorDialogButton()` |
| `selectOptionFromToolbarPulldownWithoutLoading(optionName)` |
| `selectOptionFromToolbarPulldown(optionName)` |
| `createText()` |
| `createRichText()` |
| `createPanelStack()` |
| `createSelectorPanel()` |
| `createFormPanel()` |
| `createInfoWindow()` |
| `createSelectorWindow()` |
| `createFormWindow()` |
| `clickToggleManualModeBtn()` |
| `isPauseModeActive()` |
| `actionOnToolbarLoop(actionName, count)` |

**Sub-components**
- dossierAuthoringPage
- getInsertPanel
- getItemPanel
- getItemSelectorPanel
- getItemFormPanel

---

### VisualizationPanel
> Extends: `BaseVisualization`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `VizPanel` | `#rootView .mstrmojo-RootView-content` | element |
| `VIDoclayout` | `.mstrmojo-VIDocLayout` | element |
| `SelectedVizContainer` | `.mstrmojo-VIBox.selected` | dropdown |

**Actions**
| Signature |
|-----------|
| `clickTitleBar(title)` |
| `getTitleForEachVisulization()` |
| `hoverTitleBar(title)` |
| `maximizeVizByContainerElem(vizContainer)` |
| `restoreVizByFullTitle(title)` |
| `restoreVizByContainerElem(vizContainer)` |
| `checkVizByTitle(testCase, imageName, title, tolerance = 0.5)` |
| `takeScreenshotByVizTitle(testCase, imageName, title, tolerance = 0.5)` |
| `takeScreenshotBySelectedViz(testCase, imageName, tolerance = 0.5)` |
| `checkSelectedViz(testCase, imageName, tolerance = 0.5)` |
| `selectCopyToOnVisualizationMenu({ vizTitle, copyOption = 'New Page' })` |
| `selectDeleteOnVisualizationMenu(vizTitle)` |

**Sub-components**
- getDisplayedPage
- dossierPage
- getVizPanel
- getSelectedVizContainer

---

### VizGallery
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Gallery` | `.mstrmojo-galleryPanel-new` | element |

**Actions**
| Signature |
|-----------|
| `clickOnInsertVI(iconName = 'Visualization')` |
| `clickOnVizCategory(categoryName)` |
| `clickOnViz(vizName)` |
| `changeVizType(categoryName, vizName)` |
| `hoverOnViz(vizName)` |
| `checkGallery(testCase, imageName, tolerance = 0.5)` |

**Sub-components**
- dossierAuthoringPage

---

### DossierEditorUtility
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `RootViewContent` | `#rootView .mstrmojo-RootView-content` | element |
| `VIDoclayout` | `.mstrmojo-VIDocLayoutViewer` | element |
| `VIVizPanel` | `.mstrmojo-VIVizPanel-content` | element |
| `VizControlPanel` | `.mstrmojo-VizControl ` | element |
| `RootViewPathbar` | `.mstrmojo-RootView-pathbar` | element |

**Actions**
| Signature |
|-----------|
| `clickOnElementThenWaitLoadingData(element)` |
| `doubleClickOnElementThenWaitLoadingData(element)` |
| `checkVIDoclayout(testCase, imageName)` |
| `takeScreenshotByVIDoclayout(testCase, imageName, tolerance = 0.5)` |
| `checkVIVizPanel(testCase, imageName, tolerance = 0.5)` |
| `takeScreenshotByVIVizPanel(testCase, imageName, tolerance = 0.5)` |
| `checkVIBoxPanel(testCase, imageName, tolerance = 0.5)` |
| `takeScreenshotByVIBoxPanel(testCase, imageName, tolerance = 0.5)` |
| `checkVizControlPanel(testCase, imageName, tolerance = 0.5)` |
| `clickToDismissPopups()` |

**Sub-components**
- getVIVizPanel
- getVIBoxPanel
- getVizControlPanel

---

### LoadingDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `LibraryLoading` | `.mstrd-LoadingIcon-content` | element |

**Actions**
| Signature |
|-----------|
| `waitLoadingDataPopUpIsNotDisplayed()` |
| `waitPageLoadingDataPopUpIsNotDisplayed()` |
| `waitmstrWebWaitCurtainNotDisplay()` |
| `waitmstrTabDisabledNotDisplay()` |
| `waitLibraryLoadingIsNotDisplayed()` |
| `waitBooketLoaderIsNotDisplayed()` |
| `waitVisibility(waitElement)` |
| `waitForObjectBrowserContainerLoadingIsNotDisplayed()` |
| `waitForReportLoadingIsNotDisplayed()` |
| `getElementIndex(element, parent)` |

**Sub-components**
- getPage
