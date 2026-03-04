# Site Knowledge: Bot (AI Bot) Domain

## Overview

- **Domain key:** `aibot`
- **Components covered:** ADC, AIBotChatPanel, AIBotDatasetPanel, AIBotDatasetPanelContextMenu, AIBotPromptPanel, AIBotSnapshotsPanel, AIBotToastNotification, AIBotUsagePanel, AIDiagProcess, Bot2Chat, BotAppearance, BotAuthoring, BotConsumptionFrame, BotCustomInstruction, BotRulesSettings, BotVisualizations, CacheManager, ChatAnswer, EmbedBotDialog, GeneralSettings, HisoryPanel, MappingObjectInAgentTemplate, SnapshotCard, SnapshotCategoryArea, SnapshotDialog, utils, WarningDialog
- **Spec files scanned:** 80
- **POM files scanned:** 27

## Components

### ADC
- **CSS root:** `.mstrmojo-vi-ui-editors-NewDatasetSelectorContainer`
- **User-visible elements:**
  - ADCToolbar (`.mstrmojo-RootView-menutoolbar.aibotAdvancedMode`)
  - Cancel Btn (`.item.btn.cancel .btn`)
  - Dataset Title Bar (`.mstrmojo-RootView-datasets .mstrmojo-VIPanel-content-wrapper .mstrmojo-VITitleBar`)
  - Duplicate Btn (`.item.duplicate`)
  - Duplicatebtn In Save Change Confirm Dialog (`.mstrd-AIBotAdvancedModeWarnDialog-dont-save-button`)
  - Empty Content (`.mstrd-EmptyContent`)
  - New Dataset Selector Diag (`.mstrmojo-vi-ui-editors-NewDatasetSelectorContainer`)
  - Save As Btn (`.item.saveAs`)
  - Save As Dropdown (`.item.saveMore`)
  - Save As Dropdown From Bot (`.item.saveMoreForADCFromBot`)
  - Save Btn (`.item.btn.save`)
  - Savebtn In Save Change Confirm Dialog (`.mstrd-AIBotAdvancedModeWarnDialog-save-button`)
  - Save In Progress Box (`.mstrmojo-Editor.mstrWaitBox.saving-in-progress`)
- **Component actions:**
  - `apply()`
  - `cancel()`
  - `clickDuplicateBtn()`
  - `clickSaveAsBtn()`
  - `clickSaveAsDropdown()`
  - `clickSaveAsDropdownFromBot()`
  - `clickSaveBtn()`
  - `duplicateAndApply(name, path, parentFolder = 'Shared Reports')`
  - `isADCToolbarPresent()`
  - `isDatasetTitleBarDisabled(name)`
  - `isDuplicateAndApplyBtnDisplayed()`
  - `isEmptyContentPresent()`
  - `save(name = '')`
  - `saveAsADC(adcName)`
  - `saveChanges({ saveConfirm = true, jumpToBotAuthoring = true } = {})`
  - `saveToPath(name, path, parentFolder = 'Shared Reports')`
  - `selectDatasetAddReplace(dataset)`
- **Related components:** aiBotChatPanel, aiBotDatasetPanel, dossierAuthoringPage, libraryAuthoringPage, libraryPage

### AIBotChatPanel
- **CSS root:** `.mstr-ai-chatbot-TitleBar-external-links-container`
- **User-visible elements:**
  - Ag Column Menu (`.ag-column-menu`)
  - Ag Column Pickdialog (`.ag-dialog.ag-popup-child`)
  - Ai Diagnostics Dialog Close Icon (`.mstr-ai-chatbot-DiagnosticsCloseIcon`)
  - Ai Diagnostics Dialog Copy Icon (`.mstr-ai-chatbot-DiagnosticsCopyIcon`)
  - Ai Diagnostics Dialog Export Icon (`.mstr-ai-chatbot-DiagnosticsTab-btns-export`)
  - Answer List (`.MessageList`)
  - Ask About (`.mstr-ai-chatbot-TopicExploreMore`)
  - Ask About Btn (`.mstr-ai-chatbot-TitleBar-topics`)
  - Ask About Panel (`.mstr-ai-chatbot-TopicsPanel`)
  - Ask About Panel Object List (`.mstr-ai-chatbot-TopicsPanelContent-objectsList`)
  - Ask About Panel Search Box (`.mstr-ai-chatbot-SearchBox`)
  - Auto Complete Area (`.mstr-chatbot-suggestion-popup`)
  - Auto Complete Content (`.mstr-chatbot-suggestion-popup-content`)
  - Auto Complete Header (`.mstr-chatbot-suggestion-popup-header`)
  - Bot2 Cancel Loading Answer Button (`.mstr-chatbot-chat-input-inline__cancel-btn`)
  - Bot2 Welcome Page (`.mstr-ai-chatbot-WelcomePage.v2`)
  - Bot Edit Layout (`.mstr-ai-chatbot-EditingLayout-rightPanel`)
  - Bot Title (`.mstrd-DossierTitle-segment`)
  - Bubble Loading Icon (`.chat-bubble-loading`)
  - Cancel Loading Answer Button (`.mstr-design-bot-button`)
  - Chat Bot Loading Icon (`.mstr-ai-chatbot-Spinner.mstr-ai-chatbot-Spinner--grey`)
  - Chat Bot Max Question Quota (`.mstr-chatbot-chat-input__footer-left`)
  - Chat Bot Pin Icon (`.mstr-ai-chatbot-SnapshotButton-pin`)
  - Chat Bot Send Icon (`.mstr-chatbot-chat-input-inline__send-btn`)
  - Chat Bot Title Bar External Link Container (`.mstr-ai-chatbot-TitleBar-external-links-container`)
  - Chat Panel (`.mstr-ai-chatbot-ChatPanel`)
  - Chat Panel Container (`.mstr-ai-chatbot-MainView-chatPanelContainer`)
  - Chat Panel Topic (`.mstr-ai-chatbot-ChatPanelTopics`)
  - Chat Panel Topics (`.mstr-ai-chatbot-ChatPanelTopics`)
  - Chat Panel Topics Title (`.mstr-ai-chatbot-ChatPanelTopics-title`)
  - Clear History Button (`.mstr-ai-chatbot-TitleBar-clear-history .mstr-ai-chatbot-IconButton`)
  - Clear History Confirmation Dialog (`.mstr-ai-chatbot-ConfirmationButton-dialog`)
  - Clear History No Button (`.mstr-ai-chatbot-ConfirmationButton-cancel`)
  - Close Button (`.icon-pnl_close`)
  - Close Quoted Message Icon (`.mstr-ai-chatbot-QuotedMessage-closeButton`)
  - Close Snapshot Added Button (`.mstr-ai-chatbot-Toast-closeBtn`)
  - Close Snapshot Button (`.mstr-ai-chatbot-SnapshotsPanel-close`)
  - Config Tabs List (`.mstr-ai-chatbot-ConfigTabs-list`)
  - Content Loading Icon (`.mstr-ai-chatbot-LoadingIcon-content--visible`)
  - Dialog Close Button (`.mstr-ai-chatbot-Dialog-closeButton`)
  - Did You Mean Close Button (`.mstr-ai-chatbot-DidYouMean-close-button`)
  - Did You Mean Panel (`.mstr-ai-chatbot-DidYouMean`)
  - Disabled Input Box Container (`.mstr-chatbot-chat-input-inline__input-container--disabled`)
  - Disabled Recommendation Fold State Btn (`.mstr-ai-chatbot-Recommendations-expandButton--disabled`)
  - Disabled Send Icon (`.mstr-chatbot-chat-input-inline__send-btn--disabled`)
  - Disabled Topics Icon (`.mstr-chatbot-chat-input-inline__empty-btn--disabled`)
  - Disclaimer (`.mstr-chatbot-chat-panel__footnote`)
  - Edit Appearance Button (`.mstr-icons-lib-icon mstr-ai-chatbot-ConfigTabs-appearance`)
  - Export To Csv Button (`.mstr-ai-chatbot-ExportToCsvButton`)
  - Export To Excel Button (`.mstr-ai-chatbot-ExportToExcelButton`)
  - Feedback Results (`.mstr-ai-chatbot-ChatPanelFeedbackResults-header`)
  - Follow Up Error (`.mstr-chatbot-chat-panel__empty-followup`)
  - Forget User Learning Loading (`.mstr-ai-chatbot-Spinner-blade`)
  - Forgotten Tooltip (`.mstr-ai-chatbot-CINuggetsContent-nugget-right-content-tooltip`)
  - Highlight Message (`.highlight-message`)
  - History Panel Button (`.mstr-ai-chatbot-TitleBar-histories`)
  - Input Box (`.mstr-chatbot-chat-input-inline__textarea`)
  - Input Box Container (`.mstr-chatbot-chat-input-inline__input-container`)
  - Input Box In Teams (`.mstr-chatbot-chat-input-inline__textarea`)
  - Input Box Text (`.mstr-chatbot-chat-input-inline__textarea`)
  - Input Topics (`.mstr-chatbot-chat-input-inline__input-right`)
  - Interpretation Component (`.mstr-ai-chatbot-ChatInterpretationComponent`)
  - Interpretation Copy LLMInstructions Icon (`.mstr-ai-chatbot-CIComponents-header-right-copy-container`)
  - Interpretation Copy To Query Disable Icon (`.mstr-ai-chatbot-CIInterpretedAs-copy-query--disabled`)
  - Interpretation Copy To Query Icon (`.mstr-ai-chatbot-CIInterpretedAs-copy-query`)
  - Interpretation Learning (`.mstr-ai-chatbot-CINuggetsContent`)
  - Interpretation Loading Spinner (`.mstr-ai-chatbot-CILoading-spinner`)
  - Interpretation Reload Button (`.mstr-ai-chatbot-CIError-reload`)
  - Interpretation See More Btn (`.mstr-ai-chatbot-TruncatedText-showMoreLessButton`)
  - Interpretation Text (`.mstr-ai-chatbot-CIComponents-header-right`)
  - Interpreted As (`.mstr-ai-chatbot-CIInterpretedAs-text`)
  - Interpreted As Text (`.mstr-ai-chatbot-CIInterpretedAs-text`)
  - Learning Checking Text (`.headerTitle`)
  - Learning Forget Btn (`.mstr-ai-chatbot-CINuggetsContent-nugget-right-content-forget--visible`)
  - Learning Icon (`.learningIcon`)
  - Learning Indicator Dialog (`.mstr-ai-chatbot-AnswerBubbleLearningBadges-popover`)
  - Learning Indicator Help Link (`.mstr-ai-chatbot-AnswerBubbleLearningBadges-help-link`)
  - Learning Manager No Data Window (`.mstr-ai-chatbot-CLMNoData`)
  - Learning Manager Window (`.mstr-ai-chatbot-CentralLearningManagerContent-main-dialog`)
  - Library Icon (`.mstr-nav-icon.icon-library`)
  - Links Popover Button (`.mstr-ai-chatbot-TitleBar-external-links-popover-trigger-container`)
  - Links Popover Contents (`.mstr-ai-chatbot-TitleBar-external-links-popover-content`)
  - Loading History Span (`.loading-icon`)
  - Loading History Text (`.loading-text`)
  - Loading Icon In Clear History (`.mstr-ai-chatbot-ConfirmationDialog-spinner`)
  - Main View (`.mstr-ai-chatbot-MainView`)
  - Message List (`.MessageContainer`)
  - Message Scroll Component (`.infinite-scroll-component__outerdiv`)
  - Mobile Close Ask About Button (`.mstr-nav-icon.icon-backarrow_rsd.mstr-nav-icon-color`)
  - Mobile Close Snapshot Button (`.mstr-nav-icon.icon-backarrow_rsd.mstr-nav-icon-color`)
  - Mobile Hamburger Button (`.mstrd-MobileHamburgerContainer`)
  - Mobile Slider Menu (`.mstrd-MobileSliderMenu-slider`)
  - Mobile View Clear History No Button (`.mstrd-Button.mstrd-Button--clear.mstrd-Button--primary.mstrd-ConfirmationDialog-button`)
  - Mobile View Clear History Yes Button (`.mstrd-Button.mstrd-Button--round.mstrd-Button--primary.mstrd-ConfirmationDialog-button`)
  - New Chat Button (`.mstr-ai-chatbot-TitleBar-new-chat`)
  - Notification Save Button (`.mstrmojo-WebButton`)
  - Nugget Content (`.mstr-ai-chatbot-CINuggetsPopoverContent-content`)
  - Nuggets Popover Content Dataset Title (`.mstr-ai-chatbot-CINuggetsPopoverContent-nugget-right-title`)
  - Nuggets Popover Content Definition (`.mstr-ai-chatbot-CINuggetsPopoverContent-nugget-right .mstr-ai-chatbot-TruncatedText-content`)
  - Nugget Trigger Icon (`.mstr-ai-chatbot-CIInterpretedAs-nugget-trigger`)
  - Open Snapshot Panel Button (`.mstr-ai-chatbot-TitleBar-snapshots`)
  - Quoted Message Close Button (`.mstr-ai-chatbot-QuotedMessage-closeButton`)
  - Quoted Message In Inpux Box (`.mstr-ai-chatbot-QuotedMessage--isRenderedInInputBox`)
  - Quoted Question In Inpux Box (`.mstr-chatbot-chat-input-inline__quoted-messages`)
  - Recommendation Expand State Btn (`.mstr-ai-chatbot-Recommendations-expandButton--expanded`)
  - Recommendation Fold State Btn (`.mstr-ai-chatbot-Recommendations-expandButton`)
  - Recommendation List (`.mstr-ai-chatbot-RecommendationItem-text`)
  - Recommendation Refresh Icon (`.mstr-ai-chatbot-Recommendations-refreshButton`)
  - Recommendations (`.mstr-ai-chatbot-Recommendations`)
  - Recommendation Title (`.mstr-ai-chatbot-Recommendations-title`)
  - Recommendation Title Object Name (`.mstr-ai-chatbot-Recommendations-title-content-objectName`)
  - Related Suggestion Area (`.mstr-chatbot-chat-input-inline__quick-replies`)
  - Resize Handler Of Configuration Panel (`[class*=mstr-ai-chatbot-EditingLayout-separator]`)
  - Resize Handler Of Snapshot Panel (`.mstr-ai-chatbot-ResizeHandler`)
  - See More Less Btn (`.mstr-ai-chatbot-TruncatedText-showMoreLessButton`)
  - Send Icon (`.mstr-chatbot-chat-input-inline__send-btn`)
  - Send Icon In Teams (`.mstr-chatbot-chat-input-inline__input-right`)
  - Smart Suggestion Copy Icon (`.mstr-ai-chatbot-SuggestionItem-copyIcon`)
  - Smart Suggestion Loading Bar (`.mstr-ai-chatbot-LoadingSkeleton-text`)
  - Snapshot Added Success Toast (`.mstr-ai-chatbot-Toast-viewport`)
  - Snapshot Delete Confirmation Button (`.mstr-ai-chatbot-ConfirmationButton-confirm`)
  - Snapshot Items (`.mstr-ai-chatbot-SnapshotsPanelContent-items`)
  - Snapshot Panel (`.mstr-ai-chatbot-SnapshotsPanelContent-items`)
  - Snapshot Panel Container (`.mstr-ai-chatbot-SnapshotsPanel`)
  - Snapshots Loading Icon (`.mstr-ai-chatbot-Spinner.mstr-ai-chatbot-Spinner--grey`)
  - Start Conversation Btn (`.mstr-ai-chatbot-TopicsObject-startConversationButton`)
  - Start Conversation Recommendation (`.mstr-chatbot-chat-panel__input-container .mstr-ai-chatbot-RecommendationItem`)
  - Switch (`.mstr-ai-chatbot-Switch-root`)
  - Text Link To Bot (`.vi-doc-tf-value-text`)
  - Thumb Down Loading Spinner (`.mstr-ai-chatbot-Spinner--grey`)
  - Time (`.Time`)
  - Time In Snapshot (`.mstr-ai-chatbot-SnapshotCard-date`)
  - Time Text (`.Time`)
  - Title Bar (`.mstr-ai-chatbot-TitleBar`)
  - Title Bar Bot Logo (`.mstr-ai-chatbot-TitleBar-bot-logo-container`)
  - Title Bar Bot Name (`#titlebar_bot_name`)
  - Title Bar Divider (`.mstr-ai-chatbot-TitleBar-divider`)
  - Title Bar External Link (`.mstr-ai-chatbot-TitleBar-external-link.mstr-ai-chatbot-TitleBar-external-link--style-icon`)
  - Title Bar External Link Container (`.mstr-ai-chatbot-TitleBar-external-links-container`)
  - Title Bar Left (`.mstr-ai-chatbot-TitleBar-left-bar`)
  - To Bottom Btn (`.message-back-bottom`)
  - Tool Bar Copy As Image Icon (`.mstr-ai-chatbot-CopyButton`)
  - Tool Bar Down Load Icon (`.mstr-ai-chatbot-DownloadButton`)
  - Tool Bar More Menu (`.more-menu-menu-container`)
  - Tooltip (`.mstr-ai-chatbot-Tooltip`)
  - Topics Icon (`.mstr-chatbot-chat-input-inline__empty-btn`)
  - Topic Tooltip (`.mstr-design-tooltip-inner`)
  - Unpin Icon (`.mstr-ai-chatbot-SnapshotButton-unpin`)
  - Unstructured Data Tooltip (`.mstr-ai-chatbot-UnstructuredDataIndicators-tooltip-content`)
  - Unstructured Data Tooltip Download Button (`.mstr-ai-chatbot-UnstructuredDataIndicators-download-button`)
  - Unstructured Data Tooltip Download Spinner (`.mstr-ai-chatbot-UnstructuredDataIndicators-spinner`)
  - Viz Answer Bubble List (`.mstr-ai-chatbot-VisualizationBubble`)
  - Viz Bubble (`.mstr-ai-chatbot-VisualizationBubbleV2-viz2`)
  - Viz Loading Curtain (`.mstr-ai-chatbot-VisualizationBubbleV2-loading`)
  - Viz Loading Spinner (`.single-loading-spinner`)
  - Welcome Page (`.mstr-ai-chatbot-WelcomePage`)
  - Welcome Page Bot Icon (`.mstr-ai-chatbot-WelcomePage-botIcon`)
  - Welcome Page Bot Image (`.mstr-ai-chatbot-WelcomePage-botImg`)
  - Welcome Page Greeting Title (`.mstr-ai-chatbot-WelcomePage-greetingTitle`)
  - Welcome Page Message (`.mstr-ai-chatbot-WelcomePage-message`)
  - Welcome Page Separator (`.mstr-ai-chatbot-WelcomePage-separator`)
  - Welcome Page Title (`.mstr-ai-chatbot-WelcomePage-title`)
- **Component actions:**
  - `areTopicSuggestionsDisabled()`
  - `askAboutbyIndex(Index = 0)`
  - `askQuestion(question, waitViz = false, options = { timeout: this.DEFAULT_LOADING_TIMEOUT })`
  - `askQuestionAndSend(question)`
  - `askQuestionByAutoComplete(text, autoCompletionIndex = 0)`
  - `askQuestionByPaste(question)`
  - `askQuestionByPasteWithoutSending(question)`
  - `askQuestionInTeams(question)`
  - `askQuestionNoWaitViz(question)`
  - `checkIfAnyCopyScreenshotButtonExisting()`
  - `checkIfCopyScreenshotButtonExisting(Nth)`
  - `checkIfDownloadButtonExisting(Nth)`
  - `checkIfSnapshotButtonExisting(Nth)`
  - `clearAskAboutSearch()`
  - `clearFeedbackContents(index = 0)`
  - `clearHistory()`
  - `clearHistoryAndAskQuestion(question)`
  - `clearInputbox()`
  - `clearMobileViewHistory()`
  - `clickAiDiagnosticsButtonByAnswerIndex(index)`
  - `clickAiDiagnosticsDialogCloseIcon()`
  - `clickAiDiagnosticsDialogCopyIcon()`
  - `clickAiDiagnosticsDialogExportIcon()`
  - `clickAnswerWithoutCacheButtonByIndex(index = 0)`
  - `clickBot2CancelLoadingAnswerButton()`
  - `clickBotName()`
  - `clickButton(name)`
  - `clickCancelLoadingAnswerButton()`
  - `clickChatPanelTopicByIndex(Index)`
  - `clickCheckBox(Index = 0)`
  - `clickClearHistoryButton()`
  - `clickClearHistoryNoButton()`
  - `clickClearHistoryYesButton()`
  - `clickCloseButton()`
  - `clickCloseQuotedMessageIcon()`
  - `clickCloseSnapshotAddedButton()`
  - `clickCloseSnapshotButton()`
  - `clickCloseSnapshotButtonInResponsive()`
  - `clickContentDiscoveryBotByIndex(Index)`
  - `clickDeleteSnapShotButton(Index)`
  - `clickDidYouMeanCloseButton()`
  - `clickDownloadButton()`
  - `clickDownloadPDFReport(index = 0)`
  - `clickEditAppearanceButton()`
  - `clickExpandRecommendation()`
  - `clickExportToCsvButton()`
  - `clickExportToExcelButton()`
  - `clickExternalLinkByText(text)`
  - `clickFeedbackCloseButtonbyIndex(index = 0)`
  - `clickFeedbackSubmitButton(index = 0)`
  - `clickFeedbackTabByName(name, index = 0)`
  - `clickFoldRecommendation()`
  - `clickFollowUpError()`
  - `clickFollowUpIconbyIndex(Index)`
  - `clickHistoryChatButton()`
  - `clickInterpretation()`
  - `clickInterpretationAdvancedOption()`
  - `clickInterpretationbyIndex(index)`
  - `clickInterpretationCopyLLMInstructionsIcon()`
  - `clickInterpretationCopyToQueryIcon()`
  - `clickInterpretationReloadButton()`
  - `clickInterpretationSeeMoreBtn()`
  - `clickInterpretationSwitchBtn(index)`
  - `clickLearningForgetButtonbyIndex(Index)`
  - `clickLearningIndicator()`
  - `clickLearningManager(Index = 0)`
  - `clickLink(text)`
  - `clickLinksPopoverButton()`
  - `clickLinksPopoverItemsbyIndex(Index)`
  - `clickMarkDownByIndex(Index)`
  - `clickMobileHamburgerButton()`
  - `clickMobileViewClearHistoryButton()`
  - `clickMobileViewClearHistoryNoButton()`
  - `clickMobileViewClearHistoryYesButton()`
  - `clickMobileViewLinksButton()`
  - `clickMobileViewLinksItemsbyIndex(Index)`
  - `clickNewChatButton()`
  - `clickNotificationSaveButton()`
  - `clickNuggetTriggerIcon()`
  - `clickOpenSnapshotPanelButton()`
  - `clickOpenSnapshotPanelButtonInResponsive()`
  - `clickQuotedMessageButtonByIndex(Index)`
  - `clickQuotedMessageCloseButton()`
  - `clickRecommendationByContents(recommendation)`
  - `clickRecommendationByIndex(Index)`
  - `clickRefreshRecommendationIcon()`
  - `clickSaveButton()`
  - `clickSeeMoreLessBtn()`
  - `clickSeeMoreSeeLessButton()`
  - `clickSendBtn()`
  - `clickSendIcon()`
  - `clickShowErrorDetails(index = 0)`
  - `clickSmartSuggestion(index)`
  - `clickSmartSuggestionCopyIcon()`
  - `clickSmartSuggestionShowLessBtn(Index = 0)`
  - `clickSmartSuggestionShowMoreBtn(Index = 0)`
  - `clickSnapShotDeleteComfirmationButton()`
  - `clickSnapshotUnpinButton()`
  - `clickStartConversationInAskAboutPanel(objectName)`
  - `clickStartConversationInAskAboutPanel2(objectName)`
  - `clickSwitch()`
  - `clickTextLinkToBot()`
  - `clickThumbDownButtonbyIndex(Index)`
  - `clickThumbDownClickedButtonbyIndex(Index)`
  - `clickToBottom()`
  - `clickToolBarCopyAsImageIcon()`
  - `clickToolBarDownloadIcon()`
  - `clickToolBarMoreButtonByIndex(Index)`
  - `clickTopicByIndex(Index)`
  - `clickTopicByTitle(title)`
  - `clickTopicByTitleAnWaitFordCancel(title)`
  - `clickTopicInAIBotByIndex(topicIndex = 0)`
  - `clickTopicsBtn()`
  - `ClickUnpinNthChatAnswerFromEnd(Nth)`
  - `clickUnstructuredDataDownloadButton()`
  - `closeAgColumnPickerDialog()`
  - `closeDialogue()`
  - `closeDidYouMean()`
  - `closeMobileHamburger()`
  - `closeMobileViewAskAboutPanel()`
  - `closeMobileViewSnapshotPanel()`
  - `closeSnapshot()`
  - `constructJSON(inputKey, inputValue, outputKey, outputValue)`
  - `copyQuestionToQuery(index)`
  - `copyRecommendationToQuery(index)`
  - `createNewChat()`
  - `deleteByTimes(times = 1)`
  - `disableResearch()`
  - `disableWebSearch()`
  - `dismissFocus()`
  - `enableResearch()`
  - `enableWebSearch()`
  - `expandAskAboutObjectByName(name)`
  - `extractAGGridDataToMarkdown(answerIndex, gridIndex)`
  - `followUpByIndex(index)`
  - `getAskAboutSuggestedQuestions()`
  - `getCountOfInterpretation()`
  - `getErrorDetailedMessage(index = 0)`
  - `getFeedbackResultsText(index = 0)`
  - `getFollowUpErrorText()`
  - `getForgetUserLearningLoadingColor()`
  - `getIndexByAnswerText(text)`
  - `getInterpretationText()`
  - `getLastQueryText()`
  - `getLatestFollowUpError()`
  - `getNthChatBotAnswerFromEnd(Nth)`
  - `getNthParagraphOfTextAnswerFromEnd(Nth)`
  - `getNthParagraphOfTextAnswerFromEndV2(Nth)`
  - `getPinButtonOfNthChatAnswer(Nth)`
  - `getRecommendationByContents(recommendation)`
  - `getRecommendationTextByIndex(Index)`
  - `getTitleBarExternalLinkCount()`
  - `getTopicItemListLength()`
  - `getTopicItemsInChatPanel()`
  - `getUnpinButtonOfNthChatAnswer(Nth)`
  - `goToLibrary()`
  - `hideTimeStampInChatAndSnapshot()`
  - `hoverChatAnswertoAddSnapshotbyIndex(Index)`
  - `hoverChatAnswertoClickFollowUpbyIndex(markDownIndex = 0, followUpIndex = 0)`
  - `hoverChatAnswertoClickThumbDownbyIndex(Index)`
  - `hoverChatAnswerToRemoveSnapshotByIndex(index)`
  - `hoverChatBubbleToClickThumbDownByIndex({ index = 0 })`
  - `hoverContentDiscoveryBotByIndex(Index)`
  - `hoverLearningContent(answerIndex = 0, learningIndex = 0, offset = { x: 0, y: 0 })`
  - `hoverLearningManager(Index = 0)`
  - `hoverNthChatAnswerFromEndtoAddSnapshot(Nth)`
  - `hoverNthChatAnswerFromEndtoClickThumbdown(Nth)`
  - `hoverOnBotLogo()`
  - `hoverOnBotName()`
  - `hoverOnChatAnswer(index)`
  - `hoverOnClearHistoryBtn()`
  - `hoverOnCopyToQueryIcon()`
  - `hoverOnDidYouMeanCloseButton()`
  - `hoverOnFollowUpIconByIndex(index)`
  - `hoverOnHistoryAnswer(index)`
  - `hoverOnHistoryQuestion(index)`
  - `hoverOnInputBox()`
  - `hoverOnInterpretationBtn(index)`
  - `hoverOnInterpretationCopyLLMInstructionsBtn()`
  - `hoverOnInterpretationCopyToQueryBtn()`
  - `hoverOnLatestAnswer()`
  - `hoverOnLinkByIndex(index)`
  - `hoverOnLinksPopoverBtn()`
  - `hoverOnLinksPopoverItemByIndex(Index)`
  - `hoverOnRecommendationByIndex(Index)`
  - `hoverOnRecommendationExpandStateBtn()`
  - `hoverOnRecommendationRefreshBtn()`
  - `hoverOnRectFromBarChart()`
  - `hoverOnSeeMoreLessBtn()`
  - `hoverOnSendBtn()`
  - `hoverOnSmartSuggestion(index)`
  - `hoverOnSmartSuggestionCopyIcon()`
  - `hoverOnToolBarMoreButtonByIndex(index)`
  - `hoverOnTopicsBtn()`
  - `hoverOnUnstructuredDataIndicator(answerIndex = 0, indicatorIndex = 0)`
  - `hoverOnWelcomePageBotIcon()`
  - `hoverOnWelcomePageMessage()`
  - `hoverOnWelcomePageTitle()`
  - `hoverTextOnlyChatAnswer(Index)`
  - `hoverTextOnlyChatAnswertoAddSnapshotbyIndex(Index)`
  - `hoverTextOnlyChatAnswertoOpenInterpretationbyIndex(Index)`
  - `hoverTextOnlyChatAnswertoOpenThumbDownbyIndex(Index)`
  - `hoverThumbDownButtonbyIndex(Index)`
  - `hoverThumbDownClickedButtonbyIndex(Index)`
  - `hovertoClickThumbDownbyIndex(MarkDownIndex = 0, ThumbDownIndex = 0)`
  - `hoverVizPanel(Index)`
  - `inputFeedbackContents(feedback, index = 0)`
  - `inputQuestionNotSend(question)`
  - `isAliasDispalyedForAskAboutObject(name, alias)`
  - `isAskAboutBtnDisplayed()`
  - `isAskAboutDisplayed()`
  - `isAskAboutPanelDisplayed()`
  - `isAskAboutPanelObjectByNameDisplayed(name)`
  - `isAskAboutPanelObjectListDisplayed()`
  - `isAskAboutPanelSearchBoxDisplayed()`
  - `isAutoCompleteAreaDisplayed()`
  - `isBot2WelcomePageDisplayed()`
  - `isBotConfigByNameSelected(name)`
  - `isButtonDisabled(elem)`
  - `isChatAnswerByIndexDisplayed(Index)`
  - `isChatBotVizDisplayed(vizType, index = 0)`
  - `isChatPanelTopicDisplayed()`
  - `isChatPanelTopicsTitleDisplayed()`
  - `isClearHistoryButtonDisplayed()`
  - `isClearHistpryConfirmationDialogDisplayed()`
  - `isColorDisplayedInViz(color, VizIndex = 0)`
  - `isColorDisplayedInVizOfSnapshot(color, VizIndex = 0)`
  - `isContentDiscoveryBotByIndexDisplayed(Index)`
  - `isCustomSuggestionDisplayed(suggestion)`
  - `isCustomVizDisplayedByType(vizType, index = 0)`
  - `isDeleteSnapShotButtonDisplayed(Index)`
  - `isDidYouMeanCloseButtonDisplayed()`
  - `isDidYouMeanPanelDisplayed()`
  - `isDisabledInputContainerDisplayed()`
  - `isDisabledReccomendationFoldStateBtnDisplayed()`
  - `isDisabledSendIconDisplayed()`
  - `isDisabledTopicsIconDisplayed()`
  - `isDisclaimerDisplayed()`
  - `isErrorAnswerDisplayedByIndex(index = 0)`
  - `isExportToCsvIconDisplayedByLatestAnswer()`
  - `isExportToExcelIconDisplayedByLatestAnswer()`
  - `isFollowUpBtnDisplayedByLatestAnswer()`
  - `isInsightsSectionDisplayed()`
  - `isInterpretationComponentDisplayed()`
  - `isInterpretationCopyLLMInstructionsIconDisplayed()`
  - `isInterpretationCopyToQueryDisableIconDisplayed()`
  - `isInterpretationIconDisplayedInAnswer(index = 0)`
  - `isInterpretedAsDisplayed()`
  - `isLearningForgetBtnExisting()`
  - `isMarkDownByIndexDisplayed(Index)`
  - `isQADisplayed()`
  - `isQueryByIndexDisplayed(Index)`
  - `isQuotedQuestionDisplayedInInputBox()`
  - `isRecommendationAboutDisplayed()`
  - `isRecommendationByIndexDisplayed(Index)`
  - `isRecommendationDisplayed()`
  - `isRecommendationExpandStateBtnDisplayed()`
  - `isRecommendationPanelPresent()`
  - `isRecommendationRefreshIconDisplayed()`
  - `isResearchDisplayed()`
  - `isResearchEnabled()`
  - `isSendIconDisplayed()`
  - `isSmartSuggestionLoadingBarDisplayed()`
  - `isSnapshotButtonDisplayed()`
  - `isSnapshotButtonUnpinDisplayed()`
  - `isTextAnswerByIndexDisplayed(Index)`
  - `isTimeDisplayed()`
  - `isTitleBarBotLogoDisplayed()`
  - `isTitleBarBotNameDisplayed()`
  - `isTitleBarDisplayed()`
  - `isToBottomBtnDisplayed()`
  - `isTooltipDisplayed()`
  - `isTopicsIconDisplayed()`
  - `isVizAnswerByIndexDisplayed(Index)`
  - `isVizAnswerDisplaed()`
  - `isWebSearchDisplayed()`
  - `isWebSearchEnabled()`
  - `isWelcomePageBotImageDisplayed()`
  - `isWelcomePageGreetingTitleDisplayed()`
  - `isWelcomePageMessageDisplayed()`
  - `isWelcomePageMessageRecommendationDisplayed()`
  - `isWelcomePageSeparatorDisplayed()`
  - `isWelcomePageTitleDisplayed()`
  - `manipulationOnAgGrid(gridIndex, columnName, action, subAction = null)`
  - `numberOfSnapshotsInChatbot()`
  - `openAskAboutPanel()`
  - `openBotAndAskQuestion(bot, question)`
  - `openBotAndOpenSnapshot({ botId: botId })`
  - `openBotClearHistoryAndAskQuestion({
        projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', appId, botId, question, })`
  - `openExternalLinkOnChatTitleBarByIndex(Index)`
  - `openInterpretation(index = 0)`
  - `openInterpretationForgetUserLearning(answerIndex = 0, learningIndex = 0, waitLoading = true)`
  - `openLearningManager(Index = 0)`
  - `openManageLearning()`
  - `openMobileHamburger()`
  - `openMobileViewAskAboutPanel()`
  - `openMobileViewSnapshotPanel()`
  - `openRecommendationPanel()`
  - `openSnapshot()`
  - `resizeConfigurationPanel(offset = 200)`
  - `resizeSnapshotPanel(offset = -100)`
  - `scrollChatPanelContainerToBottom()`
  - `scrollChatPanelTo(position)`
  - `scrollChatPanelToBottom()`
  - `scrollChatPanelToTop()`
  - `scrollSnapshotPanelTo(position)`
  - `scrollSnapshotPanelToBottom()`
  - `scrollSnapshotPanelToTop()`
  - `searchInAskAbout(searchText)`
  - `selectUnselectColumnOnAgGrid(columnName, checked = true)`
  - `sendPrompt(text)`
  - `sendPromptWaitAnswerLoaded(text)`
  - `takeSnapshot(index = 0)`
  - `thumbDownByIndex(index)`
  - `thumbUpByIndex(index)`
  - `typeInChatBox(text)`
  - `verifyAskAboutObjectElementList(index, expectedText)`
  - `verifyAskAboutObjectStateByIndex(index, expectedState)`
  - `verifyElementFont(element, expectedFont, elementName)`
  - `verifyTopicSummary(topicSummaryAccount = 3)`
  - `verifyUncertainTopicSummary(topicSummaryAccount = 3)`
  - `waitClearHistoryEnabled()`
  - `waitForAnswerLoading()`
  - `waitForAnswerSettled(timeout = this.DEFAULT_LOADING_TIMEOUT, interval = 1000)`
  - `waitForCheckLearningLoading()`
  - `waitForExportComplete()`
  - `waitForForgetUserLearningLoading()`
  - `waitForInsightsSettled(timeout = this.DEFAULT_LOADING_TIMEOUT, interval = 1000)`
  - `waitForInterpretationLoading()`
  - `waitForRecommendationLoading()`
  - `waitForRecommendationSkeletonDisappear()`
  - `waitForTopicAnswerLoading()`
  - `waitForUnstructuredDataTooltipSpinnerDisappear()`
