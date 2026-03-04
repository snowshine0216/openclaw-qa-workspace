# Site Knowledge: authoring

> Components: 58

### AdvancedFilter
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `openAdvancedFilterEditor(VisualizationTitle)` |
| `openNewQualificationEditor()` |
| `openBasedOnDropDown()` |
| `closeAllDropDown()` |
| `selectObjectFromBasedOnDropdown(elementName)` |
| `selectParameterFromBasedOnDropdown(elementName)` |
| `openChooseElementsByDropDown()` |
| `openChooseElementsByDropDownI18N(optionName)` |
| `checkChooseElementsByDropdown()` |
| `doSelectionOnChooseElementsByDropdown(typeName)` |
| `checkNewQualificationTitle(titleName)` |
| `doElementSelectionForAttributeFilter(elementNames)` |
| `clickOnNewQualificationEditorOkButton()` |
| `clickOnNewQualificationEditorCancelButton()` |
| `applyAdvancedFilterItem()` |
| `checkAdvancedFilterByIndex(index)` |
| `checkAdvancedFilterByIndexNotExist(index)` |
| `selectInListOrNotInList(buttonName)` |
| `typeValueInput(text)` |
| `clearValueInput()` |
| `typeDateValueInput(date)` |
| `clearDateValueInput()` |
| `openAttributeDropdown()` |
| `doSelectionOnAttributeDropdown(attName)` |
| `typeAndInput(text)` |
| `openOutputLevelDropdown()` |
| `doSelectionOnOutputLevelDropDown(optionName)` |
| `openOperatorDropDown()` |
| `doSelectionOnOperatorDropdown(optionName)` |
| `openMetricDropdown()` |
| `doSelectionOnMetricDropdown(metricName)` |
| `typeOnSearchBox(text)` |
| `clearSearchBox()` |
| `checkAttributeElement(text)` |
| `toggleViewSelected()` |
| `clickClearAllButton()` |
| `checkDeselectedAttributeElement(elementName)` |
| `clickSaveOnAdvancedFilterEditor()` |
| `clickCancelOnAdvancedFilterEditor()` |
| `hoverAndClickFilterIcon()` |
| `clickAdvancedQualificationButton()` |
| `hoverOnFilterItemByIndex(index)` |
| `clickCreateASetButtonByIndex(index)` |
| `clickAttributeOnCreateASetAttributeList(attributeName)` |
| `createASet()` |
| `clickDeleteButtonByIndex(index)` |
| `dragFilterAndWait(movingElement, targetElement)` |
| `editAdvancedFilter(index)` |
| `openLogicalOperatorDialog(index, currOperator)` |
| `changeLogicalOperatorBetweenFilters(newOperator)` |
| `closeColumnSetAdvancedFilterEditor(columnSet)` |
| `checkPlusButtonAppear()` |
| `openColumnSetContextMenu()` |
| `doSelectionOnPlusButtonContextMenu(columnSet)` |
| `changeToAnotherColumnSetAdvancedFilterEditor(columnSet)` |
| `selectAttributeFilterOperator(operatorName)` |
| `selectMetricFilterOperatorByValue(operatorName)` |
| `selectMetricFilterOperatorByRank(operatorName)` |
| `clickButtonInErrorPopUp(buttonName)` |
| `clickParameterTextBox()` |
| `selectParameterObjectFromPullDown(parameterObject)` |
| `clickAdvancedFilterButton()` |
| `clickAdvancedFilterApplyButton()` |
| `clickAdvancedFilterCancelButton()` |
| `clickAdvancedFilterClearButton()` |
| `selectFilterOption(option)` |
| `selectFilterOperator(operator)` |

**Sub-components**
- baseContainer

---

### AuthoringFilterSummary
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `HeaderCloseBtn` | `.mstrmojo-FilterSummaryBodyContainer-titleBar .mstrmojo-FilterSummaryBodyContainer-closeBtn` | button |
| `FooterCloseBtn` | `.mstrmojo-FilterSummaryBodyContainer-footer .mstrmojo-FilterSummaryBodyContainer-closeButton` | button |

**Actions**
| Signature |
|-----------|
| `clickHeaderCloseBtn()` |
| `clickFooterCloseBtn()` |
| `clickAllFiltersBtn()` |
| `clickBackgroundFiltersBtn()` |
| `clickInGridFiltersBtn()` |
| `waitForFilterSummaryDialogToClose()` |
| `assertFilterSummaryDialogClosed()` |
| `clickViewMoreBtn()` |
| `clickViewMoreBtnByIndex(index = 0)` |
| `clickViewLessBtnByIndex(index = 0)` |
| `swipeUp()` |
| `swipeToTitle(title)` |
| `assertTitleExisted(element)` |
| `assertElementExisted(text)` |

**Sub-components**
- baseContainer

---

### BaseContainer
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickContainerByScript(containerName)` |
| `clickContainer(containerName)` |
| `hoverOnVisualizationContainer(visualizationName)` |
| `hoverOnContainerAndClick(containerName)` |
| `hoverOnContainerTitlebarAndClick(containerName)` |
| `clickOnContainerTitle(containerName)` |
| `openContextMenu(containerName)` |
| `openContextMenu2(containerName)` |
| `openContextMenu3(containerName)` |
| `selectContextMenuOption(option)` |
| `changeViz(newViz, containerName, preventPopup = true)` |
| `selectSecondaryContextMenuOption(subOption)` |
| `clickOnMaximizeRestoreButton(containerName)` |
| `clickMaximizeBtn()` |
| `hoverOnMaximizeBtn()` |
| `hoverOnRestoreBtn()` |
| `swapContainer(containerName)` |
| `openAdvancedFilterEditor(containerName)` |
| `selectTargetVisualizations(containerName)` |
| `editTargetVisualizations(containerName)` |
| `showFormatPanel()` |
| `editTextArea(containerName)` |
| `deleteContainer(container)` |
| `duplicateContainer(containerName)` |
| `copytoContainer(containerName, locationName)` |
| `movetoContainer(containerName, locationName)` |
| `copymoveContainer(containerName, actionName, locationName)` |
| `moveContainerToTargetPosition(containerName, direction, targetValue)` |
| `moveContainerByOffset(containerName, moveX, moveY)` |
| `moveContainerByPosition(sourceContainer, targetContainer, relativePosition)` |
| `dragAndDrop({ fromElem, fromOffset = { x: 0, y: 0 }, toElem, toOffset = { x: 0, y: 0 } })` |
| `containerRelativePosition(containerName1, containerName2, relativePosition)` |
| `containerAlignment(containerName1, containerName2, position)` |
| `calculateContainerRect(containerName)` |
| `resizeContainer(containerName, direction, percentChangeH, percentChangeW = percentChangeH)` |
| `resizeContainerAndHoldMouse(containerName, direction, percentChangeH, percentChangeW = percentChangeH)` |
| `verifyContainerSize(containerName, percent, direction)` |
| `verifyMaximizeBtnInHighContrast(visualizationName)` |
| `verifyRestoreBtnInHighContrast(visualizationName)` |
| `clickOnContainerTopBorder(containerName)` |
| `moveMouse(x, y)` |
| `rightClickWithJavaScript(element, offsetX = 0, offsetY = 0)` |
| `multiSelectElementsUsingCommandOrControl(elements, waitLoadingDialog = false)` |
| `safeCtrlClickElement(element)` |
| `verifyCheckedSecondaryContextMenu(secondaryOption)` |
| `clickContainerButton()` |
| `clickContainerOption(option)` |
| `clickContainerApplyButton()` |
| `clickContainerCancelButton()` |
| `selectContainerLayout(layout)` |
| `selectContainerAlignment(alignment)` |
| `retry(fn, retries = 3, delay = 100)` |

**Sub-components**
- newGalleryPanel
- getContainer
- hoverOnVisualizationContainer
- copymoveContainer
- calculateContainer
- resizeContainer

---

### BaseFormatPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `toggleFormatPanelFromToolbar()` |
| `switchToFormatPanelByClickingOnIcon()` |
| `selectTarget(menuOption)` |
| `renameByDoubleClickOnFormatPanel(newName)` |
| `renameByFormatPanelContextMenu(newName)` |
| `openHelpLink()` |
| `selectContainerFillColorButton()` |
| `selectContainerTitleBarFillColorButton()` |
| `ChangeContainerFillColorOpacity(opacity)` |
| `ChangeGridFillColorOpacity(opacity)` |
| `verifyGridCellOpacity(opacity)` |
| `selectTitleFillColorButton()` |
| `ChangeTitleBarFillColorOpacity(opacity)` |
| `selectTitleAlignment(alignment)` |
| `selectContainerBorderStyleButton()` |
| `selectContainerBorderStyle(style)` |
| `selectContainerBorderColorButton()` |
| `selectRowsAndColumnsFillColorButton()` |
| `changeRowsAndColumnsFillColorOpacity(opacity)` |
| `selectRowsOrColumns(menuOption)` |
| `selectAdvancedColorSwatchMenu()` |
| `selectAdvancedColorPaletteMenu()` |
| `selectAdvancedColorSwatchNoFill()` |
| `selectAdvancedColorBuiltInSwatch(color)` |
| `selectAdvancedColorBuiltInSwatchByPosition(idx)` |
| `selectAdvancedColorThemeSwatchByPosition(idx)` |
| `selectAdvancedColorPaletteColorFill()` |
| `setAdvancedColorPaletteHex(hex)` |
| `setAdvancedColorPaletteWheel(x, y)` |
| `selectAdvancedColorPaletteNoFill()` |
| `confirmAdvancedColorPalette()` |
| `cancelAdvancedColorPalette()` |
| `changeBackgroundColorInDossierFormat(color)` |
| `selectContainerTitleFillColorButton()` |
| `selectContainerBodyFillColorButton()` |
| `clearAndSetValue(el, value)` |
| `ChangeContainerTitleFillColorOpacity(opacity)` |
| `ChangeContainerBodyFillColorOpacity(opacity)` |
| `clickOnCheckBox(label)` |
| `changeDropdown(fromOption, toOption)` |
| `changeDropdownWithTitle(title, toOption)` |
| `openFontPickerForAllFonts()` |
| `openFontPickerForTitle()` |

**Sub-components**
- formatPanel
- getContainer

---

### BaseFormatPanelReact
> Extends: `BaseFormatPanel`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `switchSection(sec)` |
| `switchToGeneralSettingsTab()` |
| `changeDropdownReact(fromOption, toOption)` |
| `changePropDropdownReact(prop, toOption)` |
| `selectFromDropdownReact(option)` |
| `selectAdvancedColorBuiltInSwatchReact(color)` |
| `dismissColorPicker()` |
| `dismissButtonFormatPopup()` |
| `changeContainerFillColor({ color, dismissColorPicker = true })` |
| `focusELAndReplaceInputValue(el, value)` |
| `changeContainerFillColorOpacity(opacity)` |
| `changeContainerTitleFillColor({ color, dismissColorPicker = true })` |
| `changeContainerTitleFillColorOpacity(opacity)` |
| `changeContainerBorder(option)` |
| `changeContainerBorderColor(color)` |
| `changeSegmentControl(fromOption, toOption)` |
| `clickOnCheckboxReact(label)` |
| `changeNgmMatrixFillColor(color)` |
| `changeNgmMatrixFillColorOpacity(opacity)` |
| `clickTxnTypeOnFormatPanel(label)` |
| `hoverTxnTypeBtn(label)` |
| `clickTxnTypeLabelOnFormatPanel(label)` |
| `toggleTxnTypeOnFormatPanel(label, isPause)` |
| `function(status)` |
| `clickTxnTypeRightBtnOnFormatPanel(btn, label)` |
| `clickPythonTxnTypeDeleteBtn(btn, label)` |
| `clickTxnContextMenuIconOnFormatPanel()` |
| `selectTxnContextMenuOption(option)` |
| `clickTxnAfterSubmissionCheckbox(label)` |
| `changeAfterSubmissionDropdown(fromOption, toOption)` |
| `clickAfterSubmissionBtn(btnName)` |
| `setAfterSubmissionMessage(value)` |
| `switchToTextAndFormSection()` |
| `switchToTitleAndContainerSection()` |
| `switchToTransactionOptionsSection()` |

**Sub-components**
- formatPanel
- FormatPanel
- afterSubmissionContainer

---

### CalculationMetric
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `createCalculation(secondObject, calculationType)` |

**Sub-components**
_none_

---

### Common


**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `hasClass(element, cls)` |

**Sub-components**
_none_

---

### DashboardFormattingPanel
> Extends: `DossierAuthoringPage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FormatButton` | `.item.mb.style` | element |
| `DashboardFormattingButton` | `.item.dashboardStyles.mstrmojo-ui-Menu-item` | element |
| `DashboardFormatPanel` | `.mstrmojo-Editor.DashboardStyles` | element |
| `BackgroundSection` | `.mstrmojo-Box.bg.ctrl-group` | element |
| `DashboardFormattingPopUp` | `.mstrmojo-Editor.DashboardStyles.modal` | element |
| `LockPageSizeCheckBox` | `.mstrmojo-CheckBox.pageSize` | element |
| `LockPageSizeHelperIcon` | `.mstrmojo-Box.helpIcon` | element |
| `ScrollableArea` | `.mstrmojo-Box.mstrmojo-vi-EditorGroup.ctrl-group` | element |
| `LayoutStyleSection` | `.mstrmojo-ui-CheckList.layoutstyle.horizontal.radio` | element |
| `ShadowFillSection` | `.shadow-fill-setting` | element |
| `ShadowBlurSection` | `.shadow-size-setting` | element |
| `ShadowDistanceSection` | `.shadow-distance-setting` | element |
| `ShadowAngleSection` | `.shadow-angle-setting` | element |
| `PopupColorPicker` | `.mstrmojo-popup-widget-hosted.mstrmojo-ui-PreviewButton.mstrmojo-ColorPickerBtn` | button |
| `OkButton` | `.mstrmojo-Button-text=OK` | button |
| `PaddingSection` | `.radius-spacing-setting .mstrmojo-vi-TwoColumnProp` | element |
| `RootPanelBgColorPicker` | `.mstr-rc-3-color-picker.root-panel-bg-color-picker-rc3` | element |
| `SizeSelectDropdown` | `#mstr-rc-3-color-picker-image-mode__size-select__dropdown` | dropdown |

