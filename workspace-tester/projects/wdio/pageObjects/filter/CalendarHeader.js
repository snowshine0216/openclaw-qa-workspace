import BasePage from '../base/BasePage.js';
import { errorLog } from '../../config/consoleFormat.js';

export default class CalendarHeader extends BasePage {
    // element locator

    getHeaderContainer() {
        return this.$('.mstrd-CalStyleFilterDetailsPanel-header');
    }

    getInputFrom(inputElement) {
        return inputElement.$('.mstrd-CalStyleFilterFromToHeader-from');
    }

    getInputTo(inputElement) {
        return inputElement.$('.mstrd-CalStyleFilterFromToHeader-to');
    }

    getInputTop() {
        return this.getHeaderContainer().$('.mstrd-CalStyleFilterFromToHeader-top');
    }

    getInputBottom() {
        return this.getHeaderContainer().$('.mstrd-CalStyleFilterFromToHeader-bottom');
    }

    getInputBeforeAfter() {
        return this.getHeaderContainer().$('.mstrd-CalStyleFilterBeforeAfterOnHeader');
    }

    getDateInputForFrom() {
        return this.getInputFrom(this.getInputTop()).$('.mstrd-DateInput');
    }

    getDateInputForTo() {
        return this.getInputTo(this.getInputTop()).$('.mstrd-DateInput');
    }

    getTimeInputForFrom() {
        return this.getInputFrom(this.getInputBottom()).$('.mstrd-TimeInput');
    }

    getTimeInputForTo() {
        return this.getInputTo(this.getInputBottom()).$('.mstrd-TimeInput');
    }

    getTimeInputForOnFrom() {
        return this.getInputBeforeAfter().$$('.mstrd-TimeInput')[0];
    }

    getTimeInputForOnTo() {
        return this.getInputBeforeAfter().$$('.mstrd-TimeInput')[1];
    }

    getInputTime() {
        return this.getHeaderContainer().$('.mstrd-TimeInput');
    }

    getInputMonth(inputElement) {
        return inputElement.$('.mstrd-DateInput-month');
    }

    getInputDay(inputElement) {
        return inputElement.$('.mstrd-DateInput-day');
    }

    getInputYear(inputElement) {
        return inputElement.$('.mstrd-DateInput-year');
    }

    getInputHour(inputElement) {
        return inputElement.$('.mstrd-TimeInput-hour');
    }

    getInputMinute(inputElement) {
        return inputElement.$('.mstrd-TimeInput-minute');
    }

    getInputSecond(inputElement) {
        return inputElement.$('.mstrd-TimeInput-second');
    }

    getInputAMPM(inputElement) {
        return inputElement.$('.mstrd-TimeInput-ampm');
    }

    getExpandDynamicDateOptions() {
        return this.getHeaderContainer().$('.mstrd-CalFilterTypeDropdownSelector-arrow.icon-menu-arrow');
    }

    getDynamicDateContextMenu() {
        return this.$('.mstrd-CalFilterTypeDropdownSelector-dropdownMenu');
    }

