//npm run regression -- --baseUrl=https://mci-u6btx-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.credentials.username=app --params.credentials.password= --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword= --spec 'specs/regression/aibotChatPanel/ChatPanelLearningIndicator_UI.spec.js'
import { browserWindow, aibotMinimumWindow } from '../../../constants/index.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { botLearningIndicatorUser, conEduProId, botLearningIndicatorChnUser } from '../../../constants/bot.js';
import { getRequestBody } from '../../../constants/customApp/bot.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('AI Bot Chat Panel Learning Indicator_UI', () => {
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
        await loginPage.login(botLearningIndicatorUser);
        await libraryPage.openDefaultApp();
        await setWindowSize(browserWindow);
        let customAppInfOn = getRequestBody({
            name: 'openLearningApp',
            disclaimer: '',
            learning: true,
        });
        openLearningCustomAppId = await createCustomApp({
            credentials: botLearningIndicatorUser,
            customAppInfo: customAppInfOn,
        });
        let customAppInfOff = getRequestBody({
            name: 'openLearningApp',
            disclaimer: '',
            learning: false,
        });
        closeLearningCustomAppId = await createCustomApp({
            credentials: botLearningIndicatorUser,
            customAppInfo: customAppInfOff,
        });
    });

    afterEach(async () => {
        await browser.mockRestoreAll();
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: botLearningIndicatorUser,
            customAppIdList: [openLearningCustomAppId, closeLearningCustomAppId],
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC96997]Learning Indicator Basic UI', async () => {
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot1.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getLearningIndicator());

        //Check learning indicator UI and tooltip
        await checkElementByImageComparison(
            aibotChatPanel.getChatAnswerbyIndex(0),
            'dashboardctc/ChatPanel/TC96997_1',
            '01_AnswerBubble_UI'
        );
        await aibotChatPanel.clickLearningIndicator();
        await checkElementByImageComparison(
            aibotChatPanel.getLearningIndicator(),
            'dashboardctc/ChatPanel/TC96997_1',
            '02_Learning Indicator_UI'
        );
        await checkElementByImageComparison(
            aibotChatPanel.getLearningIndicatorDialog(),
            'dashboardctc/ChatPanel/TC96997_1',
            '03_Learning Indicator Dialog_UI'
        );
        await aibotChatPanel.click({ elem: aibotChatPanel.getLearningIndicatorHelpLink() });
        await browser.pause(5000);
        await since('tab count is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.tabCount())
            .toEqual(2);
        await aibotChatPanel.switchToTab(1);
        let url = await browser.getUrl();
        await since('new tab is expected to be #{expected}, instead we have #{actual}}')
            .expect(url)
            .toEqual('https://www2.microstrategy.com/producthelp/Current/Library/en-us/Content/ai_forget_learning.htm');
        await aibotChatPanel.closeTab(1);

        // await aibotChatPanel.hoverTextOnlyChatAnswer(0);
        // await aibotChatPanel.clickFollowUpIconbyIndex(0);
        // await aibotChatPanel.getInputBox().click();
        // await checkElementByImageComparison(
        //     aibotChatPanel.getHighlightMessage(),
        //     'dashboardctc/ChatPanel/TC96997_1',
        //     '04_Highlight_Message_UI'
        // );
    });

    //Color Theme && I18N && Responsive
    it('[TC96998]Learning Indicator Basic UI_ColorI8N', async () => {
        await libraryPage.openCustomAppById({ id: openLearningCustomAppId });
        await libraryPage.switchUser(botLearningIndicatorChnUser);
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot2Color.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getLearningIndicator());
        await setWindowSize(aibotMinimumWindow);

        // //Check learning indicator UI and tooltip
        // await checkElementByImageComparison(
        //     aibotChatPanel.getChatAnswerbyIndex(0),
        //     'dashboardctc/ChatPanel/TC96998',
        //     '01_AnswerBubble_UI'
        // );
        await aibotChatPanel.clickLearningIndicator();
        await checkElementByImageComparison(
            aibotChatPanel.getLearningIndicatorDialog(),
            'dashboardctc/ChatPanel/TC96998',
            '02_Learning Indicator Dialog_UI'
        );
        //DE311216
        await aibotChatPanel.waitForElementClickable(aibotChatPanel.getLearningIndicatorHelpLink());
        await aibotChatPanel.hover({ elem: aibotChatPanel.getLearningIndicatorHelpLink() });
        await checkElementByImageComparison(
            aibotChatPanel.getLearningIndicatorDialog(),
            'dashboardctc/ChatPanel/TC96998',
            '03_Hover Learn More_UI'
        );
        //The Learn More website should follow the locale
        await aibotChatPanel.click({ elem: aibotChatPanel.getLearningIndicatorHelpLink() });
        await browser.pause(5000);
        await since('tab count is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.tabCount())
            .toEqual(2);
        await aibotChatPanel.switchToTab(1);
        let url = await browser.getUrl();
        await since('new tab is expected to be #{expected}, instead we have #{actual}}')
            .expect(url)
            .toEqual('https://www2.microstrategy.com/producthelp/Current/Library/zh-cn/Content/ai_forget_learning.htm');
        await aibotChatPanel.closeTab(1);
    });
});
