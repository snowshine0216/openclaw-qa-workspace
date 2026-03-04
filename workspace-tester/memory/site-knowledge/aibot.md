# Site Knowledge: aibot

> Components: 27

### ADC
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ADCToolbar` | `.mstrmojo-RootView-menutoolbar.aibotAdvancedMode` | element |
| `NewDatasetSelectorDiag` | `.mstrmojo-vi-ui-editors-NewDatasetSelectorContainer` | dropdown |
| `DatasetTitleBar` | `.mstrmojo-RootView-datasets .mstrmojo-VIPanel-content-wrapper .mstrmojo-VITitleBar` | element |
| `SavebtnInSaveChangeConfirmDialog` | `.mstrd-AIBotAdvancedModeWarnDialog-save-button` | button |
| `DuplicatebtnInSaveChangeConfirmDialog` | `.mstrd-AIBotAdvancedModeWarnDialog-dont-save-button` | button |
| `CancelBtn` | `.item.btn.cancel .btn` | button |
| `SaveInProgressBox` | `.mstrmojo-Editor.mstrWaitBox.saving-in-progress` | element |
| `EmptyContent` | `.mstrd-EmptyContent` | element |

**Actions**
| Signature |
|-----------|
| `save(name = '')` |
| `saveToPath(name, path, parentFolder = 'Shared Reports')` |
| `apply()` |
| `cancel()` |
| `saveChanges({ saveConfirm = true, jumpToBotAuthoring = true } = {})` |
| `clickSaveBtn()` |
| `clickSaveAsBtn()` |
| `clickSaveAsDropdown()` |
| `clickSaveAsDropdownFromBot()` |
| `clickDuplicateBtn()` |
| `saveAsADC(adcName)` |
| `duplicateAndApply(name, path, parentFolder = 'Shared Reports')` |
| `selectDatasetAddReplace(dataset)` |
| `isADCToolbarPresent()` |
| `isEmptyContentPresent()` |
| `isDatasetTitleBarDisabled(name)` |
| `isDuplicateAndApplyBtnDisplayed()` |

**Sub-components**
- libraryPage
- libraryAuthoringPage
- aiBotChatPanel
- dossierAuthoringPage
- aiBotDatasetPanel

---

### AIBotChatPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `CloseButton` | `.icon-pnl_close` | element |
| `MainView` | `.mstr-ai-chatbot-MainView` | element |
| `ChatPanel` | `.mstr-ai-chatbot-ChatPanel` | element |
| `LoadingHistoryText` | `.loading-text` | element |
| `LoadingHistorySpan` | `.loading-icon` | element |
| `Tooltip` | `.mstr-ai-chatbot-Tooltip` | element |
| `TopicTooltip` | `.mstr-design-tooltip-inner` | element |
| `TitleBar` | `.mstr-ai-chatbot-TitleBar` | element |
| `TitleBarLeft` | `.mstr-ai-chatbot-TitleBar-left-bar` | element |
| `TitleBarBotLogo` | `.mstr-ai-chatbot-TitleBar-bot-logo-container` | element |
| `TitleBarBotName` | `#titlebar_bot_name` | element |
| `TitleBarExternalLinkContainer` | `.mstr-ai-chatbot-TitleBar-external-links-container` | element |
| `TitleBarExternalLink` | `.mstr-ai-chatbot-TitleBar-external-link.mstr-ai-chatbot-TitleBar-external-link--style-icon` | element |
| `ChatBotTitleBarExternalLinkContainer` | `.mstr-ai-chatbot-TitleBar-external-links-container` | element |
| `LinksPopoverButton` | `.mstr-ai-chatbot-TitleBar-external-links-popover-trigger-container` | element |
| `LinksPopoverContents` | `.mstr-ai-chatbot-TitleBar-external-links-popover-content` | element |
| `TitleBarDivider` | `.mstr-ai-chatbot-TitleBar-divider` | element |
| `ClearHistoryButton` | `.mstr-ai-chatbot-TitleBar-clear-history .mstr-ai-chatbot-IconButton` | button |
| `ClearHistoryConfirmationDialog` | `.mstr-ai-chatbot-ConfirmationButton-dialog` | button |
| `ClearHistoryNoButton` | `.mstr-ai-chatbot-ConfirmationButton-cancel` | button |
| `NewChatButton` | `.mstr-ai-chatbot-TitleBar-new-chat` | element |
| `HistoryPanelButton` | `.mstr-ai-chatbot-TitleBar-histories` | element |
| `OpenSnapshotPanelButton` | `.mstr-ai-chatbot-TitleBar-snapshots` | element |
| `CloseSnapshotButton` | `.mstr-ai-chatbot-SnapshotsPanel-close` | element |
| `WelcomePage` | `.mstr-ai-chatbot-WelcomePage` | element |
| `WelcomePageBotIcon` | `.mstr-ai-chatbot-WelcomePage-botIcon` | element |
| `WelcomePageBotImage` | `.mstr-ai-chatbot-WelcomePage-botImg` | element |
| `Bot2WelcomePage` | `.mstr-ai-chatbot-WelcomePage.v2` | element |
| `WelcomePageMessage` | `.mstr-ai-chatbot-WelcomePage-message` | element |
| `WelcomePageSeparator` | `.mstr-ai-chatbot-WelcomePage-separator` | element |
| `WelcomePageTitle` | `.mstr-ai-chatbot-WelcomePage-title` | element |
| `WelcomePageGreetingTitle` | `.mstr-ai-chatbot-WelcomePage-greetingTitle` | element |
| `ChatPanelTopic` | `.mstr-ai-chatbot-ChatPanelTopics` | element |
| `Recommendations` | `.mstr-ai-chatbot-Recommendations` | element |
| `RecommendationTitle` | `.mstr-ai-chatbot-Recommendations-title` | element |
| `RecommendationList` | `.mstr-ai-chatbot-RecommendationItem-text` | element |
| `RecommendationTitleObjectName` | `.mstr-ai-chatbot-Recommendations-title-content-objectName` | element |
| `RelatedSuggestionArea` | `.mstr-chatbot-chat-input-inline__quick-replies` | input |
| `RecommendationExpandStateBtn` | `.mstr-ai-chatbot-Recommendations-expandButton--expanded` | button |
| `RecommendationFoldStateBtn` | `.mstr-ai-chatbot-Recommendations-expandButton` | button |
| `DisabledRecommendationFoldStateBtn` | `.mstr-ai-chatbot-Recommendations-expandButton--disabled` | button |
| `RecommendationRefreshIcon` | `.mstr-ai-chatbot-Recommendations-refreshButton` | button |
| `HighlightMessage` | `.highlight-message` | element |
| `AskAbout` | `.mstr-ai-chatbot-TopicExploreMore` | element |
| `InputBox` | `.mstr-chatbot-chat-input-inline__textarea` | input |
| `InputBoxInTeams` | `.mstr-chatbot-chat-input-inline__textarea` | input |
| `InputBoxContainer` | `.mstr-chatbot-chat-input-inline__input-container` | input |
| `DisabledInputBoxContainer` | `.mstr-chatbot-chat-input-inline__input-container--disabled` | input |
| `InputBoxText` | `.mstr-chatbot-chat-input-inline__textarea` | input |
| `MessageList` | `.MessageContainer` | element |
| `SendIcon` | `.mstr-chatbot-chat-input-inline__send-btn` | button |
| `ChatBotSendIcon` | `.mstr-chatbot-chat-input-inline__send-btn` | button |
| `SendIconInTeams` | `.mstr-chatbot-chat-input-inline__input-right` | input |
| `DisabledSendIcon` | `.mstr-chatbot-chat-input-inline__send-btn--disabled` | button |
| `ChatPanelTopics` | `.mstr-ai-chatbot-ChatPanelTopics` | element |
| `ChatPanelTopicsTitle` | `.mstr-ai-chatbot-ChatPanelTopics-title` | element |
| `InputTopics` | `.mstr-chatbot-chat-input-inline__input-right` | input |
| `ChatBotMaxQuestionQuota` | `.mstr-chatbot-chat-input__footer-left` | input |
| `TopicsIcon` | `.mstr-chatbot-chat-input-inline__empty-btn` | button |
| `DisabledTopicsIcon` | `.mstr-chatbot-chat-input-inline__empty-btn--disabled` | button |
| `AutoCompleteArea` | `.mstr-chatbot-suggestion-popup` | element |
| `AutoCompleteHeader` | `.mstr-chatbot-suggestion-popup-header` | element |
| `AutoCompleteContent` | `.mstr-chatbot-suggestion-popup-content` | element |
| `BubbleLoadingIcon` | `.chat-bubble-loading` | element |
| `AnswerList` | `.MessageList` | element |
| `ChatPanelContainer` | `.mstr-ai-chatbot-MainView-chatPanelContainer` | element |
| `ChatBotPinIcon` | `.mstr-ai-chatbot-SnapshotButton-pin` | button |
| `VizAnswerBubbleList` | `.mstr-ai-chatbot-VisualizationBubble` | element |
| `InterpretationCopyToQueryIcon` | `.mstr-ai-chatbot-CIInterpretedAs-copy-query` | element |
| `InterpretationCopyToQueryDisableIcon` | `.mstr-ai-chatbot-CIInterpretedAs-copy-query--disabled` | element |
| `InterpretationCopyLLMInstructionsIcon` | `.mstr-ai-chatbot-CIComponents-header-right-copy-container` | element |
| `InterpretationComponent` | `.mstr-ai-chatbot-ChatInterpretationComponent` | element |
| `InterpretedAsText` | `.mstr-ai-chatbot-CIInterpretedAs-text` | element |
| `InterpretationSeeMoreBtn` | `.mstr-ai-chatbot-TruncatedText-showMoreLessButton` | button |
| `InterpretationLoadingSpinner` | `.mstr-ai-chatbot-CILoading-spinner` | element |
| `InterpretationReloadButton` | `.mstr-ai-chatbot-CIError-reload` | element |
| `ThumbDownLoadingSpinner` | `.mstr-ai-chatbot-Spinner--grey` | element |
| `QuotedQuestionInInpuxBox` | `.mstr-chatbot-chat-input-inline__quoted-messages` | input |
| `QuotedMessageInInpuxBox` | `.mstr-ai-chatbot-QuotedMessage--isRenderedInInputBox` | input |
| `CloseQuotedMessageIcon` | `.mstr-ai-chatbot-QuotedMessage-closeButton` | button |
| `LearningCheckingText` | `.headerTitle` | element |
| `FeedbackResults` | `.mstr-ai-chatbot-ChatPanelFeedbackResults-header` | element |
| `LearningIcon` | `.learningIcon` | element |
| `UnpinIcon` | `.mstr-ai-chatbot-SnapshotButton-unpin` | button |
| `Time` | `.Time` | element |
| `TimeText` | `.Time` | element |
| `SeeMoreLessBtn` | `.mstr-ai-chatbot-TruncatedText-showMoreLessButton` | button |
| `SnapshotPanelContainer` | `.mstr-ai-chatbot-SnapshotsPanel` | element |
| `SnapshotItems` | `.mstr-ai-chatbot-SnapshotsPanelContent-items` | element |
| `SnapshotDeleteConfirmationButton` | `.mstr-ai-chatbot-ConfirmationButton-confirm` | button |
| `TimeInSnapshot` | `.mstr-ai-chatbot-SnapshotCard-date` | element |
| `NotificationSaveButton` | `.mstrmojo-WebButton` | button |
| `SnapshotPanel` | `.mstr-ai-chatbot-SnapshotsPanelContent-items` | element |
| `LibraryIcon` | `.mstr-nav-icon.icon-library` | element |
| `LoadingIconInClearHistory` | `.mstr-ai-chatbot-ConfirmationDialog-spinner` | element |
| `ResizeHandlerOfConfigurationPanel` | `[class*=mstr-ai-chatbot-EditingLayout-separator]` | element |
| `ResizeHandlerOfSnapshotPanel` | `.mstr-ai-chatbot-ResizeHandler` | element |
| `ConfigTabsList` | `.mstr-ai-chatbot-ConfigTabs-list` | element |
| `VizLoadingSpinner` | `.single-loading-spinner` | element |
| `SnapshotAddedSuccessToast` | `.mstr-ai-chatbot-Toast-viewport` | element |
| `TextLinkToBot` | `.vi-doc-tf-value-text` | element |
| `CancelLoadingAnswerButton` | `.mstr-design-bot-button` | button |
| `Bot2CancelLoadingAnswerButton` | `.mstr-chatbot-chat-input-inline__cancel-btn` | button |
| `MobileHamburgerButton` | `.mstrd-MobileHamburgerContainer` | element |
| `MobileSliderMenu` | `.mstrd-MobileSliderMenu-slider` | element |
| `AskAboutBtn` | `.mstr-ai-chatbot-TitleBar-topics` | element |
| `AskAboutPanel` | `.mstr-ai-chatbot-TopicsPanel` | element |
| `AskAboutPanelSearchBox` | `.mstr-ai-chatbot-SearchBox` | element |
| `AskAboutPanelObjectList` | `.mstr-ai-chatbot-TopicsPanelContent-objectsList` | element |
| `StartConversationBtn` | `.mstr-ai-chatbot-TopicsObject-startConversationButton` | button |
| `MobileCloseSnapshotButton` | `.mstr-nav-icon.icon-backarrow_rsd.mstr-nav-icon-color` | element |
| `MobileCloseAskAboutButton` | `.mstr-nav-icon.icon-backarrow_rsd.mstr-nav-icon-color` | element |
| `MobileViewClearHistoryYesButton` | `.mstrd-Button.mstrd-Button--round.mstrd-Button--primary.mstrd-ConfirmationDialog-button` | button |
| `MobileViewClearHistoryNoButton` | `.mstrd-Button.mstrd-Button--clear.mstrd-Button--primary.mstrd-ConfirmationDialog-button` | button |
| `CloseSnapshotAddedButton` | `.mstr-ai-chatbot-Toast-closeBtn` | button |
| `ContentLoadingIcon` | `.mstr-ai-chatbot-LoadingIcon-content--visible` | element |
| `ChatBotLoadingIcon` | `.mstr-ai-chatbot-Spinner.mstr-ai-chatbot-Spinner--grey` | element |
| `Disclaimer` | `.mstr-chatbot-chat-panel__footnote` | element |
| `DidYouMeanPanel` | `.mstr-ai-chatbot-DidYouMean` | element |
| `DidYouMeanCloseButton` | `.mstr-ai-chatbot-DidYouMean-close-button` | button |
| `SmartSuggestionCopyIcon` | `.mstr-ai-chatbot-SuggestionItem-copyIcon` | element |
| `SmartSuggestionLoadingBar` | `.mstr-ai-chatbot-LoadingSkeleton-text` | element |
| `BotEditLayout` | `.mstr-ai-chatbot-EditingLayout-rightPanel` | element |
| `MessageScrollComponent` | `.infinite-scroll-component__outerdiv` | element |
| `SnapshotsLoadingIcon` | `.mstr-ai-chatbot-Spinner.mstr-ai-chatbot-Spinner--grey` | element |
| `NuggetTriggerIcon` | `.mstr-ai-chatbot-CIInterpretedAs-nugget-trigger` | element |
| `InterpretationLearning` | `.mstr-ai-chatbot-CINuggetsContent` | element |
| `AgColumnMenu` | `.ag-column-menu` | element |
| `AgColumnPickdialog` | `.ag-dialog.ag-popup-child` | element |
| `VizBubble` | `.mstr-ai-chatbot-VisualizationBubbleV2-viz2` | element |
| `VizLoadingCurtain` | `.mstr-ai-chatbot-VisualizationBubbleV2-loading` | element |
| `UnstructuredDataTooltip` | `.mstr-ai-chatbot-UnstructuredDataIndicators-tooltip-content` | element |
| `UnstructuredDataTooltipDownloadButton` | `.mstr-ai-chatbot-UnstructuredDataIndicators-download-button` | button |
| `UnstructuredDataTooltipDownloadSpinner` | `.mstr-ai-chatbot-UnstructuredDataIndicators-spinner` | element |
| `InterpretedAs` | `.mstr-ai-chatbot-CIInterpretedAs-text` | element |
| `ExportToCsvButton` | `.mstr-ai-chatbot-ExportToCsvButton` | button |
| `ExportToExcelButton` | `.mstr-ai-chatbot-ExportToExcelButton` | button |
| `AiDiagnosticsDialogCopyIcon` | `.mstr-ai-chatbot-DiagnosticsCopyIcon` | element |
| `AiDiagnosticsDialogExportIcon` | `.mstr-ai-chatbot-DiagnosticsTab-btns-export` | button |
| `AiDiagnosticsDialogCloseIcon` | `.mstr-ai-chatbot-DiagnosticsCloseIcon` | element |
| `ToBottomBtn` | `.message-back-bottom` | element |
| `BotTitle` | `.mstrd-DossierTitle-segment` | element |
| `StartConversationRecommendation` | `.mstr-chatbot-chat-panel__input-container .mstr-ai-chatbot-RecommendationItem` | input |
| `ToolBarCopyAsImageIcon` | `.mstr-ai-chatbot-CopyButton` | button |
| `ToolBarDownLoadIcon` | `.mstr-ai-chatbot-DownloadButton` | button |
| `ToolBarMoreMenu` | `.more-menu-menu-container` | element |
| `QuotedMessageCloseButton` | `.mstr-ai-chatbot-QuotedMessage-closeButton` | button |
| `FollowUpError` | `.mstr-chatbot-chat-panel__empty-followup` | element |
| `NuggetsPopoverContentDatasetTitle` | `.mstr-ai-chatbot-CINuggetsPopoverContent-nugget-right-title` | element |
| `NuggetsPopoverContentDefinition` | `.mstr-ai-chatbot-CINuggetsPopoverContent-nugget-right .mstr-ai-chatbot-TruncatedText-content` | element |
| `EditAppearanceButton` | `.mstr-icons-lib-icon mstr-ai-chatbot-ConfigTabs-appearance` | element |
| `NuggetContent` | `.mstr-ai-chatbot-CINuggetsPopoverContent-content` | element |
| `LearningIndicatorDialog` | `.mstr-ai-chatbot-AnswerBubbleLearningBadges-popover` | element |
| `LearningIndicatorHelpLink` | `.mstr-ai-chatbot-AnswerBubbleLearningBadges-help-link` | element |
| `LearningManagerWindow` | `.mstr-ai-chatbot-CentralLearningManagerContent-main-dialog` | element |
| `LearningManagerNoDataWindow` | `.mstr-ai-chatbot-CLMNoData` | element |
| `LearningForgetBtn` | `.mstr-ai-chatbot-CINuggetsContent-nugget-right-content-forget--visible` | element |
| `Switch` | `.mstr-ai-chatbot-Switch-root` | element |
| `ForgetUserLearningLoading` | `.mstr-ai-chatbot-Spinner-blade` | element |
| `DialogCloseButton` | `.mstr-ai-chatbot-Dialog-closeButton` | button |
| `ForgottenTooltip` | `.mstr-ai-chatbot-CINuggetsContent-nugget-right-content-tooltip` | element |
| `InterpretationText` | `.mstr-ai-chatbot-CIComponents-header-right` | element |

