import BasePage from '../base/BasePage.js';
import LoginPage from './LoginPage.js';

export default class ChangePasswordPage extends BasePage {
    constructor() {
        super();
        this.loginPage = new LoginPage();
    }

    // element locator

    getChangePwdContainer() {
        return this.$('#changePwdButton');
    }

    getOldPasswordForm() {
        return this.$(`input.form-control[id='oldPassword']`);
    }

    getNewPasswordForm() {
        return this.$(`input.form-control[id='newPassword']`);
    }

    getConfirmPasswordForm() {
        return this.$(`input.form-control[id='confirmNewPassword']`);
    }

    getDoneButton() {
        return this.$('#changePwdButton');
    }

    getDoneButtonDisabled() {
        return this.$('#changePwdButton.disabledLogin');
    }

    getChangePasswordErrorBox() {
        return this.$('.mstrd-MessageBox-main');
    }

    getChangePasswordErrorButton() {
        return this.getChangePasswordErrorBox().$('.mstrd-ActionLinkContainer span');
    }

    getChangePasswordLoading() {
        return this.$('.loading-spinner');
    }

    getChangePwdFooter() {
        return this.$('#changePwdFooter');
    }

    // action helper

    async waitForChangePwdView() {
        await this.waitForElementVisible(this.getChangePwdContainer(), {
            msg: 'Change Password page was not displayed.',
        });
        await this.sleep(3000);
    }

    async changePasswordWithInvalidCredentials() {
        await this.getOldPasswordForm().setValue('invalidOldPassword');
        await this.getNewPasswordForm().setValue('newPassword');
        await this.getConfirmPasswordForm().setValue('newPassword');
        await this.getDoneButton().click();
        await this.waitForElementVisible(this.getChangePasswordErrorBox(), {
            msg: 'Change Password error msg box was not displayed.',
        });
    }

    async dismissChangePasswordErrorMessage() {
        await this.clickAndNoWait({ elem: this.getChangePasswordErrorButton() });
        return this.waitForElementInvisible(this.getChangePasswordErrorBox());
    }

    async clearPasswordForm() {
        await this.clear({ elem: this.getOldPasswordForm() });
        await this.clear({ elem: this.getNewPasswordForm() });
        await this.clear({ elem: this.getConfirmPasswordForm() });
        return this.sleep(1000);
    }

    async login(credentials = { username: '', password: '' }) {
        await this.loginPage.getUsernameForm().setValue(credentials.username);
        await this.loginPage.getPasswordForm().setValue(credentials.password);
        await this.loginPage.getLoginButton().click();
        await this.waitForChangePwdView();
    }

    async enterPassword(oldPassword, newPassword, confirmPassword) {
        await this.getOldPasswordForm().setValue(oldPassword);
        await this.getNewPasswordForm().setValue(newPassword);
        await this.getConfirmPasswordForm().setValue(confirmPassword);
        return this.sleep(1000);
    }

    async changePassword(oldPassword, newPassword, confirmPassword) {
        await this.enterPassword(oldPassword, newPassword, confirmPassword);

        // Randomly select change password method (Click vs. ENTER)
        if (Math.random() < 0.5) {
            await this.getDoneButton().click();
        } else {
            await this.enter();
        }
        await this.sleep(500);

        const isErrorBoxPresent = await this.getChangePasswordErrorBox().isDisplayed();
        if (isErrorBoxPresent) {
            const isChangePasswordErrorBoxDisplayed = await this.isChangePasswordErrorBoxDisplayed();
            if (isChangePasswordErrorBoxDisplayed) {
                const msg = await this.changePasswordErrorMsg();
                console.log(`Change Password Failure: ${msg}`);
            }
        }

        await this.waitForElementStaleness(this.getChangePasswordLoading());
    }

    async changePasswordFinished() {
        await this.waitForElementInvisible(this.getChangePwdContainer(), {
            msg: 'Change Password page is still displayed.',
        });
    }

    // assertion helper

    async isDoneButtonClickable() {
        return !this.getDoneButtonDisabled().isDisplayed();
    }

    async changePasswordErrorMsg() {
        return this.getChangePasswordErrorBox().$('.mstrd-MessageBox-msg').getText();
    }

    async isChangePasswordErrorBoxDisplayed() {
        return this.getChangePasswordErrorBox().isDisplayed();
    }

    async isChangePasswordDisplayed() {
        return this.getChangePwdContainer().isDisplayed();
    }

    async getChangePwdFooterText() {
        return (await this.getChangePwdFooter()).getText();
    }
}
