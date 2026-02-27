import BaseComponent from '../base/BaseComponent.js';


export default class ShareDialog extends BaseComponent {
    constructor() {
        super(null, '#sharingEditor .mstrmojo-Editor', 'The sharing editor component');
    }

    // Element locator
    getLinkSection() {
        return this.locator.$('.mstrmojo-Label.SharingEditor-ShowLink');
    }

    getLibraryLinkSection() {
        return this.locator.$$('.mstrmojo-Label.SharingEditor-libraryLink').filter(el => el.isDisplayed())[0];
    }

    getLaunchButton() {
        return this.locator.$('.sharingEditor-launchLink');
    }

    getEmbedSection() {
        return this.locator.$('.mstrmojo-Label.SharingEditor-ShowHtml');
    }

    getLinkInput(type) {
        if (type === 'Link') {
            return this.locator.$$('.mstrmojo-TextBox.SharingEditor-Link')[0];
        }

        return this.locator.$$('.mstrmojo-TextBox.SharingEditor-Link')[1];
    }

    getEmbedInput() {
        return this.locator.$('.mstrmojo-TextBox.SharingEditor-Html');
    }

    getUserPanel() {
        return this.locator.$('.sharingEditor-ACLUserPanel .sharingEditor-CPSection');
    }

    getSearchOption() {
        return this.locator.$('.mstrmojo-ui-Pulldown');
    }

    getSearchDropDown() {
        return this.locator.$('.mstrmojo-popupList-scrollBar.mstrmojo-scrollNode');
    }

    getSearchDropDownItem(name) {
        return this.getSearchDropDown().$$('.item').filter(async el => (await el.getText()).includes(name))[0];
    }

    getUserInput() {
        return this.locator.$$('.mstrmojo-ObjectInputBox')[0];
    }

    getUserInputBox() {
        return this.getUserInput().$('.mstrmojo-ObjectItem-editNode input');
    }

    getBrowseButton() {
        return this.locator.$('.action-button');
    }

    getCloseButton() {
        return this.locator.$('.edt-title-btn.mstrmojo-Editor-close');
    }

    getSuggestionDropdown() {
        return this.$('.mstrmojo-suggest-list');
    }

    getSuggestionUserByName(fullName, index = 1) {
        return this.getSuggestionDropdown().$$('.mstrmojo-suggest-text').filter(async el => (await el.getText()).includes(fullName))[index - 1];
    }

    getACLItemByUserName(fullName) {
        return this.locator.$('.mstrmojo-DataGrid-itemsContainer').$$('.mstrmojo-itemwrap').filter(async (el) => (await el.getText()).includes(fullName))[0];
    }

    getACLEditorByUserName(fullName) {
        return this.getACLItemByUserName(fullName).$('.mstrmojo-Label.sharingEditor-rightLabel');
    }

    getACLDeleteByUserName(fullName) {
        return this.getACLItemByUserName(fullName).$('.mstrmojo-ACLEditor-delete');
    }

    getACLTooltipByUserName(fullName) {
        return this.getACLItemByUserName(fullName).$('.mstrmojo-DropDownButton-boxNode.sharingEditor-datagridPulldown-boxNode');
    }

    getACLEditorDropDown() {
        return this.$$('.mstrmojo-popup-content').filter(async (el) => (await el.isDisplayed()))[0];
    }

    getACLEditorOption(option) {
        return this.getACLEditorDropDown().$$('.mstrmojo-itemwrap').filter(async (elem) => (await elem.getText()).includes(option))[0];
    }

    getCustomACLEditor() {
        return this.$('.mstrmojo-CustomACLEditor');
    }

    getCustomACLItemByType(type) {
        return this.getCustomACLEditor().$$('.mstrmojo-HBox').filter(async el => (await el.getText()).includes(type))[0];
        //return this.getCustomACLEditor().element(by.cssContainingText('.mstrmojo-HBox', type));
    }

    getCustomACLLabel(type) {
        return this.getCustomACLItemByType(type).$('.mstrmojo-Pulldown-iconNode');
    }

    getCustomACLDropDown() {
        return this.$$('.mstrmojo-Pulldown-listItem').filter(async (el) => (await el.isDisplayed()))[0];
    }

