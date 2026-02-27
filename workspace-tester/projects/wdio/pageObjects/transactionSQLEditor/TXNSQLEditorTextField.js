//import DocAuthBasePage from '../base/DocAuthBasePage.js';

// extends DocAuthBasePage {
export default class TXNSQLEditorTextField {
    getTextField(rootElement) {
        return rootElement.$(`.//*[contains(@class,'ant-input')]`);
    }

    async setTextField(rootElement, value) {
        const el = this.getTextField(rootElement);
        await this.replaceTextByClickingOnElement(el, value);
    }
}
