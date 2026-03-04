# Site Knowledge: Report Domain

## Overview

- **Domain key:** `report`
- **Components covered:** AdvancedReportProperties, AttributeFilter, BaseAttribute, BaseFilter, CustomInputBox, DateTimePicker, InlineFilterItem, is, is, is, is, MDXSourceSelector, MetricFilter, NewQual, ReportAttributeFormsDialog, ReportContextualLinkingDialog, ReportCubeBrowser, ReportDatasetPanel, ReportDerivedMetricEditor, ReportEditorCustomInputBox, ReportEditorPanel, ReportEmbeddedPromptEditor, ReportFilter, ReportFilterPanel, ReportFormatPanel, ReportGrid, ReportGridView, ReportMenubar, ReportNumberTextFormatting, ReportObjectBrowser, ReportPage, reportPageBuilder, ReportPageBy, ReportPageBySorting, ReportPromptEditor, ReportReplaceObject, ReportSqlView, ReportSubtotalsEditor, ReportSummary, ReportTOC, ReportToolbar, SetFilter, ValueInput
- **Spec files scanned:** 160
- **POM files scanned:** 43

## Components

### AdvancedReportProperties
- **CSS root:** `.rc-virtual-list`
- **User-visible elements:**
  - Selector Dropdown Container (`.rc-virtual-list`)
- **Component actions:**
  - `changePromptOrder(source, target)`
  - `checkEvaluationOrder(option, expectItem)`
  - `checkMultiplePropertyValue(option, expectItem)`
  - `checkPromptElement(Title, Order, Location, Required)`
  - `checkPropertyValue(item)`
  - `checkPropertyValueDetails(option, expectItem)`
  - `checkPropertyValuePulldownList(option, expectItem)`
  - `checkPropertyValueSQLPreview(option, expectItem)`
  - `checkUnsortablePromptElement(Title, Location, Required)`
  - `clearSearchBox()`
  - `clickAddNewPropertyButton()`
  - `clickDefaultEvaluationOrder()`
  - `clickDoneCancelButton(option)`
  - `clickEvaluationOrder(option)`
  - `clickInSearchBox()`
  - `confirmDeleteProperty()`
  - `copyPreviewSQLForPropertySetting(option)`
  - `deleteProperty(propertyName)`
  - `dragAndDropPrompt(index, y)`
  - `expandOrCollapsedPropertyTab(settingStatus, option)`
  - `getEvaluationOrderList(option)`
  - `getMutiplePropertyValuePulldownList(option)`
  - `getPromptElement(promptTitle, promptItem)`
  - `getPromptIconByTitle(promptTitle)`
  - `getPromptOrder(option)`
  - `getPropertySettingDetailsByName(settingName)`
  - `getPropertySettingsValueRowByName(settingName)`
  - `getPropertyValueDetails(option)`
  - `getPropertyValueInputEdit(option)`
  - `getPropertyValuePulldownList(option)`
  - `getPropertyValueSQLPreview(option)`
  - `getPropertyValueSQLPreviewText(option, text)`
  - `insertPropertyValue(option, inserValue)`
  - `isReportPropertiesWindowPresent()`
  - `modifyPropertySettingsInput(settingName, settingValue)`
  - `modifyPropertySettingsPicker(settingName, settingValue)`
  - `modifyPropertyValue(item)`
  - `resetOrders()`
  - `saveProperty()`
  - `selectDefaultEvaluationOrder(option)`
  - `selectFromEvaluationOrderList(option)`
  - `selectPropertyValuePulldownList(list, option)`
  - `selectReportPropertyType(option)`
  - `setPropertyName(propertyName)`
  - `setPropertyValue(propertyValue)`
  - `switchEvaluationTable(option, ExpectedStatus)`
  - `typeInSearchBox(searchString)`
  - `updateSchemaOptionCheckbox(settingName, settingStatus)`
  - `updateViewEditsToggleButton(settingStatus)`
  - `waitForDatasetEvaluationTableToBeInvisible()`
  - `waitForDropdownVisible(timeout = 5000)`
  - `waitForObjectDisappear(objectName, timeout = 2000)`
  - `waitForOptionClickable(optionElement, timeout = 5000)`
  - `waitForViewEvaluationTableToBeInvisible()`
  - `waitToBePresent(locator, timeout = 5000, msg = undefined)`
- **Related components:** getOneRowSettingContainer, getSelectorDropdownContainer

### AttributeFilter
- **CSS root:** `.attribute-elements-list-searchbox`
- **User-visible elements:**
  - Attribute Element List (`.attribute-elemens-panel`)
  - Clear All (`.attribute-elements-clear-all`)
  - Disabled View Selected (`.ant-switch-disabled`)
  - Search Container (`.attribute-elements-list-searchbox`)
  - Search Loading Text (`.searching-loading-text`)
  - Select All (`.attribute-elements-select-all`)
- **Component actions:**
  - `attributeElementChecked(elemName)`
  - `attributeElementPresent(elemName)`
  - `attributeSearch(searchText)`
  - `clearAll()`
  - `clearAttributeSearch()`
  - `getElementListCount()`
  - `isAttributeListOperatorSelected(text)`
  - `isViewSelectedOn()`
  - `scrollListToBottom()`
  - `searchLoadingText()`
  - `selectAttributeElement(elemName)`
  - `selectAttributeElements(elemNames)`
  - `selectAttributeListOperator(text)`
  - `selectInView()`
  - `toggleViewSelected()`
  - `valueLoadedCount()`
  - `viewSelectedButtnEnabled()`
  - `viewSelectedText()`
  - `waitForElementListLoading()`
- **Related components:** getAttributeListScrollPanel, getDetailedPanel, getSearchContainer

### BaseAttribute
- **CSS root:** `.ant-select-dropdown-menu-item-group-title`
- **User-visible elements:**
  - Attribute Form Text (`.ant-select-dropdown-menu-item-group-title`)
  - Qualify On (`.attribute-form-selector.custom-select-search`)
  - Qualify On Dropdown (`.ant-select-dropdown`)
  - Qualify On Info (`.attribute-form-selector-item-filter-details`)
- **Component actions:**
  - `clickQualifyOn()`
  - `getAttributeOptionCount()`
  - `getSelectedForm()`
  - `getSelectedOperator()`
  - `selectAttributeFormOperator(option)`
  - `selectAttributeFormOption(option, isInOrNotIn = false)`
  - `selectOperator()`
- **Related components:** getDetailedPanel

### BaseFilter
- **CSS root:** `.mstrd-FilterDetailsPanel .mstr-qualification-editor`
- **User-visible elements:**
  - Detailed Panel (`.mstrd-FilterDetailsPanel`)
  - Editor Container (`.mstrd-FilterDetailsPanel .mstr-qualification-editor`)
  - Filter Editor (`.mstr-filter-editor`)
  - Filter Header Title (`.mstrd-DropdownMenu-headerTitle`)
- **Component actions:**
  - `cancel()`
  - `clickFilterHeader()`
  - `done()`
  - `doneButtonEnabled()`
  - `editorLabelPresent(text)`
  - `getOptionItemsCount()`
  - `qualHeaderText()`
  - `save()`
  - `saveEnabled()`
  - `selectOption(selection)`
  - `selectOptions(selections)`
- **Related components:** getDetailedPanel, getEditorContainer

### CustomInputBox
- **CSS root:** `.attribute-form-list-input-editor`
- **User-visible elements:**
  - Custom Container (`.attribute-form-list-input-editor`)
  - List Title (`.header-title`)
- **Component actions:**
  - `clear()`
  - `clearAllInputs()`
  - `clearByKeyboard()`
  - `exportFile()`
  - `focusOnInputArea()`
  - `getCurrentInputText()`
  - `getValidationText()`
  - `importFile()`
  - `importValuesFromFile({ fileName, isValid = true })`
  - `inputListOfValue(text)`
  - `uploadFile({ fileName, fileUploader })`
  - `validate()`
  - `validateAndWait(isValid = true)`
  - `validateButtonEnabled()`
- **Related components:** getCustomContainer, getDetailedPanel, getFormQualificationContainer

### DateTimePicker
- **CSS root:** `.mstr-time-picker-popup`
- **User-visible elements:**
  - APMRadio Group (`.mstr-time-picker-radio`)
  - Date Time Picker (`.mstr-date-time-picker-popup:not(.ant-picker-dropdown-hidden)`)
  - Time Picker Container (`.mstr-time-picker-popup`)
- **Component actions:**
  - `clickAdjustmentBtn()`
  - `clickExcludeWeekendButton()`
  - `clickHeaderIcon(el, times)`
  - `clickLastMonth(times)`
  - `clickNextYear(times)`
  - `commitDynamicDate()`
  - `commitTimeChange()`
  - `getTimeValue(index = 1)`
  - `inputDynamicHour(hour)`
  - `inputDynamicMinute(min)`
  - `isAdjustmentAreaPresent()`
  - `isDateInputPresent()`
  - `isDynamicDatePickerPresent()`
  - `isHourOffsetPresent()`
  - `isMinuteOffsetPresent()`
  - `isTimeInputPresent()`
  - `isTimePickerPresent()`
  - `openDatePicker(index = 1)`
  - `openTimePicker(index = 1)`
  - `selectDay(day)`
  - `selectHour(hour)`
  - `selectMinute(min)`
  - `selectSecond(sec)`
  - `switchToDynamicDate()`
  - `switchToStaticDate()`
- **Related components:** getDayInWidget, getDetailedPanel, getDynamicDatePickerContainer, getHourOffsetContainer, getMinuteOffsetContainer, getTimeInWidget, getTimePickerContainer

### InlineFilterItem
- **CSS root:** `.mstr-date-picker-dropdown:not(.ant-picker-dropdown-hidden)`
- **User-visible elements:**
  - Date Time Picker (`.mstr-date-picker-dropdown:not(.ant-picker-dropdown-hidden)`)
  - Operator Dropdown (`.ant-select-dropdown:not(.ant-select-dropdown-hidden) .rc-virtual-list`)
- **Component actions:**
  - `clearValue(index = 0)`
  - `clickDoneButtonInDynamicDatePicker()`
  - `dismissDropdown()`
  - `enterValue({ value, index = 0 })`
  - `enterValueToDateTimePicker({ value, index = 0 })`
  - `getDateTimeInputValue(index = 0)`
  - `openContextMenu()`
  - `openDateTimePicker(index = 0)`
  - `openDynamicDateTimePicker()`
  - `openOperatorDropdown()`
  - `selectDateTime({ year, month, day, index = 0 })`
  - `selectMonth(year, month)`
  - `selectYear(year)`
  - `setDynamicDate(option)`
  - `setOperator(name)`
  - `waitForAttributeListValueUpdate(text)`
- **Related components:** _none_

### is
- **CSS root:** `.mstr-qualification-editor.mode-authoring:not(.mstr-qualification-editor--inline)`
- **User-visible elements:**
  - Detailed Right Panel (`.mstr-qualification-editor.mode-authoring:not(.mstr-qualification-editor--inline)`)
- **Component actions:**
  - `openOperatorDropdown()`
  - `openQualifyOnDropdown()`
  - `toggleElementListMode()`
- **Related components:** getDetailedPanel, getDetailedRightPanel

### is
- **CSS root:** `.mstr-qualification-editor.mode-authoring:not(.mstr-qualification-editor--inline)`
- **User-visible elements:**
  - Detailed Right Panel (`.mstr-qualification-editor.mode-authoring:not(.mstr-qualification-editor--inline)`)
  - Object Search Dropdown (`.object-search-pulldown-dropdown:not(.ant-select-dropdown-hidden)`)
- **Component actions:**
  - `waitForObjectSearchDropdown()`
- **Related components:** getDetailedRightPanel

### is
- **CSS root:** `.ant-select-dropdown:not(.ant-select-dropdown-hidden)`
- **User-visible elements:**
  - Dropdown (`.ant-select-dropdown:not(.ant-select-dropdown-hidden)`)
  - Object Search Dropdown (`.object-search-pulldown-dropdown:not(.ant-select-dropdown-hidden)`)
- **Component actions:**
  - `waitForDropdownDisplayed()`
  - `waitForDropdownHidden()`
  - `waitForObjectSearchDropdown()`
- **Related components:** getDetailedRightPanel

### is
- **CSS root:** `.theme-panel-container`
- **User-visible elements:**
  - Theme Panel (`.theme-panel-container`)
- **Component actions:**
  - `isThemePanelDisplayed()`
- **Related components:** getThemePanel

### MDXSourceSelector
- **CSS root:** `.mdx-report-object-browser-container`
- **User-visible elements:**
  - Dataset Select Container (`.mdx-report-object-browser-container`)
- **Component actions:**
  - _none_
- **Related components:** _none_

### MetricFilter
- **CSS root:** `.predicate-metric-qualification-break-by-selector:not(.ant-select-dropdown)`
- **User-visible elements:**
  - Break By Selector (`.predicate-metric-qualification-break-by-selector:not(.ant-select-dropdown)`)
  - Done Button (`.qualification-save-btn`)
  - Group By Selector (`.predicate-metric-qualification-output-level-selector-attributes:not(.ant-select-dropdown)`)
  - Qualification Editor (`.mstr-qualification-editor`)
  - Search Group By Dropdown (`.predicate-metric-qualification-output-level-selector-attributes.ant-select-dropdown`)
  - Selected Break By Title (`.predicate-metric-qualification-break-by-selector-label`)
- **Component actions:**
  - `advancedOptionsMessage()`
  - `clickAdvancedOptionButton()`
  - `clickAdvancedOptionCheckbox()`
  - `clickBreakBySelector()`
  - `clickGroupBySelector()`
  - `clickSelectorByName(selectorName, open = true)`
  - `clickSelectorOnDetailsPanel(selectorName)`
  - `closeSelector(selectorName)`
  - `getSelectedBreakBy()`
  - `getSelectedFunction()`
  - `getSelectedOperator()`
  - `groupedByAttributes()`
  - `isAdvancedOptionChecked()`
  - `openSelector(selectorName)`
  - `searchGroupBy(searchText)`
  - `selectGroupByObject(objName)`
- **Related components:** getDetailedPanel

### NewQual
- **CSS root:** `.mstr-embedded-prompt-creation-button[data-feature-id=mstr-embedded-prompt-creation-button]`
- **User-visible elements:**
  - Create Embedded Prompt Button (`.mstr-embedded-prompt-creation-button[data-feature-id=mstr-embedded-prompt-creation-button]`)
  - Multiselect Toolbar (`.object-search-multiselect-toolbar`)
  - New Menu (`.mstrd-DropdownMenu-headerIcon--addBtn`)
  - Object Desc Tooltip (`.object-tooltip-description`)
  - Object Location Tooltip (`.object-tooltip-location`)
- **Component actions:**
  - `basedOnObjectShown(objName, selectorCls)`
  - `basedOnText()`
  - `clickBasedOn(selectorCls)`
  - `clickBasedOnCategory(category)`
  - `clickCreateEmbeddedPrompt()`
  - `create()`
  - `getObjectDescText()`
  - `getObjectLocationText()`
  - `getSearchBasedOnObjectCountValue()`
  - `hoverOnBasedObject(objName, selectorCls)`
  - `isNewEnabled()`
  - `isSearchBasedOnCategoryShown(category)`
  - `newQualLinkText()`
  - `objectListHeader()`
  - `searchBasedOn(searchText)`
  - `selectBasedOnObject(objName, selectorCls)`
- **Related components:** getDetailedPanel, getDetailedRightPanel, getEditorContainer

### ReportAttributeFormsDialog
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `cancelAndCloseAttributeFormsDialog()`
  - `clickButton(btnName)`
  - `clickDefaultFormCheckBox()`
  - `enableDisplayAttributeForms(formNames, save = true)`
  - `enableReportObjectsForms(formNames, save = true)`
  - `getAlertMessage(message)`
  - `getAlertOKBtn()`
  - `getCurrentAttributeDisplayFormModeText()`
  - `isAttributeFormChecked(form)`
  - `isAttributeFormPresent(form)`
  - `isDefaultFormsCheckboxChecked()`
  - `isUseDefaultFormsChecked()`
  - `saveAndCloseAttributeFormsDialog()`
  - `selectDisplayAttributeFormMode(formMode, save = false)`
- **Related components:** _none_

### ReportContextualLinkingDialog
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `checkTargetReportName(targetReportName)`
  - `clickDoneButtonInContextualLinkingEditor()`
  - `clickLinkToButton()`
  - `clickOpenInNewWindowCheckbox()`
  - `copyLink(copyLinkButton, linkCheckBoxName, objectCheckBoxName, copyButton)`
  - `renameContextualLink(newName)`
  - `selectAnswerPromptType(answerType)`
  - `selectPromptAnswerType(answerPromptType)`
  - `selectTargetObject(objectName)`
  - `selectTargetPrompt(targetPrompt)`
- **Related components:** linkContainer

### ReportCubeBrowser
- **CSS root:** `.dataset-selector-dialog`
- **User-visible elements:**
  - Dataset Select Container (`.dataset-selector-dialog`)
- **Component actions:**
  - _none_
- **Related components:** _none_

### ReportDatasetPanel
- **CSS root:** `.mstr-object-list-container`
- **User-visible elements:**
  - Folder Browser Popover (`.ant-select-tree-list-holder`)
  - Object Browser Panel (`.objectBrowserContainer`)
  - Object List Container (`.mstr-object-list-container`)
  - Report Editor Dataset (`.report-editor-dataset`)
  - Report Objects Panel (`.report-objects`)
  - Report View Filter Panel Container (`.view-filter-tab`)
  - Search Loading (`.search-loading-spinner`)
  - Status Bar (`.report-footer`)
  - Three Dots To Open Cube Menu (`.reportObjectsContainer .ant-dropdown-trigger.cube-menu`)
- **Component actions:**
  - `addMultipleObjectsToColumns(objectNames)`
  - `addMultipleObjectsToPageBy(objectNames)`
  - `addMultipleObjectsToRows(objectNames)`
  - `addObject(objectName, option)`
  - `addObjectToColumns(objectName)`
  - `addObjectToPageBy(objectName)`
  - `addObjectToReport(objectName)`
  - `addObjectToRows(objectName)`
  - `clickBottomBarToLoseFocus()`
  - `clickFolderUpIcon()`
  - `clickFolderUpMultipleTimes(count)`
  - `clickObjectContextMenuItem(menuItem)`
  - `clickObjectContextSubmenuItem(itemName)`
  - `clickObjectInReportObjectsPanel(objectName)`
  - `clickToCloseContextMenu()`
  - `contextMenuContainsOption(option)`
  - `dndByMultiSelectFromObjectBrowserToReportObjectsPanel(objectNames, options = {})`
  - `dndByMultiSelectFromReportObjectsToViewFilter({ objectNames, target })`
  - `dndFromGridToObjectsPanel(objectName)`
  - `dndFromObjectBrowserToGrid(objectName)`
  - `dndFromObjectBrowserToGridCell(objectName, targetObj)`
  - `dndFromObjectBrowserToGridHeader(objectName, targetObj)`
  - `dndFromObjectBrowserToPageBy(objectName)`
  - `dndFromObjectBrowserToPageBy(objectName)`
  - `dndFromObjectBrowserToReportFilter(objectName)`
  - `dndFromObjectBrowserToReportFilters({ objectName, target = 'report filters', options = {} })`
  - `dndFromObjectBrowserToReportObjectsPanel(objectName, options = {})`
  - `dndFromObjectBrowserToReportViewFilter({ objectName, target = 'filter data', options = {} })`
  - `dndFromObjectListToReportFilter(objectName)`
  - `dndFromObjectPanelToContainer(objectName, destination, options = {})`
  - `dragObjectToGrid(objectName)`
  - `getAllElementsInReportPane()`
  - `getItemsInDataSetPanel()`
  - `getJoinMenuIcon(objectName, joinType)`
  - `getMetricInReportTabByIcon(objectName, classname)`
  - `getObjectInObjectsPanel(objectName)`
  - `hoverActionInReportTab(objectName)`
  - `hoverObjectContextSubmenuItem(menuItems)`
  - `isObjectInReportTabDisplayed(objectName)`
  - `isSubmenuOptionSelected(menuItems)`
  - `multipleSelectObjects(objectNames)`
  - `multipleSelectOnReportObjects(objectNames)`
  - `multiSelectObjects(objectName1, objectName2)`
  - `navigateInObjectBrowser(paths)`
  - `navigateInObjectBrowserPopover(paths)`
  - `objectHasJoinIcon(objectName, joinType)`
  - `openDisplayAttributeFormsDialogOnObject(objectName)`
  - `openFolderBrowserPopover()`
  - `openObjectContextMenu(objectName)`
  - `openSelectCubeDialog()`
  - `removeItemInReportTab(objName)`
  - `renameObjectInReportTab(objectName, newName)`
  - `renameTextField(newName)`
  - `resetSelectionToObjectInReportTab(objectName)`
  - `saveAndCloseSubmenuOption()`
  - `scrollObjectBrowserPopoverToTop()`
  - `searchObjectInObjectBrowser(objectName, option)`
  - `searchObjectInReportObjectsPanel(objectName, option)`
  - `selectItemInObjectList(itemName)`
  - `selectMultipleItemsInObjectList(itemNames)`
  - `selectSubmenuOption(menuItems, noWait = false)`
  - `selectTab(tabName)`
  - `switchToAllTab()`
  - `switchToColumnsTab()`
  - `switchToInReportTab()`
  - `switchToPageByTab()`
  - `switchToRowsTab()`
  - `waitForStatusBarText(text)`
  - `waitUntilActionIsComplete(seconds)`
- **Related components:** addObjectToPage, AggregationFiltersSectionInReportFilterPanel, dndFromObjectBrowserToReportObjectsPanel, dndFromObjectPanelToContainer, FilterDataSectionInReportFilterPanel, getObjectInObjectsPanel, GridContainer, MultiSelectContainer, ObjectBrowserPanel, ObjectsPanel, PageByContainer, reportFilterPanel, ReportFilterPanelContainer, ReportObjectsPanel, ReportViewFilterPanelContainer, ViewFiltersSectionInReportViewFilterPanel

### ReportDerivedMetricEditor
- **CSS root:** `.mstrmojo-FE .mstrmojo-Button.mstrmojo-WebButton.hot`
- **User-visible elements:**
  - Save Filter Btn (`.mstrmojo-FE .mstrmojo-Button.mstrmojo-WebButton.hot`)
- **Component actions:**
  - `addFilter()`
  - `addFunctionByDoubleClick(functionName)`
  - `addObjectByDoubleClick(objectName)`
  - `cancelAFB()`
  - `chooseAFB(afBehavior)`
  - `clearFilter()`
  - `clearMetric()`
  - `clickOnDropdownOfValueList(label)`
  - `getMetricDefinition()`
  - `getTextInInputSection()`
  - `isMetricEditorDisplayed()`
  - `isTextDisplayedInInputSection(text)`
  - `openAFBPullDown()`
  - `openMetricOptionsDialog()`
  - `presentInMetricDefinition(newToken)`
  - `saveAFB()`
  - `saveFilter()`
  - `saveFormulaMetric()`
  - `saveMetric()`
  - `saveMetricEditorOpenFromEdit()`
  - `saveQualification()`
  - `searchFunction(fnString)`
  - `selectBasedOnFromDMEditor()`
  - `selectDataTypeFromDMEditor()`
  - `selectFunctionFromList(functionName)`
  - `selectFunctionsSelectionFromDMEditor()`
  - `selectFunctionsTypeFromDMEditor()`
  - `selectLevelSelectionFromDMEditor()`
  - `selectObjectsSelectionFromDMEditor()`
  - `selectObjFromList(objName)`
  - `selectValueList(list)`
  - `setElementsSelectioninPopupList(elementsList)`
  - `setFormulaMetricName(newName)`
  - `setMetricDefinition(formula)`
  - `setMetricDesc(newDesc)`
  - `setMetricName(newName)`
  - `setMetricNameOpenFromEdit(newName)`
  - `switchMode(modeName)`
  - `switchModeinSimpleMetricEditor(modeName)`
  - `switchToFormulaMode()`
  - `validateMetric()`
- **Related components:** displayedMetricPanel, functionsPanel, metricPanel, objectsPanel, saveBtnfromSimpleMetricPanel, simpleMetricPanel, switchBtninSimplifiedMetricPanel

### ReportEditorCustomInputBox
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - _none_
- **Related components:** _none_

### ReportEditorPanel
- **CSS root:** `.report-editor-editor .editor-panel`
- **User-visible elements:**
  - Editor Panel (`.report-editor-editor .editor-panel`)
