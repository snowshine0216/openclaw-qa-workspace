import users from '../../../../testData/users.json' assert { type: 'json' };
import deleteUserGroupByName from '../../../../api/deleteUserGroups.js';

/*
npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:9974/MicroStrategyLibrary/ --xml=specs/regression/config/Authentication_SessionTimeoutSAML.config.xml --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""  --params.loginType=Custom
*/
describe('Session Timeout SAML while delete user group case', () => {
    const azureUser = users['EMM_SAML_Azure'];
    const apiUser = users['EMM_api_automation'];
    azureUser.credentials.password = process.env.azure_password;
    const dossier = {
        name: 'Blank Dossier',
    };

    let { dossierPage, libraryPage, loginPage, userAccount, azureLoginPage, toc } = browsers.pageObj1;

    beforeEach(async () => {
        await browser.url(browser.options.baseUrl);
        await loginPage.waitForLoginView();
        await loginPage.samlRelogin();
        await azureLoginPage.safeLoginToAzure(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await libraryPage.waitForLibraryLoading();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await libraryPage.title())
            .toEqual('Library');
        await deleteUserGroupByName({
            credentials: apiUser.credentials,
            nameBeginsList: ['04b03474', '412d2e1f', '4b73b4e3', '5fe1cffe', '89a25aa3', '8c0f5d41'],
        });
    });
    afterEach(async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
    });

    it('[TC97137] user login status check when saml group is delete when session timeout and JWT still valid case', async () => {
        await browser.pause(240000);
        await libraryPage.openDossier(dossier.name);
        await loginPage.waitForLoginView();
        await loginPage.samlRelogin();
        await dossierPage.waitForDossierLoading();
        await toc.openMenu();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([dossier.name, 'Chapter 1', 'Page 1']);
    });

    // it('[TC97137_01] Login as SAML in default app, session timeout, logout button', async () => {
    //     await libraryPage.openDossier(dossier.name);
    //     await browser.pause(240000);
    //     await libraryPage.openUserAccountMenu();
    //     await libraryPage.logout();
    //     await loginPage.waitForLoginView();
    //     await loginPage.samlRelogin();
    //     await libraryPage.waitForLibraryLoading();
    //     await since('Library title should be #{expected} but is #{actual}')
    //         .expect(await libraryPage.title())
    //         .toEqual('Library');
    // });
});
