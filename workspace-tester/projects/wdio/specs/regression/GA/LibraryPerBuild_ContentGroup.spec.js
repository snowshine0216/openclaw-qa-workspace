import createContentGroup from '../../../api/contentGroup/createContentGroup.js';
import updateContentGroup from '../../../api/contentGroup/updateContentGroup.js';
import deleteContentGroupsByIds from '../../../api/contentGroup/deleteContentGroupsByIds.js';
import deleteContentGroupsByNames from '../../../api/contentGroup/deleteContentGroupsByNames.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('.contentgroup', browsers.params.credentials.password) };

describe('E2E Per Build Test on Dossier Content', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    const admincredentials = {
        username: 'mstr.copy',
        password: 'newman1#',
    };

    const { credentials } = specConfiguration;
    const username = credentials.username;
    const contentGroupName = `contentgroup_${username}`;
    const updateGroupName = `update_${username}`;

    const user = {
        id: '5B818D254411DE2A4A3F1D89989F9C37',
        name: 'web.contentgroup',
    };

    const dossierInLibrary = {
        id: 'BDD72BE311EAA41CD7700080EFD5E527',
        name: 'Visual Vocabulary',
        project: '/B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };

    const dossierNotInLibrary = {
        id: '11EA496611E751FB1E9A0080EF25C29E',
        name: 'Rustic',
        project: '/B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };

    const defaultViewDossier = {
        id: '4C4BB57C11EB4EFF96550080EF952010',
        name: 'Human Resources Analysis',
        project: '/B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };

    const lastSavedViewDossier = {
        id: 'C28AC9DB32436DF92BC284801A5F6BFC',
        name: 'US Economy Analysis_Last Saved View',
        project: '/B7CA92F04B9FAE8D941C3E9B7E0CD754',
    };

    let { libraryPage, dossierPage, infoWindow, manageLibrary, toc, sidebar, loginPage } = browsers.pageObj1;
    let id = [];

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(specConfiguration.credentials);

        await deleteContentGroupsByNames({
            credentials: admincredentials,
            namesToFind: [contentGroupName, updateGroupName],
        });

        const dossierList = [defaultViewDossier,lastSavedViewDossier];
        for await (const dossier of dossierList) {
            await libraryPage.openDossierContextMenu(dossier.name);
            const isInGroup1 = await libraryPage.isItemDisplayedInContextMenu(`Remove from "Group1"`);
            if (isInGroup1) {
                await libraryPage.clickDossierContextMenuItem(`Remove from "Group1"`);
            }
            await libraryPage.refresh();
            await libraryPage.openDossierContextMenu(dossier.name);
            const isInGroup2 = await libraryPage.isItemDisplayedInContextMenu(`Remove from "Group2"`);
            if (isInGroup2) {
                await libraryPage.clickDossierContextMenuItem(`Remove from "Group2"`);
            }
            await libraryPage.refresh();
        }
    });

    beforeEach(async () => {
        await libraryPage.clickLibraryIcon();
    });

    afterEach(async () => {
        await libraryPage.clickLibraryIcon();
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: id });
    });

    it('[TC82140] Library Web - Content Group - Validate display of Content Group', async () => {
        const contentGroupInfo = {
            color: 14115462,
            emailEnabled: false,
            name: contentGroupName,
            recipients: [
                {
                    id: user.id,
                },
            ],
        };
        const contentInfo = {
            operationList: [
                {
                    id: 1,
                    op: 'add',
                    path: dossierInLibrary.project,
                    value: [
                        {
                            id: dossierInLibrary.id,
                            type: 55,
                        },
                    ],
                },
                {
                    id: 2,
                    op: 'add',
                    path: dossierNotInLibrary.project,
                    value: [
                        {
                            id: dossierNotInLibrary.id,
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
        await libraryPage.sleep(1000);

        // Check in library
        await libraryPage.reload();
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        await libraryPage.waitForLibraryLoading();
        await since(`Create content group, group should be existed`)
            .expect(await sidebar.isGroupExisted(contentGroupName))
            .toBe(true);
        await since(`The content count in all tab should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('All'))
            .toBe(4);
        await sidebar.openGroupSection(contentGroupName);
        await since(`The group color should be #{expected}, instead we have #{actual}`)
            .expect(await sidebar.getGroupColor(contentGroupName))
            .toBe('opacity: 1; background: rgb(215, 98, 134);');
        await since(`The content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(contentGroupName))
            .toBe(2);
        await since(
            `The presence of dossier ${dossierInLibrary.name} is supposed to be #{expected}, instead we have #{actual}`
        )
            .expect(await libraryPage.isItemViewable(dossierInLibrary.name))
            .toBe(true);
        await since(
            `The presence of dossier ${dossierNotInLibrary.name} is supposed to be #{expected}, instead we have #{actual}`
        )
            .expect(await libraryPage.isItemViewable(dossierNotInLibrary.name))
            .toBe(true);

        // Update Content Group name, color, remove dossier use API
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
                    op: 'remove',
                    path: dossierInLibrary.project,
                    value: [
                        {
                            id: dossierInLibrary.id,
                            type: 55,
                        },
                    ],
                },
                {
                    id: 2,
                    op: 'remove',
                    path: dossierNotInLibrary.project,
                    value: [
                        {
                            id: dossierNotInLibrary.id,
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
        await libraryPage.waitForLibraryLoading();
        await since(`Update content group, new group should be existed`)
            .expect(await sidebar.isGroupExisted(updateGroupName))
            .toBe(true);
        await since(`Update content group, old group should not be existed`)
            .expect(await sidebar.isGroupExisted(contentGroupName))
            .toBe(false);
        await since(
            `The presence of dossier ${dossierInLibrary.name} is supposed to be #{expected}, instead we have #{actual}`
        )
            .expect(await libraryPage.isItemViewable(dossierInLibrary.name))
            .toBe(true);
        await sidebar.openGroupSection(updateGroupName);
        await since(`The update group color should be #{expected}, instead we have #{actual}`)
            .expect(await sidebar.getGroupColor(updateGroupName))
            .toBe('opacity: 1; background: rgb(73, 172, 172);');
        await since('Group section for update group should be empty')
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);
        await since(`Message for empty group should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getEmptyLibraryMessage())
            .toBe('This content group is empty or you do not have View access to the content in it.');

        // Delete Content Group use API
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });

        // Check in library
        await sidebar.openAllSectionList();
        await libraryPage.waitForLibraryLoading();
        await since(`Delete update group, group should not be existed`)
            .expect(await sidebar.isGroupExisted(updateGroupName))
            .toBe(false);
        await since(
            `The presence of dossier ${dossierInLibrary.name} is supposed to be #{expected}, instead we have #{actual}`
        )
            .expect(await libraryPage.isItemViewable(dossierInLibrary.name))
            .toBe(true);
    });

    it('[TC82141_01] Library Web - Content Group - Validate rename/remove of Dossier in Content Group', async () => {
        await sidebar.openGroupSection('Content Group');
        await since(`The content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('Content Group'))
            .toBe(2);
        await since(
            `The presence of dossier ${defaultViewDossier.name} is supposed to be #{expected}, instead we have #{actual}`
        )
            .expect(await libraryPage.isItemViewable(defaultViewDossier.name))
            .toBe(true);
        await since(
            `The presence of dossier ${lastSavedViewDossier.name} is supposed to be #{expected}, instead we have #{actual}`
        )
            .expect(await libraryPage.isItemViewable(lastSavedViewDossier.name))
            .toBe(true);

        // No remove icon in info window
        await libraryPage.moveDossierIntoViewPort(defaultViewDossier.name);
        await libraryPage.openDossierInfoWindow(defaultViewDossier.name);
        await since('Is Remove button displayed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.isRemovePresent())
            .toBe(false);
        await infoWindow.close();

        // Can't remove and rename in manage my library
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Manage Library');
        await since(
            'The enabled status of "Select All" button is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(await manageLibrary.isSelectAllEnabled())
            .toBe(false);
        await manageLibrary.hoverDossier(defaultViewDossier.name);
        await since(
            'The warning tooltip of dossier in default group is supposed to be #{expected}, instead we have #{actual}'
        )
            .expect(
                await libraryPage.isTooltipDisplayed(
                    'Content cannot be edited because it was added by the administrator.'
                )
            )
            .toBe(true);
        await manageLibrary.closeManageMyLibrary();
    });

    it('[TC82141_02] Library Web - Content Group - Validate copy to personal group of Dossier in Content Group', async () => {
        await sidebar.openGroupSection('Content Group');

        // Copy dossier from content group to personal group with single selected mode
        await libraryPage.openDossierContextMenu(defaultViewDossier.name);
        await since('Copy to Group should display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Copy to Group').isDisplayed())
            .toBe(true);
        await since('Move to Group should not display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Move to Group').isDisplayed())
            .toBe(false);
        await libraryPage.clickDossierContextMenuItem('Copy to Group', 'Group1');
        await since(`The content count after copy to personal group should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('Content Group'))
            .toBe(2);
        await sidebar.openGroupSection('Group1');
        await since(`The content count in Group1 should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('Group1'))
            .toBe(1);
        await since(
            `The presence of dossier ${defaultViewDossier.name} is supposed to be #{expected}, instead we have #{actual}`
        )
            .expect(await libraryPage.isItemViewable(defaultViewDossier.name))
            .toBe(true);

        // Copy dossier from content group to personal group with multi selected mode
        await sidebar.openGroupSection('Content Group');
        await libraryPage.clickMultiSelectBtn();
        await libraryPage.selectDossier(defaultViewDossier.name);
        await libraryPage.selectDossier(lastSavedViewDossier.name);
        await libraryPage.openDossierContextMenu(defaultViewDossier.name);
        await await since('Copy to Group should display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Copy to Group').isDisplayed())
            .toBe(true);
        await await since('Move to Group should not display in dossier context menu.')
            .expect(await libraryPage.getDossierContextMenuItem('Move to Group').isDisplayed())
            .toBe(false);
        await libraryPage.clickDossierContextMenuItem('Copy to Group', 'Group2');
        await since(`The content count after copy to personal group should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('Content Group'))
            .toBe(2);
        await sidebar.openGroupSection('Group2');
        await since(`The content count in Group2 should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('Group2'))
            .toBe(2);
        await since(
            `The presence of dossier ${defaultViewDossier.name} is supposed to be #{expected}, instead we have #{actual}`
        )
            .expect(await libraryPage.isItemViewable(defaultViewDossier.name))
            .toBe(true);
        await since(
            `The presence of dossier ${lastSavedViewDossier.name} is supposed to be #{expected}, instead we have #{actual}`
        )
            .expect(await libraryPage.isItemViewable(lastSavedViewDossier.name))
            .toBe(true);

        // Remove from Personal Group2
        await libraryPage.clickMultiSelectBtn();
        await libraryPage.selectDossier(defaultViewDossier.name);
        await libraryPage.selectDossier(lastSavedViewDossier.name);
        await libraryPage.openDossierContextMenu(defaultViewDossier.name);
        await libraryPage.clickDossierContextMenuItem(`Remove from "Group2"`);
        await since('Group2 should be empty')
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);
    });

    it('[TC82141_03] Library Web - Content Group - Validate view setting of Dossier in Content Group', async () => {
        await sidebar.openGroupSection('Content Group');
        await libraryPage.openDossier(lastSavedViewDossier.name);
        await dossierPage.waitForPageLoadByTitle(lastSavedViewDossier.name);
        await since('The page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([lastSavedViewDossier.name, 'Economy Analysis', 'GDP']);
        await toc.openPageFromTocMenu({ chapterName: 'Economy Analysis', pageName: 'Overview' });
        await dossierPage.goToLibrary();

        // The default view of this dossier is last saved view
        await libraryPage.openDossier(lastSavedViewDossier.name);
        await dossierPage.waitForPageLoadByTitle(lastSavedViewDossier.name);
        await since('The page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([lastSavedViewDossier.name, 'Economy Analysis', 'GDP']);
        await dossierPage.goToLibrary();
    });
});

export const config = specConfiguration;
