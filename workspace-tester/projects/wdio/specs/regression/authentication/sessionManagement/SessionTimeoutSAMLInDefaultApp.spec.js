import users from '../../../../testData/users.json' assert { type: 'json' };
/*
npm run regression -- --baseUrl=https://mci-snh21-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --xml=specs/regression/config/Authentication_SessionTimeoutSAML.config.xml --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=g~j2L1Dxb2Wk  --params.loginType=Custom
*/
describe('Session Timeout SAML as default in default app', () => {
    const azureUser = users['EMM_SAML_Azure'];
    azureUser.credentials.password = process.env.azure_password;
    const customApp = {
        Default: {
            name: 'MicroStrategy',
            id: 'C2B2023642F6753A2EF159A75E0CFF29',
            dossier: 'Blank Dossier',
        },
        ServerLevel: {
            name: 'auto_ServerLevel',
            id: '6C9EB228FC5A43D1BDA09723955BA13A',
            dossier: 'Blank Dossier',
        },
        StandardDefault_SAML: {
            name: 'auto_Standard(default)+SAML',
            id: 'B17E4605654B4001B0B7E2A2DBFB2892',
        },
    };

    let { dossierPage, libraryPage, loginPage, userAccount, azureLoginPage, toc } = browsers.pageObj1;

    beforeEach(async () => {
        await browser.url(browser.options.baseUrl);
        await azureLoginPage.safeLoginToAzure(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await libraryPage.waitForLibraryLoading();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await libraryPage.title())
            .toEqual('Library');
    });
    afterEach(async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
    });

    it('[TC91475] Login as SAML in default app, session timeout, logout', async () => {
        await browser.pause(240000);
        await userAccount.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.waitForLoginView();
        await loginPage.samlRelogin();
        await libraryPage.waitForLibraryLoading();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await libraryPage.title())
            .toEqual('Library');
    });
    it('[TC91476] Login as SAML in default app, session timeout, open dossier', async () => {
        await browser.pause(240000);
        await libraryPage.openDossierNoWait(customApp.Default.dossier);
        await browser.pause(3000);
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForElementInvisible(dossierPage.getPageLoadingIcon());
        await toc.openMenu();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([customApp.Default.dossier, 'Chapter 1', 'Page 1']);
    });
    it('[TC91477] Login as SAML in default app, session timeout, switch to non-SAML default app', async () => {
        await browser.pause(240000);
        // swtich to non-SAML default app
        await libraryPage.openCustomAppById({ id: customApp.StandardDefault_SAML.id, check_flag: false });
        await loginPage.waitForLoginView();
        let url = await libraryPage.currentURL();
        await since('URL should contain #{expected}, instead we have #{actual}')
            .expect(url)
            .toContain(customApp.StandardDefault_SAML.id);
        await loginPage.samlRelogin();
        await libraryPage.waitForLibraryLoading();
        url = await libraryPage.currentURL();
        await since('URL should contain #{expected}, instead we have #{actual}')
            .expect(url)
            .toContain(customApp.StandardDefault_SAML.id);
    });
    it('[TC91421] Login as SAML in default app, session timeout, switch to SAML default app', async () => {
        await browser.pause(240000);
        await userAccount.switchCustomApp(customApp.ServerLevel.name);
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForElementInvisible(dossierPage.getPageLoadingIcon());
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([customApp.ServerLevel.dossier, 'Chapter 1', 'Page 1']);
        let url = await libraryPage.currentURL();
        await since('URL should contain #{expected}, instead we have #{actual}')
            .expect(url)
            .toContain(customApp.ServerLevel.id);
    });
});
