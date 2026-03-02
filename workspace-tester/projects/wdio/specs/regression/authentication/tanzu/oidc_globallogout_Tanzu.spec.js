import users from '../../../../testData/users.json' assert { type: 'json' };

describe('OIDC Azure Global Logout', () => {
    const user1 = users['EMM_SAML_Azure'].credentials;
    user1.password = process.env.azure_password;
    let config = {
        id: 'D82F0DE3604C430CB334518A77E6C970',
        name: 'OIDCGlobalLogout',
    };

    let { userAccount, libraryPage, azureLoginPage, loginPage } = browsers.pageObj1;

    it('[TC89470][Tanzu] Library Web - Verify Library Web OIDC Global Logout', async () => {
        //login successfully
        await libraryPage.openCustomAppById({ id: config.id, check_flag: false });
        await azureLoginPage.loginToAzure(user1.username);
        await azureLoginPage.clickMSLogo();
        await azureLoginPage.waitForElementVisible(await azureLoginPage.getPasswordInput());
        await browser.pause(5000);
        await azureLoginPage.loginWithPassword(user1.password);
        await azureLoginPage.continueAzureLogin();
        await libraryPage.waitForLibraryLoading();

        // global logout and relogin with credential
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toContain('Menglu Xia');
        await libraryPage.logout({ SSO: true });
        await azureLoginPage.logoutExistingUser(user1.username);
        await browser.pause(10000);
        await since('OIDC login button display should be #{expected}, instead we have #{actual}')
            .expect(await loginPage.isOIDCLoginButtonDisplayed())
            .toBe(true);
        await loginPage.oidcRelogin();
        await azureLoginPage.loginExistingUser(user1.username);
        await azureLoginPage.loginWithPassword(user1.password);
        await azureLoginPage.safeContinueAzureLogin();
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toContain('Menglu Xia');
        await libraryPage.logout({ SSO: true });
        await azureLoginPage.logoutExistingUser(user1.username);
    });
});
