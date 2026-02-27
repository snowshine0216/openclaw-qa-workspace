/* eslint-disable protractor/no-get-in-it */
import createContentGroup from '../../../api/contentGroup/createContentGroup.js';
import deleteContentGroupsByIds from '../../../api/contentGroup/deleteContentGroupsByIds.js';
import deleteContentGroupsByNames from '../../../api/contentGroup/deleteContentGroupsByNames.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';
import deleteAllGroups from '../../../api/deleteAllGroups.js';
import deleteAllFavorites from '../../../api/deleteAllFavorites.js';
import createGroups from '../../../api/createGroups.js';
import users from '../../../testData/users.json' assert { type: 'json' };

const specConfiguration = customCredentials('_cgxf');

describe('ContentGroupX-Func', () => {
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

    const contentGroupName = `ContentGroupX-Func_${username}`;

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

    const webViewerRSD = {
        id: 'BDD01F0940872CFCAD6E358D4EF85832',
        name: 'Auto_Web Viewer Test project_RSD',
        project: '/D10588594AD78261882D5DB37131DBF2',
    };

    let id = [];

    let {
        loginPage,
        libraryPage,
        dossierPage,
        libraryFilter,
        infoWindow,
        sidebar,
        quickSearch,
        fullSearch,
        group,
        shareDossier,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
        await deleteAllGroups(specConfiguration.credentials);
        await deleteAllFavorites(specConfiguration.credentials);
    });

    beforeEach(async () => {
        await deleteContentGroupsByNames({ credentials: admincredentials, namesToFind: [contentGroupName] });
    });

    afterEach(async () => {
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: id });
        await deleteAllGroups(specConfiguration.credentials);
        await deleteAllFavorites(specConfiguration.credentials);
        await libraryPage.refresh();
        await libraryPage.waitForLibraryLoading();
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
                {
                    id: 3,
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
        return createContentGroup({ credentials: admincredentials, contentGroupInfo, contentInfo });
    }

    it('[TC75090] Validate X-Func of Content Group on Library home page - sort/filter', async () => {
        const contentGroupId = await createNewContentGroup(contentGroupName);
        id = [contentGroupId];

        // Check in all tab
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        since(`All tab content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('All'))
            .toBe(4);

        // Sort in all tab
        await libraryPage.openSortMenu();
        await libraryPage.selectSortOption('Date Added');

        // Filter in all tab
        await libraryPage.clickFilterIcon();
        await libraryFilter.openFilterDetailPanel('Status');
        await libraryFilter.checkFilterType('New');
        await libraryFilter.openFilterTypeDropdown();
        await libraryFilter.checkFilterType('Dashboard');
        await libraryFilter.clickApplyButton();
        since(`All tab content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('All'))
            .toBe(2);

        // Check in default group
        await sidebar.openGroupSection(contentGroupName);
        since(`Group content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(contentGroupName))
            .toBe(2);

        // Clear Filter
        await libraryPage.clickFilterIcon();
        await libraryPage.clickFilterClearAll();
        await libraryFilter.clickApplyButton();
        since(`Group content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(contentGroupName))
            .toBe(3);

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });

        // Check in library
        await sidebar.openAllSectionList();
        since('Delete group, group should not be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName))
            .toBe(false);
    });

    it('[TC81939] Validate X-Func of Content Group on Library info window', async () => {
        const contentGroupId = await createNewContentGroup(contentGroupName);
        id = [contentGroupId];
        await libraryPage.refresh(); //DE228537

        // Check in all tab
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        since(`All tab content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('All'))
            .toBe(4);
        // Open info window
        await libraryPage.moveDossierIntoViewPort(webViewerDossier.name);
        await libraryPage.openDossierInfoWindow(webViewerDossier.name);
        // Favorite
        await infoWindow.favoriteDossier(webViewerDossier.name);
        since('Favorite dossier by home page info-window, favorites button on info-window image should be selected')
            .expect(await infoWindow.isFavoritesBtnSelected())
            .toBe(true);
        since(
            'Favorite dossier by home page info-window, the total favorites count on All list should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(1);
        // Share
        await infoWindow.shareDossier();
        await shareDossier.searchRecipient('tester_auto_cgxf');
        await shareDossier.selectRecipients(['tester_auto_cgxf']);
        since('share button status should be #{expected}, instead we have #{actual}')
            .expect(await shareDossier.isShareButtonEnabled())
            .toBe(true);
        await shareDossier.shareDossier();
        since('Share dossier on all tab, share window should be closed after click share button')
            .expect(await shareDossier.getShareDossierDialog().isDisplayed())
            .toBe(false);
        await infoWindow.close();

        // Check in default group
        await sidebar.openGroupSection(contentGroupName);
        // Open info window
        await libraryPage.moveDossierIntoViewPort(webViewerDossier.name);
        await libraryPage.openDossierInfoWindow(webViewerDossier.name);
        // Reset
        since('isResetDisabled is supposed to be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.isResetDisabled())
            .toBe(true);

        // Unfavorite
        await infoWindow.removeFavoriteDossier(webViewerDossier.name);
        since(
            'Unfavorite dossier by default group info-window, favorites button on info-window image should not be selected'
        )
            .expect(await infoWindow.isFavoritesBtnSelected())
            .toBe(false);

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });

        // Check in library
        await sidebar.openAllSectionList();
        since('Delete group, group should not be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName))
            .toBe(false);
    });

    it('[TC81940_01] Validate X-Func of Content Group on Library Context menu', async () => {
        const contentGroupId = await createNewContentGroup(contentGroupName);
        id = [contentGroupId];
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        await sidebar.openGroupSection(contentGroupName);

        // Open
        await libraryPage.openDossierContextMenu(tutorialDossierwithPrompt.name);
        await libraryPage.clickDossierContextMenuItem('Open');
        await dossierPage.waitForDossierLoading();
        since('The page should be #{expected}, instead we have #{actual}')
            .expect(await dossierPage.pageTitle())
            .toEqual([tutorialDossierwithPrompt.name, 'Chapter 1', 'Page 1']);
        await dossierPage.goToLibrary();

        // Multi select - favorite
        await sidebar.openAllSectionList();
        await libraryPage.openDossierContextMenu(webViewerDossier.name);
        await libraryPage.clickDossierContextMenuItem('Multi-select');
        await libraryPage.selectDossier(tutorialDossier.name);
        await libraryPage.openDossierContextMenu(webViewerDossier.name);
        await libraryPage.clickDossierContextMenuItem('Favorite');
        since(
            'Favorite dossier by context menu, the total favorites count on All list should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(2);

        await libraryPage.openDossierContextMenu(webViewerDossier.name);
        await libraryPage.clickDossierContextMenuItem('Multi-select');
        await libraryPage.selectDossier(tutorialDossier.name);
        await libraryPage.openDossierContextMenu(webViewerDossier.name);
        await libraryPage.clickDossierContextMenuItem('Remove from Favorites');
        since('Remove dossier from favorites by context menu, Favorites should NOT be present on Favolites list')
            .expect(await libraryPage.isFavoritesPresent())
            .toBe(false);

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });

        // Check in library
        await sidebar.openAllSectionList();
        since('Delete group, group should not be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName))
            .toBe(false);
    });

    it('[TC81940_02] Validate X-Func of Content Group on Library Context menu', async () => {
        const contentGroupId = await createNewContentGroup(contentGroupName);
        id = [contentGroupId];
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        await sidebar.openGroupSection(contentGroupName);

        // New Group
        await libraryPage.openDossierContextMenu(webViewerDossier.name);
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
        await libraryPage.openDossierContextMenu(webViewerDossier.name);
        await libraryPage.clickDossierContextMenuItem(`Remove from "Group1"`);
        since('Group1 should be empty')
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });

        // Check in library
        await sidebar.openAllSectionList();
        since('Delete group, group should not be existed')
            .expect(await sidebar.isGroupExisted(contentGroupName))
            .toBe(false);
    });

    it('[TC81940_03] Validate X-Func of Content Group on Library Context menu', async () => {
        const contentGroupId = await createNewContentGroup(contentGroupName);
        id = [contentGroupId];

        // create group3
        await createGroups({
            groupList: [{ name: 'Group3', color: 'Springgreen' }],
            credentials: specConfiguration.credentials,
        });

        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();
        await sidebar.openGroupSection(contentGroupName);

        // Multi select - new group
        await sidebar.openAllSectionList();
        await libraryPage.openDossierContextMenu(webViewerDossier.name);
        await libraryPage.clickDossierContextMenuItem('Multi-select');
        await libraryPage.selectDossier(tutorialDossier.name);
        await libraryPage.openDossierContextMenu(webViewerDossier.name);
        await libraryPage.clickDossierContextMenuItem('New Group');
        await group.inputGroupName('Group2');
        await group.clickGroupSaveBtn();
        await sidebar.openGroupSection('Group2');
        since(`Group2 content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('Group2'))
            .toBe(2);

        // Multi select - move to group1
        await libraryPage.openDossierContextMenu(webViewerDossier.name);
        await libraryPage.clickDossierContextMenuItem('Multi-select');
        await libraryPage.selectDossier(tutorialDossier.name);
        await libraryPage.openDossierContextMenu(webViewerDossier.name);
        await libraryPage.clickDossierContextMenuItem('Move to Group', 'Group3');
        since('Group2 should be empty')
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });

        // Check in library
        await sidebar.openAllSectionList();
        await sidebar.openGroupSection('Group3');
        since(`Group1 content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('Group3'))
            .toBe(2);
    });

    it('[TC81941] Validate X-Func of Content Group on Library Shared Link', async () => {
        const contentGroupId = await createNewContentGroup(contentGroupName);
        id = [contentGroupId];

        // Open content shared link
        const url = await browser.getUrl();
        const dossierUrl = url + '/9D8A49D54E04E0BE62C877ACC18A5A0A/1239F9D64FDAE4DF908BEBBAA6126C2A/K53--K46';
        await browser.url(dossierUrl);
        await libraryPage.waitForItemLoading();
        since('Add to Library should be shown in header')
            .expect(await dossierPage.isAddToLibraryDisplayed())
            .toBe(false);
        await dossierPage.goToLibrary();

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });
    });

    it('[TC81942] Validate X-Func of Content Group on Library Search', async () => {
        const contentGroupId = await createNewContentGroup(contentGroupName);
        id = [contentGroupId];
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('viewer');
        await fullSearch.clickMyLibraryTab();
        since('My library tab, Dossier counts before content group added should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getMyLibraryCount())
            .toBe(2);

        await fullSearch.backToLibrary();
        await libraryPage.openSidebarOnly();
        await sidebar.openAllSectionList();

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('viewer');
        await fullSearch.clickMyLibraryTab();
        since('My library tab, Dossier counts after content group added should be #{expected}, while we get #{actual}')
            .expect(await fullSearch.getMyLibraryCount())
            .toBe(2);

        // Delete Content Group
        await deleteContentGroupsByIds({ credentials: admincredentials, contentGroupIds: [contentGroupId] });

        await fullSearch.backToLibrary();

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('viewer');
        await fullSearch.clickMyLibraryTab();
        since(
            'My library tab, Dossier counts after content group deleted should be #{expected}, while we get #{actual}'
        )
            .expect(await fullSearch.getMyLibraryCount())
            .toBe(2);
    });
});

export const config = specConfiguration;
