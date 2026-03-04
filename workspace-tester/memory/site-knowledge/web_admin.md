# Site Knowledge: Web Admin Domain

## Overview

- **Domain key:** `web_admin`
- **Components covered:** AdminSecurityPage, BaseProperties, DefaultProperties, Diagnostics, IServerManagePage, IServerPropertiesPage, MobileConfiguration, OIDCConfig, UserEditor, WebAdminPage
- **Spec files scanned:** 0
- **POM files scanned:** 10

## Components

### AdminSecurityPage
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `setAllowAutomaticLoginIfSessionLostCheckBox(toCheck)`
  - `setAllowUsersToChangeExpiredPasswordCheckBox(toCheck)`
  - `setCheckBox(element, toCheck)`
  - `setCreateNewHTTPSessionUponLoginCheckBox(toCheck)`
  - `setEnablePartitionedCheckBox(toCheck)`
  - `setEnableSecureCheckBox(toCheck)`
  - `setSameSiteRadioButton(value)`
- **Related components:** scrollWebPage

### BaseProperties
- **CSS root:** `.mstrAdminProperties`
- **User-visible elements:**
  - Admin Properties (`.mstrAdminProperties`)
  - Button Bar (`.adminButtonBar`)
- **Component actions:**
  - `btnAction(value)`
  - `cancel()`
  - `deselectPropertyBtn(value, type)`
  - `deselectPropertyCheckboxBtn(value)`
  - `inputPropertyValue(name, value)`
  - `isBtnSelected(value, type)`
  - `isCheckboxBtnSelected(value)`
  - `isRadioBtnSelected(value)`
  - `loadDefaultValues(checkIntoView = true)`
  - `openPropertyDropdown(name)`
  - `propertyDropdownValue(name)`
  - `refresh()`
  - `save()`
  - `saveChange()`
  - `selectPropertyBtn(value, type)`
  - `selectPropertyCheckboxBtn(value)`
  - `selectPropertyDropdownItem(name, item)`
  - `selectPropertyRadioBtn(value)`
- **Related components:** _none_

### DefaultProperties
- **CSS root:** `.mstrAdminPropertiesLogin`
- **User-visible elements:**
  - Login Mode (`.mstrAdminPropertiesLogin`)
  - Login Table (`.mstrAdminPropertiesLogin`)
  - Oidc Config Admin Groups (`#oidcConfig_adminGroups`)
  - Oidc Config Claim Map Email (`#oidcConfig_claimMap_email`)
  - Oidc Config Claim Map Full Name (`#oidcConfig_claimMap_fullName`)
  - Oidc Config Claim Map Groups (`#oidcConfig_claimMap_groups`)
  - Oidc Config Claim Map User Id (`#oidcConfig_claimMap_userId`)
  - Oidc Config Client Id (`#oidcConfig_clientId`)
  - Oidc Config Client Secret (`#oidcConfig_clientSecret`)
  - Oidc Config Issuer (`#oidcConfig_issuer`)
  - Oidc Config Native Client Id (`#oidcConfig_nativeClientId`)
  - Oidc Config Redirect Uri (`#oidcConfig_redirectUri`)
  - Oidc Config Scopes (`#oidcConfig_scopes`)
  - Web Error Box (`.mstrAlert`)
  - Web Error Message (`.mstrAlertMessage`)
- **Component actions:**
  - `clickLoginMode(loginMode, toCheck)`
  - `fillOidcConfig(clientId, clientSecret, issuer, nativeClientId, redirectUri, scopes, claimMapFullName, claimMapUserId, claimMapEmail, claimMapGroups, adminGroups)`
  - `isGuestLoginEnable()`
  - `isOidcConfigVisible()`
  - `isWebErrorDisplay()`
  - `setDefaultLoginMode(loginMode)`
  - `setGuestLogin(toCheck)`
  - `setLoginMode(loginMode, isSet = true)`
  - `setProjectList(index)`
- **Related components:** _none_

### Diagnostics
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `isFromDaySelected(day)`
  - `isModeSelected(mode)`
  - `selectAdvacendLogLevelDropdown(item)`
  - `selectDropdownItem(locator, item)`
  - `selectFromDate(month, day, year)`
  - `selectStatModeDropdown(item)`
  - `selectToDate(month, day, year)`
