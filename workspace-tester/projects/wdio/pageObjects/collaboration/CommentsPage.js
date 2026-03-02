import BasePage from '../base/BasePage.js';
import Panel from '../common/Panel.js';
import DossierPage from '../dossier/DossierPage.js';

/** Class representing comment panel **/
export default class CommentsPage extends BasePage {
    constructor() {
        super();
        this.panel = new Panel();
        this.dossierPage = new DossierPage();
    }

    // Element locator
    getCollaborationPanelContent() {
        return this.$('.mstrd-DropdownMenu-main');
    }

    getCommentsIcon() {
        return this.$("//*[contains(@class,'icon-tb_comments')]");
    }

    getPublicCommentTab() {
        return this.$('.mstrd-CollabViewSwitch-comments');
    }

    getCommentsPanel() {
        return this.$('.mstrd-CommentDropdownMenuContainer').$('.mstrd-DropdownMenu');
    }

    getCommentsPanelForSaaS() {
        return this.$('.mstrd-DropdownMenu-main');
    }

    getUpgradeButtonInCommentsPanel() {
        return this.getCommentsPanelForSaaS().$('.mstrd-SaasUpgradeButton-button');
    }

    getInputBox() {
        return this.$('.mstrd-CommentInputBox');
    }

    getCommentBox() {
        return this.$('.ContentEditable.mstrd-CommentInputBox-input');
    }

    getEditableInputBox() {
        return this.$('.ContentEditable.mstrd-CommentInputBox-input--active');
    }

    getEditableFilter() {
        return this.$('.mstrd-CommentInputBox-filter');
    }

    getCommentListPanel(text) {
        return this.$(`//div[@class='msg']/span[contains(text(),'${text}')]`);
    }

    getCommentList() {
        return this.$$('.mstrd-CommentList');
    }

    async getMessageCount() {
        return this.$('.mstrd-CommentViewer-msgCount').getText();
    }

    async getAllActiveComments() {
        // Need to filter out deleted comments
        // return this.$(
        //     "//div[@class='mstrd-CommentItem' or @class='mstrd-CommentItem mstrd-NotificationItem--entering']"
        // );
        // await this.waitForElementVisible(this.$('.mstrd-CommentItem'), { timeout: this.DEFAULT_TIMEOUT * 10 });
        return this.$$('.mstrd-CommentItem').filter(async (elem) => {
            const className = await elem.getAttribute('class');
            return className.includes('mstrd-CommentItem--deleted') ? false : true;
        });
    }

    async getCommentByIndex(index) {
        // Need to filter out deleted comments
        const allComments = await this.getAllActiveComments();
        return allComments[index];
    }

    getCommentByName(name) {
        return this.$$('.mstrd-CommentItem').filter(async (elem) => {
            const commentName = await elem.$('.mstrd-CommentItem-msg').getText();
            return commentName === name;
        })[0];
    }

    getCommentsByUser(userName) {
        return this.$$('.mstrd-CommentItem').filter(async (elem) => {
            const mentionedBy = await elem.$('.mstrd-CommentItem-user').$('.mstrd-CommentItem-name').getText();
            return mentionedBy === userName;
        });
    }

    async getMentionedUserName(index) {
        return (await this.getCommentByIndex(index))
            .$('.mstrd-CommentItem-msg')
            .$('.mstrd-Comment-token.mstrd-Comment-user')
            .getText();
    }

    getMentionedComment() {
        return this.$('.mstrd-CommentItem--mention');
    }

    getPostButton() {
        return this.getCommentsPanel().$("//button[contains(text(),'Post')]");
    }

    getDeleteIcon(elem) {
        return elem.$('.mstrd-CommentItem-btnDelete');
    }

    getDeleteButton(elem) {
        // return elem.$("//span[text()='Delete']//preceding::button[not(@disabled)]");
        return elem.$('.mstrd-Button*=Delete');
    }

    getDeleteConfirmationMsg(elem) {
        return elem.$('.mstrd-CommentItem-confirmOverlay');
    }

