import { Key } from 'webdriverio';
import ShareDossierDialog from '../dossier/ShareDossierDialog.js';

export default class SaaSShareDialog extends ShareDossierDialog {
    constructor() {
        super();
    }
    // Element locators
    getSaasShareDialog() {
        return this.$('.mstrd-ShareDossierContainer-main');
    }
    getSaaSRecipientInput() {
        return this.getSaasShareDialog().$('.mstrd-RecipientSearchSection-input');
    }
    getChangeACLButton() {
        return this.getSaasShareDialog().$('.mstrd-RecipientSearchSection-aclDropdown');
    }
    getSaasShareDialogErrMsg() {
        return this.getSaasShareDialog().$('.mstrd-ShareDossierContainer-error-msg');
    }
    getRecipientByArialLabel(label) {
        return this.getSaasShareDialog()
            .$$('.mstrd-RecipientCapsule')
            .filter(async (elem) => {
                // Filter out empty dossier containers
                const elemAriaLabel = await elem.getText();
                return elemAriaLabel == label;
            })[0];
    }
    getRemoveRecipientIcon(label) {
        return this.getRecipientByArialLabel(label).$('.icon-pnl_delete-capsule');
    }
    getShareButton() {
        return this.getSaasShareDialog().$('.mstrd-ShareDossierContainer-shareBtn');
    }
    getCopyButton() {
        return this.getSaasShareDialog().$('.mstrd-LinkSection-copyBtn');
    }
    getRecipientTooltip() {
        return this.$('.ant-tooltip-inner');
    }

    getShareErrorBox() {
        return this.$('.mstrd-MessageBox-main');
    }

    async getShareErrorTitle() {
        return this.getShareErrorBox().$('.mstrd-MessageBox-title').getText();
    }

    async getShareErrorMsg() {
        return this.getShareErrorBox().$('.mstrd-MessageBox-msg').getText();
    }

    getShareErrorBoxButton() {
        return this.getShareErrorBox().$('.mstrd-ActionLinkContainer[role="button"]');
    }

    async getErrorMsg() {
        return this.getSaasShareDialogErrMsg().getText();
    }
    async getRecipientTooltipMsg() {
        await this.waitForElementVisible(this.getRecipientTooltip());
        return this.getRecipientTooltip().getText();
    }
    async getLink() {
        return this.getSaasShareDialog().$('.mstrd-LinkSection-link').getText();
    }
    async getCopyButtonText() {
        return this.getSaasShareDialog().$('.mstrd-LinkSection-copyBtn span').getText();
    }
    async getChangeACLInSaasShare() {
        return this.getSaasShareDialog().$('.mstrd-RecipientSearchSection-canView').getValue();
    }
    async getSaasShareDialogErrMsgTxt() {
        return this.getSaasShareDialog().$('.mstrd-ShareDossierContainer-error-msg').getValue();
    }
    async getRecipientList() {
        const recipients = await this.getSaasShareDialog().$$('.mstrd-RecipientCapsule');
        const recipientLabels = recipients.map((element) => element.getAttribute('aria-label'));
        return recipientLabels.join(',');
    }

    // Action helpers
    async inputRecipient(inputValue, isClear = false) {
        await this.waitForElementVisible(this.getSaasShareDialog());
        await this.click({ elem: this.getSaaSRecipientInput() });
        if (isClear) {
            await this.getSaaSRecipientInput().clearValue();
        }
        await this.getSaaSRecipientInput().setValue(inputValue);
    }
    async pasteRecipient(inputValue, isClear = false) {
        await this.waitForElementVisible(this.getSaasShareDialog());
        await this.click({ elem: this.getSaaSRecipientInput() });
        if (isClear) {
            await this.getSaaSRecipientInput().clearValue();
        }
        //copy input Value into clipboard
        await browser.executeAsync((text, done) => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                done(null, 'Copy successful');
            } catch (error) {
                done(error.message);
            } finally {
                document.body.removeChild(textarea);
            }
        }, inputValue);
        await this.click({ elem: this.getSaaSRecipientInput() });
        if (process.platform === 'darwin') {
            await browser.keys([Key.Command, 'v']);
        } else {
            await browser.keys([Key.Ctrl, 'v']);
        }
    }

    async removeRecipient(recipient) {
        return this.getRemoveRecipientIcon(recipient).click();
    }
    async closeShareDialog() {
        await this.getCloseButton().click();
    }
    async selectBookmark(bookmarkList) {
        await this.includeBookmark();
        await this.openBMList();
        await this.selectSharedBookmark(bookmarkList);
        await this.closeShareBookmarkDropDown();
    }
    async hoverRecipient(recipient) {
        await this.click({ elem: this.getSaaSRecipientInput() });
        await this.getRecipientByArialLabel(recipient).moveTo();
    }
    async doubleClickRecipient(recipient) {
        await this.click({ elem: this.getSaaSRecipientInput() });
        await this.doubleClick({ elem: this.getRecipientByArialLabel(recipient) });
    }
    async saasShare(checkSuccess = true) {
        await this.click({ elem: this.getShareButton() });
        if (checkSuccess) {
            await this.waitForElementInvisible(this.getSaasShareDialog());
        }
    }

    // Assertion helpers
    async isErrorMsgPresent() {
        return this.getSaasShareDialogErrMsg().isDisplayed();
    }
    async isRecipientPresent(recipient) {
        return this.getRecipientByArialLabel(recipient).isDisplayed();
    }
    async isShareButtonEnabled() {
        return this.getShareButton().isEnabled();
    }
    async closeShareErrorBox() {
        await this.getShareErrorBoxButton().click();
    }
}
