import MainTeams from './MainTeams.js';
import { isMac } from '../../utils/platform-util.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class TeamsDesktop extends MainTeams {
    constructor() {
        super();
    }
    async switchToActiveWindow(url, title) {
        // Use default values if not provided
        const defaultUrl = isMac() ? 'https://teams.microsoft.com/v2/' : 'https://teams.microsoft.com/v2/?ring=ring3_6';
        const targetUrl = url || defaultUrl;
        await this.switchToTeamsWindow({ url: targetUrl, title, matchAll: true });
    }
    async closeNewPopupWindow() {
        const handles = await this.getBrowserTabs();
        await this.closeTab(handles.length - 1);
    }
    async checkCurrentTeamsUser(userEmail) {
        const currentTitle = (await browser.getTitle()).toLowerCase();
        return this.compareText(currentTitle, userEmail.toLowerCase());
    }
    async switchToTeamsUser(userName, url, title) {
        await this.click({ elem: this.getTeamsUserAccount() });
        await scrollIntoView(this.getAnotherTeamsUserAccount(userName));
        await this.click({ elem: this.getAnotherTeamsUserAccount(userName) });
        await this.sleep(1000);
        await this.switchToActiveWindow(url, title);
    }

    async switchToTeamsUserIfNeeded(userName, url, title) {
        const isCurrentUser = await this.checkCurrentTeamsUser(userName);
        if (!isCurrentUser) {
            await this.switchToTeamsUser(userName, url, title);
        }
    }
    async loginStandardUser(standard_credentials) {
        var windowNumber = (await this.getBrowserTabs()).length;
        await this.login();
        if (await this.isPopUpLoginPageExisting(windowNumber)) {
            await this.switchToNewWindow();
            await this.loginPage.standardLogin(standard_credentials);
            await this.switchToActiveWindow( );
            await this.switchToLibraryIframe();
        }
        await this.waitForLibraryLoading();
    }
}
