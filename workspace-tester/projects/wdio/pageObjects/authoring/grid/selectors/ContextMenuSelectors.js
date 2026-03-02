import BaseContainer from '../../BaseContainer.js';

/**
 * Context menu selectors for grid interactions
 * @extends BaseContainer
 */
export default class ContextMenuSelectors extends BaseContainer {
    constructor() {
        super();
    }

    get contextMenu() {
        return this.$('//div[contains(@class,"mstrmojo-ui-Menu-item-container")]');
    }

    /** @type {Promise<ElementFinder>} */
    getContextMenuOption(contextMenuOption) {
        return this.contextMenu.$(`//div[text()='${contextMenuOption}']`);
    }

    /**
     * Page object for secondary context menu
     * @param {string} option Secondary Context Menu option
     */
    getSecondaryContextMenu(secondaryOption) {
        let path = `//div[contains(@class,'mstrmojo-popup-widget-hosted')]//div[contains(@class, 'mstrmojo-scrollNode')]//child::*[text()='${secondaryOption}']`;
        return this.$(path);
    }

    getSortWithinAttribute(sortAttribute) {
        return this.$(
            `//a[contains(@class,'item xt') and contains(@class, 'mstrmojo-ui-Menu-item')]//*[text()='${sortAttribute}']`
        );
    }

    get metricSortClearIcon() {
        return this.$('.mstrmojo-ui-Menu-item-container .item.xt.btn.clr.mstrmojo-ui-Menu-item .micn');
    }

    get metricSortAscendingIcon() {
        return this.$('.mstrmojo-ui-Menu-item-container .item.xt.btn.asc.mstrmojo-ui-Menu-item .micn');
    }

    get metricSortDescendingIcon() {
        return this.$('.mstrmojo-ui-Menu-item-container .item.xt.btn.desc.mstrmojo-ui-Menu-item .micn');
    }

    get AdvancedSortEditor() {
        return this.$(`.mstrmojo-AdvancedSortEditor[style*='display: block']`);
    }

    get NumberOfRowsInAdvancedSortEditor() {
        return this.$$(`.mstrmojo-AdvancedSortEditor-RulesPanel[style*='display: block'] .mstrmojo-SortRow`).length;
    }
}
