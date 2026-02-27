import createContentGroup from '../../../api/contentGroup/createContentGroup.js';
import deleteContentGroupsByIds from '../../../api/contentGroup/deleteContentGroupsByIds.js';
import deleteContentGroupsByNames from '../../../api/contentGroup/deleteContentGroupsByNames.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import users from '../../../testData/users.json' assert { type: 'json' };

const specConfiguration = customCredentials('_cg');
const specConfiguration2 = customCredentials('_cg2');

describe('ContentGroupBasicInfo', () => {
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
    const credentials2 = specConfiguration2.credentials;
    const username = credentials.username;
    const username2 = credentials2.username;
    const testerUser = users[username].id;
    const testerUser2 = users[username2].id;
    const testerUserGroup = users[username].groupId;
    const contentGroupName1 = `tester_auto_emptygroup_${username}`;
    const contentGroupName2 = `samecontentgroup1_${username}`;
    const contentGroupName3 = `samecontentgroup2_${username}`;
    const contentGroupName4 = `groupwithrenamedcontent_${username}`;
    const contentGroupName5 = `groupwithusergroup_${username}`;
    const contentGroupName6 = `contentfrom2project_${username}`;
    const contentGroupName7 = `\`~@#$%^&*()_+{}|;:\'<>?,./①I_${username}`;
    const contentGroupName8 = `<span style=\'color:red\'>olive oil</span>_${username}`;
    const contentGroupName9 = `<script type=\'text/javascript\'>console.log(\'888\')</script>_${username}`;
    const contentGroupName10 = `contentwith2user_${username}`;

    const tutorialDossier = {
        id: '9BA70FAD4BE0599CCBDFA3A34E947692',
        name: 'Auto_CG',
        project: '/9D8A49D54E04E0BE62C877ACC18A5A0A',
    };

    const renameDossier = {
        id: 'AA19BD4D4809D254A574D8B10BAD0A68',
        name: 'Auto_CG_Rename',
        project: '/9D8A49D54E04E0BE62C877ACC18A5A0A',
    };

    const tutorialRSD = {
        id: '3BCC784047E8C5CC7A9E0FA03B7DA184',
        name: 'Auto_CG_RSD',
        project: '/9D8A49D54E04E0BE62C877ACC18A5A0A',
    };

    const webViewerDossier = {
        id: 'F1245FAB478BE979DE0C3F961B114BC6',
        name: 'Auto_Web Viewer Test project',
        project: '/D10588594AD78261882D5DB37131DBF2',
    };

    const webViewerRSD = {
        id: 'BDD01F0940872CFCAD6E358D4EF85832',
        name: 'Auto_Web Viewer Test project_RSD',
        project: '/D10588594AD78261882D5DB37131DBF2',
    };

    let id = [];

    let { libraryPage, manageLibrary, sidebar, userAccount, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
        await deleteContentGroupsByNames({
            credentials: admincredentials,
            namesToFind: [
                contentGroupName1,
                contentGroupName2,
                contentGroupName3,
                contentGroupName4,
                contentGroupName5,
                contentGroupName6,
                contentGroupName7,
                contentGroupName8,
                contentGroupName9,
                contentGroupName10,
            ],
        });
    });

    afterEach(async () => {
        await libraryPage.refresh();
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: id });
    });

    it('[TC81426] Validate Content Group with empty content', async () => {
        // Create Empty Content Group
        const contentGroupInfo = {
            color: 16505561,
            emailEnabled: true,
            name: contentGroupName1,
            opacity: 100,
            recipients: [
                {
                    id: testerUser,
                },
            ],
        };
        const contentGroupId = await createContentGroup({ credentials: admincredentials, contentGroupInfo }, false);
        id = [contentGroupId];

        // Check in library
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        since('Create emptygroup, group should be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName1))
            .toBe(true);
        await sidebar.openGroupSection(contentGroupName1);
        since('Group section for update group should be empty')
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);
        since(`Message for empty group should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getEmptyLibraryMessage())
            .toBe('This content group is empty or you do not have View access to the content in it.');

        // Check group color
        since('The group color should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.getGroupColor(contentGroupName1))
            .toBe('opacity: 1; background: rgb(251, 218, 217);');

        await sidebar.openAllSectionList();
        since(`All tab content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('All'))
            .toBe(1);

        // Delete Empty Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });
        await sidebar.openAllSectionList();
        since('Delete emptygroup, group should not be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName1))
            .toBe(false);
        since(`All tab content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('All'))
            .toBe(1);
    });

    it('[TC81427] Validate Content Group with same content in different Groups', async () => {
        // Create Content Group with same content
        const contentGroupInfo1 = {
            color: 9035721,
            emailEnabled: true,
            name: contentGroupName2,
            opacity: 100,
            recipients: [
                {
                    id: testerUser,
                },
            ],
        };
        const contentInfo1 = {
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
                {
                    id: 2,
                    op: 'add',
                    path: tutorialRSD.project,
                    value: [
                        {
                            id: tutorialRSD.id,
                            type: 55,
                        },
                    ],
                },
            ],
        };
        const contentGroupId1 = await createContentGroup({
            credentials: admincredentials,
            contentGroupInfo: contentGroupInfo1,
            contentInfo: contentInfo1,
        });
        id = [contentGroupId1];

        const contentGroupInfo2 = {
            color: 9035721,
            emailEnabled: true,
            name: contentGroupName3,
            opacity: 100,
            recipients: [
                {
                    id: testerUser,
                },
            ],
        };
        const contentInfo2 = {
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
                {
                    id: 2,
                    op: 'add',
                    path: tutorialRSD.project,
                    value: [
                        {
                            id: tutorialRSD.id,
                            type: 55,
                        },
                    ],
                },
            ],
        };
        const contentGroupId2 = await createContentGroup({
            credentials: admincredentials,
            contentGroupInfo: contentGroupInfo2,
            contentInfo: contentInfo2,
        });
        id.push(contentGroupId2);

        // Check in library
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        since('Create samecontentgroup1, group should be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName2))
            .toBe(true);
        since('Create samecontentgroup2, group should be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName3))
            .toBe(true);
        await takeScreenshotByElement(sidebar.getSidebarContainer(), 'TC81427_01', 'create samecontentgroup');

        await sidebar.openGroupSection(contentGroupName2);
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Date Viewed');
        since(`New samecontentgroup1 content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(contentGroupName2))
            .toBe(2);
        since(`The presence of dossier ${tutorialDossier.name} is supposed to be #{expected}, instead we have #{actual}`)
            .expect(await libraryPage.isItemViewable(tutorialDossier.name))
            .toBe(true);
        since(`The presence of dossier ${tutorialRSD.name} is supposed to be #{expected}, instead we have #{actual}`)
            .expect(await libraryPage.isItemViewable(tutorialRSD.name))
            .toBe(true);
        await takeScreenshotByElement(
            libraryPage.getDossierListContainerHeight(),
            'TC81427_02',
            'samecontentgroup1 content',
            { tolerance: 0.2 }
        );

        await sidebar.openGroupSection(contentGroupName3);
        since(`New samecontentgroup2 content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(contentGroupName3))
            .toBe(2);
        since(`The presence of dossier ${tutorialDossier.name} is supposed to be #{expected}, instead we have #{actual}`)
            .expect(await libraryPage.isItemViewable(tutorialDossier.name))
            .toBe(true);
        since(`The presence of dossier ${tutorialRSD.name} is supposed to be #{expected}, instead we have #{actual}`)
            .expect(await libraryPage.isItemViewable(tutorialRSD.name))
            .toBe(true);
        await takeScreenshotByElement(
            libraryPage.getDossierListContainerHeight(),
            'TC81427_03',
            'samecontentgroup2 content',
            { tolerance: 0.2 }
        );

        // Check in all tab
        await sidebar.openAllSectionList();
        since(`All tab content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('All'))
            .toBe(3);

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId1] });
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId2] });

        // Check in library
        await sidebar.openAllSectionList();
        since('Delete samecontentgroup1 group, group should not be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName2))
            .toBe(false);
        since('Delete samecontentgroup2 group, group should not be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName3))
            .toBe(false);
        since(`All tab content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('All'))
            .toBe(1);
    });

    it('[TC81428] Validate Content Group with content rename in user library before', async () => {
        // Rename dossier in library
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Manage Library');
        await manageLibrary.editName({ option: 'icon', name: renameDossier.name, newName: 'Dossier renamed' });
        since(`The presence of dossier ${renameDossier.name} is supposed to be #{expected}, instead we have #{actual}`)
            .expect(await libraryPage.isItemViewable('Dossier renamed'))
            .toBe(true);
        await manageLibrary.closeManageMyLibrary();

        // Create Content Group with content rename in user library before
        const contentGroupInfo = {
            color: 16711680,
            emailEnabled: true,
            name: contentGroupName4,
            opacity: 100,
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
                    path: renameDossier.project,
                    value: [
                        {
                            id: renameDossier.id,
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
        since('Create groupwithrenamedcontent, group should be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName4))
            .toBe(true);
        await sidebar.openGroupSection(contentGroupName4);
        since(`New groupwithrenamedcontent content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(contentGroupName4))
            .toBe(1);

        // Check content name
        since(`The presence of dossier ${renameDossier.name} is supposed to be #{expected}, instead we have #{actual}`)
            .expect(await libraryPage.isItemViewable(renameDossier.name))
            .toBe(true);

        // Check group color
        since('The group color should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.getGroupColor(contentGroupName4))
            .toBe('opacity: 1; background: rgb(255, 0, 0);');

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });
        await sidebar.openAllSectionList();
        since('Delete groupwithrenamedcontent, group should not be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName4))
            .toBe(false);

        // Check the content name and count in library
        since(`The presence of dossier ${renameDossier.name} is supposed to be #{expected}, instead we have #{actual}`)
            .expect(await libraryPage.isItemViewable(renameDossier.name))
            .toBe(true);
        since(`All tab content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('All'))
            .toBe(1);
    });

    it('[TC81429] Validate Content Group with added by user group', async () => {
        // Create Content Group
        const contentGroupInfo = {
            color: 65280,
            emailEnabled: true,
            name: contentGroupName5,
            opacity: 100,
            recipients: [
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
                    path: webViewerRSD.project,
                    value: [
                        {
                            id: webViewerRSD.id,
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
        since('Create groupwithusergroup, group should be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName5))
            .toBe(true);
        await sidebar.openGroupSection(contentGroupName5);
        since(`New groupwithusergroup content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(contentGroupName5))
            .toBe(1);
        since(`The presence of dossier ${webViewerRSD.name} is supposed to be #{expected}, instead we have #{actual}`)
            .expect(await libraryPage.isItemViewable(webViewerRSD.name))
            .toBe(true);

        // Check group color
        since('The group color should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.getGroupColor(contentGroupName5))
            .toBe('opacity: 1; background: rgb(0, 255, 0);');

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });
        await sidebar.openAllSectionList();
        since('Delete groupwithusergroup, group should not be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName5))
            .toBe(false);
    });

    it('[TC81590] Validate Content Group with content from different project', async () => {
        // Create Content Group
        const contentGroupInfo = {
            color: 255,
            emailEnabled: true,
            name: contentGroupName6,
            opacity: 100,
            recipients: [
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
                    path: tutorialRSD.project,
                    value: [
                        {
                            id: tutorialRSD.id,
                            type: 55,
                        },
                    ],
                },
                {
                    id: 2,
                    op: 'add',
                    path: webViewerRSD.project,
                    value: [
                        {
                            id: webViewerRSD.id,
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
        since('Create contentfrom2project, group should be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName6))
            .toBe(true);
        await sidebar.openGroupSection(contentGroupName6);
        since(`New contentfrom2project content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(contentGroupName6))
            .toBe(2);
        since(`The presence of dossier ${tutorialRSD.name} is supposed to be #{expected}, instead we have #{actual}`)
            .expect(await libraryPage.isItemViewable(tutorialRSD.name))
            .toBe(true);
        since(`The presence of dossier ${webViewerRSD.name} is supposed to be #{expected}, instead we have #{actual}`)
            .expect(await libraryPage.isItemViewable(webViewerRSD.name))
            .toBe(true);

        // Check group color
        since('The group color should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.getGroupColor(contentGroupName6))
            .toBe('opacity: 1; background: rgb(0, 0, 255);');

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });
        await sidebar.openAllSectionList();
        since('Delete contentfrom2project, group should not be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName6))
            .toBe(false);
    });

    it('[TC81602] Validate Content Group with special content group name and color', async () => {
        // Create Content Group
        const contentGroupInfo1 = {
            color: 0,
            emailEnabled: true,
            name: contentGroupName7,
            opacity: 100,
            recipients: [
                {
                    id: testerUserGroup,
                },
            ],
        };
        const contentGroupId1 = await createContentGroup(
            { credentials: admincredentials, contentGroupInfo: contentGroupInfo1 },
            false
        );
        id = [contentGroupId1];
        const contentGroupInfo2 = {
            color: 16777215,
            emailEnabled: true,
            name: contentGroupName8,
            opacity: 100,
            recipients: [
                {
                    id: testerUser,
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
        const contentGroupId2 = await createContentGroup({
            credentials: admincredentials,
            contentGroupInfo: contentGroupInfo2,
            contentInfo: contentInfo2,
        });
        id.push(contentGroupId2);

        const contentGroupInfo3 = {
            color: 6592250,
            emailEnabled: true,
            name: contentGroupName9,
            opacity: 100,
            recipients: [
                {
                    id: testerUserGroup,
                },
            ],
        };
        const contentInfo3 = {
            operationList: [
                {
                    id: 1,
                    op: 'add',
                    path: renameDossier.project,
                    value: [
                        {
                            id: renameDossier.id,
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
        const contentGroupId3 = await createContentGroup({
            credentials: admincredentials,
            contentGroupInfo: contentGroupInfo3,
            contentInfo: contentInfo3,
        });
        id.push(contentGroupId3);

        // Check in library
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        since("Create `~@#$%^&*()_+{}|;:'<>?,./①I, group should be existed")
            .expect(await sidebar.isGroupExisted(contentGroupName7))
            .toBe(true);
        since("Create <span style='color:red'>olive oil</span>, group should be existed")
            .expect(await sidebar.isGroupExisted(contentGroupName8))
            .toBe(true);
        since("Create <script type='text/javascript'>console.log('888')</script>, group should be existed")
            .expect(await sidebar.isGroupExisted(contentGroupName9))
            .toBe(true);

        // Check group color
        await sidebar.openGroupSection(contentGroupName7);
        since('The group color should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.getGroupColor(contentGroupName7))
            .toBe('opacity: 1; background: rgb(0, 0, 0);');
        await sidebar.openGroupSection(contentGroupName8);
        since('The group color should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.getGroupColor(contentGroupName8))
            .toBe('opacity: 1; background: rgb(255, 255, 255);');
        await sidebar.openGroupSection(contentGroupName9);
        since('The group color should be #{expected}, instead we have #{actual}')
            .expect(await sidebar.getGroupColor(contentGroupName9))
            .toBe('opacity: 1; background: rgb(100, 150, 250);');

        // Expand and collapse Content Group
        await sidebar.clickGroupCollapseButton();
        since('Collapse content group, group should not be clickable')
            .expect(await sidebar.isGroupClickable(contentGroupName9))
            .toBe(false);
        await sidebar.clickGroupCollapseButton();
        since('Collapse content group, group should not be clickable')
            .expect(await sidebar.isGroupClickable(contentGroupName9))
            .toBe(true);

        await sidebar.openAllSectionList();
        since(`All tab content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('All'))
            .toBe(3);

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId1] });
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId2] });
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId3] });

        await sidebar.openAllSectionList();
        since(`All tab content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('All'))
            .toBe(1);
        since("Delete `~@#$%^&*()_+{}|;:'<>?,./①I, group should not be existed")
            .expect(await sidebar.isGroupExisted(contentGroupName7))
            .toBe(false);
        since("Delete <span style='color:red'>olive oil</span>, group should not be existed")
            .expect(await sidebar.isGroupExisted(contentGroupName8))
            .toBe(false);
        since("Delete <script type='text/javascript'>console.log('888')</script>, group should not be existed")
            .expect(await sidebar.isGroupExisted(contentGroupName9))
            .toBe(false);
    });

    it('[TC81430] Validate Content Group with more than one user', async () => {
        // Create Content Group
        const contentGroupInfo = {
            color: 11835101,
            emailEnabled: false,
            name: contentGroupName10,
            opacity: 100,
            recipients: [
                {
                    id: testerUser,
                },
                {
                    id: testerUser2,
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
        const contentGroupId = await createContentGroup({
            credentials: admincredentials,
            contentGroupInfo,
            contentInfo,
        });
        id = [contentGroupId];

        // Check in library
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        since('Create contentwith2user, group should be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName10))
            .toBe(true);
        await sidebar.openGroupSection(contentGroupName10);
        since(`New contentwith2user content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(contentGroupName10))
            .toBe(2);

        // Switch user
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        await loginPage.login({ username: username2, password: '' });

        // Check in library
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        since('Create contentwith2user, group should be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName10))
            .toBe(true);
        await sidebar.openGroupSection(contentGroupName10);
        since(`New contentwith2user content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(contentGroupName10))
            .toBe(1); //have no access to web viewer project

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });
        await sidebar.openAllSectionList();
        since('Delete contentwith2user, group should not be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName10))
            .toBe(false);
    });
});

export const config = specConfiguration;
