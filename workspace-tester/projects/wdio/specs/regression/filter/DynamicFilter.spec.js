import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Dynamic Filter', () => {
    const dossier = {
        id: 'B22561A54372B99237B922BB22CAD079',
        name: 'Dynamic Filter',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const gdde = {
        id: '7F7EB3FF4E23F1589FB73C8FDAC2D79B',
        name: 'Dynamic Filter - GDDE',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const essbase = {
        id: 'AFBF2B814F3E7B6D2DF69D9633F929D1',
        name: 'ESSbase - Security filter',
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
        loginPage,
        toc,
        dynamicFilter,
        dossierPage,
        filterPanel,
        libraryPage,
        filterSummary,
        filterSummaryBar,
        radiobuttonFilter,
        searchBoxFilter,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC56660]Branch selection', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        /*** Select branch ***/
        await filterPanel.openFilterPanel();
        await dynamicFilter.openSecondaryPanel('Accounts');
        await dynamicFilter.clickBranchSelectionButton('Balance Sheet');
        await since(
            'Branch select "Balance Sheet", selection status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Balance Sheet'))
            .toBe(true);
        // Expand parent node, child nodes should also be selected and dynamic
        await dynamicFilter.expandElement('Balance Sheet');
        // await dynamicFilter.sleep(1000000000);
        await takeScreenshotByElement(dynamicFilter.getSecondaryPanel(), 'TC56660', 'HierarchyStructure');
        await since('Selection status for child node is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dynamicFilter.isSelected('Assets'))
            .toBe(true);
    });

    it('[TC56662]Single selection', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        /*** Single deselect element ***/
        await filterPanel.openFilterPanel();
        await dynamicFilter.openSecondaryPanel('Accounts');
        await dynamicFilter.clickBranchSelectionButton('Balance Sheet');
        await dynamicFilter.expandElement('Balance Sheet');
        await dynamicFilter.singleDeselectElement('Balance Sheet');
        await since('Selection status for BalanceSheet is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dynamicFilter.isSelected('Balance Sheet'))
            .toBe(false);
        await since(
            'Single deselect father branch, selection status for child node is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Assets'))
            .toBe(true);
        await filterPanel.apply();
        await since(
            'Single deselect father branch, filterSummary is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummary.filterItems('Accounts'))
            .toBe('(Balance Sheet, exclude Balance Sheet)');

        // Expanded/collapsed status should be saved after applying filter
        await filterPanel.openFilterPanel();
        await dynamicFilter.openSecondaryPanel('Accounts');
        await since(
            'Apply filter and open filter again, expand status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isExpanded('Balance Sheet'))
            .toBe(true);
        await filterPanel.closeFilterPanel();
    });

    it('[TC56663]Level selection', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier,
        });
        await libraryPage.openDossier(dossier.name);

        /*** Select level ***/
        await filterPanel.openFilterPanel();
        await dynamicFilter.openSecondaryPanel('Accounts');
        await dynamicFilter.clickLevelIcon();
        await dynamicFilter.selectLevelByName('Account Level 02');
        await takeScreenshotByElement(dynamicFilter.getSecondaryPanel(), 'TC56663', 'LevelMenu');
        // close level panel
        await dynamicFilter.clickLevelIcon();
        await dynamicFilter.expandElement('Net Income');
        await since(
            'Select level 2, selection status for node in level 2 is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Operating Profit'))
            .toBe(true);
        await dynamicFilter.expandElement('Operating Profit');
        await since(
            'Select level 2, selection status for node in level 3 is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Operating Expenses'))
            .toBe(false);
        /*** Branch selection & level selection ***/
        // first click, deselect 'Operating Profit'
        await dynamicFilter.clickBranchSelectionButton('Operating Profit');
        // second click, select branch 'Operating Profit'
        await dynamicFilter.clickBranchSelectionButton('Operating Profit');
        await since(
            'Select level 2 and branch select node in level 2, selection status for node in level 2 is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Operating Profit'))
            .toBe(true);
        await since(
            'Select level 2 and branch select node in level 2, selection status for node in level 3 is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Operating Expenses'))
            .toBe(true);
        // Clear level
        await dynamicFilter.clickLevelIcon();
        await dynamicFilter.selectLevelByName('Account Level 03');
        await dynamicFilter.clearLevelByName('Account Level 03');
        await dynamicFilter.clickLevelIcon();
        await since(
            'Clear level 3, selection status for node in level 3 is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Operating Expenses'))
            .toBe(false);
        // Check capsule in filter panel
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC56663', 'CapsuleInFilterPanel');
        await filterPanel.apply();
    });

    it('[TC56666]Level in branch', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        /*** Level in branch and level ***/
        await dynamicFilter.openSecondaryPanel('Accounts');
        await dynamicFilter.clickLevelIcon();
        await dynamicFilter.selectLevelByName('Account Level 02');
        await dynamicFilter.clickLevelIcon();
        // Select "Account level 03"(first level in this branch) in branch "Operating Profit"
        await dynamicFilter.expandElement('Net Income');
        await dynamicFilter.clickLevelInBranchButton('Operating Profit');
        await dynamicFilter.selectLevelByName('Account Level 03');
        await takeScreenshotByElement(dynamicFilter.getSecondaryPanel(), 'TC56666', 'LevelInBranchMenu');
        await dynamicFilter.clickLevelInBranchButton('Operating Profit');
        await dynamicFilter.expandElement('Operating Profit');
        await since(
            'Select level 3 in Operating Profit branch, selection status for node in level 3 is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Operating Expenses'))
            .toBe(true);
        await dynamicFilter.expandElement('Other Income and Expense');
        await since(
            'Select level 3 in Operating Profit branch, selection status for level 3 in other branch is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Interest Income'))
            .toBe(false);
        // Clear level
        await dynamicFilter.clickLevelIcon();
        // Now all levels in the branch are dynamic
        await dynamicFilter.selectLevelByName('Account Level 03');
        await dynamicFilter.clearLevelByName('Account Level 03');
        await dynamicFilter.clickLevelIcon();
        await since(
            'Clear level 3, selection status for level 3 in Operating Profit branch is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Operating Expenses'))
            .toBe(false);
        await dynamicFilter.clickLevelInBranchButton('Operating Profit');
        await dynamicFilter.clickLevelInBranchButton('Operating Profit');
        /*** Clear all ***/
        await dynamicFilter.clearAll();

        /*** Level in branch and branch ***/
        await dynamicFilter.clickBranchSelectionButton('Balance Sheet');
        await dynamicFilter.clickLevelInBranchButton('Balance Sheet');
        // level in the branch should be dynamic when branch is selected
        await dynamicFilter.clearLevelByName('Account Level 02');
        await dynamicFilter.closeLevelInBranchContextMenu('Balance Sheet');
        await dynamicFilter.expandElement('Balance Sheet');
        await since(
            'Clear level 2 in branch, selection status for level in branch is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Assets'))
            .toBe(false);
        await filterPanel.apply();
        await since('Filter summary is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummary.filterItems('Accounts'))
            .toBe('(Balance Sheet, exclude Account Level 02 of Balance Sheet)');
    });

    it('[TC56667]Search', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        /*** Search in all levels ***/
        await dynamicFilter.openSecondaryPanel('Accounts');
        await dynamicFilter.searchByEnter('Assets');
        await takeScreenshotByElement(dynamicFilter.getSecondaryPanel(), 'TC56667', 'SearchResult');
        await since('Search in all levels, result count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dynamicFilter.searchResultCount())
            .toBe(4);
        await dynamicFilter.clickBranchSelectionButton('Assets');
        await since(
            'Select branch in search page, selected count is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.selectedResultCount())
            .toBe(3);
        await dynamicFilter.clearSearch();
        await dynamicFilter.expandElement('Balance Sheet');
        await dynamicFilter.singleDeselectElement('Assets');
        await dynamicFilter.searchByEnter('Assets');
        await since('Single deselect a node, selected count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dynamicFilter.selectedResultCount())
            .toBe(2);
        /*** Search in certain level ***/
        await dynamicFilter.selectNthSearchLevel(2);
        await since(
            'Select Nth Search Level, current search level is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.currentSearchLevel())
            .toBe('Account Level 02');
        // 'Headcount' has not been expanded, so choose this element
        await dynamicFilter.clearSearch();
        await dynamicFilter.searchByClick('headcount');
        await since(
            'Search for un-expanded element, search result is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.searchResultCount())
            .toBe(1);
        await dynamicFilter.singleSelectElement('Headcount');
        // Switch to "All levels", result doesn't change
        await dynamicFilter.selectNthSearchLevel(0);
        await since('Switch to all level, search result is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dynamicFilter.searchResultCount())
            .toBe(1);
        await dynamicFilter.clearSearch();
        await dynamicFilter.collapseElement('Balance Sheet');
        await dynamicFilter.expandElement('Statistical Accounts');
        await since(
            'Select node in search page, back to structure page selection status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.isSelected('Headcount'))
            .toBe(true);
    });

    it('[TC56668]Hierarchical Attributes with Drop-down style', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        // For dynamic filter in drop down style, it shows as radio button filter in Library
        await dynamicFilter.openSecondaryPanel('Date.Calendar');
        await radiobuttonFilter.selectElementByName('All Periods');
        await since('Select "All Periods" is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.isElementSelected('All Periods'))
            .toBe(true);
        // This is a flat list, so it's static selection
        await since('Select "All Periods", its child is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.isElementSelected('CY 2001'))
            .toBe(false);
        // Test capsules and manipulations in filter panel
        await radiobuttonFilter.openContextMenu('Date.Calendar');
        await radiobuttonFilter.selectContextMenuOption('Date.Calendar', 'Exclude');
        // Test search function
        await radiobuttonFilter.search('CY 2001');
        await since('Search "CY 2001", first element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.elementByOrder(0))
            .toBe('CY 2001');
        await since('Search "CY 2001", 4th element is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.elementByOrder(3))
            .toBe('Q4 CY 2001');
        await radiobuttonFilter.selectElementByName('CY 2001');
        await radiobuttonFilter.clearSearch();
        await since('Select "CY 2001" is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.isElementSelected('CY 2001'))
            .toBe(true);
        await filterPanel.apply();
        await since('Filter summary is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummary.filterItems('Date.Calendar'))
            .toBe('(exclude CY 2001)');
    });

    it('[TC56669]Hierarchical Attributes with Search-box style', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        // For dynamic filter in Search-box style, it's same as searchbox filter.
        await dynamicFilter.openSecondaryPanel('Date.Date');
        // Search and select can work
        await searchBoxFilter.search('July');
        await searchBoxFilter.selectElementByName('July 1, 2001');
        await searchBoxFilter.selectElementByName('July 2, 2001');
        await searchBoxFilter.selectElementByName('July 3, 2001');
        await since('Element `July 1, 2001` Selected is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.isElementSelected('July 1, 2001'))
            .toBe(true);
        await since('Element `July 2, 2001` Selected is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.isElementSelected('July 2, 2001'))
            .toBe(true);
        await since('Element `July 3, 2001` Selected is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.isElementSelected('July 3, 2001'))
            .toBe(true);
        // "only" can work
        await searchBoxFilter.keepOnly('July 3, 2001');
        await since('After keeponly "July 3, 2001" element is selected')
            .expect(await searchBoxFilter.isElementSelected('July 3, 2001'))
            .toBe(true);
        await since('After keeponly "July 3, 2001" element is selected')
            .expect(await searchBoxFilter.isElementSelected('July 1, 2001'))
            .toBe(false);
        // Select/Clear all is visible and enabled
        await since('Select All enabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.isSelectAllEnabled())
            .toBe(true);
        // Clear search can work
        await searchBoxFilter.clearSearch();
        await takeScreenshotByElement(dynamicFilter.getSecondaryPanel(), 'TC56669', 'AfterClearSearch');
        // Exclude can work
        await searchBoxFilter.openContextMenu('Date.Date');
        await searchBoxFilter.selectContextMenuOption('Date.Date', 'Exclude');
        await filterPanel.apply();
        await since('Filter summary is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummary.filterItems('Date.Date'))
            .toBe('(exclude July 3, 2001)');
    });

    it('[TC56670]Full screen', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();
        await dynamicFilter.openSecondaryPanel('Accounts');
        // expand full screen
        await dynamicFilter.expandFullScreen();
        await takeScreenshotByElement(dynamicFilter.getSecondaryPanel(), 'TC56670', 'ExpandFullScreen', {
            tolerance: 0.2,
        });
        await dynamicFilter.contractFullScreen();
        await takeScreenshotByElement(dynamicFilter.getSecondaryPanel(), 'TC56670', 'ContractFullScreen');
    });

    it('[TC66180]RA filter -- GDDE', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: gdde,
        });
        await libraryPage.openDossier(gdde.name);
        await filterPanel.openFilterPanel();

        // check selections in source filter can filter target filter
        await dynamicFilter.openSecondaryPanel('Account');
        await dynamicFilter.clickBranchSelectionButton('Assets');
        await filterPanel.waitForGDDE();
        await dynamicFilter.openSecondaryPanel('Accounts');
        await since('Expand status for Balance Sheet is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dynamicFilter.isCollapsed('Balance Sheet'))
            .toBe(true);
        await dynamicFilter.expandElement('Balance Sheet');
        await takeScreenshotByElement(dynamicFilter.getSecondaryPanel(), 'TC66180', 'TargetFilter');
        await filterPanel.apply();
        await since('Filter summary for Accounts should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Account'))
            .toBe('(Assets)');

        // check selections in target filter can apply successfully
        await filterPanel.openFilterPanel();
        await dynamicFilter.openSecondaryPanel('Account');
        await dynamicFilter.selectAll();
        await dynamicFilter.openSecondaryPanel('Accounts');
        await dynamicFilter.clickBranchSelectionButton('Net Income');
        await filterPanel.apply();
        await since('Filter summary for Account should be #{expected}, while we got #{actual}')
            .expect(await filterSummaryBar.filterItems('Account'))
            .toBe('(All Accounts)');
        await since('Filter summary for Accounts should be #{expected}, while we got #{actual}')
            .expect(await filterSummaryBar.filterItems('Accounts'))
            .toBe('(Net Income)');
    });

    it('[TC73767]RA filter -- GDDE in NDE', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: gdde,
        });
        await libraryPage.openDossier(gdde.name);
        await toc.openPageFromTocMenu({ chapterName: 'Target to Group', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await filterPanel.dockFilterPanel();

        // check selections in source filter can filter target filter
        // branch selection
        await dynamicFilter.openSecondaryPanel('Accounts');
        await dynamicFilter.expandElement('Balance Sheet');
        await dynamicFilter.clickBranchSelectionButton('Assets');
        await filterPanel.waitForGDDE();
        await dynamicFilter.openSecondaryPanel('Group Assets&Operating Profit');
        await filterPanel.apply();
        await since('Filter summary for Accounts should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Accounts'))
            .toBe('(Assets)');

        // level selection
        await filterPanel.clearFilter();
        await dynamicFilter.openSecondaryPanel('Accounts');
        await dynamicFilter.clickLevelIcon();
        await dynamicFilter.selectLevelByName('Account Level 02');
        await filterPanel.waitForGDDE();
        await dynamicFilter.openSecondaryPanel('Group Assets&Operating Profit');

        // check selections in target filter can apply successfully
        await dynamicFilter.clickBranchSelectionButton('Taxes');
        await filterPanel.apply();
        await since('Filter summary for Accounts should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Accounts'))
            .toBe('(Account Level 02)');
        await since('Filter summary for NDE should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Group Assets&Operating Profit'))
            .toBe('(Taxes)');
    });

    it('[TC18661]RA filter -- add security filter', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: essbase,
        });
        await libraryPage.openDossier(essbase.name);
        await filterPanel.openFilterPanel();

        // check filtered by security filter
        await dynamicFilter.openSecondaryPanel('Geography');
        await takeScreenshotByElement(dynamicFilter.getSecondaryPanel(), 'TC18661', 'SecurityFilter');

        // check branch selection can be applied
        await dynamicFilter.clickBranchSelectionButton('South');
        await filterPanel.apply();
        await since('Filter summary for Geography should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Geography'))
            .toBe('(South)');

        // check level selection can be applied
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await dynamicFilter.openSecondaryPanel('Geography');
        await dynamicFilter.clickLevelIcon();
        await dynamicFilter.selectLevelByName('Geography.GeoRegion');
        await filterPanel.apply();
        await since('Filter summary for Geography should be #{expected}, while we got #{actual}')
            .expect(await filterSummary.filterItems('Geography'))
            .toBe('(Geography.GeoRegion)');
    });
});
