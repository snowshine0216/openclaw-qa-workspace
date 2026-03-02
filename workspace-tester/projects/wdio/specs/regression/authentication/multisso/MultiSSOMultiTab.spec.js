import users from '../../../../testData/users.json' assert { type: 'json' };

/**
 * TC96519
 * Run in Local: npm run regression -- --xml=specs/regression/config/MultiSSO_CustomApp.config.xml --baseUrl=https://mci-cainb-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.loginType=Custom --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=eFe9+H.KLUdP
 */

describe('Multi SSO - Multi Tab', () => {
    const azureUser = users['EMM_SAML_Azure'];
    azureUser.credentials.password = process.env.azure_password;
    const oktaUser = users['EMM_OKTA'];
    oktaUser.credentials.password = process.env.okta_password;
    const customApp = {
        SAMLSeverLevelRegistration: {
            name: 'multisso_SAML_SeverLevel',
            id: '1F0E1B12B93944C6BDD04CEA7DCD88DB',
        },
        SAMLAppLevelRegistration: {
            name: 'multisso_SAML_AppLevel',
            id: '96B4BCEEF2C34E17A8DD9568BF309932',
        },
        StandardDefault_OIDCAppLevelRegistration: {
            name: 'multisso_Standard(default)+OIDC',
            id: '93F5388803334099A18C251EECB6E8AB',
        },
    };

    let { userAccount, libraryPage, azureLoginPage, loginPage } = browsers.pageObj1;

    it('[TC96519_01]  Multi SSO | Multi Tab | login server SSO app -> open app SSO url - no need to login', async () => {
        const { SAMLSeverLevelRegistration, SAMLAppLevelRegistration } = customApp;

        await libraryPage.openCustomAppById({ id: SAMLSeverLevelRegistration.id, check_flag: false });

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
            .toContain(SAMLSeverLevelRegistration.id);
        await libraryPage.closeUserAccountMenu();

        await libraryPage.switchToNewWindowWithUrl(
            new URL('app/config/' + SAMLAppLevelRegistration.id, browser.options.baseUrl).toString()
        );
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contains mexia')
            .expect(await userAccount.getUserName())
            .toContain('mexia');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(SAMLAppLevelRegistration.id);
        await libraryPage.closeUserAccountMenu();

        await libraryPage.closeTab(1);
        await libraryPage.switchToTab(0);

        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
    });

    it('[TC96519_02] Multi SSO | Multi Tab | login app SSO -> server SSO - no need to login', async () => {
        const { SAMLSeverLevelRegistration, SAMLAppLevelRegistration } = customApp;

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

        await libraryPage.switchToNewWindowWithUrl(
            new URL('app/config/' + SAMLSeverLevelRegistration.id, browser.options.baseUrl).toString()
        );
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contains mexia')
            .expect(await userAccount.getUserName())
            .toContain('mexia');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(SAMLSeverLevelRegistration.id);
        await libraryPage.closeUserAccountMenu();

        await libraryPage.closeTab(1);
        await libraryPage.switchToTab(0);

        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
    });

    it('[TC96519_03] Multi SSO | Multi Tab | login app SSO -> app SSO - no need to login', async () => {
        const { StandardDefault_OIDCAppLevelRegistration, SAMLAppLevelRegistration } = customApp;

        await libraryPage.openCustomAppById({ id: StandardDefault_OIDCAppLevelRegistration.id, check_flag: false });

        await loginPage.oidcRelogin();
        await loginPage.oktaLogin(oktaUser.credentials);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contain Shuai')
            .expect(await userAccount.getUserName())
            .toContain('Shuai');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(StandardDefault_OIDCAppLevelRegistration.id);
        await libraryPage.closeUserAccountMenu();

        await libraryPage.switchToNewWindowWithUrl(
            new URL('app/config/' + SAMLAppLevelRegistration.id, browser.options.baseUrl).toString()
        );
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contain Shuai')
            .expect(await userAccount.getUserName())
            .toContain('Shuai');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(SAMLAppLevelRegistration.id);
        await libraryPage.closeUserAccountMenu();

        await libraryPage.closeTab(1);
        await libraryPage.switchToTab(0);

        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
    });

    it('[TC96519_04] Multi SSO | Multi Tab | logout from 1 tab - all tab logout', async () => {
        const { StandardDefault_OIDCAppLevelRegistration, SAMLAppLevelRegistration } = customApp;

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

        await libraryPage.switchToNewWindowWithUrl(
            new URL('app/config/' + StandardDefault_OIDCAppLevelRegistration.id, browser.options.baseUrl).toString()
        );
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contains mexia')
            .expect(await userAccount.getUserName())
            .toContain('mexia');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(StandardDefault_OIDCAppLevelRegistration.id);
        await libraryPage.closeUserAccountMenu();

        await libraryPage.switchToTab(0);

        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();

        await libraryPage.switchToTab(1);
        await libraryPage.reload();

        await since('Login page is displayed = ')
            .expect(await loginPage.isLoginPageDisplayed())
            .toEqual(true);
        await since('OIDC login button is displayed = ')
            .expect(await loginPage.isOIDCLoginButtonDisplayed())
            .toEqual(true);
    });
});
