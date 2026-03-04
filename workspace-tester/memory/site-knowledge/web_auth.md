# Site Knowledge: web_auth

> Components: 1

### WebLoginPage
> Extends: `WebBasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Username` | `#Uid` | element |
| `Password` | `#Pwd` | element |
| `GuestLoginInput` | `#guest` | element |
| `LicenseMessage` | `#licenseMsg0` | element |
| `WarningMessage` | `#warning_session_timeout_countdownMsg` | element |
| `ModalLoginWindow` | `.mstrmojo-LoginEditor` | element |

**Actions**
| Signature |
|-----------|
| `isContinueButtonDisplayed()` |
| `continueLicenseWarning()` |
| `getProject(serverName, projectName)` |
| `isProjectInServerShown(serverName, projectName)` |
| `getProjectDescription(serverName, projectName)` |
| `isProjectCountsEqualTo(count)` |
| `loginSucceedExpections(objectName)` |
| `loginFailExpections()` |
| `isLoginSucceed()` |
| `isLoginFail()` |
| `open(serverName = getIServer()` |
| `standardLDAPLogin(username, password = '')` |
| `login(username, password = '', objectName)` |
| `loginInFirst(username, password = '')` |
| `loginWithGuestMode()` |
| `openWeb()` |
| `loginAsGuest(objectName)` |
| `loginToSiteMinder(username, password)` |
| `waitForProjectListAppear()` |
| `openProject(serverName, projectName)` |
| `loginToHome({ serverName, projectName, username, password })` |
| `logout(options = {})` |
| `SSOLogout()` |
| `continue()` |
| `forceLogout()` |
| `switchUser(username, password)` |
| `cancelPasswordChange()` |
| `chooseLoginMode(modeText)` |
| `getWarningMessageInfo()` |
| `isModalLoginWindowPresent()` |
| `modalLogin(username, password = '')` |
| `isLoginPageDisplayed()` |
| `getBasicAuthResponse(url, auth = '')` |

**Sub-components**
- waitForPage