- **Component actions:**
  - `cancelRankSelections()`
  - `changeBreakByDropDownInRankSubmenuAndSubmit(option)`
  - `changeNumberFormatForAttributeInRowsDropzone(objectName, format, subFormat)`
  - `changeNumberFormatForMetricInMetricsDropZone(objectName, format, subFormat)`
  - `changeRankDropdown(type, option)`
  - `changeSortDropDownInRankSubmenuAndSubmit(option)`
  - `clearThresholdForMetricInMetricsDropZone(objectName)`
  - `clearThresholds(objectName, dropZone, type)`
  - `clearThresholdsForAttributeInRowsDropzone(objectName)`
  - `clearThresholdsForMetricInMetricsDropZone(objectName)`
  - `clickContextMenuItem(menuItem)`
  - `clickSubMenuItem(menuItem)`
  - `contextMenuContainsOption(option)`
  - `createPercentToTotalForMetricInMetricsDropZone(objectName, option)`
  - `createRankForMetricInMetricsDropZone(objectName, option = 'Ascending')`
  - `createTotalForeEachForAttributeInMetrics(metricName, attributeName)`
  - `createTransformationForMetricInMetricsDropZone(submenuOption, option, objectName)`
  - `dndAttributeFromColumnsToPageBy(attributeName)`
  - `dndAttributeFromPageByToColumns(attributeName)`
  - `dndAttributeFromPageByToRows(attributeName)`
  - `dndAttributeFromRowsToPageBy(attributeName)`
  - `dndAttributeWithinPageByDropzone(objName, relObjName)`
  - `dndByMultiSelectFromDropzoneToReportObjectsPanelToRemove({ objects, dropzone, type })`
  - `dndByMultiSelectFromReportObjectsToDropzone({ objectNames, dropzone })`
  - `dndByMultiSelectToMoveBetweenDropzones({ objects, dropzone, type, destZone })`
  - `dndByMultiSelectToReOrderWithinDropzone({ objects, dropzone, type, targetName })`
  - `dndFromDropzoneToReportObjectsPanelToRemove({ objName, srcZone = 'Rows' })`
  - `dndFromObjectBrowserToDropzone(objName, desZone)`
  - `dndFromObjectListToColumns(objName)`
  - `dndFromObjectListToDropzone(objName, desZone)`
  - `dndFromObjectListToMetrics(objName)`
  - `dndFromObjectListToRows(objName)`
  - `dndMetricFromRowsToColumns()`
  - `dndMetricsFromColumnsToRows()`
  - `dndMetricsFromColumnsToRowsRelatesToAttribute(attributeName)`
  - `dndMetricsFromRowsToColumnsRelatesToAttribute(attributeName)`
  - `dndMultipleObjectsFromObjectBrowserToColumns(objectNames)`
  - `dndMultipleObjectsFromObjectBrowserToDropzone(objectNames, desZone)`
  - `dndMultipleObjectsFromObjectBrowserToMetrics(objectNames)`
  - `dndMultipleObjectsFromObjectBrowserToPageBy(objectNames)`
  - `dndMultipleObjectsFromObjectBrowserToRows(objectNames)`
  - `dndMultipleObjectsFromObjectListToColumns(objectNames)`
  - `dndMultipleObjectsFromObjectListToRows(objectNames)`
  - `dndObjectBetweenDropzones(objName, objType, srcZone, desZone, relObjName, relObjType)`
  - `dndObjectFromObjectBrowserToColumns(objectName)`
  - `dndObjectFromObjectBrowserToMetrics(objectName)`
  - `dndObjectFromObjectBrowserToPageBy(objectName)`
  - `dndObjectFromObjectBrowserToRows(objectName)`
  - `dndObjectWithinDropzone(objName, objType, zone, relObjName, relObjType)`
  - `editThresholdInDropZone(objectName, dropZone, type)`
  - `editThresholdInDropZoneForAttribute(objectName)`
  - `editThresholdInDropZoneForMetric(objectName)`
  - `expandSubmenuForPercentToTotalForMetricInMetricsDropZone(objectName)`
  - `expandSubmenuForTransformationForMetricInMetricsDropZone(objectName)`
  - `getColumnsObjects()`
  - `getMetricsObjects()`
  - `getPageByObjects()`
  - `getRankBreakByDropdownText()`
  - `getRankSortsDropdownText()`
  - `getRankSubMenuDropdownText(type)`
  - `getRowsObjects()`
  - `getZoneObjectsInOrder(dropZone, names, types)`
  - `hoverOnObjectInDropzone(dropZone, objectType, objectName)`
  - `isBreakBySubMenuDropdownDisplayed(option)`
  - `isContextMenuItemDisplayed(option)`
  - `isDatasetPanelExisting()`
  - `isEditContextMenuItemDisplayed()`
  - `isEditorPanelExisting()`
  - `isRankSubMenuDropdownItemDisplayed(type, option)`
  - `isSortsSubMenuDropdownDisplayed(option)`
  - `isSubmenuItemDisplayed(option)`
  - `mouseOverObjectContextMenuItem(menuItem)`
  - `mouseOverSubMenuItem(menuItem)`
  - `multipleSelectObjects(objectNames)`
  - `multipleSelectObjectsInDropzone({ objects, dropzone, type })`
  - `openAttributeContextMenuInRowsDropzone(objectName)`
  - `openAttributeFormsDialogInRows(objectName)`
  - `openMectricContextMenuInMetricsDropzone(objectName)`
  - `openObjectContextMenu(dropZone, objectType, objectName)`
  - `openObjectContextMenuByIndex(dropZone, objectIndex)`
  - `openRankSubMenuForMetricInMetricsDropZone(objectName)`
  - `openShortcutMetricSubMenuForMetricInMetricsDropZone(objectName)`
  - `openThresholdInDropZone(objectName, dropZone, type)`
  - `openThresholdInDropZoneForAttribute(objectName)`
  - `openThresholdInDropZoneForMetric(objectName)`
  - `removeAll()`
  - `removeAttributeInColumnsDropZone(attributeName)`
  - `removeAttributeInRowsDropZone(attributeName)`
  - `removeObjectInDropzone(dropZone, objectType, objectName)`
  - `selectSubtotals(subtotalOptions)`
  - `sortAscendingColumnsDropZoneForAttribute(objectName)`
  - `sortAscendingMetricsDropZoneForMetric(objectName)`
  - `sortAscendingPageByDropZoneForAttribute(objectName)`
  - `sortAscendingRowsDropZoneForAttribute(objectName)`
  - `sortDescendingColumnsDropZoneForAttribute(objectName)`
  - `sortDescendingMetricsDropZoneForMetric(objectName)`
  - `sortDescendingPageByDropZoneForAttribute(objectName)`
  - `sortDescendingRowsDropZoneForAttribute(objectName)`
  - `sortOnDropZone(objectName, dropZone, type, sortOrder)`
  - `submitRankSelections()`
  - `switchAdvToSimThresholdWithClear()`
  - `updateAttributeFormsForAttributeInPageByDropZone(objectName, option)`
- **Related components:** datasetPanel, EditorPanel

### ReportEmbeddedPromptEditor
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickDoneButton()`
  - `searchFromPromptObject(objectName)`
  - `selectPromptType(promptType)`
- **Related components:** _none_

### ReportFilter
- **CSS root:** `ant-dropdown-open`
- **User-visible elements:**
  - Advanced Option Content (`.advanced-option-text .mstr-checkbox`)
  - Apply Btn (`.filter-apply-button .ant-btn`)
  - Close Icon (`.mstrd-DropdownMenu-headerIcon.icon-pnl_close`)
  - Context Menu (`.mstr-dropdown:not(.ant-dropdown-hidden)`)
  - Dropdown Container (`ant-dropdown-open`)
  - Filter Icon (`.mstr-nav-icon.icon-tb_filter_n`)
  - Filter Menu (`.mstrd-Popover`)
  - Filter Panel (`.mstrd-FilterDropdownMenuContainer`)
  - Filter Summary (`.mstrd-ReportFilterPanelContent-summaryBtn`)
  - Resize Border (`.mstrd-DropdownMenu-resizeHandler`)
  - Tooltip (`.ant-tooltip-content`)
  - Wait Loading (`.mstrmojo-Editor.mstrWaitBox.modal`)
- **Component actions:**
  - `apply()`
  - `applyButtonEnabled()`
  - `clickAdvancedCheckbox()`
  - `clickFilterSummary()`
  - `clickSettingIcon()`
  - `clickViewFilterArrow()`
  - `close()`
  - `deleteExpression({ expType = 'New Qualification', objectName = 'EMPTY', index = 0 })`
  - `dragFilterWidth()`
  - `emptyFilterBodyCaption()`
  - `emptyFilterBodytext()`
  - `emptyFilterSummarySuggestionText()`
  - `expressionInProgress({ expType = 'New Qualification', objectName = 'EMPTY', index = 0 })`
  - `expressionInvalid({ expType = 'New Qualification', objectName = 'EMPTY', index = 0 })`
  - `expressionSelected({ expType = 'New Qualification', objectName = 'EMPTY', index = 0 })`
  - `expressionValid({ expType = 'New Qualification', objectName = 'EMPTY', index = 0 })`
  - `filterSummaryBoxValue({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 })`
  - `filterSummaryContainer()`
  - `filterSummaryText({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 })`
  - `getAggregationFilterCount()`
  - `getExpressionGroupCount()`
  - `getGroupActionLinkCount()`
  - `getGroupOperatorCount(text)`
  - `getGroupOperatorItemCount()`
  - `getNOTCount()`
  - `getOperatorText(index = 1)`
  - `getPanelWidth()`
  - `getTooltipText()`
  - `getViewFilterCount()`
  - `groupFilter(index = 1)`
  - `inlineChangeOperator({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 }, option)`
  - `inlineDeleteElement({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 }, deleteIndex = 1)`
  - `inlineEnterValue({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 }, value)`
  - `isAdvancedChecked()`
  - `isContextMenuOptionPresent(optionText)`
  - `isDetailedPanelPresent()`
  - `isExpressionPresent({ expType = 'New Qualification', objectName = 'EMPTY', index = 1, value })`
  - `isGroupLinkPresent(index = 1)`
  - `isMainPanelPresent()`
  - `isPanelDocked()`
  - `isUngroupLinkPresent(index = 1)`
  - `isViewFilterCollapsed()`
  - `NOTGroupFilter(index = 1)`
  - `open()`
  - `openFilterByHeader({ expType, objectName, index })`
  - `openGroupOperator(index = 1)`
  - `pin()`
  - `removeAllFilter()`
  - `scrollToBottom()`
  - `selectContextMenuOption(optionText)`
  - `selectExpression({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 })`
  - `selectExpressionContextMenu({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 })`
  - `selectGroupOperator(text = 'AND')`
  - `selectSetting(text)`
  - `triggerFilterSectionInfoIcon(section = 'Scope Filters')`
  - `ungroupFilter(index = 1)`
  - `unpin()`
  - `waitForViewFilterPanelLoading()`
- **Related components:** dossierPage, getDetailedPanel, getExpressionContainer, getExpressionContextMenuContainer, getFilterPanel, getMainPanel, isMainPanel, reportPage, waitForViewFilterPanel

### ReportFilterPanel
- **CSS root:** `.report-filter-panel`
- **User-visible elements:**
  - Attribute Element Filter Subpanel (`.qualification-panel-popover.mode-authoring:not(.ant-popover-hidden) .ant-popover-content`)
  - Container (`.report-filter-panel`)
  - Filter Panel Container (`.filter-qualification-container`)
  - Filter Subpanel (`.qualification-panel-popover.mode-authoring:not(.ant-popover-hidden) .ant-popover-content`)
  - Report Filter Panel Container (`.report-filter-tab`)
  - View Filter Tab (`.view-filter-tab`)
- **Component actions:**
  - `clickCancelQualificationEditor()`
  - `clickFilterApplyButton()`
  - `clickFilterTab(filterTab)`
  - `clickNewQualificationPlus(index)`
  - `clickQualificationEditorBtn(btnName)`
  - `createNewPrompt()`
  - `filterContainer()`
  - `isFilterPanelExisting()`
  - `openNewQualicationEditorAtAggregationLevel()`
  - `openNewQualicationEditorAtNonAggregationLevel()`
  - `openNewReportFiltersPanel()`
  - `openNewReportLimitsPanel()`
  - `openNewViewFilterPanel()`
  - `removeAllFilter(option = {})`
  - `saveAndCloseQualificationEditor(wait = true)`
  - `searchAttributeObjectInSearchbox(objectName, index = 1)`
  - `selectElements(elementNames)`
  - `selectObjectFromSearchedResult(objectType, objectName, index = 1)`
  - `selectTypeAndObjectFromSearchedResult(objectType, objectName, index = 1)`
  - `switchToReportFilterTab()`
  - `switchToViewFilterTab()`
  - `toggleViewSelected()`
  - `typeObjectInSearchbox(objectName)`
- **Related components:** AttributeFormsPanel, filterPanelContainer, getContainer, getReportFilterPanelContainer, getReportFiltersSectionInReportFilterPanel, getReportLimitsSectionInReportFilterPanel

### ReportFormatPanel
- **CSS root:** `.report-editor-editor .format-panel`
- **User-visible elements:**
  - Format Panel (`.report-editor-editor .format-panel`)
- **Component actions:**
  - `addMinimumColumnWidthOption(unit)`
  - `applyColorByColumnHeader()`
  - `applyColorByNumberOfColumns()`
  - `applyColorByNumberOfRows()`
  - `applyColorByRowHeader()`
  - `changeBandingColor(colorOrder, color)`
  - `changeFirstBandingColor(color)`
  - `changeSecondBandingColor(color)`
  - `clickCheckBoxForOption(sectionName, optionName)`
  - `clickColumnSizeBtn()`
  - `clickColumnSizeFitOption(fit)`
  - `clickFillColorBtn()`
  - `clickOnPaddingArrowButton(paddingType, buttonType, repetitions)`
  - `clickPanelTab(panelName)`
  - `clickTextFormatButton(type)`
  - `closeBorderColorDropdown(type)`
  - `deleteMinimumColumnWidthOption(unit)`
  - `enableBanding()`
  - `enableOutlineMode()`
  - `enableStandardOutlineMode()`
  - `getApplyColorByNumberOfColumns()`
  - `getBandingColor(colorOrder)`
  - `getBorderColorDropDownSectionStyle(type)`
  - `getBorderStyleDropdownValue(type)`
  - `getFirstBandingColor()`
  - `getFontSelectorValue()`
  - `getFontTextSizeInputValue()`
  - `getGridSegment1DropDownValue()`
  - `getGridSegment2DropDownValue()`
  - `getLayoutSelectionBoxValue()`
  - `getMinimumColumnWithInputValue(unit)`
  - `getPaddingValue(paddingType)`
  - `getSecondBandingColor()`
  - `getValueOfMinimumColumnWidthOption(unit)`
  - `isBandingByColumns()`
  - `isBandingByRows()`
  - `isBandingEnabled()`
  - `isCellPaddingButtonChecked(padding)`
  - `isCheckboxChecked(sectionName, option)`
  - `isCheckboxUnchecked(sectionName, option)`
  - `isFirstCheckBoxChecked(sectionName)`
  - `isFirstCheckBoxUnchecked(sectionName)`
  - `isFontAlignButtonSelected(align)`
  - `isFormatPanelExisting()`
  - `isMinimumColumnWidthInputDisplayed(unit)`
  - `isMinimumColumnWidthSectionDisplayed()`
  - `isOutlineModeEnabled()`
  - `isTextFormatButtonSelected(type)`
  - `openApplyColorBySelectionBox()`
  - `openBandingColorPicker(colorOrder)`
  - `openBandingHeaderSelectionBox()`
  - `openColumnSizeAttributeFormSelectionBox(currentSelection)`
  - `openColumnSizeFitSelectionBox()`
  - `openLayoutSelectionBox()`
  - `openMinimumColumnWidthMenu()`
  - `openRowSizeFitSelectionBox()`
  - `selectBandingBy(axis)`
  - `selectBandingByColumns()`
  - `selectBandingByRows()`
  - `selectBandingHeader(header)`
  - `selectGridSegment(option1, option2)`
  - `selectOptionFromBorderColorDropdown(option, type)`
  - `selectOptionFromBorderStyleDropdown(option, type)`
  - `selectOptionFromDropdown(option)`
  - `setApplyColorEvery(applyColorEvery)`
  - `setColumnSize(currentAttributeForm, inches)`
  - `setMinimumColumnWidthValue(unit, value)`
  - `setPaddingValue(paddingType, paddingValue)`
  - `setRowHeight(inches)`
  - `toggleButton(optionName)`
- **Related components:** FormatPanel, getPanel, newFormatPanel

### ReportGrid
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickOutlineIconFromCH(columnHeader)`
  - `collapseOutlineFromCell(elementName)`
  - `dismissTooltip()`
  - `dragHeaderCellToCol(objectToDrag, position, targetHeader)`
  - `dragHeaderCellToRow(objectToDrag, position, targetHeader)`
  - `expandOutlineFromCell(elementName)`
  - `getGraphWarningMessage()`
  - `getGridCellContextMenuOptionByOption({ row, col, firstOption, secondOption, thirdOption }, prompted = false)`
  - `getGridCellContextMenuTitlesByLevel(row, col, level)`
  - `getOneRowData(row)`
  - `getPageByContextMenuOptionByOption({ label, firstOption, secondOption, thirdOption }, prompted = false)`
  - `getReportElementByName({ elementName })`
  - `getReportHeaderByName({ headerName })`
  - `getReportHeaderText()`
  - `openGridCellContextMenu(row, col)`
  - `openPageByLabelContextMenu(label)`
  - `resizeGridCellByDragColumnHeader(columnHeaderResizeFrom, columnHeaderResizeTo)`
  - `selectReportGridContextMenuOption({ headerName, elementName, firstOption, secondOption, thirdOption }, prompted = false)`
  - `selectVizContextMenuOptionForDescendSort()`
  - `waitForGridRendring()`
- **Related components:** getContainer, getPage

### ReportGridView
- **CSS root:** `.ag-header-container`
- **User-visible elements:**
  - Grid (`.ag-header-container`)
  - Row Count (`.mstrmojo-ViewDataDialog .mstrmojo-rowcount`)
- **Component actions:**
  - `addAttributes(position, srcObjectName, dstObjectNames)`
  - `addAttributesAfter(srcObjectName, dstObjectNames)`
  - `addAttributesBefore(srcObjectName, dstObjectNames)`
  - `addMetrics(position, srcObjectName, dstObjectNames)`
  - `addMetricsAfter(srcObjectName, dstObjectNames)`
  - `addMetricsBefore(srcObjectName, dstObjectNames)`
  - `changeNumberFormat(objectName, format, subFormat)`
  - `clearCellSortBySortIcon(objectName)`
  - `clearSortBySortIcon(objectName)`
  - `clickContextMenuOption(option, waitForLoading = false)`
  - `clickContextMenuOptionBtn(option)`
  - `clickContextMenuOptionCheckBox(option)`
  - `clickDrillToItem(elementName)`
  - `clickGridColumnHeader(columnHeader)`
  - `clickOnGridHeader(headerName)`
  - `clickOutlineIconFromCH(columnHeader)`
  - `clickSortIcon(sortOrder)`
  - `collapseOutlineFromCell(elementName)`
  - `contextMenuContainsOption(optionName)`
  - `dragGroupHeaderCell(objectToDrag, position, gridAxis, targetHeader)`
  - `dragHeaderCellToRow(objectToDrag, position, targetHeader)`
  - `drillToItem(objectName, drillToObjects)`
  - `enableDisplayAttributeForms(objectName, formNames, save = true)`
  - `expandOutlineFromCell(elementName)`
  - `getAllInsertRowsCount()`
  - `getGridCellChildSpanElement(row, col)`
  - `getGridCellChildSpanText(row, col)`
  - `getGridCellCollapseIconByPos(row, col)`
  - `getGridCellCollapseIconByPosDisplayed(row, col)`
  - `getGridCellExpandIconByPos(row, col)`
  - `getGridCellExpandIconByPosDisplayed(row, col)`
  - `getGridCellIconByPos(row, col, iconName)`
  - `getGridCellImgSrcByPos(row, col)`
  - `getGridCellStyle(row, col, style)`
  - `getGridCellStyleByCols(rowStart, rowEnd, col, style)`
  - `getGridCellStyleByPos(row, col, style)`
  - `getGridCellStyleByRows(colStart, colEnd, row, style)`
  - `getGridCellText(row, col)`
  - `getGridCellTextByIndex(index)`
  - `getGridCellTextByPos(row, col)`
  - `getNumberOfInputRows()`
  - `getSelectedSortTypeInContextMenu(columnHeader, sortType)`
  - `hideAllThresholds(objectName)`
  - `hideMetricsLabel(objectName)`
  - `hideTotals(objectName = 'Total')`
  - `hideTotals(objectName)`
  - `isGridCellDisplayed(row, col)`
  - `moveColumnHeaderToColumns(objectName)`
  - `moveColumnHeaderToLeft(objectName)`
  - `moveColumnHeaderToRight(objectName)`
  - `moveColumnHeaderToRows(objectName)`
  - `moveGridCellToPageBy(objectName)`
  - `moveGridHeaderToPageBy(objectName)`
  - `moveToPageBy()`
  - `moveTotalToTop(objectName = 'Total')`
  - `moveVerticalScrollBar(direction, pixels, vizName)`
  - `moveVerticalScrollBarToBottom(vizName, pos)`
  - `openAdvancedSortEditorOnGridObject(objectName)`
  - `openContextualLinkFromCell(cellTextContent)`
  - `openContextualLinkFromCellByPos(row, col, option)`
  - `openDisplayAttributeFormsDialog(objectName)`
  - `openGridCellContextMenu(elementName)`
  - `openGridCellInRowContextMenu(elementName, rowIdx)`
  - `openGridColumnHeaderContextMenu(columnHeader)`
  - `openGridContextMenuByPos(row, col)`
  - `openGridViewContextMenu()`
  - `removeObject(objectName)`
  - `renameObject(newName)`
  - `resizeColumnByMovingBorder(colHeader, pixels, direction)`
  - `resizeColumnByMovingBorderMultiLayer(rowNum, colNum, pixels, direction)`
  - `saveAndCloseContextMenu(subMenu = false)`
  - `scrollAgGrid(visualization, pixels, direction)`
  - `scrollGridHorizontally(visualization, pixels)`
  - `scrollGridToBottom(visualization = 'Visualization 1')`
  - `scrollGridToTop(visualization = 'Visualization 1')`
  - `showAllThresholds(objectName)`
  - `showMetricsLabel(objectName)`
  - `showTotals(objectName)`
  - `showTotalsForObject(objectName)`
  - `sortAscending(objectName)`
  - `sortAscendingBySortIcon(objectName)`
  - `sortByOption(objectName, option)`
  - `sortCellAscendingBySortIcon(objectName)`
  - `sortCellDescendingBySortIcon(objectName)`
  - `sortDescending(objectName)`
  - `sortDescendingBySortIcon(objectName)`
  - `sortMetricWithinAttribute(objectName, attributeName)`
  - `updateShowAttributeFormName(objectName, option, save = true)`
  - `waitForAgLoadingIconNotDisplayed()`
  - `waitForGridCellToBeExpectedValue(row, col, expectedValue)`
- **Related components:** baseContainer, moveToPage, vizPanel

### ReportMenubar
- **CSS root:** `.mstrd-DropDown-content:not(.mstrd-DropDown-content--collapsed)`
- **User-visible elements:**
  - Active Menu Dropdown (`.mstrd-DropDown-content:not(.mstrd-DropDown-content--collapsed)`)
- **Component actions:**
  - `clickMenuItem(menuItem)`
  - `clickSubMenuItem(menuItem, subMenuItem)`
  - `getDropdownMenu()`
  - `getMenuItemText(menuItem)`
  - `getSubMenuItemText(menuItem, subMenuItem)`
  - `isMenuItemVisible(menuItem)`
  - `isSubMenuItemVisible(menuItem, subMenuItem)`
- **Related components:** _none_

### ReportNumberTextFormatting
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `changeSymbolPositionTo(position)`
  - `clickButtoninDropzone(buttonName)`
  - `clickContextMenuButton(buttonText)`
  - `clickOkButtonInNumberTextFormatting()`
  - `closePulldown()`
  - `increaseDecimalOption()`
  - `saveAndCloseContextMenu()`
  - `selectCategoryFromNumberTextFormatting(categoryName)`
  - `selectCategoryFromNumberTextFormattingInDropzone(categoryName)`
  - `selectNumberTextFormatFromDropdown(numberFormat)`
  - `selectOptionFromDropzoneContextMenu(menuItem)`
  - `subCategoryOption(option)`
  - `verifyNumberTextFormatOptionInCategoryDropDown(option)`
  - `verifyNumberTextFormatOptionInCategoryDropDownOnDropzone(option)`
- **Related components:** _none_

### ReportObjectBrowser
- **CSS root:** `.objectBrowserContainer`
- **User-visible elements:**
  - Dataset Select Container (`.objectBrowserContainer`)
- **Component actions:**
  - `clickFilterByCategory({ name, index = 0 })`
  - `clickShowAllObjectsButton()`
  - `scrollToBottom()`
- **Related components:** getDatasetSelectContainer, getFlatObjectListContainer, getToolbarContainer

### ReportPage
- **CSS root:** `.mstrd-DossierViewContainer`
- **User-visible elements:**
  - Cancel Button In Top Loading Bar (`.mstrmojo-Editor-content .mstrWaitCancel`)
  - Cancel Execution Btn (`.mstrd-DocumentExecuteCancelButton`)
  - Confirm Dialog (`.confirmation-dialog`)
  - Confirm Save Dialog (`.mstrmojo-Editor.mstrmojo-ConfirmSave-Editor`)
  - Container (`.mstrd-DossierViewContainer`)
  - Drill Notification Box (`.mstrd-PageNotification-container.mstrd-PageNotification-container--drill #go-back-msg`)
  - Drill Options Dialog (`.mstr-rc-dialog.drill-options-dialog`)
  - First Page By Dropdown (`.mstrmojo-ui-Pulldown.mstrmojo-ui-SearchablePulldown`)
  - Grid View Section In Pause Mode (`.report-editor .mstmojo-freezingImgTableCell`)
  - Library Icon (`.mstr-nav-icon.icon-library`)
  - Missing Font Popup (`.missing-fonts-modal .ant-modal-content`)
  - Mojo Loading Box (`.mstrmojo-Editor.mstrWaitBox.modal`)
  - Page By Button (`.mstrd-NavItemWrapper.mstrd-PageByToggleNavItemContainer.mstr-navbar-item`)
  - Re Execute Button (`.mstrd-NavItemWrapper.mstrd-reExecuteNavItem.mstr-navbar-item`)
  - Re Execute Button (`.single-icon-library-re-execute`)
  - Report Authoring Close Btn (`.icon-authoring-close.mstr-nav-icon`)
  - Report Edit Button (`.mstr-nav-icon.icon-info_edit`)
  - Report Error Dialog (`.report-error-popup`)
  - Report Title Bar (`.mstrd-DossierTitle`)
