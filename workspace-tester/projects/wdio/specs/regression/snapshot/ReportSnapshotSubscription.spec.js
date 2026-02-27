import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import clearUserSnapshots from '../../../api/snapshot/clearUserSnapshots.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import resetBookmarksWithPrompt from '../../../api/resetBookmarksWithPrompt.js';
import resetReportState from '../../../api/reports/resetReportState.js';
import { deleteCustomAppList } from '../../../api/customApp/deleteCustomApp.js';
import createCustomApp from '../../../api/customApp/createCustomApp.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import { disableSnapshotCustomAppObj } from '../../../constants/customApp/info.js';
import * as snapshotInfo from '../../../constants/snapshot.js';
import {
    mockApplicationSidebarSnapshot,
    mockApplicationSubscribeSnapshot,
} from '../../../api/mock/mock-application.js';

describe('Test Report snapshot subscription', () => {
    let {
        loginPage,
        libraryPage,
        share,
        subscribe,
        dossierPage,
        reportGridView,
        infoWindow,
        bookmark,
        sidebar,
        subscriptionDialog,
    } = browsers.pageObj1;
    const snapshotTestUser = snapshotInfo.snapshotTestUser;
    const promptReportForCity = snapshotInfo.promptReportForCity;
    const cubeAutoReport = snapshotInfo.cubeAutoReport;
    const reportNotAllowSchedule = snapshotInfo.reportNotAllowSchedule;
    const subscriptionFormats = snapshotInfo.subscriptionFormats;
    const subscriptionSchedules = snapshotInfo.subscriptionSchedules;
    let appIdDisableSnapshot = '';

    beforeAll(async () => {
        await loginPage.login(snapshotTestUser);
        await setWindowSize(browserWindow);
        appIdDisableSnapshot = await createCustomApp({
            credentials: snapshotTestUser,
            customAppInfo: disableSnapshotCustomAppObj,
        });
    });

    beforeEach(async () => {
        await resetReportState({ credentials: snapshotTestUser, report: promptReportForCity });
        await resetBookmarksWithPrompt({
            credentials: snapshotTestUser,
            dossier: promptReportForCity,
            type: 'report',
        });
        await clearUserSnapshots({
            credentials: [snapshotTestUser],
        });
        await libraryPage.openDefaultApp();
        await libraryPage.executeScript('window.localStorage.clear();');
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

    it('[TC99187_01] create report snapshot subscription by default settings', async () => {
        const subscriptionName = 'TC99187_01 report';
        await libraryPage.openDossier(promptReportForCity.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.waitForElementVisible(subscriptionDialog.getScheduleSelector());
        await takeScreenshotByElement(subscriptionDialog.getSubscriptionPanel(), 'TC99187_01', 'format is Snapshot');
        await subscriptionDialog.enableSendNowInReport();
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
        await libraryPage.openDossierInfoWindow(promptReportForCity.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since('4. Snapshot name should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotName({}))
            .toBe(subscriptionName);
    });

    it('[TC99187_02] create report snapshot subscription by given bookmark', async () => {
        const subscriptionName = 'TC99187_02 BM';
        const bookmark1 = 'bk-snapshot1';
        const bookmark2 = 'bk-snapshot2';
        await libraryPage.openDossier(promptReportForCity.name);
        await bookmark.openPanel();
        await bookmark.addNewBookmark(bookmark1);
        await bookmark.closePanel();
        await reportGridView.sortDescending('Test-City');
        await bookmark.openPanel();
        await bookmark.addNewBookmark(bookmark2);
        await bookmark.closePanel();
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.selectBookmark(bookmark1);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
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

    it('[TC99187_03] trigger report snapshot by run now', async () => {
        const subscriptionName = 'TC99187_03 run now';
        await libraryPage.openDossier(promptReportForCity.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.waitForSelectedFormatLoaded();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.enableSendNowInReport();
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openSidebar();
        await sidebar.openSubscriptions();
        await subscribe.hoverSubscription(subscriptionName);
        await subscribe.clickRunNowInSubscriptionListByName(subscriptionName);
        await sidebar.openAllSectionList();
        await libraryPage.openDossierInfoWindow(promptReportForCity.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since('1. Snapshot name should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotName({}))
            .toBe(subscriptionName);
    });

    it('[TC99187_04] check format in info window subscription management', async () => {
        const subscriptionName = 'TC99187_04 format';
        await libraryPage.openDossier(promptReportForCity.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await since('1. Subscription format should be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getFormatDropdownOptionValues())
            .toEqual(Object.values(subscriptionFormats));
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(promptReportForCity.name);
        await libraryPage.infoWindow.clickManageSubscriptionsButton();
        await takeScreenshotByElement(
            subscriptionDialog.getInfoWindowSubscriptionPanel(),
            'TC99187_04_01',
            'Document Snapshot subscription in info window'
        );
        await subscriptionDialog.clickInfoWindowEdit();
        await subscriptionDialog.waitForSelectedFormatLoaded();
        await subscriptionDialog.waitForSelectedBookmarkLoaded();
        await takeScreenshotByElement(
            subscriptionDialog.getSubscriptionPanel(),
            'TC99187_04_02',
            'Edit document snapshot subscription in info window'
        );
        await since('2. RSD Subscription format in info window should be #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getFormatDropdownOptionValues())
            .toEqual(Object.values(subscriptionFormats));
    });

    it('[TC99187_05] subscribe document report to others', async () => {
        const subscriptionName = 'TC99187_05 subscribe to others';
        await libraryPage.openDossier(promptReportForCity.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.waitForSelectedFormatLoaded();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.inputRecipient('');
        await subscriptionDialog.tabForward();
        await subscriptionDialog.inputRecipient('email');
        await subscriptionDialog.selectRecipient(['snapshot_email']);
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(promptReportForCity.name);
        await libraryPage.infoWindow.clickManageSubscriptionsButton();
        await subscriptionDialog.clickInfoWindowEdit();
        await takeScreenshotByElement(
            subscriptionDialog.getSubscriptionPanel(),
            'TC99187_05_01',
            'subscribe RSD to others'
        );
    });

    it('[TC99187_06] no snapshot when snapshot is off in custom app settings', async () => {
        const subscriptionName = 'TC99187_06 Snapshot';
        // await libraryPage.openCustomAppById({ id: appIdDisableSnapshot });
        await mockApplicationSubscribeSnapshot({ snapshot: false });
        await browser.refresh();
        await libraryPage.openDossier(promptReportForCity.name);
        await share.openSharePanel();
        await since('1. Subscribe button is expected to be #{expected}, instead we have #{actual}.')
            .expect(await share.getSubscribeButton().isDisplayed())
            .toBe(false);
        await libraryPage.openDefaultApp();
        await libraryPage.openDossier(promptReportForCity.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.waitForSelectedFormatLoaded();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.enableSendNowInReport();
        await subscriptionDialog.createSubscription();
        await subscriptionDialog.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(promptReportForCity.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since('2. isDisplay of snapshot section should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.snapshot.isSnapshotSectionVisible())
            .toBe(true);
        // await libraryPage.openCustomAppById({ id: appIdDisableSnapshot });
        await mockApplicationSidebarSnapshot({ snapshot: false });
        await libraryPage.openDossierInfoWindow(promptReportForCity.name);
        await since('3. isDisplay of snapshot section should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.snapshot.isSnapshotSectionVisible())
            .toBe(false);
        await libraryPage.infoWindow.clickManageSubscriptionsButton();
        await subscriptionDialog.clickInfoWindowEdit(false);
        await subscriptionDialog.waitForSelectedBookmarkLoaded();
        await takeScreenshotByElement(
            subscriptionDialog.getSubscriptionPanel(),
            'TC99187_06_01',
            'snapshot field empty'
        );
    });

    it('[TC99187_07] unsubscribe document snapshot subscription', async () => {
        const subscriptionName = 'TC99187_07 unsubscribe';
        await libraryPage.openDossier(promptReportForCity.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.enableSendNowInReport();
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(promptReportForCity.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await libraryPage.infoWindow.clickManageSubscriptionsButton();
        await takeScreenshotByElement(
            subscriptionDialog.getInfoWindowSubscriptionPanel(),
            'TC99187_07_01',
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

    it('[TC99187_08] run snapshot subscription on report based document', async () => {
        const subscriptionName = 'TC99187_08 report base';
        const subscriptionNameUpdated = 'TC99187_08 new';
        await libraryPage.openDossier(promptReportForCity.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.enableSendNowInReport();
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(promptReportForCity.name);
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

    it('[TC99187_09] run snapshot subscription on cube based document', async () => {
        await resetReportState({ credentials: snapshotTestUser, report: cubeAutoReport });
        await resetBookmarks({
            credentials: snapshotTestUser,
            dossier: cubeAutoReport,
            type: 'report',
        });
        const subscriptionName = 'TC99187_09 cube base';
        const subscriptionNameUpdated = 'TC99187_09 new';
        await libraryPage.openDossier(cubeAutoReport.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.enableSendNowInReport();
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(cubeAutoReport.name);
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
        await subscriptionDialog.clickInWindowRunNow();
        await subscriptionDialog.exitInfoWindowPDFSettingsMenu();
        await infoWindow.waitForSnapshotSection();
        await since('3. total snapshots of cube based dashboard should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.snapshot.getSnapshotsItemCount())
            .toBe(1);
        await since('4. Latest snapshot name should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotName({}))
            .toBe(subscriptionNameUpdated);
    });

    it('[TC99187_10] report not allow to schedule', async () => {
        await resetReportState({ credentials: snapshotTestUser, report: reportNotAllowSchedule });
        await resetBookmarks({
            credentials: snapshotTestUser,
            dossier: reportNotAllowSchedule,
            type: 'report',
        });
        await libraryPage.openDossier(reportNotAllowSchedule.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await since(`1. Subscribe button is expected to be #{expected}, instead we have #{actual}`)
            .expect(await subscriptionDialog.getSubscribeButton().isEnabled())
            .toBe(false);
    });
});