    getCustomACLOption(option) {
        return this.$$(`.mstrmojo-Pulldown-listItem`).filter(async (el) => (await el.getText()).includes(option))[0];
    }

    getCustomACLEditorCloseButton() {
        return this.getCustomACLEditor('.edt-title-btn.mstrmojo-Editor-close');
    }

    getCustomACLEditorOKButton() {
        return this.getCustomACLEditor().$('.mstrmojo-Editor-button-OK');
    }

    getCustomACLEditorCancelButton() {
        return this.getCustomACLEditor().$('.mstrmojo-Editor-button-Cancel');
    }

    getChildrenAccessDropDown() {
        return this.locator.$('.mstrmojo-Pulldown-iconNode');
    }

    getChildrenAccessOption(option) {
        return this.locator.$('.mstrmojo-Pulldown-Popup').$$('.mstrmojo-itemwrap').filter(async el => (await el.getText()).includes(option))[0];
    }

    getDoneButton() {
        return this.locator.$('.mstrmojo-Editor-button-OK');
    }

    getCancelButton() {
        return this.locator.$('.mstrmojo-Editor-button-Close');
    }

    getUserBrowser() {
        return this.$('.mstrmojo-UserEditor');
    }

    getUserGroupByName(groupName) {
        return this.getUserBrowser().$$('.mstrmojo-itemwrap').filter(async el => (await el.getText()).includes(groupName))[0];
    }

    getConfirmButton(text) {
        return this.$$(`.mstrmojo-Editor-button`).filter(async el => (await el.getText()).includes(text))[0];
    }

    // Action Helper
    async selectLibraryLinkSection() {
        await this.click({ elem: this.getLibraryLinkSection() });
    }

    async launchLibrary() {
        await this.click({ elem: this.getLaunchButton() });
    }

    async selectSearchOption(item) {
        await this.click({ elem: this.getSearchOption() });
        await this.waitForElementVisible(this.getSearchDropDown());
        await this.click({ elem: this.getSearchDropDownItem(item) });
        // add sleep here to wait for new search result after change search option
        await this.sleep(3000);
    }

    async inputUser(fullName) {
        await this.click({ elem: this.getUserInput() });
        const input = this.getUserInputBox();
        await this.clear({ elem: input });
        await input.setValue(fullName);
    }

    async getSuggestionList(fullName) {
        await this.inputUser(fullName);
        await this.waitForElementVisible(this.getSuggestionDropdown());
        return this.$$('.mstrmojo-suggest-text');
    }

    async closeDialog() {
        await this.click({ elem: this.getCloseButton() });
    }

    async selectUser(fullName) {
        await this.inputUser(fullName);
        await this.waitForElementVisible(this.getSuggestionDropdown());
        await this.click({ elem: this.getSuggestionUserByName(fullName) });
    }

    async changeUserACLType(fullName, type) {
        await this.click({ elem: this.getACLEditorByUserName(fullName) });
        await this.click({ elem: this.getACLEditorOption(type) });
    }

    async customizeUserACLType(fullName, condition) {
        await this.click({ elem: this.getACLEditorByUserName(fullName) });
        await this.click({ elem: this.getACLEditorOption('Custom') });

        for (const [key, value] of Object.entries(condition)) {
            await this.click({ elem: this.getCustomACLLabel(key) });
            await this.click({ elem: this.getCustomACLOption(value) });
            await this.waitForElementInvisible(this.getCustomACLDropDown());
        }
        await this.sleep(500);
        await this.click({ elem: this.getCustomACLEditorOKButton() });
        await this.waitForElementInvisible(this.getCustomACLEditor());
        await this.click({ elem: this.getDoneButton() });
    }

    async deleteUser(fullName) {
        await this.hover({ elem: this.getACLEditorByUserName(fullName) });
        await this.click({ elem: this.getACLDeleteByUserName(fullName) });
        await this.click({ elem: this.getConfirmButton('Yes') });
        await this.click({ elem: this.getDoneButton() });
    }

