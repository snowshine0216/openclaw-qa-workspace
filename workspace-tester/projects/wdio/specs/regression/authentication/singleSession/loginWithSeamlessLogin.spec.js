import setWindowSize from '../../../../config/setWindowSize.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
/*
Test environment: EMM team server
Base URL: https://emm.labs.microstrategy.com:3737/MicroStrategyLibrary/
Run in local: npm run wdio -- --baseUrl=https://emm.labs.microstrategy.com:3737/MicroStrategyLibrary/ --spec=specs/regression/authentication/singleSession/loginWithSeamlessLogin.spec.js --params.loginType=Custom --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
 */

describe('Authentication - Single Session, login in same browser seamless login', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const RSD = {
        name: 'documentA',
    };
    const user = users['ssweb_OKTA'].credentials;

    let { userAccount, libraryPage, loginPage, infoWindow, biwebRsdEditablePage } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    it('[TC93547] Check login successful with single session restrict flag on', async () => {
        await loginPage.samlRelogin();
        await loginPage.oktaLogin(user);
        await libraryPage.openDossierInfoWindow(RSD.name);
        await since('The presence of edit button is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isEditIconPresent())
            .toBe(true);
        await infoWindow.clickEditButton();
        await libraryPage.switchToTab(1);
        await biwebRsdEditablePage.waitForRsdLoad();
        await since('Current RSD should be #{expected}, but we get #{actual}')
            .expect(await biwebRsdEditablePage.getDocName())
            .toBe(RSD.name);
        await since('Seamless account should be #{expected}, but we get #{actual}')
            .expect(await biwebRsdEditablePage.getAccountName())
            .toBe('web');
        await libraryPage.closeTab(1);
        await infoWindow.close();
        await userAccount.openUserAccountMenu();
        await libraryPage.logout();
    });
});
