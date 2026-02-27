import BasePrompt from '../base/BasePrompt.js';
import moment from 'moment';
import { getInputValue, getAttributeValue} from '../../utils/getAttributeValue.js';
import CalendarPicker from './CalendarPicker.js';


export default class CalendarStyle extends BasePrompt {
    /****************************************************************
     * Element locator
     ****************************************************************/
    constructor() {
        super();
        this.CalendarPicker = new CalendarPicker();
    }

    getCalendarIcon(promptElement) {
        if (!this.isWeb()) {
            return promptElement.$('.mstrCalendarAndTimePickerCellCalendarButton>span');
        } else {
            return promptElement.$('.mstrCalendarAndTimePickerCellCalendarButton>img');
        }
    }

    

    getTimeWidget(promptElement) {
        return promptElement.$('.mstrTime');
    }

    getTimeHour(promptElement) {
        return this.getTimeWidget(promptElement).$('.mstrHour');
    }

    getTimeMinute(promptElement) {
        return this.getTimeWidget(promptElement).$('.mstrMinute');
    }

    getTimeSecond(promptElement) {
        return this.getTimeWidget(promptElement).$('.mstrSecond');
    }

    getWebClose(promptElement) {
        return this.getCalendarWidget(promptElement).$("//div[text()='Close']");
    }
    /****************************************************************
     * Action helper
     ****************************************************************/

    async openCalendar(promptElement) {
        await this.getCalendarIcon(promptElement).click();
        return this.sleep(500);
    }

    async closeCalendar(promptElement) {
        if (!this.isWeb()) {
            await this.clickByXYPositionNoWait({
                elem: this.getCalendarIcon(promptElement),
                x: 5,
                y: 0 // click on the blank space to dismiss calendar
        });
        } else {
            await this.getWebClose(promptElement).click();
        }
        return this.sleep(500);
    }

    async openMonthDropDownMenu(promptElement) {
        return this.CalendarPicker.openMonthDropDownMenu();
    }

    async selectMonth(promptElement, month) {
        await this.CalendarPicker.selectMonth(month);
        
    }

    async clearAndInputYear(promptElement, year) {
        await this.CalendarPicker.clearAndInputYear(year);
    }

    async selectYearAndMonth(promptElement, year, month) {
       await this.CalendarPicker.selectYearAndMonth(year, month);
    }

    async selectDay(promptElement, day) {
        await this.CalendarPicker.selectDay(day);
    }

    async switchToLastYear(promptElement) {
        await this.CalendarPicker.switchToLastYear();
    }

    async switchToNextYear(promptElement) {
        await this.CalendarPicker.switchToNextYear();
    }
    

    async switchToLastMonth(promptElement) {
        await this.CalendarPicker.switchToLastMonth();
    }
    

    async switchToNextMonth(promptElement) {
        await this.CalendarPicker.switchToNextMonth();
    }

    async selectToday(promptElement) {
        await this.CalendarPicker.selectToday();
    }

    async clickHour(promptElement) {
        return this.getTimeHour(promptElement).click();
    }

    async clickMinute(promptElement) {
        return this.getTimeMinute(promptElement).click();
    }

    async clickSecond(promptElement) {
        return this.getTimeSecond(promptElement).click();
    }

    async clearAndInputHour(promptElement, hour) {
        await this.getTimeHour(promptElement).click();
        await browser.keys('Home');
        await browser.keys(['Shift', 'End']);
        await browser.keys('Delete');
        await this.getTimeHour(promptElement).setValue(hour);
        return this.sleep(500);
    }

    async clearAndInputMinute(promptElement, minute) {
        await this.getTimeMinute(promptElement).click();
        await browser.keys('Home');
        await browser.keys(['Shift', 'End']);
        await browser.keys('Delete');
        await this.getTimeMinute(promptElement).setValue(minute);
        return this.sleep(500);
    }

    async clearAndInputSecond(promptElement, second) {
        await this.getTimeSecond(promptElement).click();
        await browser.keys('Home');
        await browser.keys(['Shift', 'End']);
        await browser.keys('Delete');
        await this.getTimeSecond(promptElement).setValue(second);
        return this.sleep(500);
    }

    async toggleDynamicCalendar(promptElement) {
        await this.CalendarPicker.toggleDynamicCalendar();
    }

    async setOffsetInDynamicCalendar(promptElement, {period, offsetOperator, directions, times}) {
        
        await this.CalendarPicker.setOffsetInDynamicCalendar({period, offsetOperator, directions, times});
    }

