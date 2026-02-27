//npm run regression -- --baseUrl=https://mci-u6btx-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.credentials.username=app --params.credentials.password= --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword= --tcList=TC94506_1
//npm run regression -- --baseUrl=https://mci-u6btx-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.credentials.username=app --params.credentials.password= --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=--spec 'specs/regression/aibotChatPanel/ChatPanelSmartSuggestion.spec.js'
import { browserWindow, mobileWindow } from '../../../constants/index.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { chatPanelUser, conEduProId, botChnUser, longAlternatives, longSuggestions } from '../../../constants/bot.js';
import {
    mockAmbiguousAndFollowUpResponse,
    mockAlternativeSuggestionsResponse,
} from '../../../api/mock/mock-response-utils.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import { getCustomAppBody } from '../../../constants/customApp/customAppBody.js';

describe('AI Bot Chat Panel Smart Suggestion_I18N', () => {
    const smartSuggestionBots = {
        yellowThemeBot: {
            id: 'C11BFB16BB46C2B3F48B5CB19AB2188C',
            name: '25. GiveMeTopics_YellowTheme',
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
        await libraryPage.openDefaultApp();
        await loginPage.login(botChnUser);
        await setWindowSize(browserWindow);
        customIdWithDisabledLearning = await createCustomApp({
            credentials: chatPanelUser,
            customAppInfo: disabledLearningBody,
        });
    });

    afterEach(async () => {
        await setWindowSize(browserWindow);
        await browser.refresh();
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
    });

    it('[TC94506_5] Did you mean _ Bot Theme_I18N', async () => {
        //Preparation
        await mockAmbiguousAndFollowUpResponse(true, false);
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

    afterAll(async () => {
        await browser.mockRestoreAll();
        await logoutFromCurrentBrowser();
        await deleteCustomAppList({
            credentials: chatPanelUser,
            customAppIdList: [customIdWithDisabledLearning],
        });
    });
});
