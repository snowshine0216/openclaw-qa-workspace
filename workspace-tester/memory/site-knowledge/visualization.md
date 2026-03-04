# Site Knowledge: Visualization Domain

## Overview

- **Domain key:** `visualization`
- **Components covered:** AutoNarratives, ForecastTrend, Graph, GraphMatrix, Grid, ImageContainer, KeyDriver, LineChart, PieChart, Textbox, Threshold, Waterfall
- **Spec files scanned:** 76
- **POM files scanned:** 12

## Components

### AutoNarratives
- **CSS root:** `.mstr-rich-input-viz-editor__auto-refresh-container .mstr-design-checkbox`
- **User-visible elements:**
  - Auto Refresh Checkbox (`.mstr-rich-input-viz-editor__auto-refresh-container .mstr-design-checkbox`)
  - Auto Summary Close Button (`.mstr-auto-narr-close-btn`)
  - Auto Summary Copy Button (`.mstr-auto-narr-copy-btn`)
  - Auto Summary Expand Button (`.mstr-auto-narr-expand-restore-btn`)
  - Auto Summary Icon (`.insertPredefinedNLG`)
  - Auto Summary Icon Consumption (`.auto-summary-icon`)
  - Copy Btn (`.hover-btn.hover-nlg-copy-btn.max-present.mouse-left`)
  - Data Cut Info Icon (`.data-cut-info-icon-container`)
  - Data Cut Info Tooltip (`.new-vis-tooltip-table`)
  - Display In Consumption Checkbox (`.mstr-rich-input-viz-editor__show-in-consumption-container .mstr-design-checkbox`)
  - Editor Panel (`.mstr-rich-input-viz-editor`)
  - Empty Summary (`.AutoNarratives`)
  - Instruction Generate Btn (`.mstr-rich-input-viz-editor__button`)
  - Instruction Icon (`.mstr-icons-single-icon.single-icon-common-info.single-icon-common-info--d846b3ed`)
  - Instruction Input (`.mstr-chatbot-chat-input__input`)
  - Instruction Input Count (`.mstr-rich-input-viz-editor_input-count`)
  - Stream Mode (`.stream-mode`)
  - Suggestion Popup (`.mstr-chatbot-suggestion-popup-item-row`)
  - Suggestion Popup Dialog (`.ReactVirtualized__Grid__innerScrollContainer`)
- **Component actions:**
  - `checkDeleteVizPopupDialog(testCase, imageName, tolerance = 0.5)`
  - `checkDisclaimRefreshDisplay(testCase, imageName, tolerance = 0.5)`
  - `checkEditorPanel(testCase, imageName, tolerance = 0.5)`
  - `checkEmptySummary(testCase, imageName, tolerance = 0.5)`
  - `checkInstruction(testCase, imageName, tolerance = 0.5)`
  - `checkInstructionTooltip(testCase, imageName, tolerance = 0.5)`
  - `checkPopupDialog(testCase, imageName, tolerance = 0.5)`
  - `checkRefreshButton(testCase, imageName, tolerance = 0.5)`
  - `checkSuggestionsPopup(testCase, imageName, tolerance = 0.5)`
  - `checkSummaryByVizIndex(testCase, imageName, index = 0, tolerance = 0.5)`
  - `checkTooltip(testCase, imageName, tolerance = 0.5)`
  - `clickAutoRefresh()`
  - `clickAutosizeCheckbox()`
  - `clickAutoSummaryCloseButton()`
  - `clickAutoSummaryCopyButton()`
  - `clickAutoSummaryExpandButton()`
  - `clickAutoSummaryIcon(isConsumption = false)`
  - `clickButton(buttonName)`
  - `clickCancelButton()`
  - `clickDeleteButton()`
  - `clickDisplayInConsumption()`
  - `clickEmptySummary()`
  - `clickGenerate(index = 0)`
  - `clickRefreshIcon(index = 0)`
  - `clickSuggenstedItemByName(name)`
  - `clickWrapTextCheckbox()`
  - `getDataCutInfoTooltipText()`
  - `getSummaryTextByIndex(index = 0)`
  - `getSummaryTextByVizTitle(title)`
  - `getTooltipText()`
  - `hoverOnAutoRefreshInfo()`
  - `hoverOnDataCutInfoIcon()`
  - `hoverOnFootnote(index = 0)`
  - `hoverOnInstructionIcon()`
  - `isAutoSummaryExistInCanvas()`
  - `isAutoSummaryExpand()`
  - `isAutoSummaryIconSelected()`
  - `isDisplayInConsumptionChecked()`
  - `selectCopyFormattingOnVisualizationMenu(title)`
  - `selectCreateAutoNarrativeOnVisualizationMenu(title)`
  - `selectDeleteOnVisualizationMenu(title)`
  - `selectDuplicateOnVisualizationMenu(title)`
  - `selectPasteFormattingOnVisualizationMenu(title)`
  - `setInstruction(instructionString)`
  - `setInstructionOnly(instructionString)`
  - `switchAlignment(type)`
  - `switchCellPadding(type)`
  - `switchWorkflow(type)`
  - `validateClipboardContains(expectedString)`
  - `validateSummaryTextContains(summaryText, expectedStrings)`
  - `verifySummaryStyleByPos(index = 0, styles)`
  - `waitForNlgReady(index = 0)`
- **Related components:** dossierAuthoringPage, getEditorPanel, vizPanel

### ForecastTrend
- **CSS root:** `.abaloc-inputnumber-confidencebandopacity`
- **User-visible elements:**
  - Confidencebandopacity (`.abaloc-inputnumber-confidencebandopacity`)
  - Forecastlineopacity (`.abaloc-inputnumber-forecastlineopacity`)
- **Component actions:**
  - `checkElementByImageComparison(element, testCase, imageName)`
  - `chooseColorInColorPicker(abaloc)`
  - `chooseTypeInDropDown(option, notOption)`
  - `clickAlertYes()`
  - `clickAndgetVizMenu(name)`
  - `clickAxesSection()`
  - `clickAxisAndGridLines()`
  - `clickAxisDirection()`
  - `clickAxisLabel()`
  - `clickAxisTitle()`
  - `clickBarLogicMetric()`
  - `clickBarLogicType()`
  - `clickBarLogicValue()`
  - `clickBreakByDropZone()`
  - `clickColorPickDropDown(abaloc)`
  - `clickContainerFitDropDown()`
  - `clickContainerFitOption(option)`
  - `clickContainerFitSection()`
  - `clickDataLabelAndShapes()`
  - `clickDataLabelHideOverlappingLabels()`
  - `clickDataLabelsHideOL()`
  - `clickDataLabelsSwitch()`
  - `clickDataLabelSwitch()`
  - `clickDropDown(abaloc)`
  - `clickDropDownItem(option)`
  - `clickEntireGraph()`
  - `clickFontSizeDec()`
  - `clickFontSizeInc()`
  - `clickFontStyle(option)`
  - `clickForecast()`
  - `clickForecastLengthDown()`
  - `clickForecastLengthUp()`
  - `clickForecastSwitch()`
  - `clickGridLineOption(option)`
  - `clickGridLines()`
  - `clickHorizontalAxisOption()`
  - `clickInlineDropDown(abaloc)`
  - `clickInlineDropDownItem(abaloc, option)`
  - `clickLegendSwitch()`
  - `clickLineLabelSwitch()`
  - `clickMenuItemByName(name)`
  - `clickRedo()`
  - `clickReferenceLineAdd()`
  - `clickReferenceLineDelete()`
  - `clickReferenceLineEnable()`
  - `clickRotationCustomOption(option)`
  - `clickRotationDropDown()`
  - `clickRotationOption(option)`
  - `clickShowDataLabels()`
  - `clickShowMaker()`
  - `clickShowTitle()`
  - `clickSubMenuItemByName(name)`
  - `clickSwitch(abaloc)`
  - `clickTargetNameDropZone()`
  - `clickTextAndFormDropDown()`
  - `clickTimeAttributeDropZone()`
  - `clickTrendLine()`
  - `clickTrendLineSwitch()`
  - `clickTypeDropDown(abaloc)`
  - `clickUndo()`
  - `clickVerticalAxisOption()`
  - `clickVizMenuItemByName(name)`
  - `clickVizMenuSubItemByName(name)`
  - `closeShowDataDialog()`
  - `dismissPopups()`
  - `dismissTooltip()`
  - `getContextMenu()`
  - `getContextMenuEditor()`
  - `getShowDataDialog()`
  - `getSubMenu()`
  - `inputNumberDown(abaloc)`
  - `inputNumberUp(abaloc)`
  - `setReferenceLineConstantValue(value)`
