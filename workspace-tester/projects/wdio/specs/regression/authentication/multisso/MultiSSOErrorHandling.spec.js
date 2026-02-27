/**
 * TC96516
 * Run in Local: npm run regression -- --xml=specs/regression/config/MultiSSO_CustomApp.config.xml --baseUrl=https://mci-cainb-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.loginType=Custom --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=eFe9+H.KLUdP
 */

describe('Multi SSO - Custom App - Error Handling', () => {
    const customApp = {
        OIDCAppLevelInvalidRegistration: {
            id: 'F5BE549E310B402B93C0DAD5475DBB76',
        },
        SAMLAppLevelInvalidRegistration: {
            id: 'A61B3083EB504A7EAB9ED306862F2FEA',
        },
    };

    let { libraryPage, loginPage } = browsers.pageObj1;

    it('[TC96516_01] Error handling | Multi SSO | OIDC with invalid Config', async () => {
        const { OIDCAppLevelInvalidRegistration } = customApp;

        const OIDC = OIDCAppLevelInvalidRegistration;

        await libraryPage.openCustomAppById({ id: OIDC.id, check_flag: false });
        await browser.refresh();
        await loginPage.waitForLoginView();
        await since('Login page is displayed = ')
            .expect(await loginPage.isLoginPageDisplayed())
            .toEqual(true);
        await since('OIDC login button is not displayed = ')
            .expect(await loginPage.isOIDCLoginButtonDisplayed())
            .toEqual(false);
    });

    it('[TC96516_02] Error handling | Multi SSO | SAML with invalid Config', async () => {
        const { SAMLAppLevelInvalidRegistration } = customApp;

        const SAML = SAMLAppLevelInvalidRegistration;

        await libraryPage.openCustomAppById({ id: SAML.id, check_flag: false });
        await browser.refresh();
        await loginPage.waitForLoginView();
        await since('Login page is displayed = ')
            .expect(await loginPage.isLoginPageDisplayed())
            .toEqual(true);
        await since('SAML login button is not displayed = ')
            .expect(await loginPage.isSAMLLoginButtonDisplayed())
            .toEqual(false);
    });
});
