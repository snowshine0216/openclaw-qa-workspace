import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import deleteAllGroups from '../../../api/deleteAllGroups.js';
import setWindowSize from '../../../config/setWindowSize.js';
import createGroups from '../../../api/createGroups.js';

const specConfiguration = { ...customCredentials('_group') };

describe('E2E Group Organization', () => {
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
    const groupName = 'Sanity Automation Test';
    const color = 'Springgreen';
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let { loginPage, libraryPage, sidebar, group } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(specConfiguration.credentials);
    });

    beforeEach(async () => {
        await deleteAllGroups(specConfiguration.credentials);
        await libraryPage.reload();
    });

    afterEach(async () => {
        await deleteAllGroups(specConfiguration.credentials);
    });

    // new group - siebar
    // move single dossier to group - context menu
    // move all dossiers to group - selection bar in multi select mode
    // remove from group - context menu in multi select mode
    // delete group - sidebar

    it('[TC70853_01] Validate End-to-End user journey for group on Library Web _ new group', async () => {
        // open sidebar
        await libraryPage.refresh();
        await libraryPage.openSidebar();
        await takeScreenshotByElement(sidebar.getSidebarContainer(), 'TC70853', 'E2E_Sidebar_initial');

        // new group by sidebar
        await sidebar.clickAddGroupBtn();
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
    });

    it('[TC70853_02] Validate End-to-End user journey for group on Library Web _ move to group', async () => {
        await createGroups({
            groupList: [{ name: groupName, color: color }],
            credentials: specConfiguration.credentials,
        });
        await libraryPage.refresh();

        // move single dossier to group
        await libraryPage.openSidebar();
        await libraryPage.openDossierContextMenu(dossier1.name);
        await libraryPage.clickDossierContextMenuItem('Move to Group', groupName);
        // --  check group
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
    });

    it('[TC70853_03] Validate End-to-End user journey for group on Library Web _ move all to group', async () => {
        await createGroups({
            groupList: [{ name: groupName, color: color }],
            credentials: specConfiguration.credentials,
        });
        await libraryPage.refresh();

        // move all dossier to group (multi-select mode)
        await libraryPage.openSidebar();
        await libraryPage.clickMultiSelectBtn();
        await since(
            'Select all from group bar in multi selection mode, with no dossier selected, the bar action button should NOT be present'
        )
            .expect(await group.isGroupBarActionBtnPresent())
            .toBe(false);
        await takeScreenshotByElement(group.getGroupBar(), 'TC70853', 'E2E_MultiSelection_GroupBar_Initial');
        await group.clickGroupBarSelectAllBtn();
        await since(
            'Select all from group bar in multi selection mode, after select all, the selected dossier count should be #{expected}, while we get #{actual}'
        )
            .expect(await group.getGroupBarSelectionCount())
            .toBe(5);
        await group.clickGroupBarActionBtn();
        await group.selectGroupBarContextMenu('Existing Group', groupName);
        // --  check group dossier count
        await sidebar.openGroupSection(groupName);
        await since(
            `Move to group in multi selection mode, after move, group dossier count should be #{expected}, while we get #{actual}`
        )
            .expect(await libraryPage.getGroupCountFromTitle(groupName))
            .toBe(5);
    });

    it('[TC70853_04] Validate End-to-End user journey for group on Library Web _ remove from group', async () => {
        await createGroups({
            groupList: [{ name: groupName, color: color }],
            credentials: specConfiguration.credentials,
        });
        await libraryPage.refresh();

        // add to group
        await libraryPage.openSidebar();
        await libraryPage.clickMultiSelectBtn();
        await group.clickGroupBarSelectAllBtn();
        await group.clickGroupBarActionBtn();
        await group.selectGroupBarContextMenu('Existing Group', groupName);
        await libraryPage.openSidebar();
        await sidebar.openGroupSection(groupName);

        // remove multi dossiers from group
        await libraryPage.clickMultiSelectBtn();
        await libraryPage.selectDossier(dossier1.name);
        await libraryPage.selectDossier(dossier2.name);
        await libraryPage.selectDossier(dossier3.name);
        await since('Remove from group, the selected dossier count should be #{expected}, while we get #{actual}')
            .expect(await group.getGroupBarSelectionCount())
            .toBe(3);
        await libraryPage.openDossierContextMenu(dossier3.name);
        await libraryPage.clickDossierContextMenuItem('Remove from');
        // --  check group dossier count
        await since(
            `Remove from dossier in multi selection mode, group dossier count should be #{expected}, while we get #{actual}`
        )
            .expect(await libraryPage.getGroupCountFromTitle(groupName))
            .toBe(2);
    });

    it('[TC70853_05] Validate End-to-End user journey for group on Library Web _ delete group', async () => {
        await createGroups({
            groupList: [{ name: groupName, color: color }],
            credentials: specConfiguration.credentials,
        });
        await libraryPage.refresh();

        // delete group
        await libraryPage.openSidebar();
        await sidebar.clickGroupOptions(groupName);
        await sidebar.deleteGroup();
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
});
export const config = specConfiguration;
