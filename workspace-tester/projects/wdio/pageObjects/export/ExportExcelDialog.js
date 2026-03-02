import BasePage from '../base/BasePage.js';

export default class ExportExcelDialog extends BasePage {
    // element locators

    getExportExcelPanel() {
        return this.$('.mstrd-ExportExcelDialog');
    }

    getExportButton() {
        return this.getExportExcelPanel().$('.mstrd-ExportExcelDialog-btns').$('.mstrd-Button--primary');
    }

    // action methods

    async clickExportButton() {
        await this.waitForElementVisible(this.getExportButton(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Export button is not present',
        });
        return this.getExportButton().click();
    }

    // assertion helpers
}
