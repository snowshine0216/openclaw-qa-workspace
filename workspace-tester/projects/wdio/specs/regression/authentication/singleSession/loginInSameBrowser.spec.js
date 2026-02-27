import setWindowSize from '../../../../config/setWindowSize.js';
import users from '../../../../testData/users.json' assert { type: 'json' };

/*
Test environment: EMM team server
Base URL: https://emm.labs.microstrategy.com:3737/MicroStrategyLibrary/
Run in local: npm run wdio -- --baseUrl=https://emm.labs.microstrategy.com:3737/MicroStrategyLibrary/ --spec=specs/regression/authentication/singleSession/loginInSameBrowser.spec.js --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
 */

describe('Authentication - Single Session, login in same browser', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };
    // const user = users['sslibrary_OKTA'].credentials;
    const oktaUser = users['EMM_OKTA'];
    oktaUser.credentials.password = 'Shine1234';
    const regex = /^(https?:\/\/[^\/]+\/)/;
    const match = regex.exec(browser.options.baseUrl);
    const baseUrl = match ? match[0] : null;
    const webUrl =
        baseUrl +
        'MicroStrategy/servlet/mstrWeb?evt=2048001&src=mstrWeb.2048001&documentID=6CC0740141C579F3BF66A39009FB31FA&currentViewMedia=2&visMode=0&Server=10.23.32.199&Project=MicroStrategy%20Tutorial&Port=0&share=1';

    let { loginPage, libraryPage, biwebRsdEditablePage, userAccount } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    it('[TC92466] Check cross function cases with single session restrict flag on', async () => {
        await loginPage.samlRelogin();
        await loginPage.oktaLogin(oktaUser.credentials);
        // await libraryPage.switchToTab(1);
        await browser.url(webUrl);
        await biwebRsdEditablePage.waitForRsdLoad();
        // await since('Seamless account should be #{expected}, but we get #{actual}')
        //     .expect(await biwebRsdEditablePage.getAccountName())
        //     .toBe('Shuai');
        await browser.url(browser.options.baseUrl);
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toContain('Shuai');
        await libraryPage.logout();
    });
});
