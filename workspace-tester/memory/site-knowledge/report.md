# Site Knowledge: report

> Components: 43

### ReportGrid
> Extends: `BaseVisualization`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickOutlineIconFromCH(columnHeader)` |
| `collapseOutlineFromCell(elementName)` |
| `expandOutlineFromCell(elementName)` |
| `waitForGridRendring()` |
| `selectVizContextMenuOptionForDescendSort()` |
| `getReportHeaderByName({ headerName })` |
| `getReportElementByName({ elementName })` |
| `selectReportGridContextMenuOption({ headerName, elementName, firstOption, secondOption, thirdOption }, prompted = false)` |
| `openGridCellContextMenu(row, col)` |
| `getGridCellContextMenuTitlesByLevel(row, col, level)` |
| `getGridCellContextMenuOptionByOption({ row, col, firstOption, secondOption, thirdOption }, prompted = false)` |
| `resizeGridCellByDragColumnHeader(columnHeaderResizeFrom, columnHeaderResizeTo)` |
| `getOneRowData(row)` |
| `getReportHeaderText()` |
| `openPageByLabelContextMenu(label)` |
| `getPageByContextMenuOptionByOption({ label, firstOption, secondOption, thirdOption }, prompted = false)` |
| `dragHeaderCellToRow(objectToDrag, position, targetHeader)` |
| `dragHeaderCellToCol(objectToDrag, position, targetHeader)` |
| `dismissTooltip()` |
| `getGraphWarningMessage()` |

**Sub-components**
- getContainer
- getPage

---

### AdvancedReportProperties
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SelectorDropdownContainer` | `.rc-virtual-list` | element |

**Actions**
| Signature |
|-----------|
| `waitToBePresent(locator, timeout = 5000, msg = undefined)` |
| `waitForObjectDisappear(objectName, timeout = 2000)` |
| `clickDoneCancelButton(option)` |
| `selectReportPropertyType(option)` |
| `clickDefaultEvaluationOrder()` |
| `waitForDropdownVisible(timeout = 5000)` |
| `waitForOptionClickable(optionElement, timeout = 5000)` |
| `selectDefaultEvaluationOrder(option)` |
| `updateSchemaOptionCheckbox(settingName, settingStatus)` |
| `resetOrders()` |
| `getEvaluationOrderList(option)` |
| `selectFromEvaluationOrderList(option)` |
| `clickEvaluationOrder(option)` |
| `switchEvaluationTable(option, ExpectedStatus)` |
| `checkEvaluationOrder(option, expectItem)` |
| `getPromptOrder(option)` |
| `getPromptElement(promptTitle, promptItem)` |
| `getPromptIconByTitle(promptTitle)` |
| `checkPromptElement(Title, Order, Location, Required)` |
| `checkUnsortablePromptElement(Title, Location, Required)` |
| `changePromptOrder(source, target)` |
| `updateViewEditsToggleButton(settingStatus)` |
| `clickInSearchBox()` |
| `typeInSearchBox(searchString)` |
| `clearSearchBox()` |
| `getPropertyValuePulldownList(option)` |
| `getMutiplePropertyValuePulldownList(option)` |
| `getPropertyValueDetails(option)` |
| `getPropertyValueSQLPreview(option)` |
| `getPropertyValueSQLPreviewText(option, text)` |
| `getPropertyValueInputEdit(option)` |
| `getPropertySettingsValueRowByName(settingName)` |
| `getPropertySettingDetailsByName(settingName)` |
| `selectPropertyValuePulldownList(list, option)` |
| `checkPropertyValueDetails(option, expectItem)` |
| `checkPropertyValuePulldownList(option, expectItem)` |
| `modifyPropertyValue(item)` |
| `checkPropertyValue(item)` |
| `checkMultiplePropertyValue(option, expectItem)` |
| `expandOrCollapsedPropertyTab(settingStatus, option)` |
| `checkPropertyValueSQLPreview(option, expectItem)` |
| `copyPreviewSQLForPropertySetting(option)` |
| `modifyPropertySettingsPicker(settingName, settingValue)` |
| `modifyPropertySettingsInput(settingName, settingValue)` |
| `insertPropertyValue(option, inserValue)` |
| `dragAndDropPrompt(index, y)` |
| `waitForDatasetEvaluationTableToBeInvisible()` |
| `waitForViewEvaluationTableToBeInvisible()` |
| `clickAddNewPropertyButton()` |
| `setPropertyName(propertyName)` |
| `setPropertyValue(propertyValue)` |
| `saveProperty()` |
| `deleteProperty(propertyName)` |
| `confirmDeleteProperty()` |
| `isReportPropertiesWindowPresent()` |

**Sub-components**
- getSelectorDropdownContainer
- getOneRowSettingContainer

---

### MDXSourceSelector
> Extends: `BaseObjectBrowser`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `DatasetSelectContainer` | `.mdx-report-object-browser-container` | element |

**Actions**
| Signature |
|-----------|
| _none_ |

**Sub-components**
_none_

---

### ReportAttributeFormsDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getAlertOKBtn()` |
| `getAlertMessage(message)` |
| `getCurrentAttributeDisplayFormModeText()` |
| `clickDefaultFormCheckBox()` |
| `enableReportObjectsForms(formNames, save = true)` |
| `enableDisplayAttributeForms(formNames, save = true)` |
| `clickButton(btnName)` |
| `selectDisplayAttributeFormMode(formMode, save = false)` |
| `saveAndCloseAttributeFormsDialog()` |
| `cancelAndCloseAttributeFormsDialog()` |
| `isDefaultFormsCheckboxChecked()` |
| `isAttributeFormChecked(form)` |
| `isAttributeFormPresent(form)` |
| `isUseDefaultFormsChecked()` |

**Sub-components**
_none_

---

### ReportContextualLinkingDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickLinkToButton()` |
| `selectTargetObject(objectName)` |
| `clickOpenInNewWindowCheckbox()` |
| `clickDoneButtonInContextualLinkingEditor()` |
| `renameContextualLink(newName)` |
| `selectPromptAnswerType(answerPromptType)` |
| `selectAnswerPromptType(answerType)` |
| `selectTargetPrompt(targetPrompt)` |
| `copyLink(copyLinkButton, linkCheckBoxName, objectCheckBoxName, copyButton)` |
| `checkTargetReportName(targetReportName)` |

**Sub-components**
- linkContainer

---

### ReportCubeBrowser
> Extends: `BaseObjectBrowser`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `DatasetSelectContainer` | `.dataset-selector-dialog` | dropdown |

**Actions**
| Signature |
|-----------|
| _none_ |

**Sub-components**
_none_

---

### ReportDatasetPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FolderBrowserPopover` | `.ant-select-tree-list-holder` | dropdown |
| `ThreeDotsToOpenCubeMenu` | `.reportObjectsContainer .ant-dropdown-trigger.cube-menu` | dropdown |

