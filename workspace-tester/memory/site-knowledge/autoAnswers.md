# Site Knowledge: AutoAnswers (AI Assistant) Domain

## Overview

- **Domain key:** `autoAnswers`
- **Components covered:** AIAssistant, AIViz, Interpretation, Learning
- **Spec files scanned:** 14
- **POM files scanned:** 4

## Components

### AIAssistant
- **CSS root:** `.mstrd-ChatNavItemContainer`
- **User-visible elements:**
  - AIContext (`.mstrd-ChatDropdownMenuContainer-panel span[data-test-chat-panel-viz-key]`)
  - AIIcon (`.mstr-nav-icon.icon-mstrd_tb_ai_assistant_a,.icon-mstrd_tb_ai_assistant_n`)
  - AIIcon Container (`.mstrd-ChatNavItemContainer`)
  - Assistant Container (`.mstrd-ChatDropdownMenuContainer`)
  - Assistant Welcompage (`.mstrd-ChatPanelContainer-welcome`)
  - Chat Bot Viz Focus Modal (`.mstrd-ChatPanelVisualizationFocus-modal`)
  - Clear Confirmation Container (`.mstrd-ConfirmationDialog`)
  - Disclaimer (`.mstr-chatbot-chat-panel__footnote`)
  - Error Detailed Message (`.mstr-design-error-message-content__details-title`)
  - Loading Chat Bubble (`.single-loading-spinner`)
  - Show Error Message (`.mstr-design-collapse-header__title`)
  - Suggestion Popup (`.mstr-chatbot-suggestion-popup`)
  - Tooltip (`.ant-tooltip .ant-tooltip-inner`)
- **Component actions:**
  - `cancelQuestion()`
  - `checkChatbotInputArea(testCase, imageName, tolerance)`
  - `checkChatbotLatestViz(testCase, imageName, tolerance)`
  - `checkChatbotMaximizeViz(testCase, imageName, tolerance)`
  - `checkChatbotVizByIndex(index = 0, testCase, imageName, tolerance)`
  - `clearHistory()`
  - `clearHistoryVizCreationByChat(pagePrompt)`
  - `clearInput(el = this.getInputArea()`
  - `clickAskAgainOnLatestQuestion()`
  - `clickClearBtn()`
  - `clickFeedbackTag(feedbackIndex, tagIndex)`
  - `clickFollowUp(index = 1)`
  - `clickForgetLearningBtn(index)`
  - `clickLatestVizInsideBot()`
  - `clickMaxMinBtn()`
  - `clickSeeMoreOrLessBtnOnVizFocusModal()`
  - `clickShowErrorDetails()`
  - `clickSmartSuggestion(index = 1)`
  - `clickThumbDown(index)`
  - `clickThumbDownSelected(index)`
  - `close(icon = 'close')`
  - `closeChatbotVizFocusModal()`
  - `closeDidYouMean()`
  - `closeFeedbackDialog(index)`
  - `closeFollowUpBubble()`
  - `collapseRecommendation()`
  - `containsChinese(text)`
  - `copyAnswerAsImage(index)`
  - `copyAsImageInVizFocusModal()`
  - `copyImageFromLatestAnswer()`
  - `copySmartSuggestionToQuery(index = 1)`
  - `copyToQuetyFromRecommendation(index = 1)`
  - `deleteContext()`
  - `expandRecommendation()`
  - `getAnswersWithVizCount()`
  - `getAnswerTextAndNuggetsCollectionsFromState(index = 1)`
  - `getContext()`
  - `getDidYouMeanContainer()`
  - `getDisclaimerText()`
  - `getErrorDetailedMessage()`
  - `getHistoryMessages()`
  - `getLatestAnswer()`
  - `getLatestAnswerText()`
  - `getLatestQuestion()`
  - `getLatestQuotedMessage()`
  - `getMesseageCount()`
  - `getNumberOfSmartSuggestions()`
  - `getPlacehoderTextInInputArea()`
  - `getQuestionId(index = 1)`
  - `getRecommendationText(index = 1)`
  - `getSmartSuggestionItem(index = 1)`
  - `getSuggestionCount()`
  - `getSuggetionListTexts()`
  - `getTooltipText()`
  - `getVizInsideBot()`
  - `hoverAIAssistantIcon()`
  - `hoverAnswer(index = 1)`
  - `hoverFilterIndicatorInAnswer(index = 1)`
  - `hoverLearMoreBtn()`
  - `input(text)`
  - `inputAndSendQuestion(text)`
  - `inputByPaste()`
  - `inputFeedbackMessage(index, content)`
  - `inputQuestionWithTextAndObject(item)`
  - `isAAMaximized()`
  - `isAAPinned()`
  - `isAIAssistantDisabled()`
  - `isAIAssistantPresent()`
  - `isAnswerContainsOneOfKeywords(words, ignoreCase = true)`
  - `isClearBtnDisabled()`
  - `isCloseIconPresented()`
  - `isContextPresent()`
  - `isDataLimitDisplayed(index = 1)`
  - `isDidYouMeanExisting()`
  - `isDisclaimerPresent()`
  - `isFeedbackCategoryButtonSelected(index, categoryIndex)`
  - `isFeedbackDialogVisible(index)`
  - `isFeedbackSubmitButtonClickable(index)`
  - `isFeedbackSubmitButtonDisabled(index)`
  - `isFeedbackSubmitButtonVisible(index)`
  - `isFilterIndicatorDisplayedInAnswer(index)`
  - `isFocuseModalPresent()`
  - `isFocusMaxIconVisible(index = 0)`
  - `isFollowUpBubbleExistInInputBox()`
  - `isFollowUpBubbleExistInQuestion()`
  - `isFollowUpExistInActionButtons()`
  - `isLatestAnswerContainsChinese()`
  - `isLearningLoadingIconDisplayed(index)`
  - `isLearningLoadingVisible(index)`
  - `isLearningResultsDisplayed(index)`
  - `isMaxMinBtnDisplayed()`
  - `isPinIconPresented()`
  - `isRecommendationCollapsed()`
  - `isRecommendationListContainsChinese()`
  - `isRecommendationRefreshDisabled()`
  - `isSeeLessBtnPresent()`
  - `isSeeMoreBtnPresent()`
  - `isSeeMoreLessBtnExpandedOnFocusModal()`
  - `isSuggestionPresent()`
  - `isTextInSuggestionList(text)`
  - `isThanksForYourFeedbackVisible(index)`
  - `isThumbDownButtonClickable(index)`
  - `isThumbDownButtonHighlighted(index)`
  - `isThumbDownButtonVisible(index)`
  - `isThumbDownButtonVisibleOnHover(index)`
  - `isTooltipPresent()`
  - `isWelcomePagePresent()`
  - `maximizeChatbotVisualization(index = 0)`
  - `maximizeLatestChatbotVisualization()`
  - `mockTimeInQuotedMessage()`
  - `mockTimeInQuotedMessageInInputBox()`
  - `open()`
  - `openAndPin()`
  - `pin()`
  - `refreshRecommendation()`
  - `seeLessFromLatestAnswer()`
  - `seeMoreFromLatestAnswer()`
  - `selectClearConfirmationBtn(text = 'Yes')`
  - `selectViz(vizName)`
  - `sendPrompt(text)`
  - `sendQuestion()`
  - `sendQuestionAndWaitForAnswer()`
  - `sendQuestionByRecommendation(index = 1)`
  - `sendQuestionWithTextAndObject(inputs)`
  - `showInterpretationInVizFocusModal()`
  - `submitFeedback(index)`
  - `totalAnswers()`
  - `unpin()`
  - `vizCreationByChat(pagePrompt)`
  - `waitForAIReady()`
  - `waitForAllOpenEndedAnswers(alternatives)`
  - `waitTillAnswerAppears()`
  - `waitTillDidYouMeanDataReady()`
