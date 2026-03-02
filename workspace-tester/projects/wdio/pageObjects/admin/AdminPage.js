import BasePage from '../base/BasePage.js';
import { getAttributeValue } from '../../utils/getAttributeValue.js';
import { Key } from 'webdriverio';

export default class AdminPage extends BasePage {
    getSavingSpinner() {
        return this.$('.show-loader');
    }

    getActionSpinner() {
        return this.$('.anticon-spin');
    }

    getSlider() {
        return this.$('.mstr-Admin-RootView-sider');
    }

    getTab(tabName) {
        return this.getSlider()
            .$$('.ant-menu-item')
            .filter(async (elem) => {
                const elemText = await elem.$('.ant-menu-title-content').getText();
                return elemText === tabName;
            })[0];
    }

    getLaunchButton() {
        return this.$('.mstr-Admin-libraryLink span');
    }

    getContentContainer() {
        return this.$('.mstr-Admin-RootView-content');
    }

    getInputTextBox() {
        return this.$('.mstr-Admin-wscv-paddedinput');
    }

    getAdminSection(title) {
        return this.$$('.mstr-Admin-Section').filter(async (elem) => {
            const elemText = await elem.$('.mstr-Admin-ss-title').getText();
            return elemText === title;
        })[0];
    }

    getCancelButton() {
        return this.$('.mstr-Admin-SaveToolbar .mstr-Admin-SaveToolbar-btn');
    }

    getSaveButton() {
        return this.$('.mstr-Admin-SaveToolbar .ant-btn-primary');
    }

    getLibraryUrl() {
        return this.getAdminSection('Library Server').$('.ant-row a');
    }

