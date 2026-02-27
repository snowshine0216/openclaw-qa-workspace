import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import clearUserSnapshots from '../../../api/snapshot/clearUserSnapshots.js';
import getSnapshotsByTargetId from '../../../api/snapshot/getSnapshotsByTargetId.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import * as snapshotInfo from '../../../constants/snapshot.js';
import { convertUTCToLocalTime } from '../../../utils/timeHelper.js';

describe('Test Snapshot privilege', () => {
    let { loginPage, libraryPage, share, subscribe, subscriptionDialog, dossierPage, infoWindow } = browsers.pageObj1;
    const userNoViewHistory = snapshotInfo.snapshotNoViewPrivilege;
    const userNoSubscribeHistory = snapshotInfo.snapshotNoSubscribeHistory;
    const userNoSubscribeToEmail = snapshotInfo.snapshotNoSubscribeToEmail;

    const testUsers = [userNoViewHistory, userNoSubscribeHistory, userNoSubscribeToEmail];

    const testCityDashboard = snapshotInfo.testCityDashboard;
    const officeRoyaleSalesDashboard = snapshotInfo.officeRoyaleSales;

    const subscriptionFormats = snapshotInfo.subscriptionFormats;
    const expectedFormats = Object.values(subscriptionFormats);
    const subscriptionSchedules = snapshotInfo.subscriptionSchedules;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await clearUserSnapshots({
            credentials: testUsers,
        });
        await resetBookmarks({
            credentials: userNoViewHistory,
            dossier: testCityDashboard,
        });
        await resetBookmarks({
            credentials: userNoSubscribeHistory,
            dossier: testCityDashboard,
        });
        await resetBookmarks({
            credentials: userNoViewHistory,
            dossier: officeRoyaleSalesDashboard,
        });
        await resetBookmarks({
            credentials: userNoSubscribeHistory,
            dossier: officeRoyaleSalesDashboard,
        });
        await resetBookmarks({
            credentials: userNoSubscribeToEmail,
            dossier: officeRoyaleSalesDashboard,
        });
        await libraryPage.executeScript('window.localStorage.clear();');
        await libraryPage.openDefaultApp();
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
    });

    afterAll(async () => {
        await clearUserSnapshots({
            credentials: testUsers,
        });
    });

    it('[TC97775_01] user does not have view history list privilege', async () => {
        const subscriptionName = 'TC97775_01 no view history';
        await loginPage.login(userNoViewHistory);
        await libraryPage.openDossier(testCityDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await since('1. Snapshot section should not display, instead it is shown.')
            .expect(await libraryPage.infoWindow.isSnapshotContentSectionPresent({}))
            .toBe(false);
        const snapshots = await getSnapshotsByTargetId({
            credentials: userNoViewHistory,
            targetId: testCityDashboard.id,
        });
        await since('1. Total snapshot should be #{expected}, instead it is #{actual}.')
            .expect(snapshots.length)
            .toBe(1);
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: testCityDashboard.id,
            messageId: snapshots[0].messageId,
        });
        await since('2. Snapshot banner should display, instead it is not shown.')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
        const expectedSnapshotMsg = `Snapshot with data from ${convertUTCToLocalTime(snapshots[0].creationTime)}.`;
        await since('3. Snapshot banner message should be #{expected}, instead it is #{actual}.')
            .expect(await dossierPage.getMessageContainerInSnapshotBanner().getText())
            .toBe(expectedSnapshotMsg);
    });

    it('[TC97775_02] user have view history list privilege in project level', async () => {
        const subscriptionName = 'TC97775_02 view history';
        await loginPage.login(userNoViewHistory);
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
        await since('1. Snapshot section should display, instead it does not show.')
            .expect(await libraryPage.infoWindow.isSnapshotContentSectionPresent({}))
            .toBe(true);
        await infoWindow.openSnapshotFromInfoWindow({ name: subscriptionName });
        await since('2. Snapshot banner should display, instead it is not shown.')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            dossierPage.getSnapshotBannerContainer(),
            'TC97775_02',
            'SubscriptionPanel by format is Snapshot'
        );
    });

    it('[TC97775_03] user does not have subscribe to history privilege', async () => {
        const subscriptionName = 'TC97775_03 no subscribe history';
        await loginPage.login(userNoSubscribeHistory);
        await libraryPage.openDossier(testCityDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await since('1. Subscription format should #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getFormatDropdownOptionValues())
            .toEqual(['Excel', 'CSV', 'PDF']);
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.pdf);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await libraryPage.infoWindow.clickManageSubscriptionsButton();
        await takeScreenshotByElement(
            subscribe.getInfoWindowSubscriptionPanel(),
            'TC97775_03_01',
            'Pdf subscription in info window'
        );
        await libraryPage.openDossier(officeRoyaleSalesDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await since('2. Subscription format should #{expected}, instead we have #{actual}')
            .expect(await subscriptionDialog.getFormatDropdownOptionValues())
            .toEqual(expectedFormats);
    });

    it('[TC97775_04] user have subscribe to email privilege in project level', async () => {
        const subscriptionName = 'TC97775_04 no subscribe email';
        await loginPage.login(userNoSubscribeToEmail);
        await libraryPage.openDossier(testCityDashboard.name);
        await share.openSharePanel();
        await takeScreenshotByElement(share.getSharePanel(), 'TC97775_04_01', 'No subscribe entry');
        await libraryPage.openDefaultApp();
        await libraryPage.openDossier(officeRoyaleSalesDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.clickSendNowCheckbox();
        await takeScreenshotByElement(subscriptionDialog.getSubscriptionPanel(), 'TC97775_04_02', 'Only snapshot');
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(officeRoyaleSalesDashboard.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await since('1. Snapshot name should be #{expected}, instead we have #{actual}')
            .expect(await libraryPage.infoWindow.getSnapshotName({}))
            .toBe(subscriptionName);
        await libraryPage.infoWindow.clickManageSubscriptionsButton();
        await takeScreenshotByElement(
            subscriptionDialog.getInfoWindowSubscriptionPanel(),
            'TC97775_04_03',
            'Snapshot subscription in info window'
        );
    });

    it('[TC97775_05] user does not have subscribe to history privilege on rwd', async () => {
        const rwdForManipulation = snapshotInfo.rwdForManipulation;
        const rwdNoDatasetInTutorial = snapshotInfo.rwdNoDatasetInTutorial;
        await loginPage.login(userNoSubscribeHistory);
        await libraryPage.openDossier(rwdForManipulation.name);
        await share.openSharePanel();
        await share.waitForElementVisible(share.getExportPDFButton());
        await takeScreenshotByElement(
            share.getSharePanel(),
            'TC97775_05_01',
            'No subscribe entry on subscription project'
        );
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(rwdNoDatasetInTutorial.name);
        await share.openSharePanel();
        await takeScreenshotByElement(share.getSharePanel(), 'TC97775_05_02', 'Subscribe entry on tutorial project');
        await libraryPage.openDefaultApp();
    });
});