- **Related components:** _none_

### IServerManagePage
- **CSS root:** `#entMgr_AdminUserEntityTabManagerStyle,#g_entMgr_AdminUserEntityTabManagerStyle`
- **User-visible elements:**
  - Address Name (`.edit #dispName`)
  - Admin Path Shortcut (`.mstrAdminPathShortcuts`)
  - Advanced Search Btn (`.search-new .search-typeLink-advanced`)
  - Advanced Search Style (`#sb_AdvancedConfigurationSearchStyle`)
  - Cancel Btn (`.mstrTransform #cancel`)
  - Confirm Box Ok Btn (`.mstrDialogButtonBar #ok`)
  - Icon View Btn (`#tbLargeIcons`)
  - List View Btn (`#tbListView`)
  - New Group (`#tbNewGroup`)
  - New Search Btn (`.search-new .mstrLink`)
  - New Securoty Role Btn (`#tbNewSR`)
  - New User (`#tbNewUser`)
  - OKbtn (`.mstrTransform #ok`)
  - Physical Address (`.edit #addressValue`)
  - Search Alert Msg (`.mstrAlertMessage`)
  - Search Description Box (`#description`)
  - Search Exp Drodown (`#nameOptions`)
  - Search Input Box (`#srchStr,#nameToSearch`)
  - Search Results (`.mstrSearchResultsCount>span`)
  - Search Result Section (`#results_FolderConfigurationSearchResults`)
  - Search Result View (`.mstrListView`)
  - Search Style (`#sb_QuickConfigurationSearchStyle`)
  - Security Role (`.mstr-dskt-lnk.rolemgr`)
  - Security Role Tab Container (`#srMgr_AdminSecRoleTabManagerStyle`)
  - Type Section (`#typesSection`)
  - User And Group Tab Container (`#entMgr_AdminUserEntityTabManagerStyle,#g_entMgr_AdminUserEntityTabManagerStyle`)
  - User Manager (`.mstr-dskt-lnk.usermgr`)
- **Component actions:**
  - `backToServerAdminHome()`
  - `cancelEntity()`
  - `clearGroupPriviledges(name)`
  - `clearPrivileges()`
  - `clearUserPrivilege(userName, groupName)`
  - `clickAddressRowActionBtn(name, action)`
  - `clickAddressSaveBtn()`
  - `clickAdvancedSearch()`
  - `clickConfirmBoxOkBtn()`
  - `clickEditOnSearchResultsFirstItem()`
  - `clickIconView()`
  - `clickListView()`
  - `clickNewAddressBtn()`
  - `clickNewSearch()`
  - `clickPageFirst()`
  - `clickPageNext()`
  - `clickPriviledge(name)`
  - `clickPriviledgeBox(name)`
  - `clickSearchExpressionDropdownOption(text)`
  - `clickSearchOwnerOption(index, text)`
  - `clickSearchTypeOption(index, text)`
  - `createAndSaveAddress(name, value)`
  - `deleteRole(name)`
  - `deleteUser(name)`
  - `deleteUserGroup(name)`
  - `getConlumOnSearchResult(name, index)`
  - `getRoleRow(name)`
  - `getSearchResultRow(name)`
  - `getSearchResultsCount()`
  - `getUserGroupColumnsText(name, index)`
  - `getUserGroupRow(name)`
  - `getUserRow(name)`
  - `inputAddressName(name)`
  - `inputDescription(text)`
  - `inputFullName(text)`
  - `inputLoginName(text)`
  - `inputPhysicalAddress(name)`
  - `inputRoleDesc(text)`
  - `inputRoleName(text)`
  - `inputSearchDescription(text)`
  - `inputUserConfirmPwd(text)`
  - `inputUserPwd(text)`
  - `isAddressDefaultChecked(name)`
  - `isEntityInSearchResult(text)`
  - `isIconViewSelected()`
  - `isListViewSelected()`
  - `isPrivildgeGroupChecked(name)`
  - `isPriviledgeProjectChecked(name, index = 1)`
  - `isTabPresent(text)`
  - `logout()`
  - `modifyRole(name)`
  - `modifyUser(name)`
  - `modifyUserGroup(name)`
  - `modifyUserToNeedChangePassword()`
  - `openSecurityManagerByAdminPath()`
  - `openSecurityRoleCreator()`
  - `openSecurityRoleManager()`
  - `openUserCreator()`
  - `openUserEditor(username)`
  - `openUserGroup(name)`
  - `openUserGroupCreator()`
  - `openUserManager()`
  - `openUserManagerByAdminPath()`
  - `quickCreateUser(userName, fullName, description, password, privileges = ['10'])`
  - `saveEntity()`
  - `search(text)`
  - `searchByName(text)`
  - `selectAndSaveDefaultAddress(name)`
  - `selectSecurityRoleTab(text)`
  - `selectUserAndGroupTab(text)`
  - `unlockUser(searchName)`
  - `viewUserGroup(name)`
