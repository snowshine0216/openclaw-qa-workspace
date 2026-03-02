import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_search') };

describe('GlobalSearch_FilterOnSearch', () => {
    let { quickSearch, fullSearch, filterOnSearch, userAccount, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    afterEach(async () => {
        await fullSearch.backToLibrary();
    });

    it('[TC70273] Global Search - Filter - Filter panel GUI and action buttons', async () => {
        const keyword = 'global search';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        await filterOnSearch.openSearchFilterPanel();
        await takeScreenshotByElement(
            filterOnSearch.getSearchFilterDropdownPanel(),
            'TC70273',
            'globalSearch_filterGUI_Initial'
        );

        // // select all
        await filterOnSearch.openFilterDetailPanel('Type');
        await filterOnSearch.selectAll();
        await since(
            'select all on Type, selected element counts on filter panel should be #{expected}, while we get #{actual}'
        )
            .expect(await filterOnSearch.getFilterSummaryTexts('Type').length)
            .toBe(3);
        await takeScreenshotByElement(
            filterOnSearch.getSearchFilterDropdownPanel(),
            'TC70273',
            'globalSearch_filterGUI_selectAll1'
        );
        await takeScreenshotByElement(
            filterOnSearch.getFilterDetailsPanel(),
            'TC70273',
            'globalSearch_filterGUI_selectAll2'
        );

        // deselect all (clear all)
        await filterOnSearch.clearAll();
        await since('clear all on Type, filter summary text should NOT be present')
            .expect(await filterOnSearch.isFilterSummaryPresent('Type'))
            .toBe(false);

        // select checkbox
        await filterOnSearch.selectOptionInCheckbox('Document');
        await filterOnSearch.selectOptionInCheckbox('Dashboard');
        await since(
            'select by checkbox, selected element counts on filter panel should be #{expected}, while we get #{actual}'
        )
            .expect(await filterOnSearch.getFilterSummaryTexts('Type').length)
            .toBe(2);

        // only
        await filterOnSearch.keepOnly('Document');
        await since(
            'select keep only, selected element counts on filter panel should be #{expected}, while we get #{actual}'
        )
            .expect(await filterOnSearch.getFilterSummaryTexts('Type').length)
            .toBe(1);
        await since('select keep only, Document should be selected and displayed on filter summary')
            .expect(await filterOnSearch.isSummaryTextExisted('Type', 'Document'))
            .toBe(true);

        // delete summary item by X
        await filterOnSearch.deleteFilterSummaryItem('Type', 'Document');
        await since('delete on filter summary, filter summary text should NOT be present')
            .expect(await filterOnSearch.isFilterSummaryPresent('Type'))
            .toBe(false);

        // clear all filter
        await filterOnSearch.selectAll();
        await filterOnSearch.clearAllFilters();
        await since('clear all filter, filter summary text should NOT be present')
            .expect(await filterOnSearch.isFilterSummaryPresent('Type'))
            .toBe(false);
        await since('clear all filter, clear all button should be disabled')
            .expect(await filterOnSearch.isClearAllDisabled())
            .toBe(true);

        // close filter panel
        await filterOnSearch.closeFilterPanel();
    });

    it('[TC70274] Global Search - Filter - Filter by CheckBox: search and view selected', async () => {
        const keyword = 'global search';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Owner');
        const initialCount = await filterOnSearch.getCheckboxItemCount();

        // view selected - no selected
        await filterOnSearch.toggleViewSelected();
        await since('view selected and no results returned, checkbox item should NOT be present')
            .expect(await filterOnSearch.isCheckboxOptionItemsPresent())
            .toBe(false);
        await filterOnSearch.toggleViewSelected();
        await since('toggle view selected again, view selected button should NOT be checked now')
            .expect(await filterOnSearch.isViewSelectedChecked())
            .toBe(false);

        // view selected - with selected
        await filterOnSearch.selectOptionInCheckbox('Xueli Yi');
        await filterOnSearch.toggleViewSelected();
        await since('view selected, displayed checbox option item count should be #{expected}, while we get #{actual}')
            .expect(await filterOnSearch.getCheckboxItemCount())
            .toBe(1);
        await filterOnSearch.toggleViewSelected();

        // search  - with results
        await filterOnSearch.searchOnFilter('xueli');
        await since(
            'search on filter, displayed checbox option item count should be #{expected}, while we get #{actual}'
        )
            .expect(await filterOnSearch.getCheckboxItemCount())
            .toBe(1);
        await filterOnSearch.clearSearchBox();
        await since(
            'search on filter and then clear, displayed checbox option item count should be #{expected}, while we get #{actual}'
        )
            .expect(await filterOnSearch.getCheckboxItemCount())
            .toBe(initialCount);

        // search - no results
        await filterOnSearch.searchOnFilter('xueliYi');
        await since('search on filter and no results returned, checkbox item should NOT be present')
            .expect(await filterOnSearch.isCheckboxOptionItemsPresent())
            .toBe(false);
        await takeScreenshotByElement(
            filterOnSearch.getSearchFilterDropdownPanel(),
            'TC70274',
            'searchOnFilter_noResults1'
        );
        await takeScreenshotByElement(filterOnSearch.getFilterDetailsPanel(), 'TC70274', 'searchOnFilter_noResults2');
        await filterOnSearch.clearSearchBox();
        await since(
            'search on filter and  no results returned, then clear, displayed checbox option item count should be #{expected}, while we get #{actual}'
        )
            .expect(await filterOnSearch.getCheckboxItemCount())
            .toBe(initialCount);
        await since('Before apply, the filter count present should be #{expected}, while we get #{actual}')
            .expect(await filterOnSearch.isFilterCountPresent())
            .toBe(false);

        await filterOnSearch.closeFilterPanel();
    });

    it('[TC70275] Global Search - Filter - Filter by Type on My Library tab and All tab', async () => {
        const keyword = 'global search';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        // check all tabs
        since('After search, All tab names should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getSearchTabNames())
            .toEqual(['All (255)', 'My Library (7)', 'Dashboards (109)', 'Reports (53)', 'Documents (93)']);
        const allTabTotal = await fullSearch.getAllTabCount();
        const allDocumentTotal = await fullSearch.getTabCountByName('Documents');
        const allDossierTotal = await fullSearch.getTabCountByName('Dashboards');
        const allReportTotal = await fullSearch.getTabCountByName('Reports');
        const mylibTotal = await fullSearch.getMyLibraryCount();

        // Filter Type on my library tab
        await fullSearch.clickMyLibraryTab();
        // --- filter on Document
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Type');
        await filterOnSearch.selectOptionInCheckbox('Document');
        await filterOnSearch.applyFilterChanged();
        const myLibDocotal = await fullSearch.getMyLibraryCount();
        since ('the types in search result should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getSearchTabNames())
            .toEqual(['All (93)', 'My Library (2)', 'Documents (93)']);
        await since(
            'Filter type on My library tab, Document counts should be less than #{expected}, while we get #{actual}'
        )
            .expect(myLibDocotal)
            .toBeLessThan(mylibTotal);
        await since('After apply on My Library, the filter count present should be #{expected}, while we get #{actual}')
            .expect(await filterOnSearch.isFilterCountPresent())
            .toBe(true);
        await since('After apply on My Library, the filter count should be #{expected}, while we get #{actual}')
            .expect(await filterOnSearch.getFilterCount())
            .toBe(1);
        // --- filter on Dossier + Report
        await filterOnSearch.openSearchFilterPanel();
        since('Filter type on My library tab, Document should be selected and displayed on filter summary')
            .expect(await filterOnSearch.isSummaryTextExisted('Type', 'Document'))
            .toBe(true);
        await filterOnSearch.clearAllFilters(); // clear first
        await filterOnSearch.openFilterDetailPanel('Type');
        await filterOnSearch.selectOptionInCheckbox('Dashboard');
        await filterOnSearch.selectOptionInCheckbox('Report');
        await filterOnSearch.applyFilterChanged();
        const dossierCount = await fullSearch.getTabCountByName('Dashboards');
        const reportCount = await fullSearch.getTabCountByName('Reports');

        since('Filter dossier + report on filter, dossier tabs should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getSearchTabNames())
            .toEqual(['All (162)', 'My Library (5)','Dashboards (109)', 'Reports (53)']);
        since('Filter type on My library tab, Dossier counts should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getMyLibraryCount())
            .toEqual(mylibTotal - myLibDocotal);
        since ('After filter type on My library tab, total counts should be equal to sum of Document, Dashboard and Report counts')
            .expect(allDocumentTotal).toEqual(allTabTotal - dossierCount - reportCount);
        // swith to dashboard tab to check count
        await fullSearch.clickTabByName('Dashboards');
        since('After filter type on My library tab, the dashboard count should be  #{expected}, while we get #{actual}')
            .expect(dossierCount)
            .toBe(allDossierTotal);
        
        // switch to report tab to check count
        await fullSearch.clickTabByName('Reports');
        since('After filter type on My library tab, the report count should be  #{expected}, while we get #{actual}')
            .expect(await fullSearch.getTabCountByName('Reports'))
            .toBe(allReportTotal);
        // --- filter on Document + report + dashboard
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Type');
        await filterOnSearch.selectOptionInCheckbox('Document');
        await filterOnSearch.applyFilterChanged();
        await fullSearch.clickTabByName('Documents'); 
        since('After add ducoment type, the tabs should be  #{expected}, while we get #{actual}')
            .expect(await fullSearch.getSearchTabNames())
            .toEqual(['All (255)', 'My Library (7)', 'Dashboards (109)', 'Reports (53)', 'Documents (93)']);
        since('After add ducoment type, the report count should be  #{expected}, while we get #{actual}')
            .expect(await fullSearch.getTabCountByName('Reports'))
            .toBe(allReportTotal);
        since('After add ducoment type, the document count should be  #{expected}, while we get #{actual}')
            .expect(await fullSearch.getTabCountByName('Documents'))
            .toBe(allDocumentTotal);
        // --- filter on Dossier 
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.clearAllFilters(); // clear first
        await filterOnSearch.openFilterDetailPanel('Type');
        await filterOnSearch.selectOptionInCheckbox('Dashboard');
        const allCount = await fullSearch.getAllTabCount();
        await since('Filter type on All tab, Dashboard should be selected and displayed on filter summary')
            .expect(await filterOnSearch.isSummaryTextExisted('Type', 'Dashboard'))
            .toBe(true);
        await filterOnSearch.applyFilterChanged();
        since('Filter type on All tab, the types in search result should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getSearchTabNames())
            .toEqual(['All (109)', 'My Library (4)', 'Dashboards (109)']);
        since('Filter type on All tab, Dashboard counts should be #{expected}, while we get #{actual}')
            .expect(allDossierTotal)
            .toBe(await fullSearch.getAllTabCount());
        since('After apply on All tab, the filter count present should be #{expected}, while we get #{actual}')
            .expect(await filterOnSearch.isFilterCountPresent())
            .toBe(true);
        since('After apply on All tab, the filter count should be #{expected}, while we get #{actual}')
            .expect(await filterOnSearch.getFilterCount())
            .toBe(1);
        // --- filter on Report
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.clearAllFilters(); // clear first
        await filterOnSearch.openFilterDetailPanel('Type');
        await filterOnSearch.selectOptionInCheckbox('Report');
        since('Filter type on All tab, Report should be selected and displayed on filter summary')
            .expect(await filterOnSearch.isSummaryTextExisted('Type', 'Report'))
            .toBe(true);
        await filterOnSearch.applyFilterChanged();
        const v = await fullSearch.getSearchTabNames();
        since('Filter type on All tab, tabs in search result should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getSearchTabNames())
            .toEqual(['All (53)','My Library (1)', 'Reports (53)']);
        since('Filter type on All tab, Dossier counts should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getAllTabCount())
            .toEqual(allTabTotal - allDocumentTotal - allDossierTotal);
    });

    it('[TC70282] Global Search - Filter - Filter by Owner on My Library tab and All tab', async () => {
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

        // Filter Owner on dashboard tab
        await fullSearch.clickTabByName('Dashboards');
        const allTotal = await fullSearch.getAllTabCount();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Owner');
        await filterOnSearch.selectOptionInCheckbox('Xueli Yi');
        await filterOnSearch.applyFilterChanged();
        const allDocTotal = await fullSearch.getAllTabCount();
        await since('Filter owner on All tab, total counts should be less than #{expected}, while we get #{actual}')
            .expect(allDocTotal)
            .toBeGreaterThan(allTotal);
        // -- reopen filter panel to check
        await filterOnSearch.openSearchFilterPanel();
        await since(
            'Filter owner on All tab and re-open, selected element counts on filter panel should be #{expected}, while we get #{actual}'
        )
            .expect(await filterOnSearch.getFilterSummaryTexts('Owner').length)
            .toBe(0);
        await filterOnSearch.closeFilterPanel();
    });

    it('[TC70276] Global Search - Filter - Filter by Certified Only on My Library tab and All tab', async () => {
        const keyword = 'global search';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);

        // Filter vertified on my library tab
        await fullSearch.clickMyLibraryTab();
        const mylibTotal = await fullSearch.getMyLibraryCount();
        const allLibraryTotal = await fullSearch.getAllTabCount();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.clickCertifiedOnlyBtn();
        since('Filter certified only on My library tab, cerified only should be selected')
            .expect(await filterOnSearch.isCerififiedOnlyChecked())
            .toBe(true);
        await takeScreenshotByElement(
            filterOnSearch.getSearchFilterDropdownPanel(),
            'TC70276',
            'filterCertified_MyLibrary'
        );
        await filterOnSearch.applyFilterChanged();
        const myLibOwnerotal = await fullSearch.getMyLibraryCount();
        since(
            'Filter certified only on My library tab, total counts should be less than #{expected}, while we get #{actual}'
        )
            .expect(myLibOwnerotal)
            .toBeLessThan(mylibTotal);
        // -- reopen filter panel to check
        await filterOnSearch.openSearchFilterPanel();
        since('Filter certified only on My library tab and re-open, cerified only should be selected')
            .expect(await filterOnSearch.isCerififiedOnlyChecked())
            .toBe(true);
        await filterOnSearch.closeFilterPanel();

        // Filter certified on All tab
        await fullSearch.clickAllTab();
        const allTotal = await fullSearch.getAllTabCount();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.clickCertifiedOnlyBtn();
        since('Filter certified only on My library tab, cerified only should be selected')
            .expect(await filterOnSearch.isCerififiedOnlyChecked())
            .toBe(false);
        await filterOnSearch.applyFilterChanged();
        const allDocTotal = await fullSearch.getAllTabCount();
        since('Filter owner on All tab, total counts should be less than #{expected}, while we get #{actual}')
            .expect(await fullSearch.getAllTabCount())
            .toBe(allLibraryTotal);
    });

    it('[TC82221] Validate global search on Report in Library Web', async () => {
        const keyword = 'report';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickAllTab();
        const allTotal = await fullSearch.getAllTabCount();

        // filter on Report
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Type');
        await filterOnSearch.selectOptionInCheckbox('Report');
        await takeScreenshotByElement(filterOnSearch.getFilterDetailPanelCheckbox(), 'TC70275', 'filterType_Report');
        await filterOnSearch.applyFilterChanged();
        const allDocTotal = await fullSearch.getAllTabCount();
        await since('Filter type on All tab, Report counts should be less than #{expected}, while we get #{actual}')
            .expect(allDocTotal)
            .toBeLessThan(allTotal);

        // -- reopen filter panel to check
        await filterOnSearch.openSearchFilterPanel();
        await since(
            'Filter Type and re-open, selected element on filter panel should be #{expected}, while we get #{actual}'
        )
            .expect(await filterOnSearch.getFilterSummaryTexts('Type').length)
            .toBe(1);
        await filterOnSearch.closeFilterPanel();
    });

    it('[TC90319] Global Search - Filter - Filter by Project on My Library tab and All tab', async () => {
        const keyword = 'search';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);

        // Filter Project on my library tab
        await fullSearch.clickMyLibraryTab();
        const mylibTotal = await fullSearch.getMyLibraryCount();
        const allTotal = await fullSearch.getAllTabCount();
        const allReportTotal = await fullSearch.getTabCountByName('Reports');

        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Project');
        since(
            'Filter project on My Library tab, project total counts should be #{expected}, while we get #{actual}'
        )
            .expect(await filterOnSearch.getCheckboxItemCount())
            .toBe(6);
        await filterOnSearch.selectOptionInCheckbox('MicroStrategy Tutorial');
        since(
            'Filter project on My library tab, MicroStrategy Tutorial should be selected and displayed on filter summary'
        )
            .expect(await filterOnSearch.isSummaryTextExisted('Project', 'MicroStrategy Tutorial'))
            .toBe(true);
        await filterOnSearch.applyFilterChanged();
        const myLibOwnerotal = await fullSearch.getMyLibraryCount();
        since('Filter project on My library tab, total counts should be #{expected}, while we get #{actual}')
            .expect(myLibOwnerotal)
            .toBe(mylibTotal);

        // Filter Project on All tab
        await fullSearch.clickAllTab();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Project');
        since('Filter project on All tab, project total counts should be #{expected}, while we get #{actual}')
            .expect(await filterOnSearch.getCheckboxItemCount())
            .toBe(6);
        await filterOnSearch.selectOptionInCheckbox('MicroStrategy Tutorial');
        await filterOnSearch.applyFilterChanged();
        const allDocTotal = await fullSearch.getAllTabCount();
        since('Filter project on All tab, total counts should be less than #{expected}, while we get #{actual}')
            .expect(allDocTotal)
            .toBe(allTotal);
        since('report tab count should be equal to total report counts #{expected}, while we get #{actual}')
            .expect(await fullSearch.getTabCountByName('Reports'))
            .toBe(allReportTotal);
        // -- reopen filter panel to check
        await filterOnSearch.openSearchFilterPanel();
        since(
            'Filter project on All tab and re-open, selected element counts on filter panel should be #{expected}, while we get #{actual}'
        )
            .expect(await filterOnSearch.getFilterSummaryTexts('Project').length)
            .toBe(0);
        await filterOnSearch.closeFilterPanel();
    });

    it('[TC90320] Global Search - Filter - Different user access to x-projects', async () => {
        const keyword = 'search';
        //login with tester_auto
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        const credentials = browsers.params.credentials;
        await loginPage.login(credentials);

        // search to check project count
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Project');
        await since('Login with tester_auto, project total counts not less than #{expected}, while we get #{actual}')
            .expect(filterOnSearch.getCheckboxItemCount())
            .not.toBeLessThan(6);
        await filterOnSearch.selectOptionInCheckbox('Web Viewer Test');
        await filterOnSearch.applyFilterChanged();
    });
});
export const config = specConfiguration;
