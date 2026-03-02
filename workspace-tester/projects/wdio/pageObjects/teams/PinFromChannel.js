import BasePage from '../base/BasePage.js';

export default class PinFromChannel extends BasePage {
    constructor() {
        super();
    }

    getAddTabButton() {
        return this.$('#addTabButton');
    }

    getSearchAppInAddAnApp() {
        return this.$('input[aria-label="Search for apps"]');
    }

    getSearchedAppInChatTab() {
        return this.$('ul[data-tid="in-context-grid"]');
    }

    isSearchedAppListInChatTabExist() {
        return this.getSearchedAppInChatTab().isDisplayed();
    }

    getInstalledAppListInAddTab() {
        return this.$('ul[data-tid="in-context-grid"]');
    }

    getCloseInAddApps() {
        return this.$('button[data-tid="in-context-store-close-btn"]');
    }

    async seeAllApps() {
        await this.click({ elem: this.$('button[title="See all"]') });
    }

    async pinNewDossierFromChannel(appName) {
        await this.click({ elem: this.getAddTabButton() });
        await browser.switchToFrame(null);
        await this.seeAllApps();
        let ele;
        ele = await this.$(`//button[@role="menuitem"]//span[text()='${appName}']`);
        if (await ele.isDisplayed()) {
            await this.click({ elem: ele });
            await this.waitForElementInvisible(ele);
        } else {
            console.log('app is not installed');
            await this.getSearchAppInAddAnApp().addValue(appName);
            ele = await this.$(`//button[@data-inp="store-item"]//span[text()='${appName}']`);
            await this.click({ elem: ele });
            await this.click({ elem: this.$('#install-app-btn') });
            await this.waitForElementInvisible(this.$('#install-app-btn'));
        }
    }
}
