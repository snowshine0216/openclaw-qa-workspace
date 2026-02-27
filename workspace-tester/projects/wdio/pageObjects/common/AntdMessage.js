import BasePage from '../base/BasePage.js';

export default class AntdMessage extends BasePage {
    // Element locator

    getAntdMessage() {
        return this.$('.ant-message-notice');
    }

    getAntdMessageText() {
        return this.getAntdMessage().getText();
    }

    getAntdMessageCloseButton() {
        return this.getAntdMessage().$('.mstrd-Message-closeButton');
    }

    // Action method

    clickAntdMessageCloseButton() {
        return this.click({ elem: this.getAntdMessageCloseButton() });
    }

    // Assertion helpers

    async isAntdMessageCloseButtonVisible() {
        return await this.getAntdMessageCloseButton().isDisplayed();
    }

    async isAntdMessageVisible() {
        return await this.getAntdMessage().isDisplayed();
    }
}
