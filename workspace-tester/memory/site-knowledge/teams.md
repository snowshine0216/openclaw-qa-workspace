# Site Knowledge: Teams Domain

## Overview

- **Domain key:** `teams`
- **Components covered:** Apps, Conversation, MainTeams, MessageExtension, ModalDialog, PinFromChannel, ShareInTeamsDialog, ShareInTeamsDialog, TeamsDesktop, TeamsInteractiveChart, TeamsViewAllBotsPage
- **Spec files scanned:** 24
- **POM files scanned:** 11

## Components

### Apps
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `addBotToAConversation({ conversationName, appName = 'Library' })`
  - `openAppFromApps(appName)`
  - `openTeamsApp(appName)`
- **Related components:** _none_

### Conversation
- **CSS root:** `button#tab-remove-btn`
- **User-visible elements:**
  - Remove Tab Confirm Button (`button#tab-remove-btn`)
- **Component actions:**
  - `addBotFromConversation({ bot, isChannel = false })`
  - `askQuestions(question)`
  - `askQuestionsByWaiting({ question, isChannel = false, mention })`
  - `askQuestionsWithMention({ question = 'hi', mention = 'Library', isChannel = false })`
  - `chooseTab(tabName)`
  - `cleanDossierTabsinChannel(teamName, channelName)`
  - `clearChatHistory()`
  - `clickViewAllAgentsButtonOfLatestMessage()`
  - `clickViewAllBotsButtonOfLatestMessage()`
  - `clickViewMoreButtonOfLatestMessage()`
  - `getBotNameOnLatestMessage(isChannel = false)`
  - `getBotNameOnLatestMessageV2(isChannel = false)`
  - `getCardMessagesInLatestMessage()`
  - `getChatMessageByIndex(index)`
  - `getCoverImageInLatestMessageExtensionCard()`
  - `getLastestMessageContainer()`
  - `getLatestChatMessage()`
  - `getLatestControlMessage()`
  - `getLatestMessageExtensionCard()`
  - `getLatestResponse(isChannel)`
  - `getLinkInLatestMessage()`
  - `getMessageContainerCount()`
  - `getOpenInTeamsButtonInLatestExtensionCard()`
  - `getOpenInWebButtonInLatestMessageExtensionCard()`
  - `getResponseInLatestMessage()`
  - `getTagInLatestResponse(isChannel)`
  - `getTextInLatestCardMessage()`
  - `getTextInLatestMessage()`
  - `getTextInLatestResponse()`
  - `getTimestampOfLastControlMessage()`
  - `getTimestampOfLastMessage(isChannel = false)`
  - `getTotalReceivedMessageCount()`
  - `getViewAllAgentsButtonByIndex(index = 1)`
  - `getViewAllBotsButtonByIndex(index = 1)`
  - `getViewMoreButtonByIndex(index = 1)`
  - `getViewMoreMessageOfLatestMessage()`
  - `getVizImageInLatestMessage(isChannel = false)`
  - `isChannelOpened(channelName)`
  - `isTabSelectedInTeamsChannel(tabName, teamsName, channelName)`
  - `isVizSizeCorrectInLatestAnswer(isChannel = false)`
  - `openLatestObjectFromMessageExtensionInTeams()`
  - `openLatestObjectFromMessageExtensionInWeb()`
  - `openPinnedTab({ team, channel, tab })`
  - `removeBot({ conversation, isChannel = false })`
  - `removeDossiersTab(dossierNames)`
  - `removeTab(tab)`
  - `replyMessageByIndex({ idx, isQuestion = false })`
  - `switchToTabInChat(tabName)`
  - `waitForAnswerReady({ timestamp, isChannel })`
  - `waitForChatTabLoaded(chatName)`
  - `waitForMessageInAnswer(expectText, flag = true)`
  - `waitForNewAnswerarrival({ timestamp, isChannel })`
  - `waitForNewControlMessageArrival({ timestamp })`
  - `waitForTabAppear(tabName)`
  - `waitForWelcomePage({ currentCount })`
- **Related components:** getLastestMessageContainer, getMessageContainer

### MainTeams
- **CSS root:** `.mstrd-DossierViewContainer`
- **User-visible elements:**
  - Add New In Teams Library (`div.icon-pnl_add-new`)
  - Dossier Notification (`div.mstrd-DossierViewContainer-notifications`)
  - Dossier View Container (`.mstrd-DossierViewContainer`)
  - Error Page (`.mstrd-ErrorPage`)
  - Global Result Item (`a.mstrd-GlobalSearchResultListItem-link`)
  - Landing Page (`.mstrd-LoginPage`)
  - Message Input Box (`p`)
  - Search Box (`#ms-searchux-input`)
  - Spinner (`div.mstrd-Spinner`)
  - Teams Sign Out Button (`#me-control-sign-out-button`)
  - User Search Box For New Chat (`#people-picker-input`)
- **Component actions:**
  - `createNewChat({ user1, user2 })`
  - `dismissErrorMessageDuringPin()`
  - `getErrorPage()`
  - `getLandingPage()`
  - `getLibraryURLInBrowser()`
  - `getLibraryURLInBrowserIframe()`
  - `getMessagePreviewInActivity()`
  - `getSearchedUser(user)`
  - `isPopUpLoginPageExisting(windowLength, timeout = 5000)`
  - `isTeamsAppSelected(appName)`
  - `login()`
  - `logoutUserFromAzure(email)`
  - `openAppCatalog(scope = 'personal')`
  - `pinAppInChat(appName)`
  - `pinAppInSidebar(appName)`
  - `searchForApp(appName, scope = 'personal')`
  - `searchUserAndOpenChat(user)`
  - `showAppAnyway()`
  - `signOutFromTeams(email)`
  - `switchToAppInSidebar(appName)`
  - `switchToChannel(channelName)`
  - `switchToChat(username)`
  - `switchToEmbeddedDossierIframe(waitTime = 1000)`
  - `switchToLibraryIframe()`
  - `switchToModalIframe()`
  - `switchToTeamsChannel({ team: teamName, channel: channelName })`
  - `switchToTeamsWindow({ url, title, matchAll = false })`
  - `waitForChatView()`
  - `waitForLandingPage()`
  - `waitForLibraryIframeLoading({ elem, elemName })`
  - `waitForLibraryLoadingInFrame()`
  - `waitForNoPrivilegePage()`
  - `waitForObjectLoading(elemName = 'share')`
  - `waitForPopupWindowDisappear()`
  - `waitForTeamsView()`
- **Related components:** azureLoginPage, getErrorPage, getLandingPage, loginPage

