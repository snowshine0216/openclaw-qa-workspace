import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';

const specConfiguration = { ...customCredentials('_urlgenerate') };

describe('Url Generator', () => {
    const dossier = {
        id: 'ADC6DB6D4525CFEEDF32F6B28F1D2940',
        name: '(Auto) URL Generator',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;

    let {
        loginPage,
        dossierPage,
        libraryPage,
        filterSummary,
        filterSummaryBar,
        grid,
        authoringFilters,
        toolbar,
        libraryAuthoringPage,
        inCanvasSelector,
        rsdPage,
        calendarFilter,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    beforeEach(async () => {
        await setWindowSize({
            width: 1600,
            height: 1000,
        });
    });

    afterEach(async () => {
        await browser.url(browser.options.baseUrl);
        await dossierPage.waitForPageLoading();
    });

    it('[TC97794] Verify URL Generation Button is desabled when dashboard has not been saved', async () => {
        await libraryAuthoringPage.createDossierFromLibrary();
        await since('Generate button disabled should be #{expected}, instead we have #{actual}')
            .expect(await toolbar.isGenerateButtonDisabled())
            .toBe(true);
    });

    it('[TC97663_01] Verify URL Generation in Library Web - Element List Parameter', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        // Generate URL
        const pageKey = 'K532719A74F2E43F05EB1D6940623E762--K4DA9F6944E7818FA5A813B80FF447A88';
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        // Checkbox - Exclude
        const checkboxFilter = rsdPage.findSelectorByName('Element_Category');
        await checkboxFilter.checkbox.selectItemByText('Electronics:2');
        await authoringFilters.clickFilterContextMenuOption('Element_Category', ['Exclude']);
        const searchboxFilter = rsdPage.findSelectorByName('Element_Subcategory');
        await searchboxFilter.searchbox.input('Pop');
        await searchboxFilter.searchbox.selectItemByText('Pop');
        // issue with calendar filter exclude mode
        const calendarFilter= rsdPage.findSelectorByName('Element_Day');
        await calendarFilter.calendar.inputDate('from', '01/01/2014');
        await calendarFilter.calendar.inputDate('to', '01/06/2014');

        // incanvas selector
        const radioButtonICS = InCanvasSelector.createByTitle('Element_Year');
        await radioButtonICS.selectItem(['(All)']);
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems([
            'Element_Category',
            'Element_Subcategory',
            'Element_Year',
            'Element_Day',
        ]);
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, Cost in Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$228');
        await since('Apply url, filter summary for Category should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Element_Category'))
            .toBe('(exclude Books:1, Electronics:2)');
        await since('Apply url, filter summary for Subcategory should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Element_Subcategory'))
            .toBe('(Books - Miscellaneous, Pop)');
        await since('Apply url, filter summary for Day should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Element_Day'))
            .toBe('(1/1/2014 - 1/6/2014)');
        await since('Apply url, ICS for Year should be #{expected}, instead we have #{actual}')
            .expect(await radioButtonICS.getSelectedItemsText())
            .toEqual(['(All)']);
        await since('Apply url, filter summary for Day should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterBarItemCount())
            .toBe(3);

        // unset
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        await authoringFilters.clickFilterContextMenuOption('Element_Category', ['Reset to Default']);
        await authoringFilters.selectInCanvasContextOption('Element_Year', 'Reset to Default');
        await authoringFilters.clickFilterContextMenuOption('Element_Subcategory', ['Exclude']);
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems([
            'Element_Category',
            'Element_Subcategory',
            'Element_Year',
            'Element_Day',
        ]);
        await toolbar.clickGenerateLinkButton();
        urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, Cost in Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$88');
        await since('Apply url, filter summary for Subcategory should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Element_Subcategory'))
            .toBe('(exclude Books - Miscellaneous)');
        const ElementYearICS = InCanvasSelector.createByTitle('Element_Year');
        await since('Apply url, ICS for Year should be #{expected}, instead we have #{actual}')
            .expect(await ElementYearICS.getSelectedItemsText())
            .toEqual(['(All)']);
        await since('Apply url, filter summary for Day should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterBarItemCount())
            .toBe(2);
    });

    it('[TC97663_02] Verify URL Generation in Library Web - Element List Parameter - Dynamic Link', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        let urlAPIJSON = [
            {
                key: 'W3F6B6A326161489A9AB515A9304DAD83',
                currentSelection: {
                    elements: [{ id: 'hDYNAMIC_CATEGORY' }],
                    selectionStatus: 'included',
                    allSelected: false,
                },
            },
            {
                key: 'WDE9D26499BEB477B835C581546761403',
                currentSelection: {
                    elements: [{ id: 'hDYNAMIC_SUBCATEGORY' }],
                    selectionStatus: 'excluded',
                    allSelected: false,
                },
            },
            {
                key: 'W9692733FBD1B41D4A6EBAC87A9A53D71',
                currentSelection: {
                    elements: [{ id: 'hDYNAMIC_YEAR' }],
                    selectionStatus: 'included',
                    allSelected: false,
                },
            },
            {
                key: 'WF9E724CC176840909AF58A483C142B07',
                currentSelection: {
                    selectionStatus: 'included',
                    expression: {
                        operator: 'Between',
                        operands: [
                            {
                                type: 'form',
                                attribute: { id: '96ED3EC811D5B117C000E78A4CC5F24F', name: 'Element_Day' },
                                form: { id: '45C11FA478E745FEA08D781CEA190FE5' },
                            },
                            { type: 'constant', dataType: 'Date', value: '1/2/2014' },
                            { type: 'constant', dataType: 'Date', value: '12/30/2016' },
                        ],
                    },
                },
            },
        ];
        const pageKey = 'K532719A74F2E43F05EB1D6940623E762--K4DA9F6944E7818FA5A813B80FF447A88';
        let url = await browser.getUrl();
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        urlAPIlink = urlAPIlink
            .replaceAll('DYNAMIC_CATEGORY', '{[Element_Category]@ID};8D679D3711D3E4981000E787EC6DE8A4')
            .replaceAll('DYNAMIC_SUBCATEGORY', '{[Element_Subcategory]@ID};8D679D4F11D3E4981000E787EC6DE8A4')
            .replaceAll('DYNAMIC_YEAR', '{[Element_Year]@ID};8D679D5111D3E4981000E787EC6DE8A4');
        let customUrl = `${url}/${dossier.project.id}/${dossier.id}/${pageKey}?filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        // Generate URL
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        await authoringFilters.selectDisplayStyleForFilterItem('Element_Category', 'Drop-down');
        const CategoryFilter = rsdPage.findSelectorByName('Element_Category');
        await CategoryFilter.dropdown.clickDropdown();
        await CategoryFilter.dropdown.selectItemByText('Books:1', false);
        await authoringFilters.clickFilterContextMenuOption('Element_Subcategory', ['Exclude']);

        const YearICS = InCanvasSelector.createByTitle('Element_Year');
        await YearICS.selectItem('(All)');
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems([
            'Element_Category',
            'Element_Subcategory',
            'Element_Year',
            'Element_Day',
        ]);
        await since('URL Generator Dynamic Button Present should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isDynamicButtonPresent('Element_Day'))
            .toBe(false);
        await authoringFilters.clickDynamicButtons(['Element_Category', 'Element_Subcategory', 'Element_Year']);
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();
        await since('URL Generated should be #{expected}, instead we have #{actual}')
            .expect(urlGenerated)
            .toBe(customUrl);

        // unset
        urlAPIJSON = [
            {
                key: 'W3F6B6A326161489A9AB515A9304DAD83',
                currentSelection: {
                    elements: [{ id: 'hDYNAMIC_CATEGORY' }],
                    selectionStatus: 'included',
                    allSelected: false,
                },
            },
            {
                key: 'WDE9D26499BEB477B835C581546761403',
                currentSelection: {
                    elements: [{ id: 'hDYNAMIC_SUBCATEGORY' }],
                    selectionStatus: 'included',
                    allSelected: false,
                },
            },
            {
                key: 'W9692733FBD1B41D4A6EBAC87A9A53D71',
                currentSelection: {
                    elements: [{ id: 'hDYNAMIC_YEAR' }],
                    selectionStatus: 'included',
                    allSelected: false,
                },
            },
        ];
        urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        urlAPIlink = urlAPIlink
            .replaceAll('DYNAMIC_CATEGORY', '{[Element_Category]@ID};8D679D3711D3E4981000E787EC6DE8A4')
            .replaceAll('DYNAMIC_SUBCATEGORY', '{[Element_Subcategory]@ID};8D679D4F11D3E4981000E787EC6DE8A4')
            .replaceAll('DYNAMIC_YEAR', '{[Element_Year]@ID};8D679D5111D3E4981000E787EC6DE8A4');
        customUrl = `${url}/${dossier.project.id}/${dossier.id}/${pageKey}?filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        await authoringFilters.selectFiltersOption('Unset All Filters');
        await authoringFilters.selectInCanvasContextOption('Element_Year', 'Reset to Default');
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Element_Category', 'Element_Subcategory', 'Element_Year']);
        await authoringFilters.clickDynamicButtons(['Element_Category', 'Element_Subcategory', 'Element_Year']);
        await toolbar.clickGenerateLinkButton();
        urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);
        await since('URL Generated should be #{expected}, instead we have #{actual}')
            .expect(urlGenerated)
            .toBe(customUrl);
    });

    it('[TC97664_01] Verify URL Generation in Library Web - Value Parameter', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        const pageKey = 'KDD6F14C24BB2EE8B8C78D480C0342CBA--K58C577074ADBCC924424C6B3D7435530';
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        // Value_Number_UserInput cost>1000
        await authoringFilters.parameterFilter.inputValueParameter('Value_Number_UserInput', '1000');
        // Value_Big Decimal_Range
        await authoringFilters.metricFilter.changeMetricSliderSelection({
            filterName: 'Value_Big Decimal_Range',
            upperpos: 40,
        });
        // Value_Date_Range
        await authoringFilters.parameterFilter.chooseDateInParameter('Value_Date_Range', '2019', 'May', '31');
        // Value_Text_Fixed_List
        const ValueTextFixedList = rsdPage.findSelectorByName('Value_Text_Fixed_List');
        await ValueTextFixedList.dropdown.clickDropdown();
        await ValueTextFixedList.dropdown.selectItemByText('Literature', false);
        // Value_Date and Time_UserInput
        await authoringFilters.parameterFilter.chooseDateTimeInParameter(
            'Value_Date and Time_UserInput',
            '2016',
            'Nov',
            '15',
            '8',
            '3',
            '5',
            'AM'
        );
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems([
            'Value_Number_UserInput',
            'Value_Big Decimal_Range',
            'Value_Date_Range',
            'Value_Text_Fixed_List',
            'Value_Date and Time_UserInput',
        ]);
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('filter summary for Value_Number_UserInput should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Value_Number_UserInput'))
            .toBe('(1000)');
        await since('filter summary for Value_Big Decimal_Range should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Value_Big Decimal_Range'))
            .toBe('[400]');
        await since('filter summary for Value_Date_Range should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Value_Date_Range'))
            .toBe('(5/31/2019)');
        const ValueTextFixedListICS = InCanvasSelector.createByTitle('Value_Text_Fixed_List');
        const ValueDateAndTimeUserInputICS = InCanvasSelector.createByTitle('Value_Date and Time_UserInput');
        await since('Value_Text_Fixed_List should be #{expected}, instead we have #{actual}')
            .expect(await ValueTextFixedListICS.getSelectedDrodownItem())
            .toBe('Literature');
        const TimeInput = await ValueDateAndTimeUserInputICS.dateAndTimeText();
        console.log('TimeInput:' + TimeInput);
        await since('Value_Date and Time_UserInput should be #{expected}, instead we have #{actual}')
            .expect(TimeInput === '11/15/2016 8:03:05 AM' || TimeInput === '8/15/2016 8:03:05 AM')
            .toBe(true);
        await since('Data for Cost > Value_Number_UserInput should be #{expected}, instead we have #{actual}')
            .expect(
                await grid.firstElmOfHeader({
                    title: 'Visualization 1',
                    headerName: 'Cost > Value_Number_UserInput',
                })
            )
            .toBe(' ');

        // Unset filters and selectors
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        await authoringFilters.selectFiltersOption('Unset All Filters');
        await authoringFilters.selectInCanvasContextOption('Value_Text_Fixed_List', 'Reset to Default');
        await authoringFilters.selectInCanvasContextOption('Value_Date and Time_UserInput', 'Reset to Default');
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems([
            'Value_Number_UserInput',
            'Value_Big Decimal_Range',
            'Value_Date_Range',
            'Value_Text_Fixed_List',
            'Value_Date and Time_UserInput',
        ]);
        await toolbar.clickGenerateLinkButton();
        urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('filter summary number should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterBarItemCount())
            .toBe(1);
        await since('Value_Text_Fixed_List should be #{expected}, instead we have #{actual}')
            .expect(await ValueTextFixedListICS.getSelectedDrodownItem())
            .toBe('Business');
        await since('Value_Date and Time_UserInput should be #{expected}, instead we have #{actual}')
            .expect(await ValueDateAndTimeUserInputICS.dateAndTimeText())
            .toBe('');
    });

    it('[TC97664_02] Verify URL Generation in Library Web - Value Parameter - Dynamic Link', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        let url = await browser.getUrl();

        let urlAPIJSON = [
            {
                key: 'W21686B61BCE64EFB8A0BD6C30C3F6C92',
                currentSelection: {
                    selectionStatus: 'included',
                    values: ['DYNAMIC_PLACEHOLDER_Value_Number_UserInput'],
                },
            },
            {
                key: 'W23A2973CEE684FEDB137386443985B77',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                    values: [],
                },
            },
            {
                key: 'W7368E0E845F347C9950AF2CE752B3B05',
                currentSelection: {
                    selectionStatus: 'included',
                    values: ['DYNAMIC_PLACEHOLDER_Value_Date_Range'],
                },
            },
            {
                key: 'W0951962A47AD4E69AEBFBDB551C12511',
                currentSelection: {
                    selectionStatus: 'included',
                    values: ['DYNAMIC_PLACEHOLDER_Value_Text_Fixed_List'],
                },
            },
            {
                key: 'W3F286B44C0704A4488BE9914BA047C74',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                    values: [],
                },
            },
        ];

        const pageKey = 'KDD6F14C24BB2EE8B8C78D480C0342CBA--K58C577074ADBCC924424C6B3D7435530';
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        let customUrl = `${url}/${dossier.project.id}/${dossier.id}/${pageKey}?filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);

        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        // Value_Number_UserInput cost>2000
        await authoringFilters.parameterFilter.inputValueParameter('Value_Number_UserInput', '2000');
        // unfiltered
        await authoringFilters.clickFilterContextMenuOption('Value_Big Decimal_Range', ['Reset to Default']);
        await authoringFilters.parameterFilter.chooseDateInParameter('Value_Date_Range', '2014', 'May', '31');
        const ValueTextFixedList = rsdPage.findSelectorByName('Value_Text_Fixed_List');
        await ValueTextFixedList.dropdown.clickDropdown();
        await ValueTextFixedList.dropdown.selectItemByText('Literature', false);
        await authoringFilters.selectInCanvasContextOption('Value_Date and Time_UserInput', 'Reset to Default');
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems([
            'Value_Number_UserInput',
            'Value_Big Decimal_Range',
            'Value_Date_Range',
            'Value_Text_Fixed_List',
            'Value_Date and Time_UserInput',
        ]);
        await authoringFilters.clickDynamicButtons([
            'Value_Number_UserInput',
            'Value_Big Decimal_Range',
            'Value_Date_Range',
            'Value_Text_Fixed_List',
            'Value_Date and Time_UserInput',
        ]);
        await toolbar.clickGenerateLinkButton();
        const urlGenerated = await dossierPage.getClipboardText();
        await since('URL Generated should be #{expected}, instead we have #{actual}')
            .expect(urlGenerated)
            .toBe(customUrl);
    });

    it('[TC97826_01] Validate URL API pass Attribute filter in Library Web', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });

        // Generate URL
        const pageKey = 'K3C703D334FD75BADE060E2A3623A71FD--K1B74DF6E4701CB3A16D7C1B8813B41C6';
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        const CategoryFilter = rsdPage.findSelectorByName('Category');
        await CategoryFilter.dropdown.clickDropdown();
        await CategoryFilter.dropdown.selectItemByText('Music', false);
        await CategoryFilter.dropdown.clickOKBtn(false);
        await authoringFilters.clickFilterContextMenuOption('Category', ['Exclude']);
        const SubcategoryFilter = rsdPage.findSelectorByName('Subcategory');
        await SubcategoryFilter.radiobutton.selectItemByText('(All)', false);

        const calendarSelector = rsdPage.findSelectorByName('Day');
        await calendarSelector.calendar.inputDate('from', '1/31/2015');
        await calendarSelector.calendar.inputDate('to', '2/11/2015');
        const YearSelector = rsdPage.findSelectorByName('Year');
        await YearSelector.listbox.selectItemByText('2016', false);

        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Category', 'Subcategory', 'Year', 'Day']);
        await toolbar.clickGenerateLinkButton();
        const urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter Count should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterCountString())
            .toBe('FILTERS (1)');
        await since('Apply url, filter summary for Category should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Category'))
            .toBe('(exclude Electronics, Movies, +1)');
        // const YearICS = InCanvasSelector.createByTitle('Year');
        const DayICS = InCanvasSelector.createByTitle('Day');
        await since('Apply url, ICS for Year should be #{expected}, instead we have #{actual}')
            .expect(await YearSelector.listbox.getSeletedItemsCount())
            .toBe(1);
        await since('Apply url, ICS for Day should be #{expected}, instead we have #{actual}')
            .expect(await DayICS.dateAndTimeText())
            .toBe('1/31/2015');
    });

    it('[TC97660_01] Verify URL Generation in Library Web - Metric Filter/Selector - Metric Qualification', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        const pageKey = 'K8727C90849772C79E030FEAA9A64CE5C--KE5C485434898FB45448E63A878DA3E9A';
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();

        // Metric Qualification - Cost < 4M, Profit lowest 10%, Revenue between 500K and 700K, Margin highest 5
        await authoringFilters.metricFilter.changeMQSelection({
            filterName: 'Cost',
            optionName: 'Less than',
            value1: '4000000',
        });
        await authoringFilters.metricFilter.changeMQSelection({
            filterName: 'Profit',
            optionName: 'Lowest',
            value1: '10',
        });
        await authoringFilters.metricFilter.changeMQSelection({
            filterName: 'Revenue',
            optionName: 'Between',
            value1: '500000',
            value2: '700000',
        });
        await authoringFilters.metricFilter.changeMQSelection({
            filterName: 'Margin',
            optionName: 'Highest',
            value1: '5',
        });

        // Generate URL
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Cost', 'Profit', 'Revenue', 'Margin']);
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Cost should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Cost'))
            .toBe('[<4M]');
        await since('Apply url, filter summary for Profit should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Profit'))
            .toBe('[Lowest 10]');
        let RevenueICS = InCanvasSelector.createByTitle('Revenue');
        let MarginICS = InCanvasSelector.createByTitle('Margin');
        await since('Apply url, ICS for Revenue should be #{expected}, instead we have #{actual}')
            .expect(await RevenueICS.getDropdownSelectedText())
            .toBe('Between');
        await since('Apply url, ICS for Margin should be #{expected}, instead we have #{actual}')
            .expect(await MarginICS.getDropdownSelectedText())
            .toBe('Highest');
        await since('Apply url, row count should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(3);

        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();

        // Metric Qualification - Cost equals 722590, Profit lowest 20%, Revenue Is Not Null, Margin highest% 5
        await authoringFilters.metricFilter.changeMQSelection({
            filterName: 'Cost',
            optionName: 'Equals',
            value1: '722589.9732',
        });
        await authoringFilters.metricFilter.changeMQSelection({
            filterName: 'Profit',
            optionName: 'Lowest %',
            value1: '20',
        });
        await authoringFilters.metricFilter.changeMQSelection({ filterName: 'Revenue', optionName: 'Is Not Null' });
        await authoringFilters.metricFilter.changeMQSelection({
            filterName: 'Margin',
            optionName: 'Highest %',
            value1: '5',
        });

        // Generate URL
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Cost', 'Profit', 'Revenue', 'Margin']);
        await toolbar.clickGenerateLinkButton();
        urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Cost should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Cost'))
            .toBe('[=723K]');
        await since('Apply url, filter summary for Profit should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Profit'))
            .toBe('[Lowest 20%]');
        await since('Apply url, ICS for Revenue should be #{expected}, instead we have #{actual}')
            .expect(await RevenueICS.getDropdownSelectedText())
            .toBe('Is Not Null');
        await since('Apply url, ICS for Margin should be #{expected}, instead we have #{actual}')
            .expect(await MarginICS.getDropdownSelectedText())
            .toBe('Highest %');
        await since('Apply url, row count should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(2);

        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        // unset all filters
        await authoringFilters.selectFiltersOption('Unset All Filters');
        await authoringFilters.metricFilter.changeMQSelection({
            filterName: 'Revenue',
            optionName: 'In',
            value1: '811787',
        });

        // Generate URL
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Cost', 'Profit', 'Revenue', 'Margin']);
        await toolbar.clickGenerateLinkButton();
        urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Cost should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterBarItemCount())
            .toBe(1);
        await since('Apply url, ICS for Revenue should be #{expected}, instead we have #{actual}')
            .expect(await RevenueICS.getDropdownSelectedText())
            .toBe('In');
        await since('Apply url, ICS for Margin should be #{expected}, instead we have #{actual}')
            .expect(await MarginICS.getDropdownSelectedText())
            .toBe('Lowest %');
        await since('Apply url, row count should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(2);
    });

    it('[TC97660_02] Verify URL Generation in Library Web - Metric Filter/Selector - Metric Slider', async () => {
        // does not support exclude mode
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        const pageKey = 'K1C767393470B8A6360EDBC95F53182DF--K2D0339054AC5970AF97A149F749A1F43';
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        // Metric Slider - between
        await authoringFilters.metricFilter.changeMetricSliderSelection({
            filterName: 'Cost',
            lowerpos: 20,
            upperpos: -20,
        });
        await authoringFilters.metricFilter.changeMetricSliderSelection({
            filterName: 'Profit',
            optionName: 'Lowest',
            upperpos: -10,
        });
        await authoringFilters.metricFilter.changeMetricSliderByInputBox({
            filterName: 'Revenue',
            handle: 'lower',
            value: '1100000',
        });
        await authoringFilters.metricFilter.changeMetricSliderSelection({
            filterName: 'Margin',
            optionName: 'Lowest %',
        });
        // Generate URL
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Cost', 'Profit', 'Revenue', 'Margin']);
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Cost should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Cost'))
            .toBe('[658K-4M]');
        await since('Apply url, filter summary for Profit should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Profit'))
            .toBe('[Lowest 20]');
        let RevenueICS = InCanvasSelector.createByTitle('Revenue');
        let MarginICS = InCanvasSelector.createByTitle('Margin');
        await since('Apply url, ICS for Revenue should be #{expected}, instead we have #{actual}')
            .expect(await RevenueICS.getSliderSelectedText())
            .toBe('≥ $1.1M');
        await since('Apply url, ICS for Margin should be #{expected}, instead we have #{actual}')
            .expect(await MarginICS.getDropdownSelectedText())
            .toBe('Lowest %');

        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        // Cost Exclude, Profit Highest %, Revenue < 50%, Margin Lowest%
        await authoringFilters.clickFilterContextMenuOption('Cost', ['Exclude']);
        await authoringFilters.metricFilter.changeMetricSliderSelection({
            filterName: 'Cost',
            lowerpos: 30,
            upperpos: -30,
        });
        await authoringFilters.metricFilter.changeMetricSliderSelection({
            filterName: 'Profit',
            optionName: 'Highest %',
            upperpos: -20,
        });
        await authoringFilters.metricFilter.changeMetricSliderByInputBox({
            filterName: 'Revenue',
            handle: 'upper',
            value: '4800000',
        });
        await authoringFilters.metricFilter.changeMetricSliderSelection({
            filterName: 'Margin',
            optionName: 'Lowest %',
        });
        await authoringFilters.metricFilter.changeMetricSliderByInputBox({
            filterName: 'Margin',
            handle: 'upper',
            value: '96',
        });
        await authoringFilters.selectInCanvasContextOption('Margin', 'Exclude');
        // Generate URL
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Cost', 'Profit', 'Revenue', 'Margin']);
        await toolbar.clickGenerateLinkButton();
        urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Cost should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Cost'))
            .toBe('[Not between 867K-4M]');
        await since('Apply url, filter summary for Profit should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Profit'))
            .toBe('[Highest 89%]');
        await since('Apply url, ICS for Revenue should be #{expected}, instead we have #{actual}')
            .expect(await RevenueICS.getSliderSelectedText())
            .toBe('$811.3K - $4.8M');
        await since('Apply url, ICS for Margin should be #{expected}, instead we have #{actual}')
            .expect(await MarginICS.getSliderSelectedText())
            .toBe('≤ 96%');

        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        //  Unset filter
        await authoringFilters.selectFiltersOption('Unset All Filters');
        await authoringFilters.selectInCanvasContextOption('Revenue', 'Unset Filter');
        await authoringFilters.selectInCanvasContextOption('Margin', 'Unset Filter');
        // Generate URL
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Cost', 'Profit', 'Revenue', 'Margin']);
        await toolbar.clickGenerateLinkButton();
        urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Cost should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterCountString())
            .toBe('FILTERS (0)');
    });

    it('[TC97660_03] Verify URL Generation in Library Web - Metric Filter/Selector - Dynamic Link for Metric Qualification', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        let url = await browser.getUrl();
        let urlAPIJSON = [
            {
                key: 'W08663AB33DCD4B6EA9400B8B66198648',
                currentSelection: {
                    selectionStatus: 'included',
                    expression: {
                        operator: 'Equals',
                        operands: [
                            {
                                type: 'metric',
                                id: '7FD5B69611D5AC76C000D98A4CC5F24F',
                                name: 'Cost',
                            },
                            {
                                type: 'constant',
                                dataType: 'Real',
                                value: 'DYNAMIC_PLACEHOLDER_Cost',
                            },
                        ],
                    },
                },
            },
            {
                key: 'W0992C5788A994E10937D4F8401E51ECA',
                currentSelection: {
                    selectionStatus: 'included',
                    expression: {
                        operator: 'Percent.Bottom',
                        operands: [
                            {
                                type: 'metric',
                                id: '4C051DB611D3E877C000B3B2D86C964F',
                                name: 'Profit',
                            },
                            {
                                type: 'constant',
                                dataType: 'Real',
                                value: 'DYNAMIC_PLACEHOLDER_Profit',
                            },
                        ],
                    },
                },
            },
            {
                key: 'WCB5A13E6DD1D49FF9680B2E60CA8C8A8',
                currentSelection: {
                    selectionStatus: 'included',
                    expression: {
                        operator: 'Between',
                        operands: [
                            {
                                type: 'metric',
                                id: 'F0EFD7774BD72C3D70C0E1BA4E9005F9',
                                name: 'Revenue',
                            },
                            {
                                type: 'constant',
                                dataType: 'Real',
                                value: 'DYNAMIC_PLACEHOLDER_Revenue',
                            },
                            {
                                type: 'constant',
                                dataType: 'Real',
                                value: 'DYNAMIC_PLACEHOLDER_Revenue',
                            },
                        ],
                    },
                },
            },
            {
                key: 'W33AD25E5637B49179775519F11DAA11C',
                currentSelection: {
                    selectionStatus: 'included',
                    expression: {
                        operator: 'Percent.Top',
                        operands: [
                            {
                                type: 'metric',
                                id: 'D8A3AD13442A273183FE68A9CCB25758',
                                name: 'Margin',
                            },
                            {
                                type: 'constant',
                                dataType: 'Real',
                                value: 'DYNAMIC_PLACEHOLDER_Margin',
                            },
                        ],
                    },
                },
            },
        ];
        let pageKey = 'K8727C90849772C79E030FEAA9A64CE5C--KE5C485434898FB45448E63A878DA3E9A';
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        let customUrl = `${url}/${dossier.project.id}/${dossier.id}/${pageKey}?filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();

        // Generate dynamic link for include mode
        await authoringFilters.metricFilter.changeMQSelection({
            filterName: 'Cost',
            optionName: 'Equals',
            value1: '370160.58300',
        });
        await authoringFilters.metricFilter.changeMQSelection({
            filterName: 'Profit',
            optionName: 'Lowest %',
            value1: '20',
        });
        await authoringFilters.metricFilter.changeMQSelection({
            filterName: 'Revenue',
            optionName: 'Between',
            value1: '400000',
            value2: '500000',
        });
        await authoringFilters.metricFilter.changeMQSelection({
            filterName: 'Margin',
            optionName: 'Highest %',
            value1: '10',
        });

        // Generate URL
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Cost', 'Profit', 'Revenue', 'Margin']);
        await authoringFilters.clickDynamicButtons(['Cost', 'Profit', 'Revenue', 'Margin']);
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);
        await since('URL Generated should be #{expected}, instead we have #{actual}')
            .expect(urlGenerated)
            .toBe(customUrl);

        // Unset
        urlAPIJSON = [
            {
                key: 'W08663AB33DCD4B6EA9400B8B66198648',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                },
            },
            {
                key: 'W0992C5788A994E10937D4F8401E51ECA',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                },
            },
            {
                key: 'WCB5A13E6DD1D49FF9680B2E60CA8C8A8',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                },
            },
            {
                key: 'W33AD25E5637B49179775519F11DAA11C',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                },
            },
        ];
        pageKey = 'K8727C90849772C79E030FEAA9A64CE5C--KE5C485434898FB45448E63A878DA3E9A';
        urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        customUrl = `${url}/${dossier.project.id}/${dossier.id}/${pageKey}?filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();

        // Generate dynamic link for unset mode
        await authoringFilters.selectFiltersOption('Unset All Filters');
        await authoringFilters.selectInCanvasContextOption('Revenue', 'Unset Filter');
        await authoringFilters.selectInCanvasContextOption('Margin', 'Unset Filter');

        // Generate URL
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Cost', 'Profit', 'Revenue', 'Margin']);
        await authoringFilters.clickDynamicButtons(['Cost', 'Profit', 'Revenue', 'Margin']);
        await toolbar.clickGenerateLinkButton();
        urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);
        await since('URL Generated should be #{expected}, instead we have #{actual}')
            .expect(urlGenerated)
            .toBe(customUrl);
    });

    it('[TC97660_04] Verify URL Generation in Library Web - Metric Filter/Selector - Dynamic Link for Metric Slider', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        let url = await browser.getUrl();
        let urlAPIJSON = [
            {
                key: 'IGK117D10B84E3688B097F540A5BF542DB9',
                currentSelection: {
                    selectionStatus: 'included',
                    expression: {
                        operator: 'Greater',
                        operands: [
                            {
                                type: 'metric',
                                id: '7FD5B69611D5AC76C000D98A4CC5F24F',
                                name: 'Cost',
                            },
                            {
                                type: 'constant',
                                dataType: 'Real',
                                value: 'DYNAMIC_PLACEHOLDER_Cost',
                            },
                        ],
                    },
                },
            },
            {
                key: 'IGK267CBBF74B638CAE156BBBA4BBAA42A3',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                },
            },
            {
                key: 'W78EDE0328DE84FA8BA1FA02D59707BA4',
                currentSelection: {
                    selectionStatus: 'unfiltered',
                },
            },
            {
                key: 'WAD3B71D048DF4BCB8897907C1E9AE94F',
                currentSelection: {
                    selectionStatus: 'included',
                    expression: {
                        operator: 'Rank.Top',
                        operands: [
                            {
                                type: 'metric',
                                id: 'D8A3AD13442A273183FE68A9CCB25758',
                                name: 'Margin',
                            },
                            {
                                type: 'constant',
                                dataType: 'Real',
                                value: 'DYNAMIC_PLACEHOLDER_Margin',
                            },
                        ],
                    },
                },
            },
        ];
        let pageKey = 'K1C767393470B8A6360EDBC95F53182DF--K2D0339054AC5970AF97A149F749A1F43';
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        let customUrl = `${url}/${dossier.project.id}/${dossier.id}/${pageKey}?filters=${urlAPIlink}`;
        console.log('customUrl:' + customUrl);

        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();

        // Metric Slider
        // exclude mode
        await authoringFilters.metricFilter.changeMetricSliderSelection({
            filterName: 'Cost',
            upperpos: -40,
        });
        await authoringFilters.clickFilterContextMenuOption('Cost', ['Exclude']);
        await authoringFilters.metricFilter.changeMetricSliderSelection({
            filterName: 'Profit',
            optionName: 'Lowest %',
            upperpos: -10,
        });
        // cannot generate dynamic link for unset mode
        await authoringFilters.clickFilterContextMenuOption('Profit', ['Unset Filter']);
        await authoringFilters.metricFilter.changeMetricSliderSelection({
            filterName: 'Revenue',
            lowerpos: 30,
        });
        await authoringFilters.selectInCanvasContextOption('Revenue', 'Unset Filter');
        await authoringFilters.metricFilter.changeMetricSliderSelection({
            filterName: 'Margin',
            optionName: 'Highest',
            upperpos: -20,
        });
        // Generate URL
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Cost', 'Profit', 'Revenue', 'Margin']);
        await authoringFilters.clickDynamicButtons(['Cost', 'Profit', 'Revenue', 'Margin']);
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);
        await since('URL Generated should be #{expected}, instead we have #{actual}')
            .expect(urlGenerated)
            .toBe(customUrl);
    });

    it('[TC97659] Verify URL Generation in Library Web - Panel Selector/AttributeMetric Selector ', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        const pageKey = 'K731EACF64A87367F57E812978B13B878--K351D7D3D4C3EF0E74C642EAD866FD337';
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        // Panel selector, Attribute Selector, Metric Selector
        const attributeSelectorKey = 'W8E65880B15D14B7C8060F377D9522EDC';
        const metricSelectorKey = 'WF983059E93414FE4A750C6939A0036DD';
        const panelSelectorKey = 'W716B9D808A2D4604A8383944445E09B3';
        await inCanvasSelector.selectItemByKey(attributeSelectorKey, 'Month');
        await inCanvasSelector.selectItemByKey(metricSelectorKey, 'Revenue');
        await inCanvasSelector.selectItemByKey(panelSelectorKey, 'Profit');
        // Generate URL
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Attribute Selector', 'Metric Selector', 'Panel Selector']);
        await since('URL Generator Dynamic Button Present should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isDynamicButtonPresent('Attribute Selector'))
            .toBe(false);
        await since('URL Generator Dynamic Button Present should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isDynamicButtonPresent('Metric Selector'))
            .toBe(false);
        await since('URL Generator Dynamic Button Present should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isDynamicButtonPresent('Panel Selector'))
            .toBe(false);
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        let AttributeICS = InCanvasSelector.createByTitle('Attribute Selector');
        let MetricICS = InCanvasSelector.createByTitle('Metric Selector');
        let PanelICS = InCanvasSelector.createByTitle('Panel Selector');
        await since('Apply url, ICS for Attribute should be #{expected}, instead we have #{actual}')
            .expect(await AttributeICS.getSelectedItemsText())
            .toEqual(['Year', 'Month']);
        await since('Apply url, ICS for Metric should be #{expected}, instead we have #{actual}')
            .expect(await MetricICS.getSelectedItemsText())
            .toEqual(['Revenue', 'Margin']);
        await since('Apply url, ICS for PanelSelector should be #{expected}, instead we have #{actual}')
            .expect(await PanelICS.getSelectedItemsText())
            .toEqual(['Profit']);
        await since('The first element of Month should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Month' }))
            .toBe('Jan 2014');
        await since('The first element of Cost should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Revenue' }))
            .toBe('$37,161');
        await since('The first element of Cost should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization Profit', headerName: 'Profit' }))
            .toBe('$569,278');

        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        // unset all filters
        await AttributeICS.openContextMenu();
        await AttributeICS.selectOptionInMenu('Unset Selector');
        await MetricICS.openContextMenu();
        await MetricICS.selectOptionInMenu('Unset Selector');

        // Generate URL
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Attribute Selector', 'Metric Selector']);
        await toolbar.clickGenerateLinkButton();
        urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated for unset filter:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, ICS for Attribute should be #{expected}, instead we have #{actual}')
            .expect(await AttributeICS.getSelectedItemsText())
            .toEqual([]);
        await since('Apply url, ICS for Metric should be #{expected}, instead we have #{actual}')
            .expect(await MetricICS.getSelectedItemsText())
            .toEqual([]);
        await since('The first element of Month should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Year' }))
            .toBe('2014');
        await since('The first element of Cost should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Cost' }))
            .toBe('$510,239');
    });

    it('[TC96807] Verify Compatibility of URL Generation', async () => {
        await setWindowSize({
            width: 1000,
            height: 1000,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        const pageKey = 'K532719A74F2E43F05EB1D6940623E762--K4DA9F6944E7818FA5A813B80FF447A88';
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        const checkboxFilter = rsdPage.findSelectorByName('Element_Category');
        await checkboxFilter.checkbox.selectItemByText('Music:4');
        await toolbar.clickMenuItemInMobileView('Generate embedding URL');
        await authoringFilters.selectFilterItems([
            'Element_Category',
            'Element_Subcategory',
            'Element_Year',
            'Element_Day',
        ]);
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Element_Category should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Element_Category'))
            .toBe('(Books:1, Music:4)');
    });

    it('[TC96808] Verify internalization of URL Generation', async () => {
        const i18nCredentials = {
            username: 'tester_auto_zhcn',
            password: '',
        };
        await libraryPage.switchUser(i18nCredentials);
        await resetDossierState({
            credentials: i18nCredentials,
            dossier: dossier,
        });
        const pageKey = 'K532719A74F2E43F05EB1D6940623E762--K4DA9F6944E7818FA5A813B80FF447A88';
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        await toolbar.hoverURLGeneratorButton();
        await since('URL Generator Button Tooltip should be #{expected}, instead we have #{actual}')
            .expect(await toolbar.mojoTooltip())
            .toBe('生成嵌入 URL');
        await toolbar.clickURLGeneratorButton();
        await since('URL Generator Title should be #{expected}, instead we have #{actual}')
            .expect(await toolbar.generatorBarText())
            .toBe('选择筛选器和/或选择器来生成嵌入 URL\n生成链接');
    });
});

export const config = specConfiguration;
