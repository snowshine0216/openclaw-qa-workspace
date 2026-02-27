import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_authoring') };

describe('Selector Panel Consumption - X func', () => {
    const consumptionDossier = {
        id: '1939AAA8409F43789C13A4A581EE38BF',
        name: '(Auto) Selector Panel Consumption',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const parameterFilterDossier = {
        id: '580EEA2745731958CE7074A76AEBDC43',
        name: '(Auto) Selector Panel - Parameter Filter',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    let {
        libraryAuthoringPage,
        libraryPage,
        dossierPage,
        authoringFilters,
        loginPage,
        inCanvasSelector_Authoring,
        viPanelStack,
        toc,
        parameterFilter,
        grid,
        filterPanel,
        checkboxFilter,
        searchBoxFilter,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize({
            width: 1200,
            height: 900,
        });
        await loginPage.login(specConfiguration.credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99653_01] Validate functionality of Selector Panel in Consumption - AM Selector', async () => {
        await libraryPage.openDossierById({
            projectId: consumptionDossier.project.id,
            dossierId: consumptionDossier.id,
        });
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'AM Selector' });

        // Apply
        const metricSelector = InCanvasSelector.createByTitle('Metric Selector');
        await metricSelector.selectItem('Profit');
        const attributeSelector = InCanvasSelector.createByTitle('Attribute Selector');
        await attributeSelector.selectItem('Category');
        await since('Grid Value should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Year', 'Cost']);
        await viPanelStack.clickButtonByName('kW0E1A9B3D841E426F8B5DDE80E0A9D7CF', 'Apply');
        await since('Grid Value should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Category', 'Cost', 'Profit']);

        // Cancel
        await metricSelector.selectItem('Revenue');
        await attributeSelector.selectItem('Subcategory');
        await viPanelStack.clickButtonByName('kW0E1A9B3D841E426F8B5DDE80E0A9D7CF', 'Cancel');
        await since('Grid Value should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Category', 'Cost', 'Profit']);

        // Unset
        await metricSelector.openContextMenu();
        await metricSelector.selectOptionInMenu('Unset Selector');
        await attributeSelector.openContextMenu();
        await attributeSelector.selectOptionInMenu('Unset Selector');
        await viPanelStack.clickButtonByName('kW0E1A9B3D841E426F8B5DDE80E0A9D7CF', 'Apply');
        await since('Grid Value should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Year', 'Cost']);
    });

    it('[TC99653_02] Validate functionality of Selector Panel in Consumption - Object Parameter', async () => {
        await libraryPage.openDossierById({
            projectId: consumptionDossier.project.id,
            dossierId: consumptionDossier.id,
        });
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Object Parameter' });

        // Apply
        const attrDatasetSelector = InCanvasSelector.createByTitle('Attr_Dataset');
        await attrDatasetSelector.selectItem('Category HTML');
        const metrDashboardSelector = InCanvasSelector.createByTitle('Metr_Dashboard');
        await metrDashboardSelector.selectItem('Cost');
        await since('Grid Value should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Category', 'Profit']);
        await viPanelStack.clickButtonByName('kW5A946293C3634242BD10910890EDE962', 'Apply');
        await dossierPage.waitForDossierLoading();
        await since('Grid Value should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Category HTML', 'Category', 'Cost', 'Profit']);

        // Cancel
        const metrDatasetSelector = InCanvasSelector.createByTitle('Metr_Dataset');
        await metrDatasetSelector.selectItem('Unit Price');
        const attrDashboardSelector = InCanvasSelector.createByTitle('Attr_Dashboard');
        await attrDashboardSelector.selectItem('Subcategory');
        await viPanelStack.clickButtonByName('kW5A946293C3634242BD10910890EDE962', 'Cancel');
        await since('Grid Value should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Category HTML', 'Category', 'Cost', 'Profit']);
        await attrDashboardSelector.selectItem('Year');
        await viPanelStack.clickButtonByName('kW5A946293C3634242BD10910890EDE962', 'Apply');
        await dossierPage.waitForDossierLoading();
        await since('Grid Value should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Category HTML', 'Category', 'Year', 'Cost', 'Profit']);

        // Unset
        await attrDatasetSelector.openContextMenu();
        await attrDatasetSelector.selectOptionInMenu('Reset to Default');
        await attrDashboardSelector.openContextMenu();
        await attrDashboardSelector.selectOptionInMenu('Reset to First 1');
        await viPanelStack.clickButtonByName('kW5A946293C3634242BD10910890EDE962', 'Apply');
        await since('Grid Value should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Category', 'Cost', 'Profit']);
    });

    it('[TC99653_03] Validate functionality of Selector Panel in Consumption - Parameter Filter - Number', async () => {
        await libraryPage.openDossierById({
            projectId: parameterFilterDossier.project.id,
            dossierId: parameterFilterDossier.id,
        });
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Number' });

        // user input
        const numberUserInputNoDefaultInCanvasElement = await InCanvasSelector.createByTitle(
            'number_user_input_no_default_parameter'
        );
        await numberUserInputNoDefaultInCanvasElement.inputText('4');
        await viPanelStack.clickButtonByName('kW0322354FFD5E45C99A159DDEF69E7A12', 'Apply');
        await since('NumberUserInputNoDefault value should be #{expected}, instead we have #{actual}')
            .expect(await numberUserInputNoDefaultInCanvasElement.textBoxInputText())
            .toBe('4');

        // dropdown
        const numberFixedListWithDefaultDropdownInCanvasElement = await InCanvasSelector.createByTitle(
            'number_fixed_list_with_default_dropdown_parameter'
        );
        await numberFixedListWithDefaultDropdownInCanvasElement.openDropdownMenu();
        await numberFixedListWithDefaultDropdownInCanvasElement.selectDropdownItems(['2']);
        await viPanelStack.clickButtonByName('kW02713F9E99A5473B8BD6643586E8DB20', 'Apply');
        await since('NumberFixedListWithDefaultDropdown value should be #{expected}, instead we have #{actual}')
            .expect(await numberFixedListWithDefaultDropdownInCanvasElement.getSelectedDrodownItem())
            .toBe('2');
        await numberFixedListWithDefaultDropdownInCanvasElement.openContextMenu();
        await numberFixedListWithDefaultDropdownInCanvasElement.selectOptionInMenu('Reset to Default');
        await since('NumberFixedListWithDefaultDropdown value should be #{expected}, instead we have #{actual}')
            .expect(await numberFixedListWithDefaultDropdownInCanvasElement.getSelectedDrodownItem())
            .toBe('3');
        await viPanelStack.clickButtonByName('kW02713F9E99A5473B8BD6643586E8DB20', 'Cancel');
        await since('NumberFixedListWithDefaultDropdown value should be #{expected}, instead we have #{actual}')
            .expect(await numberFixedListWithDefaultDropdownInCanvasElement.getSelectedDrodownItem())
            .toBe('2');

        // slider
        const numberRangeWithDefaultParameter = await InCanvasSelector.createByTitle(
            'number_range_with_default_parameter'
        );
        await numberRangeWithDefaultParameter.openContextMenu();
        await numberRangeWithDefaultParameter.selectOptionInMenu('Reset to Default');
        const numberRangeWithDefaultParameterValue = await numberRangeWithDefaultParameter.getSliderText();
        await since('RangeWithDefault parameter value should be #{expected}, instead we have #{actual}')
            .expect(numberRangeWithDefaultParameterValue)
            .toBe('= 5');
        await viPanelStack.clickButtonByName('kW5D6AC66B9C9647C2B1ACBA4DE3F6A5C0', 'Apply');
        await since('After Apply, RangeWithDefault parameter value should be #{expected}, instead we have #{actual}')
            .expect(numberRangeWithDefaultParameterValue)
            .toBe('= 5');
    });

    it('[TC99653_04] Validate functionality of Selector Panel in Consumption - Parameter Filter - Big Decimal', async () => {
        await libraryPage.openDossierById({
            projectId: parameterFilterDossier.project.id,
            dossierId: parameterFilterDossier.id,
        });
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Big Decimal' });

        // user input
        const bigDecimalInputWithDefaultInCanvasElement = await InCanvasSelector.createByTitle(
            'BigDecimal_user_input_with_default_parameter'
        );
        await bigDecimalInputWithDefaultInCanvasElement.inputText('4');
        await viPanelStack.clickButtonByName('kWB47F7E1B3B064E21AC59497586A39345', 'Apply');
        await since('NumberUserInputNoDefault value should be #{expected}, instead we have #{actual}')
            .expect(await bigDecimalInputWithDefaultInCanvasElement.textBoxInputText())
            .toBe('4');
        await bigDecimalInputWithDefaultInCanvasElement.openContextMenu();
        await bigDecimalInputWithDefaultInCanvasElement.selectOptionInMenu('Reset to Default');
        await viPanelStack.clickButtonByName('kWB47F7E1B3B064E21AC59497586A39345', 'Apply');
        await since('NumberUserInputNoDefault value should be #{expected}, instead we have #{actual}')
            .expect(await bigDecimalInputWithDefaultInCanvasElement.textBoxInputText())
            .toBe('2');

        // radio button
        const bigDecimalFixedListNoDefaultRadioInCanvasElement = await InCanvasSelector.createByTitle(
            'BigDecimal_fixed_list_no_default_radio_buttons_parameter'
        );
        await bigDecimalFixedListNoDefaultRadioInCanvasElement.selectItem('2');
        await viPanelStack.clickButtonByName('kWAC7C3825FFD04C45AEA79C158049761A', 'Apply');
        await since('NumberUserInputNoDefault value should be #{expected}, instead we have #{actual}')
            .expect(await bigDecimalFixedListNoDefaultRadioInCanvasElement.getSelectedRadioButtonItem())
            .toBe('2');

        // slider
        const bigDecimalRangeWithoutDefaultMandatory = await InCanvasSelector.createByTitle(
            'BigDecimal_range_no_default_mandatory_parameter'
        );
        await bigDecimalRangeWithoutDefaultMandatory.dragSlider({ x: 50, y: 0 });
        await viPanelStack.clickButtonByName('kW3ED9A03930C946778096C583AF981478', 'Apply');
        await since('RangeWithoutDefaultMandatory value should be #{expected}, instead we have #{actual}')
            .expect(await bigDecimalRangeWithoutDefaultMandatory.getSliderText())
            .toBe('= 6');
    });

    it('[TC99653_05] Validate functionality of Selector Panel in Consumption - Parameter Filter - Text', async () => {
        await libraryPage.openDossierById({
            projectId: parameterFilterDossier.project.id,
            dossierId: parameterFilterDossier.id,
        });
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Text' });

        // user input
        const textInputWithDefaultInCanvasElement = await InCanvasSelector.createByTitle(
            'text_user_input_with_default_parameter'
        );
        await textInputWithDefaultInCanvasElement.inputText('East');
        await viPanelStack.clickButtonByName('kW65428A9A290845BEAA879474383BFD2C', 'Apply');
        await since('TextInputWithDefault value should be #{expected}, instead we have #{actual}')
            .expect(await textInputWithDefaultInCanvasElement.textBoxInputText())
            .toBe('East');

        // dropdown and radio button
        const textFixedListWithDefaultSliderParameter = await InCanvasSelector.createByTitle(
            'text_fixed_list_with_default_slider_parameter'
        );
        await textFixedListWithDefaultSliderParameter.dragSlider({ x: 50, y: 0 });

        const textFixedListNoDefaultSliderParameter = await InCanvasSelector.createByTitle(
            'text_fixed_list_no_default_slider_parameter'
        );
        await textFixedListNoDefaultSliderParameter.selectItem('four');
        await viPanelStack.clickButtonByName('kW0ECDD5588B8342DB956D5B910ADA7AB2', 'Apply');
        await since('TextFixedListNoDefaultSliderParameter value should be #{expected}, instead we have #{actual}')
            .expect(await textFixedListNoDefaultSliderParameter.getSelectedRadioButtonItemText())
            .toBe('four');
        await since('TextFixedListWithDefaultSlider value should be #{expected}, instead we have #{actual}')
            .expect(await textFixedListWithDefaultSliderParameter.getSliderText())
            .toBe('three');
    });

    it('[TC99653_06] Validate functionality of Selector Panel in Consumption - Parameter Filter - DateTime', async () => {
        await libraryPage.openDossierById({
            projectId: parameterFilterDossier.project.id,
            dossierId: parameterFilterDossier.id,
        });
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'DateTime' });

        // calendar
        await inCanvasSelector_Authoring.openParameterCalendar('datetime_user_input_no_default_parameter');
        await authoringFilters.parameterFilter.chooseDateInParameterWithOkButton(
            'datetime_user_input_no_default_parameter',
            '2025',
            'Sep',
            '15'
        );
        await inCanvasSelector_Authoring.openParameterCalendar('datetime_user_input_no_default_mandatory_parameter');
        await authoringFilters.parameterFilter.chooseDateInParameterWithOkButton(
            'datetime_user_input_no_default_mandatory_parameter',
            '2025',
            'Sep',
            '15'
        );
        await viPanelStack.clickButtonByName('kW31BC6E7CF73947FE90E66FB2C06D3E3A', 'Apply');

        const datetimeUserInputWithoutDefaultParameter = await InCanvasSelector.createByTitle(
            'datetime_user_input_no_default_parameter'
        );
        await since('DateTimeUserInputNoDefault value should be #{expected}, instead we have #{actual}')
            .expect(await datetimeUserInputWithoutDefaultParameter.dateAndTimeText())
            .toBe('9/15/2025 12:00:00 AM');

        const datetimeUserInputWithoutDefaultMandatoryParameter = await InCanvasSelector.createByTitle(
            'datetime_user_input_no_default_mandatory_parameter'
        );
        await since('DateTimeUserInputNoDefaultMandatory value should be #{expected}, instead we have #{actual}')
            .expect(await datetimeUserInputWithoutDefaultMandatoryParameter.dateAndTimeText())
            .toBe('9/15/2025 3:49:40 PM');

        await datetimeUserInputWithoutDefaultParameter.openContextMenu();
        await datetimeUserInputWithoutDefaultParameter.selectOptionInMenu('Reset to Default');
        await datetimeUserInputWithoutDefaultMandatoryParameter.openContextMenu();
        await datetimeUserInputWithoutDefaultMandatoryParameter.selectOptionInMenu('Reset');
        await viPanelStack.clickButtonByName('kW31BC6E7CF73947FE90E66FB2C06D3E3A', 'Cancel');
        await since('After cancel, DateTimeUserInputNoDefault value should be #{expected}, instead we have #{actual}')
            .expect(await datetimeUserInputWithoutDefaultParameter.dateAndTimeText())
            .toBe('9/15/2025 12:00:00 AM');
        await since(
            'After cancel, DateTimeUserInputNoDefaultMandatory value should be #{expected}, instead we have #{actual}'
        )
            .expect(await datetimeUserInputWithoutDefaultMandatoryParameter.dateAndTimeText())
            .toBe('9/15/2025 3:49:40 PM');
        await datetimeUserInputWithoutDefaultParameter.openContextMenu();
        await datetimeUserInputWithoutDefaultParameter.selectOptionInMenu('Reset to Default');
        await datetimeUserInputWithoutDefaultMandatoryParameter.openContextMenu();
        await datetimeUserInputWithoutDefaultMandatoryParameter.selectOptionInMenu('Reset');
        await viPanelStack.clickButtonByName('kW31BC6E7CF73947FE90E66FB2C06D3E3A', 'Apply');
        await since('After cancel, DateTimeUserInputNoDefault value should be #{expected}, instead we have #{actual}')
            .expect(await datetimeUserInputWithoutDefaultParameter.dateAndTimeText())
            .toBe('');
        await since(
            'After cancel, DateTimeUserInputNoDefaultMandatory value should be #{expected}, instead we have #{actual}'
        )
            .expect(await datetimeUserInputWithoutDefaultMandatoryParameter.dateAndTimeText())
            .toBe('9/4/2024 3:49:40 PM');
    });

    it('[TC99653_07] Validate functionality of Selector Panel in Consumption - Parameter Filter - Element List', async () => {
        await libraryPage.openDossierById({
            projectId: parameterFilterDossier.project.id,
            dossierId: parameterFilterDossier.id,
        });
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Element List' });
        await dossierPage.clickTextfieldByTitle('Selector Window');
        const sliderParameter = InCanvasSelector.createByTitle('element_list_slider_parameter');
        await sliderParameter.dragSlider({ x: 50, y: 0 });
        const checkboxParameter = InCanvasSelector.createByTitle('element_list_checkbox_parameter');
        await checkboxParameter.selectItem('Books');
        const searchboxParameter = InCanvasSelector.createByTitle('element_list_searchbox_parameter');
        await searchboxParameter.searchSearchbox('*');
        await searchboxParameter.selectSearchBoxItem('1');
        await viPanelStack.clickButtonByName('kW1B978AF86F2E4ACFB4EC39BD28CB9920', 'Apply');
        await dossierPage.clickTextfieldByTitle('Selector Window');
        await since('After Apply, SliderParameter value should be #{expected}, instead we have #{actual}')
            .expect(await sliderParameter.getSliderText())
            .toBe('Art & Architecture - Drama');
        await since('After Apply, CheckboxParameter value should be #{expected}, instead we have #{actual}')
            .expect(await checkboxParameter.getSelectedItemsText())
            .toEqual(['Electronics', 'Movies', 'Music']);
        await since('After Apply, SearchboxParameter value should be #{expected}, instead we have #{actual}')
            .expect(await searchboxParameter.getSelectedItemsText(true))
            .toEqual(['1']);
    });

    it('[TC99653_08] Validate functionality of Selector Panel in Consumption - Parameter Filter - Element List Settings', async () => {
        await libraryPage.openDossierById({
            projectId: parameterFilterDossier.project.id,
            dossierId: parameterFilterDossier.id,
        });
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Element List' });
        const checkboxParameter = InCanvasSelector.createByTitle('element_list_checkbox_parameter');
        await checkboxParameter.selectItem('Books');
        await viPanelStack.clickButtonByName('kW4F906B03C4FB4321979C8AC4C744EA80', 'Apply');
        await since('CheckboxParameter value should be #{expected}, instead we have #{actual}')
            .expect(await checkboxParameter.getSelectedItemsText())
            .toEqual(['Electronics', 'Movies', 'Music']);
        const dynamicParameter = InCanvasSelector.createByTitle('element_list_dynamic_parameter');
        await since('DynamicParameter value should be #{expected}, instead we have #{actual}')
            .expect(await dynamicParameter.getSliderText())
            .toEqual('All');

        await checkboxParameter.openContextMenu();
        await checkboxParameter.selectOptionInMenu('Reset to Default');
        await dynamicParameter.openContextMenu();
        await dynamicParameter.selectOptionInMenu('Reset to First 2');
        await viPanelStack.clickButtonByName('kW4F906B03C4FB4321979C8AC4C744EA80', 'Apply');
        await since('CheckboxParameter value should be #{expected}, instead we have #{actual}')
            .expect(await checkboxParameter.getSelectedItemsText())
            .toEqual(['(All)', 'Books', 'Electronics', 'Movies', 'Music']);
        await since('DynamicParameter value should be #{expected}, instead we have #{actual}')
            .expect(await dynamicParameter.getSliderText())
            .toBe('2014 - 2015');
    });

    it('[TC99653_09] Validate functionality of Selector Panel in Consumption - Undo/Redo', async () => {
        await libraryPage.openDossierById({
            projectId: consumptionDossier.project.id,
            dossierId: consumptionDossier.id,
        });
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Object Parameter' });
        // Undo Cancel
        const metrDashboardSelector = InCanvasSelector.createByTitle('Metr_Dashboard');
        await metrDashboardSelector.selectItem('Revenue');
        await viPanelStack.clickButtonByName('kW5A946293C3634242BD10910890EDE962', 'Cancel');
        await dossierPage.clickUndo();
        await dossierPage.waitForDossierLoading();
        await since('The current page should be Sanity in Chapter is #{expected}, instead we have #{actual}')
            .expect(await dossierPage.getTxtTitle_Chapter())
            .toBe('Chapter 1');
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'Object Parameter' });

        // Undo Apply
        await metrDashboardSelector.selectItem('Revenue');
        await viPanelStack.clickButtonByName('kW5A946293C3634242BD10910890EDE962', 'Apply');
        await dossierPage.waitForDossierLoading();
        await since('Grid Value should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Category', 'Profit', 'Revenue']);
        await dossierPage.clickUndo();
        await dossierPage.waitForDossierLoading();
        await since('After undo, Grid Value should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Category', 'Profit']);
        await dossierPage.clickRedo();
        await dossierPage.waitForDossierLoading();
        await since('After redo, Grid Value should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Category', 'Profit', 'Revenue']);

        const attrDatasetSelector = InCanvasSelector.createByTitle('Attr_Dataset');
        await attrDatasetSelector.selectItem('Category HTML');
        await metrDashboardSelector.openContextMenu();
        await metrDashboardSelector.selectOptionInMenu('Reset to Default');
        await viPanelStack.clickButtonByName('kW5A946293C3634242BD10910890EDE962', 'Apply');
        await dossierPage.waitForDossierLoading();
        await since('Grid Value should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Category HTML', 'Category']);
        await dossierPage.clickUndo();
        await dossierPage.waitForDossierLoading();
        await since('Grid Value should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Category', 'Profit', 'Revenue']);
    });

    it('[TC99653_10] Validate functionality of Selector Panel in Consumption - Filter', async () => {
        await libraryPage.openDossierById({
            projectId: consumptionDossier.project.id,
            dossierId: consumptionDossier.id,
        });
        await dossierPage.waitForDossierLoading();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Select Target' });
        await filterPanel.openFilterPanel();
        await filterPanel.clickAddFilterButton();
        await filterPanel.selectFilterItems(['Category']);
        await filterPanel.clickAddFilterMenuButton('Add');
        await checkboxFilter.openSecondaryPanel('Category');
        let isSearchBox = await searchBoxFilter.fSearch.getEmptySearchImage().isDisplayed();
        console.log('isSearchBox', isSearchBox);
        if (isSearchBox) {
            await searchBoxFilter.search('Electronics');
            await searchBoxFilter.selectElementByName('Electronics');
        } else {
            await checkboxFilter.selectElementByName('Electronics');
        }
        await filterPanel.apply();
        const categorySelector = InCanvasSelector.createByAriaLable('Category');
        await since('Category selector should be #{expected}, instead we have #{actual}')
            .expect(await categorySelector.getSelectedItemsText())
            .toEqual(['(All)', 'Electronics']);
        await since('Button disabled should be #{expected}, instead we have #{actual}')
            .expect(await viPanelStack.isButtonDisabled('kW01A65C1651F147EA9E01AFEEF0ACD446', 'Apply'))
            .toBe(true);
    });
});
