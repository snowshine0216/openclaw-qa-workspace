import BasePage from '../base/BasePage.js';
import { scrollIntoView } from '../../utils/scroll.js';

export default class Bookmark extends BasePage {
    // Element locator

    getBookmarkIcon() {
        return this.$('.mstr-nav-icon.icon-tb_bookmarks_n:not([disabled])');
    }

    getNewBookmarkReminder() {
        return this.$('.mstrd-Badge--show');
    }

    getPanel() {
        return this.$('.mstrd-DropdownMenu-main');
    }

    getBookmarkTitle() {
        return this.getPanel().$('.mstrd-DropdownMenu-headerTitle');
    }

    getBookmarkList() {
        return this.getPanel().$('.mstrd-BookmarkDropdownMenuContainer-myBookmarks');
    }

    getBookmarksContainer() {
        return this.getPanel().$('.mstrd-BookmarkDropdownMenuContainer-panel');
    }

    getCloseButton() {
        return this.getPanel().$('.mstrd-DropdownMenu-headerIcon.icon-pnl_close.visible');
    }

    getSnapshotIcon() {
        return this.getPanel().$('.icon-mstrd_snapshots');
    }

    //TODO: check usage
    getNoBookmarks() {
        return this.$('.mstrd-DropdownMenu-content').$('.mstrd-BookmarkDropdownMenuContainer-noBookmarks');
    }

    getLoadingSpinner() {
        return this.getPanel().$('.mstrd-Spinner');
    }

    getAddFirstBookmark() {
        return this.getPanel().$('.mstrd-BookmarkDropdownMenuContainer-addBtn');
    }

    getAddNewError() {
        return this.getPanel().$('.mstrd-BookmarkDropdownMenuContainer-error');
    }

    getAddNewBookmark() {
        return this.getPanel().$('.mstrd-BookmarkDropdownMenuContainer-bMsHeaderIcon.icon-pnl_add-new:not([disabled])');
    }

    getCancelButton() {
        return this.getPanel().$('.mstrd-Button.mstrd-Button--clear.mstrd-BookmarkInputBox-cancelBtn');
    }

    getBookmarkSection(sectionName) {
        if (sectionName === 'MY BOOKMARKS') {
            return this.$('.mstrd-BookmarkDropdownMenuContainer-myBookmarks');
        } else {
            return this.$('.mstrd-BookmarkDropdownMenuContainer-sharedBookmarks');
        }
    }

    getBookmark(name, sectionName = 'MY BOOKMARKS') {
        return this.getBookmarkSection(sectionName)
            .$$('.mstrd-BookmarkItem')
            .filter(async (elem) => {
                return elem
                    .$('.mstrd-BookmarkItem-nameText')
                    .getText()
                    .then((elemName) => elemName === name);
            })[0];
    }

    getBookmarkText(name, sectionName = 'MY BOOKMARKS') {
        return this.getBookmark(name, sectionName).$('.mstrd-BookmarkItem-nameText');
    }

    getEditByName(name) {
        return this.getBookmark(name).$('.icon-pnl_edit');
    }

    getDeleteByName(name, sectionName) {
        return this.getBookmark(name, sectionName).$('.icon-pnl_delete');
    }

    getUpdateByName(name, sectionName = 'MY BOOKMARKS') {
        return this.getBookmark(name, sectionName).$('.mstrd-BookmarkItem-saveIcon--current');
    }

    getShareByName(name, sectionName) {
        return this.getBookmark(name, sectionName).$('.icon-pnl_sharebookmark');
    }

    getSaveChangesDialog() {
        return this.$('.mstrd-SaveChangesDialog-inner');
    }

    getCancelOnSaveDialog() {
        return this.getSaveChangesDialog().$('.mstrd-SaveChangesDialog-cancelBtn');
    }

    getContinueOnSaveDialog() {
        return this.getSaveChangesDialog().$('.mstrd-SaveChangesDialog-continueBtn');
    }

    getSaveChangesCheckbox() {
        return this.getSaveChangesDialog().$('.mstrd-AntdCheckbox');
    }

