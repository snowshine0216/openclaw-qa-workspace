import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
/*
TC96782: Verify Library Web OIDC Authentication - KeyCloak"
Run in Local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:6198/MicroStrategyLibrary/ --spec=specs/regression/authentication/oidcSystemPrompt/userClaimMapping.spec.js  --params.loginType=Custom
 */

describe('E2E Library of OIDC Keycloak error handling case', () => {
    const user = users['autoError'];

    const dossier = {
        id: '9C96D0044015C8B24F8A6590CDA82953',
        name: 'customer_age',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { userAccount, libraryPage, keycloakLoginPage, loginPage } = browsers.pageObj1;

    afterEach(async () => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
    });

    it('[TC96784] Verify error handling of OIDC user claim mapping and user group', async () => {
        await loginPage.oidcRelogin();
        await keycloakLoginPage.login(user.credentials.username, user.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('error keycloak');
        await userAccount.closeUserAccountMenu();
        await libraryPage.openDossier(dossier.name);
        await libraryPage.viewErrorDetails();
        await takeScreenshot('TC96783', 'Open Dossier  with error');
        await libraryPage.dismissErrorByText('OK');
    });
});