    async chooseChildrenAccess(option) {
        await this.click({ elem: this.getChildrenAccessDropDown() });
        let fullOption = 'Preserve children\'s access control lists';
        if (option === 'Overwrite') {
            fullOption = 'Overwrite children\'s access control lists';
        }
        await this.click({ elem: this.getChildrenAccessOption(option) });
        await this.waitForElementVisible(this.getDoneButton());
    }

    async saveACL() {
        await this.click({ elem: this.getDoneButton() });
        await this.waitForElementInvisible(this.getElement());
    }

    async hideLinkUrl() {
        await this.hideElement(this.getLinkInput('Link'));
    }

    async hideUserList() {
        await this.hideElement(this.locator.$('.sharingEditor-publicAccessSection'));
        await this.hideElement(this.locator.$('.mstrmojo-DataGrid.aclList'));
    }

    async showUserList() {
        await this.showElement(this.locator.$('.sharingEditor-publicAccessSection'));
        await this.showElement(this.locator.$('.mstrmojo-DataGrid.aclList'));
    }

    async showLinkUrl() {
        await this.showElement(this.getLinkInput('Link'));
    }

    async hideLibraryLinkUrl() {
        await this.hideElement(this.getLinkInput('Library Link'));
    }

    async showLibraryLinkUrl() {
        await this.showElement(this.getLinkInput('Library Link'));
    }
    // Assertion Helper

    async isShareDialogPresent() {
        return this.locator.isDisplayed();
    }

    async getSharedLink() {
        let text = await this.getInputValue(this.getLinkInput('Link'));
        while (text === '') {
            this.sleep(500);
            text = await this.getInputValue(this.getLinkInput('Link'));
        }
        return text;
    }

    async getSharedLibraryLink() {
        await this.click({ elem: this.getLibraryLinkSection() });
        const text = await this.getInputValue(this.getLinkInput('Library Link'));
        return text;
    }

    async getEmbedLink() {
        await this.click({ elem: this.getEmbedSection() });
        let text = await this.getInputValue(this.getEmbedInput());
        while (!text) {
            await this.sleep(500);
            text = await this.getInputValue(this.getEmbedInput());
        }
        const text2 = text.match(/src="([^"]+)"/)[1];
        return text2;
    }

    async isBrowseButtonDisabled() {
        return this.isDisabled(this.getBrowseButton());
    }

    async isUserInputboxDisabled() {
        return this.isDisabled(this.getUserInput());
    }

    async isDoneButtonDisabled() {
        return this.isDisabled(this.getDoneButton());
    }

    async getUserACLType(fullName) {
        await this.waitForElementVisible(this.getElement());
        return this.getACLEditorByUserName(fullName).getText();
    }

    async getUserACLTooltip(fullName) {
        await this.hover({ elem: this.getACLEditorByUserName(fullName) });
        const el = this.getACLTooltipByUserName(fullName);
        await this.waitForElementPresence(el);
        const value = await el.getAttribute('title');
        await this.hover({ elem: this.getCloseButton() });
        return value;
    }

    async isUserPresentForACLList(fullName) {
        return this.getACLItemByUserName(fullName).isDisplayed();
    }

    async getSubscriptionIDInSharedLink() {
        const text = await this.getSharedLink();
        const text2 = text.match(/subscriptionID=([^&]+)/)[1];
        return text2;
    }

    async getSuggestionUserTooltip(fullName, index = 0) {
        const suggestionItem = this.getSuggestionUserByName(fullName, index);
        const title = await this.getTitle(suggestionItem);
        return title;
    }

    async isACLEditerDisabled(fullName) {
        return this.isDisabled(this.getACLEditorByUserName(fullName));
    }

    async isLibraryLinkSectionPresent() {
        return this.getLibraryLinkSection().isDisplayed();
    }

    async getCurrentSearchOption() {
        return this.getSearchOption().$('.mstrmojo-ui-Pulldown-text').getText();
    }

    async isSearchOptionPresent() {
        return this.getSearchOption().isDisplayed();
    }

    async isSuggestionPresent() {
        return this.getSuggestionDropdown().isDisplayed();
    }

    async getSuggestionListCount() {
        const els = await this.$$('.mstrmojo-suggest-text');
        const count = await els.length;
        return count;
    }
}
