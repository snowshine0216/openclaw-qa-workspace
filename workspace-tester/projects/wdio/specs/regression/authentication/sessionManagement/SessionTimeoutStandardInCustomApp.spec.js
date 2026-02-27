import users from '../../../../testData/users.json' assert { type: 'json' };

/*
npm run regression -- --baseUrl=https://mci-snh21-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --xml=specs/regression/config/Authentication_SessionTimeoutStandardInCustomApp.config.xml --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=g~j2L1Dxb2Wk  --params.loginType=Custom
 */
describe('Login as STD(default auth mode) in custom app, session timeout', () => {
    const standardUser = users['EMM_appAuth_Standard_User'];

    const dossier = {
        name: 'Standard_dossier',
    };
    const customApp = {
        StandardDefault_SAML: {
            name: 'auto_Standard(Default)+SAML',
            id: 'B17E4605654B4001B0B7E2A2DBFB2892',
        },
        Standard: {
            name: 'auto_Standard',
            id: 'A799923FD0784CDAA15425719159085D',
        },
    };

    let { dossierPage, libraryPage, loginPage, userAccount } = browsers.pageObj1;

    beforeEach(async () => {
        await libraryPage.openCustomAppById({ id: customApp.StandardDefault_SAML.id });
        await loginPage.waitForLoginView();
        await since('SAML login button is displayed = ')
            .expect(await loginPage.isSAMLLoginButtonDisplayed())
            .toEqual(true);
        await loginPage.login(standardUser.credentials);
        await libraryPage.waitForLibraryLoading();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await libraryPage.title())
            .toEqual('Library');
    });
    afterEach(async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
    });

    it('[TC86312] Login as std user in custom app, session timeout, open a dossier', async () => {
        await browser.pause(240000);
        await libraryPage.openDossier(dossier.name);
        // back to login page
        await loginPage.waitForLoginView();
        await since('SAML login button is displayed = ')
            .expect(await loginPage.isSAMLLoginButtonDisplayed())
            .toEqual(true);
        let url = await libraryPage.currentURL();
        await since('URL should end with #{expected}, instead we have #{actual}')
            .expect(url)
            .toContain(customApp.StandardDefault_SAML.id);
        await loginPage.login(standardUser.credentials);
        // show dossier
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([dossier.name, 'Chapter 1', 'Page 1']);
    });
    it('[TC91478] Login as std user in custom app, session timeout, logout', async () => {
        await browser.pause(240000);
        await userAccount.openUserAccountMenu();
        await libraryPage.logout();
        // back to login page
        await loginPage.waitForLoginView();
        await since('SAML login button is displayed = ')
            .expect(await loginPage.isSAMLLoginButtonDisplayed())
            .toEqual(true);
        await loginPage.login(standardUser.credentials);
        // enter last custom app
        await libraryPage.waitForLibraryLoading();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await libraryPage.title())
            .toEqual('Library');
        let url = await libraryPage.currentURL();
        await since('URL should contain #{expected}, instead we have #{actual}')
            .expect(url)
            .toContain(customApp.StandardDefault_SAML.id);
    });
    it('[TC91479] Login as std user in custom app, session timeout, switch app', async () => {
        await browser.pause(240000);
        await libraryPage.openCustomAppById({ id: customApp.Standard.id, check_flag: false });
        // back to login page
        await loginPage.waitForLoginView();
        let url = await libraryPage.currentURL();
        await since('URL should contain #{expected}, instead we have #{actual}')
            .expect(url)
            .toContain(customApp.Standard.id);
        await loginPage.login(standardUser.credentials);
        await dossierPage.waitForDossierLoading();
        // enter target custom app
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([dossier.name, 'Chapter 1', 'Page 1']);
    });
});
