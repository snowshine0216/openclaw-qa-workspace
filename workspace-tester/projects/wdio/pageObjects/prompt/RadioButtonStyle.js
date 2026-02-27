import BasePrompt from '../base/BasePrompt.js';
import PromptSearchbox from '../common/PromptSearchbox.js';

export default class RadioButtonStyle extends BasePrompt {
    constructor() {
        super();
        this.searchbox = new PromptSearchbox();
    }
    /****************************************************************
     * Element locator
     ****************************************************************/

    getItems(promptElement) {
        return promptElement.$$('.mstrRadioListItemName');
    }
    
    getItemByName(promptElement, itemName) {
        return promptElement.$$('.mstrRadioListItemName').filter(async (elem) => {
            const text = await elem.getText();
            return text === itemName;
        })[0];
    }

    getSelectedItemList(promptElement) {
        return promptElement.$$('.mstrRadioListItemSelected');
    }

    /****************************************************************
     * Action helper
     ****************************************************************/

    async selectRadioButtonByName(promptElement, itemName) {
        (
            await this.safeGetElement(this.getItemByName(promptElement, itemName), 'Radio button is not displayed.')
        ).click();
        return this.sleep(3000);
    }

    /****************************************************************
     * Assertion helper
     ****************************************************************/

    async visibleSelectedItemCount(promptElement) {
        return this.getSelectedItemList(promptElement).length;
    }

    async currentIndex(promptName) {
        return this.indexPage.currentIndex(promptName);
    }

    async getAllItemCount(promptElement) {
        return promptElement.$$('.mstrRadioListItemName').length;
    }
    
    async getSelectedItemName(promptElement) {
        const selectedItem = await promptElement.$('.mstrRadioListItemSelected, .mstrRadioListItemSelectedHover');
        return selectedItem ? await selectedItem.getText() : null;
    }    

    async searchFor(promptElement, text) {
        await this.searchbox.searchFor(promptElement, text);
        await this.waitForElementInvisible(
            this.$('.mstrCheckListReadyState'),
            3000,
            'Search result page was not displayed.'
        );
        return this.sleep(3000); // Wait for animation to complete
    }

    async clearSearch(promptElement) {
        return this.searchbox.clearSearch(promptElement);
    }

    async clickMatchCase(promptElement) {
        return this.searchbox.clickMatchCase(promptElement);
    }

    async isItemSelected(promptElement, itemName) {
        const item = await this.getItemByName(promptElement, itemName);
        return this.isSelected(item);
    }

    async isFirstItemSelected(promptElement) {
        const item = this.getItems(promptElement)[0];
        return this.isSelected(item);
    }

    async isLastItemSelected(promptElement) {
        const lastItem = this.getItems(promptElement).slice(-1)[0];
        return this.isSelected(lastItem);
    }
}