    getDockIcon() {
        return this.panel.getDockIcon(this.getCommentsPanel());
    }

    getUndockIcon() {
        return this.panel.getUndockIcon(this.getCommentsPanel());
    }

    getDockedPanel() {
        return this.panel.getDockPanel(this.getCommentsPanel());
    }

    getClearInputBoxLink() {
        return this.$(`//div[@class='txt'][text()='Never mind']`);
    }

    getExpandCommentLink() {
        return this.$(`//div[@class='mstrd-CommentItem-more'][text()='... more']`)[0];
    }

    getSuggestionContainer() {
        return this.$('.mstrd-Suggestion');
    }

    getApplyFilterNotification() {
        return this.$('.mstrd-PageNotification-container--filter');
    }

    getTimeStampInComment() {
        return this.$$('.mstrd-CommentItem-time');
    }

    async getErrorMsg() {
        return this.$('.mstrd-MessageBox-msg').getText();
    }

    async clickErrorButton(buttonName) {
        return this.click({ elem: this.getErrorButton(buttonName) });
    }

    /**
     * Retrieve the suggestion item (option: UserName, LoginName, Index)
     * @param {string} option - Options to retrieve the suggestion item
     * @param {string|number} param - Parameter corresponding to the option
     * @returns {Promise.<ElementFinder>} - ElementFinder of the specified suggestion item
     */
    getSuggestionItem(option, param) {
        const className =
            option.toLowerCase() === 'username'
                ? '.mstrd-Suggestion-itemName'
                : option.toLowerCase() === 'loginname'
                ? '.mstrd-Suggestion-itemDesc'
                : option;
        switch (className) {
            case '.mstrd-Suggestion-itemName':
            case '.mstrd-Suggestion-itemDesc':
                return this.$$('.mstrd-Suggestion-item').filter(async (elem) => {
                    const value = await elem.$(`${className}`).getText();
                    return param === value;
                });
            case 'index':
            default:
                return this.$$('.mstrd-Suggestion-item')[param];
        }
    }

    getCloseIcon() {
        return this.panel.getCloseIcon(this.getCommentsPanel());
    }

    getFilterIcon() {
        return this.getInputBox().$('.mstr-nav-icon.icon-filter_tiny');
    }

    getEmbeddedFilter(parentElementFinder) {
        return parentElementFinder.$('.mstrd-CommentItem-filterBtn');
    }

    getFilterCheckBox() {
        return this.$('.mstrd-CommentInputBox-filterCheckbox');
    }

    getcurrentPageSwitcher() {
        return this.$('.mstrd-CommentListSwitch-toggleSwitch');
    }

    async getPageIconInComment(index) {
        return (await this.getCommentByIndex(index))
            .$('.mstrd-CommentItem-pageName')
            .$('.mstrd-CommentItem-pageNameIcon');
    }

    // Action helper
    /**
     * Open the comment panel
     */
    async openCommentsPanel() {
        await this.waitForElementVisible(this.getCommentsIcon(), {
            timeout: 5000,
            msg: 'Comments icon does not exist.',
        });
        // await this.wait(this.EC.presenceOf(this.getCommentsIcon()), 5000, 'Comments icon does not exist.');
        await this.waitForElementEnabled(this.dossierPage.getCommentsIcon(), {
            timeout: 5000,
            msg: 'Comment icon is disabled.',
        });
        // await this.wait(this.$('.mstrd-CommentIcon').isEnabled, 5000, 'Comment icon is disabled.');
        await this.click({ elem: this.getCommentsIcon() });
        await this.waitForElementVisible(this.getCommentsPanel(), {
            timeout: 5000,
            msg: 'Comments panel is not open.',
        });
        // await this.wait(this.EC.presenceOf(this.getCommentsPanel()), 5000, 'Comments panel is not open.');
        return this.sleep(3000);
    }

