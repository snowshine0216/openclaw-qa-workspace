# Site Knowledge: Dossier Editor Domain

## Overview

- **Domain key:** `dossierEditor`
- **Components covered:** AutoDashboard, ContentsPanel, ContextualLinkEditor, DatasetDialog, DatasetsPanel, DossierEditorUtility, EditorPanel, for, FormatPanel, FormatPanel, KeyDriverFormatPanel, LinkEditor, LoadingDialog, Toolbar, VisualizationPanel, VizGallery
- **Spec files scanned:** 0
- **POM files scanned:** 16

## Components

### AutoDashboard
- **CSS root:** `.mstrd-ChatPanelContainer-welcome`
- **User-visible elements:**
  - AIDiag Close Icon (`.mstr-ai-chatbot-DiagnosticsCloseIcon`)
  - AIDiag Download Icon (`.mstr-ai-chatbot-DiagnosticsTab-btns`)
  - Ai Welcome Image (`.mstrd-ChatPanelContainer-welcome`)
  - Ai Welcome Popup (`.ai-assistant-tooltip`)
  - Auto Dash2 Beauty Mode Button (`.mstrd-AutoDashTitlebar-beautyModeButton`)
  - Auto Dash2 Beauty Modes Dialog (`.mstrd-ChatPanelAutoDashStyleModes`)
  - Auto Dash2 Error Content (`.mstr-ai-chatbot-ChatPanel-error-container`)
  - Auto Dash2 Input Box (`.mstr-chatbot-chat-input-inline__textarea`)
  - Auto Dash2 Send Icon (`.mstr-chatbot-chat-input-inline__send-btn`)
  - Auto Dash2 Toggle Btn (`.item.chatPanel`)
  - Auto Dash2waitbox (`.mstr-autodash-v2-wait`)
  - Auto Dashboard (`#rootView .mstrmojo-RootView-vizControl .mstrmojo-VizControl`)
  - Clear Btn (`.icon-mstrd_ai_clear`)
  - Input Box (`.mstr-chatbot-chat-input__textarea`)
  - Last Summary Text (`.mstrmojo-Label.mstrWaitMsg`)
  - Send Icon (`.mstr-chatbot-chat-input__send-btn`)
- **Component actions:**
  - `addLastVizToPage()`
  - `autoPageCreationByChat(pagePrompt)`
  - `checkVizInAutoDashboard(index, testCase, imageName, tolerance = 0.5)`
  - `clearHistory()`
  - `clearHistoryVizCreationByChat(pagePrompt)`
  - `clickChatPanelAnalysesByName(name)`
  - `clickCreateAPageSuggetion()`
  - `clickDontShowPopupCheckboxInput()`
  - `clickLockPageSizeApplyNowButton()`
  - `clickPageCreationRecommendations()`
  - `clickRecommendationByIndex(index)`
  - `clickShowErrorDetails()`
  - `clickShowErrorDetails2()`
  - `clickVizCreationRecommendationByIndex(index)`
  - `closeAIDiag()`
  - `closeAutoDashboard()`
  - `closeEditWithoutSaving()`
  - `createDossierFromSAASLibrary()`
  - `downloadAIDiag()`
  - `getAddToPageButton()`
  - `getAutoDash2LatestAnswerText()`
  - `getLastSummaryText()`
  - `getPageRecommendationByIndex(index)`
  - `getQuota()`
  - `getRemoteQuota()`
  - `getShowErrorMessage2()`
  - `isUploadImageBtnDisplayed()`
  - `openAutoDashboard(isDatasetAdded = false)`
  - `openLatestAIDiag()`
  - `processAILogFromBotStream(botstream)`
  - `saveDossierAndCloseEditMode()`
  - `sendPrompt(text)`
  - `sendPromptInAutoDash2(text)`
  - `sendPromptInAutoDash2NoWaitManipulation(Prompt)`
  - `showDetailsIfError()`
  - `showErrorDetailsAndFail()`
  - `storeQuota()`
  - `switchAutoDash2BeautificationMode(newModeName)`
  - `toggleAutoDashboard2()`
  - `uploadAutoDashImage(imageName)`
  - `vizCreationByChat(pagePrompt)`
  - `waitAutoDash2Process()`
  - `waitForSuggestionReady()`
- **Related components:** dossierAuthoringPage, getAddToPage, getChatPanel, getPage, libraryAuthoringPage

### ContentsPanel
- **CSS root:** `.mstrmojo-ui-Menu-item-container`
- **User-visible elements:**
  - Contents Panel (`#rootView .mstrmojo-RootView-toc`)
  - Contents Panel Settings Menu (`.mstrmojo-ui-Menu-item-container`)
  - Horizontal TOCChapter Selector (`.mstrmojo-VIDocument-top-selector`)
  - Horizontal TOCPage Selector (`.mstrmojo-VIVizPanel-top-selector`)
  - Switch Contents Button (`.mstrmojo-RootView-datasets .mstrmojo-switchTabBtn`)
- **Component actions:**
  - `clickContentsPanelMenuOption(optionName)`
  - `clickHorizontalTOCAddChapterButton()`
  - `clickHorizontalTOCAddPageButton()`
  - `clickHorizontalTOCMenuButton()`
  - `clickOptionAfterOpenMenu(optionName)`
  - `clickOptionOnChapterMenu(chapterName, optionName)`
  - `getChapterCount()`
  - `getCurrentPageName()`
  - `getPage({ chapterName, pageName })`
  - `getPagesCount()`
  - `goToPage({ chapterName, pageName })`
  - `goToPageAndRefreshNLG({ chapterName, pageName })`
  - `goToPageWithNLG({ chapterName, pageName })`
  - `openContentsPanelSettings()`
  - `rightClickPage({ chapterName, pageName })`
  - `switchContentsTab()`
  - `switchPageFromContents({ chapterName, pageName })`
  - `validatePageSummaryText(pageDetails, expectedStrings)`
