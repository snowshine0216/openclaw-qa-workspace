import DossierMojoEditor from '../authoring/DossierMojoEditor.js';
import BaseFormatPanel from '../authoring/BaseFormatPanel.js';

const CONFIGDIALOG_BUTTON = {
    PAUSE: 'Pause transaction manipulations.',
};

export default class TransactionConfigEditor extends DossierMojoEditor {
    constructor() {
            super();
            this.baseFormatPanel = new BaseFormatPanel();
        }
    get txnConfigEditor() {
        return this.$('//div[contains(@class, "txn-editor-dialog")]');
    }

    get pythonTxnConfigEditor() {
        return this.$('//div[contains(@class, "python-txn-editor")]/div');
    }

    getTxnConfigEditorModalTitle(name) {
        return this.$(`//div[contains(@class, "mstrmojo-Editor-title") and text()='${name.replace(/ /g, '\u00a0')}']`);
    }

    getTxnEditorTab() {
        return this.txnConfigEditor.$('//div[contains(@class, "txn-editor-tabs")]');
    }

    getCurrentTxnTab() {
        return this.txnConfigEditor.$(
            './/div[contains(@class, "ant-tabs-nav-list")]//div[contains(@class, "ant-tabs-tab-active")]'
        );
    }

    getTxnTab(name) {
        return this.txnConfigEditor.$(
            `.//div[contains(@class, "ant-tabs-nav-list")]//div[contains(@class, "ant-tabs-tab")]//div[contains(@class, "ant-tabs-tab-btn") and text()='${name}']`
        );
    }

    getDisabledTxnTab(name) {
        return this.txnConfigEditor.$(
            `.//div[contains(@class, "ant-tabs-nav-list")]//div[contains(@class, "ant-tabs-tab-disabled")]//div[contains(@class, "ant-tabs-tab-btn")]//span[text() = '${name}']`
        );
    }

    getDisabledTabTooltip(tooltip) {
        return this.$(
            `.//div[contains(@class, "txn-input-cfg-tooltip") and not(contains(@class, "ant-tooltip-hidden"))]//div[text() = '${tooltip}']`
        );
    }

    getAfterSubmissionIcon() {
        return this.txnConfigEditor.$(
            './/div[@class="ant-tabs-extra-content"]//div[@class="txn-after-submission-header"]/parent::div[@class="ant-space-item"]/following-sibling::div/div[contains(@class, "txn-settings-button")]'
        );
    }

    getAfterSubmissionIconByText(text) {
        return this.txnConfigEditor.$(`.//div[contains(@class, "txn-after-submission-header") and string()='${text}']`);
    }

    getButtonOnFooter(name, type) {
        if (type == 'python') {
            return this.pythonTxnConfigEditor.$(
                `.//div[contains(@class, "txn-editor-footer")]//button[contains(@class, "txn-btn")]//span[text()='${name}']`
            );
        }
        else {
            return this.txnConfigEditor.$(
                `.//div[contains(@class, "txn-editor-footer")]//button[contains(@class, "txn-btn")]//span[text()='${name}']`
        );
        }
    }

    getAddTableButton() {
        return this.txnConfigEditor.$(
            `.//div[@role='tabpanel' and not(@style='display: none;')]//div[contains(@class, "txn-editor-content")]//button[contains(@class, "ant-btn")]/span[text()='Add Table']`
        );
    }

    getAddTableButtonByText(name) {
        return this.txnConfigEditor.$(
            `.//div[@role='tabpanel' and not(@style='display: none;')]//div[contains(@class, "txn-editor-content")]//button[contains(@class, "ant-btn")]/span[text()='${name}']`
        );
    }

    getAddTableHelperText(name) {
        return this.txnConfigEditor.$(`.//div[contains(@class, "ant-space-item")][string()='${name}']`);
    }

    getAddExistingTableHelperText(name) {
        return this.txnConfigEditor.$(`.//div[contains(@class, "ant-space-item")][text()='${name}']`);
    }

    async clickTableNameToAdd(name) {
        const tableElement = this.txnConfigEditor.$(`.//span[string()='${name}']`);
        await this.click({ elem: tableElement });
    }

    getPauseOnTabTop() {
        return this.txnConfigEditor.$(
            `.//div[@role='tabpanel' and not(@style='display: none;')]//div[contains(@class, "txn-tab-top-bar-layout")]//div[text()='${CONFIGDIALOG_BUTTON.PAUSE}']/preceding-sibling::div/button`
        );
    }

    getPauseTextOnTabTopByText(text) {
        return this.txnConfigEditor.$(
            `.//div[@role='tabpanel' and not(@style='display: none;')]//div[contains(@class, "txn-tab-top-bar-layout")]//div[text()='${text}']/preceding-sibling::div/button`
        );
    }

    getClearButton() {
        return this.txnConfigEditor.$(
            `.//div[@role='tabpanel' and not(@style='display: none;')]//div[contains(@class, "txn-tab-top-bar-layout")]//span[text()='Clear']/parent::button`
        );
    }

    getClearButtonByText(text) {
        return this.txnConfigEditor.$(
            `.//div[@role='tabpanel' and not(@style='display: none;')]//div[contains(@class, "txn-tab-top-bar-layout")]//span[text()='${text}']/parent::button`
        );
    }

    getViewToggleByText(text) {
        return this.txnConfigEditor.$(
            `.//div[@role='tabpanel' and not(@style='display: none;')]//div[contains(@class, "txn-tab-top-bar-layout")]//div[string()='${text}']`
        );
    }

