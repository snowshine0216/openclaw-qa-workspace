import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { autoAnswerFollowUpUser } from '../../../constants/autoAnswer.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import * as appConsts from '../../../constants/customApp/bot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import {
    mockAmbiguousAndFollowUpResponse,
    mockAlternativeSuggestionsIgnoreError,
    mockAnswerError,
    mockOpenEndedResponse,
} from '../../../api/mock/mock-response-utils.js';

describe('Auto Answers Follow Up', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };
    const AA_E2E = {
        id: 'E7B15D236449AB345EDFFA8691569DB2',
        name: 'AutoAnswers_E2E',
        project,
    };
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const { loginPage, dossierPage, libraryPage, aiAssistant, toc } = browsers.pageObj1;

    const appIdsToDelete = [];

    const question1 = 'Which airline has the most flights cancelled?';
    const answer1 =
        'The airline with the most flights cancelled is Southwest Airlines Co. with **1753** flights cancelled.';
    const question2 = 'Which airline has the least flights cancelled?';
    const answer2 =
        'The airline with the least flights cancelled is:\n\n- **AirTran Airways Corporation** with **739** flights cancelled.';

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await loginPage.login(autoAnswerFollowUpUser);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
        await deleteCustomAppList({
            credentials: autoAnswerFollowUpUser,
            customAppIdList: appIdsToDelete,
        });
        appIdsToDelete.length = 0;
        await logoutFromCurrentBrowser();
    });

    it('[TC95538_1] explicitly quote a question', async () => {
        await resetDossierState({
            credentials: autoAnswerFollowUpUser,
            dossier: AA_E2E,
        });
        await libraryPage.openDossier(AA_E2E.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Auto Complete - 1' });
        await aiAssistant.openAndPin();

        // first question
        await mockAmbiguousAndFollowUpResponse(false, false, answer1);
        await aiAssistant.input(question1);
        await aiAssistant.sendQuestionAndWaitForAnswer();
        // get first question's questionId
        const questionId = await aiAssistant.getQuestionId(1);

        // second question
        await mockAmbiguousAndFollowUpResponse(false, true, answer2);
        await aiAssistant.input(question2);
        await aiAssistant.sendQuestionAndWaitForAnswer();

        // quote the first question
        await aiAssistant.hoverAnswer(1);
        await takeScreenshotByElement(
            await aiAssistant.getAnswerActionsContainer(),
            'TC95538_1',
            'answerActionsContainer'
        );
        await aiAssistant.clickFollowUp(1);
        await aiAssistant.mockTimeInQuotedMessageInInputBox();

        // third question: quote the first question
        const mockResponse = await mockAmbiguousAndFollowUpResponse(false, true);
        await aiAssistant.input('Show me its Flights Delayed');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await aiAssistant.mockTimeInQuotedMessage();
        // await takeScreenshotByElement(await aiAssistant.getLatestQuotedMessage(), 'TC95538_1', 'latestQuotedMessage');

        // verify quotedQuestion
        const postData = JSON.parse(mockResponse.calls[0]?.postData);
        await since('verifyQuotedQuestion should be #{expected}, instead we have #{actual}')
            .expect(
                aiAssistant.verifyQuotedQuestion(
                    {
                        question: question1,
                        answer: answer1,
                        explicitlyQuoted: true,
                        id: questionId,
                        latestQuestion: false,
                        parents: [],
                    },
                    postData.quotedQuestion
                )
            )
            .toBe(true);
    });

    it('[TC95538_2] non-explicitly quote question', async () => {
        await resetDossierState({
            credentials: autoAnswerFollowUpUser,
            dossier: AA_E2E,
        });
        await libraryPage.openDossier(AA_E2E.name);
        await aiAssistant.openAndPin();

        // first question
        await mockAmbiguousAndFollowUpResponse(false, false, answer1);
        await aiAssistant.input(question1);
        await aiAssistant.sendQuestionAndWaitForAnswer();
        // get first question's questionId
        const questionId = await aiAssistant.getQuestionId(1);

        // second question: implicitly quote the first question
        const mockResponse = await mockAmbiguousAndFollowUpResponse(false, true);
        await aiAssistant.input('Show me its Flights Delayed');
        await aiAssistant.sendQuestionAndWaitForAnswer();

        // verify quotedQuestion
        const postData = JSON.parse(mockResponse.calls[0]?.postData);
        await since('verifyQuotedQuestion should be #{expected}, instead we have #{actual}')
            .expect(
                aiAssistant.verifyQuotedQuestion(
                    {
                        question: question1,
                        answer: answer1,
                        explicitlyQuoted: false,
                        id: questionId,
                        latestQuestion: true,
                        parents: [],
                    },
                    postData.quotedQuestion
                )
            )
            .toBe(true);
    });

    it('[TC95538_3] check explicitly quoted question for smart suggestion by click', async () => {
        await resetDossierState({
            credentials: autoAnswerFollowUpUser,
            dossier: AA_E2E,
        });
        await libraryPage.openDossier(AA_E2E.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Auto Complete - 1' });
        await aiAssistant.openAndPin();

        // first question
        await mockAmbiguousAndFollowUpResponse(false, false, answer1);
        await aiAssistant.input(question1);
        await aiAssistant.sendQuestionAndWaitForAnswer();
        const questionId = await aiAssistant.getQuestionId(1);

        // second question, quote the first question
        await aiAssistant.clickFollowUp(1);
        await mockAmbiguousAndFollowUpResponse(true, true);
        await mockAlternativeSuggestionsIgnoreError(['something short'], ['something long']);
        await aiAssistant.input('Show me its Flights Delayed');
        await aiAssistant.sendQuestionAndWaitForAnswer();

        // click smart suggestion
        const mockResponse = await mockAmbiguousAndFollowUpResponse(true, true);
        await aiAssistant.clickSmartSuggestion();
        await aiAssistant.waitForElementInvisible(aiAssistant.getAnswerLoading());
        await aiAssistant.mockTimeInQuotedMessage();
        await takeScreenshotByElement(await aiAssistant.getLatestQuotedMessage(), 'TC95538_3', 'latestQuotedMessage');

        // verify quotedQuestion
        const postData = JSON.parse(mockResponse.calls[0]?.postData);
        console.log(postData.quotedQuestion);
        await since('verifyQuotedQuestion should be #{expected}, instead we have #{actual}')
            .expect(
                aiAssistant.verifyQuotedQuestion(
                    {
                        question: question1,
                        answer: answer1,
                        explicitlyQuoted: true,
                        id: questionId,
                        latestQuestion: false,
                        parents: [],
                    },
                    postData.quotedQuestion
                )
            )
            .toBe(true);
    });

    it('[TC95538_4] check explicitly quoted question for smart suggestion by ask again', async () => {
        await resetDossierState({
            credentials: autoAnswerFollowUpUser,
            dossier: AA_E2E,
        });
        await libraryPage.openDossier(AA_E2E.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Auto Complete - 1' });
        await aiAssistant.openAndPin();

        // first question
        await mockAmbiguousAndFollowUpResponse(false, false, answer1);
        await aiAssistant.input(question1);
        await aiAssistant.sendQuestionAndWaitForAnswer();

        // second question, quote the first question
        await aiAssistant.clickFollowUp(1);
        await mockAmbiguousAndFollowUpResponse(true, true);
        await mockAlternativeSuggestionsIgnoreError(['something short'], ['something long']);
        await aiAssistant.input('Show me its Flights Delayed');
        await aiAssistant.sendQuestionAndWaitForAnswer();

        // ask again
        await aiAssistant.copySmartSuggestionToQuery();
        await aiAssistant.mockTimeInQuotedMessageInInputBox();
        await takeScreenshotByElement(
            await aiAssistant.getQuotedMessageInInputBox(),
            'TC95538_4',
            'quotedMessageInInputBox'
        );
    });

    it('[TC95538_5] check non-explicitly quoted question for smart suggestion by click', async () => {
        await resetDossierState({
            credentials: autoAnswerFollowUpUser,
            dossier: AA_E2E,
        });
        await libraryPage.openDossier(AA_E2E.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Auto Complete - 1' });
        await aiAssistant.openAndPin();

        // first question
        await mockAmbiguousAndFollowUpResponse(false, false, answer1);
        await aiAssistant.input(question1);
        await aiAssistant.sendQuestionAndWaitForAnswer();
        const questionId = await aiAssistant.getQuestionId(1);

        // second question, implicitly quote the first question
        await aiAssistant.clickFollowUp(1);
        await mockAmbiguousAndFollowUpResponse(true, true);
        await mockAlternativeSuggestionsIgnoreError(['something short'], ['something long']);
        await aiAssistant.input('Show me its Flights Delayed');
        await aiAssistant.sendQuestionAndWaitForAnswer();

        // click smart suggestion
        const mockResponse = await mockAmbiguousAndFollowUpResponse(false, false);
        await aiAssistant.clickSmartSuggestion();
        await aiAssistant.waitForElementInvisible(aiAssistant.getAnswerLoading());
        await since('isFollowUpBubbleExistInQuestion should be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.isFollowUpBubbleExistInQuestion())
            .toBe(true);

        // verify quotedQuestion
        const postData = JSON.parse(mockResponse.calls[0]?.postData);
        await since('verifyQuotedQuestion should be #{expected}, instead we have #{actual}')
            .expect(
                aiAssistant.verifyQuotedQuestion(
                    {
                        explicitlyQuoted: true,
                        id: questionId,
                        latestQuestion: false,
                        parents: [],
                        question: question1,
                        answer: answer1,
                    },
                    postData.quotedQuestion
                )
            )
            .toBe(true);
    });

    it('[TC95538_6] check delete follow-up bubble', async () => {
        await resetDossierState({
            credentials: autoAnswerFollowUpUser,
            dossier: AA_E2E,
        });
        await libraryPage.openDossier(AA_E2E.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Auto Complete - 1' });
        await aiAssistant.openAndPin();

        // first question
        await mockAmbiguousAndFollowUpResponse(false, false, answer1);
        await aiAssistant.input(question1);
        await aiAssistant.sendQuestionAndWaitForAnswer();

        // click follow-up
        await aiAssistant.clickFollowUp(1);
        await since('isFollowUpBubbleExistInInputBox should be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.isFollowUpBubbleExistInInputBox())
            .toBe(true);

        // close follow-up bubble
        await aiAssistant.closeFollowUpBubble();
        await since('isFollowUpBubbleExistInInputBox should be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.isFollowUpBubbleExistInInputBox())
            .toBe(false);
    });

    it('[TC95538_7] check click ask again on a follow-up question', async () => {
        await resetDossierState({
            credentials: autoAnswerFollowUpUser,
            dossier: AA_E2E,
        });
        await libraryPage.openDossier(AA_E2E.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Auto Complete - 1' });
        await aiAssistant.openAndPin();

        // first question
        await mockAmbiguousAndFollowUpResponse(false, false, answer1);
        await aiAssistant.input(question1);
        await aiAssistant.sendQuestionAndWaitForAnswer();
        const questionId = await aiAssistant.getQuestionId(1);

        // click follow-up
        await aiAssistant.clickFollowUp(1);
        await aiAssistant.input('Show me its Flights Delayed');
        await aiAssistant.sendQuestionAndWaitForAnswer();

        // ask again
        await aiAssistant.clickAskAgainOnLatestQuestion();
        const mockResponse = await mockAmbiguousAndFollowUpResponse(false, true);
        await aiAssistant.sendQuestionAndWaitForAnswer();

        // verify quotedQuestion
        const postData = JSON.parse(mockResponse.calls[0]?.postData);
        await since('verifyQuotedQuestion should be #{expected}, instead we have #{actual}')
            .expect(
                aiAssistant.verifyQuotedQuestion(
                    {
                        explicitlyQuoted: true,
                        id: questionId,
                        question: question1,
                        answer: answer1,
                        parents: [],
                        latestQuestion: false,
                    },
                    postData.quotedQuestion
                )
            )
            .toBe(true);
    });

    it('[TC95539_1] no follow up button for error answer', async () => {
        await resetDossierState({
            credentials: autoAnswerFollowUpUser,
            dossier: AA_E2E,
        });
        await libraryPage.openDossier(AA_E2E.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Auto Complete - 1' });
        await aiAssistant.openAndPin();

        // first question, error answer
        await mockAnswerError();
        await aiAssistant.input(question1);
        await aiAssistant.sendQuestionAndWaitForAnswer();

        // no follow up action button for error answer
        await since('isFollowUpExistInActionButtons should be #{expected}, instead we have #{actual}')
            .expect(await aiAssistant.isFollowUpExistInActionButtons())
            .toBe(false);
    });

    it('[TC95539_2] check follow up UI in dark mode', async () => {
        // create dark theme custom app and open it
        const customAppId = await createCustomApp({
            credentials: autoAnswerFollowUpUser,
            customAppInfo: appConsts.getRequestBody({
                name: 'FollowUpDarkTheme',
                useColorTheme: true,
                selectedTheme: appConsts.darkTheme,
            }),
        });
        appIdsToDelete.push(customAppId);
        await libraryPage.openCustomAppById({ id: customAppId });

        // set up
        await resetDossierState({
            credentials: autoAnswerFollowUpUser,
            dossier: AA_E2E,
        });
        await libraryPage.openDossier(AA_E2E.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Auto Complete - 1' });
        await aiAssistant.openAndPin();

        // first question
        await mockAmbiguousAndFollowUpResponse(false, false, answer1);
        await aiAssistant.input(question1);
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await aiAssistant.clickFollowUp(1);
        await aiAssistant.mockTimeInQuotedMessageInInputBox();
        await takeScreenshotByElement(
            await aiAssistant.getQuotedMessageInInputBox(),
            'TC95539_2',
            'quotedMessageInInputBox'
        );
        await aiAssistant.input('Show me its Flights Delayed');
        await aiAssistant.sendQuestionAndWaitForAnswer();
        await aiAssistant.mockTimeInQuotedMessage();
        await takeScreenshotByElement(await aiAssistant.getLatestQuotedMessage(), 'TC95539_2', 'latestQuotedMessage');
    });

    xit('[TC95539_3] follow up x-func with open ended', async () => {
        // set up
        await resetDossierState({
            credentials: autoAnswerFollowUpUser,
            dossier: AA_E2E,
        });
        await libraryPage.openDossier(AA_E2E.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Auto Complete - 1' });
        await aiAssistant.openAndPin();

        // first question
        await mockAmbiguousAndFollowUpResponse(false, false, answer1);
        await aiAssistant.input(question1);
        await aiAssistant.sendQuestionAndWaitForAnswer();

        // open ended question, which implicitly quotes the first question
        const alternatives = [
            'What is the total number of flights cancelled for each Airline Name?',
            'How many flights were delayed for each Airline Name?',
            'What is the distribution of flights cancelled and delayed for each Airline Name?',
        ];
        await aiAssistant.clickFollowUp(1);
        await aiAssistant.input('Tell me something about Airline Name');
        await aiAssistant.sendQuestionAndWaitForAnswer();

        // quote the second sub question
        await aiAssistant.clickFollowUp(3);
        const mockResponse = await mockAmbiguousAndFollowUpResponse(false, true);
        await aiAssistant.input('How many flights were delayed for AirTran Airways Corporation?');
        await aiAssistant.sendQuestionAndWaitForAnswer();

        // verify quotedQuestion
        const postData = JSON.parse(mockResponse.calls[0]?.postData);
        await since('verifyQuotedQuestion should be #{expected}, instead we have #{actual}')
            .expect(
                aiAssistant.verifyQuotedQuestion(
                    {
                        explicitlyQuoted: true,
                        question: 'How many flights were delayed for each Airline Name?',
                        latestQuestion: false,
                    },
                    postData.quotedQuestion
                )
            )
            .toBe(true);
        console.log(postData.quotedQuestion);
        await since('parents size should be #{expected}, instead we have #{actual}')
            .expect(postData.quotedQuestion.parents.length)
            .toBe(1);
        await since('parents quesiton should be #{expected}, instead we have #{actual}')
            .expect(postData.quotedQuestion.parents[0].question)
            .toBe(question1);
    });
});
