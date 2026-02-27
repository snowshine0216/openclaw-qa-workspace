import WebBasePage from '../base/WebBasePage.js';
import { buildWebUrl, getIServer, getProject } from '../../utils/index.js';
import request from 'request';

function equalsIgnoreCase(a, b) {
    return a.toLowerCase() === b.toLowerCase();
}

export default class WebLoginPage extends WebBasePage {
    static LOGIN_TYPE = {
        SiteMinder: 'SiteMinder',
        Standard: 'Standard',
    };

    // Element locaters
    getUsername() {
        return this.$('#Uid');
    }

    getPassword() {
        return this.$('#Pwd');
    }

    getLoginButton() {
        return this.$('input[id="3054"]');
    }

    getGuestLoginInput() {
        return this.$('#guest');
    }

    getLicenseMessage() {
        return this.$('#licenseMsg0');
    }

    getLicenseButtons() {
        return this.getLicenseMessage().$$('.mstrButton');
    }

    getSecondLicenseButtons() {
        return this.$$('#licenseMsg1 .mstrButton');
    }

    getLicenseContinue() {
        return this.$$('#continue .mstrButton');
    }

    getGuestUser() {
        return this.$(`input[name='guest']`);
    }

    getContinueButton() {
        return this.$(`input[value='Continue']`);
    }

    getWarningMessage() {
        return this.$('#warning_session_timeout_countdownMsg');
    }

    getModalLoginWindow() {
        return this.$('.mstrmojo-LoginEditor');
    }

    getModalUsername() {
        return this.getModalLoginWindow().$('.std-login-container').$$('input')[0];
    }

    getModalPassword() {
        return this.getModalLoginWindow().$('.std-login-container').$('.login-pwd');
    }

    getModalLoginButton() {
        return this.getModalLoginWindow().$('div[aria-label="Login"]');
    }

    getContent() {
        return $('#mstrWeb_content');
    }

    async isContinueButtonDisplayed() {
        const continueBtn = this.getContinueButton();
        return await continueBtn.isDisplayed();
    }

    async continueLicenseWarning() {
        const licenseBtns = this.getLicenseButtons();
        let isContineButtonDisplayed = await licenseBtns[0].isDisplayed();
        if (isContineButtonDisplayed) {
            await this.click({ elem: licenseBtns[0] });
        }
        const secondlicenseBtns = this.getSecondLicenseButtons();
        isContineButtonDisplayed = await secondlicenseBtns[0].isDisplayed();
        if (isContineButtonDisplayed) {
            await this.click({ elem: secondlicenseBtns[0] });
        }
        const continueBtns = this.getLicenseContinue();
        isContineButtonDisplayed = await continueBtns[0].isDisplayed();
        if (isContineButtonDisplayed) {
            await this.click({ elem: continueBtns[0] });
        }
    }

    async getProject(serverName, projectName) {
        // Filter out the target project based on the Project Name and the Server Name
        const project = this.$$('.mstrProjectItem').filter(async (p) => {
            const pName = await p.$('.mstrLargeIconViewItemName').getText();
            const sName = await p.$('.mstrServer span').getText();
            if (serverName && projectName) {
                if (equalsIgnoreCase(pName, projectName) && equalsIgnoreCase(sName, serverName)) {
                    return true;
                }
            } else if (serverName) {
                if (equalsIgnoreCase(sName, serverName)) {
                    return true;
                }
            } else if (projectName) {
                if (equalsIgnoreCase(pName, projectName)) {
                    return true;
                }
            } else {
                return true;
            }

            return false;
        })[0];

        if (!project) {
            throw new Error('No projects found.');
        }

        return project;
    }

