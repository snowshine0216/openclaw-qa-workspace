import users from '../../../../testData/users.json' assert { type: 'json' };
import locales from '../../../../testData/locales.json' assert { type: 'json' };
import setUserLanguage from '../../../../api/setUserLanguage.js';

/**
 * BCSA-3331
 * Run in Local: npm run regression -- --xml=specs/regression/config/MultiSSO_Locale.config.xml --baseUrl=https://mci-3mfe8-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.loginType=Custom
 */

describe('Multi SSO Custom app auth mode - OIDC - app level - language', () => {
    const baseUrl = 'https://mci-3mfe8-dev.hypernow.microstrategy.com/MicroStrategyLibrary/';
    const oktaUser = users['EMM_OKTA_User3'];
    oktaUser.credentials.password = process.env.okta_password;
    const admin = users['3mfe8_admin'];

    const customApp = {
        OIDCLocaleAppLevelRegistration: {
            name: 'auto_OIDC_Locale',
            id: 'D1D1B47BA2494C2890ADAC47CB62C65F',
        },
    };

    let { libraryPage, loginPage, userPreference } = browsers.pageObj1;

    beforeAll(async () => {
        await setUserLanguage({
            baseUrl: baseUrl,
            adminCredentials: admin.credentials,
            userId: oktaUser.id,
            localeId: locales.default,
        });
    });

    afterAll(async () => {
        await setUserLanguage({
            baseUrl: baseUrl,
            adminCredentials: admin.credentials,
            userId: oktaUser.id,
            localeId: locales.default,
        });
    });

    it('[BCSA-3331_1] Validate Library OIDC Login with Locale', async () => {
        const { OIDCLocaleAppLevelRegistration } = customApp;
        const OIDC = OIDCLocaleAppLevelRegistration;

        await libraryPage.openCustomAppById({ id: OIDC.id, check_flag: false });
        await libraryPage.waitForLibraryLoading();

        await loginPage.oidcRelogin();
        await loginPage.oktaLogin(oktaUser.credentials);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();

        await libraryPage.openPreferencePanel();
        await since('Language should be #{expected}, while we got #{actual}')
            .expect(await userPreference.selectedPreference('My Language'))
            .toBe('English (United States)');
        await libraryPage.logout();
    });
});