- **Related components:** dossierAuthoringPage, dossierPage, editorPanel, formatPanel, vizPanel

### Graph
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - _none_
- **Related components:** getContainer

### GraphMatrix
- **CSS root:** `.boxlayer`
- **User-visible elements:**
  - Box Plot Container (`.boxlayer`)
- **Component actions:**
  - `getBoxPlotFillColor(index = 0)`
- **Related components:** _none_

### Grid
- **CSS root:** `.new-vis-tooltip`
- **User-visible elements:**
  - New Viz Tooltip Container (`.new-vis-tooltip`)
- **Component actions:**
  - `applyShowTotalsSelection()`
  - `clickGridElementLink({ title, headerName, elementName, agGrid = false })`
  - `expandBranch({ title, headerName, elementName })`
  - `firstElmOfHeader({ title, headerName, agGrid = false })`
  - `getAllThresholdImageAlt(title)`
  - `getCellValue(title, row, col, agGrid = false)`
  - `getCollapseIconOfElement({ title, headerName, elementName })`
  - `getElementByValue({ title, headerName, elementName, agGrid = false })`
  - `getExpandIconOfElement({ title, headerName, elementName })`
  - `getGridElementLink({ title, headerName, elementName, agGrid = false })`
  - `getGridElmBackgroundColor({ title, headerName, elementName })`
  - `getGridMode(title)`
  - `getHeaderByName({ title, headerName, agGrid = false })`
  - `getHeaderCount(title, agGrid = false)`
  - `getHeaderText(title, agGrid = false)`
  - `getOneColumnData(title, headerName, agGrid = false)`
  - `getOneColumnDataWithColSpan(title, headerName, agGrid = false)`
  - `getOneRowData(title, row, agGrid = false)`
  - `getRowByCell(title, cellText)`
  - `getThresholdImageAlt(index)`
  - `getThresholdImageURL(index)`
  - `getVizDossierLinkingTooltip()`
  - `hoverOnGridElement({ title, headerName, elementName })`
  - `hoverOnGridElementNoWait({ title, headerName, elementName })`
  - `incrementalFetch(title)`
  - `isGridAltTagNotEmpty(index)`
  - `isGridElmAppliedThreshold({ title, headerName, elementName })`
  - `isGridElmHighlighted({ title, headerName, elementName })`
  - `isTableExist(title)`
  - `linkToDossier({ title, headerName, elementName }, prompted = false)`
  - `linkToTargetByGridContextMenu({ title, headerName, elementName }, prompted = false)`
  - `linkToTargetByGridContextMenuForRA({ title, headerName, elementName, secondOption }, prompted = false)`
  - `linkToTargetByGridToolTip()`
  - `multiSelectGridElements({ title, headerName, elementName1, elementName2 })`
  - `openGridElmContextMenu({ title, headerName, elementName, agGrid = false })`
  - `scrollGridToBottom(title)`
  - `selectElement({ title, headerName, elementName, agGrid = false })`
  - `selectGridContextMenu({ title, headerName, elementName, firstOption, secondOption, thirdOption, agGrid = false }, prompted = false)`
  - `selectGridContextMenuOption({ title, headerName, elementName, firstOption, secondOption, thirdOption, agGrid = false }, prompted = false)`
  - `selectGridElement({ title, headerName, elementName, agGrid = false })`
  - `selectShowTotalsOption(totalOption)`
  - `waitForGridLoaded(title, agGrid = false)`
  - `waitForIncrementalFetchLoading(title)`
- **Related components:** dossierPage, getContainer, getNewVizTooltipContainer

### ImageContainer
- **CSS root:** `.mstrmojo-Tooltip-content.mstrmojo-scrollNode`
- **User-visible elements:**
  - Confirm Image Url Button (`.ant-btn.ant-btn-primary.mstr-button.mstr-button__primary-type.mstr-button__regular-size`)
  - Image Tooltip Container (`.mstrmojo-Tooltip-content.mstrmojo-scrollNode`)
- **Component actions:**
  - `allAltTexts()`
  - `altText()`
  - `changeAltText(Text)`
  - `changeImageURL(Text)`
  - `clickImageinAuthoring(index)`
  - `confirmImageURL()`
  - `getCurrentPageImageNode(index)`
  - `getImageBoxByIndex(index)`
  - `getImageNodeByKey(key)`
  - `hoverOnImage(index)`
  - `hoverOnImageByKey(key)`
  - `imageTooltip()`
  - `isAllAltMatched(expectedAltList, altTexts)`
  - `isAltTagNotEmpty(index)`
  - `isAltTextNotEmpty()`
  - `isImageErrorIconDisplayed(index)`
  - `navigateLink(index)`
  - `navigateLinkByKey(key)`
  - `navigateLinkInCurrentPage(index)`
  - `openImageLinkEditor(index)`
- **Related components:** dossierPage, getCurrentPage, getImageTooltipContainer, openLinkEditorOnContainer

