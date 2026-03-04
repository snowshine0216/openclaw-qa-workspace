# Site Knowledge: collaboration

> Components: 4

### CollabAdminPage
> Extends: `AdminPage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `MsgContent` | `.mstr-Admin-Modal-message` | element |
| `AlertMsg` | `.ant-alert-message` | element |
| `SavingIcon` | `.ant-spin-dot` | element |
| `PanelFeaturesSwitcher` | `.mstr-Admin-Switch` | element |

**Actions**
| Signature |
|-----------|
| `getState()` |
| `getSuccessMsg()` |
| `getAlertMsg()` |
| `getCheckedRadioSetting(mode)` |
| `getCheckedBoxSetting(mode)` |
| `getPanelFeaturesSwitcherStatus()` |
| `getPanelFeaturesCheckBoxStatus(mode)` |
| `restartCollab()` |
| `openCollabAdminPage()` |
| `openAdminTitle(title)` |
| `openScalingSetting()` |
| `changePanelFeatureSetting(mode)` |
| `changeServerSetting(mode)` |
| `changeSecuritySetting(mode)` |
| `changeScalingSetting(mode)` |
| `inputSetting(mode, row, text)` |
| `clickOkButton()` |
| `saveSetting()` |
| `getSettingValue(mode, row)` |
| `getSettingValueByIndex(mode, row, index)` |
| `addNewURL(mode, row, index, url)` |
| `changePanelFeatureSwitcher()` |
| `turnOnDiscussionComment()` |
| `turnOffDiscussionComment()` |
| `turnOnDiscussion()` |
| `turnOffDiscussion()` |
| `turnOnComment()` |
| `turnOffComment()` |

**Sub-components**
- getContentContainer
- getPanel
- openAdminPage
- changePanel

---

### CommentsPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `CollaborationPanelContent` | `.mstrd-DropdownMenu-main` | dropdown |
| `PublicCommentTab` | `.mstrd-CollabViewSwitch-comments` | element |
| `CommentsPanel` | `.mstrd-CommentDropdownMenuContainer` | dropdown |
| `CommentsPanelForSaaS` | `.mstrd-DropdownMenu-main` | dropdown |
| `InputBox` | `.mstrd-CommentInputBox` | input |
| `CommentBox` | `.ContentEditable.mstrd-CommentInputBox-input` | input |
| `EditableInputBox` | `.ContentEditable.mstrd-CommentInputBox-input--active` | input |
| `EditableFilter` | `.mstrd-CommentInputBox-filter` | input |
| `MessageCount` | `.mstrd-CommentViewer-msgCount` | element |
| `AllActiveComments` | `.mstrd-CommentItem` | element |
| `MentionedComment` | `.mstrd-CommentItem--mention` | element |
| `SuggestionContainer` | `.mstrd-Suggestion` | element |
| `ApplyFilterNotification` | `.mstrd-PageNotification-container--filter` | element |
| `ErrorMsg` | `.mstrd-MessageBox-msg` | element |
| `FilterCheckBox` | `.mstrd-CommentInputBox-filterCheckbox` | input |
| `currentPageSwitcher` | `.mstrd-CommentListSwitch-toggleSwitch` | element |

**Actions**
| Signature |
|-----------|
| `getMessageCount()` |
| `getAllActiveComments()` |
| `getCommentByIndex(index)` |
| `getMentionedUserName(index)` |
| `getErrorMsg()` |
| `clickErrorButton(buttonName)` |
| `getPageIconInComment(index)` |
| `openCommentsPanel()` |
| `openCommentsPanelForSaaS()` |
| `enableInputBox()` |
| `clickInputBox()` |
| `pressEnterInInputBox()` |
| `addComment(text)` |
| `addComment_test(text)` |
| `addCommentWithUserMention(text, username, index = 0)` |
| `addCommentWithFilter(text)` |
| `postComment()` |
| `postAndValidateComment(text)` |
| `hoverOnComment(elem)` |
| `hoverOnCommentByIndex(index)` |
| `deleteComment(elem)` |
| `deleteCommentByIndex(index)` |
| `deleteAllCommentsByUser(userName)` |
| `deleteAllComments()` |
| `dockCommentPanel()` |
| `undockCommentPanel()` |
| `clickNevermind()` |
| `clickMoreLink()` |
| `selectSuggestionItem(option, param)` |
| `waitForLoadingSuggestionItems()` |
| `applyEmbeddedFilter(index)` |
| `applyEmbeddedFilterByName(name)` |
| `closeCommentsPanel(option = 'close')` |
| `closeCommentsPanelForSaaS(option = 'close')` |
| `clickFilterIcon()` |
| `waitForMentionedCommentPresent()` |
| `checkFilter()` |
| `switchCurrentPage(mode)` |
| `clickOnPageIconInComment(index)` |
| `isPanelOpen()` |
| `isCommentIconPresent()` |
| `isCommentIconDisabled()` |
| `isPublicCommentTabPresent()` |
| `isFilterIconPresent()` |
| `isApplyEmbedFilterDisabled()` |
| `isFilterApplied()` |
| `isFilterAdded(index)` |
| `isDockIconDisplayed()` |
| `isUndockIconDisplayed()` |
| `isDocked()` |
| `isLeftDocked()` |
| `isRightDocked()` |
| `isPanelCloseIconDisplayed()` |
| `comment(index)` |
| `commentInput()` |
| `isPostEnabled()` |
| `isCommentPresent(index)` |
| `isCommentMentioned(index)` |
| `isUserMentioned(username, mentionedBy)` |
| `isUserMentionedTxT(username, comment, index)` |
| `isUserMentioned(username, index)` |
| `suggestionItemByIndex(index)` |
| `suggestionItemName(index)` |
| `suggestionItemDesc(index)` |
| `suggestionItemUserInitials(index)` |
| `suggestionItemUserName(index)` |
| `suggestionItemUserLogin(index)` |
| `matchCount()` |
| `isFilterChecked()` |
| `isCurrentPageSwitched()` |
| `addCommentWithEmbeddedFilter(text)` |
| `clickUpgradeButtonInCommentsPanel()` |
| `isCommentPresentByName(name)` |
| `hideTimeStampInComment()` |
| `waitForCommentPanelPresent()` |
| `isCommentsPanelForSaaSPresent()` |
| `isUpgradeButtonInCommentsPanelPresent()` |

**Sub-components**
- dossierPage
- getCommentsPanel
- getSuggestionContainer
- getcurrentPage
- isCurrentPage
- getPage
- getUpgradeButtonInCommentsPanel

---

### GroupDiscussionPage
> Extends: `CommentsPage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `DiscussionTab` | `.mstrd-CollabViewSwitch-discussions` | element |
| `AddNewButton` | `.mstrd-DiscussionViewer-addNew` | element |
| `ToSection` | `.mstrd-MultiSearchSelect-input` | input |
| `SuggestionContainerInDiscussion` | `.mstrd-MultiSearchSelect-dropdown-menu-item-group-list` | dropdown |
| `SungestionInDetail` | `.mstrd-Suggestion` | element |
| `DiscussionNameInputBox` | `.ant-input.mstrd-DiscussionEditor-nameInputBox` | input |
| `DiscussionPanel` | `.mstrd-DropdownMenu-content` | dropdown |
| `MessageInputBox` | `.mstrd-CommentInputBox` | input |
| `BadgeCounterInDiscussionTab` | `.mstrd-CollabViewSwitch-discussionBadge` | element |
| `BadgeCounnterInDiscussionIcon` | `.mstrd-DiscussionUserIcon-badge` | element |
| `MuteIconInSummaryPanel` | `.mstrd-DiscussionSummary-summaryInfoMute.icon-pnl_muted` | element |
| `DiscussionInfoIcon` | `.mstrd-DiscussionTitle-info` | element |
| `ViewMemberButton` | `.mstrd-DiscussionTitle-membersCount.icon-pnl_sharer` | element |
| `HistoryDissmissButton` | `.mstrd-DiscussionList-historyTagUserButton` | button |
| `HistoryInviteButton` | `.mstrd-DiscussionList-historyTagUserButton` | button |
| `MuteIconInDetailPanel` | `.mstrd-DiscussionTitle-nameContainerMute.icon-pnl_muted` | element |
| `DeleteButton` | `.mstrd-Button*=Delete` | button |
| `DiscussionAboutPanel` | `.mstrd-DiscussionViewer-details` | element |
| `DiscussionNameBoxInAboutPanel` | `.mstrd-DiscussionAbout-nameEditorText` | element |
| `DiscussionEditBox` | `.mstrd-DiscussionAbout-renameEditorInput` | input |
| `ConfirmDiscussionNameButton` | `.mstrd-DiscussionAbout-renameEditorConfirm.icon-pnl_menucheck` | element |
| `DeleteDiscussionButton` | `.mstrd-DiscussionAbout-deleteChannel` | element |
| `BackButtonInAboutPanel` | `.mstrd-DiscussionAbout-titleIcon.icon-backarrow` | element |
| `BackButtonInDetailPanel` | `.mstrd-DiscussionTitle-navback.icon-backarrow` | element |
| `InviteWindow` | `.ant-modal-content` | element |
| `InvitePeopleButton` | `.mstrd-DiscussionAbout-invite` | element |
| `InvitePeopleInput` | `.mstrd-MultiSearchSelect-input` | input |
| `LeaveButton` | `.mstrd-DiscussionAbout-quitChannel` | element |
| `LeaveConfirmMsg` | `.mstrd-DiscussionAbout-quitConfirmText` | element |
| `ConfirmLeaveButton` | `.mstrd-DiscussionAbout-quitConfirmBtns` | button |
| `ViewAllCollapseButton` | `.mstrd-DiscussionAbout-memberListViewAll` | element |
| `MuteButton` | `.mstrd-DiscussionAbout-notificationSwitch` | element |