    async openCommentsPanelForSaaS() {
        await this.waitForElementVisible(this.getCommentsIcon(), {
            timeout: 5000,
            msg: 'Comments icon does not exist.',
        });
        await this.waitForElementClickable(this.getCommentsIcon(), {
            timeout: 5000,
            msg: 'Comments icon is not clickable.',
        });
        await this.getCommentsIcon().click();
        await this.waitForElementVisible(this.getCommentsPanelForSaaS(), {
            timeout: 5000,
            msg: 'Comments panel is not open.',
        });
        // await this.wait(this.EC.presenceOf(this.getCommentsPanel()), 5000, 'Comments panel is not open.');
        return this.sleep(3000);
    }

    async enableInputBox() {
        await this.getCommentBox().click();
        await this.waitForElementVisible(this.getEditableInputBox(), {
            timeout: 4000,
            msg: 'Input box is not editable.',
        });
        // return this.wait(this.EC.presenceOf(this.getEditableInputBox()), 4000, 'Input box is not editable.');
    }

    async clickInputBox() {
        await this.click({ elem: this.getCommentBox() });
        // await this.getCommentBox().click();
        return this.sleep(500);
    }

    async pressEnterInInputBox() {
        // await this.getCommentBox().sendKeys(protractor.Key.ENTER);
        await this.click({ elem: this.getCommentBox() });
        await this.enter();
        return this.sleep(500);
    }

    /**
     * Add comment in the comment editing box
     * @param {string} text - comment
     */
    async addComment(text) {
        await this.click({ elem: this.getCommentBox() });
        await this.waitForElementVisible(this.getEditableInputBox(), {
            timeout: 5000,
            msg: 'Comment input box is not enabled.',
        });
        // await this.wait(this.EC.presenceOf(this.getEditableInputBox()), 5000, 'Comment input box is not enabled.');
        // await this.getCommentBox().sendKeys(text);
        await this.getCommentBox().setValue(text);
        // await this.wait(this.EC.textToBePresentInElement(this.getCommentBox(), `${text}`), 10000, 'Comment is not displayed in the editing box.');
        await this.sleep(2000); // Wait for animation to complete; Wait for suggestion list to show up
        await this.waitForElementEnabled(this.getPostButton(), { timeout: 5000, msg: 'Post button is not enabled.' });
        // await this.wait(this.isPostEnabled(), 5000, 'Post button is not enabled.');
        return this.sleep(1000); // Wait for animation to complete
    }

    async addComment_test(text) {
        await this.click({ elem: this.getCommentBox() });
        await this.waitForElementVisible(this.getEditableInputBox(), {
            timeout: 5000,
            msg: 'Comment input box is not enabled.',
        });
        // await this.wait(this.EC.presenceOf(this.getEditableInputBox()), 5000, 'Comment input box is not enabled.');
        await (await this.getCommentBox()).setValue(text);
        await this.waitForLoadingSuggestionItems();
    }

    async addCommentWithUserMention(text, username, index = 0) {
        await this.click({ elem: this.getCommentBox() });
        await this.waitForElementVisible(this.getEditableInputBox());
        // await this.getCommentBox().sendKeys('@' + username);
        await this.getCommentBox().addValue('@');
        await this.getCommentBox().addValue(username);
        await this.waitForLoadingSuggestionItems();
        await this.selectSuggestionItem(username, index);
        await this.getCommentBox().addValue(text);
        // await this.waitForTextPresentInElementValue(this.getCommentBox(), text);
        await this.sleep(2000); // Wait for animation to complete; Wait for suggestion list to show up
        // await this.wait(this.isPostEnabled(), this.DEFAULT_TIMEOUT, 'Post button is not enabled.');
        let result = await this.getPostButton().isEnabled();
        console.log(result);
        await this.getPostButton().waitForEnabled({
            timeout: this.DEFAULT_TIMEOUT,
            timeoutMsg: 'Post button is not enabled.',
        });
        // await this.waitForElementEnabled(this.getPostButton(), {
        //     timeout: this.DEFAULT_TIMEOUT,
        //     msg: 'Post button is not enabled.',
        // });
        return this.sleep(1000); // Wait for animation to complete
    }

