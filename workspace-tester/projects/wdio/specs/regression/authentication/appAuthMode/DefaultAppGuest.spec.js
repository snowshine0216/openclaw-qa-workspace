/**
 * Test environment: https://emm2.labs.microstrategy.com:1399/MicroStrategyLibrary/
 * TC86305
 * TC86304
 * Run in Local: npm run regression -- --baseUrl=https://emm2.labs.microstrategy.com:1399/MicroStrategyLibrary/ --xml=specs/regression/config/DefaultAppGuest.config.xml --params.loginType=Custom --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
 */
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';

describe('Custom app auth mode - Guest', () => {
    const standardUser = {
        username: 'mob',
        password: '',
    };

    const guestUser = {
        username: 'Public / Guest',
    };

    const customApp = {
        default: {
            name: 'Strategy',
            id: 'C2B2023642F6753A2EF159A75E0CFF29',
        },
        serverLevelAuthMode: {
            name: 'dossier as home',
            id: 'AC22810FEEAF4F64A022991DF94EDC39',
        },
        specificAuthMode: {
            Standard: {
                name: 'Standard',
                id: '369CD4A59DC54B92A302F26117FCA890',
            },
        },
    };

    let { userAccount, libraryPage, loginPage, onboardingTutorial } = browsers.pageObj1;

    beforeEach(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC86305] Validate switch app workflow | Switch from custom app to default app with only guest mode', async () => {
        await libraryPage.openCustomAppById({ id: customApp.specificAuthMode.Standard.id });
        await loginPage.login(standardUser);
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe(standardUser.username);
        await since('Can user logout should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.canUserLogout())
            .toBe(true);
        await libraryPage.closeUserAccountMenu();

        await userAccount.switchCustomApp(customApp.default.name);
        if (await onboardingTutorial.hasLibraryIntroduction()) {
            await onboardingTutorial.clickIntroToLibrarySkip();
        }
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.loginAsGuest();
        await libraryPage.waitForLibraryLoading();
        await since('Can user logout should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.canUserLogout())
            .toBe(false);
    });

    it('[TC86304] Validate no logout button when there is only guest mode', async () => {
        await libraryPage.openCustomAppById({ id: customApp.default.id, check_flag: false });
        await onboardingTutorial.clickIntroToLibrarySkip();
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe(guestUser.username);
        await since('Can user logout should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.canUserLogout())
            .toBe(false);
        await libraryPage.closeUserAccountMenu();

        await userAccount.switchCustomApp(customApp.serverLevelAuthMode.name);
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe(guestUser.username);
        await since('Can user logout should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.canUserLogout())
            .toBe(false);
    });
});
