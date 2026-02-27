import BasePage from '../base/BasePage.js';

export default class OneAuthEmbeddingPage extends BasePage {
    // Element Locator
    getInputUrl() {
        return this.$('#serverUrl');
    }
    getOneAuthLoginButton() {
        return this.$('#oneauthentication');
    }
    getGetCurrentTokenButton() {
        return this.$('#getCurrentToken');
    }
    getRefreshAccessTokenButton() {
        return this.$('#refreshAccessToken');
    }
    getRevokeTokenButton() {
        return this.$('#revokeToken');
    }
    getGetAPISessionsButton() {
        return this.$('#getApiSessions');
    }
    getAccessTokenValue() {
        return this.$('.access-token-value');
    }
    getRefreshTokenValue() {
        return this.$('.refresh-token-value');
    }
    getResponse() {
        return this.$('#response');
    }

    // Action Helper
    async clickOneAuthLoginButton() {
        await this.waitForElementVisible(this.getOneAuthLoginButton());
        await this.getOneAuthLoginButton().click();
    }
    async clickGetCurrentTokenButton() {
        await this.getGetCurrentTokenButton().click();
    }
    async clickRefreshAccessTokenButton() {
        await this.getRefreshAccessTokenButton().click();
    }
    async clickRevokeTokenButton() {
        await this.getRevokeTokenButton().click();
    }
    async clickGetAPISessionsButton() {
        await this.getGetAPISessionsButton().click();
    }
    async waitForPopupWindowDisappear() {
        for (let i = 0; i < 10; i++) {
            const handles = await this.getBrowserTabs();
            if (handles.length === 1) {
                return;
            }
            await this.sleep(1000);
            console.log(`#${i} Try to wait for pop up window disappear`);
        }
    }

    async waitForPopupWindowAppear() {
        for (let i = 0; i < 10; i++) {
            const handles = await this.getBrowserTabs();
            if (handles.length === 2) {
                return;
            }
            await this.sleep(1000);
            console.log(`#${i} Try to wait for pop up window appear`);
        }
    }

    async switchToLibraryIframe() {
        await browser.waitUntil(
            async () => {
                let frames = await this.$$('iframe');
                return frames.length === 1;
            },
            {
                timeout: 100000,
                timeoutMsg: 'Expected to find exactly one iframe within the timeout period',
            }
        );
        await browser.switchToFrame(await this.$('iframe'));
        console.log('Switched to library iframe');
    }
    async waitForEmbeddedDossierLoading() {
        await this.waitForElementVisible(this.$('.mstrd-DossierViewContainer-main'));
    }
    async isDashboardPresent() {
        return await this.$('.mstrd-DossierViewContainer-main').isDisplayed();
    }
    async fetchAccessTokenValue() {
        const element = await this.getAccessTokenValue();
        const text = await element.getText();
        const tokenValue = text.split(': ')[1];
        return tokenValue;
    }
    async fetchRefreshTokenValue() {
        const element = await this.getRefreshTokenValue();
        const text = await element.getText();
        const tokenValue = text.split(': ')[1];
        return tokenValue;
    }
    async fetchResponse() {
        const element = await this.getResponse();
        const text = await element.getText();
        const response = text.split(': ')[1];
        return response;
    }
    async changeDashboardURL(url) {
        await this.waitForElementVisible(this.getInputUrl());
        await this.clear({ elem: this.getInputUrl() });
        await this.getInputUrl().setValue(url);
    }
}