- **Related components:** getAIIconContainer, getAnswerActionsContainer, getAssistantContainer, getClearConfirmationContainer, getDidYouMeanContainer, getFeedbackContainer, getInputboxContainer, getRecommendationContainer

### AIViz
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `getBarsCountInBarChart(index = 1, focusMode = false)`
  - `getFirstTextInPieChart(index = 1, focusMode = false)`
  - `getGMVizCount(focusMode = false)`
  - `getHeatMapCount(focusMode = false)`
  - `getInsightLinechartCount(focusMode = false)`
  - `getInsightLineChartVeticalLabelText(index = 1, focusMode = false)`
  - `getKPICount(focusMode = false)`
  - `getMapboxCount(focusMode = false)`
  - `hoverInfoIconInLinechart(index = 1)`
  - `hoverLatestInfoIconInLinechart()`
  - `hoverMapbox(index = 1, focusMode = false)`
  - `isInsightLinechartInfoTooltipPresent()`
  - `isRightBoxOnMapboxPresent(index = 1, focusMode = false)`
- **Related components:** getAssistantContainer, getGMVizContainer, getHeatMapContainer, getInsightLinechartContainer, getKPIContainer, getMapboxContainer

### Interpretation
- **CSS root:** `.mstr-ai-chatbot-CILoading-spinner`
- **User-visible elements:**
  - CILoading Spinner (`.mstr-ai-chatbot-CILoading-spinner`)
- **Component actions:**
  - `askAgainFromLatestCI()`
  - `clickCIFromAnswer(index, turnOn = true)`
  - `closeLatestCI()`
  - `copyLLMFromLatestCI()`
  - `forgetLearningContent(answerIndex = 1, learningIndex = 1)`
  - `generateCIFromLatestAnswer()`
  - `getCIContentsCount()`
  - `getContentInComponents(index = 1)`
  - `getLatestCIIcon()`
  - `getLatestCIText()`
  - `getLatestInterpretation()`
  - `getMessageCount()`
  - `hideInterpretationInVizFocusModal()`
  - `hoverLearningContent(answerIndex = 1, learningIndex = 1)`
  - `isCIBtnActive(index)`
  - `isInterPretationPresentInFocusModal()`
  - `isInterpretationSectionVisible(index = 1)`
  - `isLatestCIBtnActive()`
  - `isLearningInfoDisplayed(index = 1)`
  - `waitForLearningInfoVisible(index = 1)`
- **Related components:** getAssistantContainer

### Learning
- **CSS root:** `.mstrd-ChatPanelUserLearningTooltip`
- **User-visible elements:**
  - Learning Tooltip (`.mstrd-ChatPanelUserLearningTooltip`)
- **Component actions:**
  - `clickLearningIndicator({ index = 1, focusMode = false })`
  - `clickLearnMoreLinkOnTooltip()`
  - `getChatAnwserCount()`
  - `getLastOrDefaultAnswerIndex(index)`
  - `getLearningResult(index)`
  - `getLearningText(index)`
  - `isLearningIndicatorDisplayed({ index = 1, focusMode = false })`
  - `isLearningSectionDisplayed(index)`
- **Related components:** _none_

## Common Workflows (from spec.ts)

