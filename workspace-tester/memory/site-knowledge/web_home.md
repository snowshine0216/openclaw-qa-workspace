# Site Knowledge: Web Home Domain

## Overview

- **Domain key:** `web_home`
- **Components covered:** CustomGroupDialog, ExplorerDialog, FolderTreeView, HistoryList, LeftToolbar, ListView, MenuCreate, MetricDialog, MsgBox, MSTRLogoMenu, NewFolderEditor, PrimarySearch, RecentsPanel, RightFolderPanel, ShareDialog
- **Spec files scanned:** 0
- **POM files scanned:** 15

## Components

### CustomGroupDialog
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `close()`
  - `waitDialogShown()`
- **Related components:** _none_

### ExplorerDialog
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `confirm()`
  - `inputName(name)`
  - `navigateTo(paths)`
  - `waitExplorDialogShwon()`
- **Related components:** _none_

### FolderTreeView
- **CSS root:** `#tree_ftb_FolderTreeView`
- **User-visible elements:**
  - Folder Tree View (`#tree_ftb_FolderTreeView`)
  - Tree Loding Icon (`#divTreeWait`)
  - Wait Curtain (`#mstrWeb_waitCurtain`)
- **Component actions:**
  - `clickItemByText(text)`
  - `collapseByPath(paths)`
  - `expandItem(treeItem)`
  - `expandOrCollapseByPath(paths, isExpand = true)`
  - `isItemShownByText(text)`
  - `open(paths, isExpand = true)`
  - `waitTreeLoading(timeout = 10)`
- **Related components:** _none_

### HistoryList
- **CSS root:** `.mstrContextMenuRight`
- **User-visible elements:**
  - Context Menu (`.mstrContextMenuRight`)
- **Component actions:**
  - `isContextMenuPresent()`
  - `isObjectInHistoryListPresent(name)`
  - `OpenObjectContextMenuInHistoryList(name)`
  - `openObjectInHistoryList(name)`
- **Related components:** _none_

### LeftToolbar
- **CSS root:** `.mstrMenuItemhistory`
- **User-visible elements:**
  - History List Button (`.mstrMenuItemhistory`)
  - Icon View (`#tbLargeIcons`)
  - Launch Library Icon (`.mstrMenuItemNLinkTodossierLibrary`)
  - List View (`#tbListView`)
  - My Reports Button (`.mstrMenuItemprofile.mstrMenuItem`)
  - My Subscription Button (`.mstrMenuItemsubscriptions .mstrLink`)
  - Recents Button (`#mstrRecentObjects`)
  - Recents Popup (`.mstrmojo-Popup.mstrShortcutsListPopup`)
- **Component actions:**
  - `isCreatePresent()`
  - `isIconViewPresent()`
  - `isLaunchLibraryIconPresent()`
  - `isListViewPresent()`
  - `isMyReportsButtonPresent()`
  - `isMySubscriptionButtonPresent()`
  - `launchLibrary()`
  - `openHistoryListPanel()`
  - `openRecentsPanel()`
  - `openSubscriptionPanel()`
  - `uploadMstrFile(path)`
- **Related components:** _none_

### ListView
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - _none_
- **Related components:** _none_

### MenuCreate
- **CSS root:** `#mscld-create-menuList`
- **User-visible elements:**
  - Confirm Dialog (`.mstrmojo-Editor.mstrmojo-alert.modal`)
  - Menu Create (`#mscld-create`)
  - Menu Panel (`#mscld-create-menuList`)
  - Upload Button (`#myFile`)
  - Upload Result Editor (`#uploadResultEditor`)
- **Component actions:**
  - `closeMenuPanel()`
  - `isFileNotEmpty(name)`
  - `isMenuItemDisplay(item)`
  - `openMenu(menuPaths)`
  - `openMenuPanel()`
  - `uploadMstrFile(path)`
  - `waitForUploadComplete()`
- **Related components:** getMenuPanel, openMenuPanel

