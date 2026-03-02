import BasePage from '../base/BasePage.js';
import DossierPage from '../dossier/DossierPage.js';

export default class AdvancedSort extends BasePage {
    constructor() {
        super();
        this.dossierPage = new DossierPage();
    }

    // Element locator
    getSortEditor() {
        return this.$('.mstrmojo-AdvancedSortEditorReact');
    }

    getSortRulesContainer() {
        return this.getSortEditor().$('.mstr-advanced-sort-content');
    }

    getSortRulesPanel() {
        return this.getSortRulesContainer()
            .$$('.mstr-advanced-sort-rulesPanel')
            .filter((elem) => elem.isDisplayed())[0];
    }

    getSortRows() {
        return this.getSortRulesPanel().$$('.mstr-advanced-sort-item');
    }

    getSortRow(rowNum) {
        return this.getSortRows()[rowNum - 1];
    }

    getSortByDropdown(rowNum) {
        return this.$(
            `//li[contains(@class,'mstr-advanced-sort-item')][${rowNum}]//div[contains(@class,'mstr-advanced-sort-orderSelect')]`
        );
    }

    getOrderDropdown(rowNum) {
        return this.$(
            `//li[contains(@class,'mstr-advanced-sort-item')][${rowNum}]//div[contains(@class,'mstr-advanced-sort-sortSelect')]`
        );
    }

    getSortByDropdownList() {
        return this.$('.mstr-advanced-sort-orderSelect-dropdown__dropdown-list');
    }

    getSortObjectPopList(objectName) {
        return this.$(
            `//div[contains(@class,'mstr-advanced-sort-orderSelect-dropdown__dropdown-list')]//span[text()='${objectName}']`
        );
    }

    getOrderDropdownList() {
        return this.$('.mstr-advanced-sort-sortSelect-dropdown__dropdown-list');
    }

    getSortOrderPopList(sortOrder) {
        let sortOrderName = 'Ascending';
        switch (sortOrder.toLowerCase()) {
            case 'ascending':
                sortOrderName = 'Ascending';
                break;
            case 'descending':
                sortOrderName = 'Descending';
                break;
        }

        return this.$(
            `//div[contains(@class,'mstr-advanced-sort-sortSelect-dropdown__dropdown-list')]//span[text()='${sortOrderName}']`
        );
    }

    getDropdownSelectedText(elem) {
        return elem.$('input').getValue();
    }

    getRowDeleteBtn(rowNum) {
        return this.getSortRow(rowNum).$('.mstr-advanced-sort-delete');
    }

    getRowsBtn() {
        return this.$(`//div[contains(@class,'mstr-toggle-group')]//button[text()='Rows']`);
    }

    getColumnsBtn() {
        return this.$(`//div[contains(@class,'mstr-toggle-group')]//button[text()='Columns']`);
    }

    async hoverOnAdvanceEditor() {
        return await this.hover({ elem: this.getSortEditor() });
    }

    async getEditorBtn(text) {
        return this.$(`//div[contains(@class,'mstr-advanced-sort-actions')]//button[text()='${text}']`);
    }

    // action helper
    async openDropdown(el) {
        await this.click({ elem: el });
        await this.waitForElementVisible(this.getDropdownList());
    }

    async openSortByDropdown(rowNum) {
        const el = this.getSortByDropdown(rowNum);
        await this.click({ elem: el, checkClickable: false });
        await this.waitForElementVisible(this.getSortByDropdownList());
    }

    async openOrderDropdown(rowNum) {
        const el = this.getOrderDropdown(rowNum);
        await this.click({ elem: el, checkClickable: false });
        await this.waitForElementVisible(this.getOrderDropdownList());
    }

    async selectSortByDropdownItem(item) {
        const el = this.getSortObjectPopList(item);
        await this.click({ elem: el });
        await this.waitForElementInvisible(this.getSortByDropdownList());
    }

    async selectOrderDropdownItem(item) {
        const el = this.getSortOrderPopList(item);
        await this.click({ elem: el });
        await this.waitForElementInvisible(this.getOrderDropdownList());
    }

    async openAndselectSortBy(rowNum, item) {
        await this.openSortByDropdown(rowNum);
        await this.click({ elem: this.getSortObjectPopList(item) });
        await this.waitForElementInvisible(this.getSortByDropdownList());
    }

    async openAndSelectOrder(rowNum, item) {
        await this.openOrderDropdown(rowNum);
        await this.click({ elem: this.getSortOrderPopList(item) });
        await this.waitForElementInvisible(this.getOrderDropdownList());
    }

    async openAndselectSortByAndOrder(rowNum, sortby, order) {
        await this.openAndselectSortBy(rowNum, sortby);
        await this.openAndSelectOrder(rowNum, order);
    }

    async delete(rowNum) {
        return this.click({ elem: this.getRowDeleteBtn(rowNum) });
    }

    async switchToRows() {
        return this.click({ elem: this.getRowsBtn() });
    }

    async switchToColumns() {
        return this.click({ elem: this.getColumnsBtn() });
    }

    async save() {
        const el = await this.getEditorBtn('OK');
        await this.click({ elem: el });
        await this.waitForElementInvisible(this.getSortEditor());
    }

    async cancel() {
        const el = await this.getEditorBtn('Cancel');
        await this.click({ elem: el });
        await this.waitForElementInvisible(this.getSortEditor());
    }

    async scrollListToBottom() {
        const rowNum = await this.getSortRowsCount();
        const lastElem = await this.getSortRow(rowNum);
        await lastElem.scrollIntoView();
    }

    // assertion helper

    async getSortRowsCount() {
        return this.getSortRows().length;
    }

    async getSortByListItemsCount() {
        return await this.$$('.mstr-advanced-sort-orderSelect-dropdown__option').length;
    }

    async getOrderListItemsCount() {
        return await this.$$('.mstr-advanced-sort-sortSelect-dropdown__option').length;
    }

    async getSortBySelectedText(rowNum) {
        return this.getDropdownSelectedText(this.getSortByDropdown(rowNum));
    }

    async getOrderSelectedText(rowNum) {
        return this.getDropdownSelectedText(this.getOrderDropdown(rowNum));
    }

    async isRowsSelected() {
        const el = await this.getRowsBtn();
        const ariaSelected = await el.getAttribute('aria-selected');
        return ariaSelected === 'true';
    }

    async isColumnsSelected() {
        const el = await this.getColumnsBtn();
        const ariaSelected = await el.getAttribute('aria-selected');
        return ariaSelected === 'true';
    }

    async isSortByDisabled() {
        const el = (await this.getSortByDropdown(1)).$('input');
        const disabledAttr = await el.getAttribute('disabled');
        return disabledAttr !== null && disabledAttr !== false;
    }

    async isAdvancedSortEditorPresent() {
        return this.getSortEditor().isDisplayed();
    }
}
