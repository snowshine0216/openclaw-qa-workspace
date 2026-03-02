/*
Test environment: EMM team server
Run in local: npm run regression -- --baseUrl=https://emm2.labs.microstrategy.com:5284/MicroStrategyLibrary/ --xml=specs/regression/config/SAMLPingFederateGlobalLogout.config.xml --params.loginType=ping --params.credentials.webServerUsername=mowang --params.credentials.webServerPassword=Test123
Tomcat, Pingfederate, Global logout
*/
import { buildMSTRWebUrl } from '../../../../utils/index.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
import ERROR_MAP from '../../../../utils/ErrorMsg.js';

describe('SAML PingFederate Global Logout', () => {
    const user1 = users['oidc_pingFederate'].credentials;

    const user2 = {
        username: 'adminuser@microstrategy.com',
        password: process.env.adminuser_password,
    };

    let config = {
        dossierAsHome: 'AC22810FEEAF4F64A022991DF94EDC39',
    };

    const webUrl = buildMSTRWebUrl();
    let { userAccount, libraryPage, pingFederateLoginPage, loginPage, dossierPage } = browsers.pageObj1;

    it('[TC83661] Verify SAML Single logout on Library Web - Tomcat&PingFederate', async () => {
        // open MSTR Web and login
        await browser.url(webUrl);
        await pingFederateLoginPage.login(user2.username, user2.password);
        await loginPage.waitForMSTRProjectListAppear();
        // login successfully
        await libraryPage.executeScript('window.open()');
        await libraryPage.switchToNewWindow();
        await browser.url(browser.options.baseUrl);
        // pingfederate changes, no need to login with username and password again, uncomment the step to fix automation failure
        // await pingFederateLoginPage.login(user1.username, user1.password);
        await libraryPage.waitForLibraryLoading();
        // logout from Library
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('adminuser@microstrategy.com');
        await libraryPage.logout();
        // check MSTR Web also logout automatically
        await libraryPage.switchToTab(0);
        await libraryPage.reload();
        await since('MSTR Web should also logout')
            .expect(await pingFederateLoginPage.getLoginPageTitle())
            .toBe('Sign On');
        // Library need relogin
        await libraryPage.switchToTab(1);
        await libraryPage.closeTab(0);
        await loginPage.samlRelogin();
        await since('Login Page shows')
            .expect(await pingFederateLoginPage.getLoginPageTitle())
            .toBe('Sign On');
    });

    it('[TC83694] Verify SAML Single logout on Library Web when custom app', async () => {
        try {
            await libraryPage.openCustomAppById({ id: config.dossierAsHome, check_flag: false });

            // login successfully
            await pingFederateLoginPage.login(user1.username, user1.password);
            await dossierPage.waitForDossierLoading();
            // open MSTR Web and login
            await libraryPage.executeScript('window.open()');
            await libraryPage.switchToNewWindow();
            await browser.url(webUrl);
            // pingfederate changes, no need to login with username and password again, uncomment the step to fix automation failure
            // await pingFederateLoginPage.login(user2.username, user2.password);
            await loginPage.waitForMSTRProjectListAppear();
            // logout from Library and relogin,should stay in custom app
            await libraryPage.switchToTab(0);
            await userAccount.openUserAccountMenu();
            await since('The user should be #{expected}, instead we have #{actual}')
                .expect(await userAccount.getUserName())
                .toBe('testuser1');
            await dossierPage.logout();
            await loginPage.samlRelogin();
            await pingFederateLoginPage.login(user1.username, user1.password);
            // await dossierPage.waitForDossierLoading();
            // await since('Dossier title should be #{expected}, instead we have #{actual}')
            //     .expect(await dossierPage.pageTitle())
            //     .toEqual(['android_test_dossier', 'Chapter 1', 'Page 1']);
            // check MSTR Web also logout automatically
            await libraryPage.switchToTab(1);
            await libraryPage.reload();
            await since('MSTR Web not need to relogin')
                .expect(await pingFederateLoginPage.isPingHeaderPresent())
                .toBe(false);
            await libraryPage.closeTab(1);
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC85553: ', e.message);
                return;
            }
            throw e;
        }
    });
});