    async addCommentWithFilter(text) {
        await this.click({ elem: this.getCommentBox() });
        await this.waitForElementVisible(this.getEditableInputBox());
        await this.getCommentBox().addValue('@filter');
        await this.waitForLoadingSuggestionItems();
        await this.selectSuggestionItem('filter', 0);
        await this.enter();
        await this.getCommentBox().addValue(text);
        await this.waitForTextPresentInElementValue(this.getCommentBox(), text);
        await this.sleep(2000); // Wait for animation to complete; Wait for suggestion list to show up
        // await this.wait(this.isPostEnabled(), this.DEFAULT_TIMEOUT, 'Post button is not enabled.');
        await this.waitForElementEnabled(this.getPostButton(), {
            timeout: 3 * 1000,
            msg: 'Post button is not enabled.',
        });
        return this.sleep(1000); // Wait for animation to complete
    }

    async postComment() {
        await this.getPostButton().click();
        await this.sleep(2000);
    }

    /**
     * Post and validate comment
     * @param {string} text - comment to be validated
     */
    async postAndValidateComment(text) {
        await this.getPostButton().click();
        await browser.waitUntil(
            async () => {
                const value = await this.getPostButton().getAttribute('class');
                return value.includes('waiting') ? false : true;
            },
            {
                timeout: 5000,
                timeoutMsg: 'Posting a comment takes too long.',
            }
        );

        await this.waitForTextPresentInElementValue(await this.getCommentByIndex(0), text, {
            timeout: 5000,
            msg: 'Comment is not posted in the comment panel.',
        });
        // await browser.waitUntil(this.EC.textToBePresentInElement(this.getCommentByIndex(0), `${text}`), {
        //     timeout: 5000,
        //     timeoutMsg: 'Comment is not posted in the comment panel.',
        // });
        await this.sleep(1000); // animation
    }

    async hoverOnComment(elem) {
        // await this.brwsr.actions().mouseMove(elem).perform();
        // await this.brwsr.actions().mouseUp().perform();
        await this.hover({ elem: elem });
        // return this.wait(this.EC.visibilityOf(this.getDeleteIcon(elem)), 5000, 'Delete icon did not appear.');
        await this.waitForElementVisible(this.getDeleteIcon(), {
            timeout: 5000,
            msg: 'Delete icon did not appear.',
        });
    }

    async hoverOnCommentByIndex(index) {
        return this.hoverOnComment(await this.getCommentByIndex(index));
    }

    async deleteComment(elem) {
        await this.getDeleteIcon(elem).click();
        // await this.wait(this.EC.visibilityOf(this.getDeleteConfirmationMsg(elem)), 5000, 'Delete confirmation message did not appear.');
        await this.waitForElementVisible(await this.getDeleteConfirmationMsg(elem), {
            timeout: 5000,
            msg: 'Delete confirmation message did not appear.',
        });
        await this.getDeleteButton(elem).click();
        return this.sleep(2000);
    }

    async deleteCommentByIndex(index) {
        await this.deleteComment(await this.getCommentByIndex(index));
    }

    async deleteAllCommentsByUser(userName) {
        return (await this.getCommentsByUser(userName)).forEach(async (elem) => {
            await this.hoverOnComment(elem);
            await this.deleteComment();
        });
    }

    async deleteAllComments() {
        let count = (await this.getAllActiveComments()).length;
        while (count > 0) {
            await this.deleteCommentByIndex(0);
            count -= 1;
        }
    }

    async dockCommentPanel() {
        return this.panel.dockPanel(this.getCommentsPanel());
    }

    async undockCommentPanel() {
        return this.panel.undockPanel(this.getCommentsPanel());
    }

    async clickNevermind() {
        await this.getClearInputBoxLink().click();
        await this.waitForElementInvisible(this.getClearInputBoxLink(), {
            timeout: 5000,
            msg: 'Nevermind is still displayed.',
        });
        // await this.wait(this.EC.invisibilityOf(this.getClearInputBoxLink(), 5000, 'Nevermind is still displayed.'));
        return this.sleep(500);
    }

