import BasePage from '../base/BasePage.js';

export default class ManageAccessDialog extends BasePage {
    // Element locators
    getManageAccessDialog() {
        return this.$('.mstrd-ManageAccessContainer-main');
    }

    getManageAccessDialogHeader() {
        return this.$('.mstrd-ManageAccessContainer-header');
    }

    getManageAccessDialogContent() {
        return this.$('.mstrd-ManageAccessContainer-content');
    }

    // Title section
    getManageAccessTitle() {
        return this.getManageAccessDialogHeader().$('.mstrd-ManageAccessContainer-title');
    }

    getCloseButton() {
        return this.getManageAccessDialogHeader().$('.mstrd-ManageAccessContainer-headerIcons .icon-pnl_close');
    }

    // Search and add new user/user group's ACL section
    getSearchSection() {
        return this.getManageAccessDialogContent().$('.mstrd-ManageAccessContainer-search');
    }

    getAddButton() {
        return this.getSearchSection().$('.mstrd-RecipientSearchSection-addBtn');
    }

    getRecipientSearchBox() {
        return this.getSearchSection().$('.mstrd-RecipientSearchSection-searchBox');
    }

    getRecipientInput() {
        return this.getSearchSection().$('.mstrd-RecipientSearchSection-input');
    }

    getSearchList() {
        return this.getSearchSection().$('.mstrd-RecipientSearchResults');
    }

    getSearchListLoadingIcon() {
        return this.getSearchList().$('.mstrd-RecipientSearchResults-loadingSpinner');
    }

    getManageAccessLoadingIcon() {
        return this.getManageAccessDialog().$('.mstrd-ManageAccessContainer-loading');
    }

    getRecipientGroupByName(name) {
        return this.getSearchList()
            .$$('.mstrd-RecipientGroup-name')
            .filter(async (elem) => {
                const elemName = await elem.getText();
                return elemName.includes(name);
            })[0];
    }

    getExpandRecipientGroupIconByName(name) {
        return this.getParent(this.getRecipientGroupByName(name)).$('.icon-menu-arrow');
    }

    getSingleRecipientByName(name) {
        return this.getParent(
            this.getSearchList()
                .$$('.mstrd-RecipientUser-name .mstrd-RecipientUser-loginName,.mstrd-RecipientUser-fullName')
                .filter(async (elem) => {
                    const elemText = await elem.getText();
                    return elemText === name;
                })[0]
        );
    }

    getChangeACLButtonInSearchSection() {
        return this.getSearchSection().$('.mstrd-RecipientSearchSection-aclDropdown');
    }

    getChangeACLDropDownMenuInSearchSection() {
        return this.getSearchSection().$('.mstrd-DropDown-children');
    }

