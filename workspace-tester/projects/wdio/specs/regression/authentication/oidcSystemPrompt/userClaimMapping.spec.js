import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
/*
TC96782: Verify Library Web OIDC Authentication - KeyCloak"
Run in Local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:6198/MicroStrategyLibrary/ --spec=specs/regression/authentication/oidcSystemPrompt/userClaimMapping.spec.js  --params.loginType=Custom
 */

describe('E2E Library of OIDC Azure', () => {
    const user = users['autoUser'];
    const user2 = users['auto2User'];

    const dossier = {
        id: '9C96D0044015C8B24F8A6590CDA82953',
        name: 'customer_age',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document = {
        id: 'DF455FB0477CDB94C2C412845C14FE4E',
        name: 'customer_shipdate',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const report = {
        id: 'E67CD438406223B857CF66BD648A08C6',
        name: 'customer_report',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { userAccount, libraryPage, keycloakLoginPage, dossierPage, loginPage } = browsers.pageObj1;

    afterEach(async () => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
    });

    it('[TC96783] check text and numeric system prompt with dossier', async () => {
        await loginPage.oidcRelogin();
        await keycloakLoginPage.login(user.credentials.username, user.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Keycloak Auto');
        await userAccount.closeUserAccountMenu();
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC96783', 'Open Dossier age&gender >=63 female');
    });

    it('[TC97681] switch user - no filter on age and gender', async () => {
        await loginPage.oidcRelogin();
        await keycloakLoginPage.login(user2.credentials.username, user2.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('auto2 keycloak');
        await userAccount.closeUserAccountMenu();
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC97681', 'Open Dossier age&gender - no security filter');
    });

    it('[TC97682] check date system prompt with document', async () => {
        await loginPage.oidcRelogin();
        await keycloakLoginPage.login(user2.credentials.username, user2.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('auto2 keycloak');
        await userAccount.closeUserAccountMenu();
        await libraryPage.openDocumentNoWait(document.name);
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC97682', 'Open document with date system prompt security filter >=2014-02-18');
    });

    it('[TC97685] check date system prompt with document - not in group', async () => {
        await loginPage.oidcRelogin();
        await keycloakLoginPage.login(user.credentials.username, user.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Keycloak Auto');
        await userAccount.closeUserAccountMenu();
        await libraryPage.openDocumentNoWait(document.name);
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC97685', 'Open document - no in security filter group');
    });

    it('[TC97686] check system prompt with report filter', async () => {
        await loginPage.oidcRelogin();
        await keycloakLoginPage.login(user.credentials.username, user.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Keycloak Auto');
        await userAccount.closeUserAccountMenu();
        await libraryPage.openReportNoWait(report.name);
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC97686', 'Open report with filter - name');
    });

    it('[TC97687] check system prompt with report filter - change user', async () => {
        await loginPage.oidcRelogin();
        await keycloakLoginPage.login(user2.credentials.username, user2.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('auto2 keycloak');
        await userAccount.closeUserAccountMenu();
        await libraryPage.openReportNoWait(report.name);
        await dossierPage.waitForDossierLoading();
        await takeScreenshot('TC97687', 'Open report with filter - change user - name');
    });
});
