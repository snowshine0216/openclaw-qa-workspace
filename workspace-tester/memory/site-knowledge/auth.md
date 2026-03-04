# Site Knowledge: Auth Domain

## Overview

- **Domain key:** `auth`
- **Components covered:** AzureLoginPage, BasicAuth, ChangePasswordPage, JwtPage, KeycloakLoginPage, LoginPage, OktaLoginPage, OneAuthApiPage, OneAuthEmbeddingPage, PingFederateLoginPage, SAMLConfigPage, SiteMinderLoginPage
- **Spec files scanned:** 240
- **POM files scanned:** 12

## Components

### AzureLoginPage
- **CSS root:** `#lightbox`
- **User-visible elements:**
  - Credential Box (`#lightbox`)
  - Empty Pw Error (`#passwordError`)
  - Left Row Button (`.slick-pre`)
  - Login Button (`#login-credential-button`)
  - Login Message (`#credential-warning`)
  - MSLogo (`.logo`)
  - Right Row Button (`.slick-next`)
  - User Another Account (`#otherTile`)
  - Using User Account In Enter Password Page (`#displayName`)
  - Wrong Pw Error (`#passwordError`)
- **Component actions:**
  - `clickMSLogo()`
  - `clickNextButton()`
  - `clickSkipButton()`
  - `clickYesButton()`
  - `confirmAdminAzureLogin()`
  - `confirmAdminAzureLoginWithoutPrivilege()`
  - `confirmAzureLogin()`
  - `continueAzureLogin(options = {})`
  - `emptyPwError()`
  - `isExitingUserAccountPresent(email)`
  - `isUsernameInputPresent()`
  - `isUsingUserAccountInEnterPasswordPagePresent(email)`
  - `login(email, username, password)`
  - `loginAzureWithAnotherUser()`
  - `loginExistingUser(email)`
  - `loginToAzure(email)`
  - `loginWithBadgeCredentials(username, password)`
  - `loginWithPassword(password)`
  - `logoutExistingUser(email)`
  - `safeContinueAzureLogin(options = {})`
  - `safeLoginToAzure(email)`
  - `signInWithAnotherUser()`
  - `wrongPwError()`
- **Related components:** getUsingUserAccountInEnterPasswordPage

### BasicAuth
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `getBasicAuthResopne(url, auth = '')`
  - `getNtlmAuthResponse(url, auth = { username: '', password: '' })`
- **Related components:** _none_

### ChangePasswordPage
- **CSS root:** `#changePwdButton`
- **User-visible elements:**
  - Change Password Error Box (`.mstrd-MessageBox-main`)
  - Change Password Loading (`.loading-spinner`)
  - Change Pwd Container (`#changePwdButton`)
  - Change Pwd Footer (`#changePwdFooter`)
  - Done Button (`#changePwdButton`)
  - Done Button Disabled (`#changePwdButton.disabledLogin`)
- **Component actions:**
  - `changePassword(oldPassword, newPassword, confirmPassword)`
  - `changePasswordErrorMsg()`
  - `changePasswordFinished()`
  - `changePasswordWithInvalidCredentials()`
  - `clearPasswordForm()`
  - `dismissChangePasswordErrorMessage()`
  - `enterPassword(oldPassword, newPassword, confirmPassword)`
  - `getChangePwdFooterText()`
  - `isChangePasswordDisplayed()`
  - `isChangePasswordErrorBoxDisplayed()`
  - `isDoneButtonClickable()`
  - `login(credentials = { username: '', password: '' })`
  - `waitForChangePwdView()`
- **Related components:** getChangePwdContainer, loginPage

### JwtPage
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `testJWTConfigSetup(userCredentials, baseUrl, algorithm, customPayload = {}, customConfig = {})`
  - `testJWTLogin(baseUrl, jwtToken, algorithm)`
- **Related components:** _none_

### KeycloakLoginPage
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `login(username, password)`
  - `safeContinueKeycloakLogin()`
- **Related components:** _none_

### LoginPage
- **CSS root:** `.credsLoginContainer`
- **User-visible elements:**
  - Creds Login Container (`.credsLoginContainer`)
  - Guest Icon (`.login-icons.icon-guest`)
  - Kerberos Login Icon (`.icon-integrated`)
  - LDAPMode (`#LDAPModeLabel`)
  - Login Button (`#loginButton`)
  - Login Error Box (`.mstrd-MessageBox-main`)
  - OIDCLogin Icon (`.icon-name.oidc-name`)
  - Pendo Tutorial (`._pendo-step-container-size`)
  - Pendo Tutorial Close Button (`._pendo-close-guide`)
  - Ping Header (`.ping-header`)
  - Qr Code (`.QR`)
  - Saml Login Icon (`.icon-name.saml-name`)
  - Standard Mode (`#StandardModeLabel`)
  - Trusted Login Button (`.icon-name.trusted-name`)
  - Trusted Login Icon (`.icon-name.trusted-name`)
  - Username Form (`#username`)
- **Component actions:**
  - `basicOktaLogin(credentials = { username: '', password: '' })`
  - `clearCredentials()`
  - `clearLoginAndPassword()`
  - `clickLoginButtonInSessionTimeoutAlert()`
  - `disablePendoTutorial()`
  - `disableTutorial()`
  - `dismissLoginErrorMessage()`
  - `enableABAlocator()`
  - `getLibraryVersion(libraryUrl = appId ? browser.options.baseUrl.split('app/')`
  - `integratedLogin(credentials = { username: '', password: '' }, type)`
  - `isLoginPageDisplayed()`
  - `isOIDCLoginButtonDisplayed()`
  - `isOIDCLoginButtonDisplayed()`
  - `isOktaUsernameDisplayed()`
  - `isSAMLLoginButtonDisplayed()`
  - `isStandardModeSelected()`
  - `ldapLogin(credentials = { username: '', password: '' })`
  - `login(credentials = { username: '', password: '' }, options = { mode: 'standard', type: '', waitForLoading: true })`
  - `loginAsGuest()`
  - `loginToEditMode(credentials = { username: '', password: '' })`
  - `loginWithInvalidCredentials()`
  - `loginWithoutWait(credentials = { username: '', password: '' })`
  - `oidcRelogin()`
  - `oktaLogin(credentials = { username: '', password: '' })`
  - `oktaWrongPwError()`
  - `relogin(credentials = { username: '', password: '' }, options = { mode: 'standard', type: '' })`
  - `saasLogin(credentials = { username: '', password: '' })`
  - `samlRelogin()`
  - `standardInputCredential(credentials = { username: '', password: '' })`
  - `standardLogin(credentials = { username: '', password: '' })`
  - `switchToStandardTab()`
  - `trustedLogin(credentials = { username: '', password: '' }, type)`
  - `trustedRelogin()`
  - `waitForLoginErrorBox()`
  - `waitForLoginView()`
  - `waitForMSTRProjectListAppear()`
  - `waitForTrustedLoginButton()`
- **Related components:** azureLoginPage, getCredsLoginContainer, getPage, oktaLoginPage, pingFederateLoginPage, siteMinderLoginPage, waitForPage

### OktaLoginPage
- **CSS root:** `#okta-signin-submit`
- **User-visible elements:**
  - Okta Signin Button (`#okta-signin-submit`)
- **Component actions:**
  - `basicOktaLogin(credentials = { username: '', password: '' })`
  - `isInvalidCredentials()`
  - `isOktaUsernameDisplayed()`
  - `oktaLogin(credentials = { username: '', password: '' })`
  - `oktaWrongPwError()`
- **Related components:** _none_

### OneAuthApiPage
- **CSS root:** `#access-token`
- **User-visible elements:**
  - Access Token Button (`button=Get token`)
  - Access Token Container (`#access-token`)
  - Refresh Token Button (`button=Refresh token`)
  - Refresh Token Container (`#refresh-token`)
- **Component actions:**
  - `clickGetAccessTokenButton()`
  - `clickRefreshAccessTokenButton()`
  - `getAccessTokenValue()`
  - `getRefreshTokenValue()`
- **Related components:** getAccessTokenContainer, getRefreshTokenContainer

### OneAuthEmbeddingPage
- **CSS root:** `.access-token-value`
- **User-visible elements:**
  - Access Token Value (`.access-token-value`)
  - Get APISessions Button (`#getApiSessions`)
  - Get Current Token Button (`#getCurrentToken`)
  - Input Url (`#serverUrl`)
  - One Auth Login Button (`#oneauthentication`)
  - Refresh Access Token Button (`#refreshAccessToken`)
  - Refresh Token Value (`.refresh-token-value`)
  - Response (`#response`)
  - Revoke Token Button (`#revokeToken`)
- **Component actions:**
  - `changeDashboardURL(url)`
  - `clickGetAPISessionsButton()`
  - `clickGetCurrentTokenButton()`
  - `clickOneAuthLoginButton()`
  - `clickRefreshAccessTokenButton()`
  - `clickRevokeTokenButton()`
  - `fetchAccessTokenValue()`
  - `fetchRefreshTokenValue()`
  - `fetchResponse()`
  - `isDashboardPresent()`
  - `switchToLibraryIframe()`
  - `waitForEmbeddedDossierLoading()`
  - `waitForPopupWindowAppear()`
  - `waitForPopupWindowDisappear()`
- **Related components:** _none_

### PingFederateLoginPage
- **CSS root:** `.icon-name.trusted-name`
- **User-visible elements:**
  - Login Button (`.icon-name.trusted-name`)
  - Password Input (`#password`)
  - Ping Header (`.ping-header`)
  - Sign On Button (`#signOnButton`)
  - Username Input (`#username`)
  - Wrong Pw Error (`.ping-error`)
- **Component actions:**
  - `clickTrustLoginButton()`
  - `getLoginPageTitle()`
  - `isErrorPresent()`
  - `isPingHeaderPresent()`
  - `login(username, password)`
  - `selectDropDown(select, value)`
  - `wrongPwError()`
- **Related components:** _none_

### SAMLConfigPage
- **CSS root:** `#adminGroups`
- **User-visible elements:**
  - Admin Groups Input (`#adminGroups`)
  - Base URLError (`#baseURL\\.errors`)
  - Base URLInput (`#baseURL`)
  - Behind Proxy (`#behindProxy`)
  - Display Name Input (`#displayNameAttributeName`)
  - Distinguished Name Input (`#dnAttributeName`)
  - Email Input (`#emailAttributeName`)
  - Encrypt Assertions (`#encryptAssertions`)
  - Entity Id Error (`#entityId\\.errors`)
  - Entity Id Input (`#entityId`)
  - Group Format (`#groupFormat`)
  - Group Input (`#groupAttributeName`)
  - Logout Mode (`#localLogout`)
  - Signature Algorithm (`#signatureAlgorithm`)
- **Component actions:**
  - `checkForm({
        entityId = '', baseUrl = browser.options.baseUrl, behindProxy = 'No', logoutMode = 'Local', signatureAlgorithm = 'SHA256WITHRSA', encryptAssertions = 'No', displayNameAttributeName = 'DisplayName', emailAttributeName = 'EMail', dnAttributeName = 'DistinguishedName', groupAttributeName = 'Groups', groupFormat = 'Simple', adminGroups = '', })`
  - `confirmBaseURLError()`
  - `confirmConfigSucceed()`
  - `confirmEntityIdError()`
  - `confirmLoginSuccessful()`
  - `fillForm({
        entityId, baseUrl, behindProxy, logoutMode, signatureAlgorithm, encryptAssertions, displayNameAttributeName, emailAttributeName, dnAttributeName, groupAttributeName, groupFormat, adminGroups, })`
  - `openSAMLConfigWeb()`
  - `selectDropDown(select, value)`
  - `submitForm()`
- **Related components:** waitForPage

