import BulkEdit from './BulkEdit.js';

export default class BulkDelete extends BulkEdit {
    async getCheckedDeleteRow(rowIndex, bulkMode = 'Delete Data') {
        return $(
            `${this.getBulkTxnContainerPath(bulkMode)}//div[contains(@class, 'ag-center-cols-container')]//div[contains(@class, 'bulk-delete-row') and contains(@class, 'ag-row-selected') and @row-index = '${rowIndex}']`
        );
    }

    async getDeleteCell(rowIndex, bulkMode = 'Delete Data') {
        return $(
            `${this.getBulkTxnContainerPath(bulkMode)}//div[contains(@class, 'ag-center-cols-container')]//div[contains(@class, 'bulk-delete-row') and @row-index = '${rowIndex}']//div[contains(@class, 'ag-cell') and @c = '0']`
        );
    }

    async getCheckedDeleteCheckbox(rowIndex, bulkMode = 'Delete Data') {
        return $(
            `${this.getBulkTxnContainerPath(bulkMode)}//div[contains(@class, 'ag-center-cols-container')]//div[contains(@class, 'bulk-delete-row') and @row-index = '${rowIndex}']//div[contains(@class, 'ag-checked')]`
        );
    }

    getDeleteHeaderCheckbox(bulkMode = 'Delete Data') {
        return $(
            `${this.getBulkTxnContainerPath(bulkMode)}//span[@class='delete-header-checkbox-label']/preceding-sibling::div[@role='checkbox']`
        );
    }

    async setDeleteHeaderCheckbox(isActionCheck, bulkMode) {
        const el = this.getDeleteHeaderCheckbox(bulkMode);
        const status = await el.getAttribute('aria-checked');
        if (status !== isActionCheck) {
            await browser.wait(EC.presenceOf(el), browser.params.timeout.waitDOMNodePresentTimeout5);
            await this.sleep(200);
            await el.click();
        }
    }

    async getDeleteButtonByRow(row) {
        return $$("//div[contains(@class, 'delete-column-container')]//button[contains(@class,'txn-insert-remove')]")[
            parseInt(row, 10) - 1
        ];
    }
}
