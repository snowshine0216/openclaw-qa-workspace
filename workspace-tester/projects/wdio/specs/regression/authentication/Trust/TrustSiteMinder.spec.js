import users from '../../../../testData/users.json' assert { type: 'json' };
/*
Test environment: EMM team server
Environment URL: https://tec-w-1007022.labs.microstrategy.com:8888/libsm
Tomcat, SiteMinder

Run in Local: npm run regression -- --baseUrl=https://tec-w-1007022.labs.microstrategy.com:8888/libsm/ --xml=specs/regression/config/Authentication_TrustSiteMinder.config.xml --params.loginType=trusted
*/

describe('Trust SiteMinder', () => {
    const user1 = users['EMM_trusted_pingFederate'];

    const dossier = {
        name: 'Blank Dossier',
    };

    let userAccount, libraryPage, siteMinderLoginPage, dossierPage;

    beforeEach(async () => {
        ({ userAccount, libraryPage, siteMinderLoginPage, dossierPage } = browsers.pageObj1);
    });

    it('[TC89724] Validate Trust authentication on SiteMinder', async () => {
        // login successfully
        await siteMinderLoginPage.login(user1.credentials.username, user1.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('desparzaClient');
        await userAccount.closeUserAccountMenu();
        // run dossier
        // await libraryPage.openDossier(dossier.name);
        // await dossierPage.waitForDossierLoading();
        // await since('Dossier title should be #{expected}, instead we have #{actual}')
        //     .expect(await dossierPage.pageTitle())
        //     .toEqual(['Blank Dossier', 'Chapter 1', 'Page 1']);

        // logout
        await userAccount.openUserAccountMenu();
        await libraryPage.logout();
    });
});
