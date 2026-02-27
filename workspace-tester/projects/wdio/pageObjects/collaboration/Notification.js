import BasePage from '../base/BasePage.js';
import CommentsPage from '../collaboration/CommentsPage.js';
import GroupDiscussionPage from '../collaboration/GroupDiscussionPage.js';
import DossierPage from '../dossier/DossierPage.js';

export default class Notification extends BasePage {
    constructor() {
        super();
        this.dossierPage = new DossierPage();
        this.commentsPage = new CommentsPage();
        this.groupDiscussionPage = new GroupDiscussionPage();
    }

    // Element locator
    getNotificationIcon() {
        return this.$('.mstrd-NotificationIcon');
    }

    getNotifDisabledStatus() {
        return this.$('.mstrd-NotificationIcon--disabled');
    }

    getBadgeStatus() {
        return this.getNotificationIcon().$('.mstrd-Badge');
    }

    getBadge() {
        return this.getNotificationIcon().$('.mstrd-Badge--show');
    }

    getPanel() {
        return this.$(
            '.mstrd-NotificationDropdownMenuContainer--notification .mstrd-DropdownMenu .mstrd-DropdownMenu-main'
        );
    }

    getPanelMainContent() {
        return this.$('.mstrd-DropdownMenu-main');
    }

    getPanelList() {
        return this.getPanelMainContent().$('.mstrd-NotificationList-container');
    }

    getEmptyNotifcationMsg() {
        return this.$(`//div[text()='No recent notifications']`);
        // return this.$('mstrd-NotificationEmptyView-msg')
    }

    getNotificationItems() {
        return this.getPanel().$$('.mstrd-NotificationItem-content');
    }

    getCloseIcon() {
        return this.$('.mstrd-DropdownMenu-headerIcon.icon-pnl_close');
    }

    getMsgByIndex(index) {
        return this.getNotificationItems()[index];
    }

    getLinkTextByIndex(index) {
        return this.getMsgByIndex(index).$('.mstrd-NotificationItem-msg');
    }

    getNotificationMsgByIndex(index) {
        return this.$$('.mstrd-NotificationItem-msg')[index];
    }

    getActionBtnInsideMsg(index) {
        return this.getMsgByIndex(index).$('.mstrd-Button');
    }

    getActionBtnTextInsideMsg(index) {
        return this.getMsgByIndex(index).$('.mstrd-Button').getText();
    }

    getSharedMessageByIndex(index) {
        return this.getMsgByIndex(index).$('.mstrd-NotificationItem-additionalMsg');
    }

    getBookmarkToolbarInsideMsg(index) {
        return this.getMsgByIndex(index).$('.mstrd-NotificationItem-bookmarktoolbar');
    }

    getErrorInsideMsg(index) {
        return this.getMsgByIndex(index).$('.mstrd-NotificationItem-errCase');
    }

    getIgnoreByIndex(index) {
        return this.getMsgByIndex(index).$('.mstrd-ActionLink-text');
    }

    // to update-------
    async getMentionMsgFromUser(userName) {
        // return this.$(`//*[contains(text(),'mentioned')]//self::span[contains(text(),${userName})]//parent::div`);
        return this.getNotificationItems().filter(async (item) => {
            const msg = await item.$('.mstrd-NotificationItem-msg-text').getText();
            return msg.includes(userName) && msg.includes('mentioned');
        });
    }

    getFirstMentionMsgFromUser(userName) {
        return this.$(`//*[contains(text(),'mentioned')]//self::*[contains(text(),'${userName}')]//parent::div`);
    }

    getInviteMsgFromUser(userName) {
        return this.getAllInviteMsgFromUser(userName)[0];
    }

    // to update-------
    async getAllInviteMsgFromUser(userName) {
        // return this.$(`//*[contains(text(),'invited')]//self::span[contains(text(),${userName})]//parent::div`);
        return this.getNotificationItems().filter(async (item) => {
            const msg = await item.getText();
            return msg.includes(userName) && msg.includes('invited');
        });
    }

