import CommentsPage from './CommentsPage.js';
import Panel from '../common/Panel.js';
import DossierPage from '../dossier/DossierPage.js';
import * as consts from '../../constants/collaborationPrivate.js';

/** Class representing comment panel **/
export default class GroupDiscussionPage extends CommentsPage {
    constructor() {
        super();
        this.panel = new Panel();
        this.dossierPage = new DossierPage();
        this.commentsPage = new CommentsPage();
    }

    // Element locator
    getDiscussionTab() {
        return this.$('.mstrd-CollabViewSwitch-discussions');
    }

    // ------ Discussion Summary Panel -----------------
    getAddNewButton() {
        return this.$('.mstrd-DiscussionViewer-addNew');
    }

    getToSection() {
        return this.$('.mstrd-MultiSearchSelect-input');
    }

    getSuggestionContainerInDiscussion() {
        return this.$('.mstrd-MultiSearchSelect-dropdown-menu-item-group-list');
    }

    getSungestionInDetail() {
        return this.$('.mstrd-Suggestion');
    }

    getSuggestionItems() {
        return this.$$('.mstrd-MultiSearchSelect-dropdown-menu-item');
    }

    getSuggestionItemInDiscussion(index) {
        return this.getSuggestionItems()[index];
    }

    // to update
    getSuggestionItemByName(name) {
        // return this.element.all(by.xpath(`//li[contains(@class,'mstrd-MultiSearchSelect-dropdown-menu-item') and @aria-label='${userName}']`)).first();
        // return this.getParent(
        //     this.getSuggestionItems()
        //         .all(by.cssContainingText('.mstrd-MultiSearchSelect-selectorItemFullName', new RegExp(`^${name}$`)))
        //         .first()
        // );
        return this.getSuggestionItems().filter(async (elem) => {
            const userName = (await elem.$(`.mstrd-MultiSearchSelect-selectorItemFullName`)).getText();
            return (await userName).includes(name);
        })[0];
        // return this.commentsPage.getSuggestionItem('username', name)[0];
    }

    getUserInToSection(name) {
        return this.$('.mstrd-MultiSearchSelect-searchBox').$(`.mstrd-MultiSearchSelect-capsuleSummaryText*=${name}`);
    }
    getDiscussionNameInputBox() {
        return this.$('.ant-input.mstrd-DiscussionEditor-nameInputBox');
    }

    getDiscussionPanel() {
        return this.$('.mstrd-DropdownMenu-content');
    }

    getMessagePanel(index) {
        return this.$$('.mstrd-DiscussionItem-content')[index];
    }

    getFilterButtonInDiscussion({ messageIndex = 0, filterIndex = 0 }) {
        return this.getMessagePanel(messageIndex).$$('.mstrd-DiscussionItem-filterBtn')[filterIndex];
    }

    getMessageInputBox() {
        return this.$('.mstrd-CommentInputBox');
    }

    getDiscussionSummaryItem() {
        return this.$$('.mstrd-DiscussionSummary');
    }
    getDiscussionSummaryItemByIndex(index) {
        return this.getDiscussionSummaryItem()[index];
    }

    getBadgeCounterInDiscussionTab() {
        return this.$('.mstrd-CollabViewSwitch-discussionBadge').getText();
    }

    getBadgeCounnterInDiscussionIcon() {
        return this.$('.mstrd-DiscussionUserIcon-badge').getText();
    }

    getMuteIconInSummaryPanel() {
        return this.$('.mstrd-DiscussionSummary-summaryInfoMute.icon-pnl_muted');
    }

    getTimeStampInDiscussionSummary() {
        return this.$$('.mstrd-DiscussionSummary-summaryTime');
    }

    // ---------- Discussion Detail Panel ----------
    getDiscussionItemByIndex(index) {
        return this.$$('.mstrd-DiscussionItem')[index];
    }

