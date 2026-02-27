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
    id: 'EAA4D65A4CC4D28A7C039A8D37A129EA',
    name: '(Auto) Mandatory Filter',
    project,
};

const browserWindow = {
    width: 1200,
    height: 1200,
};

describe('Mandatory Filter', () => {
    let {
        loginPage,
        filterPanel,
        libraryPage,
        attributeSlider,
        searchBoxFilter,
        radiobuttonFilter,
        checkboxFilter,
        filterSummaryBar,
        toc,
        dossierPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    beforeEach(async () => {
        await setWindowSize(browserWindow);
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC92785_01] Validate functionality for mandatory filter - warning message - manually removing the last selection', async () => {
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
        await searchBoxFilter.removeCapsuleByName({ filterName: 'Subcategory', capsuleName: 'Art & Architecture' });
        await since(
            'Warning message shows for subcategory is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await filterPanel.isWarningMessagePresent('Subcategory'))
            .toBe(true);

        // searchbox
        await searchBoxFilter.removeCapsuleByName({
            filterName: 'Item',
            capsuleName: 'The Painted Word',
        });
        await since('Warning message shows for Item is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Item'))
            .toBe(true);

        // Pulldown - multiple select
        await searchBoxFilter.removeCapsuleByName({ filterName: 'Quarter', capsuleName: '2014 Q1' });
        await since('Warning message shows for Quarter is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Quarter'))
            .toBe(true);

        // Pulldown - single select
        await searchBoxFilter.removeCapsuleByName({ filterName: 'Day', capsuleName: '1/1/2014' });
        await searchBoxFilter.removeCapsuleByName({ filterName: 'Day', capsuleName: '1/2/2014' });
        await since('Warning message shows for Day is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Day'))
            .toBe(true);
        await since('Apply button disabled is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isApplyEnabled())
            .toBe(false);

        // Reset All Filters
        await filterPanel.resetAllFilters();
        await filterPanel.apply();
        await since('Filter Summary Bar Text should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe(
                'Category(Books, Electronics)Subcategory(Art & Architecture)Item(The Painted Word)Year(2014 - 2015)Quarter(2014 Q1)Day(1/1/2014, 1/2/2014)'
            );
    });

    it('[TC92785_02] Validate functionality for mandatory filter - warning message - initial rendering', async () => {
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

    it('[TC92785_03] Validate functionality for mandatory filter - gdde', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on - gdde', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        // searchbox filter
        await searchBoxFilter.removeCapsuleByName({ filterName: 'Category', capsuleName: 'Music' });
        await since('Warning message shows for category is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Category'))
            .toBe(true);
        await checkboxFilter.openSecondaryPanel('Category');
        await searchBoxFilter.search('Books');
        await searchBoxFilter.selectElementByName('Books');
        await since(
            'After exclude selection, item in dynamic on status is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Subcategory'))
            .toBe('');
        // DE308499: [Mandatory Filter] When target filter selection is excluded by the parents new selection, the warning message does not show
        await since('Warning message shows for Item is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Subcategory'))
            .toBe(false);
        await filterPanel.apply();
        await since('Filter Summary Bar Text should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toContain('Category(Books)Subcategory(Music - Miscellaneous)');

        // checkbox filter
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Year');
        await checkboxFilter.keepOnly('2015');
        await since(
            'After exclude selection, item in dynamic on status is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Quarter'))
            .toBe('');
        // DE308499: [Mandatory Filter] When target filter selection is excluded by the parents new selection, the warning message does not show
        await since('Warning message shows for Item is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Quarter'))
            .toBe(false);
        await filterPanel.apply();

        await filterPanel.openFilterPanel();
        await since('Reopen, Warning message shows is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isWarningMessagePresent('Quarter'))
            .toBe(true);
    });

    it('[TC92785_04] Validate functionality for mandatory filter - Grey out the "Select All" button', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on', pageName: 'Page 1' });
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

    it('[TC92785_05] Validate functionality for mandatory filter - "Reset" button', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        // checkbox
        await checkboxFilter.openSecondaryPanel('Category');
        await checkboxFilter.selectElementByName('Electronics');
        await since('Reset button disabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(false);

        // searchbox
        await searchBoxFilter.openSecondaryPanel('Subcategory');
        await searchBoxFilter.search('Business');
        await searchBoxFilter.selectElementByName('Business');

        // radio button
        await radiobuttonFilter.openSecondaryPanel('Item');
        await radiobuttonFilter.selectElementByName('Art As Experience');
        await since('Reset button disabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(false);

        // attribute slider
        await attributeSlider.dragAndDropLowerHandle('Year', 100);

        // pulldown - single select
        await radiobuttonFilter.openSecondaryPanel('Quarter');
        await radiobuttonFilter.selectElementByName('2015 Q2');
        await since('Reset button disabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await radiobuttonFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(false);

        // pulldown - multiple select
        await checkboxFilter.openSecondaryPanel('Day');
        await checkboxFilter.keepOnly('4/3/2015');
        await since('Reset button disabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(false);

        await filterPanel.apply();
        await since('Filter Summary Bar Text should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe(
                'Category(Books)Subcategory(Art & Architecture, Business)Item(Art As Experience)Year(2015)Quarter(2015 Q2)Day(4/3/2015)'
            );

        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Category');
        await checkboxFilter.fElement.clickFooterButton('Reset');
        await since('Filter selection for Category should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Category'))
            .toBe('(2/4)');

        await searchBoxFilter.openSecondaryPanel('Subcategory');
        await searchBoxFilter.fElement.clickFooterButton('Reset');

        await radiobuttonFilter.openSecondaryPanel('Item');
        await radiobuttonFilter.fElement.clickFooterButton('Reset');
        await radiobuttonFilter.closeSecondaryPanel('Item');

        await attributeSlider.openContextMenu('Year');
        await attributeSlider.selectContextMenuOption('Year', 'Reset');

        await radiobuttonFilter.openSecondaryPanel('Quarter');
        await radiobuttonFilter.fElement.clickFooterButton('Reset');

        await checkboxFilter.openSecondaryPanel('Day');
        await checkboxFilter.fElement.clickFooterButton('Reset');
        await filterPanel.apply();
        await since('Filter Summary Bar Text should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe(
                'Category(Books, Electronics)Subcategory(Art & Architecture)Item(The Painted Word)Year(2014 - 2015)Quarter(2014 Q1)Day(1/1/2014, 1/2/2014)'
            );
    });

    it('[TC92785_06] Validate functionality for mandatory filter - mixed setting on and off', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'mixed setting on and off', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        await checkboxFilter.openSecondaryPanel('Category');
        await checkboxFilter.selectElementByName('Music');
        await radiobuttonFilter.openSecondaryPanel('Item');
        await radiobuttonFilter.selectElementByName('The 48 Laws of Power');
        await filterPanel.apply();
        await since('Filter Summary Bar Text should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('Category(Books, Electronics, +1)Subcategory(Business)Item(The 48 Laws of Power)');

        await filterPanel.openFilterPanel();
        await filterPanel.clearAllFilters();
        await filterPanel.apply();
        await since('Filter Summary Bar Text should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('Subcategory(Business)Item(Attention to Detail)');
    });

    it('[TC92785_07] Validate UI for mandatory filter', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on - clear all', pageName: 'Page 1' });
        // mobile view
        await setWindowSize({
            width: 400,
            height: 800,
        });
        await libraryPage.hamburgerMenu.openHamburgerMenu();
        await libraryPage.hamburgerMenu.clickOptionInMobileView('Filter');
        await takeScreenshotByElement(
            libraryPage.hamburgerMenu.getSliderMenuContainer(),
            'TC92785',
            'Mobile View - warning message'
        );
        await libraryPage.hamburgerMenu.closeHamburgerMenu();

        await setWindowSize(browserWindow);
        // web view
        await toc.openPageFromTocMenu({ chapterName: 'setting on', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterMainPanel(), 'TC92785', 'Reset All Filters - disabled');
        await checkboxFilter.openSecondaryPanel('Category');
        await takeScreenshotByElement(filterPanel.getSecondaryFilterPanel(), 'TC92785', 'Reset - disabled');
        await searchBoxFilter.fElement.toggleViewSelectedOptionOn(); //check select all(number)
        await takeScreenshotByElement(
            filterPanel.getSecondaryFilterPanel(),
            'TC92785',
            'Reset - View Selected - disabled'
        );
        await toc.openPageFromTocMenu({ chapterName: 'setting on - clear all', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(filterPanel.getFilterMainPanel(), 'TC92785', 'Clear all');
    });

    it('[TC92779] Mandatory Filters - Mobile Dossier Consumption', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'setting on', pageName: 'Page 1' });
        await setWindowSize({
            width: 400,
            height: 800,
        });
        await libraryPage.hamburgerMenu.openFilterPanelInMobileView();
        await libraryPage.hamburgerMenu.clickFilterOptionInMobileView('Category');
        await checkboxFilter.uncheckElementByName('Books');
        await checkboxFilter.uncheckElementByName('Electronics');
        await since('Select All disabled is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Select All'))
            .toBe(true);
        await since('Reset disabled is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await checkboxFilter.fElement.isFooterButtonDisabled('Reset'))
            .toBe(false);
        await libraryPage.hamburgerMenu.clickBackButtonInMobileView();
        await since('Apply disabled is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.isApplyEnabled())
            .toBe(false);
        await filterPanel.resetAllFilters();
        await filterPanel.apply();
    });

    it('[TC92783] Mandatory Filters - Internationalization', async () => {
        const zhCN = {
            username: 'tester_auto_zhcn',
            password: '',
        };
        await resetDossierState({
            credentials: zhCN,
            dossier: dossier,
        });
        await libraryPage.switchUser(zhCN);
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'setting on - clear all', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        // DE309108: [i18n][Mandatory Filter] Warning message for mandatory filter does not translated
        await since('Warning message shows for category is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await filterPanel.warningMessageText('Category'))
            .toBe('Make at least one selection.');
        await libraryPage.switchUser(specConfiguration.credentials);
    });
});

export const config = specConfiguration;