- **Related components:** dossierAuthoringPage, editorPanel, getContentsPanel, getHorizontalTOCAddPage, getHorizontalTOCPage, getPage, goToPage

### ContextualLinkEditor
- **CSS root:** `.mstrmojo-Editor.mstrmojo-vi-ObjectPicker.modal`
- **User-visible elements:**
  - Select Object Panel (`.mstrmojo-Editor.mstrmojo-vi-ObjectPicker.modal`)
- **Component actions:**
  - `cancelEditor()`
  - `cancelSelectObjectPanel()`
  - `choosePrompt(name)`
  - `clickOpenFolderButton()`
  - `getAnswerPromptOptionsText()`
  - `getSelectedTabName()`
  - `isProjectSlectorDisabled()`
  - `isPromptSectionVisible()`
  - `openAnswerPromptPullDown()`
- **Related components:** getSelectObjectPanel

### DatasetDialog
- **CSS root:** `.mstrmojo-ui-Menu-item-container`
- **User-visible elements:**
  - Confirmation Edit Dataset Dialog (`.mstrmojo-warning-ConfirmEditDataset`)
  - Notification Warning (`.mstrmojo-warning.mstrmojo-alert.modal`)
  - Parameter Type Container (`.mstrmojo-ui-Menu-item-container`)
  - Update Dataset Alert Dialog (`.mstrmojo-Editor.mstrmojo-alert.modal`)
- **Component actions:**
  - `checkKeepChangesLocalCheckbox()`
  - `clickCancelBtn()`
  - `clickConfirmationEditDatasetDialogBtn(text)`
  - `clickCreateParameterBtn(type)`
  - `clickNotificationWarningBtn(text)`
  - `clickUpdateDatasetBtn()`
  - `editObject(objectName)`
  - `hoverOnCancelBtn()`
  - `isKeepChangesLocalCheckboxChecked()`
  - `isKeepChangesLocalContainerPresent()`
  - `removeObjectFromList(objectName)`
- **Related components:** getKeepChangesLocalContainer, getParameterTypeContainer

### DatasetsPanel
- **CSS root:** `#DIContainer`
- **User-visible elements:**
  - Clear Formula Editor Button (`.mstrmojo-Button.mstrmojo-WebHoverButton.clear`)
  - Datasets Panel (`.mstrmojo-VIDatasetObjects`)
  - DBRole Skeleton (`.dbRoles-skeleton`)
  - DIContainer (`#DIContainer`)
  - DIWaiting Icon (`.mstrmojo-Editor.mstrWaitBox`)
  - Editable Field (`.editable`)
  - New Data Btn On Panel (`.btn--new-data .mstrmojo-Button-text`)
  - Save Formula Editor Button (`.mstrmojo-MetricEditor .mstrmojo-Editor-buttons .me-save-button`)
- **Component actions:**
  - `actionOnMenu(option)`
  - `actionOnMenuSubmenu(menuItem, submenuItem)`
  - `addAttributeToVizByDoubleClick(attributeName, datasetName)`
  - `addDataFromDatasetsPanel(addDataOption)`
  - `addDatasetElementToVisualization(datasetElementName)`
  - `addMetricToVizByDoubleClick(metricName, datasetName)`
  - `addObjectToVizByDoubleClick(objectName, objectTypeName, datasetName)`
  - `addUploadURL(url)`
  - `changePanelWidthByPixel(offsetX)`
  - `clickCancelButton()`
  - `clickClearFormulaEditorButton()`
  - `clickCreateButton()`
  - `clickCreateObjectsBtn(datasetName)`
  - `clickDatasetMenuIcon(name)`
  - `clickDatasetsPanelMenuIcon()`
  - `clickDataSourceByIndex(index)`
  - `clickImportButton()`
  - `clickNewDataBtn()`
  - `clickNewDataBtnUntilShowDataSource()`
  - `clickSaveButton()`
  - `clickSaveFormulaEditorButton()`
  - `clickSwitchTabButton()`
  - `clickSwitchToFormulaEditorButton()`
  - `collapseDataset(datasetName)`
  - `createDMByCalculation(elementList, calculateMethod)`
  - `ctrlClickAttributeMetric(name)`
  - `doubleClickAttributeMetric(name)`
  - `doubleClickAttributeMetricByName(name)`
  - `expandDataset(datasetName)`
  - `getClearFormulaEditorButton()`
  - `getSaveFormulaEditorButton()`
  - `getSwitchToFormulaEditorButton()`
  - `importDataFromURL(url)`
  - `importSampleFiles(indexes, prepare = [])`
  - `isAttributeMetricDisplayed(name)`
  - `isDatasetExpanded(datasetName)`
  - `isDatasetPresentByName(name)`
  - `mockTaskProcRequest()`
  - `multiSelectAttributeMetric(names)`
  - `prepareData(prepare)`
  - `preview(objectName)`
  - `renameObject(objectName, replaceName)`
  - `rightClickAttributeMetric(name)`
  - `rightClickAttributeMetricAndSelectOption(name, type, option)`
  - `rightClickAttributeMetricByName(name)`
  - `selectContextMenuOption(option)`
  - `selectContextMenuOptionWithHover(option)`
  - `selectDataSourceCheckboxByName(name)`
  - `selectSecondaryContextMenuOption(option)`
- **Related components:** clickDatasetsPanel, getDatasetsPanel, getDIContainer, getMenuContainer, getNewDataBtnOnPanel