**Actions**
| Signature |
|-----------|
| `getMetricInReportTabByIcon(objectName, classname)` |
| `clickObjectContextSubmenuItem(itemName)` |
| `selectItemInObjectList(itemName)` |
| `selectTab(tabName)` |
| `hoverActionInReportTab(objectName)` |
| `removeItemInReportTab(objName)` |
| `clickBottomBarToLoseFocus()` |
| `getItemsInDataSetPanel()` |
| `getObjectInObjectsPanel(objectName)` |
| `openObjectContextMenu(objectName)` |
| `addObject(objectName, option)` |
| `addObjectToColumns(objectName)` |
| `addObjectToRows(objectName)` |
| `addObjectToPageBy(objectName)` |
| `addObjectToReport(objectName)` |
| `addMultipleObjectsToPageBy(objectNames)` |
| `multiSelectObjects(objectName1, objectName2)` |
| `clickObjectContextMenuItem(menuItem)` |
| `hoverObjectContextSubmenuItem(menuItems)` |
| `selectSubmenuOption(menuItems, noWait = false)` |
| `saveAndCloseSubmenuOption()` |
| `getJoinMenuIcon(objectName, joinType)` |
| `waitUntilActionIsComplete(seconds)` |
| `renameTextField(newName)` |
| `clickFolderUpIcon()` |
| `dndFromObjectPanelToContainer(objectName, destination, options = {})` |
| `dndFromObjectBrowserToPageBy(objectName)` |
| `dndFromObjectBrowserToGrid(objectName)` |
| `dndFromObjectBrowserToReportFilter(objectName)` |
| `dndFromObjectBrowserToReportObjectsPanel(objectName, options = {})` |
| `dndFromObjectBrowserToReportViewFilter({ objectName, target = 'filter data', options = {} })` |
| `dndFromObjectBrowserToReportFilters({ objectName, target = 'report filters', options = {} })` |
| `dndByMultiSelectFromObjectBrowserToReportObjectsPanel(objectNames, options = {})` |
| `dndByMultiSelectFromReportObjectsToViewFilter({ objectNames, target })` |
| `navigateInObjectBrowser(paths)` |
| `navigateInObjectBrowserPopover(paths)` |
| `scrollObjectBrowserPopoverToTop()` |
| `openFolderBrowserPopover()` |
| `multipleSelectObjects(objectNames)` |
| `multipleSelectOnReportObjects(objectNames)` |
| `clickObjectInReportObjectsPanel(objectName)` |
| `dndFromObjectBrowserToGridHeader(objectName, targetObj)` |
| `dndFromObjectBrowserToGridCell(objectName, targetObj)` |
| `dndFromGridToObjectsPanel(objectName)` |
| `dndFromObjectListToReportFilter(objectName)` |
| `dndFromObjectBrowserToPageBy(objectName)` |
| `switchToInReportTab()` |
| `selectMultipleItemsInObjectList(itemNames)` |
| `addMultipleObjectsToColumns(objectNames)` |
| `addMultipleObjectsToRows(objectNames)` |
| `clickFolderUpMultipleTimes(count)` |
| `openDisplayAttributeFormsDialogOnObject(objectName)` |
| `renameObjectInReportTab(objectName, newName)` |
| `searchObjectInObjectBrowser(objectName, option)` |
| `searchObjectInReportObjectsPanel(objectName, option)` |
| `contextMenuContainsOption(option)` |
| `objectHasJoinIcon(objectName, joinType)` |
| `isSubmenuOptionSelected(menuItems)` |
| `dragObjectToGrid(objectName)` |
| `switchToAllTab()` |
| `switchToColumnsTab()` |
| `switchToRowsTab()` |
| `switchToPageByTab()` |
| `clickToCloseContextMenu()` |
| `resetSelectionToObjectInReportTab(objectName)` |
| `waitForStatusBarText(text)` |
| `isObjectInReportTabDisplayed(objectName)` |
| `getAllElementsInReportPane()` |
| `openSelectCubeDialog()` |

**Sub-components**
- reportFilterPanel
- ObjectBrowserPanel
- ReportObjectsPanel
- ReportViewFilterPanelContainer
- MultiSelectContainer
- getObjectInObjectsPanel
- addObjectToPage
- GridContainer
- PageByContainer
- ReportFilterPanelContainer
- FilterDataSectionInReportFilterPanel
- ViewFiltersSectionInReportViewFilterPanel
- AggregationFiltersSectionInReportFilterPanel
- dndFromObjectPanelToContainer
- dndFromObjectBrowserToReportObjectsPanel
- ObjectsPanel

---

### ReportDerivedMetricEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `searchFunction(fnString)` |
| `addFunctionByDoubleClick(functionName)` |
| `setElementsSelectioninPopupList(elementsList)` |
| `clickOnDropdownOfValueList(label)` |
| `selectValueList(list)` |
| `addObjectByDoubleClick(objectName)` |
| `getMetricDefinition()` |
| `setMetricName(newName)` |
| `setFormulaMetricName(newName)` |
| `setMetricNameOpenFromEdit(newName)` |
| `setMetricDesc(newDesc)` |
| `setMetricDefinition(formula)` |
| `presentInMetricDefinition(newToken)` |
| `clearMetric()` |
| `validateMetric()` |
| `saveMetric()` |
| `saveFormulaMetric()` |
| `saveMetricEditorOpenFromEdit()` |
| `addFilter()` |
| `clearFilter()` |
| `saveQualification()` |
| `saveFilter()` |
| `switchMode(modeName)` |
| `switchModeinSimpleMetricEditor(modeName)` |
| `openMetricOptionsDialog()` |
| `openAFBPullDown()` |
| `chooseAFB(afBehavior)` |
| `saveAFB()` |
| `cancelAFB()` |
| `getTextInInputSection()` |
| `switchToFormulaMode()` |
| `selectFunctionsSelectionFromDMEditor()` |
| `selectFunctionsTypeFromDMEditor()` |
| `selectObjectsSelectionFromDMEditor()` |
| `selectLevelSelectionFromDMEditor()` |
| `selectBasedOnFromDMEditor()` |
| `selectDataTypeFromDMEditor()` |
| `selectFunctionFromList(functionName)` |
| `selectObjFromList(objName)` |
| `isMetricEditorDisplayed()` |
| `isTextDisplayedInInputSection(text)` |

**Sub-components**
- functionsPanel
- simpleMetricPanel
- objectsPanel
- metricPanel
- displayedMetricPanel
- saveBtnfromSimpleMetricPanel
- switchBtninSimplifiedMetricPanel

---

### is


**Locators**
| Name | CSS | Type |
|------|-----|------|
| `DetailedRightPanel` | `.mstr-qualification-editor.mode-authoring:not(.mstr-qualification-editor--inline)` | element |

**Actions**
| Signature |
|-----------|
| `toggleElementListMode()` |
| `openQualifyOnDropdown()` |
| `openOperatorDropdown()` |

**Sub-components**
- getDetailedRightPanel
- getDetailedPanel

---

### ReportEditorCustomInputBox
> Extends: `CustomInputBox`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| _none_ |

**Sub-components**
_none_

---

### is


**Locators**
| Name | CSS | Type |
|------|-----|------|
| `DetailedRightPanel` | `.mstr-qualification-editor.mode-authoring:not(.mstr-qualification-editor--inline)` | element |
| `ObjectSearchDropdown` | `.object-search-pulldown-dropdown:not(.ant-select-dropdown-hidden)` | dropdown |

**Actions**
| Signature |
|-----------|
| `waitForObjectSearchDropdown()` |

**Sub-components**
- getDetailedRightPanel

---

### is


