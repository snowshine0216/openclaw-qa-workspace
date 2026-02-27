import BasePage from '../base/BasePage.js';

export default class LibraryNotification extends BasePage {
    constructor() {
        super();
    }

    // Element locator

    getFloatNotification() {
        return this.$('.mstrd-FloatNotifications');
    }

    getFloatNotificationCloseButton() {
        return this.getFloatNotification().$('.mstrd-FloatNotifications-closeButton');
    }

    getFloatNotificationMessage() {
        return this.getFloatNotification().$('.mstrd-FloatNotifications-item').getText();
    }

    getMobileSmartBanner() {
        return this.$('.mstrd-SmartBanner');
    }

    getMobileSmartBannerCloseButton() {
        return this.getMobileSmartBanner().$('.mstrd-SmartBanner-close');
    }

    getMobileSmartBannerDownloadButton() {
        return this.getMobileSmartBanner().$('.mstrd-SmartBanner-openLink=Download');
    }

    getMobileSmartBannerOpenButton() {
        return this.getMobileSmartBanner().$('.mstrd-SmartBanner-openLink=Open');
    }

    // Snapshot notification locators

    getNotificationSection() {
        return this.$('.ant-notification.ant-notification-bottomRight');
    }

    getNotifications() {
        return this.$$('.ant-notification-notice');
    }

    getNotificationMessages() {
        return this.getNotificationSection().$$('.mstrd-Notification-message');
    }

    getNotificationDescriptions() {
        return this.getNotificationSection().$$('.mstrd-Notification-description');
    }

    async getNotificationMessageTextByIndex(index = 0) {
        const messages = await this.getNotificationMessages();
        return messages[index].getText();
    }

    async getNotificationDescriptionTextByIndex(index = 0) {
        const descriptions = await this.getNotificationDescriptions();
        return descriptions[index].getText();
    }

    getSnapshotNotificationByName(notificationName, message) {
        return this.getNotifications().filter(async (notification) => {
            const messageElement = await notification.$('.mstrd-Notification-message');
            const ariaLabel = await messageElement.getAttribute('aria-label');
            return ariaLabel && ariaLabel.includes(notificationName) && ariaLabel.includes(message);
        });
    }

    getSnapshotInProgressNotificationByName(notificationName) {
        return this.getSnapshotNotificationByName(notificationName, 'The snapshot is being created in the background.');
    }

    getSnapshotReadyNotificationByName(notificationName) {
        return this.getSnapshotNotificationByName(notificationName, 'Snapshot is ready to view.');
    }

    getSnapshotErrorNotificationByName(notificationName) {
        return this.getSnapshotNotificationByName(notificationName, 'Error creating snapshot.');
    }

    getSnapshotNotificationCloseButton(notificationElement) {
        return notificationElement.$('.ant-notification-notice-close');
    }

    getSnapshotNotificationOpenLink(notificationElement) {
        return notificationElement.$('.mstrd-Notification-descriptionLink');
    }

    getSnapshotNotificationDescription(notificationElement) {
        return notificationElement.$('.mstrd-Notification-description');
    }

    getSnapshotNotificationMessage(notificationElement) {
        return notificationElement.$('.mstrd-Notification-message');
    }

    // Action method

    async clickNotificationCloseButton() {
        return this.click({ elem: this.getFloatNotificationCloseButton() });
    }

    async openReadyNotificationByName(notificationName) {
        const readyNotifications = await this.getSnapshotReadyNotificationByName(notificationName);
        if (readyNotifications.length > 0) {
            const openLink = await this.getSnapshotNotificationOpenLink(readyNotifications[0]);
            return this.click({ elem: openLink });
        }
        throw new Error(`No ready notification found for: ${notificationName}`);
    }

    async closeSnapshotNotificationByName(notificationName) {
        const notifications = await this.getSnapshotNotificationByName(notificationName);
        if (notifications.length > 0) {
            const closeButton = await this.getSnapshotNotificationCloseButton(notifications[0]);
            return this.click({ elem: closeButton });
        }
        throw new Error(`No notification found for: ${notificationName}`);
    }

    // Assertion helpers

    async isSmartBannerVisible() {
        return await this.getMobileSmartBanner().isDisplayed();
    }

    async isNotificationVisible() {
        return await this.getFloatNotification().isDisplayed();
    }

    async isNotificationCloseButtonVisible() {
        return await this.getFloatNotificationCloseButton().isDisplayed();
    }

    async isSnapshotInProgressNotificationVisible(notificationName) {
        try {
            const notifications = await this.getSnapshotInProgressNotificationByName(notificationName);
            return notifications.length > 0 && (await notifications[0].isDisplayed());
        } catch (error) {
            return false;
        }
    }

    async isSnapshotReadyNotificationVisible(notificationName) {
        try {
            const notifications = await this.getSnapshotReadyNotificationByName(notificationName);
            return notifications.length > 0 && (await notifications[0].isDisplayed());
        } catch (error) {
            return false;
        }
    }

    async getSnapshotNotificationDescriptionText(notificationName) {
        const notifications = await this.getSnapshotNotificationByName(notificationName);
        if (notifications.length > 0) {
            const description = await this.getSnapshotNotificationDescription(notifications[0]);
            return await description.getText();
        }
        throw new Error(`No notification found for: ${notificationName}`);
    }

    async getSnapshotNotificationMessageText(notificationName) {
        const notifications = await this.getSnapshotNotificationByName(notificationName);
        if (notifications.length > 0) {
            const message = await this.getSnapshotNotificationMessage(notifications[0]);
            return await message.getText();
        }
        throw new Error(`No notification found for: ${notificationName}`);
    }

    async getNotificationMessage(notificationName) {
        const notifications = await this.getSnapshotNotificationByName(notificationName);
        if (notifications.length > 0) {
            const message = await this.getSnapshotNotificationMessage(notifications[0]);
            return await message.getText();
        }
        return null;
    }

    async getAllNotificationMessages() {
        const notifications = await this.getNotifications();
        const messages = [];

        for (const notification of notifications) {
            try {
                const messageElement = await this.getSnapshotNotificationMessage(notification);
                const messageText = await messageElement.getText();
                messages.push(messageText);
            } catch (error) {
                // Skip notifications that don't have message elements
                continue;
            }
        }

        return messages;
    }

    async getNotificationCount() {
        const notifications = await this.getNotifications();
        return notifications.length;
    }

    async waitForAllNotificationShown(cnt = 2) {
        const maxRetry = 60;
        let retry = 0;
        while ((await this.getNotificationCount()) < cnt && retry < maxRetry) {
            await browser.pause(1000);
            retry++;
        }
        if (retry === maxRetry) {
            throw new Error(`Failed to show ${cnt} notifications within ${maxRetry} seconds.`);
        }
    }
}