    async clickMoreLink() {
        await this.getExpandCommentLink().click();
        return this.sleep(500);
    }

    // to confirm
    /**
     * Select a suggestion item (option: UserName, LoginName, Index)
     * @param {string} option - Options to retrieve the suggestion item
     * @param {string|number} param - Parameter corresponding to the option
     */
    async selectSuggestionItem(option, param) {
        // await this.brwsr.actions().mouseMove(this.getSuggestionItem(option, param)).perform();
        // await this.brwsr.actions().mouseUp().perform();
        // await this.brwsr.actions().click().perform();
        await this.hover({ elem: this.getSuggestionItem(option, param) });
        await this.clickByForce({ elem: this.getSuggestionItem(option, param) });
        // return this.wait(this.EC.stalenessOf(this.getSuggestionContainer()), 5000, 'Suggestion list container did not get dismissed.');
        await this.waitForElementStaleness(this.getSuggestionContainer(), {
            timeout: 5000,
            msg: 'Suggestion list container did not get dismissed.',
        });
    }

    async waitForLoadingSuggestionItems() {
        await browser.waitUntil(
            async () => {
                let userItem = (await this.getSuggestionContainer().$('.mstrd-CommentInputBox-userItem')).isDisplayed();
                let groupItem = (
                    await this.getSuggestionContainer().$('.mstrd-CommentInputBox-groupItem')
                ).isDisplayed();
                return userItem || groupItem;
            },
            {
                timeout: 5000,
                timeoutMsg: 'Loading suggestion takes too long.',
            }
        );
    }

    async applyEmbeddedFilter(index) {
        await this.getEmbeddedFilter(await this.getCommentByIndex(index)).click();
        await this.sleep(1000);
        await this.waitForElementInvisible(this.dossierPage.getPageLoadingIcon(), {
            timeout: 3000,
            msg: 'Applying filter takes took long.',
        });
        // await this.wait(this.EC.not(this.EC.presenceOf(this.dossierPage.getPageLoadingIcon())), 30000, 'Applying filter takes took long.');
        return this.sleep(2000);
    }

    async applyEmbeddedFilterByName(name) {
        await this.getEmbeddedFilter(this.getCommentByName(name)).click();
        await this.sleep(1000);
        await this.waitForElementInvisible(this.dossierPage.getPageLoadingIcon(), {
            timeout: 3000,
            msg: 'Applying filter takes took long.',
        });
        // await this.wait(this.EC.not(this.EC.presenceOf(this.dossierPage.getPageLoadingIcon())), 30000, 'Applying filter takes took long.');
        return this.sleep(2000);
    }
    /**
    option: close: click close icon to close the panel
    option: other string: click on comment icon to close the panel
     **/
    async closeCommentsPanel(option = 'close') {
        if (option === 'close') {
            await this.panel.closePanel(this.getCommentsPanel());
        } else {
            await this.click({ elem: this.getCommentsIcon() });
        }
    }

    async closeCommentsPanelForSaaS(option = 'close') {
        if (option === 'close') {
            await this.panel.closePanel(this.getCommentsPanelForSaaS());
        } else {
            await this.click({ elem: this.getCommentsIcon() });
        }
    }

    async clickFilterIcon() {
        await this.getFilterIcon().click();
        await this.waitForElementVisible(
            this.getEmbeddedFilter(this.getEditableInputBox(), {
                timeout: 5000,
                msg: 'Embedded filter is not added into the input box.',
            })
        );
    }

    async waitForMentionedCommentPresent() {
        await this.waitForElementVisible(this.getMentionedComment(), {
            timeout: 5000,
            msg: 'No mentioned comment showing up or it takes too long to show up.',
        });
    }

