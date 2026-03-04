# Site Knowledge: Ag Grid Domain

## Overview

- **Domain key:** `agGrid`
- **Components covered:** AgGridVisualization, DashboardSubtotalsEditor, DatabarConfigDialog, MicrochartConfigDialog
- **Spec files scanned:** 46
- **POM files scanned:** 4

## Components

### AgGridVisualization
- **CSS root:** `.mstrmojo-ui-MenuEditor.displayForms`
- **User-visible elements:**
  - Column Limit Editor (`.mstrmojo-ui-MenuEditor.displayForms`)
- **Component actions:**
  - `addColumnSet()`
  - `addMicrochartSet()`
  - `applyIncrementalFetchSuggestedValue()`
  - `cancelAndCloseMoreOptionsDialog()`
  - `changeSubtotalPosition(cellToClick, newPosition, visualizationName, isHeader)`
  - `clearSortBySortIcon(elementName, visualizationName)`
  - `clickButtonInColumnLimitEditor(btn)`
  - `clickOnAGGridCell(elementName, visualizationName)`
  - `clickOnAGGridCells(elementNames, visualizationName)`
  - `clickOnColumnHeaderElement(elementName, visualizationName)`
  - `clickOnColumnHeaderElementTextArea(elementName, visualizationName)`
  - `clickOnSecondaryContextMenu(submenu)`
  - `clickOnSubMenuItem(menuItem, subMenuItem)`
  - `clickSaveButtonOnGroup()`
  - `clickSetColumnLimitLabel()`
  - `clickSortIcon(sortOrder)`
  - `collapseGroupCell(el)`
  - `collapseRA(elementName, visualizationName)`
  - `collapseRAOnColumnHeader(headerName, visualizationName)`
  - `doubleClickOnAGGridCells(elementNames, visualizationName, waitForLoadingDialog)`
  - `dragDSObjectToAGGridWithPositionInColumnHeader(objectName, objectTypeName, datasetName, desPosition, elementInRow, vizName)`
  - `dragDSObjectToAGGridWithPositionInRow(objectName, objectTypeName, datasetName, desPosition, elementInRow, vizName)`
  - `dragHeaderCellToCol(objectToDrag, position, targetHeader)`
  - `dragHeaderCellToRow(objectToDrag, position, targetHeader)`
  - `drillfromAttributeElement(elementName, drillToItem, visualizationName)`
  - `drillfromAttributeHeader(attributeName, drillToItem, visualizationName)`
  - `expandGroupCell(el)`
  - `expandRA(elementName, visualizationName)`
  - `expandRAOnColumnHeader(headerName, visualizationName)`
  - `function(input)`
  - `getAGGridLoadingIcon()`
  - `getCellAlignment(cell)`
  - `getColumnsCount(isLeftPinArea, visualizationName)`
  - `getFirstOrLastPinnedColumn(isLeftPinArea, visualizationName)`
  - `getFirstOrLastPinnedColumns(isLeftPinArea, visualizationName)`
  - `getGridCellCollapseIconByPos(row, col, visualizationName)`
  - `getGridCellExpandIconByPos(row, col, visualizationName)`
  - `getGridCellIconByPos(row, col, iconName, visualizationName)`
  - `getGridCellStyle(row, col, visualizationName, style)`
  - `getGridCellStyleByCols(rowStart, rowEnd, col, style)`
  - `getGridCellStyleByPos(row, col, style)`
  - `getGridCellStyleByRows(colStart, colEnd, row, style)`
  - `getGridCellTextByPos(row, col, visualizationName)`
  - `getGridCellTextByPosition(row, col, visualizationName)`
  - `getPinnedAreaIndicator(isLeftPinArea, visualizationName)`
  - `getRowIndexByCellText(cellText, visualizationName)`
  - `hoverIncrementalFetchHelpIcon()`
  - `hoverOnAGGridCell(elementName, visualizationName)`
  - `isAgGridCellHasTextDisplayed(row, col, visualizationName, text)`
  - `isCellInGridDisplayed(cellText, visualizationName)`
  - `isContextMenuOptionPresentInHeaderCell(menuOption, cellText, visualizationName)`
  - `isPinIndicatorVisible(pinArea, visualization)`
  - `metricSortFromAgGrid(objectName, visualizationName, order)`
  - `moveAttributeFormColumnToLeftFromContextMenu(row, col, visualizationName)`
  - `moveAttributeFormColumnToRightFromContextMenu(row, col, visualizationName)`
  - `moveHorizontalScrollBar(direction, pixels, vizName)`
  - `moveObjectToAGGridWithPositionInRow(objectName, desPosition, elementInRow, vizName)`
  - `moveVerticalScrollBar(direction, pixels, vizName)`
  - `moveVerticalScrollBarToBottom(vizName, pos)`
  - `openAndClickSubMenuItemForElement(el, menuItem, subMenuItem)`
  - `openContextMenuItemForCellAtPosition(row, col, menuItem, visualizationName, waitForLoadingDialog = true)`
  - `openContextMenuItemForDZUnit(elementName, elementType, setName, menuItem)`
  - `openContextMenuItemForHeader(elementName, menuItem, visualizationName)`
  - `openContextMenuItemForHeaders(elementNames, menuItem, visualizationName)`
  - `openContextMenuItemForValue(elementName, menuItem, visualizationName, waitForLoadingDialog = true)`
  - `openContextMenuItemForValues(elementNames, menuItem, visualizationName)`
  - `openContextSubMenuItemForCell(elementName, menuItem, subMenuItem, visualizationName)`
  - `openContextSubMenuItemForElement(el, menuItem, subMenuItem)`
  - `openContextSubMenuItemForHeader(elementName, menuItem, subMenuItem, visualizationName)`
  - `openMenuItem(elementName, menuItem, visualizationName)`
  - `openMoreOptionsDialog(visualizationName)`
  - `openRMCMenuForCellAtPosition(row, col, visualizationName)`
  - `openRMCMenuForCellAtPositionAndSelectFromCM(row, col, visualizationName, option)`
  - `openRMCMenuForMicrochartAtPositionAndSelectFromCM(row, col, visualizationName, option)`
  - `openRMCMenuForValue(elementName, visualizationName)`
  - `openThresholdEditorFromViz(objectName, visualizationName)`
  - `resizeAgColumnByMovingBorder(colIndex, pixels, direction, vizName)`
  - `rightMouseClickOnElement(elem)`
  - `RMConColumnHeaderElement(elementName, visualizationName)`
  - `saveAndCloseMoreOptionsDialog()`
  - `scrollHorizontally(direction, pixels, vizName)`
  - `scrollHorizontallyToNextSlice(number, vizName)`
  - `scrollToGridCell(visualizationName, elementName)`
  - `scrollVertically(direction, pixels, vizName)`
  - `scrollVerticallyDownToNextSlice(number, vizName)`
  - `scrollVerticallyToBottom(vizName)`
  - `scrollVerticallyToMiddle(vizName)`
  - `selectGroupHeaderUsingShift(elements_1, elements_2, menuItem, visualizationName)`
  - `selectMultipleElements(elements, visualizationName, waitForLoadingDialog = true)`
  - `setColumnLimitInputBox(minOrMax, txt)`
  - `setIncrementalFetchValue(value)`
  - `sortAscendingBySortIcon(elementName, visualizationName)`
  - `sortDescendingBySortIcon(elementName, visualizationName)`
  - `toggleShowTotalsByContextMenu(visualizationName)`
  - `toggleShowTotalsFromAttribute(objectName, visualizationName, subtotalOptions)`
  - `toggleShowTotalsFromMetric(objectName, visualizationName)`
  - `waitForAgGridLoadingIconNotDisplayed()`
- **Related components:** datasetPanel, datasetsPanel, dossierPage, getContainer

