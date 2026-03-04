# Site Knowledge: teams

> Components: 11

### Apps
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `openTeamsApp(appName)` |
| `openAppFromApps(appName)` |
| `addBotToAConversation({ conversationName, appName = 'Library' })` |

**Sub-components**
_none_

---

### Conversation
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `RemoveTabConfirmButton` | `button#tab-remove-btn` | button |

**Actions**
| Signature |
|-----------|
| `getLatestResponse(isChannel)` |
| `getVizImageInLatestMessage(isChannel = false)` |
| `getTagInLatestResponse(isChannel)` |
| `waitForTabAppear(tabName)` |
| `chooseTab(tabName)` |
| `removeDossiersTab(dossierNames)` |
| `removeTab(tab)` |
| `isTabSelectedInTeamsChannel(tabName, teamsName, channelName)` |
| `openPinnedTab({ team, channel, tab })` |
| `isChannelOpened(channelName)` |
| `cleanDossierTabsinChannel(teamName, channelName)` |
| `switchToTabInChat(tabName)` |
| `getChatMessageByIndex(index)` |
| `getLatestChatMessage()` |
| `getBotNameOnLatestMessage(isChannel = false)` |
| `getBotNameOnLatestMessageV2(isChannel = false)` |
| `getViewAllBotsButtonByIndex(index = 1)` |
| `getViewAllAgentsButtonByIndex(index = 1)` |
| `getViewMoreButtonByIndex(index = 1)` |
| `getViewMoreMessageOfLatestMessage()` |
| `getTextInLatestMessage()` |
| `getLinkInLatestMessage()` |
| `getLatestMessageExtensionCard()` |
| `getOpenInTeamsButtonInLatestExtensionCard()` |
| `getOpenInWebButtonInLatestMessageExtensionCard()` |
| `getCoverImageInLatestMessageExtensionCard()` |
| `isVizSizeCorrectInLatestAnswer(isChannel = false)` |
| `openLatestObjectFromMessageExtensionInTeams()` |
| `openLatestObjectFromMessageExtensionInWeb()` |
| `getLastestMessageContainer()` |
| `getResponseInLatestMessage()` |
| `getCardMessagesInLatestMessage()` |
| `getTextInLatestCardMessage()` |
| `getTextInLatestResponse()` |
| `getLatestControlMessage()` |
| `askQuestions(question)` |
| `askQuestionsByWaiting({ question, isChannel = false, mention })` |
| `askQuestionsWithMention({ question = 'hi', mention = 'Library', isChannel = false })` |
| `waitForMessageInAnswer(expectText, flag = true)` |
| `waitForNewAnswerarrival({ timestamp, isChannel })` |
| `waitForNewControlMessageArrival({ timestamp })` |
| `waitForWelcomePage({ currentCount })` |
| `waitForAnswerReady({ timestamp, isChannel })` |
| `addBotFromConversation({ bot, isChannel = false })` |
| `removeBot({ conversation, isChannel = false })` |
| `getTotalReceivedMessageCount()` |
| `getMessageContainerCount()` |
| `getTimestampOfLastMessage(isChannel = false)` |
| `getTimestampOfLastControlMessage()` |
| `waitForChatTabLoaded(chatName)` |
| `clickViewAllBotsButtonOfLatestMessage()` |
| `clickViewAllAgentsButtonOfLatestMessage()` |
| `clickViewMoreButtonOfLatestMessage()` |
| `clearChatHistory()` |
| `replyMessageByIndex({ idx, isQuestion = false })` |

**Sub-components**
- getMessageContainer
- getLastestMessageContainer

---

### MainTeams
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `TeamsSignOutButton` | `#me-control-sign-out-button` | button |
| `AddNewInTeamsLibrary` | `div.icon-pnl_add-new` | element |
| `Spinner` | `div.mstrd-Spinner` | element |
| `DossierNotification` | `div.mstrd-DossierViewContainer-notifications` | element |
| `GlobalResultItem` | `a.mstrd-GlobalSearchResultListItem-link` | element |
| `DossierViewContainer` | `.mstrd-DossierViewContainer` | element |
| `SearchBox` | `#ms-searchux-input` | input |
| `UserSearchBoxForNewChat` | `#people-picker-input` | input |
| `MessageInputBox` | `p` | element |
| `LandingPage` | `.mstrd-LoginPage` | element |
| `ErrorPage` | `.mstrd-ErrorPage` | element |

