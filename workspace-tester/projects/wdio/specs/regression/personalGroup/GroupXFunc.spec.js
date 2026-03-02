import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import deleteAllGroups from '../../../api/deleteAllGroups.js';
import deleteAllFavorites from '../../../api/deleteAllFavorites.js';

const specConfiguration = { ...customCredentials('_group_xfunc') };

describe('Group X-Func', () => {
    const project = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const dossier = {
        id: 'BCD06D184E679BBD0F18D799935D4EE4',
        name: '(AUTO) GlobalSearch_Certified document',
        project: project,
    };
    const report = {
        id: '400F0AAD4A09D61A89CF6DBB42BB8495',
        name: '(AUTO) GlobalSearch_Report',
        project: project,
    };
    const groupName = 'Automation Test_XFunc';
    const groupNameforReport = 'Automation Test_Report';

    let {
        libraryPage,
        dossierPage,
        libraryFilter,
        sidebar,
        group,
        infoWindow,
        quickSearch,
        fullSearch,
        manageLibrary,
        userAccount,
        loginPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
    });

    beforeAll(async () => {
        await deleteAllGroups(specConfiguration.credentials);
        await deleteAllFavorites(specConfiguration.credentials);
        await libraryPage.reload();
    });

    afterAll(async () => {
        await deleteAllGroups(specConfiguration.credentials);
    });

    it('[TC72244] Group - XFunc - Sidebar x-func with infowindow', async () => {
        // infowindow when hide side bar
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.close();

        // infowindow when open side bar
        await libraryPage.openSidebar();
        await libraryPage.openDossierInfoWindow(dossier.name);
        await infoWindow.close();

        // back to homepage
        await libraryPage.closeSidebar();
    });

    it('[TC72245] Group - XFunc - Multi-select mode x-func with search and account menu', async () => {
        // multi mode X-func with search
        await libraryPage.clickMultiSelectBtn();
        await since(
            'Multi selection mode x-func with search and account menu, before search, the group bar should be present'
        )
            .expect(await group.isGroupBarPresent())
            .toBe(true);
        await since(
            'Multi selection mode x-func with search and account menu, before search, the multi select button should be active'
        )
            .expect(await libraryPage.isMultiSelectBtnActive())
            .toBe(true);
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('document');
        await fullSearch.backToLibrary();
        // -- check muti-select state
        await since(
            'Multi selection mode x-func with search and account menu, after search, the group bar should NOT be present'
        )
            .expect(await group.isGroupBarPresent())
            .toBe(false);
        await since(
            'Multi selection mode x-func with search and account menu, after search, the multi select button should NOT be active'
        )
            .expect(await libraryPage.isMultiSelectBtnActive())
            .toBe(false);

        // multi mode X-func with account menu - manage library
        await libraryPage.clickMultiSelectBtn();
        await since(
            'Multi selection mode x-func with search and account menu, before manage library, the group bar should be present'
        )
            .expect(await group.isGroupBarPresent())
            .toBe(true);
        await since(
            'Multi selection mode x-func with search and account menu, before manage library, the multi select button should be active'
        )
            .expect(await libraryPage.isMultiSelectBtnActive())
            .toBe(true);
        await libraryPage.openUserAccountMenu();
        await libraryPage.clickAccountOption('Manage Library');
        await manageLibrary.closeManageMyLibrary();
        // -- check muti-select state
        await since(
            'Multi selection mode x-func with search and account menu, after manage library, the group bar should NOT be present'
        )
            .expect(await group.isGroupBarPresent())
            .toBe(false);
        await since(
            'Multi selection mode x-func with search and account menu, after manage library, the multi select button should NOT be active'
        )
            .expect(await libraryPage.isMultiSelectBtnActive())
            .toBe(false);
    });

    it('[TC85341] Validate group and favorites on Report in Library Web', async () => {
        await libraryPage.openSidebar();

        // favorites
        await libraryPage.favoriteByImageIcon(report.name);
        await since(
            'Favorite report, the total favorites count on All list should be #{expected}, while we get #{actual}'
        )
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(1);
        await takeScreenshotByElement(libraryPage.getDossierImageContainer(report.name), 'TC85341', 'Favorites_report');

        // group
        await libraryPage.openDossierContextMenu(report.name);
        await libraryPage.clickDossierContextMenuItem('New Group');
        await group.inputGroupName(groupNameforReport);
        await group.clickGroupSaveBtn();
        // -- check favorite section
        await sidebar.openGroupSection(groupNameforReport);
        await since(`New group for reports, object count of this group should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(groupNameforReport))
            .toBe(1);

        // remove favorites from info window
        await libraryPage.openDossierInfoWindow(report.name);
        await infoWindow.removeFavorite();
        // await libraryPage.removeFavoriteByImageIcon(report.name);
        // remove from group
        await libraryPage.openDossierContextMenu(report.name);
        await libraryPage.clickDossierContextMenuItem(`Remove from "${groupNameforReport}"`);
        await since(`Remove report from group, group section should be empty`)
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);

        // back to homepage
        await sidebar.openAllSectionList();
        await libraryPage.closeSidebar();
    });

    it('[TC78928] Validate group & favorites list should always exists due to any exception', async () => {
        const groupName = '_auto_group_DONOTDELETE';
        //login with specific account
        await userAccount.openUserAccountMenu();
        await userAccount.logout();
        const credentials = customCredentials('_group_longlist').credentials;
        await loginPage.login(credentials);
        await libraryPage.openSidebar();

        // -- check group count
        await since(`Group list,  group count should be #{expected}, while we get #{actual}`)
            .expect(await sidebar.getGroupCount())
            .toBe(10);
        // -- check group dossier count
        await sidebar.openGroupSection(groupName);
        await since(`Group dossier list, dossier count of this group should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle(groupName))
            .toBe(8);

        // -- check favorite count
        await sidebar.openAllSectionList();
        await since(`Favorites count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getFavoritesCountFromTitle())
            .toBe(8);

        // Expand and collapse group
        await sidebar.clickGroupCollapseButton();
        await dossierPage.waitForLibraryLoading();
        since('Collapse group, group should not be clickable')
            .expect(await sidebar.isGroupClickable(groupName))
            .toBe(false);
        await sidebar.clickGroupCollapseButton();
        await dossierPage.waitForLibraryLoading();
        since('Expand group, group should be clickable')
            .expect(await sidebar.isGroupClickable(groupName))
            .toBe(true);

        // close sidebar
        await sidebar.openAllSectionList();
        await libraryPage.closeSidebar();
    });
});
export const config = specConfiguration;
