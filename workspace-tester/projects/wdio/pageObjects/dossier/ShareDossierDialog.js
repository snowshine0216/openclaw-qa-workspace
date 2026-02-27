import BasePage from '../base/BasePage.js';
import InfoWindow from '../library/InfoWindow.js';
import LibraryPage from '../library/LibraryPage.js';
import { getDisabledStatus, getAttributeValue } from '../../utils/getAttributeValue.js';

export default class ShareDossierDialog extends BasePage {
    constructor() {
        super();
        this.infoWindow = new InfoWindow();
        this.libraryPage = new LibraryPage();
    }

    // Element locators

    getShareDossierDialog() {
        return this.$('.mstrd-ShareDossierContainer-main');
    }

    getShareDossierTitle() {
        return this.getShareDossierDialog().$('.mstrd-ShareDossierContainer-title');
    }

    getDossierCoverImage() {
        return this.getShareDossierDialog().$('.mstrd-ShareDossierContainer-imageHolder');
    }

    getCloseButton() {
        return this.getShareDossierDialog().$('.mstrd-ShareDossierContainer-headerIcons .icon-pnl_close');
    }

    /* share BM section */
    getShareBMSection() {
        return this.getShareDossierDialog().$('.mstrd-BookmarkListSection');
    }

    getIncludeBMCheckBox() {
        return this.getShareBMSection().$('.mstrd-Checkbox');
    }

    getBMListContainer() {
        return this.getShareBMSection().$('.mstrd-BookmarkListSection-dropdownContainer');
    }

    getOpenBMListIcon() {
        return this.getBMListContainer().$$('.mstrd-BookmarkListSection-arrow')[0];
    }

    getCurrentSelection() {
        return this.getBMListContainer().$('.mstrd-BookmarkListSection-selectedInfo').getText();
    }

    getBMListDropDown() {
        return this.getBMListContainer().$('.mstrd-BookmarkListSection-dropdown');
    }

    getBMListBySectionName(name) {
        if (name === 'MY BOOKMARKS') {
            return this.getBMListDropDown().$('.mstrd-BookmarkListSection-myBM');
        } else {
            return this.getBMListDropDown().$('.mstrd-BookmarkListSection-sharedBM');
        }
    }

    getBMItemByName(bookmarkName, sectionName) {
        return this.getBMListBySectionName(sectionName)
            .$$('.mstrd-BookmarkListSection-item')
            .filter(async (elem) => {
                const elemName = await elem.$('.mstrd-BookmarkListSection-name').getText();
                return elemName === bookmarkName;
            })[0];
    }

    getAllSelection() {
        return this.getBMListBySectionName('MY BOOKMARKS').$(' .mstrd-BookmarkListSection-allItem');
    }

    //selected BM list for share bookmark section
    getSelectedList() {
        return this.getBMListDropDown()
            .$$('.mstrd-BookmarkListSection-item[aria-checked="true"] .mstrd-BookmarkListSection-name')
            .map((elem) => elem.getText());
    }

    getBMErrorTooltip() {
        return this.getBMListDropDown().$('.mstrd-BookmarkListSection-error');
    }

    /* share content */

    //add recipient

    getShareContent() {
        return this.getShareDossierDialog().$('.mstrd-ShareDossierContainer-content');
    }

    getRecipientSearchBox() {
        return this.getShareContent().$('.mstrd-RecipientSearchSection-searchBox');
    }

    getRecipientList() {
        return this.getRecipientSearchBox().$$('.mstrd-RecipientCapsule');
    }

    getRecipientNameList() {
        return this.getRecipientSearchBox()
            .$$('.mstrd-RecipientCapsule')
            .map((elem) => elem.getText());
    }

    getRecipientByName(name) {
        return this.getRecipientSearchBox()
            .$$('.mstrd-RecipientCapsule')
            .filter(async (elem) => {
                const elemName = await elem.getText();
                return elemName.includes(name);
            })[0];
    }

    getDeleteRecipientButtonByName(name) {
        return this.getRecipientByName(name).$('.icon-pnl_delete-capsule');
    }

    getRecipientInput() {
        return this.$(
            '.mstrd-RecipientSearchSection .mstrd-RecipientSearchSection-searchBox .mstrd-RecipientSearchSection-input'
        );
    }

    getSearchList() {
        // Support both old RecipientSearchResults and new RecipientTree
        return this.$('.mstrd-RecipientSearchResults, .mstrd-RecipientSearchSection-searchList');
    }