**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ObjectSearchDropdown` | `.object-search-pulldown-dropdown:not(.ant-select-dropdown-hidden)` | dropdown |
| `Dropdown` | `.ant-select-dropdown:not(.ant-select-dropdown-hidden)` | dropdown |

**Actions**
| Signature |
|-----------|
| `waitForObjectSearchDropdown()` |
| `waitForDropdownDisplayed()` |
| `waitForDropdownHidden()` |

**Sub-components**
- getDetailedRightPanel

---

### ReportEditorPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getRankSubMenuDropdownText(type)` |
| `getRankSortsDropdownText()` |
| `getRankBreakByDropdownText()` |
| `hoverOnObjectInDropzone(dropZone, objectType, objectName)` |
| `openObjectContextMenu(dropZone, objectType, objectName)` |
| `openAttributeFormsDialogInRows(objectName)` |
| `openMectricContextMenuInMetricsDropzone(objectName)` |
| `openAttributeContextMenuInRowsDropzone(objectName)` |
| `mouseOverObjectContextMenuItem(menuItem)` |
| `clickContextMenuItem(menuItem)` |
| `mouseOverSubMenuItem(menuItem)` |
| `clickSubMenuItem(menuItem)` |
| `changeRankDropdown(type, option)` |
| `submitRankSelections()` |
| `cancelRankSelections()` |
| `removeObjectInDropzone(dropZone, objectType, objectName)` |
| `removeAll()` |
| `removeAttributeInRowsDropZone(attributeName)` |
| `removeAttributeInColumnsDropZone(attributeName)` |
| `dndObjectBetweenDropzones(objName, objType, srcZone, desZone, relObjName, relObjType)` |
| `dndMetricsFromColumnsToRowsRelatesToAttribute(attributeName)` |
| `dndMetricsFromRowsToColumnsRelatesToAttribute(attributeName)` |
| `dndMetricsFromColumnsToRows()` |
| `dndMetricFromRowsToColumns()` |
| `dndAttributeFromRowsToPageBy(attributeName)` |
| `dndAttributeFromColumnsToPageBy(attributeName)` |
| `dndAttributeFromPageByToRows(attributeName)` |
| `dndAttributeFromPageByToColumns(attributeName)` |
| `dndObjectWithinDropzone(objName, objType, zone, relObjName, relObjType)` |
| `dndAttributeWithinPageByDropzone(objName, relObjName)` |
| `dndFromObjectListToDropzone(objName, desZone)` |
| `dndFromObjectListToRows(objName)` |
| `dndMultipleObjectsFromObjectListToRows(objectNames)` |
| `dndFromObjectListToColumns(objName)` |
| `dndMultipleObjectsFromObjectListToColumns(objectNames)` |
| `dndFromObjectListToMetrics(objName)` |
| `dndFromObjectBrowserToDropzone(objName, desZone)` |
| `dndFromDropzoneToReportObjectsPanelToRemove({ objName, srcZone = 'Rows' })` |
| `dndMultipleObjectsFromObjectBrowserToDropzone(objectNames, desZone)` |
| `dndMultipleObjectsFromObjectBrowserToPageBy(objectNames)` |
| `dndMultipleObjectsFromObjectBrowserToRows(objectNames)` |
| `dndMultipleObjectsFromObjectBrowserToColumns(objectNames)` |
| `dndMultipleObjectsFromObjectBrowserToMetrics(objectNames)` |
| `dndObjectFromObjectBrowserToRows(objectName)` |
| `dndObjectFromObjectBrowserToColumns(objectName)` |
| `dndObjectFromObjectBrowserToMetrics(objectName)` |
| `dndObjectFromObjectBrowserToPageBy(objectName)` |
| `multipleSelectObjects(objectNames)` |
| `multipleSelectObjectsInDropzone({ objects, dropzone, type })` |
| `dndByMultiSelectFromReportObjectsToDropzone({ objectNames, dropzone })` |
| `dndByMultiSelectFromDropzoneToReportObjectsPanelToRemove({ objects, dropzone, type })` |
| `dndByMultiSelectToMoveBetweenDropzones({ objects, dropzone, type, destZone })` |
| `dndByMultiSelectToReOrderWithinDropzone({ objects, dropzone, type, targetName })` |
| `selectSubtotals(subtotalOptions)` |
| `openObjectContextMenuByIndex(dropZone, objectIndex)` |
| `switchAdvToSimThresholdWithClear()` |
| `contextMenuContainsOption(option)` |
| `getZoneObjectsInOrder(dropZone, names, types)` |
| `sortOnDropZone(objectName, dropZone, type, sortOrder)` |
| `sortAscendingMetricsDropZoneForMetric(objectName)` |
| `sortDescendingMetricsDropZoneForMetric(objectName)` |
| `sortAscendingRowsDropZoneForAttribute(objectName)` |
| `sortDescendingRowsDropZoneForAttribute(objectName)` |
| `sortAscendingColumnsDropZoneForAttribute(objectName)` |
| `sortDescendingColumnsDropZoneForAttribute(objectName)` |
| `sortAscendingPageByDropZoneForAttribute(objectName)` |
| `sortDescendingPageByDropZoneForAttribute(objectName)` |
| `openThresholdInDropZone(objectName, dropZone, type)` |
| `editThresholdInDropZone(objectName, dropZone, type)` |
| `openThresholdInDropZoneForMetric(objectName)` |
| `openThresholdInDropZoneForAttribute(objectName)` |
| `editThresholdInDropZoneForMetric(objectName)` |
| `editThresholdInDropZoneForAttribute(objectName)` |
| `clearThresholds(objectName, dropZone, type)` |
| `clearThresholdsForMetricInMetricsDropZone(objectName)` |
| `clearThresholdsForAttributeInRowsDropzone(objectName)` |
| `createRankForMetricInMetricsDropZone(objectName, option = 'Ascending')` |
| `openShortcutMetricSubMenuForMetricInMetricsDropZone(objectName)` |
| `openRankSubMenuForMetricInMetricsDropZone(objectName)` |
| `changeSortDropDownInRankSubmenuAndSubmit(option)` |
| `changeBreakByDropDownInRankSubmenuAndSubmit(option)` |
| `expandSubmenuForPercentToTotalForMetricInMetricsDropZone(objectName)` |
| `expandSubmenuForTransformationForMetricInMetricsDropZone(objectName)` |
| `createTransformationForMetricInMetricsDropZone(submenuOption, option, objectName)` |
| `createPercentToTotalForMetricInMetricsDropZone(objectName, option)` |
| `createTotalForeEachForAttributeInMetrics(metricName, attributeName)` |
| `clearThresholdForMetricInMetricsDropZone(objectName)` |
| `changeNumberFormatForMetricInMetricsDropZone(objectName, format, subFormat)` |
| `changeNumberFormatForAttributeInRowsDropzone(objectName, format, subFormat)` |
| `updateAttributeFormsForAttributeInPageByDropZone(objectName, option)` |
| `isDatasetPanelExisting()` |
| `isEditorPanelExisting()` |
| `isRankSubMenuDropdownItemDisplayed(type, option)` |
| `isSortsSubMenuDropdownDisplayed(option)` |
| `isBreakBySubMenuDropdownDisplayed(option)` |
| `isSubmenuItemDisplayed(option)` |
| `isContextMenuItemDisplayed(option)` |
| `isEditContextMenuItemDisplayed()` |
| `getPageByObjects()` |
| `getRowsObjects()` |
| `getColumnsObjects()` |
| `getMetricsObjects()` |

**Sub-components**
- datasetPanel
- EditorPanel

---

### ReportEmbeddedPromptEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectPromptType(promptType)` |
| `searchFromPromptObject(objectName)` |
| `clickDoneButton()` |

**Sub-components**
_none_

---

### ReportFilterPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Container` | `.report-filter-panel` | element |
| `FilterSubpanel` | `.qualification-panel-popover.mode-authoring:not(.ant-popover-hidden) .ant-popover-content` | element |
| `ReportFilterPanelContainer` | `.report-filter-tab` | element |
| `ViewFilterTab` | `.view-filter-tab` | element |
| `AttributeElementFilterSubpanel` | `.qualification-panel-popover.mode-authoring:not(.ant-popover-hidden) .ant-popover-content` | element |

**Actions**
| Signature |
|-----------|
| `clickFilterTab(filterTab)` |
| `filterContainer()` |
| `clickNewQualificationPlus(index)` |
| `typeObjectInSearchbox(objectName)` |
| `selectObjectFromSearchedResult(objectType, objectName, index = 1)` |
| `selectTypeAndObjectFromSearchedResult(objectType, objectName, index = 1)` |
| `selectElements(elementNames)` |
| `clickQualificationEditorBtn(btnName)` |
| `saveAndCloseQualificationEditor(wait = true)` |
| `clickCancelQualificationEditor()` |
| `clickFilterApplyButton()` |
| `removeAllFilter(option = {})` |
| `createNewPrompt()` |
| `openNewQualicationEditorAtNonAggregationLevel()` |
| `openNewQualicationEditorAtAggregationLevel()` |
| `openNewViewFilterPanel()` |
| `openNewReportFiltersPanel()` |
| `openNewReportLimitsPanel()` |
| `searchAttributeObjectInSearchbox(objectName, index = 1)` |
| `switchToViewFilterTab()` |
| `switchToReportFilterTab()` |
| `toggleViewSelected()` |
| `isFilterPanelExisting()` |

