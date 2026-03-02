//import DocAuthBasePage from '../base/DocAuthBasePage.js';
// extends DocAuthBasePage {
import TransactionConfigEditor from './TransactionConfigEditor.js';

export default class TXNSQLEditorCheckbox extends TransactionConfigEditor {
    getCheckbox(rootElement) {
        return rootElement.$(`.//input[@type='checkbox']/parent::span[contains(@class,'ant-checkbox')]`);
    }

    getStatusNode(rootElement, status) {
        return this.getCheckbox(rootElement).$(`./self::span[contains(@class, '${status}')]`);
    }

    async setCheckbox(rootElement, isActionCheck) {
        const el = this.getCheckbox(rootElement);
        await el.waitForExist({ timeout: 5000 });
        const classValue = await el.getAttribute('class');
        const isChecked = classValue.includes('checked');

        if (isChecked !== isActionCheck) {
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
