import BasePage from '../base/BasePage.js';

export default class InsightsPage extends BasePage {
    getLoadingIcon() {
        return this.$('.mstrd-LoadingIcon-loader');
    }

    //Action helper
    async openInsightsPage() {
        const url = new URL('app/insights', browser.options.baseUrl);
        await browser.url(url.toString());
        return this.waitForElementInvisible(this.getLoadingIcon());
    }
}