    getSearchListLoadingIcon() {
        // Support both old RecipientSearchResults and new RecipientTree
        return this.getSearchList().$('.mstrd-RecipientSearchResults-loadingSpinner, .mstrd-RecipientTree-loadingSpinner');
    }

    getSearchUserList() {
        return this.getShareContent().$('#mstrd-recipient-search-results');
    }

    getSearchListCheckbox() {
        // Support both old RecipientSearchResults and new RecipientTree
        return this.getShareContent().$('.mstrd-RecipientSearchResults .mstrd-RecipientGroup--showCheckbox, .mstrd-RecipientTree .mstrd-RecipientGroup--showCheckbox');
    }

    getGroupItemByName(name) {
        return this.getSearchList()
            .$$('.mstrd-RecipientGroup-inner')
            .filter(async (elem) => {
                const elemName = await elem.getText();
                return elemName.includes(name);
            })[0];
    }

    getGroupRecipientCheckBoxByName(name) {
        return this.getGroupItemByName(name).$('.mstrd-TriStateCheckbox');
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

    getRecipientGroupMemberByName(name) {
        return this.getParent(this.getRecipientGroupByName(name)).$('.mstrd-RecipientGroup-count');
    }

    getSingleRecipientByName(name) {
        return this.getParent(
            this.getSearchList()
                .$$('.mstrd-RecipientUser-name .mstrd-RecipientUser-loginName')
                .filter(async (elem) => {
                    const elemText = await elem.getText();
                    return elemText === name;
                })[0]
        );
    }

    getRecipientSearchMsg() {
        // Support both old RecipientSearchResults and new RecipientTree
        return this.getSearchList().$('.mstrd-RecipientSearchResults-msg, .mstrd-RecipientTree-msg');
    }

    getSearchLoadingSpinner() {
        // Support both old RecipientSearchResults and new RecipientTree
        return this.$('.mstrd-RecipientSearchResults-loadingSpinner, .mstrd-RecipientTree-loadingSpinner');
    }

    //add message

    getAddMessageTextArea() {
        return this.getShareContent().$('.mstrd-ShareDossierContainer-msg textarea');
    }

    getShareButton() {
        return this.getShareContent().$('.mstrd-ShareDossierContainer-shareBtn:not([disabled]');
    }

    /* link section */
    getLinkSection() {
        return this.getShareDossierDialog().$('.mstrd-LinkSection');
    }

    getLinkUrl() {
        return this.getLinkSection().$('.mstrd-LinkSection-link');
    }

    getLink() {
        return this.getLinkSection().$('.mstrd-LinkSection-link').getText();
    }

    getCopyButton() {
        return this.getLinkSection().$('.mstrd-LinkSection-copyBtn');
    }

    getCopyButtonText() {
        return this.getLinkSection().$('.mstrd-LinkSection-copyBtn span').getText();
    }

    getCopiedTooltip() {
        return this.$('.mstrd-LinkSection-popover');
    }

    getBookmarkTimeStamp() {
        return this.$$('.mstrd-BookmarkListSection-time');
    }

    getNameAndTime() {
        return this.$('.mstrd-ShareDossierContainer-nameAndTime');
    }

    //share with ACL
    getChangeACLButton() {
        return this.$('.mstrd-RecipientSearchSection-aclDropdown');
    }

    getChangeACLDropDownMenu() {
        return this.$('.mstrd-RecipientSearchSection-option .mstrd-DropDown-children');
    }

    getTargetACLItem(targetACL) {
        return this.getChangeACLDropDownMenu()
            .$$('.mstrd-Option')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === targetACL;
            })[0];
    }

    //success toast
    getSuccessToast() {
        return this.$('.mstrd-FloatNotifications');
    }
    getSuccessToastCloseButton() {
        return this.$('.mstrd-FloatNotifications-closeButton');
    }

    // Action helpers
    async includeBookmark() {
        await this.waitForElementVisible(this.getShareDossierDialog());
        await this.click({ elem: this.getIncludeBMCheckBox() });
    }
    async includeAllBookmarksInTeams() {
        await this.waitForElementVisible(this.$('.mstrd-MenuPanel'));
        await this.click({ elem: this.$('.mstrd-Checkbox') });
        await this.click({ elem: this.$('.mstrd-BookmarkListSection-selected') });
        await this.click({ elem: this.$('.mstrd-BookmarkListSection-allItem') });
    }

    async openBMList() {
        await this.waitForElementVisible(this.getShareDossierDialog());
        await this.click({ elem: this.getOpenBMListIcon() });
        await this.waitForElementVisible(this.getBMListDropDown());
    }

    async selectSharedBookmark(bookmarkList, sectionName = 'MY BOOKMARKS') {
        for (const bookmarkItem of bookmarkList) {
            // let item = await this.getBMItemByName(bookmarkItem, sectionName);
            let item;
            if (bookmarkItem === 'All') {
                item = await this.getAllSelection();
            } else {
                item = await this.getBMItemByName(bookmarkItem, sectionName);
            }
            await item.click();
        }
    }

    async closeShareBookmarkDropDown() {
        const bookmarkArrowIcon = this.getOpenBMListIcon();
        await this.clickByForce({ elem: bookmarkArrowIcon });
        await this.waitForElementInvisible(this.getBMListDropDown());
    }

    async searchRecipient(searchKey, waitForShareDialog = true) {
        if (waitForShareDialog) {
            await this.waitForElementVisible(this.getShareDossierDialog());
        }
        // const searchBox = this.getRecipientSearchBox();
        await this.click({ elem: this.getRecipientInput() });
        await this.input(searchKey);
        await this.waitForElementVisible(this.getSearchList());
        await this.waitForElementStaleness(this.getSearchListLoadingIcon());
    }

    async addUserForSaaS(userList) {
        await this.waitForElementVisible(this.getShareDossierDialog());
        await this.click({ elem: this.getRecipientInput() });
        for (const user of userList) {
            await this.input(user);
            await this.enter();
            // add sleep here to wait for the user to be added
            await this.sleep(1000);
        }
    }

    async expandGroup(name) {
        await this.click({ elem: this.getExpandRecipientGroupIconByName(name) });
        return await this.waitForElementVisible(this.getRecipientGroupMemberByName(name));
    }

    async selectGroupRecipient(name) {
        await this.click({ elem: this.getRecipientGroupByName(name) });
    }

    async slelectAllForGroupRecipient(name) {
        await this.click({ elem: this.getGroupRecipientCheckBoxByName(name) });
    }

    async selectRecipients(userList, groupName = 'None') {
        if (groupName !== 'None') {
            //expand user group first if hasn't
            if (this.getGroupMemberCount(groupName) !== '') {
                await this.click({ elem: this.getExpandRecipientGroupIconByName(groupName) });
            }
            //add group members
            for (const user of userList) {
                await this.click({ elem: this.getSingleRecipientByName(user) });
            }
            //click expand icon again to collapse user group
            await this.clickByForce({ elem: this.getExpandRecipientGroupIconByName(groupName) });
        } else {
            for (const user of userList) {
                await this.click({ elem: this.getSingleRecipientByName(user) });
            }
        }
    }

    async dismissRecipientSearchList() {
        await this.clickByForce({ elem: this.getRecipientSearchBox() });
    }

    async deleteRecipients(userList) {
        for (const user of userList) {
            await this.waitForElementVisible(this.getRecipientByName(user));
            await this.click({ elem: this.getDeleteRecipientButtonByName(user) });
        }
    }

    async addMessage(msg) {
        await this.waitForElementVisible(this.getShareDossierDialog());
        const msgTextArea = this.getAddMessageTextArea();
        await this.click({ elem: msgTextArea });
        await msgTextArea.setValue(msg);
    }

    async shareDossier(waitForSuccessToast = false) {
        await this.click({ elem: this.getShareButton() });
        if (waitForSuccessToast) {
            await this.waitForElementAppearAndGone(this.getSuccessToast());
        }
    }

    async copyLink(waitForSuccessToast = false) {
        await this.waitForElementVisible(this.getShareDossierDialog());
        await this.click({ elem: this.getCopyButton() });

        //check tooltip
        await this.waitForElementVisible(this.getCopiedTooltip());
        if (waitForSuccessToast) {
            await this.waitForElementAppearAndGone(this.getSuccessToast());
        }
    }

    async closeDialog() {
        await this.waitForElementVisible(this.getCloseButton());
        await this.click({ elem: this.getCloseButton() });
    }

    async shareAllBookmarksFromIWToUser(dossier, userName) {
        //open share dialog from IW panel
        await this.libraryPage.moveDossierIntoViewPort(dossier.name);
        await this.libraryPage.openDossierInfoWindow(dossier.name);
        await this.infoWindow.shareDossier();

        //select all bookmarks and choose recipient user
        await this.includeBookmark();
        await this.openBMList();
        await this.selectSharedBookmark(['All']);
        await this.closeShareBookmarkDropDown();
        await this.searchRecipient(userName);
        await this.selectRecipients([userName]);

        //add msg
        await this.addMessage('share bookmarks to recipient');
        await this.shareDossier();
    }

    async getShareAllBookmarksLink() {
        await this.openBMList();
        await this.selectSharedBookmark(['All']);
        await this.closeShareBookmarkDropDown();
        let shareLink = await this.getLink();
        return shareLink;
    }

    async hideBookmarkTimeStamp() {
        const count = await this.getBookmarkTimeStamp().length;
        for (let i = 0; i < count; i++) {
            let el = this.getBookmarkTimeStamp()[i].$('span');
            await this.hideElement(el);
        }
    }

    async showBookmarkTimeStamp() {
        const count = await this.getBookmarkTimeStamp().length;
        for (let i = 0; i < count; i++) {
            let el = this.getBookmarkTimeStamp()[i].$('span');
            await this.showElement(el);
        }
    }

    async hideSharedUrl() {
        await this.hideElement(this.getLinkUrl());
    }

    async showSharedUrl() {
        await this.showElement(this.getLinkUrl());
    }

    async hideTimeAndName() {
        await this.hideElement(this.getNameAndTime());
    }

    async showTimeAndName() {
        await this.showElement(this.getNameAndTime());
    }

    async openACL() {
        await this.click({ elem: this.getChangeACLButton() });
        await this.waitForElementVisible(this.getChangeACLDropDownMenu());
    }

    async changeACLTo(targetACL) {
        if (!(await this.getChangeACLDropDownMenu().isDisplayed())) {
            await this.click({ elem: this.getChangeACLButton() });
            await this.waitForElementVisible(this.getChangeACLDropDownMenu());
        }
        await this.click({ elem: this.getTargetACLItem(targetACL) });
    }

    // Assertion helpers
    async isShareButtonEnabled() {
        return this.getShareButton().isDisplayed();
    }

    async isIncludeBMPresent() {
        return this.getShareBMSection().isDisplayed();
    }

    async isAllOptionPresent() {
        return this.getAllSelection().isDisplayed();
    }

    async isBMListPresent() {
        return this.getBMListContainer().isDisplayed();
    }

    async isGroupMemberPresent(name) {
        return this.getRecipientGroupMemberByName(name).isDisplayed();
    }

    async getSelectedCount() {
        const list = await this.getSelectedList();
        return list.length;
    }

    async getGroupMemberCount(name) {
        await this.waitForElementVisible(this.getRecipientGroupMemberByName(name));
        return this.getRecipientGroupMemberByName(name).getText();
    }

    async getSearchResultText() {
        await this.waitForElementVisible(this.getRecipientSearchMsg());
        return this.getRecipientSearchMsg().getText();
    }

    async getCurrentSelectionText() {
        return (await this.getCurrentSelection()).replace('\n', '');
    }

    async getGroupCheckBoxStatus(name) {
        const status = await this.getGroupRecipientCheckBoxByName(name).getAttribute('aria-checked');
        return status;
    }

    async isGroupItemDisabled(name) {
        const xpathCommand = this.getCSSContainingText('mstrd-RecipientGroup-inner--disabled', name);
        const disableGroupUser = this.getSearchList().$(`${xpathCommand}`);
        return disableGroupUser.isExisting();
    }

    async getRecipientDefaultHintText() {
        const value = await getAttributeValue(
            this.getRecipientInput(),
            'placeholder'
        );
        return value;
    }

    async getShareDialogTitle() {
        return this.getShareDossierTitle().getText();
    }

    async isRecipientSearchBoxDisabled() {
        const value = await this.isDisabledStatus(this.getRecipientSearchBox());
        return value;
    }

    async isAddMessageTextAreaDisabled() {
        const value = await getDisabledStatus(this.getAddMessageTextArea());
        return value;
    }

    async waitForSearchListPresent() {
        await this.waitForElementVisible(this.getSearchList());
        await this.waitForElementInvisible(this.getSearchLoadingSpinner());
    }

    async isChangeACLPresent() {
        return this.getChangeACLButton().isDisplayed();
    }
}
