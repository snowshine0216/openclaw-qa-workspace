import resetBookmarks from '../../../api/resetBookmarks.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot } from '../../../utils/TakeScreenshot.js';

describe('Guest', () => {
    const dossier = {
        id: 'D3B642B84B7C39002668F990DA49ADDE',
        name: 'Reset',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier_Last = {
        id: 'B0DB48344671B27800F7088F47E5CBE1',
        name: 'Auto_LastView_Dossier',
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

    let {
        bookmark,
        checkboxFilter,
        dossierPage,
        filterPanel,
        grid,
        libraryPage,
        loginPage,
        onboardingTutorial,
        reset,
        toc,
        userAccount,
        sidebar,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.loginAsGuest();

        await libraryPage.sleep(5000); // wait for login
        await onboardingTutorial.clickIntroToLibrarySkip();
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC66100] Dossier - Reset -- No reset icon for guest user', async () => {
        await libraryPage.openDossier(dossier.name);
        await since('isResetDisabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetPresent())
            .toBe(false);
    });

    it('[TC70781_11] Validate X-func for Default View on Library Web Working as expected - guest mode', async () => {
        // Open rsd and manipulate: switch page and show data
        await libraryPage.openDossierAndRunPrompt(dossier_Last.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await dossierPage.goToLibrary();

        // Re-open Dossier to check status
        await libraryPage.openDossierAndRunPrompt(dossier_Last.name);
        await since('Base Dossier title on guest mode should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([dossier_Last.name, 'Chapter 1', 'Page 1']);
    });

    it('[TC85251] Validate no Preference button for Guest User on Library Web', async () => {
        await libraryPage.openUserAccountMenu();
        await since('preference present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await userAccount.isPreferencePresent())
            .toBe(false);
    });

    it('[TC90450] Validate sidebar for Guest mode', async () => {
        await libraryPage.openCustomAppById({ id: 'D055C3242F5D487E951F13006A350F55' });
        await libraryPage.openSidebarOnly();
        await since('isRecents present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await sidebar.isPredefinedSectionItemPresent('Recents'))
            .toBe(true);
        await since('isContentDiscovery present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await sidebar.isPredefinedSectionItemPresent('Browse Folders'))
            .toBe(true);
        await since('isContentGroup present is supposed to be #{expected}, instead we have #{actual}')
            .expect(await sidebar.getDefaultGroupsTitle())
            .toBe('Default Groups');
    });
});
