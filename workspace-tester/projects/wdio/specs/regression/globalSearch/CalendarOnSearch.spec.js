import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_search') };

describe('GlobalSearch_CalendarOnSearch', () => {
    let { quickSearch, fullSearch, filterOnSearch, calendarOnSearch, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    afterEach(async () => {
        await fullSearch.backToLibrary();
    });

    it('[TC70309] Global Search - Calendar Filter - Calendar filter Before', async () => {
        const keyword = 'auto';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        // open calendar filter
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Last Updated');
        await calendarOnSearch.openCalendarTypeSelector();
        // select before X date
        await calendarOnSearch.selectCalendarFilterTypeOption('Before');
        await since('Select before, selected option should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getCalendarSelectedOption())
            .toBe('Before');
        await calendarOnSearch.setInputBoxDate({ customMonth: '2', customDay: '2', customYear: '2019' });
        await since('Select before, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('Before 02/02/2019');
        await takeScreenshotByElement(filterOnSearch.getFilterDetailsPanel(), 'TC70309', 'filterCalendar_before');
        await filterOnSearch.applyFilterChanged();
        // reopen filter panel to check
        await filterOnSearch.openSearchFilterPanel();
        await since('Select before and apply, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('Before 02/02/2019');
        await takeScreenshotByElement(
            filterOnSearch.getSearchFilterDropdownPanel(),
            'TC70309',
            'filterCalendar_before_reopen'
        );
        await filterOnSearch.closeFilterPanel();
    });

    it('[TC70310] Global Search - Calendar Filter - Calendar filter On', async () => {
        const keyword = 'search';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickAllTab();
        // open calendar filter
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Last Updated');
        await calendarOnSearch.openCalendarTypeSelector();
        // select on X date
        await calendarOnSearch.selectCalendarFilterTypeOption('On');
        await since('Select on, selected option should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getCalendarSelectedOption())
            .toBe('On');
        await calendarOnSearch.setInputBoxDate({ customMonth: '10', customDay: '14', customYear: '2019' });
        await since('Select on, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('10/14/2019');
        await filterOnSearch.applyFilterChanged();
        // reopen filter panel to check
        await filterOnSearch.openSearchFilterPanel();
        await since('Select on and apply, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('10/14/2019');
        await filterOnSearch.closeFilterPanel();
    });

    it('[TC70311] Global Search - Calendar Filter - Calendar filter After', async () => {
        const keyword = 'search';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickAllTab();
        // open calendar filter
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Last Updated');
        await calendarOnSearch.openCalendarTypeSelector();
        // select after X date
        await calendarOnSearch.selectCalendarFilterTypeOption('After');
        await since('Select after, selected option should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getCalendarSelectedOption())
            .toBe('After');
        await calendarOnSearch.setInputBoxDate({ customMonth: '02', customDay: '14', customYear: '2020' });
        await since('Select after, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('After 02/14/2020');
        await filterOnSearch.applyFilterChanged();
        // check filter results
        await since('Select after, filtered results should be greater than #{expected}, instead we have #{actual} ')
            .expect(await fullSearch.getAllTabCount())
            .toBeGreaterThan(0);
        // reopen filter panel to check
        await filterOnSearch.openSearchFilterPanel();
        await since('Select after and apply, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('After 02/14/2020');
        await filterOnSearch.closeFilterPanel();
    });

    it('[TC70312] Global Search - Calendar Filter - Calendar filter Between', async () => {
        const keyword = 'search';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickAllTab();
        // open calendar filter
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Last Updated');
        await calendarOnSearch.openCalendarTypeSelector();
        // select between X~~Y date
        await calendarOnSearch.selectCalendarFilterTypeOption('Between');
        await since('Select Between, selected option should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getCalendarSelectedOption())
            .toBe('Between');
        await calendarOnSearch.setInputBoxDate({ customMonth: '10', customDay: '10', customYear: '2019' });
        await calendarOnSearch.setInputBoxDate({ customMonth: '10', customDay: '10', customYear: '2020', flag: 'to' });
        await since('Select aftBetweener, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('10/10/2019 - 10/10/2020');
        await takeScreenshotByElement(filterOnSearch.getFilterDetailsPanel(), 'TC70312', 'filterCalendar_Between1');
        await filterOnSearch.applyFilterChanged();
        // check filter results
        await since('Select Between, filtered results should be greater than #{expected}, instead we have #{actual} ')
            .expect(await fullSearch.getAllTabCount())
            .not.toBeLessThan(0);
        // reopen filter panel to check
        await filterOnSearch.openSearchFilterPanel();
        await since('Select Between and apply, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('10/10/2019 - 10/10/2020');
        await takeScreenshotByElement(
            filterOnSearch.getSearchFilterDropdownPanel(),
            'TC70312',
            'filterCalendar_Between2'
        );
        await filterOnSearch.closeFilterPanel();
    });

    it('[TC74393] Global Search - Calendar Filter - Select date from calendar widget', async () => {
        const keyword = 'search';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        // open calendar filter
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Last Updated');
        await calendarOnSearch.openAndSelectCalendarType('Before');
        // set a base date
        await calendarOnSearch.setInputBoxDate({ customMonth: '5', customDay: '25', customYear: '2018' });
        await since('Set a base date, the date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('Before 05/25/2018');
        await filterOnSearch.applyFilterChanged();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Last Updated');

        // select date from calendar widget
        await calendarOnSearch.selectDate('July', 15, 2019);
        await since('Select large date , selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('Before 07/15/2019');
        await filterOnSearch.applyFilterChanged();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Last Updated');
        await since('Select large date, after apply, the date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('Before 07/15/2019');
    });

    it('[TC74391] Global Search - Calendar Filter - Action on calendar header (Last/next month & year)', async () => {
        const keyword = 'search';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        // open calendar filter
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Last Updated');
        await calendarOnSearch.openAndSelectCalendarType('Before');
        // set a base date
        await calendarOnSearch.setInputBoxDate({ customMonth: '5', customDay: '25', customYear: '2018' });
        await since('Set a base date, the date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('Before 05/25/2018');
        await filterOnSearch.applyFilterChanged();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Last Updated');

        // next month
        await calendarOnSearch.clickNextMonth(2);
        await since('Click last month twice, current month should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getHeaderTitleText())
            .toBe('July 2018');

        // next year
        await calendarOnSearch.clickNextYear(2);
        await since('Click last month twice, current month should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getHeaderTitleText())
            .toBe('July 2020');

        // last year
        await calendarOnSearch.clickLastYear(2);
        await since('Click last month twice, current month should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getHeaderTitleText())
            .toBe('July 2018');

        // last month
        await calendarOnSearch.clickLastMonth(2);
        await since('Click last month twice, current month should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getHeaderTitleText())
            .toBe('May 2018');

        await filterOnSearch.closeFilterPanel();
    });

    it('[TC74468] Global Search - Calendar Filter - Action on calendar footer (X days selected, clear all)', async () => {
        const keyword = 'search';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickAllTab();
        // open calendar filter
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Last Updated');
        await calendarOnSearch.openAndSelectCalendarType('Between');

        // select date arrange - days count
        await calendarOnSearch.setInputBoxDate({ customMonth: '08', customDay: '01', customYear: '2018' });
        await calendarOnSearch.setInputBoxDate({ customMonth: '09', customDay: '30', customYear: '2018', flag: 'to' });
        await since('Select Between, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('08/01/2018 - 09/30/2018');
        await since('Select Between, days selected count should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getCalendarSelectedDaysCount())
            .toBe(61);

        // clear all
        await filterOnSearch.applyFilterChanged();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Last Updated');
        await calendarOnSearch.openAndSelectCalendarType('Between');
        await takeScreenshotByElement(
            calendarOnSearch.getCalendarPanel(),
            'TC74468',
            'globalSearch_CalendarFilter_select'
        );
        await calendarOnSearch.clearAll();
        await since('Clear all, days selected count should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getCalendarSelectedDaysCount())
            .toBe(0);

        // apply and back
        await filterOnSearch.applyFilterChanged();
    });
});
export const config = specConfiguration;
