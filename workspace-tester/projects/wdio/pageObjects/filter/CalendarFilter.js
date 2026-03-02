import BaseFilter from '../base/BaseFilter.js';
import FilterCapsule from '../common/FilterCapsule.js';
import FilterSummary from '../common/FilterSummary.js';
import CalendarWidget from './CalendarWidget.js';
import CalendarHeader from './CalendarHeader.js';
import CalendarDynamicPanel from './CalendarDynamicPanel.js';
import CalendarPicker from '../prompt/CalendarPicker.js';

function parseMonthYear(mmyy) {
    const em = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    let rcMonth = em.indexOf(mmyy[0]) + 1;
    if (rcMonth < 10) {
        rcMonth = `0${rcMonth}`;
    }
    const rcYear = parseInt(mmyy[1]);
    return [rcMonth, 0, rcYear];
}

function composeWidgetDateFun({ mmyy, dd }) {
    let wdtdate = parseMonthYear(mmyy.split(' '));
    wdtdate[1] = parseInt(dd);
    if (wdtdate[1] < 10) {
        wdtdate[1] = `0${wdtdate[1]}`;
    }

    return wdtdate;
}

function composeInputTimeFun({ hour, min, ampm }) {
    if (ampm === 'PM') {
        hour = parseInt(hour) + 12;
    }
    return [hour, min].map(Number);
}

function composeCapsuleDateTimeFun(dateTime, timePresent) {
    dateTime = dateTime.split('-');

    let strDateFrom = dateTime[0].trim();
    // While from & to are same, there won't be -
    let strDateTo = dateTime.length === 2 ? dateTime[1].trim() : dateTime[0].trim();
    const parsedDateTime = [];

    if (timePresent) {
        let arrDateFrom = strDateFrom.split(' ');
        let arrDateTo = strDateTo.split(' ');
        strDateFrom = arrDateFrom[0];
        strDateTo = arrDateTo[0];
        parsedDateTime.push(arrDateFrom[1].split(':'));
        parsedDateTime.push(arrDateTo[1].split(':'));
    }

    const dateFrom = strDateFrom.split('/');
    const dateTo = strDateTo.split('/');

    parsedDateTime.push(dateFrom);
    parsedDateTime.push(dateTo);

    return parsedDateTime;
}

export default class CalenderFilter extends BaseFilter {
    constructor() {
        super();
        this.capsule = new FilterCapsule();
        this.summary = new FilterSummary();
        this.widget = new CalendarWidget();
        this.header = new CalendarHeader();
        this.dynamicPanel = new CalendarDynamicPanel();
        this.calendarPicker = new CalendarPicker();
    }

    // Element Locator

    getClearSelection() {
        return this.$('.mstrd-FilterDetailPanelFooter').$('.mstr-panel-text');
    }

    getDynamicOption() {
        return this.dynamicPanel.getDynamicOptions();
    }

    // Action helper

    async expandDynamicDateOptions() {
        return this.header.expandDynamicDateOptions();
    }


    async selectDynamicDateOptions(name, useOld = false) {
        if (useOld) {
            return this.header.selectDynamicDateOptions(name);
        }
        await this.dynamicPanel.selectDynamicOption('Custom');
        await this.dynamicPanel.selectCustomOperatorOption(name);
    }

    // Set Input From, To as Given Date

    async setInputDateOfFrom({ customMonth, customDay, customYear }) {
        return this.header.setInputDateOfFrom({ customMonth, customDay, customYear });
    }

    async setInputDateOfTo({ customMonth, customDay, customYear }) {
        return this.header.setInputDateOfTo({ customMonth, customDay, customYear });
    }

    async setInputTimeOfFrom({ customHour, customMin, customSec, customAMPM }) {
        return this.header.setInputTimeOfFrom({ customHour, customMin, customSec, customAMPM });
    }

    async setInputTimeOfTo({ customHour, customMin, customSec, customAMPM }) {
        return this.header.setInputTimeOfTo({ customHour, customMin, customSec, customAMPM });
    }

    async setInputDateOfBeforeAfter({ customMonth, customDay, customYear }) {
        return this.header.setInputDateOfBeforeAfter({ customMonth, customDay, customYear });
    }

    async setInputTimeOfBeforeAfter({ customHour, customMin, customSec, customAMPM }) {
        return this.header.setInputTimeOfBeforeAfter({ customHour, customMin, customSec, customAMPM });
    }

    async setInputTimeOfOnFrom({ customHour, customMin, customSec, customAMPM }) {
        return this.header.setInputTimeOfOnFrom({ customHour, customMin, customSec, customAMPM });
    }

    async setInputTimeOfOnTo({ customHour, customMin, customSec, customAMPM }) {
        return this.header.setInputTimeOfOnTo({ customHour, customMin, customSec, customAMPM });
    }

    // Set Input From Keyboard