### DossierEditorUtility
- **CSS root:** `.mstrmojo-VIVizPanel-content`
- **User-visible elements:**
  - Root View Content (`#rootView .mstrmojo-RootView-content`)
  - Root View Pathbar (`.mstrmojo-RootView-pathbar`)
  - VIDoclayout (`.mstrmojo-VIDocLayoutViewer`)
  - VIViz Panel (`.mstrmojo-VIVizPanel-content`)
  - Viz Control Panel (`.mstrmojo-VizControl `)
- **Component actions:**
  - `checkVIBoxPanel(testCase, imageName, tolerance = 0.5)`
  - `checkVIDoclayout(testCase, imageName)`
  - `checkVIVizPanel(testCase, imageName, tolerance = 0.5)`
  - `checkVizControlPanel(testCase, imageName, tolerance = 0.5)`
  - `clickOnElementThenWaitLoadingData(element)`
  - `clickToDismissPopups()`
  - `doubleClickOnElementThenWaitLoadingData(element)`
  - `takeScreenshotByVIBoxPanel(testCase, imageName, tolerance = 0.5)`
  - `takeScreenshotByVIDoclayout(testCase, imageName, tolerance = 0.5)`
  - `takeScreenshotByVIVizPanel(testCase, imageName, tolerance = 0.5)`
- **Related components:** getVIBoxPanel, getVIVizPanel, getVizControlPanel

### EditorPanel
- **CSS root:** `.mstrmojo-VIBoxPanelContainer .edt`
- **User-visible elements:**
  - Editor Panel Header (`.mstrmojo-VIBoxPanelContainer .edt`)
  - Switch Editor Button (`.item.editPanel`)
- **Component actions:**
  - `clickEditorPanel()`
  - `disableEditorPanel()`
  - `enableEditorPanel()`
  - `getDropZoneAttMetricTooltip(name)`
  - `getDropZoneTooltip(name)`
  - `getElementByXPath(xPath)`
  - `getElementByXPathText(xPath, innerText)`
  - `getLastElementByXPath(xPath)`
  - `getNthElementsByXPath(xPath, index)`
  - `isObjectVisibleInSection(objectName, objectTypeName, sectionName)`
  - `isObjectVisibleOnEditorPanel(objectName, objectTypeName)`
  - `switchToEditorPanel()`
  - `switchToFormatPanel()`
- **Related components:** getEditorPanel

### for
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `togglePanel(name)`
- **Related components:** _none_

### FormatPanel
- **CSS root:** `.mstrmojo-VIBoxPanelContainer .prp`
- **User-visible elements:**
  - Auto Layout Btn (`.layout-icons.auto-layout`)
  - Color Picker (`.mstr-editor-color-picker`)
  - Font Family Dropdown (`.mstr-rc-font-selector`)
  - Font Size Input (`.ant-input-number-input`)
  - Format Detail (`.mstrmojo-VIBoxPanel.mstrmojo-vi-PropEditor.mstrmojo-scrollbar-host`)
  - Format Panel Header (`.mstrmojo-VIBoxPanelContainer .prp`)
  - Free Form Layout Btn (`.layout-icons.free-form-layout`)
  - Panel Stack Padding (`div.container-padding-input.element.input-with-stepper`)
  - Radius Textbox Value (`.radius-input`)
  - Switch Format Button (`.item.propertiesPanel`)
  - Text And Form Content (`#reactFormatPanel .selector-layout.content`)
  - Text And Form Tab (`.text-format`)
  - Title And Container Tab (`.title-container`)
- **Component actions:**
  - `clickAutoLayout()`
  - `clickFreeFormLayout()`
  - `clickPageLevelColorPicker()`
  - `clickShadowFillColorBtn()`
  - `closeFormatPanel()`
  - `disableFormatPanel()`
  - `enableFormatPanel()`
  - `formatTitle()`
  - `getShadowFillColor()`
  - `getShadowInputBoxValueByName(name)`
  - `isCheckboxItemDisabled(label)`
  - `openDropdown(section)`
  - `openFormatPanel()`
  - `openTitleContainerFormatPanel()`
  - `openVizFormatPanel()`
  - `selectFontType(fontType)`
  - `setFontColor(index)`
  - `setFontHorizontalAlignment(index)`
  - `setFontSize(value)`
  - `setFontStyle(index)`
  - `setFontVerticalAlignment(index)`
  - `setInputValue(getInputFn, value)`
  - `setPaddingValue(value = 10)`
  - `setPanelStackPaddingValue(value = 100)`
  - `setPositionXValue(value)`
  - `setPositionYValue(value)`
  - `setRadiusValue(value = 40)`
  - `setShadowInputboxByName(name, value = 10)`
  - `setSizeHeightValue(value)`
  - `setSizeWidthValue(value)`
  - `setValueForPositionX(value)`
  - `slideShadowSliderByName(name, x = 50, y = 0)`
  - `switchToFormatPanel()`
  - `switchToTextAndFormTab()`
  - `switchToTitleAndContainerTab()`
  - `switchToVizOptionTab()`
- **Related components:** dossierAuthoringPage, getFormatPanel, getPage, getPanel, getTitleAndContainer, switchToFormatPanel

### FormatPanel
- **CSS root:** `.mstr-rc-tooltip-popover`
- **User-visible elements:**
  - Theme Info Tooltip Container (`.mstr-rc-tooltip-popover`)
  - Theme Panel (`.mstrmojo-themesPanel-content`)
- **Component actions:**
  - `applyTheme(theme)`
  - `getCoverImageUrlByName(theme)`
  - `getCurrentTheme()`
  - `getCurrentThemeCardSize()`
  - `getThemeApplyButton(theme)`
  - `getTooltipContent()`
  - `hoverOnThemeInfoIcon(theme)`
  - `isAutoStyle(theme)`
  - `isCurrentThemeCertified()`
  - `isThemeTooltipDisplayed()`
  - `searchTheme(theme)`
  - `toggleCertifiedThemes()`
