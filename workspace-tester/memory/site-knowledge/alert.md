# Site Knowledge: alert

> Components: 2

### AlertDialog
> Extends: `Subscribe`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AlertPanel` | `.mstrd-AlertDetailsDialog-main,.mstrd-SubscriptionEditDialog-main` | element |
| `AlertPanelTitle` | `.mstrd-AlertDetailsDialog-title` | element |
| `HighlightedMetricColorPicker` | `.mstrd-SubscriptionSettings-highlightedMetricColorPopoverContent` | element |
| `ColorPalette` | `.mstrd-SubscriptionSettings-colorPicker__content` | element |
| `OperatorDropDown` | `.mstrmojo-ui-Menu-item-container` | element |
| `ShowFilterCheckbox` | `.mstrd-SubscriptionSettings-excelFilter .mstrd-Checkbox-label` | element |
| `AddToSnapshotCheckbox` | `.mstrd-SubscriptionSettings-format-snapshot .mstrd-Checkbox-shape` | element |
| `DefaultRange` | `.mstrd-TreeSelect .mstrd-DropDownButton-label` | button |
| `ConditionDialog` | `.mstrd-SubscriptionSettings-conditionEditor` | element |
| `AlertSearchList` | `.mstrd-RecipientSearchResults` | element |
| `RangeDropdown` | `.mstrd-TreeSelect` | dropdown |
| `ConditionEditor` | `.mstrd-SubscriptionSettings-conditionEditor` | element |
| `CreateAlertButton` | `.mstrd-AlertDetailsDialog-save` | element |
| `CancelAlertButton` | `.mstrd-AlertDetailsDialog-cancel` | element |
| `ConditionInfoIcon` | `.mstrd-SubscriptionEditor-item .mstrd-InfoIcon` | element |
| `AddToSnapshotInfoIcon` | `.mstrd-SubscriptionSettings-format-snapshot .mstrd-InfoIcon` | element |
| `FilterPanelInSidebar` | `.mstrd-SubscriptionFilterDropdown .mstrd-CheckboxList` | dropdown |
| `ConditionExpr` | `.mstrmojo-ThresholdExprTree` | element |
| `SubscriptionDetailsInInfoWindow` | `.mstrd-SubscriptionInfo-details` | element |
| `SubscriptionSwitcher` | `.mstrd-SubscriptionInfo-subscriptionSwitcher` | element |
| `CloseButton` | `.mstrd-AlertDetailsDialog-headerIcons .icon-pnl_close` | element |

**Actions**
| Signature |
|-----------|
| `getConditionItemByTitle(title, itemIndex = 1)` |
| `clickSubscriptionSwitcher()` |
| `clickRangeDropdown()` |
| `selectRange(dropDownOption)` |
| `clickSubscriptionFiltersType(name)` |
| `createAlert()` |
| `cancelAlert()` |
| `clickAddToSnapshotCheckbox()` |
| `clickShowFilterCheckbox()` |
| `selectHighlightedMetric(name)` |
| `openHighlightedMetricDropdown()` |
| `closeHighlightedMetricDropdown()` |
| `selectHighlightedMetricFormat(fillColor, fontColor)` |
| `addCondition()` |
| `editCondition(conditionIndex, groupIndex = 1)` |
| `editConditionByTitle(title)` |
| `updateConditionOperator(title, operator, itemIndex = 1)` |
| `deleteCondition(title, itemIndex = 1)` |
| `groupCondition(title, itemIndex = 1)` |
| `ungroupCondition(title, itemIndex = 1)` |
| `dragAndDropConditionItem(fromItem, toItem)` |
| `selectSendThroughOption(name)` |
| `selectTargetDevices(nameList)` |
| `closeAlertDialog()` |
| `addRecipients(usernames)` |
| `getRowBySubscriptionName(subscriptionName)` |
| `getSubscriptionTypeByName(subscriptionName)` |
| `getEditButtonFromRow(subscriptionName)` |
| `editSubscription(subscriptionName)` |
| `isSnapshotInFormatPresent()` |
| `isShowFilterPresent()` |
| `isAddToSnapshotPresent()` |
| `isAddToSnapshotChecked()` |
| `getConditionExpression()` |
| `getExcludeConditionExpression()` |
| `getAllOperatorsValue()` |
| `getConditionGroupsCount()` |
| `isGroupIconDisplayedInConditionItem(title, itemIndex = 1)` |
| `isUngroupIconDisplayedInConditionItem(title, itemIndex = 1)` |
| `getConditionOperatorValue(conditionIndex, groupIndex)` |
| `getHighlightedMetricColorFormat()` |
| `getHighlightedMetricOptionValue()` |
| `getHighlightedMetricDropdownColumnSetsValue()` |
| `cancelCreateAlert()` |
| `clickConditionInfoIcon()` |
| `clickAddToSnapshotInfoIcon()` |
| `getCurrentAlertType()` |
| `isTargetDeviceSectionVisible()` |
| `getCurrentTargetDevices()` |

**Sub-components**
- getAlertPanel
- getSubscriptionFilterContainer

---

### Alert
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `addAttributeCondition(attrName, conditionPaths, value1, value2)` |
| `addAttributeConditionWithoutApply(attrName, conditionPaths, value1, value2)` |
| `addRAConditionWithoutBasedOn(Level1List, expandLevel1List, level2List, expandLevel2List, level3List)` |
| `addRACondition(basedOnName, Level1List, expandLevel1List, level2List, expandLevel2List, level3List)` |
| `addMetricCondition(metricName, conditionPaths, value1, value2)` |
| `addMetricConditionWithoutApply(metricName, conditionPaths, value1, value2)` |
| `selectParameter(parameterName)` |
| `selectMetric(metricName)` |
| `selectParameter(parameterName)` |
| `selectAttribute(attributeName)` |
| `clickOnButtonByName(name)` |
| `applyCondition()` |
| `cancelCondition()` |
| `openBasedOnDropDown()` |
| `chooseViewSelected(checked)` |
| `closeConditionDialog()` |
| `getChooseElementByText()` |
| `getBasedOnDropDownElementsText()` |
| `getSelectedElementListItems()` |
| `getConditionExpression()` |
| `getCurrentOperatorText()` |

**Sub-components**
_none_