**Sub-components**
- getReportFilterPanelContainer
- getReportFiltersSectionInReportFilterPanel
- getReportLimitsSectionInReportFilterPanel
- getContainer
- filterPanelContainer
- AttributeFormsPanel

---

### ReportFormatPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickPanelTab(panelName)` |
| `toggleButton(optionName)` |
| `enableOutlineMode()` |
| `openLayoutSelectionBox()` |
| `openColumnSizeFitSelectionBox()` |
| `openColumnSizeAttributeFormSelectionBox(currentSelection)` |
| `openRowSizeFitSelectionBox()` |
| `selectGridSegment(option1, option2)` |
| `clickFillColorBtn()` |
| `selectOptionFromDropdown(option)` |
| `enableStandardOutlineMode()` |
| `clickCheckBoxForOption(sectionName, optionName)` |
| `setRowHeight(inches)` |
| `setColumnSize(currentAttributeForm, inches)` |
| `selectBandingBy(axis)` |
| `openApplyColorBySelectionBox()` |
| `setApplyColorEvery(applyColorEvery)` |
| `openBandingColorPicker(colorOrder)` |
| `changeBandingColor(colorOrder, color)` |
| `changeFirstBandingColor(color)` |
| `changeSecondBandingColor(color)` |
| `openBandingHeaderSelectionBox()` |
| `getPaddingValue(paddingType)` |
| `setPaddingValue(paddingType, paddingValue)` |
| `clickOnPaddingArrowButton(paddingType, buttonType, repetitions)` |
| `clickTextFormatButton(type)` |
| `selectOptionFromBorderStyleDropdown(option, type)` |
| `selectOptionFromBorderColorDropdown(option, type)` |
| `closeBorderColorDropdown(type)` |
| `openMinimumColumnWidthMenu()` |
| `addMinimumColumnWidthOption(unit)` |
| `setMinimumColumnWidthValue(unit, value)` |
| `deleteMinimumColumnWidthOption(unit)` |
| `getMinimumColumnWithInputValue(unit)` |
| `applyColorByNumberOfRows()` |
| `applyColorByNumberOfColumns()` |
| `applyColorByRowHeader()` |
| `applyColorByColumnHeader()` |
| `selectBandingByRows()` |
| `selectBandingByColumns()` |
| `selectBandingHeader(header)` |
| `getValueOfMinimumColumnWidthOption(unit)` |
| `enableBanding()` |
| `isFormatPanelExisting()` |
| `isMinimumColumnWidthSectionDisplayed()` |
| `isMinimumColumnWidthInputDisplayed(unit)` |
| `getBandingColor(colorOrder)` |
| `getFirstBandingColor()` |
| `getSecondBandingColor()` |
| `getApplyColorByNumberOfColumns()` |
| `getLayoutSelectionBoxValue()` |
| `isBandingByRows()` |
| `isBandingByColumns()` |
| `isBandingEnabled()` |
| `isOutlineModeEnabled()` |
| `isCellPaddingButtonChecked(padding)` |
| `getGridSegment1DropDownValue()` |
| `getGridSegment2DropDownValue()` |
| `getFontTextSizeInputValue()` |
| `getFontSelectorValue()` |
| `isTextFormatButtonSelected(type)` |
| `isFontAlignButtonSelected(align)` |
| `getBorderStyleDropdownValue(type)` |
| `getBorderColorDropDownSectionStyle(type)` |
| `clickColumnSizeBtn()` |
| `clickColumnSizeFitOption(fit)` |
| `isCheckboxChecked(sectionName, option)` |
| `isCheckboxUnchecked(sectionName, option)` |
| `isFirstCheckBoxChecked(sectionName)` |
| `isFirstCheckBoxUnchecked(sectionName)` |

**Sub-components**
- newFormatPanel
- getPanel
- FormatPanel

---

### ReportGridView
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `RowCount` | `.mstrmojo-ViewDataDialog .mstrmojo-rowcount` | element |

**Actions**
| Signature |
|-----------|
| `getGridCellIconByPos(row, col, iconName)` |
| `getGridCellExpandIconByPos(row, col)` |
| `getGridCellCollapseIconByPos(row, col)` |
| `getGridCellExpandIconByPosDisplayed(row, col)` |
| `getGridCellCollapseIconByPosDisplayed(row, col)` |
| `getGridCellChildSpanElement(row, col)` |
| `getGridCellChildSpanText(row, col)` |
| `getGridCellImgSrcByPos(row, col)` |
| `getGridCellText(row, col)` |
| `getGridCellStyle(row, col, style)` |
| `getAllInsertRowsCount()` |
| `getNumberOfInputRows()` |
| `clickOnGridHeader(headerName)` |
| `openGridViewContextMenu()` |
| `clickContextMenuOption(option, waitForLoading = false)` |
| `clickContextMenuOptionCheckBox(option)` |
| `clickContextMenuOptionBtn(option)` |
| `openGridContextMenuByPos(row, col)` |
| `openGridColumnHeaderContextMenu(columnHeader)` |
| `openGridCellContextMenu(elementName)` |
| `openGridCellInRowContextMenu(elementName, rowIdx)` |
| `clickSortIcon(sortOrder)` |
| `renameObject(newName)` |
| `clickOutlineIconFromCH(columnHeader)` |
| `collapseOutlineFromCell(elementName)` |
| `expandOutlineFromCell(elementName)` |
| `clickDrillToItem(elementName)` |
| `openContextualLinkFromCell(cellTextContent)` |
| `openContextualLinkFromCellByPos(row, col, option)` |
| `resizeColumnByMovingBorder(colHeader, pixels, direction)` |
| `resizeColumnByMovingBorderMultiLayer(rowNum, colNum, pixels, direction)` |
| `scrollAgGrid(visualization, pixels, direction)` |
| `scrollGridHorizontally(visualization, pixels)` |
| `scrollGridToBottom(visualization = 'Visualization 1')` |
| `scrollGridToTop(visualization = 'Visualization 1')` |
| `moveVerticalScrollBarToBottom(vizName, pos)` |
| `moveVerticalScrollBar(direction, pixels, vizName)` |
| `dragGroupHeaderCell(objectToDrag, position, gridAxis, targetHeader)` |
| `dragHeaderCellToRow(objectToDrag, position, targetHeader)` |
| `getGridCellTextByPos(row, col)` |
| `getGridCellStyleByPos(row, col, style)` |
| `getGridCellStyleByCols(rowStart, rowEnd, col, style)` |
| `getGridCellStyleByRows(colStart, colEnd, row, style)` |
| `getGridCellTextByIndex(index)` |
| `sortMetricWithinAttribute(objectName, attributeName)` |
| `getSelectedSortTypeInContextMenu(columnHeader, sortType)` |
| `openAdvancedSortEditorOnGridObject(objectName)` |
| `saveAndCloseContextMenu(subMenu = false)` |
| `sortAscending(objectName)` |
| `sortDescending(objectName)` |
| `sortAscendingBySortIcon(objectName)` |
| `sortDescendingBySortIcon(objectName)` |
| `clearSortBySortIcon(objectName)` |
| `sortCellAscendingBySortIcon(objectName)` |
| `sortCellDescendingBySortIcon(objectName)` |
| `clearCellSortBySortIcon(objectName)` |
| `sortByOption(objectName, option)` |
| `moveToPageBy()` |
| `moveGridHeaderToPageBy(objectName)` |
| `moveGridCellToPageBy(objectName)` |
| `moveColumnHeaderToRight(objectName)` |
| `moveColumnHeaderToLeft(objectName)` |
| `moveColumnHeaderToColumns(objectName)` |
| `moveColumnHeaderToRows(objectName)` |
| `hideAllThresholds(objectName)` |
| `showAllThresholds(objectName)` |
| `hideTotals(objectName)` |
| `showTotals(objectName)` |
| `removeObject(objectName)` |
| `changeNumberFormat(objectName, format, subFormat)` |
| `showTotalsForObject(objectName)` |
| `addMetrics(position, srcObjectName, dstObjectNames)` |
| `addMetricsBefore(srcObjectName, dstObjectNames)` |
| `addMetricsAfter(srcObjectName, dstObjectNames)` |
| `addAttributes(position, srcObjectName, dstObjectNames)` |
| `addAttributesBefore(srcObjectName, dstObjectNames)` |
| `addAttributesAfter(srcObjectName, dstObjectNames)` |
| `openDisplayAttributeFormsDialog(objectName)` |
| `updateShowAttributeFormName(objectName, option, save = true)` |
| `enableDisplayAttributeForms(objectName, formNames, save = true)` |
| `clickGridColumnHeader(columnHeader)` |
| `drillToItem(objectName, drillToObjects)` |
| `moveTotalToTop(objectName = 'Total')` |
| `hideTotals(objectName = 'Total')` |
| `showMetricsLabel(objectName)` |
| `hideMetricsLabel(objectName)` |
| `contextMenuContainsOption(optionName)` |
| `isGridCellDisplayed(row, col)` |
| `waitForAgLoadingIconNotDisplayed()` |
| `waitForGridCellToBeExpectedValue(row, col, expectedValue)` |

