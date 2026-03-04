# Site Knowledge: visualization

> Components: 12

### AutoNarratives
> Extends: `BaseVisualization`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `InstructionInput` | `.mstr-chatbot-chat-input__input` | input |
| `InstructionIcon` | `.mstr-icons-single-icon.single-icon-common-info.single-icon-common-info--d846b3ed` | element |
| `InstructionInputCount` | `.mstr-rich-input-viz-editor_input-count` | input |
| `InstructionGenerateBtn` | `.mstr-rich-input-viz-editor__button` | button |
| `SuggestionPopupDialog` | `.ReactVirtualized__Grid__innerScrollContainer` | element |
| `SuggestionPopup` | `.mstr-chatbot-suggestion-popup-item-row` | element |
| `EditorPanel` | `.mstr-rich-input-viz-editor` | input |
| `StreamMode` | `.stream-mode` | element |
| `CopyBtn` | `.hover-btn.hover-nlg-copy-btn.max-present.mouse-left` | button |
| `DataCutInfoIcon` | `.data-cut-info-icon-container` | element |
| `DataCutInfoTooltip` | `.new-vis-tooltip-table` | element |
| `EmptySummary` | `.AutoNarratives` | element |
| `AutoRefreshCheckbox` | `.mstr-rich-input-viz-editor__auto-refresh-container .mstr-design-checkbox` | input |
| `AutoSummaryIcon` | `.insertPredefinedNLG` | element |
| `AutoSummaryIconConsumption` | `.auto-summary-icon` | element |
| `DisplayInConsumptionCheckbox` | `.mstr-rich-input-viz-editor__show-in-consumption-container .mstr-design-checkbox` | input |
| `AutoSummaryExpandButton` | `.mstr-auto-narr-expand-restore-btn` | button |
| `AutoSummaryCopyButton` | `.mstr-auto-narr-copy-btn` | button |
| `AutoSummaryCloseButton` | `.mstr-auto-narr-close-btn` | button |

**Actions**
| Signature |
|-----------|
| `getDataCutInfoTooltipText()` |
| `hoverOnFootnote(index = 0)` |
| `hoverOnInstructionIcon()` |
| `hoverOnAutoRefreshInfo()` |
| `hoverOnDataCutInfoIcon()` |
| `checkTooltip(testCase, imageName, tolerance = 0.5)` |
| `checkInstructionTooltip(testCase, imageName, tolerance = 0.5)` |
| `checkInstruction(testCase, imageName, tolerance = 0.5)` |
| `checkEditorPanel(testCase, imageName, tolerance = 0.5)` |
| `checkRefreshButton(testCase, imageName, tolerance = 0.5)` |
| `checkDisclaimRefreshDisplay(testCase, imageName, tolerance = 0.5)` |
| `checkPopupDialog(testCase, imageName, tolerance = 0.5)` |
| `checkDeleteVizPopupDialog(testCase, imageName, tolerance = 0.5)` |
| `checkSuggestionsPopup(testCase, imageName, tolerance = 0.5)` |
| `checkSummaryByVizIndex(testCase, imageName, index = 0, tolerance = 0.5)` |
| `checkEmptySummary(testCase, imageName, tolerance = 0.5)` |
| `clickEmptySummary()` |
| `setInstruction(instructionString)` |
| `setInstructionOnly(instructionString)` |
| `clickGenerate(index = 0)` |
| `selectCreateAutoNarrativeOnVisualizationMenu(title)` |
| `selectDuplicateOnVisualizationMenu(title)` |
| `selectCopyFormattingOnVisualizationMenu(title)` |
| `selectPasteFormattingOnVisualizationMenu(title)` |
| `selectDeleteOnVisualizationMenu(title)` |
| `getSummaryTextByVizTitle(title)` |
| `getSummaryTextByIndex(index = 0)` |
| `getTooltipText()` |
| `clickCancelButton()` |
| `clickDeleteButton()` |
| `clickButton(buttonName)` |
| `clickWrapTextCheckbox()` |
| `clickAutosizeCheckbox()` |
| `switchAlignment(type)` |
| `switchWorkflow(type)` |
| `switchCellPadding(type)` |
| `clickRefreshIcon(index = 0)` |
| `waitForNlgReady(index = 0)` |
| `clickSuggenstedItemByName(name)` |
| `clickAutoRefresh()` |
| `clickDisplayInConsumption()` |
| `clickAutoSummaryExpandButton()` |
| `clickAutoSummaryCopyButton()` |
| `clickAutoSummaryCloseButton()` |
| `isDisplayInConsumptionChecked()` |
| `isAutoSummaryExpand()` |
| `isAutoSummaryIconSelected()` |
| `validateClipboardContains(expectedString)` |
| `validateSummaryTextContains(summaryText, expectedStrings)` |
| `clickAutoSummaryIcon(isConsumption = false)` |
| `verifySummaryStyleByPos(index = 0, styles)` |
| `isAutoSummaryExistInCanvas()` |

