import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_filter') };
const specConfiguration_only2014privilege = { ...customCredentials('_only2014privilege') };

const dossier = {
    id: '80D2FD014A3F5CD64A1330B8B93A33B5',
    name: '(Auto) Clear All Filters',
    project: {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    },
};

const browserWindow = {
    
    width: 1200,
    height: 1200,
};

describe('Filter - Clear All Filters', () => {
    let {
        filterPanel,
        libraryPage,
        checkboxFilter,
        searchBoxFilter,
        attributeSlider,
        radiobuttonFilter,
        dynamicFilter,
        grid,
        textbox,
        filterSummaryBar,
        userAccount,
        loginPage,
        toc,
        dossierPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
    });

    it('[TC85936_01] Verify Functionality of Clear All Filters button when there is no item selected - unset', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'unset' });
        await filterPanel.openFilterPanel();

        // In unset status, clear all filters button will not clear filter and apply button disabled
        await filterPanel.clearFilter();
        await since('No changes made, Apply Button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isApplyEnabled())
            .toBe(false);
    });

    it('[TC85936_02] Verify Functionality of Clear All Filters button when there is no item selected - not unset but has been cleared - clear in context menu', async () => {
        // checkbox; clear in conext menu
        // Not in unset status and the filter has been cleared, clear all filters button will not clear filter and apply button disabled
        await toc.openPageFromTocMenu({ chapterName: 'dossier linking' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openContextMenu('Year');
        await checkboxFilter.selectContextMenuOption('Year', 'Clear');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await since('No changes made, Apply Button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isApplyEnabled())
            .toBe(false);
    });

    it('[TC85936_03] Verify Functionality of Clear All Filters button when there is no item selected - not unset but has been cleared - clear selections', async () => {
        //radio button; clear selections
        // Not in unset status and the filter has been cleared, clear all filters button will not clear filter and apply button disabled
        await toc.openPageFromTocMenu({ chapterName: 'all filter types' });
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('Quarter');
        await radiobuttonFilter.clearSelection();
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await since('No changes made, Apply Button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isApplyEnabled())
            .toBe(false);
    });

    it('[TC85936_04] Verify Functionality of Clear All Filters button when there is no item selected - not unset but has been cleared - clear all', async () => {
        // search box; clear all
        // Not in unset status and the filter has been cleared, clear all filters button will not clear filter and apply button disabled
        await toc.openPageFromTocMenu({ chapterName: 'deselect all' });
        await filterPanel.openFilterPanel();
        await searchBoxFilter.openSecondaryPanel('Year');
        await searchBoxFilter.search('*');
        await checkboxFilter.clearAll();
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await since('No changes made, Apply Button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isApplyEnabled())
            .toBe(false);
    });

    it('[TC85936_05] Verify Functionality of Clear All Filters button when there is no item selected - not unset but has been cleared - deselect', async () => {
        // dropdown; clear all
        // Not in unset status and the filter has been cleared, clear all filters button will not clear filter and apply button disabled
        await toc.openPageFromTocMenu({ chapterName: 'circular target' });
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('Year');
        await radiobuttonFilter.selectElementByName('2014');
        await checkboxFilter.openSecondaryPanel('Quarter');
        await checkboxFilter.selectElementByName('2014 Q1');
        await filterPanel.apply();

        // clear all
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('Year');
        await radiobuttonFilter.clearSelection();
        await checkboxFilter.openSecondaryPanel('Quarter');
        await checkboxFilter.clearAll();
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await since('No changes made, Apply Button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isApplyEnabled())
            .toBe(false);
    });

    it('[TC85936_06] Verify Functionality of Clear All Filters button - Source pass filter to target, target does not include the filter element', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'dossier linking' });
        await textbox.navigateLink(0);
        await since(
            'No data for target viz since Year = 2016 from source viz and Year = 2014 from filter panel are applied'
        )
            .expect(await grid.isVizEmpty('Visualization 1'))
            .toBe(true);
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await filterPanel.apply();
        await since('Clear All Filters, filter summary should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('No filter selections');
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(9);

        // checkbox, when filter is cleared, apply button is disabled
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await since(
            'when there is no item selected, after clear all filters, Apply Button is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isApplyEnabled())
            .toBe(false);
        await dossierPage.goBackFromDossierLink();
    });

    it('[TC85936_07] Verify Functionality of Clear All Filters button - circular target', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'circular target' });
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('Year');
        await radiobuttonFilter.selectElementByName('2014');
        await checkboxFilter.openSecondaryPanel('Quarter');
        await checkboxFilter.selectElementByName('2015 Q1');
        await checkboxFilter.selectElementByName('2016 Q1');
        await filterPanel.apply();
        await since(
            'No data for target viz since Year = 2014 from source viz and Year = 2014 from filter panel are applied'
        )
            .expect(await grid.isVizEmpty('Visualization 1'))
            .toBe(true);
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await filterPanel.apply();
        await since('Clear All Filters, filter summary should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('No filter selections');
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(13);

        // radio button, when filter is cleared, apply button is disabled
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await since(
            'when there is no item selected, after clear all filters, Apply Button is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isApplyEnabled())
            .toBe(false);
    });

    it('[TC85936_08] Verify Functionality of Clear All Filters button - deselect all', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'deselect all' });
        await since(
            'No data for target viz since Year = 2014 from source viz and Year = 2014 from filter panel are applied'
        )
            .expect(await grid.isVizEmpty('Visualization 1'))
            .toBe(true);
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await filterPanel.apply();
        await since('Clear All Filters, filter summary should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('No filter selections');
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(13);

        // searchbox, when filter is cleared, apply button is disabled
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await since(
            'when there is no item selected, after clear all filters, Apply Button is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isApplyEnabled())
            .toBe(false);
    });

    it('[TC85936_09] Verify Functionality of Clear All Filters button - intersection of prompt and filter is empty', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'filter = book, music' });
        await since(
            'No data for target viz since Year = 2014 from source viz and Year = 2014 from filter panel are applied'
        )
            .expect(await grid.isVizEmpty('Visualization 1'))
            .toBe(true);
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await filterPanel.apply();
        await since('Clear All Filters, filter summary should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('No filter selections');
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(3);

        // attribute silder, when filter is cleared, apply button is disabled
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await since(
            'when there is no item selected, after clear all filters, Apply Button is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isApplyEnabled())
            .toBe(false);
    });

    it('[TC85936_10] Verify Functionality of Clear All Filters button - no privilege', async () => {
        const { credentials: only2014privilege } = specConfiguration_only2014privilege;
        await libraryPage.switchUser(only2014privilege);
        await resetDossierState({
            credentials: only2014privilege,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'dossier linking' });
        await since('No data for user with only privilege for Year = 2014 from filter panel are applied')
            .expect(await grid.isVizEmpty('Visualization 1'))
            .toBe(true);
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await filterPanel.apply();
        await since('Clear All Filters, filter summary should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('No filter selections');
        await since('The number of row should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toEqual(5);
    });
});

export const config = specConfiguration;