**Actions**
| Signature |
|-----------|
| `getRecommendationTextByIndex(Index)` |
| `getTopicItemListLength()` |
| `getNthParagraphOfTextAnswerFromEnd(Nth)` |
| `getNthParagraphOfTextAnswerFromEndV2(Nth)` |
| `getNthChatBotAnswerFromEnd(Nth)` |
| `getIndexByAnswerText(text)` |
| `getErrorDetailedMessage(index = 0)` |
| `isToBottomBtnDisplayed()` |
| `clickToBottom()` |
| `hoverOnUnstructuredDataIndicator(answerIndex = 0, indicatorIndex = 0)` |
| `hoverOnLatestAnswer()` |
| `clickSnapshotUnpinButton()` |
| `clickDownloadButton()` |
| `clickExportToCsvButton()` |
| `clickExportToExcelButton()` |
| `clickInterpretationAdvancedOption()` |
| `clickInterpretationSwitchBtn(index)` |
| `clickAiDiagnosticsButtonByAnswerIndex(index)` |
| `clickAiDiagnosticsDialogCopyIcon()` |
| `clickAiDiagnosticsDialogExportIcon()` |
| `clickAiDiagnosticsDialogCloseIcon()` |
| `isSnapshotButtonUnpinDisplayed()` |
| `isSnapshotButtonDisplayed()` |
| `getLatestFollowUpError()` |
| `getFollowUpErrorText()` |
| `getForgetUserLearningLoadingColor()` |
| `isInterpretedAsDisplayed()` |
| `hoverOnBotLogo()` |
| `hoverOnBotName()` |
| `hoverOnLinkByIndex(index)` |
| `hoverOnLinksPopoverBtn()` |
| `hoverOnLinksPopoverItemByIndex(Index)` |
| `hoverOnClearHistoryBtn()` |
| `hoverOnWelcomePageBotIcon()` |
| `hoverOnWelcomePageTitle()` |
| `hoverOnWelcomePageMessage()` |
| `hoverOnRecommendationByIndex(Index)` |
| `hoverOnInputBox()` |
| `hoverOnSendBtn()` |
| `hoverOnTopicsBtn()` |
| `hoverOnSeeMoreLessBtn()` |
| `hoverOnHistoryQuestion(index)` |
| `hoverOnCopyToQueryIcon()` |
| `hoverOnHistoryAnswer(index)` |
| `hoverOnChatAnswer(index)` |
| `hoverOnRecommendationExpandStateBtn()` |
| `hoverOnRecommendationRefreshBtn()` |
| `hoverOnInterpretationBtn(index)` |
| `hoverOnInterpretationCopyToQueryBtn()` |
| `hoverOnInterpretationCopyLLMInstructionsBtn()` |
| `hoverOnDidYouMeanCloseButton()` |
| `hoverOnSmartSuggestionCopyIcon()` |
| `hoverOnSmartSuggestion(index)` |
| `hoverOnToolBarMoreButtonByIndex(index)` |
| `hoverOnFollowUpIconByIndex(index)` |
| `hoverOnRectFromBarChart()` |
| `clickSaveButton()` |
| `clickCloseButton()` |
| `clickBotName()` |
| `clickClearHistoryButton()` |
| `isTitleBarDisplayed()` |
| `clickClearHistoryYesButton()` |
| `clickClearHistoryNoButton()` |
| `clickNewChatButton()` |
| `clickHistoryChatButton()` |
| `clickOpenSnapshotPanelButton()` |
| `openSnapshot()` |
| `clickOpenSnapshotPanelButtonInResponsive()` |
| `clickCloseSnapshotButton()` |
| `closeSnapshot()` |
| `clickCloseSnapshotButtonInResponsive()` |
| `clickRecommendationByContents(recommendation)` |
| `clickRecommendationByIndex(Index)` |
| `clickTopicByIndex(Index)` |
| `clickTopicByTitle(title)` |
| `clickTopicByTitleAnWaitFordCancel(title)` |
| `clickChatPanelTopicByIndex(Index)` |
| `clickSeeMoreLessBtn()` |
| `clickRefreshRecommendationIcon()` |
| `clickExpandRecommendation()` |
| `clickFoldRecommendation()` |
| `clickDeleteSnapShotButton(Index)` |
| `clickNotificationSaveButton()` |
| `clickSnapShotDeleteComfirmationButton()` |
| `clickLinksPopoverButton()` |
| `clickLinksPopoverItemsbyIndex(Index)` |
| `clickCloseQuotedMessageIcon()` |
| `clickSendBtn()` |
| `clickTopicsBtn()` |
| `clickContentDiscoveryBotByIndex(Index)` |
| `clickTextLinkToBot()` |
| `clickDidYouMeanCloseButton()` |
| `clickSmartSuggestion(index)` |
| `clickSmartSuggestionCopyIcon()` |
| `clickSmartSuggestionShowMoreBtn(Index = 0)` |
| `clickSmartSuggestionShowLessBtn(Index = 0)` |
| `clickThumbDownButtonbyIndex(Index)` |
| `clickThumbDownClickedButtonbyIndex(Index)` |
| `clickFeedbackTabByName(name, index = 0)` |
| `clickFeedbackSubmitButton(index = 0)` |
| `clickFeedbackCloseButtonbyIndex(index = 0)` |
| `clickLink(text)` |
| `clickLearningForgetButtonbyIndex(Index)` |
| `clickNuggetTriggerIcon()` |
| `clickInterpretationReloadButton()` |
| `getInterpretationText()` |
| `clickToolBarMoreButtonByIndex(Index)` |
| `clickToolBarCopyAsImageIcon()` |
| `clickToolBarDownloadIcon()` |
| `clickFollowUpIconbyIndex(Index)` |
| `followUpByIndex(index)` |
| `clickQuotedMessageCloseButton()` |
| `clickQuotedMessageButtonByIndex(Index)` |
| `clickFollowUpError()` |
| `clickDownloadPDFReport(index = 0)` |
| `clickSeeMoreSeeLessButton()` |
| `clickEditAppearanceButton()` |
| `clickLearningIndicator()` |
| `openManageLearning()` |
| `clickLearningManager(Index = 0)` |
| `clickCheckBox(Index = 0)` |
| `clickSwitch()` |
| `clickUnstructuredDataDownloadButton()` |
| `waitForAnswerLoading()` |
| `waitForTopicAnswerLoading()` |
| `waitForInterpretationLoading()` |
| `waitForExportComplete()` |
| `waitForForgetUserLearningLoading()` |
| `waitForCheckLearningLoading()` |
| `openRecommendationPanel()` |
| `waitForRecommendationSkeletonDisappear()` |
| `waitForRecommendationLoading()` |
| `enableResearch()` |
| `disableResearch()` |
| `enableWebSearch()` |
| `disableWebSearch()` |
| `clearInputbox()` |
| `deleteByTimes(times = 1)` |
| `waitForAnswerSettled(timeout = this.DEFAULT_LOADING_TIMEOUT, interval = 1000)` |
| `waitForInsightsSettled(timeout = this.DEFAULT_LOADING_TIMEOUT, interval = 1000)` |
| `waitForUnstructuredDataTooltipSpinnerDisappear()` |
| `typeInChatBox(text)` |
| `askQuestion(question, waitViz = false, options = { timeout: this.DEFAULT_LOADING_TIMEOUT })` |
| `askQuestionNoWaitViz(question)` |
| `askQuestionAndSend(question)` |
| `inputQuestionNotSend(question)` |
| `askQuestionInTeams(question)` |
| `askQuestionByPaste(question)` |
| `askQuestionByPasteWithoutSending(question)` |
| `clickSendIcon()` |
| `clickCancelLoadingAnswerButton()` |
| `clickBot2CancelLoadingAnswerButton()` |
| `dismissFocus()` |
| `openBotClearHistoryAndAskQuestion({
        projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', appId, botId, question, })` |
