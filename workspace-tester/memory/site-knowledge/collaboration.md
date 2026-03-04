# Site Knowledge: Collaboration Domain

## Overview

- **Domain key:** `collaboration`
- **Components covered:** CollabAdminPage, CommentsPage, GroupDiscussionPage, Notification
- **Spec files scanned:** 11
- **POM files scanned:** 4

## Components

### CollabAdminPage
- **CSS root:** `.mstr-Admin-Switch`
- **User-visible elements:**
  - Alert Msg (`.ant-alert-message`)
  - Msg Content (`.mstr-Admin-Modal-message`)
  - Panel Features Switcher (`.mstr-Admin-Switch`)
  - Saving Icon (`.ant-spin-dot`)
- **Component actions:**
  - `addNewURL(mode, row, index, url)`
  - `changePanelFeatureSetting(mode)`
  - `changePanelFeatureSwitcher()`
  - `changeScalingSetting(mode)`
  - `changeSecuritySetting(mode)`
  - `changeServerSetting(mode)`
  - `clickOkButton()`
  - `getAlertMsg()`
  - `getCheckedBoxSetting(mode)`
  - `getCheckedRadioSetting(mode)`
  - `getPanelFeaturesCheckBoxStatus(mode)`
  - `getPanelFeaturesSwitcherStatus()`
  - `getSettingValue(mode, row)`
  - `getSettingValueByIndex(mode, row, index)`
  - `getState()`
  - `getSuccessMsg()`
  - `inputSetting(mode, row, text)`
  - `openAdminTitle(title)`
  - `openCollabAdminPage()`
  - `openScalingSetting()`
  - `restartCollab()`
  - `saveSetting()`
  - `turnOffComment()`
  - `turnOffDiscussion()`
  - `turnOffDiscussionComment()`
  - `turnOnComment()`
  - `turnOnDiscussion()`
  - `turnOnDiscussionComment()`
- **Related components:** changePanel, getContentContainer, getPanel, openAdminPage

### CommentsPage
- **CSS root:** `.mstrd-Suggestion`
- **User-visible elements:**
  - All Active Comments (`.mstrd-CommentItem`)
  - Apply Filter Notification (`.mstrd-PageNotification-container--filter`)
  - Collaboration Panel Content (`.mstrd-DropdownMenu-main`)
  - Comment Box (`.ContentEditable.mstrd-CommentInputBox-input`)
  - Comments Panel (`.mstrd-CommentDropdownMenuContainer`)
  - Comments Panel For Saa S (`.mstrd-DropdownMenu-main`)
  - Editable Filter (`.mstrd-CommentInputBox-filter`)
  - Editable Input Box (`.ContentEditable.mstrd-CommentInputBox-input--active`)
  - Error Msg (`.mstrd-MessageBox-msg`)
  - Filter Check Box (`.mstrd-CommentInputBox-filterCheckbox`)
  - Input Box (`.mstrd-CommentInputBox`)
  - Mentioned Comment (`.mstrd-CommentItem--mention`)
  - Message Count (`.mstrd-CommentViewer-msgCount`)
  - Public Comment Tab (`.mstrd-CollabViewSwitch-comments`)
  - Suggestion Container (`.mstrd-Suggestion`)
- **Component actions:**
  - `addComment_test(text)`
  - `addComment(text)`
  - `addCommentWithEmbeddedFilter(text)`
  - `addCommentWithFilter(text)`
  - `addCommentWithUserMention(text, username, index = 0)`
  - `applyEmbeddedFilter(index)`
  - `applyEmbeddedFilterByName(name)`
  - `checkFilter()`
  - `clickErrorButton(buttonName)`
  - `clickFilterIcon()`
  - `clickInputBox()`
  - `clickMoreLink()`
  - `clickNevermind()`
  - `clickOnPageIconInComment(index)`
  - `clickUpgradeButtonInCommentsPanel()`
  - `closeCommentsPanel(option = 'close')`
  - `closeCommentsPanelForSaaS(option = 'close')`
  - `comment(index)`
  - `commentInput()`
  - `deleteAllComments()`
  - `deleteAllCommentsByUser(userName)`
  - `deleteComment(elem)`
  - `deleteCommentByIndex(index)`
  - `dockCommentPanel()`
  - `enableInputBox()`
  - `getAllActiveComments()`
  - `getCommentByIndex(index)`
  - `getErrorMsg()`
  - `getMentionedUserName(index)`
  - `getMessageCount()`
  - `getPageIconInComment(index)`
  - `hideTimeStampInComment()`
  - `hoverOnComment(elem)`
  - `hoverOnCommentByIndex(index)`
  - `isApplyEmbedFilterDisabled()`
  - `isCommentIconDisabled()`
  - `isCommentIconPresent()`
  - `isCommentMentioned(index)`
  - `isCommentPresent(index)`
  - `isCommentPresentByName(name)`
  - `isCommentsPanelForSaaSPresent()`
  - `isCurrentPageSwitched()`
  - `isDocked()`
  - `isDockIconDisplayed()`
  - `isFilterAdded(index)`
  - `isFilterApplied()`
  - `isFilterChecked()`
  - `isFilterIconPresent()`
  - `isLeftDocked()`
  - `isPanelCloseIconDisplayed()`
  - `isPanelOpen()`
  - `isPostEnabled()`
  - `isPublicCommentTabPresent()`
  - `isRightDocked()`
  - `isUndockIconDisplayed()`
  - `isUpgradeButtonInCommentsPanelPresent()`
  - `isUserMentioned(username, index)`
  - `isUserMentioned(username, mentionedBy)`
  - `isUserMentionedTxT(username, comment, index)`
  - `matchCount()`
  - `openCommentsPanel()`
  - `openCommentsPanelForSaaS()`
  - `postAndValidateComment(text)`
  - `postComment()`
  - `pressEnterInInputBox()`
  - `selectSuggestionItem(option, param)`
  - `suggestionItemByIndex(index)`
  - `suggestionItemDesc(index)`
  - `suggestionItemName(index)`
  - `suggestionItemUserInitials(index)`
  - `suggestionItemUserLogin(index)`
  - `suggestionItemUserName(index)`
  - `switchCurrentPage(mode)`
  - `undockCommentPanel()`
  - `waitForCommentPanelPresent()`
  - `waitForLoadingSuggestionItems()`
  - `waitForMentionedCommentPresent()`
