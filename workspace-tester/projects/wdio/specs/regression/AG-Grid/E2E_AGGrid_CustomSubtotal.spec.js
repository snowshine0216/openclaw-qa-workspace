import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';

describe('[E2E_AGGrid_CustomSubtotal]', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        dossierAuthoringPage,
        contentsPanel,
        agGridVisualization,
        dossierPage,
        loadingDialog,
        editorPanelForGrid,
        editorPanel,
        newFormatPanelForGrid,
        baseFormatPanelReact,
        dashboardSubtotalsEditor,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });


    it('[TC6337_1] Validate custom subtotal on modern grid with column sets', async () => {
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Custom_Subtotal_ColumnSets.project.id,
            dossierId: gridConstants.AGGrid_Custom_Subtotal_ColumnSets.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await agGridVisualization.clickOnContainerTitle('Column Sets');
        await agGridVisualization.openContextMenuItemForHeader('Year', 'Edit Totals...', 'Column Sets');
        await dashboardSubtotalsEditor.waitForSubtotalEditorVisible();
        await dashboardSubtotalsEditor.clickAddCustomSubtotalButton();
        // take screenshot of custom subtotal dialog
        await takeScreenshotByElement(
            await dashboardSubtotalsEditor.getCustomSubtotalEditorDialog(),
            'TC6337_1_1',
            'Custom Totals Editor for modern grid with Column Sets'
        );
        await dashboardSubtotalsEditor.renameCustomSubtotalsName('CustomTotal 1');
        await dashboardSubtotalsEditor.clickSubtotalSelector('Flights Cancelled');
        await dashboardSubtotalsEditor.setSubtotalTypeTo('Flights Cancelled', 'Total');
        await dashboardSubtotalsEditor.setSubtotalTypeTo('Flights Delayed', 'Average');
        // take screenshot of configured custom subtotal
        await takeScreenshotByElement(
            await dashboardSubtotalsEditor.getCustomSubtotalEditorDialog(),
            'TC6337_1_2',
            'Configured Custom Subtotal in Custom Totals Editor'
        );
        await dashboardSubtotalsEditor.customSubtotalsClickButton('OK');
        await dashboardSubtotalsEditor.selectTypeCheckbox('CustomTotal 1');
        await dashboardSubtotalsEditor.expandAcrossLevelSelector('CustomTotal 1');
        // take screenshot of across level selector
        await takeScreenshotByElement(
            await dashboardSubtotalsEditor.getSubtotalEditorDialog(),
            'TC6337_1_3',
            'Display Column set name when selecting attribute in Across Level selector'
        );
        await dashboardSubtotalsEditor.selectAttributeAcrossLevel('Year');
        await dashboardSubtotalsEditor.saveAndCloseSubtotalEditor();
        // take screenshot of grid with applied custom subtotal
        await takeScreenshotByElement(
            await agGridVisualization.getContainer('Column Sets'),
            'TC6337_1_4',
            'Grid with applied CustomTotal 1'
        );
        await agGridVisualization.openContextMenuItemForValue('CustomTotal 1', 'Edit Totals...', 'Column Sets');
        await dashboardSubtotalsEditor.waitForSubtotalEditorVisible();
        await dashboardSubtotalsEditor.hoverOverCustomSubtotalOptions('CustomTotal 1');
        await dashboardSubtotalsEditor.editCustomSubtotal('CustomTotal 1');
        await dashboardSubtotalsEditor.renameCustomSubtotalsName('Edited Subtotal');
        await dashboardSubtotalsEditor.customSubtotalsClickButton('OK');
        await dashboardSubtotalsEditor.expandAcrossLevelSelector('Edited Subtotal');
        await dashboardSubtotalsEditor.selectAttributeAcrossLevel('All Attributes');
        await dashboardSubtotalsEditor.saveAndCloseSubtotalEditor();
        // take screenshot of grid with edited custom subtotal
        await takeScreenshotByElement(
            await agGridVisualization.getContainer('Column Sets'),
            'TC6337_1_5',
            'Grid with applied Edited Subtotal'
        );
    });

    it('[TC6337_2] Validate custom subtotal on modern grid with microcharts', async () => {
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Custom_Subtotal_ColumnSets.project.id,
            dossierId: gridConstants.AGGrid_Custom_Subtotal_ColumnSets.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await agGridVisualization.clickOnContainerTitle('Microcharts');
        // Trigger subtotal editor from header of microcharts
        await agGridVisualization.openContextMenuItemForHeader('Number of Flights Trend by Month', 'Edit Totals...', 'Microcharts');
        await dashboardSubtotalsEditor.waitForSubtotalEditorVisible();
        await dashboardSubtotalsEditor.clickAddCustomSubtotalButton();
        await dashboardSubtotalsEditor.renameCustomSubtotalsName('CustomTotal 1');
        await dashboardSubtotalsEditor.clickSubtotalSelector('Flights Cancelled');
        await dashboardSubtotalsEditor.setSubtotalTypeTo('Flights Cancelled', 'Total');
        await dashboardSubtotalsEditor.setSubtotalTypeTo('Flights Delayed', 'Average');
        await dashboardSubtotalsEditor.customSubtotalsClickButton('OK');
        await dashboardSubtotalsEditor.selectTypeCheckbox('CustomTotal 1');
        await dashboardSubtotalsEditor.expandAcrossLevelSelector('CustomTotal 1');
        await dashboardSubtotalsEditor.selectAttributeAcrossLevel('Year');
        await dashboardSubtotalsEditor.saveAndCloseSubtotalEditor();
        // take screenshot of grid with applied custom subtotal
        await takeScreenshotByElement(
            await agGridVisualization.getContainer('Microcharts'),
            'TC6337_2_1',
            'Custom Subtotal on grid with Microcharts'
        );
    });

    it('[TC6337_3] Validate custom subtotal on modern grid with dda dataset', async () => {
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Custom_Subtotal_DDA.project.id,
            dossierId: gridConstants.AGGrid_Custom_Subtotal_DDA.id,
        });
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        // Trigger subtotal editor from header of microcharts
        await agGridVisualization.openContextMenuItemForHeader('Cost', 'Edit Totals...', 'Visualization 1');
        await dashboardSubtotalsEditor.waitForSubtotalEditorVisible();
        await dashboardSubtotalsEditor.clickAddCustomSubtotalButton();
        await dashboardSubtotalsEditor.renameCustomSubtotalsName('CustomSubtotal');
        await dashboardSubtotalsEditor.setSubtotalTypeTo('Cost', 'None');
        await dashboardSubtotalsEditor.setSubtotalTypeTo('Profit', 'Average');
        await dashboardSubtotalsEditor.customSubtotalsClickButton('OK');
        await dashboardSubtotalsEditor.selectTypeCheckbox('CustomSubtotal');
        await dashboardSubtotalsEditor.expandAcrossLevelSelector('CustomSubtotal');
        await dashboardSubtotalsEditor.selectAttributeAcrossLevel('All Attributes');
        await dashboardSubtotalsEditor.selectTypeCheckbox('Total');
        await dashboardSubtotalsEditor.expandAcrossLevelSelector('Total');
        await dashboardSubtotalsEditor.selectAttributeAcrossLevel('All Attributes');
        await dashboardSubtotalsEditor.saveAndCloseSubtotalEditor();
        // take screenshot of grid with applied custom subtotal
        await takeScreenshotByElement(
            await agGridVisualization.getContainer('Visualization 1'),
            'TC6337_3_1',
            'Enable Custom Subtotal and System Total on grid with DDA dataset'
        );
    });

    it('[TC6337_4] Validate custom subtotal on modern grid with MDX', async () => {
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Custom_Subtotal_MDX.project.id,
            dossierId: gridConstants.AGGrid_Custom_Subtotal_MDX.id,
        });
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        // Trigger subtotal editor from header of microcharts
        await agGridVisualization.openContextMenuItemForHeader('Departments', 'Edit Totals...', 'Visualization 1');
        await dashboardSubtotalsEditor.waitForSubtotalEditorVisible();
        await dashboardSubtotalsEditor.clickAddCustomSubtotalButton();
        await dashboardSubtotalsEditor.renameCustomSubtotalsName('Custom Subtotal');
        await dashboardSubtotalsEditor.setSubtotalTypeTo('Average Rate', 'Average');
        await dashboardSubtotalsEditor.setSubtotalTypeTo('Amount', 'Total');
        await dashboardSubtotalsEditor.customSubtotalsClickButton('OK');
        await dashboardSubtotalsEditor.selectTypeCheckbox('Custom Subtotal');
        await dashboardSubtotalsEditor.expandAcrossLevelSelector('Custom Subtotal');
        await dashboardSubtotalsEditor.selectAttributeAcrossLevel('All Attributes');
        await dashboardSubtotalsEditor.selectTypeCheckbox('Total');
        await dashboardSubtotalsEditor.expandAcrossLevelSelector('Total');
        await dashboardSubtotalsEditor.selectAttributeAcrossLevel('All Attributes');
        await dashboardSubtotalsEditor.selectTypeCheckbox('Average');
        await dashboardSubtotalsEditor.expandAcrossLevelSelector('Average');
        await dashboardSubtotalsEditor.selectAttributeAcrossLevel('All Attributes');
        await dashboardSubtotalsEditor.saveAndCloseSubtotalEditor();
        // take screenshot of grid with applied custom subtotal
        await takeScreenshotByElement(
            await agGridVisualization.getContainer('Visualization 1'),
            'TC6337_4_1',
            'Enable Custom Subtotal and System Total on grid with MDX dataset'
        );

    });

    it('[TC6337_5] Validate undo and redo on subtotal editor', async () => {
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Custom_Subtotal_ColumnSets.project.id,
            dossierId: gridConstants.AGGrid_Custom_Subtotal_ColumnSets.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await agGridVisualization.clickOnContainerTitle('Column Sets');
        await agGridVisualization.openContextMenuItemForHeader('Year', 'Edit Totals...', 'Column Sets');
        await dashboardSubtotalsEditor.waitForSubtotalEditorVisible();
        await dashboardSubtotalsEditor.clickAddCustomSubtotalButton();
        await dashboardSubtotalsEditor.renameCustomSubtotalsName('CustomTotal');
        await dashboardSubtotalsEditor.setSubtotalTypeTo('Flights Cancelled', 'Average');
        await dashboardSubtotalsEditor.customSubtotalsClickButton('OK');
        await dashboardSubtotalsEditor.selectTypeCheckbox('CustomTotal');
        await dashboardSubtotalsEditor.expandAcrossLevelSelector('CustomTotal');
        await dashboardSubtotalsEditor.selectAttributeAcrossLevel('Year');
        await dashboardSubtotalsEditor.saveAndCloseSubtotalEditor();
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await takeScreenshotByElement(
            await agGridVisualization.getContainer('Column Sets'),
            'TC6337_5_1',
            'Undo for new added CustomSubtotal'
        );
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await takeScreenshotByElement(
            await agGridVisualization.getContainer('Column Sets'),
            'TC6337_5_2',
            'Redo for new added CustomSubtotal'
        );
    });
});
