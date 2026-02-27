import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import deleteAllGroups from '../../../api/deleteAllGroups.js';
import createGroups from '../../../api/createGroups.js';

const specConfiguration = { ...customCredentials('_group') };

describe('Group General', () => {
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
    const groupName = 'Automation Test';
    const groupNameUpdated = groupName + '_Edited';
    const color = 'Springgreen';
    const colorUpdated = 'Orchid';
    const groupName2 = 'Automation Test_ContextMenu';
    const color2 = 'Goldenrod';

    let { libraryPage, sidebar, group, dossierPage, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    beforeEach(async () => {
        await deleteAllGroups(specConfiguration.credentials);
        await libraryPage.reload();
    });

    afterEach(async () => {
        await deleteAllGroups(specConfiguration.credentials);
    });

    it('[TC70842] Group - Sidebar - Add group', async () => {
        await libraryPage.openSidebar();
        await takeScreenshotByElement(sidebar.getSidebarContainer(), 'TC70842', 'Sidebar_initial');

        // add group
        await sidebar.clickAddGroupBtn();
        await takeScreenshotByElement(group.getGroupDialog(), 'TC70842', 'Group_initial', { tolerance: 2.0 });
        await group.inputGroupName(groupName);
        await since('Add group, the color Blue should be selected by default')
            .expect(await group.isGroupColorSelected('Blue'))
            .toBe(true);
        await group.selectGroupColor(color);
        await since(`Add group, the color ${color} should be selected`)
            .expect(await group.isGroupColorSelected(color))
            .toBe(true);
        await group.clickGroupSaveBtn();
        await since(`Add group, group ${groupName} should be existed`)
            .expect(await sidebar.isGroupExisted(groupName))
            .toBe(true);
        await since(`Add group, group count should be #{expected}, while we get #{actual}`)
            .expect(await sidebar.getGroupCount())
            .toBe(1);

        // close sidebar
        await sidebar.openAllSectionList();
        await libraryPage.closeSidebar();
    });

    it('[TC72230] Group - Sidebar - Edit group', async () => {
        // create group
        await createGroups({
            groupList: [{ name: groupName, color: color }],
            credentials: specConfiguration.credentials,
        });

        await libraryPage.refresh();
        await libraryPage.openSidebar();
        await takeScreenshotByElement(sidebar.getSidebarContainer(), 'TC72230', 'Sidebar_initial');

        // edit group
        await sidebar.clickGroupOptions(groupName);
        await sidebar.selectGroupEditOption();
        await group.inputGroupName(groupNameUpdated);
        await since(`Edit group,before edit the color ${color} should be selected`)
            .expect(await group.isGroupColorSelected(color))
            .toBe(true);
        await group.selectGroupColor(colorUpdated);
        await since(`Edit group,after edit the color ${colorUpdated} should be selected`)
            .expect(await group.isGroupColorSelected(colorUpdated))
            .toBe(true);
        await group.clickGroupSaveBtn();
        await since(`Edit group, group ${groupNameUpdated} should be existed`)
            .expect(await sidebar.isGroupExisted(groupNameUpdated))
            .toBe(true);
        await since(`Edit group, group count should be #{expected}, while we get #{actual}`)
            .expect(await sidebar.getGroupCount())
            .toBe(1);

        // close sidebar
        await sidebar.openAllSectionList();
        await libraryPage.closeSidebar();
    });

    it('[TC72231] Group - Sidebar - Different group names', async () => {
        // create group
        await createGroups({
            groupList: [{ name: groupNameUpdated, color: color }],
            credentials: specConfiguration.credentials,
        });
        await libraryPage.refresh();

        const specialChars = `test"\[automation]`;
        const dupMsg = 'This name is already being used for another group.';
        const charsMsg = 'The name cannot contain the following characters " \\ [ ].';

        await libraryPage.openSidebar();
        await sidebar.clickAddGroupBtn();

        // duplicate
        await group.inputGroupName(groupNameUpdated);
        await group.sleep(500); // wait for validaiton msg
        await since('Rename group with duplicated name, group dialogue should be still present')
            .expect(await group.isGroupDialoguePresent())
            .toBe(true);
        await since('Rename group with duplicated name, error msg should be #{expected}, while we get #{actual}')
            .expect(await group.getGroupError())
            .toBe(dupMsg);
        await takeScreenshotByElement(group.getGroupDialog(), 'TC72231', 'GroupName_Duplicate');

        // special chars - " / []
        await group.inputGroupName(specialChars);
        await group.sleep(500); // wait for validaiton msg
        await since('Rename group with duplicated name, group dialogue should be still present')
            .expect(await group.isGroupDialoguePresent())
            .toBe(true);
        await since('Rename group with special chars, error msg should be #{expected}, while we get #{actual}')
            .expect(await group.getGroupError())
            .toBe(charsMsg);
        await takeScreenshotByElement(group.getGroupDialog(), 'TC72231', 'GroupName_SpecialChars');

        // cancel group dialogue
        await group.clickGroupCancelBtn();
        await since('Cancel group, group dialogue should NOT be present')
            .expect(await group.isGroupDialoguePresent())
            .toBe(false);

        // close sidebar
        await sidebar.openAllSectionList();
        await libraryPage.closeSidebar();
    });

    it('[TC72232] Group - Sidebar - Delete group', async () => {
        // create group
        await createGroups({
            groupList: [{ name: groupName, color: colorUpdated }],
            credentials: specConfiguration.credentials,
        });
        await libraryPage.refresh();

        await libraryPage.openSidebar();
        await since(`Delete group, before delete, group ${groupName} should be existed`)
            .expect(await sidebar.isGroupExisted(groupName))
            .toBe(true);

        // cancel delete group
        await sidebar.clickGroupOptions(groupName);
        await sidebar.selectGroupDeleteOption();
        await takeScreenshotByElement(sidebar.getDeleteConfirmation(), 'TC72232', 'DeleteGroup');
        await sidebar.cancelDelete();
        await since(`Cancel delete group, after delete, group ${groupName} should be existed`)
            .expect(await sidebar.isGroupExisted(groupName))
            .toBe(true);

        // confirm delete  group
        await sidebar.clickGroupOptions(groupName);
        await sidebar.selectGroupDeleteOption();
        await sidebar.confirmDelete();
        await since(`Delete group, after delete, group ${groupName} should NOT be existed`)
            .expect(await sidebar.isGroupExisted(groupName))
            .toBe(false);
        await since(`Delete group, after delete, group list should be empty`)
            .expect(await sidebar.isGroupEmpty())
            .toBe(true);

        // close sidebar
        await sidebar.openAllSectionList();
        await libraryPage.closeSidebar();
    });

    it('[TC70845] Group - Context Menu - Open dossier', async () => {
        await libraryPage.openDossierContextMenu(dossier1.name);
        await libraryPage.clickDossierContextMenuItem('Open');

        // open dossier
        await since('Open dossier from context menu, dossier should be opened successfully')
            .expect(await dossierPage.isNavigationBarPresent())
            .toBe(true);

        // back to library
        await dossierPage.goToLibrary();
    });

    it('[TC72233] Group - Context Menu - New group', async () => {
        await libraryPage.openDossierContextMenu(dossier1.name);
        await libraryPage.clickDossierContextMenuItem('New Group');

        // new group
        await group.inputGroupName(groupName2);
        await since('New group from context menu, the color Blue should be selected by default')
            .expect(await group.isGroupColorSelected('Blue'))
            .toBe(true);
        await group.selectGroupColor(color2);
        await since(`New group from context menu, the color ${color2} should be selected`)
            .expect(await group.isGroupColorSelected(color2))
            .toBe(true);
        await group.clickGroupSaveBtn();

        // --  check group
        await libraryPage.openSidebar();
        await since(`New group from context menu, group ${groupName2} should be existed`)
            .expect(await sidebar.isGroupExisted(groupName2))
            .toBe(true);
        // -- check group dossier count
        await sidebar.openGroupSection(groupName2);
        await since(
            `New group from context menu, dossier count of this group should be #{expected}, while we get #{actual}`
        )
            .expect(await libraryPage.getGroupCountFromTitle(groupName2))
            .toBe(1);

        // close sidebar
        await sidebar.openAllSectionList();
        await libraryPage.closeSidebar();
    });

    it('[TC72234] Group - Context Menu - Remove from group', async () => {
        // create group
        await createGroups({
            groupList: [{ name: groupName, color: 'blueberry' }],
            credentials: specConfiguration.credentials,
        });
        await libraryPage.refresh();

        await libraryPage.openDossierContextMenu(dossier1.name);
        await libraryPage.clickDossierContextMenuItem('Move to Group', groupName);

        // remove from group
        await libraryPage.openDossierContextMenu(dossier1.name);
        await libraryPage.clickDossierContextMenuItem(`Remove from "${groupName}"`);

        // --  check group
        await libraryPage.openSidebar();
        await since(`Remove from group by context menu, group ${groupName} should be existed`)
            .expect(await sidebar.isGroupExisted(groupName))
            .toBe(true);
        // -- check group dossier count
        await sidebar.openGroupSection(groupName);
        await since(`Remove from group by context menu, group section should be empty`)
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);

        // close sidebar
        await sidebar.openAllSectionList();
        await libraryPage.closeSidebar();
    });

    it('[TC72235] Group - Context Menu - Move to group', async () => {
        // create group
        await createGroups({
            groupList: [{ name: groupName, color: 'blueberry' }],
            credentials: specConfiguration.credentials,
        });
        await libraryPage.refresh();

        await libraryPage.openDossierContextMenu(dossier2.name);
        await libraryPage.clickDossierContextMenuItem('Move to Group', groupName);

        // --  check group
        await libraryPage.openSidebar();
        await since(`Move to group from context menu, group ${groupName} should be existed`)
            .expect(await sidebar.isGroupExisted(groupName))
            .toBe(true);
        // -- check group dossier count
        await sidebar.openGroupSection(groupName);
        await since(
            `Move to group from context menu, dossier count of this group should be #{expected}, while we get #{actual}`
        )
            .expect(await libraryPage.getGroupCountFromTitle(groupName))
            .toBe(1);

        // close sidebar
        await sidebar.openAllSectionList();
        await libraryPage.closeSidebar();
    });
});
export const config = specConfiguration;
