
import moment from 'moment';
import { getInputValue, getAttributeValue} from '../../utils/getAttributeValue.js';
import basePage from '../base/BasePage.js';


export default class CalendarPicker extends basePage {
    /****************************************************************
     * Element locator
     ****************************************************************/

    getCalendarWidget() {
        return this.$$('.mstrCalendar.mstrAsPopup, .mstr-date-picker-with-input-popover').filter(async (elem) => (await elem.isDisplayed()))[0];
    } 

    getCalendarLastYear() {
        return this.getCalendarWidget().$('.icon-calendar-year-previous');
    }

    getCalendarNextYear() {
        return this.getCalendarWidget().$('.icon-calendar-year-next');
    }

    getCalendarLastMonth() {
        return this.getCalendarWidget().$('.icon-calendar-month-previous');
    }

    getCalendarNextMonth() {
        return this.getCalendarWidget().$('.icon-calendar-month-next');
    }


    getCalendarYear() {
        return this.getCalendarWidget().$('.mstr-rc-3-calendar-caption__title');
    }


    getYearMonthPicker() {
        return this.getCalendarWidget().$('.mstr-date-picker-year-month-picker');
    }

    getYearMonthPickerTitle() {
        return this.getYearMonthPicker().$('.mstr-date-picker-year-month-picker-title');
    }

    getYearMonthPickerOptionByName(name) {
        return this.getYearMonthPicker().$$('.mstr-date-picker-year-month-picker-option').filter(async (elem) => (await elem.getText()) === name)[0];
    }

    getYearMonthPickerDoneButton() {
        return this.getYearMonthPicker().$('.mstr-date-picker-year-month-picker-footer button');
    }

    getCalendarMonth() {
        if (!this.isWeb()) {
            return this.getCalendarYear();
        } else {
            return this.getCalendarWidget().$('span[id*="month"]');
        }
    }

    getMonthList() {
        if (!this.isWeb()) {
            return this.getYearMonthPicker().$$('.mstr-date-picker-year-month-picker-option');
        } else {
            return this.getCalendarWidget().$$('option');
        }
    }

    getCalendarDay() {
        return this.getCalendarWidget().$$('.rdp-cell .rdp-day');
    }

    getCalendarShowDynamicToggle() {
        return this.getCalendarWidget().$('.mstr-date-time-picker-switch-label .mstr-rc-3-switch');
    }

    getDynamicCalendarWidget() {
        return this.getCalendarWidget().$('.mstrDynamicDatePickerContainer, .mstr-date-picker-container');
    }

    getDayoffsetInDynamicCalendar() {
        return this.getDynamicCalendarWidget().$('.day-offset-combo');
    }

    getMonthoffsetInDynamicCalendar() {
        return this.getDynamicCalendarWidget().$('.month-offset-combo');
    }

    getOffsetOperatorInDynamicCalendar(elem) {
        return elem.$('.mstr-offset-select');
    }

    getDropdownInDynamicCalendar() {
        return this.getDynamicCalendarWidget().$$('.mstr-select-dropdown').filter(async (elem) => (await elem.isDisplayed()))[0];
    }

    getDropdownOptionByNameInDynamicCalendar(optionName) {
        return this.getDropdownInDynamicCalendar().$$('.mstr-select-option').filter(async (elem) => {
            const name = await elem.getText();
            return name === optionName;
        })[0];
    }

    geOffsetArrowUpInDynamicCalendar(elem) {
        return elem.$('.mstr-rc-3-number-input__suffix button[aria-label="Arrow up"]');
    }

    getOffsetInput(elem) {
        return elem.$('.mstr-offset-input');
    }

    getOffsetArrowDownInDynamicCalendar(elem) {
        return elem.$('.mstr-rc-3-number-input__suffix button[aria-label="Arrow down"]');
    }

    getExcludeWeekendsCheckboxInDynamicCalendar() {
        return this.getDynamicCalendarWidget().$('.exclude-weekends-indicator-switch');
    }

    getAdjustmentCheckboxInDynamicCalendar() {
        return this.getDynamicCalendarWidget().$('.adjustment-indicator-switch');
    }

    getAdjustmentSubtypeInDynamicCalendar() {
        return this.getDynamicCalendarWidget().$('.adjustment-subtype-select');
    }

