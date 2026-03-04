# Site Knowledge: Alert Domain

## Overview

- **Domain key:** `alert`
- **Components covered:** Alert, AlertDialog
- **Spec files scanned:** 3
- **POM files scanned:** 2

## Components

### Alert
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `addAttributeCondition(attrName, conditionPaths, value1, value2)`
  - `addAttributeConditionWithoutApply(attrName, conditionPaths, value1, value2)`
  - `addMetricCondition(metricName, conditionPaths, value1, value2)`
  - `addMetricConditionWithoutApply(metricName, conditionPaths, value1, value2)`
  - `addRACondition(basedOnName, Level1List, expandLevel1List, level2List, expandLevel2List, level3List)`
  - `addRAConditionWithoutBasedOn(Level1List, expandLevel1List, level2List, expandLevel2List, level3List)`
  - `applyCondition()`
  - `cancelCondition()`
  - `chooseViewSelected(checked)`
  - `clickOnButtonByName(name)`
  - `closeConditionDialog()`
  - `getBasedOnDropDownElementsText()`
  - `getChooseElementByText()`
  - `getConditionExpression()`
  - `getCurrentOperatorText()`
  - `getSelectedElementListItems()`
  - `openBasedOnDropDown()`
  - `selectAttribute(attributeName)`
  - `selectMetric(metricName)`
  - `selectParameter(parameterName)`
  - `selectParameter(parameterName)`
- **Related components:** _none_

### AlertDialog
- **CSS root:** `.mstrmojo-ui-Menu-item-container`
- **User-visible elements:**
  - Add To Snapshot Checkbox (`.mstrd-SubscriptionSettings-format-snapshot .mstrd-Checkbox-shape`)
  - Add To Snapshot Info Icon (`.mstrd-SubscriptionSettings-format-snapshot .mstrd-InfoIcon`)
  - Alert Panel (`.mstrd-AlertDetailsDialog-main,.mstrd-SubscriptionEditDialog-main`)
  - Alert Panel Title (`.mstrd-AlertDetailsDialog-title`)
  - Alert Search List (`.mstrd-RecipientSearchResults`)
  - Cancel Alert Button (`.mstrd-AlertDetailsDialog-cancel`)
  - Close Button (`.mstrd-AlertDetailsDialog-headerIcons .icon-pnl_close`)
  - Color Palette (`.mstrd-SubscriptionSettings-colorPicker__content`)
  - Condition Dialog (`.mstrd-SubscriptionSettings-conditionEditor`)
  - Condition Editor (`.mstrd-SubscriptionSettings-conditionEditor`)
  - Condition Expr (`.mstrmojo-ThresholdExprTree`)
  - Condition Info Icon (`.mstrd-SubscriptionEditor-item .mstrd-InfoIcon`)
  - Create Alert Button (`.mstrd-AlertDetailsDialog-save`)
  - Default Range (`.mstrd-TreeSelect .mstrd-DropDownButton-label`)
  - Filter Panel In Sidebar (`.mstrd-SubscriptionFilterDropdown .mstrd-CheckboxList`)
  - Highlighted Metric Color Picker (`.mstrd-SubscriptionSettings-highlightedMetricColorPopoverContent`)
  - Operator Drop Down (`.mstrmojo-ui-Menu-item-container`)
  - Range Dropdown (`.mstrd-TreeSelect`)
  - Show Filter Checkbox (`.mstrd-SubscriptionSettings-excelFilter .mstrd-Checkbox-label`)
  - Subscription Details In Info Window (`.mstrd-SubscriptionInfo-details`)
  - Subscription Switcher (`.mstrd-SubscriptionInfo-subscriptionSwitcher`)
