import users from '../../../../testData/users.json' assert { type: 'json' };
/*
TC75976:Verify Library Web Admin page is protected by Basic/OIDC authentication after enable OIDCid_token- with "offline_access", use "id_token"- with "offline_access", use "id_token"with "offline_access", use "id_token"
Test environment:
OIDC:https://emm.labs.microstrategy.com:1011/MicroStrategyLibrary/admin
okta credentials: sxiong@microstrategy.com/pwd****
Run in Local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:1011/MicroStrategyLibrary/admin --xml=specs/regression/config/LibraryAdminPageAuthenticationOIDC.config.xml --params.loginType=okta
 */

describe('[TC75976]: Verify Library Web Admin page is protected by OIDC authentication after enable OIDCid_token- with "offline_access", use "id_token"- with "offline_access", use "id_token"with "offline_access", use "id_token"', () => {
    let { adminPage, loginPage } = browsers.pageObj1;
    const user = users['EMM_OKTA'];
    user.credentials.password = process.env.okta_password;

    it('[TC75976]: Verify OIDC authentication', async () => {
        await loginPage.oktaLogin(user.credentials);
        await since('The page title should be #{expected}, instead we have #{actual}')
            .expect(await adminPage.getLibraryAdminText())
            .toBe('Library Admin');
    });
});
