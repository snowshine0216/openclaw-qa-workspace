/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable protractor/no-get-in-it */
import createContentGroup from '../../../api/contentGroup/createContentGroup.js';
import deleteContentGroupsByIds from '../../../api/contentGroup/deleteContentGroupsByIds.js';
import deleteContentGroupsByNames from '../../../api/contentGroup/deleteContentGroupsByNames.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import users from '../../../testData/users.json' assert { type: 'json' };
import { designer2Credentials } from '../../../constants/index.js';
import shareDossierToUsers from '../../../api/shareDossierToUsers.js';

const specConfiguration = customCredentials('_cgmp');
const tolerance = 0.1;

describe('ContentGroupManipulation', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const admincredentials = {
        username: 'contentgroupadmin',
        password: '',
        webServerUsername: 'admin',
        webServerPassword: 'admin',
    };

    const credentials = specConfiguration.credentials;
    const username = credentials.username;
    const testerUser = users[username].id;

    const contentGroupName = `different view content_${username}`;

    const baseViewDossier = {
        id: 'EA29E1B1424C96260638309A2A3CE297',
        name: 'Auto_CG_with prompt_base view',
        projectPath: '/9D8A49D54E04E0BE62C877ACC18A5A0A',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const lastViewDossier = {
        id: '5508ADB64187F2642866A7A94E7E0737',
        name: 'Auto_CG_with prompt_last view',
        projectPath: '/9D8A49D54E04E0BE62C877ACC18A5A0A',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const promptRSD = {
        id: 'EA7929D048DEBEEC878EF69E22916E0A',
        name: 'Auto_CG_with prompt use default answers',
        projectPath: '/9D8A49D54E04E0BE62C877ACC18A5A0A',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    let id = [];

    let {
        loginPage,
        libraryPage,
        dossierPage,
        promptEditor,
        grid,
        rsdGrid,
        infoWindow,
        sidebar,
        quickSearch,
        fullSearch,
        manageLibrary,
        group,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await deleteContentGroupsByNames({ credentials: admincredentials, namesToFind: [contentGroupName] });
        //re-publish baseViewDossier to user
        await shareDossierToUsers({
            dossier: baseViewDossier,
            credentials: designer2Credentials,
            targetUserIds: [testerUser],
            targetCredentialsList: [credentials],
        });
    });

    afterEach(async () => {
        await libraryPage.refresh();
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: id });
    });

    async function createNewContentGroup(name) {
        // Create Content Group
        const contentGroupInfo = {
            color: 2276796,
            emailEnabled: true,
            name: name,
            recipients: [
                {
                    id: testerUser,
                },
            ],
        };
        const contentInfo = {
            operationList: [
                {
                    id: 1,
                    op: 'add',
                    path: baseViewDossier.projectPath,
                    value: [
                        {
                            id: baseViewDossier.id,
                            type: 55,
                        },
                    ],
                },
                {
                    id: 2,
                    op: 'add',
                    path: lastViewDossier.projectPath,
                    value: [
                        {
                            id: lastViewDossier.id,
                            type: 55,
                        },
                    ],
                },
                {
                    id: 3,
                    op: 'add',
                    path: promptRSD.projectPath,
                    value: [
                        {
                            id: promptRSD.id,
                            type: 55,
                        },
                    ],
                },
            ],
        };
        return createContentGroup({ credentials: admincredentials, contentGroupInfo, contentInfo });
    }

    it('[TC81434] Validate Content in Content Group with different view', async () => {
        const contentGroupId = await createNewContentGroup(contentGroupName);
        id = [contentGroupId];

        // Check in library
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        since('Create different view content, group should be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName))
            .toBe(true);
        await sidebar.openGroupSection(contentGroupName);
        since(`New group content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(contentGroupName))
            .toBe(3);

        // Open base view dossier added in library before
        await libraryPage.openDossier(baseViewDossier.name);
        since('Open base view dossier added in library before should show prompt window')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        since('The first element of Customer attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer' }))
            .toBe('Aaby');
        await dossierPage.goToLibrary();

        // Open last view dossier added in library before
        await libraryPage.openDossier(lastViewDossier.name);
        since('Open last view dossier added in library before should not show prompt window')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await dossierPage.waitForDossierLoading();
        since('The first element of Customer attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer' }))
            .toBe('Aadland');
        await dossierPage.goToLibrary();

        // Open RSD added with content group
        await libraryPage.openDossier(promptRSD.name);
        since('Open prompt RSD should show prompt window')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        const grid2 = rsdGrid.getRsdGridByKey('K44');
        since('The 3 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid2.selectCellInOneRow(2, 1, 3))
            .toEqual(['Aaby', 'Alen', '55 and over']);
        await dossierPage.goToLibrary();

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });

        // Check in library
        await sidebar.openAllSectionList();
        since('Delete group, group should not be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName))
            .toBe(false);
        since(`All tab content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('All'))
            .toBe(2);

        // Check dossier after delete content group
        // Open base view dossier added in library before
        await libraryPage.openDossier(baseViewDossier.name);
        since('Open base view dossier should show prompt window')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        since('The first element of Customer attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer' }))
            .toBe('Aaby');
        await dossierPage.goToLibrary();

        // Open last view dossier added in library before
        await libraryPage.openDossier(lastViewDossier.name);
        since('Open last view dossier should not show prompt window')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await dossierPage.waitForDossierLoading();
        since('The first element of Customer attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.firstElmOfHeader({ title: 'Visualization 1', headerName: 'Customer' }))
            .toBe('Aadland');
        await dossierPage.goToLibrary();
    });

    it('[TC81435] Validate Content Management in Content Group from info-window(home and search)', async () => {
        const contentGroupId = await createNewContentGroup(contentGroupName);
        id = [contentGroupId];
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        await sidebar.openGroupSection(contentGroupName);

        // Check remove button from info window in default group tab
        await libraryPage.moveDossierIntoViewPort(baseViewDossier.name);
        await libraryPage.openDossierInfoWindow(baseViewDossier.name);
        since('Is Remove button displayed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isRemovePresent())
            .toBe(false);
        await libraryPage.moveDossierIntoViewPort(promptRSD.name);
        await libraryPage.openDossierInfoWindow(promptRSD.name);
        since('Is Remove button displayed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isRemovePresent())
            .toBe(false);
        await infoWindow.close();

        // Check remove button from info window in all tab
        await sidebar.openAllSectionList();
        await libraryPage.moveDossierIntoViewPort(baseViewDossier.name);
        await libraryPage.openDossierInfoWindow(baseViewDossier.name);
        since('Is Remove button displayed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isRemovePresent())
            .toBe(false);
        await libraryPage.moveDossierIntoViewPort(promptRSD.name);
        await libraryPage.openDossierInfoWindow(promptRSD.name);
        since('Is Remove button displayed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isRemovePresent())
            .toBe(false);
        await infoWindow.close();

        // Check remove button from search
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('Auto_CG_with');
        await fullSearch.clickMyLibraryTab();
        await fullSearch.openInfoWindow(baseViewDossier.name);
        since('Is Remove button displayed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isRemovePresent())
            .toBe(false);
        await fullSearch.openInfoWindow(promptRSD.name);
        since('Is Remove button displayed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isRemovePresent())
            .toBe(false);
        await infoWindow.close();
        await fullSearch.backToLibrary();

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });

        // Remove dossier
        await sidebar.openAllSectionList();
        await libraryPage.moveDossierIntoViewPort(baseViewDossier.name);
        await libraryPage.openDossierInfoWindow(baseViewDossier.name);
        since('Is Remove button displayed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isRemovePresent())
            .toBe(true);
        await infoWindow.selectRemove();
        await infoWindow.confirmRemove();
        await sidebar.openAllSectionList();
        since(`The presence of dossier ${baseViewDossier.name} is supposed to be #{expected}, instead we have #{actual}`)
            .expect(await libraryPage.isItemViewable(baseViewDossier.name))
            .toBe(false);

        // Add dossier to library
        const url = await browser.getUrl();
        const dossierUrl = url + '/9D8A49D54E04E0BE62C877ACC18A5A0A/EA29E1B1424C96260638309A2A3CE297';
        await browser.url(dossierUrl);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        since('Add to Library should be shown in header')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(true);
        await dossierPage.clickAddToLibraryButton();
        await dossierPage.goToLibrary();
        await libraryPage.waitForLibraryLoading();
        since(`The presence of dossier ${baseViewDossier.name} is supposed to be #{expected}, instead we have #{actual}`)
            .expect(await libraryPage.isItemViewable(baseViewDossier.name))
            .toBe(true);
    });

    it('[TC81436] Validate Content Management in Content Group from Manage my library', async () => {
        const contentGroupId = await createNewContentGroup(contentGroupName);
        id = [contentGroupId];

        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        await sidebar.openGroupSection(contentGroupName);

        // Check remove/rename from Manage my library in default group tab
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Manage Library');
        since('The enabled status of "Select All" button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await manageLibrary.isSelectAllEnabled())
            .toBe(false);
        await manageLibrary.hoverDossier(baseViewDossier.name);
        since('The warning tooltip of dossier in default group tab is supposed to be #{expected}, instead we have #{actual}')
            .expect(
                await libraryPage.isTooltipDisplayed(
                    'Content cannot be edited because it was added by the administrator.'
                )
            )
            .toBe(true);
        await takeScreenshotByElement(
            libraryPage.getTooltipbyMessage('Content cannot be edited because it was added by the administrator.'),
            'TC81436',
            'Tooltip of dossier',
            { tolerance: tolerance }
        );
        await manageLibrary.hoverDossier(promptRSD.name);
        since('The warning tooltip of RSD in default group tab is supposed to be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isTooltipDisplayed('Content cannot be edited because it was added by the administrator.'))
            .toBe(true);
        await manageLibrary.closeManageMyLibrary();

        // Check remove/rename from Manage my library in all tab
        await sidebar.openAllSectionList();
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Manage Library');
        since('The enabled status of "Select All" button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await manageLibrary.isSelectAllEnabled())
            .toBe(false);
        await manageLibrary.hoverDossier(baseViewDossier.name);
        since('The warning tooltip of dossier in All tab is supposed to be #{expected}, instead we have #{actual}')
            .expect( await libraryPage.isTooltipDisplayed('Content cannot be edited because it was added by the administrator.'))
            .toBe(true);
        await manageLibrary.hoverDossier(promptRSD.name);
        since('The warning tooltip of RSD in All tab is supposed to be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isTooltipDisplayed('Content cannot be edited because it was added by the administrator.'))
            .toBe(true);
        await manageLibrary.closeManageMyLibrary();

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });

        // Check remove/rename from Manage my library in all tab
        await sidebar.openAllSectionList();
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Manage Library');
        since('The enabled status of "Select All" button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await manageLibrary.isSelectAllEnabled())
            .toBe(true);
        await manageLibrary.editName({ option: 'icon', name: baseViewDossier.name, newName: 'rename' });
        await manageLibrary.closeManageMyLibrary();
        await libraryPage.refresh();
        since('The presence of dossier rename is supposed to be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isItemViewable('rename'))
            .toBe(true);

        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Manage Library');
        await manageLibrary.selectItem('rename');
        since('The selection status of dossier renameis supposed to be #{expected}, instead we have #{actual}')
            .expect(await manageLibrary.isItemSelected('rename'))
            .toBe(true);
        since('The enabled status of "Clear All" button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await manageLibrary.isClearAllEnabled())
            .toBe(true);
        since('The enabled status of "Remove" button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await manageLibrary.isRemoveButtonEnabled())
            .toBe(true);
        since('The enabled status of "Select All" button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await manageLibrary.isSelectAllEnabled())
            .toBe(true);
        since('The library page title is supposed to be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.title())
            .toBe('1 item selected');

        await manageLibrary.hitRemoveButton();
        await manageLibrary.confirmRemoval();
        await manageLibrary.closeManageMyLibrary();

        await libraryPage.refresh();
        since('The presence of dossier rename is supposed to be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isItemViewable('rename'))
            .toBe(false);
        since(`The presence of dossier ${baseViewDossier.name} is supposed to be #{expected}, instead we have #{actual}`)
            .expect(await libraryPage.isItemViewable(baseViewDossier.name))
            .toBe(false);

        // Add dossier to library
        const url = await browser.getUrl();
        const dossierUrl = url + '/9D8A49D54E04E0BE62C877ACC18A5A0A/EA29E1B1424C96260638309A2A3CE297';
        await browser.url(dossierUrl);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        since('Add to Library should be shown in header').expect(await dossierPage.isAddToLibraryDisplayed()).toBe(true);
        await dossierPage.clickAddToLibraryButton();
        await dossierPage.goToLibrary();
        await libraryPage.waitForLibraryLoading();
        since(`The presence of dossier ${baseViewDossier.name} is supposed to be #{expected}, instead we have #{actual}`)
            .expect(await libraryPage.isItemViewable(baseViewDossier.name))
            .toBe(true);
    });

    it('[TC81437] Validate Content context menu in Content Group with single select mode in different tab', async () => {
        const contentGroupId = await createNewContentGroup(contentGroupName);
        id = [contentGroupId];

        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        await sidebar.openGroupSection(contentGroupName);

        // To let baseViewDossier in left
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Name');

        // Copy to personal group
        await libraryPage.openDossierContextMenu(baseViewDossier.name);
        await takeScreenshotByElement(libraryPage.getDossierContextMenu(), 'TC81437_01', 'Content_Context Menu', {
            tolerance: tolerance,
        });
        since('Copy to Group should display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Copy to Group').isDisplayed())
            .toBe(true);
        since('Move to Group should not display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Move to Group').isDisplayed())
            .toBe(false);
        await libraryPage.clickDossierContextMenuItem('Copy to Group', 'Group1');
        await libraryPage.openDossierContextMenu(baseViewDossier.name);
        since('Remove from Group should display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem(`Remove from "Group1"`).isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'TC81437_02',
            'Content_ContextMenu_after Copy to'
        );

        // Check in personal group
        await sidebar.openGroupSection('Group1');
        since(`Group1 content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('Group1'))
            .toBe(1);
        await libraryPage.openDossierContextMenu(baseViewDossier.name);
        since('Copy to Group should not display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Copy to Group').isDisplayed())
            .toBe(false);
        since('Move to Group should display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Move to Group').isDisplayed())
            .toBe(true);
        since('Remove from Group should display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem(`Remove from "Group1"`).isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'TC81437_03',
            'Content_Context Menu_Personal group',
            { tolerance: tolerance }
        );

        // Check in all tab
        await sidebar.openAllSectionList();
        await libraryPage.openDossierContextMenu(baseViewDossier.name);
        since('Copy to Group should not display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Copy to Group').isDisplayed())
            .toBe(false);
        since(' Move to Group should display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Move to Group').isDisplayed())
            .toBe(true);
        since('Remove from Group should display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem(`Remove from "Group1"`).isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'TC81437_04',
            'Content_Context Menu_All tab',
            { tolerance: tolerance }
        );

        // Add to another personal group
        await libraryPage.clickDossierContextMenuItem('Move to Group', 'Group2');
        await libraryPage.openDossierContextMenu(baseViewDossier.name);
        await since('Remove from Group should display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem(`Remove from "Group2"`).isDisplayed())
            .toBe(true);
        await sidebar.openGroupSection('Group2');
        since(
            `The presence of dossier ${baseViewDossier.name} is supposed to be #{expected}, instead we have #{actual}`
        )
            .expect(await libraryPage.isItemViewable(baseViewDossier.name))
            .toBe(true);

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });

        // Remove from personal group
        await sidebar.openAllSectionList();
        await sidebar.openGroupSection('Group2');
        await libraryPage.openDossierContextMenu(baseViewDossier.name);
        await libraryPage.clickDossierContextMenuItem(`Remove from "Group2"`);
        since(
            `The presence of dossier ${baseViewDossier.name} is supposed to be #{expected}, instead we have #{actual}`
        )
            .expect(await libraryPage.isItemViewable(baseViewDossier.name))
            .toBe(false);

        // Check in all tab
        await sidebar.openAllSectionList();
        await libraryPage.openDossierContextMenu(baseViewDossier.name);
        await since('Remove from Group should not display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem(`Remove from "Group2"`).isDisplayed())
            .toBe(false);
        await since('Copy to Group should not display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Copy to Group').isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'TC81437_05',
            'Content_Context Menu_without remove',
            { tolerance: tolerance }
        );
    });

    it('[TC81438] Validate Content context menu in Content Group with multi select mode in different tab', async () => {
        const contentGroupId = await createNewContentGroup(contentGroupName);
        id = [contentGroupId];

        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        await sidebar.openGroupSection(contentGroupName);
        // To let promptRSD in left
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Name');

        // Copy to personal group with multi select mode in default group tab
        await libraryPage.clickMultiSelectBtn();
        since(
            'Move to group from group bar in multi selection mode, with no dossier selected, the bar action button should NOT be present'
        )
            .expect(await group.isGroupBarActionBtnPresent())
            .toBe(false);
        await libraryPage.selectDossier(baseViewDossier.name);
        await libraryPage.selectDossier(promptRSD.name);
        await libraryPage.openDossierContextMenu(promptRSD.name);
        since('Copy to Group should display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Copy to Group').isDisplayed())
            .toBe(true);
        since('Move to Group should not display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Move to Group').isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'TC81438_01',
            'MultiSelection_ContextMenu_DefaultGroup',
            { tolerance: tolerance }
        );
        await libraryPage.clickDossierContextMenuItem('Copy to Group', 'Group1');

        // Check in personal group1
        await sidebar.openGroupSection('Group1');
        since(`Group1 content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('Group1'))
            .toBe(2);

        await libraryPage.clickMultiSelectBtn();
        await libraryPage.selectDossier(baseViewDossier.name);
        await libraryPage.selectDossier(promptRSD.name);
        await libraryPage.openDossierContextMenu(promptRSD.name);
        since('Copy to Group should not display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Copy to Group').isDisplayed())
            .toBe(false);
        since('Move to Group should display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Move to Group').isDisplayed())
            .toBe(true);
        since('Remove from Group should display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem(`Remove from "Group1"`).isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'TC81438_02',
            'MultiSelection_ContextMenu_Group1',
            { tolerance: tolerance }
        );

        // Move to another personal group with multi select mode in all tab
        await sidebar.openAllSectionList();
        await libraryPage.clickMultiSelectBtn();
        await libraryPage.selectDossier(baseViewDossier.name);
        await libraryPage.selectDossier(promptRSD.name);
        await libraryPage.openDossierContextMenu(promptRSD.name);
        since('Copy to Group should display not in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Copy to Group').isDisplayed())
            .toBe(false);
        since('Move to Group should display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Move to Group').isDisplayed())
            .toBe(true);
        since('Remove from Group should not display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem(`Remove from "Group1"`).isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'TC81438_03',
            'MultiSelection_ContextMenu_AllTab',
            { tolerance: tolerance }
        );

        await libraryPage.clickDossierContextMenuItem('Move to Group');

        since(
            'Move to group in multi selection mode, select dossier in Group1, Group1 should not be existed on context menu'
        )
            .expect(await libraryPage.isSecondaryContextMenuItemExisted('Group1'))
            .toBe(false);
        await libraryPage.clickDossierContextMenuItem('Move to Group', 'Group2');

        // Check in personal group1
        await sidebar.openGroupSection('Group1');
        since('Group1 should be empty')
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);

        // Check in personal group2
        await sidebar.openGroupSection('Group2');
        since(`Group2 content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('Group2'))
            .toBe(2);

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });

        // Remove from personal group
        await sidebar.openAllSectionList();
        await sidebar.openGroupSection('Group2');
        since(`Group2 content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('Group2'))
            .toBe(1);
        await libraryPage.openDossierContextMenu(baseViewDossier.name);
        await libraryPage.clickDossierContextMenuItem(`Remove from "Group2"`);

        // Check in all tab
        await sidebar.openAllSectionList();
        await libraryPage.clickMultiSelectBtn();
        await libraryPage.selectDossier(baseViewDossier.name);
        await libraryPage.selectDossier(lastViewDossier.name);
        await libraryPage.openDossierContextMenu(baseViewDossier.name);
        since('Copy to Group should not display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Copy to Group').isDisplayed())
            .toBe(false);
        since('Move to Group should display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Move to Group').isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            libraryPage.getDossierContextMenu(),
            'TC81438_04',
            'MultiSelection_ContextMenu_AllTab_NoDefaultGroup',
            { tolerance: tolerance }
        );
    });
});

export const config = specConfiguration;