    getDiscussionMsgByIndex(index) {
        return this.getDiscussionItemByIndex(index).$('.mstrd-DiscussionItem-msg');
    }

    getDiscussionInfoIcon() {
        return this.$('.mstrd-DiscussionTitle-info');
    }

    getViewMemberButton() {
        return this.$('.mstrd-DiscussionTitle-membersCount.icon-pnl_sharer');
    }

    getSystemMessageByIndex(index) {
        return this.$$('.mstrd-DiscussionList-history')[index];
    }

    getHistoryTagUserHint(index) {
        return this.$$('.mstrd-DiscussionList-historyTagUserHint')[index];
    }

    getHistoryDissmissButton() {
        return this.$('.mstrd-DiscussionList-historyTagUserButton').$('.mstrd-mstrd-ActionLink-text*=Dismiss');
    }

    getHistoryInviteButton() {
        return this.$('.mstrd-DiscussionList-historyTagUserButton').$('.mstrd-ActionLink-text*=Invite');
    }

    getMuteIconInDetailPanel() {
        return this.$('.mstrd-DiscussionTitle-nameContainerMute.icon-pnl_muted');
    }

    getDeleteIcon(elem) {
        return elem.$('.mstrd-DiscussionItem-deleteBtn.icon-pnl_close');
    }

    getDeleteButton() {
        return this.$('.mstrd-Button*=Delete');
    }

    getDeleteConfirmationMsg(elem) {
        return elem.$('.mstrd-DiscussionItem-overlay');
    }

    getTimeStampInDiscussionDetail() {
        return this.$$('.mstrd-DiscussionItem-contentRightTime');
    }

    //------------ Discussion About Panel  --------------
    getDiscussionAboutPanel() {
        return this.$('.mstrd-DiscussionViewer-details');
    }

    getDiscussionNameBoxInAboutPanel() {
        return this.$('.mstrd-DiscussionAbout-nameEditorText');
    }

    getDiscussionEditBox() {
        return this.$('.mstrd-DiscussionAbout-renameEditorInput');
    }

    getConfirmDiscussionNameButton() {
        return this.$('.mstrd-DiscussionAbout-renameEditorConfirm.icon-pnl_menucheck');
    }

    getDeleteDiscussionButton() {
        return this.$('.mstrd-DiscussionAbout-deleteChannel');
    }

    getBackButtonInAboutPanel() {
        return this.$('.mstrd-DiscussionAbout-titleIcon.icon-backarrow');
    }

    getBackButtonInDetailPanel() {
        return this.$('.mstrd-DiscussionTitle-navback.icon-backarrow');
    }

    getMemberListItem() {
        return this.$$('.mstrd-DiscussionAbout-memberListItem');
    }

    getMemberListItemByIndex(index) {
        return this.$$('.mstrd-DiscussionAbout-memberListItem')[index];
    }

    async getLastMemberLoginNameInAboutPanel() {
        let member_count = (await this.$$('.mstrd-DiscussionAbout-memberListItemAccount').length) - 1;
        return this.$$('.mstrd-DiscussionAbout-memberListItemAccount')[member_count].getText();
    }

    getRemoveUserButtonByIndex(index) {
        return this.$$('.mstrd-DiscussionAbout-memberListItemRemove.icon-pnl_delete')[index];
    }

    getMemberNameByIndex(index) {
        return this.$$('.mstrd-DiscussionAbout-memberListItemAccount')[index].getText();
    }

    getInviteWindow() {
        return this.$('.ant-modal-content');
    }
    getInvitePeopleButton() {
        return this.$('.mstrd-DiscussionAbout-invite');
    }

    getInvitePeopleInput() {
        return this.$('.mstrd-MultiSearchSelect-input');
    }

    getInviteButton() {
        return this.getInviteWindow().$('.mstrd-Button*=Invite');
    }

    getInviteCancelButton() {
        return this.getInviteWindow().$('.mstrd-ActionLink-text*=Cancel');
    }
    getLeaveButton() {
        return this.$('.mstrd-DiscussionAbout-quitChannel');
    }

