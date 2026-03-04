# Site Knowledge: Snapshots Domain

## Overview

- **Domain key:** `snapshots`
- **Components covered:** SnapshotsAction, SnapshotsGrid, SnapshotsPage, SnapshotsToolbar
- **Spec files scanned:** 18
- **POM files scanned:** 4

## Components

### SnapshotsAction
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `addMultipleSnapshotsToFavorites(snapshotsGrid, snapshotNames)`
  - `addSnapshotToFavorites(name)`
  - `addSnapshotToFavoritesByIndex(index)`
  - `deleteMultipleSnapshotsByNames(snapshotsGrid, snapshotNames, confirmDelete = true)`
  - `deleteSnapshotByIndex(index, confirmDelete = true)`
  - `deleteSnapshotByName(name, confirmDelete = true)`
  - `expandCollapseSnapshotsGroup(snapshotsGrid)`
  - `getErrorTooltipText()`
  - `getFavoritesCount()`
  - `getSnapShotErrorMsgByName(snapshotsGrid, name)`
  - `hoverOnErrorStatus(snapshotsGrid)`
  - `hoverOnSnapshotByName(name)`
  - `isFavoriteButtonDisplayed(name)`
  - `openSnapshotByIndex(index, waitForLoading = false)`
  - `openSnapshotByName(name, waitForLoading = false)`
  - `refreshSnapshotsGrid()`
  - `removeSnapshotFromFavorites(name)`
  - `renameSnapshotByName(currentName, newName)`
  - `selectMultipleSnapshotsByIndices(indices)`
  - `selectMultipleSnapshotsByNames(snapshotNames)`
  - `selectSnapshotByIndex(index)`
  - `selectSnapshotByName(name)`
  - `waitForSnapshotStatusChange(snapshotsGrid, name, expectedStatus, timeoutMs = 30000)`
  - `waitForSnapshotToAppear(snapshotsGrid, name, timeoutMs = 10000)`
  - `waitForSnapshotToDisappear(snapshotsGrid, name, timeoutMs = 10000)`
- **Related components:** dossierPage

### SnapshotsGrid
- **CSS root:** `.ag-center-cols-container`
- **User-visible elements:**
  - Center Cols Container (`.ag-center-cols-container`)
  - Full Width Container (`.ag-full-width-container`)
- **Component actions:**
  - `getFavoritesGroup()`
  - `getFavoritesGroupTitleText()`
  - `getGroupRow()`
  - `getGroupTitleText(group)`
  - `getSnapshotContentByName(name)`
  - `getSnapshotContentTypes()`
  - `getSnapshotDates()`
  - `getSnapshotNames()`
  - `getSnapshotNamesByStatus(status)`
  - `getSnapshotRowByName(name)`
  - `getSnapshotsCount(section = 'Snapshots')`
  - `getSnapshotsGroup()`
  - `getSnapshotsGroupTitleText()`
  - `getSnapshotStatusByName(name)`
  - `getSnapshotStatuses()`
  - `getSnapshotTypeByName(name)`
  - `getSnapshotUnreadStatusByName(name)`
  - `hoverOnSnapshotStatusIcon(name)`
  - `isGridEmpty()`
  - `isSnapshotInFavorites(name)`
  - `isSnapshotVisible(snapshotName)`
- **Related components:** getFullWidthContainer