**Actions**
| Signature |
|-----------|
| `openFormatMenu()` |
| `openDashboardFormattingMenu()` |
| `open()` |
| `close()` |
| `clickOkButton()` |
| `clickCardOption()` |
| `clickFlatOption()` |
| `selectLayoutStyle(style)` |
| `getSelectedLayoutStyle()` |
| `isCardSelected()` |
| `isFlatSelected()` |
| `getPaddingValue()` |
| `setPaddingValue(value)` |
| `getBackgroundColor()` |
| `setBackgroundColor(colorName)` |
| `clickLockPageSizeCheckBox()` |
| `clickLockPageSizeHelperIcon()` |
| `scrollUpInLeftBox()` |
| `scrollToShadowAngleSetting()` |
| `scrollBackToTop()` |
| `scrollToShadowSection(sectionType = 'angle')` |
| `clearInputValue()` |
| `getRadiusValue()` |
| `setRadiusValue(value)` |
| `getRadiusSliderPosition()` |
| `slideRadiusSlider(xOffset = 10)` |
| `getShadowFillValue()` |
| `setShadowFillCapacityValue(value)` |
| `clickShadowColorPicker()` |
| `selectShadowColorByName(colorName)` |
| `isPopupColorPickerVisible()` |
| `closePopupColorPicker()` |
| `getShadowSelectedColor()` |
| `getShadowFillColor()` |
| `getShadowFillColorDetails()` |
| `getShadowBlurValue()` |
| `setShadowBlurValue(value)` |
| `getShadowBlurSliderPosition()` |
| `slideShadowBlurSlider(xOffset = 10)` |
| `getShadowDistanceValue()` |
| `setShadowDistanceValue(value)` |
| `getShadowDistanceSliderPosition()` |
| `slideShadowDistanceSlider(xOffset = 10)` |
| `getShadowAngleValue()` |
| `setShadowAngleValue(value)` |
| `getShadowAngleSliderPosition()` |
| `slideShadowAngleSlider(xOffset = 10)` |
| `getRootPanelBgColorValue()` |
| `getDashboardLevelImagePreviewUrl()` |
| `getImagePreviewUrl()` |
| `clickRootPanelBgColorPicker()` |
| `isRootPanelBgColorPickerExpanded()` |
| `clickSwatchesMode()` |
| `clickPaletteMode()` |
| `clickGradientMode()` |
| `clickImageMode()` |
| `selectColorByName(colorName)` |
| `selectColorByHex(hexValue)` |
| `selectColorByRGB(rgbValue)` |
| `isColorPickerPopoverVisible()` |
| `getCurrentSelectedColorMode()` |
| `closeColorPickerPopover()` |
| `setColorBySaturationClick(saturation = 50, brightness = 50)` |
| `clickColorSaturationArea(xPercent = 50, yPercent = 50)` |
| `clickHueSlider(huePercent = 50)` |
| `setHueByValue(hueValue)` |
| `getHexColorPicker()` |
| `setColorByHex(hexValue)` |
| `setColorByRGB(rgbValue)` |
| `clickAddToFavorite()` |
| `clickGradientStartButton()` |
| `clickGradientEndButton()` |
| `setGradientStartColor(color)` |
| `setGradientEndColor(color)` |
| `inverseGradient()` |
| `rotateGradient()` |
| `setImageUrl(imageUrl)` |
| `getImageUrl()` |
| `clickUploadButton()` |
| `clickImageOkButton()` |
| `isImageOkButtonEnabled()` |
| `uploadImageFile(filePath)` |
| `openSizeSelect()` |
| `getSizeSelectValue()` |
| `selectImageSize(sizeOption)` |
| `getAvailableImageSizes()` |
| `setImageBackground(imageUrl, size = '')` |
| `uploadImageBackground(filePath, size = 'Fill Canvas')` |
| `getLastVisibleInvalidUrlDialog()` |
| `isInvalidUrlDialogVisible()` |
| `closeInvalidUrlDialog()` |
| `waitForInvalidUrlDialog(timeout = 5000)` |
| `openOptimizedForDropDown()` |
| `openConsumptionViewDropDown()` |
| `selectOptimizedForOption(option)` |
| `selectConsumptionViewOption(option)` |
| `getPopupList()` |
| `getCustomDimensionInput(axis)` |
| `getCustomWidthInput()` |
| `getCustomHeightInput()` |
| `setCustomPageSize(width, height)` |

**Sub-components**
- getLockPage
- getRootPanel
- getDashboardFormatPanel
- getDashboardLevelRootPanel
- getGradientModeContainer
- getImageModeContainer

---

### DatasetPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SaveAsEditor` | `.mstrmojo-SaveAsEditor` | element |

**Actions**
| Signature |
|-----------|
| `switchDatasetsTab()` |
| `addDataFromDatasetsPanel(addDataOption)` |
| `addObjectToVizByDoubleClick(objectName, objectTypeName, datasetName)` |
| `addObjectFromDSFolderToVizByDoubleClick(objectName, objectTypeName, datasetName, folderName)` |
| `addObjectToFilter(objectName, objectTypeName, datasetName)` |
| `addObjectFromFolderToFilter(objectName, objectTypeName, datasetName, folderName)` |
| `addObjectFromSearchListToVizByDoubleClick(objectName, objectTypeName, datasetName)` |
| `actionOnObjectFromDataset(objectName, objectTypeName, datasetName, menuOption)` |
| `secondaryCMOnObjectFromDataset(objectName, objectTypeName, datasetName, firstMenu, secondaryMenu)` |
| `actionOnObjectFromCustomView(objectName, objectTypeName, datasetName, menuOption)` |
| `secondaryCMOnObjectFromCustomView(objectName, objectTypeName, datasetName, firstMenu, secondaryMenu)` |
| `actionOnGroupFromCustomView(groupName, menuOption)` |
| `renameGroupFromCustomView(newGroupName, groupName)` |
| `createCalculationFromDataset(objectName, objectTypeName, datasetName, calculationType, secondObject)` |
| `openEditObjectEditor(objectName, objectTypeName, datasetName)` |
| `selectFromDatasetsPanelContextMenu(menuItemName)` |
| `searchOnDatasetsPanel(keywords)` |
| `clearSearch()` |
| `selectFromSearchPulldown(item)` |
| `collapseDataset(datasetName)` |
| `expandDataset(datasetName)` |
| `collapseFolderUnderDataset(folderName, datasetName)` |
| `expandFolderUnderDataset(folderName, datasetName)` |
| `deleteDataset(datasetName)` |
| `renameObject(objectName, objectTypeName, datasetName, newObjectName)` |
| `editObject(objectName, objectTypeName, datasetName)` |
| `clearObjectAlias(objectName, objectTypeName, datasetName)` |
| `duplicateObjectAs(objectName, objectTypeName, datasetName, newObjectTypeName)` |
| `duplicateObjectInFolderAs(objectName, objectTypeName, folderName, datasetName, newObjectTypeName)` |
| `multiSelectObjectsAndTakeCMAction(objectList, datasetName, firstMenu)` |
| `multiSelectObjectsAndTakeSecondaryCM(objectList, datasetName, firstMenu, secondaryMenu)` |
| `renameDataset(datasetName, newDatasetName)` |
| `showHiddenObject(objectName, objectType)` |
| `showHiddenObjects(objectNameList)` |
| `chooseDatasetContextMenuOption(datasetName, option)` |
| `rightClickOnDataset(datasetName)` |
| `searchAndAddExistingDataset(datasetName)` |
| `showDataForSelectedDatasetAndObject(objectName, datasetName)` |
| `changePullDown(fromOption, toOption)` |
| `changePullDownwithTitle(pullDownTitle, fromOption, toOption)` |
| `hoverAttributeFormInDataTypeMenu(formName)` |
| `linkAttribute(tarAttribute)` |
| `linkAttributeForm(sourForm, tarAttr, tarAttrForm)` |
| `inputNameInatasetSaveAs(name)` |
| `changeNameInDatasetSaveAsDialog(name)` |
| `saveDataset()` |
| `saveAsDataset()` |
| `createTimeOrGeoAttribute(newType, objName, datasetName, contextOption)` |
| `editDatasetNotification(itemText)` |
| `changeNewObjectInReplaceObjectsEditor(oriObject, newObject)` |
| `searchAndSelectNewObjectInReplaceObjectsEditor(searchKey, oriObject, newObject)` |
| `getIndexForObjectinDS(datasetName, index, objectName)` |
| `switchToInReportTab()` |
| `switchToAllObjectsTab()` |
| `switchToSearchTab()` |
| `expandAttributeFolder()` |
| `expandMetricFolder()` |
| `expandCustomGroupFolder()` |
| `expandConsolidationFolder()` |
| `expandDimensionFolder()` |
| `expandHierarchyFolder()` |
| `expandTransformationFolder()` |
| `expandFilterFolder()` |
| `expandTemplateFolder()` |
| `createDMorDA(datasetName, option)` |
| `isDatasetDisplayed(dsName)` |
| `isObjectFromDSdisplayed(objectName, objectTypeName, datasetName)` |
| `isHighlightedObjectFromDSdisplayed(objectName, objectTypeName, datasetName, keyword)` |
| `currentCheckedItemFromCM()` |
| `renameTextField(newName)` |
| `isLinkedObjectDSdisplayed(objectName, datasetName)` |
| `isSelectExistingDatasetDialogDisplayed()` |
| `isAttributeLinked(objectName, datasetName)` |
| `unmapAttribute(objectName, objectTypeName, datasetName)` |
| `actionOnObjectFromPreview(obj, dataset, cmOption)` |
| `updateDatasetFromPreview()` |

**Sub-components**
- DIContainer
- datasetsPanel

---

### DerivedAttributeEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `setFunctionsSearchKey(fnString)` |
| `addFunctionByDoubleClick(functionName)` |
| `setObjectSearchKey(pattern)` |
| `addObjectByDoubleClick(objectName)` |
| `addSearchedObjectByDoubleClick(objectName)` |
| `getAttributeFormDefinition()` |
| `setAttributeName(newName)` |
| `setAttributeDesc(newDesc)` |
| `setAttributeFormDefinition(formula)` |
| `selectAttributeForm(formName)` |
| `selectFormFromDropdown(formName)` |
| `renameAttributeForm(formNewName)` |
| `addBlankAttrForm()` |
| `addAttrFormByName(formName)` |
| `clearAttrForm()` |
| `validateForm()` |
| `saveAttribute()` |
| `cancelAttribute()` |
| `switchFormulaEditor()` |
| `createDerivedAttribute({ objectNames, derivedAttributeName })` |

**Sub-components**
- functionsPanel
- objectsPanel
- attributePanel

---

### DerivedMetricEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `setFunctionsSearchKey(fnString)` |
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
| `setAttributeFormDefinition(formula)` |
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
| `switchModeInSimpleMetricEditor(modeName)` |
| `openMetricOptionsDialog()` |
| `openAFBPullDown()` |
| `chooseAFB(afBehavior)` |
| `saveAFB()` |
| `cancelAFB()` |
| `createDerivedMetricUsingFormula({ metricName, metricDefinition })` |
| `waitForLoadingFinish()` |

**Sub-components**
- functionsPanel
- simpleMetricPanel
- objectsPanel
- metricPanel
- displayedMetricPanel
- saveBtnfromSimpleMetricPanel
- switchBtninSimplifiedMetricPanel

---

### DossierMojoEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickBtnOnMojoEditor(btnTxt)` |
| `closeEditor()` |
| `clickShowDetails()` |
| `clickHtBtnOnAlert(btnTxt)` |
| `changeFolderPath(folderName)` |
| `searchObject(objectName)` |
| `searchAndSelect(objectName)` |
| `selectObject(ObjectName)` |
| `changeDropdown(title, newMode)` |
| `clickOnCheckboxWithTitle(title)` |
| `clickOnCheckboxWithLabel(label)` |
| `changeDropdownForExport(title, newMode)` |
| `clickOnCheckboxLabelForExport(label)` |
| `clickOnRadioButton(label)` |
| `clickOnPortraitBtn()` |
| `clickOnLandscapeBtn()` |
| `downloadPDF()` |
| `hasMojoEdtiorErrorText(txt)` |
| `setCustomInstructionsText(id, txt)` |
| `clickOnLeftTab(tabName)` |
| `addFileFromDisk(filename)` |
| `clickDeleteFileIcon()` |
| `clickYesOnDeleteConfirm()` |

**Sub-components**
- knowledgeAssetContainer

---

### DossierMojoEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickBtnOnMojoEditor(btnTxt)` |
| `closeEditor()` |
| `clickShowDetails()` |
| `clickHtBtnOnAlert(btnTxt)` |
| `changeFolderPath(folderName)` |
| `searchObject(objectName)` |
| `searchAndSelect(objectName)` |
| `selectObject(ObjectName)` |
| `changeDropdown(title, newMode)` |
| `clickOnCheckboxWithTitle(title)` |
| `clickOnCheckboxWithLabel(label)` |
| `changeDropdownForExport(title, newMode)` |
| `clickOnCheckboxLabelForExport(label)` |
| `clickOnRadioButton(label)` |
| `clickOnPortraitBtn()` |
| `clickOnLandscapeBtn()` |
| `downloadPDF()` |
| `hasMojoEdtiorErrorText(txt)` |
| `setCustomInstructionsText(id, txt)` |
| `clickOnLeftTab(tabName)` |
| `addFileFromDisk(filename)` |
| `clickDeleteFileIcon()` |
| `clickYesOnDeleteConfirm()` |
| `clickErrorButton(btnTxt)` |
| `isAlertMessageDisplayed(txt)` |
| `isMoJoEditorWithTitleDisplayed(title)` |

**Sub-components**
- knowledgeAssetContainer

---

### EditorPanelForGrid
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SimpleThresholdEditor` | `.mstrmojo-Editor.mstrmojo-SimpleThresholdEditor.modal` | element |

**Actions**
| Signature |
|-----------|
| `isDisplayFormAvailable(formName)` |
| `selectDisplayForms(formNames)` |
| `isDisplayFormSelected(formName)` |
| `getDisplayAttributeFormNamesPullDownMenu()` |
| `getPullDownFromMoreOption(title)` |
| `getDisplayAttributeFormNamesOption(option)` |
| `getDisplayFormItem(formName)` |
| `isObjectPresent(objectName, objectType)` |
| `renameObject(objectName, objectType, newObjectName)` |
| `renameObjectFromSection(objectName, sectionName, newObjectName)` |
| `clearObjectAlias(objectName, objectType)` |
| `removeFromDropZone(objectName, objectType)` |
| `removeObjectInColumnSet(objectName, columnSet)` |
| `removeAllObjects()` |
| `showTotal()` |
| `dragObjectFromDZtoDS(objectName, objectType, srcZone)` |
| `replaceObjectByName(objectName, objectType, objectNameToBeReplaced, objectTypeToBeReplaced)` |
| `replaceObjectByNameInColumnSet(objectName, columnSet, objectNameToBeReplaced)` |
| `dragObjectByNameInColumnSet(objectName, columnSet, objectNameToBeReplaced)` |
| `selectDropZonePanel(panelName)` |
| `isEditorPanelPresent()` |
| `isReplaceByOptionPresent(objectType, objectName, contextOption, newObjectName)` |
| `shortcutMetricOptionRankExists(objectName, rank)` |
| `shortcutMetricOptionCalculationExists(objectName, calculationMetric, index)` |
| `clearThreshold(objectName)` |
| `rightClickOnEditorPanel(objectName)` |
| `openThresholdsEditorWithoutWaiting(objectName)` |
| `openAttributeThresholdsEditor(objectName)` |
| `openMetricThresholdsEditor(objectName)` |
| `openThresholdsEditor(objectName)` |
| `openCalculationEditor(objectName, objectType)` |
| `createCalculationFromEditorPanel(objectName, calculationType, secondObject)` |
| `createSubtotalsFromEditorPanel(objectName, objectType, subtotalOptions)` |
| `secondaryMenuOnEditorObject(objectName, objectType, firstMenu, secondaryMenu)` |
| `ActionOnsecondaryMenuOnEditorObject(objectName, objectType, firstMenu, secondaryMenu)` |
| `openDerivedObjectEditor(objectName, objectType, actionType)` |
| `createGroup(objectName, objectType)` |
| `createAttribute(objectName)` |
| `createMetric(objectName)` |
| `createLink(objectName)` |
| `openAdvancedSortEditor(objectName)` |
| `simpleSort(objectName, sortOrder)` |
| `openGroupEditor(groupName, groupType)` |
| `editorPanelCalculationMultiSelect(elements, operation)` |
| `openDisplayAttributeFormsMenu(objectName, objectType)` |
| `setDisplayAttributeFormNames(option, submitAndClose)` |
| `multiSelectDisplayFormsFromEditorPanel(objectName, formNames)` |
| `multiSelectDisplayFormsFromDropZone(formNames, objectName, dropzone)` |
| `multiSelectDisplayForms(formNames, skipCloseForm)` |
| `closeFormPopup(buttonName)` |
| `rightClickOnElement(el)` |
| `getRowObjectTexts()` |
| `getColumnSetObjectTexts(columnSetName)` |
| `createThresholdForMetric({ objectName, createFunction })` |
| `openPanelContextMenu()` |
| `selectOptionFromContextMenu(menuOption)` |
| `changeTitle(newTitle)` |

**Sub-components**
- datasetsPanel
- filterPanel
- getDockPanel
- editorPanel
- getDropZonePanel

---

### ExistingObjectsDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getContexMenu(objName, menuItem)` |
| `deleteObjectFromDatasetContainer(object)` |
| `expandFolder(title)` |
| `doubleClickOnObject(objName)` |
| `selectMetricsFromDropdown()` |
| `selectAccessModeFromDropdown(buttonName)` |
| `clickOnBtn(btnText)` |
| `confirmYearInDropzone()` |
| `getAttributeFromFolder(objectName)` |
| `dragAttToDropzone(objectName)` |
| `confirmExistingObjDialog()` |
| `attributeTimeFolder()` |
| `getAttributeFolder(folderName)` |
| `getYearAttribute()` |
| `getAttribute(attributeName)` |
| `expandTimeFolder()` |
| `timeFolderElements()` |
| `addAttributeToDropzone(attrName)` |
| `addYearToDropzone()` |
| `dragAndDropObjectAndWait(movingElement, targetElement)` |
| `changeExistingObejctsDropdown(object, option)` |
| `searchForObjectOnExistingObjectsDialog(keywords)` |
| `moveExistingObjectsEditorScrollBar(direction, pixels)` |
| `openFilterEditor()` |
| `editFilterEditor()` |
| `browseMDObject(obj, folder)` |
| `clickCreateParameterBtn()` |
| `selectCreateParameterType(type)` |
| `clickClearAllBtn()` |
| `clickButtonInClearAllPopup(buttonName)` |
| `selectItemInParameterContextMenu(menuItem, parameterName)` |
| `isObjectDisplayedinDSContainer(objectName)` |

**Sub-components**
- getObjectFromDatasetContainer
- getObjectFromObjectBrowseContainer
- getObjectTextFromObjectBrowseContainer
- loadingTextFromObjectBrowserContainer

---

### FreeformPositionAndSize
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `ClickOnXPositionInput()` |
| `TypePositionInFormatPanel(number)` |
| `ClickOnYPositionInput()` |
| `ClickOnWidthInputBoxInFormatPanel()` |
| `ClickOnHeightInputBoxInFormatPanel()` |
| `ReplaceWidthInputBoxInReactPanel(Width)` |
| `ReplaceHeightInputBoxInReactPanel(height)` |
| `ReplaceXInputBoxInReactPanel(x)` |
| `ReplaceYInputBoxInReactPanel(y)` |
| `verifyHeightAndWidth()` |
| `verifyXAndY()` |

**Sub-components**
- baseFormatPanel
- bseFormatPanel

---

### GroupEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `GroupEditor` | `.mstrmojo-DerivedElementsEditor` | element |

**Actions**
| Signature |
|-----------|
| `multiSelectAndDnDtoSelectedArea(attributeName1, attributeName2)` |
| `moveGroupByPosition(sourceGroupName, targetGroupName, relativePosition)` |
| `calculateGroupRect(groupName)` |
| `groupRelativePosition(groupName1, groupName2, relativePosition)` |
| `openGroupEditor({ isFromGrid, isCreate, attributeName })` |
| `renameGroup(newName)` |
| `selectElement(reference)` |
| `selectElements(references)` |
| `deSelectElement(reference)` |
| `typeSearchKey(searchKey)` |
| `renameNDE(newName)` |
| `clickElementAndWait(element)` |
| `renameGroupFromEditor(oldName, newName)` |
| `deleteGroupFromEditor(name)` |
| `editGroupFromEditor(name)` |
| `displayAllOtherElementByItems()` |
| `displayAllOtherElementByGroup()` |
| `createGroups({ groupElements, groupNames })` |
| `createGroupsFromEditorPanel({ attributeName, groupElements, groupNames })` |

**Sub-components**
- getContainer
- getAttributeInEditorPanel

---

