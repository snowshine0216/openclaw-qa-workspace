import BaseComponent from '../base/BaseComponent.js';
import { scrollElement, scrollElementToBottom, scrollElementToTop } from '../../utils/scroll.js';

export default class RsdFilterPanel extends BaseComponent {
    constructor(locator) {
        super(null, locator);
    }

    static createbyName(name) {
        return new RsdFilterPanel(`div[nm="${name}"]`);
    }

    //element locator

    getButtons() {
        return this.getElement().$$('.mstrmojo-Button.mstrmojo-FilterPanel-Btn');
    }

    getResetButton() {
        return this.getButtons()[0];
    }

    getApplyButton() {
        return this.getButtons()[1];
    }

    getMenu() {
        return this.getElement().$('.mstrmojo-Button.mstrmojo-oivmSprite.tbDown');
    }

    getMenuListItems() {
        return this.$('#mstrFilterPanelMenu').$$('.mstrmojo-MenuItem.mstrmojo-InteractiveButton');
    }

    getMenuListItemsByText(text) {
        return this.$('#mstrFilterPanelMenu')
            .$$(`.mstrmojo-MenuItem-text`)
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === text;
            })[0];
    }

    getScrollContainer() {
        return this.getElement().$('.mstrmojo-DocPanel.scroll .mstrmojo-DocSubPanel-content');
    }

    getSelector(name) {
        return this.getScrollContainer().$(`div[nm="${name}"]`);
    }

    getBtnOnSelector(name) {
        return this.getSelector(name).$('.mstrmojo-portlet-slot-toolbar-left.wrap');
    }

    //action helper

    async clickUnset() {
        return this.click({ elem: this.getResetButton() });
    }

    async clickApply() {
        return this.click({ elem: this.getApplyButton() });
    }

    async openMenu() {
        return this.click({ elem: this.getMenu() });
    }

    async clickSelectorMenu(name) {
        return this.click({ elem: this.getBtnOnSelector(name) });
    }

    /**
     * Click Nth item of the menu item
     * @param {Number} index index of the menu list item
     * @param {String} text the text of the menu list item
     */

    async openAndChooseMenuByText(text) {
        await this.openMenu();
        return this.click({ elem: this.getMenuListItemsByText(text) });
    }

    /**
     * Scroll selector contents inside the filter panel
     * @param {*} toPosition the offset compared to the scroll container top
     */
    async scrollFilterPanel(toPosition) {
        return scrollElement(this.getScrollContainer(), toPosition);
    }

    async scrollFilterPanelToBottom() {
        return scrollElementToBottom(this.getScrollContainer());
    }

    async scrollFilterPanelToTop() {
        return scrollElementToTop(this.getScrollContainer());
    }

    /**
     * Click Nth item of the menu item
     * @param {Number} index index of the menu list item
     * @param {String} text the text of the menu list item
     */
    async clickMenuNthItem(index, text) {
        return this.click({ elem: this.getMenuListItems()[index - 1] });
    }
}