- **Component actions:**
  - `addCondition()`
  - `addRecipients(usernames)`
  - `cancelAlert()`
  - `cancelCreateAlert()`
  - `clickAddToSnapshotCheckbox()`
  - `clickAddToSnapshotInfoIcon()`
  - `clickConditionInfoIcon()`
  - `clickRangeDropdown()`
  - `clickShowFilterCheckbox()`
  - `clickSubscriptionFiltersType(name)`
  - `clickSubscriptionSwitcher()`
  - `closeAlertDialog()`
  - `closeHighlightedMetricDropdown()`
  - `createAlert()`
  - `deleteCondition(title, itemIndex = 1)`
  - `dragAndDropConditionItem(fromItem, toItem)`
  - `editCondition(conditionIndex, groupIndex = 1)`
  - `editConditionByTitle(title)`
  - `editSubscription(subscriptionName)`
  - `getAllOperatorsValue()`
  - `getConditionExpression()`
  - `getConditionGroupsCount()`
  - `getConditionItemByTitle(title, itemIndex = 1)`
  - `getConditionOperatorValue(conditionIndex, groupIndex)`
  - `getCurrentAlertType()`
  - `getCurrentTargetDevices()`
  - `getEditButtonFromRow(subscriptionName)`
  - `getExcludeConditionExpression()`
  - `getHighlightedMetricColorFormat()`
  - `getHighlightedMetricDropdownColumnSetsValue()`
  - `getHighlightedMetricOptionValue()`
  - `getRowBySubscriptionName(subscriptionName)`
  - `getSubscriptionTypeByName(subscriptionName)`
  - `groupCondition(title, itemIndex = 1)`
  - `isAddToSnapshotChecked()`
  - `isAddToSnapshotPresent()`
  - `isGroupIconDisplayedInConditionItem(title, itemIndex = 1)`
  - `isShowFilterPresent()`
  - `isSnapshotInFormatPresent()`
  - `isTargetDeviceSectionVisible()`
  - `isUngroupIconDisplayedInConditionItem(title, itemIndex = 1)`
  - `openHighlightedMetricDropdown()`
  - `selectHighlightedMetric(name)`
  - `selectHighlightedMetricFormat(fillColor, fontColor)`
  - `selectRange(dropDownOption)`
  - `selectSendThroughOption(name)`
  - `selectTargetDevices(nameList)`
  - `ungroupCondition(title, itemIndex = 1)`
  - `updateConditionOperator(title, operator, itemIndex = 1)`
- **Related components:** getAlertPanel, getSubscriptionFilterContainer

## Common Workflows (from spec.ts)

