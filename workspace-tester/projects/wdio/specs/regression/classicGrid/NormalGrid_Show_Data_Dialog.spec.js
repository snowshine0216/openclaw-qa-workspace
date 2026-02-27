import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as gridConstants from '../../../constants/grid.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('_sort') };
const { credentials } = specConfiguration;

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/classicGrid/NormalGrid_E2E.spec.js'
describe('Normal Grid Data Source E2E workflows', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {});

    let {
        libraryPage,
        vizPanelForGrid,
        datasetPanel,
        contentsPanel,
        showDataDialog,
        editorPanelForGrid,
        agGridVisualization,
        loginPage,
    } = browsers.pageObj1;

    async function getGridCellText(row, col) {
        let text = await showDataDialog.getGridCellByPosition(row, col).getText();
        return text;
    }

    it('[TC5110_1] Test show data dialog with a normal grid', async () => {
        // Wait for the Dossier Editor to be fully loaded
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_Show_Data.project.id,
            dossierId: gridConstants.Grid_Show_Data.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Classic Grid' });

        // Open the context menu and click "Show Data" for the grid visualization
        await vizPanelForGrid.openContextMenu('Classic Grid');
        await vizPanelForGrid.selectContextMenuOption('Show Data');

        await browser.pause(2000); // Wait for the dialog to open
        // Verify the "Show Data" editor dialog title
        let editorTitle = await showDataDialog.getHeaderTitle().getText();
        await since('The editor shows up with title "Show Data"').expect(editorTitle).toBe('Show Data');

        // Verify the grid has the specified element "$1,560,568"
        await since('The show data grid has element "$1,560,568"')
            .expect(await getGridCellText(2, 2))
            .toBe('$1,560,568');

        // Verify the grid shows "100" rows of data
        let rowCount = await showDataDialog.getDatasetRowCount();
        await since('It shows there are "100" rows of data in the show data dialog').expect(rowCount).toBe(100);

        // Verify the grid headers
        await since('The show data grid at row "0" and column "0" has element "Supplier"')
            .expect(await getGridCellText(0, 0))
            .toBe('Supplier');

        await since('The show data grid at row "0" and column "0" has element "Cost"')
            .expect(await getGridCellText(0, 2))
            .toBe('Cost');

        // Verify specific grid cell values
        await since('The show data grid at row "1" and column "0" has element "20th Century Fox"')
            .expect(await getGridCellText(1, 0))
            .toBe('20th Century Fox');
        await since('The show data grid at row "1" and column "1" has element "Action Movies"')
            .expect(await getGridCellText(1, 1))
            .toBe('Action Movies');
        await since('The show data grid at row "2" and column "0" has element "20th Century Fox"')
            .expect(await getGridCellText(2, 0))
            .toBe('20th Century Fox');
        await since('The show data grid at row "2" and column "1" has element "Comedy Movies"')
            .expect(await getGridCellText(2, 1))
            .toBe('Comedy Movies');

        // Sort by "Item Category" and verify grid content
        await showDataDialog.sortShowDataGridbyClickingHeader('Item Category');
        await since('The show data grid at row "1" and column "0" has element "20th Century Fox"')
            .expect(await getGridCellText(1, 0))
            .toBe('20th Century Fox');
        await since('The show data grid at row "1" and column "1" has element "Action Movies"')
            .expect(await getGridCellText(1, 1))
            .toBe('Action Movies');
        await since('The show data grid at row "2" and column "0" has element "Columbia Pictures"')
            .expect(await getGridCellText(2, 0))
            .toBe('Columbia Pictures');
        await since('The show data grid at row "2" and column "1" has element "Action Movies"')
            .expect(await getGridCellText(2, 1))
            .toBe('Action Movies');

        // Sort "Item Category" again and verify grid content
        await showDataDialog.sortShowDataGridbyClickingHeader('Item Category');
        await since('The show data grid at row "1" and column "0" has element "DSS Appliance Co."')
            .expect(await getGridCellText(1, 0))
            .toBe('DSS Appliance Co.');
        await since('The show data grid at row "1" and column "1" has element "Video Equipment"')
            .expect(await getGridCellText(1, 1))
            .toBe('Video Equipment');
        await since('The show data grid at row "2" and column "0" has element "Entertaintron Inc."')
            .expect(await getGridCellText(2, 0))
            .toBe('Entertaintron Inc.');
        await since('The show data grid at row "2" and column "1" has element "Video Equipment"')
            .expect(await getGridCellText(2, 1))
            .toBe('Video Equipment');

        // Sort by "Cost" and verify grid contentapplyAndCloseUnitSelectionPopup
        await showDataDialog.sortShowDataGridbyClickingHeader('Cost');
        await since('The show data grid at row "2" and column "0" has element "Columbia House"')
            .expect(await getGridCellText(2, 0))
            .toBe('Columbia House');
        await since('The show data grid at row "2" and column "1" has element "Soul / R&B"')
            .expect(await getGridCellText(2, 1))
            .toBe('Soul / R&B');

        // Verify the horizontal scrollbar is not displayed
        let isScrollbarDisplayed = await showDataDialog.getHorizantalScrollContent().isDisplayed();
        await browser.pause(2000); // Wait for the grid to update
        await since('The horizontal scrollbar is not displayed in the show data grid')
            .expect(isScrollbarDisplayed)
            .toBe(false);

        // Resize column "1" by 80 pixels to the right
        await showDataDialog.resizeColumnByMovingBorder(1, 300, 'right');

        // Verify the horizontal scrollbar is displayed
        isScrollbarDisplayed = await showDataDialog.getHorizantalScrollContent().isDisplayed();
        await browser.pause(2000); // Wait for the grid to update
        await since('The horizontal scrollbar is displayed in the show data grid')
            .expect(isScrollbarDisplayed)
            .toBe(true);

        // Add the show data grid as a visualization
        await showDataDialog.addGridToViz();

        // Verify the editor is closed and the visualization is displayed on the canvas
        let isEditorDisplayed = await showDataDialog.getShowDataDialog().isDisplayed();
        await since('The editor with title "Show Data" is closed').expect(isEditorDisplayed).toBe(false);

        let isVisualizationDisplayed = await vizPanelForGrid.getGridContainer('Visualization').isDisplayed();
        await since('Container "Visualization" is displayed on canvas').expect(isVisualizationDisplayed).toBe(true);

        // Verify grid cell values in the added visualization
        await since('The grid cell in ag-grid "Visualization" at "2", "1" has text "Bantam Books"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 1, 'Visualization').getText())
            .toBe('Bantam Books');
        await since('The grid cell in ag-grid "Visualization" at "2", "2" has text "Business Administration"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 2, 'Visualization').getText())
            .toBe('Business Administration');
        await since('The grid cell in ag-grid "Visualization" at "2", "3" has text "$371,664"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization').getText())
            .toBe('$371,664');
        await since('The grid cell in ag-grid "Visualization" at "3", "1" has text "Columbia House"')
            .expect(await agGridVisualization.getGridCellByPosition(3, 1, 'Visualization').getText())
            .toBe('Columbia House');
        await since('The grid cell in ag-grid "Visualization" at "3", "2" has text "Soul / R&B"')
            .expect(await agGridVisualization.getGridCellByPosition(3, 2, 'Visualization').getText())
            .toBe('Soul / R&B');
        // Open the show data dialog for a specific object
        let elm = await vizPanelForGrid.getGridElement('Bantam Books', 'Classic Grid');
        await vizPanelForGrid.rightMouseClickOnElement(elm);
        await vizPanelForGrid.selectContextMenuOption('Show Data...');

        // Verify the "Show Data" editor dialog title
        editorTitle = await showDataDialog.getHeaderTitle().getText();
        await since('An editor shows up with title "Show Data"').expect(editorTitle).toBe('Show Data');

        // Verify the grid shows "4" rows of data
        rowCount = await showDataDialog.getDatasetRowCount();
        await since('It shows there are "4" rows of data in the show data dialog').expect(rowCount).toBe(4);

        // Verify grid headers and specific cell values
        await since('The show data grid has header "Supplier"')
            .expect(await getGridCellText(0, 0))
            .toBe('Supplier');
        await since('The show data grid at row "1" and column "0" has element "Bantam Books"')
            .expect(await getGridCellText(1, 0))
            .toBe('Bantam Books');
        await since('The show data grid at row "1" and column "1" has element "Art & Architecture"')
            .expect(await getGridCellText(1, 1))
            .toBe('Art & Architecture');
        await since('The show data grid at row "2" and column "0" has element "Bantam Books"')
            .expect(await getGridCellText(2, 0))
            .toBe('Bantam Books');
        await since('The show data grid at row "2" and column "1" has element "Business Administration"')
            .expect(await getGridCellText(2, 1))
            .toBe('Business Administration');

        // Add another object to the show data grid
        await showDataDialog.clickAddDataButton();
        await showDataDialog.selectUnitsInUnitSelectionPopup('City');
        await showDataDialog.clickAddDataOkButton();
        await browser.pause(5000); // Wait for the grid to update

        // Verify the updated grid content
        await since('It shows there are "55" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(55);
        await since('The show data grid has header "City"')
            .expect(await getGridCellText(0, 2))
            .toBe('City');
        await since('The show data grid at row "1" and column "2" has element "Annapolis"')
            .expect(await getGridCellText(1, 2))
            .toBe('Annapolis');
        await since('The show data grid has element "$307,695"')
            .expect(await getGridCellText(1, 3))
            .toBe('$307,695');

        await showDataDialog.clickShowDataExportButton();
        await showDataDialog.exportShowData('Excel');
        await browser.pause(3000); // Wait for the export to complete

        // Close the show data dialog
        await showDataDialog.closeShowDataDialog();

        // Verify the editor is closed
        isEditorDisplayed = await showDataDialog.getShowDataDialog().isDisplayed();
        await since('The editor with title "Show Data" is closed').expect(isEditorDisplayed).toBe(false);
    });

    it('[TC5110_2] Compound grid show data test', async () => {
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_Show_Data.project.id,
            dossierId: gridConstants.Grid_Show_Data.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Compound Grid' });
        // Step 7: Show data from visualization context menu
        await vizPanelForGrid.openContextMenu('Compound Grid');
        await vizPanelForGrid.selectContextMenuOption('Show Data');
        await since('An editor shows up with title "Show Data"')
            .expect(await showDataDialog.getHeaderTitle().getText())
            .toBe('Show Data');
        await since('It shows there are "36" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(36);
        await since('The show data grid has header "Supplier"')
            .expect(await getGridCellText(0, 0))
            .toBe('Supplier');
        await since('The show data grid has header "Revenue"')
            .expect(await getGridCellText(0, 1))
            .toBe('Revenue');
        await since('The show data grid at row "1" and column "0" has element "20th Century Fox"')
            .expect(await getGridCellText(1, 0))
            .toBe('20th Century Fox');
        await since('The show data grid at row "1" and column "1" has element "$10,073,021"')
            .expect(await getGridCellText(1, 1))
            .toBe('$10,073,021');

        // Step 8: Switch to column set 2
        await showDataDialog.selectColumnSetOption('Column Set 2');
        await browser.pause(2000); // Wait for the grid to update
        await since('The show data grid has header "Supplier"')
            .expect(await getGridCellText(0, 0))
            .toBe('Supplier');
        await since('The show data grid has header "Cost"')
            .expect(await getGridCellText(0, 1))
            .toBe('Cost');
        await since('The show data grid at row "1" and column "0" has element "20th Century Fox"')
            .expect(await getGridCellText(1, 0))
            .toBe('20th Century Fox');
        await since('The show data grid at row "1" and column "1" has element "$6,766,511"')
            .expect(await getGridCellText(1, 1))
            .toBe('$6,766,511');
        await since('It shows there are "36" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(36);

        // Step 9: Add objects to the grid
        await showDataDialog.clickAddDataButton();
        await showDataDialog.selectUnitsInUnitSelectionPopup('Month,Unit Price');
        await showDataDialog.clickAddDataOkButton();
        await browser.pause(3000); // Wait for the grid to update

        await since('The show data grid has header "Month"')
            .expect(await getGridCellText(0, 1))
            .toBe('Month');
        await since('The show data grid has header "Unit Price"')
            .expect(await getGridCellText(0, 3))
            .toBe('Unit Price');
        await since('The show data grid at row "1" and column "0" has element "20th Century Fox"')
            .expect(await getGridCellText(1, 0))
            .toBe('20th Century Fox');

        await since('The show data grid at row "1" and column "1" has element "Jan"')
            .expect(await getGridCellText(1, 1))
            .toBe('Jan');

        await since('The show data grid at row "1" and column "2" has element "$398,708"')
            .expect(await getGridCellText(1, 2))
            .toBe('$398,708');
        await since('The show data grid at row "1" and column "3" has element "$2,582.80"')
            .expect(await getGridCellText(1, 3))
            .toBe('$2,582.80');
        await since('It shows there are "432" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(432);

        // Step 10: Switch back to column set 1
        await showDataDialog.selectColumnSetOption('Column Set 1');
        await browser.pause(2000); // Wait for the grid to update
        await since('The show data grid has header "Supplier"')
            .expect(await getGridCellText(0, 0))
            .toBe('Supplier');
        await since('The show data grid has header "Revenue"')
            .expect(await getGridCellText(0, 1))
            .toBe('Revenue');
        await since('The show data grid at row "1" and column "0" has element "20th Century Fox"')
            .expect(await getGridCellText(1, 0))
            .toBe('20th Century Fox');
        await since('The show data grid at row "1" and column "1" has element "$10,073,021"')
            .expect(await getGridCellText(1, 1))
            .toBe('$10,073,021');
        await since('It shows there are "36" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(36);

        await showDataDialog.clickAddDataButton();
        await showDataDialog.selectUnitsInUnitSelectionPopup('Month,Unit Price');
        await showDataDialog.clickAddDataOkButton();
        await browser.pause(3000); // Wait for the grid to update

        // Step 11: Add as grid
        await showDataDialog.addGridToViz();
        await since('The editor with title "Show Data" is closed')
            .expect(await showDataDialog.getShowDataDialog().isDisplayed())
            .toBe(false);
        await since('Container "Visualization" is displayed on canvas')
            .expect(await vizPanelForGrid.getGridContainer('Visualization').isDisplayed())
            .toBe(true);
        await since('The grid cell in ag-grid "Visualization" at "2", "1" has text "20th Century Fox"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 1, 'Visualization').getText())
            .toBe('20th Century Fox');
        await since('The grid cell in ag-grid "Visualization" at "2", "2" has text "Jan"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 2, 'Visualization').getText())
            .toBe('Jan');
        await since('The grid cell in ag-grid "Visualization" at "2", "3" has text "$603,188"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization').getText())
            .toBe('$603,188');

        // Step 12: Rename the visualization
        await vizPanelForGrid.renameVisualizationByDoubleClick('Visualization', 'ShowData1');

        // Step 13: Show data from a specific cell
        let elm = await vizPanelForGrid.getGridElement('Bantam Books', 'Compound Grid');
        await vizPanelForGrid.rightMouseClickOnElement(elm);
        await vizPanelForGrid.selectContextMenuOption('Show Data...');
        await since('An editor shows up with title "Show Data"')
            .expect(await showDataDialog.getHeaderTitle().getText())
            .toBe('Show Data');
        await since('The show data grid has header "Supplier"')
            .expect(await getGridCellText(0, 0))
            .toBe('Supplier');
        await since('The show data grid has header "Revenue"')
            .expect(await getGridCellText(0, 1))
            .toBe('Revenue');
        await since('The show data grid at row "1" and column "0" has element "Bantam Books"')
            .expect(await getGridCellText(1, 0))
            .toBe('Bantam Books');
        await since('The show data grid at row "1" and column "1" has element "$7,408,658"')
            .expect(await getGridCellText(1, 1))
            .toBe('$7,408,658');
        await since('It shows there are "1" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(1);

        // Step 14: Add as grid (filtered data)
        await showDataDialog.addGridToViz();
        await since('The editor with title "Show Data" is closed')
            .expect(await showDataDialog.getShowDataDialog().isDisplayed())
            .toBe(false);
        await since('Container "Visualization" is displayed on canvas')
            .expect(await vizPanelForGrid.getGridContainer('Visualization').isDisplayed())
            .toBe(true);
        await since('The grid cell in ag-grid "Visualization" at "2", "1" has text "Bantam Books"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 1, 'Visualization').getText())
            .toBe('Bantam Books');
        await since('The grid cell in ag-grid "Visualization" at "2", "2" has text "$7,408,658"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 2, 'Visualization').getText())
            .toBe('$7,408,658');
    });

    it('[TC2599_1] Show data on compound grid -- Sort and Export', async () => {
        // Step 1: Open the dossier by its ID
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_Show_Data_2.project.id,
            dossierId: gridConstants.Grid_Show_Data_2.id,
        });
        // Step 2: Switch to the target page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });

        // Step 3: Show data from visualization context menu
        await vizPanelForGrid.openContextMenu('Compound Grid');
        await vizPanelForGrid.selectContextMenuOption('Show Data');
        await since('An editor shows up with title "Show Data"')
            .expect(await showDataDialog.getHeaderTitle().getText())
            .toBe('Show Data');
        await since('It shows there are "136" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(136);
        await since('The show data grid has header "Category"')
            .expect(await getGridCellText(0, 0))
            .toBe('Category');
        await since('The show data grid has header "Profit"')
            .expect(await getGridCellText(0, 5))
            .toBe('Profit');

        // Step 4: Sort on metric (Ascending)
        await showDataDialog.sortShowDataGridbyClickingHeader('Profit');
        await since('The show data grid at row "1" and column "0" has element "Music"')
            .expect(await getGridCellText(1, 0))
            .toBe('Music');
        await since('The show data grid at row "1" and column "5" has element "$1,086"')
            .expect(await getGridCellText(1, 5))
            .toBe('$1,086');

        // Step 5: Sort on metric (Descending)
        await showDataDialog.sortShowDataGridbyClickingHeader('Profit');
        await since('The show data grid at row "1" and column "0" has element "Electronics"')
            .expect(await getGridCellText(1, 0))
            .toBe('Electronics');
        await since('The show data grid at row "1" and column "5" has element "$473,793"')
            .expect(await getGridCellText(1, 5))
            .toBe('$473,793');

        // Step 6: Sort on attribute
        await showDataDialog.sortShowDataGridbyClickingHeader('Manager');
        await since('The show data grid at row "1" and column "0" has element "Books"')
            .expect(await getGridCellText(1, 0))
            .toBe('Books');
        await since('The show data grid at row "1" and column "1" has element "Abram"')
            .expect(await getGridCellText(1, 1))
            .toBe('Abram');
        await since('The show data grid at row "1" and column "2" has element "Crisby"')
            .expect(await getGridCellText(1, 2))
            .toBe('Crisby');
        await since('The show data grid at row "1" and column "5" has element "$13,629"')
            .expect(await getGridCellText(1, 5))
            .toBe('$13,629');

        // Step 7: Add object
        await showDataDialog.clickAddDataButton();
        await showDataDialog.selectUnitsInUnitSelectionPopup('Subcategory');
        await showDataDialog.clickAddDataOkButton();
        await browser.pause(2000); // Wait for the grid to update
        await since('1 The show data grid has header "Subcategory"')
            .expect(await getGridCellText(0, 5))
            .toBe('Subcategory');

        // Step 8: Switch to column set 2
        await showDataDialog.selectColumnSetOption('Column Set 2');
        await browser.pause(2000); // Wait for the grid to update
        await since('The show data grid has header "Cost"')
            .expect(await getGridCellText(0, 4))
            .toBe('Cost');
        await since('The show data grid does not have header "Profit"')
            .expect(await showDataDialog.getDatasetHeaders())
            .not.toContain('Profit');
        await since('The show data grid does not have header "Subcategory"')
            .expect(await showDataDialog.getDatasetHeaders())
            .not.toContain('Subcategory');
        await since('The show data grid at row "1" and column "0" has element "Aoter"')
            .expect(await getGridCellText(1, 0))
            .toBe('Aoter');
        await since('The show data grid at row "1" and column "1" has element "Barbara"')
            .expect(await getGridCellText(1, 1))
            .toBe('Barbara');
        await since('The show data grid at row "1" and column "4" has element "$514,795"')
            .expect(await getGridCellText(1, 4))
            .toBe('$514,795');
        await since('It shows there are "34" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(34);

        // Step 9: Switch back to column set 1
        await showDataDialog.selectColumnSetOption('Column Set 1');
        await browser.pause(2000); // Wait for the grid to update
        await since('The show data grid does not have header "Subcategory"')
            .expect(await showDataDialog.getDatasetHeaders())
            .not.toContain('Subcategory');
        await since('The show data grid at row "1" and column "0" has element "Books"')
            .expect(await getGridCellText(1, 0))
            .toBe('Books');
        await since('The show data grid at row "1" and column "1" has element "Aoter"')
            .expect(await getGridCellText(1, 1))
            .toBe('Aoter');
        await since('The show data grid at row "1" and column "2" has element "Barbara"')
            .expect(await getGridCellText(1, 2))
            .toBe('Barbara');
        await since('The show data grid at row "1" and column "5" has element "$10,027"')
            .expect(await getGridCellText(1, 5))
            .toBe('$10,027');

        // Step 10: Switch to column set 2 and add object
        await showDataDialog.selectColumnSetOption('Column Set 2');
        await browser.pause(3000); // Wait for the grid to update
        await showDataDialog.clickAddDataButton();
        await showDataDialog.selectUnitsInUnitSelectionPopup('Subcategory');
        await showDataDialog.clickAddDataOkButton();
        await browser.pause(2000); // Wait for the grid to update
        await since('2 The show data grid has header "Subcategory"')
            .expect(await getGridCellText(0, 4))
            .toBe('Subcategory');

        // Step 11: Export the grid
        await browser.pause(2000); // Pause for export
        await showDataDialog.clickShowDataExportButton();
        await showDataDialog.exportShowData('Excel');
        await browser.pause(2000); // Pause for export completion

        // Step 12: Close the show data dialog
        await showDataDialog.closeShowDataDialog();
        await since('The editor with title "Show Data" is closed')
            .expect(await showDataDialog.getShowDataDialog().isDisplayed())
            .toBe(false);
    });

    it('[TC2599_2]  @DE158313 DE158313 Test double encoded regression issue and hide column header', async () => {
        // Step 1: Open the dossier by its ID
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_Show_Data_2.project.id,
            dossierId: gridConstants.Grid_Show_Data_2.id,
        });
        // Step 2: Switch to the target page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 4' });

        // Step 3: Show data from visualization context menu
        await vizPanelForGrid.openContextMenu('Group');
        await vizPanelForGrid.selectContextMenuOption('Show Data');

        await since('The show data grid at row "1" and column "0" has element "Books"')
            .expect(await getGridCellText(1, 0))
            .toBe('Books');
        await since('The show data grid at row "2" and column "1" has element "Art & Architecture"')
            .expect(await getGridCellText(2, 1))
            .toBe('Art & Architecture');
        await since('The show data grid at row "4" and column "1" has element "Science & Technology"')
            .expect(await getGridCellText(4, 1))
            .toBe('Science & Technology');
    });
});