### DashboardSubtotalsEditor
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickAddCustomSubtotalButton()`
  - `clickButton(label)`
  - `clickSubtotalSelector(metricName)`
  - `closeSubtotalEditorByCancel()`
  - `customSubtotalsClickButton(label)`
  - `editCustomSubtotal()`
  - `expandAcrossLevelSelector(type)`
  - `hoverOverCustomSubtotalOptions(customSubtotalName)`
  - `removeCustomSubtotal()`
  - `renameCustomSubtotalsName(newName)`
  - `saveAndCloseSubtotalEditor()`
  - `selectAllAttributesAcrossLevel()`
  - `selectAttributeAcrossLevel(attribute)`
  - `selectTypeCheckbox(type)`
  - `setSubtotalTypeTo(metricName, subtotalType)`
  - `waitForSubtotalEditorVisible()`
- **Related components:** _none_

### DatabarConfigDialog
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `changeDropdown(label, newOption)`
  - `clickBtn(btnTxt)`
  - `clickCheckboxbyLabel(label)`
  - `clickColorPicker(positiveORnegative)`
  - `dataBarDialogTitleIsDisplayed(title)`
  - `isCheckboxchecked(label)`
  - `isDatabarDialogOpened()`
  - `isMinMaxInputDisabled(minORmax)`
  - `isMinMaxInputInvalid(minORmax)`
  - `typeMinMaxValue(minORmax, value)`
  - `verfiyPulldownCurrSelection(label, option)`
- **Related components:** _none_

### MicrochartConfigDialog
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `cancelDialog()`
  - `confirmDialog()`
  - `renameChart(name)`
  - `selectObject(pulldownIndex, optionText)`
  - `selectType(type)`
- **Related components:** _none_

## Common Workflows (from spec.ts)

1. Pin/Freeze in AG Grid (used in 2 specs)
2. [AG Grid Fit To Mode] (used in 1 specs)
3. [AG Grid Sort] (used in 1 specs)
4. [AG Grid Subtotals] (used in 1 specs)
5. [BCED-2391] Freeze up to the column cannot work for OP (used in 1 specs)
6. [BCED-3720] Hide column cannot work for OP (used in 1 specs)
7. [BCED-6359] Freeze up to a column with merged cell column header, then hide another column, the freeze indicator is gone (used in 1 specs)
8. [BCIN-5272] Validate should not show ellipsis during vertical scroll (used in 1 specs)
9. [BCIN-5279] Scroll bar is disappearing in Advanced Filter Editor when it has multiple Column Sets with multiple qualifications (used in 1 specs)
10. [BCIN-5281] Column header should be merged for multiple form attribute (used in 1 specs)
11. [BCIN-5338]The column context menu cannot work well after do manipulation on aggrid (used in 1 specs)
12. [BCIN-5689_01]Support wrap in outline compact mode (used in 1 specs)
13. [BCIN-5689_02]Support wrap in outline standard mode (used in 1 specs)
14. [BCIN-5724] The dataset info should show in the tooltip in editor panel (used in 1 specs)
15. [BCIN-5725] Can not resize/pin/freeze/hide individual form column (used in 1 specs)
16. [BCIN-5765] Merge cell for NDE when have multiple form attribute (used in 1 specs)
17. [BCIN-5812] The ag grid format is not correct (random) (used in 1 specs)
18. [BCIN-5877] You have included an invalid argument error when using Modern Grid xfunc with object parameter (used in 1 specs)
19. [BCIN-5929] The width of microchart get bigger and bigger during vertical scroll in fit to content mode (used in 1 specs)
20. [BCIN-5938] Cannot scroll horizontally to the far right in fit to content mode (used in 1 specs)
21. [BCIN-6326] The ag grid keep loading when there is no metric and uncheck row header (used in 1 specs)
22. [BCIN-6387] Incorrect row height after enable subtotal, grid values are truncated (used in 1 specs)
23. [BCIN-6501] Incorrect filtering criteria in dashboard when using metric as info window selector (used in 1 specs)
24. [BCIN-6516] Cannot sort by a single form in AG grid when display attribute form names off (used in 1 specs)
25. [BCIN-6529] Hide move left/right menu for column header with multiple attribute form and set names off (used in 1 specs)
26. [BCIN-6532] Cannot set column width limit for a single form in AG grid when display attribute form names off (used in 1 specs)
27. [BCIN-6560] Ag grid focus border for keyboard navigation (used in 1 specs)
28. [BCIN-6577] Validate should not show ellipsis during horizontal scroll (used in 1 specs)
29. [BCIN-6594] Weird values instead of null values are displayed in a Grid (Modern) dashboard (used in 1 specs)
30. [BCIN-6663] Column Value Color Reverts to Black When Moving Columns in Modern Grid (used in 1 specs)
31. [BCIN-6696_01] Validate AG Grid layout in fit to container mode (used in 1 specs)
32. [BCIN-6696_02] Validate AG Grid layout in fit to content mode (used in 1 specs)
33. [BCIN-6696_03] Validate AG Grid layout in fixed column width mode (used in 1 specs)
34. [BCIN-6754] The negative databar cannot display well when set number format as red ones (used in 1 specs)
35. [BCIN-6925] Validate the column width should be correct when html tag is disabled (used in 1 specs)
36. [BCIN-7125] Link Derived Attribute should support wrap in fit to container/content mode (used in 1 specs)
37. [BCIN-7153] The column width is longer than needed when set number format as red ones (used in 1 specs)
38. [BCIN-7222] HTML tag should support wrap in fit to container/content mode (used in 1 specs)
39. [BCIN-7327] Column header is cut off in outline mode. (used in 1 specs)
40. [BCIN-7338] Resize the 2nd layer column header should be kept (used in 1 specs)
41. [E2E_AGGrid_CustomSubtotal] (used in 1 specs)
42. [TC2710_1] should handle Advanced Sort in AG Grid (used in 1 specs)
43. [TC2710_2] should handle Advanced Sort in AG Grid (step 13) (used in 1 specs)
44. [TC3156_1] Apply modern grid incremental fetch suggestion_Column set (used in 1 specs)
45. [TC3156_2] Apply modern grid incremental fetch suggestion_Microchart (used in 1 specs)
46. [TC3156_3] Apply modern grid incremental fetch suggestion_UndoRedo (used in 1 specs)
47. [TC5487] Hide/Show Null or Zero for Grid (used in 1 specs)
48. [TC6337_1] Validate custom subtotal on modern grid with column sets (used in 1 specs)
49. [TC6337_2] Validate custom subtotal on modern grid with microcharts (used in 1 specs)
50. [TC6337_3] Validate custom subtotal on modern grid with dda dataset (used in 1 specs)
51. [TC6337_4] Validate custom subtotal on modern grid with MDX (used in 1 specs)
52. [TC6337_5] Validate undo and redo on subtotal editor (used in 1 specs)
53. [TC65147_1] Validate Sort Within and Subtotals in AG Grid (used in 1 specs)
54. [TC65147_2] Validate Sort Within and Subtotals in AG Grid (used in 1 specs)
55. [TC65147_3] Validate Sort Within and Subtotals in AG Grid on Page 3 (used in 1 specs)
56. [TC65149_1] Validate metric Sort by All Values/Subtotals in AG Grid (used in 1 specs)
57. [TC65149_2] Validate metric Sort by All Values/Subtotals in AG Grid (used in 1 specs)
58. [TC65149_3] Validate sorting and subtotals in AG Grid (used in 1 specs)
59. [TC71081] Creating AG grid with value sets and microcharts | Acceptance (used in 1 specs)
60. [TC71082_1] should handle sorting in AG Grid (used in 1 specs)
61. [TC71082_2] should handle sorting in AG Grid with Freeform Layout (used in 1 specs)
62. [TC71082] AG Grid Sort - Standard sorting operations (used in 1 specs)
63. [TC71084] Manipulation on thresholds editor in AG-grid (used in 1 specs)
64. [TC71085_1] Show data in modern grid (AG) Acceptance - basic column set and Microchart (used in 1 specs)
65. [TC71085_2] Show data in modern grid (AG) Acceptance - Trendbar and Bullet chart (used in 1 specs)
66. [TC71085_3] Data display when scrolling in show data dialog (used in 1 specs)
67. [TC71086_1] Format panel (fill color) Column Headers (used in 1 specs)
68. [TC71086_2] Sanity test for Ag Grid Format Panel_General Setting, Title and Container, Row Headers. (used in 1 specs)
69. [TC71087_02] BCIN-3790 attributes containing HTML tags in AG Grid (used in 1 specs)
70. [TC71087] Validating enabling, moving attribute forms in AG Grid | Acceptance (used in 1 specs)
71. [TC71088_01] Validate Incremental Fetch in Microcharts authoring and consumption modes - Acceptance 1 (used in 1 specs)
72. [TC71088_02] Validate Incremental Fetch in Microcharts authoring and consumption modes - Acceptance 2 (used in 1 specs)
73. [TC71088_03] Validate Incremental Fetch in Microcharts authoring and consumption modes - Acceptance 3 (used in 1 specs)
74. [TC71089_1] Copy a single cell and verify the content (used in 1 specs)
75. [TC71089_10] Copy Rows with single column set - Multiple rows are selected (used in 1 specs)
76. [TC71089_11] Copy Rows with multiple column sets - One row is selected (used in 1 specs)
77. [TC71089_12] Copy Rows with multiple column sets - Multiple rows are selected (used in 1 specs)
78. [TC71089_13] Copy Cell - Only one cell is selected (used in 1 specs)
79. [TC71089_14] Copy Cells - Multiple cells are selected in the same row (used in 1 specs)
80. [TC71089_15] Copy Cells - Multiple cells are selected in different rows (used in 1 specs)
81. [TC71089_16] Copy Cells - Multiple cells are selected in different rows from Metric (used in 1 specs)
82. [TC71089_17] Copy Rows with Headers - Single row is selected (used in 1 specs)
83. [TC71089_18] Copy Rows with Headers - Multiple rows are selected (used in 1 specs)
84. [TC71089_19] Copy Rows with Headers - Single row with multiple column sets (used in 1 specs)
85. [TC71089_2] Copy multiple cells in different rows and verify the content (used in 1 specs)
86. [TC71089_20] Copy Rows with Headers - Multiple rows with multiple column sets (used in 1 specs)
87. [TC71089_21] Copy Cells - via Ctrl C (used in 1 specs)
88. [TC71089_3] Copy multiple cells in different rows and verify the content (used in 1 specs)
89. [TC71089_4] Copy Cells - Multiple cells are selected which are in different rows from Metric (used in 1 specs)
90. [TC71089_5] Copy a single cell with header and verify the content (used in 1 specs)
91. [TC71089_6] Copy multiple cells in the same row with headers and verify the content (used in 1 specs)
92. [TC71089_7] Copy multiple cells in different rows with headers and verify the content (used in 1 specs)
93. [TC71089_8] Copy multiple cells in different rows from Metric with headers and verify the content (used in 1 specs)
94. [TC71089_9] Copy Rows with single column set - One row is selected (used in 1 specs)
95. [TC71090_01] Validate Standard Outline Mode - Acceptance (used in 1 specs)
96. [TC71095] Validating enabling, moving attribute forms in AG Grid (used in 1 specs)
97. [TC71096] Manipulation on thresholds format editor - metrics (simplified) (used in 1 specs)
98. [TC71097] Functional validation of Show Data in Modern (AG) Grid authoring and consumption modes | Regression (used in 1 specs)
99. [TC71098_1] Functional validation of Formatting in Modern (AG) Grid Microcharts authoring and consumption modes (used in 1 specs)
100. [TC71098_4] BCSA-2417 Grid Columns Disappear When Adjusting Width of Other Columns (used in 1 specs)
101. [TC71099] Functional validation of Attribute Forms in Microcharts authoring and consumption modes (used in 1 specs)
102. [TC71100_01] Functional validation of Incremental Fetch in Microcharts authoring and consumption modes - Scenario 1 (used in 1 specs)
103. [TC71100_02] Functional validation of Incremental Fetch in Microcharts authoring and consumption modes - Scenario 2 (used in 1 specs)
104. [TC71100_03] Functional validation of Incremental Fetch in Microcharts authoring and consumption modes - Scenario 3 (used in 1 specs)
105. [TC71102_01] Validate Standard Outline Mode - Regression in Edit Mode (3 Attributes) (used in 1 specs)
106. [TC71102_02] Validate Standard Outline Mode - Regression in Edit Mode (Freeform layout + 4 Attributes) (used in 1 specs)
107. [TC71102_03] Validate Standard Outline Mode - Regression in Presentation Mode (used in 1 specs)
108. [TC71102_04] Validate Standard Outline Mode - Regression (Attribute forms in rows and Subtotal in Columns) (used in 1 specs)
109. [TC71102_05] Convert from Modern Grid with outline mode to Simple Grid (used in 1 specs)
110. [TC71102_06] Convert from Modern Grid with outline mode to Compound Grid (used in 1 specs)
111. [TC71102_07] Convert from Modern Grid with outline mode to bar chart (used in 1 specs)
112. [TC71102_08] AG grid with custom groups to outline mode | Regression (used in 1 specs)
113. [TC71102_09] Validate Standard Outline Mode - Regression (Attribute forms in columns) (used in 1 specs)
114. [TC71102_10] DE332214 BF-314 Outline modern grid and set to fit to container in authoring and consumption mode (used in 1 specs)
115. [TC71102_11] DE332214 Outline modern grid and set to fit to content in authoring and consumption mode (used in 1 specs)
116. [TC71106] End to End Modern Grid validation - converting existing dossier visualizations to Modern (AG)Grid (used in 1 specs)
117. [TC71122_01] Converting to/from Ag-grid - Bar chart (used in 1 specs)
118. [TC71122_02] Converting to/from Ag-grid - Map (used in 1 specs)
119. [TC71122_03] Converting to/from Ag-grid - Custom viz Sankey (used in 1 specs)
120. [TC71123_01] Grid 1 with attributes in rows and metrics and attributes in column sets (more than one) (used in 1 specs)
121. [TC71123_02] Grid 4 Attributes in rows and metrics only in column sets (used in 1 specs)
122. [TC71124] Functional validation of derived metrics in Modern(AG) Grid Microcharts authoring and consumption modes (used in 1 specs)
123. [TC71125] Validating creating MicroCharts authoring - Acceptance (used in 1 specs)
124. [TC71126_01] Validating creating MicroCharts authoring - Regression: create ag grid with microChart and convert to compound grid (used in 1 specs)
125. [TC71126_02] Validating MicroCharts authoring - Regression: Convert AG Grid to other viz type (used in 1 specs)
126. [TC71126_03] Validating MicroCharts authoring - Regression: Convert other viz type to AG Grid (used in 1 specs)
127. [TC71126_04] DE255130 AG Grid | The column set got removed when try to drag object from Editor Panel to dataset (used in 1 specs)
128. [TC73484] Advanced sort to attribute calculation DE does not cause errors (used in 1 specs)
129. [TC75412_1] Creating AG grid with value sets and microcharts | Regression (used in 1 specs)
130. [TC75412_10] Modern Grid with outline mode in pause mode (used in 1 specs)
131. [TC75412_11] Validate Compact Outline mode in MicroCharts grid (used in 1 specs)
132. [TC75412_12] Validate Compact Outline Mode Expand All/Collapse All (used in 1 specs)
133. [TC75412_13] Compact Outline mode (Other steps not covered by TC75411/regression above -- expand/collapse state dont persist yet (used in 1 specs)
134. [TC75412_2] Converting normal grid with outline mode to Modern Grid (used in 1 specs)
135. [TC75412_3] Converting compound grid with outline mode to Modern Grid (used in 1 specs)
136. [TC75412_4] Convert from Modern Grid with outline mode to Simple Grid (used in 1 specs)
137. [TC75412_5] Convert from Modern Grid with outline mode to Compound Grid (used in 1 specs)
138. [TC75412_6] Convert from Modern Grid with outline mode to bar chart (used in 1 specs)
139. [TC75412_7] Multiple attribute forms in Modern Grid with outline mode (used in 1 specs)
140. [TC75412_8] Modern Grid with outline mode in authoring mode (used in 1 specs)
141. [TC75412_9] Modern Grid with outline mode in freeform layout (used in 1 specs)
142. [TC76157] Validate Subtotals for AG Grid with 3 Attributes in Rows and 2 Metrics in Columns (used in 1 specs)
143. [TC76159_1] Validate Subtotals for Multiple Attributes in AG Grid (used in 1 specs)
144. [TC76159_2] Validate Attributes and Subtotals in AG Grid (used in 1 specs)
145. [TC76159_3] Validate Calculation Methods and Attribute Forms in AG Grid (used in 1 specs)
146. [TC76159_4] Validate subtotals edit entry (used in 1 specs)
147. [TC76159_5] Validate add/edit/delete Custom Subtotal for Multiple Attributes in AG Grid (used in 1 specs)
148. [TC76159_6] Validate show/hide/move to bottom Custom Subtotal in consumption mode (not outline) (used in 1 specs)
149. [TC76159_7] Validate show/hide/move to bottom Custom Subtotal in consumption mode (outline) (used in 1 specs)
150. [TC76159_8] Validate Custom Subtotal x-func with formatting in AG Grid (used in 1 specs)
151. [TC76159_9] Validate Subtotal Edit privilege check (used in 1 specs)
152. [TC76160_1] Drill in AG Grid, replacing the attribute (used in 1 specs)
153. [TC76229] AG Grid - Advanced Sort - Advanced sort only exposed on AG Grid (used in 1 specs)
154. [TC76230] AG Grid - Advanced Sort - Advanced Sort only appear when less than two column set (used in 1 specs)
155. [TC76231] AG Grid - Advanced Sort - Advanced Sort only accessible from grid header (used in 1 specs)
156. [TC76232] AG Grid - Advanced Sort - Sort on Rows tab (used in 1 specs)
157. [TC76233] AG Grid - Advanced Sort - Sort on Columns tab (used in 1 specs)
158. [TC76234] AG Grid - Advanced Sort - Manipulation on sort (used in 1 specs)
159. [TC76235] AG Grid - Advanced Sort - Xfunc with different grid template (used in 1 specs)
160. [TC76246] AG Grid - Advanced Sort - Xfunc with different grid format (used in 1 specs)
161. [TC76247] AG Grid - Advanced Sort - Sort on derived attributes (used in 1 specs)
162. [TC76248] AG Grid - Advanced Sort - Sort on derived metrics (used in 1 specs)
163. [TC76249] AG Grid - Advanced Sort - Sort on group (used in 1 specs)
164. [TC76258] AG Grid - Advanced Sort - Sort on consolidation (used in 1 specs)
165. [TC76259] AG Grid - Advanced Sort - Sort on custom group (used in 1 specs)
166. [TC76260] AG Grid - Advanced Sort - XFunc with normal sort (used in 1 specs)
167. [TC76262]AG Grid - Advanced Sort - Long sort item list (used in 1 specs)
168. [TC76351] AG Grid - Advanced Sort - Generate new cache when open advanced sort (used in 1 specs)
169. [TC79709_1] Duplicate/Move AG grid visualizations within chapter (used in 1 specs)
170. [TC79709_2] Duplicate/Move AG grid visualizations to other chapters (used in 1 specs)
171. [TC79709_3] Copy AG grid visualizations in existing chapter (used in 1 specs)
172. [TC79709_4] Copy AG grid visualizations to other chapter (used in 1 specs)
173. [TC79710_1] cover remaining cases for duplicate/copy/move for Ag Grid (used in 1 specs)
174. [TC79710_2] cover remaining cases for duplicate/copy/move for Ag Grid (used in 1 specs)
175. [TC79710_3] cover remaining cases for duplicate/copy/move for Ag Grid (used in 1 specs)
176. [TC80450] Validating enabling, moving attribute forms in AG Grid | Acceptance (used in 1 specs)
177. [TC80795_02] Validate relative path image in Thresholds BCEM-3214 | Acceptance (used in 1 specs)
178. [TC80795] Validate Thresholds in Rows for Modern (AG) Grid authoring and consumption modes | Acceptance (used in 1 specs)
179. [TC81929] Grid | AG Grid used as Info Window (used in 1 specs)
180. [TC88592] Sanity - Special number formatting for SSN, telephone and zipcode in Ag Grid (used in 1 specs)
181. [TC88597] Special number formatting for SSN, telephone and zipcode in Ag Grid | X-Functionality (used in 1 specs)
182. [TC88602] Ag grid Borders formatting, adding up, down, left and right; hair and double types (used in 1 specs)
183. [TC88963_1] Verify Ag grid Borders formatting on consumption mode (used in 1 specs)
184. [TC88963_2] Ag grid Borders formatting, xfun (used in 1 specs)
185. [TC89029] Modern Grid and Show data dialog | Support rearranging columns by DnD columns headers and between Rows, Columns in the Grid (used in 1 specs)
186. [TC89080] Grouping test in AG-grid (used in 1 specs)
187. [TC89552] Creating ag-grid with enabled banding | Regression (used in 1 specs)
188. [TC94223_1] Pin columns in modern grid (used in 1 specs)
189. [TC94223_2] Freeze columns in modern grid (used in 1 specs)
190. [TC94224_1] should validate lock, pin, and freeze functionality in AG Grid (used in 1 specs)
191. [TC94224_2] should handle pinning, freezing, and attribute forms in AG Grid (used in 1 specs)
192. [TC94224_3] should handle pin/freeze attribute forms cases in AG Grid (used in 1 specs)
193. [TC94224_4] should validate that pin/freeze is not supported in outline mode in AG Grid (used in 1 specs)
194. [TC94224_5] should handle pin/freeze conversion between normal, compound, and AG grid (used in 1 specs)
195. [TC94224_6] should handle freezing, excluding, and keeping only columns in AG Grid (used in 1 specs)
196. [TC94224_7] should handle pinning, freezing, and replacing objects in AG Grid (used in 1 specs)
197. [TC94227_1] should pin and unpin columns in AG Grid in consumption mode (used in 1 specs)
198. [TC94227_2] should freeze, keep only, exclude, and unfreeze columns in AG Grid in Consumption mode (used in 1 specs)
199. [TC95080] sanity test on set min/max column size, reset column width (used in 1 specs)
200. [TC95081_01] regression case: when all the columns reach their minimum limits, generate a horizontal scrollbar and layout is still fit to container (used in 1 specs)
201. [TC95081_02] regression case: when all the columns reach their max limits, there might be white space at the end, layout is still fit to container (used in 1 specs)
202. [TC95081_03] regression x-fun cases (used in 1 specs)
203. [TC95081_04] Change column width should be persist after saving and reopening (used in 1 specs)
204. [TC95907] Chapter Level ACL E2E (used in 1 specs)
205. [TC97778_01] Column/unit level formatting E2E (used in 1 specs)
206. [TC97778_02] DE319997 grid cell hover/select color (used in 1 specs)
207. [TC97778_03] DE323462 fit content should work when change font size for attribute or metric (used in 1 specs)
208. [TC98727_1] sanity test on hide column (used in 1 specs)
209. [TC98727_2] hide column of crosstab and microchart (used in 1 specs)
210. [TC98727_3] Xfun on hide column (used in 1 specs)
211. [TC98745] Sanity create data bar in Ag grid (used in 1 specs)
212. [TC98746] Regression create and config data bar in Ag grid (used in 1 specs)
213. [TC99056_01] sanity test on single xtab grid (used in 1 specs)
214. [TC99056_02] sanity test on multi xtab grid (used in 1 specs)
215. [TC99056_1] Validate Hide column E2E user journey - Multiple Attribute Forms (used in 1 specs)
216. [TC99056_2] Validate Hide column E2E user journey - Different type of elements (used in 1 specs)
217. [TC99056_3] Validate Hide column E2E user journey - Hide column with Attribute link (used in 1 specs)
218. [TC99056_4] Validate Hide column E2E user journey - Hide Column is disabled for outline mode (used in 1 specs)
219. [TC99056_5] Validate Hide column E2E user journey - Hide Column with Threshold (used in 1 specs)
220. [TC99056_6] Validate Hide column E2E user journey - Hide PIN Column (used in 1 specs)
221. [TC99057_1] Keep Formatting and Sort after drilling (used in 1 specs)
222. [TC99057_2] Disable drilling if grid contains Object Parameter (used in 1 specs)
223. [TC99058_1] Modern Grid Drill with DDA and microchart_consumption (used in 1 specs)
224. [TC99058_2] Modern Grid Drill with DDA and microchart_authoring (used in 1 specs)
225. [TC99325_1] Enable Wrap for Entire Grid (used in 1 specs)
226. [TC99325_2] Enable Wrap for Row Header and Column Headers (used in 1 specs)
227. [TC99325_3] Wrap is kept after manipulations (used in 1 specs)
228. [TC99325_4] Verify Wrap for x-tab grid with microchart (used in 1 specs)
229. [TC99340_01] Verify Modern Grid Support MDX in Comsumption - Apply Filter (used in 1 specs)
230. [TC99340_02] Verify Modern Grid Support MDX in Comsumption - Expand All Levels, Expand All Lower Levels (used in 1 specs)
231. [TC99340_03] Verify Modern Grid Support MDX in Comsumption - Keep Only (used in 1 specs)
232. [TC99340_04] Verify Modern Grid Support MDX in Comsumption - Exclude (used in 1 specs)
233. [TC99340_05] Verify Modern Grid Support MDX in Comsumption - Format (used in 1 specs)
234. [TC99340_06] Verify Modern Grid Support MDX in authoring - Disabled entry (used in 1 specs)
235. [TC99372_1] Merge cell for row header and wrap text in authoring mode (used in 1 specs)
236. [TC99372_2] Merge cell for row header and wrap text in consumption mode (used in 1 specs)
237. [TC99424_01] Missing font dialog should pop up when enter authoring mode for a dashboard using monotype font (used in 1 specs)
238. [TC99424_02] Missing font dialog should not pop up when feature flag is on (used in 1 specs)
239. [TC99424_03] Missing font dialog should not pop up when editing a dashboard without monotype font (used in 1 specs)
240. [TC99424_04] Missing font warning in format panel font picker (used in 1 specs)
241. [TC99424_05] Missing font warning in threshold font picker (used in 1 specs)
242. [TC99424_06] Missing font warning in format toolbox font picker (used in 1 specs)
243. [TC99424_07] Missing font warning in dashboard formatting properties font picker (used in 1 specs)
244. [TC99424_08] Change to OOTB font in format panel (used in 1 specs)
245. Advanced Thresholds Editor for AG-grid (used in 1 specs)
246. AG Grid - %-based, Min, Max Column Width (from GDC) (used in 1 specs)
247. AG Grid - Advanced Sort General (used in 1 specs)
248. AG Grid - Advanced Sort Xfunc (used in 1 specs)
249. AG Grid - borders formatting (from GDC) (used in 1 specs)
250. AG Grid - Column Unit Formatting (used in 1 specs)
251. AG Grid - Create and config data bar (used in 1 specs)
252. AG Grid - Format panel for AG Grid (used in 1 specs)
253. AG Grid - Microcharts (used in 1 specs)
254. AG Grid Copy Cells and Rows (used in 1 specs)
255. AG Grid InfoWindow Test (used in 1 specs)
256. AG Grid Sort Test (used in 1 specs)
257. AG Grid Support MDX (used in 1 specs)
258. AGGrid_Convert (used in 1 specs)
259. AGGrid_Create (used in 1 specs)
260. AGGrid_DragAndDrop (used in 1 specs)
261. AGGrid_Drill_DDA (used in 1 specs)
262. AGGrid_HideColumn (used in 1 specs)
263. AGGrid_IncrementalFetch (used in 1 specs)
264. AGGrid_Manipulation (used in 1 specs)
265. AGGrid_MergeCell_TextWrap (used in 1 specs)
266. AGGrid_Xfunc_OP (used in 1 specs)
267. AGGridAttributeForms_E2E (used in 1 specs)
268. Chapter Level ACL (used in 1 specs)
269. Derived attribute for AG-grid (used in 1 specs)
270. Derived objects for AG-grid (used in 1 specs)
271. E2E_AGGrid_Drill (used in 1 specs)
272. E2E_AGGrid_HideColumnConsumption (used in 1 specs)
273. E2E_AGGrid_IncrementalFetchTooltip (used in 1 specs)
274. E2E_AGGrid_TextWrap (used in 1 specs)
275. Grouping test for AG-grid (used in 1 specs)
276. Modern (AG) grid Drilling basic cases (used in 1 specs)
277. Modern (AG) grid duplicate/move/copy to (used in 1 specs)
278. Modern (AG) grid Filtering (used in 1 specs)
279. Modern (AG) grid number formatting (used in 1 specs)
280. Modern (AG) grid show data dialog (used in 1 specs)
281. Monotype font test (used in 1 specs)
282. Outline mode in AG Grid (used in 1 specs)
283. Sanity_AGGrid_HideColumnConsumption (used in 1 specs)
284. Special Number Formatting for SSN, zipcode and telephone in modern grid (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. {actual} -- frequency: 875
2. {expected} -- frequency: 874
3. getGridCellTextByPosition -- frequency: 731
4. getGridCellTextByPos -- frequency: 378
5. getContainer -- frequency: 296
6. getGridCellByPos -- frequency: 282
7. getGridCellStyleByPos -- frequency: 172
8. getGridCellByPosition -- frequency: 157
9. getCSSProperty -- frequency: 125
10. getObjectFromSection -- frequency: 100
11. getCellInshowDataGrid -- frequency: 73
12. getGroupHeaderCell -- frequency: 49
13. getClipboardText -- frequency: 34
14. getTextFieldbyName -- frequency: 34
15. getSortBySelectedText -- frequency: 32
16. getGridCellCollapseIconByPos -- frequency: 29
17. getMojoEditorWithTitle -- frequency: 27
18. getGridCellExpandIconByPos -- frequency: 26
19. getPage -- frequency: 25
20. getDatasetRowCount -- frequency: 24
21. getGridCellText -- frequency: 20
22. getSegmentControlDropDownByCurrentSelection -- frequency: 19
23. getGridCellStyleByRows -- frequency: 18
24. getAllAgGridObjectCount -- frequency: 17
25. getObjectForShowDataGrid -- frequency: 17
26. getGridCellStyle -- frequency: 15
27. getGridCellStyleByCols -- frequency: 15
28. getObjectPulldownSelection -- frequency: 15
29. getGridCell -- frequency: 13
30. getContextMenuButton -- frequency: 12
31. getTooltip -- frequency: 12
32. getColHeaderCellInFrozenArea -- frequency: 11
33. getSelectedContainer -- frequency: 11
34. getSortByListItemsCount -- frequency: 11
35. getText -- frequency: 11
36. getGroupColHeaderCellInFrozenArea -- frequency: 10
37. 38 AE6 F -- frequency: 8
38. C1292 F -- frequency: 8
39. getDossierSavedSuccessfullyDialog -- frequency: 8
40. getNfValueFormatPulldown -- frequency: 8
41. getObjectFromDatasetContainer -- frequency: 8
42. getSortEditor -- frequency: 8
43. getSubtotalEditorDialog -- frequency: 8
44. getVisualizationTitleBarRoot -- frequency: 8
45. getContextMenuItem -- frequency: 7
46. getHeaderCount -- frequency: 7
47. getMojoLoadingIndicator -- frequency: 7
48. getPullDownWithCurrentSelectionReact -- frequency: 7
49. 1 C8 DD4 -- frequency: 6
50. DB6657 -- frequency: 6
51. getAttributeFormDefinition -- frequency: 6
52. getCheckedCheckbox -- frequency: 6
53. getDatasetByName -- frequency: 6
54. getMissingFontTooltip -- frequency: 6
55. getMoreOptionsDialog -- frequency: 6
56. getObjectInDropZone -- frequency: 6
57. getShowDataDialog -- frequency: 6
58. getContextMenuOption -- frequency: 5
59. getDossierView -- frequency: 5
60. getNameInputFieldWithText -- frequency: 5
61. getSortRowsCount -- frequency: 5
62. 83 C962 -- frequency: 4
63. FAD47 F -- frequency: 4
64. getCurrentColumnSizeFit -- frequency: 4
65. getCustomSubtotalEditorDialog -- frequency: 4
66. getOrderSelectedText -- frequency: 4
67. getVIVizPanel -- frequency: 4
68. 834 FBD -- frequency: 3
69. getCheckBox -- frequency: 3
70. getGridCellImgSrcByPos -- frequency: 3
71. getMissingFontPopup -- frequency: 3
72. getSourceIconInLayersPanel -- frequency: 3
73. getTable -- frequency: 3
74. getValueCellByPinIdx -- frequency: 3
75. 0 F6095 -- frequency: 2
76. 028 F94 -- frequency: 2
77. 1 D6 F31 -- frequency: 2
78. 7 E0 F16 -- frequency: 2
79. 9 D9 FE0 -- frequency: 2
80. A6 CCDD -- frequency: 2
81. ABABAB -- frequency: 2
82. D76322 -- frequency: 2
83. DEDEDE -- frequency: 2
84. F56 E21 -- frequency: 2
85. FFF3 B3 -- frequency: 2
86. getAttributeForm -- frequency: 2
87. getColHeaderByPinIdx -- frequency: 2
88. getContainerByTitle -- frequency: 2
89. getContainerPath -- frequency: 2
90. getContainerZIndex -- frequency: 2
91. getCurrentPage -- frequency: 2
92. getCurrentSelectedFont -- frequency: 2
93. getDashboardFormattingPopUp -- frequency: 2
94. getFontPickerDropdown -- frequency: 2
95. getFunctionSelectioninPopupList -- frequency: 2
96. getGridObject -- frequency: 2
97. getGroupHeader -- frequency: 2
98. getLevelSelectioninPopupList -- frequency: 2
99. getMetricDefinition -- frequency: 2
100. getObjectFromDataset -- frequency: 2
101. getObjectSelectioninPopupList -- frequency: 2
102. getOrderListItemsCount -- frequency: 2
103. getPinnedAreaIndicator -- frequency: 2
104. getSubOptionFromMenubar -- frequency: 2
105. getTargetButton -- frequency: 2
106. getTargetIconInLayersPanel -- frequency: 2
107. getToolbarBtnByName -- frequency: 2
108. getValue -- frequency: 2
109. getVisualizationViTitleBar -- frequency: 2
110. question mark -- frequency: 2
111. ,### -- frequency: 1
112. 04 BA22 -- frequency: 1
113. 16 B0 FF -- frequency: 1
114. 4 F60 D6 -- frequency: 1
115. AADED7 -- frequency: 1
116. Column Limit Editor -- frequency: 1
117. DEDDFF -- frequency: 1
118. getCellValue -- frequency: 1
119. getContainerImgOverlay -- frequency: 1
120. getCurrentHideMetricNullZerosSetting -- frequency: 1
121. getFontSelectorDropdown -- frequency: 1
122. getHeaderInShowDataGrid -- frequency: 1
123. getMCFromSection -- frequency: 1
124. getMenuOption -- frequency: 1
125. getMenuOptions -- frequency: 1
126. getNfCurrencyPositionPulldown -- frequency: 1
127. getNfCurrencySymbolPulldown -- frequency: 1
128. getNfDecimalMoverBtn -- frequency: 1
129. getNfShortcutsIcon -- frequency: 1
130. getNfThousandSeparator -- frequency: 1
131. getObjectFromEditor -- frequency: 1
132. getObjectFromObjectBrowseContainer -- frequency: 1
133. getObjectFromSectionSansType -- frequency: 1
134. getObjectTypeId -- frequency: 1
135. getRowIndexByCellText -- frequency: 1
136. getSecondaryContextMenu -- frequency: 1
137. getSourceButton -- frequency: 1
138. getSubTotalDropdown -- frequency: 1
139. getUnusedObjectFromDataset -- frequency: 1
140. getViewFilterIcon -- frequency: 1

## Key Actions

- `getGridCellTextByPosition(row, col, visualizationName)` -- used in 731 specs
- `getGridCellTextByPos(row, col, visualizationName)` -- used in 378 specs
- `isExisting()` -- used in 312 specs
- `getContainer()` -- used in 296 specs
- `getGridCellByPos()` -- used in 282 specs
- `getText()` -- used in 253 specs
- `isDisplayed()` -- used in 186 specs
- `pause()` -- used in 177 specs
- `getGridCellStyleByPos(row, col, style)` -- used in 172 specs
- `getGridCellByPosition()` -- used in 157 specs
- `addObjectToVizByDoubleClick()` -- used in 142 specs
- `editDossierByUrl()` -- used in 139 specs
- `getCSSProperty()` -- used in 125 specs
- `getObjectFromSection()` -- used in 118 specs
- `openContextSubMenuItemForHeader(elementName, menuItem, subMenuItem, visualizationName)` -- used in 117 specs
- `waitLoadingDataPopUpIsNotDisplayed()` -- used in 110 specs
- `goToPage()` -- used in 92 specs
- `openPageFromTocMenu()` -- used in 90 specs
- `switchToEditorPanel()` -- used in 90 specs
- `openContextMenuItemForHeader(elementName, menuItem, visualizationName)` -- used in 81 specs
- `getCellInshowDataGrid()` -- used in 73 specs
- `hidePageIndicator()` -- used in 63 specs
- `selectObject(pulldownIndex, optionText)` -- used in 62 specs
- `switchToFormatPanelByClickingOnIcon()` -- used in 60 specs
- `login()` -- used in 57 specs
- `expandGroupCell(el)` -- used in 55 specs
- `clickCheckBox()` -- used in 54 specs
- `isPinIndicatorVisible(pinArea, visualization)` -- used in 53 specs
- `getGroupHeaderCell()` -- used in 51 specs
- `actionOnToolbar()` -- used in 49 specs
- `changeVizType()` -- used in 48 specs
- `selectGridContextMenuOption()` -- used in 47 specs
- `selectContextMenuOption()` -- used in 43 specs
- `scrollVerticallyDownToNextSlice(number, vizName)` -- used in 40 specs
- `changeViz()` -- used in 39 specs
- `dragDSObjectToDZwithPosition()` -- used in 39 specs
- `clickSectionTitle()` -- used in 38 specs
- `openDossierById()` -- used in 36 specs
- `agGridHeader()` -- used in 34 specs
- `changeSegmentControl()` -- used in 34 specs
- `getClipboardText()` -- used in 34 specs
- `getTextFieldbyName()` -- used in 34 specs
- `isContainerSelected()` -- used in 34 specs
- `log()` -- used in 34 specs
- `openDossier()` -- used in 34 specs
- `stringify()` -- used in 34 specs
- `clickOnContainerTitle()` -- used in 33 specs
- `confirmDialog()` -- used in 32 specs
- `getSortBySelectedText()` -- used in 32 specs
- `clickBuiltInColor()` -- used in 31 specs
- `switchToFormatPanel()` -- used in 31 specs
- `getGridCellCollapseIconByPos(row, col, visualizationName)` -- used in 29 specs
- `save()` -- used in 29 specs
- `addMicrochartSet()` -- used in 28 specs
- `dismissColorPicker()` -- used in 27 specs
- `expandLayoutSection()` -- used in 27 specs
- `getMojoEditorWithTitle()` -- used in 27 specs
- `openAndselectSortByAndOrder()` -- used in 27 specs
- `openMenuItem(elementName, menuItem, visualizationName)` -- used in 27 specs
- `switchToTab()` -- used in 27 specs
- `getGridCellExpandIconByPos(row, col, visualizationName)` -- used in 26 specs
- `isContextMenuOptionPresent()` -- used in 26 specs
- `waitForDossierLoading()` -- used in 26 specs
- `getPage()` -- used in 25 specs
- `openContextMenuItemForValue(elementName, menuItem, visualizationName, waitForLoadingDialog = true)` -- used in 25 specs
- `scrollHorizontally(direction, pixels, vizName)` -- used in 25 specs
- `simpleSort()` -- used in 25 specs
- `getDatasetRowCount()` -- used in 24 specs
- `openContextMenu()` -- used in 24 specs
- `saveAndCloseMoreOptionsDialog()` -- used in 24 specs
- `scrollVerticallyToBottom(vizName)` -- used in 24 specs
- `addColumnSet()` -- used in 23 specs
- `openMoreOptionsDialog(visualizationName)` -- used in 23 specs
- `scrollVertically(direction, pixels, vizName)` -- used in 23 specs
- `waitForElementVisible()` -- used in 23 specs
- `dragDSObjectToGridColumnSetDZ()` -- used in 22 specs
- `openRMCMenuForValue(elementName, visualizationName)` -- used in 21 specs
- `pasteTextFieldbyDoubleClick()` -- used in 21 specs
- `toggleShowTotalsByContextMenu(visualizationName)` -- used in 21 specs
- `waitForDisplayed()` -- used in 21 specs
- `getGridCellText()` -- used in 20 specs
- `selectGridSegment()` -- used in 20 specs
- `toString()` -- used in 20 specs
- `clickButtonInColumnLimitEditor(btn)` -- used in 19 specs
- `firstElmOfHeader()` -- used in 19 specs
- `getSegmentControlDropDownByCurrentSelection()` -- used in 19 specs
- `setColumnLimitInputBox(minOrMax, txt)` -- used in 19 specs
- `dragDSObjectToGridDZ()` -- used in 18 specs
- `getGridCellStyleByRows(colStart, colEnd, row, style)` -- used in 18 specs
- `toBeTruthy()` -- used in 18 specs
- `clickOnElement()` -- used in 17 specs
- `collapseGroupCell(el)` -- used in 17 specs
- `getAllAgGridObjectCount()` -- used in 17 specs
- `getColHeaderCellInFrozenArea()` -- used in 17 specs
- `getObjectForShowDataGrid()` -- used in 17 specs
- `isContextMenuOptionPresentInHeaderCell(menuOption, cellText, visualizationName)` -- used in 17 specs
- `scrollVerticallyToMiddle(vizName)` -- used in 17 specs
- `toBeFalse()` -- used in 17 specs
- `getGroupColHeaderCellInFrozenArea()` -- used in 16 specs
- `selectType(type)` -- used in 16 specs
- `switchSection()` -- used in 16 specs
- `clickColumnSizeFitOption()` -- used in 15 specs
- `clickEditIcon()` -- used in 15 specs
- `clickOnAGGridCells(elementNames, visualizationName)` -- used in 15 specs
- `getGridCellStyle(row, col, visualizationName, style)` -- used in 15 specs
- `getGridCellStyleByCols(rowStart, rowEnd, col, style)` -- used in 15 specs
- `getObjectPulldownSelection()` -- used in 15 specs
- `goToLibrary()` -- used in 15 specs
- `removeFromDropZone()` -- used in 15 specs
- `RMConColumnHeaderElement(elementName, visualizationName)` -- used in 15 specs
- `toBeTrue()` -- used in 15 specs
- `clickFontColorBtn()` -- used in 14 specs
- `isDatabarDialogOpened()` -- used in 14 specs
- `selectTextFont()` -- used in 14 specs
- `switchToGeneralSettingsTab()` -- used in 14 specs
- `getGridCell()` -- used in 13 specs
- `multiSelectDisplayFormsFromDropZone()` -- used in 13 specs
- `openGridElmContextMenu()` -- used in 13 specs
- `openRMCMenuForCellAtPositionAndSelectFromCM(row, col, visualizationName, option)` -- used in 13 specs
- `setSubtotalTypeTo(metricName, subtotalType)` -- used in 13 specs
- `setTextFontSize()` -- used in 13 specs
- `toggleShowTotalsFromAttribute(objectName, visualizationName, subtotalOptions)` -- used in 13 specs
- `changeDropdownReact()` -- used in 12 specs
- `clickOnElementByInjectingScript()` -- used in 12 specs
- `clickOnNewQualificationEditorOkButton()` -- used in 12 specs
- `closeShowDataDialog()` -- used in 12 specs
- `disableWrapText()` -- used in 12 specs
- `dragDSObjectToColumnSetDZwithPosition()` -- used in 12 specs
- `expandAcrossLevelSelector(type)` -- used in 12 specs
- `getContextMenuButton()` -- used in 12 specs
- `getTooltip()` -- used in 12 specs
- `isCheckBoxChecked()` -- used in 12 specs
- `openCellBorderStyleDropDownByPos()` -- used in 12 specs
- `selectAttributeAcrossLevel(attribute)` -- used in 12 specs
- `selectCellBorderStyle()` -- used in 12 specs
- `selectDisplayAttributeFormMode()` -- used in 12 specs
- `selectObjectFromBasedOnDropdown()` -- used in 12 specs
- `cancel()` -- used in 11 specs
- `clickCellBorderColorBtnByPos()` -- used in 11 specs
- `contextMenuContainsOption()` -- used in 11 specs
- `getSelectedContainer()` -- used in 11 specs
- `getSortByListItemsCount()` -- used in 11 specs
- `openDossierByUrl()` -- used in 11 specs
- `openSortByDropdown()` -- used in 11 specs
- `saveAndCloseSubtotalEditor()` -- used in 11 specs
- `selectFontAlign()` -- used in 11 specs
- `selectTypeCheckbox(type)` -- used in 11 specs
- `sleep()` -- used in 11 specs
- `sortShowDataGridbyClickingHeader()` -- used in 11 specs
- `waitForElementInvisible()` -- used in 11 specs
- `waitForSubtotalEditorVisible()` -- used in 11 specs
- `chapterIsLocked()` -- used in 10 specs
- `clickButtonFromToolbar()` -- used in 10 specs
- `clickColorPickerModeBtn()` -- used in 10 specs
- `clickContainerByScript()` -- used in 10 specs
- `isDisplayFormSelected()` -- used in 10 specs
- `movetoContainer()` -- used in 10 specs
- `rightClickAttributeMetricByName()` -- used in 10 specs
- `actionOnObjectFromDataset()` -- used in 9 specs
- `clearSortBySortIcon(elementName, visualizationName)` -- used in 9 specs
- `clickContainer()` -- used in 9 specs
- `customSubtotalsClickButton(label)` -- used in 9 specs
- `drillfromAttributeHeader(attributeName, drillToItem, visualizationName)` -- used in 9 specs
- `duplicateContainer()` -- used in 9 specs
- `openDisplayAttributeFormsMenu()` -- used in 9 specs
- `renameCustomSubtotalsName(newName)` -- used in 9 specs
- `selectNumberFormatFromDropdown()` -- used in 9 specs
- `selectSecondaryOptionInMenuForThresholdConditions()` -- used in 9 specs
- `showTotal()` -- used in 9 specs
- `switchToTextFormatTab()` -- used in 9 specs
- `actionOnMenu()` -- used in 8 specs
- `changeSubtotalPosition(cellToClick, newPosition, visualizationName, isHeader)` -- used in 8 specs
- `clickBtnOnMojoEditor()` -- used in 8 specs
- `clickOnInsertVI()` -- used in 8 specs
- `clickOnMaximizeRestoreButton()` -- used in 8 specs
- `copytoContainer()` -- used in 8 specs
- `doubleClickOnObject()` -- used in 8 specs
- `editDossierByUrlwithMissingFont()` -- used in 8 specs
- `getDossierSavedSuccessfullyDialog()` -- used in 8 specs
- `getNfValueFormatPulldown()` -- used in 8 specs
- `getObjectFromDatasetContainer()` -- used in 8 specs
- `getSortEditor()` -- used in 8 specs
- `getSubtotalEditorDialog()` -- used in 8 specs
- `getVisualizationTitleBarRoot()` -- used in 8 specs
- `openContextMenuItemForCellAtPosition(row, col, menuItem, visualizationName, waitForLoadingDialog = true)` -- used in 8 specs
- `resizeColumnByMovingBorder()` -- used in 8 specs
- `selectFontStyle()` -- used in 8 specs
- `selectNfValueFormatFromDropdown()` -- used in 8 specs
- `switchToColumns()` -- used in 8 specs
- `userOrGroupIsChecked()` -- used in 8 specs
- `changeColumnSetInAgGrid()` -- used in 7 specs
- `clickAddCustomSubtotalButton()` -- used in 7 specs
- `clickBtn(btnTxt)` -- used in 7 specs
- `clickCellFillColorBtn()` -- used in 7 specs
- `clickCheckBoxForOption()` -- used in 7 specs
- `clickOnCheckMarkOnFormatPreviewPanel()` -- used in 7 specs
- `containerRelativePosition()` -- used in 7 specs
- `createSubtotalsFromEditorPanel()` -- used in 7 specs
- `enableWrapText()` -- used in 7 specs
- `getContextMenuItem()` -- used in 7 specs
- `getHeaderCount()` -- used in 7 specs
- `getMojoLoadingIndicator()` -- used in 7 specs
- `getNameInputFieldWithText()` -- used in 7 specs
- `getPullDownWithCurrentSelectionReact()` -- used in 7 specs
- `multiSelectDisplayForms()` -- used in 7 specs
- `openNewThresholdCondition()` -- used in 7 specs
- `saveAndCloseAdvancedThresholdEditor()` -- used in 7 specs
- `selectSortByDropdownItem()` -- used in 7 specs
- `url()` -- used in 7 specs
- `applyAndCloseUnitSelectionPopup()` -- used in 6 specs
- `configDynamicSelection()` -- used in 6 specs
- `dataBarDialogTitleIsDisplayed(title)` -- used in 6 specs
- `deleteContainer()` -- used in 6 specs
- `dismissMissingFontPopup()` -- used in 6 specs
- `doElementSelectionForAttributeFilter()` -- used in 6 specs
- `expandSpacingSection()` -- used in 6 specs
- `getAttributeFormDefinition()` -- used in 6 specs
- `getCheckedCheckbox()` -- used in 6 specs
- `getDatasetByName()` -- used in 6 specs
- `getMissingFontTooltip()` -- used in 6 specs
- `getMoreOptionsDialog()` -- used in 6 specs
- `getObjectFromDataset()` -- used in 6 specs
- `getObjectInDropZone()` -- used in 6 specs
- `getShowDataDialog()` -- used in 6 specs
- `hoverMouseOnElement()` -- used in 6 specs
- `moveNfDecimalPlace()` -- used in 6 specs
- `moveShowDataVerticalScrollBarToBottom()` -- used in 6 specs
- `openAttributeThresholdsEditor()` -- used in 6 specs
- `openDynamicSelectionMenu()` -- used in 6 specs
- `rightClick()` -- used in 6 specs
- `saveAndOpen()` -- used in 6 specs
- `scrollHorizontallyToNextSlice(number, vizName)` -- used in 6 specs
- `selectGridColumns()` -- used in 6 specs
- `selectUnitsInUnitSelectionPopup()` -- used in 6 specs
- `selectVerticalAlign()` -- used in 6 specs
- `setIncrementalFetchValue(value)` -- used in 6 specs
- `sortAscendingBySortIcon(elementName, visualizationName)` -- used in 6 specs
- `toggleSelectorMenu()` -- used in 6 specs
- `typeValueInput()` -- used in 6 specs
- `waitForAuthoringPageLoading()` -- used in 6 specs
- `addGridToViz()` -- used in 5 specs
- `changeCellsFillColor()` -- used in 5 specs
- `ClickOnFontStyleButtonInPanel()` -- used in 5 specs
- `ctrlClick()` -- used in 5 specs
- `getContextMenuOption()` -- used in 5 specs
- `getDossierView()` -- used in 5 specs
- `getSortRowsCount()` -- used in 5 specs
- `isAdvancedSortEditorPresent()` -- used in 5 specs
- `openFontColorDropdownMenu()` -- used in 5 specs
- `openShowDataDiagFromViz()` -- used in 5 specs
- `reorderColumnSet()` -- used in 5 specs
- `saveAndCloseSimThresholdEditor()` -- used in 5 specs
- `saveMetric()` -- used in 5 specs
- `selectContextMenuOptionFromObjectinDZ()` -- used in 5 specs
- `selectFontColorByColorName()` -- used in 5 specs
- `selectInListOrNotInList()` -- used in 5 specs
- `setArrangement()` -- used in 5 specs
- `toBeGreaterThan()` -- used in 5 specs
- `userOrGroupIsAdded()` -- used in 5 specs
- `addObjectByDoubleClick()` -- used in 4 specs
- `chapterIsDisplayedInTOC()` -- used in 4 specs
- `checkElementListByIndex()` -- used in 4 specs
- `clearCellSortBySortIcon()` -- used in 4 specs
- `clickContextMenuButton()` -- used in 4 specs
- `clickOnAGGridCell(elementName, visualizationName)` -- used in 4 specs
- `clickOnEnableDataReplaceCheckBox()` -- used in 4 specs
- `clickOnGridElementWithoutLoading()` -- used in 4 specs
- `clickOnOptionOnTheFontButtonBar()` -- used in 4 specs
- `clickSubtotalSelector(metricName)` -- used in 4 specs
- `closeDossierWithoutSaving()` -- used in 4 specs
- `confirmOutlineGridExpanded()` -- used in 4 specs
- `createNewDashboardByUrl()` -- used in 4 specs
- `customCredentials()` -- used in 4 specs
- `deleteColumnSet()` -- used in 4 specs
- `doSelectionOnOperatorDropdown()` -- used in 4 specs
- `editMicrochart()` -- used in 4 specs
- `execute()` -- used in 4 specs
- `expandFolder()` -- used in 4 specs
- `expandRA(elementName, visualizationName)` -- used in 4 specs
- `getCurrentColumnSizeFit()` -- used in 4 specs
- `getCustomSubtotalEditorDialog()` -- used in 4 specs
- `getMCFromSection()` -- used in 4 specs
- `getOrderSelectedText()` -- used in 4 specs
- `getVIVizPanel()` -- used in 4 specs
- `hoverOnGridElement()` -- used in 4 specs
- `moveObjectByColumnBorder()` -- used in 4 specs
- `moveToPosition()` -- used in 4 specs
- `openAndselectSortBy()` -- used in 4 specs
- `openDropdown()` -- used in 4 specs
- `openGridContextMenuByPos()` -- used in 4 specs
- `openOperatorDropDown()` -- used in 4 specs
- `openRMCMenuForCellAtPosition(row, col, visualizationName)` -- used in 4 specs
- `openRMCMenuForMicrochartAtPositionAndSelectFromCM(row, col, visualizationName, option)` -- used in 4 specs
- `openSimpleThresholdColorBandDropDownMenu()` -- used in 4 specs
- `renameVisualizationByDoubleClick()` -- used in 4 specs
- `replaceObjectByName()` -- used in 4 specs
- `replaceObjectByNameInColumnSet()` -- used in 4 specs
- `resizeColumnByMovingBorderMultiLayer()` -- used in 4 specs
- `rightClickOnEditorPanel()` -- used in 4 specs
- `saveAttribute()` -- used in 4 specs
- `selectAttributeFilterOperator()` -- used in 4 specs
- `selectOptionFromDataReplaceDropdownMenu()` -- used in 4 specs
- `selectSimpleThresholdColorBand()` -- used in 4 specs
- `setFillColor()` -- used in 4 specs
- `toggleShowTotalsFromMetric(objectName, visualizationName)` -- used in 4 specs
- `typeMinMaxValue(minORmax, value)` -- used in 4 specs
- `validateForm()` -- used in 4 specs
- `waitForExist()` -- used in 4 specs
- `applyButtonForSelectTarget()` -- used in 3 specs
- `applyIncrementalFetchSuggestedValue()` -- used in 3 specs
- `changeDropdown(label, newOption)` -- used in 3 specs
- `changeToAnotherColumnSetAdvancedFilterEditor()` -- used in 3 specs
- `checkChooseElementsByDropdown()` -- used in 3 specs
- `clickButton(label)` -- used in 3 specs
- `clickColorPicker(positiveORnegative)` -- used in 3 specs
- `clickDataSourceByIndex()` -- used in 3 specs
- `clickMenuOptionInLevel()` -- used in 3 specs
- `clickNewDataBtn()` -- used in 3 specs
- `clickOnBtn()` -- used in 3 specs
- `clickOnColumnHeaderElement(elementName, visualizationName)` -- used in 3 specs
- `clickSaveButtonOnGroup()` -- used in 3 specs
- `clickWarningIcon()` -- used in 3 specs
- `closeSubtotalEditorByCancel()` -- used in 3 specs
- `debug()` -- used in 3 specs
- `dragDSObjectToSelector()` -- used in 3 specs
- `drillfromAttributeElement(elementName, drillToItem, visualizationName)` -- used in 3 specs
- `getCheckBox()` -- used in 3 specs
- `getGridCellImgSrcByPos()` -- used in 3 specs
- `getMissingFontPopup()` -- used in 3 specs
- `getSourceIconInLayersPanel()` -- used in 3 specs
- `getTable()` -- used in 3 specs
- `getValueCellByPinIdx()` -- used in 3 specs
- `hoverIncrementalFetchHelpIcon()` -- used in 3 specs
- `hoverOverCustomSubtotalOptions(customSubtotalName)` -- used in 3 specs
- `importSampleFiles()` -- used in 3 specs
- `isLoginPageDisplayed()` -- used in 3 specs
- `isPanelPresent()` -- used in 3 specs
- `logout()` -- used in 3 specs
- `openColumnSetPullDown()` -- used in 3 specs
- `openManageAccessEditor()` -- used in 3 specs
- `openNewQualificationEditor()` -- used in 3 specs
- `openQuickSymbolDropDownMenu()` -- used in 3 specs
- `openUserAccountMenu()` -- used in 3 specs
- `relogin()` -- used in 3 specs
- `resetDossierIfPossible()` -- used in 3 specs
- `scrollListToBottom()` -- used in 3 specs
- `searchUserGroup()` -- used in 3 specs
- `selectAdvancedColorBuiltInSwatch()` -- used in 3 specs
- `selectCellPadding()` -- used in 3 specs
- `selectColumnSet()` -- used in 3 specs
- `selectFromSuggestList()` -- used in 3 specs
- `selectHideShowNullZerosOption()` -- used in 3 specs
- `selectItemByText()` -- used in 3 specs
- `selectQuickSymbolByIndexNumber()` -- used in 3 specs
- `setColorPaletteHex()` -- used in 3 specs
- `setMetricName()` -- used in 3 specs
- `verfiyPulldownCurrSelection(label, option)` -- used in 3 specs
- `addAdvancedSortParameter()` -- used in 2 specs
- `addBlankAttrForm()` -- used in 2 specs
- `addFunctionByDoubleClick()` -- used in 2 specs
- `all()` -- used in 2 specs
- `apply()` -- used in 2 specs
- `clickAddUserButton()` -- used in 2 specs
- `clickCheckboxbyLabel(label)` -- used in 2 specs
- `clickEditorPanel()` -- used in 2 specs
- `clickNfShortcutIcon()` -- used in 2 specs
- `clickNumberFormatDropdownOption()` -- used in 2 specs
- `clickOnContainerFromLayersPanel()` -- used in 2 specs
- `clickOnSecondaryContextMenu(submenu)` -- used in 2 specs
- `clickSaveDossierButtonWithWait()` -- used in 2 specs
- `clickTopLeftCorner()` -- used in 2 specs
- `copy()` -- used in 2 specs
- `delete()` -- used in 2 specs
- `dragDSObjectBelowColumnsTitleBar()` -- used in 2 specs
- `dragDSObjectToAGGridWithPositionInColumnHeader(objectName, objectTypeName, datasetName, desPosition, elementInRow, vizName)` -- used in 2 specs
- `dragDSObjectToLastColumnSet()` -- used in 2 specs
- `dragHeaderCellToCol(objectToDrag, position, targetHeader)` -- used in 2 specs
- `dragHeaderCellToRow(objectToDrag, position, targetHeader)` -- used in 2 specs
- `dragObjectFromDZtoDS()` -- used in 2 specs
- `editCustomSubtotal()` -- used in 2 specs
- `expandRAOnColumnHeader(headerName, visualizationName)` -- used in 2 specs
- `getAttributeForm()` -- used in 2 specs
- `getColHeaderByPinIdx()` -- used in 2 specs
- `getContainerByTitle()` -- used in 2 specs
- `getContainerPath()` -- used in 2 specs
- `getContainerZIndex()` -- used in 2 specs
- `getCurrentPage()` -- used in 2 specs
- `getCurrentSelectedFont()` -- used in 2 specs
- `getDashboardFormattingPopUp()` -- used in 2 specs
- `getFontPickerDropdown()` -- used in 2 specs
- `getFunctionSelectioninPopupList()` -- used in 2 specs
- `getGridObject()` -- used in 2 specs
- `getGroupHeader()` -- used in 2 specs
- `getLevelSelectioninPopupList()` -- used in 2 specs
- `getMetricDefinition()` -- used in 2 specs
- `getObjectSelectioninPopupList()` -- used in 2 specs
- `getOrderListItemsCount()` -- used in 2 specs
- `getPinnedAreaIndicator(isLeftPinArea, visualizationName)` -- used in 2 specs
- `getSubOptionFromMenubar()` -- used in 2 specs
- `getTargetButton()` -- used in 2 specs
- `getTargetIconInLayersPanel()` -- used in 2 specs
- `getToolbarBtnByName()` -- used in 2 specs
- `getValue()` -- used in 2 specs
- `getVisualizationViTitleBar()` -- used in 2 specs
- `hoverOnAGGridCell(elementName, visualizationName)` -- used in 2 specs
- `hoverOnFilterItemByIndex()` -- used in 2 specs
- `includes()` -- used in 2 specs
- `isAccountIconPresent()` -- used in 2 specs
- `isCheckboxchecked(label)` -- used in 2 specs
- `isMinMaxInputDisabled(minORmax)` -- used in 2 specs
- `isRowsSelected()` -- used in 2 specs
- `isSortByDisabled()` -- used in 2 specs
- `moveMouse()` -- used in 2 specs
- `moveObjectToAGGridWithPositionInRow(objectName, desPosition, elementInRow, vizName)` -- used in 2 specs
- `objectToReplace()` -- used in 2 specs
- `openAdvancedFilterEditor()` -- used in 2 specs
- `openAdvancedSortEditor()` -- used in 2 specs
- `openFilterPanel()` -- used in 2 specs
- `openFontFamilyDropdownMenu()` -- used in 2 specs
- `openFontPicker()` -- used in 2 specs
- `openFontSizeDropdownMenu()` -- used in 2 specs
- `openOrderDropdown()` -- used in 2 specs
- `openSecondaryPanel()` -- used in 2 specs
- `openThresholdEditorFromMicroChart()` -- used in 2 specs
- `removeAllObjects()` -- used in 2 specs
- `removeObjectInColumnSet()` -- used in 2 specs
- `renameChart(name)` -- used in 2 specs
- `resetIfEnabled()` -- used in 2 specs
- `saveAndCloseSortEditor()` -- used in 2 specs
- `searchInSelectedList()` -- used in 2 specs
- `selectDisplayForms()` -- used in 2 specs
- `selectFontSizeBySizeNumber()` -- used in 2 specs
- `selectFromLinkBarAttributeMetricSelector()` -- used in 2 specs
- `selectOptionFromToolbarPulldown()` -- used in 2 specs
- `selectOrderDropdownItem()` -- used in 2 specs
- `selectSimpleThresholdBasedOnObject()` -- used in 2 specs
- `selectTargetButton()` -- used in 2 specs
- `setAttributeName()` -- used in 2 specs
- `setPulldown()` -- used in 2 specs
- `setWindowSize()` -- used in 2 specs
- `sortCellAscendingBySortIcon()` -- used in 2 specs
- `sortMetricWithinAttribute()` -- used in 2 specs
- `switchChapterInEditor()` -- used in 2 specs
- `switchPulldown()` -- used in 2 specs
- `switchSimToAdvThresholdWithClear()` -- used in 2 specs
- `toBeDefined()` -- used in 2 specs
- `toBeGreaterThanOrEqual()` -- used in 2 specs
- `toggleDPSpots()` -- used in 2 specs
- `toggleTitleBar()` -- used in 2 specs
- `toggleViewSelectedButton()` -- used in 2 specs
- `actionOnMenubarWithSubmenu()` -- used in 1 specs
- `addDataFromDatasetsPanel()` -- used in 1 specs
- `addExistingObjects()` -- used in 1 specs
- `addFromAddFilters()` -- used in 1 specs
- `addNewSampleData()` -- used in 1 specs
- `cancelAndCloseMoreOptionsDialog()` -- used in 1 specs
- `cancelButtonForSelectTarget()` -- used in 1 specs
- `changeCellFillColorOpacity()` -- used in 1 specs
- `changeDPSelection()` -- used in 1 specs
- `changeMicroChartAlign()` -- used in 1 specs
- `checkElementList()` -- used in 1 specs
- `checkForEleOrValueFilterBox()` -- used in 1 specs
- `checkPresenceOfSelectTrgtBtn()` -- used in 1 specs
- `checkUserOrGroupFromExistingList()` -- used in 1 specs
- `clearMetric()` -- used in 1 specs
- `clearThreshold()` -- used in 1 specs
- `clearViewFilter()` -- used in 1 specs
- `clickBranchSelectionButton()` -- used in 1 specs
- `clickButtonInWarningDialog()` -- used in 1 specs
- `clickCloseDossierButton()` -- used in 1 specs
- `clickContainerBorderColorBtn()` -- used in 1 specs
- `clickContainerFillColorBtn()` -- used in 1 specs
- `ClickFontSizeIncreaseBtnForTimes()` -- used in 1 specs
- `clickNfCondense()` -- used in 1 specs
- `clickOnGridElement()` -- used in 1 specs
- `clickOptionOnChapterMenu()` -- used in 1 specs
- `clickSaveOnAdvancedFilterEditor()` -- used in 1 specs
- `clickShowDetails()` -- used in 1 specs
- `clickTitleBackgroundColorBtn()` -- used in 1 specs
- `closeBorderColorDropdown()` -- used in 1 specs
- `closeThresholdEditor()` -- used in 1 specs
- `collapseRA(elementName, visualizationName)` -- used in 1 specs
- `collapseRAOnColumnHeader(headerName, visualizationName)` -- used in 1 specs
- `createCalculationFromEditorPanel()` -- used in 1 specs
- `createDossierFromLibrary()` -- used in 1 specs
- `createNewElementFilter()` -- used in 1 specs
- `disableFormatPanel()` -- used in 1 specs
- `doSelectionOnChooseElementsByDropdown()` -- used in 1 specs
- `dragCellToColHeader()` -- used in 1 specs
- `dragDSObjectToAGGridWithPositionInRow(objectName, objectTypeName, datasetName, desPosition, elementInRow, vizName)` -- used in 1 specs
- `dragDSObjectToGridContainer()` -- used in 1 specs
- `dragDSObjectToMicrochartDZwithPosition()` -- used in 1 specs
- `dragSortRowwithPositionInAdvancedSortEditor()` -- used in 1 specs
- `editDossierWithPageKeyByUrl()` -- used in 1 specs
- `editorPanelShortcutFunction()` -- used in 1 specs
- `enableFormatPanel()` -- used in 1 specs
- `error()` -- used in 1 specs
- `errorMsgIsDisplayed()` -- used in 1 specs
- `expandElement()` -- used in 1 specs
- `expandTemplateSection()` -- used in 1 specs
- `findSelectorByName()` -- used in 1 specs
- `getCellValue()` -- used in 1 specs
- `getContainerImgOverlay()` -- used in 1 specs
- `getCurrentHideMetricNullZerosSetting()` -- used in 1 specs
- `getFontSelectorDropdown()` -- used in 1 specs
- `getHeaderInShowDataGrid()` -- used in 1 specs
- `getMenuOption()` -- used in 1 specs
- `getMenuOptions()` -- used in 1 specs
- `getNfCurrencyPositionPulldown()` -- used in 1 specs
- `getNfCurrencySymbolPulldown()` -- used in 1 specs
- `getNfDecimalMoverBtn()` -- used in 1 specs
- `getNfShortcutsIcon()` -- used in 1 specs
- `getNfThousandSeparator()` -- used in 1 specs
- `getObjectFromEditor()` -- used in 1 specs
- `getObjectFromObjectBrowseContainer()` -- used in 1 specs
- `getObjectFromSectionSansType()` -- used in 1 specs
- `getObjectTypeId()` -- used in 1 specs
- `getRowIndexByCellText(cellText, visualizationName)` -- used in 1 specs
- `getSecondaryContextMenu()` -- used in 1 specs
- `getSourceButton()` -- used in 1 specs
- `getSubTotalDropdown()` -- used in 1 specs
- `getUnusedObjectFromDataset()` -- used in 1 specs
- `getViewFilterIcon()` -- used in 1 specs
- `groupElementsHelper()` -- used in 1 specs
- `handleError()` -- used in 1 specs
- `hover()` -- used in 1 specs
- `inputNfCustomTextBox()` -- used in 1 specs
- `isCheckboxItemDisabled()` -- used in 1 specs
- `isColumnsSelected()` -- used in 1 specs
- `isContextMenuItemSelected()` -- used in 1 specs
- `isDisplayFormAvailable()` -- used in 1 specs
- `isDossierEditorDisplayed()` -- used in 1 specs
- `isDossierInConsumptionMode()` -- used in 1 specs
- `isMinMaxInputInvalid(minORmax)` -- used in 1 specs
- `isResetDisabled()` -- used in 1 specs
- `keys()` -- used in 1 specs
- `map()` -- used in 1 specs
- `MenuOnChapter()` -- used in 1 specs
- `metricSliderSelector()` -- used in 1 specs
- `moveAttributeFormColumnToLeftFromContextMenu(row, col, visualizationName)` -- used in 1 specs
- `moveAttributeFormColumnToRightFromContextMenu(row, col, visualizationName)` -- used in 1 specs
- `openAndClickSubMenuItemForElement(el, menuItem, subMenuItem)` -- used in 1 specs
- `openChooseElementsByDropDown()` -- used in 1 specs
- `openContainerBorderPullDown()` -- used in 1 specs
- `openDashboardFormatting()` -- used in 1 specs
- `openDefaultApp()` -- used in 1 specs
- `openFontPickerForAllFonts()` -- used in 1 specs
- `openFontPickerForTitle()` -- used in 1 specs
- `openFormatPreviewPanelByOrderNumber()` -- used in 1 specs
- `openFormatToolBoxFromVisualizationTitle()` -- used in 1 specs
- `openMenuOnVisualization()` -- used in 1 specs
- `openSimpleThresholdImageBandDropDownMenu()` -- used in 1 specs
- `openThresholdsEditor()` -- used in 1 specs
- `openViewFilterContainer()` -- used in 1 specs
- `readText()` -- used in 1 specs
- `removeCustomSubtotal()` -- used in 1 specs
- `renameDataset()` -- used in 1 specs
- `renameObject()` -- used in 1 specs
- `renameObjectFromSection()` -- used in 1 specs
- `renameVisualizationByContextMenu()` -- used in 1 specs
- `replaceInTextBox()` -- used in 1 specs
- `resetSelectorMenuIcon()` -- used in 1 specs
- `rightMouseClickOnElement(elem)` -- used in 1 specs
- `saveInMyReport()` -- used in 1 specs
- `scrollGridToBottom()` -- used in 1 specs
- `secondaryMenuOnEditorObject()` -- used in 1 specs
- `selectBorderStyle()` -- used in 1 specs
- `selectContextMenuOptions()` -- used in 1 specs
- `selectFontByFontName()` -- used in 1 specs
- `selectFontByName()` -- used in 1 specs
- `selectFromDatasetsPanelContextMenu()` -- used in 1 specs
- `selectGridTemplateColor()` -- used in 1 specs
- `selectGridTemplateStyle()` -- used in 1 specs
- `selectGroupHeaderUsingShift(elements_1, elements_2, menuItem, visualizationName)` -- used in 1 specs
- `selectItem()` -- used in 1 specs
- `selectKeyDPOption()` -- used in 1 specs
- `selectMetricFilterOperatorByValue()` -- used in 1 specs
- `selectMetricsFromDropdown()` -- used in 1 specs
- `selectMultipleElements(elements, visualizationName, waitForLoadingDialog = true)` -- used in 1 specs
- `selectNfCurrencyPositionFromDropdown()` -- used in 1 specs
- `selectNfCurrencySymbolFromDropdown()` -- used in 1 specs
- `selectOptionFromBorderColorDropdown()` -- used in 1 specs
- `selectOptionFromBorderStyleDropdown()` -- used in 1 specs
- `selectSecondaryContextMenuOption()` -- used in 1 specs
- `selectSimpleThresholdImageBand()` -- used in 1 specs
- `selectTargetVizFromWithinSelector()` -- used in 1 specs
- `selectVizContainer()` -- used in 1 specs
- `setMetricDefinition()` -- used in 1 specs
- `setMicrochartFillColor()` -- used in 1 specs
- `singleDeselectElement()` -- used in 1 specs
- `sortMetric()` -- used in 1 specs
- `switchMode()` -- used in 1 specs
- `switchRowColumnInSortEditor()` -- used in 1 specs
- `switchSimpleThresholdsTypeI18N()` -- used in 1 specs
- `switchToFilterPanel()` -- used in 1 specs
- `switchToRows()` -- used in 1 specs
- `switchToVizOptionTab()` -- used in 1 specs
- `toLowerCase()` -- used in 1 specs
- `typeAndInput()` -- used in 1 specs
- `validateMetric()` -- used in 1 specs
- `waitForDatasetToAppear()` -- used in 1 specs
- `cancelDialog()` -- used in 0 specs
- `clickOnColumnHeaderElementTextArea(elementName, visualizationName)` -- used in 0 specs
- `clickOnSubMenuItem(menuItem, subMenuItem)` -- used in 0 specs
- `clickSetColumnLimitLabel()` -- used in 0 specs
- `clickSortIcon(sortOrder)` -- used in 0 specs
- `doubleClickOnAGGridCells(elementNames, visualizationName, waitForLoadingDialog)` -- used in 0 specs
- `function(input)` -- used in 0 specs
- `getAGGridLoadingIcon()` -- used in 0 specs
- `getCellAlignment(cell)` -- used in 0 specs
- `getColumnsCount(isLeftPinArea, visualizationName)` -- used in 0 specs
- `getFirstOrLastPinnedColumn(isLeftPinArea, visualizationName)` -- used in 0 specs
- `getFirstOrLastPinnedColumns(isLeftPinArea, visualizationName)` -- used in 0 specs
- `getGridCellIconByPos(row, col, iconName, visualizationName)` -- used in 0 specs
- `isAgGridCellHasTextDisplayed(row, col, visualizationName, text)` -- used in 0 specs
- `isCellInGridDisplayed(cellText, visualizationName)` -- used in 0 specs
- `metricSortFromAgGrid(objectName, visualizationName, order)` -- used in 0 specs
- `moveHorizontalScrollBar(direction, pixels, vizName)` -- used in 0 specs
- `moveVerticalScrollBar(direction, pixels, vizName)` -- used in 0 specs
- `moveVerticalScrollBarToBottom(vizName, pos)` -- used in 0 specs
- `openContextMenuItemForDZUnit(elementName, elementType, setName, menuItem)` -- used in 0 specs
- `openContextMenuItemForHeaders(elementNames, menuItem, visualizationName)` -- used in 0 specs
- `openContextMenuItemForValues(elementNames, menuItem, visualizationName)` -- used in 0 specs
- `openContextSubMenuItemForCell(elementName, menuItem, subMenuItem, visualizationName)` -- used in 0 specs
- `openContextSubMenuItemForElement(el, menuItem, subMenuItem)` -- used in 0 specs
- `openThresholdEditorFromViz(objectName, visualizationName)` -- used in 0 specs
- `resizeAgColumnByMovingBorder(colIndex, pixels, direction, vizName)` -- used in 0 specs
- `scrollToGridCell(visualizationName, elementName)` -- used in 0 specs
- `selectAllAttributesAcrossLevel()` -- used in 0 specs
- `sortDescendingBySortIcon(elementName, visualizationName)` -- used in 0 specs
- `waitForAgGridLoadingIconNotDisplayed()` -- used in 0 specs

## Source Coverage

- `pageObjects/agGrid/**/*.js`
- `specs/regression/AG-Grid/**/*.{ts,js}`
- `specs/regression/config/aggrid/**/*.{ts,js}`