    async getLabelInTitle() {
        // Try to find the element with active class first, if not found, fall back to just bookmark class
        const activeElement = this.$('.mstrd-NavBarTitle-item-active');
        if (await activeElement.isDisplayedInViewport()) {
            return activeElement.$('.mstrd-NavBarTitle-bookmark');
        }
        return this.$('.mstrd-NavBarTitle-bookmark');
    }

    getBookmarkIconDisabled() {
        return this.$('.mstrd-NavItemWrapper.mstrd-BookmarkNavItem.mstr-navbar-item[disabled]');
    }

    getAddNewButtonDisabled() {
        return this.$('.mstrd-BookmarkDropdownMenuContainer-bMsHeaderIcon.icon-pnl_add-new[disabled]');
    }

    getErrorInputDialog() {
        return this.getPanel().$('.mstrd-BookmarkDropdownMenuContainer-error,.mstrd-BookmarkItem-time--error');
    }

    getEditButton() {
        return this.getPanel().$('.mstrd-DropdownMenu-headerIcon.icon-pnl_edit:not([disabled])');
    }

    getDoneButton() {
        // return this.getPanel().element(by.cssContainingText('.mstrd-DropdownMenu-headerIcon.mstrd-DropdownMenu-headerIcon--btn', 'Done'));
        return this.getPanel().$('.mstrd-Button--primary*=Done');
    }

    getSelectAllButton() {
        return this.$(
            '.mstrd-BookmarkDropdownMenuContainer-bulkDelContainer .mstrd-Button.mstrd-Button--clear.mstrd-Button--primary'
        );
    }

    getDeleteButton() {
        return this.$(
            '.mstrd-Button.mstrd-Button--clear.mstrd-Button--primary.mstrd-BookmarkDropdownMenuContainer-bulkDelBtn'
        );
    }

    getDeleteConfirmDialog() {
        return this.getPanel().$('.mstrd-ConfirmDialog');
    }

    getDeleteConfirmMsg() {
        return this.getDeleteConfirmDialog().$('.mstrd-ConfirmDialog-msg').getText();
    }

    getConfirmDeleteButton() {
        // return this.getDeleteConfirmDialog().element(by.cssContainingText('.mstrd-ConfirmDialog-buttonPanel .mstrd-Button', 'Delete'));
        return this.getDeleteConfirmDialog().$('.mstrd-Button*=Delete');
    }

    getCancleDeleteButton() {
        return this.getDeleteConfirmDialog().$('.mstrd-Button*=Cancel');
    }

    getNotification() {
        return this.$('.ant-popover-inner-content ');
    }

    getDonotShowCheckBox() {
        return this.getNotification().$('.mstrd-SimpleCheckbox');
    }
    getGotButton() {
        return this.getNotification().$('.mstrd-BookmarkNotification-gotBtn');
    }

    getNotificationError() {
        return this.getNotification().$('.mstrd-BookmarkNotification-errCase');
    }

    getCapsureIcon(name) {
        return this.getBookmark(name, 'SHARED WITH ME').$('.mstrd-CapsuleIcon-text');
    }

    getSendIcon(name) {
        return this.getBookmark(name, 'MY BOOKMARKS').$('.icon-pnl_shared.mstr-menu-icon');
    }

    async getBookmarkListHeight() {
        const eleSize = await this.getBookmarkList().getSize();
        return eleSize.height;
    }

    async getBookmarkContainerHeight() {
        const eleSize = await this.getBookmarksContainer().getSize();
        return eleSize.height;
    }

    async getNoPrivillegeTooltip() {
        return this.$('.ant-tooltip.mstrd-Tooltip .ant-tooltip-inner').getText();
    }

    getBookmarkTimeStamp() {
        return this.$$('.mstrd-BookmarkItem-information');
    }
    getSaveButton() {
        return this.getPanel().$('.mstrd-Button.mstrd-Button--clear.mstrd-BookmarkInputBox-okBtn');
    }

    getBookmarkNotification() {
        return this.getPanel().$('.mstrd-BookmarkDropdownMenuContainer-notifications');
    }

    getBookmarkSpinner() {
        return this.$('.mstrd-BookmarkDropdownMenuContainer-addNewSection .mstrd-Spinner');
    }