    getAdjustmentPeriodInDynamicCalendar() {
        return this.getDynamicCalendarWidget().$('.adjustment-period-select');
    }

    getAdjustmentDetailsInDynamicCalendar() {
        return this.getDynamicCalendarWidget().$('.adjustment-detail-select');
    }

    getAdjustmentDaysInputInDynamicCalendar() {
        return this.getAdjustmentDetailsInDynamicCalendar().$('.mstr-rc-3-number-input');
    }

    getAdjustmentDayOfWeekSelectionInDynamicCalendar() {
        return this.getAdjustmentDetailsInDynamicCalendar().$$('button');
    }

    getAdjustmentDateInputInDynamicCalendar() {
        return this.getAdjustmentDetailsInDynamicCalendar().$('.month-day-select');
    }

    getAdjustmentDateListItemByNameInDynamicCalendar(itemName) {
        return this.getDynamicCalendarWidget().$$('.scroll-select-list .scroll-select-item').filter(async (elem) => {
            const name = await elem.getText();
            return name === itemName;
        })[0];
    }

    getAdjustmentMonthDayPopupInDynamicCalendar() {
        return this.getDynamicCalendarWidget().$('.month-day-select-popup');
    }

    getAdjustmentMonthOptionByNameInDynamicCalendar(name) {
        return this.getAdjustmentMonthDayPopupInDynamicCalendar().$$('.month-select-select .scroll-select-item').filter(async (elem) => {
            const monthName = await elem.getText();
            return monthName === name;
        })[0];
    }

    getAdjustmentDayOptionsInDynamicCalendar() {
        return this.getAdjustmentMonthDayPopupInDynamicCalendar().$$('.day-select-select .scroll-select-item');
    }

    getAdjustmentDayOptionByNameInDynamicCalendar(name) {
        return this.getAdjustmentDayOptionsInDynamicCalendar().filter(async (elem) => {
            const dayName = await elem.getText();
            return dayName === name;
        })[0];
    }

    getPreviewInDynamicCalendar() {
        return this.getDynamicCalendarWidget().$('.date-preview');
    }

    getResolvedDateInDynamicCalendar() {
        return this.getPreviewInDynamicCalendar().$('.date-preview-resolved-day');
    }

    getDynamicCalendarButtonByName(name) {
        return this.getDynamicCalendarWidget().$$('.date-picker-footer-buttons button').filter(async (elem) => {
            const buttonName = await elem.getText();
            return buttonName.includes(name);
        })[0];
    }

    
    /****************************************************************
     * Action helper
     ****************************************************************/


    async openMonthDropDownMenu() {
        return this.getCalendarMonth().click();
    }

    async selectMonth(month) {
        await this.getMonthList()
            .filter(async (elem) => {
                const promptMonth = await elem.getText();
                return promptMonth.includes(month);
            })[0]
            .click();
        await this.getYearMonthPickerDoneButton().click();
        return this.sleep(500);
        
    }

    async clearAndInputYear(year) {
        await this.getCalendarYear().click();
        await this.getYearMonthPickerOptionByName(year).click();
        await this.getYearMonthPickerDoneButton().click();
        return this.sleep(500);
    }

    async selectYearAndMonth(year, month) {
        await this.getCalendarYear().click();
        await this.getYearMonthPickerOptionByName(year).click();
        await this.getYearMonthPickerOptionByName(month).click();
        await this.getYearMonthPickerDoneButton().click();
        return this.sleep(500);
    }

    async selectDay(day) {
        return this.getCalendarDay()
            .filter(async (elem) => {
                const promptDay = await elem.getText();
                return promptDay === day;
            })[0]
            .click();
    }

    async switchToLastYear() {
        await this.getCalendarLastYear().click();
        return this.sleep(500);
    }

    async switchToNextYear() {
        await this.getCalendarNextYear().click();
        return this.sleep(500);
    }

    async switchToLastMonth() {
        await this.getCalendarLastMonth().click();
        return this.sleep(500);
    }

    async switchToNextMonth() {
        await this.getCalendarNextMonth().click();
        return this.sleep(500);
    }

