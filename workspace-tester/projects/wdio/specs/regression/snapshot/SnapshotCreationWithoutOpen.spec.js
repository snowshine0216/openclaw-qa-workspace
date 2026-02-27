import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import clearUserSnapshots from '../../../api/snapshot/clearUserSnapshots.js';
import createBookmarks from '../../../api/createBookmarks.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import * as snapshotInfo from '../../../constants/snapshot.js';
import { mockNoWebAddToHistoryListToOtherP } from '../../../api/mock/mock-privilege.js';
import { mockApplicationSidebarSnapshot } from '../../../api/mock/mock-application.js';
// F43903 Allow users to manually add content to snapshot without opening it
describe('Test Snapshot creation without opening it', () => {
    let {
        loginPage,
        libraryPage,
        dossierPage,
        infoWindow,
        bookmark,
        libraryNotification,
        promptEditor,
        listView,
        listViewAGGrid,
    } = browsers.pageObj1;
    const snapshotTestUser = snapshotInfo.snapshotCreationUser;
    const callCenterManagement = snapshotInfo.callCenterManagement;
    const promptReportForCity = snapshotInfo.promptReportForCity;
    const cubeBasedDocumentForCity = snapshotInfo.cubeBasedDocumentForCity;
    const tolerance = 0.2;
    const bookmark1 = 'New Bookmark';

    /**
     * Verifies that snapshot creation buttons are not displayed across different UI components
     * @param {Function} mockFunction - The mock function to call for setting up the test scenario
     * @param {string} assertionText - The descriptive text for why buttons should not be displayed (e.g., "When snapshot blade is disabled")
     */
    const verifySnapshotButtonsNotDisplayed = async (mockFunction, assertionText, assertionArrary) => {
        await mockFunction();
        await browser.refresh();
        await libraryPage.openDossier(callCenterManagement.name);
        await bookmark.openPanel();
        await since(`${assertionText}, snapshot creation button should not be displayed, instead we have #{actual}`)
            .expect(await bookmark.isCreateSnapshotIconPresent(bookmark1))
            .toBe(assertionArrary ? assertionArrary[0] : false);
        await bookmark.closePanel();
        // await mockFunction();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(callCenterManagement.name);
        await since(
            `${assertionText}, snapshot creation button should not be displayed in info window - bm drop down, instead we have #{actual}`
        )
            .expect(await infoWindow.snapshot.isSnapshotIconInBookmarkDropDownExisting())
            .toBe(assertionArrary ? assertionArrary[1] : false);
        await since(
            `${assertionText}, snapshot creation button should not be displayed in info window, instead we have #{actual}`
        )
            .expect(await infoWindow.snapshot.isSnapshotIconInInfoWindowDisplayed())
            .toBe(assertionArrary ? assertionArrary[2] : false);
        await infoWindow.close();
        await listView.selectListViewMode();
        await listViewAGGrid.clickContextMenuIconInGrid(cubeBasedDocumentForCity.name);
        await since(`${assertionText}, Create snapshot button should not be present in context menu`)
            .expect(await listViewAGGrid.isCreateSnapshotPresentInContextMenu())
            .toBe(assertionArrary ? assertionArrary[3] : false);
    };

    beforeAll(async () => {
        try {
            await resetBookmarks({
                credentials: snapshotTestUser,
                dossier: callCenterManagement,
            });
        } catch (error) {
            console.error(`Error resetting bookmarks: ${error.message}`);
        }
        await createBookmarks({
            credentials: snapshotTestUser,
            bookmarkList: [bookmark1],
            dossier: callCenterManagement,
        });
        await loginPage.login(snapshotTestUser);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await libraryPage.executeScript('window.localStorage.clear();');
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await clearUserSnapshots({
            credentials: [snapshotTestUser],
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC99505_01] create snapshot from bookmark list', async () => {
        await libraryPage.openDossier(callCenterManagement.name);
        await bookmark.openPanel();
        await bookmark.createSnapshot(bookmark1);
        await libraryNotification.waitForAllNotificationShown();
        const notificationMessage = await libraryNotification.getNotificationMessageTextByIndex(0);
        await since(
            'After create snapshot from bookmark list, the notification messsage should be #{expected} instead we have #{actual}'
        )
            .expect(notificationMessage)
            .toBe(`${callCenterManagement.name}_${bookmark1}`);
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(snapshotInfo.callCenterManagement.name);
        await since('Snapshot icon in info window should be existing in bookmark dropdown, instead we have #{actual}')
            .expect(await infoWindow.snapshot.isSnapshotIconInBookmarkDropDownExisting())
            .toBe(true);
    });

    it('[TC99505_02] create snapshot from info window', async () => {
        await libraryPage.openDossierInfoWindow(promptReportForCity.name);
        await infoWindow.resetFromInfoWindow(false);
        await promptEditor.waitForEditor();
        await promptEditor.closeEditor();
        await libraryPage.openDossierInfoWindow(promptReportForCity.name);
        await infoWindow.snapshot.clickSnapshotIconInInfoWindow();
        await promptEditor.waitForEditor();
        await promptEditor.run();
        await infoWindow.waitForSnapshotSection();
        await since('Snapshot section should be visible, instead we have #{actual}')
            .expect(await infoWindow.snapshot.isSnapshotSectionVisible())
            .toBe(true);
    });

    it('[TC99505_03] create snapshot from context menu', async () => {
        await listView.selectListViewMode();
        await listViewAGGrid.clickContextMenuIconInGrid(cubeBasedDocumentForCity.name);
        await listViewAGGrid.clickCreateSnapshotButton();
        await libraryNotification.waitForAllNotificationShown();
        await since(
            'After create snapshot from context menu, the notification messsage should be #{expected} instead we have #{actual}'
        )
            .expect(await libraryNotification.getNotificationMessageTextByIndex(0))
            .toBe(`${cubeBasedDocumentForCity.name}`);
    });

    it('[TC99505_04] snapshot creation button not displayed when snapshot blade disabled', async () => {
        await verifySnapshotButtonsNotDisplayed(
            () => mockApplicationSidebarSnapshot({ snapshot: false }),
            'When snapshot blade is disabled'
        );
    });

    it('[TC99505_05] snapshot creation button not displayed when user has not add to history list privilege', async () => {
        await verifySnapshotButtonsNotDisplayed(
            mockNoWebAddToHistoryListToOtherP,
            'When user has not add to history list privilege to non-tutorial project',
            [true, true, true, false]
        );
    });
});
