# Site Knowledge: Admin Domain

## Overview

- **Domain key:** `admin`
- **Components covered:** AdminPage
- **Spec files scanned:** 0
- **POM files scanned:** 1

## Components

### AdminPage
- **CSS root:** `.mstr-Admin-RootView-content`
- **User-visible elements:**
  - About Button (`.footer-about-link`)
  - About Title (`.mstrd-VersionViewer h1`)
  - Action Spinner (`.anticon-spin`)
  - Alert Message (`.ant-alert-description`)
  - Cancel Button (`.mstr-Admin-SaveToolbar .mstr-Admin-SaveToolbar-btn`)
  - Collaboration Setup Button (`.mstr-Admin-Button`)
  - Config Slider (`.ant-tabs-nav-scroll`)
  - Content Container (`.mstr-Admin-RootView-content`)
  - Error Dialog (`.mstr-Admin-ep-popup`)
  - Forbidden Message (`html`)
  - Health Body (`body`)
  - Help Link (`.footer-help-link`)
  - Input Text Box (`.mstr-Admin-wscv-paddedinput`)
  - Launch Button (`.mstr-Admin-libraryLink span`)
  - Library Admin Text (`.ant-layout-sider-children .logo`)
  - Login Popup Dialog (`.ant-modal-content`)
  - Save Button (`.mstr-Admin-SaveToolbar .ant-btn-primary`)
  - Save Success Message (`.anticon.anticon-check-circle.mstr-Admin-Icon `)
  - Saving Spinner (`.show-loader`)
  - Slider (`.mstr-Admin-RootView-sider`)
  - Trusted Dropdown (`.ant-select-dropdown`)
- **Component actions:**
  - `chooseAuthenticationMode(mode)`
  - `chooseRelatedContentSettings(mode)`
  - `chooseTab(option)`
  - `clickCancelButton()`
  - `clickCancelButtonInDelete()`
  - `clickCancelInErrorDialog()`
  - `clickCloseButton()`
  - `clickCollaborationSetupButton()`
  - `clickConfigButton(name, icon)`
  - `clickConfigurationName(name)`
  - `clickCopyLinkButton()`
  - `clickCreateTrustedButton()`
  - `clickDeleteConfig(name)`
  - `clickDeleteTrustedButton()`
  - `clickDownloadButton()`
  - `clickHelpButton()`
  - `clickKeepUsersLoggedin()`
  - `clickLaunchButton()`
  - `clickLibraryUrl()`
  - `clickLoginInLoginPopupDialog()`
  - `clickNewConfigurationButton()`
  - `clickOkButtonInErrorDialog()`
  - `clickSaveButton()`
  - `getAboutTitleText()`
  - `getLibraryUrlText()`
  - `getSettingValue(row)`
  - `getWarningMessageText()`
  - `healthPageResponse()`
  - `inputMicroStrategyWebLink(url)`
  - `inputSecretKey(key)`
  - `inputSetting(row, size)`
  - `inputUsername(userName)`
  - `isErrorDialogShows()`
  - `loginInLoginPopupDialog(userName, password)`
  - `openAbout()`
  - `openAdminjspPage()`
  - `openAdminPage()`
  - `openHealthPage()`
  - `saveSetting()`
  - `selectAllowEmbeddingRadioButton(selection)`
  - `selectTrustedProvider(option)`
- **Related components:** getTrustedDropdownContainer

## Common Workflows (from spec.ts)

1. _none_

## Common Elements (from POM + spec.ts)

1. About Button -- frequency: 1
2. About Title -- frequency: 1
3. Action Spinner -- frequency: 1
4. Alert Message -- frequency: 1
5. Cancel Button -- frequency: 1
6. Collaboration Setup Button -- frequency: 1
7. Config Slider -- frequency: 1
8. Content Container -- frequency: 1
9. Error Dialog -- frequency: 1
10. Forbidden Message -- frequency: 1
11. Health Body -- frequency: 1
12. Help Link -- frequency: 1
13. Input Text Box -- frequency: 1
14. Launch Button -- frequency: 1
15. Library Admin Text -- frequency: 1
16. Login Popup Dialog -- frequency: 1
17. Save Button -- frequency: 1
18. Save Success Message -- frequency: 1
19. Saving Spinner -- frequency: 1
20. Slider -- frequency: 1
21. Trusted Dropdown -- frequency: 1

## Key Actions

- `chooseAuthenticationMode(mode)` -- used in 0 specs
- `chooseRelatedContentSettings(mode)` -- used in 0 specs
- `chooseTab(option)` -- used in 0 specs
- `clickCancelButton()` -- used in 0 specs
- `clickCancelButtonInDelete()` -- used in 0 specs
- `clickCancelInErrorDialog()` -- used in 0 specs
- `clickCloseButton()` -- used in 0 specs
- `clickCollaborationSetupButton()` -- used in 0 specs
- `clickConfigButton(name, icon)` -- used in 0 specs
- `clickConfigurationName(name)` -- used in 0 specs
- `clickCopyLinkButton()` -- used in 0 specs
- `clickCreateTrustedButton()` -- used in 0 specs
- `clickDeleteConfig(name)` -- used in 0 specs
- `clickDeleteTrustedButton()` -- used in 0 specs
- `clickDownloadButton()` -- used in 0 specs
- `clickHelpButton()` -- used in 0 specs
- `clickKeepUsersLoggedin()` -- used in 0 specs
- `clickLaunchButton()` -- used in 0 specs
- `clickLibraryUrl()` -- used in 0 specs
- `clickLoginInLoginPopupDialog()` -- used in 0 specs
- `clickNewConfigurationButton()` -- used in 0 specs
- `clickOkButtonInErrorDialog()` -- used in 0 specs
- `clickSaveButton()` -- used in 0 specs
- `getAboutTitleText()` -- used in 0 specs
- `getLibraryUrlText()` -- used in 0 specs
- `getSettingValue(row)` -- used in 0 specs
- `getWarningMessageText()` -- used in 0 specs
- `healthPageResponse()` -- used in 0 specs
- `inputMicroStrategyWebLink(url)` -- used in 0 specs
- `inputSecretKey(key)` -- used in 0 specs
- `inputSetting(row, size)` -- used in 0 specs
- `inputUsername(userName)` -- used in 0 specs
- `isErrorDialogShows()` -- used in 0 specs
- `loginInLoginPopupDialog(userName, password)` -- used in 0 specs
- `openAbout()` -- used in 0 specs
- `openAdminjspPage()` -- used in 0 specs
- `openAdminPage()` -- used in 0 specs
- `openHealthPage()` -- used in 0 specs
- `saveSetting()` -- used in 0 specs
- `selectAllowEmbeddingRadioButton(selection)` -- used in 0 specs
- `selectTrustedProvider(option)` -- used in 0 specs

## Source Coverage

- `pageObjects/admin/**/*.js`