    async selectInputMonthOfFrom() {
        await this.header.selectInputMonthOfFrom();
    }

    async selectInputDayOfFrom() {
        await this.header.selectInputDayOfFrom();
    }

    async selectInputYearOfFrom() {
        return this.header.selectInputYearOfFrom();
    }

    async selectInputMonthOfTo() {
        return this.header.selectInputMonthOfTo();
    }

    async selectInputDayOfTo() {
        return this.header.selectInputDayOfTo();
    }

    async selectInputYearOfTo() {
        return this.header.selectInputYearOfTo();
    }

    async selectInputMonthOfBeforeAfter() {
        return this.header.selectInputMonthOfBeforeAfter();
    }

    async selectInputDayOfBeforeAfter() {
        return this.header.selectInputDayOfBeforeAfter();
    }

    async selectInputYearOfBeforeAfter() {
        return this.header.selectInputYearOfBeforeAfter();
    }

    async sendKeyToInput(theKey) {
        return this.header.sendKeyToInput(theKey);
    }

    
    //Select Date From Calendar Widget

    async goToPreviousMonth() {
        return this.widget.goToPreviousMonth();
    }

    async goToNextMonth() {
        return this.widget.goToNextMonth();
    }

    async goToPreviousYear() {
        return this.widget.goToPreviousYear();
    }

    async goToNextYear() {
        return this.widget.goToNextYear();
    }

    async selectDateInWidget({ monthYear, day }) {
        return this.widget.selectDateInWidget({ monthYear, day });
    }

    async scrollWidgetToBottom() {
        return this.widget.scrollWidgetToBottom();
    }

    async removeCapsule(filterName) {
        await this.waitForElementVisible(this.getFilterContainer(filterName));
        return this.capsule.removeCapsuleByOrder({
            filterElementFinder: this.getFilterContainer(filterName),
            index: 0,
        });
    }

    async clearSelection() {
        await this.getClearSelection().click();
        await this.waitForElementStaleness(this.widget.getWidgetDaySelected(), {
            timeout: 1000,
            msg: 'Widget selection is not cleared',
        });
    }

    // Dynamic panel

    async selectDynamicOption(radio) {
        return this.dynamicPanel.selectDynamicOption(radio);
    }

    async setLastNextRelativeRange({ prefix, value, unit, expectedValue }) {
        return this.dynamicPanel.setLastNextRelativeRange({ prefix, value, unit, expectedValue });
    }

    async setFromForCustom({
        option,
        prefix,
        value,
        unit,
        fixedOption,
        monthYear,
        day,
        customMonth,
        customDay,
        customYear,
        customHour,
        customMin,
        customSec,
        customAMPM,
    }) {
        return this.dynamicPanel.setFromForCustom({
            option,
            prefix,
            value,
            unit,
            fixedOption,
            monthYear,
            day,
            customMonth,
            customDay,
            customYear,
            customHour,
            customMin,
            customSec,
            customAMPM,
        });
    }

    async setToForCustom({
        option,
        prefix,
        value,
        unit,
        fixedOption,
        monthYear,
        day,
        customMonth,
        customDay,
        customYear,
        customHour,
        customMin,
        customSec,
        customAMPM,
    }) {
        return this.dynamicPanel.setToForCustom({
            option,
            prefix,
            value,
            unit,
            fixedOption,
            monthYear,
            day,
            customMonth,
            customDay,
            customYear,
            customHour,
            customMin,
            customSec,
            customAMPM,
        });
    }

    // PopUp calendar

    async expandPopUpCalendarForFrom() {
        return this.dynamicPanel.expandPopUpCalendarForFrom();
    }

    async expandPopUpCalendarForTo() {
        return this.dynamicPanel.expandPopUpCalendarForTo();
    }

    

    async capsuleDateTime(filterName) {
        return this.capsule.capsuleName({ filterElementFinder: this.getFilterContainer(filterName), index: 0 });
    }

    async isCapsuleDynamic(filterName) {
        return this.capsule.isCapsuleDynamicByOrder({
            filterElementFinder: this.getFilterContainer(filterName),
            index: 0,
        });
    }

    async filterSummaryBarText(filterName) {
        return this.summary.filterItems(filterName);
    }

    async composeInputDate({ mmFun, ddFun, yyFun }) {
        return [await mmFun, await ddFun, await yyFun];
    }

    async composeInputTime({ hourFun, minFun, ampmFun }) {
        return composeInputTimeFun({ hour: await hourFun, min: await minFun, ampm: await ampmFun });
    }

    async composeWidgetDate({ mmyyFun, ddFun }) {
        return composeWidgetDateFun({ mmyy: await mmyyFun, dd: await ddFun });
    }

    async composeCapsuleDateTime(filterName) {
        const dateTime = await this.capsuleDateTime(filterName);
        const timePresent = await this.header.isTimeInputPresent();
        return composeCapsuleDateTimeFun(dateTime, timePresent);
    }