    getStartDiscussionMsgFromUser(userName) {
        return this.$(`//*[contains(text(),'started')]//self::b[contains(text(),${userName})]//parent::div`);
    }

    getInvitedDiscussionMsg() {
        return this.$(`//*[contains(text(),'invited')]//parent::div`);
    }

    getNewMsg() {
        return this.$(`//*[contains(text(),'new')]//parent::div`);
    }

    getRemovedMsg() {
        return this.$(`//*[contains(text(),'removed')]//parent::div`);
    }

    getDeleteDiscussionMsg() {
        return this.$(`//*[contains(text(),'deleted')]//parent::div`);
    }

    async getExplicitMsg(text) {
        return this.getNotificationItems().filter(async (item) => {
            const msg = await item.getText();
            return msg.includes(text);
        });
    }

    getClearLink() {
        return this.getPanel().$("//div[text()='Clear All']//ancestor::div[contains(@class, 'mstrd-ActionLink')]");
    }

    getClearMsgIcon() {
        return this.$('.mstrd-NotificationItem-btnDelete.icon-close');
    }

    getClearMsgIconByIndex(index) {
        return this.getClearMsgIcon(this.getMsgByIndex(index));
    }

    getClearMentionMsgIconByUser(userName) {
        return this.getClearMsgIcon(this.getMentionMsgFromUser(userName));
    }

    getClearInviteMsgIconByUser(userName) {
        return this.getClearMsgIcon(this.getInviteMsgFromUser(userName));
    }

    getSharedMsgFromUserByIndex(userName, index) {
        return this.getSharedMsgFromUser(userName)[index];
    }

    async getEmptyTxt() {
        return this.$('.mstrd-NotificationEmptyView-msg').getText();
    }

    getLoadingIcon() {
        return this.$('.mstrd-Loadable-loader');
    }

    getTimeStampInNotification() {
        return this.$$('.mstrd-NotificationItem-time');
    }

    // Action helper

    async waitForToolbar(index) {
        return this.waitForElementVisible(this.getBookmarkToolbarInsideMsg(index));
    }

    async hideNotificationTimeStamp() {
        const count = await this.getTimeStampInNotification().length;
        for (let i = 0; i < count; i++) {
            let el = this.getTimeStampInNotification()[i];
            await this.hideElement(el);
        }
    }

    async openPanel() {
        await this.waitForElementVisible(this.getNotificationIcon(), {
            timeout: 5000,
            msg: 'Notification icon does not exist.',
        });
        await this.waitForElementStaleness(this.getNotifDisabledStatus(), {
            timeout: 10000,
            msg: 'Notification icon is disabled.',
        });
        // await this.wait(this.EC.presenceOf(this.getNotificationIcon()), 5000, 'Notification icon does not exist.');
        // await this.wait(this.EC.stalenessOf(this.getNotifDisabledStatus()), 10000, 'Notification icon is disabled.');
        await this.getNotificationIcon().click();
        await this.waitForElementVisible(this.getPanel(), {
            timeout: '5000',
            msg: 'Notification panel did not open.',
        });
        // await this.wait(this.EC.presenceOf(this.getPanel()), 5000, 'Notification panel did not open.');
        return this.sleep(2000); // Time buffer for loading and/or animation
    }

    async closePanel() {
        const isPanelShow = await this.isNotificationPanelPresent();
        if (isPanelShow) {
            await this.getCloseIcon().click();
            console.log('click close notification button since panel is showed');
        }
        await this.waitForElementStaleness(this.getPanel(), {
            timeout: 5000,
            msg: 'Notification panel did not close.',
        });
        // return this.wait(this.EC.stalenessOf(this.getPanel()), 5000, 'Notification panel did not close.');
    }

    async openMsg(elem) {
        await elem.click();
        await this.dossierPage.waitForDossierLoading();
        return this.sleep(2000);
    }

