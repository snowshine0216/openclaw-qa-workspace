import { buildMSTRWebUrl } from '../../../../utils/index.js';
import { takeScreenshot } from '../../../../utils/TakeScreenshot.js';
import users from '../../../../testData/users.json' assert { type: 'json' };
import ERROR_MAP from '../../../../utils/ErrorMsg.js';
/**
 * Test environment: https://emm.labs.microstrategy.com:2334/MicroStrategyLibrary/
 *
 * Run in Local: npm run regression -- --xml=specs/regression/config/Authentication_OIDCAzureGlobalLogout.config.xml --baseUrl=https://emm.labs.microstrategy.com:2334/MicroStrategyLibrary/ --params.credentials.webServerUsername=mexia@mstrdev.com --params.credentials.webServerPassword=**** --params.loginType=azure
 * Tomcat, Azure, Global Logout
 * Run in Local: npm run regression -- --xml=specs/regression/config/Authentication_OIDCJBossAzureGlobalLogout.config.xml --baseUrl=https://emm.labs.microstrategy.com:2338/MicroStrategyLibrary/ --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=mstr123
 */

describe('OIDC Azure Global Logout', () => {
    const user1 = users['EMM_SAML_Azure'].credentials;
    user1.password = process.env.azure_password;
    const user2 = users['EMM_SAML_Azure_User2'].credentials;
    user2.password = process.env.azure_sxiong_password;
    const dossier = {
        name: 'Test Dossier',
    };
    const webUrl = buildMSTRWebUrl();
    let { userAccount, libraryPage, azureLoginPage, loginPage, dossierPage } = browsers.pageObj1;

    it('[TC88967] Verify OIDC Global logout on Library Web - Tomcat&Azure', async () => {
        try {
            //login successfully
            await loginPage.login(user1, { mode: 'oidc' });
            await azureLoginPage.loginToAzure(user1.username);
            await azureLoginPage.loginWithPassword(user1.password);
            await azureLoginPage.continueAzureLogin();
            await libraryPage.waitForItemLoading();
            await userAccount.openUserAccountMenu();
            await since('The user should be #{expected}, instead we have #{actual}')
                .expect(await userAccount.getUserName())
                .toBe('Menglu Xia');
            await userAccount.closeUserAccountMenu();
            // run dossier
            await libraryPage.openDossier(dossier.name);
            await dossierPage.waitForDossierLoading();
            await since('Dossier title should be #{expected}, instead we have #{actual}')
                .expect(await dossierPage.pageTitle())
                .toEqual(['Test Dossier', 'Chapter 1', 'CustomViz']);

            // global logout and relogin with credential
            await userAccount.openUserAccountMenu();
            await libraryPage.logout({ SSO: true });
            await azureLoginPage.logoutExistingUser(user1.username);
            await loginPage.oidcRelogin();
            await azureLoginPage.loginAzureWithAnotherUser();
            await azureLoginPage.loginToAzure(user2.username);
            await azureLoginPage.loginWithPassword(user2.password);
            // if (!(await azureLoginPage.getYesButton().isDisplayed())) {
            //     await azureLoginPage.clickNextButton();
            //     await azureLoginPage.clickSkipButton();
            // }
            await azureLoginPage.clickYesButton();
            await libraryPage.waitForItemLoading();
            await userAccount.openUserAccountMenu();
            await since('The user should be #{expected}, instead we have #{actual}')
                .expect(await userAccount.getUserName())
                .toContain('Shuai');
            await libraryPage.logout({ SSO: true });
            await azureLoginPage.logoutExistingUser(user2.username);
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC88967: ', e.message);
                return;
            }
            throw e;
        }
    });

    it('[TC89102] Verify OIDC Global logout on Library Web will not influence MSTR session', async () => {
        try {
            //login mstrWeb
            await browser.url(webUrl);
            await azureLoginPage.safeLoginToAzure(user1.username);
            await azureLoginPage.loginWithPassword(user1.password);
            await azureLoginPage.safeContinueAzureLogin();
            await loginPage.waitForMSTRProjectListAppear();
            // open library
            await libraryPage.switchToNewWindowWithUrl(browser.options.baseUrl);
            await loginPage.login(user1, { mode: 'oidc' });
            await libraryPage.waitForItemLoading();
            // global logout from library
            await userAccount.openUserAccountMenu();
            await libraryPage.logout({ SSO: true });
            await azureLoginPage.logoutExistingUser(user1.username);
            // check MSTR Web status
            await libraryPage.switchToTab(0);
            await libraryPage.reload();
            await loginPage.waitForMSTRProjectListAppear();
            await takeScreenshot('TC88967_02', 'MSTR Web session still exists');
            await libraryPage.closeTab(0);
            // Library need relogin
            await libraryPage.switchToTab(0);
            await loginPage.oidcRelogin();
            await azureLoginPage.loginExistingUser(user1.username);
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC89102: ', e.message);
                return;
            }
            throw e;
        }
    });
});