### SiteMinderLoginPage
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `login(username, password)`
- **Related components:** _none_

## Common Workflows (from spec.ts)

1. SAML Azure (used in 6 specs)
2. SAML Azure Global Logout (used in 6 specs)
3. Test One Authentication through embedding (used in 6 specs)
4. Authentication - OIDC (used in 4 specs)
5. Change Password (used in 4 specs)
6. E2E Library of OIDC Azure (used in 4 specs)
7. JWT REST API Tests (used in 4 specs)
8. Library OIDC login with user system prompt & nested group (used in 4 specs)
9. Multi SSO - Switch Custom app (used in 4 specs)
10. OIDC Azure Global Logout (used in 4 specs)
11. Trust PingFederate (used in 4 specs)
12. Trust SiteMinder (used in 4 specs)
13. [BCSA-2440_1] should process ESM system prompts (used in 2 specs)
14. [BCSA-2440_10] should read persist system prompt header false (used in 2 specs)
15. [BCSA-2440_2] should process SSO system prompt (used in 2 specs)
16. [BCSA-2440_3] should process both ESM and SSO text system prompt (used in 2 specs)
17. [BCSA-2440_4] should process special characters in text system prompt (used in 2 specs)
18. [BCSA-2440_5] should skip empty system prompt (used in 2 specs)
19. [BCSA-2440_6] should skip invalid system prompt json format (used in 2 specs)
20. [BCSA-2440_7] should skip invalid base64 encoded system prompt string (used in 2 specs)
21. [BCSA-2440_8] should skip unknown system prompt header (used in 2 specs)
22. [BCSA-2440_9] should read persist system prompt header true (used in 2 specs)
23. [BCSA-2578_01] Validate login workflow | impersonate SSO OIDC login (used in 2 specs)
24. [BCSA-2578_02] Validate login workflow | impersonate SSO standard user login (used in 2 specs)
25. [BCSA-2578_03] Validate login workflow | impersonate SSO OIDC login - disable iserver setting (used in 2 specs)
26. [BCSA-2578_04] Validate login workflow | impersonate SSO OIDC login - disable iserver standard persist sso setting (used in 2 specs)
27. [BCSA-2578_05] Validate login workflow | impersonate SSO standard user login (used in 2 specs)
28. [BCSA-2578_06] Validate login workflow | impersonate SSO standard user login (used in 2 specs)
29. [BCSA-2843_01] set JWT security filter template and open report (used in 2 specs)
30. [BCSA-2843_02] set JWT security filter template and open report - change user (used in 2 specs)
31. [BCSA-2843_03] set JWT security filter template and open report - user Not exist no data return (used in 2 specs)
32. [BCSA-2843_04] set JWT security filter template and open report - filter by date (used in 2 specs)
33. [BCSA-2843_05] set JWT security filter template and open report - error configure Attribute (used in 2 specs)
34. [BCSA-2843_06] set JWT security filter template and open report - multi project (used in 2 specs)
35. [BCSA-2843_07] set JWT security filter template and open report - multi project PA (used in 2 specs)
36. [BCSA-2843_08] set JWT security filter template and open report - include invalid/not exist project id (used in 2 specs)
37. [BCSA-2933_1] should return 204 and original session id (used in 2 specs)
38. [BCSA-2933_2] should return 401 when session has been deleted (used in 2 specs)
39. [BCSA-3075_1] should login successfully and import user information correctly (used in 2 specs)
40. [BCSA-3078_1] should successfully set SAML configuration (used in 2 specs)
41. [BCSA-3078_1] Validate Library SAML Login with Locale (used in 2 specs)
42. [BCSA-3078_2] should successfully get SAML configuration (used in 2 specs)
43. [BCSA-3078_3] should successfully update SAML configuration (used in 2 specs)
44. [BCSA-3103_01] should reject invalid group format (used in 2 specs)
45. [BCSA-3103_02] should accept valid group format - simple (used in 2 specs)
46. [BCSA-3103_03] should accept valid group format - distinguishedName (used in 2 specs)
47. [BCSA-3103_04] should accept valid config with optional properties only (used in 2 specs)
48. [BCSA-3103_05] should reject config with missing required claimMap.userId (used in 2 specs)
49. [BCSA-3103_06] should reject deletion of server IAM configuration (used in 2 specs)
50. [BCSA-3166_01] Validate OIDC authentication workflow on OKTA with DN (used in 2 specs)
51. [BCSA-3166_02] Validate OIDC trusted id (used in 2 specs)
52. [BCSA-3166_03] Validate OIDC DN (used in 2 specs)
53. [BCSA-3166_04] Validate oidc group distinguished name (used in 2 specs)
54. [BCSA-3166_05] Validate oidc group distinguished name with second group (used in 2 specs)
55. [BCSA-3166] Validate Trust authentication on PingFederate with DN (used in 2 specs)
56. [BCSA-3167_01] Validate Trust import with new parameters (used in 2 specs)
57. [BCSA-3167_02] Validate Trust import with new parameters (used in 2 specs)
58. [BCSA-3167_03] Validate Trust import with new parameters (used in 2 specs)
59. [BCSA-3167_04] Validate Trust import with new parameters (used in 2 specs)
60. [BCSA-3167_05] Validate Trust import with new parameters (used in 2 specs)
61. [BCSA-3167_06] Validate Trust import with new parameters (used in 2 specs)
62. [BCSA-3324_1] JWT token in URL header with custom language - (en-US) (used in 2 specs)
63. [BCSA-3324_1] should successfully set JWT configuration with language claims (en-US) (used in 2 specs)
64. [BCSA-3324_2] should verify JWT token login with language claim (en-US) (used in 2 specs)
65. [BCSA-3324_3] should successfully set JWT configuration with language claims (zh-CN) (used in 2 specs)
66. [BCSA-3324_4] should verify JWT token login with language claim (zh-CN) (used in 2 specs)
67. [BCSA-3331_01] should successfully update OIDC configuration with language mappings (used in 2 specs)
68. [BCSA-3331_1] Validate Library OIDC Login with Locale (used in 2 specs)
69. [TC15683] LDAP Authentication when is not configured (used in 2 specs)
70. [TC16580] Password Change on Login Page (used in 2 specs)
71. [TC20458] Opening a dossier from shared url through guest only authentication mode skips redirection to the corresponding dossier page (used in 2 specs)
72. [TC24651] Standard mode - Seamless login - library to web (used in 2 specs)
73. [TC4280] Sanity test on Map Attribute in datasets panel (used in 2 specs)
74. [TC4990] Sanity test on Link Attribute in datasets panel (used in 2 specs)
75. [TC4992] Dataset Display: Expand/Collapse with Pause Mode - Regression (used in 2 specs)
76. [TC4992] should handle Table/Flat View with pause mode and undo/redo operations (used in 2 specs)
77. [TC58143] Map Attribute regression test (used in 2 specs)
78. [TC60987-1] should switch between Table View and Flat View (used in 2 specs)
79. [TC60987-2] should collapse and expand all datasets (used in 2 specs)
80. [TC60987-3] should handle multiple datasets collapse/expand behavior (used in 2 specs)
81. [TC60987] Dataset Display: Expand/Collapse, Flat/Table View - Acceptance (used in 2 specs)
82. [TC60993_1] Test the context menu of Report dataset_Edit, Show data, Join, Replace (used in 2 specs)
83. [TC60993_2] Test the context menu of Report dataset_Add Metric, Attribute (used in 2 specs)
84. [TC60993_3] Test the context menu of Report dataset_Rename, Delete (used in 2 specs)
85. [TC60993_4] Test the context menu of Report dataset_Save as (used in 2 specs)
86. [TC65185] [TC74332] Standard mode login end-to-end workflow (used in 2 specs)
87. [TC65239] Guest Authentication testing - Login, logout functionality testing (used in 2 specs)
88. [TC65242] Integrated Authentication (Kerberos) - Login, logout (used in 2 specs)
89. [TC72260] Validate Trust authentication on PingFederate (used in 2 specs)
90. [TC74331] Standard Authentication testing - Verify error handling while login with invalid user credentials (used in 2 specs)
91. [TC74334] Standard Authentication testing - Verify responsiveness with end-to-end login workflow on Library web (used in 2 specs)
92. [TC75965] test login with invalid and valid credential (used in 2 specs)
93. [TC75966] Initial testing - Login into Azure Server (used in 2 specs)
94. [TC75967] Verify Library Web OIDC Authentication - Okta (used in 2 specs)
95. [TC75973]: Verify Library Web OIDC login with user who has no web privilege (used in 2 specs)
96. [TC75973]: Verify Library Web OIDC login with user who has no web privilege - Jboss (used in 2 specs)
97. [TC75976]: Verify OIDC authentication (used in 2 specs)
98. [TC76145] Validate tomcat basic authentication on Library saml config page (used in 2 specs)
99. [TC76796]: Verify non-admin user cannot access Library Web Admin page by OIDC authentication (used in 2 specs)
100. [TC76948_01] test valid SAML config with all fields edited (used in 2 specs)
101. [TC76948_02] test valid SAML config with some fields edited (used in 2 specs)
102. [TC76948_03] test valid SAML config with valid empty fields edited (used in 2 specs)
103. [TC76948_04] invalid test SAML config with empty entity ID and/or base URL (used in 2 specs)
104. [TC76948_05] test valid SAML config with javascript alerts as values (used in 2 specs)
105. [TC76948_06] test valid SAML config with special characters as values (used in 2 specs)
106. [TC76948] Verify Library Web SAML configuration page (used in 2 specs)
107. [TC78247] (used in 2 specs)
108. [TC78843] Validate SAML URL WhiteList (used in 2 specs)
109. [TC79614] Validate Library SAML authentication workflow on Tomcat (used in 2 specs)
110. [TC79615] Validate SAML authentication workflow on JBoss (used in 2 specs)
111. [TC79618] Validate Library admin page is protected by SAML authentication after enable SAML (used in 2 specs)
112. [TC79620] Validate Library admin page is not accessible for non-privilege user after enable SAML (used in 2 specs)
113. [TC80230][Tanzu] Library Web - OIDC Authentication (used in 2 specs)
114. [TC80233] [Tanzu] Library Web - SAML Authentication (used in 2 specs)
115. [TC80553] Verify error handling when password does not meet the policy in developer in Library (used in 2 specs)
116. [TC80561] Check change password workflow when password is expired (used in 2 specs)
117. [TC80562] Verify error handling when user does not have use Library privilege after changing password (used in 2 specs)
118. [TC82050] [Tanzu] Library Web - Change password (used in 2 specs)
119. [TC82085_01] Validate SAML authentication workflow on local MCG (used in 2 specs)
120. [TC82085_02]: Verify Library Web OIDC login in local MCG environment (used in 2 specs)
121. [TC82419] Verify SAML Single logout on Library Web - Tomcat&Azure (used in 2 specs)
122. [TC82421] Verify SAML Single logout on Library Web - WebLogic&Okta (used in 2 specs)
123. [TC83569] Verify library web i18N of login UI (used in 2 specs)
124. [TC83661] Verify SAML Single logout on Library Web - Tomcat&PingFederate (used in 2 specs)
125. [TC83662] Validate SAML authentication on PingFederate (used in 2 specs)
126. [TC83694] Verify SAML Single logout on Library Web when custom app (used in 2 specs)
127. [TC84178_01] [Tanzu] Library Web - SAML Single Logout (used in 2 specs)
128. [TC84178_02] [Tanzu] Library Web - SAML Single Logout when custom app (used in 2 specs)
129. [TC84535] Trust mode - Seamless login - library to web (used in 2 specs)
130. [TC84708] ASP Seamless login - library to web (used in 2 specs)
131. [TC85237] Verify locale settings function with Guest authentication modes in Library Web (used in 2 specs)
132. [TC85530] Validate standard login workflow when LDAP is set as default (used in 2 specs)
133. [TC85533] Validate SAML login workflow when SAML is set as default in server multiple modes (used in 2 specs)
134. [TC85536] - Session timeout when guest is set as default in server multiple modes (used in 2 specs)
135. [TC85552] Validate OIDC login workflow when LDAP is set as default in server multiple modes (used in 2 specs)
136. [TC85553] Validate guest login workflow when guest is set as default in server multiple modes (used in 2 specs)
137. [TC86211] Validate switch custom app workflow for guest user (used in 2 specs)
138. [TC86231] Validate OIDC login workflow when OIDC is set as default in server multiple modes (used in 2 specs)
139. [TC86233] Validate switch from SAML user to standard user (used in 2 specs)
140. [TC86287] Validate login workflow | Login custom app when it is set to server level auth mode (used in 2 specs)
141. [TC86288] Validate login workflow | Login custom app when it is set to specific auth mode - SAML single logout (used in 2 specs)
142. [TC86289] Validate login workflow | Login custom app when it is set to specific auth mode - standard (used in 2 specs)
143. [TC86290] Validate login workflow | Login custom app when it is set to specific auth mode - OIDC (used in 2 specs)
144. [TC86292] Validate login workflow | Login dossier in custom app (used in 2 specs)
145. [TC86293] Validate login workflow | Login custom app by user without privilege (used in 2 specs)
146. [TC86294] Validate switch app workflow | Switch from default app to specific custom app (used in 2 specs)
147. [TC86295] Validate switch app workflow | Switch from custom app to another custom app with different auth mode (used in 2 specs)
148. [TC86296] Validate switch app workflow | Switch from custom app to default app (used in 2 specs)
149. [TC86303] Validate custom app can only use trusted mode when server is set to trusted mode (used in 2 specs)
150. [TC86304] Validate no logout button when there is only guest mode (used in 2 specs)
151. [TC86305] Validate switch app workflow | Switch from custom app to default app with only guest mode (used in 2 specs)
152. [TC86306] Login custom app with server mode - Kerberos (used in 2 specs)
153. [TC86312] Login as std user in custom app, session timeout, open a dossier (used in 2 specs)
154. [TC86313_01] Before user login, change custom app auth mode (used in 2 specs)
155. [TC86313_02] After user login, change custom app auth mode (used in 2 specs)
156. [TC86314] Validate login custom app with user must change password (used in 2 specs)
157. [TC86334] Validate error handling case | SAML/OIDC is not configured (used in 2 specs)
158. [TC86336] Validate login workflow | Login custom app when it is set to specific auth mode - SAML local logout (used in 2 specs)
159. [TC86342] When there are multiple modes and user login as guest, show log in button in account menu (used in 2 specs)
160. [TC86343] Validate login workflow |login custom app with unexisting/invalid ID (used in 2 specs)
161. [TC86562] Verify locale settings function with Standard authentication modes in Library Web (used in 2 specs)
162. [TC86639] Verify locale settings function with Trusted authentication modes in Library Web (used in 2 specs)
163. [TC86640] Verify locale settings function with SAML authentication modes in Library Web (used in 2 specs)
164. [TC86641] Verify locale settings function with OIDC authentication modes in Library Web (used in 2 specs)
165. [TC86642] Verify locale settings function with Standard authentication modes in Library Web (used in 2 specs)
166. [TC87661] Switch user after logging out and applying a new link with specified dossier (used in 2 specs)
167. [TC87662] - Session timeout from dossier, back to login page and relogin as different user (used in 2 specs)
168. [TC87673] Return 403 forbidden for URL /admin.jsp (used in 2 specs)
169. [TC88967] Verify OIDC Global logout on Library Web - Tomcat&Azure (used in 2 specs)
170. [TC88969] Verify OIDC Global logout on Library Web - Weblogic & Okta (used in 2 specs)
171. [TC88971] Verify OIDC Global logout on Library Web when custom app (used in 2 specs)
172. [TC89102] Verify OIDC Global logout on Library Web will not influence MSTR session (used in 2 specs)
173. [TC89121] Verify 400 error page when send incorrect logout request (used in 2 specs)
174. [TC89130] Verify the decryption of state in Library Web Global Logout (used in 2 specs)
175. [TC89470][Tanzu] Library Web - Verify Library Web OIDC Global Logout (used in 2 specs)
176. [TC89723] Trust mode - Seamless login - library to web (used in 2 specs)
177. [TC89724] Validate Trust authentication on SiteMinder (used in 2 specs)
178. [TC90295] Verify Library Web Admin page can be protected by OIDC authentication after enable OIDC and non-SSO (used in 2 specs)
179. [TC90295]: Verify Library Web Admin page can be protected by OIDC authentication after enable OIDC and non-SSO (used in 2 specs)
180. [TC90333_01] Login admin page with SAML first, then enter library web directly (used in 2 specs)
181. [TC90333_02] Login library web with SAML first, then enter admin page directly (used in 2 specs)
182. [TC90333_03] Login library web with STD first, then admin page need SAML to login (used in 2 specs)
183. [TC91419] guest only in default app, session timeout, open a dossier (used in 2 specs)
184. [TC91420] Login as SAML in custom app, session timeout, open a dossier (used in 2 specs)
185. [TC91421] Login as SAML in default app, session timeout, switch to SAML default app (used in 2 specs)
186. [TC91460] - Logout from dossier and relogin as current user (used in 2 specs)
187. [TC91461] - Logout from dossier and relogin as different user (used in 2 specs)
188. [TC91463] - Logout from dossier, apply dossier link and relogin as current user (used in 2 specs)
189. [TC91464] - Logout from dossier, apply dossier link and relogin as different user (used in 2 specs)
190. [TC91465] - Session timeout from dossier and relogin as current user (used in 2 specs)
191. [TC91466] - Session timeout from dossier and relogin as different user (used in 2 specs)
192. [TC91467] - Session timeout from dossier, directly apply a dossier link and relogin as current user (used in 2 specs)
193. [TC91468] - Session timeout from dossier, directly apply a dossier link and relogin as different user (used in 2 specs)
194. [TC91469] - Session timeout from dossier, back to login page and relogin as current user (used in 2 specs)
195. [TC91470] guest only in custom app, session timeout, switch to other auth mode (used in 2 specs)
196. [TC91472] std user in custom app, session timeout, switch to guest only custom app (used in 2 specs)
197. [TC91473] Login as SAML user in custom app, session timeout, switch to non-SAML default app (used in 2 specs)
198. [TC91474] Login as SAML user in custom app, session timeout, switch to SAML default app (used in 2 specs)
199. [TC91475] Login as SAML in default app, session timeout, logout (used in 2 specs)
200. [TC91476] Login as SAML in default app, session timeout, open dossier (used in 2 specs)
201. [TC91477] Login as SAML in default app, session timeout, switch to non-SAML default app (used in 2 specs)
202. [TC91478] Login as std user in custom app, session timeout, logout (used in 2 specs)
203. [TC91479] Login as std user in custom app, session timeout, switch app (used in 2 specs)
204. [TC92441] Verify login success case with single session restrict flag on - session not exists (used in 2 specs)
205. [TC92450] Check error handling UI with single session restrict flag on (used in 2 specs)
206. [TC92466] Check cross function cases with single session restrict flag on (used in 2 specs)
207. [TC93547] Check login successful with single session restrict flag on (used in 2 specs)
208. [TC95014] Check X-Content-Tyepe-Options in saml/authenticate (used in 2 specs)
209. [TC95178_1] Validate login workflow | Multi SSO | Single Auth | Login custom app with OIDC specific registration (used in 2 specs)
210. [TC95178_2] Validate login workflow | Multi SSO | Multi Auth | Login custom app with Standard + OIDC specific registration (used in 2 specs)
211. [TC95178_3] Validate login workflow | Multi SSO | Single Auth | Login custom app (dossier as home) with OIDC specific registration (used in 2 specs)
212. [TC95178_4] Validate login workflow | Multi SSO | Single Auth | Login dossier share link with OIDC specific registration (used in 2 specs)
213. [TC95178_5] Validate login workflow | Multi SSO | Single Auth | Login custom app with SAML specific registration (used in 2 specs)
214. [TC95178_6] Validate login workflow | Multi SSO | Multi Auth | Login custom app with Standard + SAML specific registration (used in 2 specs)
215. [TC96516_01] Error handling | Multi SSO | OIDC with invalid Config (used in 2 specs)
216. [TC96516_02] Error handling | Multi SSO | SAML with invalid Config (used in 2 specs)
217. [TC96518_01] Validate switch app workflow | Multi SSO | Switch from SAML Default App to SAML App LeveL Custom App (used in 2 specs)
218. [TC96518_02] Validate switch app workflow | Multi SSO | Switch from SAML App Level Custom App to SAML Default App Custom App (used in 2 specs)
219. [TC96518_03] Validate switch app workflow | Multi SSO | Switch from SAML App Level Custom App to SAML APP Level Custom App (used in 2 specs)
220. [TC96518_04] Validate switch app workflow | Multi SSO | Switch from SAML App Level Custom App to OIDC APP Level Custom App (used in 2 specs)
221. [TC96518_05] Validate switch app workflow | Multi SSO | Session Expired | Switch from Default App to OIDC APP Level Custom App (used in 2 specs)
222. [TC96518_06] Validate switch app workflow | Multi SSO | Session Expired | Switch from OIDC APP Level Custom App to Default App (used in 2 specs)
223. [TC96518_07] Validate switch app workflow | Multi SSO | Session Expired | Switch from OIDC APP Level Custom App to SAML APP Level Custom App (used in 2 specs)
224. [TC96519_01] Multi SSO | Multi Tab | login server SSO app -> open app SSO url - no need to login (used in 2 specs)
225. [TC96519_02] Multi SSO | Multi Tab | login app SSO -> server SSO - no need to login (used in 2 specs)
226. [TC96519_03] Multi SSO | Multi Tab | login app SSO -> app SSO - no need to login (used in 2 specs)
227. [TC96519_04] Multi SSO | Multi Tab | logout from 1 tab - all tab logout (used in 2 specs)
228. [TC96520_01] Validate logout workflow | Multi SSO | Verify OIDC local logout on Library Web (used in 2 specs)
229. [TC96520_02] Validate logout workflow | Multi SSO | Verify OIDC global logout on Library Web (used in 2 specs)
230. [TC96520_03] Validate logout workflow | Multi SSO | Verify SAML local logout on Library Web (used in 2 specs)
231. [TC96520_04] Validate logout workflow | Multi SSO | Verify SAML global logout on Library Web (used in 2 specs)
232. [TC96782] check OIDC Login and relogin with new OIDCConfigure.json (used in 2 specs)
233. [TC96783] check text and numeric system prompt with dossier (used in 2 specs)
234. [TC96784] Verify error handling of OIDC user claim mapping and user group (used in 2 specs)
235. [TC97137_01] Login as SAML in default app, session timeout, logout button (used in 2 specs)
236. [TC97137] user login status check when saml group is delete when session timeout and JWT still valid case (used in 2 specs)
237. [TC97176_01] Verify one auth login - oauth2/authorize (used in 2 specs)
238. [TC97176_02] Verify refresh access token using refresh token - oauth2/token (used in 2 specs)
239. [TC97176_03] Verify revoke refresh token - oauth2/revoke (used in 2 specs)
240. [TC97176_04] Verify one auth login after revoke (used in 2 specs)
241. [TC97240_00] Multi SSO | SSO feature flag on - OIDC registration in user SSO scope (used in 2 specs)
242. [TC97240_01] Multi SSO | SSO feature flag on - OIDC registration not in user SSO scope (used in 2 specs)
243. [TC97240_02] Multi SSO | SSO feature flag on - SAML registration in user SSO scope (used in 2 specs)
244. [TC97240_03] Multi SSO | SSO feature flag on - SAML registration not in user SSO scope (used in 2 specs)
245. [TC97681] switch user - no filter on age and gender (used in 2 specs)
246. [TC97682] check date system prompt with document (used in 2 specs)
247. [TC97683] check OIDC seamless login to BIWeb (used in 2 specs)
248. [TC97685] check date system prompt with document - not in group (used in 2 specs)
249. [TC97686] check system prompt with report filter (used in 2 specs)
250. [TC97687] check system prompt with report filter - change user (used in 2 specs)
251. [TC97691] Verify nested group with OIDC login (used in 2 specs)
252. [TC97780_01] Verify one auth login api - oauth2/authorize (used in 2 specs)
253. [TC97780_02] Verify refresh access token using refresh token api - oauth2/token (used in 2 specs)
254. [TC97780_03] Verify revoke refresh token api - oauth2/revoke (used in 2 specs)
255. [TC97817] Login as OIDC, features.sessionTimeoutNotificationForSSO = true, session timeout, show alert (used in 2 specs)
256. [TC99103_1] check SAML Login and relogin with new MstrConfig.xml (used in 2 specs)
257. [TC99103_2] check SAML seamless login to BIWeb (used in 2 specs)
258. [TC99103_3] check SAML text and numeric system prompt with dossier (used in 2 specs)
259. [TC99103_4] check SAML date system prompt with document (used in 2 specs)
260. [TC99103_5] check SAML relay state (used in 2 specs)
261. [TC99127_01] Verify one auth login - oauth2/authorize (used in 2 specs)
262. [TC99127_02] Verify refresh access token using refresh token - oauth2/token not set refresh token (used in 2 specs)
263. [TC99196_01] Verify one auth login - get accessToken and refresh Token (used in 2 specs)
264. [TC99196_02] Verify refresh access token using refresh token (used in 2 specs)
265. [TC99196_03] Verify one auth login - get user info with access token (used in 2 specs)
266. [TC99196_04] Verify one auth login - get user info with refreshed access token (used in 2 specs)
267. [TC99196_05] Verify one auth login - could not login with invalid access token (used in 2 specs)
268. [TC99449_01] F43390 Copy from Auto to Auto (used in 2 specs)
269. [TC99449_02] F43390 Copy from Auto to Freeform (used in 2 specs)
270. [TC99449_03] F43390 Copy from Freeform to Auto (used in 2 specs)
271. [TC99449_04] F43390 Copy from Freeform to Freeform (used in 2 specs)
272. [TC99449_05] F43390 Check the copied containers in Consumption mode (used in 2 specs)
273. [TC99450_01] F43390 Copy from Auto to NewPage/NewChapter/OtherPage (used in 2 specs)
274. [TC99450_02] F43390 Copy from Freeform to NewPage/NewChapter/OtherPage (used in 2 specs)
275. [TC99450_03] Invalid multi-selections copy (used in 2 specs)
276. [TC99454_01] F43366 Resize a group of containers in authoring mode (used in 2 specs)
277. [TC99454_02] F43366 Check the resized groups in Consumption mode (used in 2 specs)
278. [TC99523_1] should successfully get JWT configuration (used in 2 specs)
279. [TC99523_2] should handle JWT configuration API errors gracefully (used in 2 specs)
280. [TC99523_3] should validate JWT configuration response format (used in 2 specs)
281. [TC99524_01] set JWT configuration and login with RS256 token (used in 2 specs)
282. [TC99524_02] JWT token in URL header and open dashboard directly _ PS384 token (used in 2 specs)
283. [TC99524_03] JWT token in URL header with custom application _ ES512 (used in 2 specs)
284. [TC99524_1] should successfully set JWT configuration with RS256 token (used in 2 specs)
285. [TC99524_2] should verify JWT token login authentication with RS256 (used in 2 specs)
286. [TC99525_1] should successfully set JWT configuration with RS384 token (used in 2 specs)
287. [TC99525_2] should verify JWT token login authentication with RS384 (used in 2 specs)
288. [TC99526_1] should successfully set JWT configuration with RS512 token (used in 2 specs)
289. [TC99526_2] should verify JWT token login authentication with RS512 (used in 2 specs)
290. [TC99527_1] should successfully set JWT configuration with PS256 token (used in 2 specs)
291. [TC99527_2] should verify JWT token login authentication with PS256 (used in 2 specs)
292. [TC99528_1] should successfully set JWT configuration with PS384 token (used in 2 specs)
293. [TC99528_2] should verify JWT token login authentication with PS384 (used in 2 specs)
294. [TC99529_1] should successfully set JWT configuration with PS512 token (used in 2 specs)
295. [TC99529_2] should verify JWT token login authentication with PS512 (used in 2 specs)
296. [TC99530_1] should successfully set JWT configuration with ES256 token (used in 2 specs)
297. [TC99530_2] should verify JWT token login authentication with ES256 (used in 2 specs)
298. [TC99531_1] should successfully set JWT configuration with ES384 token (used in 2 specs)
299. [TC99531_2] should verify JWT token login authentication with ES384 (used in 2 specs)
300. [TC99532_1] should successfully set JWT configuration with ES512 token (used in 2 specs)
301. [TC99532_2] should verify JWT token login authentication with ES512 (used in 2 specs)
302. [TC99533_1] should successfully set JWT configuration with HS256 token (used in 2 specs)
303. [TC99533_2] should verify JWT token login authentication with HS256 (used in 2 specs)
304. [TC99534_1] should successfully set JWT configuration with HS384 token (used in 2 specs)
305. [TC99534_2] should verify JWT token login authentication with HS384 (used in 2 specs)
306. [TC99535_1] should successfully set JWT configuration with HS512 token (used in 2 specs)
307. [TC99535_2] should verify JWT token login authentication with HS512 (used in 2 specs)
308. [TC99536_1] should reject HS256 config when secret length < 256 bits (used in 2 specs)
309. [TC99536_2] should reject HS384 config when secret length < 384 bits (used in 2 specs)
310. [TC99536_3] should reject HS512 config when secret length < 512 bits (used in 2 specs)
311. [TC99536_4] should reject config with invalid security filter (used in 2 specs)
312. [TC99536_5] should accept config with valid security filter (used in 2 specs)
313. [TC99537_1] no-privilege user should NOT be able to set JWT configuration (used in 2 specs)
314. [TC99537_2] no-privilege user should NOT be able to get JWT configuration (used in 2 specs)
315. [TC99539_1] should return 200 and default session info when includeConnectionInfo is false (used in 2 specs)
316. [TC99539_10] should treat truthy non-boolean values as true (used in 2 specs)
317. [TC99539_11] should demonstrate boolean parameter behavior differences (used in 2 specs)
318. [TC99539_12] should handle explicit boolean false value (used in 2 specs)
319. [TC99539_2] should return 200 and session info with userConnections when includeConnectionInfo is true (used in 2 specs)
320. [TC99539_3] should return correct data types for all session properties (used in 2 specs)
321. [TC99539_4] should return valid numeric values for configuration parameters (used in 2 specs)
322. [TC99539_5] should return valid userConnections structure when includeConnectionInfo is true (used in 2 specs)
323. [TC99539_6] should validate all userConnections have required properties (used in 2 specs)
324. [TC99539_7] should handle default parameter when includeConnectionInfo is not specified (used in 2 specs)
325. [TC99539_8] should throw error for invalid credentials (used in 2 specs)
326. [TC99539_9] should treat falsy non-boolean includeConnectionInfo as false (used in 2 specs)
327. [TC99550_1] The radius setting should be preserved during container manipulations (used in 2 specs)
328. [TC99550_10] Delete and Undo (used in 2 specs)
329. [TC99550_11] Change visualization types (used in 2 specs)
330. [TC99550_12] Resize containers and groups (used in 2 specs)
331. [TC99550_13] Move containers (used in 2 specs)
332. [TC99550_14] Duplicate page + panel, Responsive Preview (used in 2 specs)
333. [TC99550_15] Library Consumption Mode (used in 2 specs)
334. [TC99550_2] Copy/Paste Formatting (used in 2 specs)
335. [TC99550_3] Delete and Undo (used in 2 specs)
336. [TC99550_4] Change visualization types (used in 2 specs)
337. [TC99550_5] Resize containers and groups (used in 2 specs)
338. [TC99550_6] Move containers (used in 2 specs)
339. [TC99550_7] Duplicate page + panel, Responsive Preview (used in 2 specs)
340. [TC99550_8] The shadow setting should be preserved during container manipulations (used in 2 specs)
341. [TC99550_9] Copy/Paste Formatting (used in 2 specs)
342. Admin page - Okta (used in 2 specs)
343. Admin page - Okta no privilege (used in 2 specs)
344. Authentication - Guest as default (used in 2 specs)
345. Authentication - Guest Mode (used in 2 specs)
346. Authentication - Integrated Mode (used in 2 specs)
347. Authentication - LDAP as default (used in 2 specs)
348. Authentication - OIDC as default (used in 2 specs)
349. Authentication - SAML as default (used in 2 specs)
350. Authentication - SAML Okta (used in 2 specs)
351. Authentication - Single Session login failure (used in 2 specs)
352. Authentication - Single Session login successful (used in 2 specs)
353. Authentication - Single Session, login in same browser (used in 2 specs)
354. Authentication - Single Session, login in same browser seamless login (used in 2 specs)
355. Authentication - Standard - login page i18N (used in 2 specs)
356. Authentication - Standard Mode (used in 2 specs)
357. Authentication LDAP (used in 2 specs)
358. Basic Session Information Tests (used in 2 specs)
359. Boolean Logic Tests (used in 2 specs)
360. Check X-Content-Type-Options (used in 2 specs)
361. Custom app auth mode - edit auth mode (used in 2 specs)
362. Custom app auth mode - Guest (used in 2 specs)
363. Custom app auth mode - Guest (Multi Modes Server) (used in 2 specs)
364. Custom app auth mode - OIDC (used in 2 specs)
365. Custom app auth mode - SAML (used in 2 specs)
366. Custom app auth mode - SAML Global Logout (used in 2 specs)
367. Custom app auth mode - Sever Level (used in 2 specs)
368. Custom app auth mode - Standard (used in 2 specs)
369. Custom app auth mode - Trusted (used in 2 specs)
370. Data Type and Value Validation Tests (used in 2 specs)
371. Dataset Display: Expand/Collapse, Flat/Table View (used in 2 specs)
372. Dataset_ContextMenu_Report (used in 2 specs)
373. DossierDS_AttributeLinkAndMapping (used in 2 specs)
374. E2E Library of OIDC Keycloak error handling case (used in 2 specs)
375. F43366 Resize Group E2E workflow (used in 2 specs)
376. F43390 Copy Group E2E workflow (used in 2 specs)
377. F43390 Copy Group workflow (used in 2 specs)
378. GET /api/sessions API Test (used in 2 specs)
379. Guest only as server level auth mode, session timeout (used in 2 specs)
380. impersonate user login and execute report (used in 2 specs)
381. impersonate user login and execute report - SSO login 192 disabled (used in 2 specs)
382. impersonate user login and execute report - SSO login 193 disabled (used in 2 specs)
383. impersonate user login and execute report - standard (used in 2 specs)
384. impersonate user login and execute report - standard - 193 settings disabled (used in 2 specs)
385. impersonate user login and execute report - standard 192 settings disabled (used in 2 specs)
386. JWT Security filter E2E Tests (used in 2 specs)
387. Library Web Locale Settings - Guest (used in 2 specs)
388. Library Web Locale Settings - Kerberos (used in 2 specs)
389. Library Web Locale Settings - OIDC (used in 2 specs)
390. Library Web Locale Settings - SAML (used in 2 specs)
391. Library Web Locale Settings - Standard (used in 2 specs)
392. Library Web Locale Settings - Trusted (used in 2 specs)
393. Login as STD(default auth mode) in custom app, session timeout (used in 2 specs)
394. Multi SSO - Custom App - Error Handling (used in 2 specs)
395. Multi SSO - Custom App - multi SSO protect feature flag on (used in 2 specs)
396. Multi SSO - Multi Tab (used in 2 specs)
397. Multi SSO Custom app auth mode - OIDC - app level (used in 2 specs)
398. Multi SSO Custom app auth mode - OIDC - app level - language (used in 2 specs)
399. Multi SSO Custom app auth mode - SAML - app level (used in 2 specs)
400. Multi SSO Custom app auth mode - SAML - app level - language (used in 2 specs)
401. Multi SSO Logout (used in 2 specs)
402. OIDC DN added (used in 2 specs)
403. OIDC local MCG (used in 2 specs)
404. OIDC nested group (used in 2 specs)
405. OIDC Okta Global Logout (used in 2 specs)
406. Parameter Validation Tests (used in 2 specs)
407. POST /api/auth/login API Test with Trusted Login and System Prompts (used in 2 specs)
408. POST /api/auth/restore API Test (used in 2 specs)
409. radius E2E (used in 2 specs)
410. SAML config page credential (used in 2 specs)
411. SAML local MCG (used in 2 specs)
412. SAML Okta Global Logout (used in 2 specs)
413. SAML PingFederate (used in 2 specs)
414. SAML PingFederate Global Logout (used in 2 specs)
415. SAML REST API Tests (used in 2 specs)
416. Session Restoration Tests (used in 2 specs)
417. Session timeout Default Server Guest (used in 2 specs)
418. Session Timeout OIDC Alert and Blur (used in 2 specs)
419. Session Timeout SAML as default in default and custom app (used in 2 specs)
420. Session Timeout SAML as default in default app (used in 2 specs)
421. Session Timeout SAML while delete user group case (used in 2 specs)
422. SessionTimeoutAndApplyDossierLink (used in 2 specs)
423. Shadow E2E (used in 2 specs)
424. System Prompt Tests (used in 2 specs)
425. Test One Authentication through API (used in 2 specs)
426. Tests with preparation step (used in 2 specs)
427. Trust DN added (used in 2 specs)
428. Trust import (used in 2 specs)
429. UserConnections Array Validation Tests (used in 2 specs)
430. Verify OIDC Configuration Management (used in 2 specs)
431. Verify Trusted authentication User Import (used in 2 specs)
432. [BCED-2102] Check the styles of Datasets and TOC panel when the title text is too long (used in 1 specs)
433. [TC_BCSA-3610_0] should successfully get OAuth2 configuration (used in 1 specs)
434. [TC_BCSA-3610_1] should successfully modify scopes in the first client and verify the change (used in 1 specs)
435. [TC_BCSA-3610_2] should successfully set scopes to empty array and verify the change (used in 1 specs)
436. [TC19981] Query Details - DI cube (used in 1 specs)
437. [TC60086_1] Query Details -- Report (used in 1 specs)
438. [TC60086_2] Query Details -- Existing Objects - InMemory (used in 1 specs)
439. [TC60086_3] Query Details -- Existing Objects - Live (used in 1 specs)
440. [TC60086_4] Query Details -- DatabaseInMemory (used in 1 specs)
441. [TC60086_5] Query Details -- DatabaseLive (used in 1 specs)
442. [TC60259] Turn on/off panels (used in 1 specs)
443. [TC60401_01] Select Targets in auto canvas (used in 1 specs)
444. [TC60401_02] Select Targets in freeform layout (used in 1 specs)
445. [TC60401_03] Select Targets in auto canvas (used in 1 specs)
446. [TC60401_04] select targets in group (used in 1 specs)
447. [TC60401_05] select targets in group for filter (used in 1 specs)
448. [TC60401_06] select entire group in layer panel (used in 1 specs)
449. [TC60401_07] AM selector manipulation in layer panel (used in 1 specs)
450. [TC60904_2] 11.3.11 DE258037: Freeform group items inside of IW can be targeted from outside (used in 1 specs)
451. [TC60904] 11.2.1 DE153794: After select targets, though we are on layersControl panel, but the gallery panel shows (used in 1 specs)
452. [TC61678] Regression test on Panel Control (used in 1 specs)
453. [TC65318] 11.2.2 DE161952/11.3EA DE164405: RMC on the target icon in select target mode (used in 1 specs)
454. [TC65325_01] Copy visualization to existing page in same chapter (used in 1 specs)
455. [TC65325_02] Copy visualization to new page with undo/redo operations (used in 1 specs)
456. [TC65325_03] Copy visualization across chapters with filter warnings (used in 1 specs)
457. [TC65325_04] Copy visualization with visualization filtering (used in 1 specs)
458. [TC65325_05] Move visualization to existing page in same chapter (used in 1 specs)
459. [TC65325_06] Move visualization to new page with undo/redo (used in 1 specs)
460. [TC65325_07] Move visualization across chapters with filter warnings (used in 1 specs)
461. [TC65325_08] Move visualization with visualization filtering (used in 1 specs)
462. [TC65325_09] Duplicate visualization with complex scenarios (used in 1 specs)
463. [TC65325_10] Duplicate visualization with filtering (used in 1 specs)
464. [TC65325_11] Complex multi-operation workflow with undo/redo (used in 1 specs)
465. [TC65325_11] Duplicate and delete visualization through layers panel (used in 1 specs)
466. [TC99170_01] Edit existing dataset, add objects and update dataset, and Undo/redo (used in 1 specs)
467. [TC99170_02] Search for Objects in the Datasets Panel by type, and add objects into grid (used in 1 specs)
468. [TC99170_03] Search objects in dataset panel by key word (used in 1 specs)
469. [TC99170_04] Sort objects in dataset panel by key word (used in 1 specs)
470. [TC99170_06] Change Join Behaviors for dataset (used in 1 specs)
471. [TC99170_07] Unlink the attributes (used in 1 specs)
472. [TC99170_08] Collapse all datasets and expand datasets (used in 1 specs)
473. [TC99170_09] Collapse a single dataset then delete (used in 1 specs)
474. [TC99170_10] Show data from dataset (used in 1 specs)
475. [TC99170_11] Create derived attribute and dervied metric from the dataset (used in 1 specs)
476. [TC99170_12] Replace dataset from dataset panel (used in 1 specs)
477. [TC99170_13] Hide unused objects (used in 1 specs)
478. [TC99170_14] Save the dashboard (used in 1 specs)
479. [TC99170_15] DE321960 scroll bar when expanding folders (used in 1 specs)
480. [TC99170] Dataset Manupulations E2E workflow (used in 1 specs)
481. [TC99192_00] Dashboard Authoring workflow (used in 1 specs)
482. [TC99192_01] Text Field (used in 1 specs)
483. [TC99192_02] Image Container (used in 1 specs)
484. [TC99192_03] HTML Container (used in 1 specs)
485. [TC99192_04] Panel Stack (used in 1 specs)
486. [TC99192_05] Reposition containers (used in 1 specs)
487. [TC99192_06] Freeform Layout + Position/Size + Grouping + Align + Shape (used in 1 specs)
488. [TC99192_07] Rich Text Box Partial Formatting (used in 1 specs)
489. [TC99192_08] Layers Panel (used in 1 specs)
490. [TC99192_09] Responsive View (used in 1 specs)
491. [TC99192_10] Dashboard Authoring - Library Consumption (used in 1 specs)
492. Comprehensive Operations (used in 1 specs)
493. Container Duplicate, Copy, and Move Operations (used in 1 specs)
494. Copy Operations (used in 1 specs)
495. Dashboard Authoring E2E workflows (used in 1 specs)
496. Dataset Manupulations E2E workflows (used in 1 specs)
497. Defect Automation (used in 1 specs)
498. Duplicate Operations (used in 1 specs)
499. LeftsidePanelControl (used in 1 specs)
500. Manipulation in Layers panel for select target (used in 1 specs)
501. Move Operations (used in 1 specs)
502. New Dashboard Authoring Layout - Datasets/TOC panels (used in 1 specs)
503. OAuth2 Settings REST API Tests (used in 1 specs)
504. QueryDetails (used in 1 specs)
505. Select targets action in container/LayerPanel, cover freeform and auto canvas (used in 1 specs)
506. Select targets by container (used in 1 specs)

