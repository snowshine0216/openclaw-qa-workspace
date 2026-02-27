import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { botChatPanelPreMergeUser } from '../../../constants/bot.js';
import { getRequestBody } from '../../../constants/customApp/bot.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import deleteUserNuggets from '../../../api/bot/nuggets/deleteUserNuggetsRestAPI.js';
import {
    mockAlternativeSuggestionsResponse,
    mockAmbiguousAndFollowUpResponseAIBot,
} from '../../../api/mock/mock-response-utils.js';


describe('AIbotChatPanelPreMergeTest', () => {
    let { loginPage, libraryPage, botConsumptionFrame, aibotChatPanel, aibotSnapshotsPanel, snapshotDialog } =
        browsers.pageObj1;
    let defaultDisclaimerAppId;

    beforeAll(async () => {
        await loginPage.login(botChatPanelPreMergeUser);
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
        await setWindowSize(browserWindow);
    });

    it('[TC91750] AI Bot premerge test', async () => {
        let botName = 'PreMerge';
        let welcomePageMessage = `I am PreMerge, your AI assistant. I’m here to answer your questions about your data.`;
        let welcomePageSuggestionTitle = `Here are some suggested topics based on the provided data. Choose a suggestion below or ask a question.`;
        let chatBotInputHint = 'Ask me a question.';
        let customAppInfo = getRequestBody({
            name: 'defaultContentsDisclaimerApp',
        });

        defaultDisclaimerAppId = await createCustomApp({
            credentials: botChatPanelPreMergeUser,
            customAppInfo: customAppInfo,
        });
        await libraryPage.openCustomAppById({ id: defaultDisclaimerAppId });
        await libraryPage.openDossier('PreMerge');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }
        await aibotChatPanel.clearHistory();
        if (await aibotSnapshotsPanel.isClearSnapshotButtonDisplayed()) {
            await aibotSnapshotsPanel.clickClearSnapshots();
            await aibotSnapshotsPanel.clickConfirmClearSnapshotsButton();
        }

        //Open Aibot in consumption mode and verify the elements should be displayed correctly
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await since('Chat bot disclaimer display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isDisclaimerDisplayed())
            .toBe(true);
        await since('Chat bot title bar bot logo display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isTitleBarBotLogoDisplayed())
            .toBe(true);
        await since('Chat bot title bar bot name text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toBe(botName);
        await since('Welcome page bot image display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWelcomePageBotImageDisplayed())
            .toBe(true);
        await since('Welcome page message text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getWelcomePageMessageTexts())
            .toBe(welcomePageMessage);

        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageSeparator());
        await since('Welcome page separator display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWelcomePageSeparatorDisplayed())
            .toBe(true);
        await since('Welcome page title text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getWelcomePageTitleTexts())
            .toBe(welcomePageSuggestionTitle);
        await since('Chat bot input hint text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHintText())
            .toBe(chatBotInputHint);
        await since('Chat bot send icon display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isSendIconDisplayed())
            .toBe(true);

        //Click on the first recommendation and verify the question and answer should be displayed correctly
        await aibotChatPanel.clickRecommendationByIndex(3);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTextAnswerByIndex(0));
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getVizAnswerByIndex(0));
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('Time display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isTimeDisplayed())
            .toBe(true);
        await since('Recommendation question display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isQueryByIndexDisplayed(0))
            .toBe(true);
        await since('Recommendation chat answer display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isTextAnswerByIndexDisplayed(0))
            .toBe(true);
        await since('Recommendation viz answer display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isVizAnswerByIndexDisplayed(0))
            .toBe(true);

        //Check interpretation should show
        await aibotChatPanel.hoverTextOnlyChatAnswertoOpenInterpretationbyIndex(0);
        await aibotChatPanel.waitForInterpretationLoading();
        await since('Answer interpretation display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isInterpretationComponentDisplayed())
            .toBe(true);
        await aibotChatPanel.clickInterpretation();

        // after ask question by suggestion, related suggestions should be displayed
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(2));
        await since('Chat bot query display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isRecommendationByIndexDisplayed(2))
            .toBe(true);
        await since(
            'Recommendation expand state button display is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aibotChatPanel.isRecommendationExpandStateBtnDisplayed())
            .toBe(true);
        await since(
            'Chat bot recommendation refresh icon display is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aibotChatPanel.isRecommendationRefreshIconDisplayed())
            .toBe(true);

        // Hint still show after ask question and the Send button icon
        await since('Chat bot input hint text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHintText())
            .toBe(chatBotInputHint);
        await since('Chat bot send icon display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isSendIconDisplayed())
            .toBe(true);

        //Elements in welcome page should be hidden
        await since('Welcome page bot image display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWelcomePageBotImageDisplayed())
            .toBe(false);
        await since('Welcome page message text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWelcomePageMessageDisplayed())
            .toBe(false);
        await since('Welcome page separator display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWelcomePageSeparatorDisplayed())
            .toBe(false);
        await since('Welcome page title text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWelcomePageTitleDisplayed())
            .toBe(false);

        //Add the answer to snapshot
        await aibotChatPanel.hoverChatAnswertoAddSnapshotbyIndex(0);
        // await aibotChatPanel.clickCloseSnapshotAddedButton();

        // Maximize snapshot
        // const answertmp = await aibotChatPanel.getNthParagraphOfTextAnswerFromEnd(1);
        // const answerText1 = await answertmp.getText();
        // const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByText(answerText1);
        const snapshotCard = aibotSnapshotsPanel.getSnapshotCardByIndex();
        await snapshotCard.clickMaximizeButton();
        await snapshotDialog.clickCloseButton();

        // Sort by category
        await aibotSnapshotsPanel.setSortBy('Category');

        // Check buttons in snapshot panel
        const maximizeTooltip = await snapshotCard.hoverAndGetTooltip(await snapshotCard.getMaximizeButton());
        await since('Maximize button tooltip text is expected to be #{expected}, instead we have #{actual}')
            .expect(await maximizeTooltip.getText())
            .toBe('Maximize');

        const moveTooltip = await snapshotCard.hoverAndGetTooltip(await snapshotCard.getMoveButton());
        await since('Move button tooltip text is expected to be #{expected}, instead we have #{actual}')
            .expect(await moveTooltip.getText())
            .toBe('Move');

        await snapshotCard.clickMoveButton();
        await snapshotCard.selectMoveToCategory('Others');
        const othersCategoryArea = aibotSnapshotsPanel.getSnapshotCategoryAreaByName('Others');
        await othersCategoryArea.isDisplayed();
        await since('Category Others is created to be #{expected}, instead we have #{actual}')
            .expect(await othersCategoryArea.isExisting())
            .toBe(true);
        await since('Snapshot card was moved to Others category to be #{expected}, instead we have #{actual}')
            .expect(await othersCategoryArea.getNumberOfDisplayedSnapshotCard())
            .toBe(1);

        const copyTooltip = await snapshotCard.hoverAndGetTooltip(await snapshotCard.getCopyButton());
        await since('Copy button tooltip text is expected to be #{expected}, instead we have #{actual}')
            .expect(await copyTooltip.getText())
            .toBe('Copy as image');

        const downloadTooltip = await snapshotCard.hoverAndGetTooltip(await snapshotCard.getDownloadButton());
        await since('Download button tooltip text is expected to be #{expected}, instead we have #{actual}')
            .expect(await downloadTooltip.getText())
            .toBe('Download');

        const deleteTooltip = await snapshotCard.hoverAndGetTooltip(await snapshotCard.getDeleteButton());
        await since('Delete button tooltip text is expected to be #{expected}, instead we have #{actual}')
            .expect(await deleteTooltip.getText())
            .toBe('Delete');

        // Sort back to Date
        await aibotSnapshotsPanel.setSortBy('Date Created');
        await since('Snapshot card move to button existing should be #{expected}, instead we have #{actual}')
            .expect(await snapshotCard.getMoveButton().isExisting())
            .toBe(false);

        // Delete snapshot
        await snapshotCard.clickDeleteButton();
        await snapshotCard.confirmDelete();

        //Enter edit mode and verify the elements should be displayed correctly
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getAnswerList());
        await aibotChatPanel.waitForRecommendationLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(3));
        await since('Chat bot query display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isRecommendationByIndexDisplayed(3))
            .toBe(true);
        await since('Edit mode question display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isQueryByIndexDisplayed(0))
            .toBe(true);
        await since('Enter edit mode chat answer display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isTextAnswerByIndexDisplayed(0))
            .toBe(true);
        await since('Enter edit mode viz answer display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isVizAnswerByIndexDisplayed(0))
            .toBe(true);

        //Clear history and verify the elements should be displayed correctly
        await aibotChatPanel.clearHistory();
        await since('Chat bot title bar bot logo display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isTitleBarBotLogoDisplayed())
            .toBe(true);
        await since('Chat bot title bar bot name text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toBe(botName);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotIcon());
        await since('Welcome page bot image display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWelcomePageBotImageDisplayed())
            .toBe(true);
        await since('Welcome page message text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getWelcomePageMessageTexts())
            .toBe(welcomePageMessage);
        await since('Welcome page separator display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWelcomePageSeparatorDisplayed())
            .toBe(true);
        await since('Welcome page title text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getWelcomePageTitleTexts())
            .toBe(welcomePageSuggestionTitle);
        await since('Chat bot input hint text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHintText())
            .toBe(chatBotInputHint);
        await since('Chat bot send icon display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isSendIconDisplayed())
            .toBe(true);

        //Ask question by auto complete
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Please list all ');
        await aibotChatPanel.askQuestionByAutoComplete('country', 0);
        await aibotChatPanel.typeKeyboard('. Please answer with a visualization.');
        await aibotChatPanel.clickSendBtn();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getMarkDownByIndex(0), {
            timeout: 60 * 1000,
        });
        //when ask top 1 question, it will not show visualization - changed by DE281139
        await since('Auto complete question display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isQueryByIndexDisplayed(0))
            .toBe(true);
        await since(
            'Ask question by autocomplete viz answer display is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await aibotChatPanel.isVizAnswerByIndexDisplayed(0))
            .toBe(true);

        //Add the answer to snapshot
        await aibotChatPanel.hoverTextOnlyChatAnswertoAddSnapshotbyIndex(0);
        await since('Number of snapshots in chat bot is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.numberOfSnapshotsInChatbot())
            .toEqual(1);
        //await aibotChatPanel.clickCloseSnapshotAddedButton();
    });

    it('[TC94985] AI Bot premerge test_Topic', async () => {
        let botName = 'PreMerge_topic';
        let welcomePageMessage = `I am PreMerge, your AI assistant. I’m here to answer your questions about your data.`;
        let topicSuggestionTitleTexts = `Here are some suggested topics based on the provided data.`;
        let chatBotInputHint = 'Ask me a question.';

        await libraryPage.openDossier('PreMerge_topic');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        if (await aibotChatPanel.isSnapshotPanelClosed()) {
            await aibotChatPanel.clickOpenSnapshotPanelButton();
        }
        await aibotChatPanel.clearHistory();
        if (await aibotSnapshotsPanel.isClearSnapshotButtonDisplayed()) {
            await aibotSnapshotsPanel.clickClearSnapshots();
            await aibotSnapshotsPanel.clickConfirmClearSnapshotsButton();
        }

        //Open Aibot in consumption mode and verify the elements should be displayed correctly
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageSeparator());
        await since('Chat bot title bar bot logo display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isTitleBarBotLogoDisplayed())
            .toBe(true);
        await since('Chat bot title bar bot name text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toBe(botName);
        await since('Welcome page bot image display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWelcomePageBotImageDisplayed())
            .toBe(true);
        await since('Welcome page message text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getWelcomePageMessageTexts())
            .toBe(welcomePageMessage);
        await since('Welcome page separator display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isWelcomePageSeparatorDisplayed())
            .toBe(true);
        await since('Welcome page title text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTopicSuggestionTitleTexts())
            .toBe(topicSuggestionTitleTexts);
        await since('Suggested Topic is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isChatPanelTopicDisplayed())
            .toBe(true);
        await since('Welcome page Ask About is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isAskAboutDisplayed())
            .toBe(true);
        await since('Chat bot input hint text is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHintText())
            .toBe(chatBotInputHint);
        await since('Chat bot topic icon display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isTopicsIconDisplayed())
            .toBe(true);
        await since('Welcome page Ask About Btn is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isAskAboutBtnDisplayed())
            .toBe(true);

        //Open Ask About panel and verify the elements should be displayed correctly
        await aibotChatPanel.getAskAboutBtn().click();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getAskAboutPanel());
        await since('Ask about panel display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isAskAboutPanelDisplayed())
            .toBe(true);
        await since('Ask about panel searchbox display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isAskAboutPanelSearchBoxDisplayed())
            .toBe(true);
        await since('Ask about panel item display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isAskAboutPanelObjectListDisplayed())
            .toBe(true);
        await since('Ask about button is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isAskAboutBtnDisplayed())
            .toBe(false);

        //Click one topic item
        await aibotChatPanel.clickChatPanelTopicByIndex(1);
        await aibotChatPanel.waitForTopicAnswerLoading();
        await since('Suggested Topic is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isChatPanelTopicDisplayed())
            .toBe(false);
        await since('Time display is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isTimeDisplayed())
            .toBe(true);
        await since('Topic question display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isQueryByIndexDisplayed(0))
            .toBe(true);
        let answerCount1 = await aibotChatPanel.getAnswerCount();
        await since('Topic chat answer is expected to be greater than #{expected}, instead we have #{actual}')
            .expect(answerCount1)
            .toBeGreaterThan(0);

        //Click topic button
        await aibotChatPanel.clickTopicsBtn();
        await since('Suggested Topic is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isChatPanelTopicDisplayed())
            .toBe(true);
        await since('Disabled Topic button is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isDisabledTopicsIconDisplayed())
            .toBe(true);

        //Start conversation, show suggestions
        await aibotChatPanel.getAskAboutPanelObjectByIndex(0).click();
        await browser.pause(3000); //random fail, stable
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getStartConversationBtn());
        await aibotChatPanel.getStartConversationBtn().click();
        await aibotChatPanel.waitForRecommendationLoading();
        await aibotChatPanel.sleep(1000); //need to wait GUI static rendering
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('Recommendation About display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isRecommendationAboutDisplayed())
            .toBe(true);
        await since('Recommendation question display is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isRecommendationByIndexDisplayed(0))
            .toBe(true);

        //Copy to query, show send button
        await aibotChatPanel.copyRecommendationToQuery(0);
        await since('Input question, the send button is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isSendIconDisplayed())
            .toBe(true);
    });

    it('[TC94914] AI Bot Learning premerge test', async () => {
        let openLearningCustomAppId;
        let customAppInfOn = getRequestBody({
            name: 'openLearningApp',
            disclaimer: '',
            feedback: true,
            learning: true,
        });
        openLearningCustomAppId = await createCustomApp({
            credentials: botChatPanelPreMergeUser,
            customAppInfo: customAppInfOn,
        });
        await deleteUserNuggets({ credentials: botChatPanelPreMergeUser });
        let feedbackContents = 'I want to know net change';
        let reason = 'This question is ambiguous because of \"Metric Ambiguity\".'
        await libraryPage.openCustomAppById({ id: openLearningCustomAppId });
        await libraryPage.openDossier('Premerge Learning');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        const alternatives = ['Yearly Change', 'Migrants (net)']; //when list < 3, show only 2 items
        const suggestions = ['Which Country has the best Yearly Change?', 'Which Country has the best Migrants (net)?'];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.clickSmartSuggestion(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForCheckLearningLoading();
        await since('learning triggered by did you mean expected to be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getFeedbackResults().isDisplayed())
            .toBe(true);
        await aibotChatPanel.clickLearningForgetButtonbyIndex(0);
        await since('forget learning triggered by did you mean expected to be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getFeedbackResults().isDisplayed())
            .toBe(false);
        await deleteUserNuggets({ credentials: botChatPanelPreMergeUser });
        await aibotChatPanel.clearHistory();
        await mockAmbiguousAndFollowUpResponseAIBot(true, true, reason);
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Which Country has the best performance of change?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.hoverTextOnlyChatAnswer(0);
        await aibotChatPanel.clickThumbDownButtonbyIndex(0);
        await aibotChatPanel.clickFeedbackTabByName('Incomplete answer');
        await aibotChatPanel.inputFeedbackContents(feedbackContents);
        await aibotChatPanel.clickFeedbackSubmitButton();
        await aibotChatPanel.waitForCheckLearningLoading();
        await since('learning triggered by thumbdown expected to be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getFeedbackResults().isDisplayed())
            .toBe(true);
        await aibotChatPanel.clickLearningForgetButtonbyIndex(0);
        await since('forget learning triggered by thumbdown expected to be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getFeedbackResults().isDisplayed())
            .toBe(false);
        await aibotChatPanel.clearHistory();
        await deleteUserNuggets({ credentials: botChatPanelPreMergeUser });
    });

    it('[TC95831]AI Bot follow up premerge test', async () => {
        await libraryPage.openDossier('Premerge Follow Up');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.hoverTextOnlyChatAnswer(0);
        await aibotChatPanel.clickFollowUpIconbyIndex(0);
        await since('Quoted message in input area display should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getQuotedMessageInInpuxBox().isDisplayed())
            .toBe(true);
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getQuotedMessageInInpuxBox());
        await aibotChatPanel.getQuotedMessageInInpuxBox().click();
        await since('Click Quoted message in input area highlight should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHighlightMessage().isDisplayed())
            .toBe(true);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('Hi');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since('Quoted message in question display should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getQuotedMessageByIndex(0).isDisplayed())
            .toBe(true);
        await aibotChatPanel.getQuotedMessageByIndex(0).click();
        await since('Click Quoted message in question highlight should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getHighlightMessage().isDisplayed())
            .toBe(true);
        await aibotChatPanel.clearHistory();
    });

    afterEach(async () => {
        await aibotChatPanel.clearHistory();
        if (await aibotSnapshotsPanel.isClearSnapshotButtonDisplayed()) {
            await aibotSnapshotsPanel.clickClearSnapshots();
            await aibotSnapshotsPanel.clickConfirmClearSnapshotsButton();
        }

        //back to library page
        await aibotChatPanel.goToLibrary();
        await libraryPage.waitForLibraryLoading();
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: botChatPanelPreMergeUser,
            customAppIdList: [defaultDisclaimerAppId],
        });
        await logoutFromCurrentBrowser();
    });
});
