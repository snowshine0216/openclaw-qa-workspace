import BasePage from '../base/BasePage.js';
import allureReporter from '@wdio/allure-reporter';
import PingFederateLoginPage from './PingFederateLoginPage.js';
import AzureLoginPage from './AzureLoginPage.js';
import OktaLoginPage from './OktaLoginPage.js';
import logoutFromCurrentBrowser from '../../api/logoutFromCurrentBrowser.js';

export default class LoginPage extends BasePage {
    constructor() {
        super();
        this.pingFederateLoginPage = new PingFederateLoginPage();
        this.azureLoginPage = new AzureLoginPage();
        this.oktaLoginPage = new OktaLoginPage();
    }

    // Element locator

    getQrCode() {
        return this.$('.QR');
    }

    getLDAPMode() {
        return this.$('#LDAPModeLabel');
    }

    getLoginErrorBox() {
        return this.$('.mstrd-MessageBox-main');
    }

    loginErrorTitle() {
        return this.getLoginErrorBox().$('.mstrd-MessageBox-title').getText();
    }

    loginErrorMsg() {
        return this.getLoginErrorBox().$('.mstrd-MessageBox-msg').getText();
    }

    loginErrorMessage() {
        return this.$('.mstrd-MessageBox-main .mstrd-MessageBox-msg').getText();
    }

    getLoginErrorButton() {
        return this.getLoginErrorBox().$('.mstrd-ActionLinkContainer span');
    }

    getStandardMode() {
        return this.$('#StandardModeLabel');
    }

    getGuestIcon() {
        return this.$('.login-icons.icon-guest');
    }

    getUsernameForm() {
        return this.$('#username');
    }

    getPasswordForm() {
        return this.$(`input.form-control[id='password']`);
    }

    getLoginButton() {
        return this.$('#loginButton');
    }

    getCredsLoginContainer() {
        return this.$('.credsLoginContainer');
    }

    getTrustedLoginButton() {
        return this.$('.icon-name.trusted-name');
    }

    getKerberosLoginIcon() {
        return this.$('.icon-integrated');
    }

    getSamlLoginIcon() {
        return this.$('.icon-name.saml-name');
    }

    getOIDCLoginIcon() {
        return this.$('.icon-name.oidc-name');
    }

    getTrustedLoginIcon() {
        return this.$('.icon-name.trusted-name');
    }

    getPingHeader() {
        return this.$('.ping-header');
    }

    getB2CEmailAddressField() {
        return this.$('input[id="signInName"]');
    }
    getB2CContinueButton() {
        return this.$('button[id="continue"]');
    }

    getLoginButtonInSessionTimeoutAlert() {
        return this.getLoginErrorBox().$('.mstrd-ActionLinkContainer-text');
    }

    getPendoTutorial() {
        return this.$('._pendo-step-container-size');
    }

    getPendoTutorialCloseButton() {
        return this.$('._pendo-close-guide');
    }

    // Action helper
    async loginAsGuest() {
        return this.click({ elem: this.getGuestIcon() });
    }

    async trustedLogin(credentials = { username: '', password: '' }, type) {
        if (await this.getTrustedLoginButton().isDisplayed()) {
            await this.clickAndNoWait({ elem: this.getTrustedLoginButton() });
        } else {
            switch (type && type.toLowerCase()) {
                case 'ping-federated':
                    await this.pingFederatedLogin(credentials);
                    break;
                case 'siteMinder':
                    await this.siteMinderLoginPage(credentials);
                    break;
                default:
                    throw Error('Invalid trusted login type');
            }
        }
    }

    async waitForTrustedLoginButton() {
        await this.waitForElementVisible(this.getTrustedLoginButton());
    }

    async waitForLoginView() {
        await this.waitForElementVisible(await this.getCredsLoginContainer(), {
            msg: 'Login page was not displayed.',
            timeout: this.DEFAULT_LOADING_TIMEOUT,
        });
    }

    async waitForLoginErrorBox() {
        await this.waitForElementVisible(this.getLoginErrorBox(), {
            msg: 'Login page Error box was not displayed.',
            timeout: this.DEFAULT_LOADING_TIMEOUT,
        });
    }

    async loginWithInvalidCredentials() {
        return this.login({ username: 'invalidUser', password: 'thisisnotavalidpassword' });
    }

    async clearCredentials() {
        await this.getUsernameForm().clearValue();
        return (await this.getPasswordForm()).clearValue();
    }

    async switchToStandardTab() {
        await this.click({ elem: this.getStandardMode() });
    }