### HtmlContainer_Authoring
> Extends: `BaseContainer`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickHtmlContainerOkButton()` |
| `clickFormatPanelOkButton()` |
| `switchToIFrameByEdit(inputText)` |
| `switchToIFrameByFormatPanel(inputText)` |
| `switchToHtmlTextByEdit(inputText)` |
| `switchToHtmlTextAndInput(inputText)` |
| `switchToHtmlTextByFormatPanel(inputText)` |

**Sub-components**
- baseFormatPanel
- getContainer
- formatPanel
- clickHtmlContainer
- showFormatPanel
- clickFormatPanel

---

### ImageContainer_Authoring
> Extends: `BaseContainer`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `editURL(visualizationName, url)` |
| `editURLonFedRamp(visualizationName, url)` |
| `setXAndY(x, y)` |
| `restoreToOriginalSizeByFormatPanel()` |
| `singleClickOnImageContainer(waitType, visualizationName)` |
| `setImageContainersPicture(imageUrl, visualizationName)` |
| `addImageFromDisk(visualizationName, filename)` |
| `editURLFromFormat(url)` |
| `clickOnImageSrc(visualizationName)` |

**Sub-components**
- baseFormatPanel
- getContainer
- getImageContainer
- getFedRampImageContainer

---

### InCanvasSelector_Authoring
> Extends: `BaseContainer`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `resetContextMenu(selectorTitle)` |
| `createNewElementFilter()` |
| `createNewAttributeMetricFilter()` |
| `createNewPanelFilter()` |
| `dragDSObjectToSelector(objectType, objectName, datasetName, filterIdx = '', isScrollIntoView = true)` |
| `clickSelectTargetButton(selectorTitle)` |
| `clickApplyButtonFromFilterBoxDialog()` |
| `selectTargetFilterFromWithinSelector(trgtFilterNames, selectorTitle)` |
| `selectTargetVizFromWithinSelector(trgtVizNames, selectorTitle, replaceObjectName = null)` |
| `selectTargetsFromWithinSelector(trgtFilterNames, trgtVizNames, selectorTitle)` |
| `selectTargets(trgtFilterNames, trgtVizNames)` |
| `cancelSelectTargetForSelector()` |
| `selectTargetForSelectorContextMenu(selectorTitle, targets)` |
| `openSelectorTargetsMenu(selectorTitle)` |
| `openCurrentSelectorTargetsMenu()` |
| `changeDisplayStyle(selectorTitle, styleName)` |
| `changeDisplayStyleforSelectedSelector(styleName)` |
| `selectAttributeDisplayForms(selectorTitle, formNames)` |
| `openAttributeDisplayFormsMenu(selectorTitle)` |
| `changeSelectorMode(selectorTitle, modeName)` |
| `unsetSelectorFilter(selectorTitle)` |
| `unsetCurrentSelectorFilter()` |
| `toggleMultipleSelection(selectorTitle)` |
| `toggleMultipleSelectionforSelectedSelector()` |
| `metricSliderSelectorOnVal(selectorTitle, startValue, stopValue)` |
| `switchMetricSelectorType(selectorTitle, type)` |
| `metricSliderSelectorOnRank(selectorTitle, rankType, value)` |
| `metricQualificationSelectorOnValue(selectorTitle, operatorName, inputValue1, inputValue2)` |
| `metricQualificationSelectorOnRank(selectorTitle, rankType, value)` |
| `metricQualificationSelectorOnNullValue(selectorTitle, operatorType)` |
| `checkElementList(selectorTitle, elementNames)` |
| `checkElementListByIndex(index, elementNames, isSpaceNotReplaced = false)` |
| `searchBoxSelector(selectorTitle, searchPattern, elementName)` |
| `searchBoxSelectorWithoutSelecting(selectorTitle, searchPattern)` |
| `selectElementInSearchBox(elementName)` |
| `clearSearchBox(selectorTitle)` |
| `searchInDropdownSelector(selectorTitle, searchPattern)` |
| `selectElementsInDropdown(selectorTitle, elements, skipOpeningPopup)` |
| `linkOrButtonBarSelector(selectorTitle, elementNames)` |
| `linkOrButtonCurrentBarSelector(elementNames)` |
| `linkOrButtonBarSelectorInLibrary(selectorTitle, elementNames)` |
| `listBoxSelector(selectorTitle, elementNames)` |
| `openDropDownSelectorPullList(selectorTitle)` |
| `singleDropdownSelector(selectorTitle, elementName)` |
| `checkPresenceOfSelectTrgtBtn(selectorTitle)` |
| `checkNonPresenceOfDynamicSelIcon(selectorTitle)` |
| `checkPresenceOfDynamicSelIcon(selectorTitle)` |
| `checkPresenceOfSelector(selectorTitle, selectorType)` |
| `checkExcludeMode(selectorTitle, elementName, selectorType)` |
| `checkNotExcludeMode(selectorTitle, elementName, selectorType)` |
| `checkOrderOfElements(order, selectorTitle)` |
| `checkForEleOrValueFilterBox(id)` |
| `checkForNoEleOrValueFilterBox(id)` |
| `checkForAttrOrMetricsFilterBox(id)` |
| `selectSurveysAsTargets()` |
| `toggleDynamicSelectionIcon(selectorTitle)` |
| `verifyTooltipLocation(content, selectorName)` |
| `renameSelectorbyDoubleClick(selectorTitle, newName)` |
| `dragSelectorToCanvas(selectorTitle)` |
| `selectFromLinkBarAttributeMetricSelector(option)` |
| `hoverOnEmptyICSByIndex(index)` |
| `createNewParameterFilter()` |
| `dragDSObjectToParameterSelector(objectType, objectName, datasetName, filterIdx)` |
| `dragDSObjectAfterSearchToParameterSelector(objectType, objectName, datasetName, filterIdx)` |
| `setParameterSelectorInputValueByIndex(idx, value)` |
| `setParameterSelectorInputValueByName(name, value)` |
| `setParameterSliderSelectorValue(selectorTitle, value)` |
| `openParameterCalendar(selectorTitle)` |
| `resetToDefault(selectorTitle)` |
| `copyFormatting(selectorTitle)` |
| `pasteFormatting(selectorTitle)` |
| `getSelectedPanelText()` |

**Sub-components**
- datasetPanel
- filterPanel
- getContainer
- hoverOnContainer
- getAttrOrMetricSelectorContainer
- hoverOnVisualizationContainer
- getParameterSelectorContainer
- getSelectedPanel

---

### Keyboard


**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `pressArrowKeyForTimes(containerName, key, times)` |
| `pressShiftAndArrowKeyForTimes(containerName, key, times)` |
| `PressDeleteKeyForContainer(containerName)` |
| `pressSingleKeyAndHoldOn(keyName)` |
| `releaseSingleKey(keyName)` |
| `dragAndDropAndHoldOnMouse(element, xPixels = 0, yPixels = 0)` |
| `verifySnapGuide(lines, status)` |
| `moveContainerByOffsetAndHoldOnMouse(containerName, moveX, moveY)` |
| `moveSelectedGroupByOffsetAndHoldOn(containerName, moveX, moveY)` |
| `releaseMouse()` |
| `storeContainerRect(containerNames)` |
| `PressTabKeyForTimes(times)` |
| `PressEnterKeyForTimes(times)` |
| `PressUpArrowkeyForTimes(times)` |
| `PressDownArrowkeyForTimes(times)` |
| `PressRightArrowkeyForTimes(times)` |
| `PressLeftArrowkeyForTimes(times)` |
| `PressEscKey()` |
| `pressAltAndEnterKeyForTimes(times)` |

**Sub-components**
- baseContainer

---

### MoreOptionsDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `toggleOptionsForRowsHeader(Option)` |
| `toggleOptionsForColumnsHeader(Option)` |
| `saveAndCloseMoreOptionsDialog()` |
| `selectDisplayAttributeFormMode(formMode)` |
| `selectHideShowNullZerosOption(Option)` |
| `changeFilteringMode(filteringMode)` |
| `resetRowsPerPage(value)` |

**Sub-components**
_none_

---

### NewGalleryPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectViz(vizName)` |
| `hoverOnCategory(category)` |
| `clickOnViz(vizName)` |
| `closeChangeViz()` |

**Sub-components**
- NewGalleryPanel
- getCategoryPanel

---

### DatasetsPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `addDataFromDatasetsPanel(addDataOption)` |
| `addObjectToVizByDoubleClick(objectName, objectTypeName, datasetName)` |
| `addObjectFromDSFolderToVizByDoubleClick(objectName, objectTypeName, datasetName, folderName)` |
| `addObjectToFilter(objectName, objectTypeName, datasetName)` |
| `addObjectFromFolderToFilter(objectName, objectTypeName, datasetName, folderName)` |
| `addObjectFromSearchListToVizByDoubleClick(objectName, objectTypeName, datasetName)` |
| `actionOnObjectFromDataset(objectName, objectTypeName, datasetName, menuOption)` |
| `secondaryCMOnObjectFromDataset(objectName, objectTypeName, datasetName, firstMenu, secondaryMenu)` |
| `createCalculationFromDataset(objectName, objectTypeName, datasetName, calculationType, secondObject)` |
| `openEditObjectEditor(objectName, objectTypeName, datasetName)` |
| `selectFromDatasetsPanelContextMenu(menuItemName)` |
| `searchOnDatasetsPanel(keywords)` |
| `clearSearch()` |
| `selectFromSearchPulldown(item)` |
| `collapseDataset(datasetName)` |
| `expandDataset(datasetName)` |
| `collapseFolderUnderDataset(folderName, datasetName)` |
| `expandFolderUnderDataset(folderName, datasetName)` |
| `deleteDataset(datasetName)` |
| `renameObject(objectName, objectTypeName, datasetName, newObjectName)` |
| `editObject(objectName, objectTypeName, datasetName)` |
| `clearObjectAlias(objectName, objectTypeName, datasetName)` |
| `duplicateObjectAs(objectName, objectTypeName, datasetName, newObjectTypeName)` |
| `duplicateObjectInFolderAs(objectName, objectTypeName, folderName, datasetName, newObjectTypeName)` |
| `multiSelectObjectsAndTakeCMAction(objectList, datasetName, firstMenu)` |
| `multiSelectObjectsAndTakeSecondaryCM(objectList, datasetName, firstMenu, secondaryMenu)` |
| `renameDataset(datasetName, newDatasetName)` |
| `showHiddenObject(objectName, objectType)` |
| `showHiddenObjects(objectNameList)` |
| `chooseDatasetContextMenuOption(datasetName, option)` |
| `rightClickOnDataset(datasetName)` |
| `searchAndAddExistingDataset(datasetName)` |
| `showDataForSelectedDatasetAndObject(objectName, datasetName)` |
| `changePullDown(fromOption, toOption)` |
| `changePullDownwithTitle(pullDownTitle, fromOption, toOption)` |
| `hoverAttributeFormInDataTypeMenu(formName)` |
| `linkAttribute(tarAttribute)` |
| `linkAttributeForm(sourForm, tarAttr, tarAttrForm)` |
| `inputNameInatasetSaveAs(name)` |
| `saveDataset()` |
| `createTimeOrGeoAttribute(newType, objName, datasetName, contextOption)` |
| `editDatasetNotification(itemText)` |
| `changeNewObjectInReplaceObjectsEditor(oriObject, newObject)` |
| `searchAndSelectNewObjectInReplaceObjectsEditor(searchKey, oriObject, newObject)` |

**Sub-components**
- datasetsPanel

---

### Open_Canvas
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickOnOpenCanvasButton()` |
| `clickOnAutoCanvasButton()` |
| `clickOnCanvas()` |
| `multiSelectContainerAndTakeCMOption(containerNameList, cmOption)` |
| `openAndTakeContextMenuByRMC(containerName, cmOption)` |
| `openAndTakeContextMenuByRMCTitle(containerName, cmOption)` |
| `openContextMenuByRMC(containerName)` |
| `multiSelectContainersFromCanvas(containerList)` |
| `moveSelectedGroup(moveX, moveY)` |
| `selectedGroupContextMenuAction(cmOption)` |
| `GroupContextMenuAction(containerName, cmOption)` |
| `doubleClickContainer(containerName)` |
| `rightClickContainerAndDoCMAction(containerName, cmOption)` |
| `calculateContainerSizeAndLocation(containerName)` |
| `verifyAlignment(containerNameList, alignOption)` |
| `verifyDistribute(containerNameList, distributeOption)` |
| `verifyGroupPosition(position, containerName)` |
| `lassoSelect(fromCordinates, toCordinates)` |
| `resizeGroup(groupChildContainerName, direction, percentChangeH, percentChangeW = percentChangeH)` |
| `calculateGroupRect(groupContainerChildName)` |
| `resizeGroupAndHoldMouse(groupChildContainerName, direction, percentChangeH, percentChangeW = percentChangeH)` |

**Sub-components**
- baseContainer
- DocPanel

---

### PanelSelector
> Extends: `InCanvasSelector_Authoring`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectTargetPanelStackFromWithinSelector(panelStacks, selectorTitle)` |
| `selectTargetPanelStackFromLayersPanel(panelStacks, selectorTitle)` |
| `selectorCMAction(selector, cmOption)` |
| `linkBarPanelSelector(selectorTitle, elementName)` |
| `dropdownPanelSelector(selectorTitle, elementName)` |