**Sub-components**
- baseContainer
- vizPanel
- moveToPage

---

### ReportMenubar
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ActiveMenuDropdown` | `.mstrd-DropDown-content:not(.mstrd-DropDown-content--collapsed)` | dropdown |

**Actions**
| Signature |
|-----------|
| `getDropdownMenu()` |
| `clickMenuItem(menuItem)` |
| `isMenuItemVisible(menuItem)` |
| `getMenuItemText(menuItem)` |
| `clickSubMenuItem(menuItem, subMenuItem)` |
| `isSubMenuItemVisible(menuItem, subMenuItem)` |
| `getSubMenuItemText(menuItem, subMenuItem)` |

**Sub-components**
_none_

---

### ReportNumberTextFormatting
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectNumberTextFormatFromDropdown(numberFormat)` |
| `changeSymbolPositionTo(position)` |
| `clickButtoninDropzone(buttonName)` |
| `increaseDecimalOption()` |
| `selectCategoryFromNumberTextFormatting(categoryName)` |
| `selectCategoryFromNumberTextFormattingInDropzone(categoryName)` |
| `selectOptionFromDropzoneContextMenu(menuItem)` |
| `subCategoryOption(option)` |
| `clickContextMenuButton(buttonText)` |
| `saveAndCloseContextMenu()` |
| `clickOkButtonInNumberTextFormatting()` |
| `closePulldown()` |
| `verifyNumberTextFormatOptionInCategoryDropDown(option)` |
| `verifyNumberTextFormatOptionInCategoryDropDownOnDropzone(option)` |

**Sub-components**
_none_

---

### ReportObjectBrowser
> Extends: `BaseObjectBrowser`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `DatasetSelectContainer` | `.objectBrowserContainer` | element |

**Actions**
| Signature |
|-----------|
| `clickShowAllObjectsButton()` |
| `clickFilterByCategory({ name, index = 0 })` |
| `scrollToBottom()` |

**Sub-components**
- getDatasetSelectContainer
- getToolbarContainer
- getFlatObjectListContainer

---

### ReportPageBy
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getSelectorNameByIdx(idx = 1)` |
| `getAllElementsFromPopupList()` |
| `getIndexForElementFromPopupList(elementName)` |
| `openPageBySelector(selectorName)` |
| `doubleClickPageBySelector(selectorName)` |
| `changePageByElement(selectorName, elementName)` |
| `searchElementFromSelector(selectorName, keyword)` |
| `openDropdownFromSelector(selectorName)` |
| `openPageByContextMenu()` |
| `openSelectorContextMenu(selectorName)` |
| `clickChecklistElementInContextMenu(attributeName)` |
| `clickBtnInContextMenu(btnName)` |
| `removeSelectorByDrag(objectToDrag)` |
| `reorderSelectorByDrag(objectToDrag, position, targetObject)` |
| `moveSelectorToRow(objectToDrag, position, targetObject)` |
| `moveSelectorToCol(objectToDrag, position, targetObject)` |
| `moveGridHeaderToPageBy(objectToDrag, position, targetObject)` |
| `saveAndCloseContextMenu()` |
| `removePageBy(selectorName)` |
| `openDisplayAttributeFormsDialog(attributeName)` |
| `addAttributes(position, targetObject, saveAndClose = false)` |

**Sub-components**
- datasetPanel
- openPage

---

### ReportPageBySorting
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `openDropdown(row, col)` |
| `selectFromDropdown(row, col, option)` |
| `removeRow(idx)` |
| `clickBtn(btn)` |
| `getSortingRowsCount()` |

**Sub-components**
_none_

---

### ReportPromptEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getAlertMessage()` |
| `clickEditorBtn(btnName)` |
| `chooseItemInAvailableCart(index, sectionName, itemName)` |
| `chooseItemsInAvailableCart(index, sectionName, itemNames)` |
| `doubleClickSelectedItem(index, sectionName, itemName)` |
| `singleClickSelectedItem(index, sectionName, itemName)` |
| `clickButtonInListCart(index, sectionName, itemName)` |
| `clickCheckBoxItem(index, sectionName, itemName)` |
| `clickCheckListCheckBoxItem(index, sectionName, itemName)` |
| `clickPullDownCell(index, sectionName)` |
| `clickItemFromPullDown(index, sectionName, item)` |
| `enterMetricValue(index, sectionName, value)` |
| `toggleViewSummaryBtn()` |
| `clickMatchTypeBtn(type)` |
| `clickExpressionType(index, sectionName, objectIndex, objectName)` |
| `clickExpressionForm(index, sectionName, objectIndex, objectName)` |
| `clickExpressionFunc(index, sectionName, objectIndex, objectName)` |
| `clickValueLabel(index, sectionName, objectIndex, objectName)` |
| `clickPopupItem(itemName)` |
| `enterExprValue(value)` |
| `clickPopupCellBtn(btnName)` |
| `clickExprElementLabel(index, sectionName, objectIndex, objectName)` |
| `doubleClickExprElement(elementName)` |
| `clickLevelLabel(index, sectionName, objectIndex, objectName)` |
| `clickChooseAttributeBtn()` |
| `enterSearchPattern(pattern)` |
| `doubleClickLevelAttributeItem(itemName)` |
| `clickLevelAttributeBtn(btnName)` |
| `clickAlertOKBtn()` |
| `clickApplyButtonInReportPromptEditor()` |
| `clickCancelButtonInReportPromptEditor()` |
| `isPromptEditorDisplayed()` |

**Sub-components**
_none_

---

### ReportReplaceObject
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ReplaceObjectDialog` | `.mstrmojo-ReplaceObject` | element |

**Actions**
| Signature |
|-----------|
| `waitForLoading()` |
| `openNewObjectDropdownByCurrentObjectName({ name, index = 0 })` |
| `selectInDropdownByName(option)` |
| `selectNewObjects(options)` |
| `toggleClearSettingsCheckbox()` |
| `clickOkButton()` |

**Sub-components**
- getReplaceObjectDataContainer

---

### ReportSqlView
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickSQLupdateBtn()` |
| `dndVerticalScrollbar(moveY)` |
| `isSqlViewDisplayed()` |
| `getSqlViewContent()` |
| `clickUpdateSqlView()` |

