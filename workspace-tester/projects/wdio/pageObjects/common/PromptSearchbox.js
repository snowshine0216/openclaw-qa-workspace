import BasePrompt from '../base/BasePrompt.js';

export default class PromptSearchbox extends BasePrompt {
    // Element locator
    getSearchBox(promptElement) {
        return promptElement.$('.mstrTextBoxWithIconCellInput').$('input');
    }

    async clickMatchCase(promptElement) {
        if (!this.isWeb()) {
            return (
                await this.safeGetElement(promptElement.$('.mstrSearchFieldMatchCaseBox'), '"Match Case" is not displayed.')
            ).click();
        } else {
            return (
                await this.safeGetElement(promptElement.$('.mstrSearchFieldMatchCaseBox>div'), '"Match Case" is not displayed.')
            ).click();
        }
    }

    // Action helper
    async searchFor(promptElement, text) {
        const searchbox = this.getSearchBox(promptElement);
        (await this.safeGetElement(searchbox, 'Search box is not displayed.')).setValue(text);
        await this.sleep(2000);
        //await searchbox.setValue(protractor.Key.ENTER);
        await this.enter();
        return this.sleep(4000);
    }

    async clearSearch(promptElement) {
        await this.clear({ elem: this.getSearchBox(promptElement) }, true);
    }
}