    async openMsgByIndex(index) {
        return this.openMsg(this.getLinkTextByIndex(index));
    }

    async hoverOnMsg(elem) {
        // this.brwsr.actions().mouseMove(elem).perform();
        // this.brwsr.actions().mouseUp().perform();
        await this.hover({ elem: elem });
        await this.waitForElementVisible(this.getClearMsgIcon(elem), {
            timeout: 5000,
            msg: 'Clear message icon did not appear.',
        });
        // return this.wait(this.EC.visibilityOf(this.getClearMsgIcon(elem)), 5000, 'Clear message icon did not appear.');
    }

    async hoverOnMsgByIndex(index) {
        return this.hoverOnMsg(this.getMsgByIndex(index));
    }

    async hoverOnMentionMsgFromUser(userName) {
        return this.hoverOnMsg(this.getMentionMsgFromUser(userName));
    }

    async hoverOnInviteMsgFromUser(userName) {
        return this.hoverOnMsg(this.getInviteMsgFromUser(userName));
    }

    async clearMsg(elem) {
        await this.hoverOnMsg(elem);
        await this.getClearMsgIcon(elem).click();
        return this.sleep(2000);
    }

    async clearMsgByIndex(index) {
        return this.clearMsg(this.getMsgByIndex(index));
    }

    // to update -----
    async clearMentionMsgFromUser(userName) {
        return (await this.getMentionMsgFromUser(userName)).forEach((elem) => {
            return this.clearMsg(elem);
        });
    }

    // to update -----
    async clearInviteMsgFromUser(userName) {
        return (await this.getAllInviteMsgFromUser(userName)).forEach((elem) => {
            return this.clearMsg(elem);
        });
    }

    // to update -----
    async clearExplicitMsg(text) {
        return (await this.getExplicitMsg(text)).forEach((elem) => {
            return this.clearMsg(elem);
        });
    }

    async clearAllMsgs() {
        let result = await (await this.getEmptyNotifcationMsg()).isDisplayed();
        if (!result) {
            await this.click({ elem: this.getClearLink() });
            // await this.getClearLink().click();
            await this.sleep(8000); // Time buffer for loading and/or animation
            // return this.wait(this.EC.stalenessOf(this.getNotificationItems().first()), 8000, 'Not all messages are deleted.');
        }
    }

    async openSharedMsg(userName, index) {
        await this.openMsg(this.getSharedMsgFromUserByIndex(userName, index));
        return this.waitForElementVisible(await this.commentsPage.getCommentByIndex(0), {
            timeout: this.DEFAULT_TIMEOUT * 10,
        });
    }

    async openMentionMsgFromUser(userName) {
        await this.openMsg(this.getFirstMentionMsgFromUser(userName));
        await this.waitForElementVisible(await this.commentsPage.getCommentByIndex(0), {
            timeout: this.DEFAULT_TIMEOUT * 10,
        });
    }

    async openMsgFromUser(userName, option) {
        switch (option) {
            case 'mention':
                await this.openMsg(this.getFirstMentionMsgFromUser(userName));
                break;
            case 'startdiscussion':
                await this.openMsg(this.getStartDiscussionMsgFromUser(userName));
                break;
            default:
                break;
        }
        await this.waitForElementVisible(this.groupDiscussionPage.getDiscussionItemByIndex(0), {
            timeout: this.DEFAULT_TIMEOUT * 3,
        });
        await this.sleep(2000);
    }

    async openMsgByOption(option) {
        switch (option) {
            case 'newmsg':
                await this.openMsg(this.getNewMsg());
                break;
            case 'invite':
                await this.openMsg(this.getInvitedDiscussionMsg());
                break;
            case 'remove':
                await this.openMsg(this.getRemovedMsg());
                break;
            case 'delete':
                await this.openMsg(this.getDeleteDiscussionMsg());
                break;
            default:
                break;
        }
        await this.waitForElementVisible(this.groupDiscussionPage.getDiscussionItemByIndex(0), {
            timeout: this.DEFAULT_TIMEOUT * 10,
        });
        await this.sleep(2000);
    }

