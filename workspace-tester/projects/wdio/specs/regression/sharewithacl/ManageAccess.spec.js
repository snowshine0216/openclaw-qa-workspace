/* eslint-disable @typescript-eslint/no-floating-promises */
import resetObjectAcl from '../../../api/manageAccess/resetObjectAcl.js';
import setObjectAcl from '../../../api/manageAccess/setObjectAcl.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('ManageAccess', () => {
    const manageAccessUser = {
        credentials: {
            username: 'tester_auto_ma',
            password: '',
        },
    };

    const manageAccessAddTargetUser = {
        credentials: {
            username: 'tester_auto_ma_add_target',
            password: '',
        },
    };

    const manageAccessUpdateTargetUser = {
        credentials: {
            username: 'tester_auto_ma_update_target',
            password: '',
        },
    };

    const manageAccessWithoutPrivilegeWithFullACL = {
        credentials: {
            username: 'tester_auto_ma_noprivilege_full_acl',
            password: '',
        },
    };

    const manageAccessWithoutPrivilegeWithNoACL = {
        credentials: {
            username: 'tester_auto_ma_noprivilege_no_acl',
            password: '',
        },
    };

    const manageAccessRemoveTargetUser = {
        credentials: {
            username: 'tester_auto_ma_remove_target',
            password: '',
        },
    };

    const manageAccessTargetUserGroup = {
        credentials: {
            username: 'Manage Access User Group',
        },
    };

    const dossierInLibrary = {
        id: '16839D234CB25A0254AC60A0B303F2FF',
        name: 'Manage Access Dossier In Library',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierNotInLibrary = {
        id: 'BEDE33804765443317F269837CDD4A58',
        name: 'Manage Access Dossier Not In Library',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const rsdNotInLibrary = {
        id: 'FF0A007847ACEDE3C2D7D3A1824D16C7',
        name: 'Manage Access RSD Not In Library',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const objectFolder = {
        id: 'D8772FA44B690632D9E2429583B86858',
        name: 'Manage Access',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
        type: 8,
    };

    const shortcutDossier = {
        id: '8D08CB9F435018734AF35280BDCE029D',
        name: 'Manage Access Dossier In Library Shortcut',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const parentFolder = {
        id: '28D4251744C762093DB4BE830528AE24',
        name: 'Manage Access Folder',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
        type: 8,
    };

    const childFolder = {
        id: '2004A79D4B91362A277F4784D715B74E',
        name: 'Manage Access Child Folder',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
        type: 8,
    };

    const childDossier = {
        id: '5B4444254B73EBA8DFB9788074ED4AD2',
        name: 'Manage Access Child Dossier',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const shortcutFolder = {
        id: '64DD9EBD49EA51DA9E420884792290C6',
        name: 'Manage Access Shortcut Folder',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
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

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const defaultAcl = [
        {
            value: 'Full Control',
            id: 'EF5990934D23F24ABE0225B2A6E908EE',
            name: 'tester_auto_ma',
        },
        {
            value: 'Can View',
            id: 'B916CACD47341989566C3EB92AF1273A',
            name: 'tester_auto_ma_update_target',
        },
        {
            value: 'Can View',
            id: '3F5CC2C34C63F16A6E38F3A7FC34D0EF',
            name: 'tester_auto_ma_remove_target',
        },
        {
            value: 'Full Control',
            id: 'CF47FCFD42B224A6C2219CBBF8B8F2A8',
            name: 'tester_auto_ma_noprivilege_full_acl',
        },
        {
            value: 'Can View',
            id: '807FB06F4340845ACCBC25A8D1B1A1E1',
            name: 'tester_auto_ma_noprivilege_no_acl',
        },
    ];

    let {
        loginPage,
        libraryPage,
        dossierPage,
        manageAccess,
        infoWindow,
        share,
        sidebar,
        listView,
        librarySearch,
        fullSearch,
        contentDiscovery,
        shareDossier,
    } = browsers.pageObj1;

    let diffTolerance = 0.2;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await libraryPage.executeScript('window.localStorage.clear();');
        await loginPage.login(manageAccessUser.credentials);
        await libraryPage.openCustomAppById({ id: customApp.id });
        await resetObjectAcl({ credentials: manageAccessUser.credentials, object: objectFolder, acl: defaultAcl });
    });

    afterEach(async () => {
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
    });

    /**
     * 1. user with no full control but with privilge on object
     * 2. dossier in library
     * 3. from info-window in library home
     */
    it('[TC90988_01] Validate entry for manage access for user without full control but have privilege', async () => {
        //switch to user without full control
        await libraryPage.switchUser(manageAccessUpdateTargetUser.credentials);
        //open info-window for dossier in library home
        await libraryPage.moveDossierIntoViewPort(dossierInLibrary.name);
        await libraryPage.openDossierInfoWindow(dossierInLibrary.name);
        //check "manage access" in info-window for user with privilege but no full acl
        await since('manage access present status should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isManageAccessPresent())
            .toBe(true);
        //check "manage access" in context menu for user with privilege but no full acl
        await libraryPage.openDossierContextMenu(dossierInLibrary.name);
        await libraryPage.clickDossierContextMenuItem('Manage Access');
        await takeScreenshotByElement(
            await manageAccess.getManageAccessDialog(),
            'TC90988_01',
            'Manage access - User with privilege but no full acl',
            { tolerance: diffTolerance }
        );

        await manageAccess.cancelManageAccessChange();

        
    });


    /**
     * 1. user with full control but without Web use object Sharing Editor privilege on object
     * 2. dossier in library
     * 3. from info-window in library home
     */
    it('[TC90989_05] Validate entry for manage access for user with full control but without privilege', async () => {
        //switch to user without privilege
        await libraryPage.switchUser(manageAccessWithoutPrivilegeWithFullACL.credentials);

        //open info-window for dossier in library home
        await libraryPage.moveDossierIntoViewPort(dossierInLibrary.name);
        await libraryPage.openDossierInfoWindow(dossierInLibrary.name);
        //check no "manage access" in info-window for user without privilege
        await since('manage access present status should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isManageAccessPresent())
            .toBe(false);
        // check share with acl in share dialog
        await infoWindow.shareDossier();
        since('share with acl present status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isChangeACLPresent())
            .toBe(false);
        await shareDossier.closeDialog();
        await infoWindow.close();

        //check no "manage access" in context menu for user without privilege
        await libraryPage.openDossierContextMenu(dossierInLibrary.name);
        await since('manage access present in dossier context menu status should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isDossierContextMenuItemExisted('Manage Access'))
            .toBe(false);
        
    });


    /**
     * 1. user without full control and without Web use object Sharing Editor privilege on object
     * 2. dossier in library
     * 3. from info-window in library home
     */
    it('[TC90989_06] Validate entry for manage access for user without full control and without privilege', async () => {
        //switch to user without full control
        await libraryPage.switchUser(manageAccessWithoutPrivilegeWithNoACL.credentials);

        //open info-window for dossier in library home
        await libraryPage.moveDossierIntoViewPort(dossierInLibrary.name);
        await libraryPage.openDossierInfoWindow(dossierInLibrary.name);
        //check no "manage access" in info-window for user without privilege
        await since('manage access present status should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isManageAccessPresent())
            .toBe(false);
        // check share with acl in share dialog
        await infoWindow.shareDossier();
        since('share with acl present status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isChangeACLPresent())
            .toBe(false);
        await shareDossier.closeDialog();
        await infoWindow.close();

        //check no "manage access" in context menu for user without privilege
        await libraryPage.openDossierContextMenu(dossierInLibrary.name);
        await since('manage access present in dossier context menu status should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isDossierContextMenuItemExisted('Manage Access'))
            .toBe(false);
        
    });


    /**
     * 1. dossier in library
     * 2. from context menu in library home
     * 3. add "Can View"
     * 4. user group
     */
    it('[TC90988_02] Validate add ACL for dossier', async () => {
        //open manage access window from context menu in library home
        await libraryPage.openDossierContextMenu(dossierInLibrary.name);
        await libraryPage.clickDossierContextMenuItem('Manage Access');
        await takeScreenshotByElement(
            await manageAccess.getManageAccessDialog(),
            'TC90988_02_01',
            'Manage access: default dialog',
            { tolerance: 0.1 }
        );
        await manageAccess.openACL(manageAccessUpdateTargetUser.credentials.username);
        await takeScreenshotByElement(
            await manageAccess.getManageAccessDialog(),
            'TC90988_02_02',
            'Manage access: acl dropdown menu in acl list',
            { tolerance: 0.1 }
        );
        await manageAccess.openACLInSearchSection();
        await takeScreenshotByElement(
            await manageAccess.getManageAccessDialog(),
            'TC90988_02_03',
            'Manage access: acl dropdown menu in search section',
            { tolerance: 0.1 }
        );
        await manageAccess.addACL([manageAccessAddTargetUser.credentials.username], [], 'Can View');
        await takeScreenshotByElement(
            await manageAccess.getManageAccessDialog(),
            'TC90988_02_04',
            'Manage access: add acl',
            { tolerance: 0.1 }
        );
        await manageAccess.saveManageAccessChange();
        await libraryPage.openDossierContextMenu(dossierInLibrary.name);
        await libraryPage.clickDossierContextMenuItem('Manage Access');
        //check ACL added successfully
        await takeScreenshotByElement(
            await manageAccess.getManageAccessDialog(),
            'TC90988_02_05',
            'Manage access: acl added success',
            { tolerance: 0.1 }
        );
        await manageAccess.cancelManageAccessChange();
    });

    /**
     * 1. rsd not in library
     * 2. from info-window in global search
     * 3. change from "Can View" to "Full Control"
     */
    it('[TC90988_03] Validate update ACL for rsd not in library', async () => {
        //open manage access window from info-window in global search result panel
        await librarySearch.openSearchBox();
        await librarySearch.search(rsdNotInLibrary.name);
        await librarySearch.pressEnter();
        await fullSearch.clickAllTab();
        await fullSearch.waitForSearchLoading();
        await fullSearch.openInfoWindow(rsdNotInLibrary.name);
        await infoWindow.openManageAccessDialog();
        await manageAccess.waitForManageAccessLoading();
        await since(
            `${manageAccessUpdateTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessUpdateTargetUser.credentials.username))
            .toBe('Can View');
        await manageAccess.updateACL(manageAccessUpdateTargetUser.credentials.username, 'Full Control');
        await manageAccess.saveManageAccessChange();
        await infoWindow.openManageAccessDialog();
        await manageAccess.waitForManageAccessLoading();
        //check ACL updated successfully
        await since(
            `${manageAccessUpdateTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessUpdateTargetUser.credentials.username))
            .toBe('Full Control');
        await manageAccess.cancelManageAccessChange();
    });

    /**
     * 1. report in library
     * 2. from share menu in toolbar
     * 3. remove ACL "Full Control"
     */
    it('[TC90988_04] Validate remove ACL for report', async () => {
        //set object init ACL to 'Full Control'
        await setObjectAcl({
            credentials: manageAccessUser.credentials,
            object: objectFolder,
            acl: [
                {
                    value: 'Full Control',
                    id: 'B916CACD47341989566C3EB92AF1273A',
                    name: 'tester_auto_ma_update_target',
                },
            ],
        });
        //open share dropdown menu in report toolbar
        await libraryPage.openDossier(dossierInLibrary.name);
        await dossierPage.openShareDropDown();
        await share.openManageAccessDialog();
        await manageAccess.waitForManageAccessLoading();
        await since(
            `${manageAccessUpdateTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessUpdateTargetUser.credentials.username))
            .toBe('Full Control');
        await manageAccess.removeACL(manageAccessUpdateTargetUser.credentials.username);
        await manageAccess.saveManageAccessChange();
        await share.closeSharePanel();
        await dossierPage.openShareDropDown();
        await share.openManageAccessDialog();
        await manageAccess.waitForManageAccessLoading();
        //check ACL removed successfully
        await since(
            `${manageAccessUpdateTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessUpdateTargetUser.credentials.username))
            .toBe('None');
        await manageAccess.cancelManageAccessChange();
        await dossierPage.goToLibrary();
    });

    /**
     * 1. shortcut dossier
     * 2. from info-window in content discovery view
     * 3. remove ACL: original ACL (Custom with deny bit)
     */
    it('[TC90988_05] Validate remove ACL for shortcut dossier', async () => {
        //set object init ACL to custom with deny bit
        await setObjectAcl({
            credentials: manageAccessUser.credentials,
            object: objectFolder,
            acl: [
                {
                    value: 'Custom',
                    id: 'B916CACD47341989566C3EB92AF1273A',
                    name: 'tester_auto_ma_update_target',
                    rights: 223,
                    denyRights: 1,
                },
            ],
        });
        //from info-window in content discovery view
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(objectFolder.project.name);
        await contentDiscovery.openFolderByPath([
            'Shared Reports',
            '_REGRESSION TEST_',
            'Library - Manage Access',
            'Automation',
            'Manage Access'

        ]);
        await listView.openInfoWindowFromListView(shortcutDossier.name);
        await listView.clickMoreMenuFromIW();
        await listView.clickManageAccessFromIW();
        await manageAccess.waitForManageAccessLoading();
        await since(
            `${manageAccessUpdateTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessUpdateTargetUser.credentials.username))
            .toBe('Custom');
        await manageAccess.hoverACL(manageAccessUpdateTargetUser.credentials.username);
        await takeScreenshotByElement(
            await manageAccess.getManageAccessDialog(),
            'TC90988_05_01',
            'Manage access: custom acl with deny bit',
            { tolerance: 0.1 }
        );
        await manageAccess.removeACL(manageAccessUpdateTargetUser.credentials.username);
        await manageAccess.saveManageAccessChange();
        //check shortcut dossier ACL
        await listView.clickMoreMenuFromIW();
        await listView.clickManageAccessFromIW();
        await manageAccess.waitForManageAccessLoading();
        await since(
            `${manageAccessUpdateTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessUpdateTargetUser.credentials.username))
            .toBe('None');
        await manageAccess.cancelManageAccessChange();
    });

    /**
     * 1. customapp disable manage access
     * 2. dossier in library
     * 3. from info-window in library home
     */
    it('[TC90989_01] Validate no entry for manage access in custom app disable manage access', async () => {
        //switch to custom app disable manage access
        await libraryPage.openCustomAppById({ id: customAppDisableMA.id });
        //open info-window for dossier in library home
        await libraryPage.moveDossierIntoViewPort(dossierInLibrary.name);
        await libraryPage.openDossierInfoWindow(dossierInLibrary.name);
        //check no "manage access" in info-window for custom app disable manage access
        await since('manage access present status should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isManageAccessPresent())
            .toBe(false);
    });

    /**
     * 1. dossier not in library
     * 2. from global search info-window
     * 3. add Can Modify, update to Full Control, remove Deny all
     * 4. user combine user group
     */
    it('[TC90989_02] Validate combination of add, update, remove ACL for dossier not in library', async () => {
        //open manage access window from info-window in global search result panel
        await librarySearch.openSearchBox();
        await librarySearch.search(dossierNotInLibrary.name);
        await librarySearch.pressEnter();
        await fullSearch.clickAllTab();
        await fullSearch.waitForSearchLoading();
        await fullSearch.openInfoWindow(dossierNotInLibrary.name);
        await infoWindow.openManageAccessDialog();
        await manageAccess.waitForManageAccessLoading();
        await manageAccess.addACL(
            [manageAccessAddTargetUser.credentials.username],
            [manageAccessTargetUserGroup.credentials.username],
            'Can Modify'
        );
        await manageAccess.updateACL(manageAccessUpdateTargetUser.credentials.username, 'Full Control');
        await manageAccess.removeACL(manageAccessRemoveTargetUser.credentials.username);
        await manageAccess.saveManageAccessChange();
        await infoWindow.openManageAccessDialog();
        await manageAccess.waitForManageAccessLoading();
        //check ACL updated successfully
        await since(
            '${manageAccessAddTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}'
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessAddTargetUser.credentials.username))
            .toBe('Can Modify');
        await since(
            '${manageAccessTargetUserGroup.credentials.username} ACL should be #{expected}, while we get #{actual}'
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessTargetUserGroup.credentials.username))
            .toBe('Can Modify');
        await since(
            '${manageAccessUpdateTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}'
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessUpdateTargetUser.credentials.username))
            .toBe('Full Control');
        await since(
            '${manageAccessRemoveTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}'
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessRemoveTargetUser.credentials.username))
            .toBe('None');
        await manageAccess.cancelManageAccessChange();
    });

    /**
     * 1. color theme app
     * 2. check library home info-window, context menu, manage access dialog, share panel, content discovery info-window, context menu;
     */
    it('[TC90989_03] Validate x-func with color theme for manage access', async () => {
        await libraryPage.openCustomAppById({ id: customAppDarkmode.id });
        //check library home info-window
        await libraryPage.moveDossierIntoViewPort(dossierInLibrary.name);
        await libraryPage.openDossierInfoWindow(dossierInLibrary.name);
        await takeScreenshotByElement(
            await infoWindow.getMainInfo(),
            'TC90989_03_01',
            'Info window dialog in color theme app',
            { tolerance: 0.018 }
        );
        //check manage access dialog
        await infoWindow.openManageAccessDialog();
        await manageAccess.waitForManageAccessLoading();
        await takeScreenshotByElement(
            await manageAccess.getManageAccessDialog(),
            'TC90989_03_02',
            'Manage access dialog in color theme app',
            { tolerance: 0.1 }
        );
        await manageAccess.openACL(manageAccessUpdateTargetUser.credentials.username);
        await takeScreenshotByElement(
            await manageAccess.getManageAccessDialog(),
            'TC90989_03_03',
            'Manage access acl dropdown menu in acl list in color theme app',
            { tolerance: 0.1 }
        );
        await manageAccess.openACLInSearchSection();
        await takeScreenshotByElement(
            await manageAccess.getManageAccessDialog(),
            'TC90989_03_04',
            'Manage access: acl dropdown menu in search section in color theme app',
            { tolerance: 0.1 }
        );
        await manageAccess.cancelManageAccessChange();
        //check library home context menu
        await libraryPage.openDossierContextMenu(dossierInLibrary.name);
        await takeScreenshotByElement(
            await libraryPage.getDossierContextMenu(),
            'TC90989_03_05',
            'Library home context menu in color theme app',
            { tolerance: 0.1 }
        );
        //check share panel in toolbar
        await libraryPage.clickDossierContextMenuItem('Open');
        await dossierPage.openShareDropDown();
        await takeScreenshotByElement(await share.getSharePanel(), 'TC90989_04_04', 'Share panel in color theme app', {
            tolerance: 0.1,
        });
        await dossierPage.goToLibrary();
        //check info-window in content discovery view
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(objectFolder.project.name);
        await contentDiscovery.openFolderByPath([
            'Shared Reports',
            '_REGRESSION TEST_',
            'Library - Manage Access',
            'Automation',
            'Manage Access',
        ]);
        await listView.openInfoWindowFromListView(dossierInLibrary.name);
        await listView.clickMoreMenuFromIW();
        await takeScreenshotByElement(
            await listView.getContextMenuDropdown(),
            'TC90989_03_07',
            'Folder browsing object context menu in color theme app',
            {
                tolerance: 0.1,
            }
        );
    });

    /**
     * 1. normal folder
     * 2. from context menu in content discovery view
     * 3. update ACL from "Custom" to "Denied All"
     * 4. unselect apply to all objects under this folder
     */
    it('[TC90988_06] Validate update ACL for folder, unselect apply to all objects under this folder', async () => {
        //set folder init ACL to custom with deny bit
        await setObjectAcl({
            credentials: manageAccessUser.credentials,
            object: objectFolder,
            acl: [
                {
                    value: 'Custom',
                    id: 'B916CACD47341989566C3EB92AF1273A',
                    name: 'tester_auto_ma_update_target',
                    rights: 223,
                    denyRights: 1,
                },
            ],
        });
        //open folder's manage access dialog from content discovery view
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(objectFolder.project.name);
        await contentDiscovery.openFolderByPath([
            'Shared Reports',
            '_REGRESSION TEST_',
            'Library - Manage Access',
            'Automation',
            'Manage Access',
            'Manage Access Folder',
        ]);
        await contentDiscovery.openFromContextMenuForFloder(parentFolder.name, 'Manage Access');
        await manageAccess.waitForManageAccessLoading();
        await manageAccess.hoverACL(manageAccessUpdateTargetUser.credentials.username);
        await takeScreenshotByElement(
            await manageAccess.getManageAccessDialog(),
            'TC90988_06_01',
            'Folder manage access dialog default',
            { tolerance: 0.1 }
        );
        await manageAccess.updateACL(manageAccessUpdateTargetUser.credentials.username, 'Denied All');
        await manageAccess.saveManageAccessChange();
        await contentDiscovery.openFromContextMenuForFloder(parentFolder.name, 'Manage Access');
        await manageAccess.waitForManageAccessLoading();
        //check parent folder's ACL updated successfully
        await since(
            `${manageAccessUpdateTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessUpdateTargetUser.credentials.username))
            .toBe('Denied All');
        await manageAccess.cancelManageAccessChange();
        await contentDiscovery.openFolderByPath(['Manage Access Child Folder']);
        //check child folder's ACL not changed
        await contentDiscovery.openFromContextMenuForFloder(childFolder.name, 'Manage Access');
        await manageAccess.waitForManageAccessLoading();
        await since(
            `${manageAccessUpdateTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessUpdateTargetUser.credentials.username))
            .toBe('Custom');
        await manageAccess.cancelManageAccessChange();
        //check child object's ACL not changed
        await listView.openInfoWindowFromListView(childDossier.name);
        await listView.clickMoreMenuFromIW();
        await listView.clickManageAccessFromIW();
        await since(
            `${manageAccessUpdateTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessUpdateTargetUser.credentials.username))
            .toBe('Custom');
        await manageAccess.cancelManageAccessChange();
    });

    /**
     * 1. normal folder
     * 2. from context menu in content discovery view
     * 3. remove ACL
     * 4. select apply to all objects under this folder
     */
    it('[TC90988_07] Validate remove ACL for folder, select apply to all objects under this folder', async () => {
        //open folder's manage access dialog from content discovery view
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(objectFolder.project.name);
        await contentDiscovery.openFolderByPath([
            'Shared Reports',
            '_REGRESSION TEST_',
            'Library - Manage Access',
            'Automation',
            'Manage Access',
            'Manage Access Folder',
        ]);
        await contentDiscovery.openFromContextMenuForFloder(parentFolder.name, 'Manage Access');
        since(`${manageAccessRemoveTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL(manageAccessRemoveTargetUser.credentials.username))
            .toBe('Can View');
        await manageAccess.removeACL(manageAccessRemoveTargetUser.credentials.username);
        await manageAccess.selectApplyToAll();
        await manageAccess.saveManageAccessChange();
        await contentDiscovery.openFromContextMenuForFloder(parentFolder.name, 'Manage Access');
        //check parent folder's ACL removed successfully
        since(`${manageAccessRemoveTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL(manageAccessRemoveTargetUser.credentials.username))
            .toBe('None');
        await manageAccess.cancelManageAccessChange();
        //check child folder's ACL not changed
        await contentDiscovery.openFolderByPath(['Manage Access Child Folder']);
        await contentDiscovery.openFromContextMenuForFloder(childFolder.name, 'Manage Access');
        since(`${manageAccessRemoveTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL(manageAccessRemoveTargetUser.credentials.username))
            .toBe('Can View');
        await manageAccess.cancelManageAccessChange();
        //check child object's ACL not changed
        await listView.openInfoWindowFromListView(childDossier.name);
        await listView.clickMoreMenuFromIW();
        await listView.clickManageAccessFromIW();
        since(`${manageAccessRemoveTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL(manageAccessRemoveTargetUser.credentials.username))
            .toBe('Can View');
        await manageAccess.cancelManageAccessChange();
    });

    /**
     * 1. normal folder
     * 2. from context menu in content discovery view
     * 3. add ACL for user group
     * 4. select apply to all objects under this folder
     */
    it('[TC90988_08] Validate add ACL for folder, select overwrite for all objects under this folder', async () => {
        //open folder's manage access dialog from content discovery view
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(objectFolder.project.name);
        await contentDiscovery.openFolderByPath([
            'Shared Reports',
            '_REGRESSION TEST_',
            'Library - Manage Access',
            'Automation',
            'Manage Access',
            'Manage Access Folder',
        ]);
        await contentDiscovery.openFromContextMenuForFloder(parentFolder.name, 'Manage Access');
        await since(
            `${manageAccessTargetUserGroup.credentials.username} ACL should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessTargetUserGroup.credentials.username))
            .toBe('None');
        await manageAccess.addACL([], [manageAccessTargetUserGroup.credentials.username], 'Full Control');
        await manageAccess.selectOverwriteForAll();
        await manageAccess.saveManageAccessChange();
        await contentDiscovery.openFromContextMenuForFloder(parentFolder.name, 'Manage Access');
        //check parent folder's ACL updated successfully
        await since(
            `${manageAccessTargetUserGroup.credentials.username} ACL should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessTargetUserGroup.credentials.username))
            .toBe('Full Control');
        await manageAccess.cancelManageAccessChange();
        //check child folder's ACL updated successfully
        await contentDiscovery.openFolderByPath(['Manage Access Child Folder']);
        await contentDiscovery.openFromContextMenuForFloder(childFolder.name, 'Manage Access');
        await since(
            `${manageAccessTargetUserGroup.credentials.username} ACL should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessTargetUserGroup.credentials.username))
            .toBe('Full Control');
        await manageAccess.cancelManageAccessChange();
        //check child object's ACL updated successfully
        await listView.openInfoWindowFromListView(childDossier.name);
        await listView.clickMoreMenuFromIW();
        await listView.clickManageAccessFromIW();
        await since(
            `${manageAccessTargetUserGroup.credentials.username} ACL should be #{expected}, while we get #{actual}`
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessTargetUserGroup.credentials.username))
            .toBe('Full Control');
        await manageAccess.cancelManageAccessChange();
    });

    /**
     * 1. shortcut folder
     * 2. from context-menu in content discovery view
     * 3. add ACL: deny all
     */
    it('[TC90988_09] Validate add ACL for shortcut folder', async () => {
        //set shorcut folder init ACL to Can Modify
        await setObjectAcl({
            credentials: manageAccessUser.credentials,
            object: parentFolder,
            acl: [
                {
                    value: 'Can Modify',
                    id: 'B916CACD47341989566C3EB92AF1273A',
                    name: 'tester_auto_ma_update_target',
                },
            ],
        });

        //open folder's manage access dialog from content discovery view
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(objectFolder.project.name);
        await contentDiscovery.openFolderByPath([
            'Shared Reports',
            '_REGRESSION TEST_',
            'Library - Manage Access',
            'Automation',
            'Manage Access',
            'Manage Access Shortcut Folder',
        ]);
        await contentDiscovery.openFromContextMenuForFloder(shortcutFolder.name, 'Manage Access');
        await manageAccess.waitForManageAccessLoading();
        //shortcut folder display the ACL list of target folder
        since(`${manageAccessUpdateTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL(manageAccessUpdateTargetUser.credentials.username))
            .toBe('Can Modify');
        since(`${manageAccessAddTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL(manageAccessAddTargetUser.credentials.username))
            .toBe('None');
        await manageAccess.addACL([manageAccessAddTargetUser.credentials.username], [], 'Denied All');
        await manageAccess.saveManageAccessChange();
        // check shortcut folder ACL changed
        await contentDiscovery.openFromContextMenuForFloder(shortcutFolder.name, 'Manage Access');
        await manageAccess.waitForManageAccessLoading();
        since(`${manageAccessAddTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL(manageAccessAddTargetUser.credentials.username))
            .toBe('Denied All');
        await manageAccess.cancelManageAccessChange();
        // check target folder ACL changed
        await contentDiscovery.openFromContextMenuForFloder(parentFolder.name, 'Manage Access');
        await manageAccess.waitForManageAccessLoading();
        since(`${manageAccessAddTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}`)
            .expect(await manageAccess.getUserCurrentACL(manageAccessAddTargetUser.credentials.username))
            .toBe('Denied All');
        await manageAccess.cancelManageAccessChange();
    });

    /**
     * 1. normal folder
     * 2. from folder browsing view
     * 3. add Full Control, update to Can Modify, remove Can View
     * 4. overwrite for all objects under this folder
     */
    it('[TC90989_04] Validate combination of add, update, remove ACL for folder, overwrite for all objects under this folder', async () => {
        //open folder's manage access dialog from content discovery view
        await libraryPage.openSidebarOnly();
        await sidebar.openContentDiscovery();
        await contentDiscovery.openProjectList();
        await contentDiscovery.selectProject(objectFolder.project.name);
        await contentDiscovery.openFolderByPath([
            'Shared Reports',
            '_REGRESSION TEST_',
            'Library - Manage Access',
            'Automation',
            'Manage Access',
            'Manage Access Folder',
        ]);
        await contentDiscovery.openFromContextMenuForFloder(parentFolder.name, 'Manage Access');
        await manageAccess.waitForManageAccessLoading();
        await manageAccess.addACL([manageAccessAddTargetUser.credentials.username], [], 'Can Modify');
        await manageAccess.updateACL(manageAccessUpdateTargetUser.credentials.username, 'Full Control');
        await manageAccess.removeACL(manageAccessRemoveTargetUser.credentials.username);
        await manageAccess.selectOverwriteForAll();
        await manageAccess.saveManageAccessChange();
        //check parent folder ACL updated successfully
        await contentDiscovery.openFromContextMenuForFloder(parentFolder.name, 'Manage Access');
        await manageAccess.waitForManageAccessLoading();
        await since(
            '${manageAccessAddTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}'
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessAddTargetUser.credentials.username))
            .toBe('Can Modify');
        await since(
            '${manageAccessUpdateTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}'
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessUpdateTargetUser.credentials.username))
            .toBe('Full Control');
        await since(
            '${manageAccessRemoveTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}'
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessRemoveTargetUser.credentials.username))
            .toBe('None');
        await manageAccess.cancelManageAccessChange();
        //check child object ACL updated successfully
        await contentDiscovery.openFolderByPath(['Manage Access Folder']);
        await listView.openInfoWindowFromListView(childDossier.name);
        await listView.clickMoreMenuFromIW();
        await listView.clickManageAccessFromIW();
        await manageAccess.waitForManageAccessLoading();
        await since(
            '${manageAccessAddTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}'
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessAddTargetUser.credentials.username))
            .toBe('Can Modify');
        await since(
            '${manageAccessUpdateTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}'
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessUpdateTargetUser.credentials.username))
            .toBe('Full Control');
        await since(
            '${manageAccessRemoveTargetUser.credentials.username} ACL should be #{expected}, while we get #{actual}'
        )
            .expect(await manageAccess.getUserCurrentACL(manageAccessRemoveTargetUser.credentials.username))
            .toBe('None');
        await manageAccess.cancelManageAccessChange();
    });
});
