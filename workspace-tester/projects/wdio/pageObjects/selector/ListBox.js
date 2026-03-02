import BaseComponent from '../base/BaseComponent.js';

export default class ListBox extends BaseComponent {
    constructor(container) {
        super(
            container,
            '.mstrmojo-ListBase.mstrmojo-ListBox, .mstrmojo-ListBase.mstrmojo-vi-sel-ListBox, .mstrmojo-ListBase.hasHorizontal',
            'ListBox for Selector'
        );
    }

    getListTable() {
        return this.locator.$('.mstrmojo-ListBox-table');
    }

    getListBoxListItems() {
        return this.getElement().$$('.mstrmojo-ListBox-item, .item');
    }

    getItemByText(text) {
        return this.getListBoxListItems().filter(async (elem) => {
            const elemText = await this.getInnerText(elem);
            return this.escapeRegExp(elemText).includes(this.escapeRegExp(text));
        })[0];
    }

    /**
     * @param {Number} index start from 1
     * @param {String} text reserved for better understanding for the item cliked
     */
    async selectNthItem(index, text) {
        await this.click({ elem: this.getListBoxListItems()[index - 1] });
        return this.waitDocumentToBeLoaded();
    }

    /**
     * Select item by element text
     * @param {String} text text of list item
     */
    async selectItemByText(text, checkDocumentLoaded = true) {
        const item = await this.getItemByText(text);
        await this.click({ elem: item });
        await this.waitDocumentToBeLoaded(checkDocumentLoaded);
    }

    /**
     * Mutiple selection using 'Command'
     * @param {String[]} items items' text string
     */
    async multiSelect(items) {
        // Click first item in items
        await this.selectItemByText(items[0]);
        await this.sleep(1000);

        for (const [, item] of items.slice(1).entries()) {
            const el = await this.getItemByText(item);
            await this.ctrlClick({ elem: el });
        }
        return this.waitDocumentToBeLoaded();
    }

    // asssertion helper

    // use index to assert to avoid I18N issues
    async isItemSelected(index, text) {
        await this.waitForElementVisible(this.getListBoxListItems()[index - 1]);
        return this.isSelected(this.getListBoxListItems()[index - 1]);
    }

    async isItemTextSelected(text) {
        await this.waitForElementVisible(this.getItemByText(text));
        return this.isSelected(this.getItemByText(text));
    }

    async isItemExisted(item) {
        const el = await this.getListBoxListItems();
        return this.isExisted(item, el, 'text');
    }

    async getSeletedItemsCount() {
        const selectedItems = await this.getSelected(this.getListBoxListItems());
        return selectedItems.length;
    }

    async getSelectedItemText() {
        const value = [];
        for (const item of await this.getListBoxListItems()) {
            if (await this.isSelected(item)) {
                value.push(await item.getText());
            }
        }
        return value;
    }
}