### KeyDriver
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickBar(index = 0)`
  - `hoverOnBar(index = 0)`
  - `hoverOnDecreaseBar(index = 0)`
  - `hoverOnIncreaseBar(index = 0)`
- **Related components:** vizPanel

### LineChart
- **CSS root:** `.me-content`
- **User-visible elements:**
  - Constant Box (`.me-content`)
- **Component actions:**
  - `addAverageReferenceLine(vizName)`
  - `addConstantReferenceLine({ vizName, value })`
  - `addFirstReferenceLine(vizName)`
  - `addLastReferenceLine(vizName)`
  - `addMaximumReferenceLine(vizName)`
  - `addMedianReferenceLine(vizName)`
  - `addMinimumReferenceLine(vizName)`
  - `clickElement({ vizName, eleName, lineName })`
  - `clickElemInYAxis({ vizName, eleName })`
  - `clickOnYAxis(vizName)`
  - `collapseLegend(vizName)`
  - `composeElementName(textNode)`
  - `dataLabel({ vizName, index })`
  - `drill({ vizName, eleName, lineName, drillOption })`
  - `elemIndexInXAxis({ vizName, eleName })`
  - `elemIndexInYAxis({ vizName, eleName })`
  - `enabletrendline(vizName)`
  - `exclude({ vizName, eleName, lineName })`
  - `expandLegend(vizName)`
  - `getElemByLine({ vizName, lineName, index })`
  - `getlegendColor({ vizName, lineName })`
  - `getLineIndex({ vizName, lineName })`
  - `hideLabels({ vizName, eleName, lineName })`
  - `hideLegend(vizName)`
  - `hideLines(vizName)`
  - `hoverOnElementByXAxis({ vizName, eleName, lineName })`
  - `isAttributeOrMetricName(name)`
  - `isElementPresent({ vizName, eleName })`
  - `isLegendMinimized(vizName)`
  - `isLegendPresent(vizName)`
  - `isMajorLineDisplayed(vizName)`
  - `isMinorLineDisplayed(vizName)`
  - `isReferenceValueDisplayed({ vizName, value })`
  - `isTrendLineDisplayed(vizName)`
  - `keepOnly({ vizName, eleName, lineName })`
  - `legendCount(vizName)`
  - `legendData({ vizName, index })`
  - `replaceWith({ name, elemName })`
  - `selectAutomaticGridLinesOption(vizName)`
  - `selectAxisContextMenuOption({ name, firstOption, secondOption })`
  - `selectChartContextMenuOption({ vizName, firstOption, secondOption, thirdOption })`
  - `selectElementContextMenuOption({ vizName, eleName, lineName, firstOption, secondOption, thirdOption })`
  - `selectElementContextMenuOptionOnSingleLine({ vizName, eleName, firstOption, secondOption, thirdOption })`
  - `selectXAxisContextMenuOption({ vizName, firstOption, secondOption, thirdOption })`
  - `selectYAxisContextMenuOption({ vizName, firstOption, secondOption, thirdOption })`
  - `showLegend(vizName)`
  - `showMajorandMinorGridLines(vizName)`
  - `showMajorLinesOnly(vizName)`
  - `showOnlyValueLabels({ vizName, eleName, lineName })`
- **Related components:** dossierPage, getContainer, getVizTooltipContainer

### PieChart
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `collapseLegend(title)`
  - `drillTo({ title, slice, drillTarget, singleSelection })`
  - `exclude({ title, slice })`
  - `expandLegend(title)`
  - `getIndexByName(title, slice)`
  - `hideLegend(title)`
  - `hoverOnSlice({ title, slice })`
  - `isDataLabelDisplayed({ title, label })`
  - `isLegendMinimized(title)`
  - `isLegendPresent(title)`
  - `isSlicePresent({ title, label })`
  - `keepOnly({ title, slice })`
  - `legendCount(title)`
  - `legendData({ title, index })`
  - `linkToTargetByPiechartContextMenu({ title, slice })`
  - `openPieChartElmContextMenu({ title, slice })`
  - `setDataLabels({ title, index, option })`
  - `showLegend(title)`
  - `sliceCount(title)`
  - `sliceLabel({ title, index })`
- **Related components:** getContainer, getVizTooltipContainer

### Textbox
- **CSS root:** `.mstrmojo-Tooltip-contentWrapper`
- **User-visible elements:**
  - Tooltip (`.mstrmojo-Tooltip-contentWrapper`)
- **Component actions:**
  - `clickTextContextMenuOptionByKey(key, option)`
  - `getTextNodeInCurrentPage(index)`
  - `hoverTextNodeByKey(key)`
  - `InputValuetoTextNodeByKey(key, text)`
  - `isPopUpLinkDisplayedEditMode(text)`
  - `isTextContentDisplayed(index)`
  - `isTooltipDisplayedForTextNodeByKey(key)`
  - `navigateLink(index)`
  - `navigateLinkByKey(key)`
  - `navigateLinkByText(text)`
  - `navigateLinkEditMode(index)`
  - `navigateLinkEditModeByKey(key)`
  - `openTextLinkEditor(text)`
  - `pasteToTextbox(index)`
  - `textBackgoundColor(index)`
  - `textContent(index)`
  - `textFormat(index, styleProp)`
  - `tooltip(index)`
- **Related components:** dossierPage, getTextNodeInCurrentPage, openLinkEditorOnContainer

### Threshold
- **CSS root:** `.mstrmojo-Editor.adv-threshold.modal`
- **User-visible elements:**
  - Adv Threshold Editor (`.mstrmojo-Editor.adv-threshold.modal`)
  - Image Based Icon (`.item.image`)
  - Save Threshold Warning (`.mstrmojo-Editor.save-threshold-warning.mstrmojo-warning.mstrmojo-alert.modal`)
  - Simple Threshold Editor (`.mstrmojo-Editor.mstrmojo-SimpleThresholdEditor.modal`)
- **Component actions:**
  - `altText()`
  - `changeAltText(Text)`
  - `changeImageURL(Text)`
  - `chooseImageBased()`
  - `confirmAdvThresholdDetail()`
  - `confirmSwitchToAdvThreshold()`
  - `confirmThreshold()`
  - `isPreviewImageAltTagNotEmpty(index)`
  - `openAdvThresholdDetail(index)`
  - `previewImageAlt(index)`
  - `previewImageURL(index)`
  - `switchAdvThreshold()`
- **Related components:** dossierPage

### Waterfall
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickOnYAxisLabel(vizName)`
  - `selectYAxisContextMenuOption({ vizName, firstOption, secondOption, thirdOption })`
- **Related components:** getContainer

## Common Workflows (from spec.ts)