**Actions**
| Signature |
|-----------|
| `getLastMemberLoginNameInAboutPanel()` |
| `openCommentsPanel()` |
| `openDiscussionTab()` |
| `selectSuggestionItem(index)` |
| `clickNewDiscussion()` |
| `typeInGoToSection(text)` |
| `selectSuggestionItemByName(userName)` |
| `waitForLoadingSuggestionItems()` |
| `createNewDiscussion(username, index, discussionName = '', message)` |
| `selectExistingDiscussion(username, index)` |
| `clickDiscussionInfoIcon()` |
| `deleteDisccusion()` |
| `enterExistingDiscussion(index)` |
| `removeUser(index)` |
| `goBackToDetailPanel()` |
| `goBackToSummaryPanel()` |
| `enterAboutPanel(index)` |
| `inputInInvite(text)` |
| `cancelInvite()` |
| `invitePeople(username, index)` |
| `invitePeopleByName(username)` |
| `clickHistoryInviteButton()` |
| `renameDiscussion(text)` |
| `viewMember()` |
| `collapseExpandMember()` |
| `leaveDiscussion()` |
| `switchMuteNotification()` |
| `hoverOnComment(element)` |
| `hoverOnCommentByIndex(index)` |
| `deleteComment(elem)` |
| `deleteCommentByIndex(index)` |
| `hoverAndDeleteCommentByIndex(index)` |
| `deleteAllDiscussions()` |
| `applyEmbeddedFilter({ messageIndex = 0, filterIndex = 0 })` |
| `isUserExisted(username, index)` |
| `isUserRemovedMsgDisplayed(username, index)` |
| `isUserInvitedMsgDisplayed(username, index)` |
| `isDiscussionExisted()` |
| `isUserInvitedConfirmedMsgDisplayed(username, index)` |
| `isHistoryTagUserHintDsiplayed(index, username)` |
| `isHistoryDiscussionNameChangedDisplayed(index, username, discussionName)` |
| `isDiscussionTabPresent()` |
| `isUserNamePresent(username)` |
| `hideTimeStampInDiscussionSummary()` |
| `hideTimeStampInDiscussionDetail()` |
| `openExistingDiscussion(index)` |
| `isFilterButtonEnabled({ messageIndex = 0, filterIndex = 0 })` |

