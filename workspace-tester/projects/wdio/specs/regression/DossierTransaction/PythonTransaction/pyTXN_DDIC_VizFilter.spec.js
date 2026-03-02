import { SelectTargetInLayersPanel } from '../../../../pageObjects/authoring/SelectTargetInLayersPanel.ts';
import * as dossierTXN from '../../../../constants/dossierTXN.js';
import resetDossierState from '../../../../api/resetDossierState.js';

//npm run wdio -- --baseUrl=https://mci-wix8a-dev.hypernow.microstrategy.com/MicroStrategyLibrary/  --tcList=TC98288_1

describe('24.05 Dossier Transaction Visualization can filter DDIC list - Xfunc', () => {
    let {
        loadingDialog,
        agGrid,
        baseContainer,
        bulkEdit,
        loginPage,
        libraryPage,
        tocContentsPanel,
        grid,
        panelStack,
        toc,
        chartVisualizationFilter,
    } = browsers.pageObj1;
    const selectTargetInLayersPanel = new SelectTargetInLayersPanel();
    const dossier = {
        id: 'F1211AA0E04A74BDE1C5EF8B29A6F197',
        name: 'Python_REG_DDIC_VizFilter_TC98288',
        project: {
            id: dossierTXN.dossierTXNProject.id,
            name: dossierTXN.dossierTXNProject.name,
        },
    };

    beforeAll(async () => {
        await libraryPage.openDefaultApp();
        await loginPage.login(dossierTXN.txnAutoUser);
        //Restore the transaction data
        await libraryPage.openDossierById({
            projectId: dossierTXN.dossierTXNProject.id,
            dossierId: '936DBA062C4FD0A6D2F1B99555C8481E',
        });
        await agGrid.openContextMenuItemForCellAtPosition(2, 2, 'Delete Row', 'RestoreData_ygu_python');
        await agGrid.selectConfirmationPopupOption('Continue');
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    it('[TC98288_1] Viz Target DDIC_Configuration_Switch mode', async () => {
        //dossierName: 'Python_REG_DDIC_VizFilter_TC98288',
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await tocContentsPanel.clickOnPage('Auto', 'Source Page');

        await baseContainer.editTargetVisualizations('Source Grid');
        await since('1 A target button should appear on the visualization "Target Grid"')
            .expect(await selectTargetInLayersPanel.getTargetButton('Target Grid').isDisplayed())
            .toBe(true);
        await since('2 The DDIC candidate picker dropdown should contain the element "Username@ID"')
            .expect(await selectTargetInLayersPanel.getDDICPullDownText('Target Grid'))
            .toBe('Username@ID');
        //Select grid > Unselect grid
        await baseContainer.clickContainerByScript('Target Grid');
        await since('3 A target button should NOT appear on the visualization "Target Grid" after unselecting')
            .expect(await selectTargetInLayersPanel.getTargetButton('Target Grid').isDisplayed())
            .toBe(false);
        await since(
            '4 The DDIC candidate picker should NOT be present for the visualization "Target Grid" after unselecting'
        )
            .expect(await selectTargetInLayersPanel.getDDICcandidatePicker('Target Grid').isDisplayed())
            .toBe(false);
        //Unselect grid > Select grid
        await baseContainer.clickContainer('Target Grid');
        await since('5 A target button should reappear on the visualization "Target Grid" after reselecting')
            .expect(await selectTargetInLayersPanel.getTargetButton('Target Grid').isDisplayed())
            .toBe(true);
        await since('6 The DDIC candidate picker dropdown should contain elements "Username@ID"')
            .expect(await selectTargetInLayersPanel.getDDICPullDownText('Target Grid'))
            .toBe('Username@ID');
        //Filter > Highlight _ DE321445
        await selectTargetInLayersPanel.changeFilterType('Filter', 'Highlight');
        await since(
            '7 A target button should remain on the visualization "Target Grid" after changing filter type to "Highlight"'
        )
            .expect(await selectTargetInLayersPanel.getTargetButton('Target Grid').isDisplayed())
            .toBe(true);
        await since(
            '8 The DDIC candidate picker should NOT be present for the visualization "Target Grid" after changing filter type to "Highlight"'
        )
            .expect(await selectTargetInLayersPanel.getDDICcandidatePicker('Target Grid').isDisplayed())
            .toBe(false);
        //Highlight > Filter
        await selectTargetInLayersPanel.changeFilterType('Highlight', 'Filter');
        await since(
            '9 A target button should remain on the visualization "Target Grid" after changing filter type back to "Filter"'
        )
            .expect(await selectTargetInLayersPanel.getTargetButton('Target Grid').isDisplayed())
            .toBe(true);
        await since('10 The DDIC candidate picker dropdown should again contain elements "Username@ID"')
            .expect(await selectTargetInLayersPanel.getDDICPullDownText('Target Grid'))
            .toBe('Username@ID');

        //Go to target page
        await tocContentsPanel.clickOnPage('Auto', 'Target Page');
        await agGrid.common.getButton('Continue').click();
        await loadingDialog.waitPageLoading();
        await baseContainer.clickContainer('Target Grid on Other Page');
        await since('11 A target button should appear on the visualization "Target Grid on Other Page"')
            .expect(await selectTargetInLayersPanel.getTargetButton('Target Grid on Other Page').isDisplayed())
            .toBe(true);
        await since(
            '12 The DDIC candidate picker should NOT be present for the visualization "Target Grid on Other Page"'
        )
            .expect(await selectTargetInLayersPanel.getDDICcandidatePicker('Target Grid on Other Page').isDisplayed())
            .toBe(false);
    });
    it('[TC98288_2] Viz Target DDIC_Configuration_PanelStack', async () => {
        //dossierName: 'Python_REG_DDIC_VizFilter_TC98288',
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        //1.Target in panel stack
        //DE320695 - Config DDIC as viz filter target, save dashboard and refresh, it will change to 'Highlight' wrongly.
        //DE321086 - Config DDIC as viz filter target, save dashboard and refresh, it will change to empty wrongly.
        await tocContentsPanel.clickOnPage('Auto', 'Target in PS');
        await baseContainer.selectTargetVisualizations('Source Grid');
        await baseContainer.clickContainer('Target Grid');
        await since('1 A target button should appear on the viz "YesTXN_DDIC"')
            .expect(await selectTargetInLayersPanel.getTargetButton('Target Grid').isDisplayed())
            .toBe(true);
        await selectTargetInLayersPanel.selectDDICitems('Target Grid', ['Username@ID']);
        await since('2 A target button should appear on the viz "YesTXN_DDIC"')
            .expect(await selectTargetInLayersPanel.getTargetButton('Target Grid').isDisplayed())
            .toBe(true);
        await since('3 The DDIC candidate picker dropdown should contain only "Username@ID"')
            .expect(await selectTargetInLayersPanel.getDDICPullDownText('Target Grid'))
            .toBe('Username@ID');
        await selectTargetInLayersPanel.applyButtonForSelectTarget();
        await baseContainer.editTargetVisualizations('Source Grid');
        await since('4 The filter type dropdown should contain "Filter"')
            .expect(await selectTargetInLayersPanel.getFilterTypeDropDown('Filter').isDisplayed())
            .toBe(true);
        await since('5 The DDIC candidate picker dropdown should contain elements "Username@ID"')
            .expect(await selectTargetInLayersPanel.getTargetButton('Target Grid').isDisplayed())
            .toBe(true);
        await since('3 The DDIC candidate picker dropdown should contain only "Username@ID"')
            .expect(await selectTargetInLayersPanel.getDDICPullDownText('Target Grid'))
            .toBe('Username@ID');
        await selectTargetInLayersPanel.cancelButtonForSelectTarget();

        //2.Source in panel stack
        //DE320695 - For source viz in Panel Stack case,  if filter type is highlight > apply and reopen > it will show DDIC configuration wrongly.
        await tocContentsPanel.clickOnPage('Auto', 'Source in PS');
        await baseContainer.selectTargetVisualizations('Source Grid');
        await baseContainer.clickContainer('Target Grid');
        await since('6 A target button should appear on the viz "Target Grid"')
            .expect(await selectTargetInLayersPanel.getTargetButton('Target Grid').isDisplayed())
            .toBe(true);
        await since('7 The DDIC candidate picker in Visualization "Target Grid" should be present')
            .expect(await selectTargetInLayersPanel.getDDICcandidatePicker('Target Grid').isDisplayed())
            .toBe(true);

        await selectTargetInLayersPanel.changeFilterType('Filter', 'Highlight');
        await since('8 A target button should appear on the viz "Target Grid"')
            .expect(await selectTargetInLayersPanel.getTargetButton('Target Grid').isDisplayed())
            .toBe(true);
        await since('9 The DDIC candidate picker in Visualization "Target Grid" should be present')
            .expect(await selectTargetInLayersPanel.getDDICcandidatePicker('Target Grid').isDisplayed())
            .toBe(false);
        await selectTargetInLayersPanel.applyButtonForSelectTarget();

        await baseContainer.editTargetVisualizations('Source Grid');
        await since('10 A target button should appear on the viz "Target Grid"')
            .expect(await selectTargetInLayersPanel.getTargetButton('Target Grid').isDisplayed())
            .toBe(true);
        await since('11 The DDIC candidate picker in Visualization "Target Grid" should be present')
            .expect(await selectTargetInLayersPanel.getDDICcandidatePicker('Target Grid').isDisplayed())
            .toBe(false);
        await since('12 The filter type should be "Highlight"')
            .expect(await selectTargetInLayersPanel.getFilterTypeDropDown('Highlight').isDisplayed())
            .toBe(true);
        await selectTargetInLayersPanel.cancelButtonForSelectTarget();

        //DE321437 - The DDIC configuration is not clear when copy a panel [Source viz in panel stack, Target Viz on Canvas]
        await panelStack.clickPanelStackContextMenuItem('With VizFilter', 'Duplicate Panel');
        await baseContainer.openContextMenu3();
        await baseContainer.selectContextMenuOption('Select Target Visualizations');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed(120);
        await baseContainer.clickContainer('Target Grid');
        await since('13 A target button should appear on the viz "Target Grid"')
            .expect(await selectTargetInLayersPanel.getTargetButton('Target Grid').isDisplayed())
            .toBe(true);
        await since('14 The DDIC candidate picker in Visualization "Target Grid" should be present')
            .expect(await selectTargetInLayersPanel.getDDICcandidatePicker('Target Grid').isDisplayed())
            .toBe(true);
        await since('15 The DDIC candidate picker dropdown should be empty instead we have #{actual}')
            .expect(await selectTargetInLayersPanel.getDDICPullDownText('Target Grid'))
            .toBe('');
    });

    it('[TC98288_3] Viz Target DDIC_Consumption_Intersection', async () => {
        //dossierName: 'Python_REG_DDIC_VizFilter_TC98288',
        await resetDossierState({ credentials: dossierTXN.txnAutoUser, dossier });

        await libraryPage.openDossierById({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        //Intersection
        //Source: HM + GM
        await toc.openPageFromTocMenu({ chapterName: 'Auto', pageName: 'Intersection' });
        await since('1 The ag-grid "Target Grid" should have #{expected} rows of data instead we have #{actual}')
            .expect(await agGrid.getAllAgGridObjectCount('Target Grid'))
            .toBe(5);

        //Enter and check the DDIC in bulk mode
        await bulkEdit.enterBulkTxnMode('E2E_Combine', 'Target Grid');
        await bulkEdit.clickBulkTxnGridCellByPosition(1, 3, 'E2E_Combine');
        await since('2 DDIC list should have #{expected} options instead we have #{actual}')
            .expect(await agGrid.getPulldownOptionCount())
            .toBe(5);

        //Cancel the bulk edit
        await bulkEdit.clickOnBulkEditSubmitButton('Target Grid', 'Cancel');

        await chartVisualizationFilter.clickChartElementByIndex(2, 'LineChart');
        //Known issue of DE320849, add unselect & select as workaround
        await chartVisualizationFilter.clickChartElementByIndex(2, 'LineChart');
        await loadingDialog.waitForCurtainDisappear();
        await chartVisualizationFilter.clickChartElementByIndex(2, 'LineChart');
        await loadingDialog.waitForCurtainDisappear();

        await since('3 The ag-grid "Target Grid" should have 1 row of data after interaction')
            .expect(await agGrid.getAllAgGridObjectCount('Target Grid'))
            .toBe(1);

        //Enter and check the DDIC in bulk mode
        await bulkEdit.enterBulkTxnMode('E2E_Combine', 'Target Grid');
        await bulkEdit.clickBulkTxnGridCellByPosition(1, 3, 'E2E_Combine');
        await since('4 Dropdown should have 1 option instead we have #{actual}')
            .expect(await agGrid.getPulldownOptionCount())
            .toBe(1);
    });

    it('[TC98288_4] Viz Target DDIC_Consumption_Last Selection', async () => {
        //dossierName: 'Python_REG_DDIC_VizFilter_TC98288',
        await resetDossierState({ credentials: dossierTXN.txnAutoUser, dossier });

        await libraryPage.openDossierById({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        //Last selection
        await toc.openPageFromTocMenu({ chapterName: 'Auto', pageName: 'Last Selection' });
        await since('1 The ag-grid "Target Grid" should have #{expected} rows of data instead we have #{actual}')
            .expect(await agGrid.getAllAgGridObjectCount('Target Grid'))
            .toBe(5);

        //Enter and check the DDIC in bulk mode
        await bulkEdit.enterBulkTxnMode('E2E_Combine', 'Target Grid');
        await bulkEdit.clickBulkTxnGridCellByPosition(1, 3, 'E2E_Combine');
        await since('2 DDIC should have #{expected} options instead we have #{actual}')
            .expect(await agGrid.getPulldownOptionCount())
            .toBe(5);

        //Cancel the bulk add
        await bulkEdit.clickOnBulkEditSubmitButton('Target Grid', 'Cancel');

        await grid.selectGridElement({
            title: 'Source Grid',
            headerName: 'Password',
            elementName: '123pwd',
        });
        await since('3 The ag-grid "Target Grid" should have 3 rows of data after interaction')
            .expect(await agGrid.getAllAgGridObjectCount('Target Grid'))
            .toBe(3);

        //Known issue of DE320849, add unselect & select as workaround
        await grid.selectGridElement({
            title: 'Source Grid',
            headerName: 'Password',
            elementName: '123pwd',
        });
        await grid.selectGridElement({
            title: 'Source Grid',
            headerName: 'Password',
            elementName: '123pwd',
        });
        //Enter and check the DDIC in bulk mode
        await bulkEdit.enterBulkTxnMode('E2E_Combine', 'Target Grid');
        await bulkEdit.clickBulkTxnGridCellByPosition(1, 3, 'E2E_Combine');
        await since('4 The ag grid cell should have a dropdown with 3 options in Transaction consumption mode')
            .expect(await agGrid.getPulldownOptionCount())
            .toBe(3);
    });
});
