import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/customApp/info.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';

describe('Custom App - Customized Items', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        dossierPage,
        libraryPage,
        librarySort,
        shareDossier,
        notification,
        commentsPage,
        libraryFilter,
        quickSearch,
        toc,
        reset,
        share,
        infoWindow,
        sidebar,
        group,
        baseVisualization,
        bookmark,
        userAccount,
    } = browsers.pageObj1;

    let customAppIdLibraryHomeDisabeRecent,
        customAppIdLibraryHomeDisableMyContent,
        customAppIdLibraryHomeDisableFavourte,
        customAppIdLibraryHomeDisableMyGroup,
        customAppIdLibraryHomeDisableMyGroupAndFavor,
        customAppIdLibraryHomeDisableSubscription,
        customAppIdLibraryHomeDisableDefaultGroups,
        customAppIdLibraryHomeDisableSortAndSearch,
        customAppIdLibraryHomeDisableMultiSelect,
        customAppIdLibraryHomeDisableNotification,
        customAppIdLibraryHomeDisableAccount,
        customAppIdLibraryHomeDisableTOCAndUndo,
        customAppIdLibraryHomeDisableBookmarkAndReset,
        customAppIdLibraryHomeDisableComment,
        customAppIdLibraryHomeDisableShare,
        customAppIDLibraryHomeDisableSidebar;

    beforeAll(async () => {
        await loginPage.login(consts.appUser.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [
                customAppIdLibraryHomeDisabeRecent,
                customAppIdLibraryHomeDisableMyContent,
                customAppIdLibraryHomeDisableFavourte,
                customAppIdLibraryHomeDisableMyGroup,
                customAppIdLibraryHomeDisableMyGroupAndFavor,
                customAppIdLibraryHomeDisableSubscription,
                customAppIdLibraryHomeDisableDefaultGroups,
                customAppIdLibraryHomeDisableSortAndSearch,
                customAppIdLibraryHomeDisableMultiSelect,
                customAppIdLibraryHomeDisableNotification,
                customAppIdLibraryHomeDisableAccount,
                customAppIdLibraryHomeDisableTOCAndUndo,
                customAppIdLibraryHomeDisableBookmarkAndReset,
                customAppIdLibraryHomeDisableComment,
                customAppIdLibraryHomeDisableShare,
                customAppIDLibraryHomeDisableSidebar,
            ],
        });
    });

    it('[TC80057_01] Disable Sidebar', async () => {
        // create app
        customAppIDLibraryHomeDisableSidebar = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableSidebar,
        });
        await libraryPage.openCustomAppById({ id: customAppIDLibraryHomeDisableSidebar });
        await since(
            'In disabled sidebar app, Sidebar shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getLibraryIcon().isDisplayed())
            .toBe(false);
    });

    it('[TC80057_02] Disable Recents', async () => {
        // create app
        customAppIdLibraryHomeDisabeRecent = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableRecent,
        });
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHomeDisabeRecent });
        await libraryPage.clickLibraryIcon();
        await since(
            'In disable recents app, Recents shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await sidebar.getPredefinedSectionItem('Recents').isDisplayed())
            .toBe(false);
    });

    it('[TC80057_03] Disable My Content', async () => {
        // create app
        customAppIdLibraryHomeDisableMyContent = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableMyContent,
        });
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHomeDisableMyContent });
        await libraryPage.clickLibraryIcon();
        await since(
            'In disable my content app, My Content shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await sidebar.getPredefinedSectionItem('My Content').isDisplayed())
            .toBe(false);
    });

    it('[TC80057_04] Disable Favorites', async () => {
        // create app
        customAppIdLibraryHomeDisableFavourte = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableFavourite,
        });
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHomeDisableFavourte });
        await libraryPage.openDossier(consts.testedDossier.name);
        await dossierPage.waitForDossierLoading();
        await toc.openMenu();
        const favIcon = await toc.getFavoritesIcon();
        await since(
            'In disable favorites app, Favorites icon shows up in toc menu to be #{expected}, instead we have #{actual}.'
        )
            .expect(await favIcon.isDisplayed())
            .toBe(false);
        await dossierPage.goToLibrary();
        await libraryPage.clickLibraryIcon();
        await since(
            'In disable favorites app, Favorites shows up in sidebar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await sidebar.getPredefinedSectionItem('Favorites').isDisplayed())
            .toBe(false);

        await libraryPage.openDossierInfoWindow(consts.testedDossier.name);
        await since(
            'In disable favorites app, Favorites icon shows up in infowindow to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getFavoriteButton().isDisplayed())
            .toBe(false);
        await infoWindow.close();
        await libraryPage.openDossierContextMenu(consts.testedDossier.name);
        await since(
            'In disable favorites app, Favorites icon shows up in context menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getDossierContextMenuItem('Favorite').isDisplayed())
            .toBe(false);
    });

    it('[TC80057_05] Disable My Groups', async () => {
        // create app
        customAppIdLibraryHomeDisableMyGroup = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableMyGroup,
        });
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHomeDisableMyGroup });
        await libraryPage.clickLibraryIcon();
        await since(
            'In disable my Groups app, My Groups shows up in sidebar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await sidebar.getPredefinedSectionItem('My Groups').isDisplayed())
            .toBe(false);

        await libraryPage.openDossierContextMenu(consts.testedDossier.name);
        await since(
            'In disable my Groups app,  New Group shows up in context menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getDossierContextMenuItem('New Group').isDisplayed())
            .toBe(false);
        await since(
            'In disable my Groups app, Move to Group shows up in context menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getDossierContextMenuItem('Move to Group').isDisplayed())
            .toBe(false);

        await libraryPage.clickMultiSelectBtn();
        await group.clickGroupBarSelectAllBtn();
        await since(
            'In disable my Groups app, Add to Group shows up in multiseletec is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await group.getGroupBarActionBtn().isDisplayed())
            .toBe(false);
    });

    it('[TC80057_06] Disable My Groups and Favor', async () => {
        // create app
        customAppIdLibraryHomeDisableMyGroupAndFavor = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableMyGroupAndFavor,
        });
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHomeDisableMyGroupAndFavor });
        await libraryPage.clickLibraryIcon();
        await since(
            'In disable my groups and favorite app, My Groups shows up in sidebar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await sidebar.getPredefinedSectionItem('My Groups').isDisplayed())
            .toBe(false);
        await since(
            'In disable my groups and favorite app, Favorites icon shows up in sidebar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await sidebar.getPredefinedSectionItem('Favorites').isDisplayed())
            .toBe(false);

        await libraryPage.openDossierContextMenu(consts.testedDossier.name);
        await since(
            'In disable my groups and favorite app, New Group shows up in context menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getDossierContextMenuItem('New Group').isDisplayed())
            .toBe(false);
        await since(
            'In disable my groups and favorite app, Move to Group shows up in context menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getDossierContextMenuItem('Move to Group').isDisplayed())
            .toBe(false);
        await since(
            'n disable my groups and favorite app, Multi select shows up in context menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getMultiSelectButton().isDisplayed())
            .toBe(false);
    });

    it('[TC80057_07] Disable Subscriptions', async () => {
        // create app
        customAppIdLibraryHomeDisableSubscription = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableSubscription,
        });
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHomeDisableSubscription });
        await libraryPage.clickLibraryIcon();
        await since(
            'In disable Subscriptions app, subscriptions shows up in sidebar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await sidebar.getPredefinedSectionItem('Subscriptions').isDisplayed())
            .toBe(false);

        await libraryPage.openDossierInfoWindow(consts.testedDossier.name);
        await since(
            'In disable Subscriptions app, Subscriptions shows up in dossier infowindow is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getManageSubscriptionsButton().isDisplayed())
            .toBe(false);
        await infoWindow.close();
        await libraryPage.openDossier(consts.testedDossier.name);
        await dossierPage.openShareDropDown();
        await since(
            'In disable Subscriptions app, Subscriptions  shows up in share menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await share.getSubscribeButton().isDisplayed())
            .toBe(false);
    });

    it('[TC80057_08] Disable Default Groups', async () => {
        // create app
        customAppIdLibraryHomeDisableDefaultGroups = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableDefaultGroups,
        });
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHomeDisableDefaultGroups });
        await libraryPage.clickLibraryIcon();
        await since(
            'In disable default groups app,Default Groups shows up in sidebar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await sidebar.getPredefinedSectionItem('Default Groups').isDisplayed())
            .toBe(false);
    });

    it('[TC80057_09] Disable Sort and Search', async () => {
        // create app
        customAppIdLibraryHomeDisableSortAndSearch = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableSortAndSearch,
        });
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHomeDisableSortAndSearch });
        await since(
            'In disable sort and search app, Sort icon shows up in library home is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await librarySort.getSortBox().isDisplayed())
            .toBe(false);
        await since(
            'In disable sort and search app, Filter icon shows up in library home to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryFilter.getFilterIcon().isDisplayed())
            .toBe(false);
        await since(
            'n disable sort and search app, Search shows up in library home is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await quickSearch.getSearchContainer().isDisplayed())
            .toBe(false);
    });

    it('[TC80057_10] Disable Multi Select', async () => {
        // create app
        customAppIdLibraryHomeDisableMultiSelect = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableMultiSelect,
        });
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHomeDisableMultiSelect });
        await since(
            'In disalbe mutli select app, Multi select shows up in library home is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getMultiSelectButton().isDisplayed())
            .toBe(false);

        await libraryPage.openDossierContextMenu(consts.testedDossier.name);
        await since(
            'In disalbe mutli select app, Multi select shows up in context menu is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryPage.getDossierContextMenuItem('Multi-select').isDisplayed())
            .toBe(false);
    });

    it('[TC80057_11] Disable Notification', async () => {
        // create app
        customAppIdLibraryHomeDisableNotification = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableNotification,
        });
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHomeDisableNotification });
        await since(
            'In disalbe notification app, Notification icon shows up in library home is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await notification.getNotificationIcon().isDisplayed())
            .toBe(false);
    });

    it('[TC80057_12] Disable Account', async () => {
        // create app
        customAppIdLibraryHomeDisableAccount = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableAccount,
        });
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHomeDisableAccount });
        await libraryPage.waitForLibraryLoading();
        await since(
            'In disable account app, Account shows up in library home is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await userAccount.getUserAccount().isDisplayed())
            .toBe(false);
        await libraryPage.openDossier(consts.testedDossier.name);
        await since(
            'In disable account app, Account shows up in dossier is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await userAccount.getUserAccount().isDisplayed())
            .toBe(false);
    });

    it('[TC80057_13] Disable TOC and Undo', async () => {
        // create app
        customAppIdLibraryHomeDisableTOCAndUndo = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableTOCAndUndo,
        });
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHomeDisableTOCAndUndo });
        await libraryPage.openDossier(consts.testedDossier.name);
        await dossierPage.waitForDossierLoading();
        // check toc is not there
        await since(
            'In disable TOC and undo app, TOC shows up in dossier is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await toc.getTOCIcon().isDisplayed())
            .toBe(false);
        // check undo redo is not there
        await since(
            'In disable TOC and undo app, Undo shows up in dossier is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getUndoIcon().isDisplayed())
            .toBe(false);
        await since(
            'In disable TOC and undo app, Redo shows up in dossier is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getRedoIcon().isDisplayed())
            .toBe(false);
    });

    it('[TC80057_14] Disable Bookmark and Reset', async () => {
        // create app
        customAppIdLibraryHomeDisableBookmarkAndReset = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableBookmarkAndReset,
        });
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHomeDisableBookmarkAndReset });
        await libraryPage.openDossierInfoWindow(consts.testedDossier.name);
        await since(
            'In disable bookmark and reset app, Reset shows up in infowindow is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getResetButton().isDisplayed())
            .toBe(false);
        await infoWindow.shareDossier();
        await since(
            'In disable bookmark and reset app, share bookmark section shows up when share from infowindow is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await shareDossier.getShareBMSection().isDisplayed())
            .toBe(false);
        await shareDossier.closeDialog();
        await infoWindow.close();

        await libraryPage.openDossierById({
            projectId: consts.testedDossier.project.id,
            dossierId: consts.testedDossier.id,
            applicationId: customAppIdLibraryHomeDisableBookmarkAndReset,
        });
        await since(
            'In disable bookmark and reset app, Bookmark shows up in dossier is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await bookmark.getBookmarkIcon().isDisplayed())
            .toBe(false);
        await since(
            'In disable bookmark and reset app, Reset shows up in dossier is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await reset.getResetButton().isDisplayed())
            .toBe(false);
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await since(
            'In disable bookmark and reset app, share bookmark section shows up when share from dossier is expected to be #{expected}, instead we have #{actual}'
        )
            .expect(await shareDossier.getShareBMSection().isDisplayed())
            .toBe(false);
    });

    it('[TC80057_15] Disable Comment', async () => {
        // create app
        customAppIdLibraryHomeDisableComment = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableComment,
        });
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHomeDisableComment });
        await since('Is Comment displayed to be #{expected}, instead we have #{actual}.')
            .expect(await commentsPage.getCommentsIcon().isDisplayed())
            .toBe(false);
        await since('Is Dossier Comment Count displayed to be #{expected}, instead we have #{actual}.')
            .expect(await libraryPage.getDossierCommentCountIcon().isDisplayed())
            .toBe(false);
        await libraryPage.openDossierInfoWindow(consts.testedDossier.name);
        await since('Is Comment displayed to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.getCommentsInfo().isDisplayed())
            .toBe(false);
        await infoWindow.close();

        await libraryPage.openDossier(consts.testedDossier.name);
        await since('Is Comment displayed to be #{expected}, instead we have #{actual}.')
            .expect(await commentsPage.getCommentsIcon().isDisplayed())
            .toBe(false);
    });

    it('[TC80057_16] Disable Share', async () => {
        // create app
        customAppIdLibraryHomeDisableShare = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableShare,
        });
        await libraryPage.openCustomAppById({ id: customAppIdLibraryHomeDisableShare });
        await libraryPage.openDossierInfoWindow(consts.testedDossier.name);
        await since('In disable share app, Share shows up in infowindow to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.getShareButton().isDisplayed())
            .toBe(false);
        await since(
            'In disable share app, ExportPDF shows up in infowindow is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getExportPDFButton().isDisplayed())
            .toBe(false);
        await since(
            'In disable share app, ExportExcel shows up in infowindow is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getExportExcelButton().isDisplayed())
            .toBe(false);
        await since(
            'In disable share app, DownloadDossier shows up in infowindow is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getDownloadDossierButton().isDisplayed())
            .toBe(false);
        await infoWindow.close();

        await libraryPage.openDossier(consts.testedDossier.name);
        await since(
            'In disable share app, Share shows up in dossier is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await share.getShareIcon().isDisplayed())
            .toBe(false);

        await baseVisualization.clickVisualizationTitle('open in new tab');

        await baseVisualization.hover({
            elem: baseVisualization.getVisualizationMenuButton('open in new tab'),
        });
        await baseVisualization.openVisualizationMenu({
            elem: baseVisualization.getVisualizationMenuButton('open in new tab'),
        });
        await since(
            'In disable share app, Viz Export shows up after linking is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await baseVisualization.isContextMenuOptionPresent({ level: 1, option: 'Export' }))
            .toBe(false);
        await since(
            'In disable share app, Show data shows up after link is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await baseVisualization.isContextMenuOptionPresent({ level: 0, option: 'Show Data' }))
            .toBe(true);
    });

    // it's aimed to test pin panel -> disable toolbar, current steps only check disable toolbar app
    // needs to enhance it using custom app edit api
    // it('[TC80659] Test DE219725', async () => {
    //     await libraryPage.openCustomAppById(config.de219725first);
    //     await libraryPage.waitForLibraryLoading();
    //     await takeScreenshot('TC80659_1', 'disable toolbar_1');
    //     await libraryPage.openCustomAppById(config.de219725second);
    //     await libraryPage.waitForLibraryLoading();
    //     await takeScreenshot('TC80659_2', 'disable toolbar_2');
    //     await libraryPage.openCustomAppById(config.de219725third);
    //     await libraryPage.waitForLibraryLoading();
    //     await takeScreenshot('TC80659_3', 'disable toolbar_3');
    // });
});
