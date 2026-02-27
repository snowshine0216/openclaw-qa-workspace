import BasePage from '../base/BasePage.js';

export default class WarningDialog extends BasePage {
    // Element locator
    getConfirmWarningDialog() {
        return this.$('.mstrmojo-Editor.mstrmojo-ConfirmSave-Editor.modal');
    }

    getDialogTitle() {
        return this.getConfirmWarningDialog().$('.mstrmojo-Editor-title').getText();
    }

    getConfirmWarningContent() {
        return this.getConfirmWarningDialog().$('.mstrmojo-Editor-content');
    }

    getDialogMessageTitle() {
        return this.getConfirmWarningDialog().$('.mstrmojo-Label.messageTitle').getText();
    }

    getDialogMessageCertificationInfo() {
        return this.getConfirmWarningDialog().$('.mstrmojo-Label.messageCertificationInfo').getText();
    }

    getCertifyCheckBox() {
        return this.getConfirmWarningContent().$('.mstrmojo-CheckBox.mstrmojo-certify-checkbox');
    }

    getConfirmWarningButtons() {
        return this.getConfirmWarningDialog().$('.mstrmojo-Editor-buttons');
    }

    getSaveButton() {
        return this.getConfirmWarningButtons().$('[aria-label="Save"]');
    }

    getDoNotSaveButton() {
        return this.getConfirmWarningButtons().$('[aria-label="Don&#39;t Save"]');
    }

    getCancelButton() {
        return this.getConfirmWarningButtons().$('[aria-label="Cancel"]');
    }

    getSaveSuccessMessageBox() {
        return this.$('.ant-message-notice');
    }

    getCloseButtonOnSaveSuccessMessageBox() {
        return this.getSaveSuccessMessageBox().$('.mstrd-Message-closeButton');
    }

    // Action helper
    async confirmSave(expSuccess = true) {
        await this.waitForElementVisible(this.getSaveButton());
        await this.click({ elem: this.getSaveButton() });
        await this.waitForElementInvisible(this.getConfirmWarningDialog());
        // quite unstable to wait for the save succuess tooltip
        // if (expSuccess) {
        //     await this.waitForElementVisible(this.getSaveSuccessMessageBox());
        //     await this.waitForElementStaleness(this.getSaveSuccessMessageBox());
        // }
        await this.waitForElementStaleness(this.getPageLoading());
    }

    async confirmDoNotSave() {
        await this.waitForElementVisible(this.getDoNotSaveButton());
        await this.click({ elem: this.getDoNotSaveButton() });
        await this.waitForElementInvisible(this.getConfirmWarningDialog());
        await this.waitForElementStaleness(this.getPageLoading());
    }

    async confirmCancel() {
        await this.waitForElementVisible(this.getCancelButton());
        await this.click({ elem: this.getCancelButton() });
        return this.waitForElementInvisible(this.getConfirmWarningDialog());
    }

    async checkCertifyCheckbox() {
        await this.waitForElementVisible(this.getCertifyCheckBox());
        await this.click({ elem: this.getCertifyCheckBox() });
    }

    // Assertion helper
    async isCertifyCheckboxPresent() {
        return this.getCertifyCheckBox().isDisplayed();
    }

    async isCertifyCheckboxChecked() {
        const isChecked = await this.getCertifyCheckBox().getAttribute('aria-checked');
        return isChecked === 'true';
    }

    async isDoNotSaveButtonPresent() {
        return this.getDoNotSaveButton().isDisplayed();
    }
}
