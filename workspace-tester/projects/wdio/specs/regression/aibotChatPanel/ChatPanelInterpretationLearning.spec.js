//npm run regression -- --baseUrl=https://mci-u6btx-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.credentials.username=app --params.credentials.password= --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword= --spec 'specs/regression/aibotChatPanel/ChatPanelInterpretationLearning.spec.js'
import { browserWindow, aibotMinimumWindow } from '../../../constants/index.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { botLearningIndicatorUser, conEduProId, botLearningIndicatorChnUser } from '../../../constants/bot.js';
import { getRequestBody } from '../../../constants/customApp/bot.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { postponeResponse } from '../../../api/mock/mock-response-utils.js';

describe('AI Bot Chat Panel Interpretation Learning', () => {
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

    it('[TC97675_1]Interpretation Learning Basic UI', async () => {
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot1.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getLearningIndicator());

        //Check interpretation UI
        await aibotChatPanel.hoverOnChatAnswer(0);
        await aibotChatPanel.clickInterpretation();
        await aibotChatPanel.waitForInterpretationLoading();
        await aibotChatPanel.hoverLearningManager();
        await checkElementByImageComparison(
            aibotChatPanel.getChatAnswerbyIndex(0),
            'dashboardctc/ChatPanel/TC97675_1',
            '01_Intepretation_UI'
        );

        //Check forget button UI with hover
        await aibotChatPanel.hoverLearningContent();
        await aibotChatPanel.click({ elem: aibotChatPanel.getLearningForgetBtn() });
        await checkElementByImageComparison(
            aibotChatPanel.getChatAnswerbyIndex(0),
            'dashboardctc/ChatPanel/TC97675_1',
            '02_Forget_UI'
        );

        //After click No, return to previous UI
        await aibotChatPanel.click({ elem: aibotChatPanel.getConfirmationBtnOnForget('No') });
        await checkElementByImageComparison(
            aibotChatPanel.getChatAnswerbyIndex(0),
            'dashboardctc/ChatPanel/TC97675_1',
            '03_ForgetNo_UI'
        );

        await aibotChatPanel.hoverLearningContent();
        await aibotChatPanel.click({ elem: aibotChatPanel.getLearningForgetBtn() });

        //After click Yes, show loading icon
        await postponeResponse('**/api/learnings/delete', 'post');
        await aibotChatPanel.click({ elem: aibotChatPanel.getConfirmationBtnOnForget('Yes') });
        const backgroundColor = await aibotChatPanel.getForgetUserLearningLoadingColor();
        const rgbValue = backgroundColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        const expectedRGB = [14, 111, 249];
        await since('The loading icon color should follow Bot Theme ')
            .expect([parseInt(rgbValue[1]), parseInt(rgbValue[2]), parseInt(rgbValue[3])])
            .toEqual(expectedRGB);

        //After loading, show forgotten
        await browser.mockRestoreAll();
        await aibotChatPanel.waitForForgetUserLearningLoading();
        await aibotChatPanel.hoverLearningContent(0, 0);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getForgottenTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getChatAnswerbyIndex(0),
            'dashboardctc/ChatPanel/TC97675_1',
            '04_ForgetYes_UI'
        );
    });

    //Sanity check - this is a shared component owned by AA Team
    it('[TC97675_2]Sanity_LearningManagerOnBot_UI', async () => {
        await libraryPage.openBotById({
            appId: openLearningCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot1.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getLearningIndicator());

        //Check learning manager window UI
        await aibotChatPanel.hoverOnChatAnswer(0);
        await aibotChatPanel.clickInterpretation();
        await aibotChatPanel.waitForInterpretationLoading();
        await aibotChatPanel.openLearningManager();
        await aibotChatPanel.click({ elem: aibotChatPanel.getSwitch() }); //Switch on
        await checkElementByImageComparison(
            aibotChatPanel.getLearningManagerWindow(),
            'dashboardctc/ChatPanel/TC97675_2',
            '02_LearningManager_NoLearingUI'
        );

        //Selected -- verify the window is interactive inside bot
        await aibotChatPanel.click({ elem: aibotChatPanel.getSwitch() }); //Switch off
        await aibotChatPanel.clickCheckBox(1);
        await checkElementByImageComparison(
            aibotChatPanel.getLearningManagerWindow(),
            'dashboardctc/ChatPanel/TC97675_2',
            '03_LearningManagerUI_Selected'
        );

        await aibotChatPanel.click({ elem: aibotChatPanel.getDialogCloseButton() });
    });

    //Color Theme && I18N && Responsive
    it('[TC97675_3]Learning Indicator Basic UI_ColorI8N', async () => {
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

        //Check interpretation UI, forget button UI with hover
        await aibotChatPanel.hoverOnChatAnswer(0);
        await aibotChatPanel.clickInterpretation();
        await aibotChatPanel.waitForInterpretationLoading();
        await aibotChatPanel.hoverLearningContent();
        await aibotChatPanel.click({ elem: aibotChatPanel.getLearningForgetBtn() });
        await checkElementByImageComparison(
            aibotChatPanel.getChatAnswerbyIndex(0),
            'dashboardctc/ChatPanel/TC97675_3',
            '01_Intepretation_UI'
        );

        //Check the loading UI
        await postponeResponse('**/api/learnings/delete', 'post');
        await aibotChatPanel.click({ elem: aibotChatPanel.getConfirmationBtnOnForget('是') });
        const backgroundColor = await aibotChatPanel.getForgetUserLearningLoadingColor();
        const rgbValue = backgroundColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        const expectedRGB = [247, 174, 19];
        await since('The loading icon color should follow Bot Theme')
            .expect([parseInt(rgbValue[1]), parseInt(rgbValue[2]), parseInt(rgbValue[3])])
            .toEqual(expectedRGB);

        //Check forgotten UIx
        await browser.mockRestoreAll();
        await aibotChatPanel.waitForForgetUserLearningLoading();
        await aibotChatPanel.hoverLearningContent(0, 0, { x: 0, y: -7 });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getForgottenTooltip());
        await checkElementByImageComparison(
            aibotChatPanel.getChatAnswerbyIndex(0),
            'dashboardctc/ChatPanel/TC97675_3',
            '02_Forgotten_UI'
        );
    });
});
