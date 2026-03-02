import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import clearUserSnapshots from '../../../api/snapshot/clearUserSnapshots.js';
import resetBookmarksWithPrompt from '../../../api/resetBookmarksWithPrompt.js';
import resetReportState from '../../../api/reports/resetReportState.js';
import getSnapshotsByTargetId from '../../../api/snapshot/getSnapshotsByTargetId.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import * as snapshotInfo from '../../../constants/snapshot.js';
import createReportSnapshots from '../../../api/reports/createReportSnapshots.js';
import { convertUTCToLocalTime } from '../../../utils/timeHelper.js';
import {
    resetCityDataByAPI,
    updateCityById,
    getCityDataByAPI,
    resetProductsDataByAPI,
    replaceCubeDataByAPI,
    appendCubeDataByAPI,
} from '../../../api/whUpdate/index.js';
import { isFileNotEmpty, deleteFile } from '../../../config/folderManagement.js';

describe('Test run report snapshot', () => {
    let { loginPage, libraryPage, share, dossierPage, infoWindow, reportGridView, excelExportPanel } =
        browsers.pageObj1;
    const snapshotTestUser = snapshotInfo.snapshotRunUser;
    const promptReportForCity = snapshotInfo.promptReportForCity;
    const reportForLinking = snapshotInfo.reportLink;
    const cubeAutoReport = snapshotInfo.cubeAutoReport;
    const reportForManipulation = snapshotInfo.sampleReport;
    const cubeData = snapshotInfo.cityCubeSampleData;
    const cubeNewCityDataRow = snapshotInfo.cityCubeNewDataRow;

    beforeAll(async () => {
        await loginPage.login(snapshotTestUser);
        await setWindowSize(browserWindow);
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
        await resetCityDataByAPI();
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await clearUserSnapshots({
            credentials: [snapshotTestUser],
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC99186_01] run snapshot by history data', async () => {
        const cityUpdated = 'Hangzhou_updated';
        await createReportSnapshots({
            credentials: snapshotTestUser,
            dossiers: [promptReportForCity],
        });
        const cityData = await getCityDataByAPI();
        cityData[0].name = cityUpdated;
        await updateCityById({ cityId: cityData[0].id, cityData: cityData[0] });
        await libraryPage.openDossier(promptReportForCity.name);
        await since('1. Grid of city on shortcut should be #{expected}, instead it is #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe(cityUpdated);
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(promptReportForCity.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await since('2. Grid of city should be #{expected}, instead it is #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Hangzhou');
    });

    it('[TC99186_02] run snapshot on subset report', async () => {
        // snapshot of subset report should always show latest data
        await resetReportState({ credentials: snapshotTestUser, report: cubeAutoReport });
        await resetBookmarksWithPrompt({
            credentials: snapshotTestUser,
            dossier: cubeAutoReport,
            type: 'report',
        });
        const resetCubePalyload = snapshotInfo.getUpdateCubeDataPayload(cubeData);
        const appendCubePayload = snapshotInfo.getUpdateCubeDataPayload(cubeNewCityDataRow);
        await replaceCubeDataByAPI(resetCubePalyload);
        await createReportSnapshots({
            credentials: snapshotTestUser,
            dossiers: [cubeAutoReport],
        });
        await libraryPage.openDossierInfoWindow(cubeAutoReport.name);
        await infoWindow.waitForSnapshotSection();
        await since('1. total snapshots of cube based dashboard should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.snapshot.getSnapshotsItemCount())
            .toBe(1);
        await infoWindow.openSnapshotFromInfoWindow({});
        await since(
            '2. After open snapshot from info window, Total rows of reset grid should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getRowCounts())
            .toBe(3);
        await takeScreenshotByElement(
            libraryPage.getNavigationBar(),
            'TC99186_02_01',
            'disable toolbar buttons on snapshot view for cube based document'
        );
        await dossierPage.goToLibrary();
        await appendCubeDataByAPI(appendCubePayload);
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(cubeAutoReport.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await since(
            '3. After append data, open snapshot from info window, Total rows of city grid should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getRowCounts())
            .toBe(4);
        await takeScreenshotByElement(
            dossierPage.getSnapshotBannerContainer(),
            'TC99186_02_02',
            'Snapshot banner of cube based dashboard'
        );
        await dossierPage.clickOpenDashboardOnSnapshotBanner();
        await since(
            '4. After click open dashboard from snapshot banner, Total rows of city grid should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getRowCounts())
            .toBe(4);
    });

    it('[TC99186_03] Report Toolbar button disablement on snapshot view', async () => {
        await createReportSnapshots({
            credentials: snapshotTestUser,
            dossiers: [promptReportForCity],
        });
        await libraryPage.openDossierInfoWindow(promptReportForCity.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await takeScreenshotByElement(
            libraryPage.getNavigationBar(),
            'TC99186_03_01',
            'disable toolbar buttons on snapshot view'
        );
        await share.openSharePanel();
        await takeScreenshotByElement(
            share.getSharePanel(),
            'TC99186_03_02',
            'disable in share menu on document snapshot view'
        );
    });

    it('[TC99186_04] manipulations on snapshot view', async () => {
        // const ucSelectorKey = 'W35003033C6BC49B68104160D321C9E11';
        await resetProductsDataByAPI();
        await resetReportState({ credentials: snapshotTestUser, report: reportForManipulation });
        await resetBookmarksWithPrompt({
            credentials: snapshotTestUser,
            dossier: reportForManipulation,
            type: 'report',
        });
        await createReportSnapshots({
            credentials: snapshotTestUser,
            dossiers: [reportForManipulation],
        });
        await libraryPage.openDossierInfoWindow(reportForManipulation.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await since('1. Snapshot banner should display, instead it is not shown.')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
        await since(
            '2. Open snapshot from info window, grid cell at (1, 0) should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Books');
        await reportGridView.sortDescending('Category');
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(reportForManipulation.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await since(
            '3. After sort descending for Category, re-open snapshot from info window, grid cell at (1, 0) should be #{expected}, instead it is #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Music');
    });

    it('[TC99186_05] check string label on snapshot banner for normal report', async () => {
        // await resetReportState({ credentials: snapshotTestUser, report: promptReportForCity });
        await createReportSnapshots({
            credentials: snapshotTestUser,
            dossiers: [promptReportForCity],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: promptReportForCity.id,
        });
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: promptReportForCity.id,
            messageId: snapshots[0].messageId,
        });
        const expectedSnapshotMsg = `Snapshot with data from ${convertUTCToLocalTime(snapshots[0].creationTime)}.`;
        await since('1. Snapshot banner message should be #{expected}, instead it is #{actual}.')
            .expect(await dossierPage.getMessageContainerInSnapshotBanner().getText())
            .toBe(expectedSnapshotMsg);
        await since('2. Snapshot banner should display, instead it is not shown.')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
        await dossierPage.dismissSnapshotBanner();
        await since('3. Snapshot banner should not display, instead it is shown.')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(false);
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: promptReportForCity.id,
            messageId: snapshots[0].messageId,
        });
        await since('4. Snapshot banner should display after re-run, instead it is not shown')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
    });

    it('[TC99186_06] show snapshot banner when linking back', async () => {
        // const linkTextKey = 'W58712E7B00C242F890AC7C87A5E960EF'; //Text link: Go to <9.1 Document, UC&CGB>
        // await resetReportState({ credentials: snapshotTestUser, report: reportForLinking });
        await createReportSnapshots({
            credentials: snapshotTestUser,
            dossiers: [reportForLinking],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: reportForLinking.id,
        });
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: reportForLinking.id,
            messageId: snapshots[0].messageId,
        });
        await since('1. Snapshot banner should display, instead it is not shown')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
        await reportGridView.clickOnGridHeader('Test-Category');
        await since('2. Snapshot banner should not display on target, instead it is shown')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(false);
        await dossierPage.goBackFromDossierLink();
        await since('3. Snapshot banner should display after link back, instead it is not shown')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
        await dossierPage.dismissSnapshotBanner();
        await reportGridView.clickOnGridHeader('Test-Category');
        await dossierPage.goBackFromDossierLink();
        await since('4. Snapshot banner should display after dismiss first then link back, instead it is not shown')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
    });

    it('[TC99186_07] run two versions of snapshots for same report', async () => {
        const cityUpdatedV1 = 'Hangzhou-A';
        const cityUpdatedV2 = 'Hangzhou-B';
        await createReportSnapshots({
            credentials: snapshotTestUser,
            dossiers: [promptReportForCity],
        });
        const snapshotsV1 = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: promptReportForCity.id,
        });
        const cityDataV1 = await getCityDataByAPI();
        cityDataV1[0].name = cityUpdatedV1;
        await updateCityById({ cityId: cityDataV1[0].id, cityData: cityDataV1[0] });
        await createReportSnapshots({
            credentials: snapshotTestUser,
            dossiers: [promptReportForCity],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: promptReportForCity.id,
        });
        const cityDataV2 = await getCityDataByAPI();
        cityDataV2[0].name = cityUpdatedV2;
        await updateCityById({ cityId: cityDataV2[0].id, cityData: cityDataV2[0] });
        await libraryPage.openSnapshotById({
            projectId: snapshotsV1[0].projectId,
            objectId: promptReportForCity.id,
            messageId: snapshotsV1[0].messageId,
        });
        await since('1. Grid of city on shortcut should be #{expected}, instead it is #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Hangzhou');
        const snapshotsV2 = snapshots.filter((snapshot) => snapshot.messageId !== snapshotsV1[0].messageId);
        await libraryPage.openSnapshotById({
            projectId: snapshotsV2[0].projectId,
            objectId: promptReportForCity.id,
            messageId: snapshotsV2[0].messageId,
        });
        await since('2. Grid of city on second snapshot should be #{expected}, instead it is #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe(cityUpdatedV1);
        await dossierPage.clickOpenDashboardOnSnapshotBanner();
        await since('3. Snapshot banner should not display after ckick open document button, instead it is shown')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(false);
        await since('4. Grid of city on shortcut should be #{expected}, instead it is #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe(cityUpdatedV2);
    });

    it('[TC99186_08] export on report snapshot view', async () => {
        await deleteFile({ name: promptReportForCity.name, fileType: '.xlsx' });
        await deleteFile({ name: promptReportForCity.name, fileType: '.pdf' });
        await createReportSnapshots({
            credentials: snapshotTestUser,
            dossiers: [promptReportForCity],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: promptReportForCity.id,
        });
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: promptReportForCity.id,
            messageId: snapshots[0].messageId,
        });
        await share.openSharePanel();
        await share.clickExportToExcel();
        await excelExportPanel.clickExportButton();
        const excelFileName = `${promptReportForCity.name}`;
        await share.waitForDownloadComplete({ name: excelFileName, fileType: '.xlsx' });
        await since(`The excel file for ${excelFileName} should be downloaded, instead it was not downloaded.`)
            .expect(await isFileNotEmpty({ name: excelFileName, fileType: '.xlsx' }))
            .toBe(true);
        await share.openExportPDFSettingsWindow();
        await excelExportPanel.clickExportButton();
        const pdfFileName = `${promptReportForCity.name}`;
        await share.waitForDownloadComplete({ name: pdfFileName, fileType: '.pdf' });
        await since(`The pdf file for ${pdfFileName} should be downloaded, instead it was not downloaded.`)
            .expect(await isFileNotEmpty({ name: pdfFileName, fileType: '.pdf' }))
            .toBe(true);
    });
});
