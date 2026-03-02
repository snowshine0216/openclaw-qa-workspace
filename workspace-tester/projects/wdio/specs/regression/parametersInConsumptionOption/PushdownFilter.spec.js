import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_filter') };
describe('Pushdown Filter', () => {
    let {
        dossierPage,
        libraryPage,
        loginPage,
        filterPanel,
        filterSummaryBar,
        calendarFilter,
        attributeSlider,
        searchBoxFilter,
        checkboxFilter,
        radiobuttonFilter,
        grid,
        toc,
        parameterFilter,
    } = browsers.pageObj1;

    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const dossier = {
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

    it('[TC95820_01] Pushdown Filter in the Consumption Filter panel - Element List', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Element List', pageName: 'Page 1' });

        await filterPanel.openFilterPanel();
        await searchBoxFilter.openContextMenu('Element_Category');
        await searchBoxFilter.selectContextMenuOption('Element_Category', 'Exclude');
        await checkboxFilter.openSecondaryPanel('Element_Category');
        await checkboxFilter.selectElementByName('Books');
        await searchBoxFilter.openContextMenu('Element_Subcategory');
        await searchBoxFilter.selectContextMenuOption('Element_Subcategory', 'Clear');
        await searchBoxFilter.openSecondaryPanel('Element_Subcategory');
        await searchBoxFilter.search('Literature');
        await searchBoxFilter.keepOnly('Literature');
        await radiobuttonFilter.openSecondaryPanel('Element_Year');
        await radiobuttonFilter.selectElementByName('2014');
        await attributeSlider.dragAndDropLowerHandle('Element_Quarter', 200);
        await checkboxFilter.openSecondaryPanel('Element_Day');
        await checkboxFilter.selectElementByName('1/10/2014');
        await checkboxFilter.selectElementByName('1/11/2014');
        await filterPanel.apply();

        await since('RowCount should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('No Filter'))
            .toEqual(2);
        await since('RowCount should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('View Filter'))
            .toEqual(2);
        const Element_Category = InCanvasSelector.createByTitle('Element_Category');
        await since('Element_Category parameter in canvas value should be #{expected}, instead we have #{actual}')
            .expect(await Element_Category.getSelectedItemsCount())
            .toBe(3);
        await since('Element_Category summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Element_Category'))
            .toBe('(exclude Electronics, Movies, +1)');
        const Element_Subcategory = InCanvasSelector.createByTitle('Element_Subcategory');
        await since('Element_Subcategory parameter in canvas value should be #{expected}, instead we have #{actual}')
            .expect(await Element_Subcategory.getSelectedItemsCount())
            .toBe(1);
        await since('Element_Subategory summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Element_Subcategory'))
            .toBe('(Literature)');
        const Element_Year = InCanvasSelector.createByTitle('Element_Year');
        await since('Element_Year parameter in canvas value should be #{expected}, instead we have #{actual}')
            .expect(await Element_Year.getSliderText())
            .toBe('2014');
        await since('Element_Year summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Element_Year'))
            .toBe('(2014)');
        const Element_Quarter = InCanvasSelector.createByTitle('Element_Quarter');
        await since('Element_Quarter parameter in canvas value should be #{expected}, instead we have #{actual}')
            .expect(await Element_Quarter.getSelectedDrodownItem())
            .toBe('2017 Q2, 2017 Q3, 2017 Q4');
        await since('Element_Quarter summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Element_Quarter'))
            .toBe('(2017 Q2 - 2017 Q4)');
        const Element_Day = InCanvasSelector.createByTitle('Element_Day');
        await since('Element_Day parameter in canvas value should be #{expected}, instead we have #{actual}')
            .expect(await Element_Day.selectedSearchItemCount())
            .toBe(2);
        await since('Element_Day summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Element_Day'))
            .toBe('(1/10/2014, 1/11/2014)');
    });

    it('[TC95820_02] Pushdown Filter in the Consumption Filter panel -  Number', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Value - Number', pageName: 'Page 1' });

        // Number user input no default parameter
        await filterPanel.openFilterPanel();
        await parameterFilter.inputValue('Value_Number_UserInput_WithDefaultValue', '4000000');
        await radiobuttonFilter.openSecondaryPanel('Value_Number_FixedList_NoDefaultValue');
        await radiobuttonFilter.selectElementByName('2');
        await attributeSlider.dragAndDropHandle('Value_Number_Range_WithDefautValue', 50);
        await filterPanel.apply();
        const Value_Number_UserInput_WithDefaultValue = InCanvasSelector.createByTitle(
            'Value_Number_UserInput_WithDefaultValue'
        );
        await since(
            'Value_Number_UserInput_WithDefaultValue InCanvasValue should be #{expected}, instead we have #{actual}'
        )
            .expect(await Value_Number_UserInput_WithDefaultValue.textBoxInputText())
            .toBe('4000000');
        await since(
            'Value_Number_UserInput_WithDefaultValue summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Value_Number_UserInput_WithDefaultValue'))
            .toBe('(4000000)');
        const Value_Number_FixedList_NoDefaultValue = InCanvasSelector.createByTitle(
            'Value_Number_FixedList_NoDefaultValue'
        );
        await since(
            'Value_Number_FixedList_NoDefaultValue InCanvasValue should be #{expected}, instead we have #{actual}'
        )
            .expect(await Value_Number_FixedList_NoDefaultValue.getSelectedDrodownItem())
            .toBe('2');
        await since(
            'Value_Number_FixedList_NoDefaultValue summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Value_Number_FixedList_NoDefaultValue'))
            .toBe('(2)');
        const Value_Number_Range_WithDefautValue = await InCanvasSelector.createByTitle(
            'Value_Number_Range_WithDefautValue'
        );
        await since('Value_Number_Range_WithDefautValue InCanvasValue should be #{expected}, instead we have #{actual}')
            .expect(await Value_Number_Range_WithDefautValue.getSliderText())
            .toBe('= 4K');
        await since('Value_Number_Range_WithDefautValue summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Value_Number_Range_WithDefautValue'))
            .toBe('[4000]');

        // Default value
        await filterPanel.openFilterPanel();
        await filterPanel.clearAllFilters();
        await filterPanel.apply();
        await since(
            'Value_Number_UserInput_WithDefaultValue summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Value_Number_UserInput_WithDefaultValue'))
            .toBe('(3000000)');
        await since('Value_Number_Range_WithDefautValue summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Value_Number_Range_WithDefautValue'))
            .toBe('[2000]');
    });

    it('[TC95820_03] Pushdown Filter in the Consumption Filter panel -  BigDecimal', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Value - BigDecimal', pageName: 'Page 1' });

        // Number user input no default parameter
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('Value_BigDecimal_FixedList_NoDefaultValue');
        await radiobuttonFilter.selectElementByName('0');
        await parameterFilter.inputValue('Value_BigDecimal_UserInput_WithNoDefaultValue', '4000000');
        await attributeSlider.dragAndDropHandle('Value_BigDecimal_Range_WithDefaultValue', 100);
        await filterPanel.apply();
        const Value_BigDecimal_FixedList_NoDefaultValue = InCanvasSelector.createByTitle(
            'Value_BigDecimal_FixedList_NoDefaultValue'
        );
        await since(
            'Value_BigDecimal_FixedList_NoDefaultValue InCanvasValue should be #{expected}, instead we have #{actual}'
        )
            .expect(await Value_BigDecimal_FixedList_NoDefaultValue.getSelectedDrodownItem())
            .toBe('0');
        await since(
            'Value_BigDecimal_FixedList_NoDefaultValue summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Value_BigDecimal_FixedList_NoDefaultValue'))
            .toBe('(0)');
        const Value_BigDecimal_UserInput_WithNoDefaultValue = InCanvasSelector.createByTitle(
            'Value_BigDecimal_UserInput_WithNoDefaultValue'
        );
        await since(
            'Value_BigDecimal_UserInput_WithNoDefaultValue InCanvasValue should be #{expected}, instead we have #{actual}'
        )
            .expect(await Value_BigDecimal_UserInput_WithNoDefaultValue.textBoxInputText())
            .toBe('4000000');
        await since(
            'Value_BigDecimal_UserInput_WithNoDefaultValue summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Value_BigDecimal_UserInput_WithNoDefaultValue'))
            .toBe('(4000000)');
        const Value_BigDecimal_Range_WithDefaultValue = await InCanvasSelector.createByTitle(
            'Value_BigDecimal_Range_WithDefaultValue'
        );
        await since(
            'Value_BigDecimal_Range_WithDefaultValue InCanvasValue should be #{expected}, instead we have #{actual}'
        )
            .expect(await Value_BigDecimal_Range_WithDefaultValue.getSliderText())
            .toBe('= 60K');
        await since(
            'Value_BigDecimal_Range_WithDefaultValue summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Value_BigDecimal_Range_WithDefaultValue'))
            .toBe('[60000]');

        // Default value
        await filterPanel.openFilterPanel();
        await filterPanel.clearAllFilters();
        await filterPanel.apply();
        await since(
            'Value_BigDecimal_UserInput_WithNoDefaultValue summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Value_BigDecimal_Range_WithDefaultValue'))
            .toBe('[20000]');
    });

    it('[TC95820_04] Pushdown Filter in the Consumption Filter panel -  Text', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Value - Text', pageName: 'Page 1' });

        // Number user input no default parameter
        await filterPanel.openFilterPanel();
        await parameterFilter.inputValue('Value_Text_UserInput_NoDefaultValue', '2070');
        await radiobuttonFilter.openContextMenu('Value_Text_FixedList_WithDefaultValue');
        await radiobuttonFilter.selectContextMenuOption('Value_Text_FixedList_WithDefaultValue', 'Clear');
        await filterPanel.apply();
        const Value_Text_UserInput_NoDefaultValue = InCanvasSelector.createByTitle(
            'Value_Text_UserInput_NoDefaultValue'
        );
        await since(
            'Value_Text_UserInput_NoDefaultValue InCanvasValue should be #{expected}, instead we have #{actual}'
        )
            .expect(await Value_Text_UserInput_NoDefaultValue.textBoxInputText())
            .toBe('2070');
        await since('Value_Text_UserInput_NoDefaultValue summary bar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Value_Text_UserInput_NoDefaultValue'))
            .toBe('(2070)');
        const Value_Text_FixedList_WithDefaultValue = InCanvasSelector.createByTitle(
            'Value_Text_FixedList_WithDefaultValue'
        );
        await since(
            'Value_Text_FixedList_WithDefaultValue summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Value_Text_FixedList_WithDefaultValue'))
            .toBe('(Books)');
        await since(
            'Value_Text_FixedList_WithDefaultValue InCanvasValue should be #{expected}, instead we have #{actual}'
        )
            .expect(await Value_Text_FixedList_WithDefaultValue.getSelectedRadioButtonItem())
            .toBe('0');
    });

    it('[TC95820_05] Pushdown Filter in the Consumption Filter panel -  DateAndTime', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Value - DateAndTime', pageName: 'Page 1' });

        // Number user input no default parameter
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('Value_DateAndTime_Range_WithDefaultValue');
        await calendarFilter.selectDateInWidget({ monthYear: 'September 2014', day: '22' });
        await calendarFilter.openSecondaryPanel('Value_DateAndTime_UserInput_NoDefaulValue');
        await calendarFilter.setInputDateOfBeforeAfter({ customMonth: '5', customDay: '10', customYear: '2014' });
        await radiobuttonFilter.openSecondaryPanel('Value_DateAndTime_FixedList_WithDefaultValue');
        await radiobuttonFilter.selectElementByName('10/16/2014');
        await filterPanel.apply();
        const Value_DateAndTime_Range_WithDefaultValue = InCanvasSelector.createByTitle(
            'Value_DateAndTime_Range_WithDefaultValue'
        );
        await since(
            'Value_DateAndTime_Range_WithDefaultValue InCanvasValue should be #{expected}, instead we have #{actual}'
        )
            .expect(await Value_DateAndTime_Range_WithDefaultValue.dateAndTimeText())
            .toBe('10/21/2014');
        await since(
            'Value_DateAndTime_Range_WithDefaultValue summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Value_DateAndTime_Range_WithDefaultValue'))
            .toBe('(10/21/2014)');
        const Value_DateAndTime_UserInput_NoDefaulValue = InCanvasSelector.createByTitle(
            'Value_DateAndTime_UserInput_NoDefaulValue'
        );
        await since(
            'Value_DateAndTime_UserInput_NoDefaulValue InCanvasValue should be #{expected}, instead we have #{actual}'
        )
            .expect(await Value_DateAndTime_UserInput_NoDefaulValue.dateAndTimeText())
            .toBe('5/10/2014 12:00:00 AM');
        await since(
            'Value_DateAndTime_UserInput_NoDefaulValue summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Value_DateAndTime_UserInput_NoDefaulValue'))
            .toBe('(5/10/2014 12:00:00 AM)');
        const Value_DateAndTime_FixedList_WithDefaultValue = InCanvasSelector.createByTitle(
            'Value_DateAndTime_FixedList_WithDefaultValue'
        );
        await since(
            'Value_DateAndTime_FixedList_WithDefaultValue InCanvasValue should be #{expected}, instead we have #{actual}'
        )
            .expect(await Value_DateAndTime_FixedList_WithDefaultValue.getSelectedDrodownItem())
            .toBe('10/16/2014');
        await since(
            'Value_DateAndTime_FixedList_WithDefaultValue summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Value_DateAndTime_FixedList_WithDefaultValue'))
            .toBe('(10/16/2014)');

        await filterPanel.openFilterPanel();
        await filterPanel.clearAllFilters();
        await filterPanel.apply();
        await since(
            'Value_DateAndTime_Range_WithDefaultValue summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Value_DateAndTime_Range_WithDefaultValue'))
            .toBe('(10/17/2014)');
        await since(
            'Value_DateAndTime_FixedList_WithDefaultValue summary bar should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Value_DateAndTime_FixedList_WithDefaultValue'))
            .toBe('(10/17/2014)');
    });
});

export const config = specConfiguration;