- **Related components:** clickOpenSnapshotPanel, dossierPage, getAnswerBubbleButtonIconContainer, getAskAboutPanel, getBot2WelcomePage, getChatBotTitleBarExternalLinkContainer, getChatPanel, getChatPanelContainer, getDidYouMeanPanel, getDisabledInputBoxContainer, getDotInSnapshotPanel, getFeedbackResultPanel, getHistoryPanel, getInsightsContainer, getMobileViewLinksContainer, GetObjectButtonInAskAboutPanel, getOpenSnapshotPanel, getRecommendationPanel, getResizeHandlerOfConfigurationPanel, getResizeHandlerOfSnapshotPanel, getSnapshotPanel, GetStartConversionButtonInAskAboutPanel, getTitleBarExternalLinkContainer, getTopicItemsInChatPanel, getVIVizPanel, getWelcomePage, isSnapshotPanel, libraryPage, scrollChatPanel

### AIBotDatasetPanel
- **CSS root:** `.mstr-ai-chatbot-SearchBox`
- **User-visible elements:**
  - Add New Bot Button (`.mstr-ai-chatbot-Datasets-addBotText`)
  - Advanced Container (`.mstr-ai-chatbot-Button.mstr-ai-chatbot-Button--theme-secondary`)
  - Advanced Mode Button (`.mstr-ai-chatbot-Datasets-titlebar .mstr-ai-chatbot-Button`)
  - Bot Alias Warning (`.mstr-ai-chatbot-Datasets-data-source-bot-alias-warning`)
  - Clear Search Icon (`.mstr-ai-chatbot-SearchBox-clear`)
  - Close Btn In Warning Dialog (`button*=Close`)
  - Collapse Arrow (`.mstr-ai-chatbot-Collapsible-arrow`)
  - Cover Spinner (`.mstr-ai-chatbot-Spinner`)
  - Data Context Menu (`.mstr-ai-chatbot-ContextMenu-content`)
  - Data Panel Container (`.mstr-ai-chatbot-Datasets`)
  - Dataset Container (`.mstr-ai-chatbot-Collapsible-content`)
  - Dataset Dropdown Icon (`.mstr-ai-chatbot-Select-selectIcon`)
  - Dataset List (`.mstr-ai-chatbot-Datasets-list`)
  - Dataset Name Container (`.mstr-ai-chatbot-Datasets-dataset-title`)
  - Dataset Name Input (`.mstr-ai-chatbot-Datasets-dataset-title-input`)
  - Dataset Object Context Menu (`.mstr-ai-chatbot-DatasetObjectMenu-menu`)
  - Dataset Panel (`.mstr-ai-chatbot-Datasets`)
  - Dataset Panel Title (`.mstr-ai-chatbot-Datasets-title`)
  - Dataset Selector (`.mstr-ai-chatbot-Select-selectTrigger`)
  - Dataset Warning Dialog (`.mstr-ai-chatbot-DatasetWarningDialog-container`)
  - Dataset Warning Dialog Header (`.mstr-ai-chatbot-DatasetWarningDialog-header`)
  - Duplicate Name Alert Container (`.mstr-ai-chatbot-DuplicateNameDialog-text`)
  - Edit Page (`.mstrmojo-di-view.mojo-theme-light.mstrmojo-di-view-popup`)
  - Edit Title (`#DIContainer`)
  - Error Icon (`.mstr-ai-chatbot-Datasets-dataset-warning`)
  - Menu Button (`.single-icon-misc-menu`)
  - Menu Container (`.mstr-ai-chatbot-Datasets-menu-content`)
  - Mode Switcher (`.mode-switcher`)
  - New DIPage (`.mstrmojo-di-popup`)
  - New DIPage Search (`.whc-search-box.mini-toolbar-searchbox`)
  - No Match Content (`.mstr-ai-chatbot-Datasets-noContent`)
  - OKButton In Attribute Forms (`.mstr-ai-chatbot-AttributeFormsSelector-actions .mstr-ai-chatbot-Button--theme-primary`)
  - Panel Error Icon (`.mstr-ai-chatbot-ConfigTabs-dataset-warning`)
  - Refresh Container (`.mstrmojo-di-tablestatuslist `)
  - Refresh Done Icon (`.mstrmojo-Label.republish-status-icon.finished`)
  - Refresh Page (`.mstrmojo-Editor-title-container`)
  - Rename Error (`.mstr-ai-chatbot-Toast-title`)
  - Replace Dialog Header (`.mstr-ai-chatbot-Dialog-header`)
  - Replace Loading Icon (`.react-bot-creator-preloader-wrapper`)
  - Replace Second Loading Icon (`.mstr-react-dossier-creator-preloader.preloader-wrapper`)
  - Sample File Content Container (`.mstrmojo-DataGrid.mstrmojo-di-samplefiles .mstrmojo-itemwrap-table`)
  - Search Box In Edit (`.mstrmojo-Box.mstrmojo-di-DISearchTableBox`)
  - Search Container (`.mstr-ai-chatbot-SearchBox`)
  - Search Icon (`.mstr-icons-lib-icon`)
  - Search In Replace Dialog Container (`.mstr-input-container`)
  - Select All In Refresh (`.mstrmojo-Label.tristate.tablestatus-header.refresh`)
  - Select Count (`.template-info-selection-count`)
  - Table (`#mstr696`)
  - Tooltip Container (`.mstr-ai-chatbot-LayoutContainer-overlay`)
  - Update Dataset Button (`.mstr-ai-chatbot-Datasets-addDataset`)
  - Upload File Page (`.mstrmojo-di-view.mstrmojo-di-view-popup`)
- **Component actions:**
  - `addBotAlias(botName, aliasName)`
  - `addColumnAliasInInput(aliasName)`
  - `checkAllInRefresh()`
  - `checkOrUncheckAttributeForms(form)`
  - `checkOrUncheckData(elem)`
  - `chooseDataType(text)`
  - `chooseFileInNewDI(text, title = newDIUILabels.English.dataSourceTitle)`
  - `clickAdvancedButton()`
  - `clickButtonInEditPage()`
  - `clickCheckBoxInSearchResult(name)`
  - `clickCheckboxOnDatasetTitle(name)`
  - `clickDatasetArrow()`
  - `clickDatasetContextMenuItem(text)`
  - `clickDatasetObjectContextMenu(firstOption, secondOption)`
  - `clickDatasetTypeInDatasetPanel(datasetType)`
  - `clickDataSortBy(text)`
  - `clickFolderArrow(name)`
  - `clickFormOrMetricContextMenuItem(text)`
  - `clickManipulateButtonDisplayed(button)`
  - `clickMenuButtonForDataset(name)`
  - `clickMenuItemInEdit(text)`
  - `clickMojoPageButton(button)`
  - `clickNewBotButton()`
  - `clickOkBtnInAttributeForms()`
  - `clickOnDatasetInReplace(name)`
  - `clickOnDatasetInSearch(name)`
  - `clickOnDatasetTitle(index = 0)`
  - `clickOneDatasetManipuButton(dataset, button)`
  - `clickReplacePageButton(button)`
  - `clickUpdateDatasetButton({ isWaitLoading = true } = {})`
  - `closeDataset(name)`
  - `closeDatasetWarningDialog()`
  - `createColumnAlias(datasetName, objectName, aliasName)`
  - `deleteBotAlias(botName)`
  - `deleteColumnAlias(datasetName, objectName, aliasName)`
  - `deleteColumnAliasInInput(aliasName)`
  - `disableShowDescription()`
  - `editBotAlias(botName, aliasName)`
  - `enableInputByClickAlias(dataName, objectName)`
  - `enableShowDescription()`
  - `getAllDatasetObjects()`
  - `getBotAliasPreviewText(botName)`
  - `getBotAliasWarningText()`
  - `getBotDescriptionText(botName)`
  - `getDatasetName(index = 0)`
  - `getDatasetNameText(index = 0)`
  - `getDatasetObjectCount()`
  - `getDatasetPanelDatasetTitleName(index = 0)`
  - `getDescriptionText(datasetName, objectName)`
  - `getSelectedDatasetText()`
  - `getShowDescriptionState()`
  - `getSubBotCount()`
  - `getUnstructuredDataItemNameText(index = 0)`
  - `hasDescriptionVisible()`
  - `hasObjectDescription(objectName)`
  - `hideDatasetList()`
  - `hideDatasetObject(objectName)`
  - `hoverErrorIcon()`
  - `hoverErrorIconForDataset(name)`
  - `hoverMenuItem(text)`
  - `hoverOnDataName(data)`
  - `hoverOnDatasetName(index = 0)`
  - `hoverPanelErrorIcon()`
  - `hoverSearchBox()`
  - `hoverTable(text)`
  - `inputBotAlias(botName, aliasName)`
  - `inputDatasetName(text)`
  - `inputSearchText(text)`
  - `isAdvancedButtonDisplayed()`
  - `isAdvancedButtonEnabled()`
  - `isBotAliasWarningDisplayed()`
  - `isBotDescriptionDisabled(botName)`
  - `isClearSearchIconDisplayed()`
  - `isColumnAliasDisabled(datasetName, objectName)`
  - `isColumnAliasDisplayed(datasetName, objectName, aliasName)`
  - `isDataChecked(elem)`
  - `isDataCheckedInFolder(elem)`
  - `isDataContextMenuDisplayed()`
  - `isDataDisplayed(type, name)`
  - `isDatasetDescriptionDisabled(datasetName)`
  - `isDatasetDisplayed(name)`
  - `isDatasetElementDisplayed(data)`
  - `isDatasetMenuItemDisplayed(text)`
  - `isDatasetObjectSelected(objectName)`
  - `isDatasetOptionDisplayed(datasetName)`
  - `isDescriptionDisabled(el)`
  - `isDescriptionVisible(datasetName, objectName)`
  - `isDisplayedDatasetName(name)`
  - `isDisplayReplacePage()`
  - `isErrorIconDisplayed()`
  - `isFileSamplePageDisplayed()`
  - `isLinkIconDisplayed()`
  - `isLinkIconDisplayedOfObject(dataset, object)`
  - `isMenuContainerDisplayed()`
  - `isNerEnabledForObject(datasetName, objectName)`
  - `isNerSwitchChecked(objectName)`
  - `isNoContentMessageDisplayed()`
  - `isObjectDescriptionDisabled(datasetName, objectName)`
  - `isPanelErrorIconDisplayed()`
  - `isSearchIconPresent()`
  - `isSearchPresent()`
  - `isWarningForBotDisplayed(name)`
  - `isWarningForDatasetDisplayed(name)`
  - `manipulateTable(elem)`
  - `openDataset(name)`
  - `openDatasetContextMenuV2(datasetName, universalBot = false)`
  - `openDatasetObjectContextMenuV2(datasetName, objectName)`
  - `openDatasetSelector()`
  - `openMenu()`
  - `panelTooltipText()`
  - `renameData(data, text)`
  - `renameDataset(text)`
  - `renameErrorMessage()`
  - `rightClickOnDataName(data)`
  - `rightClickOnObjectFromDataset(dataset, object)`
  - `searchDataset(searchText)`
  - `searchInReplaceDialog(text)`
  - `selectDatasetFromDropdown(datasetName)`
  - `setName(value)`
  - `switchToAdvancedMode()`
  - `toggleCheckboxForDatasetObject(objectName)`
  - `toggleNerSwitchForDatasetObject(objectName)`
  - `toggleShowDescription()`
  - `tooltipText()`
  - `tooltipTextForDataset(name)`
  - `updateBotAlias(botName, aliasName)`
  - `updateBotDescription(botName, newDescription)`
  - `updateDatasetDescription(datasetName, newDescription)`
  - `updateObjectDescription(datasetName, objectName, newDescription)`
  - `waitForCoverSpinnerDismiss()`
  - `waitForDataPanelContainerLoading()`
  - `waitForEditPageClose()`
  - `waitForEditPageLoading()`
  - `waitForFileSamplePageLoading(title = newDIUILabels.English.dataSourceTitle)`
  - `waitForLoaded()`
  - `waitForNerCurtainDisappear(datasetName, objectName)`
  - `waitForNerSwitchSpinnerAppear(objectName)`
  - `waitForNerSwitchSpinnerDisappear(objectName)`
  - `waitForNewDIClose()`
  - `waitForNewDIPageLoading()`
  - `waitForRefreshLoading()`
  - `waitForRefreshPageLoading()`
  - `waitForReplacePageLoading()`
  - `waitForSearchContainerDisplayed()`
  - `waitForTextAppearInDataSetPanel(text)`
  - `waitForUploadFilePageLoading()`
- **Related components:** getAdvancedContainer, getArrowButtonForDatasetContainer, getBotAliasContainer, getBotContainer, getDataPanelContainer, getDatasetContainer, getDatasetPanel, getEditPage, getFileSamplePage, getMenuContainer, getMojoPage, getNewDIPage, getPanel, getRefreshPage, getReplacePage, getSampleFileContentContainer, getSearchContainer, getSearchInReplaceDialogContainer, getUploadFilePage, libraryAuthoringPage, waitForFileSamplePage, waitForNewDIPage, waitForRefreshPage, waitForReplacePage

### AIBotDatasetPanelContextMenu
- **CSS root:** `.number-text-format-panel`
- **User-visible elements:**
  - Attribute Form Container (`.mstr-ai-chatbot-AttributeFormsSelector`)
  - Cancel Button (`.ant-btn.ant-btn-default.mstr-button.mstr-button__regular-type.mstr-button__regular-size`)
  - Cancel In Attribute Form (`.mstr-ai-chatbot-Button.mstr-ai-chatbot-Button--theme-secondary`)
  - Currency Tab Button (`.ant-btn.ant-btn-text.ant-btn-sm.ant-btn-icon-only.currency-shortcut-btn.number-format-tooltip`)
  - Number Format (`.number-text-format-panel.number-format-panel`)
  - Number Format Container (`.number-text-format-panel`)
  - OKButton (`.ant-btn.ant-btn-primary.mstr-button.mstr-button__primary-type.mstr-button__regular-size`)
  - OKIn Attribute Form (`.mstr-ai-chatbot-Button.mstr-ai-chatbot-Button--theme-primary`)
- **Component actions:**
  - `changeAndCheckMetricType(numberFormatType, nameOfMetricWithChangedFormatting, question, index)`
  - `changeAttributeFormat(data, forms, cancel = false)`
  - `changeMetricNumberFormattingToCurrencyGBP(name)`
  - `changeMetricNumberFormattingToType(numberFormatType, metricName)`
  - `checkBotIfResponseContainsExpectedMetric(savedMetrics)`
  - `checkBotIfTopicsContainsRenamedMetric(savedMetrics)`
  - `checkIfSuggestionContainsRenamedMetric(savedMetrics)`
  - `checkNumberFormat(testCase, imageName)`
  - `checkUncheckAttributeForm(form, attribute)`
  - `clickCancelInAttributeForm()`
  - `clickOKInAttributeForm()`
  - `clickOkInNumberFormat()`
  - `getElementName(type, index)`
  - `getTextFromMetrics(elementTypeMetric)`
  - `hoverOnAttributeFormsButton()`
  - `hoverOnNumberFormatButton()`
  - `isAttributeFormsButtonDisplayed()`
  - `isChecked(form)`
  - `isNumberFormatButtonDisplayed()`
  - `isRenameDisplayed()`
  - `openRenamingByDoubleClick(type, index)`
  - `openRenamingByRightClick(type, index)`
  - `pickCurrencyGBP()`
  - `prepareMetricArrayAndCheck(savedMetrics, arrayToBeChecked)`
  - `renameAllElementsOfSameType(type, nameToRenameTo)`
  - `renameElementAndClickOutside(type, renameText)`
  - `renameElementAndPressEnter(type, renameText)`
  - `renameElementAndPressTab(type, renameText)`
  - `rightClickElementById(type, index)`
  - `rightClickElementByName(type, name)`
  - `switchNumberFormatTypeToCurrency()`
  - `verifyQuestionsGivenAttributeAndMetric(question, metricNames, screenshotSuffix, testCase = 'TC93244')`
- **Related components:** aibotChatPanel, aibotDatasetPanel, getAttributeFormContainer

### AIBotPromptPanel
- **CSS root:** `.mstr-ai-chatbot-GalleryPanel-galleryContainer`
- **User-visible elements:**
  - Add Prompt Btn (`.mstr-ai-chatbot-AliasConfig-addPrompt`)
  - Config Prompt Title (`.mstr-ai-chatbot-AliasConfig-title`)
  - Prompt Gallery Panel (`.mstr-ai-chatbot-GalleryPanel-galleryContainer`)
- **Component actions:**
  - `clickAddPromptBtn()`
  - `clickPromptCardByTitle(promptTitle)`
  - `clickPromptPlayBtn(index)`
  - `clickPromptQuickRepliesBtn()`
  - `clickPromptQuickRepliesByTitle(promptTitle)`
  - `deleteAllPrompts()`
  - `deletePromptByIndex(index)`
  - `isAliasObjDisplayed(index)`
  - `renameAliasName(index, name)`
  - `TypeInputBox(input, newValue)`
  - `updatePromptQuesion(index, Q)`
  - `validatePromptCardDisplayed(promptTitle)`
- **Related components:** _none_

### AIBotSnapshotsPanel
- **CSS root:** `.mstr-ai-chatbot-Popover-content`
- **User-visible elements:**
  - Category List Panel (`.mstr-ai-chatbot-Popover-content`)
  - Clear Snapshots Controller (`.mstr-ai-chatbot-SnapshotsPanelContent-controller`)
  - Confirm Clear Snapshots Button (`.mstr-ai-chatbot-ConfirmationButton-confirm`)
  - Empty Snapshot Image (`.mstr-ai-chatbot-SnapshotsPanelEmptyContent-image`)
  - Empty Snapshot Panel (`.mstr-ai-chatbot-SnapshotsPanelEmptyContent`)
  - Maximize Button From Snapshot (`.mstr-ai-chatbot-FocusSnapshotButton`)
  - My Snapshots Panel (`.mstr-ai-chatbot-SnapshotsPanel`)
  - Snapshot Focus View Close Button (`.mstr-ai-chatbot-SnapshotFocusView-close`)
  - Snapshot Nuggets Popover Content Dataset Title (`.mstr-ai-chatbot-CINuggetsPopoverContent-nugget-right-title`)
  - Snapshot Panel Header (`.mstr-ai-chatbot-SnapshotsPanel-headerTitle`)
  - Snapshots Loading Icon (`.mstr-ai-chatbot-Spinner.mstr-ai-chatbot-Spinner--grey`)
  - Sort Button (`.mstr-ai-chatbot-SnapshotSortButton`)
  - Sort Content (`.mstr-ai-chatbot-SnapshotSortButton-content`)
  - Sort Menu (`.mstr-ai-chatbot-SnapshotSortButton-content`)
- **Component actions:**
  - `clearSearch()`
  - `clearSnapshot()`
  - `clickBackToChatPanel()`
  - `clickClearSnapshots()`
  - `clickCloseFocusViewButton()`
  - `clickConfirmClearSnapshotsButton()`
  - `clickFocusSnapshotButton(index = 0)`
  - `clickInterpretationFromMaximizeView()`
  - `clickInterpretationFromSnapshot()`
  - `clickMaximizeButton(index = 0)`
  - `clickMaximizeButtonFromSnapshot()`
  - `clickNuggetTriggerIconFromMaximizeView()`
  - `clickSnapshotNuggetTriggerIcon()`
  - `clickSortButton()`
  - `closeSnapshotsPanel()`
  - `isClearSnapshotButtonDisplayed()`
  - `isEmptySnapshotPanelDisplayed()`
  - `isSnapshotCardDisplayed(text)`
  - `searchByText(text)`
  - `setSnapshotTimeForAll(value)`
  - `setSortBy(sortBy)`
  - `waitForExportComplete()`
  - `waitForSnapshotCardLoaded(index = 0)`
- **Related components:** aibotChatPanel, getCategoryListPanel, getCloseSnapshotsPanel, getEmptySnapshotPanel, getMySnapshotsPanel, getSnapshotCardInSnapshotPanel

### AIBotToastNotification
- **CSS root:** `.mstr-ai-chatbot-Toast`
- **User-visible elements:**
  - Toast Notification (`.mstr-ai-chatbot-Toast`)
- **Component actions:**
  - `isToastNotificationVisible()`
- **Related components:** _none_

### AIBotUsagePanel
- **CSS root:** `.mstrd-ActionLinkContainer-text`
- **User-visible elements:**
  - Error Message Arrow (`.icon-submenu_arrow`)
  - Ok Button (`.mstrmojo-Button-text=OK`)
  - Response Tooltip (`.mstr-ai-chatbot-TileItem-infoIconWrapper`)
  - Usage Content (`.mstr-ai-chatbot-Tabs-usage`)
  - Usage Date Range Dropdown (`.mstr-ai-chatbot-PeriodDropdown-usageRecordsSelect`)
  - Usage Download Button (`.mstr-ai-chatbot-Header-download`)
  - Usage Download Error Details (`#mstrd-MessageBox-detailsText-1 > div`)
  - Usage Download Failed Message (`.mstr-ai-chatbot-FailedDownloadDialog-msg`)
  - Usage Download Failed Message Dashboard (`.mstrd-MessageBox-msg`)
  - Usage Download Failed Ok Button (`.mstr-ai-chatbot-Button`)
  - Usage Download Failed Ok Button Dashboard (`.mstrd-ActionLinkContainer-text`)
  - Usage Panel Header (`.mstr-ai-chatbot-Header-label`)
  - Usage Panel Message (`.mstr-ai-chatbot-UsagePanel-message`)
- **Component actions:**
  - `clickDashboardPropertiesTab(text)`
  - `clickErrorMessageArrow()`
  - `clickInterpretationButton()`
  - `clickOkButton()`
  - `clickUsageDateRange(text)`
  - `clickUsageDateRangeDropdown()`
  - `clickUsageDownloadButton()`
  - `clickUsageDownloadFailedOkButton()`
  - `clickUsageDownloadFailedOkButtonDashboard()`
  - `disableInterpretation()`
  - `enableInterpretation()`
  - `hoverOnResponseTooltip()`
  - `isInterpretationEnabled()`
  - `isResponseTooltipDisplayed()`
  - `isUsageTileValueCorrect(title, expectedValue)`
  - `isUsageTileValueDisplayed(title)`
  - `isUsageTileValueHidden(title)`
- **Related components:** _none_

### AIDiagProcess
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `extractSpeakerAnswer()`
  - `getLLMSQL()`
  - `getQueryResult()`
  - `ifVizGenerated()`
  - `validate_content_in_dashboard_action(diagData, content = [])`
  - `validate_data_on_requirement(requirement, summary, data = null)`
- **Related components:** _none_

### Bot2Chat
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `checkMetricValue(response, metricArray)`
  - `getLatestAnswerInAIChatbot()`
  - `verifyAnswerContainsKeywords(words, ignoreCase = true)`
  - `verifyAnswerContainsOneOfKeywords(words, ignoreCase = true)`
- **Related components:** aiBotChatPanel, aiBotDatasetPanel, dossierAuthoringPage, libraryAuthoringPage, libraryPage

### BotAppearance
- **CSS root:** `.mstr-ai-chatbot-AppearancePanel-container`
- **User-visible elements:**
  - Appearance Panel (`.mstr-ai-chatbot-AppearancePanel-container`)
  - Palette Select Indicator (`.mstr-ai-chatbot-PaletteSelect-select-item-indicator`)
  - Palette Select Panel (`.mstr-ai-chatbot-PaletteSelect-select-content`)
  - Palettes Selector (`.mstr-ai-chatbot-PaletteSelect-select-trigger`)
  - Theme Selector (`.mstr-ai-chatbot-ThemeSelect-wrapper`)
  - Theme Tooltip (`.mstr-ai-chatbot-AppearancePanel-theme-info`)
- **Component actions:**
  - `changePaletteTo(palette)`
  - `changeThemeItemColor(itemLabel, colorAriaLabel)`
  - `changeThemeTo(theme)`
  - `checkPaletteInApp({
        appId = 'C2B2023642F6753A2EF159A75E0CFF29', projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', botId: botId, })`
  - `closePaletteDropdownList()`
  - `isPaletteSelected(palette)`
  - `isPaletteSelectIndicatorDisplayed()`
  - `openPaletteDropdownList()`
  - `openThemeList()`
  - `triggerThemeTooltip()`
- **Related components:** getPaletteSelectPanel, getThemeSelectorItemContainer, libraryAuthoringPage, libraryPage

### BotAuthoring
- **CSS root:** `.mstr-ai-chatbot-EditingLayout`
- **User-visible elements:**
  - AIBot Edit Loading (`.mstr-ai-chatbot-LoadingIcon-content--visible`)
  - AIBot Panel (`.mstrd-AIBotPanelWrapper-main`)
  - AIBot Toolbar (`.mstrd-DossierViewNavBarContainer`)
  - Alert (`.mstrmojo-Box.alert-content`)
  - Arrow Down On Save (`.mstrd-SaveNavItemContainer .mstrd-ContextMenu-trigger`)
  - Bot Authoring Container (`.mstr-ai-chatbot-EditingLayout`)
  - Bot Config Container (`.mstr-ai-chatbot-ConfigTabs-root`)
  - Bot Config Dataset Description (`.mstr-ai-chatbot-Datasets-description`)
  - Cache Manager Page (`.mstr-ai-chatbot-EditingLayout-agentCache`)
  - Certify Icon (`.mstrd-CertifiedIcon.mstrd-CertifiedIcon--expanded`)
  - Certify Tooltip (`.ant-tooltip-inner`)
  - Close Button (`.icon-pnl_close`)
  - Config Tabs Header Container (`.mstr-ai-chatbot-ConfigTabs-list`)
  - Confirm Override Dialog (`.mstrmojo-Editor.mstrmojo-alert.modal`)
  - Confirm Save Dialog (`.mstrmojo-Editor.mstrmojo-ConfirmSave-Editor`)
  - Confirm Warning Dialog (`.mstrmojo-Editor.mstrmojo-ConfirmSave-Editor.modal`)
  - Decertify Button (`.mstrd-CertifiedIcon-decertify`)
  - Editing Icon In Authoring Bot Toolbar (`.icon-info_edit`)
  - Editor Btns With Save Btn (`.mstrmojo-Editor-buttons`)
  - Editor Curtain Mask (`#waitBox .mstrmojo-Editor-curtain`)
  - In Active Banner (`.mstrd-PageNotification-msg--inactive`)
  - Message Box Container (`.mstrd-MessageBox-main.mstrd-MessageBox-main--modal`)
  - Save As Editor (`.mstrmojo-SaveAsEditor`)
  - Save Bot Drop Down (`.mstrd-NavIconContextMenu-menu`)
  - Save Button (`.SaveNavItem div.mstr-nav-icon`)
  - Save Dialog (`.mstrmojo-SaveAsEditor`)
  - Save Success Message Box (`.ant-message-notice`)
  - Saving Modal View (`.saving-in-progress.modal`)
  - Success Toast (`.mstrmojo-Label.mstrWaitMsg`)
  - Tooltip (`.mstr-ai-chatbot-Tooltip`)
- **Component actions:**
  - `addSampleData(languageID, sampleFileName = 'Airline Sample Data')`
  - `clickArrowDownOnSave()`
  - `clickBotConfigDatasetDescription()`
  - `clickCloseButton()`
  - `clickConfirmButtonInNoPermissionAlert()`
  - `clickSaveAsButton()`
  - `clickSaveButton()`
  - `createBotBySampleData(languageID, isSaaS = false)`
  - `decertifyBotInTooltip()`
  - `dismissErrorMessageBoxByClickOkButton()`
  - `dismissTooltip()`
  - `exitBotAuthoring()`
  - `exitBotAuthoringWithoutSave()`
  - `getBotIdFromUrl()`
  - `getCertifyInfo()`
  - `getDossierIdFromUrl()`
  - `getInactiveBannerText()`
  - `getProjectIdFromUrl()`
  - `hoverCertifyIcon()`
  - `isAiBotToolbarPresent()`
  - `isAIDisabledBannerDisplayed()`
  - `isBotCertified()`
  - `isConfigTabSelected(name)`
  - `isConfirmWarningDialogPresent()`
  - `isDecertifyButtonPresent()`
  - `isInActiveBannerDisplayed()`
  - `isSaveAndCertifyButtonPresent()`
  - `isSaveAsButtonPresent()`
  - `isSaveButtonEnabled()`
  - `isSaveDialogPresent()`
  - `openButtonMenu()`
  - `openCacheManager()`
  - `saveAndCertifyBot()`
  - `saveAsBot({ name, path })`
  - `saveAsBotInMyReports(name)`
  - `saveAsBotOverwrite()`
  - `saveBot({ skipClosingToast = true, expectSuccess = true })`
  - `saveBotBySaveDialog(expSuccess = true)`
  - `saveBotWithConfirm()`
  - `saveBotWithName(name, path)`
  - `saveExistingBotV2()`
  - `scrollBotPanelHorizontally(toPosition)`
  - `selectBotConfigTabByIndex(index)`
  - `selectBotConfigTabByName(name)`
  - `waitForMessageBoxDisplay()`
  - `waitForPageLoading()`
  - `waitForSaveAsButtonClickable()`