## Common Elements (from POM + spec.ts)

1. getUserName -- frequency: 262
2. getDossierView -- frequency: 101
3. {actual} -- frequency: 66
4. {expected} -- frequency: 65
5. getAllPanels -- frequency: 38
6. getText -- frequency: 28
7. getGridCellTextByPosition -- frequency: 22
8. getTargetIconInLayersPanel -- frequency: 22
9. getPreferenceText -- frequency: 20
10. getRootViewContent -- frequency: 19
11. getDatasetsPanel -- frequency: 17
12. getAccountName -- frequency: 16
13. getSourceButton -- frequency: 16
14. getMojoEditorWithTitle -- frequency: 15
15. getToggleBar -- frequency: 15
16. getDocName -- frequency: 14
17. getGridCellByPosition -- frequency: 14
18. getLibraryAdminText -- frequency: 14
19. getAccessTokenValue -- frequency: 12
20. getDatasetPanel -- frequency: 12
21. getFreeformLayoutPage -- frequency: 12
22. getSourceIconInLayersPanel -- frequency: 11
23. getForbiddenMessage -- frequency: 10
24. getTextContainer -- frequency: 10
25. getDatasetObjectsPanel -- frequency: 9
26. getBaseURLInput -- frequency: 8
27. getBookmarkIcon -- frequency: 8
28. getEntityIdInput -- frequency: 8
29. getIndexForObjectinDS -- frequency: 8
30. getLoginButton -- frequency: 8
31. getPageLoadingIcon -- frequency: 8
32. getEditorPanel -- frequency: 7
33. getImageContainer -- frequency: 7
34. getObjectFromSectionSansType -- frequency: 7
35. /descendant -- frequency: 6
36. getAccountDropdown -- frequency: 6
37. getCheckedItemFromCM -- frequency: 6
38. getContainer -- frequency: 6
39. getCredsLoginContainer -- frequency: 6
40. getDisabledContainerFromLayersPanel -- frequency: 6
41. getFilterPanel -- frequency: 6
42. getFormatPanel -- frequency: 6
43. getLayersPanel -- frequency: 6
44. getLoginErrorBox -- frequency: 6
45. getRefreshTokenValue -- frequency: 6
46. getTargetButton -- frequency: 6
47. getValue -- frequency: 5
48. getChangePwdFooterText -- frequency: 4
49. getCurrentPanelInPanelStack -- frequency: 4
50. getGridCell -- frequency: 4
51. getImageContainerWithURL -- frequency: 4
52. getLoginPageTitle -- frequency: 4
53. getObjectFromDataset -- frequency: 4
54. getObjectFromSection -- frequency: 4
55. getTable -- frequency: 4
56. getYesButton -- frequency: 4
57. C1292 F -- frequency: 3
58. getAllGridObjectCount -- frequency: 3
59. getAttributeFormDefinition -- frequency: 3
60. getCellInshowDataGrid -- frequency: 3
61. getContentsPanel -- frequency: 3
62. Login Button -- frequency: 3
63. getAlertMessage -- frequency: 2
64. getBrowserTabs -- frequency: 2
65. getChangePasswordErrorBox -- frequency: 2
66. getCheckboxWithLabelReact -- frequency: 2
67. getCustomAppBody -- frequency: 2
68. getMessageBoxContainer -- frequency: 2
69. getMetricDefinition -- frequency: 2
70. getPage -- frequency: 2
71. getPasswordInput -- frequency: 2
72. getRichTextField -- frequency: 2
73. getThemePanel -- frequency: 2
74. getTitleText -- frequency: 2
75. getToolbar -- frequency: 2
76. Ping Header -- frequency: 2
77. Wrong Pw Error -- frequency: 2
78. 4 F60 D6 -- frequency: 1
79. 55 BFC3 -- frequency: 1
80. 7 E0 F16 -- frequency: 1
81. Access Token Button -- frequency: 1
82. Access Token Container -- frequency: 1
83. Access Token Value -- frequency: 1
84. Admin Groups Input -- frequency: 1
85. Base URLError -- frequency: 1
86. Base URLInput -- frequency: 1
87. Behind Proxy -- frequency: 1
88. Change Password Error Box -- frequency: 1
89. Change Password Loading -- frequency: 1
90. Change Pwd Container -- frequency: 1
91. Change Pwd Footer -- frequency: 1
92. Credential Box -- frequency: 1
93. Creds Login Container -- frequency: 1
94. DDCAFF -- frequency: 1
95. Display Name Input -- frequency: 1
96. Distinguished Name Input -- frequency: 1
97. Done Button -- frequency: 1
98. Done Button Disabled -- frequency: 1
99. Email Input -- frequency: 1
100. Empty Pw Error -- frequency: 1
101. Encrypt Assertions -- frequency: 1
102. Entity Id Error -- frequency: 1
103. Entity Id Input -- frequency: 1
104. Get APISessions Button -- frequency: 1
105. Get Current Token Button -- frequency: 1
106. getFunctionInList -- frequency: 1
107. getFunctionSelectioninPopupList -- frequency: 1
108. getFunctionTypeinPopupList -- frequency: 1
109. getGridCellStyleByPosition -- frequency: 1
110. getLevelSelectioninPopupList -- frequency: 1
111. getObjectSelectioninPopupList -- frequency: 1
112. getPanelCount -- frequency: 1
113. getPanelStack -- frequency: 1
114. getPanelTabStrip -- frequency: 1
115. Group Format -- frequency: 1
116. Group Input -- frequency: 1
117. Guest Icon -- frequency: 1
118. Input Url -- frequency: 1
119. Kerberos Login Icon -- frequency: 1
120. LDAPMode -- frequency: 1
121. Left Row Button -- frequency: 1
122. Login Error Box -- frequency: 1
123. Login Message -- frequency: 1
124. Logout Mode -- frequency: 1
125. MSLogo -- frequency: 1
126. OIDCLogin Icon -- frequency: 1
127. Okta Signin Button -- frequency: 1
128. One Auth Login Button -- frequency: 1
129. Password Input -- frequency: 1
130. Pendo Tutorial -- frequency: 1
131. Pendo Tutorial Close Button -- frequency: 1
132. Qr Code -- frequency: 1
133. Refresh Access Token Button -- frequency: 1
134. Refresh Token Button -- frequency: 1
135. Refresh Token Container -- frequency: 1
136. Refresh Token Value -- frequency: 1
137. Response -- frequency: 1
138. Revoke Token Button -- frequency: 1
139. Right Row Button -- frequency: 1
140. Saml Login Icon -- frequency: 1
141. Sign On Button -- frequency: 1
142. Signature Algorithm -- frequency: 1
143. Standard Mode -- frequency: 1
144. Trusted Login Button -- frequency: 1
145. Trusted Login Icon -- frequency: 1
146. User Another Account -- frequency: 1
147. Username Form -- frequency: 1
148. Username Input -- frequency: 1
149. Using User Account In Enter Password Page -- frequency: 1

