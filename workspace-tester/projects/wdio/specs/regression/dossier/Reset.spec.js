import resetBookmarks from '../../../api/resetBookmarks.js';
import resetBookmarksWithPrompt from '../../../api/resetBookmarksWithPrompt.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import generateViewDossierLink from '../../../api/generateViewDossierLink.js';

describe('Reset', () => {
    const dossier = {
        id: 'D3B642B84B7C39002668F990DA49ADDE',
        name: 'Reset',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier2 = {
        id: '8F6EB0E54EA3A77F4E500E8C322ED135',
        name: 'Reset - New',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier3 = {
        id: '957A9C7B462A52FA24A07B8BA02F788F',
        name: 'Dossier sanity_General',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
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
        promptEditor,
        share,
        reset,
        toc,
        shareDossier,
        dossierAuthoringPage,
        libraryAuthoringPage,
        userAccount,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier,
        });
        await resetBookmarks({
            credentials: browsers.params.credentials,
            dossier,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    /** @wdio premerge */
    it('[TC28197] Check for reset enabling after navigating to another page', async () => {
        await libraryPage.openDossier(dossier.name);

        // Reset button is disabled when there is no change
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);
        //Navigate to another page
        await dossierPage.switchPageByKey('right', 2000);
        await since('Dossier page title is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Reset', 'Reset Chapter 1', 'Reset Page 2']);
        //Check if reset is enabled and reset the page
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(false);
        await reset.selectReset();
        await reset.confirmReset();
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);
        await since('Dossier page title is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Reset', 'Reset Chapter 1', 'Reset Page 1']);
    });

    it('[TC28198] Check for reset enabling due to manipulation on the visualization', async () => {
        await libraryPage.openDossier(dossier.name);

        // Reset button is disabled when there is no change
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);

        //Make changes on the grid vizualization
        await grid.selectGridContextMenuOption({
            title: 'Reset Grid 1',
            headerName: 'Call Center',
            firstOption: 'Sort Ascending',
        });
        //Check if changes applied successfully
        await since('The first element of Call Center attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Reset Grid 1', headerName: 'Call Center' }))
            .toBe('Atlanta');

        // Reset button should now be enabled
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(false);
        await reset.selectReset();
        await reset.confirmReset();

        // Reset button should be disabled after reset applied
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);

        //Check if dossier was reset successfully
        await since('The first element of Call Center attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Reset Grid 1', headerName: 'Call Center' }))
            .toBe('Milwaukee');
    });

    //Filter Suite begins
    it('[TC28199] Checking reset state after applying a filter and clearing it & Cancel filter functionality', async () => {
        await libraryPage.openDossier(dossier.name);

        // Reset button is disabled when there is no change
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);

        //Apply a filter
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Region');
        await checkboxFilter.selectElementByName('Central');
        await filterPanel.apply();

        //Check if reset is enabled
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(false);

        //Clearing the applied filter
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();

        //Checking if reset is enabled
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(false);

        //Check for Cancel Reset
        await reset.selectReset();
        await reset.cancelReset();
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(false);
    });

    it('[TC28200] Checking reset state after opening a dossier with previous modifications', async () => {
        await libraryPage.openDossier(dossier.name);

        //Navigate to another page
        await dossierPage.switchPageByKey('right', 2000);
        await since('Dossier page title is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Reset', 'Reset Chapter 1', 'Reset Page 2']);

        //Navigate to Library
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(dossier.name);

        //Checking reset state
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(false);
        await reset.selectReset();
        await reset.confirmReset();

        // Reset button should be disabled after reset applied
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);
    });
    //Filter Suite ends

    it('[TC28201] Check for reset enabling due to bookmarks created at the original state of dossier', async () => {
        await libraryPage.openDossier(dossier.name);

        // Reset button is disabled when there is no change
        await since('Reset is supposed to be disabled when there is no change, but it is enabled')
            .expect(await reset.isResetDisabled())
            .toBe(true);

        // Create a bookmark without manipulations
        await bookmark.openPanel();
        await bookmark.addNewBookmark('Original Dossier State');
        await bookmark.closePanel();

        // Reset button is disabled when there is no change
        await since(
            'Reset is supposed to be disabled when there is no change except bookmarks being created, but it is enabled'
        )
            .expect(await reset.isResetDisabled())
            .toBe(true);

        // Reset dossier
        await dossierPage.switchPageByKey('right', 1000);
        await reset.selectReset();
        await reset.confirmReset();

        // Select a bookmark without manipulations
        await bookmark.openPanel();
        await since('Bookmark with the name Original Dossier State should be present, but it is not')
            .expect(await bookmark.isBookmarkPresent('Original Dossier State'))
            .toBe(true);
        await bookmark.applyBookmark('Original Dossier State');

        // Check if the bookmark is applied successfully
        await since('The first element of Call Center attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Reset Grid 1', headerName: 'Call Center' }))
            .toBe('Milwaukee');

        // Expect reset to be enabled
        await since(
            'Reset is supposed to be enabled after applying a bookmark without manipulations, but it is disabled'
        )
            .expect(await reset.isResetDisabled())
            .toBe(false);
    });

    it('[TC28202] Check for reset enabling due to bookmarks created after changing original state of dossier', async () => {
        await libraryPage.openDossier(dossier.name);

        // Pre-create a bookmark with manipulations
        await grid.selectGridContextMenuOption({
            title: 'Reset Grid 1',
            headerName: 'Call Center',
            firstOption: 'Sort Ascending',
        });
        await bookmark.openPanel();
        await bookmark.addNewBookmark('Call Center Sort Ascending');
        await bookmark.closePanel();
        await reset.selectReset();
        await reset.confirmReset();

        // Reset button is disabled when there is no change
        await since('Reset is supposed to be disabled when there is no change, but it is enabled')
            .expect(await reset.isResetDisabled())
            .toBe(true);

        // Select a bookmark with manipulations
        await bookmark.openPanel();
        await since('Bookmark with the name Call Center Sort Ascending should be present, but it is not')
            .expect(await bookmark.isBookmarkPresent('Call Center Sort Ascending'))
            .toBe(true);
        await bookmark.applyBookmark('Call Center Sort Ascending');

        // Check if the bookmark is applied successfully
        await since('The first element of Call Center attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Reset Grid 1', headerName: 'Call Center' }))
            .toBe('Atlanta');

        // Expect reset to be enabled
        await since('Reset is supposed to be enabled after applying a bookmark with manipulations')
            .expect(await reset.isResetDisabled())
            .toBe(false);

        //Reset the dossier
        await reset.selectReset();
        await reset.confirmReset();
    });

    it('[TC66098] Dossier - Reset -- No reset icon for dossier not in the Library', async () => {
        const dossier2Url = browser.options.baseUrl + 'app/' + dossier2.project.id + '/' + dossier2.id;
        // await browser.url(dossier2Url, 30000);
        await browser.url(dossier2Url, 30000);

        await since('isResetDisabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetPresent())
            .toBe(false);
    });

    it('[TC56141] Dossier - Reset -- Swipe pages after reset dossier', async () => {
        await libraryPage.openDossier(dossier.name);
        await dossierPage.switchPageByKey('right', 2000);

        //Reset the dossier
        await reset.selectReset();
        await reset.confirmReset();

        // Quickly swipe pages without loading
        await dossierPage.switchPageByKey('right', 0);
        await dossierPage.switchPageByKey('right', 0);
        await dossierPage.switchPageByKey('right', 0);
        await dossierPage.switchPageByKey('right', 0);

        // GO back to one of previous pages and check layout
        await toc.openPageFromTocMenu({ chapterName: 'Reset Chapter 1', pageName: 'Reset Page 3' });
        await since('Reset is supposed to be enabled after swipe pages')
            .expect(await reset.isResetDisabled())
            .toBe(false);
        await since('Page title should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual(['Reset', 'Reset Chapter 1', 'Reset Page 3']);
        await since('The first element of Quarter should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Reset Grid 3', headerName: 'Units Sold' }))
            .toBe('753,564');
    });

    it('[TC84218] Dossier toolbar UI when open dossier via url other than from library home', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier3,
        });

        await resetBookmarksWithPrompt({
            credentials: browsers.params.credentials,
            dossier: dossier3,
        });

        // open dossier via url
        const dossierUrl = await generateViewDossierLink(dossier3);
        await libraryPage.switchToNewWindowWithUrl(dossierUrl);
        await dossierPage.waitForDossierLoading();

        // check UI for dossier toolbar
        // TOC panel
        await toc.openMenu();
        await toc.hideTocTimeStamp();
        await takeScreenshotByElement(toc.getTOCPanel(), 'TC84218', 'TOC Panel');
        await toc.showTocTimeStamp();

        // reset dialog
        await reset.selectReset();
        await takeScreenshotByElement(reset.getConfirmDialog(), 'TC84218', 'Reset Dialog');
        await reset.cancelReset();

        // bookmark panel
        await bookmark.openPanel();
        await takeScreenshotByElement(bookmark.getPanel(), 'TC84218', 'Empty Bookmark');
        await bookmark.addNewBookmark('');
        await bookmark.hoverOnBookmark('Bookmark 1');
        await bookmark.hideBookmarkTimeStamp();
        await takeScreenshotByElement(bookmark.getPanel(), 'TC84218', 'Bookmark Panel', { tolerance: 0.15 });
        await bookmark.showBookmarkTimeStamp();
        await bookmark.closePanel();

        // prompt page
        await promptEditor.reprompt();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC84218', 'prompt page', { tolerance: 0.2 });
        await promptEditor.cancelEditor();

        // filter panel
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Quarter');
        await takeScreenshotByElement(checkboxFilter.getFilterMainPanel(), 'TC84218', 'fitler main panel');
        await takeScreenshotByElement(checkboxFilter.getSecondaryPanel(), 'TC84218', 'fitler sub panel');
        await filterPanel.clearFilter();

        // shared panel
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await shareDossier.openBMList();
        await shareDossier.hideBookmarkTimeStamp();
        await shareDossier.hideSharedUrl();
        await shareDossier.hideTimeAndName();
        await takeScreenshotByElement(shareDossier.getShareDossierDialog(), 'TC84218', 'shareDossierDialog');
        await shareDossier.showBookmarkTimeStamp();
        await shareDossier.showSharedUrl();
        await shareDossier.showTimeAndName();
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.closeDialog();

        // account panel
        await userAccount.openUserAccountMenu();
        await takeScreenshotByElement(userAccount.getAccountDropdown(), 'TC84218', 'accountPanel');
        await userAccount.closeUserAccountMenu();

        await libraryPage.closeTab(1);
        await libraryPage.openDossier(dossier3.name);
    });

    it('[TC84221] Dossier toolbar UI when open dossier via library authoring page other than from library home', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier3,
        });

        await resetBookmarksWithPrompt({
            credentials: browsers.params.credentials,
            dossier: dossier3,
        });

        // open dossier via library authoring page
        await libraryPage.openDossier(dossier3.name);
        await dossierPage.waitForDossierLoading();
        await libraryAuthoringPage.editDossierFromLibraryWithNoWait();
        await promptEditor.run();
        await dossierAuthoringPage.clickCloseDossierButton();

        // check UI for dossier toolbar
        // TOC panel
        await toc.openMenu();
        await toc.hideTocTimeStamp();
        await takeScreenshotByElement(toc.getTOCPanel(), 'TC84221', 'TOC Panel');
        await toc.showTocTimeStamp();

        // reset dialog
        await reset.selectReset();
        await takeScreenshotByElement(reset.getConfirmDialog(), 'TC84221', 'Reset Dialog');
        await reset.cancelReset();

        // bookmark panel
        await bookmark.openPanel();
        await takeScreenshotByElement(bookmark.getPanel(), 'TC84221', 'Empty Bookmark');
        await bookmark.addNewBookmark('');
        await bookmark.hoverOnBookmark('Bookmark 1');
        await bookmark.hideBookmarkTimeStamp();
        await takeScreenshotByElement(bookmark.getPanel(), 'TC84221', 'Bookmark Panel', { tolerance: 0.15 });
        await bookmark.showBookmarkTimeStamp();
        await bookmark.closePanel();

        // prompt page
        await promptEditor.reprompt();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC84221', 'prompt page', { tolerance: 0.2 });
        await promptEditor.cancelEditor();

        // filter panel
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Quarter');
        await takeScreenshotByElement(checkboxFilter.getFilterMainPanel(), 'TC84221', 'fitler main panel');
        await takeScreenshotByElement(checkboxFilter.getSecondaryPanel(), 'TC84221', 'fitler sub panel');
        await filterPanel.clearFilter();

        // shared panel
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await shareDossier.openBMList();
        await shareDossier.hideBookmarkTimeStamp();
        await shareDossier.hideSharedUrl();
        await shareDossier.hideTimeAndName();
        await takeScreenshotByElement(shareDossier.getShareDossierDialog(), 'TC84221', 'shareDossierDialog');
        await shareDossier.showBookmarkTimeStamp();
        await shareDossier.showSharedUrl();
        await shareDossier.showTimeAndName();
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.closeDialog();

        // account panel
        await userAccount.openUserAccountMenu();
        await takeScreenshotByElement(userAccount.getAccountDropdown(), 'TC84221', 'accountPanel');
        await userAccount.closeUserAccountMenu();
    });
});
