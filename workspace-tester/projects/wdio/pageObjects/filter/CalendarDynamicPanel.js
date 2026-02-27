import BasePage from '../base/BasePage.js';
import { getAttributeValue, getInputValue } from '../../utils/getAttributeValue.js';




export default class CalendarDynamicPanel extends BasePage {
    // Element Locator

    getContainer() {
        return this.$(`//div[@class='mstr-react-date-time-picker' and not(ancestor::*[contains(@class, 'Attr-Qual-InputBox')])]`);
    }

    getDynamicOptions() {
        return this.getContainer().$('.mstr-react-date-time-picker-radio-group');
    }

    getDynamicOption(radio) {
        return this.getDynamicOptions().$$('.mstr-react-date-time-picker-radio-label').filter(async (elem) => (await elem.getText()) === radio)[0];
    }

    getCustomOperatorOption(name) {
        return this.getContainer().$('.mstr-react-date-time-picker-tabs-tablist').$$('.mstr-react-date-time-picker-tabs-tab').filter(async (elem) => (await elem.getText()) === name)[0];
    }

    getFrom() {
        return this.getContainer().$(`//div[contains(@class, 'mstr-date-time-range-picker-two-cols-layout')]/div[text()='From' or text()='Von']/following-sibling::div[1]`);
    }

    getTo() {
        return this.getContainer().$(`//div[contains(@class, 'mstr-date-time-range-picker-two-cols-layout')]/div[text()='To' or text()='Zu']/following-sibling::div[1]`);
    }

    getFromInput() {
        return this.getFrom().$('.mstr-date-picker-with-input-input');
    }

    getFromTimeInput() {
        return this.getFrom().$('.mstr-time-picker');
    }

    getToInput() {
        return this.getTo().$('.mstr-date-picker-with-input-input');
    }

    getToTimeInput() {
        return this.getTo().$('.mstr-time-picker');
    }

    getCustomOperatorTab() {
        return this.getContainer().$('.mstr-date-picker-with-input-container');
    }

    getCustomOperatorInput() {
        return this.getCustomOperatorTab().$('input');
    }

    getCustomOperatorTimeInput() {
        return this.$('.mstr-time-picker__container input');
    }

    getDatePickerIcon(ele) {
        return ele.$('.mstr-date-picker-with-input-input-calendar-icon');
    }

    getLastNextContextMenuContainer() {
        return this.$('.mstr-date-time-range-picker-last-next-input');
    }

    getLastNextDropDownSelector() {
        return this.getLastNextContextMenuContainer().$('.mstr-date-time-range-picker-last-next-input-direction');
    }

    getDayWeekDropDownSelector() {
        return this.getLastNextContextMenuContainer().$('.mstr-date-time-range-picker-last-next-input-unit');
    }

    getLastNextDropDownOption(name) {
        return this.$$('.mstr-select-dropdown .mstr-select-option').filter(async (li) => (await li.getText()) === name)[0];
    }

    getLastNextNumberInput() {
        return this.getLastNextContextMenuContainer().$('.mstr-date-time-range-picker-last-next-input-amount input');
    }

    getLastNextNumberStepper(direction = 'up') {
        const index = direction.toLowerCase() === 'down' ? 1 : 0;
        return this.getLastNextContextMenuContainer().$('.mstr-date-time-range-picker-last-next-input-amount .mstr-rc-3-number-input__suffix__button').$$('input')[index];
    }

    getApplyButton() {
        return this.getContainer().$('.mstr-rc-3-button--primary');
    }


    // Action Helper

    async selectDynamicOption(radio) {
        const els = this.getDynamicOptions().$$('.mstr-react-date-time-picker-radio-label');
        await this.waitForElementClickable(this.getDynamicOption(radio), {
            timeout: 2000,
            msg: `${radio} is not clickable.`,
        });
        return this.getDynamicOption(radio).click();
    }

    async selectCustomOperatorOption(name) {
        await this.click({ elem: this.getCustomOperatorOption(name) });
    }

    async openFromDatePicker() {
        await this.click({ elem: this.getDatePickerIcon(this.getFrom()) });
    }

    async openToDatePicker() {
        await this.click({ elem: this.getDatePickerIcon(this.getTo()) });
    }
    
    async openCustomOperatorDatePicker() {
        await this.click({ elem: this.getDatePickerIcon(this.getCustomOperatorTab()) });
        return this.sleep(500); // wait date picker render
    }

    async setCustomOperatorInput(value) {
        const el = this.getCustomOperatorInput();
        await el.click();
        await this.clear({ elem: el });
        await el.setValue(value);
        await this.clickByXYPosition({ elem: el , x: 0, y: 30 }); // click outside to trigger the change event
    }

    async setFromInputValue(value) {
        const el = this.getFromInput();
        await el.click();
        await this.clear({ elem: el });
        await el.setValue(value);
        await this.clickByXYPosition({ elem: el , x: 0, y: 30 }); // click outside to trigger the change event
    }

    async setToInputValue(value) {
        const el = this.getToInput();
        await el.click();
        await this.clear({ elem: el });
        await el.setValue(value);
        await this.clickByXYPosition({ elem: el , x: 0, y: 20 }); // click outside to trigger the change event
    }

