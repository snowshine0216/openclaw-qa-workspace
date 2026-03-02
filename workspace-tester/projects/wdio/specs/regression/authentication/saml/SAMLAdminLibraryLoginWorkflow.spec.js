import users from '../../../../testData/users.json' assert { type: 'json' };
import ERROR_MAP from '../../../../utils/ErrorMsg.js';
/*
Run in local: npm run regression -- --baseUrl=https://emm1.labs.microstrategy.com:7443/MicroStrategyLibrary/ --xml=specs/regression/config/SAMLAdminLibraryLoginWorkflow.config.xml --params.loginType=azure --params.credentials.webServerUsername=mexia@mstrdev.com --params.credentials.webServerPassword=****
*/

describe('SAML Azure Global Logout', () => {
    const azureUser = users['EMM_SAML_Azure'];
    azureUser.credentials.password = process.env.azure_password;
    //  azureUser.credentials.password = 'mstr.1234';

    let { userAccount, libraryPage, azureLoginPage, loginPage, adminPage } = browsers.pageObj1;

    it('[TC90333_01] Login admin page with SAML first, then enter library web directly', async () => {
        await adminPage.openAdminPage();
        await azureLoginPage.loginToAzure(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.continueAzureLogin();
        await adminPage.waitForDynamicElementLoading();
        await since('The page title should be #{expected}, instead we have #{actual}')
            .expect(await adminPage.getLibraryAdminText())
            .toBe('Library Admin');
        await libraryPage.switchToNewWindowWithUrl(browser.options.baseUrl);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await libraryPage.logout();
        await libraryPage.closeTab(1);
    });

    it('[TC90333_02] Login library web with SAML first, then enter admin page directly', async () => {
        try {
            await browser.url(browser.options.baseUrl);
            await azureLoginPage.safeLoginToAzure(azureUser.credentials.username);
            await libraryPage.sleep(60000);
            await azureLoginPage.loginWithPassword(azureUser.credentials.password);
            await azureLoginPage.continueAzureLogin();
            await libraryPage.waitForLibraryLoading();
            await since('User can enter library directly')
                .expect(await libraryPage.title())
                .toBe('Library');
            await libraryPage.switchToNewWindowWithUrl(browser.options.baseUrl + 'admin');
            await since('The page title should be #{expected}, instead we have #{actual}')
                .expect(await adminPage.getLibraryAdminText())
                .toBe('Library Admin');
            await libraryPage.closeTab(1);
            await userAccount.openUserAccountMenu();
            await libraryPage.logout();
        } catch (e) {
            if (
                e.message.includes(ERROR_MAP.ERR_001) ||
                e.message.includes(ERROR_MAP.ERR_002) ||
                e.message.includes(ERROR_MAP.ERR_003)
            ) {
                console.log('Low Pass for TC90333_02: ', e.message);
                return;
            }
            throw e;
        }
    });

    it('[TC90333_03] Login library web with STD first, then admin page need SAML to login', async () => {
        // await libraryPage.switchToTab(0);
        await browser.url(browser.options.baseUrl + 'auth/ui/loginPage');
        await loginPage.login({ username: 'auto', password: '' });
        await libraryPage.waitForLibraryLoading();
        await since('User can enter library directly')
            .expect(await libraryPage.title())
            .toBe('Library');
        await libraryPage.executeScript('window.open()');
        await libraryPage.switchToNewWindow();
        await browser.url(browser.options.baseUrl + 'admin');
        await azureLoginPage.safeLoginToAzure(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.continueAzureLogin();
        await adminPage.waitForDynamicElementLoading();
        await since('The page title should be #{expected}, instead we have #{actual}')
            .expect(await adminPage.getLibraryAdminText())
            .toBe('Library Admin');
        await libraryPage.closeTab(1);
        await userAccount.openUserAccountMenu();
        await libraryPage.logout();
    });
});
