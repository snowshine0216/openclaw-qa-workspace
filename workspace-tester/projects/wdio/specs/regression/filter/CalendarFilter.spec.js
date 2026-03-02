import resetDossierState from '../../../api/resetDossierState.js';
import QualificationPrompt from '../../../pageObjects/prompt/QualificationPrompt.js';
import {
    addDays,
    addMonths,
    addWeeks,
    addYears,
    endOfMonth,
    endOfQuarter,
    endOfWeek,
    endOfYear,
    getStringOfDate,
    getToday,
    getDayOfWeek,
    startOfMonth,
    startOfQuarter,
    startOfWeek,
    startOfYear,
    addBusinessDays,
    getDayAfterDate,
    getDayPriorToEndOfDate,
    getYearOfDate,
    getDaysDifference,
} from '../../../utils/DateUtil.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';


describe('Dynamic Calendar Filter', () => {
    const dossier = {
        id: '52E3B5064407905330B3AABFAB8A0D8E',
        name: 'Dynamic calendar',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    let { calendarFilter, filterPanel, libraryPage, dossierPage, filterSummaryBar, loginPage, toc, grid, authoringFilters, contentsPanel, libraryAuthoringPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);
    });

    beforeEach(async () => {
         await resetDossierState({
            credentials: browsers.params.credentials,
            dossier,
        });
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'dynamic calendar-Day', pageName: 'Page 1' });
        await filterPanel.openFilterPanel();
    });

    afterEach(async () => {
        // close filter panel
        const isFilterPanelOpen = await filterPanel.isMainPanelOpen();
        if (isFilterPanelOpen) {
            await filterPanel.closeFilterPanelByCloseIcon();
        }
        await dossierPage.goToLibrary();
    });

    it('[TC61499] Verify calendar month days(espcially first day) should show completely without missing', async () => {
        await calendarFilter.openSecondaryPanel('Day');
        await calendarFilter.selectDynamicDateOptions('On');
        // await calendarFilter.selectDateInWidget({monthYear: 'May 2014', day: '10'});
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await calendarFilter.calendarPicker.selectYearAndMonth('2014', 'May');
        await calendarFilter.calendarPicker.selectDay('10');
        await filterPanel.applyAndReopenPanel('Day');

        // 1st day on Sunday in Enlish(US), on X in other locale
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await takeScreenshotByElement(filterPanel.getSecondaryFilterPanel(), 'TC61499', 'CalendarMonthDays-201405');
        await calendarFilter.calendarPicker.switchToNextMonth();
        await calendarFilter.calendarPicker.selectDay('10');
        await filterPanel.applyAndReopenPanel('Day');
        since('the input value should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomOperator())
            .toBe('6/10/2014');
        // choose next year
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await calendarFilter.calendarPicker.switchToNextYear();
        await calendarFilter.calendarPicker.selectDay('10');
        await filterPanel.applyAndReopenPanel('Day');
        since('the input value should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomOperator())
            .toBe('6/10/2015');
        // previous month
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await calendarFilter.calendarPicker.switchToLastMonth();
        await calendarFilter.calendarPicker.selectDay('10');
        await filterPanel.applyAndReopenPanel('Day');
        since('the input value should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomOperator())
            .toBe('5/10/2015');
        // previous year
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await calendarFilter.calendarPicker.switchToLastYear();
        await calendarFilter.calendarPicker.selectDay('10');
        await filterPanel.applyAndReopenPanel('Day');
        since('the input value should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomOperator())
            .toBe('5/10/2014');
        // set a dynamic date to verify
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        const todayMinus2Days_PlusOneMonth_excludeWeekends = getStringOfDate(addBusinessDays(-2,getStringOfDate(addMonths(-144, today))),false);
        const todayMinus2Days_PlusOneMonth_excludeWeekends_offset = getStringOfDate(addBusinessDays(-2,getStringOfDate(addMonths(-144, getStringOfDate(addDays(-1, today))))), false);
        await calendarFilter.calendarPicker.setOffsetInDynamicCalendar({
            period: 'Day',
            offsetOperator: 'Minus',
            directions: 'Up',
            times: '2',
        });
        await calendarFilter.calendarPicker.setOffsetByInputValueInDynamicCalendar({
            period: 'Month',
            offsetOperator: 'Minus',
            value: '144',
        });
        await calendarFilter.calendarPicker.checkExcludeWeekendsInDynamicCalendar();
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        
        // apply and verify
        await filterPanel.applyAndReopenPanel('Day');
        since ('filter panel capsule date should contain #{expected}, instead we have #{actual}')
            .expect([
                todayMinus2Days_PlusOneMonth_excludeWeekends, 
                todayMinus2Days_PlusOneMonth_excludeWeekends_offset])
            .toContain(await calendarFilter.capsuleDateTime('Day'));
        since('the input value should be #{expected}, instead we have #{actual}')
            .expect([
                todayMinus2Days_PlusOneMonth_excludeWeekends, 
                todayMinus2Days_PlusOneMonth_excludeWeekends_offset])
            .toContain(await calendarFilter.dynamicPanel.displayTextOfCustomOperator());
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        since('the resolved date should be #{expected}, instead we get #{actual}', )
            .expect([
                'The date would be resolved to: ' + todayMinus2Days_PlusOneMonth_excludeWeekends, 
                'The date would be resolved to: ' + todayMinus2Days_PlusOneMonth_excludeWeekends_offset])
            .toContain(await calendarFilter.calendarPicker.getNewResolvedDateInDynamicCalendar());
        // close filter panel
        await filterPanel.closeFilterPanelByCloseIcon();
        // since('the grid data after applying filter should be #{expected}, instead we have #{actual}')
        //     .expect(await grid.getOneRowData('Visualization 1', 2))
        //     .toEqual([getStringOfDate(addDays(-1, todayMinus2Days_PlusOneMonth_excludeWeekends), false)]);
        
    });

    it('[TC61498] Verify calendar start week day and date format in different locale', async () => {
        const day_small = '03';
        const day_big = '30';
        const month = '05';
        const year = '2014';
        const date_small = getStringOfDate(await calendarFilter.getI18NFormattedDate(day_small, month, year),false);
        const date_big = getStringOfDate(await calendarFilter.getI18NFormattedDate(day_big, month, year),false);

        await calendarFilter.openSecondaryPanel('Day');
        await calendarFilter.selectDynamicDateOptions('After');
       
        // check date format : small date
        await calendarFilter.dynamicPanel.setCustomOperatorInput(`${month}/${day_small}/${year}`);
        await filterPanel.applyAndReopenPanel('Day');
        await since(
            'The calendar date value and format after apply shoule be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomOperator())
            .toBe(date_small);
        // check date format : big date
        await calendarFilter.dynamicPanel.setCustomOperatorInput(`${month}/${day_big}/${year}`);
        await filterPanel.applyAndReopenPanel('Day');
        await since(
            'The calendar date value and format after apply shoule be "#{expected}", instead we have "#{actual}" '
        )
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomOperator())
            .toBe(date_big);

        // set dynamic date to verify
        const todayMinus2Days_excludeWeekends = getStringOfDate(addBusinessDays(-2, getStringOfDate(addMonths(-144, today)))); 
        const fifthMondayOfMarch_todayMinus2Days_excludeWeekends = getDayOfWeek( {
            index: 'fifth',
            weekday: 'Monday',
            month: 'March',
            date: todayMinus2Days_excludeWeekends,
        }, false);
        const fifthMondayOfMarch_todayMinus2Days_excludeWeekends_offset = getDayOfWeek( {
            index: 'fifth',
            weekday: 'Monday',
            month: 'March',
            date: getStringOfDate(addBusinessDays(-2, getStringOfDate(addMonths(-144, getStringOfDate(addDays(-1, today)))))),
        }, false);

        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        await calendarFilter.calendarPicker.setOffsetInDynamicCalendar({
            period: 'Day',
            offsetOperator: 'Minus',
            directions: 'Up',
            times: '2',
        });
        await calendarFilter.calendarPicker.setOffsetByInputValueInDynamicCalendar({
            period: 'Month',
            offsetOperator: 'Minus',
            value: '144',
        });
        await calendarFilter.calendarPicker.checkExcludeWeekendsInDynamicCalendar();
        await calendarFilter.calendarPicker.checkAdjustmentInDynamicCalendar();
        await calendarFilter.calendarPicker.selectAdjustmentPeriodInDynamicCalendar('Year');
        await calendarFilter.calendarPicker.selectDayOfWeekForAdjustmentInDynamicCalendar(['Fifth', 'Monday','March']);
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        // apply and verify
        await filterPanel.applyAndReopenPanel('Day');
        since ('filter panel capsule dynamic icon display should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.isCapsuleDynamic('Day'))
            .toBe(true);
        since ('filter panel capsule date should contain #{expected}, instead we have #{actual}')
            .expect([
                'After ' + fifthMondayOfMarch_todayMinus2Days_excludeWeekends, 
                'After ' + fifthMondayOfMarch_todayMinus2Days_excludeWeekends_offset])
            .toContain(await calendarFilter.capsuleDateTime('Day'));
        since('the input value should be #{expected}, instead we have #{actual}')
            .expect([
                fifthMondayOfMarch_todayMinus2Days_excludeWeekends, 
                fifthMondayOfMarch_todayMinus2Days_excludeWeekends_offset])
            .toContain(await calendarFilter.dynamicPanel.displayTextOfCustomOperator());
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        since('the resolved date should be #{expected}, instead we get #{actual}', )
            .expect([
                'The date would be resolved to: ' + fifthMondayOfMarch_todayMinus2Days_excludeWeekends, 
                'The date would be resolved to: ' + fifthMondayOfMarch_todayMinus2Days_excludeWeekends_offset])
            .toContain(await calendarFilter.calendarPicker.getNewResolvedDateInDynamicCalendar());
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        // close filter panel
        await filterPanel.closeFilterPanelByCloseIcon();
        since('the grid data after applying filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual([getStringOfDate(addDays(1, fifthMondayOfMarch_todayMinus2Days_excludeWeekends), false)]);
        
    });

    it('[TC67973] Calendar Filter - Last/next month and year on calendar header', async () => {
        await calendarFilter.openSecondaryPanel('Day');
        await calendarFilter.selectDynamicDateOptions('Before');
        // set static date to verify
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await calendarFilter.calendarPicker.selectYearAndMonth('2015', 'December');
        await calendarFilter.calendarPicker.selectDay('15');
        await filterPanel.applyAndReopenPanel('Day');
        since ('filter panel dynamic capsule date should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.isCapsuleDynamic('Day'))
            .toBe(false);
        since ('filter panel capsule date should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.capsuleDateTime('Day'))
            .toBe('Before 12/15/2015');

        // change it to a dynamic date
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        const todayMinus2Days_Minus1Month_excludeWeekends = getStringOfDate(addBusinessDays(-2, addMonths(-144, today)));
        const dayofTuesday = getDayOfWeek( {
            weekday: 'Tuesday',
            date: todayMinus2Days_Minus1Month_excludeWeekends,
        }, false);
        const dayofTuesday_offset = getDayOfWeek( {
            weekday: 'Tuesday',
            date: getStringOfDate(addBusinessDays(-2, addMonths(-144, getStringOfDate(addDays(-1, today))))),
        }, false);

        await calendarFilter.calendarPicker.setOffsetInDynamicCalendar({
            period: 'Day',
            offsetOperator: 'Minus',
            directions: 'Up',
            times: '2',
        });
        
        await calendarFilter.calendarPicker.setOffsetByInputValueInDynamicCalendar({
            period: 'Month',
            offsetOperator: 'Minus',
            value: '144',
        });
        await calendarFilter.calendarPicker.checkExcludeWeekendsInDynamicCalendar();
        await calendarFilter.calendarPicker.checkAdjustmentInDynamicCalendar();
        await calendarFilter.calendarPicker.selectAdjustmentPeriodInDynamicCalendar('Week');
        await calendarFilter.calendarPicker.selectDayOfWeekForAdjustmentInDynamicCalendar(['Tuesday']);
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();

        // apply and verify
        await filterPanel.applyAndReopenPanel('Day');
        since (' filter panel dynamic capsule date display should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.isCapsuleDynamic('Day'))
            .toBe(true);
        since ('filter panel capsule date should contain #{expected}, instead we have #{actual}')
            .expect([
                'Before ' + dayofTuesday,
                'Before ' + dayofTuesday_offset,
            ])
            .toContain(await calendarFilter.capsuleDateTime('Day'));
        since('the input value should be #{expected}, instead we have #{actual}')
            .expect([
                dayofTuesday,
                dayofTuesday_offset,
            ])
            .toContain(await calendarFilter.dynamicPanel.displayTextOfCustomOperator());

        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        since('the resolved date should be #{expected}, instead we get #{actual}', )
            .expect([
                'The date would be resolved to: ' + dayofTuesday,
                'The date would be resolved to: ' + dayofTuesday_offset,
            ])
            .toContain(await calendarFilter.calendarPicker.getNewResolvedDateInDynamicCalendar());
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();

        // close filter panel
        await filterPanel.closeFilterPanelByCloseIcon();
        since('the grid data after applying filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['1/1/2014']);
        // calculate days difference
        const daysDiff = getDaysDifference('01/01/2014', dayofTuesday);
        since('the data rows in grid  should be #{expected}, instead we have #{actual}')
            .expect( [
                daysDiff + 1,
                getDaysDifference('01/01/2014', dayofTuesday_offset) + 1
            ])
            .toContain(await grid.getRowsCount('Visualization 1'));
    });

    it('[TC68715] Calendar Filter -  Between from Date input format', async () => {
        await calendarFilter.openSecondaryPanel('Day');
        await calendarFilter.selectDynamicDateOptions('Between');

        // select between date static + static to verify
        await calendarFilter.dynamicPanel.openFromDatePicker();
        await calendarFilter.calendarPicker.selectYearAndMonth('2014', 'March');
        await calendarFilter.calendarPicker.selectDay('10');
        await calendarFilter.dynamicPanel.openToDatePicker();
        await calendarFilter.calendarPicker.selectYearAndMonth('2014', 'June');
        await calendarFilter.calendarPicker.selectDay('15');

        // apply and verify
        await filterPanel.applyAndReopenPanel('Day');
        since (' filter panel dynamic capsule date display should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.isCapsuleDynamic('Day'))
            .toBe(false);
        since ('filter panel capsule date should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.capsuleDateTime('Day'))
            .toBe('3/10/2014 - 6/15/2014');
        since('the from input value should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.displayTextOfFrom())
            .toBe('3/10/2014');
        since('the to input value should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.displayTextOfTo())
            .toBe('6/15/2014');
        // change to dynamic + static to verify
        await calendarFilter.dynamicPanel.openToDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        const ThreeDaysAfterMonth = getDayAfterDate( {
            period: 'Month',
            days: 3,
            date: getStringOfDate(addBusinessDays(0, getStringOfDate(addMonths(-140, today)))),
            isExcludeWeekend: true,
        }, false);
        const ThreeDaysAfterMonth_offset = getDayAfterDate( {
            period: 'Month',
            days: 3,
            date: getStringOfDate(addBusinessDays(0, getStringOfDate(addMonths(-140, getStringOfDate(addDays(-1, today)))))),
            isExcludeWeekend: true,
        }, false);
         await calendarFilter.calendarPicker.setOffsetByInputValueInDynamicCalendar({
            period: 'Month',
            offsetOperator: 'Minus',
            value: '140',
        });
        await calendarFilter.calendarPicker.checkExcludeWeekendsInDynamicCalendar();
        await calendarFilter.calendarPicker.checkAdjustmentInDynamicCalendar();
        await calendarFilter.calendarPicker.selectAdjustmentSubtypeInDynamicCalendar('A day after the beginning');
        await calendarFilter.calendarPicker.selectAdjustmentPeriodInDynamicCalendar('Month');
        await calendarFilter.calendarPicker.inputAdjustmentDaysInDynamicCalendar('3');
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        
        // apply and verify
        await filterPanel.applyAndReopenPanel('Day');
        since (' filter panel dynamic capsule date display should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.isCapsuleDynamic('Day'))
            .toBe(true);
        since ('filter panel capsule date should contain #{expected}, instead we have #{actual}')
            .expect([
                '3/10/2014 - ' + ThreeDaysAfterMonth,
                '3/10/2014 - ' + ThreeDaysAfterMonth_offset,
            ])
            .toContain(await calendarFilter.capsuleDateTime('Day'));
        since('the from input value should be #{expected}, instead we have #{actual}')
            .expect([
                ThreeDaysAfterMonth,
                ThreeDaysAfterMonth_offset,
            ])
            .toContain(await calendarFilter.dynamicPanel.displayTextOfTo());
        since('the to input value should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.dynamicPanel.displayTextOfFrom())
            .toBe('3/10/2014');
        await calendarFilter.dynamicPanel.openToDatePicker();
        since('the resolved date should be #{expected}, instead we get #{actual}', )
            .expect([
                'The date would be resolved to: ' + ThreeDaysAfterMonth,
                'The date would be resolved to: ' + ThreeDaysAfterMonth_offset,
            ])
            .toContain(await calendarFilter.calendarPicker.getNewResolvedDateInDynamicCalendar());
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();

        // change to dynamic + dynamic to verify
        await calendarFilter.dynamicPanel.openFromDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        const twoDaysPiriorToMonth = getDayPriorToEndOfDate( {
            period: 'Month',
            days: 1,
            date: getStringOfDate(addBusinessDays(3, getStringOfDate(addMonths(-142, today)))),
            isExcludeWeekend: true,
        }, false);
        const twoDaysPiriorToMonth_offset = getDayPriorToEndOfDate( {
            period: 'Month',
            days: 1,
            date: getStringOfDate(addBusinessDays(3, getStringOfDate(addMonths(-142, getStringOfDate(addDays(-1, today)))))),
            isExcludeWeekend: true,
        }, false);
        await calendarFilter.calendarPicker.checkExcludeWeekendsInDynamicCalendar();
        await calendarFilter.calendarPicker.setOffsetInDynamicCalendar({
            period: 'Day',
            offsetOperator: 'Plus',
            directions: 'Up',
            times: '3',
        });
        await calendarFilter.calendarPicker.setOffsetByInputValueInDynamicCalendar({
            period: 'Month',
            offsetOperator: 'Minus',
            value: '142',
        });
        await calendarFilter.calendarPicker.checkExcludeWeekendsInDynamicCalendar();
        await calendarFilter.calendarPicker.checkAdjustmentInDynamicCalendar();
        await calendarFilter.calendarPicker.selectAdjustmentSubtypeInDynamicCalendar('A day prior to the end');
        await calendarFilter.calendarPicker.selectAdjustmentPeriodInDynamicCalendar('Month');
        await calendarFilter.calendarPicker.inputAdjustmentDaysInDynamicCalendar('2');
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();

        // apply and verify
        await filterPanel.applyAndReopenPanel('Day');
        since (' filter panel dynamic capsule date display should be #{expected}, instead we have #{actual}')
            .expect(await calendarFilter.isCapsuleDynamic('Day'))
            .toBe(true);
        since ('filter panel capsule date should contain #{expected}, instead we have #{actual}')
            .expect([
                twoDaysPiriorToMonth + ' - ' + ThreeDaysAfterMonth,
                twoDaysPiriorToMonth_offset + ' - ' + ThreeDaysAfterMonth_offset,
            ])
            .toContain(await calendarFilter.capsuleDateTime('Day'));
        since('the from input value should be #{expected}, instead we have #{actual}')
            .expect([
                twoDaysPiriorToMonth,
                twoDaysPiriorToMonth_offset,
            ])
            .toContain(await calendarFilter.dynamicPanel.displayTextOfFrom());
        since('the to input value should be #{expected}, instead we have #{actual}')
            .expect([
                ThreeDaysAfterMonth,
                ThreeDaysAfterMonth_offset,
            ])
            .toContain(await calendarFilter.dynamicPanel.displayTextOfTo());
        await calendarFilter.dynamicPanel.openToDatePicker();
        since('the resolved date should be #{expected}, instead we get #{actual}', )
            .expect([
                'The date would be resolved to: ' + ThreeDaysAfterMonth,
                'The date would be resolved to: ' + ThreeDaysAfterMonth_offset,
            ])
            .toContain(await calendarFilter.calendarPicker.getNewResolvedDateInDynamicCalendar());
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        // close filter panel
        await filterPanel.closeFilterPanelByCloseIcon();
        // comment it out due to server issue for exclude weekend calculation
        // since('the grid data after applying filter should be #{expected}, instead we have #{actual}')
        //     .expect(await grid.getOneRowData('Visualization 1', 2))
        //     .toEqual([twoDaysPiriorToMonth]);
        

        // since('the data rows in grid  should be #{expected}, instead we have #{actual}')
        //     .expect(await grid.getRowsCount('Visualization 1'))
        //     .toBe(getDaysDifference(twoDaysPiriorToQuarter, ThreeDaysAfterMonth) + 2 );
        // check filter summary bar
        since ('filter summary bar text should be #{expected}, instead we have #{actual}')
            .expect([
                '(DYNAMIC: ' + twoDaysPiriorToMonth + ' - ' + ThreeDaysAfterMonth + ')',
                '(DYNAMIC: ' + twoDaysPiriorToMonth_offset + ' - ' + ThreeDaysAfterMonth_offset + ')',
            ])
            .toContain(await filterSummaryBar.filterItems('Day'));

        
    });

    const today = getToday();
    it('[TC68705_01] Dynamic calendar - select Last/Next days', async () => {
        const last1Day = getStringOfDate(addDays(-1, today), false);

        const LAST_5_DAYS = getStringOfDate(addDays(-5, today), false);
    
        await calendarFilter.openSecondaryPanel('Day');
        await calendarFilter.selectDynamicOption('Last 7 days');

        // select last days 
        await calendarFilter.setLastNextRelativeRange({ prefix: 'Last', value: '5', unit: 'Days' });
        // apply and verify
        await filterPanel.applyAndReopenPanel('Day');
        since ('After selecting last 5 days, the capsule dynamic status should be #{expected}, instead we have #{actual}', )
            .expect(await calendarFilter.isCapsuleDynamic('Day'))
            .toBe(false);
        since('select last 5 days, the date in filter capsule should be #{expected}, instead we have #{actual} ')
            .expect(await  calendarFilter.capsuleDateTime('Day'))
            .toBe('LAST 5 DAYS\n' + LAST_5_DAYS + ' - ' + last1Day);
        since(' the from and to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomFrom())
            .toBe('Today minus 5 days (' + LAST_5_DAYS + ')');
        since(' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomTo())
            .toBe('Yesterday (' + last1Day + ')');
        // switch to custom operator and do changes
        await calendarFilter.selectDynamicOption('Custom');
        await calendarFilter.dynamicPanel.openFromDatePicker();
        await calendarFilter.calendarPicker.setOffsetInDynamicCalendar({
            period: 'Day',
            offsetOperator: 'Minus',
            directions: 'Up',
            times: '1',
        });
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        await filterPanel.applyAndReopenPanel('Day');
        since ('the filter capsule date should be #{expected}, instead we have #{actual} ')
            .expect(await  calendarFilter.capsuleDateTime('Day'))
            .toBe('LAST 6 DAYS\n'+getStringOfDate(addDays(-6, today), false) + ' - ' + last1Day);
        since (' the current selected dynamic option should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.getSelectedDynamicOption())
            .toBe('Last 6 days');
        since(' the from input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomFrom())
            .toBe('Today minus 6 days (' + getStringOfDate(addDays(-6, today), false) + ')');
        since(' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomTo())
            .toBe('Yesterday (' + last1Day + ')');
        await calendarFilter.selectDynamicOption('Custom');
        since (' the from input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfFrom())
            .toBe(getStringOfDate(addDays(-6, today), false));
        since (' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfTo())
            .toBe(last1Day);

    });

    it('[TC68705_02] Dynamic calendar - select Last/Next weeks', async () => {
        const SundayOfNextWeek = getDayOfWeek( {
            weekday: 'Sunday',
            date: getStringOfDate(addDays(7, today)),
        }, false);

        const SundayOfNext8Days = getDayOfWeek( {
            weekday: 'Sunday',
            date: getStringOfDate(addDays(8, today)),
        }, false);

        const SaturdayOfNext5Week = getDayOfWeek( {
            weekday: 'Saturday',
            date: getStringOfDate(addDays(35, today)),
        }, false);
    
        await calendarFilter.openSecondaryPanel('Day');
        await calendarFilter.selectDynamicOption('Last 7 days');

        // select last days 
        await calendarFilter.setLastNextRelativeRange({ prefix: 'Next', value: '5', unit: 'Weeks' });
        // apply and verify
        await filterPanel.applyAndReopenPanel('Day');
        since ('After selecting last 5 weeks, the capsule dynamic status should be #{expected}, instead we have #{actual}', )
            .expect(await calendarFilter.isCapsuleDynamic('Day'))
            .toBe(false);
        since('select last 5 weeks, the date in filter capsule should be #{expected}, instead we have #{actual} ')
            .expect(await  calendarFilter.capsuleDateTime('Day'))
            .toBe('NEXT 5 WEEKS\n' + SundayOfNextWeek + ' - ' + SaturdayOfNext5Week);
        since(' the from and to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomFrom())
            .toBe('Sunday of the week of (Today plus 7 days) (' + SundayOfNextWeek + ')');
        since(' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomTo())
            .toBe('Saturday of the week of (Today plus 35 days) (' + SaturdayOfNext5Week + ')');
        // switch to custom operator and do changes
        await calendarFilter.selectDynamicOption('Custom');
        await calendarFilter.dynamicPanel.openFromDatePicker();
        await calendarFilter.calendarPicker.setOffsetInDynamicCalendar({
            period: 'Day',
            offsetOperator: 'Plus',
            directions: 'Up',
            times: '1',
        });
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        await filterPanel.applyAndReopenPanel('Day');
        since ('the filter capsule date should be #{expected}, instead we have #{actual} ')
            .expect(await  calendarFilter.capsuleDateTime('Day'))
            .toBe(SundayOfNext8Days + ' - ' + SaturdayOfNext5Week);
        since (' the current selected dynamic option should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.getSelectedDynamicOption())
            .toBe('Custom');
        since (' the from input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfFrom())
            .toBe(SundayOfNext8Days);
        since (' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfTo())
            .toBe(SaturdayOfNext5Week);

    });

    it('[TC68705_03] Dynamic calendar - select Last/Next months', async () => {
        const BeginningOfLastMonth = getDayAfterDate( {
            period: 'Month',
            days: 1,
            date: getStringOfDate(addMonths(-1, today)),
        }, false);

        const EndOfLastMonth = getDayPriorToEndOfDate( {
            period: 'Month',
            days: 0,
            date: getStringOfDate(addMonths(-1, today)),
        }, false);

        const EndOfLastMonth_offset = getDayPriorToEndOfDate( {
            period: 'Month',
            days: 1,
            date: getStringOfDate(addMonths(-1, getStringOfDate(addDays(-1, today)))),
        }, false);

        await calendarFilter.openSecondaryPanel('Day');
        await calendarFilter.selectDynamicOption('Last 7 days');

        // select last days 
        await calendarFilter.setLastNextRelativeRange({ prefix: 'Last', value: '1', unit: 'Months' });
        // apply and verify
        await filterPanel.applyAndReopenPanel('Day');
        since ('After selecting last 1 months, the capsule dynamic status should be #{expected}, instead we have #{actual}', )
            .expect(await calendarFilter.isCapsuleDynamic('Day'))
            .toBe(false);
        since('select last 1 months, the date in filter capsule should be #{expected}, instead we have #{actual} ')
            .expect(await  calendarFilter.capsuleDateTime('Day'))
            .toBe('LAST 1 MONTH\n' + BeginningOfLastMonth + ' - ' + EndOfLastMonth);
        since(' the from and to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomFrom())
            .toBe('Day 1 of the month of (Today minus 1 month) (' + BeginningOfLastMonth + ')');
        since(' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomTo())
            .toBe('Day 1 to last day of previous month of (Today minus 1 month) (' + EndOfLastMonth + ')');
        // switch to custom operator and do changes
        await calendarFilter.selectDynamicOption('Custom');
        await calendarFilter.dynamicPanel.openToDatePicker();
        await calendarFilter.calendarPicker.inputAdjustmentDaysInDynamicCalendar('2');
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        await filterPanel.applyAndReopenPanel('Day');
        since ('the filter capsule date should be #{expected}, instead we have #{actual} ')
            .expect(await  calendarFilter.capsuleDateTime('Day'))
            .toBe(BeginningOfLastMonth + ' - ' + EndOfLastMonth_offset);
        since (' the current selected dynamic option should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.getSelectedDynamicOption())
            .toBe('Custom');
        since (' the from input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfFrom())
            .toBe(BeginningOfLastMonth);
        since (' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfTo())
            .toBe(EndOfLastMonth_offset);

    });

    it('[TC68705_04] Dynamic calendar - select Last/Next quarters', async () => {
        const BeginningOfNextQuarter = getDayAfterDate( {
            period: 'Quarter',
            days: 0,
            date: getStringOfDate(addMonths(3, today)),
        }, false);

        const EndOfNextQuarter = getDayPriorToEndOfDate( {
            period: 'Quarter',
            days: 0,
            date: getStringOfDate(addMonths(3, today)),
        }, false);

        const EndOfNextQuarter_offset = getDayPriorToEndOfDate( {
            period: 'Quarter',
            days: 1,
            date: getStringOfDate(addMonths(3, today)),
        }, false);

        await calendarFilter.openSecondaryPanel('Day');
        await calendarFilter.selectDynamicOption('Last 7 days');

        // select last days 
        await calendarFilter.setLastNextRelativeRange({ prefix: 'Next', value: '1', unit: 'Quarters' });
        // apply and verify
        await filterPanel.applyAndReopenPanel('Day');
        since ('After selecting next 1 quarters, the capsule dynamic status should be #{expected}, instead we have #{actual}', )
            .expect(await calendarFilter.isCapsuleDynamic('Day'))
            .toBe(false);
        since('select next 1 quarters, the date in filter capsule should be #{expected}, instead we have #{actual} ')
            .expect(await  calendarFilter.capsuleDateTime('Day'))
            .toBe('NEXT 1 QUARTER\n' + BeginningOfNextQuarter + ' - ' + EndOfNextQuarter);
        since(' the from and to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomFrom())
            .toBe('Day 1 of the quarter of (Today plus 3 months) (' + BeginningOfNextQuarter + ')');
        since(' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomTo())
            .toBe('Day 1 to last day of the quarter of (Today plus 3 months) (' + EndOfNextQuarter + ')');
        // switch to custom operator and do changes 
        await calendarFilter.selectDynamicOption('Custom');
        await calendarFilter.dynamicPanel.openToDatePicker();
        await calendarFilter.calendarPicker.inputAdjustmentDaysInDynamicCalendar('2');
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        await filterPanel.applyAndReopenPanel('Day');
        since ('the filter capsule date should be #{expected}, instead we have #{actual} ')
            .expect(await  calendarFilter.capsuleDateTime('Day'))
            .toBe(BeginningOfNextQuarter + ' - ' + EndOfNextQuarter_offset);
        since (' the current selected dynamic option should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.getSelectedDynamicOption())
            .toBe('Custom');
        since (' the from input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfFrom())
            .toBe(BeginningOfNextQuarter);
        since (' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfTo())
            .toBe(EndOfNextQuarter_offset);
        // apply the next quarter again
        await calendarFilter.selectDynamicOption('Last 7 days');
        await calendarFilter.setLastNextRelativeRange({ prefix: 'Next', value: '1', unit: 'Quarters' });
        await filterPanel.applyAndReopenPanel('Day');

        // change custom From a static date
        await calendarFilter.selectDynamicOption('Custom');
        await calendarFilter.dynamicPanel.openFromDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        await calendarFilter.calendarPicker.selectYearAndMonth('2015', 'November');
        await calendarFilter.calendarPicker.selectDay('15');
        await filterPanel.applyAndReopenPanel('Day');
        since ('the filter capsule date should be #{expected}, instead we have #{actual} ')
            .expect(await  calendarFilter.capsuleDateTime('Day'))
            .toBe('11/15/2015 - ' + EndOfNextQuarter);
        since (' the current selected dynamic option should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.getSelectedDynamicOption())
            .toBe('Custom');
        since (' the from input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfTo())
            .toBe(EndOfNextQuarter);
        since (' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfFrom())
            .toBe('11/15/2015');
    });

    it('[TC68705_05] Dynamic calendar - select Last/Next years', async () => {
        const BeginningOfLast2Years = getYearOfDate( {
            month: 1,
            day: 1,
            date: getStringOfDate(addMonths(-24, today)),
        }, false);

        const EndOfLast2Years = getYearOfDate( {
            month: 12,
            day: 31,
            date: getStringOfDate(addMonths(-12, today)),
        }, false);

        const EndOfLast2Years_offset = getYearOfDate( {
            month: 10,
            day: 30,
            date: getStringOfDate(addMonths(-12, today)),
        }, false);


        await calendarFilter.openSecondaryPanel('Day');
        await calendarFilter.selectDynamicOption('Last 7 days');

        // select last days 
        await calendarFilter.setLastNextRelativeRange({ prefix: 'Last', value: '2', unit: 'Years' });
        // apply and verify
        await filterPanel.applyAndReopenPanel('Day');
        since ('After selecting last 1 years, the capsule dynamic status should be #{expected}, instead we have #{actual}', )
            .expect(await calendarFilter.isCapsuleDynamic('Day'))
            .toBe(false);
        since('select last 1 years, the date in filter capsule should be #{expected}, instead we have #{actual} ')
            .expect(await  calendarFilter.capsuleDateTime('Day'))
            .toBe('LAST 2 YEARS\n' + BeginningOfLast2Years + ' - ' + EndOfLast2Years);
        since(' the from and to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomFrom())
            .toBe('January 1 of the year of (Today minus 24 months) (' + BeginningOfLast2Years + ')');
        since(' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomTo())
            .toBe('December 31 of the year of (Today minus 12 months) (' + EndOfLast2Years + ')');
        // switch to custom operator and do changes
        await calendarFilter.selectDynamicOption('Custom');
        await calendarFilter.dynamicPanel.openToDatePicker();
        await calendarFilter.calendarPicker.selectMonthAndDayInAdjustmentDateInputInDynamicCalendar('October', '30');
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        await filterPanel.applyAndReopenPanel('Day');
        since ('the filter capsule date should be #{expected}, instead we have #{actual} ')
            .expect(await  calendarFilter.capsuleDateTime('Day'))
            .toBe(BeginningOfLast2Years + ' - ' + EndOfLast2Years_offset);
        since (' the current selected dynamic option should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.getSelectedDynamicOption())
            .toBe('Custom');
        since (' the from input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfFrom())
            .toBe(BeginningOfLast2Years);
        since (' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfTo())
            .toBe(EndOfLast2Years_offset);

        
    });



    it('[TC68984] Dynamic calendar - select Last X days when X is different values', async () => {

        const next1Month = getStringOfDate(startOfMonth(addMonths(1, today)), false);
        const NEXT_1_MONTHS = next1Month + ' - ' + getStringOfDate(endOfMonth(addMonths(1, today)), false);

        await calendarFilter.openSecondaryPanel('Day');
        await calendarFilter.selectDynamicOption('Last 7 days');
    
        // X = -5
        await calendarFilter.setLastNextRelativeRange({
            prefix: 'Last',
            value: '-5',
            unit: 'Days',
            expectedValue: '1',
        });
        

        // X = 5.5
        await calendarFilter.setLastNextRelativeRange({
            prefix: 'Last',
            value: '5.5',
            unit: 'Days',
            expectedValue: '5',
        });
        

        // X = a
        await calendarFilter.setLastNextRelativeRange({ prefix: 'Last', value: 'a', unit: 'Days', expectedValue: '5' });
        
        // X = 0
        await calendarFilter.setLastNextRelativeRange({
            prefix: 'Next',
            value: '0',
            unit: 'Months',
            expectedValue: '1',
        });
        await filterPanel.applyAndReopenPanel('Day');
        await since(
            'Select next 0 months, the filter panel calendar date shoule contain "#{expected}", instead we have "#{actual}" '
        )
            .expect(await calendarFilter.capsuleDateTime('Day'))
            .toBe('NEXT 1 MONTH\n' + NEXT_1_MONTHS);


    });

    it('[TC68981] Error handling - Dynamic calendar - error handling  when From date is later than To date', async () => {
        const tolerance = 0.3;
        const NEXT_1_MONTHS = getStringOfDate(addMonths(1, today), false);

        await calendarFilter.openSecondaryPanel('Day');
        await calendarFilter.selectDynamicOption('Custom');

        // custom - From date < To date
        await calendarFilter.dynamicPanel.openFromDatePicker();
        await calendarFilter.calendarPicker.selectYearAndMonth('2014', 'July');
        await calendarFilter.calendarPicker.selectDay('8');
        await calendarFilter.dynamicPanel.openToDatePicker();
        await calendarFilter.calendarPicker.selectYearAndMonth('2014', 'July');
        await calendarFilter.calendarPicker.selectDay('7');
        // verify error msg and apply button status
        await since('From date > To date, error msg should appear to be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.capsuleDateTime('Day'))
            .toContain('Invalid Input');
        await since('SFrom date > To date, filter panel apply button should NOT be enabled ')
            .expect(await filterPanel.isApplyEnabled())
            .toBe(false);
        
        // custom - From date > To date
        await calendarFilter.dynamicPanel.openToDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        await calendarFilter.calendarPicker.setOffsetInDynamicCalendar({
            period: 'Month',
            offsetOperator: 'Plus',
            directions: 'Up',
            times: '1',
        });
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        // verify date display and apply button status
        await since('From date > To date, capsule time should be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.capsuleDateTime('Day'))
            .toBe('7/8/2014 - ' + NEXT_1_MONTHS);
        await filterPanel.applyAndReopenPanel('Day');
    });

    it('[TC68983] XFunc - Calendar Filter - filter summary date selection and edit', async () => {
        const today_getStringOfDate = getStringOfDate(today, false);
        const LAST_1_DAY = getStringOfDate(addDays(-1, today), false);

        // select Today
        await calendarFilter.openSecondaryPanel('Day');
        await calendarFilter.selectDynamicOption('Today');
        await since('Select Today, date on filter panel should contain "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.capsuleDateTime('Day'))
            .toContain(today_getStringOfDate);
        await filterPanel.apply();

        // check view summary
        await since('Select Today, filter summary should ccontain #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItems('Day'))
            .toContain('TODAY: ');
        // edit view summary
        await filterSummaryBar.viewAllFilterItems();
        await since('View all summary, the count of filterSummaryBar should be #{expected}, instead we have #{actual}')
            .expect(await filterSummaryBar.filterItemCountExpanded())
            .toBe(1);
        await filterSummaryBar.clickPencilIconByName('Day');

        // change date selection
        await calendarFilter.selectDynamicOption('Yesterday');
        await since('Select Yesterday, date on filter panel should contain "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.capsuleDateTime('Day'))
            .toContain(LAST_1_DAY);
        await filterPanel.applyAndReopenPanel('Day');
    });

    it('[TC68425] Calendar filter with time - Custom', async () => {
        // swith page
        await filterPanel.closeFilterPanelByCloseIcon();
        await toc.openPageFromTocMenu({ chapterName: 'dynamic calendar- Daytime', pageName: 'Page 1' });
        // open filter panel
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('Daytime');

        // choose between, static + dynamic with time
        // from with static one
        await calendarFilter.selectDynamicDateOptions('Between');
        await calendarFilter.dynamicPanel.openFromDatePicker();
        await calendarFilter.calendarPicker.selectYearAndMonth('2014', 'January');
        await calendarFilter.calendarPicker.selectDay('10');
        await calendarFilter.dynamicPanel.setTimeInputValue({ operator: 'Between', ele: 'from', timeValue: '10:30 AM' });

        // to with dynamic one
        const today_Minus2Days_Minus1Month = getStringOfDate(addDays(-2, addMonths(-106, today)), false);
        const today_Minus2Days_Minus1Month_offset = getStringOfDate(addDays(-2, addMonths(-106, getStringOfDate(addDays(-1, today)))), false);
        await calendarFilter.dynamicPanel.openToDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        await calendarFilter.calendarPicker.setOffsetInDynamicCalendar({
            period: 'Day',
            offsetOperator: 'Minus',
            directions: 'Up',
            times: '2',
        });

        await calendarFilter.calendarPicker.setOffsetByInputValueInDynamicCalendar({
            period: 'Month',
            offsetOperator: 'Minus',
            value: '106',
        });
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        await calendarFilter.dynamicPanel.setTimeInputValue({ operator: 'Between', ele: 'to', timeValue: '04:15 PM' });
        
        // verify from/to input value
        await filterPanel.apply();
        
        // check grid data
        since('the grid data after applying filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual([ '1/1/2014 12:00:00 AM' ]);
        since('the data rows in grid  should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(getDaysDifference('1/1/2014', '1/10/2014') + 2);
        
        // reopen filter panel to verify
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('Daytime');
        since('the capsule date time dynamic status should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.isCapsuleDynamic('Daytime'))
            .toBe(true);
        since('the filter capsule date time should be #{expected}, instead we have #{actual} ')
            .expect([
                '1/10/2014 10:30:00 AM -\n' + today_Minus2Days_Minus1Month + ' 04:15:00 PM', 
                '1/10/2014 10:30:00 AM -\n' + today_Minus2Days_Minus1Month_offset + ' 04:15:00 PM'
            ])
            .toContain(await calendarFilter.capsuleDateTime('Daytime'))
        since(' the from input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfFrom())
            .toBe('1/10/2014 10:30:00 AM');
        since(' the to input value should be #{expected}, instead we have #{actual} ')
            .expect([today_Minus2Days_Minus1Month + ' 4:15:00 PM', today_Minus2Days_Minus1Month_offset + ' 4:15:00 PM'])
            .toContain(await calendarFilter.dynamicPanel.displayTextOfTo());

        // choose Before with static date + time(11:45AM)
        await calendarFilter.selectDynamicDateOptions('Before');
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        await calendarFilter.calendarPicker.selectYearAndMonth('2014', 'December');
        await calendarFilter.calendarPicker.selectDay('10');
        await calendarFilter.dynamicPanel.setTimeInputValue({ operator: 'Before', timeValue: '11:45AM' });

        // apply and verify
        await filterPanel.apply();
        // check grid data
        since('the grid data after applying filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual([ '12/11/2014 12:00:00 AM' ]);
        since('the data rows in grid  should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(50);

        // reopen filter panel to verify
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('Daytime');
        since('the capsule date time dynamic status should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.isCapsuleDynamic('Daytime'))
            .toBe(false);
        since('the filter capsule date time should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.capsuleDateTime('Daytime'))
            .toBe('Before\n12/10/2014 11:45:00 AM');
        since(' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomOperator())
            .toBe('12/10/2014 11:45:00 AM');

        // choose On with dynamic date + time(From 0:0 AAM + 12:00 PPM)
        const fourthFridayFebruary_excludeWeekends= getYearOfDate( {
            month: 1,
            day: 1,
            date: getStringOfDate(addBusinessDays(0, getStringOfDate(addMonths(-144, today)))),
        }, false);
        const fourthFridayFebruary_excludeWeekends_offset= getYearOfDate( {
            month: 1,
            day: 1,
            date: getStringOfDate(addBusinessDays(0, getStringOfDate(addMonths(-144, getStringOfDate(addDays(-1, today)))))),
        }, false);
        await calendarFilter.selectDynamicDateOptions('On');
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        await calendarFilter.calendarPicker.setOffsetByInputValueInDynamicCalendar({
            period: 'Month',
            offsetOperator: 'Minus',
            value: '142',
        });
        await calendarFilter.calendarPicker.checkExcludeWeekendsInDynamicCalendar();
        await calendarFilter.calendarPicker.checkAdjustmentInDynamicCalendar();
        await calendarFilter.calendarPicker.selectAdjustmentSubtypeInDynamicCalendar('A date of the year');
        await calendarFilter.calendarPicker.selectMonthAndDayInAdjustmentDateInputInDynamicCalendar('January', '1');
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        await calendarFilter.dynamicPanel.setTimeInputValue({ operator: 'On', ele: 'from', timeValue: '0:0 AAM' });
        await calendarFilter.dynamicPanel.setTimeInputValue({ operator: 'On', ele: 'to', timeValue: '12:00 PPM' });

        // apply 
        await filterPanel.apply();
        // check grid data
        since('the grid data after applying filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual([ '1/2/2014 12:00:00 AM' ]);
        since('the data rows in grid  should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(50);

        // reopen filter panel to verify
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('Daytime');
        since('the capsule date time dynamic status should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.isCapsuleDynamic('Daytime'))
            .toBe(true);
        since('the filter capsule date time should be #{expected}, instead we have #{actual} ')
            .expect([
                    fourthFridayFebruary_excludeWeekends + ' 12:00:00 AM -\n' + fourthFridayFebruary_excludeWeekends + ' 12:00:00 PM',
                    fourthFridayFebruary_excludeWeekends_offset + ' 12:00:00 AM -\n' + fourthFridayFebruary_excludeWeekends_offset + ' 12:00:00 PM'])
            .toContain(await calendarFilter.capsuleDateTime('Daytime'));
        since(' the from input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfFrom())
            .toBe('12:00:00 AM');
        since(' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfTo())
            .toBe('12:00:00 PM');

        // choose After with static date + time(03:30 PM)
        await calendarFilter.selectDynamicDateOptions('After');
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        await calendarFilter.calendarPicker.selectYearAndMonth('2014', 'January');
        await calendarFilter.calendarPicker.selectDay('1');
        await calendarFilter.dynamicPanel.setTimeInputValue({ operator: 'After', timeValue: '3AM' });

        // apply and check grid data
        await filterPanel.apply();
        since('the grid data after applying filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual([ '1/1/2014 12:00:00 AM' ]);
        since('the data rows in grid  should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(2);
            
        // reopen filter panel to verify
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('Daytime');
        since('the capsule date time dynamic status should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.isCapsuleDynamic('Daytime'))
            .toBe(false);
        since('the filter capsule date time should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.capsuleDateTime('Daytime'))
            .toBe('After\n1/1/2014 03:00:00 AM');
        since(' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomOperator())
            .toBe('1/1/2014 3:00:00 AM');
        

    });

    it('[TC63765] Calendar filter with time - different dynamic options', async () => {

        const todayMinus7Days = getStringOfDate(addDays(-7, today), false);
        const yesterday = getStringOfDate(addDays(-1, today), false);
        const firstDayOfThisMonth = getDayAfterDate( {
            period: 'Month',
            days: 1,
            date: getStringOfDate(today),
        }, false);
        const firstDayOfThisQuarter = getDayAfterDate( {
            period: 'Quarter',
            days: 0,
            date: getStringOfDate(today),
        }, false); 
        const firstDayOfThisYear = getYearOfDate( {
            month: 1,
            day: 1,
            date: getStringOfDate(today),
        }, false);
       
        // last 7 days
        await calendarFilter.openSecondaryPanel('Day');
        await calendarFilter.selectDynamicOption('Last 7 days');
        since('Select Custom, the from input value should be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomFrom())
            .toBe('Today minus 7 days (' + todayMinus7Days + ')');
        since('Select Custom, the to input value should be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomTo())
            .toBe('Yesterday (' + yesterday + ')');
        
        await filterPanel.applyAndReopenPanel('Day');
        since('After apply Last 7 days, the filter panel capsule should be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.capsuleDateTime('Day'))
            .toBe('LAST 7 DAYS\n' + todayMinus7Days + ' - ' + yesterday);
         

        // Today
        await calendarFilter.selectDynamicOption('Today');
        since ('Select Today, the from input value should be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomFrom())
            .toBe('Today (' + getStringOfDate(today, false) + ')');
        since ('Select Today, the to input value should be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomTo())
            .toBe('Today (' + getStringOfDate(today, false) + ')');

        // Yesterday
        await calendarFilter.selectDynamicOption('Yesterday');
        since ('Select Yesterday, the from input value should be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomFrom())
            .toBe('Yesterday (' + yesterday + ')');
        since ('Select Yesterday, the to input value should be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomTo())
            .toBe('Yesterday (' + yesterday + ')');

        // check options with datetime 
        // swith page
        await filterPanel.closeFilterPanelByCloseIcon();
        await toc.openPageFromTocMenu({ chapterName: 'dynamic calendar- Daytime', pageName: 'Page 1' });
        // open filter panel
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('Daytime');
        // MTD
        await calendarFilter.selectDynamicOption('MTD');
        since ('Select MTD, the from input value should be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomFrom())
            .toBe('Day 1 of this month (' + firstDayOfThisMonth + ' 12:00:00 AM)');
        since ('Select MTD, the to input value should be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomTo())
            .toBe('Today (' + getStringOfDate(today, false) + ' 11:59:59 PM)');
        // QTD
        await calendarFilter.selectDynamicOption('QTD');
        since ('Select QTD, the from input value should be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomFrom())
            .toBe('Day 1 of the Quarter (' + firstDayOfThisQuarter + ' 12:00:00 AM)');
        since ('Select QTD, the to input value should be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomTo())
            .toBe('Today (' + getStringOfDate(today, false) + ' 11:59:59 PM)');
        // YTD
        await calendarFilter.selectDynamicOption('YTD');
        since ('Select YTD, the from input value should be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomFrom())
            .toBe('January 1 of this year (' + firstDayOfThisYear + ' 12:00:00 AM)');
        since ('Select YTD, the to input value should be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomTo())
            .toBe('Today (' + getStringOfDate(today, false) + ' 11:59:59 PM)');
        await filterPanel.applyAndReopenPanel('Daytime');
        since('After apply YTD, the filter panel capsule should be "#{expected}", instead we have "#{actual}" ')
            .expect(await calendarFilter.capsuleDateTime('Daytime'))
            .toBe('YTD\n' + firstDayOfThisYear + ' 12:00:00 AM -\n' + getStringOfDate(today, false) + ' 11:59:59 PM');

    });

    it('[TC68425_02] Dynamic calendar - select Last/Next weeks with time', async () => {
        const SundayOfNextWeek = getDayOfWeek( {
            weekday: 'Sunday',
            date: getStringOfDate(addDays(7, today)),
        }, false);
        const SaturdayOfNext5Week = getDayOfWeek( {
            weekday: 'Saturday',
            date: getStringOfDate(addDays(35, today)),
        }, false);

        const firstDayOfLast2Months = getDayAfterDate( {
            period: 'Month',
            days: 1,
            date: getStringOfDate(addMonths(-144, today)),
        }, false);

        const lastDayOfLast1Months = getDayPriorToEndOfDate( {
            period: 'Month',
            days: 0,
            date: getStringOfDate(addMonths(-1, today)),
        }, false);

        const firstDayOfNextQuarters = getDayAfterDate( {
            period: 'Quarter',
            days: 0,
            date: getStringOfDate(addMonths(3, today)),
        }, false);

        const lastDayOfNext2Quarters = getDayPriorToEndOfDate( {
            period: 'Quarter',
            days: 0,
            date: getStringOfDate(addMonths(6, getStringOfDate(addDays(1, today)))),
        }, false);



        // swith page
        await filterPanel.closeFilterPanelByCloseIcon();
        await toc.openPageFromTocMenu({ chapterName: 'dynamic calendar- Daytime', pageName: 'Page 1' });
        // open filter panel
        await filterPanel.openFilterPanel();
        await calendarFilter.openSecondaryPanel('Daytime');
        await calendarFilter.selectDynamicOption('Last 7 days');

        // select last days 
        await calendarFilter.setLastNextRelativeRange({ prefix: 'Next', value: '5', unit: 'Weeks' });
        // apply and verify
        await filterPanel.applyAndReopenPanel('Daytime');
        since ('After selecting last 5 weeks, the capsule dynamic status should be #{expected}, instead we have #{actual}', )
            .expect(await calendarFilter.isCapsuleDynamic('Daytime'))
            .toBe(false);
        since('select last 5 weeks, the date in filter capsule should be #{expected}, instead we have #{actual} ')
            .expect(await  calendarFilter.capsuleDateTime('Daytime'))
            .toBe('NEXT 5 WEEKS\n' + SundayOfNextWeek + ' 12:00:00 AM -\n' + SaturdayOfNext5Week + ' 11:59:59 PM');
        since(' the from and to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomFrom())
            .toBe('Sunday of the week of (Today plus 7 days) (' + SundayOfNextWeek + ' 12:00:00 AM)');
        since(' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfCustomTo())
            .toBe('Saturday of the week of (Today plus 35 days) (' + SaturdayOfNext5Week + ' 11:59:59 PM)');
        // switch to custom operator with time only 
        await calendarFilter.selectDynamicOption('Custom');
        await calendarFilter.dynamicPanel.setTimeInputValue({ operator: 'Between', ele: 'from', timeValue: '10:30 AM' });
        await calendarFilter.dynamicPanel.setTimeInputValue({ operator: 'Between', ele: 'to', timeValue: '04:15 PM' });
        await filterPanel.applyAndReopenPanel('Daytime');
        since ('the filter capsule date should be #{expected}, instead we have #{actual} ')
            .expect(await  calendarFilter.capsuleDateTime('Daytime'))
            .toBe(SundayOfNextWeek + ' 10:30:00 AM -\n' + SaturdayOfNext5Week + ' 04:15:00 PM');
        since (' the current selected dynamic option should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.getSelectedDynamicOption())
            .toBe('Custom');
        since (' the from input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfFrom())
            .toBe(SundayOfNextWeek + ' 10:30:00 AM');
        since (' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfTo())
            .toBe(SaturdayOfNext5Week + ' 4:15:00 PM');
        
        // Select last 2 months
        await calendarFilter.selectDynamicOption('Last 7 days');
        await calendarFilter.setLastNextRelativeRange({ prefix: 'Last', value: '2', unit: 'Months' });
        await filterPanel.applyAndReopenPanel('Daytime');

        // change custom to a static date with time
        await calendarFilter.selectDynamicOption('Custom');
        await calendarFilter.dynamicPanel.openFromDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        await calendarFilter.calendarPicker.selectYearAndMonth('2016', 'November');
        await calendarFilter.calendarPicker.selectDay('15');
        await calendarFilter.dynamicPanel.setTimeInputValue({ operator: 'Between', timeValue: '09:00 AM', ele: 'to' });
        await filterPanel.applyAndReopenPanel('Daytime');
        since ('the filter capsule date should be #{expected}, instead we have #{actual} ')
            .expect(await  calendarFilter.capsuleDateTime('Daytime'))
            .toBe('11/15/2016 12:00:00 AM -\n' + lastDayOfLast1Months + ' 09:00:00 AM');
        since (' the current selected dynamic option should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.getSelectedDynamicOption())
            .toBe('Custom');
        since (' the from input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfFrom())
            .toBe('11/15/2016 12:00:00 AM');
        since (' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfTo())
            .toBe(lastDayOfLast1Months + ' 9:00:00 AM');    
        
        // last next quarters again
        await calendarFilter.selectDynamicOption('Last 7 days');
        await calendarFilter.setLastNextRelativeRange({ prefix: 'Next', value: '2', unit: 'Quarters' });
        await filterPanel.applyAndReopenPanel('Daytime');   

        // do custom operation with dynamic date + time
        await calendarFilter.selectDynamicOption('Custom');
        await calendarFilter.dynamicPanel.setTimeInputValue({ operator: 'Between', timeValue: '05:00 PM', ele: 'to' });
        await calendarFilter.dynamicPanel.openToDatePicker();
        await calendarFilter.calendarPicker.setOffsetInDynamicCalendar({
            period: 'Day',
            offsetOperator: 'Plus',
            directions: 'Up',
            times: '1',
        });
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        await filterPanel.applyAndReopenPanel('Daytime');
        since ('the filter capsule date should be #{expected}, instead we have #{actual} ')
            .expect(await  calendarFilter.capsuleDateTime('Daytime'))
            .toBe(firstDayOfNextQuarters + ' 12:00:00 AM -\n' + lastDayOfNext2Quarters + ' 05:00:00 PM');
        since (' the current selected dynamic option should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.getSelectedDynamicOption())
            .toBe('Custom');
        since (' the from input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfFrom())
            .toBe(firstDayOfNextQuarters + ' 12:00:00 AM');
        since (' the to input value should be #{expected}, instead we have #{actual} ')
            .expect(await calendarFilter.dynamicPanel.displayTextOfTo())
            .toBe(lastDayOfNext2Quarters + ' 5:00:00 PM');

    });

    it('[TC67989] Calendar filter with time with exclude mode on authoring', async () => {
        await libraryAuthoringPage.editDossierFromLibrary();
        await contentsPanel.goToPage({ chapterName: 'dynamic calendar- Daytime', pageName: 'Page 1' });
        await authoringFilters.switchToFilterPanel();

        
        await authoringFilters.setFilterToAQSelectorContainer('Daytime');
        let calendar = authoringFilters.selectorObject.calendar;

        // from with static one
        await calendar.openDateTimePicker();
        await calendarFilter.selectDynamicDateOptions('Between');
        await calendarFilter.dynamicPanel.openFromDatePicker();
        await calendarFilter.calendarPicker.selectYearAndMonth('2014', 'January');
        await calendarFilter.calendarPicker.selectDay('10');
        await calendarFilter.dynamicPanel.setTimeInputValue({ operator: 'Between', ele: 'from', timeValue: '10:30 AM' });

        // to with dynamic one
        const today_Minus2Days_Minus1Month = getStringOfDate(addDays(-2, addMonths(-106, today)), false);
        const today_Minus2Days_Minus1Month_offset = getStringOfDate(addDays(-2, addMonths(-106, getStringOfDate(addDays(-1, today)))), false);
        await calendarFilter.dynamicPanel.openToDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        await calendarFilter.calendarPicker.setOffsetInDynamicCalendar({
            period: 'Day',
            offsetOperator: 'Minus',
            directions: 'Up',
            times: '2',
        });

        await calendarFilter.calendarPicker.setOffsetByInputValueInDynamicCalendar({
            period: 'Month',
            offsetOperator: 'Minus',
            value: '106',
        });
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        await calendarFilter.dynamicPanel.setTimeInputValue({ operator: 'Between', ele: 'to', timeValue: '04:15 PM' });
        
        // verify from/to input value
        await calendarFilter.dynamicPanel.clickApplyButton();
        
        // check grid data
        since('the grid data after applying filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual([ '1/1/2014 12:00:00 AM' ]);
        since('the data rows in grid  should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(getDaysDifference('1/1/2014', '1/10/2014') + 2);
        await takeScreenshotByElement(calendar.getDateTimePickerIcon(), 'TC67989_CalendarFilterWithTime_Authoring_Dynamic Icon');
        since('the filter capsule date time should be #{expected}, instead we have #{actual} ')
            .expect([
                '1/10/2014 10:30:00 AM - ' + today_Minus2Days_Minus1Month + ' 4:15:00 PM', 
                '1/10/2014 10:30:00 AM - ' + today_Minus2Days_Minus1Month_offset + ' 4:15:00 PM'
            ])
            .toContain(await calendar.getInputDate());

        // choose Before with static date + time(11:45AM)
        await calendar.openDateTimePicker();
        await calendarFilter.selectDynamicDateOptions('Before');
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        await calendarFilter.calendarPicker.selectYearAndMonth('2014', 'December');
        await calendarFilter.calendarPicker.selectDay('10');
        await calendarFilter.dynamicPanel.setTimeInputValue({ operator: 'Before', timeValue: '11:45AM' });

        // apply and verify
        await calendarFilter.dynamicPanel.clickApplyButton();
        // check grid data
        since('the grid data after applying filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual([ '12/11/2014 12:00:00 AM' ]);
        since('the data rows in grid  should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(50);
        since('the filter capsule date time should be #{expected}, instead we have #{actual} ')
            .expect(await calendar.getInputDate())
            .toBe('Before 12/10/2014 11:45:00 AM');

        // choose On with dynamic date + time(From 0:0 AAM + 12:00 PPM)
        const fourthFridayFebruary_excludeWeekends= getYearOfDate( {
            month: 1,
            day: 1,
            date: getStringOfDate(addBusinessDays(0, getStringOfDate(addMonths(-144, today)))),
        }, false);
        const fourthFridayFebruary_excludeWeekends_offset= getYearOfDate( {
            month: 1,
            day: 1,
            date: getStringOfDate(addBusinessDays(0, getStringOfDate(addMonths(-144, getStringOfDate(addDays(-1, today)))))),
        }, false);
        await calendar.openDateTimePicker();
        await calendarFilter.selectDynamicDateOptions('On');
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        await calendarFilter.calendarPicker.setOffsetByInputValueInDynamicCalendar({
            period: 'Month',
            offsetOperator: 'Minus',
            value: '142',
        });
        await calendarFilter.calendarPicker.checkExcludeWeekendsInDynamicCalendar();
        await calendarFilter.calendarPicker.checkAdjustmentInDynamicCalendar();
        await calendarFilter.calendarPicker.selectAdjustmentSubtypeInDynamicCalendar('A date of the year');
        await calendarFilter.calendarPicker.selectMonthAndDayInAdjustmentDateInputInDynamicCalendar('January', '1');
        await calendarFilter.calendarPicker.clickDoneButtonInDynamicCalendar();
        await calendarFilter.dynamicPanel.setTimeInputValue({ operator: 'On', ele: 'from', timeValue: '0:0 AAM' });
        await calendarFilter.dynamicPanel.setTimeInputValue({ operator: 'On', ele: 'to', timeValue: '12:00 PPM' });

        // apply 
        await calendarFilter.dynamicPanel.clickApplyButton();
        // check grid data
        since('the grid data after applying filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual([ '1/2/2014 12:00:00 AM' ]);
        since('the data rows in grid  should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(50);
        since('the filter capsule date time should be #{expected}, instead we have #{actual} ')
            .expect([
                    fourthFridayFebruary_excludeWeekends + ' 12:00:00 AM - ' + fourthFridayFebruary_excludeWeekends + ' 12:00:00 PM',
                    fourthFridayFebruary_excludeWeekends_offset + ' 12:00:00 AM - ' + fourthFridayFebruary_excludeWeekends_offset + ' 12:00:00 PM'])
            .toContain(await calendar.getInputDate());

        // choose After with static date + time(03:30 PM)
        await calendar.openDateTimePicker();
        await calendarFilter.selectDynamicDateOptions('After');
        await calendarFilter.dynamicPanel.openCustomOperatorDatePicker();
        await calendarFilter.calendarPicker.toggleDynamicCalendar();
        await calendarFilter.calendarPicker.selectYearAndMonth('2014', 'January');
        await calendarFilter.calendarPicker.selectDay('1');
        await calendarFilter.dynamicPanel.setTimeInputValue({ operator: 'After', timeValue: '3AM' });

        // apply and check grid data
        await calendarFilter.dynamicPanel.clickApplyButton();
        since('the grid data after applying filter should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual([ '1/1/2014 12:00:00 AM' ]);
        since('the data rows in grid  should be #{expected}, instead we have #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(2);
        since('the filter capsule date time should be #{expected}, instead we have #{actual} ')
            .expect(await calendar.getInputDate())
            .toBe('After 1/1/2014 3:00:00 AM');
        

    });
});
