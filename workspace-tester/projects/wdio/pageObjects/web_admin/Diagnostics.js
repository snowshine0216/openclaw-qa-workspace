import BaseProperties from './BaseProperties.js';

/**
 * This components will shown when mstrWebAdmin page
 * Default Properties
 */
export default class Diagnostics extends BaseProperties {
    constructor() {
        super();
    }

    // Locator
    getAdvancedLevelDropdown() {
        return this.getAdminProperties().$('#advLogLevel');
    }

    getDropdown(locator) {
        return this.getAdminProperties().$(`${locator}`);
    }

    getDropdownItem(locator, item) {
        return this.getDropdown(locator)
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(item);
            })[0];
    }

    getAdvancedLevelDropdownItem(item) {
        return this.getStatictisModeDropdowns()
            .$$('option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(item);
            })[0];
    }

    // Action helper
    async selectDropdownItem(locator, item) {
        await this.click({ elem: this.getDropdown(locator) });
        await this.waitForElementVisible(this.getDropdownItem(locator, item));
        await this.getDropdownItem(locator, item).click();
    }

    async selectAdvacendLogLevelDropdown(item) {
        return this.selectDropdownItem('#advLogLevel', item);
    }

    async selectStatModeDropdown(item) {
        await this.selectDropdownItem('#statisticsMode', item);
    }

    async selectFromDate(month, day, year) {
        await this.selectDropdownItem('#fromMonth', month);
        await this.selectDropdownItem('#fromDay', day);
        await this.selectDropdownItem('#fromYear', year);
    }

    async selectToDate(month, day, year) {
        await this.selectDropdownItem('#toMonth', month);
        await this.selectDropdownItem('#toDay', day);
        await this.selectDropdownItem('#tosYear', year);
    }

    // Assertion helper

    async isFromDaySelected(day) {
        return this.getDropdownItem('#fromDay', day).isSelected();
    }

    async isModeSelected(mode) {
        return this.getDropdownItem('#statisticsMode', mode).isSelected();
    }
}
