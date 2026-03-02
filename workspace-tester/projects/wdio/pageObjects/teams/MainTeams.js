import AzureLoginPage from '../auth/AzureLoginPage.js';
import BasePage from '../base/BasePage.js';
import LoginPage from '../../pageObjects/auth/LoginPage.js';
import share from '../../pageObjects/dossier/Share.js';

export default class MainTeams extends BasePage {
    constructor() {
        super();
        this.azureLoginPage = new AzureLoginPage();
        this.loginPage = new LoginPage();
        this.share = new share();
    }
    get DEFAULT_QUERY_TIMEOUT() {
        return 30;
    }
    get TEAMS_DEFAULT_LOADING_TIMEOUT() {
        if (browsers.params.timeout && browsers.params.timeout.defaultLoadingTimeOut) {
            return browsers.params.timeout.defaultLoadingTimeOut;
        } else {
            return 120 * 1000;
        }
    }
    compareText(text1, text2, matchAll = false) {
        if (matchAll) {
            return text1 === text2;
        } else {
            if (!text1 && !text2) return true;
            return text1 && text1.includes(text2);
        }
    }
    //user account
    getTeamsUserAccount() {
        return this.$('button[data-tid="me-control-avatar-trigger"]');
    }
    getTeamsSignOutButton() {
        return this.$('#me-control-sign-out-button');
    }
    getAnotherTeamsUserAccount(userName) {
        return this.$(`//button[contains(@aria-label, 'Switch to account')]//span[contains(text(), '${userName}')]`);
    }
    getTeamsSignoutComfirmButton() {
        return this.$('button[data-tid="sign-out-confirm"]');
    }
    // Sidebar: Chat, Teams, Pinned app, View more, Apps
    getAppInSidebar(appName) {
        return this.$(`//button[contains(@aria-label, "${appName}")]`);
    }
    getAppInChat(appName) {
        return this.$(`//span[@aria-label="${appName}"]`);
    }
    getBadgeOnActivity() {
        return this.$('[aria-label="Activity"] .fui-Badge');
    }
    async getMessagePreviewInActivity() {
        const message = await this.$$(`(//*[contains(@id, 'activity-feed-item-message-preview')])`);
        const text = await message[0].getText();
        return text;
    }
    getPinAppButton() {
        return this.$$('div[role="menuitem"]').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === 'Pin';
        })[0];
    }
    // Team and channel list
    // Team, Channel, Chat
    getTeam(teamName) {
        return this.$(
            `//span[contains(@id, "title-team-list-item") and text()="${teamName}"]/ancestor::div[@data-testid="list-item-teams-and-channels"]`
        );
    }

    getConversation(conversationName) {
        return this.$(
            `//div[@data-tid='chat-list-layout' or @data-tid='channel-list-item' or @data-tid='channel-list-team-node' or contains(@data-testid, "list-item")]//span[text()="${conversationName}"]`
        );
    }
    getChannelList() {
        return this.$(`[data-shortcut-context='channel-list']`);
    }
    getChannelContent() {
        return this.$('[data-item-type="teams-and-channels"]');
    }
    // right click on conversation name: Manage apps, Delete
    getItemInCoversationMenu(item) {
        return this.$(`//div[@role="menuitem"]//span[(text()='${item}')]`);
    }
    getDeleteConversatoinButton() {
        return this.$('//span[text()="Delete"]');
    }
    // element in library
    getAddNewInTeamsLibrary() {
        return this.$('div.icon-pnl_add-new');
    }
    getItemRowListInContentDiscovery() {
        return this.$$('div[role="row"]');
    }
    getShowTheToolbarButton() {
        return this.$('div[aria-label="Show the toolbar"]');
    }
    getSpinner() {
        return this.$('div.mstrd-Spinner');
    }
    getDossierNotification() {
        return this.$('div.mstrd-DossierViewContainer-notifications');
    }
    getFirstDossierRowActionBar() {
        return this.$$('div.mstrd-DossierRowActionBar')[0];
    }
    getGlobalResultItem() {
        return this.$('a.mstrd-GlobalSearchResultListItem-link');
    }
    isAddNewInTeamsLibraryDisplayed() {
        return this.getAddNewInTeamsLibrary().isDisplayed();
    }
    getDossierViewContainer() {
        return this.$('.mstrd-DossierViewContainer');
    }
    getGridCellValue(index) {
        return this.$(`td[ei="${index}"]`).getText();
    }
    // different entry points of search app
    getInstalledAppListInMoreApps() {
        return this.$('div[aria-label="Installed apps section"]');
    }
    getPersonalApp() {
        return this.$('button[aria-label="Apps"]');
    }
    getTabApp() {
        return this.$('button[aria-label="Add a tab"]');
    }
    getViewMoreApps() {
        return this.$('button[aria-label="View more apps"]');
    }
    getPostApp() {
        return this.$('button[title="Actions and apps"]');
    }
    getSearchAppInPersonalApp() {
        return this.$('input[aria-label="Store Search"]');
    }
    getSearchAppInViewMoreApps() {
        return this.$('input[placeholder="Search for apps"]');
    }
    getSearchAppInAddAnApp() {
        return this.$('input[aria-label="Search for apps"]');
    }
    getSearchInAddActionApp() {
        return this.$('input[aria-label="Search for actions and apps"]');
    }
    getErrorMessageDuringPin() {
        return this.$(`//span[text()='Your link points to a tab that no longer exists']`);
    }
    getOKInErrorMessage() {
        return this.$(`//span[text()='OK']`);
    }
    //search field on the top
    getSearchBox() {
        return this.$('#ms-searchux-input');
    }
    getCreateNewChatButton() {
        return this.$(`button[data-testid="simple-collab-left-rail-header-new-message-button"]`);
    }
    getUserSearchBoxForNewChat() {
        return this.$('#people-picker-input');
    }
    getMessageInputBox() {
        return this.$('p');
    }
    async switchToTeamsWindow({ url, title, matchAll = false }) {
        for (let j = 0; j < this.DEFAULT_QUERY_TIMEOUT; j++) {
            try {
                const handles = await this.getBrowserTabs();
                for (let i = handles.length - 1; i >= 0; i--) {
                    let flag = true;
                    await this.switchToWindow(handles[i]);
                    if (url) {
                        const currentUrl = await browser.getUrl();
                        flag = flag && this.compareText(currentUrl, url, matchAll);
                    }
                    if (title) {
                        const currentTitle = await browser.getTitle();
                        flag = flag && this.compareText(currentTitle, title, false);
                    }
                    if (flag) {
                        console.log(
                            `Switch to active teams window:,`,
                            await browser.getTitle(),
                            `url=`,
                            await browser.getUrl()
                        );
                        return;
                    }
                }
            } catch (err) {
                console.log(`${err}`);
                console.log(`Keep running... `);
            }
            await this.sleep(1000);
            console.log(`#${j} Try to switch to teams window`);
        }
    }
    // login
    async getLibraryURLInBrowser() {
        return await browser.execute(() => document.URL);
    }
    async getLibraryURLInBrowserIframe() {
        await this.switchToLibraryIframe();
        return await browser.execute(() => document.URL);
    }
    async logoutUserFromAzure(email) {
        const user = this.$(`//*[@data-test-id="${email.toLowerCase()}"]`);
        await this.waitForElementVisible(user);
        await this.click({ elem: user });
    }
    async login() {
        const loginButton = this.$('.mstrd-LoginPage').$('button');
        await this.click({ elem: loginButton });
    }
    async signOutFromTeams(email) {
        await this.click({ elem: this.getTeamsUserAccount() });
        await this.click({ elem: this.getTeamsSignOutButton() });
        await browser.pause(1000);
        await this.click({ elem: this.getTeamsSignoutComfirmButton() });
        await browser.pause(5000);
    }
    async waitForTeamsView() {
        console.log('Waiting for Teams View...');
        try {
            await this.waitForElementVisible(await this.getChannelList(), {
                timeout: this.TEAMS_DEFAULT_LOADING_TIMEOUT,
            });
            await this.waitForElementVisible(await this.getChannelContent(), {
                timeout: this.TEAMS_DEFAULT_LOADING_TIMEOUT,
            });
        } catch (e) {
            console.log('Error: ' + e);
            const url = await browser.getUrl();
            console.log('Current url: ' + url);
        }
    }
    async waitForChatView() {
        console.log('Waiting for Chat View...');
        try {
            await this.waitForElementVisible(await this.getCreateNewChatButton(), {
                timeout: this.TEAMS_DEFAULT_LOADING_TIMEOUT,
            });
        } catch (e) {
            console.log('Error: ' + e);
            const url = await browser.getUrl();
            console.log('Current url: ' + url);
        }
    }
    // iframe
    async switchToEmbeddedDossierIframe(waitTime = 1000) {
        await browser.pause(waitTime);
        const iframe = this.$('iframe');
        await this.waitForElementVisible(iframe, { timeout: this.DEFAULT_LOADING_TIMEOUT });
        await browser.switchToFrame(await iframe);
        console.log('Switched to Embedded Dossier Iframe');
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
    async switchToModalIframe() {
        const iframeElement = await this.$(`iframe[title="tab-configurable-content"]`);
        await this.waitForElementExsiting(iframeElement, { timeout: this.DEFAULT_LOADING_TIMEOUT });
        await browser.switchToFrame(iframeElement);
        console.log('Switched to modal iframe');
    }
    async waitForLibraryLoadingInFrame() {
        await this.switchToLibraryIframe();
        await this.waitForLibraryLoading();
    }
    async getLandingPage() {
        return this.$('.mstrd-LoginPage');
    }
    async getErrorPage() {
        return this.$('.mstrd-ErrorPage');
    }
    async waitForLandingPage() {
        await this.switchToLibraryIframe();
        await this.waitForElementVisible(await this.getLandingPage());
    }
    async waitForNoPrivilegePage() {
        await this.switchToLibraryIframe();
        await this.waitForElementVisible(await this.getErrorPage());
    }
    // Chat, Teams, app, View More, Apps
    async switchToAppInSidebar(appName) {
        await browser.switchToFrame(null);
        const ele = await this.getAppInSidebar(appName);
        await this.waitForElementClickable(ele, { timeout: this.TEAMS_DEFAULT_LOADING_TIMEOUT });
        await this.click({ elem: ele });
    }
    async isTeamsAppSelected(appName) {
        const status = await this.$(`button[aria-label=${appName}]`).getAttribute('aria-pressed');
        return status;
    }
    async switchToChat(username) {
        await browser.switchToFrame(null);
        await this.switchToAppInSidebar('Chat');
        await this.getConversation(username).click();
    }
    async switchToChannel(channelName) {
        await browser.switchToFrame(null);
        await this.click({ elem: this.getConversation(channelName) });
        await browser.pause(2000);
    }
    async switchToTeamsChannel({ team: teamName, channel: channelName }) {
        await browser.switchToFrame(null);
        await this.switchToAppInSidebar('Teams');
        await this.waitForTeamsView();
        // get Team
        const teamEle = await this.getTeam(teamName);
        // click to expand the Team if it's not
        if (!(await teamEle.getAttribute('aria-expanded'))) {
            await teamEle.click();
        }
        const channelEle = await this.getConversation(channelName);
        // click when channel is already selected will trigger context menu
        if (!((await channelEle.getAttribute('aria-selected')) === 'true')) {
            await this.click({ elem: channelEle });
        }
    }
    async pinAppInSidebar(appName) {
        await this.rightClick({ elem: this.getAppInSidebar(appName) });
        if (await this.getPinAppButton().isDisplayed()) {
            await this.click({ elem: this.getPinAppButton() });
        }
    }
    async pinAppInChat(appName) {
        await this.switchToAppInSidebar('View more apps');
        await this.rightClick({ elem: this.getAppInSidebar(appName) });
        if (await this.getPinAppButton().isDisplayed()) {
            await this.click({ elem: this.getPinAppButton() });
        }
        if (await this.getAppInSidebar(appName).isDisplayed()) {
            await this.click({ elem: this.getAppInSidebar(appName) });
        }
    }
    // wait until there is only 1 browser tab
    async waitForPopupWindowDisappear() {
        for (let i = 0; i < this.DEFAULT_QUERY_TIMEOUT; i++) {
            const handles = await this.getBrowserTabs();
            if (handles.length === 1) {
                return;
            }
            await this.sleep(1000);
            console.log(`#${i} Try to wait for pop up window disappear`);
        }
    }
    async isPopUpLoginPageExisting(windowLength, timeout = 5000) {
        await this.sleep(timeout);
        const currentWindows = await this.getBrowserTabs();
        return currentWindows.length > windowLength;
    }
    async openAppCatalog(scope = 'personal') {
        await browser.switchToFrame(null);
        var ele;
        switch (scope) {
            case 'personal':
                ele = await this.getPersonalApp();
                break;
            case 'tab':
                ele = await this.getTabApp();
                break;
            case 'viewMoreApps':
                ele = await this.getViewMoreApps();
                break;
            case 'post':
                ele = await this.getPostApp();
                break;
            default:
                console.log(`Unknown scope ${scope} to find app catalog button`);
                break;
        }
        await this.waitForElementClickable(ele, { timeout: this.TEAMS_DEFAULT_LOADING_TIMEOUT });
        await ele.click();
    }

    async searchForApp(appName, scope = 'personal') {
        var ele;
        switch (scope) {
            case 'personal':
                ele = await this.getSearchAppInPersonalApp();
                break;
            case 'viewMoreApps':
                ele = await this.getSearchAppInViewMoreApps();
                break;
            case 'addAnApp':
                ele = await this.getSearchAppInAddAnApp();
                break;
            case 'addActionAndApps':
                ele = await this.getSearchInAddActionApp();
                break;
            default:
                console.log(`Unknown scope ${scope} to find search bar`);
                break;
        }
        await this.waitForElementVisible(ele, { timeout: this.TEAMS_DEFAULT_LOADING_TIMEOUT });
        await ele.setValue(appName);
        await this.sleep(500);
    }

    // wait for loading
    // click open in teams, wait for object loading
    async waitForObjectLoading(elemName = 'share') {
        const elem = await this.share.getShareIcon();
        await this.waitForLibraryIframeLoading({ elem, elemName });
    }

    async waitForLibraryIframeLoading({ elem, elemName }) {
        await this.switchToLibraryIframe();
        for (let i = 0; i < 10; i++) {
            let frame = await this.$('iframe').isDisplayed();
            let status = await elem.isDisplayed();
            console.log(i + ' try');
            if (!status) {
                if (frame) {
                    console.log('fail to switch to library iframe!');
                    await this.switchToLibraryIframe();
                } else {
                    console.log(elemName + ' icon not appear');
                    await this.sleep(3000);
                }
            } else {
                break;
            }
        }
        console.log(elemName + ' icon has appeared!');
    }

    // create new chat
    async searchUserAndOpenChat(user) {
        await this.getSearchBox().addValue(user);
        await this.enter();
        await this.click({ elem: this.$(`div[data-tid="search-people-card"]`) });
    }

    async getSearchedUser(user) {
        await this.waitForElementVisible(this.$('.ui-dropdown__item'));
        return this.$$('.ui-dropdown__item').filter(async (elem) => {
            const elemText = await elem.$('.ui-dropdown__item__header').getText();
            return elemText.includes(user);
        })[0];
    }

    async createNewChat({ user1, user2 }) {
        await this.click({ elem: this.getCreateNewChatButton() });
        await this.getUserSearchBoxForNewChat().addValue(user1);
        await this.sleep(1000);
        await this.click({ elem: this.getUserSearchBoxForNewChat() });
        await this.click({ elem: await this.getSearchedUser(user1) });
        await this.getUserSearchBoxForNewChat().addValue(user2);
        await this.click({ elem: await this.getSearchedUser(user2) });
        await this.click({ elem: this.getMessageInputBox() });
    }

    async dismissErrorMessageDuringPin() {
        await this.click({ elem: this.getOKInErrorMessage() });
    }

    async showAppAnyway() {
        const showAppElement = await this.$('//button[contains(text(), "Show the app anyway")]');
        if (await showAppElement.isDisplayed()) {
            await this.click({ elem: showAppElement });
        }
    }
}
