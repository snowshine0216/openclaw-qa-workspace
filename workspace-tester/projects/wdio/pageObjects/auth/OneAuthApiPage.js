import BasePage from '../base/BasePage.js';

export default class OneAuthApiPage extends BasePage {
    // Element Locator
    getAccessTokenButton() {
        return this.$('button=Get token');
    }
    getRefreshTokenButton() {
        return this.$('button=Refresh token');
    }

    getAccessTokenContainer() {
        return this.$('#access-token');
    }
    getRefreshTokenContainer() {
        return this.$('#refresh-token');
    }

    async getAccessTokenValue() {
        await this.waitForElementVisible(this.getAccessTokenContainer());
        const accessToken = await this.getAccessTokenContainer().getText();
        return accessToken;
    }

    async getRefreshTokenValue() {
        await this.waitForElementVisible(this.getRefreshTokenContainer());
        const refreshToken = await this.getRefreshTokenContainer().getText();
        return refreshToken;
    }

    async clickGetAccessTokenButton() {
        await this.waitForElementVisible(this.getAccessTokenButton());
        await this.getAccessTokenButton().click();
    }
    async clickRefreshAccessTokenButton() {
        await this.waitForElementVisible(this.getRefreshTokenButton());
        await this.getRefreshTokenButton().click();
    }
}