**Sub-components**
- layersPanel
- getPanel
- getContainer
- getElementFromLinkBarPanel

---

### PanelStack
> Extends: `BaseContainer`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `openPanelStackCM(name)` |
| `panelStackCMAction(name, cmOption)` |
| `clearAllFilterOnPS(ps)` |
| `clearFilterOnPS(ps, condition)` |
| `addPanel(stack)` |
| `switchPanel(panel, stack)` |
| `switchPanelByArrow(arrow, stack)` |
| `doubleClickOnPanel(panel, stack)` |
| `panelCMAction(panel, stack, cmOption)` |
| `moveVerticalScrollbarInPanel(stack, moveY)` |
| `renamePanel(panel, stack, newPanel)` |
| `inputToRename(newName)` |
| `clickContainerInStack(viz, stack)` |
| `containerCMAction(viz, stack, cmOption)` |
| `clickButtonByName(id, name)` |
| `hoverOnButton(id, name)` |
| `buttonStyle(id, name, style)` |
| `isButtonDisabled(id, name)` |
| `getPanelPadding(id, style)` |

**Sub-components**
- getPanel
- getPanelInPanel
- getContainerInCurrentPanelOfPanel
- openPanel
- getAddPanel
- getPanelSwitchArrowInPanel
- getVerticalScrollBarInPanel
- getCurrentPanelCanvasInPanel
- getContainer

---

### ResponsiveGroupingEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `groupContainers(boxNames)` |
| `actionFromContainerMenu(containerName, cmOption)` |
| `actionFromContainerContextMenu(containerName, cmOption)` |
| `deleteGroupFromToolbar(groupName)` |
| `mergeGroups(srcGroupName, dstGroupName)` |
| `selectGroup(groupName)` |
| `clickSaveCancelBotton(buttonName)` |

**Sub-components**
- baseContainer
- baseContainergetContainer
- getContainer

---

### RichTextBox
> Extends: `BaseContainer`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `InputPlainText(inputText, RichTextbox)` |
| `DoubleClickRichTextbox(RichTextbox)` |
| `pressArrowKeyToMoveCursor(key, times)` |
| `pressShiftAndArrowKeyToHighlightText(key, times)` |
| `pressCtrlAndCtoCopyText()` |
| `pressCtrlAndVtoPasteText()` |
| `verifyVeriticalAlignment(expectedType)` |

**Sub-components**
- getContainer
- getRichTextContainer

---

### Shapes
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `changeShapeBorderStyle(style)` |
| `selectShapeBorderStyleFromDropdown(style)` |
| `selectShapeBorderColorButton()` |
| `selectShapeFillColorButton()` |
| `selectLineShapeColorButton()` |
| `verifyOuterBorderWidth(expectWidth)` |
| `selectLineStartArrow(arrowOption)` |
| `selectLineEndArrow(arrowOption)` |
| `verifyLineStartArrow(startArrow)` |
| `function(text)` |
| `verifyLineEndArrow(endArrow)` |
| `function(text)` |
| `verifyLineDirection(expectedDirection)` |
| `ChangeShapeOuterBorderWidth(Width)` |
| `ClickBorderWidthIncreaseBtnForTimes(times)` |
| `ClickBorderWidthDecreaseBtnForTimes(times)` |
| `ChangeShapeFillColorOpacity(opacity)` |
| `ClickOnRadioButton(option)` |
| `ClickOnLineDirectionButton(option)` |
| `verifyCircle()` |
| `verifyEllipse()` |
| `selectPolygonSlides(sides)` |
| `ClickPolygonSlidesIncreaseBtnForTimes(times)` |
| `ClickPolygonSlidesDecreaseBtnForTimes(times)` |
| `verifyPolygonSlides(slides)` |
| `function(text)` |
| `verifyTriangleDirection(direction)` |
| `verifyRightTriangleDirection(direction)` |

**Sub-components**
- baseContainer
- baseFormatPanel

---

### TOCcontentsPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `changePanelWidthByPixel(offsetX)` |
| `changeView(contentsPanelView)` |
| `toggleChapter(chapterTitle)` |
| `clickOnChapter(chapterTitle)` |
| `clickOnPage(chapterTitle, pageTitle)` |
| `actionOnPanel(option)` |
| `contextMenuOnChapter(chapterTitle, option)` |
| `renameChapterByDoubleClickFromChapterTitle(chapterTitle, newChapterTitle)` |
| `renameChapterFromChapterTitle(chapterTitle, newChapterTitle)` |
| `deleteChapterFromChapterTitle(chapterTitle)` |
| `MenuOnChapter(chapterTitle, option)` |
| `deleteChapterFromContextMenu(chapterTitle)` |
| `renameChapterFromContextMenu(chapterTitle, newChapterTitle)` |
| `contextMenuOnPage(pageTitle, chapterTitle, option)` |
| `deleteChapterFromPageTitle(pageTitle, chapterTitle)` |
| `renamePageFromPageTitle(pageTitle, chapterTitle, newPageTitle)` |
| `renamePageByDoubleClickFromPageTitle(pageTitle, newPageTitle, chapterTitle)` |
| `dragNdropChapter(chapterTitle, chapterIndex)` |
| `dragNdropToMovePage(srcPage, srcChapter, desPage, desChapter, relativePosition)` |
| `dragPageAndDropToCreateNewChapter(pageName, chapterName, chapterIndex)` |
| `moveVerticalScrollbar(moveY)` |
| `changeCoverImageBySample(sampleImageOrder)` |
| `changeCoverImageByUrl(imageUrl)` |
| `selectMultiplePagesUsingControlOrShiftToDoOperation(key, pageList, chapterTitle, contextMenuOption)` |
| `clickCoverImageCancelBtn()` |
| `isCurrentPageDisplayed(pageTitle, chapterTitle)` |

**Sub-components**
- contentsPanel
- getPage
- getCurrentPage

---

### Textfield
> Extends: `BaseContainer`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `InputSimpleText(text, textContainer)` |
| `insertTextField(buttonName)` |
| `addDatasetObjectByDragAndDrop(objectTypeName, objectName, datasetName, containerName)` |
| `replaceTextboxText(textboxText)` |
| `pasteTextboxText(containerTitle)` |
| `singleClickOnTextContainer(waitType)` |
| `singleClickOnTextContainer(waitType, containerName)` |
| `ClickOnFontStyleButtonInPanel(type)` |
| `ClickFontSizeIncreaseBtnForTimes(times)` |
| `ClickFontSizeDecreaseBtnForTimes(times)` |
| `replaceFontSizeText(fontSize)` |
| `ClickOnFontColorDropdown()` |
| `ClickOnAlignOrPaddingButton(option)` |
| `changeNumberFormat(type)` |
| `verifyTextBoxVeriticalAlignment(expectedType)` |

**Sub-components**
- datasetsPanel
- baseFormatPanel
- getContainer
- getTextContainer
- getFontStyleButtonFromFormatPanel

---

### ThresholdEditor
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `CloseBtn` | `.edt-title-btn.mstrmojo-Editor-close` | button |

**Actions**
| Signature |
|-----------|
| `deleteThresholdConditionByOrderNumber(orderNum)` |
| `openOuterBorderDropdownMenu()` |
| `openOuterBorderColorPickerDropdownMenu()` |
| `selectOuterBorderOptionByIndexNumber(indexNum)` |
| `selectOuterBorderColorByColorName(colorName)` |
| `openFontSizeDropdownMenu()` |
| `selectFontSizeBySizeNumber(sizeNum)` |
| `openFontColorDropdownMenu()` |
| `selectFontColorByColorName(colorName)` |
| `selectFontByFontName(fontName)` |
| `openFontFamilyDropdownMenu()` |
| `selectQuickSymbolByIndexNumber(index)` |
| `openQuickSymbolDropDownMenu()` |
| `inputInTextBox(message)` |
| `replaceInTextBox(message)` |
| `selectApplyToOptionFromThreeDotsMenu(optionName, orderNum)` |
| `selectSecondaryOptionInMenuForThresholdConditions(secondaryOp, orderNum)` |
| `clickOnOptionOnTheFontButtonBar(optionName)` |
| `selectOptionFromDataReplaceDropdownMenu(optionName)` |
| `clickOnEnableDataReplaceCheckBox()` |
| `addColorBandByRMCColorBand(indexNum)` |
| `getMarkerAndChangeValue(indexNum, value)` |
| `changeColorForColorBand(colorName, indexNum)` |
| `deletColorBandByIndexNumber(indexNum)` |
| `addHandlerInTheMiddleArea()` |
| `dragAndMoveMarker(indexNum)` |
| `openFormatPreviewPanelByOrderNumber(orderNum)` |
| `openThresholdConditionByOrderNumber(orderNum)` |
| `setFillColor(colorName)` |
| `setFillColorOpacity(opacity)` |
| `clickOnCheckMarkOnFormatPreviewPanel()` |
| `clickOnCancelMarkOnFormatPreviewPanel()` |
| `selectAttributeElementFromColumnContainer(elementName)` |
| `saveAndCloseAdvancedThresholdEditor()` |
| `saveAndCloseSimThresholdEditor()` |
| `openThresholdEditorFromViz(objectName, visualizationName)` |
| `clearThresholdFromViz(objectName, visualizationName)` |
| `openThresholdEditorFromCompoundGridDropzone(objectName, columnSet)` |
| `clearThresholds(headerName, visualizationName)` |
| `switchSimpleThresholdsType(thresholdsType)` |
| `switchSimpleThresholdsTypeI18N(thresholdsType)` |
| `revertThresholdColorBand()` |
| `openSimpleThresholdColorBandDropDownMenu()` |
| `selectSimpleThresholdColorBand(colorBandName)` |
| `openSimpleThresholdImageBandDropDownMenu()` |
| `openAndSelectSimpleThresholdColorBand(colorBandName)` |
| `selectSimpleThresholdImageBand(imageBandName)` |
| `selectSimpleThresholdBasedOnObject(objectName)` |
| `selectSimpleThresholdBasedOnOption(optionName)` |
| `selectSimpleThresholdBreakByObject(objectName)` |
| `switchSimToAdvThresholdWithApply()` |
| `switchSimToAdvThresholdWithClear()` |
| `switchAdvToSimThresholdWithApply()` |
| `switchAdvToSimThresholdWithClear()` |
| `openNewThresholdCondition()` |
| `openNewThresholdConditionI18N(name)` |
| `clickOnNewConditionEditorOkButton()` |
| `checkThresholdConditionByIndex(index)` |
| `clickThresholdConditionByIndex(index)` |
| `openColumnSetPullDown()` |
| `selectColumnSet(columnSet)` |
| `openThresholdEditorFromMicroChart(microchartName)` |
| `openMicrochartFillColor()` |
| `setMicrochartFillColor(colorName)` |
| `clickOnEnableAllowUsersCheckBox(item)` |
| `checkAttributeName(item)` |
| `selectOptionSample()` |
| `setOpacityPercentage(value)` |
| `selectOptionAttributeFromDropdown(elementName)` |
| `clickFormatPreviewPanelOkButton()` |
| `closeThresholdEditor()` |

**Sub-components**
- vizPanel
- getFormatPreviewPanel
- getFillColorPanel
- getAttributeElementFromColumnContainer
- microchartFillColorPanel
- formatPreviewPanel

