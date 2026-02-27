import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_filter') };
describe('Parameter Filter', () => {
    let {
        dossierPage,
        libraryPage,
        loginPage,
        filterPanel,
        filterSummaryBar,
        filterSummary,
        calendarFilter,
        attributeSlider,
        searchBoxFilter,
        checkboxFilter,
        radiobuttonFilter,
        grid,
        toc,
        parameterFilter,
    } = browsers.pageObj1;

    let browserInstance = browsers.browser1;

    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const dossier = {
        id: '73E77EDF426A3D241A1AF192DB524C97',
        name: '(Auto) Parameter Filter',
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

    it('[TC93082] Parameter in the Consumption Filter panel - Number', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Number' });

        // Number user input no default parameter
        await filterPanel.openFilterPanel();
        await parameterFilter.inputValue('number_user_input_no_default_parameter', '4');
        await filterPanel.scrollFilterPanelContentToBottom();
        await attributeSlider.dragAndDropHandle('number_range_no_default_mandatory_parameter', 50);
        await filterPanel.apply();
        const numberUserInputNoDefaultInCanvasElement = await InCanvasSelector.createByTitle(
            browserInstance,
            'number_user_input_no_default_parameter'
        );
        await since(
            'Number user input no default parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await numberUserInputNoDefaultInCanvasElement.textBoxInputText())
            .toBe('4');
        await since(
            'Number user input no default parameter was changed and its summary bar element should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('number_user_input_no_default_parameter'))
            .toBe('(4)');
        await filterSummary.viewAllFilterItems();
        await since(
            'Number user input no default parameter was changed and its summary panel element should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('number_user_input_no_default_parameter'))
            .toBe('4');

        // Number user input with default parameter
        await filterPanel.openFilterPanel();
        await parameterFilter.inputValue('number_user_input_with_default_parameter', '7');
        await filterPanel.apply();
        const numberInputWithDefaultInCanvasElement = await InCanvasSelector.createByTitle(
            'number_user_input_with_default_parameter'
        );
        await since(
            'Number input with default parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await numberInputWithDefaultInCanvasElement.textBoxInputText())
            .toBe('7');

        // Number user input no default mandatory parameter
        await filterPanel.openFilterPanel();
        await parameterFilter.clearInput('number_user_input_no_default_mandatory_parameter');
        const numberInputNoDefaultMandatoryInCanvasElement = await parameterFilter.inputPlaceholder(
            'number_user_input_no_default_mandatory_parameter'
        );
        await since(
            'Number input no default mandatory parameter was cleared and it should be #{expected}, instead we have #{actual}'
        )
            .expect(numberInputNoDefaultMandatoryInCanvasElement)
            .toBe('Please enter a value');
        await since(
            'Number input no default mandatory parameter was cleared and apply button should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isApplyEnabled())
            .toBe(false);
        await parameterFilter.inputValue('number_user_input_no_default_mandatory_parameter', '9');
        await filterPanel.apply();
        const numberUserInputNoDefaultMandatoryInCanvasElement = await InCanvasSelector.createByTitle(
            'number_user_input_no_default_mandatory_parameter'
        );
        await since(
            'Number input no default mandatory parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await numberUserInputNoDefaultMandatoryInCanvasElement.textBoxInputText())
            .toBe('9');

        // Number fixed list no default dropdown parameter
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('number_fixed_list_no_default_dropdown_parameter');
        await radiobuttonFilter.selectElementByName('2');
        await filterPanel.apply();
        const numberFixedListNoDefaultDropdownInCanvasElement = await InCanvasSelector.createByTitle(
            'number_fixed_list_no_default_dropdown_parameter'
        );
        await since(
            'Number fixed list no default dropdown parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await numberFixedListNoDefaultDropdownInCanvasElement.getSelectedDrodownItem())
            .toBe('2');

        // Number fixed list with default dropdown parameter
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('number_fixed_list_with_default_dropdown_parameter');
        await radiobuttonFilter.selectElementByName('0');
        await filterPanel.apply();
        const numberFixedListWithDefaultDropdownInCanvasElement = await InCanvasSelector.createByTitle(
            'number_fixed_list_with_default_dropdown_parameter'
        );
        await since(
            'Number fixed list with default dropdown parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await numberFixedListWithDefaultDropdownInCanvasElement.getSelectedDrodownItem())
            .toBe('0');

        // Number fixed list no default radio buttons parameter
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('number_fixed_list_no_default_radio_buttons_parameter');
        await radiobuttonFilter.selectElementByName('3');
        await filterPanel.apply();
        const numberFixedListNoDefaultRadioInCanvasElement = await InCanvasSelector.createByTitle(
            'number_fixed_list_no_default_radio_buttons_parameter'
        );
        await since(
            'Number fixed list no default radio buttons parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await numberFixedListNoDefaultRadioInCanvasElement.getSelectedDrodownItem())
            .toBe('3');

        // Number fixed list with default radio buttons parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await attributeSlider.dragAndDropHandle('number_fixed_list_no_default_slider_parameter', 50);
        await filterPanel.apply();
        const numberFixedListWithoutDefaultSliderParameter = await InCanvasSelector.createByTitle(
            'number_fixed_list_no_default_slider_parameter'
        );
        const numberFixedListWithoutDefaultSliderParameterValue =
            await numberFixedListWithoutDefaultSliderParameter.getSelectedDrodownItem();
        await since(
            'Number fixed list no default slider parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(numberFixedListWithoutDefaultSliderParameterValue)
            .toBe('3');

        // Number range no default mandatory parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await attributeSlider.dragAndDropHandle('number_range_no_default_mandatory_parameter', 50);
        await filterPanel.apply();
        const numberRangeWithoutDefaultMandatoryParameter = await InCanvasSelector.createByTitle(
            'number_range_no_default_mandatory_parameter'
        );
        const numberRangeWithoutDefaultMandatoryParameterValue =
            await numberRangeWithoutDefaultMandatoryParameter.getSliderText();
        await since(
            'Number range without default mandatory parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(numberRangeWithoutDefaultMandatoryParameterValue)
            .toBe('= 10');

        // Number range no default parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await attributeSlider.dragAndDropHandle('number_range_no_default_parameter', 100);
        await filterPanel.apply();
        const numberRangeWithoutDefaultParameter = await InCanvasSelector.createByTitle(
            'number_range_no_default_parameter'
        );
        const numberRangeWithoutDefaultParameterValue = await numberRangeWithoutDefaultParameter.getSliderText();
        await since(
            'Number range no default parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(numberRangeWithoutDefaultParameterValue)
            .toBe('= 6');

        // Number range with default parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await attributeSlider.dragAndDropHandle('number_range_with_default_parameter', 50);
        await filterPanel.apply();
        const numberRangeWithDefaultParameter = await InCanvasSelector.createByTitle(
            'number_range_with_default_parameter'
        );
        const numberRangeWithDefaultParameterValue = await numberRangeWithDefaultParameter.getSliderText();
        await since(
            'Number range with default parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(numberRangeWithDefaultParameterValue)
            .toBe('= 9');
    });

    it('[TC93087] Parameter in the Consumption Filter panel - Decimal', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 2', pageName: 'BigDecimal1' });

        // BigDecimal user input no default parameter
        await filterPanel.openFilterPanel();
        await parameterFilter.inputValue('BigDecimal_user_input_no_default_parameter', '4');
        await filterPanel.apply();
        const bigDecimalInputNoDefaultInCanvasElement = await InCanvasSelector.createByTitle(
            'BigDecimal_user_input_no_default_parameter'
        );
        await since(
            'Big decimal input no default parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await bigDecimalInputNoDefaultInCanvasElement.textBoxInputText())
            .toBe('4');
        await since(
            'Big decimal input no default parameter was changed was changed and its summary bar element should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('BigDecimal_user_input_no_default_parameter'))
            .toBe('(4)');
        await filterSummary.viewAllFilterItems();
        await since(
            'Big decimal input no default parameter was changed was changed and its summary panel element should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('BigDecimal_user_input_no_default_parameter'))
            .toBe('4');

        // BigDecimal user input with default parameter
        await filterPanel.openFilterPanel();
        await parameterFilter.inputValue('BigDecimal_user_input_with_default_parameter', '50');
        await filterPanel.apply();
        const bigDecimalInputWithDefaultInCanvasElement = await InCanvasSelector.createByTitle(
            'BigDecimal_user_input_with_default_parameter'
        );
        await since(
            'Big decimal input with default parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await bigDecimalInputWithDefaultInCanvasElement.textBoxInputText())
            .toBe('50');

        // BigDecimal fixed list no default dropdown parameter
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('BigDecimal_fixed_list_no_default_dropdown_parameter');
        await radiobuttonFilter.selectElementByName('2');
        await filterPanel.apply();
        const bigDecimalFixedListNoDefaultDropdownInCanvasElement = await InCanvasSelector.createByTitle(
            'BigDecimal_fixed_list_no_default_dropdown_parameter'
        );
        await since(
            'Big decimal fixed list no default dropdown parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await bigDecimalFixedListNoDefaultDropdownInCanvasElement.getSelectedDrodownItem())
            .toBe('2');

        // BigDecimal fixed list with default radio button parameter
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('BigDecimal_fixed_list_no_default_radio_buttons_parameter');
        await radiobuttonFilter.selectElementByName('0');
        await filterPanel.apply();
        const bigDecimalFixedListNoDefaultRadioInCanvasElement = await InCanvasSelector.createByTitle(
            'BigDecimal_fixed_list_no_default_radio_buttons_parameter'
        );
        await since(
            'Big decimal fixed list no default radio buttons parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await bigDecimalFixedListNoDefaultRadioInCanvasElement.getSelectedRadioButtonItem())
            .toBe('0');

        // BigDecimal fixed list no default slider parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await attributeSlider.dragAndDropHandle('BigDecimal_fixed_list_no_default_slider_parameter', 150);
        await filterPanel.apply();
        const bigDecimalFixedListWithoutDefaultSliderParameter = await InCanvasSelector.createByTitle(
            'BigDecimal_fixed_list_no_default_slider_parameter'
        );
        const bigDecimalFixedListWithoutDefaultSliderParameterValue =
            await bigDecimalFixedListWithoutDefaultSliderParameter.getSliderText();
        await since(
            'Big decimal fixed list no default slider parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(bigDecimalFixedListWithoutDefaultSliderParameterValue)
            .toBe('7123');

        // BigDecimal range no default mandatory parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await attributeSlider.dragAndDropHandle('BigDecimal_range_no_default_mandatory_parameter', 50);
        await filterPanel.apply();
        const bigDecimalRangeWithoutDefaultMandatory = await InCanvasSelector.createByTitle(
            'BigDecimal_range_no_default_mandatory_parameter'
        );
        const bigDecimalRangeWithoutDefaultMandatoryValue =
            await bigDecimalRangeWithoutDefaultMandatory.getSliderText();
        await since(
            'Big decimal range no default mandatory parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(bigDecimalRangeWithoutDefaultMandatoryValue)
            .toBe('= 2');

        // BigDecimal range no default parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await attributeSlider.dragAndDropHandle('BigDecimal_range_no_default_parameter', 150);
        await filterPanel.apply();
        const bigDecimalRangeWithoutDefaultParameter = await InCanvasSelector.createByTitle(
            'BigDecimal_range_no_default_parameter'
        );
        const bigDecimalRangeWithoutDefaultParameterValue =
            await bigDecimalRangeWithoutDefaultParameter.getSliderText();
        await since(
            'Big decimal range no default parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(bigDecimalRangeWithoutDefaultParameterValue)
            .toBe('= 7');

        // BigDecimal range with default parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await attributeSlider.dragAndDropHandle('BigDecimal_range_with_default_parameter', 200);
        await filterPanel.apply();
        const bigDecimalRangeWithDefaultParameter = await InCanvasSelector.createByTitle(
            'BigDecimal_range_with_default_parameter'
        );
        const bigDecimalRangeWithDefaultParameterValue = await bigDecimalRangeWithDefaultParameter.getSliderText();
        await since(
            'Big decimal range with default parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(bigDecimalRangeWithDefaultParameterValue)
            .toBe('= 10');
    });

    it('[TC93084] Parameter in the Consumption Filter panel - Text', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 3', pageName: 'Text' });

        // Text user input no default parameter
        await filterPanel.openFilterPanel();
        await parameterFilter.inputValue('text_user_input_no_default_parameter', 'one');
        await filterPanel.apply();
        const textInputNoDefaultInCanvasElement = await InCanvasSelector.createByTitle(
            'text_user_input_no_default_parameter'
        );
        await since(
            'Text input no default parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await textInputNoDefaultInCanvasElement.textBoxInputText())
            .toBe('one');
        await since(
            'Text input no default parameter was changed and its summary bar element should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('text_user_input_with_default_parameter'))
            .toBe('(one)');
        await filterSummary.viewAllFilterItems();
        await since(
            'Text input no default parameter was changed and its summary panel element should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('text_user_input_no_default_parameter'))
            .toBe('one');

        // Text user input with default parameter
        await filterPanel.openFilterPanel();
        await parameterFilter.openContextMenu('text_user_input_no_default_parameter');
        await parameterFilter.inputValue('text_user_input_with_default_parameter', 'two');
        await filterPanel.apply();
        const textInputWithDefaultInCanvasElement = await InCanvasSelector.createByTitle(
            'text_user_input_with_default_parameter'
        );
        await since(
            'Text input with default parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await textInputWithDefaultInCanvasElement.textBoxInputText())
            .toBe('two');

        // Text fixed list no default dropdown parameter
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('text_fixed_list_no_default_dropdown_parameter');
        await radiobuttonFilter.selectElementByName('four');
        await filterPanel.apply();
        const textFixedListNoDefaultDropdownInCanvasElement = await InCanvasSelector.createByTitle(
            'text_fixed_list_no_default_dropdown_parameter'
        );
        await since(
            'Text fixed list no default dropdown parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await textFixedListNoDefaultDropdownInCanvasElement.getSelectedDrodownItem())
            .toBe('four');

        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('text_fixed_list_with_default_dropdown_parameter');
        await radiobuttonFilter.selectElementByName('three');
        await filterPanel.apply();
        const textFixedListWithDefaultDropdownInCanvasElement = await InCanvasSelector.createByTitle(
            'text_fixed_list_with_default_dropdown_parameter'
        );
        await since(
            'Text fixed list with default dropdown parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await textFixedListWithDefaultDropdownInCanvasElement.getSelectedDrodownItem())
            .toBe('three');

        // Text fixed list no default radio buttons parameter
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('text_fixed_list_with_default_radio_buttons_parameter');
        await radiobuttonFilter.selectElementByName('three');
        await filterPanel.apply();
        const textFixedListWithDefaultRadioInCanvasElement = await InCanvasSelector.createByTitle(
            'text_fixed_list_with_default_radio_buttons_parameter'
        );
        await since(
            'Text fixed list with default radio buttons parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await textFixedListWithDefaultRadioInCanvasElement.getSelectedDrodownItem())
            .toBe('three');

        // Text fixed list no default slider parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await attributeSlider.dragAndDropHandle('text_fixed_list_no_default_slider_parameter', 50);
        await filterPanel.apply();
        const textFixedListNoDefaultSliderParameter = await InCanvasSelector.createByTitle(
            'text_fixed_list_no_default_slider_parameter'
        );
        await since(
            'Text fixed list no default slider parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await textFixedListNoDefaultSliderParameter.getSelectedDrodownItem())
            .toBe('two');

        // Text fixed list with default slider parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await attributeSlider.dragAndDropHandle('text_fixed_list_with_default_slider_parameter', 50);
        await filterPanel.apply();
        const textFixedListWithDefaultSliderParameter = await InCanvasSelector.createByTitle(
            'text_fixed_list_with_default_slider_parameter'
        );
        await since(
            'Text fixed list with default slider parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await textFixedListWithDefaultSliderParameter.getSelectedDrodownItem())
            .toBe('three');

        // Text range no default mandatory parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await parameterFilter.clearInput('text_user_input_no_default_mandatory_parameter');
        const textInputNoDefaultMandatoryPlaceholder = await parameterFilter.inputPlaceholder(
            'text_user_input_no_default_mandatory_parameter'
        );
        await since(
            'Text input no default mandatory parameter was cleared and it should be #{expected}, instead we have #{actual}'
        )
            .expect(textInputNoDefaultMandatoryPlaceholder)
            .toBe('Please enter a value');
        await since(
            'Text input no default mandatory parameter was cleared and apply button should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterPanel.isApplyEnabled())
            .toBe(false);
        await parameterFilter.inputValue('text_user_input_no_default_mandatory_parameter', 'one');
        await filterPanel.apply();
        const textInputNoDefaultMandatoryInCanvasElement = await InCanvasSelector.createByTitle(
            'text_user_input_no_default_mandatory_parameter'
        );
        await since(
            'Text input no default mandatory parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await textInputNoDefaultMandatoryInCanvasElement.textBoxInputText())
            .toBe('one');

        // Text range no default parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await radiobuttonFilter.openSecondaryPanel('text_fixed_list_no_default_dropdown_mandatory_parameter');
        await radiobuttonFilter.selectElementByName('four');
        await filterPanel.apply();
        const textFixedListNoDefaultDropdownMandatoryInCanvasElement = await InCanvasSelector.createByTitle(
            'text_fixed_list_no_default_dropdown_mandatory_parameter'
        );
        await since(
            'Text fixed list no default dropdown mandatory parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(await textFixedListNoDefaultDropdownMandatoryInCanvasElement.getSelectedDrodownItem())
            .toBe('four');
    });

    it('[TC93076_01] Parameter in the Consumption Filter panel - Date', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 4', pageName: 'Date' });

        // Date user input no default parameter
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('date_user_input_no_default_parameter');
        await calendarFilter.setInputDateOfBeforeAfter({ customMonth: '9', customDay: '2', customYear: '2024' });
        await filterPanel.apply();
        const dateUserInputWithoutDefaultParameter = await InCanvasSelector.createByTitle(
            'date_user_input_no_default_parameter'
        );
        const dateUserInputWithoutDefaultParameterValue = await dateUserInputWithoutDefaultParameter.dateAndTimeText();
        await since(
            'Date user input no default parameter was changed in filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(dateUserInputWithoutDefaultParameterValue)
            .toBe('9/2/2024');
        await since(
            'Date user input no default parameter was changed and its summary bar element should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('date_user_input_no_default_parameter'))
            .toBe('(9/2/2024)');
        await filterSummary.viewAllFilterItems();
        await since(
            'Date user input no default parameter was changed and its summary panel element should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('date_user_input_no_default_parameter'))
            .toBe('9/2/2024');

        // Date user input with default parameter
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('date_user_input_with_default_parameter');
        await calendarFilter.selectDateInWidget({ monthYear: 'September 2024', day: '1' });
        await filterPanel.apply();
        const dateUserInputWithDefaultParameter = await InCanvasSelector.createByTitle(
            'date_user_input_with_default_parameter'
        );
        const dateUserInputWithDefaultParameterValue = await dateUserInputWithDefaultParameter.dateAndTimeText();
        await since(
            'Date user input with default parameter was changed in filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(dateUserInputWithDefaultParameterValue)
            .toBe('9/1/2024');

        // Date fixed list no default dropdown parameter
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('date_fixed_list_no_default_dropdown_parameter');
        await radiobuttonFilter.selectElementByName('9/4/2024');
        await filterPanel.apply();
        const dateFixedListWithoutDefaultDropdownParameter = await InCanvasSelector.createByTitle(
            'date_fixed_list_no_default_dropdown_parameter'
        );
        const dateFixedListWithoutDefaultDropdownParameterValue =
            await dateFixedListWithoutDefaultDropdownParameter.getSelectedDrodownItem();
        await since(
            'Date fixed list no default dropdown parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(dateFixedListWithoutDefaultDropdownParameterValue)
            .toBe('9/4/2024');

        // Date fixed list no default radio buttons parameter
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('date_fixed_list_no_default_radio_buttons_parameter');
        await radiobuttonFilter.selectElementByName('9/3/2024');
        await filterPanel.apply();
        const dateFixedListWithoutDefaultRadioButtonsParameter = await InCanvasSelector.createByTitle(
            'date_fixed_list_no_default_radio_buttons_parameter'
        );
        const dateFixedListWithoutDefaultRadioButtonsParameterValue =
            await dateFixedListWithoutDefaultRadioButtonsParameter.getSelectedDrodownItem();
        await since(
            'Date fixed list no default radio buttons parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(dateFixedListWithoutDefaultRadioButtonsParameterValue)
            .toBe('9/3/2024');

        // Date fixed list no default slider parameter
        await filterPanel.openFilterPanel();
        await attributeSlider.dragAndDropHandle('date_fixed_list_no_default_slider_parameter', 50);
        await filterPanel.apply();
        const dateFixedListWithoutDefaultSliderParameter = await InCanvasSelector.createByTitle(
            'date_fixed_list_no_default_slider_parameter'
        );
        const dateFixedListWithoutDefaultSliderParameterValue =
            await dateFixedListWithoutDefaultSliderParameter.getSelectedDrodownItem();
        await since(
            'Date fixed list no default slider parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(dateFixedListWithoutDefaultSliderParameterValue)
            .toBe('9/2/2024');

        // Date fixed list no default calendar parameter
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('date_fixed_list_no_default_calendar_parameter');
        await calendarFilter.setInputDateOfBeforeAfter({ customMonth: '9', customDay: '1', customYear: '2024' });
        await filterPanel.apply();
        const dateFixedListWithoutDefaultCalendarParameter = await InCanvasSelector.createByTitle(
            'date_fixed_list_no_default_calendar_parameter'
        );
        const dateFixedListWithoutDefaultCalendarParameterValue =
            await dateFixedListWithoutDefaultCalendarParameter.getSelectedDrodownItem();
        await since(
            'Date fixed list no default calendar parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(dateFixedListWithoutDefaultCalendarParameterValue)
            .toBe('9/1/2024');

        // Date fixed list no default calendar mandatory parameter
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('date_fixed_list_with_default_dropdown_parameter');
        await radiobuttonFilter.selectElementByName('9/3/2024');
        await filterPanel.apply();
        const dateFixedListWithDefaultDropdownParameter = await InCanvasSelector.createByTitle(
            'date_fixed_list_with_default_dropdown_parameter'
        );
        const dateFixedListWithDefaultDropdownParameterValue =
            await dateFixedListWithDefaultDropdownParameter.getSelectedDrodownItem();
        await since(
            'Date fixed list with default dropdown parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(dateFixedListWithDefaultDropdownParameterValue)
            .toBe('9/3/2024');

        // Date fixed list with default radio buttons parameter
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('date_user_input_no_default_mandatory_parameter');
        await calendarFilter.selectDateInWidget({ monthYear: 'September 2024', day: '3' });
        await filterPanel.apply();
        const dateUserInputWithoutMandatoryParameter = await InCanvasSelector.createByTitle(
            'date_user_input_no_default_mandatory_parameter'
        );
        const dateUserInputWithoutMandatoryParameterValue =
            await dateUserInputWithoutMandatoryParameter.dateAndTimeText();
        await since(
            'Date user input no default mandatory parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(dateUserInputWithoutMandatoryParameterValue)
            .toBe('9/3/2024');

        // Date range no default parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await radiobuttonFilter.openSecondaryPanel('date_fixed_list_with_default_radio_buttons_parameter');
        await radiobuttonFilter.selectElementByName('9/4/2024');
        await filterPanel.apply();
        const dateFixedListWithDefaultRadioButtonsParameter = await InCanvasSelector.createByTitle(
            'date_fixed_list_with_default_radio_buttons_parameter'
        );
        const dateFixedListWithDefaultRadioButtonsParameterValue =
            await dateFixedListWithDefaultRadioButtonsParameter.getSelectedDrodownItem();
        await since(
            'Date fixed list with default radio buttons parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(dateFixedListWithDefaultRadioButtonsParameterValue)
            .toBe('9/4/2024');

        // Date range no default slider parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await attributeSlider.dragAndDropHandle('date_fixed_list_with_default_slider_parameter', 50);
        await filterPanel.apply();
        const dateFixedListWithDefaultSliderParameter = await InCanvasSelector.createByTitle(
            'date_fixed_list_with_default_slider_parameter'
        );
        const dateFixedListWithDefaultSliderParameterValue =
            await dateFixedListWithDefaultSliderParameter.getSelectedDrodownItem();
        await since(
            'Date fixed list with default slider parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(dateFixedListWithDefaultSliderParameterValue)
            .toBe('9/3/2024');

        // Date range no default calendar parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await calendarFilter.openSecondaryPanel('date_fixed_list_with_default_calendar_parameter');
        await calendarFilter.selectDateInWidget({ monthYear: 'September 2024', day: '1' });
        await filterPanel.apply();
        const dateFixedListWithDefaultCalendarParameter = await InCanvasSelector.createByTitle(
            'date_fixed_list_with_default_calendar_parameter'
        );
        const dateFixedListWithDefaultCalendarParameterValue =
            await dateFixedListWithDefaultCalendarParameter.getSelectedDrodownItem();
        await since(
            'Date fixed list with default calendar parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(dateFixedListWithDefaultCalendarParameterValue)
            .toBe('9/1/2024');

        // Date range no default calendar mandatory parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await calendarFilter.openSecondaryPanel('date_fixed_list_with_default_calendar_mandatory_parameter');
        await calendarFilter.selectDateInWidget({ monthYear: 'September 2024', day: '3' });
        await filterPanel.apply();
        const dateFixedListWithDefaultCalendarMandatoryParameter = await InCanvasSelector.createByTitle(
            'date_fixed_list_with_default_calendar_mandatory_parameter'
        );
        const dateFixedListWithDefaultCalendarMandatoryParameterValue =
            await dateFixedListWithDefaultCalendarMandatoryParameter.getSelectedDrodownItem();
        await since(
            'Date fixed list with default calendar mandatory parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(dateFixedListWithDefaultCalendarMandatoryParameterValue)
            .toBe('9/3/2024');

        // Date range no default mandatory parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await calendarFilter.openSecondaryPanel('date_range_no_default_parameter');
        await calendarFilter.selectDateInWidget({ monthYear: 'September 2024', day: '3' });
        await filterPanel.apply();
        const dateRangeWithoutDefaultParameter = await InCanvasSelector.createByTitle(
            'date_range_no_default_parameter'
        );
        const dateRangeWithoutDefaultParameterValue = await dateRangeWithoutDefaultParameter.dateAndTimeText();
        await since(
            'Date range no default parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(dateRangeWithoutDefaultParameterValue)
            .toBe('9/3/2024');

        // Date range with default parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await calendarFilter.openSecondaryPanel('date_range_with_default_parameter');
        await calendarFilter.selectDateInWidget({ monthYear: 'September 2024', day: '3' });
        await filterPanel.apply();
        const dateRangeWithDefaultParameter = await InCanvasSelector.createByTitle('date_range_with_default_parameter');
        const dateRangeWithDefaultParameterValue = await dateRangeWithDefaultParameter.dateAndTimeText();
        await since(
            'Date ranege with default parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(dateRangeWithDefaultParameterValue)
            .toBe('9/3/2024');

        // Date range no default mandatory parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await calendarFilter.openSecondaryPanel('date_range_no_default_mandatory_parameter');
        await calendarFilter.selectDateInWidget({ monthYear: 'September 2024', day: '2' });
        await filterPanel.apply();
        const dateRangeWithoutDefaultMandatoryParameter = await InCanvasSelector.createByTitle(
            'date_range_no_default_mandatory_parameter'
        );
        const dateRangeWithoutDefaultMandatoryParameterValue =
            await dateRangeWithoutDefaultMandatoryParameter.dateAndTimeText();
        await since(
            'Date range no default mandatory parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(dateRangeWithoutDefaultMandatoryParameterValue)
            .toBe('9/2/2024');
    });

    it('[TC93076_02] Parameter in the Consumption Filter panel - Datetime', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 5', pageName: 'DateTime' });

        // user input no default parameter
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('datetime_user_input_no_default_parameter');
        await calendarFilter.setInputDateOfBeforeAfter({ customMonth: '9', customDay: '6', customYear: '2024' });
        await filterPanel.apply();
        const datetimeUserInputWithoutDefaultParameter = await InCanvasSelector.createByTitle(
            'datetime_user_input_no_default_parameter'
        );
        const datetimeUserInputWithoutDefaultParameterValue =
            await datetimeUserInputWithoutDefaultParameter.dateAndTimeText();
        await since(
            'Datetime user input no default was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(datetimeUserInputWithoutDefaultParameterValue)
            .toBe('9/6/2024 12:00:00 AM');
        await since(
            'Datetime user input no default was changed and its summary bar element should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummaryBar.filterItems('datetime_user_input_no_default_parameter'))
            .toBe('(9/6/2024 12:00:00 AM)');

        // fixed list no default radio buttons parameter
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('datetime_fixed_list_no_default_radio_buttons_parameter');
        await radiobuttonFilter.selectElementByName('9/1/2024 12:00:00 AM');
        await filterPanel.apply();
        const datetimeFixedListWithoutDefaultRadioButtons = await InCanvasSelector.createByTitle(
            'datetime_fixed_list_no_default_radio_buttons_parameter'
        );
        const datetimeFixedListWithoutDefaultRadioButtonsValue =
            await datetimeFixedListWithoutDefaultRadioButtons.getSelectedDrodownItem();
        await since(
            'Datetime fixed list no default was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(datetimeFixedListWithoutDefaultRadioButtonsValue)
            .toBe('9/1/2024 12:00:00 AM');

        // user input with default parameter
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('datetime_user_input_with_default_parameter');
        await calendarFilter.setInputDateOfBeforeAfter({ customMonth: '9', customDay: '5', customYear: '2024' });
        await filterPanel.apply();
        const datetimeUserInputWithDefaultParameter = await InCanvasSelector.createByTitle(
            'datetime_user_input_with_default_parameter'
        );
        const datetimeUserInputWithDefaultParameterValue =
            await datetimeUserInputWithDefaultParameter.dateAndTimeText();
        await since(
            'Datetime user input with default parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(datetimeUserInputWithDefaultParameterValue)
            .toBe('9/5/2024 12:00:00 AM');

        // fixed list no default slider parameter
        await filterPanel.openFilterPanel();
        await attributeSlider.dragAndDropHandle('datetime_fixed_list_no_default_slider_parameter', 50);
        await filterPanel.apply();
        const datetimeFixedListWithoutDefaultSliderParameter = await InCanvasSelector.createByTitle(
            'datetime_fixed_list_no_default_slider_parameter'
        );
        const datetimeFixedListWithoutDefaultSliderParameterValue =
            await datetimeFixedListWithoutDefaultSliderParameter.getSelectedDrodownItem();
        await since(
            'Datetime fixed list no default slider parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(datetimeFixedListWithoutDefaultSliderParameterValue)
            .toBe('9/2/2024 12:00:00 AM');

        // fixed list no default dropdown parameter
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('datetime_fixed_list_no_default_dropdown_parameter');
        await radiobuttonFilter.selectElementByName('9/3/2024 12:00:00 AM');
        await filterPanel.apply();
        const datetimeFixedListWithoutDefalutDropdownParameter = await InCanvasSelector.createByTitle(
            'datetime_fixed_list_no_default_dropdown_parameter'
        );
        const datetimeFixedListWithoutDefalutDropdownParameterValue =
            await datetimeFixedListWithoutDefalutDropdownParameter.getSelectedDrodownItem();
        await since(
            'Datetime fixed list no default dropdown parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(datetimeFixedListWithoutDefalutDropdownParameterValue)
            .toBe('9/3/2024 12:00:00 AM');

        // fixed list with default radio buttons parameter
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('datetime_fixed_list_with_default_radio_buttons_parameter');
        await radiobuttonFilter.selectElementByName('9/4/2024 12:00:00 AM');
        await filterPanel.apply();
        const datetimeFixedListWithDefaultRadioButtonsParameter = await InCanvasSelector.createByTitle(
            'datetime_fixed_list_with_default_radio_buttons_parameter'
        );
        const datetimeFixedListWithDefaultRadioButtonsParameterValue =
            await datetimeFixedListWithDefaultRadioButtonsParameter.getSelectedDrodownItem();
        await since(
            'Datetime fixed list with default radio buttons parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(datetimeFixedListWithDefaultRadioButtonsParameterValue)
            .toBe('9/4/2024 12:00:00 AM');

        // fixed list with default dropdown parameter
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('datetime_fixed_list_with_default_dropdown_parameter');
        await radiobuttonFilter.selectElementByName('9/1/2024 12:00:00 AM');
        await filterPanel.apply();
        const datetimeFixedListWithDefaultDropdownParameter = await InCanvasSelector.createByTitle(
            'datetime_fixed_list_with_default_dropdown_parameter'
        );
        const datetimeFixedListWithDefaultDropdownParameterValue =
            await datetimeFixedListWithDefaultDropdownParameter.getSelectedDrodownItem();
        await since(
            'Datetime fixed list with default dropdown parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(datetimeFixedListWithDefaultDropdownParameterValue)
            .toBe('9/1/2024 12:00:00 AM');

        // fixed list with default slider parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await attributeSlider.dragAndDropHandle('datetime_fixed_list_with_default_slider_parameter', 150);
        await filterPanel.apply();
        const datetimeFixedListWithDefaultSliderParameter = await InCanvasSelector.createByTitle(
            'datetime_fixed_list_with_default_slider_parameter'
        );
        const datetimeFixedListWithDefaultSliderParameterValue =
            await datetimeFixedListWithDefaultSliderParameter.getSelectedDrodownItem();
        await since(
            'Datetime fixed list with default slider parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(datetimeFixedListWithDefaultSliderParameterValue)
            .toBe('9/4/2024 12:00:00 AM');

        // user input no default mandatory parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await calendarFilter.openSecondaryPanel('datetime_user_input_no_default_mandatory_parameter');
        await calendarFilter.setInputDateOfBeforeAfter({ customMonth: '9', customDay: '10', customYear: '2024' });
        await filterPanel.apply();
        const datetimeUserInputWithoutDefaultMandatoryParameter = await InCanvasSelector.createByTitle(
            'datetime_user_input_no_default_mandatory_parameter'
        );
        const datetimeUserInputWithoutDefaultMandatoryParameterValue =
            await datetimeUserInputWithoutDefaultMandatoryParameter.dateAndTimeText();
        await since(
            'Datetime user input no default mandatory parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(datetimeUserInputWithoutDefaultMandatoryParameterValue)
            .toBe('9/10/2024 3:49:40 PM');

        // fixed list with default dropdown mandatory parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await radiobuttonFilter.openSecondaryPanel('datetime_fixed_list_with_default_dropdown_mandatory_parameter');
        await radiobuttonFilter.selectElementByName('9/3/2024 12:00:00 AM');
        await filterPanel.apply();
        const datetimeFixedListWithDefaultDropdownMandatoryParameter = await InCanvasSelector.createByTitle(
            'datetime_fixed_list_with_default_dropdown_mandatory_parameter'
        );
        const datetimeFixedListWithDefaultDropdownMandatoryParameterValue =
            await datetimeFixedListWithDefaultDropdownMandatoryParameter.getSelectedDrodownItem();
        await since(
            'Datetime fixed list with default dropdown mandatory parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(datetimeFixedListWithDefaultDropdownMandatoryParameterValue)
            .toBe('9/3/2024 12:00:00 AM');

        // fixed list no default slider mandatory parameter
        await filterPanel.openFilterPanel();
        await filterPanel.scrollFilterPanelContentToBottom();
        await attributeSlider.dragAndDropHandle('datetime_fixed_list_no_default_slider_mandatory_parameter', 150);
        await filterPanel.apply();
        const datetimeFixedListWIthoutDefaultSliderMandatoryParameter = await InCanvasSelector.createByTitle(
            'datetime_fixed_list_no_default_slider_mandatory_parameter'
        );
        const datetimeFixedListWIthoutDefaultSliderMandatoryParameterValue =
            await datetimeFixedListWIthoutDefaultSliderMandatoryParameter.getSelectedDrodownItem();
        await since(
            'Datetime fixed list no default slider mandatory parameter was changed on filter panel, its in canvas value should be #{expected}, instead we have #{actual}'
        )
            .expect(datetimeFixedListWIthoutDefaultSliderMandatoryParameterValue)
            .toBe('9/4/2024 12:00:00 AM');
    });

    it('[TC93086] Parameter in the Consumption Filter panel - Element List', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 6', pageName: 'Element List' });

        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('element_list_checkbox_parameter');
        await checkboxFilter.fElement.clickFooterButton('Clear All');
        await checkboxFilter.selectElementByName('Books');
        await checkboxFilter.selectElementByName('Electronics');
        await filterPanel.apply();
        await since('RowCount should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('element_list_checkbox_parameter'))
            .toEqual(3);
        await since('For Element list checkbox parameter, RowCount should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('element_list_checkbox_parameter'))
            .toBe('(Books, Electronics)');

        // searchbox
        await filterPanel.openFilterPanel();
        await searchBoxFilter.openSecondaryPanel('element_list_searchbox_parameter');
        await searchBoxFilter.search('*');
        await searchBoxFilter.selectElementByName('2');
        await filterPanel.apply();
        await since('For Element list searchbox parameter, RowCount should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('element_list_searchbox_parameter'))
            .toEqual(2);
        await since('First Element should be #{expected}, instead we have #{actual}')
            .expect(
                await grid.firstElmOfHeader({ title: 'element_list_searchbox_parameter', headerName: 'Day of Week' })
            )
            .toBe('2');
        await filterSummary.viewAllFilterItems();
        await since(
            'Element list searchbox parameter was changed and its summary panel element should be #{expected}, instead we have #{actual}'
        )
            .expect(await filterSummary.expandedFilterItems('element_list_searchbox_parameter'))
            .toBe('2');

        // slider
        await filterPanel.openFilterPanel();
        await attributeSlider.dragAndDropLowerHandle('element_list_slider_parameter', 200);
        await filterPanel.apply();
        await since('For Element list slider parameter, RowCount should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('element_list_slider_parameter'))
            .toEqual(5);

        // radio buttons
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('element_list_radio_buttons_parameter');
        await radiobuttonFilter.selectElementByName('May 2014');
        await filterPanel.apply();
        await since('For Element list radioButton parameter, RowCount should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('element_list_radio_buttons_parameter'))
            .toEqual(2);
        await since('First Element should be #{expected}, instead we have #{actual}')
            .expect(
                await grid.firstElmOfHeader({
                    title: 'element_list_radio_buttons_parameter',
                    headerName: 'Month',
                })
            )
            .toBe('May 2014');

        // dropdown
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('element_list_dropdown_parameter');
        await checkboxFilter.selectElementByName('Art As Experience');
        await filterPanel.apply();
        await since('For Element list dropdown parameter, RowCount should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('element_list_dropdown_parameter'))
            .toEqual(2);

        // dynamic filter
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('element_list_dynamic_parameter');
        await checkboxFilter.selectElementByName('2016');
        await filterPanel.apply();
        await since('For Element list dynamic parameter, RowCount should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('element_list_dynamic_parameter'))
            .toEqual(4);
        // Reset
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('element_list_dynamic_parameter');
        await checkboxFilter.fElement.clickFooterButton('Reset');
        await filterPanel.apply();
        await since('For Element list dynamic parameter, RowCount should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('element_list_dynamic_parameter'))
            .toEqual(3);

        // default value
        await filterPanel.openFilterPanel();
        await filterPanel.clearAllFilters();
        await filterPanel.apply();
        await since('Filter Summary Bar Text should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('element_list_dynamic_parameter(2014, 2015)');
    });
});

export const config = specConfiguration;
