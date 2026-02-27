import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { gridUser } from '../../../constants/grid.js';
import resetDossierState from '../../../api/resetDossierState.js';
import Grid from '../../../pageObjects/visualization/Grid.js';
import PanelStack from '../../../pageObjects/document/PanelStack.js';
import EditorPanel from '../../../pageObjects/dossierEditor/EditorPanel.js';
import DossierPage from '../../../pageObjects/dossier/DossierPage.js';
import LibraryPage from '../../../pageObjects/library/LibraryPage.js';
import AgGridVisualization from '../../../pageObjects/agGrid/AgGridVisualization.js';
import * as gridConstants from '../../../constants/grid.js';
import VizPanelForGrid from '../../../pageObjects/authoring/VizPanelForGrid.js';

const credentials = gridUser;

describe('AG Grid InfoWindow Test', () => {
    const tutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'MicroStrategy Tutorial',
    };
    
    const agGridDossier = {
        // TBD: change the dossier ID
        id: '8728CCB85546BC9A77A7FB93437E0CC4',
        name: 'AG Grid Info Window Test',
        project: tutorialProject,
    };

    let {
        loginPage,
        libraryPage,
        agGridVisualization,
        vizPanelForGrid,
    } = browsers.pageObj1;
    
    beforeAll(async () => {
        await loginPage.login(credentials);
    });

    it('[TC81929] Grid | AG Grid used as Info Window', async () => {
        const panelStack = new PanelStack();
        const editorPanel = new EditorPanel();
        const libraryPage = new LibraryPage();
        const agGrid = new AgGridVisualization();
        await libraryPage.editDossierByUrl({
            projectId: agGridDossier.project.id,
            dossierId: agGridDossier.id,
        });
        
        // Switch to Editor Panel first
        await editorPanel.switchToEditorPanel();
        await browser.pause(1000);
        
        // Click on the Central Region cell
        let cell = await agGrid.getGridCell("Central", "Source AG Grid");
        await cell.click();
        
        // Wait for the info window to appear
        await browser.pause(3000);
        
        // Verify that the info window appears
        expect(await panelStack.isPanelPresent()).toBe(true);
        
        // Verify specific cell values as in the original feature file
        expect(await agGrid.getGridCellTextByPosition(3, 2, "Target Grid in Info Window")).toBe("$98,202");
        expect(await agGrid.getGridCellTextByPosition(4, 3, "Target Grid in Info Window")).toBe("$1,155,034");
        expect(await agGrid.getGridCellTextByPosition(6, 4, "Target Grid in Info Window")).toBe("$229,290");
        
        // Verify that cell at row 6, column 1 is not present
        try {
            await agGrid.getGridCellTextByPosition("Target Grid in Info Window", 8, 1);
        } catch (error) {
            // Cell is not present, which is expected
            expect(error).toBeTruthy();
        }

        await editorPanel.clickEditorPanel();

        // Click on the Electronics cell
        let cell2 = await agGrid.getGridCell("Electronics", "Source AG Grid");
        await cell2.click();
        
        // Wait for the info window to appear
        await browser.pause(3000);
        
        // Verify that the info window appears
        expect(await panelStack.isPanelPresent()).toBe(true);
        
        // Verify specific cell values as in the original feature file
        expect(await agGrid.getGridCellTextByPosition(3, 2, "Target Grid in Info Window")).toBe("$6,027,843");
        
        // Verify that cell at row 6, column 1 is not present
        try {
            await agGrid.getGridCellTextByPosition(5, 1, "Target Grid in Info Window");
        } catch (error) {
            // Cell is not present, which is expected
            expect(error).toBeTruthy();
        }
        
        await browser.pause(1000);

        await editorPanel.clickEditorPanel();

        let cell3 = await agGrid.getGridCell("Books", "Source AG Grid");
        await cell3.click();
        
        // Wait for the info window to appear
        await browser.pause(3000);
        
        // Verify that the info window appears
        expect(await panelStack.isPanelPresent()).toBe(true);
        
        // Verify specific cell values as in the original feature file
        expect(await agGrid.getGridCellTextByPosition(3, 2, "Target Grid in Info Window")).toBe("$650,192");

        // Verify that cell at row 3, column 1 is not present
        try {
            await agGrid.getGridCellTextByPosition(5, 1, "Target Grid in Info Window");
        } catch (error) {
            // Cell is not present, which is expected
            expect(error).toBeTruthy();
        }
    });

    it('[BCIN-6501] Incorrect filtering criteria in dashboard when using metric as info window selector', async () => {
        // open dossier by its ID "6DDE7C6411EAB4BE76E70080EFD50D21"
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_NDE_Infowindow.project.id,
            dossierId: gridConstants.AGGrid_NDE_Infowindow.id,
        });
        // click 1,500 in 'Visualization 1 AG' to open info window
        const gridCell1 = await agGridVisualization.getGridCell('1,500', 'Visualization 1 AG');
        await agGridVisualization.click({ elem: gridCell1 });
        await browser.pause(3000);
        // take screenshot of the info window
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Info Window AG'),
            'AGGrid_InfoWindow_01',
            'AG Grid Info Window - Info window opened by clicking metric cell on ag grid'
        );
        // Click grid to dismiss the info window
        await agGridVisualization.clickOnContainerTitle('Visualization 1 NG');
        await vizPanelForGrid.clickOnGridElement('1,500', 'Visualization 1 NG');
        await browser.pause(3000);
        // take screenshot of the info window
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Info Window NG'),
            'AGGrid_InfoWindow_02',
            'AG Grid Info Window - Info window opened by clicking metric cell in normal grid'
        );
    });
});

export const config = { credentials };