import TransactionConfigEditor from './TransactionConfigEditor.js';

export default class DatabaseTable extends TransactionConfigEditor {
    constructor() {
        super();
    }

    get replaceTableButton() {
        return this.txnConfigEditor.$(
            `.//div[@class='database-table-header']/div[@class='database-table-picker-button']`
        );
    }

    get databaseSectionLayout() {
        return this.txnConfigEditor.$(
            `.//div[contains(@class, 'ant-tabs-tabpane-active')]//div[@class='database-section-layout']`
        );
    }

    getDatabaseSectionByText(text) {
        return this.txnConfigEditor.$(`.//div[@class='database-table-header']//div[string()='${text}']`);
    }

    getSelectColumnsTitleByText(text) {
        return this.txnConfigEditor.$(`.//div[@class='database-header-message' and string()='${text}']`);
    }

    get searchBox() {
        return this.databaseSectionLayout.$(`.//span[contains(@class, 'db-table-search')]/span/input`);
    }

    get searchButton() {
        return this.databaseSectionLayout.$(`.//button[contains(@class, 'ant-input-search-button')]`);
    }

    getColumnCheckbox(name) {
        return this.databaseSectionLayout.$(
            `.//div[@class='db-column-list']//input[@type='checkbox'][@value='${name}']`
        );
    }

    async setColumnCheckbox(name, isCheck) {
        const el = this.getColumnCheckbox(name);
        const status = await el.isSelected();
        if (status !== isCheck) {
            await el.waitForExist({
                timeout: 5000,
                timeoutMsg: 'Element was not present in the DOM after 5 seconds',
            });
            await el.click();
        }
    }

    async clickSearchButton() {
        const el = this.searchButton;
        await this.clickOnElement(el);
    }

    async clickReplaceTableButton() {
        const el = this.replaceTableButton;
        await this.clickOnElement(el);
    }

    async searchForObject(objectName) {
        const searchField = this.searchBox;
        await this.typeParameterToInputField(searchField, objectName);
        await this.clickSearchButton();
        await browser.sleep(1000);
    }

    async clearSearchForObject() {
        const searchField = this.searchBox;
        await this.clearTextByBackSpace(searchField);
        await browser.sleep(1000);
    }

    async getDeleteButtonByRow(row) {
        return $$("//div[contains(@class, 'delete-column-container')]//button[contains(@class,'txn-insert-remove')]")[
            parseInt(row, 10) - 1
        ];
    }
}
