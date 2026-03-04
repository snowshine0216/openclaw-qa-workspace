# Site Knowledge: auth

> Components: 12

### AzureLoginPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `CredentialBox` | `#lightbox` | element |
| `LeftRowButton` | `.slick-pre` | element |
| `RightRowButton` | `.slick-next` | element |
| `LoginButton` | `#login-credential-button` | button |
| `LoginMessage` | `#credential-warning` | element |
| `EmptyPwError` | `#passwordError` | element |
| `WrongPwError` | `#passwordError` | element |
| `UserAnotherAccount` | `#otherTile` | element |
| `UsingUserAccountInEnterPasswordPage` | `#displayName` | element |
| `MSLogo` | `.logo` | element |

**Actions**
| Signature |
|-----------|
| `clickMSLogo()` |
| `clickYesButton()` |
| `clickNextButton()` |
| `clickSkipButton()` |
| `login(email, username, password)` |
| `loginToAzure(email)` |
| `loginWithBadgeCredentials(username, password)` |
| `loginWithPassword(password)` |
| `loginAzureWithAnotherUser()` |
| `signInWithAnotherUser()` |
| `loginExistingUser(email)` |
| `logoutExistingUser(email)` |
| `confirmAzureLogin()` |
| `safeContinueAzureLogin(options = {})` |
| `continueAzureLogin(options = {})` |
| `confirmAdminAzureLogin()` |
| `confirmAdminAzureLoginWithoutPrivilege()` |
| `emptyPwError()` |
| `wrongPwError()` |
| `isUsernameInputPresent()` |
| `isExitingUserAccountPresent(email)` |
| `isUsingUserAccountInEnterPasswordPagePresent(email)` |
| `safeLoginToAzure(email)` |

**Sub-components**
- getUsingUserAccountInEnterPasswordPage

---

### BasicAuth
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getBasicAuthResopne(url, auth = '')` |
| `getNtlmAuthResponse(url, auth = { username: '', password: '' })` |

**Sub-components**
_none_

---

### ChangePasswordPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ChangePwdContainer` | `#changePwdButton` | button |
| `DoneButton` | `#changePwdButton` | button |
| `DoneButtonDisabled` | `#changePwdButton.disabledLogin` | button |
| `ChangePasswordErrorBox` | `.mstrd-MessageBox-main` | element |
| `ChangePasswordLoading` | `.loading-spinner` | element |
| `ChangePwdFooter` | `#changePwdFooter` | element |

**Actions**
| Signature |
|-----------|
| `waitForChangePwdView()` |
| `changePasswordWithInvalidCredentials()` |
| `dismissChangePasswordErrorMessage()` |
| `clearPasswordForm()` |
| `login(credentials = { username: '', password: '' })` |
| `enterPassword(oldPassword, newPassword, confirmPassword)` |
| `changePassword(oldPassword, newPassword, confirmPassword)` |
| `changePasswordFinished()` |
| `isDoneButtonClickable()` |
| `changePasswordErrorMsg()` |
| `isChangePasswordErrorBoxDisplayed()` |
| `isChangePasswordDisplayed()` |
| `getChangePwdFooterText()` |

**Sub-components**
- loginPage
- getChangePwdContainer

---

### JwtPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `testJWTConfigSetup(userCredentials, baseUrl, algorithm, customPayload = {}, customConfig = {})` |
| `testJWTLogin(baseUrl, jwtToken, algorithm)` |

**Sub-components**
_none_

---

### KeycloakLoginPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `login(username, password)` |
| `safeContinueKeycloakLogin()` |

**Sub-components**
_none_

---

### LoginPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `QrCode` | `.QR` | element |
| `LDAPMode` | `#LDAPModeLabel` | element |
| `LoginErrorBox` | `.mstrd-MessageBox-main` | element |
| `StandardMode` | `#StandardModeLabel` | element |
| `GuestIcon` | `.login-icons.icon-guest` | element |
| `UsernameForm` | `#username` | element |
| `LoginButton` | `#loginButton` | button |
| `CredsLoginContainer` | `.credsLoginContainer` | element |
| `TrustedLoginButton` | `.icon-name.trusted-name` | element |
| `KerberosLoginIcon` | `.icon-integrated` | element |
| `SamlLoginIcon` | `.icon-name.saml-name` | element |
| `OIDCLoginIcon` | `.icon-name.oidc-name` | element |
| `TrustedLoginIcon` | `.icon-name.trusted-name` | element |
| `PingHeader` | `.ping-header` | element |
| `PendoTutorial` | `._pendo-step-container-size` | element |
| `PendoTutorialCloseButton` | `._pendo-close-guide` | element |

**Actions**
| Signature |
|-----------|
| `loginAsGuest()` |
| `trustedLogin(credentials = { username: '', password: '' }, type)` |
| `waitForTrustedLoginButton()` |
| `waitForLoginView()` |
| `waitForLoginErrorBox()` |
| `loginWithInvalidCredentials()` |
| `clearCredentials()` |
| `switchToStandardTab()` |
| `login(credentials = { username: '', password: '' }, options = { mode: 'standard', type: '', waitForLoading: true })` |
| `relogin(credentials = { username: '', password: '' }, options = { mode: 'standard', type: '' })` |
| `enableABAlocator()` |
| `standardLogin(credentials = { username: '', password: '' })` |
| `standardInputCredential(credentials = { username: '', password: '' })` |
| `dismissLoginErrorMessage()` |
| `clearLoginAndPassword()` |
| `samlRelogin()` |
| `oidcRelogin()` |
| `isOIDCLoginButtonDisplayed()` |
| `trustedRelogin()` |
| `oktaLogin(credentials = { username: '', password: '' })` |
| `basicOktaLogin(credentials = { username: '', password: '' })` |
| `loginToEditMode(credentials = { username: '', password: '' })` |
| `isStandardModeSelected()` |
| `getLibraryVersion(libraryUrl = appId ? browser.options.baseUrl.split('app/')` |
| `loginWithoutWait(credentials = { username: '', password: '' })` |
| `integratedLogin(credentials = { username: '', password: '' }, type)` |
| `ldapLogin(credentials = { username: '', password: '' })` |
| `isLoginPageDisplayed()` |
| `isOIDCLoginButtonDisplayed()` |
| `isOktaUsernameDisplayed()` |
| `isSAMLLoginButtonDisplayed()` |
| `oktaWrongPwError()` |
| `waitForMSTRProjectListAppear()` |
| `saasLogin(credentials = { username: '', password: '' })` |
| `disableTutorial()` |
| `disablePendoTutorial()` |
| `clickLoginButtonInSessionTimeoutAlert()` |

**Sub-components**
- pingFederateLoginPage
- azureLoginPage
- oktaLoginPage
- siteMinderLoginPage
- getCredsLoginContainer
- waitForPage
- getPage

---

### OktaLoginPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `OktaSigninButton` | `#okta-signin-submit` | element |

**Actions**
| Signature |
|-----------|
| `oktaWrongPwError()` |
| `isOktaUsernameDisplayed()` |
| `oktaLogin(credentials = { username: '', password: '' })` |
| `basicOktaLogin(credentials = { username: '', password: '' })` |
| `isInvalidCredentials()` |

**Sub-components**
_none_

---

### OneAuthApiPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AccessTokenButton` | `button=Get token` | button |
| `RefreshTokenButton` | `button=Refresh token` | button |
| `AccessTokenContainer` | `#access-token` | element |
| `RefreshTokenContainer` | `#refresh-token` | element |

**Actions**
| Signature |
|-----------|
| `getAccessTokenValue()` |
| `getRefreshTokenValue()` |
| `clickGetAccessTokenButton()` |
| `clickRefreshAccessTokenButton()` |

**Sub-components**
- getAccessTokenContainer
- getRefreshTokenContainer

---

### OneAuthEmbeddingPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `InputUrl` | `#serverUrl` | element |
| `OneAuthLoginButton` | `#oneauthentication` | element |
| `GetCurrentTokenButton` | `#getCurrentToken` | element |
| `RefreshAccessTokenButton` | `#refreshAccessToken` | element |
| `RevokeTokenButton` | `#revokeToken` | element |
| `GetAPISessionsButton` | `#getApiSessions` | element |
| `AccessTokenValue` | `.access-token-value` | element |
| `RefreshTokenValue` | `.refresh-token-value` | element |
| `Response` | `#response` | element |

**Actions**
| Signature |
|-----------|
| `clickOneAuthLoginButton()` |
| `clickGetCurrentTokenButton()` |
| `clickRefreshAccessTokenButton()` |
| `clickRevokeTokenButton()` |
| `clickGetAPISessionsButton()` |
| `waitForPopupWindowDisappear()` |
| `waitForPopupWindowAppear()` |
| `switchToLibraryIframe()` |
| `waitForEmbeddedDossierLoading()` |
| `isDashboardPresent()` |
| `fetchAccessTokenValue()` |
| `fetchRefreshTokenValue()` |
| `fetchResponse()` |
| `changeDashboardURL(url)` |

**Sub-components**
_none_

---

### PingFederateLoginPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `PingHeader` | `.ping-header` | element |
| `UsernameInput` | `#username` | element |
| `PasswordInput` | `#password` | element |
| `SignOnButton` | `#signOnButton` | button |
| `WrongPwError` | `.ping-error` | element |
| `LoginButton` | `.icon-name.trusted-name` | element |

**Actions**
| Signature |
|-----------|
| `clickTrustLoginButton()` |
| `selectDropDown(select, value)` |
| `login(username, password)` |
| `wrongPwError()` |
| `getLoginPageTitle()` |
| `isErrorPresent()` |
| `isPingHeaderPresent()` |

**Sub-components**
_none_

---

### SAMLConfigPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `EntityIdInput` | `#entityId` | element |
| `EntityIdError` | `#entityId\\.errors` | element |
| `BaseURLInput` | `#baseURL` | element |
| `BaseURLError` | `#baseURL\\.errors` | element |
| `BehindProxy` | `#behindProxy` | element |
| `LogoutMode` | `#localLogout` | element |
| `SignatureAlgorithm` | `#signatureAlgorithm` | element |
| `EncryptAssertions` | `#encryptAssertions` | element |
| `DisplayNameInput` | `#displayNameAttributeName` | element |
| `EmailInput` | `#emailAttributeName` | element |
| `DistinguishedNameInput` | `#dnAttributeName` | element |
| `GroupInput` | `#groupAttributeName` | element |
| `GroupFormat` | `#groupFormat` | element |
| `AdminGroupsInput` | `#adminGroups` | element |

**Actions**
| Signature |
|-----------|
| `openSAMLConfigWeb()` |
| `selectDropDown(select, value)` |
| `fillForm({
        entityId, baseUrl, behindProxy, logoutMode, signatureAlgorithm, encryptAssertions, displayNameAttributeName, emailAttributeName, dnAttributeName, groupAttributeName, groupFormat, adminGroups, })` |
| `checkForm({
        entityId = '', baseUrl = browser.options.baseUrl, behindProxy = 'No', logoutMode = 'Local', signatureAlgorithm = 'SHA256WITHRSA', encryptAssertions = 'No', displayNameAttributeName = 'DisplayName', emailAttributeName = 'EMail', dnAttributeName = 'DistinguishedName', groupAttributeName = 'Groups', groupFormat = 'Simple', adminGroups = '', })` |
| `submitForm()` |
| `confirmConfigSucceed()` |
| `confirmEntityIdError()` |
| `confirmBaseURLError()` |
| `confirmLoginSuccessful()` |

**Sub-components**
- waitForPage

---

### SiteMinderLoginPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `login(username, password)` |

**Sub-components**
_none_
