import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import { botSeamlessEditMultiDatasetUser } from '../../../constants/bot.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import { getBotAsHomeCustomAppObjByBotId } from '../../../constants/customApp/info.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteBotList } from '../../../api/bot/index.js';

describe('AI Bot Seamless Edit On Multiple Datasets', () => {
    const project = {
        id: '61ABA574CA453CCCF398879AFE2E825F',
        name: 'Platform Analytics',
    };

    const BotOnReports = {
        id: 'D9BCA841664555C43E1F0198A082A809',
        name: 'bot on reports',
    };

    const BotOnPromptReportsInLibrary = {
        id: '833DB76C7C46611772D829A72821359B',
        name: 'bot on prompt reports in library',
    };

    const BotOnPromptReportsNotInLibrary = {
        id: '68036846CD4D5E7AD27AE6A16C24CAB9',
        name: 'bot on prompt reports not in library',
    };

    const datasets = {
        promptReport: 'bot_prompt_report',
        normalReport1: 'bot_report1',
        normalReport2: 'bot_report2',
    };

    let {
        loginPage,
        libraryPage,
        libraryAuthoringPage,
        botAuthoring,
        aibotChatPanel,
        aibotDatasetPanel,
        botConsumptionFrame,
        dossierAuthoringPage,
    } = browsers.pageObj1;

    const appIdsToDelete = [];
    const botIdsToDelete = [];

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(botSeamlessEditMultiDatasetUser);
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterEach(async () => {
        await deleteCustomAppList({
            credentials: botSeamlessEditMultiDatasetUser,
            customAppIdList: appIdsToDelete,
        });
        appIdsToDelete.length = 0;
        await deleteBotList({
            credentials: botSeamlessEditMultiDatasetUser,
            botList: [...botIdsToDelete],
            projectId: project.id,
        });
        botIdsToDelete.length = 0;
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    /**
     * 1. create bot on report and prompt report
     * 2. create the bot as home custom app
     * 3. edit home bot
     * 3. remove prompt dataset and save
     * 4. exit from edit mode
     * 5. edit home bot
     * 6. add new prompt dataset and save
     */
    it('[TC95442_01] Execute Bot with Dataset with prompt from library', async () => {
        await libraryPage.openBotById({
            projectId: project.id,
            botId: BotOnPromptReportsInLibrary.id,
            handleError: false,
            useDefaultApp: true,
        });
        await botConsumptionFrame.waitForElementVisible(botConsumptionFrame.getAccountIconInToolbar());
        await botConsumptionFrame.waitForElementVisible(botConsumptionFrame.getMessageBox());
        await botConsumptionFrame.waitForElementClickable(botConsumptionFrame.getShowDetailsButton());
        await botConsumptionFrame.showDetail();
        await takeScreenshotByElement(
            botConsumptionFrame.getMessageBox(),
            'TC95442_01_01',
            'Bot has unsupported prompt error, bot in library'
        );
        await botConsumptionFrame.clickOkButtonInNeedPermissionMessageBox();

        // open bot on prompt dataset, bot is not in library
        await libraryPage.openBotById({
            projectId: project.id,
            botId: BotOnPromptReportsNotInLibrary.id,
            handleError: false,
            useDefaultApp: true,
        });
        await botConsumptionFrame.waitForElementVisible(botConsumptionFrame.getAccountIconInToolbar());
        await botConsumptionFrame.waitForElementClickable(botConsumptionFrame.getShowDetailsButton());
        await botConsumptionFrame.showDetail();
        await takeScreenshotByElement(
            botConsumptionFrame.getMessageBox(),
            'TC95442_01_02',
            'Bot has unsupported prompt error, bot not in library'
        );
        await botConsumptionFrame.clickOkButtonInNeedPermissionMessageBox();
    });

    /**
     * 1. create the bot as home custom app
     * 2. check error dialog, click OK on error dialog
     * 3. edit home bot
     * 4. enter advanced mode
     * 5. click apply exit from advanced mode
     * 6. replace prompt dataset to normal report
     * 7. save bot, exit from edit mode to home bot
     * 8. check no error dilaog
     */
    it('[TC95444_01] Execute Home Bot with prompt report, edit bot, remove prompt dataset and save, exit from edit mode', async () => {
        //create bot with prompt report dataset
        await libraryAuthoringPage.createBotWithReports({
            project: project.name,
            reports: [datasets.promptReport, datasets.normalReport1],
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getChatPanelTopics());
        await botAuthoring.clickSaveButton();
        await botAuthoring.saveBotBySaveDialog({ name: 'prompt home bot' });
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        const createdBotId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(createdBotId);

        //create bot as home app
        const customAppObj = getBotAsHomeCustomAppObjByBotId({
            projectId: project.id,
            botId: createdBotId,
        });
        const customAppIdOfBotAsHome = await createCustomApp({
            credentials: botSeamlessEditMultiDatasetUser,
            customAppInfo: customAppObj,
        });
        appIdsToDelete.push(customAppIdOfBotAsHome);

        //open bot as home custom app, check error dialog
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome });
        await botConsumptionFrame.waitForElementVisible(botConsumptionFrame.getMessageBox());
        await botConsumptionFrame.waitForElementClickable(botConsumptionFrame.getShowDetailsButton());
        await botConsumptionFrame.showDetail();
        await takeScreenshotByElement(
            botConsumptionFrame.getMessageBox(),
            'TC95444_01',
            'Bot error dialog in consumption'
        );
        await botConsumptionFrame.clickOkButtonInNeedPermissionMessageBox();

        //enter edit mode
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());

        //open dataset panel
        await botAuthoring.selectBotConfigTabByName('Data');
        await libraryAuthoringPage.waitForCurtainDisappear();

        //check advanced button is disabled
        await since('Advanced button enable status should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isAdvancedButtonEnabled())
            .toBe(false);

        //replace prompt dataset to normal report
        await aibotDatasetPanel.clickOneDatasetManipuButton(datasets.promptReport, 'Replace Dataset');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickDatasetTypeInDatasetPanel('Report');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.searchInReplaceDialog(datasets.normalReport2);
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickOnDatasetInSearch(datasets.normalReport2);
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickReplacePageButton('Replace');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(datasets.normalReport2);

        //switch to advanced mode
        await aibotDatasetPanel.waitForElementClickable(aibotDatasetPanel.getAdvancedModeButton());
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();

        //click apply in advanced mode and exit from avanced mode to edit mode
        await dossierAuthoringPage.actionOnToolbar('Apply');
        await dossierAuthoringPage.waitForCurtainDisappear();

        //save bot
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getChatPanelTopics());
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        await botAuthoring.saveBot({ skipClosingToast: true, expectSuccess: true });
        await botAuthoring.clickCloseButton();

        // check in consumption mode
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getTitleBarLeft());
        await since(
            'After removed prompt dataset, error dialog exist status should be #{expected}, instead we have #{actual}'
        )
            .expect(await botConsumptionFrame.isErrorPresent())
            .toBe(false);
    });

    /**
     * 1. create the bot as home custom app
     * 2. check no error dialog
     * 3. edit home bot
     * 4. enter advanced mode
     * 5. click apply exit from advanced mode
     * 6. replace noraml dataset to prompt report
     * 7. save bot, exit from edit mode to home bot
     * 8. check error dialog
     */
    it('[TC95444_02] Execute Home bot without prompt report, edit bot, add prompt dataset and save, exit from edit mode', async () => {
        //create bot with normal report dataset
        await libraryAuthoringPage.createBotWithReports({
            project: project.name,
            reports: [datasets.normalReport1, datasets.normalReport2],
        });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getChatPanelTopics());
        await botAuthoring.clickSaveButton();
        await botAuthoring.saveBotBySaveDialog({ name: 'normal home bot' });
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        const createdBotId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(createdBotId);

        //Create bot as home app
        const customAppObj = getBotAsHomeCustomAppObjByBotId({
            projectId: project.id,
            botId: createdBotId,
        });
        const customAppIdOfBotAsHome = await createCustomApp({
            credentials: botSeamlessEditMultiDatasetUser,
            customAppInfo: customAppObj,
        });
        appIdsToDelete.push(customAppIdOfBotAsHome);

        //open bot as home custom app, check erro msg
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome });
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getWelcomePage());

        //check error dialog
        await since('error dialog exist status should be #{expected}, instead we have #{actual}')
            .expect(await botConsumptionFrame.isErrorPresent())
            .toBe(false);

        //enter edit mode
        await botConsumptionFrame.clickEditButton();
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());

        //open dataset panel
        await botAuthoring.selectBotConfigTabByName('Data');
        await libraryAuthoringPage.waitForCurtainDisappear();

        //switch to advanced mode
        await aibotDatasetPanel.waitForElementClickable(aibotDatasetPanel.getAdvancedModeButton());
        await aibotDatasetPanel.switchToAdvancedMode();
        await dossierAuthoringPage.waitForCurtainDisappear();

        //click apply in advanced mode and exit from avanced mode to edit mode
        await dossierAuthoringPage.actionOnToolbar('Apply');
        await dossierAuthoringPage.waitForCurtainDisappear();
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getChatPanelTopics());

        //focus on data panel
        await botAuthoring.selectBotConfigTabByName('Data');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await aibotDatasetPanel.waitForElementEnabled(aibotDatasetPanel.getAdvancedModeButton());

        //replace prompt dataset to normal report
        await aibotDatasetPanel.clickOneDatasetManipuButton(datasets.normalReport2, 'Replace Dataset');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickDatasetTypeInDatasetPanel('Report');
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.searchInReplaceDialog(datasets.promptReport);
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickOnDatasetInSearch(datasets.promptReport);
        await aibotDatasetPanel.waitForReplacePageLoading();
        await aibotDatasetPanel.clickReplacePageButton('Replace');
        await libraryAuthoringPage.waitForCurtainDisappear();
        await aibotDatasetPanel.waitForCoverSpinnerDismiss();
        await aibotDatasetPanel.waitForTextAppearInDataSetPanel(datasets.promptReport);

        //check advanced button is disabled
        await since('Advanced button enable status should be #{expected}, instead we have #{actual}')
            .expect(await aibotDatasetPanel.isAdvancedButtonEnabled())
            .toBe(false);

        //save bot
        await aibotChatPanel.waitForElementVisible(aibotChatPanel.getChatPanelTopics());
        await botAuthoring.waitForElementClickable(botAuthoring.getSaveButton());
        await botAuthoring.saveBot({ skipClosingToast: true, expectSuccess: true });
        await botAuthoring.clickCloseButton();

        // check in consumption mode
        await botConsumptionFrame.waitForElementVisible(botConsumptionFrame.getMessageBox());
        await takeScreenshotByElement(
            botConsumptionFrame.getMessageBox(),
            'TC95444_02',
            'Bot error dialog in consumption from edit mode'
        );
        await botConsumptionFrame.clickOkButtonInNeedPermissionMessageBox();
    });
});