### SnapshotsPage
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `addSnapshotToFavorites(name)`
  - `deleteSnapshotByName(name, confirmDelete = true)`
  - `getErrorTooltipText()`
  - `getFavoritesCount()`
  - `getSnapshotContentByName(name)`
  - `getSnapShotContentByName(name)`
  - `getSnapshotContentTypes()`
  - `getSnapshotDates()`
  - `getSnapShotErrorMsgByName(name)`
  - `getSnapshotItemByName(name)`
  - `getSnapshotNames()`
  - `getSnapshotNamesByStatus(status)`
  - `getSnapshotRowByName(name)`
  - `getSnapshotsCount(section = 'Snapshots')`
  - `getSnapShotStatusByName(name)`
  - `getSnapshotStatuses()`
  - `getSnapshotTypeByName(name)`
  - `getSnapshotWithErrorStatus()`
  - `getSnapshotWithRunningStatus()`
  - `hasSnapshotWithStatus(status)`
  - `hasUnreadIndicator(rowIndex)`
  - `hasUnreadIndicatorByName(name)`
  - `hoverOnErrorStatus()`
  - `isGridEmpty()`
  - `isSnapshotInFavorites(name)`
  - `isSnapshotOrderedByCreationTimeDesc()`
  - `isSnapshotVisible(snapshotName)`
  - `openSnapshotByName(name, waitForLoading = false)`
  - `removeSnapshotFromFavorites(name)`
  - `renameSnapshotByName(currentName, newName)`
  - `verifySnapshotDetails(index, expectedName, expectedContentType, expectedStatus)`
- **Related components:** _none_

