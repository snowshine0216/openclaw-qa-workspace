import deleteSession from '../../../../api/deleteSession.js';
import urlParser from '../../../../api/urlParser.js';
import users from '../../../../testData/users.json' assert { type: 'json' };

/**
 * TC96518
 * Run in Local: npm run regression -- --xml=specs/regression/config/MultiSSO_CustomApp.config.xml --baseUrl=https://mci-cainb-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.loginType=Custom --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=eFe9+H.KLUdP
 */

describe('Multi SSO - Switch Custom app', () => {
    const azureUser = users['EMM_SAML_Azure'];
    azureUser.credentials.password = process.env.azure_password;
    const oktaUser = users['EMM_OKTA'];
    oktaUser.credentials.password = process.env.okta_password;
    const customApp = {
        default: {
            name: 'Strategy',
            id: 'C2B2023642F6753A2EF159A75E0CFF29',
        },
        SAMLSeverLevelRegistration: {
            name: 'multisso_SAML_SeverLevel',
            id: '1F0E1B12B93944C6BDD04CEA7DCD88DB',
        },
        SAMLAppLevelRegistration: {
            name: 'multisso_SAML_AppLevel',
            id: '96B4BCEEF2C34E17A8DD9568BF309932',
        },
        StandardDefault_SAMLAppLevelRegistration: {
            name: 'multisso_Standard(default)+SAML',
            id: '2FF304441A04451FB1A1446C37670FE5',
        },
        SAMLAppLevelRegistration2: {
            name: 'multisso_SAML_AppLevel_SwitchApp',
            id: '302A162AB2DB4B919B39B987C8D410C2',
        },
        OIDCAppLevelRegistration: {
            name: 'multisso_OIDC_AppLevel',
            id: '21761DA41A3C4791BFBC1E3A579D91C9',
        },
        StandardDefault_OIDCAppLevelRegistration: {
            name: 'multisso_Standard(default)+OIDC',
            id: '93F5388803334099A18C251EECB6E8AB',
        },
    };

    let { userAccount, libraryPage, loginPage, azureLoginPage } = browsers.pageObj1;
    const baseUrl = urlParser(browser.options.baseUrl);

    it('[TC96518_01] Validate switch app workflow | Multi SSO | Switch from SAML Default App to SAML App LeveL Custom App', async () => {
        const { SAMLAppLevelRegistration } = customApp;

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
        await since('The url should ends with /app').expect(currentUrl.endsWith('/app')).toBe(true);
        await libraryPage.closeUserAccountMenu();

        await userAccount.switchCustomApp(SAMLAppLevelRegistration.name);
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(SAMLAppLevelRegistration.id);
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
            .toContain(SAMLAppLevelRegistration.id);
        await libraryPage.logout();
    });

    it('[TC96518_02] Validate switch app workflow | Multi SSO | Switch from SAML App Level Custom App to SAML Default App Custom App', async () => {
        const { SAMLAppLevelRegistration } = customApp;

        await libraryPage.openCustomAppById({ id: SAMLAppLevelRegistration.id, check_flag: false });

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
            .toContain(SAMLAppLevelRegistration.id);
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
        await libraryPage.logout();
    });

    it('[TC96518_03] Validate switch app workflow | Multi SSO | Switch from SAML App Level Custom App to SAML APP Level Custom App', async () => {
        const { SAMLAppLevelRegistration, SAMLAppLevelRegistration2 } = customApp;

        await libraryPage.openCustomAppById({ id: SAMLAppLevelRegistration.id, check_flag: false });

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
            .toContain(SAMLAppLevelRegistration.id);
        await libraryPage.closeUserAccountMenu();

        await userAccount.switchCustomApp(SAMLAppLevelRegistration2.name);
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(SAMLAppLevelRegistration2.id);
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
            .toContain(SAMLAppLevelRegistration2.id);
        await libraryPage.logout();
    });

    it('[TC96518_04] Validate switch app workflow | Multi SSO | Switch from SAML App Level Custom App to OIDC APP Level Custom App', async () => {
        const { SAMLAppLevelRegistration, OIDCAppLevelRegistration } = customApp;

        await libraryPage.openCustomAppById({ id: SAMLAppLevelRegistration.id, check_flag: false });

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
            .toContain(SAMLAppLevelRegistration.id);
        await libraryPage.closeUserAccountMenu();

        await userAccount.switchCustomApp(OIDCAppLevelRegistration.name);
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(OIDCAppLevelRegistration.id);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();

        // global logout and relogin with previous SAML user
        await loginPage.oidcRelogin();
        await loginPage.oktaLogin(oktaUser.credentials);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user name should contain Shuai')
            .expect(await userAccount.getUserName())
            .toContain('Shuai');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(OIDCAppLevelRegistration.id);
        await libraryPage.logout();
    });

    it('[TC96518_05] Validate switch app workflow | Multi SSO | Session Expired | Switch from Default App to OIDC APP Level Custom App', async () => {
        const { StandardDefault_OIDCAppLevelRegistration } = customApp;

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
        await since('The url should ends with /app').expect(currentUrl.endsWith('/app')).toBe(true);
        await libraryPage.closeUserAccountMenu();

        const cookies = await browser.getCookies();
        await deleteSession(baseUrl, cookies);

        await userAccount.switchCustomApp(StandardDefault_OIDCAppLevelRegistration.name);

        await libraryPage.reload();
        await loginPage.waitForLoginView();
        await since('OIDC login button is displayed = ')
            .expect(await loginPage.isOIDCLoginButtonDisplayed())
            .toEqual(true);
    });
});
