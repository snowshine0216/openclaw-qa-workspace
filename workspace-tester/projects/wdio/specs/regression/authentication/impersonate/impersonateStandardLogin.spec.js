import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';

/**
 * Run in Local: npm run regression -- --spec=specs/regression/authentication/impersonate/impersonateLogin.spec.js --baseUrl=https://mci-3mfe8-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.loginType=Custom --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=eFe9+H.KLUdP
 */

describe('impersonate user login and execute report - standard', () => {
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

    let { userAccount, libraryPage, loginPage, dossierPage } = browsers.pageObj1;

    it('[BCSA-2578_02] Validate login workflow | impersonate SSO standard user login', async () => {
        const { standardLogin } = customApp;

        const standard = standardLogin;

        await libraryPage.openCustomAppById({ id: standard.id, check_flag: false });
        await loginPage.login({ username: '_impersonate', password: 'Newman1#' });
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user name should contain _impersonate')
            .expect(await userAccount.getUserName())
            .toContain('_impersonate');
        await userAccount.closeUserAccountMenu();
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await takeScreenshot(
            'BCSA-2578_02',
            'Open Dossier - only administrator in the result according to the security filter answered by system prompt'
        );
    });
});
