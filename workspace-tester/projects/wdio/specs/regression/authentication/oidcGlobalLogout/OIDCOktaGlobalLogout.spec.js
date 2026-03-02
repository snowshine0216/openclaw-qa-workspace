import users from '../../../../testData/users.json' assert { type: 'json' };
import { buildAdminUrl } from '../../../../utils/index.js';
import ERROR_MAP from '../../../../utils/ErrorMsg.js';
/**
 * Test environment:
 * Run in Local: npm run regression -- --xml=specs/regression/config/Authentication_OIDCOktaGlobalLogout.config.xml --baseUrl=https://emm1.labs.microstrategy.com:6543/LibraryOIDCGlobal/ --params.credentials.webServerUsername=sxiong@microstrategy.com --params.credentials.webServerPassword=**** --params.loginType=okta
 * Weblogic, Okta, Global Logout
 */

describe('OIDC Okta Global Logout', () => {
    const dossier = {
        id: '05889D344A9BD9AE4CF019BBA63989FA',
        name: 'android_test_dossier',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const user = users['EMM_OKTA'].credentials;
    user.password = process.env.okta_password;
    const config = {
        id: 'AC22810FEEAF4F64A022991DF94EDC39',
        dossierAsHomeName: 'dossier as home',
    };

    let { userAccount, libraryPage, loginPage, dossierPage, adminPage } = browsers.pageObj1;

    it('[TC88969] Verify OIDC Global logout on Library Web - Weblogic & Okta', async () => {
        try {
            const adminurl = buildAdminUrl();
            await browser.url(adminurl);
            await loginPage.oktaLogin(user);
            await libraryPage.waitForDynamicElementLoading();
            // open admin page
            await since('The page title should be #{expected}, instead we have #{actual}')
                .expect(await adminPage.getLibraryAdminText())
                .toBe('Library Admin');
            // open library app, should already login
            await libraryPage.switchToNewWindowWithUrl(browser.options.baseUrl);
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
            await since('Login page is displayed = ')
                .expect(await loginPage.isLoginPageDisplayed())
                .toEqual(true);
            await since('OIDC login button is displayed = ')
                .expect(await loginPage.isOIDCLoginButtonDisplayed())
                .toEqual(true);
            // switch to admin page, should be logout status
            await libraryPage.switchToTab(0);
            await libraryPage.reload();
            let adminUrl = await libraryPage.currentURL();
            await since('Admin Url should not be #{expected}, instead we have #{actual}')
                .expect(adminUrl)
                .not.toBe(browser.options.baseUrl + 'admin/version');
            await libraryPage.closeTab(0);
            // back to library app
            await libraryPage.switchToTab(0);
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC88969: ', e.message);
                return;
            }
            throw e;
        }
    });

    it('[TC88971] Verify OIDC Global logout on Library Web when custom app', async () => {
        try {
            await libraryPage.openCustomAppById({ id: config.id, check_flag: false });
            await loginPage.oktaLogin(user);
            await dossierPage.waitForDossierLoading();
            await since('Dossier title should be #{expected}, instead we have #{actual}')
                .expect(await dossierPage.pageTitle())
                .toEqual([dossier.name, 'Chapter 1', 'Page 1']);
            // logout from Library and relogin,should stay in custom app
            await userAccount.openUserAccountMenu();
            await dossierPage.logout();
            await loginPage.oidcRelogin();
            await loginPage.oktaLogin(user);
            await dossierPage.waitForDossierLoading();
            await since('Dossier title should be #{expected}, instead we have #{actual}')
                .expect(await dossierPage.pageTitle())
                .toEqual([dossier.name, 'Chapter 1', 'Page 1']);
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC88971: ', e.message);
                return;
            }
            throw e;
        }
    });

    // it('[TC89121] Verify 400 error page when send incorrect logout request', async () => {
    //     try {
    //         await browser.url(browser.options.baseUrl + 'auth/oidc/logout');
    //         await since('The response should be #{expected} but wet get #{actual}')
    //             .expect(await adminPage.getForbiddenMessage())
    //             .toContain('HTTP Status 400 - Bad Request');
    //         await browser.url(browser.options.baseUrl);
    //         await libraryPage.waitForLibraryLoading();
    //         await since('User should still have session')
    //             .expect(await libraryPage.title())
    //             .toBe('Library');
    //     } catch (e) {
    //         if (
    //             e.message.includes(ERROR_MAP.ERR_001) ||
    //             e.message.includes(ERROR_MAP.ERR_002) ||
    //             e.message.includes(ERROR_MAP.ERR_003)
    //         ) {
    //             console.log('Low Pass for TC89121: ', e.message);
    //             return;
    //         }
    //         throw e;
    //     }
    // });

    it('[TC89130] Verify the decryption of state in Library Web Global Logout', async () => {
        try {
            await browser.url(
                browser.options.baseUrl +
                    'auth/oidc/logout?state=MDAxeC1tc3RyLXByb3BlcnR5LXgAAAAMTkftACqhJzaV3GJbzj-Xo5wO6yn6MqUOecw2quvmKW2Vz416cBgpPzytlhC'
            );
            await since('The response should be #{expected} but wet get #{actual}')
                .expect(await adminPage.getForbiddenMessage())
                .toContain('HTTP Status 400 - Bad Request');
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC89130: ', e.message);
                return;
            }
            throw e;
        }
    });
});
