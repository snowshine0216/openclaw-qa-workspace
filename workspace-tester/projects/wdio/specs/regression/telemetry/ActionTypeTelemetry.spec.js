import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import * as telemetryInfo from '../../../constants/telemetry.js';
import { validateRecord } from '../../../utils/telemetryAssert.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('Test Client Action Type ID Manipulation', () => {
    let {
        loginPage,
        telemetry,
        libraryPage,
        dossierPage,
        tocMenu,
        reset,
        inCanvasSelector,
        grid,
        filterPanel,
        checkboxFilter,
        mqSliderFilter,
        baseFilter,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(telemetryInfo.telemetryUser);
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC84923_01] Client Action Type ID for different Filter Selector', async () => {
        // Execute and reset dossier
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);
        await reset.resetIfEnabled();

        // Change element in Element Filter Selector
        // await inCanvasSelector.openDropdownMenu();
        // await inCanvasSelector.selectDropdownItems(['Business']);
        await inCanvasSelector.selectItem(telemetryInfo.categorySelector[0]); // 'Books'
        let record = await telemetry.getManipulationRecord();

        await validateRecord(record, {
            testCase: 'Element Filter Selector',
            CLIENTACTIONTYPEID: 1001,
            MANIPITEMPATH: 'Category',
            MANIPSEQUENCEID: 1,
            MANIPVALUE: 'Electronics;Movies;Music',
        });

        // Switch page
        await tocMenu.openMenu();
        await tocMenu.goToPage(
            telemetryInfo.selectorDashboard.chapter1.name,
            telemetryInfo.selectorDashboard.chapter1.page2.name
        );
        record = await telemetry.getManipulationRecord();

        await validateRecord(record, {
            testCase: 'Switch Page',
            CLIENTACTIONTYPEID: 1017,
            MANIPITEMPATH: telemetryInfo.selectorDashboard.chapter1.page1.name,
            MANIPSEQUENCEID: 2,
            MANIPVALUE: telemetryInfo.selectorDashboard.chapter1.page2.name,
        });

        // Change attribute in Attribute Selector
        await inCanvasSelector.selectItem('Region');
        record = await telemetry.getManipulationRecord();

        await validateRecord(record, {
            testCase: 'Attribute Selector',
            CLIENTACTIONTYPEID: 1001,
            MANIPITEMPATH: 'Selector 1',
            MANIPSEQUENCEID: 3,
            MANIPVALUE: 'Region',
        });

        await tocMenu.openMenu();
        await tocMenu.goToPage(
            telemetryInfo.selectorDashboard.chapter1.name,
            telemetryInfo.selectorDashboard.chapter1.page3.name
        );
        await inCanvasSelector.selectItem('Panel 1');
        record = await telemetry.getManipulationRecord();

        await validateRecord(record, {
            testCase: 'Panel Selector',
            CLIENTACTIONTYPEID: 1002,
            MANIPITEMPATH: 'Panel Selector 4',
            MANIPSEQUENCEID: 5,
            MANIPVALUE: 'Panel 1',
        });

        await dossierPage.goToLibrary();
    });

    it('[TC84923_02] Test Client Action Type ID for different Grid Manipulation', async () => {
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);
        await reset.resetIfEnabled();

        // Click on metric in grid header, sort ascending, then clear sort
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Cost',
            firstOption: {
                btnClass: 'asc',
            },
        });
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Cost',
            firstOption: {
                btnClass: 'clr',
            },
        });
        let record = await telemetry.getManipulationRecord();

        await validateRecord(record, {
            testCase: 'Clear Sort on Metric',
            CLIENTACTIONTYPEID: 1006,
            MANIPITEMPATH: 'Cost',
            MANIPSEQUENCEID: 2,
            MANIPVALUE: 'Clear',
        });

        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Category',
            elementName: 'Electronics',
            firstOption: 'Exclude',
        });
        record = await telemetry.getManipulationRecord();

        await validateRecord(record, {
            testCase: 'Exclude',
            CLIENTACTIONTYPEID: 1012,
            MANIPITEMPATH: 'Electronics',
            MANIPSEQUENCEID: 3,
            MANIPVALUE: 'Exclude',
        });

        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Category',
            elementName: 'Movies',
            firstOption: 'Keep Only',
        });

        record = await telemetry.getManipulationRecord();

        await validateRecord(record, {
            testCase: 'Keep Only',
            CLIENTACTIONTYPEID: 1012,
            MANIPITEMPATH: 'Movies',
            MANIPSEQUENCEID: 4,
            MANIPVALUE: 'Keep Only',
        });

        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Cost',
            firstOption: 'Show Totals',
        });
        record = await telemetry.getManipulationRecord();

        await validateRecord(record, {
            testCase: 'Show Totals on Metric',
            CLIENTACTIONTYPEID: 1013,
            MANIPITEMPATH: 'Cost',
            MANIPSEQUENCEID: 5,
            MANIPVALUE: 'Show Totals',
        });

        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Cost',
            firstOption: 'Show Totals',
        });
        record = await telemetry.getManipulationRecord();

        await validateRecord(record, {
            testCase: 'Hide Totals on Metric',
            CLIENTACTIONTYPEID: 1013,
            MANIPITEMPATH: 'Cost',
            MANIPSEQUENCEID: 6,
            MANIPVALUE: 'Hide Totals',
        });

        // Click on attribute in grid and enable some totals
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Category',
            firstOption: 'Show Totals',
        });
        await grid.selectShowTotalsOption('Average');
        await grid.selectShowTotalsOption('Maximum');
        await grid.applyShowTotalsSelection();
        record = await telemetry.getManipulationRecord();

        await validateRecord(record, {
            testCase: 'Show Totals on Attribute',
            CLIENTACTIONTYPEID: 1013,
            MANIPITEMPATH: 'Category',
            MANIPSEQUENCEID: 7,
            MANIPVALUE: 'Average;Maximum',
        });

        // Click on attribute in grid and drill
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Category',
            firstOption: 'Drill',
            secondOption: 'Region',
        });
        record = await telemetry.getManipulationRecord();

        await validateRecord(record, {
            testCase: 'Drill from Attribute',
            CLIENTACTIONTYPEID: 1015,
            MANIPITEMPATH: 'Category',
            MANIPSEQUENCEID: 8,
            MANIPVALUE: 'Region',
        });

        await reset.resetIfEnabled();
        // Click on attribute element in grid and drill
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Category',
            elementName: telemetryInfo.categorySelector[0], // 'Books'
            firstOption: 'Drill',
            secondOption: 'Region',
        });
        record = await telemetry.getManipulationRecord();

        await validateRecord(record, {
            testCase: 'Drill from Attribute Element',
            CLIENTACTIONTYPEID: 1015,
            MANIPITEMPATH: telemetryInfo.categorySelector[0], // 'Books'
            MANIPSEQUENCEID: 1,
            MANIPVALUE: 'Region',
        });
        await dossierPage.goToLibrary();
    });

    it('[TC84923_03] Test Client Action Type for manipulation in filter panel', async () => {
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);
        await reset.resetIfEnabled();

        await tocMenu.openMenu();
        await tocMenu.goToPage(
            telemetryInfo.selectorDashboard.chapter2.name,
            telemetryInfo.selectorDashboard.chapter2.page1.name
        );

        // Apply filter
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Category');
        await checkboxFilter.selectElementByName(telemetryInfo.categorySelector[0]); // 'Books'
        await filterPanel.apply();

        let record = await telemetry.getManipulationRecord();
        let i = 2;

        await validateRecord(record, {
            testCase: 'Filter Panel - Attribute Element',
            CLIENTACTIONTYPEID: 1018,
            MANIPSEQUENCEID: i,
        });

        await filterPanel.openFilterPanel();
        await mqSliderFilter.updateUpperInput('Profit', 850500);
        await filterPanel.apply();
        record = await telemetry.getManipulationRecord();

        await validateRecord(record, {
            testCase: 'Filter Panel - Metric filter',
            CLIENTACTIONTYPEID: 1018,
            MANIPSEQUENCEID: i + 1,
        });

        await filterPanel.openFilterPanel();
        await filterPanel.clearFilter();
        await filterPanel.apply();
        record = await telemetry.getManipulationRecord();

        await validateRecord(record, {
            testCase: 'Filter Panel - Clear Filter',
            CLIENTACTIONTYPEID: 1018,
            MANIPSEQUENCEID: i + 2,
        });

        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Category');
        await checkboxFilter.selectElementByName(telemetryInfo.categorySelector[0]); // 'Books'

        // Exclude filter
        await baseFilter.openContextMenu('Category');
        await baseFilter.selectContextMenuOption('Category', 'Exclude');
        await filterPanel.apply();
        record = await telemetry.getManipulationRecord();

        await validateRecord(record, {
            testCase: 'Filter Panel - Exclude Filter',
            CLIENTACTIONTYPEID: 1018,
            MANIPSEQUENCEID: i + 3,
        });

        await dossierPage.goToLibrary();
    });
});
