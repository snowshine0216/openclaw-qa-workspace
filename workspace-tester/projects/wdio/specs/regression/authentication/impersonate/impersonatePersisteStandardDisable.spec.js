import users from '../../../../testData/users.json' assert { type: 'json' };
import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import {
    loginLibrary,
    enableServerSettings,
    disableServerSettings,
} from '../../../../api/systemprompts/SystemPromptRest.js';

/**
 * Run in Local: npm run regression -- --spec=specs/regression/authentication/impersonate/impersonatePersisteStandardDisable.spec.js --baseUrl=https://mci-3mfe8-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.loginType=Custom --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=eFe9+H.KLUdP
 */

describe('impersonate user login and execute report - SSO login 193 disabled', () => {
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

    let { libraryPage, loginPage, dossierPage } = browsers.pageObj1;

    afterAll(async () => {
        await enableServerSettings(baseUrl, 'standard');
    });

    it('[BCSA-2578_04] Validate login workflow | impersonate SSO OIDC login - disable iserver standard persist sso setting', async () => {
        await loginLibrary(baseUrl, adminUser.credentials.username, adminUser.credentials.password);
        console.log('✅ Admin login successful');
        await disableServerSettings(baseUrl, 'standard');
        await loginPage.oktaLogin(oktaUser.credentials);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await takeScreenshot(
            'BCSA-2578_04',
            'Open Dossier - no impact on SSO login after disabling standard persist SSO setting'
        );
    });
});