    async setLastNextNumberInputWithValue(value, expectedValue) {
        const el = this.getLastNextNumberInput();
        await this.clear({ elem: el });
        await el.setValue(value);
        await this.clickByXYPosition({ elem: el , x: 0, y: 20 }); // click outside to trigger the change event
        if (expectedValue) {
            await this.waitForTextPresentInElementValue(el, expectedValue);
        } else {
            await this.waitForTextPresentInElementValue(el, value);
        }
        return this.sleep(500); // wait GUI static rendering when input invlid value

    }

    async setLastNextRelativeRange({ prefix, value, unit, expectedValue = value }) {
        await this.waitForElementVisible(this.getLastNextContextMenuContainer());
        // set last/next
        const currentPrefix = await this.getLastNextDropDownSelector().getText();
        if (currentPrefix.includes(prefix) === false) {
            await this.click({ elem: this.getLastNextDropDownSelector() });
            await this.click({ elem: this.getLastNextDropDownOption(prefix) });
        }
        // set input value
        await this.setLastNextNumberInputWithValue(value, expectedValue);

        // set day/week/month/year
        const currentUnit = await this.getDayWeekDropDownSelector().getText();
        if (currentUnit.includes(unit) === false) {
            await this.click({ elem: this.getDayWeekDropDownSelector() });
            await this.click({ elem: this.getLastNextDropDownOption(unit) });
        }
        
    }

    async setTimeInputValue({ operator = 'Between', ele = 'from', timeValue }) {
        let timeInput = null;
        switch (operator) {
            case 'Between':
                if (ele !== 'from' && ele !== 'to') {
                    throw new Error(`Invalid ele value: ${ele}. It should be 'from' or 'to'.`);
                }
                timeInput = ele === 'from' ? this.getFromTimeInput() : this.getToTimeInput();
                break;
            case 'On':
                if (ele !== 'from' && ele !== 'to') {
                    throw new Error(`Invalid ele value: ${ele}. It should be 'from' or 'to'.`);
                }
                timeInput = ele === 'from' ? this.getFrom().$('input') : this.getTo().$('input');
                break;
            default:
                timeInput = this.getCustomOperatorTimeInput();
                break;
        }
        await timeInput.click();
        await this.clear({ elem: timeInput });
        await timeInput.setValue(timeValue);
        await this.clickByXYPosition({ elem: timeInput , x: 0, y: 20 }); // click outside to trigger the change event
    }

    async clickApplyButton() {
        await this.click({ elem: this.getApplyButton() });
    }

    // Assertion Helper
    async displayTextOfFrom() {
        const isTimeDisplay = await this.getFromTimeInput().isDisplayed();
        const isDateDisplay = await this.getFromInput().isDisplayed();
        if (isTimeDisplay) {
            if (!isDateDisplay) {
                const timeValue = await getInputValue(this.getFromTimeInput());
                return timeValue;
            }
            // if dateValue is '', we need to get the placeholder of date input
            const dateValue = await this.getCalendarInputValue(this.getFromInput());
            const timeValue = await this.getCalendarInputValue(this.getFromTimeInput());
            return `${dateValue} ${timeValue}`;
            
        }
        if (!isTimeDisplay) {
            const dateValue = await this.getCalendarInputValue(this.getFromInput());
            return dateValue;
        }
    }
        

    async displayTextOfTo() {
        const isTimeDisplay = await this.getToTimeInput().isDisplayed();
        const isDateDisplay = await this.getToInput().isDisplayed();
        if (isTimeDisplay) {
            if (!isDateDisplay) {
                const timeValue = await this.getCalendarInputValue(this.getToTimeInput());
                return timeValue;
            }
            const dateValue = await this.getCalendarInputValue(this.getToInput());
            const timeValue = await this.getCalendarInputValue(this.getToTimeInput());
            return `${dateValue} ${timeValue}`;
        }
        if (!isTimeDisplay) {
            const dateValue = await this.getCalendarInputValue(this.getToInput());
            return dateValue;
        }
    }

    async displayTextOfCustomOperator() {
        const isTimeDisplay = await this.getCustomOperatorTimeInput().isDisplayed();
        if (isTimeDisplay) {
            const dateValue = await this.getCalendarInputValue(this.getCustomOperatorInput());
            const timeValue = await this.getCalendarInputValue(this.getCustomOperatorTimeInput());
            return `${dateValue} ${timeValue}`;
        }
        return this.getCalendarInputValue(this.getCustomOperatorInput());
    }

    async getCalendarInputValue(el) {
        let value = await getInputValue(el);
        if (value === '') {
            value = await getAttributeValue(el, 'placeholder');
        }
        return value;
    }

    async displayTextOfCustomFrom() {
        return this.getFrom().getText();
    }

    async displayTextOfCustomTo() {
        return this.getTo().getText();
    }

    async getSelectedDynamicOption() {
        const options = this.getDynamicOptions().$$('.mstr-react-date-time-picker-radio-label');
        const len = await options.length;
        for (let i = 0; i < len; i++) {
            const radio = options[i];
            const isSelected = await this.isChecked(radio);
            if (isSelected) {
                return radio.getText();
            }
        }
        return null;
    }

    async isCalendarLocked() {
        const el = this.getContainer().$('.mstr-date-time-range-picker-read-only');
        return el.isDisplayed();
    }
}
