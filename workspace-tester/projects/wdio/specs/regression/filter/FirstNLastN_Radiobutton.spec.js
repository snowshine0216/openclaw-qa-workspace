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

describe('FirstNLastN-radio button', () => {
    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC63735] Validate rendering and manipulations for radio button filter with FirstN/LastN in Library filter panel', async () => {
        const dossier = {
            id: '55BCE1AB4B5D1C5BF5A0358EBA35F25A',
            name: 'FirstN/LastN-Radio Button Filter',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        // check initial rendering for filters in dynamic on/off status
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC63735', 'RadiobuttonInitialRender');

        // edit dynamic filter: clear filter then reset to dynamic
        await radiobuttonFilter.openSecondaryPanel('Year');
        await radiobuttonFilter.clearSelection();
        await since(
            'Clear filter, the filter capsule count for Year is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.capsuleCount('Year'))
            .toBe(0);
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Clear filter and apply, the filter capsule count for Year is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.capsuleCount('Year'))
            .toBe(0);
        await radiobuttonFilter.openContextMenu('Year');
        await radiobuttonFilter.selectContextMenuOption('Year', 'Reset');
        await since(
            'After reset to dynamic, filter selection info for Year is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.filterSelectionInfo('Year'))
            .toBe('(Not First 1)');
        await since(
            'After reset to dynamic, the filter capsule count for Year is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.capsuleCount('Year'))
            .toBe(1);
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'After reset to dynamic and apply, filter selection info for Year is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.filterSelectionInfo('Year'))
            .toBe('(Not First 1)');
        await since(
            'After reset to dynamic and apply, the filter capsule count for Year is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.capsuleCount('Year'))
            .toBe(1);

        // check sorting can work in radio button filter
        await radiobuttonFilter.openSecondaryPanel('Quarter');
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC63735', 'RadiobuttonDesSort');

        // edit dynamic filter: edit the filter to make selection same as dynamic selection
        await radiobuttonFilter.selectElementByName('2014 Q1');
        await since(
            'Edit Quarter to make selection same as dynamic selection,, filter selection info for Quarter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.filterSelectionInfo('Quarter'))
            .toBe('(1/12)');
        await since(
            'Edit Quarter to make selection same as dynamic selection, capsule "2014 Q1" is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.isCapsulePresent({ filterName: 'Quarter', capsuleName: '2014 Q1' }))
            .toBe(true);
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'After apply filter, filter selection info for Quarter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.filterSelectionInfo('Quarter'))
            .toBe('(1/12)');
        await since('After apply filter, capsule "2014 Q1" is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.isCapsulePresent({ filterName: 'Quarter', capsuleName: '2014 Q1' }))
            .toBe(true);

        // reset to dynamic for fitler in dynamic off status
        await radiobuttonFilter.openContextMenu('Month');
        await radiobuttonFilter.selectContextMenuOption('Month', 'Reset');
        await since(
            'After reset to dynamic, filter selection info for Month is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.filterSelectionInfo('Month'))
            .toBe('(Last 1)');
        await since(
            'After reset to dynamic, capsule "Apr 2014" is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.isCapsulePresent({ filterName: 'Month', capsuleName: 'Apr 2014' }))
            .toBe(true);
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'After reset to dynamic and apply, filter selection info for Month is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.filterSelectionInfo('Month'))
            .toBe('(Last 1)');
        await since(
            'After reset to dynamic and apply, capsule "Apr 2014" is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.isCapsulePresent({ filterName: 'Month', capsuleName: 'Apr 2014' }))
            .toBe(true);
    });

    it('[TC69661] Validate filter with FirstN/LastN can be added to bookmark in Library', async () => {
        const dossier = {
            id: '55BCE1AB4B5D1C5BF5A0358EBA35F25A',
            name: 'FirstN/LastN-Radio Button Filter',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // apply bookmark
        await bookmark.openPanel();
        await bookmark.applyBookmark('exclude2015/2016Q1/Last 1');
        // check filter can be applied
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC69661', 'ApplyBookmark');
    });
});

export const config = specConfiguration;