### SnapshotsToolbar
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clearAllFilters()`
  - `composeFilter(updateFn, apply = false)`
  - `currentSortOption()`
  - `currentSortOrder()`
  - `currentSortStatus()`
  - `ensureFilterPanelOpen()`
  - `filterBy({ filterType, items, apply = true, clearAll = true })`
  - `filterByContent(items, apply = true, clearAll = true)`
  - `filterByContentType(items, apply = true, clearAll = true)`
  - `filterByProject(items, apply = true, clearAll = true)`
  - `isFilterIconDisplayed()`
  - `isSortDisplayed()`
  - `isSortMenuOpen()`
  - `openFilterDetailPanel(type)`
  - `openSortMenu()`
  - `selectSortOption(option)`
  - `selectSortOrder(order)`
  - `updateSort(func, option)`
- **Related components:** ensureFilterPanel, openFilterDetailPanel

## Common Workflows (from spec.ts)

1. [TC92413_2] Clear all snapshots (used in 1 specs)
2. [TC92413] SanityTestSnapshot pin search category (used in 1 specs)
3. [TC92414_1] AI Bot Snapshot: Check theme and sort (used in 1 specs)
4. [TC92414_2] AI Bot Snapshot: Rename snapshots (used in 1 specs)
5. [TC92414_3] AI Bot Snapshot: Rename snapshot title (used in 1 specs)
6. [TC92414_4] AI Bot Snapshot: Copy snapshot title (used in 1 specs)
7. [TC92415_1] SnapshotMap copy download (used in 1 specs)
8. [TC92415_2] SnapshotVisualization copy download (used in 1 specs)
9. [TC92416_1] AI Bot Snapshot: Check SnapshotPanelDisabled (used in 1 specs)
10. [TC92416_2] AI Bot Snapshot: Hit50Limit (used in 1 specs)
11. [TC92416_3] AI Bot Snapshot: EmptySnapshotPanel in different theme (used in 1 specs)
12. [TC92416_4] AI Bot Snapshot: Check snapshot in mobile view (used in 1 specs)
13. [TC92416_5] AI Bot Snapshot: Create new bot and check category (used in 1 specs)
14. [TC92416_6] AI Bot Snapshot: Check message for error viz (used in 1 specs)
15. [TC92571_1] Check empty snapshot panel in Chinese (used in 1 specs)
16. [TC92571_2] Check chat answer and sort in Chinese (used in 1 specs)
17. [TC92571_3] Check snapshot card and dialog in Chinese (used in 1 specs)
18. [TC92571_4] Check empty snapshot panel in German (used in 1 specs)
19. [TC92571_5] Check chat answer and sort in German (used in 1 specs)
20. [TC92571_6] Check snapshot card and dialog in German (used in 1 specs)
21. [TC93546_1] NormalUser - show interpretation and close (used in 1 specs)
22. [TC93546_2] NormalUser - snapshot manipulations (search, sort) (used in 1 specs)
23. [TC93546_3] NormalUser - delete and add again (used in 1 specs)
24. [TC93546_4] NormalUser - ask again (used in 1 specs)
25. [TC93553_1] PowerUser - show interpretation and close (used in 1 specs)
26. [TC93553_2] PowerUser - snapshot manipulations (search, sort) (used in 1 specs)
27. [TC93553_3] PowerUser - focus view (view more/view less) (used in 1 specs)
28. [TC93553_4] PowerUser - snapshot manipulations (search, sort, copy/download) (used in 1 specs)
29. [TC94986] Add Topic message to snapshot (used in 1 specs)
30. [TC95332] Add thumbdown message to snapshot (used in 1 specs)
31. [TC97471_1] Add message with learning indicator to snapshot (used in 1 specs)
32. [TC97471_2] Snasphot Learning indicator mobile view (used in 1 specs)
33. [TC99396_1] Check Snapshot lists (used in 1 specs)
34. [TC99396_10] Check send background for document - error (used in 1 specs)
35. [TC99396_11] Check send background for report (used in 1 specs)
36. [TC99396_12] Check send background not showing up (used in 1 specs)
37. [TC99396_2] SnapshotItems CURD (used in 1 specs)
38. [TC99396_3] Check Sort (used in 1 specs)
39. [TC99396_4] Check Filter (used in 1 specs)
40. [TC99396_5] Check snapshots will not show up when user has no WebViewHistoryList privilege and custom app settings is disabled (used in 1 specs)
41. [TC99396_6] Check custom app settings when disable snapshot favorite (used in 1 specs)
42. [TC99396_7] Check send background for dashboard (used in 1 specs)
43. [TC99396_8] Check send background for document (used in 1 specs)
44. [TC99396_9] Check send background for document - wait for input (used in 1 specs)
45. AIbotCopyDownloadTest (used in 1 specs)
46. AIbotSnapshot_Interpretation_NormalUser (used in 1 specs)
47. AIbotSnapshot_Interpretation_PowerUser (used in 1 specs)
48. AIbotSnapshot_LearningIndicator (used in 1 specs)
49. AIbotSnapshot_Thumbdown (used in 1 specs)
50. AIbotSnapshot_Topic (used in 1 specs)
51. AIbotSnapshot_xFunction (used in 1 specs)
52. AIbotSnapshotErrorHandling (used in 1 specs)
53. AIbotSnapshotI18NChinese (used in 1 specs)
54. AIbotSnapshotI18NGerman (used in 1 specs)
55. AIbotSnapshotPanel (used in 1 specs)
56. AIbotSnapshotPanel_GetBotData (used in 1 specs)
57. AIbotSnapshotSanity (used in 1 specs)
58. Reset_Example (used in 1 specs)
59. Test manipulations on snapshots blade (used in 1 specs)
60. Test Privilege And Custom App on snapshots blade (used in 1 specs)
61. Test Search Filter on snapshots blade (used in 1 specs)
62. Test send background for report / document / dashboard (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getSnapshotCardByText -- frequency: 39
2. getText -- frequency: 29
3. getTitleBarLeft -- frequency: 26
4. getInterpretationContent -- frequency: 15
5. getMySnapshotsPanel -- frequency: 13
6. getSnapshotCategoryAreaByName -- frequency: 10
7. getToastbyMessage -- frequency: 10
8. getSnapshotNames -- frequency: 9
9. getSnapshotDialog -- frequency: 8
10. getThumbdownIcon -- frequency: 8
11. getLearningIndicator -- frequency: 7
12. getNumberOfDisplayedSnapshotCard -- frequency: 7
13. getEmptySnapshotPanel -- frequency: 6
14. getNthParagraphOfTextAnswerFromEnd -- frequency: 6
15. getFullWidthContainer -- frequency: 5
16. getNotificationSection -- frequency: 5
17. getSortButton -- frequency: 5
18. getCopyButton -- frequency: 4
19. getDeleteButton -- frequency: 4
20. getDownloadButton -- frequency: 4
21. getInterpretationButton -- frequency: 4
22. getSnapshotCardInsideByText -- frequency: 4
23. getSortContent -- frequency: 4
24. getChatAnswerByText -- frequency: 3
25. getInputBox -- frequency: 3
26. getInterpretationContentText -- frequency: 3
27. getInterpretationNuggets -- frequency: 3
28. getLearningTooltip -- frequency: 3
29. getPinButton -- frequency: 3
30. getAttribute -- frequency: 2
31. getCategoryMenu -- frequency: 2
32. getConfirmDeleteDialog -- frequency: 2
33. getMaximizeButton -- frequency: 2
34. getMoveButton -- frequency: 2
35. getMoveDialog -- frequency: 2
36. getSavedTime -- frequency: 2
37. getSearchInput -- frequency: 2
38. getSnapshotPanelHeader -- frequency: 2
39. Center Cols Container -- frequency: 1
40. Full Width Container -- frequency: 1
41. getBubbleLoadingIcon -- frequency: 1
42. getCategoryCount -- frequency: 1
43. getClearSnapshotsController -- frequency: 1
44. getDotInSnapshotPanelButton -- frequency: 1
45. getElement -- frequency: 1
46. getErrorMessageDialog -- frequency: 1
47. getInputBoxText -- frequency: 1
48. getInterpretationComponents -- frequency: 1
49. getInterpretationContentTitle -- frequency: 1
50. getMarkDownByIndex -- frequency: 1
51. getMessageContainerInSnapshotBannerText -- frequency: 1
52. getNotificationCount -- frequency: 1
53. getOpenSnapshotPanelButton -- frequency: 1
54. getPinButtonOfNthChatAnswer -- frequency: 1
55. getRecommendationByIndex -- frequency: 1
56. getSnapshotContent -- frequency: 1
57. getSnapshotOperations -- frequency: 1
58. getSnapshotStatuses -- frequency: 1
59. getSnapshotTitle -- frequency: 1
60. getSnapshotUnreadStatusByName -- frequency: 1
61. getUnpinButtonOfNthChatAnswer -- frequency: 1

## Key Actions

- `log()` -- used in 131 specs
- `getSnapshotCardByText()` -- used in 41 specs
- `isDisplayed()` -- used in 40 specs
- `clickOpenSnapshotPanelButton()` -- used in 37 specs
- `getText()` -- used in 30 specs
- `searchByText()` -- used in 28 specs
- `waitForElementVisible()` -- used in 28 specs
- `getTitleBarLeft()` -- used in 26 specs
- `isSnapshotPanelClosed()` -- used in 26 specs
- `parse()` -- used in 26 specs
- `readFileSync()` -- used in 26 specs
- `isExisting()` -- used in 23 specs
- `setSortBy()` -- used in 23 specs
- `clearSearch()` -- used in 22 specs
- `openDossier()` -- used in 19 specs
- `login()` -- used in 18 specs
- `clickLibraryIcon()` -- used in 17 specs
- `openBotById()` -- used in 17 specs
- `stringify()` -- used in 17 specs
- `writeFileSync()` -- used in 17 specs
- `hoverAndGetTooltip()` -- used in 16 specs
- `clickDownloadButton()` -- used in 15 specs
- `getInterpretationContent()` -- used in 15 specs
- `openDefaultApp()` -- used in 15 specs
- `clickMaximizeButton()` -- used in 14 specs
- `clickCopyButton()` -- used in 13 specs
- `getMySnapshotsPanel()` -- used in 13 specs
- `goToLibrary()` -- used in 13 specs
- `setSnapshotTimeForAll()` -- used in 12 specs
- `showInterpretationContent()` -- used in 12 specs
- `clickCloseButton()` -- used in 11 specs
- `getSnapshotCategoryAreaByName()` -- used in 10 specs
- `getToastbyMessage()` -- used in 10 specs
- `hoverNthChatAnswerFromEndtoAddSnapshot()` -- used in 10 specs
- `getSnapshotNames()` -- used in 9 specs
- `clickDeleteButton()` -- used in 8 specs
- `confirmDelete()` -- used in 8 specs
- `esc()` -- used in 8 specs
- `getSnapshotDialog()` -- used in 8 specs
- `getThumbdownIcon()` -- used in 8 specs
- `setLanguage()` -- used in 8 specs
- `getLearningIndicator()` -- used in 7 specs
- `getNumberOfDisplayedSnapshotCard()` -- used in 7 specs
- `getEmptySnapshotPanel()` -- used in 6 specs
- `getNthParagraphOfTextAnswerFromEnd()` -- used in 6 specs
- `toBeFalse()` -- used in 6 specs
- `clickLearningIndicator()` -- used in 5 specs
- `clickMoveButton()` -- used in 5 specs
- `clickRunInBackgroundButton()` -- used in 5 specs
- `clickSeeMoreButton()` -- used in 5 specs
- `getFullWidthContainer()` -- used in 5 specs
- `getNotificationSection()` -- used in 5 specs
- `getSortButton()` -- used in 5 specs
- `isLearningIndicatorDisplayed()` -- used in 5 specs
- `openSidebarOnly()` -- used in 5 specs
- `renameCategory()` -- used in 5 specs
- `waitForAllNotificationShown()` -- used in 5 specs
- `clickInterpretationButton()` -- used in 4 specs
- `clickSortButton()` -- used in 4 specs
- `getCopyButton()` -- used in 4 specs
- `getDeleteButton()` -- used in 4 specs
- `getDownloadButton()` -- used in 4 specs
- `getInterpretationButton()` -- used in 4 specs
- `getSnapshotCardInsideByText()` -- used in 4 specs
- `getSortContent()` -- used in 4 specs
- `isRunInBackgroundButtonDisplayed()` -- used in 4 specs
- `openDossierNoWait()` -- used in 4 specs
- `selectSortOption(option)` -- used in 4 specs
- `setInterpretationText()` -- used in 4 specs
- `clickLongContentButton()` -- used in 3 specs
- `copySnapshotTitle()` -- used in 3 specs
- `getChatAnswerByText()` -- used in 3 specs
- `getInputBox()` -- used in 3 specs
- `getInterpretationContentText()` -- used in 3 specs
- `getInterpretationNuggets()` -- used in 3 specs
- `getLearningTooltip()` -- used in 3 specs
- `getPinButton()` -- used in 3 specs
- `getUnreadIcon()` -- used in 3 specs
- `openDossierById()` -- used in 3 specs
- `openSnapshotsSectionList()` -- used in 3 specs
- `setSavedTime()` -- used in 3 specs
- `at()` -- used in 2 specs
- `checkIfCopyScreenshotButtonExisting()` -- used in 2 specs
- `checkIfDownloadButtonExisting()` -- used in 2 specs
- `clickBackToChatPanel()` -- used in 2 specs
- `clickCloseSnapshotAddedButton()` -- used in 2 specs
- `clickCollapseButton()` -- used in 2 specs
- `clickMobileHamburgerButton()` -- used in 2 specs
- `clickPinButton()` -- used in 2 specs
- `clickSeeLessButton()` -- used in 2 specs
- `clickThreeDotsButton()` -- used in 2 specs
- `closeInterpretationButton()` -- used in 2 specs
- `filterByContent(items, apply = true, clearAll = true)` -- used in 2 specs
- `filterByContentType(items, apply = true, clearAll = true)` -- used in 2 specs
- `filterByProject(items, apply = true, clearAll = true)` -- used in 2 specs
- `getAttribute()` -- used in 2 specs
- `getCategoryMenu()` -- used in 2 specs
- `getConfirmDeleteDialog()` -- used in 2 specs
- `getMaximizeButton()` -- used in 2 specs
- `getMoveButton()` -- used in 2 specs
- `getMoveDialog()` -- used in 2 specs
- `getSavedTime()` -- used in 2 specs
- `getSearchInput()` -- used in 2 specs
- `getSnapshotPanelHeader()` -- used in 2 specs
- `hoverNthChatAnswerFromEndtoClickThumbdown()` -- used in 2 specs
- `hoverOnSnapshotStatusIcon(name)` -- used in 2 specs
- `isSnapshotsSectionPresent()` -- used in 2 specs
- `isThumbdownIconDisplayed()` -- used in 2 specs
- `openMobileViewSnapshotPanel()` -- used in 2 specs
- `openReportByUrl()` -- used in 2 specs
- `renameSnapshotTitle()` -- used in 2 specs
- `selectMoveToCategory()` -- used in 2 specs
- `tooltip()` -- used in 2 specs
- `addSnapshotToFavorites(name)` -- used in 1 specs
- `checkIfSnapshotButtonExisting()` -- used in 1 specs
- `clickAskAgainButton()` -- used in 1 specs
- `clickClearSnapshots()` -- used in 1 specs
- `clickConfirmClearSnapshotsButton()` -- used in 1 specs
- `clickEditButton()` -- used in 1 specs
- `clickMoreButton()` -- used in 1 specs
- `clickRecommendationByIndex()` -- used in 1 specs
- `clickSnapshotOperations()` -- used in 1 specs
- `ClickUnpinNthChatAnswerFromEnd()` -- used in 1 specs
- `clickViewDetailsButton()` -- used in 1 specs
- `closeSnapshotsPanel()` -- used in 1 specs
- `createBotWithDataset()` -- used in 1 specs
- `currentSortStatus()` -- used in 1 specs
- `deleteSnapshotByName(name, confirmDelete = true)` -- used in 1 specs
- `getBubbleLoadingIcon()` -- used in 1 specs
- `getCategoryCount()` -- used in 1 specs
- `getClearSnapshotsController()` -- used in 1 specs
- `getDotInSnapshotPanelButton()` -- used in 1 specs
- `getElement()` -- used in 1 specs
- `getErrorMessageDialog()` -- used in 1 specs
- `getInputBoxText()` -- used in 1 specs
- `getInterpretationComponents()` -- used in 1 specs
- `getInterpretationContentTitle()` -- used in 1 specs
- `getMarkDownByIndex()` -- used in 1 specs
- `getMessageContainerInSnapshotBannerText()` -- used in 1 specs
- `getNotificationCount()` -- used in 1 specs
- `getOpenSnapshotPanelButton()` -- used in 1 specs
- `getPinButtonOfNthChatAnswer()` -- used in 1 specs
- `getRecommendationByIndex()` -- used in 1 specs
- `getSnapshotContent()` -- used in 1 specs
- `getSnapshotOperations()` -- used in 1 specs
- `getSnapshotStatuses()` -- used in 1 specs
- `getSnapshotTitle()` -- used in 1 specs
- `getSnapshotUnreadStatusByName(name)` -- used in 1 specs
- `getUnpinButtonOfNthChatAnswer()` -- used in 1 specs
- `hoverSnapshotOperations()` -- used in 1 specs
- `isFavoriteButtonDisplayed(name)` -- used in 1 specs
- `isFilterIconDisplayed()` -- used in 1 specs
- `isInterpretationComponentDisplayed()` -- used in 1 specs
- `isSortDisplayed()` -- used in 1 specs
- `logout()` -- used in 1 specs
- `openReadyNotificationByName()` -- used in 1 specs
- `openSnapshotByName(name, waitForLoading = false)` -- used in 1 specs
- `removeSnapshotFromFavorites(name)` -- used in 1 specs
- `renameSnapshotByName(currentName, newName)` -- used in 1 specs
- `run()` -- used in 1 specs
- `selectSortOrder(order)` -- used in 1 specs
- `sleep()` -- used in 1 specs
- `title()` -- used in 1 specs
- `toBeTrue()` -- used in 1 specs
- `toggleTopicSwitch()` -- used in 1 specs
- `waitForAnswerLoading()` -- used in 1 specs
- `waitForDossierLoading()` -- used in 1 specs
- `waitForEditor()` -- used in 1 specs
- `waitForElementInvisible()` -- used in 1 specs
- `addMultipleSnapshotsToFavorites(snapshotsGrid, snapshotNames)` -- used in 0 specs
- `addSnapshotToFavoritesByIndex(index)` -- used in 0 specs
- `clearAllFilters()` -- used in 0 specs
- `composeFilter(updateFn, apply = false)` -- used in 0 specs
- `currentSortOption()` -- used in 0 specs
- `currentSortOrder()` -- used in 0 specs
- `deleteMultipleSnapshotsByNames(snapshotsGrid, snapshotNames, confirmDelete = true)` -- used in 0 specs
- `deleteSnapshotByIndex(index, confirmDelete = true)` -- used in 0 specs
- `ensureFilterPanelOpen()` -- used in 0 specs
- `expandCollapseSnapshotsGroup(snapshotsGrid)` -- used in 0 specs
- `filterBy({ filterType, items, apply = true, clearAll = true })` -- used in 0 specs
- `getErrorTooltipText()` -- used in 0 specs
- `getFavoritesCount()` -- used in 0 specs
- `getFavoritesGroup()` -- used in 0 specs
- `getFavoritesGroupTitleText()` -- used in 0 specs
- `getGroupRow()` -- used in 0 specs
- `getGroupTitleText(group)` -- used in 0 specs
- `getSnapshotContentByName(name)` -- used in 0 specs
- `getSnapShotContentByName(name)` -- used in 0 specs
- `getSnapshotContentTypes()` -- used in 0 specs
- `getSnapshotDates()` -- used in 0 specs
- `getSnapShotErrorMsgByName(name)` -- used in 0 specs
- `getSnapShotErrorMsgByName(snapshotsGrid, name)` -- used in 0 specs
- `getSnapshotItemByName(name)` -- used in 0 specs
- `getSnapshotNamesByStatus(status)` -- used in 0 specs
- `getSnapshotRowByName(name)` -- used in 0 specs
- `getSnapshotsCount(section = 'Snapshots')` -- used in 0 specs
- `getSnapshotsGroup()` -- used in 0 specs
- `getSnapshotsGroupTitleText()` -- used in 0 specs
- `getSnapshotStatusByName(name)` -- used in 0 specs
- `getSnapShotStatusByName(name)` -- used in 0 specs
- `getSnapshotTypeByName(name)` -- used in 0 specs
- `getSnapshotWithErrorStatus()` -- used in 0 specs
- `getSnapshotWithRunningStatus()` -- used in 0 specs
- `hasSnapshotWithStatus(status)` -- used in 0 specs
- `hasUnreadIndicator(rowIndex)` -- used in 0 specs
- `hasUnreadIndicatorByName(name)` -- used in 0 specs
- `hoverOnErrorStatus()` -- used in 0 specs
- `hoverOnErrorStatus(snapshotsGrid)` -- used in 0 specs
- `hoverOnSnapshotByName(name)` -- used in 0 specs
- `isGridEmpty()` -- used in 0 specs
- `isSnapshotInFavorites(name)` -- used in 0 specs
- `isSnapshotOrderedByCreationTimeDesc()` -- used in 0 specs
- `isSnapshotVisible(snapshotName)` -- used in 0 specs
- `isSortMenuOpen()` -- used in 0 specs
- `openFilterDetailPanel(type)` -- used in 0 specs
- `openSnapshotByIndex(index, waitForLoading = false)` -- used in 0 specs
- `openSortMenu()` -- used in 0 specs
- `refreshSnapshotsGrid()` -- used in 0 specs
- `selectMultipleSnapshotsByIndices(indices)` -- used in 0 specs
- `selectMultipleSnapshotsByNames(snapshotNames)` -- used in 0 specs
- `selectSnapshotByIndex(index)` -- used in 0 specs
- `selectSnapshotByName(name)` -- used in 0 specs
- `updateSort(func, option)` -- used in 0 specs
- `verifySnapshotDetails(index, expectedName, expectedContentType, expectedStatus)` -- used in 0 specs
- `waitForSnapshotStatusChange(snapshotsGrid, name, expectedStatus, timeoutMs = 30000)` -- used in 0 specs
- `waitForSnapshotToAppear(snapshotsGrid, name, timeoutMs = 10000)` -- used in 0 specs
- `waitForSnapshotToDisappear(snapshotsGrid, name, timeoutMs = 10000)` -- used in 0 specs

## Source Coverage

- `pageObjects/snapshots/**/*.js`
- `specs/regression/config/snapshots/**/*.{ts,js}`
- `specs/regression/snapshot/snapshots/**/*.{ts,js}`
- `specs/regression/aibotSnapshotsPanel/**/*.{ts,js}`
- `specs/regression/aibotSnapshotsPanel/data_backup/**/*.{ts,js}`
