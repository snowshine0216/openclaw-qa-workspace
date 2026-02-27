import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshot } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { botCubeNotPublish, getBotObjectToCreate, getBotObjectToEdit } from '../../../constants/bot.js';
import { createBotByAPI, editBotAPI, deleteBotList } from '../../../api/bot/index.js';
import { botAsHomeTestUser, getBotAsHomeCustomAppObjByBotId } from '../../../constants/customApp/info.js';

describe('Bot as Home Tests Error Handling', () => {
    const testCredentials = botAsHomeTestUser.credentials;
    let { libraryPage, dossierPage, loginPage, botAuthoring, libraryAuthoringPage } = browsers.pageObj1;
    let customAppIdOfBotAsHome;
    let botId;

    beforeAll(async () => {
        await loginPage.login(testCredentials);
    });

    beforeEach(async () => {
        await setWindowSize(browserWindow);
        await libraryPage.openDefaultApp();
    });

    afterEach(async () => {
        customAppIdOfBotAsHome &&
            (await deleteCustomAppList({
                credentials: testCredentials,
                customAppIdList: [customAppIdOfBotAsHome],
            }));
        customAppIdOfBotAsHome = null;
        botId &&
            (await deleteBotList({
                credentials: testCredentials,
                botList: [botId],
            }));
        botId = null;
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[TC93417_01] inactive bot as home', async () => {
        const botName = 'TC93417_01 Home Bot';
        const botObjToCreate = getBotObjectToCreate({ botName });
        botId = await createBotByAPI({ credentials: testCredentials, botInfo: botObjToCreate });
        const customAppObj = getBotAsHomeCustomAppObjByBotId({ botId: botId });
        customAppIdOfBotAsHome = await createCustomApp({
            credentials: testCredentials,
            customAppInfo: customAppObj,
        });
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome });
        await dossierPage.waitForDossierLoading();
        const botObjToEdit = getBotObjectToEdit({ id: botId, botName, active: false });
        await editBotAPI({ credentials: testCredentials, botInfo: botObjToEdit });
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome, dossier: true });
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await takeScreenshot('TC93417_01_01', 'Bot inactive popup');
        await dossierPage.dismissError();
        await takeScreenshot('TC93417_01_02', 'Page not load embed error');
    });

    it('[TC93417_02] edit home bot by toggling active and inactive', async () => {
        const botName = 'TC93417_02 Home Bot';
        const botObjToCreate = getBotObjectToCreate({ botName });
        botId = await createBotByAPI({ credentials: testCredentials, botInfo: botObjToCreate });
        const customAppObj = getBotAsHomeCustomAppObjByBotId({ botId: botId });
        customAppIdOfBotAsHome = await createCustomApp({
            credentials: testCredentials,
            customAppInfo: customAppObj,
        });
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome });
        await dossierPage.waitForDossierLoading();
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await since('Bot active switch should be on, instead we have off.')
            .expect(await botAuthoring.generalSettings.isActiveBotSwitchOn())
            .toBe(true);
        await botAuthoring.generalSettings.deactiveBot();
        await botAuthoring.saveBot({});
        await since('Bot inactive banner should display, instead it does not show.')
            .expect(await botAuthoring.getInActiveBanner().isDisplayed())
            .toBe(true);
        await botAuthoring.exitBotAuthoring();
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await takeScreenshot('TC93417_02_01', 'Bot inactive popup');
        await dossierPage.dismissError();
        await takeScreenshot('TC93417_02_02', 'Page not load embed error');
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await botAuthoring.generalSettings.activeBot();
        await botAuthoring.saveBot({});
        await since('Bot active switch should be on, instead we have off.')
            .expect(await botAuthoring.generalSettings.isActiveBotSwitchOn())
            .toBe(true);
        await botAuthoring.exitBotAuthoring();
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC93417_02_03', 'Home bot active');
    });

    it('[TC93417_03] open invalid home bot', async () => {
        const customAppObj = getBotAsHomeCustomAppObjByBotId({ botId: 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF' });
        customAppIdOfBotAsHome = await createCustomApp({
            credentials: testCredentials,
            customAppInfo: customAppObj,
        });
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome });
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await takeScreenshot('TC93417_03_01', 'Invalid home bot id');
        await dossierPage.dismissError();
        await takeScreenshot('TC93417_03_02', 'Page not load embed error');
    });

    it('[TC93417_04] home bot cube not publish', async () => {
        const customAppObj = getBotAsHomeCustomAppObjByBotId({ botId: botCubeNotPublish.botId });
        customAppIdOfBotAsHome = await createCustomApp({
            credentials: testCredentials,
            customAppInfo: customAppObj,
        });
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome });
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await takeScreenshot('TC93417_04_01', 'cube not publish');
        await dossierPage.dismissError();
        await takeScreenshot('TC93417_04_02', 'Page not load embed error');
    });
});
