import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import clearUserSnapshots from '../../../api/snapshot/clearUserSnapshots.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import resetBookmarksWithPrompt from '../../../api/resetBookmarksWithPrompt.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import { disableSubscribeToSnapshotCustomAppObj } from '../../../constants/customApp/info.js';
import * as snapshotInfo from '../../../constants/snapshot.js';

describe('Test Document snapshot subscription', () => {
    let {
        loginPage,
        libraryPage,
        share,
        toc,
        subscribe,
        subscriptionDialog,
        dossierPage,
        rsdPage,
        infoWindow,
        bookmark,
        sidebar,
    } = browsers.pageObj1;
    const snapshotTestUser = snapshotInfo.snapshotTestUser;
    const promptDocumentForCity = snapshotInfo.promptDocumentForCity;
    const cubeBasedDocumentForCity = snapshotInfo.cubeBasedDocumentForCity;
    const subscriptionFormats = snapshotInfo.subscriptionFormats;
    const subscriptionSchedules = snapshotInfo.subscriptionSchedules;
    let appIdDisableSnapshot = '';

    beforeAll(async () => {
        await loginPage.login(snapshotTestUser);
        await setWindowSize(browserWindow);
        appIdDisableSnapshot = await createCustomApp({
            credentials: snapshotTestUser,
            customAppInfo: disableSubscribeToSnapshotCustomAppObj,
        });
    });

    beforeEach(async () => {
        await resetDossierState({ credentials: snapshotTestUser, dossier: promptDocumentForCity });
        await resetBookmarksWithPrompt({
            credentials: snapshotTestUser,
            dossier: promptDocumentForCity,
        });
        await clearUserSnapshots({
            credentials: [snapshotTestUser],
        });
        await libraryPage.executeScript('window.localStorage.clear();');
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await clearUserSnapshots({
            credentials: [snapshotTestUser],
        });
        await logoutFromCurrentBrowser();
        await deleteCustomAppList({
            credentials: snapshotTestUser,
            customAppIdList: [appIdDisableSnapshot],
        });
    });

    it('[TC99182_01] create document snapshot subscription by default settings', async () => {
        const subscriptionName = 'TC99182_01 rsd';
        await libraryPage.openDossier(promptDocumentForCity.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await takeScreenshotByElement(subscriptionDialog.getSubscriptionPanel(), 'TC99182_01', 'format is Snapshot');
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.selectSchedule(subscriptionSchedules.allTheTime);
        await subscriptionDialog.createSubscription();
        await subscriptionDialog.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openSidebar();
        await sidebar.openSubscriptions();
        await since('1. The subscription type is expected to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getSubscriptionPropertyBySubscriptionName(subscriptionName, 'Type'))
            .toBe('Email');
        await since('2. The subscription type is expected to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getSubscriptionPropertyBySubscriptionName(subscriptionName, 'Schedule'))
            .toBe(subscriptionSchedules.allTheTime);
        await subscribe.hoverSubscription(subscriptionName);
        await subscriptionDialog.clickEditButtonInSidebar(subscriptionName);
        await subscriptionDialog.waitForSelectedFormatLoaded();
        await since('3. The subscription type is expected to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getSelectedFormat().getText())
            .toBe('Snapshot');
        await subscriptionDialog.clickSidebarCancel();
        await sidebar.openAllSectionList();
        await libraryPage.openDossierInfoWindow(promptDocumentForCity.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since('4. Snapshot name should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotName({}))
            .toBe(subscriptionName);
    });

    it('[TC99182_02] create document snapshot subscription by given bookmark', async () => {
        const subscriptionName = 'TC99182_02 BM';
        const bookmark1 = 'bk-snapshot1';
        const bookmark2 = 'bk-snapshot2';
        await libraryPage.openDossier(promptDocumentForCity.name);
        await bookmark.openPanel();
        await bookmark.addNewBookmark(bookmark1);
        await bookmark.closePanel();
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Layout 1' });
        const selector = rsdPage.findSelectorByKey('W7E11CE6C3735434E9CA134033313DB4F');
        await selector.dropdown.openDropdownAndMultiSelect(['1:Hangzhou']);
        await bookmark.openPanel();
        await bookmark.addNewBookmark(bookmark2);
        await bookmark.closePanel();
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.selectBookmark(bookmark1);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.allTheTime);
        await subscriptionDialog.createSubscription();
        await subscriptionDialog.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openSidebar();
        await sidebar.openSubscriptions();
        await since('1. The subscription name is expected to be #{expected}, instead we have #{actual}')
            .expect(await subscribe.getSubscriptionPropertyBySubscriptionName(subscriptionName, 'Subscription Name'))
            .toBe(subscriptionName);
        await subscribe.hoverSubscription(subscriptionName);
        await subscriptionDialog.clickEditButtonInSidebar(subscriptionName);
        await subscriptionDialog.waitForSelectedBookmarkLoaded();
        await since('2. The subscription bookmark is expected to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getSelectedBookmark().getText())
            .toBe(bookmark1);
        await subscriptionDialog.selectBookmark(bookmark2);
        await subscriptionDialog.clickSidebarSave();
        await subscribe.hoverSubscription(subscriptionName);
        await subscriptionDialog.clickEditButtonInSidebar(subscriptionName);
        await subscriptionDialog.waitForSelectedBookmarkLoaded();
        await since('3. The subscription bookmark is expected to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getSelectedBookmark().getText())
            .toBe(bookmark2);
        await subscriptionDialog.clickSidebarSave();
    });

    it('[TC99182_03] trigger document snapshot by run now', async () => {
        const subscriptionName = 'TC99182_03 run now';
        await libraryPage.openDossier(promptDocumentForCity.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.allTheTime);
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openSidebar();
        await sidebar.openSubscriptions();
        await subscribe.hoverSubscription(subscriptionName);
        await subscribe.clickRunNowInSubscriptionListByName(subscriptionName);
        await sidebar.openAllSectionList();
        await libraryPage.openDossierInfoWindow(promptDocumentForCity.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since('1. Snapshot name should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotName({}))
            .toBe(subscriptionName);
    });

    it('[TC99182_04] check format in info window subscriptin management', async () => {
        const subscriptionName = 'TC99182_04 format';
        await libraryPage.openDossier(promptDocumentForCity.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await since('1. Subscription format should be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getFormatDropdownOptionValues())
            .toEqual([subscriptionFormats.snapshot]);
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(promptDocumentForCity.name);
        await libraryPage.infoWindow.clickManageSubscriptionsButton();
        await takeScreenshotByElement(
            subscribe.getInfoWindowSubscriptionPanel(),
            'TC99182_04_01',
            'Document Snapshot subscription in info window'
        );
        await subscribe.clickInfoWindowEdit();
        await subscriptionDialog.waitForSelectedFormatLoaded();
        await subscriptionDialog.waitForSelectedBookmarkLoaded();
        await takeScreenshotByElement(
            subscriptionDialog.getSubscriptionPanel(),
            'TC99182_04_02',
            'Edit document snapshot subscription in info window'
        );
        await since('2. RSD Subscription format in info window should be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getFormatDropdownOptionValues())
            .toEqual([subscriptionFormats.snapshot]);
    });

    it('[TC99182_05] subscribe document snapshot to others', async () => {
        const subscriptionName = 'TC99182_05 subscribe to others';
        await libraryPage.openDossier(promptDocumentForCity.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.waitForSelectedFormatLoaded();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.inputRecipient('');
        await subscriptionDialog.tabForward();
        await subscriptionDialog.inputRecipient('email');
        await subscriptionDialog.selectRecipient(['snapshot_email']);
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(promptDocumentForCity.name);
        await libraryPage.infoWindow.clickManageSubscriptionsButton();
        await subscribe.clickInfoWindowEdit();
        await takeScreenshotByElement(
            subscriptionDialog.getSubscriptionPanel(),
            'TC99182_05_01',
            'subscribe RSD to others'
        );
    });

    it('[TC99182_06] no snapshot when snapshot is off in custom app settings', async () => {
        const subscriptionName = 'TC99182_06 Snapshot';
        await libraryPage.openCustomAppById({ id: appIdDisableSnapshot });
        await libraryPage.openDossier(promptDocumentForCity.name);
        await share.openSharePanel();
        await since('1. Subscribe button is expected to be #{expected}, instead we have #{actual}.')
            .expect(await share.getSubscribeButton().isDisplayed())
            .toBe(false);
        await libraryPage.openDefaultApp();
        await libraryPage.openDossier(promptDocumentForCity.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(promptDocumentForCity.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since('2. isDisplay of snapshot section should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.snapshot.isSnapshotSectionVisible())
            .toBe(true);
        await libraryPage.openCustomAppById({ id: appIdDisableSnapshot });
        await libraryPage.openDossierInfoWindow(promptDocumentForCity.name);
        await since('3. isDisplay of snapshot section should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.snapshot.isSnapshotSectionVisible())
            .toBe(true);
        await libraryPage.infoWindow.clickManageSubscriptionsButton();
        await subscribe.clickInfoWindowEdit(false);
        await subscriptionDialog.waitForSelectedBookmarkLoaded();
        await takeScreenshotByElement(
            subscriptionDialog.getSubscriptionPanel(),
            'TC99182_06_01',
            'snapshot field empty'
        );
        await subscriptionDialog.clickCloseButton();
    });

    it('[TC99182_07] unsubscribe document snapshot subscription', async () => {
        const subscriptionName = 'TC99182_07 unsubscribe';
        await libraryPage.openDossier(promptDocumentForCity.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(promptDocumentForCity.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await libraryPage.infoWindow.clickManageSubscriptionsButton();
        await takeScreenshotByElement(
            subscribe.getInfoWindowSubscriptionPanel(),
            'TC99182_07_01',
            'Snapshot subscription in info window'
        );
        await subscriptionDialog.clickUnsubscribe(subscriptionName);
        await subscriptionDialog.clickUnsubscribeYes();
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since('1. Snapshot name should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotName({}))
            .toBe(subscriptionName);
        await since('2. Disabled manage subscription button should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getNoSubscriptionsButton().isDisplayed())
            .toBe(true);
    });

    it('[TC99182_08] run snapshot subscription on report based document', async () => {
        const subscriptionName = 'TC99182_08 report base';
        const subscriptionNameUpdated = 'TC99182_08 new';
        await libraryPage.openDossier(promptDocumentForCity.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(promptDocumentForCity.name);
        await infoWindow.waitForSnapshotSection();
        await since('1. total snapshots of report based dashboard should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.snapshot.getSnapshotsItemCount())
            .toBe(1);
        await infoWindow.clickManageSubscriptionsButton();
        await subscriptionDialog.clickInfoWindowEdit();
        await subscriptionDialog.updateSubscriptionName(subscriptionNameUpdated);
        await subscriptionDialog.clickSave();
        await subscriptionDialog.clickInWindowRunNow();
        await subscriptionDialog.exitInfoWindowPDFSettingsMenu();
        await infoWindow.waitForSnapshotSection();
        await since('2. total snapshots of report based dashboard should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.snapshot.getSnapshotsItemCount())
            .toBe(2);
        await since('3. Latest snapshot name should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotName({}))
            .toBe(subscriptionNameUpdated);
        await since('4. Previous snapshot name should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotName({ index: 1 }))
            .toBe(subscriptionName);
    });

    it('[TC99182_09] run snapshot subscription on cube based document', async () => {
        await resetDossierState({ credentials: snapshotTestUser, dossier: cubeBasedDocumentForCity });
        await resetBookmarks({
            credentials: snapshotTestUser,
            dossier: cubeBasedDocumentForCity,
        });
        const subscriptionName = 'TC99182_09 cube base';
        const subscriptionNameUpdated = 'TC99182_09 new';
        await libraryPage.openDossier(cubeBasedDocumentForCity.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(cubeBasedDocumentForCity.name);
        await infoWindow.waitForSnapshotSection();
        await since('1. total snapshots of cube based dashboard should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.snapshot.getSnapshotsItemCount())
            .toBe(1);
        await since('2. Latest snapshot name should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotName({}))
            .toBe(subscriptionName);
        await infoWindow.clickManageSubscriptionsButton();
        await subscriptionDialog.clickInfoWindowEdit();
        await subscriptionDialog.updateSubscriptionName(subscriptionNameUpdated);
        await subscriptionDialog.clickSave();
        await subscriptionDialog.sleep(4000);
        await subscriptionDialog.clickInWindowRunNow();
        await subscribe.exitInfoWindowPDFSettingsMenu();
        await infoWindow.close();
        await libraryPage.openDossierInfoWindow(cubeBasedDocumentForCity.name);
        await infoWindow.waitForSnapshotSection();
        await since('3. total snapshots of cube based dashboard should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.snapshot.getSnapshotsItemCount())
            .toBe(1);
        await since('4. Latest snapshot name should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotName({}))
            .toBe(subscriptionNameUpdated);
    });

    it('[TC99182_10] document not allow to schedule', async () => {
        await resetDossierState({ credentials: snapshotTestUser, dossier: snapshotInfo.rwdNoSchedule });
        await resetBookmarks({
            credentials: snapshotTestUser,
            dossier: snapshotInfo.rwdNoSchedule,
        });
        await libraryPage.openDossier(snapshotInfo.rwdCustomizedSchedule.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await since('1. Subscription format under time schedule should be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getScheduleDropdownOptionValues())
            .toEqual(['All', 'First of Month']);
        await subscriptionDialog.toggleScheduleTab();
        await since('2. Subscription format under event schedule should be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getScheduleDropdownOptionValues())
            .toEqual(['All', 'Books Closed']);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.clickCloseButton();
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(snapshotInfo.rwdNoSchedule.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await since(`2. Subscribe button is expected to be #{expected}, instead we have #{actual}`)
            .expect(await subscriptionDialog.getSubscribeButton().isEnabled())
            .toBe(false);
        await subscriptionDialog.clickCloseButton();
    });
});
