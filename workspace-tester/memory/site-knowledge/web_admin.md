# Site Knowledge: web_admin

> Components: 10

### AdminSecurityPage
> Extends: `WebBasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `setAllowUsersToChangeExpiredPasswordCheckBox(toCheck)` |
| `setCreateNewHTTPSessionUponLoginCheckBox(toCheck)` |
| `setAllowAutomaticLoginIfSessionLostCheckBox(toCheck)` |
| `setEnablePartitionedCheckBox(toCheck)` |
| `setEnableSecureCheckBox(toCheck)` |
| `setSameSiteRadioButton(value)` |
| `setCheckBox(element, toCheck)` |

**Sub-components**
- scrollWebPage

---

### BaseProperties
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `ButtonBar` | `.adminButtonBar` | button |
| `AdminProperties` | `.mstrAdminProperties` | element |

**Actions**
| Signature |
|-----------|
| `btnAction(value)` |
| `save()` |
| `cancel()` |
| `loadDefaultValues(checkIntoView = true)` |
| `refresh()` |
| `saveChange()` |
| `inputPropertyValue(name, value)` |
| `selectPropertyBtn(value, type)` |
| `deselectPropertyBtn(value, type)` |
| `selectPropertyRadioBtn(value)` |
| `selectPropertyCheckboxBtn(value)` |
| `deselectPropertyCheckboxBtn(value)` |
| `openPropertyDropdown(name)` |
| `selectPropertyDropdownItem(name, item)` |
| `isBtnSelected(value, type)` |
| `isCheckboxBtnSelected(value)` |
| `isRadioBtnSelected(value)` |
| `propertyDropdownValue(name)` |

**Sub-components**
_none_

---

### DefaultProperties
> Extends: `BaseProperties`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `LoginTable` | `.mstrAdminPropertiesLogin` | element |
| `WebErrorBox` | `.mstrAlert` | element |
| `WebErrorMessage` | `.mstrAlertMessage` | element |
| `OidcConfigClientId` | `#oidcConfig_clientId` | element |
| `OidcConfigClientSecret` | `#oidcConfig_clientSecret` | element |
| `OidcConfigIssuer` | `#oidcConfig_issuer` | element |
| `OidcConfigNativeClientId` | `#oidcConfig_nativeClientId` | element |
| `OidcConfigRedirectUri` | `#oidcConfig_redirectUri` | element |
| `OidcConfigScopes` | `#oidcConfig_scopes` | element |
| `OidcConfigClaimMapFullName` | `#oidcConfig_claimMap_fullName` | element |
| `OidcConfigClaimMapUserId` | `#oidcConfig_claimMap_userId` | element |
| `OidcConfigClaimMapEmail` | `#oidcConfig_claimMap_email` | element |
| `OidcConfigClaimMapGroups` | `#oidcConfig_claimMap_groups` | element |
| `OidcConfigAdminGroups` | `#oidcConfig_adminGroups` | element |
| `LoginMode` | `.mstrAdminPropertiesLogin` | element |

**Actions**
| Signature |
|-----------|
| `clickLoginMode(loginMode, toCheck)` |
| `setDefaultLoginMode(loginMode)` |
| `setLoginMode(loginMode, isSet = true)` |
| `setGuestLogin(toCheck)` |
| `setProjectList(index)` |
| `isGuestLoginEnable()` |
| `isWebErrorDisplay()` |
| `isOidcConfigVisible()` |
| `fillOidcConfig(clientId, clientSecret, issuer, nativeClientId, redirectUri, scopes, claimMapFullName, claimMapUserId, claimMapEmail, claimMapGroups, adminGroups)` |

**Sub-components**
_none_

---

### Diagnostics
> Extends: `BaseProperties`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `selectDropdownItem(locator, item)` |
| `selectAdvacendLogLevelDropdown(item)` |
| `selectStatModeDropdown(item)` |
| `selectFromDate(month, day, year)` |
| `selectToDate(month, day, year)` |
| `isFromDaySelected(day)` |
| `isModeSelected(mode)` |

**Sub-components**
_none_

---