- **Component actions:**
  - `cancelInConfirmDialog()`
  - `chooseSecondIteminPageByDropdown()`
  - `clickAccountOption(text)`
  - `clickCancelButtonInTopLoadingBar(option)`
  - `clickCancelExecutionBtn()`
  - `clickDoNotSaveButtonInConfirmSaveDialog(option)`
  - `clickFirstPageByDropdown()`
  - `clickNewReportButton()`
  - `clickOKInConfirmDialog()`
  - `clickPageByButton()`
  - `clickReportTitle()`
  - `closeReportAuthoring()`
  - `closeReportAuthoringWithoutSave()`
  - `closeUserAccountMenu()`
  - `confirmCloseWithoutSaving()`
  - `confirmToSaveAndSetTemplate()`
  - `dismissMissingFontPopup()`
  - `goToLibrary()`
  - `isAccountIconPresent()`
  - `isAccountOptionPresent(text)`
  - `isCancelExecutionBtnPresent()`
  - `isEditButtonDisplay()`
  - `isInPauseMode()`
  - `isLogoutPresent()`
  - `isMojoWaitingPresent()`
  - `isReportErrorPopupPresent()`
  - `logout(options = {})`
  - `openPreferencePanel()`
  - `openUserAccountMenu()`
  - `refreshNoWait()`
  - `reportAuthoringMode()`
  - `resizeEditorPanel(numOfPixels)`
  - `switchUser(credentials)`
  - `waitForBlankReportLoading()`
  - `waitForDrillNotificationBox()`
  - `waitForReportLoading(isAuthoring = false)`
- **Related components:** getFirstPage, getPage, getRightResizeableDividerOnEditorPanel, getSecondIteminPage, loginPage

### reportPageBuilder
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - _none_
- **Related components:** _none_

### ReportPageBy
- **CSS root:** `.mnu--xtab-attr-forms`
- **User-visible elements:**
  - Display Attribute Forms Btn In Context Menu (`.mnu--xtab-attr-forms`)
  - Remove Btn In Context Menu (`.mnu--page-by-remove`)
- **Component actions:**
  - `addAttributes(position, targetObject, saveAndClose = false)`
  - `changePageByElement(selectorName, elementName)`
  - `clickBtnInContextMenu(btnName)`
  - `clickChecklistElementInContextMenu(attributeName)`
  - `doubleClickPageBySelector(selectorName)`
  - `getAllElementsFromPopupList()`
  - `getIndexForElementFromPopupList(elementName)`
  - `getSelectorNameByIdx(idx = 1)`
  - `moveGridHeaderToPageBy(objectToDrag, position, targetObject)`
  - `moveSelectorToCol(objectToDrag, position, targetObject)`
  - `moveSelectorToRow(objectToDrag, position, targetObject)`
  - `openDisplayAttributeFormsDialog(attributeName)`
  - `openDropdownFromSelector(selectorName)`
  - `openPageByContextMenu()`
  - `openPageBySelector(selectorName)`
  - `openSelectorContextMenu(selectorName)`
  - `removePageBy(selectorName)`
  - `removeSelectorByDrag(objectToDrag)`
  - `reorderSelectorByDrag(objectToDrag, position, targetObject)`
  - `saveAndCloseContextMenu()`
  - `searchElementFromSelector(selectorName, keyword)`
- **Related components:** datasetPanel, openPage

### ReportPageBySorting
- **CSS root:** `.mstr-rc-dialog.sort-options-dialog`
- **User-visible elements:**
  - Page By Sorting Dialog (`.mstr-rc-dialog.sort-options-dialog`)
- **Component actions:**
  - `clickBtn(btn)`
  - `getSortingRowsCount()`
  - `openDropdown(row, col)`
  - `removeRow(idx)`
  - `selectFromDropdown(row, col, option)`
- **Related components:** _none_

### ReportPromptEditor
- **CSS root:** `.mstrd-PromptEditor`
- **User-visible elements:**
  - Prompt Editor (`.mstrd-PromptEditor`)
- **Component actions:**
  - `chooseItemInAvailableCart(index, sectionName, itemName)`
  - `chooseItemsInAvailableCart(index, sectionName, itemNames)`
  - `clickAlertOKBtn()`
  - `clickApplyButtonInReportPromptEditor()`
  - `clickButtonInListCart(index, sectionName, itemName)`
  - `clickCancelButtonInReportPromptEditor()`
  - `clickCheckBoxItem(index, sectionName, itemName)`
  - `clickCheckListCheckBoxItem(index, sectionName, itemName)`
  - `clickChooseAttributeBtn()`
  - `clickEditorBtn(btnName)`
  - `clickExprElementLabel(index, sectionName, objectIndex, objectName)`
  - `clickExpressionForm(index, sectionName, objectIndex, objectName)`
  - `clickExpressionFunc(index, sectionName, objectIndex, objectName)`
  - `clickExpressionType(index, sectionName, objectIndex, objectName)`
  - `clickItemFromPullDown(index, sectionName, item)`
  - `clickLevelAttributeBtn(btnName)`
  - `clickLevelLabel(index, sectionName, objectIndex, objectName)`
  - `clickMatchTypeBtn(type)`
  - `clickPopupCellBtn(btnName)`
  - `clickPopupItem(itemName)`
  - `clickPullDownCell(index, sectionName)`
  - `clickValueLabel(index, sectionName, objectIndex, objectName)`
  - `doubleClickExprElement(elementName)`
  - `doubleClickLevelAttributeItem(itemName)`
  - `doubleClickSelectedItem(index, sectionName, itemName)`
  - `enterExprValue(value)`
  - `enterMetricValue(index, sectionName, value)`
  - `enterSearchPattern(pattern)`
  - `getAlertMessage()`
  - `isPromptEditorDisplayed()`
  - `singleClickSelectedItem(index, sectionName, itemName)`
  - `toggleViewSummaryBtn()`
- **Related components:** _none_

### ReportReplaceObject
- **CSS root:** `.mstrmojo-ReplaceObject`
- **User-visible elements:**
  - Replace Object Dialog (`.mstrmojo-ReplaceObject`)
- **Component actions:**
  - `clickOkButton()`
  - `openNewObjectDropdownByCurrentObjectName({ name, index = 0 })`
  - `selectInDropdownByName(option)`
  - `selectNewObjects(options)`
  - `toggleClearSettingsCheckbox()`
  - `waitForLoading()`
- **Related components:** getReplaceObjectDataContainer

### ReportSqlView
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickSQLupdateBtn()`
  - `clickUpdateSqlView()`
  - `dndVerticalScrollbar(moveY)`
  - `getSqlViewContent()`
  - `isSqlViewDisplayed()`
- **Related components:** _none_

### ReportSubtotalsEditor
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickButton(label)`
  - `clickByPositionOptions()`
  - `clickCustomSubtotalsButton()`
  - `clickGroupByEditorButton(label)`
  - `clickSubtotalsPositionOption(position)`
  - `clickSubtotalsSelector(metricName)`
  - `customSubtotalsClickButton(label)`
  - `editButtonCustomSubtotals()`
  - `expandAcrossLevelSelector()`
  - `hoverOverCustomSubtotalOptions()`
  - `removeButtonCustomSubtotals()`
  - `renameCustomSubtotalsName(newName)`
  - `saveAndCloseSubtotalsByPositionEditor()`
  - `saveAndCloseSubtotalsEditor()`
  - `selectAttributeAcrossLevel(attribute)`
  - `selectAttributeGroupByCheckbox(attribute)`
  - `selectSubtotalsOption(subtotalOption, order)`
  - `selectSubtotalsType(subtotalType, order)`
  - `selectTypeCheckbox(type)`
  - `setAppliedLevel(appliedLevel, subtotalName)`
  - `setAppliedLevelValueSelector(subtotalName)`
  - `setByPositionValue(option, subtotalName)`
  - `subtotalsByPositionClickButton(label)`
- **Related components:** _none_

### ReportSummary
- **CSS root:** `.mstrd-FilterDropdownMenuContainer .mstrd-DropdownMenu`
- **User-visible elements:**
  - Filter Panel (`.mstrd-FilterDropdownMenuContainer .mstrd-DropdownMenu`)
  - Summary Bar (`.mstrd-FilterSummary`)
  - Summary Panel (`.mstrd-FilterSummaryPanel`)
- **Component actions:**
  - `edit({ name, isSetFilter = false, index = 1, section = reportFilterSections.VIEW_FILTER })`
  - `getLeafRowValue(section, name, index = 1)`
  - `getSetRowValue(section, name, index = 1)`
  - `getSummaryBarText()`
  - `getViewFilterRowValue(name, index = 1)`
  - `isFilterSummaryPanelPresent()`
  - `isSummaryBarPresent()`
  - `scrollToBottom()`
  - `viewAll()`
  - `viewLess()`
- **Related components:** getFilterPanel, getSummaryPanel

### ReportTOC
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickErrorDetailsBtn()`
  - `clickPanelTab(panelName)`
  - `isPanelEnabled()`
  - `switchToEditorPanel()`
  - `switchToFilterPanel()`
  - `switchToFormatPanel()`
  - `switchToThemePanel()`
- **Related components:** clickPanel, getPanel

### ReportToolbar
- **CSS root:** `body`
- **User-visible elements:**
  - Document Body (`body`)
  - Dossier Name Input From Save As Window (`.mstrDialogBone input#saveAsReportName`)
  - Natural Language Query Inputbox (`.mstrmojo-Editor.NLPEditor .mstrmojo-ui-sb-input`)
  - Path Bar (`.mstrmojo-RootView-pathbar`)
- **Component actions:**
  - `actionOnToolbar(actionName, option = { isWait: true })`
  - `actionOnToolbarLoop(actionName, count)`
  - `actionOnToolbarWithoutLoading(actionName)`
  - `clickBack()`
  - `clickRedo(authoring = false)`
  - `clickReset(prompt = false)`
  - `clickUndo(authoring = false)`
  - `dismissContextMenu()`
  - `hoverActionOnToolbar(actionName)`
  - `isGridIconEnabled()`
  - `isPauseIconEnabled()`
  - `isRedoDisabled(authoring = false)`
  - `isRedoEnabled(authoring = false)`
  - `isSqlIconEnabled()`
  - `isUndoDisabled(authoring = false)`
  - `isUndoEnabled(authoring = false)`
  - `reExecute()`
  - `rePrompt()`
  - `saveNewDossier(dossierFileName)`
  - `selectOptionFromToolbarPullDown(optionName)`
  - `selectOptionFromToolbarPullDownWithoutLoading(optionName)`
  - `switchToDesignMode(prompt = false)`
  - `switchToGridView()`
  - `switchToPauseMode()`
  - `switchToSqlView()`
  - `typeInNaturalLanguageQueryBox(text)`
  - `typeInNaturalLanguageQueryBoxNoSubmit(text)`
- **Related components:** dossierPage, reportPage

### SetFilter
- **CSS root:** `.ant-popover:not(.ant-popover-hidden)`
- **User-visible elements:**
  - Popover (`.ant-popover:not(.ant-popover-hidden)`)
  - Relate By Search Dropdown (`.ant-select-dropdown.predicate-relation-type-select`)
  - Set Of Dropdown (`.object-search-pulldown-dropdown-multiple`)
  - Set Popover (`.ant-popover.predicate-relation-popover`)
- **Component actions:**
  - `advancedOptionText({ index = 0 })`
  - `clickSetSelectorByName(selectorName, open = true)`
  - `closeFilterSetPopopver()`
  - `closeSelector(selectorName)`
  - `closeSet()`
  - `getSelectedRelatedBy()`
  - `getSelectedSetOf()`
  - `isSetNodePresent({ objectName = 'EMPTY', index = 0 })`
  - `openSelector(selectorName)`
  - `openSet({ objectName, text, index = 1 })`
  - `relateByText({ objectName, index = 0 })`
  - `searchInAuthoring(optionName, type = 'Attribute')`
  - `selectOptionsInAuthoring(selections)`
  - `setNegation({ index })`
- **Related components:** getAdvancedOptionTextContainer, getRelateByContainer

### ValueInput
- **CSS root:** `.predicate-form-qualification`
- **User-visible elements:**
  - Form Qualification Container (`.predicate-form-qualification`)
  - Prompt Value Input (`.predicate-qualification-value-input.prompt`)
  - Value Info (`.qualification-value-input-box-error-text`)
- **Component actions:**
  - `clearValue(index = 1)`
  - `enterValue(value, index = 1)`
  - `getValueInputCount()`
  - `promptValueText()`
  - `selectValue()`
  - `valueValidationText()`
- **Related components:** getDetailedPanel

## Common Workflows (from spec.ts)

