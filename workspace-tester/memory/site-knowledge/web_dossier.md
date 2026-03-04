# Site Knowledge: Web Dossier Domain

## Overview

- **Domain key:** `web_dossier`
- **Components covered:** DossierMenu, DossierToolbar, WebDossierPage
- **Spec files scanned:** 0
- **POM files scanned:** 3

## Components

### DossierMenu
- **CSS root:** `.mstrmojo-ui-Menu-item-container`
- **User-visible elements:**
  - Confirm Save Dialog (`.mstrmojo-ConfirmSave-Editor`)
  - Menu Drop Down (`.mstrmojo-ui-Menu-item-container`)
- **Component actions:**
  - `closeDossier()`
  - `downLoadDossier()`
  - `isMenuItemPresent(item)`
  - `openFile()`
  - `openMenu(tab, menuPaths)`
- **Related components:** _none_

### DossierToolbar
- **CSS root:** `.vi-toolbarMenu`
- **User-visible elements:**
  - Toolbar Menu (`.vi-toolbarMenu`)
- **Component actions:**
  - `showNavigationBar()`
- **Related components:** _none_

### WebDossierPage
- **CSS root:** `.item.btn.close`
- **User-visible elements:**
  - Close Button (`.item.btn.close`)
  - Launch In Library Button (`.mstrmojo-Button.share-link-bar-launch-button`)
  - Re Prompt Button (`.item.btn.reprompt`)
  - Share Link Bar (`.mstrmojo-ShareLinkBar `)
- **Component actions:**
  - `closeDossier()`
  - `deleteUploadDossier(name)`
  - `findShareDialog()`
  - `getNthVisualizationContent(n)`
  - `isFileNotEmpty(name)`
  - `isShareLinkBarPresent()`
  - `launchInLibrary()`
  - `open(documentID)`
  - `openDossierInListView(name)`
  - `openRunWithPrompt(documentID)`
  - `openWithPromptPage(documentID)`
  - `rePrompt()`
  - `uploadMstrFile(path)`
  - `waitForDossierCurtainDisappear()`
  - `waitForUploadComplete()`
- **Related components:** openWithPromptPage

## Common Workflows (from spec.ts)

1. _none_

## Common Elements (from POM + spec.ts)

1. Close Button -- frequency: 1
2. Confirm Save Dialog -- frequency: 1
3. Launch In Library Button -- frequency: 1
4. Menu Drop Down -- frequency: 1
5. Re Prompt Button -- frequency: 1
6. Share Link Bar -- frequency: 1
7. Toolbar Menu -- frequency: 1

## Key Actions

- `closeDossier()` -- used in 0 specs
- `deleteUploadDossier(name)` -- used in 0 specs
- `downLoadDossier()` -- used in 0 specs
- `findShareDialog()` -- used in 0 specs
- `getNthVisualizationContent(n)` -- used in 0 specs
- `isFileNotEmpty(name)` -- used in 0 specs
- `isMenuItemPresent(item)` -- used in 0 specs
- `isShareLinkBarPresent()` -- used in 0 specs
- `launchInLibrary()` -- used in 0 specs
- `open(documentID)` -- used in 0 specs
- `openDossierInListView(name)` -- used in 0 specs
- `openFile()` -- used in 0 specs
- `openMenu(tab, menuPaths)` -- used in 0 specs
- `openRunWithPrompt(documentID)` -- used in 0 specs
- `openWithPromptPage(documentID)` -- used in 0 specs
- `rePrompt()` -- used in 0 specs
- `showNavigationBar()` -- used in 0 specs
- `uploadMstrFile(path)` -- used in 0 specs
- `waitForDossierCurtainDisappear()` -- used in 0 specs
- `waitForUploadComplete()` -- used in 0 specs

## Source Coverage

- `pageObjects/web_dossier/**/*.js`