    // Action method

    async openPanel() {
        await this.click({ elem: this.getBookmarkIcon() });
        await this.waitForElementVisible(this.getPanel(), {
            timeout: 3000,
            msg: 'Bookmark panel was not opened after 3 times click',
        }).catch((error) => {
            console.log('Bookmark panel was not opened, will trigger re-execute!!');
            console.log(error);
        });
        // add 3 times to open bookmark panel
        let isPanelOpen = await this.getPanel().isDisplayed();
        for (let i = 0; i < 3; i++) {
            if (isPanelOpen) break;
            console.log('Bookmark panel is not opened after click' + (i + 1) + 'times');
            await this.click({ elem: this.getBookmarkIcon() });
            await this.sleep(500);
            isPanelOpen = await this.getPanel().isDisplayed();
        }
        await this.waitForElementVisible(this.getPanel(), { msg: 'Bookmark panel was not opened after 3 times click' });
        return this.waitForDynamicElementLoading();
    }

    async cancelInputName() {
        await this.click({ elem: this.getCancelButton() });
        return this.waitForElementVisible(this.getAddNewBookmark());
    }

    async closePanel() {
        await this.click({ elem: this.getCloseButton() });
        return this.waitForElementInvisible(this.getPanel());
    }

    getBookmarkInputBox() {
        return this.getPanel().$('.mstrd-BookmarkInputBox-input.mstrd-BookmarkInputBox-input--theme-light');
    }

    async addNewBookmark(name) {
        const bookmarkCount = await this.bookmarkTotalCount();
        if (bookmarkCount === 0) {
            await this.click({ elem: this.getAddFirstBookmark() });
        } else {
            await this.click({ elem: this.getAddNewBookmark() });
        }
        if (this.isSafari()) {
            // sending keys with bowser action is not supported on safari, sending keys to area directly instead
            const inputArea = this.getBookmarkInputBox();
            await inputArea.setValue(name);
            await this.enter();
        } else {
            await this.input(name);
            await this.enter();
        }

        //check inline error
        const isAddNewError = await this.getAddNewError().isDisplayed();

        if (!isAddNewError) {
            await this.waitForElementVisible(this.getAddNewBookmark());
            await this.waitForElementVisible(await this.getLabelInTitle());
        }
        await this.dismissTooltip();
        return this.sleep(2000);
    }

    async hoverOnBookmark(name, sectionName = 'MY BOOKMARKS') {
        return this.hover({ elem: this.getBookmark(name, sectionName) });
    }

    async deleteBookmark(name, sectionName = 'MY BOOKMARKS') {
        await this.hover({ elem: this.getBookmarkText(name, sectionName) });
        await this.click({ elem: this.getDeleteByName(name, sectionName) });
        await this.confirmDelete();
        await this.waitForElementInvisible(this.getBookmark(name, sectionName));
    }

    async deleteBookmarkWithoutConfirm(name, sectionName = 'MY BOOKMARKS') {
        await this.hover({ elem: this.getBookmark(name, sectionName) });
        await this.click({ elem: this.getDeleteByName(name, sectionName) });
    }

    async renameBookmark(name, newName) {
        await this.hover({ elem: this.getBookmark(name) });
        await this.click({ elem: this.getEditByName(name) });
        await this.input(newName);
        await this.enter();
        await this.waitForBookmarkLoading();
        return this.sleep(500);
    }

    async applyBookmark(name, sectionName = 'MY BOOKMARKS', option = { isWait: true }) {
        await this.click({ elem: this.getBookmarkText(name, sectionName) });
        if (option.isWait) {
            await this.waitForItemLoading();
        }
    }

    async updateBookmark(name) {
        await this.hover({ elem: this.getBookmark(name) });
        await this.click({ elem: this.getUpdateByName(name) });
        await this.waitForBookmarkLoading();
        return this.sleep(500);
    }

