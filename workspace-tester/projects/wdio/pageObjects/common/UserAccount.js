import BasePage from '../base/BasePage.js';
import LoginPage from '../auth/LoginPage.js';
import HamburgerMenu from './HamburgerMenu.js';

export default class UserAccount extends BasePage {
    constructor() {
        super();
        this.loginPage = new LoginPage();
        this.hamburgerMenu = new HamburgerMenu();
    }

    // Element locator

    getUserAccount() {
        return this.$('.mstr-nav-icon[class*=icon-tb_profile_]');
    }

    getUserAccountNameElement() {
        return this.$('.mstrd-DropdownMenu-main').$('.mstrd-DropdownMenu-headerTitle');
    }

    getUserAccountName() {
        return this.$('.mstrd-DropdownMenu-main').$('.mstrd-DropdownMenu-headerTitle').getText();
    }

    getAccountDropdown() {
        return this.$('.mstrd-AccountDropdownMenuContainer .mstrd-DropdownMenu-main');
    }

    getAccountMenuOptions() {
        return this.getAccountDropdown().$$(
            '.mstrd-AccountDropdownMenuContainer-text, .mstrd-AccountDropdownMenuContainer-item'
        );
    }

    getAccountMenuOption(text) {
        return this.getAccountDropdown()
            .$$('.mstrd-AccountDropdownMenuContainer-text, .mstrd-AccountDropdownMenuContainer-item')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === text;
            })[0];
    }

    getAccountDivider() {
        return this.$('.mstr-nav-icon.icon-divider');
    }

    getLogoutButton() {
        return this.$('.mstrd-AccountDropdownMenuContainer-logout');
    }

    getAccountTitle() {
        return this.getAccountDropdown().$('.mstrd-DropdownMenu-headerTitle');
    }

    getCloseButton() {
        return this.getAccountDropdown().$('.mstrd-DropdownMenu-headerIcon.icon-pnl_close.visible');
    }

    getPreferenceSecondaryPanel() {
        return this.$('.mstrd-AccountDropdownMenuContainer-preferences-popover');
    }

    getPreferenceSections() {
        return this.getPreferenceSecondaryPanel().$$('.mstrd-UserPreferences-subtitles');
    }

    getCustomAppByName(name) {
        const xpathCommand = this.getCSSContainingText('mstrd-CustomApplicationPicker-itemContainerWrapper', name);
        return this.$('.mstrd-CustomApplicationPicker-container').$(`${xpathCommand}`);
    }

    getCustomAppByIndex(index) {
        return this.$$('.mstrd-CustomApplicationPicker-itemContainerWrapper')[index];
    }

    getCurrentSelectedCustomAppItem() {
        return this.$(
            '.mstrd-CustomApplicationPicker-itemContainer--current .mstrd-CustomApplicationPicker-configName'
        );
    }

    getWorkspaceByName(name) {
        const xpathCommand = this.getCSSContainingText('mstrd-WorkspacePicker-itemContainerWrapper', name);
        return this.$('.mstrd-WorkspacePicker-groupContainer').$(`${xpathCommand}`);
    }

    getWorkspaceByIndex(index) {
        return this.$$('.mstrd-WorkspacePicker-itemContainerWrapper')[index];
    }

    getCurrentSelectedWorkspaceItem() {
        return this.$('.mstrd-WorkspacePicker-itemContainer--current');
    }

    getPreferenceBtn() {
        return this.getAccountDropdown().$('.mstrd-AccountDropdownMenuContainer-preferences');
    }

    getPreferenceSpan() {
        return this.getPreferenceBtn().$('.mstrd-AccountDropdownMenuContainer-text');
    }

    getSwitchWorkspaceBtn() {
        return this.getAccountDropdown().$('.mstrd-AccountDropdownMenuContainer-switchWorkspace');
    }

    getSwitchWorkspaceSubPanel() {
        return this.$('.mstrd-AccountDropdownMenuContainer-SwitchWorkspace-SubPanel');
    }

    getSwitchApplicationBtn() {
        return this.getAccountDropdown().$('.mstrd-AccountDropdownMenuContainer-mylibraries');
    }

    getSwitchApplicationSubPanel() {
        return this.$('.mstrd-AccountDropdownMenuContainer-MyLibraries-SubPanel');
    }

    getAppMenuOption(name) {
        const xpathCommand = this.getCSSContainingText('mstrd-CustomApplicationPicker-configName', name);
        return this.getSwitchApplicationSubPanel().$(`${xpathCommand}`);
    }

    getCurrentApplication() {
        return this.$('div.mstrd-CustomApplicationPicker-itemContainer--current');
    }

    // Action helper
    async clickAccountButton() {
        await this.click({ elem: this.getUserAccount() });
    }

    async openUserAccountMenu(options = {}) {
        if (options.accessibility === true) {
            await this.getUserAccount().keys('Enter');
        } else {
            await this.click({ elem: this.getUserAccount() });
        }
        await this.waitForElementVisible(await this.getAccountDropdown());
    }

    async clickAccountOption(text, options = {}) {
        if (options.accessibility === true) {
            await this.tabToElement(this.getAccountMenuOption(text));
        } else {
            await this.click({ elem: this.getAccountMenuOption(text) });
        }
        await this.waitForElementStaleness(await this.getAccountDropdown(), {
            msg: 'User account menu was not closed.',
        });
        return this.sleep(500);
    }

    async openUserAccountMenuWithKeyboard() {
        await this.tabToElement(this.getUserAccount());
    }

    async switchCustomApp(name) {
        await this.waitForElementVisible(await this.getUserAccount());
        await this.openUserAccountMenu();
        await this.click({ elem: this.getAccountMenuOption('My Applications') });
        await this.getCustomAppByName(name).click();
    }

    async switchWorkspace(name) {
        await this.openUserAccountMenu();
        await this.openSwitchWorkspaceSubPanel();
        await this.click({ elem: this.getWorkspaceByName(name) });
    }

    async switchCustomAppByIndex(index) {
        await this.click({ elem: this.getCustomAppByIndex(index) });
    }

    async openMyApplicationPanel() {
        await this.click({ elem: this.getAccountMenuOption('My Applications') });
    }

    async openPreferencePanel() {
        await this.click({ elem: this.getAccountMenuOption('Preferences') });
        await this.waitForElementVisible(this.getPreferenceSecondaryPanel());
    }

    async clickAccountMenuOption(text) {
        const el = this.getAccountMenuOption(text);
        await this.click({ elem: el });
    }

    async closeUserAccountMenu() {
        await this.click({ elem: this.getCloseButton() });
        return this.waitForElementInvisible(this.getAccountDropdown());
    }

    async logout(options = {}) {
        const button = options.mobileView === true ? this.hamburgerMenu.getLogOutButton() : this.getLogoutButton();

        if (options.accessibility === true) {
            await this.tabToElement(button);
            await this.enter();
        } else {
            await this.clickAndNoWait({ elem: button });
        }
        if (options.SSO === true) {
            await this.sleep(5000);
        } else {
            const handles = await this.getBrowserTabs();
            if (handles.length > 1 && browsers.params.browser && browsers.params.browser.browserName == 'msedge') {
                await this.switchToTab(handles.length - 1);
            }
            return this.loginPage.waitForLoginView();
        }
    }

    // Asserion helper
    async getUserName() {
        return this.getAccountTitle().getText();
    }

    async canUserLogin() {
        return (await this.canUserLogout()) && (await this.getLogoutButton().getText()) === 'Log in';
    }

    async canUserLogout() {
        return this.getLogoutButton().isDisplayed();
    }

    async isPreferencePresent() {
        return this.getAccountMenuOption('Preferences').isDisplayed();
    }

    async isAccountOptionPresent(option) {
        return this.getAccountMenuOption(option).isDisplayed();
    }

    async getPreferenceText() {
        return this.getPreferenceSpan().getText();
    }

    async openSwitchWorkspaceSubPanel() {
        await this.click({ elem: this.getAccountMenuOption('Switch Workspace') });
        await this.waitForElementVisible(this.getSwitchWorkspaceSubPanel());
    }

    async openSwitchApplicationSubPanel() {
        await this.click({ elem: this.getAccountMenuOption('My Applications') });
        await this.waitForElementVisible(this.getSwitchApplicationSubPanel());
    }

    async clickApplication(appName) {
        await this.click({ elem: this.getAppMenuOption(appName) });
        await this.waitForLibraryLoading();
    }

    async getAccountMenuOptionsNames() {
        return this.getAccountMenuOptions().map(async (elem) => {
            const value = await elem.getText();
            return elem.getText();
        });
    }

    async getPreferenceSectionsNames() {
        return this.getPreferenceSections().map(async (elem) => {
            return elem.getText();
        });
    }

    async isApplicationSelected(name) {
        await this.openUserAccountMenu();
        await this.openSwitchApplicationSubPanel();
        const selectedApp = await this.$('.mstrd-CustomApplicationPicker-itemContainer--current')
            .$('.mstrd-CustomApplicationPicker-configName')
            .getText();
        console.log('selected app is ' + selectedApp);
        return (await selectedApp).includes(name);
    }

    async isAccountIconFocused() {
        const elem = this.getUserAccount();
        return (await elem.getAttribute('data-focus-visible-added')) === '';
    }

    async isAccountDropdownMenuPresent() {
        return this.getAccountDropdown().isDisplayed();
    }

    async isCloseButtonFocused() {
        const elem = this.getCloseButton();
        return (await elem.getAttribute('data-focus-visible-added')) === '';
    }

    async isLogoutFocused() {
        const elem = this.getLogoutButton();
        return (await elem.getAttribute('data-focus-visible-added')) === '';
    }
}
