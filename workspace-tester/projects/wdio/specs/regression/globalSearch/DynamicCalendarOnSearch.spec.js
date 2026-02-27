import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import {
    addDays,
    addMonths,
    addWeeks,
    addYears,
    createDateObj,
    diffDays,
    endOfMonth,
    endOfQuarter,
    endOfWeek,
    endOfYear,
    getStringOfDate,
    getToday,
    startOfMonth,
    startOfQuarter,
    startOfWeek,
    startOfYear
} from '../../../utils/DateUtil.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_search') };

describe('GlobalSearch_CalendarOnSearch', () => {
    let { quickSearch, fullSearch, filterOnSearch, calendarOnSearch, loginPage } = browsers.pageObj1;

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const todayInstance = getToday();
    const today = getStringOfDate(todayInstance);

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);

        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        const keyword = 'auto';
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(keyword);
        await fullSearch.clickMyLibraryTab();
        // open calendar filter
        await filterOnSearch.openSearchFilterPanel();
        if (!(await filterOnSearch.isClearAllDisabled())) {
            await filterOnSearch.clearAllFilters();
        }
        await filterOnSearch.openFilterDetailPanel('Last Updated');
        await calendarOnSearch.openCalendarTypeSelector();
        // select before X date
        await calendarOnSearch.selectCalendarFilterTypeOption('Dynamic');
    });

    afterEach(async () => {
        await fullSearch.backToLibrary();
    });

    it('[TC74471] Global Search - Calendar Filter - Select Dynamic Today', async () => {
        await calendarOnSearch.selectDynamicCalendarConditionBtn('Today');
        // validate in selected condition
        await since('Select Today, selected condition should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.whichConditionIsSelected())
            .toBe('Today');
        // validate in preview content
        await since('Select Today, preview content should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('from'))
            .toBe('Today: ' + today);
        await since('Select Today, preview content should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('to'))
            .toBe('Today: ' + today);
        // validate in header
        await since('Select Today, days selected count should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicDateInputContent())
            .toBe(today);
        // validate in footer
        await since('Select Today, days selected count should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getCalendarSelectedDaysCount())
            .toBe(1);
        // validate in filter panel
        await since('Select today, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('Today\n' + today);
        await filterOnSearch.applyFilterChanged();
        // validate in filter panel after re-open
        await filterOnSearch.openSearchFilterPanel();
        await since('Select today, selected date after re-open should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('Today\n' + today);
    });

    it('[TC74472] Global Search - Calendar Filter - Select Dynamic Yesterday', async () => {
        const yesterday = getStringOfDate(addDays(-1, todayInstance));
        await calendarOnSearch.selectDynamicCalendarConditionBtn('Yesterday');
        // validate in selected condition
        await since('Select Yesterday, selected condition should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.whichConditionIsSelected())
            .toBe('Yesterday');
        // validate in preview content
        await since('Select Yesterday, preview content should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('from'))
            .toBe('Yesterday: ' + yesterday);
        await since('Select Yesterday, preview content should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('to'))
            .toBe('Yesterday: ' + yesterday);
        // validate in header
        await since('Select Yesterday, days selected should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicDateInputContent())
            .toBe(yesterday);
        // validate in footer
        await since('Select Yesterday, days selected count should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getCalendarSelectedDaysCount())
            .toBe(1);
        // validate in filter panel
        await since('Select Yesterday, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('Yesterday\n' + yesterday);
        await filterOnSearch.applyFilterChanged();
        // validate in filter panel after re-open
        await filterOnSearch.openSearchFilterPanel();
        await since('Select Yesterday, selected date after re-open should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('Yesterday\n' + yesterday);
    });

    it('[TC74473] Global Search - Calendar Filter - Select Dynamic MTD', async () => {
        const month = getStringOfDate(startOfMonth(todayInstance));
        const MTD = month === today ? month : `${month} - ${today}`;
        const diff = diffDays(createDateObj(today), createDateObj(month));
        const DaysCount = diff + 1;
        await calendarOnSearch.selectDynamicCalendarConditionBtn('MTD');
        // validate in selected condition
        await since('Select MTD, selected condition should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.whichConditionIsSelected())
            .toBe('MTD');
        // validate in preview content
        await since('Select MTD, preview content should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('from'))
            .toBe('1st day of this month: ' + month);
        await since('Select MTD, preview content should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('to'))
            .toBe('Today: ' + today);
        // validate in header
        await since('Select MTD, days selected should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicDateInputContent())
            .toBe(MTD);
        // validate in footer
        await since('Select MTD, days selected count should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getCalendarSelectedDaysCount())
            .toBe(DaysCount);
        // validate in filter panel
        await since('Select MTD, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('MTD\n' + MTD);
        await filterOnSearch.applyFilterChanged();
        // validate in filter panel after re-open
        await filterOnSearch.openSearchFilterPanel();
        await since('Select MTD, selected date after re-open should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('MTD\n' + MTD);
    });

    it('[TC74474] Global Search - Calendar Filter - Select Dynamic QTD', async () => {
        const quarter = getStringOfDate(startOfQuarter(todayInstance));
        const QTD = quarter === today ? quarter : `${quarter} - ${today}`;
        const diff = diffDays(createDateObj(today), createDateObj(quarter));
        const DaysCount = diff + 1;
        await calendarOnSearch.selectDynamicCalendarConditionBtn('QTD');
        // validate in selected condition
        await since('Select QTD, selected condition should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.whichConditionIsSelected())
            .toBe('QTD');
        // validate in preview content
        await since('Select QTD, preview content should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('from'))
            .toBe('1st day of this quarter: ' + quarter);
        await since('Select QTD, preview content should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('to'))
            .toBe('Today: ' + today);
        // validate in header
        await since('Select QTD, days selected should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicDateInputContent())
            .toBe(QTD);
        // validate in footer
        await since('Select QTD, days selected count should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getCalendarSelectedDaysCount())
            .toBe(DaysCount);
        // validate in filter panel
        await since('Select QTD, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('QTD\n' + QTD);
        await filterOnSearch.applyFilterChanged();
        // validate in filter panel after re-open
        await filterOnSearch.openSearchFilterPanel();
        await since('Select QTD, selected date after re-open should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('QTD\n' + QTD);
    });

    it('[TC74557] Global Search - Calendar Filter - Select Dynamic YTD', async () => {
        const year = getStringOfDate(startOfYear(todayInstance));
        const YTD = year === today ? year : `${year} - ${today}`;
        const diff = diffDays(createDateObj(today), createDateObj(year));
        const DaysCount = diff + 1;
        await calendarOnSearch.selectDynamicCalendarConditionBtn('YTD');
        // validate in selected condition
        await since('Select YTD, selected condition should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.whichConditionIsSelected())
            .toBe('YTD');
        // validate in preview content
        await since('Select YTD, preview content should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('from'))
            .toBe('1st day of this year: ' + year);
        await since('Select YTD, preview content should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('to'))
            .toBe('Today: ' + today);
        // validate in header
        await since('Select YTD, days selected should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicDateInputContent())
            .toBe(YTD);
        // validate in footer
        await since('Select YTD, days selected count should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getCalendarSelectedDaysCount())
            .toBe(DaysCount);
        // validate in filter panel
        await since('Select YTD, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('YTD\n' + YTD);
        await filterOnSearch.applyFilterChanged();
        // validate in filter panel after re-open
        await filterOnSearch.openSearchFilterPanel();
        await since('Select YTD, selected date after re-open should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('YTD\n' + YTD);
    });

    it('[TC74476] Global Search - Calendar Filter - Select Dynamic Last /Next X days', async () => {
        const L = getStringOfDate(addDays(-2, todayInstance));
        const Y = getStringOfDate(addDays(-1, todayInstance));
        const LAST_2_DAYS = `${L} - ${Y}`;
        const T = getStringOfDate(startOfWeek(addWeeks(1, todayInstance)));
        const N = getStringOfDate(endOfWeek(addWeeks(3, todayInstance)));
        const NEXT_3_WEEKS = `${T} - ${N}`;
        const LM = getStringOfDate(startOfMonth(addMonths(-4, todayInstance)));
        const EM = getStringOfDate(endOfMonth(addMonths(-1, todayInstance)));
        const LAST_4_MONTHS = `${LM} - ${EM}`;
        const LQ = getStringOfDate(startOfQuarter(addMonths(-15, todayInstance)));
        const EQ = getStringOfDate(endOfQuarter(addMonths(-3, todayInstance)));
        const LAST_5_QUARTERS = `${LQ} - ${EQ}`;
        const NY = getStringOfDate(startOfYear(addYears(1, todayInstance)));
        const EY = getStringOfDate(endOfYear(addYears(6, todayInstance)));
        const NEXT_6_YEARS = `${NY} - ${EY}`;
        const diff = diffDays(createDateObj(EY), createDateObj(NY));
        const DaysCount = diff + 1;
        await calendarOnSearch.selectDynamicCalendarConditionBtn('Last 7 Days');
        // select LAST_2_DAYS
        await calendarOnSearch.inputDynamicCalenderCondition({ leftOpt: 'Last', number: 2, rightOpt: 'Days' });
        // validate in selected condition
        await since('Select Last 2 Days, selected condition should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.whichConditionIsSelected())
            .toBe('Last 2 Days');
        // validate in preview content
        await since('Select Last 2 Days, preview content should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('from'))
            .toBe(L);
        await since('Select Last 2 Days, preview content should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('to'))
            .toBe(Y);
        // validate in header
        await since('Select Last 2 Days, days selected should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicDateInputContent())
            .toBe(LAST_2_DAYS);
        // validate in footer
        await since('Select Last 2 Days, days selected count should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getCalendarSelectedDaysCount())
            .toBe(2);
        // validate in filter panel
        await since('Select Last 2 Days, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('Last 2 Days\n' + LAST_2_DAYS);
        // select Next_3_WEEKS
        await calendarOnSearch.selectDynamicCalendarConditionBtn('Last 7 Days');
        await calendarOnSearch.inputDynamicCalenderCondition({ leftOpt: 'Next', number: 3, rightOpt: 'Weeks' });
        // validate in selected condition
        await since('Select Next 3 Weeks, selected condition should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.whichConditionIsSelected())
            .toBe('Next 3 Weeks');
        // validate in preview content
        await since('Select Next 3 Weeks, preview content should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('from'))
            .toBe(T);
        await since('Select Next 3 Weeks, preview content should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('to'))
            .toBe(N);
        // validate in header
        await since('Select Next 3 Weeks, days selected should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicDateInputContent())
            .toBe(NEXT_3_WEEKS);
        // validate in footer
        await since('Select Next 3 Weeks, days selected count should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getCalendarSelectedDaysCount())
            .toBe(21);
        // validate in filter panel
        await since('Select Next 3 Weeks, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('Next 3 Weeks\n' + NEXT_3_WEEKS);
        await filterOnSearch.applyFilterChanged();
        // validate in filter panel after re-open
        await filterOnSearch.openSearchFilterPanel();
        await since('Select Next 3 Weeks, selected date after reopen should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('Next 3 Weeks\n' + NEXT_3_WEEKS);
        await filterOnSearch.openFilterDetailPanel('Last Updated');
        await calendarOnSearch.openCalendarTypeSelector();
        await calendarOnSearch.selectCalendarFilterTypeOption('Dynamic');
        // select LAST_4_MONTHS
        await calendarOnSearch.selectDynamicCalendarConditionBtn('Last 7 Days');
        await calendarOnSearch.inputDynamicCalenderCondition({ leftOpt: 'Last', number: 4, rightOpt: 'Months' });
        // validate in header
        await since('Select Last 4 Months, days selected should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicDateInputContent())
            .toBe(LAST_4_MONTHS);
        // select LAST_5_QUARTERS
        await calendarOnSearch.selectDynamicCalendarConditionBtn('Last 7 Days');
        await calendarOnSearch.inputDynamicCalenderCondition({ leftOpt: 'Last', number: 5, rightOpt: 'Quarters' });
        // validate in preview content
        await since('Select Last 5 Quarters, preview content should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('from'))
            .toBe(LQ);
        await since('Select Last 5 Quarters, preview content should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('to'))
            .toBe(EQ);
        // validate in filter panel
        await since('Select Last 5 Quarters, selected date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('Last 5 Quarters\n' + LAST_5_QUARTERS);
        // select NEXT_6_YEARS
        await calendarOnSearch.selectDynamicCalendarConditionBtn('Last 7 Days');
        await calendarOnSearch.inputDynamicCalenderCondition({ leftOpt: 'Next', number: 6, rightOpt: 'Years' });
        // validate in header
        await since('Select Next 6 Years, days selected should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicDateInputContent())
            .toBe(NEXT_6_YEARS);
        // validate in footer
        await since('Select Next 6 Years, days selected count should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getCalendarSelectedDaysCount())
            .toBe(DaysCount);
    });

    it('[TC74477] Global Search - Calendar Filter - Select Dynamic Custom Fixed date', async () => {
        await calendarOnSearch.selectDynamicCalendarConditionBtn('Custom');
        await since('Select Custom, selected condition should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.whichConditionIsSelected())
            .toBe('Custom');
        await since('By default, the custom filter of from should be fixed date')
            .expect(await calendarOnSearch.isFixedDate('from'))
            .toBe(true);
        await since('By default, the custom filter of to should be fixed date')
            .expect(await calendarOnSearch.isFixedDate('to'))
            .toBe(true);
        await since('By default, there are #{expected} days selected, instead we have #{actual}')
            .expect(await calendarOnSearch.getCalendarSelectedDaysCount())
            .toBe(0);
        await takeScreenshotByElement(calendarOnSearch.getCalendarPanel(), 'TC74477', 'Custom: Fixed Date');

        // Set fixed date by date input widget
        await calendarOnSearch.setInputBoxDate({
            customMonth: 9,
            customDay: 5,
            customYear: 2020,
            flag: 'from',
            dynamic: true,
        });
        await since('Custom Date Preview (from) should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('from'))
            .toBe('Fixed Date: 09/05/2020');
        await since('After setting, the custom filter (from) should still be fixed date')
            .expect(await calendarOnSearch.isFixedDate('from'))
            .toBe(true);
        await since('After setting, the date should be filtered from #{expected}, instead we have #{actual}')
            .expect(await calendarOnSearch.getDynamicDateInputContent('from'))
            .toBe(await calendarOnSearch.getDynamicPreviewContentDate('from'));
        await since('After setting, the date should be filtered by #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe(await calendarOnSearch.getDynamicDateInputContent());

        // Set fixed date by calendar widget
        await calendarOnSearch.openDynamicCustomDatePicker('to');
        await calendarOnSearch.selectDate('November', 21, 2020, { popover: true });

        await since('Custom Date Preview (from) should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('to'))
            .toBe('Fixed Date: 11/21/2020');
        await since('After setting, the custom filter (to) should still be fixed date')
            .expect(await calendarOnSearch.isFixedDate('to'))
            .toBe(true);
        await since('After setting, the date should be filtered from #{expected}, instead we have #{actual}')
            .expect(await calendarOnSearch.getDynamicDateInputContent('to'))
            .toBe(await calendarOnSearch.getDynamicPreviewContentDate('to'));
        await since('After setting, there are #{expected} days selected, instead we have #{actual}')
            .expect(await calendarOnSearch.getCalendarSelectedDaysCount())
            .toBe(78);
        await takeScreenshotByElement(
            calendarOnSearch.getCalendarPanel(),
            'TC74477',
            'Custom: Set Fixed Date by Calendar Picker Widget'
        );
        await since('After setting, the date should be filtered by #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe(await calendarOnSearch.getDynamicDateInputContent());

        await filterOnSearch.applyFilterChanged();
        await filterOnSearch.openSearchFilterPanel();
        await filterOnSearch.openFilterDetailPanel('Last Updated');
        await since('After apply, the filter date should be #{expected}, instead we have #{actual} ')
            .expect(await filterOnSearch.getCalendarFilterSummary())
            .toBe('09/05/2020 - 11/21/2020');
    });

    it('[TC74478] Global Search - Calendar Filter - Select Dynamic Custom Plus/Minus X days', async () => {
        await calendarOnSearch.selectDynamicCalendarConditionBtn('Custom');
        await since('Select Custom, selected condition should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.whichConditionIsSelected())
            .toBe('Custom');
        await since('By default, the custom filter of from should be fixed date')
            .expect(await calendarOnSearch.isFixedDate('from'))
            .toBe(true);
        await since('By default, the custom filter of to should be fixed date')
            .expect(await calendarOnSearch.isFixedDate('to'))
            .toBe(true);
        await since('By default, there are #{expected} days selected, instead we have #{actual}')
            .expect(await calendarOnSearch.getCalendarSelectedDaysCount())
            .toBe(0);

        // Set custom date (to) as Today Plus 1 Months
        await calendarOnSearch.clickFixedDateCheckbox('to');
        await since('Unchecked Fixed Date, the custom filter of to should be custom date')
            .expect(await calendarOnSearch.isFixedDate('to'))
            .toBe(false);
        await calendarOnSearch.openDynamicCalenderConditionPicker('to');
        await calendarOnSearch.inputDynamicCalenderCondition({
            leftOpt: 'Plus',
            number: 1,
            rightOpt: 'Months',
            custom: true,
            flag: 'to',
        });
        // const expectedDateTo = getStringOfDate(addMonths(1, today));
        // await since('Custom Date Preview (to) should be #{expected}, instead we have #{actual} ')
        //     .expect(await calendarOnSearch.getDynamicPreviewContent('to'))
        //     .toBe(`Today Plus 1 Months: ${expectedDateTo}`);
        // await since('After setting, there are #{expected} days selected, instead we have #{actual}')
        //     .expect(await calendarOnSearch.getCalendarSelectedDaysCount())
        //     .toBe(dayCount(expectedDateTo, await calendarOnSearch.getDynamicDateInputContent('from')));
        // await since('After setting, the date should be filtered by #{expected}, instead we have #{actual} ')
        //     .expect(await filterOnSearch.getCalendarFilterSummary())
        //     .toBe(await calendarOnSearch.getDynamicDateInputContent());

        // // Set custom date (from) as Today Minus 100 Days
        // await calendarOnSearch.clickFixedDateCheckbox('from');
        // await since('Unchecked Fixed Date, the custom filter of from should be custom date')
        //     .expect(await calendarOnSearch.isFixedDate('from'))
        //     .toBe(false);
        // await calendarOnSearch.openDynamicCalenderConditionPicker('from');
        // await calendarOnSearch.inputDynamicCalenderCondition({
        //     leftOpt: 'Minus',
        //     number: 100,
        //     rightOpt: 'Days',
        //     custom: true,
        //     flag: 'from',
        // });
        // const expectedDateFrom = getStringOfDate(addDays(-100, today));
        // await since('Custom Date Preview (to) should be #{expected}, instead we have #{actual} ')
        //     .expect(await calendarOnSearch.getDynamicPreviewContent('from'))
        //     .toBe(`Today Minus 100 Days: ${expectedDateFrom}`);
        // await since('After setting, there are #{expected} days selected, instead we have #{actual}')
        //     .expect(await calendarOnSearch.getCalendarSelectedDaysCount())
        //     .toBe(dayCount(await calendarOnSearch.getDynamicDateInputContent('to'), expectedDateFrom));
        // await since('After setting, the date should be filtered by #{expected}, instead we have #{actual} ')
        //     .expect(await filterOnSearch.getCalendarFilterSummary())
        //     .toBe(await calendarOnSearch.getDynamicDateInputContent());

        // await filterOnSearch.applyFilterChanged();
        // await filterOnSearch.openSearchFilterPanel();
        // await filterOnSearch.openFilterDetailPanel('Last Updated');
        // await since('After apply, the filter date should be #{expected}, instead we have #{actual} ')
        //     .expect(await filterOnSearch.getCalendarFilterSummary())
        //     .toBe(`${expectedDateFrom} - ${expectedDateTo}`);
    });

    it('[TC74479] Global Search - Calendar Filter - Dynamic date error handling ', async () => {
        await calendarOnSearch.selectDynamicCalendarConditionBtn('Custom');
        await since('Select Custom, selected condition should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.whichConditionIsSelected())
            .toBe('Custom');

        // Set invalid from date by date input widget (from > to)
        await calendarOnSearch.setInputBoxDate({
            customMonth: 12,
            customDay: 31,
            customYear: 2050,
            flag: 'from',
            dynamic: true,
        });
        await since('Custom Date Preview (from) should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('from'))
            .toBe('Fixed Date: 12/31/2050');
        await since(
            'From date should be less than To date, so there should be an error message, #{expected}, present, instead we have #{actual} '
        )
            .expect(await calendarOnSearch.getWarningMsg())
            .toBe('From date should not be after To date');
        await since(
            'From date should be less than To date, so there should be an error message, #{expected}, present, instead we have #{actual} '
        )
            .expect(await filterOnSearch.isWarningDisplayOnApply())
            .toBe(true);
        await takeScreenshotByElement(filterOnSearch.getSearchFilterDropdownPanel(), 'TC74479', 'Invalid Input - 1', { tolerance: 0.2 });
        await calendarOnSearch.clearAll();

        // Set invalid from date by calendar widget (to < from)
        await calendarOnSearch.openDynamicCustomDatePicker('to');
        await calendarOnSearch.selectDate('January', 31, 2000, { popover: true });

        await since('Custom Date Preview (to) should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('to'))
            .toBe('Fixed Date: 01/31/2000');
        await since(
            'From date should be less than To date, so there should be an error message, #{expected}, present, instead we have #{actual} '
        )
            .expect(await calendarOnSearch.getWarningMsg())
            .toBe('From date should not be after To date');
        await since(
            'From date should be less than To date, so there should be an error message, #{expected}, present, instead we have #{actual} '
        )
            .expect(await filterOnSearch.isWarningDisplayOnApply())
            .toBe(true);
        await calendarOnSearch.clearAll();

        // Set invalid from date by dynamic calendar condition widget (from > to)
        await calendarOnSearch.clickFixedDateCheckbox('from');
        await since('Unchecked Fixed Date, the custom filter of from should be custom date')
            .expect(await calendarOnSearch.isFixedDate('from'))
            .toBe(false);
        await calendarOnSearch.openDynamicCalenderConditionPicker('from');
        await calendarOnSearch.inputDynamicCalenderCondition({
            leftOpt: 'Plus',
            number: 100,
            rightOpt: 'Months',
            custom: true,
            flag: 'from',
        });
        const expectedDateTo = getStringOfDate(addMonths(100, today));
        await since('Custom Date Preview (from) should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('from'))
            .toBe(`Today Plus 100 Months: ${expectedDateTo}`);
        await since(
            'From date should be less than To date, so there should be an error message, #{expected}, present, instead we have #{actual} '
        )
            .expect(await calendarOnSearch.getWarningMsg())
            .toBe('From date should not be after To date');
        await since(
            'From date should be less than To date, so there should be an error message, #{expected}, present, instead we have #{actual} '
        )
            .expect(await filterOnSearch.isWarningDisplayOnApply())
            .toBe(true);
        await calendarOnSearch.clearAll();

        // Set invalid from date by dynamic calendar condition widget (to < from)
        await calendarOnSearch.clickFixedDateCheckbox('to');
        await since('Unchecked Fixed Date, the custom filter of to should be custom date')
            .expect(await calendarOnSearch.isFixedDate('to'))
            .toBe(false);
        await calendarOnSearch.openDynamicCalenderConditionPicker('to');
        await calendarOnSearch.inputDynamicCalenderCondition({
            leftOpt: 'Minus',
            number: 50000,
            rightOpt: 'Days',
            custom: true,
            flag: 'to',
        });
        const expectedDateFrom = getStringOfDate(addDays(-50000, today));
        await since('Custom Date Preview (to) should be #{expected}, instead we have #{actual} ')
            .expect(await calendarOnSearch.getDynamicPreviewContent('to'))
            .toBe(`Today Minus 50000 Days: ${expectedDateFrom}`);
        await since(
            'From date should be less than To date, so there should be an error message, #{expected}, present, instead we have #{actual} '
        )
            .expect(await calendarOnSearch.getWarningMsg())
            .toBe('From date should not be after To date');
        await since(
            'From date should be less than To date, so there should be an error message, #{expected}, present, instead we have #{actual} '
        )
            .expect(await filterOnSearch.isWarningDisplayOnApply())
            .toBe(true);

        await filterOnSearch.hover({ elem: await filterOnSearch.getFilterApplyBtn() });
        await takeScreenshotByElement(
            filterOnSearch.getSearchFilterDropdownPanel(),
            'TC74479',
            'Apply button should be disabled'
        );
    });
});
export const config = specConfiguration;
