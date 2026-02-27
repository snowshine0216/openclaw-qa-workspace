//npm run regression -- --baseUrl=https://mci-u6btx-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.credentials.username=app --params.credentials.password= --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword= --spec 'specs/regression/aibotChatPanel/ChatPanelLearningIndicator_SessionTimeout.spec.js'
import deleteSession from '../../../api/deleteSession.js';
import urlParser from '../../../api/urlParser.js';
import { browserWindow } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { botLearningIndicatorE2EUser, botLearningIndicatorUser, conEduProId } from '../../../constants/bot.js';
import { getRequestBody } from '../../../constants/customApp/bot.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';

describe('AI Bot Chat Panel Learning Indicator_SessionTimout', () => {
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

    beforeAll(async () => {
        let customAppInfOn = getRequestBody({
            name: 'openLearningApp',
            disclaimer: '',
            learning: true,
        });
        openLearningCustomAppId = await createCustomApp({
            credentials: botLearningIndicatorUser,
            customAppInfo: customAppInfOn,
        });
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
        if (await loginPage.isLoginPageDisplayed()) {
            await loginPage.login(botLearningIndicatorUser);
        }
        await setWindowSize(browserWindow);
        await libraryPage.openCustomAppById({ id: openLearningCustomAppId });
    });

    afterEach(async () => {
        await browser.mockRestoreAll();
        await libraryPage.reload();
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: botLearningIndicatorE2EUser,
            customAppIdList: [openLearningCustomAppId],
        });
    });

    it('[TC96999_3]Error handling: Session timeout + forget learning in intepretaion', async () => {
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot1.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getLearningIndicator());

        await aibotChatPanel.hoverOnChatAnswer(0);
        await aibotChatPanel.clickInterpretation();
        await aibotChatPanel.waitForInterpretationLoading();

        const baseUrl = urlParser(browser.options.baseUrl);
        const cookies = await browser.getCookies();
        await deleteSession(baseUrl, cookies);

        await aibotChatPanel.hoverLearningContent(0, 0);
        await since('Hover on learning Forget button should be displayed')
            .expect(await aibotChatPanel.getLearningForgetBtn().isDisplayed())
            .toBe(true);
        await aibotChatPanel.click({ elem: aibotChatPanel.getLearningForgetBtn() });
        await aibotChatPanel.click({ elem: aibotChatPanel.getConfirmationBtnOnForget('Yes') });
        await aibotChatPanel.waitForForgetUserLearningLoading();
        await aibotChatPanel.getToastbyMessage('Failed to forget, please try again.').isDisplayed();
        await since('Delete learning failed with timeout - no forgottent icon')
            .expect(await aibotChatPanel.getLearningForgottenIcon().isDisplayed())
            .toBe(false);
    });

    it('[TC96999_4]Error handling: Session timeout + open learning manager', async () => {
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot1.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getLearningIndicator());

        await aibotChatPanel.hoverOnChatAnswer(0);
        await aibotChatPanel.clickInterpretation();
        await aibotChatPanel.waitForInterpretationLoading();

        const baseUrl = urlParser(browser.options.baseUrl);
        const cookies = await browser.getCookies();
        await deleteSession(baseUrl, cookies);

        await aibotChatPanel.clickLearningManager(0);
        await aibotChatPanel.waitForLibraryLoading();
        await aibotChatPanel.getLearningManagerNoDataWindow().isDisplayed();
        await since('Session timeout back to library')
            .expect(await loginPage.getLoginButton().isDisplayed())
            .toBe(true);
    });
});
