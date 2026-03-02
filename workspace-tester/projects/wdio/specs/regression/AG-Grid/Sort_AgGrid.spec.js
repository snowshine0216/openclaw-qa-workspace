import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';
import Grid from '../../../pageObjects/visualization/Grid.js';
import EditorPanel from '../../../pageObjects/dossierEditor/EditorPanel.js';
import DossierPage from '../../../pageObjects/dossier/DossierPage.js';
import LibraryPage from '../../../pageObjects/library/LibraryPage.js';
import LoginPage from '../../../pageObjects/auth/LoginPage.js';
import AdvancedSort from '../../../pageObjects/dossier/AdvancedSort.js';
import TOC from '../../../pageObjects/dossier/TOC.js';
import DatasetPanel from '../../../pageObjects/authoring/DatasetPanel.js';
import VizPanelForGrid from '../../../pageObjects/authoring/VizPanelForGrid.js';
import { gridUser } from '../../../constants/grid.js';
import AgGridVisualization from '../../../pageObjects/agGrid/AgGridVisualization.js';
import ReportToolbar from '../../../pageObjects/report/reportEditor/ReportToolbar.js'
import ContentsPanel from '../../../pageObjects/dossierEditor/ContentsPanel.js'
import DossierAuthoringPage from '../../../pageObjects/dossier/DossierAuthoringPage.js';

const credentials = gridUser;

// Standard wait time to use consistently throughout tests
const STANDARD_WAIT = 2000;
const EXTENDED_WAIT = 3000;

/**
 * @description This test suite validates the AG Grid sorting functionality,
 * based on the original Sort_AgGrid.feature test from BIWeb
 * Includes test cases:
 * - TC71082: Basic AG Grid Sort
 * - TC2710: Advanced Sort in AG Grid
 * - TC65149: Metric Sort by All Values/Subtotals
 * - TC65147: Sort Within sorting on metrics
 * - TC76207: Advanced Sort with MicroCharts
 */
