/**
 * Test environment: https://emm1.labs.microstrategy.com:9011/MicroStrategyLibrary/
 * TC86342
 * Run in Local: npm run regression -- --xml=specs/regression/config/CustomAppGuestMultiModesServer.config.xml --baseUrl=https://emm1.labs.microstrategy.com:9011/MicroStrategyLibrary/ --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
 */

describe('Custom app auth mode - Guest (Multi Modes Server)', () => {
    const customApp = {
        default: {
            name: 'MicroStrategy',
            id: 'C2B2023642F6753A2EF159A75E0CFF29',
        },
        specificAuthMode: {
            Standard: {
                name: 'auto_Standard',
                id: '369CD4A59DC54B92A302F26117FCA890',
            },
        },
    };

    let { userAccount, libraryPage, loginPage, onboardingTutorial } = browsers.pageObj1;

    it('[TC86342] When there are multiple modes and user login as guest, show log in button in account menu', async () => {
        await libraryPage.openCustomAppById({ id: customApp.default.id, check_flag: false });
        await loginPage.waitForLoginView();
        await loginPage.loginAsGuest();
        await libraryPage.waitForLibraryLoading();
        if (await onboardingTutorial.isLibraryIntroductionPresent()) {
            await onboardingTutorial.clickIntroToLibrarySkip();
        }
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Public / Guest');
        await since('Can user login should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.canUserLogin())
            .toBe(true);
        await libraryPage.closeUserAccountMenu();

        await userAccount.switchCustomApp(customApp.specificAuthMode.Standard.name);
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe('Public / Guest');
        await since('Can user login should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.canUserLogin())
            .toBe(true);
        await libraryPage.closeUserAccountMenu();
    });
});
