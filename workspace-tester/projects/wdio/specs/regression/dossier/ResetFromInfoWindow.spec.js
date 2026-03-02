import { customCredentials } from '../../../constants/index.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetReportState from '../../../api/reports/resetReportState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_new') };

describe('Reset - Reset from Info Window', () => {
    const dossier = {
        id: '4CC4B507448BA2E0365EEA8AAE52FABE',
        name: 'Reset - Dossier without Prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier2 = {
        id: 'FB5336FE4C592C339E986C8B385B6BD4',
        name: 'Reset - Dossier with Prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossier3 = {
        id: '73EE73614618EAF965AFA199772BABE1',
        name: 'Reset - New',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document = {
        id: '372EE4864F4D2FA279F6F8940C46F75E',
        name: 'Reset - RSD without Prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document2 = {
        id: 'BC26EC35495DC29EBD65FFA3792E9773',
        name: 'Reset - RSD with Prompt',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const report = {
        id: 'AAEB73B640E57D299629CAB3B85E8880',
        name: '(AUTO) Web Report_Base',
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
        dossierPage,
        grid,
        rsdGrid,
        libraryPage,
        loginPage,
        infoWindow,
        promptEditor,
        search,
        reset,
        reportPage,
        fullSearch,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    it('[TC56739] Check for reset state of new added dossier', async () => {
        // Reset button is disabled when a dossier is new added
        await libraryPage.moveDossierIntoViewPort(dossier3.name);
        await libraryPage.openDossierInfoWindow(dossier3.name);
        await since('isResetDisabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isResetDisabled())
            .toBe(true);
        await infoWindow.showIconTooltip({ option: 'Reset' });
        await infoWindow.close();
    });

    it('[TC56740] Check for tooltip and cancel/confirm reset', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        // The tooltip should be "Reset"
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await since('isResetDisabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isResetDisabled())
            .toBe(false);
        await since('tooltip is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.showIconTooltip({ option: 'Reset' }))
            .toBe('Reset');

        //Check for Cancel Reset
        await infoWindow.selectReset();
        await infoWindow.cancelReset();

        //Check for Confirm Reset
        await infoWindow.selectReset();
        await infoWindow.confirmReset();
        await dossierPage.waitForDossierLoading();

        // Reset button in dossier should be disabled after reset
        await since('The first element of Revenue should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Reset Grid 1', headerName: 'Revenue' }))
            .toBe('$4,182,139');
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);
        await dossierPage.goToLibrary();
    });

    it('[TC56741] Check for grid due to reset from info window after navigating to another page', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        // Reset button is disabled when there is no change
        await libraryPage.openDossier(dossier.name);
        await since('The first element of Revenue should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Reset Grid 1', headerName: 'Revenue' }))
            .toBe('$4,182,139');
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);

        //Navigate to another page
        await dossierPage.switchPageByKey('right', 2000);
        await since('Dossier page title is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Reset - Dossier without Prompt', 'Reset Chapter 1', 'Reset Page 2']);
        await since('The first element of Units Sold should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Reset Grid 2', headerName: 'Units Sold' }))
            .toBe('753,564');
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(false);
        await dossierPage.goToLibrary();

        //Reset from info window and run dossier
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await since('isResetDisabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isResetDisabled())
            .toBe(false);
        await infoWindow.selectReset();
        await infoWindow.confirmReset();
        await dossierPage.waitForDossierLoading();

        // Reset button in dossier should be disabled after reset and go back to initial page
        await since('Dossier page title is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Reset - Dossier without Prompt', 'Reset Chapter 1', 'Reset Page 1']);
        await since('The first element of Revenue should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Reset Grid 1', headerName: 'Revenue' }))
            .toBe('$4,182,139');
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);
        await dossierPage.goToLibrary();
    });

    it('[TC56742] Check for grid due to reset from info window after manipulation on the visualization after', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        // Reset button is disabled when there is no change
        await libraryPage.openDossier(dossier.name);
        await since('Dossier page title is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Reset - Dossier without Prompt', 'Reset Chapter 1', 'Reset Page 1']);
        await since('ResetDisabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);

        //Make changes on the grid visualization
        await grid.selectGridContextMenuOption({
            title: 'Reset Grid 1',
            headerName: 'Region',
            firstOption: 'Sort Descending',
        });

        await since('ResetDisabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(false);
        await since('The first element of Revenue should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Reset Grid 1', headerName: 'Revenue' }))
            .toBe('$3,902,762');
        await dossierPage.goToLibrary();

        //Reset from info window and run dossier
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await since('isResetDisabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isResetDisabled())
            .toBe(false);
        await infoWindow.selectReset();
        await infoWindow.confirmReset();
        await dossierPage.waitForDossierLoading();

        // Reset button in dossier should be disabled after reset and go back to initial grid
        await since('ResetDisabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);
        await since('The first element of Revenue should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Reset Grid 1', headerName: 'Revenue' }))
            .toBe('$4,182,139');
        await dossierPage.goToLibrary();
    });

    it('[TC56743] Check for bookmarks after reset from info window', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await resetBookmarks({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        // Reset button is disabled when there is no change
        await libraryPage.openDossier(dossier.name);
        await since('The first element of Revenue should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Reset Grid 1', headerName: 'Revenue' }))
            .toBe('$4,182,139');
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);

        //Navigate to another page
        await dossierPage.switchPageByKey('left', 2000);
        await since('The first element of Revenue should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Reset Grid 1', headerName: 'Revenue' }))
            .toBe('$4,182,139');
        await since('Dossier page title is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Reset - Dossier without Prompt', 'Reset Chapter 1', 'Reset Page 1']);

        // Create a bookmark after page swapping
        await bookmark.openPanel();
        await bookmark.addNewBookmark('New Bookmark');
        await bookmark.closePanel();
        await dossierPage.goToLibrary();

        //Reset from info window and run dossier
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await since('isResetDisabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isResetDisabled())
            .toBe(false);
        await infoWindow.selectReset();
        await infoWindow.confirmReset();
        await dossierPage.waitForDossierLoading();

        // Reset button in dossier should be disabled after reset and go back to initial grid
        await since('The first element of Revenue should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Reset Grid 1', headerName: 'Revenue' }))
            .toBe('$4,182,139');
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);

        // Check the bookmark existed and select it
        await bookmark.openPanel();
        await since('Bookmark list is supposed to be 1')
            .expect(await bookmark.bookmarkCount())
            .toBe(1);
        await bookmark.applyBookmark('New Bookmark');
        await dossierPage.waitForPageLoading();
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(false);
        await dossierPage.goToLibrary();

        //Reset from info window and run dossier
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.selectReset();
        await infoWindow.confirmReset();
        await dossierPage.waitForDossierLoading();

        // Reset button in dossier should be disabled after reset and go back to initial grid
        await since('The first element of Revenue should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Reset Grid 1', headerName: 'Revenue' }))
            .toBe('$4,182,139');
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);
        await dossierPage.goToLibrary();
    });

    it('[TC56744] After reset a dossier with prompt from info window, prompt panel should show', async () => {
        // After reset a dossier with prompt, the prompt panel shows
        await libraryPage.moveDossierIntoViewPort(dossier2.name);
        await libraryPage.openDossierInfoWindow(dossier2.name);
        await since('isResetDisabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isResetDisabled())
            .toBe(false);
        await infoWindow.selectReset();
        await infoWindow.confirmResetWithPrompt();
        await promptEditor.waitForEditor();
        await promptEditor.closeEditor();
    });

    it('[TC56745] Reset a RSD without prompt from info window (in search)', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: document,
        });
        // Reset button is disabled when there is no change
        await libraryPage.openDossier(document.name);
        const grid1 = rsdGrid.getRsdGridByKey('W55454197F7FE4FDFAE6538FC48E0AFA0');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData(1))
            .toEqual(['Region', 'Category', 'Subcategory', 'Cost', 'Cost Growth', 'Profit', 'Revenue', 'Units Sold']);
        await since('The second row should be #{expected}, instead we get #{actual}')
            .expect(await grid1.getOneRowData(2))
            .toEqual(['Central', 'Books', 'Art & Architecture', '$39,796', '0', '$11,972', '$51,768', '3,190']);
        await since('ResetDisabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);

        //Make changes on the grid visualization
        await grid.selectGridContextMenuOption({
            title: '',
            headerName: 'Region',
            firstOption: 'Sort Descending',
        });
        await since('After sorting, The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid1.getOneRowData(1))
            .toEqual(['Region', 'Category', 'Subcategory', 'Cost', 'Cost Growth', 'Profit', 'Revenue', 'Units Sold']);
        await since('After sorting, The second row should be #{expected}, instead we get #{actual}')
            .expect(await grid1.getOneRowData(2))
            .toEqual(['Web', 'Books', 'Art & Architecture', '$35,495', '1', '$10,547', '$46,042', '2,805']);
        await since('After sorting, ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(false);
        await dossierPage.goToLibrary();

        // Setup Search Results Page
        await search.openSearchSlider();
        await search.inputTextAndOpenSearchPage(document.name);
        await fullSearch.clickMyLibraryTab();
        await search.clickSearchResultInfoIcon(document.name);

        // Reset from info window after search
        await since('isResetDisabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isResetDisabled())
            .toBe(false);
        await infoWindow.selectReset();
        await infoWindow.confirmReset();
        await dossierPage.waitForDossierLoading();
        // DE169857
        // await since('The attribute should be #{expected}, instead we have #{actual}')
        //     .expect(await grid1.getOneRowData(1)).toEqual(['Region', 'Category', 'Subcategory', 'Cost', 'Cost Growth', 'Profit', 'Revenue', 'Units Sold']);
        // await since('The second row should be #{expected}, instead we get #{actual}')
        //     .expect(await grid1.getOneRowData(2)).toEqual(['Central', 'Books', 'Art & Architecture', '$39,796', '0', '$11,972', '$51,768', '3,190']);
        // await since('ResetDisabled is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await reset.isResetDisabled()).toBe(true);
        await dossierPage.goToLibrary();
    });

    it('[TC56746] After reset a RSD with prompt from info window, prompt panel should show', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: document2,
        });

        // After reset a dossier with prompt, the prompt panel shows
        await libraryPage.moveDossierIntoViewPort(document2.name);
        await libraryPage.openDossierInfoWindow(document2.name);
        await since('isResetDisabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isResetDisabled())
            .toBe(false);
        await infoWindow.selectReset();
        await infoWindow.confirmResetWithPrompt();
        await promptEditor.waitForEditor();
        await promptEditor.closeEditor();
    });

    it('[TC86817] Check for Report reset from info window', async () => {
        await resetReportState({
            credentials: specConfiguration.credentials,
            dossier: report,
        });

        await libraryPage.moveDossierIntoViewPort(report.name);
        await libraryPage.openDossierInfoWindow(report.name);
        await since('isResetDisabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isResetDisabled())
            .toBe(false);
        await infoWindow.selectReset();
        await infoWindow.confirmReset();
        await reportPage.waitForReportLoading();
        await since('ResetEnabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);
        await dossierPage.goToLibrary();
    });

    it('[TC56748] Responsive UI Check', async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });

        // Check responsive for the UI
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.showIconTooltip({ option: 'Reset' });
        await infoWindow.selectReset();
        await takeScreenshotByElement(infoWindow.getMainInfo(), 'TC56748', '1000_ClickReset');
        await infoWindow.confirmReset();
        await dossierPage.waitForDossierLoading();
        await since('The first element of Revenue should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Reset Grid 1', headerName: 'Revenue' }))
            .toBe('$4,182,139');
        // await since('isResetDisabled is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await infoWindow.isResetDisabled()).toBe(true);
        await takeScreenshotByElement(dossierPage.getLeftNavBar(), 'TC56748', '1000_NavigationBar_ResetButton');
        await dossierPage.goToLibrary();

        await setWindowSize({
            width: 630,
            height: 800,
        });
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.selectReset();
        await takeScreenshotByElement(infoWindow.getMainInfo(), 'TC56748', '600_ClickReset');
        await infoWindow.cancelReset();
        // After clicking the cancel reset button, it disappears and now the mouse hovers on the subscription button.
        // Sometimes this triggers the tooltip of the subscription button.
        // Moving mouse to the object id label (which doesn't have an hover style) to make the subscription tooltip consistently disappear.
        await infoWindow.hover({ elem: libraryPage.getLibraryIcon() });
        await takeScreenshotByElement(infoWindow.getMainInfo(), 'TC56748', '600_CancelReset');
        await infoWindow.close();

        await setWindowSize({
            width: 400,
            height: 800,
        });
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.selectReset();
        await libraryPage.hover({ elem: libraryPage.getLibraryIcon() });
        await takeScreenshotByElement(infoWindow.getMainInfo(), 'TC56748', '400_ClickReset');
        await infoWindow.cancelReset();
        await infoWindow.close();

        await setWindowSize({
            browserInstance: browsers.browser1,
            width: 1000,
            height: 800,
        });
    });
});

export const config = specConfiguration;