- **Related components:** getPage, getSecurityRoleTabContainer, getUserAndGroupTabContainer

### IServerPropertiesPage
- **CSS root:** `.serverProperties-error-desc`
- **User-visible elements:**
  - Alert (`.serverProperties-error-desc`)
- **Component actions:**
  - `basicDeleteTrustRelationship(username, password)`
  - `cancelCreateTrustRelationship()`
  - `clickCancelSaveTrustRelationshipBtn()`
  - `clickCreateTrustRelationshipBtn()`
  - `clickDeleteBtn()`
  - `clickDeleteTrustRelationshipBtn()`
  - `clickSaveBtn()`
  - `clickSetupCreateTrustRelationshipBtn()`
  - `createTrustRelationship(username, password)`
  - `deleteTrustRelationship(username, password)`
  - `getAlertText()`
  - `getBtnValue()`
  - `isTrustedRelationshipExist()`
  - `trustRelationshipCreated()`
  - `trustRelationshipNotCreated()`
- **Related components:** _none_

### MobileConfiguration
- **CSS root:** `_unknown_`
- **User-visible elements:**
  - _none_
- **Component actions:**
  - `chooseFolder(folderName)`
  - `clickCurrentFolderButton()`
  - `clickDeleteMobileServer()`
  - `clickDisplayContent()`
  - `clickDropDownList(device)`
  - `clickMojoButton(buttonName)`
  - `createMobileConfiguration(device, configName, mobileServerName, mobileServerPort, mobileServerType, requestType, authMode)`
  - `deleteCopyConfig()`
  - `findRowByConfigName(configName)`
  - `getConfig(name)`
  - `getConfigTab(tabName)`
  - `getFolder(name)`
  - `getMojoButton(buttonName)`
  - `inputConfigName(name)`
  - `inputMobileServerName(name)`
  - `inputMobileServerPort(port)`
  - `isConfigPresent(name)`
  - `isConfigPresent(name)`
  - `isConfigURLContainerPresent()`
  - `isNewConfigurationButtonPresent()`
  - `loginInHomeScreen(username, password)`
  - `performActionByConfigName(configName, action)`
  - `scrollDown()`
  - `scrollMobileConfigToBottom()`
  - `scrollWindowToBottom()`
  - `selectAuthenticationMode(type)`
  - `selectDeviceType(deviceType)`
  - `selectMobileServerType(type)`
  - `selectRequestType(type)`
  - `setHomePath(device, username, password)`
  - `switchTab(tabName)`
  - `waitForIServerLoginLoading()`
  - `waitForProjectListPresent()`
- **Related components:** getConfigURLContainer

### OIDCConfig
- **CSS root:** `#oidcConfig_adminGroups`
- **User-visible elements:**
  - Admin Groups Input (`#oidcConfig_adminGroups`)
  - Claim Email Input (`#oidcConfig_claimMap_email`)
  - Claim Full Name Input (`#oidcConfig_claimMap_fullName`)
  - Claim Groups Input (`#oidcConfig_claimMap_groups`)
  - Claim User Id Input (`#oidcConfig_claimMap_userId`)
  - Client Id Input (`#oidcConfig_clientId`)
  - Client Secret Input (`#oidcConfig_clientSecret`)
  - Issuer Input (`#oidcConfig_issuer`)
  - Native Client Id Input (`#oidcConfig_nativeClientId`)
  - Redirect Uri Input (`#oidcConfig_redirectUri`)
  - Scope Input (`#oidcConfig_scopes`)
  - Web Uri Input (`#oidcConfig_webUri`)
