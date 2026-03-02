/* eslint-disable @typescript-eslint/no-floating-promises */
import createContentGroup from '../../../api/contentGroup/createContentGroup.js';
import updateContentGroup from '../../../api/contentGroup/updateContentGroup.js';
import deleteContentGroupsByIds from '../../../api/contentGroup/deleteContentGroupsByIds.js';
import deleteAllGroups from '../../../api/deleteAllGroups.js';
import deleteContentGroupsByNames from '../../../api/contentGroup/deleteContentGroupsByNames.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import users from '../../../testData/users.json' assert { type: 'json' };

const specConfiguration = customCredentials('_cgupdate');

describe('ContentGroupStatusSync', () => {
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
    const testerUserGroup = users[username].groupId;

    const contentGroupName1 = `contentgroupwithoutupdate_${username}`;
    const contentGroupName2 = `contentgroupupdated_${username}`;
    const contentGroupName3 = `contentgroupwithuserupdate_${username}`;
    const contentGroupName4 = `contentgroupwithreport_${username}`;

    const tutorialDossier = {
        id: '9BA70FAD4BE0599CCBDFA3A34E947692',
        name: 'Auto_CG',
        project: '/9D8A49D54E04E0BE62C877ACC18A5A0A',
    };

    const tutorialDossierwithPrompt = {
        id: '1239F9D64FDAE4DF908BEBBAA6126C2A',
        name: 'Auto_CG_with prompt not display',
        project: '/9D8A49D54E04E0BE62C877ACC18A5A0A',
    };

    const webViewerDossier = {
        id: 'F1245FAB478BE979DE0C3F961B114BC6',
        name: 'Auto_Web Viewer Test project',
        project: '/D10588594AD78261882D5DB37131DBF2',
    };

    const gridReport = {
        id: '4F40EC9642B21C5279AE2FABFDB073F7',
        name: 'Auto_Grid',
        project: '/9D8A49D54E04E0BE62C877ACC18A5A0A',
    };

    const graphReport = {
        id: 'E914EE604598D740DB63D6888EE39C4C',
        name: 'Auto_ Graph',
        project: '/9D8A49D54E04E0BE62C877ACC18A5A0A',
    };

    let { loginPage, libraryPage, dossierPage, sidebar, manageLibrary, group } = browsers.pageObj1;
    let id = [];

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
        await deleteAllGroups(specConfiguration.credentials);
        await deleteContentGroupsByNames({
            credentials: admincredentials,
            namesToFind: [contentGroupName1, contentGroupName2, contentGroupName3, contentGroupName4],
        });
    });

    afterEach(async () => {
        await libraryPage.refresh();
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: id });
    });

    it('[TC81432] Validate Content Group update in name/color/content', async () => {
        // Create Content Group
        const contentGroupInfo = {
            color: 2276796,
            emailEnabled: true,
            name: contentGroupName1,
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
                    path: tutorialDossier.project,
                    value: [
                        {
                            id: tutorialDossier.id,
                            type: 55,
                        },
                    ],
                },
            ],
        };
        const contentGroupId = await createContentGroup({
            credentials: admincredentials,
            contentGroupInfo,
            contentInfo,
        });
        id = [contentGroupId];
        // Check in library
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        since('Create contentgroupwithoutupdate, group should be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName1))
            .toBe(true);
        await sidebar.openGroupSection(contentGroupName1);
        since(`New contentgroup content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(contentGroupName1))
            .toBe(1);
        since(`The content group color should be #{expected}, instead we have #{actual`)
            .expect(await sidebar.getGroupColor(contentGroupName1))
            .toBe('opacity: 1; background: rgb(34, 189, 188);');

        // Update Content Group name, and add new content
        const updateContentGroupInfo = {
            operationList: [
                {
                    id: 1,
                    op: 'replace',
                    path: '/name',
                    value: contentGroupName2,
                },
            ],
        };
        const contentInfo2 = {
            operationList: [
                {
                    id: 1,
                    op: 'add',
                    path: tutorialDossierwithPrompt.project,
                    value: [
                        {
                            id: tutorialDossierwithPrompt.id,
                            type: 55,
                        },
                    ],
                },
                {
                    id: 2,
                    op: 'add',
                    path: webViewerDossier.project,
                    value: [
                        {
                            id: webViewerDossier.id,
                            type: 55,
                        },
                    ],
                },
            ],
        };
        await updateContentGroup(
            { credentials: admincredentials, contentGroupId, updateContentGroupInfo, contentInfo: contentInfo2 },
            true
        );

        // Check in library
        await sidebar.openAllSectionList();
        since(`All tab content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('All'))
            .toBe(3);
        since('Update content group, new group should be existe')
            .expect(await sidebar.isGroupExisted(contentGroupName2))
            .toBe(true);
        since('Update content group, old group should not be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName1))
            .toBe(false);
        await sidebar.openGroupSection(contentGroupName2);
        since(`Update content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(contentGroupName2))
            .toBe(3);

        // Open dossier
        await libraryPage.openDossier(tutorialDossier.name);

        // Update Content Group color, and delete two content
        const updateContentGroupInfo2 = {
            operationList: [
                {
                    id: 1,
                    op: 'replace',
                    path: '/color',
                    value: 15063710,
                },
            ],
        };
        const contentInfo3 = {
            operationList: [
                {
                    id: 1,
                    op: 'remove',
                    path: webViewerDossier.project,
                    value: [
                        {
                            id: webViewerDossier.id,
                            type: 55,
                        },
                    ],
                },
                {
                    id: 2,
                    op: 'remove',
                    path: tutorialDossier.project,
                    value: [
                        {
                            id: tutorialDossier.id,
                            type: 55,
                        },
                    ],
                },
            ],
        };
        await updateContentGroup(
            {
                credentials: admincredentials,
                contentGroupId,
                updateContentGroupInfo: updateContentGroupInfo2,
                contentInfo: contentInfo3,
            },
            true
        );

        // Check in library
        await dossierPage.goToLibrary();
        await libraryPage.waitForLibraryLoading();
        // Will back to content group
        since(`The updated group color should be #{expected}, instead we have #{actual}`)
            .expect(await sidebar.getGroupColor(contentGroupName2))
            .toBe('opacity: 1; background: rgb(229, 218, 158);');
        since(`Update content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(contentGroupName2))
            .toBe(1);

        // Open dossier
        await libraryPage.openDossier(tutorialDossierwithPrompt.name);

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });

        // Check in library
        await dossierPage.goToLibrary();
        await libraryPage.waitForLibraryLoading();

        // Will back to all tab
        since('Delete updated group, group should not be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName2))
            .toBe(false);
        since(`All tab content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('All'))
            .toBe(1);
    });

    it('[TC81433] Validate Content Group update in user', async () => {
        // Create Content Group
        const contentGroupInfo = {
            color: 2276796,
            emailEnabled: true,
            name: contentGroupName3,
            recipients: [
                {
                    id: testerUser,
                },
                {
                    id: testerUserGroup,
                },
            ],
        };
        const contentInfo = {
            operationList: [
                {
                    id: 1,
                    op: 'add',
                    path: tutorialDossier.project,
                    value: [
                        {
                            id: tutorialDossier.id,
                            type: 55,
                        },
                    ],
                },
            ],
        };
        const contentGroupId = await createContentGroup({
            credentials: admincredentials,
            contentGroupInfo,
            contentInfo,
        });
        id = [contentGroupId];
        // Check in library
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        since('Create contentgroupwithuserupdate, group should be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName3))
            .toBe(true);
        await sidebar.openGroupSection(contentGroupName3);
        since(`New contentgroupwithuserupdate content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(contentGroupName3))
            .toBe(1);
        since(`The contentgroupwithuserupdate group color should be #{expected}, instead we have #{actual`)
            .expect(await sidebar.getGroupColor(contentGroupName3))
            .toBe('opacity: 1; background: rgb(34, 189, 188);');

        // Delete user from recipient
        const updateContentGroupInfo = {
            operationList: [
                {
                    id: 1,
                    op: 'remove',
                    path: '/recipients',
                    value: [
                        {
                            id: testerUser,
                        },
                    ],
                },
            ],
        };
        await updateContentGroup({ credentials: admincredentials, contentGroupId, updateContentGroupInfo });

        // Check in library
        await sidebar.openAllSectionList();
        since('Create contentgroupwithuserupdate, group should be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName3))
            .toBe(true);

        // Delete user group from recipient
        const updateContentGroupInfo2 = {
            operationList: [
                {
                    id: 1,
                    op: 'remove',
                    path: '/recipients',
                    value: [
                        {
                            id: testerUserGroup,
                        },
                    ],
                },
            ],
        };
        await updateContentGroup({
            credentials: admincredentials,
            contentGroupId,
            updateContentGroupInfo: updateContentGroupInfo2,
        });

        // Check in library
        await sidebar.openAllSectionList();
        since('Create contentgroupwithuserupdate, group should be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName3))
            .toBe(false);

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });
    });

    it('[TC88707] Verify report in content group can be viewed/manipulated on recipients library home', async () => {
        // Create Content Group
        const contentGroupInfo = {
            color: 2276796,
            emailEnabled: true,
            name: contentGroupName4,
            recipients: [
                {
                    id: testerUser,
                },
                {
                    id: testerUserGroup,
                },
            ],
        };
        const contentInfo = {
            operationList: [
                {
                    id: 1,
                    op: 'add',
                    path: gridReport.project,
                    value: [
                        {
                            id: gridReport.id,
                            type: 3,
                        },
                    ],
                },
                {
                    id: 2,
                    op: 'add',
                    path: graphReport.project,
                    value: [
                        {
                            id: graphReport.id,
                            type: 3,
                        },
                    ],
                },
            ],
        };
        const contentGroupId = await createContentGroup({
            credentials: admincredentials,
            contentGroupInfo,
            contentInfo,
        });
        id = [contentGroupId];
        // Check in library
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        since('Create contentgroupwithreport, group should be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName4))
            .toBe(true);
        await sidebar.openGroupSection(contentGroupName4);
        since(`New contentgroupwithuserupdate content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(contentGroupName4))
            .toBe(2);
        since(`The contentgroupwithuserupdate group color should be #{expected}, instead we have #{actual`)
            .expect(await sidebar.getGroupColor(contentGroupName4))
            .toBe('opacity: 1; background: rgb(34, 189, 188);');

        // add one dossier and delete one report on content group
        const updateContentGroupInfo2 = {
            operationList: [
                {
                    id: 1,
                    op: 'replace',
                    path: '/color',
                    value: 15063710,
                },
            ],
        };
        const contentInfo2 = {
            operationList: [
                {
                    id: 1,
                    op: 'add',
                    path: webViewerDossier.project,
                    value: [
                        {
                            id: webViewerDossier.id,
                            type: 55,
                        },
                    ],
                },
                {
                    id: 2,
                    op: 'remove',
                    path: graphReport.project,
                    value: [
                        {
                            id: graphReport.id,
                            type: 3,
                        },
                    ],
                },
            ],
        };
        await updateContentGroup(
            {
                credentials: admincredentials,
                contentGroupId,
                updateContentGroupInfo: updateContentGroupInfo2,
                contentInfo: contentInfo2,
            },
            true
        );

        // Check in library
        await sidebar.openAllSectionList();
        since('Create contentgroupwithreport, group should be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName4))
            .toBe(true);
        await sidebar.openGroupSection(contentGroupName4);
        since(`New contentgroupwithuserupdate content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(contentGroupName4))
            .toBe(2);

        // Check remove/rename from Manage my library in default group tab
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Manage Library');
        since('The enabled status of "Select All" button is supposed to be #{expected}, instead we have #{actual}')
            .expect(await manageLibrary.isSelectAllEnabled())
            .toBe(false);
        await manageLibrary.hoverDossier(gridReport.name);
        since('The warning tooltip of dossier in default group tab is supposed to be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.isTooltipDisplayed('Content cannot be edited because it was added by the administrator.'))
            .toBe(true);
        await manageLibrary.closeManageMyLibrary();

        // new group for report in content group
        await libraryPage.openDossierContextMenu(gridReport.name);
        await libraryPage.clickDossierContextMenuItem('New Group');
        await group.inputGroupName('Group1');
        await group.clickGroupSaveBtn();
        await sidebar.openAllSectionList();
        since('New group from context menu, Group1 should be existed')
            .expect(await sidebar.isGroupExisted('Group1'))
            .toBe(true);

        // Remove from Group1
        await sidebar.openGroupSection('Group1');
        since(`Group1 content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('Group1'))
            .toBe(1);
        await libraryPage.openDossierContextMenu(gridReport.name);
        await libraryPage.clickDossierContextMenuItem(`Remove from "Group1"`);
        since('Group1 should be empty')
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });

        // Check in library
        await sidebar.openAllSectionList();
        since('Delete group, group should not be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName4))
            .toBe(false);
    });
});

export const config = specConfiguration;
