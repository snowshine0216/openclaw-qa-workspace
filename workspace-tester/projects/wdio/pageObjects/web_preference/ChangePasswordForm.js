import BaseComponent from '../base/BaseComponent.js';

/**
 * You can open this in following scenarios:
 * Prefereces > Change Password
 */
export default class ChangePasswordForm extends BaseComponent {
    constructor() {
        super('#mstrWeb_content', 'Create Change Password form');
    }

    // Assersion helper

    async getSuccessMessage() {
        const elm = this.getElement().$$('.message div')[0];
        await this.waitForElementVisible(elm);
        return elm.getText();
    }

    // Action helper

    async inputOldPassword(oldPassword) {
        const elm = this.getElement().$('input[name="Pwd"]');
        await this.click({ elem: elm });
        await this.clear({ elem: elm });
        await elm.setValue(oldPassword);
    }

    async inputNewPassword(newPassword) {
        const elm = this.getElement().$('input[name="newPwd"]');
        await this.click({ elem: elm });
        await this.clear({ elem: elm });
        await elm.setValue(newPassword);
    }

    async inputNewPasswordVerification(newPassword) {
        const elm = this.getElement().$('input[name="checkPwd"]');
        await this.click({ elem: elm });
        await this.clear({ elem: elm });
        await elm.setValue(newPassword);
    }

    async clickChangePassword() {
        const elm = this.getElement().$('input[name="ChangePwd"]');
        await this.click({ elem: elm });
    }

    async clickCancel() {
        const elm = this.getElement().$('input[name="mstrForm"]');
        await this.click({ elem: elm });
    }

    /**
     * The button shown when change password sucessfully
     */
    async clickContinue() {
        const elm = this.getElement().$('.message a');
        await this.click({ elem: elm });
    }
}