| `clearHistoryAndAskQuestion(question)` |
| `openBotAndAskQuestion(bot, question)` |
| `openBotAndOpenSnapshot({ botId: botId })` |
| `scrollChatPanelTo(position)` |
| `scrollChatPanelToTop()` |
| `scrollChatPanelToBottom()` |
| `scrollChatPanelContainerToBottom()` |
| `scrollSnapshotPanelTo(position)` |
| `scrollSnapshotPanelToTop()` |
| `scrollSnapshotPanelToBottom()` |
| `goToLibrary()` |
| `openExternalLinkOnChatTitleBarByIndex(Index)` |
| `resizeConfigurationPanel(offset = 200)` |
| `resizeSnapshotPanel(offset = -100)` |
| `closeDialogue()` |
| `takeSnapshot(index = 0)` |
| `askAboutbyIndex(Index = 0)` |
| `searchInAskAbout(searchText)` |
| `clearAskAboutSearch()` |
| `clickShowErrorDetails(index = 0)` |
| `isTooltipDisplayed()` |
| `isTitleBarBotLogoDisplayed()` |
| `isChatPanelTopicsTitleDisplayed()` |
| `isChatBotVizDisplayed(vizType, index = 0)` |
| `isCustomVizDisplayedByType(vizType, index = 0)` |
| `isTitleBarBotNameDisplayed()` |
| `isWelcomePageBotImageDisplayed()` |
| `isBot2WelcomePageDisplayed()` |
| `isClearHistpryConfirmationDialogDisplayed()` |
| `isQADisplayed()` |
| `isWelcomePageMessageDisplayed()` |
| `isWelcomePageSeparatorDisplayed()` |
| `isWelcomePageTitleDisplayed()` |
| `isWelcomePageGreetingTitleDisplayed()` |
| `isWelcomePageMessageRecommendationDisplayed()` |
| `isSendIconDisplayed()` |
| `isDisabledSendIconDisplayed()` |
| `isTopicsIconDisplayed()` |
| `isDisabledTopicsIconDisplayed()` |
| `isTimeDisplayed()` |
| `isQueryByIndexDisplayed(Index)` |
| `isVizAnswerDisplaed()` |
| `isTextAnswerByIndexDisplayed(Index)` |
| `isMarkDownByIndexDisplayed(Index)` |
| `isVizAnswerByIndexDisplayed(Index)` |
| `isRecommendationDisplayed()` |
| `isRecommendationExpandStateBtnDisplayed()` |
| `isDisabledReccomendationFoldStateBtnDisplayed()` |
| `isRecommendationRefreshIconDisplayed()` |
| `isRecommendationByIndexDisplayed(Index)` |
| `isClearHistoryButtonDisplayed()` |
| `isDeleteSnapShotButtonDisplayed(Index)` |
| `isChatAnswerByIndexDisplayed(Index)` |
| `isAutoCompleteAreaDisplayed()` |
| `isContentDiscoveryBotByIndexDisplayed(Index)` |
| `isColorDisplayedInViz(color, VizIndex = 0)` |
| `isColorDisplayedInVizOfSnapshot(color, VizIndex = 0)` |
| `getCountOfInterpretation()` |
| `isInterpretationIconDisplayedInAnswer(index = 0)` |
| `isInterpretationComponentDisplayed()` |
| `isInterpretationCopyLLMInstructionsIconDisplayed()` |
| `isInterpretationCopyToQueryDisableIconDisplayed()` |
| `isAskAboutDisplayed()` |
| `isAskAboutBtnDisplayed()` |
| `isAskAboutPanelDisplayed()` |
| `isChatPanelTopicDisplayed()` |
| `isAskAboutPanelObjectListDisplayed()` |
| `isErrorAnswerDisplayedByIndex(index = 0)` |
| `isAskAboutPanelSearchBoxDisplayed()` |
| `isRecommendationAboutDisplayed()` |
| `isDisclaimerDisplayed()` |
| `isDisabledInputContainerDisplayed()` |
| `isDidYouMeanPanelDisplayed()` |
| `isSmartSuggestionLoadingBarDisplayed()` |
| `isDidYouMeanCloseButtonDisplayed()` |
| `isQuotedQuestionDisplayedInInputBox()` |
| `isAskAboutPanelObjectByNameDisplayed(name)` |
| `isLearningForgetBtnExisting()` |
| `isRecommendationPanelPresent()` |
| `isInsightsSectionDisplayed()` |
| `isResearchEnabled()` |
| `isResearchDisplayed()` |
| `isWebSearchEnabled()` |
| `isWebSearchDisplayed()` |
| `getTitleBarExternalLinkCount()` |
| `getFeedbackResultsText(index = 0)` |
| `waitClearHistoryEnabled()` |
| `isFollowUpBtnDisplayedByLatestAnswer()` |
| `isExportToCsvIconDisplayedByLatestAnswer()` |
| `isExportToExcelIconDisplayedByLatestAnswer()` |
| `clearHistory()` |
| `createNewChat()` |
| `sendPrompt(text)` |
| `sendPromptWaitAnswerLoaded(text)` |
| `askQuestionByAutoComplete(text, autoCompletionIndex = 0)` |
| `copyRecommendationToQuery(index)` |
| `copyQuestionToQuery(index)` |
| `getRecommendationByContents(recommendation)` |
| `openInterpretation(index = 0)` |
| `clickInterpretation()` |
| `clickInterpretationbyIndex(index)` |
| `clickAnswerWithoutCacheButtonByIndex(index = 0)` |
| `clickInterpretationCopyToQueryIcon()` |
| `clickInterpretationCopyLLMInstructionsIcon()` |
| `clickInterpretationSeeMoreBtn()` |
| `inputFeedbackContents(feedback, index = 0)` |
| `clearFeedbackContents(index = 0)` |
| `hoverTextOnlyChatAnswertoAddSnapshotbyIndex(Index)` |
| `hoverChatAnswertoAddSnapshotbyIndex(Index)` |
| `hoverChatAnswerToRemoveSnapshotByIndex(index)` |
| `hoverNthChatAnswerFromEndtoAddSnapshot(Nth)` |
| `hoverNthChatAnswerFromEndtoClickThumbdown(Nth)` |
| `ClickUnpinNthChatAnswerFromEnd(Nth)` |
| `hoverTextOnlyChatAnswer(Index)` |
| `hoverVizPanel(Index)` |
| `hoverThumbDownButtonbyIndex(Index)` |
| `hoverThumbDownClickedButtonbyIndex(Index)` |
| `hoverTextOnlyChatAnswertoOpenInterpretationbyIndex(Index)` |
| `hoverTextOnlyChatAnswertoOpenThumbDownbyIndex(Index)` |
| `hoverChatAnswertoClickThumbDownbyIndex(Index)` |
| `hoverChatBubbleToClickThumbDownByIndex({ index = 0 })` |
| `hovertoClickThumbDownbyIndex(MarkDownIndex = 0, ThumbDownIndex = 0)` |
| `hoverChatAnswertoClickFollowUpbyIndex(markDownIndex = 0, followUpIndex = 0)` |
| `thumbUpByIndex(index)` |
| `thumbDownByIndex(index)` |
| `hoverContentDiscoveryBotByIndex(Index)` |
| `hoverLearningManager(Index = 0)` |
| `hoverLearningContent(answerIndex = 0, learningIndex = 0, offset = { x: 0, y: 0 })` |
| `numberOfSnapshotsInChatbot()` |
| `checkIfAnyCopyScreenshotButtonExisting()` |
| `checkIfCopyScreenshotButtonExisting(Nth)` |
| `checkIfDownloadButtonExisting(Nth)` |
| `checkIfSnapshotButtonExisting(Nth)` |
| `hideTimeStampInChatAndSnapshot()` |
| `getPinButtonOfNthChatAnswer(Nth)` |
| `getUnpinButtonOfNthChatAnswer(Nth)` |
| `clickMobileHamburgerButton()` |
| `openMobileHamburger()` |
| `closeMobileHamburger()` |
| `openMobileViewSnapshotPanel()` |
| `closeMobileViewSnapshotPanel()` |
| `openMobileViewAskAboutPanel()` |
| `closeMobileViewAskAboutPanel()` |
| `clearMobileViewHistory()` |
| `clickMobileViewClearHistoryButton()` |
| `clickMobileViewClearHistoryYesButton()` |
| `clickMobileViewClearHistoryNoButton()` |
| `clickMobileViewLinksButton()` |
| `clickMobileViewLinksItemsbyIndex(Index)` |
| `clickCloseSnapshotAddedButton()` |
| `clickMarkDownByIndex(Index)` |
| `clickButton(name)` |
| `isBotConfigByNameSelected(name)` |
| `clickExternalLinkByText(text)` |
| `closeDidYouMean()` |
| `getLastQueryText()` |
| `getTopicItemsInChatPanel()` |
| `openLearningManager(Index = 0)` |
| `openInterpretationForgetUserLearning(answerIndex = 0, learningIndex = 0, waitLoading = true)` |
| `verifyAskAboutObjectStateByIndex(index, expectedState)` |
| `verifyAskAboutObjectElementList(index, expectedText)` |
| `clickTopicInAIBotByIndex(topicIndex = 0)` |
| `verifyTopicSummary(topicSummaryAccount = 3)` |
| `verifyUncertainTopicSummary(topicSummaryAccount = 3)` |
| `openAskAboutPanel()` |
| `expandAskAboutObjectByName(name)` |
| `clickStartConversationInAskAboutPanel(objectName)` |
| `clickStartConversationInAskAboutPanel2(objectName)` |
| `getAskAboutSuggestedQuestions()` |
| `constructJSON(inputKey, inputValue, outputKey, outputValue)` |
| `isCustomSuggestionDisplayed(suggestion)` |
| `verifyElementFont(element, expectedFont, elementName)` |
| `extractAGGridDataToMarkdown(answerIndex, gridIndex)` |
| `isAliasDispalyedForAskAboutObject(name, alias)` |
| `areTopicSuggestionsDisabled()` |
| `isButtonDisabled(elem)` |
| `manipulationOnAgGrid(gridIndex, columnName, action, subAction = null)` |
| `selectUnselectColumnOnAgGrid(columnName, checked = true)` |
| `closeAgColumnPickerDialog()` |

**Sub-components**
- libraryPage
- dossierPage
- getTitleBarExternalLinkContainer
- getChatBotTitleBarExternalLinkContainer
- getDotInSnapshotPanel
- getOpenSnapshotPanel
- getWelcomePage
- getVIVizPanel
- getSnapshotPanel
- getAskAboutPanel
- getMobileViewLinksContainer
- getAnswerBubbleButtonIconContainer
- scrollChatPanel
- getHistoryPanel
- isSnapshotPanel
- getChatPanel
- getRecommendationPanel
- getInsightsContainer
- clickOpenSnapshotPanel
- getChatPanelContainer
- getResizeHandlerOfConfigurationPanel
- getResizeHandlerOfSnapshotPanel
- getBot2WelcomePage
- getDisabledInputBoxContainer
- getDidYouMeanPanel
- getFeedbackResultPanel
- getTopicItemsInChatPanel
- GetObjectButtonInAskAboutPanel
- GetStartConversionButtonInAskAboutPanel

---