### IServerManagePage
> Extends: `WebBasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `UserAndGroupTabContainer` | `#entMgr_AdminUserEntityTabManagerStyle,#g_entMgr_AdminUserEntityTabManagerStyle` | element |
| `SecurityRoleTabContainer` | `#srMgr_AdminSecRoleTabManagerStyle` | element |
| `UserManager` | `.mstr-dskt-lnk.usermgr` | element |
| `SecurityRole` | `.mstr-dskt-lnk.rolemgr` | element |
| `NewGroup` | `#tbNewGroup` | element |
| `NewUser` | `#tbNewUser` | element |
| `SearchResultView` | `.mstrListView` | element |
| `SearchResultSection` | `#results_FolderConfigurationSearchResults` | element |
| `AdminPathShortcut` | `.mstrAdminPathShortcuts` | element |
| `SearchResults` | `.mstrSearchResultsCount>span` | element |
| `SearchInputBox` | `#srchStr,#nameToSearch` | element |
| `SearchAlertMsg` | `.mstrAlertMessage` | element |
| `SearchStyle` | `#sb_QuickConfigurationSearchStyle` | element |
| `AdvancedSearchStyle` | `#sb_AdvancedConfigurationSearchStyle` | element |
| `NewSearchBtn` | `.search-new .mstrLink` | element |
| `AdvancedSearchBtn` | `.search-new .search-typeLink-advanced` | element |
| `TypeSection` | `#typesSection` | element |
| `SearchExpDrodown` | `#nameOptions` | element |
| `SearchDescriptionBox` | `#description` | element |
| `OKbtn` | `.mstrTransform #ok` | element |
| `CancelBtn` | `.mstrTransform #cancel` | element |
| `IconViewBtn` | `#tbLargeIcons` | element |
| `ListViewBtn` | `#tbListView` | element |
| `AddressName` | `.edit #dispName` | element |
| `PhysicalAddress` | `.edit #addressValue` | element |
| `ConfirmBoxOkBtn` | `.mstrDialogButtonBar #ok` | button |
| `NewSecurotyRoleBtn` | `#tbNewSR` | element |

**Actions**
| Signature |
|-----------|
| `getUserGroupRow(name)` |
| `getUserGroupColumnsText(name, index)` |
| `getSearchResultRow(name)` |
| `getConlumOnSearchResult(name, index)` |
| `getUserRow(name)` |
| `getRoleRow(name)` |
| `logout()` |
| `openUserManager()` |
| `openUserManagerByAdminPath()` |
| `openSecurityRoleManager()` |
| `openSecurityManagerByAdminPath()` |
| `openUserEditor(username)` |
| `modifyUserToNeedChangePassword()` |
| `unlockUser(searchName)` |
| `openUserGroupCreator()` |
| `openUserCreator()` |
| `inputFullName(text)` |
| `inputLoginName(text)` |
| `inputDescription(text)` |
| `inputUserPwd(text)` |
| `inputUserConfirmPwd(text)` |
| `selectUserAndGroupTab(text)` |
| `selectSecurityRoleTab(text)` |
| `saveEntity()` |
| `cancelEntity()` |
| `modifyUserGroup(name)` |
| `deleteUserGroup(name)` |
| `viewUserGroup(name)` |
| `modifyUser(name)` |
| `clickPriviledgeBox(name)` |
| `clickPriviledge(name)` |
| `clearPrivileges()` |
| `clearGroupPriviledges(name)` |
| `clearUserPrivilege(userName, groupName)` |
| `deleteUser(name)` |
| `search(text)` |
| `searchByName(text)` |
| `openSecurityRoleCreator()` |
| `inputRoleName(text)` |
| `inputRoleDesc(text)` |
| `modifyRole(name)` |
| `deleteRole(name)` |
| `quickCreateUser(userName, fullName, description, password, privileges = ['10'])` |
| `openUserGroup(name)` |
| `backToServerAdminHome()` |
| `clickNewSearch()` |
| `clickAdvancedSearch()` |
| `clickSearchTypeOption(index, text)` |
| `clickSearchOwnerOption(index, text)` |
| `clickSearchExpressionDropdownOption(text)` |
| `inputSearchDescription(text)` |
| `clickPageNext()` |
| `clickPageFirst()` |
| `clickEditOnSearchResultsFirstItem()` |
| `clickIconView()` |
| `clickListView()` |
| `clickNewAddressBtn()` |
| `inputAddressName(name)` |
| `inputPhysicalAddress(name)` |
| `createAndSaveAddress(name, value)` |
| `clickAddressSaveBtn()` |
| `selectAndSaveDefaultAddress(name)` |
| `clickAddressRowActionBtn(name, action)` |
| `clickConfirmBoxOkBtn()` |
| `isEntityInSearchResult(text)` |
| `getSearchResultsCount()` |
| `isPrivildgeGroupChecked(name)` |
| `isIconViewSelected()` |
| `isListViewSelected()` |
| `isAddressDefaultChecked(name)` |
| `isPriviledgeProjectChecked(name, index = 1)` |
| `isTabPresent(text)` |

