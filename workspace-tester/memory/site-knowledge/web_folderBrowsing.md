# Site Knowledge: Web Folder Browsing Domain

## Overview

- **Domain key:** `web_folderBrowsing`
- **Components covered:** FolderPage, HomePage, MyPage
- **Spec files scanned:** 0
- **POM files scanned:** 3

## Components

### FolderPage
- **CSS root:** `.mstrPathBreadCrumbsAncestors`
- **User-visible elements:**
  - Compressed Menu (`.mstrPathBreadCrumbsAncestors`)
  - Menu Section (`.mstrMenuSection div.mstrMenuContent`)
  - Rename (`.rename`)
- **Component actions:**
  - `applyRename()`
  - `cancelRename()`
  - `clickNewFolder()`
  - `clickTreeEntryItem(entryPath)`
  - `findShareDialog()`
  - `getFolderPullArrow(targetPath)`
  - `getHeaderFolderLink(targetPath)`
  - `getObjectDescription(name)`
  - `getRename()`
  - `inputRename(newName)`
  - `navigateByCompressedMenu(targetPath)`
  - `navigateByHeaderPath(targetPath)`
  - `openByPath(path)`
  - `openByTreeView(paths)`
  - `openCompressedMenu(targetPath)`
  - `switchToIconView()`
  - `switchToListView()`
- **Related components:** openHomePage, recentsPanel

### HomePage
- **CSS root:** `.mstrPathContainer`
- **User-visible elements:**
  - Account Menu (`#mstrPathAccount`)
  - Account Menu List (`#mstrAccountSCList.open`)
  - Folder Up Button (`#tbReturn`)
  - Footer Path (`.mstrFooter`)
  - Header (`.mstrPath`)
  - Home Button (`#tbHome`)
  - Path Container (`.mstrPathContainer`)
  - Search Button In Home Page (`.mstrmojo-Button.mstrmojo-SearchButton`)
  - Search Editor (`.mstrmojo-Search-editor`)
- **Component actions:**
  - `clickPreferencesPage()`
  - `clickSearchButtonInHomePage()`
  - `deleteUploadDossier(name)`
  - `hoverOnAccountMenu()`
  - `isAccountMenuListOpen()`
  - `isFeedbackItemExist()`
  - `isFolderUpButtonExist()`
  - `isFooterPathExist()`
  - `isHomeButtonExist()`
  - `isPreferenceItemExist()`
  - `loadDefaultLayout()`
  - `openAccountMenu()`
  - `openDossierInListView(name)`
  - `openHelpPage()`
  - `openPreferencesPage()`
  - `publishLayout()`
  - `search(keyword)`
  - `waitForSearchResults()`
- **Related components:** getSearchButtonInHomePage

### MyPage
- **CSS root:** `.scroll-container.mstrmojo-scrollNode`
- **User-visible elements:**
  - Edit Sub Menu (`.scroll-container.mstrmojo-scrollNode`)
  - Header (`.mstrmojo-RootView-pathbar`)
  - Loader (`.mstrmojo-BookletLoader`)
  - Select Folder Editor (`.mstrmojo-FolderPicker`)
  - Warning Alert In Image Link Input (`.mstrmojo-TextBox.mstrmojo-TextBox-Alert`)
- **Component actions:**
  - `addCard(menuPaths, name)`
  - `addHTMLCard(text, type, name)`
  - `addImageCard(imageSource, imageLink, name)`
  - `cancelAddCard()`
  - `clickImageCardLink(name)`
  - `deleteAllCards()`
  - `deleteCards(cardList)`
  - `drapCard(from, to)`
  - `editCard(name)`
  - `editCardTitle(tilteName, name)`
  - `editCardWidth(width, name)`
  - `editHTMLCard(text, type, name)`
  - `editImageLink(imageLink, name)`
  - `editImageSource(imageSource, name)`
  - `getCardsCount()`
  - `getCardsNames()`
  - `getRecentActiveItemCount(name)`
  - `getRecentNameList(name)`
  - `getRecentTimeList(name)`
  - `isOKButtonDisabled()`
  - `isWarningAlertPresent()`
  - `openFirstObjectInRecents()`
  - `openFolderInSharedReportsCard(folderPath)`
  - `openObjectInCard(folderPath, name)`
  - `selectFolder(folderPath)`
  - `waitForCardEditorDropdownVisible()`
- **Related components:** getCardEditorContainer, openHomePage

## Common Workflows (from spec.ts)

1. _none_