---

### Utils


**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getRgbaColorCode(expectedColor)` |

**Sub-components**
_none_

---

### VizPanelForGrid
> Extends: `BaseContainer`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FilterSummaryPopupMenu` | `div.mstrmojo-ListBase.mstrmojo-ui-Menu.mstrmojo-viz-fe-menu.visible` | element |

**Actions**
| Signature |
|-----------|
| `getElementByPartialValueByViz(visualizationName, elementPartialValue)` |
| `getObjectHeader(objectName, visualizationName)` |
| `getGridCellStyleByPosition(row, col, visualizationName, style)` |
| `getGridCellTextByPosition(row, col, visualizationName)` |
| `resetContextMenuButton(visualizationName)` |
| `renameObject(objectName, visualizationName, newObjectName)` |
| `existObjectByName(objectName, visualizationName)` |
| `isContextMenuOptionPresentInHeaderCell(menuOption, cellText, visualizationName)` |
| `existReplaceByOption(objectName, visualizationName, targetObject)` |
| `replaceObjectWithinGrid(objectName, targetObject, visualizationName, waitForLoadingDialog = true)` |
| `existDrillOption(objectName, visualizationName, targetObject)` |
| `sortAscending(objectName, visualizationName)` |
| `metricSortFromViz(objectName, visualizationName, order)` |
| `clickMetricSortAscending(objType, objName)` |
| `clickMetricSortDescending(objType, objName)` |
| `clickMetricClearSort(objType, objName)` |
| `selectSortIconsFromElement(objectType, objectName, visualizationName)` |
| `selectSortWithinAttribute(objectType, objectName, sortType, sortAttr)` |
| `sortDescending(objectName, visualizationName, waitForLoadingDialog = true)` |
| `openAdvancedSortEditor(objectName, visualizationName)` |
| `openCustomSortEditor(objectName, visualizationName)` |
| `clickButtonInCustomSortEditor(buttonTxt)` |
| `addAdvancedSortParameter(columnOrder, objectName, sortOrder)` |
| `saveAndCloseSortEditor()` |
| `closeSortEditor()` |
| `switchRowColumnInSortEditor(buttonName)` |
| `clickSortDeleteRowButton(columnOrder)` |
| `moveToSpecificLocationAndWait(desPosition, srcElement, desElement, offsetX = 0, offsetY = 10)` |
| `dragSortRowwithPositionInAdvancedSortEditor(srcSortRow, desPosition, desSortRow)` |
| `moveAdvancedSortEditorScrollBar(direction, pixels)` |
| `hoverOverAdvancedSortRulesPanel()` |
| `clickOnGridElement(objectName, visualizationName)` |
| `clickOnGridElementWithoutLoading(objectName, visualizationName)` |
| `hoverOnGridElement(objectName, visualizationName)` |
| `keepOnly(objectName, visualizationName, waitForLoadingDialog = true)` |
| `excludeElement(objectName, visualizationName, waitForLoadingDialog = true)` |
| `mouseOverGridCellByPosition(row, col, visualization)` |
| `openContextMenuItemForGridCells(gridCellNames, menuItemName, visualizationName)` |
| `rightMouseClickOnElements(elements, waitForLoadingDialog)` |
| `openContextMenuItemForGridCell(gridCellName, menuItemName, visualizationName)` |
| `openContextMenuItemForGridCellByPosition(row, col, menuItemName, visualizationName)` |
| `openContextMenuItemForGridCellsByOffSet(gridCellNames, menuItemName, visualizationName, offsetX = 1, offsetY = 1)` |
| `rightMouseClickOnElementsbyOffSet(elements, offsetX, offsetY, waitForLoadingDialog)` |
| `rightClickOnHeader(objectName, visualizationName)` |
| `clickOnGridObjectHeader(objectName, visualizationName)` |
| `clickOnMultiGridCellByOffSet(objectNames, visualizationName)` |
| `openFormatToolBoxFromColumnHeader(objectName, visualizationName)` |
| `openFormatToolBoxFromVisualizationTitle(visualizationName)` |
| `expandOutlineFromColumnHeader(objectName, visualizationName)` |
| `collapseOutlineFromColumnHeader(objectName, visualizationName)` |
| `confirmOutlineGridCollapsed(objectName, visualizationName)` |
| `confirmOutlineGridExpanded(objectName, visualizationName)` |
| `openFormatToolBoxFromElement(objectName, visualizationName)` |
| `existContextMenuItemByName(option)` |
| `selectContextMenuOptionFromElement(objectName, option, visualizationName)` |
| `selectContextMenuOptionFromElementByIndex(rowIndex, colIndex, option, visualizationName)` |
| `selectContextMenuOptionFromElementWithHyperLink(objectName, option, visualizationName)` |
| `selectContextMenuOptionFromObjectinDZ(objectName, desZone, option)` |
| `clickContextMenuButton(button)` |
| `clickNfShortcutIcon(shortcut)` |
| `selectNumberFormatFromDropdown(numberFormat)` |
| `clickNumberFormatDropdownOption()` |
| `selectNfCurrencySymbolFromDropdown(symbol)` |
| `selectNfCurrencyPositionFromDropdown(position)` |
| `selectNfValueFormatFromDropdown(format)` |
| `clickNfCondense()` |
| `replaceText({ elem, text })` |
| `inputNfCustomTextBox(newFormat)` |
| `toggleNfThousandSeparator()` |
| `selectNfNegativeForm(form, inRed)` |
| `moveNfDecimalPlace(change, numOfPlaces)` |
| `openCalculationEditor(metricName, visualizationName)` |
| `openThresholdEditor(metricName, visualizationName)` |
| `openShowDataDiagFromViz(visualizationName)` |
| `openMoreOptionDiagFromViz(visualizationName)` |
| `deleteViz(visualizationName)` |
| `setDataSource(visualizationName, gridSourceName)` |
| `setDataSourceForCompoundOrAg(containerName, columnSet, dataSource)` |
| `getDataSourceOption(gridName, dataSource)` |
| `getDataSourceOptionForCompoundOrAg(containerName, columnSet, dataSource)` |
| `selectVizContainer(visualizationName)` |
| `expandOutlineFromElement(elementName, visualizationName)` |
| `collapseOutlineFromElement(elementName, visualizationName)` |
| `selectMultipleElements(elements, visualizationName)` |
| `selectMultipleGridCells(elements, visualizationName)` |
| `selectMultipleEncodedGridCells(elements, visualizationName)` |
| `selectMultipleElementsWithHyperLink(elements, objectName, visualizationName)` |
| `selectMultipleElementsByPartialValue(elementPartialValue, objectName, visualizationName)` |
| `clearMultipleElements(elements, objectName, visualizationName)` |
| `selectElementsUsingShift(elements_1, elements_2, visualizationName)` |
| `isElementPresent(element, objectName, visualizationName)` |
| `groupElements(elements, objectName, visualizationName, groupName)` |
| `groupElements2(elements, objectName, visualizationName, groupName)` |
| `inputFieldRenameHelper(newName)` |
| `groupElementsHelper(arrElements, groupName)` |
| `calculationElementsHelper(arrElements, calculation, calculationName)` |
| `groupElementsByPartialValue(elementPartialValue, objectName, visualizationName, groupName)` |
| `ungroupElements(objectName, visualizationName, groupName)` |
| `ungroupElements2(objectName, visualizationName, groupName)` |
| `groupElementsForCalculation(elements, objectName, visualizationName, groupName, calculationMenu)` |
| `addElementsToExistingGroup(elements, objectName, visualizationName, groupName)` |
| `groupElementsByPartialValueForCalculation(elementPartialValue, objectName, visualizationName, groupName)` |
| `keepOnlyVizFilter(elements, objectName, visualizationName)` |
| `rightClickOnHeader(objectName, visualizationName)` |
| `clearThresholds(headerName, visualizationName)` |
| `createNewGroup(attributeName, visualizationName)` |
| `drillFromHeader(headerName, drillToObject, visualizationName, waitForLoadingDialog = true)` |
| `drillFromElements(elements, drillToObject, visualizationName)` |
| `drillFromElement(element, drillToObject, visualizationName)` |
| `toggleShowTotalsFromAttribute(objectName, visualizationName, subtotalOptions, waitForLoadingDialog = true)` |
| `toggleShowTotalsFromMetric(objectName, visualizationName, waitForLoadingDialog = true)` |
| `renameVisualizationByContextMenu(visualizationName, newvisualizationName)` |
| `renameVisualizationByDoubleClick(visualizationName, newVisualizationName)` |
| `changeSubtotalPosition(cellToClick, newPosition, visualizationName)` |
| `editCalculationGroup(newCalculation, groupName, visualizationName)` |
| `deleteCalculationGroup(groupName, visualizationName)` |
| `editGroup(groupName, visualizationName)` |
| `editHeaderGroups(headerName, visualizationName)` |
| `renameGroup(groupName, visualizationName, newGroupName)` |
| `excludeElements(elements, visualizationName)` |
| `keepOnlyElements(elements, visualizationName)` |
| `clearDrillConditions(visualizationName)` |
| `isSaveDisabledForHeaderRename()` |
| `isGroupEditorOpen()` |
| `isGroupEditorOpenForSpecificGroup(groupName)` |
| `noThresholdsPresentOnObject(headerName, visualizationName)` |
| `addColumnSet()` |
| `dragDSObjectToGridContainer(objectName, objectTypeName, datasetName, vizName)` |
| `dragDSObjectToGridDZ(objectName, objectTypeName, datasetName, desZone)` |
| `dragDSObjectToGridColumnSetDZ(objectName, objectTypeName, datasetName, columnSetName)` |
| `dragDSObjectToColumnSetDZwithPosition(objectName, objectTypeName, datasetName, columnSet, desPosition, desObject)` |
| `dragDSObjectToGridMicrochartDZ(objectName, objectTypeName, datasetName, microchartName)` |
| `dragDSObjectToMicrochartDZwithPosition(objectName, objectTypeName, datasetName, microchartName, desPosition, desObject)` |
| `dragDSObjectToDZwithPosition(objectName, objectTypeName, datasetName, zone, desPosition, desObject, offsetX = 0, offsetY = 10)` |
| `dragDSObjectBetweenColumnSetwithPosition(objectName, objectTypeName, datasetName, columnSet, desPosition)` |
| `dragDSObjectBelowColumnsTitleBar(objectName, objectTypeName, datasetName)` |
| `dragDSObjectToLastColumnSet(objectName, objectTypeName, datasetName)` |
| `reOrderObjectsInColumnSet(objectTypeName1, objectName1, columnSet1, objectTypeName2, objectName2, columnSet2, desPosition)` |
| `multiselectAndDragDSObjectsToDZ(datasetName, objOneType, objOneName, objTwoType, objTwoName, desZone)` |
| `multiselectAndDragDSObjectsToDZWithPosition(datasetName, objOneType, objOneName, objTwoType, objTwoName, desPosition, desObject, desZone)` |
| `baseDragFunction(movingElement, targetElement, xOffset = 0, yOffset = 0, doMouseUp, waitforLoadingDialog)` |
| `dragDSObjectToGridByColumnBorder(objectName, objectTypeName, datasetName, colNum, vizName)` |
| `moveObjectToGridByColumnBorder(objectName, srcViz, colNum, destViz)` |
| `dragDSObjectToGridWithPositionInRow(objectName, objectTypeName, datasetName, desPosition, elementInRow, vizName)` |
| `moveObjectToGridWithPositionInRow(objectName, srcViz, desPosition, elementInRow, destViz)` |
| `dragObjectToInvalidDZ(objectName, vizName)` |
| `removeObjectFromGrid(objectName, vizName)` |
| `dragObjectToOtherViz(objectName, srcViz, destViz)` |
| `deleteColumnSet(columnSetName)` |
| `reorderColumnSet(columnSetName, desPosition, relColumnSetName, offsetX = 0, offsetY = 10)` |
| `renameColumnSet(columnSetPosition, newColumnSetName)` |
| `expandCollapseColumnSet(columnSetName)` |
| `editMicrochart(setName, microchartName)` |
| `switchToEditorPanel()` |
| `clickOnViz(vizName)` |
| `createLocalContextualLink(srcVizName, tgtVizName)` |
| `selectElementOnViz(objectName, vizName)` |
| `moveScrollBar(direction, pixels, vizName)` |
| `scrollToGridCell(visualizationName, elementName)` |
| `resizeColumnByMovingBorder(colNum, pixels, direction, vizName)` |
| `dismissContextMenu()` |
| `clickOnContainerTitle(visualizationTitle)` |
| `clickOnColumnSet(columnSetName)` |
| `clickButtonInWarningDialog(buttonName)` |
| `scrollToElementInDatasetPanel(objectName, objectTypeName, datasetName)` |
| `clickContextMenuOption(option)` |
| `waitForInfoWindowSpinnerGone(timeout = 10000)` |
| `clickFilterSummaryIcon()` |
| `clickShowFilterSummaryMenuItem()` |
| `isFilterSummaryIconDisplayed()` |

