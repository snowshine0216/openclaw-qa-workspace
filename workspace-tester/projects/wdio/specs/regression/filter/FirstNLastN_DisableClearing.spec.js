import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_filter') };

const project = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

const dossier = {
    id: 'A7E6F3964207D4A62AB0F28088AAA5A0',
    name: 'FirstN/LastN-DisableClearing',
    project,
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
    commentsPage,
} = browsers.pageObj1;

describe('FirstNLastN-DisableClearing', () => {
    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC85304_01] Validate functionality for prevent consumers from clearing (unsetting) filters - Reset All Filters - All filters set to dynamic and disable setting on', async () => {
        // check Reset All Filters when all the filters set to disable clearing
        await toc.openPageFromTocMenu({ chapterName: 'setting on', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since(
            'The Filter is in dynamic status, Reset All Filters button is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isResetAllFiltersButtonDisabled())
            .toBe(true);
        await toc.openPageFromTocMenu({ chapterName: 'setting on and set to static', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await filterPanel.resetAllFilters();
        await filterPanel.waitForGDDE();
        await filterPanel.apply();

        // check all filter has changed to dynamic
        await filterPanel.openFilterPanel();
        await since(
            'Default filter selection info for Category filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Category'))
            .toBe('(First 2)');
        await since(
            'Default filter selection info for Subcategory filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Subcategory'))
            .toBe('(Last 1)');
        await since(
            'Default filter selection info for Item filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Item'))
            .toBe('(Not First 5)');
        await since(
            'Default filter selection info for Year filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Year'))
            .toBe('(First 1)');
        await since(
            'Default filter selection info for Quarter filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Quarter'))
            .toBe('(Last 3)');
        await since(
            'Default filter selection info for Customer filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Day'))
            .toBe('(First 20)');
    });

    it('[TC85304_02] Validate functionality for prevent consumers from clearing (unsetting) filters - Reset All Filters - Mixed dynamic on and off', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'mixed dynamic on and off', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        // check Clear All Filters when all the filters set to disable clearing
        await since('Reset All Filters button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isResetAllFiltersButtonPresent())
            .toBe(false);
        await filterPanel.clearFilter();
        await filterPanel.waitForGDDE();
        await filterPanel.apply();

        // check dynamic filter has changed to dynamic, non-dynamic filter selection cleared
        await filterPanel.openFilterPanel();
        await since(
            'Default filter selection info for Category filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Category'))
            .toBe('');
        await since(
            'Default filter selection info for Subcategory filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Subcategory'))
            .toBe('(Last 1)');
        await since(
            'Default filter selection info for Item filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Item'))
            .toBe('(Not First 5)');
    });

    it('[TC85304_03] Validate functionality for prevent consumers from clearing (unsetting) filters - Reset All Filters - Mixed dynamic and setting mixed on and off', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'mixed setting on and off', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        // check Clear All Filters when all the filters set to disable clearing
        await since('Reset All Filters button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isResetAllFiltersButtonPresent())
            .toBe(false);
        await filterPanel.clearFilter();
        await filterPanel.waitForGDDE();
        await filterPanel.apply();

        // check dynamic filter with setting on has changed to dynamic, dynamic filter with setting off selection cleared
        await filterPanel.openFilterPanel();
        await since(
            'Default filter selection info for Category filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Category'))
            .toBe('(First 2)');
        await since(
            'Default filter selection info for Subcategory filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Subcategory'))
            .toBe('');
        await since(
            'Default filter selection info for Item filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Item'))
            .toBe('(Not First 5)');
    });

    it('[TC85147_01] Validate functionality for prevent consumers from clearing (unsetting) filters - Checkbox - in dynamic on status', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        // check context menu for filters in dynamic on and setting on status
        await since(
            'ContextMenuDots Present in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isContextMenuDotsPresent('Category'))
            .toBe(false);

        //check reset all button in secondary panel
        await checkboxFilter.openSecondaryPanel('Category');
        await since(
            'Reset button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(true);
        await since(
            'Select All button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);

        //check view selected, with all selections
        await checkboxFilter.toggleViewSelectedOptionOn();
        await since(
            'After View Selected, Reset button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(true);
        await since(
            'After View Selected, Select All button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);

        // with partial selections
        await checkboxFilter.search('Electronics');
        await since(
            'After search Electronics, Reset button in dynamic on status present is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonPresent('Reset'))
            .toBe(false);
        await since(
            'After search Electronics, Clear All button in dynamic on status is disabled supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Clear All'))
            .toBe(false);
        await since(
            'After search Electronics, Select All button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);
        await checkboxFilter.fElement.clickFooterButton('Clear All');
        await since('After clear, element Electronics selection supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.message())
            .toMatch('No elements found');

        // with no selections
        await since(
            'With no selections, Reset button in dynamic on status present is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonPresent('Reset'))
            .toBe(false);
        await since(
            'With no selections, Reset button in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Clear All'))
            .toBe(true);
        await since(
            'Select All button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);
    });

    it('[TC85147_02] Validate functionality for prevent consumers from clearing (unsetting) filters - Checkbox - in static status', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on and set to static', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        // check context menu for filters in dynamic on and setting on status
        await checkboxFilter.openContextMenu('Category');
        await since('Clear button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.isContextMenuOptionPresent('Clear'))
            .toBe(false);
        await since('Reset button in dynamic on status is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.isContextMenuOptionPresent('Reset'))
            .toBe(true);

        //check reset all button in secondary panel
        await checkboxFilter.openSecondaryPanel('Category');
        await since(
            'Reset button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(false);
        await since(
            'Select All button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);

        // reset in secondary panel
        await checkboxFilter.fElement.clickFooterButton('Reset');
        await since('After reset, category selection is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Category'))
            .toBe('(First 2)');
        await filterPanel.apply();
        await since('Category in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Category'))
            .toBe('(Books, Electronics)');
        await filterPanel.openFilterPanel();
        await since('After apply, category selection is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Category'))
            .toBe('(First 2)');
    });

    it('[TC85295_01] Validate functionality for prevent consumers from clearing (unsetting) filters - Radio Button - in dynamic on status', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        // check context menu for filters in dynamic on and setting on status
        await since(
            'ContextMenuDots Present in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isContextMenuDotsPresent('Subcategory'))
            .toBe(false);

        //check reset button in secondary panel
        await radiobuttonFilter.openSecondaryPanel('Subcategory');
        await since(
            'Reset button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(true);

        // with no selections
        await radiobuttonFilter.search('movie');
        await since(
            'With no selections, Reset button in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(true);
    });

    it('[TC85295_02] Validate functionality for prevent consumers from clearing (unsetting) filters - Radio Button - in static status', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on and set to static', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        // check context menu for filters in dynamic on and setting on status
        await radiobuttonFilter.openContextMenu('Subcategory');
        await since('Clear button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.isContextMenuOptionPresent('Clear'))
            .toBe(false);
        await since('Reset button in dynamic on status is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.isContextMenuOptionPresent('Reset'))
            .toBe(true);

        //check reset button in secondary panel
        await radiobuttonFilter.openSecondaryPanel('Subcategory');
        await since(
            'Reset button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(false);

        // reset in secondary panel
        await radiobuttonFilter.fElement.clickFooterButton('Reset');
        await since('After reset, category selection is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.filterSelectionInfo('Subcategory'))
            .toBe('(Last 1)');
        await filterPanel.apply();
        await since('Category in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Subcategory'))
            .toBe('(Soul / R&B)');
        await filterPanel.openFilterPanel();
        await since('After apply, category selection is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.filterSelectionInfo('Subcategory'))
            .toBe('(Last 1)');
    });

    it('[TC85298_01] Validate functionality for prevent consumers from clearing (unsetting) filters - Dropdown - multi selection', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        // check context menu for filters in dynamic on and setting on status
        await since(
            'ContextMenuDots Present in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isContextMenuDotsPresent('Item'))
            .toBe(false);

        //check reset all button in secondary panel
        await checkboxFilter.openSecondaryPanel('Item');
        await since(
            'Reset button disabled in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(true);
        await since(
            'Select All button disabled in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);

        //check view selected, with all selections
        await checkboxFilter.toggleViewSelectedOptionOn();
        await since(
            'After View Selected, Reset button disabled in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(true);
        await since(
            'After View Selected, Select All button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);

        // with partial selections
        await checkboxFilter.search('Panasonic');
        await since(
            'After search Panasonic, Reset button in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Clear All'))
            .toBe(false);
        await since(
            'After search Panasonic, Select All button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);

        // with no selections
        await checkboxFilter.clearSearch();
        await checkboxFilter.search('Sony');
        await since(
            'After search Sony, Reset button in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Clear All'))
            .toBe(true);
        await since(
            'After search Sony, Select All button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);

        //check reset all button in secondary panel
        await toc.openPageFromTocMenu({ chapterName: 'setting on and set to static', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openContextMenu('Item');
        await since('Clear button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.isContextMenuOptionPresent('Clear'))
            .toBe(false);
        await since('Reset button in dynamic on status is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.isContextMenuOptionPresent('Reset'))
            .toBe(true);
        await checkboxFilter.openSecondaryPanel('Item');
        await since(
            'Reset button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(false);
        await since(
            'Select All button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);

        // reset in secondary panel
        await checkboxFilter.fElement.clickFooterButton('Reset');
        await since('After reset, category selection is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Item'))
            .toBe('(Not First 5)');
        await filterPanel.apply();
        await since('Category in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Item'))
            .toBe('(exclude Hitachi Hi8 Camcorder, Hitachi DVD Camcorder, +3)');
        await filterPanel.openFilterPanel();
        await since('After apply, category selection is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Item'))
            .toBe('(Not First 5)');
    });

    it('[TC85298_02] Validate functionality for prevent consumers from clearing (unsetting) filters - Dropdown - single selection', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        // check context menu for filters in dynamic on and setting on status
        await since(
            'ContextMenuDots Present in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isContextMenuDotsPresent('Year'))
            .toBe(false);

        //check reset all button in secondary panel
        await radiobuttonFilter.openSecondaryPanel('Year');
        await since('Reset button in dynamic on status is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(true);

        await toc.openPageFromTocMenu({ chapterName: 'setting on and set to static', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        // check context menu for filters in dynamic on and setting on status
        await radiobuttonFilter.openContextMenu('Subcategory');
        await since('Clear button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.isContextMenuOptionPresent('Clear'))
            .toBe(false);
        await since('Reset button in dynamic on status is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.isContextMenuOptionPresent('Reset'))
            .toBe(true);

        //check reset button in secondary panel
        await radiobuttonFilter.openSecondaryPanel('Subcategory');
        await since(
            'Reset button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(false);

        // reset in secondary panel
        await radiobuttonFilter.fElement.clickFooterButton('Reset');
        await since('After reset, category selection is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.filterSelectionInfo('Subcategory'))
            .toBe('(Last 1)');
        await filterPanel.apply();
        await since('Category in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Subcategory'))
            .toBe('(Soul / R&B)');
        await filterPanel.openFilterPanel();
        await since('After apply, category selection is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.filterSelectionInfo('Subcategory'))
            .toBe('(Last 1)');

        // check in static status
        await toc.openPageFromTocMenu({ chapterName: 'setting on and set to static', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openContextMenu('Year');
        await since('Clear button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.isContextMenuOptionPresent('Clear'))
            .toBe(false);
        await since('Reset button in dynamic on status is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.isContextMenuOptionPresent('Reset'))
            .toBe(true);

        //check reset button in secondary panel
        await radiobuttonFilter.openSecondaryPanel('Year');
        await since(
            'Reset button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await radiobuttonFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(false);

        // reset in secondary panel
        await radiobuttonFilter.fElement.clickFooterButton('Reset');
        await since('After reset, category selection is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.filterSelectionInfo('Year'))
            .toBe('(First 1)');
        await filterPanel.apply();
        await since('Category in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Year'))
            .toBe('(2014)');
        await filterPanel.openFilterPanel();
        await since('After apply, category selection is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.filterSelectionInfo('Year'))
            .toBe('(First 1)');
    });

    it('[TC85297] Validate functionality for prevent consumers from clearing (unsetting) filters - Attribute Slider', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        // check context menu for filters in dynamic on and setting on status
        await since(
            'ContextMenuDots Present in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isContextMenuDotsPresent('Quarter'))
            .toBe(false);

        // check when dynamic filter in static status
        await toc.openPageFromTocMenu({ chapterName: 'setting on and set to static', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await attributeSlider.openContextMenu('Quarter');
        await attributeSlider.selectContextMenuOption('Quarter', 'Reset');
        await filterPanel.apply();
        await since('Category in filter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Quarter'))
            .toBe('(2015 Q2 - 2015 Q4)');
        await filterPanel.openFilterPanel();
        await since('After apply, category selection is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.filterSelectionInfo('Quarter'))
            .toBe('(Last 3)');
    });

    it('[TC85296_01] Validate functionality for prevent consumers from clearing (unsetting) filters - searchbox - allow multi selection - in static status', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on - searchbox', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        // in static stutas
        await searchBoxFilter.openContextMenu('Year');
        await since('Clear button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.isContextMenuOptionPresent('Clear'))
            .toBe(false);
        await since('Reset button in dynamic on status is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.isContextMenuOptionPresent('Reset'))
            .toBe(true);

        //search result with partial selection
        await searchBoxFilter.openSecondaryPanel('Year');
        await since(
            'Reset button in secondary panel in dynamic off status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(false);
        await since('Select All button disabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);
        await searchBoxFilter.search('2014');
        await since(
            'When search for partial selection, Reset button status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(false);
        await since(
            'When search for partial selection, Select All button disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(false);

        //search all, check reset button in secondary panel
        await searchBoxFilter.clearSearch();
        await searchBoxFilter.search('*');
        await since('When search for all, Reset button status is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(false);
        //for searchbox filter, select all button is not disabled
        // DE288276, expected to be true
        await since(
            'When search for all, Select All button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(false);

        await searchBoxFilter.selectElementByName('2014');
        await since('Reset button in dynamic off status is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(false);
        await since('Filter selection info for Year filter is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.filterSelectionInfo('Year'))
            .toBe('(1 selected)');
        // await searchBoxFilter.fElement.clickFooterButton('Select All');
        // await since('Reset button in dynamic off status is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Reset'))
        //     .toBe(false);
        // await since('Filter selection info for Year filter is supposed to be #{expected}, instead we have #{actual}')
        //     .expect(await searchBoxFilter.filterSelectionInfo('Year'))
        //     .toBe('(3 selected)');
        await searchBoxFilter.fElement.clickFooterButton('Reset');
        await filterPanel.waitForGDDE();
        await since(
            'After reset, filter selection info for Year filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('Year'))
            .toBe('(First 2)');
    });

    it('[TC85296_02] Validate functionality for prevent consumers from clearing (unsetting) filters - searchbox - allow multi selection - in dynamic status', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on - searchbox', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        // check context menu for filters in dynamic on and setting on status
        await since(
            'ContextMenuDots Present in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isContextMenuDotsPresent('Day'))
            .toBe(false);

        //check reset button in secondary panel
        await checkboxFilter.openSecondaryPanel('Day');
        await since('Reset button in dynamic on status is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(true);
        await since(
            'Select All button in dynamic on status disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);

        // search result with all selection
        await searchBoxFilter.search('*');
        //there is a question, whether the reset button should show
        await since(
            'After search *, Clear All button disabled in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Clear All'))
            .toBe(false);
        await since(
            'After search *, Select All button disabled in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(false);
        await takeScreenshotByElement(
            filterPanel.getSecondaryFilterPanel(),
            'TC85296_01',
            'search result with all selection',
            { tolerance: 0.12 }
        );

        // search result with partial selection
        await searchBoxFilter.clearSearch();
        await searchBoxFilter.search('12/28/2014');
        await since(
            'After search 12/28/2016, Select All button present in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Clear All'))
            .toBe(false);
        await since(
            'After search 12/28/2016, Select All button disabled in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(false);
        await takeScreenshotByElement(
            filterPanel.getSecondaryFilterPanel(),
            'TC85296_01',
            'search result with parcial selection'
        );

        // search result with no selection
        await searchBoxFilter.clearSearch();
        await searchBoxFilter.search('12/28');
        await since(
            'After search 12/28, Reset button in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonPresent('Reset'))
            .toBe(false);
        await since(
            'After search 12/28, Select All button in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);
        await takeScreenshotByElement(
            filterPanel.getSecondaryFilterPanel(),
            'TC85296_01',
            'search result with no selection'
        );

        //check view selected
        await checkboxFilter.clearSearch();
        await searchBoxFilter.fElement.toggleViewSelectedOptionOn();
        await since(
            'After View Selected, Reset button in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(true);
        await since(
            'After View Selected, Select All button disabled in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);
        await takeScreenshotByElement(filterPanel.getSecondaryFilterPanel(), 'TC85296_01', 'View selected');
    });

    it('[TC85296_03] Validate functionality for prevent consumers from clearing (unsetting) filters - searchbox - single selection - in static status', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on - searchbox', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since('Filter selection info for Item filter is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.filterSelectionInfo('Item'))
            .toBe('(1 selected)');
        // check context menu for filters in dynamic on and setting on status
        await checkboxFilter.openContextMenu('Item');
        await since('Clear button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.isContextMenuOptionPresent('Clear'))
            .toBe(false);
        await since('Reset button in dynamic off status is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.isContextMenuOptionPresent('Reset'))
            .toBe(true);

        //check reset button in secondary panel
        await checkboxFilter.openSecondaryPanel('Item');
        await since('Reset button in dynamic off status is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(false);

        // search result with all selection
        await searchBoxFilter.search('*');
        await since(
            'After search *, Reset button present in dynamic off status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(false);
        await since(
            'After search *, Select All button present in dynamic off status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonPresent('Select All'))
            .toBe(false);
        await takeScreenshotByElement(
            filterPanel.getSecondaryFilterPanel(),
            'TC85296_03',
            'search result with all selection'
        );

        // search result with partial selection
        await searchBoxFilter.clearSearch();
        await searchBoxFilter.search('American');
        await since(
            'After search American, Select All button present in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonPresent('Select All'))
            .toBe(false);
        await since(
            'After search American, Reset button disabled in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(false);
        await takeScreenshotByElement(
            filterPanel.getSecondaryFilterPanel(),
            'TC85296_03',
            'search result with parcial selection'
        );

        // reset
        await searchBoxFilter.fElement.clickFooterButton('Reset');
        await since(
            'After reset, Filter selection info for Item filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('Item'))
            .toBe('(Last 1)');
        await takeScreenshotByElement(filterPanel.getSecondaryFilterPanel(), 'TC85296_03', 'search result after reset');
    });

    it('[TC85296_04] Validate functionality for prevent consumers from clearing (unsetting) filters - searchbox - single selection - in dynamic status', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on - searchbox', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since(
            'Filter selection info for Category filter is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('Category'))
            .toBe('(First 1)');
        // check context menu for filters in dynamic on and setting on status
        await since(
            'ContextMenuDots Present in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.isContextMenuDotsPresent('Category'))
            .toBe(false);

        //check reset button in secondary panel
        await checkboxFilter.openSecondaryPanel('Category');
        await since('Reset button in dynamic on status is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.fElement.isFooterButtonPresent('Reset'))
            .toBe(true);
        await since('Reset button in dynamic on status is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(true);

        await searchBoxFilter.search('*');
        await since(
            'After search *, Reset button disabled in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(true);
        await since(
            'After search *, Select All button present in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonPresent('Select All'))
            .toBe(false);
        await takeScreenshotByElement(filterPanel.getSecondaryFilterPanel(), 'TC85296_04', 'search result with all');

        await searchBoxFilter.clearSearch();
        await searchBoxFilter.search('books');
        await since(
            'After search books, Reset button disabled in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(true);
        await since(
            'After search books, Select All button present in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonPresent('Select All'))
            .toBe(false);
        await takeScreenshotByElement(
            filterPanel.getSecondaryFilterPanel(),
            'TC85296_04',
            'search result with selection'
        );

        await searchBoxFilter.clearSearch();
        await searchBoxFilter.search('Movies');
        await since(
            'After search Movies, Reset button disabled in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonPresent('Reset'))
            .toBe(true);
        await since(
            'After search Movies, Select All button present in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonPresent('Select All'))
            .toBe(false);
        await takeScreenshotByElement(
            filterPanel.getSecondaryFilterPanel(),
            'TC85296_04',
            'search result with no selection'
        );
    });

    it('[TC85296_05] Validate functionality for prevent consumers from clearing (unsetting) filters - searchbox - incremental search', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on - searchbox', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        // selected elements is not in first 500 elements
        await checkboxFilter.openSecondaryPanel('Day');
        await searchBoxFilter.search('*');
        await since(
            'After search all, Select All button present in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Clear All'))
            .toBe(false);
        await since(
            'After search all, Select All button disabled in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(false);

        // await searchBoxFilter.selectAll();
        // await filterPanel.apply();
        // await filterPanel.openFilterPanel();
        // await checkboxFilter.openSecondaryPanel('Day');
        // await searchBoxFilter.search('*');
        // await since(
        //     'After search all, Select All button present in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        // )
        //     .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Clear All'))
        //     .toBe(false);
        // await since(
        //     'After search all, Select All button disabled in dynamic on status is supposed to be #{expected}, instead we have #{actual}'
        // )
        //     .expect(await searchBoxFilter.fElement.isFooterButtonDisabled('Select All'))
        //     .toBe(false);
    });
});

export const config = specConfiguration;
