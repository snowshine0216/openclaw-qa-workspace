import users from '../../../../testData/users.json' assert { type: 'json' };
/*
TC75973:Verify Library Web OIDC login with user who has no web privilege
Test environment https://emm1.labs.microstrategy.com:1011/MicroStrategyLibrary
admin credetials: mstr/mstr123

Run in Local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:1011/MicroStrategyLibrary/ --xml=specs/regression/config/AuthenticationsForOIDC_WithoutPrivilege.config.xml --params.loginType=okta
*/
describe('[TC75973]: Verify Library Web OIDC login with user who has no web privilege', () => {
    let { loginPage } = browsers.pageObj1;
    const user = users['okta_nopri'];
    user.credentials.password = process.env.webnopriv_password;

    it('[TC75973]: Verify Library Web OIDC login with user who has no web privilege - Jboss', async () => {
        await loginPage.oktaLogin(user.credentials);
        await since('Preference Button text is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await loginPage.loginErrorMessage())
            .toBe('You do not have privilege to perform this action.');
    });
});
