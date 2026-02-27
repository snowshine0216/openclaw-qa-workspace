import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
import ERROR_MAP from '../../../../utils/ErrorMsg.js';
/*
Test environment: EMM team server
Run in local: npm run regression -- --baseUrl=https://emm2.labs.microstrategy.com:6363/MicroStrategyLibrary/ --xml=specs/regression/config/SAMLOktaGlobalLogout.config.xml --params.loginType=Custom --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
Weblogic, Okta, Global logout
*/

describe('SAML Okta Global Logout', () => {
    const dossier = {
        id: '05889D344A9BD9AE4CF019BBA63989FA',
        name: 'android_test_dossier',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const oktaUser = users['EMM_OKTA'];
    oktaUser.credentials.password = process.env.okta_password;

    let { userAccount, libraryPage, loginPage, dossierPage } = browsers.pageObj1;

    it('[TC82421] Verify SAML Single logout on Library Web - WebLogic&Okta', async () => {
        try {
            // login
            await browser.url(browser.options.baseUrl);
            await loginPage.oktaLogin(oktaUser.credentials);
            await libraryPage.waitForLibraryLoading();
            // run dossier
            await libraryPage.openDossier(dossier.name);
            await dossierPage.waitForDossierLoading();
            await libraryPage.openUserAccountMenu();
            await since('The user should be #{expected}, instead we have #{actual}')
                .expect(await userAccount.getUserName())
                .toContain('Shuai');
            // global logout and re-login with credential
            await libraryPage.logout();
            await takeScreenshot('TC82421', 'SAML_SingleLogout');
            await loginPage.samlRelogin();
            await loginPage.oktaLogin(oktaUser.credentials);
            await libraryPage.waitForLibraryLoading();
            await since('User re-login after filling in credentials')
                .expect(await libraryPage.title())
                .toBe('Library');
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC82421: ', e.message);
                return;
            }
            throw e;
        }
    });
});