1. [AutoAnswer_GUI_${test.case_id}] (used in 1 specs)
2. [TC90175_01] Auto Answer Viz - Sanity Forecast Trend Line (used in 1 specs)
3. [TC90175_02] Auto Answer Viz - Sanity Heatmap (used in 1 specs)
4. [TC90175_03] Auto Answer Viz - Sanity KPI (used in 1 specs)
5. [TC90175_04] Auto Answer Viz - Sanity Barchart (used in 1 specs)
6. [TC90175_05] Auto Answer Viz - Sanity Mapbox (used in 1 specs)
7. [TC91718_01] Auto Answers Focus Mode - Action buttons on focus mode widdow (used in 1 specs)
8. [TC91718_02] Auto Answers Focus Mode - Maxmum icon hide/display in different scenarios (used in 1 specs)
9. [TC91719] Auto Answers E2E - Sanity auto answer in mobile view (used in 1 specs)
10. [TC91974] Auto Anwers Clear History - Clear auto answer history list (used in 1 specs)
11. [TC91975_01] Auto Answers Keep Content - Keep content when switch page (used in 1 specs)
12. [TC91975_01] Auto Answers Keep Content - Keep content when undo, reset, re-open panel (used in 1 specs)
13. [TC91976] Auto Answers Data Limit when data points > 8 (used in 1 specs)
14. [TC91993] DE275563 - Negative values in forecast visualization (used in 1 specs)
15. [TC91995] Auto Answer Viz - Viz style is not impacted by customized dashboard theme and format (used in 1 specs)
16. [TC92051] DE276241 - Indefinite loading visulization after bar charts (used in 1 specs)
17. [TC92896] DE278236 - Data labels check % for Pie Chart (used in 1 specs)
18. [TC93089] Auto Answers selected viz and targeting indicator (used in 1 specs)
19. [TC93973_1] E2E | vizSubtypeSQL_1 (used in 1 specs)
20. [TC93973_2] E2E | vizSubtypeSQL_2 (used in 1 specs)
21. [TC93973_3] E2E | vizSubtypeSQL_3 (used in 1 specs)
22. [TC93973_4] E2E | vizDropzoneSanity (used in 1 specs)
23. [TC93973_5] E2E | e2EAQ_1 (used in 1 specs)
24. [TC93973_6] E2E | e2EAQ_2 (used in 1 specs)
25. [TC93973_7] E2E | SelectGridAQ (used in 1 specs)
26. [TC94333_1] Show smart suggestions for ambiguous question with text answer (used in 1 specs)
27. [TC94333_2] Show smart suggestions for ambiguous question with viz answer (used in 1 specs)
28. [TC94333_3] Check request for follow up questions (used in 1 specs)
29. [TC94333_4] No smart suggestion for unambiguous question (used in 1 specs)
30. [TC94333_5] Copy smart suggestion to query box (used in 1 specs)
31. [TC94333_6] Dismiss smart suggestion (used in 1 specs)
32. [TC94333_7] Color theme for smart suggestion (used in 1 specs)
33. [TC94700_01] Validate E2E workflow for Thumb down and Feedback (used in 1 specs)
34. [TC94700_02] Validate provide feedback (used in 1 specs)
35. [TC94700_03] Validate dismiss feedback (used in 1 specs)
36. [TC94700_04] Validate open multiple feedback dialogs (used in 1 specs)
37. [TC94700_05] Validate message for feedback dialog (used in 1 specs)
38. [TC94700_06] Validate responsive view for feedback dialog (used in 1 specs)
39. [TC94701_01] Validate X-Func with other auto answer features (used in 1 specs)
40. [TC94701_02] Validate X-Func with custom app (used in 1 specs)
41. [TC94996_01] Auto Answers Disclaimer - Default disclaimer (used in 1 specs)
42. [TC94996_02] Auto Answers Disclaimer - Customzied disclaimer (used in 1 specs)
43. [TC95008_1] learned from smart suggestion (used in 1 specs)
44. [TC95008_2] no learning returned when try to learn from smart suggestion (used in 1 specs)
45. [TC95008_3] learned from feedback (used in 1 specs)
46. [TC95008_4] no learning is triggered when tag is Response speed/Other without comment (used in 1 specs)
47. [TC95008_5] submit tag and comment, learning is triggered, no learned result is returned (used in 1 specs)
48. [TC95009_1] check learning component on answer bubble under dark theme (used in 1 specs)
49. [TC95009_2] check no learning by smart suggestion in custom app disable learning (used in 1 specs)
50. [TC95009_3] check no learning by feedback in custom app disable learning (used in 1 specs)
51. [TC95009_4] check long learning result on answer bubble under dark theme (used in 1 specs)
52. [TC95016_01] Auto Answers E2E - QA in auto answers (used in 1 specs)
53. [TC95016_02] Auto Answers E2E - Recommendation in auto answer (used in 1 specs)
54. [TC95016_03] Auto Answers E2E - Auto answer general UI (used in 1 specs)
55. [TC95016_04] Auto Answers E2E - Auto complete in auto answer (used in 1 specs)
56. [TC95016_05] Auto Answers E2E - Interpretation in auto answer (used in 1 specs)
57. [TC95016_06] color theme in auto answer (used in 1 specs)
58. [TC95016_07] I18n in auto answer - Chinese (used in 1 specs)
59. [TC95016_08] Auto Answers Copy answer as images (used in 1 specs)
60. [TC95282_01] DE273584 viz context handle during retry (used in 1 specs)
61. [TC95282_04] DE272158 when openning auto answer in the dossier that with empty dataset, the dossier will turn to be blank (used in 1 specs)
62. [TC95282_05] DE274096 consolidation attribute type should be correctly recognized (used in 1 specs)
63. [TC95282_06] DE274407 existing metric limit lost when appending view filter (used in 1 specs)
64. [TC95282_07] DE271989 do manipulation after sending question (used in 1 specs)
65. [TC95282_08] DE273580 Invalid template unit key error for view filter cases (used in 1 specs)
66. [TC95282_09] DE280326_refresh instance after rbd error (used in 1 specs)
67. [TC95282_10] Cancel handling case (used in 1 specs)
68. [TC95282_11] DE270321_chatbot disabled for dossier not in library (used in 1 specs)
69. [TC95282_12] DE270570/DE272980_ask question not trigger undo button and empty returned data (used in 1 specs)
70. [TC95282_13] DE297832: auto answer hang when the dossier has the setting of auto-refresh (used in 1 specs)
71. [TC95282_14]DE296373-Refine the error message when the data points over 100k (used in 1 specs)
72. [TC95282_15] DE305237 XSS when copy to query box is clicked (used in 1 specs)
73. [TC95328_01] Object scope in Auto Answers - send question with attribute (used in 1 specs)
74. [TC95328_02] Object scope in Auto Answers - send question with metric (used in 1 specs)
75. [TC95328_03] Object scope in Auto Answers - send question with alias and derived (used in 1 specs)
76. [TC95410_1] Custom app pre-configure pin auto answer panel and allow close (used in 1 specs)
77. [TC95410_2] Custom app pre-configure pin auto answer panel and do not allow close (used in 1 specs)
78. [TC95410_3] No pre-config, open and pin auto answer panel, and re-execute dashboard (used in 1 specs)
79. [TC95411_1] Custom app configure pin filter(right) and auto answer panel (used in 1 specs)
80. [TC95411_2] Custom app configure pin comment and auto answer panel (used in 1 specs)
81. [TC95411_3] Check auto answer pin status in different dashboards (used in 1 specs)
82. [TC95412_1] Check auto answer pin status when switch custom app (used in 1 specs)
83. [TC95412_2] Check auto answer pin status in home dashboard (used in 1 specs)
84. [TC95422_01] collapse related suggestion when type question (used in 1 specs)
85. [TC95422_02] collapse related suggestion when answer back with did you mean (used in 1 specs)
86. [TC95422_03] keep related suggestion collapsed after user manually collapse it (used in 1 specs)
87. [TC95422_04] same with default state after user manually expand it (used in 1 specs)
88. [TC95538_1] explicitly quote a question (used in 1 specs)
89. [TC95538_2] non-explicitly quote question (used in 1 specs)
90. [TC95538_3] check explicitly quoted question for smart suggestion by click (used in 1 specs)
91. [TC95538_4] check explicitly quoted question for smart suggestion by ask again (used in 1 specs)
92. [TC95538_5] check non-explicitly quoted question for smart suggestion by click (used in 1 specs)
93. [TC95538_6] check delete follow-up bubble (used in 1 specs)
94. [TC95538_7] check click ask again on a follow-up question (used in 1 specs)
95. [TC95539_1] no follow up button for error answer (used in 1 specs)
96. [TC95539_2] check follow up UI in dark mode (used in 1 specs)
97. [TC95929_01] Auto complete in Auto Answers - normal attribute (used in 1 specs)
98. [TC95929_02] Auto complete in Auto Answers - normal metric (used in 1 specs)
99. [TC95929_03] Auto complete in Auto Answers - attribute and metric with alias (used in 1 specs)
100. [TC95929_04] Auto complete in Auto Answers - derived attribut and metric (used in 1 specs)
101. [TC95929_05] Auto complete in Auto Answers - auto complete list order (used in 1 specs)
102. [TC96813_01] Learning indicator - learning indicator on compact mode (used in 1 specs)
103. [TC96813_02] Learning indicator - learning indicator on focus mode (used in 1 specs)
104. [TC96813_03] Learning indicator - forget the learning (used in 1 specs)
105. [TC96813_04] Learning indicator - Learning indicator in dark theme (used in 1 specs)
106. [TC98354] Check history info in the payload of learning request (used in 1 specs)
107. Auto Answer Smart Suggestion Test (used in 1 specs)
108. Auto Answers Feedback (used in 1 specs)
109. Auto Answers Follow Up (used in 1 specs)
110. Auto Answers General Viz (used in 1 specs)
111. Auto Answers GUI (used in 1 specs)
112. Auto Answers Learning (used in 1 specs)
113. Auto Answers Panel (used in 1 specs)
114. Auto Complete for Auto Anwsers (used in 1 specs)
115. Auto open and pin for Auto Answers (used in 1 specs)
116. AutoAnswersVizDropzoneRule (used in 1 specs)
117. Context for Related Suggestions Enhancement (used in 1 specs)
118. E2E workflow for Auto Answers (used in 1 specs)
119. Error cases and defects for Auto Answers (used in 1 specs)
120. Object Scope for Auto Anwsers (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getMesseageCount -- frequency: 23
2. getSuggestionCount -- frequency: 18
3. getAssistantMainPanel -- frequency: 13
4. getFeedbackContainer -- frequency: 11
5. getRecommendationText -- frequency: 10
6. getInputText -- frequency: 8
7. getLearningDialog -- frequency: 8
8. getLearningDialogHeaderTitle -- frequency: 8
9. getChatBotVizFocusModalHeader -- frequency: 6
10. getGMVizCount -- frequency: 5
11. getLearningDialogLoadingIcon -- frequency: 5
12. getQuestionId -- frequency: 5
13. getSuggetionListTexts -- frequency: 5
14. getTooltipText -- frequency: 5
15. getAnswerLoading -- frequency: 4
16. getCIContentsCount -- frequency: 4
17. getDisclaimerText -- frequency: 4
18. getInsightLinechartCount -- frequency: 4
19. getLearningTooltipText -- frequency: 4
20. getAnswers -- frequency: 3
21. getBarsCountInBarChart -- frequency: 3
22. getClearConfirmationContainer -- frequency: 3
23. getLatestQuotedMessage -- frequency: 3
24. getLearningDialogForgetButton -- frequency: 3
25. getNumberOfSmartSuggestions -- frequency: 3
26. getAnswerActionsContainer -- frequency: 2
27. getAnswersWithVizCount -- frequency: 2
28. getAnswerTextAndNuggetsCollectionsFromState -- frequency: 2
29. getChatBotVizFocusModal -- frequency: 2
30. getContentInComponents -- frequency: 2
31. getHeatMapCount -- frequency: 2
32. getInputArea -- frequency: 2
33. getInsightLinechartContainerByIndex -- frequency: 2
34. getInsightLineChartVeticalLabelText -- frequency: 2
35. getKPICount -- frequency: 2
36. getLatestAnswer -- frequency: 2
37. getLearningIndicator -- frequency: 2
38. getLearningTooltip -- frequency: 2
39. getMapboxCount -- frequency: 2
40. getQuotedMessageInInputBox -- frequency: 2
41. getRequestBody -- frequency: 2
42. AIContext -- frequency: 1
43. AIIcon -- frequency: 1
44. AIIcon Container -- frequency: 1
45. Assistant Container -- frequency: 1
46. Assistant Welcompage -- frequency: 1
47. Chat Bot Viz Focus Modal -- frequency: 1
48. CILoading Spinner -- frequency: 1
49. Clear Confirmation Container -- frequency: 1
50. Disclaimer -- frequency: 1
51. Error Detailed Message -- frequency: 1
52. getAssistantHeaderText -- frequency: 1
53. getDidYouMeanContainer -- frequency: 1
54. getErrorDetailedMessage -- frequency: 1
55. getFilterIndicator -- frequency: 1
56. getFirstTextInPieChart -- frequency: 1
57. getGMVizContainerByIndex -- frequency: 1
58. getHeatMapContainersByIndex -- frequency: 1
59. getInsightLineChartVeticalLabel -- frequency: 1
60. getInterpretationIconInFocusMode -- frequency: 1
61. getInterpretationSection -- frequency: 1
62. getKPIContainerByIndex -- frequency: 1
63. getLatestCIIcon -- frequency: 1
64. getLatestCIText -- frequency: 1
65. getLearningForgottenIcon -- frequency: 1
66. getLearningText -- frequency: 1
67. getPlacehoderTextInInputArea -- frequency: 1
68. getRecommendationContainer -- frequency: 1
69. getRecommendationItems -- frequency: 1
70. getRecommendationTitleText -- frequency: 1
71. getSeeMoreOrLessBtnOnVizFocusModal -- frequency: 1
72. getShowErrorMessage -- frequency: 1
73. getSmartSuggestionItem -- frequency: 1
74. getSuggestionPopup -- frequency: 1
75. getThumbDownIcon -- frequency: 1
76. getThumbDownIconSelected -- frequency: 1
77. getTooltip -- frequency: 1
78. getType -- frequency: 1
79. getVizBackgroundColor -- frequency: 1
80. getWelcomeText -- frequency: 1
81. Learning Tooltip -- frequency: 1
82. Loading Chat Bubble -- frequency: 1
83. Show Error Message -- frequency: 1
84. Suggestion Popup -- frequency: 1
85. Tooltip -- frequency: 1

## Key Actions

- `openDossier()` -- used in 86 specs
- `openPageFromTocMenu()` -- used in 81 specs
- `input(text)` -- used in 80 specs
- `openAndPin()` -- used in 66 specs
- `inputAndSendQuestion(text)` -- used in 55 specs
- `sendQuestionAndWaitForAnswer()` -- used in 55 specs
- `sleep()` -- used in 45 specs
- `goToLibrary()` -- used in 33 specs
- `waitForAIReady()` -- used in 29 specs
- `waitForElementVisible()` -- used in 25 specs
- `getMesseageCount()` -- used in 23 specs
- `isAnswerContainsOneOfKeywords(words, ignoreCase = true)` -- used in 21 specs
- `openCustomAppById()` -- used in 21 specs
- `isRecommendationCollapsed()` -- used in 20 specs
- `isAIAssistantPresent()` -- used in 19 specs
- `open()` -- used in 19 specs
- `getSuggestionCount()` -- used in 18 specs
- `clickMaxMinBtn()` -- used in 17 specs
- `isAAPinned()` -- used in 16 specs
- `clickThumbDown(index)` -- used in 15 specs
- `collapseRecommendation()` -- used in 15 specs
- `login()` -- used in 15 specs
- `clickFeedbackTag(feedbackIndex, tagIndex)` -- used in 14 specs
- `clickFollowUp(index = 1)` -- used in 14 specs
- `clickSmartSuggestion(index = 1)` -- used in 14 specs
- `closeChatbotVizFocusModal()` -- used in 14 specs
- `openDefaultApp()` -- used in 14 specs
- `getAssistantMainPanel()` -- used in 13 specs
- `isDidYouMeanExisting()` -- used in 13 specs
- `isFocuseModalPresent()` -- used in 13 specs
- `getFeedbackContainer()` -- used in 11 specs
- `inputFeedbackMessage(index, content)` -- used in 11 specs
- `maximizeChatbotVisualization(index = 0)` -- used in 11 specs
- `getRecommendationText(index = 1)` -- used in 10 specs
- `hoverAnswer(index = 1)` -- used in 10 specs
- `push()` -- used in 10 specs
- `submitFeedback(index)` -- used in 10 specs
- `waitTillAnswerAppears()` -- used in 10 specs
- `isLearningResultsDisplayed(index)` -- used in 9 specs
- `isSuggestionPresent()` -- used in 9 specs
- `waitForElementInvisible()` -- used in 9 specs
- `close(icon = 'close')` -- used in 8 specs
- `getInputText()` -- used in 8 specs
- `getLearningDialog()` -- used in 8 specs
- `getLearningDialogHeaderTitle()` -- used in 8 specs
- `isFeedbackDialogVisible(index)` -- used in 8 specs
- `isLearningIndicatorDisplayed({ index = 1, focusMode = false })` -- used in 8 specs
- `isTextInSuggestionList(text)` -- used in 8 specs
- `mock()` -- used in 8 specs
- `waitTillDidYouMeanDataReady()` -- used in 8 specs
- `clickClearBtn()` -- used in 7 specs
- `expandRecommendation()` -- used in 7 specs
- `generateCIFromLatestAnswer()` -- used in 7 specs
- `openUrl()` -- used in 7 specs
- `parse()` -- used in 7 specs
- `totalAnswers()` -- used in 7 specs
- `clearHistoryAndAskQuestion()` -- used in 6 specs
- `getChatBotVizFocusModalHeader()` -- used in 6 specs
- `isDisclaimerPresent()` -- used in 6 specs
- `isFocusMaxIconVisible(index = 0)` -- used in 6 specs
- `isLoginPageDisplayed()` -- used in 6 specs
- `mockRestoreAll()` -- used in 6 specs
- `selectClearConfirmationBtn(text = 'Yes')` -- used in 6 specs
- `selectViz(vizName)` -- used in 6 specs
- `sendQuestionByRecommendation(index = 1)` -- used in 6 specs
- `toString()` -- used in 6 specs
- `url()` -- used in 6 specs
- `verifyQuotedQuestion()` -- used in 6 specs
- `getGMVizCount(focusMode = false)` -- used in 5 specs
- `getLearningDialogLoadingIcon()` -- used in 5 specs
- `getQuestionId(index = 1)` -- used in 5 specs
- `getSuggetionListTexts()` -- used in 5 specs
- `getTooltipText()` -- used in 5 specs
- `isFilterIndicatorDisplayedInAnswer(index)` -- used in 5 specs
- `isUndoEnabled()` -- used in 5 specs
- `sendQuestion()` -- used in 5 specs
- `clickCIFromAnswer(index, turnOn = true)` -- used in 4 specs
- `clickLearningIndicator({ index = 1, focusMode = false })` -- used in 4 specs
- `getAnswerLoading()` -- used in 4 specs
- `getCIContentsCount()` -- used in 4 specs
- `getDisclaimerText()` -- used in 4 specs
- `getInsightLinechartCount(focusMode = false)` -- used in 4 specs
- `getLearningTooltipText()` -- used in 4 specs
- `getLocation()` -- used in 4 specs
- `isClearBtnDisabled()` -- used in 4 specs
- `isRecommendationRefreshDisabled()` -- used in 4 specs
- `isThanksForYourFeedbackVisible(index)` -- used in 4 specs
- `isWelcomePagePresent()` -- used in 4 specs
- `sendQuestionWithTextAndObject(inputs)` -- used in 4 specs
- `unpin()` -- used in 4 specs
- `clearHistory()` -- used in 3 specs
- `clickUndo()` -- used in 3 specs
- `copySmartSuggestionToQuery(index = 1)` -- used in 3 specs
- `getAnswers()` -- used in 3 specs
- `getBarsCountInBarChart(index = 1, focusMode = false)` -- used in 3 specs
- `getClearConfirmationContainer()` -- used in 3 specs
- `getLatestQuotedMessage()` -- used in 3 specs
- `getLearningDialogForgetButton()` -- used in 3 specs
- `getNumberOfSmartSuggestions()` -- used in 3 specs
- `isDisplayed()` -- used in 3 specs
- `isFeedbackSubmitButtonDisabled(index)` -- used in 3 specs
- `isLatestCIBtnActive()` -- used in 3 specs
- `isLearningSectionDisplayed(index)` -- used in 3 specs
- `isPinIconPresented()` -- used in 3 specs
- `isThumbDownButtonHighlighted(index)` -- used in 3 specs
- `maximizeLatestChatbotVisualization()` -- used in 3 specs
- `mockTimeInQuotedMessage()` -- used in 3 specs
- `mockTimeInQuotedMessageInInputBox()` -- used in 3 specs
- `resetDossier()` -- used in 3 specs
- `showInterpretationInVizFocusModal()` -- used in 3 specs
- `askAgainFromLatestCI()` -- used in 2 specs
- `cancelQuestion()` -- used in 2 specs
- `clickAskAgainOnLatestQuestion()` -- used in 2 specs
- `clickPageTitle()` -- used in 2 specs
- `clickSeeMoreOrLessBtnOnVizFocusModal()` -- used in 2 specs
- `closeFeedbackDialog(index)` -- used in 2 specs
- `closeTab()` -- used in 2 specs
- `copyAsImageInVizFocusModal()` -- used in 2 specs
- `copyImageFromLatestAnswer()` -- used in 2 specs
- `copyToQuetyFromRecommendation(index = 1)` -- used in 2 specs
- `deleteContext()` -- used in 2 specs
- `dockCommentPanel()` -- used in 2 specs
- `execute()` -- used in 2 specs
- `getAnswerActionsContainer()` -- used in 2 specs
- `getAnswersWithVizCount()` -- used in 2 specs
- `getAnswerTextAndNuggetsCollectionsFromState(index = 1)` -- used in 2 specs
- `getChatBotVizFocusModal()` -- used in 2 specs
- `getContentInComponents(index = 1)` -- used in 2 specs
- `getHeatMapCount(focusMode = false)` -- used in 2 specs
- `getInputArea()` -- used in 2 specs
- `getInsightLinechartContainerByIndex()` -- used in 2 specs
- `getInsightLineChartVeticalLabelText(index = 1, focusMode = false)` -- used in 2 specs
- `getKPICount(focusMode = false)` -- used in 2 specs
- `getLatestAnswer()` -- used in 2 specs
- `getLearningIndicator()` -- used in 2 specs
- `getLearningTooltip()` -- used in 2 specs
- `getMapboxCount(focusMode = false)` -- used in 2 specs
- `getQuotedMessageInInputBox()` -- used in 2 specs
- `getRequestBody()` -- used in 2 specs
- `hover()` -- used in 2 specs
- `hoverAIAssistantIcon()` -- used in 2 specs
- `hoverLearMoreBtn()` -- used in 2 specs
- `isAAMaximized()` -- used in 2 specs
- `isAddToLibraryDisplayed()` -- used in 2 specs
- `isAIAssistantDisabled()` -- used in 2 specs
- `isCloseIconPresented()` -- used in 2 specs
- `isDataLimitDisplayed(index = 1)` -- used in 2 specs
- `isDocked()` -- used in 2 specs
- `isFeedbackCategoryButtonSelected(index, categoryIndex)` -- used in 2 specs
- `isFollowUpBubbleExistInInputBox()` -- used in 2 specs
- `isFollowUpExistInActionButtons()` -- used in 2 specs
- `isInterPretationPresentInFocusModal()` -- used in 2 specs
- `isInterpretationSectionVisible(index = 1)` -- used in 2 specs
- `isMainPanelOpen()` -- used in 2 specs
- `isPanelDocked()` -- used in 2 specs
- `isPanelOpen()` -- used in 2 specs
- `isSeeMoreLessBtnExpandedOnFocusModal()` -- used in 2 specs
- `join()` -- used in 2 specs
- `keys()` -- used in 2 specs
- `log()` -- used in 2 specs
- `map()` -- used in 2 specs
- `openAutoAnswersInMobileView()` -- used in 2 specs
- `openCommentsPanel()` -- used in 2 specs
- `pin()` -- used in 2 specs
- `setPermissions()` -- used in 2 specs
- `sort()` -- used in 2 specs
- `stringify()` -- used in 2 specs
- `toBeGreaterThan()` -- used in 2 specs
- `toBeLessThan()` -- used in 2 specs
- `waitForLibraryLoading()` -- used in 2 specs
- `waitUntil()` -- used in 2 specs
- `checkChatbotInputArea(testCase, imageName, tolerance)` -- used in 1 specs
- `checkChatbotLatestViz(testCase, imageName, tolerance)` -- used in 1 specs
- `clearInput(el = this.getInputArea()` -- used in 1 specs
- `clickAddToLibraryButton()` -- used in 1 specs
- `clickAllTab()` -- used in 1 specs
- `clickForgetLearningBtn(index)` -- used in 1 specs
- `clickLearnMoreLinkOnTooltip()` -- used in 1 specs
- `clickShowErrorDetails()` -- used in 1 specs
- `clickThumbDownSelected(index)` -- used in 1 specs
- `clickTitleBar()` -- used in 1 specs
- `closeDidYouMean()` -- used in 1 specs
- `closeFollowUpBubble()` -- used in 1 specs
- `closeHamburgerMenu()` -- used in 1 specs
- `closeLatestCI()` -- used in 1 specs
- `closeSidebar()` -- used in 1 specs
- `copyLLMFromLatestCI()` -- used in 1 specs
- `createElement()` -- used in 1 specs
- `createObjectURL()` -- used in 1 specs
- `disableTutorial()` -- used in 1 specs
- `dockFilterPanel()` -- used in 1 specs
- `forgetLearningContent(answerIndex = 1, learningIndex = 1)` -- used in 1 specs
- `getAssistantHeaderText()` -- used in 1 specs
- `getDidYouMeanContainer()` -- used in 1 specs
- `getErrorDetailedMessage()` -- used in 1 specs
- `getFilterIndicator()` -- used in 1 specs
- `getFirstTextInPieChart(index = 1, focusMode = false)` -- used in 1 specs
- `getGMVizContainerByIndex()` -- used in 1 specs
- `getHeatMapContainersByIndex()` -- used in 1 specs
- `getInsightLineChartVeticalLabel()` -- used in 1 specs
- `getInterpretationIconInFocusMode()` -- used in 1 specs
- `getInterpretationSection()` -- used in 1 specs
- `getKPIContainerByIndex()` -- used in 1 specs
- `getLatestCIIcon()` -- used in 1 specs
- `getLatestCIText()` -- used in 1 specs
- `getLearningForgottenIcon()` -- used in 1 specs
- `getLearningText(index)` -- used in 1 specs
- `getPlacehoderTextInInputArea()` -- used in 1 specs
- `getRecommendationContainer()` -- used in 1 specs
- `getRecommendationItems()` -- used in 1 specs
- `getRecommendationTitleText()` -- used in 1 specs
- `getSeeMoreOrLessBtnOnVizFocusModal()` -- used in 1 specs
- `getShowErrorMessage()` -- used in 1 specs
- `getSmartSuggestionItem(index = 1)` -- used in 1 specs
- `getSuggestionPopup()` -- used in 1 specs
- `getThumbDownIcon()` -- used in 1 specs
- `getThumbDownIconSelected()` -- used in 1 specs
- `getTooltip()` -- used in 1 specs
- `getType()` -- used in 1 specs
- `getVizBackgroundColor()` -- used in 1 specs
- `getWelcomeText()` -- used in 1 specs
- `hideInterpretationInVizFocusModal()` -- used in 1 specs
- `hoverFilterIndicatorInAnswer(index = 1)` -- used in 1 specs
- `hoverLatestInfoIconInLinechart()` -- used in 1 specs
- `hoverMapbox(index = 1, focusMode = false)` -- used in 1 specs
- `inputByPaste()` -- used in 1 specs
- `inputTextAndSearch()` -- used in 1 specs
- `isDossierInLibrary()` -- used in 1 specs
- `isErrorPresent()` -- used in 1 specs
- `isFollowUpBubbleExistInQuestion()` -- used in 1 specs
- `isInsightLinechartInfoTooltipPresent()` -- used in 1 specs
- `isLatestAnswerContainsChinese()` -- used in 1 specs
- `isLearningInfoDisplayed(index = 1)` -- used in 1 specs
- `isMaxMinBtnDisplayed()` -- used in 1 specs
- `isRecommendationListContainsChinese()` -- used in 1 specs
- `isRightBoxOnMapboxPresent(index = 1, focusMode = false)` -- used in 1 specs
- `isSeeLessBtnPresent()` -- used in 1 specs
- `isSeeMoreBtnPresent()` -- used in 1 specs
- `isThumbDownButtonVisible(index)` -- used in 1 specs
- `isThumbDownButtonVisibleOnHover(index)` -- used in 1 specs
- `logout()` -- used in 1 specs
- `multiSelect()` -- used in 1 specs
- `on()` -- used in 1 specs
- `openDossierById()` -- used in 1 specs
- `openDossierFromSearchResults()` -- used in 1 specs
- `openFilterPanel()` -- used in 1 specs
- `openUserAccountMenu()` -- used in 1 specs
- `pause()` -- used in 1 specs
- `refreshRecommendation()` -- used in 1 specs
- `removeDossierFromLibrary()` -- used in 1 specs
- `seeLessFromLatestAnswer()` -- used in 1 specs
- `seeMoreFromLatestAnswer()` -- used in 1 specs
- `switchToTab()` -- used in 1 specs
- `tabCount()` -- used in 1 specs
- `toBeGreaterThanOrEqual()` -- used in 1 specs
- `toLocaleLowerCase()` -- used in 1 specs
- `vizCreationByChat(pagePrompt)` -- used in 1 specs
- `waitForDossierLoading()` -- used in 1 specs
- `waitForLearningInfoVisible(index = 1)` -- used in 1 specs
- `checkChatbotMaximizeViz(testCase, imageName, tolerance)` -- used in 0 specs
- `checkChatbotVizByIndex(index = 0, testCase, imageName, tolerance)` -- used in 0 specs
- `clearHistoryVizCreationByChat(pagePrompt)` -- used in 0 specs
- `clickLatestVizInsideBot()` -- used in 0 specs
- `containsChinese(text)` -- used in 0 specs
- `copyAnswerAsImage(index)` -- used in 0 specs
- `getChatAnwserCount()` -- used in 0 specs
- `getContext()` -- used in 0 specs
- `getHistoryMessages()` -- used in 0 specs
- `getLastOrDefaultAnswerIndex(index)` -- used in 0 specs
- `getLatestAnswerText()` -- used in 0 specs
- `getLatestInterpretation()` -- used in 0 specs
- `getLatestQuestion()` -- used in 0 specs
- `getLearningResult(index)` -- used in 0 specs
- `getMessageCount()` -- used in 0 specs
- `getVizInsideBot()` -- used in 0 specs
- `hoverInfoIconInLinechart(index = 1)` -- used in 0 specs
- `hoverLearningContent(answerIndex = 1, learningIndex = 1)` -- used in 0 specs
- `inputQuestionWithTextAndObject(item)` -- used in 0 specs
- `isCIBtnActive(index)` -- used in 0 specs
- `isContextPresent()` -- used in 0 specs
- `isFeedbackSubmitButtonClickable(index)` -- used in 0 specs
- `isFeedbackSubmitButtonVisible(index)` -- used in 0 specs
- `isLearningLoadingIconDisplayed(index)` -- used in 0 specs
- `isLearningLoadingVisible(index)` -- used in 0 specs
- `isThumbDownButtonClickable(index)` -- used in 0 specs
- `isTooltipPresent()` -- used in 0 specs
- `sendPrompt(text)` -- used in 0 specs
- `waitForAllOpenEndedAnswers(alternatives)` -- used in 0 specs

## Source Coverage

- `pageObjects/autoAnswers/**/*.js`
- `specs/regression/AutoAnswers/**/*.{ts,js}`