    async selectToday() {
        await this.toggleDynamicCalendar();
        await this.clickDoneButtonInDynamicCalendar();
        return this.sleep(500);
    }

    
    async toggleDynamicCalendar() {
        await this.getCalendarShowDynamicToggle().click();
        return this.sleep(500);
    }

    async setOffsetInDynamicCalendar({period, offsetOperator, directions, times}) {
        const offsetElem = period === 'Day' ? this.getDayoffsetInDynamicCalendar() : this.getMonthoffsetInDynamicCalendar();
        // change offset operator
        if (offsetOperator) {
            const offsetOperatorElem = this.getOffsetOperatorInDynamicCalendar(offsetElem);
            const currentOperator = await offsetOperatorElem.getText();
            // change operator if needed
            if (!(currentOperator.includes(offsetOperator))) {
                await offsetOperatorElem.click();
                await this.getDropdownOptionByNameInDynamicCalendar(offsetOperator).click();
                await this.sleep(500);
            }
        }
        if (directions) {
            const arrowElem = directions === 'Up' ? this.geOffsetArrowUpInDynamicCalendar(offsetElem) : this.getOffsetArrowDownInDynamicCalendar(offsetElem);
            for (let i = 0; i < times; i++) {
                await arrowElem.click();
                await this.sleep(200);
            }
        }
    }

     async setOffsetByInputValueInDynamicCalendar({period, offsetOperator, value}) {
        const offsetElem = period === 'Day' ? this.getDayoffsetInDynamicCalendar() : this.getMonthoffsetInDynamicCalendar();
        // change offset operator
        if (offsetOperator) {
            const offsetOperatorElem = this.getOffsetOperatorInDynamicCalendar(offsetElem);
            const currentOperator = await offsetOperatorElem.getText();
            // change operator if needed
            if (!(currentOperator.includes(offsetOperator))) {
                await offsetOperatorElem.click();
                await this.getDropdownOptionByNameInDynamicCalendar(offsetOperator).click();
                await this.sleep(500);
            }
        }
        const el = this.getOffsetInput(offsetElem);
        await this.clear({ elem: el }, true);
        await el.setValue(value);
        await this.clickByXYPosition({elem: el, x: 20, y: 0}); // click outside to trigger the change
        return this.sleep(500);
    }

    async checkExcludeWeekendsInDynamicCalendar() {
        const el = this.getExcludeWeekendsCheckboxInDynamicCalendar();
        const isUnChecked = await this.isUnSelected(el.$('.exclude-weekends-indicator-switch__icon'));
        if (isUnChecked) {
            await el.click();
            return this.sleep(500);
        }
    }

    async uncheckExcludeWeekendsInDynamicCalendar() {
        const el = this.getExcludeWeekendsCheckboxInDynamicCalendar();
        const isUnChecked = await this.isUnSelected(el.$('.exclude-weekends-indicator-switch__icon'));
        if (!isUnChecked) {
            await el.click();
            return this.sleep(500);
        }
    }

    async checkAdjustmentInDynamicCalendar() {
        const el = this.getAdjustmentCheckboxInDynamicCalendar();
        const isChecked = await this.isUnSelected(el.$('.adjustment-indicator-switch__icon'));
        if (isChecked) {
            await el.click();
            return this.sleep(500);
        }
    }

    async uncheckAdjustmentInDynamicCalendar() {
        const el = this.getAdjustmentCheckboxInDynamicCalendar();
        const isChecked = await this.isUnSelected(el.$('.adjustment-indicator-switch__icon'));
        if (!isChecked) {
            await el.click();
            return this.sleep(500);
        }
    }

    async selectAdjustmentSubtypeInDynamicCalendar(subtype) {
        const el = this.getAdjustmentSubtypeInDynamicCalendar();
        const adjustSubtypeValue = await el.getText();
        if (adjustSubtypeValue !== subtype) {
            await el.click();
            await this.getDropdownOptionByNameInDynamicCalendar(subtype).click();
            await this.sleep(500);
        }
    }

    async selectAdjustmentPeriodInDynamicCalendar(period) {
        const el = this.getAdjustmentPeriodInDynamicCalendar();
        const adjustPeriodValue = await el.getText();
        if (adjustPeriodValue !== period) {
            await el.click();
            await this.getDropdownOptionByNameInDynamicCalendar(period).click();
            await this.sleep(500);
        }
    }

