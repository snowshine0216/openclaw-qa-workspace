// test case: send background for report / document / snapshot /
// prompted report / dashboard / apply bm (P2) / link to report (P2) / reset / re-prompt
// dashboard as home -- P2
// notification: in progress / ready / error / prompt failed
// privilege
import setWindowSize from '../../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import clearUserSnapshots from '../../../../api/snapshot/clearUserSnapshots.js';
import { browserWindow } from '../../../../constants/index.js';
import * as snapshotInfo from '../../../../constants/snapshot.js';
import { mockNoWebAddToHistoryListToOtherP } from '../../../../api/mock/mock-privilege.js';
import { mockApplicationSidebarSnapshot } from '../../../../api/mock/mock-application.js';
import updateNotificationPreference from '../../../../api/user/updateNotificationPreference.js';
import { mockNetworkThrottling, restoreRequestSpeedMocks } from '../../../../api/mock/mock-network-throttle.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../../api/resetDossierState.js';

describe('Test send background for report / document / dashboard', () => {
    let { loginPage, libraryPage, dossierPage, libraryNotification, promptEditor } = browsers.pageObj1;
    const snapshotTestUser = snapshotInfo.sendToBackgroundTest;
    const libraryTitle = 'Library';
    const tolerance = { tolerance: 0.2 };
    const mockedNetwork = 'Regular3G';

    beforeAll(async () => {
        await updateNotificationPreference({ credentials: snapshotTestUser, value: true });
        await loginPage.login(snapshotTestUser);
        await setWindowSize(browserWindow);
        await clearUserSnapshots({
            credentials: [snapshotTestUser],
        });
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
        await mockNetworkThrottling(mockedNetwork);
    });

    afterAll(async () => {
        await clearUserSnapshots({
            credentials: [snapshotTestUser],
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC99396_7] Check send background for dashboard', async () => {
        await libraryPage.openDossierNoWait(snapshotInfo.ClientTelemetry.name);
        await dossierPage.clickRunInBackgroundButton();
        await restoreRequestSpeedMocks();
        await since(
            'After click run in background button, user should be landed on the library page, instead we have #{actual}'
        )
            .expect(await libraryPage.title())
            .toBe(libraryTitle);
        await libraryNotification.waitForAllNotificationShown();
        await takeScreenshotByElement(
            libraryNotification.getNotificationSection(),
            'TC99396_7',
            'Ready Notification Section',
            tolerance
        );
        await libraryNotification.openReadyNotificationByName(snapshotInfo.ClientTelemetry.name);
        await dossierPage.waitForDossierLoading();
        const snapshotBannerMsg = await dossierPage.getMessageContainerInSnapshotBannerText();
        await since('Snapshot banner message should contain #{expected}, instead it is #{actual}.')
            .expect(snapshotBannerMsg)
            .toContain(`Snapshot with data from`);
        await since('After open snapshot, the notification count should be #{expected}, instead it is #{actual}.')
            .expect(await libraryNotification.getNotificationCount())
            .toBe(1);
    });

    it('[TC99396_8] Check send background for document', async () => {
        await libraryPage.openDossierNoWait(snapshotInfo.largeDocument.name);
        await dossierPage.clickRunInBackgroundButton();
        await restoreRequestSpeedMocks();
        await libraryNotification.waitForAllNotificationShown();
        await takeScreenshotByElement(
            libraryNotification.getNotificationSection(),
            'TC99396_8',
            'Document Notification Section',
            tolerance
        );
    });
    it('[TC99396_9] Check send background for document - wait for input', async () => {
        await resetDossierState({
            credentials: snapshotTestUser,
            dossier: snapshotInfo.largePromptedDocument,
        });
        // await mockNetworkThrottling(mockedNetwork);
        await libraryPage.openDossierNoWait(snapshotInfo.largePromptedDocument.name);
        await dossierPage.clickRunInBackgroundButton();
        await restoreRequestSpeedMocks();
        await libraryNotification.waitForAllNotificationShown();
        await takeScreenshotByElement(
            libraryNotification.getNotificationSection(),
            'TC99396_8',
            'Prompted Document Notification Section - Wait for input',
            tolerance
        );
    });

    it('[TC99396_10] Check send background for document - error', async () => {
        await resetDossierState({
            credentials: snapshotTestUser,
            dossier: snapshotInfo.largePromptedDocument,
        });
        await restoreRequestSpeedMocks();
        await libraryPage.openDossierNoWait(snapshotInfo.largePromptedDocument.name);
        await promptEditor.waitForEditor();
        await promptEditor.run(false);
        await mockNetworkThrottling(mockedNetwork);
        await dossierPage.clickRunInBackgroundButton();
        await restoreRequestSpeedMocks();
        await libraryNotification.waitForAllNotificationShown();
        await takeScreenshotByElement(
            libraryNotification.getNotificationSection(),
            'TC99396_8',
            'Prompted Report Notification Section',
            tolerance
        );
    });

    it('[TC99396_11] Check send background for report', async () => {
        await libraryPage.openReportByUrl({
            projectId: snapshotInfo.largeReport.project.id,
            documentId: snapshotInfo.largeReport.id,
            noWait: true,
        });
        await dossierPage.clickRunInBackgroundButton();
        await restoreRequestSpeedMocks();
        await libraryNotification.waitForAllNotificationShown();
        await takeScreenshotByElement(
            libraryNotification.getNotificationSection(),
            'TC99396_9',
            'Report Notification Section',
            tolerance
        );
    });

    it('[TC99396_12] Check send background not showing up', async () => {
        // when sidebar snapshot is disabled, send background should not show up
        await mockApplicationSidebarSnapshot({ snapshot: false });
        await libraryPage.openDossierById(
            {
                projectId: snapshotInfo.ClientTelemetry.project.id,
                dossierId: snapshotInfo.ClientTelemetry.id,
            },
            false
        );
        const showSendBackgroundButton = await dossierPage.isRunInBackgroundButtonDisplayed();
        since(
            'When sidebar snapshot is disabled, send background button should not show up, instead we have #{actual}.'
        )
            .expect(showSendBackgroundButton)
            .toBeFalse();
        await mockNoWebAddToHistoryListToOtherP(); // only has add to history privilege in tutorial project
        await libraryPage.openDossierById(
            {
                projectId: snapshotInfo.ClientTelemetry.project.id,
                dossierId: snapshotInfo.ClientTelemetry.id,
            },
            false
        );
        const showSendBackgroundButton2 = await dossierPage.isRunInBackgroundButtonDisplayed();
        since(
            'When there is no add to history list privilege 1, send background button should not show up, instead we have #{actual}.'
        )
            .expect(showSendBackgroundButton2)
            .toBeFalse();
        await mockNoWebAddToHistoryListToOtherP();
        await libraryPage.openDossierById(
            {
                projectId: snapshotInfo.infoDocument.project.id,
                dossierId: snapshotInfo.infoDocument.id,
            },
            false
        );
        const showSendBackgroundButton3 = await dossierPage.isRunInBackgroundButtonDisplayed();
        since(
            'When there is no add to history list privilege 2, send background button should not show up, instead we have #{actual}.'
        )
            .expect(showSendBackgroundButton3)
            .toBeFalse();

        await libraryPage.openReportByUrl({
            projectId: snapshotInfo.largeReport.project.id,
            documentId: snapshotInfo.largeReport.id,
            noWait: true,
        });

        const showSendBackgroundButton4 = await dossierPage.isRunInBackgroundButtonDisplayed();
        since(
            'When there is add to history list privilege, send background button should not show up, instead we have #{actual}.'
        )
            .expect(showSendBackgroundButton4)
            .toBeTrue();
    });
});
