import BaseComponent from '../base/BaseComponent.js';

/** The CalendarPicker is used in the prompt page */
export default class TimePicker extends BaseComponent {
    constructor(id) {
        super(`div[id="${id}"]`, 'The TimePicker component');
        this.id = id;
    }

    // Element locator

    getElement() {
        super.initial();
        return this.container ? this.container : this.locator;
    }

    getHour() {
        return this.getElement().$(`span[id="${this.id}_hour"]`);
    }

    getMinute() {
        return this.getElement().$(`span[id="${this.id}_minute"]`);
    }

    getSecond() {
        return this.getElement().$(`span[id="${this.id}_second"]`);
    }

    getHourInDropdown(hour) {
        const hourList = this.getHour();
        return hourList.$$('option').filter(async (elem) => {
            const text = await elem.getText();
            return text === hour;
        })[0];
    }

    getMinuteInDropdown(minute) {
        const hourList = this.getMinute();
        return hourList.$$('option').filter(async (elem) => {
            const text = await elem.getText();
            return text === minute;
        })[0];
    }

    getSecondInDropdown(second) {
        const hourList = this.getSecond();
        return hourList.$$('option').filter(async (elem) => {
            const text = await elem.getText();
            return text === second;
        })[0];
    }

    // getHourInDropdown(hour) {
    //     return this.getHour().element(by.cssContainingText('option', hour));
    // }

    // getMinuteInDropdown(minute) {
    //     return this.getMinute().element(by.cssContainingText('option', minute));
    // }

    // getSecondInDropdown(second) {
    //     return this.getSecond().element(by.cssContainingText('option', second));
    // }

    // Action helper

    async selectHour(hour) {
        await this.getHour().click();
        await this.getHourInDropdown(hour).click();
    }

    async selectMinute(minute) {
        await this.getMinute().click();
        await this.getMinuteInDropdown(minute).click();
    }

    async selectSecond(second) {
        await this.getSecond().click();
        await this.getSecondInDropdown(second).click();
    }
}
