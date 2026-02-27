import users from '../../../../testData/users.json' assert { type: 'json' };

/**
 * TC95178
 * Run in Local: npm run regression -- --xml=specs/regression/config/MultiSSO_CustomApp.config.xml --baseUrl=https://mci-cainb-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.loginType=Custom --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=eFe9+H.KLUdP
 */

describe('Multi SSO Custom app auth mode - SAML - app level', () => {
    const azureUser = users['EMM_SAML_Azure'];
    azureUser.credentials.password = process.env.azure_password;
    const customApp = {
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
    };

    let { userAccount, libraryPage, loginPage, azureLoginPage } = browsers.pageObj1;

    it('[TC95178_5] Validate login workflow | Multi SSO | Single Auth | Login custom app with SAML specific registration', async () => {
        const { SAMLAppLevelRegistration } = customApp;

        const SAML = SAMLAppLevelRegistration;

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

        // logout and relogin with previous SAML user
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

    it('[TC95178_6] Validate login workflow | Multi SSO | Multi Auth | Login custom app with Standard + SAML specific registration', async () => {
        const { StandardDefault_SAMLAppLevelRegistration } = customApp;

        const SAML = StandardDefault_SAMLAppLevelRegistration;

        await libraryPage.openCustomAppById({ id: SAML.id, check_flag: false });
        await loginPage.waitForLoginView();
        await since('SAML login button is displayed = ')
            .expect(await loginPage.isSAMLLoginButtonDisplayed())
            .toEqual(true);
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(SAML.id);

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

        // logout and relogin with previous SAML user
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