### AIBotDatasetPanel
> Extends: `BaseBotConfigTab`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `DatasetPanel` | `.mstr-ai-chatbot-Datasets` | element |
| `DatasetPanelTitle` | `.mstr-ai-chatbot-Datasets-title` | element |
| `SearchIcon` | `.mstr-icons-lib-icon` | element |
| `SearchContainer` | `.mstr-ai-chatbot-SearchBox` | element |
| `SearchInReplaceDialogContainer` | `.mstr-input-container` | input |
| `ClearSearchIcon` | `.mstr-ai-chatbot-SearchBox-clear` | element |
| `CollapseArrow` | `.mstr-ai-chatbot-Collapsible-arrow` | element |
| `DatasetNameInput` | `.mstr-ai-chatbot-Datasets-dataset-title-input` | input |
| `RenameError` | `.mstr-ai-chatbot-Toast-title` | element |
| `MenuButton` | `.single-icon-misc-menu` | element |
| `MenuContainer` | `.mstr-ai-chatbot-Datasets-menu-content` | element |
| `DatasetList` | `.mstr-ai-chatbot-Datasets-list` | element |
| `DatasetContainer` | `.mstr-ai-chatbot-Collapsible-content` | element |
| `ErrorIcon` | `.mstr-ai-chatbot-Datasets-dataset-warning` | element |
| `PanelErrorIcon` | `.mstr-ai-chatbot-ConfigTabs-dataset-warning` | element |
| `TooltipContainer` | `.mstr-ai-chatbot-LayoutContainer-overlay` | element |
| `ReplaceDialogHeader` | `.mstr-ai-chatbot-Dialog-header` | element |
| `RefreshContainer` | `.mstrmojo-di-tablestatuslist ` | element |
| `DatasetWarningDialog` | `.mstr-ai-chatbot-DatasetWarningDialog-container` | element |
| `DatasetWarningDialogHeader` | `.mstr-ai-chatbot-DatasetWarningDialog-header` | element |
| `CloseBtnInWarningDialog` | `button*=Close` | button |
| `DataPanelContainer` | `.mstr-ai-chatbot-Datasets` | element |
| `ReplaceLoadingIcon` | `.react-bot-creator-preloader-wrapper` | element |
| `ReplaceSecondLoadingIcon` | `.mstr-react-dossier-creator-preloader.preloader-wrapper` | element |
| `SelectCount` | `.template-info-selection-count` | dropdown |
| `DatasetNameContainer` | `.mstr-ai-chatbot-Datasets-dataset-title` | element |
| `ModeSwitcher` | `.mode-switcher` | element |
| `RefreshPage` | `.mstrmojo-Editor-title-container` | element |
| `RefreshDoneIcon` | `.mstrmojo-Label.republish-status-icon.finished` | element |
| `EditPage` | `.mstrmojo-di-view.mojo-theme-light.mstrmojo-di-view-popup` | element |
| `EditTitle` | `#DIContainer` | element |
| `NewDIPageSearch` | `.whc-search-box.mini-toolbar-searchbox` | element |
| `NewDIPage` | `.mstrmojo-di-popup` | element |
| `SampleFileContentContainer` | `.mstrmojo-DataGrid.mstrmojo-di-samplefiles .mstrmojo-itemwrap-table` | element |
| `SelectAllInRefresh` | `.mstrmojo-Label.tristate.tablestatus-header.refresh` | element |
| `SearchBoxInEdit` | `.mstrmojo-Box.mstrmojo-di-DISearchTableBox` | element |
| `DataContextMenu` | `.mstr-ai-chatbot-ContextMenu-content` | element |
| `DatasetObjectContextMenu` | `.mstr-ai-chatbot-DatasetObjectMenu-menu` | element |
| `UploadFilePage` | `.mstrmojo-di-view.mstrmojo-di-view-popup` | element |
| `Table` | `#mstr696` | element |
| `AdvancedModeButton` | `.mstr-ai-chatbot-Datasets-titlebar .mstr-ai-chatbot-Button` | button |
| `AdvancedContainer` | `.mstr-ai-chatbot-Button.mstr-ai-chatbot-Button--theme-secondary` | button |
| `CoverSpinner` | `.mstr-ai-chatbot-Spinner` | element |
| `OKButtonInAttributeForms` | `.mstr-ai-chatbot-AttributeFormsSelector-actions .mstr-ai-chatbot-Button--theme-primary` | button |
| `UpdateDatasetButton` | `.mstr-ai-chatbot-Datasets-addDataset` | element |
| `DuplicateNameAlertContainer` | `.mstr-ai-chatbot-DuplicateNameDialog-text` | element |
| `DatasetSelector` | `.mstr-ai-chatbot-Select-selectTrigger` | dropdown |
| `NoMatchContent` | `.mstr-ai-chatbot-Datasets-noContent` | element |
| `DatasetDropdownIcon` | `.mstr-ai-chatbot-Select-selectIcon` | dropdown |
| `AddNewBotButton` | `.mstr-ai-chatbot-Datasets-addBotText` | element |
| `BotAliasWarning` | `.mstr-ai-chatbot-Datasets-data-source-bot-alias-warning` | element |

**Actions**
| Signature |
|-----------|
| `getDatasetPanelDatasetTitleName(index = 0)` |
| `getUnstructuredDataItemNameText(index = 0)` |
| `openDatasetContextMenuV2(datasetName, universalBot = false)` |
| `openDatasetObjectContextMenuV2(datasetName, objectName)` |
| `clickDatasetContextMenuItem(text)` |
| `clickDatasetObjectContextMenu(firstOption, secondOption)` |
| `clickFormOrMetricContextMenuItem(text)` |
| `isDataDisplayed(type, name)` |
| `clickCheckBoxInSearchResult(name)` |
| `isDatasetDisplayed(name)` |
| `isDataContextMenuDisplayed()` |
| `getDatasetNameText(index = 0)` |
| `isSearchIconPresent()` |
| `isSearchPresent()` |
| `inputSearchText(text)` |
| `inputDatasetName(text)` |
| `renameDataset(text)` |
| `searchInReplaceDialog(text)` |
| `hoverSearchBox()` |
| `isClearSearchIconDisplayed()` |
| `clickDatasetArrow()` |
| `clickFolderArrow(name)` |
| `isNoContentMessageDisplayed()` |
| `isDescriptionDisabled(el)` |
| `isDatasetDescriptionDisabled(datasetName)` |
| `isObjectDescriptionDisabled(datasetName, objectName)` |
| `isBotDescriptionDisabled(botName)` |
| `checkOrUncheckData(elem)` |
| `clickCheckboxOnDatasetTitle(name)` |
| `isDataChecked(elem)` |
| `isDataCheckedInFolder(elem)` |
| `waitForRefreshPageLoading()` |
| `clickOnDatasetInReplace(name)` |
| `openMenu()` |
| `isMenuContainerDisplayed()` |
| `isDisplayedDatasetName(name)` |
| `isDisplayReplacePage()` |
| `waitForCoverSpinnerDismiss()` |
| `waitForReplacePageLoading()` |
| `clickReplacePageButton(button)` |
| `clickMenuButtonForDataset(name)` |
| `openDataset(name)` |
| `closeDataset(name)` |
| `waitForEditPageLoading()` |
| `waitForEditPageClose()` |
| `clickButtonInEditPage()` |
| `clickMojoPageButton(button)` |
| `clickManipulateButtonDisplayed(button)` |
| `clickOneDatasetManipuButton(dataset, button)` |
| `hideDatasetList()` |
| `waitForSearchContainerDisplayed()` |
| `waitForRefreshLoading()` |
| `isErrorIconDisplayed()` |
| `isPanelErrorIconDisplayed()` |
| `waitForNewDIPageLoading()` |
| `chooseDataType(text)` |
| `renameErrorMessage()` |
| `setName(value)` |
| `clickOnDatasetInSearch(name)` |
| `clickOnDatasetTitle(index = 0)` |
| `waitForDataPanelContainerLoading()` |
| `tooltipText()` |
| `panelTooltipText()` |
| `hoverErrorIcon()` |
| `isWarningForDatasetDisplayed(name)` |
| `isWarningForBotDisplayed(name)` |
| `hoverErrorIconForDataset(name)` |
| `tooltipTextForDataset(name)` |
| `hoverPanelErrorIcon()` |
| `checkAllInRefresh()` |
| `chooseFileInNewDI(text, title = newDIUILabels.English.dataSourceTitle)` |
| `waitForFileSamplePageLoading(title = newDIUILabels.English.dataSourceTitle)` |
| `waitForTextAppearInDataSetPanel(text)` |
| `isFileSamplePageDisplayed()` |
| `waitForLoaded()` |
| `waitForNewDIClose()` |
| `clickMenuItemInEdit(text)` |
| `hoverMenuItem(text)` |
| `waitForUploadFilePageLoading()` |
| `hoverTable(text)` |
| `manipulateTable(elem)` |
| `clickDataSortBy(text)` |
| `switchToAdvancedMode()` |
| `isAdvancedButtonDisplayed()` |
| `isAdvancedButtonEnabled()` |
| `getDatasetName(index = 0)` |
| `hoverOnDatasetName(index = 0)` |
| `isLinkIconDisplayed()` |
| `isLinkIconDisplayedOfObject(dataset, object)` |
| `hoverOnDataName(data)` |
| `rightClickOnDataName(data)` |
| `rightClickOnObjectFromDataset(dataset, object)` |
| `renameData(data, text)` |
| `clickDatasetTypeInDatasetPanel(datasetType)` |
| `clickOkBtnInAttributeForms()` |
| `checkOrUncheckAttributeForms(form)` |
| `clickAdvancedButton()` |
| `searchDataset(searchText)` |
| `toggleShowDescription()` |
| `getShowDescriptionState()` |
| `hasDescriptionVisible()` |
| `isDescriptionVisible(datasetName, objectName)` |
| `openDatasetSelector()` |
| `selectDatasetFromDropdown(datasetName)` |
| `getSelectedDatasetText()` |
| `enableShowDescription()` |
| `disableShowDescription()` |
| `getDescriptionText(datasetName, objectName)` |
| `getBotDescriptionText(botName)` |
| `isDatasetOptionDisplayed(datasetName)` |
| `clickUpdateDatasetButton({ isWaitLoading = true } = {})` |
| `getAllDatasetObjects()` |
| `isDatasetObjectSelected(objectName)` |
| `toggleCheckboxForDatasetObject(objectName)` |
| `hideDatasetObject(objectName)` |
| `toggleNerSwitchForDatasetObject(objectName)` |
| `hasObjectDescription(objectName)` |
| `updateDatasetDescription(datasetName, newDescription)` |
| `updateObjectDescription(datasetName, objectName, newDescription)` |
| `updateBotDescription(botName, newDescription)` |
| `waitForNerSwitchSpinnerAppear(objectName)` |
| `waitForNerCurtainDisappear(datasetName, objectName)` |
| `waitForNerSwitchSpinnerDisappear(objectName)` |
| `clickNewBotButton()` |
| `inputBotAlias(botName, aliasName)` |
| `updateBotAlias(botName, aliasName)` |
| `addBotAlias(botName, aliasName)` |
| `deleteBotAlias(botName)` |
| `editBotAlias(botName, aliasName)` |
| `getDatasetObjectCount()` |
| `isDatasetElementDisplayed(data)` |
| `getSubBotCount()` |
| `isDatasetMenuItemDisplayed(text)` |
| `isBotAliasWarningDisplayed()` |
| `getBotAliasWarningText()` |
| `getBotAliasPreviewText(botName)` |
| `closeDatasetWarningDialog()` |
| `isNerSwitchChecked(objectName)` |
| `isNerEnabledForObject(datasetName, objectName)` |
| `createColumnAlias(datasetName, objectName, aliasName)` |
| `isColumnAliasDisabled(datasetName, objectName)` |
| `enableInputByClickAlias(dataName, objectName)` |
| `addColumnAliasInInput(aliasName)` |
| `deleteColumnAliasInInput(aliasName)` |
| `deleteColumnAlias(datasetName, objectName, aliasName)` |
| `isColumnAliasDisplayed(datasetName, objectName, aliasName)` |

**Sub-components**
- libraryAuthoringPage
- getDatasetPanel
- getSearchContainer
- getSearchInReplaceDialogContainer
- getDatasetContainer
- getBotContainer
- getBotAliasContainer
- getRefreshPage
- getMenuContainer
- waitForReplacePage
- getReplacePage
- getDataPanelContainer
- getArrowButtonForDatasetContainer
- getEditPage
- getMojoPage
- getPanel
- getNewDIPage
- waitForNewDIPage
- waitForRefreshPage
- waitForFileSamplePage
- getSampleFileContentContainer
- getFileSamplePage
- getUploadFilePage
- getAdvancedContainer

---

