# Site Knowledge: Group Domain

## Overview

- **Domain key:** `group`
- **Components covered:** Group, Sidebar
- **Spec files scanned:** 11
- **POM files scanned:** 2

## Components

### Group
- **CSS root:** `.mstrd-MultiSelectionToolbar`
- **User-visible elements:**
  - Group Bar (`.mstrd-MultiSelectionToolbar`)
  - Group Bar Secondary Menu (`.ant-dropdown-menu-submenu-popup`)
  - Group Dialog (`.ant-modal-content`)
- **Component actions:**
  - `clickGroupBarActionBtn()`
  - `clickGroupBarDoneBtn()`
  - `clickGroupBarSelectAllBtn()`
  - `clickGroupCancelBtn()`
  - `clickGroupSaveBtn()`
  - `clickGroupSaveBtnNoWait()`
  - `getGroupBarSelectionCount()`
  - `hoverGroupBarContextMenu(item)`
  - `inputGroupName(name)`
  - `isColorFocused(color)`
  - `isGroupBarActionBtnPresent()`
  - `isGroupBarPresent()`
  - `isGroupColorPresent(color)`
  - `isGroupColorSelected(color)`
  - `isGroupDialoguePresent()`
  - `isGroupNameInputFocused()`
  - `isSaveButtonFocused()`
  - `selectGroupBarContextMenu(item1, item2 = '')`
  - `selectGroupColor(color)`
- **Related components:** _none_

### Sidebar
- **CSS root:** `.mstrd-SidebarContainer`
- **User-visible elements:**
  - All Toggle Button (`.mstrd-AllMenuSection-toggleButton`)
  - Default Groups (`.mstrd-GroupMenuSection-titleText`)
  - Delete Confirmation (`.mstrd-ConfirmationDialog`)
  - Group Collapse Button (`.mstrd-GroupMenuSection-toggleButton`)
  - Mobile Sidebar Container (`.mstrd-SidebarContainer-content`)
  - Predefined Menu Section (`.mstrd-PredefinedMenuSection`)
  - Sidebar Container (`.mstrd-SidebarContainer`)
  - Snapshots Icon (`.icon-mstrd_snapshots`)
  - Subscription Loading Icon (`.mstrd-SubscriptionLoadingStatus`)
- **Component actions:**
  - `cancelDelete()`
  - `clickAddGroupBtn()`
  - `clickAllSection(hasSubmenu = false)`
  - `clickAllSubSection(text)`
  - `clickAnalysisSection()`
  - `clickBotSecion()`
  - `clickGroupCollapseButton()`
  - `clickGroupOptions(name)`
  - `clickPredefinedSection(item)`
  - `confirmDelete()`
  - `deleteGroup()`
  - `dragSidebarWidth(offset)`
  - `expandAllSection()`
  - `getDefaultGroupsTitle()`
  - `getGrayedSectionNames()`
  - `getGroupColor(name)`
  - `getGroupCount()`
  - `getPredefinedSectionItemsCount()`
  - `getPredefinedSectionItemsTexts()`
  - `getSelectedSectionName()`
  - `hoverOnContentBundleTitle()`
  - `isAddGroupBtnForSaaSDisplayed()`
  - `isAddGroupBtnForSaaSHidden()`
  - `isAllExpanded()`
  - `isAllSectionSelected()`
  - `isAllSubsectionVisible(text)`
  - `isBookmarksSectionPresent()`
  - `isDataSectionPresent()`
  - `isGroupClickable(name)`
  - `isGroupEmpty()`
  - `isGroupExisted(name)`
  - `isPredefinedSectionItemPresent(item)`
  - `isSnapshotsSectionPresent()`
  - `openAllSectionList(hasSubmenu = false)`
  - `openBookmarkSectionList()`
  - `openContentDiscovery(locale = 'en')`
  - `openDataSection(name = 'Data')`
  - `openFavoriteSectionList()`
  - `openGroupSection(name)`
  - `openInsightsList()`
  - `openMyContentSectionList()`
  - `openRecentsSectionList()`
  - `openSnapshotsSectionList()`
  - `openSubscriptions()`
  - `selectGroupDeleteOption()`
  - `selectGroupEditOption()`
  - `sidebarWidth()`
  - `waitForSubscriptionLoading()`
- **Related components:** getSidebarContainer, getTooltipContainer

## Common Workflows (from spec.ts)

