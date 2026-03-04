# Site Knowledge: Web Auth Domain

## Overview

- **Domain key:** `web_auth`
- **Components covered:** WebLoginPage
- **Spec files scanned:** 0
- **POM files scanned:** 1

## Components

### WebLoginPage
- **CSS root:** `#guest`
- **User-visible elements:**
  - Guest Login Input (`#guest`)
  - License Message (`#licenseMsg0`)
  - Modal Login Window (`.mstrmojo-LoginEditor`)
  - Password (`#Pwd`)
  - Username (`#Uid`)
  - Warning Message (`#warning_session_timeout_countdownMsg`)
- **Component actions:**
  - `cancelPasswordChange()`
  - `chooseLoginMode(modeText)`
  - `continue()`
  - `continueLicenseWarning()`
  - `forceLogout()`
  - `getBasicAuthResponse(url, auth = '')`
  - `getProject(serverName, projectName)`
  - `getProjectDescription(serverName, projectName)`
  - `getWarningMessageInfo()`
  - `isContinueButtonDisplayed()`
  - `isLoginFail()`
  - `isLoginPageDisplayed()`
  - `isLoginSucceed()`
  - `isModalLoginWindowPresent()`
  - `isProjectCountsEqualTo(count)`
  - `isProjectInServerShown(serverName, projectName)`
  - `login(username, password = '', objectName)`
  - `loginAsGuest(objectName)`
  - `loginFailExpections()`
  - `loginInFirst(username, password = '')`
  - `loginSucceedExpections(objectName)`
  - `loginToHome({ serverName, projectName, username, password })`
  - `loginToSiteMinder(username, password)`
  - `loginWithGuestMode()`
  - `logout(options = {})`
  - `modalLogin(username, password = '')`
  - `open(serverName = getIServer()`
  - `openProject(serverName, projectName)`
  - `openWeb()`
  - `SSOLogout()`
  - `standardLDAPLogin(username, password = '')`
  - `switchUser(username, password)`
  - `waitForProjectListAppear()`
- **Related components:** waitForPage

## Common Workflows (from spec.ts)

1. _none_

## Common Elements (from POM + spec.ts)

1. Guest Login Input -- frequency: 1
2. License Message -- frequency: 1
3. Modal Login Window -- frequency: 1
4. Password -- frequency: 1
5. Username -- frequency: 1
6. Warning Message -- frequency: 1

## Key Actions

- `cancelPasswordChange()` -- used in 0 specs
- `chooseLoginMode(modeText)` -- used in 0 specs
- `continue()` -- used in 0 specs
- `continueLicenseWarning()` -- used in 0 specs
- `forceLogout()` -- used in 0 specs
- `getBasicAuthResponse(url, auth = '')` -- used in 0 specs
- `getProject(serverName, projectName)` -- used in 0 specs
- `getProjectDescription(serverName, projectName)` -- used in 0 specs
- `getWarningMessageInfo()` -- used in 0 specs
- `isContinueButtonDisplayed()` -- used in 0 specs
- `isLoginFail()` -- used in 0 specs
- `isLoginPageDisplayed()` -- used in 0 specs
- `isLoginSucceed()` -- used in 0 specs
- `isModalLoginWindowPresent()` -- used in 0 specs
- `isProjectCountsEqualTo(count)` -- used in 0 specs
- `isProjectInServerShown(serverName, projectName)` -- used in 0 specs
- `login(username, password = '', objectName)` -- used in 0 specs
- `loginAsGuest(objectName)` -- used in 0 specs
- `loginFailExpections()` -- used in 0 specs
- `loginInFirst(username, password = '')` -- used in 0 specs
- `loginSucceedExpections(objectName)` -- used in 0 specs
- `loginToHome({ serverName, projectName, username, password })` -- used in 0 specs
- `loginToSiteMinder(username, password)` -- used in 0 specs
- `loginWithGuestMode()` -- used in 0 specs
- `logout(options = {})` -- used in 0 specs
- `modalLogin(username, password = '')` -- used in 0 specs
- `open(serverName = getIServer()` -- used in 0 specs
- `openProject(serverName, projectName)` -- used in 0 specs
- `openWeb()` -- used in 0 specs
- `SSOLogout()` -- used in 0 specs
- `standardLDAPLogin(username, password = '')` -- used in 0 specs
- `switchUser(username, password)` -- used in 0 specs
- `waitForProjectListAppear()` -- used in 0 specs

## Source Coverage

- `pageObjects/web_auth/**/*.js`
