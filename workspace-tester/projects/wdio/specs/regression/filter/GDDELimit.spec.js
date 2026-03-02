import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';

const specConfiguration = { ...customCredentials('_filter') };

describe('Functionality test for GDDE Limit', () => {
    const dossier = {
        id: 'FB1D8F9C47C57231E3FAD487598176DB',
        name: '(Auto) GDDE Limit',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierWithCalendarGDDE = {
        id: '9263FA5E46BD805647BE85825C4AA063',
        name: '(Auto) GDDE_Calendar',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        libraryPage,
        dossierPage,
        toc,
        filterPanel,
        filterSummaryBar,
        attributeSlider,
        radiobuttonFilter,
        searchBoxFilter,
        checkboxFilter,
        calendarFilter,
        mqSliderFilter,
        mqFilter,
        loginPage,
        grid,
        libraryAuthoringPage,
        contentsPanel,
        authoringFilters,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);
    });

    it('[TC86442_01] Validate Functionality of search filter GDDE fetch Liminit - searchbox - multi select', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Searchbox-multi select' });
        await filterPanel.openFilterPanel();
        await since('Selected elements of Order filter is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await searchBoxFilter.filterSelectionInfo('Order'))
            .toBe('(10000 selected)');
        await checkboxFilter.openSecondaryPanel('Status');
        await checkboxFilter.selectElementByName('New');

        await since(
            'After select New, selected elements of Order filter is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('Order'))
            .toBe('(9926 selected)');
        await filterPanel.apply();

        // Exclude
        await filterPanel.openFilterPanel();
        await searchBoxFilter.openContextMenu('Order');
        await searchBoxFilter.selectContextMenuOption('Order', 'Exclude');
        await filterPanel.apply();
        await filterPanel.openFilterPanel();
        await since(
            'After exclude, selected elements of Order filter is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('Order'))
            .toBe('(9926 excluded)');
    });

    it('[TC86442_02] Validate Functionality of search filter GDDE fetch Liminit - searchbox - single select', async () => {
        // 24240,23938
        await toc.openPageFromTocMenu({ chapterName: 'Searchbox-single select' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Order');
        await radiobuttonFilter.search('23938');
        await radiobuttonFilter.selectElementByName('23938');
        await filterPanel.apply();

        await filterPanel.openFilterPanel();
        await since('Selected elements of Order filter is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await searchBoxFilter.filterSelectionInfo('Order'))
            .toBe('(1 selected)');
        await checkboxFilter.openSecondaryPanel('Status');
        await checkboxFilter.selectElementByName('New');
        await since(
            'After select New, selected elements of Order filter is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await searchBoxFilter.filterSelectionInfo('Order'))
            .toBe('(1 selected)');
        await filterPanel.apply();
        await since('After apply new, filter summary should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('Status(New, Active)Order(23938)');

        // Clear All
        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await filterPanel.apply();
        await since('Clear All Filters, filter summary should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('No filter selections');
    });

    it('[TC86442_03] Validate Functionality of search filter GDDE fetch Liminit - other styles', async () => {
        // checkbox
        await toc.openPageFromTocMenu({ chapterName: 'Checkbox' });
        await filterPanel.openFilterPanel();
        await since('Selected elements of Order filter is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await checkboxFilter.filterSelectionInfo('Order'))
            .toBe('(10000/107913)');
        await checkboxFilter.openSecondaryPanel('Status');
        await checkboxFilter.selectElementByName('New');
        await since(
            'After select New, selected elements of Order filter is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await checkboxFilter.filterSelectionInfo('Order'))
            .toBe('(10000/108789)');
        await filterPanel.apply();
        await since('After apply new, filter summary should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('Status(New, Active)Order(10000, 10001, +9998)');

        // radio button
        await toc.openPageFromTocMenu({ chapterName: 'Radiobutton' });
        await filterPanel.openFilterPanel();
        await since('Selected elements of Order filter is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await radiobuttonFilter.filterSelectionInfo('Order'))
            .toBe('(1/107913)');
        await checkboxFilter.openSecondaryPanel('Status');
        await checkboxFilter.selectElementByName('New');
        await since(
            'After select New, selected elements of Order filter is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await radiobuttonFilter.filterSelectionInfo('Order'))
            .toBe('(1/108789)');
        await filterPanel.apply();
        await since('After apply new, filter summary should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('Status(New, Active)Order(24313)');

        // attribute slider
        await toc.openPageFromTocMenu({ chapterName: 'Slider' });
        await filterPanel.openFilterPanel();
        await since('The summary of Order should be #{expected}, instead we have #{actual}')
            .expect(await attributeSlider.summary('Order'))
            .toBe('10000 - 24313');
        await checkboxFilter.openSecondaryPanel('Status');
        await checkboxFilter.selectElementByName('New');
        await since(
            'After select New, selected elements of Order filter is supposed to be "#{expected}", instead we have "#{actual}"'
        )
            .expect(await radiobuttonFilter.filterSelectionInfo('Order'))
            .toBe('(10000/108789)');
        await since('After select new, The summary of Order should be #{expected}, instead we have #{actual}')
            .expect(await attributeSlider.summary('Order'))
            .toBe('10000 - 24313');
        await filterPanel.apply();
        await since('After apply new, filter summary should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterSummaryBarText())
            .toBe('Status(New, Active)Order(10000 - 24313)');
    });

    it('[TC86442_04] Validate GDDE for calendar as source', async () => {
        // Reset and open the calendar GDDE dossier
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossierWithCalendarGDDE,
        });
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(dossierWithCalendarGDDE.name);

        // Step 1: Navigate to GDDE Month->Day page, open filter panel, change month filter to Apr 2014
        await toc.openPageFromTocMenu({ chapterName: 'GDDE', pageName: 'Month->Day->Daytime' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Month');
        await checkboxFilter.selectElementByName('Apr 2014');

        // Step 2: Open the day filter, check the default from input is 4/1/2014, to input is 4/30/2014
        await calendarFilter.openSecondaryPanel('Day');
        since('The default From input of Day filter should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.displayTextOfFrom())
            .toBe('4/1/2014');
        since('The default To input of Day filter should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.displayTextOfTo())
            .toBe('4/30/2014');

        // Step 3: Change the day filter to 'Between 4/2/2014 to 4/10/2014', then open datetime filter, check default from/to, change to 'On 4/5/2014', apply and check grid
        await calendarFilter.selectDynamicDateOptions('Between');
        await calendarFilter.dynamicPanel.setFromInputValue('4/2/2014');
        await calendarFilter.dynamicPanel.setToInputValue('4/10/2014');
        await calendarFilter.openSecondaryPanel('DayTime');
        since('The default From input of DayTime filter should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.displayTextOfFrom())
            .toBe('4/2/2014 12:00:00 AM');
        since('The default To input of DayTime filter should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.displayTextOfTo())
            .toBe('4/10/2014 11:59:59 PM');
        await calendarFilter.selectDynamicDateOptions('On');
        await calendarFilter.dynamicPanel.setCustomOperatorInput('4/5/2014');
        await filterPanel.apply();
        since('After applying On 4/5/2014, the grid data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['4/5/2014']);

        // Step 4: Open the day filter, change to 'Before today', set exclude mode, then check warning for day filter
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('Day');
        await calendarFilter.selectDynamicDateOptions('On');
        since(
            'After selecting On with today, there should be a warning on filter capsule for Day filter should be #{expected}, instead we have #{actual}'
        )
            .expect(await calendarFilter.isFilterDateRangeWarningDisplayed('DayTime'))
            .toBe(true);
        await calendarFilter.selectDynamicDateOptions('Before');
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        await calendarFilter.closeSecondaryPanel('Day');
        await calendarFilter.openContextMenu('Day');
        await calendarFilter.selectContextMenuOption('Day', 'Exclude');
        since(
            'After selecting Before today with Exclude mode, there should be a warning on filter capsule for Day filter should be #{expected}, instead we have #{actual}'
        )
            .expect(await calendarFilter.isFilterDateRangeWarningDisplayed('Day'))
            .toBe(true);

        // Step 5: Check daytime filter capsule is still '4/5/2014 12:00:00 AM - 4/5/2014 11:59:59 PM', change to 'On 4/6/2014 3:00 AM - 4/6/2014 8:00 PM', apply and check no data
        let capsuleText = (await calendarFilter.capsuleDateTime('DayTime')).replace(/\s+/g, ' ');
        since('The DayTime filter capsule should be #{expected}, instead we have #{actual}')
            .expect(capsuleText)
            .toBe('4/5/2014 12:00:00 AM - 4/5/2014 11:59:59 PM');
        await calendarFilter.openSecondaryPanel('DayTime');
        since('DayTime Secondary Panel Locked before apply is supposed to be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.isCalendarLocked())
            .toBe(true);
        await filterPanel.apply();
        since('After applying On 4/6/2014 3:00 AM - 8:00 PM, the grid should be empty')
            .expect(await grid.isVizEmpty('Visualization 1'))
            .toBe(true);

        // Step 6: Open filter panel, clear DayTime filter, and check the default from/to input value
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('DayTime');
        capsuleText = (await calendarFilter.capsuleDateTime('DayTime')).replace(/\s+/g, ' ');
        since('The DayTime filter capsule should be #{expected}, instead we have #{actual}')
            .expect(capsuleText)
            .toBe('4/5/2014 12:00:00 AM - 4/5/2014 11:59:59 PM');
        since('DayTime Secondary Panel Locked is supposed to be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.isCalendarLocked())
            .toBe(true);
        since('The default From input of DayTime filter should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomOperator())
            .toBe('4/5/2014 12:00:00 AM');
        since('The default To input of DayTime filter should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.displayTextOfTo())
            .toBe('11:59:59 PM');

        // Step 7: Open Day filter, change to 'Before 4/3/2014', apply and check grid data count
        await calendarFilter.openSecondaryPanel('Day');
        await calendarFilter.selectDynamicDateOptions('Before');
        await calendarFilter.dynamicPanel.setCustomOperatorInput('4/3/2014');
        await filterPanel.apply();
        since('After applying Before 4/3/2014, the grid should have data rows, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['4/5/2014']);
    });

    it('[TC86442_05] Validate GDDE for calendar as target', async () => {
        // Reset and open the calendar GDDE dossier
        await resetDossierState({
            credentials: specConfiguration.credentials,
            dossier: dossierWithCalendarGDDE,
        });
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(dossierWithCalendarGDDE.name);

        // Step 1: Navigate to GDDE with Daytime chapter, Day->Daytime page
        await toc.openPageFromTocMenu({ chapterName: 'GDDE with Daytime', pageName: 'Day->Daytime' });

        // Step 2: Open the DayTime filter, check the default from/to input value, then open Day checkbox filter and select elements
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('DayTime');
        const defaultFromValue = await calendarFilter.dynamicPanel.displayTextOfFrom();
        const defaultToValue = await calendarFilter.dynamicPanel.displayTextOfTo();
        since('The default From input of DayTime filter should be #{expected}, instead we have #{actual}')
            .expect(defaultFromValue)
            .toBe('1/1/2014 12:00:00 AM');
        since('The default To input of DayTime filter should be #{expected}, instead we have #{actual}')
            .expect(defaultToValue)
            .toBe('12/31/2017 11:59:59 PM');

        // Open Day checkbox filter and select 1/5/2014 and 1/11/2014
        await checkboxFilter.openSecondaryPanel('Day');
        await checkboxFilter.selectElementsByNames(['1/5/2014', '1/11/2014']);

        // Step 3: Open DayTime filter, check the from/to input value again
        await calendarFilter.openSecondaryPanel('DayTime');
        const updatedFromValue = await calendarFilter.dynamicPanel.displayTextOfFrom();
        const updatedToValue = await calendarFilter.dynamicPanel.displayTextOfTo();
        since('After selecting Day elements, the From input of DayTime filter should be updated')
            .expect(updatedFromValue)
            .toBe('1/5/2014 12:00:00 AM');
        since('After selecting Day elements, the To input of DayTime filter should be updated')
            .expect(updatedToValue)
            .toBe('1/11/2014 11:59:59 PM');

        // Change selection to 'On Today', check there is warning on the DayTime filter capsule
        await calendarFilter.selectDynamicDateOptions('On');
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        await takeScreenshotByElement(
            await calendarFilter.getFilterDateRangeWarning('DayTime'),
            'TC86442_05',
            'Filter capsule with warning'
        );

        // Apply the filter and check the grid data is empty
        await filterPanel.apply();
        since('After applying On Today, the grid should be empty')
            .expect(await grid.isVizEmpty('Visualization 1'))
            .toBe(true);

        // Step 4: Open the Filter panel, check the warning still exists
        await filterPanel.openFilterPanel();
        since(
            'After reopening filter panel, the warning on DayTime filter capsule should be #{expected}, instead we have #{actual}'
        )
            .expect(await calendarFilter.isFilterDateRangeWarningDisplayed('DayTime'))
            .toBe(true);

        // Change the DayTime Filter via date picker to 1/9/2014
        await calendarFilter.openSecondaryPanel('DayTime');
        await calendarFilter.selectDynamicDateOptions('Before');
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        await calendarFilter.calendarPicker.selectYearAndMonth('2014', 'January');
        await calendarFilter.calendarPicker.selectDay('9');

        // Check the warning message disappeared
        since('After changing to 1/9/2014, the warning on DayTime filter capsule should disappear')
            .expect(await calendarFilter.isFilterDateRangeWarningDisplayed('DayTime'))
            .toBe(false);

        // Apply filter and check the grid data
        await filterPanel.apply();
        since('After applying 1/9/2014, the grid data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['1/5/2014', '1/5/2014 12:00:00 AM']);
    });

    it('[TC86442_06] Validate GDDE for calendar as source on web authoring', async () => {
        // Reset and open the calendar GDDE dossier in authoring mode
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(dossierWithCalendarGDDE.name);
        await libraryAuthoringPage.editDossierFromLibrary();

        // Step 1: Navigate to GDDE Month->Day page, switch to filter panel, change month filter to Apr 2014
        await contentsPanel.goToPage({ chapterName: 'GDDE', pageName: 'Month->Day->Daytime' });
        await authoringFilters.switchToFilterPanel();

        await authoringFilters.setFilterToAQSelectorContainer('Month');
        let checkbox = authoringFilters.selectorObject.checkbox;
        await checkbox.selectItemByText('(All)');
        await checkbox.selectItemByText('Apr 2014');

        // Step 2: Open the day filter, check the default from input is 4/1/2014, to input is 4/30/2014
        await authoringFilters.setFilterToAQSelectorContainer('Day');
        let calendar = authoringFilters.selectorObject.calendar;
        since ('The input placeholder value of From input of Day filter should be #{expected}, instead we have #{actual}')
            .expect(await calendar.getInputDate())
            .toBe('4/1/2014 - 4/30/2014');
        await calendar.openDateTimePicker();
        since('The default From input of Day filter should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.displayTextOfFrom())
            .toBe('4/1/2014');
        since('The default To input of Day filter should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.displayTextOfTo())
            .toBe('4/30/2014');

        // Step 3: Change the day filter to 'Between 4/2/2014 to 4/10/2014', then open datetime filter, check default from/to, change to 'On 4/5/2014', apply and check grid
        await calendarFilter.selectDynamicDateOptions('Between');
        await calendarFilter.dynamicPanel.setFromInputValue('4/2/2014');
        await calendarFilter.dynamicPanel.setToInputValue('4/10/2014');
        await calendarFilter.dynamicPanel.clickApplyButton();

        await authoringFilters.setFilterToAQSelectorContainer('DayTime');
        const dayTimeCalendar = authoringFilters.selectorObject.calendar;
        since('The input placeholder value of From input of DayTime filter should be #{expected}, instead we have #{actual}')
            .expect(await dayTimeCalendar.getInputDate())
            .toBe('4/2/2014 12:00:00 AM - 4/10/2014 11:59:59 PM');
        await dayTimeCalendar.openDateTimePicker();
        since('The default From input of DayTime filter should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.displayTextOfFrom())
            .toBe('4/2/2014 12:00:00 AM');
        since('The default To input of DayTime filter should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.displayTextOfTo())
            .toBe('4/10/2014 11:59:59 PM');
        await calendarFilter.selectDynamicDateOptions('On');
        await calendarFilter.dynamicPanel.setCustomOperatorInput('4/5/2014');
        await calendarFilter.dynamicPanel.clickApplyButton();
        since('After applying On 4/5/2014, the grid data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['4/5/2014']);

        // Step 4: Open the day filter, change to 'Before today', set exclude mode, then check warning for day filter
        await calendar.openDateTimePicker();
        await calendarFilter.selectDynamicDateOptions('After');
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        await calendarFilter.dynamicPanel.clickApplyButton();
        
        // Step 5: Check daytime filter capsule is still '4/5/2014 12:00:00 AM - 4/5/2014 11:59:59 PM', apply and check no data
        since('The DayTime filter capsule should be #{expected}, instead we have #{actual}')
            .expect(await dayTimeCalendar.getInputDate())
            .toBe('4/5/2014 12:00:00 AM - 4/5/2014 11:59:59 PM');
        since('After applying, the grid should be empty')
            .expect(await grid.isVizEmpty('Visualization 1'))
            .toBe(true);

        // Step 6: Open Day filter, change to 'Before 4/3/2014', apply and check grid data
        await calendar.openDateTimePicker();
        await calendarFilter.selectDynamicDateOptions('After');
        await calendarFilter.dynamicPanel.setCustomOperatorInput('4/3/2014');
        await calendarFilter.dynamicPanel.clickApplyButton();
        since('After applying Before 4/3/2014, the grid should have data rows, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['4/5/2014']);
    });
});

export const config = specConfiguration;
