import ListView from './ListView.js';

export default class BookmarkBlade extends ListView {
    constructor() {
        super();
    }
    // Element locator
    getCustomGroups() {
        return this.getDossiersListViewContainer().$$('.mstrd-AGCustomGroupRow');
    }

    getItems() {
        return this.getDossiersListViewContainer().$$('.ag-row-level-1');
    }

    getBookmarksGroup() {
        return this.getCustomGroups().filter(async (group) => ((await group.getText()).includes('Bookmarks')))[0];
    }

    getFavoriteGroup() {
        return this.getCustomGroups().filter(async (group) => ((await group.getText()).includes('Favorites')))[0];
    }

    getEditBookmarkButton(bookmarkName) {
        return this.getItem(bookmarkName).$('.icon-pnl_edit');
    }

    getDeleteBookmarkButton(bookmarkName) {
        return this.getItem(bookmarkName).$('.icon-pnl_delete');
    }

    getCreateSnapshotButton(bookmarkName) {
        return this.getItem(bookmarkName).$('.mstrd-SnapshotIconButton');
    }

    getConfirmDeleteButton() {
        return this.$$('.mstrd-ConfirmationDialog .mstrd-ConfirmationDialog-button').filter(async (button) => ((await button.getText()).includes('Yes')))[0];
    }

    getInlineError() {
        return this.$('.ant-popover-inner-content');
    }

    // Action helper
    async openBookmark(bookmarkName) {
        await this.click({elem: this.getItem(bookmarkName)});
    }


    async favoriteBookmarks(bookmarkNames) {
        for (const bookmarkName of bookmarkNames) {
            const ele = this.getItem(bookmarkName);
            await this.hover({ elem: ele });
            await this.click({ elem: ele.$('.icon-mstrd_home_favorite_i') });
        }
    }

    async unfavoriteBookmarks(bookmarkNames) {
        for (const bookmarkName of bookmarkNames) {
            const ele = this.getItem(bookmarkName);
            await this.hover({ elem: ele });
            await this.click({ elem: ele.$('.icon-mstrd_home_favorite') });
        }
    }

    async shareBookmark(bookmarkName) {
        const ele = this.getItem(bookmarkName);
        await this.hover({ elem: ele });
        await this.click({ elem: ele.$('.icon-info_share') });
    }

    async renameBookmark(bookmarkName, newName) {
        const ele = this.getItem(bookmarkName);
        await this.hover({ elem: ele });
        const editButton = this.getEditBookmarkButton(bookmarkName);
        await this.click({ elem: editButton });
        await this.input(newName);
        await this.enter();
        await this.waitForCurtainDisappear();
        return this.sleep(1000); // wait for rename complete
    }

    async renameBookmarkWithoutEnter(bookmarkName, newName) {
        const ele = this.getItem(bookmarkName);
        await this.hover({ elem: ele });
        const editButton = this.getEditBookmarkButton(bookmarkName);
        await this.click({ elem: editButton });
        await this.input(newName);
    }

    async deleteBookmark(bookmarkName) {
        const ele = this.getItem(bookmarkName);
        await this.hover({ elem: ele });
        const deleteButton = this.getDeleteBookmarkButton(bookmarkName);
        await this.click({ elem: deleteButton });
        await this.click({ elem: this.getConfirmDeleteButton() });
    }

    async createSnapshotOnBookmark(bookmarkName) {
        const ele = this.getItem(bookmarkName);
        await this.hover({ elem: ele });
        const createSnapshotButton = this.getCreateSnapshotButton(bookmarkName);
        await this.click({ elem: createSnapshotButton });
        await this.waitForElementInvisible(this.$('.mstrd-SnapshotIconButton-spinner'));
    }

    async openBookmark(bookmarkName) {
        const ele = this.getItem(bookmarkName);
        await this.click({ elem: ele });
    }

    async getFavoriteBookmarkNumberFromTitle() {
        const el = this.getFavoriteGroup();
        await this.waitForElementVisible(el);
        const text = await el.getText();
        return Number(text.match(/\((\d+)\)/)[1]); //change this page object to handle group name with number case
    }

    async getBookmarkListNumberFromTitle() {
        const el = this.getBookmarksGroup();
        await this.waitForElementVisible(el);
        const text = await el.getText();
        return Number(text.match(/\((\d+)\)/)[1]); //change this page object to handle group name with number case
    }

    async isFavoriteGroupVisible() {
        const el = this.getFavoriteGroup();
        return el.isDisplayed();
    }

    async isBookmarksGroupVisible() {
        const el = this.getBookmarksGroup();
        return el.isDisplayed();
    }

    async getTotalBookmarkNumber() {
        return this.getItems().length;
    }

    async getBookmarkListNames() {
        const names = await this.getItems().map((item) => (item.$('.mstrd-DossierItemRow-name, .mstrd-DossierItemRow-bookmarkName').getText()));
        return names;
    }

    async isSharedBookmark(bookmarkName) {
        const ele = this.getItem(bookmarkName).$('.mstrd-DossierItemRow-bookmarkIcon--isShare');
        return await ele.isDisplayed();
    }

    async isEditButtonVisible(bookmarkName) {
        const el = this.getItem(bookmarkName);
        await this.hover({ elem: el });
        const editButton = this.getEditBookmarkButton(bookmarkName);
        return await editButton.isDisplayed();
    }

    async getInlineErrorMessage() {
        await this.waitForElementVisible(this.getInlineError());
        return this.getInlineError().getText();
    }

}
