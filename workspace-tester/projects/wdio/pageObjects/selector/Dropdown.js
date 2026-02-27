import BaseComponent from '../base/BaseComponent.js';
import TitleBar from '../document/TitleBar.js';
import DossierPage from '../dossier/DossierPage.js';
import { scrollElement } from '../../utils/scroll.js';

export default class Dropdown extends BaseComponent {
    constructor(container) {
        super(container, '.mstrmojo-ui-Pulldown');
        this.dossierPage = new DossierPage();
    }

    getTitle() {
        const plocator = this.getElement().$('../../../..').$('.mstrmojo-portlet-titlebar');
        const el = new TitleBar(plocator);
        return el;
    }

    // Locator
    getDropdownList() {
        const dropdownLists = this.$$(
            '.mstrmojo-PopupList.ctrl-popup-list.mstrmojo-scrollbar-host, .multi.mstrmojo-ui-Pulldown .mstrmojo-ui-PopupWidget, .mstrmojo-ui-PopupWidget'
        );
        return dropdownLists.filter((item) => item.isDisplayed())[0];
    }

    getDropdownListItems() {
        return this.getDropdownList().$$('.item');
    }

    getDropdownListItem(item) {
        return this.getDropdownList()
            .$$('.item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return this.escapeRegExp(elemText) === item;
            })[0];
    }

    getVerticalScrollBar() {
        return this.getDropdownList().$('.mstrmojo-scrollbar.vertical');
    }

    getButton(text) {
        return this.getDropdownList()
            .$$('.mstrmojo-Button-text')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(text);
            })[0];
    }

    /**
     * Get drop down list window
     */
    getDropdownListContent(rootElement) {
        return rootElement.$(
            `.//div[@class='mstrListPulldown' and contains(@style, 'display: block')]/following-sibling::table[@class='mstrListBlock mstrAsPopup' and contains(@style,'display: table')]//div[@class='mstrListBlockContents']`
        );
    }

    /**
     * Get drop down elements list
     */
    getDropDownWholeList(rootElement) {
        return rootElement.$(
            `.//div[@class='mstrListPulldown' and contains(@style, 'display: block')]/following-sibling::table[@class='mstrListBlock mstrAsPopup' and contains(@style,'display: table')]//div[@class='mstrListBlockContents']/div[1]`
        );
    }

    /**
     * Get a selection node from drop down list
     * @param {String} option selection in opened drop down list
     */
    getSelection(option) {
        return this.getDropdownListContent().$(
            `.//div[contains(@class, 'ant-select-item-option-content')][text()='${option}']`
        );
    }

    getShownSelected() {
        return this.getElement().$('.mstrmojo-ui-Pulldown-text');
    }

    getDropdownText() {
        return this.getElement().$('.mstrmojo-ui-Pulldown-text');
    }

    // Action helper
    async openDropdownNoWait() {
        const width = await this.getElement().getSize('width');
        await this.hover({ elem: this.getElement() });
        await this.click({ elem: this.getElement() }, { x: width / 2 + 2, y: 3 }); // cannot open dropdown in exclude mode when using size.height
    }

    async clickDropdown() {
        await this.click({ elem: this.getDropdownText() });
    }

    async openDropdown() {
        await this.openDropdownNoWait();
        return this.waitForElementVisible(this.getDropdownListItems()[0]);
    }

    async closeDropdown() {
        await this.openDropdownNoWait();
        return this.waitForElementInvisible(this.getDropdownListItems()[0]);
    }

    async lastItemText() {
        const count = await this.getDropdownListItems().length;
        return this.getDropdownListItems()[count - 1].getText();
    }

    /**
     * @param {Number} index start from 1
     * @param {*} text reserved for better understanding for the item cliked
     */
    async selectNthItem(index, text) {
        await this.click({ elem: this.getDropdownListItems()[index - 1] });
        await this.sleep(1000);
        return this.waitDocumentToBeLoaded();
    }

    async selectItemByText(text, checkDocumentLoaded = true) {
        const newtext = this.escapeRegExp(text);
        await this.click({ elem: this.getDropdownListItem(newtext) });
        return this.waitDocumentToBeLoaded(checkDocumentLoaded);
    }

    /**
     * @param {String[]} texts item text array
     */
    async selectMultiItemByText(texts) {
        for (const text of texts) {
            await this.selectItemByText(text);
            await this.sleep(1000); // wait checkbox state change
        }
    }

    async clickOKBtn(checkDocumentLoaded = true) {
        await this.click({ elem: this.getButton('OK') });
        return this.waitDocumentToBeLoaded(checkDocumentLoaded);
    }

    async clickCancelBtn() {
        await this.click({ elem: this.getButton('Cancel') });
    }

    async openDropdownAndMultiSelect(texts) {
        await this.openDropdown();
        await this.selectMultiItemByText(texts);
        await this.clickOKBtn();
    }

    /**
     * Scroll dropdown list scroll bar
     * @param {Number} toPosition distance refeence to dropdown list top
     */
    async scrollDropdown(toPosition) {
        await scrollElement(this.getDropdownList().$('.mstrmojo-popupList-scrollBar'), toPosition);
    }

    async scrollAndSelectDropDown(rootElement, option) {
        let ddListContent = this.getDropdownListContent(rootElement);
        await this.waitForElementVisible(ddListContent, {
            timeout: browsers.params.timeout.waitDOMNodePresentTimeout5,
        });

        let ddContentHeight = await this.getElementHeight(ddListContent);
        let ddWholeList = this.getDropDownWholeList(rootElement);
        await this.waitForElementVisible(ddWholeList, {
            timeout: browsers.params.timeout.waitDOMNodePresentTimeout5,
        });

        let ddWholeListHeight = await this.getElementHeight(ddWholeList);

        if (ddWholeListHeight > ddContentHeight + 3) {
            await this.scrollDownToTargetOption(ddListContent, ddWholeList, this.getSelection(rootElement, option));
        }

        let ddItem = this.getSelection(rootElement, option);
        await this.click({ elem: ddItem });
    }

    // Assersion helper

    /**
     * Get the text of the shown selected item for the closed dropdown
     */
    async getShownSelectedText() {
        await this.waitForElementVisible(this.getShownSelected());
        return this.getShownSelected().getText();
    }

    async dropdownItemsCount() {
        return this.getDropdownListItems().length;
    }

    async isItemExisted(item) {
        const el = await this.getDropdownListItems();
        return this.isExisted(item, el, 'text');
    }

    async isItemSelected(item) {
        const el = await this.getDropdownListItem(item);
        return this.isSelected(el);
    }

    async isDropdownListPresent() {
        return this.getDropdownList().isDisplayed();
    }
}