- **Component actions:**
  - `clickRetrieveUserInfoFromIDToken()`
  - `fillForm(webUri, clientId, clientSecret, issuer, nativeClientId, redirectUri, scope, claimFullName, claimUserId, claimEmail, claimGroups, adminGroups)`
  - `isOIDCPanelDisplay()`
- **Related components:** _none_

### UserEditor
- **CSS root:** `#disable`
- **User-visible elements:**
  - Account Disabled Check Box (`#disable`)
  - Privileges List Locator (`.mstrPrivilegesList`)
- **Component actions:**
  - `clickAccountDisabled(toCheck)`
  - `clickOk()`
  - `clickPasswordMustChange(toCheck)`
  - `confirmPassword(text)`
  - `inputDesciption(text)`
  - `inputFullName(text)`
  - `inputPassword(text)`
  - `inputUserName(text)`
  - `scrollPrivilegesList(toOffset)`
  - `selectPrivilege(privilege)`
  - `selectPrivilegeByNum(num)`
  - `switchTabTo(tabName)`
- **Related components:** _none_

### WebAdminPage
- **CSS root:** `.mstrPanelPortrait`
- **User-visible elements:**
  - Access Denied (`.mstrAlertTitle`)
  - Access Denied Message (`.mstrAlertMessage`)
  - Add Server Form (`#ADDCONNECTSERVER`)
  - Administrator Page Text (`.mstrPathText`)
  - Admin No Access Text (`body`)
  - Admin Properties (`.mstrAdminProperties`)
  - Alert Message (`.mstrAlertMessage`)
  - Health Body (`body`)
  - Purge Button (`.mstrSubmitButton`)
  - Server Property (`.mstrPanelPortrait`)
  - Task Admin Page (`.navbar`)
- **Component actions:**
  - `addIServer()`
  - `cancelModifyProperties()`
  - `clearAndInputPoolSize(poolSize = '50')`
  - `clearAndInputPort(port = '0')`
  - `clearIserver(serverName)`
  - `connectIServer()`
  - `connectIServerWithProperties()`
  - `deleteModifyProperties()`
  - `disconnectAllIservers()`
  - `disconnectIServer(serverName)`
  - `getAdminProperty(serverName, index)`
  - `healthResponse()`
  - `inputIServerName(serverName)`
  - `isAccessDeniedPresent()`
  - `isCachePurged(value)`
  - `isIServerConnected(serverName)`
  - `isIserverDisconnected(serverName)`
  - `isTaskAdminPresent()`
  - `manageIServer(serverName)`
  - `modifyIServer(serverName, isIserverConnected = true)`
  - `openAdminPage()`
  - `openAdminPageWithUser(username, password)`
  - `openDefaultProperties()`
  - `openMobileConfig()`
  - `openOtherConfigurationPage()`
  - `openPurchCachePage()`
  - `openSecurityPage()`
  - `openServerAdminPage()`
  - `openTaskAdminPage()`
  - `openTaskAdminPageWithUser(username, password)`
  - `purgeCache()`
  - `reConnectIServer(serverName)`
  - `returnHomeByLink()`
  - `saveModifyProperties()`
  - `selectAutoConnect()`
  - `selectCacheByName(value)`
  - `selectLeftMenu(menuItem)`
  - `selectManuallyConnect()`
  - `setSecurityProperty(text, toCheck = true)`
- **Related components:** getTaskAdminPage, scrollPage

## Common Workflows (from spec.ts)

1. _none_

## Common Elements (from POM + spec.ts)

