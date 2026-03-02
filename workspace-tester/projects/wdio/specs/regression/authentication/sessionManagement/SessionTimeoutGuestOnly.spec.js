import users from '../../../../testData/users.json' assert { type: 'json' };

/* 
npm run regression -- --baseUrl=https://emm2.labs.microstrategy.com:1399/MicroStrategyLibrary/ --xml=specs/regression/config/Authentication_SessionTimeoutGuestOnly.config.xml --params.credentials.webServerUsername=admin --params.credentials.webServerPassword="" --params.loginType=Custom
*/
describe('Guest only as server level auth mode, session timeout', () => {
    const standardUser = users['EMM_web_automation'];
    const guestUser = {
        username: 'Public / Guest',
    };
    const customApp = {
        DossierAsHome: {
            name: 'dossier as home',
            id: 'AC22810FEEAF4F64A022991DF94EDC39',
            dossier: 'android_test_dossier',
        },
        Default: {
            name: 'MicroStrategy',
            id: 'C2B2023642F6753A2EF159A75E0CFF29',
            dossier: 'Empty Dossier',
        },
        Standard: {
            name: 'auto_Standard',
            id: '369CD4A59DC54B92A302F26117FCA890',
        },
        LibraryList: {
            name: 'AndroidAuto_LibraryList',
            id: 'E611F5BC7FC84278B3604F86F9E59B01',
        },
    };

    let { dossierPage, libraryPage, loginPage, userAccount, onboardingTutorial, toc } = browsers.pageObj1;

    it('[TC91419] guest only in default app, session timeout, open a dossier', async () => {
        await browser.url(browser.options.baseUrl);
        await libraryPage.waitForLibraryLoading();
        try {
            await libraryPage.sleep(5000);
            if (await onboardingTutorial.isLibraryIntroductionPresent()) {
                await onboardingTutorial.clickIntroToLibrarySkip();
            }
        } catch (e) {
            console.warn(e.message == 'Introduction To Library is not present' ? e : 'Unexpected error: ' + e.message);
        }
        await libraryPage.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe(guestUser.username);
        await libraryPage.closeUserAccountMenu();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await libraryPage.title())
            .toEqual('Library');
        if (await onboardingTutorial.hasLibraryIntroduction()) {
            await onboardingTutorial.clickIntroToLibrarySkip();
        }
        await browser.pause(240000);
        await libraryPage.openDossierNoWait(customApp.Default.dossier);
        // indicator for session timeout
        await dossierPage.waitForDossierLoading();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([customApp.Default.dossier, 'Chapter 1', 'Page 1']);
    });

    it('[TC91470] guest only in custom app, session timeout, switch to other auth mode', async () => {
        await libraryPage.openCustomAppById({ id: customApp.DossierAsHome.id });
        await dossierPage.waitForDossierLoading();
        await toc.openMenu();
        await since('Dossier title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([customApp.DossierAsHome.dossier, 'Chapter 1', 'Page 1']);
        await browser.pause(240000);
        await userAccount.switchCustomApp(customApp.Standard.name);
        await loginPage.waitForLoginView();
        let url = await libraryPage.currentURL();
        await since('URL should end with #{expected}, instead we have #{actual}')
            .expect(url)
            .toContain(customApp.Standard.id);
    });

    it('[TC91472] std user in custom app, session timeout, switch to guest only custom app', async () => {
        await libraryPage.openCustomAppById({ id: customApp.Standard.id });
        await loginPage.waitForLoginView();
        await loginPage.login(standardUser.credentials);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        let url = await libraryPage.currentURL();
        await since('URL should end with #{expected}, instead we have #{actual}')
            .expect(url)
            .toContain(customApp.Standard.id);
        await libraryPage.closeUserAccountMenu();
        await browser.pause(240000);
        await userAccount.switchCustomApp(customApp.LibraryList.name);
        await libraryPage.waitForLibraryLoading();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await libraryPage.title())
            .toEqual('Library');
        if (await onboardingTutorial.hasLibraryIntroduction()) {
            await onboardingTutorial.clickIntroToLibrarySkip();
        }
        await userAccount.openUserAccountMenu();
        await since('The user should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.getUserName())
            .toBe(guestUser.username);
        await since('Can user logout should be #{expected}, instead we have #{actual}')
            .expect(await userAccount.canUserLogout())
            .toBe(false);
    });
});
