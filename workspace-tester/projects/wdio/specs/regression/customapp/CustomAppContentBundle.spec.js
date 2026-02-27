import setWindowSize from '../../../config/setWindowSize.js';
import resetUserLanguage from '../../../api/resetUserLanguage.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import * as consts from '../../../constants/customApp/info.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import resetOnboarding from '../../../api/resetOnboarding.js';

describe('Custom App - Content bundle behaviors.', () => {
    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        dossierPage,
        libraryPage,
        share,
        shareDossier,
        notification,
        userAccount,
        bookmark,
        toc,
        sidebar,
        infoWindow,
        quickSearch,
        fullSearch,
        libraryAuthoringPage,
        userPreference,
    } = browsers.pageObj1;

    let customAppLibraryHomeDisableNewContentId,
        customAppLibraryHomeDisableNewContentLongNameId,
        customAppLibraryHomeAllowNewContentId,
        customAppLibraryHomeAllowNewContentReportId,
        customAppLibraryHomeAllowNewContentiOSId,
        customAppLibraryHomeDisableNewContentiOSId,
        customAppLibraryHomeDisableNewContentReportId,
        customAppLibraryHomeDisableNewContentSwitchAppId,
        customAppLibraryHomeId;

    beforeAll(async () => {
        await setWindowSize(browserWindow);

        await resetUserLanguage({
            userId: [consts.loginCredentialContent1Id],
            credentials: consts.loginCredentialContent1,
        });
        customAppLibraryHomeDisableNewContentLongNameId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableNewContentLongName,
        });
        customAppLibraryHomeDisableNewContentReportId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableNewContentReport,
        });
    });

    beforeEach(async () => {
        if (await dossierPage.isAccountIconPresent()) {
            await dossierPage.openUserAccountMenu();
            await dossierPage.logout();
            await dossierPage.sleep(2000);
        } else {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
    });

    afterAll(async () => {
        await deleteCustomAppList({
            credentials: consts.mstrUser.credentials,
            customAppIdList: [
                customAppLibraryHomeDisableNewContentId,
                customAppLibraryHomeDisableNewContentLongNameId,
                customAppLibraryHomeAllowNewContentId,
                customAppLibraryHomeAllowNewContentReportId,
                customAppLibraryHomeAllowNewContentiOSId,
                customAppLibraryHomeDisableNewContentiOSId,
                customAppLibraryHomeDisableNewContentReportId,
                customAppLibraryHomeDisableNewContentSwitchAppId,
                customAppLibraryHomeId,
            ],
        });
        await resetUserLanguage({
            userId: [consts.loginCredentialContent1Id],
            credentials: consts.loginCredentialContent1,
        });
    });

    it('[TC79314_1] Share dossier and bookmark.', async () => {
        await loginPage.login(consts.loginCredentialCollab2);
        await libraryPage.openCustomAppById({ id: customAppLibraryHomeDisableNewContentLongNameId });
        await libraryPage.waitForLibraryLoading();

        // clean notifications for collab
        await notification.openPanel();
        if ((await notification.getClearAllStatus()) == false) {
            await notification.clearAllMsgs();
        }

        // switch to user collab1
        await libraryPage.switchUser(consts.loginCredentialCollab1);

        // collab1 share Empty Dossier 2 with bookmark to collab2
        await shareDossier.shareAllBookmarksFromIWToUser(consts.emptyDossier2, consts.loginCredentialCollab2.username);

        // switch to user collab2
        await libraryPage.switchUser(consts.loginCredentialCollab2);

        // open notification panel and check the notification item containing Empty Dossier 2 has no buttons for adding dossier to library or accept the bookmark
        await notification.openPanel();
        await since(
            'When disable new content, Ignore button in notificaiton panel shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await notification.getIgnoreByIndex(0).isDisplayed())
            .toBe(false);

        // click the notification to open the Empty Dossier 2, the bookmark is applied, and there is no "Add to Library" banner
        await notification.openMsgByIndex(0);
        // ------ check here ------------------
        await since(
            'when disable new content, Bookmark name applied to dossier is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await bookmark.isBookmarkLabelPresent())
            .toBe(true);
        await since(
            'when disable new content, After apply bm, Add to Library banner shows up in dossier is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getAddToLibrary().isDisplayed())
            .toBe(false);
    });

    it('[TC79314_2] Default groups in the side bar.', async () => {
        await loginPage.login(consts.loginCredentialCollab1);
        await libraryPage.openCustomAppById({ id: customAppLibraryHomeDisableNewContentLongNameId });
        await libraryPage.waitForLibraryLoading();
        // open side bar
        await libraryPage.clickLibraryIcon();

        // check the content bundle section title name
        await sidebar.hoverOnContentBundleTitle();

        // check the content bundle list to make sure it has two bundles: BundleEmptyDossierForCollab1AndCollab2 and BundleEmptyDossier2ForCollab1.
        await since(
            'The number of content bundle for user collab1 is expected be #{expected}, instead we have #{actual}.'
        )
            .expect(await sidebar.getGroupSections().length)
            .toBe(2);

        // switch to user collab2
        await libraryPage.switchUser(consts.loginCredentialCollab2);

        // open side bar
        await libraryPage.clickLibraryIcon();

        // check the content bundle list to make sure it has only one bundle: BundleEmptyDossierForCollab1AndCollab2.
        await since(
            'The number of content bundle for user collab2 is expected be #{expected}, instead we have #{actual}.'
        )
            .expect(await sidebar.getGroupSections().length)
            .toBe(1);
    });

    it('[TC79314_3] Disable global search related UI.', async () => {
        await loginPage.login(consts.loginCredentialCollab1);
        await libraryPage.openCustomAppById({ id: customAppLibraryHomeDisableNewContentLongNameId });
        await libraryPage.waitForLibraryLoading();
        // Open dossier info window, and there should not be the recommended dossiers section
        await infoWindow.expand(consts.emptyDossier);
        await since('Related Contents shows up in library is expected to be #{expected}, instead we have #{actual}.')
            .expect(await infoWindow.getRecommendationsList().isDisplayed())
            .toBe(false);
        await infoWindow.close();

        // input "dossier" into the search text box, the suggestion list will only contain the "dossier", no recommended dossier names
        await quickSearch.openSearchSlider();
        await quickSearch.inputText('dossier');
        await quickSearch.waitForSuggestionResponse();
        await since('suggested items shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await quickSearch.getSearchSuggestionTextItems().length)
            .toBe(1);
        await quickSearch.clearInput();

        // click enter with search keyword "dossier", there should be no "All" section shown
        await quickSearch.inputTextAndSearch('dossier');
        await dossierPage.sleep(1000);
        await since('My Library tab shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await fullSearch.getMyLibraryTab().isDisplayed())
            .toBe(true);
        console.log(await fullSearch.getMyLibraryTab().isDisplayed());
        await since('All tab shows up is expected to be #{expected}, instead we have #{actual}.')
            .expect(await fullSearch.getAllTab().isDisplayed())
            .toBe(false);
    });

    it('[TC87909_1] Allow New Content.', async () => {
        // create app
        customAppLibraryHomeAllowNewContentId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeAllowNewContent,
        });
        await loginPage.login(consts.loginCredentialContent1);
        await libraryPage.removeDossierFromLibrary(consts.loginCredentialContent1, consts.baseDossier);
        await libraryPage.openCustomAppById({ id: customAppLibraryHomeAllowNewContentId });
        await libraryPage.waitForLibraryLoading();
        await since(
            'When allow new content, new dossier icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryAuthoringPage.getNewDossierIcon().isDisplayed())
            .toBe(true);

        // check info window of dossier within content group
        await infoWindow.expand(consts.autoAndroid2);
        await since(
            'When allow new content, Related Content shows up in infowindow is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getRecommendationsList().isDisplayed())
            .toBe(true);
        await since(
            'When allow new content, delete button shows up in infowindow to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getRemoveButton().isDisplayed())
            .toBe(false);
        await infoWindow.favoriteDossier(consts.autoAndroid2);
        // updated selected function here
        await since(
            'When allow new content, Favorite selected in info window is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.isFavoritesBtnSelected())
            .toBe(true);
        await infoWindow.close();
        await libraryPage.openDossier(consts.autoAndroid2);
        //favorite in toolbar
        await since(
            'When allow new content, Favorite shows up in toolbar is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.isFavoriteSelected())
            .toBe(true);

        //share bm
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark(['content']);
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.addMessage('test shared bookmark');
        await shareDossier.searchRecipient(consts.loginCredentialContent2.username);
        await shareDossier.selectRecipients([consts.loginCredentialContent2.username]);
        await shareDossier.shareDossier();
        await dossierPage.goToLibrary();

        //remove favorite
        await infoWindow.expand(consts.autoAndroid2);
        await infoWindow.removeFavorite();

        // search "BaseDossier"
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(consts.baseDossier.name);
        await fullSearch.waitForSearchLoading();
        await since(
            'When allow new content, My Library tab shows up after search is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.getMyLibraryTab().isDisplayed())
            .toBe(true);
        await since(
            'When allow new content, All tab shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.getAllTab().isDisplayed())
            .toBe(true);
        await fullSearch.clickAllTab();
        await fullSearch.openDossierFromSearchResults(consts.baseDossier.name);
        await since(
            'When allow new content, dossier opened from full search is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await dossierPage.getDossierView().isDisplayed())
            .toBe(true);
        await dossierPage.addToLibrary();
        await dossierPage.favorite();

        //remove dossier
        await dossierPage.goToLibrary();
        await infoWindow.expand(consts.baseDossier.name);
        await since(
            'When allow new content, favorite selected in infowindow is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.isFavoritesBtnSelected())
            .toBe(true);
        await infoWindow.removeDossier();

        //recipient
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await loginPage.login(consts.loginCredentialContent2);
        await libraryPage.removeDossierFromLibrary(consts.loginCredentialContent2, consts.baseDossier);
        await libraryPage.refresh();
        await notification.openPanel();
        // await notification.waitForToolbar(0);
        console.log(await notification.getActionBtnTextInsideMsg(0));
        await since(
            'When allow new content, open shared notification, Current Action button for shared bookmark in push notification panel is expected be #{expected}, instead we have #{actual}'
        )
            .expect(await notification.getActionBtnTextInsideMsg(0))
            .toBe('Add to Library');
        await notification.clearAllMsgs();
    });

    it('[TC87909_2] Limit New Content.', async () => {
        // create app
        customAppLibraryHomeDisableNewContentId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableNewContent,
        });
        await loginPage.login(consts.loginCredentialContent1);
        await libraryPage.openCustomAppById({ id: customAppLibraryHomeDisableNewContentId });
        await libraryPage.waitForLibraryLoading();
        await since(
            'When open disable new content app, new dossier icon shows up is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await libraryAuthoringPage.getNewDossierIcon().isDisplayed())
            .toBe(false);

        // check info window of dossier within content group
        await infoWindow.expand(consts.autoAndroid2);
        await since(
            'when open disable new content app, Related Content shows up in info window is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getRecommendationsList().isDisplayed())
            .toBe(false);
        await since(
            'when open disable new content app, delete button shows up in info window in to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getRemoveButton().isDisplayed())
            .toBe(false);
        await infoWindow.favoriteDossier(consts.autoAndroid2);
        await since(
            'when open disable new content app, Favorite selected in info window is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.isFavoritesBtnSelected())
            .toBe(true);
        await infoWindow.close();
        await libraryPage.openDossier(consts.autoAndroid2);
        //favorite in TOC
        await toc.openMenu();
        await since(
            'when open disable new content app, Favorite icon shows up in toc menu to be #{expected}, instead we have #{actual}.'
        )
            .expect(await toc.isFavoritesIconSelected())
            .toBe(true);
        await toc.closeMenu({ icon: 'close' });
        //share bm
        await share.openSharePanel();
        await share.openShareDossierDialog();
        await shareDossier.includeBookmark();
        await shareDossier.openBMList();
        await shareDossier.selectSharedBookmark(['content']);
        await shareDossier.closeShareBookmarkDropDown();
        await shareDossier.addMessage('test shared bookmark');
        await shareDossier.searchRecipient(consts.loginCredentialContent2.username);
        await shareDossier.selectRecipients([consts.loginCredentialContent2.username]);
        await shareDossier.shareDossier();
        await dossierPage.goToLibrary();

        //remove favorite
        await infoWindow.expand(consts.autoAndroid2);
        await infoWindow.removeFavorite();

        // search "BaseDossier"
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(consts.baseDossier.name);
        await since(
            'when open disable new content app, Library tab shows up in result list is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.getMyLibraryTab().isDisplayed())
            .toBe(true);
        await since(
            'when open disable new content app,  All tab shows up in result list to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.getAllTab().isDisplayed())
            .toBe(false);
        await fullSearch.backToLibrary();

        //receipient
        await libraryPage.openUserAccountMenu();
        await libraryPage.logout();
        await libraryPage.switchUser(consts.loginCredentialContent2);
        await notification.openPanel();
        await since(
            'Current Action button for shared bookmark in push notification panel is expected be #{expected}, instead we have #{actual}'
        )
            .expect(await notification.getBookmarkToolbarInsideMsg(0).isDisplayed())
            .toBe(false);
        await notification.clearAllMsgs();
    });

    it('[TC87909_3] Switch App', async () => {
        // create app
        customAppLibraryHomeAllowNewContentiOSId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeAllowNewContentiOS,
        });
        customAppLibraryHomeDisableNewContentiOSId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableNewContentiOS,
        });
        await loginPage.login(consts.loginCredentialContent1);
        await libraryPage.waitForLibraryLoading();
        await userAccount.switchCustomApp(consts.libraryHomeAllowNewContentiOS.name);

        // check info window of dossier within content group
        await infoWindow.expand(consts.autoAndroid2);
        await since(
            'After switch app allow to new content, Related Content shows up in infowindow is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getRecommendationsList().isDisplayed())
            .toBe(true);
        await since(
            'After switch app to allow new content, delete button shows up in infowindow is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getRemoveButton().isDisplayed())
            .toBe(false);
        await infoWindow.close();
        // ----- create new app here ----------------------
        await userAccount.switchCustomApp(consts.libraryHomeDisableNewContentiOS.name);
        await infoWindow.expand(consts.autoAndroid2);
        // --------------------------------
        await since(
            'After switch app do disable add new content, related content shows up in infowindow is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getRecommendationsList().isDisplayed())
            .toBe(false);
        await since(
            'After switch app do disable add new content, delete button shows up in infowindow is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getRemoveButton().isDisplayed())
            .toBe(false);
        await infoWindow.close();
        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch(consts.baseDossier.name);
        await since(
            'After switch app do disable add new content, All tab shows up in search results is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.getAllTab().isDisplayed())
            .toBe(false);
    });

    it('[TC88819_1] Report in content groups when switch between custom app and default app', async () => {
        // create app
        customAppLibraryHomeDisableNewContentSwitchAppId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeDisableNewContentSwitchApp,
        });
        await loginPage.login(consts.loginCredentialContent3);
        await libraryPage.waitForLibraryLoading();

        await since(`All tab content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('All'))
            .toBe(11);
        await since(
            `The presence of report ${consts.reports.finalReport} is supposed to be #{expected}, instead we have #{actual}`
        )
            .expect(await libraryPage.isItemViewable(consts.reports.finalReport))
            .toBe(true);

        // create new app here
        await userAccount.switchCustomApp(consts.libraryHomeDisableNewContentReport.name);
        await libraryPage.waitForLibraryLoading();
        await libraryPage.sleep(1000);
        await since(`All tab content count should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.getGroupCountFromTitle('All'))
            .toBe(3);
        await since(
            `The presence of report ${consts.reports.performanceReport} is supposed to be #{expected}, instead we have #{actual}`
        )
            .expect(await libraryPage.isItemViewable(consts.reports.performanceReport))
            .toBe(true);

        // create new app here
        await userAccount.switchCustomApp(consts.libraryHomeDisableNewContentSwitchApp.name);
        await libraryPage.waitForLibraryLoading();

        await since(`Custom app Library is empty should be #{expected}, while we get #{actual}`)
            .expect(await libraryPage.isLibraryEmpty())
            .toBe(true);
    });

    it('[TC88819_2] Disable UI for Report in content groups and limit new contents', async () => {
        await resetOnboarding({
            credentials: consts.loginCredentialContent3,
            value: 0,
        });
        await loginPage.login(consts.loginCredentialContent3);
        await libraryPage.waitForLibraryLoading();
        // create new app here
        await userAccount.switchCustomApp(consts.libraryHomeDisableNewContentReport.name);
        await libraryPage.waitForLibraryLoading();

        await infoWindow.expand(consts.reports.finalReport);
        await since(
            'When open app with disable new content for reports in content group, delete button shows up in infowindow is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getRemoveButton().isDisplayed())
            .toBe(false);
        await infoWindow.close();

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('Performance');
        await since(
            'When open app with disable new content for reports in content group, All tab shows up in result list is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.getAllTab().isDisplayed())
            .toBe(false);
    });

    it('[TC88819_3] Allow new contents for reports in content groups', async () => {
        // create app
        customAppLibraryHomeAllowNewContentReportId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHomeAllowNewContentReport,
        });
        await resetOnboarding({
            credentials: consts.loginCredentialContent3,
            value: 0,
        });
        await loginPage.login(consts.loginCredentialContent3);
        await libraryPage.waitForLibraryLoading();

        // --- create new app here --------
        await userAccount.switchCustomApp(consts.libraryHomeAllowNewContentReport.name);
        await libraryPage.waitForLibraryLoading();

        await infoWindow.expand(consts.reports.finalReport);
        await since(
            'When open app with allow new contents for reports, delete button shows up in info window to be #{expected}, instead we have #{actual}.'
        )
            .expect(await infoWindow.getRemoveButton().isDisplayed())
            .toBe(false);
        await infoWindow.close();

        await quickSearch.openSearchSlider();
        await quickSearch.inputTextAndSearch('Performance');
        await since(
            'When open app with allow new contents for reports, All tab shows up in search result list is expected to be #{expected}, instead we have #{actual}.'
        )
            .expect(await fullSearch.getAllTab().isDisplayed())
            .toBe(true);
    });

    it('[TC79314_4] Verify i18n for default groups', async () => {
        // create app
        customAppLibraryHomeId = await createCustomApp({
            credentials: consts.mstrUser.credentials,
            customAppInfo: consts.libraryHome,
        });
        await loginPage.login(consts.loginCredentialContent1);
        await libraryPage.openCustomAppById({ id: customAppLibraryHomeId });
        await libraryPage.waitForLibraryLoading();
        // Open dossier info window, and there should not be the recommended dossiers section
        await libraryPage.openUserAccountMenu();
        await libraryPage.openPreferencePanel();
        await userPreference.openPreferenceList('My Language');
        await userPreference.changePreference('My Language', 'Chinese (Simplified)');
        await userPreference.savePreference();
        await libraryPage.logout();
        await loginPage.login(consts.loginCredentialContent1);
        await libraryPage.waitForLibraryLoading();
        // check default groups name
        await libraryPage.clickLibraryIcon();
        // let title = await sidebar.getDefaultGroupsTitle();
        await since('Default Groups name should be translated to #{expected}, while we get #{actual}')
            .expect(await sidebar.getDefaultGroupsTitle())
            .toBe('默认组');
    });
});