    async login(
        credentials = { username: '', password: '' },
        options = { mode: 'standard', type: '', waitForLoading: true }
    ) {
        const shouldWaitForLoading = options.waitForLoading !== false;
        switch (options.mode && options.mode.toLowerCase()) {
            case 'standard':
                await this.standardLogin(credentials);
                shouldWaitForLoading && (await this.waitForCurtainDisappear());
                break;
            case 'guest':
                await this.loginAsGuest();
                break;
            case 'trusted':
                await this.trustedLogin(credentials, options.type);
                break;
            case 'ldap':
                await this.ldapLogin(credentials);
                break;
            case 'integrated':
                await this.integratedLogin(credentials, options.type);
                break;
            case 'saml':
                await this.click({ selector: this.getSamlLoginIcon() });
                await this.samlLogin(credentials, options.type);
                break;
            case 'oidc':
                await this.click({ elem: this.getOIDCLoginIcon() });
                break;
            default:
                console.log('Invalid authentication mode');
        }
        allureReporter.addStep(`Login by ${JSON.stringify(credentials)}`);
        shouldWaitForLoading && (await this.waitForLibraryLoading());
        return browser.pause(1000);
    }

    async relogin(credentials = { username: '', password: '' }, options = { mode: 'standard', type: '' }) {
        await logoutFromCurrentBrowser();
        await browser.url(browser.options.baseUrl);
        await this.waitForLoginView();
        await this.login(credentials, options);
    }

    async enableABAlocator() {
        let jsCode = "window.localStorage.setItem('enableABALocator', true)";
        await this.executeScript(jsCode);
    }

    async standardLogin(credentials = { username: '', password: '' }) {
        await this.standardInputCredential(credentials);
        await this.clickAndNoWait({ elem: this.getLoginButton() });
    }

    async standardInputCredential(credentials = { username: '', password: '' }) {
        await this.waitForElementVisible(this.getUsernameForm());
        await this.getUsernameForm().setValue(credentials.username);
        await this.waitForElementVisible(this.getPasswordForm());
        await this.getPasswordForm().setValue(credentials.password);
    }

    async dismissLoginErrorMessage() {
        await this.waitForElementVisible(this.getLoginErrorBox());
        await this.getLoginErrorButton().click();
        // Not sure what issue in old e2e if removing sleep step
        await this.sleep(500);
    }

    async clearLoginAndPassword() {
        await this.getUsernameForm().clear();
        return this.getPasswordForm().clear();
    }

    async samlRelogin() {
        await this.click({ elem: this.getSamlLoginIcon() });
    }

    async oidcRelogin() {
        await this.click({ elem: this.getOIDCLoginIcon() });
    }

    async isOIDCLoginButtonDisplayed() {
        return await this.getOIDCLoginIcon().isDisplayed();
    }

    async trustedRelogin() {
        await this.click({ elem: this.getTrustedLoginIcon() });
    }

    async oktaLogin(credentials = { username: '', password: '' }) {
        await this.oktaLoginPage.oktaLogin(credentials);
    }
    async basicOktaLogin(credentials = { username: '', password: '' }) {
        await this.oktaLoginPage.basicOktaLogin(credentials);
    }

    async loginToEditMode(credentials = { username: '', password: '' }) {
        await this.waitForElementVisible(this.getUsernameForm());
        await this.getUsernameForm().setValue(credentials.username);
        await this.waitForElementVisible(this.getPasswordForm());
        await this.getPasswordForm().setValue(credentials.password);
        await this.clickAndNoWait({ elem: this.getLoginButton() });
        await this.waitForDynamicElementLoading();
    }

    async isStandardModeSelected() {
        //await this.waitForElementVisible(this.getStandardMode());
        return this.getStandardMode().isDisplayed();
    }