- **Related components:** dossierAuthoringPage, getCurrentThemeContainer, getThemeInfoTooltipContainer, getThemePanel

### KeyDriverFormatPanel
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `changeDecreaseFactorColor(colorName)`
  - `changeIncreaseFactorColor(colorName)`
- **Related components:** dossierAuthoringPage

### LinkEditor
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clearText()`
  - `clearURL()`
  - `clickOnSaveCancel(action)`
  - `closeEditorWithoutSaving()`
  - `createLinkWithDefaultSettings({ linkUrl, linkName })`
  - `getSelectedTabName()`
  - `inputDisplayText(inputText)`
  - `inputURLText(inputText)`
  - `isDashboardOpenInNewTabCheckboxChecked()`
  - `isDashboardOpenInNewTabDisplayed()`
  - `isURLOpenInNewTabCheckboxChecked()`
  - `selectTab(tabName)`
  - `selectURLOpenInNewTabCheckbox()`
- **Related components:** _none_

### LoadingDialog
- **CSS root:** `.mstrd-LoadingIcon-content`
- **User-visible elements:**
  - Library Loading (`.mstrd-LoadingIcon-content`)
- **Component actions:**
  - `getElementIndex(element, parent)`
  - `waitBooketLoaderIsNotDisplayed()`
  - `waitForObjectBrowserContainerLoadingIsNotDisplayed()`
  - `waitForReportLoadingIsNotDisplayed()`
  - `waitLibraryLoadingIsNotDisplayed()`
  - `waitLoadingDataPopUpIsNotDisplayed()`
  - `waitmstrTabDisabledNotDisplay()`
  - `waitmstrWebWaitCurtainNotDisplay()`
  - `waitPageLoadingDataPopUpIsNotDisplayed()`
  - `waitVisibility(waitElement)`
- **Related components:** getPage

### Toolbar
- **CSS root:** `.insertPanelStack`
- **User-visible elements:**
  - Close URLGenerator Dialog Button (`.mstrmojo-Button.generate-url-dialog-close`)
  - Generate Link Button (`.mstrmojo-Button.mstrmojo-InteractiveButton.generate-url-dialog-generate-button`)
  - Insert Info Window Button (`.insertInfoWindow`)
  - Insert Panel Stack Button (`.insertPanelStack`)
  - Item Info Window Button (`.item.InfoWindow`)
  - Item Panel Stack Button (`.item.PanelStack`)
  - Item Selector Panel Button (`.item.SelectorPanel`)
  - Item Selector Window Button (`.item.SelectorWindow`)
  - Link Copied Text (`.mstrmojo-Label.generate-url-dialog-copied-msg`)
  - Select Value Prompt Button (`.generate-url-dialog-value-prompt-button`)
  - Toggle Manual Mode Button (`.toggleManualMode .btn`)
  - Toolbar (`.mstrmojo-RootView-toolbar`)
  - URLGenerator Button (`.item.btn.toggleGenerateURL`)
  - URLGenerator Dialog (`.mstrmojo-generate-url-dialog`)
- **Component actions:**
  - `actionOnToolbarLoop(actionName, count)`
  - `clickButtonFromToolbar(buttonName)`
  - `clickCloseURLGeneratorDialogButton()`
  - `clickGenerateLinkButton()`
  - `clickMenuItemInMobileView(buttonName)`
  - `clickSelectValuePromptButton()`
  - `clickToggleManualModeBtn()`
  - `clickURLGeneratorButton()`
  - `createInfoWindow()`
  - `createPanelStack()`
  - `createSelectorPanel()`
  - `createSelectorWindow()`
  - `generatorBarText()`
  - `hoverURLGeneratorButton()`
  - `isButtonDisabled(buttonName)`
  - `isGenerateButtonDisabled()`
  - `isPauseModeActive()`
  - `isSelectValuePromptButtonDisplay()`
  - `selectOptionFromToolbarPulldown(optionName)`
  - `selectOptionFromToolbarPulldownWithoutLoading(optionName)`
- **Related components:** dossierAuthoringPage, getInsertPanel, getItemPanel, getItemSelectorPanel

### VisualizationPanel
- **CSS root:** `.mstrmojo-VIBox.selected`
- **User-visible elements:**
  - Selected Viz Container (`.mstrmojo-VIBox.selected`)
  - VIDoclayout (`.mstrmojo-VIDocLayout`)
  - Viz Panel (`#rootView .mstrmojo-RootView-content`)
- **Component actions:**
  - `checkSelectedViz(testCase, imageName, tolerance = 0.5)`
  - `checkVizByTitle(testCase, imageName, title, tolerance = 0.5)`
  - `clickTitleBar(title)`
  - `getTitleForEachVisulization()`
  - `hoverTitleBar(title)`
  - `maximizeVizByContainerElem(vizContainer)`
  - `restoreVizByContainerElem(vizContainer)`
  - `restoreVizByFullTitle(title)`
  - `selectCopyToOnVisualizationMenu({ vizTitle, copyOption = 'New Page' })`
  - `selectDeleteOnVisualizationMenu(vizTitle)`
  - `takeScreenshotBySelectedViz(testCase, imageName, tolerance = 0.5)`
  - `takeScreenshotByVizTitle(testCase, imageName, title, tolerance = 0.5)`
- **Related components:** dossierPage, getDisplayedPage, getSelectedVizContainer, getVizPanel

