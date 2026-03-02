import BasePage from '../base/BasePage.js';
import { buildSAMLConfigUrlWithCredential } from '../../utils/index.js';

export default class SAMLConfigPage extends BasePage {
    // Element Locator
    getEntityIdInput() {
        return this.$('#entityId');
    }

    getEntityIdError() {
        return this.$('#entityId\\.errors');
    }

    getBaseURLInput() {
        return this.$('#baseURL');
    }

    getBaseURLError() {
        return this.$('#baseURL\\.errors');
    }

    getBehindProxy() {
        return this.$('#behindProxy');
    }

    getLogoutMode() {
        return this.$('#localLogout');
    }

    getSignatureAlgorithm() {
        return this.$('#signatureAlgorithm');
    }

    getEncryptAssertions() {
        return this.$('#encryptAssertions');
    }

    getDisplayNameInput() {
        return this.$('#displayNameAttributeName');
    }

    getEmailInput() {
        return this.$('#emailAttributeName');
    }

    getDistinguishedNameInput() {
        return this.$('#dnAttributeName');
    }

    getGroupInput() {
        return this.$('#groupAttributeName');
    }

    getGroupFormat() {
        return this.$('#groupFormat');
    }

    getAdminGroupsInput() {
        return this.$('#adminGroups');
    }

    getGenerateConfigButton() {
        return this.$('input[value="Generate config"]');
    }

    // Action Helper
    async openSAMLConfigWeb() {
        await browser.url(buildSAMLConfigUrlWithCredential());
    }

    async selectDropDown(select, value) {
        await select.$('option[value="' + value + '"]').click();
    }

    async fillForm({
        entityId,
        baseUrl,
        behindProxy,
        logoutMode,
        signatureAlgorithm,
        encryptAssertions,
        displayNameAttributeName,
        emailAttributeName,
        dnAttributeName,
        groupAttributeName,
        groupFormat,
        adminGroups,
    }) {
        if (entityId != null) {
            await this.clear({ elem: this.getEntityIdInput() });
            await this.getEntityIdInput().setValue(entityId);
        }
        if (baseUrl != null) {
            await this.clear({ elem: this.getBaseURLInput() });
            await this.getBaseURLInput().setValue(baseUrl);
        }
        if (behindProxy != null) {
            await this.selectDropDown(this.getBehindProxy(), behindProxy);
        }
        if (logoutMode != null) {
            await this.selectDropDown(this.getLogoutMode(), logoutMode); //default: global
        }
        if (signatureAlgorithm != null) {
            await this.selectDropDown(this.getSignatureAlgorithm(), signatureAlgorithm);
        }
        if (encryptAssertions != null) {
            await this.selectDropDown(this.getEncryptAssertions(), encryptAssertions);
        }
        if (displayNameAttributeName != null) {
            await this.clear({ elem: this.getDisplayNameInput() });
            await this.getDisplayNameInput().setValue(displayNameAttributeName);
        }
        if (emailAttributeName != null) {
            await this.clear({ elem: this.getEmailInput() });
            await this.getEmailInput().setValue(emailAttributeName);
        }
        if (dnAttributeName != null) {
            await this.clear({ elem: this.getDistinguishedNameInput() });
            await this.getDistinguishedNameInput().setValue(dnAttributeName);
        }
        if (groupAttributeName != null) {
            await this.clear({ elem: this.getGroupInput() });
            await this.getGroupInput().setValue(groupAttributeName);
        }
        if (groupFormat != null) {
            await this.selectDropDown(this.getGroupFormat(), groupFormat);
        }
        if (adminGroups != null) {
            await this.clear({ elem: this.getAdminGroupsInput() });
            await this.getAdminGroupsInput().setValue(adminGroups);
        }
    }

    async checkForm({
        entityId = '',
        baseUrl = browser.options.baseUrl,
        behindProxy = 'No',
        logoutMode = 'Local',
        signatureAlgorithm = 'SHA256WITHRSA',
        encryptAssertions = 'No',
        displayNameAttributeName = 'DisplayName',
        emailAttributeName = 'EMail',
        dnAttributeName = 'DistinguishedName',
        groupAttributeName = 'Groups',
        groupFormat = 'Simple',
        adminGroups = '',
    }) {
        await expect(await this.getEntityIdInput().getValue()).toEqual(entityId);
        await expect(await this.getBaseURLInput().getValue()).toEqual(baseUrl.replace(/\/$/, ''));
        await expect(await this.getBehindProxy().getValue()).toEqual(behindProxy === 'Yes' ? 'true' : 'false');
        await expect(await this.getLogoutMode().getValue()).toEqual(logoutMode === 'Local' ? 'true' : 'false');
        await expect(await this.getSignatureAlgorithm().getValue()).toEqual(signatureAlgorithm);
        await expect(await this.getEncryptAssertions().getValue()).toEqual(
            encryptAssertions === 'Yes' ? 'true' : 'false'
        );
        await expect(await this.getDisplayNameInput().getValue()).toEqual(displayNameAttributeName);
        await expect(await this.getEmailInput().getValue()).toEqual(emailAttributeName);
        await expect(await this.getDistinguishedNameInput().getValue()).toEqual(dnAttributeName);
        await expect(await this.getGroupInput().getValue()).toEqual(groupAttributeName);
        await expect(await this.getGroupFormat().getValue()).toEqual(groupFormat);
        await expect(await this.getAdminGroupsInput().getValue()).toEqual(adminGroups);
    }

    async submitForm() {
        await this.getGenerateConfigButton().click();
    }

    async confirmConfigSucceed() {
        await this.waitForPageLoadByTitle('SAML Configuration Success');
        const result = await this.$('h1').getText();
        return result === 'Configuration file generation succeeded';
    }

    async confirmEntityIdError() {
        await this.waitForElementVisible(this.getEntityIdError());
    }

    async confirmBaseURLError() {
        await this.waitForElementVisible(this.getBaseURLError());
    }

    async confirmLoginSuccessful() {
        await this.waitForPageLoadByTitle('SAML configuration');
        return this.getGenerateConfigButton().isDisplayed();
    }
}
