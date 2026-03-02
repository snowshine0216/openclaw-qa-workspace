/*
npm run regression -- --baseUrl=https://emm1.labs.microstrategy.com:9011/MicroStrategyLibrary/ --xml=specs/regression/config/Authentication_SessionTimeoutDefaultServerGuest.config.xml --params.credentials.webServerUsername=admin --params.credentials.webServerPassword=""
*/
describe('Session timeout Default Server Guest', () => {
    const dossier = {
        id: '6EC184BF11EC321761B30080EF4CEEAC',
        name: 'New Dossier',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };
    let { dossierPage, libraryPage, loginPage, onboardingTutorial } = browsers.pageObj1;

    it('[TC85536] - Session timeout when guest is set as default in server multiple modes', async () => {
        await loginPage.loginAsGuest();
        await libraryPage.waitForLibraryLoading();
        await since('Library title should be #{expected} but is #{actual}')
            .expect(await libraryPage.title())
            .toEqual('Library');
        if (await onboardingTutorial.hasLibraryIntroduction()) {
            await onboardingTutorial.clickIntroToLibrarySkip();
        }
        await browser.pause(240000);
        await libraryPage.openDossierNoWait(dossier.name);
        await loginPage.waitForLoginView();
        await loginPage.loginAsGuest();
        await dossierPage.waitForDossierLoading();
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([dossier.name, 'Chapter 1', 'Page 1']);
    });
});
