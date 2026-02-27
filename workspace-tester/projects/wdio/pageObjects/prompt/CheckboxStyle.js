import BasePrompt from '../base/BasePrompt.js';
import PromptSearchbox from '../common/PromptSearchbox.js';
import PromptObject from './PromptObject.js';

export default class CheckboxStyle extends BasePrompt {
    constructor() {
        super();
        this.searchbox = new PromptSearchbox();
    }

    /****************************************************************
     * Element locator
     ****************************************************************/

    getCheckListItems(promptElement) {
        return promptElement.$('.mstrCheckListListContainer, mstrCheckListChecks').$$('div');
    }

    getCheckListContainer(promptElement) {
        return promptElement.$('.mstrCheckListListContainer');
    }

    getCheckListTableContainer(promptElement) {
        return promptElement.$('.mstrCheckListTable');
    }

    getItemByName(promptElement, itemName) {
        return this.getCheckListItems(promptElement).filter(async (elem) => {
            const text = await elem.getText();
            return text === itemName;
        })[0];
    }

    getSelectedItemList(promptElement) {
        return promptElement.$$('[class^=mstrCheckListItemSelected]');
    }

    getLoadingState() {
        return this.$('.mstrCheckListReadyState');
    }

    /****************************************************************
     * Action helper
     ****************************************************************/

    async clickCheckboxByName(promptElement, itemName) {
        await (
            await this.safeGetElement(this.getItemByName(promptElement, itemName), 'Checkbox is not displayed.')
        ).click();
        return this.sleep(500); // this action can be either select or deselect, so use static wait
    }

    async searchFor(promptElement, text) {
        await this.searchbox.searchFor(promptElement, text);
        await this.waitForElementInvisible(this.getLoadingState()); // loading... icon
        return this.sleep(3000); // Wait for animation to complete
    }

    async clearSearch(promptElement) {
        return this.searchbox.clearSearch(promptElement);
    }

    async clickMatchCase(promptElement) {
        return this.searchbox.clickMatchCase(promptElement);
    }

    async goToFirstPage(promptElement) {
        await PromptObject.goToFirstPage(promptElement);
        await this.waitForElementInvisible(this.getLoadingState());
        return this.sleep(1000); // Wait for animation to complete
    }

    async goToPreviousPage(promptElement) {
        await PromptObject.goToPreviousPage(promptElement);
        await this.waitForElementInvisible(this.getLoadingState());
        return this.sleep(1000); // Wait for animation to complete
    }

    async goToNextPage(promptElement) {
        await PromptObject.goToNextPage(promptElement);
        await this.waitForElementInvisible(this.getLoadingState());
        return this.sleep(1000); // Wait for animation to complete
    }

    async goToLastPage(promptElement) {
        await PromptObject.goToLastPage(promptElement);
        await this.waitForElementInvisible(this.getLoadingState());
        return this.sleep(1000); // Wait for animation to complete
    }

    /****************************************************************
     * Assertion helper
     ****************************************************************/

    async selectedItemCount(promptElement) {
        return this.getSelectedItemList(promptElement).length;
    }

    async isItemSelected(promptElement, itemName) {
        const item = await this.getItemByName(promptElement, itemName);
        return this.isSelected(item);
    }

    async isFirstItemSelected(promptElement) {
        const item = this.getCheckListItems(promptElement)[0];
        return this.isSelected(item);
    }

    async isLastItemSelected(promptElement) {
        const lastItem = this.getCheckListItems(promptElement).slice(-1)[0];
        return this.isSelected(lastItem);
    }
}
