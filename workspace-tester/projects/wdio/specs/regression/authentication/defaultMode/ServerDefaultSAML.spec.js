import users from '../../../../testData/users.json' assert { type: 'json' };
import ERROR_MAP from '../../../../utils/ErrorMsg.js';
/**
 * run in local: npm run regression -- --baseUrl=https://emm2.labs.microstrategy.com:6363/MicroStrategyLibrary/ --xml=specs/regression/config/Authentication_ServerDefault_SAML.config.xml --params.credentials.webServerUsername=admin --params.credentials.webServerPassword="" --params.loginType=custom
 */
describe('Authentication - SAML as default', () => {
    const oktaUser = users['EMM_OKTA'];
    oktaUser.credentials.password = process.env.okta_password;
    const standardUser = users['EMM_standard'];

    let { userAccount, libraryPage, loginPage, dossierPage } = browsers.pageObj1;

    afterEach(async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
    });

    it('[TC85533] Validate SAML login workflow when SAML is set as default in server multiple modes', async () => {
        try {
            // directly jump to SAML login
            await loginPage.oktaLogin(oktaUser.credentials);
            await libraryPage.waitForLibraryLoading();
            await libraryPage.openUserAccountMenu();
            await since('The user should be #{expected}, instead we have #{actual}')
                .expect(await userAccount.getUserName())
                .toContain('Shuai');
            await libraryPage.closeUserAccountMenu();
            // switch custom app and re-login
            await userAccount.switchCustomApp('Test for ACL');
            await libraryPage.waitForLibraryLoading();
            await libraryPage.openUserAccountMenu();
            await libraryPage.logout();
            await loginPage.samlRelogin();
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
                console.log('Low Pass for TC85533: ', e.message);
                return;
            }
            throw e;
        }
    });

    it('[TC86233] Validate switch from SAML user to standard user', async () => {
        try {
            // login as standard user
            await loginPage.login(standardUser.credentials);
            await libraryPage.openUserAccountMenu();
            await since('The user should be #{expected}, instead we have #{actual}')
                .expect(await userAccount.getUserName())
                .toBe('automation');
            await libraryPage.closeUserAccountMenu();
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC86233: ', e.message);
                return;
            }
            throw e;
        }
    });
});