    getDynamicDateOptions(name) {
        return this.getDynamicDateContextMenu()
            .$$('li')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === name;
            })[0];
    }

    getDynamicHeaderSummary() {
        return this.getHeaderContainer().$('div > span:last-child');
    }

    getDateInputBox() {
        return this.$('.mstrd-DateInput-wrapper');
    }

    getDateInputBoxItems() {
        return this.getDateInputBox().$$('.mstrd-Date');
    }

    getDateInputBoxSeperator() {
        return this.getDateInputBox().$$('.mstrd-Date.mstrd-DateInput-sep')[0];
    }

    // Action helper

    async expandDynamicDateOptions() {
        await this.getExpandDynamicDateOptions().click();
        await this.waitForElementVisible(this.getDynamicDateContextMenu(), {
            timeout: 5000,
            msg: 'Expanding calendar filter type dropdown takes too long.',
        });
    }

    async selectDynamicDateOptions(name) {
        await this.getDynamicDateOptions(name).click();
        await this.waitForElementStaleness(this.getDynamicDateContextMenu(), {
            timeout: 5000,
            msg: 'Selecting calendar filter type takes too long ',
        });
    }

    // Set Input From, To as Given Date

    async setInputDateUnitWithValue({ partialDate, customValue }) {
        if (customValue) {
            await this.click({ elem: partialDate });
            await this.hover({ elem: partialDate });
            await this.input(customValue);
            return this.waitForTextPresentInElementValue(partialDate, customValue, {
                timeout: this.DEFAULT_API_TIMEOUT * 2,
            });
        }
    }

    async setInputTimeUnitWithValue({ partialTime, customValue }) {
        await this.click({ elem: partialTime });
        await this.hover({ elem: partialTime });
        await this.input(customValue);
        return this.waitForTextPresentInElementValue(partialTime, customValue, {
            timeout: this.DEFAULT_API_TIMEOUT * 2,
        });
    }

    async setInputDateOfFrom({ customMonth, customDay, customYear }) {
        await this.setInputDateUnitWithValue({
            partialDate: this.getInputMonth(this.getDateInputForFrom()),
            customValue: customMonth,
        });
        await this.setInputDateUnitWithValue({
            partialDate: this.getInputDay(this.getDateInputForFrom()),
            customValue: customDay,
        });
        return this.setInputDateUnitWithValue({
            partialDate: this.getInputYear(this.getDateInputForFrom()),
            customValue: customYear,
        });
    }

    async setInputDateOfTo({ customMonth, customDay, customYear }) {
        await this.setInputDateUnitWithValue({
            partialDate: this.getInputMonth(this.getDateInputForTo()),
            customValue: customMonth,
        });
        await this.setInputDateUnitWithValue({
            partialDate: this.getInputDay(this.getDateInputForTo()),
            customValue: customDay,
        });
        await this.setInputDateUnitWithValue({
            partialDate: this.getInputYear(this.getDateInputForTo()),
            customValue: customYear,
        });
        return this.sleep(1000);
    }

    async setInputTimeOfFrom({ customHour, customMin, customSec, customAMPM }) {
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputHour(this.getTimeInputForFrom()),
            customValue: customHour,
        });
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputMinute(this.getTimeInputForFrom()),
            customValue: customMin,
        });
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputSecond(this.getTimeInputForFrom()),
            customValue: customSec,
        });
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputAMPM(this.getTimeInputForFrom()),
            customValue: customAMPM,
        });
        return this.sleep(1000);
    }

    async setInputTimeOfTo({ customHour, customMin, customSec, customAMPM }) {
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputHour(this.getTimeInputForTo()),
            customValue: customHour,
        });
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputMinute(this.getTimeInputForTo()),
            customValue: customMin,
        });
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputSecond(this.getTimeInputForTo()),
            customValue: customSec,
        });
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputAMPM(this.getTimeInputForTo()),
            customValue: customAMPM,
        });
        return this.sleep(1000);
    }

    async setInputDateOfBeforeAfter({ customMonth, customDay, customYear }) {
        await this.setInputDateUnitWithValue({
            partialDate: this.getInputMonth(this.getInputBeforeAfter()),
            customValue: customMonth,
        });
        await this.setInputDateUnitWithValue({
            partialDate: this.getInputDay(this.getInputBeforeAfter()),
            customValue: customDay,
        });
        await this.setInputDateUnitWithValue({
            partialDate: this.getInputYear(this.getInputBeforeAfter()),
            customValue: customYear,
        });
        return this.sleep(1000);
    }

    async setInputTimeOfBeforeAfter({ customHour, customMin, customSec, customAMPM }) {
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputHour(this.getInputBeforeAfter()),
            customValue: customHour,
        });
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputMinute(this.getInputBeforeAfter()),
            customValue: customMin,
        });
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputSecond(this.getInputBeforeAfter()),
            customValue: customSec,
        });
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputAMPM(this.getInputBeforeAfter()),
            customValue: customAMPM,
        });
        return this.sleep(1000);
    }

    async setInputTimeOfOnFrom({ customHour, customMin, customSec, customAMPM }) {
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputHour(this.getTimeInputForOnFrom()),
            customValue: customHour,
        });
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputMinute(this.getTimeInputForOnFrom()),
            customValue: customMin,
        });
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputSecond(this.getTimeInputForOnFrom()),
            customValue: customSec,
        });
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputAMPM(this.getTimeInputForOnFrom()),
            customValue: customAMPM,
        });
        return this.sleep(1000);
    }

    async setInputTimeOfOnTo({ customHour, customMin, customSec, customAMPM }) {
        const timeInput = this.getTimeInputForOnTo();
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputHour(timeInput),
            customValue: customHour,
        });
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputMinute(timeInput),
            customValue: customMin,
        });
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputSecond(timeInput),
            customValue: customSec,
        });
        await this.setInputTimeUnitWithValue({
            partialTime: this.getInputAMPM(timeInput),
            customValue: customAMPM,
        });
        return this.sleep(1000);
    }

    // Set Input From Keyboard

    async selectInputMonthOfFrom() {
        // add focus here to avoid the issue of the date input box not being focused
        await this.executeScript('arguments[0].focus()', await this.getInputMonth(this.getDateInputForFrom()));
        await this.getInputMonth(this.getDateInputForFrom()).click();
        await this.hover({ elem: this.getInputMonth(this.getDateInputForFrom()) });
        return this.sleep(1000); // Wait for animation to complete
    }

    async selectInputDayOfFrom() {
        await this.executeScript('arguments[0].focus()', await this.getInputDay(this.getDateInputForFrom()));
        await this.getInputDay(this.getDateInputForFrom()).click();
        await this.hover({ elem: this.getInputDay(this.getDateInputForFrom()) });
        return this.sleep(1000); // Wait for animation to complete
    }

    async selectInputYearOfFrom() {
        await this.executeScript('arguments[0].focus()', await this.getInputYear(this.getDateInputForFrom()));
        await this.getInputYear(this.getDateInputForFrom()).click();
        await this.hover({ elem: this.getInputYear(this.getDateInputForFrom()) });
        return this.sleep(1000); // Wait for animation to complete
    }

    async selectInputMonthOfTo() {
        await this.executeScript('arguments[0].focus()', await this.getInputMonth(this.getDateInputForTo()));
        await this.getInputMonth(this.getDateInputForTo()).click();
        await this.hover({ elem: this.getInputMonth(this.getDateInputForTo()) });
        return this.sleep(1000); // Wait for animation to complete
    }

    async selectInputDayOfTo() {
        await this.executeScript('arguments[0].focus()', await this.getInputDay(this.getDateInputForTo()));
        await this.getInputDay(this.getDateInputForTo()).click();
        await this.hover({ elem: this.getInputDay(this.getDateInputForTo()) });
        return this.sleep(1000); // Wait for animation to complete
    }

    async selectInputYearOfTo() {
        await this.executeScript('arguments[0].focus()', await this.getInputYear(this.getDateInputForTo()));
        await this.getInputYear(this.getDateInputForTo()).click();
        await this.hover({ elem: this.getInputYear(this.getDateInputForTo()) });
        return this.sleep(2000); // Wait for animation to complete
    }

    async selectInputMonthOfBeforeAfter() {
        await this.getInputMonth(this.getInputBeforeAfter()).click();
        await this.hover({ elem: this.getInputMonth(this.getInputBeforeAfter()) });
        return this.sleep(1000); // Wait for animation to complete
    }

    async selectInputDayOfBeforeAfter() {
        await this.getInputDay(this.getInputBeforeAfter()).click();
        await this.hover({ elem: this.getInputDay(this.getInputBeforeAfter()) });
        return this.sleep(1000); // Wait for animation to complete
    }

    async selectInputYearOfBeforeAfter() {
        await this.getInputYear(this.getInputBeforeAfter()).click();
        await this.hover({ elem: this.getInputYear(this.getInputBeforeAfter()) });
        return this.sleep(1000); // Wait for animation to complete
    }

    async sendKeyToInput(theKey) {
        await this.arrow(theKey);
        return this.sleep(1000); // Wait for animation to complete
    }

    // Assertion helper

    async inputMonthOfFrom() {
        return this.getInputMonth(this.getDateInputForFrom()).getAttribute('value');
    }

    async inputDayOfFrom() {
        return this.getInputDay(this.getDateInputForFrom()).getAttribute('value');
    }

    async inputYearOfFrom() {
        return this.getInputYear(this.getDateInputForFrom()).getAttribute('value');
    }

    async inputHourOfFrom() {
        return this.getInputHour(this.getTimeInputForFrom()).getAttribute('value');
    }

    async inputMinuteOfFrom() {
        return this.getInputMinute(this.getTimeInputForFrom()).getAttribute('value');
    }

    async inputAMPMOfFrom() {
        return this.getInputAMPM(this.getTimeInputForFrom()).getAttribute('value');
    }

    async inputMonthOfTo() {
        return this.getInputMonth(this.getDateInputForTo()).getAttribute('value');
    }

    async inputDayOfTo() {
        return this.getInputDay(this.getDateInputForTo()).getAttribute('value');
    }

    async inputYearOfTo() {
        return this.getInputYear(this.getDateInputForTo()).getAttribute('value');
    }

    async inputHourOfTo() {
        return this.getInputHour(this.getTimeInputForTo()).getAttribute('value');
    }

    async inputMinuteOfTo() {
        return this.getInputMinute(this.getTimeInputForTo()).getAttribute('value');
    }

    async inputAMPMOfTo() {
        return this.getInputAMPM(this.getTimeInputForTo()).getAttribute('value');
    }

    async inputMonthOfBeforeAfter() {
        return this.getInputMonth(this.getInputBeforeAfter()).getAttribute('value');
    }

    async inputDayOfBeforeAfter() {
        return this.getInputDay(this.getInputBeforeAfter()).getAttribute('value');
    }

    async inputYearOfBeforeAfter() {
        return this.getInputYear(this.getInputBeforeAfter()).getAttribute('value');
    }

    async inputHourOfBeforeAfter() {
        return this.getInputHour(this.getInputBeforeAfter()).getAttribute('value');
    }

    async inputMinuteOfBeforeAfter() {
        return this.getInputMinute(this.getInputBeforeAfter()).getAttribute('value');
    }

    async inputAMPMOfBeforeAfter() {
        return this.getInputAMPM(this.getInputBeforeAfter()).getAttribute('value');
    }

    async isInputBoxUnset() {
        const isFromUnset = await this.$('.mstrd-CalStyleFilterFromToHeader-fromIsUnset').isDisplayed();
        const isToUnset = await this.$('.mstrd-CalStyleFilterFromToHeader-toIsUnset').isDisplayed();
        return isFromUnset && isToUnset;
    }

    async isInputBeforeUnset() {
        return this.$(
            '.mstrd-CalStyleFilterBeforeAfterOnHeader-isBefore.mstrd-CalStyleFilterBeforeAfterOnHeader-unset'
        ).isDisplayed();
    }

    async isInputAfterUnset() {
        return this.$(
            '.mstrd-CalStyleFilterBeforeAfterOnHeader-isAfter.mstrd-CalStyleFilterBeforeAfterOnHeader-unset'
        ).isDisplayed();
    }

    async isInputAnyDateSelected() {
        return this.$('.mstrd-DateInput--selected').isDisplayed();
    }

    async isTimeInputPresent() {
        return this.getInputTime().isDisplayed();
    }

    async isBeforeSelected() {
        return this.$('.mstrd-CalStyleFilterBeforeAfterOnHeader-isBefore').isDisplayed();
    }

    async isAfterSelected() {
        return this.$('.mstrd-CalStyleFilterBeforeAfterOnHeader-isAfter').isDisplayed();
    }

    async isOnSelected() {
        return this.$('.mstrd-CalStyleFilterBeforeAfterOnHeader-isOn').isDisplayed();
    }

    async dynamicHeaderSummaryText() {
        return this.getDynamicHeaderSummary().getText();
    }

    async dateOnWidgetHeader() {
        const sep = await this.getDateInputBoxSeperator().getText();
        const items = await this.getDateInputBoxItems();
        let date = '';
        if ((await items.length) === 5) {
            for (let i = 0; i < items.length; i += 2) {
                const ele = await this.getDateInputBoxItems();
                const value = await ele[i].getAttribute('value');
                date += value;
                date += sep;
            }

            if (date.length > 0) {
                date = date.slice(0, date.length - 1);
            }
        } else {
            errorLog('Error! Calendar DataInputBox items should be 5');
        }
        return date;
    }
}