    getLeaveConfirmMsg() {
        return this.$('.mstrd-DiscussionAbout-quitConfirmText');
    }

    getConfirmLeaveButton() {
        return this.$('.mstrd-DiscussionAbout-quitConfirmBtns').$('.mstrd-Button*=Leave');
    }

    getViewAllCollapseButton() {
        return this.$('.mstrd-DiscussionAbout-memberListViewAll');
    }

    getMuteButton() {
        return this.$('.mstrd-DiscussionAbout-notificationSwitch');
    }

    getExistingDiscussion(index) {
        return this.$$('.mstrd-DiscussionSummary-summary')[index];
    }

    // Action helper
    async openCommentsPanel() {
        await this.waitForElementVisible(this.getCommentsIcon());
        await this.waitForElementEnabled(this.dossierPage.getCommentsIcon(), {
            timeout: this.DEFAULT_TIMEOUT * 10,
            msg: 'Comment icon is disabled.',
        });
        // await this.wait(this.$('.mstrd-CommentIcon').isEnabled, this.DEFAULT_TIMEOUT, 'Comment icon is disabled.');
        await this.click({ elem: this.getCommentsIcon() });
        await this.waitForElementVisible(this.getDiscussionTab());
        return this.sleep(1500);
    }

    async openDiscussionTab() {
        await this.click({ elem: this.getDiscussionTab() });
        return await this.waitForElementVisible(this.getAddNewButton());
    }
    async selectSuggestionItem(index) {
        // await this.brwsr.actions().mouseMove(this.getSuggestionItemInDiscussion(index)).perform();
        // await this.brwsr.actions().mouseUp().perform();
        // await this.brwsr.actions().click().perform();
        await this.hover({ elem: this.getSuggestionItemInDiscussion(index) });
        await this.clickByForce({ elem: this.getSuggestionItemInDiscussion(index) });
        return this.sleep(500);
    }

    async clickNewDiscussion() {
        await this.click({ elem: this.getAddNewButton() });
    }

    async typeInGoToSection(text) {
        await (await this.getToSection()).setValue(text);
        await this.waitForLoadingSuggestionItems();
    }

    // use comment.selectSuggestionItem() instead
    async selectSuggestionItemByName(userName) {
        // await this.brwsr.actions().mouseMove(this.getSuggestionItemByName(userName)).perform();
        // await this.brwsr.actions().mouseUp().perform();
        // await this.brwsr.actions().click().perform();
        await this.hover({ elem: this.getSuggestionItemByName(userName) });
        await this.clickByForce({ elem: this.getSuggestionItemByName(userName) });
        // await this.commentsPage.selectSuggestionItem('username', userName);
        await this.waitForElementVisible(await this.getUserInToSection(userName));
        return this.sleep(500);
    }

    async waitForLoadingSuggestionItems() {
        return this.waitForElementVisible(
            this.getSuggestionContainerInDiscussion().$('.mstrd-MultiSearchSelect-dropdown-menu-item')
        );
    }

    async createNewDiscussion(username, index, discussionName = '', message) {
        await this.clickNewDiscussion();
        for (let user of username) {
            await (await this.getToSection()).setValue(user);
            await this.sleep(500);
            await this.delete();
            await this.sleep(2000);
            await this.waitForLoadingSuggestionItems();
            if (!this.isUserNamePresent(user)) {
                await this.getToSection().setValue('@');
                await this.getToSection().addValue(user);
                await this.sleep(2000);
                await this.waitForLoadingSuggestionItems();
            }
            await this.selectSuggestionItemByName(user);
        }
        await this.waitForElementClickable(this.getDiscussionNameInputBox());
        if (discussionName != '') {
            await this.getDiscussionNameInputBox().click();
            await await this.getDiscussionNameInputBox().addValue(discussionName);
        }
        await this.getCommentBox().click();
        await this.getCommentBox().addValue(message);
        await this.getPostButton().click();
        await this.waitForElementVisible(this.getDiscussionInfoIcon());
        await this.sleep(2000);
    }

