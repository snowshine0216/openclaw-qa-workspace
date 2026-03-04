# Site Knowledge: web_dossier

> Components: 3

### DossierMenu
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `MenuDropDown` | `.mstrmojo-ui-Menu-item-container` | element |
| `ConfirmSaveDialog` | `.mstrmojo-ConfirmSave-Editor` | element |

**Actions**
| Signature |
|-----------|
| `openFile()` |
| `downLoadDossier()` |
| `openMenu(tab, menuPaths)` |
| `isMenuItemPresent(item)` |
| `closeDossier()` |

**Sub-components**
_none_

---

### DossierToolbar
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ToolbarMenu` | `.vi-toolbarMenu` | element |

**Actions**
| Signature |
|-----------|
| `showNavigationBar()` |

**Sub-components**
_none_

---

### WebDossierPage
> Extends: `WebBasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `RePromptButton` | `.item.btn.reprompt` | button |
| `CloseButton` | `.item.btn.close` | button |
| `LaunchInLibraryButton` | `.mstrmojo-Button.share-link-bar-launch-button` | button |
| `ShareLinkBar` | `.mstrmojo-ShareLinkBar ` | element |

**Actions**
| Signature |
|-----------|
| `getNthVisualizationContent(n)` |
| `findShareDialog()` |
| `open(documentID)` |
| `openWithPromptPage(documentID)` |
| `openRunWithPrompt(documentID)` |
| `openDossierInListView(name)` |
| `deleteUploadDossier(name)` |
| `uploadMstrFile(path)` |
| `waitForUploadComplete()` |
| `rePrompt()` |
| `closeDossier()` |
| `launchInLibrary()` |
| `waitForDossierCurtainDisappear()` |
| `isFileNotEmpty(name)` |
| `isShareLinkBarPresent()` |

**Sub-components**
- openWithPromptPage
