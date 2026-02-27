import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import clearUserSnapshots from '../../../api/snapshot/clearUserSnapshots.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import { disableSubscribeToSnapshotCustomAppObj } from '../../../constants/customApp/info.js';
import * as snapshotInfo from '../../../constants/snapshot.js';
import { getRequestBody } from '../../../constants/customApp/bot.js';

describe('Test Snapshot subscription', () => {
    let { loginPage, libraryPage, share, subscribe, subscriptionDialog, dossierPage, infoWindow, bookmark, sidebar } = browsers.pageObj1;
    const snapshotTestUser = snapshotInfo.snapshotTestUser;
    const testCityDashboard = snapshotInfo.testCityDashboard;
    const officeRoyaleSalesDashboard = snapshotInfo.officeRoyaleSales;
    const subscriptionFormats = snapshotInfo.subscriptionFormats;
    const expectedFormats = Object.values(subscriptionFormats);
    const subscriptionSchedules = snapshotInfo.subscriptionSchedules;
    let appIdDisableSnapshot = '';
    let appIdWithoutSnapshot = '';
    const customAppObjWithoutSnapshot = getRequestBody({
        name: 'without snapshot',
    });

    beforeAll(async () => {
        await loginPage.login(snapshotTestUser);
        await setWindowSize(browserWindow);
        appIdDisableSnapshot = await createCustomApp({
            credentials: snapshotTestUser,
            customAppInfo: disableSubscribeToSnapshotCustomAppObj,
        });
        appIdWithoutSnapshot = await createCustomApp({
            credentials: snapshotTestUser,
            customAppInfo: customAppObjWithoutSnapshot,
        });
    });

    beforeEach(async () => {
        await resetBookmarks({
            credentials: snapshotTestUser,
            dossier: testCityDashboard,
        });
        await resetBookmarks({
            credentials: snapshotTestUser,
            dossier: officeRoyaleSalesDashboard,
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
            customAppIdList: [appIdDisableSnapshot, appIdWithoutSnapshot],
        });
    });

    it('[TC97771_01] create snapshot subscription by default settings', async () => {
        const subscriptionName = 'TC97771_01 Snapshot Subscription';
        await libraryPage.openDossier(testCityDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.allTheTime);
        await takeScreenshotByElement(
            subscriptionDialog.getSubscriptionPanel(),
            'TC97771_01',
            'SubscriptionPanel by format is Snapshot'
        );
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
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
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since('4. Snapshot name should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotName({}))
            .toBe(subscriptionName);
    });

    it('[TC97771_02] create snapshot subscription by given bookmark', async () => {
        const subscriptionName = 'TC97771_02 Snapshot Subscription';
        const bookmark1 = 'bk-snapshot1';
        const bookmark2 = 'bk-snapshot2';
        await libraryPage.openDossier(testCityDashboard.name);
        await bookmark.openPanel();
        await bookmark.addNewBookmark(bookmark1);
        await bookmark.addNewBookmark(bookmark2);
        await bookmark.closePanel();
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.selectBookmark(bookmark1);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
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

    it('[TC97771_03] trigger snapshot by run subscription now', async () => {
        const subscriptionName = 'TC97771_03 trigger snapshot';
        await libraryPage.openDossier(testCityDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openSidebar();
        await sidebar.openSubscriptions();
        await subscribe.hoverSubscription(subscriptionName);
        await subscribe.clickRunNowInSubscriptionListByName(subscriptionName);
        await sidebar.openAllSectionList();
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since('1. Snapshot name should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotName({}))
            .toBe(subscriptionName);
    });

    it('[TC97771_04] check format in info window subscriptin management', async () => {
        const subscriptionName = 'TC97771_04 check format';
        await libraryPage.openDossier(testCityDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await libraryPage.infoWindow.clickManageSubscriptionsButton();
        await takeScreenshotByElement(
            subscriptionDialog.getInfoWindowSubscriptionPanel(),
            'TC97771_04_01',
            'Snapshot subscription in info window'
        );
        await subscriptionDialog.clickInfoWindowEdit();
        await subscriptionDialog.waitForSelectedFormatLoaded();
        await subscriptionDialog.waitForSelectedBookmarkLoaded();
        await takeScreenshotByElement(
            subscriptionDialog.getSubscriptionPanel(),
            'TC97771_04_02',
            'Edit snapshot subscription in info window'
        );
        await subscriptionDialog.selectFormat(subscriptionFormats.pdf);
        await subscriptionDialog.clickSave();
        await subscriptionDialog.clickInfoWindowEdit();
        await subscriptionDialog.waitForSelectedFormatLoaded();
        await subscriptionDialog.waitForSelectedBookmarkLoaded();
        await takeScreenshotByElement(
            subscriptionDialog.getSubscriptionPanel(),
            'TC97771_04_03',
            'Edit pdf subscription in info window'
        );
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.clickSave();
        await subscriptionDialog.clickInfoWindowEdit();
        await subscriptionDialog.waitForSelectedFormatLoaded();
        await subscriptionDialog.waitForSelectedBookmarkLoaded();
        await takeScreenshotByElement(
            subscriptionDialog.getSubscriptionPanel(),
            'TC97771_04_04',
            'Save as snapshot subscription in info window'
        );
    });

    it('[TC97771_05] subscribe snapshot to others', async () => {
        const subscriptionName = 'TC97771_05 subscribe to others';
        await libraryPage.openDossier(testCityDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.inputRecipient('');
        await subscriptionDialog.tabForward();
        await subscriptionDialog.inputRecipient('email');
        await subscriptionDialog.selectRecipient(['snapshot_email']);
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await libraryPage.infoWindow.clickManageSubscriptionsButton();
        await subscribe.clickInfoWindowEdit();
        await subscriptionDialog.waitForSelectedFormatLoaded();
        await subscriptionDialog.waitForSelectedBookmarkLoaded();
        await takeScreenshotByElement(
            subscriptionDialog.getSubscriptionPanel(),
            'TC97771_05_01',
            'subscribe to others'
        );
    });

    it('[TC97771_06] no snapshot when snapshot is off in custom app settings', async () => {
        const subscriptionName = 'TC97771_06 Snapshot';
        await libraryPage.openCustomAppById({ id: appIdDisableSnapshot });
        await libraryPage.openDossier(testCityDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await since('1. Subscription format should #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getFormatDropdownOptionValues())
            .toEqual(['Excel', 'CSV', 'PDF']);
        await libraryPage.openDefaultApp();
        await libraryPage.openDossier(testCityDashboard.name);
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
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since('2. isDisplay of snapshot section should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.snapshot.isSnapshotSectionVisible())
            .toBe(true);
        await libraryPage.openCustomAppById({ id: appIdDisableSnapshot });
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await since('3. isDisplay of snapshot section should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.snapshot.isSnapshotSectionVisible())
            .toBe(true);
    });

    it('[TC97771_07] show snapshot when custom app object without snapshot setting', async () => {
        await libraryPage.openCustomAppById({ id: appIdWithoutSnapshot });
        await libraryPage.openDossier(testCityDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await since('1. Subscription format should #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getFormatDropdownOptionValues())
            .toEqual(expectedFormats);
    });

    it('[TC97771_08] edit snapshot subscription under custom apps disable snapshot', async () => {
        const subscriptionName = 'TC97771_08 edit snapshot';
        await libraryPage.openDossier(testCityDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await libraryPage.openCustomAppById({ id: appIdDisableSnapshot });
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await libraryPage.infoWindow.clickManageSubscriptionsButton();
        await takeScreenshotByElement(
            subscribe.getInfoWindowSubscriptionPanel(),
            'TC97771_08_01',
            'Snapshot subscription in info window under custom app disable snapshot'
        );
        await subscribe.clickInfoWindowEdit(false);
        await subscriptionDialog.waitForSelectedBookmarkLoaded();
        await takeScreenshotByElement(
            subscriptionDialog.getSubscriptionPanel(),
            'TC97771_08_02',
            'Edit snapshot subscription in info window under custom app disable snapshot'
        );
        await libraryPage.openCustomAppById({ id: appIdDisableSnapshot });
        await libraryPage.openSidebar();
        await sidebar.openSubscriptions();
        await subscribe.hoverSubscription(subscriptionName);
        await subscriptionDialog.clickEditButtonInSidebar(subscriptionName);
        await since('1. The subscription type is expected to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getSelectedFormat().getText())
            .toBe('');
        await subscriptionDialog.selectFormat('Excel');
        await since('2. Subscription format should #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getFormatDropdownOptionValues())
            .toEqual(['Excel', 'CSV', 'PDF']);
        await subscriptionDialog.clickSidebarSave();
        await subscribe.hoverSubscription(subscriptionName);
        await subscriptionDialog.clickEditButtonInSidebar(subscriptionName);
        await subscriptionDialog.waitForSelectedFormatLoaded();
        await since('3. The updated subscription type is expected to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getSelectedFormat().getText())
            .toBe('Excel');
        await since('4. Subscription format should #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getFormatDropdownOptionValues())
            .toEqual(['Excel', 'CSV', 'PDF']);
        await subscriptionDialog.clickSidebarCancel();
        await libraryPage.openDefaultApp();
        await libraryPage.openSidebar();
        await sidebar.openSubscriptions();
        await subscribe.hoverSubscription(subscriptionName);
        await subscriptionDialog.clickEditButtonInSidebar(subscriptionName);
        await subscriptionDialog.waitForSelectedFormatLoaded();
        await since('5. The subscription type is expected to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getSelectedFormat().getText())
            .toBe('Excel');
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await since('6. Subscription format should #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getFormatDropdownOptionValues())
            .toEqual(expectedFormats);
        await subscriptionDialog.clickSidebarSave();
        await subscribe.hoverSubscription(subscriptionName);
        await subscriptionDialog.clickEditButtonInSidebar(subscriptionName);
        await subscriptionDialog.waitForSelectedFormatLoaded();
        await since('7. The subscription type is expected to be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getSelectedFormat().getText())
            .toBe('Snapshot');
        await subscriptionDialog.clickSidebarSave();
    });

    it('[TC97771_09] unsubscribe snapshot subscription', async () => {
        const subscriptionName = 'TC97771_09 unsubscribe';
        await libraryPage.openDossier(testCityDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await libraryPage.infoWindow.clickManageSubscriptionsButton();
        await takeScreenshotByElement(
            subscribe.getInfoWindowSubscriptionPanel(),
            'TC97771_09_01',
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

    it('[TC97771_10] run subscription on report based dashboard', async () => {
        const subscriptionName = 'TC97771_10 report base';
        const subscriptionNameUpdated = 'TC97771_10 new';
        await libraryPage.openDossier(testCityDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await infoWindow.waitForSnapshotSection();
        await since('1. total snapshots of report based dashboard should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.snapshot.getSnapshotsItemCount())
            .toBe(1);
        await infoWindow.clickManageSubscriptionsButton();
        await subscribe.clickInfoWindowEdit();
        await subscriptionDialog.updateSubscriptionName(subscriptionNameUpdated);
        await subscriptionDialog.clickSave();
        await subscriptionDialog.clickInWindowRunNow();
        await subscriptionDialog.exitInfoWindowPDFSettingsMenu();
        await infoWindow.waitForSnapshotSection();
        await since('2. total snapshots of report based dashboard should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.snapshot.getSnapshotsItemCount())
            .toBe(2);
    });

    // DE314141: [Snapshot] After edit snapshot subscription which based on cube, then trigger the subscription, the snapshot should be overridden rather than create new one
    it('[TC97771_11] run subscription on cube based dashboard', async () => {
        const subscriptionName = 'TC97771_11 cube base';
        const subscriptionNameUpdated = 'TC97771_11 new';
        await libraryPage.openDossier(officeRoyaleSalesDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(officeRoyaleSalesDashboard.name);
        await infoWindow.waitForSnapshotSection();
        await since('1. total snapshots of cube based dashboard should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.snapshot.getSnapshotsItemCount())
            .toBe(1);
        await infoWindow.clickManageSubscriptionsButton();
        await subscribe.clickInfoWindowEdit();
        await subscriptionDialog.updateSubscriptionName(subscriptionNameUpdated);
        await subscriptionDialog.clickSave();
        await subscriptionDialog.sleep(2000); // wait for the subscription to be updated, otherwise, the snapshot name will not update
        await subscriptionDialog.clickInWindowRunNow();
        await subscriptionDialog.exitInfoWindowPDFSettingsMenu();
        await infoWindow.close();
        await libraryPage.openDossierInfoWindow(officeRoyaleSalesDashboard.name);
        await infoWindow.waitForSnapshotSection();
        await since('2. total snapshots of cube based dashboard should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.snapshot.getSnapshotsItemCount())
            .toBe(1);
        await since('3. Snapshot name should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotName({}))
            .toBe(subscriptionNameUpdated);
    });
});
