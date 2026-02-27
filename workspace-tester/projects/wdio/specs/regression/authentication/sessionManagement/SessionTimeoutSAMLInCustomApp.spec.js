import users from '../../../../testData/users.json' assert { type: 'json' };
/*
npm run regression -- --baseUrl=https://mci-snh21-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --xml=specs/regression/config/Authentication_SessionTimeoutSAML.config.xml --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=g~j2L1Dxb2Wk  --params.loginType=Custom
*/
describe('Session Timeout SAML as default in default and custom app', () => {
    const azureUser = users['EMM_SAML_Azure'];
    azureUser.credentials.password = process.env.azure_password;
    const customApp = {
        ServerLevel: {
            name: 'auto_ServerLevel',
            id: '6C9EB228FC5A43D1BDA09723955BA13A',
            dossier: 'Blank Dossier',
        },
        SAML: {
            name: 'auto_SAML',
            id: 'F501A085A18043F4A6F79BD636C44B9C',
            dossier: 'Blank Dossier',
        },
        StandardDefault_SAML: {
            name: 'auto_Standard(default)+SAML',
            id: 'B17E4605654B4001B0B7E2A2DBFB2892',
        },
        DossierAsHome: {
            name: 'dossier as home',
            id: 'B578D1FFADB8444EB22901A2165E69E4',
            dossier: 'Blank Dossier',
        },
    };

    let { dossierPage, libraryPage, loginPage, userAccount, azureLoginPage, toc } = browsers.pageObj1;

    beforeEach(async () => {
        await libraryPage.openCustomAppById({ id: customApp.ServerLevel.id, check_flag: false });
        await azureLoginPage.safeLoginToAzure(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
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
    afterEach(async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
    });

    it('[TC91420] Login as SAML in custom app, session timeout, open a dossier', async () => {
        await libraryPage.openCustomAppById({ id: customApp.SAML.id });
        await libraryPage.waitForLibraryLoading();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await libraryPage.title())
            .toEqual('Library');
        await browser.pause(240000);
        await libraryPage.openDossierNoWait(customApp.SAML.dossier);
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForElementInvisible(dossierPage.getPageLoadingIcon());
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([customApp.SAML.dossier, 'Chapter 1', 'Page 1']);
        let url = await libraryPage.currentURL();
        await since('URL should contain #{expected}, instead we have #{actual}')
            .expect(url)
            .toContain(customApp.SAML.id);
    });
    it('[TC91473] Login as SAML user in custom app, session timeout, switch to non-SAML default app', async () => {
        await browser.pause(240000);
        await userAccount.switchCustomApp(customApp.StandardDefault_SAML.name);
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
    it('[TC91474] Login as SAML user in custom app, session timeout, switch to SAML default app', async () => {
        await browser.pause(240000);
        await userAccount.switchCustomApp(customApp.DossierAsHome.name);
        await dossierPage.waitForDossierLoading();
        await toc.openMenu();
        // await libraryPage.waitForLibraryLoading();
        let url = await libraryPage.currentURL();
        await since('URL should contain #{expected}, instead we have #{actual}')
            .expect(url)
            .toContain(customApp.DossierAsHome.id);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([customApp.DossierAsHome.dossier, 'Chapter 1', 'Page 1']);
    });
});
