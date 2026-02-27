import users from '../../../../testData/users.json' assert { type: 'json' };

/**
 * Test environment: https://mci-cainb-dev.hypernow.microstrategy.com/MicroStrategyLibrary/
 * TC86288
 * TC86294
 * TC86296
 * Run in Local: npm run regression -- --xml=specs/regression/config/CustomAppSpecificSAMLGlobal.config.xml --baseUrl=https://mci-cainb-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=eFe9+H.KLUdP --params.loginType=custom
 */

describe('Custom app auth mode - SAML Global Logout', () => {
    const azureUser = users['EMM_SAML_Azure'];
    azureUser.credentials.password = process.env.azure_password;
    const azureUser2 = users['EMM_SAML_Azure_User2'];
    azureUser2.credentials.password = process.env.azure_sxiong_password;

    const customApp = {
        default: {
            name: 'Strategy',
            id: 'C2B2023642F6753A2EF159A75E0CFF29',
        },
        specificAuthMode: {
            SAML: {
                name: 'auto_SAML',
                id: 'F501A085A18043F4A6F79BD636C44B9C',
            },
        },
    };

    let { userAccount, libraryPage, loginPage, dossierPage, azureLoginPage } = browsers.pageObj1;

    afterEach(async () => {
        await libraryPage.logout();
    });

    it('[TC86288] Validate login workflow | Login custom app when it is set to specific auth mode - SAML single logout', async () => {
        const {
            specificAuthMode: { SAML },
        } = customApp;

        await libraryPage.openCustomAppById({ id: SAML.id, check_flag: false });

        // Directly jump to SAML IDP
        await azureLoginPage.loginToAzure(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contains mexia')
            .expect(await userAccount.getUserName())
            .toContain('mexia');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(SAML.id);
        await libraryPage.logout();

        // global logout and relogin with previous SAML user
        await loginPage.samlRelogin();
        await azureLoginPage.loginExistingUser(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contains mexia')
            .expect(await userAccount.getUserName())
            .toContain('mexia');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(SAML.id);
        await libraryPage.logout();

        // global logout and relogin with another SAML user
        await loginPage.samlRelogin();
        await azureLoginPage.loginAzureWithAnotherUser();
        await azureLoginPage.loginToAzure(azureUser2.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser2.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contain sxiong')
            .expect(await userAccount.getUserName())
            .toContain('sxiong');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(SAML.id);
    });

    it('[TC86294] Validate switch app workflow | Switch from default app to specific custom app', async () => {
        await libraryPage.openCustomAppById({ id: customApp.default.id, check_flag: false });

        // Directly jump to SAML IDP (default auth mode is saml)
        await azureLoginPage.safeLoginToAzure(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contains mexia')
            .expect(await userAccount.getUserName())
            .toContain('mexia');
        let currentUrl = (await browser.getUrl()).split('?')[0];
        console.log('currentUrl', currentUrl);
        await since('The url should ends with /app').expect(currentUrl.endsWith('/app')).toBe(true);
        await libraryPage.closeUserAccountMenu();

        await userAccount.switchCustomApp(customApp.specificAuthMode.SAML.name);
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(customApp.specificAuthMode.SAML.id);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();

        // global logout and relogin with previous SAML user
        await loginPage.samlRelogin();
        await azureLoginPage.loginExistingUser(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contains mexia')
            .expect(await userAccount.getUserName())
            .toContain('mexia');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(customApp.specificAuthMode.SAML.id);
    });

    it('[TC86296] Validate switch app workflow | Switch from custom app to default app', async () => {
        await libraryPage.openCustomAppById({ id: customApp.specificAuthMode.SAML.id, check_flag: false });

        // Directly jump to SAML IDP (default auth mode is saml)
        await azureLoginPage.safeLoginToAzure(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contains mexia')
            .expect(await userAccount.getUserName())
            .toContain('mexia');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(customApp.specificAuthMode.SAML.id);
        await libraryPage.closeUserAccountMenu();

        await userAccount.switchCustomApp(customApp.default.name);
        let currentUrl = await browser.getUrl();
        await since('The url should ends with /app').expect(currentUrl.endsWith('/app')).toBe(true);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();

        // global logout and relogin with previous SAML user
        await loginPage.samlRelogin();
        await azureLoginPage.loginExistingUser(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contains mexia')
            .expect(await userAccount.getUserName())
            .toContain('mexia');
        currentUrl = await browser.getUrl();
        await since('The url should ends with /app').expect(currentUrl.endsWith('/app')).toBe(true);
    });
});
