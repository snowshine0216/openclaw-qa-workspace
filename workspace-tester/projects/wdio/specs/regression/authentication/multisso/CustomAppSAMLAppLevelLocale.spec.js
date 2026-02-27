import users from '../../../../testData/users.json' assert { type: 'json' };
import locales from '../../../../testData/locales.json' assert { type: 'json' };
import setUserLanguage from '../../../../api/setUserLanguage.js';

/**
 * BCSA-3078
 * Run in Local: npm run regression -- --xml=specs/regression/config/MultiSSO_Locale.config.xml --baseUrl=https://mci-3mfe8-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.loginType=Custom
 */

describe('Multi SSO Custom app auth mode - SAML - app level - language', () => {
    const baseUrl = 'https://mci-3mfe8-dev.hypernow.microstrategy.com/MicroStrategyLibrary/';
    const oktaUser = users['EMM_OKTA_User3'];
    oktaUser.credentials.password = process.env.okta_password;
    const admin = users['3mfe8_admin'];

    const customApp = {
        SAMLLocaleAppLevelRegistration: {
            name: 'auto_SAML_Locale',
            id: '850F39549F44483D8093E174E156A472',
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

    it('[BCSA-3078_1] Validate Library SAML Login with Locale', async () => {
        const { SAMLLocaleAppLevelRegistration } = customApp;
        const SAML = SAMLLocaleAppLevelRegistration;

        await libraryPage.openCustomAppById({ id: SAML.id, check_flag: false });
        await libraryPage.waitForLibraryLoading();

        await loginPage.samlRelogin();
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
