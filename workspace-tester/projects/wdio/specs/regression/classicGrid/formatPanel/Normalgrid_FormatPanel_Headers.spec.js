import * as gridConstants from '../../../../constants/grid.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';

describe('Grid Format Panel', () => {
    let { loginPage, libraryPage, gridAuthoring, baseFormatPanel, newFormatPanelForGrid, reportFormatPanel } =
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

    it('[TC41277_06] Sanity test Grid for Show/Hide, Merge/Unmerge, Lock/Unlock for Row/Column Headers', async () => {
        // When I open dossier by its ID "36713F2C11EAB000A8FE0080EFA517BB"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.GridAndCompoundGrid.id,
            projectId: gridConstants.GridAndCompoundGrid.project.id,
        });

        // When I switch to the Format Panel tab
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

        // And The option "Lock headers" in "Row headers" section is unchecked in Format Panel
        await since(
            'The option "Lock headers" in "Row headers" section unchecked status should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isCheckboxUnchecked('Row headers', 'Lock headers'))
            .toBeTruthy();

        // And The "Row headers" section is displayed in Format Panel
        await since(
            'The "Row headers" section should be displayed in Format Panel should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isFirstCheckBoxChecked('Row headers'))
            .toBeTruthy();

        // Then The option "Merge repetitive cells" in "Column headers" section is unchecked in Format Panel
        await since(
            'The option "Merge repetitive cells" in "Column headers" section unchecked status should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isCheckboxUnchecked('Column headers', 'Merge repetitive cells'))
            .toBeTruthy();

        // And The option "Lock headers" in "Column headers" section is checked in Format Panel
        await since(
            'The option "Lock headers" in "Column headers" section checked status should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isCheckboxChecked('Column headers', 'Lock headers'))
            .toBeTruthy();

        // And The "Column headers" section is displayed in Format Panel
        await since(
            'Column headers section should be displayed in Format Panel should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isFirstCheckBoxChecked('Column headers'))
            .toBe(true);

        // When I toggle Row Headers toggle button under Layout section
        await reportFormatPanel.toggleButton('Row headers');

        // And I toggle Column Headers toggle button under Layout section
        await reportFormatPanel.toggleButton('Column headers');

        await since(
            'Row headers section should be hidden in Format Panel should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isFirstCheckBoxChecked('Row headers'))
            .toBe(false);

        // And The "Column headers" section is hidden in Format Panel
        await since(
            'Column headers section should be hidden in Format Panel should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isFirstCheckBoxUnchecked('Column headers'))
            .toBe(false);

        // Then the grid cell in visualization "Grid" at "1", "1" has text "$83,871"
        await since(
            'Grid cell at position (1, 1) in visualization "Grid" should have text #{expected} instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 1, 'Grid'))
            .toBe('$83,871');

        // When I toggle Row Headers toggle button under Layout section
        await reportFormatPanel.toggleButton('Row headers');

        // And I toggle Column Headers toggle button under Layout section
        await reportFormatPanel.toggleButton('Column headers');

        // And The "Row headers" section is displayed in Format Panel
        await since(
            'Row headers section should be displayed in Format Panel should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isFirstCheckBoxChecked('Row headers'))
            .toBe(true);

        // And The "Column headers" section is displayed in Format Panel
        await since(
            'Column headers section should be displayed in Format Panel should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isFirstCheckBoxChecked('Column headers'))
            .toBe(true);
        // Then the grid cell in visualization "Grid" at "1", "1" has text "City"
        await since(
            'Grid cell at (1, 1) in visualization "Grid" should have text #{expected} instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 1, 'Grid'))
            .toBe('City');

        // And the grid cell in visualization "Grid" at "2", "1" has text "Item Category"
        await since(
            'Grid cell at (2, 1) in visualization "Grid" should have text #{expected} instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(2, 1, 'Grid'))
            .toBe('Item Category');

        // And the grid cell in visualization "Grid" at "3", "1" has text "Annapolis"
        await since(
            'Grid cell at (3, 1) in visualization "Grid" should have text #{expected} instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 1, 'Grid'))
            .toBe('Annapolis');

        // And the grid cell in visualization "Grid" at "3", "3" has text "$83,871"
        await since(
            'Grid cell at (3, 3) in visualization "Grid" should have text #{expected} instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(3, 3, 'Grid'))
            .toBe('$83,871');

        // When I click Merge repetitive cells checkbox for Row Headers under Layout section
        await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Merge repetitive cells');

        // And I click Merge repetitive cells checkbox for Column Headers under Layout section
        await reportFormatPanel.clickCheckBoxForOption('Column headers', 'Merge repetitive cells');

        // Then The option "Merge repetitive cells" in "Row headers" section is unchecked in Format Panel
        await since(
            'The option "Merge repetitive cells" in "Row headers" section unchecked status should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isCheckboxUnchecked('Row headers', 'Merge repetitive cells'))
            .toBeTruthy();

        // And The option "Merge repetitive cells" in "Column headers" section is checked in Format Panel
        await since('The option "Merge repetitive cells" in "Column headers" section should be checked')
            .expect(await reportFormatPanel.isCheckboxChecked('Column headers', 'Merge repetitive cells'))
            .toBeTruthy();

        // Then the grid cell in visualization "Grid" at "5", "1" has text "Annapolis"
        await since(
            'Grid cell at (5, 1) in visualization "Grid" should have text #{expected} instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(5, 1, 'Grid'))
            .toBe('Annapolis');

        // And the grid cell in visualization "Grid" at "1", "4" has text "Feb"
        await since(
            'Grid cell at (1, 4) in visualization "Grid" should have text #{expected} instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 4, 'Grid'))
            .toBe('Feb');

        // When I click Merge repetitive cells checkbox for Row Headers under Layout section
        await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Merge repetitive cells');

        // And I click Merge repetitive cells checkbox for Column Headers under Layout section
        await reportFormatPanel.clickCheckBoxForOption('Column headers', 'Merge repetitive cells');

        // Then The option "Merge repetitive cells" in "Row headers" section is checked in Format Panel
        await since(
            'The option "Merge repetitive cells" in "Row headers" section checked status should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isCheckboxChecked('Row headers', 'Merge repetitive cells'))
            .toBeTruthy();

        // And The option "Merge repetitive cells" in "Column headers" section is unchecked in Format Panel
        await since('The option "Merge repetitive cells" in "Column headers" section should be unchecked')
            .expect(await reportFormatPanel.isCheckboxUnchecked('Column headers', 'Merge repetitive cells'))
            .toBeTruthy();

        // Then the grid cell in visualization "Grid" at "5", "1" has text "Art & Architecture"
        await since(
            'The grid cell in visualization "Grid" at "5", "1" should have text #{expected} instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(5, 1, 'Grid'))
            .toBe('Art & Architecture');

        // And the grid cell in visualization "Grid" at "1", "4" has text "Jan"
        await since(
            'The grid cell in visualization "Grid" at "1", "4" should have text #{expected} instead we have #{actual}'
        )
            .expect(await gridAuthoring.validators.getGridCellTextByPosition(1, 4, 'Grid'))
            .toBe('Jan');

        // When I click Lock Row Headers checkbox under Layout section
        await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Lock headers');

        // And I click Lock Column Headers checkbox under Layout section
        await reportFormatPanel.clickCheckBoxForOption('Column headers', 'Lock headers');

        // Then The option "Lock headers" in "Row headers" section is checked in Format Panel
        await since(
            'The option "Lock headers" in "Row headers" section checked status should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isCheckboxChecked('Row headers', 'Lock headers'))
            .toBeTruthy();

        // And The option "Lock headers" in "Column headers" section is unchecked in Format Panel
        await since(
            'The option "Lock headers" in "Column headers" section unchecked status should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isCheckboxUnchecked('Column headers', 'Lock headers'))
            .toBeTruthy();

        // When I scroll grid visualization "Grid" 200 pixels to the "right"
        await gridAuthoring.gridCellOperations.moveScrollBar('right', 200, 'Grid');

        // And I scroll grid visualization "Grid" 100 pixels to the "bottom"
        await gridAuthoring.gridCellOperations.moveScrollBar('bottom', 100, 'Grid');

        await takeScreenshotByElement(
            gridAuthoring.getGridContainer('Grid'),
            'TC41277_06_01',
            'Scroll bar to right and bottom for Grid',
            {
                tolerance: 0.3,
            }
        );

        // When I click Lock Row Headers checkbox under Layout section
        await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Lock headers');

        // And I click Lock Column Headers checkbox under Layout section
        await reportFormatPanel.clickCheckBoxForOption('Column headers', 'Lock headers');

        // Then The option "Merge repetitive cells" in "Row headers" section is checked in Format Panel
        await since(
            'The option "Merge repetitive cells" in "Row headers" section checked status should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isCheckboxChecked('Row headers', 'Merge repetitive cells'))
            .toBeTruthy();

        // And The option "Lock headers" in "Row headers" section is unchecked in Format Panel
        await since(
            'The option "Lock headers" in "Row headers" section unchecked status should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isCheckboxUnchecked('Row headers', 'Lock headers'))
            .toBeTruthy();

        // And The option "Merge repetitive cells" in "Column headers" section is unchecked in Format Panel
        await since(
            'The option "Merge repetitive cells" in "Column headers" section unchecked status should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isCheckboxUnchecked('Column headers', 'Merge repetitive cells'))
            .toBeTruthy();

        // And The option "Lock headers" in "Column headers" section is checked in Format Panel
        await since(
            'The option "Lock headers" in "Column headers" section checked status should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getCheckedCheckbox('Column headers', 'Lock headers').isDisplayed())
            .toBeTruthy();

        // And The "Row headers" section is displayed in Format Panel
        await since('The "Row headers" section should be displayed')
            .expect(await reportFormatPanel.isFirstCheckBoxChecked('Row headers'))
            .toBeTruthy();

        // And The "Column headers" section is displayed in Format Panel
        await since('The "Column headers" section should be displayed')
            .expect(await reportFormatPanel.isFirstCheckBoxChecked('Column headers'))
            .toBeTruthy();

        // When I scroll grid visualization "Compound Grid" 200 pixels to the "right"
        await gridAuthoring.gridCellOperations.moveScrollBar('right', 200, 'Compound Grid');

        // And I scroll grid visualization "Compound Grid" 100 pixels to the "bottom"
        await gridAuthoring.gridCellOperations.moveScrollBar('bottom', 100, 'Compound Grid');

        await takeScreenshotByElement(
            gridAuthoring.getGridContainer('Compound Grid'),
            'TC41277_06_03',
            'Scroll bar to right and bottom for Compound Grid with locked headers',
            {
                tolerance: 0.3,
            }
        );
    });

    it('[TC41277_07] Sanity test Compound Grid for Show/Hide, Merge/Unmerge, Lock/Unlock for Row/Column Headers', async () => {
        // When I open dossier by its ID "36713F2C11EAB000A8FE0080EFA517BB"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.GridAndCompoundGrid.id,
            projectId: gridConstants.GridAndCompoundGrid.project.id,
        });

        // When I switch to the Format Panel tab
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

        // And The option "Lock headers" in "Row headers" section is unchecked in Format Panel
        await since(
            'The option "Lock headers" in "Row headers" section unchecked status should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isCheckboxUnchecked('Row headers', 'Lock headers'))
            .toBeTruthy();

        // And The option "Merge repetitive cells" in "Column headers" section is unchecked in Format Panel
        await since(
            'The option "Merge repetitive cells" in "Column headers" section unchecked status should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isCheckboxUnchecked('Column headers', 'Merge repetitive cells'))
            .toBeTruthy();

        // And The option "Lock headers" in "Column headers" section is checked in Format Panel
        await since(
            'The option "Lock headers" in "Column headers" section checked status should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isCheckboxChecked('Column headers', 'Lock headers'))
            .toBeTruthy();

        // And The "Row headers" section is displayed in Format Panel
        await since(
            'The "Row headers" section should be displayed in Format Panel should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isFirstCheckBoxChecked('Row headers'))
            .toBeTruthy();

        // And The "Column headers" section is displayed in Format Panel
        await since(
            'The "Column headers" section should be displayed in Format Panel should be #{expected} instead we have #{actual}'
        )
            .expect(await reportFormatPanel.isFirstCheckBoxChecked('Column headers'))
            .toBeTruthy();

        // When I scroll grid visualization "Compound Grid" 200 pixels to the "right"
        await gridAuthoring.gridCellOperations.moveScrollBar('right', 200, 'Compound Grid');

        // And I scroll grid visualization "Compound Grid" 100 pixels to the "bottom"
        await gridAuthoring.gridCellOperations.moveScrollBar('bottom', 100, 'Compound Grid');

        await takeScreenshotByElement(
            gridAuthoring.getGridContainer('Compound Grid'),
            'TC41277_06_03',
            'Scroll bar to right and bottom for Compound Grid',
            {
                tolerance: 0.3,
            }
        );
    });
});
