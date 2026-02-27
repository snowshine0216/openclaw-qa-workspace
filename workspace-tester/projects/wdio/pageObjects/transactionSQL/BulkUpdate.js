import BulkEdit from './BulkEdit.js';

export default class BulkUpdate extends BulkEdit {
    async getUpdatedCell(row, col) {
        return $(
            `${this.getBulkTxnContainerPath('Update')}//div[contains(@class, 'transaction-pending') and @r = '${row}' and @c = '${col}']`
        );
    }

    getErrorCell(row, col) {
        return $(
            `${this.getBulkTxnContainerPath('Update')}//div[@r = '${row}' and @c = '${col}']//span[contains(@class, 'transaction-error-cell')]`
        );
    }

    getErrorIcon(row, col) {
        return this.getErrorCell(row, col).$(`.//div[contains (@class, 'transaction-input-error-icon')]`);
    }

    async getUpdatedRow(rowIndex) {
        return $(
            `${this.getBulkTxnContainerPath('Update')}//div[contains(@class, 'update-row-pending') and @row-index = '${rowIndex}']`
        );
    }

    async getInputField() {
        return $(
            `${this.getBulkTxnContainerPath('Update')}//textarea[contains(@class, 'txn-textarea')] | .//span[contains(@class, 'txn-textbox-input')]//input[contains(@class, 'ant-input')]`
        );
    }

    async enterOnInput() {
        const input = await this.getInputField();
        await this.confirmInputTextByPressingEnterKeyOn(input);
    }

    async getDeleteButtonByRow(row) {
        return $$("//div[contains(@class, 'delete-column-container')]//button[contains(@class,'txn-insert-remove')]")[
            parseInt(row, 10) - 1
        ];
    }
}