**Actions**
| Signature |
|-----------|
| `getMessagePreviewInActivity()` |
| `switchToTeamsWindow({ url, title, matchAll = false })` |
| `getLibraryURLInBrowser()` |
| `getLibraryURLInBrowserIframe()` |
| `logoutUserFromAzure(email)` |
| `login()` |
| `signOutFromTeams(email)` |
| `waitForTeamsView()` |
| `waitForChatView()` |
| `switchToEmbeddedDossierIframe(waitTime = 1000)` |
| `switchToLibraryIframe()` |
| `switchToModalIframe()` |
| `waitForLibraryLoadingInFrame()` |
| `getLandingPage()` |
| `getErrorPage()` |
| `waitForLandingPage()` |
| `waitForNoPrivilegePage()` |
| `switchToAppInSidebar(appName)` |
| `isTeamsAppSelected(appName)` |
| `switchToChat(username)` |
| `switchToChannel(channelName)` |
| `switchToTeamsChannel({ team: teamName, channel: channelName })` |
| `pinAppInSidebar(appName)` |
| `pinAppInChat(appName)` |
| `waitForPopupWindowDisappear()` |
| `isPopUpLoginPageExisting(windowLength, timeout = 5000)` |
| `openAppCatalog(scope = 'personal')` |
| `searchForApp(appName, scope = 'personal')` |
| `waitForObjectLoading(elemName = 'share')` |
| `waitForLibraryIframeLoading({ elem, elemName })` |
| `searchUserAndOpenChat(user)` |
| `getSearchedUser(user)` |
| `createNewChat({ user1, user2 })` |
| `dismissErrorMessageDuringPin()` |
| `showAppAnyway()` |

**Sub-components**
- azureLoginPage
- loginPage
- getLandingPage
- getErrorPage

---

### MessageExtension
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `PreviewCardInInputBox` | `card` | element |

**Actions**
| Signature |
|-----------|
| `selectAppInMessageExtension({ appName, fromChannel })` |
| `selectObjectFromMessageExtension({ teamsApp, application, object, fromChannel })` |
| `shareObjectFromMessageExtension({
        teamsApp = 'Library', application = 'MicroStrategy', object, fromChannel = false, })` |

**Sub-components**
_none_

---

### ModalDialog
> Extends: `MainTeams`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `TabConfigPage` | `div.mstrd-TabConfigPage` | element |
| `DialogHeader` | `.mstrd-ContentPage-header` | element |
| `ObjectList` | `.mstrd-LibraryContentView` | element |
| `ObjectCount` | `.mstrd-VirtualizedDossierList-title-header` | element |
| `DefaultDossierCoverImage` | `div.mstrd-DefaultDossierCoverImage` | element |
| `ApplicationDropdownList` | `.ant-select.mstrd-CustomAppSelect` | dropdown |
| `TypeDropdownList` | `.mstrd-ContentTypeSelect` | dropdown |
| `ContentGroupDropdownList` | `.mstrd-ContentGroupSelect` | dropdown |
| `SearchIcon` | `.icon-search` | element |
| `SearchBox` | `input.ant-input` | input |
| `SearchedList` | `.mstrd-DossierSearchResultView-content` | element |
| `BackButton` | `.icon-back-lib` | element |
| `SaveButton` | `#tab-save-btn` | button |
| `WarningTextForNewChat` | `.mstrd-ContentPageFooter-warning` | element |
| `ShareButton` | `.mstrd-ContentPageFooter-share` | element |