    async isInputEqualToCapsule(filterName) {
        const timePresent = await this.header.isTimeInputPresent();
        const parsedCapsule = await this.composeCapsuleDateTime(filterName);
        const inputDateTo = await this.composeInputDate({
            mmFun: this.header.inputMonthOfTo(),
            ddFun: this.header.inputDayOfTo(),
            yyFun: this.header.inputYearOfTo(),
        });
        const inputDateFrom = await this.composeInputDate({
            mmFun: this.header.inputMonthOfFrom(),
            ddFun: this.header.inputDayOfFrom(),
            yyFun: this.header.inputYearOfFrom(),
        });

        let isEqualed =
            inputDateTo.toString() === parsedCapsule.pop().toString() &&
            inputDateFrom.toString() === parsedCapsule.pop().toString();

        if (!timePresent) {
            return isEqualed;
        }

        const inputTimeTo = await this.composeInputTime({
            hourFun: this.header.inputHourOfTo(),
            minFun: this.header.inputMinuteOfTo(),
            ampmFun: this.header.inputAMPMOfTo(),
        });
        const inputTimeFrom = await this.composeInputTime({
            hourFun: this.header.inputHourOfFrom(),
            minFun: this.header.inputMinuteOfFrom(),
            ampmFun: this.header.inputAMPMOfFrom(),
        });

        isEqualed =
            isEqualed &&
            inputTimeTo.toString() === parsedCapsule.pop().toString() &&
            inputTimeFrom.toString() === parsedCapsule.pop().toString();

        return isEqualed;
    }

    async isInputEqualToWidget({ widgetmmyyFun, widgetddFun, inputmmFun, inputddFun, inputyyFun }) {
        const arr = await this.composeWidgetDate({ mmyyFun: widgetmmyyFun, ddFun: widgetddFun });
        const arr1 = await this.composeInputDate({ mmFun: inputmmFun, ddFun: inputddFun, yyFun: inputyyFun });
        return arr.toString() === arr1.toString();
    }

    async isInputEqualToWidgetForFrom() {
        return this.isInputEqualToWidget({
            widgetmmyyFun: this.widget.widgetMonthOfFrom(),
            widgetddFun: this.widget.widgetDayOfFrom(),
            inputmmFun: this.header.inputMonthOfFrom(),
            inputddFun: this.header.inputDayOfFrom(),
            inputyyFun: this.header.inputYearOfFrom(),
        });
    }

    async isInputEqualToWidgetForTo() {
        return this.isInputEqualToWidget({
            widgetmmyyFun: this.widget.widgetMonthOfTo(),
            widgetddFun: this.widget.widgetDayOfTo(),
            inputmmFun: this.header.inputMonthOfTo(),
            inputddFun: this.header.inputDayOfTo(),
            inputyyFun: this.header.inputYearOfTo(),
        });
    }

    async isInputBoxUnset() {
        return this.header.isInputBoxUnset();
    }

    async isInputBeforeUnset() {
        return this.header.isInputBeforeUnset();
    }

    async isInputAfterUnset() {
        return this.header.isInputAfterUnset();
    }

    async isInputAnyDateSelected() {
        return this.header.isInputAnyDateSelected();
    }

    async isTimeInputPresent() {
        return this.header.isTimeInputPresent();
    }

    async isCapsulePresent(filterName) {
        return this.capsule
            .getCapsuleByOrder({ filterElementFinder: this.getFilterContainer(filterName), index: 0 })
            .isDisplayed();
    }

    async isCapsuleExcluded(filterName) {
        return this.capsule.isCapsuleExcludedByOrder({
            filterElementFinder: this.getFilterContainer(filterName),
            index: 0,
        });
    }

    async isClearSelectionEnabled() {
        const color = await this.getClearSelection().getCSSProperty('color');
        return color.value === 'rgba(6,97,224,1)';
    }

    async isBeforeSelected() {
        return this.header.isBeforeSelected();
    }

    async isAfterSelected() {
        return this.header.isAfterSelected();
    }

    async isOnSelected() {
        return this.header.isOnSelected();
    }

    async widgetStartWeekDay() {
        return this.widget.getWidgetMonthStartWeekDay().getText();
    }

    async getDateOnWidgetHeader() {
        return this.header.dateOnWidgetHeader();
    }

    async getWidgetMonthYear() {
        return this.widget.getWidgetHeaderMonthYear();
    }

    // dynamic panel

    async dynamicDisplayTextOfFrom() {
        return this.dynamicPanel.displayTextOfFrom();
    }

    async dynamicDisplayTextOfTo() {
        return this.dynamicPanel.displayTextOfTo();
    }

    async isDynamicOptionSelected(option) {
        return this.dynamicPanel.isDynamicOptionSelected(option);
    }

    async isLastNextContextMenuContainerPresent() {
        return this.dynamicPanel.isLastNextContextMenuContainerPresent();
    }
}