    async checkFilter() {
        await this.getFilterCheckBox().click();
        await browser.waitUntil(
            async () => {
                let result = await this.isFilterChecked();
                return result;
            },
            {
                timeout: this.DEFAULT_TIMEOUT,
                timeoutMsg: 'Filter checked time out.',
            }
        );
        // return this.wait(this.isFilterChecked(), this.DEFAULT_TIMEOUT);
    }

    async switchCurrentPage(mode) {
        await this.getcurrentPageSwitcher().click();
        switch (mode) {
            case mode.toLowerCase == 'off':
                return browser.waitUntil(
                    async () => {
                        return !(await this.isCurrentPageSwitched());
                    },
                    {
                        timeout: this.DEFAULT_TIMEOUT,
                        timeoutMsg: 'Switch Page toggle off time out',
                    }
                );
            // return this.wait(!this.isCurrentPageSwitched(), this.DEFAULT_TIMEOUT);
            default:
                return browser.waitUntil(
                    async () => {
                        return await this.isCurrentPageSwitched();
                    },
                    {
                        timeout: this.DEFAULT_TIMEOUT,
                        timeoutMsg: 'Switch Page on time out',
                    }
                );
            // return this.wait(this.isCurrentPageSwitched(), this.DEFAULT_TIMEOUT);
        }
    }

    async clickOnPageIconInComment(index) {
        await (await this.getPageIconInComment(index)).click();
        return this.dossierPage.waitForPageLoading();
    }

    // Assertion helper
    async isPanelOpen() {
        return this.getCommentsPanel().isDisplayed();
    }

    async isCommentIconPresent() {
        return this.getCommentsIcon().isDisplayed();
    }

    async isCommentIconDisabled() {
        const elemColor = await this.getCommentsIcon().getCSSProperty('color');
        const value = elemColor.value;
        return value === 'rgba(182,182,182,1)';
        //return this.isAriaDisabled(this.getCommentsIcon());
    }

    async isPublicCommentTabPresent() {
        return this.getPublicCommentTab().isDisplayed();
    }

    async isFilterIconPresent() {
        return this.getFilterIcon().isDisplayed();
    }

    async isApplyEmbedFilterDisabled() {
        return this.$$('.mstrd-Comment-filter.mstr-nav-icon.icon-filter_tiny.disabled')[0].isDisplayed();
    }

    async isFilterApplied() {
        return this.getApplyFilterNotification().isDisplayed();
    }

    async isFilterAdded(index) {
        return this.getEmbeddedFilter(await this.getCommentByIndex(index)).isDisplayed();
    }

    async isDockIconDisplayed() {
        return this.panel.isDockIconDisplayed(this.getCommentsPanel());
    }

    async isUndockIconDisplayed() {
        return this.panel.isUndockIconDisplayed(this.getCommentsPanel());
    }

    async isDocked() {
        return this.panel.isPanelDocked(this.$('.mstrd-CommentDropdownMenuContainer'));
    }

    async isLeftDocked() {
        return this.panel.isLeftDocked(this.getCommentsPanel());
    }

    async isRightDocked() {
        return this.panel.isRightDocked(this.getCommentsPanel());
    }

    async isPanelCloseIconDisplayed() {
        return this.panel.isPanelCloseIconDisplayed(this.getCommentsPanel());
    }

    /**
     * Get the comment at specific index (order)
     * @param {number} index - order of the comment
     * @returns {Promise} Promise which contains the comment at specific index
     */
    async comment(index) {
        return (await this.getCommentByIndex(index)).$('.mstrd-CommentItem-msg').getText();
    }

    async commentInput() {
        return this.getCommentBox().getText();
    }

    async isPostEnabled() {
        return this.getPostButton().isEnabled();
    }

    async isCommentPresent(index) {
        return await this.getCommentByIndex(index).isDisplayed();
    }

    async isCommentMentioned(index) {
        const className = await this.getCommentByIndex(index).getAttribute('class');
        return className.includes('mstrd-CommentItem--mention mstrd-CommentItem--blink') ? true : false;
    }