### MessageExtension
- **CSS root:** `card`
- **User-visible elements:**
  - Preview Card In Input Box (`card`)
- **Component actions:**
  - `selectAppInMessageExtension({ appName, fromChannel })`
  - `selectObjectFromMessageExtension({ teamsApp, application, object, fromChannel })`
  - `shareObjectFromMessageExtension({
        teamsApp = 'Library', application = 'MicroStrategy', object, fromChannel = false, })`
- **Related components:** _none_

### ModalDialog
- **CSS root:** `.ant-select.mstrd-CustomAppSelect`
- **User-visible elements:**
  - Application Dropdown List (`.ant-select.mstrd-CustomAppSelect`)
  - Back Button (`.icon-back-lib`)
  - Content Group Dropdown List (`.mstrd-ContentGroupSelect`)
  - Default Dossier Cover Image (`div.mstrd-DefaultDossierCoverImage`)
  - Dialog Header (`.mstrd-ContentPage-header`)
  - Object Count (`.mstrd-VirtualizedDossierList-title-header`)
  - Object List (`.mstrd-LibraryContentView`)
  - Save Button (`#tab-save-btn`)
  - Search Box (`input.ant-input`)
  - Searched List (`.mstrd-DossierSearchResultView-content`)
  - Search Icon (`.icon-search`)
  - Share Button (`.mstrd-ContentPageFooter-share`)
  - Tab Config Page (`div.mstrd-TabConfigPage`)
  - Type Dropdown List (`.mstrd-ContentTypeSelect`)
  - Warning Text For New Chat (`.mstrd-ContentPageFooter-warning`)
- **Component actions:**
  - `back()`
  - `changeContentGroup(contentGroupName)`
  - `changeTabInSearchResult(tabName)`
  - `changeType(typeName)`
  - `chooseDossier(dossierName, search = true)`
  - `chooseDossierAndSave(dossierName, search = true)`
  - `closeMessageExtensionDialog()`
  - `closeModalDialog()`
  - `isShareButtonDisabled()`
  - `isShareButtonDisabled()`
  - `searchObject(objectName)`
  - `switchToApp(appName)`
  - `triggerTooltip(objectName)`
  - `waitForDossierList()`
  - `waitForObjectLoadingInMessageExtension(elemName = 'search')`
- **Related components:** _none_

### PinFromChannel
- **CSS root:** `#addTabButton`
- **User-visible elements:**
  - Add Tab Button (`#addTabButton`)
- **Component actions:**
  - `pinNewDossierFromChannel(appName)`
  - `seeAllApps()`
- **Related components:** _none_

### ShareInTeamsDialog
- **CSS root:** `input#rc_select_1`
- **User-visible elements:**
  - Channel Input In Pin To Team Dialog (`input#rc_select_1`)
  - Pin To Teams Name And Time (`div.mstrd-PinToTeamsTabDialog-nameAndTime`)
  - Select Array Loading Icon (`div.ant-select-arrow-loading`)
  - Team Input In Pin To Team Dialog (`input#rc_select_0`)
  - White Spinner (`div.mstrd-Spinner--white`)
- **Component actions:**
  - `hideNameAndTimeInPinToTeamsDialog()`
  - `selectChannelWithKeyWord(keyword = 'General')`
  - `selectTeamWithKeyWord(keyword = 'Test')`
- **Related components:** _none_

### ShareInTeamsDialog
- **CSS root:** `p br`
- **User-visible elements:**
  - Message Input Box (`p br`)
  - Receipient Input Box (`input.ui-box`)
- **Component actions:**
  - `shareToReceipientInTeams({ receipient: receipientName, text: text })`
  - `viewSharedMessage()`
- **Related components:** _none_

### TeamsDesktop
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `checkCurrentTeamsUser(userEmail)`
  - `closeNewPopupWindow()`
  - `loginStandardUser(standard_credentials)`
  - `switchToActiveWindow(url, title)`
  - `switchToTeamsUser(userName, url, title)`
  - `switchToTeamsUserIfNeeded(userName, url, title)`
- **Related components:** isPopUpLoginPage, loginPage

### TeamsInteractiveChart
- **CSS root:** `.mstr-ai-chatbot-ChartOptionButton-menu`
- **User-visible elements:**
  - Chart Option Menu (`.mstr-ai-chatbot-ChartOptionButton-menu`)
  - Chart Option Sub Menu (`.mstr-ai-chatbot-ChartOptionButton-subContent`)
  - Iframe (`iframe`)
  - Interpretation Button (`.mstr-ai-chatbot-InterpretationForTeams-explanation-btn`)
  - Interpretation Wrapper (`.mstr-ai-chatbot-InterpretationForTeams-markdown-wrapper`)
  - Visualization (`.mstr-ai-chatbot-VizPageForTeams-content.mstr-ai-chatbot-VisualizationBubbleV2-viz2`)
- **Component actions:**
  - `checkMenuOptionEnabled(option, value)`
  - `clickInterpretationButton()`
  - `closeInteractiveChartWindow()`
  - `getInterpretationBackgroundColor()`
  - `modifyChartOption(option, value)`
  - `waitForLoadingOfViz()`
- **Related components:** _none_

### TeamsViewAllBotsPage
- **CSS root:** `.mstrd-ViewMorePage .mstrd-VirtualizedDossierList`
- **User-visible elements:**
  - Bot List Container (`.mstrd-ViewMorePage .mstrd-VirtualizedDossierList`)
  - Iframe (`iframe`)
  - Tooltip Container (`.ant-popover .mstrd-DossierInfoContainer-popover:not(.ant-popover-hidden)`)
- **Component actions:**
  - `closeViewAllBotsWindow()`
  - `scrollToBottom()`
  - `scrollToTop()`
  - `triggerTooltipOnBotItem(index = 1)`
  - `waitForLoadingInViewAllBots()`
- **Related components:** getBotListContainer, getTooltipContainer

## Common Workflows (from spec.ts)

