//npm run regression -- --baseUrl=https://mci-u6btx-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.credentials.username=app --params.credentials.password= --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword= --tcList=TC94506_2
//npm run regression -- --baseUrl=https://mci-u6btx-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.credentials.username=app --params.credentials.password= --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword= --spec 'specs/regression/aibotChatPanel/ChatPanelSmartSuggestion.spec.js'
import { browserWindow, aibotMinimumWindow, aibotMediumWindow, mobileWindow } from '../../../constants/index.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { chatPanelUser, conEduProId, botChnUser, longAlternatives, longSuggestions } from '../../../constants/bot.js';
import {
    mockAllAmbiguousAndFollowUpResponse,
    mockAlternativeSuggestionsResponse,
    mockQuestionCountInCurrentCycle,
    mockAlternativeSuggestionsErrorResponse,
} from '../../../api/mock/mock-response-utils.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import { getCustomAppBody } from '../../../constants/customApp/customAppBody.js';

describe('AI Bot Chat Panel Smart Suggestion', () => {
    const smartSuggestionBots = {
        defaultBot: {
            id: 'BB7FCEA2924F22A63CC0128556EB8584',
            name: '28. SmartSuggestion',
        },
        yellowThemeBot: {
            id: 'C11BFB16BB46C2B3F48B5CB19AB2188C',
            name: '25. GiveMeTopics_YellowTheme',
        },
        limitBot: {
            id: 'D73D19B89B440F639939DBA6509829E9',
            name: '29.AfterQuestion_HitLimit',
        },
        manipulationErrorBot: {
            id: '1797F246AB4B9CD2D141C7B5C25ABA33',
            name: '30.HumanResourcesBot_UsedForManipulationError',
        },
    };

    const disabledLearningBody = getCustomAppBody({
        version: 'v6',
        name: 'Auto_DisableLearning',
        aiSettings: {
            learning: false,
        },
    });

    let customIdWithDisabledLearning;

    let { loginPage, libraryPage, aibotChatPanel } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(chatPanelUser);
        await libraryPage.openDefaultApp();
        await setWindowSize(browserWindow);
        customIdWithDisabledLearning = await createCustomApp({
            credentials: chatPanelUser,
            customAppInfo: disabledLearningBody,
        });
    });

    afterEach(async () => {
        await browser.mockRestoreAll();
        await setWindowSize(browserWindow);
        await browser.refresh();
        await aibotChatPanel.clearHistory();
    });

    it('[TC94506_1] Did you mean _ loading', async () => {
        await libraryPage.openBotById({
            appId: customIdWithDisabledLearning,
            projectId: conEduProId,
            botId: smartSuggestionBots.defaultBot.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        //Ask ambiguous question - Who has the best performance in non-technical departments?
        await mockAllAmbiguousAndFollowUpResponse(true, false);
        //Postpone the response of '**/alternativeSuggestions' request to check loading UI
        await postponeSuggestionResponse();

        await aibotChatPanel.askQuestion('show the best performance DEP');

        //Check Loading UI
        const loadingBar = await aibotChatPanel.getSmartSuggestionLoadingBar();
        await aibotChatPanel.waitForElementVisible(loadingBar);
        await since('Did you mean panel is expected to be displayed but not}')
            .expect(await aibotChatPanel.getDidYouMeanPanel().isDisplayed())
            .toBe(true);
        await since('loading bar is expected to be displayed but not')
            .expect(await aibotChatPanel.getSmartSuggestionLoadingBar().isDisplayed())
            .toBe(true);
        await since('loading bar animation direction is expected to be #{expected} instead we have #{actual}}')
            .expect((await loadingBar.getCSSProperty('animation-direction')).value)
            .toBe('normal');
        await since('loading bar background is expected to be #{expected} instead we have #{actual}}')
            .expect((await loadingBar.getCSSProperty('background')).value)
            .toContain(
                'linear-gradient(90deg, rgba(41, 49, 59, 0.08) 25%, rgba(41, 49, 59, 0.05) 50%, rgba(41, 49, 59, 0.08) 75%)'
            );
        await since('loading bar height is expected to be #{expected} instead we have #{actual}}')
            .expect((await loadingBar.getCSSProperty('height')).value)
            .toBe('18px');
        await since('loading bar radius is expected to be #{expected} instead we have #{actual}}')
            .expect((await loadingBar.getCSSProperty('border-radius')).value)
            .toBe('20px');

        //Close panel when loading
        await aibotChatPanel.clickDidYouMeanCloseButton();
        await since('Did you mean panel is expected to be closed but not')
            .expect(await aibotChatPanel.getDidYouMeanPanel().isDisplayed())
            .toBe(false);

        //After requst '**/alternativeSuggestions' finished, still no smartSuggestion panel
        await aibotChatPanel.sleep(10 * 1000);
        await since('Did you mean panel is expected to be closed but not')
            .expect(await aibotChatPanel.getDidYouMeanPanel().isDisplayed())
            .toBe(false);
    });

    //This is used to test E2E flow of smart suggestion, no mock is used
    it('[TC94506_2] Did you mean _ smart suggestion', async () => {
        const questionList = {
            question1: {
                question: 'In upper management, which DEP has the most employees of long time service??',
                backQuestion: 'In upper management, which DEP has the most employees of long time service..',
                answerKeywords: 'upper management',
            },
            question2: {
                question: 'So who is the best welcomed in this DEP you answered',
                answerKeywords: 'best welcomed',
            },
            question3: {
                question: 'Which employees is the most hardworking one in this DEP',
            },
        };
        const nuggetName = 'Employee Knowledge Asset';

        await libraryPage.openBotById({
            appId: customIdWithDisabledLearning,
            projectId: conEduProId,
            botId: smartSuggestionBots.defaultBot.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        //Ask ambiguous question
        await aibotChatPanel.askQuestion(questionList.question1.question);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.sleep(2 * 1000);

        //check whether the smart suggestion is displayed, if not, clear history and ask another question
        const DidYouMeanExisting = await aibotChatPanel.getDidYouMeanPanel().isExisting();
        if (!DidYouMeanExisting) {
            questionList.question1.question = questionList.question1.backQuestion; //update question
            await aibotChatPanel.clearHistory();
            await aibotChatPanel.askQuestion(questionList.question1.question);
            await aibotChatPanel.waitForAnswerLoading();
            await aibotChatPanel.waitForElementVisible(aibotChatPanel.getDidYouMeanPanel());
        }
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getSmartSuggestionLoadingBar());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getEnabledSmartSuggestion(0));
        await since('Q1 - Did you mean panel is expected to be opened but not')
            .expect(await aibotChatPanel.getDidYouMeanPanel().isDisplayed())
            .toBe(true);
        await since('Q1 - Enabled Smart Suggestion is expected to be exist but not')
            .expect(await aibotChatPanel.getEnabledSmartSuggestion(0).isDisplayed())
            .toBe(true);

        await aibotChatPanel.clickDidYouMeanCloseButton();
        await since('Q1 - After close btxn Did you mean panel is expected to be closed but not')
            .expect(await aibotChatPanel.getDidYouMeanPanel().isDisplayed())
            .toBe(false);

        //Ask ambiguous question2, show smart suggestion with followup = true
        var suggestionRequst1 = await browser.mock('**/aiservice/chats/alternativeSuggestions', { method: 'post' });
        await aibotChatPanel.askQuestion(questionList.question2.question);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getSmartSuggestionLoadingBar());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await since('Did you mean panel is expected to be opened but not')
            .expect(await aibotChatPanel.getDidYouMeanPanel().isDisplayed())
            .toBe(true);

        //Check the question2's alternativeSuggestions requst -- histroy should contain question1
        console.log(
            `suggestionRequst1's history ${JSON.stringify(
                JSON.parse(suggestionRequst1.matches[0].postData).context.history
            )} `
        );
        const postData1 = JSON.parse(suggestionRequst1.calls[0]?.postData);
        const history1 = postData1.context.history;
        await expect(history1.length).toBe(1);
        await expect(history1[0].question).toEqual(questionList.question1.question);
        await expect(history1[0].answer).toContain(questionList.question1.answerKeywords);
        await expect(history1[0].nuggetsCollections[0].name).toContain(nuggetName);

        //Reopen bot, smart suggestion panel is closed
        await aibotChatPanel.goToLibrary();
        await libraryPage.openBotById({
            appId: customIdWithDisabledLearning,
            projectId: conEduProId,
            botId: smartSuggestionBots.defaultBot.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Did you mean panel is expected to be closed but not')
            .expect(await aibotChatPanel.getDidYouMeanPanel().isDisplayed())
            .toBe(false);

        //DE305083
        //Ask ambiguous question3, show smart suggestion with followup = true
        var suggestionRequst2 = await browser.mock('**/aiservice/chats/alternativeSuggestions', { method: 'post' });
        await aibotChatPanel.askQuestion(questionList.question3.question);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getDidYouMeanPanel());
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getSmartSuggestionLoadingBar());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await since('Did you mean panel is expected to be opened but not')
            .expect(await aibotChatPanel.getDidYouMeanPanel().isDisplayed())
            .toBe(true);

        //Check the question3's alternativeSuggestions requst (after reopen bot) -- histroy should contain question1 and question2
        const postData2 = JSON.parse(suggestionRequst2.calls[0]?.postData);
        const history2 = postData2.context.history;
        await expect(history2.length).toBe(2);
        await expect(history2[0].question).toEqual(questionList.question1.question);
        await expect(history2[0].answer).toContain(questionList.question1.answerKeywords);
        await expect(history2[0].nuggetsCollections[0].name).toContain(nuggetName);
        await expect(history2[1].question).toEqual(questionList.question2.question);
        await expect(history2[1].answer).toContain(questionList.question2.answerKeywords);
        await expect(history2[1].nuggetsCollections[0].name).toContain(nuggetName);

        //Chose a suggestion
        var getSuggestions = suggestionRequst2.matches[0].body.suggestions;
        await aibotChatPanel.clickSmartSuggestion(0);
        var getQuestion = await aibotChatPanel.getLastQueryText();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await since('The send question is expected to be #{expected} instead we have #{actual}}')
            .expect(getQuestion)
            .toBe(getSuggestions[0]);
        await since('The answer is expected to be #{expected} instead we have #{actual}}')
            .expect(await aibotChatPanel.getMarkDownByIndex(3).isDisplayed())
            .toBe(true);

        //Answered question should have NO smart suggestion
        await since('Click suggested question should not trigger smart suggestion again')
            .expect(await aibotChatPanel.getDidYouMeanPanel().isDisplayed())
            .toBe(false);
    });

    it('[TC94506_3] Did you mean _ copy to query', async () => {
        await libraryPage.openBotById({
            appId: customIdWithDisabledLearning,
            projectId: conEduProId,
            botId: smartSuggestionBots.defaultBot.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        //Ask ambiguous question
        await mockAllAmbiguousAndFollowUpResponse(true, false);
        const alternatives = ['Experience Bracket > 5', 'Year of Experience > 10']; //when list < 3, show only 2 items
        const suggestions = [
            'Which DEP has the most employees with Experience Bracket > 5?',
            'Which DEP has the most employees with Year of Experience > 10?',
        ];
        await mockAlternativeSuggestionsResponse(alternatives, suggestions);
        await aibotChatPanel.askQuestion(
            'In upper management, which DEP has the most employees of long time service??'
        );
        await aibotChatPanel.waitForAnswerLoading();

        //Show smart suggestion
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getDidYouMeanPanel());
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getSmartSuggestionLoadingBar());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await checkElementByImageComparison(
            aibotChatPanel.getDidYouMeanPanel(),
            'dashboardctc/ChatPanel/TC94506_3',
            '01_DidYouMeanPanel'
        );

        //Hover on close btn
        await aibotChatPanel.hoverOnDidYouMeanCloseButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getTooltip(),
            'dashboardctc/ChatPanel/TC94506_3',
            '02_CloseButtonTooltip'
        );

        //Hover on suggestion
        await aibotChatPanel.waitForElementEnabled(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.hoverOnSmartSuggestion(0);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestionCopyIcon());
        await aibotChatPanel.hoverOnSmartSuggestionCopyIcon();
        await checkElementByImageComparison(
            aibotChatPanel.getDidYouMeanPanel(),
            'dashboardctc/ChatPanel/TC94506_3',
            '03_CopyTooltip'
        );

        //Copy to query, now smart suggestion panel displayed
        await aibotChatPanel.hoverOnSmartSuggestion(0);
        await aibotChatPanel.clickSmartSuggestionCopyIcon();
        await since('The copied text is expected to be #{expected} instead we have #{actual}}')
            .expect(await aibotChatPanel.getInputBoxText())
            .toBe(suggestions[0]);
        await since('Did you mean panel is expected to be opened but not')
            .expect(await aibotChatPanel.getDidYouMeanPanel().isDisplayed())
            .toBe(true);
        await checkElementByImageComparison(
            aibotChatPanel.getDidYouMeanPanel(),
            'dashboardctc/ChatPanel/TC94506_3',
            '04_AfterClickCopy'
        );

        //Ask question -- close previous smart suggestion panel
        await aibotChatPanel.clickSendBtn();
        await since('Did you mean panel is expected to be closed but not')
            .expect(await aibotChatPanel.getDidYouMeanPanel().isDisplayed())
            .toBe(false);
    });

    it('[TC94506_4] Did you mean _ Responsive View', async () => {
        await libraryPage.openBotById({
            appId: customIdWithDisabledLearning,
            projectId: conEduProId,
            botId: smartSuggestionBots.defaultBot.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        await mockAllAmbiguousAndFollowUpResponse(true, false);
        await mockAlternativeSuggestionsResponse(longAlternatives, longSuggestions);
        await setWindowSize(aibotMinimumWindow);
        //Ask long ambiguous question ?
        await aibotChatPanel.askQuestion('show the best performance DEP');
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getDidYouMeanPanel());
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getSmartSuggestionLoadingBar());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await checkElementByImageComparison(
            aibotChatPanel.getDidYouMeanPanel(),
            'dashboardctc/ChatPanel/TC94506_4',
            '01_DidYouMeanPanel'
        );

        await setWindowSize(aibotMediumWindow);
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await checkElementByImageComparison(
            aibotChatPanel.getDidYouMeanPanel(),
            'dashboardctc/ChatPanel/TC94506_4',
            '02_ZoomInWindow'
        );

        //See More
        await aibotChatPanel.clickSmartSuggestionShowMoreBtn();
        await since('Click See More should expand to show whole msg and show less button')
            .expect(await aibotChatPanel.getSmartSuggestionShowLessBtn().isDisplayed())
            .toBe(true);
        await checkElementByImageComparison(
            aibotChatPanel.getDidYouMeanPanel(),
            'dashboardctc/ChatPanel/TC94506_4',
            '03_SeeMore'
        );

        //See less
        await aibotChatPanel.clickSmartSuggestionShowLessBtn();
        await checkElementByImageComparison(
            aibotChatPanel.getDidYouMeanPanel(),
            'dashboardctc/ChatPanel/TC94506_4',
            '04_SeeLess'
        );
    });

    it('[TC94506_5] Did you mean _ Bot Theme_I18N', async () => {
        //Login as I18N user
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await loginPage.login(botChnUser);

        //Preparation
        await mockAllAmbiguousAndFollowUpResponse(true, false);
        await mockAlternativeSuggestionsResponse(longAlternatives, longSuggestions);
        await libraryPage.openBotById({
            appId: customIdWithDisabledLearning,
            projectId: conEduProId,
            botId: smartSuggestionBots.yellowThemeBot.id,
        });
        await aibotChatPanel.clearHistory();

        //Ask ambiguous question
        await aibotChatPanel.askQuestion('best performance country');

        // //Loading UI
        // const loadingBar = await aibotChatPanel.getSmartSuggestionLoadingBar();
        // await aibotChatPanel.waitForElementVisible(loadingBar);
        // await since('loading bar background is expected to be #{expected}, instead we have #{actual}}')
        //     .expect((await loadingBar.getCSSProperty('background')).value)
        //     .toContain(
        //         'linear-gradient(90deg, rgba(255, 255, 255, 0.08) 25%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.08) 75%)'
        //     );

        //Smart Suggestion UI
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getSmartSuggestionLoadingBar());
        await aibotChatPanel.waitForElementVisible(await aibotChatPanel.getSmartSuggestion(0));
        await checkElementByImageComparison(
            aibotChatPanel.getDidYouMeanPanel(),
            'dashboardctc/ChatPanel/TC94506_5',
            '01_DidYouMeanPanel'
        );

        //Hover on close button
        await aibotChatPanel.hoverOnDidYouMeanCloseButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getTooltip(),
            'dashboardctc/ChatPanel/TC94506_5',
            '02_CloseButtonTooltip'
        );

        //Hover on suggestion
        await aibotChatPanel.hoverOnSmartSuggestion(0);
        await aibotChatPanel.hoverOnSmartSuggestionCopyIcon();
        await checkElementByImageComparison(
            aibotChatPanel.getDidYouMeanPanel(),
            'dashboardctc/ChatPanel/TC94506_5',
            '03_CopyTooltip'
        );

        //See More / See Less
        await setWindowSize(mobileWindow);
        await aibotChatPanel.clickSmartSuggestionShowMoreBtn();
        await checkElementByImageComparison(
            aibotChatPanel.getDidYouMeanPanel(),
            'dashboardctc/ChatPanel/TC94506_5',
            '04_SeeMoreLess'
        );
    });

    //DE294719
    it('[TC94506_6] Did you mean _ Disabled when hit limitation', async () => {
        await mockAllAmbiguousAndFollowUpResponse(true, false);
        await mockAlternativeSuggestionsResponse(longAlternatives, longSuggestions);
        await mockQuestionCountInCurrentCycle(199);
        await browser.refresh();

        await libraryPage.openBotById({
            appId: customIdWithDisabledLearning,
            projectId: conEduProId,
            botId: smartSuggestionBots.limitBot.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        //Ask ambiguous question
        await aibotChatPanel.askQuestion('best performance country');
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getSmartSuggestionLoadingBar());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getDidYouMeanPanel());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.sleep(1 * 1000);
        await aibotChatPanel.clickSmartSuggestion(0);
        await checkElementByImageComparison(
            aibotChatPanel.getDidYouMeanPanel(),
            'dashboardctc/ChatPanel/TC94506_6',
            '01_DidYouMeanPanel_Disabled'
        );

        //See More and See Less are still available
        await setWindowSize(aibotMediumWindow);
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await aibotChatPanel.clickSmartSuggestionShowMoreBtn();
        await since('Click see more should expand to show whole msg and show less button')
            .expect(await aibotChatPanel.getSmartSuggestionShowLessBtn().isDisplayed())
            .toBe(true);
        await checkElementByImageComparison(
            aibotChatPanel.getDidYouMeanPanel(),
            'dashboardctc/ChatPanel/TC94506_6',
            '02_SeeMore'
        );
        await aibotChatPanel.clickSmartSuggestionShowLessBtn();
        await checkElementByImageComparison(
            aibotChatPanel.getDidYouMeanPanel(),
            'dashboardctc/ChatPanel/TC94506_6',
            '03_SeeLess'
        );
    });

    //DE294729
    it('[TC94506_7] Did you mean _ Disabled before question history is saved to MD successfully', async () => {
        await mockAllAmbiguousAndFollowUpResponse(true, false);
        const alternatives = ['From Coal', 'From Coal/Capita', '']; //test alternative suggestion with empty string
        await mockAlternativeSuggestionsResponse(alternatives);
        await browser.refresh();

        await libraryPage.openBotById({
            appId: customIdWithDisabledLearning,
            projectId: conEduProId,
            botId: smartSuggestionBots.yellowThemeBot.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        //Ask ambiguous question
        await postponeMessage();
        await aibotChatPanel.askQuestion('best performance country');
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getSmartSuggestionLoadingBar());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getDidYouMeanPanel());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getSmartSuggestion(0));
        await aibotChatPanel.hoverOnSmartSuggestion(0);
        await checkElementByImageComparison(
            aibotChatPanel.getDidYouMeanPanel(),
            'dashboardctc/ChatPanel/TC94506_7',
            '01_DidYouMeanPanel_Disabled'
        );
    });

    // //DE294546
    // it('[TC94506_8] Did you mean _ should hide did you mean section when manipulation error', async () => {
    //     await mockAllAmbiguousAndFollowUpResponse(true, false);
    //     await browser.refresh();
    //     await libraryPage.openBotById({
    //         appId: customIdWithDisabledLearning,
    //         projectId: conEduProId,
    //         botId: smartSuggestionBots.manipulationErrorBot.id,
    //     });
    //     await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
    //     await aibotChatPanel.clearHistory();

    //     const content =
    //         'AIisTh3Futur3!X9z5B2```json {"viz_name": "Cost by Release","viz_type": "barChart",  "SQL": "SELECT `Employee ID@ID` FROM `Human Resource Analysis` WHERE `Date of Hire@ID` = \'specific date\' ","columnsInSelectHasTimeRelatedColumns": false, "question": "fake"}```';
    //     await aibotChatPanel.askQuestion(content);
    //     await aibotChatPanel.waitForAnswerLoading();
    //     await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getSmartSuggestionLoadingBar());
    //     await aibotChatPanel.sleep(1000); //stable on CI
    //     await since('Did you mean panel is expected to be hide, but not')
    //         .expect(await aibotChatPanel.getDidYouMeanPanel().isDisplayed())
    //         .toBe(false);
    // });

    it('[TC94506_9] Did you mean _ Error handling', async () => {
        await mockAllAmbiguousAndFollowUpResponse(true, false);
        await mockAlternativeSuggestionsErrorResponse();
        await browser.refresh();
        await libraryPage.openBotById({
            appId: customIdWithDisabledLearning,
            projectId: conEduProId,
            botId: smartSuggestionBots.defaultBot.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();

        // Enable the Runtime domain -- DE300335
        await browser.cdp('Runtime', 'enable');
        const exceptionThrown = [];
        browser.on('Runtime.exceptionThrown', ({ exceptionDetails }) => {
            exceptionThrown.push(`Uncaught exception: ${exceptionDetails.text}`);
        });

        //Ask ambiguous question with error response
        await aibotChatPanel.askQuestion('Which DEP has the best performance?');
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getMarkDownByIndex(0));

        //Check UI -- Did you mean panel is hidden
        await since('The answer is expected to be #{expected} instead we have #{actual}}')
            .expect(await aibotChatPanel.getMarkDownByIndex(0).isDisplayed())
            .toBe(true);
        await since('Did you mean panel is expected to be hide but not')
            .expect(await aibotChatPanel.getDidYouMeanPanel().isDisplayed())
            .toBe(false);

        //Check console error -- DE300335
        await since('Should be no error in chrome console').expect(exceptionThrown.length).toBe(0);
        if (exceptionThrown.length > 0) {
            exceptionThrown.forEach((error) => {
                console.error(error);
            });
            throw new Error(`There are console errors on the page: \n${exceptionThrown.join('\n')}`);
        }
    });

    afterAll(async () => {
        await browser.mockRestoreAll();
        await logoutFromCurrentBrowser();
        await deleteCustomAppList({
            credentials: chatPanelUser,
            customAppIdList: [customIdWithDisabledLearning],
        });
    });
});

async function postponeSuggestionResponse() {
    const suggestionRequst = await browser.mock('**/aiservice/chats/alternativeSuggestions', { method: 'post' });
    suggestionRequst.respondOnce(
        async (request) =>
            new Promise((resolve) => {
                console.log('Postpone the response of **/alternativeSuggestions');
                setTimeout(() => resolve({ statusCode: request.statusCode, body: request.body }), 10 * 1000);
            })
    );
}

async function postponeMessage() {
    const suggestionRequst = await browser.mock('**/messages', { method: 'post' });
    suggestionRequst.respondOnce(
        async (request) =>
            new Promise((resolve) => {
                console.log('Postpone the response of **/messages');
                setTimeout(() => resolve({ statusCode: request.statusCode, body: request.body }), 20 * 1000);
            })
    );
}
