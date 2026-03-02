import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('AGGrid_DragAndDrop', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        baseVisualization,
        vizPanelForGrid,
        contentsPanel,
        datasetPanel,
        agGridVisualization,
        editorPanelForGrid,
        editorPanel,
        microchartConfigDialog,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        await loginPage.login(gridConstants.gridUser);
    });

    afterEach(async () => {});

    it('[BCIN-6663] Column Value Color Reverts to Black When Moving Columns in Modern Grid ', async () => {
        // Edit dossier by its ID "B76F534F37495CBE36325EAC0E6BADFC"
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > AGGrid_Dnd
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Dnd.project.id,
            dossierId: gridConstants.AGGrid_Dnd.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'XFunc Format' });
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        await agGridVisualization.dragHeaderCellToCol('Flights Delayed', 'left', 'Flights Cancelled');
        // take screenshot after dragging metric
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-6663_01',
            'Format should be kept after moving Flights Delayed column before Flights Cancelled column',
        );
        await agGridVisualization.dragHeaderCellToCol('Airline Name', 'right', 'Origin Airport');
        // take screenshot after dragging attribute
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-6663_02',
            'Format should be kept after moving Airline Name column after Origin Airport column',
        );
    });

});
