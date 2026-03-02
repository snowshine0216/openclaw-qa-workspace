import { getCheckedStatus } from '../../utils/getAttributeValue.js';
import BaseProperties from './BaseProperties.js';

/**
 * This components will shown when mstrWebAdmin page
 * Default Properties
 */
export default class DefaultProperties extends BaseProperties {
    constructor() {
        super('#mstrWeb_content', 'Create Default Properties');
    }

    getLoginModeRow(loginMode) {
        return this.getLoginTable()
            .$$('tr')
            .filter(async (elem) => {
                const elemText = await elem.getText();
                return elemText.includes(loginMode);
            })[0];
    }

    getLoginTable() {
        return this.$('.mstrAdminPropertiesLogin');
    }

    getGuestLoginModeCheckBox() {
        return this.getLoginTable().$('input[value="8"]');
    }

    getWebErrorBox() {
        return this.$('.mstrAlert');
    }

    getWebErrorMessage() {
        return this.$('.mstrAlertMessage');
    }

    getOidcConfigTable() {
        return this.$$('.mstrAdminPropertiesLogin')[1];
    }

    getOidcConfigVisibility() {
        return this.getOidcConfigTable().$('..').getCSSProperty('visibility');
    }

    getOidcConfigClientId() {
        return this.$('#oidcConfig_clientId');
    }

    getOidcConfigClientSecret() {
        return this.$('#oidcConfig_clientSecret');
    }

    getOidcConfigIssuer() {
        return this.$('#oidcConfig_issuer');
    }

    getOidcConfigNativeClientId() {
        return this.$('#oidcConfig_nativeClientId');
    }

    getOidcConfigRedirectUri() {
        return this.$('#oidcConfig_redirectUri');
    }

    getOidcConfigScopes() {
        return this.$('#oidcConfig_scopes');
    }

    getOidcConfigClaimMapFullName() {
        return this.$('#oidcConfig_claimMap_fullName');
    }

    getOidcConfigClaimMapUserId() {
        return this.$('#oidcConfig_claimMap_userId');
    }

    getOidcConfigClaimMapEmail() {
        return this.$('#oidcConfig_claimMap_email');
    }

    getOidcConfigClaimMapGroups() {
        return this.$('#oidcConfig_claimMap_groups');
    }

    getOidcConfigAdminGroups() {
        return this.$('#oidcConfig_adminGroups');
    }

    getLoginMode() {
        return this.$('.mstrAdminPropertiesLogin');
    }

    // Action helper

    /**
     * Change the status of login mode checkbox status
     * @param {String} loginMode login mode text
     * @param {Boolean} toCheck use this flag to indicate whether to check ot unCheck
     * 1. toCheck not assigned: we'll just click the checkbox, so the status will be reversed
     * 2. toCheck = true, fucntion will make sure the checBox status to be checked
     * 3. toCheck = false, fucntion will make sure the checBox status to be unChecked
     */
    async clickLoginMode(loginMode, toCheck) {
        let elm = this.getLoginModeRow(loginMode);
        elm = elm.$('td input[type="checkbox"]');
        const isSelected = await elm.isSelected();
        if (typeof toCheck === 'undefined' || toCheck !== isSelected) {
            await this.click({ elem: elm });
        }
    }

    async setDefaultLoginMode(loginMode) {
        let elm = this.getLoginModeRow(loginMode);
        elm = elm.$$('td')[2].$('input');
        if (!(await getCheckedStatus(elm))) {
            await this.click({ elem: elm });
        }
    }

    /**
     * Select login mode
     * @param {string} loginMode the login mode
     * @param {boolean} isSet set or unset loginMode
     */
    async setLoginMode(loginMode, isSet = true) {
        const elm = this.getLoginModeRow(loginMode).$$('td')[1].$('input');
        if (isSet) {
            if (!(await getCheckedStatus(elm))) {
                await this.click({ elem: elm });
            }
        } else if (await getCheckedStatus(elm)) {
            await this.click({ elem: elm });
        }
    }

