import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
import { sleep } from '../../../../utils/retry-util.js';
import ERROR_MAP from '../../../../utils/ErrorMsg.js';
/*
Test environment: EMM team server
Run in local: npm run regression -- --baseUrl=https://emm1.labs.microstrategy.com:7443/MicroStrategyLibrary/ --xml=specs/regression/config/SAMLAzureGlobalLogout.config.xml --params.loginType=azure --params.credentials.webServerUsername=mexia@mstrdev.com --params.credentials.webServerPassword=****
Tomcat, Azure, Global logout
*/

describe('SAML Azure Global Logout', () => {
    const user1 = users['EMM_SAML_Azure'].credentials;
    user1.password = process.env.azure_password;
    // user1.password = 'mstr.1234'
    const user2 = users['EMM_SAML_Azure_User2'].credentials;
    user2.password = process.env.azure_sxiong_password;
    // user2.password = '<#inTUne20'

    const dossier = {
        name: 'Test Dossier',
    };

    let { userAccount, libraryPage, azureLoginPage, loginPage, dossierPage } = browsers.pageObj1;

    it('[TC82419] Verify SAML Single logout on Library Web - Tomcat&Azure', async () => {
        try {
            //login successfully
            await azureLoginPage.loginToAzure(user1.username);
            await azureLoginPage.loginWithPassword(user1.password);
            await azureLoginPage.continueAzureLogin();
            await libraryPage.waitForLibraryLoading();
            await userAccount.openUserAccountMenu();
            await since('The user should be #{expected}, instead we have #{actual}')
                .expect(await userAccount.getUserName())
                .toBe('Menglu Xia');
            await userAccount.closeUserAccountMenu();

            // global logout and relogin with credential
            await userAccount.openUserAccountMenu();
            await libraryPage.logout();
            await loginPage.samlRelogin();
            await azureLoginPage.loginAzureWithAnotherUser();
            await azureLoginPage.loginToAzure(user2.username);
            await azureLoginPage.loginWithPassword(user2.password);
            // if (!(await azureLoginPage.getYesButton().isDisplayed())) {
            //     await azureLoginPage.clickNextButton();
            //     await libraryPage.sleep(5000);
            //     await azureLoginPage.clickSkipButton();
            // }
            await azureLoginPage.clickYesButton();
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
                console.log('Low Pass for TC82419: ', e.message);
                return;
            }
            throw e;
        }
    });
});
