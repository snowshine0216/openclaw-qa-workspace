import users from '../../../../testData/users.json' assert { type: 'json' };
import {
    loginLibrary,
    enableServerSettings,
    disableServerSettings,
} from '../../../../api/systemprompts/SystemPromptRest.js';
/**
 * Run in Local: npm run regression -- --spec=specs/regression/authentication/impersonate/impersonateStandardLogin193Disabled.spec.js --baseUrl=https://mci-3mfe8-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.loginType=Custom --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=eFe9+H.KLUdP
 */

describe('impersonate user login and execute report - standard - 193 settings disabled', () => {
    const baseUrl = browser.options.baseUrl;
    const adminUser = users['3mfe8_admin'];
    const customApp = {
        standardLogin: {
            id: 'FBD06A16141E4D31BAEB24F5695C36E2',
        },
    };
    const dossier = {
        id: 'CB631F86BC4EA94FEC90B280EFBF30C1',
        name: 'impersonate_dossier',
        project: {
            id: '73E53B9A11EAB363B78E0080EF8506F9',
        },
    };

    let { libraryPage, loginPage } = browsers.pageObj1;

    afterAll(async () => {
        await enableServerSettings(baseUrl, 'standard');
    });
    it('[BCSA-2578_06] Validate login workflow | impersonate SSO standard user login', async () => {
        await loginLibrary(baseUrl, adminUser.credentials.username, adminUser.credentials.password);
        console.log('✅ Admin login successful');
        await disableServerSettings(baseUrl, 'standard');
        console.log('✅ Server settings disabled');
        const { standardLogin } = customApp;

        const standard = standardLogin;

        await libraryPage.openCustomAppById({ id: standard.id, check_flag: false });
        await loginPage.login({ username: '_impersonate', password: 'Newman1#' });
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openDossier(dossier.name);
        await libraryPage.sleep(5000);
        await libraryPage.viewErrorDetails();
        await since('attribute cannot be resolved error should as #{expected}, instead we have #{actual}')
            .expect(await libraryPage.errorDetails())
            .toContain('SSO Text Attribute 8 can not be resolved');
        await libraryPage.dismissErrorByText('OK');
    });
});
