import { dossier } from '../../../../constants/teams.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';

/**
 * TC95178
 * Run in Local: npm run regression -- --xml=specs/regression/config/MultiSSO_CustomApp.config.xml --baseUrl=https://mci-cainb-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.loginType=Custom --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=eFe9+H.KLUdP
 */

describe('Multi SSO Custom app auth mode - OIDC - app level', () => {
    const oktaUser = users['EMM_OKTA'];
    oktaUser.credentials.password = process.env.okta_password;
    const customApp = {
        OIDCAppLevelRegistration: {
            id: '21761DA41A3C4791BFBC1E3A579D91C9',
        },
        DossierAsHomeScreen_OIDCAppLevelRegistration: {
            id: '69F991E6E2BC4627888394B3EA013CC7',
        },
        StandardDefault_OIDCAppLevelRegistration: {
            id: '93F5388803334099A18C251EECB6E8AB',
        },
    };

    const shareDossierLink =
        'https://mci-cainb-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/config/69F991E6E2BC4627888394B3EA013CC7/73E53B9A11EAB363B78E0080EF8506F9/D6B65862BF4B8C15367BBB997257C3CF/share';

    let { userAccount, libraryPage, loginPage, dossierPage, toc } = browsers.pageObj1;

    it('[TC95178_1] Validate login workflow | Multi SSO | Single Auth | Login custom app with OIDC specific registration', async () => {
        const { OIDCAppLevelRegistration } = customApp;

        const OIDC = OIDCAppLevelRegistration;

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

    it('[TC95178_2] Validate login workflow | Multi SSO | Multi Auth | Login custom app with Standard + OIDC specific registration', async () => {
        const { StandardDefault_OIDCAppLevelRegistration } = customApp;

        const OIDC = StandardDefault_OIDCAppLevelRegistration;

        await libraryPage.openCustomAppById({ id: OIDC.id, check_flag: false });

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

    it('[TC95178_3] Validate login workflow | Multi SSO | Single Auth | Login custom app (dossier as home) with OIDC specific registration', async () => {
        const { DossierAsHomeScreen_OIDCAppLevelRegistration } = customApp;

        const OIDC = DossierAsHomeScreen_OIDCAppLevelRegistration;

        await libraryPage.openCustomAppById({ id: OIDC.id, check_flag: false });
        await dossierPage.waitForDossierLoading();
        await toc.openMenu();
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
        await dossierPage.waitForPageLoading();
        await toc.openMenu();
        await userAccount.openUserAccountMenu();
        await since('The user name should contain Shuai')
            .expect(await userAccount.getUserName())
            .toContain('Shuai');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(OIDC.id);
        await libraryPage.logout();

        await since('Login page is displayed = ')
            .expect(await loginPage.isLoginPageDisplayed())
            .toEqual(true);
        await since('OIDC login button is displayed = ')
            .expect(await loginPage.isOIDCLoginButtonDisplayed())
            .toEqual(true);
    });

    it('[TC95178_4] Validate login workflow | Multi SSO | Single Auth | Login dossier share link with OIDC specific registration', async () => {
        const { DossierAsHomeScreen_OIDCAppLevelRegistration } = customApp;

        const OIDC = DossierAsHomeScreen_OIDCAppLevelRegistration;

        await browser.url(shareDossierLink, 60000);

        await dossierPage.waitForPageLoading();
        await toc.openMenu();
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
        await dossierPage.waitForPageLoading();
        await toc.openMenu();
        await userAccount.openUserAccountMenu();
        await since('The user name should contain Shuai')
            .expect(await userAccount.getUserName())
            .toContain('Shuai');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(OIDC.id);
        await libraryPage.logout();
    });
});
