// run command in local machine: npm run regression -- --xml=specs/regression/config/Authentication_Tanzu_SAML.config.xml --baseUrl=https://mci-9ahb2-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.loginType=custom --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=L7erb4.DWtLy
import users from '../../../../testData/users.json' assert { type: 'json' };
describe('SAML Azure', () => {
    const user = users['EMM_SAML_Azure'].credentials;
    user.password = process.env.azure_password;
    const wrongPw = 'mexia';

    const dossier = {
        name: 'Test Dossier',
    };

    let { userAccount, libraryPage, azureLoginPage, dossierPage, loginPage } = browsers.pageObj1;

    it('[TC80233] [Tanzu] Library Web - SAML Authentication', async () => {
        await azureLoginPage.loginToAzure(user.username);
        await azureLoginPage.loginWithPassword(user.password);
        await azureLoginPage.continueAzureLogin();
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Menglu Xia');
        await userAccount.closeUserAccountMenu();
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['Test Dossier', 'Chapter 1', 'CustomViz']);
        await userAccount.openUserAccountMenu();
        await libraryPage.logout();
        await since('Login page is displayed = ')
            .expect(await loginPage.isLoginPageDisplayed())
            .toEqual(true);
    });
});