1. Admin Properties -- frequency: 2
2. Access Denied -- frequency: 1
3. Access Denied Message -- frequency: 1
4. Account Disabled Check Box -- frequency: 1
5. Add Server Form -- frequency: 1
6. Address Name -- frequency: 1
7. Admin Groups Input -- frequency: 1
8. Admin No Access Text -- frequency: 1
9. Admin Path Shortcut -- frequency: 1
10. Administrator Page Text -- frequency: 1
11. Advanced Search Btn -- frequency: 1
12. Advanced Search Style -- frequency: 1
13. Alert -- frequency: 1
14. Alert Message -- frequency: 1
15. Button Bar -- frequency: 1
16. Cancel Btn -- frequency: 1
17. Claim Email Input -- frequency: 1
18. Claim Full Name Input -- frequency: 1
19. Claim Groups Input -- frequency: 1
20. Claim User Id Input -- frequency: 1
21. Client Id Input -- frequency: 1
22. Client Secret Input -- frequency: 1
23. Confirm Box Ok Btn -- frequency: 1
24. Health Body -- frequency: 1
25. Icon View Btn -- frequency: 1
26. Issuer Input -- frequency: 1
27. List View Btn -- frequency: 1
28. Login Mode -- frequency: 1
29. Login Table -- frequency: 1
30. Native Client Id Input -- frequency: 1
31. New Group -- frequency: 1
32. New Search Btn -- frequency: 1
33. New Securoty Role Btn -- frequency: 1
34. New User -- frequency: 1
35. Oidc Config Admin Groups -- frequency: 1
36. Oidc Config Claim Map Email -- frequency: 1
37. Oidc Config Claim Map Full Name -- frequency: 1
38. Oidc Config Claim Map Groups -- frequency: 1
39. Oidc Config Claim Map User Id -- frequency: 1
40. Oidc Config Client Id -- frequency: 1
41. Oidc Config Client Secret -- frequency: 1
42. Oidc Config Issuer -- frequency: 1
43. Oidc Config Native Client Id -- frequency: 1
44. Oidc Config Redirect Uri -- frequency: 1
45. Oidc Config Scopes -- frequency: 1
46. OKbtn -- frequency: 1
47. Physical Address -- frequency: 1
48. Privileges List Locator -- frequency: 1
49. Purge Button -- frequency: 1
50. Redirect Uri Input -- frequency: 1
51. Scope Input -- frequency: 1
52. Search Alert Msg -- frequency: 1
53. Search Description Box -- frequency: 1
54. Search Exp Drodown -- frequency: 1
55. Search Input Box -- frequency: 1
56. Search Result Section -- frequency: 1
57. Search Result View -- frequency: 1
58. Search Results -- frequency: 1
59. Search Style -- frequency: 1
60. Security Role -- frequency: 1
61. Security Role Tab Container -- frequency: 1
62. Server Property -- frequency: 1
63. Task Admin Page -- frequency: 1
64. Type Section -- frequency: 1
65. User And Group Tab Container -- frequency: 1
66. User Manager -- frequency: 1
67. Web Error Box -- frequency: 1
68. Web Error Message -- frequency: 1
69. Web Uri Input -- frequency: 1

## Key Actions

