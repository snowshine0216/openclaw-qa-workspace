import BaseFilter from '../base/BaseFilter.js';
import FilterSearch from '../common/FilterSearch.js';
import UserPreference from '../common/UserPreference.js';

export default class Timezone extends BaseFilter {
    constructor() {
        super();
        this.userPreference = new UserPreference();
        this.filterSearch = new FilterSearch();
    }

    // element locator
    getUnlockTimezoneContainer() {
        return this.$('.mstrd-FilterItemContainer--hasDetailPanel');
    }

    getTimezoneContainer() {
        return this.getFilterContainer('Dashboard Time Zone');
    }

    getTimezoneItemContainer() {
        return this.getTimezoneContainer().$('.mstrd-TimezoneItemContainer');
    }

    getTimezoneDetailPanel() {
        return this.$('.mstrd-TimezoneDetailsPanel');
    }

    getMyTimezoneSection() {
        return this.$('.mstrd-TimezoneDetailsPanel-mine');
    }

    getMyTimezone() {
        return this.getMyTimezoneSection().$('.mstrd-TimezoneDetailsPanel-mine-detail-value');
    }

    getMyTimezoneRadioButton() {
        return this.getMyTimezoneSection().$('.mstrd-RadioButton-radioShape');
    }

    getEditButton() {
        return this.getMyTimezoneSection().$('.mstrd-TimezoneDetailsPanel-mine-edit');
    }

    getTimezoneList() {
        return this.$('.mstrd-FilterItemsList');
    }

    getTimezoneItems() {
        return this.getTimezoneList().$$('.mstrd-RadioButton');
    }

    getTimezoneItem(value) {
        return this.getTimezoneList()
            .$$('.mstrd-RadioButton')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === value;
            })[0];
    }

    getTimezoneItemRadioButton(value) {
        return this.getTimezoneItem(value).$('.mstrd-RadioButton-radioShape');
    }

    getFirstTimezoneItem() {
        return this.getTimezoneItems()[0];
    }

    //Action helper

    async openTimezoneSecondaryPanel() {
        return this.openSecondaryPanel('Dashboard Time Zone');
    }

    async editTimezone() {
        await this.click({ elem: this.getEditButton() });
        return this.waitForElementVisible(this.userPreference.getPreferenceSecondaryPanel());
    }

    async selectFixedTimezone(value) {
        return this.click({ elem: this.getTimezoneItemRadioButton(value) });
    }

    async selectMyTimezone() {
        return this.click({ elem: this.getMyTimezoneRadioButton() });
    }

    async search(keyword) {
        return this.filterSearch.search(keyword);
    }

    async clearSearch() {
        return this.filterSearch.clearSearch();
    }

    //Assertion helper
    async isMyTimeZoneSelected() {
        await this.waitForElementVisible(this.getMyTimezone());
        const myTZ = await this.getMyTimezoneRadioButton();
        return this.isChecked(myTZ);
    }

    async getTimezoneItemText() {
        await this.waitForElementVisible(this.getTimezoneItemContainer());
        return this.getTimezoneItemContainer().getText();
    }

    async getMyTimezoneText() {
        await this.waitForElementVisible(this.getMyTimezone());
        return this.getMyTimezone().getText();
    }

    async isTimezoneLocked() {
        const isUnlocked = await this.getUnlockTimezoneContainer().isDisplayed();
        return !isUnlocked;
    }

    async getTimezoneNumber() {
        await this.waitForCurtainDisappear();
        return this.getTimezoneItems().length;
    }

    async isSearchWarningMsgPresent() {
        return this.filterSearch.isSearchWarningMsgPresent();
    }

    async firstTimezoneItemText() {
        await this.waitForElementVisible(this.getTimezoneList());
        return this.getFirstTimezoneItem().getText();
    }

    async isEditButtonPresent() {
        return this.getEditButton().isDisplayed();
    }
}