**Sub-components**
- datasetPanel
- ngmEditorPanel
- docAuthBasePage
- getContainer
- getGridContainer
- getColumnSetInEditorPanel
- getAdvancedSortEditorRulesPanel
- getColumnSetEndInEditorPanel
- editorPanel

---

### FormatPanelForGridBase
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectTextFont(font)` |
| `selectTextFontBold()` |
| `selectTextFontItalic()` |
| `selectTextFontUnderline()` |
| `selectTextFontStrikethrough()` |
| `selectTextFontSizeStepUp()` |
| `selectTextFontSizeStepDown()` |
| `setTextFontSize(size)` |
| `selectTextFontSize(size)` |
| `selectTextFontColorButton()` |

**Sub-components**
_none_

---

### FormatPanelForGridGeneral
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickMoreOptionsButtonInFormatPanel()` |
| `checkBanding()` |
| `checkOutline()` |
| `selectGridTemplateColor(color)` |
| `selectGridStyle(style)` |
| `selectGridPadding(padding)` |
| `selectGridColumnsFit(fit)` |
| `selectGridRowsFit(fit)` |
| `selectGridColumnsFitTarget(target)` |
| `setGridColumnsFitFixedInches()` |
| `setGridRowsFitFixedInches()` |

**Sub-components**
_none_

---

### FormatPanelForGridTitleCRV
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectTextAlign(align)` |
| `selectCellAlign(align)` |
| `selectBackgroundFillColorButton()` |
| `selectHorizontalLinesStyleButton()` |
| `selectVerticalLinesStyleButton()` |
| `selectLineStyle(style)` |
| `selectHorizontalLinesColorButton()` |
| `selectVerticalLinesColorButton()` |
| `selectWrapTextCheckbox()` |
| `selectSubtotalSameAs()` |
| `selectSubtotalTextFont(font)` |
| `selectSubtotalTextFontBold()` |
| `selectSubtotalTextFontItalic()` |
| `selectSubtotalTextFontUnderline()` |
| `selectSubtotalTextFontStrikethrough()` |
| `setSubtotalTextFontSize()` |
| `selectSubtotalTextFontSize(size)` |
| `selectSubtotalTextFontColorButton()` |
| `selectSubtotalTextAlign(align)` |
| `selectSubtotalCellAlign(align)` |
| `selectSubtotalBackgroundFillColorButton()` |
| `selectSubtotalHorizontalLinesStyleButton()` |
| `selectSubtotalVerticalLinesStyleButton()` |
| `selectSubtotalHorizontalLinesColorButton()` |
| `selectSubtotalVerticalLinesColorButton()` |
| `selectSubtotalWrapTextCheckbox()` |
| `isSubtotalSameAsCheckboxChecked()` |

**Sub-components**
_none_

---

### FormatPanelForGridToolBox
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectTextAlign(align)` |

**Sub-components**
_none_

---

### NewFormatPanelForGrid
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `switchToTab(tabName, waitLoading = true)` |
| `clickSectionTitle(sectionName)` |
| `selectGridTemplateColor(color)` |
| `selectGridTemplateStyle(style)` |
| `clickCheckBox(checkBoxName)` |
| `selectCellPadding(padding)` |
| `clickColumnSizeBtn(isAgGrid)` |
| `clickArrangementBtn()` |
| `clickColumnSizeFitOption(fit, isAgGrid = true)` |
| `clickColumnSizeTargetBtn()` |
| `clickColumnSizeTargetOption(target)` |
| `setFixedInches(inches, elInchesInput)` |
| `setColumnSizeFixedInches(inches)` |
| `setRowSizeFixedInches(inches)` |
| `clickRowSizeBtn(isAgGrid)` |
| `clickRowSizeFitOption(fit)` |
| `selectGridSegment(option)` |
| `selectGridColumns(columnSet)` |
| `changeGridElement(option)` |
| `changeColumnSet(option)` |
| `selectFromGridELDropdownReact(option)` |
| `selectTextFont(font)` |
| `selectFontStyle(style)` |
| `selectTitleOption(option)` |
| `setTextFontSize(size)` |
| `clickFontColorBtn()` |
| `clickColorPickerModeBtn(mode)` |
| `clickBuiltInColor(color)` |
| `setColorPaletteHex(hex)` |
| `setColorPaletteRGB(r, g, b, a = null)` |
| `setNoFillColor()` |
| `selectFontAlign(align)` |
| `clickCellFillColorBtn()` |
| `changeCellsFillColor(color)` |
| `changeCellFillColorOpacity(opacity)` |
| `getCellOpacityOnReactPanel()` |
| `selectVerticalAlign(align)` |
| `selectCellBorderOrientation(option)` |
| `openCellBorderStyleDropDown()` |
| `openCellBorderStyleDropDownByPos(pos)` |
| `selectCellBorderStyle(style)` |
| `clickCellBorderColorBtn()` |
| `clickCellBorderColorBtnByPos(pos)` |
| `setColorInSectionItem(sectionName, label, color)` |
| `setNumberInputInSectionItem(sectionName, label, value)` |
| `setSelectorOptionInSectionItem(sectionName, label, style)` |
| `setRadiusInSectionItem(sectionName, label, option)` |
| `setAlignmentInSectionItem(sectionName, label, option)` |
| `setArrangement(option)` |
| `toggleShowHeaders()` |
| `toggleTitleBar()` |
| `toggleTitles()` |
| `toggleTitleButtons()` |
| `clickTitleBackgroundColorBtn()` |
| `clickContainerFillColorBtn()` |
| `openContainerBorderPullDown()` |
| `selectBorderStyle(style)` |
| `clickContainerBorderColorBtn()` |
| `changeContainerFillColorOpacity(opacity)` |
| `enableBanding()` |
| `selectButtonRadius(option)` |
| `selectButtonSize(size)` |
| `clickButtonFormatIcon(buttonName)` |
| `clickButtonVisibleIcon(buttonName)` |
| `isButtonVisible(buttonName)` |
| `setButtonAlias(alias)` |
| `setButtonLabelOption(option)` |
| `setExportButtonOption(option)` |
| `selectButtonTextFont(font)` |
| `selectButtonTextFontStyle(style)` |
| `clickButtonTextFontColorBtn()` |
| `clickButtonIconColorBtn()` |
| `clickButtonBackgroundColorBtn()` |
| `openButtonBorderPullDown()` |
| `selectButtonBorderStyle(style)` |
| `clickButtonBorderColorBtn()` |
| `changeButtonFillColorOpacity(opacity)` |
| `changeMicroChartAlign(align)` |
| `toggleDPSpots()` |
| `changeDPSelection(selection)` |
| `selectKeyDPOption(option)` |
| `moveChartHeightSlider(direction, pixels)` |
| `expandLayoutSection(languageOption = Locales.English)` |
| `expandSpacingSection(languageOption = Locales.English)` |
| `expandTemplateSection(languageOption = Locales.English)` |
| `switchToGridTab()` |
| `switchToTextFormatTab()` |
| `switchToTitleContainerTab()` |
| `enableWrapText()` |
| `disableWrapText()` |
| `enableOutline()` |
| `textFontSizeInputValue()` |
| `isFontAlignButtonSelected(align)` |
| `isFontAlignButtonDisabled(align)` |
| `isCheckBoxChecked(checkBoxName)` |

**Sub-components**
- baseFormatPanel
- FormatPanel
- getContainer

---

### serves


**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickOnGridElement(objectName, visualizationName)` |
| `rightClickOnGridElement(objectName, visualizationName)` |
| `sortAscending(objectName, visualizationName)` |
| `sortDescending(objectName, visualizationName)` |
| `clearSorting(objectName, visualizationName)` |
| `sortWithinAttribute(objectName, visualizationName, sortAttribute)` |
| `existContextMenuItemByName(option)` |
| `selectContextMenuOptionByName(option)` |
| `rightClickOnHeader(objectName, visualizationName)` |
| `dragDSObjectToGridContainer(objectName, objectTypeName, datasetName, vizName)` |
| `dragDSObjectToGridDZ(objectName, objectTypeName, datasetName, desZone)` |
| `removeObjectFromGrid(objectName, vizName)` |
| `expandOutlineFromColumnHeader(objectName, visualizationName)` |
| `collapseOutlineFromColumnHeader(objectName, visualizationName)` |
| `groupElements(elements, objectName, visualizationName, groupName)` |
| `ungroupElements(objectName, visualizationName, groupName)` |
| `groupElementsForCalculation(elements, objectName, visualizationName, groupName, calculationMenu)` |
| `addColumnSet()` |
| `deleteColumnSet(columnSetName)` |
| `renameColumnSet(columnSetPosition, newColumnSetName)` |
| `clickNfShortcutIcon(shortcut)` |
| `existObjectByName(objectName, visualizationName)` |
| `isElementPresent(element, objectName, visualizationName)` |
| `getAllGridObjectCount(visualizationName)` |
| `changeVizToCompoundGrid(containerName)` |
| `switchToEditorPanel()` |

**Sub-components**
- datasetPanel

---

### ColumnSetOperations


**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `addColumnSet()` |
| `deleteColumnSet(columnSetName)` |
| `reorderColumnSet(columnSetName, desPosition, relColumnSetName, offsetX = 0, offsetY = 10)` |
| `renameColumnSet(columnSetPosition, newColumnSetName)` |
| `expandCollapseColumnSet(columnSetName)` |
| `editMicrochart(setName, microchartName)` |
| `clickOnColumnSet(columnSetName)` |
| `moveToSpecificLocationAndWait(desPosition, srcElement, desElement, offsetX = 0, offsetY = 10)` |
| `reOrderObjectsInColumnSet({ objectName1, columnSet1, objectName2, columnSet2, desPosition })` |

**Sub-components**
_none_

---

### ContextMenuOperations
> Extends: `BaseContainer`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `existContextMenuItemByName(option)` |
| `selectContextMenuOptionFromElement({ objectName, option, visualizationName })` |
| `selectContextMenuOptionFromHeader({ objectName, option, visualizationName })` |
| `isElementInHeaderRow(element, visualizationName)` |
| `selectContextMenuOptionFromElementByIndex(rowIndex, colIndex, option, visualizationName)` |
| `selectContextMenuOptionFromElementWithHyperLink(objectName, option, visualizationName)` |
| `selectContextMenuOptionFromObjectinDZ(objectName, desZone, option)` |
| `clickContextMenuButton(button)` |
| `openContextMenuItemForGridCells(gridCellNames, menuItemName, visualizationName)` |
| `openContextMenuItemForGridCellByPosition(row, col, menuItemName, visualizationName)` |
| `openContextMenuItemForGridCellsByOffSet(gridCellNames, menuItemName, visualizationName, offsetX = 1, offsetY = 1)` |
| `rightClickOnHeader(objectName, visualizationName, offsetX = 0, offsetY = 0)` |
| `isContextMenuOptionPresentInHeaderCell(menuOption, cellText, visualizationName)` |
| `dismissContextMenu()` |
| `openNumberFormatContextMenu(objectName, visualizationName)` |
| `saveContextMenuOption()` |
| `updateAndSaveNumberFormat(objectName, visualizationName, updateNumberFormatFunction, datasetName)` |
| `getCellType(objectName, visualizationName)` |
| `openFormatContextMenu(objectName, visualizationName)` |
| `openContextMenuOption(objectName, option, visualizationName)` |

**Sub-components**
- datasetPanel

---

### DragDropOperations


**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `dragDSObjectToGridContainer(objectName, objectTypeName, datasetName, vizName)` |
| `dragDSObjectToGridDZ(objectName, objectTypeName, datasetName, desZone)` |
| `dragDSObjectToGridColumnSetDZ(objectName, objectTypeName, datasetName, columnSetName)` |
| `dragDSGroupToGridDZ(groupName, desZone)` |
| `dragDSObjectToDZWithPosition(objectName, objectTypeName, datasetName, zone, desPosition, desObject, offsetX = 0, offsetY = 10)` |
| `multiselectAndDragDSObjectsToDZ(datasetName, objOneType, objOneName, objTwoType, objTwoName, desZone)` |
| `dragObjectToOtherViz(objectName, srcViz, destViz)` |
| `removeObjectFromGrid(objectName, vizName)` |
| `resizeColumnByMovingBorder(colNum, pixels, direction, vizName)` |
| `baseDragFunction(movingElement, targetElement, xOffset = 0, yOffset = 0, doMouseUp, waitforLoadingDialog)` |
| `moveToSpecificLocationAndWait(desPosition, srcElement, desElement, offsetX = 0, offsetY = 10)` |
| `dragAttributeToGridColumnSetDZ({ objectName, datasetName, columnSetName })` |
| `dragMetricToGridColumnSetDZ({ objectName, datasetName, columnSetName })` |
| `dragMetricToDropZoneBelowObject({ objectName, datasetName, dropZone, belowObject })` |
| `dragAttributeToRows({ objectName, datasetName })` |
| `dragMetricToRows({ objectName, datasetName })` |
| `dragAttributeToColumns({ objectName, datasetName })` |
| `dragMetricToColumns({ objectName, datasetName })` |
| `dragAttributeToRowsBelowObject({ objectName, datasetName, belowObject })` |
| `dragMetricToRowsBelowObject({ objectName, datasetName, belowObject })` |

**Sub-components**
- datasetPanel

---

### GridCellOperations
> Extends: `BaseContainer`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickOnGridElement(objectName, visualizationName)` |
| `clickOnGridElementWithoutLoading(objectName, visualizationName)` |
| `rightClickOnGridElement(objectName, visualizationName)` |
| `hoverOnGridElement(objectName, visualizationName)` |
| `mouseOverGridCellByPosition(row, col, visualization)` |
| `selectMultipleElements(elements, visualizationName)` |
| `selectMultipleGridCells(elements, visualizationName)` |
| `selectElementsUsingShift(elements_1, elements_2, visualizationName)` |
| `scrollToGridCell(visualizationName, elementName)` |
| `moveScrollBar(direction, pixels, vizName)` |
| `resizeColumnByMovingBorder(colNum, pixels, direction, vizName)` |
| `isElementPresent(element, objectName, visualizationName)` |