1. Test for forecast line chart (used in 10 specs)
2. Test for trend line chart (used in 10 specs)
3. [TC98366] E2E | Library | Run sanity tests for KPIs, Bar, Line Chart and Pie Chart in different environments (used in 4 specs)
4. [TC98367] E2E | Library | Run sanity tests for Maps, More in different environments (used in 4 specs)
5. [TC98368] E2E | Library | Run sanity tests for Insight Visualizations in different environments (used in 4 specs)
6. Library Visualization Sanity (used in 3 specs)
7. [F43676_1] FUN | Auto Summary Format & Refresh (used in 2 specs)
8. [F43676_2] FUN | Show/Not show Auto Summary in Library consumption & Refresh (used in 2 specs)
9. [F43676_3] Auto Summary Application control to hide Auto Summary (used in 2 specs)
10. [F43676_4] ACC | Auto Summary Main Workflow (used in 2 specs)
11. [SM_Reg2_00] Reg | Skip Calculation for AG Grid (used in 2 specs)
12. [SM_Reg2_01] Reg | Require Calculation for AG Grid (used in 2 specs)
13. [TC90183] ACC | Verify the viz gallery, editor panel and viz display in different status for Key Driver visualization in front-end (used in 2 specs)
14. [TC93604_1] E2E | Verify custom visualizations with HTML elements (used in 2 specs)
15. [TC93604_2] E2E | Verify custom visualizations with HTML elements (used in 2 specs)
16. [TC94279] ACC | Verify the viz format for Key Driver visualization in dossier authoring (used in 2 specs)
17. [TC94357] E2E | Library | Verify KeyDriver basic static rendering in locked mode in Library authoring. (used in 2 specs)
18. [TC94357] E2E | Library | Verify KeyDriver basic static rendering in locked mode in Library consumption. (used in 2 specs)
19. [TC94424] ACC | Verify the Key Driver visualization in dossier auto dashboard (used in 2 specs)
20. [TC94496] ACC | Verify the Key Driver visualization in dossier auto dashboard (used in 2 specs)
21. [TC94590] i18N | Verify the i18N case for Key Driver visualization in dashboard. (used in 2 specs)
22. [TC96061_2] E2E [Library Web] E2E test for PDM case in Library. (used in 2 specs)
23. [TC96061_3] Automation for DE302498. (used in 2 specs)
24. [TC96061] E2E [Library Web] E2E test for Auto Narratives Viz in Library. (used in 2 specs)
25. [TC96065_1] ACC [Library Web] Copy NLG to text box (used in 2 specs)
26. [TC96065_2] ACC [Library Web] Check Editor panel in dashboard library. (used in 2 specs)
27. [TC96065_3] ACC [Library Web] Trigger refresh in dashboard library. (used in 2 specs)
28. [TC96065_4] ACC [Library Web] Trigger auto refresh in dashboard library. (used in 2 specs)
29. [TC96065_5] ACC [Library Web] Data cut message (used in 2 specs)
30. [TC96067_1] NLG_Calculation_ABA | Chapter 1 | Min (used in 2 specs)
31. [TC96067_10] NLG_Calculation_ABA2 | Chapter 10 | Count and Distinct Dount (used in 2 specs)
32. [TC96067_11] NLG_Calculation_ABA2 | Chapter 11 | Mode (used in 2 specs)
33. [TC96067_12] NLG_Calculation_ABA2 | Chapter 12 | Production (used in 2 specs)
34. [TC96067_13] NLG_Calculation_ABA2 | Chapter 13 | Geo Mean (used in 2 specs)
35. [TC96067_2] NLG_Calculation_ABA | Chapter 2 | Max (used in 2 specs)
36. [TC96067_3] NLG_Calculation_ABA | Chapter 3 | Mean (used in 2 specs)
37. [TC96067_4] NLG_Calculation_ABA | Chapter 4 | Sum (used in 2 specs)
38. [TC96067_5] NLG_Calculation_ABA | Chapter 5 | First (used in 2 specs)
39. [TC96067_6] NLG_Calculation_ABA | Chapter 6 | Last (used in 2 specs)
40. [TC96067_7] NLG_Calculation_ABA2 | Chapter 7 | Median (used in 2 specs)
41. [TC96067_8] NLG_Calculation_ABA2 | Chapter 8 | Standard (used in 2 specs)
42. [TC96067_9] NLG_Calculation_ABA2 | Chapter 9 | Variance (used in 2 specs)
43. [TC96070_2] ACC [Library Web] Cross functions. (used in 2 specs)
44. [TC96070] ACC [Library Web] Check Format panel in dashboard library. (used in 2 specs)
45. [TC96071] FUN [Library Web] Check error handling in dashboard library. (used in 2 specs)
46. [TC97089_1] NLG_AdvancedML_ABA | Chapter 1 | Trend (used in 2 specs)
47. [TC97089_2] NLG_AdvancedML_ABA | Chapter 1 | Forecast (used in 2 specs)
48. [TC97089_3] NLG_AdvancedML_ABA | Chapter 1 | KeyDriver (used in 2 specs)
49. [TC97090_1] NLG_Subtotal_ABA | Chapter 1 | Sum (used in 2 specs)
50. [TC97090_2] NLG_Subtotal_ABA | Chapter 2 | Average (used in 2 specs)
51. [TC97090_3] NLG_Subtotal_ABA | Chapter 3 | Average (used in 2 specs)
52. [TC97090_4] NLG_Subtotal_ABA | Chapter 4 | Median (used in 2 specs)
53. [TC97090_5] NLG_Subtotal_ABA | Chapter 5 | Production (used in 2 specs)
54. [TC97090_6] NLG_Subtotal_ABA | Chapter 6 | Standard Deviation (used in 2 specs)
55. [TC97090_7] NLG_Subtotal_ABA | Chapter 7 | Variance (used in 2 specs)
56. [TC97092_1] NLG_FilterByValue_Metric | Chapter 1 | FilterByValue_Metric (used in 2 specs)
57. [TC97092_2] NLG_FilterByValue_Att | Chapter 1 | FilterByValue_Att (used in 2 specs)
58. [TC97092_3] NLG_FilterByRank | Chapter 1 | FilterByRank (used in 2 specs)
59. [TC97092_4] NLG_FilterByRank% | Chapter 1 | FilterByRank% (used in 2 specs)
60. [TC97167_1] i18N [Library Web] Check i18n string in dashboard library. (used in 2 specs)
61. [TC97167_2] i18N [Library Web] Check refresh. (used in 2 specs)
62. [TC97167_3] ACC [Library Web] Data cut message (used in 2 specs)
63. [TC98433] Verify the ForcastLineChart visualization in dossier auto dashboard (used in 2 specs)
64. [TC98434] Forcast Line Chart Check editor panel in dashboard library. (used in 2 specs)
65. [TC98435_01] ForcastLineChart Check Format panel in dashboard library 1. (used in 2 specs)
66. [TC98435_02] ForcastLineChart Check Format panel in dashboard library 2. (used in 2 specs)
67. [TC98435_03] ForcastLineChart Check Format panel in dashboard library 3. (used in 2 specs)
68. [TC98435_04] ForcastLineChart Format panel text and forms 1. (used in 2 specs)
69. [TC98435_05] ForcastLineChart Format panel text and forms 2. (used in 2 specs)
70. [TC98435_06] ForcastLineChart Format panel text and forms 3.1 (used in 2 specs)
71. [TC98435_07] ForcastLineChart Format panel text and forms 3.2 (used in 2 specs)
72. [TC98435_08] ForcastLineChart Format panel text and forms 3.3 (used in 2 specs)
73. [TC98435_09] ForcastLineChart Format panel text and forms 3.4 (used in 2 specs)
74. [TC98435_10] ForcastLineChart Format panel text and forms 4.1 (used in 2 specs)
75. [TC98435_11] ForcastLineChart Format panel text and forms 4.2 (used in 2 specs)
76. [TC98436_01] ForcastLineChart XFunctions 1 (used in 2 specs)
77. [TC98436_06] ForcastLineChart XFunctions 3 (used in 2 specs)
78. [TC98436_07] ForcastLineChart XFunctions 4.1 (used in 2 specs)
79. [TC98436_08] ForcastLineChart XFunctions 4.2 (used in 2 specs)
80. [TC98437_01] ForcastLineChart Check i18n in dashboard library 1. (used in 2 specs)
81. [TC98437_02] ForcastLineChart Check i18n in dashboard library 2. (used in 2 specs)
82. [TC98437_03] ForcastLineChart Check i18n in dashboard library 3. (used in 2 specs)
83. [TC98438] Verify the TrendLineChart visualization in dossier auto dashboard (used in 2 specs)
84. [TC98439] Trend Line Chart Check editor panel in dashboard library. (used in 2 specs)
85. [TC98440_01] TrendLineChart Check Format panel in dashboard library 1. (used in 2 specs)
86. [TC98440_02] TrendLineChart Check Format panel in dashboard library 2. (used in 2 specs)
87. [TC98440_03] TrendLineChart Check Format panel in dashboard library 3. (used in 2 specs)
88. [TC98440_04] TrendLineChart Format panel text and forms 1. (used in 2 specs)
89. [TC98440_05] TrendLineChart Format panel text and forms 2. (used in 2 specs)
90. [TC98440_06] TrendLineChart Format panel text and forms 3.1 (used in 2 specs)
91. [TC98440_07] TrendLineChart Format panel text and forms 3.2 (used in 2 specs)
92. [TC98440_08] TrendLineChart Format panel text and forms 3.3 (used in 2 specs)
93. [TC98440_09] TrendLineChart Format panel text and forms 3.4 (used in 2 specs)
94. [TC98440_10] TrendLineChart Format panel text and forms 4.1 (used in 2 specs)
95. [TC98440_11] TrendLineChart Format panel text and forms 4.2 (used in 2 specs)
96. [TC98441_01] TrendLineChart XFunctions 1 (used in 2 specs)
97. [TC98441_02] TrendLineChart XFunctions 2.1 (used in 2 specs)
98. [TC98441_06] TrendLineChart XFunctions 3 (used in 2 specs)
99. [TC98441_07] TrendLineChart XFunctions 4.1 (used in 2 specs)
100. [TC98441_08] TrendLineChart XFunctions 4.2 (used in 2 specs)
101. [TC98442_01] TrendLineChart Check i18n in dashboard library 1. (used in 2 specs)
102. [TC98442_02] TrendLineChart Check i18n in dashboard library 2. (used in 2 specs)
103. [TC98442_03] TrendLineChart Check i18n in dashboard library 3. (used in 2 specs)
104. [TC98568_1] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Custom1000*1000_FitToView (used in 2 specs)
105. [TC98568_2] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Screen16_9_FillTheView (used in 2 specs)
106. [TC98568_3] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_WideScreen_Zoom100 (used in 2 specs)
107. [TC98568_4] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Screen4_3_FitToView | Consumption (used in 2 specs)
108. [TC98569_1] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Custom1000*1000_FitToView | Authoring (used in 2 specs)
109. [TC98569_2] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Fill the view | Authoring (used in 2 specs)
110. [TC98569_3] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Zoom100 | Authoring (used in 2 specs)
111. [TC98569_4] Verify Auto Narratives, Key Driver, Insight Line and Insight Forecast in Responsive Dashboard_Screen4_3_FitToView | Authoring (used in 2 specs)
112. AutoNarratives_ACC (used in 2 specs)
113. AutoNarratives_E2E (used in 2 specs)
114. AutoNarratives_Errorhandling (used in 2 specs)
115. AutoNarratives_FUN (used in 2 specs)
116. AutoNarratives_i18n (used in 2 specs)
117. AutoNarratives_ML_Advanced (used in 2 specs)
118. AutoNarratives_ML_Basic (used in 2 specs)
119. AutoNarratives_ML_Filter (used in 2 specs)
120. AutoNarratives_ML_Subtotal (used in 2 specs)
121. AutoNarratives_SmartMetrics_FunOff (used in 2 specs)
122. AutoNarratives_SmartMetrics_FunOn (used in 2 specs)
123. AutoNarratives_SmartMetrics_Reg2 (used in 2 specs)
124. AutoNarratives_SmartMetrics_Regression (used in 2 specs)
125. AutoSummary_ACC (used in 2 specs)
126. AutoSummary_FUN (used in 2 specs)
127. CustomVizHTMLSanity (used in 2 specs)
128. KeyDriverAutoAnswers (used in 2 specs)
129. KeyDriverAutoDashboard (used in 2 specs)
130. KeyDriverDashboardTest (used in 2 specs)
131. KeyDriverLockedPageTest (used in 2 specs)
132. library Viz Sanity SaaS (used in 2 specs)
133. NLG_SmartMetricsACC_ComponentOff (used in 2 specs)
134. NLG_SmartMetricsACC_ComponentOn (used in 2 specs)
135. ResponsiveDashboard_InsightViz (used in 2 specs)
136. ResponsiveDashboard_InsightViz_Consume (used in 2 specs)
137. [TC92806] E2E | Library | Verify basic static rendering for all visualizations. (used in 1 specs)
138. [TC93376] Acceptance | Library | Verify the display of Graph tooltips with granular HTML control. (used in 1 specs)
139. [TC93972_1] Bot | Sanit test visualizations on bot (used in 1 specs)
140. [TC93972_2] AutoAnswer | Sanit test visualizations on Auto Answer (used in 1 specs)
141. [TC93972_3] AutoDashboard | Sanit test visualizations on Auto Dashboard (used in 1 specs)
142. [TC97847_1] Bot | Show the revenue distribution among categories for different years in a bar chart (used in 1 specs)
143. [TC97847_2] Bot | Show the revenue distribution among categories for different years in a clustered bar chart (used in 1 specs)
144. [TC97847_3] AutoAnswer | Show the revenue distribution among categories for different years in a bar chart (used in 1 specs)
145. [TC97847_4] AutoAnswer | Show the revenue distribution among categories for different years in a clustered bar chart (used in 1 specs)
146. [TC97847_5] AutoDashboard | Show the revenue distribution among categories for different years in a bar chart (used in 1 specs)
147. [TC97847_6] AutoDashboard | Show the revenue distribution among categories for different years in a clustered bar chart (used in 1 specs)
148. [TC97847_7] AutoAnswer | Custom Instruction | Show revenue distribution over regions and categories. (used in 1 specs)
149. [TC97847_8] AutoDashboard | Custom Instruction | Show revenue distribution over regions and categories. (used in 1 specs)
150. AIBarChart (used in 1 specs)
151. AIVizSanity (used in 1 specs)
152. libraryGraphTooltipsHTML (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getSummaryTextByIndex -- frequency: 362
2. getSummaryTextByVizTitle -- frequency: 46
3. getContextMenuEditor -- frequency: 32
4. getSubMenu -- frequency: 32
5. getContextMenu -- frequency: 24
6. getDossierView -- frequency: 19
7. getContextMenuByLevel -- frequency: 16
8. getToolbarBtnByName -- frequency: 10
9. getTextFromDisplayedTooltip -- frequency: 8
10. getDropZoneTooltip -- frequency: 6
11. getDataCutInfoTooltipText -- frequency: 4
12. getDisplayedPage -- frequency: 4
13. getGraph -- frequency: 4
14. getShowDataDialog -- frequency: 4
15. getProjectIdFromUrl -- frequency: 2
16. getSaveDossierButton -- frequency: 2
17. getTooltipText -- frequency: 2
18. Adv Threshold Editor -- frequency: 1
19. Auto Refresh Checkbox -- frequency: 1
20. Auto Summary Close Button -- frequency: 1
21. Auto Summary Copy Button -- frequency: 1
22. Auto Summary Expand Button -- frequency: 1
23. Auto Summary Icon -- frequency: 1
24. Auto Summary Icon Consumption -- frequency: 1
25. Box Plot Container -- frequency: 1
26. Confidencebandopacity -- frequency: 1
27. Confirm Image Url Button -- frequency: 1
28. Constant Box -- frequency: 1
29. Copy Btn -- frequency: 1
30. Data Cut Info Icon -- frequency: 1
31. Data Cut Info Tooltip -- frequency: 1
32. Display In Consumption Checkbox -- frequency: 1
33. Editor Panel -- frequency: 1
34. Empty Summary -- frequency: 1
35. Forecastlineopacity -- frequency: 1
36. getBotIdFromUrl -- frequency: 1
37. getDossierIdFromUrl -- frequency: 1
38. Image Based Icon -- frequency: 1
39. Image Tooltip Container -- frequency: 1
40. Instruction Generate Btn -- frequency: 1
41. Instruction Icon -- frequency: 1
42. Instruction Input -- frequency: 1
43. Instruction Input Count -- frequency: 1
44. New Viz Tooltip Container -- frequency: 1
45. Save Threshold Warning -- frequency: 1
46. Simple Threshold Editor -- frequency: 1
47. Stream Mode -- frequency: 1
48. Suggestion Popup -- frequency: 1
49. Suggestion Popup Dialog -- frequency: 1
50. Tooltip -- frequency: 1

## Key Actions

- `getSummaryTextByIndex(index = 0)` -- used in 362 specs
- `editDossierByUrl()` -- used in 282 specs
- `sleep()` -- used in 242 specs
- `doubleClickAttributeMetric()` -- used in 222 specs
- `goToPageAndRefreshNLG()` -- used in 204 specs
- `goToPage()` -- used in 179 specs
- `takeScreenshotByVIBoxPanel()` -- used in 168 specs
- `takeScreenshotBySelectedViz()` -- used in 128 specs
- `takeScreenshotByDocView()` -- used in 122 specs
- `openPageFromTocMenuWait()` -- used in 96 specs
- `selectViz()` -- used in 96 specs
- `changeVizType()` -- used in 86 specs
- `checkVizContainerByTitle()` -- used in 84 specs
- `clickOptionOnChapterMenu()` -- used in 84 specs
- `validatePageSummaryText()` -- used in 82 specs
- `login()` -- used in 77 specs
- `disableTutorial()` -- used in 71 specs
- `dismissPopups()` -- used in 66 specs
- `switchToFormatPanel()` -- used in 66 specs
- `clickMenuItemByName(name)` -- used in 64 specs
- `waitForNlgReady(index = 0)` -- used in 64 specs
- `clickVizMenuItemByName(name)` -- used in 60 specs
- `dismissTooltip()` -- used in 60 specs
- `openPageFromTocMenu()` -- used in 60 specs
- `openUrl()` -- used in 51 specs
- `clickAndgetVizMenu(name)` -- used in 48 specs
- `collectLineCoverageInfo()` -- used in 48 specs
- `clickOnInsertVI()` -- used in 46 specs
- `getSummaryTextByVizTitle(title)` -- used in 46 specs
- `openDebugMode()` -- used in 44 specs
- `doubleClickAttributeMetricByName()` -- used in 42 specs
- `checkElementByImageComparison(element, testCase, imageName)` -- used in 38 specs
- `clickInlineDropDown(abaloc)` -- used in 38 specs
- `clickInlineDropDownItem(abaloc, option)` -- used in 38 specs
- `switchToTextAndFormTab()` -- used in 36 specs
- `clickTextAndFormDropDown()` -- used in 32 specs
- `getContextMenuEditor()` -- used in 32 specs
- `getSubMenu()` -- used in 32 specs
- `checkDisclaimRefreshDisplay(testCase, imageName, tolerance = 0.5)` -- used in 30 specs
- `clickOnVizCategory()` -- used in 28 specs
- `checkChatbotVizByIndex()` -- used in 26 specs
- `clearHistoryVizCreationByChat()` -- used in 26 specs
- `clickOnViz()` -- used in 26 specs
- `enableABAlocator()` -- used in 26 specs
- `clickSwitch(abaloc)` -- used in 24 specs
- `clickTargetNameDropZone()` -- used in 24 specs
- `getContextMenu()` -- used in 24 specs
- `resetDossierIfPossible()` -- used in 24 specs
- `takeScreenshotByVIDoclayout()` -- used in 24 specs
- `waitLoadingDataPopUpIsNotDisplayed()` -- used in 24 specs
- `clickBreakByDropZone()` -- used in 20 specs
- `switchToVizOptionTab()` -- used in 20 specs
- `getDossierView()` -- used in 19 specs
- `checkVizInAutoDashboard()` -- used in 18 specs
- `clickDropDown(abaloc)` -- used in 18 specs
- `clickDropDownItem(option)` -- used in 18 specs
- `clickUndo()` -- used in 18 specs
- `hoverOnDecreaseBar(index = 0)` -- used in 18 specs
- `checkVIDoclayout()` -- used in 16 specs
- `clickAxisAndGridLines()` -- used in 16 specs
- `clickFontStyle(option)` -- used in 16 specs
- `clickRotationDropDown()` -- used in 16 specs
- `clickRotationOption(option)` -- used in 16 specs
- `clickVizMenuSubItemByName(name)` -- used in 16 specs
- `getContextMenuByLevel()` -- used in 16 specs
- `setInstructionOnly(instructionString)` -- used in 16 specs
- `verifySummaryStyleByPos(index = 0, styles)` -- used in 16 specs
- `waitForElementVisible()` -- used in 16 specs
- `checkVizByImageComparison()` -- used in 15 specs
- `clearHistoryAndAskQuestion()` -- used in 15 specs
- `checkGallery()` -- used in 14 specs
- `checkImageCompareForDocView()` -- used in 14 specs
- `chooseColorInColorPicker(abaloc)` -- used in 14 specs
- `clickColorPickDropDown(abaloc)` -- used in 14 specs
- `hoverOnBar(index = 0)` -- used in 14 specs
- `vizCreationByChat()` -- used in 14 specs
- `clickAxisTitle()` -- used in 12 specs
- `clickGridLineOption(option)` -- used in 12 specs
- `clickRefreshIcon(index = 0)` -- used in 12 specs
- `clickTimeAttributeDropZone()` -- used in 12 specs
- `createBlankDashboard()` -- used in 12 specs
- `setInstruction(instructionString)` -- used in 12 specs
- `takeScreenshotByVIVizPanel()` -- used in 12 specs
- `clearHistory()` -- used in 10 specs
- `clickAxisLabel()` -- used in 10 specs
- `getToolbarBtnByName()` -- used in 10 specs
- `goToPageWithNLG()` -- used in 10 specs
- `switchToEditorPanel()` -- used in 10 specs
- `disablePendoTutorial()` -- used in 9 specs
- `addNewSampleData()` -- used in 8 specs
- `clickAlertYes()` -- used in 8 specs
- `clickAutoSummaryIcon(isConsumption = false)` -- used in 8 specs
- `clickAxesSection()` -- used in 8 specs
- `clickAxisDirection()` -- used in 8 specs
- `clickContainerFitDropDown()` -- used in 8 specs
- `clickContainerFitOption(option)` -- used in 8 specs
- `clickContainerFitSection()` -- used in 8 specs
- `clickDataLabelHideOverlappingLabels()` -- used in 8 specs
- `clickDataLabelSwitch()` -- used in 8 specs
- `clickForecastSwitch()` -- used in 8 specs
- `clickGridLines()` -- used in 8 specs
- `clickLegendSwitch()` -- used in 8 specs
- `clickLineLabelSwitch()` -- used in 8 specs
- `clickReferenceLineAdd()` -- used in 8 specs
- `clickReferenceLineEnable()` -- used in 8 specs
- `clickShowTitle()` -- used in 8 specs
- `clickTopLeftCorner()` -- used in 8 specs
- `clickTrendLineSwitch()` -- used in 8 specs
- `exclude({ title, slice })` -- used in 8 specs
- `getTextFromDisplayedTooltip()` -- used in 8 specs
- `keys()` -- used in 8 specs
- `switchToTitleAndContainerTab()` -- used in 8 specs
- `takeScreenshotByVizTitle()` -- used in 8 specs
- `validateSummaryTextContains(summaryText, expectedStrings)` -- used in 8 specs
- `clickMaxMinBtn()` -- used in 7 specs
- `addNewSampleDataSaaS()` -- used in 6 specs
- `clickBarLogicMetric()` -- used in 6 specs
- `clickBarLogicType()` -- used in 6 specs
- `clickBarLogicValue()` -- used in 6 specs
- `clickGenerate(index = 0)` -- used in 6 specs
- `clickSwitchTabButton()` -- used in 6 specs
- `createByAriaLable()` -- used in 6 specs
- `getDropZoneTooltip()` -- used in 6 specs
- `goToLibrary()` -- used in 6 specs
- `hoverOnIncreaseBar(index = 0)` -- used in 6 specs
- `openDefaultApp()` -- used in 6 specs
- `selectFontType()` -- used in 6 specs
- `selectItem()` -- used in 6 specs
- `open()` -- used in 5 specs
- `openAutoDashboard()` -- used in 5 specs
- `openUrlAndCancelAddToLibrary()` -- used in 5 specs
- `apply()` -- used in 4 specs
- `checkEditorPanel(testCase, imageName, tolerance = 0.5)` -- used in 4 specs
- `checkEmptySummary(testCase, imageName, tolerance = 0.5)` -- used in 4 specs
- `chooseTypeInDropDown(option, notOption)` -- used in 4 specs
- `clickAutosizeCheckbox()` -- used in 4 specs
- `clickAutoSummaryExpandButton()` -- used in 4 specs
- `clickButtonFromToolbar()` -- used in 4 specs
- `clickDataLabelAndShapes()` -- used in 4 specs
- `clickDataLabelsHideOL()` -- used in 4 specs
- `clickDataLabelsSwitch()` -- used in 4 specs
- `clickDisplayInConsumption()` -- used in 4 specs
- `clickEmptySummary()` -- used in 4 specs
- `clickEntireGraph()` -- used in 4 specs
- `clickFontSizeDec()` -- used in 4 specs
- `clickFontSizeInc()` -- used in 4 specs
- `clickForecast()` -- used in 4 specs
- `clickForecastLengthDown()` -- used in 4 specs
- `clickForecastLengthUp()` -- used in 4 specs
- `clickHorizontalAxisOption()` -- used in 4 specs
- `clickRedo()` -- used in 4 specs
- `clickReferenceLineDelete()` -- used in 4 specs
- `clickRotationCustomOption(option)` -- used in 4 specs
- `clickShowDataLabels()` -- used in 4 specs
- `clickShowMaker()` -- used in 4 specs
- `clickSubMenuItemByName(name)` -- used in 4 specs
- `clickTitleBar()` -- used in 4 specs
- `clickTrendLine()` -- used in 4 specs
- `clickTypeDropDown(abaloc)` -- used in 4 specs
- `clickVerticalAxisOption()` -- used in 4 specs
- `closeShowDataDialog()` -- used in 4 specs
- `executeScript()` -- used in 4 specs
- `getDataCutInfoTooltipText()` -- used in 4 specs
- `getDisplayedPage()` -- used in 4 specs
- `getGraph()` -- used in 4 specs
- `getShowDataDialog()` -- used in 4 specs
- `hoverOnAutoRefreshInfo()` -- used in 4 specs
- `hoverOnDataCutInfoIcon()` -- used in 4 specs
- `hoverOnInstructionIcon()` -- used in 4 specs
- `hoverOnViz()` -- used in 4 specs
- `isAutoSummaryExistInCanvas()` -- used in 4 specs
- `isAutoSummaryExpand()` -- used in 4 specs
- `isAutoSummaryIconSelected()` -- used in 4 specs
- `isDisplayInConsumptionChecked()` -- used in 4 specs
- `openFilterPanel()` -- used in 4 specs
- `openMenuOnVisualization()` -- used in 4 specs
- `openSecondaryPanel()` -- used in 4 specs
- `selectCreateAutoNarrativeOnVisualizationMenu(title)` -- used in 4 specs
- `selectDeleteOnVisualizationMenu(title)` -- used in 4 specs
- `selectElementByName()` -- used in 4 specs
- `selectGridElement({ title, headerName, elementName, agGrid = false })` -- used in 4 specs
- `setFontStyle()` -- used in 4 specs
- `setReferenceLineConstantValue(value)` -- used in 4 specs
- `stopGuides()` -- used in 4 specs
- `switchViewMode()` -- used in 4 specs
- `actionOnToolbar()` -- used in 2 specs
- `addAttributMetricToDropzone()` -- used in 2 specs
- `addLastVizToPage()` -- used in 2 specs
- `changeDecreaseFactorColor()` -- used in 2 specs
- `changeIncreaseFactorColor()` -- used in 2 specs
- `checkChatbotMaximizeViz()` -- used in 2 specs
- `checkDeleteVizPopupDialog(testCase, imageName, tolerance = 0.5)` -- used in 2 specs
- `checkInstruction(testCase, imageName, tolerance = 0.5)` -- used in 2 specs
- `checkInstructionTooltip(testCase, imageName, tolerance = 0.5)` -- used in 2 specs
- `checkPopupDialog(testCase, imageName, tolerance = 0.5)` -- used in 2 specs
- `checkSuggestionsPopup(testCase, imageName, tolerance = 0.5)` -- used in 2 specs
- `checkVIVizPanel()` -- used in 2 specs
- `checkVizContainerMenu()` -- used in 2 specs
- `clickAutoRefresh()` -- used in 2 specs
- `clickAutoSummaryCloseButton()` -- used in 2 specs
- `clickAutoSummaryCopyButton()` -- used in 2 specs
- `clickCancelButton()` -- used in 2 specs
- `clickDeleteButton()` -- used in 2 specs
- `clickNlgCopyBtn()` -- used in 2 specs
- `clickOnRectArea()` -- used in 2 specs
- `clickSuggenstedItemByName(name)` -- used in 2 specs
- `clickVisualizationTitle()` -- used in 2 specs
- `clickWrapTextCheckbox()` -- used in 2 specs
- `closeChatbotVizFocusModal()` -- used in 2 specs
- `createBlankDashboardFromLibrary()` -- used in 2 specs
- `execute()` -- used in 2 specs
- `getProjectIdFromUrl()` -- used in 2 specs
- `getSaveDossierButton()` -- used in 2 specs
- `getTooltipText()` -- used in 2 specs
- `hoverOnFootnote(index = 0)` -- used in 2 specs
- `isContextMenuOptionPresent()` -- used in 2 specs
- `keepOnly({ title, slice })` -- used in 2 specs
- `log()` -- used in 2 specs
- `maximizeChatbotVisualization()` -- used in 2 specs
- `maximizeContainer()` -- used in 2 specs
- `readText()` -- used in 2 specs
- `relogin()` -- used in 2 specs
- `saasLogin()` -- used in 2 specs
- `saveDashboardInMyReports()` -- used in 2 specs
- `scrollToTop()` -- used in 2 specs
- `selectCopyFormattingOnVisualizationMenu(title)` -- used in 2 specs
- `selectDuplicateOnVisualizationMenu(title)` -- used in 2 specs
- `selectPasteFormattingOnVisualizationMenu(title)` -- used in 2 specs
- `setFontColor()` -- used in 2 specs
- `setFontHorizontalAlignment()` -- used in 2 specs
- `setFontSize()` -- used in 2 specs
- `setFontVerticalAlignment()` -- used in 2 specs
- `setValueForPositionX()` -- used in 2 specs
- `switchAlignment(type)` -- used in 2 specs
- `switchCellPadding(type)` -- used in 2 specs
- `switchUser()` -- used in 2 specs
- `switchWorkflow(type)` -- used in 2 specs
- `toBeTruthy()` -- used in 2 specs
- `validateClipboardContains(expectedString)` -- used in 2 specs
- `waitForItemLoading()` -- used in 2 specs
- `addSampleData()` -- used in 1 specs
- `clickGraphCell()` -- used in 1 specs
- `createBotWithNewDataInDefaultProject()` -- used in 1 specs
- `exitBotAuthoring()` -- used in 1 specs
- `getBotIdFromUrl()` -- used in 1 specs
- `getDossierIdFromUrl()` -- used in 1 specs
- `goToHome()` -- used in 1 specs
- `openBotById()` -- used in 1 specs
- `openBotByIdAndWait()` -- used in 1 specs
- `saveAsBotInMyReports()` -- used in 1 specs
- `addAverageReferenceLine(vizName)` -- used in 0 specs
- `addConstantReferenceLine({ vizName, value })` -- used in 0 specs
- `addFirstReferenceLine(vizName)` -- used in 0 specs
- `addLastReferenceLine(vizName)` -- used in 0 specs
- `addMaximumReferenceLine(vizName)` -- used in 0 specs
- `addMedianReferenceLine(vizName)` -- used in 0 specs
- `addMinimumReferenceLine(vizName)` -- used in 0 specs
- `allAltTexts()` -- used in 0 specs
- `altText()` -- used in 0 specs
- `applyShowTotalsSelection()` -- used in 0 specs
- `changeAltText(Text)` -- used in 0 specs
- `changeImageURL(Text)` -- used in 0 specs
- `checkRefreshButton(testCase, imageName, tolerance = 0.5)` -- used in 0 specs
- `checkSummaryByVizIndex(testCase, imageName, index = 0, tolerance = 0.5)` -- used in 0 specs
- `checkTooltip(testCase, imageName, tolerance = 0.5)` -- used in 0 specs
- `chooseImageBased()` -- used in 0 specs
- `clickBar(index = 0)` -- used in 0 specs
- `clickButton(buttonName)` -- used in 0 specs
- `clickElement({ vizName, eleName, lineName })` -- used in 0 specs
- `clickElemInYAxis({ vizName, eleName })` -- used in 0 specs
- `clickGridElementLink({ title, headerName, elementName, agGrid = false })` -- used in 0 specs
- `clickImageinAuthoring(index)` -- used in 0 specs
- `clickOnYAxis(vizName)` -- used in 0 specs
- `clickOnYAxisLabel(vizName)` -- used in 0 specs
- `clickTextContextMenuOptionByKey(key, option)` -- used in 0 specs
- `collapseLegend(title)` -- used in 0 specs
- `collapseLegend(vizName)` -- used in 0 specs
- `composeElementName(textNode)` -- used in 0 specs
- `confirmAdvThresholdDetail()` -- used in 0 specs
- `confirmImageURL()` -- used in 0 specs
- `confirmSwitchToAdvThreshold()` -- used in 0 specs
- `confirmThreshold()` -- used in 0 specs
- `dataLabel({ vizName, index })` -- used in 0 specs
- `drill({ vizName, eleName, lineName, drillOption })` -- used in 0 specs
- `drillTo({ title, slice, drillTarget, singleSelection })` -- used in 0 specs
- `elemIndexInXAxis({ vizName, eleName })` -- used in 0 specs
- `elemIndexInYAxis({ vizName, eleName })` -- used in 0 specs
- `enabletrendline(vizName)` -- used in 0 specs
- `exclude({ vizName, eleName, lineName })` -- used in 0 specs
- `expandBranch({ title, headerName, elementName })` -- used in 0 specs
- `expandLegend(title)` -- used in 0 specs
- `expandLegend(vizName)` -- used in 0 specs
- `firstElmOfHeader({ title, headerName, agGrid = false })` -- used in 0 specs
- `getAllThresholdImageAlt(title)` -- used in 0 specs
- `getBoxPlotFillColor(index = 0)` -- used in 0 specs
- `getCellValue(title, row, col, agGrid = false)` -- used in 0 specs
- `getCollapseIconOfElement({ title, headerName, elementName })` -- used in 0 specs
- `getCurrentPageImageNode(index)` -- used in 0 specs
- `getElemByLine({ vizName, lineName, index })` -- used in 0 specs
- `getElementByValue({ title, headerName, elementName, agGrid = false })` -- used in 0 specs
- `getExpandIconOfElement({ title, headerName, elementName })` -- used in 0 specs
- `getGridElementLink({ title, headerName, elementName, agGrid = false })` -- used in 0 specs
- `getGridElmBackgroundColor({ title, headerName, elementName })` -- used in 0 specs
- `getGridMode(title)` -- used in 0 specs
- `getHeaderByName({ title, headerName, agGrid = false })` -- used in 0 specs
- `getHeaderCount(title, agGrid = false)` -- used in 0 specs
- `getHeaderText(title, agGrid = false)` -- used in 0 specs
- `getImageBoxByIndex(index)` -- used in 0 specs
- `getImageNodeByKey(key)` -- used in 0 specs
- `getIndexByName(title, slice)` -- used in 0 specs
- `getlegendColor({ vizName, lineName })` -- used in 0 specs
- `getLineIndex({ vizName, lineName })` -- used in 0 specs
- `getOneColumnData(title, headerName, agGrid = false)` -- used in 0 specs
- `getOneColumnDataWithColSpan(title, headerName, agGrid = false)` -- used in 0 specs
- `getOneRowData(title, row, agGrid = false)` -- used in 0 specs
- `getRowByCell(title, cellText)` -- used in 0 specs
- `getTextNodeInCurrentPage(index)` -- used in 0 specs
- `getThresholdImageAlt(index)` -- used in 0 specs
- `getThresholdImageURL(index)` -- used in 0 specs
- `getVizDossierLinkingTooltip()` -- used in 0 specs
- `hideLabels({ vizName, eleName, lineName })` -- used in 0 specs
- `hideLegend(title)` -- used in 0 specs
- `hideLegend(vizName)` -- used in 0 specs
- `hideLines(vizName)` -- used in 0 specs
- `hoverOnElementByXAxis({ vizName, eleName, lineName })` -- used in 0 specs
- `hoverOnGridElement({ title, headerName, elementName })` -- used in 0 specs
- `hoverOnGridElementNoWait({ title, headerName, elementName })` -- used in 0 specs
- `hoverOnImage(index)` -- used in 0 specs
- `hoverOnImageByKey(key)` -- used in 0 specs
- `hoverOnSlice({ title, slice })` -- used in 0 specs
- `hoverTextNodeByKey(key)` -- used in 0 specs
- `imageTooltip()` -- used in 0 specs
- `incrementalFetch(title)` -- used in 0 specs
- `inputNumberDown(abaloc)` -- used in 0 specs
- `inputNumberUp(abaloc)` -- used in 0 specs
- `InputValuetoTextNodeByKey(key, text)` -- used in 0 specs
- `isAllAltMatched(expectedAltList, altTexts)` -- used in 0 specs
- `isAltTagNotEmpty(index)` -- used in 0 specs
- `isAltTextNotEmpty()` -- used in 0 specs
- `isAttributeOrMetricName(name)` -- used in 0 specs
- `isDataLabelDisplayed({ title, label })` -- used in 0 specs
- `isElementPresent({ vizName, eleName })` -- used in 0 specs
- `isGridAltTagNotEmpty(index)` -- used in 0 specs
- `isGridElmAppliedThreshold({ title, headerName, elementName })` -- used in 0 specs
- `isGridElmHighlighted({ title, headerName, elementName })` -- used in 0 specs
- `isImageErrorIconDisplayed(index)` -- used in 0 specs
- `isLegendMinimized(title)` -- used in 0 specs
- `isLegendMinimized(vizName)` -- used in 0 specs
- `isLegendPresent(title)` -- used in 0 specs
- `isLegendPresent(vizName)` -- used in 0 specs
- `isMajorLineDisplayed(vizName)` -- used in 0 specs
- `isMinorLineDisplayed(vizName)` -- used in 0 specs
- `isPopUpLinkDisplayedEditMode(text)` -- used in 0 specs
- `isPreviewImageAltTagNotEmpty(index)` -- used in 0 specs
- `isReferenceValueDisplayed({ vizName, value })` -- used in 0 specs
- `isSlicePresent({ title, label })` -- used in 0 specs
- `isTableExist(title)` -- used in 0 specs
- `isTextContentDisplayed(index)` -- used in 0 specs
- `isTooltipDisplayedForTextNodeByKey(key)` -- used in 0 specs
- `isTrendLineDisplayed(vizName)` -- used in 0 specs
- `keepOnly({ vizName, eleName, lineName })` -- used in 0 specs
- `legendCount(title)` -- used in 0 specs
- `legendCount(vizName)` -- used in 0 specs
- `legendData({ title, index })` -- used in 0 specs
- `legendData({ vizName, index })` -- used in 0 specs
- `linkToDossier({ title, headerName, elementName }, prompted = false)` -- used in 0 specs
- `linkToTargetByGridContextMenu({ title, headerName, elementName }, prompted = false)` -- used in 0 specs
- `linkToTargetByGridContextMenuForRA({ title, headerName, elementName, secondOption }, prompted = false)` -- used in 0 specs
- `linkToTargetByGridToolTip()` -- used in 0 specs
- `linkToTargetByPiechartContextMenu({ title, slice })` -- used in 0 specs
- `multiSelectGridElements({ title, headerName, elementName1, elementName2 })` -- used in 0 specs
- `navigateLink(index)` -- used in 0 specs
- `navigateLinkByKey(key)` -- used in 0 specs
- `navigateLinkByText(text)` -- used in 0 specs
- `navigateLinkEditMode(index)` -- used in 0 specs
- `navigateLinkEditModeByKey(key)` -- used in 0 specs
- `navigateLinkInCurrentPage(index)` -- used in 0 specs
- `openAdvThresholdDetail(index)` -- used in 0 specs
- `openGridElmContextMenu({ title, headerName, elementName, agGrid = false })` -- used in 0 specs
- `openImageLinkEditor(index)` -- used in 0 specs
- `openPieChartElmContextMenu({ title, slice })` -- used in 0 specs
- `openTextLinkEditor(text)` -- used in 0 specs
- `pasteToTextbox(index)` -- used in 0 specs
- `previewImageAlt(index)` -- used in 0 specs
- `previewImageURL(index)` -- used in 0 specs
- `replaceWith({ name, elemName })` -- used in 0 specs
- `scrollGridToBottom(title)` -- used in 0 specs
- `selectAutomaticGridLinesOption(vizName)` -- used in 0 specs
- `selectAxisContextMenuOption({ name, firstOption, secondOption })` -- used in 0 specs
- `selectChartContextMenuOption({ vizName, firstOption, secondOption, thirdOption })` -- used in 0 specs
- `selectElement({ title, headerName, elementName, agGrid = false })` -- used in 0 specs
- `selectElementContextMenuOption({ vizName, eleName, lineName, firstOption, secondOption, thirdOption })` -- used in 0 specs
- `selectElementContextMenuOptionOnSingleLine({ vizName, eleName, firstOption, secondOption, thirdOption })` -- used in 0 specs
- `selectGridContextMenu({ title, headerName, elementName, firstOption, secondOption, thirdOption, agGrid = false }, prompted = false)` -- used in 0 specs
- `selectGridContextMenuOption({ title, headerName, elementName, firstOption, secondOption, thirdOption, agGrid = false }, prompted = false)` -- used in 0 specs
- `selectShowTotalsOption(totalOption)` -- used in 0 specs
- `selectXAxisContextMenuOption({ vizName, firstOption, secondOption, thirdOption })` -- used in 0 specs
- `selectYAxisContextMenuOption({ vizName, firstOption, secondOption, thirdOption })` -- used in 0 specs
- `setDataLabels({ title, index, option })` -- used in 0 specs
- `showLegend(title)` -- used in 0 specs
- `showLegend(vizName)` -- used in 0 specs
- `showMajorandMinorGridLines(vizName)` -- used in 0 specs
- `showMajorLinesOnly(vizName)` -- used in 0 specs
- `showOnlyValueLabels({ vizName, eleName, lineName })` -- used in 0 specs
- `sliceCount(title)` -- used in 0 specs
- `sliceLabel({ title, index })` -- used in 0 specs
- `switchAdvThreshold()` -- used in 0 specs
- `textBackgoundColor(index)` -- used in 0 specs
- `textContent(index)` -- used in 0 specs
- `textFormat(index, styleProp)` -- used in 0 specs
- `tooltip(index)` -- used in 0 specs
- `waitForGridLoaded(title, agGrid = false)` -- used in 0 specs
- `waitForIncrementalFetchLoading(title)` -- used in 0 specs

## Source Coverage

- `pageObjects/visualization/**/*.js`
- `specs/regression/aiVisualizations/**/*.{ts,js}`
- `specs/regression/config/libraryVisualization/**/*.{ts,js}`
- `specs/regression/libraryVisualizations/**/*.{ts,js}`
- `specs/regression/libraryVisualizations/autoNarratives/**/*.{ts,js}`
- `specs/regression/libraryVisualizations/forecast/**/*.{ts,js}`
- `specs/regression/libraryVisualizations/keyDriver/**/*.{ts,js}`
- `specs/regression/libraryVisualizations/trend/**/*.{ts,js}`
- `specs/regression/libraryVisualizations/vizCommon/**/*.{ts,js}`
