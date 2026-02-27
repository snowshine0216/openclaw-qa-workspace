import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetBookmarks from '../../../api/resetBookmarks.js';

/**
 * Dossier Content:
 * 01 Dossier filter panel
 * 02 Bookmark
 * 03 Show data
 * 04 Dossier linking
 * 05 Context menu : sort, keep only, excliude, drill
 * 06 In-canvas selector
 * 07 Dossier menu buttonss : TOC, reset, redo/undo
 * 08 Share dossier
 */
describe('E2E Per Build Test on Dossier Content', () => {
    const dossier = {
        id: '3D5AD91611E8285C3D690080EFA5ACC6',
        name: 'Financial Analysis',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };
    const recipientCredentials = {
        username: browsers.params.credentials.webServerUsername,
        password: browsers.params.credentials.webServerPassword,
    };

    let {
        dossierPage,
        libraryPage,
        toc,
        filterPanel,
        onboardingTutorial,
        checkboxFilter,
        filterSummaryBar,
        searchBoxFilter,
        bookmark,
        grid,
        inCanvasSelector,
        baseVisualization,
        showDataDialog,
        share,
        textbox,
        reset,
        shareDossier,
        notification,
        loginPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(browsers.params.credentials);

        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier,
        });

        await resetBookmarks({
            credentials: browsers.params.credentials,
            dossier: dossier,
        });

        if (await onboardingTutorial.hasLibraryIntroduction()) {
            await onboardingTutorial.clickIntroToLibrarySkip();
        }
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier,
        });
        await dossierPage.sleep(500);
    });

    afterEach(async () => {
        await libraryPage.resetToLibraryHome();
        await dossierPage.sleep(500);
    });

    /**
     * [TC80590_01] Dossier filter panel
     * 1. Select exclude mode and Apply, check the results
     * 2. Re-open filter panel, clear selection
     * 3. Click select all then clear all
     * 4. Search and Select some elements, click Apply
     * 5. Open filter summary to check
     */

    it('[TC80590_01] Library Web - Content - Dossier filter panel', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Financial Statements', pageName: 'Financial Statements' });

        await filterPanel.openFilterPanel();
        await since('Default Filter selection text is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Quarter'))
            .toBe('(Last 4)');
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC80590', 'Dossier Filter Panel: Initial');

        // exclude
        await checkboxFilter.openContextMenu('Quarter');
        await checkboxFilter.selectContextMenuOption('Quarter', 'Exclude');
        await since('Select exclude, Filter selection text is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Quarter'))
            .toBe('(Not Last 4)');
        await filterPanel.apply();
        // clear filter
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await takeScreenshotByElement(
            filterPanel.getFilterPanelWrapper(),
            'TC80590',
            'Dossier Filter Panel: Clear All Filters'
        );
        // select all
        await checkboxFilter.openSecondaryPanel('Quarter');
        await checkboxFilter.selectAll();
        await since('Select all, Filter selection text is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Quarter'))
            .toBe('(12/12)');
        // keep only
        await checkboxFilter.hoverOnElement('2018 Q3');
        await checkboxFilter.keepOnly('2018 Q3');
        await since('Select all, Filter selection text is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Quarter'))
            .toBe('(1/12)');
        // search and select
        await checkboxFilter.search('2018');
        await checkboxFilter.selectElementByName('2018 Q4');
        await since('Select all, Filter selection text is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Quarter'))
            .toBe('(2/12)');
        await filterPanel.apply();

        // filter summary
        await since('The filterSummaryBar of Quarter should #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Quarter'))
            .toBe('(2018 Q3, 2018 Q4)');
        await filterSummaryBar.viewAllFilterItems();
        await since('The filterPanelItems of Quarter should #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Quarter'))
            .toBe('2018 Q3,2018 Q4');
        await dossierPage.goToLibrary();
    });

    /**
     *  [TC80590_02] Bookmarks
     *  1. Open bookmark panel:
     *  2. Add bookmark directly without input customized nam
     *  3. Edit bookmark by change the name
     *  4. Do some manipulation and check if the save icon display
     *  5. Add new bookmarks
     *  6. Share bookmark
     *  7. Single delete one bookmark
     *  8. Multi- delete other bookmark
     *  9. Close bookmark panel
     */
    it('[TC80590_02] Library Web - Content - Bookmark and share bookmark', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Financial Statements', pageName: 'Financial Statements' });
        await bookmark.openPanel();
        await takeScreenshotByElement(bookmark.getPanel(), 'TC80590', 'Bookmark panel');

        // add
        await bookmark.addNewBookmark('');
        await since('New bookmark, number of Bookmark should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkCount())
            .toBe(1);
        // edit
        await bookmark.renameBookmark('Bookmark 1', 'Bookmark Edited');
        await bookmark.closePanel();
        // update and apply
        await inCanvasSelector.selectItem('Balance Sheet');
        await bookmark.openPanel();
        await bookmark.addNewBookmark('Customized Bookmark');
        await bookmark.applyBookmark('Bookmark Edited');
        // share bookmark
        await bookmark.openPanel();
        await bookmark.shareBookmark('Bookmark Edited');
        await since('current selected shared BM should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getCurrentSelectionText())
            .toBe('Bookmark Edited');
        await shareDossier.searchRecipient('web');
        await shareDossier.selectRecipients(['web']);
        await shareDossier.shareDossier();
        // delete bookmark
        await bookmark.openPanel();
        await bookmark.deleteBookmark('Bookmark Edited');
        await since('Delete bookmark,Number of Bookmark should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkCount())
            .toBe(1);
        // bulk delete bookmark
        await bookmark.editBulkDeleteBookmarks();
        await bookmark.selectAllToDelete();
        await bookmark.bulkDeleteBookmarks();
        await bookmark.confirmDelete();
        await since('Bulk delete bookmarrrk, number of Bookmark should be #{expected}, instead we have #{actual}')
            .expect(await bookmark.bookmarkCount())
            .toBe(0);
        await bookmark.closePanel();

        await dossierPage.goToLibrary();
    });

    /**
     *  [TC80590_03] Show data
     *  1. Click show data
     *  2. Select some attribute/metric
     *  3. Click "OK", check the data
     *  4. Click Export > Data
     *  5. Close show data window
     */
    it('[TC80590_03] Library Web - Content - Show data', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Overview', pageName: 'Overview' });

        // select show data
        await baseVisualization.selectShowDataOnVisualizationMenu('Revenue Detail');
        await showDataDialog.clickAddDataButton();
        await showDataDialog.addElementToDataset({ title: 'Attributes', elem: 'Category' });
        await showDataDialog.clickAddDataOkButton();
        await dossierPage.waitForPageLoading();
        await since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(48);
        await showDataDialog.clickShowDataCloseButton();

        await dossierPage.goToLibrary();
    });

    /**
     *  [TC80590_04] Dossier linking
     *  1. Open overview page
     *  2. Link to target page by click text link
     *  3. Back to Overview page by TOC menu
     *  4. Link to another pagee by text link
     */
    it('[TC80590_04] Library Web - Content - Dossier linking', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Overview', pageName: 'Overview' });

        // text- link to Page 1
        await textbox.navigateLink(1);
        await since('Link to Page from Text, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since('Link to Page from Text, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Financial Analysis', 'Financial Statements', 'Financial Statements']);

        // Switch page and link to aother page
        await toc.openPageFromTocMenu({ chapterName: 'Overview', pageName: 'Overview' });
        await textbox.navigateLink(2);
        await since('Link to Page from Text, back icon should NOT be appeared')
            .expect(await dossierPage.isBackIconPresent())
            .toBe(false);
        await since('Link to Page from Text, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Financial Analysis', 'Analysis', 'Cost/Revenue']);

        await dossierPage.goToLibrary();
    });

    /**
     *  [TC80590_05] Grid context menu
     *  1. Click sort
     *  2. Click keep only
     *  3. Click to Drill->Year
     *  4. Select one or more elements on Year, click exclude
     *  5. check the filter condition
     */
    it('[TC80590_05] Library Web - Content - Sort, keep only, exclude and drill', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Financial Operations', pageName: 'Travel & Expense' });

        // sort
        await grid.selectGridContextMenuOption({
            title: 'Expense Details',
            headerName: 'Resource Name',
            firstOption: 'Sort Descending',
        });

        // Exclude
        await grid.selectGridContextMenuOption({
            title: 'Expense Details',
            headerName: 'Resource Name',
            elementName: 'Zonda Goforth',
            firstOption: 'Exclude',
        });

        // keep only
        await grid.selectGridContextMenuOption({
            title: 'Expense Details',
            headerName: 'Resource Name',
            elementName: 'Zollie Goozee',
            firstOption: 'Keep Only',
        });

        // drill
        await grid.selectGridContextMenuOption({
            title: 'Expense Details',
            headerName: 'Resource Name',
            elementName: 'Zollie Goozee',
            firstOption: 'Drill',
            secondOption: 'Year',
        });

        // check view filter
        await grid.openViewFilterContainer('Expense Details');
        await since('Grid view filter Clear "Resource Name = Zonda Goforth" should be existed')
            .expect(await grid.isViewFilterItemPresent('Clear "Resource Name = Zollie Goozee"'))
            .toBe(true);
        await since('Grid view filter Clear "Not Year = 2018 OR 2019" should be existed')
            .expect(await grid.isViewFilterItemPresent('Clear "Not Resource Name = Zonda Goforth"'))
            .toBe(true);
        await since('Grid view filter: Clear drill conditionss should be existed')
            .expect(await grid.isViewFilterItemPresent('Clear drill conditions'))
            .toBe(true);

        await dossierPage.goToLibrary();
    });

    /**
     *  [TC80590_06] In-canvas selector
     *  1. Open dossier
     *  2. Click panel selector to filter
     *  3. Click another  to filtere panel stack
     */
    it('[TC80590_06] Library Web - Content - In-canvas selector', async () => {
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Financial Statements', pageName: 'Financial Statements' });

        // panel selector
        await inCanvasSelector.selectItem('Balance Sheet');
        await since('Select item Balance Sheet, item selected should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.isItemSelected('Balance Sheet'))
            .toBe(true);

        // switch to another panel
        await inCanvasSelector.selectItem('Cash Flow');
        await since('Select item Cash Flow, item selected should be #{expected}, while we get #{actual}')
            .expect(await inCanvasSelector.isItemSelected('Cash Flow'))
            .toBe(true);
        //await takeScreenshotByElement(inCanvasSelector.getElement(), 'TC80590', 'In-canvas Selector');

        await dossierPage.goToLibrary();
    });

    /**
     *  [TC80590_07] Dossier menu buttons
     *  1. Open dossier
     *  2. Switch page  by TOC menu
     *  3. Click Undo
     *  4. click redo
     *  5. Click reset
     */
    it('[TC80590_07] Library Web - Content - Toc, reset and redo/undo', async () => {
        await libraryPage.openDossier(dossier.name);
        // TOC
        await toc.openPageFromTocMenu({ chapterName: 'Financial Operations', pageName: 'Travel & Expense' });
        await since('Switch to page from TOC, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Financial Analysis', 'Financial Operations', 'Travel & Expense']);

        // Undo /redo
        await dossierPage.clickUndo();
        await dossierPage.waitForItemLoading(); // wait for page loading
        await since('After click Undo, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Financial Analysis', 'Overview', 'Overview']);
        await dossierPage.clickRedo();
        await dossierPage.waitForItemLoading(); // wait for page loading
        await since('After click Redo, target page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.title())
            .toEqual(['Financial Analysis', 'Financial Operations', 'Travel & Expense']);

        // reset
        await reset.selectReset();
        await reset.confirmReset();
        await since('Reset disable is supposed to be #{expected}, instead we have #{actual}')
            .expect(await reset.isResetDisabled())
            .toBe(true);

        await dossierPage.goToLibrary();
    });

    /**
     *   [TC80590_08] Share Dossier
     *   1. Open dosssier
     *   2. Click Share icon to open Share panel
     *   3. Click copy link and validatee
     *   4. Search recipinet, and add msg, share dossier
     *   5.Recipient open notification panel to check
     *   6. Clear notificaiton msg
     */
    it('[TC80590_08] Library Web - Content - Share dossier', async () => {
        const currentUrl = browser.options.baseUrl;
        const baseURL = currentUrl.trim().endsWith('/') ? currentUrl.trim() : currentUrl.trim() + '/';

        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Overview', pageName: 'Overview' });
        await dossierPage.openShareDropDown();
        await share.openShareDossierDialog();

        // search and select recipient
        await shareDossier.searchRecipient('web');
        await shareDossier.selectRecipients(['web']);
        await since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(true);
        await shareDossier.addMessage('per build automation test');
        //  copy Link
        await shareDossier.sleep(500);
        await since('Share Link should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getLink())
            .toBe(baseURL + 'app/' + dossier.project.id + '/' + dossier.id + '/share');
        // share
        await shareDossier.shareDossier();
        await shareDossier.sleep(1000);
        await dossierPage.goToLibrary();

        // check notificationn
        await notification.openPanelAndWaitListMsg();
        await since('Open notificaiton, the first msg should be #{expected}, instead we have #{actual}')
            .expect(await notification.getNotificationMsgByIndex(0).getText())
            .toBe('web shared Financial Analysis with you.');
        await notification.clearAllMsgs();
        await notification.closePanel();
    });
});
