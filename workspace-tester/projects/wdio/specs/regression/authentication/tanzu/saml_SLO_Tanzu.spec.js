/*
Test environment: Tanzu Single Logout Env
Environment URL: https://mci-6qyy3-dev.hypernow.microstrategy.com/MicroStrategyLibrary
Tomcat, Azure, Global logout
*/
import users from '../../../../testData/users.json' assert { type: 'json' };
describe('SAML Azure Global Logout', () => {
    const user1 = users['EMM_SAML_Azure'].credentials;
    user1.password = process.env.azure_password;

    const dossier = {
        name: 'Blank Dossier',
    };

    let config = {
        dossierAsHomeID: 'B578D1FFADB8444EB22901A2165E69E4',
        dossierAsHomeName: 'dossier as home',
    };

    let { userAccount, libraryPage, azureLoginPage, loginPage, dossierPage, toc } = browsers.pageObj1;

    it('[TC84178_01] [Tanzu] Library Web - SAML Single Logout', async () => {
        //login successfully
        await azureLoginPage.loginToAzure(user1.username);
        await azureLoginPage.loginWithPassword(user1.password);
        await azureLoginPage.continueAzureLogin();

        // run dossier
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('mexia@mstrdev.com');
        await userAccount.closeUserAccountMenu();
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['Blank Dossier', 'Chapter 1', 'Page 1']);

        // global logout and relogin with credential
        await userAccount.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.samlRelogin();
        await azureLoginPage.loginExistingUser(user1.username);
        await azureLoginPage.loginWithPassword(user1.password);
        await azureLoginPage.continueAzureLogin();
        await libraryPage.waitForLibraryLoading();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await libraryPage.title())
            .toEqual('Library');
    });

    it('[TC84178_02] [Tanzu] Library Web - SAML Single Logout when custom app', async () => {
        // await libraryPage.openCustomAppById(config.dossierAsHome);
        await userAccount.switchCustomApp(config.dossierAsHomeName);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['Blank Dossier', 'Chapter 1', 'Page 1']);
        await toc.openMenu();

        // global logout and relogin with credential
        await userAccount.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.samlRelogin();
        await azureLoginPage.loginExistingUser(user1.username);
        await azureLoginPage.loginWithPassword(user1.password);
        await azureLoginPage.continueAzureLogin();
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['Blank Dossier', 'Chapter 1', 'Page 1']);
    });
});