**Sub-components**
- getUserAndGroupTabContainer
- getSecurityRoleTabContainer
- getPage

---

### IServerPropertiesPage
> Extends: `WebBasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `Alert` | `.serverProperties-error-desc` | element |

**Actions**
| Signature |
|-----------|
| `createTrustRelationship(username, password)` |
| `deleteTrustRelationship(username, password)` |
| `basicDeleteTrustRelationship(username, password)` |
| `isTrustedRelationshipExist()` |
| `cancelCreateTrustRelationship()` |
| `clickSetupCreateTrustRelationshipBtn()` |
| `clickDeleteBtn()` |
| `clickDeleteTrustRelationshipBtn()` |
| `clickCancelSaveTrustRelationshipBtn()` |
| `clickCreateTrustRelationshipBtn()` |
| `clickSaveBtn()` |
| `trustRelationshipCreated()` |
| `trustRelationshipNotCreated()` |
| `getBtnValue()` |
| `getAlertText()` |

**Sub-components**
_none_

---

### MobileConfiguration
> Extends: `WebBasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| _none_ | | |

**Actions**
| Signature |
|-----------|
| `getMojoButton(buttonName)` |
| `getConfigTab(tabName)` |
| `getConfig(name)` |
| `getFolder(name)` |
| `scrollWindowToBottom()` |
| `scrollDown()` |
| `clickDeleteMobileServer()` |
| `findRowByConfigName(configName)` |
| `performActionByConfigName(configName, action)` |
| `isConfigPresent(name)` |
| `isConfigPresent(name)` |
| `deleteCopyConfig()` |
| `isNewConfigurationButtonPresent()` |
| `clickMojoButton(buttonName)` |
| `selectDeviceType(deviceType)` |
| `inputConfigName(name)` |
| `switchTab(tabName)` |
| `inputMobileServerName(name)` |
| `inputMobileServerPort(port)` |
| `selectMobileServerType(type)` |
| `selectRequestType(type)` |
| `selectAuthenticationMode(type)` |
| `waitForProjectListPresent()` |
| `isConfigURLContainerPresent()` |
| `scrollMobileConfigToBottom()` |
| `createMobileConfiguration(device, configName, mobileServerName, mobileServerPort, mobileServerType, requestType, authMode)` |
| `clickDisplayContent()` |
| `clickDropDownList(device)` |
| `loginInHomeScreen(username, password)` |
| `chooseFolder(folderName)` |
| `clickCurrentFolderButton()` |
| `waitForIServerLoginLoading()` |
| `setHomePath(device, username, password)` |

**Sub-components**
- getConfigURLContainer

---

### OIDCConfig
> Extends: `DefaultProperties`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `WebUriInput` | `#oidcConfig_webUri` | element |
| `ClientIdInput` | `#oidcConfig_clientId` | element |
| `ClientSecretInput` | `#oidcConfig_clientSecret` | element |
| `IssuerInput` | `#oidcConfig_issuer` | element |
| `NativeClientIdInput` | `#oidcConfig_nativeClientId` | element |
| `RedirectUriInput` | `#oidcConfig_redirectUri` | element |
| `ScopeInput` | `#oidcConfig_scopes` | element |
| `ClaimFullNameInput` | `#oidcConfig_claimMap_fullName` | element |
| `ClaimUserIdInput` | `#oidcConfig_claimMap_userId` | element |
| `ClaimEmailInput` | `#oidcConfig_claimMap_email` | element |
| `ClaimGroupsInput` | `#oidcConfig_claimMap_groups` | element |
| `AdminGroupsInput` | `#oidcConfig_adminGroups` | element |

