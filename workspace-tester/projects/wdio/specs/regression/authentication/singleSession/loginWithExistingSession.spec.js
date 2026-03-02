import authentication from '../../../../api/authentication.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import logout from '../../../../api/logout.js';
/*
Test environment: EMM team server
Base URL: https://emm.labs.microstrategy.com:3737/MicroStrategyLibrary/
Run in local: npm run wdio -- --baseUrl=https://emm.labs.microstrategy.com:3737/MicroStrategyLibrary/ --spec=specs/regression/authentication/singleSession/loginWithExistingSession.spec.js --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
 */

describe('Authentication - Single Session login failure', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const user = users['api_OKTA'].credentials;

    let { loginPage, biwebRsdEditablePage, adminPage } = browsers.pageObj1;
    let url = browser.options.baseUrl;
    const regex = /^(https?:\/\/[^\/]+\/)/;
    const match = regex.exec(url);
    const baseUrl = match ? match[0] : null;
    const webUrl = baseUrl + 'MicroStrategy';

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    it('[TC92450] Check error handling UI with single session restrict flag on', async () => {
        const authenticationResult = await authentication({
            baseUrl: url,
            authMode: 1,
            credentials: user,
        });
        await loginPage.samlRelogin();
        await loginPage.basicOktaLogin(user);
        await loginPage.waitForLoginErrorBox();
        await takeScreenshot('TC92450_01', 'SingleSession Error Message in Library login page');
        await browser.url(webUrl);
        await biwebRsdEditablePage.waitForErrorMessage();
        await takeScreenshot('TC92450_02', 'SingleSession Error Message in Web login page');
        await adminPage.openAdminPage();
        await adminPage.chooseTab('Library Server');
        await adminPage.clickDeleteTrustedButton();
        await adminPage.loginInLoginPopupDialog(user.username, user.password);
        await adminPage.clickLoginInLoginPopupDialog();
        await since('The error message should be #{expected}, instead we have #{actual}')
            .expect(await adminPage.getAlertMessage())
            .toContain(
                '(Session Exists. To log in, you need to log out of your previous session. Your previous session is still open on another device.)'
            );
        await logout({
            baseUrl: url,
            session: authenticationResult,
        });
    });
});
