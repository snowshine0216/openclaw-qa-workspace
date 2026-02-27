import { buildOIDCLoginUrl } from '../../utils/index.js';
import DefaultProperties from './DefaultProperties.js';

export default class OIDCConfig extends DefaultProperties {
    getOIDCConfigTitle() {
        return this.$(`td.mstrAdminPropertiesHeader*=OIDC Configuration`);
    }

    getWebUriInput() {
        return this.$('#oidcConfig_webUri');
    }

    getClientIdInput() {
        return this.$('#oidcConfig_clientId');
    }

    getClientSecretInput() {
        return this.$('#oidcConfig_clientSecret');
    }

    getIssuerInput() {
        return this.$('#oidcConfig_issuer');
    }

    getNativeClientIdInput() {
        return this.$('#oidcConfig_nativeClientId');
    }

    getRedirectUriInput() {
        return this.$('#oidcConfig_redirectUri');
    }

    getScopeInput() {
        return this.$('#oidcConfig_scopes');
    }

    getClaimFullNameInput() {
        return this.$('#oidcConfig_claimMap_fullName');
    }

    getClaimUserIdInput() {
        return this.$('#oidcConfig_claimMap_userId');
    }

    getClaimEmailInput() {
        return this.$('#oidcConfig_claimMap_email');
    }

    getClaimGroupsInput() {
        return this.$('#oidcConfig_claimMap_groups');
    }

    getAdminGroupsInput() {
        return this.$('#oidcConfig_adminGroups');
    }

    getOidcLoginUri() {
        return buildOIDCLoginUrl();
    }

    getRetrieveUserInfoFromIDToken() {
        return $('#retrieveUserInfoFromIDToken');
    }

    async fillForm(
        webUri,
        clientId,
        clientSecret,
        issuer,
        nativeClientId,
        redirectUri,
        scope,
        claimFullName,
        claimUserId,
        claimEmail,
        claimGroups,
        adminGroups
    ) {
        if (webUri != null) {
            await this.getWebUriInput().setValue(webUri);
        }
        if (clientId != null) {
            await this.getClientIdInput().setValue(clientId);
        }
        if (clientSecret != null) {
            await this.getClientSecretInput().setValue(clientSecret);
        }
        if (issuer != null) {
            await this.getIssuerInput().setValue(issuer);
        }
        if (nativeClientId != null) {
            await this.getNativeClientIdInput().setValue(nativeClientId);
        }
        if (redirectUri != null) {
            await this.getRedirectUriInput().setValue(redirectUri);
        }
        if (scope != null) {
            await this.getScopeInput().setValue(scope);
        }
        if (claimFullName != null) {
            await this.getClaimEmailInput().setValue(claimFullName);
        }
        if (claimUserId != null) {
            await this.getClaimUserIdInput().setValue(claimUserId);
        }
        if (claimEmail != null) {
            await this.getClaimEmailInput().setValue(claimEmail);
        }
        if (claimGroups != null) {
            await this.getClaimGroupsInput().setValue(claimGroups);
        }
        if (adminGroups != null) {
            await this.getAdminGroupsInput().setValue(adminGroups);
        }
    }

    async clickRetrieveUserInfoFromIDToken() {
        // check or unchecked
        return this.click({ elem: this.getRetrieveUserInfoFromIDToken() });
    }

    async isOIDCPanelDisplay() {
        return this.getOIDCConfigTitle().isDisplayed();
    }
}
