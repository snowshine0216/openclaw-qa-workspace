import users from '../../../../testData/users.json' assert { type: 'json' };
/*
Run in Local: npm run regression -- --baseUrl=https://tec-l-1180984.labs.microstrategy.com/MicroStrategyLibrary/ --xml=specs/regression/config/OIDCLocalMCG.config.xml --params.loginType=okta
*/
describe('OIDC local MCG', () => {
    let { userAccount, libraryPage, loginPage, dossierPage } = browsers.pageObj1;
    const user = users['EMM_OKTA'];
    user.credentials.password = process.env.okta_password;
    const dossier = {
        name: 'Blank Dossier',
    };

    afterEach(async () => {
        await userAccount.openUserAccountMenu();
        await libraryPage.logout();
    });

    it('[TC82085_02]: Verify Library Web OIDC login in local MCG environment', async () => {
        await loginPage.oktaLogin(user.credentials);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toContain('Shuai');
        await userAccount.closeUserAccountMenu();
        await libraryPage.openDossier(dossier.name);
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['Blank Dossier', 'Chapter 1', 'Page 1']);
    });
});
