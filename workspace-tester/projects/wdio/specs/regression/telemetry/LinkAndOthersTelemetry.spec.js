import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import * as telemetryInfo from '../../../constants/telemetry.js';
import { validateRecord } from '../../../utils/telemetryAssert.js';

describe('Test resume viewing manipulation | linking | Bot', () => {
    const resumeViewingMinutes = 6;
    const resumeViewingTime = resumeViewingMinutes * 60000;

    let {
        loginPage,
        telemetry,
        libraryPage,
        tocMenu,
        reset,
        inCanvasSelector,
        dossierPage,
        textbox,
        grid,
        libraryAuthoringPage,
        infoWindow,
        dossierAuthoringPage,
    } = browsers.pageObj1;
    let record;

    beforeAll(async () => {
        await loginPage.login(telemetryInfo.telemetryUser);
        await setWindowSize(browserWindow);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC87881_01] Timeout after no activity in browser', async () => {
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);
        record = await telemetry.getExecutionRecord();
        await since('Dossier user execution, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1);

        // Reset dossier if not in original state
        await reset.resetIfEnabled();

        // Perform manipulation
        await inCanvasSelector.selectItem(telemetryInfo.categorySelector[0]); //Books
        record = await telemetry.getManipulationRecord();
        await since('Dossier user execution, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1001);

        // Wait for timeout to trigger resume viewing manipulation
        console.log('Waiting for resume viewing manipulation to trigger...');
        await dossierPage.sleep(resumeViewingTime);
        console.log('Resume viewing manipulation triggered');

        // Open and close TOC to resume activity in browser
        await tocMenu.openMenu();
        await tocMenu.closeMenu();
        record = await telemetry.getManipulationRecord();
        await validateRecord(record, {
            testCase: 'Dossier user execution',
            CLIENTACTIONTYPEID: 1020,
            MANIPSEQUENCEID: 2,
            // MANIPITEMPATH: 'Category',
            // MANIPVALUE: 'Electronics;Movies;Music',
        });

        // Perform another manipulation
        await inCanvasSelector.selectItem(telemetryInfo.categorySelector[2]); // Music
        record = await telemetry.getManipulationRecord();
        await since('Dossier user execution, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1001);

        await dossierPage.goToLibrary();
    });

    it('[TC87881_02] Timeout after switch to another tab', async () => {
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);
        record = await telemetry.getExecutionRecord();
        await since('Dossier user execution, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1);

        // Reset dossier if not in original state
        await reset.resetIfEnabled();

        // Perform manipulation
        await inCanvasSelector.selectItem(telemetryInfo.categorySelector[0]); //Books
        record = await telemetry.getManipulationRecord();
        await since('Dossier user execution, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1001);

        // Open a new browser tab
        await libraryPage.executeScript('window.open()');

        // Wait for timeout to trigger resume viewing manipulation
        console.log('Waiting for resume viewing manipulation to trigger...');
        await dossierPage.sleep(resumeViewingTime);
        console.log('Resume viewing manipulation triggered');

        // Switch back to the original tab
        await libraryPage.switchToTab(0);

        // Open and close TOC to resume activity in browser
        await tocMenu.openMenu();
        await tocMenu.closeMenu();
        record = await telemetry.getManipulationRecord();
        await validateRecord(record, {
            testCase: 'Dossier user execution',
            CLIENTACTIONTYPEID: 1020,
            MANIPSEQUENCEID: 2,
        });

        // Perform another manipulation
        await inCanvasSelector.selectItem(telemetryInfo.categorySelector[2]); // Music
        record = await telemetry.getManipulationRecord();
        await since('Dossier user execution, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1001);

        await dossierPage.goToLibrary();
        await telemetry.closeTabByScript(1);
    });

    it('[TC87881_03] Idle time not long enough to trigger resume viewing', async () => {
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);
        record = await telemetry.getExecutionRecord();
        await since('Dossier user execution, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1);

        // Reset dossier if not in original state
        await reset.resetIfEnabled();

        // Perform manipulation
        await inCanvasSelector.selectItem(telemetryInfo.categorySelector[0]); //Books
        record = await telemetry.getManipulationRecord();
        await since('Dossier user execution, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1001);

        // Wait for 4 minutes, not long enough to trigger resume viewing manipulation
        await dossierPage.sleep(resumeViewingTime - 60000 * 3);

        // Switch back to the original tab
        await libraryPage.switchToTab(0);

        // Open and close TOC to resume activity in browser
        await tocMenu.openMenu();
        await tocMenu.closeMenu();

        // Record should still be the last manipulation record since resume viewing manipulation was not triggered
        record = await telemetry.getManipulationRecord();
        await since('Dossier user execution, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1001);

        // Perform another manipulation
        await inCanvasSelector.selectItem(telemetryInfo.categorySelector[2]); // Music
        record = await telemetry.getManipulationRecord();
        await since('Dossier user execution, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1001);

        await dossierPage.goToLibrary();
    });

    it('[TC89157_01] Link to dossier', async () => {
        await libraryPage.openDossier(telemetryInfo.linkDashboardA.name);
        record = await telemetry.getExecutionRecord();
        await since('Dossier linking_0101, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1);
        await since('Dossier linking_0101, OBJECTID should be #{expected}, instead we have #{actual}')
            .expect(record.OBJECTID)
            .toEqual(telemetryInfo.linkDashboardA.id);

        // Click link to Dossier B
        await textbox.navigateLink(0);
        await dossierPage.waitForDossierLoading();
        record = await telemetry.getExecutionRecord();
        await since('Dossier linking_0102, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1);
        await since('Dossier linking_0102, OBJECTID should be #{expected}, instead we have #{actual}')
            .expect(record.OBJECTID)
            .toEqual(telemetryInfo.linkDashboardB.id);

        // Perform manipulation
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Category',
            firstOption: 'Sort Ascending',
        });
        record = await telemetry.getManipulationRecord();
        await since('Dossier linking_0103, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1006);
        await since('Dossier linking_0103, OBJECTID should be #{expected}, instead we have #{actual}')
            .expect(record.OBJECTID)
            .toEqual(telemetryInfo.linkDashboardB.id);

        await dossierPage.goToLibrary();
    });

    it('[TC89157_02] Link to two dossiers', async () => {
        await libraryPage.openDossier(telemetryInfo.linkDashboardA.name);

        // Click link to Dossier B
        await textbox.navigateLink(0);
        await dossierPage.waitForDossierLoading();

        // Click link to Dossier C
        await textbox.navigateLink(0);
        await dossierPage.waitForDossierLoading();
        record = await telemetry.getExecutionRecord();
        await since('Dossier linking, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1);
        await since('Dossier linking, OBJECTID should be #{expected}, instead we have #{actual}')
            .expect(record.OBJECTID)
            .toEqual(telemetryInfo.linkDashboardC.id);

        // Perform manipulation
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Category',
            elementName: telemetryInfo.categorySelector[0],
            firstOption: 'Keep Only',
        });
        record = await telemetry.getManipulationRecord();
        await since('Dossier linking, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1012);
        await since('Dossier linking, OBJECTID should be #{expected}, instead we have #{actual}')
            .expect(record.OBJECTID)
            .toEqual(telemetryInfo.linkDashboardC.id);

        await dossierPage.goToLibrary();
    });

    it('[TC89157_03] Link to dossier and go back', async () => {
        await libraryPage.openDossier(telemetryInfo.linkDashboardA.name);

        // Click link to Dossier B
        await textbox.navigateLink(0);
        await dossierPage.waitForDossierLoading();

        // Go back to Dossier A
        await dossierPage.previousPage();
        await dossierPage.waitForDossierLoading();
        record = await telemetry.getExecutionRecord();
        await since('Dossier linking, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1);
        await since('Dossier linking, OBJECTID should be #{expected}, instead we have #{actual}')
            .expect(record.OBJECTID)
            .toEqual(telemetryInfo.linkDashboardA.id);

        // Perform manipulation
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Revenue',
            firstOption: 'Show Totals',
        });
        record = await telemetry.getManipulationRecord();
        await since('Dossier linking, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1013);
        await since('Dossier linking, OBJECTID should be #{expected}, instead we have #{actual}')
            .expect(record.OBJECTID)
            .toEqual(telemetryInfo.linkDashboardA.id);

        await dossierPage.goToLibrary();
    });

    it('[TC89157_04] Link to two dossiers and go back', async () => {
        await libraryPage.openDossier(telemetryInfo.linkDashboardA.name);

        // Click link to Dossier B
        await textbox.navigateLink(0);
        await dossierPage.waitForDossierLoading();
        // Click link to Dossier C
        await textbox.navigateLink(0);
        await dossierPage.waitForDossierLoading();

        // Go back to Dossier B
        await dossierPage.previousPage();
        await dossierPage.waitForDossierLoading();
        record = await telemetry.getExecutionRecord();
        await since('Dossier linking, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1);
        await since('Dossier linking, OBJECTID should be #{expected}, instead we have #{actual}')
            .expect(record.OBJECTID)
            .toEqual(telemetryInfo.linkDashboardB.id);
        await dossierPage.goToLibrary();
    });

    it('[TC95259] Test no telemetry data for  Bot', async () => {
        // create a new Bot
        await libraryAuthoringPage.clickNewDossierIcon();
        await libraryAuthoringPage.openCreateNewBotDialog();
        await libraryAuthoringPage.clickCreateWithNewDataButton();
        await libraryAuthoringPage.clickDataImportDialogSampleFiles();
        await libraryAuthoringPage.selectSampleFileByIndex(0);
        await libraryAuthoringPage.clickDataImportDialogImportButton();
        await libraryAuthoringPage.clickDataImportDialogCreateButton();
        await libraryAuthoringPage.clickHomeIcon();
        record = await telemetry.getExecutionRecord();

        await since('Telemetry execution record should not exist for creating a Bot').expect(record).toBeNull();

        // edit Bot Telemetry_TC95259
        await libraryPage.openDossierInfoWindow(telemetryInfo.salaryBot);
        await infoWindow.clickEditButton();
        await dossierPage.goToLibrary();
        record = await telemetry.getExecutionRecord();

        await since('Telemetry execution record should not exist for editing a Bot').expect(record).toBeNull();

        // execute Bot Telemetry_TC95259
        await libraryPage.openBot(telemetryInfo.salaryBot);
        await dossierPage.goToLibrary();
        record = await telemetry.getExecutionRecord();

        await since('Telemetry execution record should not exist for executing a Bot').expect(record).toBeNull();
    });

    it('[TC84922] Test edit execution from info window', async () => {
        await libraryPage.moveDossierIntoViewPort(telemetryInfo.callCenterManagementDashboard.name);
        await libraryPage.openDossierInfoWindow(telemetryInfo.callCenterManagementDashboard.name);

        // Open edit mode
        await infoWindow.clickEditButton();
        await dossierPage.waitForDossierLoading();
        record = await telemetry.getExecutionRecord();
        await since(
            'Dossier edit execution from info window, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}'
        )
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(11);
        await dossierAuthoringPage.clickCloseDossierButton();
        await dossierPage.goToLibrary();
    });
});
