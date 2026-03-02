import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import createSnapshots from '../../../api/snapshot/createSnapshots.js';
import clearUserSnapshots from '../../../api/snapshot/clearUserSnapshots.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import resetDossierState from '../../../api/resetDossierState.js';
import getSnapshotsByTargetId from '../../../api/snapshot/getSnapshotsByTargetId.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { browserWindow } from '../../../constants/index.js';
import * as snapshotInfo from '../../../constants/snapshot.js';
import { convertUTCToLocalTime } from '../../../utils/timeHelper.js';
import {
    resetCityDataByAPI,
    updateCityById,
    getCityDataByAPI,
    resetSalesDataByAPI,
    resetProductsDataByAPI,
    updateSalesById,
    getSalesDataByAPI,
    replaceCubeDataByAPI,
    appendCubeDataByAPI,
} from '../../../api/whUpdate/index.js';
import { isFileNotEmpty, deleteFile } from '../../../config/folderManagement.js';

describe('Test run snapshot', () => {
    let {
        loginPage,
        libraryPage,
        share,
        subscribe,
        subscriptionDialog,
        dossierPage,
        infoWindow,
        grid,
        baseVisualization,
        toc,
        filterPanel,
        inCanvasSelector,
        excelExportPanel,
    } = browsers.pageObj1;
    const snapshotTestUser = snapshotInfo.snapshotRunUser;
    const testCityDashboard = snapshotInfo.testCityDashboard;
    const cubeBasedDashboard = snapshotInfo.cubeOnlyDashboard;
    const reportFilterDashboard = snapshotInfo.reportFilterDashboard;
    const txnDashboard = snapshotInfo.txnDashboard;
    const promptDashboard = snapshotInfo.promptDashboard;
    const subscriptionFormats = snapshotInfo.subscriptionFormats;
    const subscriptionSchedules = snapshotInfo.subscriptionSchedules;
    const cubeData = snapshotInfo.cityCubeSampleData;
    const cubeNewCityDataRow = snapshotInfo.cityCubeNewDataRow;

    beforeAll(async () => {
        await loginPage.login(snapshotTestUser);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetBookmarks({
            credentials: snapshotTestUser,
            dossier: testCityDashboard,
        });
        await resetBookmarks({
            credentials: snapshotTestUser,
            dossier: cubeBasedDashboard,
        });
        await resetBookmarks({
            credentials: snapshotTestUser,
            dossier: promptDashboard,
        });
        await resetDossierState({ credentials: snapshotTestUser, dossier: testCityDashboard });
        await resetDossierState({ credentials: snapshotTestUser, dossier: cubeBasedDashboard });
        await clearUserSnapshots({
            credentials: [snapshotTestUser],
        });
        await resetCityDataByAPI();
        await resetSalesDataByAPI();
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await clearUserSnapshots({
            credentials: [snapshotTestUser],
        });
        await logoutFromCurrentBrowser();
    });

    it('[TC97772_01] run snapshot by history data', async () => {
        const subscriptionName = 'TC97772_01 report based';
        const cityUpdated = 'Hangzhou_updated';
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
        const cityData = await getCityDataByAPI();
        cityData[0].name = cityUpdated;
        await updateCityById({ cityId: cityData[0].id, cityData: cityData[0] });
        await libraryPage.openDossier(testCityDashboard.name);
        await since('1. Grid of city on shortcut should be #{expected}, instead it is #{actual}')
            .expect(await grid.getCellValue('Visualization 1', 2, 2))
            .toBe(cityUpdated);
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await since('2. Grid of city should be #{expected}, instead it is #{actual}')
            .expect(await grid.getCellValue('Visualization 1', 2, 2))
            .toBe('Hangzhou');
        await since('3. The attribute should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 3))
            .toEqual(['2', 'Shanghai']);
    });

    it('[TC97772_02] run snapshot on cube based', async () => {
        const subscriptionName = 'TC97772_02 cube based';
        const resetCubePalyload = snapshotInfo.getUpdateCubeDataPayload(cubeData);
        const appendCubePayload = snapshotInfo.getUpdateCubeDataPayload(cubeNewCityDataRow);
        await replaceCubeDataByAPI(resetCubePalyload);
        await libraryPage.openDossier(cubeBasedDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(cubeBasedDashboard.name);
        await infoWindow.waitForSnapshotSection();
        await since('1. total snapshots of cube based dashboard should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.snapshot.getSnapshotsItemCount())
            .toBe(1);
        await infoWindow.openSnapshotFromInfoWindow({});
        await since('2. Grid of city should be #{expected}, instead it is #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(4);
        await dossierPage.goToLibrary();
        await appendCubeDataByAPI(appendCubePayload);
        await libraryPage.openDossierInfoWindow(cubeBasedDashboard.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await takeScreenshotByElement(
            libraryPage.getNavigationBar(),
            'TC97772_02_01',
            'disable toolbar buttons on snapshot view for cube based'
        );
        await since('2. Grid of city should be #{expected}, instead it is #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(5);
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(cubeBasedDashboard.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.clickManageSubscriptionsButton();
        await subscribe.clickInWindowRunNow();
        await subscribe.exitInfoWindowPDFSettingsMenu();
        await infoWindow.waitForSnapshotSection();
        await since('3. total snapshots of cube based dashboard should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.snapshot.getSnapshotsItemCount())
            .toBe(1);
        await infoWindow.openSnapshotFromInfoWindow({});
        await takeScreenshotByElement(
            dossierPage.getSnapshotBannerContainer(),
            'TC97772_02_02',
            'Snapshot banner of cube based dashboard'
        );
        await since('4. Grid of city should be #{expected}, instead it is #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(5);
        await dossierPage.clickOpenDashboardOnSnapshotBanner();
        await since('5. Grid of city after click open dashboard should be #{expected}, instead it is #{actual}')
            .expect(await grid.getRowsCount('Visualization 1'))
            .toBe(5);
    });

    it('[TC97772_03] UI disablement on snapshot view', async () => {
        const subscriptionName = 'TC97772_03';
        await libraryPage.openDossier(promptDashboard.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.createSubscription();
        await subscribe.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(promptDashboard.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await takeScreenshotByElement(
            libraryPage.getNavigationBar(),
            'TC97772_03_01',
            'disable toolbar buttons on snapshot view'
        );
        await share.openSharePanel();
        await takeScreenshotByElement(share.getSharePanel(), 'TC97772_03_02', 'disable in share menu on snapshot view');
    });

    it('[TC97772_04] manipulations on snapshot view', async () => {
        const subscriptionName = 'TC97772_04';
        const checkboxSelectorKey = 'W44C7F1A2BED44FE887FB1CE3BF60BECD'; // selector key of city in page 'Bar'
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
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await since('1. Snapshot banner should display, instead it is not shown.')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Bar' });
        await inCanvasSelector.selectItemByKey(checkboxSelectorKey, '(All)');
        await dossierPage.waitForItemLoading();
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(testCityDashboard.name);
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await toc.openMenu();
        await takeScreenshotByElement(toc.getTOCPanel(), 'TC97772_04_01', 'show page bar on snapshot view');
        await toc.closeMenu({ icon: 'close' });
        await dossierPage.dismissSnapshotBanner();
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC97772_04_02',
            'save manipulation on snapshot view'
        );
    });

    it('[TC97772_05] show history data when undo redo on snapshot view', async () => {
        const selectorKey = 'WF03D1CA00A5A4B2D9B6B51610B7683B2'; // selector key of city in page 'Grid'
        const cityUpdated = 'Hangzhou-A';
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [testCityDashboard],
        });
        const cityData = await getCityDataByAPI();
        cityData[0].name = cityUpdated;
        await updateCityById({ cityId: cityData[0].id, cityData: cityData[0] });
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await since('1. Grid of city on snapshot view should be #{expected}, instead it is #{actual}')
            .expect(await grid.getCellValue('Visualization 1', 2, 2))
            .toBe('Hangzhou');
        await inCanvasSelector.selectItemByKey(selectorKey, '3:Beijing');
        await inCanvasSelector.selectItemByKey(selectorKey, '2:Shanghai');
        await dossierPage.clickUndo();
        await dossierPage.clickRedo();
        await dossierPage.clickUndo();
        await dossierPage.clickUndo();
        await since('2. Grid of city after undo redo on snapshot view should be #{expected}, instead it is #{actual}')
            .expect(await grid.getCellValue('Visualization 1', 2, 2))
            .toBe('Hangzhou');
        await dossierPage.clickOpenDashboardOnSnapshotBanner();
        await since('3. Grid of city on shortcut should be #{expected}, instead it is #{actual}')
            .expect(await grid.getCellValue('Visualization 1', 2, 2))
            .toBe(cityUpdated);
    });

    it('[TC97772_06] check string label on snapshot banner for report based dashboard', async () => {
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [testCityDashboard],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: testCityDashboard.id,
        });
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: testCityDashboard.id,
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
            objectId: testCityDashboard.id,
            messageId: snapshots[0].messageId,
        });
        await since('4. Snapshot banner should display after re-run, instead it is not shown')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
    });

    it('[TC97772_07] show snapshot banner when linking back', async () => {
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [testCityDashboard],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: testCityDashboard.id,
        });
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: testCityDashboard.id,
            messageId: snapshots[0].messageId,
        });
        await since('1. Snapshot banner should display, instead it is not shown')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Linking' });
        await dossierPage.clickTextfieldByTitle(`Linking to report "Product sales"`);
        await since('2. Snapshot banner should not display on target, instead it is not shown')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(false);
        await dossierPage.goBackFromDossierLink();
        await since('3. Snapshot banner should display after link back, instead it is not shown')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
        await dossierPage.dismissSnapshotBanner();
        await dossierPage.clickTextfieldByTitle(`Linking to report "Product sales"`);
        await dossierPage.goBackFromDossierLink();
        await since('4. Snapshot banner should display after dismiss first then link back, instead it is not shown')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
    });

    it('[TC97772_08] run two versions of snapshots for same dashboard', async () => {
        const subscriptionName = 'TC97772_08';
        const cityUpdatedV1 = 'Hangzhou-A';
        const cityUpdatedV2 = 'Hangzhou-B';
        // await createSnapshots({
        //     credentials: snapshotTestUser,
        //     dossiers: [testCityDashboard],
        // });
        // const snapshotsV1 = await getSnapshotsByTargetId({
        //     credentials: snapshotTestUser,
        //     targetId: testCityDashboard.id,
        // });
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
        const cityDataV1 = await getCityDataByAPI();
        cityDataV1[0].name = cityUpdatedV1;
        await updateCityById({ cityId: cityDataV1[0].id, cityData: cityDataV1[0] });
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.clickManageSubscriptionsButton();
        await subscribe.clickInWindowRunNow();
        await subscribe.exitInfoWindowPDFSettingsMenu();
        await infoWindow.waitForSnapshotSection();
        // const snapshots = await getSnapshotsByTargetId({
        //     credentials: snapshotTestUser,
        //     targetId: testCityDashboard.id,
        // });
        const cityDataV2 = await getCityDataByAPI();
        cityDataV2[0].name = cityUpdatedV2;
        await updateCityById({ cityId: cityDataV2[0].id, cityData: cityDataV2[0] });
        // await libraryPage.openSnapshotById({
        //     projectId: snapshotsV1[0].projectId,
        //     objectId: testCityDashboard.id,
        //     messageId: snapshotsV1[0].messageId,
        // });
        await infoWindow.openSnapshotFromInfoWindow({ index: 1 });
        await since('1. Grid of city first snapshot should be #{expected}, instead it is #{actual}')
            .expect(await grid.getCellValue('Visualization 1', 2, 2))
            .toBe('Hangzhou');
        // const snapshotsV2 = snapshots.filter((snapshot) => snapshot.messageId !== snapshotsV1[0].messageId);
        // await libraryPage.openSnapshotById({
        //     projectId: snapshotsV2[0].projectId,
        //     objectId: testCityDashboard.id,
        //     messageId: snapshotsV2[0].messageId,
        // });
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await since('2. Grid of city on second snapshot should be #{expected}, instead it is #{actual}')
            .expect(await grid.getCellValue('Visualization 1', 2, 2))
            .toBe(cityUpdatedV1);
        await dossierPage.clickOpenDashboardOnSnapshotBanner();
        await since('3. Grid of city on shortcut should be #{expected}, instead it is #{actual}')
            .expect(await grid.getCellValue('Visualization 1', 2, 2))
            .toBe(cityUpdatedV2);
    });

    it('[TC97772_09] export to excel on snapshot view', async () => {
        const subscriptionName = 'TC97772_09';
        await deleteFile({ name: testCityDashboard.name, fileType: '.xlsx' });
        // await createSnapshots({
        //     credentials: snapshotTestUser,
        //     dossiers: [testCityDashboard],
        // });
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
        // const snapshots = await getSnapshotsByTargetId({
        //     credentials: snapshotTestUser,
        //     targetId: testCityDashboard.id,
        // });
        const salesData = await getSalesDataByAPI();
        salesData[0].sales = 500;
        await updateSalesById({ salesId: salesData[0].id, salesData: salesData[0] });
        // await libraryPage.openSnapshotById({
        //     projectId: snapshots[0].projectId,
        //     objectId: testCityDashboard.id,
        //     messageId: snapshots[0].messageId,
        // });
        await libraryPage.openDossierInfoWindow(testCityDashboard.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await since('1. Grid of city first snapshot should be #{expected}, instead it is #{actual}')
            .expect(await grid.getCellValue('Visualization 2', 2, 2))
            .toBe('300');
        await share.openSharePanel();
        await share.clickExportToExcel();
        await excelExportPanel.clickExportButton();
        const excelFileName = `${testCityDashboard.name}_Grid`;
        await share.waitForDownloadComplete({ name: excelFileName, fileType: '.xlsx' });
        await since(`The excel file for ${excelFileName} should be downloaded, instead it was not downloaded.`)
            .expect(await isFileNotEmpty({ name: excelFileName, fileType: '.xlsx' }))
            .toBe(true);
    });

    it('[TC97772_10] disable transaction in snapshot view', async () => {
        await resetBookmarks({
            credentials: snapshotTestUser,
            dossier: txnDashboard,
        });
        await resetDossierState({ credentials: snapshotTestUser, dossier: txnDashboard });
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [txnDashboard],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: txnDashboard.id,
        });
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: txnDashboard.id,
            messageId: snapshots[0].messageId,
        });
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC97772_10_01',
            'disable transaction in snapshot view'
        );
        await dossierPage.clickOpenDashboardOnSnapshotBanner();
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC97772_10_02',
            'enable transaction in shortcut view'
        );
    });

    it('[TC97772_11] disable alert and add to insight in snapshot view', async () => {
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [testCityDashboard],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: testCityDashboard.id,
        });
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: testCityDashboard.id,
            messageId: snapshots[0].messageId,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'KPI' });
        await baseVisualization.openVisualizationMenu({
            elem: baseVisualization.getVisualizationMenuButton('Visualization 1'),
        });
        await baseVisualization.hover({ elem: baseVisualization.getContainerByTitle('Visualization 1') });
        await takeScreenshotByElement(
            baseVisualization.getContextMenuByLevel(0),
            'TC97772_11_01',
            'disable alert and add to insight in snapshot view'
        );
        await dossierPage.clickOpenDashboardOnSnapshotBanner();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'KPI' });
        await baseVisualization.openVisualizationMenu({
            elem: baseVisualization.getVisualizationMenuButton('Visualization 1'),
        });
        await baseVisualization.hover({ elem: baseVisualization.getContainerByTitle('Visualization 1') });
        await takeScreenshotByElement(
            baseVisualization.getContextMenuByLevel(0),
            'TC97772_11_02',
            'enable alert and add to insight in shortcut view'
        );
    });

    it('[TC97772_12] disable push down filter and selector in snapshot view', async () => {
        await resetProductsDataByAPI();
        await resetBookmarks({
            credentials: snapshotTestUser,
            dossier: reportFilterDashboard,
        });
        await resetDossierState({ credentials: snapshotTestUser, dossier: reportFilterDashboard });
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [reportFilterDashboard],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: reportFilterDashboard.id,
        });
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: reportFilterDashboard.id,
            messageId: snapshots[0].messageId,
        });
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(
            filterPanel.getFilterMainPanel(),
            'TC97772_12_01',
            'disable push down filter in filter panel'
        );
        await since('1. total disabled filter item should be #{expected}, instead we have #{actual}.')
            .expect(await filterPanel.getLockedFilterItems().length)
            .toBe(6);

        await filterPanel.closeFilterPanel();
        await dossierPage.dismissSnapshotBanner();
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC97772_12_02',
            'disable push down filter on incanvas selector in snapshot view'
        );
        await dossierPage.goToLibrary();
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: reportFilterDashboard.id,
            messageId: snapshots[0].messageId,
        });
        await dossierPage.clickOpenDashboardOnSnapshotBanner();
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC97772_12_03',
            'enable push down filter on incanvas selector in snapshot view'
        );
        await filterPanel.openFilterPanel();
        await takeScreenshotByElement(
            filterPanel.getFilterMainPanel(),
            'TC97772_12_04',
            'enable push down filter in filter panel'
        );
        await since('2. total disabled filter item should be #{expected}, instead we have #{actual}.')
            .expect(await filterPanel.getLockedFilterItems().length)
            .toBe(0);
        await dossierPage.goToLibrary();
    });
});