### MetricDialog
- **CSS root:** `.mstrmojo-WebHoverButton.clear`
- **User-visible elements:**
  - Clear Formula Btn (`.mstrmojo-WebHoverButton.clear`)
  - Formula Editor (`.mstrmojo-TokenInputBox-edit`)
  - Save Btn (`.me-save-button`)
  - Save Disabled Btn (`.me-save-button.disabled`)
- **Component actions:**
  - `close()`
  - `editFormula(newFormula)`
  - `renameMetric(newName)`
  - `save()`
  - `swtichToFormulaEditor()`
  - `waitDialogShown()`
- **Related components:** _none_

### MsgBox
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `confirm()`
  - `getMessageContent()`
  - `waitMsgBoxShown()`
- **Related components:** _none_

### MSTRLogoMenu
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `openMSTRMenu()`
  - `openMSTRMenuRecentsPanel()`
- **Related components:** _none_

### NewFolderEditor
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `confirm()`
  - `getDescriptionText()`
  - `inputDescription(description)`
  - `inputName(name)`
- **Related components:** _none_

### PrimarySearch
- **CSS root:** `.mstrmojo-IncFetch-content`
- **User-visible elements:**
  - In Fetch Groups (`.mstrmojo-IncFetch-content`)
  - Search Entrance Button (`.mstrmojo-SearchButton`)
- **Component actions:**
  - `close()`
  - `closeSuggestionPopup()`
  - `currentFolder()`
  - `currentPageNumber()`
  - `expandOrCollapsePath(name)`
  - `getResultItemByName(name)`
  - `getResultRecordByName(name)`
  - `getResultRowByName(name)`
  - `getShortcutByName(name)`
  - `isResultEmpty()`
  - `isSearchEditorOpen()`
  - `navigateTo(paths)`
  - `open()`
  - `openFolderByName(objectName, folderName)`
  - `openObjectByNameInGridView(name)`
  - `openObjectByNameInIconView(name)`
  - `openShortcutByNameInGridView(name)`
  - `resultCount()`
  - `search(keyword)`
  - `selectedObjectType()`
  - `selectMultiPulldown(el, values)`
  - `selectPulldown(el, value)`
  - `setDate(dateOption, options)`
  - `setDescription(value)`
  - `setFolder(folderName)`
  - `setObjectType(types)`
  - `setOwner(owner)`
  - `setSearchType(type)`
  - `switchPage(el)`
  - `switchPageTo(pageNumber)`
  - `switchPageToFirst()`
  - `switchPageToLast()`
  - `switchPageToNext()`
  - `switchPageToPrevious()`
  - `switchToGridView()`
  - `switchToIconView()`
  - `waitForSearchResults()`
- **Related components:** getCurrentPage, getPage, getResultContainer, getSearchSettingsContainer, switchPage

### RecentsPanel
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickNthObjectOfRecents(index)`
  - `clickRecentObject(name)`
  - `getNthObjectIconClassOfRecents(index)`
  - `getNthObjectNameOfRecents(index)`
  - `isAnyObjectInRecents()`
  - `isRecentsClickable()`
  - `isRecoveryInRecents()`
- **Related components:** _none_

### RightFolderPanel
- **CSS root:** `#folderAllModes_cmm1`
- **User-visible elements:**
  - Right Click Menu (`#folderAllModes_cmm1`)
  - Right Click Secondary Menu (`#folderAllModes_cmm2`)
- **Component actions:**
  - `clickItem(text)`
  - `dragHeaderColumnWidth(headerName, toOffsetParam)`
  - `findDependents(text)`
  - `getFolderItem(itemName)`
  - `getFolderItemNamTextWidth(name)`
  - `getItemDescription(itemName)`
  - `hoverToItem(text)`
  - `isCreateItemDisabled(item)`
  - `isCreateItemPresent(item)`
  - `isItemInRightPanel(itemName)`
  - `isItemsDisplayedAsList()`
  - `isItemWithLargeIcon(text)`
  - `isListView()`
  - `isSendNowDisabled(name)`
  - `isSubscribeDisabled(name)`
  - `openInLibrary(text)`
  - `openMenu(menuPaths)`
  - `openRunAs()`
  - `rightClickItem(text)`
  - `share(text)`
  - `sortFolderBy(sortType)`
