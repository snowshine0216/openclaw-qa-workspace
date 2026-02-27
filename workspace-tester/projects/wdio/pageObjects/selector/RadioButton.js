import BaseComponent from '../base/BaseComponent.js';
import DossierPage from '../dossier/DossierPage.js';

/**
 * Radio list style setted in selector type
 */
export default class RadioButton extends BaseComponent {
    constructor(container) {
        const locator = '.mstrmojo-ui-Pulldown';
        super(
            container,
            '.mstrmojo-ListBase.mstrmojo-RadioListHoriz,.mstrmojo-ListBase.mstrmojo-RadioList,.mstrmojo-ui-CheckList.radio'
        );
        this.dossierPage = new DossierPage();
    }

    getRadioListItems() {
        return this.getElement().$$('.mstrmojo-RadioListHoriz-item,.mstrmojo-RadioList-item');
    }

    getRadioListItemsButton() {
        return this.getElement().$$('.mstrmojo-RadioListHoriz-item>input,.mstrmojo-RadioList-item>input');
    }

    getItemByText(text) {
        return this.getElement()
            .$$('.mstrmojo-RadioListHoriz-item, .mstrmojo-RadioList-item, .item')
            .filter(async (elem) => {
                const elemText = await this.getInnerText(elem);
                return elemText === this.escapeRegExp(text) || elemText.includes(text);
            })[0];
    }

    /**
     * @param {Number} index start from 1
     * @param {*} text reserved for better understanding for the item cliked
     */
    async selectNthItem(index, text) {
        await this.click({ elem: this.getRadioListItemsButton()[index - 1] });
    }

    async getSelectedItemText() {
        // add logic to ajudge no-selection
        for (const item of await this.getRadioListItems()) {
            if (await this.isSelected(item)) {
                return item.getText();
            }
            // return this.getElement().$('.selected').getText();
        }
        return null;
    }

    async selectItemByText(text, checkDocumentLoaded = true) {
        await this.click({ elem: this.getItemByText(text) });
        await this.waitDocumentToBeLoaded(checkDocumentLoaded);
    }

    // use index to assert to avoid I18N issues
    async isItemSelected(index, text) {
        return this.isSelected(this.getRadioListItems()[index - 1]);
    }

    async isItemSelectedByText(text) {
        await this.waitForElementVisible(this.getItemByText(text));
        return this.isSelected(this.getItemByText(text));
    }

    async isEmptySelector() {
        const radioItems = await this.getRadioListItems();
        for (const item of radioItems) {
            const className = await item.getAttribute('class');
            if (className.indexOf('selected') > -1) {
                return false;
            }
        }
        return true;
    }

    async isItemExisted(item) {
        const el = await this.getRadioListItems();
        return this.isExisted(item, el, 'text');
    }

    async getSeletedItemsCount() {
        const selectedItems = await this.getSelected(this.getRadioListItems());
        return selectedItems.length;
    }
}
