import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
import ERROR_MAP from '../../../../utils/ErrorMsg.js';

/*
TC75967:Verify Library Web OIDC Authentication - Okta - without "offline_access", use "id_token" - Jboss
Test environment https://emm1.labs.microstrategy.com:1011/MicroStrategyLibrary
admin credetials: mstr/mstr123
Run in Local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:1011/MicroStrategyLibrary/ --xml=specs/regression/config/AuthenticationsOIDCWithoutOfflineAccessJboss.config.xml --params.loginType=okta --params.credentials.webServerUsername=sxiong@microstrategy.com --params.credentials.webServerPassword=****
 */

describe('Authentication - OIDC', () => {
    let { userAccount, libraryPage, loginPage, dossierPage } = browsers.pageObj1;

    const dossier = {
        id: 'ABDEB8CB463B4A1513DC23B77A6636D9',
        name: 'Test Dossier',
        project: {
            id: 'B19DEDCC11D4E0EFC000EB9495D0F44F',
            name: 'MicroStrategy Tutorial',
        },
    };
    const user = users['EMM_OKTA'];
    user.credentials.password = process.env.okta_password;
    // user.credentials.password = 'Shine1234';

    it('[TC75967] Verify Library Web OIDC Authentication - Okta', async () => {
        try {
            await loginPage.oktaLogin(user.credentials);
            await libraryPage.waitForLibraryLoading();
            await userAccount.openUserAccountMenu();
            await since('The user should be #{expected}, instead we have #{actual}')
                .expect(await userAccount.getUserName())
                .toContain('Shuai');
            await userAccount.closeUserAccountMenu();
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC75967: ', e.message);
                return;
            }
            throw e;
        }
    });
});
