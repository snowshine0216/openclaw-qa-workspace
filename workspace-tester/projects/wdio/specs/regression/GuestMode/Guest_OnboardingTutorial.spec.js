import setWindowSize from '../../../config/setWindowSize.js';

describe('Reset', () => {
    const dossier = {
        id: 'D3B642B84B7C39002668F990DA49ADDE',
        name: 'Reset',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1000,
        height: 800,
    };

    let { dossierPage, libraryPage, loginPage, onboardingTutorial, reset, toc, promptEditor } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await loginPage.loginAsGuest();
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
        await onboardingTutorial.skip();
        await libraryPage.userAccount.openUserAccountMenu();
        await libraryPage.userAccount.logout();
    });

    it('[TC58905] Login as guest user | Show Tutorial again', async () => {
        await onboardingTutorial.sleep(2000); // wait for animation
        // it is expected to always display tutorial for Guest authentication per browser per machine
        await since('Library Introduction present should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isLibraryIntroductionPresent())
            .toBe(true);
        await onboardingTutorial.clickDock('third');
        await onboardingTutorial.clickContinueTour();
        await since('Library Onboading Area present should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isLibraryOnboardingAreaPresent('Sidebar'))
            .toBe(false);
        await onboardingTutorial.clickLibraryOnboardingButton('Explore Your Library', 'Next');
        await onboardingTutorial.clickLibraryOnboardingButton('Right Corner', 'Got It');

        await libraryPage.openDossier(dossier.name);
        await onboardingTutorial.clickDossierOnboardingButton('ToC', 'Next');
        await onboardingTutorial.clickDossierOnboardingButton('Filter', 'Got It');
    });

    it('[TC96865] Validate onboarding tutorial when with ui.navigation.toc=false parameter and guest session', async () => {
        const withoutTocUrl =
            browser.options.baseUrl +
            'app/9D8A49D54E04E0BE62C877ACC18A5A0A/D737E5C0496BD6ECD8C2B5A4E3337CA5?ui.navigation.toc=false';
        await browser.url(withoutTocUrl);
        await promptEditor.waitForEditor();
        await promptEditor.run();
    });
});