**Actions**
| Signature |
|-----------|
| `isShareButtonDisabled()` |
| `isShareButtonDisabled()` |
| `chooseDossierAndSave(dossierName, search = true)` |
| `chooseDossier(dossierName, search = true)` |
| `closeModalDialog()` |
| `closeMessageExtensionDialog()` |
| `waitForDossierList()` |
| `triggerTooltip(objectName)` |
| `searchObject(objectName)` |
| `changeTabInSearchResult(tabName)` |
| `switchToApp(appName)` |
| `changeType(typeName)` |
| `changeContentGroup(contentGroupName)` |
| `back()` |
| `waitForObjectLoadingInMessageExtension(elemName = 'search')` |

**Sub-components**
_none_

---

### PinFromChannel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AddTabButton` | `#addTabButton` | button |

**Actions**
| Signature |
|-----------|
| `seeAllApps()` |
| `pinNewDossierFromChannel(appName)` |

**Sub-components**
_none_

---

### ShareInTeamsDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `PinToTeamsNameAndTime` | `div.mstrd-PinToTeamsTabDialog-nameAndTime` | element |
| `TeamInputInPinToTeamDialog` | `input#rc_select_0` | input |
| `SelectArrayLoadingIcon` | `div.ant-select-arrow-loading` | dropdown |
| `ChannelInputInPinToTeamDialog` | `input#rc_select_1` | input |
| `WhiteSpinner` | `div.mstrd-Spinner--white` | element |

**Actions**
| Signature |
|-----------|
| `hideNameAndTimeInPinToTeamsDialog()` |
| `selectTeamWithKeyWord(keyword = 'Test')` |
| `selectChannelWithKeyWord(keyword = 'General')` |

**Sub-components**
_none_

---

### ShareInTeamsDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ReceipientInputBox` | `input.ui-box` | input |
| `MessageInputBox` | `p br` | element |

**Actions**
| Signature |
|-----------|
| `shareToReceipientInTeams({ receipient: receipientName, text: text })` |
| `viewSharedMessage()` |

**Sub-components**
_none_

---

### TeamsDesktop
> Extends: `MainTeams`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `switchToActiveWindow(url, title)` |
| `closeNewPopupWindow()` |
| `checkCurrentTeamsUser(userEmail)` |
| `switchToTeamsUser(userName, url, title)` |
| `switchToTeamsUserIfNeeded(userName, url, title)` |
| `loginStandardUser(standard_credentials)` |

**Sub-components**
- isPopUpLoginPage
- loginPage

---

### TeamsInteractiveChart
> Extends: `ModalDialog`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Iframe` | `iframe` | element |
| `Visualization` | `.mstr-ai-chatbot-VizPageForTeams-content.mstr-ai-chatbot-VisualizationBubbleV2-viz2` | element |
| `InterpretationButton` | `.mstr-ai-chatbot-InterpretationForTeams-explanation-btn` | button |
| `InterpretationWrapper` | `.mstr-ai-chatbot-InterpretationForTeams-markdown-wrapper` | element |
| `ChartOptionMenu` | `.mstr-ai-chatbot-ChartOptionButton-menu` | button |
| `ChartOptionSubMenu` | `.mstr-ai-chatbot-ChartOptionButton-subContent` | button |

**Actions**
| Signature |
|-----------|
| `getInterpretationBackgroundColor()` |
| `waitForLoadingOfViz()` |
| `clickInterpretationButton()` |
| `checkMenuOptionEnabled(option, value)` |
| `modifyChartOption(option, value)` |
| `closeInteractiveChartWindow()` |

**Sub-components**
_none_

---

### TeamsViewAllBotsPage
> Extends: `ModalDialog`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Iframe` | `iframe` | element |
| `BotListContainer` | `.mstrd-ViewMorePage .mstrd-VirtualizedDossierList` | element |
| `TooltipContainer` | `.ant-popover .mstrd-DossierInfoContainer-popover:not(.ant-popover-hidden)` | element |

**Actions**
| Signature |
|-----------|
| `closeViewAllBotsWindow()` |
| `waitForLoadingInViewAllBots()` |
| `triggerTooltipOnBotItem(index = 1)` |
| `scrollToBottom()` |
| `scrollToTop()` |

**Sub-components**
- getBotListContainer
- getTooltipContainer
