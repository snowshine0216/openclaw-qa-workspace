# Site Knowledge: Compound Grid Domain

## Overview

- **Domain key:** `compoundGrid`
- **Components covered:** CompoundGridVisualization, FormatPanelForCompoundGrid
- **Spec files scanned:** 13
- **POM files scanned:** 2

## Components

### CompoundGridVisualization
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `getGridCellTextByPosition(row, col, visualizationName)`
- **Related components:** _none_

### FormatPanelForCompoundGrid
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `selectColumnSet(menuOption)`
- **Related components:** _none_

## Common Workflows (from spec.ts)

1. Compound Grid Derived Attribute (used in 2 specs)
2. [TC167059_01] same attribute in column sets w/ different attribute forms displayed (used in 1 specs)
3. [TC167059_02] different attribute forms showing for 3 different CS (used in 1 specs)
4. [TC169258_01] 2 metrics in CS1, attribute and metric in CS2 - context menu validation (used in 1 specs)
5. [TC169258_02] 2 metrics in CS1, Same attribute and metric in CS2 and CS3 (used in 1 specs)
6. [TC169258_03] 2 metrics in CS1 then same attribute in CS2 and CS3 (used in 1 specs)
7. [TC41275] Compound Grid - Simple Creation (used in 1 specs)
8. [TC41276_01] Compound Grid sort (used in 1 specs)
9. [TC41276_02] Sort multiple column set compound grid with metrics in rows (used in 1 specs)
10. [TC41291_01] Compound grid to simple grid (Threshold manipulations) (used in 1 specs)
11. [TC41291_02] Simple grid to compound grid (Column set formatting manipulations) (used in 1 specs)
12. [TC41291_03] Graph with attributes/metrics to Compound grid (Sorting manipulations) (used in 1 specs)
13. [TC41291_04] Compound grid with attributes/metrics to Graph (used in 1 specs)
14. [TC41291_05] Compound grid with metrics to Simple Grid (Number Formatting manipulations) (used in 1 specs)
15. [TC41291_06] Compound grid with metrics to Graph (Number Formatting manipulations) (used in 1 specs)
16. [TC41291_07] Simple grid with metrics to Compound Grid (Number Formatting manipulations) (used in 1 specs)
17. [TC41291_08] Graph with metrics to Compound Grid (used in 1 specs)
18. [TC41291_09] Convert to/from Custom Viz (used in 1 specs)
19. [TC41295_01] Compound grid E2E with advanced formatting sorting filtering and responsive design (used in 1 specs)
20. [TC55031_1] Attributes 1, 2, 3 in rows and metrics 1 and 2 in columns (used in 1 specs)
21. [TC55031_2] Attributes 1 and 2 in rows and attribute 3 and metrics 1 and 2 in columns (used in 1 specs)
22. [TC55031_3] Attributes 1 and 2 in rows and metrics 1 and 2 and attribute 3 in columns (used in 1 specs)
23. [TC62631_01] Column Set Test (used in 1 specs)
24. [TC62631_02] Group Editor Test (used in 1 specs)
25. [TC62631_03] Attribute Editor Test (used in 1 specs)
26. [TC62631_04] Link Editor Test (used in 1 specs)
27. [TC62631_05] Derived Metric Editor Test (used in 1 specs)
28. [TC62631_06] Format panel General Settings for Title and Container (used in 1 specs)
29. [TC62631_07] Compound grid shows additional cell selections when changing a metric selector (used in 1 specs)
30. [TC62631_08] Compound grid threshold test (used in 1 specs)
31. [TC6434_01] regression test for compound grid duplicate (used in 1 specs)
32. [TC6434_02] regression test for compound grid copy to (used in 1 specs)
33. [TC6434_03] regression test for compound grid move to (used in 1 specs)
34. [TC64389_01] Format panel (font) Column Headers (used in 1 specs)
35. [TC64389_02] Format panel (fill color) Column Headers (used in 1 specs)
36. [TC64389_03] Format panel (vertical and horizontal lines) Column Headers (used in 1 specs)
37. [TC64389_04] Format panel (alignment) Column Headers (used in 1 specs)
38. [TC64389_05] Format panel (text-wrap) Column Headers (used in 1 specs)
39. [TC64389_06] Regression Test for Compound Grid Column Resize (used in 1 specs)
40. [TC6514_01] Validate Sort Within (Default) sorting on metrics in Drop Zone (used in 1 specs)
41. [TC6514_02] Validate Sort Within (Default) sorting on metrics in grid (used in 1 specs)
42. [TC69866_01] Compound Grid - Metrics in Rows - Basic Manipulations (used in 1 specs)
43. [TC69866_02] Compound Grid - Metrics in Rows - Derived Metric (used in 1 specs)
44. [TC69866_03] Compound Grid - Metrics in Rows - Remove Last Column Set (used in 1 specs)
45. [TC69866_04] Compound Grid - Metrics in Rows - Thresholds (used in 1 specs)
46. [TC81400_01] Validate ability to change column setting in Compound Grid (used in 1 specs)
47. [TC99178_01] Create derived objects (used in 1 specs)
48. [TC99178_02] Create thresholds in the compound grid (used in 1 specs)
49. [TC99178_03] Create advanced filter in the compound grid (used in 1 specs)
50. [TC99178_04] Formatting in the compound grid (used in 1 specs)
51. [TC99178_05] Enable Outline Mode in the compound grid (used in 1 specs)
52. [TC99178_06] Configure cross-chapter linking for the compound grid (used in 1 specs)
53. [TC99178_07] Use the compound grid in library consumption (used in 1 specs)
54. [TC99178] Create a compound grid (used in 1 specs)
55. Compound Grid Column Set (used in 1 specs)
56. Compound Grid Display Attribute Forms and Context Menu Test (used in 1 specs)
57. Compound Grid Duplicate/Copy/Move Test (used in 1 specs)
58. Compound Grid E2E workflows (used in 1 specs)
59. Compound Grid Filter Test (used in 1 specs)
60. Compound Grid Formatting Test (used in 1 specs)
61. Compound Grid Manipulation Test: Convert, undo/redo etc (used in 1 specs)
62. Compound Grid Metric in Rows Test (used in 1 specs)
63. Compound Grid Sort Within (used in 1 specs)
64. Compound Grid Subtotals and Derived Metrics (used in 1 specs)
65. Compound Grid Threshold Test (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getGridCellByPosition -- frequency: 454
2. getGridCellTextByPosition -- frequency: 205
3. getObjectFromSection -- frequency: 82
4. getGridCellStyleByPosition -- frequency: 48
5. getCSSProperty -- frequency: 47
6. getObjectFromSectionSansType -- frequency: 40
7. getPage -- frequency: 26
8. getContextMenuOption -- frequency: 18
9. getObjectInColumnSetDropZone -- frequency: 18
10. getContainer -- frequency: 15
11. getGridContainer -- frequency: 9
12. FAD47 F -- frequency: 6
13. getColumnSetDropZone -- frequency: 6
14. 83 C962 -- frequency: 5
15. getGridObjectOutline -- frequency: 4
16. getObjectInDropZone -- frequency: 4
17. 159 B98 -- frequency: 3
18. getRowObjectTexts -- frequency: 3
19. getSegmentControlDropDownByCurrentSelection -- frequency: 3
20. 4 F60 D6 -- frequency: 2
21. D76322 -- frequency: 2
22. getCellInshowDataGrid -- frequency: 2
23. getColumnSetObjectTexts -- frequency: 2
24. getContainerImgOverlay -- frequency: 2
25. getLinkFromGridCell -- frequency: 2
26. split( -- frequency: 2
27. {actual} -- frequency: 1
28. 028 F94 -- frequency: 1
29. 1 D6 F31 -- frequency: 1
30. 5 C388 C -- frequency: 1
31. B3 CDEF -- frequency: 1
32. C1292 F -- frequency: 1
33. getAttributeFormDefinition -- frequency: 1
34. getDatasetRowCount -- frequency: 1
35. getFunctionSelectioninPopupList -- frequency: 1
36. getMojoEditorWithTitle -- frequency: 1
37. getSourceButton -- frequency: 1
38. getSourceIconInLayersPanel -- frequency: 1
39. getTargetButton -- frequency: 1
40. getTargetIconInLayersPanel -- frequency: 1
41. getVisualizationTitleBarRoot -- frequency: 1

## Key Actions

- `getGridCellByPosition()` -- used in 465 specs
- `getText()` -- used in 313 specs
- `getGridCellTextByPosition(row, col, visualizationName)` -- used in 205 specs
- `getCSSProperty()` -- used in 188 specs
- `isDisplayed()` -- used in 90 specs
- `isExisting()` -- used in 86 specs
- `getObjectFromSection()` -- used in 82 specs
- `clickButtonFromToolbar()` -- used in 73 specs
- `getGridCellStyleByPosition()` -- used in 48 specs
- `isDisplayFormSelected()` -- used in 45 specs
- `editDossierByUrl()` -- used in 43 specs
- `getObjectFromSectionSansType()` -- used in 40 specs
- `confirmOutlineGridExpanded()` -- used in 38 specs
- `addObjectToVizByDoubleClick()` -- used in 36 specs
- `waitLoadingDataPopUpIsNotDisplayed()` -- used in 36 specs
- `dragDSObjectToGridColumnSetDZ()` -- used in 28 specs
- `selectCellPadding()` -- used in 28 specs
- `pause()` -- used in 27 specs
- `getPage()` -- used in 26 specs
- `switchToEditorPanel()` -- used in 26 specs
- `switchToFormatPanelByClickingOnIcon()` -- used in 25 specs
- `goToPage()` -- used in 23 specs
- `changeViz()` -- used in 22 specs
- `clickColumnSizeFitOption()` -- used in 22 specs
- `addColumnSet()` -- used in 21 specs
- `clickContainerByScript()` -- used in 20 specs
- `simpleSort()` -- used in 20 specs
- `closeFormPopup()` -- used in 19 specs
- `log()` -- used in 19 specs
- `confirmOutlineGridCollapsed()` -- used in 18 specs
- `getContextMenuOption()` -- used in 18 specs
- `getObjectInColumnSetDropZone()` -- used in 18 specs
- `rightClick()` -- used in 17 specs
- `actionOnToolbar()` -- used in 16 specs
- `isContainerSelected()` -- used in 16 specs
- `selectContextMenuOptionFromElement()` -- used in 16 specs
- `getContainer()` -- used in 15 specs
- `resizeColumnByMovingBorder()` -- used in 15 specs
- `replace()` -- used in 14 specs
- `expandSpacingSection()` -- used in 13 specs
- `login()` -- used in 13 specs
- `clickRowSizeBtn()` -- used in 12 specs
- `clickRowSizeFitOption()` -- used in 12 specs
- `dragDSObjectToDZwithPosition()` -- used in 12 specs
- `handleError()` -- used in 12 specs
- `openDefaultApp()` -- used in 12 specs
- `selectFontStyle()` -- used in 11 specs
- `includes()` -- used in 10 specs
- `selectContextMenuOptionFromObjectinDZ()` -- used in 10 specs
- `switchToGridTab()` -- used in 10 specs
- `clickBuiltInColor()` -- used in 9 specs
- `createSubtotalsFromEditorPanel()` -- used in 9 specs
- `dragDSObjectToGridDZ()` -- used in 9 specs
- `getGridContainer()` -- used in 9 specs
- `selectGridColumns()` -- used in 9 specs
- `selectTextFont()` -- used in 9 specs
- `toString()` -- used in 9 specs
- `changeGridElement()` -- used in 8 specs
- `clickBtnOnMojoEditor()` -- used in 8 specs
- `clickColumnSizeTargetBtn()` -- used in 8 specs
- `clickColumnSizeTargetOption()` -- used in 8 specs
- `clickContextMenuButton()` -- used in 8 specs
- `copytoContainer()` -- used in 8 specs
- `movetoContainer()` -- used in 8 specs
- `openDossierByUrl()` -- used in 8 specs
- `rightClickOnHeader()` -- used in 8 specs
- `saveAndCloseSimThresholdEditor()` -- used in 8 specs
- `selectLineStyle()` -- used in 8 specs
- `selectNumberFormatFromDropdown()` -- used in 8 specs
- `setColumnSizeFixedInches()` -- used in 8 specs
- `clickFontColorBtn()` -- used in 7 specs
- `clickOnViz()` -- used in 7 specs
- `dismissColorPicker()` -- used in 7 specs
- `isContextMenuOptionPresentInHeaderCell()` -- used in 7 specs
- `openSimpleThresholdColorBandDropDownMenu()` -- used in 7 specs
- `selectSimpleThresholdColorBand()` -- used in 7 specs
- `takeScreenshotBySelectedViz()` -- used in 7 specs
- `changeCellsFillColor()` -- used in 6 specs
- `changeSegmentControl()` -- used in 6 specs
- `containerRelativePosition()` -- used in 6 specs
- `getColumnSetDropZone()` -- used in 6 specs
- `setRowSizeFixedInches()` -- used in 6 specs
- `simpleSaveDashboard()` -- used in 6 specs
- `sortWithinAttributeFromDropZone()` -- used in 6 specs
- `switchToTextFormatTab()` -- used in 6 specs
- `dragDSObjectToColumnSetDZwithPosition()` -- used in 5 specs
- `initializeColumnSets()` -- used in 5 specs
- `initializeRowAndColumnCount()` -- used in 5 specs
- `openThresholdEditorFromCompoundGridDropzone()` -- used in 5 specs
- `removeFromDropZone()` -- used in 5 specs
- `selectObjectFromBasedOnDropdown()` -- used in 5 specs
- `setDisplayAttributeFormNames()` -- used in 5 specs
- `showTotal()` -- used in 5 specs
- `changeVizToCompoundGrid()` -- used in 4 specs
- `clickOnContainerTitle()` -- used in 4 specs
- `getGridObjectOutline()` -- used in 4 specs
- `getObjectInDropZone()` -- used in 4 specs
- `renameColumnSet()` -- used in 4 specs
- `replaceObjectByName()` -- used in 4 specs
- `selectHorizontalLinesStyleButton()` -- used in 4 specs
- `selectTextAlign()` -- used in 4 specs
- `selectVerticalLinesStyleButton()` -- used in 4 specs
- `switchSection()` -- used in 4 specs
- `toBeGreaterThan()` -- used in 4 specs
- `clickOnCheckMarkOnFormatPreviewPanel()` -- used in 3 specs
- `clickOnNewQualificationEditorOkButton()` -- used in 3 specs
- `createCalculationFromEditorPanel()` -- used in 3 specs
- `deleteColumnSet()` -- used in 3 specs
- `doElementSelectionForAttributeFilter()` -- used in 3 specs
- `getRowObjectTexts()` -- used in 3 specs
- `getSegmentControlDropDownByCurrentSelection()` -- used in 3 specs
- `openFormatPreviewPanelByOrderNumber()` -- used in 3 specs
- `openNewThresholdCondition()` -- used in 3 specs
- `openOperatorDropDown()` -- used in 3 specs
- `saveAndCloseAdvancedThresholdEditor()` -- used in 3 specs
- `selectCellAlign()` -- used in 3 specs
- `selectGridSegment()` -- used in 3 specs
- `setTextFontSize()` -- used in 3 specs
- `toBeTruthy()` -- used in 3 specs
- `toggleNfThousandSeparator()` -- used in 3 specs
- `toggleShowTotalsFromMetric()` -- used in 3 specs
- `checkThresholdConditionByIndex()` -- used in 2 specs
- `clickCellFillColorBtn()` -- used in 2 specs
- `clickColorPickerModeBtn()` -- used in 2 specs
- `clickContainer()` -- used in 2 specs
- `clickOnChapter()` -- used in 2 specs
- `clickOnElement()` -- used in 2 specs
- `clickOnNewConditionEditorOkButton()` -- used in 2 specs
- `clickSaveOnAdvancedFilterEditor()` -- used in 2 specs
- `collapseOutlineFromColumnHeader()` -- used in 2 specs
- `createLink()` -- used in 2 specs
- `createLinkWithDefaultSettings()` -- used in 2 specs
- `createThresholdForMetric()` -- used in 2 specs
- `doSelectionOnChooseElementsByDropdown()` -- used in 2 specs
- `doSelectionOnOperatorDropdown()` -- used in 2 specs
- `dragMetricToDropZoneBelowObject()` -- used in 2 specs
- `expandCollapseColumnSet()` -- used in 2 specs
- `expandOutlineFromColumnHeader()` -- used in 2 specs
- `getCellInshowDataGrid()` -- used in 2 specs
- `getColumnSetObjectTexts()` -- used in 2 specs
- `getContainerImgOverlay()` -- used in 2 specs
- `getLinkFromGridCell()` -- used in 2 specs
- `isObjectFromDSdisplayed()` -- used in 2 specs
- `moveScrollBar()` -- used in 2 specs
- `multiSelectDisplayForms()` -- used in 2 specs
- `openAdvancedFilterEditor()` -- used in 2 specs
- `openAndSelectSimpleThresholdColorBand()` -- used in 2 specs
- `openChooseElementsByDropDown()` -- used in 2 specs
- `openDerivedObjectEditor()` -- used in 2 specs
- `openNewQualificationEditor()` -- used in 2 specs
- `openPageFromTocMenu()` -- used in 2 specs
- `openThresholdEditor()` -- used in 2 specs
- `openThresholdEditorFromViz()` -- used in 2 specs
- `reorderColumnSet()` -- used in 2 specs
- `saveMetric()` -- used in 2 specs
- `selectContextMenuOption()` -- used in 2 specs
- `selectMetricFilterOperatorByRank()` -- used in 2 specs
- `selectNfCurrencyPositionFromDropdown()` -- used in 2 specs
- `selectSimpleThresholdBasedOnOption()` -- used in 2 specs
- `selectSimpleThresholdBreakByObject()` -- used in 2 specs
- `selectWrapTextCheckbox()` -- used in 2 specs
- `setFillColor()` -- used in 2 specs
- `setMetricName()` -- used in 2 specs
- `sortDescending()` -- used in 2 specs
- `split()` -- used in 2 specs
- `switchToFormatPanel()` -- used in 2 specs
- `switchToGeneralSettingsTab()` -- used in 2 specs
- `switchToTab()` -- used in 2 specs
- `toBeGreaterThanOrEqual()` -- used in 2 specs
- `typeValueInput()` -- used in 2 specs
- `waitForDisplayed()` -- used in 2 specs
- `actionOnMenubarWithSubmenu()` -- used in 1 specs
- `applyButtonForSelectTarget()` -- used in 1 specs
- `cancelButtonForSelectTarget()` -- used in 1 specs
- `changeContainerBorder()` -- used in 1 specs
- `changeContainerFillColor()` -- used in 1 specs
- `changeContainerTitleFillColor()` -- used in 1 specs
- `changeToAnotherColumnSetAdvancedFilterEditor()` -- used in 1 specs
- `changeVizType()` -- used in 1 specs
- `checkAdvancedFilterByIndex()` -- used in 1 specs
- `clearSortFromDropZone()` -- used in 1 specs
- `clickCheckBox()` -- used in 1 specs
- `clickColumnSizeBtn()` -- used in 1 specs
- `clickMetricClearSort()` -- used in 1 specs
- `clickMetricSortAscending()` -- used in 1 specs
- `clickMetricSortDescending()` -- used in 1 specs
- `clickOnColumnSet()` -- used in 1 specs
- `clickOnMaximizeRestoreButton()` -- used in 1 specs
- `clickOnOptionOnTheFontButtonBar()` -- used in 1 specs
- `clickSectionTitle()` -- used in 1 specs
- `clickShowDataCloseButton()` -- used in 1 specs
- `closeShowDataDialog()` -- used in 1 specs
- `collapseOutlineFromElement()` -- used in 1 specs
- `createAttribute()` -- used in 1 specs
- `createDerivedAttribute()` -- used in 1 specs
- `createDerivedMetricUsingFormula()` -- used in 1 specs
- `createGroupsFromEditorPanel()` -- used in 1 specs
- `createMetric()` -- used in 1 specs
- `createSimpleObjectSelectorWithReplacement()` -- used in 1 specs
- `customCredentials()` -- used in 1 specs
- `dragAttributeToGridColumnSetDZ()` -- used in 1 specs
- `duplicateContainer()` -- used in 1 specs
- `duplicateContainerFromLayersPanel()` -- used in 1 specs
- `editCalculationGroup()` -- used in 1 specs
- `excludeElement()` -- used in 1 specs
- `expandOutlineFromElement()` -- used in 1 specs
- `expandTemplateSection()` -- used in 1 specs
- `getAttributeFormDefinition()` -- used in 1 specs
- `getDatasetRowCount()` -- used in 1 specs
- `getFunctionSelectioninPopupList()` -- used in 1 specs
- `getMojoEditorWithTitle()` -- used in 1 specs
- `getObjectFromDataset()` -- used in 1 specs
- `getSourceButton()` -- used in 1 specs
- `getSourceIconInLayersPanel()` -- used in 1 specs
- `getTargetButton()` -- used in 1 specs
- `getTargetIconInLayersPanel()` -- used in 1 specs
- `getVisualizationTitleBarRoot()` -- used in 1 specs
- `getWindowSize()` -- used in 1 specs
- `goToLibrary()` -- used in 1 specs
- `groupElementsToAverageCalculation()` -- used in 1 specs
- `keepOnly()` -- used in 1 specs
- `openAttributeThresholdsEditor()` -- used in 1 specs
- `openColumnSetPullDown()` -- used in 1 specs
- `openContextMenu()` -- used in 1 specs
- `openFontColorDropdownMenu()` -- used in 1 specs
- `openFontSizeDropdownMenu()` -- used in 1 specs
- `openShowDataDiagFromViz()` -- used in 1 specs
- `removeObjectFromDropZone()` -- used in 1 specs
- `removeObjectInColumnSet()` -- used in 1 specs
- `reOrderObjectsInColumnSet()` -- used in 1 specs
- `resetDossierIfPossible()` -- used in 1 specs
- `rightClickOnElement()` -- used in 1 specs
- `rightClickOnGridElement()` -- used in 1 specs
- `saveAttribute()` -- used in 1 specs
- `saveInMyReport()` -- used in 1 specs
- `selectCellBorderOrientation()` -- used in 1 specs
- `selectColumnSet(menuOption)` -- used in 1 specs
- `selectContextMenuOptionFromHeader()` -- used in 1 specs
- `selectContextSubMenuOptionFromHeader()` -- used in 1 specs
- `selectElementOnViz()` -- used in 1 specs
- `selectFontColorByColorName()` -- used in 1 specs
- `selectFontSizeBySizeNumber()` -- used in 1 specs
- `selectFromLinkBarAttributeMetricSelector()` -- used in 1 specs
- `selectGridTemplateColor()` -- used in 1 specs
- `selectHorizontalLinesColorButton()` -- used in 1 specs
- `selectTargetVisualizations()` -- used in 1 specs
- `selectVerticalLinesColorButton()` -- used in 1 specs
- `selectViz()` -- used in 1 specs
- `setAttributeFormDefinition()` -- used in 1 specs
- `setAttributeName()` -- used in 1 specs
- `setWindowSize()` -- used in 1 specs
- `sortAscendingFromDropZone()` -- used in 1 specs
- `sortAscendingFromViz()` -- used in 1 specs
- `switchMode()` -- used in 1 specs
- `switchToTitleAndContainerSection()` -- used in 1 specs
- `validateForm()` -- used in 1 specs

## Source Coverage

- `pageObjects/compoundGrid/**/*.js`
- `specs/regression/compoundGrid/**/*.{ts,js}`
- `specs/regression/config/compoundGrid/**/*.{ts,js}`
