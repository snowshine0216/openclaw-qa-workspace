import users from '../../../../testData/users.json' assert { type: 'json' };

/**
 * Test environment: https://mci-zwjfc-dev.hypernow.microstrategy.com/MicroStrategyLibrary/
 * TC86336
 * Run in Local: npm run regression -- --xml=specs/regression/config/CustomAppSpecificSAML.config.xml --baseUrl=https://mci-zwjfc-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.loginType=Custom --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=bXrdNl3.9VyO
 */

describe('Custom app auth mode - SAML', () => {
    const azureUser = users['EMM_SAML_Azure'];
    azureUser.credentials.password = process.env.azure_password;
    const customApp = {
        specificAuthMode: {
            SAML: {
                name: '',
                id: 'F886618BC1054392A9F0D7089CB5EE5E',
            },
        },
    };

    let { userAccount, libraryPage, loginPage, azureLoginPage } = browsers.pageObj1;

    it('[TC86336] Validate login workflow | Login custom app when it is set to specific auth mode - SAML local logout', async () => {
        await libraryPage.openCustomAppById({ id: customApp.specificAuthMode.SAML.id, check_flag: false });

        // Directly jump to SAML IDP
        await azureLoginPage.loginToAzure(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Menglu Xia');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(customApp.specificAuthMode.SAML.id);

        /* local logout and relogin */
        await libraryPage.logout();
        await loginPage.samlRelogin();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Menglu Xia');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(customApp.specificAuthMode.SAML.id);
        await libraryPage.closeUserAccountMenu();
    });
});
