import BasePage from '../base/BasePage.js';
export default class TXNSQLEditorInputNumField extends BasePage {
    getInputNumField(rootElement) {
        return rootElement.$(
            `.//div[contains(@class, 'ant-input-number')]//input[contains(@class,'ant-input-number-input')]`
        );
    }

    getErrorInputNumField(rootElement) {
        return rootElement.$(
            `.//div[contains(@class, 'ant-input-number') and contains(@class, 'min-max-error')]//input[contains(@class,'ant-input-number-input')]`
        );
    }

    async setInputNumField(rootElement, value) {
        const inputBox = await this.getInputNumField(rootElement);
        await this.clear({ elem: inputBox });
        await this.sleep(1000);
        return await inputBox.setValue(value);
    }

    async getDeleteButtonByRow(row) {
        return $$("//div[contains(@class, 'delete-column-container')]//button[contains(@class,'txn-insert-remove')]")[
            parseInt(row, 10) - 1
        ];
    }
}
