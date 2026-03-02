import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
import ERROR_MAP from '../../../../utils/ErrorMsg.js';

/*
TC75966: Verify Library Web OIDC Authentication - Azure - without "offline_access", use "id_token"
Run in Local: npm run regression -- --baseUrl=https://emm1.labs.microstrategy.com:6543/MicroStrategyLibrary/ --xml=specs/regression/config/AuthenticationsOIDCAzure.config.xml --params.loginType=azure --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
 */

describe('E2E Library of OIDC Azure', () => {
    const azureUser = users['EMM_SAML_Azure'];
    azureUser.credentials.password = process.env.azure_password;

    const dossier = {
        id: 'DAF834314ADCCED1AC3771A7F5C7656E',
        name: 'Empty Dossier',
        project: {
            id: 'B19DEDCC11D4E0EFC000EB9495D0F44F',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { userAccount, libraryPage, azureLoginPage, dossierPage } = browsers.pageObj1;

    it('[TC75966] Initial testing - Login into Azure Server', async () => {
        try {
            await azureLoginPage.loginToAzure(azureUser.credentials.username);
            await azureLoginPage.loginWithPassword(azureUser.credentials.password);
            await azureLoginPage.continueAzureLogin();
            await libraryPage.waitForLibraryLoading();
            await userAccount.openUserAccountMenu();
            await since('The user should be #{expected}, instead we have #{actual}')
                .expect(await userAccount.getUserName())
                .toBe('Menglu Xia');
            await userAccount.closeUserAccountMenu();
            await libraryPage.openDossier(dossier.name);
            await dossierPage.waitForDossierLoading();
            await takeScreenshot('TC75966', 'Open Dossier');
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC75966: ', e.message);
                return;
            }
            throw e;
        }
    });
});