## Key Actions

- `log()` -- used in 679 specs
- `openUserAccountMenu()` -- used in 444 specs
- `waitForLibraryLoading()` -- used in 344 specs
- `pause()` -- used in 306 specs
- `getUserName()` -- used in 262 specs
- `logout()` -- used in 244 specs
- `login(username, password)` -- used in 211 specs
- `closeUserAccountMenu()` -- used in 178 specs
- `includes()` -- used in 177 specs
- `waitForDossierLoading()` -- used in 170 specs
- `toBeDefined()` -- used in 160 specs
- `getUrl()` -- used in 146 specs
- `openCustomAppById()` -- used in 134 specs
- `actionOnToolbar()` -- used in 130 specs
- `isDisplayed()` -- used in 121 specs
- `isObjectFromDSdisplayed()` -- used in 118 specs
- `loginWithPassword(password)` -- used in 114 specs
- `openDossier()` -- used in 110 specs
- `selectContextMenuOption()` -- used in 107 specs
- `getDossierView()` -- used in 101 specs
- `stringify()` -- used in 97 specs
- `goToPage()` -- used in 96 specs
- `waitForLoginView()` -- used in 90 specs
- `openContextMenu()` -- used in 89 specs
- `samlRelogin()` -- used in 86 specs
- `toString()` -- used in 85 specs
- `safeContinueAzureLogin(options = {})` -- used in 84 specs
- `url()` -- used in 78 specs
- `oktaLogin(credentials = { username: '', password: '' })` -- used in 76 specs
- `waitForAuthoringPageLoading()` -- used in 76 specs
- `pageTitle()` -- used in 72 specs
- `sleep()` -- used in 70 specs
- `getText()` -- used in 61 specs
- `oidcRelogin()` -- used in 58 specs
- `firstElmOfHeader()` -- used in 56 specs
- `selectSecondaryContextMenuOption()` -- used in 54 specs
- `switchToTab()` -- used in 54 specs
- `editDossierByUrl()` -- used in 53 specs
- `isAgGridCellHasTextDisplayed()` -- used in 52 specs
- `resizeGroup()` -- used in 52 specs
- `loginToAzure(email)` -- used in 46 specs
- `title()` -- used in 46 specs
- `switchCustomApp()` -- used in 44 specs
- `openDossierByUrl()` -- used in 39 specs
- `currentURL()` -- used in 38 specs
- `getAllPanels()` -- used in 38 specs
- `isDatasetDisplayed()` -- used in 37 specs
- `clickButtonFromToolbar()` -- used in 36 specs
- `safeLoginToAzure(email)` -- used in 36 specs
- `loginExistingUser(email)` -- used in 34 specs
- `openMenu()` -- used in 34 specs
- `resizeContainer()` -- used in 34 specs
- `toBeGreaterThan()` -- used in 34 specs
- `endsWith()` -- used in 32 specs
- `addObjectToVizByDoubleClick()` -- used in 31 specs
- `closeTab()` -- used in 30 specs
- `isArray()` -- used in 29 specs
- `from()` -- used in 28 specs
- `togglePanel()` -- used in 28 specs
- `clickBtnOnMojoEditor()` -- used in 27 specs
- `getCSSProperty()` -- used in 27 specs
- `continueAzureLogin(options = {})` -- used in 26 specs
- `dismissErrorByText()` -- used in 26 specs
- `viewErrorDetails()` -- used in 26 specs
- `waitForDisplayed()` -- used in 26 specs
- `openPageFromTocMenu()` -- used in 25 specs
- `clickOnContainerFromLayersPanel()` -- used in 24 specs
- `errorDetails()` -- used in 24 specs
- `multiSelectContainersFromCanvas()` -- used in 24 specs
- `newWindow()` -- used in 24 specs
- `testJWTConfigSetup(userCredentials, baseUrl, algorithm, customPayload = {}, customConfig = {})` -- used in 24 specs
- `applyButtonForSelectTarget()` -- used in 23 specs
- `chooseDatasetContextMenuOption()` -- used in 23 specs
- `multiSelectContainers()` -- used in 23 specs
- `clickIntroToLibrarySkip()` -- used in 22 specs
- `getGridCellTextByPosition()` -- used in 22 specs
- `getTargetIconInLayersPanel()` -- used in 22 specs
- `openAndTakeContextMenuByRMC()` -- used in 22 specs
- `openDefaultApp()` -- used in 22 specs
- `encode()` -- used in 20 specs
- `expandFolder()` -- used in 20 specs
- `fromCharCode()` -- used in 20 specs
- `getPreferenceText()` -- used in 20 specs
- `getRootViewContent()` -- used in 19 specs
- `isMoJoEditorWithTitleDisplayed()` -- used in 19 specs
- `toBeGreaterThanOrEqual()` -- used in 19 specs
- `submitForm()` -- used in 18 specs
- `actionOnObjectFromDataset()` -- used in 17 specs
- `changeViz()` -- used in 17 specs
- `getDatasetsPanel()` -- used in 17 specs
- `parse()` -- used in 17 specs
- `changePassword(oldPassword, newPassword, confirmPassword)` -- used in 16 specs
- `getAccountName()` -- used in 16 specs
- `getSourceButton()` -- used in 16 specs
- `isLoginPageDisplayed()` -- used in 16 specs
- `switchToNewWindowWithUrl()` -- used in 16 specs
- `testJWTLogin(baseUrl, jwtToken, algorithm)` -- used in 16 specs
- `toBeUndefined()` -- used in 16 specs
- `waitForRsdLoad()` -- used in 16 specs
- `getMojoEditorWithTitle()` -- used in 15 specs
- `getToggleBar()` -- used in 15 specs
- `goToLibrary()` -- used in 15 specs
- `clickEditButton()` -- used in 14 specs
- `getDocName()` -- used in 14 specs
- `getGridCellByPosition()` -- used in 14 specs
- `getLibraryAdminText()` -- used in 14 specs
- `isEditIconPresent()` -- used in 14 specs
- `isOIDCLoginButtonDisplayed()` -- used in 14 specs
- `loginAsGuest()` -- used in 14 specs
- `openDossierInfoWindow()` -- used in 14 specs
- `reload()` -- used in 14 specs
- `split()` -- used in 14 specs
- `switchToNewWindow()` -- used in 14 specs
- `waitForElementVisible()` -- used in 14 specs
- `clickContainer()` -- used in 13 specs
- `resetDossierIfPossible()` -- used in 13 specs
- `selectTargetVisualizations()` -- used in 13 specs
- `canUserLogout()` -- used in 12 specs
- `clickOnElement()` -- used in 12 specs
- `confirmConfigSucceed()` -- used in 12 specs
- `doubleClickOnObject()` -- used in 12 specs
- `fetchAccessTokenValue()` -- used in 12 specs
- `getAccessTokenValue()` -- used in 12 specs
- `getDatasetPanel()` -- used in 12 specs
- `getFreeformLayoutPage()` -- used in 12 specs
- `isSAMLLoginButtonDisplayed()` -- used in 12 specs
- `selectObject()` -- used in 12 specs
- `switchSection()` -- used in 12 specs
- `switchToFormatPanelByClickingOnIcon()` -- used in 12 specs
- `waitForDynamicElementLoading()` -- used in 12 specs
- `waitForItemLoading()` -- used in 12 specs
- `actionOnMenubarWithSubmenu()` -- used in 11 specs
- `getSourceIconInLayersPanel()` -- used in 11 specs
- `isExisting()` -- used in 11 specs
- `isHighlightedObjectFromDSdisplayed()` -- used in 11 specs
- `saveInMyReport()` -- used in 11 specs
- `selectFromSearchPulldown()` -- used in 11 specs
- `selectTargetButton()` -- used in 11 specs
- `waitLoadingDataPopUpIsNotDisplayed()` -- used in 11 specs
- `checkPresenceOfSelectTrgtBtn()` -- used in 10 specs
- `clearPasswordForm()` -- used in 10 specs
- `clickRefreshAccessTokenButton()` -- used in 10 specs
- `close()` -- used in 10 specs
- `customCredentials()` -- used in 10 specs
- `fetchRefreshTokenValue()` -- used in 10 specs
- `fetchResponse()` -- used in 10 specs
- `fillForm({
        entityId, baseUrl, behindProxy, logoutMode, signatureAlgorithm, encryptAssertions, displayNameAttributeName, emailAttributeName, dnAttributeName, groupAttributeName, groupFormat, adminGroups, })` -- used in 10 specs
