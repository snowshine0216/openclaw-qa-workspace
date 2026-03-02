import users from '../../../../testData/users.json' assert { type: 'json' };
import ERROR_MAP from '../../../../utils/ErrorMsg.js';

/**
 * run in local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:6523/MicroStrategyLibrary/ --xml=specs/regression/config/Authentication_ServerDefault_OIDC.config.xml --params.credentials.webServerUsername=admin --params.credentials.webServerPassword="" --params.loginType=okta
 */
describe('Authentication - OIDC as default', () => {
    const oktaUser = users['EMM_OKTA'];
    oktaUser.credentials.password = process.env.okta_password;
    let { userAccount, libraryPage, loginPage, dossierPage } = browsers.pageObj1;

    it('[TC86231] Validate OIDC login workflow when OIDC is set as default in server multiple modes', async () => {
        try {
            // directly jump to OIDC login
            await loginPage.oktaLogin(oktaUser.credentials);
            await libraryPage.waitForLibraryLoading();
            await libraryPage.openUserAccountMenu();
            await since('The user should be #{expected}, instead we have #{actual}')
                .expect(await userAccount.getUserName())
                .toContain('Shuai');
            await libraryPage.closeUserAccountMenu();
            // switch custom app
            await userAccount.switchCustomApp('dossier as home');
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC86231: ', e.message);
                return;
            }
            throw e;
        }
    });
});
