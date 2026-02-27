import users from '../../../../testData/users.json' assert { type: 'json' };
/*
Test environment: EMM team server
Run in local: npm run regression -- --baseUrl=https://emm2.labs.microstrategy.com:6789/MicroStrategyLibrary/ --xml=specs/regression/config/SAMLPingFederateLogin.config.xml --params.loginType=Custom --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
Tomcat, Pingfederate, Local logout
*/

describe('SAML PingFederate', () => {
    const user1 = users['oidc_pingFederate'].credentials;

    // const user2 = {
    //     username: 'mowang',
    //     password: 'Test123',
    // };
    const wrongPw = 'wrong';

    const dossier = {
        name: 'Test Dossier-origin',
    };

    let { userAccount, libraryPage, pingFederateLoginPage, loginPage, dossierPage } = browsers.pageObj1;

    it('[TC83662] Validate SAML authentication on PingFederate', async () => {
        // incorrect credential
        await pingFederateLoginPage.login(user1.username, wrongPw);
        await since('Login with wrong password, error message should be #{expected}, instead we have #{actual}')
            .expect(await pingFederateLoginPage.wrongPwError())
            .toBe("We didn't recognize the username or password you entered. Please try again.");

        // login successfully
        await pingFederateLoginPage.login(user1.username, user1.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('testuser1');
        await userAccount.closeUserAccountMenu();
        // run dossier
        await libraryPage.openDossier(dossier.name);
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['Test Dossier-origin', 'Chapter 1', 'CustomViz']);

        // local logout and relogin
        await userAccount.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.samlRelogin();
        //pingfederate changes, no need to login with username and password when local logout, uncomment the step to fix automation failure
        // await pingFederateLoginPage.login(user2.username, user2.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('testuser1');
        await userAccount.closeUserAccountMenu();
    });
});