- **Related components:** aibotChatPanel, aibotDatasetPanel, custommizationPanel, dossierAuthoringPage, getAIBotPanel, getCacheManagerPage, getConfigTabContainer, getConfigTabsHeaderContainer, getMessageBoxContainer, getPage, libraryAuthoringPage, waitForPage

### BotConsumptionFrame
- **CSS root:** `.mstrd-DossierViewContainer`
- **User-visible elements:**
  - Account Icon In Toolbar (`.icon-tb_profile_n`)
  - Bot Consumption Contaniner (`.mstrd-DossierViewContainer`)
  - Bot Consumption Toolbar (`.mstrd-DossierViewNavBarContainer`)
  - Bot Name (`.mstrd-DossierTitle span`)
  - Bot Name Segment In Toolbar (`.mstrd-DossierTitle span`)
  - Edit Appearance Button (`.mstr-icons-lib-icon mstr-ai-chatbot-ConfigTabs-appearance`)
  - Edit Button (`.icon-info_edit`)
  - Inactive Banner (`.mstrd-PageNotification-container--inactive`)
  - Inactive Banner Message (`.mstrd-PageNotification-msg--inactive`)
  - Share Button In Toolbar (`.icon-tb_share_n`)
- **Component actions:**
  - `clickCloseButtonInMessageBox()`
  - `clickEditButton()`
  - `clickOkButtonInNeedPermissionMessageBox()`
  - `errorDetail()`
  - `getInactiveBannerText()`
  - `isEditIconDisplayedInToolbar()`
  - `isInactiveBannerDisplayed()`
  - `isInactiveMsgDisplayed()`
  - `showDetail()`
- **Related components:** aiBotChatPanel

### BotCustomInstruction
- **CSS root:** `.mstr-ai-chatbot-ConfirmationDialog`
- **User-visible elements:**
  - Adaptive Learning Warning (`.mstr-ai-chatbot-ConsolidatedLearnings-warnText`)
  - Advenced Configuration Title (`.mstr-ai-chatbot-CustomInstruction-item-title`)
  - Confirm Delete Container (`.mstr-ai-chatbot-ConfirmationDialog`)
  - Custom Instructions Switch (`.mstr-ai-chatbot-CustomInstruction-item .mstr-ai-chatbot-Switch-root`)
  - Download Learning Button (`.mstr-ai-chatbot-LearningDownloadButton`)
  - Download Learning Error (`.mstr-ai-chatbot-download-learning-error`)
  - Download Learning Info Icon (`.mstr-ai-chatbot-ConsolidatedLearnings-infoIcon`)
  - Download Learning Section (`.mstr-ai-chatbot-ConsolidatedLearnings`)
  - Download Learning Title (`.mstr-ai-chatbot-ConsolidatedLearnings-title`)
  - Execute Acl Warning (`.mstr-ai-chatbot-collection-container-item-warning`)
  - Fiscal Year Settings (`.mstr-ai-chatbot-FiscalYearSettings`)
  - Fiscal Year Switch (`.mstr-ai-chatbot-FiscalYearSettings .mstr-ai-chatbot-Switch-root`)
  - Knowledge Section (`.mstr-ai-chatbot-knowledge-container`)
  - Last Downloaded Time (`.mstr-ai-chatbot-ConsolidatedLearnings-lastDownloadDate`)
  - Last Downloaded Time Label (`.mstr-ai-chatbot-download-learning-info-dialog-last-time-label`)
  - Total Learning Captured (`.mstr-ai-chatbot-ConsolidatedLearnings-learningCount`)
  - Total Learning Captured Label (`.mstr-ai-chatbot-ConsolidatedLearnings-learningCountLable`)
  - Web Management Setting (`.mstr-ai-chatbot-WebSearchSettings`)
- **Component actions:**
  - `addAllowlistDomain(domain)`
  - `addBlocklistDomain(domain)`
  - `clickDownloadLearningButton()`
  - `deleteAllAllowlistDomains()`
  - `deleteAllBlocklistDomains()`
  - `deleteAllDomains()`
  - `deleteLatestAllowlistDomain()`
  - `deleteLatestBlocklistDomain()`
  - `deleteNuggetItem(index = 0)`
  - `disableApplyTimeFilter()`
  - `disableCustomInstructions()`
  - `disableFiscalYear()`
  - `disableSendObjectDescription()`
  - `enableApplyTimeFilter()`
  - `enableCustomInstructions()`
  - `enableFiscalYear()`
  - `enableSendObjectDescription()`
  - `fakeNuggetNameInUI(index = 0)`
  - `getAdaptiveLearningWarning()`
  - `getAdvancedConfigurationTitleText()`
  - `getAllowlistErrorMessageCount()`
  - `getAllowlistItemCount()`
  - `getAllowlistLatestErrorMessage()`
  - `getApplyTimeFilterSwitchLabelText()`
  - `getAttributeFormTemperatureValue()`
  - `getBlocklistErrorMessageCount()`
  - `getBlocklistItemCount()`
  - `getBlocklistLatestErrorMessage()`
  - `getLastDownloadedTime()`
  - `getMetricTemperatureValue()`
  - `getSendObjectDescriptionSwitchLabelText()`
  - `getSpeakerTemperatureValue()`
  - `getTotalLearningCaptured()`
  - `hoverDownloadLearningButton()`
  - `hoverDownloadLearningInfoIcon()`
  - `hoverOnApplyTimeFilterInfoIcon()`
  - `hoverOnAttributeFormTemperatureTooltip()`
  - `hoverOnMetricTemperatureTooltip()`
  - `hoverOnMissingFileWarningIcon()`
  - `hoverOnNuggetTitle(index = 0)`
  - `hoverOnSendObjectDescriptionInfoIcon()`
  - `hoverOnSpeakerTemperatureTooltip()`
  - `inputAllowlistDomain(domain)`
  - `inputBackground(background)`
  - `inputBackgroundByPaste(background)`
  - `inputBlocklistDomain(domain)`
  - `inputCustomInstructions(instructions, index = 0)`
  - `inputDeniedAnswer(deniedAnswer)`
  - `inputDomain(tag, domain)`
  - `inputFormat(format)`
  - `inputFormatByPaste(format)`
  - `isAddBtnOnAllowlistDisabled()`
  - `isApplyTimeFilterEnabled()`
  - `isCalendarSettingsDisabled(index)`
  - `isCustomInstructionsEnabled()`
  - `isDownloadLearningButtonEnabled()`
  - `isFiscalYearEnabled()`
  - `isInputBoxDisabled()`
  - `isInputBoxEnabled()`
  - `isLastDownloadedTimeVisible()`
  - `isLearningSectionVisible()`
  - `isSendObjectDescriptionEnabled()`
  - `isTemperatureDisplayed()`
  - `isWebManagementDisplayed()`
  - `makeFileUploaderVisible(fileUploderInput)`
  - `resetAttributeFormTemperature()`
  - `resetMetricTemperature()`
  - `resetSpeakerTemperature()`
  - `reuploadNuggetsFile(fileName, index = 0)`
  - `scrollCustomInstructionsTo(position)`
  - `scrollToBottom()`
  - `selectAdvancedCalendarDropdownBySearch(dropdownTrigger, input, elementName)`
  - `selectAdvancedCalendarDropdownOption(dropdownTrigger, datasetName, elementName)`
  - `selectDropdownOption(dropdownTrigger, optionText)`
  - `selectRadioButtonByText(text)`
  - `setAttributeFormTemperature(value)`
  - `setMetricTemperature(value)`
  - `setSpeakerTemperature(value)`
  - `triggerBackgroundTooltip()`
  - `triggerFormatTooltip()`
  - `triggerProgressErrorTooltip(index = 0)`
  - `turnOffWebManagement()`
  - `turnOnWebManagement()`
  - `uploadNuggetsFile(fileName)`
  - `upLoadNuggetsFileError(fileName)`
  - `uploadNuggetsFileWorkaround({ fileName, fileUploader, index = 0 })`
  - `uploadNuggetsFileWorkaroundNoWait({ fileName, fileUploader = this.getNuggetFileUploadInput()`
  - `waitForNuggetsItemsLoaded()`
- **Related components:** getConfirmDeleteContainer, getCurrentTabContainer, getKnowledgeContainer, getNuggetsFileUploaderContainer, getTemperatureSliderContainer, getUploadedFileProgressContainer

### BotRulesSettings
- **CSS root:** `.mstr-ai-chatbot-DraggableRuleItem-editing-container`
- **User-visible elements:**
  - Add Rule Button (`.mstr-ai-chatbot-RulesPanel-add-button`)
  - Draggable Rule Editing Container (`.mstr-ai-chatbot-DraggableRuleItem-editing-container`)
  - Draggable Rule When Input (`.mstr-ai-chatbot-DraggableRuleItem-when-input`)
  - Dropdown (`.ant-select-dropdown:not(.ant-select-dropdown-hidden)`)
  - Filter Dropdown Trigger (`.mstr-ai-chatbot-DatasetObjectPicker`)
  - Filter Operator Dropdown Trigger (`.mstr-ai-chatbot-FilterItem-operator-select`)
  - Filter Value Input (`.mstr-ai-chatbot-FilterItem-element-input`)
  - Filter When Input (`.mstr-ai-chatbot-FilterItem-when-input`)
  - General Item Editing Container (`.mstr-ai-chatbot-SqlTemplateGeneralItem-editing-container`)
  - Manage Rules Title (`.mstr-ai-chatbot-RulesPanel-title`)
  - Rules List (`.mstr-ai-chatbot-RulesPanel-rules-list`)
  - Search Input For Dropdown (`.ant-select-selection-search-input.focus-visible`)
- **Component actions:**
  - `addBasedOnObjectConfiguration(ruleIndex, basedOnObject, action = 'Require')`
  - `addBasedOnObjectsBySearch(ruleIndex, objectNames)`
  - `addBasedOnObjectsBySelection(ruleIndex, objectNames)`
  - `addBasedOnObjectsSelectingAll(ruleIndex)`
  - `addNewRule()`
  - `addRecentlyEditedObjectsWithAllObjectsSelected(ruleIndex, objectNames)`
  - `clearSearchInputInDropdown()`
  - `clickAddButtonForOtherRules(ruleIndex, label)`
  - `clickAddButtonInBasedOnObjectConfiguration(ruleIndex, basedOnObject)`
  - `clickBasedOnConfigurationActionDropdown(ruleIndex, basedOnObject)`
  - `clickItemInDropdown(objectName)`
  - `clickManageRulesTitleToExitEdit()`
  - `closeBasedOnDropdown(ruleIndex)`
  - `configFilter(whenText = '', objectLabel, operator = '=', value)`
  - `configGroupBy(whenText = '', objectNames)`
  - `configGuardsInAdvancedSettings(whenText='', objectNames)`
  - `configOrderBy(whenText = '', objectLabel, clickSort = false)`
  - `configPreferenceInAdvancedSettings(whenText='', oneObjectOption = false, objectLabel1, objectLabel2)`
  - `configTimeinAdvancedSettings(whenText='', dimension, value)`
  - `deleteRuleByIndex(index)`
  - `dragAndDropGroupByItem(ruleIndex, sourceIndex, targetIndex)`
  - `dragAndDropOrderByItem(ruleIndex, sourceIndex, targetIndex)`
  - `editAdvancedSettingsRuleItemByIndex(ruleIndex, sectionIndex, itemIndex)`
  - `editBasedOnObjectConfigurationItemByIndex(ruleIndex, basedOnObject, configIndex, action)`
  - `editFilterByIndex(ruleIndex, filterIndex)`
  - `editGroupByByIndex(ruleIndex, groupByIndex)`
  - `editOrderByByIndex(ruleIndex, orderByIndex)`
  - `expandAdvancedSettings(ruleIndex)`
  - `expandBasedOnObjectCollapseArrowByName(ruleIndex, basedOnObject)`
  - `inputTermForSearchDropdown(term)`
  - `isAddButtonForOtherRulesDisabled(ruleIndex, label)`
  - `isEditIconPresentForBasedOnDropdown(objectName)`
  - `openBasedOnDropdown(ruleIndex)`
  - `removeAdvancedSettingsRuleItemByIndex(ruleIndex, sectionIndex, itemIndex)`
  - `removeAllObjectsSelected(ruleIndex)`
  - `removeBasedOnObjectByName(ruleIndex, objectName)`
  - `removeBasedOnObjectConfigurationItemByIndex(ruleIndex, basedOnObject, configIndex)`
  - `removeFilterByIndex(ruleIndex, filterIndex)`
  - `removeGroupByByIndex(ruleIndex, groupByIndex)`
  - `removeOrderByByIndex(ruleIndex, orderByIndex)`
  - `renameRuleByIndex(index, newName)`
  - `selectMultipleObjectsInBasedOnObjectConfigurationDropdown(ruleIndex, basedOnObject, objectNames)`
- **Related components:** getAdvancedSettingsRuleContainer, getDraggableRuleEditingContainer, getFilterItemContainer, getGeneralItemEditingContainer, getRuleItemContainer

### BotVisualizations
- **CSS root:** `.insightlinechart-info-icon`
- **User-visible elements:**
  - Insight Line Chart Info Icon (`.insightlinechart-info-icon`)
  - Insight Line Iinfo Window (`.new-vis-tooltip-table`)
  - Show Error Message (`.mstr-design-collapse-header__title`)
- **Component actions:**
  - `checkMapByImageComparison(index, testCase, imageName)`
  - `checkQueryMessageByImageComparison(testCase, imageName)`
  - `checkVizByImageComparison(testCase, imageName, index = 0)`
  - `checkVizInSnapshotDialog(testCase, imageName)`
  - `checkVizInSnapshotPanel(testCase, imageName, index = 0)`
  - `clearHistoryAndAskQuestion(imageFolder, vizType, aiEntry = 'bot')`
  - `clickFistRect(mode)`
  - `clickGMShape(mode)`
  - `clickGMYaxisTitle()`
  - `clickGridCell(index, mode)`
  - `clickMapResetButton(mode)`
  - `clickMapZoomInButton(mode)`
  - `clickMapZoomOutButton()`
  - `clickShowErrorDetails()`
  - `clickSnapshotViz()`
  - `hoverGMYaxisTitle()`
  - `hoverInsightLineChartInfoIcon()`
  - `hoverMapbox(index = 0)`
  - `hoverOnFistRect(mode)`
  - `hoverOnGMShape(mode)`
  - `hoverOnHeatmap(mode, offset = { x: 0, y: 0 })`
  - `isLineChartInBotExist()`
  - `rightClickGMShape(mode)`
  - `rightClickGridCell(index, mode)`
  - `rightClickOnHeatmap(mode, offset = { x: 0, y: 0 })`
  - `rightClickRect(mode)`
- **Related components:** aibotChatPanel, aIBotSnapshotPanel, libraryAuthoringPage, libraryPage

### CacheManager
- **CSS root:** `.mstr-ai-chatbot-CacheQuestionCard-context-menu`
- **User-visible elements:**
  - Bucket Context Menu Container (`.mstr-ai-chatbot-CacheQuestionCard-context-menu`)
  - Bucket Group List (`.mstr-ai-chatbot-CacheQuestionCard-submenu-merge-content`)
  - Bucket Panel (`.mstr-ai-chatbot-CacheQuestionGroups`)
  - Bucket Pin Title (`.mstr-ai-chatbot-CacheQuestionGroups-collapsible-title`)
  - Cache Setting Backdrop (`.mstr-ai-chatbot-CacheSettingsDialog-backdrop`)
  - Cache Setting Icon (`.mstr-ai-chatbot-CacheQuestionGroups-header-settings-icon`)
  - Cache Settings Dialog (`.mstr-ai-chatbot-CacheSettingsDialog`)
  - Caching Mode Dropdown (`.mstr-ai-chatbot-Select-viewport`)
  - Close Cache Manager Button (`.mstr-nav-icon.icon-pnl_close`)
  - Column Container (`.ag-virtual-list-container.ag-column-select-virtual-list-container`)
  - Create New Bucket Option (`.mstr-ai-chatbot-MoveToDropdown-item--create`)
  - Delete Caches Button (`.mstr-ai-chatbot-CacheSettingsDialog-delete-button`)
  - Question Answer Panel (`.mstr-ai-chatbot-CacheQuestionAnswer`)
  - Question Context Menu (`.mstr-ai-chatbot-CacheQuestionsPanel-question-context-menu`)
  - Question Details Panel (`.mstr-ai-chatbot-CacheQuestionsPanel-caching-container`)
  - Question Panel (`.mstr-ai-chatbot-CacheQuestionsPanel`)
  - SQLDialog (`.mstr-ai-chatbot-SQLDialog`)
  - SQLOutput Panel (`.mstr-ai-chatbot-SQLDialog-output-panel`)
  - Toast (`.mstr-ai-chatbot-Toast-viewport`)
  - View SQLLink (`.mstr-ai-chatbot-CacheQuestionsPanel-sql-link`)
- **Component actions:**
  - `clearSearch()`
  - `closeCacheManager()`
  - `closeCacheSettings()`
  - `closeViewSQL()`
  - `collapseColumns()`
  - `deleteCaches()`
  - `expandColumns()`
  - `expandQuestion(index = 0)`
  - `getBucketPinCount()`
  - `getCachingBucketsCount()`
  - `getCurrentCachingMode()`
  - `getQuestionListCount()`
  - `isCacheSettingsDialogDisplayed()`
  - `isColumnCheckedByName(name)`
  - `isDeleteCachesButtonDisplayed()`
  - `openBucketByIndex(index = 0)`
  - `openBucketByName(text)`
  - `openBucketContextMenu(index = 0)`
  - `openCacheSettings()`
  - `openCachingModeDropdown()`
  - `openQuestionContextMenu(index = 0)`
  - `openViewSQL()`
  - `saveSQL()`
  - `searchBuckets(text)`
  - `selectBucketContextMenuOption(firstOption, secondOptionIndex)`
  - `selectCachingMode(mode)`
  - `selectColumnByName(text)`
  - `selectQuestionContextMenuOption(firstOption, secondOption)`
  - `verifySQL()`
  - `waitForToastGone()`
- **Related components:** getBucketContextMenuContainer, getBucketPanel, getCacheManagerPage, getQuestionAnswerPanel, getQuestionPanel, getSQLOutputPanel, waitForPage

### ChatAnswer
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `clickCopyButton()`
  - `clickDownloadButton()`
  - `clickMoreButton()`
  - `clickPinButton()`
  - `hoverAndGetTooltip(e)`
  - `hoverOnAnswer()`
- **Related components:** _none_

### EmbedBotDialog
- **CSS root:** `.mstrd-EmbedBotContainer-main`
- **User-visible elements:**
  - Embed Bot Dialog Container (`.mstrd-EmbedBotContainer-main`)
- **Component actions:**
  - `closeEmbedBotDialog()`
  - `downloadEmbedBotSnippet()`
  - `hideNameAndTime()`
  - `openEmbedBotFromInfoWindow()`
  - `openEmbedBotFromShareMenu(text = 'Embed Agent')`
  - `openEmbedBotLearnMoreLink()`
  - `openHideDropdown()`
  - `selectHideOption(name)`
  - `toggleHideSnapshots()`
- **Related components:** getEmbedBotDialogContainer

### GeneralSettings
- **CSS root:** `.mstr-ai-chatbot-GeneralPanel-container`
- **User-visible elements:**
  - Active Toggle (`#active_switch`)
  - Add New Custom Suggestion Button (`.mstr-ai-chatbot-QuestionSuggestions-customAddNew`)
  - Auto Generated Suggestion Limit Drop Down Trigger (`.mstr-ai-chatbot-Select-container button`)
  - Bot Info Section (`.mstr-ai-chatbot-GeneralPanel-botInfo`)
  - Bot Name Input (`.mstr-ai-chatbot-BotName-input`)
  - Bot Name Invalid Input Warning Icon (`.mstr-ai-chatbot-BotName-nameError`)
  - Cover Image Container (`.mstr-ai-chatbot-CoverImage`)
  - Cover Image Edit Button (`.mstr-ai-chatbot-GalleryDialog-trigger-icon`)
  - Edit Cover Image Dialog (`.mstr-ai-chatbot-GalleryDialog-container`)
  - Edit Cover Image Pen Icon (`.mstr-ai-chatbot-GalleryDialog-trigger-icon`)
  - Editor Cover Image (`.mstr-ai-chatbot-Clickable.mstr-ai-chatbot-CoverImage`)
  - Generl Settings Container (`.mstr-ai-chatbot-GeneralPanel-container`)
  - Greeting Count (`.mstr-ai-chatbot-Textarea-word-count.mstr-ai-chatbot-BotGreeting-count`)
  - Greeting Input Box (`textarea[name=greetingText]`)
  - Greeting Section (`.mstr-ai-chatbot-BotGreeting`)
  - Limits Section (`.mstr-ai-chatbot-Limits`)
  - Link Indicator (`.mstr-ai-chatbot-Links-tooltip`)
  - Link Section (`.mstr-ai-chatbot-Links`)
  - Optional Features Section (`.mstr-ai-chatbot-OptionalFeatures`)
  - Panel Theme Select (`.mstr-ai-chatbot-AppearancePanel-theme-section .mstr-ai-chatbot-Select-item`)
  - Popup Container (`.rc-virtual-list,.mstr-ai-chatbot-Select-viewport`)
  - Question Input Hint Input Box (`.mstr-ai-chatbot-QuestionInput-hint input`)
  - Question Input Section (`.mstr-ai-chatbot-QuestionInput`)
  - Question Sugestions Section (`.mstr-ai-chatbot-QuestionSuggestions`)
  - Topic Section (`.mstr-ai-chatbot-Topics`)
  - Total Auto Generate Suggestion Limit (`.mstr-ai-chatbot-Select-container span:not(.mstr-ai-chatbot-Select-selectIcon)`)
- **Component actions:**
  - `activeBot()`
  - `addCustomSuggestion(text)`
  - `addCustomTopic({ title, description })`
  - `addExternalLink({ iconIndex = 0, title, url })`
  - `autoGenerateTopics()`
  - `changeBotName(newName)`
  - `changeGreeting(newGreeting)`
  - `changePanelTheme(theme = 'Dark')`
  - `changeQuestionHint(newHint)`
  - `changeSuggestionNumber(number)`
  - `changeVizPalette()`
  - `clickAddCustomTopicButton()`
  - `clickAddLinkButton()`
  - `closeCoverImageEditDialog()`
  - `deactiveBot()`
  - `deleteCustomSuggestionByIndex(index = 0)`
  - `deleteExternalLinkByIndex(index = 0)`
  - `disableTopicPanel()`
  - `disableTopicSuggestion()`
  - `editCustomTopicByIndex(index, { title, description })`
  - `enableTopicPanel()`
  - `enableTopicSuggestion()`
  - `getBotAliasName()`
  - `getBotGreetingText()`
  - `getCoverImageSrc()`
  - `getPanelThemeColor()`
  - `getTopicsCount()`
  - `getTopicsDescriptionTextByIndex(index)`
  - `getTopicsTitleTextByIndex(index)`
  - `hoverOnActiveToggleButton()`
  - `hoverOnBotLogoInfoIcon()`
  - `hoverOnBotNameInvalidInputWarningIcon()`
  - `hoverOnInvalidUrlIconByIndex(index = 0)`
  - `hoverTopicSwitch()`
  - `inputTopicsDescriptionByIndex(index, description)`
  - `inputTopicTitleByIndex(index, title)`
  - `isActiveBotSwitchOn()`
  - `isAddCustomTopicButtonPresent()`
  - `isAllowSnapshotSwitchOn()`
  - `isAutoGenerateTopicsButtonPresent()`
  - `isAutoSuggestionLimitOptionEnabled(option)`
  - `isAutoSuggestionLimitOptionSelected(option)`
  - `isDeleteTopicButtonPresent(index)`
  - `isDisplayBotLogoSettingOn()`
  - `isEnableInterpretationSwitchOn()`
  - `isEnableSuggestionSwitchOn()`
  - `isExportFullDataSwitchOn()`
  - `isExportSwitchOn()`
  - `isRefreshTopicButtonEnabled(index)`
  - `isTopcisPanelEnabled()`
  - `isTopicsSuggestionEnabled()`
  - `openAutoSuggestionLimitSelectionDropdown()`
  - `openCoverImageEditDialog()`
  - `openInterpretationTooltip()`
  - `openLinkSettingsTooltip()`
  - `openPanelTheme()`
  - `refreshTopics(index)`
  - `removeTopicByIndex(index)`
  - `replaceText({ elem, text })`
  - `resetBotName()`
  - `resetGreeting()`
  - `resetPanelTheme()`
  - `resetQuestionInputHint()`
  - `resetVizPalette()`
  - `saveAndCloseEditCoverImageDialog()`
  - `saveConfig()`
  - `scrollToBottom()`
  - `scrollToTop()`
  - `selectCoverImage(index)`
  - `selectImageInGalleryByIndex(index = 0)`
  - `selectLinkDisplayFormat(format)`
  - `setAutoSuggestionLimit(limit)`
  - `setCustomSuggestionByIndex(index = 0, text)`
  - `setExternalLinkByIndex({ index = 0, iconIndex = 0, title, url })`
  - `setQuestionLimit(limit)`
  - `switchBetweenImageCategory(category)`
  - `tickBotLogoSetting()`
  - `toggleActiveSwitch()`
  - `toggleAllowSnapshotSwitch()`
  - `toggleDisplayBotLogo(flag = true)`
  - `toggleEnableInterpretationSwitch()`
  - `toggleEnableSuggestionSwitch()`
  - `toggleTopicSwitch()`
  - `triggerCloseTooltip()`
  - `triggerDeleteLinkTooltip(index)`
  - `triggerInvalidUrlTooltip(index)`
  - `turnOffAllowSnapshot()`
  - `turnOffAskAbout()`
  - `turnOffAutoComplete()`
  - `turnOffEnableInterpretation()`
  - `turnOffEnableSuggestion()`
  - `turnOffExport()`
  - `turnOffExportFullData()`
  - `turnOffInsights()`
  - `turnOffInterpretation()`
  - `turnOffResearch()`
  - `turnOffSnapshot()`
  - `turnOffSqlTemplate()`
  - `turnOffSuggestions()`
  - `turnOffWebSearch()`
  - `turnOnAllowSnapshot()`
  - `turnOnAskAbout()`
  - `turnOnAutoComplete()`
  - `turnOnEnableInterpretation()`
  - `turnOnEnableSuggestion()`
  - `turnOnExport()`
  - `turnOnExportFullData()`
  - `turnOnInsights()`
  - `turnOnInterpretation()`
  - `turnOnResearch()`
  - `turnOnSnapshot()`
  - `turnOnSqlTemplate()`
  - `turnOnSuggestions()`
  - `turnOnWebSearch()`
  - `updateBotCoverImage({ url = '', category = 'All', index = 0 })`
  - `updateBotName(name)`
  - `updateCoverImageUrl(url)`
  - `updateGreetings(greeting)`
  - `updateQuestionInputHint(hint)`
  - `waitForImageLoaded(elem)`
- **Related components:** getBotLogoSettingContainer, getCoverImageContainer, getGenerlSettingsContainer, getImageCategoryButtonsContainer, getPanel, getPopupContainer, getTopicsPanel, isTopcisPanel

### HisoryPanel
- **CSS root:** `.mstr-ai-chatbot-MainView-historiesContainer`
- **User-visible elements:**
  - Chat List (`.mstr-ai-chatbot-HistoriesPanelContent-chatList`)
  - Clear Search Btn (`.mstr-ai-chatbot-SearchBox-clear`)
  - Close Btn (`.mstr-ai-chatbot-HistoriesPanel-close`)
  - Current Chat (`.mstr-ai-chatbot-HistoriesPanelContent-chat.current`)
  - Delete Chat Confirmation Dialog (`.mstr-ai-chatbot-ConfirmationButton-dialog`)
  - History Panel (`.mstr-ai-chatbot-MainView-historiesContainer`)
- **Component actions:**
  - `clearChatSearch()`
  - `clickChatCategoryHeader(name)`
  - `clickChatContextMenuBtn(name)`
  - `clickChatContextMenuItem(btnName)`
  - `closeChatHistoryPanel()`
  - `deleteChat(name)`
  - `deleteChatByIndex(index)`
  - `deleteCurrentChat()`
  - `getChatCount()`
  - `isChatCategoryOpen(name)`
  - `isChatCatgeoryPresent(name)`
  - `isChatCurrent(name)`
  - `isChatPartialNamePresent(partialName)`
  - `isChatPresent(name)`
  - `isHistoryPanelPresent()`
  - `renameChat(oldaName, newName)`
  - `searchChat(searchText)`
  - `switchToChat(name)`
- **Related components:** aiBotChatPanel, dossierAuthoringPage, historyPanel, libraryAuthoringPage, libraryPage

### MappingObjectInAgentTemplate
- **CSS root:** `.ant-table-container`
- **User-visible elements:**
  - Launch Button (`.mstrd-ReplaceObjectsDialog-launchBtn`)
  - Mapping Object Page (`.ant-modal-content`)
  - My Objects Panel (`.mstrd-DatasetView`)
  - Template Object Panel (`.ant-table-container`)
- **Component actions:**
  - `addColumnAlias(templateObject, alias)`
  - `checkMyObjectExistInTemplateObject(templateObjectName, myObjectName)`
  - `checkObjectMappedInMyObjectPanel(myObject)`
  - `clearSearchInMyObjectsPanel()`
  - `clickLaunchInAgentButton()`
  - `dragDropObjectToMapWith(myObjectName, templateObjectName)`
  - `getAliasTagByName(templateObject, aliasName)`
  - `getAliasTagsForTemplateObject(templateObject)`
  - `removeColumnAlias(templateObject, alias)`
  - `removeObjectFromMapWith(mapwithObjectName)`
  - `searchInMyObjectsPanel(searchTerm)`
- **Related components:** getMyObjectsPanel, getObjectByNameInMyObjectPanel, getSearchbarInMyObjectsPanel, getTemplateObjectPanel

### SnapshotCard
- **CSS root:** `.mstr-ai-chatbot-MainView-snapshotContainer`
- **User-visible elements:**
  - Confirm Delete Dialog (`.mstr-ai-chatbot-ConfirmationButton-dialog`)
  - Learning Tooltip (`.mstr-ai-chatbot-AnswerBubbleLearningBadges-popover`)
  - Move Dialog (`.mstr-ai-chatbot-MoveSnapshotButton-popover`)
  - Snapshot Container (`.mstr-ai-chatbot-MainView-snapshotContainer`)
  - Unread Icon (`.mstr-ai-chatbot-SnapshotCard-unread`)
- **Component actions:**
  - `cancelDelete()`
  - `clickAndGetTooltip(e)`
  - `clickAskAgainButton()`
  - `clickCopyButton()`
  - `clickDeleteButton()`
  - `clickDownloadButton()`
  - `clickExportCSVButton()`
  - `clickExportExcelButton()`
  - `clickLearningIndicator()`
  - `clickMaximizeButton()`
  - `clickMoveButton()`
  - `clickRenameSnapshotTitleButton()`
  - `clickSeeLessButton()`
  - `clickSeeMoreButton()`
  - `clickSnapshotOperations()`
  - `clickViewDetailsButton()`
  - `closeInterpretationButton()`
  - `confirmDelete()`
  - `copySnapshotTitle()`
  - `getSnapshotTitle()`
  - `hideSnapshotContent()`
  - `hoverAndGetTooltip(e)`
  - `hoverSnapshotOperations()`
  - `renameSnapshotTitle(newName)`
  - `selectMoveToCategory(categoryName)`
  - `setInterpretationText(value)`
  - `showInterpretationContent()`
