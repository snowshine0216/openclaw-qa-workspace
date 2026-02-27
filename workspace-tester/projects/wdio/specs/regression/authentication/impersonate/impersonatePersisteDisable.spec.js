import users from '../../../../testData/users.json' assert { type: 'json' };
import {
    loginLibrary,
    enableServerSettings,
    disableServerSettings,
} from '../../../../api/systemprompts/SystemPromptRest.js';

/**
 * Run in Local: npm run regression -- --spec=specs/regression/authentication/impersonate/impersonatePersisteDisable.spec.js --baseUrl=https://mci-3mfe8-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.loginType=Custom --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=eFe9+H.KLUdP
 */

describe('impersonate user login and execute report - SSO login 192 disabled', () => {
    const oktaUser = users['EMM_OKTA_User2'];
    const baseUrl = browser.options.baseUrl;
    oktaUser.credentials.password = process.env.okta_password;
    const adminUser = users['3mfe8_admin'];
    const dossier = {
        id: 'CB631F86BC4EA94FEC90B280EFBF30C1',
        name: 'impersonate_dossier',
        project: {
            id: '73E53B9A11EAB363B78E0080EF8506F9',
        },
    };

    let { libraryPage, loginPage } = browsers.pageObj1;

    afterAll(async () => {
        await enableServerSettings(baseUrl);
    });

    it('[BCSA-2578_03] Validate login workflow | impersonate SSO OIDC login - disable iserver setting', async () => {
        await loginLibrary(baseUrl, adminUser.credentials.username, adminUser.credentials.password);
        console.log('✅ Admin login successful');
        await disableServerSettings(baseUrl);
        console.log('✅ Server settings disabled');
        await loginPage.oktaLogin(oktaUser.credentials);
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
