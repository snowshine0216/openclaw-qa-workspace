import BasePage from '../base/BasePage.js';

export default class SiteMinderLoginPage extends BasePage {
    // Element locators

    getUsernameInput() {
        return this.$(`input[name="USER"]`);
    }

    getPasswordInput() {
        return this.$('input[type="password"]');
    }

    getLoginButton() {
        return this.$('input[type="button"]');
    }

    // Action helpers
    async login(username, password) {
        await this.waitForElementVisible(this.getUsernameInput());
        await this.clear({ elem: this.getUsernameInput() });
        await this.getUsernameInput().setValue(username);
        await this.clear({ elem: this.getPasswordInput() });
        await this.getPasswordInput().setValue(password);
        await this.getLoginButton().click();
    }

    // Assertion helpers
}
