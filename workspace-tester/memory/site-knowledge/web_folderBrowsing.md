# Site Knowledge: web_folderBrowsing

> Components: 3

### FolderPage
> Extends: `WebBasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `MenuSection` | `.mstrMenuSection div.mstrMenuContent` | element |
| `Rename` | `.rename` | element |
| `CompressedMenu` | `.mstrPathBreadCrumbsAncestors` | element |

**Actions**
| Signature |
|-----------|
| `getObjectDescription(name)` |
| `getRename()` |
| `getHeaderFolderLink(targetPath)` |
| `getFolderPullArrow(targetPath)` |
| `findShareDialog()` |
| `switchToIconView()` |
| `switchToListView()` |
| `openByTreeView(paths)` |
| `openByPath(path)` |
| `navigateByHeaderPath(targetPath)` |
| `openCompressedMenu(targetPath)` |
| `navigateByCompressedMenu(targetPath)` |
| `clickTreeEntryItem(entryPath)` |
| `clickNewFolder()` |
| `inputRename(newName)` |
| `applyRename()` |
| `cancelRename()` |

**Sub-components**
- recentsPanel
- openHomePage

---

### HomePage
> Extends: `WebBasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AccountMenu` | `#mstrPathAccount` | element |
| `AccountMenuList` | `#mstrAccountSCList.open` | element |
| `HomeButton` | `#tbHome` | element |
| `FolderUpButton` | `#tbReturn` | element |
| `FooterPath` | `.mstrFooter` | element |
| `PathContainer` | `.mstrPathContainer` | element |
| `Header` | `.mstrPath` | element |
| `SearchButtonInHomePage` | `.mstrmojo-Button.mstrmojo-SearchButton` | button |
| `SearchEditor` | `.mstrmojo-Search-editor` | element |

**Actions**
| Signature |
|-----------|
| `clickSearchButtonInHomePage()` |
| `waitForSearchResults()` |
| `search(keyword)` |
| `openAccountMenu()` |
| `hoverOnAccountMenu()` |
| `openPreferencesPage()` |
| `clickPreferencesPage()` |
| `openHelpPage()` |
| `deleteUploadDossier(name)` |
| `openDossierInListView(name)` |
| `isPreferenceItemExist()` |
| `isFooterPathExist()` |
| `isAccountMenuListOpen()` |
| `isFeedbackItemExist()` |
| `isHomeButtonExist()` |
| `isFolderUpButtonExist()` |
| `loadDefaultLayout()` |
| `publishLayout()` |

**Sub-components**
- getSearchButtonInHomePage

---

### MyPage
> Extends: `WebBasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Header` | `.mstrmojo-RootView-pathbar` | element |
| `SelectFolderEditor` | `.mstrmojo-FolderPicker` | element |
| `EditSubMenu` | `.scroll-container.mstrmojo-scrollNode` | element |
| `WarningAlertInImageLinkInput` | `.mstrmojo-TextBox.mstrmojo-TextBox-Alert` | element |
| `Loader` | `.mstrmojo-BookletLoader` | element |

**Actions**
| Signature |
|-----------|
| `waitForCardEditorDropdownVisible()` |
| `addCard(menuPaths, name)` |
| `deleteCards(cardList)` |
| `deleteAllCards()` |
| `addImageCard(imageSource, imageLink, name)` |
| `cancelAddCard()` |
| `addHTMLCard(text, type, name)` |
| `editCard(name)` |
| `editHTMLCard(text, type, name)` |
| `editImageSource(imageSource, name)` |
| `editImageLink(imageLink, name)` |
| `editCardTitle(tilteName, name)` |
| `editCardWidth(width, name)` |
| `clickImageCardLink(name)` |
| `openObjectInCard(folderPath, name)` |
| `selectFolder(folderPath)` |
| `drapCard(from, to)` |
| `getCardsCount()` |
| `getCardsNames()` |
| `getRecentNameList(name)` |
| `getRecentTimeList(name)` |
| `getRecentActiveItemCount(name)` |
| `isOKButtonDisabled()` |
| `isWarningAlertPresent()` |
| `openFirstObjectInRecents()` |
| `openFolderInSharedReportsCard(folderPath)` |

**Sub-components**
- getCardEditorContainer
- openHomePage
