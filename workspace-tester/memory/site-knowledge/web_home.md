# Site Knowledge: web_home

> Components: 15

### CustomGroupDialog
> Extends: `BasePageDialog`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `close()` |
| `waitDialogShown()` |

**Sub-components**
_none_

---

### ExplorerDialog
> Extends: `BasePageDialog`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `inputName(name)` |
| `confirm()` |
| `waitExplorDialogShwon()` |
| `navigateTo(paths)` |

**Sub-components**
_none_

---

### FolderTreeView
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FolderTreeView` | `#tree_ftb_FolderTreeView` | element |
| `TreeLodingIcon` | `#divTreeWait` | element |
| `WaitCurtain` | `#mstrWeb_waitCurtain` | element |

**Actions**
| Signature |
|-----------|
| `expandItem(treeItem)` |
| `open(paths, isExpand = true)` |
| `waitTreeLoading(timeout = 10)` |
| `expandOrCollapseByPath(paths, isExpand = true)` |
| `collapseByPath(paths)` |
| `clickItemByText(text)` |
| `isItemShownByText(text)` |

**Sub-components**
_none_

---

### HistoryList
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ContextMenu` | `.mstrContextMenuRight` | element |

**Actions**
| Signature |
|-----------|
| `openObjectInHistoryList(name)` |
| `OpenObjectContextMenuInHistoryList(name)` |
| `isContextMenuPresent()` |
| `isObjectInHistoryListPresent(name)` |

**Sub-components**
_none_

---

### LeftToolbar
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `RecentsButton` | `#mstrRecentObjects` | element |
| `HistoryListButton` | `.mstrMenuItemhistory` | element |
| `MyReportsButton` | `.mstrMenuItemprofile.mstrMenuItem` | element |
| `RecentsPopup` | `.mstrmojo-Popup.mstrShortcutsListPopup` | element |
| `ListView` | `#tbListView` | element |
| `IconView` | `#tbLargeIcons` | element |
| `MySubscriptionButton` | `.mstrMenuItemsubscriptions .mstrLink` | element |
| `LaunchLibraryIcon` | `.mstrMenuItemNLinkTodossierLibrary` | element |

**Actions**
| Signature |
|-----------|
| `openSubscriptionPanel()` |
| `uploadMstrFile(path)` |
| `openRecentsPanel()` |
| `launchLibrary()` |
| `openHistoryListPanel()` |
| `isListViewPresent()` |
| `isIconViewPresent()` |
| `isLaunchLibraryIconPresent()` |
| `isCreatePresent()` |
| `isMyReportsButtonPresent()` |
| `isMySubscriptionButtonPresent()` |

**Sub-components**
_none_

---

### ListView
> Extends: `BaseComponent`

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

### MSTRLogoMenu
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `openMSTRMenu()` |
| `openMSTRMenuRecentsPanel()` |

**Sub-components**
_none_

---

### MenuCreate
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `MenuCreate` | `#mscld-create` | element |
| `MenuPanel` | `#mscld-create-menuList` | element |
| `UploadButton` | `#myFile` | element |
| `UploadResultEditor` | `#uploadResultEditor` | element |
| `ConfirmDialog` | `.mstrmojo-Editor.mstrmojo-alert.modal` | element |

**Actions**
| Signature |
|-----------|
| `openMenuPanel()` |
| `openMenu(menuPaths)` |
| `isFileNotEmpty(name)` |
| `closeMenuPanel()` |
| `uploadMstrFile(path)` |
| `waitForUploadComplete()` |
| `isMenuItemDisplay(item)` |

**Sub-components**
- getMenuPanel
- openMenuPanel

---

### MetricDialog
> Extends: `BasePageDialog`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `FormulaEditor` | `.mstrmojo-TokenInputBox-edit` | input |
| `ClearFormulaBtn` | `.mstrmojo-WebHoverButton.clear` | button |
| `SaveBtn` | `.me-save-button` | button |
| `SaveDisabledBtn` | `.me-save-button.disabled` | button |

**Actions**
| Signature |
|-----------|
| `close()` |
| `waitDialogShown()` |
| `swtichToFormulaEditor()` |
| `renameMetric(newName)` |
| `editFormula(newFormula)` |
| `save()` |

**Sub-components**
_none_

---

### MsgBox
> Extends: `BasePageDialog`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `confirm()` |
| `waitMsgBoxShown()` |
| `getMessageContent()` |

**Sub-components**
_none_

---

### NewFolderEditor
> Extends: `BasePageDialog`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `inputName(name)` |
| `inputDescription(description)` |
| `confirm()` |
| `getDescriptionText()` |

**Sub-components**
_none_

---