- **Related components:** dossierPage, getCommentsPanel, getcurrentPage, getPage, getSuggestionContainer, getUpgradeButtonInCommentsPanel, isCurrentPage

### GroupDiscussionPage
- **CSS root:** `.mstrd-DiscussionTitle-nameContainerMute.icon-pnl_muted`
- **User-visible elements:**
  - Add New Button (`.mstrd-DiscussionViewer-addNew`)
  - Back Button In About Panel (`.mstrd-DiscussionAbout-titleIcon.icon-backarrow`)
  - Back Button In Detail Panel (`.mstrd-DiscussionTitle-navback.icon-backarrow`)
  - Badge Counnter In Discussion Icon (`.mstrd-DiscussionUserIcon-badge`)
  - Badge Counter In Discussion Tab (`.mstrd-CollabViewSwitch-discussionBadge`)
  - Confirm Discussion Name Button (`.mstrd-DiscussionAbout-renameEditorConfirm.icon-pnl_menucheck`)
  - Confirm Leave Button (`.mstrd-DiscussionAbout-quitConfirmBtns`)
  - Delete Button (`.mstrd-Button*=Delete`)
  - Delete Discussion Button (`.mstrd-DiscussionAbout-deleteChannel`)
  - Discussion About Panel (`.mstrd-DiscussionViewer-details`)
  - Discussion Edit Box (`.mstrd-DiscussionAbout-renameEditorInput`)
  - Discussion Info Icon (`.mstrd-DiscussionTitle-info`)
  - Discussion Name Box In About Panel (`.mstrd-DiscussionAbout-nameEditorText`)
  - Discussion Name Input Box (`.ant-input.mstrd-DiscussionEditor-nameInputBox`)
  - Discussion Panel (`.mstrd-DropdownMenu-content`)
  - Discussion Tab (`.mstrd-CollabViewSwitch-discussions`)
  - History Dissmiss Button (`.mstrd-DiscussionList-historyTagUserButton`)
  - History Invite Button (`.mstrd-DiscussionList-historyTagUserButton`)
  - Invite People Button (`.mstrd-DiscussionAbout-invite`)
  - Invite People Input (`.mstrd-MultiSearchSelect-input`)
  - Invite Window (`.ant-modal-content`)
  - Leave Button (`.mstrd-DiscussionAbout-quitChannel`)
  - Leave Confirm Msg (`.mstrd-DiscussionAbout-quitConfirmText`)
  - Message Input Box (`.mstrd-CommentInputBox`)
  - Mute Button (`.mstrd-DiscussionAbout-notificationSwitch`)
  - Mute Icon In Detail Panel (`.mstrd-DiscussionTitle-nameContainerMute.icon-pnl_muted`)
  - Mute Icon In Summary Panel (`.mstrd-DiscussionSummary-summaryInfoMute.icon-pnl_muted`)
  - Suggestion Container In Discussion (`.mstrd-MultiSearchSelect-dropdown-menu-item-group-list`)
  - Sungestion In Detail (`.mstrd-Suggestion`)
  - To Section (`.mstrd-MultiSearchSelect-input`)
  - View All Collapse Button (`.mstrd-DiscussionAbout-memberListViewAll`)
  - View Member Button (`.mstrd-DiscussionTitle-membersCount.icon-pnl_sharer`)