1. Page by Sorting in report editor (used in 16 specs)
2. Report Editor Shortcut Metrics in Workstation (used in 12 specs)
3. Report Editor sql view in Workstation (used in 10 specs)
4. Report Editor in Workstation (used in 4 specs)
5. Report UI - Authoring General (used in 4 specs)
6. [BCIN-3487] execute ffsql report with syntactical errors in sql (used in 2 specs)
7. [BCIN-3749_01] Create report by choosing blank template (used in 2 specs)
8. [BCIN-3749_02] Create report by choosing selected template (used in 2 specs)
9. [BCIN-3749_03] Create report by choosing selected template with prompt (used in 2 specs)
10. [BCIN-3749_04] Create report by choosing selected subset report template (used in 2 specs)
11. [BCIN-3749_05] Create report by choosing selected report template with customized properties (used in 2 specs)
12. [BCIN-3749_06] Create report by choosing certified report template (used in 2 specs)
13. [BCIN-3749_07] Create report by choosing blank report template (used in 2 specs)
14. [BCIN-3749_08] Create report by choosing blank button (used in 2 specs)
15. [BCIN-3749_09] Save report as template in save as dialog (used in 2 specs)
16. [BCIN-3749_10] Set as template from menubar without change (used in 2 specs)
17. [BCIN-3749_11] Set as template from menubar with manipulation on report (used in 2 specs)
18. [BCIN-3809_01] Report creator UI check (used in 2 specs)
19. [BCIN-3809_02] Switch project after select template (used in 2 specs)
20. [BCIN-3809_03] Disable blank template (used in 2 specs)
21. [BCIN-3809_04] Open info window in report creator (used in 2 specs)
22. [BCIN-3809_05] select template in list view (used in 2 specs)
23. [BCIN-3844_01] Show report template when having execute ACL (used in 2 specs)
24. [BCIN-3844_02] No write acl to report (used in 2 specs)
25. [BCIN-3844_03] No set template privilege (used in 2 specs)
26. [BCIN-3844_04] unset default customized template (used in 2 specs)
27. [BCIN-5296] Verify report format panel under Japanese (used in 2 specs)
28. [BCIN-5389_01] Add attribute view filter to subset report (used in 2 specs)
29. [BCIN-5389_02] Add metric view filter to subset report (used in 2 specs)
30. [BCIN-6422_01] UI entry only show in subset report (used in 2 specs)
31. [BCIN-6422_02] Replace by MTDI cube in subset report (used in 2 specs)
32. [BCIN-6422_03] Replace by subset cube when creating report (used in 2 specs)
33. [BCIN-6422_04] Replace by olap cube (used in 2 specs)
34. [BCIN-6422_05] Replace cube when having cube filter (used in 2 specs)
35. [BCIN-6422_06] Replace cube when having derived metric and keep definition (used in 2 specs)
36. [BCIN-6422_07] Replace cube when having derived metric and remove (used in 2 specs)
37. [BCIN-6422_08] Replace cube when having view filter (used in 2 specs)
38. [BCIN-6422_09] Replace cube by removing all (used in 2 specs)
39. [BCIN-6422_10] undo redo after replace cube (used in 2 specs)
40. [BCIN-6460_01] not allow to add view filter by DnD multiple selection (used in 2 specs)
41. [BCIN-6460_02] adding attribute metric to view filter on existing subset report (used in 2 specs)
42. [BCIN-6460_03] DnD irrelevant qualification prompt to subset report (used in 2 specs)
43. [BCIN-6460_04] DnD valid attribute qualification prompt to subset report (used in 2 specs)
44. [BCIN-6460_05] DnD attribute elements prompt to subset report (used in 2 specs)
45. [BCIN-6460_06] DnD metric qualification prompt to subset report (used in 2 specs)
46. [BCIN-6460_07] DnD value prompt to subset report (used in 2 specs)
47. [BCIN-6460_08] Check tooltip in view filter (used in 2 specs)
48. [BCIN-6468_01] create attribute element in list prompt on view filter (used in 2 specs)
49. [BCIN-6468_02] create attribute element not in list prompt on view filter (used in 2 specs)
50. [BCIN-6468_03] run report with attribute element in list prompt on view filter (used in 2 specs)
51. [BCIN-6468_04] run report with attribute element not in list prompt on view filter (used in 2 specs)
52. [BCIN-6468_05] create value prompt in metric filter (used in 2 specs)
53. [BCIN-6468_06] no prompt icon for MDTI cube report (used in 2 specs)
54. [BCIN-6468_07] create embedded attribute prompt in normal report (used in 2 specs)
55. [BCIN-6468_08] run subset report with prompt in view filter on consumption mode (used in 2 specs)
56. [BCIN-6488_01] show hide report theme panel (used in 2 specs)
57. [BCIN-6488_02] apply auto style with banding (used in 2 specs)
58. [BCIN-6488_03] apply auto style with formatting on row and columns (used in 2 specs)
59. [BCIN-6488_04] apply auto style formatting on border (used in 2 specs)
60. [BCIN-6488_05] apply auto style with formatting on subtotal (used in 2 specs)
61. [BCIN-6488_06] filter certified theme (used in 2 specs)
62. [BCIN-6488_07] check theme cover image (used in 2 specs)
63. [BCIN-6488_08] check theme tooltip when hovering on info icon (used in 2 specs)
64. [BCIN-6488_09] resize editor panel to re-order theme cards (used in 2 specs)
65. [BCIN-6488_10] choose select theme from top menu when theme panel is not show (used in 2 specs)
66. [BCIN-6488_11] check current theme for newly created report from blank template (used in 2 specs)
67. [BCIN-6488_12] check current theme when creating report by template (used in 2 specs)
68. [BCIN-6490_01] apply theme with orange template and banding (used in 2 specs)
69. [BCIN-6490_02] apply outline theme (used in 2 specs)
70. [BCIN-6490_03] apply theme by hide row and column headers (used in 2 specs)
71. [BCIN-6490_04] apply theme with large spacing (used in 2 specs)
72. [BCIN-6490_05] apply theme with both axes formatting (used in 2 specs)
73. [BCIN-6490_06] apply certified theme (used in 2 specs)
74. [BCIN-6490_07] switch between themes (used in 2 specs)
75. [BCIN-6490_08] re-open report with theme applied (used in 2 specs)
76. [BCIN-6490_09] apply theme on subset report (used in 2 specs)
77. [BCIN-6490_10] undo redo after apply theme (used in 2 specs)
78. [BCIN-6493_01] apply theme with orange template and banding (used in 2 specs)
79. [BCIN-6511_01] Choose MDX cube in MDX report creator (used in 2 specs)
80. [BCIN-6511_02] Check tree browser in MDX report creator (used in 2 specs)
81. [BCIN-6511_03] Search MDX cube in report creator (used in 2 specs)
82. [BCIN-6511_04] Show no content when no result after search (used in 2 specs)
83. [BCIN-6511_05] Open tree selector when choosing mdx cube (used in 2 specs)
84. [BCIN-6511_06] Switch project when choosing mdx cube (used in 2 specs)
85. [BCIN-6511_07] Choosing mdx cube and switch to template tab to create report (used in 2 specs)
86. [BCIN-6511_08] Create MDX report by hierarchy and metric on selected cube (used in 2 specs)
87. [BCIN-6511_09] Create MDX report by attribute and metric on selected cube (used in 2 specs)
88. [BCIN-6511_10] expose mdx data source in root (used in 2 specs)
89. [BCIN-6511_11] mdx report advanced settings (used in 2 specs)
90. [BCIN-6512_01] Drag unmapped mdx object into report filter (used in 2 specs)
91. [BCIN-6512_02] Drag mapped mdx object into report filter (used in 2 specs)
92. [BCIN-6512_03] No based on field when create or edit filter (used in 2 specs)
93. [BCIN-6512_04] limited operator for qualification filter on string (used in 2 specs)
94. [BCIN-6512_05] Qualification on attribute element in list (used in 2 specs)
95. [BCIN-6512_06] Qualification on attribute element not in list (used in 2 specs)
96. [BCIN-6512_07] Qualification on attribute desc form (used in 2 specs)
97. [BCIN-6512_08] Qualification on metric with group by (used in 2 specs)
98. [BCIN-6512_09] Group by same attribute when create new filter (used in 2 specs)
99. [BCIN-6512_10] Add other attribute to report filter (used in 2 specs)
100. [BCIN-6512_11] Add same attributes to report filter AND -> OR (used in 2 specs)
101. [BCIN-6512_12] group filters (used in 2 specs)
102. [BCIN-6512_13] ungroup filters (used in 2 specs)
103. [BCIN-6512_14] delete filters (used in 2 specs)
104. [BCIN-6512_15] adding prompt to report filter (used in 2 specs)
105. [BCIN-6530_01] Drag unmapped mdx object into report (used in 2 specs)
106. [BCIN-6530_02] Add mapped mdx object into report from mdx folder (used in 2 specs)
107. [BCIN-6530_03] Add mapped mdx object into report from schema object folder (used in 2 specs)
108. [BCIN-6530_04] Cannot add mdx attributes from other mdx cube (used in 2 specs)
109. [BCIN-6530_05] Cannot add unmapped schema attributes to mdx report (used in 2 specs)
110. [BCIN-6530_06] Cannot add schema metric to mdx report (used in 2 specs)
111. [BCIN-6530_07] Add mapped metric from other mdx cube (used in 2 specs)
112. [BCIN-6530_08] Add mapped mdx attribute from other mdx cube (used in 2 specs)
113. [BCIN-6530_09] Add mapped mdx attribute to normal report (used in 2 specs)
114. [BCIN-6530_10] Add mdx metric to normal report (used in 2 specs)
115. [BCIN-6530_11] Add hierarchy to mdx report (used in 2 specs)
116. [BCIN-6530_12] Only allow to add one hierarchy per dimension for SAP datasource (used in 2 specs)
117. [BCIN-6531_01] Run MDX report without report filter (used in 2 specs)
118. [BCIN-6531_02] Run MDX report by SAP data source (used in 2 specs)
119. [BCIN-6531_03] Run MDX report with report filter (used in 2 specs)
120. [BCIN-6531_04] Run MDX report with hierarchy (used in 2 specs)
121. [BCIN-6540_01] Run MDX report without report filter (used in 2 specs)
122. [BCIN-6540_02] Run MDX report by user without define mdx report privilege (used in 2 specs)
123. [BCIN-6567] upload file to report filter as selection (used in 2 specs)
124. [BCIN-6585_01] verify object path in report filter search results (used in 2 specs)
125. [BCIN-6585_02] verify object path in report limits search results (used in 2 specs)
126. [BCIN-6585_03] verify object path in report filter set search results (used in 2 specs)
127. [BCIN-6653_01] type in input area when set filter for id form by operator is in (used in 2 specs)
128. [BCIN-6707] Verify access child folder by shortcut when user has no access to parent folder (used in 2 specs)
129. [BCIN-6864_01] verify dashboard context menu after edit report first (used in 2 specs)
130. [BCIN-6864_02] verify report context menu in consumption (used in 2 specs)
131. [BCIN-6908_01] Cubes tab in report creator (used in 2 specs)
132. [BCIN-6908_02] Create button is disabled when no cube selected (used in 2 specs)
133. [BCIN-6908_03] Switch project when no cube selected (used in 2 specs)
134. [BCIN-6908_04] Switch project when cube selected (used in 2 specs)
135. [BCIN-6908_05] Select MDTI cube and create report (used in 2 specs)
136. [BCIN-6908_06] Select OLAP cube and create report (used in 2 specs)
137. [BCIN-6908_07] show last tab when re-open report creator (used in 2 specs)
138. [BCIN-6908_08] hide mosaic and dda cube (used in 2 specs)
139. [BCIN-6908_09] switch to folder mode will clear selection (used in 2 specs)
140. [BCIN-6915_01] No define intelligent cube report privilege for some of the projects (used in 2 specs)
141. [BCIN-6915_02] No use ACL dataset cannot be selected (used in 2 specs)
142. [BCIN-7298_01] Respect view filter feature flag when application setting is unset (used in 2 specs)
143. [BCIN-7298_02] Report view filter should not show when application setting is off but feature flag is on (used in 2 specs)
144. [BCIN-7298_03] Report view filter should show when application setting is on but feature flag is off (used in 2 specs)
145. [BCIN-7306_01] Default view mode is Data Retrieval Mode (used in 2 specs)
146. [BCIN-7306_02] Create report by pause mode (used in 2 specs)
147. [BCIN-7306_03] Create report by data retrieval mode (used in 2 specs)
148. [BCIN-7306_04] Create report by template with object prompt in pause mode (used in 2 specs)
149. [BCIN-7306_05] Create report by template with object prompt in data retrieval mode (used in 2 specs)
150. [BCIN-7306_06] Create report by template in pause mode and cancel (used in 2 specs)
151. [BCIN-7306_07] Create report by template in pause mode and cancel during apply prompt (used in 2 specs)
152. [BCIN-7306_08] Create report by template with object prompt in pause mode and update template objects (used in 2 specs)
153. [BCIN-7306_09] Create report by template with object prompt in pause mode and apply filters (used in 2 specs)
154. [BCIN-7306_10] Create report by template with object prompt in pause mode and add another prompt (used in 2 specs)
155. [BCIN-7306_11] Create report by template with object prompt in pause mode and undo redo (used in 2 specs)
156. [TC0000_1] X-Fun test on page by sorting in report editor (Workstation) -- Hierarchy in Page By (used in 2 specs)
157. [TC81156_1] FUN | Report Editor | Editor Panel | Page-by (used in 2 specs)
158. [TC81156_2] FUN | Report Editor | Editor Panel | Page-by (used in 2 specs)
159. [TC81156_3] FUN | Report Editor | Editor Panel | Page-by (used in 2 specs)
160. [TC81156_4] FUN | Report Editor | Editor Panel | Page-by (used in 2 specs)
161. [TC81156_5] FUN | Report Editor | Editor Panel | Page-by (used in 2 specs)
162. [TC81156_6] FUN | Page by with show totals (used in 2 specs)
163. [TC81200_1] Report editor sql view in workstation (used in 2 specs)
164. [TC81200_2] Report editor sql view in workstation_test2 (used in 2 specs)
165. [TC81200_3] Report editor sql view in workstation_test2 (used in 2 specs)
166. [TC81200_4] Report editor sql view in workstation_test2 (used in 2 specs)
167. [TC81200_5] Report editor sql view in workstation_test2 (used in 2 specs)
168. [TC83061] Functional [Workstation][Report Editor] Cell padding formatting (used in 2 specs)
169. [TC83064] Functional [Workstation][Report Editor] Advanced banding formatting (used in 2 specs)
170. [TC85267_1] Report editor thresholds TC85267 Case 1 in workstation (used in 2 specs)
171. [TC85267_2] Report editor thresholds TC85267 Case 2 (used in 2 specs)
172. [TC85390] Acceptance test on page by sorting in report editor (used in 2 specs)
173. [TC85430] Regression test on page by sorting in report editor -- Consolidation (used in 2 specs)
174. [TC85430] Regression test on page by sorting in report editor -- Custom Group (used in 2 specs)
175. [TC85430] X-Fun test on page by sorting in report editor (Workstation) -- Attribute Forms (used in 2 specs)
176. [TC85430] X-Fun test on page by sorting in report editor (Workstation) -- Metrics in Page By, Encoding and Truncation (used in 2 specs)
177. [TC85430] X-Fun test on page by sorting in report editor (Workstation) -- Move or Remove PageBy Object (used in 2 specs)
178. [TC85430] X-Fun test on page by sorting in report editor (Workstation) -- Quick Sorting (used in 2 specs)
179. [TC85476] FUN | Report Editor | Page-by | Other Context Menus (used in 2 specs)
180. [TC85613_1] Step 1: Creating rank metrics (used in 2 specs)
181. [TC85613_2] Step 2: Creating page and grand percent to total metrics (used in 2 specs)
182. [TC85613_3] Step 3: Creating percent to total for each attribute (used in 2 specs)
183. [TC85613_4] Step 4: Creating percent to total metrics (rows and columns - DE245912 could change results) (used in 2 specs)
184. [TC85613_5] Step 5: Creating Transformation Metrics (used in 2 specs)
185. [TC85613_6] Step 6: Metric Editor (used in 2 specs)
186. [TC85742] Lock columns and rows headers (used in 2 specs)
187. [TC86195_1] Apply format for Metric prompts (used in 2 specs)
188. [TC86195] Wrap Text in report editor in format panel -> Text & Form (used in 2 specs)
189. [TC86198] Functional [Report Editor] Formatting] (used in 2 specs)
190. [TC86199] E2E [Report Editor] create report, apply formatting, save and reopen report (used in 2 specs)
191. [TC86499] E2E [Report Editor][Component Level] Minimum Column Width (used in 2 specs)
192. [TC86500] FUN [Report Editor][Workstation] Minimum Column Width (used in 2 specs)
193. [TC86548] Report editor thresholds TC86548 show/hide thresholds (used in 2 specs)
194. [TC88431_1] FUN | Report Editor | Grid View | Outline Mode (used in 2 specs)
195. [TC88431_2] DE241713: Make sure outline mode expand/collapse state persists during column resize (used in 2 specs)
196. [TC97485_01] FUN | Report Editor | Undo/Redo for page by manipulation in Report Consumption (used in 2 specs)
197. [TC97485_02] FUN | Report Editor | Undo/Redo for remove manipulation in Report Consumption (used in 2 specs)
198. [TC97485_03] FUN | Report Editor | Undo/Redo for other manipulations in Report Consumption (used in 2 specs)
199. [TC97485_04] FUN | Report Editor | Undo/Redo stack should be cleared after linking and back (used in 2 specs)
200. [TC97485_05] FUN | Report Editor | Undo/Redo stack should be cleared after reprompt (used in 2 specs)
201. [TC97485_06] FUN | Report Editor | Undo/Redo stack should not be cleared after drill on subset report (used in 2 specs)
202. [TC97485_07] FUN | Report Editor | Undo/Redo stack should be cleared after drill on normal report (used in 2 specs)
203. [TC97485_08] FUN | Report Editor | Undo/Redo stack should be cleared after re-execute (used in 2 specs)
204. [TC97485_10] FUN | Report Editor | Undo/Redo adding objects in Report Authoring in Paused mode (used in 2 specs)
205. [TC97485_11] FUN | Report Editor | Undo/Redo In Report Tab (used in 2 specs)
206. [TC97485_12] FUN | Report Editor | Undo/Redo In Report Editor Panel (used in 2 specs)
207. [TC97485_13] FUN | Report Editor | Undo/Redo for contextual link (used in 2 specs)
208. [TC97485_14] FUN | Report Editor | Undo/Redo for short cut metric (used in 2 specs)
209. [TC97485_17] FUN | Report Editor | Undo/Redo in Format Panel 1 (used in 2 specs)
210. [TC97485_18] FUN | Report Editor | Undo/Redo in Format Panel 2 (used in 2 specs)
211. [TC97485_19] FUN | Report Editor | Undo/Redo in Format Panel 3 (used in 2 specs)
212. [TC97485_20] FUN | Report Editor | Undo/Redo for join and prompt (used in 2 specs)
213. [TC97485_21] FUN | Report Editor | Undo/Redo update filter (used in 2 specs)
214. [TC97485_22] FUN | Report Editor | add to / remove from report (used in 2 specs)
215. [TC97485_23] FUN | Report Editor | display attribute forms (used in 2 specs)
216. [TC97485_24] FUN | Report Editor | re-execute (used in 2 specs)
217. [TC99125_01] Execute report by user without use VLDB property editor privilege in authoring mode (used in 2 specs)
218. [TC99125_02] Execute report by user without use VLDB property editor privilege in consumption mode (used in 2 specs)
219. [TC99129_01] Navigate in folder browser dropdown (used in 2 specs)
220. [TC99129_02] Re-open folder browser (used in 2 specs)
221. [TC99427_01] Cancel initial execution (used in 2 specs)
222. [TC99427_02] Cancel initial execution on prompt report (used in 2 specs)
223. [TC99427_03] Cancel apply prompt on report (used in 2 specs)
224. [TC99427_04] Cancel re-prompt (used in 2 specs)
225. [TC99427_05] reset report and cancel (used in 2 specs)
226. [TC99427_06] apply bookmark and cancel (used in 2 specs)
227. [TC99427_07] cancel linking to target report no prompt (used in 2 specs)
228. [TC99427_08] cancel linking to target report with prompt (used in 2 specs)
229. [TC99427_09] cancel re-execute (used in 2 specs)
230. [TC99428_01] cancel when resume data (used in 2 specs)
231. [TC99428_03] cancel when resume data on prompt report after apply prompt (used in 2 specs)
232. [TC99428_04] cancel when re-prompt in authoring (used in 2 specs)
233. [TC99428_05] cancel re-execute in authoring (used in 2 specs)
234. [TC99428_06] cancel during linking in authoring (used in 2 specs)
235. [TC99483_01] Missing font dialog should pop up when entering report authoring mode using monotype font (used in 2 specs)
236. [TC99483_02] Missing font dialog should not pop up when feature flag is on (used in 2 specs)
237. [TC99483_03] Missing font warning in format panel font picker (used in 2 specs)
238. [TC99483_04] Missing font warning in threshold editor font picker (used in 2 specs)
239. [TC99483_05] change to OOTB font in format panel (used in 2 specs)
240. [TC99483_06] change to custom font in threshold editor (used in 2 specs)
241. [TC99483_07] fallback monotype font report in consumption mode (used in 2 specs)
242. [TC99552_01] Attribute Element - default selections by exclude (used in 2 specs)
243. [TC99552_02] Attribute Element - update editable scope filter on consumption (used in 2 specs)
244. [TC99552_03] Attribute Element - check default filter summary (used in 2 specs)
245. [TC99552_04] Attribute Element - update filter and verify in filter summary (used in 2 specs)
246. [TC99552_05] Attribute Element - incremental fetch in element list (used in 2 specs)
247. [TC99552_06] Attribute Element - ready only filter (used in 2 specs)
248. [TC99552_07] Attribute Element - hidden filter (used in 2 specs)
249. [TC99552_08] check scope filter tooltip (used in 2 specs)
250. [TC99553_01] Scope filter - Attribute Qualification - default selections contains and not contains (used in 2 specs)
251. [TC99553_02] Attribute Qualification - update AQ desc contains (used in 2 specs)
252. [TC99553_03] Attribute Qualification - update AQ not contains and check filter summary (used in 2 specs)
253. [TC99553_04] Attribute Qualification - id form not in (used in 2 specs)
254. [TC99553_05] Attribute Qualification - update from filter summary (used in 2 specs)
255. [TC99553_06] Attribute Qualification - operator is equal (used in 2 specs)
256. [TC99553_07] Attribute Qualification - update filter for equals by id and check filter summary (used in 2 specs)
257. [TC99553_08] Attribute Qualification - operator is between for DESC form (used in 2 specs)
258. [TC99553_09] Attribute Qualification - update filter for between by desc and check filter summary (used in 2 specs)
259. [TC99553_10] Attribute Qualification - operator is contains (used in 2 specs)
260. [TC99553_11] Attribute Qualification - update filter for contains by desc and check filter summary (used in 2 specs)
261. [TC99553_12] Attribute Qualification - operator is greater than (used in 2 specs)
262. [TC99554_01] Scope filter - Attribute Qualification - default selections for calendar (used in 2 specs)
263. [TC99554_02] Scope filter - Attribute Qualification - operator is greater than (used in 2 specs)
264. [TC99554_03] Scope filter - Attribute Qualification - available operators (used in 2 specs)
265. [TC99554_04] Scope filter - Attribute Qualification - change operator to less than (used in 2 specs)
266. [TC99554_05] Scope filter - Attribute Qualification - change month by date time picker (used in 2 specs)
267. [TC99554_06] Scope filter - Attribute Qualification - set dynamic date to today (used in 2 specs)
268. [TC99554_07] Scope filter - Attribute Qualification - set dynamic date to today + 100 (used in 2 specs)
269. [TC99554_08] Scope filter - Attribute Qualification - edit from filter summary (used in 2 specs)
270. [TC99554_09] Scope filter - Attribute Qualification - operator is between (used in 2 specs)
271. [TC99643_01] Scope filter - switch to design mode (used in 2 specs)
272. [TC99643_02] Scope filter - show scope filter after execute report (used in 2 specs)
273. [TC99643_03] Scope filter - AE - default selection (used in 2 specs)
274. [TC99643_04] Scope filter - AE - update filter (used in 2 specs)
275. [TC99643_05] Scope filter - AE - warning when no selection (used in 2 specs)
276. [TC99643_06] Scope filter - AQ - update filter by operator is contains (used in 2 specs)
277. [TC99643_07] Scope filter - AE - ready only (used in 2 specs)
278. [TC99643_08] Scope filter - remove from dropzone (used in 2 specs)
279. [TC99643_09] Scope filter - remove from dataset (used in 2 specs)
280. [TC99678_01] Report with page by UI check (used in 2 specs)
281. [TC99678_02] Report change group by (used in 2 specs)
282. [TC99678_03] Report with style and show total (used in 2 specs)
283. [TC99678_04] Report with outline (used in 2 specs)
284. [TC99678_05] Report change page by for multi-form attribute (used in 2 specs)
285. [TC99679_01] Show both report objects and folder browser in authoring (used in 2 specs)
286. [TC99679_02] Adding attribute to report objects by D&D from object browser (used in 2 specs)
287. [TC99679_03] Adding metric to report objects by D&D from object browser (used in 2 specs)
288. [TC99679_04] Adding object prompt to report objects by D&D from object browser (used in 2 specs)
289. [TC99679_05] D&D object from object browser while already in report (used in 2 specs)
290. [TC99679_06] try to D&D other object types (used in 2 specs)
291. [TC99679_07] D&D to remove attribute from dropzone (used in 2 specs)
292. [TC99679_08] D&D to remove metric from dropzone (used in 2 specs)
293. [TC99679_09] multiple select and D&D by object browser to report objects (used in 2 specs)
294. [TC99679_10] D&D object to dropzone for subset report (used in 2 specs)
295. [TC99679_11] Multiple select attributes to D&D objects to dropzone (used in 2 specs)
296. [TC99679_12] Multiple select metrics to D&D objects to dropzone (used in 2 specs)
297. [TC99679_13] Multiple select to D&D objects to move among dropzones (used in 2 specs)
298. [TC99679_14] Multiple select to D&D objects to re-order within dropzones (used in 2 specs)
299. [TC99679_15] Multiple select and add to report by RMC context menu (used in 2 specs)
300. [TC99679_16] Multiple select attribute and metric to dropzones (used in 2 specs)
301. [TC99679_17] DnD objects to view filter on normal report (used in 2 specs)
302. [TC99684_01] Show both report objects and folder browser in authoring (used in 2 specs)
303. [TC99684_02] Report with style and show total (used in 2 specs)
304. [TC99684_03] Navigate in object browser by attribute shortcuts (used in 2 specs)
305. [TC99684_04] Navigate in object browser by metrics shortcuts (used in 2 specs)
306. [TC99684_05] Navigate in object browser by hierarchies shortcuts (used in 2 specs)
307. [TC99684_06] Navigate in object browser by data explorer shortcuts (used in 2 specs)
308. [TC99684_07] empty filter panel (used in 2 specs)
309. [TC99684_08] click cancel to remove filter (used in 2 specs)
310. [TC99684_09] valid filter set (used in 2 specs)
311. [TC99684_10] invalid filter set (used in 2 specs)
312. Add prompt to subset report VF (used in 2 specs)
313. Cancel report execution on authoring mode (used in 2 specs)
314. Cancel report execution on consumption mode (used in 2 specs)
315. Create embedded prompt to subset report VF (used in 2 specs)
316. Create Report by Cube (used in 2 specs)
317. Create Report by Cube Security (used in 2 specs)
318. Folder Browser in Report Editor (used in 2 specs)
319. Format panel changes (used in 2 specs)
320. MDX Report Add Objects (used in 2 specs)
321. MDX Report Creator Test (used in 2 specs)
322. MDX Report Filter (used in 2 specs)
323. MDX Report Privilege (used in 2 specs)
324. Replace mono type font in report editor (used in 2 specs)
325. Replace subset report cube (used in 2 specs)
326. Report apply theme (used in 2 specs)
327. Report Creator Security Test (used in 2 specs)
328. Report Creator Test (used in 2 specs)
329. Report Editor - Minimum Column Width (used in 2 specs)
330. Report editor advanced banding formatting (used in 2 specs)
331. Report editor advanced padding formatting (used in 2 specs)
332. Report Editor Grid View (used in 2 specs)
333. Report Editor Lock Headers in Workstation (used in 2 specs)
334. Report Editor Thresholds (used in 2 specs)
335. Report Editor Thresholds in Workstation (used in 2 specs)
336. Report Editor Undo/Redo Functionality (used in 2 specs)
337. Report Editor Undo/Redo Functionality In Authoring Mode By Creating New Report (used in 2 specs)
338. Report Editor Undo/Redo Functionality In Authoring Mode By Editing Existing Report (used in 2 specs)
339. Report Editor Undo/Redo Functionality In Consumption Mode (used in 2 specs)
340. Report Editor Undo/Redo Functionality In Consumption Mode With Clear Stack (used in 2 specs)
341. Report Outline Mode (used in 2 specs)
342. Report Page By - Part 1 (used in 2 specs)
343. Report Page By - Part 2 (used in 2 specs)
344. Report privilege check (used in 2 specs)
345. Report Template by Execution Mode (used in 2 specs)
346. Report Template Test (used in 2 specs)
347. Report theme general (used in 2 specs)
348. Report UI - Authoring DnD (used in 2 specs)
349. Report UI - Consumption (used in 2 specs)
350. Report UI - Consumption View Filter (used in 2 specs)
351. Report UI - Report filter (used in 2 specs)
352. Report UI - Security Tests (used in 2 specs)
353. Run MDX Report in Consumption (used in 2 specs)
354. Scope Filter - Attribute element list (used in 2 specs)
355. Scope Filter - Attribute element qualification (used in 2 specs)
356. Scope Filter - authoring (used in 2 specs)
357. Scope Filter - Date time (used in 2 specs)
358. Subset Report - Authoring (used in 2 specs)
359. Wrap Text And Metrics Prompt Formatting in report editor (used in 2 specs)
360. [TC81132_1] Drag and drop manipulations from object browser and reordering within/moving from page by (used in 1 specs)
361. [TC81132_2] Drag and drop manipulations from object list and reordering objects within grid (used in 1 specs)
362. [TC81225] Report editor grid view context menu in workstation (used in 1 specs)
363. [TC82211] Report filter summary - filters with scrollbar (used in 1 specs)
364. [TC83059] Test basic workflow in report editor in workstation (used in 1 specs)
365. [TC84646_1] Add subtotals in report with attribute in Page_By (used in 1 specs)
366. [TC84646_2] Add different kinds of subtotals (used in 1 specs)
367. [TC84700_1] Report Execution (used in 1 specs)
368. [TC84700_2] Report Authoring (used in 1 specs)
369. [TC84709_1] FUN | Report Editor | Report Execution (used in 1 specs)
370. [TC84709_10] FUN | Report Editor | Report Execution (used in 1 specs)
371. [TC84709_11] FUN | Report Editor | Report Execution (used in 1 specs)
372. [TC84709_12] FUN | Report Editor | Report Execution (used in 1 specs)
373. [TC84709_13] FUN | Report Editor | Report Execution (used in 1 specs)
374. [TC84709_2] FUN | Report Editor | Report Execution (used in 1 specs)
375. [TC84709_3] FUN | Report Editor | Report Execution (used in 1 specs)
376. [TC84709_4] FUN | Report Editor | Report Execution (used in 1 specs)
377. [TC84709_5] FUN | Report Editor | Report Execution (used in 1 specs)
378. [TC84709_6] FUN | Report Editor | Report Execution (used in 1 specs)
379. [TC84709_7] FUN | Report Editor | Report Execution (used in 1 specs)
380. [TC84709_8] FUN | Report Editor | Report Execution (used in 1 specs)
381. [TC84709_9] FUN | Report Editor | Report Execution (used in 1 specs)
382. [TC85100_1] Report editor subset TC85100 Case 1 Simple_SR in workstation (used in 1 specs)
383. [TC85100_10] Report editor subset TC85100 Case 11 Simple_SR_PromptElement in workstation (used in 1 specs)
384. [TC85100_11] Report editor subset TC85100 Case 6, DE242940 remove only for derived metrics (used in 1 specs)
385. [TC85100_12] Report editor subset TC85100 Case 13 IC_CFCL_SR in workstation (used in 1 specs)
386. [TC85100_2] Report editor subset TC85100 Case 2 IC_SR2 in workstation (used in 1 specs)
387. [TC85100_3] Report editor subset TC85100 Case 3 IC_CFCL_SR in workstation (used in 1 specs)
388. [TC85100_4] Report editor subset TC85100 Case 4 IC_FFSQL_SR in workstation (used in 1 specs)
389. [TC85100_5] Report editor subset TC85100 Case 5 IC_Hierarchy_SR in workstation (used in 1 specs)
390. [TC85100_6] Report editor subset TC85100 Case 6 IC_MDX_SR in workstation (used in 1 specs)
391. [TC85100_7] Report editor subset TC85100 Case 7 IC_QB_SR in workstation (used in 1 specs)
392. [TC85100_8] Report editor subset TC85100 Case 9 IM_Airline_SR in workstation (used in 1 specs)
393. [TC85100_9] Report editor subset TC85100 Case 10 IM_Mapped_SR in workstation (used in 1 specs)
394. [TC85101] Test object prompt in report editor in workstation (used in 1 specs)
395. [TC85123] E2E [Report Editor][Workstation] Contextual Link Creation: Report to Report. (used in 1 specs)
396. [TC85124] E2E [Report Editor][Workstation] Contextual Link Creation: Report to Prompted Report. (used in 1 specs)
397. [TC85128] E2E [Report Editor][Workstation] Contextual Link Creation: Prompted Report to Prompted Report. (used in 1 specs)
398. [TC85322] Report editor sort TC85322 (used in 1 specs)
399. [TC85446_01] Test advanced properties in normal report (used in 1 specs)
400. [TC85446_02] Test advanced properties in subset report (used in 1 specs)
401. [TC85446_03] Test calculation in normal report (used in 1 specs)
402. [TC85446_04] Test calculation in subset report (used in 1 specs)
403. [TC85446_05] Test prompt properties in normal report (used in 1 specs)
404. [TC85446_06] Test prompt properties in prompt in prompt report (used in 1 specs)
405. [TC85446_08] Modify report caching settings (used in 1 specs)
406. [TC85446_09] Modify incremental fetch settings (used in 1 specs)
407. [TC85614_01] Test join behaviors in the In Reports panel (used in 1 specs)
408. [TC85614_02] Test join behaviors in the In Reports panel Case 2 (used in 1 specs)
409. [TC85614_03] Test join behaviors in the In Reports panel Case 3 (used in 1 specs)
410. [TC85654] Test report menubar (used in 1 specs)
411. [TC85744] Create Report, add custom subtotals (used in 1 specs)
412. [TC85824_1] Step1: FUN | Object Panel | Report Objects | Drag and Drop to Grid (used in 1 specs)
413. [TC85824_2] Step 2-4: FUN | Object Panel | Report Objects | Drag and Drop to Grid (used in 1 specs)
414. [TC85824_3] Additional test on drag and drop manipulations to containers pause mode (used in 1 specs)
415. [TC86138_1] Test display attribute forms for Subset Report (used in 1 specs)
416. [TC86138] Test display attribute form in report editor (used in 1 specs)
417. [TC86139_01] FUN | Report Editor | Grid View (used in 1 specs)
418. [TC86139_02] FUN | Report Editor | Grid View (used in 1 specs)
419. [TC86187] Functional [Workstation][Report Editor] Report editor number text formatting (used in 1 specs)
420. [TC86781] Report filter summary - report with attribute filters (used in 1 specs)
421. [TC86787] Report filter summary - report with metric filters (used in 1 specs)
422. [TC86794] Report filter summary - report with set filters (used in 1 specs)
423. [TC86795] Report filter summary - report with group filters (used in 1 specs)
424. [TC86796] Report filter summary - report with NOT filters (used in 1 specs)
425. [TC86797] Report filter summary - Report with Date (used in 1 specs)
426. [TC86798] Report filter summary - report with different filter types(report,custom expression, etc ) (used in 1 specs)
427. [TC86800] Report filter summary - filters with different operators (used in 1 specs)
428. [TC86801] Report filter summary - report with diffrent numbers of filters (0, 1 and N) (used in 1 specs)
429. [TC86803] Report filter summary - view more and view less (used in 1 specs)
430. [TC86804] Report filter summary - filter summary bar (used in 1 specs)
431. [TC86805_01] Report filter summary - Drill manipulation from web - Drill within (used in 1 specs)
432. [TC86805_02] Report filter summary - Drill manipulation from web - Drill out (used in 1 specs)
433. [TC86806] Report filter summary - Do Drill manipulation in library - Drill anywhere (used in 1 specs)
434. [TC86807] Report filter summary - filters with special chars (used in 1 specs)
435. [TC87388] E2E [Report Editor][Workstation] contextual linking - answer prompt methods (used in 1 specs)
436. [TC87516] Report filter - attribute filter - qualify on elements: search and select (used in 1 specs)
437. [TC87517] Report filter - attribute filter - qualify on elements: select in view, clear all (used in 1 specs)
438. [TC87518] Report filter - attribute filter - qualify on elements: In list (used in 1 specs)
439. [TC87519] Report filter - attribute filter - qualify on elements: Not In list (used in 1 specs)
440. [TC87521] Report filter - attribute filter - qualify on attribute form (used in 1 specs)
441. [TC87613] Report filter - metric filter - function by metric value (used in 1 specs)
442. [TC87614] Report filter - metric filter - function by rank (used in 1 specs)
443. [TC87615] Report filter - metric filter - function by percentage (used in 1 specs)
444. [TC87624] Report filter - set filter - related by system default (used in 1 specs)
445. [TC87625] Report filter - set filter - set filter when related by metric (used in 1 specs)
446. [TC87690] Report filter - edit filter - edit attribute filter (used in 1 specs)
447. [TC87691] Report filter - edit filter - edit metric filter (used in 1 specs)
448. [TC87692] Report filter - edit filter - edit set filter (used in 1 specs)
449. [TC87760] Report fitler - group - group qualificaiton filter (used in 1 specs)
450. [TC87761] Report fitler - group - group set filter (used in 1 specs)
451. [TC87762] Report filter - group - change group relationship( And, Or, Not) (used in 1 specs)
452. [TC87763] Report filter - group - NOT a single filter (used in 1 specs)
453. [TC87764] Report filter - group - NOT a group filter (used in 1 specs)
454. [TC87765] Report filter - group - group for aggregation filter (used in 1 specs)
455. [TC87787] Report filter - setting - use as aggregation filter (used in 1 specs)
456. [TC87788] Report filter - setting - use as view filter (used in 1 specs)
457. [TC87789] Report filter - setting - advanced (used in 1 specs)
458. [TC87790] Report filter - setting - delete (used in 1 specs)
459. [TC87791] Report filter - setting - add qualificaiton (used in 1 specs)
460. [TC87792] Report filter - setting - remove set (used in 1 specs)
461. [TC87793] Report filter - setting - remove all filters (used in 1 specs)
462. [TC87794] Report filter - setting - hide filter summary (used in 1 specs)
463. [TC87795] Report filter - setting - pin and unpin filter panel (used in 1 specs)
464. [TC87866] Report filter - filter panel - filter panel render under 0,1, N filter (used in 1 specs)
465. [TC87867] Report filter - filter panel - filter panel interact with filter summary (used in 1 specs)
466. [TC87873] Report filter - filter panel - apply filter with valid and invalid filter (used in 1 specs)
467. [TC87874] Report filter - filter panel - user without priviledge is not able to see filter panel (used in 1 specs)
468. [TC87875] Report filter - setting - edit (used in 1 specs)
469. [TC87876] Report filter - setting - setting for empty expression (used in 1 specs)
470. [TC87877] Report filter - pin - new and edit filter (used in 1 specs)
471. [TC87878] Report filter - pin - large filters (under pin and unpin) (used in 1 specs)
472. [TC87879] Report filter - edit filter - inline edit filter (used in 1 specs)
473. [TC88124] Report filter summary - All kinds of normal prompt display (used in 1 specs)
474. [TC88127] Report filter summary - value prompt display (used in 1 specs)
475. [TC88128] Report filter summary - prompt in prompt display (used in 1 specs)
476. [TC88129] Report filter - date - select static day (used in 1 specs)
477. [TC88130] Report filter - date - select dynamic day (used in 1 specs)
478. [TC88134] Report filter - date - select static hour (used in 1 specs)
479. [TC88135] Report filter - date - select dynamic hour (used in 1 specs)
480. [TC88136] Report filter - operator - list of values for In/Not in (used in 1 specs)
481. [TC90698] Report filter - I18N - Attribute (used in 1 specs)
482. [TC90699] Report filter - I18N - Metric (used in 1 specs)
483. Library Report Filter Summary - Drill (used in 1 specs)
484. Library Report Filter Summary - Prompt (used in 1 specs)
485. Library Report Filter Summary - report filter (used in 1 specs)
486. Library Report View Filter - Filters (used in 1 specs)
487. Library Report View Filter - Group (used in 1 specs)
488. Library Report View Filter - Setting (used in 1 specs)
489. Objects panel in report editor (Drag and Drop actions) (used in 1 specs)
490. Prompt in Report Editor in Workstation (used in 1 specs)
491. Report Editor - Contextual linking (used in 1 specs)
492. Report Editor Advanced Properties (used in 1 specs)
493. Report Editor Display Attribute Form (used in 1 specs)
494. Report Editor Grid View Context Menu in Workstation (used in 1 specs)
495. Report Editor Menubar (used in 1 specs)
496. Report editor number text formatting (used in 1 specs)
497. Report Editor Sort in Workstation (used in 1 specs)
498. Report Editor Subset in Workstation (used in 1 specs)
499. Report Per-build Test (used in 1 specs)
500. Subtotals in report editor (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getGridCellTextByPos -- frequency: 2079
2. getGridCellStyleByPos -- frequency: 413
3. {expected} -- frequency: 365
4. {actual} -- frequency: 349
5. getContainer -- frequency: 320
6. getText -- frequency: 207
7. getPageBySelectorText -- frequency: 163
8. getGridCellByPos -- frequency: 134
9. getGridCellText -- frequency: 108
10. getElementFromPopupList -- frequency: 85
11. getRowsObjects -- frequency: 65
12. getSummaryBarText -- frequency: 63
13. getGridCellStyleByRows -- frequency: 58
14. getGridCellStyleByCols -- frequency: 56
15. getReportFilterRowValue -- frequency: 53
16. getSortingColumnByRowAndCol -- frequency: 52
17. getPromptByName -- frequency: 49
18. getCreateNewDossierPanel -- frequency: 48
19. getMainPanel -- frequency: 43
20. getCurrentSelectionOnSortingColumnByRowAndCol -- frequency: 42
21. getViewFilterCount -- frequency: 39
22. getDropDownItem -- frequency: 38
23. getMetricsObjects -- frequency: 36
24. getSelectorByIdx -- frequency: 36
25. getDetailedPanel -- frequency: 35
26. getPaddingValue -- frequency: 34
27. getSelectorPulldownTextBox -- frequency: 34
28. getSummaryContainer -- frequency: 34
29. getContextMenuOption -- frequency: 33
30. getPageByObjects -- frequency: 32
31. getExpressionGroupCount -- frequency: 23
32. getCurrentTheme -- frequency: 22
33. getFilterPanelDropdown -- frequency: 22
34. getIndexForElementFromPopupList -- frequency: 21
35. getViewFilterRowValue -- frequency: 21
36. getPropertySettingDetailsByName -- frequency: 20
37. getTemplateIcon -- frequency: 20
38. getViewFilterTab -- frequency: 20
39. getAggregationFilterCount -- frequency: 18
40. getColumnsObjects -- frequency: 17
41. getActiveTabHeaderText -- frequency: 16
42. getFlatObjectListContainer -- frequency: 16
43. getGridCellChildSpanByPos -- frequency: 16
44. getMinimumColumnWithInputValue -- frequency: 16
45. getReplaceObjectDialog -- frequency: 16
46. getConfirmDialog -- frequency: 14
47. getDossierView -- frequency: 14
48. getGridCellExpandIconByPos -- frequency: 14
49. getNOTCount -- frequency: 14
50. getSettingMenu -- frequency: 14
51. getVisualizationViewPort -- frequency: 14
52. getActiveMenuDropdown -- frequency: 12
53. getAttributeElementFilterSubpanel -- frequency: 12
54. getElementListCount -- frequency: 12
55. getNavigationBar -- frequency: 12
56. getSearchDropdown -- frequency: 12
57. getObjectInReportTab -- frequency: 11
58. getSelector -- frequency: 11
59. getCreateEmbeddedPromptButton -- frequency: 10
60. getGridCellCollapseIconByPos -- frequency: 10
61. getPopover -- frequency: 10
62. getObjectInDropzone -- frequency: 9
63. getConfirmSwitchProjectPopup -- frequency: 8
64. getCurrentSelectedFont -- frequency: 8
65. getDateTimePicker -- frequency: 8
66. getMissingFontTooltip -- frequency: 8
67. getOptionItemsCount -- frequency: 8
68. getReportFooter -- frequency: 8
69. getSelectedChecklistElementInContextMenu -- frequency: 8
70. getSelectedObjectListText -- frequency: 8
71. getSelectedOperator -- frequency: 8
72. getDrillToItem -- frequency: 7
73. getGroupActionLinkCount -- frequency: 7
74. getObjectContextMenuItem -- frequency: 7
75. 83 C962 -- frequency: 6
76. AADED7 -- frequency: 6
77. FFDEC6 -- frequency: 6
78. getCoverImageUrlByName -- frequency: 6
79. getCurrentAttributeDisplayFormModeText -- frequency: 6
80. getDatasetSelectContainer -- frequency: 6
81. getFilterSubpanel -- frequency: 6
82. getFolderBrowserTreePopover -- frequency: 6
83. getFontSelectorValue -- frequency: 6
84. getFontTextSizeInputValue -- frequency: 6
85. getGridCellImgSrcByPos -- frequency: 6
86. getMissingFontPopup -- frequency: 6
87. getNoResultWarning -- frequency: 6
88. getOperatorText -- frequency: 6
89. getReportFilterSetValue -- frequency: 6
90. getSetText -- frequency: 6
91. getThreeDotsToOpenCubeMenu -- frequency: 6
92. getCustomContainer -- frequency: 5
93. getSummarySection -- frequency: 5
94. 1 C8 DD4 -- frequency: 4
95. DEDEDE -- frequency: 4
96. getBaseOnText -- frequency: 4
97. getBorderColorDropDownSectionStyle -- frequency: 4
98. getBorderStyleDropdownValue -- frequency: 4
99. getCheckedCheckbox -- frequency: 4
100. getConfirmButtonInAutoSaveDialog -- frequency: 4
101. getConfirmMessage -- frequency: 4
102. getConstValueInput -- frequency: 4
103. getContextMenu -- frequency: 4
104. getCreateNewDossierSelectTemplateInfoPanel -- frequency: 4
105. getCubeFlatGrid -- frequency: 4
106. getCurrentInputText -- frequency: 4
107. getCurrentProject -- frequency: 4
108. getCurrentSelection -- frequency: 4
109. getDisabledContextMenuOption -- frequency: 4
110. getEnabledButtonFromToolbar -- frequency: 4
111. getErrorDialogMainContainer -- frequency: 4
112. getGridCellDiv -- frequency: 4
113. getGroupOperatorCount -- frequency: 4
114. getObjectListFlatView -- frequency: 4
115. getPromptSummaryContainer -- frequency: 4
116. getRankSubMenu -- frequency: 4
117. getReportPropertiesDialog -- frequency: 4
118. getSaveAsEditor -- frequency: 4
119. getSearchBox -- frequency: 4
120. getSelectedForm -- frequency: 4
121. getSelectedRelatedBy -- frequency: 4
122. getSelectorNameByIdx -- frequency: 4
123. getSetAsTemplateCheckboxOnSaveAsEditor -- frequency: 4
124. getSetPopover -- frequency: 4
125. getSortChecked -- frequency: 4
126. getSummaryPanel -- frequency: 4
127. getThemePanel -- frequency: 4
128. getTooltipContent -- frequency: 4
129. getTooltipText -- frequency: 4
130. getValidationText -- frequency: 4
131. getValueOfMinimumColumnWidthOption -- frequency: 4
132. getViewFilterEmptyPlaceholder -- frequency: 4
133. Dataset Select Container -- frequency: 3
134. getDropdownMenu -- frequency: 3
135. getFilterIcon -- frequency: 3
136. getOpenedSelectionList -- frequency: 3
137. getPanelWidth -- frequency: 3
138. getRowCounts -- frequency: 3
139. getSelectedBreakBy -- frequency: 3
140. getSelectedCartItemCount -- frequency: 3
141. getSelectedSetOf -- frequency: 3
142. getSummaryBar -- frequency: 3
143. .. -- frequency: 2
144. ..(formerly -- frequency: 2
145. 028 F94 -- frequency: 2
146. ABABAB -- frequency: 2
147. Container -- frequency: 2
148. Date Time Picker -- frequency: 2
149. Detailed Right Panel -- frequency: 2
150. FBDAD9 -- frequency: 2
151. FFAE8 B -- frequency: 2
152. Filter Panel -- frequency: 2
153. getActiveTab -- frequency: 2
154. getAllElementsFromPopupList -- frequency: 2
155. getAntDropdown -- frequency: 2
156. getApplyBtn -- frequency: 2
157. getApplyColorByNumberOfColumns -- frequency: 2
158. getAttribute -- frequency: 2
159. getAttributeOptionCount -- frequency: 2
160. getCertifiedIcon -- frequency: 2
161. getClearSortIcon -- frequency: 2
162. getContextMenuOptionCheckBox -- frequency: 2
163. getContextMenuSubOption -- frequency: 2
164. getContinueOnSaveDialog -- frequency: 2
165. getCreateNewDossierAddDataBody -- frequency: 2
166. getCurrentSelectedFolder -- frequency: 2
167. getCurrentThemeCardSize -- frequency: 2
168. getCurrentThemeContainer -- frequency: 2
169. getDateTimeInputValue -- frequency: 2
170. getDynamicDateTimePicker -- frequency: 2
171. getEmptyFilter -- frequency: 2
172. getFirstBandingColor -- frequency: 2
173. getFolderBrowserDropdown -- frequency: 2
174. getFolderBrowserPopover -- frequency: 2
175. getFolderItemByName -- frequency: 2
176. getGridViewSectionInPauseMode -- frequency: 2
177. getGroupBySelector -- frequency: 2
178. getInputSectionText -- frequency: 2
179. getLayoutSelectionBoxValue -- frequency: 2
180. getObjectDescText -- frequency: 2
181. getObjectLocationText -- frequency: 2
182. getOperatorDropdown -- frequency: 2
183. getPromptContainer -- frequency: 2
184. getPromptEditor -- frequency: 2
185. getQualificationEditor -- frequency: 2
186. getReExecuteButton -- frequency: 2
187. getReportTitle -- frequency: 2
188. getRowDataInAddDataTab -- frequency: 2
189. getSearchbox -- frequency: 2
190. getSelectedFunction -- frequency: 2
191. getSetOfDropdown -- frequency: 2
192. getSortByObjectText -- frequency: 2
193. getSummaryText -- frequency: 2
194. getTab -- frequency: 2
195. getTextInInputSection -- frequency: 2
196. getTimeValue -- frequency: 2
197. getTitleText -- frequency: 2
198. getTotalObjectCount -- frequency: 2
199. getUncheckedCheckbox -- frequency: 2
200. getViewModeSelector -- frequency: 2
201. getVIVizPanel -- frequency: 2
202. Object Search Dropdown -- frequency: 2
203. Re Execute Button -- frequency: 2
204. Active Menu Dropdown -- frequency: 1
205. Advanced Option Content -- frequency: 1
206. APMRadio Group -- frequency: 1
207. Apply Btn -- frequency: 1
208. Attribute Element Filter Subpanel -- frequency: 1
209. Attribute Element List -- frequency: 1
210. Attribute Form Text -- frequency: 1
211. Break By Selector -- frequency: 1
212. Cancel Button In Top Loading Bar -- frequency: 1
213. Cancel Execution Btn -- frequency: 1
214. Clear All -- frequency: 1
215. Close Icon -- frequency: 1
216. Confirm Dialog -- frequency: 1
217. Confirm Save Dialog -- frequency: 1
218. Context Menu -- frequency: 1
219. Create Embedded Prompt Button -- frequency: 1
220. Custom Container -- frequency: 1
221. Detailed Panel -- frequency: 1
222. Disabled View Selected -- frequency: 1
223. Display Attribute Forms Btn In Context Menu -- frequency: 1
224. Document Body -- frequency: 1
225. Done Button -- frequency: 1
226. Dossier Name Input From Save As Window -- frequency: 1
227. Drill Notification Box -- frequency: 1
228. Drill Options Dialog -- frequency: 1
229. Dropdown -- frequency: 1
230. Dropdown Container -- frequency: 1
231. Editor Container -- frequency: 1
232. Editor Panel -- frequency: 1
233. Filter Editor -- frequency: 1
234. Filter Header Title -- frequency: 1
235. Filter Icon -- frequency: 1
236. Filter Menu -- frequency: 1
237. Filter Panel Container -- frequency: 1
238. Filter Subpanel -- frequency: 1
239. Filter Summary -- frequency: 1
240. First Page By Dropdown -- frequency: 1
241. Folder Browser Popover -- frequency: 1
242. Form Qualification Container -- frequency: 1
243. Format Panel -- frequency: 1
244. getAllElementsInReportPane -- frequency: 1
245. getClipboardText -- frequency: 1
246. getContextMenuItem -- frequency: 1
247. getFilterMenu -- frequency: 1
248. getGroupOperatorItemCount -- frequency: 1
249. getMetricDefinition -- frequency: 1
250. getNotCount -- frequency: 1
251. getSubmenuItem -- frequency: 1
252. getTargetPromptName -- frequency: 1
253. getTargetReportName -- frequency: 1
254. getZoneObjectsInOrder -- frequency: 1
255. Grid -- frequency: 1
256. Grid View Section In Pause Mode -- frequency: 1
257. Group By Selector -- frequency: 1
258. Library Icon -- frequency: 1
259. List Title -- frequency: 1
260. Missing Font Popup -- frequency: 1
261. Mojo Loading Box -- frequency: 1
262. Multiselect Toolbar -- frequency: 1
263. Natural Language Query Inputbox -- frequency: 1
264. New Menu -- frequency: 1
265. Object Browser Panel -- frequency: 1
266. Object Desc Tooltip -- frequency: 1
267. Object List Container -- frequency: 1
268. Object Location Tooltip -- frequency: 1
269. Operator Dropdown -- frequency: 1
270. Page By Button -- frequency: 1
271. Page By Sorting Dialog -- frequency: 1
272. Path Bar -- frequency: 1
273. Popover -- frequency: 1
274. Prompt Editor -- frequency: 1
275. Prompt Value Input -- frequency: 1
276. Qualification Editor -- frequency: 1
277. Qualify On -- frequency: 1
278. Qualify On Dropdown -- frequency: 1
279. Qualify On Info -- frequency: 1
280. Relate By Search Dropdown -- frequency: 1
281. Remove Btn In Context Menu -- frequency: 1
282. Replace Object Dialog -- frequency: 1
283. Report Authoring Close Btn -- frequency: 1
284. Report Edit Button -- frequency: 1
285. Report Editor Dataset -- frequency: 1
286. Report Error Dialog -- frequency: 1
287. Report Filter Panel Container -- frequency: 1
288. Report Objects Panel -- frequency: 1
289. Report Title Bar -- frequency: 1
290. Report View Filter Panel Container -- frequency: 1
291. Resize Border -- frequency: 1
292. Row Count -- frequency: 1
293. Save Filter Btn -- frequency: 1
294. Search Container -- frequency: 1
295. Search Group By Dropdown -- frequency: 1
296. Search Loading -- frequency: 1
297. Search Loading Text -- frequency: 1
298. Select All -- frequency: 1
299. Selected Break By Title -- frequency: 1
300. Selector Dropdown Container -- frequency: 1
301. Set Of Dropdown -- frequency: 1
302. Set Popover -- frequency: 1
303. Status Bar -- frequency: 1
304. Summary Bar -- frequency: 1
305. Summary Panel -- frequency: 1
306. Theme Panel -- frequency: 1
307. Three Dots To Open Cube Menu -- frequency: 1
308. Time Picker Container -- frequency: 1
309. Tooltip -- frequency: 1
310. Value Info -- frequency: 1
311. View Filter Tab -- frequency: 1
312. Wait Loading -- frequency: 1

## Key Actions

- `getGridCellTextByPos(row, col)` -- used in 2079 specs
- `getGridCellStyleByPos(row, col, style)` -- used in 413 specs
- `editReportByUrl()` -- used in 407 specs
- `switchToDesignMode(prompt = false)` -- used in 346 specs
- `isDisplayed()` -- used in 327 specs
- `getContainer()` -- used in 320 specs
- `getText()` -- used in 277 specs
- `stringify()` -- used in 264 specs
- `clickBottomBarToLoseFocus()` -- used in 252 specs
- `openDefaultApp()` -- used in 232 specs
- `waitForGridCellToBeExpectedValue(row, col, expectedValue)` -- used in 226 specs
- `waitForReportLoading(isAuthoring = false)` -- used in 187 specs
- `clickContextMenuOption(option, waitForLoading = false)` -- used in 175 specs
- `login()` -- used in 173 specs
- `getPageBySelectorText()` -- used in 163 specs
- `clickUndo(authoring = false)` -- used in 158 specs
- `switchProjectByName()` -- used in 144 specs
- `openReportByUrl()` -- used in 138 specs
- `switchToFilterPanel()` -- used in 136 specs
- `getGridCellByPos()` -- used in 134 specs
- `createNewReport()` -- used in 128 specs
- `clickRedo(authoring = false)` -- used in 126 specs
- `open()` -- used in 124 specs
- `getGridCellText(row, col)` -- used in 108 specs
- `openSelectorContextMenu(selectorName)` -- used in 99 specs
- `waitForReportLoadingIsNotDisplayed()` -- used in 96 specs
- `done()` -- used in 89 specs
- `handleError()` -- used in 89 specs
- `openObjectContextMenu(dropZone, objectType, objectName)` -- used in 88 specs
- `navigateInObjectBrowserFlatView()` -- used in 86 specs
- `getElementFromPopupList()` -- used in 85 specs
- `selectGridSegment(option1, option2)` -- used in 84 specs
- `selectMultipleItemsInObjectList(itemNames)` -- used in 83 specs
- `addObjectToRows(objectName)` -- used in 80 specs
- `selectFromDropdown(row, col, option)` -- used in 80 specs
- `waitForLoading()` -- used in 80 specs
- `apply()` -- used in 79 specs
- `openDossier()` -- used in 73 specs
- `switchToFormatPanel()` -- used in 73 specs
- `clickCreateButton()` -- used in 72 specs
- `toBeTruthy()` -- used in 72 specs
- `openDropdownFromSelector(selectorName)` -- used in 71 specs
- `openDropdown(row, col)` -- used in 68 specs
- `selectItemInObjectList(itemName)` -- used in 66 specs
- `clickSubMenuItem(menuItem, subMenuItem)` -- used in 65 specs
- `getRowsObjects()` -- used in 65 specs
- `getSummaryBarText()` -- used in 63 specs
- `addSingle()` -- used in 61 specs
- `clickElmInAvailableList()` -- used in 61 specs
- `viewAll()` -- used in 61 specs
- `getGridCellStyleByRows(colStart, colEnd, row, style)` -- used in 58 specs
- `searchTemplate()` -- used in 58 specs
- `changePageByElement(selectorName, elementName)` -- used in 57 specs
- `getGridCellStyleByCols(rowStart, rowEnd, col, style)` -- used in 56 specs
- `selectElements(elementNames)` -- used in 55 specs
- `clickBtn(btn)` -- used in 54 specs
- `openGridColumnHeaderContextMenu(columnHeader)` -- used in 54 specs
- `selectTemplate()` -- used in 54 specs
- `getReportFilterRowValue()` -- used in 53 specs
- `switchToInReportTab()` -- used in 53 specs
- `getSortingColumnByRowAndCol()` -- used in 52 specs
- `waitForViewFilterPanelLoading()` -- used in 52 specs
- `close()` -- used in 50 specs
- `switchToThemePanel()` -- used in 50 specs
- `getPromptByName()` -- used in 49 specs
- `dndFromObjectBrowserToReportFilters({ objectName, target = 'report filters', options = {} })` -- used in 48 specs
- `enterValue(value, index = 1)` -- used in 48 specs
- `getCreateNewDossierPanel()` -- used in 48 specs
- `isUndoDisabled(authoring = false)` -- used in 48 specs
- `clickObjectContextMenuItem(menuItem)` -- used in 46 specs
- `contextMenuContainsOption(optionName)` -- used in 46 specs
- `searchTheme()` -- used in 46 specs
- `run()` -- used in 45 specs
- `findInlineFilterItem()` -- used in 44 specs
- `getMainPanel()` -- used in 43 specs
- `clickTextFormatButton(type)` -- used in 42 specs
- `filterSummaryText({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 })` -- used in 42 specs
- `getCurrentSelectionOnSortingColumnByRowAndCol()` -- used in 42 specs
- `selectExpressionContextMenu({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 })` -- used in 42 specs
- `sleep()` -- used in 42 specs
- `clickFolderUpMultipleTimes(count)` -- used in 41 specs
- `switchToSqlView()` -- used in 41 specs
- `switchToViewFilterTab()` -- used in 41 specs
- `isRedoDisabled(authoring = false)` -- used in 40 specs
- `replace()` -- used in 40 specs
- `selectContextMenuOption(optionText)` -- used in 40 specs
- `trim()` -- used in 40 specs
- `getViewFilterCount()` -- used in 39 specs
- `getDropDownItem()` -- used in 38 specs
- `waitForElementVisible()` -- used in 38 specs
- `createNewReportByUrl()` -- used in 36 specs
- `getMetricsObjects()` -- used in 36 specs
- `getSelectorByIdx()` -- used in 36 specs
- `searchObject()` -- used in 36 specs
- `selectBasedOnObject(objName, selectorCls)` -- used in 36 specs
- `clickFolderUpIcon()` -- used in 35 specs
- `getDetailedPanel()` -- used in 35 specs
- `applyTheme()` -- used in 34 specs
- `getPaddingValue(paddingType)` -- used in 34 specs
- `getSelectorPulldownTextBox()` -- used in 34 specs
- `getSummaryContainer()` -- used in 34 specs
- `openFolderBrowserPopover()` -- used in 34 specs
- `selectGridColumns()` -- used in 34 specs
- `switchToMdxSourceTab()` -- used in 34 specs
- `clickDoneButton()` -- used in 33 specs
- `getContextMenuOption()` -- used in 33 specs
- `getPageByObjects()` -- used in 32 specs
- `switchToTextFormatTab()` -- used in 32 specs
- `dndFromObjectPanelToContainer(objectName, destination, options = {})` -- used in 31 specs
- `addObjectToColumns(objectName)` -- used in 29 specs
- `clickFilterApplyButton()` -- used in 29 specs
- `clickMenuItem(menuItem)` -- used in 29 specs
- `expandLayoutSection()` -- used in 29 specs
- `isAttributeFormChecked(form)` -- used in 29 specs
- `isEditorOpen()` -- used in 28 specs
- `openSelector(selectorName)` -- used in 28 specs
- `pause()` -- used in 28 specs
- `saveAndCloseQualificationEditor(wait = true)` -- used in 28 specs
- `searchObjectInObjectBrowser(objectName, option)` -- used in 28 specs
- `switchToGridView()` -- used in 28 specs
- `waitForStatusBarText(text)` -- used in 28 specs
- `findPrompt()` -- used in 26 specs
- `isCreateButtonEnabled()` -- used in 26 specs
- `isUndoEnabled(authoring = false)` -- used in 26 specs
- `navigateInObjectBrowserPopover(paths)` -- used in 26 specs
- `setMinimumColumnWidthValue(unit, value)` -- used in 26 specs
- `waitForObjectSearchDropdown()` -- used in 26 specs
- `clickApplyButtonInReportPromptEditor()` -- used in 25 specs
- `addMultipleObjectsToColumns(objectNames)` -- used in 24 specs
- `chooseItemInAvailableCart(index, sectionName, itemName)` -- used in 24 specs
- `clickCancelExecutionButton()` -- used in 24 specs
- `selectOption(selection)` -- used in 24 specs
- `selectReportPropertyType(option)` -- used in 24 specs
- `switchToTemplateTab()` -- used in 24 specs
- `getExpressionGroupCount()` -- used in 23 specs
- `getCurrentTheme()` -- used in 22 specs
- `getFilterPanelDropdown()` -- used in 22 specs
- `openFilterByHeader({ expType, objectName, index })` -- used in 22 specs
- `searchData()` -- used in 22 specs
- `setTextFontSize()` -- used in 22 specs
- `switchToCubesTab()` -- used in 22 specs
- `getIndexForElementFromPopupList(elementName)` -- used in 21 specs
- `getViewFilterRowValue(name, index = 1)` -- used in 21 specs
- `clickDoneCancelButton(option)` -- used in 20 specs
- `getPropertySettingDetailsByName(settingName)` -- used in 20 specs
- `getTemplateIcon()` -- used in 20 specs
- `getViewFilterTab()` -- used in 20 specs
- `openSelectCubeDialog()` -- used in 20 specs
- `scrollToTopInTreePopover()` -- used in 20 specs
- `selectExecutionMode()` -- used in 20 specs
- `selectOptionFromBorderStyleDropdown(option, type)` -- used in 20 specs
- `selectReportCube()` -- used in 20 specs
- `addObjectToPageBy(objectName)` -- used in 18 specs
- `clickOkButton()` -- used in 18 specs
- `closeNewDossierPanel()` -- used in 18 specs
- `getAggregationFilterCount()` -- used in 18 specs
- `goToLibrary()` -- used in 18 specs
- `isSubmenuItemDisplayed(option)` -- used in 18 specs
- `openGridContextMenuByPos(row, col)` -- used in 18 specs
- `openNewViewFilterPanel()` -- used in 18 specs
- `selectObjectInFlatView()` -- used in 18 specs
- `sortByOption(objectName, option)` -- used in 18 specs
- `switchToEditorPanel()` -- used in 18 specs
- `typeInSearchBox(searchString)` -- used in 18 specs
- `clickContextMenuItem(menuItem)` -- used in 17 specs
- `getColumnsObjects()` -- used in 17 specs
- `selectSubmenuOption(menuItems, noWait = false)` -- used in 17 specs
- `clickBuiltInColor()` -- used in 16 specs
- `clickCheckBoxForOption(sectionName, optionName)` -- used in 16 specs
- `clickFolderUpButton()` -- used in 16 specs
- `clickReportTitle()` -- used in 16 specs
- `dndFromObjectBrowserToReportViewFilter({ objectName, target = 'filter data', options = {} })` -- used in 16 specs
- `expandSpacingSection()` -- used in 16 specs
- `getActiveTabHeaderText()` -- used in 16 specs
- `getFlatObjectListContainer()` -- used in 16 specs
- `getGridCellChildSpanByPos()` -- used in 16 specs
- `getMinimumColumnWithInputValue(unit)` -- used in 16 specs
- `getReplaceObjectDialog()` -- used in 16 specs
- `isInPauseMode()` -- used in 16 specs
- `scrollGridToBottom(visualization = 'Visualization 1')` -- used in 16 specs
- `selectPauseMode()` -- used in 16 specs
- `selectPromptByIndex()` -- used in 16 specs
- `toggleViewSelected()` -- used in 16 specs
- `edit({ name, isSetFilter = false, index = 1, section = reportFilterSections.VIEW_FILTER })` -- used in 15 specs
- `moveGridHeaderToPageBy(objectToDrag, position, targetObject)` -- used in 15 specs
- `removeAttributeInRowsDropZone(attributeName)` -- used in 15 specs
- `saveAndCloseContextMenu()` -- used in 15 specs
- `switchToAllTab()` -- used in 15 specs
- `addMinimumColumnWidthOption(unit)` -- used in 14 specs
- `addMultipleObjectsToRows(objectNames)` -- used in 14 specs
- `clickCreateEmbeddedPrompt()` -- used in 14 specs
- `clickOutlineIconFromCH(columnHeader)` -- used in 14 specs
- `create()` -- used in 14 specs
- `getConfirmDialog()` -- used in 14 specs
- `getDossierView()` -- used in 14 specs
- `getGridCellExpandIconByPos(row, col)` -- used in 14 specs
- `getNOTCount()` -- used in 14 specs
- `getSettingMenu()` -- used in 14 specs
- `getVisualizationViewPort()` -- used in 14 specs
- `isSubMenuItemVisible(menuItem, subMenuItem)` -- used in 14 specs
- `isThemePanelDisplayed()` -- used in 14 specs
- `log()` -- used in 14 specs
- `openMinimumColumnWidthMenu()` -- used in 14 specs
- `waitForPromptLoading()` -- used in 14 specs
- `enableDisplayAttributeForms(objectName, formNames, save = true)` -- used in 13 specs
- `filterSummaryBoxValue({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 })` -- used in 13 specs
- `openNewQualicationEditorAtNonAggregationLevel()` -- used in 13 specs
- `applyButtonEnabled()` -- used in 12 specs
- `clearAndInputText()` -- used in 12 specs
- `clickBasedOn(selectorCls)` -- used in 12 specs
- `clickUpdateSqlView()` -- used in 12 specs
- `doubleClickObject()` -- used in 12 specs
- `getActiveMenuDropdown()` -- used in 12 specs
- `getAttributeElementFilterSubpanel()` -- used in 12 specs
- `getElementListCount()` -- used in 12 specs
- `getNavigationBar()` -- used in 12 specs
- `getSearchDropdown()` -- used in 12 specs
- `resetLocalStorage()` -- used in 12 specs
- `runNoWait()` -- used in 12 specs
- `selectNewObjects(options)` -- used in 12 specs
- `toBeDisplayed()` -- used in 12 specs
- `waitForElementListLoading()` -- used in 12 specs
- `clickDefaultFormCheckBox()` -- used in 11 specs
- `clickQualifyOn()` -- used in 11 specs
- `closeReportAuthoringWithoutSave()` -- used in 11 specs
- `getObjectInDropzone()` -- used in 11 specs
- `getObjectInReportTab()` -- used in 11 specs
- `getSelector()` -- used in 11 specs
- `saveAndCloseAttributeFormsDialog()` -- used in 11 specs
- `selectAttributeElements(elemNames)` -- used in 11 specs
- `selectAttributeFormOption(option, isInOrNotIn = false)` -- used in 11 specs
- `actionOnToolbar(actionName, option = { isWait: true })` -- used in 10 specs
- `clickCheckBox()` -- used in 10 specs
- `clickDoneButtonInContextualLinkingEditor()` -- used in 10 specs
- `clickEvaluationOrder(option)` -- used in 10 specs
- `clickFilterByCategory({ name, index = 0 })` -- used in 10 specs
- `collapseOutlineFromCell(elementName)` -- used in 10 specs
- `dismissMissingFontPopup()` -- used in 10 specs
- `dndByMultiSelectFromReportObjectsToDropzone({ objectNames, dropzone })` -- used in 10 specs
- `dndFromObjectBrowserToGrid(objectName)` -- used in 10 specs
- `dndFromObjectBrowserToReportObjectsPanel(objectName, options = {})` -- used in 10 specs
- `getCreateEmbeddedPromptButton()` -- used in 10 specs
- `getGridCellCollapseIconByPos(row, col)` -- used in 10 specs
- `getPopover()` -- used in 10 specs
- `navigateInObjectBrowser(paths)` -- used in 10 specs
- `openAttributeFormsDialogInRows(objectName)` -- used in 10 specs
- `openOperatorDropdown()` -- used in 10 specs
- `openUrl()` -- used in 10 specs
- `renameObjectInReportTab(objectName, newName)` -- used in 10 specs
- `saveAndCloseAdvancedThresholdEditor()` -- used in 10 specs
- `saveAndCloseSubtotalsEditor()` -- used in 10 specs
- `saveFormulaMetric()` -- used in 10 specs
- `selectExpression({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 })` -- used in 10 specs
- `selectFromEvaluationOrderList(option)` -- used in 10 specs
- `selectOptionFromBorderColorDropdown(option, type)` -- used in 10 specs
- `setPaddingValue(paddingType, paddingValue)` -- used in 10 specs
- `title()` -- used in 10 specs
- `toLowerCase()` -- used in 10 specs
- `dndObjectFromObjectBrowserToRows(objectName)` -- used in 9 specs
- `dndVerticalScrollbar(moveY)` -- used in 9 specs
- `isSubmenuOptionSelected(menuItems)` -- used in 9 specs
- `selectTypeCheckbox(type)` -- used in 9 specs
- `sortAscendingBySortIcon(objectName)` -- used in 9 specs
- `addAdvancedSortParameter()` -- used in 8 specs
- `addAll()` -- used in 8 specs
- `clickBasedOnCategory(category)` -- used in 8 specs
- `clickCancelButtonInTopLoadingBar(option)` -- used in 8 specs
- `clickChecklistElementInContextMenu(attributeName)` -- used in 8 specs
- `clickFontColorBtn()` -- used in 8 specs
- `clickLinkToButton()` -- used in 8 specs
- `closeBorderColorDropdown(type)` -- used in 8 specs
- `createPercentToTotalForMetricInMetricsDropZone(objectName, option)` -- used in 8 specs
- `createRankForMetricInMetricsDropZone(objectName, option = 'Ascending')` -- used in 8 specs
- `createTransformationForMetricInMetricsDropZone(submenuOption, option, objectName)` -- used in 8 specs
- `dismissColorPicker()` -- used in 8 specs
- `doneButtonEnabled()` -- used in 8 specs
- `expandTemplateSection()` -- used in 8 specs
- `getConfirmSwitchProjectPopup()` -- used in 8 specs
- `getCurrentSelectedFont()` -- used in 8 specs
- `getDateTimePicker()` -- used in 8 specs
- `getMissingFontTooltip()` -- used in 8 specs
- `getOptionItemsCount()` -- used in 8 specs
- `getReportFooter()` -- used in 8 specs
- `getSelectedChecklistElementInContextMenu()` -- used in 8 specs
- `getSelectedObjectListText()` -- used in 8 specs
- `getSelectedOperator()` -- used in 8 specs
- `inputListOfValue(text)` -- used in 8 specs
- `isFilterIconPresent()` -- used in 8 specs
- `isFontAlignButtonSelected(align)` -- used in 8 specs
- `mouseOverSubMenuItem(menuItem)` -- used in 8 specs
- `multipleSelectObjects(objectNames)` -- used in 8 specs
- `openBandingColorPicker(colorOrder)` -- used in 8 specs
- `resizeColumnByMovingBorder(colHeader, pixels, direction)` -- used in 8 specs
- `scrollGridHorizontally(visualization, pixels)` -- used in 8 specs
- `searchBasedOn(searchText)` -- used in 8 specs
- `selectAttributeFormOperator(option)` -- used in 8 specs
- `selectCellPadding()` -- used in 8 specs
- `selectOptionFromDropdown(option)` -- used in 8 specs
- `selectTargetObject(objectName)` -- used in 8 specs
- `switchToListView()` -- used in 8 specs
- `toggleElementListMode()` -- used in 8 specs
- `waitForCurtainDisappear()` -- used in 8 specs
- `waitForEditor()` -- used in 8 specs
- `waitForRepromptLoading()` -- used in 8 specs
- `waitLoadingDataPopUpIsNotDisplayed()` -- used in 8 specs
- `clickFilterHeader()` -- used in 7 specs
- `enableOutlineMode()` -- used in 7 specs
- `getDrillToItem()` -- used in 7 specs
- `getGroupActionLinkCount()` -- used in 7 specs
- `getObjectContextMenuItem()` -- used in 7 specs
- `isDefaultFormsCheckboxChecked()` -- used in 7 specs
- `openGroupOperator(index = 1)` -- used in 7 specs
- `removeItemInReportTab(objName)` -- used in 7 specs
- `removeObjectInDropzone(dropZone, objectType, objectName)` -- used in 7 specs
- `removePageBy(selectorName)` -- used in 7 specs
- `reprompt()` -- used in 7 specs
- `searchAttributeObjectInSearchbox(objectName, index = 1)` -- used in 7 specs
- `selectGroupOperator(text = 'AND')` -- used in 7 specs
- `viewLess()` -- used in 7 specs
- `cancel()` -- used in 6 specs
- `clearByKeyboard()` -- used in 6 specs
- `clickCheckboxByName()` -- used in 6 specs
- `clickOKInConfirmDialog()` -- used in 6 specs
- `clickOnPaddingArrowButton(paddingType, buttonType, repetitions)` -- used in 6 specs
- `clickOpenInNewWindowCheckbox()` -- used in 6 specs
- `clickSubtotalsSelector(metricName)` -- used in 6 specs
- `clickToCloseContextMenu()` -- used in 6 specs
- `closeEditor()` -- used in 6 specs
- `closeFilterSetPopopver()` -- used in 6 specs
- `closeSelector(selectorName)` -- used in 6 specs
- `customCredentials()` -- used in 6 specs
- `disableWrapText()` -- used in 6 specs
- `dndObjectFromObjectBrowserToMetrics(objectName)` -- used in 6 specs
- `doubleClickSelectedItem(index, sectionName, itemName)` -- used in 6 specs
- `enableStandardOutlineMode()` -- used in 6 specs
- `enableWrapText()` -- used in 6 specs
- `expandSubmenuForPercentToTotalForMetricInMetricsDropZone(objectName)` -- used in 6 specs
- `expandSubmenuForTransformationForMetricInMetricsDropZone(objectName)` -- used in 6 specs
- `getCoverImageUrlByName()` -- used in 6 specs
- `getCurrentAttributeDisplayFormModeText()` -- used in 6 specs
- `getDatasetSelectContainer()` -- used in 6 specs
- `getFilterSubpanel()` -- used in 6 specs
- `getFolderBrowserTreePopover()` -- used in 6 specs
- `getFontSelectorValue()` -- used in 6 specs
- `getFontTextSizeInputValue()` -- used in 6 specs
- `getGridCellImgSrcByPos(row, col)` -- used in 6 specs
- `getMissingFontPopup()` -- used in 6 specs
- `getNoResultWarning()` -- used in 6 specs
- `getOperatorText(index = 1)` -- used in 6 specs
- `getReportFilterSetValue()` -- used in 6 specs
- `getSetText()` -- used in 6 specs
- `getThreeDotsToOpenCubeMenu()` -- used in 6 specs
- `groupFilter(index = 1)` -- used in 6 specs
- `isContextMenuOptionPresent(optionText)` -- used in 6 specs
- `isDetailedPanelPresent()` -- used in 6 specs
- `isTextFormatButtonSelected(type)` -- used in 6 specs
- `objectHasJoinIcon(objectName, joinType)` -- used in 6 specs
- `openColumnSizeFitSelectionBox()` -- used in 6 specs
- `openContextualLinkFromCellByPos(row, col, option)` -- used in 6 specs
- `openDisplayAttributeFormsDialog(attributeName)` -- used in 6 specs
- `openNewReportFiltersPanel()` -- used in 6 specs
- `openRankSubMenuForMetricInMetricsDropZone(objectName)` -- used in 6 specs
- `openThresholdInDropZoneForMetric(objectName)` -- used in 6 specs
- `reExecute()` -- used in 6 specs
- `removeObject(objectName)` -- used in 6 specs
- `saveAndCloseSimThresholdEditor()` -- used in 6 specs
- `scrollAgGrid(visualization, pixels, direction)` -- used in 6 specs
- `searchInAuthoring(optionName, type = 'Attribute')` -- used in 6 specs
- `selectDateTime({ year, month, day, index = 0 })` -- used in 6 specs
- `selectDisplayAttributeFormMode(formMode, save = false)` -- used in 6 specs
- `selectFontAlign()` -- used in 6 specs
- `selectInView()` -- used in 6 specs
- `selectSubtotalsType(subtotalType, order)` -- used in 6 specs
- `selectTargetPrompt(targetPrompt)` -- used in 6 specs
- `selectTextFont()` -- used in 6 specs
- `setApplyColorEvery(applyColorEvery)` -- used in 6 specs
- `setOperator(name)` -- used in 6 specs
- `toBeFalsy()` -- used in 6 specs
- `clear()` -- used in 5 specs
- `clickContainerByScript()` -- used in 5 specs
- `clickSettingIcon()` -- used in 5 specs
- `dismissContextMenu()` -- used in 5 specs
- `dndAttributeFromRowsToPageBy(attributeName)` -- used in 5 specs
- `errorMsg()` -- used in 5 specs
- `getCustomContainer()` -- used in 5 specs
- `getSummarySection()` -- used in 5 specs
- `inlineEnterValue({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 }, value)` -- used in 5 specs
- `isAttributeFormPresent(form)` -- used in 5 specs
- `isExisting()` -- used in 5 specs
- `modifyPropertySettingsPicker(settingName, settingValue)` -- used in 5 specs
- `moveTotalToTop(objectName = 'Total')` -- used in 5 specs
- `NOTGroupFilter(index = 1)` -- used in 5 specs
- `openDossierNoWait()` -- used in 5 specs
- `rePrompt()` -- used in 5 specs
- `saveMetric()` -- used in 5 specs
- `selectSetting(text)` -- used in 5 specs
- `toBeGreaterThan()` -- used in 5 specs
- `addMultipleObjectsToPageBy(objectNames)` -- used in 4 specs
- `addObjectFromObjectBrowserToPageBy()` -- used in 4 specs
- `addObjectToreportPageBy()` -- used in 4 specs
- `applyColorByNumberOfColumns()` -- used in 4 specs
- `attributeSearch(searchText)` -- used in 4 specs
- `cancelEditor()` -- used in 4 specs
- `cancelInConfirmDialog()` -- used in 4 specs
- `changeFirstBandingColor(color)` -- used in 4 specs
- `changeNumberFormatForAttributeInRowsDropzone(objectName, format, subFormat)` -- used in 4 specs
- `changeNumberFormatForMetricInMetricsDropZone(objectName, format, subFormat)` -- used in 4 specs
- `checkEvaluationOrder(option, expectItem)` -- used in 4 specs
- `checkPropertyValuePulldownList(option, expectItem)` -- used in 4 specs
- `checkTemplateInfo()` -- used in 4 specs
- `chooseFolderByName()` -- used in 4 specs
- `clearSearchBox()` -- used in 4 specs
- `clearThresholdForMetricInMetricsDropZone(objectName)` -- used in 4 specs
- `clickAndNoWait()` -- used in 4 specs
- `clickBack()` -- used in 4 specs
- `clickDoneButtonInDynamicDatePicker()` -- used in 4 specs
- `clickEditButton()` -- used in 4 specs
- `clickFormatPreviewPanelOkButton()` -- used in 4 specs
- `clickObjectInReportObjectsPanel(objectName)` -- used in 4 specs
- `clickOnEnableAllowUsersCheckBox()` -- used in 4 specs
- `clickOnNewQualificationEditorOkButton()` -- used in 4 specs
- `clickWarningIcon()` -- used in 4 specs
- `confirmSwitchProject()` -- used in 4 specs
- `confirmToSaveAndSetTemplate()` -- used in 4 specs
- `createTotalForeEachForAttributeInMetrics(metricName, attributeName)` -- used in 4 specs
- `deleteMinimumColumnWidthOption(unit)` -- used in 4 specs
- `dismissTooltip()` -- used in 4 specs
- `dndByMultiSelectFromObjectBrowserToReportObjectsPanel(objectNames, options = {})` -- used in 4 specs
- `dndByMultiSelectToMoveBetweenDropzones({ objects, dropzone, type, destZone })` -- used in 4 specs
- `dndFromDropzoneToReportObjectsPanelToRemove({ objName, srcZone = 'Rows' })` -- used in 4 specs
- `dndMetricsFromColumnsToRows()` -- used in 4 specs
- `dragHeaderCellToRow(objectToDrag, position, targetHeader)` -- used in 4 specs
- `drillToItem(objectName, drillToObjects)` -- used in 4 specs
- `editThresholdInDropZoneForMetric(objectName)` -- used in 4 specs
- `enableBanding()` -- used in 4 specs
- `enterValueToDateTimePicker({ value, index = 0 })` -- used in 4 specs
- `esc()` -- used in 4 specs
- `fakeUpdateTimestamp()` -- used in 4 specs
- `getAttribute()` -- used in 4 specs
- `getBaseOnText()` -- used in 4 specs
- `getBorderColorDropDownSectionStyle(type)` -- used in 4 specs
- `getBorderStyleDropdownValue(type)` -- used in 4 specs
- `getCheckedCheckbox()` -- used in 4 specs
- `getConfirmButtonInAutoSaveDialog()` -- used in 4 specs
- `getConfirmMessage()` -- used in 4 specs
- `getConstValueInput()` -- used in 4 specs
- `getContextMenu()` -- used in 4 specs
- `getCreateNewDossierSelectTemplateInfoPanel()` -- used in 4 specs
- `getCubeFlatGrid()` -- used in 4 specs
- `getCurrentInputText()` -- used in 4 specs
- `getCurrentProject()` -- used in 4 specs
- `getCurrentSelection()` -- used in 4 specs
- `getDisabledContextMenuOption()` -- used in 4 specs
- `getEnabledButtonFromToolbar()` -- used in 4 specs
- `getErrorDialogMainContainer()` -- used in 4 specs
- `getGridCellDiv()` -- used in 4 specs
- `getGroupOperatorCount(text)` -- used in 4 specs
- `getObjectListFlatView()` -- used in 4 specs
- `getPromptSummaryContainer()` -- used in 4 specs
- `getRankSubMenu()` -- used in 4 specs
- `getReportPropertiesDialog()` -- used in 4 specs
- `getSaveAsEditor()` -- used in 4 specs
- `getSearchBox()` -- used in 4 specs
- `getSelectedForm()` -- used in 4 specs
- `getSelectedRelatedBy()` -- used in 4 specs
- `getSelectorNameByIdx(idx = 1)` -- used in 4 specs
- `getSetAsTemplateCheckboxOnSaveAsEditor()` -- used in 4 specs
- `getSetPopover()` -- used in 4 specs
- `getSortChecked()` -- used in 4 specs
- `getSummaryPanel()` -- used in 4 specs
- `getThemePanel()` -- used in 4 specs
- `getTooltipContent()` -- used in 4 specs
- `getTooltipText()` -- used in 4 specs
- `getValidationText()` -- used in 4 specs
- `getValueOfMinimumColumnWidthOption(unit)` -- used in 4 specs
- `getViewFilterEmptyPlaceholder()` -- used in 4 specs
- `hideAllThresholds(objectName)` -- used in 4 specs
- `hideTotals(objectName = 'Total')` -- used in 4 specs
- `hoverOnThemeInfoIcon()` -- used in 4 specs
- `inlineChangeOperator({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 }, option)` -- used in 4 specs
- `isCellPaddingButtonChecked(padding)` -- used in 4 specs
- `isCurrentThemeCertified()` -- used in 4 specs
- `isGridCellDisplayed(row, col)` -- used in 4 specs
- `isGroupLinkPresent(index = 1)` -- used in 4 specs
- `isMetricEditorDisplayed()` -- used in 4 specs
- `isMinimumColumnWidthInputDisplayed(unit)` -- used in 4 specs
- `isPanelDocked()` -- used in 4 specs
- `isReportErrorPopupPresent()` -- used in 4 specs
- `isReportPropertiesWindowPresent()` -- used in 4 specs
- `isSummaryBarPresent()` -- used in 4 specs
- `isUngroupLinkPresent(index = 1)` -- used in 4 specs
- `openApplyColorBySelectionBox()` -- used in 4 specs
- `openCustomAppById()` -- used in 4 specs
- `openDossierInfoWindow()` -- used in 4 specs
- `openDynamicDateTimePicker()` -- used in 4 specs
- `openFolderByPath()` -- used in 4 specs
- `openFormatPreviewPanelByOrderNumber()` -- used in 4 specs
- `openNewThresholdCondition()` -- used in 4 specs
- `openObjectContextMenuByIndex(dropZone, objectIndex)` -- used in 4 specs
- `openSimpleThresholdImageBandDropDownMenu()` -- used in 4 specs
- `openThresholdInDropZoneForAttribute(objectName)` -- used in 4 specs
- `removeAllFilter()` -- used in 4 specs
- `removeRow(idx)` -- used in 4 specs
- `scrollToBottom()` -- used in 4 specs
- `selectAttributeAcrossLevel(attribute)` -- used in 4 specs
- `selectElementfromSelector()` -- used in 4 specs
- `selectFontByName()` -- used in 4 specs
- `selectGridTemplateColor()` -- used in 4 specs
- `selectGridTemplateStyle()` -- used in 4 specs
- `selectObjectFromSearchedResult(objectType, objectName, index = 1)` -- used in 4 specs
- `selectOptions(selections)` -- used in 4 specs
- `selectOptionsInAuthoring(selections)` -- used in 4 specs
- `selectPromptAnswerType(answerPromptType)` -- used in 4 specs
- `selectSimpleThresholdBasedOnObject()` -- used in 4 specs
- `selectSimpleThresholdBasedOnOption()` -- used in 4 specs
- `selectSimpleThresholdImageBand()` -- used in 4 specs
- `setFillColor()` -- used in 4 specs
- `setMetricName(newName)` -- used in 4 specs
- `showTotalsForObject(objectName)` -- used in 4 specs
- `sortDataByHeaderName()` -- used in 4 specs
- `subCategoryOption(option)` -- used in 4 specs
- `switchAdvToSimThresholdWithClear()` -- used in 4 specs
- `switchMode(modeName)` -- used in 4 specs
- `switchSimpleThresholdsTypeI18N()` -- used in 4 specs
- `switchSimToAdvThresholdWithApply()` -- used in 4 specs
- `switchToPauseMode()` -- used in 4 specs
- `tab()` -- used in 4 specs
- `toBeTrue()` -- used in 4 specs
- `typeObjectInSearchbox(objectName)` -- used in 4 specs
- `ungroupFilter(index = 1)` -- used in 4 specs
- `updateShowAttributeFormName(objectName, option, save = true)` -- used in 4 specs
- `validate()` -- used in 4 specs
- `validateAndWait(isValid = true)` -- used in 4 specs
- `waitForAttributeListValueUpdate(text)` -- used in 4 specs
- `changeNumberFormat(objectName, format, subFormat)` -- used in 3 specs
- `chooseItemsInAvailableCart(index, sectionName, itemNames)` -- used in 3 specs
- `clearSortBySortIcon(objectName)` -- used in 3 specs
- `clickButton(label)` -- used in 3 specs
- `clickButtonInListCart(index, sectionName, itemName)` -- used in 3 specs
- `clickDrillToItem(elementName)` -- used in 3 specs
- `clickSortIcon(sortOrder)` -- used in 3 specs
- `dndFromObjectBrowserToReportFilter(objectName)` -- used in 3 specs
- `getDropdownMenu()` -- used in 3 specs
- `getFilterIcon()` -- used in 3 specs
- `getOpenedSelectionList()` -- used in 3 specs
- `getPanelWidth()` -- used in 3 specs
- `getRowCounts()` -- used in 3 specs
- `getSelectedBreakBy()` -- used in 3 specs
- `getSelectedCartItemCount()` -- used in 3 specs
- `getSelectedSetOf()` -- used in 3 specs
- `getSummaryBar()` -- used in 3 specs
- `isAdvancedOptionChecked()` -- used in 3 specs
- `isExpressionPresent({ expType = 'New Qualification', objectName = 'EMPTY', index = 1, value })` -- used in 3 specs
- `isFilterSummaryPanelPresent()` -- used in 3 specs
- `isMainPanelPresent()` -- used in 3 specs
- `logout(options = {})` -- used in 3 specs
- `openAdvancedSortEditorOnGridObject(objectName)` -- used in 3 specs
- `openGridCellContextMenu(elementName)` -- used in 3 specs
- `openMectricContextMenuInMetricsDropzone(objectName)` -- used in 3 specs
- `openSet({ objectName, text, index = 1 })` -- used in 3 specs
- `openUserAccountMenu()` -- used in 3 specs
- `pin()` -- used in 3 specs
- `saveAndCloseSortEditor()` -- used in 3 specs
- `scrollListToBottom()` -- used in 3 specs
- `selectAttributeElement(elemName)` -- used in 3 specs
- `selectCategoryFromNumberTextFormatting(categoryName)` -- used in 3 specs
- `selectNumberTextFormatFromDropdown(numberFormat)` -- used in 3 specs
- `setAppliedLevel(appliedLevel, subtotalName)` -- used in 3 specs
- `sortAscending(objectName)` -- used in 3 specs
- `switchRowColumnInSortEditor()` -- used in 3 specs
- `switchToFormulaMode()` -- used in 3 specs
- `unpin()` -- used in 3 specs
- `addAttributesBefore(srcObjectName, dstObjectNames)` -- used in 2 specs
- `addMutltipleObjectsToColumns()` -- used in 2 specs
- `addObjectToReport(objectName)` -- used in 2 specs
- `applyBookmark()` -- used in 2 specs
- `applyColorByNumberOfRows()` -- used in 2 specs
- `applyColorByRowHeader()` -- used in 2 specs
- `browseFolderInSaveAsDialog()` -- used in 2 specs
- `cancelAndCloseAttributeFormsDialog()` -- used in 2 specs
- `cancelRankSelections()` -- used in 2 specs
- `cancelSwitchProject()` -- used in 2 specs
- `changeBreakByDropDownInRankSubmenuAndSubmit(option)` -- used in 2 specs
- `changeRankDropdown(type, option)` -- used in 2 specs
- `changeSecondBandingColor(color)` -- used in 2 specs
- `changeSetAsTemplateCheckBoxInSaveAsDialog()` -- used in 2 specs
- `checkAttributeName()` -- used in 2 specs
- `checkPropertyValueDetails(option, expectItem)` -- used in 2 specs
- `clearSearchData()` -- used in 2 specs
- `clearThresholdsForAttributeInRowsDropzone(objectName)` -- used in 2 specs
- `clearThresholdsForMetricInMetricsDropZone(objectName)` -- used in 2 specs
- `clickAdvancedOptionButton()` -- used in 2 specs
- `clickBlankDossierBtn()` -- used in 2 specs
- `clickCancelQualificationEditor()` -- used in 2 specs
- `clickColumnSizeFitOption(fit)` -- used in 2 specs
- `clickDefaultEvaluationOrder()` -- used in 2 specs
- `clickDoNotSaveButtonInConfirmSaveDialog(option)` -- used in 2 specs
- `clickGridColumnHeader(columnHeader)` -- used in 2 specs
- `clickNthSelectedObj()` -- used in 2 specs
- `clickObjectContextSubmenuItem(itemName)` -- used in 2 specs
- `clickOnCheckMarkOnFormatPreviewPanel()` -- used in 2 specs
- `clickReportObjectsForms()` -- used in 2 specs
- `clickReset(prompt = false)` -- used in 2 specs
- `clickSaveButtonInSaveAsDialog()` -- used in 2 specs
- `clickSubtotalsPositionOption(position)` -- used in 2 specs
- `clickViewFilterArrow()` -- used in 2 specs
- `closeThresholdEditor()` -- used in 2 specs
- `commitTimeChange()` -- used in 2 specs
- `customSubtotalsClickButton(label)` -- used in 2 specs
- `dismissTooltipsByClickTitle()` -- used in 2 specs
- `dndByMultiSelectFromDropzoneToReportObjectsPanelToRemove({ objects, dropzone, type })` -- used in 2 specs
- `dndByMultiSelectFromReportObjectsToViewFilter({ objectNames, target })` -- used in 2 specs
- `dndByMultiSelectToReOrderWithinDropzone({ objects, dropzone, type, targetName })` -- used in 2 specs
- `dndFromObjectBrowserToDropzone(objName, desZone)` -- used in 2 specs
- `dndFromObjectBrowserToPageBy(objectName)` -- used in 2 specs
- `dndFromObjectListToRows(objName)` -- used in 2 specs
- `dndFromObjectPanelToGridHeader()` -- used in 2 specs
- `dndMetricFromRowsToColumns()` -- used in 2 specs
- `dndObjectFromObjectBrowserToColumns(objectName)` -- used in 2 specs
- `doElementSelectionForAttributeFilter()` -- used in 2 specs
- `doubleClickOnAgGrid()` -- used in 2 specs
- `doubleClickOnTreeView()` -- used in 2 specs
- `dragAndDropPrompt(index, y)` -- used in 2 specs
- `dragHeaderCellToCol(objectToDrag, position, targetHeader)` -- used in 2 specs
- `expandAcrossLevelSelector()` -- used in 2 specs
- `expandTreeView()` -- used in 2 specs
- `getActiveTab()` -- used in 2 specs
- `getAllElementsFromPopupList()` -- used in 2 specs
- `getAntDropdown()` -- used in 2 specs
- `getApplyBtn()` -- used in 2 specs
- `getApplyColorByNumberOfColumns()` -- used in 2 specs
- `getAttributeOptionCount()` -- used in 2 specs
- `getCertifiedIcon()` -- used in 2 specs
- `getClearSortIcon()` -- used in 2 specs
- `getContextMenuOptionCheckBox()` -- used in 2 specs
- `getContextMenuSubOption()` -- used in 2 specs
- `getContinueOnSaveDialog()` -- used in 2 specs
- `getCreateNewDossierAddDataBody()` -- used in 2 specs
- `getCSSProperty()` -- used in 2 specs
- `getCurrentSelectedFolder()` -- used in 2 specs
- `getCurrentThemeCardSize()` -- used in 2 specs
- `getCurrentThemeContainer()` -- used in 2 specs
- `getDateTimeInputValue(index = 0)` -- used in 2 specs
- `getDynamicDateTimePicker()` -- used in 2 specs
- `getEmptyFilter()` -- used in 2 specs
- `getFirstBandingColor()` -- used in 2 specs
- `getFolderBrowserDropdown()` -- used in 2 specs
- `getFolderBrowserPopover()` -- used in 2 specs
- `getFolderItemByName()` -- used in 2 specs
- `getGridViewSectionInPauseMode()` -- used in 2 specs
- `getGroupBySelector()` -- used in 2 specs
- `getInputSectionText()` -- used in 2 specs
- `getLayoutSelectionBoxValue()` -- used in 2 specs
- `getObjectDescText()` -- used in 2 specs
- `getObjectLocationText()` -- used in 2 specs
- `getOperatorDropdown()` -- used in 2 specs
- `getPromptContainer()` -- used in 2 specs
- `getPromptEditor()` -- used in 2 specs
- `getQualificationEditor()` -- used in 2 specs
- `getReExecuteButton()` -- used in 2 specs
- `getReportTitle()` -- used in 2 specs
- `getRowDataInAddDataTab()` -- used in 2 specs
- `getSearchbox()` -- used in 2 specs
- `getSelectedFunction()` -- used in 2 specs
- `getSetOfDropdown()` -- used in 2 specs
- `getSortByObjectText()` -- used in 2 specs
- `getSummaryText()` -- used in 2 specs
- `getTab()` -- used in 2 specs
- `getTextInInputSection()` -- used in 2 specs
- `getTimeValue(index = 1)` -- used in 2 specs
- `getTitleText()` -- used in 2 specs
- `getTotalObjectCount()` -- used in 2 specs
- `getUncheckedCheckbox()` -- used in 2 specs
- `getViewModeSelector()` -- used in 2 specs
- `getVIVizPanel()` -- used in 2 specs
- `hoverOnBasedObject(objName, selectorCls)` -- used in 2 specs
- `hoverOnCurrentFolderSelector()` -- used in 2 specs
- `importValuesFromFile({ fileName, isValid = true })` -- used in 2 specs
- `inlineDeleteElement({ expType = 'New Qualification', objectName = 'EMPTY', index = 1 }, deleteIndex = 1)` -- used in 2 specs
- `isAdjustmentAreaPresent()` -- used in 2 specs
- `isAdvancedChecked()` -- used in 2 specs
- `isAttributeListOperatorSelected(text)` -- used in 2 specs
- `isBandingByColumns()` -- used in 2 specs
- `isBandingEnabled()` -- used in 2 specs
- `isCheckBoxChecked()` -- used in 2 specs
- `isConfirmSwitchProjectPopupDisplayed()` -- used in 2 specs
- `isDatasetPanelExisting()` -- used in 2 specs
- `isEditContextMenuItemDisplayed()` -- used in 2 specs
- `isEditorPanelExisting()` -- used in 2 specs
- `isEnabled()` -- used in 2 specs
- `isFilterPanelExisting()` -- used in 2 specs
- `isFormatPanelExisting()` -- used in 2 specs
- `isLoginPageDisplayed()` -- used in 2 specs
- `isMinimumColumnWidthSectionDisplayed()` -- used in 2 specs
- `isNewEnabled()` -- used in 2 specs
- `isObjectInReportTabDisplayed(objectName)` -- used in 2 specs
- `isObjectPresentInFlatView()` -- used in 2 specs
- `isOutlineModeEnabled()` -- used in 2 specs
- `isRedoEnabled(authoring = false)` -- used in 2 specs
- `isTextDisplayed()` -- used in 2 specs
- `isTextDisplayedInInputSection(text)` -- used in 2 specs
- `isTextDisplayedInSection()` -- used in 2 specs
- `isViewFilterCollapsed()` -- used in 2 specs
- `isViewSelectedOn()` -- used in 2 specs
- `moveColumnHeaderToColumns(objectName)` -- used in 2 specs
- `multipleSelectObjectsInDropzone({ objects, dropzone, type })` -- used in 2 specs
- `openBandingHeaderSelectionBox()` -- used in 2 specs
- `openContextMenu()` -- used in 2 specs
- `openContextMenuOnObject()` -- used in 2 specs
- `openDatePicker(index = 1)` -- used in 2 specs
- `openDisplayAttributeFormsDialogOnObject(objectName)` -- used in 2 specs
- `openDropdownfromSelector()` -- used in 2 specs
- `openMenuOnVisualization()` -- used in 2 specs
- `openNewReportLimitsPanel()` -- used in 2 specs
- `openObjectSelector()` -- used in 2 specs
- `openPanel()` -- used in 2 specs
- `openReportByID()` -- used in 2 specs
- `openTimePicker(index = 1)` -- used in 2 specs
- `removeAll()` -- used in 2 specs
- `removeObjectFromReport()` -- used in 2 specs
- `removeSingle()` -- used in 2 specs
- `renameContextualLink(newName)` -- used in 2 specs
- `resetDossierNoWait()` -- used in 2 specs
- `resizeEditorPanel(numOfPixels)` -- used in 2 specs
- `saveMetricEditorOpenFromEdit()` -- used in 2 specs
- `scrollObjectBrowserPopoverToTop()` -- used in 2 specs
- `scrollToBottomInTreePopover()` -- used in 2 specs
- `searchElementfromSelector()` -- used in 2 specs
- `selectAnswerPromptType(answerType)` -- used in 2 specs
- `selectAttributeGroupByCheckbox(attribute)` -- used in 2 specs
- `selectBandingBy(axis)` -- used in 2 specs
- `selectBandingByColumns()` -- used in 2 specs
- `selectBandingByRows()` -- used in 2 specs
- `selectBandingHeader(header)` -- used in 2 specs
- `selectDefaultEvaluationOrder(option)` -- used in 2 specs
- `selectFunctionFromList(functionName)` -- used in 2 specs
- `selectFunctionsSelectionFromDMEditor()` -- used in 2 specs
- `selectObjectFromBasedOnDropdown()` -- used in 2 specs
- `selectOperator()` -- used in 2 specs
- `selectOptionAttributeFromDropdown()` -- used in 2 specs
- `selectOptionSample()` -- used in 2 specs
- `selectPropertyValuePulldownList(list, option)` -- used in 2 specs
- `selectReportGridContextMenuOption({ headerName, elementName, firstOption, secondOption, thirdOption }, prompted = false)` -- used in 2 specs
- `selectSecondaryOptionInMenuForThresholdConditions()` -- used in 2 specs
- `selectSubtotalsOption(subtotalOption, order)` -- used in 2 specs
- `setDynamicDate(option)` -- used in 2 specs
- `setOpacityPercentage()` -- used in 2 specs
- `showAllThresholds(objectName)` -- used in 2 specs
- `showMetricsLabel(objectName)` -- used in 2 specs
- `singleClickSelectedItem(index, sectionName, itemName)` -- used in 2 specs
- `sortDescendingBySortIcon(objectName)` -- used in 2 specs
- `sortDescendingPageByDropZoneForAttribute(objectName)` -- used in 2 specs
- `switchToTreeMode()` -- used in 2 specs
- `toBeChecked()` -- used in 2 specs
- `toggleCertifiedThemes()` -- used in 2 specs
- `toggleClearSettingsCheckbox()` -- used in 2 specs
- `toString()` -- used in 2 specs
- `triggerFilterSectionInfoIcon(section = 'Scope Filters')` -- used in 2 specs
- `updateAttributeFormsForAttributeInPageByDropZone(objectName, option)` -- used in 2 specs
- `updateSchemaOptionCheckbox(settingName, settingStatus)` -- used in 2 specs
- `url()` -- used in 2 specs
- `waitForSaving()` -- used in 2 specs
- `waitForTooltipVisible()` -- used in 2 specs
- `waitTemplateLoading()` -- used in 2 specs
- `clearAll()` -- used in 1 specs
- `clearAndInputLowserValue()` -- used in 1 specs
- `clearAttributeSearch()` -- used in 1 specs
- `clickAdjustmentBtn()` -- used in 1 specs
- `clickAdvancedCheckbox()` -- used in 1 specs
- `clickAdvancedOptionCheckbox()` -- used in 1 specs
- `clickByPositionOptions()` -- used in 1 specs
- `clickCheckListCheckBoxItem(index, sectionName, itemName)` -- used in 1 specs
- `clickContextMenuOptionCheckBox(option)` -- used in 1 specs
- `clickCustomSubtotalsButton()` -- used in 1 specs
- `clickEditorBtn(btnName)` -- used in 1 specs
- `clickErrorActionButton()` -- used in 1 specs
- `clickExcludeWeekendButton()` -- used in 1 specs
- `clickGroupByEditorButton(label)` -- used in 1 specs
- `clickLastMonth(times)` -- used in 1 specs
- `clickNewQuqalificationPlus()` -- used in 1 specs
- `clickNextYear(times)` -- used in 1 specs
- `clickPopupCellBtn(btnName)` -- used in 1 specs
- `clickQualificationEditorBtn(btnName)` -- used in 1 specs
- `clickValueLabel(index, sectionName, objectIndex, objectName)` -- used in 1 specs
- `commitDynamicDate()` -- used in 1 specs
- `confirmCloseWithoutSaving()` -- used in 1 specs
- `copyLink(copyLinkButton, linkCheckBoxName, objectCheckBoxName, copyButton)` -- used in 1 specs
- `copyPreviewSQLForPropertySetting(option)` -- used in 1 specs
- `createNewPrompt()` -- used in 1 specs
- `createReportFromLibrary()` -- used in 1 specs
- `dndAttributeWithinPageByDropzone(objName, relObjName)` -- used in 1 specs
- `dndFromGridToObjectsPanel(objectName)` -- used in 1 specs
- `dndFromObjectListToColumns(objName)` -- used in 1 specs
- `dndFromObjectListToMetrics(objName)` -- used in 1 specs
- `dndFromObjectListToReportFilter(objectName)` -- used in 1 specs
- `dndMetricsFromColumnsToRowsRelatesToAttribute(attributeName)` -- used in 1 specs
- `dndMetricsFromRowsToColumnsRelatesToAttribute(attributeName)` -- used in 1 specs
- `dndMultipleObjectsFromObjectBrowserToColumns(objectNames)` -- used in 1 specs
- `dndMultipleObjectsFromObjectBrowserToMetrics(objectNames)` -- used in 1 specs
- `dndMultipleObjectsFromObjectBrowserToPageBy(objectNames)` -- used in 1 specs
- `dndMultipleObjectsFromObjectListToColumns(objectNames)` -- used in 1 specs
- `dndMultipleObjectsFromObjectListToRows(objectNames)` -- used in 1 specs
- `dndObjectBetweenDropzones(objName, objType, srcZone, desZone, relObjName, relObjType)` -- used in 1 specs
- `dndObjectFromObjectBrowserToPageBy(objectName)` -- used in 1 specs
- `dragFilterWidth()` -- used in 1 specs
- `editButtonCustomSubtotals()` -- used in 1 specs
- `enterExprValue(value)` -- used in 1 specs
- `enterMetricValue(index, sectionName, value)` -- used in 1 specs
- `exportFile()` -- used in 1 specs
- `getAllElementsInReportPane()` -- used in 1 specs
- `getClipboardText()` -- used in 1 specs
- `getContextMenuItem()` -- used in 1 specs
- `getFilterMenu()` -- used in 1 specs
- `getGroupOperatorItemCount()` -- used in 1 specs
- `getMetricDefinition()` -- used in 1 specs
- `getNotCount()` -- used in 1 specs
- `getSubmenuItem()` -- used in 1 specs
- `getTargetPromptName()` -- used in 1 specs
- `getTargetReportName()` -- used in 1 specs
- `getZoneObjectsInOrder(dropZone, names, types)` -- used in 1 specs
- `goBackFromDossierLink()` -- used in 1 specs
- `hoverOverCustomSubtotalOptions()` -- used in 1 specs
- `inputDynamicHour(hour)` -- used in 1 specs
- `inputDynamicMinute(min)` -- used in 1 specs
- `isDynamicDatePickerPresent()` -- used in 1 specs
- `isRowsSelected()` -- used in 1 specs
- `modifyPropertySettingsInput(settingName, settingValue)` -- used in 1 specs
- `moveGridCellToPageBy(objectName)` -- used in 1 specs
- `multiSelectObjects(objectName1, objectName2)` -- used in 1 specs
- `openAttributeContextMenuInRowsDropzone(objectName)` -- used in 1 specs
- `openDropDownList()` -- used in 1 specs
- `openMQConditionList()` -- used in 1 specs
- `reload()` -- used in 1 specs
- `renameCustomSubtotalsName(newName)` -- used in 1 specs
- `resetOrders()` -- used in 1 specs
- `resetSelectionToObjectInReportTab(objectName)` -- used in 1 specs
- `saveAndCloseSubtotalsByPositionEditor()` -- used in 1 specs
- `searchFromPromptObject(objectName)` -- used in 1 specs
- `searchLoadingText()` -- used in 1 specs
- `searchText()` -- used in 1 specs
- `selectAttributeListOperator(text)` -- used in 1 specs
- `selectDay(day)` -- used in 1 specs
- `selectDropDownItem()` -- used in 1 specs
- `selectedItemCount()` -- used in 1 specs
- `selectHour(hour)` -- used in 1 specs
- `selectMinute(min)` -- used in 1 specs
- `selectMQCondition()` -- used in 1 specs
- `selectPromptType(promptType)` -- used in 1 specs
- `selectSecond(sec)` -- used in 1 specs
- `setAppliedLevelValueSelector(subtotalName)` -- used in 1 specs
- `sortAscendingPageByDropZoneForAttribute(objectName)` -- used in 1 specs
- `switchEvaluationTable(option, ExpectedStatus)` -- used in 1 specs
- `switchToDynamicDate()` -- used in 1 specs
- `switchToStaticDate()` -- used in 1 specs
- `toBeLessThan()` -- used in 1 specs
- `toggleViewSummaryBtn()` -- used in 1 specs
- `viewSelectedButtnEnabled()` -- used in 1 specs
- `waitForDrillNotificationBox()` -- used in 1 specs
- `actionOnToolbarLoop(actionName, count)` -- used in 0 specs
- `actionOnToolbarWithoutLoading(actionName)` -- used in 0 specs
- `addAttributes(position, srcObjectName, dstObjectNames)` -- used in 0 specs
- `addAttributes(position, targetObject, saveAndClose = false)` -- used in 0 specs
- `addAttributesAfter(srcObjectName, dstObjectNames)` -- used in 0 specs
- `addFilter()` -- used in 0 specs
- `addFunctionByDoubleClick(functionName)` -- used in 0 specs
- `addMetrics(position, srcObjectName, dstObjectNames)` -- used in 0 specs
- `addMetricsAfter(srcObjectName, dstObjectNames)` -- used in 0 specs
- `addMetricsBefore(srcObjectName, dstObjectNames)` -- used in 0 specs
- `addObject(objectName, option)` -- used in 0 specs
- `addObjectByDoubleClick(objectName)` -- used in 0 specs
- `advancedOptionsMessage()` -- used in 0 specs
- `advancedOptionText({ index = 0 })` -- used in 0 specs
- `applyColorByColumnHeader()` -- used in 0 specs
- `attributeElementChecked(elemName)` -- used in 0 specs
- `attributeElementPresent(elemName)` -- used in 0 specs
- `basedOnObjectShown(objName, selectorCls)` -- used in 0 specs
- `basedOnText()` -- used in 0 specs
- `cancelAFB()` -- used in 0 specs
- `changeBandingColor(colorOrder, color)` -- used in 0 specs
- `changePromptOrder(source, target)` -- used in 0 specs
- `changeSortDropDownInRankSubmenuAndSubmit(option)` -- used in 0 specs
- `changeSymbolPositionTo(position)` -- used in 0 specs
- `checkMultiplePropertyValue(option, expectItem)` -- used in 0 specs
- `checkPromptElement(Title, Order, Location, Required)` -- used in 0 specs
- `checkPropertyValue(item)` -- used in 0 specs
- `checkPropertyValueSQLPreview(option, expectItem)` -- used in 0 specs
- `checkTargetReportName(targetReportName)` -- used in 0 specs
- `checkUnsortablePromptElement(Title, Location, Required)` -- used in 0 specs
- `chooseAFB(afBehavior)` -- used in 0 specs
- `chooseSecondIteminPageByDropdown()` -- used in 0 specs
- `clearAllInputs()` -- used in 0 specs
- `clearCellSortBySortIcon(objectName)` -- used in 0 specs
- `clearFilter()` -- used in 0 specs
- `clearMetric()` -- used in 0 specs
- `clearThresholds(objectName, dropZone, type)` -- used in 0 specs
- `clearValue(index = 0)` -- used in 0 specs
- `clearValue(index = 1)` -- used in 0 specs
- `clickAccountOption(text)` -- used in 0 specs
- `clickAddNewPropertyButton()` -- used in 0 specs
- `clickAlertOKBtn()` -- used in 0 specs
- `clickBreakBySelector()` -- used in 0 specs
- `clickBtnInContextMenu(btnName)` -- used in 0 specs
- `clickButton(btnName)` -- used in 0 specs
- `clickButtoninDropzone(buttonName)` -- used in 0 specs
- `clickCancelButtonInReportPromptEditor()` -- used in 0 specs
- `clickCancelExecutionBtn()` -- used in 0 specs
- `clickCheckBoxItem(index, sectionName, itemName)` -- used in 0 specs
- `clickChooseAttributeBtn()` -- used in 0 specs
- `clickColumnSizeBtn()` -- used in 0 specs
- `clickContextMenuButton(buttonText)` -- used in 0 specs
- `clickContextMenuOptionBtn(option)` -- used in 0 specs
- `clickErrorDetailsBtn()` -- used in 0 specs
- `clickExprElementLabel(index, sectionName, objectIndex, objectName)` -- used in 0 specs
- `clickExpressionForm(index, sectionName, objectIndex, objectName)` -- used in 0 specs
- `clickExpressionFunc(index, sectionName, objectIndex, objectName)` -- used in 0 specs
- `clickExpressionType(index, sectionName, objectIndex, objectName)` -- used in 0 specs
- `clickFillColorBtn()` -- used in 0 specs
- `clickFilterSummary()` -- used in 0 specs
- `clickFilterTab(filterTab)` -- used in 0 specs
- `clickFirstPageByDropdown()` -- used in 0 specs
- `clickGroupBySelector()` -- used in 0 specs
- `clickHeaderIcon(el, times)` -- used in 0 specs
- `clickInSearchBox()` -- used in 0 specs
- `clickItemFromPullDown(index, sectionName, item)` -- used in 0 specs
- `clickLevelAttributeBtn(btnName)` -- used in 0 specs
- `clickLevelLabel(index, sectionName, objectIndex, objectName)` -- used in 0 specs
- `clickMatchTypeBtn(type)` -- used in 0 specs
- `clickNewQualificationPlus(index)` -- used in 0 specs
- `clickNewReportButton()` -- used in 0 specs
- `clickOkButtonInNumberTextFormatting()` -- used in 0 specs
- `clickOnDropdownOfValueList(label)` -- used in 0 specs
- `clickOnGridHeader(headerName)` -- used in 0 specs
- `clickPageByButton()` -- used in 0 specs
- `clickPanelTab(panelName)` -- used in 0 specs
- `clickPopupItem(itemName)` -- used in 0 specs
- `clickPullDownCell(index, sectionName)` -- used in 0 specs
- `clickSelectorByName(selectorName, open = true)` -- used in 0 specs
- `clickSelectorOnDetailsPanel(selectorName)` -- used in 0 specs
- `clickSetSelectorByName(selectorName, open = true)` -- used in 0 specs
- `clickShowAllObjectsButton()` -- used in 0 specs
- `clickSQLupdateBtn()` -- used in 0 specs
- `clickSubMenuItem(menuItem)` -- used in 0 specs
- `closePulldown()` -- used in 0 specs
- `closeReportAuthoring()` -- used in 0 specs
- `closeSet()` -- used in 0 specs
- `closeUserAccountMenu()` -- used in 0 specs
- `confirmDeleteProperty()` -- used in 0 specs
- `contextMenuContainsOption(option)` -- used in 0 specs
- `deleteExpression({ expType = 'New Qualification', objectName = 'EMPTY', index = 0 })` -- used in 0 specs
- `deleteProperty(propertyName)` -- used in 0 specs
- `dismissDropdown()` -- used in 0 specs
- `dndAttributeFromColumnsToPageBy(attributeName)` -- used in 0 specs
- `dndAttributeFromPageByToColumns(attributeName)` -- used in 0 specs
- `dndAttributeFromPageByToRows(attributeName)` -- used in 0 specs
- `dndFromObjectBrowserToGridCell(objectName, targetObj)` -- used in 0 specs
- `dndFromObjectBrowserToGridHeader(objectName, targetObj)` -- used in 0 specs
- `dndFromObjectListToDropzone(objName, desZone)` -- used in 0 specs
- `dndMultipleObjectsFromObjectBrowserToDropzone(objectNames, desZone)` -- used in 0 specs
- `dndMultipleObjectsFromObjectBrowserToRows(objectNames)` -- used in 0 specs
- `dndObjectWithinDropzone(objName, objType, zone, relObjName, relObjType)` -- used in 0 specs
- `doubleClickExprElement(elementName)` -- used in 0 specs
- `doubleClickLevelAttributeItem(itemName)` -- used in 0 specs
- `doubleClickPageBySelector(selectorName)` -- used in 0 specs
- `dragGroupHeaderCell(objectToDrag, position, gridAxis, targetHeader)` -- used in 0 specs
- `dragObjectToGrid(objectName)` -- used in 0 specs
- `editorLabelPresent(text)` -- used in 0 specs
- `editThresholdInDropZone(objectName, dropZone, type)` -- used in 0 specs
- `editThresholdInDropZoneForAttribute(objectName)` -- used in 0 specs
- `emptyFilterBodyCaption()` -- used in 0 specs
- `emptyFilterBodytext()` -- used in 0 specs
- `emptyFilterSummarySuggestionText()` -- used in 0 specs
- `enableDisplayAttributeForms(formNames, save = true)` -- used in 0 specs
- `enableReportObjectsForms(formNames, save = true)` -- used in 0 specs
- `enterSearchPattern(pattern)` -- used in 0 specs
- `enterValue({ value, index = 0 })` -- used in 0 specs
- `expandOrCollapsedPropertyTab(settingStatus, option)` -- used in 0 specs
- `expandOutlineFromCell(elementName)` -- used in 0 specs
- `expressionInProgress({ expType = 'New Qualification', objectName = 'EMPTY', index = 0 })` -- used in 0 specs
- `expressionInvalid({ expType = 'New Qualification', objectName = 'EMPTY', index = 0 })` -- used in 0 specs
- `expressionSelected({ expType = 'New Qualification', objectName = 'EMPTY', index = 0 })` -- used in 0 specs
- `expressionValid({ expType = 'New Qualification', objectName = 'EMPTY', index = 0 })` -- used in 0 specs
- `filterContainer()` -- used in 0 specs
- `filterSummaryContainer()` -- used in 0 specs
- `focusOnInputArea()` -- used in 0 specs
- `getAlertMessage()` -- used in 0 specs
- `getAlertMessage(message)` -- used in 0 specs
- `getAlertOKBtn()` -- used in 0 specs
- `getAllInsertRowsCount()` -- used in 0 specs
- `getBandingColor(colorOrder)` -- used in 0 specs
- `getEvaluationOrderList(option)` -- used in 0 specs
- `getGraphWarningMessage()` -- used in 0 specs
- `getGridCellChildSpanElement(row, col)` -- used in 0 specs
- `getGridCellChildSpanText(row, col)` -- used in 0 specs
- `getGridCellCollapseIconByPosDisplayed(row, col)` -- used in 0 specs
- `getGridCellContextMenuOptionByOption({ row, col, firstOption, secondOption, thirdOption }, prompted = false)` -- used in 0 specs
- `getGridCellContextMenuTitlesByLevel(row, col, level)` -- used in 0 specs
- `getGridCellExpandIconByPosDisplayed(row, col)` -- used in 0 specs
- `getGridCellIconByPos(row, col, iconName)` -- used in 0 specs
- `getGridCellStyle(row, col, style)` -- used in 0 specs
- `getGridCellTextByIndex(index)` -- used in 0 specs
- `getGridSegment1DropDownValue()` -- used in 0 specs
- `getGridSegment2DropDownValue()` -- used in 0 specs
- `getItemsInDataSetPanel()` -- used in 0 specs
- `getJoinMenuIcon(objectName, joinType)` -- used in 0 specs
- `getLeafRowValue(section, name, index = 1)` -- used in 0 specs
- `getMenuItemText(menuItem)` -- used in 0 specs
- `getMetricInReportTabByIcon(objectName, classname)` -- used in 0 specs
- `getMutiplePropertyValuePulldownList(option)` -- used in 0 specs
- `getNumberOfInputRows()` -- used in 0 specs
- `getObjectInObjectsPanel(objectName)` -- used in 0 specs
- `getOneRowData(row)` -- used in 0 specs
- `getPageByContextMenuOptionByOption({ label, firstOption, secondOption, thirdOption }, prompted = false)` -- used in 0 specs
- `getPromptElement(promptTitle, promptItem)` -- used in 0 specs
- `getPromptIconByTitle(promptTitle)` -- used in 0 specs
- `getPromptOrder(option)` -- used in 0 specs
- `getPropertySettingsValueRowByName(settingName)` -- used in 0 specs
- `getPropertyValueDetails(option)` -- used in 0 specs
- `getPropertyValueInputEdit(option)` -- used in 0 specs
- `getPropertyValuePulldownList(option)` -- used in 0 specs
- `getPropertyValueSQLPreview(option)` -- used in 0 specs
- `getPropertyValueSQLPreviewText(option, text)` -- used in 0 specs
- `getRankBreakByDropdownText()` -- used in 0 specs
- `getRankSortsDropdownText()` -- used in 0 specs
- `getRankSubMenuDropdownText(type)` -- used in 0 specs
- `getReportElementByName({ elementName })` -- used in 0 specs
- `getReportHeaderByName({ headerName })` -- used in 0 specs
- `getReportHeaderText()` -- used in 0 specs
- `getSearchBasedOnObjectCountValue()` -- used in 0 specs
- `getSecondBandingColor()` -- used in 0 specs
- `getSelectedSortTypeInContextMenu(columnHeader, sortType)` -- used in 0 specs
- `getSetRowValue(section, name, index = 1)` -- used in 0 specs
- `getSortingRowsCount()` -- used in 0 specs
- `getSqlViewContent()` -- used in 0 specs
- `getSubMenuItemText(menuItem, subMenuItem)` -- used in 0 specs
- `getValueInputCount()` -- used in 0 specs
- `groupedByAttributes()` -- used in 0 specs
- `hideMetricsLabel(objectName)` -- used in 0 specs
- `hideTotals(objectName)` -- used in 0 specs
- `hoverActionInReportTab(objectName)` -- used in 0 specs
- `hoverActionOnToolbar(actionName)` -- used in 0 specs
- `hoverObjectContextSubmenuItem(menuItems)` -- used in 0 specs
- `hoverOnObjectInDropzone(dropZone, objectType, objectName)` -- used in 0 specs
- `importFile()` -- used in 0 specs
- `increaseDecimalOption()` -- used in 0 specs
- `insertPropertyValue(option, inserValue)` -- used in 0 specs
- `isAccountIconPresent()` -- used in 0 specs
- `isAccountOptionPresent(text)` -- used in 0 specs
- `isBandingByRows()` -- used in 0 specs
- `isBreakBySubMenuDropdownDisplayed(option)` -- used in 0 specs
- `isCancelExecutionBtnPresent()` -- used in 0 specs
- `isCheckboxChecked(sectionName, option)` -- used in 0 specs
- `isCheckboxUnchecked(sectionName, option)` -- used in 0 specs
- `isContextMenuItemDisplayed(option)` -- used in 0 specs
- `isDateInputPresent()` -- used in 0 specs
- `isEditButtonDisplay()` -- used in 0 specs
- `isFirstCheckBoxChecked(sectionName)` -- used in 0 specs
- `isFirstCheckBoxUnchecked(sectionName)` -- used in 0 specs
- `isGridIconEnabled()` -- used in 0 specs
- `isHourOffsetPresent()` -- used in 0 specs
- `isLogoutPresent()` -- used in 0 specs
- `isMenuItemVisible(menuItem)` -- used in 0 specs
- `isMinuteOffsetPresent()` -- used in 0 specs
- `isMojoWaitingPresent()` -- used in 0 specs
- `isPanelEnabled()` -- used in 0 specs
- `isPauseIconEnabled()` -- used in 0 specs
- `isPromptEditorDisplayed()` -- used in 0 specs
- `isRankSubMenuDropdownItemDisplayed(type, option)` -- used in 0 specs
- `isSearchBasedOnCategoryShown(category)` -- used in 0 specs
- `isSetNodePresent({ objectName = 'EMPTY', index = 0 })` -- used in 0 specs
- `isSortsSubMenuDropdownDisplayed(option)` -- used in 0 specs
- `isSqlIconEnabled()` -- used in 0 specs
- `isSqlViewDisplayed()` -- used in 0 specs
- `isTimeInputPresent()` -- used in 0 specs
- `isTimePickerPresent()` -- used in 0 specs
- `isUseDefaultFormsChecked()` -- used in 0 specs
- `modifyPropertyValue(item)` -- used in 0 specs
- `mouseOverObjectContextMenuItem(menuItem)` -- used in 0 specs
- `moveColumnHeaderToLeft(objectName)` -- used in 0 specs
- `moveColumnHeaderToRight(objectName)` -- used in 0 specs
- `moveColumnHeaderToRows(objectName)` -- used in 0 specs
- `moveGridHeaderToPageBy(objectName)` -- used in 0 specs
- `moveSelectorToCol(objectToDrag, position, targetObject)` -- used in 0 specs
- `moveSelectorToRow(objectToDrag, position, targetObject)` -- used in 0 specs
- `moveToPageBy()` -- used in 0 specs
- `moveVerticalScrollBar(direction, pixels, vizName)` -- used in 0 specs
- `moveVerticalScrollBarToBottom(vizName, pos)` -- used in 0 specs
- `multipleSelectOnReportObjects(objectNames)` -- used in 0 specs
- `newQualLinkText()` -- used in 0 specs
- `objectListHeader()` -- used in 0 specs
- `openAFBPullDown()` -- used in 0 specs
- `openColumnSizeAttributeFormSelectionBox(currentSelection)` -- used in 0 specs
- `openContextualLinkFromCell(cellTextContent)` -- used in 0 specs
- `openDateTimePicker(index = 0)` -- used in 0 specs
- `openDisplayAttributeFormsDialog(objectName)` -- used in 0 specs
- `openGridCellContextMenu(row, col)` -- used in 0 specs
- `openGridCellInRowContextMenu(elementName, rowIdx)` -- used in 0 specs
- `openGridViewContextMenu()` -- used in 0 specs
- `openLayoutSelectionBox()` -- used in 0 specs
- `openMetricOptionsDialog()` -- used in 0 specs
- `openNewObjectDropdownByCurrentObjectName({ name, index = 0 })` -- used in 0 specs
- `openNewQualicationEditorAtAggregationLevel()` -- used in 0 specs
- `openObjectContextMenu(objectName)` -- used in 0 specs
- `openPageByContextMenu()` -- used in 0 specs
- `openPageByLabelContextMenu(label)` -- used in 0 specs
- `openPageBySelector(selectorName)` -- used in 0 specs
- `openPreferencePanel()` -- used in 0 specs
- `openQualifyOnDropdown()` -- used in 0 specs
- `openRowSizeFitSelectionBox()` -- used in 0 specs
- `openShortcutMetricSubMenuForMetricInMetricsDropZone(objectName)` -- used in 0 specs
- `openThresholdInDropZone(objectName, dropZone, type)` -- used in 0 specs
- `presentInMetricDefinition(newToken)` -- used in 0 specs
- `promptValueText()` -- used in 0 specs
- `qualHeaderText()` -- used in 0 specs
- `refreshNoWait()` -- used in 0 specs
- `relateByText({ objectName, index = 0 })` -- used in 0 specs
- `removeAllFilter(option = {})` -- used in 0 specs
- `removeAttributeInColumnsDropZone(attributeName)` -- used in 0 specs
- `removeButtonCustomSubtotals()` -- used in 0 specs
- `removeSelectorByDrag(objectToDrag)` -- used in 0 specs
- `renameObject(newName)` -- used in 0 specs
- `renameTextField(newName)` -- used in 0 specs
- `reorderSelectorByDrag(objectToDrag, position, targetObject)` -- used in 0 specs
- `reportAuthoringMode()` -- used in 0 specs
- `resizeColumnByMovingBorderMultiLayer(rowNum, colNum, pixels, direction)` -- used in 0 specs
- `resizeGridCellByDragColumnHeader(columnHeaderResizeFrom, columnHeaderResizeTo)` -- used in 0 specs
- `save()` -- used in 0 specs
- `saveAFB()` -- used in 0 specs
- `saveAndCloseContextMenu(subMenu = false)` -- used in 0 specs
- `saveAndCloseSubmenuOption()` -- used in 0 specs
- `saveEnabled()` -- used in 0 specs
- `saveFilter()` -- used in 0 specs
- `saveNewDossier(dossierFileName)` -- used in 0 specs
- `saveProperty()` -- used in 0 specs
- `saveQualification()` -- used in 0 specs
- `scrollGridToTop(visualization = 'Visualization 1')` -- used in 0 specs
- `searchElementFromSelector(selectorName, keyword)` -- used in 0 specs
- `searchFunction(fnString)` -- used in 0 specs
- `searchGroupBy(searchText)` -- used in 0 specs
- `searchObjectInReportObjectsPanel(objectName, option)` -- used in 0 specs
- `selectBasedOnFromDMEditor()` -- used in 0 specs
- `selectCategoryFromNumberTextFormattingInDropzone(categoryName)` -- used in 0 specs
- `selectDataTypeFromDMEditor()` -- used in 0 specs
- `selectFunctionsTypeFromDMEditor()` -- used in 0 specs
- `selectGroupByObject(objName)` -- used in 0 specs
- `selectInDropdownByName(option)` -- used in 0 specs
- `selectLevelSelectionFromDMEditor()` -- used in 0 specs
- `selectMonth(year, month)` -- used in 0 specs
- `selectObjectsSelectionFromDMEditor()` -- used in 0 specs
- `selectObjFromList(objName)` -- used in 0 specs
- `selectOptionFromDropzoneContextMenu(menuItem)` -- used in 0 specs
- `selectOptionFromToolbarPullDown(optionName)` -- used in 0 specs
- `selectOptionFromToolbarPullDownWithoutLoading(optionName)` -- used in 0 specs
- `selectSubtotals(subtotalOptions)` -- used in 0 specs
- `selectTab(tabName)` -- used in 0 specs
- `selectTypeAndObjectFromSearchedResult(objectType, objectName, index = 1)` -- used in 0 specs
- `selectValue()` -- used in 0 specs
- `selectValueList(list)` -- used in 0 specs
- `selectVizContextMenuOptionForDescendSort()` -- used in 0 specs
- `selectYear(year)` -- used in 0 specs
- `setByPositionValue(option, subtotalName)` -- used in 0 specs
- `setColumnSize(currentAttributeForm, inches)` -- used in 0 specs
- `setElementsSelectioninPopupList(elementsList)` -- used in 0 specs
- `setFormulaMetricName(newName)` -- used in 0 specs
- `setMetricDefinition(formula)` -- used in 0 specs
- `setMetricDesc(newDesc)` -- used in 0 specs
- `setMetricNameOpenFromEdit(newName)` -- used in 0 specs
- `setNegation({ index })` -- used in 0 specs
- `setPropertyName(propertyName)` -- used in 0 specs
- `setPropertyValue(propertyValue)` -- used in 0 specs
- `setRowHeight(inches)` -- used in 0 specs
- `showTotals(objectName)` -- used in 0 specs
- `sortAscendingColumnsDropZoneForAttribute(objectName)` -- used in 0 specs
- `sortAscendingMetricsDropZoneForMetric(objectName)` -- used in 0 specs
- `sortAscendingRowsDropZoneForAttribute(objectName)` -- used in 0 specs
- `sortCellAscendingBySortIcon(objectName)` -- used in 0 specs
- `sortCellDescendingBySortIcon(objectName)` -- used in 0 specs
- `sortDescending(objectName)` -- used in 0 specs
- `sortDescendingColumnsDropZoneForAttribute(objectName)` -- used in 0 specs
- `sortDescendingMetricsDropZoneForMetric(objectName)` -- used in 0 specs
- `sortDescendingRowsDropZoneForAttribute(objectName)` -- used in 0 specs
- `sortMetricWithinAttribute(objectName, attributeName)` -- used in 0 specs
- `sortOnDropZone(objectName, dropZone, type, sortOrder)` -- used in 0 specs
- `submitRankSelections()` -- used in 0 specs
- `subtotalsByPositionClickButton(label)` -- used in 0 specs
- `switchModeinSimpleMetricEditor(modeName)` -- used in 0 specs
- `switchToColumnsTab()` -- used in 0 specs
- `switchToPageByTab()` -- used in 0 specs
- `switchToReportFilterTab()` -- used in 0 specs
- `switchToRowsTab()` -- used in 0 specs
- `switchUser(credentials)` -- used in 0 specs
- `toggleButton(optionName)` -- used in 0 specs
- `typeInNaturalLanguageQueryBox(text)` -- used in 0 specs
- `typeInNaturalLanguageQueryBoxNoSubmit(text)` -- used in 0 specs
- `updateViewEditsToggleButton(settingStatus)` -- used in 0 specs
- `uploadFile({ fileName, fileUploader })` -- used in 0 specs
- `validateButtonEnabled()` -- used in 0 specs
- `validateMetric()` -- used in 0 specs
- `valueLoadedCount()` -- used in 0 specs
- `valueValidationText()` -- used in 0 specs
- `verifyNumberTextFormatOptionInCategoryDropDown(option)` -- used in 0 specs
- `verifyNumberTextFormatOptionInCategoryDropDownOnDropzone(option)` -- used in 0 specs
- `viewSelectedText()` -- used in 0 specs
- `waitForAgLoadingIconNotDisplayed()` -- used in 0 specs
- `waitForBlankReportLoading()` -- used in 0 specs
- `waitForDatasetEvaluationTableToBeInvisible()` -- used in 0 specs
- `waitForDropdownDisplayed()` -- used in 0 specs
- `waitForDropdownHidden()` -- used in 0 specs
- `waitForDropdownVisible(timeout = 5000)` -- used in 0 specs
- `waitForGridRendring()` -- used in 0 specs
- `waitForObjectDisappear(objectName, timeout = 2000)` -- used in 0 specs
- `waitForOptionClickable(optionElement, timeout = 5000)` -- used in 0 specs
- `waitForViewEvaluationTableToBeInvisible()` -- used in 0 specs
- `waitToBePresent(locator, timeout = 5000, msg = undefined)` -- used in 0 specs
- `waitUntilActionIsComplete(seconds)` -- used in 0 specs

## Source Coverage

- `pageObjects/report/**/*.js`
- `specs/regression/config/reportEditor/**/*.{ts,js}`
- `specs/regression/reportEditor/**/*.{ts,js}`
- `specs/regression/reportEditor/mdx/**/*.{ts,js}`
- `specs/regression/reportEditor/reportCancel/**/*.{ts,js}`
- `specs/regression/reportEditor/reportCreator/**/*.{ts,js}`
- `specs/regression/reportEditor/reportFolderBrowsing/**/*.{ts,js}`
- `specs/regression/reportEditor/reportFormatting/**/*.{ts,js}`
- `specs/regression/reportEditor/reportPageBy/**/*.{ts,js}`
- `specs/regression/reportEditor/reportPageBySorting/**/*.{ts,js}`
- `specs/regression/reportEditor/reportScopeFilter/**/*.{ts,js}`
- `specs/regression/reportEditor/reportShortcutMetrics/**/*.{ts,js}`
- `specs/regression/reportEditor/reportSqlView/**/*.{ts,js}`
- `specs/regression/reportEditor/reportSubset/**/*.{ts,js}`
- `specs/regression/reportEditor/reportTheme/**/*.{ts,js}`
- `specs/regression/reportEditor/reportThreshold/**/*.{ts,js}`
- `specs/regression/reportEditor/reportUICheck/**/*.{ts,js}`
- `specs/regression/reportEditor/reportUndoRedo/**/*.{ts,js}`
- `specs/regression/reportFilter/**/*.{ts,js}`