- `getForbiddenMessage()` -- used in 10 specs
- `getTextContainer()` -- used in 10 specs
- `hasLibraryIntroduction()` -- used in 10 specs
- `isLibraryIntroductionPresent()` -- used in 10 specs
- `logoutExistingUser(email)` -- used in 10 specs
- `map()` -- used in 10 specs
- `waitForElementInvisible()` -- used in 10 specs
- `xls()` -- used in 10 specs
- `getDatasetObjectsPanel()` -- used in 9 specs
- `selectOptionFromToolbarPulldown()` -- used in 9 specs
- `clear()` -- used in 8 specs
- `clickGetAPISessionsButton()` -- used in 8 specs
- `clickOnBtn()` -- used in 8 specs
- `clickOneAuthLoginButton()` -- used in 8 specs
- `errorTitle()` -- used in 8 specs
- `expandDataset()` -- used in 8 specs
- `getBaseURLInput()` -- used in 8 specs
- `getBookmarkIcon()` -- used in 8 specs
- `getEntityIdInput()` -- used in 8 specs
- `getIndexForObjectinDS()` -- used in 8 specs
- `getLoginButton()` -- used in 8 specs
- `getPageLoadingIcon()` -- used in 8 specs
- `isObjectDisplayedinDSContainer()` -- used in 8 specs
- `loginAzureWithAnotherUser()` -- used in 8 specs
- `moveContainerByOffset()` -- used in 8 specs
- `openDossierNoWait()` -- used in 8 specs
- `simpleSaveDashboard()` -- used in 8 specs
- `standardInputCredential(credentials = { username: '', password: '' })` -- used in 8 specs
- `switchToLibraryIframe()` -- used in 8 specs
- `waitForEmbeddedDossierLoading()` -- used in 8 specs
- `waitForMSTRProjectListAppear()` -- used in 8 specs
- `warn()` -- used in 8 specs
- `closeQueryDetail()` -- used in 7 specs
- `collapseDataset()` -- used in 7 specs
- `duplicateContainerFromLayersPanel()` -- used in 7 specs
- `expandORCollapseGroup()` -- used in 7 specs
- `getEditorPanel()` -- used in 7 specs
- `getImageContainer()` -- used in 7 specs
- `getObjectFromSectionSansType()` -- used in 7 specs
- `getValue()` -- used in 7 specs
- `ReplaceHeightInputBoxInReactPanel()` -- used in 7 specs
- `ReplaceXInputBoxInReactPanel()` -- used in 7 specs
- `ReplaceYInputBoxInReactPanel()` -- used in 7 specs
- `rightClickOnContainerFromLayersPanel()` -- used in 7 specs
- `changeDashboardURL(url)` -- used in 6 specs
- `clickSkipButton()` -- used in 6 specs
- `doubleClickContainer()` -- used in 6 specs
- `errorMsg()` -- used in 6 specs
- `executeScript()` -- used in 6 specs
- `getAccountDropdown()` -- used in 6 specs
- `getCheckedItemFromCM()` -- used in 6 specs
- `getContainer()` -- used in 6 specs
- `getCookies()` -- used in 6 specs
- `getCredsLoginContainer()` -- used in 6 specs
- `getDisabledContainerFromLayersPanel()` -- used in 6 specs
- `getFilterPanel()` -- used in 6 specs
- `getFormatPanel()` -- used in 6 specs
- `getLayersPanel()` -- used in 6 specs
- `getLoginErrorBox()` -- used in 6 specs
- `getObjectFromDataset()` -- used in 6 specs
- `getRefreshTokenValue()` -- used in 6 specs
- `getTargetButton()` -- used in 6 specs
- `isDashboardPresent()` -- used in 6 specs
- `isDoneButtonClickable()` -- used in 6 specs
- `isErrorPresent()` -- used in 6 specs
- `open()` -- used in 6 specs
- `openDocumentNoWait()` -- used in 6 specs
- `openPreferencePanel()` -- used in 6 specs
- `secondaryCMOnObjectFromDataset()` -- used in 6 specs
- `selectedPreference()` -- used in 6 specs
- `switchToFrame()` -- used in 6 specs
- `waitForPageLoading()` -- used in 6 specs
- `waitForPopupWindowDisappear()` -- used in 6 specs
- `clickBuiltInColor()` -- used in 5 specs
- `clickColorPickerModeBtn()` -- used in 5 specs
- `ReplaceWidthInputBoxInReactPanel()` -- used in 5 specs
- `addDatasetObjectByDragAndDrop()` -- used in 4 specs
- `addObjectByDoubleClick()` -- used in 4 specs
- `canUserLogin()` -- used in 4 specs
- `changeFolderPath()` -- used in 4 specs
- `changeNewObjectInReplaceObjectsEditor()` -- used in 4 specs
- `changePasswordErrorMsg()` -- used in 4 specs
- `changePasswordWithInvalidCredentials()` -- used in 4 specs
- `clearCredentials()` -- used in 4 specs
- `clickDataSourceByIndex()` -- used in 4 specs
- `clickFontColorBtn()` -- used in 4 specs
- `clickNextButton()` -- used in 4 specs
- `clickYesButton()` -- used in 4 specs
- `confirmBaseURLError()` -- used in 4 specs
- `confirmEntityIdError()` -- used in 4 specs
- `contextMenuActionFromLayersPanel()` -- used in 4 specs
- `contextMenuOnPage()` -- used in 4 specs
- `createDMorDA()` -- used in 4 specs
- `dismissChangePasswordErrorMessage()` -- used in 4 specs
- `dismissError()` -- used in 4 specs
- `dismissLoginErrorMessage()` -- used in 4 specs
- `duplicatePage()` -- used in 4 specs
- `editDatasetNotification()` -- used in 4 specs
- `error()` -- used in 4 specs
- `exec()` -- used in 4 specs
- `getChangePwdFooterText()` -- used in 4 specs
- `getCurrentPanelInPanelStack()` -- used in 4 specs
- `getGridCell()` -- used in 4 specs
- `getImageContainerWithURL()` -- used in 4 specs
- `getLoginPageTitle()` -- used in 4 specs
- `getObjectFromSection()` -- used in 4 specs
- `getTable()` -- used in 4 specs
- `getYesButton()` -- used in 4 specs
- `GroupContextMenuAction()` -- used in 4 specs
- `importSampleFiles()` -- used in 4 specs
- `isAttributeLinked()` -- used in 4 specs
- `isBackgroundBlurred()` -- used in 4 specs
- `isButtonDisabled()` -- used in 4 specs
- `isChangePasswordErrorBoxDisplayed()` -- used in 4 specs
- `isMojoErrorPresent()` -- used in 4 specs
- `linkBarPanelSelector()` -- used in 4 specs
- `loginErrorMsg()` -- used in 4 specs
- `loginErrorTitle()` -- used in 4 specs
- `moveContainerByPosition()` -- used in 4 specs
- `moveContainerToTargetPosition()` -- used in 4 specs
- `multiSelectContainerAndTakeCMOption()` -- used in 4 specs
- `now()` -- used in 4 specs
- `openAdminPage()` -- used in 4 specs
- `openAndTakeContextMenuByRMCTitle()` -- used in 4 specs
- `openReportNoWait()` -- used in 4 specs
- `refresh()` -- used in 4 specs
- `replace()` -- used in 4 specs
- `rightClickAttributeMetricAndSelectOption()` -- used in 4 specs
- `selectAMSelectorListObject()` -- used in 4 specs
- `selectFromDatasetsPanelContextMenu()` -- used in 4 specs
- `selectMetricsFromDropdown()` -- used in 4 specs
- `standardLogin(credentials = { username: '', password: '' })` -- used in 4 specs
- `toBeLessThan()` -- used in 4 specs
- `unmapAttribute()` -- used in 4 specs
- `waitForCurtainDisappear()` -- used in 4 specs
- `waitForLoginErrorBox()` -- used in 4 specs
- `waitUntil()` -- used in 4 specs
- `addFunctionByDoubleClick()` -- used in 3 specs
- `addGridToViz()` -- used in 3 specs
- `changeContainerFillColor()` -- used in 3 specs
- `clickCreateButton()` -- used in 3 specs
- `clickNewDataBtnUntilShowDataSource()` -- used in 3 specs
- `containerRelativePosition()` -- used in 3 specs
- `createNewDossier()` -- used in 3 specs
- `dropDownForVisualizationInLayersPanelToSelectAnotherElement()` -- used in 3 specs
- `floor()` -- used in 3 specs
- `getAllGridObjectCount()` -- used in 3 specs
- `getAttribute()` -- used in 3 specs
- `getAttributeFormDefinition()` -- used in 3 specs
- `getCellInshowDataGrid()` -- used in 3 specs
- `getContentsPanel()` -- used in 3 specs
- `groupContainers()` -- used in 3 specs
- `isRowCountEqual()` -- used in 3 specs
- `linkAttribute()` -- used in 3 specs
- `objectToReplace()` -- used in 3 specs
- `saveAttribute()` -- used in 3 specs
- `saveMetric()` -- used in 3 specs
- `selectFormFromDropdown()` -- used in 3 specs
- `setAttributeName()` -- used in 3 specs
- `validateForm()` -- used in 3 specs
- `actionOnObjectFromPreview()` -- used in 2 specs
- `addExistingObjects()` -- used in 2 specs
- `addPanel()` -- used in 2 specs
- `basicOktaLogin(credentials = { username: '', password: '' })` -- used in 2 specs
- `call()` -- used in 2 specs
- `cancelButtonForSelectTarget()` -- used in 2 specs
- `changeDropdownReact()` -- used in 2 specs
- `changeNameInDatasetSaveAsDialog()` -- used in 2 specs
- `changePasswordFinished()` -- used in 2 specs
- `checkForm({
        entityId = '', baseUrl = browser.options.baseUrl, behindProxy = 'No', logoutMode = 'Local', signatureAlgorithm = 'SHA256WITHRSA', encryptAssertions = 'No', displayNameAttributeName = 'DisplayName', emailAttributeName = 'EMail', dnAttributeName = 'DistinguishedName', groupAttributeName = 'Groups', groupFormat = 'Simple', adminGroups = '', })` -- used in 2 specs
