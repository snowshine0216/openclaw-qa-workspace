import createContentGroup from '../../../api/contentGroup/createContentGroup.js';
import updateContentGroup from '../../../api/contentGroup/updateContentGroup.js';
import deleteContentGroupsByIds from '../../../api/contentGroup/deleteContentGroupsByIds.js';
import deleteContentGroupsByNames from '../../../api/contentGroup/deleteContentGroupsByNames.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = customCredentials('');

describe('E2E_Content Group', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    const admincredentials = {
        username: 'contentgroupadmin',
        password: '',
        webServerUsername: 'admin',
        webServerPassword: 'admin',
    };

    const { credentials } = specConfiguration;
    const username = credentials.username;
    const contentGroupName = `contentgroup_${username}`;
    const updateGroupName = `update_${username}`;

    const projectId = '/9D8A49D54E04E0BE62C877ACC18A5A0A';
    const contentGroupDossier = 'CC8A60D241283A42E85012B23E70ED80';
    const contentGroupDocument = 'B27232EA4C1333F0B7ABFA921C1F3A0E';
    const contentGroupDocumentUpdate = '6301AE7C4DDF53281E7E44899D06C23F';
    const recipientUser = 'A5E3D5AE4CBA3C735B42FB9B1D9C1F9A'; // tester_auto

    let id = [];
    let { libraryPage, loginPage, dossierPage, sidebar } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
        await deleteContentGroupsByNames({
            credentials: admincredentials,
            namesToFind: [contentGroupName, updateGroupName],
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: id });
    });

    it('[TC75083] Validate Admin-Level Content Group End-to-End workflow on Library Web', async () => {
        const contentGroupInfo = {
            color: 14115462,
            emailEnabled: true,
            name: contentGroupName,
            opacity: 100,
            recipients: [
                {
                    id: recipientUser,
                },
            ],
        };
        const contentInfo = {
            operationList: [
                {
                    id: 1,
                    op: 'add',
                    path: projectId,
                    value: [
                        {
                            id: contentGroupDossier,
                            type: 55,
                        },
                    ],
                },
                {
                    id: 2,
                    op: 'add',
                    path: projectId,
                    value: [
                        {
                            id: contentGroupDocument,
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
        await since(`Create contentgroup, group should be existed`)
            .expect(await sidebar.isGroupExisted(contentGroupName))
            .toBe(true);
        await sidebar.openGroupSection(contentGroupName);
        await since(`New contentgroup content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(contentGroupName))
            .toBe(2);

        // Update Content Group name, color, add/remove RSD use API
        const updateContentGroupInfo = {
            operationList: [
                {
                    id: 1,
                    op: 'replace',
                    path: '/name',
                    value: updateGroupName,
                },
                {
                    id: 2,
                    op: 'replace',
                    path: '/color',
                    value: 4828332,
                },
            ],
        };
        const contentInfo2 = {
            operationList: [
                {
                    id: 1,
                    op: 'add',
                    path: projectId,
                    value: [
                        {
                            id: contentGroupDocumentUpdate,
                            type: 55,
                        },
                    ],
                },
                {
                    id: 2,
                    op: 'remove',
                    path: projectId,
                    value: [
                        {
                            id: contentGroupDocument,
                            type: 55,
                        },
                    ],
                },
                {
                    id: 3,
                    op: 'remove',
                    path: projectId,
                    value: [
                        {
                            id: contentGroupDossier,
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
        await since(`Update content group, new group should be existed`)
            .expect(await sidebar.isGroupExisted(updateGroupName))
            .toBe(true);
        await since(`Update content group, old group should not be existed`)
            .expect(await sidebar.isGroupExisted(contentGroupName))
            .toBe(false);
        await sidebar.openGroupSection(updateGroupName);
        await since(`Update content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(updateGroupName))
            .toBe(1);

        // Delete Content Group use API
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });

        // Check in library
        await sidebar.openAllSectionList();
        await since(`Delete update group, group should not be existed`)
            .expect(await sidebar.isGroupExisted(updateGroupName))
            .toBe(false);
    });
});
