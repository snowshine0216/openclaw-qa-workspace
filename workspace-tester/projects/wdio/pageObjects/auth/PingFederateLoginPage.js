import BasePage from '../base/BasePage.js';

export default class PingFederateLoginPage extends BasePage {
    // Element locators
    getPingHeader() {
        return this.$('.ping-header');
    }

    getSelectAuthenticationSystem() {
        return this.$('select[name="pfidpadapterid"]');
    }

    getContinueButton() {
        return this.$('input[type="submit"]');
    }

    getUsernameInput() {
        return this.$('#username');
    }

    getPasswordInput() {
        return this.$('#password');
    }

    getSignOnButton() {
        return this.$('#signOnButton');
    }

    getWrongPwError() {
        return this.$('.ping-error');
    }

    getLoginButton() {
        return this.$('.icon-name.trusted-name');
    }

    // Action helpers
    async clickTrustLoginButton() {
        await this.waitForElementVisible(this.getLoginButton());
        await this.getLoginButton().click();
    }

    async selectDropDown(select, value) {
        await select.$('option[value="' + value + '"]').click();
    }

    async login(username, password) {
        await this.waitForElementVisible(this.getPingHeader());
        let title = await this.getPingHeader().getText();
        if (title == 'Select Authentication System') {
            await this.selectDropDown(this.getSelectAuthenticationSystem(), 'ad..MSTR');
            await this.getContinueButton().click();
            //await this.waitForTextPresentInElement(this.getPingHeader(), 'Sign On');
            await this.waitForElementVisible(this.getPingHeader(), 'Sign On');
        }
        await this.clear({ elem: this.getUsernameInput() });
        await this.getUsernameInput().setValue(username);
        await this.clear({ elem: this.getPasswordInput() });
        await this.getPasswordInput().setValue(password);
        await this.getSignOnButton().click();
    }

    async wrongPwError() {
        return this.getWrongPwError().getText();
    }

    async getLoginPageTitle() {
        await this.waitForElementVisible(this.getPingHeader());
        return this.getPingHeader().getText();
    }

    async isErrorPresent() {
        return this.getWrongPwError().isDisplayed();
    }

    async isPingHeaderPresent() {
        return this.getPingHeader().isDisplayed();
    }
}
