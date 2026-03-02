import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
import ERROR_MAP from '../../../../utils/ErrorMsg.js';
/*
Test environment: EMM team server
Run in local: npm run regression -- --baseUrl=https://emm1.labs.microstrategy.com:1234/MicroStrategyLibrary/ --xml=specs/regression/config/SAMLOktaLogin.config.xml --params.loginType=Custom --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
Run in local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:8989/MicroStrategyLibrary/ --xml=specs/regression/config/SAMLOktaLogin.config.xml --params.loginType=okta --params.credentials.webServerUsername=sxiong@microstrategy.com --params.credentials.webServerPassword=****
Tomcat, Okta, Local logout
*/

describe('Authentication - SAML Okta', () => {
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
    // oktaUser.credentials.password = 'Shine1234';

    let { userAccount, libraryPage, loginPage, dossierPage } = browsers.pageObj1;

    it('[TC79614] Validate Library SAML authentication workflow on Tomcat', async () => {
        try {
            // login successfully
            await loginPage.oktaLogin(oktaUser.credentials);
            await libraryPage.waitForLibraryLoading();

            await libraryPage.openUserAccountMenu();
            await since('The user should be #{expected}, instead we have #{actual}')
                .expect(await userAccount.getUserName())
                .toContain('Shuai');

            // Local logout and re-login
            await libraryPage.logout();
            // await takeScreenshot('TC79614', 'SAML_LocalLogout');
            await loginPage.samlRelogin();
            await libraryPage.waitForLibraryLoading();
            await since('User can re-login without filling in credentials')
                .expect(await libraryPage.title())
                .toBe('Library');
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC79614: ', e.message);
                return;
            }
            throw e;
        }
    });
});
