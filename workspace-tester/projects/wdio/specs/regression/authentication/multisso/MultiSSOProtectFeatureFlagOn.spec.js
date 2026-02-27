/**
 * TC97240
 * Run in Local: npm run regression -- --spec=specs/regression/authentication/multisso/MultiSSOProtectFeatureFlagOn.spec.js --baseUrl=https://mci-cainb-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.loginType=custom
 */
import setFeatureFlag from '../../../../api/multiSSOFeatureFlag.js';

describe('Multi SSO - Custom App - multi SSO protect feature flag on', () => {
    const oktaUser = users['EMM_OKTA'];
    oktaUser.credentials.password = process.env.okta_password;
    const azureUser = users['EMM_SAML_Azure'];
    azureUser.credentials.password = process.env.azure_password;
    const customApp = {
        OIDCAppLevelRegistration: {
            id: '21761DA41A3C4791BFBC1E3A579D91C9',
        },
        SAMLAppLevelRegistration: {
            id: '22830698C1AD4722B5AEDA968EEF0829',
        },
        OIDCAppLevelRegistrationBlock: {
            id: 'E24E784B3A7C4DA691515619E9ADC138',
        },
        SAMLAppLevelRegistrationBlock: {
            id: '3BA1B72BA6F44446A62FEC3073AFDB4C',
        },
    };

    const featureID = 'A6A8508A4607072C93E70BA6D89C12CA';

    let { userAccount, libraryPage, loginPage, azureLoginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await setFeatureFlag({
            featureFlagId: featureID,
            status: 1,
            credentials: browsers.params.credentials,
        });
    });

    afterAll(async () => {
        await setFeatureFlag({
            featureFlagId: featureID,
            status: 2,
            credentials: browsers.params.credentials,
        });
    });

    it('[TC97240_00] Multi SSO | SSO feature flag on - OIDC registration in user SSO scope', async () => {
        const { OIDCAppLevelRegistration } = customApp;
        const OIDC = OIDCAppLevelRegistration;
        await libraryPage.openCustomAppById({ id: OIDC.id, check_flag: false });
        await loginPage.oktaLogin(oktaUser.credentials);
        await libraryPage.waitForLibraryLoading();
        await userAccount.openUserAccountMenu();
        await since('The user name should contain Shuai')
            .expect(await userAccount.getUserName())
            .toContain('Shuai');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(OIDC.id);
        await libraryPage.logout();
    });

    it('[TC97240_01] Multi SSO | SSO feature flag on - OIDC registration not in user SSO scope', async () => {
        const { OIDCAppLevelRegistrationBlock } = customApp;
        const OIDC = OIDCAppLevelRegistrationBlock;
        await libraryPage.openCustomAppById({ id: OIDC.id, check_flag: false });
        await libraryPage.waitForLibraryLoading();
        await since('The error box presence is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await loginPage.getLoginErrorBox().isDisplayed())
            .toBe(true);
        await since('The error title is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await loginPage.loginErrorTitle())
            .toEqual('Authentication Error');
        await since('The error message is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await loginPage.loginErrorMsg())
            .toEqual('Your login has been denied by the system.');
        await loginPage.dismissLoginErrorMessage();
    });

    it('[TC97240_02] Multi SSO | SSO feature flag on - SAML registration in user SSO scope', async () => {
        const { SAMLAppLevelRegistration } = customApp;
        const SAML = SAMLAppLevelRegistration;
        await libraryPage.openCustomAppById({ id: SAML.id, check_flag: false });
        await azureLoginPage.loginToAzure(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await libraryPage.waitForLibraryLoading();
        await libraryPage.openUserAccountMenu();
        await since('The user name should contains mexia')
            .expect(await userAccount.getUserName())
            .toContain('mexia');
        await since('The url should contains custom app id')
            .expect(await browser.getUrl())
            .toContain(SAML.id);
        await libraryPage.logout();
    });

    it('[TC97240_03] Multi SSO | SSO feature flag on - SAML registration not in user SSO scope', async () => {
        const { SAMLAppLevelRegistrationBlock } = customApp;
        const SAML = SAMLAppLevelRegistrationBlock;
        await libraryPage.openCustomAppById({ id: SAML.id, check_flag: false });
        await azureLoginPage.loginExistingUser(azureUser.credentials.username);
        await azureLoginPage.loginWithPassword(azureUser.credentials.password);
        await azureLoginPage.safeContinueAzureLogin();
        await libraryPage.waitForLibraryLoading();
        await since('The error box presence is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await loginPage.getLoginErrorBox().isDisplayed())
            .toBe(true);
        await since('The error title is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await loginPage.loginErrorTitle())
            .toEqual('Authentication Error');
        await since('The error message is supposed to be "#{expected}", instead we have "#{actual}"')
            .expect(await loginPage.loginErrorMsg())
            .toEqual('Your login has been denied by the system.');
        await loginPage.dismissLoginErrorMessage();
    });
});
