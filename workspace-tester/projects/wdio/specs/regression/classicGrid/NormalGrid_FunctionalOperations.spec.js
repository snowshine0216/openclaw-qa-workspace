import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { FilterPanel } from '../../../pageObjects/dossierEditor/FilterPanel.js';
import { assertWithinTolerance } from '../../../utils/assertionHelper.js';

describe('NormalGrid_FunctionalOperations', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        baseFormatPanel,
        baseFormatPanelReact,
        newFormatPanelForGrid,
        editorPanel,
        datasetPanel,
        gridAuthoring,
        reportFormatPanel,
        showDataDialog,
        moreOptions,
        contentsPanel,
        dossierMojo,
        dossierAuthoringPage,
        vizPanelForGrid,
        newGalleryPanel,
        loadingDialog,
        baseContainer,
    } = browsers.pageObj1;

    const filterPanel = new FilterPanel();

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    it('[TC22703_01] Check Scrollbar in normal grid', async () => {
        // When I open dossier by its ID "9819D8AC11EA5A73CF330080EFE58051"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_Functional.project.id,
            dossierId: gridConstants.Grid_Functional.id,
        });
        // # step 3 - move cursor outside
        // When I move cursor outside of grid visualization "Visualization 1" to title bar
        await vizPanelForGrid.resetContextMenuButton('Visualization 1');
        // sleep enough for scrollbars to hide
        await browser.pause(1000);
        // Then "No" scroll bar "without" the scroll track appears in grid visualization "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'No scroll bar in Visualization 1',
            'TC22703_01_01'
        );

        // # step 4  - move cursor back inside
        // When I hover on "Visualization 1" container
        await vizPanelForGrid.hoverOnContainerAndClick('Visualization 1');
        // Then "Light" scroll bar "without" the scroll track appears in grid visualization "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Light scroll bar in Visualization 1',
            'TC22703_01_02'
        );
        // # step 5  - hover over scroll bar
        // When I hover over the "vertical" scroll bar in grid visualization "Visualization 1"
        let scrollbar = await vizPanelForGrid.getGridScrollBar('vertical', 'Visualization 1');
        await vizPanelForGrid.hoverMouseOnElement(scrollbar);
        // Then "Dark" scroll bar "with" the scroll track appears in grid visualization "Visualization 1"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Dark scroll bar in Visualization 1',
            'TC22703_01_03'
        );
    });

    it('[TC22703_02] Make sure columns and formatting stayed the same after new objects added in grid DE18402', async () => {
        // When I open dossier by its ID "9819D8AC11EA5A73CF330080EFE58051"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_Functional.project.id,
            dossierId: gridConstants.Grid_Functional.id,
        });

        // # step 2 - resize column
        let origColumnWidth = parseInt(await (vizPanelForGrid.getGridCellStyleByPosition(1, 2, 'Visualization 1', 'width')));
        // When I resize column 2 in grid visualization "Visualization 1" 52 pixels to the "right"
        await vizPanelForGrid.resizeColumnByMovingBorder(2, 52, 'right', 'Visualization 1');
        // Then Column 2 is 52 pixels "more" in grid visualization "Visualization 1"
        let actualColumnWidth1 = parseFloat((await (await vizPanelForGrid.getGridCellStyleByPosition(1, 2, 'Visualization 1', 'width'))).replace('px', ''));
        let expectedColumnWidth1 = origColumnWidth + 52;
        await since(`Then Column 2 is 52 pixels "more", should be ${expectedColumnWidth1}, actual ${actualColumnWidth1}`)
            .expect(assertWithinTolerance({ actual: actualColumnWidth1, expected: expectedColumnWidth1, tolerance: 1 }))
            .toBe(true);


        // When I resize column 2 in grid visualization "Visualization 1" 200 pixels to the "left"
        await vizPanelForGrid.resizeColumnByMovingBorder(2, 200, 'left', 'Visualization 1');
        // Then Column 2 is 200 pixels "less" in grid visualization "Visualization 1"
        let actualColumnWidth2 = parseFloat((await (await vizPanelForGrid.getGridCellStyleByPosition(1, 2, 'Visualization 1', 'width'))).replace('px', ''));
        let expectedColumnWidth2 = expectedColumnWidth1 - 200;
        await since(`Then Column 2 is 200 pixels "less", should be ${expectedColumnWidth2}, actual ${actualColumnWidth2}`)
            .expect(assertWithinTolerance({ actual: actualColumnWidth2, expected: expectedColumnWidth2, tolerance: 1 }))
            .toBe(true);
    
        // # step 6 - change formatting properties
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to Text format tab in Format Panel
        await newFormatPanelForGrid.switchToTextFormatTab();
        // # one more click to dismiss the tooltips
        // And I switch to the Format Panel tab
        // And I select the grid segment "Column Headers" from the pull down list
        await newFormatPanelForGrid.selectGridSegment('Column Headers');
        // And I change the font to "Monoton" from the font pull down list
        await newFormatPanelForGrid.selectTextFont('Monoton');
        // Then the grid cell in visualization "Visualization 1" at "1", "3" has style "font-family" with value "Monoton"
        await since(
            'Grid cell at "1", "3" in "Visualization 1" should have font-family #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 3, 'Visualization 1'),
                    'font-family'
                )
            )
            .toBe('monoton');
        // When I select the grid segment "Row Headers" from the pull down list
        await newFormatPanelForGrid.selectGridSegment('Row Headers');
        // And I change the font size to "10" by typing in the font size input field
        await newFormatPanelForGrid.setTextFontSize('10');
        // And I select underline for the font style
        await newFormatPanelForGrid.selectFontStyle('underline');
        // Then the grid cell in visualization "Visualization 1" at "2", "2" has style "font-size" with value "13.3333px"
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "2" should have font-size with value #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 2, 'Visualization 1'),
                    'font-size'
                )
            )
            .toBe('13.3333px');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has style "text-decoration" with value "underline"
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "2" should have text-decoration-line #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 2, 'Visualization 1'),
                    'text-decoration-line'
                )
            )
            .toBe('underline');
        // When I select the grid segment "Values" from the pull down list
        await newFormatPanelForGrid.selectGridSegment('Values');
        // And I open the font color picker
        await newFormatPanelForGrid.clickFontColorBtn();

        // And I switch the color picker to swatch mode
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        // And I select the built-in color "#FBDAD9" in the color picker
        await newFormatPanelForGrid.clickBuiltInColor('#FBDAD9');
        // And I close the font color picker
        await baseFormatPanelReact.dismissColorPicker();
        // Then the grid cell in visualization "Visualization 1" at "3", "3" has style "color" with value "rgba(251, 218, 217, 1)"
        await since(
            'Then the grid cell in visualization "Visualization 1" at "3", "3" has style "color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '3', 'Visualization 1').getCSSProperty('color')).value
            )
            .toContain('251,218,217,1');
        // # step 7 - add objects by double click
        // When I switch to Editor Panel tab
        await editorPanel.switchToEditorPanel();
        // And I add "attribute" named "Airline Name" from dataset "airline-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Airline Name', 'attribute', 'airline-sample-data.xls');
        // Then the grid cell in visualization "Visualization 1" at "1", "3" has text "Airline Name"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "3" should have text #{expected} instead we have #{actual}'
        )
            .expect(await (await vizPanelForGrid.getGridCellByPosition(1, 3, 'Visualization 1')).getText())
            .toBe('Airline Name');

        // When I add "metric" named "Flights Delayed" from dataset "airline-sample-data.xls" to the current Viz by double click
        await datasetPanel.addObjectToVizByDoubleClick('Flights Delayed', 'metric', 'airline-sample-data.xls');
        // Then the grid cell in visualization "Visualization 1" at "1", "6" has text "Flights Delayed"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "6" should have text #{expected} instead we have #{actual}'
        )
            .expect(await (await vizPanelForGrid.getGridCellByPosition(1, 6, 'Visualization 1')).getText())
            .toBe('Flights Delayed');
        // # column width should be the same from last resize, so use same step to check
        // And Column 2 is 200 pixels "less" in grid visualization "Visualization 1"
        let actualColumnWidth3 = parseFloat((await (await vizPanelForGrid.getGridCellStyleByPosition(1, 2, 'Visualization 1', 'width'))).replace('px', ''));
        let expectedColumnWidth3 = expectedColumnWidth1 - 200;
        await since(`Then Column 2 is 200 pixels "less", should be ${expectedColumnWidth3}, actual ${actualColumnWidth3}`)
            .expect(assertWithinTolerance({ actual: actualColumnWidth3, expected: expectedColumnWidth3, tolerance: 1 }))
            .toBe(true);

        // # step 8 - add objects by DnD
        // When I drag "attribute" named "Year" from dataset "airline-sample-data.xls" to column 3 in grid visualization "Visualization 1"
        await vizPanelForGrid.dragDSObjectToGridByColumnBorder('Year', 'attribute', 'airline-sample-data.xls', 3, 'Visualization 1');
        // Then The dossier's screenshot "GridFunc01_DragYearToCol" should match the baselines
        // Then the grid cell in visualization "Visualization 1" at "1", "4" has text "Year"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "4" should have text #{expected} instead we have #{actual}'
        )
            .expect(await (await vizPanelForGrid.getGridCellByPosition(1, 4, 'Visualization 1')).getText())
            .toBe('Year');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Drag Year to Col 4 in Visualization 1',
            'TC22703_02_01'
        );

        // And I drag "metric" named "On-Time" from dataset "airline-sample-data.xls" to column 4 in grid visualization "Visualization 1"
        await vizPanelForGrid.dragDSObjectToGridByColumnBorder('On-Time', 'metric', 'airline-sample-data.xls', 4, 'Visualization 1');

        // Then The dossier's screenshot "GridFunc02_DragOnTimeToCol" should match the baselines
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Drag On-Time to Col 5 in Visualization 1',
            'TC22703_02_02'
        );

        // When I complete drop action
        // Then the grid cell in visualization "Visualization 1" at "1", "5" has text "On-Time"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "5" should have text #{expected} instead we have #{actual}'
        )
            .expect(await (await vizPanelForGrid.getGridCellByPosition(1, 5, 'Visualization 1')).getText())
            .toBe('On-Time');
        // # column width should be the same from last resize, so use same step to check
        // And Column 2 is 200 pixels "less" in grid visualization "Visualization 1"
        let actualColumnWidth4 = parseFloat((await (await vizPanelForGrid.getGridCellStyleByPosition(1, 2, 'Visualization 1', 'width'))).replace('px', ''));
        let expectedColumnWidth4 = expectedColumnWidth1 - 200;
        await since(`Then Column 2 is 200 pixels "less", should be ${expectedColumnWidth4}, actual ${actualColumnWidth4}`)
            .expect(assertWithinTolerance({ actual: actualColumnWidth4, expected: expectedColumnWidth4, tolerance: 1 }))
            .toBe(true);
        // # all formatting properties should still be the same
        // And the grid cell in visualization "Visualization 1" at "1", "3" has style "font-family" with value "Monoton"
        await since(
            'Grid cell in visualization "Visualization 1" at "1", "3" should have font-family #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(1, 3, 'Visualization 1'),
                    'font-family'
                )
            )
            .toBe('monoton');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has style "font-size" with value "13.3333px"
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "2" should have font-size with value #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 2, 'Visualization 1'),
                    'font-size'
                )
            )
            .toBe('13.3333px');
        // And the grid cell in visualization "Visualization 1" at "2", "2" has style "text-decoration" with value "underline"
        await since(
            'Grid cell in visualization "Visualization 1" at "2", "2" should have text-decoration-line #{expected} instead we have #{actual}'
        )
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(2, 2, 'Visualization 1'),
                    'text-decoration-line'
                )
            )
            .toBe('underline');
        // And the grid cell in visualization "Visualization 1" at "3", "3" has style "color" with value "rgba(251, 218, 217, 1)"
        await since(
            'Then the grid cell in visualization "Visualization 1" at "3", "3" has style "color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('3', '3', 'Visualization 1').getCSSProperty('color')).value
            )
            .toContain('251,218,217,1');
        // When I scroll grid visualization "Visualization 1" 1000 pixels to the "left"
        // Then The dossier's screenshot "GridFunc03_4AR_4C" should match the baselines

        // # step 10 - drag object out of grid to invalid drop zone
        // When I drag "Month" out of grid visualization "Visualization 1" to an invalid drop zone
        await vizPanelForGrid.dragObjectToInvalidDZ('Month', 'Visualization 1');
        // Then The dossier's screenshot "GridFunc04_InvalidDragToTitle" should match the baselines
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Drag Month to invalid DZ in Visualization 1',
            'TC22703_02_03'
        );
    });

    it('[TC22703_03] Check that object additions to grid have correct guidelines and validate incremental fetching', async () => {
        // When I open dossier by its ID "9819D8AC11EA5A73CF330080EFE58051"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_Functional.project.id,
            dossierId: gridConstants.Grid_Functional.id,
        });
        // # step 11 - drag object out of grid to new visualization
        // #When I click on insert new visualization
        // When I insert "Grid" from toolbar
        await dossierAuthoringPage.actionOnToolbar("Visualization");
        await newGalleryPanel.selectViz("Grid")
        // And I click on container "Visualization 1" to select it
        await baseContainer.clickContainerByScript('Visualization 1');
        // And I drag "Month" out of grid visualization "Visualization 1" to grid visualization "Visualization 2"
        await vizPanelForGrid.dragObjectToOtherViz('Month', 'Visualization 1', 'Visualization 2');
        // Then The dossier's screenshot "GridFunc05_InvalidDragToNewViz" should match the baselines
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 2'),
            'Invalid Drag Month to Visualization 2',
            'TC22703_03_01'
        );

        // When I complete drop action
        // # nothing happened after drag
        // Then The dossier's screenshot "GridFunc06_AttrNotMoved" should match the baselines

        // maximum 'Visualization 2'
        await gridAuthoring.clickOnMaximizeRestoreButton('Visualization 2');

        // # step 12 - add objects to new viz by drag
        // When I click on container "Visualization 2" to select it
        await baseContainer.clickContainerByScript('Visualization 2');
        // And I select multiple objects from dataset "airline-sample-data.xls" by clicking with shift "attribute" named "Day of Week" and "attribute" named "Departure Hour" to move to drop zone "Rows"
        await vizPanelForGrid.multiselectAndDragDSObjectsToDZ('airline-sample-data.xls', 'attribute', 'Day of Week', 'attribute', 'Departure Hour', 'Rows');
        // And I select multiple objects from dataset "airline-sample-data.xls" by clicking with shift "metric" named "Avg Delay (min)" and "metric" named "Flights Delayed" to move to drop zone "Columns"
        await vizPanelForGrid.multiselectAndDragDSObjectsToDZ('airline-sample-data.xls', 'metric', 'Avg Delay (min)', 'metric', 'Flights Delayed', 'Columns');
        // # step 13 - change order of objects in grid
        // And I drag "attribute" named "Year" from dataset "airline-sample-data.xls" to the row "below" "Flights Cancelled" in grid visualization "Visualization 2"
        await vizPanelForGrid.dragDSObjectToGridWithPositionInRow('Year', 'attribute', 'airline-sample-data.xls', 'below', 'Flights Cancelled', 'Visualization 2');
        // Then The dossier's screenshot "GridFunc07_DragYearToRow" should match the baselines
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 2'),
            'Drag Year to row below Flights Cancelled in Visualization 2',
            'TC22703_03_02'
        );
        // When I complete drop action
        
        // And I move "Avg Delay (min)" from grid visualization "Visualization 2" to column 7 in grid visualization "Visualization 2"
        await vizPanelForGrid.moveObjectToGridByColumnBorder('Avg Delay (min)', 'Visualization 2', 7, 'Visualization 2');
        // Then The dossier's screenshot "GridFunc08_DragAvgDelayToCol" should match the baselines
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 2'),
            'Drag Avg Delay to column 7 in Visualization 2',
            'TC22703_03_03'
        );
        // When I complete drop action
        // Then The dossier's screenshot "GridFunc09_3AR_3M1AC" should match the baselines

        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to Grid tab in Format Panel
        await newFormatPanelForGrid.switchToGridTab();
        // And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
        // And I click Enable Banding check box under Layout section
        await newFormatPanelForGrid.enableBanding();
        // Then the grid cell in visualization "Visualization 2" at "4", "2" has style "background-color" with value "rgba(249, 249, 249, 1)"
        await since('Grid cell in visualization "Visualization 2" at "4", "2" should have background-color #{expected} instead we have #{actual}')
            .expect(
                await gridAuthoring.getCSSProperty(
                    gridAuthoring.getGridCellByPosition(4, 2, 'Visualization 2'),
                    'background-color'
                )
            )
            .toBe('rgba(249,249,249,1)');
        // And The dossier's screenshot "GridFunc10_AddBanding" should match the baselines 
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 2'),
            'Add Banding in Visualization 2',
            'TC22703_03_04'
        );

        // # step 14 - incremental fetching, ensure that banding still shows properly
        // #Then The grid visualization "Visualization 2" does not have element "Saturday"
        // # scroll twice for incremental fetching
        // When I scroll grid visualization "Visualization 2" 600 pixels to the "bottom"
        await gridAuthoring.gridCellOperations.moveScrollBar('bottom', 600, 'Visualization 2');
        // And I scroll grid visualization "Visualization 2" 500 pixels to the "bottom"
        await gridAuthoring.gridCellOperations.moveScrollBar('bottom', 500, 'Visualization 2');
        // Then The grid visualization "Visualization 2" has element "Saturday"
        // And The dossier's screenshot "GridFunc11_IncrementalFetchWithBanding" should match the baselines 
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 2'),
            'Incremental Fetch with Banding in Visualization 2',
            'TC22703_03_05'
        );
    });

    it('[TC22703_04] Selecting/Unselecting cells', async () => {
        // When I open dossier by its ID "9819D8AC11EA5A73CF330080EFE58051"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.Grid_Functional.project.id,
            dossierId: gridConstants.Grid_Functional.id,
        });
        // # step 15 - click individual cell to select
        // When I select elements "January" of object "" on grid visualization "Visualization 1"
        await vizPanelForGrid.selectMultipleElements('January', 'Visualization 1');

        // Then the grid cell in visualization "Visualization 1" at "2", "1" is selected
        await since('Grid cell in visualization "Visualization 1" at "2", "1" should be selected')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getAttribute('class'))
            .toContain('xtabSel');

        // # step 16 - click same cell to unselect
        // When I select elements "January" of object "" on grid visualization "Visualization 1"
        await vizPanelForGrid.selectMultipleElements('January', 'Visualization 1');
        // Then the grid cell in visualization "Visualization 1" at "2", "1" is not selected
        await since('Grid cell in visualization "Visualization 1" at "2", "1" should not be selected')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getAttribute('class'))
            .not.toContain('xtabSel');

        // # step 17 - click and shift head and tail to select all
        // When I select elements from "Sunday" to "Saturday" on grid visualization "Visualization 1"
        await vizPanelForGrid.selectElementsUsingShift('Sunday', 'Saturday', 'Visualization 1');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Select from Sunday to Saturday in Visualization 1',
            'TC22703_04_01'
        );
        // Then the grid cell in visualization "Visualization 1" at "2", "2" is selected
        // And the grid cell in visualization "Visualization 1" at "3", "1" is selected
        // And the grid cell in visualization "Visualization 1" at "4", "1" is selected
        // And the grid cell in visualization "Visualization 1" at "5", "1" is selected
        // And the grid cell in visualization "Visualization 1" at "6", "1" is selected
        // And the grid cell in visualization "Visualization 1" at "7", "1" is selected
        // And the grid cell in visualization "Visualization 1" at "8", "1" is selected

        // # clicking metric, unselects all attributes selected
        // When I select elements "20,505.48" of object "" on grid visualization "Visualization 1"
        await vizPanelForGrid.selectMultipleElements('20,505.48', 'Visualization 1');
        // # step 18 - select specific cells via click + Command/CTRL
        // And I select elements "Sunday, Tuesday, Saturday" of object "" on grid visualization "Visualization 1"
        await vizPanelForGrid.selectMultipleElements('Sunday, Tuesday, Saturday', 'Visualization 1');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Select elements "Sunday, Tuesday, Saturday" in Visualization 1',
            'TC22703_04_02'
        );

        // # clicking metric, unselects all attributes selected
        // When I select elements "20,505.48" of object "" on grid visualization "Visualization 1"
        await vizPanelForGrid.selectMultipleElements('20,505.48', 'Visualization 1');
        // # check if merged row headers is enabled for step 19
        // And I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I switch to Grid tab in Format Panel
        await newFormatPanelForGrid.switchToGridTab();
        // And I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
        // Then The option "Merge repetitive cells" in "Row headers" section is checked in Format Panel
        await since(
            'The option "Merge repetitive cells" in "Row headers" section checked status should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isCheckboxChecked('Row headers', 'Merge repetitive cells'))
            .toBeTruthy();
        // And The option "Merge repetitive cells" in "Column headers" section is unchecked in Format Panel
        await since(
            'The option "Merge repetitive cells" in "Column headers" section checked status should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isCheckboxChecked('Column headers', 'Merge repetitive cells'))
            .toBeFalsy();
        
        // # step 19 - click and shift elements of 2 different columns
        // # select February of first column, first Sunday of second column
        // And I select elements from "February" to "Sunday" on grid visualization "Visualization 1"
        await vizPanelForGrid.selectElementsUsingShift('February', 'Sunday', 'Visualization 1');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Select February of first column, first Sunday of second column in Visualization 1',
            'TC22703_04_03'
        );

        // # clicking metric, unselects all attributes selected
        // When I select elements "20,505.48" of object "" on grid visualization "Visualization 1"
        await vizPanelForGrid.selectMultipleElements('20,505.48', 'Visualization 1');
        // # click + ctrl elements of 2 different columns
        // And I select elements "February, Sunday" of object "" on grid visualization "Visualization 1"
        await vizPanelForGrid.selectMultipleElements('February, Sunday', 'Visualization 1');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Select elements "February, Sunday" in Visualization 1',
            'TC22703_04_04'
        );

        // # step 20 - test keep only, exclude
        // When I keep only the element "Sunday" from grid visualization "Visualization 1"
        await vizPanelForGrid.keepOnlyElements('Sunday', 'Visualization 1');
        // Then The visualization "Visualization 1" image should match file "GridFunc12_KeepOnly"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Keep Only Sunday in Visualization 1',
            'TC22703_04_05'
        );

        // When I exclude the elements "February" in grid visualization "Visualization 1"
        await vizPanelForGrid.excludeElements('February', 'Visualization 1');
        // Then The grid visualization "Visualization 1" does not have element "February"
        // And The grid visualization "Visualization 1" has element "Sunday"
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'Exclude February in Visualization 1',
            'TC22703_04_06'
        );
    });

    it('[TC22703_05] Hide/Show Null or Zero', async () => {
        // When I open dossier by its ID "6DDE7C6411EAB4BE76E70080EFD50D21"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridHideShowNull.project.id,
            dossierId: gridConstants.AGGridHideShowNull.id,
        });

        // maximum 'Normal Grid 1'
        await gridAuthoring.clickOnMaximizeRestoreButton('Normal Grid 1');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Normal Grid 1'),
            'Show both nulls and zeros in Normal Grid 1',
            'TC22703_05_01'
        );

        // When I open the Show Data dialog for the visualization "Normal Grid 1"
        await vizPanelForGrid.openShowDataDiagFromViz('Normal Grid 1');
        // And It shows there are "22" rows of data in the show data dialog
        await since('It shows there are "22" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(22);
        // When I close the show data dialog
        await showDataDialog.closeShowDataDialog();

        // When I open the More Options dialog for the visualization "Normal Grid 1" through the visualization context menu
        await vizPanelForGrid.openMoreOptionDiagFromViz('Normal Grid 1');
        // Then Current Hide metric nulls and zeros is set to "Show both nulls and zeros"
        await takeScreenshotByElement(
            vizPanelForGrid.moreOptions,
            'Option dialog for viz "Normal Grid 1"',
            'TC22703_05_02'
        ); 
        // When I select "Hide both nulls and zeros" from Hide metric nulls and zeros pull down list in More Options dialog
        await moreOptions.selectHideShowNullZerosOption('Hide both nulls and zeros');
        // And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Normal Grid 1'),
            'Hide both nulls and zeros in Normal Grid 1',
            'TC22703_05_03'
        );
        // When I open the Show Data dialog for the visualization "Normal Grid 1"
        await vizPanelForGrid.openShowDataDiagFromViz('Normal Grid 1');
        // And It shows there are "3" rows of data in the show data dialog
        await since('It shows there are "3" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(3);
        // When I close the show data dialog
        await showDataDialog.closeShowDataDialog();

        // When I open the More Options dialog for the visualization "Normal Grid 1" through the visualization context menu
        await vizPanelForGrid.openMoreOptionDiagFromViz('Normal Grid 1');
        // And I select "Hide nulls only" from Hide metric nulls and zeros pull down list in More Options dialog
        await moreOptions.selectHideShowNullZerosOption('Hide nulls only');
        // And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Normal Grid 1'),
            'Hide nulls only in Normal Grid 1',
            'TC22703_05_04'
        );
        // When I open the Show Data dialog for the visualization "Normal Grid 1"
        await vizPanelForGrid.openShowDataDiagFromViz('Normal Grid 1');
        // And It shows there are "11" rows of data in the show data dialog
        await since('It shows there are "11" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(11);
        // When I close the show data dialog
        await showDataDialog.closeShowDataDialog();

        // When I open the More Options dialog for the visualization "Normal Grid 1" through the visualization context menu
        await vizPanelForGrid.openMoreOptionDiagFromViz('Normal Grid 1');
        // And I select "Hide zeros only" from Hide metric nulls and zeros pull down list in More Options dialog
        await moreOptions.selectHideShowNullZerosOption('Hide zeros only');
        // And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Normal Grid 1'),
            'Hide zeros only in Normal Grid 1',
            'TC22703_05_05'
        );
        // When I open the Show Data dialog for the visualization "Normal Grid 1"
        await vizPanelForGrid.openShowDataDiagFromViz('Normal Grid 1');
        // Then An editor shows up with title "Show Data"
        await since('An editor should show up with title "Show Data"')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isDisplayed())
            .toBe(true);
        // And It shows there are "14" rows of data in the show data dialog
        await since('It shows there are "14" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(14);
        // When I close the show data dialog
        await showDataDialog.closeShowDataDialog();
        await browser.pause(2000);
        await gridAuthoring.clickOnMaximizeRestoreButton('Normal Grid 1');
        // wait for the grid to restore
        await browser.pause(2000);
        await gridAuthoring.clickOnMaximizeRestoreButton('Normal Grid 2');

        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Normal Grid 2'),
            'Show both nulls and zeros in Normal Grid 2',
            'TC22703_05_06'
        );
        // When I open the More Options dialog for the visualization "Normal Grid 2" through the visualization context menu
        await vizPanelForGrid.openMoreOptionDiagFromViz('Normal Grid 2');
        // Then Current Hide metric nulls and zeros is set to "Show both nulls and zeros"
        await since('Current Hide metric nulls and zeros is set to #{expected}, instead we have #{actual}')
            .expect(await moreOptions.getCurrentHideMetricNullZerosSetting(). getValue())
            .toBe('Show both nulls and zeros');
        await takeScreenshotByElement(
            vizPanelForGrid.moreOptions,
            'Option dialog for viz "Normal Grid 2"',
            'TC22703_05_07'
        ); 
        // When I select "Hide both nulls and zeros" from Hide metric nulls and zeros pull down list in More Options dialog
        await moreOptions.selectHideShowNullZerosOption('Hide both nulls and zeros');
        // And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();

        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Normal Grid 2'),
            'Hide both nulls and zeros in Normal Grid 2',
            'TC22703_05_08'
        );
        // Then the grid cell in visualization "Normal Grid 2" at "18", "3" has text "1/31/2015"
        // And the grid cell in visualization "Normal Grid 2" at "22", "3" has text "1/31/2015"
        // And the grid cell in visualization "Normal Grid 2" at "8", "3" has text "0"

        // When I open the More Options dialog for the visualization "Normal Grid 2" through the visualization context menu
        await vizPanelForGrid.openMoreOptionDiagFromViz('Normal Grid 2');
        // And I select "Hide nulls only" from Hide metric nulls and zeros pull down list in More Options dialog
        await moreOptions.selectHideShowNullZerosOption('Hide nulls only');
        // And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Normal Grid 2'),
            'Hide nulls only in Normal Grid 2',
            'TC22703_05_09'
        );
        // Then the grid cell in visualization "Normal Grid 2" at "18", "3" has text "1/26/2015"
        // And the grid cell in visualization "Normal Grid 2" at "20", "1" has text "2/1/2015"
        // And the grid cell in visualization "Normal Grid 2" at "23", "3" has text "1/31/2015"

        // When I open the More Options dialog for the visualization "Normal Grid 2" through the visualization context menu
        await vizPanelForGrid.openMoreOptionDiagFromViz('Normal Grid 2');
        // And I select "Hide zeros only" from Hide metric nulls and zeros pull down list in More Options dialog
        await moreOptions.selectHideShowNullZerosOption('Hide zeros only');
        // And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Normal Grid 2'),
            'Hide zeros only in Normal Grid 2',
            'TC22703_05_10'
        );
        // Then the grid cell in visualization "Normal Grid 2" at "18", "3" has text "1/26/2015"
        // And the grid cell in visualization "Normal Grid 2" at "20", "1" has text "2/1/2015"
        // And the grid cell in visualization "Normal Grid 2" at "23", "3" has text "1/31/2015"
        // And the grid cell in visualization "Normal Grid 2" at "8", "3" has text "0"

        // When I switch to page "Compound Grid" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Compound Grid',
        });
        await gridAuthoring.clickOnMaximizeRestoreButton('Compound Grid 1');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid 1'),
            'Show both nulls and zeros in Compound Grid 1',
            'TC22703_05_11'
        );

        // Then the grid cell in visualization "Compound Grid 1" at "2", "3" has text "1/31/2015"
        // And the grid cell in visualization "Compound Grid 1" at "6", "2" has text "0"

        
        // When I open the More Options dialog for the visualization "Compound Grid 1" through the visualization context menu
        await vizPanelForGrid.openMoreOptionDiagFromViz('Compound Grid 1');
        // Then Current Hide metric nulls and zeros is set to "Show both nulls and zeros"
        await since('Current Hide metric nulls and zeros is set to #{expected}, instead we have #{actual}')
            .expect(await moreOptions.getCurrentHideMetricNullZerosSetting(). getValue())
            .toBe('Show both nulls and zeros');
        await takeScreenshotByElement(
            vizPanelForGrid.moreOptions,
            'Option dialog for viz "Compound Grid 1"',
            'TC22703_05_12'
        );
        // When I select "Hide both nulls and zeros" from Hide metric nulls and zeros pull down list in More Options dialog
        await moreOptions.selectHideShowNullZerosOption('Hide both nulls and zeros');
        // And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid 1'),
            'Hide both nulls and zeros in Compound Grid 1',
            'TC22703_05_13'
        );
        // Then the grid cell in visualization "Compound Grid 1" at "2", "3" has text "2/1/2015"
        // And the grid cell in visualization "Compound Grid 1" at "3", "4" has text "2"
        // And the grid cell in visualization "Compound Grid 1" at "4", "2" has text "1"

        // When I open the More Options dialog for the visualization "Compound Grid 1" through the visualization context menu
        await vizPanelForGrid.openMoreOptionDiagFromViz('Compound Grid 1');
        // And I select "Hide nulls only" from Hide metric nulls and zeros pull down list in More Options dialog
        await moreOptions.selectHideShowNullZerosOption('Hide nulls only');
        // And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid 1'),
            'Hide nulls only in Compound Grid 1',
            'TC22703_05_14'
        );
        // Then the grid cell in visualization "Compound Grid 1" at "2", "3" has text "2/1/2015"
        // And the grid cell in visualization "Compound Grid 1" at "2", "4" has text "0"
        // And the grid cell in visualization "Compound Grid 1" at "8", "3" has text "1/31/2015"
        // And the grid cell in visualization "Compound Grid 1" at "8", "4" has text "2"

        // When I open the More Options dialog for the visualization "Compound Grid 1" through the visualization context menu
        await vizPanelForGrid.openMoreOptionDiagFromViz('Compound Grid 1');
        // And I select "Hide zeros only" from Hide metric nulls and zeros pull down list in More Options dialog
        await moreOptions.selectHideShowNullZerosOption('Hide zeros only');
        // And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid 1'),
            'Hide zeros only in Compound Grid 1',
            'TC22703_05_15'
        );
        // Then the grid cell in visualization "Compound Grid 1" at "4", "1" has text "3/19/2015"
        // And the grid cell in visualization "Compound Grid 1" at "8", "4" has text "2"
        // And the grid cell in visualization "Compound Grid 1" at "15", "3" has text "1/31/2015"

        await browser.pause(2000);
        await gridAuthoring.clickOnMaximizeRestoreButton('Compound Grid 1');
        await browser.pause(2000);
        await gridAuthoring.clickOnMaximizeRestoreButton('Compound Grid 2');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid 2'),
            'Show both nulls and zeros in Compound Grid 2',
            'TC22703_05_16'
        );
        // When I open the More Options dialog for the visualization "Compound Grid 2" through the visualization context menu
        await vizPanelForGrid.openMoreOptionDiagFromViz('Compound Grid 2');
        // Then Current Hide metric nulls and zeros is set to "Show both nulls and zeros"
        await since('Current Hide metric nulls and zeros is set to #{expected}, instead we have #{actual}')
            .expect(await moreOptions.getCurrentHideMetricNullZerosSetting(). getValue())
            .toBe('Show both nulls and zeros');
        // When I select "Hide both nulls and zeros" from Hide metric nulls and zeros pull down list in More Options dialog
        await moreOptions.selectHideShowNullZerosOption('Hide both nulls and zeros');
        // And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid 2'),
            'Hide both nulls and zeros in Compound Grid 2',
            'TC22703_05_17'
        );
        // Then the grid cell in visualization "Compound Grid 2" at "18", "3" has text "1/31/2015"
        // And the grid cell in visualization "Compound Grid 2" at "22", "3" has text "1/31/2015"
        // And the grid cell in visualization "Compound Grid 2" at "8", "3" has text "0"

        // When I open the More Options dialog for the visualization "Compound Grid 2" through the visualization context menu
        await vizPanelForGrid.openMoreOptionDiagFromViz('Compound Grid 2');
        // And I select "Hide nulls only" from Hide metric nulls and zeros pull down list in More Options dialog
        await moreOptions.selectHideShowNullZerosOption('Hide nulls only');
        // And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid 2'),
            'Hide nulls only in Compound Grid 2',
            'TC22703_05_18'
        );
        // Then the grid cell in visualization "Compound Grid 2" at "18", "3" has text "1/26/2015"
        // And the grid cell in visualization "Compound Grid 2" at "20", "1" has text "2/1/2015"
        // And the grid cell in visualization "Compound Grid 2" at "23", "3" has text "1/31/2015"

        // When I open the More Options dialog for the visualization "Compound Grid 2" through the visualization context menu
        await vizPanelForGrid.openMoreOptionDiagFromViz('Compound Grid 2');
        // And I select "Hide zeros only" from Hide metric nulls and zeros pull down list in More Options dialog
        await moreOptions.selectHideShowNullZerosOption('Hide zeros only');
        // And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid 2'),
            'Hide zeros only in Compound Grid 2',
            'TC22703_05_19'
        );
        // Then the grid cell in visualization "Compound Grid 2" at "18", "3" has text "1/26/2015"
        // And the grid cell in visualization "Compound Grid 2" at "20", "1" has text "2/1/2015"
        // And the grid cell in visualization "Compound Grid 2" at "23", "3" has text "1/31/2015"
        // And the grid cell in visualization "Compound Grid 2" at "8", "3" has text "0"
        await browser.pause(2000);
        await gridAuthoring.clickOnMaximizeRestoreButton('Compound Grid 2');
        await browser.pause(2000);
        await gridAuthoring.clickOnMaximizeRestoreButton('Compound Grid 3');

        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid 3'),
            'Show both nulls and zeros in Compound Grid 3',
            'TC22703_05_20'
        );

        // When I open the More Options dialog for the visualization "Compound Grid 3" through the visualization context menu
        await vizPanelForGrid.openMoreOptionDiagFromViz('Compound Grid 3');
        // Then Current Hide metric nulls and zeros is set to "Show both nulls and zeros"
        await since('Current Hide metric nulls and zeros is set to #{expected}, instead we have #{actual}')
            .expect(await moreOptions.getCurrentHideMetricNullZerosSetting(). getValue())
            .toBe('Show both nulls and zeros');
        // When I select "Hide both nulls and zeros" from Hide metric nulls and zeros pull down list in More Options dialog
        await moreOptions.selectHideShowNullZerosOption('Hide both nulls and zeros');
        // And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid 3'),
            'Hide both nulls and zeros in Compound Grid 3',
            'TC22703_05_21'
        );

        // Then the grid cell in visualization "Compound Grid 3" at "22", "3" has text "1/31/2015"
        // And the grid cell in visualization "Compound Grid 3" at "18", "3" has text "1/31/2015"
        // And The grid visualization "Compound Grid 3" does not have element "0"

        // When I open the More Options dialog for the visualization "Compound Grid 3" through the visualization context menu
        await vizPanelForGrid.openMoreOptionDiagFromViz('Compound Grid 3');
        // And I select "Hide nulls only" from Hide metric nulls and zeros pull down list in More Options dialog
        await moreOptions.selectHideShowNullZerosOption('Hide nulls only');
        // And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid 3'),
            'Hide nulls only in Compound Grid 3',
            'TC22703_05_22'
        );
        // Then the grid cell in visualization "Compound Grid 3" at "18", "3" has text "1/26/2015"
        // And the grid cell in visualization "Compound Grid 3" at "20", "1" has text "2/1/2015"
        // And the grid cell in visualization "Compound Grid 3" at "23", "3" has text "1/31/2015"
        // And the grid cell in visualization "Compound Grid 3" at "6", "3" has text "0"

        // When I open the More Options dialog for the visualization "Compound Grid 3" through the visualization context menu
        await vizPanelForGrid.openMoreOptionDiagFromViz('Compound Grid 3');
        // And I select "Hide zeros only" from Hide metric nulls and zeros pull down list in More Options dialog
        await moreOptions.selectHideShowNullZerosOption('Hide zeros only');
        // And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Compound Grid 3'),
            'Hide zeros only in Compound Grid 3',
            'TC22703_05_23'
        );
        // Then the grid cell in visualization "Compound Grid 3" at "18", "3" has text "1/26/2015"
        // And the grid cell in visualization "Compound Grid 3" at "20", "1" has text "2/1/2015"
        // And the grid cell in visualization "Compound Grid 3" at "23", "3" has text "1/31/2015"
        // And The grid visualization "Compound Grid 3" does not have element "0"
    });
});
