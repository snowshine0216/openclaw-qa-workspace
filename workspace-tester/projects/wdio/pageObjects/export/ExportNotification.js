import BasePage from '../base/BasePage.js';

export default class ExportNotification extends BasePage {
    // element locators

    getExportCompleteNotification() {
        return this.$('.ant-notification.ant-notification-bottomRight');
    }

    getExportCompleteCloseButton() {
        return this.getExportCompleteNotification().$('.mstrd-Notification-closeIcon');
    }

    getExportCompleteDescription() {
        return this.getExportCompleteNotification().$('.mstrd-Notification-description');
    }

    // action methods

    async clickExportCompleteCloseButton() {
        return this.getExportCompleteCloseButton().click();
    }

    // assertion helpers

    async isExportCompleteNotificationVisible() {
        return await this.getExportCompleteNotification().isDisplayed();
    }

    async isExportCompleteCloseButtonVisible() {
        return await this.getExportCompleteCloseButton().isDisplayed();
    }

    async getExportCompleteDescriptionText() {
        return await this.getExportCompleteDescription().getText();
    }
}