- `addIServer()` -- used in 0 specs
- `backToServerAdminHome()` -- used in 0 specs
- `basicDeleteTrustRelationship(username, password)` -- used in 0 specs
- `btnAction(value)` -- used in 0 specs
- `cancel()` -- used in 0 specs
- `cancelCreateTrustRelationship()` -- used in 0 specs
- `cancelEntity()` -- used in 0 specs
- `cancelModifyProperties()` -- used in 0 specs
- `chooseFolder(folderName)` -- used in 0 specs
- `clearAndInputPoolSize(poolSize = '50')` -- used in 0 specs
- `clearAndInputPort(port = '0')` -- used in 0 specs
- `clearGroupPriviledges(name)` -- used in 0 specs
- `clearIserver(serverName)` -- used in 0 specs
- `clearPrivileges()` -- used in 0 specs
- `clearUserPrivilege(userName, groupName)` -- used in 0 specs
- `clickAccountDisabled(toCheck)` -- used in 0 specs
- `clickAddressRowActionBtn(name, action)` -- used in 0 specs
- `clickAddressSaveBtn()` -- used in 0 specs
- `clickAdvancedSearch()` -- used in 0 specs
- `clickCancelSaveTrustRelationshipBtn()` -- used in 0 specs
- `clickConfirmBoxOkBtn()` -- used in 0 specs
- `clickCreateTrustRelationshipBtn()` -- used in 0 specs
- `clickCurrentFolderButton()` -- used in 0 specs
- `clickDeleteBtn()` -- used in 0 specs
- `clickDeleteMobileServer()` -- used in 0 specs
- `clickDeleteTrustRelationshipBtn()` -- used in 0 specs
- `clickDisplayContent()` -- used in 0 specs
- `clickDropDownList(device)` -- used in 0 specs
- `clickEditOnSearchResultsFirstItem()` -- used in 0 specs
- `clickIconView()` -- used in 0 specs
- `clickListView()` -- used in 0 specs
- `clickLoginMode(loginMode, toCheck)` -- used in 0 specs
- `clickMojoButton(buttonName)` -- used in 0 specs
- `clickNewAddressBtn()` -- used in 0 specs
- `clickNewSearch()` -- used in 0 specs
- `clickOk()` -- used in 0 specs
- `clickPageFirst()` -- used in 0 specs
- `clickPageNext()` -- used in 0 specs
- `clickPasswordMustChange(toCheck)` -- used in 0 specs
- `clickPriviledge(name)` -- used in 0 specs
- `clickPriviledgeBox(name)` -- used in 0 specs
- `clickRetrieveUserInfoFromIDToken()` -- used in 0 specs
- `clickSaveBtn()` -- used in 0 specs
- `clickSearchExpressionDropdownOption(text)` -- used in 0 specs
- `clickSearchOwnerOption(index, text)` -- used in 0 specs
- `clickSearchTypeOption(index, text)` -- used in 0 specs
- `clickSetupCreateTrustRelationshipBtn()` -- used in 0 specs
- `confirmPassword(text)` -- used in 0 specs
- `connectIServer()` -- used in 0 specs
- `connectIServerWithProperties()` -- used in 0 specs
- `createAndSaveAddress(name, value)` -- used in 0 specs
- `createMobileConfiguration(device, configName, mobileServerName, mobileServerPort, mobileServerType, requestType, authMode)` -- used in 0 specs
- `createTrustRelationship(username, password)` -- used in 0 specs
- `deleteCopyConfig()` -- used in 0 specs
- `deleteModifyProperties()` -- used in 0 specs
- `deleteRole(name)` -- used in 0 specs
- `deleteTrustRelationship(username, password)` -- used in 0 specs
- `deleteUser(name)` -- used in 0 specs
- `deleteUserGroup(name)` -- used in 0 specs
- `deselectPropertyBtn(value, type)` -- used in 0 specs
- `deselectPropertyCheckboxBtn(value)` -- used in 0 specs
- `disconnectAllIservers()` -- used in 0 specs
- `disconnectIServer(serverName)` -- used in 0 specs
- `fillForm(webUri, clientId, clientSecret, issuer, nativeClientId, redirectUri, scope, claimFullName, claimUserId, claimEmail, claimGroups, adminGroups)` -- used in 0 specs
- `fillOidcConfig(clientId, clientSecret, issuer, nativeClientId, redirectUri, scopes, claimMapFullName, claimMapUserId, claimMapEmail, claimMapGroups, adminGroups)` -- used in 0 specs
- `findRowByConfigName(configName)` -- used in 0 specs
- `getAdminProperty(serverName, index)` -- used in 0 specs
- `getAlertText()` -- used in 0 specs
- `getBtnValue()` -- used in 0 specs
- `getConfig(name)` -- used in 0 specs
- `getConfigTab(tabName)` -- used in 0 specs
- `getConlumOnSearchResult(name, index)` -- used in 0 specs
- `getFolder(name)` -- used in 0 specs
- `getMojoButton(buttonName)` -- used in 0 specs
- `getRoleRow(name)` -- used in 0 specs
- `getSearchResultRow(name)` -- used in 0 specs
- `getSearchResultsCount()` -- used in 0 specs
- `getUserGroupColumnsText(name, index)` -- used in 0 specs
- `getUserGroupRow(name)` -- used in 0 specs
- `getUserRow(name)` -- used in 0 specs
- `healthResponse()` -- used in 0 specs
- `inputAddressName(name)` -- used in 0 specs
- `inputConfigName(name)` -- used in 0 specs
- `inputDesciption(text)` -- used in 0 specs
- `inputDescription(text)` -- used in 0 specs
- `inputFullName(text)` -- used in 0 specs
- `inputIServerName(serverName)` -- used in 0 specs
- `inputLoginName(text)` -- used in 0 specs
- `inputMobileServerName(name)` -- used in 0 specs
- `inputMobileServerPort(port)` -- used in 0 specs
- `inputPassword(text)` -- used in 0 specs
- `inputPhysicalAddress(name)` -- used in 0 specs
- `inputPropertyValue(name, value)` -- used in 0 specs
- `inputRoleDesc(text)` -- used in 0 specs
- `inputRoleName(text)` -- used in 0 specs
- `inputSearchDescription(text)` -- used in 0 specs
- `inputUserConfirmPwd(text)` -- used in 0 specs
- `inputUserName(text)` -- used in 0 specs
- `inputUserPwd(text)` -- used in 0 specs
- `isAccessDeniedPresent()` -- used in 0 specs
- `isAddressDefaultChecked(name)` -- used in 0 specs
- `isBtnSelected(value, type)` -- used in 0 specs
- `isCachePurged(value)` -- used in 0 specs
- `isCheckboxBtnSelected(value)` -- used in 0 specs
- `isConfigPresent(name)` -- used in 0 specs
- `isConfigURLContainerPresent()` -- used in 0 specs
- `isEntityInSearchResult(text)` -- used in 0 specs
- `isFromDaySelected(day)` -- used in 0 specs
- `isGuestLoginEnable()` -- used in 0 specs
- `isIconViewSelected()` -- used in 0 specs
- `isIServerConnected(serverName)` -- used in 0 specs
- `isIserverDisconnected(serverName)` -- used in 0 specs
- `isListViewSelected()` -- used in 0 specs
- `isModeSelected(mode)` -- used in 0 specs
- `isNewConfigurationButtonPresent()` -- used in 0 specs
- `isOidcConfigVisible()` -- used in 0 specs
- `isOIDCPanelDisplay()` -- used in 0 specs
- `isPrivildgeGroupChecked(name)` -- used in 0 specs
- `isPriviledgeProjectChecked(name, index = 1)` -- used in 0 specs
- `isRadioBtnSelected(value)` -- used in 0 specs
- `isTabPresent(text)` -- used in 0 specs
- `isTaskAdminPresent()` -- used in 0 specs
- `isTrustedRelationshipExist()` -- used in 0 specs
- `isWebErrorDisplay()` -- used in 0 specs
- `loadDefaultValues(checkIntoView = true)` -- used in 0 specs
- `loginInHomeScreen(username, password)` -- used in 0 specs
- `logout()` -- used in 0 specs
- `manageIServer(serverName)` -- used in 0 specs
- `modifyIServer(serverName, isIserverConnected = true)` -- used in 0 specs
- `modifyRole(name)` -- used in 0 specs
- `modifyUser(name)` -- used in 0 specs
- `modifyUserGroup(name)` -- used in 0 specs
- `modifyUserToNeedChangePassword()` -- used in 0 specs
- `openAdminPage()` -- used in 0 specs
- `openAdminPageWithUser(username, password)` -- used in 0 specs
- `openDefaultProperties()` -- used in 0 specs
- `openMobileConfig()` -- used in 0 specs
- `openOtherConfigurationPage()` -- used in 0 specs
- `openPropertyDropdown(name)` -- used in 0 specs
- `openPurchCachePage()` -- used in 0 specs
- `openSecurityManagerByAdminPath()` -- used in 0 specs
- `openSecurityPage()` -- used in 0 specs
- `openSecurityRoleCreator()` -- used in 0 specs
- `openSecurityRoleManager()` -- used in 0 specs
- `openServerAdminPage()` -- used in 0 specs
- `openTaskAdminPage()` -- used in 0 specs
- `openTaskAdminPageWithUser(username, password)` -- used in 0 specs
- `openUserCreator()` -- used in 0 specs
- `openUserEditor(username)` -- used in 0 specs
- `openUserGroup(name)` -- used in 0 specs
- `openUserGroupCreator()` -- used in 0 specs
- `openUserManager()` -- used in 0 specs
- `openUserManagerByAdminPath()` -- used in 0 specs
- `performActionByConfigName(configName, action)` -- used in 0 specs
- `propertyDropdownValue(name)` -- used in 0 specs
- `purgeCache()` -- used in 0 specs
- `quickCreateUser(userName, fullName, description, password, privileges = ['10'])` -- used in 0 specs
- `reConnectIServer(serverName)` -- used in 0 specs
- `refresh()` -- used in 0 specs
- `returnHomeByLink()` -- used in 0 specs
- `save()` -- used in 0 specs
- `saveChange()` -- used in 0 specs
- `saveEntity()` -- used in 0 specs
- `saveModifyProperties()` -- used in 0 specs
- `scrollDown()` -- used in 0 specs
- `scrollMobileConfigToBottom()` -- used in 0 specs
- `scrollPrivilegesList(toOffset)` -- used in 0 specs
- `scrollWindowToBottom()` -- used in 0 specs
- `search(text)` -- used in 0 specs
- `searchByName(text)` -- used in 0 specs
- `selectAdvacendLogLevelDropdown(item)` -- used in 0 specs
- `selectAndSaveDefaultAddress(name)` -- used in 0 specs
- `selectAuthenticationMode(type)` -- used in 0 specs
- `selectAutoConnect()` -- used in 0 specs
- `selectCacheByName(value)` -- used in 0 specs
- `selectDeviceType(deviceType)` -- used in 0 specs
- `selectDropdownItem(locator, item)` -- used in 0 specs
- `selectFromDate(month, day, year)` -- used in 0 specs
- `selectLeftMenu(menuItem)` -- used in 0 specs
- `selectManuallyConnect()` -- used in 0 specs
- `selectMobileServerType(type)` -- used in 0 specs
- `selectPrivilege(privilege)` -- used in 0 specs
- `selectPrivilegeByNum(num)` -- used in 0 specs
- `selectPropertyBtn(value, type)` -- used in 0 specs
- `selectPropertyCheckboxBtn(value)` -- used in 0 specs
- `selectPropertyDropdownItem(name, item)` -- used in 0 specs
- `selectPropertyRadioBtn(value)` -- used in 0 specs
- `selectRequestType(type)` -- used in 0 specs
- `selectSecurityRoleTab(text)` -- used in 0 specs
- `selectStatModeDropdown(item)` -- used in 0 specs
- `selectToDate(month, day, year)` -- used in 0 specs
- `selectUserAndGroupTab(text)` -- used in 0 specs
- `setAllowAutomaticLoginIfSessionLostCheckBox(toCheck)` -- used in 0 specs
- `setAllowUsersToChangeExpiredPasswordCheckBox(toCheck)` -- used in 0 specs
- `setCheckBox(element, toCheck)` -- used in 0 specs
- `setCreateNewHTTPSessionUponLoginCheckBox(toCheck)` -- used in 0 specs
- `setDefaultLoginMode(loginMode)` -- used in 0 specs
- `setEnablePartitionedCheckBox(toCheck)` -- used in 0 specs
- `setEnableSecureCheckBox(toCheck)` -- used in 0 specs
- `setGuestLogin(toCheck)` -- used in 0 specs
- `setHomePath(device, username, password)` -- used in 0 specs
- `setLoginMode(loginMode, isSet = true)` -- used in 0 specs
- `setProjectList(index)` -- used in 0 specs
- `setSameSiteRadioButton(value)` -- used in 0 specs
- `setSecurityProperty(text, toCheck = true)` -- used in 0 specs
- `switchTab(tabName)` -- used in 0 specs
- `switchTabTo(tabName)` -- used in 0 specs
- `trustRelationshipCreated()` -- used in 0 specs
- `trustRelationshipNotCreated()` -- used in 0 specs
- `unlockUser(searchName)` -- used in 0 specs
- `viewUserGroup(name)` -- used in 0 specs
- `waitForIServerLoginLoading()` -- used in 0 specs
- `waitForProjectListPresent()` -- used in 0 specs

## Source Coverage

- `pageObjects/web_admin/**/*.js`
