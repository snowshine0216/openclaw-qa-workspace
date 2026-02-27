import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import editCustomApp from '../../../api/customApp/editCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import { browserWindow, mobileWindow } from '../../../constants/index.js';
import { takeScreenshotByElement, takeScreenshot } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { getBotObjectToCreate, getBotObjectToEdit } from '../../../constants/bot.js';
import { createBotByAPI, editBotAPI, deleteBotList } from '../../../api/bot/index.js';
import {
    botAsHomeTestUser,
    bydBotAsHomeCustomAppObj,
    bydBotAsHomeDisableToolbar,
    bydBotAsHomeCollapseToolbar,
    bydBotAsHomeDisableShareEntry,
    bydBotAsHomeDisableEditBotAndAccount,
    DossierAsHomeCustomAppObj,
    getBotAsHomeCustomAppObjByBotId,
} from '../../../constants/customApp/info.js';

describe('Bot as Home Tests', () => {
    const testCredentials = botAsHomeTestUser.credentials;
    let { libraryPage, dossierPage, loginPage } = browsers.pageObj1;
    let customAppIdOfBotAsHome;
    let customAppIdOfDossierAsHome;
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
        customAppIdOfDossierAsHome &&
            (await deleteCustomAppList({
                credentials: testCredentials,
                customAppIdList: [customAppIdOfDossierAsHome],
            }));
        customAppIdOfDossierAsHome = null;
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

    it('[TC92799_01] bot as home rendering by default component setting', async () => {
        const botName = 'TC92799_01 Home Bot';
        const botObjToCreate = getBotObjectToCreate({ botName });
        botId = await createBotByAPI({ credentials: testCredentials, botInfo: botObjToCreate });
        const customAppObj = getBotAsHomeCustomAppObjByBotId({ botId: botId });
        customAppIdOfBotAsHome = await createCustomApp({
            credentials: testCredentials,
            customAppInfo: customAppObj,
        });
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome });
        await dossierPage.waitForDossierLoading();
        await since('Bot toolbar should display when bot as home, instead it does not shown')
            .expect(await dossierPage.isNavigationBarPresent())
            .toBe(true);
        await takeScreenshotByElement(
            await dossierPage.getNavigationBar(),
            'TC92799_01',
            'Bot Toolbar by default component setting'
        );
    });

    it('[TC92799_02] bot as home disable toolbar', async () => {
        customAppIdOfBotAsHome = await createCustomApp({
            credentials: testCredentials,
            customAppInfo: bydBotAsHomeDisableToolbar,
        });
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome });
        await dossierPage.waitForDossierLoading();
        await since('Bot toolbar should NOT display on custom app disable toolbar, instead it is shown')
            .expect(await dossierPage.isNavigationBarPresent())
            .toBe(false);
        await takeScreenshot('TC92799_02', 'Bot as home disable toolbar');
    });

    it('[TC92799_03] bot as home collapse toolbar', async () => {
        customAppIdOfBotAsHome = await createCustomApp({
            credentials: testCredentials,
            customAppInfo: bydBotAsHomeCollapseToolbar,
        });
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome });
        await dossierPage.waitForDossierLoading();
        await dossierPage.expandCollapsedNavBar();
        await takeScreenshotByElement(await dossierPage.getNavigationBar(), 'TC92799_03', 'Collapse Toolbar');
        await takeScreenshot('TC92799_03', 'Bot as home collapse toolbar');
    });

    it('[TC92799_04] bot as home toolbar action button control', async () => {
        customAppIdOfBotAsHome = await createCustomApp({
            credentials: testCredentials,
            customAppInfo: bydBotAsHomeCustomAppObj,
        });
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome });
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(
            await dossierPage.getNavigationBar(),
            'TC92799_04_01',
            'Bot as Home by default toolbar setting'
        );
        await editCustomApp({
            credentials: testCredentials,
            id: customAppIdOfBotAsHome,
            homeScreen: bydBotAsHomeDisableShareEntry.homeScreen,
        });
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome });
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(
            await dossierPage.getNavigationBar(),
            'TC92799_04_02',
            'Bot as Home Toolbar disable share entry'
        );
        await editCustomApp({
            credentials: testCredentials,
            id: customAppIdOfBotAsHome,
            homeScreen: bydBotAsHomeDisableEditBotAndAccount.homeScreen,
        });
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome });
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(
            await dossierPage.getNavigationBar(),
            'TC92799_04_03',
            'Bot as Home by disable edit and account'
        );
    });

    it('[TC92799_05] switch app among different home modes', async () => {
        customAppIdOfBotAsHome = await createCustomApp({
            credentials: testCredentials,
            customAppInfo: bydBotAsHomeCustomAppObj,
        });
        customAppIdOfDossierAsHome = await createCustomApp({
            credentials: testCredentials,
            customAppInfo: DossierAsHomeCustomAppObj,
        });
        await libraryPage.openDefaultApp();
        await takeScreenshotByElement(
            libraryPage.getNavigationBar(),
            'TC92799_05_01',
            'Library toolbar of default app'
        );
        await libraryPage.openCustomAppById({ id: customAppIdOfDossierAsHome });
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(
            await dossierPage.getNavigationBar(),
            'TC92799_05_02',
            'Toolbar of Dossier as Home'
        );
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome });
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(await dossierPage.getNavigationBar(), 'TC92799_05_03', 'Toolbar of Bot as Home');
    });

    it('[TC92799_06] Responsive view of bot as home', async () => {
        customAppIdOfBotAsHome = await createCustomApp({
            credentials: testCredentials,
            customAppInfo: bydBotAsHomeCustomAppObj,
        });
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome });
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC92799_06_01', 'Bot as home web view');
        await setWindowSize(mobileWindow);
        await takeScreenshot('TC92799_06_02', 'Bot as home mobile view');
        await dossierPage.clickHamburgerMenu();
        await since(
            'isDisplay() of notifications option in bot as home responsive view of side menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Notifications').isDisplayed())
            .toBe(false);
        await since(
            'isDisplay() of share option in responsive view of side menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Share').isDisplayed())
            .toBe(true);
        await since(
            'isDisplay() of account option in responsive view of side menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.hamburgerMenu.getOption('Account').isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC92799_06_03',
            'Hide notification and edit bot in hamberger menu'
        );
    });

    it('[TC92799_07] Home bot with snapshot panel on and off', async () => {
        const botName = 'TC92799_07 Home Bot';
        const botObjToCreate = getBotObjectToCreate({ botName });
        botId = await createBotByAPI({ credentials: testCredentials, botInfo: botObjToCreate });
        const botObjToEdit = getBotObjectToEdit({ id: botId, botName, enableSnapshot: false });
        await editBotAPI({ credentials: testCredentials, botInfo: botObjToEdit });
        const customAppObj = getBotAsHomeCustomAppObjByBotId({ botId: botId });
        customAppIdOfBotAsHome = await createCustomApp({
            credentials: testCredentials,
            customAppInfo: customAppObj,
        });
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome });
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC92799_07_01', 'Home bot turn off snapshot in web view');
        await setWindowSize(mobileWindow);
        await takeScreenshot('TC92799_07_02', 'Home bot turn off snapshot in responsive view');
        botObjToEdit.configuration.general.features.saving_to_snapshots = true;
        await editBotAPI({ credentials: testCredentials, botInfo: botObjToEdit });
        await setWindowSize(browserWindow);
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome, dossier: true });
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC92799_07_03', 'Home bot turn on snapshot in web view');
        await setWindowSize(mobileWindow);
        await takeScreenshot('TC92799_07_04', 'Home bot turn on snapshot in responsive view');
    });
});