    getPauseButtonOnTabTop() {
        return this.txnConfigEditor.$(
            `.//div[@role='tabpanel' and not(@style='display: none;')]//div[contains(@class, "txn-tab-top-bar-layout")]//div[text()='${CONFIGDIALOG_BUTTON.PAUSE}']/preceding-sibling::div/button`
        );
    }

    getSwitchToMappingNotification() {
        return this.$(
            `.//div[contains(@class, "ant-modal-wrap")]//div[contains(@class, "notification-content-section")]//div[contains(@class, "notification-title-text") and text() = 'Are you sure you want to switch to the mapping view?']`
        );
    }

    async clickSwitchToMappingNotificationButton(buttonText) {
        const notification = this.switchToMappingNotification;
        const button = await notification.$(
            `//ancestor::div[contains(@class, "ant-modal-content")]//button[contains(@class, "notification-button")]//span[text() = '${buttonText}']`
        );
        await this.click({ elem: button });
    }

    getMappedTable(tableName) {
        return this.txnConfigEditor.$(
            `.//div[@role='tabpanel' and contains(@class, "ant-tabs-tabpane-active")]//div[contains(@class, "txn-editor-content")]//span[text()='${tableName}']`
        );
    }

    async getActiveTxnTab() {
        const tab = await this.currentTxnTab;
        return tab.getText();
    }

    async selectTxnTab(name) {
        const el = this.getTxnTab(name);
        await this.click({ elem: el });
    }

    async clickButton(name, type='SQL') {
        let el;
        switch (name.toLowerCase()) {
            case 'done':
            case 'erledigt':
            case 'cancel':
                el = await this.getButtonOnFooter(name, type);
                break;
            case 'add table':
                el = await this.getAddTableButton();
                break;
            case 'clear':
                el = await this.clearButton;
                break;
            default:
                throw 'Button is not supported with this step!';
        }
        await this.waitForElementClickable(el);
        await this.click({ elem: el });
    }

    async clickTableColumn(columnName) {
        const el = await this.txnConfigEditor.$(
            `.//div[@class='database-section-layout']//div[@class='db-column-list']//input[@value='${columnName}']/..`
        );
        await this.click({ elem: el });
    }

    async clickWhereClauseButtons(columnName) {
        const el = await this.txnConfigEditor.$(`.//div[@class='mapping-editor-section']//div[@class='ant-space-item']//span[text()='${columnName}']/../..//div[contains(@class, 'where-clause-button')]`);
        await this.click({ elem: el });
    }

    async clickAddTableButtonByText(name) {
        const el = this.getAddTableButtonByText(name);
        await this.click({ elem: el });
    }

    async clickFooterButtonByText(name) {
        const el = this.getButtonOnFooter(name);
        await this.click({ elem: el });
    }

    async clickAfterSubmissionIcon() {
        const el = this.afterSubmissionIcon;
        await this.click({ elem: el });
    }

    async setPauseActions(isActionToggle) {
        const el = this.pauseButtonOnTabTop;
        const status = await el.getAttribute('aria-checked');
        if (status !== String(isActionToggle)) {
            await this.waitForElementPresent(el);
            await el.click();
        }
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async getSubmissionErrorMessage(errorMessage) {
        return this.txnConfigEditor.$(
            `.//div[contains(@class, "txn-submission-error-string") and text() = '${errorMessage}']`
        );
    }

    async getWarningMessage(message) {
        return this.txnConfigEditor.$(`.//div[contains(@class, "sql-editor-error-section") and text() = '${message}']`);
    }

    async clickMappedTable(tableName) {
        const el = this.getMappedTable(tableName);
        await this.click({ elem: el });
    }

    async getDeleteButtonByRow(row) {
        return $$("//div[contains(@class, 'delete-column-container')]//button[contains(@class,'txn-insert-remove')]")[
            parseInt(row, 10) - 1
        ];
    }

    async modifyActionName(actionName) {
        const input = await this.txnConfigEditor.$(
            `.//div[contains(@class,'ant-tabs-tabpane') and contains(@class,'ant-tabs-tabpane-active')]//input[@class='ant-input sql-action-name-input']`
        );
        await this.baseFormatPanel.clearAndSetValue(input, actionName);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

    }

    async waitForTransactionEditorLoaded() {
        await this.waitForElementVisible(this.txnConfigEditor);
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async getActionName() {
        const input = await this.txnConfigEditor.$(
            `.//div[contains(@class,'ant-tabs-tabpane') and contains(@class,'ant-tabs-tabpane-active')]//input[@class='ant-input sql-action-name-input']`
        );
        return input.getValue();
    }

    async getTopBarInTransactionEditor() {
        return this.txnConfigEditor.$(
            `.//div[contains(@class,'ant-tabs-tabpane') and contains(@class,'ant-tabs-tabpane-active')]//div[contains(@class,'txn-tab-top-bar-layout')]`
        );
    }

    // async inputConfigurationHeader(row) {
    //     const expectObjectArray = dataTable.rows()[0]; // dataTable.rows() in WDIO
    //     let objectName, el;
    //     for (let i = 0; i < expectObjectArray.length; i++) {
    //         el = await inputConfig.getColHeader(i + 1);
    //         await browser.waitUntil(async () => await el.isDisplayed(), {
    //             timeout: 10000, // Adjust the timeout to fit your needs
    //             timeoutMsg: `Column header ${i + 1} not displayed`
    //         });

    //         objectName = await el.getText();
    //         expect(objectName.includes(expectObjectArray[i])).toBe(true); // Jasmine assertion
    //     }
    // }
}
