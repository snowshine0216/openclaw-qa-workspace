import users from '../../../../testData/users.json' assert { type: 'json' };
/*
TC90295:Verify Library Web Admin page can be protected by OIDC authentication after enable OIDC and non-SSO
Test environment:
OIDC:https://emm.labs.microstrategy.com:2334/MicroStrategyLibrary/admin
okta credentials: mexia@mstrdev.com/pw****
Run in Local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:2334/MicroStrategyLibrary/admin --xml=specs/regression/config/LibraryAdminPageAzureOIDCProtected.config.xml --params.loginType=azure
*/

describe('[TC90295]: Verify Library Web Admin page can be protected by OIDC authentication after enable OIDC and non-SSO', () => {
    let { adminPage, azureLoginPage } = browsers.pageObj1;
    const azureUser = users['EMM_SAML_Azure'];
    azureUser.credentials.password = process.env.azure_password;

    it('[TC90295] Verify Library Web Admin page can be protected by OIDC authentication after enable OIDC and non-SSO', async () => {
        await azureLoginPage.loginToAzure(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await since('The page title should be #{expected}, instead we have #{actual}')
            .expect(await adminPage.getLibraryAdminText())
            .toBe('Library Admin');
    });
});
