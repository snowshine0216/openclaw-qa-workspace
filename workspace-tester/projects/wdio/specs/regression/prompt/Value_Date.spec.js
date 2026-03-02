import { customCredentials } from '../../../constants/index.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import {
    addDays,
    addBusinessDays,
    addMonths,
    addWeeks,
    addYears,
    endOfMonth,
    endOfQuarter,
    endOfWeek,
    endOfYear,
    getStringOfDate,
    getToday,
    startOfMonth,
    startOfQuarter,
    startOfWeek,
    startOfYear,
    getDayOfWeek,
    getDayAfterDate,
} from '../../../utils/DateUtil.js';

const specConfiguration = { ...customCredentials('_prompt') };
const project = {
    id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
    name: 'MicroStrategy Tutorial',
};

/**
 * Confluence Page:
 * https://microstrategy.atlassian.net/wiki/spaces/TTAWC/pages/822217846/Value+-+Date+Time
 */
describe('Value Prompt - Date&Time', () => {
    const dossier1 = {
        id: '745CBC1D4AEC28CE9602C593E993DDD6',
        name: 'Value_Date Prompt-Required-Min/Max',
        project,
    };
    const dossier2 = {
        id: '858F596740AE685C938A8F93E6A5DE12',
        name: 'Value_DateTime Prompt-Not required',
        project,
    };
    const dossier3 = {
        id: 'F1F2ACD6498333A2884A9FA28052EC49',
        name: 'Value_Date Prompt-Required_DefaultDynamicDate',
        project,
    };

    const dossier4 = {
        id: 'F520199645B3D9370FC03BA9A27C0278',
        name: '(Auto) Value Prompt_with DateTime Prompt_Dynamic date + Static time as default',
        project,
    };

    const dossier5 = {
        id: '196FC1864942DC07B17DE5A62A209125',
        name: '(Auto) Value Prompt_with DateTime Prompt_Static as default_WithPersonalAnswer',
        project,
    };

    const promptName = 'Date';
    const browserWindow = {
        
        width: 1600,
        height: 1000,
    };
    const { credentials } = specConfiguration;
    const today = getToday();
    let prompt, calendar;
    let { loginPage, promptObject, grid, rsdGrid, libraryPage, promptEditor, dossierPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        calendar = promptObject.calendar;
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    /**
     * Check Points:
     * 1 Initial rendering for date prompt editor (click on the drop-down to show the calendar window)
     * 2 change month/year via /and check UI for each action
     * 3 check close button works when click on it without any modification for current prompt answer
     * 4 check calendar window disappears automatically
     * 5 choose Today dynamic one and check view summary
     */
    it('[TC60348] Value prompt with Calendar style - Check calendar window', async () => {
        await resetDossierState({ credentials, dossier: dossier1 });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(promptName);

        // Calendar can be open and closed
        await calendar.openCalendar(prompt);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC60348', 'CalendarGUI');
        await calendar.closeCalendar(prompt);
        await since('Calendar Editor should be closed after clicking "Close"')
            .expect(await calendar.isCalendarOpen(prompt))
            .toBe(false);
        // Check Previous Month/Next Month/Previous Year/Last Year/Today icon
        await calendar.openCalendar(prompt);
        await calendar.switchToLastMonth(prompt);
        await since(
            'After clicking previous month button, current month is supposed to be #{expected}, instead we get #{actual}'
        )
            .expect(await calendar.getMonthValue(prompt))
            .toBe('August');
        await since(
            'After clicking previous month button, current year is supposed to be #{expected}, instead we get #{actual}'
        )
            .expect(await calendar.getYearValue(prompt))
            .toBe('2016');
        await calendar.switchToLastYear(prompt);
        await since(
            'After clicking previous year button, current month is supposed to be #{expected}, instead we get #{actual}'
        )
            .expect(await calendar.getMonthValue(prompt))
            .toBe('August');
        await since(
            'After clicking previous year button, current year is supposed to be #{expected}, instead we get #{actual}'
        )
            .expect(await calendar.getYearValue(prompt))
            .toBe('2015');
        await calendar.switchToNextMonth(prompt);
        await since('After clicking next month button, current month is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getMonthValue(prompt))
            .toBe('September');
        await since('After clicking next month button, current year is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getYearValue(prompt))
            .toBe('2015');
        await calendar.switchToNextYear(prompt);
        await since('After clicking next year button, current month is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getMonthValue(prompt))
            .toBe('September');
        await since('After clicking next year button, current year is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getYearValue(prompt))
            .toBe('2016');
        await calendar.selectToday(prompt);
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC60348', 'Today', {
            tolerance: 1,
        });
        await promptEditor.cancelEditor();
    });

    /**
     * Check Points:
     * 1 reset and change prompt answer via dropdown-list for month, textbox for year,check view summary
     * 2 check valid/invalid input for year textbox
     *      number
     *      string
     *      special keywords
     * 3 change prompt answer with to check warning msg and error alert
     *      answer < min
     *      min<= answer <= max
     *      answer>max
     * 4 resolve a valid prompt answer and check view summary
     * 5 run dossier and check final data
     */
    it('[TC60349] Value prompt with Calendar style - Check date limitation and answer prompt', async () => {
        await resetDossierState({ credentials, dossier: dossier1 });
        await libraryPage.openDossierNoWait(dossier1.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(promptName);

        // input year
        await calendar.openCalendar(prompt);
        await calendar.clearAndInputYear(prompt, '2018');
        await calendar.openMonthDropDownMenu(prompt);
        await calendar.selectMonth(prompt, 'January');
        await since('After selecting 2018 Jan, current month is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getMonthValue(prompt))
            .toBe('January');
        await since('After selecting 2018 Jan, current year is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getYearValue(prompt))
            .toBe('2018');
        
        // answer > max
        await calendar.selectDay(prompt, '16');
        await since('Warning message of selecting 2018 Feb 16 is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe(
                'You have entered a value that is greater than the one allowed for this prompt. Please enter a lesser value.'
            );
        await since('Calendar Editor should be closed after choosing date')
            .expect(await calendar.isCalendarOpen(prompt))
            .toBe(false);
        // answer < min
        await calendar.openCalendar(prompt);
        await calendar.clearAndInputYear(prompt, '2016');
        await calendar.selectDay(prompt, '13');
        await since('Warning message of selecting 2016 Feb 13 is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe(
                'You have entered a value that is less than the one allowed for this prompt. Please enter a greater value.'
            );
        // min<= answer <= max
        await calendar.openCalendar(prompt);
        await calendar.openMonthDropDownMenu(prompt);
        await calendar.selectMonth(prompt, 'September');
        await calendar.selectDay(prompt, '22');
        await since('Warning message of selecting 2016 Sep 22 is supposed to be disappeared.}')
            .expect(await promptObject.getWarningMsg(prompt))
            .toBe('');

        // Check prompt summary and run dossier
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('current prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary(promptName))
            .toBe('9/22/2016');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await since('The first element of Day is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Day' }))
            .toBe('9/23/2016');
        await since('The first element of Profit is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Profit' }))
            .toBe('$4,494');
    });

    /**
     * Check Points:
     * 1 Initial rendering for date prompt editor (click on the drop-down to show the calendar window)
     * 2 change date value first then change time text box
     * 3 check valid/invalid input for time textbox and check view summary
     *      number
     *      string
     *      special keywords
     * 4 run dossier and check final data
     */
    it('[TC60350] Value prompt with Calendar style - Answer prompt with datetime', async () => {
        await resetDossierState({ credentials, dossier: dossier2 });
        await libraryPage.openDossierNoWait(dossier2.name);
        await promptEditor.waitForEditor();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC60350', 'Datetime');
        prompt = await promptObject.getPromptByName(promptName);

        // check hour input
        await calendar.clearAndInputHour(prompt, '35');
        await calendar.clickMinute(prompt);
        await since('After inputing 35 for Hour, current Hour is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getHourValue(prompt))
            .toBe('11');
        await since('After inputing 35 for Hour, current Minute is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getMinuteValue(prompt))
            .toBe('35');
        await since('After inputing 35 for Hour, current Second is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getSecondValue(prompt))
            .toBe('07');
        // invalid input
        await calendar.clearAndInputHour(prompt, 'abc');
        await calendar.clickMinute(prompt);
        await since('After inputing abc for Hour, current Hour is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getHourValue(prompt))
            .toBe('00');
        await since('After inputing abc for Hour, current Minute is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getMinuteValue(prompt))
            .toBe('35');
        await since('After inputing abc for Hour, current Second is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getSecondValue(prompt))
            .toBe('07');
        // check minute input
        await calendar.clearAndInputMinute(prompt, '98');
        await calendar.clickSecond(prompt);
        await since('After inputing 98 for Minute, current Hour is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getHourValue(prompt))
            .toBe('01');
        await since('After inputing 98 for Minute, current Minute is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getMinuteValue(prompt))
            .toBe('38');
        await since('After inputing 98 for Minute, current Second is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getSecondValue(prompt))
            .toBe('07');
        // invalid input
        await calendar.clearAndInputMinute(prompt, 'abc');
        await calendar.clickSecond(prompt);
        await since('After inputing abc for Minute, current Hour is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getHourValue(prompt))
            .toBe('01');
        await since('After inputing abc for Minute, current Minute is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getMinuteValue(prompt))
            .toBe('00');
        await since('After inputing abc for Minute, current Second is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getSecondValue(prompt))
            .toBe('07');
        // check second input
        await calendar.clearAndInputSecond(prompt, '136');
        await calendar.clickHour(prompt);
        await since('After inputing 136 for Second, current Hour is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getHourValue(prompt))
            .toBe('01');
        await since('After inputing 136 for Second, current Minute is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getMinuteValue(prompt))
            .toBe('02');
        await since('After inputing 136 for Second, current Second is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getSecondValue(prompt))
            .toBe('16');
        // invalid input
        await calendar.clearAndInputSecond(prompt, 'abc');
        await calendar.clickHour(prompt);
        await since('After inputing abc for Second, current Hour is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getHourValue(prompt))
            .toBe('01');
        await since('After inputing abc for Second, current Minute is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getMinuteValue(prompt))
            .toBe('02');
        await since('After inputing abc for Second, current Second is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getSecondValue(prompt))
            .toBe('00');
        // time is not affected by choosing date
        await calendar.openCalendar(prompt);
        await calendar.clearAndInputYear(prompt, '2014');
        await calendar.openMonthDropDownMenu(prompt);
        await calendar.selectMonth(prompt, 'January');
        await calendar.selectDay(prompt, '1');
        await since('After changing date, current Hour is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getHourValue(prompt))
            .toBe('01');
        await since('After changing date, current Minute is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getMinuteValue(prompt))
            .toBe('02');
        await since('After changing date, current Second is supposed to be #{expected}, instead we get #{actual}')
            .expect(await calendar.getSecondValue(prompt))
            .toBe('00');
        // check prompt summary
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('current prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary(promptName))
            .toBe('1/1/2014 1:02:00 AM');
        await promptEditor.toggleViewSummary();
        // change time to pm
        await calendar.clearAndInputHour(prompt, '13');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('current prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary(promptName))
            .toBe('1/1/2014 1:02:00 PM');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Daytime', 'Metrics', '']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['1/1/2014 12:00:00 AM', 'Profit', '$2,324']);
    });

    it('[TC65944] Value(Date) prompt - Default Dynamic prompt answer', async () => {
        await resetDossierState({ credentials, dossier: dossier3 });
        await libraryPage.openDossierNoWait(dossier3.name);
        await promptEditor.waitForEditor();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC65944', 'DefaultDynamicDate');
        // run with default data
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkDynamicSummary(promptName))
            .toContain('Today minus 1 day');

        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // re-prompt and change data
        await promptEditor.reprompt();
        prompt = await promptObject.getPromptByName(promptName);
        await calendar.openCalendar(prompt);
        await calendar.toggleDynamicCalendar(prompt);
        await calendar.selectYearAndMonth(prompt, '2014', 'January');
        await calendar.selectDay(prompt, '1');
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC65944', 'YourSelection');
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('current prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary(promptName))
            .toBe('1/1/2014');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(1))
            .toEqual(['Day', 'Metrics', 'Profit']);
        await since('The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData(2))
            .toEqual(['1/1/2014', '$2,324']);
        // re-prompt, default dynamic date is gone
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('current prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkTextSummary(promptName))
            .toBe('1/1/2014');
        await promptEditor.toggleViewSummary();
        await takeScreenshotByElement(promptEditor.getPromptEditor(), 'TC65944', 'NoDefaultAnswer');
        await promptEditor.cancelEditor();
    });

    it('[TC65944_01] Value(Dateime) prompt - Default Dynamic prompt answer', async () => {
        const todayMinus2Days_excludeWeekends = getStringOfDate(addBusinessDays(-3,today), false);
        const todayMinus3Days_excludeWeekends = getStringOfDate(addBusinessDays(-3,getStringOfDate(addDays(-1, today))), false);
        const todayPlus1Day =getStringOfDate(addDays(1, today));
        const firstSundayOftodayPlus1Day = getDayOfWeek( {
            index: 'first',
            weekday: 'Sunday',
            date: todayPlus1Day,
        }, false);
        const firstSundayOftodayMinus2Days_ExcludeWeekends = getDayOfWeek( {
            index: 'first',
            weekday: 'Monday',
            date: todayMinus2Days_excludeWeekends,
        }, false);
        const firstSundayOftodayMinus3Days_ExcludeWeekends = getDayOfWeek( {
            index: 'first',
            weekday: 'Monday',
            date: todayMinus3Days_excludeWeekends,
        }, false);

        await resetDossierState({ credentials, dossier: dossier4 });
        await libraryPage.openDossierNoWait(dossier4.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(promptName);
        since('current dynamic selection should be #{expected}, instead we get #{actual}')
            .expect(await calendar.isDynamicSelection(prompt))
            .toBe(true);
        // check prompt summary  to be done
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkDynamicSummary(promptName))
            .toContain('First Sunday of the month of (Today plus 1 day)');
        await since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkDynamicSummary(promptName))
            .toContain(firstSundayOftodayPlus1Day);
        // change to other dynamic option and run： days -2 + exclude weekends
        await promptEditor.toggleViewSummary();
        await calendar.openCalendar(prompt);
        since('the dynamic toggle should be #{expected}, instead we get #{actual}', )
            .expect(await calendar.isDynamicToggleOn(prompt))
            .toBe(true);
        await calendar.setOffsetInDynamicCalendar(prompt, {
            period: 'Day',
            offsetOperator: 'Minus',
            directions: 'Up',
            times: '2',
        });
        await calendar.setOffsetInDynamicCalendar(prompt, {
            period: 'Month',
            offsetOperator: 'Plus',
            directions: 'Down',
            times: '1',
        });
        await calendar.checkExcludeWeekendsInDynamicCalendar(prompt);
        since('the resolved date should be #{expected}, instead we get #{actual}', )
            .expect(['The date would be resolved to: ' + firstSundayOftodayMinus2Days_ExcludeWeekends, 'The date would be resolved to: ' + firstSundayOftodayMinus3Days_ExcludeWeekends])
            .toContain(await calendar.getNewResolvedDateInDynamicCalendar(prompt));
        await calendar.clickDoneButtonInDynamicCalendar(prompt);
        since('the prompt textbox value should be #{expected}, instead we get #{actual}', )
            .expect([firstSundayOftodayMinus2Days_ExcludeWeekends, firstSundayOftodayMinus3Days_ExcludeWeekends])
            .toContain(await promptObject.textbox.text(prompt));
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // re-prompt and change data
        await promptEditor.reprompt();
        since('the prompt textbox value should be #{expected}, instead we get #{actual}', )
            .expect(await promptObject.textbox.text(prompt))
            .toBe(firstSundayOftodayMinus2Days_ExcludeWeekends);
        await promptEditor.toggleViewSummary();
        since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkDynamicSummary(promptName))
            .toContain('First Monday of the month of (Today minus 3 days)');
        await promptEditor.toggleViewSummary();
        // change to other dynamic option and run： days -2 + exclude weekends + month of year
        const secondMondayOfMarch_todayMinus2Days_excludeWeekends = getDayOfWeek( {
            index: 'second',
            weekday: 'Monday',
            month: 'March',
            date: todayMinus2Days_excludeWeekends,
        }, false);
        await calendar.openCalendar(prompt);
        await calendar.selectAdjustmentPeriodInDynamicCalendar(prompt, 'Year');
        await calendar.selectDayOfWeekForAdjustmentInDynamicCalendar(prompt, ['Second', 'Monday','March']);
        since('the resolved date should be #{expected}, instead we get #{actual}', )
            .expect(await calendar.getNewResolvedDateInDynamicCalendar(prompt))
            .toBe("The date would be resolved to: " + secondMondayOfMarch_todayMinus2Days_excludeWeekends);
        await calendar.clickDoneButtonInDynamicCalendar(prompt);
        since('the prompt textbox value should be #{expected}, instead we get #{actual}', )
            .expect(await promptObject.textbox.text(prompt))
            .toBe(secondMondayOfMarch_todayMinus2Days_excludeWeekends);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // re-prompt and check prompt answer
        await promptEditor.reprompt();
        // check prompt summary
        await promptEditor.toggleViewSummary();
        await since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkDynamicSummary(promptName))
            .toContain('Second Monday of 3 of the year of (Today minus 3 days)');
        await since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkDynamicSummary(promptName))
            .toContain(secondMondayOfMarch_todayMinus2Days_excludeWeekends);
        
        // change to a static one 
        await promptEditor.toggleViewSummary();
        await calendar.openCalendar(prompt);
        await calendar.toggleDynamicCalendar(prompt);
        await calendar.selectYearAndMonth(prompt, '2025', 'October');
        await calendar.selectDay(prompt, '15');
        since('current dynamic selection should be #{expected}, instead we get #{actual}')
            .expect(await calendar.isDynamicSelection(prompt))
            .toBe(false);
        // check prompt summary  to be done
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        await since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkDynamicSummary(promptName))
            .toContain('10/15/2025');
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        since('current dynamic selection should be #{expected}, instead we get #{actual}')
            .expect(await calendar.isDynamicSelection(prompt))
            .toBe(false);
        since('the prompt textbox value should be #{expected}, instead we get #{actual}', )
            .expect(await promptObject.textbox.text(prompt))
            .toBe('10/15/2025');
    });

    it('[TC65944_02] Value(Dateime) prompt - Default static prompt answer', async () => {
        await resetDossierState({ credentials, dossier: dossier5 });
        await libraryPage.openDossierNoWait(dossier5.name);
        await promptEditor.waitForEditor();
        prompt = await promptObject.getPromptByName(promptName);
        since('current dynamic selection should be #{expected}, instead we get #{actual}')
            .expect(await calendar.isDynamicSelection(prompt))
            .toBe(false);
        // check prompt summary to be done
        await promptEditor.toggleViewSummary();
        await promptEditor.waitForSummaryItem(promptName);
        since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkDynamicSummary(promptName))
            .toBe('10/14/2025');
        // change to other dynamic option and run： days -6 + month + 2 + exclude weekends
        const todayMinus6Days_Plus2Months_excludeWeekends = getStringOfDate(addBusinessDays(-6, getStringOfDate(addMonths(2, today), false)), false);
        await promptEditor.toggleViewSummary();
        await calendar.openCalendar(prompt);
        since('the dynamic toggle should be #{expected}, instead we get #{actual}', )
            .expect(await calendar.isDynamicToggleOn(prompt))
            .toBe(false);
        await calendar.toggleDynamicCalendar(prompt);
        await calendar.setOffsetInDynamicCalendar(prompt, {
            period: 'Day',
            offsetOperator: 'Minus',
            directions: 'Up',
            times: '6',
        });
        await calendar.setOffsetInDynamicCalendar(prompt, {
            period: 'Month',
            offsetOperator: 'Plus',
            directions: 'Up',
            times: '2',
        });
        await calendar.checkExcludeWeekendsInDynamicCalendar(prompt);
        since('the resolved date should be #{expected}, instead we get #{actual}', )
            .expect(await calendar.getNewResolvedDateInDynamicCalendar(prompt))
            .toBe("The date would be resolved to: " + todayMinus6Days_Plus2Months_excludeWeekends);
        await calendar.clickDoneButtonInDynamicCalendar(prompt);
        since('the prompt textbox value should be #{expected}, instead we get #{actual}', )
            .expect(await promptObject.textbox.text(prompt))
            .toBe(todayMinus6Days_Plus2Months_excludeWeekends);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        // re-prompt and change data
        await promptEditor.reprompt();
        // since('the prompt textbox value should be #{expected}, instead we get #{actual}', )
        //     .expect([todayMinus6Days_Plus2Months_excludeWeekends, 
        //         getStringOfDate(addBusinessDays(-6, getStringOfDate(addMonths(2, getStringOfDate(addDays(-1, today)), false)), false))])
        //     .toContain(await promptObject.textbox.text(prompt));

        // change to other dynamic option and run： previous + 3 days at the beginning of the quarter
        const daysAfterBegining_Quarter_3days = getDayAfterDate( {
            period: 'Quarter',
            days: 3,
            date: todayMinus6Days_Plus2Months_excludeWeekends,
            isExcludeWeekend: true,
        }, false);
        await calendar.openCalendar(prompt);
        await calendar.checkAdjustmentInDynamicCalendar(prompt);
        await calendar.selectAdjustmentSubtypeInDynamicCalendar(prompt, 'A day after the beginning');
        await calendar.selectAdjustmentPeriodInDynamicCalendar(prompt, 'Quarter');
        await calendar.inputAdjustmentDaysInDynamicCalendar(prompt, '3');
        since('the resolved date should be #{expected}, instead we get #{actual}', )
            .expect(await calendar.getNewResolvedDateInDynamicCalendar(prompt))
            .toBe("The date would be resolved to: " + daysAfterBegining_Quarter_3days);
        await calendar.clickDoneButtonInDynamicCalendar(prompt);
        since('the prompt textbox value should be #{expected}, instead we get #{actual}', )
            .expect(await promptObject.textbox.text(prompt))
            .toBe(daysAfterBegining_Quarter_3days);
        // check prompt summary
        await promptEditor.toggleViewSummary();
        await since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkDynamicSummary(promptName))
            .toContain('Day 3 of the quarter of (Today minus 6 days plus 2 months)');
        await since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkDynamicSummary(promptName))
            .toContain(daysAfterBegining_Quarter_3days);
        
        // change to a static one
        await promptEditor.toggleViewSummary();
        await calendar.openCalendar(prompt);
        await calendar.toggleDynamicCalendar(prompt);
        await calendar.selectYearAndMonth(prompt, '2014', 'November');
        await calendar.selectDay(prompt, '20');
        since('current dynamic selection should be #{expected}, instead we get #{actual}')
            .expect(await calendar.isDynamicSelection(prompt))
            .toBe(false);
        // run and check final answer
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await promptEditor.reprompt();
        await promptEditor.toggleViewSummary();
        since('The prompt answer is supposed to be #{expected}, instead we get #{actual}')
            .expect(await promptEditor.checkDynamicSummary(promptName))
            .toBe('11/20/2014');
        
    });
});

export const config = specConfiguration;
