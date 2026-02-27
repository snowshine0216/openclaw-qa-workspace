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

    it('[TC96518_06] Validate switch app workflow | Multi SSO | Session Expired | Switch from OIDC APP Level Custom App to Default App', async () => {
        const { StandardDefault_OIDCAppLevelRegistration } = customApp;

        await libraryPage.openCustomAppById({ id: StandardDefault_OIDCAppLevelRegistration.id, check_flag: false });

        await loginPage.oidcRelogin();
        await loginPage.oktaLogin(oktaUser.credentials);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user name should contain Shuai')
            .expect(await userAccount.getUserName())
            .toContain('Shuai');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(StandardDefault_OIDCAppLevelRegistration.id);
        await libraryPage.closeUserAccountMenu();

        const cookies = await browser.getCookies();
        await deleteSession(baseUrl, cookies);

        await userAccount.switchCustomApp(customApp.default.name);

        // should directly redirect to IDP login page
        await since('Login page is not displayed = ')
            .expect(await loginPage.isLoginPageDisplayed())
            .toEqual(false);
    });

    it('[TC96518_07] Validate switch app workflow | Multi SSO | Session Expired | Switch from OIDC APP Level Custom App to SAML APP Level Custom App', async () => {
        const { StandardDefault_OIDCAppLevelRegistration, StandardDefault_SAMLAppLevelRegistration } = customApp;

        await libraryPage.openCustomAppById({ id: StandardDefault_OIDCAppLevelRegistration.id, check_flag: false });

        await loginPage.oidcRelogin();
        if (await loginPage.isOktaUsernameDisplayed()) {
            await loginPage.oktaLogin(oktaUser.credentials);
        }
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user name should contain Shuai')
            .expect(await userAccount.getUserName())
            .toContain('Shuai');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(StandardDefault_OIDCAppLevelRegistration.id);
        await libraryPage.closeUserAccountMenu();

        const cookies = await browser.getCookies();
        await deleteSession(baseUrl, cookies);

        await userAccount.switchCustomApp(StandardDefault_SAMLAppLevelRegistration.name);

        await libraryPage.reload();
        await loginPage.waitForLoginView();
        await since('SAML login button is displayed = ')
            .expect(await loginPage.isSAMLLoginButtonDisplayed())
            .toEqual(true);
    });
});
