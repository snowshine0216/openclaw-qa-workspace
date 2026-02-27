import {
    browserWindow,
    aibotMinimumWindow,
    aibotMediumWindow,
    aibot620pxWindow,
    aibotZoomInWindow,
    aibotTestLinkCollapsedWindow,
} from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { checkScreenByImageComparison } from '../../../utils/TakeScreenshot.js';
import { chatPanelUser, conEduProId } from '../../../constants/bot.js';
import { getRequestBody } from '../../../constants/customApp/bot.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('AIbotChatPanelResponsiveView', () => {
    const aibots = {
        aibot: {
            id: '42E743985A485BFCD2B54F9BC1363FEE',
            name: '12. ResponsiveView',
        },
        aibotWelcome: {
            id: '79EFD9F0AC4FEDE8143B9EB6D0EA8648',
            name: '12. ResponsiveViewWelcome',
        },
        aibotAskQuestion: {
            id: '2AE2F4BB2C4F0D6BDD6BFC92E39DD2C3',
            name: '12. ResponsiveViewAskQuestion',
        },
    };

    const externalLinkUrl = 'https://www.baidu.com/';

    let { loginPage, libraryPage, botConsumptionFrame, aibotChatPanel, botAuthoring } = browsers.pageObj1;
    let longContentsDisclaimerAppId;

    beforeAll(async () => {
        await loginPage.login(chatPanelUser);
        let customAppInfo = getRequestBody({
            name: 'longContentsDisclaimerApp',
            disclaimer:
                'AI can make mistakes. Consider checking important information for accuracy.AI can make mistakes. Consider checking important informationforaccuracyAIcanmake mistakes. Consider checking important ',
            feedback: true,
        });

        longContentsDisclaimerAppId = await createCustomApp({
            credentials: chatPanelUser,
            customAppInfo: customAppInfo,
        });
        await libraryPage.openCustomAppById({ id: longContentsDisclaimerAppId });
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: chatPanelUser,
            customAppIdList: [longContentsDisclaimerAppId],
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC91913_1] responsive view of consumption mode', async () => {
        //Open ask question aibot 1600px
        await libraryPage.openBotById({
            appId: longContentsDisclaimerAppId,
            projectId: conEduProId,
            botId: aibots.aibotAskQuestion.id,
        });
        await setWindowSize(browserWindow);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getAnswerBubbleButtonIconContainerbyIndex(0));
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_01', 'ask question 1600px');
        //Drag to resize the chat panel and show links popover
        await aibotChatPanel.resizeSnapshotPanel(-350);
        await aibotChatPanel.clickLinksPopoverButton();
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_01',
            'ask question open link popover 1600px'
        );
        await aibotChatPanel.clickLinksPopoverItemsbyIndex(1);
        await aibotChatPanel.switchToNewWindow();
        await since('The url of external link should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.currentURL())
            .toBe(externalLinkUrl);
        await aibotChatPanel.switchToTab(0);
        await aibotChatPanel.closeTab(1);
        await aibotChatPanel.resizeSnapshotPanel(300);
        await aibotChatPanel.sleep(3000);
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_01',
            'ask question resize back snapshot panel 1600px'
        );
        await aibotChatPanel.clickCloseSnapshotButton();
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_01',
            'ask question close snapshot panel 1600px'
        );
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        //Resize the window to 650px
        await setWindowSize(aibotMediumWindow);
        await aibotChatPanel.openInterpretation(0);
        await aibotChatPanel.waitForInterpretationLoading();
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_01', 'ask question 650px');
        await aibotChatPanel.clickInterpretationSeeMoreBtn();
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_01', 'interpretation click see more 650px');
        await aibotChatPanel.clickInterpretationSeeMoreBtn();
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_01', 'interpretation click see less 650px');
        await aibotChatPanel.clickInterpretation();
        await aibotChatPanel.clickCloseSnapshotButton();
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_01',
            'ask question close snapshot panel 650px'
        );
        //DE280900
        await setWindowSize(aibot620pxWindow);
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_01',
            'ask question close snapshot panel 620px'
        );
        await setWindowSize(aibotMediumWindow);
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await aibotChatPanel.clickClearHistoryButton();
        await aibotChatPanel.sleep(1000); //wait for the clear history yes button to show up and be more stable
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_01', 'clear history 650px');
        await aibotChatPanel.clickClearHistoryNoButton();
        await aibotChatPanel.clickLinksPopoverButton();
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_01', 'ask question open link popover 650px');
        //Resize the window back to 1600px
        await setWindowSize(aibotTestLinkCollapsedWindow);
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_01',
            'ask question resize back window to 1600px'
        );
        await aibotChatPanel.goToLibrary();
        //Open welcome page aibot 1600px
        await libraryPage.openBotById({
            appId: longContentsDisclaimerAppId,
            projectId: conEduProId,
            botId: aibots.aibotWelcome.id,
        });
        await setWindowSize(browserWindow);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_01', 'welcome page 1600px');
        //Resize the window to 650px
        await setWindowSize(aibotMediumWindow);
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_01', 'welcome page 650px');
        await aibotChatPanel.clickCloseSnapshotButton();
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_01',
            'welcome page close snapshot panel 650px'
        );
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        //Resize the window back to 1600px
        await setWindowSize(browserWindow);
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_01',
            'welcome page resize back window to 1600px'
        );
        await aibotChatPanel.goToLibrary();
        // Open aibot in 1600px
        await libraryPage.openBotById({
            appId: longContentsDisclaimerAppId,
            projectId: conEduProId,
            botId: aibots.aibot.id,
        });
        await aibotChatPanel.clearHistory();
        ////Resize the window to 500px
        await setWindowSize(aibotMinimumWindow);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendations());
        await aibotChatPanel.clickMobileHamburgerButton();
        await aibotChatPanel.openMobileViewSnapshotPanel();
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_01', 'open snapshot 500px');
        await aibotChatPanel.closeMobileViewSnapshotPanel();
        await aibotChatPanel.clickMobileHamburgerButton();
        await aibotChatPanel.clearMobileViewHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_01', 'welcome page 500px');
        //Resize the window back to 650px
        await setWindowSize(aibotMediumWindow);
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_01', 'resize back from 500px to 650px');
        await aibotChatPanel.goToLibrary();
        await libraryPage.openBotById({
            appId: longContentsDisclaimerAppId,
            projectId: conEduProId,
            botId: aibots.aibotAskQuestion.id,
        });
        //Resize the window to 500px
        await setWindowSize(aibotMinimumWindow);
        await aibotChatPanel.openInterpretation(0);
        await aibotChatPanel.waitForInterpretationLoading();
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_01', 'Interpretation 500px');
        await aibotChatPanel.clickInterpretation();
        await aibotChatPanel.clickMobileHamburgerButton();
        await aibotChatPanel.clickMobileViewClearHistoryButton();
        await aibotChatPanel.sleep(1000); //wait for the clear history yes button to show up and be more stable
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_01', 'clear history 500px');
        await aibotChatPanel.clickMobileViewClearHistoryNoButton();
        await aibotChatPanel.clickMobileViewLinksButton();
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_01', 'open link popover 500px');
        await aibotChatPanel.clickMobileHamburgerButton();
        await aibotChatPanel.goToLibrary();
        //open aibot in 500px
        await libraryPage.openBotById({
            appId: longContentsDisclaimerAppId,
            projectId: conEduProId,
            botId: aibots.aibotWelcome.id,
        });
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_01', 'open aibot in 500px');
        //Resize the window back to 1600px
        await setWindowSize(browserWindow);
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_01', 'resize back from 500px to 1600px');
    });

    it('[TC91913_2] responsive view of edit mode', async () => {
        //Open ask question aibot 1600px
        await libraryPage.openBotById({
            appId: longContentsDisclaimerAppId,
            projectId: conEduProId,
            botId: aibots.aibotAskQuestion.id,
        });
        await setWindowSize(browserWindow);
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getVizAnswerByIndex(0));
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_02', 'ask question 1600px');
        //Drag to resize the chat panel and show links popover
        await aibotChatPanel.resizeSnapshotPanel(-300);
        await aibotChatPanel.clickLinksPopoverButton();
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_02',
            'ask question open link popover 1600px'
        );
        await aibotChatPanel.clickLinksPopoverItemsbyIndex(1);
        await aibotChatPanel.switchToNewWindow();
        await since('The url of external link should be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.currentURL())
            .toBe(externalLinkUrl);
        await aibotChatPanel.switchToTab(0);
        await aibotChatPanel.closeTab(1);
        await aibotChatPanel.resizeSnapshotPanel(250);
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_02',
            'ask question resize back snapshot panel 1600px'
        );
        await aibotChatPanel.clickCloseSnapshotButton();
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_02',
            'ask question close snapshot panel 1600px'
        );
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_02',
            'ask question reopen snapshot panel 1600px'
        );
        //Resize the window to 650px
        await setWindowSize(aibotMediumWindow);
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_02', 'ask question 650px');
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_02',
            'ask question open snapshot panel 650px'
        );
        await aibotChatPanel.clickCloseSnapshotButton();
        await aibotChatPanel.clickLinksPopoverButton();
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_02', 'ask question open link popover 650px');
        //Resize the window back to 1600px
        await setWindowSize(browserWindow);
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_02',
            'ask question resize back window to 1600px'
        );
    });

    it('[TC91913_3] responsive view edit mode and consumption mode switch', async () => {
        await libraryPage.openBotById({
            appId: longContentsDisclaimerAppId,
            projectId: conEduProId,
            botId: aibots.aibotAskQuestion.id,
        });
        await setWindowSize(browserWindow);
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getVizAnswerByIndex(0));
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getVizAnswerByIndex(0));
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_03',
            'exit edit mode to consumption mode 1600px'
        );
        await aibotChatPanel.clickCloseSnapshotButton();
        await botConsumptionFrame.clickEditButton();
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_03',
            'close snapshot enter edit mode 1600px'
        );
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getVizAnswerByIndex(0));
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_03',
            'close snapshot exit edit mode to consumption mode 1600px'
        );
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await aibotChatPanel.resizeSnapshotPanel(-300);
        await setWindowSize(aibotMediumWindow);
        await aibotChatPanel.clickLinksPopoverButton();
        await botConsumptionFrame.clickEditButton();
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_03',
            'resize snapshot and enter edit mode 650px'
        );
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getVizAnswerByIndex(0));
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_03',
            'close snapshot and exit edit mode to consumption mode 650px'
        );
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await botConsumptionFrame.clickEditButton();
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_03',
            'open snapshot and enter edit mode 650px'
        );
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getVizAnswerByIndex(0));
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_03',
            'open snapshot and exit edit mode to consumption mode 650px'
        );
    });

    it('[TC91913_4] zoom in very small view', async () => {
        await libraryPage.openBotById({
            appId: longContentsDisclaimerAppId,
            projectId: conEduProId,
            botId: aibots.aibotAskQuestion.id,
        });
        await setWindowSize(aibotZoomInWindow);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendations());
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_04', 'ask question height550px ');
        await aibotChatPanel.scrollChatPanelContainerToBottom();
        await checkScreenByImageComparison(
            'dashboardctc/ChatPanel/TC91913_04',
            'ask question height550px scroll to buttom'
        );
        await libraryPage.openBotById({
            appId: longContentsDisclaimerAppId,
            projectId: conEduProId,
            botId: aibots.aibotWelcome.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendations());
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_04', 'welcome height550px ');
        await aibotChatPanel.scrollChatPanelContainerToBottom();
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91913_04', 'welcome height550px scroll to buttom');
    });
});