    async isProjectInServerShown(serverName, projectName) {
        try {
            const projects = await this.$$('.mstrProjectItem');
            for (const p of projects) {
                const pName = await p.$('.mstrLargeIconViewItemName').getText();
                const sName = await p.$('.mstrServer span').getText();

                if (serverName && projectName) {
                    if (equalsIgnoreCase(pName, projectName) && equalsIgnoreCase(sName, serverName)) {
                        return true;
                    }
                } else if (serverName) {
                    if (equalsIgnoreCase(sName, serverName)) {
                        return true;
                    }
                } else if (projectName) {
                    if (equalsIgnoreCase(pName, projectName)) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
            return false; // Return false if no project matches
        } catch (error) {
            console.error('An error occurred while searching for the project:', error);
            return false; // Return false if an error occurs
        }
    }

    async getProjectDescription(serverName, projectName) {
        const el = await this.getProject(serverName, projectName);
        return el.$('.mstrProjectDescription').getText();
    }

    async isProjectCountsEqualTo(count) {
        let projectsCount = 0;
        const project = await this.$$('.mstrProjectItem').filter(async (p) => {
            projectsCount += 1;
            return true;
        });
        if (projectsCount === count) {
            return true;
        }
        return false;
    }

    async loginSucceedExpections(objectName) {
        const title = await browser.getTitle();
        const titleList = [
            'Home',
            'My Page',
            'Summary',
            'Test Suite',
            'History List',
            'Shared Reports',
            'Strona Główna',
            '主页',
            'Podsumowanie',
        ];
        const isTitleShown = titleList.some((t) => title.includes(t));
        const isLicenseMessageDisplayed = await this.getLicenseMessage().isDisplayed();

        const value = isLicenseMessageDisplayed || isTitleShown || (objectName && title.includes(objectName));
        return value;
    }

    async loginFailExpections() {
        return this.getErrorMessage().isDisplayed();
    }

    async isLoginSucceed() {
        return this.loginSucceedExpections();
    }

    async isLoginFail() {
        const failExpections = await this.loginFailExpections();
        return failExpections();
    }

    // Action helpers
    // Open the login page
    async open(serverName = getIServer(), projectName = getProject()) {
        await browser.url(buildWebUrl());
        const project = await this.getProject(serverName, projectName);
        await this.click({ elem: project });
    }

    async standardLDAPLogin(username, password = '') {
        await this.waitForElementClickable(this.getUsername());
        await this.getUsername().clearValue();
        await this.getUsername().setValue(username);
        await this.getPassword().clearValue();
        await this.getPassword().setValue(password);
        await this.getLoginButton().click();
        await this.continueLicenseWarning();
    }

    async login(username, password = '', objectName) {
        await this.standardLDAPLogin(username, password);
        await browser.waitUntil(
            async () => {
                const isLoginSucceed = await this.loginSucceedExpections(objectName);
                const isLoginFail = await this.loginFailExpections();
                return isLoginSucceed || isLoginFail;
            },
            {
                timeout: 10000,
                timeoutMsg: 'Login timeout',
            }
        );
        await this.continueLicenseWarning();
    }

    async loginInFirst(username, password = '') {
        await this.waitForElementClickable(this.getUsername());
        await this.getUsername().clearValue();
        await this.getUsername().setValue(username);
        await this.getPassword().clearValue();
        await this.getPassword().setValue(password);
        await this.getLoginButton().click();
        await this.waitForElementVisible($('#projects_ProjectsStyle'));
        await this.continueLicenseWarning();
    }

    async loginWithGuestMode() {
        await this.waitForElementClickable(this.getGuestUser());
        await this.click({ elem: this.getGuestUser() });
        await this.continueLicenseWarning();
        await this.waitForProjectListAppear();
    }

    async openWeb() {
        await browser.url(buildWebUrl());
    }

    async loginAsGuest(objectName) {
        await this.click({ elem: this.getGuestLoginInput() });
        await browser.waitUntil(
            async () => {
                const isLoginSucceed = await this.loginSucceedExpections(objectName);
                const isLoginFail = await this.loginFailExpections();
                return isLoginSucceed || isLoginFail;
            },
            {
                timeout: 10000,
                timeoutMsg: 'Login timeout',
            }
        );
        await this.continueLicenseWarning();
    }

    async loginToSiteMinder(username, password) {
        await this.$('input[name="USER"]').clearValue();
        await this.$('input[name="USER"]').setValue(username);
        await this.clear({ elem: this.$('input[name="PASSWORD"]') });
        await this.$('input[name="PASSWORD"]').setValue(password);
        await this.click({ elem: $('input[value="Login"]') });
        await this.waitForProjectListAppear();
    }

    async waitForProjectListAppear() {
        await this.waitForElementVisible($('#mstrWebContentTable'));
        await browser.pause(2000);
    }

    async openProject(serverName, projectName) {
        const project = await this.getProject(serverName, projectName);
        await this.click({ elem: project });
    }

    async loginToHome({ serverName, projectName, username, password }) {
        await this.open(serverName, projectName);
        await this.login(username, password);
    }

    /** Logout through the logout menu */
    async logout(options = {}) {
        await this.click({ elem: $('#mstrPathAccount') });
        if (options.wait === true) {
            await this.sleep(2000);
        }
        await this.click({ elem: $('.item.logout') });
        await this.waitForPageLoadByTitle('Logout');
    }

    /** Logout through the logout menu for SSO users */
    async SSOLogout() {
        await this.click({ elem: $('#mstrPathAccount') });
        await this.click({ elem: $('.item.logout') });
        // Will redeirect to different Idps
        await this.sleep(5000);
    }

    async continue() {
        await this.click({ elem: this.getContinueButton() });
        // Redirect to Idp server and re-login
        await this.sleep(5000);
    }

    /** Logout by clearing all the cookies */
    async forceLogout() {
        try {
            await browser.deleteCookies();
        } catch (error) {
            console.error('An error occurred while logging out:', error);
        }
        await this.open();
        await this.waitForElementClickable(this.getUsername());
    }

    async switchUser(username, password) {
        await this.logout();
        await this.open();
        await this.waitForElementClickable(this.getUsername());
        await this.login(username, password);
    }

    async cancelPasswordChange() {
        const elm = this.$('input[value="Cancel"]');
        return this.click({ elem: elm });
    }

    async chooseLoginMode(modeText) {
        let mode = (await this.$('.mstrPanelBody')).$$('.chk').filter(async (m) => {
            return (await m.getText()) === modeText;
        })[0];
        if (await mode.isDisplayed()) {
            mode = mode.$('input');
        } else {
            mode = this.$('.mstrLoginOptions').$(`input[value="${modeText}"]`);
        }

        // If not found any mode, it means there is only one enabled
        // and the default is Standard
        if (await mode.isDisplayed()) {
            await this.click({ elem: mode });
        }
    }

    async getWarningMessageInfo() {
        await this.waitForElementVisible(this.getWarningMessage());
        return this.getWarningMessage().getText();
    }

    async isModalLoginWindowPresent() {
        return this.getModalLoginWindow().isDisplayed();
    }

    async modalLogin(username, password = '') {
        await this.waitForElementVisible(this.getModalUsername());
        await this.getModalUsername().clearValue();
        await this.getModalUsername().setValue(username);
        await this.getModalPassword().clearValue();
        await this.getModalPassword().setValue(password);
        await this.getModalLoginButton().click();
    }

    async isLoginPageDisplayed() {
        return this.getUsername().isDisplayed();
    }

    async getBasicAuthResponse(url, auth = '') {
        const options = {
            url: url,
            auth: {
                user: auth.split(':')[0],
                pass: auth.split(':')[1],
            },
            timeout: 15000,
        };

        return new Promise((resolve, reject) => {
            request.get(options, (error, response, body) => {
                if (error) {
                    console.log('error: %s', error.message);
                    reject(error);
                } else {
                    console.log('status code: %s', response.statusCode);
                    resolve(response.statusCode);
                }
            });
        });
    }
}