1. [TC70842] Group - Sidebar - Add group (used in 1 specs)
2. [TC70845] Group - Context Menu - Open dossier (used in 1 specs)
3. [TC72230] Group - Sidebar - Edit group (used in 1 specs)
4. [TC72231] Group - Sidebar - Different group names (used in 1 specs)
5. [TC72232] Group - Sidebar - Delete group (used in 1 specs)
6. [TC72233] Group - Context Menu - New group (used in 1 specs)
7. [TC72234] Group - Context Menu - Remove from group (used in 1 specs)
8. [TC72235] Group - Context Menu - Move to group (used in 1 specs)
9. [TC72236] Group - Multi-select mode - New group for multiple dossiers (used in 1 specs)
10. [TC72237] Group - Multi-select mode - Remove from group for multiple dossiers (used in 1 specs)
11. [TC72238] Group - Multi-select mode - Move to group for multiple dossiers (used in 1 specs)
12. [TC72239] Group - Multi-select mode - Select all and New group from multi selection bar (used in 1 specs)
13. [TC72240] Group - Multi-select mode - Move to group from multi selection bar (used in 1 specs)
14. [TC72241] Group - Multi-select mode - Add to group when there is no group (used in 1 specs)
15. [TC72242] Group - Multi-select mode - Multi-select state when switch sidebar section (used in 1 specs)
16. [TC72244] Group - XFunc - Sidebar x-func with infowindow (used in 1 specs)
17. [TC72245] Group - XFunc - Multi-select mode x-func with search and account menu (used in 1 specs)
18. [TC75090] Validate X-Func of Content Group on Library home page - sort/filter (used in 1 specs)
19. [TC78928] Validate group & favorites list should always exists due to any exception (used in 1 specs)
20. [TC81426] Validate Content Group with empty content (used in 1 specs)
21. [TC81427] Validate Content Group with same content in different Groups (used in 1 specs)
22. [TC81428] Validate Content Group with content rename in user library before (used in 1 specs)
23. [TC81429] Validate Content Group with added by user group (used in 1 specs)
24. [TC81430] Validate Content Group with more than one user (used in 1 specs)
25. [TC81432] Validate Content Group update in name/color/content (used in 1 specs)
26. [TC81433] Validate Content Group update in user (used in 1 specs)
27. [TC81434] Validate Content in Content Group with different view (used in 1 specs)
28. [TC81435] Validate Content Management in Content Group from info-window(home and search) (used in 1 specs)
29. [TC81436] Validate Content Management in Content Group from Manage my library (used in 1 specs)
30. [TC81437] Validate Content context menu in Content Group with single select mode in different tab (used in 1 specs)
31. [TC81438] Validate Content context menu in Content Group with multi select mode in different tab (used in 1 specs)
32. [TC81590] Validate Content Group with content from different project (used in 1 specs)
33. [TC81602] Validate Content Group with special content group name and color (used in 1 specs)
34. [TC81868] Validate Content Group with empty error message (used in 1 specs)
35. [TC81869] Validate Content Group with not exist error message (used in 1 specs)
36. [TC81939] Validate X-Func of Content Group on Library info window (used in 1 specs)
37. [TC81940_01] Validate X-Func of Content Group on Library Context menu (used in 1 specs)
38. [TC81940_02] Validate X-Func of Content Group on Library Context menu (used in 1 specs)
39. [TC81940_03] Validate X-Func of Content Group on Library Context menu (used in 1 specs)
40. [TC81941] Validate X-Func of Content Group on Library Shared Link (used in 1 specs)
41. [TC81942] Validate X-Func of Content Group on Library Search (used in 1 specs)
42. [TC84375] Group - Multi-select mode - Dossier belonged group will not appear in move to group list (used in 1 specs)
43. [TC85341] Validate group and favorites on Report in Library Web (used in 1 specs)
44. [TC88707] Verify report in content group can be viewed/manipulated on recipients library home (used in 1 specs)
45. [TC99449_01] F43390 Copy from Auto to Auto (used in 1 specs)
46. [TC99449_02] F43390 Copy from Auto to Freeform (used in 1 specs)
47. [TC99449_03] F43390 Copy from Freeform to Auto (used in 1 specs)
48. [TC99449_04] F43390 Copy from Freeform to Freeform (used in 1 specs)
49. [TC99449_05] F43390 Check the copied containers in Consumption mode (used in 1 specs)
50. [TC99450_01] F43390 Copy from Auto to NewPage/NewChapter/OtherPage (used in 1 specs)
51. [TC99450_02] F43390 Copy from Freeform to NewPage/NewChapter/OtherPage (used in 1 specs)
52. [TC99450_03] Invalid multi-selections copy (used in 1 specs)
53. [TC99454_01] F43366 Resize a group of containers in authoring mode (used in 1 specs)
54. [TC99454_02] F43366 Check the resized groups in Consumption mode (used in 1 specs)
55. ContentGroupBasicInfo (used in 1 specs)
56. ContentGroupErrorMessage (used in 1 specs)
57. ContentGroupManipulation (used in 1 specs)
58. ContentGroupStatusSync (used in 1 specs)
59. ContentGroupX-Func (used in 1 specs)
60. F43366 Resize Group E2E workflow (used in 1 specs)
61. F43390 Copy Group E2E workflow (used in 1 specs)
62. F43390 Copy Group workflow (used in 1 specs)
63. Group General (used in 1 specs)
64. Group Multi-Select (used in 1 specs)
65. Group X-Func (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getGroupCountFromTitle -- frequency: 48
2. getDossierView -- frequency: 41
3. getDossierContextMenuItem -- frequency: 22
4. getDossierContextMenu -- frequency: 13
5. getGroupColor -- frequency: 11
6. getEmptyLibrary -- frequency: 7
7. getEmptyLibraryMessage -- frequency: 7
8. getFavoritesCountFromTitle -- frequency: 4
9. getSidebarContainer -- frequency: 4
10. getGroupBarSelectionCount -- frequency: 3
11. getGroupCount -- frequency: 3
12. getGroupDialog -- frequency: 3
13. getMyLibraryCount -- frequency: 3
14. getDossierListContainerHeight -- frequency: 2
15. getGroupError -- frequency: 2
16. All Toggle Button -- frequency: 1
17. Default Groups -- frequency: 1
18. Delete Confirmation -- frequency: 1
19. getDeleteConfirmation -- frequency: 1
20. getDossierImageContainer -- frequency: 1
21. getGroupBar -- frequency: 1
22. getRsdGridByKey -- frequency: 1
23. getShareDossierDialog -- frequency: 1
24. getTooltipbyMessage -- frequency: 1
25. Group Bar -- frequency: 1
26. Group Bar Secondary Menu -- frequency: 1
27. Group Collapse Button -- frequency: 1
28. Group Dialog -- frequency: 1
29. Mobile Sidebar Container -- frequency: 1
30. Predefined Menu Section -- frequency: 1
31. Sidebar Container -- frequency: 1
32. Snapshots Icon -- frequency: 1
33. Subscription Loading Icon -- frequency: 1

## Key Actions

- `openAllSectionList(hasSubmenu = false)` -- used in 74 specs
- `isGroupExisted(name)` -- used in 55 specs
- `openGroupSection(name)` -- used in 51 specs
- `getGroupCountFromTitle()` -- used in 48 specs
- `getDossierView()` -- used in 41 specs
- `openDossierContextMenu()` -- used in 39 specs
- `clickDossierContextMenuItem()` -- used in 33 specs
- `pause()` -- used in 33 specs
- `selectDossier()` -- used in 27 specs
- `isDisplayed()` -- used in 23 specs
- `openSidebarOnly()` -- used in 23 specs
- `getDossierContextMenuItem()` -- used in 22 specs
- `resizeGroup()` -- used in 20 specs
- `actionOnToolbar()` -- used in 19 specs
- `clickMultiSelectBtn()` -- used in 18 specs
- `isItemViewable()` -- used in 18 specs
- `openSidebar()` -- used in 17 specs
- `refresh()` -- used in 17 specs
- `goToLibrary()` -- used in 15 specs
- `goToPage()` -- used in 14 specs
- `isLibraryEmpty()` -- used in 14 specs
- `getDossierContextMenu()` -- used in 13 specs
- `login()` -- used in 13 specs
- `openDossierByUrl()` -- used in 13 specs
- `toString()` -- used in 13 specs
- `multiSelectContainersFromCanvas()` -- used in 12 specs
- `selectSecondaryContextMenuOption()` -- used in 12 specs
- `closeSidebar()` -- used in 11 specs
- `getGroupColor(name)` -- used in 11 specs
- `inputGroupName(name)` -- used in 11 specs
- `multiSelectContainers()` -- used in 11 specs
- `openAndTakeContextMenuByRMC()` -- used in 11 specs
- `clickGroupSaveBtn()` -- used in 10 specs
- `isGroupColorSelected(color)` -- used in 10 specs
- `openDossierInfoWindow()` -- used in 10 specs
- `isGroupBarPresent()` -- used in 9 specs
- `openUserAccountMenu()` -- used in 9 specs
- `isMultiSelectBtnActive()` -- used in 8 specs
- `url()` -- used in 8 specs
- `waitForDossierLoading()` -- used in 8 specs
- `clickAccountOption()` -- used in 7 specs
- `closeManageMyLibrary()` -- used in 7 specs
- `getEmptyLibrary()` -- used in 7 specs
- `getEmptyLibraryMessage()` -- used in 7 specs
- `getUrl()` -- used in 7 specs
- `isRemovePresent()` -- used in 7 specs
- `moveDossierIntoViewPort()` -- used in 7 specs
- `openDossier()` -- used in 7 specs
- `waitForLibraryLoading()` -- used in 7 specs
- `clickBtnOnMojoEditor()` -- used in 6 specs
- `close()` -- used in 6 specs
- `customCredentials()` -- used in 6 specs
- `waitForItemLoading()` -- used in 6 specs
- `actionOnMenubarWithSubmenu()` -- used in 5 specs
- `hoverDossier()` -- used in 5 specs
- `inputTextAndSearch()` -- used in 5 specs
- `isEditorOpen()` -- used in 5 specs
- `isSelectAllEnabled()` -- used in 5 specs
- `isTooltipDisplayed()` -- used in 5 specs
- `openPageFromTocMenu()` -- used in 5 specs
- `openSearchSlider()` -- used in 5 specs
- `resetDossierIfPossible()` -- used in 5 specs
- `run()` -- used in 5 specs
- `saveInMyReport()` -- used in 5 specs
- `backToLibrary()` -- used in 4 specs
- `clickGroupCollapseButton()` -- used in 4 specs
- `clickMyLibraryTab()` -- used in 4 specs
- `firstElmOfHeader()` -- used in 4 specs
- `getFavoritesCountFromTitle()` -- used in 4 specs
- `getSidebarContainer()` -- used in 4 specs
- `isGroupBarActionBtnPresent()` -- used in 4 specs
- `isGroupClickable(name)` -- used in 4 specs
- `openSortMenu()` -- used in 4 specs
- `reload()` -- used in 4 specs
- `selectGroupColor(color)` -- used in 4 specs
- `selectSortOption()` -- used in 4 specs
- `clickGroupBarActionBtn()` -- used in 3 specs
- `clickGroupBarSelectAllBtn()` -- used in 3 specs
- `clickGroupOptions(name)` -- used in 3 specs
- `doubleClickContainer()` -- used in 3 specs
- `getGroupBarSelectionCount()` -- used in 3 specs
- `getGroupCount()` -- used in 3 specs
- `getGroupDialog()` -- used in 3 specs
- `getMyLibraryCount()` -- used in 3 specs
- `isAddToLibraryDisplayed()` -- used in 3 specs
- `isGroupDialoguePresent()` -- used in 3 specs
- `isSecondaryContextMenuItemExisted()` -- used in 3 specs
- `log()` -- used in 3 specs
- `push()` -- used in 3 specs
- `resizeContainer()` -- used in 3 specs
- `checkFilterType()` -- used in 2 specs
- `clickAddGroupBtn()` -- used in 2 specs
- `clickAddToLibraryButton()` -- used in 2 specs
- `clickApplyButton()` -- used in 2 specs
- `clickFilterIcon()` -- used in 2 specs
- `editName()` -- used in 2 specs
- `getDossierListContainerHeight()` -- used in 2 specs
- `getGroupError()` -- used in 2 specs
- `GroupContextMenuAction()` -- used in 2 specs
- `isDossierContextMenuItemExisted()` -- used in 2 specs
- `isFavoritesBtnSelected()` -- used in 2 specs
- `logout()` -- used in 2 specs
- `multiSelectContainerAndTakeCMOption()` -- used in 2 specs
- `openInfoWindow()` -- used in 2 specs
- `selectGroupDeleteOption()` -- used in 2 specs
- `shareDossier()` -- used in 2 specs
- `sleep()` -- used in 2 specs
- `cancelDelete()` -- used in 1 specs
- `clickDossierSecondaryMenuItem()` -- used in 1 specs
- `clickFilterClearAll()` -- used in 1 specs
- `clickGroupCancelBtn()` -- used in 1 specs
- `clickOnAutoCanvasButton()` -- used in 1 specs
- `clickOnContainerFromLayersPanel()` -- used in 1 specs
- `confirmDelete()` -- used in 1 specs
- `confirmRemoval()` -- used in 1 specs
- `confirmRemove()` -- used in 1 specs
- `favoriteByImageIcon()` -- used in 1 specs
- `favoriteDossier()` -- used in 1 specs
- `getDeleteConfirmation()` -- used in 1 specs
- `getDossierImageContainer()` -- used in 1 specs
- `getGroupBar()` -- used in 1 specs
- `getRsdGridByKey()` -- used in 1 specs
- `getShareDossierDialog()` -- used in 1 specs
- `getTooltipbyMessage()` -- used in 1 specs
- `hitRemoveButton()` -- used in 1 specs
- `isClearAllEnabled()` -- used in 1 specs
- `isFavoritesPresent()` -- used in 1 specs
- `isGroupEmpty()` -- used in 1 specs
- `isItemSelected()` -- used in 1 specs
- `isNavigationBarPresent()` -- used in 1 specs
- `isRemoveButtonEnabled()` -- used in 1 specs
- `isResetDisabled()` -- used in 1 specs
- `isShareButtonEnabled()` -- used in 1 specs
- `openContextMenuByRMC()` -- used in 1 specs
- `openFilterDetailPanel()` -- used in 1 specs
- `openFilterTypeDropdown()` -- used in 1 specs
- `pageTitle()` -- used in 1 specs
- `removeFavorite()` -- used in 1 specs
- `removeFavoriteByImageIcon()` -- used in 1 specs
- `removeFavoriteDossier()` -- used in 1 specs
- `searchRecipient()` -- used in 1 specs
- `selectCellInOneRow()` -- used in 1 specs
- `selectGroupBarContextMenu(item1, item2 = '')` -- used in 1 specs
- `selectGroupEditOption()` -- used in 1 specs
- `selectItem()` -- used in 1 specs
- `selectRecipients()` -- used in 1 specs
- `selectRemove()` -- used in 1 specs
- `title()` -- used in 1 specs
- `clickAllSection(hasSubmenu = false)` -- used in 0 specs
- `clickAllSubSection(text)` -- used in 0 specs
- `clickAnalysisSection()` -- used in 0 specs
- `clickBotSecion()` -- used in 0 specs
- `clickGroupBarDoneBtn()` -- used in 0 specs
- `clickGroupSaveBtnNoWait()` -- used in 0 specs
- `clickPredefinedSection(item)` -- used in 0 specs
- `deleteGroup()` -- used in 0 specs
- `dragSidebarWidth(offset)` -- used in 0 specs
- `expandAllSection()` -- used in 0 specs
- `getDefaultGroupsTitle()` -- used in 0 specs
- `getGrayedSectionNames()` -- used in 0 specs
- `getPredefinedSectionItemsCount()` -- used in 0 specs
- `getPredefinedSectionItemsTexts()` -- used in 0 specs
- `getSelectedSectionName()` -- used in 0 specs
- `hoverGroupBarContextMenu(item)` -- used in 0 specs
- `hoverOnContentBundleTitle()` -- used in 0 specs
- `isAddGroupBtnForSaaSDisplayed()` -- used in 0 specs
- `isAddGroupBtnForSaaSHidden()` -- used in 0 specs
- `isAllExpanded()` -- used in 0 specs
- `isAllSectionSelected()` -- used in 0 specs
- `isAllSubsectionVisible(text)` -- used in 0 specs
- `isBookmarksSectionPresent()` -- used in 0 specs
- `isColorFocused(color)` -- used in 0 specs
- `isDataSectionPresent()` -- used in 0 specs
- `isGroupColorPresent(color)` -- used in 0 specs
- `isGroupNameInputFocused()` -- used in 0 specs
- `isPredefinedSectionItemPresent(item)` -- used in 0 specs
- `isSaveButtonFocused()` -- used in 0 specs
- `isSnapshotsSectionPresent()` -- used in 0 specs
- `openBookmarkSectionList()` -- used in 0 specs
- `openContentDiscovery(locale = 'en')` -- used in 0 specs
- `openDataSection(name = 'Data')` -- used in 0 specs
- `openFavoriteSectionList()` -- used in 0 specs
- `openInsightsList()` -- used in 0 specs
- `openMyContentSectionList()` -- used in 0 specs
- `openRecentsSectionList()` -- used in 0 specs
- `openSnapshotsSectionList()` -- used in 0 specs
- `openSubscriptions()` -- used in 0 specs
- `sidebarWidth()` -- used in 0 specs
- `waitForSubscriptionLoading()` -- used in 0 specs

## Source Coverage

- `pageObjects/group/**/*.js`
- `specs/regression/contentGroup/**/*.{ts,js}`
- `specs/regression/dashboardAuthoring/copyGroup/**/*.{ts,js}`
- `specs/regression/dashboardAuthoring/resizeGroup/**/*.{ts,js}`
- `specs/regression/personalGroup/**/*.{ts,js}`