- `chooseTab()` -- used in 2 specs
- `clearSearch()` -- used in 2 specs
- `clickButton()` -- used in 2 specs
- `clickCancelButton()` -- used in 2 specs
- `clickClearFormulaEditorButton()` -- used in 2 specs
- `clickContainerBorderColorBtn()` -- used in 2 specs
- `clickContainerByScript()` -- used in 2 specs
- `clickContainerFillColorBtn()` -- used in 2 specs
- `clickDeleteTrustedButton()` -- used in 2 specs
- `clickGetAccessTokenButton()` -- used in 2 specs
- `clickHtmlContainerOkButton()` -- used in 2 specs
- `clickLoginButtonInSessionTimeoutAlert()` -- used in 2 specs
- `clickLoginInLoginPopupDialog()` -- used in 2 specs
- `clickMojoErrorButton()` -- used in 2 specs
- `clickMSLogo()` -- used in 2 specs
- `clickOnAutoCanvasButton()` -- used in 2 specs
- `clickRevokeTokenButton()` -- used in 2 specs
- `clickSaveCancelBotton()` -- used in 2 specs
- `clickTrustLoginButton()` -- used in 2 specs
- `createBlankDashboardFromLibrary()` -- used in 2 specs
- `createNewDashboardByUrl()` -- used in 2 specs
- `deleteContainer()` -- used in 2 specs
- `deleteContainerFromLayersPanel()` -- used in 2 specs
- `disablePendoTutorial()` -- used in 2 specs
- `disableTutorial()` -- used in 2 specs
- `dismissColorPicker()` -- used in 2 specs
- `DoubleClickRichTextbox()` -- used in 2 specs
- `editURL()` -- used in 2 specs
- `entries()` -- used in 2 specs
- `forEach()` -- used in 2 specs
- `fromEntries()` -- used in 2 specs
- `getAlertMessage()` -- used in 2 specs
- `getBrowserTabs()` -- used in 2 specs
- `getChangePasswordErrorBox()` -- used in 2 specs
- `getCheckboxWithLabelReact()` -- used in 2 specs
- `getCustomAppBody()` -- used in 2 specs
- `getMessageBoxContainer()` -- used in 2 specs
- `getMetricDefinition()` -- used in 2 specs
- `getPage()` -- used in 2 specs
- `getPasswordInput()` -- used in 2 specs
- `getRichTextField()` -- used in 2 specs
- `getThemePanel()` -- used in 2 specs
- `getTitleText()` -- used in 2 specs
- `getToolbar()` -- used in 2 specs
- `handleError()` -- used in 2 specs
- `hasSkipButton()` -- used in 2 specs
- `isChangePasswordDisplayed()` -- used in 2 specs
- `isContainerSelected()` -- used in 2 specs
- `isDatasetPresentByName()` -- used in 2 specs
- `isOktaUsernameDisplayed()` -- used in 2 specs
- `isPauseModeActive()` -- used in 2 specs
- `isPingHeaderPresent()` -- used in 2 specs
- `isPreferencePresent()` -- used in 2 specs
- `isSelectExistingDatasetDialogDisplayed()` -- used in 2 specs
- `isSessionTimeoutAlertDisplayed()` -- used in 2 specs
- `keys()` -- used in 2 specs
- `loginErrorMessage()` -- used in 2 specs
- `loginInLoginPopupDialog()` -- used in 2 specs
- `openAdminjspPage()` -- used in 2 specs
- `openContextMenuByRMC()` -- used in 2 specs
- `openHamburgerMenu()` -- used in 2 specs
- `openSAMLConfigWeb()` -- used in 2 specs
- `pressShiftAndArrowKeyToHighlightText()` -- used in 2 specs
- `push()` -- used in 2 specs
- `renameDataset()` -- used in 2 specs
- `repeat()` -- used in 2 specs
- `replaceFontSizeText()` -- used in 2 specs
- `saveAsDataset()` -- used in 2 specs
- `searchOnDatasetsPanel()` -- used in 2 specs
- `selectContextMenuOptionWithHover()` -- used in 2 specs
- `selectShapeBorderColorButton()` -- used in 2 specs
- `selectTargetVizFromWithinSelector()` -- used in 2 specs
- `slice()` -- used in 2 specs
- `switchMode()` -- used in 2 specs
- `switchToHtmlTextByEdit()` -- used in 2 specs
- `switchToIFrameByEdit()` -- used in 2 specs
- `switchToStandardTab()` -- used in 2 specs
- `trustedRelogin()` -- used in 2 specs
- `updateDatasetFromPreview()` -- used in 2 specs
- `validateMetric()` -- used in 2 specs
- `waitForErrorMessage()` -- used in 2 specs
- `waitForPopupWindowAppear()` -- used in 2 specs
- `wrongPwError()` -- used in 2 specs
- `addSearchedObjectByDoubleClick()` -- used in 1 specs
- `changeContainerBorder()` -- used in 1 specs
- `changeNumberFormat()` -- used in 1 specs
- `changePanelWidthByPixel()` -- used in 1 specs
- `changeVizType()` -- used in 1 specs
- `checkKeepChangesLocalCheckbox()` -- used in 1 specs
- `ClickFontSizeIncreaseBtnForTimes()` -- used in 1 specs
- `clickOnCheckboxReact()` -- used in 1 specs
- `ClickOnFontStyleButtonInPanel()` -- used in 1 specs
- `clickOnOpenCanvasButton()` -- used in 1 specs
- `ClickOnRadioButton()` -- used in 1 specs
- `closeFormatPanel()` -- used in 1 specs
- `copyQueryDetails()` -- used in 1 specs
- `createDossierAndImportSampleFiles()` -- used in 1 specs
- `deleteDataset()` -- used in 1 specs
- `deleteGroupFromToolbar()` -- used in 1 specs
- `deleteViz()` -- used in 1 specs
- `dismissContextMenu()` -- used in 1 specs
- `getFunctionInList()` -- used in 1 specs
- `getFunctionSelectioninPopupList()` -- used in 1 specs
- `getFunctionTypeinPopupList()` -- used in 1 specs
- `getGridCellStyleByPosition()` -- used in 1 specs
- `getLevelSelectioninPopupList()` -- used in 1 specs
- `getObjectSelectioninPopupList()` -- used in 1 specs
- `getPanelCount()` -- used in 1 specs
- `getPanelStack()` -- used in 1 specs
- `getPanelTabStrip()` -- used in 1 specs
- `importDataFromURL()` -- used in 1 specs
- `InputPlainText()` -- used in 1 specs
- `InputSimpleText()` -- used in 1 specs
- `isKeepChangesLocalCheckboxChecked()` -- used in 1 specs
- `isObjectVisibleOnEditorPanel()` -- used in 1 specs
- `openContainerBorderPullDown()` -- used in 1 specs
- `pressArrowKeyToMoveCursor()` -- used in 1 specs
- `random()` -- used in 1 specs
- `restoreToOriginalSizeByFormatPanel()` -- used in 1 specs
- `saveToFolder()` -- used in 1 specs
- `selectBorderStyle()` -- used in 1 specs
- `selectFontAlign()` -- used in 1 specs
- `selectFontStyle()` -- used in 1 specs
- `selectTargetPanelStackFromLayersPanel()` -- used in 1 specs
- `selectTextFont()` -- used in 1 specs
- `setMetricName()` -- used in 1 specs
- `setObjectSearchKey()` -- used in 1 specs
- `setXAndY()` -- used in 1 specs
- `switchPanel()` -- used in 1 specs
- `switchToHtmlTextByFormatPanel()` -- used in 1 specs
- `switchToIFrameByFormatPanel()` -- used in 1 specs
- `clearLoginAndPassword()` -- used in 0 specs
- `clickGetCurrentTokenButton()` -- used in 0 specs
- `confirmAdminAzureLogin()` -- used in 0 specs
- `confirmAdminAzureLoginWithoutPrivilege()` -- used in 0 specs
- `confirmAzureLogin()` -- used in 0 specs
- `confirmLoginSuccessful()` -- used in 0 specs
- `emptyPwError()` -- used in 0 specs
- `enableABAlocator()` -- used in 0 specs
- `enterPassword(oldPassword, newPassword, confirmPassword)` -- used in 0 specs
- `getBasicAuthResopne(url, auth = '')` -- used in 0 specs
- `getLibraryVersion(libraryUrl = appId ? browser.options.baseUrl.split('app/')` -- used in 0 specs
- `getNtlmAuthResponse(url, auth = { username: '', password: '' })` -- used in 0 specs
- `integratedLogin(credentials = { username: '', password: '' }, type)` -- used in 0 specs
- `isExitingUserAccountPresent(email)` -- used in 0 specs
- `isInvalidCredentials()` -- used in 0 specs
- `isStandardModeSelected()` -- used in 0 specs
- `isUsernameInputPresent()` -- used in 0 specs
- `isUsingUserAccountInEnterPasswordPagePresent(email)` -- used in 0 specs
- `ldapLogin(credentials = { username: '', password: '' })` -- used in 0 specs
- `login(credentials = { username: '', password: '' }, options = { mode: 'standard', type: '', waitForLoading: true })` -- used in 0 specs
- `login(credentials = { username: '', password: '' })` -- used in 0 specs
- `login(email, username, password)` -- used in 0 specs
- `loginToEditMode(credentials = { username: '', password: '' })` -- used in 0 specs
- `loginWithBadgeCredentials(username, password)` -- used in 0 specs
- `loginWithInvalidCredentials()` -- used in 0 specs
- `loginWithoutWait(credentials = { username: '', password: '' })` -- used in 0 specs
- `oktaWrongPwError()` -- used in 0 specs
- `relogin(credentials = { username: '', password: '' }, options = { mode: 'standard', type: '' })` -- used in 0 specs
- `saasLogin(credentials = { username: '', password: '' })` -- used in 0 specs
- `safeContinueKeycloakLogin()` -- used in 0 specs
- `selectDropDown(select, value)` -- used in 0 specs
- `signInWithAnotherUser()` -- used in 0 specs
- `trustedLogin(credentials = { username: '', password: '' }, type)` -- used in 0 specs
- `waitForChangePwdView()` -- used in 0 specs
- `waitForTrustedLoginButton()` -- used in 0 specs

