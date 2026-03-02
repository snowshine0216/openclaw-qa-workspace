import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_filter') };

const project = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

const browserWindow = {
    
    width: 1200,
    height: 1200,
};

let {
    loginPage,
    filterPanel,
    libraryPage,
    attributeSlider,
    searchBoxFilter,
    radiobuttonFilter,
    checkboxFilter,
    filterSummaryBar,
    grid,
    toc,
    bookmark,
    dossierPage,
} = browsers.pageObj1;

describe('FirstNLastN-searchbox', () => {
    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC63731] Validate rendering and manipulations for search box filter with FirstN/LastN in Library filter panel', async () => {
        const dossier = {
            id: '13969C504DBDFAC7DD0C5BB172209346',
            name: 'FirstN/LastN-Searchbox Filter',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        // check initial rendering for filters in dynamic on/off status
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC63731', 'SearchboxInitialRender');

        // edit dynamic filter: clear filter then reset to dynamic
        await checkboxFilter.openSecondaryPanel('Customer');
        await searchBoxFilter.openContextMenu('Customer');
        await searchBoxFilter.selectContextMenuOption('Customer', 'Clear');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Clear filter, the filter capsule count for Customer is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.capsuleCount('Customer'))
            .toBe(0);
        // Searchbox filter cannot get items before apply
        await searchBoxFilter.openContextMenu('Customer');
        await searchBoxFilter.selectContextMenuOption('Customer', 'Reset');
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC63731', 'SearchboxBeforeApply');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'After reset to dynamic, filter selection info for Customer is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('Customer'))
            .toBe('(First 5)');
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC63731', 'SearchboxAfterApply');

        // edit dynamic filter: change selections
        await checkboxFilter.openSecondaryPanel('Customer Address');
        await searchBoxFilter.toggleViewSelectedOptionOn();
        await takeScreenshotByElement(filterPanel.getSecondaryFilterPanel(), 'TC63731', 'SearchboxDesSort');
        await searchBoxFilter.selectElementByName('1 Musket Ct');
        await since(
            'Uncehck one element for dynamic filter, filter selection info for Customer Address is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('Customer Address'))
            .toBe('(9 selected)');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'After apply filter, filter selection info for Customer Address is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('Customer Address'))
            .toBe('(9 selected)');

        // change to exclude mode and reset to dynamic for fitler in dynamic off status
        await searchBoxFilter.openContextMenu('First Order Date');
        await searchBoxFilter.selectContextMenuOption('First Order Date', 'Exclude');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Change First Order Date to exclude mode, filter selection info is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('First Order Date'))
            .toBe('(1 excluded)');
        await searchBoxFilter.openContextMenu('First Order Date');
        await searchBoxFilter.selectContextMenuOption('First Order Date', 'Reset');
        await since(
            'Reset to Dynamic for searchbox filter, filter selection info is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('First Order Date'))
            .toBe('(Not First 1)');
        await since(
            'Reset to Dynamic for searchbox filter, the filter capsule count before apply is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.capsuleCount('First Order Date'))
            .toBe(0);
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Reset to Dynamic for searchbox filter, the filter capsule count after apply is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.capsuleCount('First Order Date'))
            .toBe(1);

        // test select all combine with firstN
        await checkboxFilter.openSecondaryPanel('First Order Date');
        await takeScreenshotByElement(filterPanel.getSecondaryFilterPanel(), 'TC63731', 'SearchboxUI');
        await searchBoxFilter.search('1/1/2015');
        await takeScreenshotByElement(filterPanel.getSecondaryFilterPanel(), 'TC63731', 'DisableSelectAll');
        await checkboxFilter.openSecondaryPanel('Customer');
        await searchBoxFilter.search('abc');
        await searchBoxFilter.selectAll();
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Search "abc" and select all when Customer is in dynamic status, selection for Customer filter is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('Customer'))
            .toBe('(7 selected)');
    });
});

export const config = specConfiguration;
