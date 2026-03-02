import setWindowSize from '../../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import createSnapshots from '../../../../api/snapshot/createSnapshots.js';
import clearUserSnapshots from '../../../../api/snapshot/clearUserSnapshots.js';
import { browserWindow } from '../../../../constants/index.js';
import * as snapshotInfo from '../../../../constants/snapshot.js';
import { mockNoWebViewHistoryListPrivilege } from '../../../../api/mock/mock-privilege.js';
import {
    mockApplicationSidebarSnapshot,
    mockApplicationFavoriteSnapshot,
} from '../../../../api/mock/mock-application.js';

describe('Test Privilege And Custom App on snapshots blade', () => {
    let { loginPage, libraryPage, snapshotsPage, sidebar } = browsers.pageObj1;
    const snapshotTestUser = snapshotInfo.snapshotsUser;

    beforeAll(async () => {
        await loginPage.login(snapshotTestUser);
        await setWindowSize(browserWindow);
        await clearUserSnapshots({
            credentials: [snapshotTestUser],
        });
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [snapshotInfo.callCenterManagement],
        });
    });

    afterAll(async () => {
        await clearUserSnapshots({
            credentials: [snapshotTestUser],
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC99396_5] Check snapshots will not show up when user has no WebViewHistoryList privilege and custom app settings is disabled', async () => {
        await mockNoWebViewHistoryListPrivilege();
        await libraryPage.openDefaultApp();
        await libraryPage.openSidebarOnly();
        since(
            'When user has no WebViewHistoryList privilege, the snapshots blade should not show up, instead we have #{actual}'
        )
            .expect(await sidebar.isSnapshotsSectionPresent())
            .toBeFalse();
        await mockApplicationSidebarSnapshot({ snapshot: false });
        await libraryPage.openDefaultApp();
        await libraryPage.openSidebarOnly();

        since('When custom app settings is disabled, the snapshots blade should not show up, instead we have #{actual}')
            .expect(await sidebar.isSnapshotsSectionPresent())
            .toBeFalse();
    });

    it('[TC99396_6] Check custom app settings when disable snapshot favorite', async () => {
        await mockApplicationFavoriteSnapshot({ snapshot: false });
        await libraryPage.openDefaultApp();
        await libraryPage.openSidebarOnly();
        await sidebar.openSnapshotsSectionList();
        since(
            'When open custom app with snapshot favorite disabled, the favorite icon should not show up, instead we have #{actual}'
        )
            .expect(
                await snapshotsPage.snapshotsAction.isFavoriteButtonDisplayed(snapshotInfo.callCenterManagement.name)
            )
            .toBeFalse();
    });
});