### PrimarySearch
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SearchEntranceButton` | `.mstrmojo-SearchButton` | button |
| `InFetchGroups` | `.mstrmojo-IncFetch-content` | element |

**Actions**
| Signature |
|-----------|
| `getResultRowByName(name)` |
| `getShortcutByName(name)` |
| `getResultItemByName(name)` |
| `switchPage(el)` |
| `switchPageTo(pageNumber)` |
| `switchPageToFirst()` |
| `switchPageToPrevious()` |
| `switchPageToLast()` |
| `switchPageToNext()` |
| `open()` |
| `waitForSearchResults()` |
| `search(keyword)` |
| `selectPulldown(el, value)` |
| `selectMultiPulldown(el, values)` |
| `setFolder(folderName)` |
| `setSearchType(type)` |
| `setObjectType(types)` |
| `setOwner(owner)` |
| `setDate(dateOption, options)` |
| `setDescription(value)` |
| `closeSuggestionPopup()` |
| `switchToIconView()` |
| `switchToGridView()` |
| `openObjectByNameInGridView(name)` |
| `openShortcutByNameInGridView(name)` |
| `openObjectByNameInIconView(name)` |
| `expandOrCollapsePath(name)` |
| `openFolderByName(objectName, folderName)` |
| `navigateTo(paths)` |
| `close()` |
| `isSearchEditorOpen()` |
| `getResultRecordByName(name)` |
| `isResultEmpty()` |
| `resultCount()` |
| `selectedObjectType()` |
| `currentFolder()` |
| `currentPageNumber()` |

**Sub-components**
- getResultContainer
- getSearchSettingsContainer
- getPage
- switchPage
- getCurrentPage

---

### RecentsPanel
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getNthObjectNameOfRecents(index)` |
| `clickNthObjectOfRecents(index)` |
| `clickRecentObject(name)` |
| `getNthObjectIconClassOfRecents(index)` |
| `isAnyObjectInRecents()` |
| `isRecoveryInRecents()` |
| `isRecentsClickable()` |

**Sub-components**
_none_

---

### RightFolderPanel
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `RightClickMenu` | `#folderAllModes_cmm1` | element |
| `RightClickSecondaryMenu` | `#folderAllModes_cmm2` | element |

**Actions**
| Signature |
|-----------|
| `getFolderItem(itemName)` |
| `isListView()` |
| `hoverToItem(text)` |
| `rightClickItem(text)` |
| `clickItem(text)` |
| `openMenu(menuPaths)` |
| `share(text)` |
| `findDependents(text)` |
| `openRunAs()` |
| `openInLibrary(text)` |
| `sortFolderBy(sortType)` |
| `getFolderItemNamTextWidth(name)` |
| `isItemWithLargeIcon(text)` |
| `isItemInRightPanel(itemName)` |
| `isItemsDisplayedAsList()` |
| `getItemDescription(itemName)` |
| `dragHeaderColumnWidth(headerName, toOffsetParam)` |
| `isCreateItemDisabled(item)` |
| `isCreateItemPresent(item)` |
| `isSubscribeDisabled(name)` |
| `isSendNowDisabled(name)` |

**Sub-components**
_none_

---

### ShareDialog
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SuggestionDropdown` | `.mstrmojo-suggest-list` | element |
| `CustomACLEditor` | `.mstrmojo-CustomACLEditor` | element |
| `UserBrowser` | `.mstrmojo-UserEditor` | element |

**Actions**
| Signature |
|-----------|
| `selectLibraryLinkSection()` |
| `launchLibrary()` |
| `selectSearchOption(item)` |
| `inputUser(fullName)` |
| `getSuggestionList(fullName)` |
| `closeDialog()` |
| `selectUser(fullName)` |
| `changeUserACLType(fullName, type)` |
| `customizeUserACLType(fullName, condition)` |
| `deleteUser(fullName)` |
| `chooseChildrenAccess(option)` |
| `saveACL()` |
| `hideLinkUrl()` |
| `hideUserList()` |
| `showUserList()` |
| `showLinkUrl()` |
| `hideLibraryLinkUrl()` |
| `showLibraryLinkUrl()` |
| `isShareDialogPresent()` |
| `getSharedLink()` |
| `getSharedLibraryLink()` |
| `getEmbedLink()` |
| `isBrowseButtonDisabled()` |
| `isUserInputboxDisabled()` |
| `isDoneButtonDisabled()` |
| `getUserACLType(fullName)` |
| `getUserACLTooltip(fullName)` |
| `isUserPresentForACLList(fullName)` |
| `getSubscriptionIDInSharedLink()` |
| `getSuggestionUserTooltip(fullName, index = 0)` |
| `isACLEditerDisabled(fullName)` |
| `isLibraryLinkSectionPresent()` |
| `getCurrentSearchOption()` |
| `isSearchOptionPresent()` |
| `isSuggestionPresent()` |
| `getSuggestionListCount()` |

**Sub-components**
_none_
