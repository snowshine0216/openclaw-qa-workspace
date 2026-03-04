# Site Knowledge: saas

> Components: 4

### SaaSExternalLinkDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ExternalLinkErrorBox` | `.mstrd-MessageBox-main` | element |

**Actions**
| Signature |
|-----------|
| `getExternalLinkErrorTitle()` |
| `getExternalLinkErrorMsg()` |
| `stayHere()` |
| `openLink()` |
| `selectDontWarnMeAgain()` |
| `isExternalLinkBoxPresent()` |

**Sub-components**
_none_

---

### SaaSManageAccessDialog
> Extends: `ManageAccessDialog`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SaasManageAccessDialog` | `.mstrd-ManageAccessContainer-main` | element |

**Actions**
| Signature |
|-----------|
| `getAccessEntryItemByName(itemName)` |
| `getAccessEntryItemRemoveIcon(itemName, retry = 3)` |
| `getAccessEntryItemOptions(itemName)` |
| `removeAccessEntryItem(itemName)` |
| `saveManageAccess()` |
| `hideUserIcons()` |

**Sub-components**
_none_

---

### SaaSShareDialog
> Extends: `ShareDossierDialog`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SaasShareDialog` | `.mstrd-ShareDossierContainer-main` | element |
| `RecipientTooltip` | `.ant-tooltip-inner` | element |
| `ShareErrorBox` | `.mstrd-MessageBox-main` | element |

**Actions**
| Signature |
|-----------|
| `getShareErrorTitle()` |
| `getShareErrorMsg()` |
| `getErrorMsg()` |
| `getRecipientTooltipMsg()` |
| `getLink()` |
| `getCopyButtonText()` |
| `getChangeACLInSaasShare()` |
| `getSaasShareDialogErrMsgTxt()` |
| `getRecipientList()` |
| `inputRecipient(inputValue, isClear = false)` |
| `pasteRecipient(inputValue, isClear = false)` |
| `removeRecipient(recipient)` |
| `closeShareDialog()` |
| `selectBookmark(bookmarkList)` |
| `hoverRecipient(recipient)` |
| `doubleClickRecipient(recipient)` |
| `saasShare(checkSuccess = true)` |
| `isErrorMsgPresent()` |
| `isRecipientPresent(recipient)` |
| `isShareButtonEnabled()` |
| `closeShareErrorBox()` |

**Sub-components**
_none_

---

### SaaS_Email
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `recieveEmail(userName)` |
| `getUserEmail(userName)` |
| `getInviteContent(userName, trim = true)` |
| `getInviteMessage(userName, trim = true)` |
| `getBrowserLink(userName)` |
| `clearMsgBox(userName)` |
| `deleteEmail()` |

**Sub-components**
- dossierPage
- libraryPage