describe('AG Grid Sort Test', () => {
    // Initialize page objects
    const grid = new Grid();
    const agGrid = new AgGridVisualization();
    const editorPanel = new EditorPanel();
    const toc = new TOC();
    const dossierPage = new DossierPage();
    const libraryPage = new LibraryPage();
    const loginPage = new LoginPage();
    const datasetPanel = new DatasetPanel();
    const vizPanel = new VizPanelForGrid();
    const contentsPanel = new ContentsPanel();
    const toolBar = new DossierAuthoringPage();
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const tutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'MicroStrategy Tutorial',
    };
    
    // Define all dossier IDs from the feature file
    const agGridSortDossier = {
        id: '245DBA5711EAF71100670080EF456284',
        name: 'AC_Compound Grid sort',
        project: tutorialProject,
    };
    
    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
        await browser.execute(() => {
            mstrmojo.vi.enums.DefaultFeatureValues["features.react-integration-enabled"] = true;
        });
    });
    
    /**
     * Performs a sort operation on the grid and verifies the expected values
     * @param {Object} options - Configuration object with the following properties:
     * @param {string} options.title - The title of the visualization
     * @param {string} options.headerName - The name of the header to sort
     * @param {string} options.sortType - The type of sort to perform ('Sort Ascending', 'Sort Descending', 'Clear Sort', 'Sort Within an Attribute > Attribute Name', etc.)
     * @param {boolean} options.isContextMenu - Whether to use context menu (right-click) for sorting
     * @param {boolean} options.isAgGrid - Whether the grid is an AG Grid
     * @param {Array} options.verificationPoints - Array of verification points with row, col, expectedValue
     */
    async function performSort({ title, headerName, firstOption, secondOption, selectFromPanel = true, objectType = 'attribute', isAgGrid = true, verificationPoints = [] }) {
        try {

            if (selectFromPanel) {
                const element = await editorPanel.getObjectFromEditor(headerName, editorPanel.getObjectTypeId(objectType));
                // Open the context menu on the element
                await grid.selectContextMenuOptions({ elem: element, firstOption, secondOption, offset: { x: -40, y: 0 } });
            }
            else {
                await grid.selectGridContextMenuOption({
                    title,
                    headerName,
                    firstOption,
                    secondOption,
                    agGrid: isAgGrid
                });
            }

            await browser.pause(STANDARD_WAIT);
        } catch (error) {
            console.error(`Sort operation failed: ${error.message}`);
            // Take screenshot of the error state
            await takeScreenshotByElement(await grid.getContainerByTitle(title), 'AG Grid Sort', 'Sort Error');
            throw error;
        }
    }

    async function verify(verificationPoints, title, isAgGrid = true) {
        // Verify each verification point
        if (verificationPoints && verificationPoints.length > 0) {   
            for (const point of verificationPoints) {
                const { row, col, expectedValue } = point;
                if (isAgGrid) {
                    expect(await agGrid.getGridCellTextByPosition(row, col, title)).toBe(expectedValue);
                } else {
                    expect(await grid.getCellValue(title, row, col)).toBe(expectedValue);
                }
            }
        }
    }
    
    /**
     * Helper function to remove attribute from grid
     * @param {string} attributeName Name of the attribute to remove
     * @returns {Promise<void>}
     */
    async function removeAttributeFromGrid(attributeName) {
        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: attributeName,
            firstOption: 'Remove',
            agGrid: true
        })
        await browser.pause(STANDARD_WAIT);
    }

    /**
     * Helper function to toggle totals in a visualization
     * @returns {Promise<void>}
     */
    async function toggleTotals(attributeName) {
        await agGrid.toggleShowTotalsFromAttribute(attributeName, 'Visualization 1', 'Total');
        await browser.pause(STANDARD_WAIT);
    }
    
    /**
     * TC71082: AG Grid Sort - Basic sorting functionality
     * This test validates the following operations:
     * - Sorting attributes (ascending/descending)
     * - Sorting metrics with different modes (Sort Within, Sort All Values (Default))
     * - Right-click context menu sorting options
     */
    it('[TC71082] AG Grid Sort - Standard sorting operations', async () => {
        await libraryPage.editDossierByUrl({
            projectId: agGridSortDossier.project.id,
            dossierId: agGridSortDossier.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        
        // Validate initial grid state
        expect(await agGrid.getGridCellTextByPosition(3, 1, 'Visualization 1')).toBe('AirTran Airways Corporation');
        expect(await agGrid.getGridCellTextByPosition(3, 3, 'Visualization 1')).toBe('5,677.85');
 
        // 1. Sort the "Day of Week" attribute in descending order
        await performSort({
            title: 'Visualization 1',
            headerName: 'Day of Week',
            firstOption: 'Sort Descending'
        });

        await verify([
            { row: 3, col: 4, expectedValue: '87' },
            { row: 4, col: 1, expectedValue: 'American Airlines Inc.' },
            { row: 4, col: 3, expectedValue: '5,073.33' }
        ], 'Visualization 1');

        // 2. Sort metric "Flights Cancelled" in ascending order
        await performSort({
            title: 'Visualization 1',
            headerName: 'Flights Cancelled',
            objectType: 'metric',
            firstOption: 'Quick Sort Ascending'
        });

        await verify([
            { row: 4, col: 4, expectedValue: '32' },
            { row: 3, col: 6, expectedValue: '217' }
        ], 'Visualization 1');
        
        // 3. Clear sort on Flights Cancelled metric
        await performSort({
            title: 'Visualization 1',
            headerName: 'Flights Cancelled',
            objectType: 'metric',
            firstOption: 'Quick Sort Clear Sort'
        });

        await verify([
            { row: 10, col: 1, expectedValue: 'American Airlines Inc.' },
            { row: 1, col: 5, expectedValue: '2009' },
            { row: 2, col: 5, expectedValue: 'On-Time' }
        ], 'Visualization 1');

        // 4. Sort the "Year" attribute in descending order
        await performSort({
            title: 'Visualization 1',
            headerName: 'Year',
            firstOption: 'Sort Descending',
            selectFromPanel: true
        });

        await verify([
            { row: 1, col: 7, expectedValue: '2009' },
            { row: 3, col: 7, expectedValue: '423' }
        ], 'Visualization 1');
        
        // 5. Sort metric "Flights Delayed" using "Sort Within"
        await performSort({
            title: 'Visualization 1',
            headerName: 'Flights Delayed',
            objectType: 'metric',
            firstOption: 'Sort Within'
        });

        await verify([
            { row: 3, col: 10, expectedValue: '765' },
            { row: 3, col: 2, expectedValue: 'Monday' },
            { row: 4, col: 10, expectedValue: '733' }
        ], 'Visualization 1');
        
        // 6. Right click on "On-Time" element and select "Sort Within"
        await performSort({
            title: 'Visualization 1',
            headerName: 'On-Time',
            firstOption: 'Sort Within',
            selectFromPanel: false
        });

        await verify([
            { row: 3, col: 10, expectedValue: '511' },
            { row: 4, col: 2, expectedValue: 'Wednesday' },
            { row: 3, col: 5, expectedValue: '115' },
            { row: 4, col: 5, expectedValue: '138' }
        ], 'Visualization 1');
        
        // 7. Sort metric "Flights Delayed" using "Sort All Values (Default)"
        await performSort({
            title: 'Visualization 1',
            headerName: 'Flights Delayed',
            objectType: 'metric',
            firstOption: 'Sort All Values (Default)'
        });

        await verify([
            { row: 3, col: 10, expectedValue: '2112' },
            { row: 3, col: 1, expectedValue: 'Southwest Airlines Co.' },
            { row: 4, col: 10, expectedValue: '2016' }
        ], 'Visualization 1');
        
        // 8. Right click on "On-Time" element and select "Sort All Values (Default)"
        await performSort({
            title: 'Visualization 1',
            headerName: 'On-Time',
            selectFromPanel: false,
            firstOption: 'Sort All Values (Default)'
        });

        await verify([
            { row: 4, col: 10, expectedValue: '2112' },
            { row: 3, col: 5, expectedValue: '249' },
            { row: 4, col: 5, expectedValue: '413' }
        ], 'Visualization 1');
        
        // 9. Add attribute "Month" to the visualization
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'Airline sample dataset');
        
        // Wait for the grid to update after adding Month attribute
        await browser.pause(EXTENDED_WAIT);
        
        await verify([
            { row: 3, col: 2, expectedValue: 'Southwest Airlines Co.' },
            { row: 4, col: 4, expectedValue: '1,642.80' }
        ], 'Visualization 1');
        
        // 10. Sort "Flights Delayed" using "Sort Within an Attribute" > "Airline Name"
        await performSort({
            title: 'Visualization 1',
            headerName: 'Flights Delayed',
            objectType: 'metric',
            firstOption: 'Sort Within an Attribute',
            secondOption: 'Airline Name',
        });

        await verify([
            { row: 3, col: 11, expectedValue: '334' },
            { row: 5, col: 3, expectedValue: 'Friday' },
            { row: 4, col: 11, expectedValue: '310' }
        ], 'Visualization 1');
        
        // 11. Right click on "On-Time" and select "Sort Within an Attribute" > "Airline Name"
        await performSort({
            title: 'Visualization 1',
            headerName: 'On-Time',
            selectFromPanel: false,
            firstOption: 'Sort Within an Attribute',
            secondOption: 'Airline Name'
        });

        await verify([
            { row: 3, col: 4, expectedValue: '2,371.72' },
            { row: 3, col: 6, expectedValue: '215' },
            { row: 4, col: 6, expectedValue: '189' }
        ], 'Visualization 1');

        await removeAttributeFromGrid('Month');
        await browser.pause(STANDARD_WAIT);
        
        // Sort Flights Delayed using Sort Within
        await performSort({
            title: 'Visualization 1',
            headerName: 'Flights Delayed',
            objectType: 'metric',
            firstOption: 'Sort Within'
        });
        
        // Clear sort on Flights Delayed
        await performSort({
            title: 'Visualization 1',
            headerName: 'Flights Delayed',
            objectType: 'metric',
            firstOption: 'Quick Sort Clear Sort',
        });

        await verify([
            { row: 3, col: 2, expectedValue: 'Sunday' },
            { row: 3, col: 4, expectedValue: '81' }
        ], 'Visualization 1');
        
        // Test subtotals metric sort
        // Toggle totals from editor panel
        await toggleTotals('Airline Name');
        await browser.pause(STANDARD_WAIT);
        
        // Sort Flights Delayed with Subtotals
        await performSort({
            title: 'Visualization 1',
            headerName: 'Flights Delayed',
            objectType: 'metric',
            firstOption: 'Sort with Subtotals',
        });

        await verify([
            { row: 3, col: 1, expectedValue: 'Total' },
            { row: 3, col: 10, expectedValue: '43800' },
            { row: 4, col: 10, expectedValue: '2112' }
        ], 'Visualization 1');
        
        // Right click on On-Time and Sort with Subtotals
        await performSort({
            title: 'Visualization 1',
            headerName: 'On-Time',
            selectFromPanel: false, 
            firstOption: 'Sort with Subtotals'
        });

         await verify([
            { row: 4, col: 1, expectedValue: 'AirTran Airways Corporation' },
            { row: 3, col: 3, expectedValue: '324,694.77' }
        ], 'Visualization 1');

        await vizPanel.dragDSObjectToDZwithPosition(            
            'Origin Airport',
            'attribute',
            'Airline sample dataset',
            'Column Set 2',
            'replace',
            'Year');

        await verify([
            { row: 1, col: 5, expectedValue: 'BWI' },
            { row: 1, col: 6, expectedValue: 'DCA' },
            { row: 1, col: 7, expectedValue: 'IAD' },
        ], 'Visualization 1');

        await vizPanel.dragDSObjectToDZwithPosition(            
            'Number of Flights',
            'metric',
            'Airline sample dataset',
            'Column Set 2',
            'replace',
            'On-Time');

        await verify([
            { row: 4, col: 5, expectedValue: '1267' },
            { row: 5, col: 5, expectedValue: '1243' },
            { row: 6, col: 5, expectedValue: '1344' },
        ], 'Visualization 1');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 3' });
        await browser.pause(STANDARD_WAIT);

        await performSort({
            title: 'Visualization 1',
            headerName: 'Avg Delay (min)',
            objectType: 'metric',
            firstOption: 'Sort Within (Default)',
        });

        await verify([
            { row: 5, col: 4, expectedValue: '2324' },
            { row: 3, col: 2, expectedValue: '21,896.58' }
        ], 'Visualization 1', false);

        await grid.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');
        await browser.pause(STANDARD_WAIT); 

        await verify([
            { row: 5, col: 4, expectedValue: '133' },
            { row: 3, col: 2, expectedValue: 'Thursday' }
        ], 'Visualization 1');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });

        await verify([
            { row: 3, col: 2, expectedValue: 'Sunday' },
            { row: 4, col: 2, expectedValue: '22,848.47' }
        ], 'Visualization 1', false);

        await grid.changeVizType('Visualization 1', 'Grid', 'Grid (Modern)');

        await verify([
            { row: 3, col: 2, expectedValue: 'Sunday' },
            { row: 4, col: 2, expectedValue: 'Monday' }
        ], 'Visualization 1');

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 3' });
        await browser.pause(STANDARD_WAIT);

        let button = await toolBar.getToolbarBtnByName("Pause Data Retrieval");
        await toolBar.click({ elem: button });
        await browser.pause(STANDARD_WAIT);

        await performSort({
            title: 'Visualization 1',
            headerName: 'Flights Cancelled',
            objectType: 'metric',
            firstOption: 'Sort Within',
        });
        await browser.pause(STANDARD_WAIT);
        button = await toolBar.getToolbarBtnByName("Resume Data Retrieval");
        await toolBar.click({ elem: button });
        await browser.pause(STANDARD_WAIT);

        await verify([
            { row: 3, col: 4, expectedValue: '147' },
            { row: 7, col: 2, expectedValue: 'Thursday' },
            { row: 2, col: 5, expectedValue: '1996' }
        ], 'Visualization 1');

    });
});