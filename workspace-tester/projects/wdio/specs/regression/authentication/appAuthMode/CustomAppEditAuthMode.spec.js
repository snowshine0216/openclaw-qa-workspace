import setWindowSize from '../../../../config/setWindowSize.js';
import createCustomApp from '../../../../api/customApp/createCustomApp.js';
import editCustomAppAuthMode from '../../../../api/customApp/editCustomappAuthMode.js';
import deleteCustomApp from '../../../../api/customApp/deleteCustomApp.js';
import * as customApp from '../../../../constants/customApp/customAppBody.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';

describe('Custom app auth mode - edit auth mode', () => {
    const dossier = {
        name: 'Test Dossier',
    };
    const standardUser = users['EMM_appAuth_Standard_User'];
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1200,
        height: 800,
    };
    const mstrUser = {
        username: browsers.params.credentials.webServerUsername,
        password: browsers.params.credentials.webServerPassword,
    };

    let { loginPage, libraryPage, dossierPage } = browsers.pageObj1;
    let newCustomAppID = '';

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        let customAppBody = customApp.getCustomAppBody({
            version: 'v1',
            name: 'TC86313',
        });
        customAppBody.authModes = {
            availableModes: [1, 4194304],
            defaultMode: 1,
            oidcRegistrationIds: null,
            samlRegistrationIds: null,
        };
        // create app
        newCustomAppID = await createCustomApp({
            credentials: mstrUser,
            customAppInfo: customAppBody,
        });
        await libraryPage.openCustomAppById({ id: newCustomAppID });
        await loginPage.waitForLoginView();
    });

    afterEach(async () => {
        await deleteCustomApp({
            credentials: mstrUser,
            customAppId: newCustomAppID,
        });
    });

    it('[TC86313_01] Before user login, change custom app auth mode', async () => {
        // edit app, remove standard mode
        await editCustomAppAuthMode({
            credentials: mstrUser,
            id: newCustomAppID,
            availableModes: [4194304],
            defaultMode: 4194304,
        });
        await loginPage.standardLogin(standardUser.credentials);
        await loginPage.waitForLoginErrorBox();
        await since('The error title should be #{expected}, instead we have #{actual}')
            .expect(await loginPage.errorTitle())
            .toBe('Authentication Error');
    });
    it('[TC86313_02] After user login, change custom app auth mode', async () => {
        await loginPage.standardLogin(standardUser.credentials);
        await libraryPage.waitForLibraryLoading();
        // edit app, remove standard mode
        await editCustomAppAuthMode({
            credentials: mstrUser,
            id: newCustomAppID,
            availableModes: [4194304],
            defaultMode: 4194304,
        });
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.openUserAccountMenu();
        await dossierPage.logout();
        await since('The OIDC login button should be #{expected}, instead we have #{actual}')
            .expect(await loginPage.isOIDCLoginButtonDisplayed())
            .toBe(true);
        await takeScreenshotByElement(loginPage.getCredsLoginContainer(), 'TC86313_02', 'Only OIDC login');
    });
});