    getTargetACLItemInSearchSection(targetACL) {
        return this.getChangeACLDropDownMenuInSearchSection()
            .$$('.mstrd-Option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === targetACL;
            })[0];
    }

    // existing user/user group's ACL list section
    getUserACLSection() {
        return this.getManageAccessDialogContent().$('.mstrd-ManageAccessContainer-items');
    }

    getUserItems() {
        return this.$$('.mstrd-AccessEntryItem');
    }

    async getUserItemByName(user) {
        for (const item of await this.getUserItems()) {
            const nameLocator = item.$('.mstrd-AccessEntryItem-fullName');
            const userName = await nameLocator.getText();
            if (userName.includes(user)) {
                return item;
            }
        }
        return null;
    }

    async getRemoveButtonByName(user) {
        return (await this.getUserItemByName(user)).$('.icon-clearsearch');
    }

    async getChangeACLButtonByName(user) {
        return (await this.getUserItemByName(user)).$('.mstrd-AccessEntryItem-aclDropdown');
    }

    async getChangeACLDropDownMenu(user) {
        return (await this.getUserItemByName(user)).$('.mstrd-DropDown-children');
    }

    async getTargetACLItem(user, targetACL) {
        return (await this.getChangeACLDropDownMenu(user)).$$('.mstrd-Option').filter(async (elem) => {
            const elemText = await elem.getText();
            return elemText === targetACL;
        })[0];
    }

    // folder apply to child setting section
    getApplyButton() {
        return this.getManageAccessDialogContent().$('.mstrd-ManageAccessContainer-folder-apply-to-children-check');
    }

    getOverwriteButton() {
        return this.getManageAccessDialogContent().$('.mstrd-ManageAccessContainer-folder-overwrite-children');
    }

    // cancel and save buttons section
    getButtonSection() {
        return this.getManageAccessDialogContent().$('.mstrd-ManageAccessContainer-btns');
    }

    getCancelButton() {
        return this.getButtonSection().$('.mstrd-ManageAccessContainer-cancelBtn');
    }

    getSaveButton() {
        return this.getButtonSection().$('.mstrd-ManageAccessContainer-okBtn:not([disabled]');
    }

    //success toast
    getSuccessToast() {
        return this.$('.mstrd-FloatNotifications');
    }
    getSuccessToastCloseButton() {
        return this.$('.mstrd-FloatNotifications-closeButton');
    }

    // Action helpers
    async searchRecipient(searchKey) {
        await this.waitForElementVisible(this.getManageAccessDialog());
        const searchBox = this.getRecipientSearchBox();
        await this.click({ elem: searchBox });
        if (this.isSafari()) {
            // safari doesn't support send keys to active element in else block
            await searchBox.setValue(searchKey);
        } else {
            await this.input(searchKey);
        }
        await this.waitForElementVisible(this.getSearchList());
        await this.waitForElementStaleness(this.getSearchListLoadingIcon());
    }

    async selectRecipient(user) {
        await this.click({ elem: this.getSingleRecipientByName(user) });
    }

    async selectGroupRecipient(name) {
        await this.click({ elem: this.getRecipientGroupByName(name) });
    }

    async getUserCurrentACL(user) {
        if (await this.getUserItemByName(user)) {
            return (await this.getUserItemByName(user)).$('.mstrd-DropDownButton-label').getText();
        } else {
            return 'None';
        }
    }

    async cancelManageAccessChange() {
        await this.click({ elem: this.getCancelButton() });
        await this.waitForElementInvisible(this.getManageAccessDialog());
    }

    async saveManageAccessChange(waitForSuccessToast = true) {
        await this.click({ elem: this.getSaveButton() });
        if (waitForSuccessToast) {
            await this.waitForElementAppearAndGone(this.getSuccessToast());
        }
    }

    async closeDialog() {
        await this.click({ elem: this.getCloseButton() });
    }

    async hoverACL(name) {
        await this.hover({ elem: await this.getChangeACLButtonByName(name) });
    }

    async openACL(name) {
        await (await this.getChangeACLButtonByName(name)).click();
    }

    async openACLInSearchSection() {
        await (await this.getChangeACLButtonInSearchSection()).click();
    }

    async removeACL(name) {
        await (await this.getRemoveButtonByName(name)).click();
    }

    async updateACL(name, targetACL) {
        await (await this.getChangeACLButtonByName(name)).click();
        await (await this.getTargetACLItem(name, targetACL)).click();
    }

    async addACL(userList, groupList, targetACL) {
        for (const user of userList) {
            await this.searchRecipient(user);
            await this.selectRecipient(user);
        }
        for (const group of groupList) {
            await this.searchRecipient(group);
            await this.selectGroupRecipient(group);
        }
        await (await this.getChangeACLButtonInSearchSection()).click();
        await this.waitForElementVisible(this.getChangeACLDropDownMenuInSearchSection());
        await this.click({ elem: this.getTargetACLItemInSearchSection(targetACL) });
        await this.click({ elem: this.getAddButton() });
    }

    async selectApplyToAll() {
        await this.click({ elem: this.getApplyButton() });
    }

    async selectOverwriteForAll() {
        await this.click({ elem: this.getApplyButton() });
        await this.click({ elem: this.getOverwriteButton() });
    }

    // After open manage access dialog, wait for UI finished render.
    async waitForManageAccessLoading() {
        await this.waitForElementVisible(this.getManageAccessDialog());
        await this.waitForElementStaleness(this.getManageAccessLoadingIcon());
        //add buffer for UI render
        await this.sleep(500);
    }

    // Assertion helpers
    async isSaveButtonEnabled() {
        return this.getSaveButton().isEnabled();
    }

    async isAddButtonEnabled() {
        return this.getAddButton().isEnabled();
    }

    async isCancelButtonEnabled() {
        return this.getCancelButton().isEnabled();
    }

    async isManageAccessPresent() {
        return (await this.getManageAccessDialog()).isDisplayed();
    }

    async getACLItemscount() {
        return this.getUserItems().length;
    }

    async isUserACLExisted(user) {
        const el = await this.getUserItemByName(user);
        return el != null;
    }
}
