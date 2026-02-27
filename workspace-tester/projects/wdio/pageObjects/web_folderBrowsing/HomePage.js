import WebBasePage from '../base/WebBasePage.js';
import PrimarySearch from '../web_home/PrimarySearch.js';
import MenuCreate from '../web_home/MenuCreate.js';
import { buildEventUrl } from '../../utils/index.js';
import LeftToolbar from '../web_home/LeftToolbar.js';
import Alert from '../common/Alert.js';
import HistoryList from '../web_home/HistoryListPanel.js';

export default class HomePage extends WebBasePage {
    constructor() {
        super();
        this.primarySearch = new PrimarySearch();
        this.menuCreate = new MenuCreate();
        this.leftToolbar = new LeftToolbar();
        this.historyList = new HistoryList();
    }

    // element locator
    getAccountMenu() {
        return this.$('#mstrPathAccount');
    }

    getAccountMenuList() {
        return this.$('#mstrAccountSCList.open');
    }

    getPreferenceItem() {
        return this.getAccountMenuList().$('.item.preferences');
    }

    getFeedbackItem() {
        return this.getAccountMenuList().$('.item.feedback');
    }

    getHomeButton() {
        return this.$('#tbHome');
    }

    getFolderUpButton() {
        return this.$('#tbReturn');
    }

    getFooterPath() {
        return this.$('.mstrFooter');
    }

    getPathContainer() {
        return this.$('.mstrPathContainer');
    }

    getHeader() {
        return this.$('.mstrPath');
    }

    getSearchButtonInHomePage() {
        return this.$('.mstrmojo-Button.mstrmojo-SearchButton');
    }

    getSearchEditor() {
        return this.$('.mstrmojo-Search-editor');
    }

    getSearchField() {
        return this.getSearchEditor().$('.searchPattern');
    }

    getSearchButton() {
        return this.getSearchEditor().$('.mstrmojo-Search-btnSearch');
    }

    getListViewItem(name) {
        return this.$$('.mstrLink').filter(async (elem) => {
            const elemName = await elem.getText();
            return elemName === name;
        })[0];
    }

    getMenuItem(name) {
        return this.$$('.menu-item').filter(async (elem) => {
            const elemName = await elem.getText();
            return elemName.includes(name);
        })[0];
    }

    // action helper

    open() {
        return browser.url(buildEventUrl(3010));
    }

    openWithValidateRandNum(validateRandNum) {
        return browser.url(buildEventUrl(3010) + '&validateRandNum=' + validateRandNum);
    }

    async clickSearchButtonInHomePage() {
        await this.sleep(2000);
        await this.waitForWebCurtainDisappear();
        await this.click({ elem: this.getSearchButtonInHomePage() });
    }

    async waitForSearchResults() {
        await this.sleep(2000); // Wait for animation to complete
        await this.waitForElementInvisible(this.getSearchSpinner());
        // TODO Find a way to remove the sleep here
        await this.sleep(1000);
    }

    async search(keyword) {
        await this.getSearchField().click();
        await this.clear({ elem: this.getSearchField() });
        await this.getSearchField().setValue(keyword);
        await this.sleep(1000); // Wait for animation to complete
        await this.click({ elem: this.getSearchButton() });
        await this.waitForSearchResults();
    }

    async openAccountMenu() {
        await this.click({ elem: this.getAccountMenu() });
        await this.waitForElementVisible(this.getAccountMenuList());
    }

    async hoverOnAccountMenu() {
        await browser.actions().mouseMove(this.getAccountMenu()).perform();
        await this.waitForElementVisible(this.getAccountMenuList());
    }

    async openPreferencesPage() {
        await this.openAccountMenu();
        await this.click({ elem: this.getPreferenceItem() });
    }

    async clickPreferencesPage() {
        await this.click({ elem: this.getPreferenceItem() });
    }

    async openHelpPage() {
        await this.click({ elem: this.getAccountMenuList().$('.item.help') });
    }

    async deleteUploadDossier(name) {
        const item = await this.getListViewItem(name);
        await this.rightClick({ elem: item });
        await this.click({ elem: this.getMenuItem('Delete') });
        await this.click({ elem: this.$('.mstrDialogButtonBar input[name="ok"]') });
    }

    async openDossierInListView(name) {
        const item = await this.getListViewItem(name);
        await this.click({ elem: item });
        await this.sleep(2000);
        await this.waitForCurtainDisappear();
    }

    // assertion helper
    async isPreferenceItemExist() {
        await this.waitForElementVisible(this.getAccountMenu());
        return this.getPreferenceItem().isDisplayed();
    }

    async isFooterPathExist() {
        return this.getFooterPath().isDisplayed();
    }

    async isAccountMenuListOpen() {
        return this.getAccountMenuList().isDisplayed();
    }

    async isFeedbackItemExist() {
        return this.getFeedbackItem().isDisplayed();
    }

    async isHomeButtonExist() {
        return this.getHomeButton().isDisplayed();
    }

    async isFolderUpButtonExist() {
        return this.getFolderUpButton().isDisplayed();
    }

    async loadDefaultLayout() {
        await this.openAccountMenu();
        await this.click({ elem: this.getAccountMenuList().$('.item.load') });
        // add sleep here to wait cards loaded
        await this.sleep(1000);
    }

    async publishLayout() {
        await this.openAccountMenu();
        await this.click({ elem: this.getAccountMenuList().$('.item.save') });
        const alert = new Alert();
        await alert.clickOnButtonByNameNoWait('OK');
    }
}
