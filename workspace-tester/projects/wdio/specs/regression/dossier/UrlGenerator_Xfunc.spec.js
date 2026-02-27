import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';

const specConfiguration = { ...customCredentials('_urlgenerate') };

describe('Url Generator', () => {
    const dossier = {
        id: '3812D28A4CF8CC495E97ABBFC76C2F26',
        name: '(Auto) URL Generator_XFunc',
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
        filterPanel,
        checkboxFilter,
        grid,
        authoringFilters,
        toolbar,
        toc,
        rsdPage,
        calendarFilter,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize({
            width: 1600,
            height: 1000,
        });
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
    });

    afterEach(async () => {
        await browser.url(browser.options.baseUrl);
        await dossierPage.waitForPageLoading();
    });

    it('[TC96806_01] Verify URL Generation in Library Web - Xfunc - Dynamic Selection', async () => {
        // Generate URL
        const pageKey = 'K5CE2B8C240053C3569B0E0AD3EF22644--K587BF0044DB9822A676B99BC7D9899C5';
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        await authoringFilters.changeToDynamicSelection('Category');
        await authoringFilters.changeToDynamicSelection('Element_Subcategory');
        await authoringFilters.changeToDynamicSelection('Element_Year');
        await authoringFilters.changeToDynamicSelection('Quarter');
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Category', 'Element_Subcategory', 'Element_Year', 'Quarter']);
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await filterPanel.openFilterPanel();
        await since('Apply url, filter selection for Category should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Category'))
            .toBe('(Last 2)');
        await since('filter selection for Element_Subcategory should be #{expected}, instead we have #{actual}')
            .expect(await checkboxFilter.filterSelectionInfo('Element_Subcategory'))
            .toBe('(First 2)');
        let ElementYearICS = InCanvasSelector.createByTitle('Element_Year');
        let QuarterICS = InCanvasSelector.createByTitle('Quarter');
        await since('Apply url, ICS for Year should be #{expected}, instead we have #{actual}')
            .expect(await ElementYearICS.getSelectedItemsText())
            .toEqual(['2014']);
        await since('Apply url, filter summary for Quarter should be #{expected}, instead we have #{actual}')
            .expect(await QuarterICS.getSelectedItemsText())
            .toEqual(['2014 Q1']);
    });

    it('[TC96806_02] Verify URL Generation in Library Web - Xfunc - Disable Interaction', async () => {
        // Generate URL
        const pageKey = 'K4BB6A28841B7AC0CDD3EF6B09501E06D--K8B018AC54FA92D00D68EB7BB8545AE0F';
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        const CheckBoxFilter = rsdPage.findSelectorByName('Element_Category');
        await CheckBoxFilter.checkbox.selectItemByText('Movies:3');
        await authoringFilters.clickFilterContextMenuOption('Element_Day', ['Exclude']);
        const RadioButtonFilter = rsdPage.findSelectorByName('Year');
        await RadioButtonFilter.radiobutton.selectItemByText('2014', false);
        const SearchBoxFilter = rsdPage.findSelectorByName('Quarter');
        await SearchBoxFilter.searchbox.input('2014 Q1');
        await SearchBoxFilter.searchbox.selectItemByText('2014 Q1');
        await authoringFilters.metricFilter.changeMetricSliderSelection({
            filterName: 'Profit',
            lowerpos: 20,
            upperpos: -20,
        });
        await authoringFilters.metricFilter.changeMQSelection({
            filterName: 'Cost',
            optionName: 'Greater than',
            value1: '72000',
        });
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems([
            'Element_Category',
            'Element_Day',
            'Year',
            'Quarter',
            'Profit',
            'Cost',
        ]);
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Element_Category should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Element_Category'))
            .toBe('(Books:1, Movies:3)');
        // DE310252: [URL Generation] Cannot pass exclude mode when apply URL generated of Element List(Day) parameter filter
        await since('Apply url, filter summary for Element_Day should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Element_Day'))
            .toBe('(1/2/2014 - 12/30/2016)');
        await since('Apply url, filter summary for Year should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Year'))
            .toBe('(2014)');
        await since('Apply url, filter summary for Quarter should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Quarter'))
            .toBe('(2014 Q1)');
        await since('Apply url, filter summary for Profit should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Profit'))
            .toBe('[29-90]');
        await since('Apply url, filter summary for Cost should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Cost'))
            .toBe('[>72K]');
    });

    it('[TC96806_03] Verify URL Generation in Library Web - Xfunc - Selection Required', async () => {
        const pageKey = 'K13E3E4E847897490B4D6DEB2A9A3A773--K5777B6944234E9460AFAD9A4DC540330';
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        const CheckBoxFilter = rsdPage.findSelectorByName('Element_Category');
        await CheckBoxFilter.checkbox.selectItemByText('Books:1');
        await authoringFilters.clickFilterContextMenuOption('Subcategory', ['Unset Filter']);
        await authoringFilters.parameterFilter.inputValueParameter('Value_Number_UserInput', '');
        await authoringFilters.selectInCanvasContextOption('Value_Date and Time_UserInput', 'Reset to Default');
        const ButtonBarFilter = rsdPage.findSelectorByName('Month');
        await ButtonBarFilter.listbox.selectItemByText('Jan 2014', false);
        // Generate URL
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems([
            'Element_Category',
            'Subcategory',
            'Value_Number_UserInput',
            'Value_Date and Time_UserInput',
            'Month',
        ]);
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter count should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterBarItemCount())
            .toBe(2);
        await since('Apply url, filter summary for Subcategory should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Subcategory'))
            .toBe('(Art & Architecture, Business, +7)');
        await since(
            'Apply url, filter summary for Value_Number_UserInput should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Value_Number_UserInput'))
            .toBe('(1000)');
        const ValueDateAndTimeUserInputICS = InCanvasSelector.createByTitle('Value_Date and Time_UserInput');
        const MonthICS = InCanvasSelector.createByTitle('Month');
        await since('MonthICS should be #{expected}, instead we have #{actual}')
            .expect(await MonthICS.getSelectedItemsText())
            .toEqual([]);
        await since('Value_Date and Time_UserInput should be #{expected}, instead we have #{actual}')
            .expect(await ValueDateAndTimeUserInputICS.dateAndTimeText())
            .toBe('9/10/2014 2:09:08 PM');
    });

    it('[TC96806_04] Verify URL Generation in Library Web - Xfunc - Consolidation and Custom group', async () => {
        // Generate URL
        let url = await browser.getUrl();
        const pageKey = 'K6A4ACBE6459F54FEC343CA911FB967C0--KCE9E2C584D6B3F25D4206E82D709062D';
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        // Include
        await authoringFilters.metricFilter.changeMetricSliderSelection({
            filterName: 'Age Groups',
            upperpos: 50,
        });
        const SeasonFilter = rsdPage.findSelectorByName('Season');
        await SeasonFilter.checkbox.selectItemByText('Spring');
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Age Groups', 'Season']);
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Age Groups should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Age Groups'))
            .toBe('(< 25 - 27)');
        await since('Apply url, filter summary for Season should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Season'))
            .toBe('(Winter, Spring)');

        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        // Unset
        await authoringFilters.clickFilterContextMenuOption('Age Groups', ['Unset Filter']);
        await authoringFilters.clickFilterContextMenuOption('Season', ['Unset Filter']);
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Age Groups', 'Season']);
        await toolbar.clickGenerateLinkButton();
        urlGenerated = await dossierPage.getClipboardText();

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Age Groups should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterCountString())
            .toBe('FILTERS (2)');
        await since('Apply url, filter summary for Season should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Season'))
            .toBe('(Winter)');

        // Dynamic URL
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        await authoringFilters.metricFilter.changeMetricSliderSelection({
            filterName: 'Age Groups',
            upperpos: 50,
        });
        await SeasonFilter.checkbox.selectItemByText('Spring');
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Age Groups', 'Season']);
        await authoringFilters.clickDynamicButtons(['Age Groups', 'Season']);
        await toolbar.clickGenerateLinkButton();
        urlGenerated = await dossierPage.getClipboardText();

        let urlAPIJSON = [
            {
                key: 'W2C75558F2FD54E65AB4D213141A83400',
                currentSelection: {
                    elements: [
                        {
                            id: 'hDYNAMIC_Age_Groups',
                        },
                    ],
                    selectionStatus: 'included',
                    allSelected: false,
                },
            },
            {
                key: 'W0207010B4F0D4CCF8673629835EDD6A9',
                currentSelection: {
                    elements: [
                        {
                            id: 'hDYNAMIC_Season',
                        },
                    ],
                    selectionStatus: 'included',
                    allSelected: false,
                },
            },
        ];
        let urlAPIlink = encodeURIComponent(JSON.stringify(urlAPIJSON));
        urlAPIlink = urlAPIlink
            .replaceAll('DYNAMIC_Age_Groups', '{[Age Groups]@ID};08575DA44A96ACD60F896E996FA25D6D')
            .replaceAll('DYNAMIC_Season', '{[Season]@ID};F03B53BE43157735832E8EB067068816');
        let dynamicUrl = `${url}/${dossier.project.id}/${dossier.id}/${pageKey}?filters=${urlAPIlink}`;
        await since('URL Generated should be #{expected}, instead we have #{actual}')
            .expect(urlGenerated)
            .toContain(dynamicUrl);
    });

    it('[TC96806_05] Verify URL Generation in Library Web - Xfunc - Global Filter', async () => {
        const pageKey = 'KDD6F14C24BB2EE8B8C78D480C0342CBA--K58C577074ADBCC924424C6B3D7435530';
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        // Auto Apply
        const ElementFilter = rsdPage.findSelectorByName('Element_Category');
        await ElementFilter.checkbox.selectItemByText('Movies');
        const attributeFilter = rsdPage.findSelectorByName('Subcategory');
        await attributeFilter.checkbox.selectItemByText('Literature');
        await authoringFilters.parameterFilter.inputValueParameter('Value_Number_UserInput', '2000');
        await authoringFilters.metricFilter.changeMetricSliderSelection({
            filterName: 'Cost',
            upperpos: -20,
        });

        // Generate URL
        await toolbar.clickURLGeneratorButton();
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems(['Element_Category', 'Subcategory', 'Value_Number_UserInput', 'Cost']);
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await since('Apply url, filter summary for Element_Category should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Element_Category'))
            .toBe('(Books, Movies)');
        await since('Apply url, filter summary for Subcategory should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Subcategory'))
            .toBe('(Art & Architecture, Business, +3)');
        await since(
            'Apply url, filter summary for Value_Number_UserInput should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Value_Number_UserInput'))
            .toBe('(2000)');
        await since('Apply url, filter summary for Cost should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Cost'))
            .toBe('[≤580K]');

        // switch page
        await toc.openPageFromTocMenu({ chapterName: 'Disable interaction', pageName: 'Page 1' });
        await since('Apply url, filter summary for Element_Category should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Element_Category'))
            .toBe('(Books:1, Movies:3)');
        await since(
            'Apply url, filter summary for Value_Number_UserInput should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('Value_Number_UserInput'))
            .toBe('(2000)');
        await since('Apply url, filter summary for Cost should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Cost'))
            .toBe('[≤580K]');
        await toc.openPageFromTocMenu({ chapterName: 'Selection Required', pageName: 'Page 1' });
        await since('Apply url, filter summary for Subcategory should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Subcategory'))
            .toBe('(Art & Architecture, Business, +3)');
    });

    it('[TC96806_06] Verify URL Generation in Library Web - Xfunc - Auto Apply', async () => {
        const pageKey = 'KE0A0DAB246B3730A6F0FC2B4F2EE9B0C--K6812E72141DB231CAE0CC49329FAC35F';
        await libraryPage.editDossierWithPageKeyByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
            pageKey: pageKey,
        });
        await authoringFilters.switchToFilterPanel();
        const YearFilter = rsdPage.findSelectorByName('Year');
        await YearFilter.checkbox.selectItemByText('2016', false);
        // await authoringFilters.selectFilterPanelFilterCheckboxOption('Year', '2016');
        const calendarSelector = rsdPage.findSelectorByName('Day');
        await calendarSelector.calendar.openDateTimePicker();
        await calendarFilter.dynamicPanel.setFromInputValue('1/2/2014');
        await calendarFilter.dynamicPanel.setToInputValue('1/6/2014');
        await calendarFilter.dynamicPanel.clickApplyButton();
        await authoringFilters.metricFilter.changeMetricSliderSelection({
            filterName: 'Margin',
            upperpos: -20,
        });
        await authoringFilters.metricFilter.changeMQSelection({
            filterName: 'Profit',
            optionName: 'Less than',
            value1: '1000000',
        });
        const Element_CategoryFilter = rsdPage.findSelectorByName('Element_Category');
        await Element_CategoryFilter.checkbox.selectItemByText('Electronics');
        const calendarParameterSelector = rsdPage.findSelectorByName('Element_Day');
        await calendarParameterSelector.calendar.inputDate('from', '01/01/2015');
        await calendarParameterSelector.calendar.inputDate('to', '01/06/2015');
        await authoringFilters.metricFilter.changeMetricSliderByInputBox({
            filterName: 'Value_Big Decimal_Range',
            handle: 'upper',
            value: '300',
        });
        const dropdownFilter = rsdPage.findSelectorByName('Value_Text_Fixed_List');
        await dropdownFilter.dropdown.clickDropdown();
        await dropdownFilter.dropdown.selectItemByText('Literature', false);
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
        // Generate URL
        await toolbar.clickURLGeneratorButton();
        await authoringFilters.selectFilterItems([
            'Year',
            'Day',
            'Margin',
            'Profit',
            'Element_Category',
            'Element_Day',
            'Value_Number_UserInput',
            'Value_Big Decimal_Range',
            'Value_Text_Fixed_List',
            'Value_Date and Time_UserInput',
        ]);
        await toolbar.clickGenerateLinkButton();
        let urlGenerated = await dossierPage.getClipboardText();
        console.log('urlGenerated:' + urlGenerated);

        // Apply URL
        await browser.url(urlGenerated);
        await dossierPage.waitForDossierLoading();
        await filterSummaryBar.viewAllFilterItems();
        await since('Apply url, filter summary for Year should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Year'))
            .toBe('2016');
        await since('Apply url, filter summary for Day should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Day'))
            .toBe('1/2/2014 - 1/6/2014');
        await since('Apply url, filter summary for Margin should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Margin'))
            .toBe('$0.00 - $0.93');
        await since('Apply url, filter summary for Profit should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Profit'))
            .toBe('Less than 1000000');
        await since('Apply url, filter summary for Element_Category should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Element_Category'))
            .toBe('Books,Electronics');
        await since('Apply url, filter summary for Element_Day should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Element_Day'))
            .toBe('1/1/2015 - 1/6/2015');
        await since('Apply url, for Value_Number_UserInput should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Value_Number_UserInput'))
            .toBe('1000');
        await since('Apply url, Value_Big Decimal_Range should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Value_Big Decimal_Range'))
            .toBe('300');
        await since('Apply url, for Value_Text_Fixed_List should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Value_Text_Fixed_List'))
            .toBe('Literature');
        await since('Apply url, Value_Date and Time_UserInput should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Value_Date and Time_UserInput'))
            .toBe('11/15/2016 8:03:05 AM');
    });
});

export const config = specConfiguration;