    async shareBookmark(name, sectionName) {
        if ((browsers.params.browser && browsers.params.browser.browserName == 'Edge') || this.isSafari()) {
            await scrollIntoView(this.getBookmark(name, sectionName));
        }
        await this.hover({ elem: this.getBookmark(name, sectionName) });
        await this.click({ elem: this.getShareByName(name, sectionName) });
    }

    async ignoreSaveReminder() {
        await this.click({ elem: this.getContinueOnSaveDialog() });
        return this.sleep(500);
    }

    async keepSaveReminder() {
        await this.click({ elem: this.getCancelOnSaveDialog() });
        return this.sleep(500);
    }

    async createBookmarksByDefault(number) {
        let i = 1;
        while (i <= number) {
            i++;
            await this.click({ elem: this.getAddNewBookmark() });
            await this.input('');
            await this.enter();
            await this.waitForElementVisible(this.getAddNewBookmark());
        }
        return this.sleep(500);
    }

    async deleteBookmarksByDefault(number) {
        let i = 1;
        let BM = 'Bookmark ';
        while (i <= number) {
            await this.deleteBookmark(BM + i);
            await this.waitForBookmarkLoading();
            i++;
        }
        return this.sleep(500);
    }

    async editBulkDeleteBookmarks() {
        await this.click({ elem: this.getEditButton() });
        await this.waitForElementVisible(this.getDoneButton());
    }

    async selectBookmarkToDeleteByName(name) {
        await this.click({ elem: this.getBookmark(name) });
        return this.sleep(500);
    }

    async selectAllToDelete() {
        await this.click({ elem: this.getSelectAllButton() });
        return this.sleep(500);
    }

    async bulkDeleteBookmarks() {
        await this.click({ elem: this.getDeleteButton() });
    }

    async confirmDelete() {
        await this.click({ elem: this.getConfirmDeleteButton() });
    }

    async cancelDelete() {
        await this.click({ elem: this.getCancleDeleteButton() });
    }

    async confirmNotification() {
        await this.waitForElementVisible(this.getNotification());
        await this.click({ elem: this.getGotButton() });
    }

    async dismissNotification() {
        await this.waitForElementVisible(this.getNotification());
        await this.click({ elem: this.getGotButton() });
    }

    async ignoreNotification() {
        await this.waitForElementVisible(this.getNotification());
        await this.click({ elem: this.getDonotShowCheckBox() });
    }

    async dismissTooltip() {
        await this.click({ elem: this.getBookmarkTitle() });
    }

    async createSnapshot(name, sectionName = 'MY BOOKMARKS') {
        await this.hover({ elem: this.getBookmark(name, sectionName) });
        await this.getSnapshotIcon().click();
    }

    // Assertion helper

    async isPanelOpen() {
        return this.getPanel().isDisplayed();
    }

    async bookmarkCount(sectionName = 'MY BOOKMARKS') {
        const ele = await this.getBookmarkSection(sectionName);
        if (await ele.isExisting()) {
            const len = await ele.$$('.mstrd-BookmarkItem-name').length;
            return len;
        } else {
            return 0;
        }
    }

    async bookmarkTotalCount() {
        const myBookmarkCount = await this.bookmarkCount('MY BOOKMARKS');
        const sharedBookmarkCount = await this.bookmarkCount('SHARED WITH ME');
        return myBookmarkCount + sharedBookmarkCount;
    }

    async getAddBookmarkErrorMsg() {
        return this.getErrorInputDialog().getText();
    }

    async waitForBookmarkPanelPresent() {
        await this.waitForElementVisible(this.getPanel());
    }

    //TODO: disabled
    async isBookmarkEnabled() {
        if (await this.getBookmarkIcon().isDisplayed()) {
            if (await this.getBookmarkIcon().getCSSProperty('color')) {
                return true;
            }
        } else {
            return false;
        }
    }

    async isBookmarkPresent(name, sectionName = 'MY BOOKMARKS') {
        return this.getBookmark(name, sectionName).isDisplayed();
    }

    async isSaveChangesDialogPresent() {
        return this.getSaveChangesDialog().isDisplayed();
    }

    async isBookmarkLabelPresent() {
        const labelElement = await this.getLabelInTitle();
        return labelElement.isDisplayed();
    }