**Sub-components**
- vizPanel
- dossierAuthoringPage
- getEditorPanel

---

### ForecastTrend
> Extends: `BaseVisualization`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Forecastlineopacity` | `.abaloc-inputnumber-forecastlineopacity` | input |
| `Confidencebandopacity` | `.abaloc-inputnumber-confidencebandopacity` | input |

**Actions**
| Signature |
|-----------|
| `checkElementByImageComparison(element, testCase, imageName)` |
| `clickTargetNameDropZone()` |
| `clickTimeAttributeDropZone()` |
| `clickBreakByDropZone()` |
| `getContextMenu()` |
| `clickMenuItemByName(name)` |
| `getSubMenu()` |
| `clickSubMenuItemByName(name)` |
| `getContextMenuEditor()` |
| `clickUndo()` |
| `clickRedo()` |
| `dismissPopups()` |
| `dismissTooltip()` |
| `clickContainerFitSection()` |
| `clickContainerFitDropDown()` |
| `clickContainerFitOption(option)` |
| `clickDataLabelSwitch()` |
| `clickDataLabelHideOverlappingLabels()` |
| `clickAxesSection()` |
| `clickGridLines()` |
| `clickGridLineOption(option)` |
| `clickAxisDirection()` |
| `clickHorizontalAxisOption()` |
| `clickVerticalAxisOption()` |
| `clickAxisTitle()` |
| `clickAxisLabel()` |
| `clickRotationDropDown()` |
| `clickRotationOption(option)` |
| `clickRotationCustomOption(option)` |
| `clickLegendSwitch()` |
| `clickShowTitle()` |
| `clickTrendLineSwitch()` |
| `clickForecastSwitch()` |
| `clickForecastLengthUp()` |
| `clickForecastLengthDown()` |
| `clickDataLabelsSwitch()` |
| `clickDataLabelsHideOL()` |
| `clickReferenceLineAdd()` |
| `clickReferenceLineEnable()` |
| `clickLineLabelSwitch()` |
| `clickBarLogicMetric()` |
| `clickBarLogicValue()` |
| `clickBarLogicType()` |
| `clickReferenceLineDelete()` |
| `setReferenceLineConstantValue(value)` |
| `clickTextAndFormDropDown()` |
| `clickEntireGraph()` |
| `clickFontStyle(option)` |
| `clickFontSizeInc()` |
| `clickFontSizeDec()` |
| `clickColorPickDropDown(abaloc)` |
| `chooseColorInColorPicker(abaloc)` |
| `clickDataLabelAndShapes()` |
| `clickShowDataLabels()` |
| `clickShowMaker()` |
| `clickTypeDropDown(abaloc)` |
| `chooseTypeInDropDown(option, notOption)` |
| `clickAxisAndGridLines()` |
| `clickInlineDropDown(abaloc)` |
| `clickInlineDropDownItem(abaloc, option)` |
| `clickSwitch(abaloc)` |
| `clickForecast()` |
| `clickTrendLine()` |
| `inputNumberUp(abaloc)` |
| `inputNumberDown(abaloc)` |
| `clickDropDown(abaloc)` |
| `clickDropDownItem(option)` |
| `clickAndgetVizMenu(name)` |
| `clickVizMenuItemByName(name)` |
| `clickVizMenuSubItemByName(name)` |
| `getShowDataDialog()` |
| `closeShowDataDialog()` |
| `clickAlertYes()` |

**Sub-components**
- vizPanel
- dossierAuthoringPage
- dossierPage
- editorPanel
- formatPanel

---

### Graph
> Extends: `BaseVisualization`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| _none_ |

**Sub-components**
- getContainer

---

### GraphMatrix
> Extends: `BaseVisualization`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `BoxPlotContainer` | `.boxlayer` | element |

**Actions**
| Signature |
|-----------|
| `getBoxPlotFillColor(index = 0)` |

**Sub-components**
_none_

---

### Grid
> Extends: `BaseVisualization`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `NewVizTooltipContainer` | `.new-vis-tooltip` | element |

**Actions**
| Signature |
|-----------|
| `getHeaderText(title, agGrid = false)` |
| `getHeaderCount(title, agGrid = false)` |
| `getHeaderByName({ title, headerName, agGrid = false })` |
| `getElementByValue({ title, headerName, elementName, agGrid = false })` |
| `getVizDossierLinkingTooltip()` |
| `getExpandIconOfElement({ title, headerName, elementName })` |
| `getCollapseIconOfElement({ title, headerName, elementName })` |
| `getGridElementLink({ title, headerName, elementName, agGrid = false })` |
| `getRowByCell(title, cellText)` |
| `waitForIncrementalFetchLoading(title)` |
| `openGridElmContextMenu({ title, headerName, elementName, agGrid = false })` |
| `selectGridContextMenuOption({ title, headerName, elementName, firstOption, secondOption, thirdOption, agGrid = false }, prompted = false)` |
| `selectGridContextMenu({ title, headerName, elementName, firstOption, secondOption, thirdOption, agGrid = false }, prompted = false)` |
| `selectGridElement({ title, headerName, elementName, agGrid = false })` |
| `selectElement({ title, headerName, elementName, agGrid = false })` |
| `clickGridElementLink({ title, headerName, elementName, agGrid = false })` |
| `getOneRowData(title, row, agGrid = false)` |
| `getOneColumnData(title, headerName, agGrid = false)` |
| `getOneColumnDataWithColSpan(title, headerName, agGrid = false)` |
| `multiSelectGridElements({ title, headerName, elementName1, elementName2 })` |
| `expandBranch({ title, headerName, elementName })` |
| `incrementalFetch(title)` |
| `scrollGridToBottom(title)` |
| `selectShowTotalsOption(totalOption)` |
| `applyShowTotalsSelection()` |
| `getCellValue(title, row, col, agGrid = false)` |
| `firstElmOfHeader({ title, headerName, agGrid = false })` |
| `getThresholdImageAlt(index)` |
| `getAllThresholdImageAlt(title)` |
| `getThresholdImageURL(index)` |
| `isGridElmHighlighted({ title, headerName, elementName })` |
| `getGridElmBackgroundColor({ title, headerName, elementName })` |
| `linkToTargetByGridContextMenu({ title, headerName, elementName }, prompted = false)` |
| `linkToDossier({ title, headerName, elementName }, prompted = false)` |
| `linkToTargetByGridContextMenuForRA({ title, headerName, elementName, secondOption }, prompted = false)` |
| `linkToTargetByGridToolTip()` |
| `hoverOnGridElement({ title, headerName, elementName })` |
| `hoverOnGridElementNoWait({ title, headerName, elementName })` |
| `getGridMode(title)` |
| `waitForGridLoaded(title, agGrid = false)` |
| `isTableExist(title)` |
| `isGridAltTagNotEmpty(index)` |
| `isGridElmAppliedThreshold({ title, headerName, elementName })` |

**Sub-components**
- getContainer
- getNewVizTooltipContainer
- dossierPage

---

### ImageContainer
> Extends: `BaseVisualization`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ImageTooltipContainer` | `.mstrmojo-Tooltip-content.mstrmojo-scrollNode` | element |
| `ConfirmImageUrlButton` | `.ant-btn.ant-btn-primary.mstr-button.mstr-button__primary-type.mstr-button__regular-size` | button |

