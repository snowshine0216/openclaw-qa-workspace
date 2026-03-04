# Site Knowledge: admin

> Components: 1

### AdminPage
> Extends: `BasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `SavingSpinner` | `.show-loader` | element |
| `ActionSpinner` | `.anticon-spin` | element |
| `Slider` | `.mstr-Admin-RootView-sider` | element |
| `LaunchButton` | `.mstr-Admin-libraryLink span` | element |
| `ContentContainer` | `.mstr-Admin-RootView-content` | element |
| `InputTextBox` | `.mstr-Admin-wscv-paddedinput` | input |
| `CancelButton` | `.mstr-Admin-SaveToolbar .mstr-Admin-SaveToolbar-btn` | button |
| `SaveButton` | `.mstr-Admin-SaveToolbar .ant-btn-primary` | button |
| `ErrorDialog` | `.mstr-Admin-ep-popup` | element |
| `TrustedDropdown` | `.ant-select-dropdown` | dropdown |
| `LoginPopupDialog` | `.ant-modal-content` | element |
| `HelpLink` | `.footer-help-link` | element |
| `CollaborationSetupButton` | `.mstr-Admin-Button` | button |
| `ConfigSlider` | `.ant-tabs-nav-scroll` | element |
| `AboutButton` | `.footer-about-link` | element |
| `AboutTitle` | `.mstrd-VersionViewer h1` | element |
| `SaveSuccessMessage` | `.anticon.anticon-check-circle.mstr-Admin-Icon ` | element |
| `ForbiddenMessage` | `html` | element |
| `HealthBody` | `body` | element |
| `AlertMessage` | `.ant-alert-description` | element |
| `LibraryAdminText` | `.ant-layout-sider-children .logo` | element |

**Actions**
| Signature |
|-----------|
| `openAdminPage()` |
| `openHealthPage()` |
| `openAdminjspPage()` |
| `clickLibraryUrl()` |
| `inputMicroStrategyWebLink(url)` |
| `clickSaveButton()` |
| `clickCancelButton()` |
| `clickLaunchButton()` |
| `selectTrustedProvider(option)` |
| `clickCreateTrustedButton()` |
| `clickDeleteTrustedButton()` |
| `inputUsername(userName)` |
| `loginInLoginPopupDialog(userName, password)` |
| `clickLoginInLoginPopupDialog()` |
| `chooseTab(option)` |
| `chooseAuthenticationMode(mode)` |
| `clickHelpButton()` |
| `clickCollaborationSetupButton()` |
| `clickNewConfigurationButton()` |
| `clickConfigurationName(name)` |
| `clickConfigButton(name, icon)` |
| `clickCancelButtonInDelete()` |
| `clickDownloadButton()` |
| `clickCopyLinkButton()` |
| `clickCloseButton()` |
| `clickDeleteConfig(name)` |
| `inputSecretKey(key)` |
| `clickKeepUsersLoggedin()` |
| `chooseRelatedContentSettings(mode)` |
| `clickOkButtonInErrorDialog()` |
| `inputSetting(row, size)` |
| `saveSetting()` |
| `openAbout()` |
| `selectAllowEmbeddingRadioButton(selection)` |
| `clickCancelInErrorDialog()` |
| `getAboutTitleText()` |
| `isErrorDialogShows()` |
| `getSettingValue(row)` |
| `getLibraryUrlText()` |
| `healthPageResponse()` |
| `getWarningMessageText()` |

**Sub-components**
- getTrustedDropdownContainer
