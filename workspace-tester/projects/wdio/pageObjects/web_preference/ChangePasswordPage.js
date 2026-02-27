import BasePreference from './BasePreference.js';

export default class ChangePWD extends BasePreference {
    // Element locator
    getOldPasswordInputBox() {
        return this.$('input[name="Pwd"]');
    }

    getNewPasswordInputBox() {
        return this.$('input[name="newPwd"]');
    }

    getNewPasswordVerificationInputBox() {
        return this.$('input[name="checkPwd"]');
    }

    getChangePasswordBtn() {
        return this.$('input[name="ChangePwd"]');
    }

    getCancelBtn() {
        return this.$('input[name="mstrForm"]');
    }

    getSuccessMessage() {
        return this.$('.message');
    }

    getErrorMessage() {
        return this.$('.mstrAlertMessage');
    }

    getContinueBtn() {
        return this.getSuccessMessage()
            .$$('.mstrLink')
            .filter(async (elem) => {
                const text = await elem.getText();
                return text === 'Continue';
            })[0];
    }

    getChangePasswordLink() {
        return this.$$('.mstrLink').filter(async (elem) => {
            const text = await elem.getText();
            return text === 'Change Password';
        })[0];
    }

    // Action helper

    async openChangePasswordPage() {
        await this.click({ elem: this.getChangePasswordLink() });
        return this.waitForElementVisible(this.getOldPasswordInputBox());
    }

    async inputOldPassword(oldPassword) {
        await this.waitForElementVisible(this.getOldPasswordInputBox());
        await this.click({ elem: this.getOldPasswordInputBox() });
        await this.clear({ elem: this.getOldPasswordInputBox() });
        await this.getOldPasswordInputBox().setValue(oldPassword);
    }

    async inputNewPassword(newPassword) {
        await this.waitForElementVisible(this.getNewPasswordInputBox());
        await this.click({ elem: this.getNewPasswordInputBox() });
        await this.clear({ elem: this.getNewPasswordInputBox() });
        await this.getNewPasswordInputBox().setValue(newPassword);
    }

    async inputNewPasswordVerification(newPassword) {
        await this.waitForElementVisible(this.getNewPasswordVerificationInputBox());
        await this.click({ elem: this.getNewPasswordVerificationInputBox() });
        await this.clear({ elem: this.getNewPasswordVerificationInputBox() });
        await this.getNewPasswordVerificationInputBox().setValue(newPassword);
    }

    async clickChangePassword() {
        await this.click({ elem: this.getChangePasswordBtn() });
    }

    async clickCancel() {
        await this.click({ elem: this.getCancelBtn() });
    }

    async changePassword(oldPassword, newPassword) {
        await this.inputOldPassword(oldPassword);
        await this.inputNewPassword(newPassword);
        await this.inputNewPasswordVerification(newPassword);
        await this.clickChangePassword();
        await this.waitForElementVisible(this.getSuccessMessage());
    }

    async changePasswordWithError(oldPassword, newPassword) {
        await this.inputOldPassword(oldPassword);
        await this.inputNewPassword(newPassword);
        await this.inputNewPasswordVerification(newPassword);
        await this.clickChangePassword();
    }

    async clickContinue() {
        await this.click({ elem: this.getContinueBtn() });
    }

    // assersion helper
    async getSuccessMessageText() {
        await this.waitForElementVisible(this.getSuccessMessage());
        return this.getSuccessMessage().getText();
    }

    async getErrorMessageText() {
        await this.waitForElementVisible(this.getErrorMessage());
        return this.getErrorMessage().getText();
    }
}
