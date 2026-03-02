import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
import ERROR_MAP from '../../../../utils/ErrorMsg.js';
/**
 * run in local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:8992/Library/ --xml=specs/regression/config/Authentication_ServerDefault_LDAP.config.xml --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
 */
describe('Authentication - LDAP as default', () => {
    const standardUser = users['EMM_standard'];
    const oktaUser = users['EMM_OKTA'];
    oktaUser.credentials.password = process.env.okta_password;
    // oktaUser.credentials.password = 'Shine1234';
    const customApp = {
        DossierAsHome: {
            id: 'AC22810FEEAF4F64A022991DF94EDC39',
        },
    };

    let { userAccount, libraryPage, loginPage, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.waitForCurtainDisappear();
    });

    afterEach(async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
    });

    it('[TC85530] Validate standard login workflow when LDAP is set as default', async () => {
        try {
            // First open, show default tab - LDAP
            await takeScreenshotByElement(loginPage.getCredsLoginContainer(), 'TC85531', 'DefaultLDAP', {
                tolerance: 0.25,
            });
            await loginPage.switchToStandardTab();
            await loginPage.login(standardUser.credentials);
            await libraryPage.openUserAccountMenu();
            await since('The user should be #{expected}, instead we have #{actual}')
                .expect(await userAccount.getUserName())
                .toBe('automation');
            await libraryPage.closeUserAccountMenu();
            // switch custom app
            await libraryPage.openCustomAppById({ id: customApp.DossierAsHome.id });
            // logout and re-login custom app
            await libraryPage.openUserAccountMenu();
            await libraryPage.logout();
            await loginPage.login(standardUser.credentials);
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC85530: ', e.message);
                return;
            }
            throw e;
        }
    });

    it('[TC85552] Validate OIDC login workflow when LDAP is set as default in server multiple modes', async () => {
        try {
            // Login as OIDC
            await libraryPage.openCustomAppById({ id: customApp.DossierAsHome.id });
            await loginPage.oidcRelogin();
            await loginPage.oktaLogin(oktaUser.credentials);
            await libraryPage.waitForLibraryLoading();
            await libraryPage.openUserAccountMenu();
            await since('The user should be #{expected}, instead we have #{actual}')
                .expect(await userAccount.getUserName())
                .toContain('Shuai');
            await libraryPage.closeUserAccountMenu();
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC85552: ', e.message);
                return;
            }
            throw e;
        }
    });
});
