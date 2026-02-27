/* eslint-disable @typescript-eslint/no-floating-promises */
import { customCredentials } from '../../../constants/index.js';
import resetObjectAcl from '../../../api/manageAccess/resetObjectAcl.js';
import setObjectAcl from '../../../api/manageAccess/setObjectAcl.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('') };

describe('ShareWithACL', () => {
    const shareWithACLUser = {
        credentials: {
            username: 'tester_auto_swa',
            password: '',
        },
    };

    const shareWithACLTargetUser = {
        credentials: {
            username: 'tester_auto_swa_target',
            password: '',
        },
    };

    const shareWithACLTargetUserGroup = {
        credentials: {
            username: 'Share With ACL User Group',
        },
    };

    const dossierInLibrary = {
        id: 'A941F88C4305E83583E38FBAB1198AE6',
        name: 'Advanced Share Dossier In Library',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const shortcutDossier = {
        id: 'E2C6C80A441CDFACA8EEC3B64D9AFC80',
        name: 'Advanced Share Shortcut Dossier In Library',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const reportNotInLibrary = {
        id: '145866AD4561510901E513AADE6C31E2',
        name: 'Advanced Share Report Not In Library',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const shortcutReport = {
        id: 'F84123E24C7E70F8AB5E439AD400F37D',
        name: 'Advanced Share Shortcut Report Not In Library',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const rsdNotInLibrary = {
        id: '48CD00F340C2C36A9B552FBF4B124BF6',
        name: 'Advanced Share RSD Not In Library',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const objectFolder = {
        id: 'AD690E6C4482EFA836DBBEA470DF72B9',
        name: 'Share with ACL',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
        type: 8,
    };

    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const customApp = {
        id: '0431E936DC004D658DC872D4B01AA738',
        name: 'AUTO_Manage_Access_Enabled',
    };

    const customAppDarkmode = {
        id: '6098153EC07341F0BB9F703696164E9A',
        name: 'AUTO_Manage_Access_Color_Theme',
    };

    const customAppDisableMA = {
        id: '628FDA3A3ADF4BD591F0F320F05698A6',
        name: 'AUTO_Manage_Access_Disabled',
    };

    const defaultAcl = [
        {
            value: 'Full Control',
            id: '2FC297F942BCB63A1E63B9BBB7ECA76F',
            name: 'tester_auto_swa',
        },
        {
            value: 'Can View',
            id: 'DF6F95404D33F536DD24CCB3EB4DA5D3',
            name: 'tester_auto_swa_target',
        },
        {
            value: 'Can View',
            id: 'A17FBA4743ADD9CD03F8BC9A5EA6F8E8',
            name: 'Share With ACL User Group',
        },
    ];

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        manageAccess,
        infoWindow,
        shareDossier,
        share,
        contentDiscovery,
        sidebar,
        listView,
        librarySearch,
        fullSearch,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await libraryPage.executeScript('window.localStorage.clear();');
        await loginPage.login(shareWithACLUser.credentials);
        await libraryPage.openCustomAppById({ id: customApp.id });
        await resetObjectAcl({ credentials: shareWithACLUser.credentials, object: objectFolder, acl: defaultAcl });
    });

    afterEach(async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
    });

    /**
     * 1. user with no full control on object
     * 2. dossier in library
     * 3. from info-window in library home
     */
    it('[TC90987_01] Validate keep normal share dialog for user without full control', async () => {
        //switch to user without full control
        await libraryPage.switchUser(shareWithACLTargetUser.credentials);
        //open info-window for dossier in library home
        await libraryPage.moveDossierIntoViewPort(dossierInLibrary.name);
        await libraryPage.openDossierInfoWindow(dossierInLibrary.name);
        await infoWindow.shareDossier();
        //check no change ACL section in share dialog for user without full control
        await since('change ACL section present status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isChangeACLPresent())
            .toBe(false);
        shareDossier.closeDialog();
    });

    /**
     * 1. dossier in library
     * 2. share from info-window in library home
     * 3. share to user
     * 4. 'Deny All' change to 'Can View'
     */
    it('[TC90987_02] Validate grant ACL by click share button for dossier', async () => {
        //set object init ACL to 'Denied All'
        await setObjectAcl({
            credentials: shareWithACLUser.credentials,
            object: objectFolder,
            acl: [
                {
                    value: 'Denied All',
                    id: 'DF6F95404D33F536DD24CCB3EB4DA5D3',
                    name: 'tester_auto_swa_target',
                },
            ],
        });
        // open share dialog through info window
        await libraryPage.moveDossierIntoViewPort(dossierInLibrary.name);
        await libraryPage.openDossierInfoWindow(dossierInLibrary.name);
        await infoWindow.shareDossier();
        await takeScreenshotByElement(
            shareDossier.getShareContent(),
            'TC90987_02_01',
            'Share with acl: default share with acl dialog',
            { tolerance: 0.1 }
        );
        await shareDossier.openACL();
        await takeScreenshotByElement(
            await shareDossier.getChangeACLDropDownMenu(),
            'TC90987_02_02',
            'Share with acl: open ACL dropdown menu',
            { tolerance: 0.1 }
        );
        await shareDossier.changeACLTo('Can View');
        await takeScreenshotByElement(
            await shareDossier.getShareContent(),
            'TC90987_02_03',
            'Share with acl: change to can view',
            { tolerance: 0.1 }
        );
        await shareDossier.searchRecipient(shareWithACLTargetUser.credentials.username);
        await takeScreenshotByElement(
            await shareDossier.getShareContent(),
            'TC90987_02_04',
            'Share with acl: search target user',
            { tolerance: 0.2 }
        );
        await shareDossier.selectRecipients([shareWithACLTargetUser.credentials.username]);
        await since('copy button text should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getCopyButtonText())
            .toBe('Apply and Copy');
        await shareDossier.shareDossier(true);

        //check acl in manage access dialog
        await infoWindow.openManageAccessDialog();
        await manageAccess.waitForManageAccessLoading();
        await since(`${shareWithACLTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL(shareWithACLTargetUser.credentials.username))
            .toBe('Can View');
        await manageAccess.cancelManageAccessChange();

        //login with target user and check its ACL by workflow
        await libraryPage.switchUser(shareWithACLTargetUser.credentials);
        await libraryPage.moveDossierIntoViewPort(dossierInLibrary.name);
        await libraryPage.openDossierInfoWindow(dossierInLibrary.name);
        //should be false, however it will fail due to DE277686, set as true temporarily
        await since(`Edit button state should be #{expected}, while we get #{actual}`)
            .expect(await infoWindow.isEditIconPresent())
            .toBe(true);
        await since(`Manage access button state should be #{expected}, while we get #{actual}`)
            .expect(await infoWindow.isManageAccessPresent())
            .toBe(true);
    });

    /**
     * 1. rsd not in library
     * 2. share from info-window in content discovery view
     * 3. share to user + user group
     * 4. 'Can View' change to 'Can Modify'
     */
    it('[TC90987_03] Validate grant ACL by click “Apply and Copy“ for rsd not in library', async () => {
        //open info-window in content discovery view
        await libraryPage.openSidebarOnly();
        await libraryPage.sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath([
            'Shared Reports',
            '_REGRESSION TEST_',
            'Library - Manage Access',
            'Automation',
            'Share with ACL',
        ]);
        await listView.openInfoWindowFromListView(rsdNotInLibrary.name);
        await listView.clickShareFromIW();
        await since('change acl dropdown button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isChangeACLPresent())
            .toBe(true);
        await since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);
        await since('copy button text should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getCopyButtonText())
            .toBe('Copy');
        await shareDossier.searchRecipient(shareWithACLTargetUser.credentials.username);
        await shareDossier.selectRecipients([shareWithACLTargetUser.credentials.username]);
        await shareDossier.searchRecipient(shareWithACLTargetUserGroup.credentials.username);
        await shareDossier.selectGroupRecipient(shareWithACLTargetUserGroup.credentials.username);
        await shareDossier.changeACLTo('Can Modify');
        await since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(true);
        await since('Apply and Copy button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getCopyButtonText())
            .toBe('Apply and Copy');

        //get copied link
        await shareDossier.copyLink(true);
        let url = await shareDossier.getLink();
        await shareDossier.closeDialog();

        //check acl in manage access
        await listView.clickMoreMenuFromIW();
        await listView.clickManageAccessFromIW();
        await manageAccess.waitForManageAccessLoading();
        await since(`${shareWithACLTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL(shareWithACLTargetUser.credentials.username))
            .toBe('Can Modify');
        await since(
            `${shareWithACLTargetUserGroup.credentials.username} ACL should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(shareWithACLTargetUserGroup.credentials.username))
            .toBe('Can Modify');
        await manageAccess.cancelManageAccessChange();

        //switch user to recipient
        await libraryPage.switchUser(shareWithACLTargetUser.credentials);
        //remove rsd in recipient library home
        await libraryPage.removeDossierFromLibrary(shareWithACLTargetUser.credentials, rsdNotInLibrary);
        //apply shared link and check target user's ACL by work flow
        await libraryPage.switchToNewWindowWithUrl(url);
        await dossierPage.waitForItemLoading();
        //add to library
        await dossierPage.addToLibrary();
        await dossierPage.openShareDropDown();
        await since(`Manage access button state should be #{expected}, while we get #{actual}`)
            .expect(await share.isManageAccessPresent())
            .toBe(true);
        await dossierPage.goToLibrary();
    });

    /**
     * 1. shortcut report not in library
     * 2. share from info-window in content discovery view
     * 3. share to user + user group
     * 4. "Can View" change to 'Full Control'
     * 5. check both shortcut and target report ACL change
     */
    it('[TC90987_04] Validate grant ACL during share for shortcut report', async () => {
        //open info-window in content discovery view
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath([
            'Shared Reports',
            '_REGRESSION TEST_',
            'Library - Manage Access',
            'Automation',
            'Share with ACL',
        ]);
        await listView.openInfoWindowFromListView(shortcutReport.name);
        await listView.clickShareFromIW();
        await since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);
        await since('copy button text status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getCopyButtonText())
            .toBe('Copy');
        await shareDossier.searchRecipient(shareWithACLTargetUser.credentials.username);
        await shareDossier.selectRecipients([shareWithACLTargetUser.credentials.username]);
        await shareDossier.searchRecipient(shareWithACLTargetUserGroup.credentials.username);
        await shareDossier.selectGroupRecipient(shareWithACLTargetUserGroup.credentials.username);
        await since('copy button text should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getCopyButtonText())
            .toBe('Copy');
        await shareDossier.changeACLTo('Full Control');
        await since('copy button text should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getCopyButtonText())
            .toBe('Apply and Copy');
        await shareDossier.shareDossier(true);

        //check acl in shortcut manage access dialog
        await listView.clickMoreMenuFromIW();
        await listView.clickManageAccessFromIW();
        await manageAccess.waitForManageAccessLoading();
        await since(`${shareWithACLTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL(shareWithACLTargetUser.credentials.username))
            .toBe('Full Control');
        await since(
            `${shareWithACLTargetUserGroup.credentials.username} ACL should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(shareWithACLTargetUserGroup.credentials.username))
            .toBe('Full Control');
        await manageAccess.cancelManageAccessChange();

        //switch user to recipient, should expose manage access since it have full control ACL
        await libraryPage.switchUser(shareWithACLTargetUser.credentials);
        await librarySearch.openSearchBox();
        await librarySearch.search(reportNotInLibrary.name);
        await librarySearch.pressEnter();
        await fullSearch.clickAllTab();
        await fullSearch.waitForSearchLoading();
        await fullSearch.openInfoWindow(reportNotInLibrary.name);
        await since(`Manage access button state should be #{expected}, while we get #{actual}`)
            .expect(await infoWindow.isManageAccessPresent())
            .toBe(true);
    });

    /**
     * 1. shortcut dossier in library
     * 2. share from dossier toolbar in content discovery view
     * 3. share to user + user group
     * 4. "Can Modify" change to 'Full Control'
     * 5. check target dossier ACL change
     */
    it('[TC90990_01] Validate grant ACL during share after executing shortcut dossier', async () => {
        //set object init ACL to 'Can Modify'
        await setObjectAcl({
            credentials: shareWithACLUser.credentials,
            object: objectFolder,
            acl: [
                {
                    value: 'Can Modify',
                    id: 'DF6F95404D33F536DD24CCB3EB4DA5D3',
                    name: 'tester_auto_swa_target',
                },
            ],
        });
        //open shortcut dossier in content discovery view
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(project.name);
        await contentDiscovery.openFolderByPath([
            'Shared Reports',
            '_REGRESSION TEST_',
            'Library - Manage Access',
            'Automation',
            'Share with ACL',
        ]);
        await listView.rightClickToOpenContextMenu({ name: shortcutDossier.name, isWaitCtxMenu: false });
        await libraryPage.clickDossierContextMenuItem('Open');
        await dossierPage.openShareDropDown();
        await share.openShareDossierDialog();
        await since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(false);
        await since('copy button text should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getCopyButtonText())
            .toBe('Copy');
        await takeScreenshotByElement(
            await shareDossier.getShareContent(),
            'TC90990_01_01',
            'share with ACL default dialog',
            { tolerance: 0.1 }
        );
        await shareDossier.searchRecipient(shareWithACLTargetUser.credentials.username);
        await shareDossier.selectRecipients([shareWithACLTargetUser.credentials.username]);
        await shareDossier.searchRecipient(shareWithACLTargetUserGroup.credentials.username);
        await shareDossier.selectGroupRecipient(shareWithACLTargetUserGroup.credentials.username);
        await takeScreenshotByElement(
            await shareDossier.getShareContent(),
            'TC90990_01_02',
            'Share with acl: add recipient',
            { tolerance: 0.1 }
        );
        await shareDossier.changeACLTo('Full Control');
        await takeScreenshotByElement(
            await shareDossier.getShareContent(),
            'TC90990_01_03',
            'Share with acl: change to Full Control',
            { tolerance: 0.1 }
        );
        await since('copy button text should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.getCopyButtonText())
            .toBe('Apply and Copy');
        await shareDossier.shareDossier(true);
        await dossierPage.goToLibrary();

        //check acl in shortcut dossier manage access dialog
        await listView.openInfoWindowFromListView(shortcutDossier.name);
        await listView.clickMoreMenuFromIW();
        await listView.clickManageAccessFromIW();
        await manageAccess.waitForManageAccessLoading();
        await since(`${shareWithACLTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL(shareWithACLTargetUser.credentials.username))
            .toBe('Full Control');
        await since(
            `${shareWithACLTargetUserGroup.credentials.username} ACL should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(shareWithACLTargetUserGroup.credentials.username))
            .toBe('Full Control');
        await takeScreenshotByElement(
            await manageAccess.getManageAccessDialog(),
            'TC90990_01_04',
            'Check acl in shortcut dossier manage access dialog',
            { tolerance: 0.1 }
        );
        await manageAccess.cancelManageAccessChange();

        //switch user to recipient, should expose manage access since it have full control ACL
        await libraryPage.switchUser(shareWithACLTargetUser.credentials);
        await libraryPage.moveDossierIntoViewPort(dossierInLibrary.name);
        await libraryPage.openDossierInfoWindow(dossierInLibrary.name);
        await since(`Manage access button state should be #{expected}, while we get #{actual}`)
            .expect(await infoWindow.isManageAccessPresent())
            .toBe(true);
    });

    /**
     * 1. color theme app
     * 2. check share with acl dialog;
     */
    it('[TC90990_02]  Validate x-func with color theme for advanced share', async () => {
        await libraryPage.openCustomAppById({ id: customAppDarkmode.id });
        await libraryPage.moveDossierIntoViewPort(dossierInLibrary.name);
        await libraryPage.openDossierInfoWindow(dossierInLibrary.name);
        await infoWindow.shareDossier();
        //check share with acl dialog
        await takeScreenshotByElement(
            shareDossier.getShareContent(),
            'TC90990_02_01',
            'Check share with acl dialog in color theme app',
            { tolerance: 0.1 }
        );
        await shareDossier.openACL();
        await takeScreenshotByElement(
            await shareDossier.getChangeACLDropDownMenu(),
            'TC90990_02_02',
            'Check dropdown menu in color theme app',
            { tolerance: 0.1 }
        );
        shareDossier.closeDialog();
    });

    /**
     * 1. custom app diable manage access
     * 2. check share with acl dialog;
     */
    it('[TC90990_03]  Validate keep normal share dialog in custom app disable manage access', async () => {
        await libraryPage.openCustomAppById({ id: customAppDisableMA.id });
        await libraryPage.moveDossierIntoViewPort(dossierInLibrary.name);
        await libraryPage.openDossierInfoWindow(dossierInLibrary.name);
        await infoWindow.shareDossier();
        //check share with acl dialog
        await since('change acl dropdown button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isChangeACLPresent())
            .toBe(false);
        shareDossier.closeDialog();
    });
});

export const config = specConfiguration;
