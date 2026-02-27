import GeneralPage from './GeneralPage.js';
import BasePreference from './BasePreference.js';

export default class WebPreferencePage extends BasePreference {
    constructor() {
        super();
        this.generalPage = new GeneralPage();
    }

    // element locator
    getPreferencesBody() {
        return this.$('.mstr-page-prefs');
    }

    getLanguageSection() {
        return this.$('#locale-section');
    }

    getLeftToolbar() {
        return this.$('.prefsToolbar');
    }

    getHierarchicalSortSection() {
        return this.$('#hierarchicalSort');
    }

    async setValueForDropDown(id, value) {
        const dropdown = this.getLanguageSection().$(id);
        await this.click({ elem: dropdown });
        const item = (await dropdown).$$('option').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(value);
        })[0];
        await this.click({ elem: item });
    }

    // action helper
    async clickItemInLeftToolbar(text) {
        const item = (await this.getLeftToolbar()).$$('a').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(text);
        })[0];
        await this.click({ elem: item });
    }

    async setLanguage(value) {
        return this.setValueForDropDown('#locale', value);
    }

    async setNumberDate(value) {
        return this.setValueForDropDown('#sLoc', value);
    }

    async setMetadata(value) {
        return this.setValueForDropDown('#localeMD', value);
    }

    async setWHData(value) {
        return this.setValueForDropDown('#localeWHD', value);
    }

    async setIServerMsg(value) {
        return this.setValueForDropDown('#localeMsgs', value);
    }

    async setUnits(value) {
        return this.setValueForDropDown('#units', value);
    }

    async setTimeZone(value) {
        return this.setValueForDropDown('#timeZone', value);
    }

    /**
     * In user preference page, select always sort metric hierarchically or only in outline mode.
     * @param {string} value The option value of sort metric hierarchically, i.e. 'Always' or 'Only in Outline mode'
     */
    async setHierarchicalSort(value) {
        const dropdown = this.getHierarchicalSortSection();
        await this.click({ elem: dropdown });
        const item = (await dropdown).$$('option').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText.includes(value);
        })[0];
        await this.click({ elem: item[0] });
    }

    /**
     * Check whether sort metric hierarchically is selected as always or only in outline mode
     */
    async getHierarchicalSortType() {
        const dropdown = this.getHierarchicalSortSection();
        const sortType = await dropdown.$('option[selected="1"]').getText();
        return sortType;
    }

    async applyChanges() {
        await this.$('#tbSave').click();
    }

    // assertion helper
    async waitForPageDisplayed() {
        return browser.wait(EC.presenceOf(this.getPreferencesBody()), 5000, 'Preference page is not displayed.');
    }

    /**
     * Check whether there is a confirmation message showing the changes of preferences are saved successfully.
     */
    async isPreferenceSaved() {
        const confirmationMsgCount = await this.getPreferencesBody().$$('.mstrPrefUpdateConfirmation').length;
        return confirmationMsgCount > 0;
    }
}
