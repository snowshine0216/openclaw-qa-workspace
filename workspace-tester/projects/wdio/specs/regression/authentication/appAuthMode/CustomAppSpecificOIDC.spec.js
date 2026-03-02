import users from '../../../../testData/users.json' assert { type: 'json' };

/**
 * TC86290
 * Run in Local: npm run regression -- --xml=specs/regression/config/CustomAppSpecificOIDC.config.xml --baseUrl=https://mci-2m496-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.loginType=Custom --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=Vd9-K#1XKg0.
 */

describe('Custom app auth mode - OIDC', () => {
    const oktaUser = users['EMM_OKTA'];
    oktaUser.credentials.password = process.env.okta_password;
    const customApp = {
        specificAuthMode: {
            OIDC: {
                appId: '4F29FF17124A4BD4BB3ED11BCE2482D3',
            },
        },
    };

    let { userAccount, libraryPage, loginPage } = browsers.pageObj1;

    it('[TC86290] Validate login workflow | Login custom app when it is set to specific auth mode - OIDC', async () => {
        const {
            specificAuthMode: { OIDC },
        } = customApp;

        await libraryPage.openCustomAppById({ id: OIDC.appId, check_flag: false });
        // directly jump to OIDC login
        await loginPage.oktaLogin(oktaUser.credentials);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user name should contain Shuai')
            .expect(await userAccount.getUserName())
            .toContain('Shuai');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(OIDC.appId);
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
            .toContain(OIDC.appId);
        await libraryPage.closeUserAccountMenu();
    });
});