1. Teams Library app End to End (used in 2 specs)
2. [TC00000001] Test on new teams sidebar app (used in 1 specs)
3. [TC00000002] Test on new teams pinned dossier (used in 1 specs)
4. [TC00000003] Test on new teams pin new dossier (used in 1 specs)
5. [TC91306] Verify Library authentication - OIDC login Pinned Dossier in Teams Browser (used in 1 specs)
6. [TC91307] Verify Library authentication - standard login Pinned Dossier in Teams Browser (used in 1 specs)
7. [TC91308] Verify Teams SSO - Pinned Dossier in Teams Browser (used in 1 specs)
8. [TC91309] Verify Library authentication - SAML login Pinned Dossier in Teams Browser (used in 1 specs)
9. [TC91310] Verify Library authentication - cancel login (used in 1 specs)
10. [TC91311] Verify Teams SSO - switch user (used in 1 specs)
11. [TC91312] Verify Library Authentication session timeout in Teams Sidebar in Teams Desktop (used in 1 specs)
12. [TC91317] Verify Teams SSO - no Privilege user (used in 1 specs)
13. [TC91380] Test app visibility - user can find Teams Library app in app catalog (used in 1 specs)
14. [TC91381] Test app function - User can open dossier from Teams app and pin it to target Teams channel (used in 1 specs)
15. [TC91382] Test app function - User can add a dossier into channel Tab (used in 1 specs)
16. [TC91383] Test app function - User can perform search in Teams app, yet the result limits to dossier type only (used in 1 specs)
17. [TC91384] User will view customized appearance designed for Library Teams app in Library home page (used in 1 specs)
18. [TC91398] User will view customized appearance designed for Library Teams app in Dossier Consumption page (used in 1 specs)
19. [TC91401] linking should be handled properly in teams app (used in 1 specs)
20. [TC91408] In Teams app Library, the i18n setting in perference works the same as in OOTB Library (used in 1 specs)
21. [TC91455] User can pin a dossier to Teams channel Tab with application and page specified (used in 1 specs)
22. [TC91459] Verify Library authentication - Login in Sidebar, then switch pinned dossier (used in 1 specs)
23. [TC92134] Verify Library authentication - standard login in Teams Sidebar in Teams Browser (used in 1 specs)
24. [TC92163] Verify Library authentication - SAML login in Teams Sidebar in Teams Browser (used in 1 specs)
25. [TC92164] Verify Library authentication - OIDC login in Teams Sidebar in Teams Browser (used in 1 specs)
26. [TC92165] Verify Library authentication - Guest login in Teams Sidebar in Teams Browser (used in 1 specs)
27. [TC92166] Verify Library authentication - Trust login in Teams Sidebar in Teams Browser (used in 1 specs)
28. [TC92168] Verify Teams SSO login in Teams Sidebar in Teams Browser (used in 1 specs)
29. [TC92170] Verify Library authentication - standard login Pin New Dossier in Teams Browser (used in 1 specs)
30. [TC92171] Verify Library authentication - SAML login Pin New Dossier in Teams Browser (used in 1 specs)
31. [TC92172] Verify Library authentication - OIDC login Pin New Dossier in Teams Browser (used in 1 specs)
32. [TC92173] Verify Library authentication - Guest Pin New Dossier in Teams Browser (used in 1 specs)
33. [TC92174] Verify Library authentication - Trust login Pin New Dossier in Teams Browser (used in 1 specs)
34. [TC92175] Verify Teams SSO - Pin New Dossier in Teams Browser (used in 1 specs)
35. [TC92356] Verify Library authentication - standard login in Teams Sidebar in Teams Desktop (used in 1 specs)
36. [TC92357] Verify Library authentication - SAML login in Teams Sidebar in Teams Desktop (used in 1 specs)
37. [TC92358] Verify Library authentication - OIDC login in Teams Sidebar in Teams Desktop (used in 1 specs)
38. [TC92359] Verify Library authentication - Guest login in Teams Sidebar in Teams Desktop (used in 1 specs)
39. [TC92360] Verify Library authentication - Trust login in Teams Sidebar in Teams Desktop (used in 1 specs)
40. [TC92361][TC93049] Verify Teams SSO login in Teams Sidebar in Teams Desktop (used in 1 specs)
41. [TC92362] Verify Library authentication - standard login Pin New Dossier in Teams Desktop (used in 1 specs)
42. [TC92363] Verify Library authentication - SAML login Pin New Dossier in Teams Desktop (used in 1 specs)
43. [TC92364] Verify Library authentication - OIDC login Pin New Dossier in Teams Desktop (used in 1 specs)
44. [TC92365] Verify Library authentication - Guest Pin New Dossier in Teams Desktop (used in 1 specs)
45. [TC92366] Verify Library authentication - Trust login Pin New Dossier in Teams Desktop (used in 1 specs)
46. [TC92367] Verify Teams SSO - Pin New Dossier in Teams Desktop (used in 1 specs)
47. [TC92802_01] Verify copy button in pinned bot (used in 1 specs)
48. [TC92802_02] Verify pin bot from share panel, custom app, bot not in library (used in 1 specs)
49. [TC92802_03] Verify pin bot from context menu (used in 1 specs)
50. [TC92802_04] Verify pin bot from pinned bot (used in 1 specs)
51. [TC92802_05] Verify function of pin bot from channel (used in 1 specs)
52. [TC92802_06] Error handling (used in 1 specs)
53. [TC92863_01] Share bot from bot context menu (used in 1 specs)
54. [TC92863_02] Share bot from share panel, bot as home (used in 1 specs)
55. [TC92863_03] Share bot from pinned bot (used in 1 specs)
56. [TC92868_01] Enable bot in Teams (used in 1 specs)
57. [TC92868_02] Bot as home in Teams (used in 1 specs)
58. [TC92868_03] Error handling of bot in Teams (used in 1 specs)
59. [TC93027] Verify Library authentication - Guest Pinned Dossier in Teams Browser (used in 1 specs)
60. [TC93028] Verify Library authentication - Trust login Pinned Dossier in Teams Browser (used in 1 specs)
61. [TC93029] Verify Library authentication - login in teams, share session with library web (used in 1 specs)
62. [TC93030] Verify Teams SSO - login in teams, not share session with library web (used in 1 specs)
63. [TC93031] Verify Library authentication - Switch user (used in 1 specs)
64. [TC93032] Verify Guest env configured with Teams SSO, should login as Guest (used in 1 specs)
65. [TC93033] Verify Teams SSO - no trust relationship (used in 1 specs)
66. [TC93034] Verify Library authentication - no use Application office Privilege user (used in 1 specs)
67. [TC93133] Verify Teams SSO session timeout in Teams Sidebar in Teams Desktop (used in 1 specs)
68. [TC93135] Verify Teams session timeout when pin new dossier in Teams Desktop (used in 1 specs)
69. [TC93136] Verify Library Authentication session timeout when pin new dossier in Teams Desktop (used in 1 specs)
70. [TC93558_01] Share dossier from context menu (used in 1 specs)
71. [TC93558_02] Share dossier from share panel, dossier as home, no bookmark (used in 1 specs)
72. [TC93558_03] Share dossier from pinned dossier, 2 bookmarks (used in 1 specs)
73. [TC93975_01] Share bot in group (used in 1 specs)
74. [TC93975_02] Share dashboard in channel (used in 1 specs)
75. [TC93975_03] Test UI of share object from message extenstion in channel (used in 1 specs)
76. [TC93975_04] Cover image in shared card, chat (used in 1 specs)
77. [TC93975_05] Test warning message when share in new chat (used in 1 specs)
78. [TC93976_01] Share bot in channel (used in 1 specs)
79. [TC93976_02] Share dashboard in chat (used in 1 specs)
80. [TC93976_03] Test UI of share object from message extenstion in group (used in 1 specs)
81. [TC93976_04] Cover image in shared card, channel (used in 1 specs)
82. [TC93976_05] Test warning message when share in new chat (used in 1 specs)
83. [TC93989] Verify Teams locale in Teams Desktop (used in 1 specs)
84. [TC95620_01] trigger welcome page in 1-1 chat (used in 1 specs)
85. [TC95620_02] show greetings when hover on bot in view all bots window (used in 1 specs)
86. [TC95620_03] send greeting in 1-1 chat (used in 1 specs)
87. [TC95620_04] send hi in group chat (used in 1 specs)
88. [TC95620_05] send greeting in group chat (used in 1 specs)
89. [TC95620_06] send greeting in teams channel (used in 1 specs)
90. [TC95620_07] Welcome card in teams web (used in 1 specs)
91. [TC95620_08] greeting tooltip on view all bots (used in 1 specs)
92. [TC95620_09] switch user with different welcome contents (used in 1 specs)
93. [TC95621_01] follow up questions to summarize in 1-1 chat (used in 1 specs)
94. [TC95621_02] follow up questions to aggregate in 1-1 chat (used in 1 specs)
95. [TC95621_03] follow up questions to change viz type in 1-1 chat (used in 1 specs)
96. [TC95621_04] follow up questions to sort in 1-1 chat (used in 1 specs)
97. [TC95621_05] follow up questions to quote question in group chat (used in 1 specs)
98. [TC95621_06] follow up questions to change viz template in group chat (used in 1 specs)
99. [TC95621_07] follow up questions to re-use context template in group chat (used in 1 specs)
100. [TC95621_08] follow up questions to use another bot in group chat (used in 1 specs)
101. [TC95661_01] Verify QA in 1-1 chat (used in 1 specs)
102. [TC95661_02] Verify QA in group chat (used in 1 specs)
103. [TC95661_03] Verify QA in channel (used in 1 specs)
104. [TC95661_04] Verify privilege error (used in 1 specs)
105. [TC95661_05] Verify no bots error (used in 1 specs)
106. [TC95661_06] Check typing animation (used in 1 specs)
107. [TC95764_01] Add bot from Get Bots (used in 1 specs)
108. [TC95764_02] Add bot from Apps (used in 1 specs)
109. [TC96672_01] no execute acl permission (used in 1 specs)
110. [TC96672_02] no read acl permission (used in 1 specs)
111. [TC96672_03] only read and execute acl permission (used in 1 specs)
112. Add and remove app to conversation in Teams (used in 1 specs)
113. Bot interface in Teams (used in 1 specs)
114. Library Authentication - New Teams (used in 1 specs)
115. message extension_open in teams (used in 1 specs)
116. message extension_open in web (used in 1 specs)
117. New Teams End to End (used in 1 specs)
118. Pin Bot to Teams Channel (used in 1 specs)
119. Pin in sidebar - Teams Authentication (used in 1 specs)
120. Pin in sidebar - Teams Authentication - Browser (used in 1 specs)
121. Pin New Dossier in Channel - Teams Authentication (used in 1 specs)
122. Pin New Dossier in Channel - Teams Authentication - Browser (used in 1 specs)
123. Pinned Dossier in Channel - Teams Authentication (used in 1 specs)
124. QA (used in 1 specs)
125. Session Time out - Teams Authentication (used in 1 specs)
126. Share Bot in Web Teams (used in 1 specs)
127. Share Dossier in Web Teams (used in 1 specs)
128. Teams Authentication - New Teams - Browser (used in 1 specs)
129. Teams SSO - New Teams (used in 1 specs)
130. Test follow up questions in Teams (used in 1 specs)
131. Test welcome ACL permssion in Teams (used in 1 specs)
132. Test welcome and greeting in Teams (used in 1 specs)
133. Test Welcome page in teams web (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getLatestReceivedChatMessage -- frequency: 25
2. getBrowserTabs -- frequency: 21
3. getTextInLatestMessage -- frequency: 14
4. getCoverImageInLatestMessageExtensionCard -- frequency: 12
5. getDossierView -- frequency: 12
6. getErrorDialogue -- frequency: 11
7. getInputBoxInTeams -- frequency: 11
8. getPageTitle -- frequency: 11
9. getDossier -- frequency: 10
10. {expected} -- frequency: 9
11. getBotListContainer -- frequency: 9
12. getUserName -- frequency: 9
13. {actual} -- frequency: 8
14. getAccountDropdown -- frequency: 8
15. getLandingPage -- frequency: 8
16. getVizImageInLatestMessage -- frequency: 8
17. getLinkInLatestMessage -- frequency: 6
18. getObjectCount -- frequency: 5
19. getTextInLatestResponse -- frequency: 5
20. getTitleBarBotName -- frequency: 5
21. getBadgeOnActivity -- frequency: 4
22. getDossierViewContainer -- frequency: 4
23. getNavigationBar -- frequency: 4
24. getPinInTeamsDialog -- frequency: 4
25. getUsernameForm -- frequency: 4
26. getWarningTextForNewChat -- frequency: 4
27. getAttribute -- frequency: 3
28. getBotNameOnLatestMessage -- frequency: 3
29. getChatBotVizByType -- frequency: 3
30. getErrorPage -- frequency: 3
31. getLatestChatMessage -- frequency: 3
32. getLibraryIcon -- frequency: 3
33. getShowTheToolbarButton -- frequency: 3
34. getTypeDropdownList -- frequency: 3
35. getTypingAnimation -- frequency: 3
36. getWelcomePageMessageTexts -- frequency: 3
37. getActionButtonsCount -- frequency: 2
38. getAppDetailsDialog -- frequency: 2
39. getCloseInAddApps -- frequency: 2
40. getContentGroupDropdownList -- frequency: 2
41. getDialog -- frequency: 2
42. getGridCellValue -- frequency: 2
43. getInputBox -- frequency: 2
44. getLatestControlMessage -- frequency: 2
45. getLibraryURLInBrowser -- frequency: 2
46. getMessagePreviewInActivity -- frequency: 2
47. getPinInPinToTeamDialog -- frequency: 2
48. getSearchIcon -- frequency: 2
49. getShareButton -- frequency: 2
50. getTagInLatestResponse -- frequency: 2
51. getTimestampOfLastControlMessage -- frequency: 2
52. getViewModeSwitchGridViewOption -- frequency: 2
53. getWhiteSpinner -- frequency: 2
54. Iframe -- frequency: 2
55. Message Input Box -- frequency: 2
56. Search Box -- frequency: 2
57. Add New In Teams Library -- frequency: 1
58. Add Tab Button -- frequency: 1
59. Application Dropdown List -- frequency: 1
60. Back Button -- frequency: 1
61. Bot List Container -- frequency: 1
62. Channel Input In Pin To Team Dialog -- frequency: 1
63. Chart Option Menu -- frequency: 1
64. Chart Option Sub Menu -- frequency: 1
65. Content Group Dropdown List -- frequency: 1
66. Default Dossier Cover Image -- frequency: 1
67. Dialog Header -- frequency: 1
68. Dossier Notification -- frequency: 1
69. Dossier View Container -- frequency: 1
70. Error Page -- frequency: 1
71. getAccountMenuOption -- frequency: 1
72. getAllSection -- frequency: 1
73. getAllTabCount -- frequency: 1
74. getAppInSidebar -- frequency: 1
75. getBotActiveSwitchInInfoWindow -- frequency: 1
76. getCloseButton -- frequency: 1
77. getContentDiscoveryPanelDetailPanel -- frequency: 1
78. getContentInPinInTeamsDialog -- frequency: 1
79. getCustomAppBody -- frequency: 1
80. getCustomAppByName -- frequency: 1
81. getDefaultDossierCoverImage -- frequency: 1
82. getDialogHeader -- frequency: 1
83. getDossierNotification -- frequency: 1
84. getEditButtonInInfoWindow -- frequency: 1
85. getEmbeddedBotButtonInInfoWindow -- frequency: 1
86. getErrorMessageDuringPin -- frequency: 1
87. getFavoriteButton -- frequency: 1
88. getFavoriteButtonInInfoWindow -- frequency: 1
89. getFilterBarItem -- frequency: 1
90. getFilterContainer -- frequency: 1
91. getFirstAppInPerosnalAppCatalog -- frequency: 1
92. getFirstDossierRowActionBar -- frequency: 1
93. getGlobalResultItem -- frequency: 1
94. getInstalledAppListInAddTab -- frequency: 1
95. getInstalledAppListInMoreApps -- frequency: 1
96. getItem -- frequency: 1
97. getItemRowListInContentDiscovery -- frequency: 1
98. getManageAccessButtonInInfoWindow -- frequency: 1
99. getMessageBoxContainer -- frequency: 1
100. getObjectList -- frequency: 1
101. getPostMessageButtonInChat -- frequency: 1
102. getRemoveButton -- frequency: 1
103. getResponseInLatestMessage -- frequency: 1
104. getResultItemByName -- frequency: 1
105. getSearchBox -- frequency: 1
106. getSearchedBotInSuggestions -- frequency: 1
107. getSearchedList -- frequency: 1
108. getShareButtonInInfoWindow -- frequency: 1
109. getSidebarContainer -- frequency: 1
110. getSortBox -- frequency: 1
111. getSpinner -- frequency: 1
112. getStartPostButtonInChannel -- frequency: 1
113. getTabConfigPage -- frequency: 1
114. getTextBoxInTeams -- frequency: 1
115. getViewModeSwitch -- frequency: 1
116. Global Result Item -- frequency: 1
117. Interpretation Button -- frequency: 1
118. Interpretation Wrapper -- frequency: 1
119. Landing Page -- frequency: 1
120. Object Count -- frequency: 1
121. Object List -- frequency: 1
122. Pin To Teams Name And Time -- frequency: 1
123. Preview Card In Input Box -- frequency: 1
124. Receipient Input Box -- frequency: 1
125. Remove Tab Confirm Button -- frequency: 1
126. Save Button -- frequency: 1
127. Search Icon -- frequency: 1
128. Searched List -- frequency: 1
129. Select Array Loading Icon -- frequency: 1
130. Share Button -- frequency: 1
131. Spinner -- frequency: 1
132. Tab Config Page -- frequency: 1
133. Team Input In Pin To Team Dialog -- frequency: 1
134. Teams Sign Out Button -- frequency: 1
135. Tooltip Container -- frequency: 1
136. Type Dropdown List -- frequency: 1
137. User Search Box For New Chat -- frequency: 1
138. Visualization -- frequency: 1
139. Warning Text For New Chat -- frequency: 1
140. White Spinner -- frequency: 1

## Key Actions

- `switchToAppInSidebar(appName)` -- used in 93 specs
- `log()` -- used in 89 specs
- `switchToLibraryIframe()` -- used in 72 specs
- `waitForDossierLoading()` -- used in 55 specs
- `askQuestionsByWaiting({ question, isChannel = false, mention })` -- used in 51 specs
- `isDisplayed()` -- used in 48 specs
- `switchToActiveWindow(url, title)` -- used in 48 specs
- `waitForElementVisible()` -- used in 45 specs
- `login()` -- used in 42 specs
- `waitForLibraryLoading()` -- used in 42 specs
- `waitForLandingPage()` -- used in 34 specs
- `switchToFrame()` -- used in 32 specs
- `switchToTeamsUser(userName, url, title)` -- used in 31 specs
- `switchToChat(username)` -- used in 30 specs
- `checkCurrentTeamsUser(userEmail)` -- used in 29 specs
- `switchToChannel(channelName)` -- used in 28 specs
- `switchToTab()` -- used in 26 specs
- `getLatestReceivedChatMessage()` -- used in 25 specs
- `title()` -- used in 24 specs
- `chooseTab(tabName)` -- used in 23 specs
- `getText()` -- used in 23 specs
- `shareObjectFromMessageExtension({
        teamsApp = 'Library', application = 'MicroStrategy', object, fromChannel = false, })` -- used in 23 specs
- `switchToTeamsChannel({ team: teamName, channel: channelName })` -- used in 23 specs
- `isPopUpLoginPageExisting(windowLength, timeout = 5000)` -- used in 22 specs
- `openDossier()` -- used in 22 specs
- `pinNewDossierFromChannel(appName)` -- used in 22 specs
- `switchToTabInChat(tabName)` -- used in 22 specs
- `getBrowserTabs()` -- used in 21 specs
- `openUserAccountMenu()` -- used in 20 specs
- `switchToNewWindow()` -- used in 19 specs
- `showAppAnyway()` -- used in 16 specs
- `closeUserAccountMenu()` -- used in 15 specs
- `getTextInLatestMessage()` -- used in 14 specs
- `isAddToLibraryDisplayed()` -- used in 14 specs
- `switchToTeamsUserIfNeeded(userName, url, title)` -- used in 14 specs
- `waitForInfoIconAppear()` -- used in 14 specs
- `isAccountIconPresent()` -- used in 13 specs
- `isEditIconPresent()` -- used in 13 specs
- `waitForTabAppear(tabName)` -- used in 13 specs
- `dismissError()` -- used in 12 specs
- `getCoverImageInLatestMessageExtensionCard()` -- used in 12 specs
- `getDossierView()` -- used in 12 specs
- `waitForDossierList()` -- used in 12 specs
- `waitForElementClickable()` -- used in 12 specs
- `getErrorDialogue()` -- used in 11 specs
- `getInputBoxInTeams()` -- used in 11 specs
- `getPageTitle()` -- used in 11 specs
- `replyMessageByIndex({ idx, isQuestion = false })` -- used in 11 specs
- `sleep()` -- used in 11 specs
- `waitForPopupWindowDisappear()` -- used in 11 specs
- `getDossier()` -- used in 10 specs
- `includes()` -- used in 10 specs
- `openTeamsApp(appName)` -- used in 10 specs
- `chooseDossierAndSave(dossierName, search = true)` -- used in 9 specs
- `clickViewAllBotsButtonOfLatestMessage()` -- used in 9 specs
- `getBotListContainer()` -- used in 9 specs
- `getUserName()` -- used in 9 specs
- `loginWithPassword()` -- used in 9 specs
- `standardLogin()` -- used in 9 specs
- `waitForItemLoading()` -- used in 9 specs
- `waitForLoadingInViewAllBots()` -- used in 9 specs
- `chooseDossier(dossierName, search = true)` -- used in 8 specs
- `closeTab()` -- used in 8 specs
- `errorMsg()` -- used in 8 specs
- `getAccountDropdown()` -- used in 8 specs
- `getLandingPage()` -- used in 8 specs
- `getVizImageInLatestMessage(isChannel = false)` -- used in 8 specs
- `isErrorPresent()` -- used in 8 specs
- `isTeamsAppSelected(appName)` -- used in 8 specs
- `openLatestObjectFromMessageExtensionInTeams()` -- used in 8 specs
- `switchCustomApp()` -- used in 8 specs
- `waitForObjectLoading(elemName = 'share')` -- used in 8 specs
- `basicOktaLogin()` -- used in 7 specs
- `closeMessageExtensionDialog()` -- used in 7 specs
- `pause()` -- used in 7 specs
- `safeContinueAzureLogin()` -- used in 7 specs
- `switchToNewWindowWithLink()` -- used in 7 specs
- `checkIfAnyCopyScreenshotButtonExisting()` -- used in 6 specs
- `getLinkInLatestMessage()` -- used in 6 specs
- `isApplicationSelected()` -- used in 6 specs
- `isShareButtonDisabled()` -- used in 6 specs
- `loginToAzure()` -- used in 6 specs
- `openAppCatalog(scope = 'personal')` -- used in 6 specs
- `selectAppInMessageExtension({ appName, fromChannel })` -- used in 6 specs
- `shareToReceipientInTeams({ receipient: receipientName, text: text })` -- used in 6 specs
- `viewSharedMessage()` -- used in 6 specs
- `waitForObjectLoadingInMessageExtension(elemName = 'search')` -- used in 6 specs
- `waitForTeamsView()` -- used in 6 specs
- `back()` -- used in 5 specs
- `clearHistory()` -- used in 5 specs
- `clickShareInTeams()` -- used in 5 specs
- `closeViewAllBotsWindow()` -- used in 5 specs
- `getObjectCount()` -- used in 5 specs
- `getTextInLatestResponse()` -- used in 5 specs
- `getTitleBarBotName()` -- used in 5 specs
- `isNavigationBarPresent()` -- used in 5 specs
- `loginAzureWithAnotherUser()` -- used in 5 specs
- `searchForApp(appName, scope = 'personal')` -- used in 5 specs
- `switchToApp(appName)` -- used in 5 specs
- `viewPinnedObjectInTab()` -- used in 5 specs
- `askQuestionsWithMention({ question = 'hi', mention = 'Library', isChannel = false })` -- used in 4 specs
- `changeTabInSearchResult(tabName)` -- used in 4 specs
- `clickAllSection()` -- used in 4 specs
- `clickPinInTeams()` -- used in 4 specs
- `closeSidebar()` -- used in 4 specs
- `getBadgeOnActivity()` -- used in 4 specs
- `getDossierViewContainer()` -- used in 4 specs
- `getNavigationBar()` -- used in 4 specs
- `getPinInTeamsDialog()` -- used in 4 specs
- `getUsernameForm()` -- used in 4 specs
- `getWarningTextForNewChat()` -- used in 4 specs
- `goToLibrary()` -- used in 4 specs
- `searchObject(objectName)` -- used in 4 specs
- `waitForElementStaleness()` -- used in 4 specs
- `waitForLibraryLoadingInFrame()` -- used in 4 specs
- `askQuestionInTeams()` -- used in 3 specs
- `clickDossierContextMenuItem()` -- used in 3 specs
- `clickIntroToLibrarySkip()` -- used in 3 specs
- `closeModalDialog()` -- used in 3 specs
- `deselectListViewMode()` -- used in 3 specs
- `getAttribute()` -- used in 3 specs
- `getBotNameOnLatestMessage(isChannel = false)` -- used in 3 specs
- `getChatBotVizByType()` -- used in 3 specs
- `getErrorPage()` -- used in 3 specs
- `getLatestChatMessage()` -- used in 3 specs
- `getLibraryIcon()` -- used in 3 specs
- `getShowTheToolbarButton()` -- used in 3 specs
- `getTypeDropdownList()` -- used in 3 specs
- `getTypingAnimation()` -- used in 3 specs
- `getUrl()` -- used in 3 specs
- `getWelcomePageMessageTexts()` -- used in 3 specs
- `isVizSizeCorrectInLatestAnswer(isChannel = false)` -- used in 3 specs
- `loginStandardUser(standard_credentials)` -- used in 3 specs
- `openDossierContextMenu()` -- used in 3 specs
- `openDossierNoWait()` -- used in 3 specs
- `openLatestObjectFromMessageExtensionInWeb()` -- used in 3 specs
- `openSidebarOnly()` -- used in 3 specs
- `pinBot()` -- used in 3 specs
- `refresh()` -- used in 3 specs
- `selectChannelToPinBot()` -- used in 3 specs
- `switchToEmbeddedDossierIframe(waitTime = 1000)` -- used in 3 specs
- `addBotToAConversation({ conversationName, appName = 'Library' })` -- used in 2 specs
- `changeContentGroup(contentGroupName)` -- used in 2 specs
- `clickAllTab()` -- used in 2 specs
- `clickMaximizeButton()` -- used in 2 specs
- `clickOpenSnapshotPanelButtonInResponsive()` -- used in 2 specs
- `clickTextfieldByTitle()` -- used in 2 specs
- `closeNewPopupWindow()` -- used in 2 specs
- `closePanel()` -- used in 2 specs
- `closeSharePanel()` -- used in 2 specs
- `createNewChat({ user1, user2 })` -- used in 2 specs
- `currentURL()` -- used in 2 specs
- `getActionButtonsCount()` -- used in 2 specs
- `getAppDetailsDialog()` -- used in 2 specs
- `getCloseInAddApps()` -- used in 2 specs
- `getContentGroupDropdownList()` -- used in 2 specs
- `getDialog()` -- used in 2 specs
- `getGridCellValue()` -- used in 2 specs
- `getInputBox()` -- used in 2 specs
- `getLatestControlMessage()` -- used in 2 specs
- `getLibraryURLInBrowser()` -- used in 2 specs
- `getMessagePreviewInActivity()` -- used in 2 specs
- `getPinInPinToTeamDialog()` -- used in 2 specs
- `getSearchIcon()` -- used in 2 specs
- `getShareButton()` -- used in 2 specs
- `getTagInLatestResponse(isChannel)` -- used in 2 specs
- `getTimestampOfLastControlMessage()` -- used in 2 specs
- `getViewModeSwitchGridViewOption()` -- used in 2 specs
- `getWhiteSpinner()` -- used in 2 specs
- `getWindowHandles()` -- used in 2 specs
- `hasLibraryIntroduction()` -- used in 2 specs
- `hoverNthChatAnswerFromEndtoAddSnapshot()` -- used in 2 specs
- `isAddNewInTeamsLibraryDisplayed()` -- used in 2 specs
- `isBookmarkPresent()` -- used in 2 specs
- `isCreateNewButtonPresent()` -- used in 2 specs
- `isTabExist()` -- used in 2 specs
- `isTabSelectedInTeamsChannel(tabName, teamsName, channelName)` -- used in 2 specs
- `logout()` -- used in 2 specs
- `openContentDiscovery()` -- used in 2 specs
- `openFolderByPath()` -- used in 2 specs
- `openInfoWindow()` -- used in 2 specs
- `openPanel()` -- used in 2 specs
- `openProjectList()` -- used in 2 specs
- `openSearchSlider()` -- used in 2 specs
- `removeBot({ conversation, isChannel = false })` -- used in 2 specs
- `removeDossierFromLibrary()` -- used in 2 specs
- `searchUserAndOpenChat(user)` -- used in 2 specs
- `selectChannelWithKeyWord(keyword = 'General')` -- used in 2 specs
- `selectProject()` -- used in 2 specs
- `selectTeamWithKeyWord(keyword = 'Test')` -- used in 2 specs
- `split()` -- used in 2 specs
- `triggerTooltipOnBotItem(index = 1)` -- used in 2 specs
- `url()` -- used in 2 specs
- `waitForChatTabLoaded(chatName)` -- used in 2 specs
- `waitForElementEnabled()` -- used in 2 specs
- `waitForElementInvisible()` -- used in 2 specs
- `waitForNewControlMessageArrival({ timestamp })` -- used in 2 specs
- `waitForNoPrivilegePage()` -- used in 2 specs
- `addToLibrary()` -- used in 1 specs
- `addValue()` -- used in 1 specs
- `askQuestion()` -- used in 1 specs
- `askQuestions(question)` -- used in 1 specs
- `bookmarkCount()` -- used in 1 specs
- `changeType(typeName)` -- used in 1 specs
- `changeTypesTo()` -- used in 1 specs
- `clearTypesSelection()` -- used in 1 specs
- `clickApplication()` -- used in 1 specs
- `clickFilterIcon()` -- used in 1 specs
- `clickMyLibraryTab()` -- used in 1 specs
- `closeDialog()` -- used in 1 specs
- `closeFilterPanel()` -- used in 1 specs
- `closeInfoWindow()` -- used in 1 specs
- `dismissCursorInSelector()` -- used in 1 specs
- `dismissErrorMessageBoxByClickOkButton()` -- used in 1 specs
- `dismissErrorMessageDuringPin()` -- used in 1 specs
- `dismissNotification()` -- used in 1 specs
- `endsWith()` -- used in 1 specs
- `getAccountMenuOption()` -- used in 1 specs
- `getAllSection()` -- used in 1 specs
- `getAllTabCount()` -- used in 1 specs
- `getAppInSidebar()` -- used in 1 specs
- `getBotActiveSwitchInInfoWindow()` -- used in 1 specs
- `getCloseButton()` -- used in 1 specs
- `getContentDiscoveryPanelDetailPanel()` -- used in 1 specs
- `getContentInPinInTeamsDialog()` -- used in 1 specs
- `getCustomAppBody()` -- used in 1 specs
- `getCustomAppByName()` -- used in 1 specs
- `getDefaultDossierCoverImage()` -- used in 1 specs
- `getDialogHeader()` -- used in 1 specs
- `getDossierNotification()` -- used in 1 specs
- `getEditButtonInInfoWindow()` -- used in 1 specs
- `getEmbeddedBotButtonInInfoWindow()` -- used in 1 specs
- `getErrorMessageDuringPin()` -- used in 1 specs
- `getFavoriteButton()` -- used in 1 specs
- `getFavoriteButtonInInfoWindow()` -- used in 1 specs
- `getFilterBarItem()` -- used in 1 specs
- `getFilterContainer()` -- used in 1 specs
- `getFirstAppInPerosnalAppCatalog()` -- used in 1 specs
- `getFirstDossierRowActionBar()` -- used in 1 specs
- `getGlobalResultItem()` -- used in 1 specs
- `getInstalledAppListInAddTab()` -- used in 1 specs
- `getInstalledAppListInMoreApps()` -- used in 1 specs
- `getItem()` -- used in 1 specs
- `getItemRowListInContentDiscovery()` -- used in 1 specs
- `getManageAccessButtonInInfoWindow()` -- used in 1 specs
- `getMessageBoxContainer()` -- used in 1 specs
- `getObjectList()` -- used in 1 specs
- `getPostMessageButtonInChat()` -- used in 1 specs
- `getRemoveButton()` -- used in 1 specs
- `getResponseInLatestMessage()` -- used in 1 specs
- `getResultItemByName()` -- used in 1 specs
- `getSearchBox()` -- used in 1 specs
- `getSearchedBotInSuggestions()` -- used in 1 specs
- `getSearchedList()` -- used in 1 specs
- `getShareButtonInInfoWindow()` -- used in 1 specs
- `getSidebarContainer()` -- used in 1 specs
- `getSortBox()` -- used in 1 specs
- `getSpinner()` -- used in 1 specs
- `getStartPostButtonInChannel()` -- used in 1 specs
- `getTabConfigPage()` -- used in 1 specs
- `getTextBoxInTeams()` -- used in 1 specs
- `getTitle()` -- used in 1 specs
- `getViewModeSwitch()` -- used in 1 specs
- `hideBookmarkTimeStamp()` -- used in 1 specs
- `hideNameAndTimeInPinToTeamsDialog()` -- used in 1 specs
- `hoverDossier()` -- used in 1 specs
- `includeAllBookmarksInTeams()` -- used in 1 specs
- `inputTextAndSearch()` -- used in 1 specs
- `isAppPickerDisplayed()` -- used in 1 specs
- `isBMListPresent()` -- used in 1 specs
- `isBookmarkLabelPresent()` -- used in 1 specs
- `isColorDisplayedInViz()` -- used in 1 specs
- `isSearchedAppListInChatTabExist()` -- used in 1 specs
- `isSidebarOpened()` -- used in 1 specs
- `labelInTitle()` -- used in 1 specs
- `moveDossierIntoViewPort()` -- used in 1 specs
- `openAllSectionList()` -- used in 1 specs
- `openDossierFromRecentlyViewedByName()` -- used in 1 specs
- `openDossierFromSearchResults()` -- used in 1 specs
- `openDossierInfoWindow()` -- used in 1 specs
- `openFolderPanel()` -- used in 1 specs
- `openInfoWindowInTeams()` -- used in 1 specs
- `openPageFromTocMenu()` -- used in 1 specs
- `openSearchBox()` -- used in 1 specs
- `openShareDossierDialog()` -- used in 1 specs
- `openSharePanel()` -- used in 1 specs
- `openSnapshot()` -- used in 1 specs
- `pressEnter()` -- used in 1 specs
- `removeDossiersTab(dossierNames)` -- used in 1 specs
- `resetDossier()` -- used in 1 specs
- `search()` -- used in 1 specs
- `selectListViewMode()` -- used in 1 specs
- `shareInTeams()` -- used in 1 specs
- `showBookmarkTimeStamp()` -- used in 1 specs
- `startsWith()` -- used in 1 specs
- `switchPageByKey()` -- used in 1 specs
- `switchToModalIframe()` -- used in 1 specs
- `switchToNewWindowWithUrl()` -- used in 1 specs
- `waitForCurtainDisappear()` -- used in 1 specs
- `waitForMessageBoxDisplay()` -- used in 1 specs
- `addBotFromConversation({ bot, isChannel = false })` -- used in 0 specs
- `checkMenuOptionEnabled(option, value)` -- used in 0 specs
- `cleanDossierTabsinChannel(teamName, channelName)` -- used in 0 specs
- `clearChatHistory()` -- used in 0 specs
- `clickInterpretationButton()` -- used in 0 specs
- `clickViewAllAgentsButtonOfLatestMessage()` -- used in 0 specs
- `clickViewMoreButtonOfLatestMessage()` -- used in 0 specs
- `closeInteractiveChartWindow()` -- used in 0 specs
- `getBotNameOnLatestMessageV2(isChannel = false)` -- used in 0 specs
- `getCardMessagesInLatestMessage()` -- used in 0 specs
- `getChatMessageByIndex(index)` -- used in 0 specs
- `getInterpretationBackgroundColor()` -- used in 0 specs
- `getLastestMessageContainer()` -- used in 0 specs
- `getLatestMessageExtensionCard()` -- used in 0 specs
- `getLatestResponse(isChannel)` -- used in 0 specs
- `getLibraryURLInBrowserIframe()` -- used in 0 specs
- `getMessageContainerCount()` -- used in 0 specs
- `getOpenInTeamsButtonInLatestExtensionCard()` -- used in 0 specs
- `getOpenInWebButtonInLatestMessageExtensionCard()` -- used in 0 specs
- `getSearchedUser(user)` -- used in 0 specs
- `getTextInLatestCardMessage()` -- used in 0 specs
- `getTimestampOfLastMessage(isChannel = false)` -- used in 0 specs
- `getTotalReceivedMessageCount()` -- used in 0 specs
- `getViewAllAgentsButtonByIndex(index = 1)` -- used in 0 specs
- `getViewAllBotsButtonByIndex(index = 1)` -- used in 0 specs
- `getViewMoreButtonByIndex(index = 1)` -- used in 0 specs
- `getViewMoreMessageOfLatestMessage()` -- used in 0 specs
- `isChannelOpened(channelName)` -- used in 0 specs
- `logoutUserFromAzure(email)` -- used in 0 specs
- `modifyChartOption(option, value)` -- used in 0 specs
- `openAppFromApps(appName)` -- used in 0 specs
- `openPinnedTab({ team, channel, tab })` -- used in 0 specs
- `pinAppInChat(appName)` -- used in 0 specs
- `pinAppInSidebar(appName)` -- used in 0 specs
- `removeTab(tab)` -- used in 0 specs
- `scrollToBottom()` -- used in 0 specs
- `scrollToTop()` -- used in 0 specs
- `seeAllApps()` -- used in 0 specs
- `selectObjectFromMessageExtension({ teamsApp, application, object, fromChannel })` -- used in 0 specs
- `signOutFromTeams(email)` -- used in 0 specs
- `switchToTeamsWindow({ url, title, matchAll = false })` -- used in 0 specs
- `triggerTooltip(objectName)` -- used in 0 specs
- `waitForAnswerReady({ timestamp, isChannel })` -- used in 0 specs
- `waitForChatView()` -- used in 0 specs
- `waitForLibraryIframeLoading({ elem, elemName })` -- used in 0 specs
- `waitForLoadingOfViz()` -- used in 0 specs
- `waitForMessageInAnswer(expectText, flag = true)` -- used in 0 specs
- `waitForNewAnswerarrival({ timestamp, isChannel })` -- used in 0 specs
- `waitForWelcomePage({ currentCount })` -- used in 0 specs

## Source Coverage

- `pageObjects/teams/**/*.js`
- `specs/regression/teams/**/*.{ts,js}`
- `specs/regression/integrationTeams/**/*.{ts,js}`