**Actions**
| Signature |
|-----------|
| `getCurrentPageImageNode(index)` |
| `getImageNodeByKey(key)` |
| `getImageBoxByIndex(index)` |
| `navigateLink(index)` |
| `navigateLinkByKey(key)` |
| `navigateLinkInCurrentPage(index)` |
| `hoverOnImage(index)` |
| `hoverOnImageByKey(key)` |
| `imageTooltip()` |
| `openImageLinkEditor(index)` |
| `clickImageinAuthoring(index)` |
| `changeAltText(Text)` |
| `changeImageURL(Text)` |
| `confirmImageURL()` |
| `altText()` |
| `allAltTexts()` |
| `isImageErrorIconDisplayed(index)` |
| `isAltTextNotEmpty()` |
| `isAltTagNotEmpty(index)` |
| `isAllAltMatched(expectedAltList, altTexts)` |

**Sub-components**
- dossierPage
- getCurrentPage
- getImageTooltipContainer
- openLinkEditorOnContainer

---

### KeyDriver
> Extends: `BaseVisualization`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `hoverOnBar(index = 0)` |
| `hoverOnIncreaseBar(index = 0)` |
| `hoverOnDecreaseBar(index = 0)` |
| `clickBar(index = 0)` |

**Sub-components**
- vizPanel

