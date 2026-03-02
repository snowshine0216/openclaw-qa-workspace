import BasePage from '../base/BasePage.js';

export default class AzureLoginPage extends BasePage {
    // Element locators
    getAzureEmail() {
        return this.$('input[name="loginfmt"]');
    }

    getConfirmButton() {
        return this.$('input[type="submit"]');
    }

    getCredentialBox() {
        return this.$('#lightbox');
    }

    getLeftRowButton() {
        return this.$('.slick-pre');
    }

    getRightRowButton() {
        return this.$('.slick-next');
    }

    getUsername() {
        return this.$('input[name="usher_userid"]');
    }

    // used for badge login
    getPassword() {
        return this.$('input[name="usher_password"]');
    }

    // used for password login
    getPasswordInput() {
        return this.$('input[name="passwd"]');
    }

    getLoginButton() {
        return this.$('#login-credential-button');
    }

    getLoginMessage() {
        return this.$('#credential-warning');
    }

    getEmptyPwError() {
        return this.$('#passwordError');
    }

    getWrongPwError() {
        return this.$('#passwordError');
    }

    getUserAnotherAccount() {
        return this.$('#otherTile');
    }

    getSignInWithAnotherAccount() {
        return this.$('a[text()="Sign in with another account"]');
    }

    getExistingUserAccount(email) {
        return this.$('div[data-test-id="' + email + '"]');
    }
    getUsingUserAccountInEnterPasswordPage() {
        return this.$('#displayName');
    }

    getMSLogo() {
        return this.$('.logo');
    }

    getNextButton() {
        return this.$('input[type="submit"][value="Next"]');
    }

    getSkipButton() {
        return this.$('//button[text()="Skip setup"]');
    }

    getYesButton() {
        return this.$('input[type="submit"][value="Yes"]');
    }

    // Action helpers
    async clickMSLogo() {
        await this.click({ elem: this.getMSLogo() });
    }

    async clickYesButton() {
        await this.waitForElementVisible(this.getYesButton());
        await this.click({ elem: this.getYesButton() });
    }

    async clickNextButton() {
        await this.waitForElementVisible(this.getNextButton());
        await this.click({ elem: this.getNextButton() });
    }

    async clickSkipButton() {
        await this.waitForElementVisible(this.getSkipButton());
        await this.click({ elem: this.getSkipButton() });
    }

    async login(email, username, password) {
        await this.loginToAzure(email);
        await this.waitForElementDisappear(this.getLoginButton());
        await this.loginWithBadgeCredentials(username, password);
        await this.confirmAzureLogin();
    }

    async loginToAzure(email) {
        await this.waitForElementVisible(this.getAzureEmail());
        await this.waitForElementClickable(this.getAzureEmail());
        await this.clear({ elem: this.getAzureEmail() });
        await this.getAzureEmail().setValue(email);
        await this.click({ elem: this.getConfirmButton() });
    }

    // async loginWithBadgeCredentials(username, password) {
    //     await this.waitForElementAppear($('.client-name'));
    //     let dotCount = await $$('.indicator-base-view #navigation-dot').count();
    //     let flag = await this.getCredentialBox().isDisplayed();
    //     while (!flag && --dotCount) {
    //         await this.click({elem: this.getRightRowButton()});
    //         flag = await this.getCredentialBox().isDisplayed();
    //     }
    //     await this.getUsername().clear().sendKeys(username);
    //     await this.getPassword().clear().sendKeys(password);
    //     await this.click({elem: this.getLoginButton()});
    // }

    async loginWithPassword(password) {
        await this.clickMSLogo();
        await this.waitForElementVisible(await this.getPasswordInput());
        await this.waitForElementClickable(await this.getPasswordInput());
        await this.click({ elem: this.getPasswordInput() });
        await this.clear({ elem: this.getPasswordInput() });
        await this.getPasswordInput().setValue(password);
        await this.click({ elem: this.getConfirmButton() });
        await this.sleep(3000);
        if (!(await this.getYesButton().isDisplayed())) {
            await this.clickNextButton();
            await this.sleep(5000);
            await this.clickSkipButton();
        }
    }

    async loginAzureWithAnotherUser() {
        await this.click({ elem: this.getUserAnotherAccount() });
    }
    async signInWithAnotherUser() {
        await this.click({ elem: this.getSignInWithAnotherAccount() });
    }

    async loginExistingUser(email) {
        await this.click({ elem: this.getExistingUserAccount(email) });
    }

    async logoutExistingUser(email) {
        await this.click({ elem: this.getExistingUserAccount(email) });
    }

    async confirmAzureLogin() {
        await this.continueAzureLogin();
        await this.sleep(this.DEFAULT_LOADING_TIMEOUT / 10);
        const url = await this.currentURL();
        if (url.indexOf('app') >= 0) {
            console.log('login success');
            await this.waitForLibraryLoading();
        } else {
            console.log('login fail');
        }
        return this.sleep(1000);
    }

    async safeContinueAzureLogin(options = {}) {
        await this.sleep(1000);
        const url = await this.currentURL();
        if (url.indexOf('microsoft') >= 0) {
            if (this.getConfirmButton().isDisplayed()) {
                await this.continueAzureLogin();
            }
        }
    }

    async continueAzureLogin(options = {}) {
        // In oAuth case, after click this button, login window will automatically close, so cannot use this.click()
        if (options.oAuth === true) {
            await this.getConfirmButton().click();
        } else {
            await this.click({ elem: this.getConfirmButton() });
        }
    }

    async confirmAdminAzureLogin() {
        await this.continueAzureLogin();
        await this.waitForElementVisible($('input[id="serverName"]'));
    }

    async confirmAdminAzureLoginWithoutPrivilege() {
        await this.continueAzureLogin();
        await this.waitForElementVisible($('h1'));
        await this.waitForTextAppearInElement($('h1'), 'HTTP Status 403 – Forbidden', 3);
    }

    //Assertion helper

    async emptyPwError() {
        return this.getEmptyPwError().getText();
    }

    async wrongPwError() {
        return this.getWrongPwError().getText();
    }

    async isUsernameInputPresent() {
        return this.getAzureEmail().isDisplayed();
    }

    async isExitingUserAccountPresent(email) {
        return this.getExistingUserAccount(email).isDisplayed();
    }

    async isUsingUserAccountInEnterPasswordPagePresent(email) {
        const existingUser = this.getUsingUserAccountInEnterPasswordPage();
        if (await existingUser.isExisting()) {
            return (await existingUser.getText()).toLowerCase() === email.toLowerCase();
        }
    }

    async safeLoginToAzure(email) {
        // in azure login page, when it doesn't have exiting user, it will show the input box for user to input email
        // when it has exiting user, it will show the user list, and user need to click the user to login
        // so we need to wait for the input box to appear or the user list to appear
        let waitCount = 0;
        const timeoutInterval = 1000;
        while (!(await this.isUsernameInputPresent()) && !(await this.isExitingUserAccountPresent(email))) {
            if (waitCount > this.DEFAULT_LOADING_TIMEOUT / timeoutInterval) {
                throw new Error('azure login page is not loaded.');
            }
            await this.sleep(timeoutInterval);
            waitCount++;
        }
        if (await this.isUsernameInputPresent()) {
            await this.loginToAzure(email);
        }
        if (await this.isExitingUserAccountPresent(email)) {
            await this.loginExistingUser(email);
        }
    }
}
