import setWindowSize from '../../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import createSnapshots from '../../../../api/snapshot/createSnapshots.js';
import createReportSnapshots from '../../../../api/reports/createReportSnapshots.js';
import clearUserSnapshots from '../../../../api/snapshot/clearUserSnapshots.js';
import { browserWindow } from '../../../../constants/index.js';
import * as snapshotInfo from '../../../../constants/snapshot.js';
import { mockSnapshotsBladeResult, mockEmptySnapshotsBladeResult } from '../../../../api/mock/mock-historylist.js';

describe('Test Search Filter on snapshots blade', () => {
    // Test favorite, rename, delete, open, error message, no snapshots
    let { loginPage, libraryPage, snapshotsPage, sidebar } = browsers.pageObj1;
    const snapshotTestUser = snapshotInfo.snapshotsUser;
    const errorSnapshotName = 'Cube not publish';
    const reportSnapshotName = 'Report Snapshot Test';

    beforeAll(async () => {
        await loginPage.login(snapshotTestUser);
        await setWindowSize(browserWindow);
        await clearUserSnapshots({
            credentials: [snapshotTestUser],
        });
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [snapshotInfo.callCenterManagement, snapshotInfo.certifyDocument],
        });
    });

    beforeEach(async () => {
        await createReportSnapshots({
            credentials: snapshotTestUser,
            dossiers: [snapshotInfo.sampleReport],
        });
        await libraryPage.openDefaultApp();
        await libraryPage.openSidebarOnly();
        await sidebar.openSnapshotsSectionList();
    });

    afterAll(async () => {
        await clearUserSnapshots({
            credentials: [snapshotTestUser],
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC99396_3] Check Sort', async () => {
        // Step1: take snapshot for the running snapshots to check order, content display, unread indicator, etc.
        await mockSnapshotsBladeResult();
        await libraryPage.openDefaultApp();

        await since(
            'When navigate to snapshots page, the default sort option should be #{expected}, instead we have #{actual}'
        )
            .expect(await snapshotsPage.snapshotsToolbar.currentSortStatus())
            .toEqual(['Date Created', 'dsc']);

        await snapshotsPage.snapshotsToolbar.selectSortOption('Name');
        const names = await snapshotsPage.snapshotsGrid.getSnapshotNames();
        await since(
            'When select sort by Name option, the last snapshot should be #{expected}, instead we have #{actual}'
        )
            .expect(names.at(-1))
            .toEqual(snapshotInfo.txnDashboard.name);

        await snapshotsPage.snapshotsToolbar.selectSortOption('Content');
        await snapshotsPage.snapshotsToolbar.selectSortOrder('Z-A');
        const namesAfterSortByContent = await snapshotsPage.snapshotsGrid.getSnapshotNames();
        await since(
            'When select sort by Content des, the last snapshot should be #{expected}, instead we have #{actual}'
        )
            .expect(namesAfterSortByContent.at(-1))
            .toEqual(snapshotInfo.callCenterManagement.name);

        await snapshotsPage.snapshotsToolbar.selectSortOption('Status');
        await since(
            'When select sort by Status option, the last snapshot should be #{expected}, instead we have #{actual}'
        )
            .expect(await snapshotsPage.snapshotsGrid.getSnapshotStatuses())
            .toEqual(['Error', 'Error', 'Ready', 'Ready', 'Ready', 'Running']);

        await snapshotsPage.snapshotsToolbar.selectSortOption('Project');
        await since(
            'When select sort by Project option, the last snapshot should be #{expected}, instead we have #{actual}'
        )
            .expect(await snapshotsPage.snapshotsGrid.getSnapshotNames())
            .toEqual([
                snapshotInfo.productPromptRegionYearReport.name,
                reportSnapshotName,
                snapshotInfo.certifyDocument.name,
                snapshotInfo.callCenterManagement.name,
                errorSnapshotName,
                snapshotInfo.txnDashboard.name,
            ]);

        // check when snapshot list is empty, no sort or filter option should be displayed
        await mockEmptySnapshotsBladeResult();
        await libraryPage.openDefaultApp();
        await since('When snapshot list is empty, no sort should be displayed, instead we have #{actual}')
            .expect(await snapshotsPage.snapshotsToolbar.isSortDisplayed())
            .toBe(false);
        await since('When snapshot list is empty, no filter icon should be displayed, instead we have #{actual}')
            .expect(await snapshotsPage.snapshotsToolbar.isFilterIconDisplayed())
            .toBe(false);
    });

    it('[TC99396_4] Check Filter', async () => {
        await mockSnapshotsBladeResult();
        await libraryPage.openDefaultApp();
        await snapshotsPage.snapshotsToolbar.filterByProject(['all']);
        await since('When filter by project all, the snapshot list should be #{expected}, instead we have #{actual}')
            .expect(await snapshotsPage.snapshotsGrid.getSnapshotNames())
            .toEqual([
                snapshotInfo.productPromptRegionYearReport.name,
                errorSnapshotName,
                snapshotInfo.txnDashboard.name,
                reportSnapshotName,
                snapshotInfo.certifyDocument.name,
                snapshotInfo.callCenterManagement.name,
            ]);
        await snapshotsPage.snapshotsToolbar.filterByProject([snapshotInfo.callCenterManagement.project.name]);
        await since(
            'When filter by tutorial project, the snapshot list should be #{expected}, instead we have #{actual}'
        )
            .expect(await snapshotsPage.snapshotsGrid.getSnapshotNames())
            .toEqual([
                snapshotInfo.productPromptRegionYearReport.name,
                reportSnapshotName,
                snapshotInfo.certifyDocument.name,
                snapshotInfo.callCenterManagement.name,
            ]);
        await snapshotsPage.snapshotsToolbar.filterByContentType(['all']);
        await since(
            'When filter by content type all, the snapshot list should be #{expected}, instead we have #{actual}'
        )
            .expect(await snapshotsPage.snapshotsGrid.getSnapshotNames())
            .toEqual([
                snapshotInfo.productPromptRegionYearReport.name,
                errorSnapshotName,
                snapshotInfo.txnDashboard.name,
                reportSnapshotName,
                snapshotInfo.certifyDocument.name,
                snapshotInfo.callCenterManagement.name,
            ]);
        await snapshotsPage.snapshotsToolbar.filterByContentType(['Report']);
        await since(
            'When filter by content type report, the snapshot list should be #{expected}, instead we have #{actual}'
        )
            .expect(await snapshotsPage.snapshotsGrid.getSnapshotNames())
            .toEqual([snapshotInfo.productPromptRegionYearReport.name, reportSnapshotName]);
        await snapshotsPage.snapshotsToolbar.filterByContent(['all']);
        await since('When filter by content all, the snapshot list should be #{expected}, instead we have #{actual}')
            .expect(await snapshotsPage.snapshotsGrid.getSnapshotNames())
            .toEqual([
                snapshotInfo.productPromptRegionYearReport.name,
                errorSnapshotName,
                snapshotInfo.txnDashboard.name,
                reportSnapshotName,
                snapshotInfo.certifyDocument.name,
                snapshotInfo.callCenterManagement.name,
            ]);
        await snapshotsPage.snapshotsToolbar.filterByContent([snapshotInfo.callCenterManagement.name]);
        await since(
            'When filter by content call center management, the snapshot list should be #{expected}, instead we have #{actual}'
        )
            .expect(await snapshotsPage.snapshotsGrid.getSnapshotNames())
            .toEqual([snapshotInfo.callCenterManagement.name]);
    });
});
