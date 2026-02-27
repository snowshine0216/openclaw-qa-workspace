import BaseComponent from '../base/BaseComponent.js';
import TitleBar from '../document/TitleBar.js';
import DossierPage from '../dossier/DossierPage.js';
import { getInputValue } from '../../utils/getAttributeValue.js';

export default class SearchBox extends BaseComponent {
    constructor(container) {
        super(container, '.mstrmojo-SearchBoxSelector');
        this.emptyInputbox = '.mstrmojo-SimpleObjectInputBox-empty';
        this.dossierPage = new DossierPage();
    }

    getTitle() {
        const plocator = this.getElement().$('../../../..').$('.mstrmojo-portlet-titlebar');
        const el = new TitleBar(plocator);
        return el;
    }

    getOuterContainer() {
        return this.getParent(this.getElement());
    }

    getInputBox() {
        return this.getElement().$('input');
    }

    getSuggestionList() {
        return this.$$('.mstrmojo-suggest-list').filter((el) => el.isDisplayed())[0];
    }

    getSuggestListItems() {
        return this.getSuggestionList().$$('.item');
    }

    getItemByText(text) {
        return this.getSuggestionListItems()
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === text;
            })[0];
    }

    getFirstSuggestionItem() {
        return this.$(`(//div[contains(@class, 'mstrmojo-suggest-list')]//div[contains(@class, 'item')])[1]`);
    }

    getSuggestionListItems() {
        return this.getSuggestionList().$$('.item');
    }

    async getSuggestionListText() {
        const suggestionList = await this.getSuggestionListItems();
        const textArray = [];

        for (let i = 0; i < suggestionList.length; i++) {
            const text = await suggestionList[i].getText();
            textArray.push(text);
        }

        return textArray;
    }

    getSelectedItems() {
        return this.getElement().$$('.item');
    }

    getItemInSelectedItems(itemText) {
        return this.getSelectedItems().filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === itemText;
        })[0];
    }

    getEmptyInputBox() {
        return this.getElement().$$(this.emptyInputbox)[0];
    }

    getSuggestionListItemTitle(index) {
        return this.getSuggestionListItems()[index - 1].getAttribute('title');
    }

    async deleteItemByText(itemText) {
        const item = await this.getItemInSelectedItems(itemText);
        return this.click({ elem: item.$('.mstrmojo-SimpleObjectInputBox-del') });
    }

    async inputAndNoWait(text) {
        await this.click({ elem: this.getEmptyInputBox() });
        await this.clear({ elem: this.getInputBox() });
        await this.getInputBox().setValue(text);
    }

    async input(text) {
        await this.inputAndNoWait(text);
        // There are 2 cases for input
        // Case 1: There are no suggesitons
        // Case 2: There are suggesitons after the input, we have to wait the shown of the suggestions
        return this.sleep(2000); // Added to wait for suggesitons shown
    }

    async clickOnInputBox() {
        await this.click({ elem: this.getInputBox() });
    }

    async inputAndWaitForFirstSuggestion(text) {
        await this.inputAndNoWait(text);
        await this.waitForElementExsiting(this.getFirstSuggestionItem());
    }

    async clearAndInputAndWaitForFirstSuggestion(text) {
        await this.clear({ elem: this.getInputBox() });
        await this.getInputBox().setValue(text);
        await this.waitForElementExsiting(this.getFirstSuggestionItem());
    }

    /**
     * @param {Number} index start from 1
     * @param {*} text reserved for better understanding for the item cliked
     */
    async selectNthItem(index, text) {
        return this.selectItemByText(text);
    }

    async selectItemByText(text) {
        await this.click({ elem: this.getItemByText(text) });
        await this.sleep(500); // Wait for the selection to be processed
        await this.waitForCurtainDisappear();
        await this.dismissPreloadElementList();
        await this.sleep(500); // Wait for the suggestion list to be closed
        await this.waitForCurtainDisappear();
    }

    async selectItemsByText(texts) {
        for (const text of texts) {
            await this.click({ elem: this.getItemByText(text) });
        }
        await this.dismissSuggestionList();
        await this.waitForCurtainDisappear();
        await this.waitForDynamicElementLoading();
    }

    async selectItemsByTextForPreload({ texts, isPreload = false, isSingleSelection = true}){
        await this.waitForElementVisible(this.getSuggestionList());
        for (const text of texts) {
            await this.click({ elem: this.getItemByText(text) });
        }

        if (isSingleSelection) {
            // If it is a single selection, we need to wait for the suggestion list to be closed
            await this.dismissSuggestionList();
            await this.waitForElementInvisible(this.getSuggestionList());
        } 
        else {
            // If it is a multi selection, we need to wait for the suggestion list to be closed
            await this.dismissPreloadElementList();
            await this.sleep(2000); // Wait for the suggestion list to be closed
            if (isPreload) {
                // If it is a preload, we need to wait for the suggestion list still opened
                await this.waitForElementVisible(this.getSuggestionList());
            } else {
                // If it is not a preload, we need to wait for the suggestion list to be closed
                await this.waitForElementInvisible(this.getSuggestionList());
            }
        }
        await this.waitForCurtainDisappear();
        await this.waitForDynamicElementLoading();
    }

    async moveToSuggetionItem(index) {
        await this.moveToElement(this.getSuggestionListItems()[index - 1]);
    }

    async clearAllSelections() {
        const selectedItems = this.getSelectedItems();
        const itemNames = await selectedItems.map(async (item) => item.getText());
        // delete all selected items by name
        for (const itemName of itemNames) {
            await this.deleteItemByText(itemName);
        }
        
    }

    // assertion heelper
    async isSearchEnabled() {
        return this.getElement().$(this.emptyInputbox).isDisplayed();
    }

    async isSearchResultPresent() {
        return this.getSuggestionList().isDisplayed();
    }

    async isSearchboxEmpty() {
        if ((await this.getSelectedItems().length) > 0) {
            return false;
        }
        return true;
    }

    async getSelectedItemsText() {
        const text = await this.getSelectedItems().map((cell) => cell.getText());
        return text;
    }

    async getSuggestListItemsText() {
        const text = await this.getSuggestionListItems().map((cell) => cell.getText());
        return text;
    }

    async getSearchBoxInputValue() {
        const inputBox = this.getInputBox();
        return getInputValue(inputBox);
    }

    async dismissPreloadElementList() {
        await this.clickByXYPositionNoWait({
                elem: this.getInputBox(),
                x: 0,
                y: -2 // Click on the input box to close the suggestion list
        });
    }

    async dismissSuggestionList() {
        await this.sleep(500);
        await this.clickByXYPositionNoWait({
                elem: this.getElement(),
                x: 0,
                y: -2 // Click on the input box to close the suggestion list
        });
    }

    async getSearchSuggestItemIndex(itemText) {
        await this.waitForElementVisible(this.getSuggestionList());
        const el = this.getItemByText(itemText);
        return el.getAttribute('idx');
    
    }
}
