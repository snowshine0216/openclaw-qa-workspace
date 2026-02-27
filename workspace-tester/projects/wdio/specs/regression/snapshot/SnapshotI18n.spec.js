import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import clearUserSnapshots from '../../../api/snapshot/clearUserSnapshots.js';
import { mockGetSingleSnapshotResponse } from '../../../api/mock/mock-response-utils.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import * as snapshotInfo from '../../../constants/snapshot.js';

describe('Test snapshot i18n', () => {
    let { loginPage, libraryPage, share, subscribe, subscriptionDialog, dossierPage, infoWindow, sidebar } =
        browsers.pageObj1;
    const snapshotI18N = snapshotInfo.snapshotI18N;
    const testUsers = [snapshotI18N];
    const testCityDashboard = snapshotInfo.testCityDashboard;
    const officeRoyaleSalesDashboard = snapshotInfo.officeRoyaleSales;
    const subscriptionFormats = snapshotInfo.subscriptionFormatsCN;
    const subscriptionSchedules = snapshotInfo.subscriptionSchedules;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(snapshotI18N);
        await mockGetSingleSnapshotResponse({});
    });

    beforeEach(async () => {
        await clearUserSnapshots({
            credentials: testUsers,
        });
        await resetBookmarks({
            credentials: snapshotI18N,
            dossier: testCityDashboard,
        });
        await resetBookmarks({
            credentials: snapshotI18N,
            dossier: officeRoyaleSalesDashboard,
        });
        await libraryPage.executeScript('window.localStorage.clear();');
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await clearUserSnapshots({
            credentials: testUsers,
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC98717_01] Report based dashboard under Chinese locale', async () => {
        const subscriptionName = 'TC98717_01 Chinese';
        await libraryPage.openDossier(testCityDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.clickSendNowCheckbox();
        await takeScreenshotByElement(
            subscriptionDialog.getSubscriptionPanel(),
            'TC98717_01_01',
            'SubscriptionPanel by format is Snapshot'
        );
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({ name: subscriptionName });
        await takeScreenshotByElement(
            dossierPage.getSnapshotBannerContainer(),
            'TC98717_01_02',
            'Snapshot banner of report based dashboard'
        );
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await infoWindow.clickManageSubscriptionsButton();
        await takeScreenshotByElement(
            subscriptionDialog.getInfoWindowSubscriptionPanel(),
            'TC98717_01_03',
            'Snapshot subscription in info window'
        );
    });

    it('[TC98717_02] Cube based dashboard under Chinese locale', async () => {
        const subscriptionName = 'TC98717_02 Chinese';
        await libraryPage.openDossier(officeRoyaleSalesDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.clickSendNowCheckbox();
        await takeScreenshotByElement(
            subscriptionDialog.getSubscriptionPanel(),
            'TC98717_02_01',
            'SubscriptionPanel by format is Snapshot'
        );
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(officeRoyaleSalesDashboard.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({ name: subscriptionName });
        await takeScreenshotByElement(
            dossierPage.getSnapshotBannerContainer(),
            'TC98717_02_02',
            'Snapshot banner of cube based dashboard'
        );
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(officeRoyaleSalesDashboard.name);
        await libraryPage.infoWindow.waitForSnapshotSection();
        await infoWindow.clickManageSubscriptionsButton();
        await takeScreenshotByElement(
            subscriptionDialog.getInfoWindowSubscriptionPanel(),
            'TC98717_02_03',
            'Snapshot subscription in info window'
        );
    });
});
