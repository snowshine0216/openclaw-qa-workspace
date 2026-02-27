import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement, takeScreenshot } from '../../../utils/TakeScreenshot.js';
import { createBotByAPI, publishBotByAPI, deleteBotList } from '../../../api/bot/index.js';
import { browserWindow } from '../../../constants/index.js';
import { getBotConfigurationObject, seamlessEditBotUser } from '../../../constants/bot.js';

describe('AI Bot Test of Seamless Edit', () => {
    const BotToCreate = {
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        },
        data: {
            datasets: [
                {
                    id: '2F4F0B6753429DF701EB65AA27B63068',
                    name: 'byd_balance_ds_en', //02_Users > xuyin > byd_balance_ds_en
                },
            ],
            isBot: true,
            overwrite: true,
            name: 'SeamlessEdit Bot',
            description: '',
            folderId: 'D3C7D461F69C4610AA6BAA5EF51F4125', //Tutorial > Public Objects > Reports
        },
    };

    const BotToTest = {
        defaultName: 'New Bot',
        modifiedName: 'Modified Name',
    };

    const publishInfo = {
        type: 'document_definition',
        recipients: [
            {
                id: '279674981A4B33BBD45F5181A4D543C3',
            },
        ],
        projectId: BotToCreate.project.id,
    };

    let {
        loginPage,
        libraryPage,
        libraryAuthoringPage,
        botAuthoring,
        aibotChatPanel,
        warningDialog,
        botConsumptionFrame,
        dossierPage,
    } = browsers.pageObj1;
    let botId;
    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(seamlessEditBotUser);
    });

    beforeEach(async () => {
        botId = await createBotByAPI({ credentials: seamlessEditBotUser, botInfo: BotToCreate });
        publishInfo.id = botId;
        await publishBotByAPI({
            credentials: seamlessEditBotUser,
            publishInfo: publishInfo,
        });
        await libraryPage.openDefaultApp();
    });

    afterEach(async () => {
        await deleteBotList({
            credentials: seamlessEditBotUser,
            botList: [botId],
            projectId: BotToCreate.project.id,
        });
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    /**
     * 1. bot in library
     * 2. run existing active bot from library home -> edit -> do change in config (bot name) -> save -> close -> go back to consumption mode
     *    -> edit > do change(disable bot) -> save -> close -> go back to consumption mode
     * 3. check bot name and active status in edit mode and consumption mode
     */
    it('[TC92072_01] Validate seamless edit during save process for bot in library', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await since('Add to library banner present state should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        // check default values in consumption mode
        await since('Bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.defaultName);
        await since('chat panel title bar bot name should be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toBe(BotToTest.defaultName);
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        // check default values in edit mode
        await since('Bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.defaultName);
        await since('Default Bot name should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(BotToTest.defaultName);
        await since('chat panel title bar bot name should be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toBe(BotToTest.defaultName);
        // modify bot settings
        await botAuthoring.generalSettings.updateBotName(BotToTest.modifiedName);
        // check bot name changed in authoring mode
        await since('Bot name should update to #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.generalSettings.getBotNameInput().getValue())
            .toBe(BotToTest.modifiedName);
        await since('Bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.modifiedName);
        await since('chat panel title bar bot name should be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toBe(BotToTest.modifiedName);
        await botAuthoring.saveBot({});
        // add wait to avoid DE281708
        await libraryPage.sleep(3000);
        await botAuthoring.clickCloseButton();
        // check bot name changed in consumption mode
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Add to library banner present state should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await since('Bot name in welcome message should be #{expected}, instead we have #{actual}.')
            .expect(await botAuthoring.aibotChatPanel.getWelcomePageMessageTexts())
            .toContain(BotToTest.modifiedName);
        await since('chat panel title bar bot name should be #{expected}, instead we have #{actual}.')
            .expect(await aibotChatPanel.getTitleBarBotNameTexts())
            .toBe(BotToTest.modifiedName);
        // go to edit mode again
        await libraryAuthoringPage.waitForElementClickable(libraryAuthoringPage.getEditBtnOnLibraryToolbar());
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.deactiveBot();
        await botAuthoring.saveBot({});
        await botAuthoring.waitForElementVisible(botAuthoring.getInActiveBanner());
        await since('Changed value of active status should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.generalSettings.isActiveBotSwitchOn())
            .toBe(false);
        await since('Inactive banner present state should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.isInActiveBannerDisplayed())
            .toBe(true);
        await botAuthoring.clickCloseButton();
        // check in consumption mode
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Inactive msg dialog present state should be #{expected}, instead we have #{actual}')
            .expect(await botConsumptionFrame.isInactiveMsgDisplayed())
            .toBe(true);
        await since('Add to library banner present state should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await botConsumptionFrame.clickCloseButtonInMessageBox();
        // re-open bot
        await libraryPage.openBotById({
            projectId: BotToCreate.project.id,
            botId: botId,
            handleError: false,
        });
        await takeScreenshotByElement(
            botConsumptionFrame.getMessageBox(),
            'TC92072_01_01',
            'Inactive message box after reopen bot'
        );
        await botConsumptionFrame.clickCloseButtonInMessageBox();
    });

    /**
     * 1. bot in library
     * 2. run existing active bot from library home -> edit -> do change in config (disable snapshot)-> cancel → save (uncheck certify) -> go back to consumption mode
     */
    it('[TC92072_02] Validate seamless edit during cancel and save process for bot in library', async () => {
        await libraryPage.openDossier(BotToCreate.data.name);
        // await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.openSnapshot();
        await since('snapshot panel should not be closed, instead we have #{actual}')
            .expect(await aibotChatPanel.isSnapshotPanelClosed())
            .toBe(false);
        // go to edit mode
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        // check snapshot panel is opened in edit mode
        await since('snapshot panel should not be closed, instead we have #{actual}')
            .expect(await aibotChatPanel.isSnapshotPanelClosed())
            .toBe(false);
        //disable snapshot
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.turnOffAllowSnapshot();
        // check snapshot panel is closed in edit mode
        await since('Allow bot snapshot switch should be off, instead we have on.')
            .expect(await botAuthoring.generalSettings.isAllowSnapshotSwitchOn())
            .toBe(false);
        await since('Snapshot panel should not display in chat panel, instead it does show.')
            .expect(await botAuthoring.aibotChatPanel.getSnapshotPanelContainer().isDisplayed())
            .toBe(false);
        // cancel edit
        await botAuthoring.clickCloseButton();
        // check certify box in warning dialog
        await botAuthoring.waitForElementVisible(botAuthoring.getConfirmWarningDialog());
        await warningDialog.confirmSave();
        // check snapshot and certify icon in consumption mode
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Snapshot panel should not display in comsumption, instead it does show.')
            .expect(await aibotChatPanel.getSnapshotPanelContainer().isDisplayed())
            .toBe(false);
        await aibotChatPanel.goToLibrary();
    });

    /**
     * 1. bot in library
     * 2. run existing active bot from library home -> edit -> do change in config (disable snapshot)-> cancel → save (check certify) -> go back to consumption mode
     */
    it('[TC92072_03] Validate seamless edit during cancel, save and certify process for bot in library', async () => {
        await libraryPage.openDossier(BotToCreate.data.name);
        // await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.openSnapshot();
        await since('snapshot panel should not be closed, instead we have #{actual}')
            .expect(await aibotChatPanel.isSnapshotPanelClosed())
            .toBe(false);
        // go to edit mode
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        // check snapshot panel is opened in edit mode
        await since('snapshot panel should not be closed, instead we have #{actual}')
            .expect(await aibotChatPanel.isSnapshotPanelClosed())
            .toBe(false);
        //disable snapshot
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.turnOffAllowSnapshot();
        // check snapshot panel is closed in edit mode
        await since('Allow bot snapshot switch should be off, instead we have on.')
            .expect(await botAuthoring.generalSettings.isAllowSnapshotSwitchOn())
            .toBe(false);
        await since('Snapshot panel should not display in chat panel, instead it does show.')
            .expect(await botAuthoring.aibotChatPanel.getSnapshotPanelContainer().isDisplayed())
            .toBe(false);
        // cancel edit
        await botAuthoring.clickCloseButton();
        // check certify box in warning dialog
        await botAuthoring.waitForElementVisible(botAuthoring.getConfirmWarningDialog());
        await warningDialog.checkCertifyCheckbox();
        await warningDialog.confirmSave();
        // check snapshot and certify icon in consumption mode
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since('Snapshot panel should not display in comsumption, instead it does show.')
            .expect(await aibotChatPanel.getSnapshotPanelContainer().isDisplayed())
            .toBe(false);
        await botAuthoring.waitForElementVisible(botAuthoring.getCertifyIcon());
        await since('certify icon should be displayed, instead we have #{actual}')
            .expect(await botAuthoring.isBotCertified())
            .toBe(true);
        await aibotChatPanel.goToLibrary();
    });

    /**
     * 1. bot with chat and snapshot
     * 2. run existing active bot from library home -> edit -> do change in config (bot name) -> save -> close -> go back to consumption mode
     * 3. check bot name, chat history and snapshot panel in edit mode and consumption mode
     */
    it('[TC92072_04] Validate seamless edit during save process for bot with chat and snapshot', async () => {
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.openSnapshot();
        // add chat history
        await botAuthoring.aibotChatPanel.askQuestion('Show me all data source, show in grid');
        await aibotChatPanel.waitForAnswerLoading();
        //Add the answer to snapshot
        await aibotChatPanel.hoverChatAnswertoAddSnapshotbyIndex(0);
        await aibotChatPanel.waitForElementAppearAndGone(aibotChatPanel.getSnapshotAddedSuccessToast());
        await takeScreenshotByElement(
            botConsumptionFrame.getBotConsumptionToolbar(),
            'TC92072_04_01',
            'bot consumption mode toolbar'
        );
        await takeScreenshotByElement(aibotChatPanel.getTitleBar(), 'TC92072_04_02', 'bot consumption mode title bar');
        await since('Number of answers in chat bot is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getChatAnswerNumber())
            .toEqual(1);
        await since('Number of snapshots in chat bot is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.numberOfSnapshotsInChatbot())
            .toEqual(1);
        //go to edit mode
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getRecommendationByIndex(2));
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            botConsumptionFrame.getBotConsumptionToolbar(),
            'TC92072_04_03',
            'bot edit mode toolbar'
        );
        await since('Number of answers in chat bot is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getChatAnswerNumber())
            .toEqual(1);
        await since('Number of snapshots in chat bot is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.numberOfSnapshotsInChatbot())
            .toEqual(1);
        // modify bot settings
        await botAuthoring.generalSettings.updateBotName(BotToTest.modifiedName);
        // check bot name changed in authoring mode
        await takeScreenshotByElement(
            aibotChatPanel.getTitleBar(),
            'TC92072_04_04',
            'bot name changed in title bar in edit mode'
        );
        await botAuthoring.saveBot({});
        // add wait to avoid DE281708
        await libraryPage.sleep(3000);
        await botAuthoring.clickCloseButton();
        // check bot name changed in consumption mode
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await takeScreenshotByElement(
            botConsumptionFrame.getBotConsumptionToolbar(),
            'TC92072_04_05',
            'bot toolbar back to consumption mode'
        );
        await takeScreenshotByElement(
            aibotChatPanel.getTitleBar(),
            'TC92072_04_06',
            'bot name changed in title bar in consumption mode'
        );
        await since('Number of answers in chat bot is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getChatAnswerNumber())
            .toEqual(1);
        await since('Number of snapshots in chat bot is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.numberOfSnapshotsInChatbot())
            .toEqual(1);
        // go back to library
        await aibotChatPanel.goToLibrary();
        // re-open bot
        await libraryPage.openBotById({ projectId: BotToCreate.project.id, botId: botId });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await aibotChatPanel.openSnapshot();
        await takeScreenshotByElement(
            botConsumptionFrame.getBotConsumptionToolbar(),
            'TC92072_04_07',
            'reopen bot toolbar check'
        );
        await takeScreenshotByElement(aibotChatPanel.getTitleBar(), 'TC92072_04_08', 'reopen bot title bar check');
        await since('Number of answers in chat bot is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.getChatAnswerNumber())
            .toEqual(1);
        await since('Number of snapshots in chat bot is expected to be #{expected}, instead we have #{actual}')
            .expect(await aibotChatPanel.numberOfSnapshotsInChatbot())
            .toEqual(1);
        await aibotChatPanel.goToLibrary();
    });
});