**Sub-components**
_none_

---

### ReportSubtotalsEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `setAppliedLevelValueSelector(subtotalName)` |
| `selectTypeCheckbox(type)` |
| `setAppliedLevel(appliedLevel, subtotalName)` |
| `clickButton(label)` |
| `clickGroupByEditorButton(label)` |
| `selectAttributeGroupByCheckbox(attribute)` |
| `expandAcrossLevelSelector()` |
| `selectAttributeAcrossLevel(attribute)` |
| `setByPositionValue(option, subtotalName)` |
| `clickCustomSubtotalsButton()` |
| `renameCustomSubtotalsName(newName)` |
| `clickSubtotalsSelector(metricName)` |
| `selectSubtotalsType(subtotalType, order)` |
| `customSubtotalsClickButton(label)` |
| `subtotalsByPositionClickButton(label)` |
| `saveAndCloseSubtotalsByPositionEditor()` |
| `editButtonCustomSubtotals()` |
| `removeButtonCustomSubtotals()` |
| `hoverOverCustomSubtotalOptions()` |
| `clickByPositionOptions()` |
| `clickSubtotalsPositionOption(position)` |
| `selectSubtotalsOption(subtotalOption, order)` |
| `saveAndCloseSubtotalsEditor()` |

**Sub-components**
_none_

---

### ReportTOC
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickPanelTab(panelName)` |
| `switchToEditorPanel()` |
| `clickErrorDetailsBtn()` |
| `switchToFormatPanel()` |
| `switchToFilterPanel()` |
| `switchToThemePanel()` |
| `isPanelEnabled()` |

**Sub-components**
- getPanel
- clickPanel

---

### is


**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ThemePanel` | `.theme-panel-container` | element |

**Actions**
| Signature |
|-----------|
| `isThemePanelDisplayed()` |

**Sub-components**
- getThemePanel

---

### ReportToolbar
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `dismissContextMenu()` |
| `actionOnToolbar(actionName, option = { isWait: true })` |
| `actionOnToolbarWithoutLoading(actionName)` |
| `hoverActionOnToolbar(actionName)` |
| `actionOnToolbarLoop(actionName, count)` |
| `selectOptionFromToolbarPullDownWithoutLoading(optionName)` |
| `selectOptionFromToolbarPullDown(optionName)` |
| `saveNewDossier(dossierFileName)` |
| `typeInNaturalLanguageQueryBox(text)` |
| `typeInNaturalLanguageQueryBoxNoSubmit(text)` |
| `switchToDesignMode(prompt = false)` |
| `clickBack()` |
| `clickReset(prompt = false)` |
| `clickUndo(authoring = false)` |
| `clickRedo(authoring = false)` |
| `isUndoEnabled(authoring = false)` |
| `isUndoDisabled(authoring = false)` |
| `isRedoEnabled(authoring = false)` |
| `isRedoDisabled(authoring = false)` |
| `switchToPauseMode()` |
| `switchToSqlView()` |
| `switchToGridView()` |
| `isSqlIconEnabled()` |
| `isPauseIconEnabled()` |
| `isGridIconEnabled()` |
| `rePrompt()` |
| `reExecute()` |

**Sub-components**
- reportPage
- dossierPage

---

### AttributeFilter
> Extends: `BaseAttribute`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SearchContainer` | `.attribute-elements-list-searchbox` | element |
| `SearchLoadingText` | `.searching-loading-text` | element |
| `AttributeElementList` | `.attribute-elemens-panel` | element |
| `SelectAll` | `.attribute-elements-select-all` | dropdown |
| `ClearAll` | `.attribute-elements-clear-all` | element |
| `DisabledViewSelected` | `.ant-switch-disabled` | element |

**Actions**
| Signature |
|-----------|
| `valueLoadedCount()` |
| `viewSelectedText()` |
| `waitForElementListLoading()` |
| `attributeSearch(searchText)` |
| `searchLoadingText()` |
| `clearAttributeSearch()` |
| `selectInView()` |
| `clearAll()` |
| `toggleViewSelected()` |
| `selectAttributeElement(elemName)` |
| `selectAttributeElements(elemNames)` |
| `attributeElementPresent(elemName)` |
| `attributeElementChecked(elemName)` |
| `scrollListToBottom()` |
| `selectAttributeListOperator(text)` |
| `getElementListCount()` |
| `isViewSelectedOn()` |
| `viewSelectedButtnEnabled()` |
| `isAttributeListOperatorSelected(text)` |

**Sub-components**
- getSearchContainer
- getDetailedPanel
- getAttributeListScrollPanel

---

### BaseAttribute
> Extends: `NewQual`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `QualifyOn` | `.attribute-form-selector.custom-select-search` | dropdown |
| `QualifyOnInfo` | `.attribute-form-selector-item-filter-details` | dropdown |
| `AttributeFormText` | `.ant-select-dropdown-menu-item-group-title` | dropdown |
| `QualifyOnDropdown` | `.ant-select-dropdown` | dropdown |

**Actions**
| Signature |
|-----------|
| `clickQualifyOn()` |
| `selectAttributeFormOperator(option)` |
| `selectAttributeFormOption(option, isInOrNotIn = false)` |
| `selectOperator()` |
| `getSelectedOperator()` |
| `getSelectedForm()` |
| `getAttributeOptionCount()` |

**Sub-components**
- getDetailedPanel

---

### BaseFilter
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FilterEditor` | `.mstr-filter-editor` | element |
| `DetailedPanel` | `.mstrd-FilterDetailsPanel` | element |
| `EditorContainer` | `.mstrd-FilterDetailsPanel .mstr-qualification-editor` | element |
| `FilterHeaderTitle` | `.mstrd-DropdownMenu-headerTitle` | dropdown |

**Actions**
| Signature |
|-----------|
| `done()` |
| `cancel()` |
| `save()` |
| `selectOption(selection)` |
| `selectOptions(selections)` |
| `clickFilterHeader()` |
| `qualHeaderText()` |
| `editorLabelPresent(text)` |
| `doneButtonEnabled()` |
| `saveEnabled()` |
| `getOptionItemsCount()` |

**Sub-components**
- getEditorContainer
- getDetailedPanel

---

### CustomInputBox
> Extends: `BaseAttribute`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `CustomContainer` | `.attribute-form-list-input-editor` | input |
| `ListTitle` | `.header-title` | element |

**Actions**
| Signature |
|-----------|
| `clear()` |
| `clearByKeyboard()` |
| `focusOnInputArea()` |
| `inputListOfValue(text)` |
| `validate()` |
| `validateAndWait(isValid = true)` |
| `importFile()` |
| `exportFile()` |
| `clearAllInputs()` |
| `uploadFile({ fileName, fileUploader })` |
| `importValuesFromFile({ fileName, isValid = true })` |
| `validateButtonEnabled()` |
| `getValidationText()` |
| `getCurrentInputText()` |

**Sub-components**
- getDetailedPanel
- getCustomContainer
- getFormQualificationContainer

---

### InlineFilterItem
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `OperatorDropdown` | `.ant-select-dropdown:not(.ant-select-dropdown-hidden) .rc-virtual-list` | dropdown |
| `DateTimePicker` | `.mstr-date-picker-dropdown:not(.ant-picker-dropdown-hidden)` | dropdown |

