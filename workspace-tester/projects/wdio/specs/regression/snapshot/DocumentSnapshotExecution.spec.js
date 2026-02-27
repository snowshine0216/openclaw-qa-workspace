import setWindowSize from '../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import createSnapshots from '../../../api/snapshot/createSnapshots.js';
import clearUserSnapshots from '../../../api/snapshot/clearUserSnapshots.js';
import resetBookmarks from '../../../api/resetBookmarks.js';
import resetBookmarksWithPrompt from '../../../api/resetBookmarksWithPrompt.js';
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

describe('Test run document snapshot', () => {
    let {
        loginPage,
        libraryPage,
        share,
        subscribe,
        subscriptionDialog,
        dossierPage,
        infoWindow,
        baseVisualization,
        rsdPage,
        toc,
        filterPanel,
        excelExportPanel,
        pdfExportWindow,
    } = browsers.pageObj1;
    const snapshotTestUser = snapshotInfo.snapshotRunUser;
    const promptDocumentForCity = snapshotInfo.promptDocumentForCity;
    const cubeBasedDocumentForCity = snapshotInfo.cubeBasedDocumentForCity;
    const rwdForManipulation = snapshotInfo.rwdForManipulation;
    const rwdForLinking = snapshotInfo.rwdForLinking;
    const subscriptionFormats = snapshotInfo.subscriptionFormats;
    const subscriptionSchedules = snapshotInfo.subscriptionSchedules;

    const cubeData = snapshotInfo.cityCubeSampleData;
    const cubeNewCityDataRow = snapshotInfo.cityCubeNewDataRow;

    beforeAll(async () => {
        await loginPage.login(snapshotTestUser);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({ credentials: snapshotTestUser, dossier: promptDocumentForCity });
        await resetBookmarksWithPrompt({
            credentials: snapshotTestUser,
            dossier: promptDocumentForCity,
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

    it('[TC99183_01] run snapshot by history data', async () => {
        const subscriptionName = 'TC99183_01';
        const cityUpdated = 'Hangzhou_updated';
        // await createSnapshots({
        //     credentials: snapshotTestUser,
        //     dossiers: [promptDocumentForCity],
        // });
        await libraryPage.openDossier(promptDocumentForCity.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.createSubscription();
        await subscriptionDialog.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        const cityData = await getCityDataByAPI();
        cityData[0].name = cityUpdated;
        await updateCityById({ cityId: cityData[0].id, cityData: cityData[0] });
        await libraryPage.openDossier(promptDocumentForCity.name);
        const grid = rsdPage.findGridById('K44');
        await since('1. Grid of city on shortcut should be #{expected}, instead it is #{actual}')
            .expect(await grid.getGridCellInRow(2, 2))
            .toBe(cityUpdated);
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(promptDocumentForCity.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await since('2. Grid of city should be #{expected}, instead it is #{actual}')
            .expect(await grid.getGridCellInRow(2, 2))
            .toBe('Hangzhou');
    });

    it('[TC99183_02] run snapshot on cube based document', async () => {
        await resetDossierState({ credentials: snapshotTestUser, dossier: cubeBasedDocumentForCity });
        await resetBookmarksWithPrompt({
            credentials: snapshotTestUser,
            dossier: cubeBasedDocumentForCity,
        });
        const resetCubePalyload = snapshotInfo.getUpdateCubeDataPayload(cubeData);
        const appendCubePayload = snapshotInfo.getUpdateCubeDataPayload(cubeNewCityDataRow);
        await replaceCubeDataByAPI(resetCubePalyload);
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [cubeBasedDocumentForCity],
        });
        await libraryPage.openDossierInfoWindow(cubeBasedDocumentForCity.name);
        await infoWindow.waitForSnapshotSection();
        await since('1. total snapshots of cube based dashboard should be #{expected}, instead we have #{actual}')
            .expect(await infoWindow.snapshot.getSnapshotsItemCount())
            .toBe(1);
        await infoWindow.openSnapshotFromInfoWindow({});
        await dossierPage.waitForDossierLoading();
        const grid = rsdPage.findGridById('K5CB3EAD93C4B1DEFA4A2858263B4F2B6');
        await since('2. Total rows of reset grid should be #{expected}, instead it is #{actual}')
            .expect(await grid.getTotalRows())
            .toBe(4);
        await takeScreenshotByElement(
            libraryPage.getNavigationBar(),
            'TC99183_02_01',
            'disable toolbar buttons on snapshot view for cube based document'
        );
        await dossierPage.goToLibrary();
        await appendCubeDataByAPI(appendCubePayload);
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(cubeBasedDocumentForCity.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await since('3. Total rows of city grid should be #{expected}, instead it is #{actual}')
            .expect(await grid.getTotalRows())
            .toBe(5);
        await takeScreenshotByElement(
            dossierPage.getSnapshotBannerContainer(),
            'TC99183_02_02',
            'Snapshot banner of cube based dashboard'
        );
        await dossierPage.clickOpenDashboardOnSnapshotBanner();
        await since(
            '4. Total rows of city grid after click open dashboard should be #{expected}, instead it is #{actual}'
        )
            .expect(await grid.getTotalRows())
            .toBe(5);
    });

    it('[TC99183_03] Document Toolbar button disablement on snapshot view', async () => {
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [promptDocumentForCity],
        });
        await libraryPage.openDossierInfoWindow(promptDocumentForCity.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(
            libraryPage.getNavigationBar(),
            'TC99183_03_01',
            'disable toolbar buttons on snapshot view'
        );
        await share.openSharePanel();
        await takeScreenshotByElement(
            share.getSharePanel(),
            'TC99183_03_02',
            'disable in share menu on document snapshot view'
        );
    });

    it('[TC99183_04] manipulations on snapshot view', async () => {
        const ucSelectorKey = 'W35003033C6BC49B68104160D321C9E11';
        await resetProductsDataByAPI();
        await resetDossierState({ credentials: snapshotTestUser, dossier: rwdForManipulation });
        await resetBookmarksWithPrompt({
            credentials: snapshotTestUser,
            dossier: rwdForManipulation,
        });
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [rwdForManipulation],
        });
        await libraryPage.openDossierInfoWindow(rwdForManipulation.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await dossierPage.waitForDossierLoading();
        await since('1. Snapshot banner should display, instead it is not shown.')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Layout 1 - UC' });
        await rsdPage.groupBy.changeGroupBy('(All)');
        const ucSelector = rsdPage.findSelectorByKey(ucSelectorKey);
        await ucSelector.dropdown.openDropdownAndMultiSelect(['business']);
        await dossierPage.goToLibrary();
        await libraryPage.openDossierInfoWindow(rwdForManipulation.name);
        await infoWindow.waitForSnapshotSection();
        await infoWindow.openSnapshotFromInfoWindow({});
        await toc.openMenu();
        await takeScreenshotByElement(toc.getTOCPanel(), 'TC99183_04_01', 'toc on snapshot view');
        await toc.closeMenu({ icon: 'close' });
        await since('2. Group by in snapshot view should be be #{expected}, instead it is #{actual}.')
            .expect(await rsdPage.groupBy.getCurrentSelection())
            .toBe('(All)');
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC99183_04_02',
            'save manipulation on snapshot view'
        );
    });

    it('[TC99183_05] check string label on snapshot banner for report based document', async () => {
        await resetDossierState({ credentials: snapshotTestUser, dossier: promptDocumentForCity });
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [promptDocumentForCity],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: promptDocumentForCity.id,
        });
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: promptDocumentForCity.id,
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
            objectId: promptDocumentForCity.id,
            messageId: snapshots[0].messageId,
        });
        await since('4. Snapshot banner should display after re-run, instead it is not shown')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
    });

    it('[TC99183_06] show snapshot banner when linking back', async () => {
        const linkTextKey = 'W58712E7B00C242F890AC7C87A5E960EF'; //Text link: Go to <9.1 Document, UC&CGB>
        await resetDossierState({ credentials: snapshotTestUser, dossier: rwdForLinking });
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [rwdForLinking],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: rwdForLinking.id,
        });
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: rwdForLinking.id,
            messageId: snapshots[0].messageId,
        });
        await since('1. Snapshot banner should display, instead it is not shown')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
        await rsdPage.textField.clickTextFieldByKey(linkTextKey);
        await since('2. Snapshot banner should not display on target, instead it is shown')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(false);
        await dossierPage.goBackFromDossierLink();
        await since('3. Snapshot banner should display after link back, instead it is not shown')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
        await dossierPage.dismissSnapshotBanner();
        await rsdPage.textField.clickTextFieldByKey(linkTextKey);
        await dossierPage.goBackFromDossierLink();
        await since('4. Snapshot banner should display after dismiss first then link back, instead it is not shown')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
    });

    it('[TC99183_07] run two versions of snapshots for same document', async () => {
        const subscriptionName = 'TC99183_07';
        const cityUpdatedV1 = 'Hangzhou-A';
        const cityUpdatedV2 = 'Hangzhou-B';
        // await createSnapshots({
        //     credentials: snapshotTestUser,
        //     dossiers: [promptDocumentForCity],
        // });
        await libraryPage.openDossier(promptDocumentForCity.name);
        await share.openSharePanel();
        await share.openSubscribeSettingsWindow();
        await subscriptionDialog.updateSubscriptionName(subscriptionName);
        await subscriptionDialog.inputEmailSubject(subscriptionName);
        await subscriptionDialog.selectFormat(subscriptionFormats.snapshot);
        await subscriptionDialog.selectSchedule(subscriptionSchedules.booksClosed);
        await subscriptionDialog.clickSendNowCheckbox();
        await subscriptionDialog.createSubscription();
        await subscriptionDialog.waitForSubscriptionCreated();
        await dossierPage.goToLibrary();
        const snapshotsV1 = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: promptDocumentForCity.id,
        });
        const cityDataV1 = await getCityDataByAPI();
        cityDataV1[0].name = cityUpdatedV1;
        await updateCityById({ cityId: cityDataV1[0].id, cityData: cityDataV1[0] });
        // await createSnapshots({
        //     credentials: snapshotTestUser,
        //     dossiers: [promptDocumentForCity],
        // });
        await libraryPage.openDossierInfoWindow(promptDocumentForCity.name);
        await infoWindow.clickManageSubscriptionsButton();
        await subscriptionDialog.clickInWindowRunNow();
        await subscribe.exitInfoWindowPDFSettingsMenu();
        await infoWindow.close();
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: promptDocumentForCity.id,
        });
        const cityDataV2 = await getCityDataByAPI();
        cityDataV2[0].name = cityUpdatedV2;
        await updateCityById({ cityId: cityDataV2[0].id, cityData: cityDataV2[0] });
        await libraryPage.openSnapshotById({
            projectId: snapshotsV1[0].projectId,
            objectId: promptDocumentForCity.id,
            messageId: snapshotsV1[0].messageId,
        });
        const grid = rsdPage.findGridById('K44');
        await since('1. Grid of city on shortcut should be #{expected}, instead it is #{actual}')
            .expect(await grid.getGridCellInRow(2, 2))
            .toBe('Hangzhou');
        const snapshotsV2 = snapshots.filter((snapshot) => snapshot.messageId !== snapshotsV1[0].messageId);
        await libraryPage.openSnapshotById({
            projectId: snapshotsV2[0].projectId,
            objectId: promptDocumentForCity.id,
            messageId: snapshotsV2[0].messageId,
        });
        await since('2. Grid of city on second snapshot should be #{expected}, instead it is #{actual}')
            .expect(await grid.getGridCellInRow(2, 2))
            .toBe(cityUpdatedV1);
        await dossierPage.clickOpenDashboardOnSnapshotBanner();
        await since('3. Snapshot banner should not display after ckick open document button, instead it is shown')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(false);
        await since('4. Grid of city on shortcut should be #{expected}, instead it is #{actual}')
            .expect(await grid.getGridCellInRow(2, 2))
            .toBe(cityUpdatedV2);
    });

    it('[TC99183_08] export on document snapshot view', async () => {
        await deleteFile({ name: promptDocumentForCity.name, fileType: '.xlsx' });
        await deleteFile({ name: promptDocumentForCity.name, fileType: '.pdf' });
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [promptDocumentForCity],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: promptDocumentForCity.id,
        });
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: promptDocumentForCity.id,
            messageId: snapshots[0].messageId,
        });
        await share.openSharePanel();
        await share.clickExportToExcel();
        await excelExportPanel.clickExportButton();
        const excelFileName = `${promptDocumentForCity.name}`;
        await share.waitForDownloadComplete({ name: excelFileName, fileType: '.xlsx' });
        await since(`The excel file for ${excelFileName} should be downloaded, instead it was not downloaded.`)
            .expect(await isFileNotEmpty({ name: excelFileName, fileType: '.xlsx' }))
            .toBe(true);
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.exportSubmitDossier();
        const pdfFileName = `${promptDocumentForCity.name}`;
        await share.waitForDownloadComplete({ name: pdfFileName, fileType: '.pdf' });
        await since(`The pdf file for ${pdfFileName} should be downloaded, instead it was not downloaded.`)
            .expect(await isFileNotEmpty({ name: pdfFileName, fileType: '.pdf' }))
            .toBe(true);
    });

    it('[TC99183_09] disable transaction in document snapshot view', async () => {
        const rwdForTransaction = snapshotInfo.rwdForTransaction;
        await resetDossierState({ credentials: snapshotTestUser, dossier: rwdForTransaction });
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [rwdForTransaction],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: rwdForTransaction.id,
        });
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: rwdForTransaction.id,
            messageId: snapshots[0].messageId,
        });
        await since('1. Snapshot banner should display, instead it is not shown.')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC99183_09_01',
            'disable txn action buttons in snapshot view'
        );
        await dossierPage.clickOpenDashboardOnSnapshotBanner();
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC99183_09_02',
            'enable txn action buttons in shortcut view'
        );
    });

    it('[TC99183_10] disable selector target on dataset in document snapshot view', async () => {
        const selectorChapter = 'Layout 3 - Select datasets as target';
        await resetProductsDataByAPI();
        await resetBookmarks({
            credentials: snapshotTestUser,
            dossier: rwdForManipulation,
        });
        await resetDossierState({ credentials: snapshotTestUser, dossier: rwdForManipulation });
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [rwdForManipulation],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: rwdForManipulation.id,
        });
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: rwdForManipulation.id,
            messageId: snapshots[0].messageId,
        });
        await toc.openMenu();
        await toc.goToPage({ chapterName: selectorChapter });
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC99183_10_01',
            'disable selector target on dataset in snapshot view'
        );
        const selector = rsdPage.findSelectorByKey('WE9523A0031184CB7843A7A6EF8C2AA8F');
        await since('1. Selector targets on dataset should be disable, instead it is enabled.')
            .expect(await selector.getElement().getAttribute('style'))
            .toContain('pointer-events: none');
        await dossierPage.clickOpenDashboardOnSnapshotBanner();
        await toc.openMenu();
        await toc.goToPage({ chapterName: selectorChapter });
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC99183_10_02',
            'enable selector target on dataset in snapshot view'
        );
        await selector.dropdown.openDropdown();
        await selector.dropdown.selectNthItem(2);
        const grid = rsdPage.findGridById('W14E02B19892A4E089CC4A3DF698F72EF');
        await since('2. Total rows of the grid should be #{expected}, instead it is #{actual}')
            .expect(await grid.getTotalRows())
            .toBe(4);
        await since('3. Grid cell on right bottom corner should be #{expected}, instead it is #{actual}')
            .expect(await grid.getGridCellInRow(4, 2))
            .toBe('20');
    });

    it('[TC99183_11] disable grid graph selector target on dataset in document snapshot view', async () => {
        const rwdForGridGraph = snapshotInfo.rwdForGridGraph;
        const chapter1 = 'Layout 1 - target on dataset';
        await resetProductsDataByAPI();
        await resetBookmarks({
            credentials: snapshotTestUser,
            dossier: rwdForGridGraph,
        });
        await resetDossierState({ credentials: snapshotTestUser, dossier: rwdForGridGraph });
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [rwdForGridGraph],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: rwdForGridGraph.id,
        });
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: rwdForGridGraph.id,
            messageId: snapshots[0].messageId,
        });
        await toc.openMenu();
        await toc.goToPage({ chapterName: chapter1 });
        await since('1. Snapshot banner should display, instead it is not shown.')
            .expect(await dossierPage.getSnapshotBannerContainer().isDisplayed())
            .toBe(true);
        const selectorGrid = rsdPage.findGridById('K44');
        await selectorGrid.clickCellFromLocation(3, 1); // Electronics
        await selectorGrid.clickCellFromLocation(2, 1); // Books
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC99183_11_01',
            'disable grid graph selector target on dataset in snapshot view'
        );
        const selectorGraph = rsdPage.graph.findGraphByIdContains('K44');
        await selectorGraph.clickOnRectArea(['Books']);
        const targetGrid = rsdPage.findGridById('WD39B14C3D37A471893D74E3FFF8A0024');
        await since('2. Target grid cell before change selection should be #{expected}, instead it is #{actual}')
            .expect(await targetGrid.getGridCellInRow(4, 1))
            .toContain('cameras');
        await dossierPage.clickOpenDashboardOnSnapshotBanner();
        await toc.openMenu();
        await toc.goToPage({ chapterName: chapter1 });
        await selectorGrid.clickCellFromLocation(2, 1); // Books
        await rsdPage.graph.waitForGraphLoading();
        await since('3. Target grid cell after change selection should be #{expected}, instead it is #{actual}')
            .expect(await targetGrid.getGridCellInRow(4, 1))
            .toContain('sports');
        await takeScreenshotByElement(
            rsdPage.getDocLayoutViewer(),
            'TC99183_11_02',
            'enable grid graph targets on dataset in snapshot view'
        );
        await selectorGraph.clickOnRectArea(['Electronics']);
        await since('4. Target grid cell after change selection should be #{expected}, instead it is #{actual}')
            .expect(await targetGrid.getGridCellInRow(4, 1))
            .toContain('cameras');
    });

    it('[TC99183_12] drill on document snapshot view', async () => {
        const drillChapter = 'Layout 5 - Drill';
        await resetProductsDataByAPI();
        await resetBookmarks({
            credentials: snapshotTestUser,
            dossier: rwdForManipulation,
        });
        await resetDossierState({ credentials: snapshotTestUser, dossier: rwdForManipulation });
        await createSnapshots({
            credentials: snapshotTestUser,
            dossiers: [rwdForManipulation],
        });
        const snapshots = await getSnapshotsByTargetId({
            credentials: snapshotTestUser,
            targetId: rwdForManipulation.id,
        });
        await libraryPage.openSnapshotById({
            projectId: snapshots[0].projectId,
            objectId: rwdForManipulation.id,
            messageId: snapshots[0].messageId,
        });
        await toc.openMenu();
        await toc.goToPage({ chapterName: drillChapter });
        await takeScreenshotByElement(rsdPage.getDocLayoutViewer(), 'TC99183_12_01', 'only category');
        const grid = rsdPage.findGridById('WB2B68FBE9FCB4E82B1DEACE9CFB319FD');
        await grid.selectContextMenuOnCell('Books', ['Drill', 'Test-Subcategory']); // drill on books
        await since(
            '1. Grid metric of subcategory business in first row should be #{expected}, instead it is #{actual}.'
        )
            .expect(await grid.getGridCellInRow(2, 3))
            .toBe('50');
        await since('2. Grid metric of subcategory art in second row should be #{expected}, instead it is #{actual}')
            .expect(await grid.getGridCellInRow(3, 3))
            .toBe('40');
        await since('3. Grid metric of subcategory sports in third row should be #{expected}, instead it is #{actual}')
            .expect(await grid.getGridCellInRow(4, 3))
            .toBe('20');
        await dossierPage.clickOpenDashboardOnSnapshotBanner();
        await toc.openMenu();
        await toc.goToPage({ chapterName: drillChapter });
        await takeScreenshotByElement(rsdPage.getDocLayoutViewer(), 'TC99183_12_02', 'drill not on shortcut');
    });
});