    async selectExistingDiscussion(username, index) {
        await this.getAddNewButton().click();
        await this.getToSection().setValue(username);
        await this.waitForLoadingSuggestionItems();
        await this.selectSuggestionItem(index);
        await this.waitForElementVisible(this.getDiscussionPanel());
        await this.sleep(2000);
    }

    async clickDiscussionInfoIcon() {
        await this.getDiscussionInfoIcon().click();
        return this.waitForElementVisible(this.getDiscussionAboutPanel());
    }

    async deleteDisccusion() {
        await this.getDeleteDiscussionButton().click();
        await this.getDeleteButton().click();
        return this.waitForElementVisible(this.getDiscussionTab());
    }

    async enterExistingDiscussion(index) {
        await this.getDiscussionSummaryItemByIndex(index).click();
        return this.waitForElementVisible(this.getCommentBox());
    }

    async removeUser(index) {
        await this.getRemoveUserButtonByIndex(index).click();
        await this.getDeleteButton().click();
        return this.sleep(500);
    }

    async goBackToDetailPanel() {
        await this.getBackButtonInAboutPanel().click();
        return this.waitForElementVisible(this.getDiscussionPanel());
    }

    async goBackToSummaryPanel() {
        await this.sleep(500);
        await this.getBackButtonInDetailPanel().click();
        return this.waitForElementVisible(this.getDiscussionTab());
    }

    async enterAboutPanel(index) {
        await this.openCommentsPanel();
        await this.openDiscussionTab();
        await this.enterExistingDiscussion(index);
        await this.clickDiscussionInfoIcon();
        return this.sleep(500);
    }

    async inputInInvite(text) {
        await this.click({ elem: this.getInvitePeopleButton() });
        await this.waitForElementVisible(this.getInvitePeopleInput());
        await this.getInvitePeopleInput().addValue(text);
        await this.waitForLoadingSuggestionItems();
    }

    async cancelInvite() {
        await this.click({ elem: this.getInviteCancelButton() });
    }

    async invitePeople(username, index) {
        await this.getInvitePeopleButton().click();
        await this.getInvitePeopleInput().addValue(username);
        await this.sleep(2000);
        await this.selectSuggestionItem(index);
        await this.getInviteButton().click();
        return this.sleep(1000);
    }

    async invitePeopleByName(username) {
        await this.click({ elem: this.getInvitePeopleButton() });
        await this.getInvitePeopleInput().setValue(username);
        await this.sleep(2000);
        await this.selectSuggestionItemByName(username);
        await this.click({ elem: this.getInviteButton() });
        return this.sleep(1000);
    }

    async clickHistoryInviteButton() {
        await this.getHistoryInviteButton().click();
        return this.sleep(1000);
    }

    async renameDiscussion(text) {
        await this.getDiscussionNameBoxInAboutPanel().click();
        await this.sleep(1000);
        // await this.getDiscussionEditBox().clear();
        await this.getDiscussionEditBox().setValue(text);
        await this.getConfirmDiscussionNameButton().click();
    }
    async viewMember() {
        await this.getViewMemberButton().click();
        return this.waitForElementVisible(this.getDiscussionAboutPanel());
    }

    async collapseExpandMember() {
        await this.getViewAllCollapseButton().click();
        return this.sleep(500);
    }

    async leaveDiscussion() {
        await this.getLeaveButton().click();
        // await this.waitForTextPresentInElement(this.getLeaveConfirmMsg(), 'This will remove you from the discussion.');
        await this.getConfirmLeaveButton().click();
        await this.sleep(500);
    }

    async switchMuteNotification() {
        await this.getMuteButton().click();
        return this.sleep(1000);
    }

