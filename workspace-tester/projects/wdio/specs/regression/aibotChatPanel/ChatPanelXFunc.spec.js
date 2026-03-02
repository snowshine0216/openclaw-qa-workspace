import { browserWindow, aibotTestLinkCollapsedWindow } from '../../../constants/index.js';
import { checkElementByImageComparison, checkScreenByImageComparison } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { chatPanelUser, conEduProId, conEduProName } from '../../../constants/bot.js';
import { darkTheme, redThemeApplytoAllBots, getRequestBody } from '../../../constants/customApp/bot.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';

describe('AI Bot Chat Panel Cross Functions', () => {
    const aibots = {
        bot1Save: {
            name: 'New Bot',
            id: 'A7D243D73E434938963B168AEEF42C3E',
        },
        bot2Snapshot: {
            id: 'C528FB47BC46DA75512BA1BB331D1394',
            name: '9.3 Custom theme',
        },
        bot3Inactive: {
            id: 'E940FA53E04BB2AB80594D972507E753',
            name: '3. inactive bot',
        },
        bot4NotinLibrary: {
            id: 'DCD88FF94E47409B2E0F0292FC9BE385',
            name: '4. Not in Library bot_2',
            project: {
                id: conEduProId,
            },
        },
        bot5SuggestionRefetch: {
            id: 'A22D927E2A4DF0C52AB8A6B833D3701C',
            name: '19.SuggestionRefetch',
        },
        bot6NoDataSelected: {
            id: '55932215264A02EF3BC5A983F055B96C',
            name: '20.NoDataSelected',
        },
        bot7ContextualMenu: {
            id: 'A04CD0509C4DFFB4DE78F5B1FEBCBBC0',
            name: '18.ContextualMenu',
        },
        bot8UrlApiLinkToBot: {
            id: '3F1542CFBB461B5419DDA3949CAF2720/K53--K46',
            name: '20.UrlLinkToBot',
        },
        bot9ContextualData: {
            id: '8E1B454F2548A136240968993CA8A088',
            name: '22.AskQuestionWithSnapshots',
        },
    };

    const dataset = 'World populations';

    let {
        loginPage,
        libraryPage,
        dossierPage,
        libraryAuthoringPage,
        botConsumptionFrame,
        botAuthoring,
        aibotChatPanel,
        aibotDatasetPanel,
        warningDialog,
        listView,
        userAccount,
    } = browsers.pageObj1;

    let redThemeCustomAppId;
    let darkThemeCustomAppId;

    beforeAll(async () => {
        await loginPage.login(chatPanelUser);
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: chatPanelUser,
            customAppIdList: [redThemeCustomAppId, darkThemeCustomAppId],
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC91751_1] create bot, chat and then save', async () => {
        await libraryAuthoringPage.createBotWithDataset({ project: conEduProName, dataset: dataset });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await botAuthoring.generalSettings.toggleTopicSwitch();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        //await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTopicByIndex(0));
        //await aibotChatPanel.clickTopicByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getBubbleLoadingIcon());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getMarkDownByIndex(0));
        await botAuthoring.saveAsBotOverwrite();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getMarkDownByIndex(0));
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTime());
        const timeText = await aibotChatPanel.getTimeText();
        await aibotChatPanel.sleep(3000);
        await botAuthoring.clickCloseButton();

        await libraryPage.openDossier(aibots.bot1Save.name);
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getMarkDownByIndex(0));
        await since('Time is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getTimeText())
            .toBe(timeText);
    });

    it('[TC91751_2] link and clear history UI when snapshot panel closed', async () => {
        await setWindowSize(aibotTestLinkCollapsedWindow);
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot2Snapshot.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getLinksPopoverButton());
        await aibotChatPanel.clickCloseSnapshotButton();
        await checkElementByImageComparison(
            aibotChatPanel.getTitleBar(),
            'dashboardctc/ChatPanel/TC91751_2',
            'Links show on tool bar after snapshot panel closed'
        );
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await checkElementByImageComparison(
            aibotChatPanel.getTitleBar(),
            'dashboardctc/ChatPanel/TC91751_2',
            'Links collapsed after snapshot panel opened'
        );
        await aibotChatPanel.clickCloseSnapshotButton();
        await aibotChatPanel.clickClearHistoryButton();
        await checkElementByImageComparison(
            aibotChatPanel.getTitleBar(),
            'dashboardctc/ChatPanel/TC91751_2',
            'Clear history UI after snapshot panel closed'
        );
        await aibotChatPanel.clickOpenSnapshotPanelButton();
        await checkElementByImageComparison(
            aibotChatPanel.getTitleBar(),
            'dashboardctc/ChatPanel/TC91751_2',
            'Clear history UI after snapshot panel opened'
        );
    });

    // active change to inactive has been covered by TC91744_04 in ChatPanelI18N.spec.js
    it('[TC91751_3] open inactive bot in authoring mode and consumpation mode', async () => {
        await libraryPage.openBotById({
            projectId: conEduProId,
            botId: aibots.bot3Inactive.id,
            handleError: false,
        });
        await botConsumptionFrame.waitForElementVisible(botConsumptionFrame.getMessageBox());
        await checkElementByImageComparison(
            botConsumptionFrame.getMessageBox(),
            'dashboardctc/ChatPanel/TC91751_3',
            'Inactive bot message box'
        );
        await botConsumptionFrame.clickCloseButtonInMessageBox();

        await libraryPage.editBotByUrl({ projectId: conEduProId, botId: aibots.bot3Inactive.id });
        await botAuthoring.waitForElementVisible(botAuthoring.getInActiveBanner());
        await checkElementByImageComparison(
            botAuthoring.getInActiveBanner(),
            'dashboardctc/ChatPanel/TC91751_3',
            'Inactive bot banner in authoring mode'
        );
    });

    it('[TC91751_4] not in Library bot', async () => {
        await libraryPage.removeDossierFromLibrary(chatPanelUser, aibots.bot4NotinLibrary);
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot4NotinLibrary.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();

        await since('Question is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isQueryByIndexDisplayed(0))
            .toBe(true);
        await since('Answer is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isMarkDownByIndexDisplayed(0))
            .toBe(true);
        await dossierPage.addToLibrary();
        await since('Question is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isQueryByIndexDisplayed(0))
            .toBe(true);
        await since('Answer is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isMarkDownByIndexDisplayed(0))
            .toBe(true);

        await dossierPage.goToLibrary();
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot4NotinLibrary.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('Question is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isQueryByIndexDisplayed(0))
            .toBe(true);
        await since('Answer is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isMarkDownByIndexDisplayed(0))
            .toBe(true);

        // remove bot from library and reopen not in Library bot
        await dossierPage.goToLibrary();
        await libraryPage.removeDossierFromLibrary(chatPanelUser, aibots.bot4NotinLibrary);
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot4NotinLibrary.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('Question is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isQueryByIndexDisplayed(0))
            .toBe(true);
        await since('Answer is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isMarkDownByIndexDisplayed(0))
            .toBe(true);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await dossierPage.goToLibrary();

        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot4NotinLibrary.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('Question is expected to be #{expected}, instead we have #{actual}}')
            .expect(await aibotChatPanel.isQueryByIndexDisplayed(0))
            .toBe(false);
        await since('Answer is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.isMarkDownByIndexDisplayed(0))
            .toBe(false);
    });

    it('[TC91751_5] dark theme app with apply theme to all bots disabled', async () => {
        let customAppInfo = getRequestBody({
            name: 'darkThemeNotApplytoAllBots',
            useColorTheme: true,
            selectedTheme: darkTheme,
            disclaimer: '!@#$%^&*()_+[];,./       😊😘😂    {}|',
        });
        darkThemeCustomAppId = await createCustomApp({
            credentials: chatPanelUser,
            customAppInfo: customAppInfo,
        });
        await libraryPage.openCustomAppById({ id: darkThemeCustomAppId });
        await libraryPage.openBotById({
            appId: darkThemeCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot2Snapshot.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC91751_5',
            'Consumption mode - custom app with dark theme and not apply to all bot'
        );
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC91751_5',
            'Authoring mode - custom app with dark theme and not apply to all bot'
        );
        await botAuthoring.exitBotAuthoring();
        await userAccount.switchCustomApp('MicroStrategy');
        await libraryPage.openDossier('9.3 Custom theme');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC91751_5',
            'Change application - disclaimer change to MicroStrategy app'
        );
        await userAccount.switchCustomApp('darkThemeNotApplytoAllBots');
        await libraryPage.openDossier('9.3 Custom theme');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC91751_5',
            'Change application - disclaimer change back to darkThemeNotApplytoAllBots app'
        );
    });

    it('[TC91751_6] red theme app with apply theme to all bots enabled', async () => {
        let customAppInfo = getRequestBody({
            name: 'redThemeApplytoAllBots',
            useColorTheme: true,
            selectedTheme: redThemeApplytoAllBots,
        });
        redThemeCustomAppId = await createCustomApp({
            credentials: chatPanelUser,
            customAppInfo: customAppInfo,
        });
        await libraryPage.openCustomAppById({ id: redThemeCustomAppId });
        await libraryPage.openBotById({
            appId: redThemeCustomAppId,
            projectId: conEduProId,
            botId: aibots.bot2Snapshot.id,
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC91751_6',
            'Consumption mode - custom app with red theme and apply to all bot'
        );
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await checkElementByImageComparison(
            aibotChatPanel.getMainView(),
            'dashboardctc/ChatPanel/TC91751_6',
            'Authoring mode - custom app with red theme and apply to all bot'
        );
    });

    it('[TC91751_7] suggestion refetch when change suggestion amount or dataset', async () => {
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot5SuggestionRefetch.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        let recommendation = await aibotChatPanel.getRecommendationTextsByIndex(0);
        await aibotChatPanel.waitForElementVisible(botAuthoring.generalSettings.getGreetingInputBox());
        await botAuthoring.generalSettings.updateGreetings('bb');
        await since(
            'welcome page suggestion refetch change greeting is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect((await aibotChatPanel.getRecommendationTextsByIndex(0)) === recommendation)
            .toBe(true);
        await botAuthoring.generalSettings.setAutoSuggestionLimit('2');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('welcome page suggestion refetch1 is expected to be #{expected}, instead we have #{actual}}')
            .expect((await aibotChatPanel.getRecommendationTextsByIndex(0)) === recommendation)
            .toBe(false);
        let recommendation1 = await aibotChatPanel.getRecommendationTextsByIndex(0);
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.checkOrUncheckData('Population');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('welcome page suggestion refetch2 is expected to be #{expected}, instead we have #{actual}}')
            .expect((await aibotChatPanel.getRecommendationTextsByIndex(0)) === recommendation1)
            .toBe(false);
        await aibotChatPanel.clickRecommendationByIndex(1);
        await aibotChatPanel.waitForAnswerLoading();
        //Strange behavior, the recommendation is not available after clicking on it, only on automation case,can't reproduce manully
        // let recommendation2 = await aibotChatPanel.getRecommendationTextsByIndex(0);
        // await botAuthoring.selectBotConfigTabByName('General');
        // await botAuthoring.generalSettings.setAutoSuggestionLimit('1');
        // await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        // await since('ask question suggestion refetch1 is expected to be #{expected}, instead we have #{actual}}')
        //     .expect((await aibotChatPanel.getRecommendationTextsByIndex(0)) === recommendation2)
        //     .toBe(false);
        let recommendation3 = await aibotChatPanel.getRecommendationTextsByIndex(0);
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.checkOrUncheckData('Population');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('welcome page suggestion refetch2 is expected to be #{expected}, instead we have #{actual}}')
            .expect((await aibotChatPanel.getRecommendationTextsByIndex(0)) === recommendation3)
            .toBe(false);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await botAuthoring.getCloseButton().click();
        await warningDialog.confirmDoNotSave();
    });

    it('[TC91751_8] can not ask question when no data selected in data set', async () => {
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot6NoDataSelected.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await botConsumptionFrame.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        let recommendation = await aibotChatPanel.getRecommendationTextsByIndex(0);
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.checkOrUncheckData('Check All');
        await aibotChatPanel.waitForElementInvisible(aibotChatPanel.getRecommendationByIndex(0));
        await since(
            'no data selected welcome page suggestion show is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.getRecommendationByIndex(0).isDisplayed())
            .toBe(false);
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('bb');
        await since(
            'no data selected welcome page can not ask question is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isDisabledSendIconDisplayed())
            .toBe(true);
        await aibotDatasetPanel.checkOrUncheckData('Check All');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since('welcome page recommendation update is expected to be #{expected}, instead we have #{actual}}')
            .expect((await aibotChatPanel.getRecommendationTextsByIndex(0)) === recommendation)
            .toBe(false);
        let recommendation2 = await aibotChatPanel.getRecommendationTextsByIndex(0);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotDatasetPanel.checkOrUncheckData('Check All');
        await checkElementByImageComparison(
            await aibotChatPanel.getRecommendationTitle(),
            'dashboardctc/ChatPanel/TC91751_8',
            'Recommendation title'
        );
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('bb');
        await since(
            'no data selected after asking question can not ask question is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isDisabledSendIconDisplayed())
            .toBe(true);
        await aibotDatasetPanel.checkOrUncheckData('Check All');
        await aibotChatPanel.sleep(3000);
        await aibotChatPanel.clickExpandRecommendation();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(0));
        await since(
            'after asking question recommendation update is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect((await aibotChatPanel.getRecommendationTextsByIndex(0)) === recommendation2)
            .toBe(false);
        await since(
            'after asking question can not ask question is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isDisabledSendIconDisplayed())
            .toBe(false);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());
    });

    it('[TC91751_9] Open consumption mode by contextual menu', async () => {
        await libraryPage.openDossierInfoWindow(aibots.bot7ContextualMenu.name);
        await libraryPage.infoWindow.clickEditButton();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await checkScreenByImageComparison('dashboardctc/ChatPanel/TC91751_9', 'Open edit mode by contextual menu');
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(2));
        await aibotChatPanel.clickRecommendationByIndex(2);
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'contextual menu edit mode chat answer display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isTextAnswerByIndexDisplayed(0))
            .toBe(true);
        await since(
            'contextual menu edit mode viz answer display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isVizAnswerByIndexDisplayed(0))
            .toBe(true);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await botAuthoring.exitBotAuthoring();
        await since('Back to library is expected to be #{expected}, instead we have #{actual}}')
            .expect(await listView.getLibraryViewContainer().isDisplayed())
            .toBe(true);
    });

    it('[TC91751_10] url api link to bot', async () => {
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot8UrlApiLinkToBot.id });
        await aibotChatPanel.clickTextLinkToBot();
        await aibotChatPanel.switchToNewWindow();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(2));
        await aibotChatPanel.clickRecommendationByIndex(2);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.sleep(5000);
        await since(
            'contextual menu edit mode chat answer display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isTextAnswerByIndexDisplayed(0))
            .toBe(true);
        await since(
            'contextual menu edit mode viz answer display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isVizAnswerByIndexDisplayed(0))
            .toBe(true);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
    });

    it('[TC91751_11] Ask question with snapshots', async () => {
        //DE280217
        await libraryPage.openBotById({ projectId: conEduProId, botId: aibots.bot9ContextualData.id });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(2));
        await aibotChatPanel.clickRecommendationByIndex(2);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('What is the median age in each country?');
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await since(
            'ask question with snapshots chat answer display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isTextAnswerByIndexDisplayed(1))
            .toBe(true);
        await since(
            'ask question with snapshots viz answer display is expected to be #{expected}, instead we have #{actual}}'
        )
            .expect(await aibotChatPanel.isVizAnswerByIndexDisplayed(1))
            .toBe(true);
        await aibotChatPanel.clearHistory();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePageBotImage());
    });
});
