import BasePage from '../base/BasePage.js';

/**
 * The Prompt details component used in the Report
 */
export default class ReportPromptDetails extends BasePage {
    constructor() {
        super('#promptDetails_PromptDetailsStyle', 'Report Prompt details component');
    }

    getElement() {
        return this.$('#promptDetails_PromptDetailsStyle');
    }

    async getPromptDetailsText() {
        const promptContent = await this.locator.$('.promptDetailsContent');
        const filterText = await promptContent.getText();
        return filterText.replace(/\n/g, ' ');
    }

    async isPromptDetailsPresent() {
        return this.$('.promptDetailsContent').isDisplayed();
    }
}
