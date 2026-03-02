import users from '../../../../testData/users.json' assert { type: 'json' };

/**
 * Test environment: https://tec-l-1028813.labs.microstrategy.com:8093/MicroStrategyLibrary/
 * TC86303
 * Run in Local: npm run regression -- --baseUrl=https://tec-l-1028813.labs.microstrategy.com:8093/MicroStrategyLibrary/ --xml=specs/regression/config/DefaultAppTrusted.config.xml --params.loginType=trusted --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
 */

describe('Custom app auth mode - Trusted', () => {
    const trustedUser = users['EMM_trusted_pingFederate'];
    const customApp = {
        specificAuthMode: {
            Standard: {
                id: '369CD4A59DC54B92A302F26117FCA890',
            },
        },
    };

    let { userAccount, libraryPage, pingFederateLoginPage } = browsers.pageObj1;

    it('[TC86303] Validate custom app can only use trusted mode when server is set to trusted mode', async () => {
        const {
            specificAuthMode: { Standard },
        } = customApp;
        await libraryPage.openCustomAppById({ id: Standard.id, check_flag: false });
        // login successfully
        await pingFederateLoginPage.login(trustedUser.credentials.username, trustedUser.credentials.password);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('desparzaClient');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(Standard.id);
        await userAccount.closeUserAccountMenu();
    });
});