---

### LineChart
> Extends: `BaseVisualization`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ConstantBox` | `.me-content` | element |

**Actions**
| Signature |
|-----------|
| `getElemByLine({ vizName, lineName, index })` |
| `getlegendColor({ vizName, lineName })` |
| `getLineIndex({ vizName, lineName })` |
| `composeElementName(textNode)` |
| `elemIndexInYAxis({ vizName, eleName })` |
| `elemIndexInXAxis({ vizName, eleName })` |
| `selectChartContextMenuOption({ vizName, firstOption, secondOption, thirdOption })` |
| `enabletrendline(vizName)` |
| `showMajorandMinorGridLines(vizName)` |
| `showMajorLinesOnly(vizName)` |
| `hideLines(vizName)` |
| `selectAutomaticGridLinesOption(vizName)` |
| `addMaximumReferenceLine(vizName)` |
| `addMinimumReferenceLine(vizName)` |
| `addAverageReferenceLine(vizName)` |
| `addMedianReferenceLine(vizName)` |
| `addFirstReferenceLine(vizName)` |
| `addLastReferenceLine(vizName)` |
| `addConstantReferenceLine({ vizName, value })` |
| `selectYAxisContextMenuOption({ vizName, firstOption, secondOption, thirdOption })` |
| `selectXAxisContextMenuOption({ vizName, firstOption, secondOption, thirdOption })` |
| `clickOnYAxis(vizName)` |
| `clickElemInYAxis({ vizName, eleName })` |
| `replaceWith({ name, elemName })` |
| `selectAxisContextMenuOption({ name, firstOption, secondOption })` |
| `clickElement({ vizName, eleName, lineName })` |
| `selectElementContextMenuOption({ vizName, eleName, lineName, firstOption, secondOption, thirdOption })` |
| `selectElementContextMenuOptionOnSingleLine({ vizName, eleName, firstOption, secondOption, thirdOption })` |
| `keepOnly({ vizName, eleName, lineName })` |
| `exclude({ vizName, eleName, lineName })` |
| `showOnlyValueLabels({ vizName, eleName, lineName })` |
| `hideLabels({ vizName, eleName, lineName })` |
| `drill({ vizName, eleName, lineName, drillOption })` |
| `dataLabel({ vizName, index })` |
| `expandLegend(vizName)` |
| `collapseLegend(vizName)` |
| `hideLegend(vizName)` |
| `showLegend(vizName)` |
| `hoverOnElementByXAxis({ vizName, eleName, lineName })` |
| `isTrendLineDisplayed(vizName)` |
| `isMinorLineDisplayed(vizName)` |
| `isMajorLineDisplayed(vizName)` |
| `isReferenceValueDisplayed({ vizName, value })` |
| `isAttributeOrMetricName(name)` |
| `isElementPresent({ vizName, eleName })` |
| `isLegendMinimized(vizName)` |
| `isLegendPresent(vizName)` |
| `legendCount(vizName)` |
| `legendData({ vizName, index })` |

**Sub-components**
- getContainer
- dossierPage
- getVizTooltipContainer

---

### PieChart
> Extends: `BaseVisualization`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getIndexByName(title, slice)` |
| `sliceLabel({ title, index })` |
| `hoverOnSlice({ title, slice })` |
| `keepOnly({ title, slice })` |
| `exclude({ title, slice })` |
| `drillTo({ title, slice, drillTarget, singleSelection })` |
| `openPieChartElmContextMenu({ title, slice })` |
| `linkToTargetByPiechartContextMenu({ title, slice })` |
| `setDataLabels({ title, index, option })` |
| `expandLegend(title)` |
| `collapseLegend(title)` |
| `hideLegend(title)` |
| `showLegend(title)` |
| `sliceCount(title)` |
| `legendCount(title)` |
| `legendData({ title, index })` |
| `isLegendMinimized(title)` |
| `isLegendPresent(title)` |
| `isSlicePresent({ title, label })` |
| `isDataLabelDisplayed({ title, label })` |