- **Component actions:**
  - `applyEmbeddedFilter({ messageIndex = 0, filterIndex = 0 })`
  - `cancelInvite()`
  - `clickDiscussionInfoIcon()`
  - `clickHistoryInviteButton()`
  - `clickNewDiscussion()`
  - `collapseExpandMember()`
  - `createNewDiscussion(username, index, discussionName = '', message)`
  - `deleteAllDiscussions()`
  - `deleteComment(elem)`
  - `deleteCommentByIndex(index)`
  - `deleteDisccusion()`
  - `enterAboutPanel(index)`
  - `enterExistingDiscussion(index)`
  - `getLastMemberLoginNameInAboutPanel()`
  - `goBackToDetailPanel()`
  - `goBackToSummaryPanel()`
  - `hideTimeStampInDiscussionDetail()`
  - `hideTimeStampInDiscussionSummary()`
  - `hoverAndDeleteCommentByIndex(index)`
  - `hoverOnComment(element)`
  - `hoverOnCommentByIndex(index)`
  - `inputInInvite(text)`
  - `invitePeople(username, index)`
  - `invitePeopleByName(username)`
  - `isDiscussionExisted()`
  - `isDiscussionTabPresent()`
  - `isFilterButtonEnabled({ messageIndex = 0, filterIndex = 0 })`
  - `isHistoryDiscussionNameChangedDisplayed(index, username, discussionName)`
  - `isHistoryTagUserHintDsiplayed(index, username)`
  - `isUserExisted(username, index)`
  - `isUserInvitedConfirmedMsgDisplayed(username, index)`
  - `isUserInvitedMsgDisplayed(username, index)`
  - `isUserNamePresent(username)`
  - `isUserRemovedMsgDisplayed(username, index)`
  - `leaveDiscussion()`
  - `openCommentsPanel()`
  - `openDiscussionTab()`
  - `openExistingDiscussion(index)`
  - `removeUser(index)`
  - `renameDiscussion(text)`
  - `selectExistingDiscussion(username, index)`
  - `selectSuggestionItem(index)`
  - `selectSuggestionItemByName(userName)`
  - `switchMuteNotification()`
  - `typeInGoToSection(text)`
  - `viewMember()`
  - `waitForLoadingSuggestionItems()`
- **Related components:** commentsPage, dossierPage, getBackButtonInAboutPanel, getBackButtonInDetailPanel, getDiscussionAboutPanel, getDiscussionNameBoxInAboutPanel, getDiscussionPanel, getMessagePanel, getSuggestionContainer, openCommentsPanel

### Notification
- **CSS root:** `.mstrd-DropdownMenu-main`
- **User-visible elements:**
  - Clear Msg Icon (`.mstrd-NotificationItem-btnDelete.icon-close`)
  - Close Icon (`.mstrd-DropdownMenu-headerIcon.icon-pnl_close`)
  - Empty Notifcation Msg (`mstrd-NotificationEmptyView-msg`)
  - Empty Txt (`.mstrd-NotificationEmptyView-msg`)
  - Loading Icon (`.mstrd-Loadable-loader`)
  - Notif Disabled Status (`.mstrd-NotificationIcon--disabled`)
  - Notification Icon (`.mstrd-NotificationIcon`)
  - Panel Main Content (`.mstrd-DropdownMenu-main`)
- **Component actions:**
  - `applySharedDossier(index)`
  - `clearAllMsgs()`
  - `clearExplicitMsg(text)`
  - `clearInviteMsgFromUser(userName)`
  - `clearMentionMsgFromUser(userName)`
  - `clearMsg(elem)`
  - `clearMsgByIndex(index)`
  - `closePanel()`
  - `explicitMsgCount(text)`
  - `getAllInviteMsgFromUser(userName)`
  - `getClearAllStatus()`
  - `getEmptyTxt()`
  - `getErrorMsg(index)`
  - `getExplicitMsg(text)`
  - `getMentionMsgFromUser(userName)`
  - `getSharedMessageText(index)`
  - `hideNotificationTimeStamp()`
  - `hoverOnInviteMsgFromUser(userName)`
  - `hoverOnMentionMsgFromUser(userName)`
  - `hoverOnMsg(elem)`
  - `hoverOnMsgByIndex(index)`
  - `ignoreSharedDossier(index)`
  - `inviteMsgFromUserCount(userName)`
  - `isActionButtonPresent(index)`
  - `isCloseButtonFocused()`
  - `isErrorMsgDisappear(index)`
  - `isErrorPresent(index)`
  - `isExplicitMsgPresent(text)`
  - `isMsgEnabled(index)`
  - `isNewMsgPresent()`
  - `isNotificationEnabled()`
  - `isNotificationNotEmpty()`
  - `isNotificationPanelPresent()`
  - `mentionMsgFromUserCount(userName)`
  - `notificationMsgByIndex(index)`
  - `notificationMsgCount()`
  - `openMentionMsgFromUser(userName)`
  - `openMsg(elem)`
  - `openMsgByIndex(index)`
  - `openMsgByOption(option)`
  - `openMsgFromUser(userName, option)`
  - `openNoitficationMsgByIndex(index, option)`
  - `openNotificationWithoutRedirection(index)`
  - `openPanel()`
  - `openPanelAndWaitListMsg()`
  - `openSharedMsg(userName, index)`
  - `waitForToolbar(index)`
