import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import EditorPanelForGrid from '../../../pageObjects/authoring/EditorPanelForGrid.js';
import NewFormatPanelForGrid from '../../../pageObjects/authoring/format-panel/NewFormatPanelForGrid.js';
import BaseContainer from '../../../pageObjects/authoring/BaseContainer.js';

describe('Modern (AG) grid duplicate/move/copy to', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        contentsPanel,
        agGridVisualization,
        dossierAuthoringPage,
        baseContainer,
        datasetPanel,
        grid,
        formatPanel,
        vizPanelForGrid,
        dossierMojo,
        editorPanel,
        editorPanelForGrid,
        newFormatPanelForGrid,
        loadingDialog,
        reportGridView,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {});

    // <-------------------------------------Duplicate--------------------------------------------->
    // 1. duplicate Ag grid from layers panel * undo/redo
    it('[TC79710_1] cover remaining cases for duplicate/copy/move for Ag Grid', async () => {
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridNumberFormatting.project.id,
            dossierId: gridConstants.AGGridNumberFormatting.id,
        });

        // Go to page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });

        await since('Page "Page 1" in chapter "Chapter 1" is the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 1' })).isDisplayed())
            .toBe(true);

        await since('Is Grid the Visualization 1 existed')
            .expect(await agGridVisualization.getContainer('Visualization 1').isDisplayed())
            .toBe(true);

        // // When I duplicate container "Visualization 1" from layers panel
        await agGridVisualization.openContextMenu('Visualization 1');
        await agGridVisualization.selectContextMenuOption('Duplicate');

        await since('Container "Visualization 1 copy" should be on the "right" side of container "Visualization 1"')
            .expect(
                await agGridVisualization.containerRelativePosition('Visualization 1', 'Visualization 1 copy', 'right')
            )
            .toBeGreaterThan(0);

        await since('The grid cell in ag-grid "Visualization 1 copy" at "2", "2" should have text "2009"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 2, 'Visualization 1 copy').getText())
            .toBe('2009');

        await since('The grid cell in ag-grid "Visualization 1 copy" at "2", "3" should have text "22381"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization 1 copy').getText())
            .toBe('22381');

        await since('The grid cell in ag-grid "Visualization 1 copy" at "2", "4" should have text "68,257.42"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Visualization 1 copy').getText())
            .toBe('68,257.42');

        // When I select "Undo" from toolbar
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Then The container "Visualization 1 copy" should be deleted
        await since('The container "Visualization 1 copy" should be deleted')
            .expect(await agGridVisualization.getContainer('Visualization 1 copy').isDisplayed())
            .toBe(false);

        // And The container "Visualization 1" should be selected
        await since('The container "Visualization 1" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1'))
            .toBe(true);

        // When I select "Redo" from toolbar
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Then The container "Visualization 1 copy" should be selected
        await since('The container "Visualization 1 copy" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1 copy'))
            .toBe(true);

        // When I add "attribute" named "Month" from dataset "airline-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Month', 'attribute', 'airline-sample-data.xls');

        await since('The editor panel should have "attribute" named "Month" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectInDropZone('Month', 'Rows').isDisplayed())
            .toBe(true);

        await datasetPanel.addObjectToVizByDoubleClick('Flights Cancelled', 'metric', 'airline-sample-data.xls');

        await since('The editor panel should have "metric" named "Flights Cancelled" on "Columns" section')
            .expect(await editorPanelForGrid.getObjectInDropZone('Flights Cancelled', 'Columns').isDisplayed())
            .toBe(true);

        // And the grid cell in ag-grid "Visualization 1 copy" at "2", "1" has text "January"
        await since('the grid cell in ag-grid "Visualization 1 copy" at "2", "2" has text "January"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 2, 'Visualization 1 copy').getText())
            .toBe('January');

        // And the grid cell in ag-grid "Visualization 1 copy" at "2", "4" has text "5,194.67"
        await since('the grid cell in ag-grid "Visualization 1 copy" at "2", "5" has text "5,194.67"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 5, 'Visualization 1 copy').getText())
            .toBe('5,194.67');

        await dossierAuthoringPage.goToLibrary();
    });

    //Cover remaining cases for Copy to other page and chapter
    it('[TC79710_2] cover remaining cases for duplicate/copy/move for Ag Grid', async () => {
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridNumberFormatting.project.id,
            dossierId: gridConstants.AGGridNumberFormatting.id,
        });

        // // When I copy container "Visualization 1" to "Page 2" through the context menu
        await agGridVisualization.copytoContainer('Visualization 1', 'Page 2');

        // Then Page "Page 2" in chapter "Chapter 1" is the current page
        await since('Page "Page 2" in chapter "Chapter 1" is the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 2' })).isDisplayed())
            .toBe(true);

        // And The container "Visualization 1 copy" should be selected
        await since('The container "Visualization 1 copy" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1 copy'))
            .toBe(true);

        await since('Container "Visualization 1 copy" should be on the "right" side of container "Visualization 3"')
            .expect(
                await agGridVisualization.containerRelativePosition('Visualization 3', 'Visualization 1 copy', 'right')
            )
            .toBeGreaterThan(0);

        await since('The grid cell in ag-grid "Visualization 1 copy" at "2", "2" should have text "2009"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 2, 'Visualization 1 copy').getText())
            .toBe('2009');

        await since('The grid cell in ag-grid "Visualization 1 copy" at "2", "3" should have text "22381"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization 1 copy').getText())
            .toBe('22381');

        await since('The grid cell in ag-grid "Visualization 1 copy" at "2", "4" should have text "68,257.42"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Visualization 1 copy').getText())
            .toBe('68,257.42');

        // Undo action and verify the state
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await since('The container "Visualization 1" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1'))
            .toBe(true);
        await since('Page "Page 1" in chapter "Chapter 1" is the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 1' })).isDisplayed())
            .toBe(true);

        // Redo action and verify the state
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since('The container "Visualization 1 copy" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1 copy'))
            .toBe(true);
        await since('Page "Page 2" in chapter "Chapter 1" is the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 2' })).isDisplayed())
            .toBe(true);
        await since('Container "Visualization 1 copy" should be on the "right" side of container "Visualization 3"')
            .expect(
                await agGridVisualization.containerRelativePosition('Visualization 3', 'Visualization 1 copy', 'right')
            )
            .toBeGreaterThan(0);

        // Copy container to another page and verify
        await agGridVisualization.copytoContainer('Visualization 1 copy', 'Page 3');

        await since('Page "Page 3" in chapter "Chapter 1" is the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 3' })).isDisplayed())
            .toBe(true);
        await since('The container "Visualization 1 copy copy" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1 copy copy'))
            .toBe(true);
        // await since('The z-index of container "Visualization 1 copy copy" is "6"')
        //     .expect(await agGridVisualization.getContainerZIndex('Visualization 1 copy copy'))
        //     .toBe('6');

        // Verify grid cell values
        await since('The grid cell in ag-grid "Visualization 1 copy copy" at "2", "1" should have text "2009"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 2, 'Visualization 1 copy copy').getText())
            .toBe('2009');
        await since('The grid cell in ag-grid "Visualization 1 copy copy" at "2", "2" should have text "22381"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization 1 copy copy').getText())
            .toBe('22381');
        await since('The grid cell in ag-grid "Visualization 1 copy copy" at "2", "3" should have text "68,257.42"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Visualization 1 copy copy').getText())
            .toBe('68,257.42');

        // Enable banding and verify style
        await editorPanel.switchToEditorPanel();
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTab('microcharts');
        await newFormatPanelForGrid.expandLayoutSection();
        await newFormatPanelForGrid.clickCheckBox('Enable banding');
        await since(
            'The grid cell in ag-grid "Visualization 1 copy copy" at "3", "2" should have style "background-color" with value "rgba(248,248,248,1)"'
        )
            .expect(await agGridVisualization.getGridCellStyle(3, 2, 'Visualization 1 copy copy', 'background-color'))
            .toBe('rgba(248,248,248,1)');

        // Copy container to another chapter and verify
        await agGridVisualization.copytoContainer('Visualization 1 copy copy', 'Chapter 2');
        await dossierMojo.clickBtnOnMojoEditor('Yes');
        await since('Page "Page 1" in chapter "Chapter 2" should be the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 2', pageName: 'Page 1' })).isDisplayed())
            .toBe(true);
        await since('The container "Visualization 1 copy copy copy" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1 copy copy copy'))
            .toBe(true);
        await since(
            'Container "Visualization 1 copy copy copy" should be on the "bottom" side of container "Visualization 1"'
        )
            .expect(
                await agGridVisualization.containerRelativePosition(
                    'Visualization 1',
                    'Visualization 1 copy copy copy',
                    'bottom'
                )
            )
            .toBeGreaterThanOrEqual(0);

        // Verify grid cell values in the copied container
        await since('The grid cell in ag-grid "Visualization 1 copy copy copy" at "2", "2" has text "2009"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 2, 'Visualization 1 copy copy copy').getText())
            .toBe('2009');
        await since('The grid cell in ag-grid "Visualization 1 copy copy copy" at "2", "3" has text "22381"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization 1 copy copy copy').getText())
            .toBe('22381');
        await since('The grid cell in ag-grid "Visualization 1 copy copy copy" at "2", "4" has text "68,257.42"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Visualization 1 copy copy copy').getText())
            .toBe('68,257.42');
        await since(
            'The grid cell in ag-grid "Visualization 1 copy copy copy" at "3", "3" has style "background-color" with value "rgba(248,248,248,1)"'
        )
            .expect(
                await agGridVisualization.getGridCellStyle(3, 3, 'Visualization 1 copy copy copy', 'background-color')
            )
            .toBe('rgba(248,248,248,1)');

        // Switch to editor panel and toggle totals
        await editorPanel.switchToEditorPanel();

        await agGridVisualization.toggleShowTotalsByContextMenu();

        await since('The grid cell in ag-grid "Visualization 1 copy copy copy" at "2", "1" has text "Total"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 1, 'Visualization 1 copy copy copy').getText())
            .toBe('Total');
        await since('The grid cell in ag-grid "Visualization 1 copy copy copy" at "2", "3" has text "473435"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Visualization 1 copy copy copy').getText())
            .toBe('473435');

        await dossierAuthoringPage.goToLibrary();
    });

    //move Ag grid to another page and chapter
    it('[TC79710_3] cover remaining cases for duplicate/copy/move for Ag Grid', async () => {
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridNumberFormatting.project.id,
            dossierId: gridConstants.AGGridNumberFormatting.id,
        });

        // Rename visualization and move it
        await vizPanelForGrid.renameVisualizationByContextMenu('Visualization 1', 'Viz');
        await since('The container "Viz" should be selected')
            .expect(await grid.isContainerSelected('Viz'))
            .toBe(true);

        await baseContainer.movetoContainer('Viz', 'Page 2');

        await since('Page "Page 2" in chapter "Chapter 1" should be the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 2' })).isDisplayed())
            .toBe(true);

        await since('The container "Viz" should be selected')
            .expect(await agGridVisualization.getContainer('Viz').isDisplayed())
            .toBe(true);

        await since('Container "Viz" should be on the "right" side of container "Visualization 3"')
            .expect(await agGridVisualization.containerRelativePosition('Visualization 3', 'Viz', 'right'))
            .toBeGreaterThan(0);

        // When I select "Undo" from toolbar
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since('The container "Viz" should be selected')
            .expect(await grid.isContainerSelected('Viz'))
            .toBe(true);

        await since('Page "Page 1" in chapter "Chapter 1" should be the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 1' })).isDisplayed())
            .toBe(true);

        // When I select "Redo" from toolbar
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await since('The container "Viz" should be selected')
            .expect(await grid.isContainerSelected('Viz'))
            .toBe(true);

        await since('Page "Page 2" in chapter "Chapter 1" should be the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 2' })).isDisplayed())
            .toBe(true);

        await since('Container "Viz" should be on the "right" side of container "Visualization 3"')
            .expect(await agGridVisualization.containerRelativePosition('Visualization 3', 'Viz', 'right'))
            .toBeGreaterThan(0);

        //move Ag grid to a new page in the same chapter * pause mode
        await dossierAuthoringPage.actionOnToolbar('Pause Data Retrieval');
        await browser.pause(2000);

        await since('should see the "Freezing" image for "Viz" ')
            .expect(await baseContainer.getContainerImgOverlay('freezing', 'Viz').isDisplayed())
            .toBe(true);

        await baseContainer.movetoContainer('Viz', 'New Page');

        await since('Page "Page 4" in chapter "Chapter 1" should be the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 4' })).isDisplayed())
            .toBe(true);

        await dossierAuthoringPage.actionOnToolbar('Resume Data Retrieval');
        await browser.pause(2000);

        await since('The grid cell in ag-grid "Viz" at "2", "2" should have text "2009"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 2, 'Viz').getText())
            .toBe('2009');

        await since('The grid cell in ag-grid "Viz" at "2", "3" should have text "22381"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Viz').getText())
            .toBe('22381');

        await since('The grid cell in ag-grid "Viz" at "2", "4" should have text "68,257.42"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Viz').getText())
            .toBe('68,257.42');

        // When I move container "Viz" to "Page 3" through the context menu
        await baseContainer.movetoContainer('Viz', 'Page 3');

        await since('Page "Page 3" in chapter "Chapter 1" should be the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 3' })).isDisplayed())
            .toBe(true);

        // And The container "Viz copy" should be selected
        await since('The container "Viz" should be selected')
            .expect(await grid.isContainerSelected('Viz'))
            .toBe(true);

        // And The z-index of container "Viz copy" is "6"
        // await since('The z-index of container "Viz copy" is "6"')
        //     .expect(await agGridVisualization.getContainerZIndex('Viz copy'))
        //     .toBe('6');

        await since('The grid cell in ag-grid "Viz" at "2", "2" should have text "2009"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 2, 'Viz').getText())
            .toBe('2009');

        await since('The grid cell in ag-grid "Viz" at "2", "3" should have text "22381"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Viz').getText())
            .toBe('22381');

        await since('The grid cell in ag-grid "Viz" at "2", "4" should have text "68,257.42"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Viz').getText())
            .toBe('68,257.42');


        await editorPanel.switchToEditorPanel();
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTab('microcharts');
        await newFormatPanelForGrid.expandLayoutSection();
        await newFormatPanelForGrid.clickCheckBox('Enable banding');

        await browser.pause(2000); // wait for the banding to apply

        await since(
            'The grid cell in ag-grid "Viz" in "Page 3" in "Chapter 1" at "3", "3" should have style "background-color" with value "rgba(248,248,248,1)"'
        )
            .expect(await agGridVisualization.getGridCellStyle(3, 3, 'Viz', 'background-color'))
            .toBe('rgba(248,248,248,1)');

        await baseContainer.movetoContainer('Viz', 'Chapter 2');
        await dossierMojo.clickBtnOnMojoEditor('Yes');

        await since('Page "Page 1" in chapter "Chapter 2" should be the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 2', pageName: 'Page 1' })).isDisplayed())
            .toBe(true);

        // And The container "Viz" should be selected
        await since('The container "Viz" should be selected')
            .expect(await agGridVisualization.getContainer('Viz').isDisplayed())
            .toBe(true);

        await since('Container "Viz" should be on the "bottom" side of container "Visualization 1"')
            .expect(await agGridVisualization.containerRelativePosition('Visualization 1', 'Viz', 'bottom'))
            .toBeGreaterThanOrEqual(0);

        await since('The grid cell in ag-grid "Viz" at "2", "2" should have text "2009"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 2, 'Viz').getText())
            .toBe('2009');

        await since('The grid cell in ag-grid "Viz" at "2", "3" should have text "22381"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Viz').getText())
            .toBe('22381');

        await since('The grid cell in ag-grid "Viz" at "2", "4" should have text "68,257.42"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Viz').getText())
            .toBe('68,257.42');

        await since(
            'The grid cell in ag-grid "Viz" in "Page 1" in "Chapter 2" at "3", "3" should have style "background-color" with value "rgba(248,248,248,1)"'
        )
            .expect(await agGridVisualization.getGridCellStyle(3, 3, 'Viz', 'background-color'))
            .toBe('rgba(248,248,248,1)');

        await baseContainer.movetoContainer('Viz', 'New Chapter');
        await dossierMojo.clickBtnOnMojoEditor('Yes');
        // wait for the page to load
        await since('Page "Page 1" in chapter "Chapter 3" should be the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 3', pageName: 'Page 1' })).isDisplayed())
            .toBe(true);

        await since('The container "Viz" should be selected')
            .expect(await agGridVisualization.getContainer('Viz').isDisplayed())
            .toBe(true);

        await since('The grid cell in ag-grid "Viz" at "2", "2" should have text "2009"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 2, 'Viz').getText())
            .toBe('2009');

        await since('The grid cell in ag-grid "Viz" at "2", "3" should have text "22381"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 3, 'Viz').getText())
            .toBe('22381');

        await since('The grid cell in ag-grid "Viz" at "2", "4" should have text "68,257.42"')
            .expect(await agGridVisualization.getGridCellByPosition(2, 4, 'Viz').getText())
            .toBe('68,257.42');

        await browser.pause(1000); // wait for the page to load
        await since(
            'The grid cell in ag-grid "Viz" in "Page 1" in "Chapter 3" at "3", "3" should have style "background-color" with value "rgba(248,248,248,1)"'
        )
            .expect(await agGridVisualization.getGridCellStyle(3, 3, 'Viz', 'background-color'))
            .toBe('rgba(248,248,248,1)');
    });

    it('[TC79709_1] Duplicate/Move AG grid visualizations within chapter', async () => {
        // #Dossier location: New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > DuplicateMove > TC79709_CopyDuplicateMove AG Grid
        // When I open dossier by its ID "FEB2B21C584E87CCF9FFD194B6F90875"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDuplicateMove.project.id,
            dossierId: gridConstants.AGGridDuplicateMove.id,
        });
        // Then The Dossier Editor is displayed
        // When I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has text "AirTran Airways Corporation"
        await since(
            'the grid cell in ag-grid "Visualization 1" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toBe('AirTran Airways Corporation');
        // When I duplicate container "Visualization 1" through the context menu
        await agGridVisualization.duplicateContainer('Visualization 1');
        // #verify that no error occurs
        // Then The container "Visualization 1 copy" should be selected
        await since('The container "Visualization 1 copy" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1 copy'))
            .toBe(true);
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "AirTran Airways Corporation"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('AirTran Airways Corporation');
        // When I switch to Editor Panel tab
        // When I sort the "attribute" named "Airline Name" in "Sort Descending" in Editor Panel
        await editorPanelForGrid.simpleSort('Airline Name', 'Sort Descending');
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "Southwest Airlines Co."
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}"'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('Southwest Airlines Co.');
        // #enable subtotals
        // When I toggle the Show Totals for the visualization "Visualization 1 copy" through the visualization context menu
        await agGridVisualization.toggleShowTotalsByContextMenu('Visualization 1 copy');
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "Total"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('Total');

        // #duplicate another grid
        // When I switch to page "Page 2" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        // When I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has text "AirTran Airways Corporation"
        await since(
            'the grid cell in ag-grid "Visualization 1" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toBe('AirTran Airways Corporation');
        // When I duplicate container "Visualization 1" through the context menu
        await agGridVisualization.duplicateContainer('Visualization 1');
        // #verify that no error occurs
        // Then The container "Visualization 1 copy" should be selected
        await since('The container "Visualization 1 copy" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1 copy'))
            .toBe(true);
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "AirTran Airways Corporation"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('AirTran Airways Corporation');
        // When I switch to Editor Panel tab
        // When I sort the "attribute" named "Airline Name" in "Sort Descending" in Editor Panel
        await editorPanelForGrid.simpleSort('Airline Name', 'Sort Descending');
        // #verify that no error occurs
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "Southwest Airlines Co."
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('Southwest Airlines Co.');

        // #move visualization to existing page
        // When I move container "Visualization 1 copy" to "New Page" through the context menu
        await agGridVisualization.movetoContainer('Visualization 1 copy', 'New Page');
        // Then Page "Page 3" in chapter "Chapter 1" is the current page
        await since('Page "Page 3" in chapter "Chapter 1" is the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 3' })).isDisplayed())
            .toBe(true);
        // Then The container "Visualization 1 copy" should be selected
        await since('The container "Visualization 1 copy" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1 copy'))
            .toBe(true);
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "3" has text "324"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "3" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 3, 'Visualization 1 copy'))
            .toBe('324');
        // When I delete the Column Set named "CS1" from ag-grid
        await vizPanelForGrid.deleteColumnSet('CS1');
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "8" has text "10305"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "8" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 8, 'Visualization 1 copy'))
            .toBe('10305');
        // #move visualization to existing page
        // When I switch to page "Page 1" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        // Then Page "Page 1" in chapter "Chapter 1" is the current page
        // When I click on container "Visualization 1 copy" to select it
        await baseContainer.clickContainerByScript('Visualization 1 copy');
        // And I move container "Visualization 1 copy" to "Page 2" through the context menu
        await agGridVisualization.movetoContainer('Visualization 1 copy', 'Page 2');
        // Then Page "Page 2" in chapter "Chapter 1" is the current page
        await since('Page "Page 2" in chapter "Chapter 1" is the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 2' })).isDisplayed())
            .toBe(true);
        // Then The container "Visualization 1 copy" should be selected
        await since('The container "Visualization 1 copy" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1 copy'))
            .toBe(true);
        // Then the grid cell in ag-grid "Visualization 1 copy" at "6", "3" has text "January"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "6", "3" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(6, 3, 'Visualization 1 copy'))
            .toBe('January');
        // When I remove "attribute" named "Month" from the Grid Editor Panel
        await editorPanelForGrid.removeFromDropZone('Month', 'Rows');
        // Then the grid cell in ag-grid "Visualization 1 copy" at "6", "3" has text "14"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "6", "3" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(6, 3, 'Visualization 1 copy'))
            .toBe('14');
    });

    it('[TC79709_2] Duplicate/Move AG grid visualizations to other chapters', async () => {
        // #Dossier location: New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > DuplicateMove > TC79709_CopyDuplicateMove AG Grid 
        // When I open dossier by its ID "FEB2B21C584E87CCF9FFD194B6F90875"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDuplicateMove.project.id,
            dossierId: gridConstants.AGGridDuplicateMove.id,
        });
        // Then The Dossier Editor is displayed
        // When I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has text "AirTran Airways Corporation"
        await since(
            'the grid cell in ag-grid "Visualization 1" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toBe('AirTran Airways Corporation');
        // When I duplicate container "Visualization 1" through the context menu
        await agGridVisualization.duplicateContainer('Visualization 1');
        // #verify that no error occurs
        // Then The container "Visualization 1 copy" should be selected
        await since('The container "Visualization 1 copy" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1 copy'))
            .toBe(true);
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "AirTran Airways Corporation"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('AirTran Airways Corporation');
        // #move to existing chapter
        // When I move container "Visualization 1 copy" to "Chapter 2" through the context menu
        await agGridVisualization.movetoContainer('Visualization 1 copy', 'Chapter 2');
        // And I click on the "Yes" button on the popup editor
        await dossierMojo.clickBtnOnMojoEditor('Yes');
        // Then Page "Page 1" in chapter "Chapter 2" is the current page
        await since('Page "Page 1" in chapter "Chapter 2" is the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 2', pageName: 'Page 1' })).isDisplayed())
            .toBe(true);
        // Then The container "Visualization 1 copy" should be selected
        await since('The container "Visualization 1 copy" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1 copy'))
            .toBe(true);
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "AirTran Airways Corporation"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('AirTran Airways Corporation');
        // When I switch to Editor Panel tab
        // When I sort the "attribute" named "Airline Name" in "Sort Descending" in Editor Panel
        await editorPanelForGrid.simpleSort('Airline Name', 'Sort Descending');
        // #verify that no error occurs
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "US Airways Inc."
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('US Airways Inc.');
        // When I toggle the Show Totals for the visualization "Visualization 1 copy" through the visualization context menu
        await agGridVisualization.toggleShowTotalsByContextMenu('Visualization 1 copy');
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "Total"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('Total');

        // #move to new chapter
        // When I switch to page "Page 2" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        // When I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has text "AirTran Airways Corporation"
        await since(
            'the grid cell in ag-grid "Visualization 1" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toBe('AirTran Airways Corporation');
        // When I move container "Visualization 1" to "New Chapter" through the context menu
        await agGridVisualization.movetoContainer('Visualization 1', 'New Chapter');
        // And I click on the "Yes" button on the popup editor
        await dossierMojo.clickBtnOnMojoEditor('Yes');
        // Then Page "Page 1" in chapter "Chapter 3" is the current page
        await since('Page "Page 1" in chapter "Chapter 3" is the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 3', pageName: 'Page 1' })).isDisplayed())
            .toBe(true);
        // Then The container "Visualization 1" should be selected
        await since('The container "Visualization 1" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1'))
            .toBe(true);
        // Then the grid cell in ag-grid "Visualization 1" at "13", "3" has text "153"
        await since(
            'the grid cell in ag-grid "Visualization 1" at "13", "3" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(13, 3, 'Visualization 1'))
            .toBe('153');
        // When I toggle the Show Totals for the visualization "Visualization 1" through the visualization context menu
        await agGridVisualization.toggleShowTotalsByContextMenu('Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has text "Total"
        await since(
            'the grid cell in ag-grid "Visualization 1" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toBe('Total');
        // When I drag Column Set named "CS1" below Column Set "MC3" in ag-grid
        await vizPanelForGrid.reorderColumnSet('CS1', 'below', 'MC3');
        // Then the grid cell in ag-grid "Visualization 1" at "4", "13" has text "133"
        await since(
            'the grid cell in ag-grid "Visualization 1" at "4", "13" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(4, 13, 'Visualization 1'))
            .toBe('133');
    });

    it('[TC79709_3] Copy AG grid visualizations in existing chapter', async () => {
        // #Dossier location: New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > DuplicateMove > TC79709_CopyDuplicateMove AG Grid 
        // When I open dossier by its ID "FEB2B21C584E87CCF9FFD194B6F90875"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDuplicateMove.project.id,
            dossierId: gridConstants.AGGridDuplicateMove.id,
        });
        // #copy visualization to existing page
        // When I switch to page "Page 1" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        // And I copy container "Visualization 1" to "Page 2" through the context menu
        await agGridVisualization.copytoContainer('Visualization 1', 'Page 2');
        // Then Page "Page 2" in chapter "Chapter 1" is the current page
        await since('Page "Page 2" in chapter "Chapter 1" is the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 2' })).isDisplayed())
            .toBe(true);
        // Then The container "Visualization 1 copy" should be selected
        await since('The container "Visualization 1 copy" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1 copy'))
            .toBe(true);
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "AirTran Airways Corporation"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('AirTran Airways Corporation');
        // #verify that no error occurs
        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // When I sort the "attribute" named "Airline Name" in "Sort Descending" in Editor Panel
        await editorPanelForGrid.simpleSort('Airline Name', 'Sort Descending');
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "Southwest Airlines Co."
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('Southwest Airlines Co.');
        // When I toggle the Show Totals for the visualization "Visualization 1 copy" through the visualization context menu
        await agGridVisualization.toggleShowTotalsByContextMenu('Visualization 1 copy');
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "Total"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('Total');
        // #copy visualization to new page
        // When I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has text "AirTran Airways Corporation" 
        await since(
            'the grid cell in ag-grid "Visualization 1" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toBe('AirTran Airways Corporation');
        // When I copy container "Visualization 1" to "New Page" through the context menu
        await agGridVisualization.copytoContainer('Visualization 1', 'New Page');
        // Then I pause execution for 3 seconds
        // #verify that no error occurs
        // Then The container "Visualization 1 copy" should be selected
        await since('The container "Visualization 1 copy" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1 copy'))
            .toBe(true);
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "AirTran Airways Corporation"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('AirTran Airways Corporation');
        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // When I sort the "attribute" named "Airline Name" in "Sort Descending" in Editor Panel
        await editorPanelForGrid.simpleSort('Airline Name', 'Sort Descending');
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "Southwest Airlines Co."
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('Southwest Airlines Co.');
        // When I select "Undo" from toolbar
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "AirTran Airways Corporation" 
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('AirTran Airways Corporation');
        // When I select "Undo" from toolbar
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then Page "Page 2" in chapter "Chapter 1" is the current page
        await since('Page "Page 2" in chapter "Chapter 1" is the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 2' })).isDisplayed())
            .toBe(true);
        // When I select "Redo" from toolbar
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then The container "Visualization 1 copy" should be selected
        await since('The container "Visualization 1 copy" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1 copy'))
            .toBe(true);
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "AirTran Airways Corporation" 
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('AirTran Airways Corporation');
        // When I sort the "attribute" named "Airline Name" in "Sort Descending" in Editor Panel
        await editorPanelForGrid.simpleSort('Airline Name', 'Sort Descending');
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "Southwest Airlines Co."
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('Southwest Airlines Co.');
    });

    it('[TC79709_4] Copy AG grid visualizations to other chapter', async () => {
        // #Dossier location: New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > DuplicateMove > TC79709_CopyDuplicateMove AG Grid 
        // When I open dossier by its ID "FEB2B21C584E87CCF9FFD194B6F90875"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridDuplicateMove.project.id,
            dossierId: gridConstants.AGGridDuplicateMove.id,
        });
        // When I copy container "Visualization 1" to "Chapter 2" through the context menu
        await agGridVisualization.copytoContainer('Visualization 1', 'Chapter 2');
        // And I click on the "Yes" button on the popup editor
        await dossierMojo.clickBtnOnMojoEditor('Yes');
        // Then Page "Page 1" in chapter "Chapter 2" is the current page
        await since('Page "Page 1" in chapter "Chapter 2" is the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 2', pageName: 'Page 1' })).isDisplayed())
            .toBe(true);
        // Then The container "Visualization 1 copy" should be selected
        await since('The container "Visualization 1 copy" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1 copy'))
            .toBe(true);
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "AirTran Airways Corporation" 
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('AirTran Airways Corporation');
        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // When I sort the "attribute" named "Airline Name" in "Sort Descending" in Editor Panel
        await editorPanelForGrid.simpleSort('Airline Name', 'Sort Descending');
        // #verify that no error occurs
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "US Airways Inc."
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('US Airways Inc.');
        // When I toggle the Show Totals for the visualization "Visualization 1 copy" through the visualization context menu
        await agGridVisualization.toggleShowTotalsByContextMenu('Visualization 1 copy');
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "Total"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('Total');
        // #copy visualization to new chapter
        // When I switch to page "Page 2" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        // When I click on container "Visualization 1" to select it 
        await baseContainer.clickContainerByScript('Visualization 1');
        // Then the grid cell in ag-grid "Visualization 1" at "2", "0" has text "AirTran Airways Corporation" 
        await since(
            'the grid cell in ag-grid "Visualization 1" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1'))
            .toBe('AirTran Airways Corporation');
        // When I copy container "Visualization 1" to "New Chapter" through the context menu
        await agGridVisualization.copytoContainer('Visualization 1', 'New Chapter');
        // And I click on the "Yes" button on the popup editor
        await dossierMojo.clickBtnOnMojoEditor('Yes');
        // Then Page "Page 1" in chapter "Chapter 3" is the current page
        await since('Page "Page 1" in chapter "Chapter 3" is the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 3', pageName: 'Page 1' })).isDisplayed())
            .toBe(true);
        // Then The container "Visualization 1 copy" should be selected
        await since('The container "Visualization 1 copy" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1 copy'))
            .toBe(true);
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "AirTran Airways Corporation" 
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('AirTran Airways Corporation');
        // When I select "Undo" from toolbar
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then Page "Page 2" in chapter "Chapter 1" is the current page
        await since('Page "Page 2" in chapter "Chapter 1" is the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 1', pageName: 'Page 2' })).isDisplayed())
            .toBe(true);
        // When I select "Redo" from toolbar
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then Page "Page 1" in chapter "Chapter 3" is the current page
        await since('Page "Page 1" in chapter "Chapter 3" is the current page')
            .expect(await (await contentsPanel.getPage({ chapterName: 'Chapter 3', pageName: 'Page 1' })).isDisplayed())
            .toBe(true);
        // Then The container "Visualization 1 copy" should be selected
        await since('The container "Visualization 1 copy" should be selected')
            .expect(await grid.isContainerSelected('Visualization 1 copy'))
            .toBe(true);
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "AirTran Airways Corporation" 
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('AirTran Airways Corporation');
        // When I toggle the Show Totals for the visualization "Visualization 1 copy" through the visualization context menu
        await agGridVisualization.toggleShowTotalsByContextMenu('Visualization 1 copy');
        // Then the grid cell in ag-grid "Visualization 1 copy" at "2", "0" has text "Total"
        await since(
            'the grid cell in ag-grid "Visualization 1 copy" at "2", "0" should be #{expected},instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPos(2, 0, 'Visualization 1 copy'))
            .toBe('Total');
    });
});