## Common Elements (from POM + spec.ts)

1. Header -- frequency: 2
2. Account Menu -- frequency: 1
3. Account Menu List -- frequency: 1
4. Compressed Menu -- frequency: 1
5. Edit Sub Menu -- frequency: 1
6. Folder Up Button -- frequency: 1
7. Footer Path -- frequency: 1
8. Home Button -- frequency: 1
9. Loader -- frequency: 1
10. Menu Section -- frequency: 1
11. Path Container -- frequency: 1
12. Rename -- frequency: 1
13. Search Button In Home Page -- frequency: 1
14. Search Editor -- frequency: 1
15. Select Folder Editor -- frequency: 1
16. Warning Alert In Image Link Input -- frequency: 1

## Key Actions

- `addCard(menuPaths, name)` -- used in 0 specs
- `addHTMLCard(text, type, name)` -- used in 0 specs
- `addImageCard(imageSource, imageLink, name)` -- used in 0 specs
- `applyRename()` -- used in 0 specs
- `cancelAddCard()` -- used in 0 specs
- `cancelRename()` -- used in 0 specs
- `clickImageCardLink(name)` -- used in 0 specs
- `clickNewFolder()` -- used in 0 specs
- `clickPreferencesPage()` -- used in 0 specs
- `clickSearchButtonInHomePage()` -- used in 0 specs
- `clickTreeEntryItem(entryPath)` -- used in 0 specs
- `deleteAllCards()` -- used in 0 specs
- `deleteCards(cardList)` -- used in 0 specs
- `deleteUploadDossier(name)` -- used in 0 specs
- `drapCard(from, to)` -- used in 0 specs
- `editCard(name)` -- used in 0 specs
- `editCardTitle(tilteName, name)` -- used in 0 specs
- `editCardWidth(width, name)` -- used in 0 specs
- `editHTMLCard(text, type, name)` -- used in 0 specs
- `editImageLink(imageLink, name)` -- used in 0 specs
- `editImageSource(imageSource, name)` -- used in 0 specs
- `findShareDialog()` -- used in 0 specs
- `getCardsCount()` -- used in 0 specs
- `getCardsNames()` -- used in 0 specs
- `getFolderPullArrow(targetPath)` -- used in 0 specs
- `getHeaderFolderLink(targetPath)` -- used in 0 specs
- `getObjectDescription(name)` -- used in 0 specs
- `getRecentActiveItemCount(name)` -- used in 0 specs
- `getRecentNameList(name)` -- used in 0 specs
- `getRecentTimeList(name)` -- used in 0 specs
- `getRename()` -- used in 0 specs
- `hoverOnAccountMenu()` -- used in 0 specs
- `inputRename(newName)` -- used in 0 specs
- `isAccountMenuListOpen()` -- used in 0 specs
- `isFeedbackItemExist()` -- used in 0 specs
- `isFolderUpButtonExist()` -- used in 0 specs
- `isFooterPathExist()` -- used in 0 specs
- `isHomeButtonExist()` -- used in 0 specs
- `isOKButtonDisabled()` -- used in 0 specs
- `isPreferenceItemExist()` -- used in 0 specs
- `isWarningAlertPresent()` -- used in 0 specs
- `loadDefaultLayout()` -- used in 0 specs
- `navigateByCompressedMenu(targetPath)` -- used in 0 specs
- `navigateByHeaderPath(targetPath)` -- used in 0 specs
- `openAccountMenu()` -- used in 0 specs
- `openByPath(path)` -- used in 0 specs
- `openByTreeView(paths)` -- used in 0 specs
- `openCompressedMenu(targetPath)` -- used in 0 specs
- `openDossierInListView(name)` -- used in 0 specs
- `openFirstObjectInRecents()` -- used in 0 specs
- `openFolderInSharedReportsCard(folderPath)` -- used in 0 specs
- `openHelpPage()` -- used in 0 specs
- `openObjectInCard(folderPath, name)` -- used in 0 specs
- `openPreferencesPage()` -- used in 0 specs
- `publishLayout()` -- used in 0 specs
- `search(keyword)` -- used in 0 specs
- `selectFolder(folderPath)` -- used in 0 specs
- `switchToIconView()` -- used in 0 specs
- `switchToListView()` -- used in 0 specs
- `waitForCardEditorDropdownVisible()` -- used in 0 specs
- `waitForSearchResults()` -- used in 0 specs

## Source Coverage

- `pageObjects/web_folderBrowsing/**/*.js`