### VizGallery
- **CSS root:** `.mstrmojo-galleryPanel-new`
- **User-visible elements:**
  - Gallery (`.mstrmojo-galleryPanel-new`)
- **Component actions:**
  - `changeVizType(categoryName, vizName)`
  - `checkGallery(testCase, imageName, tolerance = 0.5)`
  - `clickOnInsertVI(iconName = 'Visualization')`
  - `clickOnViz(vizName)`
  - `clickOnVizCategory(categoryName)`
  - `hoverOnViz(vizName)`
- **Related components:** dossierAuthoringPage

## Common Workflows (from spec.ts)

1. _none_

## Common Elements (from POM + spec.ts)

1. VIDoclayout -- frequency: 2
2. Ai Welcome Image -- frequency: 1
3. Ai Welcome Popup -- frequency: 1
4. AIDiag Close Icon -- frequency: 1
5. AIDiag Download Icon -- frequency: 1
6. Auto Dash2 Beauty Mode Button -- frequency: 1
7. Auto Dash2 Beauty Modes Dialog -- frequency: 1
8. Auto Dash2 Error Content -- frequency: 1
9. Auto Dash2 Input Box -- frequency: 1
10. Auto Dash2 Send Icon -- frequency: 1
11. Auto Dash2 Toggle Btn -- frequency: 1
12. Auto Dash2waitbox -- frequency: 1
13. Auto Dashboard -- frequency: 1
14. Auto Layout Btn -- frequency: 1
15. Clear Btn -- frequency: 1
16. Clear Formula Editor Button -- frequency: 1
17. Close URLGenerator Dialog Button -- frequency: 1
18. Color Picker -- frequency: 1
19. Confirmation Edit Dataset Dialog -- frequency: 1
20. Contents Panel -- frequency: 1
21. Contents Panel Settings Menu -- frequency: 1
22. Datasets Panel -- frequency: 1
23. DBRole Skeleton -- frequency: 1
24. DIContainer -- frequency: 1
25. DIWaiting Icon -- frequency: 1
26. Editable Field -- frequency: 1
27. Editor Panel Header -- frequency: 1
28. Font Family Dropdown -- frequency: 1
29. Font Size Input -- frequency: 1
30. Format Detail -- frequency: 1
31. Format Panel Header -- frequency: 1
32. Free Form Layout Btn -- frequency: 1
33. Gallery -- frequency: 1
34. Generate Link Button -- frequency: 1
35. Horizontal TOCChapter Selector -- frequency: 1
36. Horizontal TOCPage Selector -- frequency: 1
37. Input Box -- frequency: 1
38. Insert Info Window Button -- frequency: 1
39. Insert Panel Stack Button -- frequency: 1
40. Item Info Window Button -- frequency: 1
41. Item Panel Stack Button -- frequency: 1
42. Item Selector Panel Button -- frequency: 1
43. Item Selector Window Button -- frequency: 1
44. Last Summary Text -- frequency: 1
45. Library Loading -- frequency: 1
46. Link Copied Text -- frequency: 1
47. New Data Btn On Panel -- frequency: 1
48. Notification Warning -- frequency: 1
49. Panel Stack Padding -- frequency: 1
50. Parameter Type Container -- frequency: 1
51. Radius Textbox Value -- frequency: 1
52. Root View Content -- frequency: 1
53. Root View Pathbar -- frequency: 1
54. Save Formula Editor Button -- frequency: 1
55. Select Object Panel -- frequency: 1
56. Select Value Prompt Button -- frequency: 1
57. Selected Viz Container -- frequency: 1
58. Send Icon -- frequency: 1
59. Switch Contents Button -- frequency: 1
60. Switch Editor Button -- frequency: 1
61. Switch Format Button -- frequency: 1
62. Text And Form Content -- frequency: 1
63. Text And Form Tab -- frequency: 1
64. Theme Info Tooltip Container -- frequency: 1
65. Theme Panel -- frequency: 1
66. Title And Container Tab -- frequency: 1
67. Toggle Manual Mode Button -- frequency: 1
68. Toolbar -- frequency: 1
69. Update Dataset Alert Dialog -- frequency: 1
70. URLGenerator Button -- frequency: 1
71. URLGenerator Dialog -- frequency: 1
72. VIViz Panel -- frequency: 1
73. Viz Control Panel -- frequency: 1
74. Viz Panel -- frequency: 1

## Key Actions

