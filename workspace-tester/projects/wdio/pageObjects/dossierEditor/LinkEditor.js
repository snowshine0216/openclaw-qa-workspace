import BasePage from '../base/BasePage.js';
import LoadingDialog from './components/LoadingDialog.js';

export default class LinkEditor extends BasePage {
    constructor() {
        super();
        this.loadingDialog = new LoadingDialog();
    }

    // Element Locator
    getlinkEditor() {
        return this.$$('.link-editor').filter((el) => el.isDisplayed())[0];
    }

    getTabByName(tabName) {
        return this.getlinkEditor()
            .$$('.mstrmojo-TabButton')
            .filter(async (el) => {
                const textContent = await el.getText();
                return textContent.includes(tabName);
            })[0];
    }

    getOpenInNewTabCheckboxByIndex(index) {
        return this.getlinkEditor().$$('.mstrmojo-Box.open-in-new-tab')[index].$('.mstrmojo-ui-Checkbox');
    }

    getURLLinkInLinkEditor() {
        return this.getlinkEditor().$$('.mstrmojo-vi-TwoColumnProp')[0].$('.mstrmojo-TextBox');
    }

    getButtonByName(buttonName) {
        return this.getlinkEditor()
            .$$('.mstrmojo-WebButton')
            .filter(async (el) => {
                const textContent = await el.getText();
                return textContent.includes(buttonName);
            })[0];
    }

    /**
     * Get the link editor once it is opened
     * @returns {Promise<boolean>}
     */
    get linkEditorDialog() {
        return this.$(`//div[@id='mstrDerivedAttrIDE']//div[contains(@class,'mstrmojo-mstrDLE')]`);
    }

    getSaveCancelButton(buttonName) {
        return this.$(
            `//div[contains(@class,'mstrmojo-DLEditor')]//div[contains(@class,'mstrmojo-Button')]/div[contains(@class, 'mstrmojo-Button-text') and text()='${buttonName}']`
        );
    }

    // --------- URL display Text --------------------

    get textClearButton() {
        return this.$(`//div[text()='URL Display Text']/parent::div//div[text()='Clear']`);
    }

    get displayTextInput() {
        return this.$(
            `//div[text()='URL Display Text']/parent::div/following-sibling::div//div[@class='mstrmojo-TokenInputBox-edit']`
        );
    }

    // get validation button for display text

    // --------------- Navigate to this URL -------------------
    get urlClearButton() {
        return this.$(`//div[text()='Navigate to this URL']/parent::div//div[text()='Clear']`);
    }

    get urlTextInput() {
        return this.linkEditorDialog.$(
            `.//div[text()='Navigate to this URL']/parent::div/following-sibling::div//div[contains(@class,'mstrmojo-TokenInputBox-edit')]`
        );
    }

    getUrlValidation(validationMsg) {
        return this.$(
            `(//div[@class = 'mstrmojo-TokenInputBox-edit'])[2]/ancestor::div[contains(@class,'MEBox-edit')]/following-sibling::div[contains(@class,'status')]/div[text()='${validationMsg}']`
        );
    }

    // Action Methods
    async selectTab(tabName) {
        const tab = await this.getTabByName(tabName);
        await this.click({ elem: tab });
        return this.sleep(500);
    }

    async selectURLOpenInNewTabCheckbox() {
        const checkbox = await this.getOpenInNewTabCheckboxByIndex(0);
        await this.click({ elem: checkbox });
    }

    async closeEditorWithoutSaving() {
        const cancelButton = await this.getButtonByName('Cancel');
        await this.click({ elem: cancelButton });
        await this.waitForElementInvisible(this.getlinkEditor());
    }

    // Assertion Helpers
    async getSelectedTabName() {
        await this.waitForElementVisible(this.getlinkEditor());
        const tabs = await this.getlinkEditor().$$('.mstrmojo-TabButton');
        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            if (await this.isSelected(tab)) {
                return tab.getText();
            }
        }
    }

    async isURLOpenInNewTabCheckboxChecked() {
        const checkbox = await this.getOpenInNewTabCheckboxByIndex(0);
        return this.isChecked(checkbox);
    }

    async isDashboardOpenInNewTabCheckboxChecked() {
        const checkbox = await this.getOpenInNewTabCheckboxByIndex(1);
        return this.isChecked(checkbox);
    }

    async isDashboardOpenInNewTabDisplayed() {
        const checkbox = await this.getOpenInNewTabCheckboxByIndex(1);
        return checkbox.isDisplayed();
    }

    // --------- URL display Text --------------------
    async clearText() {
        const el = await this.textClearButton;
        await this.clickOnElement(el);
    }

    async inputDisplayText(inputText) {
        await this.click({ elem: this.displayTextInput });
        await this.displayTextInput.setValue(inputText);
    }

    // --------------- Navigate to this URL -------------------
    async clearURL() {
        await this.click({ elem: this.urlClearButton });
    }

    async inputURLText(inputText) {
        await this.click({ elem: this.urlTextInput });
        await this.urlTextInput.setValue(inputText);
    }

    // -------------- Save/Cancel -------------------------
    async clickOnSaveCancel(action) {
        const el = await this.getSaveCancelButton(action);
        await this.click({ elem: el });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed(60);
    }

    async createLinkWithDefaultSettings({ linkUrl, linkName }) {
        await this.waitForElementVisible(this.linkEditorDialog);
        await this.clearURL();
        await this.inputURLText(linkUrl);
        if (linkName) {
            await this.inputDisplayText(linkName);
        }
        await this.clickOnSaveCancel('Save');
    }
}