- **Related components:** aiBotSnapshotsPanel, getSnapshotContainer

### SnapshotCategoryArea
- **CSS root:** `.mstr-ai-chatbot-CategoryMenuButton-content`
- **User-visible elements:**
  - Category Menu (`.mstr-ai-chatbot-CategoryMenuButton-content`)
  - Rename Input (`.mstr-ai-chatbot-SnapshotCategoryArea-titleInput`)
- **Component actions:**
  - `clickCollapseButton()`
  - `clickThreeDotsButton()`
  - `renameCategory(newName)`
- **Related components:** _none_

### SnapshotDialog
- **CSS root:** `.mstr-ai-chatbot-ConfirmationButton-dialog`
- **User-visible elements:**
  - Confirm Delete Dialog (`.mstr-ai-chatbot-ConfirmationButton-dialog`)
  - Interpretation Component (`.mstr-ai-chatbot-ChatInterpretationComponent`)
  - Learning Tooltip (`.mstr-ai-chatbot-AnswerBubbleLearningBadges-popover`)
  - Snapshot Dialog (`.mstr-ai-chatbot-SnapshotFocusView`)
- **Component actions:**
  - `cancelDelete()`
  - `clickCloseButton()`
  - `clickCopyButton()`
  - `clickDeleteButton()`
  - `clickDownloadButton()`
  - `clickExportCSVButton()`
  - `clickExportExcelButton()`
  - `clickInterpretationButton()`
  - `clickLearningIndicator()`
  - `clickLongContentButton()`
  - `clickSeeLessButton()`
  - `clickSeeMoreButton()`
  - `confirmDelete()`
  - `isInterpretationComponentDisplayed()`
  - `isLearningIndicatorDisplayed()`
  - `isRefLearningDisplayed()`
  - `isSnapshotDialogDisplayed()`
  - `isThumbdownIconDisplayed()`
  - `setInterpretationText(value)`
  - `setSavedTime(value)`
- **Related components:** _none_

### utils
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - _none_
- **Related components:** _none_

### WarningDialog
- **CSS root:** `.mstrmojo-Editor.mstrmojo-ConfirmSave-Editor.modal`
- **User-visible elements:**
  - Confirm Warning Dialog (`.mstrmojo-Editor.mstrmojo-ConfirmSave-Editor.modal`)
  - Save Success Message Box (`.ant-message-notice`)
- **Component actions:**
  - `checkCertifyCheckbox()`
  - `confirmCancel()`
  - `confirmDoNotSave()`
  - `confirmSave(expSuccess = true)`
  - `isCertifyCheckboxChecked()`
  - `isCertifyCheckboxPresent()`
  - `isDoNotSaveButtonPresent()`
- **Related components:** getPage

## Common Workflows (from spec.ts)