    async isErrorInputDialogPresent() {
        return this.getErrorInputDialog().isDisplayed();
    }

    async isSharedIconPresent(name) {
        return this.getShareByName(name).isDisplayed();
    }

    async isNotificationPresent() {
        return this.getNotification().isDisplayed();
    }

    async isSharedStatusIconPresent(name) {
        return this.getCapsureIcon(name).isDisplayed();
    }

    async isSendIconPresent(name) {
        return this.getSendIcon(name).isDisplayed();
    }

    async isSharedBMPresent(name, sectionName) {
        return this.getShareByName(name, sectionName).isDisplayed();
    }

    async isDeleteBMPresent(name, sectionName) {
        return this.getDeleteByName(name, sectionName).isDisplayed();
    }

    async isUpdateBMPresent(name, sectionName = 'MY BOOKMARKS') {
        return this.getUpdateByName(name, sectionName).isDisplayed();
    }

    async hideBookmarkTimeStamp() {
        const count = await this.getBookmarkTimeStamp().length;
        for (let i = 0; i < count; i++) {
            await browser.execute(
                `document.querySelectorAll('.mstrd-BookmarkItem-information > span')[${i}].style.visibility='hidden'`
            );
            // await this.hideElement(el);
        }
    }

    async showBookmarkTimeStamp() {
        const count = await this.getBookmarkTimeStamp().length;
        for (let i = 0; i < count; i++) {
            await browser.execute(`document.querySelectorAll('.mstrd-BookmarkItem-information > span')[${i}].style=''`);
            // await this.showElement(el);
        }
    }

    async clickAddBtn() {
        const bookmarkCount = await this.bookmarkTotalCount();
        console.log('BOOKMARK#:' + bookmarkCount);
        if (bookmarkCount === 0) {
            await this.click({ elem: this.getAddFirstBookmark() });
        } else {
            await this.click({ elem: this.getAddNewBookmark() });
        }
    }

    async saveBookmark() {
        await this.click({ elem: this.getSaveButton() });
        await this.waitForElementInvisible(this.getBookmarkSpinner());
    }

    // ----------------------------------

    // Page level loading
    async waitForBookmarkLoading() {
        await this.sleep(500);
        await this.waitForElementStaleness(this.getLoadingSpinner(), {
            timeout: this.DEFAULT_LOADING_TIMEOUT,
            msg: 'Synchronizing a bookmark takes too long.',
        });
        return this.sleep(500);
    }

    async labelInTitle() {
        const labelElement = await this.getLabelInTitle();
        await this.waitForElementVisible(labelElement);
        console.log('find label in title');
        return labelElement.getText();
    }

    async isNewBookmarkIconPresent() {
        return this.getNewBookmarkReminder().isDisplayed();
    }
    async getNewBookmarkNumber() {
        return this.getNewBookmarkReminder().getText();
    }

    async getNotificationMsg() {
        await this.waitForElementVisible(this.getNotification());
        return this.getNotification().$('.mstrd-BookmarkNotification-msg').getText();
    }

    async getNotificationErrorMessage() {
        await this.waitForElementVisible(this.getNotification());
        return this.getNotificationError().getText();
    }

    async isNotificationErrorPresent() {
        return this.getNotificationError().isDisplayed();
    }

    async getCapsureText(name) {
        const value = await this.getCapsureIcon(name).getText();
        return value;
    }

    async isNoBookmarksPanelPresent() {
        return this.getNoBookmarks().isDisplayed();
    }

    async isBookmarkAddtoLibraryMsgPresent() {
        return await this.getBookmarkNotification().isDisplayed();
    }

    async isNoPrivillegeTooltipDisplayed() {
        return this.$('.ant-tooltip.mstrd-Tooltip .ant-tooltip-inner').isDisplayed();
    }

    async isCreateSnapshotIconPresent(name, sectionName) {
        await this.hover({ elem: this.getBookmark(name, sectionName) });
        return this.getSnapshotIcon().isDisplayed();
    }

    async getBookmarkTooltipText() {
        await this.hover({ elem: this.getBookmarkIcon() });
        return this.$('.ant-tooltip-content').getText();
    }
}
