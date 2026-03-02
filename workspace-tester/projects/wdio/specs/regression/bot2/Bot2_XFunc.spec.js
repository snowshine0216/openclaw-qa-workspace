import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as bot from '../../../constants/bot2.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { deleteBotV2ChatByAPI } from '../../../api/bot2/chatAPI.js';
import { chatPanelUser } from '../../../constants/bot.js';

describe('Bot2 XFunc', () => {
    const customApp_disableNewbot = {
        name: 'Bot2.0_disableNewBot',
        id: '69A22096BA5348FF97BB728D45CF0BD5',
        projectId: bot.project_applicationTeam.id,
    };
    const customApp_disableEditbot = {
        name: 'Bot2.0_disableEditBot',
        id: 'E9D7846C72634CDAB24402D14602AA39',
        projectId: bot.project_applicationTeam.id,
    };
    const customApp_botAsHome = {
        name: 'Bot2.0_BotAsHome',
        id: 'F3D02E70E6724D17A618F1A3E04A3C7F',
        botName: 'AUTO_BotAsHome',
        botId: '2E9E7DAC6B8E457D9E5A5A588377E183',
        projectId: bot.project_applicationTeam.id,
    };
    const customApp_darkTheme = {
        name: 'Bot2.0_DarkTheme',
        id: 'B919B1FB267E4082B738B04C16004CC8',
        projectId: bot.project_applicationTeam.id,
    };
    const customApp_customFont = {
        name: 'Bot2.0_CustomFont',
        id: '4F2C03E3F1EB4003A6C09147ECEE99EF',
        projectId: bot.project_applicationTeam.id,
    };
    const xfunc_bot = {
        name: 'AUTO_BOT_XFunc',
        id: '1DE7DAF58BB14879A652E8C39FFDD1A1',
        projectId: bot.project_applicationTeam.id,
    };
    const xfunc_bot_colorTheme = {
        name: 'AUTO_BOT_ColorTheme',
        id: '3D773590C67A493D9E22E3801C20A829',
        projectId: bot.project_applicationTeam.id,
    };
    const acl_adc = {
        name: 'AUTO_ADC_ACL',
        id: '79F5987C2A45DDD1150858B9F3BF6103',
        projectId: bot.project_applicationTeam.id,
    };
    const acl_bot = {
        name: 'AUTO_Bot_ACL',
        id: 'CF507E72DA994C11A25B0AA441B7C3E7',
        projectId: bot.project_applicationTeam.id,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const mobileView = {
        width: 550,
        height: 800,
    };

    let {
        libraryPage,
        infoWindow,
        sidebar,
        loginPage,
        listView,
        botAuthoring,
        libraryAuthoringPage,
        aibotChatPanel,
        botConsumptionFrame,
        adc,
        share,
        embedBotDialog,
        snapshotDialog,
        aibotSnapshotsPanel,
        dossierAuthoringPage,
        aibotDatasetPanel,
        historyPanel,
        bot2Chat,
    } = browsers.pageObj1;
    const generalSettings = botAuthoring.generalSettings;

    beforeEach(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.resetToLibraryHome();
        await loginPage.login(bot.xfuncUser);
        await libraryPage.openDefaultApp();

        // open home page
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC70002_01] CustomApp - Sanity Bot application settings', async () => {
        // disable new bot
        await libraryPage.openCustomAppById({ id: customApp_disableNewbot.id });
        await libraryPage.openDossierContextMenu(xfunc_bot.name);
        await since('Disable new bot, context menu edit present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Edit'))
            .toBe(true);
        await libraryPage.clickDossierContextMenuItem('Get Info');
        await since('Disable new bot, info window edit present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isEditIconPresent())
            .toBe(true);
        await infoWindow.close();
        await libraryAuthoringPage.clickNewDossierIcon();
        await since('Disable new bot, the create bot option present should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isCreateBotOptionPresent())
            .toBe(false);

        // disable edit bot
        await libraryPage.openCustomAppById({ id: customApp_disableEditbot.id });
        await libraryPage.openDossierContextMenu(xfunc_bot.name);
        await since('Disable edit bot, context menu edit present should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Edit'))
            .toBe(false);
        await libraryPage.clickDossierContextMenuItem('Get Info');
        await since('Disable edit bot, info window edit present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isEditIconPresent())
            .toBe(false);
        await infoWindow.close();
        await libraryAuthoringPage.clickNewDossierIcon();
        await since('Disable edit bot, the create bot option present should be #{expected}, instead we have #{actual}')
            .expect(await libraryAuthoringPage.isCreateBotOptionPresent())
            .toBe(false);
    });

    it('[TC70002_02] CustomApp - Bot as home', async () => {
        const botName = 'AUTO_' + Date.now();
        // clear chats
        await deleteBotV2ChatByAPI({
            projectId: customApp_botAsHome.projectId,
            botId: customApp_botAsHome.botId,
            credentials: bot.xfuncUser,
        });

        // bot as home
        await libraryPage.openCustomAppById({ id: customApp_botAsHome.id });
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await takeScreenshotByElement(libraryPage.getNavigationBar(), 'TC70002_02', 'BotAsHome');

        // edit bot
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Before edit, save button enable statues should be #{expected}, while we get #{actual}')
            .expect(await botAuthoring.isSaveButtonEnabled())
            .toBe(false);
        await botAuthoring.generalSettings.changeBotName(botName);
        await since('Edit bot name, save button enable statues should be #{expected}, while we get #{actual}')
            .expect(await botAuthoring.isSaveButtonEnabled())
            .toBe(true);

        // update dataset
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.clickUpdateDatasetButton();
        await adc.cancel();
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        // save bot
        await botAuthoring.saveBot({});
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('Save bot, save button enable statues should be #{expected}, while we get #{actual}')
            .expect(await botAuthoring.isSaveButtonEnabled())
            .toBe(false);

        // back to consumption mode
        await botAuthoring.exitBotAuthoring();
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('Save bot, bot name should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toBe(botName);

        // ask question
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('Send question by suggestion, answer count should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getAnswerCount())
            .toBeGreaterThan(1);
    });

    it('[TC70002_03] ColorTheme - Sanity color theme on Bot 2.0', async () => {
        await libraryPage.openCustomAppById({ id: customApp_darkTheme.id });

        await libraryPage.openBot(xfunc_bot_colorTheme.name);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        // navigation bar
        await takeScreenshotByElement(libraryPage.getNavigationBar(), 'TC70002_03', 'navigationBar');
        await share.openSharePanel();
        await takeScreenshotByElement(share.getSharePanel(), 'TC70002_03', 'sharePanel');
        await embedBotDialog.openEmbedBotFromShareMenu();
        await embedBotDialog.hideNameAndTime();
        await takeScreenshotByElement(embedBotDialog.getEmbedBotDialogContainer(), 'TC70002_03', 'EmbededBot');
        await embedBotDialog.downloadEmbedBotSnippet();
        await share.closeSharePanel();

        // check history panal color
        await aibotChatPanel.clickHistoryChatButton();
        let bgColor = await browser.execute(() => {
            return window
                .getComputedStyle(document.querySelector('.mstr-ai-chatbot-HistoriesPanel'))
                .getPropertyValue('--mstr-bot-theme-secondaryColor')
                .trim();
        });
        await since('Panel theme should be dark  #{expected}, instead we have #{actual}')
            .expect(bgColor)
            .toBe('#29313B');
        await historyPanel.closeChatHistoryPanel();

        // snapshot->maximum
        await aibotChatPanel.openSnapshot();
        // await takeScreenshotByElement(aibotSnapshotsPanel.getSnapshotPanelHeader(), 'TC70002_03', 'SnapshotPanelHeader');
        const snapshot = aibotSnapshotsPanel.getSnapshotCardByIndex(0);
        await snapshot.clickMaximizeButton();
        await snapshotDialog.setSavedTime('Saved at XX/XX/XXXX XX:XXXX');
        await takeScreenshotByElement(snapshotDialog.getSnapshotDialogHeader(), 'TC70002_03', 'Maximum');

        // close
        await snapshotDialog.clickCloseButton();
        await aibotChatPanel.closeSnapshot();
    });

    it('[TC70002_04] Responsive - Sanity mobile view for Bot2.0', async () => {
        const question = 'what is the delayed time by year';
        // set mobile view
        await setWindowSize(mobileView);
        await libraryPage.closeSidebar();
        // delete all chats
        await deleteBotV2ChatByAPI({
            projectId: xfunc_bot.projectId,
            botId: xfunc_bot.id,
            credentials: bot.xfuncUser,
        });
        // context menu
        await libraryPage.openDossierContextMenu(xfunc_bot.name, true);
        await since('Mobile view,context menu option count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.getMenuContextItemCount())
            .toBe(9);
        await since('Mobile view, Edit present supposed to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isItemDisplayedInContextMenu('Edit'))
            .toBe(false);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'TC70002_04', 'MobileView_ContextMenu');
        // info window
        await libraryPage.clickDossierContextMenuItem('Get Info', '', true);
        await since('Mobile view, action icon count supposed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(5);
        await since('Mobile view, create bot present should be #{expected}, while we get #{actual}')
            .expect(await infoWindow.isCreateDashboardPresent())
            .toBe(false);
        await takeScreenshotByElement(infoWindow.getActionIcons(), 'TC70002_04', 'MobileView_InfoWindow');
        await infoWindow.close();

        // open bot
        await libraryPage.openBot(xfunc_bot.name);
        // ask question
        await aibotChatPanel.askQuestion(question, true);
        await since('Send question by suggestion, answer count should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getAnswerCount())
            .toBeGreaterThan(0);
        // share panel
        await aibotChatPanel.sleep(2000); // Time buffer for animation
        await aibotChatPanel.clickMobileHamburgerButton();
        await since('Hamburge menu options count should be #{expected}, while we get #{actual}')
            .expect(await libraryPage.hamburgerMenu.getMenuOptionsCount())
            .toBe(8);
        // snapshot
        await aibotChatPanel.openMobileViewSnapshotPanel();
        await aibotChatPanel.closeMobileViewSnapshotPanel();
        await aibotChatPanel.goToLibrary();
    });

    it('[TC70002_05] I18N - Sanity I18N for Bot2.0', async () => {
        // switch to chinese user
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login(bot.i18nUser);

        // info window
        await libraryPage.openDossierInfoWindow(xfunc_bot.name);
        await since('I18N, action icon count supposed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.getActionButtonsCount())
            .toBe(7);
        await takeScreenshotByElement(infoWindow.getActionIcons(), 'TC70002_05', 'I18N_InfoWindow');
        await infoWindow.close();

        // delete chat
        await deleteBotV2ChatByAPI({
            projectId: xfunc_bot.projectId,
            botId: xfunc_bot.id,
            credentials: bot.i18nUser,
        });
        // open bot
        await libraryPage.openBot(xfunc_bot.name);
        await since('Welcome page, text should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getWelcomePageMessageTexts())
            .toContain('今天您需要我做什么');

        // ask question
        await aibotChatPanel.clickRecommendationByIndex(0);
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();
        await since('Send question by suggestion, answer count should be #{expected}, while we get #{actual}')
            .expect(await aibotChatPanel.getAnswerCount())
            .toBeGreaterThan(1);

        // suggestion title
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('day');
        await since(`suggestion title should be #{expected} , instead we have #{actual}`)
            .expect(await aibotChatPanel.getTextOfAutoCompleteHeader())
            .toBe('建议');

        // edit bot
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.hideDatasetList();
        await takeScreenshotByElement(aibotDatasetPanel.getDatasetPanel(), 'TC70002_05', 'I18N_DatasetPanel');

        await botAuthoring.clickCloseButton();
    });

    it('[TC70002_06] ACL - No ACL to dataset', async () => {
        // switch to acl user
        await loginPage.relogin(bot.aclUser_ds);

        // open adc
        await libraryPage.editBotByUrl({ projectId: acl_adc.projectId, botId: acl_adc.id }, false);
        await since('Open ADC error dialogue popup should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isErrorPresent())
            .toBe(true);
        await since('Open ADC error title should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorMsg())
            .toContain('You do not have permission to perform this action');
        await libraryPage.showDetails();
        await since('Open ADC error details should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorDetails())
            .toContain('does not have Execute access to the Report Definition object');
        await libraryPage.dismissError();

        // open bot
        await libraryPage.editBotByUrl({ projectId: acl_bot.projectId, botId: acl_bot.id }, false);
        await since('Open bot error dialogue popup should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isErrorPresent())
            .toBe(true);
        await since('Open bot error title should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorMsg())
            // .toContain('You do not have permission to perform this action');
            .toContain('Sorry, an error has occurred');
        await libraryPage.showDetails();
        await since('Open bot error details should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorDetails())
            .toContain('does not have Execute access to the Report Definition object');
        await libraryPage.dismissError();
    });

    it('[TC70002_07] ACL - No ACL to subset report', async () => {
        // switch to acl user
        await loginPage.relogin(bot.aclUser_report);

        // open adc
        await libraryPage.editBotByUrl({ projectId: acl_adc.projectId, botId: acl_adc.id }, false);
        await since('Open ADC error dialogue popup should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isErrorPresent())
            .toBe(true);
        await since('Open ADC error title should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorMsg())
            .toContain('You do not have permission to perform this action');
        await libraryPage.showDetails();
        await since('Open ADC error details should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorDetails())
            .toContain('does not have Execute access to the Report Definition object');
        await libraryPage.dismissError();

        // open bot
        await libraryPage.editBotByUrl({ projectId: acl_bot.projectId, botId: acl_bot.id }, false);
        await since('Open bot error dialogue popup should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isErrorPresent())
            .toBe(true);
        await since('Open bot error title should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorMsg())
            // .toContain('You do not have permission to perform this action');
            .toContain('Sorry, an error has occurred');
        await libraryPage.showDetails();
        await since('Open bot error details should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorDetails())
            .toContain('does not have Execute access to the Report Definition object');
        await libraryPage.dismissError();
    });

    it('[TC70002_08] ACL - No ACL to ADC', async () => {
        // switch to acl user
        await loginPage.relogin(bot.aclUser_adc);

        // open adc
        await libraryPage.editBotByUrl({ projectId: acl_adc.projectId, botId: acl_adc.id }, false);
        await since('Open ADC, error dialogue popup should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isErrorPresent())
            .toBe(true);
        await since('Open ADC, error title should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorMsg())
            .toContain('You do not have permission to perform this action');
        await libraryPage.showDetails();
        await since('Open ADC, error details should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorDetails())
            .toContain('does not have Read access to the Document Definition object');
        await libraryPage.dismissError();

        // open bot
        await libraryPage.editBotByUrl({ projectId: acl_bot.projectId, botId: acl_bot.id }, false);
        await since('Open bot, error dialogue popup should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isErrorPresent())
            .toBe(true);
        await since('Open bot, error title should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorMsg())
            .toContain('You do not have permission to perform this action');
        await libraryPage.showDetails();
        await since('Open bot, error details should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorDetails())
            .toContain('does not have Read access to the Document Definition object ');
        await libraryPage.dismissError();
    });

    it('[TC70002_09] ACL - No ACL to Bot', async () => {
        // switch to acl user
        await loginPage.relogin(bot.aclUser_bot);

        // open adc
        await libraryPage.editBotByUrl({ projectId: acl_adc.projectId, botId: acl_adc.id });
        await since('Open ADC, error dialogue popup should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isErrorPresent())
            .toBe(false);
        await adc.cancel();

        // open bot
        await libraryPage.editBotByUrl({ projectId: acl_bot.projectId, botId: acl_bot.id });
        await since('Open bot, error dialogue popup should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isErrorPresent())
            .toBe(true);
        await since('Open bot, error title should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorMsg())
            .toContain('You do not have permission to perform this action');
        await libraryPage.showDetails();
        await since('Open bot, error details should contain #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.errorDetails())
            .toContain('does not have Read access to the Document Definition object ');
        await libraryPage.dismissError();
    });

    it('[TC70002_10] ACL - No ACL to schema attribute and metric', async () => {
        // delete all chats
        await deleteBotV2ChatByAPI({
            projectId: acl_bot.projectId,
            botId: acl_bot.id,
            credentials: bot.aclUser_schema,
        });

        // switch to acl user
        await loginPage.relogin(bot.aclUser_schema);
        const question = 'what is the Unit Price by Warranty';
        const attribute_noACL = 'Warranty';
        const metric_noACL = 'Unit Price';

        // open bot
        await libraryPage.editBotByUrl({ projectId: acl_bot.projectId, botId: acl_bot.id });
        await since('Open bot, error dialogue popup should be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.isErrorPresent())
            .toBe(false);

        // dataset panel
        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.disableShowDescription();
        await since(`Element ${attribute_noACL} present should be #{expected}, while we get #{actual}`)
            .expect(await aibotDatasetPanel.isDatasetElementDisplayed(attribute_noACL))
            .toBe(false);
        await since(`Element ${metric_noACL} present should be #{expected}, while we get #{actual}`)
            .expect(await aibotDatasetPanel.isDatasetElementDisplayed(metric_noACL))
            .toBe(false);

        // ask question
        await aibotChatPanel.askQuestion(question);
        await since('the error answer displayed should be #{expected}, instead we have #{actual}')
            .expect(await bot2Chat.verifyAnswerContainsOneOfKeywords('Sorry; not able to answer; could not'))
            .toBe(true);

        // check suggestions
        await aibotChatPanel.openRecommendationPanel();
        for (let i = 0; i < 3; i++) {
            await since(`${i} : suggestion not contains profit should be #{expected}, instead we have #{actual}`)
                .expect(await aibotChatPanel.getRecommendationByIndex(i).getText())
                .not.toContain(attribute_noACL);
        }
    });

    it('[TC70002_11] CustomFont - Check font used correctly on Bot 2.0', async () => {
        // delete all chats
        await deleteBotV2ChatByAPI({
            projectId: xfunc_bot.projectId,
            botId: xfunc_bot.id,
            credentials: bot.xfuncUser,
        });
        await libraryPage.openCustomAppById({ id: customApp_customFont.id });

        await libraryPage.openBot(xfunc_bot.name);
        await aibotChatPanel.waitForRecommendationSkeletonDisappear();

        // navigation bar
        await takeScreenshotByElement(libraryPage.getNavigationBar(), 'TC70002_10', 'navigationBar');
        await share.openSharePanel();
        await takeScreenshotByElement(share.getSharePanel(), 'TC70002_10', 'sharePanel');
        await embedBotDialog.openEmbedBotFromShareMenu();
        await embedBotDialog.hideNameAndTime();
        await takeScreenshotByElement(embedBotDialog.getEmbedBotDialogContainer(), 'TC70002_10', 'EmbededBot');
        await embedBotDialog.closeEmbedBotDialog();
        await share.closeSharePanel();

        // check fonts
        const botName = await aibotChatPanel.getTitleBarBotName();
        await aibotChatPanel.verifyElementFont(botName, 'comic sans ms', 'titlebar bot name');
        const greetingTitle = await aibotChatPanel.getWelcomePageGreetingTitle();
        await aibotChatPanel.verifyElementFont(greetingTitle, 'comic sans ms', 'welcom greeting title');
        const greetingMessage = await aibotChatPanel.getWelcomePageMessage();
        await aibotChatPanel.verifyElementFont(greetingMessage, 'comic sans ms', 'welcom message');
        const recommendation = await aibotChatPanel.getRecommendationByIndex(0);
        await aibotChatPanel.verifyElementFont(recommendation, 'comic sans ms', 'recommendation');

        // ask question
        await aibotChatPanel.getInputBox().click();
        await aibotChatPanel.typeKeyboard('use grid to show canc');
        const suggestionheader = await aibotChatPanel.getAutoCompleteHeader();
        await aibotChatPanel.verifyElementFont(suggestionheader, 'comic sans ms', 'suggestion header');
        const suggestionItem = await aibotChatPanel.getAutoCompleteItembyIndex(0);
        await aibotChatPanel.verifyElementFont(suggestionItem, 'comic sans ms', 'suggestion item');
        await aibotChatPanel.tab();
        await aibotChatPanel.askQuestionByAutoComplete('by year', 0);
        await aibotChatPanel.clickSendIcon();
        await aibotChatPanel.waitForAnswerLoading();
        await aibotChatPanel.waitForElementStaleness(aibotChatPanel.getDisabledNewChatButton());
        // check font in answer
        const agGridCell = aibotChatPanel.getAgGridHeaderCellByIndex(0);
        await aibotChatPanel.verifyElementFont(agGridCell, 'comic sans ms', 'cell in AG grid');

        // edit bot
        await botConsumptionFrame.clickEditButton();
        const botNameTitle = await generalSettings.getBotTitle();
        await aibotChatPanel.verifyElementFont(botNameTitle, 'comic sans ms', 'bot name title');
        const botNameinput = await generalSettings.getBotNameInputV2();
        await aibotChatPanel.verifyElementFont(botNameinput, 'comic sans ms', 'bot name value');

        await botAuthoring.selectBotConfigTabByName('Data');
        await aibotDatasetPanel.hideDatasetList();
        await takeScreenshotByElement(aibotDatasetPanel.getDatasetPanel(), 'TC70002_10', 'CustomFont_DatasetPanel');

        await botAuthoring.clickCloseButton();
    });
});
