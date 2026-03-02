import BasePage from '../base/BasePage.js';

export default class KeycloakLoginPage extends BasePage {
    // Element locators
    getContinueButton() {
        return this.$('button[id="proceed-button"]');
    }

    getUsername() {
        return this.$('input[name="username"]');
    }

    getPassword() {
        return this.$('input[name="password"]');
    }

    getSignInButton() {
        return this.$('input[value="Sign In"]');
    }

    // Action helpers
    async login(username, password) {
        await this.sleep(1000);
        await this.getUsername().setValue(username);
        await this.getPassword().setValue(password);
        await this.click({ elem: this.getSignInButton() });
        return this.sleep(1000);
    }

    async safeContinueKeycloakLogin() {
        await this.sleep(1000);
        const url = await this.currentURL();
        if (url.indexOf('myrealm') >= 0) {
            if (this.getContinueButton().isDisplayed()) {
                await this.click({ elem: this.getContinueButton() });
            }
        }
    }
}