- **Related components:** _none_

### ShareDialog
- **CSS root:** `.mstrmojo-CustomACLEditor`
- **User-visible elements:**
  - Custom ACLEditor (`.mstrmojo-CustomACLEditor`)
  - Suggestion Dropdown (`.mstrmojo-suggest-list`)
  - User Browser (`.mstrmojo-UserEditor`)
- **Component actions:**
  - `changeUserACLType(fullName, type)`
  - `chooseChildrenAccess(option)`
  - `closeDialog()`
  - `customizeUserACLType(fullName, condition)`
  - `deleteUser(fullName)`
  - `getCurrentSearchOption()`
  - `getEmbedLink()`
  - `getSharedLibraryLink()`
  - `getSharedLink()`
  - `getSubscriptionIDInSharedLink()`
  - `getSuggestionList(fullName)`
  - `getSuggestionListCount()`
  - `getSuggestionUserTooltip(fullName, index = 0)`
  - `getUserACLTooltip(fullName)`
  - `getUserACLType(fullName)`
  - `hideLibraryLinkUrl()`
  - `hideLinkUrl()`
  - `hideUserList()`
  - `inputUser(fullName)`
  - `isACLEditerDisabled(fullName)`
  - `isBrowseButtonDisabled()`
  - `isDoneButtonDisabled()`
  - `isLibraryLinkSectionPresent()`
  - `isSearchOptionPresent()`
  - `isShareDialogPresent()`
  - `isSuggestionPresent()`
  - `isUserInputboxDisabled()`
  - `isUserPresentForACLList(fullName)`
  - `launchLibrary()`
  - `saveACL()`
  - `selectLibraryLinkSection()`
  - `selectSearchOption(item)`
  - `selectUser(fullName)`
  - `showLibraryLinkUrl()`
  - `showLinkUrl()`
  - `showUserList()`
- **Related components:** _none_

## Common Workflows (from spec.ts)

1. _none_

## Common Elements (from POM + spec.ts)

1. Clear Formula Btn -- frequency: 1
2. Confirm Dialog -- frequency: 1
3. Context Menu -- frequency: 1
4. Custom ACLEditor -- frequency: 1
5. Folder Tree View -- frequency: 1
6. Formula Editor -- frequency: 1
7. History List Button -- frequency: 1
8. Icon View -- frequency: 1
9. In Fetch Groups -- frequency: 1
10. Launch Library Icon -- frequency: 1
11. List View -- frequency: 1
12. Menu Create -- frequency: 1
13. Menu Panel -- frequency: 1
14. My Reports Button -- frequency: 1
15. My Subscription Button -- frequency: 1
16. Recents Button -- frequency: 1
17. Recents Popup -- frequency: 1
18. Right Click Menu -- frequency: 1
19. Right Click Secondary Menu -- frequency: 1
20. Save Btn -- frequency: 1
21. Save Disabled Btn -- frequency: 1
22. Search Entrance Button -- frequency: 1
23. Suggestion Dropdown -- frequency: 1
24. Tree Loding Icon -- frequency: 1
25. Upload Button -- frequency: 1
26. Upload Result Editor -- frequency: 1
27. User Browser -- frequency: 1
28. Wait Curtain -- frequency: 1

## Key Actions

