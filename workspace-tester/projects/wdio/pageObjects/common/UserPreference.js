import BaseLibrary from '../base/BaseLibrary.js';

export default class UserPreference extends BaseLibrary {
    // Element locator

    getAccountTitle() {
        return this.getAccountDropdown().$('.mstrd-DropdownMenu-headerTitle');
    }

    getPreferenceSecondaryPanel() {
        return this.$('.mstrd-AccountDropdownMenuContainer-preferences-popover');
    }

    getSection(section) {
        return this.$$('.mstrd-UserPreferences-sections').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(section);
        })[0];
    }

    getPreferenceDropdown(section) {
        return this.getSection(section).$('.mstrd-DropDown.mstrd-Select');
    }

    getSelectedPreference(section) {
        return this.getSection(section).$(
            '.mstrd-DropDownButton.mstrd-Select-selected.mstrd-UserPreferences-section-content-selector'
        );
    }

    getPreferenceList(section) {
        return this.getSection(section).$('.mstrd-DropDown-content');
    }

    getPreferenceDefaultItem(section) {
        return this.getSection(section).$('.default-option');
    }

    getPreferenceItem(section, option) {
        return this.getPreferenceList(section)
            .$$('.mstrd-Option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === option;
            })[0];
    }

    getPersistentNotificationSwitch() {
        return this.getSection('Persistent Notifications').$('.mstrd-Switch');
    }

    getSaveBtn() {
        return this.getPreferenceSecondaryPanel().$('.mstrd-Button.mstrd-Button--lg.mstrd-Button--primary');
    }

    getCancelBtn() {
        return this.getPreferenceSecondaryPanel().$('.mstrd-Button.mstrd-Button--lg.mstrd-Button--secondary');
    }

    getChangeDesc() {
        return this.getPreferenceSecondaryPanel().$('.changeDescription');
    }

    // Action helper

    async openTimezoneList() {
        await this.click({ elem: this.getPreferenceDropdown('My Time Zone') });
        await this.waitForElementVisible(this.getPreferenceList('My Time Zone'));
        await this.sleep(2000); // wait for timezone list to be loaded
    }

    async changeUserTimezone(timezone) {
        if (timezone === 'Default') {
            await this.click({ elem: this.getPreferenceDefaultItem('My Time Zone') });
        } else {
            await this.waitForElementVisible(this.getPreferenceList('My Time Zone'));
            await this.waitForElementExsiting(this.getPreferenceItem('My Time Zone', timezone));
            await this.click({ elem: this.getPreferenceItem('My Time Zone', timezone) });
        }
        return this.waitForElementInvisible(this.getPreferenceList('My Time Zone'));
    }

    async openPreferenceList(section) {
        await this.click({ elem: this.getPreferenceDropdown(section) });
        await this.waitForElementVisible(this.getPreferenceList(section));
        return this.sleep(2000); // wait for preference list to be loaded
    }

    async changePreference(section, preference) {
        if (preference === 'Default') {
            await this.click({ elem: this.getPreferenceDefaultItem(section) });
        } else {
            await this.waitForElementVisible(this.getPreferenceList(section));
            await this.waitForElementExsiting(this.getPreferenceItem(section, preference));
            await this.click({ elem: this.getPreferenceItem(section, preference) });
        }
        return this.waitForElementInvisible(this.getPreferenceList(section));
    }

    async savePreference() {
        await this.click({ elem: this.getSaveBtn() });
        return this.waitForElementInvisible(this.getPreferenceSecondaryPanel());
    }

    async cancelChange() {
        await this.click({ elem: this.getCancelBtn() });
        return this.waitForElementInvisible(this.getPreferenceSecondaryPanel());
    }

    async waitForPreferencePanelPresent() {
        await this.waitForElementVisible(this.getPreferenceSecondaryPanel());
    }

    async changePersistentNotificationSetting(enable = true) {
        if ((await this.isPersistentNotificationEnabled()) != enable) {
            return this.click({ elem: this.getPersistentNotificationSwitch() });
        }
    }

    // Asserion helper
    async isChangeDescPresent() {
        return this.getChangeDesc().isDisplayed();
    }

    async selectedTimezone() {
        return this.getSelectedPreference('My Time Zone').getText();
    }

    async selectedPreference(section) {
        return this.getSelectedPreference(section).getText();
    }

    async isPreferenceSecondaryPanelPresent() {
        return (await this.getPreferenceSecondaryPanel()).isDisplayed();
    }

    async isPersistentNotificationEnabled() {
        const checked = await this.getPersistentNotificationSwitch().$('.ant-switch').getAttribute('aria-checked');
        return checked === 'true';
    }
}
