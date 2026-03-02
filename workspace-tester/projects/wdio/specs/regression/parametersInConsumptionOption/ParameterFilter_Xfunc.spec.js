import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetDossierState from '../../../api/resetDossierState.js';
import resetBookmarks from '../../../api/resetBookmarks.js';

const specConfiguration = { ...customCredentials('_filter') };

describe('Parameter Filter_Xfunc', () => {
    let {
        dossierPage,
        libraryPage,
        grid,
        loginPage,
        filterPanel,
        searchBoxFilter,
        filterSummaryBar,
        filterElement,
        checkboxFilter,
        bookmark,
        parameterFilter,
        toc,
        calendarFilter,
        reset,
    } = browsers.pageObj1;

    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const dossier = {
        id: '197B5A47A64C5715B32DDB8D2E64DC62',
        name: '(Auto) Parameter Filter_XFunc',
        project,
    };

    const i18nDossier = {
        id: '73E77EDF426A3D241A1AF192DB524C97',
        name: '(Auto) Parameter Filter',
        project,
    };

    const { credentials } = specConfiguration;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize({ width: 1600, height: 1000 });
        await resetBookmarks({
            credentials: credentials,
            dossier: dossier,
        });
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC93130_01] FUN - Cross Functions - Derived Metric', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        // Derived metric
        await since('Units_parameter_sum for Action Movies should be #{expected}, instead it is #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'derived_metric_viz', headerName: 'Units_paramter_sum' }))
            .toBe('1,529');
        await filterPanel.openFilterPanel();
        await parameterFilter.inputValue('Derived_metric_parameter', '2000');
        await filterPanel.apply();
        await since(
            'Units_parameter_sum for Action Movies after setting filter value to 500 should be #{expected}, instead it is #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'derived_metric_viz', headerName: 'Units_paramter_sum' }))
            .toBe('3,528');
        await since('Derived_metric_parameter in filter summary bar should be #{expected}, instead it is #{actual}')
            .expect(await filterSummaryBar.filterItems('Derived_metric_parameter'))
            .toBe('(2000)');
    });

    it('[TC93130_02] FUN - Cross Functions - Thresholds', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        // Thresholds
        await since('Background color for Bantam Books revenue should be #{expected}, instead it is #{actual}')
            .expect(
                await grid.getGridElmBackgroundColor({
                    title: 'threshold_viz',
                    headerName: 'Revenue',
                    elementName: '$206,482',
                })
            )
            .toBe('rgba(236,123,117,1)');
        await filterPanel.openFilterPanel();
        await parameterFilter.inputValue('Threshold_parameter', '200000');
        await filterPanel.apply();
        await since(
            'Background color for ACS Innovations revenue when it is over the threshold should be #{expected}, instead it is #{actual}'
        )
            .expect(
                await grid.getGridElmBackgroundColor({
                    title: 'threshold_viz',
                    headerName: 'Revenue',
                    elementName: '$206,482',
                })
            )
            .toBe('rgba(153,204,0,1)');
    });

    it('[TC93130_03] FUN - Cross Functions - Target all filters below', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        // 'Target all filters below' setting
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Year');
        await checkboxFilter.selectAll();
        await since('If all Regions are selected, Country parameter should be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.filterSelectionInfo('Month'))
            .toBe('(1/36)');
        await checkboxFilter.clearAll();
        await checkboxFilter.selectElementByName('2016');
        await since('Select 2015, Month selection should be #{expected}, instead it is #{actual}')
            .expect(await searchBoxFilter.filterSelectionInfo('Month'))
            .toBe('');
        await checkboxFilter.openSecondaryPanel('Month');
        await checkboxFilter.selectElementByName('Feb 2016');
        await since('Select Feb 2015, Month parameter should have #{expected} options, instead it has #{actual}')
            .expect(await searchBoxFilter.filterSelectionInfo('Month'))
            .toBe('(1/12)');
        await filterPanel.closeFilterPanel();
    });

    it('[TC93130_04] FUN - Cross Functions - Global filter', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        // Global filter
        await filterPanel.openFilterPanel();
        await parameterFilter.inputValue('Derived_metric_parameter', '5');
        await filterPanel.apply();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1 copy', pageName: 'Page 1' });
        await since('Derived_metric_parameter in another chapter should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Derived_metric_parameter'))
            .toBe('(5)');

        await since('Units_parameter_sum for Action Movies should be #{expected}, instead it is #{actual}')
            .expect(await grid.getCellValue('derived_metric_viz', 2, 3))
            .toBe('1,533');
    });

    it('[TC93130_05] FUN - Cross Functions - Dynamic Filter', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();

        await checkboxFilter.openContextMenu('Year');
        await checkboxFilter.selectContextMenuOption('Year', 'Reset');
        await filterPanel.apply();
        await since('Year in filter summary bar should be #{expected}, instead it is #{actual}')
            .expect(await filterSummaryBar.filterItems('Year'))
            .toBe('(2014, 2015)');
        await filterPanel.openFilterPanel();
        await since('Filter selection for Year should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Year'))
            .toBe('(First 2)');
    });

    it('[TC93130_06] FUN - Cross Functions - Exclude/Include', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        // Exclude/Include
        await checkboxFilter.openContextMenu('Year');
        await checkboxFilter.selectContextMenuOption('Year', 'Exclude');
        await filterPanel.apply();
        await since('Year in filter summary bar should be #{expected}, instead it is #{actual}')
            .expect(await filterSummaryBar.filterItems('Year'))
            .toBe('(exclude 2014, 2015)');
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Year');
        await checkboxFilter.keepOnly('2016');
        await checkboxFilter.openSecondaryPanel('Month');
        await checkboxFilter.search('2016');
        await since('Filter elements length after exclude should be #{expected}, instead we have #{actual}')
            .expect(await filterElement.getAllElements().length)
            .toBe(0);
        await checkboxFilter.search('2014');
        await checkboxFilter.selectElementByName('Jul 2014');
        await filterPanel.apply();
        await since('Region in filter summary bar should be #{expected}, instead it is #{actual}')
            .expect(await filterSummaryBar.filterItems('Year'))
            .toBe('(exclude 2016)');

        await filterPanel.openFilterPanel();
        await checkboxFilter.openContextMenu('Year');
        await checkboxFilter.selectContextMenuOption('Year', 'Include');
        await checkboxFilter.openSecondaryPanel('Month');
        await checkboxFilter.search('2016');
        await since('Filter elements length after include should be #{expected}, instead we have #{actual}')
            .expect(await filterElement.getAllElements().length)
            .toBe(12);
    });

    it('[TC93130_07] FUN - Cross Functions - Bookmarks', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        // Bookmarks
        await filterPanel.openFilterPanel();
        await parameterFilter.inputValue('Derived_metric_parameter', '1234');
        await filterPanel.apply();
        await since('Derived_metric_parameter in filter summary bar should be #{expected}, instead it is #{actual}')
            .expect(await filterSummaryBar.filterItems('Derived_metric_parameter'))
            .toBe('(1234)');
        await bookmark.openPanel();
        await bookmark.addNewBookmark('bookmark-test');
        await bookmark.closePanel();
        await reset.selectReset();
        await reset.confirmReset();
        await since(
            'Derived_metric_parameter in filter summary bar after reset should be #{expected}, instead it is #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Derived_metric_parameter'))
            .toBe('(1)');
        await bookmark.openPanel();
        await since('Bookmark with the name bookmark-test should be present, but it is not')
            .expect(await bookmark.isBookmarkPresent('bookmark-test'))
            .toBe(true);
        await bookmark.applyBookmark('bookmark-test');
        await since(
            'Derived_metric_parameter in filter summary bar after applying bookmark-test should be #{expected}, instead it is #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Derived_metric_parameter'))
            .toBe('(1234)');
        await bookmark.openPanel();
        await bookmark.deleteBookmark('bookmark-test');
    });

    it('[TC93130_08] FUN - Cross Functions - Undo/Redo', async () => {
        // Undo/Redo
        await since('Units_parameter_sum for Action Movies should be #{expected}, instead it is #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'derived_metric_viz', headerName: 'Units_paramter_sum' }))
            .toBe('1,529');
        await filterPanel.openFilterPanel();
        await parameterFilter.inputValue('Derived_metric_parameter', '2000');
        await filterPanel.apply();
        await since(
            'Units_parameter_sum after Derived_metric_parameter change should be #{expected}, instead it is #{actual}'
        )
            .expect(await grid.firstElmOfHeader({ title: 'derived_metric_viz', headerName: 'Units_paramter_sum' }))
            .toBe('3,528');
        await dossierPage.clickUndo();
        await since('Units_parameter_sum for Action Movies after Undo should be #{expected}, instead it is #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'derived_metric_viz', headerName: 'Units_paramter_sum' }))
            .toBe('1,529');
        await dossierPage.clickRedo();
        await since('Units_parameter_sum for Action Movies after Redo should be #{expected}, instead it is #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'derived_metric_viz', headerName: 'Units_paramter_sum' }))
            .toBe('3,528');
    });

    it('[TC93217] FUN - Error handling for user input depending on the type', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: i18nDossier,
        });
        await libraryPage.openUrl(i18nDossier.project.id, i18nDossier.id);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Number' });
        await filterPanel.openFilterPanel();
        const longNumber = '1'.repeat(500);
        await parameterFilter.inputValue('number_user_input_no_default_parameter', longNumber);
        await filterPanel.apply();
        await since('Error tooltip for number parameter should be #{expected}, instead it is #{actual}')
            .expect(await filterPanel.getTooltipText())
            .toContain('Invalid Format');
        await parameterFilter.clearInput('number_user_input_no_default_parameter');
        await filterPanel.apply();
    });

    it('[TC93140] I18N - Locale support for date and number format + translations', async () => {
        const zhCN = {
            username: 'tester_auto_zhcn',
            password: '',
        };
        await resetDossierState({
            credentials: zhCN,
            dossier: i18nDossier,
        });
        await libraryPage.switchUser(zhCN);
        await libraryPage.openUrl(i18nDossier.project.id, i18nDossier.id);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 5', pageName: 'DateTime' });
        await filterPanel.openFilterPanel();
        await since('Selection for User input DateTime should be #{expected}, instead it is #{actual}')
            .expect(await calendarFilter.capsuleDateTime('datetime_user_input_with_default_parameter'))
            .toBe('2024-09-03 12:00:00 中午');
        // DE309279: [i18n] Fixed List DateTime Value Parameter/incanvas selector paramater/filter summary for parameter does not follow locale format
        await since('DateTime for User input in filter summary bar should be #{expected}, instead it is #{actual}')
            .expect(await filterSummaryBar.filterItems('datetime_user_input_with_default_parameter'))
            .toBe('(9/3/2024 12:00:00 AM)');
        await since('Selection for fixed list DateTime should be #{expected}, instead it is #{actual}')
            .expect(await calendarFilter.capsuleDateTime('datetime_fixed_list_with_default_radio_buttons_parameter'))
            .toBe('9/2/2024 12:00:00 AM');
        await since('DateTime for User input in filter summary bar should be #{expected}, instead it is #{actual}')
            .expect(await filterSummaryBar.filterItems('datetime_fixed_list_with_default_radio_buttons_parameter'))
            .toBe('(9/2/2024 12:00:00 AM)');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 6', pageName: 'Element List' });
        await filterPanel.openFilterPanel();
        await since('Selection for element_list_dynamic_parameter should be #{expected}, instead it is #{actual}')
            .expect(await searchBoxFilter.filterSelectionInfo('element_list_dynamic_parameter'))
            .toBe('(前 2项)');
        await libraryPage.switchUser(credentials);
    });
});

export const config = specConfiguration;