- **Related components:** commentsPage, dossierPage, getPanel, groupDiscussionPage, isNotificationPanel, openPanel

## Common Workflows (from spec.ts)

1. [BCIN-5286_01] open create group discussion email notification by embedded filter (used in 1 specs)
2. [BCIN-5286_02] open mention user email notification in group discussion with embedded filter (used in 1 specs)
3. [TC20908_01] test guest login (used in 1 specs)
4. [TC20908_02] test user with no collab privilege (used in 1 specs)
5. [TC20908_03] test user with part project collab privilege (used in 1 specs)
6. [TC20908_04] check email for part access (used in 1 specs)
7. [TC20908_05] check group discussion for part access user in HM project (used in 1 specs)
8. [TC20908_06] check group discussion for part access user (used in 1 specs)
9. [TC65479_01] Post comment with user mention (used in 1 specs)
10. [TC65479_02_01] Check email with user mention (used in 1 specs)
11. [TC65479_02] Check notification with user mention (used in 1 specs)
12. [TC65479_03] Post comment with @filter (used in 1 specs)
13. [TC65479_04] Post comment with @filter and @user (used in 1 specs)
14. [TC65479_05_01] check email with @filter and @user (used in 1 specs)
15. [TC65479_05] check comment with @filter and @user (used in 1 specs)
16. [TC65479_06] check current page (used in 1 specs)
17. [TC65479] Collaboration - Library Web - Private Discussion with multiple users (used in 1 specs)
18. [TC67152] rename discussion (used in 1 specs)
19. [TC67161_01] Create discussion with one user (used in 1 specs)
20. [TC67161_02] create discussion with group (used in 1 specs)
21. [TC67161_03] test create new discussion in RSD (used in 1 specs)
22. [TC67161_04] create discussion with no member group (used in 1 specs)
23. [TC67161_05] test user search box when create discussion (used in 1 specs)
24. [TC67164_01] invite user in about panel (used in 1 specs)
25. [TC67164_02] invite users in discussion detail panenl (used in 1 specs)
26. [TC67164_03] reinvite user in about panel (used in 1 specs)
27. [TC67164_04] invite user in about panel (used in 1 specs)
28. [TC67166_01] test mute discussion_icon (used in 1 specs)
29. [TC67167_01] remove user in 2 user discussion (used in 1 specs)
30. [TC67167_02] leave discussion, 2nd user becomes owner (used in 1 specs)
31. [TC67171] view member (used in 1 specs)
32. [TC69679_01] create discussion with group (used in 1 specs)
33. [TC69679_02] create discussion and delete comments (used in 1 specs)
34. [TC70269_01] turn off comment and discussion (used in 1 specs)
35. [TC70269_02] enable discussion only (used in 1 specs)
36. [TC70269_03] enable comment only (used in 1 specs)
37. [TC70269_04] turn on comment and discussion (used in 1 specs)
38. [TC72080_01] set correct redis password for horizontal scaling (used in 1 specs)
39. [TC72080_02] set none scailing (used in 1 specs)
40. [TC72080_03] enable/disable logging (used in 1 specs)
41. [TC73216_01] test enable cors (used in 1 specs)
42. [TC75812_01] Collaboration - Library Web - Public comment with @filter and @user (used in 1 specs)
43. [TC75812_02] Collaboration - Library Web - Public comment with page icon (used in 1 specs)
44. Collaboration Admin Page Test (used in 1 specs)
45. Collaboration Defects (used in 1 specs)
46. E2E Collaboration for Tanzu (used in 1 specs)
47. E2E Collaboration of Business User (used in 1 specs)
48. E2E for Collab Privilege Check (used in 1 specs)
49. Manage Collaboration Feature Test (used in 1 specs)
50. Private Channel_01NewDiscussion (used in 1 specs)
51. Private Channel_02PostMsg (used in 1 specs)
52. Private Channel_03InviteUser (used in 1 specs)
53. Private Channel_04ManageDiscussion (used in 1 specs)
54. Private Channel_05Mute (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getSystemMessageByIndex -- frequency: 45
2. getMessageInputBox -- frequency: 32
3. getMessagePanel -- frequency: 32
4. getNewMsg -- frequency: 8
5. getState -- frequency: 8
6. getInvitedDiscussionMsg -- frequency: 6
7. {expected} -- frequency: 5
8. getBadgeCounnterInDiscussionIcon -- frequency: 5
9. getBadgeCounterInDiscussionTab -- frequency: 5
10. getAllActiveComments -- frequency: 4
11. getCheckedRadioSetting -- frequency: 4
12. getFirstMentionMsgFromUser -- frequency: 4
13. getLastMemberLoginNameInAboutPanel -- frequency: 4
14. getMessageCount -- frequency: 4
15. getTxtTitle_Dossier -- frequency: 4
16. getCommentsIcon -- frequency: 3
17. getNotificationMsgByIndex -- frequency: 3
18. getPanelMainContent -- frequency: 3
19. getAlertMsg -- frequency: 2
20. getCommentList -- frequency: 2
21. getCommentsPanel -- frequency: 2
22. getDiscussionAboutPanel -- frequency: 2
23. getFilterPanelDropdown -- frequency: 2
24. getMuteIconInDetailPanel -- frequency: 2
25. getMuteIconInSummaryPanel -- frequency: 2
26. getNotificationIcon -- frequency: 2
27. getSettingValue -- frequency: 2
28. getStartDiscussionMsgFromUser -- frequency: 2
29. getSuccessMsg -- frequency: 2
30. getSuggestionContainerInDiscussion -- frequency: 2
31. getTitle_Chapter -- frequency: 2
32. Add New Button -- frequency: 1
33. Alert Msg -- frequency: 1
34. All Active Comments -- frequency: 1
35. Apply Filter Notification -- frequency: 1
36. Back Button In About Panel -- frequency: 1
37. Back Button In Detail Panel -- frequency: 1
38. Badge Counnter In Discussion Icon -- frequency: 1
39. Badge Counter In Discussion Tab -- frequency: 1
40. Clear Msg Icon -- frequency: 1
41. Close Icon -- frequency: 1
42. Collaboration Panel Content -- frequency: 1
43. Comment Box -- frequency: 1
44. Comments Panel -- frequency: 1
45. Comments Panel For Saa S -- frequency: 1
46. Confirm Discussion Name Button -- frequency: 1
47. Confirm Leave Button -- frequency: 1
48. Delete Button -- frequency: 1
49. Delete Discussion Button -- frequency: 1
50. Discussion About Panel -- frequency: 1
51. Discussion Edit Box -- frequency: 1
52. Discussion Info Icon -- frequency: 1
53. Discussion Name Box In About Panel -- frequency: 1
54. Discussion Name Input Box -- frequency: 1
55. Discussion Panel -- frequency: 1
56. Discussion Tab -- frequency: 1
57. Editable Filter -- frequency: 1
58. Editable Input Box -- frequency: 1
59. Empty Notifcation Msg -- frequency: 1
60. Empty Txt -- frequency: 1
61. Error Msg -- frequency: 1
62. Filter Check Box -- frequency: 1
63. getCheckedBoxSetting -- frequency: 1
64. getClearAllStatus -- frequency: 1
65. getCommentBox -- frequency: 1
66. getDburl -- frequency: 1
67. getEditableInputBox -- frequency: 1
68. getEmptyTxt -- frequency: 1
69. getErrorMsg -- frequency: 1
70. getInvitePeopleButton -- frequency: 1
71. getInvitePeopleInput -- frequency: 1
72. getRemovedMsg -- frequency: 1
73. getSettingValueByIndex -- frequency: 1
74. getSungestionInDetail -- frequency: 1
75. getTitle_Page -- frequency: 1
76. History Dissmiss Button -- frequency: 1
77. History Invite Button -- frequency: 1
78. Input Box -- frequency: 1
79. Invite People Button -- frequency: 1
80. Invite People Input -- frequency: 1
81. Invite Window -- frequency: 1
82. Leave Button -- frequency: 1
83. Leave Confirm Msg -- frequency: 1
84. Loading Icon -- frequency: 1
85. Mentioned Comment -- frequency: 1
86. Message Count -- frequency: 1
87. Message Input Box -- frequency: 1
88. Msg Content -- frequency: 1
89. Mute Button -- frequency: 1
90. Mute Icon In Detail Panel -- frequency: 1
91. Mute Icon In Summary Panel -- frequency: 1
92. Notif Disabled Status -- frequency: 1
93. Notification Icon -- frequency: 1
94. Panel Features Switcher -- frequency: 1
95. Panel Main Content -- frequency: 1
96. Public Comment Tab -- frequency: 1
97. Saving Icon -- frequency: 1
98. Suggestion Container -- frequency: 1
99. Suggestion Container In Discussion -- frequency: 1
100. Sungestion In Detail -- frequency: 1
101. To Section -- frequency: 1
102. View All Collapse Button -- frequency: 1
103. View Member Button -- frequency: 1

## Key Actions

- `openDossier()` -- used in 47 specs
- `getSystemMessageByIndex()` -- used in 45 specs
- `openCommentsPanel()` -- used in 45 specs
- `switchUser()` -- used in 43 specs
- `getText()` -- used in 37 specs
- `closeCommentsPanel(option = 'close')` -- used in 32 specs
- `getMessageInputBox()` -- used in 32 specs
- `getMessagePanel()` -- used in 32 specs
- `openDiscussionTab()` -- used in 31 specs
- `hideTimeStampInDiscussionDetail()` -- used in 30 specs
- `postComment()` -- used in 27 specs
- `openPanel()` -- used in 25 specs
- `goBackToSummaryPanel()` -- used in 24 specs
- `deleteAllNotifications()` -- used in 21 specs
- `log()` -- used in 21 specs
- `login()` -- used in 20 specs
- `createNewDiscussion(username, index, discussionName = '', message)` -- used in 19 specs
- `clickDiscussionInfoIcon()` -- used in 17 specs
- `deleteAllTopics()` -- used in 17 specs
- `addCommentWithUserMention(text, username, index = 0)` -- used in 16 specs
- `goToLibrary()` -- used in 15 specs
- `sleep()` -- used in 14 specs
- `deleteAllComments()` -- used in 13 specs
- `goBackToDetailPanel()` -- used in 13 specs
- `addComment(text)` -- used in 11 specs
- `isDisplayed()` -- used in 11 specs
- `openViewInBrowserLink()` -- used in 11 specs
- `openMsgByOption(option)` -- used in 9 specs
- `clearMsgBox()` -- used in 8 specs
- `getNewMsg()` -- used in 8 specs
- `getState()` -- used in 8 specs
- `waitForItemLoading()` -- used in 8 specs
- `openCollabAdminPage()` -- used in 7 specs
- `saveSetting()` -- used in 7 specs
- `getInvitedDiscussionMsg()` -- used in 6 specs
- `switchToTab()` -- used in 6 specs
- `applyEmbeddedFilter({ messageIndex = 0, filterIndex = 0 })` -- used in 5 specs
- `checkFilter()` -- used in 5 specs
- `comment(index)` -- used in 5 specs
- `enterExistingDiscussion(index)` -- used in 5 specs
- `getBadgeCounnterInDiscussionIcon()` -- used in 5 specs
- `getBadgeCounterInDiscussionTab()` -- used in 5 specs
- `isUserMentioned(username, index)` -- used in 5 specs
- `openPageFromTocMenu()` -- used in 5 specs
- `waitForLibraryLoading()` -- used in 5 specs
- `clickLaunchButton()` -- used in 4 specs
- `currentURL()` -- used in 4 specs
- `getAllActiveComments()` -- used in 4 specs
- `getCheckedRadioSetting(mode)` -- used in 4 specs
- `getFirstMentionMsgFromUser()` -- used in 4 specs
- `getLastMemberLoginNameInAboutPanel()` -- used in 4 specs
- `getMessageCount()` -- used in 4 specs
- `getTxtTitle_Dossier()` -- used in 4 specs
- `includes()` -- used in 4 specs
- `isCommentIconPresent()` -- used in 4 specs
- `isDiscussionExisted()` -- used in 4 specs
- `isDiscussionTabPresent()` -- used in 4 specs
- `isNotificationEnabled()` -- used in 4 specs
- `isPublicCommentTabPresent()` -- used in 4 specs
- `openDefaultApp()` -- used in 4 specs
- `openMsgFromUser(userName, option)` -- used in 4 specs
- `openNotificationWithoutRedirection(index)` -- used in 4 specs
- `switchCurrentPage(mode)` -- used in 4 specs
- `toString()` -- used in 4 specs
- `url()` -- used in 4 specs
- `waitForDossierLoading()` -- used in 4 specs
- `changeSecuritySetting(mode)` -- used in 3 specs
- `closePanel()` -- used in 3 specs
- `deleteDisccusion()` -- used in 3 specs
- `getCommentsIcon()` -- used in 3 specs
- `getNotificationMsgByIndex()` -- used in 3 specs
- `getPanelMainContent()` -- used in 3 specs
- `hideNotificationTimeStamp()` -- used in 3 specs
- `invitePeopleByName(username)` -- used in 3 specs
- `isAccountIconPresent()` -- used in 3 specs
- `isFilterAdded(index)` -- used in 3 specs
- `isPanelOpen()` -- used in 3 specs
- `isRevertFilterDisplayed()` -- used in 3 specs
- `leaveDiscussion()` -- used in 3 specs
- `logout()` -- used in 3 specs
- `mentionMsgFromUserCount(userName)` -- used in 3 specs
- `openUserAccountMenu()` -- used in 3 specs
- `removeUser(index)` -- used in 3 specs
- `renameDiscussion(text)` -- used in 3 specs
- `switchMuteNotification()` -- used in 3 specs
- `turnOnComment()` -- used in 3 specs
- `turnOnDiscussion()` -- used in 3 specs
- `changeScalingSetting(mode)` -- used in 2 specs
- `changeServerSetting(mode)` -- used in 2 specs
- `clearAllMsgs()` -- used in 2 specs
- `clickHistoryInviteButton()` -- used in 2 specs
- `clickOkButton()` -- used in 2 specs
- `clickOnPageIconInComment(index)` -- used in 2 specs
- `getAlertMsg()` -- used in 2 specs
- `getCommentList()` -- used in 2 specs
- `getCommentsPanel()` -- used in 2 specs
- `getDiscussionAboutPanel()` -- used in 2 specs
- `getFilterPanelDropdown()` -- used in 2 specs
- `getMuteIconInDetailPanel()` -- used in 2 specs
- `getMuteIconInSummaryPanel()` -- used in 2 specs
- `getNotificationIcon()` -- used in 2 specs
- `getSettingValue(mode, row)` -- used in 2 specs
- `getStartDiscussionMsgFromUser()` -- used in 2 specs
- `getSuccessMsg()` -- used in 2 specs
- `getSuggestionContainerInDiscussion()` -- used in 2 specs
- `getTitle_Chapter()` -- used in 2 specs
- `hideTimeStampInComment()` -- used in 2 specs
- `inputSetting(mode, row, text)` -- used in 2 specs
- `isFilterButtonEnabled({ messageIndex = 0, filterIndex = 0 })` -- used in 2 specs
- `isUserExisted(username, index)` -- used in 2 specs
- `openDossierByUrl()` -- used in 2 specs
- `openFilterPanel()` -- used in 2 specs
- `openMsgByIndex(index)` -- used in 2 specs
- `openNoitficationMsgByIndex(index, option)` -- used in 2 specs
- `openScalingSetting()` -- used in 2 specs
- `restartCollab()` -- used in 2 specs
- `addComment_test(text)` -- used in 1 specs
- `addNewURL(mode, row, index, url)` -- used in 1 specs
- `cancelInvite()` -- used in 1 specs
- `clickErrorButton(buttonName)` -- used in 1 specs
- `clickIntroToLibrarySkip()` -- used in 1 specs
- `clickNewDiscussion()` -- used in 1 specs
- `closeCurrentTab()` -- used in 1 specs
- `closeTab()` -- used in 1 specs
- `collapseExpandMember()` -- used in 1 specs
- `deleteAllDiscussions()` -- used in 1 specs
- `enterAboutPanel(index)` -- used in 1 specs
- `getCheckedBoxSetting(mode)` -- used in 1 specs
- `getClearAllStatus()` -- used in 1 specs
- `getCommentBox()` -- used in 1 specs
- `getDburl()` -- used in 1 specs
- `getEditableInputBox()` -- used in 1 specs
- `getEmptyTxt()` -- used in 1 specs
- `getErrorMsg(index)` -- used in 1 specs
- `getInvitePeopleButton()` -- used in 1 specs
- `getInvitePeopleInput()` -- used in 1 specs
- `getRemovedMsg()` -- used in 1 specs
- `getSettingValueByIndex(mode, row, index)` -- used in 1 specs
- `getSungestionInDetail()` -- used in 1 specs
- `getTitle_Page()` -- used in 1 specs
- `hoverAndDeleteCommentByIndex(index)` -- used in 1 specs
- `inputInInvite(text)` -- used in 1 specs
- `inviteMsgFromUserCount(userName)` -- used in 1 specs
- `invitePeople(username, index)` -- used in 1 specs
- `isNotificationNotEmpty()` -- used in 1 specs
- `isUserMentionedTxT(username, comment, index)` -- used in 1 specs
- `loginAsGuest()` -- used in 1 specs
- `notificationMsgCount()` -- used in 1 specs
- `openAdminTitle(title)` -- used in 1 specs
- `openCustomAppById()` -- used in 1 specs
- `openMentionMsgFromUser(userName)` -- used in 1 specs
- `selectExistingDiscussion(username, index)` -- used in 1 specs
- `switchToNewWindowWithUrl()` -- used in 1 specs
- `turnOffComment()` -- used in 1 specs
- `turnOffDiscussion()` -- used in 1 specs
- `turnOffDiscussionComment()` -- used in 1 specs
- `typeInGoToSection(text)` -- used in 1 specs
- `viewMember()` -- used in 1 specs
- `addCommentWithEmbeddedFilter(text)` -- used in 0 specs
- `addCommentWithFilter(text)` -- used in 0 specs
- `applyEmbeddedFilter(index)` -- used in 0 specs
- `applyEmbeddedFilterByName(name)` -- used in 0 specs
- `applySharedDossier(index)` -- used in 0 specs
- `changePanelFeatureSetting(mode)` -- used in 0 specs
- `changePanelFeatureSwitcher()` -- used in 0 specs
- `clearExplicitMsg(text)` -- used in 0 specs
- `clearInviteMsgFromUser(userName)` -- used in 0 specs
- `clearMentionMsgFromUser(userName)` -- used in 0 specs
- `clearMsg(elem)` -- used in 0 specs
- `clearMsgByIndex(index)` -- used in 0 specs
- `clickFilterIcon()` -- used in 0 specs
- `clickInputBox()` -- used in 0 specs
- `clickMoreLink()` -- used in 0 specs
- `clickNevermind()` -- used in 0 specs
- `clickUpgradeButtonInCommentsPanel()` -- used in 0 specs
- `closeCommentsPanelForSaaS(option = 'close')` -- used in 0 specs
- `commentInput()` -- used in 0 specs
- `deleteAllCommentsByUser(userName)` -- used in 0 specs
- `deleteComment(elem)` -- used in 0 specs
- `deleteCommentByIndex(index)` -- used in 0 specs
- `dockCommentPanel()` -- used in 0 specs
- `enableInputBox()` -- used in 0 specs
- `explicitMsgCount(text)` -- used in 0 specs
- `getAllInviteMsgFromUser(userName)` -- used in 0 specs
- `getCommentByIndex(index)` -- used in 0 specs
- `getErrorMsg()` -- used in 0 specs
- `getExplicitMsg(text)` -- used in 0 specs
- `getMentionedUserName(index)` -- used in 0 specs
- `getMentionMsgFromUser(userName)` -- used in 0 specs
- `getPageIconInComment(index)` -- used in 0 specs
- `getPanelFeaturesCheckBoxStatus(mode)` -- used in 0 specs
- `getPanelFeaturesSwitcherStatus()` -- used in 0 specs
- `getSharedMessageText(index)` -- used in 0 specs
- `hideTimeStampInDiscussionSummary()` -- used in 0 specs
- `hoverOnComment(elem)` -- used in 0 specs
- `hoverOnComment(element)` -- used in 0 specs
- `hoverOnCommentByIndex(index)` -- used in 0 specs
- `hoverOnInviteMsgFromUser(userName)` -- used in 0 specs
- `hoverOnMentionMsgFromUser(userName)` -- used in 0 specs
- `hoverOnMsg(elem)` -- used in 0 specs
- `hoverOnMsgByIndex(index)` -- used in 0 specs
- `ignoreSharedDossier(index)` -- used in 0 specs
- `isActionButtonPresent(index)` -- used in 0 specs
- `isApplyEmbedFilterDisabled()` -- used in 0 specs
- `isCloseButtonFocused()` -- used in 0 specs
- `isCommentIconDisabled()` -- used in 0 specs
- `isCommentMentioned(index)` -- used in 0 specs
- `isCommentPresent(index)` -- used in 0 specs
- `isCommentPresentByName(name)` -- used in 0 specs
- `isCommentsPanelForSaaSPresent()` -- used in 0 specs
- `isCurrentPageSwitched()` -- used in 0 specs
- `isDocked()` -- used in 0 specs
- `isDockIconDisplayed()` -- used in 0 specs
- `isErrorMsgDisappear(index)` -- used in 0 specs
- `isErrorPresent(index)` -- used in 0 specs
- `isExplicitMsgPresent(text)` -- used in 0 specs
- `isFilterApplied()` -- used in 0 specs
- `isFilterChecked()` -- used in 0 specs
- `isFilterIconPresent()` -- used in 0 specs
- `isHistoryDiscussionNameChangedDisplayed(index, username, discussionName)` -- used in 0 specs
- `isHistoryTagUserHintDsiplayed(index, username)` -- used in 0 specs
- `isLeftDocked()` -- used in 0 specs
- `isMsgEnabled(index)` -- used in 0 specs
- `isNewMsgPresent()` -- used in 0 specs
- `isNotificationPanelPresent()` -- used in 0 specs
- `isPanelCloseIconDisplayed()` -- used in 0 specs
- `isPostEnabled()` -- used in 0 specs
- `isRightDocked()` -- used in 0 specs
- `isUndockIconDisplayed()` -- used in 0 specs
- `isUpgradeButtonInCommentsPanelPresent()` -- used in 0 specs
- `isUserInvitedConfirmedMsgDisplayed(username, index)` -- used in 0 specs
- `isUserInvitedMsgDisplayed(username, index)` -- used in 0 specs
- `isUserMentioned(username, mentionedBy)` -- used in 0 specs
- `isUserNamePresent(username)` -- used in 0 specs
- `isUserRemovedMsgDisplayed(username, index)` -- used in 0 specs
- `matchCount()` -- used in 0 specs
- `notificationMsgByIndex(index)` -- used in 0 specs
- `openCommentsPanelForSaaS()` -- used in 0 specs
- `openExistingDiscussion(index)` -- used in 0 specs
- `openMsg(elem)` -- used in 0 specs
- `openPanelAndWaitListMsg()` -- used in 0 specs
- `openSharedMsg(userName, index)` -- used in 0 specs
- `postAndValidateComment(text)` -- used in 0 specs
- `pressEnterInInputBox()` -- used in 0 specs
- `selectSuggestionItem(index)` -- used in 0 specs
- `selectSuggestionItem(option, param)` -- used in 0 specs
- `selectSuggestionItemByName(userName)` -- used in 0 specs
- `suggestionItemByIndex(index)` -- used in 0 specs
- `suggestionItemDesc(index)` -- used in 0 specs
- `suggestionItemName(index)` -- used in 0 specs
- `suggestionItemUserInitials(index)` -- used in 0 specs
- `suggestionItemUserLogin(index)` -- used in 0 specs
- `suggestionItemUserName(index)` -- used in 0 specs
- `turnOnDiscussionComment()` -- used in 0 specs
- `undockCommentPanel()` -- used in 0 specs
- `waitForCommentPanelPresent()` -- used in 0 specs
- `waitForLoadingSuggestionItems()` -- used in 0 specs
- `waitForMentionedCommentPresent()` -- used in 0 specs
- `waitForToolbar(index)` -- used in 0 specs

## Source Coverage

- `pageObjects/collaboration/**/*.js`
- `specs/regression/collaboration/**/*.{ts,js}`
