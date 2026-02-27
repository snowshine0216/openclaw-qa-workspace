import BasePage from '../base/BasePage.js';

export default class MissingNuggetsDialog extends BasePage {
    // Element Locators

    getNuggetsNotificationDialog() {
        return this.$('.ant-modal .mstrd-NuggetsNotificationDialog-main');
    }

    getReuploadButtonOnNuggetsNotificationDialog() {
        return this.getNuggetsNotificationDialog().$('.mstrd-NuggetsNotificationDialog-okBtn');
    }

    getCancelButtonOnNuggetsNotificationDialog() {
        return this.getNuggetsNotificationDialog().$('.mstrd-NuggetsNotificationDialog-cancelBtn');
    }

    // Actions

    async clickReuploadButtonOnNuggetsMissingDialog() {
        await this.waitForElementVisible(this.getNuggetsNotificationDialog());
        await this.click({ elem: this.getReuploadButtonOnNuggetsNotificationDialog() });
    }

    async clickCancelButtonOnNuggetsMissingDialog() {
        await this.waitForElementVisible(this.getNuggetsNotificationDialog());
        await this.click({ elem: this.getCancelButtonOnNuggetsNotificationDialog() });
    }
}