1. AIBot Dataset Settings (used in 10 specs)
2. [TC94506_5] Did you mean _ Bot Theme_I18N (used in 2 specs)
3. AIBotChatPanel OpenLinkInAnotherTab (used in 2 specs)
4. [Bot1.0_GUI_${test.case_id}] (used in 1 specs)
5. [TC91620] Verify i18n of AI data set panel strings and format (used in 1 specs)
6. [TC91643] Verify select/unselect attribute/metrics in data panel (used in 1 specs)
7. [TC91644] Verify no privilege error in data set panel (used in 1 specs)
8. [TC91645] Verify replace dataset to a new one in dataset panel (used in 1 specs)
9. [TC91646] Rename dataset in AI bot dataset panel (used in 1 specs)
10. [TC91647] Edit dataset in AI bot dataset panel (used in 1 specs)
11. [TC91648] Search data-attribute/metrics and dataset in search box in dataset panel (used in 1 specs)
12. [TC91750_1] long string in bot name, welcome page and link, tooltip (used in 1 specs)
13. [TC91750_10] topic in welcome page should not jump up and down when toggle data set to select all (used in 1 specs)
14. [TC91750_11] The suggestion should be hidden in welcome page when reach limit (used in 1 specs)
15. [TC91750_2] history and related suggestions UI, hover status and tooltip (used in 1 specs)
16. [TC91750_3] short string in bot name, message and link on toolbar (used in 1 specs)
17. [TC91750_4] different image types, link display format and theme (used in 1 specs)
18. [TC91750_5] collapsed link and open link from popover (used in 1 specs)
19. [TC91750_6] input box UI when QA count is >>, close to limit or == limit (used in 1 specs)
20. [TC91750_7] show most recent 30 msessages (used in 1 specs)
21. [TC91750_8] should not show suggestions when reach limit (used in 1 specs)
22. [TC91750_9] check logo for new created bots (used in 1 specs)
23. [TC91750] AI Bot premerge test (used in 1 specs)
24. [TC91751_1] create bot, chat and then save (used in 1 specs)
25. [TC91751_10] url api link to bot (used in 1 specs)
26. [TC91751_11] Ask question with snapshots (used in 1 specs)
27. [TC91751_2] link and clear history UI when snapshot panel closed (used in 1 specs)
28. [TC91751_3] open inactive bot in authoring mode and consumpation mode (used in 1 specs)
29. [TC91751_4] not in Library bot (used in 1 specs)
30. [TC91751_5] dark theme app with apply theme to all bots disabled (used in 1 specs)
31. [TC91751_6] red theme app with apply theme to all bots enabled (used in 1 specs)
32. [TC91751_7] suggestion refetch when change suggestion amount or dataset (used in 1 specs)
33. [TC91751_8] can not ask question when no data selected in data set (used in 1 specs)
34. [TC91751_9] Open consumption mode by contextual menu (used in 1 specs)
35. [TC91753_1] display under custom theme and I18N (used in 1 specs)
36. [TC91753_2] see more see less (used in 1 specs)
37. [TC91753_3] auto comlplete panel (used in 1 specs)
38. [TC91753_4] Thumb down display under custom theme and I18N (used in 1 specs)
39. [TC91753_5] learning display under custom theme and I18N (used in 1 specs)
40. [TC91753_6]Follow up display under custom theme and I18N (used in 1 specs)
41. [TC91817] Function [Library Web] Display visualization inside AI bot - Cross Functions (used in 1 specs)
42. [TC91818] i18N | Display visualization inside AI bot - UI translation and the e2e workflow in multiple languages. (used in 1 specs)
43. [TC91879] Verify no dataset ACL permission error in data set panel during edit/replace dataset (used in 1 specs)
44. [TC91913_1] responsive view of consumption mode (used in 1 specs)
45. [TC91913_2] responsive view of edit mode (used in 1 specs)
46. [TC91913_3] responsive view edit mode and consumption mode switch (used in 1 specs)
47. [TC91913_4] zoom in very small view (used in 1 specs)
48. [TC92027] Acceptance [Library Web] Verify the key function of visualization theming in AI bot. (used in 1 specs)
49. [TC92028] Acceptance [Library Web] Verify the key function of visualization theming in AI bot_DarkTheme. (used in 1 specs)
50. [TC92136] check dataset panel basic UI components (used in 1 specs)
51. [TC92176] Verify select All attribute/metrics in data panel (used in 1 specs)
52. [TC92177] Verify unselect All attribute/metrics in data panel (used in 1 specs)
53. [TC92179] Verify refresh dataset in AI bot dataset panel (used in 1 specs)
54. [TC92340] check dataset panel menu buttons with standalone dataset (used in 1 specs)
55. [TC92341] Check dataset panel menu buttons with managed dataset (used in 1 specs)
56. [TC92343] Verify replace dataset to a new one in dataset panel - standalone MTDI to managed MTDI (used in 1 specs)
57. [TC92347] Verify refresh dataset in AI bot dataset panel - File (used in 1 specs)
58. [TC92348] Verify cancel refresh dataset in AI bot dataset panel (used in 1 specs)
59. [TC92350] Verify no content error in data set panel (used in 1 specs)
60. [TC92351] Verify dataset not publish error in data set panel (used in 1 specs)
61. [TC92352] Verify not supported dataset - DDA error in data set panel (used in 1 specs)
62. [TC92353] Verify not supported dataset - report error in data set panel (used in 1 specs)
63. [TC92354] Verify deactivated dataset error in data set panel (used in 1 specs)
64. [TC92355] Verify cancel in replace dataset window of aibot dataset panel (used in 1 specs)
65. [TC92368_1] ai bot qa welcome page copy recommendation (used in 1 specs)
66. [TC92368_2] ai bot qa input question (used in 1 specs)
67. [TC92368_3] ai bot qa copy input question (used in 1 specs)
68. [TC92368_4] ai bot qa copy recommendation (used in 1 specs)
69. [TC92368_5] ai bot qa click recommendation (used in 1 specs)
70. [TC92368_6] ai bot qa auto complete (used in 1 specs)
71. [TC92368_7] ai bot qa copy auto complete (used in 1 specs)
72. [TC92368_8] cancel loading answer suggestion should show could clear history (used in 1 specs)
73. [TC92368_9] XSS from Chatbot chat input box when copy to query box is clicked (used in 1 specs)
74. [TC92369] Rename dataset in AI bot dataset panel - empty name (used in 1 specs)
75. [TC92370] Rename dataset in AI bot dataset panel - special character name (used in 1 specs)
76. [TC92371] Rename dataset in AI bot dataset panel - long name (used in 1 specs)
77. [TC92372] Verify replace dataset to a new one in dataset panel - managed MTDI to standalone (used in 1 specs)
78. [TC92381] Edit dataset in AI bot dataset panel - cancel and update (used in 1 specs)
79. [TC92386] Verify refresh dataset in AI bot dataset panel - clipboard (used in 1 specs)
80. [TC92388] Function [Library Web] Verify the cross function of visualization theming in AI bot. (used in 1 specs)
81. [TC92409] Edit dataset in AI bot dataset panel - cancel and update (used in 1 specs)
82. [TC92410] check dataset panel basic UI components (used in 1 specs)
83. [TC92411_01] Verify refresh dataset in AI bot dataset panel - unpublished sample data (used in 1 specs)
84. [TC92411] Verify refresh dataset in AI bot dataset panel - basic scenario (used in 1 specs)
85. [TC92412] Verify replace dataset to a new one in dataset panel - standalone OLAP to standalone MTDI (used in 1 specs)
86. [TC92413_2] Clear all snapshots (used in 1 specs)
87. [TC92413] SanityTestSnapshot pin search category (used in 1 specs)
88. [TC92414_1] AI Bot Snapshot: Check theme and sort (used in 1 specs)
89. [TC92414_2] AI Bot Snapshot: Rename snapshots (used in 1 specs)
90. [TC92414_3] AI Bot Snapshot: Rename snapshot title (used in 1 specs)
91. [TC92414_4] AI Bot Snapshot: Copy snapshot title (used in 1 specs)
92. [TC92415_1] SnapshotMap copy download (used in 1 specs)
93. [TC92415_2] SnapshotVisualization copy download (used in 1 specs)
94. [TC92416_1] AI Bot Snapshot: Check SnapshotPanelDisabled (used in 1 specs)
95. [TC92416_2] AI Bot Snapshot: Hit50Limit (used in 1 specs)
96. [TC92416_3] AI Bot Snapshot: EmptySnapshotPanel in different theme (used in 1 specs)
97. [TC92416_4] AI Bot Snapshot: Check snapshot in mobile view (used in 1 specs)
98. [TC92416_5] AI Bot Snapshot: Create new bot and check category (used in 1 specs)
99. [TC92416_6] AI Bot Snapshot: Check message for error viz (used in 1 specs)
100. [TC92475] Function | Display visualization inside AI bot - Cross Functions for Grid (used in 1 specs)
101. [TC92476] Function | Display visualization inside AI bot - Cross Functions for Bar (used in 1 specs)
102. [TC92477] Function | Display visualization inside AI bot - Cross Functions for Pie (used in 1 specs)
103. [TC92478] Function | Display visualization inside AI bot - Cross Functions for Heatmap (used in 1 specs)
104. [TC92479] Function | Display visualization inside AI bot - Cross Functions for Map (used in 1 specs)
105. [TC92480] Function | Display visualization inside AI bot - Cross Functions for KeyDrivers (used in 1 specs)
106. [TC92482] Function | Display visualization inside AI bot - Cross Functions for Trend (used in 1 specs)
107. [TC92483] Function | Display visualization inside AI bot - Cross Functions for Forecast (used in 1 specs)
108. [TC92549_2] After scroll, position does not change when the answer load out (used in 1 specs)
109. [TC92549_4] incrementally load chat history (used in 1 specs)
110. [TC92571_1] Check empty snapshot panel in Chinese (used in 1 specs)
111. [TC92571_2] Check chat answer and sort in Chinese (used in 1 specs)
112. [TC92571_3] Check snapshot card and dialog in Chinese (used in 1 specs)
113. [TC92571_4] Check empty snapshot panel in German (used in 1 specs)
114. [TC92571_5] Check chat answer and sort in German (used in 1 specs)
115. [TC92571_6] Check snapshot card and dialog in German (used in 1 specs)
116. [TC92573_1] Open consumption mode by content discovery (used in 1 specs)
117. [TC92573_2] Open edit mode by content discovery (used in 1 specs)
118. [TC93107_1] Show quota on consumption mode && switch mode (used in 1 specs)
119. [TC93107_2] Show quota on edit mode (used in 1 specs)
120. [TC93107_3] Show quota on add mode (used in 1 specs)
121. [TC93107_4] Error Handling -- when request failed, disable input (used in 1 specs)
122. [TC93243] number format - save change (used in 1 specs)
123. [TC93244_00] rename attribute - by right click with press enter (used in 1 specs)
124. [TC93244_01] rename attribute - by right click with click outside (used in 1 specs)
125. [TC93244_02] rename attribute - by double click with tab to rename (used in 1 specs)
126. [TC93244_03] rename metric - by right click with press tab (used in 1 specs)
127. [TC93244_04] rename metric - by double click and click outside + long name (used in 1 specs)
128. [TC93244_05] rename duplicate name show alert (used in 1 specs)
129. [TC93246_00] attribute format - check basic UI (used in 1 specs)
130. [TC93246_00] number format - check that the Number Format option is available. (used in 1 specs)
131. [TC93246_01] attribute format - check basic UI (used in 1 specs)
132. [TC93246_01] number format - check number format context menu default value (used in 1 specs)
133. [TC93246_02] attribute format - unselected data attribute form not available (used in 1 specs)
134. [TC93246_02] number format - change number format (used in 1 specs)
135. [TC93246_03] attribute format - unselect attribute form (used in 1 specs)
136. [TC93246_03] number format - change to different format (used in 1 specs)
137. [TC93246_04] attribute format - unselect attribute form cancel (used in 1 specs)
138. [TC93246_04] number format - cancel change (used in 1 specs)
139. [TC93246_05] attribute format - save change (used in 1 specs)
140. [TC93246_05] number format - check that the Number Format option is available. (used in 1 specs)
141. [TC93246_06] attribute format - unselect multiple forms (used in 1 specs)
142. [TC93246_07] attribute format - select attribute form (used in 1 specs)
143. [TC93246_08] attribute format - check basic UI (used in 1 specs)
144. [TC93312_00] number format - Number Format and Rename i18n (used in 1 specs)
145. [TC93312_01] number format - Number format container in Chinese (used in 1 specs)
146. [TC93312_02] number format - change number format (used in 1 specs)
147. [TC93312_03] rename duplicate name show alert with Chinese (used in 1 specs)
148. [TC93312_04] number format - Number Format and Rename i18n (used in 1 specs)
149. [TC93312_05] number format - Number Format and Rename i18n (used in 1 specs)
150. [TC93342_1] Check topic summary generation by clicking topic (used in 1 specs)
151. [TC93342_10] Check topic summary generation by clicking topic with MTDI cube with one attribute (used in 1 specs)
152. [TC93342_11] Check dataset metric object recommendation generation in bot with MTDI cube with one attribute (used in 1 specs)
153. [TC93342_12] Check dataset attribute object recommendation generation in bot with MTDI cube with one attribute (used in 1 specs)
154. [TC93342_13] Check dataset attribute object recommendation generation in bot with Intelligence cube without metric (used in 1 specs)
155. [TC93342_14] Check topic summary generation by clicking topic with Intelligence cube with one metric (used in 1 specs)
156. [TC93342_15] Check dataset metric object recommendation generation in bot with Intelligence cube with one metric (used in 1 specs)
157. [TC93342_16] Check dataset attribute object recommendation generation in bot with Intelligence cube with one metric (used in 1 specs)
158. [TC93342_17] Regenerate topic and check topic summary generation (used in 1 specs)
159. [TC93342_18] Regenerate dataset metric object recommendation (used in 1 specs)
160. [TC93342_19] Regenerate dataset attribute object recommendation (used in 1 specs)
161. [TC93342_2] Check dataset metric and attribute object recommendation generation in bot (used in 1 specs)
162. [TC93342_3] Check topic summary generation by clicking topic based on an intelligence cube (used in 1 specs)
163. [TC93342_4] Check dataset metric object recommendation generation in bot based on an intelligence cube (used in 1 specs)
164. [TC93342_5] Check dataset attribute object recommendation generation in bot based on an intelligence cube (used in 1 specs)
165. [TC93342_6] Check topic summary generated with language zh_CN by clicking topic (used in 1 specs)
166. [TC93342_7] Check dataset metric object recommendation generation in bot with languange setting zh-CN (used in 1 specs)
167. [TC93342_8] Check dataset attribute object recommendation generation in bot with languange setting zh-CN (used in 1 specs)
168. [TC93342_9] Check topic summary generation by clicking topic with MTDI cube without attribute (used in 1 specs)
169. [TC93344_1]render bot with history and open interpretation power user consumption mode (used in 1 specs)
170. [TC93344_2]render bot with history no mock and open interpretation normal user consumption mode (used in 1 specs)
171. [TC93344_3]ask question and open interpretation powser user edit mode (used in 1 specs)
172. [TC93344_4]Interpretation error handling (used in 1 specs)
173. [TC93344_5]Interpretation no mock (used in 1 specs)
174. [TC93546_1] NormalUser - show interpretation and close (used in 1 specs)
175. [TC93546_2] NormalUser - snapshot manipulations (search, sort) (used in 1 specs)
176. [TC93546_3] NormalUser - delete and add again (used in 1 specs)
177. [TC93546_4] NormalUser - ask again (used in 1 specs)
178. [TC93553_1] PowerUser - show interpretation and close (used in 1 specs)
179. [TC93553_2] PowerUser - snapshot manipulations (search, sort) (used in 1 specs)
180. [TC93553_3] PowerUser - focus view (view more/view less) (used in 1 specs)
181. [TC93553_4] PowerUser - snapshot manipulations (search, sort, copy/download) (used in 1 specs)
182. [TC93703] rename attribute&metrics - end to end save case (used in 1 specs)
183. [TC93972_1] E2E | e2EAQ_1 (used in 1 specs)
184. [TC93972_2] E2E | e2EAQ_2 (used in 1 specs)
185. [TC93979_1] ACC | vizSubtypeSQL_1 (used in 1 specs)
186. [TC93979_2] ACC | vizSubtypeSQL_2 (used in 1 specs)
187. [TC93979_3] ACC | vizSubtypeSQL_3 (used in 1 specs)
188. [TC93980_1] FUN | Follow up questions. (used in 1 specs)
189. [TC93980_2] FUN | Topic to show grid (used in 1 specs)
190. [TC93982_1] i18N | i18NQA_1 (used in 1 specs)
191. [TC93982_2] i18N | i18NQA_2 (used in 1 specs)
192. [TC94329_1] Show give me topics (used in 1 specs)
193. [TC94329_2] I18N | Show give me topic with bot theme (used in 1 specs)
194. [TC94506_1] Did you mean _ loading (used in 1 specs)
195. [TC94506_2] Did you mean _ smart suggestion (used in 1 specs)
196. [TC94506_3] Did you mean _ copy to query (used in 1 specs)
197. [TC94506_4] Did you mean _ Responsive View (used in 1 specs)
198. [TC94506_6] Did you mean _ Disabled when hit limitation (used in 1 specs)
199. [TC94506_7] Did you mean _ Disabled before question history is saved to MD successfully (used in 1 specs)
200. [TC94506_8] Did you mean _ should hide did you mean section when manipulation error (used in 1 specs)
201. [TC94506_9] Did you mean _ Error handling (used in 1 specs)
202. [TC94529_1] ACC| Certification for InsightTrend in AI bot. (used in 1 specs)
203. [TC94529_2] ACC| Certification for Forecast in AI bot. (used in 1 specs)
204. [TC94758_1]Thumb down consumption mode ask new question (used in 1 specs)
205. [TC94758_2]Thumb down consumption mode panel expand combined with interpretation and smart suggestion (used in 1 specs)
206. [TC94758_3]PA request for thumb down feature should be controlled by Client Telemetry setting (used in 1 specs)
207. [TC94758_4]Topic no thumb down button (used in 1 specs)
208. [TC94758_5]Click thumb down button with did you mean (used in 1 specs)
209. [TC94872] verify folder structure view menu in dataset panel with new data model (used in 1 specs)
210. [TC94873] verify select/unselect folder in dataset panel (used in 1 specs)
211. [TC94874] verify folder structure scrollbar in dataset panel with new data model (used in 1 specs)
212. [TC94875] verify replace dataset in dataset panel with new data model - OLAP -> FolderStructure (used in 1 specs)
213. [TC94914_1]Learning Basic UI (used in 1 specs)
214. [TC94914_10]Learning should be forgot when submit feedback before getting learning result (used in 1 specs)
215. [TC94914_11]Check learning request and response contents (used in 1 specs)
216. [TC94914_12]Learning no mock to check function triggered by thumb down (used in 1 specs)
217. [TC94914_13]Learning forgot request should not be sent when click thumb down before getting learning result and no nuggets ID (used in 1 specs)
218. [TC94914_2]No learning contents (used in 1 specs)
219. [TC94914_3]learning loading UI triggered by feedback (used in 1 specs)
220. [TC94914_4]learning loading UI triggered by smart suggestion (used in 1 specs)
221. [TC94914_5]Learning should be forgot when click thumb down after getting learning result (used in 1 specs)
222. [TC94914_6]Learning no mock to check function triggered by did you mearn (used in 1 specs)
223. [TC94914_7]Learning setting off (used in 1 specs)
224. [TC94914_8]Learning different user (used in 1 specs)
225. [TC94914_9]Learning should be forgot when click thumb down before getting learning result (used in 1 specs)
226. [TC94914] AI Bot Learning premerge test (used in 1 specs)
227. [TC94921] FUN | Validate the dropzone rules for Bar Chart inside AI Bot. (used in 1 specs)
228. [TC94922] FUN | Validate the dropzone rules for Line Chart inside AI Bot. (used in 1 specs)
229. [TC94923] FUN | Validate the dropzone rules for Pie Chart inside AI Bot. (used in 1 specs)
230. [TC94924] FUN | Validate the dropzone rules for Bubble Chart inside AI Bot. (used in 1 specs)
231. [TC94925] FUN | Validate the dropzone rules for Combo Chart inside AI Bot. (used in 1 specs)
232. [TC94926] FUN | Validate the dropzone rules for heatmap inside AI Bot. (used in 1 specs)
233. [TC94927] FUN | Validate the dropzone rules for mm KPI inside AI Bot. (used in 1 specs)
234. [TC94940] FUN | Validate the dropzone rules for map inside AI Bot. (used in 1 specs)
235. [TC94941] FUN | Validate the dropzone rules for grid inside AI Bot. (used in 1 specs)
236. [TC94945_1] ACC| vizSubtypeMultiPassSQL_1 (used in 1 specs)
237. [TC94945_2] ACC | vizSubtypeMultiPassSQL_2 (used in 1 specs)
238. [TC94945_3] ACC | vizSubtypeMultiPassSQL_3 (used in 1 specs)
239. [TC94985] AI Bot premerge test_Topic (used in 1 specs)
240. [TC94986] Add Topic message to snapshot (used in 1 specs)
241. [TC95288] verify folder structure view UI in dataset panel with new data model (used in 1 specs)
242. [TC95289] verify flat view menu in dataset panel with new data model (used in 1 specs)
243. [TC95290] verify flat view UI in dataset panel with new data model (used in 1 specs)
244. [TC95299] verify search dataset name in dataset panel with new data model (used in 1 specs)
245. [TC95304] verify select all folder in dataset panel (used in 1 specs)
246. [TC95305] verify unselect all folder in dataset panel (used in 1 specs)
247. [TC95332] Add thumbdown message to snapshot (used in 1 specs)
248. [TC95334] verify replace dataset in dataset panel with new data model - MTDI -> flat view (used in 1 specs)
249. [TC95336] verify replace dataset in dataset panel with new data model - folder structure to MTDI (used in 1 specs)
250. [TC95337] verify replace dataset in dataset panel with new data model - folder structure to folder structure (used in 1 specs)
251. [TC95338] verify unselect data in dataset panel - flat view (used in 1 specs)
252. [TC95342] verify select all in dataset panel - flat view (used in 1 specs)
253. [TC95343] verify search subfolder in dataset panel with new data model (used in 1 specs)
254. [TC95344] verify search data under folder (used in 1 specs)
255. [TC95345] verify search data with flat view (used in 1 specs)
256. [TC95564_1] Tap link in markdown answer (used in 1 specs)
257. [TC95564_2] Tap link in viz answer (used in 1 specs)
258. [TC95564_3] SaaS_Tap link in markdown answer (used in 1 specs)
259. [TC95564_4] SaaS_Tap link in viz answer (used in 1 specs)
260. [TC95800] Verify user privilege and dataset/data ACL handling with multiple datasets in bot (used in 1 specs)
261. [TC95801] certify i18n of new added message - UI change (used in 1 specs)
262. [TC95805] certify i18n of delete button (used in 1 specs)
263. [TC95806] verify flat view menu in dataset panel with multiple datasets (used in 1 specs)
264. [TC95808] Verify multiple datasets UI component - attribute linking (used in 1 specs)
265. [TC95824] pause mode when prompt dataset exist (used in 1 specs)
266. [TC95825_1] manipulation of grid in advanced mode and save (used in 1 specs)
267. [TC95825_2] check context menu (used in 1 specs)
268. [TC95826_1] add dataset in advanced mode (used in 1 specs)
269. [TC95826_2] modify dataset name and sort (used in 1 specs)
270. [TC95826_3] modify name of DA DM NDE (used in 1 specs)
271. [TC95827] tree view and pushdown (used in 1 specs)
272. [TC95831_1]Buttons in toolbar (used in 1 specs)
273. [TC95831_2]Quoted message in input area and question (used in 1 specs)
274. [TC95831_3]Revisit follow up answer (used in 1 specs)
275. [TC95831_4]Ask again with quoted message (used in 1 specs)
276. [TC95831_5]Reach limit (used in 1 specs)
277. [TC95831_6]XSS when copy to query box is clicked (used in 1 specs)
278. [TC95831]AI Bot follow up premerge test (used in 1 specs)
279. [TC95923] ACC| Certification for Histograms in AI bot. (used in 1 specs)
280. [TC96286] Verify manipulation on dataset panel with multiple datasets - delete dataset (used in 1 specs)
281. [TC96287] Verify multiple datasets UI component - folder structure view (used in 1 specs)
282. [TC96289] Verify multiple datasets UI component - complex view (used in 1 specs)
283. [TC96299] Verify manipulation on dataset panel with multiple datasets - replace to new (used in 1 specs)
284. [TC96300] Verify multiple datasets UI component - message (used in 1 specs)
285. [TC96301] Verify multiple datasets UI component - search (used in 1 specs)
286. [TC96302] Verify multiple datasets UI component - Advanced (used in 1 specs)
287. [TC96303] Verify multiple datasets UI component - search result (used in 1 specs)
288. [TC96304] Verify multiple datasets UI component - select/unselect (used in 1 specs)
289. [TC96305] Verify multiple datasets UI component - select/unselect all (used in 1 specs)
290. [TC96331_01] Check English for Different Bots (used in 1 specs)
291. [TC96331_02] Check Chinese (used in 1 specs)
292. [TC96331_03] Check Japanese (used in 1 specs)
293. [TC96365_1] Custom suggestion removed case consumption mode (used in 1 specs)
294. [TC96365_10] Suggestion expand manually consumption mode (used in 1 specs)
295. [TC96365_11] Suggestion expand manually edit mode - topic and ask about (used in 1 specs)
296. [TC96365_12] Suggestion expand manually - smart suggestion (used in 1 specs)
297. [TC96365_13] Suggestion collapse manually consumption mode (used in 1 specs)
298. [TC96365_14] Suggestion collapse manually edit mode - topic and ask about (used in 1 specs)
299. [TC96365_15] Suggestion collapse manually - smart suggestion (used in 1 specs)
300. [TC96365_16] Removed custom suggestion should show again after clearing history in responsive mode (used in 1 specs)
301. [TC96365_17]Custom suggestion should not be removed when replaced by auto suggestion (used in 1 specs)
302. [TC96365_2] Custom suggestion removed case edit mode (used in 1 specs)
303. [TC96365_3] Custom suggestions disappear after 2 questions consumption mode (used in 1 specs)
304. [TC96365_4] Custom suggestions disappear after 2 questions consumption mode ask about (used in 1 specs)
305. [TC96365_5] Custom suggestions disappear after 2 questions consumption mode topic (used in 1 specs)
306. [TC96365_6] Custom suggestions disappear after 2 questions edit mode (used in 1 specs)
307. [TC96365_7] Custom suggestions disappear after 2 questions edit mode ask about (used in 1 specs)
308. [TC96365_8] Custom suggestions disappear after 2 questions edit mode topic (used in 1 specs)
309. [TC96365_9] Custom suggestions disappear after 2 questions switch between edit mode and consumption mode (used in 1 specs)
310. [TC96371] Verify multiple datasets UI component - dark theme (used in 1 specs)
311. [TC96382] Verify manipulation on dataset panel with multiple datasets - replace datasets cancel (used in 1 specs)
312. [TC96383] Verify manipulation on dataset panel with multiple datasets - replace with listed dataset (used in 1 specs)
313. [TC96384] Verify manipulation on dataset panel with multiple datasets - rename (used in 1 specs)
314. [TC96385] Verify manipulation on dataset panel with multiple datasets - refresh (used in 1 specs)
315. [TC96399] certify i18n of new added error handling message - prompt report (used in 1 specs)
316. [TC96400] certify i18n of new added error handling message - DDA dataset (used in 1 specs)
317. [TC96401] certify i18n of new added error handling message - no matched result (used in 1 specs)
318. [TC96405] Verify multiple datasets UI component - edit dataset (used in 1 specs)
319. [TC96408] Verify error handling on dataset panel with multiple datasets - unselected all (used in 1 specs)
320. [TC96409] Verify error handling on dataset panel with multiple datasets - prompt report (used in 1 specs)
321. [TC96410] Verify error handling on dataset panel with multiple datasets - partially supported (used in 1 specs)
322. [TC96411] Verify error handling on dataset panel with multiple datasets - partially supported-replace (used in 1 specs)
323. [TC96425] Verify no dataset ACL permission error in data set panel during edit/replace dataset (used in 1 specs)
324. [TC96426] verify search data with flat view - no privileges (used in 1 specs)
325. [TC96427] verify search data with folder structure - no privileges (used in 1 specs)
326. [TC96433] Verify multiple datasets UI component - tooltip and object context menu (used in 1 specs)
327. [TC96447_1] Remove viz request and quoted question parents max length is 3 (used in 1 specs)
328. [TC96447_10] Explicitly follow up with open ended question (used in 1 specs)
329. [TC96447_2] templateAvailable will be false when viz deleted of the quoted question (used in 1 specs)
330. [TC96447_3] Follow up on topics answer (used in 1 specs)
331. [TC96447_4] Clear history should clear quoted question but NOT text in input box (used in 1 specs)
332. [TC96447_5] Edit or replace dataset or save bot should remove viz (used in 1 specs)
333. [TC96447_6] Ask again in smart suggestion (used in 1 specs)
334. [TC96447_7] Quoted questions in alternativeSuggestions (used in 1 specs)
335. [TC96447_8] Quoted questions in thumb down and smart suggestion learning (used in 1 specs)
336. [TC96447_9] Not explicitly follow up with open ended question (used in 1 specs)
337. [TC96757_1] ai bot suggestion panel _ multi word replacement (used in 1 specs)
338. [TC96757_2] ai bot suggestion panel _ single word replacement (used in 1 specs)
339. [TC96757_3] ai bot suggestion panel _ directly press enter (used in 1 specs)
340. [TC96757_4] ai bot suggestion panel _ delete characters (used in 1 specs)
341. [TC96757_5] ai bot suggestion panel _ paste and then type space (used in 1 specs)
342. [TC96757_6] ai bot suggestion panel _ delete whole token (used in 1 specs)
343. [TC96757_7] ai bot suggestion panel _ truncated element (used in 1 specs)
344. [TC96984_1]Learning Indicator Basic E2E (used in 1 specs)
345. [TC96984_2]Learning Indicator_Override Logic (used in 1 specs)
346. [TC96997]Learning Indicator Basic UI (used in 1 specs)
347. [TC96998]Learning Indicator Basic UI_ColorI8N (used in 1 specs)
348. [TC96999_1]Error handling: get FilteredNuggests Error (used in 1 specs)
349. [TC96999_2]Error handling: delete learning Error (used in 1 specs)
350. [TC96999_3]Error handling: Session timeout + forget learning in intepretaion (used in 1 specs)
351. [TC96999_4]Error handling: Session timeout + open learning manager (used in 1 specs)
352. [TC97471_1] Add message with learning indicator to snapshot (used in 1 specs)
353. [TC97471_2] Snasphot Learning indicator mobile view (used in 1 specs)
354. [TC97547] Function | Display visualization inside AI bot - Cross Functions for KPI (used in 1 specs)
355. [TC97548] Function | Display visualization inside AI bot - Cross Functions for Histogram (used in 1 specs)
356. [TC97675_1]Interpretation Learning Basic UI (used in 1 specs)
357. [TC97675_2]Sanity_LearningManagerOnBot_UI (used in 1 specs)
358. [TC97675_3]Learning Indicator Basic UI_ColorI8N (used in 1 specs)
359. [TC97752] Verify refresh dataset unpublished sample data - unpaused mode check (used in 1 specs)
360. ABot1.0 GUI (used in 1 specs)
361. AI Bot Chat Panel Cross Functions (used in 1 specs)
362. AI Bot Chat Panel Follow Up (used in 1 specs)
363. AI Bot Chat Panel General Display (used in 1 specs)
364. AI Bot Chat Panel I18N (used in 1 specs)
365. AI Bot Chat Panel Interpretation (used in 1 specs)
366. AI Bot Chat Panel Interpretation Learning (used in 1 specs)
367. AI Bot Chat Panel Learning (used in 1 specs)
368. AI Bot Chat Panel Learning Indicator_E2E (used in 1 specs)
369. AI Bot Chat Panel Learning Indicator_SessionTimout (used in 1 specs)
370. AI Bot Chat Panel Learning Indicator_UI (used in 1 specs)
371. AI Bot Chat Panel Smart Suggestion (used in 1 specs)
372. AI Bot Chat Panel Smart Suggestion_I18N (used in 1 specs)
373. AI Bot Chat Panel Suggestion Improvement (used in 1 specs)
374. AI Bot Chat Panel Thumb Down (used in 1 specs)
375. AI Bot Configuration Default String US567510 (used in 1 specs)
376. AIBot Dataset Settings - attrform (used in 1 specs)
377. AIBot Dataset Settings - AutoModelNoACL (used in 1 specs)
378. AIBot Dataset Settings - AutoModelNoPrivilege (used in 1 specs)
379. AIBot Dataset Settings - AutoModelReplace (used in 1 specs)
380. AIBot Dataset Settings - AutoModelScroll (used in 1 specs)
381. AIBot Dataset Settings - AutoModelSearch (used in 1 specs)
382. AIBot Dataset Settings - AutoModelSelect (used in 1 specs)
383. AIBot Dataset Settings - AutoModelUI (used in 1 specs)
384. AIBot Dataset Settings - i18n (used in 1 specs)
385. AIBot Dataset Settings - metricform (used in 1 specs)
386. AIBot Dataset Settings - rename (used in 1 specs)
387. AIBotChatPanel Generate Topic Summary (used in 1 specs)
388. AIBotChatPanel Generate Topic Summary Advanced (used in 1 specs)
389. AIBotChatPanel GiveMeTopics (used in 1 specs)
390. AIbotChatPanel Show Question quota on SaaS (used in 1 specs)
391. AIbotChatPanelPreMergeTest (used in 1 specs)
392. AIbotChatPanelQA (used in 1 specs)
393. AIbotChatPanelResponsiveView (used in 1 specs)
394. AIbotCopyDownloadTest (used in 1 specs)
395. AIbotSnapshot_Interpretation_NormalUser (used in 1 specs)
396. AIbotSnapshot_Interpretation_PowerUser (used in 1 specs)
397. AIbotSnapshot_LearningIndicator (used in 1 specs)
398. AIbotSnapshot_Thumbdown (used in 1 specs)
399. AIbotSnapshot_Topic (used in 1 specs)
400. AIbotSnapshot_xFunction (used in 1 specs)
401. AIbotSnapshotErrorHandling (used in 1 specs)
402. AIbotSnapshotI18NChinese (used in 1 specs)
403. AIbotSnapshotI18NGerman (used in 1 specs)
404. AIbotSnapshotPanel (used in 1 specs)
405. AIbotSnapshotPanel_GetBotData (used in 1 specs)
406. AIbotSnapshotSanity (used in 1 specs)
407. Analyst user (used in 1 specs)
408. Business user (used in 1 specs)
409. Chat Panel Ask Question History Scroll (used in 1 specs)
410. Chat Panel Content Discovery (used in 1 specs)
411. Chat Panel Follow Up Quoted Question (used in 1 specs)
412. ChatPanelMultiWordMatching (used in 1 specs)
413. ChatPanelVizDropzoneRule (used in 1 specs)
414. ChatPanelVizFunction (used in 1 specs)
415. ChatPanelVizI18N (used in 1 specs)
416. ChatPanelVizNewSubtype (used in 1 specs)
417. ChatPanelVizTheme (used in 1 specs)
418. dataset sync up scenarios (used in 1 specs)
419. mainpulation in advanced mode scenarios (used in 1 specs)
420. Mulitiple Datasets - error (used in 1 specs)
421. Mulitiple Datasets - i18n (used in 1 specs)
422. Mulitiple Datasets - noprivilege (used in 1 specs)
423. Multiple Datasets (used in 1 specs)
424. Multiple Datasets - UI (used in 1 specs)
425. Pause mode for prompt (used in 1 specs)
426. Reset_Example (used in 1 specs)
427. TC94410: [E2E] Basic workflow of Knowledge Nuggets in AI Bot (used in 1 specs)
428. TC95085: [ACC] Knowledge Nuggets in AI Bot (used in 1 specs)
429. TC95086: [FUN] Knowledge Nuggets in AI Bot (used in 1 specs)
430. Test certified knowledge nuggets in ai bot (used in 1 specs)
431. Test interpretation in chatbot (used in 1 specs)
432. Test interpretation in snapshot and maximize view and clear snapshot panel (used in 1 specs)
433. Test interpretation with dark mode and edit mode opened (used in 1 specs)
434. Test knowledge nuggets definition see more see less button (used in 1 specs)
435. Test knowledge nuggets definitions with scroll (used in 1 specs)
436. Test knowledge nuggets multiple definitions (used in 1 specs)
437. Test knowledge nuggets used in visualization (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getTitleBarLeft -- frequency: 186
2. getRecommendationByIndex -- frequency: 150
3. getInputBox -- frequency: 111
4. getDatasetNameText -- frequency: 88
5. getDatasetContainer -- frequency: 70
6. getTooltip -- frequency: 47
7. getWelcomePageBotImage -- frequency: 45
8. getRecommendationCount -- frequency: 43
9. getSnapshotCardByText -- frequency: 43
10. getMainView -- frequency: 42
11. getDidYouMeanPanel -- frequency: 40
12. getSmartSuggestion -- frequency: 38
13. getRecommendationTextsByIndex -- frequency: 36
14. getText -- frequency: 35
15. getMenuContainer -- frequency: 30
16. getInputBoxContainer -- frequency: 29
17. getLearningIndicator -- frequency: 28
18. getInputBoxText -- frequency: 23
19. getAutoCompleteArea -- frequency: 22
20. getFeedbackResults -- frequency: 17
21. getSmartSuggestionLoadingBar -- frequency: 17
22. getWelcomePage -- frequency: 16
23. getAskAboutSuggestedQuestions -- frequency: 15
24. getInterpretationContent -- frequency: 15
25. getToastbyMessage -- frequency: 15
26. getBubbleLoadingIcon -- frequency: 14
27. getRenameButton -- frequency: 14
28. getMySnapshotsPanel -- frequency: 13
29. getQueryTextByIndex -- frequency: 13
30. getStartConversationRecommendation -- frequency: 13
31. getDatasetPanel -- frequency: 12
32. getHintText -- frequency: 12
33. getTitleBar -- frequency: 12
34. getMarkDownByIndex -- frequency: 11
35. getSnapshotCategoryAreaByName -- frequency: 11
36. getFeedbackPanel -- frequency: 10
37. getInterpretationComponent -- frequency: 10
38. getAnswerBubbleButtonIconContainerbyIndex -- frequency: 9
39. getFeedbackResultPanel -- frequency: 9
40. getNoContentMessage -- frequency: 9
41. getRecommendations -- frequency: 9
42. getSnapshotDialog -- frequency: 9
43. getVizAnswerByIndex -- frequency: 9
44. getAnswerList -- frequency: 8
45. getAttributeMetric -- frequency: 8
46. getChatAnswerbyIndex -- frequency: 8
47. getDataContextMenu -- frequency: 8
48. getLearningForgetBtn -- frequency: 8
49. getNumberOfDisplayedSnapshotCard -- frequency: 8
50. getThumbdownIcon -- frequency: 8
51. getDataPanelContainer -- frequency: 7
52. getLearningForgottenIcon -- frequency: 7
53. getMarkDownAnswerCount -- frequency: 7
54. getNthParagraphOfTextAnswerFromEnd -- frequency: 7
55. getTopicItemsInChatPanel -- frequency: 7
56. getTopicsDescriptionTextByIndex -- frequency: 7
57. getTopicsTitleTextByIndex -- frequency: 7
58. getAnswerbyIndex -- frequency: 6
59. getAnswerLearningText -- frequency: 6
60. getCSSProperty -- frequency: 6
61. getDatasetCount -- frequency: 6
62. getDatasetPanelTitle -- frequency: 6
63. getEmptySnapshotPanel -- frequency: 6
64. getMenueItemCount -- frequency: 6
65. getNuggetTriggerIcon -- frequency: 6
66. getNumberFormatContainer -- frequency: 6
67. getRefreshContainer -- frequency: 6
68. getBottomButtonIconContainerbyIndex -- frequency: 5
69. getButtonFromToolbar -- frequency: 5
70. getClearHistoryConfirmationDialog -- frequency: 5
71. getConfirmationBtnOnForget -- frequency: 5
72. getCopyButton -- frequency: 5
73. getDeleteButton -- frequency: 5
74. getDownloadButton -- frequency: 5
75. getEnabledSmartSuggestion -- frequency: 5
76. getNuggetsPopoverContentDatasetTitle -- frequency: 5
77. getNuggetsPopoverContentDefinition -- frequency: 5
78. getQueryCount -- frequency: 5
79. getSearchContainer -- frequency: 5
80. getSortButton -- frequency: 5
81. getThumbDownLoadingSpinner -- frequency: 5
82. getAdvancedContainer -- frequency: 4
83. getChatPanelTopic -- frequency: 4
84. getConfigTabContainerByIndex -- frequency: 4
85. getCountOfTextAnswer -- frequency: 4
86. getHighlightedTextOfAutoCompleteionItem -- frequency: 4
87. getInterpretationButton -- frequency: 4
88. getInterpretationLearning -- frequency: 4
89. getLearningIndicatorHelpLink -- frequency: 4
90. getLinksPopoverContents -- frequency: 4
91. getMoveButton -- frequency: 4
92. getSnapshotCardInsideByText -- frequency: 4
93. getSortContent -- frequency: 4
94. getStartConversationBtn -- frequency: 4
95. getTextOfAutoCompleteionItem -- frequency: 4
96. getThumbDownIconbyIndex -- frequency: 4
97. getTitleBarBotNameTexts -- frequency: 4
98. getTopicTooltip -- frequency: 4
99. getVizDataLimitHint -- frequency: 4
100. getWelcomePageMessageTexts -- frequency: 4
101. getAskAboutPanel -- frequency: 3
102. getAskAboutPanelObjectByIndex -- frequency: 3
103. getChatAnswerByText -- frequency: 3
104. getDatasetOptionBtn -- frequency: 3
105. getDialogCloseButton -- frequency: 3
106. getDisclaimer -- frequency: 3
107. getHighlightMessage -- frequency: 3
108. getInterpretationContentText -- frequency: 3
109. getInterpretationNuggets -- frequency: 3
110. getLearningIndicatorDialog -- frequency: 3
111. getLearningManagerWindow -- frequency: 3
112. getLearningTooltip -- frequency: 3
113. getMaximizeButton -- frequency: 3
114. getNuggetsPopoverContent -- frequency: 3
115. getPinButton -- frequency: 3
116. getQueryByIndex -- frequency: 3
117. getQuotedMessageInInpuxBox -- frequency: 3
118. getTextAnswerByIndex -- frequency: 3
119. getTitleBarExternalLinkItemsByIndex -- frequency: 3
120. getToolBarMoreMenu -- frequency: 3
121. getVizByMatchFullTitle -- frequency: 3
122. Close Button -- frequency: 2
123. Confirm Delete Dialog -- frequency: 2
124. Confirm Warning Dialog -- frequency: 2
125. Edit Appearance Button -- frequency: 2
126. getAnswerLearning -- frequency: 2
127. getAskAboutBtn -- frequency: 2
128. getAskAboutPanelObjectList -- frequency: 2
129. getAttribute -- frequency: 2
130. getAttributeFormContainer -- frequency: 2
131. getCancelButton -- frequency: 2
132. getCategoryMenu -- frequency: 2
133. getConfirmDeleteDialog -- frequency: 2
134. getCopyToQueryBtnByIndex -- frequency: 2
135. getDatasetNameContainer -- frequency: 2
136. getDatasetPanelMenuBtn -- frequency: 2
137. getDuplicateNameAlertContainer -- frequency: 2
138. getErrorButton -- frequency: 2
139. getErrorIcon -- frequency: 2
140. getFollowUpCount -- frequency: 2
141. getForgetUserLearningLoadingColor -- frequency: 2
142. getForgottenTooltip -- frequency: 2
143. getInActiveBanner -- frequency: 2
144. getInsightLineIinfoWindow -- frequency: 2
145. getLearningManagerContent -- frequency: 2
146. getLocation -- frequency: 2
147. getMessageBox -- frequency: 2
148. getMessageBoxTitleText -- frequency: 2
149. getMoveDialog -- frequency: 2
150. getNewBotButton -- frequency: 2
151. getOKButton -- frequency: 2
152. getQueryMessageContentByIndex -- frequency: 2
153. getQuotedMessageByIndex -- frequency: 2
154. getSavedTime -- frequency: 2
155. getSearchInput -- frequency: 2
156. getSeeMoreSeeLessButton -- frequency: 2
157. getSmartSuggestionShowLessBtn -- frequency: 2
158. getSnapshotPanelContainer -- frequency: 2
159. getSnapshotPanelHeader -- frequency: 2
160. getSwitch -- frequency: 2
161. getTableRowNameFromTooltip -- frequency: 2
162. getTableRowValueFromTooltip -- frequency: 2
163. getThumbDownCount -- frequency: 2
164. getTimeText -- frequency: 2
165. getTopicsIcon -- frequency: 2
166. getTopicSuggestions -- frequency: 2
167. getVizTypeNameByTitle -- frequency: 2
168. getWelcomePageSeparator -- frequency: 2
169. getWelcomePageTitleTexts -- frequency: 2
170. Interpretation Component -- frequency: 2
171. Learning Tooltip -- frequency: 2
172. Save Success Message Box -- frequency: 2
173. Snapshots Loading Icon -- frequency: 2
174. Tooltip -- frequency: 2
175.  -- frequency: 1
176. 193 B67 -- frequency: 1
177. Account Icon In Toolbar -- frequency: 1
178. Active Toggle -- frequency: 1
179. Adaptive Learning Warning -- frequency: 1
180. ADCToolbar -- frequency: 1
181. Add New Bot Button -- frequency: 1
182. Add New Custom Suggestion Button -- frequency: 1
183. Add Prompt Btn -- frequency: 1
184. Add Rule Button -- frequency: 1
185. Advanced Container -- frequency: 1
186. Advanced Mode Button -- frequency: 1
187. Advenced Configuration Title -- frequency: 1
188. Ag Column Menu -- frequency: 1
189. Ag Column Pickdialog -- frequency: 1
190. Ai Diagnostics Dialog Close Icon -- frequency: 1
191. Ai Diagnostics Dialog Copy Icon -- frequency: 1
192. Ai Diagnostics Dialog Export Icon -- frequency: 1
193. AIBot Edit Loading -- frequency: 1
194. AIBot Panel -- frequency: 1
195. AIBot Toolbar -- frequency: 1
196. Alert -- frequency: 1
197. Answer List -- frequency: 1
198. Appearance Panel -- frequency: 1
199. Arrow Down On Save -- frequency: 1
200. Ask About -- frequency: 1
201. Ask About Btn -- frequency: 1
202. Ask About Panel -- frequency: 1
203. Ask About Panel Object List -- frequency: 1
204. Ask About Panel Search Box -- frequency: 1
205. Attribute Form Container -- frequency: 1
206. Auto Complete Area -- frequency: 1
207. Auto Complete Content -- frequency: 1
208. Auto Complete Header -- frequency: 1
209. Auto Generated Suggestion Limit Drop Down Trigger -- frequency: 1
210. Bot Alias Warning -- frequency: 1
211. Bot Authoring Container -- frequency: 1
212. Bot Config Container -- frequency: 1
213. Bot Config Dataset Description -- frequency: 1
214. Bot Consumption Contaniner -- frequency: 1
215. Bot Consumption Toolbar -- frequency: 1
216. Bot Edit Layout -- frequency: 1
217. Bot Info Section -- frequency: 1
218. Bot Name -- frequency: 1
219. Bot Name Input -- frequency: 1
220. Bot Name Invalid Input Warning Icon -- frequency: 1
221. Bot Name Segment In Toolbar -- frequency: 1
222. Bot Title -- frequency: 1
223. Bot2 Cancel Loading Answer Button -- frequency: 1
224. Bot2 Welcome Page -- frequency: 1
225. Bubble Loading Icon -- frequency: 1
226. Bucket Context Menu Container -- frequency: 1
227. Bucket Group List -- frequency: 1
228. Bucket Panel -- frequency: 1
229. Bucket Pin Title -- frequency: 1
230. C1292 F -- frequency: 1
231. Cache Manager Page -- frequency: 1
232. Cache Setting Backdrop -- frequency: 1
233. Cache Setting Icon -- frequency: 1
234. Cache Settings Dialog -- frequency: 1
235. Caching Mode Dropdown -- frequency: 1
236. Cancel Btn -- frequency: 1
237. Cancel Button -- frequency: 1
238. Cancel In Attribute Form -- frequency: 1
239. Cancel Loading Answer Button -- frequency: 1
240. Category List Panel -- frequency: 1
241. Category Menu -- frequency: 1
242. Certify Icon -- frequency: 1
243. Certify Tooltip -- frequency: 1
244. Chat Bot Loading Icon -- frequency: 1
245. Chat Bot Max Question Quota -- frequency: 1
246. Chat Bot Pin Icon -- frequency: 1
247. Chat Bot Send Icon -- frequency: 1
248. Chat Bot Title Bar External Link Container -- frequency: 1
249. Chat List -- frequency: 1
250. Chat Panel -- frequency: 1
251. Chat Panel Container -- frequency: 1
252. Chat Panel Topic -- frequency: 1
253. Chat Panel Topics -- frequency: 1
254. Chat Panel Topics Title -- frequency: 1
255. Clear History Button -- frequency: 1
256. Clear History Confirmation Dialog -- frequency: 1
257. Clear History No Button -- frequency: 1
258. Clear Search Btn -- frequency: 1
259. Clear Search Icon -- frequency: 1
260. Clear Snapshots Controller -- frequency: 1
261. Close Btn -- frequency: 1
262. Close Btn In Warning Dialog -- frequency: 1
263. Close Cache Manager Button -- frequency: 1
264. Close Quoted Message Icon -- frequency: 1
265. Close Snapshot Added Button -- frequency: 1
266. Close Snapshot Button -- frequency: 1
267. Collapse Arrow -- frequency: 1
268. Column Container -- frequency: 1
269. Config Prompt Title -- frequency: 1
270. Config Tabs Header Container -- frequency: 1
271. Config Tabs List -- frequency: 1
272. Confirm Clear Snapshots Button -- frequency: 1
273. Confirm Delete Container -- frequency: 1
274. Confirm Override Dialog -- frequency: 1
275. Confirm Save Dialog -- frequency: 1
276. Content Loading Icon -- frequency: 1
277. Cover Image Container -- frequency: 1
278. Cover Image Edit Button -- frequency: 1
279. Cover Spinner -- frequency: 1
280. Create New Bucket Option -- frequency: 1
281. Currency Tab Button -- frequency: 1
282. Current Chat -- frequency: 1
283. Custom Instructions Switch -- frequency: 1
284. Data Context Menu -- frequency: 1
285. Data Panel Container -- frequency: 1
286. Dataset Container -- frequency: 1
287. Dataset Dropdown Icon -- frequency: 1
288. Dataset List -- frequency: 1
289. Dataset Name Container -- frequency: 1
290. Dataset Name Input -- frequency: 1
291. Dataset Object Context Menu -- frequency: 1
292. Dataset Panel -- frequency: 1
293. Dataset Panel Title -- frequency: 1
294. Dataset Selector -- frequency: 1
295. Dataset Title Bar -- frequency: 1
296. Dataset Warning Dialog -- frequency: 1
297. Dataset Warning Dialog Header -- frequency: 1
298. Decertify Button -- frequency: 1
299. Delete Caches Button -- frequency: 1
300. Delete Chat Confirmation Dialog -- frequency: 1
301. Dialog Close Button -- frequency: 1
302. Did You Mean Close Button -- frequency: 1
303. Did You Mean Panel -- frequency: 1
304. Disabled Input Box Container -- frequency: 1
305. Disabled Recommendation Fold State Btn -- frequency: 1
306. Disabled Send Icon -- frequency: 1
307. Disabled Topics Icon -- frequency: 1
308. Disclaimer -- frequency: 1
309. Download Learning Button -- frequency: 1
310. Download Learning Error -- frequency: 1
311. Download Learning Info Icon -- frequency: 1
312. Download Learning Section -- frequency: 1
313. Download Learning Title -- frequency: 1
314. Draggable Rule Editing Container -- frequency: 1
315. Draggable Rule When Input -- frequency: 1
316. Dropdown -- frequency: 1
317. Duplicate Btn -- frequency: 1
318. Duplicate Name Alert Container -- frequency: 1
319. Duplicatebtn In Save Change Confirm Dialog -- frequency: 1
320. Edit Button -- frequency: 1
321. Edit Cover Image Dialog -- frequency: 1
322. Edit Cover Image Pen Icon -- frequency: 1
323. Edit Page -- frequency: 1
324. Edit Title -- frequency: 1
325. Editing Icon In Authoring Bot Toolbar -- frequency: 1
326. Editor Btns With Save Btn -- frequency: 1
327. Editor Cover Image -- frequency: 1
328. Editor Curtain Mask -- frequency: 1
329. Embed Bot Dialog Container -- frequency: 1
330. Empty Content -- frequency: 1
331. Empty Snapshot Image -- frequency: 1
332. Empty Snapshot Panel -- frequency: 1
333. Error Icon -- frequency: 1
334. Error Message Arrow -- frequency: 1
335. Execute Acl Warning -- frequency: 1
336. Export To Csv Button -- frequency: 1
337. Export To Excel Button -- frequency: 1
338. Feedback Results -- frequency: 1
339. Filter Dropdown Trigger -- frequency: 1
340. Filter Operator Dropdown Trigger -- frequency: 1
341. Filter Value Input -- frequency: 1
342. Filter When Input -- frequency: 1
343. Fiscal Year Settings -- frequency: 1
344. Fiscal Year Switch -- frequency: 1
345. Follow Up Error -- frequency: 1
346. Forget User Learning Loading -- frequency: 1
347. Forgotten Tooltip -- frequency: 1
348. General Item Editing Container -- frequency: 1
349. Generl Settings Container -- frequency: 1
350. getAnswerCount -- frequency: 1
351. getAutoCompleteItembyIndex -- frequency: 1
352. getCategoryCount -- frequency: 1
353. getChatPanel -- frequency: 1
354. getClearSnapshotsController -- frequency: 1
355. getCloseButton -- frequency: 1
356. getContextMenuByLevel -- frequency: 1
357. getDatasetByName -- frequency: 1
358. getDisabledTopicsIcon -- frequency: 1
359. getDotInSnapshotPanelButton -- frequency: 1
360. getElement -- frequency: 1
361. getErrorMessageDialog -- frequency: 1
362. getFeedbackResultsText -- frequency: 1
363. getFollowUpError -- frequency: 1
364. getGenerlSettingsContainer -- frequency: 1
365. getGreetingInputBox -- frequency: 1
366. getInterpretationComponents -- frequency: 1
367. getInterpretationContentTitle -- frequency: 1
368. getInterpretedAsText -- frequency: 1
369. getKnowledgeSection -- frequency: 1
370. getLastQueryText -- frequency: 1
371. getLearningCheckingText -- frequency: 1
372. getLearningIcon -- frequency: 1
373. getLearningManagerNoDataWindow -- frequency: 1
374. getLibraryViewContainer -- frequency: 1
375. getLinkSection -- frequency: 1
376. getLinksPopoverButton -- frequency: 1
377. getLoginButton -- frequency: 1
378. getMarkDownTextByIndex -- frequency: 1
379. getNuggetsPopoverContentDatasetTitleFromMaximizeView -- frequency: 1
380. getNuggetsPopoverContentDefinitionFromMaximizeView -- frequency: 1
381. getOpenSnapshotPanelButton -- frequency: 1
382. getPaletteSelectPanel -- frequency: 1
383. getPinButtonOfNthChatAnswer -- frequency: 1
384. getQuotedQuestionInInpuxBox -- frequency: 1
385. getRecommendationFoldStateBtn -- frequency: 1
386. getRecommendationRefreshIcon -- frequency: 1
387. getRecommendationTitle -- frequency: 1
388. getRelatedSuggestionArea -- frequency: 1
389. getSaveButton -- frequency: 1
390. getSeeMoreLessBtnSnapshotPanel -- frequency: 1
391. getSelectBox -- frequency: 1
392. getSmartSuggestionCopyIcon -- frequency: 1
393. getSnapshotCardByIndex -- frequency: 1
394. getSnapshotContent -- frequency: 1
395. getSnapshotNuggetsPopoverContentDatasetTitle -- frequency: 1
396. getSnapshotNuggetsPopoverContentDefinition -- frequency: 1
397. getSnapshotOperations -- frequency: 1
398. getSnapshotTitle -- frequency: 1
399. getTime -- frequency: 1
400. getTopicByIndex -- frequency: 1
401. getTopicsCount -- frequency: 1
402. getTopicSuggestionTitleTexts -- frequency: 1
403. getUnpinButtonOfNthChatAnswer -- frequency: 1
404. getUploadFilePage -- frequency: 1
405. getVisualizationMenuButton -- frequency: 1
406. getWelcomePageBotIcon -- frequency: 1
407. Greeting Count -- frequency: 1
408. Greeting Input Box -- frequency: 1
409. Greeting Section -- frequency: 1
410. Highlight Message -- frequency: 1
411. History Panel -- frequency: 1
412. History Panel Button -- frequency: 1
413. In Active Banner -- frequency: 1
414. Inactive Banner -- frequency: 1
415. Inactive Banner Message -- frequency: 1
416. Input Box -- frequency: 1
417. Input Box Container -- frequency: 1
418. Input Box In Teams -- frequency: 1
419. Input Box Text -- frequency: 1
420. Input Topics -- frequency: 1
421. Insight Line Chart Info Icon -- frequency: 1
422. Insight Line Iinfo Window -- frequency: 1
423. Interpretation Copy LLMInstructions Icon -- frequency: 1
424. Interpretation Copy To Query Disable Icon -- frequency: 1
425. Interpretation Copy To Query Icon -- frequency: 1
426. Interpretation Learning -- frequency: 1
427. Interpretation Loading Spinner -- frequency: 1
428. Interpretation Reload Button -- frequency: 1
429. Interpretation See More Btn -- frequency: 1
430. Interpretation Text -- frequency: 1
431. Interpreted As -- frequency: 1
432. Interpreted As Text -- frequency: 1
433. Knowledge Section -- frequency: 1
434. Last Downloaded Time -- frequency: 1
435. Last Downloaded Time Label -- frequency: 1
436. Launch Button -- frequency: 1
437. Learning Checking Text -- frequency: 1
438. Learning Forget Btn -- frequency: 1
439. Learning Icon -- frequency: 1
440. Learning Indicator Dialog -- frequency: 1
441. Learning Indicator Help Link -- frequency: 1
442. Learning Manager No Data Window -- frequency: 1
443. Learning Manager Window -- frequency: 1
444. Library Icon -- frequency: 1
445. Limits Section -- frequency: 1
446. Link Indicator -- frequency: 1
447. Link Section -- frequency: 1
448. Links Popover Button -- frequency: 1
449. Links Popover Contents -- frequency: 1
450. Loading History Span -- frequency: 1
451. Loading History Text -- frequency: 1
452. Loading Icon In Clear History -- frequency: 1
453. Main View -- frequency: 1
454. Manage Rules Title -- frequency: 1
455. Mapping Object Page -- frequency: 1
456. Maximize Button From Snapshot -- frequency: 1
457. Menu Button -- frequency: 1
458. Menu Container -- frequency: 1
459. Message Box Container -- frequency: 1
460. Message List -- frequency: 1
461. Message Scroll Component -- frequency: 1
462. Mobile Close Ask About Button -- frequency: 1
463. Mobile Close Snapshot Button -- frequency: 1
464. Mobile Hamburger Button -- frequency: 1
465. Mobile Slider Menu -- frequency: 1
466. Mobile View Clear History No Button -- frequency: 1
467. Mobile View Clear History Yes Button -- frequency: 1
468. Mode Switcher -- frequency: 1
469. Move Dialog -- frequency: 1
470. My Objects Panel -- frequency: 1
471. My Snapshots Panel -- frequency: 1
472. New Chat Button -- frequency: 1
473. New Dataset Selector Diag -- frequency: 1
474. New DIPage -- frequency: 1
475. New DIPage Search -- frequency: 1
476. No Match Content -- frequency: 1
477. Notification Save Button -- frequency: 1
478. Nugget Content -- frequency: 1
479. Nugget Trigger Icon -- frequency: 1
480. Nuggets Popover Content Dataset Title -- frequency: 1
481. Nuggets Popover Content Definition -- frequency: 1
482. Number Format -- frequency: 1
483. Number Format Container -- frequency: 1
484. Ok Button -- frequency: 1
485. OKButton -- frequency: 1
486. OKButton In Attribute Forms -- frequency: 1
487. OKIn Attribute Form -- frequency: 1
488. Open Snapshot Panel Button -- frequency: 1
489. Optional Features Section -- frequency: 1
490. Palette Select Indicator -- frequency: 1
491. Palette Select Panel -- frequency: 1
492. Palettes Selector -- frequency: 1
493. Panel Error Icon -- frequency: 1
494. Panel Theme Select -- frequency: 1
495. Popup Container -- frequency: 1
496. Prompt Gallery Panel -- frequency: 1
497. Question Answer Panel -- frequency: 1
498. Question Context Menu -- frequency: 1
499. Question Details Panel -- frequency: 1
500. Question Input Hint Input Box -- frequency: 1
501. Question Input Section -- frequency: 1
502. Question Panel -- frequency: 1
503. Question Sugestions Section -- frequency: 1
504. Quoted Message Close Button -- frequency: 1
505. Quoted Message In Inpux Box -- frequency: 1
506. Quoted Question In Inpux Box -- frequency: 1
507. Recommendation Expand State Btn -- frequency: 1
508. Recommendation Fold State Btn -- frequency: 1
509. Recommendation List -- frequency: 1
510. Recommendation Refresh Icon -- frequency: 1
511. Recommendation Title -- frequency: 1
512. Recommendation Title Object Name -- frequency: 1
513. Recommendations -- frequency: 1
514. Refresh Container -- frequency: 1
515. Refresh Done Icon -- frequency: 1
516. Refresh Page -- frequency: 1
517. Related Suggestion Area -- frequency: 1
518. Rename Error -- frequency: 1
519. Rename Input -- frequency: 1
520. Replace Dialog Header -- frequency: 1
521. Replace Loading Icon -- frequency: 1
522. Replace Second Loading Icon -- frequency: 1
523. Resize Handler Of Configuration Panel -- frequency: 1
524. Resize Handler Of Snapshot Panel -- frequency: 1
525. Response Tooltip -- frequency: 1
526. Rules List -- frequency: 1
527. Sample File Content Container -- frequency: 1
528. Save As Btn -- frequency: 1
529. Save As Dropdown -- frequency: 1
530. Save As Dropdown From Bot -- frequency: 1
531. Save As Editor -- frequency: 1
532. Save Bot Drop Down -- frequency: 1
533. Save Btn -- frequency: 1
534. Save Button -- frequency: 1
535. Save Dialog -- frequency: 1
536. Save In Progress Box -- frequency: 1
537. Savebtn In Save Change Confirm Dialog -- frequency: 1
538. Saving Modal View -- frequency: 1
539. Search Box In Edit -- frequency: 1
540. Search Container -- frequency: 1
541. Search Icon -- frequency: 1
542. Search In Replace Dialog Container -- frequency: 1
543. Search Input For Dropdown -- frequency: 1
544. See More Less Btn -- frequency: 1
545. Select All In Refresh -- frequency: 1
546. Select Count -- frequency: 1
547. Send Icon -- frequency: 1
548. Send Icon In Teams -- frequency: 1
549. Share Button In Toolbar -- frequency: 1
550. Show Error Message -- frequency: 1
551. Smart Suggestion Copy Icon -- frequency: 1
552. Smart Suggestion Loading Bar -- frequency: 1
553. Snapshot Added Success Toast -- frequency: 1
554. Snapshot Container -- frequency: 1
555. Snapshot Delete Confirmation Button -- frequency: 1
556. Snapshot Dialog -- frequency: 1
557. Snapshot Focus View Close Button -- frequency: 1
558. Snapshot Items -- frequency: 1
559. Snapshot Nuggets Popover Content Dataset Title -- frequency: 1
560. Snapshot Panel -- frequency: 1
561. Snapshot Panel Container -- frequency: 1
562. Snapshot Panel Header -- frequency: 1
563. Sort Button -- frequency: 1
564. Sort Content -- frequency: 1
565. Sort Menu -- frequency: 1
566. SQLDialog -- frequency: 1
567. SQLOutput Panel -- frequency: 1
568. Start Conversation Btn -- frequency: 1
569. Start Conversation Recommendation -- frequency: 1
570. Success Toast -- frequency: 1
571. Switch -- frequency: 1
572. Table -- frequency: 1
573. Template Object Panel -- frequency: 1
574. Text Link To Bot -- frequency: 1
575. Theme Selector -- frequency: 1
576. Theme Tooltip -- frequency: 1
577. Thumb Down Loading Spinner -- frequency: 1
578. Time -- frequency: 1
579. Time In Snapshot -- frequency: 1
580. Time Text -- frequency: 1
581. Title Bar -- frequency: 1
582. Title Bar Bot Logo -- frequency: 1
583. Title Bar Bot Name -- frequency: 1
584. Title Bar Divider -- frequency: 1
585. Title Bar External Link -- frequency: 1
586. Title Bar External Link Container -- frequency: 1
587. Title Bar Left -- frequency: 1
588. To Bottom Btn -- frequency: 1
589. Toast -- frequency: 1
590. Toast Notification -- frequency: 1
591. Tool Bar Copy As Image Icon -- frequency: 1
592. Tool Bar Down Load Icon -- frequency: 1
593. Tool Bar More Menu -- frequency: 1
594. Tooltip Container -- frequency: 1
595. Topic Section -- frequency: 1
596. Topic Tooltip -- frequency: 1
597. Topics Icon -- frequency: 1
598. Total Auto Generate Suggestion Limit -- frequency: 1
599. Total Learning Captured -- frequency: 1
600. Total Learning Captured Label -- frequency: 1
601. Unpin Icon -- frequency: 1
602. Unread Icon -- frequency: 1
603. Unstructured Data Tooltip -- frequency: 1
604. Unstructured Data Tooltip Download Button -- frequency: 1
605. Unstructured Data Tooltip Download Spinner -- frequency: 1
606. Update Dataset Button -- frequency: 1
607. Upload File Page -- frequency: 1
608. Usage Content -- frequency: 1
609. Usage Date Range Dropdown -- frequency: 1
610. Usage Download Button -- frequency: 1
611. Usage Download Error Details -- frequency: 1
612. Usage Download Failed Message -- frequency: 1
613. Usage Download Failed Message Dashboard -- frequency: 1
614. Usage Download Failed Ok Button -- frequency: 1
615. Usage Download Failed Ok Button Dashboard -- frequency: 1
616. Usage Panel Header -- frequency: 1
617. Usage Panel Message -- frequency: 1
618. View SQLLink -- frequency: 1
619. Viz Answer Bubble List -- frequency: 1
620. Viz Bubble -- frequency: 1
621. Viz Loading Curtain -- frequency: 1
622. Viz Loading Spinner -- frequency: 1
623. Web Management Setting -- frequency: 1
624. Welcome Page -- frequency: 1
625. Welcome Page Bot Icon -- frequency: 1
626. Welcome Page Bot Image -- frequency: 1
627. Welcome Page Greeting Title -- frequency: 1
628. Welcome Page Message -- frequency: 1
629. Welcome Page Separator -- frequency: 1
630. Welcome Page Title -- frequency: 1
631. xls -- frequency: 1

## Key Actions

- `waitForElementVisible()` -- used in 509 specs
- `waitForAnswerLoading()` -- used in 227 specs
- `log()` -- used in 220 specs
- `clearHistory()` -- used in 200 specs
- `openBotById()` -- used in 187 specs
- `getTitleBarLeft()` -- used in 186 specs
- `waitForCurtainDisappear()` -- used in 184 specs
- `isDisplayed()` -- used in 173 specs
- `getRecommendationByIndex()` -- used in 150 specs
- `selectBotConfigTabByName(name)` -- used in 146 specs
- `editBotByUrl()` -- used in 134 specs
- `getInputBox()` -- used in 111 specs
- `typeKeyboard()` -- used in 104 specs
- `login()` -- used in 99 specs
- `getDatasetNameText(index = 0)` -- used in 88 specs
- `clickRecommendationByIndex(Index)` -- used in 78 specs
- `clickSendIcon()` -- used in 78 specs
- `getText()` -- used in 78 specs
- `checkVizByImageComparison(testCase, imageName, index = 0)` -- used in 73 specs
- `getDatasetContainer()` -- used in 70 specs
- `askQuestion(question, waitViz = false, options = { timeout: this.DEFAULT_LOADING_TIMEOUT })` -- used in 69 specs
- `clickOpenSnapshotPanelButton()` -- used in 62 specs
- `parse()` -- used in 62 specs
- `pause()` -- used in 61 specs
- `mock()` -- used in 59 specs
- `clearHistoryAndAskQuestion(imageFolder, vizType, aiEntry = 'bot')` -- used in 58 specs
- `openDefaultApp()` -- used in 58 specs
- `goToLibrary()` -- used in 48 specs
- `getTooltip()` -- used in 47 specs
- `checkOrUncheckData(elem)` -- used in 46 specs
- `getSnapshotCardByText()` -- used in 45 specs
- `getWelcomePageBotImage()` -- used in 45 specs
- `openDossier()` -- used in 44 specs
- `getRecommendationCount()` -- used in 43 specs
- `getMainView()` -- used in 42 specs
- `getDidYouMeanPanel()` -- used in 40 specs
- `getSmartSuggestion()` -- used in 38 specs
- `getRecommendationTextsByIndex()` -- used in 36 specs
- `sleep()` -- used in 35 specs
- `waitForInterpretationLoading()` -- used in 35 specs
- `isExisting()` -- used in 34 specs
- `clickEditButton()` -- used in 32 specs
- `clickManipulateButtonDisplayed(button)` -- used in 31 specs
- `mockRestoreAll()` -- used in 31 specs
- `clickExpandRecommendation()` -- used in 30 specs
- `clickMojoPageButton(button)` -- used in 30 specs
- `getMenuContainer()` -- used in 30 specs
- `waitForElementInvisible()` -- used in 30 specs
- `getInputBoxContainer()` -- used in 29 specs
- `openBotByIdAndWait()` -- used in 29 specs
- `getLearningIndicator()` -- used in 28 specs
- `isSnapshotPanelClosed()` -- used in 28 specs
- `searchByText(text)` -- used in 28 specs
- `openCustomAppById()` -- used in 26 specs
- `readFileSync()` -- used in 26 specs
- `rightClickOnDataName(data)` -- used in 26 specs
- `scrollChatPanelToTop()` -- used in 26 specs
- `waitForReplacePageLoading()` -- used in 26 specs
- `setSortBy(sortBy)` -- used in 25 specs
- `clickMenuButtonForDataset(name)` -- used in 24 specs
- `clickLibraryIcon()` -- used in 23 specs
- `getInputBoxText()` -- used in 23 specs
- `hoverTextOnlyChatAnswer(Index)` -- used in 23 specs
- `clearSearch()` -- used in 22 specs
- `getAutoCompleteArea()` -- used in 22 specs
- `actionOnToolbar()` -- used in 21 specs
- `hoverAndGetTooltip(e)` -- used in 21 specs
- `copyRecommendationToQuery(index)` -- used in 20 specs
- `exitBotAuthoring()` -- used in 20 specs
- `checkVizInSnapshotPanel(testCase, imageName, index = 0)` -- used in 19 specs
- `clickSmartSuggestion(index)` -- used in 19 specs
- `switchToAdvancedMode()` -- used in 19 specs
- `clickFeedbackTabByName(name, index = 0)` -- used in 18 specs
- `stringify()` -- used in 18 specs
- `waitForTextAppearInDataSetPanel(text)` -- used in 18 specs
- `closeTab()` -- used in 17 specs
- `getFeedbackResults()` -- used in 17 specs
- `getSmartSuggestionLoadingBar()` -- used in 17 specs
- `hoverChatAnswertoClickFollowUpbyIndex(markDownIndex = 0, followUpIndex = 0)` -- used in 17 specs
- `isErrorIconDisplayed()` -- used in 17 specs
- `switchToTab()` -- used in 17 specs
- `waitForCoverSpinnerDismiss()` -- used in 17 specs
- `writeFileSync()` -- used in 17 specs
- `clickMaximizeButton()` -- used in 16 specs
- `clickReplacePageButton(button)` -- used in 16 specs
- `clickSendBtn()` -- used in 16 specs
- `forEach()` -- used in 16 specs
- `getWelcomePage()` -- used in 16 specs
- `isAutoCompleteAreaDisplayed()` -- used in 16 specs
- `isTooltipDisplayed()` -- used in 16 specs
- `openBotAndOpenSnapshot({ botId: botId })` -- used in 16 specs
- `openMenu()` -- used in 16 specs
- `waitForCheckLearningLoading()` -- used in 16 specs
- `waitForElementClickable()` -- used in 16 specs
- `clickDownloadButton()` -- used in 15 specs
- `getAskAboutSuggestedQuestions()` -- used in 15 specs
- `getInterpretationContent()` -- used in 15 specs
- `getToastbyMessage()` -- used in 15 specs
- `hoverTextOnlyChatAnswertoOpenInterpretationbyIndex(Index)` -- used in 15 specs
- `inputFeedbackContents(feedback, index = 0)` -- used in 15 specs
- `isPanelErrorIconDisplayed()` -- used in 15 specs
- `checkVizInSnapshotDialog(testCase, imageName)` -- used in 14 specs
- `clickCloseButton()` -- used in 14 specs
- `clickFocusSnapshotButton(index = 0)` -- used in 14 specs
- `clickInterpretation()` -- used in 14 specs
- `constructJSON(inputKey, inputValue, outputKey, outputValue)` -- used in 14 specs
- `getBubbleLoadingIcon()` -- used in 14 specs
- `getRenameButton()` -- used in 14 specs
- `saveBot({ skipClosingToast = true, expectSuccess = true })` -- used in 14 specs
- `showInterpretationContent()` -- used in 14 specs
- `changeMetricNumberFormattingToType(numberFormatType, metricName)` -- used in 13 specs
- `clickCopyButton()` -- used in 13 specs
- `clickFeedbackSubmitButton(index = 0)` -- used in 13 specs
- `clickOneDatasetManipuButton(dataset, button)` -- used in 13 specs
- `clickStartConversationInAskAboutPanel(objectName)` -- used in 13 specs
- `getMySnapshotsPanel()` -- used in 13 specs
- `getQueryTextByIndex()` -- used in 13 specs
- `getStartConversationRecommendation()` -- used in 13 specs
- `isVizAnswerByIndexDisplayed(Index)` -- used in 13 specs
- `openAskAboutPanel()` -- used in 13 specs
- `rightClickElementByName(type, name)` -- used in 13 specs
- `scrollChatPanelToBottom()` -- used in 13 specs
- `switchUser()` -- used in 13 specs
- `toLowerCase()` -- used in 13 specs
- `waitForExist()` -- used in 13 specs
- `clickChatPanelTopicByIndex(Index)` -- used in 12 specs
- `clickFollowUpIconbyIndex(Index)` -- used in 12 specs
- `clickInterpretationbyIndex(index)` -- used in 12 specs
- `clickThumbDownButtonbyIndex(Index)` -- used in 12 specs
- `closeDataset(name)` -- used in 12 specs
- `getDatasetPanel()` -- used in 12 specs
- `getHintText()` -- used in 12 specs
- `getTitleBar()` -- used in 12 specs
- `hoverOnChatAnswer(index)` -- used in 12 specs
- `inputSearchText(text)` -- used in 12 specs
- `isTextAnswerByIndexDisplayed(Index)` -- used in 12 specs
- `scrollChatPanelTo(position)` -- used in 12 specs
- `setSnapshotTimeForAll(value)` -- used in 12 specs
- `waitForDataPanelContainerLoading()` -- used in 12 specs
- `clickCheckboxOnDatasetTitle(name)` -- used in 11 specs
- `copyQuestionToQuery(index)` -- used in 11 specs
- `editDossierFromLibraryWithNoWait()` -- used in 11 specs
- `getMarkDownByIndex()` -- used in 11 specs
- `getSnapshotCategoryAreaByName()` -- used in 11 specs
- `getUrl()` -- used in 11 specs
- `hoverOnNumberFormatButton()` -- used in 11 specs
- `openInterpretation(index = 0)` -- used in 11 specs
- `tabCount()` -- used in 11 specs
- `actionOnSubmenu()` -- used in 10 specs
- `any()` -- used in 10 specs
- `getFeedbackPanel()` -- used in 10 specs
- `getInterpretationComponent()` -- used in 10 specs
- `hoverNthChatAnswerFromEndtoAddSnapshot(Nth)` -- used in 10 specs
- `changeAttributeFormat(data, forms, cancel = false)` -- used in 9 specs
- `clickDeleteButton()` -- used in 9 specs
- `clickLink(text)` -- used in 9 specs
- `clickNuggetTriggerIcon()` -- used in 9 specs
- `confirmDelete()` -- used in 9 specs
- `getAnswerBubbleButtonIconContainerbyIndex()` -- used in 9 specs
- `getFeedbackResultPanel()` -- used in 9 specs
- `getNoContentMessage()` -- used in 9 specs
- `getRecommendations()` -- used in 9 specs
- `getSnapshotDialog()` -- used in 9 specs
- `getVizAnswerByIndex()` -- used in 9 specs
- `hoverTextOnlyChatAnswertoOpenThumbDownbyIndex(Index)` -- used in 9 specs
- `isQueryByIndexDisplayed(Index)` -- used in 9 specs
- `waitForRefreshPageLoading()` -- used in 9 specs
- `waitForTopicAnswerLoading()` -- used in 9 specs
- `askAboutbyIndex(Index = 0)` -- used in 8 specs
- `clickCloseSnapshotButton()` -- used in 8 specs
- `clickMobileHamburgerButton()` -- used in 8 specs
- `esc()` -- used in 8 specs
- `getAnswerList()` -- used in 8 specs
- `getAttributeMetric()` -- used in 8 specs
- `getChatAnswerbyIndex()` -- used in 8 specs
- `getDataContextMenu()` -- used in 8 specs
- `getLearningForgetBtn()` -- used in 8 specs
- `getNumberOfDisplayedSnapshotCard()` -- used in 8 specs
- `getThumbdownIcon()` -- used in 8 specs
- `hoverErrorIconForDataset(name)` -- used in 8 specs
- `hoverLearningContent(answerIndex = 0, learningIndex = 0, offset = { x: 0, y: 0 })` -- used in 8 specs
- `hoverOnAttributeFormsButton()` -- used in 8 specs
- `hoverOnSmartSuggestion(index)` -- used in 8 specs
- `isButtonDisabled(elem)` -- used in 8 specs
- `refresh()` -- used in 8 specs
- `renameElementAndPressEnter(type, renameText)` -- used in 8 specs
- `setLanguage()` -- used in 8 specs
- `tooltipTextForDataset(name)` -- used in 8 specs
- `clickFolderArrow(name)` -- used in 7 specs
- `clickLearningForgetButtonbyIndex(Index)` -- used in 7 specs
- `clickLearningIndicator()` -- used in 7 specs
- `clickLinksPopoverButton()` -- used in 7 specs
- `clickOnDatasetInSearch(name)` -- used in 7 specs
- `clickTopicInAIBotByIndex(topicIndex = 0)` -- used in 7 specs
- `getDataPanelContainer()` -- used in 7 specs
- `getLearningForgottenIcon()` -- used in 7 specs
- `getMarkDownAnswerCount()` -- used in 7 specs
- `getNthParagraphOfTextAnswerFromEnd(Nth)` -- used in 7 specs
- `getTopicItemsInChatPanel()` -- used in 7 specs
- `getTopicsDescriptionTextByIndex(index)` -- used in 7 specs
- `getTopicsTitleTextByIndex(index)` -- used in 7 specs
- `hoverOnFistRect(mode)` -- used in 7 specs
- `isChecked(form)` -- used in 7 specs
- `openMenuByClick()` -- used in 7 specs
- `searchInReplaceDialog(text)` -- used in 7 specs
- `setName(value)` -- used in 7 specs
- `switchToNewWindow()` -- used in 7 specs
- `waitForEditPageLoading()` -- used in 7 specs
- `waitForNewDIPageLoading()` -- used in 7 specs
- `clickClearSnapshots()` -- used in 6 specs
- `clickConfirmClearSnapshotsButton()` -- used in 6 specs
- `clickMoveButton()` -- used in 6 specs
- `clickToolBarMoreButtonByIndex(Index)` -- used in 6 specs
- `clickTopicsBtn()` -- used in 6 specs
- `currentURL()` -- used in 6 specs
- `getAnswerbyIndex()` -- used in 6 specs
- `getAnswerLearningText()` -- used in 6 specs
- `getCSSProperty()` -- used in 6 specs
- `getDatasetCount()` -- used in 6 specs
- `getDatasetPanelTitle()` -- used in 6 specs
- `getEmptySnapshotPanel()` -- used in 6 specs
- `getMenueItemCount()` -- used in 6 specs
- `getNuggetTriggerIcon()` -- used in 6 specs
- `getNumberFormatContainer()` -- used in 6 specs
- `getRefreshContainer()` -- used in 6 specs
- `hoverErrorIcon()` -- used in 6 specs
- `isMarkDownByIndexDisplayed(Index)` -- used in 6 specs
- `isRecommendationByIndexDisplayed(Index)` -- used in 6 specs
- `renameData(data, text)` -- used in 6 specs
- `renameElementAndClickOutside(type, renameText)` -- used in 6 specs
- `tooltipText()` -- used in 6 specs
- `changeThemeTo(theme)` -- used in 5 specs
- `chooseDataType(text)` -- used in 5 specs
- `chooseFileInNewDI(text, title = newDIUILabels.English.dataSourceTitle)` -- used in 5 specs
- `clickClearHistoryButton()` -- used in 5 specs
- `clickFoldRecommendation()` -- used in 5 specs
- `clickSeeMoreButton()` -- used in 5 specs
- `clickTopicByTitle(title)` -- used in 5 specs
- `copySnapshotTitle()` -- used in 5 specs
- `executeScript()` -- used in 5 specs
- `getBottomButtonIconContainerbyIndex()` -- used in 5 specs
- `getButtonFromToolbar()` -- used in 5 specs
- `getClearHistoryConfirmationDialog()` -- used in 5 specs
- `getConfirmationBtnOnForget()` -- used in 5 specs
- `getCopyButton()` -- used in 5 specs
- `getDeleteButton()` -- used in 5 specs
- `getDownloadButton()` -- used in 5 specs
- `getEnabledSmartSuggestion()` -- used in 5 specs
- `getNuggetsPopoverContentDatasetTitle()` -- used in 5 specs
- `getNuggetsPopoverContentDefinition()` -- used in 5 specs
- `getQueryCount()` -- used in 5 specs
- `getSearchContainer()` -- used in 5 specs
- `getSortButton()` -- used in 5 specs
- `getThumbDownLoadingSpinner()` -- used in 5 specs
- `hoverOnHistoryAnswer(index)` -- used in 5 specs
- `isDisabledSendIconDisplayed()` -- used in 5 specs
- `isDisabledTopicsIconDisplayed()` -- used in 5 specs
- `isLearningIndicatorDisplayed()` -- used in 5 specs
- `isSendIconDisplayed()` -- used in 5 specs
- `isWelcomePageBotImageDisplayed()` -- used in 5 specs
- `renameCategory(newName)` -- used in 5 specs
- `resizeSnapshotPanel(offset = -100)` -- used in 5 specs
- `respondOnce()` -- used in 5 specs
- `stopGuides()` -- used in 5 specs
- `waitForFileSamplePageLoading(title = newDIUILabels.English.dataSourceTitle)` -- used in 5 specs
- `xlsx()` -- used in 5 specs
- `changePaletteTo(palette)` -- used in 4 specs
- `clickCloseSnapshotAddedButton()` -- used in 4 specs
- `clickDidYouMeanCloseButton()` -- used in 4 specs
- `clickInterpretationButton()` -- used in 4 specs
- `clickQuotedMessageButtonByIndex(Index)` -- used in 4 specs
- `clickSmartSuggestionCopyIcon()` -- used in 4 specs
- `clickSmartSuggestionShowMoreBtn(Index = 0)` -- used in 4 specs
- `clickSortButton()` -- used in 4 specs
- `getAdvancedContainer()` -- used in 4 specs
- `getChatPanelTopic()` -- used in 4 specs
- `getConfigTabContainerByIndex()` -- used in 4 specs
- `getCountOfTextAnswer()` -- used in 4 specs
- `getHighlightedTextOfAutoCompleteionItem()` -- used in 4 specs
- `getInterpretationButton()` -- used in 4 specs
- `getInterpretationLearning()` -- used in 4 specs
- `getLearningIndicatorHelpLink()` -- used in 4 specs
- `getLinksPopoverContents()` -- used in 4 specs
- `getMoveButton()` -- used in 4 specs
- `getSnapshotCardInsideByText()` -- used in 4 specs
- `getSortContent()` -- used in 4 specs
- `getStartConversationBtn()` -- used in 4 specs
- `getTextOfAutoCompleteionItem()` -- used in 4 specs
- `getThumbDownIconbyIndex()` -- used in 4 specs
- `getTitleBarBotNameTexts()` -- used in 4 specs
- `getTopicTooltip()` -- used in 4 specs
- `getVizDataLimitHint()` -- used in 4 specs
- `getWelcomePageMessageTexts()` -- used in 4 specs
- `hoverMapbox(index = 0)` -- used in 4 specs
- `hoverPanelErrorIcon()` -- used in 4 specs
- `isChatAnswerByIndexDisplayed(Index)` -- used in 4 specs
- `isClearSnapshotButtonDisplayed()` -- used in 4 specs
- `isDataChecked(elem)` -- used in 4 specs
- `isDisplayReplacePage()` -- used in 4 specs
- `isWelcomePageSeparatorDisplayed()` -- used in 4 specs
- `openInterpretationForgetUserLearning(answerIndex = 0, learningIndex = 0, waitLoading = true)` -- used in 4 specs
- `panelTooltipText()` -- used in 4 specs
- `saveBotWithConfirm()` -- used in 4 specs
- `selectBotConfigTabByIndex(index)` -- used in 4 specs
- `setInterpretationText(value)` -- used in 4 specs
- `tab()` -- used in 4 specs
- `takeSnapshot(index = 0)` -- used in 4 specs
- `verifyTopicSummary(topicSummaryAccount = 3)` -- used in 4 specs
- `waitForEditPageClose()` -- used in 4 specs
- `waitForForgetUserLearningLoading()` -- used in 4 specs
- `waitForRefreshLoading()` -- used in 4 specs
- `waitUntil()` -- used in 4 specs
- `askQuestionByAutoComplete(text, autoCompletionIndex = 0)` -- used in 3 specs
- `clearInputbox()` -- used in 3 specs
- `clearMobileViewHistory()` -- used in 3 specs
- `clickAskAgainButton()` -- used in 3 specs
- `clickCloseFocusViewButton()` -- used in 3 specs
- `clickFeedbackCloseButtonbyIndex(index = 0)` -- used in 3 specs
- `clickInterpretationCopyToQueryIcon()` -- used in 3 specs
- `clickLinksPopoverItemsbyIndex(Index)` -- used in 3 specs
- `clickLongContentButton()` -- used in 3 specs
- `clickMapZoomInButton(mode)` -- used in 3 specs
- `clickRefreshRecommendationIcon()` -- used in 3 specs
- `deleteByTimes(times = 1)` -- used in 3 specs
- `execute()` -- used in 3 specs
- `getAskAboutPanel()` -- used in 3 specs
- `getAskAboutPanelObjectByIndex()` -- used in 3 specs
- `getChatAnswerByText()` -- used in 3 specs
- `getDatasetOptionBtn()` -- used in 3 specs
- `getDialogCloseButton()` -- used in 3 specs
- `getDisclaimer()` -- used in 3 specs
- `getHighlightMessage()` -- used in 3 specs
- `getInterpretationContentText()` -- used in 3 specs
- `getInterpretationNuggets()` -- used in 3 specs
- `getLearningIndicatorDialog()` -- used in 3 specs
- `getLearningManagerWindow()` -- used in 3 specs
- `getLearningTooltip()` -- used in 3 specs
- `getMaximizeButton()` -- used in 3 specs
- `getNuggetsPopoverContent()` -- used in 3 specs
- `getPinButton()` -- used in 3 specs
- `getQueryByIndex()` -- used in 3 specs
- `getQuotedMessageInInpuxBox()` -- used in 3 specs
- `getTextAnswerByIndex()` -- used in 3 specs
- `getTitleBarExternalLinkItemsByIndex()` -- used in 3 specs
- `getToolBarMoreMenu()` -- used in 3 specs
- `getUnreadIcon()` -- used in 3 specs
- `getVizByMatchFullTitle()` -- used in 3 specs
- `hoverOnDidYouMeanCloseButton()` -- used in 3 specs
- `hoverOnLinkByIndex(index)` -- used in 3 specs
- `hoverOnRecommendationByIndex(Index)` -- used in 3 specs
- `hoverOnRecommendationRefreshBtn()` -- used in 3 specs
- `hoverOnSmartSuggestionCopyIcon()` -- used in 3 specs
- `hoverOnTopicsBtn()` -- used in 3 specs
- `isChatPanelTopicDisplayed()` -- used in 3 specs
- `isClearSearchIconDisplayed()` -- used in 3 specs
- `isInterpretationComponentDisplayed()` -- used in 3 specs
- `isQuotedQuestionDisplayedInInputBox()` -- used in 3 specs
- `isSearchPresent()` -- used in 3 specs
- `isTitleBarBotLogoDisplayed()` -- used in 3 specs
- `isTopicsIconDisplayed()` -- used in 3 specs
- `navigateUpWithArrow()` -- used in 3 specs
- `openExternalLinkOnChatTitleBarByIndex(Index)` -- used in 3 specs
- `openLearningManager(Index = 0)` -- used in 3 specs
- `openMobileViewSnapshotPanel()` -- used in 3 specs
- `push()` -- used in 3 specs
- `renameErrorMessage()` -- used in 3 specs
- `rightClickRect(mode)` -- used in 3 specs
- `searchSelectDataset()` -- used in 3 specs
- `selectMoveToCategory(categoryName)` -- used in 3 specs
- `setItem()` -- used in 3 specs
- `setSavedTime(value)` -- used in 3 specs
- `verifyUncertainTopicSummary(topicSummaryAccount = 3)` -- used in 3 specs
- `waitForLibraryLoading()` -- used in 3 specs
- `waitForNewDIClose()` -- used in 3 specs
- `changeThemeItemColor(itemLabel, colorAriaLabel)` -- used in 2 specs
- `checkAllInRefresh()` -- used in 2 specs
- `checkIfCopyScreenshotButtonExisting(Nth)` -- used in 2 specs
- `checkIfDownloadButtonExisting(Nth)` -- used in 2 specs
- `checkMapByImageComparison(index, testCase, imageName)` -- used in 2 specs
- `checkQueryMessageByImageComparison(testCase, imageName)` -- used in 2 specs
- `checkVIBoxPanel()` -- used in 2 specs
- `clickBackToChatPanel()` -- used in 2 specs
- `clickBotName()` -- used in 2 specs
- `clickButtonInEditPage()` -- used in 2 specs
- `clickCancelLoadingAnswerButton()` -- used in 2 specs
- `clickClearHistoryNoButton()` -- used in 2 specs
- `clickCloseQuotedMessageIcon()` -- used in 2 specs
- `clickCollapseButton()` -- used in 2 specs
- `clickDatasetArrow()` -- used in 2 specs
- `clickDataSortBy(text)` -- used in 2 specs
- `clickInterpretationFromMaximizeView()` -- used in 2 specs
- `clickInterpretationSeeMoreBtn()` -- used in 2 specs
- `clickMarkDownByIndex(Index)` -- used in 2 specs
- `clickPinButton()` -- used in 2 specs
- `clickSeeLessButton()` -- used in 2 specs
- `clickSeeMoreLessBtn()` -- used in 2 specs
- `clickSeeMoreSeeLessButton()` -- used in 2 specs
- `clickSmartSuggestionShowLessBtn(Index = 0)` -- used in 2 specs
- `clickSnapshotNuggetTriggerIcon()` -- used in 2 specs
- `clickSnapshotViz()` -- used in 2 specs
- `clickThreeDotsButton()` -- used in 2 specs
- `clickThumbDownClickedButtonbyIndex(Index)` -- used in 2 specs
- `closeInterpretationButton()` -- used in 2 specs
- `closeSnapshotsPanel()` -- used in 2 specs
- `createBotWithDataset()` -- used in 2 specs
- `deleteNetworkConditions()` -- used in 2 specs
- `doubleClickAttributeMetric()` -- used in 2 specs
- `error()` -- used in 2 specs
- `floor()` -- used in 2 specs
- `getAnswerLearning()` -- used in 2 specs
- `getAskAboutBtn()` -- used in 2 specs
- `getAskAboutPanelObjectList()` -- used in 2 specs
- `getAttribute()` -- used in 2 specs
- `getAttributeFormContainer()` -- used in 2 specs
- `getCancelButton()` -- used in 2 specs
- `getCategoryMenu()` -- used in 2 specs
- `getConfirmDeleteDialog()` -- used in 2 specs
- `getCookies()` -- used in 2 specs
- `getCopyToQueryBtnByIndex()` -- used in 2 specs
- `getDatasetNameContainer()` -- used in 2 specs
- `getDatasetPanelMenuBtn()` -- used in 2 specs
- `getDuplicateNameAlertContainer()` -- used in 2 specs
- `getErrorButton()` -- used in 2 specs
- `getErrorIcon()` -- used in 2 specs
- `getFollowUpCount()` -- used in 2 specs
- `getForgetUserLearningLoadingColor()` -- used in 2 specs
- `getForgottenTooltip()` -- used in 2 specs
- `getInActiveBanner()` -- used in 2 specs
- `getInsightLineIinfoWindow()` -- used in 2 specs
- `getLearningManagerContent()` -- used in 2 specs
- `getLocation()` -- used in 2 specs
- `getMessageBox()` -- used in 2 specs
- `getMessageBoxTitleText()` -- used in 2 specs
- `getMoveDialog()` -- used in 2 specs
- `getNewBotButton()` -- used in 2 specs
- `getOKButton()` -- used in 2 specs
- `getQueryMessageContentByIndex()` -- used in 2 specs
- `getQuotedMessageByIndex()` -- used in 2 specs
- `getSavedTime()` -- used in 2 specs
- `getSearchInput()` -- used in 2 specs
- `getSeeMoreSeeLessButton()` -- used in 2 specs
- `getSmartSuggestionShowLessBtn()` -- used in 2 specs
- `getSnapshotPanelContainer()` -- used in 2 specs
- `getSnapshotPanelHeader()` -- used in 2 specs
- `getSwitch()` -- used in 2 specs
- `getTableRowNameFromTooltip()` -- used in 2 specs
- `getTableRowValueFromTooltip()` -- used in 2 specs
- `getThumbDownCount()` -- used in 2 specs
- `getTimeText()` -- used in 2 specs
- `getTopicsIcon()` -- used in 2 specs
- `getTopicSuggestions()` -- used in 2 specs
- `getVizTypeNameByTitle()` -- used in 2 specs
- `getWelcomePageSeparator()` -- used in 2 specs
- `getWelcomePageTitleTexts()` -- used in 2 specs
- `hoverInsightLineChartInfoIcon()` -- used in 2 specs
- `hoverNthChatAnswerFromEndtoClickThumbdown(Nth)` -- used in 2 specs
- `hoverOnBotName()` -- used in 2 specs
- `hoverOnDataName(data)` -- used in 2 specs
- `hoverOnDatasetName(index = 0)` -- used in 2 specs
- `hoverOnFollowUpIconByIndex(index)` -- used in 2 specs
- `hoverOnGMShape(mode)` -- used in 2 specs
- `hoverOnHeatmap(mode, offset = { x: 0, y: 0 })` -- used in 2 specs
- `hoverOnHistoryQuestion(index)` -- used in 2 specs
- `hoverOnInputBox()` -- used in 2 specs
- `hoverOnLinksPopoverBtn()` -- used in 2 specs
- `hoverOnLinksPopoverItemByIndex(Index)` -- used in 2 specs
- `hoverOnToolBarMoreButtonByIndex(index)` -- used in 2 specs
- `hoverThumbDownButtonbyIndex(Index)` -- used in 2 specs
- `hovertoClickThumbDownbyIndex(MarkDownIndex = 0, ThumbDownIndex = 0)` -- used in 2 specs
- `HTTPS()` -- used in 2 specs
- `isAdvancedButtonEnabled()` -- used in 2 specs
- `isApplyButtonDisabled()` -- used in 2 specs
- `isAskAboutBtnDisplayed()` -- used in 2 specs
- `isAttributeFormsButtonDisplayed()` -- used in 2 specs
- `isDisabledInputContainerDisplayed()` -- used in 2 specs
- `isLoginPageDisplayed()` -- used in 2 specs
- `isNumberFormatButtonDisplayed()` -- used in 2 specs
- `isRecommendationDisplayed()` -- used in 2 specs
- `isRecommendationRefreshIconDisplayed()` -- used in 2 specs
- `isRenameDisplayed()` -- used in 2 specs
- `isThumbdownIconDisplayed()` -- used in 2 specs
- `isTimeDisplayed()` -- used in 2 specs
- `isVizAnswerDisplaed()` -- used in 2 specs
- `isWarningForDatasetDisplayed(name)` -- used in 2 specs
- `match()` -- used in 2 specs
- `openGridElmContextMenu()` -- used in 2 specs
- `openRenamingByDoubleClick(type, index)` -- used in 2 specs
- `random()` -- used in 2 specs
- `relogin()` -- used in 2 specs
- `removeDossierFromLibrary()` -- used in 2 specs
- `renameElementAndPressTab(type, renameText)` -- used in 2 specs
- `renameSnapshotTitle(newName)` -- used in 2 specs
- `scrollChatPanelContainerToBottom()` -- used in 2 specs
- `scrollPageToBottom()` -- used in 2 specs
- `scrollPageToTop()` -- used in 2 specs
- `setAutoSuggestionLimit(limit)` -- used in 2 specs
- `setNetworkConditions()` -- used in 2 specs
- `switchCustomApp()` -- used in 2 specs
- `switchNumberFormatTypeToCurrency()` -- used in 2 specs
- `toBeNull()` -- used in 2 specs
- `toggleTopicSwitch()` -- used in 2 specs
- `waitForClickable()` -- used in 2 specs
- `waitForEitherElemmentVisible()` -- used in 2 specs
- `waitForElementEnabled()` -- used in 2 specs
- `waitForRecommendationLoading()` -- used in 2 specs
- `abort()` -- used in 1 specs
- `addToLibrary()` -- used in 1 specs
- `askQuestionByPasteWithoutSending(question)` -- used in 1 specs
- `cdp()` -- used in 1 specs
- `checkIfSnapshotButtonExisting(Nth)` -- used in 1 specs
- `clearFeedbackContents(index = 0)` -- used in 1 specs
- `clearSnapshot()` -- used in 1 specs
- `clickCheckBox(Index = 0)` -- used in 1 specs
- `clickCloseButtonInMessageBox()` -- used in 1 specs
- `clickContentDiscoveryBotByIndex(Index)` -- used in 1 specs
- `clickDataSourceByIndex()` -- used in 1 specs
- `clickDossierEditIcon()` -- used in 1 specs
- `clickFollowUpError()` -- used in 1 specs
- `clickGMYaxisTitle()` -- used in 1 specs
- `clickGridCell(index, mode)` -- used in 1 specs
- `clickInterpretationCopyLLMInstructionsIcon()` -- used in 1 specs
- `clickInterpretationFromSnapshot()` -- used in 1 specs
- `clickInterpretationReloadButton()` -- used in 1 specs
- `clickLearningManager(Index = 0)` -- used in 1 specs
- `clickMapResetButton(mode)` -- used in 1 specs
- `clickMapZoomOutButton()` -- used in 1 specs
- `clickMaximizeButtonFromSnapshot()` -- used in 1 specs
- `clickMobileViewClearHistoryButton()` -- used in 1 specs
- `clickMobileViewClearHistoryNoButton()` -- used in 1 specs
- `clickMobileViewLinksButton()` -- used in 1 specs
- `clickMoreButton()` -- used in 1 specs
- `clickNewDossierIcon()` -- used in 1 specs
- `clickNuggetTriggerIconFromMaximizeView()` -- used in 1 specs
- `clickOkInNumberFormat()` -- used in 1 specs
- `clickOnDatasetInReplace(name)` -- used in 1 specs
- `clickQuotedMessageCloseButton()` -- used in 1 specs
- `clickSnapshotOperations()` -- used in 1 specs
- `clickTextLinkToBot()` -- used in 1 specs
- `clickTopicByIndex(Index)` -- used in 1 specs
- `ClickUnpinNthChatAnswerFromEnd(Nth)` -- used in 1 specs
- `clickViewDetailsButton()` -- used in 1 specs
- `closeDataImportDialog()` -- used in 1 specs
- `closeDialogue()` -- used in 1 specs
- `closeMobileViewSnapshotPanel()` -- used in 1 specs
- `confirmDoNotSave()` -- used in 1 specs
- `disableTutorial()` -- used in 1 specs
- `enter()` -- used in 1 specs
- `getAnswerCount()` -- used in 1 specs
- `getAutoCompleteItembyIndex()` -- used in 1 specs
- `getCategoryCount()` -- used in 1 specs
- `getChatPanel()` -- used in 1 specs
- `getClearSnapshotsController()` -- used in 1 specs
- `getCloseButton()` -- used in 1 specs
- `getContextMenuByLevel()` -- used in 1 specs
- `getDatasetByName()` -- used in 1 specs
- `getDisabledTopicsIcon()` -- used in 1 specs
- `getDotInSnapshotPanelButton()` -- used in 1 specs
- `getElement()` -- used in 1 specs
- `getErrorMessageDialog()` -- used in 1 specs
- `getFeedbackResultsText(index = 0)` -- used in 1 specs
- `getFollowUpError()` -- used in 1 specs
- `getGenerlSettingsContainer()` -- used in 1 specs
- `getGreetingInputBox()` -- used in 1 specs
- `getInterpretationComponents()` -- used in 1 specs
- `getInterpretationContentTitle()` -- used in 1 specs
- `getInterpretedAsText()` -- used in 1 specs
- `getKnowledgeSection()` -- used in 1 specs
- `getLastQueryText()` -- used in 1 specs
- `getLearningCheckingText()` -- used in 1 specs
- `getLearningIcon()` -- used in 1 specs
- `getLearningManagerNoDataWindow()` -- used in 1 specs
- `getLibraryViewContainer()` -- used in 1 specs
- `getLinkSection()` -- used in 1 specs
- `getLinksPopoverButton()` -- used in 1 specs
- `getLoginButton()` -- used in 1 specs
- `getMarkDownTextByIndex()` -- used in 1 specs
- `getNuggetContent()` -- used in 1 specs
- `getNuggetsPopoverContentDatasetTitleFromMaximizeView()` -- used in 1 specs
- `getNuggetsPopoverContentDefinitionFromMaximizeView()` -- used in 1 specs
- `getOpenSnapshotPanelButton()` -- used in 1 specs
- `getPaletteSelectPanel()` -- used in 1 specs
- `getPinButtonOfNthChatAnswer(Nth)` -- used in 1 specs
- `getQuotedQuestionInInpuxBox()` -- used in 1 specs
- `getRecommendationFoldStateBtn()` -- used in 1 specs
- `getRecommendationRefreshIcon()` -- used in 1 specs
- `getRecommendationTitle()` -- used in 1 specs
- `getRelatedSuggestionArea()` -- used in 1 specs
- `getSaveButton()` -- used in 1 specs
- `getSeeMoreLessBtnSnapshotPanel()` -- used in 1 specs
- `getSelectBox()` -- used in 1 specs
- `getSmartSuggestionCopyIcon()` -- used in 1 specs
- `getSnapshotCardByIndex()` -- used in 1 specs
- `getSnapshotContent()` -- used in 1 specs
- `getSnapshotNuggetsPopoverContentDatasetTitle()` -- used in 1 specs
- `getSnapshotNuggetsPopoverContentDefinition()` -- used in 1 specs
- `getSnapshotOperations()` -- used in 1 specs
- `getSnapshotTitle()` -- used in 1 specs
- `getTime()` -- used in 1 specs
- `getTopicByIndex()` -- used in 1 specs
- `getTopicsCount()` -- used in 1 specs
- `getTopicSuggestionTitleTexts()` -- used in 1 specs
- `getUnpinButtonOfNthChatAnswer(Nth)` -- used in 1 specs
- `getUploadFilePage()` -- used in 1 specs
- `getVisualizationMenuButton()` -- used in 1 specs
- `getWelcomePageBotIcon()` -- used in 1 specs
- `hover()` -- used in 1 specs
- `hoverChatAnswertoAddSnapshotbyIndex(Index)` -- used in 1 specs
- `hoverChatAnswertoClickThumbDownbyIndex(Index)` -- used in 1 specs
- `hoverContentDiscoveryBotByIndex(Index)` -- used in 1 specs
- `hoverGMYaxisTitle()` -- used in 1 specs
- `hoverLearningManager(Index = 0)` -- used in 1 specs
- `hoverOnBotLogo()` -- used in 1 specs
- `hoverOnClearHistoryBtn()` -- used in 1 specs
- `hoverOnCopyToQueryIcon()` -- used in 1 specs
- `hoverOnInterpretationBtn(index)` -- used in 1 specs
- `hoverOnInterpretationCopyLLMInstructionsBtn()` -- used in 1 specs
- `hoverOnInterpretationCopyToQueryBtn()` -- used in 1 specs
- `hoverOnRecommendationExpandStateBtn()` -- used in 1 specs
- `hoverOnRectFromBarChart()` -- used in 1 specs
- `hoverOnSeeMoreLessBtn()` -- used in 1 specs
- `hoverOnSendIcon()` -- used in 1 specs
- `hoverOnWelcomePageBotIcon()` -- used in 1 specs
- `hoverOnWelcomePageMessage()` -- used in 1 specs
- `hoverOnWelcomePageTitle()` -- used in 1 specs
- `hoverSnapshotOperations()` -- used in 1 specs
- `hoverTextOnlyChatAnswertoAddSnapshotbyIndex(Index)` -- used in 1 specs
- `hoverThumbDownClickedButtonbyIndex(Index)` -- used in 1 specs
- `importSampleFiles()` -- used in 1 specs
- `isAskAboutDisplayed()` -- used in 1 specs
- `isAskAboutPanelDisplayed()` -- used in 1 specs
- `isAskAboutPanelObjectListDisplayed()` -- used in 1 specs
- `isAskAboutPanelSearchBoxDisplayed()` -- used in 1 specs
- `isClearHistpryConfirmationDialogDisplayed()` -- used in 1 specs
- `isContentDiscoveryBotByIndexDisplayed(Index)` -- used in 1 specs
- `isDataCheckedInFolder(elem)` -- used in 1 specs
- `isDataDisplayed(type, name)` -- used in 1 specs
- `isDatasetlistEmpty()` -- used in 1 specs
- `isDisabledReccomendationFoldStateBtnDisplayed()` -- used in 1 specs
- `isDisclaimerDisplayed()` -- used in 1 specs
- `isFileSamplePageDisplayed()` -- used in 1 specs
- `isInterpretationCopyLLMInstructionsIconDisplayed()` -- used in 1 specs
- `isInterpretationCopyToQueryDisableIconDisplayed()` -- used in 1 specs
- `isLinkIconDisplayed()` -- used in 1 specs
- `isOptionExistInMenu()` -- used in 1 specs
- `isRecommendationAboutDisplayed()` -- used in 1 specs
- `isRecommendationExpandStateBtnDisplayed()` -- used in 1 specs
- `isWelcomePageMessageDisplayed()` -- used in 1 specs
- `isWelcomePageTitleDisplayed()` -- used in 1 specs
- `join()` -- used in 1 specs
- `keys()` -- used in 1 specs
- `logout()` -- used in 1 specs
- `multiSelectAttributeMetric()` -- used in 1 specs
- `numberOfSnapshotsInChatbot()` -- used in 1 specs
- `on()` -- used in 1 specs
- `openContentDiscovery()` -- used in 1 specs
- `openDataset(name)` -- used in 1 specs
- `openDossierInfoWindow()` -- used in 1 specs
- `openFolderByPath()` -- used in 1 specs
- `openManageLearning()` -- used in 1 specs
- `openPaletteDropdownList()` -- used in 1 specs
- `openProjectList()` -- used in 1 specs
- `openSidebarOnly()` -- used in 1 specs
- `openSnapshot()` -- used in 1 specs
- `openUserAccountMenu()` -- used in 1 specs
- `readText()` -- used in 1 specs
- `refreshTopics(index)` -- used in 1 specs
- `reload()` -- used in 1 specs
- `repeat()` -- used in 1 specs
- `rightClickAttributeMetric()` -- used in 1 specs
- `rightClickGMShape(mode)` -- used in 1 specs
- `rightClickGridCell(index, mode)` -- used in 1 specs
- `rightClickOnHeatmap(mode, offset = { x: 0, y: 0 })` -- used in 1 specs
- `rightClickTitleBoxNoWait()` -- used in 1 specs
- `saveAsBot({ name, path })` -- used in 1 specs
- `saveAsBotOverwrite()` -- used in 1 specs
- `scrollIntoView()` -- used in 1 specs
- `searchDataset(searchText)` -- used in 1 specs
- `selectProject()` -- used in 1 specs
- `space()` -- used in 1 specs
- `stringContaining()` -- used in 1 specs
- `toBeGreaterThan()` -- used in 1 specs
- `toBeLessThan()` -- used in 1 specs
- `toBeUndefined()` -- used in 1 specs
- `toString()` -- used in 1 specs
- `updateGreetings(greeting)` -- used in 1 specs
- `url()` -- used in 1 specs
- `waitForUploadFilePageLoading()` -- used in 1 specs
- `activeBot()` -- used in 0 specs
- `addAllowlistDomain(domain)` -- used in 0 specs
- `addBasedOnObjectConfiguration(ruleIndex, basedOnObject, action = 'Require')` -- used in 0 specs
- `addBasedOnObjectsBySearch(ruleIndex, objectNames)` -- used in 0 specs
- `addBasedOnObjectsBySelection(ruleIndex, objectNames)` -- used in 0 specs
- `addBasedOnObjectsSelectingAll(ruleIndex)` -- used in 0 specs
- `addBlocklistDomain(domain)` -- used in 0 specs
- `addBotAlias(botName, aliasName)` -- used in 0 specs
- `addColumnAlias(templateObject, alias)` -- used in 0 specs
- `addColumnAliasInInput(aliasName)` -- used in 0 specs
- `addCustomSuggestion(text)` -- used in 0 specs
- `addCustomTopic({ title, description })` -- used in 0 specs
- `addExternalLink({ iconIndex = 0, title, url })` -- used in 0 specs
- `addNewRule()` -- used in 0 specs
- `addRecentlyEditedObjectsWithAllObjectsSelected(ruleIndex, objectNames)` -- used in 0 specs
- `addSampleData(languageID, sampleFileName = 'Airline Sample Data')` -- used in 0 specs
- `apply()` -- used in 0 specs
- `areTopicSuggestionsDisabled()` -- used in 0 specs
- `askQuestionAndSend(question)` -- used in 0 specs
- `askQuestionByPaste(question)` -- used in 0 specs
- `askQuestionInTeams(question)` -- used in 0 specs
- `askQuestionNoWaitViz(question)` -- used in 0 specs
- `autoGenerateTopics()` -- used in 0 specs
- `cancel()` -- used in 0 specs
- `cancelDelete()` -- used in 0 specs
- `changeAndCheckMetricType(numberFormatType, nameOfMetricWithChangedFormatting, question, index)` -- used in 0 specs
- `changeBotName(newName)` -- used in 0 specs
- `changeGreeting(newGreeting)` -- used in 0 specs
- `changeMetricNumberFormattingToCurrencyGBP(name)` -- used in 0 specs
- `changePanelTheme(theme = 'Dark')` -- used in 0 specs
- `changeQuestionHint(newHint)` -- used in 0 specs
- `changeSuggestionNumber(number)` -- used in 0 specs
- `changeVizPalette()` -- used in 0 specs
- `checkBotIfResponseContainsExpectedMetric(savedMetrics)` -- used in 0 specs
- `checkBotIfTopicsContainsRenamedMetric(savedMetrics)` -- used in 0 specs
- `checkCertifyCheckbox()` -- used in 0 specs
- `checkIfAnyCopyScreenshotButtonExisting()` -- used in 0 specs
- `checkIfSuggestionContainsRenamedMetric(savedMetrics)` -- used in 0 specs
- `checkMetricValue(response, metricArray)` -- used in 0 specs
- `checkMyObjectExistInTemplateObject(templateObjectName, myObjectName)` -- used in 0 specs
- `checkNumberFormat(testCase, imageName)` -- used in 0 specs
- `checkObjectMappedInMyObjectPanel(myObject)` -- used in 0 specs
- `checkOrUncheckAttributeForms(form)` -- used in 0 specs
- `checkPaletteInApp({
        appId = 'C2B2023642F6753A2EF159A75E0CFF29', projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', botId: botId, })` -- used in 0 specs
- `checkUncheckAttributeForm(form, attribute)` -- used in 0 specs
- `clearAskAboutSearch()` -- used in 0 specs
- `clearChatSearch()` -- used in 0 specs
- `clearHistoryAndAskQuestion(question)` -- used in 0 specs
- `clearSearchInMyObjectsPanel()` -- used in 0 specs
- `clearSearchInputInDropdown()` -- used in 0 specs
- `clickAddButtonForOtherRules(ruleIndex, label)` -- used in 0 specs
- `clickAddButtonInBasedOnObjectConfiguration(ruleIndex, basedOnObject)` -- used in 0 specs
- `clickAddCustomTopicButton()` -- used in 0 specs
- `clickAddLinkButton()` -- used in 0 specs
- `clickAddPromptBtn()` -- used in 0 specs
- `clickAdvancedButton()` -- used in 0 specs
- `clickAiDiagnosticsButtonByAnswerIndex(index)` -- used in 0 specs
- `clickAiDiagnosticsDialogCloseIcon()` -- used in 0 specs
- `clickAiDiagnosticsDialogCopyIcon()` -- used in 0 specs
- `clickAiDiagnosticsDialogExportIcon()` -- used in 0 specs
- `clickAndGetTooltip(e)` -- used in 0 specs
- `clickAnswerWithoutCacheButtonByIndex(index = 0)` -- used in 0 specs
- `clickArrowDownOnSave()` -- used in 0 specs
- `clickBasedOnConfigurationActionDropdown(ruleIndex, basedOnObject)` -- used in 0 specs
- `clickBot2CancelLoadingAnswerButton()` -- used in 0 specs
- `clickBotConfigDatasetDescription()` -- used in 0 specs
- `clickButton(name)` -- used in 0 specs
- `clickCancelInAttributeForm()` -- used in 0 specs
- `clickChatCategoryHeader(name)` -- used in 0 specs
- `clickChatContextMenuBtn(name)` -- used in 0 specs
- `clickChatContextMenuItem(btnName)` -- used in 0 specs
- `clickCheckBoxInSearchResult(name)` -- used in 0 specs
- `clickClearHistoryYesButton()` -- used in 0 specs
- `clickCloseSnapshotButtonInResponsive()` -- used in 0 specs
- `clickConfirmButtonInNoPermissionAlert()` -- used in 0 specs
- `clickDashboardPropertiesTab(text)` -- used in 0 specs
- `clickDatasetContextMenuItem(text)` -- used in 0 specs
- `clickDatasetObjectContextMenu(firstOption, secondOption)` -- used in 0 specs
- `clickDatasetTypeInDatasetPanel(datasetType)` -- used in 0 specs
- `clickDeleteSnapShotButton(Index)` -- used in 0 specs
- `clickDownloadLearningButton()` -- used in 0 specs
- `clickDownloadPDFReport(index = 0)` -- used in 0 specs
- `clickDuplicateBtn()` -- used in 0 specs
- `clickEditAppearanceButton()` -- used in 0 specs
- `clickErrorMessageArrow()` -- used in 0 specs
- `clickExportCSVButton()` -- used in 0 specs
- `clickExportExcelButton()` -- used in 0 specs
- `clickExportToCsvButton()` -- used in 0 specs
- `clickExportToExcelButton()` -- used in 0 specs
- `clickExternalLinkByText(text)` -- used in 0 specs
- `clickFistRect(mode)` -- used in 0 specs
- `clickFormOrMetricContextMenuItem(text)` -- used in 0 specs
- `clickGMShape(mode)` -- used in 0 specs
- `clickHistoryChatButton()` -- used in 0 specs
- `clickInterpretationAdvancedOption()` -- used in 0 specs
- `clickInterpretationSwitchBtn(index)` -- used in 0 specs
- `clickItemInDropdown(objectName)` -- used in 0 specs
- `clickLaunchInAgentButton()` -- used in 0 specs
- `clickManageRulesTitleToExitEdit()` -- used in 0 specs
- `clickMaximizeButton(index = 0)` -- used in 0 specs
- `clickMenuItemInEdit(text)` -- used in 0 specs
- `clickMobileViewClearHistoryYesButton()` -- used in 0 specs
- `clickMobileViewLinksItemsbyIndex(Index)` -- used in 0 specs
- `clickNewBotButton()` -- used in 0 specs
- `clickNewChatButton()` -- used in 0 specs
- `clickNotificationSaveButton()` -- used in 0 specs
- `clickOkBtnInAttributeForms()` -- used in 0 specs
- `clickOkButton()` -- used in 0 specs
- `clickOkButtonInNeedPermissionMessageBox()` -- used in 0 specs
- `clickOKInAttributeForm()` -- used in 0 specs
- `clickOnDatasetTitle(index = 0)` -- used in 0 specs
- `clickOpenSnapshotPanelButtonInResponsive()` -- used in 0 specs
- `clickPromptCardByTitle(promptTitle)` -- used in 0 specs
- `clickPromptPlayBtn(index)` -- used in 0 specs
- `clickPromptQuickRepliesBtn()` -- used in 0 specs
- `clickPromptQuickRepliesByTitle(promptTitle)` -- used in 0 specs
- `clickRecommendationByContents(recommendation)` -- used in 0 specs
- `clickRenameSnapshotTitleButton()` -- used in 0 specs
- `clickSaveAsBtn()` -- used in 0 specs
- `clickSaveAsButton()` -- used in 0 specs
- `clickSaveAsDropdown()` -- used in 0 specs
- `clickSaveAsDropdownFromBot()` -- used in 0 specs
- `clickSaveBtn()` -- used in 0 specs
- `clickSaveButton()` -- used in 0 specs
- `clickShowErrorDetails()` -- used in 0 specs
- `clickShowErrorDetails(index = 0)` -- used in 0 specs
- `clickSnapShotDeleteComfirmationButton()` -- used in 0 specs
- `clickSnapshotUnpinButton()` -- used in 0 specs
- `clickStartConversationInAskAboutPanel2(objectName)` -- used in 0 specs
- `clickSwitch()` -- used in 0 specs
- `clickToBottom()` -- used in 0 specs
- `clickToolBarCopyAsImageIcon()` -- used in 0 specs
- `clickToolBarDownloadIcon()` -- used in 0 specs
- `clickTopicByTitleAnWaitFordCancel(title)` -- used in 0 specs
- `clickUnstructuredDataDownloadButton()` -- used in 0 specs
- `clickUpdateDatasetButton({ isWaitLoading = true } = {})` -- used in 0 specs
- `clickUsageDateRange(text)` -- used in 0 specs
- `clickUsageDateRangeDropdown()` -- used in 0 specs
- `clickUsageDownloadButton()` -- used in 0 specs
- `clickUsageDownloadFailedOkButton()` -- used in 0 specs
- `clickUsageDownloadFailedOkButtonDashboard()` -- used in 0 specs
- `closeAgColumnPickerDialog()` -- used in 0 specs
- `closeBasedOnDropdown(ruleIndex)` -- used in 0 specs
- `closeCacheManager()` -- used in 0 specs
- `closeCacheSettings()` -- used in 0 specs
- `closeChatHistoryPanel()` -- used in 0 specs
- `closeCoverImageEditDialog()` -- used in 0 specs
- `closeDatasetWarningDialog()` -- used in 0 specs
- `closeDidYouMean()` -- used in 0 specs
- `closeEmbedBotDialog()` -- used in 0 specs
- `closeMobileHamburger()` -- used in 0 specs
- `closeMobileViewAskAboutPanel()` -- used in 0 specs
- `closePaletteDropdownList()` -- used in 0 specs
- `closeSnapshot()` -- used in 0 specs
- `closeViewSQL()` -- used in 0 specs
- `collapseColumns()` -- used in 0 specs
- `configFilter(whenText = '', objectLabel, operator = '=', value)` -- used in 0 specs
- `configGroupBy(whenText = '', objectNames)` -- used in 0 specs
- `configGuardsInAdvancedSettings(whenText='', objectNames)` -- used in 0 specs
- `configOrderBy(whenText = '', objectLabel, clickSort = false)` -- used in 0 specs
- `configPreferenceInAdvancedSettings(whenText='', oneObjectOption = false, objectLabel1, objectLabel2)` -- used in 0 specs
- `configTimeinAdvancedSettings(whenText='', dimension, value)` -- used in 0 specs
- `confirmCancel()` -- used in 0 specs
- `confirmSave(expSuccess = true)` -- used in 0 specs
- `createBotBySampleData(languageID, isSaaS = false)` -- used in 0 specs
- `createColumnAlias(datasetName, objectName, aliasName)` -- used in 0 specs
- `createNewChat()` -- used in 0 specs
- `deactiveBot()` -- used in 0 specs
- `decertifyBotInTooltip()` -- used in 0 specs
- `deleteAllAllowlistDomains()` -- used in 0 specs
- `deleteAllBlocklistDomains()` -- used in 0 specs
- `deleteAllDomains()` -- used in 0 specs
- `deleteAllPrompts()` -- used in 0 specs
- `deleteBotAlias(botName)` -- used in 0 specs
- `deleteCaches()` -- used in 0 specs
- `deleteChat(name)` -- used in 0 specs
- `deleteChatByIndex(index)` -- used in 0 specs
- `deleteColumnAlias(datasetName, objectName, aliasName)` -- used in 0 specs
- `deleteColumnAliasInInput(aliasName)` -- used in 0 specs
- `deleteCurrentChat()` -- used in 0 specs
- `deleteCustomSuggestionByIndex(index = 0)` -- used in 0 specs
- `deleteExternalLinkByIndex(index = 0)` -- used in 0 specs
- `deleteLatestAllowlistDomain()` -- used in 0 specs
- `deleteLatestBlocklistDomain()` -- used in 0 specs
- `deleteNuggetItem(index = 0)` -- used in 0 specs
- `deletePromptByIndex(index)` -- used in 0 specs
- `deleteRuleByIndex(index)` -- used in 0 specs
- `disableApplyTimeFilter()` -- used in 0 specs
- `disableCustomInstructions()` -- used in 0 specs
- `disableFiscalYear()` -- used in 0 specs
- `disableInterpretation()` -- used in 0 specs
- `disableResearch()` -- used in 0 specs
- `disableSendObjectDescription()` -- used in 0 specs
- `disableShowDescription()` -- used in 0 specs
- `disableTopicPanel()` -- used in 0 specs
- `disableTopicSuggestion()` -- used in 0 specs
- `disableWebSearch()` -- used in 0 specs
- `dismissErrorMessageBoxByClickOkButton()` -- used in 0 specs
- `dismissFocus()` -- used in 0 specs
- `dismissTooltip()` -- used in 0 specs
- `downloadEmbedBotSnippet()` -- used in 0 specs
- `dragAndDropGroupByItem(ruleIndex, sourceIndex, targetIndex)` -- used in 0 specs
- `dragAndDropOrderByItem(ruleIndex, sourceIndex, targetIndex)` -- used in 0 specs
- `dragDropObjectToMapWith(myObjectName, templateObjectName)` -- used in 0 specs
- `duplicateAndApply(name, path, parentFolder = 'Shared Reports')` -- used in 0 specs
- `editAdvancedSettingsRuleItemByIndex(ruleIndex, sectionIndex, itemIndex)` -- used in 0 specs
- `editBasedOnObjectConfigurationItemByIndex(ruleIndex, basedOnObject, configIndex, action)` -- used in 0 specs
- `editBotAlias(botName, aliasName)` -- used in 0 specs
- `editCustomTopicByIndex(index, { title, description })` -- used in 0 specs
- `editFilterByIndex(ruleIndex, filterIndex)` -- used in 0 specs
- `editGroupByByIndex(ruleIndex, groupByIndex)` -- used in 0 specs
- `editOrderByByIndex(ruleIndex, orderByIndex)` -- used in 0 specs
- `enableApplyTimeFilter()` -- used in 0 specs
- `enableCustomInstructions()` -- used in 0 specs
- `enableFiscalYear()` -- used in 0 specs
- `enableInputByClickAlias(dataName, objectName)` -- used in 0 specs
- `enableInterpretation()` -- used in 0 specs
- `enableResearch()` -- used in 0 specs
- `enableSendObjectDescription()` -- used in 0 specs
- `enableShowDescription()` -- used in 0 specs
- `enableTopicPanel()` -- used in 0 specs
- `enableTopicSuggestion()` -- used in 0 specs
- `enableWebSearch()` -- used in 0 specs
- `errorDetail()` -- used in 0 specs
- `exitBotAuthoringWithoutSave()` -- used in 0 specs
- `expandAdvancedSettings(ruleIndex)` -- used in 0 specs
- `expandAskAboutObjectByName(name)` -- used in 0 specs
- `expandBasedOnObjectCollapseArrowByName(ruleIndex, basedOnObject)` -- used in 0 specs
- `expandColumns()` -- used in 0 specs
- `expandQuestion(index = 0)` -- used in 0 specs
- `extractAGGridDataToMarkdown(answerIndex, gridIndex)` -- used in 0 specs
- `extractSpeakerAnswer()` -- used in 0 specs
- `fakeNuggetNameInUI(index = 0)` -- used in 0 specs
- `followUpByIndex(index)` -- used in 0 specs
- `getAdaptiveLearningWarning()` -- used in 0 specs
- `getAdvancedConfigurationTitleText()` -- used in 0 specs
- `getAliasTagByName(templateObject, aliasName)` -- used in 0 specs
- `getAliasTagsForTemplateObject(templateObject)` -- used in 0 specs
- `getAllDatasetObjects()` -- used in 0 specs
- `getAllowlistErrorMessageCount()` -- used in 0 specs
- `getAllowlistItemCount()` -- used in 0 specs
- `getAllowlistLatestErrorMessage()` -- used in 0 specs
- `getApplyTimeFilterSwitchLabelText()` -- used in 0 specs
- `getAttributeFormTemperatureValue()` -- used in 0 specs
- `getBlocklistErrorMessageCount()` -- used in 0 specs
- `getBlocklistItemCount()` -- used in 0 specs
- `getBlocklistLatestErrorMessage()` -- used in 0 specs
- `getBotAliasName()` -- used in 0 specs
- `getBotAliasPreviewText(botName)` -- used in 0 specs
- `getBotAliasWarningText()` -- used in 0 specs
- `getBotDescriptionText(botName)` -- used in 0 specs
- `getBotGreetingText()` -- used in 0 specs
- `getBotIdFromUrl()` -- used in 0 specs
- `getBucketPinCount()` -- used in 0 specs
- `getCachingBucketsCount()` -- used in 0 specs
- `getCertifyInfo()` -- used in 0 specs
- `getChatCount()` -- used in 0 specs
- `getCountOfInterpretation()` -- used in 0 specs
- `getCoverImageSrc()` -- used in 0 specs
- `getCurrentCachingMode()` -- used in 0 specs
- `getDatasetName(index = 0)` -- used in 0 specs
- `getDatasetObjectCount()` -- used in 0 specs
- `getDatasetPanelDatasetTitleName(index = 0)` -- used in 0 specs
- `getDescriptionText(datasetName, objectName)` -- used in 0 specs
- `getDossierIdFromUrl()` -- used in 0 specs
- `getElementName(type, index)` -- used in 0 specs
- `getErrorDetailedMessage(index = 0)` -- used in 0 specs
- `getFollowUpErrorText()` -- used in 0 specs
- `getInactiveBannerText()` -- used in 0 specs
- `getIndexByAnswerText(text)` -- used in 0 specs
- `getInterpretationText()` -- used in 0 specs
- `getLastDownloadedTime()` -- used in 0 specs
- `getLatestAnswerInAIChatbot()` -- used in 0 specs
- `getLatestFollowUpError()` -- used in 0 specs
- `getLLMSQL()` -- used in 0 specs
- `getMetricTemperatureValue()` -- used in 0 specs
- `getNthChatBotAnswerFromEnd(Nth)` -- used in 0 specs
- `getNthParagraphOfTextAnswerFromEndV2(Nth)` -- used in 0 specs
- `getPanelThemeColor()` -- used in 0 specs
- `getProjectIdFromUrl()` -- used in 0 specs
- `getQueryResult()` -- used in 0 specs
- `getQuestionListCount()` -- used in 0 specs
- `getRecommendationByContents(recommendation)` -- used in 0 specs
- `getRecommendationTextByIndex(Index)` -- used in 0 specs
- `getSelectedDatasetText()` -- used in 0 specs
- `getSendObjectDescriptionSwitchLabelText()` -- used in 0 specs
- `getShowDescriptionState()` -- used in 0 specs
- `getSpeakerTemperatureValue()` -- used in 0 specs
- `getSubBotCount()` -- used in 0 specs
- `getTextFromMetrics(elementTypeMetric)` -- used in 0 specs
- `getTitleBarExternalLinkCount()` -- used in 0 specs
- `getTopicItemListLength()` -- used in 0 specs
- `getTotalLearningCaptured()` -- used in 0 specs
- `getUnstructuredDataItemNameText(index = 0)` -- used in 0 specs
- `hasDescriptionVisible()` -- used in 0 specs
- `hasObjectDescription(objectName)` -- used in 0 specs
- `hideDatasetList()` -- used in 0 specs
- `hideDatasetObject(objectName)` -- used in 0 specs
- `hideNameAndTime()` -- used in 0 specs
- `hideSnapshotContent()` -- used in 0 specs
- `hideTimeStampInChatAndSnapshot()` -- used in 0 specs
- `hoverCertifyIcon()` -- used in 0 specs
- `hoverChatAnswerToRemoveSnapshotByIndex(index)` -- used in 0 specs
- `hoverChatBubbleToClickThumbDownByIndex({ index = 0 })` -- used in 0 specs
- `hoverDownloadLearningButton()` -- used in 0 specs
- `hoverDownloadLearningInfoIcon()` -- used in 0 specs
- `hoverMenuItem(text)` -- used in 0 specs
- `hoverOnActiveToggleButton()` -- used in 0 specs
- `hoverOnAnswer()` -- used in 0 specs
- `hoverOnApplyTimeFilterInfoIcon()` -- used in 0 specs
- `hoverOnAttributeFormTemperatureTooltip()` -- used in 0 specs
- `hoverOnBotLogoInfoIcon()` -- used in 0 specs
- `hoverOnBotNameInvalidInputWarningIcon()` -- used in 0 specs
- `hoverOnInvalidUrlIconByIndex(index = 0)` -- used in 0 specs
- `hoverOnLatestAnswer()` -- used in 0 specs
- `hoverOnMetricTemperatureTooltip()` -- used in 0 specs
- `hoverOnMissingFileWarningIcon()` -- used in 0 specs
- `hoverOnNuggetTitle(index = 0)` -- used in 0 specs
- `hoverOnResponseTooltip()` -- used in 0 specs
- `hoverOnSendBtn()` -- used in 0 specs
- `hoverOnSendObjectDescriptionInfoIcon()` -- used in 0 specs
- `hoverOnSpeakerTemperatureTooltip()` -- used in 0 specs
- `hoverOnUnstructuredDataIndicator(answerIndex = 0, indicatorIndex = 0)` -- used in 0 specs
- `hoverSearchBox()` -- used in 0 specs
- `hoverTable(text)` -- used in 0 specs
- `hoverTopicSwitch()` -- used in 0 specs
- `hoverVizPanel(Index)` -- used in 0 specs
- `ifVizGenerated()` -- used in 0 specs
- `inputAllowlistDomain(domain)` -- used in 0 specs
- `inputBackground(background)` -- used in 0 specs
- `inputBackgroundByPaste(background)` -- used in 0 specs
- `inputBlocklistDomain(domain)` -- used in 0 specs
- `inputBotAlias(botName, aliasName)` -- used in 0 specs
- `inputCustomInstructions(instructions, index = 0)` -- used in 0 specs
- `inputDatasetName(text)` -- used in 0 specs
- `inputDeniedAnswer(deniedAnswer)` -- used in 0 specs
- `inputDomain(tag, domain)` -- used in 0 specs
- `inputFormat(format)` -- used in 0 specs
- `inputFormatByPaste(format)` -- used in 0 specs
- `inputQuestionNotSend(question)` -- used in 0 specs
- `inputTermForSearchDropdown(term)` -- used in 0 specs
- `inputTopicsDescriptionByIndex(index, description)` -- used in 0 specs
- `inputTopicTitleByIndex(index, title)` -- used in 0 specs
- `isActiveBotSwitchOn()` -- used in 0 specs
- `isADCToolbarPresent()` -- used in 0 specs
- `isAddBtnOnAllowlistDisabled()` -- used in 0 specs
- `isAddButtonForOtherRulesDisabled(ruleIndex, label)` -- used in 0 specs
- `isAddCustomTopicButtonPresent()` -- used in 0 specs
- `isAdvancedButtonDisplayed()` -- used in 0 specs
- `isAiBotToolbarPresent()` -- used in 0 specs
- `isAIDisabledBannerDisplayed()` -- used in 0 specs
- `isAliasDispalyedForAskAboutObject(name, alias)` -- used in 0 specs
- `isAliasObjDisplayed(index)` -- used in 0 specs
- `isAllowSnapshotSwitchOn()` -- used in 0 specs
- `isApplyTimeFilterEnabled()` -- used in 0 specs
- `isAskAboutPanelObjectByNameDisplayed(name)` -- used in 0 specs
- `isAutoGenerateTopicsButtonPresent()` -- used in 0 specs
- `isAutoSuggestionLimitOptionEnabled(option)` -- used in 0 specs
- `isAutoSuggestionLimitOptionSelected(option)` -- used in 0 specs
- `isBot2WelcomePageDisplayed()` -- used in 0 specs
- `isBotAliasWarningDisplayed()` -- used in 0 specs
- `isBotCertified()` -- used in 0 specs
- `isBotConfigByNameSelected(name)` -- used in 0 specs
- `isBotDescriptionDisabled(botName)` -- used in 0 specs
- `isCacheSettingsDialogDisplayed()` -- used in 0 specs
- `isCalendarSettingsDisabled(index)` -- used in 0 specs
- `isCertifyCheckboxChecked()` -- used in 0 specs
- `isCertifyCheckboxPresent()` -- used in 0 specs
- `isChatBotVizDisplayed(vizType, index = 0)` -- used in 0 specs
- `isChatCategoryOpen(name)` -- used in 0 specs
- `isChatCatgeoryPresent(name)` -- used in 0 specs
- `isChatCurrent(name)` -- used in 0 specs
- `isChatPanelTopicsTitleDisplayed()` -- used in 0 specs
- `isChatPartialNamePresent(partialName)` -- used in 0 specs
- `isChatPresent(name)` -- used in 0 specs
- `isClearHistoryButtonDisplayed()` -- used in 0 specs
- `isColorDisplayedInViz(color, VizIndex = 0)` -- used in 0 specs
- `isColorDisplayedInVizOfSnapshot(color, VizIndex = 0)` -- used in 0 specs
- `isColumnAliasDisabled(datasetName, objectName)` -- used in 0 specs
- `isColumnAliasDisplayed(datasetName, objectName, aliasName)` -- used in 0 specs
- `isColumnCheckedByName(name)` -- used in 0 specs
- `isConfigTabSelected(name)` -- used in 0 specs
- `isConfirmWarningDialogPresent()` -- used in 0 specs
- `isCustomInstructionsEnabled()` -- used in 0 specs
- `isCustomSuggestionDisplayed(suggestion)` -- used in 0 specs
- `isCustomVizDisplayedByType(vizType, index = 0)` -- used in 0 specs
- `isDataContextMenuDisplayed()` -- used in 0 specs
- `isDatasetDescriptionDisabled(datasetName)` -- used in 0 specs
- `isDatasetDisplayed(name)` -- used in 0 specs
- `isDatasetElementDisplayed(data)` -- used in 0 specs
- `isDatasetMenuItemDisplayed(text)` -- used in 0 specs
- `isDatasetObjectSelected(objectName)` -- used in 0 specs
- `isDatasetOptionDisplayed(datasetName)` -- used in 0 specs
- `isDatasetTitleBarDisabled(name)` -- used in 0 specs
- `isDecertifyButtonPresent()` -- used in 0 specs
- `isDeleteCachesButtonDisplayed()` -- used in 0 specs
- `isDeleteSnapShotButtonDisplayed(Index)` -- used in 0 specs
- `isDeleteTopicButtonPresent(index)` -- used in 0 specs
- `isDescriptionDisabled(el)` -- used in 0 specs
- `isDescriptionVisible(datasetName, objectName)` -- used in 0 specs
- `isDidYouMeanCloseButtonDisplayed()` -- used in 0 specs
- `isDidYouMeanPanelDisplayed()` -- used in 0 specs
- `isDisplayBotLogoSettingOn()` -- used in 0 specs
- `isDisplayedDatasetName(name)` -- used in 0 specs
- `isDoNotSaveButtonPresent()` -- used in 0 specs
- `isDownloadLearningButtonEnabled()` -- used in 0 specs
- `isDuplicateAndApplyBtnDisplayed()` -- used in 0 specs
- `isEditIconDisplayedInToolbar()` -- used in 0 specs
- `isEditIconPresentForBasedOnDropdown(objectName)` -- used in 0 specs
- `isEmptyContentPresent()` -- used in 0 specs
- `isEmptySnapshotPanelDisplayed()` -- used in 0 specs
- `isEnableInterpretationSwitchOn()` -- used in 0 specs
- `isEnableSuggestionSwitchOn()` -- used in 0 specs
- `isErrorAnswerDisplayedByIndex(index = 0)` -- used in 0 specs
- `isExportFullDataSwitchOn()` -- used in 0 specs
- `isExportSwitchOn()` -- used in 0 specs
- `isExportToCsvIconDisplayedByLatestAnswer()` -- used in 0 specs
- `isExportToExcelIconDisplayedByLatestAnswer()` -- used in 0 specs
- `isFiscalYearEnabled()` -- used in 0 specs
- `isFollowUpBtnDisplayedByLatestAnswer()` -- used in 0 specs
- `isHistoryPanelPresent()` -- used in 0 specs
- `isInactiveBannerDisplayed()` -- used in 0 specs
- `isInActiveBannerDisplayed()` -- used in 0 specs
- `isInactiveMsgDisplayed()` -- used in 0 specs
- `isInputBoxDisabled()` -- used in 0 specs
- `isInputBoxEnabled()` -- used in 0 specs
- `isInsightsSectionDisplayed()` -- used in 0 specs
- `isInterpretationEnabled()` -- used in 0 specs
- `isInterpretationIconDisplayedInAnswer(index = 0)` -- used in 0 specs
- `isInterpretedAsDisplayed()` -- used in 0 specs
- `isLastDownloadedTimeVisible()` -- used in 0 specs
- `isLearningForgetBtnExisting()` -- used in 0 specs
- `isLearningSectionVisible()` -- used in 0 specs
- `isLineChartInBotExist()` -- used in 0 specs
- `isLinkIconDisplayedOfObject(dataset, object)` -- used in 0 specs
- `isMenuContainerDisplayed()` -- used in 0 specs
- `isNerEnabledForObject(datasetName, objectName)` -- used in 0 specs
- `isNerSwitchChecked(objectName)` -- used in 0 specs
- `isNoContentMessageDisplayed()` -- used in 0 specs
- `isObjectDescriptionDisabled(datasetName, objectName)` -- used in 0 specs
- `isPaletteSelected(palette)` -- used in 0 specs
- `isPaletteSelectIndicatorDisplayed()` -- used in 0 specs
- `isQADisplayed()` -- used in 0 specs
- `isRecommendationPanelPresent()` -- used in 0 specs
- `isRefLearningDisplayed()` -- used in 0 specs
- `isRefreshTopicButtonEnabled(index)` -- used in 0 specs
- `isResearchDisplayed()` -- used in 0 specs
- `isResearchEnabled()` -- used in 0 specs
- `isResponseTooltipDisplayed()` -- used in 0 specs
- `isSaveAndCertifyButtonPresent()` -- used in 0 specs
- `isSaveAsButtonPresent()` -- used in 0 specs
- `isSaveButtonEnabled()` -- used in 0 specs
- `isSaveDialogPresent()` -- used in 0 specs
- `isSearchIconPresent()` -- used in 0 specs
- `isSendObjectDescriptionEnabled()` -- used in 0 specs
- `isSmartSuggestionLoadingBarDisplayed()` -- used in 0 specs
- `isSnapshotButtonDisplayed()` -- used in 0 specs
- `isSnapshotButtonUnpinDisplayed()` -- used in 0 specs
- `isSnapshotCardDisplayed(text)` -- used in 0 specs
- `isSnapshotDialogDisplayed()` -- used in 0 specs
- `isTemperatureDisplayed()` -- used in 0 specs
- `isTitleBarBotNameDisplayed()` -- used in 0 specs
- `isTitleBarDisplayed()` -- used in 0 specs
- `isToastNotificationVisible()` -- used in 0 specs
- `isToBottomBtnDisplayed()` -- used in 0 specs
- `isTopcisPanelEnabled()` -- used in 0 specs
- `isTopicsSuggestionEnabled()` -- used in 0 specs
- `isUsageTileValueCorrect(title, expectedValue)` -- used in 0 specs
- `isUsageTileValueDisplayed(title)` -- used in 0 specs
- `isUsageTileValueHidden(title)` -- used in 0 specs
- `isWarningForBotDisplayed(name)` -- used in 0 specs
- `isWebManagementDisplayed()` -- used in 0 specs
- `isWebSearchDisplayed()` -- used in 0 specs
- `isWebSearchEnabled()` -- used in 0 specs
- `isWelcomePageGreetingTitleDisplayed()` -- used in 0 specs
- `isWelcomePageMessageRecommendationDisplayed()` -- used in 0 specs
- `makeFileUploaderVisible(fileUploderInput)` -- used in 0 specs
- `manipulateTable(elem)` -- used in 0 specs
- `manipulationOnAgGrid(gridIndex, columnName, action, subAction = null)` -- used in 0 specs
- `openAutoSuggestionLimitSelectionDropdown()` -- used in 0 specs
- `openBasedOnDropdown(ruleIndex)` -- used in 0 specs
- `openBotAndAskQuestion(bot, question)` -- used in 0 specs
- `openBotClearHistoryAndAskQuestion({
        projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754', appId, botId, question, })` -- used in 0 specs
- `openBucketByIndex(index = 0)` -- used in 0 specs
- `openBucketByName(text)` -- used in 0 specs
- `openBucketContextMenu(index = 0)` -- used in 0 specs
- `openButtonMenu()` -- used in 0 specs
- `openCacheManager()` -- used in 0 specs
- `openCacheSettings()` -- used in 0 specs
- `openCachingModeDropdown()` -- used in 0 specs
- `openCoverImageEditDialog()` -- used in 0 specs
- `openDatasetContextMenuV2(datasetName, universalBot = false)` -- used in 0 specs
- `openDatasetObjectContextMenuV2(datasetName, objectName)` -- used in 0 specs
- `openDatasetSelector()` -- used in 0 specs
- `openEmbedBotFromInfoWindow()` -- used in 0 specs
- `openEmbedBotFromShareMenu(text = 'Embed Agent')` -- used in 0 specs
- `openEmbedBotLearnMoreLink()` -- used in 0 specs
- `openHideDropdown()` -- used in 0 specs
- `openInterpretationTooltip()` -- used in 0 specs
- `openLinkSettingsTooltip()` -- used in 0 specs
- `openMobileHamburger()` -- used in 0 specs
- `openMobileViewAskAboutPanel()` -- used in 0 specs
- `openPanelTheme()` -- used in 0 specs
- `openQuestionContextMenu(index = 0)` -- used in 0 specs
- `openRecommendationPanel()` -- used in 0 specs
- `openRenamingByRightClick(type, index)` -- used in 0 specs
- `openThemeList()` -- used in 0 specs
- `openViewSQL()` -- used in 0 specs
- `pickCurrencyGBP()` -- used in 0 specs
- `prepareMetricArrayAndCheck(savedMetrics, arrayToBeChecked)` -- used in 0 specs
- `removeAdvancedSettingsRuleItemByIndex(ruleIndex, sectionIndex, itemIndex)` -- used in 0 specs
- `removeAllObjectsSelected(ruleIndex)` -- used in 0 specs
- `removeBasedOnObjectByName(ruleIndex, objectName)` -- used in 0 specs
- `removeBasedOnObjectConfigurationItemByIndex(ruleIndex, basedOnObject, configIndex)` -- used in 0 specs
- `removeColumnAlias(templateObject, alias)` -- used in 0 specs
- `removeFilterByIndex(ruleIndex, filterIndex)` -- used in 0 specs
- `removeGroupByByIndex(ruleIndex, groupByIndex)` -- used in 0 specs
- `removeObjectFromMapWith(mapwithObjectName)` -- used in 0 specs
- `removeOrderByByIndex(ruleIndex, orderByIndex)` -- used in 0 specs
- `removeTopicByIndex(index)` -- used in 0 specs
- `renameAliasName(index, name)` -- used in 0 specs
- `renameAllElementsOfSameType(type, nameToRenameTo)` -- used in 0 specs
- `renameChat(oldaName, newName)` -- used in 0 specs
- `renameDataset(text)` -- used in 0 specs
- `renameRuleByIndex(index, newName)` -- used in 0 specs
- `replaceText({ elem, text })` -- used in 0 specs
- `resetAttributeFormTemperature()` -- used in 0 specs
- `resetBotName()` -- used in 0 specs
- `resetGreeting()` -- used in 0 specs
- `resetMetricTemperature()` -- used in 0 specs
- `resetPanelTheme()` -- used in 0 specs
- `resetQuestionInputHint()` -- used in 0 specs
- `resetSpeakerTemperature()` -- used in 0 specs
- `resetVizPalette()` -- used in 0 specs
- `resizeConfigurationPanel(offset = 200)` -- used in 0 specs
- `reuploadNuggetsFile(fileName, index = 0)` -- used in 0 specs
- `rightClickElementById(type, index)` -- used in 0 specs
- `rightClickOnObjectFromDataset(dataset, object)` -- used in 0 specs
- `save(name = '')` -- used in 0 specs
- `saveAndCertifyBot()` -- used in 0 specs
- `saveAndCloseEditCoverImageDialog()` -- used in 0 specs
- `saveAsADC(adcName)` -- used in 0 specs
- `saveAsBotInMyReports(name)` -- used in 0 specs
- `saveBotBySaveDialog(expSuccess = true)` -- used in 0 specs
- `saveBotWithName(name, path)` -- used in 0 specs
- `saveChanges({ saveConfirm = true, jumpToBotAuthoring = true } = {})` -- used in 0 specs
- `saveConfig()` -- used in 0 specs
- `saveExistingBotV2()` -- used in 0 specs
- `saveSQL()` -- used in 0 specs
- `saveToPath(name, path, parentFolder = 'Shared Reports')` -- used in 0 specs
- `scrollBotPanelHorizontally(toPosition)` -- used in 0 specs
- `scrollCustomInstructionsTo(position)` -- used in 0 specs
- `scrollSnapshotPanelTo(position)` -- used in 0 specs
- `scrollSnapshotPanelToBottom()` -- used in 0 specs
- `scrollSnapshotPanelToTop()` -- used in 0 specs
- `scrollToBottom()` -- used in 0 specs
- `scrollToTop()` -- used in 0 specs
- `searchBuckets(text)` -- used in 0 specs
- `searchChat(searchText)` -- used in 0 specs
- `searchInAskAbout(searchText)` -- used in 0 specs
- `searchInMyObjectsPanel(searchTerm)` -- used in 0 specs
- `selectAdvancedCalendarDropdownBySearch(dropdownTrigger, input, elementName)` -- used in 0 specs
- `selectAdvancedCalendarDropdownOption(dropdownTrigger, datasetName, elementName)` -- used in 0 specs
- `selectBucketContextMenuOption(firstOption, secondOptionIndex)` -- used in 0 specs
- `selectCachingMode(mode)` -- used in 0 specs
- `selectColumnByName(text)` -- used in 0 specs
- `selectCoverImage(index)` -- used in 0 specs
- `selectDatasetAddReplace(dataset)` -- used in 0 specs
- `selectDatasetFromDropdown(datasetName)` -- used in 0 specs
- `selectDropdownOption(dropdownTrigger, optionText)` -- used in 0 specs
- `selectHideOption(name)` -- used in 0 specs
- `selectImageInGalleryByIndex(index = 0)` -- used in 0 specs
- `selectLinkDisplayFormat(format)` -- used in 0 specs
- `selectMultipleObjectsInBasedOnObjectConfigurationDropdown(ruleIndex, basedOnObject, objectNames)` -- used in 0 specs
- `selectQuestionContextMenuOption(firstOption, secondOption)` -- used in 0 specs
- `selectRadioButtonByText(text)` -- used in 0 specs
- `selectUnselectColumnOnAgGrid(columnName, checked = true)` -- used in 0 specs
- `sendPrompt(text)` -- used in 0 specs
- `sendPromptWaitAnswerLoaded(text)` -- used in 0 specs
- `setAttributeFormTemperature(value)` -- used in 0 specs
- `setCustomSuggestionByIndex(index = 0, text)` -- used in 0 specs
- `setExternalLinkByIndex({ index = 0, iconIndex = 0, title, url })` -- used in 0 specs
- `setMetricTemperature(value)` -- used in 0 specs
- `setQuestionLimit(limit)` -- used in 0 specs
- `setSpeakerTemperature(value)` -- used in 0 specs
- `showDetail()` -- used in 0 specs
- `switchBetweenImageCategory(category)` -- used in 0 specs
- `switchToChat(name)` -- used in 0 specs
- `thumbDownByIndex(index)` -- used in 0 specs
- `thumbUpByIndex(index)` -- used in 0 specs
- `tickBotLogoSetting()` -- used in 0 specs
- `toggleActiveSwitch()` -- used in 0 specs
- `toggleAllowSnapshotSwitch()` -- used in 0 specs
- `toggleCheckboxForDatasetObject(objectName)` -- used in 0 specs
- `toggleDisplayBotLogo(flag = true)` -- used in 0 specs
- `toggleEnableInterpretationSwitch()` -- used in 0 specs
- `toggleEnableSuggestionSwitch()` -- used in 0 specs
- `toggleHideSnapshots()` -- used in 0 specs
- `toggleNerSwitchForDatasetObject(objectName)` -- used in 0 specs
- `toggleShowDescription()` -- used in 0 specs
- `triggerBackgroundTooltip()` -- used in 0 specs
- `triggerCloseTooltip()` -- used in 0 specs
- `triggerDeleteLinkTooltip(index)` -- used in 0 specs
- `triggerFormatTooltip()` -- used in 0 specs
- `triggerInvalidUrlTooltip(index)` -- used in 0 specs
- `triggerProgressErrorTooltip(index = 0)` -- used in 0 specs
- `triggerThemeTooltip()` -- used in 0 specs
- `turnOffAllowSnapshot()` -- used in 0 specs
- `turnOffAskAbout()` -- used in 0 specs
- `turnOffAutoComplete()` -- used in 0 specs
- `turnOffEnableInterpretation()` -- used in 0 specs
- `turnOffEnableSuggestion()` -- used in 0 specs
- `turnOffExport()` -- used in 0 specs
- `turnOffExportFullData()` -- used in 0 specs
- `turnOffInsights()` -- used in 0 specs
- `turnOffInterpretation()` -- used in 0 specs
- `turnOffResearch()` -- used in 0 specs
- `turnOffSnapshot()` -- used in 0 specs
- `turnOffSqlTemplate()` -- used in 0 specs
- `turnOffSuggestions()` -- used in 0 specs
- `turnOffWebManagement()` -- used in 0 specs
- `turnOffWebSearch()` -- used in 0 specs
- `turnOnAllowSnapshot()` -- used in 0 specs
- `turnOnAskAbout()` -- used in 0 specs
- `turnOnAutoComplete()` -- used in 0 specs
- `turnOnEnableInterpretation()` -- used in 0 specs
- `turnOnEnableSuggestion()` -- used in 0 specs
- `turnOnExport()` -- used in 0 specs
- `turnOnExportFullData()` -- used in 0 specs
- `turnOnInsights()` -- used in 0 specs
- `turnOnInterpretation()` -- used in 0 specs
- `turnOnResearch()` -- used in 0 specs
- `turnOnSnapshot()` -- used in 0 specs
- `turnOnSqlTemplate()` -- used in 0 specs
- `turnOnSuggestions()` -- used in 0 specs
- `turnOnWebManagement()` -- used in 0 specs
- `turnOnWebSearch()` -- used in 0 specs
- `typeInChatBox(text)` -- used in 0 specs
- `TypeInputBox(input, newValue)` -- used in 0 specs
- `updateBotAlias(botName, aliasName)` -- used in 0 specs
- `updateBotCoverImage({ url = '', category = 'All', index = 0 })` -- used in 0 specs
- `updateBotDescription(botName, newDescription)` -- used in 0 specs
- `updateBotName(name)` -- used in 0 specs
- `updateCoverImageUrl(url)` -- used in 0 specs
- `updateDatasetDescription(datasetName, newDescription)` -- used in 0 specs
- `updateObjectDescription(datasetName, objectName, newDescription)` -- used in 0 specs
- `updatePromptQuesion(index, Q)` -- used in 0 specs
- `updateQuestionInputHint(hint)` -- used in 0 specs
- `uploadNuggetsFile(fileName)` -- used in 0 specs
- `upLoadNuggetsFileError(fileName)` -- used in 0 specs
- `uploadNuggetsFileWorkaround({ fileName, fileUploader, index = 0 })` -- used in 0 specs
- `uploadNuggetsFileWorkaroundNoWait({ fileName, fileUploader = this.getNuggetFileUploadInput()` -- used in 0 specs
- `validate_content_in_dashboard_action(diagData, content = [])` -- used in 0 specs
- `validate_data_on_requirement(requirement, summary, data = null)` -- used in 0 specs
- `validatePromptCardDisplayed(promptTitle)` -- used in 0 specs
- `verifyAnswerContainsKeywords(words, ignoreCase = true)` -- used in 0 specs
- `verifyAnswerContainsOneOfKeywords(words, ignoreCase = true)` -- used in 0 specs
- `verifyAskAboutObjectElementList(index, expectedText)` -- used in 0 specs
- `verifyAskAboutObjectStateByIndex(index, expectedState)` -- used in 0 specs
- `verifyElementFont(element, expectedFont, elementName)` -- used in 0 specs
- `verifyQuestionsGivenAttributeAndMetric(question, metricNames, screenshotSuffix, testCase = 'TC93244')` -- used in 0 specs
- `verifySQL()` -- used in 0 specs
- `waitClearHistoryEnabled()` -- used in 0 specs
- `waitForAnswerSettled(timeout = this.DEFAULT_LOADING_TIMEOUT, interval = 1000)` -- used in 0 specs
- `waitForExportComplete()` -- used in 0 specs
- `waitForImageLoaded(elem)` -- used in 0 specs
- `waitForInsightsSettled(timeout = this.DEFAULT_LOADING_TIMEOUT, interval = 1000)` -- used in 0 specs
- `waitForLoaded()` -- used in 0 specs
- `waitForMessageBoxDisplay()` -- used in 0 specs
- `waitForNerCurtainDisappear(datasetName, objectName)` -- used in 0 specs
- `waitForNerSwitchSpinnerAppear(objectName)` -- used in 0 specs
- `waitForNerSwitchSpinnerDisappear(objectName)` -- used in 0 specs
- `waitForNuggetsItemsLoaded()` -- used in 0 specs
- `waitForPageLoading()` -- used in 0 specs
- `waitForRecommendationSkeletonDisappear()` -- used in 0 specs
- `waitForSaveAsButtonClickable()` -- used in 0 specs
- `waitForSearchContainerDisplayed()` -- used in 0 specs
- `waitForSnapshotCardLoaded(index = 0)` -- used in 0 specs
- `waitForToastGone()` -- used in 0 specs
- `waitForUnstructuredDataTooltipSpinnerDisappear()` -- used in 0 specs

## Source Coverage

- `pageObjects/aibot/**/*.js`
- `specs/regression/aibotAdvancedMode/**/*.{ts,js}`
- `specs/regression/aibotChatPanel/**/*.{ts,js}`
- `specs/regression/aibotDatasetContextMenu/**/*.{ts,js}`
- `specs/regression/aibotDatasetFolderStructure/**/*.{ts,js}`
- `specs/regression/aibotDatasetPanel/**/*.{ts,js}`
- `specs/regression/aibotKnowledgeNuggets/**/*.{ts,js}`
- `specs/regression/aibotMultiDataset/**/*.{ts,js}`
- `specs/regression/aibotSnapshotsPanel/**/*.{ts,js}`
- `specs/regression/aibotSnapshotsPanel/data_backup/**/*.{ts,js}`
