import TransactionConfigEditor from './TransactionConfigEditor.js';

export default class TXNConfigSQLEditor extends TransactionConfigEditor {
    get currentTxnView() {
        return this.txnConfigEditor.$(
            `.//div[@role='tabpanel' and not(@style='display: none;')]//div[contains(@class, 'txn-tab-top-bar-layout')]//span[contains(@class, 'ant-radio-button-checked')]//input`
        );
    }

    get sqlEditorStatic() {
        return this.txnConfigEditor.$(
            `.//div[contains(@class, 'ant-tabs-tabpane-active')]//div[contains(@class, 'mstr-sql-editor-container')]//div[contains(@class, 'monaco-mouse-cursor-text') and contains(@class, 'view-lines')]`
        );
    }

    getTableName(tablename) {
        return this.txnConfigEditor.$(
            `.//div[contains(@class, 'ant-tabs-tabpane-active')]//span[contains(@class, 'table-name') and text()='${tablename}']`
        );
    }

    get sqlEditor() {
        return this.txnConfigEditor.$(
            `.//div[contains(@class, 'ant-tabs-tabpane-active')]//div[contains(@class, 'mstr-sql-editor-container')]//textarea[contains(@class, 'inputarea monaco-mouse-cursor-text')]`
        );
    }

    getTableRefreshIcon() {
        return this.txnConfigEditor.$(
            `.//div[contains(@class, 'ant-tabs-tabpane-active')]//div[contains(@class, 'sql-editor-title-section')]//span[contains(@class, 'input-cfg-sql-mapping-icon')]`
        );
    }

    getTxnView(name) {
        return this.txnConfigEditor.$(
            `.//div[@role='tabpanel' and not(@style='display: none;')]//div[contains(@class, 'txn-tab-top-bar-layout')]//div[contains(@class, 'txn-${name.toLowerCase()}-icon')]`
        );
    }

    getSuggestionItem(name) {
        return this.txnConfigEditor.$(
            `.//div[contains(@class, 'mstr-sql-editor-container')]//div[contains(@class, 'monaco-list-rows')]//span[contains(@class, 'monaco-highlighted-label')]//span[text()='${name}']`
        );
    }

    getAutoCompleteCharacter() {
        return this.txnConfigEditor.$(`.//span[contains(@class, 'auto-closed-character')]`);
    }

    async clickTableRefreshIcon() {
        await this.clickOnElement(this.getTableRefreshIcon());
    }

    async selectTxnView(name) {
        const el = this.getTxnView(name);
        await this.clickOnElement(el);
    }

    async selectSuggestionItem(name) {
        const option = this.getSuggestionItem(name);
        const popListContent = this.getAutoCompleteListbox();
        const popWholeList = this.getAutoCompleteList();
        const popScrollbarSlider = this.getAutoCompleteListScrollbar();
        await this.scrollDownToTargetOptionByDnDScrollbar(popListContent, popWholeList, popScrollbarSlider, option);
        await this.clickOnElement(option);
    }

    getAutoCompleteListbox() {
        return this.txnConfigEditor.$(
            `.//div[contains(@class, 'monaco-list')][@role='listbox']/div[contains(@class, 'monaco-scrollable-element')]`
        );
    }

    getAutoCompleteListScrollbar() {
        return this.txnConfigEditor.$(
            `.//div[contains(@class, 'monaco-list')][@role='listbox']/div[contains(@class, 'monaco-scrollable-element')]//div[contains(@class, 'scrollbar vertical')]/div[contains(@class, 'slider')]`
        );
    }

    getAutoCompleteList() {
        return this.txnConfigEditor.$(`.//div[contains(@class, 'monaco-list-rows')]`);
    }

    getAutoCompleteElements() {
        return this.txnConfigEditor.$$(`.//div[contains(@class, 'monaco-list-row')]`);
    }

    async getAutoCompleteItem(index) {
        return this.txnConfigEditor.$(`.//div[contains(@class,'monaco-list-row') and @role='option'][${index}]`);
    }

    async validateAutoCompleteItem(rowItem, itemName, iconType) {
        const elContent = await rowItem.$(`.//span[contains(@class,'monaco-icon-name-container')]`);
        expect(await elContent.getAttribute('textContent')).to.equal(itemName);

        let iconClass;
        switch (iconType) {
            case 'Metric':
                iconClass = 'codicon-symbol-enum-member';
                break;
            case 'Attribute':
                iconClass = 'codicon-symbol-enum';
                break;
            case 'Column':
                iconClass = 'codicon-symbol-keyword';
                break;
            case 'Prompt':
                iconClass = 'codicon-symbol-constructor';
                break;
            default:
                throw 'do not support this icon type, please ask code owner to support it';
        }
        const elIcon = rowItem.$(`.//div[contains(@class, ${iconClass})]`);
        expect(await elIcon.isPresent()).equal(true);
    }
}