    async inputAdjustmentDaysInDynamicCalendar(days) {
        const el = this.getAdjustmentDaysInputInDynamicCalendar();
        await el.click();
        await this.clear({ elem: el}, true);
        await el.setValue(days);
        return this.sleep(500);
    }

    async selectDayOfWeekForAdjustmentInDynamicCalendar(dayOfWeeks) {
        const dayOfWeekSelections = this.getAdjustmentDayOfWeekSelectionInDynamicCalendar();
        // loop dayOfWeekSelections, if the current element text is diffenet from the same index of pram dayOfWeeks, then select it to open the dropdown and choose the correct one
        const len = await dayOfWeekSelections.length;
        for (let i = 0; i < len; i++) {
            const selection = dayOfWeekSelections[i];
            const selectionText = await selection.getText();
            if (selectionText.includes(dayOfWeeks[i]) === false) {
                await selection.click();
                await this.waitForElementVisible(this.getDropdownInDynamicCalendar());
                await this.getDropdownOptionByNameInDynamicCalendar(dayOfWeeks[i]).click();
                await this.sleep(500);
            }
        }
    }

    async selectAdjustDateInDynamicCalendar(dateName) {
        const el = this.getAdjustmentDayOfWeekSelectionInDynamicCalendar();
        await el.click();
        for (const dateItem of dateName) {
            await this.getAdjustmentDateListItemByNameInDynamicCalendar(dateItem).click();
            await this.sleep(500);
        }
        
    }

    async openAdjustmentMonthDayInputInDynamicCalendar() {
        await this.getAdjustmentMonthDayInputInDynamicCalendar().click();
        return this.sleep(500);
    }

    async openAdjustmentDateInputInDynamicCalendar() {
        await this.getAdjustmentDateInputInDynamicCalendar().click();
        return this.sleep(500);
    }

    async selectMonthAndDayInAdjustmentDateInputInDynamicCalendar(month, day) {
        await this.openAdjustmentDateInputInDynamicCalendar();
        await this.getAdjustmentMonthOptionByNameInDynamicCalendar(month).click();
        await this.sleep(500);
        await this.getAdjustmentDayOptionByNameInDynamicCalendar(day).click();
        await this.sleep(500);
        await this.openAdjustmentDateInputInDynamicCalendar();
    }


    async clickDoneButtonInDynamicCalendar() {
        await this.getDynamicCalendarButtonByName('Done').click();
    }

    /****************************************************************
     * Assertion helper
     ****************************************************************/

    async isCalendarOpen() {
        return this.getCalendarWidget().isDisplayed();
    }

    async getMonthValue() {
        const text = await this.getCalendarMonth().getText();
        const monthMatch = text.match(/\b([A-Za-z]+)\b/);
        return monthMatch ? monthMatch[1] : null;
    }

    async getYearValue() {
        const text = await this.getCalendarYear().getText();
        const yearMatch = text.match(/\b(\d{4})\b/);
        return yearMatch ? yearMatch[1] : null;
    }

    

    async isDynamicToggleOn() {
        return this.isAriaChecked(this.getCalendarShowDynamicToggle());
    }

    async isDynamicToggleShow() {
        return this.getCalendarShowDynamicToggle().isDisplayed();
    }

    async getNewResolvedDateInDynamicCalendar() {
        return this.getResolvedDateInDynamicCalendar().getText();
    }
  

    async getMonthYearValueInCalendar() {
        return this.getCalendarYear().getText();
    }

    async getAdjustmentDaysOptionsCountInDynamicCalendar() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let daysCount = [];
        // open the adjustment date input dropdown
        await this.openAdjustmentDateInputInDynamicCalendar();
        // select each month and get the days count
        for (const month of months) {
            await this.getAdjustmentMonthOptionByNameInDynamicCalendar(month).click();
            await this.sleep(500);
            const daysOptions = this.getAdjustmentDayOptionsInDynamicCalendar();
            const count = await daysOptions.length;
            daysCount.push({ month: month, days: count });
        }
        await this.openAdjustmentDateInputInDynamicCalendar();
        return daysCount;
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