    getAuthenticationMode(mode) {
        return this.getAdminSection('Authentication Modes')
            .$$('.mstr-Admin-RowAuth')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === mode;
            })[0];
    }

    getAuthenticationModeCheckBox(mode) {
        return this.getAuthenticationMode(mode).$('.ant-checkbox');
    }

    getKeepUsersLoggedin() {
        return this.getAdminSection('Security Settings').$('.ant-checkbox-wrapper');
    }

    getRelatedContentSettings(mode) {
        return this.getAdminSection('Related Content Settings')
            .$$('.ant-radio-wrapper')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === mode;
            })[0];
    }

    getErrorDialog() {
        return this.$('.mstr-Admin-ep-popup');
    }

    getOkButtonInErrorDialog() {
        return this.getErrorDialog().$('.ant-btn-primary');
    }

    getDiscardButtonInErrorDialog() {
        return this.getErrorDialog().$('.ant-btn-primary');
    }

    getCancelButtonInErrorDialog() {
        return this.getErrorDialog().$('.ant-btn-link');
    }

    getTrustedDropdownContainer() {
        return this.getAdminSection('Authentication Modes').$('.ant-select-selector');
    }

    getTrustedDropdown() {
        return this.$('.ant-select-dropdown');
    }

    getTrustedDropdownItem(elem) {
        return this.getTrustedDropdown().$(`.ant-select-item-option-content*=${elem}`);
    }

    getCreateTrustedButton() {
        return this.$(`.mstr-Admin-wscv-authrow-subsection[type = 'button']`);
    }

    getLoginPopupDialog() {
        return this.$('.ant-modal-content');
    }

    getLoginButtonInLoginPopupDialog() {
        return this.getLoginPopupDialog().$('.ant-btn-primary');
    }

    getHelpLink() {
        return this.$('.footer-help-link');
    }

    getCollaborationSetupButton() {
        return this.$('.mstr-Admin-Button');
    }

    getNewConfigurationButton() {
        return this.$(`.mstr-Admin-mcfg-addbtn[type = 'button']`);
    }

    getChooseMobileConfiguration(name) {
        // return this.element(by.cssContainingText('.mstr-Admin-mcfg-table-row', name));
        return this.$(`.mstr-Admin-mcfg-table-row*=${name}`);
    }

    getConfigurationButton(name, icon) {
        if (icon == 'edit') {
            return this.getChooseMobileConfiguration(name).$(`.icon-info_edit`);
        } else if (icon == 'duplicate') {
            return this.getChooseMobileConfiguration(name).$(`.icon-copy`);
        } else if (icon == 'delete') {
            return this.getChooseMobileConfiguration(name).$(`.icon-delete`);
        } else if (icon == 'share') {
            return this.getChooseMobileConfiguration(name).$(`.icon-link`);
        }
    }

    getCancelDeleteConfiguration() {
        return this.$(`.cancel-btn[type = 'button']`);
    }

    getConfirmDeleteConfiguration() {
        return this.$(`.delete-btn[type = 'button']`);
    }

    getDownloadButton() {
        return this.$(`.download-btn[type = 'button']`);
    }

    getCopyLinkButton() {
        return this.$(`.copy-link-btn[type = 'button']`);
    }

    getCloseButton() {
        return this.$(`.anticon-close`);
    }

    getConfigSlider() {
        return this.$('.ant-tabs-nav-scroll');
    }

    getSettingSection() {
        return this.$$('.mstr-Admin-Section.mstr-Admin-Section-default')[0];
    }

    getSettingRow(row) {
        return this.getSettingSection()
            .$$('.ant-row.mstr-Admin-Row')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === row;
            })[0];
    }

    getSettingInputBox(row) {
        return this.getSettingRow(row).$('.ant-input.mstr-Admin-Input-Small');
    }

    getAboutButton() {
        return this.$('.footer-about-link');
    }

    getAboutTitle() {
        return this.$('.mstrd-VersionViewer h1');
    }

    getAllowEmbeddingSettings(selection) {
        return this.getAdminSection('Security Settings')
            .$$('.mstr-Admin-Radio.ant-radio-wrapper')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText === selection;
            })[0];
    }

    getSecretKeyInputBox() {
        return this.getAdminSection('Security Settings').$('.ant-input');
    }

    getSecretKeyWarning() {
        return this.getAdminSection('Security Settings').$('.mstr-Admin-wscv-warning');
    }

    getAllowEmbeddingRadioButton(selection) {
        return this.getAllowEmbeddingSettings(selection).$('.ant-radio');
    }

    getSaveSuccessMessage() {
        return this.$('.anticon.anticon-check-circle.mstr-Admin-Icon ');
    }

    getForbiddenMessage() {
        return this.$('html').getText();
    }

    getHealthBody() {
        return this.$('body');
    }

    getAlertMessage() {
        return this.$('.ant-alert-description').getText();
    }

    //Action htlper
    async openAdminPage() {
        const url = new URL('admin', browser.options.baseUrl);
        const adminTimeout = 30 * 1000; // change wait time to be smaller to shorten the whole test case running time when admin login failed
        const encodedPWD = encodeURIComponent(browsers.params.credentials.webServerPassword).replace(/%20/g, '+'); //encode the password in case there are special chars
        url.username = browsers.params.credentials.webServerUsername;
        url.password = encodedPWD;
        await browser.url(url.toString(), adminTimeout);
        return this.waitForElementInvisible(this.getLoadingIcon());
    }

    async openHealthPage() {
        const url = new URL('health', browser.options.baseUrl);
        await browser.url(encodeURI(url.toString()), this.DEFAULT_LOADING_TIMEOUT);
        return this.waitForElementVisible(this.getHealthBody());
    }

    async openAdminjspPage() {
        const url = new URL('admin.jsp', browser.options.baseUrl);
        await browser.url(url.toString(), this.DEFAULT_LOADING_TIMEOUT);
        return this.waitForElementInvisible(this.getLoadingIcon());
    }

    async clickLibraryUrl() {
        await this.click({ elem: this.getLibraryUrl() });
        await this.waitForCurtainDisappear();
    }

    async inputMicroStrategyWebLink(url) {
        const test = this.getAdminSection('Web');
        const inputBox = this.getInputTextBox(test);
        await this.clear({ elem: inputBox });
        await this.sleep(1000);
        if (url !== '') {
            return (await inputBox).setValue(url);
        } else {
            await inputBox.setValue('a');
            await browser.keys(Key.Backspace);
        }
    }

    async clickSaveButton() {
        await this.waitForElementVisible(this.getSaveButton());
        await this.getSaveButton().click();
        await browser.waitUntil(
            async () => {
                let errorDialogPresent = await this.getErrorDialog().isDisplayed();
                let savingSpinnerPresent = await this.getSavingSpinner().isDisplayed();
                return errorDialogPresent || !savingSpinnerPresent;
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'No response of saving admin page settings',
            }
        );
        await this.waitForElementStaleness(this.getSaveSuccessMessage());
    }

    async clickCancelButton() {
        await this.click({ elem: this.getCancelButton() });
    }

    async clickLaunchButton() {
        await this.waitForElementVisible(this.getLaunchButton());
        await this.click({ elem: this.getLaunchButton() });
        await this.sleep(1000); //buffer for open in to tab
        await this.switchToTab(1);
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                let directToLogin = url.includes('loginPage');
                let directToLibraryPage = url.includes('app');
                return directToLogin || directToLibraryPage;
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'No response of launch library',
            }
        );
        // let directToLogin = this.EC.urlContains('loginPage');
        // let directToLibraryPage = this.EC.urlContains('app');
        // return this.wait(
        //     this.EC.or(directToLogin, directToLibraryPage),
        //     this.DEFAULT_TIMEOUT,
        //     'No response of launch library'
        // );
    }

    async selectTrustedProvider(option) {
        await this.click({ elem: this.getTrustedDropdownContainer() });
        await this.waitForElementVisible(this.getTrustedDropdownItem(option));
        await this.click({ elem: this.getTrustedDropdownItem(option) });
        return this.sleep(500);
    }

    async clickCreateTrustedButton() {
        await this.waitForElementVisible(this.getCreateTrustedButton());
        await this.click({ elem: this.getCreateTrustedButton() });
        return this.waitForElementVisible(this.getLoginPopupDialog());
    }

    async clickDeleteTrustedButton() {
        await this.waitForElementVisible(this.getCreateTrustedButton());
        return this.click({ elem: this.getCreateTrustedButton() });
    }

    async inputUsername(userName) {
        const item = this.getLoginPopupDialog().$$('.ant-input')[0];
        await this.click({ elem: item });
        await item.setValue(userName);
        return this.sleep(500);
    }

    async loginInLoginPopupDialog(userName, password) {
        const user = this.getLoginPopupDialog().$('input[placeholder="User Name"]');
        await this.click({ elem: user });
        await user.setValue(userName);
        const pw = this.getLoginPopupDialog().$('input[placeholder="Password"]');
        await this.click({ elem: pw });
        await pw.setValue(password);
    }

    async clickLoginInLoginPopupDialog() {
        await this.click({ elem: this.getLoginButtonInLoginPopupDialog() });
        await this.waitForElementInvisible(this.getLoginPopupDialog());
        await this.waitForElementStaleness(this.getActionSpinner(this.getAdminSection('Authentication Mode')));
        return this.sleep(500);
    }

    async chooseTab(option) {
        await this.waitForElementVisible(this.getTab(option));
        await this.waitForElementEnabled(this.getTab(option));
        return this.clickByForce({ elem: this.getTab(option) });
    }

    async chooseAuthenticationMode(mode) {
        return this.click({ elem: this.getAuthenticationModeCheckBox(mode) });
    }

    async clickHelpButton() {
        await this.click({ elem: this.getHelpLink() });
        await this.sleep(1000); //buffer for open in to tab
    }

    async clickCollaborationSetupButton() {
        await this.click({ elem: this.getCollaborationSetupButton() });
        // return this.wait(
        //     this.EC.urlContains('overview'),
        //     this.DEFAULT_LOADING_TIMEOUT,
        //     'Did not direct to overview tab'
        // );
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('overview');
            },
            {
                timeout: this.DEFAULT_LOADING_TIMEOUT,
                timeoutMsg: 'Did not direct to overview tab',
            }
        );
    }

    async clickNewConfigurationButton() {
        return this.click({ elem: this.getNewConfigurationButton() });
    }

    async clickConfigurationName(name) {
        return this.click({ elem: this.getChooseMobileConfiguration(name) });
    }

    async clickConfigButton(name, icon) {
        await this.click({ elem: this.getChooseMobileConfiguration(name) });
        await this.click({ elem: this.getConfigurationButton(name, icon) });
        await this.waitForItemLoading();
    }

    async clickCancelButtonInDelete() {
        return this.click({ elem: this.getCancelDeleteConfiguration() });
    }

    async clickDownloadButton() {
        return this.click({ elem: this.getDownloadButton() });
    }

    async clickCopyLinkButton() {
        return this.click({ elem: this.getCopyLinkButton() });
    }

    async clickCloseButton() {
        return this.click({ elem: this.getCloseButton() });
    }

    async clickDeleteConfig(name) {
        await this.clickConfigButton(name, 'delete');
        await this.click({ elem: this.getConfirmDeleteConfiguration() });
        return this.waitForElementInvisible(this.getChooseMobileConfiguration(name));
    }

    async inputSecretKey(key) {
        await this.waitForElementVisible(this.getSecretKeyInputBox());
        await this.waitForElementClickable(this.getSecretKeyInputBox());
        await this.clear({ elem: this.getSecretKeyInputBox() });
        await this.getSecretKeyInputBox().setValue(key);
    }

    async clickKeepUsersLoggedin() {
        return this.click({ elem: this.getKeepUsersLoggedin() });
    }

    async chooseRelatedContentSettings(mode) {
        return this.click({ elem: this.getRelatedContentSettings(mode) });
    }

    async clickOkButtonInErrorDialog() {
        return this.click({ elem: this.getOkButtonInErrorDialog() });
    }

    async inputSetting(row, size) {
        await this.waitForElementClickable(this.getSettingInputBox(row));
        const input = await this.getSettingInputBox(row);
        await this.clear({ elem: input });
        await input.setValue(size);
    }

    async saveSetting() {
        await this.click({ elem: this.getSaveButton() });
    }

    async openAbout() {
        await this.waitForElementVisible(this.getAboutButton());
        await this.waitForElementEnabled(this.getAboutButton());
        await this.clickByForce({ elem: this.getAboutButton() });
    }

    async selectAllowEmbeddingRadioButton(selection) {
        await this.click({ elem: this.getAllowEmbeddingRadioButton(selection) });
    }

    async clickCancelInErrorDialog() {
        await this.click({ elem: this.getDiscardButtonInErrorDialog() });
    }

    //Assertion Helper
    async getAboutTitleText() {
        await this.waitForElementVisible(this.getAboutTitle());
        return this.getAboutTitle().getText();
    }

    async isErrorDialogShows() {
        return await this.getErrorDialog().isDisplayed();
    }

    async getSettingValue(row) {
        await this.waitForElementVisible(this.getSettingInputBox(row));
        const value = await getAttributeValue(this.getSettingInputBox(row), 'value');
        return value;
    }

    async getLibraryUrlText() {
        await this.waitForElementVisible(this.getLibraryUrl());
        return this.getLibraryUrl().getText();
    }

    getLibraryAdminText() {
        return this.$('.ant-layout-sider-children .logo').getText();
    }

    async healthPageResponse() {
        return this.getHealthBody().getText();
    }

    async getWarningMessageText() {
        return this.getSecretKeyWarning().getText();
    }
}