**Sub-components**
- getContainer
- getVizTooltipContainer

---

### Textbox
> Extends: `BaseVisualization`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Tooltip` | `.mstrmojo-Tooltip-contentWrapper` | element |

**Actions**
| Signature |
|-----------|
| `getTextNodeInCurrentPage(index)` |
| `InputValuetoTextNodeByKey(key, text)` |
| `hoverTextNodeByKey(key)` |
| `clickTextContextMenuOptionByKey(key, option)` |
| `isPopUpLinkDisplayedEditMode(text)` |
| `isTooltipDisplayedForTextNodeByKey(key)` |
| `navigateLink(index)` |
| `navigateLinkByText(text)` |
| `navigateLinkByKey(key)` |
| `openTextLinkEditor(text)` |
| `navigateLinkEditMode(index)` |
| `navigateLinkEditModeByKey(key)` |
| `tooltip(index)` |
| `textContent(index)` |
| `isTextContentDisplayed(index)` |
| `textBackgoundColor(index)` |
| `textFormat(index, styleProp)` |
| `pasteToTextbox(index)` |

**Sub-components**
- dossierPage
- getTextNodeInCurrentPage
- openLinkEditorOnContainer

---

### Threshold
> Extends: `BaseVisualization`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SimpleThresholdEditor` | `.mstrmojo-Editor.mstrmojo-SimpleThresholdEditor.modal` | element |
| `AdvThresholdEditor` | `.mstrmojo-Editor.adv-threshold.modal` | element |
| `ImageBasedIcon` | `.item.image` | element |
| `SaveThresholdWarning` | `.mstrmojo-Editor.save-threshold-warning.mstrmojo-warning.mstrmojo-alert.modal` | element |

**Actions**
| Signature |
|-----------|
| `chooseImageBased()` |
| `switchAdvThreshold()` |
| `confirmThreshold()` |
| `confirmSwitchToAdvThreshold()` |
| `openAdvThresholdDetail(index)` |
| `changeAltText(Text)` |
| `changeImageURL(Text)` |
| `confirmAdvThresholdDetail()` |
| `previewImageAlt(index)` |
| `previewImageURL(index)` |
| `altText()` |
| `isPreviewImageAltTagNotEmpty(index)` |

**Sub-components**
- dossierPage

---

### Waterfall
> Extends: `BaseVisualization`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickOnYAxisLabel(vizName)` |
| `selectYAxisContextMenuOption({ vizName, firstOption, secondOption, thirdOption })` |

**Sub-components**
- getContainer