- `changeUserACLType(fullName, type)` -- used in 0 specs
- `chooseChildrenAccess(option)` -- used in 0 specs
- `clickItem(text)` -- used in 0 specs
- `clickItemByText(text)` -- used in 0 specs
- `clickNthObjectOfRecents(index)` -- used in 0 specs
- `clickRecentObject(name)` -- used in 0 specs
- `close()` -- used in 0 specs
- `closeDialog()` -- used in 0 specs
- `closeMenuPanel()` -- used in 0 specs
- `closeSuggestionPopup()` -- used in 0 specs
- `collapseByPath(paths)` -- used in 0 specs
- `confirm()` -- used in 0 specs
- `currentFolder()` -- used in 0 specs
- `currentPageNumber()` -- used in 0 specs
- `customizeUserACLType(fullName, condition)` -- used in 0 specs
- `deleteUser(fullName)` -- used in 0 specs
- `dragHeaderColumnWidth(headerName, toOffsetParam)` -- used in 0 specs
- `editFormula(newFormula)` -- used in 0 specs
- `expandItem(treeItem)` -- used in 0 specs
- `expandOrCollapseByPath(paths, isExpand = true)` -- used in 0 specs
- `expandOrCollapsePath(name)` -- used in 0 specs
- `findDependents(text)` -- used in 0 specs
- `getCurrentSearchOption()` -- used in 0 specs
- `getDescriptionText()` -- used in 0 specs
- `getEmbedLink()` -- used in 0 specs
- `getFolderItem(itemName)` -- used in 0 specs
- `getFolderItemNamTextWidth(name)` -- used in 0 specs
- `getItemDescription(itemName)` -- used in 0 specs
- `getMessageContent()` -- used in 0 specs
- `getNthObjectIconClassOfRecents(index)` -- used in 0 specs
- `getNthObjectNameOfRecents(index)` -- used in 0 specs
- `getResultItemByName(name)` -- used in 0 specs
- `getResultRecordByName(name)` -- used in 0 specs
- `getResultRowByName(name)` -- used in 0 specs
- `getSharedLibraryLink()` -- used in 0 specs
- `getSharedLink()` -- used in 0 specs
- `getShortcutByName(name)` -- used in 0 specs
- `getSubscriptionIDInSharedLink()` -- used in 0 specs
- `getSuggestionList(fullName)` -- used in 0 specs
- `getSuggestionListCount()` -- used in 0 specs
- `getSuggestionUserTooltip(fullName, index = 0)` -- used in 0 specs
- `getUserACLTooltip(fullName)` -- used in 0 specs
- `getUserACLType(fullName)` -- used in 0 specs
- `hideLibraryLinkUrl()` -- used in 0 specs
- `hideLinkUrl()` -- used in 0 specs
- `hideUserList()` -- used in 0 specs
- `hoverToItem(text)` -- used in 0 specs
- `inputDescription(description)` -- used in 0 specs
- `inputName(name)` -- used in 0 specs
- `inputUser(fullName)` -- used in 0 specs
- `isACLEditerDisabled(fullName)` -- used in 0 specs
- `isAnyObjectInRecents()` -- used in 0 specs
- `isBrowseButtonDisabled()` -- used in 0 specs
- `isContextMenuPresent()` -- used in 0 specs
- `isCreateItemDisabled(item)` -- used in 0 specs
- `isCreateItemPresent(item)` -- used in 0 specs
- `isCreatePresent()` -- used in 0 specs
- `isDoneButtonDisabled()` -- used in 0 specs
- `isFileNotEmpty(name)` -- used in 0 specs
- `isIconViewPresent()` -- used in 0 specs
- `isItemInRightPanel(itemName)` -- used in 0 specs
- `isItemsDisplayedAsList()` -- used in 0 specs
- `isItemShownByText(text)` -- used in 0 specs
- `isItemWithLargeIcon(text)` -- used in 0 specs
- `isLaunchLibraryIconPresent()` -- used in 0 specs
- `isLibraryLinkSectionPresent()` -- used in 0 specs
- `isListView()` -- used in 0 specs
- `isListViewPresent()` -- used in 0 specs
- `isMenuItemDisplay(item)` -- used in 0 specs
- `isMyReportsButtonPresent()` -- used in 0 specs
- `isMySubscriptionButtonPresent()` -- used in 0 specs
- `isObjectInHistoryListPresent(name)` -- used in 0 specs
- `isRecentsClickable()` -- used in 0 specs
- `isRecoveryInRecents()` -- used in 0 specs
- `isResultEmpty()` -- used in 0 specs
- `isSearchEditorOpen()` -- used in 0 specs
- `isSearchOptionPresent()` -- used in 0 specs
- `isSendNowDisabled(name)` -- used in 0 specs
- `isShareDialogPresent()` -- used in 0 specs
- `isSubscribeDisabled(name)` -- used in 0 specs
- `isSuggestionPresent()` -- used in 0 specs
- `isUserInputboxDisabled()` -- used in 0 specs
- `isUserPresentForACLList(fullName)` -- used in 0 specs
- `launchLibrary()` -- used in 0 specs
- `navigateTo(paths)` -- used in 0 specs
- `open()` -- used in 0 specs
- `open(paths, isExpand = true)` -- used in 0 specs
- `openFolderByName(objectName, folderName)` -- used in 0 specs
- `openHistoryListPanel()` -- used in 0 specs
- `openInLibrary(text)` -- used in 0 specs
- `openMenu(menuPaths)` -- used in 0 specs
- `openMenuPanel()` -- used in 0 specs
- `openMSTRMenu()` -- used in 0 specs
- `openMSTRMenuRecentsPanel()` -- used in 0 specs
- `openObjectByNameInGridView(name)` -- used in 0 specs
- `openObjectByNameInIconView(name)` -- used in 0 specs
- `OpenObjectContextMenuInHistoryList(name)` -- used in 0 specs
- `openObjectInHistoryList(name)` -- used in 0 specs
- `openRecentsPanel()` -- used in 0 specs
- `openRunAs()` -- used in 0 specs
- `openShortcutByNameInGridView(name)` -- used in 0 specs
- `openSubscriptionPanel()` -- used in 0 specs
- `renameMetric(newName)` -- used in 0 specs
- `resultCount()` -- used in 0 specs
- `rightClickItem(text)` -- used in 0 specs
- `save()` -- used in 0 specs
- `saveACL()` -- used in 0 specs
- `search(keyword)` -- used in 0 specs
- `selectedObjectType()` -- used in 0 specs
- `selectLibraryLinkSection()` -- used in 0 specs
- `selectMultiPulldown(el, values)` -- used in 0 specs
- `selectPulldown(el, value)` -- used in 0 specs
- `selectSearchOption(item)` -- used in 0 specs
- `selectUser(fullName)` -- used in 0 specs
- `setDate(dateOption, options)` -- used in 0 specs
- `setDescription(value)` -- used in 0 specs
- `setFolder(folderName)` -- used in 0 specs
- `setObjectType(types)` -- used in 0 specs
- `setOwner(owner)` -- used in 0 specs
- `setSearchType(type)` -- used in 0 specs
- `share(text)` -- used in 0 specs
- `showLibraryLinkUrl()` -- used in 0 specs
- `showLinkUrl()` -- used in 0 specs
- `showUserList()` -- used in 0 specs
- `sortFolderBy(sortType)` -- used in 0 specs
- `switchPage(el)` -- used in 0 specs
- `switchPageTo(pageNumber)` -- used in 0 specs
- `switchPageToFirst()` -- used in 0 specs
- `switchPageToLast()` -- used in 0 specs
- `switchPageToNext()` -- used in 0 specs
- `switchPageToPrevious()` -- used in 0 specs
- `switchToGridView()` -- used in 0 specs
- `switchToIconView()` -- used in 0 specs
- `swtichToFormulaEditor()` -- used in 0 specs
- `uploadMstrFile(path)` -- used in 0 specs
- `waitDialogShown()` -- used in 0 specs
- `waitExplorDialogShwon()` -- used in 0 specs
- `waitForSearchResults()` -- used in 0 specs
- `waitForUploadComplete()` -- used in 0 specs
- `waitMsgBoxShown()` -- used in 0 specs
- `waitTreeLoading(timeout = 10)` -- used in 0 specs

## Source Coverage

- `pageObjects/web_home/**/*.js`