**Sub-components**
_none_

---

### GroupOperations
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `groupElements(elements, objectName, visualizationName, groupName)` |
| `groupElements2(elements, objectName, visualizationName, groupName)` |
| `groupElementsHelper(arrElements, groupName)` |
| `inputFieldRenameHelper(newName)` |
| `groupElementsByPartialValue(elementPartialValue, objectName, visualizationName, groupName)` |
| `ungroupElements(objectName, visualizationName, groupName)` |
| `ungroupElements2(objectName, visualizationName, groupName)` |
| `groupElementsForCalculation(elements, visualizationName, groupName, calculationMenu)` |
| `addElementsToExistingGroup(elements, visualizationName, groupName)` |
| `editCalculationGroup({ newCalculation, groupName, visualizationName })` |
| `deleteCalculationGroup(groupName, visualizationName)` |
| `editGroup(groupName, visualizationName)` |
| `renameGroup(groupName, visualizationName, newGroupName)` |
| `groupElementsToAverageCalculation({ elements, visualizationName, groupName })` |
| `groupElementsToSumCalculation(elements, visualizationName, groupName)` |

**Sub-components**
_none_

---

### NumberFormatOperations


**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickNfShortcutIcon(shortcut)` |
| `selectNumberFormatFromDropdown(numberFormat)` |
| `clickNumberFormatDropdownOption()` |
| `selectNfCurrencySymbolFromDropdown(symbol)` |
| `selectNfCurrencyPositionFromDropdown(position)` |
| `selectNfValueFormatFromDropdown(format)` |
| `clickNfCondense()` |
| `inputNfCustomTextBox(newFormat)` |
| `toggleNfThousandSeparator()` |
| `selectNfNegativeForm(form, inRed)` |
| `moveNfDecimalPlace(change, numOfPlaces)` |

**Sub-components**
_none_

---

### OutlineOperations


**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `expandOutlineFromColumnHeader(objectName, visualizationName)` |
| `collapseOutlineFromColumnHeader(objectName, visualizationName)` |
| `confirmOutlineGridCollapsed(objectName, visualizationName)` |
| `confirmOutlineGridExpanded(objectName, visualizationName)` |
| `expandOutlineFromElement(elementName, visualizationName)` |
| `collapseOutlineFromElement(elementName, visualizationName)` |

**Sub-components**
_none_

---

### SortOperations
> Extends: `BaseContainer`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `sortAscending(objectName, visualizationName)` |
| `sortDescending({ objectName, visualizationName = 'Visualization 1' })` |
| `sortMetric({ order })` |
| `sortMetricFromDropZone({ objectName, order })` |
| `metricSortFromViz({ objectName, visualizationName, order })` |
| `openAdvancedSortEditor({ objectName, visualizationName = 'Visualization 1' })` |
| `openCustomSortEditor(objectName, visualizationName)` |
| `addAdvancedSortParameter({ columnOrder, objectName, sortOrder })` |
| `saveAndCloseSortEditor()` |
| `closeSortEditor()` |
| `dragSortRowWithPositionInAdvancedSortEditor({ srcSortRow, desPosition, desSortRow })` |
| `switchRowColumnInSortEditor(buttonName)` |
| `clickSortDeleteRowButton(columnOrder)` |
| `createAndSaveAdvancedSort({ rowOrders, columnOrders, dragSortActions })` |
| `sortDescendingFromDropZone(objectName)` |
| `sortAscendingFromDropZone(objectName)` |
| `clearSortFromDropZone(objectName)` |
| `clearSortFromViz({ objectName, visualizationName })` |
| `sortAscendingFromViz({ objectName, visualizationName })` |
| `sortDescendingFromViz({ objectName, visualizationName })` |
| `sortWithinAttributeFromDropZone({ objectName, sortAttr })` |

**Sub-components**
- editorPanel

---

### ContextMenuSelectors
> Extends: `BaseContainer`

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

### GridSelectors
> Extends: `BaseContainer`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getObjectHeader(objectName, visualizationName)` |
| `getAllObjectHeaders(visualizationName)` |
| `getObjectHeaderByIndex(columnIndex, visualizationName)` |
| `isObjectHeaderExists(objectName, visualizationName)` |
| `getLinkFromGridCell(row, col, visualizationName)` |

**Sub-components**
- getContainer
- getGridContainer
- getColumnSetInEditorPanel

---

### NumberFormatSelectors
> Extends: `BaseContainer`

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

### GridValidators
> Extends: `BaseContainer`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `isSaveDisabledForHeaderRename()` |
| `isGroupEditorOpen()` |
| `isGroupEditorOpenForSpecificGroup(groupName)` |
| `noThresholdsPresentOnObject(headerName, visualizationName)` |
| `existObjectByName(objectName, visualizationName)` |
| `existReplaceByOption(objectName, visualizationName, targetObject)` |
| `existDrillOption(objectName, visualizationName, targetObject)` |
| `isElementPresent(element, objectName, visualizationName)` |
| `getAllGridObjectCount(visualizationName)` |
| `getGridCellCSSPropertyByPosition(row, col, visualizationName, property)` |
| `isOutlinePresentForGridObject(objectName, visualizationName)` |
| `getGridCellTextByPosition(row, col, visualizationName)` |

**Sub-components**
_none_

---

### NgmContextMenu
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `clickOnContextMenuOptionFromEditorPanel(objectName, objectZone, objectFunction)` |
| `clickOnSecondaryContextMenuOptionFromEditorPanel(objectName, objectZone, objectFunction1, objectFunction2)` |
| `openContextMenuFromEditorPanel(objectName, objectZone)` |
| `ctrlSelectAndCreateCalculation(objectName1, objectName2, objectZone, objectFunction)` |
| `ctrlSelectAndRemove(objectName1, objectName2, objectZone)` |
| `clickOnContextMenuOptionFromAxis(objectName, objectFunction)` |
| `clickOnSecondaryContextMenuOptionFromAxis(objectName, objectFunction1, objectFunction2)` |
| `openContextMenuFromAxis(objectName)` |
| `selectElementAndclickOnContextMenuOption(chartType, index, objectFunction)` |
| `selectElementAndclickOnSecondaryContextMenuOption(chartType, index, objectFunction1, objectFunction2)` |
| `clickOnContextMenuOptionFromElement(chartType, index, objectFunction)` |
| `clickOnSecondaryContextMenuOptionFromElement(chartType, index, objectFunction1, objectFunction2)` |
| `ctrlSelectElementsAndclickOnContextMenuOption(chartType, indexArray, objectFunction)` |
| `ctrlSelectElementsAndclickOnSecondaryContextMenuOption(chartType, indexArray, objectFunction1, objectFunction2)` |
| `openContextMenuFromElement(chartType, index)` |
| `clickOnContextMenuOption(webel, objectFunction)` |
| `clickOnSecondaryContextMenuOption(webel, objectFunction1, objectFunction2)` |
| `closeContextMenu()` |

**Sub-components**
- ngmEditorPanel
- ngmVisualizationPanel

---

### NgmEditorPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `dragDSObjectToBlankDZ(objectName, objectTypeName, datasetName, desZone)` |
| `dragDSObjectToDZ(objectName, objectTypeName, datasetName, desZone, desPosition, desObject)` |
| `dragDSObjectToDZReplace(objectName, objectTypeName, datasetName, desObject, desZone)` |
| `moveObject(srcObject, srcZone, desZone, desPosition, desObject)` |
| `moveObjectToBlankDZ(srcObject, srcZone, desZone)` |
| `moveObjectToReplace(srcObject, srcZone, desObject, desZone)` |
| `removeObjectFromDropZone(srcObject, srcZone)` |
| `editorPanelShortcutFunction(funName)` |
| `dragAndDropObjectAndWait(movingElement, targetElement)` |
| `moveToSpecificLocationAndWait(desPosition, srcElement, desElement)` |

**Sub-components**
- datasetsPanel
- datasetPanel

---

### NgmFormatPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `openFormatPanel()` |
| `switchFormatPanel(name)` |
| `select(groupName)` |

**Sub-components**
- formatPanel
- openFormatPanel

---

### Checkbox
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `locateByIndex(idx)` |
| `locate()` |
| `getWebElement(index)` |
| `getIdentity()` |
| `check()` |
| `uncheck()` |
| `isChecked()` |

**Sub-components**
_none_

---

### NgmVisualizationPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getCurrentPanel()` |
| `getELementPath(chartType)` |
| `getElementPathByIndex(index, chartType)` |
| `getELementTooltip(index, chartType)` |
| `selectElement(chartType, index)` |
| `ctrlSelectElement(chartType, index)` |
| `multiSelectElementsUsingCmndOrCtrl(indexArray, chartType)` |
| `multiSelectElementsUsingCommandOrControlNGM(xpaths)` |
| `clearVizHover()` |
| `getElementCount(chartType)` |

**Sub-components**
- getCurrentPanel
