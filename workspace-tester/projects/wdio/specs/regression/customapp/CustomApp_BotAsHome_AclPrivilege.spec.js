import setWindowSize from '../../../config/setWindowSize.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import { browserWindow } from '../../../constants/index.js';
import { takeScreenshotByElement, takeScreenshot } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import { aclTestUser, noRunBotTestUser, getBotObjectToCreate } from '../../../constants/bot.js';
import { createBotByAPI, deleteBotList } from '../../../api/bot/index.js';
import {
    botAsHomeTestUser,
    bydBotAsHomeCustomAppObj,
    getBotAsHomeCustomAppObjByBotId,
} from '../../../constants/customApp/info.js';
import setObjectAcl from '../../../api/manageAccess/setObjectAcl.js';
import resetObjectAcl from '../../../api/manageAccess/resetObjectAcl.js';

describe('Bot as Home Tests ACL and Privilege Handling', () => {
    const testCredentials = botAsHomeTestUser.credentials;
    let { libraryPage, dossierPage, loginPage, botAuthoring, libraryAuthoringPage } = browsers.pageObj1;
    let customAppIdOfBotAsHome;
    let botId;

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
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[TC93435_01] no acl for bot as home', async () => {
        const botName = 'TC93435_01 Home Bot';
        const botObjToCreate = getBotObjectToCreate({ botName });
        botId = await createBotByAPI({ credentials: testCredentials, botInfo: botObjToCreate });
        const customAppObj = getBotAsHomeCustomAppObjByBotId({ botId: botId });
        customAppIdOfBotAsHome = await createCustomApp({
            credentials: testCredentials,
            customAppInfo: customAppObj,
        });
        //remove acl for test user
        await setObjectAcl({
            credentials: testCredentials,
            object: { id: botId, name: botName, project: botObjToCreate.project },
            acl: [
                {
                    value: 'Denied All',
                    id: aclTestUser.id,
                    name: aclTestUser.username,
                },
            ],
        });
        await loginPage.login(aclTestUser);
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome, dossier: true });
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await takeScreenshot('TC93435_01_01', 'no acl permission');
        await dossierPage.dismissError();
        await takeScreenshot('TC93435_01_02', 'Page not load embed error');
    });

    it('[TC93435_02] view only acl for bot as home', async () => {
        const botName = 'TC93435_02 Home Bot';
        const botObjToCreate = getBotObjectToCreate({ botName });
        botId = await createBotByAPI({ credentials: testCredentials, botInfo: botObjToCreate });
        const customAppObj = getBotAsHomeCustomAppObjByBotId({ botId: botId });
        customAppIdOfBotAsHome = await createCustomApp({
            credentials: testCredentials,
            customAppInfo: customAppObj,
        });
        await resetObjectAcl({
            credentials: testCredentials,
            object: { id: botId, name: botName, project: botObjToCreate.project },
            acl: [
                {
                    value: 'Full Control',
                    id: aclTestUser.id,
                    name: aclTestUser.username,
                },
            ],
        });
        await loginPage.login(aclTestUser);
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome });
        await dossierPage.waitForDossierLoading();
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            await dossierPage.getNavigationBar(),
            'TC93435_02_01',
            'bot toolbar with full acl'
        );
        await botAuthoring.openButtonMenu();
        await takeScreenshotByElement(
            await botAuthoring.getSaveBotDropDown(),
            'TC93435_02_02',
            'save menu with full acl'
        );
        await botAuthoring.saveBot({});
        //no save as dialog
        await resetObjectAcl({
            credentials: testCredentials,
            object: { id: botId, name: botName, project: botObjToCreate.project },
            acl: [
                {
                    value: 'Can View',
                    id: aclTestUser.id,
                    name: aclTestUser.username,
                },
            ],
        });
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome, dossier: true });
        await dossierPage.waitForDossierLoading();
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await libraryAuthoringPage.waitForCurtainDisappear();
        await botAuthoring.selectBotConfigTabByName('General');
        await takeScreenshotByElement(
            await dossierPage.getNavigationBar(),
            'TC93435_02_03',
            'bot toolbar with view only'
        );
        await botAuthoring.saveBot({ expectSuccess: false });
        await botAuthoring.waitForMessageBoxDisplay();
        await takeScreenshotByElement(
            await botAuthoring.getMessageBoxContainer(),
            'TC93435_02_04',
            'no access to save bot message box'
        );
        await botAuthoring.dismissErrorMessageBoxByClickOkButton();
    });

    /**
     * Known issue DE285547
     */
    it('[TC93435_03] no run bot privilege for bot as home', async () => {
        await loginPage.login(noRunBotTestUser);
        customAppIdOfBotAsHome = await createCustomApp({
            credentials: testCredentials,
            customAppInfo: bydBotAsHomeCustomAppObj,
        });
        await libraryPage.openCustomAppById({ id: customAppIdOfBotAsHome, dossier: true });
        await dossierPage.waitForElementVisible(dossierPage.getErrorDialogue());
        await takeScreenshot('TC93435_03_01', 'no run bot privilege');
        await dossierPage.dismissError();
        await takeScreenshot('TC93435_03_02', 'Page not load embed error');
    });
});
