import setWindowSize from '../../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import createSnapshots from '../../../../api/snapshot/createSnapshots.js';
import createReportSnapshots from '../../../../api/reports/createReportSnapshots.js';
import clearUserSnapshots from '../../../../api/snapshot/clearUserSnapshots.js';
import { browserWindow } from '../../../../constants/index.js';
import * as snapshotInfo from '../../../../constants/snapshot.js';
import { mockSnapshotsBladeResult, mockEmptySnapshotsBladeResult } from '../../../../api/mock/mock-historylist.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';

describe('Test manipulations on snapshots blade', () => {
    // Test favorite, rename, delete, open, error message, no snapshots
    let { loginPage, libraryPage, snapshotsPage, sidebar } = browsers.pageObj1;
    const snapshotTestUser = snapshotInfo.snapshotsUser;
    const imageTolerance = 0.5;
    const errorSnapshotName = 'Cube not publish';
    // const runningSnapshotName = 'TXN, City and Sales';
    const waitingSnapshotName = 'Product, Prompt by region & year';

    beforeAll(async () => {
        await loginPage.login(snapshotTestUser);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await clearUserSnapshots({
            credentials: [snapshotTestUser],
        });
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [snapshotInfo.callCenterManagement, snapshotInfo.certifyDocument],
        });

        await createReportSnapshots({
            credentials: snapshotTestUser,
            dossiers: [snapshotInfo.sampleReport],
        });
        await libraryPage.openDefaultApp();
        await libraryPage.openSidebarOnly();
        await sidebar.openSnapshotsSectionList();
    });

    afterEach(async () => {
        await clearUserSnapshots({
            credentials: [snapshotTestUser],
        });
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC99396_1] Check Snapshot lists', async () => {
        // Step1: take snapshot for the running snapshots to check order, content display, unread indicator, etc.
        await takeScreenshotByElement(
            snapshotsPage.snapshotsGrid.getFullWidthContainer(),
            'TC99396_1_01',
            'check ready snapshot list',
            {
                tolerance: imageTolerance,
            }
        );

        // Step2: click on Call Center Management snapshot, and then click on home icon, unread icon should be removed
        await snapshotsPage.openSnapshotByName(snapshotInfo.callCenterManagement.name);
        await libraryPage.openDefaultApp();
        await since('After open snapshot, the unread indicator should be removed, instead we have #{actual}')
            .expect(
                await snapshotsPage.snapshotsGrid.getSnapshotUnreadStatusByName(snapshotInfo.callCenterManagement.name)
            )
            .toBe(false);

        await mockSnapshotsBladeResult();
        await libraryPage.openDefaultApp();
        await takeScreenshotByElement(
            snapshotsPage.snapshotsGrid.getFullWidthContainer(),
            'TC99396_1_02',
            'check error snapshot list',
            {
                tolerance: imageTolerance,
            }
        );

        // Step3: hovering on error snapshot, it should show error message
        await snapshotsPage.snapshotsGrid.hoverOnSnapshotStatusIcon(errorSnapshotName);
        const errorMessage = await snapshotsPage.tooltip();
        await since('Error message should be #{expected}, instead we have #{actual}')
            .expect(errorMessage)
            .toBe(snapshotInfo.snapshotErrorText.English.createSnapshotFailed);

        await snapshotsPage.snapshotsGrid.hoverOnSnapshotStatusIcon(waitingSnapshotName);
        const promptErrorMessage = await snapshotsPage.tooltip();
        await since(
            'create snapshot not answering prompt error message should be #{expected}, instead we have #{actual}'
        )
            .expect(promptErrorMessage)
            .toBe(snapshotInfo.snapshotErrorText.English.createSnapshotPromptFailed);

        // Step 4: mock empty snapshot result
        await mockEmptySnapshotsBladeResult();
        await libraryPage.openDefaultApp();

        await takeScreenshotByElement(snapshotsPage.EmptyContent, 'TC99396_1_03', 'check empty snapshot list', {
            tolerance: imageTolerance,
        });
    });

    it('[TC99396_2] SnapshotItems CURD', async () => {
        const updatedName = snapshotInfo.callCenterManagement.name + ' Update';
        // Step 1 hover on Call Center Management snapshot, click on edit button, and then clear all the texts, input Call Center Management Update
        await snapshotsPage.renameSnapshotByName(snapshotInfo.callCenterManagement.name, updatedName);

        // Step 2 hover on Call Center Management snapshot, click on favorite icon
        await snapshotsPage.addSnapshotToFavorites(updatedName);

        // Verify that the snapshot is added to favorites section
        await takeScreenshotByElement(
            snapshotsPage.snapshotsGrid.getFullWidthContainer(),
            'TC99396_2_01',
            'verify renamed snapshot is added to favorites section',
            { tolerance: imageTolerance }
        );

        // Step 3 remove snapshot from favorites
        await snapshotsPage.removeSnapshotFromFavorites(updatedName);

        // Verify that the snapshot is removed from favorites section
        await takeScreenshotByElement(
            snapshotsPage.snapshotsGrid.getFullWidthContainer(),
            'TC99396_2_02',
            'verify renamed snapshot is removed from favorites section',
            { tolerance: imageTolerance }
        );

        // Step 4 delete snapshot
        await snapshotsPage.deleteSnapshotByName(updatedName, true);

        // Verify that the snapshot is deleted from snapshot list
        await takeScreenshotByElement(
            snapshotsPage.snapshotsGrid.getFullWidthContainer(),
            'TC99396_2_03',
            'verify renamed snapshot is removed from snapshot list',
            { tolerance: imageTolerance }
        );
    });
});
