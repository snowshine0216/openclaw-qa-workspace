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
    radiobuttonFilter,
    searchBoxFilter,
    checkboxFilter,
    calendarFilter,
    mqSliderFilter,
    mqFilter,
    dynamicFilter,
    grid,
    filterSummaryBar,
    toc,
    bookmark,
    dossierPage,
} = browsers.pageObj1;

describe('Dossier level filter', () => {
    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC67838] Validate dossier level filter with CGB can sync in Library', async () => {
        const dossier = {
            id: '7547F61F482EA6E6097CDF81B28E2222',
            name: 'Dossier level filter - Custom groups, consolidations',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // check CGB initial rendering can sync
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC67838', 'InitialRenderCGBCheckbox');
        await toc.openPageFromTocMenu({ chapterName: 'CGB with same style' });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC67838', 'InitialRenderCGBSameStyle');
        await toc.openPageFromTocMenu({ chapterName: 'CGB with different styles' });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC67838', 'InitialRenderCGBDifferentStyle');

        // edit filter, select all/clear all
        await toc.openPageFromTocMenu({ chapterName: 'CGB' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Age Groups');
        await checkboxFilter.selectAll();
        await checkboxFilter.openSecondaryPanel('Season');
        await checkboxFilter.clearAll();
        await filterPanel.apply();
        await since('The summary for Age Groups in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Age Groups'))
            .toBe('(< 25, 36-50, +12)');
        await filterPanel.openFilterPanel();
        await since(
            'Clear filter, the filter capsule count for Season is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.capsuleCount('Season'))
            .toBe(0);

        // check CGB can sync after edit filter
        await toc.openPageFromTocMenu({ chapterName: 'CGB with same style' });
        await since('The summary for Age Groups in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Age Groups'))
            .toBe('(< 25, 36-50, +12)');
        await filterPanel.openFilterPanel();
        await since(
            'Clear filter, the filter capsule count for Season is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.capsuleCount('Season'))
            .toBe(0);
        await toc.openPageFromTocMenu({ chapterName: 'CGB with different styles' });
        await since('The summary for Age Groups in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Age Groups'))
            .toBe('(< 25 - > 60)');
        await filterPanel.openFilterPanel();
        await since(
            'Clear filter, the filter capsule count for Season is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.capsuleCount('Season'))
            .toBe(0);
    });

    it('[TC67842] Validate dossier level filter can be added to bookmark', async () => {
        const dossier = {
            id: '22D9765F45072C16A40A649554CA623E',
            name: 'Dossier level filter - Metric filter',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // apply bookmark without dossier level filter
        await bookmark.openPanel();
        await bookmark.applyBookmark('Chapter1: Cost is null;Chapter2: Cost is not null');
        await since(
            'Apply bookmark without global filter, summary for Cost in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Cost'))
            .toBe('[Is Not Null]');
        await toc.openPageFromTocMenu({ chapterName: 'MQ filter same style' });
        await since(
            'Switch to other chapter, summary for Cost in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Cost'))
            .toBe('[Is Not Null]');

        // apply bookmark with dossier level filter
        await bookmark.openPanel();
        await bookmark.applyBookmark('Cost less than 5000000(global)');
        await since(
            'Apply bookmark with global filter, summary for Cost in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Cost'))
            .toBe('[<5M]');
        await toc.openPageFromTocMenu({ chapterName: 'MQ filter same style' });
        await since(
            'Switch to other chapter, summary for Cost in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Cost'))
            .toBe('[<5M]');
    });

    it('[TC69468] Validate dossier level filter with NDE can sync in Library', async () => {
        const dossier = {
            id: '7B8E0A444295D51553EA4F969C16407C',
            name: 'Dossier level filter - NDE',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // check initial rendering for NDE
        await since(
            'Default summary for Customer(Group) in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer(Group)'))
            .toBe('(First 10 customers)');
        await toc.openPageFromTocMenu({ chapterName: 'GDDE - NDE as source' });
        await since(
            'Default summary for Customer(Group) in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer(Group)'))
            .toBe('(First 10 customers)');
        await toc.openPageFromTocMenu({ chapterName: 'GDDE - NDE as target' });
        await since(
            'Default summary for Customer(Group) in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer(Group)'))
            .toBe('(First 10 customers)');
        await toc.openPageFromTocMenu({ chapterName: 'NDE in other styles' });
        await since(
            'Default summary for Customer(Group) in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer(Group)'))
            .toBe('(First 10 customers)');

        // edit NDE filter
        await toc.openPageFromTocMenu({ chapterName: 'NDE with dynamic' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Customer(Group)');
        await checkboxFilter.selectElementByName('10~20');
        await filterPanel.apply();

        // check edited filter can sync in all chapters
        await since(
            'Summary for Customer(Group) in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer(Group)'))
            .toBe('(First 10 customers, 10~20)');
        await toc.openPageFromTocMenu({ chapterName: 'GDDE - NDE as source' });
        await since(
            'Summary for Customer(Group) in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer(Group)'))
            .toBe('(First 10 customers, 10~20)');
        await toc.openPageFromTocMenu({ chapterName: 'GDDE - NDE as target' });
        await since(
            'Summary for Customer(Group) in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer(Group)'))
            .toBe('(First 10 customers, 10~20)');
        await toc.openPageFromTocMenu({ chapterName: 'NDE in other styles' });
        await since(
            'Summary for Customer(Group) in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Customer(Group)'))
            .toBe('(First 10 customers, 10~20)');
    });

    it('[TC69469] Validate dossier level filter with RA can sync in Library', async () => {
        const dossier = {
            id: '247C92534CD793DFBD80908B4D06BB1C',
            name: 'Dossier level filter - RA',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // check initial rendering for RA in different styles
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC69469', 'InitialRenderRA');
        await toc.openPageFromTocMenu({ chapterName: 'Same style as Chapter 1' });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC69469', 'InitialRenderSameStyle');
        await toc.openPageFromTocMenu({ chapterName: 'Different style as Chapter 1' });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterPanelWrapper(), 'TC69469', 'InitialRenderDifferentStyle');

        // edit RA: single deselect
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1' });
        await filterPanel.openFilterPanel();
        await dynamicFilter.openSecondaryPanel('Accounts');
        await dynamicFilter.singleDeselectElement('Balance Sheet');
        await filterPanel.apply();
        await since('Summary for Accounts in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Accounts'))
            .toBe('(Balance Sheet, exclude Balance Sheet)');
        await toc.openPageFromTocMenu({ chapterName: 'Same style as Chapter 1' });
        await since('Summary for Accounts in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Accounts'))
            .toBe('(Balance Sheet, exclude Balance Sheet)');
    });

    it('[TC67837_01] Validate dossier level filter in dynamic status(FirstN/LastN) can sync in Library - checkbox', async () => {
        const dossier = {
            id: 'CFB125E64094FFFA2D1F499B186B078E',
            name: 'Dossier level filter - combine with FirstN/LastN',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // check checkbox filter with dynamic selection first 20 can sync
        await filterPanel.openFilterPanel();
        await since(
            'Default filter selection info for Customer filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer'))
            .toBe('(First 20)');
        await checkboxFilter.openSecondaryPanel('Customer');
        await checkboxFilter.selectElementByName('Aaby:Alen');
        await checkboxFilter.selectElementByName('Aadland:Miko');
        await checkboxFilter.selectElementByName('Aadland:Warner');
        await checkboxFilter.selectElementByName('Aadland:Constant');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Filter selection info for Customer filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer'))
            .toBe('(16/10000)');
        await toc.openPageFromTocMenu({ chapterName: 'Checkbox2' });
        await filterPanel.openFilterPanel();
        await since(
            'Filter selection info for Customer filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer'))
            .toBe('(16/10000)');
        await checkboxFilter.openContextMenu('Customer');
        await checkboxFilter.selectContextMenuOption('Customer', 'Reset');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Reset to Dynamic, filter selection info for Customer filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer'))
            .toBe('(First 20)');
        await toc.openPageFromTocMenu({ chapterName: 'Checkbox-DynamicFirst20' });
        await filterPanel.openFilterPanel();
        await since(
            'Reset to Dynamic, filter selection info for Customer filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer'))
            .toBe('(First 20)');
    });

    it('[TC67837_02] Validate dossier level filter in dynamic status(FirstN/LastN) can sync in Library - slider', async () => {
        const dossier = {
            id: 'CFB125E64094FFFA2D1F499B186B078E',
            name: 'Dossier level filter - combine with FirstN/LastN',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // check slider filter with dynamic selection last 100 can sync
        await toc.openPageFromTocMenu({ chapterName: 'Slider-DynamicNotLast100' });
        await filterPanel.openFilterPanel();
        await since('Filter selection is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await attributeSlider.filterSelectionInfo('Customer Address'))
            .toBe('(Not Last 100)');
        await attributeSlider.openContextMenu('Customer Address');
        await attributeSlider.selectContextMenuOption('Customer Address', 'Include');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Filter selection info for Customer Address filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await attributeSlider.filterSelectionInfo('Customer Address'))
            .toBe('(Last 100)');
        await toc.openPageFromTocMenu({ chapterName: 'Slider2' });
        await filterPanel.openFilterPanel();
        await since(
            'Filter selection info for Customer Address filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await attributeSlider.filterSelectionInfo('Customer Address'))
            .toBe('(Last 100)');
    });

    it('[TC67837_03] Validate dossier level filter in dynamic status(FirstN/LastN) can sync in Library - radio button', async () => {
        const dossier = {
            id: 'CFB125E64094FFFA2D1F499B186B078E',
            name: 'Dossier level filter - combine with FirstN/LastN',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // check radio button filter with dynamic selection off can sync
        await toc.openPageFromTocMenu({ chapterName: 'Radio button-DynamicOffFirstELement' });
        await filterPanel.openFilterPanel();
        await since(
            'Default filter selection info for Customer Email filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.filterSelectionInfo('Customer Email'))
            .toBe('(1/9999)');
        await radiobuttonFilter.openContextMenu('Customer Email');
        await radiobuttonFilter.selectContextMenuOption('Customer Email', 'Reset');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Reset to Dynamic, default filter selection info for Customer Email filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.filterSelectionInfo('Customer Email'))
            .toBe('(First 1)');
        await toc.openPageFromTocMenu({ chapterName: 'Radio button2' });
        await filterPanel.openFilterPanel();
        await since(
            'Reset to Dynamic, default filter selection info for Customer Email filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.filterSelectionInfo('Customer Email'))
            .toBe('(First 1)');
    });

    it('[TC67837_04] Validate dossier level filter in dynamic status(FirstN/LastN) can sync in Library - searchbox', async () => {
        const dossier = {
            id: 'CFB125E64094FFFA2D1F499B186B078E',
            name: 'Dossier level filter - combine with FirstN/LastN',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // check searchbox filter with dynamic first 3 can sync
        await toc.openPageFromTocMenu({ chapterName: 'Searchbox-DynamicFirst3' });
        await filterPanel.openFilterPanel();
        await since(
            'Default filter selection info for Category is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('Category'))
            .toBe('(First 3)');
        await searchBoxFilter.removeCapsuleByName({ filterName: 'Category', capsuleName: 'Books' });
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since('Filter selection info for Category is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.filterSelectionInfo('Category'))
            .toBe('(2 selected)');
        await toc.openPageFromTocMenu({ chapterName: 'Searchbox2' });
        await filterPanel.openFilterPanel();
        await since('Filter selection info for Category is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.filterSelectionInfo('Category'))
            .toBe('(2 selected)');
        await searchBoxFilter.openContextMenu('Category');
        await searchBoxFilter.selectContextMenuOption('Category', 'Reset');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Reset to Dynamic, filter selection info for Category is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('Category'))
            .toBe('(First 3)');
        await toc.openPageFromTocMenu({ chapterName: 'Searchbox-DynamicFirst3' });
        await filterPanel.openFilterPanel();
        await since(
            'Reset to Dynamic, filter selection info for Category is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('Category'))
            .toBe('(First 3)');
    });

    it('[TC67837_05] Validate dossier level filter in dynamic status(FirstN/LastN) can sync in Library - dropdown', async () => {
        const dossier = {
            id: 'CFB125E64094FFFA2D1F499B186B078E',
            name: 'Dossier level filter - combine with FirstN/LastN',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // check dropdown filter with dynamic last element can sync
        await toc.openPageFromTocMenu({ chapterName: 'Drop down-DynamicLastElement' });
        await filterPanel.openFilterPanel();
        await since('Default filter selection info for Year is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.filterSelectionInfo('Year'))
            .toBe('(Last 1)');
        await toc.openPageFromTocMenu({ chapterName: 'Drop down multiple selection' });
        await filterPanel.openFilterPanel();
        await since('Default filter selection info for Year is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Year'))
            .toBe('(Last 1)');
        await checkboxFilter.openSecondaryPanel('Year');
        await checkboxFilter.selectElementByName('2015');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since('Filter selection info for Year is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Year'))
            .toBe('(2/3)');
        await toc.openPageFromTocMenu({ chapterName: 'Drop down2' });
        await filterPanel.openFilterPanel();
        await since('Filter selection info for Year is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Year'))
            .toBe('(2/3)');
        await radiobuttonFilter.openContextMenu('Year');
        await radiobuttonFilter.selectContextMenuOption('Year', 'Reset');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Reset to Dynamic, filter selection info for Year is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.filterSelectionInfo('Year'))
            .toBe('(Last 1)');
        await toc.openPageFromTocMenu({ chapterName: 'Drop down-DynamicLastElement' });
        await filterPanel.openFilterPanel();
        await since(
            'Reset to Dynamic, filter selection info for Year is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.filterSelectionInfo('Year'))
            .toBe('(Last 1)');
    });

    it('[TC71553] Validate manipulations for dossier level filter can sync when chapter has server cache', async () => {
        const dossier = {
            id: 'CFB125E64094FFFA2D1F499B186B078E',
            name: 'Dossier level filter - combine with FirstN/LastN',
            project,
        };
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // check when change from select all to clear all can sync
        // select all and generate cache
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Customer');
        await checkboxFilter.selectAll();
        await filterPanel.apply();
        await toc.openPageFromTocMenu({ chapterName: 'Checkbox2' });
        await filterPanel.openFilterPanel();
        await since(
            'Filter selection info for Customer filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer'))
            .toBe('(10000/10000)');
        // clear all and check sync status
        await toc.openPageFromTocMenu({ chapterName: 'Checkbox-DynamicFirst20' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Customer');
        await checkboxFilter.clearAll();
        await filterPanel.apply();
        await since(
            'Clear filter, the summary for Customer in filter summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('No filter selections');
        await toc.openPageFromTocMenu({ chapterName: 'Checkbox2' });
        await since('Clear all should be synced with server cache')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('No filter selections');

        // check change include/exclude mode when filter is in dynamic selection
        // reset to dynamic status and generate cache
        await filterPanel.openFilterPanel();
        await checkboxFilter.openContextMenu('Customer');
        await checkboxFilter.selectContextMenuOption('Customer', 'Reset');
        await filterPanel.apply();
        await toc.openPageFromTocMenu({ chapterName: 'Checkbox-DynamicFirst20' });
        await filterPanel.openFilterPanel();
        await since(
            'Reset to dynamic, selection info for Customer filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer'))
            .toBe('(First 20)');

        // change to exclude mode
        await toc.openPageFromTocMenu({ chapterName: 'Checkbox2' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openContextMenu('Customer');
        await checkboxFilter.selectContextMenuOption('Customer', 'Exclude');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Change to exclude mode, selection info for Customer filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Customer'))
            .toBe('(Not First 20)');
        await toc.openPageFromTocMenu({ chapterName: 'Checkbox-DynamicFirst20' });
        await filterPanel.openFilterPanel();
        await since('Change to exclude mode when filter is in dynamic selection shoule be synced with server cache')
            .expect(await checkboxFilter.filterSelectionInfo('Customer'))
            .toBe('(Not First 20)');
    });
});

export const config = specConfiguration;