- `actionOnMenu(option)` -- used in 0 specs
- `actionOnMenuSubmenu(menuItem, submenuItem)` -- used in 0 specs
- `actionOnToolbarLoop(actionName, count)` -- used in 0 specs
- `addAttributeToVizByDoubleClick(attributeName, datasetName)` -- used in 0 specs
- `addDataFromDatasetsPanel(addDataOption)` -- used in 0 specs
- `addDatasetElementToVisualization(datasetElementName)` -- used in 0 specs
- `addLastVizToPage()` -- used in 0 specs
- `addMetricToVizByDoubleClick(metricName, datasetName)` -- used in 0 specs
- `addObjectToVizByDoubleClick(objectName, objectTypeName, datasetName)` -- used in 0 specs
- `addUploadURL(url)` -- used in 0 specs
- `applyTheme(theme)` -- used in 0 specs
- `autoPageCreationByChat(pagePrompt)` -- used in 0 specs
- `cancelEditor()` -- used in 0 specs
- `cancelSelectObjectPanel()` -- used in 0 specs
- `changeDecreaseFactorColor(colorName)` -- used in 0 specs
- `changeIncreaseFactorColor(colorName)` -- used in 0 specs
- `changePanelWidthByPixel(offsetX)` -- used in 0 specs
- `changeVizType(categoryName, vizName)` -- used in 0 specs
- `checkGallery(testCase, imageName, tolerance = 0.5)` -- used in 0 specs
- `checkKeepChangesLocalCheckbox()` -- used in 0 specs
- `checkSelectedViz(testCase, imageName, tolerance = 0.5)` -- used in 0 specs
- `checkVIBoxPanel(testCase, imageName, tolerance = 0.5)` -- used in 0 specs
- `checkVIDoclayout(testCase, imageName)` -- used in 0 specs
- `checkVIVizPanel(testCase, imageName, tolerance = 0.5)` -- used in 0 specs
- `checkVizByTitle(testCase, imageName, title, tolerance = 0.5)` -- used in 0 specs
- `checkVizControlPanel(testCase, imageName, tolerance = 0.5)` -- used in 0 specs
- `checkVizInAutoDashboard(index, testCase, imageName, tolerance = 0.5)` -- used in 0 specs
- `choosePrompt(name)` -- used in 0 specs
- `clearHistory()` -- used in 0 specs
- `clearHistoryVizCreationByChat(pagePrompt)` -- used in 0 specs
- `clearText()` -- used in 0 specs
- `clearURL()` -- used in 0 specs
- `clickAutoLayout()` -- used in 0 specs
- `clickButtonFromToolbar(buttonName)` -- used in 0 specs
- `clickCancelBtn()` -- used in 0 specs
- `clickCancelButton()` -- used in 0 specs
- `clickChatPanelAnalysesByName(name)` -- used in 0 specs
- `clickClearFormulaEditorButton()` -- used in 0 specs
- `clickCloseURLGeneratorDialogButton()` -- used in 0 specs
- `clickConfirmationEditDatasetDialogBtn(text)` -- used in 0 specs
- `clickContentsPanelMenuOption(optionName)` -- used in 0 specs
- `clickCreateAPageSuggetion()` -- used in 0 specs
- `clickCreateButton()` -- used in 0 specs
- `clickCreateObjectsBtn(datasetName)` -- used in 0 specs
- `clickCreateParameterBtn(type)` -- used in 0 specs
- `clickDatasetMenuIcon(name)` -- used in 0 specs
- `clickDatasetsPanelMenuIcon()` -- used in 0 specs
- `clickDataSourceByIndex(index)` -- used in 0 specs
- `clickDontShowPopupCheckboxInput()` -- used in 0 specs
- `clickEditorPanel()` -- used in 0 specs
- `clickFreeFormLayout()` -- used in 0 specs
- `clickGenerateLinkButton()` -- used in 0 specs
- `clickHorizontalTOCAddChapterButton()` -- used in 0 specs
- `clickHorizontalTOCAddPageButton()` -- used in 0 specs
- `clickHorizontalTOCMenuButton()` -- used in 0 specs
- `clickImportButton()` -- used in 0 specs
- `clickLockPageSizeApplyNowButton()` -- used in 0 specs
- `clickMenuItemInMobileView(buttonName)` -- used in 0 specs
- `clickNewDataBtn()` -- used in 0 specs
- `clickNewDataBtnUntilShowDataSource()` -- used in 0 specs
- `clickNotificationWarningBtn(text)` -- used in 0 specs
- `clickOnElementThenWaitLoadingData(element)` -- used in 0 specs
- `clickOnInsertVI(iconName = 'Visualization')` -- used in 0 specs
- `clickOnSaveCancel(action)` -- used in 0 specs
- `clickOnViz(vizName)` -- used in 0 specs
- `clickOnVizCategory(categoryName)` -- used in 0 specs
- `clickOpenFolderButton()` -- used in 0 specs
- `clickOptionAfterOpenMenu(optionName)` -- used in 0 specs
- `clickOptionOnChapterMenu(chapterName, optionName)` -- used in 0 specs
- `clickPageCreationRecommendations()` -- used in 0 specs
- `clickPageLevelColorPicker()` -- used in 0 specs
- `clickRecommendationByIndex(index)` -- used in 0 specs
- `clickSaveButton()` -- used in 0 specs
- `clickSaveFormulaEditorButton()` -- used in 0 specs
- `clickSelectValuePromptButton()` -- used in 0 specs
- `clickShadowFillColorBtn()` -- used in 0 specs
- `clickShowErrorDetails()` -- used in 0 specs
- `clickShowErrorDetails2()` -- used in 0 specs
- `clickSwitchTabButton()` -- used in 0 specs
- `clickSwitchToFormulaEditorButton()` -- used in 0 specs
- `clickTitleBar(title)` -- used in 0 specs
- `clickToDismissPopups()` -- used in 0 specs
- `clickToggleManualModeBtn()` -- used in 0 specs
- `clickUpdateDatasetBtn()` -- used in 0 specs
- `clickURLGeneratorButton()` -- used in 0 specs
- `clickVizCreationRecommendationByIndex(index)` -- used in 0 specs
- `closeAIDiag()` -- used in 0 specs
- `closeAutoDashboard()` -- used in 0 specs
- `closeEditorWithoutSaving()` -- used in 0 specs
- `closeEditWithoutSaving()` -- used in 0 specs
- `closeFormatPanel()` -- used in 0 specs
- `collapseDataset(datasetName)` -- used in 0 specs
- `createDMByCalculation(elementList, calculateMethod)` -- used in 0 specs
- `createDossierFromSAASLibrary()` -- used in 0 specs
- `createInfoWindow()` -- used in 0 specs
- `createLinkWithDefaultSettings({ linkUrl, linkName })` -- used in 0 specs
- `createPanelStack()` -- used in 0 specs
- `createSelectorPanel()` -- used in 0 specs
- `createSelectorWindow()` -- used in 0 specs
- `ctrlClickAttributeMetric(name)` -- used in 0 specs
- `disableEditorPanel()` -- used in 0 specs
- `disableFormatPanel()` -- used in 0 specs
- `doubleClickAttributeMetric(name)` -- used in 0 specs
- `doubleClickAttributeMetricByName(name)` -- used in 0 specs
- `doubleClickOnElementThenWaitLoadingData(element)` -- used in 0 specs
- `downloadAIDiag()` -- used in 0 specs
- `editObject(objectName)` -- used in 0 specs
- `enableEditorPanel()` -- used in 0 specs
- `enableFormatPanel()` -- used in 0 specs
- `expandDataset(datasetName)` -- used in 0 specs
- `formatTitle()` -- used in 0 specs
- `generatorBarText()` -- used in 0 specs
- `getAddToPageButton()` -- used in 0 specs
- `getAnswerPromptOptionsText()` -- used in 0 specs
- `getAutoDash2LatestAnswerText()` -- used in 0 specs
- `getChapterCount()` -- used in 0 specs
- `getClearFormulaEditorButton()` -- used in 0 specs
- `getCoverImageUrlByName(theme)` -- used in 0 specs
- `getCurrentPageName()` -- used in 0 specs
- `getCurrentTheme()` -- used in 0 specs
- `getCurrentThemeCardSize()` -- used in 0 specs
- `getDropZoneAttMetricTooltip(name)` -- used in 0 specs
- `getDropZoneTooltip(name)` -- used in 0 specs
- `getElementByXPath(xPath)` -- used in 0 specs
- `getElementByXPathText(xPath, innerText)` -- used in 0 specs
- `getElementIndex(element, parent)` -- used in 0 specs
- `getLastElementByXPath(xPath)` -- used in 0 specs
- `getLastSummaryText()` -- used in 0 specs
- `getNthElementsByXPath(xPath, index)` -- used in 0 specs
- `getPage({ chapterName, pageName })` -- used in 0 specs
- `getPageRecommendationByIndex(index)` -- used in 0 specs
- `getPagesCount()` -- used in 0 specs
- `getQuota()` -- used in 0 specs
- `getRemoteQuota()` -- used in 0 specs
- `getSaveFormulaEditorButton()` -- used in 0 specs
- `getSelectedTabName()` -- used in 0 specs
- `getShadowFillColor()` -- used in 0 specs
- `getShadowInputBoxValueByName(name)` -- used in 0 specs
- `getShowErrorMessage2()` -- used in 0 specs
- `getSwitchToFormulaEditorButton()` -- used in 0 specs
- `getThemeApplyButton(theme)` -- used in 0 specs
- `getTitleForEachVisulization()` -- used in 0 specs
- `getTooltipContent()` -- used in 0 specs
- `goToPage({ chapterName, pageName })` -- used in 0 specs
- `goToPageAndRefreshNLG({ chapterName, pageName })` -- used in 0 specs
- `goToPageWithNLG({ chapterName, pageName })` -- used in 0 specs
- `hoverOnCancelBtn()` -- used in 0 specs
- `hoverOnThemeInfoIcon(theme)` -- used in 0 specs
- `hoverOnViz(vizName)` -- used in 0 specs
- `hoverTitleBar(title)` -- used in 0 specs
- `hoverURLGeneratorButton()` -- used in 0 specs
- `importDataFromURL(url)` -- used in 0 specs
- `importSampleFiles(indexes, prepare = [])` -- used in 0 specs
- `inputDisplayText(inputText)` -- used in 0 specs
- `inputURLText(inputText)` -- used in 0 specs
- `isAttributeMetricDisplayed(name)` -- used in 0 specs
- `isAutoStyle(theme)` -- used in 0 specs
- `isButtonDisabled(buttonName)` -- used in 0 specs
- `isCheckboxItemDisabled(label)` -- used in 0 specs
- `isCurrentThemeCertified()` -- used in 0 specs
- `isDashboardOpenInNewTabCheckboxChecked()` -- used in 0 specs
- `isDashboardOpenInNewTabDisplayed()` -- used in 0 specs
- `isDatasetExpanded(datasetName)` -- used in 0 specs
- `isDatasetPresentByName(name)` -- used in 0 specs
- `isGenerateButtonDisabled()` -- used in 0 specs
- `isKeepChangesLocalCheckboxChecked()` -- used in 0 specs
- `isKeepChangesLocalContainerPresent()` -- used in 0 specs
- `isObjectVisibleInSection(objectName, objectTypeName, sectionName)` -- used in 0 specs
- `isObjectVisibleOnEditorPanel(objectName, objectTypeName)` -- used in 0 specs
- `isPauseModeActive()` -- used in 0 specs
- `isProjectSlectorDisabled()` -- used in 0 specs
- `isPromptSectionVisible()` -- used in 0 specs
- `isSelectValuePromptButtonDisplay()` -- used in 0 specs
- `isThemeTooltipDisplayed()` -- used in 0 specs
- `isUploadImageBtnDisplayed()` -- used in 0 specs
- `isURLOpenInNewTabCheckboxChecked()` -- used in 0 specs
- `maximizeVizByContainerElem(vizContainer)` -- used in 0 specs
- `mockTaskProcRequest()` -- used in 0 specs
- `multiSelectAttributeMetric(names)` -- used in 0 specs
- `openAnswerPromptPullDown()` -- used in 0 specs
- `openAutoDashboard(isDatasetAdded = false)` -- used in 0 specs
- `openContentsPanelSettings()` -- used in 0 specs
- `openDropdown(section)` -- used in 0 specs
- `openFormatPanel()` -- used in 0 specs
- `openLatestAIDiag()` -- used in 0 specs
- `openTitleContainerFormatPanel()` -- used in 0 specs
- `openVizFormatPanel()` -- used in 0 specs
- `prepareData(prepare)` -- used in 0 specs
- `preview(objectName)` -- used in 0 specs
- `processAILogFromBotStream(botstream)` -- used in 0 specs
- `removeObjectFromList(objectName)` -- used in 0 specs
- `renameObject(objectName, replaceName)` -- used in 0 specs
- `restoreVizByContainerElem(vizContainer)` -- used in 0 specs
- `restoreVizByFullTitle(title)` -- used in 0 specs
- `rightClickAttributeMetric(name)` -- used in 0 specs
- `rightClickAttributeMetricAndSelectOption(name, type, option)` -- used in 0 specs
- `rightClickAttributeMetricByName(name)` -- used in 0 specs
- `rightClickPage({ chapterName, pageName })` -- used in 0 specs
- `saveDossierAndCloseEditMode()` -- used in 0 specs
- `searchTheme(theme)` -- used in 0 specs
- `selectContextMenuOption(option)` -- used in 0 specs
- `selectContextMenuOptionWithHover(option)` -- used in 0 specs
- `selectCopyToOnVisualizationMenu({ vizTitle, copyOption = 'New Page' })` -- used in 0 specs
- `selectDataSourceCheckboxByName(name)` -- used in 0 specs
- `selectDeleteOnVisualizationMenu(vizTitle)` -- used in 0 specs
- `selectFontType(fontType)` -- used in 0 specs
- `selectOptionFromToolbarPulldown(optionName)` -- used in 0 specs
- `selectOptionFromToolbarPulldownWithoutLoading(optionName)` -- used in 0 specs
- `selectSecondaryContextMenuOption(option)` -- used in 0 specs
- `selectTab(tabName)` -- used in 0 specs
- `selectURLOpenInNewTabCheckbox()` -- used in 0 specs
- `sendPrompt(text)` -- used in 0 specs
- `sendPromptInAutoDash2(text)` -- used in 0 specs
- `sendPromptInAutoDash2NoWaitManipulation(Prompt)` -- used in 0 specs
- `setFontColor(index)` -- used in 0 specs
- `setFontHorizontalAlignment(index)` -- used in 0 specs
- `setFontSize(value)` -- used in 0 specs
- `setFontStyle(index)` -- used in 0 specs
- `setFontVerticalAlignment(index)` -- used in 0 specs
- `setInputValue(getInputFn, value)` -- used in 0 specs
- `setPaddingValue(value = 10)` -- used in 0 specs
- `setPanelStackPaddingValue(value = 100)` -- used in 0 specs
- `setPositionXValue(value)` -- used in 0 specs
- `setPositionYValue(value)` -- used in 0 specs
- `setRadiusValue(value = 40)` -- used in 0 specs
- `setShadowInputboxByName(name, value = 10)` -- used in 0 specs
- `setSizeHeightValue(value)` -- used in 0 specs
- `setSizeWidthValue(value)` -- used in 0 specs
- `setValueForPositionX(value)` -- used in 0 specs
- `showDetailsIfError()` -- used in 0 specs
- `showErrorDetailsAndFail()` -- used in 0 specs
- `slideShadowSliderByName(name, x = 50, y = 0)` -- used in 0 specs
- `storeQuota()` -- used in 0 specs
- `switchAutoDash2BeautificationMode(newModeName)` -- used in 0 specs
- `switchContentsTab()` -- used in 0 specs
- `switchPageFromContents({ chapterName, pageName })` -- used in 0 specs
- `switchToEditorPanel()` -- used in 0 specs
- `switchToFormatPanel()` -- used in 0 specs
- `switchToTextAndFormTab()` -- used in 0 specs
- `switchToTitleAndContainerTab()` -- used in 0 specs
- `switchToVizOptionTab()` -- used in 0 specs
- `takeScreenshotBySelectedViz(testCase, imageName, tolerance = 0.5)` -- used in 0 specs
- `takeScreenshotByVIBoxPanel(testCase, imageName, tolerance = 0.5)` -- used in 0 specs
- `takeScreenshotByVIDoclayout(testCase, imageName, tolerance = 0.5)` -- used in 0 specs
- `takeScreenshotByVIVizPanel(testCase, imageName, tolerance = 0.5)` -- used in 0 specs
- `takeScreenshotByVizTitle(testCase, imageName, title, tolerance = 0.5)` -- used in 0 specs
- `toggleAutoDashboard2()` -- used in 0 specs
- `toggleCertifiedThemes()` -- used in 0 specs
- `togglePanel(name)` -- used in 0 specs
- `uploadAutoDashImage(imageName)` -- used in 0 specs
- `validatePageSummaryText(pageDetails, expectedStrings)` -- used in 0 specs
- `vizCreationByChat(pagePrompt)` -- used in 0 specs
- `waitAutoDash2Process()` -- used in 0 specs
- `waitBooketLoaderIsNotDisplayed()` -- used in 0 specs
- `waitForObjectBrowserContainerLoadingIsNotDisplayed()` -- used in 0 specs
- `waitForReportLoadingIsNotDisplayed()` -- used in 0 specs
- `waitForSuggestionReady()` -- used in 0 specs
- `waitLibraryLoadingIsNotDisplayed()` -- used in 0 specs
- `waitLoadingDataPopUpIsNotDisplayed()` -- used in 0 specs
- `waitmstrTabDisabledNotDisplay()` -- used in 0 specs
- `waitmstrWebWaitCurtainNotDisplay()` -- used in 0 specs
- `waitPageLoadingDataPopUpIsNotDisplayed()` -- used in 0 specs
- `waitVisibility(waitElement)` -- used in 0 specs

## Source Coverage

- `pageObjects/dossierEditor/**/*.js`
