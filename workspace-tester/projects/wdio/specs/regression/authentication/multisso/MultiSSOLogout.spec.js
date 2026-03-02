import users from '../../../../testData/users.json' assert { type: 'json' };

/**
 * TC96520
 * Run in Local: npm run regression -- --xml=specs/regression/config/MultiSSO_CustomApp.config.xml --baseUrl=https://mci-cainb-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.loginType=Custom --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=eFe9+H.KLUdP
 */

describe('Multi SSO Logout', () => {
    const oktaUser = users['EMM_OKTA'];
    oktaUser.credentials.password = process.env.okta_password;
    const azureUser = users['EMM_SAML_Azure'];
    azureUser.credentials.password = process.env.azure_password;
    const customApp = {
        OIDC_LocalLogout: {
            id: '4BD5958D9F47419AAE781DC2B157C6D5',
        },
        OIDC_GlobalLogout: {
            id: 'E24E784B3A7C4DA691515619E9ADC138',
        },
        SAML_LocalLogout: {
            id: '3BA1B72BA6F44446A62FEC3073AFDB4C',
        },
        SAML_GlobalLogout: {
            id: '22830698C1AD4722B5AEDA968EEF0829',
        },
    };

    let { userAccount, libraryPage, azureLoginPage, loginPage, dossierPage } = browsers.pageObj1;

    it('[TC96520_01] Validate logout workflow | Multi SSO | Verify OIDC local logout on Library Web', async () => {
        const { OIDC_LocalLogout } = customApp;

        const OIDC = OIDC_LocalLogout;

        await libraryPage.openCustomAppById({ id: OIDC.id, check_flag: false });
        // directly jump to OIDC login
        await loginPage.oktaLogin(oktaUser.credentials);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user name should contain Shuai')
            .expect(await userAccount.getUserName())
            .toContain('Shuai');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(OIDC.id);
        await libraryPage.logout();

        // relogin with previous oidc user
        await loginPage.oidcRelogin();
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user name should contain Shuai')
            .expect(await userAccount.getUserName())
            .toContain('Shuai');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(OIDC.id);
        await libraryPage.logout();
    });

    it('[TC96520_02] Validate logout workflow | Multi SSO | Verify OIDC global logout on Library Web', async () => {
        //login successfully
        const { OIDC_GlobalLogout } = customApp;

        const OIDC = OIDC_GlobalLogout;

        await libraryPage.openCustomAppById({ id: OIDC.id, check_flag: false });
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user name should contain Shuai')
            .expect(await userAccount.getUserName())
            .toContain('Shuai');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(OIDC.id);
        await libraryPage.logout();

        // relogin with previous oidc user
        await loginPage.oidcRelogin();
        await loginPage.oktaLogin(oktaUser.credentials);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user name should contain Shuai')
            .expect(await userAccount.getUserName())
            .toContain('Shuai');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(OIDC.id);
        await libraryPage.logout();
    });

    it('[TC96520_03] Validate logout workflow | Multi SSO | Verify SAML local logout on Library Web', async () => {
        //login successfully
        const { SAML_LocalLogout } = customApp;

        const SAML = SAML_LocalLogout;

        await libraryPage.openCustomAppById({ id: SAML.id, check_flag: false });
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

        // local logout and relogin with previous SAML user
        await loginPage.samlRelogin();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contains mexia')
            .expect(await userAccount.getUserName())
            .toContain('mexia');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(SAML.id);
        await libraryPage.logout();
    });

    it('[TC96520_04] Validate logout workflow | Multi SSO | Verify SAML global logout on Library Web', async () => {
        //login successfully
        const { SAML_GlobalLogout } = customApp;

        const SAML = SAML_GlobalLogout;

        await libraryPage.openCustomAppById({ id: SAML.id, check_flag: false });
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
    });
});