## Source Coverage

- `pageObjects/auth/**/*.js`
- `specs/regression/authentication/**/*.{ts,js}`
- `specs/regression/authentication/appAuthMode/**/*.{ts,js}`
- `specs/regression/authentication/defaultMode/**/*.{ts,js}`
- `specs/regression/authentication/guest/**/*.{ts,js}`
- `specs/regression/authentication/impersonate/**/*.{ts,js}`
- `specs/regression/authentication/jwt/**/*.{ts,js}`
- `specs/regression/authentication/kerberos/**/*.{ts,js}`
- `specs/regression/authentication/ldap/**/*.{ts,js}`
- `specs/regression/authentication/locale/**/*.{ts,js}`
- `specs/regression/authentication/multisso/**/*.{ts,js}`
- `specs/regression/authentication/oauth2/**/*.{ts,js}`
- `specs/regression/authentication/oauthApi/**/*.{ts,js}`
- `specs/regression/authentication/oidc/**/*.{ts,js}`
- `specs/regression/authentication/oidcGlobalLogout/**/*.{ts,js}`
- `specs/regression/authentication/oidcSystemPrompt/**/*.{ts,js}`
- `specs/regression/authentication/oneAuth/**/*.{ts,js}`
- `specs/regression/authentication/restore/**/*.{ts,js}`
- `specs/regression/authentication/saml/**/*.{ts,js}`
- `specs/regression/authentication/samlSystemPrompt/**/*.{ts,js}`
- `specs/regression/authentication/sessionManagement/**/*.{ts,js}`
- `specs/regression/authentication/sessions/**/*.{ts,js}`
- `specs/regression/authentication/singleLogout/**/*.{ts,js}`
- `specs/regression/authentication/singleSession/**/*.{ts,js}`
- `specs/regression/authentication/standard/**/*.{ts,js}`
- `specs/regression/authentication/tanzu/**/*.{ts,js}`
- `specs/regression/authentication/Trust/**/*.{ts,js}`
- `specs/regression/config/dashboardAuthoring/**/*.{ts,js}`
- `specs/regression/dashboardAuthoring/**/*.{ts,js}`
- `specs/regression/dashboardAuthoring/adjustRadiusSpacingAndShadow/**/*.{ts,js}`
- `specs/regression/dashboardAuthoring/copyGroup/**/*.{ts,js}`
- `specs/regression/dashboardAuthoring/datasetPanel/**/*.{ts,js}`
- `specs/regression/dashboardAuthoring/resizeGroup/**/*.{ts,js}`
- `specs/regression/oauth2Settings/**/*.{ts,js}`
