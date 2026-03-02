import { customCredentials } from '../../../constants/index.js';
import resetOnboarding from '../../../api/resetOnboarding.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_tutorial') };

describe('Onboarding Tutorial', () => {
    const dossier = {
        id: '3240627F4FDC5AB2B0DC02AC4FE4A632',
        name: 'Onboarding',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const rsd = {
        id: '8BD86E714305A57EB302F29B651BB5A3',
        name: 'RSD - Onboarding',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const promptDossier = {
        id: 'D737E5C0496BD6ECD8C2B5A4E3337CA5',
        name: 'Prompt - Onboarding',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const report = {
        id: '300CECC44275368CFFEE6CA44896C5A9',
        name: '(Auto) Content - Report',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1000,
        height: 800,
    };

    const mobileWindow = {
        width: 400,
        height: 800,
    };

    let {
        dossierPage,
        libraryPage,
        loginPage,
        sidebar,
        userAccount,
        onboardingTutorial,
        promptEditor,
        quickSearch,
        fullSearch,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
        await onboardingTutorial.skip();
    });

    beforeEach(async () => {
        await resetOnboardingTutorial(2);
        await libraryPage.sleep(2000); // wait for welcome API complete
    });

    afterEach(async () => {
        const promptPresent = await promptEditor.isEditorOpen();
        if (promptPresent) {
            await promptEditor.cancelEditor();
        }
        await onboardingTutorial.skip();
    });

    it('[TC58022] Initial onboarding tutorial in library and dossier page', async () => {
        await resetOnboardingTutorial(15);
        await since('For RSD, TOC area exist should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isLibraryIntroductionPresent())
            .toBe(true);
        await since('Introduction1 title should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.getIntroductionToLibraryTitleText())
            .toBe(
                'A Powerful, Intelligent Library\nInteract with dashboards, reports and documents in your library and receive real-time notifications.'
            );
        await libraryPage.hideDossierListContainer();
        await takeScreenshot('TC58022', 'IntroToLibrary1');
        await libraryPage.showDossierListContainer();

        await onboardingTutorial.clickMoveRightItem();
        await since('Introduction2 title should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.getIntroductionToLibraryTitleText())
            .toBe('Explore Data Intuitively\nNavigate and filter through visualizations to explore your data.');

        await onboardingTutorial.clickMoveRightItem();
        await since('Introduction3 title should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.getIntroductionToLibraryTitleText())
            .toBe(
                'Seamless Sharing and Collaboration\nCreate discussion threads to collaborate and exchange ideas in real-time.'
            );
        await onboardingTutorial.clickContinueTour();

        await onboardingTutorial.sleep(2000); // Wait for animation to complete
        await onboardingTutorial.waitForLibraryAreaPresent('Sidebar');
        await libraryPage.hideDossierListContainer();
        await takeScreenshot('TC58022', 'Sidebar', { tolerance: 0.15 });
        await libraryPage.showDossierListContainer();
        await onboardingTutorial.clickLibraryOnboardingButton('Sidebar', 'Next');

        await onboardingTutorial.waitForLibraryAreaPresent('Explore Your Library');
        await since('Explore Your Library area exist should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isLibraryOnboardingAreaPresent('Explore Your Library'))
            .toBe(true);
        await takeScreenshot('TC58022', 'ExploreYourLibrary', { tolerance: 0.33 });
        await onboardingTutorial.clickLibraryOnboardingButton('Explore Your Library', 'Next');

        await onboardingTutorial.waitForLibraryAreaPresent('Right Corner');
        await onboardingTutorial.sleep(2000); // wait for element appears
        const isTanzu = await browser.options.baseUrl.includes('hypernow');
        if (!isTanzu) {
            await libraryPage.hideDossierListContainer();
            await takeScreenshot('TC58022', 'RightCorner');
            await libraryPage.showDossierListContainer();
        }
        await onboardingTutorial.clickLibraryOnboardingButton('Right Corner', 'Got It');

        // open Dossier, there will have onboarding in dossier page
        await libraryPage.openDossier(dossier.name);
        await onboardingTutorial.waitForDossierAreaPresent('ToC');
        await takeScreenshot('TC58022', 'NavOnboarding');
        await onboardingTutorial.clickDossierOnboardingButton('ToC', 'Next');

        await onboardingTutorial.waitForDossierAreaPresent('Bookmark');
        await since('Bookmark title should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.getDossierViewOnboardingTitleText('Bookmark'))
            .toBe('Bookmarks');
        await onboardingTutorial.clickDossierOnboardingButton('Bookmark', 'Next');

        const commentPresent = await dossierPage.getCommentsIcon().isDisplayed();
        if (commentPresent) {
            await takeScreenshot('TC58022', 'FilterOnboardingWithCollaboration');
            await onboardingTutorial.clickDossierOnboardingButton('Filter', 'Next');
            await since('Collabration title should be #{expected}, instead we have #{actual}')
                .expect(await onboardingTutorial.getDossierViewOnboardingTitleText('Comment'))
                .toBe('Collaboration');
            await onboardingTutorial.clickDossierOnboardingButton('Comment', 'Got It');
        } else {
            await since('Filter title should be #{expected}, instead we have #{actual}')
                .expect(await onboardingTutorial.getDossierViewOnboardingTitleText('Filter'))
                .toBe('Filters');
            await onboardingTutorial.clickDossierOnboardingButton('Filter', 'Got It');
        }
    });

    it('[TC58024] Initial onboarding tutorial in rsd page', async () => {
        await libraryPage.openDossier(rsd.name);
        await onboardingTutorial.waitForToCOnboardingAreaPresent();
        await since('For RSD, TOC area exist should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isDossierOnboardingAreaPresent('ToC'))
            .toBe(true);

        // for RSD, no Filter OnBoarding page displays
        const commentPresent = await dossierPage.getCommentsIcon().isDisplayed();
        if (commentPresent) {
            await onboardingTutorial.clickDossierOnboardingButton('ToC', 'Next');
            await onboardingTutorial.clickDossierOnboardingButton('Bookmark', 'Next');
            await since('Filter area present should be #{expected}, instead we have #{actual}')
                .expect(await onboardingTutorial.isDossierOnboardingAreaPresent('Filter'))
                .toBe(false);
            await onboardingTutorial.clickDossierOnboardingButton('Comment', 'Got It');
        } else {
            await onboardingTutorial.clickDossierOnboardingButton('ToC', 'Next');
            await onboardingTutorial.clickDossierOnboardingButton('Bookmark', 'Got It');
        }
    });

    it('[TC58025] Initial onboarding tutorial in dossier with prompt page', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: promptDossier,
        });
        await libraryPage.openDossierNoWait(promptDossier.name);
        await onboardingTutorial.waitForToCOnboardingAreaPresent();
        await since('For prompt dossier, TOC area exist should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isDossierOnboardingAreaPresent('ToC'))
            .toBe(true);
        await onboardingTutorial.clickDossierOnboardingButton('ToC', 'Next');
        await onboardingTutorial.clickDossierOnboardingButton('Bookmark', 'Next');
        const commentPresent = await dossierPage.getCommentsIcon().isDisplayed();
        if (commentPresent) {
            await onboardingTutorial.clickDossierOnboardingButton('Filter', 'Next');
            await onboardingTutorial.clickDossierOnboardingButton('Comment', 'Got It');
        } else {
            await onboardingTutorial.clickDossierOnboardingButton('Filter', 'Got It');
        }
        await promptEditor.cancelEditor();
    });

    it('[TC58027] Use Left/Right arrow to swipe page and check Skip in library introduction', async () => {
        await resetOnboardingTutorial(15);
        await since('Library Introduction should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isLibraryIntroductionPresent())
            .toBe(true);

        // swiping page in ways of left and right arrow
        await onboardingTutorial.clickMoveRightItem();
        await since('Introduction2 title should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isLibraryIntroduction2Present())
            .toBe(true);
        await onboardingTutorial.clickMoveLeftItem();
        await since('Back to Introduction title should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isLibraryIntroductionPresent())
            .toBe(true);

        // click Skip, check if onboarding tutorial still exists
        await onboardingTutorial.clickIntroToLibrarySkip();
        await since('After skip, Introduction exist should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.hasLibraryIntroduction())
            .toBe(false);
        await since('After skip, sidebar introduction should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isLibraryOnboardingAreaPresent('Sidebar'))
            .toBe(false);
        await libraryPage.openDossier(dossier.name);
        await since('After skip, toc introduction should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isDossierOnboardingAreaPresent('ToC'))
            .toBe(false);
    });

    it('[TC58028] Use three docks to swipe page and click Show Tutorial in library page', async () => {
        await userAccount.openUserAccountMenu();
        await userAccount.clickAccountOption('Take a Tour');

        // check the three dock buttons under library introduction page
        await onboardingTutorial.clickDock('second');
        await onboardingTutorial.clickDock('first');
        await onboardingTutorial.clickDock('third');

        // click Got it, open dossier, no onboarding displays
        await onboardingTutorial.clickIntroToLibraryGotIt();
        await libraryPage.openDossier(dossier.name);
        await since('TOC area exist should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isDossierOnboardingAreaPresent('ToC'))
            .toBe(false);
    });

    it('[TC58030] Check Skip of the Explore Your Library panel', async () => {
        await userAccount.openUserAccountMenu();
        await userAccount.clickAccountOption('Take a Tour');

        await onboardingTutorial.clickDock('third');
        await onboardingTutorial.clickContinueTour();
        await onboardingTutorial.clickLibraryOnboardingButton('Sidebar', 'Next');
        await onboardingTutorial.clickLibraryOnboardingButton('Explore Your Library', 'Skip');
        // open dossier, no onboarding displays
        await libraryPage.openDossier(dossier.name);
        await since('TOC area exist should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isDossierOnboardingAreaPresent('ToC'))
            .toBe(false);
    });

    it('[TC74160] Validating skip of the sidebar tutorial in Library Web', async () => {
        await userAccount.openUserAccountMenu();
        await userAccount.clickAccountOption('Take a Tour');

        await onboardingTutorial.clickDock('third');
        await onboardingTutorial.clickContinueTour();
        await onboardingTutorial.clickLibraryOnboardingButton('Sidebar', 'Skip');
        // open dossier, no onboarding displays
        await libraryPage.openDossier(dossier.name);
        await since('TOC area exist should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isDossierOnboardingAreaPresent('ToC'))
            .toBe(false);
    });

    it('[TC58032] Click Skip | Show Tutorial in dossier page', async () => {
        await libraryPage.openDossier(dossier.name);
        // check Skip button of Toc navigation onboarding
        await onboardingTutorial.clickDossierOnboardingButton('ToC', 'Skip');

        // click Show Tutorials in dossier page
        await userAccount.openUserAccountMenu();
        await userAccount.clickAccountOption('Take a Tour');
        await onboardingTutorial.clickDossierOnboardingButton('ToC', 'Skip');
        await onboardingTutorial.sleep(2000); // wait for API Complete

        // go to library, there will have onboarding tutorials
        await dossierPage.goToLibrary();
        await since('Library Introduction exist should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isLibraryIntroductionPresent())
            .toBe(true);
        await onboardingTutorial.clickDock('third');
        await onboardingTutorial.clickContinueTour();
        await onboardingTutorial.clickLibraryOnboardingButton('Sidebar', 'Next');
        await onboardingTutorial.clickLibraryOnboardingButton('Explore Your Library', 'Next');
        await onboardingTutorial.clickLibraryOnboardingButton('Right Corner', 'Got It');

        // open dossier, no onboarding displays
        await libraryPage.openDossier(dossier.name);
        await since('TOC area exist should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isDossierOnboardingAreaPresent('ToC'))
            .toBe(false);
    });

    it('[TC58033] Onboarding tutorial in library/dossier page when shown with mobile', async () => {
        await resetOnboardingTutorial(15);
        await setWindowSize(mobileWindow);

        await since('Introduction1 title should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.getIntroductionToLibraryTitleText())
            .toBe(
                'A Powerful, Intelligent Library\nInteract with dashboards, reports and documents in your library and receive real-time notifications.'
            );
        await onboardingTutorial.clickMoveRightItem();

        await dossierPage.sleep(2000); // Wait for animation to complete
        await since('Introduction2 title should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.getIntroductionToLibraryTitleText())
            .toBe('Explore Data Intuitively\nNavigate and filter through visualizations to explore your data.');
        await onboardingTutorial.clickMoveRightItem();

        await takeScreenshot('TC58033', 'IntroToLibrary3', { tolerance: 0.4 });
        await since('Introduction3 title should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.getIntroductionToLibraryTitleText())
            .toBe(
                'Seamless Sharing and Collaboration\nCreate discussion threads to collaborate and exchange ideas in real-time.'
            );
        await onboardingTutorial.clickContinueTour();

        await onboardingTutorial.sleep(2000);
        await onboardingTutorial.waitForLibraryAreaPresent('Sidebar');
        await libraryPage.hideDossierListContainer();
        await takeScreenshot('TC58033', 'Sidebar');
        await libraryPage.showDossierListContainer();
        await onboardingTutorial.clickLibraryOnboardingButton('Sidebar', 'Next');

        await onboardingTutorial.waitForLibraryAreaPresent('Explore Your Library');
        await onboardingTutorial.clickLibraryOnboardingButton('Explore Your Library', 'Next');

        await onboardingTutorial.waitForLibraryAreaPresent('Right Corner');
        await onboardingTutorial.sleep(2000); // wait for element appears
        const isTanzu = await browser.options.baseUrl.includes('hypernow');
        if (!isTanzu) {
            await libraryPage.hideDossierListContainer();
            await takeScreenshot('TC58033', 'RightCorner');
            await libraryPage.showDossierListContainer();
        }
        await onboardingTutorial.clickLibraryOnboardingButton('Right Corner', 'Got It');

        // open Dossier, there will have onboarding in dossier page
        await libraryPage.openDossier(dossier.name);
        await onboardingTutorial.waitForDossierAreaPresent('ToC');
        await takeScreenshot('TC58033', 'NavOnboarding');
        await onboardingTutorial.clickDossierOnboardingButton('ToC', 'Got It');

        // reset window size to avoid impact on other TCs
        await setWindowSize(browserWindow);
    });

    it('[TC74196] Validating onboarding tutorial for empty dossier items in group in Library Web', async () => {
        await libraryPage.clickLibraryIcon();
        await sidebar.openGroupSection('Empty Library');

        await userAccount.openUserAccountMenu();
        await userAccount.clickAccountOption('Take a Tour');

        await onboardingTutorial.clickDock('third');
        await onboardingTutorial.clickContinueTour();
        await since('Sidebar area exist should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isLibraryOnboardingAreaPresent('Sidebar'))
            .toBe(true);
        await onboardingTutorial.clickLibraryOnboardingButton('Sidebar', 'Next');
        await since('Explore Your Library area exist should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isLibraryOnboardingAreaPresent('Explore Your Library'))
            .toBe(false);
        await onboardingTutorial.clickLibraryOnboardingButton('Right Corner', 'Got It');

        await sidebar.openAllSectionList();
        await since('After got it, Explore Your Library area exist should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isLibraryOnboardingAreaPresent('Explore Your Library'))
            .toBe(false);
        await libraryPage.clickLibraryIcon();
    });

    it('[TC74197] Validating onboarding tutorial while sidebar is opening in Library Web', async () => {
        await libraryPage.openSidebar();
        await userAccount.openUserAccountMenu();
        await userAccount.clickAccountOption('Take a Tour');

        await onboardingTutorial.clickDock('third');
        await onboardingTutorial.clickContinueTour();
        await since('Sidebar area exist should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isLibraryOnboardingAreaPresent('Sidebar'))
            .toBe(true);
        await libraryPage.hideDossierListContainer();
        await takeScreenshot('TC74197', 'Sidebar tutorial while sidebar opening', { tolerance: 0.22 });
        await libraryPage.showDossierListContainer();

        await onboardingTutorial.clickLibraryOnboardingButton('Sidebar', 'Next');
        await since('Explore Your Library area exist should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isLibraryOnboardingAreaPresent('Explore Your Library'))
            .toBe(true);
        await onboardingTutorial.clickLibraryOnboardingButton('Explore Your Library', 'Next');
        await onboardingTutorial.clickLibraryOnboardingButton('Right Corner', 'Got It');
        await libraryPage.clickLibraryIcon();
    });

    it('[TC74198] Validating onboarding tutorial for search page in Library Web', async () => {
        const keyword = 'onboard';

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();

        await userAccount.openUserAccountMenu();
        await userAccount.clickAccountOption('Take a Tour');

        await onboardingTutorial.clickDock('third');
        await onboardingTutorial.clickContinueTour();
        await since('Sidebar area exist should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isLibraryOnboardingAreaPresent('Sidebar'))
            .toBe(false);

        await fullSearch.openDossierFromSearchResults(dossier.name);
        await fullSearch.switchToTab(1);

        await onboardingTutorial.waitForToCOnboardingAreaPresent();
        await onboardingTutorial.clickDossierOnboardingButton('ToC', 'Next');

        await onboardingTutorial.clickDossierOnboardingButton('Bookmark', 'Next');

        const commentPresent = await dossierPage.getCommentsIcon().isDisplayed();
        if (commentPresent) {
            await onboardingTutorial.clickDossierOnboardingButton('Filter', 'Next');
            await onboardingTutorial.clickDossierOnboardingButton('Comment', 'Got It');
        } else {
            await onboardingTutorial.clickDossierOnboardingButton('Filter', 'Got It');
        }
        await onboardingTutorial.closeTab(1);
        await onboardingTutorial.switchToTab(0);
        await dossierPage.goToLibrary();

        await since('Back to Library, Sidebar area exist should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isLibraryOnboardingAreaPresent('Sidebar'))
            .toBe(true);
        await onboardingTutorial.clickLibraryOnboardingButton('Sidebar', 'Next');
        await onboardingTutorial.clickLibraryOnboardingButton('Explore Your Library', 'Next');
        await onboardingTutorial.clickLibraryOnboardingButton('Right Corner', 'Got It');
    });

    it('[TC58034] Onboarding tutorial with empty library', async () => {
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        // use another user to test
        const credentials = customCredentials('_empty').credentials;
        await resetOnboarding({ credentials, value: 15 });
        await loginPage.login(credentials);
        await onboardingTutorial.clickDock('third');
        await onboardingTutorial.clickContinueTour();
        await since('For empty library, sidebar area exist should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.isLibraryOnboardingAreaPresent('Sidebar'))
            .toBe(true);
        await onboardingTutorial.clickLibraryOnboardingButton('Sidebar', 'Next');
        await since(
            'For empty library, Explore Your Library area exist should be #{expected}, instead we have #{actual}'
        )
            .expect(await onboardingTutorial.isLibraryOnboardingAreaPresent('Explore Your Library'))
            .toBe(false);
        await onboardingTutorial.clickLibraryOnboardingButton('Right Corner', 'Got It');
    });

    it('[TC96790] Validating initial onboarding tutorial in Report page in Library Web', async () => {
        await resetOnboardingTutorial(15);
        const reportUrl =
            browser.options.baseUrl + 'app/9D8A49D54E04E0BE62C877ACC18A5A0A/300CECC44275368CFFEE6CA44896C5A9/K53--K46';
        await browser.url(reportUrl);
        await onboardingTutorial.clickDossierOnboardingButton('Bookmark', 'Got It');
        await promptEditor.waitForEditor();
        await promptEditor.run();
    });

    it('[TC96685] Validating onboarding tutorial when TOC/Bookmark/Filter/Collaboration is disabled or navigation bar/action icon is hidden', async () => {
        // disable toc
        const disableToc =
            browser.options.baseUrl +
            'app/9D8A49D54E04E0BE62C877ACC18A5A0A/7AAC3D8B4EAFD8CEC79817A3E517F98C/K53--K46?ui.navigation.toc=false';
        await browser.url(disableToc);
        await dossierPage.waitForDossierLoading();
        await onboardingTutorial.skip();
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Take a Tour');
        await since('Bookmark title should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.getDossierViewOnboardingTitleText('Bookmark'))
            .toBe('Bookmarks');
        await onboardingTutorial.clickDossierOnboardingButton('Bookmark', 'Skip');

        // disable bookmark
        const disableBookmark =
            browser.options.baseUrl +
            'app/9D8A49D54E04E0BE62C877ACC18A5A0A/7AAC3D8B4EAFD8CEC79817A3E517F98C/K53--K46?ui.navigation.bookmark=false';
        await browser.url(disableBookmark);
        await dossierPage.waitForDossierLoading();
        await onboardingTutorial.skip();
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Take a Tour');
        await onboardingTutorial.clickDossierOnboardingButton('ToC', 'Next');
        await since('Filters title should be #{expected}, instead we have #{actual}')
            .expect(await onboardingTutorial.getDossierViewOnboardingTitleText('Filter'))
            .toBe('Filters');
        await onboardingTutorial.clickDossierOnboardingButton('Filter', 'Got It');

        // disable filter
        const disableFilter =
            browser.options.baseUrl +
            'app/9D8A49D54E04E0BE62C877ACC18A5A0A/7AAC3D8B4EAFD8CEC79817A3E517F98C/K53--K46?ui.navigation.filter=false';
        await browser.url(disableFilter);
        await dossierPage.waitForDossierLoading();
        await onboardingTutorial.skip();
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Take a Tour');
        await onboardingTutorial.clickDossierOnboardingButton('ToC', 'Next');
        await onboardingTutorial.clickDossierOnboardingButton('Bookmark', 'Got It');
    });

    async function resetOnboardingTutorial(value) {
        await resetOnboarding({
            credentials: specConfiguration.credentials,
            value,
        });
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await libraryPage.executeScript('window.localStorage.clear();');
        await loginPage.login(specConfiguration.credentials);
    }
});

export const config = specConfiguration;
