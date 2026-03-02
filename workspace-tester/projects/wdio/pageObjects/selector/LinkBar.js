import BaseComponent from '../base/BaseComponent.js';
import TitleBar from '../document/TitleBar.js';
import DossierPage from '../dossier/DossierPage.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';

/**
 * Button bar style setted in selector type
 */
export default class LinkBar extends BaseComponent {
    constructor(container) {
        super(
            container,
            '.mstrmojo-ListBase.mstrmojo-LinkList,.mstrmojo-ListBase.mstrmojo-LinkListHoriz, .mstrmojo-ListBase.mstrmojo-vi-sel-LinkList'
        );
        this.dossierPage = new DossierPage();
    }

    getTitle() {
        const plocator = this.getElement().$('../../../..').$('.mstrmojo-portlet-titlebar');
        const el = new TitleBar(plocator);
        return el;
    }

    getLinkListItems() {
        return this.getElement().$$('.mstrmojo-LinkList-item,.mstrmojo-LinkListHoriz-item, .item');
    }

    getItemByText(text) {
        return this.getLinkListItems().filter(async (elem) => {
            const attributeValue = await getAttributeValue(elem, 'value');
            return attributeValue.includes(text);
        })[0];
    }

    /**
     * @param {Number} index start from 1
     * @param {*} text reserved for better understanding for the item cliked
     */
    async selectNthItem(index, text) {
        await this.click({ elem: this.getLinkListItems()[index - 1] });
        return this.waitDocumentToBeLoaded();
    }

    async selectItemByText(text, checkDocumentLoaded = true) {
        await this.click({ elem: this.getItemByText(text) });
        await this.waitDocumentToBeLoaded(checkDocumentLoaded);
        return this.sleep(1000); // wait for gird, viz loading completely
    }

    async multiSelectNth(items) {
        await this.selectItemByText(items[0]);
        for (const [, item] of items.slice(1).entries()) {
            const el = await this.getItemByText(item);
            await this.ctrlClick({ elem: el });
        }
        await this.waitDocumentToBeLoaded();
    }

    async getSelectedItemText() {
        return this.getElement().$('.selected').getAttribute('value');
    }

    // assertion helper
    async getSeletedItemsCount() {
        const selectedItems = await this.getSelected(this.getLinkListItems());
        return selectedItems.length;
    }

    async isItemSelected(index, text) {
        await this.waitForElementVisible(this.getLinkListItems()[index - 1]);
        return this.isSelected(this.getLinkListItems()[index - 1]);
    }

    async isItemSelectedByText(text) {
        await this.waitDocumentToBeLoaded();

        if (!(await this.getItemByText(text))) {
            console.log('warning: item not found, wait for 2s and try again');
            await this.sleep(2000);
        }
        await this.waitForElementVisible(this.getItemByText(text));
        return this.isSelected(this.getItemByText(text));
    }

    async isItemExisted(item) {
        const el = await this.getLinkListItems();
        return this.isExisted(item, el);
    }
}
