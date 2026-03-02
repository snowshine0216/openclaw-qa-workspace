import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
/*
TC96782: Verify Library Web OIDC Authentication - KeyCloak"
Run in Local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:6198/MicroStrategyLibrary/ --spec=specs/regression/authentication/oidcSystemPrompt/oidcLogin.spec.js  --params.loginType=Custom
 */

describe('Library OIDC login with user system prompt & nested group ', () => {
    const user = users['auto2User'];
    const document = {
        id: '2B29D5C64BA46985B0475AA05BB39A4E',
        name: 'document_withReportFilter',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { userAccount, libraryPage, keycloakLoginPage, loginPage, biwebRsdEditablePage, dossierPage, infoWindow } = browsers.pageObj1;

    afterEach(async () => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
    });

    it('[TC96782] check OIDC Login and relogin with new OIDCConfigure.json', async () => {
        await loginPage.oidcRelogin();
        await keycloakLoginPage.login(user.credentials.username, user.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('auto2 keycloak');
        await userAccount.logout();
        await loginPage.oidcRelogin();
        await keycloakLoginPage.login(user.credentials.username, user.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('auto2 keycloak');
        await userAccount.closeUserAccountMenu();
    });

    it('[TC97683] check OIDC seamless login to BIWeb', async () => {
        await loginPage.oidcRelogin();
        await keycloakLoginPage.login(user.credentials.username, user.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await userAccount.closeUserAccountMenu();
        await libraryPage.openDossierInfoWindow(document.name);
        await since('The presence of edit button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isEditIconPresent())
            .toBe(true);
        await infoWindow.clickEditButton();
        await libraryPage.switchToTab(1);
        await biwebRsdEditablePage.waitForRsdLoad();
        await takeScreenshot('TC97683', 'Open document with report filter - biweb');
        await since('Current RSD should be #{expected}, but we get #{actual}')
            .expect(await biwebRsdEditablePage.getDocName())
            .toBe(document.name);
        await since('Seamless account should be #{expected}, but we get #{actual}')
            .expect(await biwebRsdEditablePage.getAccountName())
            .toBe('auto2 keycloak');
        await libraryPage.closeTab(1);
        await infoWindow.close();
    });
});
