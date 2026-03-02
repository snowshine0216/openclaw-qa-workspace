import users from '../../../../testData/users.json' assert { type: 'json' };
/*
Test environment: EMM team server
Environment URL: https://tec-l-1028813.labs.microstrategy.com:8093/MicroStrategyLibrary
Tomcat, Pingfederate

Run in Local: npm run regression -- --baseUrl=https://tec-l-1028813.labs.microstrategy.com:8093/MicroStrategyLibrary/ --xml=specs/regression/config/Authentication_TrustPing.config.xml --params.credentials.username=desparzaclient --params.credentials.password=!1qaz --params.credentials.webServerUsername=admin --params.credentials.webServerPassword="" --params.loginType=Custom
*/

describe('Trust PingFederate', () => {
    const user1 = users['EMM_trusted_pingFederate'];

    const dossier = {
        name: 'Blank Dossier',
    };

    let userAccount, libraryPage, pingFederateLoginPage, dossierPage;

    beforeEach(async () => {
        ({ userAccount, libraryPage, pingFederateLoginPage, dossierPage } = browsers.pageObj1);
    });

    it('[TC72260] Validate Trust authentication on PingFederate', async () => {
        // login successfully
        await pingFederateLoginPage.login(user1.credentials.username, user1.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('desparzaClient');
        await userAccount.closeUserAccountMenu();
        // run dossier
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['Blank Dossier', 'Chapter 1', 'Page 1']);

        // logout
        await userAccount.openUserAccountMenu();
        await libraryPage.logout();
    });
});
