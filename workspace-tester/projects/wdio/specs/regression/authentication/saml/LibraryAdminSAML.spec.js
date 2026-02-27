/*
Test environment:
Run in local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:8989/MicroStrategyLibrary/ --xml=specs/regression/config/AdminSAML.config.xml --params.loginType=okta --params.credentials.webServerUsername=sxiong@microstrategy.com --params.credentials.webServerPassword=****

npm run regression -- --baseUrl=https://emm1.labs.microstrategy.com:7443/MicroStrategyLibrary/ --xml=specs/regression/config/AdminSAML.config.xml --params.loginType=azure --params.credentials.webServerUsername=mexia@mstrdev.com --params.credentials.webServerPassword=****
 */
import users from '../../../../testData/users.json' assert { type: 'json' };
import { buildAdminUrl } from '../../../../utils/index.js';
describe('Admin page - Okta', () => {
    let { adminPage, loginPage, azureLoginPage } = browsers.pageObj1;
    const user = users['EMM_OKTA'];
    user.credentials.password = process.env.okta_password;
    // user.credentials.password = 'Shine1234';
    const adminUrl = buildAdminUrl();

    it('[TC79618] Validate Library admin page is protected by SAML authentication after enable SAML', async () => {
        await browser.url(adminUrl);
        if (browsers.params.loginType === 'okta') {
            await loginPage.oktaLogin(user.credentials);
            await adminPage.waitForDynamicElementLoading();
        } else if (browsers.params.loginType === 'azure') {
            await azureLoginPage.loginToAzure(browsers.params.credentials.webServerUsername);
            await azureLoginPage.loginWithPassword(browsers.params.credentials.webServerPassword);
            await azureLoginPage.safeContinueAzureLogin();
            await loginPage.waitForDynamicElementLoading();
        }
        await since('The page title should be #{expected}, instead we have #{actual}')
            .expect(await adminPage.getLibraryAdminText())
            .toBe('Library Admin');
    });
});
