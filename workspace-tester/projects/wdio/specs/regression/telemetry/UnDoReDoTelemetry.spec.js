import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import * as telemetryInfo from '../../../constants/telemetry.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('Test undo/redo manipulations', () => {
    let {
        loginPage,
        telemetry,
        libraryPage,
        dossierPage,
        reset,
        inCanvasSelector,
        grid,
        filterPanel,
        checkboxFilter,
        tocMenu,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(telemetryInfo.telemetryUser);
        await setWindowSize(browserWindow);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC87880_01] Test undo/redo selector manipulation', async () => {
        // Execute dossier
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);

        // Reset dossier if not in original state
        await reset.resetIfEnabled();

        // Selector manipulation
        await inCanvasSelector.selectItem(telemetryInfo.categorySelector[0]); //Books

        // Undo manipulation
        await dossierPage.clickUndo();
        let record = await telemetry.getManipulationRecord();
        await since('Selector manipulation, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Selector manipulation, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Undo');

        // Redo manipulation
        await dossierPage.clickRedo();
        record = await telemetry.getManipulationRecord();
        await since('Selector manipulation, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Selector manipulation, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Redo');

        await dossierPage.goToLibrary();
    });

    it('[TC87880_02] Test undo/redo panel selector manipulation', async () => {
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);

        // Reset dossier if not in original state
        await reset.resetIfEnabled();

        // Switch to page with panel selector
        await tocMenu.openMenu();
        await tocMenu.goToPage(
            telemetryInfo.selectorDashboard.chapter1.name,
            telemetryInfo.selectorDashboard.chapter1.page3.name
        );

        // Panel selector manipulation
        await inCanvasSelector.selectItem('Panel 2');

        // Undo manipulation
        await dossierPage.clickUndo();
        let record = await telemetry.getManipulationRecord();
        await since('Panel selector manipulation, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Panel selector manipulation, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Undo');

        // Redo manipulation
        await dossierPage.clickRedo();
        record = await telemetry.getManipulationRecord();
        await since('Panel selector manipulation, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Panel selector manipulation, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Redo');

        await dossierPage.goToLibrary();
    });

    it('[TC87880_03] Test undo/redo sort manipulation', async () => {
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);

        // Reset dossier if not in original state
        await reset.resetIfEnabled();

        // Sort manipulation
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Category',
            firstOption: 'Sort Ascending',
        });

        // Undo manipulation
        await dossierPage.clickUndo();
        let record = await telemetry.getManipulationRecord();
        await since('Sort manipulation, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Sort manipulation, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Undo');

        // Redo manipulation
        await dossierPage.clickRedo();
        record = await telemetry.getManipulationRecord();
        await since('Sort manipulation, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Sort manipulation, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Redo');

        await dossierPage.goToLibrary();
    });

    it('[TC87880_04] Test undo/redo keep only/exclude manipulation', async () => {
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);
        // Reset dossier if not in original state
        await reset.resetIfEnabled();

        // Keep only manipulation
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Category',
            elementName: telemetryInfo.categorySelector[0], //Books
            firstOption: 'Keep Only',
        });

        // Undo manipulation
        await dossierPage.clickUndo();
        let record = await telemetry.getManipulationRecord();
        await since(
            'Keep only/exclude manipulation, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}'
        )
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Keep only/exclude manipulation, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Undo');

        // Redo manipulation
        await dossierPage.clickRedo();
        record = await telemetry.getManipulationRecord();
        await since(
            'Keep only/exclude manipulation, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}'
        )
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Keep only/exclude manipulation, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Redo');

        await dossierPage.goToLibrary();
    });

    it('[TC87880_05] Test undo/redo show totals manipulation', async () => {
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);

        // Reset dossier if not in original state
        await reset.resetIfEnabled();

        // Show totals manipulation
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Cost',
            firstOption: 'Show Totals',
        });

        // Undo manipulation
        await dossierPage.clickUndo();
        let record = await telemetry.getManipulationRecord();
        await since('Show totals manipulation, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Show totals manipulation, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Undo');

        // Redo manipulation
        await dossierPage.clickRedo();
        record = await telemetry.getManipulationRecord();
        await since('Show totals manipulation, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Show totals manipulation, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Redo');

        await dossierPage.goToLibrary();
    });

    it('[TC87880_06] Test undo/redo drill manipulation', async () => {
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);
        // Reset dossier if not in original state
        await reset.resetIfEnabled();

        // Drill manipulation
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Category',
            firstOption: 'Drill',
            secondOption: 'Region',
        });

        // Undo manipulation
        await dossierPage.clickUndo();
        let record = await telemetry.getManipulationRecord();
        await since('Drill manipulation, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Drill manipulation, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Undo');

        // Redo manipulation
        await dossierPage.clickRedo();
        record = await telemetry.getManipulationRecord();
        await since('Drill manipulation, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Drill manipulation, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Redo');

        await dossierPage.goToLibrary();
    });

    it('[TC87880_07] Test undo/redo switch page manipulation', async () => {
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);

        // Reset dossier if not in original state
        await reset.resetIfEnabled();

        // Switch page manipulation
        await tocMenu.openMenu();
        await tocMenu.goToPage(
            telemetryInfo.selectorDashboard.chapter1.name,
            telemetryInfo.selectorDashboard.chapter1.page2.name
        );

        // Undo manipulation
        await dossierPage.clickUndo();
        let record = await telemetry.getManipulationRecord();
        await since('Switch page manipulation, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Switch page manipulation, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Undo');

        // Redo manipulation
        await dossierPage.clickRedo();
        record = await telemetry.getManipulationRecord();
        await since('Switch page manipulation, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Switch page manipulation, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Redo');

        await dossierPage.goToLibrary();
    });

    it('[TC87880_08] Test undo/redo apply filter manipulation', async () => {
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);

        // Reset dossier if not in original state
        await reset.resetIfEnabled();

        await tocMenu.openMenu();
        await tocMenu.goToPage(
            telemetryInfo.selectorDashboard.chapter2.name,
            telemetryInfo.selectorDashboard.chapter2.page1.name
        );

        // Apply filter manipulation
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Category');
        await checkboxFilter.selectElementByName(telemetryInfo.categorySelector[0]); //Books
        await filterPanel.apply();

        // Undo manipulation
        await dossierPage.clickUndo();
        let record = await telemetry.getManipulationRecord();
        await since('Apply filter manipulation, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Apply filter manipulation, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Undo');

        // Redo manipulation
        await dossierPage.clickRedo();
        record = await telemetry.getManipulationRecord();
        await since('Apply filter manipulation, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Apply filter manipulation, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Redo');

        await dossierPage.goToLibrary();
    });

    it('[TC87880_09] Test 3 undos in a row, 3 redos in a row', async () => {
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);

        // Reset dossier if not in original state
        await reset.resetIfEnabled();

        await tocMenu.openMenu();
        await tocMenu.goToPage(
            telemetryInfo.selectorDashboard.chapter2.name,
            telemetryInfo.selectorDashboard.chapter2.page1.name
        );

        // Sort manipulation
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Category',
            firstOption: 'Sort Ascending',
        });

        // Apply filter manipulation
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Category');
        await checkboxFilter.selectElementByName(telemetryInfo.categorySelector[0]); //Books
        await filterPanel.apply();

        // Switch page manipulation
        await tocMenu.openMenu();
        await tocMenu.goToPage(
            telemetryInfo.selectorDashboard.chapter2.name,
            telemetryInfo.selectorDashboard.chapter2.page2.name
        );

        let i = (await telemetry.getManipulationRecord()).MANIPSEQUENCEID;
        console.log(`current manip sequence id: ${i}`);
        // Undo manipulation
        await dossierPage.clickUndo();
        let record = await telemetry.getManipulationRecord();
        await since('3 undos 3 redos-1, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('3 undos 3 redos-1, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Undo');
        await since('3 undos 3 redos-1, MANIPSEQUENCEID should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPSEQUENCEID)
            .toEqual(i + 1);

        // Second undo manipulation
        await dossierPage.clickUndo();
        record = await telemetry.getManipulationRecord();
        await since('3 undos 3 redos-2, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('3 undos 3 redos-2, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Undo');
        await since('3 undos 3 redos-2, MANIPSEQUENCEID should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPSEQUENCEID)
            .toEqual(i + 2);

        // Third undo manipulation
        await dossierPage.clickUndo();
        record = await telemetry.getManipulationRecord();
        await since('3 undos 3 redos-3, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('3 undos 3 redos-3, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Undo');
        await since('3 undos 3 redos-3, MANIPSEQUENCEID should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPSEQUENCEID)
            .toEqual(i + 3);

        // Redo manipulation
        await dossierPage.clickRedo();
        record = await telemetry.getManipulationRecord();
        await since('3 undos 3 redos-4, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('3 undos 3 redos-4, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Redo');
        await since('3 undos 3 redos-4, MANIPSEQUENCEID should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPSEQUENCEID)
            .toEqual(i + 4);

        // Second redo manipulation
        await dossierPage.clickRedo();
        record = await telemetry.getManipulationRecord();
        await since('3 undos 3 redos-5, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('3 undos 3 redos-5, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Redo');
        await since('3 undos 3 redos-5, MANIPSEQUENCEID should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPSEQUENCEID)
            .toEqual(i + 5);

        // Third redo manipulation
        await dossierPage.clickRedo();
        record = await telemetry.getManipulationRecord();
        await since('3 undos 3 redos-6, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('3 undos 3 redos-6, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Redo');
        await since('3 undos 3 redos-6, MANIPSEQUENCEID should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPSEQUENCEID)
            .toEqual(i + 6);

        await dossierPage.goToLibrary();
    });

    it('[TC87880_10] Test alternate between undo/redo', async () => {
        await libraryPage.openDossier(telemetryInfo.selectorDashboard.name);
        await reset.resetIfEnabled();

        // Switch page manipulation
        await tocMenu.openMenu();
        await tocMenu.goToPage(
            telemetryInfo.selectorDashboard.chapter1.name,
            telemetryInfo.selectorDashboard.chapter1.page3.name
        );

        // Panel selector manipulation
        await inCanvasSelector.selectItem('Panel 2');
        await inCanvasSelector.selectItem('Panel 1');

        let i = (await telemetry.getManipulationRecord()).MANIPSEQUENCEID;
        console.log(`current manip sequence id: ${i}`);
        // Undo manipulation
        await dossierPage.clickUndo();
        let record = await telemetry.getManipulationRecord();
        await since('Alternate undo/redo-1, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Alternate undo/redo-1, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Undo');
        await since('Alternate undo/redo-1, MANIPSEQUENCEID should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPSEQUENCEID)
            .toEqual(i + 1);

        // Redo manipulation
        await dossierPage.clickRedo();
        record = await telemetry.getManipulationRecord();
        await since('Alternate undo/redo-2, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Alternate undo/redo-2, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Redo');
        await since('Alternate undo/redo-2, MANIPSEQUENCEID should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPSEQUENCEID)
            .toEqual(i + 2);

        // Second Undo manipulation
        await dossierPage.clickUndo();
        record = await telemetry.getManipulationRecord();
        await since('Alternate undo/redo-3, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Alternate undo/redo-3, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Undo');
        await since('Alternate undo/redo-3, MANIPSEQUENCEID should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPSEQUENCEID)
            .toEqual(i + 3);

        // Second Redo manipulation
        await dossierPage.clickRedo();
        record = await telemetry.getManipulationRecord();
        await since('Alternate undo/redo-4, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Alternate undo/redo-4, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Redo');
        await since('Alternate undo/redo-4, MANIPSEQUENCEID should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPSEQUENCEID)
            .toEqual(i + 4);

        // Undo manipulation
        await dossierPage.clickUndo();
        record = await telemetry.getManipulationRecord();
        await since('Alternate undo/redo-5, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Alternate undo/redo-5, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Undo');
        await since('Alternate undo/redo-5, MANIPSEQUENCEID should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPSEQUENCEID)
            .toEqual(i + 5);

        // Second Undo manipulation
        await dossierPage.clickUndo();
        record = await telemetry.getManipulationRecord();
        await since('Alternate undo/redo-6, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Alternate undo/redo-6, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Undo');
        await since('Alternate undo/redo-6, MANIPSEQUENCEID should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPSEQUENCEID)
            .toEqual(i + 6);

        // Redo manipulation
        await dossierPage.clickRedo();
        record = await telemetry.getManipulationRecord();
        await since('Alternate undo/redo-7, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Alternate undo/redo-7, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Redo');
        await since('Alternate undo/redo-7, MANIPSEQUENCEID should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPSEQUENCEID)
            .toEqual(i + 7);

        // Second Redo manipulation
        await dossierPage.clickRedo();
        record = await telemetry.getManipulationRecord();
        await since('Alternate undo/redo-8, CLIENTACTIONTYPEID should be #{expected}, instead we have #{actual}')
            .expect(record.CLIENTACTIONTYPEID)
            .toEqual(1019);
        await since('Alternate undo/redo-8, MANIPVALUE should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPVALUE)
            .toEqual('Redo');
        await since('Alternate undo/redo-8, MANIPSEQUENCEID should be #{expected}, instead we have #{actual}')
            .expect(record.MANIPSEQUENCEID)
            .toEqual(i + 8);

        await dossierPage.goToLibrary();
    });
});
