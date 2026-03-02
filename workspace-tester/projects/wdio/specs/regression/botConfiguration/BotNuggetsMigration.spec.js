import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import createSessionAPI from '../../../api/server/createSessionAPI.js';
import { parseiServerRestHost } from '../../../api/urlParser.js';
import { getNuggetObjectInfo } from '../../../constants/nugget.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import {
    nuggetTestUser,
    botSettings,
    getPublishInfo,
    getBotObjectToEdit,
    nuggetsUIStringLabels,
} from '../../../constants/bot.js';
import {
    createBotByAPI,
    publishBotByAPI,
    deleteBotList,
    createNuggetsBulkAPI,
    deleteNuggetsBulkAPI,
    getNuggetsRestAPI,
} from '../../../api/bot/index.js';

describe('AI Bot Nuggets Migration', () => {
    let { loginPage, libraryPage, botAuthoring } = browsers.pageObj1;
    let botId, sessionID, publishInfo, nuggetsToDelete;
    const botIdsToDelete = [];
    const botName = 'TC93239 Test Bot RAG';
    const BotToCreate = getBotObjectToEdit({ botName, enableSnapshot: false, active: false });
    const nuggetInfoObj = getNuggetObjectInfo({ nuggetName: 'fake nugget' });
    const iServerRest = parseiServerRestHost(browser.options.baseUrl);
    const basicInfo = {
        data: {
            login: nuggetTestUser.username,
            password: nuggetTestUser.password,
            applicationType: 35,
            projectId: BotToCreate.project.id,
        },
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
        await loginPage.login(nuggetTestUser);
        sessionID = await createSessionAPI({ iServerRest, basicInfo });
        nuggetsToDelete = await createNuggetsBulkAPI({ iServerRest, sessionID, data: nuggetInfoObj });
    });

    beforeEach(async () => {
        const nuggetIds = nuggetsToDelete.map((nugget) => {
            return { id: nugget.did };
        });
        const { id } = nuggetIds.shift();
        await getNuggetsRestAPI({ id }).catch(async () => {
            nuggetsToDelete = await createNuggetsBulkAPI({ iServerRest, sessionID, data: nuggetInfoObj });
        });
        BotToCreate.nuggets = {
            nuggets: nuggetsToDelete.map((nugget) => {
                return { id: nugget.did };
            }),
        };
        botId = await createBotByAPI({ credentials: nuggetTestUser, botInfo: BotToCreate });
        botIdsToDelete.push(botId);
        publishInfo = getPublishInfo({
            botId,
            projectId: BotToCreate.project.id,
            recipients: [{ id: nuggetTestUser.id }],
        });
        await publishBotByAPI({
            credentials: nuggetTestUser,
            publishInfo: publishInfo,
        });
        await libraryPage.openDefaultApp();
    });

    afterEach(async () => {
        await deleteBotList({
            credentials: nuggetTestUser,
            botList: [...botIdsToDelete],
            projectId: BotToCreate.project.id,
        });
        botIdsToDelete.length = 0;
    });

    afterAll(async () => {
        await deleteNuggetsBulkAPI({ iServerRest, sessionID, nuggets: nuggetsToDelete });
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    //TC93239: AIBot | verify migrate bot
    it('[TC93239_01] Toggle active in info window by missing nuggets', async () => {
        await libraryPage.openDossierInfoWindow(botName);
        await since('Bot active toggle in info window should be off, instead we have on.')
            .expect(await libraryPage.infoWindow.isActiveToggleButtonOn())
            .toBe(false);
        await libraryPage.infoWindow.click({
            elem: libraryPage.infoWindow.getActiveToggleButton(),
            checkClickable: false,
        });
        await libraryPage.waitForElementVisible(libraryPage.missingNuggetsDialog.getNuggetsNotificationDialog());
        await since('Nuggets missing dialog should show, instead it does not show.')
            .expect(await libraryPage.missingNuggetsDialog.getNuggetsNotificationDialog().isDisplayed())
            .toBe(true);
        await since('Bot active toggle in info window should be off, instead we have on.')
            .expect(await libraryPage.infoWindow.isActiveToggleButtonOn())
            .toBe(false);
        await libraryPage.missingNuggetsDialog.clickReuploadButtonOnNuggetsMissingDialog();
        await botAuthoring.sleep(3000);
        await botAuthoring.waitForCurtainDisappear();
        await botAuthoring.waitForElementVisible(botAuthoring.getInActiveBanner());
        await since('Missing nuggets banner should display, instead it does not show.')
            .expect(await botAuthoring.getInActiveBanner().isDisplayed())
            .toBe(true);
        await since('Message in missing nuggets banner should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.getInActiveBanner().getText())
            .toBe(nuggetsUIStringLabels.missingNuggetBannerMessage);
        await botAuthoring.waitForElementVisible(botAuthoring.getBotConfigContainer());
        await takeScreenshotByElement(
            botAuthoring.getBotConfigContainer(),
            'TC93239_01',
            'Auto scroll to knowlege after clicking reupload'
        );
    });

    it('[TC93239_02] Edit bot from info window when missing nuggets', async () => {
        await libraryPage.openDossierInfoWindow(botName);
        await libraryPage.infoWindow.clickEditButton();
        await botAuthoring.waitForCurtainDisappear();
        await botAuthoring.waitForElementVisible(botAuthoring.getInActiveBanner());
        await since('Missing nuggets banner should display, instead it does not show.')
            .expect(await botAuthoring.getInActiveBanner().isDisplayed())
            .toBe(true);
        await since('Message in missing nuggets banner should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.getInActiveBanner().getText())
            .toBe(nuggetsUIStringLabels.missingNuggetBannerMessage);
        await botAuthoring.waitForElementVisible(botAuthoring.getBotConfigContainer());
        await botAuthoring.custommizationPanel.waitForNuggetsItemsLoaded();
        await takeScreenshotByElement(
            botAuthoring.getBotConfigContainer(),
            'TC93239_02',
            'Auto scroll to knowlege under customizations tab after edit from info window'
        );
    });

    it('[TC93239_03] Edit bot from Library home when missing nuggets', async () => {
        await libraryPage.openDossierContextMenu(botName);
        await libraryPage.clickDossierContextMenuItem('Edit');
        await botAuthoring.waitForCurtainDisappear();
        await botAuthoring.waitForElementVisible(botAuthoring.getInActiveBanner());
        await since('Missing nuggets banner should display, instead it does not show.')
            .expect(await botAuthoring.getInActiveBanner().isDisplayed())
            .toBe(true);
        await since('Message in missing nuggets banner should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.getInActiveBanner().getText())
            .toBe(nuggetsUIStringLabels.missingNuggetBannerMessage);
        await botAuthoring.waitForElementVisible(botAuthoring.getBotConfigContainer());
        await botAuthoring.custommizationPanel.waitForNuggetsItemsLoaded();
        await takeScreenshotByElement(
            botAuthoring.getBotConfigContainer(),
            'TC93239_03',
            'Auto scroll to knowlege under customizations tab after edit from context menu'
        );
    });

    it('[TC93239_04] Inactive toggle should be disabled when edit bot missing nuggets', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Bot active switch should be off, instead we have on.')
            .expect(await botAuthoring.generalSettings.getActiveToggle().isEnabled())
            .toBe(false);
        await botAuthoring.generalSettings.hoverOnActiveToggleButton();
        await since(
            'Tooltip of active toggle button in missing nuggets banner should be #{expected}, instead we have #{actual}'
        )
            .expect(await botAuthoring.generalSettings.getTooltipDisplayedText())
            .toBe(nuggetsUIStringLabels.activeToggleTooltipText);
    });

    it('[TC93239_05] Warning indicators under customization tab when missing nuggets', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.waitForElementVisible(botAuthoring.getInActiveBanner());
        await since('Missing nuggets banner should display, instead it does not show.')
            .expect(await botAuthoring.getInActiveBanner().isDisplayed())
            .toBe(true);
        await since('Message in missing nuggets banner should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.getInActiveBanner().getText())
            .toBe(nuggetsUIStringLabels.missingNuggetBannerMessage);
        await botAuthoring.waitForElementVisible(botAuthoring.getBotConfigContainer());
        await botAuthoring.custommizationPanel.waitForNuggetsItemsLoaded();
        await botAuthoring.custommizationPanel.hoverOnMissingFileWarningIcon();
        await since('Tooltip of missing file warning icon should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.custommizationPanel.getTooltipFullText())
            .toBe(nuggetsUIStringLabels.missingNuggetTooltipText);
        await takeScreenshotByElement(
            botAuthoring.getBotConfigContainer(),
            'TC93239_05',
            'Tooltip of missing file warning icon'
        );
    });

    it('[TC93239_06] Save as bot missing nuggets', async () => {
        const objectName = 'TC93239_06 Save as bot missing nuggets';
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.waitForElementVisible(botAuthoring.getBotConfigContainer());
        await botAuthoring.custommizationPanel.waitForNuggetsItemsLoaded();
        await botAuthoring.saveAsBot({ name: objectName });
        const createdBotId = await botAuthoring.getBotIdFromUrl();
        botIdsToDelete.push(createdBotId);
        await since('Missing nuggets banner should display, instead it does not show.')
            .expect(await botAuthoring.getInActiveBanner().isDisplayed())
            .toBe(true);
        await since('Message in missing nuggets banner should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.getInActiveBanner().getText())
            .toBe(nuggetsUIStringLabels.missingNuggetBannerMessage);
        await botAuthoring.waitForElementVisible(botAuthoring.getBotConfigContainer());
        await botAuthoring.custommizationPanel.waitForNuggetsItemsLoaded();
        await takeScreenshotByElement(
            botAuthoring.getBotConfigContainer(),
            'TC93239_06_01',
            'Customization tab after save as bot missing nuggets'
        );
        await botAuthoring.custommizationPanel.hoverOnMissingFileWarningIcon();
        await since('Tooltip of missing file warning icon should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.custommizationPanel.getTooltipFullText())
            .toBe(nuggetsUIStringLabels.missingNuggetTooltipText);
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Bot active switch should be off, instead we have on.')
            .expect(await botAuthoring.generalSettings.getActiveToggle().isEnabled())
            .toBe(false);
        await botAuthoring.generalSettings.hoverOnActiveToggleButton();
        await since(
            'Tooltip of active toggle button in missing nuggets banner should be #{expected}, instead we have #{actual}'
        )
            .expect(await botAuthoring.generalSettings.getTooltipDisplayedText())
            .toBe(nuggetsUIStringLabels.activeToggleTooltipText);
    });

    it('[TC93239_07] Remove file to fix missing nuggets', async () => {
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.waitForElementVisible(botAuthoring.getInActiveBanner());
        await botAuthoring.waitForElementVisible(botAuthoring.getBotConfigContainer());
        await since('Missing nuggets banner should display, instead it does not show.')
            .expect(await botAuthoring.getInActiveBanner().isDisplayed())
            .toBe(true);
        await botAuthoring.custommizationPanel.waitForNuggetsItemsLoaded();
        await botAuthoring.custommizationPanel.deleteNuggetItem();
        await takeScreenshotByElement(
            botAuthoring.getBotConfigContainer(),
            'TC93239_07',
            'Tooltip of missing file warning icon'
        );
        await botAuthoring.saveBot({});
        await since('Bot banner message should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.getInActiveBanner().getText())
            .toBe(botSettings.inactiveBotBannerMessage);
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Bot active switch should be off, instead we have on.')
            .expect(await botAuthoring.generalSettings.getActiveToggle().isEnabled())
            .toBe(true);
        await since('Active toggle should be off, instead we have on')
            .expect(await botAuthoring.generalSettings.isActiveBotSwitchOn())
            .toBe(false);
    });

    it('[TC93239_08] Re-upload file to fix missing nuggets', async () => {
        const fileName = 'test_nugget.xlsx';
        await libraryPage.editBotByUrl({ projectId: BotToCreate.project.id, botId });
        await botAuthoring.waitForElementVisible(botAuthoring.getInActiveBanner());
        await botAuthoring.waitForElementVisible(botAuthoring.getBotConfigContainer());
        await since('Missing nuggets banner should display, instead it does not show.')
            .expect(await botAuthoring.getInActiveBanner().isDisplayed())
            .toBe(true);
        await botAuthoring.custommizationPanel.waitForNuggetsItemsLoaded();
        await botAuthoring.custommizationPanel.reuploadNuggetsFile(fileName);
        await botAuthoring.custommizationPanel.waitForNuggetsItemsLoaded();
        await botAuthoring.custommizationPanel.fakeNuggetNameInUI();
        await takeScreenshotByElement(botAuthoring.getBotConfigContainer(), 'TC93239_08_01', 'Re-upload file');
        await botAuthoring.saveBot({});
        await botAuthoring.waitForElementVisible(botAuthoring.getBotConfigContainer());
        await botAuthoring.custommizationPanel.waitForNuggetsItemsLoaded();
        await since('Bot banner message should be #{expected}, instead we have #{actual}')
            .expect(await botAuthoring.getInActiveBanner().getText())
            .toBe(botSettings.inactiveBotBannerMessage);
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Bot active switch should be off, instead we have on.')
            .expect(await botAuthoring.generalSettings.getActiveToggle().isEnabled())
            .toBe(true);
        await since('Active toggle should be off, instead we have on')
            .expect(await botAuthoring.generalSettings.isActiveBotSwitchOn())
            .toBe(false);
    });
});