### AIBotDatasetPanelContextMenu
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `CurrencyTabButton` | `.ant-btn.ant-btn-text.ant-btn-sm.ant-btn-icon-only.currency-shortcut-btn.number-format-tooltip` | button |
| `OKButton` | `.ant-btn.ant-btn-primary.mstr-button.mstr-button__primary-type.mstr-button__regular-size` | button |
| `CancelButton` | `.ant-btn.ant-btn-default.mstr-button.mstr-button__regular-type.mstr-button__regular-size` | button |
| `NumberFormat` | `.number-text-format-panel.number-format-panel` | element |
| `NumberFormatContainer` | `.number-text-format-panel` | element |
| `AttributeFormContainer` | `.mstr-ai-chatbot-AttributeFormsSelector` | dropdown |
| `OKInAttributeForm` | `.mstr-ai-chatbot-Button.mstr-ai-chatbot-Button--theme-primary` | button |
| `CancelInAttributeForm` | `.mstr-ai-chatbot-Button.mstr-ai-chatbot-Button--theme-secondary` | button |

**Actions**
| Signature |
|-----------|
| `isChecked(form)` |
| `isNumberFormatButtonDisplayed()` |
| `isRenameDisplayed()` |
| `isAttributeFormsButtonDisplayed()` |
| `hoverOnNumberFormatButton()` |
| `hoverOnAttributeFormsButton()` |
| `rightClickElementByName(type, name)` |
| `rightClickElementById(type, index)` |
| `getElementName(type, index)` |
| `openRenamingByRightClick(type, index)` |
| `openRenamingByDoubleClick(type, index)` |
| `renameElementAndPressEnter(type, renameText)` |
| `renameElementAndPressTab(type, renameText)` |
| `renameElementAndClickOutside(type, renameText)` |
| `renameAllElementsOfSameType(type, nameToRenameTo)` |
| `switchNumberFormatTypeToCurrency()` |
| `pickCurrencyGBP()` |
| `changeMetricNumberFormattingToCurrencyGBP(name)` |
| `checkNumberFormat(testCase, imageName)` |
| `clickOkInNumberFormat()` |
| `clickOKInAttributeForm()` |
| `clickCancelInAttributeForm()` |
| `checkUncheckAttributeForm(form, attribute)` |
| `changeMetricNumberFormattingToType(numberFormatType, metricName)` |
| `changeAttributeFormat(data, forms, cancel = false)` |
| `getTextFromMetrics(elementTypeMetric)` |
| `prepareMetricArrayAndCheck(savedMetrics, arrayToBeChecked)` |
| `checkIfSuggestionContainsRenamedMetric(savedMetrics)` |
| `checkBotIfResponseContainsExpectedMetric(savedMetrics)` |
| `checkBotIfTopicsContainsRenamedMetric(savedMetrics)` |
| `verifyQuestionsGivenAttributeAndMetric(question, metricNames, screenshotSuffix, testCase = 'TC93244')` |
| `changeAndCheckMetricType(numberFormatType, nameOfMetricWithChangedFormatting, question, index)` |

**Sub-components**
- aibotDatasetPanel
- aibotChatPanel
- getAttributeFormContainer

---

### AIBotPromptPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AddPromptBtn` | `.mstr-ai-chatbot-AliasConfig-addPrompt` | element |
| `ConfigPromptTitle` | `.mstr-ai-chatbot-AliasConfig-title` | element |
| `PromptGalleryPanel` | `.mstr-ai-chatbot-GalleryPanel-galleryContainer` | element |

**Actions**
| Signature |
|-----------|
| `clickAddPromptBtn()` |
| `isAliasObjDisplayed(index)` |
| `TypeInputBox(input, newValue)` |
| `renameAliasName(index, name)` |
| `updatePromptQuesion(index, Q)` |
| `deletePromptByIndex(index)` |
| `clickPromptPlayBtn(index)` |
| `deleteAllPrompts()` |
| `clickPromptQuickRepliesBtn()` |
| `clickPromptQuickRepliesByTitle(promptTitle)` |
| `clickPromptCardByTitle(promptTitle)` |
| `validatePromptCardDisplayed(promptTitle)` |

**Sub-components**
_none_

---

### AIBotSnapshotsPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `EmptySnapshotImage` | `.mstr-ai-chatbot-SnapshotsPanelEmptyContent-image` | element |
| `SortButton` | `.mstr-ai-chatbot-SnapshotSortButton` | button |
| `SortMenu` | `.mstr-ai-chatbot-SnapshotSortButton-content` | button |
| `ClearSnapshotsController` | `.mstr-ai-chatbot-SnapshotsPanelContent-controller` | element |
| `ConfirmClearSnapshotsButton` | `.mstr-ai-chatbot-ConfirmationButton-confirm` | button |
| `SnapshotsLoadingIcon` | `.mstr-ai-chatbot-Spinner.mstr-ai-chatbot-Spinner--grey` | element |
| `MySnapshotsPanel` | `.mstr-ai-chatbot-SnapshotsPanel` | element |
| `EmptySnapshotPanel` | `.mstr-ai-chatbot-SnapshotsPanelEmptyContent` | element |
| `SnapshotPanelHeader` | `.mstr-ai-chatbot-SnapshotsPanel-headerTitle` | element |
| `SortContent` | `.mstr-ai-chatbot-SnapshotSortButton-content` | button |
| `SnapshotFocusViewCloseButton` | `.mstr-ai-chatbot-SnapshotFocusView-close` | element |
| `CategoryListPanel` | `.mstr-ai-chatbot-Popover-content` | element |
| `MaximizeButtonFromSnapshot` | `.mstr-ai-chatbot-FocusSnapshotButton` | button |
| `SnapshotNuggetsPopoverContentDatasetTitle` | `.mstr-ai-chatbot-CINuggetsPopoverContent-nugget-right-title` | element |

**Actions**
| Signature |
|-----------|
| `searchByText(text)` |
| `clearSearch()` |
| `isSnapshotCardDisplayed(text)` |
| `clickNuggetTriggerIconFromMaximizeView()` |
| `clickInterpretationFromMaximizeView()` |
| `clickSnapshotNuggetTriggerIcon()` |
| `clickInterpretationFromSnapshot()` |
| `clickMaximizeButtonFromSnapshot()` |
| `clickMaximizeButton(index = 0)` |
| `clickSortButton()` |
| `setSortBy(sortBy)` |
| `setSnapshotTimeForAll(value)` |
| `clickFocusSnapshotButton(index = 0)` |
| `clickCloseFocusViewButton()` |
| `isClearSnapshotButtonDisplayed()` |
| `clickClearSnapshots()` |
| `clickConfirmClearSnapshotsButton()` |
| `clearSnapshot()` |
| `clickBackToChatPanel()` |
| `closeSnapshotsPanel()` |
| `isEmptySnapshotPanelDisplayed()` |
| `waitForSnapshotCardLoaded(index = 0)` |
| `waitForExportComplete()` |

**Sub-components**
- aibotChatPanel
- getMySnapshotsPanel
- getEmptySnapshotPanel
- getCategoryListPanel
- getCloseSnapshotsPanel
- getSnapshotCardInSnapshotPanel

---

### AIBotToastNotification
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ToastNotification` | `.mstr-ai-chatbot-Toast` | element |

**Actions**
| Signature |
|-----------|
| `isToastNotificationVisible()` |

**Sub-components**
_none_

---

### AIBotUsagePanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `UsagePanelHeader` | `.mstr-ai-chatbot-Header-label` | element |
| `UsageDateRangeDropdown` | `.mstr-ai-chatbot-PeriodDropdown-usageRecordsSelect` | dropdown |
| `UsageContent` | `.mstr-ai-chatbot-Tabs-usage` | element |
| `ResponseTooltip` | `.mstr-ai-chatbot-TileItem-infoIconWrapper` | element |
| `UsageDownloadButton` | `.mstr-ai-chatbot-Header-download` | element |
| `UsageDownloadFailedMessage` | `.mstr-ai-chatbot-FailedDownloadDialog-msg` | element |
| `UsageDownloadFailedMessageDashboard` | `.mstrd-MessageBox-msg` | element |
| `ErrorMessageArrow` | `.icon-submenu_arrow` | element |
| `UsageDownloadErrorDetails` | `#mstrd-MessageBox-detailsText-1 > div` | element |
| `UsageDownloadFailedOkButton` | `.mstr-ai-chatbot-Button` | button |
| `UsageDownloadFailedOkButtonDashboard` | `.mstrd-ActionLinkContainer-text` | element |
| `UsagePanelMessage` | `.mstr-ai-chatbot-UsagePanel-message` | element |
| `OkButton` | `.mstrmojo-Button-text=OK` | button |

**Actions**
| Signature |
|-----------|
| `clickUsageDateRangeDropdown()` |
| `clickUsageDateRange(text)` |
| `hoverOnResponseTooltip()` |
| `clickUsageDownloadButton()` |
| `clickUsageDownloadFailedOkButton()` |
| `clickUsageDownloadFailedOkButtonDashboard()` |
| `clickErrorMessageArrow()` |
| `clickDashboardPropertiesTab(text)` |
| `clickInterpretationButton()` |
| `enableInterpretation()` |
| `disableInterpretation()` |
| `clickOkButton()` |
| `isResponseTooltipDisplayed()` |
| `isUsageTileValueDisplayed(title)` |
| `isUsageTileValueHidden(title)` |
| `isUsageTileValueCorrect(title, expectedValue)` |
| `isInterpretationEnabled()` |

**Sub-components**
_none_

---

### AIDiagProcess


**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getQueryResult()` |
| `getLLMSQL()` |
| `ifVizGenerated()` |
| `extractSpeakerAnswer()` |
| `validate_data_on_requirement(requirement, summary, data = null)` |
| `validate_content_in_dashboard_action(diagData, content = [])` |

**Sub-components**
_none_

---

### Bot2Chat
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getLatestAnswerInAIChatbot()` |
| `verifyAnswerContainsKeywords(words, ignoreCase = true)` |
| `verifyAnswerContainsOneOfKeywords(words, ignoreCase = true)` |
| `checkMetricValue(response, metricArray)` |

**Sub-components**
- libraryPage
- libraryAuthoringPage
- aiBotChatPanel
- dossierAuthoringPage
- aiBotDatasetPanel

---

