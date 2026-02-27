import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import deleteAllGroups from '../../../api/deleteAllGroups.js';
import createGroups from '../../../api/createGroups.js';
import deleteAllFavorites from '../../../api/deleteAllFavorites.js';

const specConfiguration = { ...customCredentials('_group_multiSelect') };

describe('Group Multi-Select', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const dossier1 = {
        id: 'BCD06D184E679BBD0F18D799935D4EE4',
        name: '(AUTO) GlobalSearch_Certified document',
        project: project,
    };
    const dossier2 = {
        id: '9989C9714E97F8E7F2E0D58ACC55FE46',
        name: '(AUTO) GlobalSearch_Test Dossier',
        project: project,
    };
    const dossier3 = {
        id: 'A440D3BF40E0F6F82FA679A260C7B3EE',
        name: '(AUTO) GlobalSearch_Test Document',
        project: project,
    };
    const groupNameDefault = 'Untitled Group';
    const groupName = 'Automation Test_MultiSelect';
    const color = 'Springgreen';
    const groupName2 = 'Automation Test_GroupBar';

    let { libraryPage, sidebar, group, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    beforeEach(async () => {
        await deleteAllGroups(specConfiguration.credentials);
        await deleteAllFavorites(specConfiguration.credentials);
        await libraryPage.reload();
    });

    afterEach(async () => {
        // back to homepage annd close sidebar
        await sidebar.openAllSectionList();
        await libraryPage.closeSidebar();
        await deleteAllGroups(specConfiguration.credentials);
        await libraryPage.reload();
    });

    it('[TC72241] Group - Multi-select mode - Add to group when there is no group', async () => {
        await libraryPage.clickMultiSelectBtn();
        await since(
            'Move to group from group bar in multi selection mode, with no dossier selected, the bar action button should NOT be present'
        )
            .expect(await group.isGroupBarActionBtnPresent())
            .toBe(false);

        // select dossier
        await group.clickGroupBarSelectAllBtn();
        await since(
            'Add to group in multi selection mode when there is no group, the selected dossier count should be #{expected}, while we get #{actual}'
        )
            .expect(await group.getGroupBarSelectionCount())
            .toBe(5);

        // new group
        await group.clickGroupBarActionBtn();
        await since(
            'Add to group in multi selection mode when there is no group, the color Blue should be selected by default'
        )
            .expect(await group.isGroupColorSelected('Blue'))
            .toBe(true);
        await group.clickGroupSaveBtn();

        // -- check group bar
        await since(
            'Add to group in multi selection mode when there is no group, after save, the group bar should NOT be presented'
        )
            .expect(await group.isGroupBarPresent())
            .toBe(false);
        // --  check group
        await libraryPage.openSidebar();
        await since(`Add to group in multi selection mode when there is no group, group ${groupName} should be existed`)
            .expect(await sidebar.isGroupExisted(groupNameDefault))
            .toBe(true);
        // -- check group dossier count
        await sidebar.openGroupSection(groupNameDefault);
        await since(
            `Add to group in multi selection mode when there is no group, dossier count of this group should be #{expected}, while we get #{actual}`
        )
            .expect(await libraryPage.getGroupCountFromTitle(groupNameDefault))
            .toBe(5);
    });

    it('[TC72236] Group - Multi-select mode - New group for multiple dossiers', async () => {
        // multi select
        await libraryPage.clickMultiSelectBtn();
        await libraryPage.selectDossier(dossier1.name);
        await libraryPage.selectDossier(dossier2.name);
        await libraryPage.openDossierContextMenu(dossier1.name);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'TC72236',
            'MultiSelection_NewGroup_ContextMenu'
        );
        await libraryPage.clickDossierContextMenuItem('New Group');

        // new group
        await group.inputGroupName(groupName);
        await since('New group in multi selection mode, the color Blue should be selected by default')
            .expect(await group.isGroupColorSelected('Blue'))
            .toBe(true);
        await group.selectGroupColor(color);
        await since(`New group in multi selection mode, the color ${color} should be selected`)
            .expect(await group.isGroupColorSelected(color))
            .toBe(true);
        await group.clickGroupSaveBtn();

        // --  check group
        await libraryPage.openSidebar();
        await takeScreenshotByElement(sidebar.getSidebarContainer(), 'TC72236', 'MultiSelection_NewGroup_Sidebar');
        await since(`New group in multi selection mode, group ${groupName} should be existed`)
            .expect(await sidebar.isGroupExisted(groupName))
            .toBe(true);
        // -- check group dossier count
        await sidebar.openGroupSection(groupName);
        await since(
            `New group in multi selection mode, dossier count of this group should be #{expected}, while we get #{actual}`
        )
            .expect(await libraryPage.getGroupCountFromTitle(groupName))
            .toBe(2);
    });

    it('[TC72238] Group - Multi-select mode - Move to group for multiple dossiers', async () => {
        await createGroups({
            groupList: [{ name: groupName, color: color }],
            credentials: specConfiguration.credentials,
        });
        await libraryPage.refresh();

        await libraryPage.clickMultiSelectBtn();

        // Select group dossiers
        await libraryPage.selectDossier(dossier1.name);
        await libraryPage.selectDossier(dossier2.name);
        await libraryPage.selectDossier(dossier3.name);
        await libraryPage.openDossierContextMenu(dossier1.name);
        await libraryPage.clickDossierContextMenuItem('Move to Group');
        await since(
            'Move to group in multi selection mode, select dossier not in any group, target group should be existed on context menu'
        )
            .expect(await libraryPage.isSecondaryContextMenuItemExisted(groupName))
            .toBe(true);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'TC72238',
            'MultiSelection_RemoveFromGroup_GroupList'
        );

        // move to group
        await libraryPage.clickDossierSecondaryMenuItem(groupName);
        await libraryPage.openSidebar();
        await sidebar.openGroupSection(groupName);
        // --  check group dossier count
        await since(
            `Move to group in multi selection mode, after move, group dossier count should be #{expected}, while we get #{actual}`
        )
            .expect(await libraryPage.getGroupCountFromTitle(groupName))
            .toBe(3);
    });

    it('[TC72237] Group - Multi-select mode - Remove from group for multiple dossiers', async () => {
        await createGroups({
            groupList: [{ name: groupName, color: color }],
            credentials: specConfiguration.credentials,
        });
        await libraryPage.refresh();

        await libraryPage.clickMultiSelectBtn();
        await libraryPage.selectDossier(dossier1.name);
        await libraryPage.selectDossier(dossier3.name);
        await libraryPage.openDossierContextMenu(dossier1.name);
        await libraryPage.clickDossierContextMenuItem('Move to Group', groupName);

        // ALL list
        await libraryPage.clickMultiSelectBtn();
        await libraryPage.selectDossier(dossier1.name);
        await libraryPage.selectDossier(dossier2.name);
        await libraryPage.openDossierContextMenu(dossier2.name);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'TC72237',
            'MultiSelection_RemoveFromGroup_AllList'
        );
        await since(
            'Remove from group in multi selection mode, on All list, Remove from should NOT be existed on context menu'
        )
            .expect(await libraryPage.isDossierContextMenuItemExisted(groupName))
            .toBe(false);

        // Group list
        await libraryPage.openSidebar();
        await sidebar.openGroupSection(groupName);
        await libraryPage.clickMultiSelectBtn();
        await group.clickGroupBarSelectAllBtn();
        await libraryPage.openDossierContextMenu(dossier1.name);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'TC72237',
            'MultiSelection_RemoveFromGroup_GroupList'
        );
        await since(
            'Remove from group in multi selection mode, on group list, Remove from should be existed on context menu'
        )
            .expect(await libraryPage.isDossierContextMenuItemExisted(groupName))
            .toBe(true);
        await libraryPage.clickDossierContextMenuItem(`Remove from `);

        // --  check group dossier count
        await since(`Remove from group in multi selection mode, after remove, group should be empty`)
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);
        await takeScreenshotByElement(
            libraryPage.getEmptyLibrary(),
            'TC72237',
            'MultiSelection_RemoveFromGroup_EmptyGroupList'
        );
    });

    it('[TC72239] Group - Multi-select mode - Select all and New group from multi selection bar', async () => {
        // select all
        await libraryPage.clickMultiSelectBtn();
        await since(
            'Select all from group bar in multi selection mode, with no dossier selected, the bar action button should NOT be present'
        )
            .expect(await group.isGroupBarActionBtnPresent())
            .toBe(false);
        await takeScreenshotByElement(group.getGroupBar(), 'TC72239', 'MultiSelection_GroupBar_Initial');
        await group.clickGroupBarSelectAllBtn();
        await since(
            'Select all from group bar in multi selection mode, after select all, the selected dossier count should be #{expected}, while we get #{actual}'
        )
            .expect(await group.getGroupBarSelectionCount())
            .toBe(5);

        // new group
        await group.clickGroupBarActionBtn();
        await since('New group from group bar in multi selection mode, the color Blue should be selected by default')
            .expect(await group.isGroupColorSelected('Blue'))
            .toBe(true);
        await group.inputGroupName(groupName2);
        await group.clickGroupSaveBtn();

        // -- check group bar
        await since(
            'New group from group bar in multi selection mode, after save, the group bar should NOT be presented'
        )
            .expect(await group.isGroupBarPresent())
            .toBe(false);
        // --  check group
        await libraryPage.openSidebar();
        await since(`New group from group bar in multi selection mode, group ${groupName} should be existed`)
            .expect(await sidebar.isGroupExisted(groupName2))
            .toBe(true);
        // -- check group dossier count
        await sidebar.openGroupSection(groupName2);
        await since(
            `New group from group bar in multi selection mode, dossier count of this group should be #{expected}, while we get #{actual}`
        )
            .expect(await libraryPage.getGroupCountFromTitle(groupName2))
            .toBe(5);
    });

    it('[TC72240] Group - Multi-select mode - Move to group from multi selection bar', async () => {
        await createGroups({
            groupList: [{ name: groupName, color: color }],
            credentials: specConfiguration.credentials,
        });
        await libraryPage.refresh();

        await libraryPage.clickMultiSelectBtn();
        await since(
            'Move to group from group bar in multi selection mode, with no dossier selected, the bar action button should NOT be present'
        )
            .expect(await group.isGroupBarActionBtnPresent())
            .toBe(false);

        // select dossier
        await libraryPage.selectDossier(dossier1.name);
        await libraryPage.selectDossier(dossier2.name);
        await since(
            'Move to group from group bar in multi selection mode, the selected dossier count should be #{expected}, while we get #{actual}'
        )
            .expect(await group.getGroupBarSelectionCount())
            .toBe(2);

        // move to group
        await group.clickGroupBarActionBtn();
        await group.selectGroupBarContextMenu('Existing Group', groupName);

        // -- check group bar
        await since(
            'Move to group from group bar in multi selection mode, after move, the group bar should NOT be presented'
        )
            .expect(await group.isGroupBarPresent())
            .toBe(false);
        // --  check group
        await libraryPage.openSidebar();
        await since(`Move to group from group bar in multi selection mode, group ${groupName} should be existed`)
            .expect(await sidebar.isGroupExisted(groupName))
            .toBe(true);
        // -- check group dossier count
        await sidebar.openGroupSection(groupName);
        await since(
            `Move to group from group bar in multi selection mode, dossier count of this group should be #{expected}, while we get #{actual}`
        )
            .expect(await libraryPage.getGroupCountFromTitle(groupName))
            .toBe(2);
    });

    it('[TC72242] Group - Multi-select mode - Multi-select state when switch sidebar section', async () => {
        await createGroups({
            groupList: [{ name: groupName, color: color }],
            credentials: specConfiguration.credentials,
        });
        await libraryPage.refresh();

        // switch to group
        await libraryPage.clickMultiSelectBtn();
        await libraryPage.openSidebarOnly();
        await since('Open sidebar, the multi select button should still be active')
            .expect(await libraryPage.isMultiSelectBtnActive())
            .toBe(true);
        await sidebar.openGroupSection(groupName);
        await since('Switch to Group section, the group bar should NOT be present')
            .expect(await group.isGroupBarPresent())
            .toBe(false);
        await since('Switch to Group section, the multi select button should NOT be active')
            .expect(await libraryPage.isMultiSelectBtnActive())
            .toBe(false);

        // Back to homepage
        await libraryPage.clickMultiSelectBtn();
        await since('Open mutli select mode on Group section, the multi select button should be active')
            .expect(await libraryPage.isMultiSelectBtnActive())
            .toBe(true);
        await sidebar.openAllSectionList();
        await since('Switch to Home section, the group bar should NOT be present')
            .expect(await group.isGroupBarPresent())
            .toBe(false);
        await since('Switch to Home section, the multi select button should NOT be active')
            .expect(await libraryPage.isMultiSelectBtnActive())
            .toBe(false);
    });

    it('[TC84375] Group - Multi-select mode - Dossier belonged group will not appear in move to group list', async () => {
        await createGroups({
            groupList: [{ name: groupName, color: color }],
            credentials: specConfiguration.credentials,
        });
        await createGroups({
            groupList: [{ name: groupNameDefault, color: color }],
            credentials: specConfiguration.credentials,
        });
        await libraryPage.refresh();

        // Select dossiers to move to group
        await libraryPage.clickMultiSelectBtn();
        await libraryPage.selectDossier(dossier1.name);
        await libraryPage.selectDossier(dossier2.name);
        await libraryPage.openDossierContextMenu(dossier2.name);
        await libraryPage.clickDossierContextMenuItem('Move to Group', groupName);

        // Select some non-group dossier
        await libraryPage.clickMultiSelectBtn();
        await libraryPage.selectDossier(dossier1.name);
        await libraryPage.selectDossier(dossier2.name);
        await libraryPage.openDossierContextMenu(dossier2.name);
        await libraryPage.clickDossierContextMenuItem('Move to Group');
        await since(
            'Move to group in multi selection mode, select group dossiers, target group should NOT be existed on context menu'
        )
            .expect(await libraryPage.isSecondaryContextMenuItemExisted(groupName))
            .toBe(false);
        await libraryPage.openSidebar();
    });
});
export const config = specConfiguration;
