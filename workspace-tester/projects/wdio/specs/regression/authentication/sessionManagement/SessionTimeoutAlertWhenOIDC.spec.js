import users from '../../../../testData/users.json' assert { type: 'json' };
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
/*
 * Test environment: https://emm.labs.microstrategy.com:2334/MicroStrategyLibrary/
Run in Local: npm run regression -- --xml=specs/regression/config/Authentication_SessionTimeoutOIDC.config.xml --baseUrl=https://emm.labs.microstrategy.com:2334/MicroStrategyLibrary/ --params.credentials.webServerUsername=mexia@mstrdev.com --params.credentials.webServerPassword=**** --params.loginType=azure
*/
describe('Session Timeout OIDC Alert and Blur', () => {
    const azureUser = users['EMM_SAML_Azure'];
    azureUser.credentials.password = process.env.azure_password;
    let { libraryPage, loginPage, azureLoginPage } = browsers.pageObj1;

    it('[TC97817] Login as OIDC, features.sessionTimeoutNotificationForSSO = true, session timeout, show alert', async () => {
        await loginPage.login(azureUser, { mode: 'oidc' });
        await azureLoginPage.loginToAzure(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await libraryPage.waitForItemLoading();
        await since('The background is not blurred')
            .expect(await libraryPage.isBackgroundBlurred())
            .toBe(false);
        await browser.pause(240000);
        await since('Session timeout alert should be displayed')
            .expect(await libraryPage.isSessionTimeoutAlertDisplayed())
            .toBe(true);
        await takeScreenshotByElement(await libraryPage.getMessageBoxContainer(), 'TC97817', 'Sesion Timeout Alert');
        await since('The background should be blurred')
            .expect(await libraryPage.isBackgroundBlurred())
            .toBe(true);
        await loginPage.clickLoginButtonInSessionTimeoutAlert();
        // if SAML/OIDC is default auth mode, after click login button, it will directly login
        // if standard auth mode is default, it will redirect to login page, this server is standard default
        await loginPage.waitForLoginView();
    });
});
