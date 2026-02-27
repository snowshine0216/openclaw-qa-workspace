import users from '../../../../testData/users.json' assert { type: 'json' };

/*
TC76796:Verify non-admin user cannot access Library Web Admin page by OIDC authentication
Test environment:
OIDC:https://emm.labs.microstrategy.com:1011/MicroStrategyLibrary/admin
Run in Local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:1011/MicroStrategyLibrary/admin --xml=specs/regression/config/LibraryAdminPageAuthenticationOIDCNoPrivilege.config.xml --params.loginType=okta
 */

describe('[TC76796]: Verify non-admin user cannot access Library Web Admin page by OIDC authentication', () => {
    let { adminPage, loginPage } = browsers.pageObj1;
    const user = users['okta_nopri'];
    user.credentials.password = process.env.webnopriv_password;

    it('[TC76796]: Verify non-admin user cannot access Library Web Admin page by OIDC authentication', async () => {
        await loginPage.oktaLogin(user.credentials);
        await since('The error message should be #{expected}, instead we have #{actual}')
            .expect(await adminPage.getForbiddenMessage())
            .toContain('Forbidden');
    });
});
