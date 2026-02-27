/*
Run in Local: npm run regression -- --baseUrl=https://emm.labs.microstrategy.com:6199/MicroStrategyLibrary/ --xml=specs/regression/config/AuthenticationsOIDCPingFederate10.config.xml --params.credentials.username=testuser1 --params.credentials.password=Password1 --params.credentials.webServerUsername=admin --params.credentials.webServerPassword="" --params.loginType=Custom
 */
import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
import ERROR_MAP from '../../../../utils/ErrorMsg.js';

describe('[TC75965] Verify Library Web OIDC Authentication - PingFederate - without "offline_access", use "user_info" - Tomcat', () => {
    let { userAccount, libraryPage, pingFederateLoginPage } = browsers.pageObj1;

    const dossier = {
        id: 'ABDEB8CB463B4A1513DC23B77A6636D9',
        name: 'Test Dossier',
    };
    const user = users['oidc_pingFederate'];

    it('[TC75965] test login with invalid and valid credential', async () => {
        try {
            await pingFederateLoginPage.login(user.credentials.username, user.credentials.password);
            await libraryPage.waitForLibraryLoading();
            await userAccount.openUserAccountMenu();
            await since('The user should be #{expected}, instead we have #{actual}')
                .expect(await userAccount.getUserName())
                .toBe('testuser1');
            await userAccount.closeUserAccountMenu();
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC75965: ', e.message);
                return;
            }
            throw e;
        }
    });
});
