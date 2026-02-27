import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
/*
TC96782: Verify Library Web SAML Authentication - KeyCloak"
Run in Local: npm run regression -- --baseUrl=https://mci-jlonq-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec=specs/regression/authentication/samlSystemPrompt/samlLogin.spec.js  --params.loginType=Custom
 */

describe('Library OIDC login with user system prompt & nested group ', () => {
    const user = users['autoSAMLSP'];
    const document = {
        id: 'C386B476524FE2325497BFA29CDFE1BD',
        name: 'customer_shipdate',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier = {
        id: '106DC962154C74786BFA2DB6588374F9',
        name: 'customer_age',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const customApp = {
        saml_relaystate: {
            id: '033A537F40E84381824D0C0B9BF1DC40',
        },
    };

    let { userAccount, libraryPage, keycloakLoginPage, loginPage, biwebRsdEditablePage, dossierPage, infoWindow } = browsers.pageObj1;

    afterEach(async () => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
    });

    it('[TC99103_1] check SAML Login and relogin with new MstrConfig.xml', async () => {
        await loginPage.samlRelogin();
        await keycloakLoginPage.login(user.credentials.username, user.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('saml_sp');
        await userAccount.closeUserAccountMenu();
    });

    it('[TC99103_2] check SAML seamless login to BIWeb', async () => {
        await loginPage.samlRelogin();
        await keycloakLoginPage.login(user.credentials.username, user.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openDossierInfoWindow(document.name);
        await since('The presence of edit button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isEditIconPresent())
            .toBe(true);
        await infoWindow.clickEditButton();
        await libraryPage.switchToTab(1);
        await biwebRsdEditablePage.waitForRsdLoad();
        await takeScreenshot('TC99103_2', 'Open document with report filter - biweb');
        await since('Current RSD should be #{expected}, but we get #{actual}')
            .expect(await biwebRsdEditablePage.getDocName())
            .toBe(document.name);
        await since('Seamless account should be #{expected}, but we get #{actual}')
            .expect(await biwebRsdEditablePage.getAccountName())
            .toBe('saml_sp');
        await libraryPage.closeTab(1);
        await infoWindow.close();
    });

    it('[TC99103_3] check SAML text and numeric system prompt with dossier', async () => {
        await loginPage.samlRelogin();
        await keycloakLoginPage.login(user.credentials.username, user.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('saml_sp');
        await userAccount.closeUserAccountMenu();
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC99103_3', 'Open Dossier age&gender >=63 female');
    });

    it('[TC99103_4] check SAML date system prompt with document', async () => {
        await loginPage.samlRelogin();
        await keycloakLoginPage.login(user.credentials.username, user.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('saml_sp');
        await userAccount.closeUserAccountMenu();
        await libraryPage.openDocumentNoWait(document.name);
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC99103_4', 'Open document with date system prompt security filter >=2014-02-18');
    });

    it('[TC99103_5] check SAML relay state', async () => {
        const { saml_relaystate } = customApp;
        const relaystate = saml_relaystate;
        await libraryPage.openCustomAppById({ id: relaystate.id, check_flag: false });
        await libraryPage.waitForLibraryLoading();
        await loginPage.samlRelogin();
        await keycloakLoginPage.login(user.credentials.username, user.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('saml_sp');
        await userAccount.closeUserAccountMenu();
        await since('The title should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.getTitleText())
            .toBe('saml_keycloak');
    });
});
