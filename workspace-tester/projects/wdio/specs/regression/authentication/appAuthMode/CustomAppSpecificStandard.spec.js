/**
 * Test environment:https://mci-snh21-dev.hypernow.microstrategy.com/MicroStrategyLibrary/
 * TC86289
 * Run in Local: npm run regression -- --baseUrl=https://mci-snh21-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --xml=specs/regression/config/CustomAppSpecificStandard.config.xml --params.loginType=Custom --params.credentials.username=mstr --params.credentials.password=g~j2L1Dxb2Wk --params.credentials.webServerUsername=mstr --params.credentials.webServerPassword=g~j2L1Dxb2Wk
 */

describe('Custom app auth mode - Standard', () => {
    const standardUser = {
        username: browsers.params.credentials.username,
        password: browsers.params.credentials.password,
    };

    const customApp = {
        specificAuthMode: {
            Standard: {
                id: 'A799923FD0784CDAA15425719159085D',
            },
        },
    };

    let { userAccount, libraryPage, loginPage, dossierPage } = browsers.pageObj1;

    it('[TC86289] Validate login workflow | Login custom app when it is set to specific auth mode - standard', async () => {
        const {
            specificAuthMode: { Standard },
        } = customApp;

        await libraryPage.openCustomAppById({ id: Standard.id, check_flag: false });

        // login with standard mode
        await loginPage.login(standardUser);
        await dossierPage.waitForDossierLoading();
        await userAccount.openUserAccountMenu();
        await since('The user name should contains MSTR')
            .expect(await userAccount.getUserName())
            .toContain('MSTR');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(Standard.id);
        await libraryPage.closeUserAccountMenu();
    });
});
