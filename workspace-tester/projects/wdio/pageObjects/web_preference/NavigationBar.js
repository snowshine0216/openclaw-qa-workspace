import BaseComponent from '../base/BaseComponent.js';

export default class NavigationBar extends BaseComponent {
    // element locator
    getPreferencePanel() {
        return this.$('.mstrPanelPortrait');
    }

    getLeftToolbar() {
        return this.$('.prefsToolbar');
    }

    getItemInLeftToolbar(text) {
        return this.getLeftToolbar()
            .$$('.bullets a')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(text);
            })[0];
    }

    getSelectedLevel() {
        return this.getLeftToolbar().$$('.mstrStandardHighlighted')[0];
    }

    getSelectedPage() {
        return this.getLeftToolbar().$$('.mstrStandardHighlighted')[1];
    }

    getChangePassordBtn() {
        return this.getLeftToolbar()
            .$$('.mstrLink')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes('Change Password');
            })[0];
    }

    // action helper

    async clickItemInLeftToolbar(text) {
        await this.click({ elem: this.getItemInLeftToolbar(text) });
    }

    /**
     * Open preference page by Preferences Level and Preferences in lefttoolbar
     * @param {string} level The preferences level including User Preferences level and Project Defaults Level
     * @param {string} page The preference page including General, Folder Browsing etc.
     */

    async clickLevelPreferencePage(level, page) {
        const selectLevel = await this.getSelectedLevel().getText();
        if (!level.includes(selectLevel)) {
            await this.clickItemInLeftToolbar(level);
        }
        const selectPage = await this.getSelectedPage().getText();
        if (!page.includes(selectPage)) {
            await this.clickItemInLeftToolbar(page);
        }
        await this.waitForElementVisible(this.getPreferencePanel());
    }

    // assertion helper
    async isItemExistInLeftToolbar(text) {
        return this.getItemInLeftToolbar(text).isDisplayed();
    }
}
