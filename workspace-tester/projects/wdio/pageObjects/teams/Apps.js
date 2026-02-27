import BasePage from '../base/BasePage.js';
import MainTeams from './MainTeams.js';

export default class Apps extends BasePage {
    constructor() {
        super();
        this.mainTeams = new MainTeams();
    }

    getSearchBox() {
        return this.$('input[aria-label="Store Search"]');
    }

    getAppsUnderAppCatalog() {
        return this.$$(`//div[contains(@data-testid, 'store-item')]`);
    }

    getFirstAppInPerosnalAppCatalog() {
        return this.getAppsUnderAppCatalog()[0];
    }

    getInstallAppButton() {
        return this.$("button[data-tid='install-app-btn']");
    }

    getOpenAppButton() {
        return this.$("//button[@data-testid='open-app']");
    }

    // add library to conversation
    getMoreOptionsButton() {
        return this.$('button[aria-roledescription="moreoptions"]');
    }

    // "Add to a team", "Add to a chat", "Add to a meeting"
    getOptions(coversation) {
        return this.$(`a[arialabel="${coversation}"]`);
    }

    getSearchBoxInSelectConversation() {
        return this.$('//input[contains(@data-testid, "search-input")]');
    }

    getConversationItem(conversationName) {
        return this.$(`//div[contains(@class, "fui-Flex") and text()="${conversationName}"]`);
    }

    getGoToConversationItem() {
        return this.$(`//button[@data-testid="go"]`);
    }

    getConversationInDropdownList(conversationName) {
        return this.$$('.ui-dropdown__item__content').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === conversationName;
        })[0];
    }

    getSetUpABotButton() {
        return this.$('//span[text()="Set up a bot"]');
    }

    getMoreOptionsNextToSetup() {
        return this.$$('.ui-splitbutton__toggleButton')[1];
    }

    getLoadingIndicator() {
        return this.$(`div[role='progressbar'].fui-Spinner`);
    }

    isAddNewInTeamsLibraryDisplayed() {
        return this.mainTeams.getAddNewInTeamsLibrary().isDisplayed();
    }

    async openTeamsApp(appName) {
        const isAppPinned = await this.mainTeams.getAppInSidebar(appName).isDisplayed();
        if (!isAppPinned) {
            await this.openAppFromApps(appName);
            await this.click({ elem: this.getInstallAppButton() });
            await this.click({ elem: this.getOpenAppButton() });
            await this.mainTeams.pinAppInChat(appName);
        } else {
            await this.mainTeams.switchToAppInSidebar(appName);
        }
    }

    async openAppFromApps(appName) {
        await this.mainTeams.switchToAppInSidebar('Apps');
        await this.getSearchBox().addValue(appName);
        await this.waitForElementInvisible(this.getLoadingIndicator());
        await this.waitForElementVisible(this.getFirstAppInPerosnalAppCatalog());
        await this.click({ elem: this.getFirstAppInPerosnalAppCatalog() });
    }

    async addBotToAConversation({ conversationName, appName = 'Library' }) {
        await this.openAppFromApps(appName);
        await this.click({ elem: this.getInstallAppButton() });
        await this.getSearchBoxInSelectConversation().addValue(conversationName);
        await this.sleep(1000);
        await this.click({ elem: this.getConversationItem(conversationName) });
        await this.click({ elem: this.getGoToConversationItem() });
    }
}