**Actions**
| Signature |
|-----------|
| `enterValue({ value, index = 0 })` |
| `clearValue(index = 0)` |
| `waitForAttributeListValueUpdate(text)` |
| `openDateTimePicker(index = 0)` |
| `dismissDropdown()` |
| `enterValueToDateTimePicker({ value, index = 0 })` |
| `selectDateTime({ year, month, day, index = 0 })` |
| `openOperatorDropdown()` |
| `setOperator(name)` |
| `selectYear(year)` |
| `selectMonth(year, month)` |
| `openDynamicDateTimePicker()` |
| `setDynamicDate(option)` |
| `clickDoneButtonInDynamicDatePicker()` |
| `openContextMenu()` |
| `getDateTimeInputValue(index = 0)` |

**Sub-components**
_none_

---

### MetricFilter
> Extends: `NewQual`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `QualificationEditor` | `.mstr-qualification-editor` | element |
| `DoneButton` | `.qualification-save-btn` | button |
| `BreakBySelector` | `.predicate-metric-qualification-break-by-selector:not(.ant-select-dropdown)` | dropdown |
| `SelectedBreakByTitle` | `.predicate-metric-qualification-break-by-selector-label` | dropdown |
| `GroupBySelector` | `.predicate-metric-qualification-output-level-selector-attributes:not(.ant-select-dropdown)` | dropdown |
| `SearchGroupByDropdown` | `.predicate-metric-qualification-output-level-selector-attributes.ant-select-dropdown` | dropdown |

**Actions**
| Signature |
|-----------|
| `clickSelectorByName(selectorName, open = true)` |
| `openSelector(selectorName)` |
| `closeSelector(selectorName)` |
| `clickSelectorOnDetailsPanel(selectorName)` |
| `clickAdvancedOptionButton()` |
| `clickAdvancedOptionCheckbox()` |
| `clickBreakBySelector()` |
| `clickGroupBySelector()` |
| `searchGroupBy(searchText)` |
| `selectGroupByObject(objName)` |
| `getSelectedFunction()` |
| `getSelectedOperator()` |
| `getSelectedBreakBy()` |
| `groupedByAttributes()` |
| `advancedOptionsMessage()` |
| `isAdvancedOptionChecked()` |

**Sub-components**
- getDetailedPanel

---

### NewQual
> Extends: `ValueInput`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `NewMenu` | `.mstrd-DropdownMenu-headerIcon--addBtn` | button |
| `MultiselectToolbar` | `.object-search-multiselect-toolbar` | dropdown |
| `ObjectLocationTooltip` | `.object-tooltip-location` | element |
| `ObjectDescTooltip` | `.object-tooltip-description` | element |
| `CreateEmbeddedPromptButton` | `.mstr-embedded-prompt-creation-button[data-feature-id=mstr-embedded-prompt-creation-button]` | button |

**Actions**
| Signature |
|-----------|
| `basedOnText()` |
| `objectListHeader()` |
| `create()` |
| `selectBasedOnObject(objName, selectorCls)` |
| `searchBasedOn(searchText)` |
| `clickBasedOn(selectorCls)` |
| `hoverOnBasedObject(objName, selectorCls)` |
| `clickBasedOnCategory(category)` |
| `clickCreateEmbeddedPrompt()` |
| `isSearchBasedOnCategoryShown(category)` |
| `getSearchBasedOnObjectCountValue()` |
| `newQualLinkText()` |
| `isNewEnabled()` |
| `basedOnObjectShown(objName, selectorCls)` |
| `getObjectLocationText()` |
| `getObjectDescText()` |

**Sub-components**
- getEditorContainer
- getDetailedPanel
- getDetailedRightPanel

---

### DateTimePicker
> Extends: `BaseAttribute`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `DateTimePicker` | `.mstr-date-time-picker-popup:not(.ant-picker-dropdown-hidden)` | dropdown |
| `APMRadioGroup` | `.mstr-time-picker-radio` | element |
| `TimePickerContainer` | `.mstr-time-picker-popup` | element |

**Actions**
| Signature |
|-----------|
| `switchToDynamicDate()` |
| `switchToStaticDate()` |
| `openDatePicker(index = 1)` |
| `openTimePicker(index = 1)` |
| `clickHeaderIcon(el, times)` |
| `clickNextYear(times)` |
| `clickLastMonth(times)` |
| `selectDay(day)` |
| `clickAdjustmentBtn()` |
| `clickExcludeWeekendButton()` |
| `selectHour(hour)` |
| `selectMinute(min)` |
| `selectSecond(sec)` |
| `commitDynamicDate()` |
| `commitTimeChange()` |
| `inputDynamicHour(hour)` |
| `inputDynamicMinute(min)` |
| `isDateInputPresent()` |
| `isTimeInputPresent()` |
| `isTimePickerPresent()` |
| `isHourOffsetPresent()` |
| `isMinuteOffsetPresent()` |
| `isAdjustmentAreaPresent()` |
| `isDynamicDatePickerPresent()` |
| `getTimeValue(index = 1)` |

**Sub-components**
- getDetailedPanel
- getDynamicDatePickerContainer
- getTimePickerContainer
- getDayInWidget
- getTimeInWidget
- getHourOffsetContainer
- getMinuteOffsetContainer

---

### ReportFilter
> Extends: `BaseFilter`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FilterIcon` | `.mstr-nav-icon.icon-tb_filter_n` | element |
| `FilterPanel` | `.mstrd-FilterDropdownMenuContainer` | dropdown |
| `Tooltip` | `.ant-tooltip-content` | element |
| `CloseIcon` | `.mstrd-DropdownMenu-headerIcon.icon-pnl_close` | dropdown |
| `FilterSummary` | `.mstrd-ReportFilterPanelContent-summaryBtn` | button |
| `DropdownContainer` | `ant-dropdown-open` | dropdown |
| `ApplyBtn` | `.filter-apply-button .ant-btn` | button |
| `ContextMenu` | `.mstr-dropdown:not(.ant-dropdown-hidden)` | dropdown |
| `AdvancedOptionContent` | `.advanced-option-text .mstr-checkbox` | element |
| `FilterMenu` | `.mstrd-Popover` | element |
| `ResizeBorder` | `.mstrd-DropdownMenu-resizeHandler` | dropdown |
| `WaitLoading` | `.mstrmojo-Editor.mstrWaitBox.modal` | element |

**Actions**
| Signature |
|-----------|
| `filterSummaryContainer()` |
| `emptyFilterSummarySuggestionText()` |
| `emptyFilterBodytext()` |
| `emptyFilterBodyCaption()` |
| `open()` |
| `close()` |
| `apply()` |
| `removeAllFilter()` |
| `clickFilterSummary()` |
| `selectExpression({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 })` |
| `deleteExpression({ expType = 'New Qualification', objectName = 'EMPTY', index = 0 })` |
| `selectExpressionContextMenu({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 })` |
| `selectContextMenuOption(optionText)` |
| `clickAdvancedCheckbox()` |
| `openFilterByHeader({ expType, objectName, index })` |
| `waitForViewFilterPanelLoading()` |
| `groupFilter(index = 1)` |
| `ungroupFilter(index = 1)` |
| `openGroupOperator(index = 1)` |
| `NOTGroupFilter(index = 1)` |
| `clickSettingIcon()` |
| `selectSetting(text)` |
| `pin()` |
| `unpin()` |
| `clickViewFilterArrow()` |
| `scrollToBottom()` |
| `dragFilterWidth()` |
| `expressionSelected({ expType = 'New Qualification', objectName = 'EMPTY', index = 0 })` |
| `expressionInvalid({ expType = 'New Qualification', objectName = 'EMPTY', index = 0 })` |
| `expressionInProgress({ expType = 'New Qualification', objectName = 'EMPTY', index = 0 })` |
| `expressionValid({ expType = 'New Qualification', objectName = 'EMPTY', index = 0 })` |
| `filterSummaryText({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 })` |
| `filterSummaryBoxValue({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 })` |
| `isExpressionPresent({ expType = 'New Qualification', objectName = 'EMPTY', index = 1, value })` |
| `inlineEnterValue({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 }, value)` |
| `inlineChangeOperator({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 }, option)` |
| `inlineDeleteElement({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 }, deleteIndex = 1)` |
| `selectGroupOperator(text = 'AND')` |
| `triggerFilterSectionInfoIcon(section = 'Scope Filters')` |
| `isMainPanelPresent()` |
| `isDetailedPanelPresent()` |
| `getExpressionGroupCount()` |
| `getGroupActionLinkCount()` |
| `isUngroupLinkPresent(index = 1)` |
| `isGroupLinkPresent(index = 1)` |
| `getGroupOperatorCount(text)` |
| `getOperatorText(index = 1)` |
| `getGroupOperatorItemCount()` |
| `getNOTCount()` |
| `getAggregationFilterCount()` |
| `getViewFilterCount()` |
| `applyButtonEnabled()` |
| `isContextMenuOptionPresent(optionText)` |
| `isAdvancedChecked()` |
| `isPanelDocked()` |
| `isViewFilterCollapsed()` |
| `getPanelWidth()` |
| `getTooltipText()` |

**Sub-components**
- dossierPage
- reportPage
- getFilterPanel
- getMainPanel
- getExpressionContextMenuContainer
- isMainPanel
- getDetailedPanel
- waitForViewFilterPanel
- getExpressionContainer

---

### ReportSummary
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SummaryBar` | `.mstrd-FilterSummary` | element |
| `SummaryPanel` | `.mstrd-FilterSummaryPanel` | element |
| `FilterPanel` | `.mstrd-FilterDropdownMenuContainer .mstrd-DropdownMenu` | dropdown |

