import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetDossierState from '../../../api/resetDossierState.js';

describe('Search on NDE', () => {
    const dossier = {
        id: '71E28D7944D9B092F42F3AB232B38DF2',
        name: 'Search on NDE',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1000,
        height: 800,
    };

    let { loginPage, searchBoxFilter, dynamicFilter, dossierPage, filterPanel, libraryPage, reset, toc, grid } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await dynamicFilter.openSecondaryPanel('Accounts(Group)');
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC56671]Search NDE with different tree level', async () => {
        // search through all level
        await dynamicFilter.searchByEnter('group');
        await takeScreenshotByElement(
            dynamicFilter.getSecondaryPanel(),
            'TC56671',
            'searchInAllLevel',
            1,
            'Search on NDE'
        );
        await since(
            'Search NDE through all levels, result count is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.searchResultCount())
            .toBe(9);
        await dynamicFilter.clearSearch();

        // search within specific level
        await dynamicFilter.selectNthSearchLevel(3);
        await dynamicFilter.searchByEnter('group');
        await dynamicFilter.selectNthSearchLevel(2);
        await since('Current search level is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dynamicFilter.currentSearchLevel())
            .toBe('Account Level 02');
        await since(
            'Search NDE within specific level, result count is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.searchResultCount())
            .toBe(2);

        // switch back to all level
        await dynamicFilter.selectNthSearchLevel(0);
        await since('Current search level is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dynamicFilter.currentSearchLevel())
            .toBe('All Levels');
        await since(
            'Search NDE switch back to all level, result count is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.searchResultCount())
            .toBe(2);
        await dynamicFilter.clearSearch();
    });

    it('[TC56672] Search NDE with different key word', async () => {
        // search with string
        await dynamicFilter.searchByEnter('group');
        await since('Search NDE with string, result count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dynamicFilter.searchResultCount())
            .toBe(9);
        await dynamicFilter.clearSearch();

        //  search with number
        await dynamicFilter.searchByEnter('123');
        await since('Search NDE with number, result count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dynamicFilter.searchResultCount())
            .toBe(2);
        await dynamicFilter.clearSearch();

        // search with special chars
        await dynamicFilter.searchByEnter('!@#');
        await since(
            'Search NDE with special chars, result count is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.searchResultCount())
            .toBe(1);
        await dynamicFilter.clearSearch();
    });

    it('[TC56673] Selection status update on search results', async () => {
        await dynamicFilter.searchByEnter('group');

        // branch select - expanded element
        await dynamicFilter.clickBranchSelectionButton('Asset & Current Assets(group parent&child)');
        await since(
            'Select expanded branch in search page, selected count is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.selectedResultCount())
            .toBe(2);

        // branch select - collapsed element
        await dynamicFilter.clickBranchSelectionButton('Net Income(Root group)');
        await since(
            'Continue to select collapsed branch in search page, selected count is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.selectedResultCount())
            .toBe(6);

        // branch deselect
        await dynamicFilter.clickBranchSelectionButton('Operating Profit(Parent group 123)');
        await since(
            'Continue to deselect branch in search page, selected count is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.selectedResultCount())
            .toBe(4);

        // single select
        await dynamicFilter.singleSelectElement('Operating Profit(Parent group 123)');
        await since(
            'Continue to single select in search page, selected count is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.selectedResultCount())
            .toBe(5);

        // single deselect
        await dynamicFilter.singleDeselectElement('Allowance & Inventory(group same level)');
        await since(
            'Continue to single deselect in search page, selected count is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.selectedResultCount())
            .toBe(4);
        await takeScreenshotByElement(
            dynamicFilter.getSecondaryPanel(),
            'TC56673',
            'selectionStatus_searchPage',
            1,
            'Search on NDE',
            { tolerance: 0.2 }
        );

        // back to hierarchy tree
        await dynamicFilter.clearSearch();
        await since('Back to hierarchy tree, selected count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dynamicFilter.selectedResultCount())
            .toBe(8);
    });

    it('[TC56677] Apply search results ', async () => {
        await dynamicFilter.searchByEnter('group');
        await dynamicFilter.clickBranchSelectionButton('Asset & Current Assets(group parent&child)');
        await dynamicFilter.singleDeselectElement('Allowance & Inventory(group same level)');
        await filterPanel.apply();

        // validate data consistence with grid
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(18);

        // validate selection status with hierarchy tree
        await filterPanel.openFilterPanel();
        await dynamicFilter.openSecondaryPanel('Accounts(Group)');
        await takeScreenshotByElement(
            dynamicFilter.getSecondaryPanel(),
            'TC56677',
            'applySearchResult_hierarchyTree',
            2,
            'Search on NDE'
        );
        await since(
            'Apply filter after select/deselect on search page, selected count is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await dynamicFilter.selectedResultCount())
            .toBe(7);
    });

    it('[TC56679] Clear search results ', async () => {
        await dynamicFilter.searchByEnter('group');
        await dynamicFilter.clickBranchSelectionButton('Asset & Current Assets(group parent&child)');

        //// clear search key, will back to hierarchy tree
        await dynamicFilter.clearSearch();
        await takeScreenshotByElement(
            dynamicFilter.getSecondaryPanel(),
            'TC56679',
            'clearSearchKey',
            1,
            'Search on NDE'
        );

        //// search again, selection status is unchanged
        await dynamicFilter.searchByEnter('group');
        await since('Search again, selected count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dynamicFilter.selectedResultCount())
            .toBe(2);

        //// clear filter
        await filterPanel.clearFilter();
        await since('Clear filter, selected count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await dynamicFilter.selectedResultCount())
            .toBe(0);
    });

    it('[TC56683] Search NDE on filter panel within searchBox', async () => {
        // await filterPanel.closeFilterPanel();
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'searchbox search' });
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await searchBoxFilter.openSecondaryPanel('Accounts(Group)');

        //search key
        await searchBoxFilter.search('group');
        await since(
            'Search NDE in filter panel searchBox, result count is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.searchResults())
            .toBe('9 results found');

        // select element
        await searchBoxFilter.selectElementByName('Net Income(Root group)');
        await since(
            'Element [' +
                'Net Income(Root group)' +
                '] selected status should be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.isElementSelected('Net Income(Root group)'))
            .toBe(true);

        // keep only
        await searchBoxFilter.hoverOnElement('Operating Profit(Parent group 123)');
        await searchBoxFilter.keepOnly('Operating Profit(Parent group 123)');
        await since(
            'Element `Operating Profit(Parent group 123)` keep only link highlighted status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.isKeepOnlyLinkDisplayed('Operating Profit(Parent group 123)'))
            .toBe(true);

        // view selected
        await searchBoxFilter.toggleViewSelectedOptionOn();
        await since('view selected element count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.visibleElementCount())
            .toBe(1);

        // apply
        await filterPanel.apply();
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(2);
    });
});
