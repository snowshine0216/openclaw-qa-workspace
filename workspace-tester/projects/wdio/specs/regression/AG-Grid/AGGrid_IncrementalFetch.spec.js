import * as gridConstants from '../../../constants/grid.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('AGGrid_IncrementalFetch', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        baseVisualization,
        vizPanelForGrid,
        datasetPanel,
        agGridVisualization,
        editorPanelForGrid,
        microchartConfigDialog,
        baseFormatPanel,
        baseFormatPanelReact,
        newFormatPanelForGrid,
        editorPanel,
        reportFormatPanel,
        toc,
        dossierPage,
        inCanvasSelector_Authoring,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {});

    //Grid 1 several attributes in rows and metrics only in column value sets
    it('[TC71088_01] Validate Incremental Fetch in Microcharts authoring and consumption modes - Acceptance 1', async () => {
        // Open dossier by ID
        // Dossier location: "Shared Report">"1. Test Users">"GridAutomation">"Retail sample dataset dossier"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridIncrementalFetch.project.id,
            dossierId: gridConstants.AGGridIncrementalFetch.id,
        });
        await browser.pause(5000);

        // Change viz type to Grid (Modern)
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');

        // Configure grid with attributes and metrics
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Item Category',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Month'
        );
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'City',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Item Category'
        );
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // Scroll grid to fetch rows
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');

        // Scroll to middle and verify cell content
        await agGridVisualization.scrollVerticallyToMiddle('Visualization 1');

        await since('Cell text at position 2055, 2 should be "Art & Architecture", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2055, 2, 'Visualization 1'))
            .toBe('Art & Architecture');

        // Scroll to bottom and verify cell content
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');

        await since('Cell text at position 4086, 3 should be "Wilmington", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4086, 3, 'Visualization 1'))
            .toBe('Wilmington');
        await since('Cell text at position 4086, 4 should be "$1,460", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4086, 4, 'Visualization 1'))
            .toBe('$1,460');

        // Add new column set
        await agGridVisualization.addColumnSet();
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Revenue',
            'metric',
            'retail-sample-data.xls',
            'Column Set 2'
        );

        // Scroll grid to fetch rows
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');

        // Scroll to middle and verify cell content
        await agGridVisualization.scrollVerticallyToMiddle('Visualization 1');

        await since('Cell text at position 2055, 2 should be "Art & Architecture", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2055, 2, 'Visualization 1'))
            .toBe('Art & Architecture');
        await since('Cell text at position 2055, 5 should be "Art & Architecture", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2055, 5, 'Visualization 1'))
            .toBe('$127,365');

        // Scroll to bottom and verify cell content
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');

        await since('Cell text at position 4086, 3 should be "Wilmington", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4086, 3, 'Visualization 1'))
            .toBe('Wilmington');
        await since('Cell text at position 4086, 4 should be "$1,460", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4086, 4, 'Visualization 1'))
            .toBe('$1,460');
        await since('Cell text at position 4086, 5 should be "$2,433", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4086, 5, 'Visualization 1'))
            .toBe('$2,433');
    });

    it('[TC71088_02] Validate Incremental Fetch in Microcharts authoring and consumption modes - Acceptance 2', async () => {
        // Open dossier by ID
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridIncrementalFetch.project.id,
            dossierId: gridConstants.AGGridIncrementalFetch.id,
        });
        await browser.pause(5000);

        // Change viz type to Grid (Modern)
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');

        // Configure grid with attributes and metrics
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Item Category',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Month'
        );
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'City',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Item Category'
        );
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // Add column set with supplier and month
        await agGridVisualization.addColumnSet();
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Column Set 2'
        );
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Month',
            'attribute',
            'retail-sample-data.xls',
            'Column Set 2'
        );
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition(
            'Revenue',
            'metric',
            'retail-sample-data.xls',
            'Column Set 2',
            'below',
            'Supplier'
        );

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
        // * I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
        // change arrangement to "Flat"
        // await newFormatPanelForGrid.setArrangement('Flat');
        await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Merge repetitive cells');
        // change wrap text to "Off" for entire grid
        await baseFormatPanelReact.switchSection('Text and Form');
        await baseFormatPanelReact.changeSegmentControl('Entire Grid', 'Row Headers');
        await newFormatPanelForGrid.clickCheckBox('Wrap text');

        // Scroll grid to fetch rows
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');

        // Scroll to middle and verify cell content
        await agGridVisualization.scrollVerticallyToMiddle('Visualization 1');

        await since('Cell text at position 2056, 3 should be "Annapolis", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2056, 3, 'Visualization 1'))
            .toBe('Annapolis');
        await since('Cell text at position 2056, 10 should be "$109,863", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2056, 10, 'Visualization 1'))
            .toBe('$109,863');

        // Scroll to bottom and verify cell content
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');

        await since('Cell text at position 4087, 3 should be "Wilmington", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 3, 'Visualization 1'))
            .toBe('Wilmington');
        await since('Cell text at position 4087, 4 should be "$1,460", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 4, 'Visualization 1'))
            .toBe('$1,460');

        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Add another column set
        await agGridVisualization.addColumnSet();
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Column Set 3'
        );
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition(
            'Revenue',
            'metric',
            'retail-sample-data.xls',
            'Column Set 3',
            'below',
            'Supplier'
        );

        // Scroll grid to fetch rows
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');

        // Verify middle cells
        await agGridVisualization.scrollVerticallyToMiddle('Visualization 1');

        await since('Cell text at position 2056, 3 should be "Annapolis", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2056, 3, 'Visualization 1'))
            .toBe('Annapolis');
        await since('Cell text at position 2056, 10 should be "$109,863", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2056, 10, 'Visualization 1'))
            .toBe('$109,863');

        // Verify bottom cells
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');

        await since('Cell text at position 4087, 3 should be "Wilmington", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 3, 'Visualization 1'))
            .toBe('Wilmington');
        await since('Cell text at position 4087, 4 should be "$1,460", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 4, 'Visualization 1'))
            .toBe('$1,460');

        // Scroll horizontally and verify
        await agGridVisualization.scrollHorizontally('right', 2000, 'Visualization 1');
        await agGridVisualization.scrollHorizontallyToNextSlice(2, 'Visualization 1');

        const headerCell = await agGridVisualization.getGroupHeader('WEA');
        await headerCell.waitForExist({ timeout: 5000 }); // Wait up to 5 seconds
        await since('Header cell "WEA" should be present')
            .expect(await headerCell.isExisting())
            .toBe(true);
    });

    it('[TC71088_03] Validate Incremental Fetch in Microcharts authoring and consumption modes - Acceptance 3', async () => {
        // Open dossier by ID
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridIncrementalFetch.project.id,
            dossierId: gridConstants.AGGridIncrementalFetch.id,
        });
        await browser.pause(5000);

        // Change viz type to Grid (Modern)
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');

        // Configure grid with attributes and metrics
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Item Category',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Month'
        );
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'City',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Item Category'
        );
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Add microchart
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectType('Trend Bars');
        await microchartConfigDialog.selectObject(1, 'Revenue');
        await microchartConfigDialog.selectObject(2, 'Supplier');
        await browser.pause(1000);
        await microchartConfigDialog.confirmDialog();
        const objectInDropZone = await editorPanelForGrid.getObjectInDropZone(
            'Revenue Comparison by Supplier',
            'Revenue Comparison by Supplier'
        );
        await objectInDropZone.isDisplayed();
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
        // * I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
        // change arrangement to "Flat"
        // await newFormatPanelForGrid.setArrangement('Flat');
        await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Merge repetitive cells');
        // change wrap text to "Off" for entire grid
        await baseFormatPanelReact.switchSection('Text and Form');
        await baseFormatPanelReact.changeSegmentControl('Entire Grid', 'Row Headers');
        await newFormatPanelForGrid.clickCheckBox('Wrap text');

        // Scroll grid to fetch rows
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');

        // Scroll to middle and verify cell content
        await agGridVisualization.scrollVerticallyToMiddle('Visualization 1');

        await since('Cell text at position 2055, 2 should be "Art & Architecture", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2055, 2, 'Visualization 1'))
            .toBe('Art & Architecture');
        await since('Cell text at position 2055, 4 should be "$100,492", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2055, 4, 'Visualization 1'))
            .toBe('$100,492');

        // Scroll to bottom and verify cell content
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');

        await since('Cell text at position 4086, 3 should be "Wilmington", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4086, 3, 'Visualization 1'))
            .toBe('Wilmington');
        await since('Cell text at position 4086, 4 should be "$1,460", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4086, 4, 'Visualization 1'))
            .toBe('$1,460');
        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Add column set
        await agGridVisualization.addColumnSet();
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Column Set 2'
        );
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'retail-sample-data.xls');

        // Scroll again and verify
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');

        // Verify bottom cells
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');

        await since('Cell text at position 4087, 3 should be "Wilmington", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 3, 'Visualization 1'))
            .toBe('Wilmington');
        await since('Cell text at position 4087, 4 should be "$1,460", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 4, 'Visualization 1'))
            .toBe('$1,460');

        // Add another column set
        await agGridVisualization.addColumnSet();
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Column Set 3'
        );
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'retail-sample-data.xls');

        // Scroll and verify again
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');

        // Verify middle cells again
        await agGridVisualization.scrollVerticallyToMiddle('Visualization 1');

        await since('Cell text at position 2056, 2 should be "Art & Architecture", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2056, 2, 'Visualization 1'))
            .toBe('Art & Architecture');
        await since('Cell text at position 2056, 4 should be "$100,492", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2056, 4, 'Visualization 1'))
            .toBe('$100,492');

        // Verify bottom cells again
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');

        await since('Cell text at position 4087, 3 should be "Wilmington", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 3, 'Visualization 1'))
            .toBe('Wilmington');
        await since('Cell text at position 4087, 4 should be "$1,460", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 4, 'Visualization 1'))
            .toBe('$1,460');

        // Scroll horizontally and verify
        await agGridVisualization.scrollHorizontally('right', 2000, 'Visualization 1');
        await agGridVisualization.scrollHorizontallyToNextSlice(2, 'Visualization 1');

        const headerCell = await agGridVisualization.getGroupHeader('WEA');
        await headerCell.waitForExist({ timeout: 5000 }); // Wait up to 5 seconds
        await since('Header cell "WEA" should be present')
            .expect(await headerCell.isExisting())
            .toBe(true);
    });

    it('[TC71100_01] Functional validation of Incremental Fetch in Microcharts authoring and consumption modes - Scenario 1', async () => {
        // Open dossier by ID
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridIncrementalFetch.project.id,
            dossierId: gridConstants.AGGridIncrementalFetch.id,
        });
        await browser.pause(5000);

        // Change viz type to Grid (Modern)
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');

        // Configure grid with attributes and metrics
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Item Category',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Month'
        );
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'City',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Item Category'
        );
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // Scroll and verify middle content
        await agGridVisualization.scrollVerticallyToMiddle('Visualization 1');

        await since('Cell text at position 2055, 2 should be "Art & Architecture", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2055, 2, 'Visualization 1'))
            .toBe('Art & Architecture');
        await since('Cell text at position 2055, 4 should be "$100,492", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2055, 4, 'Visualization 1'))
            .toBe('$100,492');

        // Scroll and verify bottom content
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');

        await since('Cell text at position 4086, 3 should be "Wilmington", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4086, 3, 'Visualization 1'))
            .toBe('Wilmington');
        await since('Cell text at position 4086, 4 should be "$1,460", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4086, 4, 'Visualization 1'))
            .toBe('$1,460');

        // Set incremental fetch to 500
        await agGridVisualization.openMoreOptionsDialog('Visualization 1');
        await agGridVisualization.setIncrementalFetchValue('500');
        await agGridVisualization.saveAndCloseMoreOptionsDialog();

        // Scroll grid to fetch rows
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');

        // Add column set with Supplier and Revenue
        await agGridVisualization.addColumnSet();
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Revenue',
            'metric',
            'retail-sample-data.xls',
            'Column Set 2'
        );
        //       await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition('Revenue', 'metric', 'retail-sample-data.xls', 'Column Set 2', 'below', 'Supplier');

        // Add microchart
        // await agGridVisualization.addMicrochartSet();
        // await microchartConfigDialog.selectType('Trend Bars');
        // await microchartConfigDialog.selectObject(1, 'Revenue');
        // await microchartConfigDialog.selectObject(2, 'Supplier');
        // await browser.pause(1000);
        // await microchartConfigDialog.confirmDialog();

        // Scroll and verify after changes
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');

        // Verify middle content again
        await agGridVisualization.scrollVerticallyToMiddle('Visualization 1');
        await browser.pause(5000);
        await since('Cell text at position 2055, 2 should be "Art & Architecture", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2055, 2, 'Visualization 1'))
            .toBe('Art & Architecture');
        await since('Cell text at position 2055, 4 should be "$100,492", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2055, 4, 'Visualization 1'))
            .toBe('$100,492');

        // Verify bottom content again
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');
        await browser.pause(5000);
        await since('Cell text at position 4086, 3 should be "Wilmington", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4086, 3, 'Visualization 1'))
            .toBe('Wilmington');
        await since('Cell text at position 4086, 4 should be "$1,460", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4086, 4, 'Visualization 1'))
            .toBe('$1,460');

        // Set incremental fetch to 1000
        await agGridVisualization.openMoreOptionsDialog('Visualization 1');
        await agGridVisualization.setIncrementalFetchValue('1000');
        await agGridVisualization.saveAndCloseMoreOptionsDialog();

        // Final scroll and verify
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');

        // Final middle content verification
        await agGridVisualization.scrollVerticallyToMiddle('Visualization 1');
        await browser.pause(5000);
        await since('Cell text at position 2055, 2 should be "Art & Architecture", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2055, 2, 'Visualization 1'))
            .toBe('Art & Architecture');
        await since('Cell text at position 2055, 4 should be "$100,492", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2055, 4, 'Visualization 1'))
            .toBe('$100,492');

        // Final bottom content verification
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');
        await browser.pause(5000);
        await since('Cell text at position 4086, 3 should be "Wilmington", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4086, 3, 'Visualization 1'))
            .toBe('Wilmington');
        await since('Cell text at position 4086, 4 should be "$1,460", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4086, 4, 'Visualization 1'))
            .toBe('$1,460');
    });

    it('[TC71100_02] Functional validation of Incremental Fetch in Microcharts authoring and consumption modes - Scenario 2', async () => {
        // Open dossier by ID
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridIncrementalFetch.project.id,
            dossierId: gridConstants.AGGridIncrementalFetch.id,
        });
        await browser.pause(5000);

        // Change viz type to Grid (Modern)
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');

        // Configure grid with attributes and metrics
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Item Category',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Month'
        );
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'City',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Item Category'
        );
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // Add column set with Supplier and Revenue
        await agGridVisualization.addColumnSet();
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Column Set 2'
        );
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition(
            'Revenue',
            'metric',
            'retail-sample-data.xls',
            'Column Set 2',
            'below',
            'Supplier'
        );
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
        // * I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
        // change arrangement to "Flat"
        // await newFormatPanelForGrid.setArrangement('Flat');
        await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Merge repetitive cells');
        // change wrap text to "Off" for entire grid
        await baseFormatPanelReact.switchSection('Text and Form');
        await baseFormatPanelReact.changeSegmentControl('Entire Grid', 'Row Headers');
        await newFormatPanelForGrid.clickCheckBox('Wrap text');
        // Scroll to middle and verify cell content
        await agGridVisualization.scrollVerticallyToMiddle('Visualization 1');

        await since('Cell text at position 2056, 2 should be "Art & Architecture", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2056, 2, 'Visualization 1'))
            .toBe('Art & Architecture');
        await since('Cell text at position 2056, 4 should be "$100,492", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2056, 4, 'Visualization 1'))
            .toBe('$100,492');

        // Scroll to bottom and verify cell content
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');

        await since('Cell text at position 4087, 3 should be "Wilmington", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 3, 'Visualization 1'))
            .toBe('Wilmington');
        await since('Cell text at position 4087, 4 should be "$1,460", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 4, 'Visualization 1'))
            .toBe('$1,460');

        // Set incremental fetch to 500
        await agGridVisualization.openMoreOptionsDialog('Visualization 1');
        await agGridVisualization.setIncrementalFetchValue('500');
        await agGridVisualization.saveAndCloseMoreOptionsDialog();

        // Scroll grid to fetch rows
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');
        await browser.pause(5000);

        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();

        // Add another column set
        await agGridVisualization.addColumnSet();
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Column Set 3'
        );
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition(
            'Revenue',
            'metric',
            'retail-sample-data.xls',
            'Column Set 3',
            'below',
            'Supplier'
        );

        // Scroll grid again to fetch rows
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');

        // Verify middle cells
        await agGridVisualization.scrollVerticallyToMiddle('Visualization 1');

        await since('Cell text at position 2056, 2 should be "Art & Architecture", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2056, 2, 'Visualization 1'))
            .toBe('Art & Architecture');
        await since('Cell text at position 2056, 4 should be "$100,492", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2056, 4, 'Visualization 1'))
            .toBe('$100,492');

        // Verify bottom cells
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');

        await since('Cell text at position 4087, 3 should be "Wilmington", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 3, 'Visualization 1'))
            .toBe('Wilmington');
        await since('Cell text at position 4087, 4 should be "$1,460", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 4, 'Visualization 1'))
            .toBe('$1,460');

        // Set incremental fetch to 1000
        await agGridVisualization.openMoreOptionsDialog('Visualization 1');
        await agGridVisualization.setIncrementalFetchValue('1000');
        await agGridVisualization.saveAndCloseMoreOptionsDialog();

        // Final scroll and verify
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');

        // Final middle verification
        await agGridVisualization.scrollVerticallyToMiddle('Visualization 1');

        await since('Cell text at position 2056, 2 should be "Art & Architecture", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2056, 2, 'Visualization 1'))
            .toBe('Art & Architecture');
        await since('Cell text at position 2056, 4 should be "$100,492", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2056, 4, 'Visualization 1'))
            .toBe('$100,492');

        // Final bottom verification
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');

        await since('Cell text at position 4087, 3 should be "Wilmington", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 3, 'Visualization 1'))
            .toBe('Wilmington');
        await since('Cell text at position 4087, 4 should be "$1,460", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 4, 'Visualization 1'))
            .toBe('$1,460');
    });

    it('[TC71100_03] Functional validation of Incremental Fetch in Microcharts authoring and consumption modes - Scenario 3', async () => {
        // Open dossier by ID
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridIncrementalFetch.project.id,
            dossierId: gridConstants.AGGridIncrementalFetch.id,
        });
        await browser.pause(5000);

        // Change viz type to Grid (Modern)
        await baseVisualization.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');

        // Configure grid with attributes and metrics
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'retail-sample-data.xls');
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'Item Category',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Month'
        );
        await vizPanelForGrid.dragDSObjectToDZwithPosition(
            'City',
            'attribute',
            'retail-sample-data.xls',
            'Rows',
            'below',
            'Item Category'
        );
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'retail-sample-data.xls');

        // Add microchart
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectType('Trend Bars');
        await microchartConfigDialog.selectObject(1, 'Revenue');
        await microchartConfigDialog.selectObject(2, 'Supplier');
        await browser.pause(1000);
        await microchartConfigDialog.confirmDialog();
        const objectInDropZone = await editorPanelForGrid.getMCFromSection(
            'Revenue Comparison by Supplier',
            'trendBar',
            'Revenue Comparison by Supplier'
        );
        await objectInDropZone.isDisplayed();

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
        // * I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
        // change arrangement to "Flat"
        // await newFormatPanelForGrid.setArrangement('Flat');
        await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Merge repetitive cells');
        // change wrap text to "Off" for entire grid
        await baseFormatPanelReact.switchSection('Text and Form');
        await baseFormatPanelReact.changeSegmentControl('Entire Grid', 'Row Headers');
        await newFormatPanelForGrid.clickCheckBox('Wrap text');

        // Scroll grid to fetch rows
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');

        // Scroll to middle and verify cell content
        await agGridVisualization.scrollVerticallyToMiddle('Visualization 1');

        await since('Cell text at position 2055, 2 should be "Art & Architecture", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2055, 2, 'Visualization 1'))
            .toBe('Art & Architecture');
        await since('Cell text at position 2055, 4 should be "$100,492", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2055, 4, 'Visualization 1'))
            .toBe('$100,492');

        // Scroll to bottom and verify cell content
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');

        await since('Cell text at position 4086, 3 should be "Wilmington", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4086, 3, 'Visualization 1'))
            .toBe('Wilmington');
        await since('Cell text at position 4086, 4 should be "$1,460", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4086, 4, 'Visualization 1'))
            .toBe('$1,460');

        // Set incremental fetch to 500
        await agGridVisualization.openMoreOptionsDialog('Visualization 1');
        await agGridVisualization.setIncrementalFetchValue('500');
        await agGridVisualization.saveAndCloseMoreOptionsDialog();

        // Scroll grid to fetch rows
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');

        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // Add column set
        await agGridVisualization.addColumnSet();
        await vizPanelForGrid.dragDSObjectToGridColumnSetDZ(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Column Set 2'
        );
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'retail-sample-data.xls');

        // Scroll grid to fetch rows
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');

        // Verify middle cells
        await agGridVisualization.scrollVerticallyToMiddle('Visualization 1');

        await since('Cell text at position 2056, 2 should be "Art & Architecture", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2056, 2, 'Visualization 1'))
            .toBe('Art & Architecture');
        await since('Cell text at position 2056, 4 should be "$100,492", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2056, 4, 'Visualization 1'))
            .toBe('$100,492');

        // Verify bottom cells
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');

        await since('Cell text at position 4087, 3 should be "Wilmington", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 3, 'Visualization 1'))
            .toBe('Wilmington');
        await since('Cell text at position 4087, 4 should be "$1,460", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 4, 'Visualization 1'))
            .toBe('$1,460');

        // Set incremental fetch to 1000
        await agGridVisualization.openMoreOptionsDialog('Visualization 1');
        await agGridVisualization.setIncrementalFetchValue('1000');
        await agGridVisualization.saveAndCloseMoreOptionsDialog();

        // Scroll grid again to fetch rows
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');

        // Verify middle cells
        await agGridVisualization.scrollVerticallyToMiddle('Visualization 1');

        await since('Cell text at position 2056, 2 should be "Art & Architecture", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2056, 2, 'Visualization 1'))
            .toBe('Art & Architecture');
        await since('Cell text at position 2056, 4 should be "$100,492", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2056, 4, 'Visualization 1'))
            .toBe('$100,492');

        // Verify bottom cells
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');

        await since('Cell text at position 4087, 3 should be "Wilmington", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 3, 'Visualization 1'))
            .toBe('Wilmington');
        await since('Cell text at position 4087, 4 should be "$1,460", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 4, 'Visualization 1'))
            .toBe('$1,460');

        // Add microchart
        await agGridVisualization.addMicrochartSet();
        await microchartConfigDialog.selectType('Trend Bars');
        await microchartConfigDialog.selectObject(1, 'Revenue');
        await microchartConfigDialog.selectObject(2, 'Supplier');
        await browser.pause(1000);
        await microchartConfigDialog.confirmDialog();

        // Scroll grid again to fetch rows
        await agGridVisualization.scrollVertically('down', 1000, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');

        // Verify middle cells
        await agGridVisualization.scrollVerticallyToMiddle('Visualization 1');

        await since('Cell text at position 2056, 2 should be "Art & Architecture", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2056, 2, 'Visualization 1'))
            .toBe('Art & Architecture');
        await since('Cell text at position 2056, 4 should be "$100,492", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2056, 4, 'Visualization 1'))
            .toBe('$100,492');

        // Verify bottom cells
        await agGridVisualization.scrollVerticallyToBottom('Visualization 1');

        await since('Cell text at position 4087, 3 should be "Wilmington", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 3, 'Visualization 1'))
            .toBe('Wilmington');
        await since('Cell text at position 4087, 4 should be "$1,460", but got #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(4087, 4, 'Visualization 1'))
            .toBe('$1,460');
    });

    it('[BCIN-6554] Change selection of attribute selector, get error "You have included an invalid argument', async () => {
        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: gridConstants.AGGrid_IncrementalFetch_Error,
        });
        // Open the dossier: 3657966FAB4A5CA8998D90B58498504B in consumption mode
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_IncrementalFetch_Error.project.id,
            dossierId: gridConstants.AGGrid_IncrementalFetch_Error.id,
        });
        await toc.openPageFromTocMenu({ chapterName: 'x-fun', pageName: 'Selectors' });
        await dossierPage.hidePageIndicator();
        await inCanvasSelector_Authoring.checkElementListByIndex(2, 'Supplier');
        await inCanvasSelector_Authoring.checkElementListByIndex(2, 'Year');
        await inCanvasSelector_Authoring.checkElementListByIndex(2, 'Supplier');
        await inCanvasSelector_Authoring.checkElementListByIndex(2, 'Year');
        await browser.pause(2000);
        // take screenshot
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Modern Grid - Column Fit to content'),
            'BCIN-6554_1',
            'Should not show error when switch attribute metric selector'
        );
    });
});