**Sub-components**
- dossierPage
- commentsPage
- getMessagePanel
- getSuggestionContainer
- getDiscussionPanel
- getDiscussionAboutPanel
- getBackButtonInAboutPanel
- getBackButtonInDetailPanel
- openCommentsPanel
- getDiscussionNameBoxInAboutPanel

---

### Notification
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `NotificationIcon` | `.mstrd-NotificationIcon` | element |
| `NotifDisabledStatus` | `.mstrd-NotificationIcon--disabled` | element |
| `PanelMainContent` | `.mstrd-DropdownMenu-main` | dropdown |
| `EmptyNotifcationMsg` | `mstrd-NotificationEmptyView-msg` | element |
| `CloseIcon` | `.mstrd-DropdownMenu-headerIcon.icon-pnl_close` | dropdown |
| `ClearMsgIcon` | `.mstrd-NotificationItem-btnDelete.icon-close` | button |
| `EmptyTxt` | `.mstrd-NotificationEmptyView-msg` | element |
| `LoadingIcon` | `.mstrd-Loadable-loader` | element |

**Actions**
| Signature |
|-----------|
| `getMentionMsgFromUser(userName)` |
| `getAllInviteMsgFromUser(userName)` |
| `getExplicitMsg(text)` |
| `getEmptyTxt()` |
| `waitForToolbar(index)` |
| `hideNotificationTimeStamp()` |
| `openPanel()` |
| `closePanel()` |
| `openMsg(elem)` |
| `openMsgByIndex(index)` |
| `hoverOnMsg(elem)` |
| `hoverOnMsgByIndex(index)` |
| `hoverOnMentionMsgFromUser(userName)` |
| `hoverOnInviteMsgFromUser(userName)` |
| `clearMsg(elem)` |
| `clearMsgByIndex(index)` |
| `clearMentionMsgFromUser(userName)` |
| `clearInviteMsgFromUser(userName)` |
| `clearExplicitMsg(text)` |
| `clearAllMsgs()` |
| `openSharedMsg(userName, index)` |
| `openMentionMsgFromUser(userName)` |
| `openMsgFromUser(userName, option)` |
| `openMsgByOption(option)` |
| `openNotificationWithoutRedirection(index)` |
| `openNoitficationMsgByIndex(index, option)` |
| `applySharedDossier(index)` |
| `ignoreSharedDossier(index)` |
| `openPanelAndWaitListMsg()` |
| `isNotificationEnabled()` |
| `isNotificationNotEmpty()` |
| `notificationMsgByIndex(index)` |
| `notificationMsgCount()` |
| `mentionMsgFromUserCount(userName)` |
| `inviteMsgFromUserCount(userName)` |
| `explicitMsgCount(text)` |
| `isMsgEnabled(index)` |
| `isNewMsgPresent()` |
| `isExplicitMsgPresent(text)` |
| `isErrorPresent(index)` |
| `getErrorMsg(index)` |
| `isActionButtonPresent(index)` |
| `isErrorMsgDisappear(index)` |
| `getSharedMessageText(index)` |
| `getClearAllStatus()` |
| `isNotificationPanelPresent()` |
| `isCloseButtonFocused()` |

**Sub-components**
- dossierPage
- commentsPage
- groupDiscussionPage
- getPanel
- isNotificationPanel
- openPanel
