import users from '../../../../testData/users.json' assert { type: 'json' };
import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';

/**
 * Run in Local: npm run regression -- --spec=specs/regression/authentication/impersonate/impersonateLogin.spec.js --baseUrl=https://mci-3mfe8-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.loginType=Custom --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=eFe9+H.KLUdP
 */

describe('impersonate user login and execute report', () => {
    const oktaUser = users['EMM_OKTA_User2'];
    oktaUser.credentials.password = process.env.okta_password;
    const dossier = {
        id: 'CB631F86BC4EA94FEC90B280EFBF30C1',
        name: 'impersonate_dossier',
        project: {
            id: '73E53B9A11EAB363B78E0080EF8506F9',
        },
    };

    let { userAccount, libraryPage, loginPage, dossierPage } = browsers.pageObj1;

    it('[BCSA-2578_01] Validate login workflow | impersonate SSO OIDC login', async () => {
        await loginPage.oktaLogin(oktaUser.credentials);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toContain('nwang');
        await userAccount.closeUserAccountMenu();
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await takeScreenshot(
            'BCSA-2578_01',
            'Open Dossier - only administrator in the result according to the security filter answered by system prompt'
        );
    });
});