1. Test create alert subscription (used in 2 specs)
2. [TC98547_01] Check alert entry from visualizations (used in 1 specs)
3. [TC98547_02] Check alert entry for no privilege users (used in 1 specs)
4. [TC98547_03] Check alert entry in custom applications (used in 1 specs)
5. [TC98547_04] Check alert subscribe dialogue when creating alert (used in 1 specs)
6. [TC98547_05] Create Alert and check subscription list and info window (used in 1 specs)
7. [TC98547_06] Manage alert in subscription list and filter (used in 1 specs)
8. [TC98547_07] Test add to snapshot entry in alert (used in 1 specs)
9. [TC98547_08] Test add to snapshot function in alert (used in 1 specs)
10. [TC98547_09] Test deliver to in alert (used in 1 specs)
11. [TC98547_10] verify snapshot view and bookmark view for alert (used in 1 specs)
12. [TC98552_01] Alert in color theme (used in 1 specs)
13. [TC98552_02] Alert in responsive view (used in 1 specs)
14. [TC98552_03] I18N case for alert (used in 1 specs)
15. [TC98552_04] Error handling case for alert (used in 1 specs)
16. [TC98628_01] Alert | Verify condition creation in Alert Subscription in AG Grid (used in 1 specs)
17. [TC98628_03] Alert | Verify mobile alert creation and update (used in 1 specs)
18. [TC98628] Alert | Verify condition creation in Alert Subscription (used in 1 specs)
19. [TC98679] Alert | Verify operator for condition in Alert Subscription (used in 1 specs)
20. [TC98712] Alert | Verify groups for condition in Alert Subscription (used in 1 specs)
21. [TC98721] Alert | Verify group + operator for condition in Alert Subscription (used in 1 specs)
22. [TC98734] Alert | Verify condition for dashboard with prompt in Alert Subscription (used in 1 specs)
23. [TC98738] Alert | Verify editing condition IW for Alert Subscription (used in 1 specs)
24. [TC98744_01] Alert | Verify alert for Viz with RA (used in 1 specs)
25. [TC98744] Alert | Alert | Verify alert for viz applied threshold (used in 1 specs)
26. [TC98936_01] Alert | Verify alert for highlighted metric has been deleted (used in 1 specs)
27. [TC98936] Alert | Verify based on options in condition editor (used in 1 specs)
28. Alert - create and update condition for alert subscription in Library (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getConditionExpression -- frequency: 16
2. getInfoWindow -- frequency: 13
3. getAllOperatorsValue -- frequency: 10
4. getAlertPanel -- frequency: 9
5. getConditionGroupsCount -- frequency: 9
6. getHighlightedMetricOptionValue -- frequency: 8
7. getBasedOnDropDownElementsText -- frequency: 5
8. getSubscriptionSidebarEditDialog -- frequency: 4
9. getConditionExpr -- frequency: 3
10. getConditionSection -- frequency: 3
11. getCurrentBookmarkSelection -- frequency: 3
12. getEditButtonInSidebar -- frequency: 3
13. getExcludeConditionExpression -- frequency: 3
14. getSubscriptionTypeByName -- frequency: 3
15. getAlertPanelTitle -- frequency: 2
16. getDossierListContainerHeight -- frequency: 2
17. getHighlightedMetricColorFormat -- frequency: 2
18. getSubscriptionDetailsInInfoWindow -- frequency: 2
19. Add To Snapshot Checkbox -- frequency: 1
20. Add To Snapshot Info Icon -- frequency: 1
21. Alert Panel -- frequency: 1
22. Alert Panel Title -- frequency: 1
23. Alert Search List -- frequency: 1
24. Cancel Alert Button -- frequency: 1
25. Close Button -- frequency: 1
26. Color Palette -- frequency: 1
27. Condition Dialog -- frequency: 1
28. Condition Editor -- frequency: 1
29. Condition Expr -- frequency: 1
30. Condition Info Icon -- frequency: 1
31. Create Alert Button -- frequency: 1
32. Default Range -- frequency: 1
33. Filter Panel In Sidebar -- frequency: 1
34. getContainerByTitle -- frequency: 1
35. getContextMenuByLevel -- frequency: 1
36. getCurrentAlertType -- frequency: 1
37. getCurrentTargetDevices -- frequency: 1
38. getDefaultRange -- frequency: 1
39. getDossierView -- frequency: 1
40. getFilterPanelInSidebar -- frequency: 1
41. getHighlightedMetricDropdownColumnSetsValue -- frequency: 1
42. getSnapshotSection -- frequency: 1
43. getSnapshotTitleText -- frequency: 1
44. getSubscriptionPropertyBySubscriptionName -- frequency: 1
45. getVisualizationMenuButton -- frequency: 1
46. Highlighted Metric Color Picker -- frequency: 1
47. Operator Drop Down -- frequency: 1
48. Range Dropdown -- frequency: 1
49. Show Filter Checkbox -- frequency: 1
50. Subscription Details In Info Window -- frequency: 1
51. Subscription Switcher -- frequency: 1

## Key Actions

- `addCondition()` -- used in 46 specs
- `openPageFromTocMenu()` -- used in 31 specs
- `goToLibrary()` -- used in 28 specs
- `openDossier()` -- used in 28 specs
- `addAttributeCondition(attrName, conditionPaths, value1, value2)` -- used in 27 specs
- `createAlert()` -- used in 26 specs
- `selectAlertOnVisualizationMenu()` -- used in 23 specs
- `selectHighlightedMetric(name)` -- used in 23 specs
- `clickEditButtonInSidebar()` -- used in 22 specs
- `openSubscriptions()` -- used in 20 specs
- `updateConditionOperator(title, operator, itemIndex = 1)` -- used in 19 specs
- `addMetricCondition(metricName, conditionPaths, value1, value2)` -- used in 18 specs
- `getConditionExpression()` -- used in 16 specs
- `cancelAlert()` -- used in 15 specs
- `isAlertOnVisualizationMenuPresent()` -- used in 15 specs
- `inputName()` -- used in 14 specs
- `openSidebarOnly()` -- used in 14 specs
- `getInfoWindow()` -- used in 13 specs
- `getAllOperatorsValue()` -- used in 10 specs
- `switchUser()` -- used in 10 specs
- `getAlertPanel()` -- used in 9 specs
- `getConditionGroupsCount()` -- used in 9 specs
- `getHighlightedMetricOptionValue()` -- used in 8 specs
- `moveDossierIntoViewPort()` -- used in 8 specs
- `openDossierInfoWindow()` -- used in 8 specs
- `cancelCreateAlert()` -- used in 7 specs
- `editConditionByTitle(title)` -- used in 7 specs
- `groupCondition(title, itemIndex = 1)` -- used in 7 specs
- `clickInfoWindowEdit()` -- used in 6 specs
- `clickManageSubscriptionsButton()` -- used in 6 specs
- `editSubscription(subscriptionName)` -- used in 6 specs
- `ungroupCondition(title, itemIndex = 1)` -- used in 6 specs
- `applyCondition()` -- used in 5 specs
- `clickAddToSnapshotCheckbox()` -- used in 5 specs
- `clickAllSection()` -- used in 5 specs
- `clickLibraryIcon()` -- used in 5 specs
- `clickRunNowInSubscriptionListByName()` -- used in 5 specs
- `clickSidebarSave()` -- used in 5 specs
- `getBasedOnDropDownElementsText()` -- used in 5 specs
- `addMetricConditionWithoutApply(metricName, conditionPaths, value1, value2)` -- used in 4 specs
- `clickAddToSnapshotInfoIcon()` -- used in 4 specs
- `clickConditionInfoIcon()` -- used in 4 specs
- `getSubscriptionSidebarEditDialog()` -- used in 4 specs
- `isAddToSnapshotPresent()` -- used in 4 specs
- `isDisplayed()` -- used in 4 specs
- `login()` -- used in 4 specs
- `addRecipients(usernames)` -- used in 3 specs
- `closeSubscribe()` -- used in 3 specs
- `getConditionExpr()` -- used in 3 specs
- `getConditionSection()` -- used in 3 specs
- `getCurrentBookmarkSelection()` -- used in 3 specs
- `getEditButtonInSidebar()` -- used in 3 specs
- `getExcludeConditionExpression()` -- used in 3 specs
- `getSubscriptionTypeByName(subscriptionName)` -- used in 3 specs
- `getText()` -- used in 3 specs
- `isGroupIconDisplayedInConditionItem(title, itemIndex = 1)` -- used in 3 specs
- `isUngroupIconDisplayedInConditionItem(title, itemIndex = 1)` -- used in 3 specs
- `openCustomAppById()` -- used in 3 specs
- `selectHighlightedMetricFormat(fillColor, fontColor)` -- used in 3 specs
- `waitForElementVisible()` -- used in 3 specs
- `cancelCondition()` -- used in 2 specs
- `clear()` -- used in 2 specs
- `clickFilterIcon()` -- used in 2 specs
- `customCredentials()` -- used in 2 specs
- `dragAndDropConditionItem(fromItem, toItem)` -- used in 2 specs
- `executeScript()` -- used in 2 specs
- `getAlertPanelTitle()` -- used in 2 specs
- `getDossierListContainerHeight()` -- used in 2 specs
- `getHighlightedMetricColorFormat()` -- used in 2 specs
- `getSubscriptionDetailsInInfoWindow()` -- used in 2 specs
- `labelInTitle()` -- used in 2 specs
- `openDefaultApp()` -- used in 2 specs
- `openFilterDetailPanel()` -- used in 2 specs
- `selectMetric(metricName)` -- used in 2 specs
- `selectParameter(parameterName)` -- used in 2 specs
- `selectRange(dropDownOption)` -- used in 2 specs
- `selectSchedule()` -- used in 2 specs
- `selectTargetDevices(nameList)` -- used in 2 specs
- `toggleSendPreviewNow()` -- used in 2 specs
- `addAttributeConditionWithoutApply(attrName, conditionPaths, value1, value2)` -- used in 1 specs
- `addNewBookmark()` -- used in 1 specs
- `addRACondition(basedOnName, Level1List, expandLevel1List, level2List, expandLevel2List, level3List)` -- used in 1 specs
- `addRAConditionWithoutBasedOn(Level1List, expandLevel1List, level2List, expandLevel2List, level3List)` -- used in 1 specs
- `checkFilterType()` -- used in 1 specs
- `clickAllowUnsubscribe()` -- used in 1 specs
- `clickApplyButton()` -- used in 1 specs
- `clickFiltersOption()` -- used in 1 specs
- `clickInWindowRunNow()` -- used in 1 specs
- `clickPredefinedSection()` -- used in 1 specs
- `clickShowFilterCheckbox()` -- used in 1 specs
- `clickSidebarUnsubscribe()` -- used in 1 specs
- `clickSubscriptionFilter()` -- used in 1 specs
- `clickSubscriptionSwitcher()` -- used in 1 specs
- `clickUnsubscribeYes()` -- used in 1 specs
- `closeAlertDialog()` -- used in 1 specs
- `closeConditionDialog()` -- used in 1 specs
- `closePanel()` -- used in 1 specs
- `deleteCondition(title, itemIndex = 1)` -- used in 1 specs
- `exitInfoWindowPDFSettingsMenu()` -- used in 1 specs
- `getContainerByTitle()` -- used in 1 specs
- `getContextMenuByLevel()` -- used in 1 specs
- `getCurrentAlertType()` -- used in 1 specs
- `getCurrentTargetDevices()` -- used in 1 specs
- `getDefaultRange()` -- used in 1 specs
- `getDossierView()` -- used in 1 specs
- `getFilterPanelInSidebar()` -- used in 1 specs
- `getHighlightedMetricDropdownColumnSetsValue()` -- used in 1 specs
- `getSnapshotSection()` -- used in 1 specs
- `getSnapshotTitleText()` -- used in 1 specs
- `getSubscriptionPropertyBySubscriptionName()` -- used in 1 specs
- `getVisualizationMenuButton()` -- used in 1 specs
- `hover()` -- used in 1 specs
- `hoverSubscription()` -- used in 1 specs
- `inputBookmark()` -- used in 1 specs
- `inputNote()` -- used in 1 specs
- `isGridElmAppliedThreshold()` -- used in 1 specs
- `isSnapshotContentSectionPresent()` -- used in 1 specs
- `isSnapshotInFormatPresent()` -- used in 1 specs
- `isTargetDeviceSectionVisible()` -- used in 1 specs
- `logout()` -- used in 1 specs
- `openPanel()` -- used in 1 specs
- `openPDFSettingsMenu()` -- used in 1 specs
- `openSnapshotById()` -- used in 1 specs
- `openUrl()` -- used in 1 specs
- `openUserAccountMenu()` -- used in 1 specs
- `openVisualizationMenu()` -- used in 1 specs
- `push()` -- used in 1 specs
- `refresh()` -- used in 1 specs
- `reload()` -- used in 1 specs
- `selectAttribute(attributeName)` -- used in 1 specs
- `selectBookmark()` -- used in 1 specs
- `selectExcelContents()` -- used in 1 specs
- `selectFormat()` -- used in 1 specs
- `selectGridContextMenuOption()` -- used in 1 specs
- `selectSendThroughOption(name)` -- used in 1 specs
- `url()` -- used in 1 specs
- `waitForItemLoading()` -- used in 1 specs
- `chooseViewSelected(checked)` -- used in 0 specs
- `clickOnButtonByName(name)` -- used in 0 specs
- `clickRangeDropdown()` -- used in 0 specs
- `clickSubscriptionFiltersType(name)` -- used in 0 specs
- `closeHighlightedMetricDropdown()` -- used in 0 specs
- `editCondition(conditionIndex, groupIndex = 1)` -- used in 0 specs
- `getChooseElementByText()` -- used in 0 specs
- `getConditionItemByTitle(title, itemIndex = 1)` -- used in 0 specs
- `getConditionOperatorValue(conditionIndex, groupIndex)` -- used in 0 specs
- `getCurrentOperatorText()` -- used in 0 specs
- `getEditButtonFromRow(subscriptionName)` -- used in 0 specs
- `getRowBySubscriptionName(subscriptionName)` -- used in 0 specs
- `getSelectedElementListItems()` -- used in 0 specs
- `isAddToSnapshotChecked()` -- used in 0 specs
- `isShowFilterPresent()` -- used in 0 specs
- `openBasedOnDropDown()` -- used in 0 specs
- `openHighlightedMetricDropdown()` -- used in 0 specs

## Source Coverage

- `pageObjects/alert/**/*.js`
- `specs/regression/alert/**/*.{ts,js}`
