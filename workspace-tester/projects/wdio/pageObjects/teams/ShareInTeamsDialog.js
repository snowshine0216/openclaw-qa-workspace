import BasePage from '../base/BasePage.js';

export default class ShareInTeamsDialog extends BasePage {
    constructor() {
        super();
    }

    getShareInTeamsDialog() {
        return this.$('.ui-dialog[role="dialog"]');
    }

    getReceipientInputBox() {
        return this.$('input.ui-box');
    }

    getReceipient(receipientName) {
        return this.$(`[aria-label="${receipientName}"]`);
    }

    getMessageInputBox() {
        return this.$('p br');
    }

    getShareButtonInShareInTeamsDialog() {
        return this.$('[data-tid="share-form-submit-button"]');
    }

    getViewButtonInShareSuccessfullyDialog() {
        return this.$('[data-tid="share-form-sent-page-deep-link"]');
    }

    async shareToReceipientInTeams({ receipient: receipientName, text: text }) {
        if (await this.$(`li[aria-label='${receipientName}']`).isDisplayed()) {
            await this.click({ elem: this.$(`li[aria-label='${receipientName}']`) });
        } else {
            await this.getReceipientInputBox().addValue(receipientName);
            // sometimes user name not render
            const userName = await this.$(`li[aria-label='${receipientName}']`).isDisplayed();
            if (userName) {
                await this.click({ elem: userName });
            } else {
                await this.click({ elem: this.$('.ui-box.ui-dropdown__item__image') });
            }
        }
        await this.getMessageInputBox().addValue(text);
        await this.click({ elem: this.getShareButtonInShareInTeamsDialog() });
        await this.waitForElementInvisible(this.getShareButtonInShareInTeamsDialog());
        console.log('share button disappears');
        await this.waitForElementVisible(this.getViewButtonInShareSuccessfullyDialog());
        console.log('view button appears');
    }

    async viewSharedMessage() {
        await this.click({ elem: this.getViewButtonInShareSuccessfullyDialog() });
        await this.sleep(1000);
    }
}
