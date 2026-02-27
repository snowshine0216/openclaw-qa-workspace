import BasePage from '../base/BasePage.js';

export default class ContextualLinkEditor extends BasePage {
    constructor() {
        super();
    }

    // Element Locator
    getContextuallinkEditor() {
        return this.$$('.contextual-link-editor').filter((el) => el.isDisplayed())[0];
    }

    getOpenFolderButton() {
        return this.getContextuallinkEditor().$('.mstrmojo-Button.icon');
    }

    getSelectObjectPanel() {
        return this.$('.mstrmojo-Editor.mstrmojo-vi-ObjectPicker.modal');
    }

    getChoosePromptOption(name) {
        return this.getContextuallinkEditor()
            .$$('.prompts-wrapper .item')
            .filter(async (el) => (await el.getText()).includes(name))[0];
    }

    getPromptSection() {
        return this.getContextuallinkEditor().$('.prompts-wrapper');
    }

    getAnswerPromptPullDown() {
        return this.getContextuallinkEditor().$('.prompts-wrapper .mstrmojo-ui-Pulldown');
    }

    getAnswerPromptOptions() {
        return this.getAnswerPromptPullDown().$$('.item');
    }

    getButtonsByName(buttonName) {
        return this.getContextuallinkEditor()
            .$$('.mstrmojo-WebButton')
            .filter(async (el) => (await el.getText()).includes(buttonName))[0];
    }

    getButtonsInSelectObjectByName(buttonName) {
        return this.getSelectObjectPanel()
            .$$('.mstrmojo-WebButton')
            .filter(async (el) => (await el.getText()).includes(buttonName))[0];
    }

    // Action Methods
    async choosePrompt(name) {
        const prompt = await this.getChoosePromptOption(name);
        await this.click({ elem: prompt });
    }

    async openAnswerPromptPullDown() {
        await this.click({ elem: this.getAnswerPromptPullDown() });
    }

    async cancelEditor() {
        const cancelButton = await this.getButtonsByName('Cancel');
        await this.click({ elem: cancelButton });
        await this.waitForElementInvisible(this.getContextuallinkEditor());
    }

    async clickOpenFolderButton() {
        await this.click({ elem: this.getOpenFolderButton() });
        await this.waitForElementVisible(this.getSelectObjectPanel());
        // wait for the loading spinner to disappear
        await this.waitForElementInvisible(this.getLoadingIcon());
        await this.waitForElementInvisible(this.getMojoLoadingIndicator());
    }

    async cancelSelectObjectPanel() {
        const cancelButton = await this.getButtonsInSelectObjectByName('Cancel');
        await this.click({ elem: cancelButton });
        await this.waitForElementInvisible(this.getSelectObjectPanel());
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

    async getAnswerPromptOptionsText() {
        await this.waitForElementVisible(this.getContextuallinkEditor());
        await this.click({ elem: this.getAnswerPromptPullDown() });
        const options = this.getAnswerPromptOptions();
        const value = await options.map(async (option) => option.getText());
        await this.click({ elem: this.getAnswerPromptPullDown() });
        return value;
    }

    async isPromptSectionVisible() {
        await this.waitForElementVisible(this.getContextuallinkEditor());
        return this.getPromptSection().isDisplayed();
    }

    async isProjectSlectorDisabled() {
        return this.$(".mstrmojo-ui-Pulldown.mstrmojo-ui-Pulldown-Projects.disabled").isDisplayed();
    }
}
