import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';

describe('Compound Grid Subtotals and Derived Metrics', () => {
    let { loginPage, libraryPage, gridAuthoring, contentsPanel, visualizationPanel, editorPanelForGrid } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridTestUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    const viz1 = 'Visualization 1';
    const monthAttribute = 'Month';
    const supplierAttribute = 'Supplier';
    const itemCategoryAttribute = 'Item Category';
    const revenueMetric = 'Revenue';
    const costMetric = 'Cost';

    it('[TC55031_1] Attributes 1, 2, 3 in rows and metrics 1 and 2 in columns', async () => {
        // Test data constants

        // Open dossier by ID
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGrid_Subtotals.id,
            projectId: gridConstants.CompoundGrid_Subtotals.project.id,
        });

        // Wait for dossier to load
        await browser.pause(2000);

        // 1. Enable subtotals "Total" of attribute "Month" on grid visualization "Visualization 1"
        await gridAuthoring.clickOnContainerTitle(viz1);
        await browser.pause(1000);

        try {
            await editorPanelForGrid.createSubtotalsFromEditorPanel(monthAttribute, 'attribute', 'Total');
            console.log(`Successfully enabled Total subtotals for ${monthAttribute}`);
        } catch (error) {
            console.log(`Could not enable Total subtotals for ${monthAttribute}: ${error.message}`);
        }

        // 2. Enable subtotals "Average" of attribute "Supplier" on grid visualization "Visualization 1"
        try {
            await editorPanelForGrid.createSubtotalsFromEditorPanel(supplierAttribute, 'attribute', 'Average');
            console.log(`Successfully enabled Average subtotals for ${supplierAttribute}`);
        } catch (error) {
            console.log(`Could not enable Average subtotals for ${supplierAttribute}: ${error.message}`);
        }

        // 3. Enable subtotals "Maximum" of attribute "Item Category" on grid visualization "Visualization 1"
        try {
            await editorPanelForGrid.createSubtotalsFromEditorPanel(itemCategoryAttribute, 'attribute', 'Maximum');
            console.log(`Successfully enabled Maximum subtotals for ${itemCategoryAttribute}`);
        } catch (error) {
            console.log(`Could not enable Maximum subtotals for ${itemCategoryAttribute}: ${error.message}`);
        }

        // Wait for subtotals to be applied
        await browser.pause(2000);

        // 4. image match
        await visualizationPanel.takeScreenshotBySelectedViz(
            'TC55031_1',
            'Compound Grid with total average and maximum'
        );

        // 5. Open Calculation editor for "Revenue" in the Grid Editor Panel and "Subtract" "Cost"
        await editorPanelForGrid.createCalculationFromEditorPanel(revenueMetric, 'Subtract', costMetric);

        await visualizationPanel.takeScreenshotBySelectedViz(
            'TC55031_1',
            'Compound Grid with total average and maximum and calculation'
        );

        await gridAuthoring.rightClickOnGridElement('Total', 'Visualization 1');
        await gridAuthoring.selectContextMenuOption('Move to bottom');

        await visualizationPanel.takeScreenshotBySelectedViz(
            'TC55031_1',
            'Compound Grid with total and move total to bottom'
        );
    });

    it('[TC55031_2] Attributes 1 and 2 in rows and attribute 3 and metrics 1 and 2 in columns', async () => {
        // Open dossier by ID
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGrid_Subtotals.id,
            projectId: gridConstants.CompoundGrid_Subtotals.project.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        // Wait for dossier to load
        await browser.pause(2000);

        // 1. Enable subtotals "Total" of attribute "Month" on grid visualization "Visualization 1"
        await gridAuthoring.clickOnContainerTitle(viz1);
        await browser.pause(1000);

        try {
            await editorPanelForGrid.createSubtotalsFromEditorPanel(monthAttribute, 'attribute', 'Total');
            console.log(`Successfully enabled Total subtotals for ${monthAttribute}`);
        } catch (error) {
            console.log(`Could not enable Total subtotals for ${monthAttribute}: ${error.message}`);
        }

        // Wait for subtotals to be applied
        await browser.pause(2000);

        // Verify the grid cell has "Total" text
        await since(`Grid cell at position "3", "1" should have text "Total"`)
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, viz1))
            .toBe('Total');

        // 2. Enable subtotals "Average" of attribute "Supplier" on grid visualization "Visualization 1"
        try {
            await editorPanelForGrid.createSubtotalsFromEditorPanel(supplierAttribute, 'attribute', 'Average');
            console.log(`Successfully enabled Average subtotals for ${supplierAttribute}`);
        } catch (error) {
            console.log(`Could not enable Average subtotals for ${supplierAttribute}: ${error.message}`);
        }

        // Wait for subtotals to be applied
        await browser.pause(2000);

        // Verify the grid cell has "Average" text
        await since(`Grid cell at position "4", "2" should have text "Average"`)
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(4, 2, viz1))
            .toBe('Average');

        // 3. Enable subtotals "Maximum" of "Attribute" named "Item Category" in the Grid Editor Panel
        try {
            await editorPanelForGrid.createSubtotalsFromEditorPanel(itemCategoryAttribute, 'attribute', 'Maximum');
            console.log(`Successfully enabled Maximum subtotals for ${itemCategoryAttribute}`);
        } catch (error) {
            console.log(`Could not enable Maximum subtotals for ${itemCategoryAttribute}: ${error.message}`);
        }

        // Wait for all subtotals to be applied
        await browser.pause(2000);

        // Take screenshot for image match verification
        await visualizationPanel.takeScreenshotBySelectedViz(
            'TC55031_2',
            'Compound Grid with total average and maximum'
        );

        // 4. Open Calculation editor for "Revenue" in the Grid Editor Panel and "Subtract" "Cost"
        await editorPanelForGrid.createCalculationFromEditorPanel(revenueMetric, 'Subtract', costMetric);

        // Wait for derived metric to be applied
        await browser.pause(2000);

        // Take screenshot for image match verification with derived metric
        await visualizationPanel.takeScreenshotBySelectedViz(
            'TC55031_2',
            'Compound Grid with total average and maximum and calculation'
        );
    });

    it('[TC55031_3] Attributes 1 and 2 in rows and metrics 1 and 2 and attribute 3 in columns', async () => {
        // Open dossier by ID
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.CompoundGrid_Subtotals.id,
            projectId: gridConstants.CompoundGrid_Subtotals.project.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 3' });
        // 1. Enable subtotals "Total" of attribute "Month" on grid visualization "Visualization 1"
        await gridAuthoring.clickOnContainerTitle(viz1);
        await browser.pause(1000);

        try {
            await editorPanelForGrid.createSubtotalsFromEditorPanel(monthAttribute, 'attribute', 'Total');
            console.log(`Successfully enabled Total subtotals for ${monthAttribute}`);
        } catch (error) {
            console.log(`Could not enable Total subtotals for ${monthAttribute}: ${error.message}`);
        }

        // 2. Enable subtotals "Average" of attribute "Supplier" on grid visualization "Visualization 1"
        try {
            await editorPanelForGrid.createSubtotalsFromEditorPanel(supplierAttribute, 'attribute', 'Average');
            console.log(`Successfully enabled Average subtotals for ${supplierAttribute}`);
        } catch (error) {
            console.log(`Could not enable Average subtotals for ${supplierAttribute}: ${error.message}`);
        }

        // 3. Enable subtotals "Maximum" of "Attribute" named "Item Category" in the Grid Editor Panel
        try {
            await editorPanelForGrid.createSubtotalsFromEditorPanel(itemCategoryAttribute, 'attribute', 'Maximum');
            console.log(`Successfully enabled Maximum subtotals for ${itemCategoryAttribute}`);
        } catch (error) {
            console.log(`Could not enable Maximum subtotals for ${itemCategoryAttribute}: ${error.message}`);
        }

        // Wait for all subtotals to be applied
        await browser.pause(2000);

        // Take screenshot for image match verification
        await visualizationPanel.takeScreenshotBySelectedViz(
            'TC55031_3',
            'Compound Grid with total average and maximum'
        );

        // 4. Open Calculation editor for "Revenue" in the Grid Editor Panel and "Subtract" "Cost"
        await editorPanelForGrid.createCalculationFromEditorPanel(revenueMetric, 'Subtract', costMetric);

        // Wait for derived metric to be applied
        await browser.pause(2000);

        // Take screenshot for image match verification with derived metric
        await visualizationPanel.takeScreenshotBySelectedViz(
            'TC55031_3',
            'Compound Grid with total average and maximum and calculation'
        );
    });
});
