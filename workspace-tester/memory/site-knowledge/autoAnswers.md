# Site Knowledge: autoAnswers

> Components: 4

### AIAssistant
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AIIconContainer` | `.mstrd-ChatNavItemContainer` | element |
| `AIIcon` | `.mstr-nav-icon.icon-mstrd_tb_ai_assistant_a,.icon-mstrd_tb_ai_assistant_n` | element |
| `AssistantContainer` | `.mstrd-ChatDropdownMenuContainer` | dropdown |
| `AssistantWelcompage` | `.mstrd-ChatPanelContainer-welcome` | element |
| `AIContext` | `.mstrd-ChatDropdownMenuContainer-panel span[data-test-chat-panel-viz-key]` | dropdown |
| `ClearConfirmationContainer` | `.mstrd-ConfirmationDialog` | element |
| `ChatBotVizFocusModal` | `.mstrd-ChatPanelVisualizationFocus-modal` | element |
| `LoadingChatBubble` | `.single-loading-spinner` | element |
| `SuggestionPopup` | `.mstr-chatbot-suggestion-popup` | element |
| `Tooltip` | `.ant-tooltip .ant-tooltip-inner` | element |
| `ShowErrorMessage` | `.mstr-design-collapse-header__title` | element |
| `ErrorDetailedMessage` | `.mstr-design-error-message-content__details-title` | element |
| `Disclaimer` | `.mstr-chatbot-chat-panel__footnote` | element |

**Actions**
| Signature |
|-----------|
| `getRecommendationText(index = 1)` |
| `getLatestAnswer()` |
| `getLatestAnswerText()` |
| `getLatestQuestion()` |
| `getLatestQuotedMessage()` |
| `mockTimeInQuotedMessageInInputBox()` |
| `mockTimeInQuotedMessage()` |
| `isFollowUpBubbleExistInQuestion()` |
| `isFollowUpBubbleExistInInputBox()` |
| `isFollowUpExistInActionButtons()` |
| `getAnswerTextAndNuggetsCollectionsFromState(index = 1)` |
| `getQuestionId(index = 1)` |
| `getHistoryMessages()` |
| `waitForAllOpenEndedAnswers(alternatives)` |
| `getDidYouMeanContainer()` |
| `getSmartSuggestionItem(index = 1)` |
| `getErrorDetailedMessage()` |
| `clickShowErrorDetails()` |
| `getVizInsideBot()` |
| `open()` |
| `waitForAIReady()` |
| `openAndPin()` |
| `close(icon = 'close')` |
| `clickClearBtn()` |
| `selectClearConfirmationBtn(text = 'Yes')` |
| `clearHistory()` |
| `input(text)` |
| `inputByPaste()` |
| `deleteContext()` |
| `clearInput(el = this.getInputArea()` |
| `pin()` |
| `unpin()` |
| `hoverLearMoreBtn()` |
| `expandRecommendation()` |
| `collapseRecommendation()` |
| `sendQuestionByRecommendation(index = 1)` |
| `sendQuestion()` |
| `sendQuestionAndWaitForAnswer()` |
| `inputAndSendQuestion(text)` |
| `cancelQuestion()` |
| `clickLatestVizInsideBot()` |
| `copyAnswerAsImage(index)` |
| `copyImageFromLatestAnswer()` |
| `hoverAnswer(index = 1)` |
| `clickFollowUp(index = 1)` |
| `closeFollowUpBubble()` |
| `clickAskAgainOnLatestQuestion()` |
| `copyToQuetyFromRecommendation(index = 1)` |
| `seeMoreFromLatestAnswer()` |
| `seeLessFromLatestAnswer()` |
| `refreshRecommendation()` |
| `clickMaxMinBtn()` |
| `maximizeChatbotVisualization(index = 0)` |
| `maximizeLatestChatbotVisualization()` |
| `closeChatbotVizFocusModal()` |
| `copyAsImageInVizFocusModal()` |
| `showInterpretationInVizFocusModal()` |
| `clickSeeMoreOrLessBtnOnVizFocusModal()` |
| `selectViz(vizName)` |
| `sendQuestionWithTextAndObject(inputs)` |
| `inputQuestionWithTextAndObject(item)` |
| `waitTillAnswerAppears()` |
| `getSuggetionListTexts()` |
| `hoverAIAssistantIcon()` |
| `hoverFilterIndicatorInAnswer(index = 1)` |
| `isAIAssistantPresent()` |
| `isAAPinned()` |
| `isCloseIconPresented()` |
| `isPinIconPresented()` |
| `getContext()` |
| `isContextPresent()` |
| `isRecommendationCollapsed()` |
| `isRecommendationRefreshDisabled()` |
| `totalAnswers()` |
| `isClearBtnDisabled()` |
| `isWelcomePagePresent()` |
| `isAAMaximized()` |
| `isSuggestionPresent()` |
| `getSuggestionCount()` |
| `isAnswerContainsOneOfKeywords(words, ignoreCase = true)` |
| `clickSmartSuggestion(index = 1)` |
| `copySmartSuggestionToQuery(index = 1)` |
| `closeDidYouMean()` |
| `waitTillDidYouMeanDataReady()` |
| `getNumberOfSmartSuggestions()` |
| `isDidYouMeanExisting()` |
| `isTooltipPresent()` |
| `getTooltipText()` |
| `isRecommendationListContainsChinese()` |
| `isLatestAnswerContainsChinese()` |
| `containsChinese(text)` |
| `getPlacehoderTextInInputArea()` |
| `isSeeMoreBtnPresent()` |
| `isSeeLessBtnPresent()` |
| `clickForgetLearningBtn(index)` |
| `isLearningLoadingIconDisplayed(index)` |
| `isLearningResultsDisplayed(index)` |
| `getDisclaimerText()` |
| `isDisclaimerPresent()` |
| `isAIAssistantDisabled()` |
| `isDataLimitDisplayed(index = 1)` |
| `isFilterIndicatorDisplayedInAnswer(index)` |
| `isMaxMinBtnDisplayed()` |
| `getAnswersWithVizCount()` |
| `isThumbDownButtonHighlighted(index)` |
| `isThumbDownButtonVisible(index)` |
| `isThumbDownButtonVisibleOnHover(index)` |
| `isThumbDownButtonClickable(index)` |
| `isFeedbackDialogVisible(index)` |
| `isFeedbackSubmitButtonClickable(index)` |
| `isFeedbackSubmitButtonVisible(index)` |
| `isFeedbackSubmitButtonDisabled(index)` |
| `isFeedbackCategoryButtonSelected(index, categoryIndex)` |
| `isThanksForYourFeedbackVisible(index)` |
| `isLearningLoadingVisible(index)` |
| `isFocusMaxIconVisible(index = 0)` |
| `isFocuseModalPresent()` |
| `isSeeMoreLessBtnExpandedOnFocusModal()` |
| `getMesseageCount()` |
| `clickThumbDown(index)` |
| `clickThumbDownSelected(index)` |
| `clickFeedbackTag(feedbackIndex, tagIndex)` |
| `inputFeedbackMessage(index, content)` |
| `submitFeedback(index)` |
| `closeFeedbackDialog(index)` |
| `isTextInSuggestionList(text)` |
| `checkChatbotInputArea(testCase, imageName, tolerance)` |
| `sendPrompt(text)` |
| `vizCreationByChat(pagePrompt)` |
| `clearHistoryVizCreationByChat(pagePrompt)` |
| `checkChatbotVizByIndex(index = 0, testCase, imageName, tolerance)` |
| `checkChatbotLatestViz(testCase, imageName, tolerance)` |
| `checkChatbotMaximizeViz(testCase, imageName, tolerance)` |

**Sub-components**
- getAssistantContainer
- getClearConfirmationContainer
- getRecommendationContainer
- getInputboxContainer
- getAnswerActionsContainer
- getDidYouMeanContainer
- getFeedbackContainer
- getAIIconContainer

---

### AIViz
> Extends: `AIAssistant`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `hoverInfoIconInLinechart(index = 1)` |
| `hoverLatestInfoIconInLinechart()` |
| `hoverMapbox(index = 1, focusMode = false)` |
| `getBarsCountInBarChart(index = 1, focusMode = false)` |
| `getInsightLinechartCount(focusMode = false)` |
| `getHeatMapCount(focusMode = false)` |
| `getKPICount(focusMode = false)` |
| `getGMVizCount(focusMode = false)` |
| `getMapboxCount(focusMode = false)` |
| `isInsightLinechartInfoTooltipPresent()` |
| `getInsightLineChartVeticalLabelText(index = 1, focusMode = false)` |
| `getFirstTextInPieChart(index = 1, focusMode = false)` |
| `isRightBoxOnMapboxPresent(index = 1, focusMode = false)` |

**Sub-components**
- getAssistantContainer
- getGMVizContainer
- getInsightLinechartContainer
- getHeatMapContainer
- getKPIContainer
- getMapboxContainer

---

### Interpretation
> Extends: `AIAssistant`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `CILoadingSpinner` | `.mstr-ai-chatbot-CILoading-spinner` | element |

**Actions**
| Signature |
|-----------|
| `getMessageCount()` |
| `getLatestInterpretation()` |
| `getLatestCIIcon()` |
| `getContentInComponents(index = 1)` |
| `clickCIFromAnswer(index, turnOn = true)` |
| `generateCIFromLatestAnswer()` |
| `closeLatestCI()` |
| `askAgainFromLatestCI()` |
| `copyLLMFromLatestCI()` |
| `getLatestCIText()` |
| `hideInterpretationInVizFocusModal()` |
| `hoverLearningContent(answerIndex = 1, learningIndex = 1)` |
| `forgetLearningContent(answerIndex = 1, learningIndex = 1)` |
| `waitForLearningInfoVisible(index = 1)` |
| `isCIBtnActive(index)` |
| `isLatestCIBtnActive()` |
| `getCIContentsCount()` |
| `isInterpretationSectionVisible(index = 1)` |
| `isInterPretationPresentInFocusModal()` |
| `isLearningInfoDisplayed(index = 1)` |

**Sub-components**
- getAssistantContainer

---

### Learning
> Extends: `AIAssistant`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `LearningTooltip` | `.mstrd-ChatPanelUserLearningTooltip` | element |

**Actions**
| Signature |
|-----------|
| `getLearningResult(index)` |
| `getLearningText(index)` |
| `clickLearningIndicator({ index = 1, focusMode = false })` |
| `clickLearnMoreLinkOnTooltip()` |
| `isLearningSectionDisplayed(index)` |
| `getChatAnwserCount()` |
| `getLastOrDefaultAnswerIndex(index)` |
| `isLearningIndicatorDisplayed({ index = 1, focusMode = false })` |

**Sub-components**
_none_