**Actions**
| Signature |
|-----------|
| `getSummaryBarText()` |
| `getLeafRowValue(section, name, index = 1)` |
| `getSetRowValue(section, name, index = 1)` |
| `getViewFilterRowValue(name, index = 1)` |
| `viewAll()` |
| `viewLess()` |
| `scrollToBottom()` |
| `edit({ name, isSetFilter = false, index = 1, section = reportFilterSections.VIEW_FILTER })` |
| `isFilterSummaryPanelPresent()` |
| `isSummaryBarPresent()` |

**Sub-components**
- getSummaryPanel
- getFilterPanel

---

### SetFilter
> Extends: `ReportFilter`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Popover` | `.ant-popover:not(.ant-popover-hidden)` | element |
| `RelateBySearchDropdown` | `.ant-select-dropdown.predicate-relation-type-select` | dropdown |
| `SetPopover` | `.ant-popover.predicate-relation-popover` | element |
| `SetOfDropdown` | `.object-search-pulldown-dropdown-multiple` | dropdown |

**Actions**
| Signature |
|-----------|
| `openSet({ objectName, text, index = 1 })` |
| `clickSetSelectorByName(selectorName, open = true)` |
| `openSelector(selectorName)` |
| `closeSelector(selectorName)` |
| `closeSet()` |
| `closeFilterSetPopopver()` |
| `searchInAuthoring(optionName, type = 'Attribute')` |
| `selectOptionsInAuthoring(selections)` |
| `isSetNodePresent({ objectName = 'EMPTY', index = 0 })` |
| `setNegation({ index })` |
| `getSelectedSetOf()` |
| `getSelectedRelatedBy()` |
| `relateByText({ objectName, index = 0 })` |
| `advancedOptionText({ index = 0 })` |

**Sub-components**
- getRelateByContainer
- getAdvancedOptionTextContainer

---

### ValueInput
> Extends: `BaseFilter`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FormQualificationContainer` | `.predicate-form-qualification` | element |
| `ValueInfo` | `.qualification-value-input-box-error-text` | input |
| `PromptValueInput` | `.predicate-qualification-value-input.prompt` | input |

**Actions**
| Signature |
|-----------|
| `selectValue()` |
| `enterValue(value, index = 1)` |
| `clearValue(index = 1)` |
| `getValueInputCount()` |
| `promptValueText()` |
| `valueValidationText()` |

**Sub-components**
- getDetailedPanel

---

### ReportPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Container` | `.mstrd-DossierViewContainer` | element |
| `PageByButton` | `.mstrd-NavItemWrapper.mstrd-PageByToggleNavItemContainer.mstr-navbar-item` | element |
| `FirstPageByDropdown` | `.mstrmojo-ui-Pulldown.mstrmojo-ui-SearchablePulldown` | element |
| `reportHeader` | `.ag-header-container` | element |
| `ReExecuteButton` | `.mstrd-NavItemWrapper.mstrd-reExecuteNavItem.mstr-navbar-item` | element |
| `MojoLoadingBox` | `.mstrmojo-Editor.mstrWaitBox.modal` | element |
| `ReportEditButton` | `.mstr-nav-icon.icon-info_edit` | element |
| `DrillNotificationBox` | `.mstrd-PageNotification-container.mstrd-PageNotification-container--drill #go-back-msg` | element |
| `DrillOptionsDialog` | `.mstr-rc-dialog.drill-options-dialog` | element |
| `ReportErrorDialog` | `.report-error-popup` | element |
| `ConfirmSaveDialog` | `.mstrmojo-Editor.mstrmojo-ConfirmSave-Editor` | element |
| `CancelExecutionBtn` | `.mstrd-DocumentExecuteCancelButton` | button |
| `ReportAuthoringCloseBtn` | `.icon-authoring-close.mstr-nav-icon` | element |
| `LibraryIcon` | `.mstr-nav-icon.icon-library` | element |
| `CancelButtonInTopLoadingBar` | `.mstrmojo-Editor-content .mstrWaitCancel` | element |
| `GridViewSectionInPauseMode` | `.report-editor .mstmojo-freezingImgTableCell` | element |
| `MissingFontPopup` | `.missing-fonts-modal .ant-modal-content` | element |
| `ReportTitleBar` | `.mstrd-DossierTitle` | element |
| `ConfirmDialog` | `.confirmation-dialog` | element |

**Actions**
| Signature |
|-----------|
| `goToLibrary()` |
| `waitForReportLoading(isAuthoring = false)` |
| `waitForBlankReportLoading()` |
| `waitForDrillNotificationBox()` |
| `refreshNoWait()` |
| `clickCancelExecutionBtn()` |
| `clickFirstPageByDropdown()` |
| `chooseSecondIteminPageByDropdown()` |
| `dismissMissingFontPopup()` |
| `openUserAccountMenu()` |
| `clickAccountOption(text)` |
| `logout(options = {})` |
| `openPreferencePanel()` |
| `closeUserAccountMenu()` |
| `switchUser(credentials)` |
| `clickNewReportButton()` |
| `closeReportAuthoring()` |
| `closeReportAuthoringWithoutSave()` |
| `confirmCloseWithoutSaving()` |
| `clickPageByButton()` |
| `clickCancelButtonInTopLoadingBar(option)` |
| `clickDoNotSaveButtonInConfirmSaveDialog(option)` |
| `confirmToSaveAndSetTemplate()` |
| `clickOKInConfirmDialog()` |
| `cancelInConfirmDialog()` |
| `resizeEditorPanel(numOfPixels)` |
| `clickReportTitle()` |
| `isMojoWaitingPresent()` |
| `isEditButtonDisplay()` |
| `reportAuthoringMode()` |
| `isAccountIconPresent()` |
| `isAccountOptionPresent(text)` |
| `isLogoutPresent()` |
| `isCancelExecutionBtnPresent()` |
| `isInPauseMode()` |
| `isReportErrorPopupPresent()` |

**Sub-components**
- loginPage
- getPage
- getFirstPage
- getSecondIteminPage
- getRightResizeableDividerOnEditorPanel

---

### reportPageBuilder


**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| _none_ |

**Sub-components**
_none_
