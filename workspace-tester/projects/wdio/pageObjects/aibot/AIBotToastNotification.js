import BasePage from '../base/BasePage.js';

export default class AIBotToastNotification extends BasePage {
    // Element locator

    getToastNotification() {
        return this.$('.mstr-ai-chatbot-Toast');
    }

    getToastNotificationMessage() {
        return this.getToastNotification().getText();
    }

    getToastNotificationCloseButton() {
        return this.getToastNotification().$('.mstr-ai-chatbot-Toast-closeBtn');
    }

    // Action method

    clickToastNotificationCloseButton() {
        return this.click({ elem: this.getToastNotificationCloseButton() });
    }

    // Assertion helper
    async isToastNotificationVisible() {
        return await this.getToastNotification().isDisplayed();
    }
}
