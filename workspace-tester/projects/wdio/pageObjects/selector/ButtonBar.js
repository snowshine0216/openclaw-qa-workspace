import BaseComponent from '../base/BaseComponent.js';
import TitleBar from '../document/TitleBar.js';
import DossierPage from '../dossier/DossierPage.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';

/**
 * Button list style setted in selector type
 */
export default class ButtonBar extends BaseComponent {
    constructor(container) {
        const locator = '.mstrmojo-ListBase.mstrmojo-ButtonList,.mstrmojo-ListBase.mstrmojo-ButtonListHoriz';
        super(container, locator, 'Button list component');
        this.dossierPage = new DossierPage();
    }

    static create(container) {
        const el = new ButtonBar(container);
        super.initial();
        return el;
    }

    getListTable() {
        return this.locator.$('.mstrmojo-ListBox-table');
    }

    getTitle() {
        const plocator = this.getElement().$('../../../..').$('.mstrmojo-portlet-titlebar');
        const el = new TitleBar(plocator);
        return el;
    }

    getButtonbarItems() {
        return this.getElement().$$('.mstrmojo-ButtonItem');
    }

    /**
     * @param {Number} index start from 1
     * @param {*} text reserved for better understanding for the item cliked
     */
    async selectNthItem(index, text) {
        await this.click({ elem: this.getButtonbarItems()[index - 1] });
        return this.waitDocumentToBeLoaded();
    }

    async getSelectedItemText() {
        return this.getElement().$('.mstrmojo-ButtonItem.selected').getText();
    }

    async selectItemByText(text) {
        const el = await this.getItemByText(text);
        await this.click({ elem: el });
        return this.waitDocumentToBeLoaded();
    }

    getItemByText(text) {
        return this.getButtonbarItems().filter(async (elem) => {
            const attributeValue = await getAttributeValue(elem, 'value');
            return attributeValue.includes(text);
        })[0];
    }

    async multiSelectNth(items) {
        await this.selectItemByText(items[0]);
        for (const [, item] of items.slice(1).entries()) {
            const el = await this.getItemByText(item);
            await this.ctrlClick({ elem: el });
        }
        return this.waitDocumentToBeLoaded();
    }

    // assertion helper

    async isItemSelected(index, text) {
        await this.waitForElementVisible(this.getButtonbarItems()[index - 1]);
        return this.isSelected(this.getButtonbarItems()[index - 1]);
    }

    async isItemTextSelected(text) {
        if (!(await this.getItemByText(text))) {
            console.log('warning: item not found, wait for 2s and try again');
            await this.sleep(2000);
            await this.waitDocumentToBeLoaded();
        }
        await this.waitForElementVisible(this.getItemByText(text));
        return this.isSelected(this.getItemByText(text));
    }

    async getSeletedItemsCount() {
        const selectedItems = await this.getSelected(this.getButtonbarItems());
        return selectedItems.length;
    }

    async isItemExisted(item) {
        const el = await this.getButtonbarItems();
        return this.isExisted(item, el);
    }
}