**Actions**
| Signature |
|-----------|
| `fillForm(webUri, clientId, clientSecret, issuer, nativeClientId, redirectUri, scope, claimFullName, claimUserId, claimEmail, claimGroups, adminGroups)` |
| `clickRetrieveUserInfoFromIDToken()` |
| `isOIDCPanelDisplay()` |

**Sub-components**
_none_

---

### UserEditor
> Extends: `BaseComponent`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AccountDisabledCheckBox` | `#disable` | element |
| `PrivilegesListLocator` | `.mstrPrivilegesList` | element |

**Actions**
| Signature |
|-----------|
| `scrollPrivilegesList(toOffset)` |
| `inputFullName(text)` |
| `inputUserName(text)` |
| `inputDesciption(text)` |
| `inputPassword(text)` |
| `confirmPassword(text)` |
| `clickAccountDisabled(toCheck)` |
| `clickPasswordMustChange(toCheck)` |
| `clickOk()` |
| `switchTabTo(tabName)` |
| `selectPrivilege(privilege)` |
| `selectPrivilegeByNum(num)` |

**Sub-components**
_none_

---

### WebAdminPage
> Extends: `WebBasePage`

**Locators**
| Name | CSS | Type |
|------|-----|------|
| `AddServerForm` | `#ADDCONNECTSERVER` | element |
| `AdminProperties` | `.mstrAdminProperties` | element |
| `AccessDenied` | `.mstrAlertTitle` | element |
| `AccessDeniedMessage` | `.mstrAlertMessage` | element |
| `ServerProperty` | `.mstrPanelPortrait` | element |
| `AlertMessage` | `.mstrAlertMessage` | element |
| `TaskAdminPage` | `.navbar` | element |
| `AdminNoAccessText` | `body` | element |
| `HealthBody` | `body` | element |
| `PurgeButton` | `.mstrSubmitButton` | button |
| `AdministratorPageText` | `.mstrPathText` | element |

**Actions**
| Signature |
|-----------|
| `getAdminProperty(serverName, index)` |
| `isAccessDeniedPresent()` |
| `openAdminPage()` |
| `openAdminPageWithUser(username, password)` |
| `openTaskAdminPage()` |
| `openServerAdminPage()` |
| `openTaskAdminPageWithUser(username, password)` |
| `openPurchCachePage()` |
| `inputIServerName(serverName)` |
| `addIServer()` |
| `connectIServer()` |
| `disconnectIServer(serverName)` |
| `reConnectIServer(serverName)` |
| `modifyIServer(serverName, isIserverConnected = true)` |
| `manageIServer(serverName)` |
| `selectAutoConnect()` |
| `selectManuallyConnect()` |
| `clearAndInputPort(port = '0')` |
| `clearAndInputPoolSize(poolSize = '50')` |
| `connectIServerWithProperties()` |
| `saveModifyProperties()` |
| `cancelModifyProperties()` |
| `deleteModifyProperties()` |
| `selectLeftMenu(menuItem)` |
| `openDefaultProperties()` |
| `openSecurityPage()` |
| `openMobileConfig()` |
| `setSecurityProperty(text, toCheck = true)` |
| `returnHomeByLink()` |
| `clearIserver(serverName)` |
| `disconnectAllIservers()` |
| `purgeCache()` |
| `selectCacheByName(value)` |
| `openOtherConfigurationPage()` |
| `isIServerConnected(serverName)` |
| `isIserverDisconnected(serverName)` |
| `isTaskAdminPresent()` |
| `healthResponse()` |
| `isCachePurged(value)` |

**Sub-components**
- scrollPage
- getTaskAdminPage
