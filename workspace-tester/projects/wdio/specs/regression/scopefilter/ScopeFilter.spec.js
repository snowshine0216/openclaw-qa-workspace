import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { getStringOfDate, addMonthsAndDays, getToday, addDays } from '../../../utils/DateUtil.js';


const specConfiguration = { ...customCredentials('_sf') };

describe('ScopeFilter', () => {
    const dossier = {
        id: '27B3B7D0F54149DEE56769B2233A5D27',
        name: '(AUTO) ScopeFilter_Day',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };


    const dossierWithMultipleSFs = {
        id: 'FC00A3615247CDCC6F9742BCAF8BA4FC',
        name: '(AUTO) ScopeFilter_Multiple',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierWithMultipleAEStyles = {
        id: 'BC2A41C7794E7DFAD0D3F389BE55E701',
        name: '(AUTO) ScopeFilter_DifferentAEStyles',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const { credentials } = specConfiguration;
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const today = getStringOfDate(getToday());

    let { libraryPage, calendarFilter, dossierPage, libraryAuthoringPage, grid, loginPage, mqFilter, filterPanel, searchBoxFilter, filterSummaryBar, authoringFilters, dossierAuthoringPage, checkboxFilter, attributeSlider, radiobuttonFilter} = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: credentials,
            dossier:dossierWithMultipleSFs,
        });
    });

    afterEach(async () => {
        await dossierAuthoringPage.clickCloseDossierButton();
        await dossierPage.goToLibrary();
    });

    

    it('[TC68552_01] Validate SF with day for library consumption and authoring', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: dossier,
        });
        await libraryPage.openDossier(dossier.name);

        // check sf in library consumption
        since('The applied filter count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.appliedFilterCount()).toBe('2');
        await filterPanel.openFilterPanel();
        since('Global filter icon exist should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isGlobalFilterIconExist('Daytime_SF')).toBe(true);
        since('Global filter icon exist should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isGlobalFilterIconExist('Daytime_SF', 1)).toBe(false); 
        await searchBoxFilter.openSecondaryPanel('Daytime_SF');
        await searchBoxFilter.selectElementsByNames(['1/3/2014 12:00:00 AM', '1/4/2014 12:00:00 AM']);
        since('after apply 4 selections, the warning text is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.getFilterWarningText('Daytime_SF')).toBe('Make up to 3 selections.');
        since('THe apply button enabled status is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isApplyEnabled()).toBe(false);
        await searchBoxFilter.selectElementsByNames(['1/4/2014 12:00:00 AM']);
        await filterPanel.apply();
        since('after apply filter with 3 selections, the target grid row count is supposed to be #{expected}, instead we have #{actual}')
            expect(await grid.getRowsCount('Visualization 1'))
            .toBe(4);
        // check filter summary
        since('The filterCountString of filterSummaryBar is FILTERS (0)')
            .expect(await filterSummaryBar.filterCountString()).toBe('FILTERS (3)');
        since('The filterSummaryBar scope filter Daytime_SF is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Daytime_SF'))
            .toBe('(1/1/2014 12:00:00 AM, 1/2/2014 12:00:00 AM, +1)');
        since('The filterSummaryBar Day_SF ID is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Day_SF ID'))
            .toBe('(Before 12/10/2025)');
        since('The filterSummaryBar dashboard filter Daytime_SF ID is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Daytime_SF', 1))
            .toBe('(1/1/2014 12:00:00 AM - 1/9/2014 11:59:59 PM)');
        await filterSummaryBar.viewAllFilterItems();
        since('The filterSummaryPanel item scope filter Daytime_SF is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Daytime_SF'))
            .toBe('1/1/2014 12:00:00 AM,1/2/2014 12:00:00 AM,1/3/2014 12:00:00 AM');
        since('The filterSummaryPanel item scope filter Day_SF ID is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Day_SF ID'))
            .toBe('Before 12/10/2025');
        since('The filterSummaryPanel item scope filter Daytime_SF is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Daytime_SF', 1))
            .toBe('1/1/2014 12:00:00 AM - 1/9/2014 11:59:59 PM');
        await filterSummaryBar.collapseViewAllItems();

        // check sf in library authoring
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringFilters.switchToFilterPanel();
        since('Scope filter header display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isScopeFilterDisplayed())
            .toBe(true);
        since('Scope filter info icon tooltip is supposed to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getScopeFilterInfoMessage())
            .toBe('Scope filters have been created on this dataset and automatically added to the filter panel. These filters cannot be deleted, and contextual linking is not supported.');
        await authoringFilters.setFilterToAQSelectorContainer('Daytime_SF');
        let searchbox = authoringFilters.selectorObject.searchbox;
        await searchbox.input('');
        await searchbox.selectItemsByTextForPreload({ texts: ['1/3/2014 12:00:00 AM','1/4/2014 12:00:00 AM'], isPreload: true, isSingleSelection: false });
        since('after apply 2 more selections, the warning text is supposed to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterWarningMessage('Daytime_SF')).toBe('Make up to 3 selections.');
        since('target grid row count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(4);
        await searchbox.deleteItemByText('1/4/2014 12:00:00 AM');
        await authoringFilters.collapseFilter('Daytime_SF');
        since('the filter summary for scope filter Daytime_SF is supposed to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterSummary('Daytime_SF'))
            .toBe('1/1/2014 12:00:00 AM, 1/2/2014 12:00:00 AM, 1/3/2014 12:00:00 AM');
        await takeScreenshotByElement(authoringFilters.getFilterPanelItem('Day_SF ID'), 'TC68552_01', 'Read-only SF for web authoring', 0.3);
        await authoringFilters.expandFilter('Day_SF ID');
        since('the filter summary for scope filter Day_SF ID is supposed to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterSummary('Day_SF ID'))
            .toBe('Less than 12/10/2025');

        
        // check dashboard filter in library authoring
        since('Dashboard filter header display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isDashboardFilterDisplayed())
            .toBe(true);
        await authoringFilters.setFilterToAQSelectorContainer('Daytime_SF', 1);
        let calendar = authoringFilters.selectorObject.calendar;
        await calendar.openDateTimePicker();
        await calendarFilter.dynamicPanel.openFromDatePicker();
        await calendarFilter.calendarPicker.selectYearAndMonth('2014', 'January');
        await calendarFilter.calendarPicker.selectDay('2');
        await calendarFilter.dynamicPanel.clickApplyButton();
        since('after change the start date to 1/2/2014, the target grid row count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(3);
        await authoringFilters.collapseFilter('Daytime_SF', 1);
        since('the dashboard filter summary for Daytime_SF is supposed to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterSummary('Daytime_SF', 1))
            .toBe('From 1/2/2014 12:00:00 AM to 1/9/2014 11:59:59 PM');
        
        // unset all filters on library authoring
        await authoringFilters.selectFiltersOption('Unset All Filters');
        await dossierPage.waitForDossierLoading();
        since('after unset all filters, the target grid row count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(4);
        since('after unset all filters, the scope filter summary for Daytime_SF is supposed to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterSummary('Daytime_SF'))
            .toBe('1/1/2014 12:00:00 AM, 1/2/2014 12:00:00 AM, 1/3/2014 12:00:00 AM');
        await authoringFilters.expandFilter('Daytime_SF', 1);
        since('after unset all filters, the dashboard filter selection for Daytime_SF is supposed to be #{expected}, instead we have #{actual}')
            .expect(await calendar.getFromDate())
            .toBe('');

    });

    it('[TC68552_02] Validate SF with calendar for library consumption and authoring', async () => {
        
        await libraryPage.openDossier(dossierWithMultipleSFs.name);

        // check sf in library consumption
        since('The applied filter count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.appliedFilterCount()).toBe('5');
        await filterPanel.openFilterPanel();
        since('Global filter icon exist should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isGlobalFilterIconExist('Quarter_SF_DifferentOps DATE')).toBe(true);
        since('mandatory filter icon exist should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.isMendatoryIconByNameDisplayed('Quarter_SF_DifferentOps DATE')).toBe(true);
        since('The calendar scope filter initial expression is supposed to be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.capsuleName('Quarter_SF_DifferentOps DATE'))
            .toBe('1/1/2015 - 1/14/2015');
        await calendarFilter.openSecondaryPanel('Quarter_SF_DifferentOps DATE');
        await calendarFilter.selectDynamicOption('Today');
        await since('Select Today, date on filter panel should contain "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.capsuleDateTime('Quarter_SF_DifferentOps DATE'))
            .toContain(getStringOfDate(today, false));
        await filterPanel.apply();
        
        // check filter summary
        const todaySummary ='TODAY: ' + getStringOfDate(today, false);
        const todayPlusOne = 'TODAY: ' + getStringOfDate(addDays(1, getToday()), false);
        const expectedValues = ['(' + todaySummary + ')', '(' + todayPlusOne + ')'];
        since('The filterCountString of filterSummaryBar is FILTERS (0)')
            .expect(await filterSummaryBar.filterCountString()).toBe('FILTERS (5)');
        since('The filterSummaryBar scope filter Quarter_SF_DifferentOps is supposed to be #{expected}, instead we have #{actual}')
            .expect(expectedValues)
            .toContain(await filterSummaryBar.filterItems('Quarter_SF_DifferentOps DATE'));
        await filterSummaryBar.viewAllFilterItems();
        since('The filterSummaryPanel item scope filter Quarter_SF_DifferentOps DATE is supposed to be #{expected}, instead we have #{actual}')
            .expect([todaySummary, todayPlusOne])
            .toContain(await filterSummaryBar.filterPanelItems('Quarter_SF_DifferentOps DATE'));
        await filterSummaryBar.collapseViewAllItems();

        // check sf in library authoring
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringFilters.switchToFilterPanel();
        since('Scope filter header display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isScopeFilterDisplayed())
            .toBe(true);
        since('Dashboard filter header display is supposed to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isDashboardFilterDisplayed())
            .toBe(true);
        since('Global filter icon exist should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterItemGlobalIconDisplayed('Quarter_SF_DifferentOps'))
            .toBe(true);
        // since('mandatory filter icon exist should be #{expected}, instead we have #{actual}')
        //     .expect(await authoringFilters.isFilterItemMandatoryIconDisplayed('Quarter_SF_DifferentOps DATE'))
        //     .toBe(true);
        since('context menu for qualification sf should be #{expected}, the actual display status is #{actual}')
            .expect(await authoringFilters.isFilterItemMenuDisplayed('Quarter_SF_DifferentOps'))
            .toBe(false);
        await authoringFilters.setFilterToAQSelectorContainer('Quarter_SF_DifferentOps');
        let calendar = authoringFilters.selectorObject.calendar;
        await calendar.openFromCalendar();
        await calendar.clickDynamicDateCheckBox();
        await calendar.clickOkButton();
        // await authoringFilters.applyFilter();
        await authoringFilters.collapseFilter('Quarter_SF_DifferentOps');
        since('the dashboard filter summary for Quarter_SF_DifferentOps DATE is supposed to be #{expected}, instead we have #{actual}')
            .expect(['From '+ getStringOfDate(getToday(), false) + ' to 1/14/2015', 'From '+ getStringOfDate(addDays(1,getToday()), false) + ' to 1/14/2015'])
            .toContain(await authoringFilters.getFilterSummary('Quarter_SF_DifferentOps'))
        since('after change the start date to 1/2/2014, the target grid row count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.isVizEmpty('Visualization 1')).toBe(true);
        
        // unset all filters on library authoring
        since('unset filter option when only scopt filters shown should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterOptionDisplayed()).toBe(false);

    });

    it('[TC68552_03] Validate SF with qualification for contains for library consumption and authoring', async () => {
        
        await libraryPage.openDossier(dossierWithMultipleSFs.name);

        // check sf in library consumption
        await filterPanel.openFilterPanel();
        since('Global filter icon exist should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isGlobalFilterIconExist('Month_SF_DifferentOps DESC')).toBe(true);
        since('mandatory filter icon exist should be #{expected}, instead we have #{actual}')
            .expect(await mqFilter.isMendatoryIconByNameDisplayed('Month_SF_DifferentOps DESC')).toBe(true);
        await mqFilter.updateValue({ filterName: 'Month_SF_DifferentOps DESC', valueLower: ' ' });
        since('error message should be #{expected}, instead we have #{actual}')
            .expect(await mqFilter.getFilterWarningText('Month_SF_DifferentOps DESC'))
            .toBe('Input values are required.');
        await mqFilter.updateValue({ filterName: 'Month_SF_DifferentOps DESC', valueLower: 'J' });
        await filterPanel.apply();
        since('after apply filter with "J", the target grid row count is supposed to be #{expected}, instead we have #{actual}')
            expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['2015', '2015 Q1', 'Jan 2015']);
        
        // check filter summary
        since('The filterSummaryBar scope filter Month_SF_DifferentOps DESC is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Month_SF_DifferentOps DESC'))
            .toBe('(Contains J)');
        await filterSummaryBar.viewAllFilterItems();
        since('The filterSummaryPanel item scope filter Month_SF_DifferentOps DESC is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Month_SF_DifferentOps DESC'))
            .toBe('Contains J');
        await filterSummaryBar.collapseViewAllItems();

        // check sf in library authoring
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringFilters.switchToFilterPanel();
        since('Global filter icon exist should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterItemGlobalIconDisplayed('Month_SF_DifferentOps'))
            .toBe(true);
        // since('mandatory filter icon exist should be #{expected}, instead we have #{actual}')
        //     .expect(await authoringFilters.isFilterItemMandatoryIconDisplayed('Quarter_SF_DifferentOps DATE'))
        //     .toBe(true);
        since('context menu for qualification sf should be #{expected}, the actual display status is #{actual}')
            .expect(await authoringFilters.isFilterItemMenuDisplayed('Month_SF_DifferentOps'))
            .toBe(false);
        await authoringFilters.setFilterToAQSelectorContainer('Month_SF_DifferentOps');
        let mq = authoringFilters.selectorObject.metricQualification;
        await mq.inputValueDirectly('F');
        await mq.inputValueDirectly('');
        since('warning message should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterWarningMessage('Month_SF_DifferentOps')).toBe('Input values are required.');
        // await authoringFilters.applyFilter();
        await authoringFilters.collapseFilter('Month_SF_DifferentOps');
        since('the dashboard filter summary for Month_SF_DifferentOps is supposed to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterSummary('Month_SF_DifferentOps'))
            .toBe('');
        since('after change the start date to 1/2/2014, the target grid row count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2)).toEqual(['2015', '2015 Q1', 'Feb 2015']);
        

    });

    it('[TC68552_04] Validate SF with qualification for between for library consumption and authoring', async () => {
        
        await libraryPage.openDossier(dossierWithMultipleSFs.name);

        // check sf in library consumption
        await filterPanel.openFilterPanel();
        since('Global filter icon exist should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isGlobalFilterIconExist('Quarter_SF_DifferentOps DESC')).toBe(true);
        since('mandatory filter icon exist should be #{expected}, instead we have #{actual}')
            .expect(await mqFilter.isMendatoryIconByNameDisplayed('Quarter_SF_DifferentOps DESC')).toBe(true);
        await mqFilter.updateValue({ filterName: 'Quarter_SF_DifferentOps DESC', valueLower: '2015 Q4', valueUpper: '  ' });
        since('error message should be #{expected}, instead we have #{actual}')
            .expect(await mqFilter.getFilterWarningText('Quarter_SF_DifferentOps DESC'))
            .toBe('Input values are required.');
        await mqFilter.updateValue({ filterName: 'Quarter_SF_DifferentOps DESC', valueLower: '   ', valueUpper: '2015 Q1' });
        since('error message should be #{expected}, instead we have #{actual}')
            .expect(await mqFilter.getFilterWarningText('Quarter_SF_DifferentOps DESC'))
            .toBe('Input values are required.');
        await mqFilter.updateValue({ filterName: 'Quarter_SF_DifferentOps DESC', valueLower: '2015 Q4', valueUpper: '2015 Q1' });
        await filterPanel.apply();
        since('after apply filter, the target grid row count is supposed to be #{expected}, instead we have #{actual}')
            expect(await grid.isVizEmpty('Visualization 1'))
            .toBe(true);
        
        // check filter summary
        since('The filterSummaryBar scope filter Quarter_SF_DifferentOps DESC is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Quarter_SF_DifferentOps DESC'))
            .toBe('(Between 2015 Q4 and 2015 Q1)');
        await filterSummaryBar.viewAllFilterItems();
        since('The filterSummaryPanel item scope filter Quarter_SF_DifferentOps DESC is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Quarter_SF_DifferentOps DESC'))
            .toBe('Between 2015 Q4 and 2015 Q1');
        await filterSummaryBar.collapseViewAllItems();

        // check sf in library authoring
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringFilters.switchToFilterPanel();
        since('Global filter icon exist should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterItemGlobalIconDisplayed('Quarter_SF_DifferentOps', 1))
            .toBe(true);
        // since('mandatory filter icon exist should be #{expected}, instead we have #{actual}')
        //     .expect(await authoringFilters.isFilterItemMandatoryIconDisplayed('Quarter_SF_DifferentOps DATE'))
        //     .toBe(true);
        since('context menu for qualification sf should be #{expected}, the actual display status is #{actual}')
            .expect(await authoringFilters.isFilterItemMenuDisplayed('Quarter_SF_DifferentOps', 1))
            .toBe(false);
        await authoringFilters.setFilterToAQSelectorContainer('Quarter_SF_DifferentOps', 1);
        let mq = authoringFilters.selectorObject.metricQualification;
        await mq.inputValueDirectly('2015 Q4'); 
        await mq.inputValueDirectly('2015 Q1', 2);
        await mq.inputValueDirectly('');
        since('warning message should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterWarningMessage('Quarter_SF_DifferentOps', 1)).toBe('Input values are required.');


        // await authoringFilters.applyFilter();
        await authoringFilters.collapseFilter('Quarter_SF_DifferentOps', 1);
        since('the dashboard filter summary for Quarter_SF_DifferentOps is supposed to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterSummary('Quarter_SF_DifferentOps', 1))
            .toBe('Between and 2015 Q1');
        since('after change the start date to 1/2/2014, the target grid row count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.isVizEmpty('Visualization 1')).toBe(true);
        

    });

    it('[TC68552_05] Validate SF with AE - checkbox for library consumption and authoring', async () => {
        
        await libraryPage.openDossier(dossierWithMultipleSFs.name);

        // check sf in library consumption
        await filterPanel.openFilterPanel();
        since('Global filter icon exist should be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isGlobalFilterIconExist('Year_SF_DifferentOps')).toBe(true);
        since('mandatory filter icon exist should be #{expected}, instead we have #{actual}')
            .expect(await mqFilter.isMendatoryIconByNameDisplayed('Year_SF_DifferentOps')).toBe(true);
        await checkboxFilter.openSecondaryPanel('Year_SF_DifferentOps');
        await checkboxFilter.selectElementsByNames(['2014']);
        since('after apply 1 selections, the warning text is supposed to be #{expected}, instead we have #{actual}')
            .expect(await searchBoxFilter.getFilterWarningText('Year_SF_DifferentOps')).toBe('Make at least 1 selection.');
        since('THe apply button enabled status is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterPanel.isApplyEnabled()).toBe(false);
        await checkboxFilter.selectElementsByNames(['2015']);
        await filterPanel.apply();
        since('after apply filter, the target grid row count is supposed to be #{expected}, instead we have #{actual}')
            expect(await grid.isVizEmpty('Visualization 1'))
            .toBe(true);
        
        // check filter summary
        since('The filterSummaryBar scope filter Year_SF_DifferentOps is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Year_SF_DifferentOps'))
            .toBe('(exclude 2015)');
        await filterSummaryBar.viewAllFilterItems();
        since('The filterSummaryPanel item scope filter Year_SF_DifferentOps is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Year_SF_DifferentOps'))
            .toBe('2015');
        await filterSummaryBar.collapseViewAllItems();

        // check sf in library authoring
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringFilters.switchToFilterPanel();
        since('Global filter icon exist should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.isFilterItemGlobalIconDisplayed('Year_SF_DifferentOps'))
            .toBe(true);
        await authoringFilters.setFilterToAQSelectorContainer('Year_SF_DifferentOps');
        let checkbox = authoringFilters.selectorObject.checkbox;
        await checkbox.selectItemByText('2014');
        since('warning message should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterWarningMessage('Year_SF_DifferentOps')).toBe('Make at least one selection.');
        await authoringFilters.collapseFilter('Year_SF_DifferentOps');
        since('the filter summary for Year_SF_DifferentOps is supposed to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterSummary('Year_SF_DifferentOps'))
            .toBe('None');
        // expand the filter and make selections
        await authoringFilters.expandFilter('Year_SF_DifferentOps');
        await checkbox.selectItemByText('2015');
        since('after change selection, the target grid row count is supposed to be #{expected}, instead we have #{actual}')
            .expect(await grid.isVizEmpty('Visualization 1')).toBe(true);
        await authoringFilters.collapseFilter('Year_SF_DifferentOps');
        since('the filter summary for Year_SF_DifferentOps is supposed to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterSummary('Year_SF_DifferentOps'))
            .toBe('Not 2015');
        

    });

    it('[TC68552_06] Validate SF with AE - different style for library authoring', async () => {
        
        await libraryPage.openDossier(dossierWithMultipleSFs.name);

        // change sf style in library authoring
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringFilters.switchToFilterPanel();
        // change AE sf style to slider
        await authoringFilters.clickFilterContextMenuOption('Year_SF_DifferentOps', ['Display Style', 'Slider']);
        await authoringFilters.setFilterToAQSelectorContainer('Year_SF_DifferentOps');
        let slider = authoringFilters.selectorObject.slider;
        await slider.dragSlider({ x: 20, y: 0 },'bottom', false);
        await authoringFilters.collapseFilter('Year_SF_DifferentOps');
        since('the filter summary for Year_SF_DifferentOps is supposed to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterSummary('Year_SF_DifferentOps'))
            .toBe('Not 2014 - 2016');
        await authoringFilters.expandFilter('Year_SF_DifferentOps');
        since('after apply filter, the target grid row count is supposed to be #{expected}, instead we have #{actual}')
            expect(await grid.isVizEmpty('Visualization 1'))
            .toBe(true);

        // change sf style to radio button
        await authoringFilters.clickFilterContextMenuOption('Year_SF_DifferentOps', ['Display Style', 'Radio Buttons']);
        since('the warning message should be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterWarningMessage('Year_SF_DifferentOps'))
            .toBe('Make at least one selection.');
        const radioButton = authoringFilters.selectorObject.radiobutton;
        await radioButton.selectItemByText('2016',false);
        await dossierPage.waitForDossierLoading();
        since('after apply filter, the target grid row count is supposed to be #{expected}, instead we have #{actual}')
            expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['2015', '2015 Q1', 'Mar 2015']);
        
        // change sf style to dropdown
        await authoringFilters.clickFilterContextMenuOption('Year_SF_DifferentOps', ['Display Style', 'Drop-down']);
        const dropdown = authoringFilters.selectorObject.dropdown;
        await dropdown.clickDropdown();
        await dropdown.selectItemByText('2014', false);
        await dossierPage.waitForDossierLoading();
        since('after apply filter, the target grid row count is supposed to be #{expected}, instead we have #{actual}')
            expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['2015', '2015 Q1', 'Mar 2015']);

    });

    it('[TC68552_07] Validate SF with AE - different style for library consumption', async () => {
        
        await resetDossierState({
            credentials: credentials,
            dossier: dossierWithMultipleAEStyles,
        });
        await libraryPage.openDossier(dossierWithMultipleAEStyles.name);

        // check slider and radio button sf in library consumption
        await filterPanel.openFilterPanel();
        await radiobuttonFilter.openSecondaryPanel('Daytime_SF');
        await radiobuttonFilter.selectElementByName('1/10/2014 12:00:00 AM');
        await attributeSlider.dragAndDropUpperHandle('Year_SF_DifferentOps', 60);
        await filterPanel.apply();

        // check filter summary
        since('The filterSummaryBar scope filter Daytime_SF is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Daytime_SF'))
            .toBe('(1/10/2014 12:00:00 AM)');
        since('The filterSummaryBar scope filter Year_SF_DifferentOps is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Year_SF_DifferentOps'))
            .toBe('(exclude 2014 - 2015)');
        // view all
        await filterSummaryBar.viewAllFilterItems();
        since('the filter summary panel item for Daytime_SF is supposed to be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterPanelItems('Year_SF_DifferentOps ID'))
            .toBe('Is Not Null');
        await filterSummaryBar.collapseViewAllItems();
        
        // go to authoring mode to check manual apply
        await libraryAuthoringPage.editDossierFromLibrary();
        await authoringFilters.switchToFilterPanel();
        await authoringFilters.setFilterToAQSelectorContainer('Month_SF_DifferentOps');
        let mq = authoringFilters.selectorObject.metricQualification;
        await mq.inputValueDirectly('F');
        await authoringFilters.applyFilter();

        // check no input filter summary
        await authoringFilters.expandFilter('Year_SF_DifferentOps',1);
        since('the filter summary for Year_SF_DifferentOps is supposed to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterSummary('Year_SF_DifferentOps',1))
            .toBe('');
        await authoringFilters.collapseFilter('Year_SF_DifferentOps',1);
        since('the filter summary for Year_SF_DifferentOps is supposed to be #{expected}, instead we have #{actual}')
            .expect(await authoringFilters.getFilterSummary('Year_SF_DifferentOps',1))
            .toBe('Is Not Null');
        
    });

});

export const config = specConfiguration;