    async openNotificationWithoutRedirection(index) {
        await this.openMsg(this.getNotificationMsgByIndex(index));
        await this.sleep(2000);
    }

    async openNoitficationMsgByIndex(index, option) {
        await this.openNotificationWithoutRedirection(index);
        switch (option) {
            case 'discussion':
                return this.waitForElementVisible(await this.groupDiscussionPage.getDiscussionItemByIndex(0), {
                    timeout: this.DEFAULT_TIMEOUT * 10,
                    msg: '',
                });
            default:
                return this.waitForElementVisible(await this.commentsPage.getCommentByIndex(0), {
                    timeout: this.DEFAULT_TIMEOUT * 10,
                    msg: '',
                });
        }
    }

    async applySharedDossier(index) {
        await this.click({ elem: this.getActionBtnInsideMsg(index) });
        await this.waitForElementStaleness(this.getBookmarkToolbarInsideMsg(index));
    }

    async ignoreSharedDossier(index) {
        await this.click({ elem: this.getIgnoreByIndex(index) });
        // add sleep here to wait for animation disappeared
        await this.sleep(2000);
    }

    async openPanelAndWaitListMsg() {
        await this.openPanel();
        await this.waitForElementVisible(this.getPanelList());
        await this.sleep(2000);
    }

    // Assertion helper

    async isNotificationEnabled() {
        // Enough time buffer to display notification icon
        await this.sleep(3000);
        return (await this.getNotificationIcon()).isDisplayed();
    }

    async isNotificationNotEmpty() {
        return this.getNotificationItems()[0].isDisplayed();
    }

    async notificationMsgByIndex(index) {
        return this.getMsgByIndex(index).$('.mstrd-NotificationItem-msg').getText();
    }

    async notificationMsgCount() {
        return this.getNotificationItems().length;
    }

    async mentionMsgFromUserCount(userName) {
        return this.getMentionMsgFromUser(userName).length;
    }

    async inviteMsgFromUserCount(userName) {
        return this.getAllInviteMsgFromUser(userName).length;
    }

    async explicitMsgCount(text) {
        return this.getExplicitMsg(text).length;
    }

    async isMsgEnabled(index) {
        const className = await this.getMsgByIndex(index).getAttribute('class');
        return className.includes('mstrd-NotificationItem--action');
    }

    async isNewMsgPresent() {
        // Wait 1 second so red dot can finish displaying or hiding
        await this.sleep(1000);
        const className = await this.getBadgeStatus().getAttribute('class');
        return className.includes('show dot badge');
    }

    // to check
    async isExplicitMsgPresent(text) {
        return (await this.getExplicitMsg(text)).isDisplayed();
    }

    async isErrorPresent(index) {
        return (await this.getErrorInsideMsg(index)).isDisplayed();
    }

    async getErrorMsg(index) {
        await this.waitForElementVisible(this.getErrorInsideMsg(index));
        return this.getErrorInsideMsg(index).getText();
    }

    async isActionButtonPresent(index) {
        return (await this.getActionBtnInsideMsg(index)).isDisplayed();
    }

    // to check
    async isErrorMsgDisappear(index) {
        return this.waitForElementInvisible(this.getErrorInsideMsg(index));
    }

    async getSharedMessageText(index) {
        return this.getSharedMessageByIndex(index).getText();
    }

    async getClearAllStatus() {
        return (await (await this.getClearLink()).getAttribute('class')).includes('mstrd-ActionLink--disabled');
    }

    async isNotificationPanelPresent() {
        return (await this.getPanel()).isDisplayed();
    }

    async isCloseButtonFocused() {
        const elem = this.getCloseIcon();
        return (await elem.getAttribute('data-focus-visible-added')) === '';
    }
}