    async hoverOnComment(element) {
        await this.hover({ elem: element });
        return this.waitForElementVisible(this.getDeleteIcon(elem));
    }

    async hoverOnCommentByIndex(index) {
        return this.hoverOnComment(this.getDiscussionItemByIndex(index));
    }

    async deleteComment(elem) {
        await this.getDeleteIcon(elem).click();
        await this.waitForElementVisible(this.getDeleteConfirmationMsg(elem));
        //await this.wait(this.EC.visibilityOf(this.getDeleteConfirmationMsg(elem)), 5000, 'Delete confirmation message did not appear.');
        await this.getDeleteButton(elem).click();
        return this.sleep(2000);
    }

    async deleteCommentByIndex(index) {
        await this.deleteComment(this.getDiscussionItemByIndex(index));
    }

    async hoverAndDeleteCommentByIndex(index) {
        await this.hover({ elem: this.getDiscussionItemByIndex(index) });
        await this.deleteCommentByIndex(index);
    }

    async deleteAllDiscussions() {
        let count = await this.getDiscussionSummaryItem().length;
        while (count > 0) {
            await this.enterExistingDiscussion(0);
            await this.clickDiscussionInfoIcon();
            await this.deleteDisccusion();
            count -= 1;
        }
    }

    async applyEmbeddedFilter({ messageIndex = 0, filterIndex = 0 }) {
        await this.click({ elem: this.getFilterButtonInDiscussion({ messageIndex, filterIndex }) });
        await this.waitForCurtainDisappear();
    }

    // Assertion helper
    async isUserExisted(username, index) {
        const name = await this.getMemberNameByIndex(index);
        return name === username;
    }

    async isUserRemovedMsgDisplayed(username, index) {
        const msg = (await this.getSystemMessageByIndex(index)).getText();
        return msg === username + consts.removedHistoryMsg;
    }

    async isUserInvitedMsgDisplayed(username, index) {
        const msg = (await this.getSystemMessageByIndex(index)).getText();
        return msg === username + consts.addedHistoryMsg;
    }

    async isDiscussionExisted() {
        const length = await this.getDiscussionSummaryItem().length;
        return length == 0 ? false : true;
    }

    async isUserInvitedConfirmedMsgDisplayed(username, index) {
        const msg = (await this.getSystemMessageByIndex(index)).getText();
        return msg === username + consts.addedHistoryMsg;
    }
    async isHistoryTagUserHintDsiplayed(index, username) {
        const hint = await this.getHistoryTagUserHint(index).getText();
        return hint === username + consts.cantSeeHistoryMsg;
    }

    async isHistoryDiscussionNameChangedDisplayed(index, username, discussionName) {
        const hint = (await this.getSystemMessageByIndex(index)).getText();
        return hint === username + consts.changeNameHistoryMsg + discussionName + '.';
    }

    async isDiscussionTabPresent() {
        return (await this.getDiscussionTab()).isDisplayed();
    }

    // to confirm
    async isUserNamePresent(username) {
        return this.getSuggestionItemByName(username).isDisplayed();
    }

    async hideTimeStampInDiscussionSummary() {
        const count = await this.getTimeStampInDiscussionSummary().length;
        for (let i = 0; i < count; i++) {
            let el = this.getTimeStampInDiscussionSummary()[i];
            await this.hideElement(el);
        }
    }

    async hideTimeStampInDiscussionDetail() {
        const count = await this.getTimeStampInDiscussionDetail().length;
        for (let i = 0; i < count; i++) {
            let el = this.getTimeStampInDiscussionDetail()[i];
            await this.hideElement(el);
        }
    }

    async openExistingDiscussion(index) {
        return this.getExistingDiscussion(index).click();
    }

    async isFilterButtonEnabled({ messageIndex = 0, filterIndex = 0 }) {
        return this.getFilterButtonInDiscussion({ messageIndex, filterIndex }).isEnabled();
    }
}