    async checkExcludeWeekendsInDynamicCalendar(promptElement) {
        await this.CalendarPicker.checkExcludeWeekendsInDynamicCalendar();
    }

    async uncheckExcludeWeekendsInDynamicCalendar(promptElement) {
        await this.CalendarPicker.uncheckExcludeWeekendsInDynamicCalendar();
    }

    async checkAdjustmentInDynamicCalendar(promptElement) {
       await this.CalendarPicker.checkAdjustmentInDynamicCalendar();
    }

    async uncheckAdjustmentInDynamicCalendar(promptElement) {
        await this.CalendarPicker.uncheckAdjustmentInDynamicCalendar();
    }

    async selectAdjustmentSubtypeInDynamicCalendar(promptElement, subtype) {
        await this.CalendarPicker.selectAdjustmentSubtypeInDynamicCalendar(subtype);
    }

    async selectAdjustmentPeriodInDynamicCalendar(promptElement, period) {
        
        await this.CalendarPicker.selectAdjustmentPeriodInDynamicCalendar(period);
    }

    async inputAdjustmentDaysInDynamicCalendar(promptElement, days) {
       
        await this.CalendarPicker.inputAdjustmentDaysInDynamicCalendar(days);
    }

    async selectDayOfWeekForAdjustmentInDynamicCalendar(promptElement, dayOfWeeks) {
        await this.CalendarPicker.selectDayOfWeekForAdjustmentInDynamicCalendar(dayOfWeeks);
    
    }

    async selectAdjustDateInDynamicCalendar(promptElement, dateName) {
        await this.CalendarPicker.selectAdjustDateInDynamicCalendar(dateName);
        
    }

    async openAdjustmentMonthDayInputInDynamicCalendar(promptElement) {
       await this.CalendarPicker.openAdjustmentMonthDayInputInDynamicCalendar();
    }

    async openAdjustmentDateInputInDynamicCalendar(promptElement) {
        await this.CalendarPicker.openAdjustmentDateInputInDynamicCalendar();
    }

    async selectMonthAndDayInAdjustmentDateInputInDynamicCalendar(promptElement, month, day) {
        await this.CalendarPicker.selectMonthAndDayInAdjustmentDateInputInDynamicCalendar(month, day);
    }


    async clickDoneButtonInDynamicCalendar(promptElement) {
        await this.CalendarPicker.clickDoneButtonInDynamicCalendar();
    }

    /****************************************************************
     * Assertion helper
     ****************************************************************/

    async isCalendarOpen(promptElement) {
        return this.CalendarPicker.isCalendarOpen();
    }

    async getMonthValue(promptElement) {
        return this.CalendarPicker.getMonthValue();
    }

    async getYearValue(promptElement) {
        return this.CalendarPicker.getYearValue();
    }

    async getHourValue(promptElement) {
        return getInputValue(this.getTimeHour(promptElement));
    }

    async getMinuteValue(promptElement) {
        return getInputValue(this.getTimeMinute(promptElement));
    }

    async getSecondValue(promptElement) {
        return getInputValue(this.getTimeSecond(promptElement));
    }
    

    async isDynamicToggleOn(promptElement) {
        return this.CalendarPicker.isDynamicToggleOn();
    }

    async isDynamicToggleShow(promptElement) {
        return this.CalendarPicker.isDynamicToggleShow();
    }

    async getNewResolvedDateInDynamicCalendar(promptElement) {
        return this.CalendarPicker.getNewResolvedDateInDynamicCalendar();
    }

    async isDynamicSelection(promptElement) {
        const el = promptElement.$('.mstrCalendarAndTimePicker');
         const name = await getAttributeValue(el, 'className');
        return name.includes('isDynamic');
    }

    async getMonthYearValueInCalendar(promptElement) {
        return this.CalendarPicker.getMonthYearValueInCalendar();
    }

    async getAdjustmentDaysOptionsCountInDynamicCalendar(promptElement) {
        return this.CalendarPicker.getAdjustmentDaysOptionsCountInDynamicCalendar();
    }

    //get the value for today in forms of "mm/dd/yyyy"
    today() {
        let dateStr = moment();
        if (dateStr.month() < 10 && dateStr.day() < 10) {
            dateStr = moment().format('M/D/YYYY');
        } else if (dateStr.month() < 10 && dateStr.day() >= 10) {
            dateStr = moment().format('M/DD/YYYY');
        } else if (dateStr.month() >= 10 && dateStr.day() < 10) {
            dateStr = moment().format('MM/D/YYYY');
        } else {
            dateStr = moment().format('MM/DD/YYYY');
        }
        return dateStr;
    }

    
}