    async getLibraryVersion(
        libraryUrl = appId ? browser.options.baseUrl.split('app/')[0] : browser.options.baseUrl,
        mode
    ) {
        const url = new URL('admin/version', libraryUrl);
        const adminTimeout = 30 * 1000; // change wait time to be smaller to shorten the whole test case running time when admin login failed
        const encodedPWD = encodeURIComponent(browsers.params.credentials.webServerPassword).replace(/%20/g, '+'); //encode the password in case there are special chars
        var currentURL = '';
        switch (mode) {
            case 'default':
                url.username = browsers.params.credentials.webServerUsername;
                url.password = encodedPWD;
                await browser.url(url.toString(), this.DEFAULT_LOADING_TIMEOUT);
                break;
            case 'custom':
                url.username = browsers.params.credentials.webServerUsername;
                url.password = encodedPWD;
                await browser.url(url.toString(), this.DEFAULT_LOADING_TIMEOUT);
                break;
            case 'okta':
                await browser.url(url.toString(), this.DEFAULT_LOADING_TIMEOUT);
                await this.sleep(1000);
                currentURL = await browser.getUrl();
                if (currentURL.indexOf(url.toString()) < 0) {
                    await this.oktaLogin({
                        username: browsers.params.credentials.webServerUsername,
                        password: encodedPWD,
                    });
                }
                break;
            case 'azure':
                await browser.url(url.toString(), this.DEFAULT_LOADING_TIMEOUT);
                await this.sleep(1000);
                currentURL = await browser.getUrl();
                if (currentURL.indexOf(url.toString()) < 0) {
                    await this.azureLoginPage.safeLoginToAzure(browsers.params.credentials.webServerUsername);
                    await this.azureLoginPage.loginWithPassword(browsers.params.credentials.webServerPassword);
                    await this.azureLoginPage.safeContinueAzureLogin();
                }
                break;
            case 'ping':
                await browser.url(url.toString(), this.DEFAULT_LOADING_TIMEOUT);
                await this.sleep(1000);
                currentURL = await browser.getUrl();
                if (currentURL.indexOf(url.toString()) < 0) {
                    await this.pingFederateLoginPage.login(
                        browsers.params.credentials.webServerUsername,
                        browsers.params.credentials.webServerPassword
                    );
                }
                url.username = browsers.params.credentials.webServerUsername;
                url.password = encodedPWD;
                await browser.url(url.toString(), this.DEFAULT_LOADING_TIMEOUT);
                break;
            // When access admin page with trusted mode, user need to login trusted mode and then login static mode
            case 'trusted':
                await browser.url(url.toString(), this.DEFAULT_LOADING_TIMEOUT);
                await this.sleep(1000);
                currentURL = await browser.getUrl();
                if (currentURL.indexOf(url.toString()) < 0) {
                    if (await this.getPingHeader().isDisplayed()) {
                        await this.pingFederateLoginPage.login('desparzaclient', '!1qaz');
                    } else {
                        await this.siteMinderLoginPage.login('desparzaclient', '!1qaz');
                    }
                }
                url.username = browsers.params.credentials.webServerUsername;
                url.password = encodedPWD;
                await browser.url(url.toString(), this.DEFAULT_LOADING_TIMEOUT);
                break;
            default:
                errorLog('Invalid authentication mode');
        }
        await this.waitForPageLoadByTitle('Library Admin', { msg: 'Did not direct to version page' });
        await this.waitForElementVisible(this.$('.mstrd-VersionViewer h2'));
        await this.waitForElementInvisible(this.getPageLoading(), {
            timeout: adminTimeout,
            msg: 'Admin version page loading icon not disappeared',
        });
        const ver = await this.$('.mstrd-VersionViewer h2').getText();
        return ver.split(' ')[1];
    }

    async loginWithoutWait(credentials = { username: '', password: '' }) {
        await this.getUsernameForm().setValue(credentials.username);
        await this.getPasswordForm().setValue(credentials.password);
        await this.getLoginButton().click();
    }

    async integratedLogin(credentials = { username: '', password: '' }, type) {
        switch (type && type.toLowerCase()) {
            case 'kerberos':
                await this.click({ elem: this.getKerberosLoginIcon() });
                break;
            default:
                throw Error('Invalid integrated login type');
        }
    }
    async ldapLogin(credentials = { username: '', password: '' }) {
        await this.clickAndNoWait({ elem: this.getLDAPMode() });
        await this.getUsernameForm().setValue(credentials.username);
        await this.getPasswordForm().setValue(credentials.password);
        await this.click({ elem: this.getLoginButton() });
    }

    // Assertion helper

    async isLoginPageDisplayed() {
        return await this.getCredsLoginContainer().isDisplayed();
    }

    async isOIDCLoginButtonDisplayed() {
        return await this.getOIDCLoginIcon().isDisplayed();
    }

    async isOktaUsernameDisplayed() {
        return this.oktaLoginPage.isOktaUsernameDisplayed();
    }

    async isSAMLLoginButtonDisplayed() {
        return this.getSamlLoginIcon().isDisplayed();
    }

    async oktaWrongPwError() {
        return this.oktaLoginPage.oktaWrongPwError();
    }

    async waitForMSTRProjectListAppear() {
        await this.waitForElementVisible(this.$('#mstrWebContentTable'));
    }

    async saasLogin(credentials = { username: '', password: '' }) {
        await this.waitForElementVisible(this.getB2CEmailAddressField());
        await this.getB2CEmailAddressField().setValue(credentials.username);
        await this.getB2CContinueButton().click();
        await this.waitForElementInvisible(this.$('#verifying_blurb'));
        await this.azureLoginPage.waitForElementVisible(this.azureLoginPage.getPasswordInput());
        await this.azureLoginPage.loginWithPassword(credentials.password);
        await this.azureLoginPage.safeContinueAzureLogin();
    }

    async disableTutorial() {
        let jsCode = "window.localStorage.setItem('dontShowTutorial', '{\"data\":true}')";
        await this.executeScript(jsCode);
    }

    async disablePendoTutorial() {
        if (await this.getPendoTutorial().isDisplayed()) {
            await this.click({ elem: this.getPendoTutorialCloseButton() });
        }
    }

    async clickLoginButtonInSessionTimeoutAlert() {
        await this.click({ elem: this.getLoginButtonInSessionTimeoutAlert() });
        await this.waitForLibraryLoading();
    }
}