### BotAppearance
> Extends: `BaseBotConfigTab`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AppearancePanel` | `.mstr-ai-chatbot-AppearancePanel-container` | element |
| `ThemeSelector` | `.mstr-ai-chatbot-ThemeSelect-wrapper` | dropdown |
| `ThemeTooltip` | `.mstr-ai-chatbot-AppearancePanel-theme-info` | element |
| `PalettesSelector` | `.mstr-ai-chatbot-PaletteSelect-select-trigger` | dropdown |
| `PaletteSelectPanel` | `.mstr-ai-chatbot-PaletteSelect-select-content` | dropdown |
| `PaletteSelectIndicator` | `.mstr-ai-chatbot-PaletteSelect-select-item-indicator` | dropdown |

**Actions**
| Signature |
|-----------|
| `openThemeList()` |
| `changeThemeTo(theme)` |
| `changeThemeItemColor(itemLabel, colorAriaLabel)` |
| `triggerThemeTooltip()` |
| `openPaletteDropdownList()` |
| `closePaletteDropdownList()` |
| `changePaletteTo(palette)` |
| `checkPaletteInApp({
        appId = 'C2B2023642F6753A2EF159A75E0CFF29', projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', botId: botId, })` |
| `isPaletteSelected(palette)` |
| `isPaletteSelectIndicatorDisplayed()` |

**Sub-components**
- libraryAuthoringPage
- libraryPage
- getThemeSelectorItemContainer
- getPaletteSelectPanel

---

### BotAuthoring
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AIBotEditLoading` | `.mstr-ai-chatbot-LoadingIcon-content--visible` | element |
| `AIBotToolbar` | `.mstrd-DossierViewNavBarContainer` | element |
| `AIBotPanel` | `.mstrd-AIBotPanelWrapper-main` | element |
| `BotAuthoringContainer` | `.mstr-ai-chatbot-EditingLayout` | element |
| `BotConfigContainer` | `.mstr-ai-chatbot-ConfigTabs-root` | element |
| `ConfigTabsHeaderContainer` | `.mstr-ai-chatbot-ConfigTabs-list` | element |
| `MessageBoxContainer` | `.mstrd-MessageBox-main.mstrd-MessageBox-main--modal` | element |
| `SaveButton` | `.SaveNavItem div.mstr-nav-icon` | element |
| `ArrowDownOnSave` | `.mstrd-SaveNavItemContainer .mstrd-ContextMenu-trigger` | element |
| `SaveBotDropDown` | `.mstrd-NavIconContextMenu-menu` | element |
| `SavingModalView` | `.saving-in-progress.modal` | element |
| `SaveSuccessMessageBox` | `.ant-message-notice` | element |
| `EditorCurtainMask` | `#waitBox .mstrmojo-Editor-curtain` | element |
| `SaveAsEditor` | `.mstrmojo-SaveAsEditor` | element |
| `CloseButton` | `.icon-pnl_close` | element |
| `ConfirmSaveDialog` | `.mstrmojo-Editor.mstrmojo-ConfirmSave-Editor` | element |
| `ConfirmOverrideDialog` | `.mstrmojo-Editor.mstrmojo-alert.modal` | element |
| `Alert` | `.mstrmojo-Box.alert-content` | element |
| `InActiveBanner` | `.mstrd-PageNotification-msg--inactive` | element |
| `Tooltip` | `.mstr-ai-chatbot-Tooltip` | element |
| `CertifyIcon` | `.mstrd-CertifiedIcon.mstrd-CertifiedIcon--expanded` | element |
| `SaveDialog` | `.mstrmojo-SaveAsEditor` | element |
| `EditorBtnsWithSaveBtn` | `.mstrmojo-Editor-buttons` | button |
| `SuccessToast` | `.mstrmojo-Label.mstrWaitMsg` | element |
| `CertifyTooltip` | `.ant-tooltip-inner` | element |
| `CacheManagerPage` | `.mstr-ai-chatbot-EditingLayout-agentCache` | element |
| `DecertifyButton` | `.mstrd-CertifiedIcon-decertify` | element |
| `ConfirmWarningDialog` | `.mstrmojo-Editor.mstrmojo-ConfirmSave-Editor.modal` | element |
| `EditingIconInAuthoringBotToolbar` | `.icon-info_edit` | element |
| `BotConfigDatasetDescription` | `.mstr-ai-chatbot-Datasets-description` | element |

**Actions**
| Signature |
|-----------|
| `getCertifyInfo()` |
| `waitForPageLoading()` |
| `clickSaveButton()` |
| `clickSaveAsButton()` |
| `clickArrowDownOnSave()` |
| `waitForSaveAsButtonClickable()` |
| `openButtonMenu()` |
| `selectBotConfigTabByName(name)` |
| `selectBotConfigTabByIndex(index)` |
| `clickBotConfigDatasetDescription()` |
| `saveBot({ skipClosingToast = true, expectSuccess = true })` |
| `saveExistingBotV2()` |
| `saveBotWithName(name, path)` |
| `saveBotWithConfirm()` |
| `saveAsBot({ name, path })` |
| `saveAsBotInMyReports(name)` |
| `saveBotBySaveDialog(expSuccess = true)` |
| `saveAsBotOverwrite()` |
| `exitBotAuthoring()` |
| `exitBotAuthoringWithoutSave()` |
| `getBotIdFromUrl()` |
| `getDossierIdFromUrl()` |
| `getProjectIdFromUrl()` |
| `scrollBotPanelHorizontally(toPosition)` |
| `clickCloseButton()` |
| `saveAndCertifyBot()` |
| `decertifyBotInTooltip()` |
| `clickConfirmButtonInNoPermissionAlert()` |
| `createBotBySampleData(languageID, isSaaS = false)` |
| `addSampleData(languageID, sampleFileName = 'Airline Sample Data')` |
| `waitForMessageBoxDisplay()` |
| `dismissErrorMessageBoxByClickOkButton()` |
| `hoverCertifyIcon()` |
| `isConfigTabSelected(name)` |
| `isInActiveBannerDisplayed()` |
| `isAIDisabledBannerDisplayed()` |
| `getInactiveBannerText()` |
| `isSaveAndCertifyButtonPresent()` |
| `isSaveAsButtonPresent()` |
| `isBotCertified()` |
| `isSaveDialogPresent()` |
| `isConfirmWarningDialogPresent()` |
| `isDecertifyButtonPresent()` |
| `isAiBotToolbarPresent()` |
| `isSaveButtonEnabled()` |
| `dismissTooltip()` |
| `openCacheManager()` |

**Sub-components**
- aibotChatPanel
- aibotDatasetPanel
- custommizationPanel
- dossierAuthoringPage
- libraryAuthoringPage
- getMessageBoxContainer
- getConfigTabsHeaderContainer
- getPage
- getConfigTabContainer
- getAIBotPanel
- getCacheManagerPage
- waitForPage

---

### BotConsumptionFrame
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AccountIconInToolbar` | `.icon-tb_profile_n` | element |
| `ShareButtonInToolbar` | `.icon-tb_share_n` | element |
| `EditButton` | `.icon-info_edit` | element |
| `BotConsumptionContaniner` | `.mstrd-DossierViewContainer` | element |
| `BotConsumptionToolbar` | `.mstrd-DossierViewNavBarContainer` | element |
| `BotNameSegmentInToolbar` | `.mstrd-DossierTitle span` | element |
| `BotName` | `.mstrd-DossierTitle span` | element |
| `EditAppearanceButton` | `.mstr-icons-lib-icon mstr-ai-chatbot-ConfigTabs-appearance` | element |
| `InactiveBanner` | `.mstrd-PageNotification-container--inactive` | element |
| `InactiveBannerMessage` | `.mstrd-PageNotification-msg--inactive` | element |

**Actions**
| Signature |
|-----------|
| `clickEditButton()` |
| `clickCloseButtonInMessageBox()` |
| `clickOkButtonInNeedPermissionMessageBox()` |
| `showDetail()` |
| `errorDetail()` |
| `getInactiveBannerText()` |
| `isInactiveMsgDisplayed()` |
| `isEditIconDisplayedInToolbar()` |
| `isInactiveBannerDisplayed()` |

**Sub-components**
- aiBotChatPanel

---

### BotCustomInstruction
> Extends: `BaseBotConfigTab`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `CustomInstructionsSwitch` | `.mstr-ai-chatbot-CustomInstruction-item .mstr-ai-chatbot-Switch-root` | element |
| `FiscalYearSettings` | `.mstr-ai-chatbot-FiscalYearSettings` | element |
| `FiscalYearSwitch` | `.mstr-ai-chatbot-FiscalYearSettings .mstr-ai-chatbot-Switch-root` | element |
| `KnowledgeSection` | `.mstr-ai-chatbot-knowledge-container` | element |
| `ExecuteAclWarning` | `.mstr-ai-chatbot-collection-container-item-warning` | element |
| `ConfirmDeleteContainer` | `.mstr-ai-chatbot-ConfirmationDialog` | element |
| `DownloadLearningSection` | `.mstr-ai-chatbot-ConsolidatedLearnings` | element |
| `DownloadLearningTitle` | `.mstr-ai-chatbot-ConsolidatedLearnings-title` | element |
| `DownloadLearningButton` | `.mstr-ai-chatbot-LearningDownloadButton` | button |
| `DownloadLearningInfoIcon` | `.mstr-ai-chatbot-ConsolidatedLearnings-infoIcon` | element |
| `LastDownloadedTimeLabel` | `.mstr-ai-chatbot-download-learning-info-dialog-last-time-label` | element |
| `LastDownloadedTime` | `.mstr-ai-chatbot-ConsolidatedLearnings-lastDownloadDate` | element |
| `TotalLearningCapturedLabel` | `.mstr-ai-chatbot-ConsolidatedLearnings-learningCountLable` | element |
| `TotalLearningCaptured` | `.mstr-ai-chatbot-ConsolidatedLearnings-learningCount` | element |
| `AdaptiveLearningWarning` | `.mstr-ai-chatbot-ConsolidatedLearnings-warnText` | element |
| `DownloadLearningError` | `.mstr-ai-chatbot-download-learning-error` | element |
| `AdvencedConfigurationTitle` | `.mstr-ai-chatbot-CustomInstruction-item-title` | element |
| `WebManagementSetting` | `.mstr-ai-chatbot-WebSearchSettings` | element |

**Actions**
| Signature |
|-----------|
| `getLastDownloadedTime()` |
| `getTotalLearningCaptured()` |
| `getAdaptiveLearningWarning()` |
| `getAdvancedConfigurationTitleText()` |
| `getSendObjectDescriptionSwitchLabelText()` |
| `getApplyTimeFilterSwitchLabelText()` |
| `enableCustomInstructions()` |
| `disableCustomInstructions()` |
| `inputBackground(background)` |
| `inputFormat(format)` |
| `inputDeniedAnswer(deniedAnswer)` |
| `inputCustomInstructions(instructions, index = 0)` |
| `inputBackgroundByPaste(background)` |
| `inputFormatByPaste(format)` |
| `triggerBackgroundTooltip()` |
| `triggerFormatTooltip()` |
| `triggerProgressErrorTooltip(index = 0)` |
| `waitForNuggetsItemsLoaded()` |
| `hoverOnMissingFileWarningIcon()` |
| `hoverOnNuggetTitle(index = 0)` |
| `deleteNuggetItem(index = 0)` |
| `makeFileUploaderVisible(fileUploderInput)` |
| `fakeNuggetNameInUI(index = 0)` |
| `uploadNuggetsFileWorkaroundNoWait({ fileName, fileUploader = this.getNuggetFileUploadInput()` |
| `upLoadNuggetsFileError(fileName)` |
| `uploadNuggetsFileWorkaround({ fileName, fileUploader, index = 0 })` |
| `reuploadNuggetsFile(fileName, index = 0)` |
| `uploadNuggetsFile(fileName)` |
| `scrollToBottom()` |
| `scrollCustomInstructionsTo(position)` |
| `hoverDownloadLearningInfoIcon()` |
| `hoverDownloadLearningButton()` |
| `clickDownloadLearningButton()` |
| `enableSendObjectDescription()` |
| `disableSendObjectDescription()` |
| `enableApplyTimeFilter()` |
| `disableApplyTimeFilter()` |
| `hoverOnApplyTimeFilterInfoIcon()` |
| `hoverOnSendObjectDescriptionInfoIcon()` |
| `setAttributeFormTemperature(value)` |
| `setMetricTemperature(value)` |
| `setSpeakerTemperature(value)` |
| `hoverOnAttributeFormTemperatureTooltip()` |
| `hoverOnMetricTemperatureTooltip()` |
| `hoverOnSpeakerTemperatureTooltip()` |
| `resetAttributeFormTemperature()` |
| `resetMetricTemperature()` |
| `resetSpeakerTemperature()` |
| `turnOnWebManagement()` |
| `turnOffWebManagement()` |
| `getAllowlistItemCount()` |
| `getBlocklistItemCount()` |
| `inputDomain(tag, domain)` |
| `inputAllowlistDomain(domain)` |
| `inputBlocklistDomain(domain)` |
| `addAllowlistDomain(domain)` |
| `addBlocklistDomain(domain)` |
| `getAllowlistLatestErrorMessage()` |
| `getAllowlistErrorMessageCount()` |
| `getBlocklistLatestErrorMessage()` |
| `getBlocklistErrorMessageCount()` |
| `deleteLatestAllowlistDomain()` |
| `deleteLatestBlocklistDomain()` |
| `deleteAllAllowlistDomains()` |
| `deleteAllBlocklistDomains()` |
| `deleteAllDomains()` |
| `isCustomInstructionsEnabled()` |
| `isInputBoxEnabled()` |
| `isDownloadLearningButtonEnabled()` |
| `isInputBoxDisabled()` |
| `isLastDownloadedTimeVisible()` |
| `isLearningSectionVisible()` |
| `isSendObjectDescriptionEnabled()` |
| `isApplyTimeFilterEnabled()` |
| `isWebManagementDisplayed()` |
| `isAddBtnOnAllowlistDisabled()` |
| `getAttributeFormTemperatureValue()` |
| `getMetricTemperatureValue()` |
| `getSpeakerTemperatureValue()` |
| `isTemperatureDisplayed()` |
| `isFiscalYearEnabled()` |
| `enableFiscalYear()` |
| `disableFiscalYear()` |
| `selectDropdownOption(dropdownTrigger, optionText)` |
| `selectAdvancedCalendarDropdownOption(dropdownTrigger, datasetName, elementName)` |
| `selectRadioButtonByText(text)` |
| `isCalendarSettingsDisabled(index)` |
| `selectAdvancedCalendarDropdownBySearch(dropdownTrigger, input, elementName)` |

**Sub-components**
- getConfirmDeleteContainer
- getNuggetsFileUploaderContainer
- getKnowledgeContainer
- getTemperatureSliderContainer
- getUploadedFileProgressContainer
- getCurrentTabContainer

---

### BotRulesSettings
> Extends: `BaseBotConfigTab`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ManageRulesTitle` | `.mstr-ai-chatbot-RulesPanel-title` | element |
| `AddRuleButton` | `.mstr-ai-chatbot-RulesPanel-add-button` | button |
| `RulesList` | `.mstr-ai-chatbot-RulesPanel-rules-list` | element |
| `SearchInputForDropdown` | `.ant-select-selection-search-input.focus-visible` | input |
| `Dropdown` | `.ant-select-dropdown:not(.ant-select-dropdown-hidden)` | dropdown |
| `FilterWhenInput` | `.mstr-ai-chatbot-FilterItem-when-input` | input |
| `FilterDropdownTrigger` | `.mstr-ai-chatbot-DatasetObjectPicker` | element |
| `FilterOperatorDropdownTrigger` | `.mstr-ai-chatbot-FilterItem-operator-select` | dropdown |
| `FilterValueInput` | `.mstr-ai-chatbot-FilterItem-element-input` | input |
| `DraggableRuleWhenInput` | `.mstr-ai-chatbot-DraggableRuleItem-when-input` | input |
| `DraggableRuleEditingContainer` | `.mstr-ai-chatbot-DraggableRuleItem-editing-container` | element |
| `GeneralItemEditingContainer` | `.mstr-ai-chatbot-SqlTemplateGeneralItem-editing-container` | element |

**Actions**
| Signature |
|-----------|
| `clickManageRulesTitleToExitEdit()` |
| `addNewRule()` |
| `deleteRuleByIndex(index)` |
| `renameRuleByIndex(index, newName)` |
| `addBasedOnObjectsBySelection(ruleIndex, objectNames)` |
| `inputTermForSearchDropdown(term)` |
| `clearSearchInputInDropdown()` |
| `openBasedOnDropdown(ruleIndex)` |
| `closeBasedOnDropdown(ruleIndex)` |
| `addBasedOnObjectsBySearch(ruleIndex, objectNames)` |
| `addBasedOnObjectsSelectingAll(ruleIndex)` |
| `addRecentlyEditedObjectsWithAllObjectsSelected(ruleIndex, objectNames)` |
| `clickItemInDropdown(objectName)` |
| `removeAllObjectsSelected(ruleIndex)` |
| `isEditIconPresentForBasedOnDropdown(objectName)` |
| `removeBasedOnObjectByName(ruleIndex, objectName)` |
| `clickAddButtonForOtherRules(ruleIndex, label)` |
| `isAddButtonForOtherRulesDisabled(ruleIndex, label)` |
| `configFilter(whenText = '', objectLabel, operator = '=', value)` |
| `removeFilterByIndex(ruleIndex, filterIndex)` |
| `editFilterByIndex(ruleIndex, filterIndex)` |
| `configOrderBy(whenText = '', objectLabel, clickSort = false)` |
| `editOrderByByIndex(ruleIndex, orderByIndex)` |
| `removeOrderByByIndex(ruleIndex, orderByIndex)` |
| `dragAndDropOrderByItem(ruleIndex, sourceIndex, targetIndex)` |
| `configGroupBy(whenText = '', objectNames)` |
| `editGroupByByIndex(ruleIndex, groupByIndex)` |
| `removeGroupByByIndex(ruleIndex, groupByIndex)` |
| `dragAndDropGroupByItem(ruleIndex, sourceIndex, targetIndex)` |
| `expandBasedOnObjectCollapseArrowByName(ruleIndex, basedOnObject)` |
| `clickAddButtonInBasedOnObjectConfiguration(ruleIndex, basedOnObject)` |
| `clickBasedOnConfigurationActionDropdown(ruleIndex, basedOnObject)` |
| `addBasedOnObjectConfiguration(ruleIndex, basedOnObject, action = 'Require')` |
| `selectMultipleObjectsInBasedOnObjectConfigurationDropdown(ruleIndex, basedOnObject, objectNames)` |
| `removeBasedOnObjectConfigurationItemByIndex(ruleIndex, basedOnObject, configIndex)` |
| `editBasedOnObjectConfigurationItemByIndex(ruleIndex, basedOnObject, configIndex, action)` |
| `expandAdvancedSettings(ruleIndex)` |
| `configTimeinAdvancedSettings(whenText='', dimension, value)` |
| `configPreferenceInAdvancedSettings(whenText='', oneObjectOption = false, objectLabel1, objectLabel2)` |
| `configGuardsInAdvancedSettings(whenText='', objectNames)` |
| `removeAdvancedSettingsRuleItemByIndex(ruleIndex, sectionIndex, itemIndex)` |
| `editAdvancedSettingsRuleItemByIndex(ruleIndex, sectionIndex, itemIndex)` |

**Sub-components**
- getRuleItemContainer
- getFilterItemContainer
- getDraggableRuleEditingContainer
- getAdvancedSettingsRuleContainer
- getGeneralItemEditingContainer

---

### BotVisualizations
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `InsightLineChartInfoIcon` | `.insightlinechart-info-icon` | element |
| `InsightLineIinfoWindow` | `.new-vis-tooltip-table` | element |
| `ShowErrorMessage` | `.mstr-design-collapse-header__title` | element |

**Actions**
| Signature |
|-----------|
| `clickShowErrorDetails()` |
| `checkVizByImageComparison(testCase, imageName, index = 0)` |
| `checkVizInSnapshotPanel(testCase, imageName, index = 0)` |
| `checkVizInSnapshotDialog(testCase, imageName)` |
| `checkMapByImageComparison(index, testCase, imageName)` |
| `checkQueryMessageByImageComparison(testCase, imageName)` |
| `rightClickGridCell(index, mode)` |
| `clickGridCell(index, mode)` |
| `rightClickRect(mode)` |
| `clickFistRect(mode)` |
| `hoverOnFistRect(mode)` |
| `hoverOnHeatmap(mode, offset = { x: 0, y: 0 })` |
| `rightClickOnHeatmap(mode, offset = { x: 0, y: 0 })` |
| `rightClickGMShape(mode)` |
| `clickGMShape(mode)` |
| `hoverOnGMShape(mode)` |
| `hoverInsightLineChartInfoIcon()` |
| `clickSnapshotViz()` |
| `clickMapZoomInButton(mode)` |
| `clickMapResetButton(mode)` |
| `clickMapZoomOutButton()` |
| `hoverMapbox(index = 0)` |
| `hoverGMYaxisTitle()` |
| `clickGMYaxisTitle()` |
| `clearHistoryAndAskQuestion(imageFolder, vizType, aiEntry = 'bot')` |
| `isLineChartInBotExist()` |

**Sub-components**
- libraryAuthoringPage
- libraryPage
- aibotChatPanel
- aIBotSnapshotPanel

---

### CacheManager
> Extends: `BotAuthoring`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `CloseCacheManagerButton` | `.mstr-nav-icon.icon-pnl_close` | element |
| `CacheSettingBackdrop` | `.mstr-ai-chatbot-CacheSettingsDialog-backdrop` | element |
| `CacheSettingIcon` | `.mstr-ai-chatbot-CacheQuestionGroups-header-settings-icon` | element |
| `CacheSettingsDialog` | `.mstr-ai-chatbot-CacheSettingsDialog` | element |
| `CachingModeDropdown` | `.mstr-ai-chatbot-Select-viewport` | dropdown |
| `DeleteCachesButton` | `.mstr-ai-chatbot-CacheSettingsDialog-delete-button` | button |
| `BucketPanel` | `.mstr-ai-chatbot-CacheQuestionGroups` | element |
| `BucketContextMenuContainer` | `.mstr-ai-chatbot-CacheQuestionCard-context-menu` | element |
| `BucketGroupList` | `.mstr-ai-chatbot-CacheQuestionCard-submenu-merge-content` | element |
| `BucketPinTitle` | `.mstr-ai-chatbot-CacheQuestionGroups-collapsible-title` | element |
| `QuestionPanel` | `.mstr-ai-chatbot-CacheQuestionsPanel` | element |
| `QuestionDetailsPanel` | `.mstr-ai-chatbot-CacheQuestionsPanel-caching-container` | element |
| `ViewSQLLink` | `.mstr-ai-chatbot-CacheQuestionsPanel-sql-link` | element |
| `SQLDialog` | `.mstr-ai-chatbot-SQLDialog` | element |
| `SQLOutputPanel` | `.mstr-ai-chatbot-SQLDialog-output-panel` | element |
| `QuestionContextMenu` | `.mstr-ai-chatbot-CacheQuestionsPanel-question-context-menu` | element |
| `CreateNewBucketOption` | `.mstr-ai-chatbot-MoveToDropdown-item--create` | dropdown |
| `QuestionAnswerPanel` | `.mstr-ai-chatbot-CacheQuestionAnswer` | element |
| `ColumnContainer` | `.ag-virtual-list-container.ag-column-select-virtual-list-container` | dropdown |
| `Toast` | `.mstr-ai-chatbot-Toast-viewport` | element |

**Actions**
| Signature |
|-----------|
| `closeCacheManager()` |
| `openCacheSettings()` |
| `closeCacheSettings()` |
| `openCachingModeDropdown()` |
| `selectCachingMode(mode)` |
| `deleteCaches()` |
| `openBucketContextMenu(index = 0)` |
| `selectBucketContextMenuOption(firstOption, secondOptionIndex)` |
| `openBucketByIndex(index = 0)` |
| `openBucketByName(text)` |
| `openViewSQL()` |
| `verifySQL()` |
| `saveSQL()` |
| `closeViewSQL()` |
| `expandQuestion(index = 0)` |
| `openQuestionContextMenu(index = 0)` |
| `selectQuestionContextMenuOption(firstOption, secondOption)` |
| `expandColumns()` |
| `collapseColumns()` |
| `selectColumnByName(text)` |
| `waitForToastGone()` |
| `searchBuckets(text)` |
| `clearSearch()` |
| `isCacheSettingsDialogDisplayed()` |
| `getCurrentCachingMode()` |
| `isDeleteCachesButtonDisplayed()` |
| `getCachingBucketsCount()` |
| `getQuestionListCount()` |
| `getBucketPinCount()` |
| `isColumnCheckedByName(name)` |

**Sub-components**
- getBucketContextMenuContainer
- getSQLOutputPanel
- getBucketPanel
- getCacheManagerPage
- waitForPage
- getQuestionPanel
- getQuestionAnswerPanel

---

### ChatAnswer
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `hoverOnAnswer()` |
| `hoverAndGetTooltip(e)` |
| `clickMoreButton()` |
| `clickDownloadButton()` |
| `clickCopyButton()` |
| `clickPinButton()` |

**Sub-components**
_none_

---

### EmbedBotDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `EmbedBotDialogContainer` | `.mstrd-EmbedBotContainer-main` | element |

**Actions**
| Signature |
|-----------|
| `openEmbedBotFromShareMenu(text = 'Embed Agent')` |
| `openEmbedBotFromInfoWindow()` |
| `closeEmbedBotDialog()` |
| `downloadEmbedBotSnippet()` |
| `toggleHideSnapshots()` |
| `openHideDropdown()` |
| `selectHideOption(name)` |
| `openEmbedBotLearnMoreLink()` |
| `hideNameAndTime()` |

**Sub-components**
- getEmbedBotDialogContainer

---

### GeneralSettings
> Extends: `BaseBotConfigTab`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `GenerlSettingsContainer` | `.mstr-ai-chatbot-GeneralPanel-container` | element |
| `BotInfoSection` | `.mstr-ai-chatbot-GeneralPanel-botInfo` | element |
| `BotNameInput` | `.mstr-ai-chatbot-BotName-input` | input |
| `BotNameInvalidInputWarningIcon` | `.mstr-ai-chatbot-BotName-nameError` | element |
| `ActiveToggle` | `#active_switch` | element |
| `CoverImageContainer` | `.mstr-ai-chatbot-CoverImage` | element |
| `EditCoverImagePenIcon` | `.mstr-ai-chatbot-GalleryDialog-trigger-icon` | element |
| `EditCoverImageDialog` | `.mstr-ai-chatbot-GalleryDialog-container` | element |
| `GreetingInputBox` | `textarea[name=greetingText]` | element |
| `GreetingSection` | `.mstr-ai-chatbot-BotGreeting` | element |
| `GreetingCount` | `.mstr-ai-chatbot-Textarea-word-count.mstr-ai-chatbot-BotGreeting-count` | element |
| `TopicSection` | `.mstr-ai-chatbot-Topics` | element |
| `OptionalFeaturesSection` | `.mstr-ai-chatbot-OptionalFeatures` | element |
| `QuestionInputSection` | `.mstr-ai-chatbot-QuestionInput` | input |
| `QuestionInputHintInputBox` | `.mstr-ai-chatbot-QuestionInput-hint input` | input |
| `TotalAutoGenerateSuggestionLimit` | `.mstr-ai-chatbot-Select-container span:not(.mstr-ai-chatbot-Select-selectIcon)` | dropdown |
| `AutoGeneratedSuggestionLimitDropDownTrigger` | `.mstr-ai-chatbot-Select-container button` | button |
| `PopupContainer` | `.rc-virtual-list,.mstr-ai-chatbot-Select-viewport` | dropdown |
| `EditorCoverImage` | `.mstr-ai-chatbot-Clickable.mstr-ai-chatbot-CoverImage` | element |
| `CoverImageEditButton` | `.mstr-ai-chatbot-GalleryDialog-trigger-icon` | element |
| `PanelThemeSelect` | `.mstr-ai-chatbot-AppearancePanel-theme-section .mstr-ai-chatbot-Select-item` | dropdown |
| `QuestionSugestionsSection` | `.mstr-ai-chatbot-QuestionSuggestions` | element |
| `AddNewCustomSuggestionButton` | `.mstr-ai-chatbot-QuestionSuggestions-customAddNew` | element |
| `LimitsSection` | `.mstr-ai-chatbot-Limits` | element |
| `LinkSection` | `.mstr-ai-chatbot-Links` | element |
| `LinkIndicator` | `.mstr-ai-chatbot-Links-tooltip` | element |

**Actions**
| Signature |
|-----------|
| `getTopicsTitleTextByIndex(index)` |
| `getTopicsDescriptionTextByIndex(index)` |
| `getTopicsCount()` |
| `enableTopicSuggestion()` |
| `disableTopicSuggestion()` |
| `hoverTopicSwitch()` |
| `clickAddCustomTopicButton()` |
| `editCustomTopicByIndex(index, { title, description })` |
| `autoGenerateTopics()` |
| `enableTopicPanel()` |
| `disableTopicPanel()` |
| `removeTopicByIndex(index)` |
| `refreshTopics(index)` |
| `inputTopicTitleByIndex(index, title)` |
| `inputTopicsDescriptionByIndex(index, description)` |
| `addCustomTopic({ title, description })` |
| `updateBotName(name)` |
| `resetBotName()` |
| `resetGreeting()` |
| `resetQuestionInputHint()` |
| `hoverOnBotNameInvalidInputWarningIcon()` |
| `activeBot()` |
| `deactiveBot()` |
| `toggleActiveSwitch()` |
| `openCoverImageEditDialog()` |
| `closeCoverImageEditDialog()` |
| `updateCoverImageUrl(url)` |
| `switchBetweenImageCategory(category)` |
| `selectImageInGalleryByIndex(index = 0)` |
| `updateBotCoverImage({ url = '', category = 'All', index = 0 })` |
| `triggerCloseTooltip()` |
| `saveAndCloseEditCoverImageDialog()` |
| `updateGreetings(greeting)` |
| `toggleTopicSwitch()` |
| `toggleAllowSnapshotSwitch()` |
| `toggleEnableInterpretationSwitch()` |
| `openInterpretationTooltip()` |
| `turnOnAllowSnapshot()` |
| `turnOffAllowSnapshot()` |
| `turnOnEnableInterpretation()` |
| `turnOffEnableInterpretation()` |
| `updateQuestionInputHint(hint)` |
| `turnOnEnableSuggestion()` |
| `turnOffEnableSuggestion()` |
| `toggleEnableSuggestionSwitch()` |
| `openAutoSuggestionLimitSelectionDropdown()` |
| `setAutoSuggestionLimit(limit)` |
| `addCustomSuggestion(text)` |
| `deleteCustomSuggestionByIndex(index = 0)` |
| `setCustomSuggestionByIndex(index = 0, text)` |
| `setQuestionLimit(limit)` |
| `scrollToBottom()` |
| `scrollToTop()` |
| `clickAddLinkButton()` |
| `openLinkSettingsTooltip()` |
| `addExternalLink({ iconIndex = 0, title, url })` |
| `triggerInvalidUrlTooltip(index)` |
| `replaceText({ elem, text })` |
| `hoverOnInvalidUrlIconByIndex(index = 0)` |
| `setExternalLinkByIndex({ index = 0, iconIndex = 0, title, url })` |
| `deleteExternalLinkByIndex(index = 0)` |
| `triggerDeleteLinkTooltip(index)` |
| `selectLinkDisplayFormat(format)` |
| `waitForImageLoaded(elem)` |
| `hoverOnActiveToggleButton()` |
| `tickBotLogoSetting()` |
| `toggleDisplayBotLogo(flag = true)` |
| `hoverOnBotLogoInfoIcon()` |
| `isActiveBotSwitchOn()` |
| `isAllowSnapshotSwitchOn()` |
| `getBotAliasName()` |
| `getBotGreetingText()` |
| `isTopicsSuggestionEnabled()` |
| `isAddCustomTopicButtonPresent()` |
| `isAutoGenerateTopicsButtonPresent()` |
| `isTopcisPanelEnabled()` |
| `isDeleteTopicButtonPresent(index)` |
| `isRefreshTopicButtonEnabled(index)` |
| `isEnableInterpretationSwitchOn()` |
| `isEnableSuggestionSwitchOn()` |
| `isAutoSuggestionLimitOptionEnabled(option)` |
| `isAutoSuggestionLimitOptionSelected(option)` |
| `isDisplayBotLogoSettingOn()` |
| `selectCoverImage(index)` |
| `changeBotName(newName)` |
| `changeGreeting(newGreeting)` |
| `getCoverImageSrc()` |
| `openPanelTheme()` |
| `changePanelTheme(theme = 'Dark')` |
| `resetPanelTheme()` |
| `changeVizPalette()` |
| `resetVizPalette()` |
| `turnOnSnapshot()` |
| `turnOffSnapshot()` |
| `turnOnInterpretation()` |
| `turnOffInterpretation()` |
| `changeQuestionHint(newHint)` |
| `turnOnSuggestions()` |
| `turnOffSuggestions()` |
| `changeSuggestionNumber(number)` |
| `turnOnInsights()` |
| `turnOffInsights()` |
| `turnOnAutoComplete()` |
| `turnOffAutoComplete()` |
| `turnOnWebSearch()` |
| `turnOffWebSearch()` |
| `turnOffResearch()` |
| `turnOnResearch()` |
| `turnOnAskAbout()` |
| `turnOffAskAbout()` |
| `turnOnSqlTemplate()` |
| `turnOffSqlTemplate()` |
| `isExportSwitchOn()` |
| `isExportFullDataSwitchOn()` |
| `turnOnExport()` |
| `turnOffExport()` |
| `turnOnExportFullData()` |
| `turnOffExportFullData()` |
| `saveConfig()` |
| `getPanelThemeColor()` |

**Sub-components**
- getCoverImageContainer
- getImageCategoryButtonsContainer
- getGenerlSettingsContainer
- getBotLogoSettingContainer
- getPopupContainer
- isTopcisPanel
- getTopicsPanel
- getPanel

---

### HisoryPanel
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `switchToChat(name)` |
| `clickChatContextMenuBtn(name)` |
| `clickChatContextMenuItem(btnName)` |
| `closeChatHistoryPanel()` |
| `deleteChat(name)` |
| `deleteCurrentChat()` |
| `deleteChatByIndex(index)` |
| `renameChat(oldaName, newName)` |
| `searchChat(searchText)` |
| `clickChatCategoryHeader(name)` |
| `clearChatSearch()` |
| `getChatCount()` |
| `isHistoryPanelPresent()` |
| `isChatCatgeoryPresent(name)` |
| `isChatPresent(name)` |
| `isChatPartialNamePresent(partialName)` |
| `isChatCategoryOpen(name)` |
| `isChatCurrent(name)` |

**Sub-components**
- libraryPage
- libraryAuthoringPage
- aiBotChatPanel
- dossierAuthoringPage
- historyPanel

---

### MappingObjectInAgentTemplate
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `MappingObjectPage` | `.ant-modal-content` | element |
| `MyObjectsPanel` | `.mstrd-DatasetView` | element |
| `TemplateObjectPanel` | `.mstrd-ReplaceTemplateTable-custom-table` | element |
| `LaunchButton` | `.mstrd-ReplaceObjectsDialog-launchBtn` | button |

**Actions**
| Signature |
|-----------|
| `getAliasTagsForTemplateObject(templateObject)` |
| `getAliasTagByName(templateObject, aliasName)` |
| `dragDropObjectToMapWith(myObjectName, templateObjectName)` |
| `addColumnAlias(templateObject, alias)` |
| `removeColumnAlias(templateObject, alias)` |
| `removeObjectFromMapWith(mapwithObjectName)` |
| `searchInMyObjectsPanel(searchTerm)` |
| `clearSearchInMyObjectsPanel()` |
| `clickLaunchInAgentButton()` |
| `checkObjectMappedInMyObjectPanel(myObject)` |
| `checkMyObjectExistInTemplateObject(templateObjectName, myObjectName)` |

**Sub-components**
- getMyObjectsPanel
- getTemplateObjectPanel
- getObjectByNameInMyObjectPanel
- getSearchbarInMyObjectsPanel

---

### SnapshotCard
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SnapshotContainer` | `.mstr-ai-chatbot-MainView-snapshotContainer` | element |
| `MoveDialog` | `.mstr-ai-chatbot-MoveSnapshotButton-popover` | button |
| `UnreadIcon` | `.mstr-ai-chatbot-SnapshotCard-unread` | element |
| `LearningTooltip` | `.mstr-ai-chatbot-AnswerBubbleLearningBadges-popover` | element |
| `ConfirmDeleteDialog` | `.mstr-ai-chatbot-ConfirmationButton-dialog` | button |

**Actions**
| Signature |
|-----------|
| `clickDownloadButton()` |
| `clickExportCSVButton()` |
| `clickExportExcelButton()` |
| `clickCopyButton()` |
| `clickMoveButton()` |
| `clickSeeMoreButton()` |
| `clickSeeLessButton()` |
| `selectMoveToCategory(categoryName)` |
| `clickDeleteButton()` |
| `clickMaximizeButton()` |
| `showInterpretationContent()` |
| `closeInterpretationButton()` |
| `clickAskAgainButton()` |
| `confirmDelete()` |
| `cancelDelete()` |
| `hoverAndGetTooltip(e)` |
| `clickAndGetTooltip(e)` |
| `clickViewDetailsButton()` |
| `hoverSnapshotOperations()` |
| `clickSnapshotOperations()` |
| `clickRenameSnapshotTitleButton()` |
| `renameSnapshotTitle(newName)` |
| `getSnapshotTitle()` |
| `copySnapshotTitle()` |
| `clickLearningIndicator()` |
| `setInterpretationText(value)` |
| `hideSnapshotContent()` |

**Sub-components**
- aiBotSnapshotsPanel
- getSnapshotContainer

---

### SnapshotCategoryArea
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `RenameInput` | `.mstr-ai-chatbot-SnapshotCategoryArea-titleInput` | input |
| `CategoryMenu` | `.mstr-ai-chatbot-CategoryMenuButton-content` | button |

**Actions**
| Signature |
|-----------|
| `clickCollapseButton()` |
| `clickThreeDotsButton()` |
| `renameCategory(newName)` |

**Sub-components**
_none_

---

### SnapshotDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SnapshotDialog` | `.mstr-ai-chatbot-SnapshotFocusView` | element |
| `InterpretationComponent` | `.mstr-ai-chatbot-ChatInterpretationComponent` | element |
| `LearningTooltip` | `.mstr-ai-chatbot-AnswerBubbleLearningBadges-popover` | element |
| `ConfirmDeleteDialog` | `.mstr-ai-chatbot-ConfirmationButton-dialog` | button |

**Actions**
| Signature |
|-----------|
| `clickDownloadButton()` |
| `clickExportCSVButton()` |
| `clickExportExcelButton()` |
| `clickCopyButton()` |
| `clickCloseButton()` |
| `clickDeleteButton()` |
| `confirmDelete()` |
| `cancelDelete()` |
| `setSavedTime(value)` |
| `clickSeeMoreButton()` |
| `clickSeeLessButton()` |
| `clickInterpretationButton()` |
| `clickLongContentButton()` |
| `isInterpretationComponentDisplayed()` |
| `isThumbdownIconDisplayed()` |
| `isLearningIndicatorDisplayed()` |
| `isRefLearningDisplayed()` |
| `isSnapshotDialogDisplayed()` |
| `clickLearningIndicator()` |
| `setInterpretationText(value)` |

**Sub-components**
_none_

---

### WarningDialog
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ConfirmWarningDialog` | `.mstrmojo-Editor.mstrmojo-ConfirmSave-Editor.modal` | element |
| `SaveSuccessMessageBox` | `.ant-message-notice` | element |

**Actions**
| Signature |
|-----------|
| `confirmSave(expSuccess = true)` |
| `confirmDoNotSave()` |
| `confirmCancel()` |
| `checkCertifyCheckbox()` |
| `isCertifyCheckboxPresent()` |
| `isCertifyCheckboxChecked()` |
| `isDoNotSaveButtonPresent()` |

**Sub-components**
- getPage

---

### utils


**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| _none_ |

**Sub-components**
_none_