    async setGuestLogin(toCheck) {
        const elm = this.getGuestLoginModeCheckBox();
        const isSelected = await elm.isSelected();
        if (typeof toCheck === 'undefined' || toCheck !== isSelected) {
            await this.click({ elem: elm });
        }
        return this.saveChange();
    }

    /**
     * @param {Number} index
     * index = 0: Show all the projects connected to the Web Server before the user logs in
     * index = 1: Log in, then show the projects accessible by the supplied login
     */
    async setProjectList(index) {
        const options = this.$('#loginFirst').$$('option');
        await options[index].click();
    }

    // assertion helper
    async isGuestLoginEnable() {
        const elm = this.getGuestLoginModeCheckBox();
        const isSelected = await elm.isSelected();
        return isSelected;
    }

    async isWebErrorDisplay() {
        return this.getWebErrorBox().isDisplayed();
    }

    async isOidcConfigVisible() {
        return (await this.getOidcConfigVisibility()) == 'visible';
    }

    async fillOidcConfig(
        clientId,
        clientSecret,
        issuer,
        nativeClientId,
        redirectUri,
        scopes,
        claimMapFullName,
        claimMapUserId,
        claimMapEmail,
        claimMapGroups,
        adminGroups
    ) {
        if (clientId != null) {
            await this.click({ elem: this.getOidcConfigClientId() });
            await this.clear({ elem: this.getOidcConfigClientId() });
            await this.getOidcConfigClientId().setValue(clientId);
        }
        if (clientSecret != null) {
            await this.click({ elem: this.getOidcConfigClientSecret() });
            await this.clear({ elem: this.getOidcConfigClientSecret() });
            await this.getOidcConfigClientSecret().setValue(clientSecret);
        }
        if (issuer != null) {
            await this.click({ elem: this.getOidcConfigIssuer() });
            await this.clear({ elem: this.getOidcConfigIssuer() });
            await this.getOidcConfigIssuer().setValue(issuer);
        }
        if (nativeClientId != null) {
            await this.click({ elem: this.getOidcConfigNativeClientId() });
            await this.clear({ elem: this.getOidcConfigNativeClientId() });
            await this.getOidcConfigNativeClientId().setValue(nativeClientId);
        }
        if (redirectUri != null) {
            await this.click({ elem: this.getOidcConfigRedirectUri() });
            await this.clear({ elem: this.getOidcConfigRedirectUri() });
            await this.getOidcConfigRedirectUri().setValue(redirectUri);
        }
        if (scopes != null) {
            await this.click({ elem: this.getOidcConfigScopes() });
            await this.clear({ elem: this.getOidcConfigScopes() });
            await this.getOidcConfigScopes().setValue(scopes);
        }
        if (claimMapFullName != null) {
            await this.click({ elem: this.getOidcConfigClaimMapFullName() });
            await this.clear({ elem: this.getOidcConfigClaimMapFullName() });
            await this.getOidcConfigClaimMapFullName().setValue(claimMapFullName);
        }
        if (claimMapUserId != null) {
            await this.click({ elem: this.getOidcConfigClaimMapUserId() });
            await this.clear({ elem: this.getOidcConfigClaimMapUserId() });
            await this.getOidcConfigClaimMapUserId().setValue(claimMapUserId);
        }
        if (claimMapEmail != null) {
            await this.click({ elem: this.getOidcConfigClaimMapEmail() });
            await this.clear({ elem: this.getOidcConfigClaimMapEmail() });
            await this.getOidcConfigClaimMapEmail().setValue(claimMapEmail);
        }
        if (claimMapGroups != null) {
            await this.click({ elem: this.getOidcConfigClaimMapGroups() });
            await this.clear({ elem: this.getOidcConfigClaimMapGroups() });
            await this.getOidcConfigClaimMapGroups().setValue(claimMapGroups);
        }
        if (adminGroups != null) {
            await this.click({ elem: this.getOidcConfigAdminGroups() });
            await this.clear({ elem: this.getOidcConfigAdminGroups() });
            await this.getOidcConfigAdminGroups().setValue(adminGroups);
        }
    }
}
