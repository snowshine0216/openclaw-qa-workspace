import users from '../../../../testData/users.json' assert { type: 'json' };
/*
Run in local: npm run regression -- --baseUrl=https://tec-l-1180773.labs.microstrategy.com/MicroStrategyLibrary/ --xml=specs/regression/config/SAMLAzureLocalMCG.config.xml --params.loginType=Custom --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=mstr123
Jboss, Azure, Local logout
*/

describe('SAML local MCG', () => {
    const azureUser = users['EMM_SAML_Azure'];
    azureUser.credentials.password = process.env.azure_password;

    const dossier = {
        name: 'Blank Dossier',
    };

    let { userAccount, libraryPage, azureLoginPage, loginPage, dossierPage } = browsers.pageObj1;

    afterEach(async () => {
        await userAccount.openUserAccountMenu();
        await libraryPage.logout();
    });

    it('[TC82085_01] Validate SAML authentication workflow on local MCG', async () => {
        await browser.url(browser.options.baseUrl);
        await loginPage.samlRelogin();
        await azureLoginPage.loginToAzure(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.continueAzureLogin();
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('mexia@mstrdev.com');
        await userAccount.closeUserAccountMenu();
        await libraryPage.openDossier(dossier.name);
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['Blank Dossier', 'Chapter 1', 'Page 1']);
    });
});
