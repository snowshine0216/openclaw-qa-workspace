import {
    mockShortLearningResult,
    mockAmbiguousAndFollowUpResponse,
    mockAlternativeSuggestionsIgnoreError,
    mockLearningNone,
    mockLongLearningResult,
    mockChatResult,
} from '../../../api/mock/mock-response-utils.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { learningUserCredentials } from '../../../constants/autoAnswer.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import { getCustomAppBody } from '../../../constants/customApp/customAppBody.js';
import * as appConsts from '../../../constants/customApp/bot.js';
import forgetAllLearnings from '../../../api/bot/forgetLearnings.js';
import { getHistoryPayloadFromLearning } from '../../../api/mock/mock-request-utils.js';

describe('Auto Answers Learning', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };

    const AA_Learning = {
        id: 'FB933DD79545BFBA3B81A0B8CBC3E5A2',
        name: 'Learn_dashboard',
        project,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const shortLearningResult = 'I learned something!';
    const learingContentID = '123fd1f0-353a-4788-b176-3fe2bfa1d11d';
    const smartSuggestionQuestion = 'Show me highest airline in text';
    const smartSuggestionQuestion_viz = 'Show me highest airline, show in grid';

    const { loginPage, dossierPage, libraryPage, aiAssistant, learning, interpretation } = browsers.pageObj1;

    const openAutoAnswerAndPostNormalQuestion = async (
        question = 'what is performance of the industry?',
        withMockAnswer = false
    ) => {
        await resetDossierState({
            credentials: learningUserCredentials,
            dossier: AA_Learning,
        });
        // prepare to make chat answer
        if (withMockAnswer) {
            await mockChatResult({ answerText: 'The performance of the industry is good!!!!!!!!' });
        }
        await libraryPage.openDossier(AA_Learning.name);
        // open AI assistant
        await aiAssistant.openAndPin();
        await aiAssistant.sleep(1000);
        await aiAssistant.waitForElementVisible(aiAssistant.getInputArea());
        await aiAssistant.input(question);
        await aiAssistant.sendQuestionAndWaitForAnswer();
    };

    const openAutoAnswerAndPostAmbiguousQuestion = async () => {
        await resetDossierState({
            credentials: learningUserCredentials,
            dossier: AA_Learning,
        });
        // prepare to mock ambiguous and follow up response
        await mockAmbiguousAndFollowUpResponse(true, false, 'The performance of the industry is good!!!!!!!!');
        // prepare to mock suggestion questions
        const suggestions = [
            'What is the top 3 highest number of cancelled flights?',
            'What is the top 3 highest number of delayed flights?',
        ];
        const alternatives = ['Flights Delayed', 'Flights Cancelled'];
        await mockAlternativeSuggestionsIgnoreError(alternatives, suggestions);
        // open dossier from library page
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openDossier(AA_Learning.name);
        // open AI assistant
        await aiAssistant.openAndPin();
        await aiAssistant.sleep(1000);
        // trigger smart suggestion
        await aiAssistant.waitForElementVisible(aiAssistant.getInputArea());
        await aiAssistant.input(smartSuggestionQuestion);
        await aiAssistant.sendQuestionAndWaitForAnswer();
    };

    const createCustomAppForEnableLearningAndApply = async () => {
        // create custom app with feedback disabled
        const enabledLearningBody = getCustomAppBody({
            version: 'v6',
            name: 'Auto_Learning_enableLearning',
            aiSettings: {
                feedback: true,
                learning: true,
            },
        });
        const customIdWithEnabledLearning = await createCustomApp({
            credentials: learningUserCredentials,
            customAppInfo: enabledLearningBody,
        });
        await libraryPage.openCustomAppById({ id: customIdWithEnabledLearning });
        appIdsToDelete.push(customIdWithEnabledLearning);
    };

    const createCustomAppInDarkThemeWithLearningAndApply = async () => {
        const darkThemeBody = getCustomAppBody({
            version: 'v6',
            name: 'Auto_Learning_Darktheme',
            theme: appConsts.darkTheme,
            aiSettings: {
                feedback: true,
                learning: true,
            },
        });
        const customIdWithDarkTheme = await createCustomApp({
            credentials: learningUserCredentials,
            customAppInfo: darkThemeBody,
        });
        await libraryPage.openCustomAppById({ id: customIdWithDarkTheme });
        appIdsToDelete.push(customIdWithDarkTheme);
    };

    const createCustomAppForDisableLearningAndApply = async () => {
        // create custom app with feedback disabled
        const disabledLearningBody = getCustomAppBody({
            version: 'v6',
            name: 'Auto_Learning_DisableLearning',
            aiSettings: {
                feedback: true,
                learning: false,
            },
        });
        const customIdWithDisabledLearning = await createCustomApp({
            credentials: learningUserCredentials,
            customAppInfo: disabledLearningBody,
        });
        await libraryPage.openCustomAppById({ id: customIdWithDisabledLearning });
        appIdsToDelete.push(customIdWithDisabledLearning);
    };

    const appIdsToDelete = [];

    const checkRequestCount = async (requestMock, expectedCount) => {
        await browser.waitUntil(
            async () => {
                return requestMock.calls.length > 0 || requestMock.calls.length === expectedCount;
            },
            {
                timeout: 60000,
                timeoutMsg: 'No forget learning request is caught in 60000ms',
            }
        );
        return requestMock.calls.length === expectedCount;
    };

    beforeAll(async () => {
        await loginPage.login(learningUserCredentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
        await browser.mockRestoreAll();
        await deleteCustomAppList({
            credentials: learningUserCredentials,
            customAppIdList: appIdsToDelete,
        });
        appIdsToDelete.length = 0;
    });

    it('[TC95008_1] learned from smart suggestion', async () => {
        //prepare to test learning text, moke learning result
        await mockLongLearningResult();
        // enable custom app learning
        await createCustomAppForEnableLearningAndApply();
        await openAutoAnswerAndPostAmbiguousQuestion();
        // click on 'Did you mean'
        // pick 1st suggestion question on last answer bubble
        await aiAssistant.clickSmartSuggestion();
        await aiAssistant.waitTillAnswerAppears();
        // check if the learning result is displayed
        await aiAssistant.waitForElementInvisible(aiAssistant.getLearningDialogLoadingIcon(2));
        await aiAssistant.sleep(1000);
        // screenshot on learning component
        await since('Learning result display should be #{expected}, while we get #{actual}')
            .expect(await learning.isLearningSectionDisplayed())
            .toBe(true);
        // prepare for check forget learning request, mock forget learning response
        const forgetRequestMock = await browser.mock('**/api/nuggets/**/deleteRequest');
        // click thumb down on 2nd answer
        await aiAssistant.clickThumbDown(2);
        // verify learning component is dismissed
        await since('Learning result display should be #{expected}, while we get #{actual}')
            .expect(await learning.isLearningSectionDisplayed())
            .toBe(false);
        // verify forget learning request is sent once
        await since('forget learning request count == 1 should be #{expected}, while we get #{actual}')
            .expect(await checkRequestCount(forgetRequestMock, 1))
            .toBe(true);
    });

    it('[TC95008_2] no learning returned when try to learn from smart suggestion', async () => {
        //prepare to test learning text, moke learning result
        await mockLearningNone();
        await createCustomAppForEnableLearningAndApply();
        await openAutoAnswerAndPostAmbiguousQuestion();
        // click on 'Did you mean'
        await aiAssistant.clickSmartSuggestion();
        await aiAssistant.waitTillAnswerAppears();
        // timing problem, need to make learning response delayed to check if the learning loading is displayed
        // wait and check if the learning section is dismissed
        await since('Learning result display should be #{expected}, while we get #{actual}')
            .expect(await learning.isLearningSectionDisplayed())
            .toBe(false);
    });

    it('[TC95008_3] learned from feedback', async () => {
        //prepare to test learning text, moke learning result
        await mockShortLearningResult();
        await createCustomAppForEnableLearningAndApply();
        await openAutoAnswerAndPostNormalQuestion('what is performance of the industry?', true);
        // click on thumb down, input comments, then send
        await aiAssistant.clickThumbDown(1);
        await aiAssistant.inputFeedbackMessage(1, 'This is a test feedback');
        await aiAssistant.clickFeedbackTag(1, 1);
        await aiAssistant.submitFeedback(1);
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialog(1));
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialogHeaderTitle(1));
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialogForgetButton(1));
        // check if the learning result is displayed
        await since('Learning result should be #{expected}, while we get #{actual}')
            .expect(await learning.getLearningText())
            .toContain(shortLearningResult);
        // prepare for check forget learning request, mock forget learning response
        const forgetRequestMock = await browser.mock('**/api/nuggets/**/deleteRequest');
        // click on forget learning
        await aiAssistant.clickForgetLearningBtn(1);
        // check learn section dismissed
        await since('Learning result display should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isLearningResultsDisplayed(1))
            .toBe(false);
        // verify forget learning request is sent once
        await since('forget learning request count == 1 should be #{expected}, while we get #{actual}')
            .expect(await checkRequestCount(forgetRequestMock, 1))
            .toBe(true);
    });

    it('[TC95008_4] no learning is triggered when tag is  Response speed/Other without comment', async () => {
        // prepare to check learning requst, moke learning request
        const learnRequestMock = await browser.mock('**/api/aiservice/chats/learnings');
        await createCustomAppForEnableLearningAndApply();
        await openAutoAnswerAndPostNormalQuestion('what is performance of the industry?', true);
        // click on thumb down, click Other tag without comments, then send
        await aiAssistant.clickThumbDown(1);
        await aiAssistant.clickFeedbackTag(1, 5);
        await aiAssistant.submitFeedback(1);
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialog(1));
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialogHeaderTitle(1));
        await since(
            'Submit feedback without learning, learning result section should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isThanksForYourFeedbackVisible(1))
            .toBe(true);
        await aiAssistant.sleep(4000);
        // verify the learing section is dismissed automatically
        await since(
            'Submit feedback without learning, after several seconds, learning result section should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isLearningResultsDisplayed(1))
            .toBe(false);
        // verify learning request is sent once
        await since('learning request count == 0 should be #{expected}, while we get #{actual}')
            .expect(await checkRequestCount(learnRequestMock, 0))
            .toBe(true);
    });

    it('[TC95008_5] submit tag and comment, learning is triggered, no learned result is returned', async () => {
        // prepare to check learning requst, moke learning request
        const learnRequestMock = await browser.mock('**/api/aiservice/chats/learnings');
        //prepare to test learning text, moke learning result
        await mockLearningNone();
        await createCustomAppForEnableLearningAndApply();
        await openAutoAnswerAndPostNormalQuestion('what is performance of the industry?', true);
        // click on thumb down, click a tag and input comments, then send
        await aiAssistant.clickThumbDown(1);
        await aiAssistant.inputFeedbackMessage(1, 'This is a test feedback');
        await aiAssistant.clickFeedbackTag(1, 1);
        await aiAssistant.submitFeedback(1);
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialog(1));
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialogHeaderTitle(1));
        await aiAssistant.sleep(4000);
        await since('Learning result should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isLearningResultsDisplayed(1))
            .toBe(false);
        // verify learning request is sent once
        await since('learning request count == 1 display should be #{expected}, while we get #{actual}')
            .expect(await checkRequestCount(learnRequestMock, 1))
            .toBe(true);
    });

    it('[TC95009_1] check learning component on answer bubble under dark theme', async () => {
        //prepare to test learning text, moke learning result
        await mockShortLearningResult();
        await createCustomAppInDarkThemeWithLearningAndApply();
        await openAutoAnswerAndPostNormalQuestion('what is total profit of retail industory?', true);
        // click on thumb down, click a tag and input comments, then send
        await aiAssistant.clickThumbDown(1);
        await aiAssistant.inputFeedbackMessage(1, 'This is a test feedback');
        await aiAssistant.clickFeedbackTag(1, 1);
        await aiAssistant.submitFeedback(1);
        // verify learning component displayed with forget
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialog(1));
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialogHeaderTitle(1));
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialogForgetButton(1));
        // take screenshot
        await takeScreenshotByElement(
            await aiAssistant.getLatestAnswer(),
            'TC95009_1',
            'LearningResultInAnswer_DarkTheme'
        );
    });

    it('[TC95009_2] check no learning by smart suggestion in custom app disable learning', async () => {
        // prepare to check learning requst, moke learning request
        const learnRequestMock = await browser.mock('**/api/aiservice/chats/learnings');
        await createCustomAppForDisableLearningAndApply();
        // check no learning request is sent when ask by smart suggestion
        await openAutoAnswerAndPostAmbiguousQuestion();
        // click on 'Did you mean'
        // pick 1st suggestion question on last answer bubble
        await aiAssistant.clickSmartSuggestion();
        await aiAssistant.waitTillAnswerAppears();
        // verify no learning dialog displayed
        await since('Learning result display should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isLearningResultsDisplayed(2))
            .toBe(false);
        //verify no learning reqeust is sent
        await since('learning request count == 0 should be #{expected}, while we get #{actual}')
            .expect(await checkRequestCount(learnRequestMock, 0))
            .toBe(true);
    });

    it('[TC95009_3] check no learning by feedback in custom app disable learning', async () => {
        // prepare to check learning requst, moke learning request
        const learnRequestMock = await browser.mock('**/api/aiservice/chats/learnings');
        await createCustomAppForDisableLearningAndApply();
        // check no learning request is sent when ask by feedback
        await openAutoAnswerAndPostNormalQuestion('what is total profit of retail industory?', true);
        // click on thumb down, input comments, then send
        await aiAssistant.clickThumbDown(1);
        await aiAssistant.inputFeedbackMessage(1, 'This is a test feedback');
        await aiAssistant.clickFeedbackTag(1, 1);
        await aiAssistant.submitFeedback(1);
        await aiAssistant.sleep(4000);
        // verify no learning dialog displayed
        await since('Learning result display should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isLearningResultsDisplayed(1))
            .toBe(false);
        //verify no learning reqeust is sent
        await since('learning request count == 0 should be #{expected}, while we get #{actual}')
            .expect(await checkRequestCount(learnRequestMock, 0))
            .toBe(true);
    });

    it('[TC95009_4] check long learning result on answer bubble under dark theme', async () => {
        //prepare to test learning text, moke learning result
        await mockLongLearningResult();
        await createCustomAppInDarkThemeWithLearningAndApply();
        await openAutoAnswerAndPostNormalQuestion('what is total profit of retail industory?', true);
        // click on thumb down, click a tag and input comments, then send
        await aiAssistant.clickThumbDown(1);
        await aiAssistant.inputFeedbackMessage(1, 'This is a test feedback');
        await aiAssistant.clickFeedbackTag(1, 1);
        await aiAssistant.submitFeedback(1);
        // verify learning component displayed with forget
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialog(1));
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialogHeaderTitle(1));
        await aiAssistant.waitForElementVisible(aiAssistant.getLearningDialogForgetButton(1));
        // take screenshot
        await takeScreenshotByElement(
            await aiAssistant.getLatestAnswer(),
            'TC95009_3',
            'LearningResultInAnswer_DarkTheme'
        );
    });

    it('[TC96813_01] Learning indicator - learning indicator on compact mode ', async () => {
        // clear learning context
        await forgetAllLearnings(learningUserCredentials);

        //prepare I learned context
        await mockLongLearningResult(learingContentID);
        await createCustomAppForEnableLearningAndApply();
        await openAutoAnswerAndPostAmbiguousQuestion();
        await since('initially, learning indicator displayed should be #{expected}, while we get #{actual}')
            .expect(await learning.isLearningIndicatorDisplayed({ index: 1 }))
            .toBe(false);
        // click on 'Did you mean'
        await aiAssistant.clickSmartSuggestion();
        await aiAssistant.waitTillAnswerAppears();
        // check if the learning result is displayed
        await aiAssistant.waitForElementInvisible(aiAssistant.getLearningDialogLoadingIcon(2));
        await since('I learned displayed should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isLearningResultsDisplayed(2))
            .toBe(true);

        // check learning indicator
        await aiAssistant.inputAndSendQuestion(smartSuggestionQuestion);
        await aiAssistant.sleep(1000); //wait learning indicator render
        await since('learning indicator displayed should be #{expected}, while we get #{actual}')
            .expect(await learning.isLearningIndicatorDisplayed({ index: 3 }))
            .toBe(true);
        await takeScreenshotByElement(
            await learning.getLearningIndicator({ index: 3 }),
            'TC96813_01',
            'LearningIndicator'
        );

        // check tooltip
        await learning.clickLearningIndicator({ index: 3 });
        await since('learning indicator tooltip should be #{expected}, while we get #{actual}')
            .expect(await learning.getLearningTooltipText())
            .toBe('The results in this answer follow specific instructions learned from you. Learn More');
        await takeScreenshotByElement(await learning.getLearningTooltip(), 'TC96813_01', 'LearningIndicator_tooltip');

        // learn more
        await learning.clickLearnMoreLinkOnTooltip();
        await since('click learn more, browser tab should be #{expected}, while we get #{actual}')
            .expect(await learning.tabCount())
            .toBe(2);
        await learning.closeTab(1);
    });

    it('[TC96813_02] Learning indicator - learning indicator on focus mode ', async () => {
        // clear learning context
        await forgetAllLearnings(learningUserCredentials);

        //prepare I learned context
        await mockLongLearningResult(learingContentID);
        await createCustomAppForEnableLearningAndApply();
        await openAutoAnswerAndPostAmbiguousQuestion();
        await aiAssistant.clickSmartSuggestion();
        await aiAssistant.waitTillAnswerAppears();
        // check if the learning result is displayed
        await aiAssistant.waitForElementInvisible(aiAssistant.getLearningDialogLoadingIcon(2));
        await since('I learned displayed should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isLearningResultsDisplayed(2))
            .toBe(true);

        // check learning indicator
        await aiAssistant.inputAndSendQuestion(smartSuggestionQuestion_viz);
        await aiAssistant.sleep(500); //wait learning indicator render
        await since('learning indicator displayed should be #{expected}, while we get #{actual}')
            .expect(await learning.isLearningIndicatorDisplayed({ index: 3 }))
            .toBe(true);
        // max to focus mode
        await aiAssistant.maximizeLatestChatbotVisualization();
        await since('max, focus window displayed should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isFocuseModalPresent())
            .toBe(true);
        await since('Focus mode, learning indicator displayed should be #{expected}, while we get #{actual}')
            .expect(await learning.isLearningIndicatorDisplayed({ focusMode: true }))
            .toBe(true);
        await takeScreenshotByElement(
            await aiAssistant.getChatBotVizFocusModalHeader(),
            'TC96813_02',
            'LearningIndicator_focusMode'
        );

        // hover learning indicator
        await learning.clickLearningIndicator({ focusMode: true });
        await since('learning indicator tooltip should be #{expected}, while we get #{actual}')
            .expect(await learning.getLearningTooltipText())
            .toContain('The results in this answer follow specific instructions learned from you');

        await aiAssistant.closeChatbotVizFocusModal();
    });

    it('[TC96813_03] Learning indicator - forget the learning ', async () => {
        // clear learning context
        await forgetAllLearnings(learningUserCredentials);

        //prepare I learned context
        await mockLongLearningResult(learingContentID);
        await createCustomAppForEnableLearningAndApply();
        await openAutoAnswerAndPostAmbiguousQuestion();
        await aiAssistant.clickSmartSuggestion();
        await aiAssistant.waitTillAnswerAppears();
        await aiAssistant.waitForElementInvisible(aiAssistant.getLearningDialogLoadingIcon(2));
        await since('I learned displayed should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isLearningResultsDisplayed(2))
            .toBe(true);

        // check learning indicator
        await aiAssistant.inputAndSendQuestion(smartSuggestionQuestion);
        await aiAssistant.sleep(500); //wait learning indicator render
        await since('learning indicator displayed should be #{expected}, while we get #{actual}')
            .expect(await learning.isLearningIndicatorDisplayed({ index: 3 }))
            .toBe(true);

        // forget learning
        await interpretation.clickCIFromAnswer(3);
        await interpretation.waitForLearningInfoVisible(3);
        await since('interpretation, learning info displayed should be #{expected}, while we get #{actual}')
            .expect(await interpretation.isLearningInfoDisplayed(3))
            .toBe(true);
        await interpretation.forgetLearningContent(3, 1);
        await since('forget learning, forgotten displayed should be #{expected}, while we get #{actual}')
            .expect(await interpretation.getLearningForgottenIcon(3).isDisplayed())
            .toBe(true);

        // re-send questions to check
        await aiAssistant.inputAndSendQuestion(smartSuggestionQuestion);
        await aiAssistant.sleep(500); //wait learning indicator render
        await since('forget lesrning, learning indicator displayed should be #{expected}, while we get #{actual}')
            .expect(await learning.isLearningIndicatorDisplayed({ index: 4 }))
            .toBe(false);
    });

    it('[TC96813_04] Learning indicator - Learning indicator in dark theme ', async () => {
        // clear learning context
        await forgetAllLearnings(learningUserCredentials);

        //prepare I learned context
        await mockLongLearningResult(learingContentID);
        await createCustomAppInDarkThemeWithLearningAndApply();
        await openAutoAnswerAndPostAmbiguousQuestion();
        await aiAssistant.clickSmartSuggestion();
        await aiAssistant.waitTillAnswerAppears();
        await aiAssistant.waitForElementInvisible(aiAssistant.getLearningDialogLoadingIcon(2));
        await since('I learned displayed should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isLearningResultsDisplayed(2))
            .toBe(true);

        // check learning indicator
        await aiAssistant.inputAndSendQuestion(smartSuggestionQuestion_viz);
        await aiAssistant.sleep(500); //wait learning indicator render
        await since('learning indicator displayed should be #{expected}, while we get #{actual}')
            .expect(await learning.isLearningIndicatorDisplayed({ index: 3 }))
            .toBe(true);
        await takeScreenshotByElement(
            await learning.getLearningIndicator({ index: 3 }),
            'TC96813_04',
            'LearningIndicator_darkTheme'
        );

        // check tooltip
        await learning.clickLearningIndicator({ index: 3 });
        await since('learning indicator tooltip should be #{expected}, while we get #{actual}')
            .expect(await learning.getLearningTooltipText())
            .toBe('The results in this answer follow specific instructions learned from you. Learn More');
        await takeScreenshotByElement(
            await learning.getLearningTooltip(),
            'TC96813_04',
            'LearningIndicator_tooltip_darktheme'
        );

        // max to focus mode
        await aiAssistant.maximizeLatestChatbotVisualization();
        await since('Focus mode, learning indicator displayed should be #{expected}, while we get #{actual}')
            .expect(await learning.isLearningIndicatorDisplayed({ focusMode: true }))
            .toBe(true);
        await takeScreenshotByElement(
            await aiAssistant.getChatBotVizFocusModalHeader(),
            'TC96813_04',
            'LearningIndicator_focusMode_darktheme'
        );

        // hover learning indicator
        await learning.clickLearningIndicator({ focusMode: true });
        await since('learning indicator tooltip should be #{expected}, while we get #{actual}')
            .expect(await learning.getLearningTooltipText())
            .toContain('The results in this answer follow specific instructions learned from you');

        await aiAssistant.closeChatbotVizFocusModal();
    });

    it('[TC98354] Check history info in the payload of learning request', async () => {
        const question1 = 'what is the total flight cancelled';
        const question2 = 'what is the top 3 flights';

        // clear learning context
        await forgetAllLearnings(learningUserCredentials);
        await createCustomAppForEnableLearningAndApply();

        // prepare to mock suggestion questions
        const suggestions = [
            'What is the top 3 highest number of cancelled flights?',
            'What is the top 3 highest number of delayed flights?',
        ];
        const alternatives = ['Flights Delayed', 'Flights Cancelled'];
        await mockAlternativeSuggestionsIgnoreError(alternatives, suggestions);

        // open dossier
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openDossier(AA_Learning.name);
        await aiAssistant.openAndPin();

        // post 1 precise question
        await aiAssistant.inputAndSendQuestion(question1);

        // prepare to mock ambiguous and follow up response
        await mockAlternativeSuggestionsIgnoreError(alternatives, suggestions);

        // post 2 ambiguous questions, follow up question 1
        await aiAssistant.clickFollowUp();
        await aiAssistant.inputAndSendQuestion(question2);

        // caopture request payload
        const historyData = await getHistoryPayloadFromLearning(async () => {
            await aiAssistant.clickSmartSuggestion(); // 触发请求的动作
            await aiAssistant.waitTillAnswerAppears(); // 可选，等待某些 UI 状态
        });
        const expectedData = [
            {
                question: question1,
            },
            {
                question: question2,
            },
        ];

        await since('AlternativeSuggestion request payload history should be #{expected}, instead we have #{actual}')
            .expect(historyData)
            .toEqual(expectedData);
    });
});
