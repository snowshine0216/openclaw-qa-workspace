import BaseComponent from '../base/BaseComponent.js';
import MenuCreate from './MenuCreate.js';

/** The Left Toolbar is used in the home page to open different panel */
export default class LeftToolbar extends BaseComponent {
    constructor() {
        super(null, '#leftToolbar', 'The left toolbar on home page');
        this.menuCreate = new MenuCreate();
    }

    getRecentsButton() {
        return this.$('#mstrRecentObjects');
    }

    getHistoryListButton() {
        return this.$('.mstrMenuItemhistory');
    }

    getMyReportsButton() {
        return this.$('.mstrMenuItemprofile.mstrMenuItem');
    }

    getRecentsPopup() {
        return this.$('.mstrmojo-Popup.mstrShortcutsListPopup');
    }

    getListView() {
        return this.$('#tbListView');
    }

    getIconView() {
        return this.$('#tbLargeIcons');
    }

    getMySubscriptionButton() {
        return this.$('.mstrMenuItemsubscriptions .mstrLink');
    }

    getLaunchLibraryIcon() {
        return this.$('.mstrMenuItemNLinkTodossierLibrary');
    }

    /**
     * Open my subscription panel
     */
    async openSubscriptionPanel() {
        await this.click({ elem: this.getMySubscriptionButton() });
        await this.waitForCurtainDisappear();
    }

    async uploadMstrFile(path) {
        await this.menuCreate.uploadMstrFile(path);
    }

    /**
     * Click Recents in left tool bar to open recents panel
     */
    async openRecentsPanel() {
        await this.click({ elem: this.getRecentsButton() });
        await this.waitForElementVisible(this.getRecentsPopup());
    }

    async launchLibrary() {
        await this.click({ elem: this.getLaunchLibraryIcon() });
    }

    async openHistoryListPanel() {
        await this.click({ elem: this.getHistoryListButton() });
    }

    // Assertion Helper
    async isListViewPresent() {
        return this.getListView().isDisplayed();
    }

    async isIconViewPresent() {
        return this.getIconView().isDisplayed();
    }

    async isLaunchLibraryIconPresent() {
        return this.getLaunchLibraryIcon().isDisplayed();
    }

    async isCreatePresent() {
        return this.menuCreate.getElement().isDisplayed();
    }

    async isMyReportsButtonPresent() {
        return this.getMyReportsButton().isDisplayed();
    }

    async isMySubscriptionButtonPresent() {
        return this.getMySubscriptionButton().isDisplayed();
    }
}
