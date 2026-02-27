import users from '../../../../testData/users.json' assert { type: 'json' };
/*
Run in local: npm run regression -- --baseUrl=https://emm1.labs.microstrategy.com:1024/MicroStrategyLibrary/ --xml=specs/regression/config/SAMLAzureLogin.config.xml --params.loginType=Custom --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=mstr123
Jboss, Azure, Local logout
*/

describe('SAML Azure', () => {
    const azureUser = users['EMM_SAML_Azure'];
    azureUser.credentials.password = process.env.azure_password;

    const dossier = {
        name: 'Test Dossier',
    };

    let config = {
        dossierAsHome: 'AC22810FEEAF4F64A022991DF94EDC39',
    };

    let { userAccount, libraryPage, azureLoginPage, loginPage, dossierPage } = browsers.pageObj1;

    afterEach(async () => {
        await userAccount.openUserAccountMenu();
        await libraryPage.logout();
    });

    it('[TC79615] Validate SAML authentication workflow on JBoss', async () => {
        await browser.url(browser.options.baseUrl);
        await azureLoginPage.loginToAzure(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.continueAzureLogin();
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Menglu Xia');
        await userAccount.closeUserAccountMenu();
        await libraryPage.openDossier(dossier.name);
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['Test Dossier', 'Chapter 1', 'CustomViz']);

        /* local logout and relogin */
        await userAccount.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.samlRelogin();
        await libraryPage.waitForLibraryLoading();
        await since('User can re-login without filling in credentials')
            .expect(await libraryPage.title())
            .toBe('Library');
    });
});