    // async isUserMentioned(username, mentionedBy) {
    //     let userMentioned = false;
    //     await this.$$('.mstrd-CommentItem')
    //         .each(async(elem) => {
    //             const userText = await elem.$('.mstrd-CommentItem-msg').$('.mstrd-Comment-token.mstrd-Comment-user').getText();
    //             const mentionedByText = await elem.$('.mstrd-CommentItem-user').$('.mstrd-CommentItem-name').getText();
    //             if (userText === username && mentionedByText === mentionedBy) {
    //                 userMentioned = true;
    //             }
    //         });
    //     return userMentioned;
    // }

    async isUserMentionedTxT(username, comment, index) {
        let userMentioned = false;
        const userName = '@' + username;
        const commentCompare = '@' + username + ' ' + comment;
        const userText = await this.getMentionedUserName(index);
        const commentText = await this.comment(index);
        if (userText === userName && commentText === commentCompare) {
            userMentioned = true;
        }
        return userMentioned;
    }

    async isUserMentioned(username, index) {
        let userMentioned = false;
        const userName = '@' + username;
        const userText = await this.getMentionedUserName(index);
        if (userText === userName) {
            userMentioned = true;
        }
        return userMentioned;
    }

    async suggestionItemByIndex(index) {
        return this.getSuggestionItem('Index', index).getText();
    }

    async suggestionItemName(index) {
        return this.getSuggestionItem('Index', index).$('.mstrd-Suggestion-itemName').getText();
    }

    async suggestionItemDesc(index) {
        return this.getSuggestionItem('Index', index).$('.mstrd-Suggestion-itemDesc').getText();
    }

    async suggestionItemUserInitials(index) {
        return this.getSuggestionItem('Index', index).$('.mstrd-CommentInputBox-userInitials').getText();
    }

    async suggestionItemUserName(index) {
        return this.getSuggestionItem('Index', index).$('.mstrd-CommentInputBox-userFullName').getText();
    }

    async suggestionItemUserLogin(index) {
        return this.getSuggestionItem('Index', index).$('.mstrd-CommentInputBox-userLoginName').getText();
    }

    // Find the number of highlighted match patterns in suggestion item: both login and name should be searchable
    async matchCount() {
        return this.$$('.hlite').length;
    }

    async isFilterChecked() {
        return (await this.getFilterCheckBox()).$("//span[@role='checkbox']").getAttribute('aria-checked');
    }

    async isCurrentPageSwitched() {
        return this.getcurrentPageSwitcher().getAttribute('aria-pressed');
    }

    async addCommentWithEmbeddedFilter(text) {
        await this.click({ elem: this.getCommentBox() });
        await this.waitForElementVisible(this.getEditableInputBox());
        await this.getCommentBox().addValue(text);
        await this.waitForTextPresentInElementValue(this.getCommentBox(), text);
        await this.checkFilter();
        await this.sleep(2000); // Wait for animation to complete; Wait for suggestion list to show up
        await this.waitForElementVisible(this.isPostEnabled(), {
            timeout: this.DEFAULT_TIMEOUT,
            msg: 'Post button is not enabled.',
        });
        return this.sleep(1000); // Wait for animation to complete
    }

    async clickUpgradeButtonInCommentsPanel() {
        await this.click({ elem: this.getUpgradeButtonInCommentsPanel() });
    }

    async isCommentPresentByName(name) {
        return this.getCommentByName(name).isDisplayed();
    }

    async hideTimeStampInComment() {
        const count = await this.getTimeStampInComment().length;
        for (let i = 0; i < count; i++) {
            let el = this.getTimeStampInComment()[i];
            await this.hideElement(el);
        }
    }

    async waitForCommentPanelPresent() {
        await this.waitForElementVisible(await this.getCommentsPanel());
    }

    async isCommentsPanelForSaaSPresent() {
        return this.getCommentsPanelForSaaS().isDisplayed();
    }

    async isUpgradeButtonInCommentsPanelPresent() {
        return this.getUpgradeButtonInCommentsPanel().isDisplayed();
    }
}
