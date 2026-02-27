import users from '../../../../testData/users.json' assert { type: 'json' };

/**
 * TC86287
 * TC86292
 * TC86293
 * TC86295
 * TC86334
 * TC86343
 * Run in Local: npm run regression -- --baseUrl=https://mci-cainb-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --xml=specs/regression/config/CustomAppServerLevel.config.xml --params.credentials.username=mstr --params.credentials.password=eFe9+H.KLUdP --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=eFe9+H.KLUdP --params.loginType=custom
 */

describe('Custom app auth mode - Sever Level', () => {
    const standardUser = {
        username: browsers.params.credentials.username,
        password: browsers.params.credentials.password,
    };
    const noprivilegeUser = {
        username: 'noprivilege',
        password: '6HNE4vQKTe',
    };
    const azureUser = users['EMM_SAML_Azure'];
    azureUser.credentials.password = process.env.azure_password;
    const azureUser2 = users['EMM_SAML_Azure_User2'];
    azureUser2.credentials.password = process.env.azure_sxiong_password;
    const customApp = {
        serverLevelAuthMode: {
            id: '6C9EB228FC5A43D1BDA09723955BA13A',
        },
        specificAuthMode: {
            SAML: {
                id: 'F501A085A18043F4A6F79BD636C44B9C',
            },
            OIDC: {
                id: 'A176703794634343BFB9FDDDF69758C2',
            },
            Standard: {
                name: 'auto_Standard',
                id: 'A799923FD0784CDAA15425719159085D',
            },
        },
        invalidId: '67E24549C8AAF33125A4WFGW2T3FWGFA',
    };

    const projectId = '73E53B9A11EAB363B78E0080EF8506F9';
    const dossierId = '095466011440E1F416FA4A95A7A69C79';

    let { userAccount, libraryPage, loginPage, dossierPage, azureLoginPage, toc } = browsers.pageObj1;

    afterEach(async () => {
        await libraryPage.logout();
    });

    it('[TC86287] Validate login workflow | Login custom app when it is set to server level auth mode', async () => {
        await libraryPage.openCustomAppById({ id: customApp.serverLevelAuthMode.id, check_flag: false });

        // directly jump to SAML login (default auth mode is SAML)
        await azureLoginPage.loginToAzure(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await dossierPage.waitForDossierLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contains mexia')
            .expect(await userAccount.getUserName())
            .toContain('mexia');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(customApp.serverLevelAuthMode.id);
        await libraryPage.logout();

        // global logout and relogin with previous SAML user
        await loginPage.samlRelogin();
        await azureLoginPage.loginExistingUser(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await dossierPage.waitForDossierLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contains mexia')
            .expect(await userAccount.getUserName())
            .toContain('mexia');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(customApp.serverLevelAuthMode.id);
        await libraryPage.logout();

        // global logout and relogin with another SAML user
        await loginPage.samlRelogin();
        await azureLoginPage.loginAzureWithAnotherUser();
        await azureLoginPage.loginToAzure(azureUser2.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser2.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await dossierPage.waitForDossierLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contains sxiong')
            .expect(await userAccount.getUserName())
            .toContain('sxiong');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(customApp.serverLevelAuthMode.id);
        await libraryPage.logout();

        // global logout and relogin with standard user
        await loginPage.login(standardUser);
        await dossierPage.waitForDossierLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contains MSTR')
            .expect(await userAccount.getUserName())
            .toContain('MSTR');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(customApp.serverLevelAuthMode.id);
    });

    it('[TC86292] Validate login workflow | Login dossier in custom app', async () => {
        await libraryPage.openCustomAppById({
            id: `${customApp.specificAuthMode.Standard.id}/${projectId}/${dossierId}`,
            check_flag: false,
        });
        await loginPage.login(standardUser);
        await dossierPage.waitForDossierLoading();
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(customApp.specificAuthMode.Standard.id);
        await libraryPage.openUserAccountMenu();
    });

    it('[TC86293] Validate login workflow | Login custom app by user without privilege', async () => {
        await libraryPage.openCustomAppById({ id: customApp.specificAuthMode.Standard.id });

        await loginPage.login(noprivilegeUser);
        await libraryPage.waitForLibraryLoading();
        // wait for url redirect
        await browser.pause(5000);
        let currentUrl = (await browser.getUrl()).split('?')[0];
        console.log('currentUrl', currentUrl);
        await since('Login custom app by user without privilege, it should redirect to /app')
            .expect(currentUrl.endsWith('/app'))
            .toBe(true);
        await libraryPage.openUserAccountMenu();
    });

    it('[TC86295] Validate switch app workflow | Switch from custom app to another custom app with different auth mode', async () => {
        const {
            specificAuthMode: { SAML, Standard },
        } = customApp;

        await libraryPage.openCustomAppById({ id: SAML.id, check_flag: false });

        // directly jump to SAML login (default auth mode is SAML)
        await azureLoginPage.safeLoginToAzure(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await dossierPage.waitForDossierLoading();
        await toc.openMenu();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contains mexia')
            .expect(await userAccount.getUserName())
            .toContain('mexia');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(SAML.id);
        await libraryPage.closeUserAccountMenu();
        await libraryPage.openCustomAppById({ id: Standard.id });
        await since('The url should contains standard custom app id')
            .expect(await browser.getUrl())
            .toContain(Standard.id);
        await dossierPage.waitForDossierLoading();
        await toc.openMenu();
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();

        // global logout and relogin with standard user
        await loginPage.login(standardUser);
        await dossierPage.waitForDossierLoading();
        await toc.openMenu();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contains MSTR')
            .expect(await userAccount.getUserName())
            .toContain('MSTR');
        await since('The url should contains standard custom app id')
            .expect(await browser.getUrl())
            .toContain(Standard.id);
    });

    it('[TC86334] Validate error handling case | SAML/OIDC is not configured', async () => {
        const {
            specificAuthMode: { OIDC },
        } = customApp;

        await libraryPage.openCustomAppById({ id: OIDC.id, check_flag: false });
        await loginPage.login(standardUser);
        await libraryPage.openUserAccountMenu();
    });

    it('[TC86343] Validate login workflow |login custom app with unexisting/invalid ID', async () => {
        /**
         * Login with saml valid user, then check url path (should ends with /app)
         */
        await libraryPage.openCustomAppById({ id: customApp.invalidId, check_flag: false });
        await azureLoginPage.safeLoginToAzure(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await libraryPage.waitForLibraryLoading();
        // wait for url redirect
        await browser.pause(5000);
        let currentUrl = (await browser.getUrl()).split('?')[0];
        console.log('currentUrl', currentUrl);
        await since('Login custom app with unexisting/invalid ID, it should redirect to /app')
            .expect(currentUrl.endsWith('/app'))
            .toBe(true);
        await libraryPage.openUserAccountMenu();
    });
});
