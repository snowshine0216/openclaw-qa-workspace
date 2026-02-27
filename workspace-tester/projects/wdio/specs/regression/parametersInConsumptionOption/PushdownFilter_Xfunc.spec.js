import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_filter') };
describe('Pushdown Filter_XFunc', () => {
    let {
        dossierPage,
        libraryPage,
        loginPage,
        filterPanel,
        filterSummaryBar,
        calendarFilter,
        searchBoxFilter,
        checkboxFilter,
        grid,
        toc,
        parameterFilter,
    } = browsers.pageObj1;

    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const dossier = {
        id: 'DA02F87345129A3E3C0AC5831D15C3AA',
        name: '(Auto) Pushdown Filter_XFunc',
        project,
    };

    const i18nDossier = {
        id: '68C68EFA48D9AE510647D580E43D5B57',
        name: 'Pushdown Filter',
        project,
    };

    const { credentials } = specConfiguration;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize({ width: 1600, height: 1000 });
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

    it('[TC95821_01] Pushdown Filter in the Consumption Filter panel - XFunc - Global Filter', async () => {
        // Element List
        await toc.openPageFromTocMenu({ chapterName: 'Element List', pageName: 'Page 1' });

        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Element_Category');
        await checkboxFilter.selectElementByName('Electronics');
        await filterPanel.apply();

        await since('RowCount should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('No Filter'))
            .toEqual(3);
        await since('Element_Category summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Element_Category'))
            .toBe('(Books, Electronics)');
        await toc.openPageFromTocMenu({ chapterName: 'Element List - Global Filter', pageName: 'Page 1' });
        await since('RowCount should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('No Filter'))
            .toEqual(3);
        await since('Element_Category summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Element_Category'))
            .toBe('(Books, Electronics)');

        // Value
        await toc.openPageFromTocMenu({ chapterName: 'Value - Number', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await parameterFilter.inputValue('Value_Number_UserInput_WithDefaultValue', '6000000');
        await filterPanel.apply();

        await since(
            'Value_Number_UserInput_WithDefaultValue summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Value_Number_UserInput_WithDefaultValue'))
            .toBe('(6000000)');
        await toc.openPageFromTocMenu({ chapterName: 'Value - Global Filter', pageName: 'Page 1' });
        await since(
            'Value_Number_UserInput_WithDefaultValue summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Value_Number_UserInput_WithDefaultValue'))
            .toBe('(6000000)');
    });

    it('[TC95821_02] Pushdown Filter in the Consumption Filter panel - XFunc - Mendatory', async () => {
        // Element List
        await toc.openPageFromTocMenu({ chapterName: 'Element List', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since('Context menu dots present should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.isContextMenuDotsPresent('Element_Year'))
            .toBe(false);
        await since('Mendatory icon present should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.isMendatoryIconByNameDisplayed('Element_Year'))
            .toBe(true);
        // DE308254: [Mendatory Parameter Filter] When no selection is made for a mandatory parameter filter, no warning is displayed
        await searchBoxFilter.openSecondaryPanel('Element_Year');
        await searchBoxFilter.search('2014');
        await searchBoxFilter.selectElementByName('2014');
        await filterPanel.apply();

        await filterPanel.openFilterPanel();
        // await searchBoxFilter.removeCapsuleByName({ filterName: 'Element_Year', capsuleName: '2014' });
        await searchBoxFilter.removeCapsuleByName({ filterName: 'Element_Year', capsuleName: '2015' });
        await since('Apply button enabled should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isApplyEnabled())
            .toBe(false);

        // Value
        await toc.openPageFromTocMenu({ chapterName: 'Value - BigDecimal', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since('Context menu dots present should be #{expected}, instead we have #{actual}')
            .expect(await parameterFilter.isContextMenuDotsPresent('Value_BigDecimal_UserInput_WithNoDefaultValue'))
            .toBe(false);
        await since(
            'Number input no default mandatory parameter was cleared and it should be #{expected}, instead we have #{actual}'
        )
            .expect(await parameterFilter.inputPlaceholder('Value_BigDecimal_UserInput_WithNoDefaultValue'))
            .toBe('Please enter a value');
    });

    it('[TC95821_03] Pushdown Filter in the Consumption Filter panel - XFunc - LockFilter', async () => {
        // Element List
        await toc.openPageFromTocMenu({ chapterName: 'Element List', pageName: 'Page 1' });

        await filterPanel.openFilterPanel();
        await since('Element Quarter Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isFilterItemLocked('Element_Quarter'))
            .toBe(true);

        // value
        await toc.openPageFromTocMenu({ chapterName: 'Value - DateAndTime', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since(
            'Value_DateAndTime_UserInput_NoDefaulValue Locked is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isFilterItemLocked('Value_DateAndTime_UserInput_NoDefaulValue'))
            .toBe(true);
        await calendarFilter.openSecondaryPanel('Value_DateAndTime_UserInput_NoDefaulValue');
        await since(
            'Value_DateAndTime_UserInput_NoDefaulValue Locked is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isCalFilterDetailsPanelLocked('Value_DateAndTime_UserInput_NoDefaulValue'))
            .toBe(true);
    });

    it('[TC95821_04] Pushdown Filter in the Consumption Filter panel - Interaction With Normal Filter ', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Element List', pageName: 'Page 1' });

        // Number user input no default parameter
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Category');
        await since('Category element count should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.getCheckBoxElementsCount())
            .toBe(1);
        await checkboxFilter.openSecondaryPanel('Element_Category');
        await checkboxFilter.selectElementByName('Electronics');
        await searchBoxFilter.openSecondaryPanel('Element_Year');
        await searchBoxFilter.search('2014');
        await searchBoxFilter.selectElementByName('2014');
        await filterPanel.apply();

        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Category');
        await since('Category element count should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.getCheckBoxElementsCount())
            .toBe(2);
    });
    it('[TC958822] [I18N] Certify I18N of push down filter in Consumption Library', async () => {
        const zhCN = {
            username: 'tester_auto_zhcn',
            password: '',
        };
        await libraryPage.switchUser(zhCN);
        await resetDossierState({
            credentials: zhCN,
            dossier: i18nDossier,
        });
        await libraryPage.openDossier(i18nDossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Element List', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since('Selection for Element_Subcategoryshould be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Element_Subcategory'))
            .toBe('(24 选择)');

        // DE309104: [i18n][Consumption Mode Only] Value parameter does not support locale formates that use commas as decimal points
        await toc.openPageFromTocMenu({ chapterName: 'Value - DateAndTime', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
        await since('Selection for Range DateTime should be #{expected}, instead it is #{actual}')
            .expect(await calendarFilter.capsuleDateTime('Value_DateAndTime_Range_WithDefaultValue'))
            .toBe('2014-10-21');
        await since('DateTime for Range in filter summary bar should be #{expected}, instead it is #{actual}')
            .expect(await filterSummaryBar.filterItems('Value_DateAndTime_Range_WithDefaultValue'))
            .toBe('(10/21/2014)');
        await since('Selection for User input DateTime should be #{expected}, instead it is #{actual}')
            .expect(await calendarFilter.capsuleDateTime('Value_DateAndTime_UserInput_NoDefaulValue'))
            .toBe('2024-10-23 12:00:00 中午');
        await since('DateTime for User input in filter summary bar should be #{expected}, instead it is #{actual}')
            .expect(await filterSummaryBar.filterItems('Value_DateAndTime_UserInput_NoDefaulValue'))
            .toBe('(10/23/2024 12:00:00 AM)');
        await since('Selection for Fixed List DateTime should be #{expected}, instead it is #{actual}')
            .expect(await calendarFilter.capsuleDateTime('Value_DateAndTime_FixedList_WithDefaultValue'))
            .toBe('10/17/2014');
        await since('DateTime for Fixed List in filter summary bar should be #{expected}, instead it is #{actual}')
            .expect(await filterSummaryBar.filterItems('Value_DateAndTime_FixedList_WithDefaultValue'))
            .toBe('(10/17/2014)');
    });
});

export const config = specConfiguration;
