# Site Knowledge: Saas Domain

## Overview

- **Domain key:** `saas`
- **Components covered:** SaaS_Email, SaaSExternalLinkDialog, SaaSManageAccessDialog, SaaSShareDialog
- **Spec files scanned:** 4
- **POM files scanned:** 4

## Components

### SaaS_Email
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clearMsgBox(userName)`
  - `deleteEmail()`
  - `getBrowserLink(userName)`
  - `getInviteContent(userName, trim = true)`
  - `getInviteMessage(userName, trim = true)`
  - `getUserEmail(userName)`
  - `recieveEmail(userName)`
- **Related components:** dossierPage, libraryPage

### SaaSExternalLinkDialog
- **CSS root:** `.mstrd-MessageBox-main`
- **User-visible elements:**
  - External Link Error Box (`.mstrd-MessageBox-main`)
- **Component actions:**
  - `getExternalLinkErrorMsg()`
  - `getExternalLinkErrorTitle()`
  - `isExternalLinkBoxPresent()`
  - `openLink()`
  - `selectDontWarnMeAgain()`
  - `stayHere()`
- **Related components:** _none_

### SaaSManageAccessDialog
- **CSS root:** `.mstrd-ManageAccessContainer-main`
- **User-visible elements:**
  - Saas Manage Access Dialog (`.mstrd-ManageAccessContainer-main`)
- **Component actions:**
  - `getAccessEntryItemByName(itemName)`
  - `getAccessEntryItemOptions(itemName)`
  - `getAccessEntryItemRemoveIcon(itemName, retry = 3)`
  - `hideUserIcons()`
  - `removeAccessEntryItem(itemName)`
  - `saveManageAccess()`
- **Related components:** _none_

### SaaSShareDialog
- **CSS root:** `.mstrd-ShareDossierContainer-main`
- **User-visible elements:**
  - Recipient Tooltip (`.ant-tooltip-inner`)
  - Saas Share Dialog (`.mstrd-ShareDossierContainer-main`)
  - Share Error Box (`.mstrd-MessageBox-main`)
- **Component actions:**
  - `closeShareDialog()`
  - `closeShareErrorBox()`
  - `doubleClickRecipient(recipient)`
  - `getChangeACLInSaasShare()`
  - `getCopyButtonText()`
  - `getErrorMsg()`
  - `getLink()`
  - `getRecipientList()`
  - `getRecipientTooltipMsg()`
  - `getSaasShareDialogErrMsgTxt()`
  - `getShareErrorMsg()`
  - `getShareErrorTitle()`
  - `hoverRecipient(recipient)`
  - `inputRecipient(inputValue, isClear = false)`
  - `isErrorMsgPresent()`
  - `isRecipientPresent(recipient)`
  - `isShareButtonEnabled()`
  - `pasteRecipient(inputValue, isClear = false)`
  - `removeRecipient(recipient)`
  - `saasShare(checkSuccess = true)`
  - `selectBookmark(bookmarkList)`
- **Related components:** _none_

## Common Workflows (from spec.ts)

1. [TC92813] Verify Sidebar/Filter/Search/Account in library home UI for SaaS (used in 1 specs)
2. [TC92948_1] Validate E2E workflow for SaaS Share Bot (used in 1 specs)
3. [TC92948_2] Validate E2E workflow for SaaS Share Dossier (used in 1 specs)
4. [TC92949_1] Validate share to owner, acl is not changed (used in 1 specs)
5. [TC92949_10] Validate show dossier manage access entry for owner in SAAS (used in 1 specs)
6. [TC92949_2] Validate remove recipient from manage access dialog (used in 1 specs)
7. [TC92949_3] Validate error msg when input invalid email (used in 1 specs)
8. [TC92949_4] Validate error tootip after copy email list (used in 1 specs)
9. [TC92949_5] Validate show bot share entry for owner in SAAS (used in 1 specs)
10. [TC92949_6] Validate show dossier share entry for owner in SAAS (used in 1 specs)
11. [TC92949_7] Validate hide bot share and manage access entry for recipient in SAAS (used in 1 specs)
12. [TC92949_8] Validate hide dossier share and manage access entry for recipient in SAAS (used in 1 specs)
13. [TC92949_9] Validate show bot manage access entry for owner in SAAS (used in 1 specs)
14. [TC92950_1] execute bot by share link when bot id is invalid (used in 1 specs)
15. [TC92950_2] execute dashboard and bot by share link when creator expires (used in 1 specs)
16. [TC92950_3] verify error when user share over maximum times (used in 1 specs)
17. [TC92950_4] verify correct recipient case (used in 1 specs)
18. [TC92973_01] Validate Functionality of new user experience for SaaS on Library Web - when sidebar is hidden (used in 1 specs)
19. [TC92973_02] Validate Functionality of new user experience for SaaS on Library Web - take a tour entry (used in 1 specs)
20. [TC93036] Validate i18n of new user experience for SaaS on Library Web (used in 1 specs)
21. [TC93385] Verify Dashboard/Bot UI for SaaS (used in 1 specs)
22. [TC93387] Verity Sider bar open status sync for SaaS (used in 1 specs)
23. [TC93394] Verify recipient Library home UI for SaaS (used in 1 specs)
24. [TC93400] Verify delete base object in library home for SaaS (used in 1 specs)
25. [TC93527] Verify bot sent from expired user in library home for SaaS (used in 1 specs)
26. [TC93548] Verify trial banner for SaaS (used in 1 specs)
27. [TC93551] Verify rename dashboard/bot for SaaS (used in 1 specs)
28. [TC93646] Verify tab order in accessibility for SaaS (used in 1 specs)
29. [TC94364_01] Verify external link popup dialogue general funciton (used in 1 specs)
30. [TC94364_02] Verify different types of external link on dashboard text/image (used in 1 specs)
31. [TC94364_03] Verify different types of external link on dashboard grid (used in 1 specs)
32. [TC94364_04] Verify different types of external link on aibot (used in 1 specs)
33. [TC94364_05] Verify pendo and help link is able to open directly (used in 1 specs)
34. [TC94364_06] Verify internal link on text and grid is able to open directly (used in 1 specs)
35. [TC94364_07] Verify external link popup setting - do not warn me about external site (used in 1 specs)
36. External Link on SaaS (used in 1 specs)
37. Library Home for SaaS (used in 1 specs)
38. Pendo Guide (used in 1 specs)
39. SaaSShare (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getBrowserTabs -- frequency: 12
2. getShareDossierDialog -- frequency: 12
3. getNavigationBar -- frequency: 11
4. getActionButtonsName -- frequency: 10
5. getLibraryPendoContainerTitleText -- frequency: 8
6. getShareButton -- frequency: 8
7. {actual} -- frequency: 6
8. {expected} -- frequency: 6
9. getAGGridContainerContentHeight -- frequency: 6
10. getSaveButton -- frequency: 6
11. getTrialBanner -- frequency: 6
12. getTrialBannerMessageText -- frequency: 6
13. getACLItemscount -- frequency: 4
14. getDeleteIconTooltipInInfoWindow -- frequency: 4
15. getErrorDetailsButton -- frequency: 4
16. getInstructionTitleInSiderSectionText -- frequency: 4
17. getLibraryHomeTooltipText -- frequency: 4
18. getSaasManageAccessDialog -- frequency: 4
19. getTrialWrapper -- frequency: 4
20. getBookmarkIcon -- frequency: 3
21. getErrorMsg -- frequency: 3
22. getRecipientTooltipMsg -- frequency: 3
23. getSelectedSectionName -- frequency: 3
24. getShareDossierPanelItemsName -- frequency: 3
25. {actual}\ -- frequency: 2
26. {expected}\ -- frequency: 2
27. getAccountMenuOptionsNames -- frequency: 2
28. getBrowserLink -- frequency: 2
29. getCommentsPanelForSaaS -- frequency: 2
30. getConfirmMessageText -- frequency: 2
31. getDossierPendoContainerText -- frequency: 2
32. getInviteContent -- frequency: 2
33. getInviteMessage -- frequency: 2
34. getPreferenceSectionsNames -- frequency: 2
35. getRecommendations -- frequency: 2
36. getRemoveConfirmationMessageText -- frequency: 2
37. getShareBotButton -- frequency: 2
38. getShareErrorBox -- frequency: 2
39. getWelcomePage -- frequency: 2
40. External Link Error Box -- frequency: 1
41. getCreateNewMenuItemsText -- frequency: 1
42. getExternalLinkErrorBox -- frequency: 1
43. getFilterDropdownOptionsNames -- frequency: 1
44. getFilterTypeItemsNames -- frequency: 1
45. getGrayedSectionNames -- frequency: 1
46. getLibraryContentContainer -- frequency: 1
47. getListContainerHeaderText -- frequency: 1
48. getOptionsInCheckboxDetailPanelName -- frequency: 1
49. getPredefinedSectionItemsCount -- frequency: 1
50. getSearchFilterItemsName -- frequency: 1
51. getShareErrorMsg -- frequency: 1
52. getShareErrorTitle -- frequency: 1
53. Recipient Tooltip -- frequency: 1
54. Saas Manage Access Dialog -- frequency: 1
55. Saas Share Dialog -- frequency: 1
56. Share Error Box -- frequency: 1

## Key Actions

- `executeScript()` -- used in 43 specs
- `closeDialog()` -- used in 35 specs
- `waitForElementVisible()` -- used in 34 specs
- `onGuideDismissed()` -- used in 27 specs
- `openDossier()` -- used in 25 specs
- `isExternalLinkBoxPresent()` -- used in 23 specs
- `openDossierInfoWindow()` -- used in 23 specs
- `clickDossierContextMenuItem()` -- used in 18 specs
- `inputRecipient(inputValue, isClear = false)` -- used in 15 specs
- `switchUser()` -- used in 15 specs
- `closeInfoWindow()` -- used in 14 specs
- `getBrowserTabs()` -- used in 12 specs
- `getShareDossierDialog()` -- used in 12 specs
- `moveDossierIntoViewPort()` -- used in 12 specs
- `openDossierContextMenu()` -- used in 12 specs
- `openInfoWindowFromListView()` -- used in 12 specs
- `openPageFromTocMenu()` -- used in 12 specs
- `selectListViewMode()` -- used in 12 specs
- `clickPredefinedSection()` -- used in 11 specs
- `getNavigationBar()` -- used in 11 specs
- `clickCloseIcon()` -- used in 10 specs
- `close()` -- used in 10 specs
- `closeTab()` -- used in 10 specs
- `enter()` -- used in 10 specs
- `getActionButtonsName()` -- used in 10 specs
- `openInfoWindow()` -- used in 10 specs
- `shareDossier()` -- used in 10 specs
- `stayHere()` -- used in 10 specs
- `waitForLibraryLoading()` -- used in 10 specs
- `goToLibrary()` -- used in 9 specs
- `openShareDropDown()` -- used in 9 specs
- `refresh()` -- used in 9 specs
- `getLibraryPendoContainerTitleText()` -- used in 8 specs
- `getShareButton()` -- used in 8 specs
- `isDossierContextMenuItemExisted()` -- used in 8 specs
- `isShareButtonEnabled()` -- used in 8 specs
- `navigateLink()` -- used in 8 specs
- `openManageAccessDialog()` -- used in 8 specs
- `openUserAccountMenu()` -- used in 8 specs
- `rightClickToOpenContextMenu()` -- used in 8 specs
- `showIconTooltip()` -- used in 8 specs
- `sleep()` -- used in 8 specs
- `stopGuides()` -- used in 8 specs
- `deselectListViewMode()` -- used in 7 specs
- `hideTimeAndName()` -- used in 7 specs
- `keys()` -- used in 7 specs
- `mockRestoreAll()` -- used in 7 specs
- `saasShare(checkSuccess = true)` -- used in 7 specs
- `showTimeAndName()` -- used in 7 specs
- `clickPendoButton()` -- used in 6 specs
- `getAGGridContainerContentHeight()` -- used in 6 specs
- `getSaveButton()` -- used in 6 specs
- `getTrialBanner()` -- used in 6 specs
- `getTrialBannerMessageText()` -- used in 6 specs
- `openSearchBox()` -- used in 6 specs
- `openShareDossierDialog()` -- used in 6 specs
- `pressEnter()` -- used in 6 specs
- `search()` -- used in 6 specs
- `tab()` -- used in 6 specs
- `url()` -- used in 6 specs
- `waitForElementEnabled()` -- used in 6 specs
- `waitForManageAccessLoading()` -- used in 6 specs
- `waitForPageLoadByUrl()` -- used in 6 specs
- `addMessage()` -- used in 5 specs
- `isDossierInLibrary()` -- used in 5 specs
- `isEditIconPresent()` -- used in 5 specs
- `isManageAccessPresent()` -- used in 5 specs
- `isObjectIDPresentInInfoWindow()` -- used in 5 specs
- `isRecommendationListPresentInInfoWindow()` -- used in 5 specs
- `waitForDossierLoading()` -- used in 5 specs
- `clear()` -- used in 4 specs
- `clickAllSection()` -- used in 4 specs
- `closePendoGuide()` -- used in 4 specs
- `customCredentials()` -- used in 4 specs
- `errorDetails()` -- used in 4 specs
- `getACLItemscount()` -- used in 4 specs
- `getDeleteIconTooltipInInfoWindow()` -- used in 4 specs
- `getErrorDetailsButton()` -- used in 4 specs
- `getInstructionTitleInSiderSectionText()` -- used in 4 specs
- `getLibraryHomeTooltipText()` -- used in 4 specs
- `getSaasManageAccessDialog()` -- used in 4 specs
- `getTrialWrapper()` -- used in 4 specs
- `isEditButtonPresentInIW()` -- used in 4 specs
- `isSharePresent()` -- used in 4 specs
- `isSidebarOpened()` -- used in 4 specs
- `isUpgradeButtonInSiderSectionPresent()` -- used in 4 specs
- `navigateLinkInCurrentPage()` -- used in 4 specs
- `openCommentsPanelForSaaS()` -- used in 4 specs
- `removeRecipient(recipient)` -- used in 4 specs
- `viewErrorDetails()` -- used in 4 specs
- `back()` -- used in 3 specs
- `clearMsgBox(userName)` -- used in 3 specs
- `clickAccountOption()` -- used in 3 specs
- `clickExternalLinkByText()` -- used in 3 specs
- `clickGridElementLink()` -- used in 3 specs
- `closeCommentsPanelForSaaS()` -- used in 3 specs
- `closeSharePanel()` -- used in 3 specs
- `closeUserAccountMenu()` -- used in 3 specs
- `confirmRemove()` -- used in 3 specs
- `getBookmarkIcon()` -- used in 3 specs
- `getErrorMsg()` -- used in 3 specs
- `getRecipientTooltipMsg()` -- used in 3 specs
- `getSelectedSectionName()` -- used in 3 specs
- `getShareDossierPanelItemsName()` -- used in 3 specs
- `hoverRecipient(recipient)` -- used in 3 specs
- `openLink()` -- used in 3 specs
- `openSearchSlider()` -- used in 3 specs
- `openSharePanel()` -- used in 3 specs
- `openUrl()` -- used in 3 specs
- `pasteRecipient(inputValue, isClear = false)` -- used in 3 specs
- `selectRemove()` -- used in 3 specs
- `toString()` -- used in 3 specs
- `addUserForSaaS()` -- used in 2 specs
- `backToLibrary()` -- used in 2 specs
- `cancelRemoveFromInfoWindow()` -- used in 2 specs
- `clickDeleteFromIW()` -- used in 2 specs
- `clickEditButton()` -- used in 2 specs
- `clickManageAccessFromIW()` -- used in 2 specs
- `clickNewDossierIcon()` -- used in 2 specs
- `clickShareFromIW()` -- used in 2 specs
- `clickViewAll()` -- used in 2 specs
- `closeFilterPanel()` -- used in 2 specs
- `closeSidebar()` -- used in 2 specs
- `dismissError()` -- used in 2 specs
- `errorMsg()` -- used in 2 specs
- `getAccountMenuOptionsNames()` -- used in 2 specs
- `getBrowserLink(userName)` -- used in 2 specs
- `getCommentsPanelForSaaS()` -- used in 2 specs
- `getConfirmMessageText()` -- used in 2 specs
- `getDossierPendoContainerText()` -- used in 2 specs
- `getInviteContent(userName, trim = true)` -- used in 2 specs
- `getInviteMessage(userName, trim = true)` -- used in 2 specs
- `getPreferenceSectionsNames()` -- used in 2 specs
- `getRecommendations()` -- used in 2 specs
- `getRemoveConfirmationMessageText()` -- used in 2 specs
- `getShareBotButton()` -- used in 2 specs
- `getShareErrorBox()` -- used in 2 specs
- `getWelcomePage()` -- used in 2 specs
- `hideUserIcons()` -- used in 2 specs
- `initGuides()` -- used in 2 specs
- `inputText()` -- used in 2 specs
- `isAccountOptionPresent()` -- used in 2 specs
- `isBotHasInactiveInName()` -- used in 2 specs
- `isCommentsPanelForSaaSPresent()` -- used in 2 specs
- `isDossierShareIconPresent()` -- used in 2 specs
- `isLoginPageDisplayed()` -- used in 2 specs
- `isManageAccessIconPresentInInfoWindow()` -- used in 2 specs
- `isSecondaryContextMenuItemExisted()` -- used in 2 specs
- `isShareIconPresentInInfoWindow()` -- used in 2 specs
- `login()` -- used in 2 specs
- `logoutClearCacheAndLogin()` -- used in 2 specs
- `openDossierContextMenuNoWait()` -- used in 2 specs
- `openDossierNoWait()` -- used in 2 specs
- `openPanel()` -- used in 2 specs
- `openPreferencePanel()` -- used in 2 specs
- `openShareFromListView()` -- used in 2 specs
- `openSidebar()` -- used in 2 specs
- `reload()` -- used in 2 specs
- `renameDossier()` -- used in 2 specs
- `shiftTab()` -- used in 2 specs
- `showGuideById()` -- used in 2 specs
- `waitForElementInvisible()` -- used in 2 specs
- `clickCancelButton()` -- used in 1 specs
- `clickFilterIcon()` -- used in 1 specs
- `clickMoreMenuFromIW()` -- used in 1 specs
- `clickSaaSLibraryIcon()` -- used in 1 specs
- `clickUpgradeButtonInCommentsPanel()` -- used in 1 specs
- `clickUpgradeButtonInSiderSection()` -- used in 1 specs
- `clickUpgradeButtonInTrialBanner()` -- used in 1 specs
- `closeFilterTypeDropdown()` -- used in 1 specs
- `closeShareErrorBox()` -- used in 1 specs
- `createDossierFromLibrary()` -- used in 1 specs
- `deleteCookies()` -- used in 1 specs
- `doubleClickRecipient(recipient)` -- used in 1 specs
- `getCreateNewMenuItemsText()` -- used in 1 specs
- `getExternalLinkErrorBox()` -- used in 1 specs
- `getFilterDropdownOptionsNames()` -- used in 1 specs
- `getFilterTypeItemsNames()` -- used in 1 specs
- `getGrayedSectionNames()` -- used in 1 specs
- `getLibraryContentContainer()` -- used in 1 specs
- `getListContainerHeaderText()` -- used in 1 specs
- `getOptionsInCheckboxDetailPanelName()` -- used in 1 specs
- `getPredefinedSectionItemsCount()` -- used in 1 specs
- `getSearchFilterItemsName()` -- used in 1 specs
- `getShareErrorMsg()` -- used in 1 specs
- `getShareErrorTitle()` -- used in 1 specs
- `goBackFromDossierLink()` -- used in 1 specs
- `inputTextAndSearch()` -- used in 1 specs
- `isAddGroupBtnForSaaSDisplayed()` -- used in 1 specs
- `isAllTabPresent()` -- used in 1 specs
- `isCommentIconDisabled()` -- used in 1 specs
- `isCommentIconPresent()` -- used in 1 specs
- `isDossierPendoContainerPresent()` -- used in 1 specs
- `isErrorMsgPresent()` -- used in 1 specs
- `isMoreMenuIconPresentInInfoWindow()` -- used in 1 specs
- `isMyLibraryTabPresent()` -- used in 1 specs
- `isSharedIconPresent()` -- used in 1 specs
- `isShareDossierPresent()` -- used in 1 specs
- `isShareIconPresent()` -- used in 1 specs
- `isTitleDisaplayed()` -- used in 1 specs
- `isTooltipDisplayed()` -- used in 1 specs
- `isUpgradeButtonInCommentsPanelPresent()` -- used in 1 specs
- `isUpgradeButtonInTrialBannerPresent()` -- used in 1 specs
- `join()` -- used in 1 specs
- `labelInTitle()` -- used in 1 specs
- `linkToTargetByGridContextMenu()` -- used in 1 specs
- `logout()` -- used in 1 specs
- `openFilterDetailPanel()` -- used in 1 specs
- `openFilterTypeDropdown()` -- used in 1 specs
- `openSearchFilterPanel()` -- used in 1 specs
- `openShareBotDialog()` -- used in 1 specs
- `pause()` -- used in 1 specs
- `removeAccessEntryItem(itemName)` -- used in 1 specs
- `removeDossierFromLibrary()` -- used in 1 specs
- `saveManageAccess()` -- used in 1 specs
- `saveNewDossier()` -- used in 1 specs
- `selectBookmark(bookmarkList)` -- used in 1 specs
- `selectDontWarnMeAgain()` -- used in 1 specs
- `set()` -- used in 1 specs
- `shareBookmark()` -- used in 1 specs
- `standardInputCredential()` -- used in 1 specs
- `switchToTab()` -- used in 1 specs
- `waitForCurtainDisappear()` -- used in 1 specs
- `closeShareDialog()` -- used in 0 specs
- `deleteEmail()` -- used in 0 specs
- `getAccessEntryItemByName(itemName)` -- used in 0 specs
- `getAccessEntryItemOptions(itemName)` -- used in 0 specs
- `getAccessEntryItemRemoveIcon(itemName, retry = 3)` -- used in 0 specs
- `getChangeACLInSaasShare()` -- used in 0 specs
- `getCopyButtonText()` -- used in 0 specs
- `getExternalLinkErrorMsg()` -- used in 0 specs
- `getExternalLinkErrorTitle()` -- used in 0 specs
- `getLink()` -- used in 0 specs
- `getRecipientList()` -- used in 0 specs
- `getSaasShareDialogErrMsgTxt()` -- used in 0 specs
- `getUserEmail(userName)` -- used in 0 specs
- `isRecipientPresent(recipient)` -- used in 0 specs
- `recieveEmail(userName)` -- used in 0 specs

## Source Coverage

- `pageObjects/saas/**/*.js`
- `specs/regression/saas/**/*.{ts,js}`
