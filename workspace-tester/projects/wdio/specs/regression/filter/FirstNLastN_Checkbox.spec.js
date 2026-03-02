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
    dossierPage,
} = browsers.pageObj1;

describe('FirstNLastN-Checkbox', () => {
    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC69696] Validate reset button status for filter in different modes in Library filter panel', async () => {
        const dossier = {
            id: '32215AC645B42C3A6105DABBBDD3577E',
            name: 'FirstN/LastN-Checkbox Filter',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        // check initial rendering for filters in dynamic on/off status
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC69696', 'CheckboxInitialRender');
        await since(
            'Default filter selection info for Customer Email filter in dynamic off status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer Email'))
            .toBe('(100/9999)');
        await since(
            'Default filter selection info for Customer filter in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer'))
            .toBe('(First 5)');
        await since(
            'Default filter selection info for Customer Address filter in dynamic on status is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer Address'))
            .toBe('(Last 1000000)');

        // check status for "Reset to Dynamic" button
        await checkboxFilter.openContextMenu('Customer Email');
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC69696', 'ContextMenuWithReset');
        await since(
            'Customer Email is in dynamic off status, Reset presence is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isResetOptionPresent('Customer Email'))
            .toBe(true);
        // close context menu
        await checkboxFilter.openSecondaryPanel('Customer Email');
        await checkboxFilter.openContextMenu('Customer');
        await since('Customer is in dynamic, Reset presence is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.isResetOptionPresent('Customer'))
            .toBe(false);
        // close context menu
        await checkboxFilter.openSecondaryPanel('Customer');
        await checkboxFilter.openContextMenu('Year');
        await since('Year is static, Reset presence is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.isResetOptionPresent('Year'))
            .toBe(false);
        // close context menu
        await checkboxFilter.openSecondaryPanel('Year');
        // reset to dynamic, then reset button is removed
        await checkboxFilter.openContextMenu('Customer Email');
        await checkboxFilter.selectContextMenuOption('Customer Email', 'Reset');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'After reset to dynamic, filter selection info for Customer Email is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer Email'))
            .toBe('(First 100)');
        await checkboxFilter.openContextMenu('Customer Email');
        await since(
            'Reset to dynamic, Customer Email Reset presence is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isResetOptionPresent('Customer Email'))
            .toBe(false);

        // edit dynamic filter to static, reset button is enabled
        await checkboxFilter.openSecondaryPanel('Customer');
        await checkboxFilter.selectElementByName('Aaby:Alen');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await checkboxFilter.openContextMenu('Customer');
        await since('Customer is in static, Reset presence is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.isResetOptionPresent('Customer'))
            .toBe(true);
    });

    it('[TC63730] Validate rendering and manipulations for checkbox filter with FirstN/LastN in Library filter panel', async () => {
        const dossier = {
            id: '32215AC645B42C3A6105DABBBDD3577E',
            name: 'FirstN/LastN-Checkbox Filter',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        // edit dynamic filter: clear filter then reset to dynamic
        await checkboxFilter.openContextMenu('Customer');
        await checkboxFilter.selectContextMenuOption('Customer', 'Clear');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Clear filter, the filter capsule count for Customer is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.capsuleCount('Customer'))
            .toBe(0);
        await checkboxFilter.openContextMenu('Customer');
        await checkboxFilter.selectContextMenuOption('Customer', 'Reset');
        // Client can get elements before apply filter except searchbox style
        await since(
            'After reset to dynamic and does not apply, filter selection info for Customer is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer'))
            .toBe('(First 5)');
        await since(
            'After reset to dynamic and does not apply, the filter capsule count for Customer is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.capsuleCount('Customer'))
            .toBe(3);
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'After reset to dynamic, filter selection info for Customer is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer'))
            .toBe('(First 5)');
        await since(
            'After reset to dynamic and apply, the filter capsule count for Customer is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.capsuleCount('Customer'))
            .toBe(3);

        // edit dynamic filter: change to exclude mode
        await checkboxFilter.openContextMenu('Customer Address');
        await checkboxFilter.selectContextMenuOption('Customer Address', 'Exclude');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Filter selection for Customer Address filter in dynamic exclude status is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer Address'))
            .toBe('(Not Last 1000000)');
        await checkboxFilter.openContextMenu('Customer Address');
        await since(
            'Change include/exclude mode for dynamic filter, Reset presence is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isResetOptionPresent('Customer Address'))
            .toBe(false);
    });

    it('[TC63745] Validate rendering for in-canvas selector with FirstN/LastN in Library', async () => {
        const dossier = {
            id: '32215AC645B42C3A6105DABBBDD3577E',
            name: 'FirstN/LastN-Checkbox Filter',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // check initial rendering for (AUTO) In-canvas selector - different status
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Has incanvas selector' });
        await dossierPage.waitForPageIndicatorDisappear();

        // edit filter so that elements in incanvas selector are changed
        await filterPanel.openFilterPanel();
        await checkboxFilter.openContextMenu('Customer Email');
        await checkboxFilter.selectContextMenuOption('Customer Email', 'Clear');
        await checkboxFilter.openContextMenu('Customer Address');
        await checkboxFilter.selectContextMenuOption('Customer Address', 'Clear');
        await filterPanel.apply();
        await grid.hideContainer('Visualization 1');
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC63745', 'FinialSeletor');
    });

    it('[TC69659] Validate rendering and manipulations for NDE with FirstN/LastN in Library filter panel', async () => {
        const dossier = {
            id: 'C6926504490B333C675B57A2401AB7B8',
            name: 'FirstN/LastN-Checkbox Filter - NDE',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        // check initial rendering for NDE with dynamic selection
        await checkboxFilter.openSecondaryPanel('Customer(Group)');
        await takeScreenshotByElement(filterPanel.getSecondaryFilterPanel(), 'TC69659', 'NDEFirst4');

        // check reset to dynamic for NDE
        await checkboxFilter.selectElementByName('10~20');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since('Filter selection info NDE is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Customer(Group)'))
            .toBe('(3/9964)');
        await checkboxFilter.openContextMenu('Customer(Group)');
        await checkboxFilter.selectContextMenuOption('Customer(Group)', 'Reset');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Reset to dynamic, filter selection info NDE is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer(Group)'))
            .toBe('(First 4)');

        // check NDE with GDDE - NDE as source
        await toc.openPageFromTocMenu({ chapterName: 'GDDE - NDE as source' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Customer');
        await checkboxFilter.selectAll();
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Filtered by NDE, filter selection info for Customer is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer'))
            .toBe('(40/40)');

        // check NDE with GDDE - NDE as target
        await toc.openPageFromTocMenu({ chapterName: 'GDDE - NDE as target' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Customer');
        await checkboxFilter.selectElementByName('Aadland:Warner');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC69659', 'DynamicNDEInGDDEUpdateFilter');
    });

    it('[TC69658] Validate rendering and manipulations for CGB with FirstN/LastN in Library filter panel', async () => {
        const dossier = {
            id: 'C209F99F4CDC769EF28DC589158D7D09',
            name: 'FirstN/LastN-Custom groups, consolidations',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        // check initial rendering for CGB with dynamic selection
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC69658', 'DynamicCGB');

        // clear all filters and reset to dynamic
        await filterPanel.clearFilter();
        await filterPanel.apply();
        await since(
            'Clear all filters, the summary in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('No filter selections');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openContextMenu('Age Groups');
        await checkboxFilter.selectContextMenuOption('Age Groups', 'Reset');
        await checkboxFilter.openContextMenu('Season');
        await checkboxFilter.selectContextMenuOption('Season', 'Reset');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Reset to dynamic, Filter selection info Age Groups is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Age Groups'))
            .toBe('(First 3)');
        await since(
            'Reset to dynamic, filter selection info Season is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Season'))
            .toBe('(First 2)');
    });

    it('[TC67995] Validate GDDE in checkbox style can work for filter with FirstN/LastN in Library', async () => {
        const dossier = {
            id: 'DCE09E5F436BF79328CFAF919F3ED44A',
            name: 'FirstN/LastN-Checkbox Filter - GDDE',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await filterPanel.openFilterPanel();

        // Dynamic off -> Dynamic -> Static

        // check initial rendering
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC67995', 'DynamicOff->Dynamic->Static');
        // edit filter in synamic off status
        await checkboxFilter.openSecondaryPanel('Customer');
        await checkboxFilter.clearAll();
        await filterPanel.waitForGDDE();
        await since(
            'Clear filters for dynamic off filter, Filter selection info Customer Address is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer Address'))
            .toBe('(Last 50)');
        await since(
            'Clear filters for dynamic off filter, Filter selection info First Order Date is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('First Order Date'))
            .toBe('(1/49)');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await checkboxFilter.openContextMenu('Customer');
        await checkboxFilter.selectContextMenuOption('Customer', 'Reset');
        await filterPanel.waitForGDDE();
        await since(
            'Reset source filter to dynamic, Filter selection info Customer Address is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer Address'))
            .toBe('(Last 50)');
        await since(
            'After reset to dynamic and apply, capsule "Apr 2014" is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await radiobuttonFilter.isCapsulePresent({
                    filterName: 'Customer Address',
                    capsuleName: '42592 Port Orford Loop Rd',
                })
            )
            .toBe(true);
        await since(
            'Reset source filter to dynamic, the filter capsule count for First Order Date is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.capsuleCount('First Order Date'))
            .toBe(0);
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since('Once target selection is filtered, it will show as deselcted even it is shown in available list')
            .expect(await checkboxFilter.capsuleCount('First Order Date'))
            .toBe(0);

        // Static -> Dynamic -> Dynamic off
        await toc.openPageFromTocMenu({ chapterName: 'Static->Dynamic->Dynamic off' });
        await filterPanel.openFilterPanel();
        // edit source filter and check target filter in dynamic status
        await checkboxFilter.openSecondaryPanel('Category');
        await checkboxFilter.selectElementByName('Electronics');
        await filterPanel.waitForGDDE();
        await since('Selection info for Subcategory is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Subcategory'))
            .toBe('(First 10)');
        await since('Capsule "Apr 2014" is supposed to be #{expected}, instead we have #{actual}')
            .expect(
                await radiobuttonFilter.isCapsulePresent({ filterName: 'Subcategory', capsuleName: 'Audio Equipment' })
            )
            .toBe(true);
        await since('The filter capsule count for Item is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.capsuleCount('Item'))
            .toBe(0);
        await checkboxFilter.openSecondaryPanel('Subcategory');
        await checkboxFilter.selectElementByName("TV's");
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'After apply, Selection info for Subcategory is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Subcategory'))
            .toBe('(5/6)');
        await since(
            'After apply, The filter capsule count for Item is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.capsuleCount('Item'))
            .toBe(0);
        // check GDDE in exclude mode
        await checkboxFilter.openContextMenu('Category');
        await checkboxFilter.selectContextMenuOption('Category', 'Exclude');
        await filterPanel.waitForGDDE();
        await since('The filter capsule count for Subcategory is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.capsuleCount('Subcategory'))
            .toBe(0);
        await checkboxFilter.openContextMenu('Subcategory');
        await checkboxFilter.selectContextMenuOption('Subcategory', 'Reset');
        await checkboxFilter.openSecondaryPanel('Subcategory');
        await since(
            'After reset, The selected item for Subcategory is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.visibleSelectedElementCount('Subcategory'))
            .toBe(10);
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'After reset to dynamic, filter selection info for Subcategory is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Subcategory'))
            .toBe('(First 10)');

        // Dynamic -> Dynamic
        await toc.openPageFromTocMenu({ chapterName: 'Dynamic target to Dynamic' });
        await filterPanel.openFilterPanel();
        // check initial rendering
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC67995', 'Dynamic->Dynamic');
        // edit source filter and check target filter in dynamic status
        await checkboxFilter.openContextMenu('Category');
        await checkboxFilter.selectContextMenuOption('Category', 'Exclude');
        await filterPanel.waitForGDDE();
        await since('Selection info for Subcategory is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Subcategory'))
            .toBe('(Last 10)');
        await since('Capsule "Drama" is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.isCapsulePresent({ filterName: 'Subcategory', capsuleName: 'Drama' }))
            .toBe(true);
        await checkboxFilter.openContextMenu('Category');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'After apply, Selection info for Subcategory is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Subcategory'))
            .toBe('(Last 10)');
        await since('After apply, Capsule "Drama" is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.isCapsulePresent({ filterName: 'Subcategory', capsuleName: 'Drama' }))
            .toBe(true);
    });
});

export const config = specConfiguration;
