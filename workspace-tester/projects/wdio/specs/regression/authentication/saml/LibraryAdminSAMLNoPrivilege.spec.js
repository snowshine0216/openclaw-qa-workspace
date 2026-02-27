/*
Test environment:
Run in local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:8989/MicroStrategyLibrary/ --xml=specs/regression/config/AdminSAMLNoPrivilege.config.xml --params.loginType=okta --params.credentials.username=nwang@microstrategy.com --params.credentials.password=Newman1# --params.credentials.webServerUsername=sxiong@microstrategy.com --params.credentials.webServerPassword=****
okta credentials: nwang@microstrategy.com/Newman1#
*/
import { buildAdminUrl } from '../../../../utils/index.js';
describe('Admin page - Okta no privilege', () => {
    let { adminPage, loginPage } = browsers.pageObj1;
    const adminUrl = buildAdminUrl();

    it('[TC79620] Validate Library admin page is not accessible for non-privilege user after enable SAML', async () => {
        await browser.url(adminUrl);
        await loginPage.oktaLogin({
            username: browsers.params.credentials.username,
            password: browsers.params.credentials.password,
        });
        await adminPage.waitForDynamicElementLoading();
        await since('The error message should be #{expected}, instead we have #{actual}')
            .expect(await adminPage.getForbiddenMessage())
            .toContain('Forbidden');
    });
});
