import BasePage from '../base/BasePage.js';

export default class OktaLoginPage extends BasePage {
    // Element locators
    getOktaUsername() {
        return this.$('input[name="identifier"]');
    }

    getNextButton() {
        return this.$('input[type="submit"][value="Next"]');
    }

    getOktaPassword() {
        return this.$('input[name="credentials.passcode"]');
    }

    getVerifyButton() {
        return this.$('input[type="submit"][value="Verify"]');
    }

    getOktaSigninButton() {
        return this.$('#okta-signin-submit');
    }

    getOktaErrorMessage() {
        return this.$("div[class='okta-form-infobox-error infobox infobox-error']>p");
    }

    getLoginErrorBox() {
        return $('.okta-form-infobox-error');
    }

    async oktaWrongPwError() {
        return this.getOktaErrorMessage().getText();
    }

    async isOktaUsernameDisplayed() {
        return this.getOktaUsername().isDisplayed();
    }

    async oktaLogin(credentials = { username: '', password: '' }) {
        await this.basicOktaLogin(credentials);
        await this.sleep(this.DEFAULT_LOADING_TIMEOUT / 10);
        const url = await this.currentURL();
        if (url.indexOf('MicroStrategy') >= 0) {
            console.log('login success');
            await this.waitForLibraryLoading();
        } else {
            console.log('login fail');
        }
        return this.sleep(1000);
    }
    async basicOktaLogin(credentials = { username: '', password: '' }) {
        // adapt to okta login in library or in teams library
        await this.waitForElementVisible(this.getOktaUsername());
        await this.clear({ elem: this.getOktaUsername() });
        await this.getOktaUsername().setValue(credentials.username);
        await this.clickAndNoWait({ elem: this.getNextButton() });
        await this.waitForElementVisible(this.getOktaPassword());
        await this.clear({ elem: this.getOktaPassword() });
        await this.getOktaPassword().setValue(credentials.password);
        await this.clickAndNoWait({ elem: this.getVerifyButton() });
    }

    async isInvalidCredentials() {
        return this.getLoginErrorBox().isDisplayed();
    }
}
