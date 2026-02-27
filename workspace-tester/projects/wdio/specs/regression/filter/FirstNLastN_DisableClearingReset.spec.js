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

describe('FirstNLastN-DisableClearing', () => {
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

    it('[TC87434_01] Validate functionality for prevent consumers from clearing (unsetting) filters - warining message - manually removing the last selection', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        // checkbox
        await checkboxFilter.openSecondaryPanel('Category');
        await checkboxFilter.uncheckElementByName('Books');
        await checkboxFilter.uncheckElementByName('Electronics');
        await since('Warning message shows for category is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Category'))
            .toBe(true);

        // radio button
        await searchBoxFilter.removeCapsuleByName({ filterName: 'Subcategory', capsuleName: 'Soul / R&B' });
        await since(
            'Warning message shows for subcategory is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await filterPanel.isWarningMessagePresent('Subcategory'))
            .toBe(true);

        // dropdown - multi select
        await searchBoxFilter.removeCapsuleByName({
            filterName: 'Item',
            capsuleName: '100 Places to Go While Still Young at Heart',
        });
        await searchBoxFilter.removeCapsuleByName({ filterName: 'Item', capsuleName: 'Art As Experience' });
        await searchBoxFilter.removeCapsuleByName({ filterName: 'Item', capsuleName: 'The Painted Word' });
        await searchBoxFilter.removeCapsuleByName({ filterName: 'Item', capsuleName: 'Hirschfeld on Line' });
        await searchBoxFilter.removeCapsuleByName({ filterName: 'Item', capsuleName: 'Adirondack Style' });
        await since('Warning message shows for Item is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Item'))
            .toBe(true);

        // dropdown - single select
        await searchBoxFilter.removeCapsuleByName({ filterName: 'Year', capsuleName: '2014' });
        await since('Warning message shows for Year is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Year'))
            .toBe(true);

        // searchbox
        await checkboxFilter.openSecondaryPanel('Day');
        await searchBoxFilter.search('4/1/2016');
        await searchBoxFilter.keepOnly('4/1/2016');
        await searchBoxFilter.removeCapsuleByName({ filterName: 'Day', capsuleName: '4/1/2016' });
        await since('Warning message shows for Day is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Day'))
            .toBe(true);
        // await filterPanel.apply();

        // // re-open filter panel, reset to dynamic
        // await filterPanel.openFilterPanel();
        // await since('Warning message shows for category is supposed to be "#{expected}", instead we have "#{actual}"')
        //     .expect(await filterPanel.isWarningMessagePresent('Category'))
        //     .toBe(false);
        // await since(
        //     'After apply, category in dynamic on status is supposed to be "#{expected}", instead we have "#{actual}"'
        // )
        //     .expect(await checkboxFilter.filterSelectionInfo('Category'))
        //     .toBe('(First 2)');
        // await since(
        //     'Warning message shows for subcategory is supposed to be "#{expected}", instead we have "#{actual}"'
        // )
        //     .expect(await filterPanel.isWarningMessagePresent('Subcategory'))
        //     .toBe(false);
        // await since(
        //     'After apply, subcategory in dynamic on status is supposed to be "#{expected}", instead we have "#{actual}"'
        // )
        //     .expect(await checkboxFilter.filterSelectionInfo('Subcategory'))
        //     .toBe('(Last 1)');
        // await since('Warning message shows for Item is supposed to be "#{expected}", instead we have "#{actual}"')
        //     .expect(await filterPanel.isWarningMessagePresent('Item'))
        //     .toBe(false);
        // await since(
        //     'After apply, item in dynamic on status is supposed to be "#{expected}", instead we have "#{actual}"'
        // )
        //     .expect(await checkboxFilter.filterSelectionInfo('Item'))
        //     .toBe('(Not First 5)');
        // await since('Warning message shows for Year is supposed to be "#{expected}", instead we have "#{actual}"')
        //     .expect(await filterPanel.isWarningMessagePresent('Year'))
        //     .toBe(false);
        // await since(
        //     'After apply, year in dynamic on status is supposed to be "#{expected}", instead we have "#{actual}"'
        // )
        //     .expect(await checkboxFilter.filterSelectionInfo('Year'))
        //     .toBe('(First 1)');
        // await since('Warning message shows for Day is supposed to be "#{expected}", instead we have "#{actual}"')
        //     .expect(await filterPanel.isWarningMessagePresent('Day'))
        //     .toBe(false);
        // await since(
        //     'After apply, Day in dynamic on status is supposed to be "#{expected}", instead we have "#{actual}"'
        // )
        //     .expect(await checkboxFilter.filterSelectionInfo('Day'))
        //     .toBe('(First 20)');
    });

    it('[TC87434_02] Validate functionality for prevent consumers from clearing (unsetting) filters - warining message - initial rendering', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on - clear all', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        // check warning message
        await since('Warning message shows for category is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Category'))
            .toBe(true);
        await since(
            'Warning message shows for subcategory is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await filterPanel.isWarningMessagePresent('Subcategory'))
            .toBe(true);
        await since('Warning message shows for Item is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Item'))
            .toBe(true);
        await since('Warning message shows for Year is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Year'))
            .toBe(true);
        await since('Warning message shows for Quarter is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Quarter'))
            .toBe(true);
        await since('Warning message shows for Day is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Day'))
            .toBe(true);
    });

    it('[TC87434_03] Validate functionality for prevent consumers from clearing (unsetting) filters - warining message - set target searchbox filter to dynamic', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on - searchbox', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        // searchbox button
        await searchBoxFilter.removeCapsuleByName({ filterName: 'Category', capsuleName: 'Books' });
        await since('Warning message shows for category is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Category'))
            .toBe(true);
        await checkboxFilter.openSecondaryPanel('Category');
        await searchBoxFilter.search('Music');
        await radiobuttonFilter.selectElementByName('Music');
        await since(
            'After exclude selection, item in dynamic on status is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Item'))
            .toBe('(Last 1)');
        await since('Warning message shows for Item is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Item'))
            .toBe(false);
        // await filterPanel.apply();
        // await filterPanel.openFilterPanel();
        // await since(
        //     'After apply, item in dynamic on status is supposed to be "#{expected}", instead we have "#{actual}"'
        // )
        //     .expect(await checkboxFilter.filterSelectionInfo('Item'))
        //     .toBe('(Last 1)');
    });

    it('[TC87435_01] Validate functionality for prevent consumers from clearing (unsetting) filters - reset target filter when current selection is excluded by the parents new selection', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on and set to static', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        await checkboxFilter.openSecondaryPanel('Category');
        await checkboxFilter.keepOnly('Movies');

        await since(
            'Default filter selection info for Customer Address filter in dynamic on status is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Subcategory'))
            .toBe('(Last 1)');
        await since(
            'Default filter selection info for Customer Address filter in dynamic on status is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Item'))
            .toBe('(Not First 5)');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'Default filter selection info for Customer Address filter in dynamic on status is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Subcategory'))
            .toBe('(Last 1)');
        await since(
            'Default filter selection info for Customer Address filter in dynamic on status is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Item'))
            .toBe('(Not First 5)');
    });

    // it('[TC87435_02] Validate functionality for prevent consumers from clearing (unsetting) filters - reset target filter when current selection is excluded by the parents new selection', async () => {
    //     await toc.openPageFromTocMenu({ chapterName: 'setting on - searchbox', pageName: 'Page 1' });
    //     await filterPanel.openFilterPanel();
    //     await searchBoxFilter.removeCapsuleByName({ filterName: 'Day', capsuleName: '12/12/2016' });
    //     await filterPanel.apply();

    //     // In GDDE case, when source filter is no selection. Click apply, source filter is reset to dynamic, and target filter selection is excluded by the parents new selection, target filter will not update
    //     await filterPanel.openFilterPanel();
    //     await since(
    //         'After apply, filter selection info for Year is supposed to be "#{expected}", instead we have "#{actual}"'
    //     )
    //         .expect(await checkboxFilter.filterSelectionInfo('Year'))
    //         .toBe('(First 2)');
    //     await since(
    //         'After apply, filter selection info for Day is supposed to be "#{expected}", instead we have "#{actual}"'
    //     )
    //         .expect(await checkboxFilter.filterSelectionInfo('Day'))
    //         .toBe('(19 selected)');
    // });

    it('[TC87436] Validate functionality for prevent consumers from clearing (unsetting) filters - Grey out the "Select All" button - checkbox', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on and set to static', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        await checkboxFilter.openSecondaryPanel('Category');
        await since('Select All button disabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);

        // partial result
        await checkboxFilter.search('Books');
        // DE288276, expected to be true
        await since(
            'After search Books, Select All button disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(false);

        // no result
        await checkboxFilter.clearSearch();
        await checkboxFilter.search('Sony');
        await since(
            'After search Sony, Select All button disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);

        // view selected
        await checkboxFilter.clearSearch();
        await checkboxFilter.toggleViewSelectedOptionOn();
        await since(
            'After view selected, Select All button disabled is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);
    });

    it('[TC85299] Validate UI for prevent consumers from clearing (unsetting) filters', async () => {
        // mobile view
        await setWindowSize({
            
            width: 400,
            height: 800,
        });
        await libraryPage.hamburgerMenu.openHamburgerMenu();
        await libraryPage.hamburgerMenu.clickOptionInMobileView('Filter');
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC85299',
            'Mobile View - Reset All Filters - disabled'
        );
        // await checkboxFilter.openContextMenu('Subcategory');
        // await takeScreenshotByElement(checkboxFilter.getContextMenu(), 'TC85299', 'Mobile View - Context menu');
        await checkboxFilter.openSecondaryPanel('Subcategory');
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC85299',
            'Reset - disabled'
        );
        await libraryPage.hamburgerMenu.closeHamburgerMenu();
        await toc.openTocInMobileView();
        await toc.goToPage({ chapterName: 'setting on - clear all', pageName: 'Page 1' });
        await libraryPage.hamburgerMenu.openHamburgerMenu();
        await libraryPage.hamburgerMenu.clickOptionInMobileView('Filter');
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC85299',
            'Mobile View - warning message'
        );
        await libraryPage.hamburgerMenu.closeHamburgerMenu();

        await setWindowSize(browserWindow);
        // web view
        await toc.openPageFromTocMenu({ chapterName: 'setting on', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterMainPanel(), 'TC85299', 'Reset All Filters - disabled');
        // await checkboxFilter.openContextMenu('Category');
        // await takeScreenshotByElement(checkboxFilter.getContextMenu(), 'TC85299', 'Context menu - disabled');
        await checkboxFilter.openSecondaryPanel('Category');
        await takeScreenshotByElement(filterPanel.getSecondaryFilterPanel(), 'TC85299', 'Reset - disabled');
        await searchBoxFilter.fElement.toggleViewSelectedOptionOn(); //check select all(number)
        await takeScreenshotByElement(
            filterPanel.getSecondaryFilterPanel(),
            'TC85299',
            'Reset - View Selected - disabled'
        );
        await toc.openPageFromTocMenu({ chapterName: 'setting on - clear all', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterMainPanel(), 'TC85299', 'Clear all');

        // check clear all filters, context menu, clear all button when set to static
        await toc.openPageFromTocMenu({ chapterName: 'setting on and set to static', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterMainPanel(), 'TC85299', 'Reset All Filters - enabled');
        await checkboxFilter.openContextMenu('Day');
        await takeScreenshotByElement(checkboxFilter.getContextMenu(), 'TC85299', 'Context menu - enabled');
        await checkboxFilter.openSecondaryPanel('Day');
        await takeScreenshotByElement(filterPanel.getSecondaryFilterPanel(), 'TC85299', 'Reset - enabled');
    });
});

export const config = specConfiguration;
