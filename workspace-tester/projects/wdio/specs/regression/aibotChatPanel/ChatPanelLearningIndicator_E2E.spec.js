//npm run regression -- --baseUrl=https://mci-u6btx-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.credentials.username=app --params.credentials.password= --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword= --spec 'specs/regression/aibotChatPanel/ChatPanelLearningIndicator_E2E.spec.js'
import { browserWindow, aibotMinimumWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { botLearningIndicatorE2EUser, botLearningIndicatorUser, conEduProId } from '../../../constants/bot.js';
import { getRequestBody } from '../../../constants/customApp/bot.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import deleteUserNuggets from '../../../api/bot/nuggets/deleteUserNuggetsRestAPI.js';
import {
    mockAmbiguousAndFollowUpResponse,
    mockAlternativeSuggestionsResponse,
    mockErrorResponse,
    mockNuggetsUsedInChats,
    mockAbortResponse,
} from '../../../api/mock/mock-response-utils.js';

describe('AI Bot Chat Panel Learning Indicator_E2E', () => {
    const aibots = {
        bot1: {
            name: '38. Learning Indicator',
            id: 'BF08EE99B741D241BE9883980BADDD56',
        },
        bot2Color: {
            name: '38.b Learning Indicator_ColorTheme',
            id: '30A8DEC27541DCB24BF14CAA1F163B4C',
        },
    };

    let { loginPage, libraryPage, aibotChatPanel } = browsers.pageObj1;
    let openLearningCustomAppId;
    let closeLearningCustomAppId;

    beforeAll(async () => {
        await loginPage.login(botLearningIndicatorE2EUser);
        await libraryPage.openDefaultApp();
        await setWindowSize(browserWindow);
        let customAppInfOn = getRequestBody({
            name: 'openLearningApp',
            disclaimer: '',
            learning: true,
        });
        openLearningCustomAppId = await createCustomApp({
            credentials: botLearningIndicatorE2EUser,
            customAppInfo: customAppInfOn,
        });
        let customAppInfOff = getRequestBody({
            name: 'openLearningApp',
            disclaimer: '',
            learning: false,
        });
        closeLearningCustomAppId = await createCustomApp({
            credentials: botLearningIndicatorE2EUser,
            customAppInfo: customAppInfOff,
        });
    });

    beforeEach(async () => {
        await deleteUserNuggets({ credentials: botLearningIndicatorE2EUser });
        await libraryPage.openCustomAppById({ id: openLearningCustomAppId });
    });

    afterEach(async () => {
        await browser.mockRestoreAll();
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: botLearningIndicatorE2EUser,
            customAppIdList: [openLearningCustomAppId, closeLearningCustomAppId],
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC96984_1]Learning Indicator Basic E2E', async () => {
        const LearningRequst = await browser.mock('**/aiservice/chats/learnings', { method: 'post' });

        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot1.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());

        //Ask question with no user learning (with KA) -- no learning indicator
        await mockAmbiguousAndFollowUpResponse(true, false);
        const alternatives = ['Average Capacity', 'EP Score', 'Growth Rate'];
        const suggestions = [
            'Which DEP is best welcomed in upper management based on Average Capacity?',
            'Which DEP is best welcomed in upper management based on EP Score?',
            'Which DEP is best welcomed in upper management based on Growth Rate?',
        ];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.askQuestion('Which DEP is best welcomed in uppper management');
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getSmartSuggestion(0));
        await since('No user learning, no learning indicator')
            .expect(await aibotChatPanel.getLearningIndicator().isDisplayed())
            .toBe(false);

        //Click smart suggestion to learn -- no learning indicator
        await aibotChatPanel.clickSmartSuggestion(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await aibotChatPanel.waitForCheckLearningLoading();
        const UserLearning = LearningRequst.matches[0].body.content;
        await since('Learning expected to be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getFeedbackResults().isDisplayed())
            .toBe(true);
        await since('Smart suggestion question no learning indicator')
            .expect(await aibotChatPanel.getLearningIndicator(1).isDisplayed())
            .toBe(false);

        //Ask question with user learning (no KA) -- show learning indicator
        //await postponeResponse('**/filterNuggets');
        //let saveQA = await browser.mock('**/messages', { method: 'post' });
        await aibotChatPanel.askQuestion('Which DEP is best welcomed');
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        // await browser.waitUntil(
        //     async () => {
        //         const count = saveQA.calls.length;
        //         return count > 0;
        //     },
        //     {
        //         timeout: 10000,
        //     }
        // );
        // await browser.pause(5000);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getLearningIndicator(2));
        await since('Use learning show learning indicator')
            .expect(await aibotChatPanel.getLearningIndicator(2).isDisplayed())
            .toBe(true);

        //Open interpretation, user learning should be listed with 'Forget' button
        await aibotChatPanel.hoverOnChatAnswer(2);
        await aibotChatPanel.clickInterpretationbyIndex(2);
        await aibotChatPanel.waitForInterpretationLoading();
        await since('Learning should be listed in interpretation')
            .expect(await aibotChatPanel.getAnswerLearningText(2, 0))
            .toBe(UserLearning);

        //Check in learning manager, the learning should not be listed
        await aibotChatPanel.openLearningManager();
        await since('Learning should be listed in Learning Manager')
            .expect(await aibotChatPanel.getLearningManagerContent().getText())
            .toBe(UserLearning);
        await aibotChatPanel.click({ elem: aibotChatPanel.getDialogCloseButton() });

        //Click forget, show Loading UI, then foggetten
        await aibotChatPanel.hoverLearningContent(2, 0);
        await since('Hover on learning Forget button should be displayed')
            .expect(await aibotChatPanel.getLearningForgetBtn().isDisplayed())
            .toBe(true);
        await aibotChatPanel.click({ elem: aibotChatPanel.getLearningForgetBtn() });
        await aibotChatPanel.click({ elem: aibotChatPanel.getConfirmationBtnOnForget('Yes') });
        await aibotChatPanel.waitForForgetUserLearningLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getLearningForgottenIcon(2, 0));
        await since('Forgetten button should be displayed')
            .expect(await aibotChatPanel.getLearningForgottenIcon(2, 0).isDisplayed())
            .toBe(true);

        //Check in learning manager, the forgotten learning should not be listed
        await aibotChatPanel.openLearningManager();
        await since('After forgottern no learning in learning manager')
            .expect(await aibotChatPanel.getLearningManagerContent().isExisting())
            .toBe(false);
        const learningSizeRequest = await browser.mock('**/api/learnings?pageSize=100&page=0', { method: 'GET' });
        await setWindowSize(aibotMinimumWindow);
        await setWindowSize(browserWindow);
        const count = learningSizeRequest.calls.length;
        await since('Change window size will not send redundant request').expect(count).toBe(0);
        await aibotChatPanel.click({ elem: aibotChatPanel.getDialogCloseButton() });

        //Reopen bot, show indicator and interpretation
        await aibotChatPanel.goToLibrary();
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot1.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('For answer1 No Use learning no learning indicator')
            .expect(await aibotChatPanel.getLearningIndicator().isDisplayed())
            .toBe(false);
        await since('For answer2 No Use learning no learning indicator')
            .expect(await aibotChatPanel.getLearningIndicator(1).isDisplayed())
            .toBe(false);
        await since('For answer3 Forgetten learning no learning indicator')
            .expect(await aibotChatPanel.getLearningIndicator(2).isDisplayed())
            .toBe(true);
        await aibotChatPanel.hoverOnChatAnswer(2);
        await aibotChatPanel.clickInterpretationbyIndex(2);
        await aibotChatPanel.waitForInterpretationLoading();
        await since('Reopen bot still show learning in interpretation')
            .expect(await aibotChatPanel.getAnswerLearningText(2, 0))
            .toBe(UserLearning);
        await aibotChatPanel.hoverLearningContent(2, 0);
        await since('Hover on learning Forget button should be displayed')
            .expect(await aibotChatPanel.getLearningForgetBtn().isDisplayed())
            .toBe(true);

        //Ask again, show no learning indicator
        await aibotChatPanel.askQuestion('Which DEP is best welcomed');
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await since('No Use learning no learning indicator')
            .expect(await aibotChatPanel.getLearningIndicator(3).isDisplayed())
            .toBe(false);
    });

    //Verify override logic
    //Reopen bot, use nuggetsUsed in chats to override the nuggestsCollection in interpretation
    it('[TC96984_2]Learning Indicator_Override Logic', async () => {
        const predefinedUserLearning =
            'When asking which employee is the best one in upper management, I mean the one with the highest EP Score.';
        const predefinedKA =
            'Upper management consist of employees having department attribute DEP values as CXO and DIR';

        //nuggetsUsed is empty, not override
        await mockNuggetsUsedInChats('');
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot2Color.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('When nuggetsUsed is empty no learning indicator')
            .expect(await aibotChatPanel.getLearningIndicator(0).isDisplayed())
            .toBe(false);
        await aibotChatPanel.hoverOnChatAnswer(0);
        await aibotChatPanel.clickInterpretation();
        await aibotChatPanel.waitForInterpretationLoading();
        await since('When nuggetsUsed is empty UserLearning should be #{expected} instead we have #{actual}')
            .expect(await aibotChatPanel.getAnswerLearningText(0, 0))
            .toBe(predefinedUserLearning);
        await since('When nuggetsUsed is empty KA should be #{expected} instead we have #{actual}')
            .expect(await aibotChatPanel.getAnswerLearningText(0, 1))
            .toBe(predefinedKA);

        //nuggetsUsed is not empty  != nuggetsCollection , override
        const newNuggetsUsed =
            '[{"id":"23A26EAC9B6A417E9829E413D9CAC408","name":"Employee Knowledge Asset 2024-10-12T03:24:42","type":1,"contents":[{"id":"45a10cc3-51a1-4b0b-abe4-2ff248023c0e","contentId":"Sheet: Abbrevations; Position: 5","content":"Mocked KA","score":0.87801224}],"fileName":"Employee Knowledge Asset.xlsx"},{"id":"3D723D79089F44F6A249F9A2ABDB48EF","applicationId":"C2B2023642F6753A2EF159A75E0CFF29","name":"6006C1C97A4D41C330692185B55C3171","type":2,"contents":[{"id":"de8fc227-adb9-4399-86f8-82de51816428","content":"Mocked User Learning","score":0.91551495}]}]';
        await mockNuggetsUsedInChats(newNuggetsUsed);
        await browser.refresh();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.hoverOnChatAnswer(0);
        await aibotChatPanel.clickInterpretation();
        await aibotChatPanel.waitForInterpretationLoading();
        await since('When nuggetsUsed is not empty Learning should be #{expected} instead we have #{actual}')
            .expect(await aibotChatPanel.getAnswerLearningText(0, 0))
            .toBe('Mocked User Learning');
        await since('When nuggetsUsed is not empty KA should be #{expected} instead we have #{actual}')
            .expect(await aibotChatPanel.getAnswerLearningText(0, 1))
            .toBe('Mocked KA');
    });

    //Error handling: get FilteredNuggests Error
    it('[TC96999_1]Error handling: get FilteredNuggests Error', async () => {
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot1.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());

        //Ask question with no user learning (with KA) -- no learning indicator
        await mockAmbiguousAndFollowUpResponse(true, false);
        const alternatives = ['Average Capacity', 'EP Score', 'Growth Rate'];
        const suggestions = [
            'Which DEP is best welcomed in upper management based on Average Capacity?',
            'Which DEP is best welcomed in upper management based on EP Score?',
            'Which DEP is best welcomed in upper management based on Growth Rate?',
        ];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.askQuestion('Which DEP is best welcomed in uppper management');
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getSmartSuggestion(0));
        await since('No user learning, no learning indicator')
            .expect(await aibotChatPanel.getLearningIndicator().isDisplayed())
            .toBe(false);

        //Click smart suggestion to learn -- no learning indicator
        await aibotChatPanel.clickSmartSuggestion(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await aibotChatPanel.waitForCheckLearningLoading();

        //Status code != 200
        await mockErrorResponse('**/filterNuggets', 'post', 400, undefined);
        await aibotChatPanel.askQuestion('Which DEP is best welcomed');
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await since('FilterNuggets failed with 400 status code, no learning indicator')
            .expect(await aibotChatPanel.getLearningIndicator(2).isDisplayed())
            .toBe(false);
        await aibotChatPanel.hoverOnChatAnswer(2);
        await aibotChatPanel.clickInterpretationbyIndex(2);
        await aibotChatPanel.waitForInterpretationLoading();
        await since('FilterNuggets failed with 400 status code No learning in interpretation')
            .expect(await aibotChatPanel.getAnswerLearning().isDisplayed())
            .toBe(false);
        await browser.mockRestoreAll();

        //Content structure wrong
        await mockErrorResponse('**/filterNuggets', 'post', undefined, { message: 'Bad Request' });
        await aibotChatPanel.askQuestion('Which DEP is best welcomed');
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await since('FilterNuggets failed with wrong content structure no learning indicator')
            .expect(await aibotChatPanel.getLearningIndicator(3).isDisplayed())
            .toBe(false);
        await aibotChatPanel.hoverOnChatAnswer(3);
        await aibotChatPanel.clickInterpretationbyIndex(3);
        await aibotChatPanel.waitForInterpretationLoading();
        await since('FilterNuggets failed with wrong content structure No learning in interpretation')
            .expect(await aibotChatPanel.getAnswerLearning(1).isDisplayed())
            .toBe(false);
    });

    //Case5.2 -- Error handling: ./api/chats/learnings/delete
    //DE307976
    it('[TC96999_2]Error handling: delete learning Error', async () => {
        await libraryPage.switchUser(botLearningIndicatorUser);
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot1.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getLearningIndicator());

        //Forget failed -- Status code != 200 for /api/learnings/delete
        await mockErrorResponse('**/api/learnings/delete', 'post', 400, undefined);
        await aibotChatPanel.openInterpretationForgetUserLearning(0, 0, true);
        await aibotChatPanel.getToastbyMessage('Failed to forget, please try again.').isDisplayed();
        await since('Delete learning failed with 400 status code - no forgottent icon')
            .expect(await aibotChatPanel.getLearningForgottenIcon().isDisplayed())
            .toBe(false);
        await browser.mockRestoreAll();

        //Forget failed -- Content structure wrong for /api/learnings/delete
        await mockErrorResponse('**/api/learnings/delete', 'post', undefined, { message: 'Bad Request' });
        await aibotChatPanel.openInterpretationForgetUserLearning(0, 0, true);
        await aibotChatPanel.getToastbyMessage('Failed to forget, please try again.').isDisplayed();
        await since('Delete learning failed with wrong content structure - no forgottent icon')
            .expect(await aibotChatPanel.getLearningForgottenIcon().isDisplayed())
            .toBe(false);
        await browser.mockRestoreAll();

        //Forget failed -- Content deleteRequestStatus 400 wrong for /api/learnings/delete
        const responseBody = {
            content: {
                deleteRequestStatus: [
                    {
                        id: 'bae5cb02-6f4c-4ece-a596-553f57382d6c',
                        status: 400,
                    },
                ],
            },
            telemetry: {
                telemetryLogsByTopics: [
                    {
                        topicHash: 6,
                        messages: [
                            {
                                nugget_id: 'bae5cb02-6f4c-4ece-a596-553f57382d6c',
                                nugget_collection_dss_id: '2217C01DF64E4544B30363873B5744F1',
                                status: 'forgotten',
                                request_time: 1731571438993,
                            },
                        ],
                    },
                ],
            },
        };
        await mockErrorResponse('**/api/learnings/delete', 'post', undefined, responseBody);
        await aibotChatPanel.openInterpretationForgetUserLearning(0, 0, true);
        await aibotChatPanel.getToastbyMessage('Failed to forget, please try again.').isDisplayed();
        await since('Delete learning failed with wrong content structure - no forgottent icon')
            .expect(await aibotChatPanel.getLearningForgottenIcon().isDisplayed())
            .toBe(false);
        await browser.mockRestoreAll();

        //Forget failed -- Timeout for /api/learnings/delete
        await mockAbortResponse('**/api/learnings/delete');
        await aibotChatPanel.openInterpretationForgetUserLearning(0, 0, true);
        await aibotChatPanel.getToastbyMessage('Failed to forget, please try again.').isDisplayed();
        await since('Delete learning failed with timeout - no forgottent icon')
            .expect(await aibotChatPanel.getLearningForgottenIcon().isDisplayed())
            .toBe(false);
    });
});
