import BasePage from '../base/BasePage.js';
import DossierAuthoringPage from '../dossier/DossierAuthoringPage.js';
import TOCMenu from '../common/TOCMenu.js';
import LoadingDialog from '../dossierEditor/components/LoadingDialog.js';
import { formToJSON } from 'axios';

export default class ManageAccessEditor extends BasePage {
    constructor() {
        super();
        this.tocMenu = new TOCMenu();
        this.dossierAuthoringPage = new DossierAuthoringPage();
        this.loadingDialog = new LoadingDialog();
    }

    // Element locators
    getManageAccessEditor() {
        return this.$('.mstrmojo-ManageAccess-Editor');
    }

    getChapter(chapterName) {
        return this.getManageAccessEditor().$(`//div[contains(@class,'chapter') and text()='${chapterName}']`);
    }

    getLockedChapter(chapterName) {
        return this.getManageAccessEditor().$(
            `//div[contains(@class,'chapter lock unit') and text()='${chapterName}']`
        );
    }

    getUnLockedChapter(chapterName) {
        return this.getManageAccessEditor().$(
            `//div[contains(@class,'chapter') and not(contains(@class,'lock')) and text()='${chapterName}']`
        );
    }

    getManageAccessEditorContentView() {
        return this.$('.mstrmojo-Box .content-view');
    }

    getPulldownText(text) {
        return this.$(`//div[contains(@class,'mstrmojo-ui-Pulldown-text') and text()='${text}']`);
    }

    getPulldown() {
        return this.$(`//div[contains(@class,'toc-content-pulldown')]`);
    }

    getPopupListItem(item) {
        return this.$(`//div[contains(@class,'mstrmojo-popupList')]//div[text()='${item}']`);
    }

    getAddUserGroupSearchArea() {
        return this.$('.mstrmojo-SimpleObjectInputBox-container');
    }

    getAddUserGroupSearchInputBox() {
        return this.$(`//div[contains(@class, 'mstrmojo-SimpleObjectInputBox-container')]//input[@type='text']`);
    }

    getSearchSuggestList() {
        return this.$('.mstrmojo-suggest-list.acl-list');
    }

    getUserFromSuggestList(user) {
        return this.getSearchSuggestList().$(`//span[text()='${user}']`);
    }

    getExistingUserGroupSearchBox() {
        return this.$('.mstrmojo-TextBox.acl-filter-box');
    }

    getViewSelectedToggleButton() {
        return this.getManageAccessEditor().$('.mstrmojo-ui-ToggleButton');
    }

    getUserfromCheckList(userOrGroup) {
        return this.$(
            `//div[contains(@class,'mstrmojo-ui-CheckList') and contains(@class,'acl-list')]//span[text()='${userOrGroup}']`
        );
    }

    getCheckedUser(userOrGroup) {
        return this.$(
            `//div[contains(@class,'mstrmojo-ui-CheckList') and contains(@class,'acl-list')]//div[contains(@class,'item') and contains(@class,'selected')]//span[text()='${userOrGroup}']`
        );
    }

    getUnCheckedUser(userOrGroup) {
        return this.$(
            `//div[contains(@class,'mstrmojo-ui-CheckList') and contains(@class,'acl-list')]//div[contains(@class,'item') and not(contains(@class,'selected'))]//span[text()='${userOrGroup}']`
        );
    }

    getButtonBar() {
        return this.getManageAccessEditor().$('.mstrmojo-HBox.mstrmojo-Editor-buttonBar');
    }

    getButton(btnName) {
        return this.$(`//table[@class='mstrmojo-HBox mstrmojo-Editor-buttonBar']//div[text()='${btnName}']`);
    }

    getAddButton() {
        return this.$(`//div[contains(@class,'mstrmojo-Button-text') and text() = 'Add']`);
    }

    getChapterInTOC(chapterName) {
        return this.$(`//div[contains(@class,'mstrmojo-VITitleBar') and @aria-label='${chapterName}']`);
    }

    getErrorMessage(errorMsg) {
        return this.$(`//div[contains(@class,'mstrd-MessageBox-main')]//div[text() = '${errorMsg}']`);
    }

    getShowDetailsBtn() {
        return this.$(`//div[contains(@class,'mstrd-MessageBox-main')]//*[text() = 'Show details']`);
    }

    // Action Helpers

    async openManageAccessEditor(chapterName) {
        await this.rightClick({ elem: this.tocMenu.getChapterMenuIcon(chapterName) });
        await this.click({ elem: this.dossierAuthoringPage.getMenuItem('Manage Access') });
        await this.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    }

    async switchPulldown(currentOption, newOption) {
        await this.click({ elem: this.getPulldownText(currentOption) });
        await this.click({ elem: this.getPopupListItem(newOption) });
    }

    async setPulldown(newOption) {
        await this.click({ elem: this.getPulldown() });
        await this.click({ elem: this.getPopupListItem(newOption) });
    }

    async searchUserGroup(userOrGroup) {
        let searchArea = await this.getAddUserGroupSearchArea();
        await this.waitForElementVisible(searchArea);
        await this.click({ elem: searchArea });
        let searchInput = await this.getAddUserGroupSearchInputBox();
        await this.clear({ elem: searchInput });
        await searchInput.addValue(userOrGroup);
    }

    async selectFromSuggestList(userOrGroup) {
        let user = await this.getUserFromSuggestList(userOrGroup);
        await this.waitForElementVisible(user);
        await this.click({ elem: user });
    }

    async clickAddUserButton() {
        let addBtn = await this.getAddButton();
        await this.waitForElementClickable(addBtn);
        await this.click({ elem: addBtn });
    }

    async clickButton(btnName) {
        let button = await this.getButton(btnName);
        await this.waitForElementClickable(button);
        await this.click({ elem: button });
    }

    async searchInSelectedList(userOrGroup) {
        let searchInput = await this.getExistingUserGroupSearchBox();
        await this.waitForElementVisible(searchInput);
        await this.click({ elem: searchInput });
        await this.clear({ elem: searchInput });
        await searchInput.addValue(userOrGroup);
    }

    async checkUserOrGroupFromExistingList(userOrGroup) {
        let user = await this.getUserfromCheckList(userOrGroup);
        await this.waitForElementVisible(user);
        await this.click({ elem: user });
    }

    async userOrGroupIsChecked(userOrGroup) {
        return (await this.getCheckedUser(userOrGroup)).isDisplayed();
    }

    async userOrGroupIsNotChecked(userOrGroup) {
        return (await this.getUnCheckedUser(userOrGroup)).isDisplayed();
    }

    async userOrGroupIsAdded(userOrGroup) {
        return (await this.getUserfromCheckList(userOrGroup)).isDisplayed();
    }

    async switchChapterInEditor(chapterName) {
        let chapter = await this.getChapter(chapterName);
        await this.waitForElementVisible(chapter);
        await this.click({ elem: chapter });
    }

    async chapterIsLocked(chapterName) {
        return (await this.getLockedChapter(chapterName)).isDisplayed();
    }

    async chapterIsUnLocked(chapterName) {
        return (await this.getUnLockedChapter(chapterName)).isDisplayed();
    }

    async toggleViewSelectedButton() {
        await this.click({ elem: await this.getViewSelectedToggleButton() });
    }

    async chapterIsDisplayedInTOC(chapterName) {
        return (await this.getChapterInTOC(chapterName)).isDisplayed();
    }

    async errorMsgIsDisplayed(errorMsg) {
        return (await this.getErrorMessage(errorMsg)).isDisplayed();
    }

    async clickShowDetails() {
        await this.click({ elem: await this.getShowDetailsBtn() });
    }
}
