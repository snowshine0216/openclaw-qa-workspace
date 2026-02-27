import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_search') };

describe('E2E Global Search', () => {
    let { loginPage, dossierPage, quickSearch, fullSearch, filterOnSearch, calendarOnSearch, libraryPage } = browsers.pageObj1;
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(specConfiguration.credentials);
    });

    beforeEach(async () => {
        await quickSearch.clearRencentlySearchedAndReviewed();
        await dossierPage.goToLibrary();
        await libraryPage.dismissQuickSearch();
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    /*  1. quick search
     *   2. full screen search
     *   3. sort
     *   4. filter by owner
     *   5. filter by date
     */

    it('[TC78618_01] Validate End-to-End user journey for global search on Library Web - quick search', async () => {
        const keyword = 'globalSearch';
        await quickSearch.openSearchSlider();

        // open search suggestion on quick search
        await quickSearch.inputText(keyword);
        await since(
            'Search dossier on quick search, search suggestion shortcut items count should be #{expected}, while we get #{actual}'
        )
            .expect(await quickSearch.getSearchSuggestionShortcutsItems().length)
            .toBe(6);

        // open search suggestion dossier on quick search
        await quickSearch.openDossierFromSearchSuggestion(2);
        await since(
            'Open dossier from search suggestion, dossier should be opened successfully and dossier page is presented'
        )
            .expect(await (await dossierPage.getDossierView()).isDisplayed())
            .toBe(true);

        // back to homepage
        await dossierPage.goToLibrary();
    });

    it('[TC78618_02] Validate End-to-End user journey for global search on Library Web - full search', async () => {
        const keyword1 = 'global search';
        const dossier = '(AUTO) GlobalSearch_Keyword match';
        const chapter = 'global search chapter';

        // open dossier from matched content - chapter
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword1);
        await fullSearch.clickMyLibraryTab();
        await fullSearch.clickMatchedContentIcon(dossier);
        await since('Search by' + keyword1 + ' Matched content count should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getMatchContentCount(dossier))
            .toBe(5);
        await fullSearch.clickMatchedContentTextInNewTab(dossier, chapter);
        await since(
            'Open dossier from matched content chapter, redirected page should be #{expected}, instead we have #{actual}'
        )
            .expect(await dossierPage.title())
            .toEqual([dossier, chapter, 'global page']);
        await fullSearch.closeAllTabs();
        await dossierPage.goToLibrary();
    });

    it('[TC78618_03] Validate End-to-End user journey for global search on Library Web - Sort', async () => {
        const keyword = 'globalSearch';
        const dossier = '(AUTO) GlobalSearch_Certified dossier';

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);

        // Sort by dossier name
        await fullSearch.openSearchSortBox();
        await fullSearch.clickNthOptionInSortDropdown(2);
        await since('Sort by dossier name, selected sort option should be #{expected}, instead we have #{actual}')
            .expect(await fullSearch.getSearchSortSelectedText())
            .toEqual('Name');
        // -- check My library tab
        await fullSearch.clickMyLibraryTab();
        await since(
            'Sort by dossier name, dossier shared sort text on My library tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(dossier))
            .toContain('Updated');
        // -- check All tab
        await fullSearch.clickAllTab();
        await since(
            'Sort by dossier name, dossier shared sort text on All tab should be #{expected}, instead we have #{actual}'
        )
            .expect(await fullSearch.getDossierSharedBySortText(dossier))
            .toContain('Updated');
        // -- check sort dropdown
        await fullSearch.openSearchSortBox();
        await takeScreenshotByElement(fullSearch.getSearchSortDropdown(), 'TC78618_03', 'SortOnSearch_sortByName_All');
        await fullSearch.clickNthOptionInSortDropdown(1);

        await fullSearch.backToLibrary();
    });

    it('[TC78618_04] Validate End-to-End user journey for global search on Library Web - Filter', async () => {
        const keyword = 'global search';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);

        // Filter Owner on my library tab
        await fullSearch.clickMyLibraryTab();
        const mylibTotal = await fullSearch.getMyLibraryCount();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Owner');
        await filterOnSearch.selectOptionInCheckbox('Xueli Yi');
        await since('Filter owner on My library tab, Xueli Yi should be selected and displayed on filter summary')
            .expect(await filterOnSearch.isSummaryTextExisted('Owner', 'Xueli Yi'))
            .toBe(true);
        await filterOnSearch.applyFilterChanged();
        const myLibOwnerotal = await fullSearch.getMyLibraryCount();
        await since('Filter owner on My library tab, total counts should be #{expected}, while we get #{actual}')
            .expect(myLibOwnerotal)
            .toBe(mylibTotal);

        await fullSearch.backToLibrary();
    });

    it('[TC78618_05] Validate End-to-End user journey for global search on Library Web - Calendar', async () => {
        const keyword = 'search';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickAllTab();
        // open calendar filter
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Last Updated');
        await calendarOnSearch.openCalendarTypeSelector();
        // select after X date
        await calendarOnSearch.selectCalendarFilterTypeOption('After');
        await since('Select after, selected option should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getCalendarSelectedOption())
            .toBe('After');
        await calendarOnSearch.setInputBoxDate({ customMonth: '02', customDay: '14', customYear: '2020' });
        await since('Select after, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('After 02/14/2020');
        await filterOnSearch.applyFilterChanged();
        // check filter results
        await since('Select after, filtered results should be greater than #{expected}, instead we have #{actual} ')
            .expect(await fullSearch.getAllTabCount())
            .toBeGreaterThan(0);
        // reopen filter panel to check
        await filterOnSearch.openSearchFilterPanel();
        await since('Select after and apply, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('After 02/14/2020');
        await filterOnSearch.closeFilterPanel();
        await fullSearch.backToLibrary();
    });
});
export const config = specConfiguration;
