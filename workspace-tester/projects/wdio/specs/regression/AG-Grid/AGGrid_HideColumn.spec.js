import * as gridConstants from '../../../constants/grid.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('AGGrid_HideColumn', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { dossierAuthoringPage, toolbar, contentsPanel, loginPage, libraryPage, agGridVisualization, loadingDialog } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {});

    it('[TC98727_1] sanity test on hide column', async () => {
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridHideColumn.project.id,
            dossierId: gridConstants.AGGridHideColumn.id,
        });

        // When I open the context menu for selected container
        await agGridVisualization.openContextMenu('Simple');

        // Then the context menu "does not have" option "Unhide All Columns"
        await takeScreenshotByElement(
            agGridVisualization.contextMenu,
            'TC98727_1_01',
            'Context menu should not have option "Unhide All Columns"'
        );
        //  1. simple ag grid
        //  Hide Column for "Account Level", "Account Executive", "Profit"
        await agGridVisualization.openContextMenuItemForHeader('Account Level', 'Hide Column', 'Simple');
        await agGridVisualization.openContextMenuItemForHeader('Account Executive', 'Hide Column', 'Simple');
        await agGridVisualization.openContextMenuItemForHeader('Profit', 'Hide Column', 'Simple');

        // Verify the columns are hidden
        await since('The header cell "Account Level" in ag-grid "Simple" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account Level', 'Simple').isExisting())
            .toBe(false);
        await since('The header cell "Account Executive" in ag-grid "Simple" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account Executive', 'Simple').isExisting())
            .toBe(false);
        await since('The header cell "Profit" in ag-grid "Simple" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Profit', 'Simple').isExisting())
            .toBe(false);

        // Verify other columns are still visible
        await since('The header cell "Account" in ag-grid "Simple" should be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account', 'Simple').isDisplayed())
            .toBe(true);
        await since('The header cell "Forecast ($)" in ag-grid "Simple" should be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Forecast ($)', 'Simple').isDisplayed())
            .toBe(true);
        await since('The header cell "Maintenance ($)" in ag-grid "Simple" should be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Maintenance ($)', 'Simple').isDisplayed())
            .toBe(true);

        // Click on the context menu of modern grid and select option "Unhide All Columns"
        await agGridVisualization.openContextMenu('Simple');
        await agGridVisualization.selectContextMenuOption('Unhide All Columns');

        // Then the columns "Account Level", "Account Executive" in ag-grid "Simple" is visible
        await since('The header cell "Account Level" in ag-grid "Simple" should be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account Level', 'Simple').isDisplayed())
            .toBe(true);
        await since('The header cell "Account Executive" in ag-grid "Simple" should be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account Executive', 'Simple').isDisplayed())
            .toBe(true);
        await since('The header cell "Profit" in ag-grid "Simple" should be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Profit', 'Simple').isDisplayed())
            .toBe(true);

        // Verify the cloumn position are not changed
        await since('The grid cell in ag-grid "Simple" at row 0, col 1 should be #{expected}, instead it is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'Simple'))
            .toBe('Account Level');
        await since('The grid cell in ag-grid "Simple" at row 0, col 4 should be #{expected}, instead it is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 5, 'Simple'))
            .toBe('Forecast ($)');
        await since('The grid cell in ag-grid "Simple" at row 0, col 3 should be #{expected}, instead it is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'Simple'))
            .toBe('Profit');

        // Verify Undo/Redo of "Hide Column" action
        await agGridVisualization.openContextMenuItemForHeader('Account Level', 'Hide Column', 'Simple');
        await since('The header cell "Account Level" in ag-grid "Simple" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account Level', 'Simple').isExisting())
            .toBe(false);
        await toolbar.clickButtonFromToolbar('Undo');

        // Then the header cell "Account Level" in ag-grid "Simple" is present
        await since('The header cell "Account Level" in ag-grid "Simple" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account Level', 'Simple').isExisting())
            .toBe(true);

        // Then the context menu "does not have" option "Unhide All Columns"
        await agGridVisualization.openContextMenu('Simple');
        await takeScreenshotByElement(
            agGridVisualization.contextMenu,
            'TC98727_1_02',
            'Context menu should not have option "Unhide All Columns"'
        );

        // Redo the "Hide Column" action
        await toolbar.clickButtonFromToolbar('Redo');
        await since('The header cell "Account Level" in ag-grid "Simple" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account Level', 'Simple').isExisting())
            .toBe(false);
        await dossierAuthoringPage.closeDossierWithoutSaving();
    });

    it('[TC98727_2] hide column of crosstab and microchart', async () => {
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridHideColumn.project.id,
            dossierId: gridConstants.AGGridHideColumn.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Crosstab' });

        // Hide Column for column set and microchat
        await agGridVisualization.openContextMenuItemForHeader('2019', 'Hide Column', 'Crosstab');

        // And I right click on elements "Forecast ($) Comparison by Region" and select "Hide Column" from ag-grid "Crosstab"
        await agGridVisualization.openContextMenuItemForHeader(
            'Forecast ($) Comparison by Region',
            'Hide Column',
            'Crosstab'
        );

        // Column set is hidden
        await since('The header cell "2019" in ag-grid "Simple" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('2019', 'Crosstab').isExisting())
            .toBe(false);

        // Microchart is hidden
        await since('The header cell "Forecast ($) Comparison by Region" in ag-grid "Simple" should not be present')
            .expect(
                await agGridVisualization
                    .getGroupHeaderCell('Forecast ($) Comparison by Region', 'Crosstab')
                    .isExisting()
            )
            .toBe(false);

        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Crosstab'),
            'TC98727_2_01',
            'Hide Column of Crosstab and Microchart'
        );

        // When I right click on elements "Profit" and select "Hide Column" from ag-grid "Crosstab"
        await agGridVisualization.openContextMenuItemForHeader('Profit', 'Hide Column', 'Crosstab');
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Crosstab'),
            'TC98727_2_02',
            'Hide Profit Column of Crosstab'
        );
        // And the header cell "2020" in ag-grid "Simple" is not present
        await since('Header cell "2020" in ag-grid "Simple" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('2020', 'Crosstab').isExisting())
            .toBe(false);

        // 3. the element context menu shouldn't contain hide column option (DE314567)
        // When I right click on value "Abbot Industries" from ag-grid "Crosstab"
        const gridCell = await agGridVisualization.getGridCellByPosition(3, 1, 'Crosstab');
        await agGridVisualization.rightClick({ elem: gridCell });

        // Then the context menu "does not have" option "Hide Columns"
        await since('Context menu should not have option "Hide Columns"')
            .expect(await agGridVisualization.getContextMenuOption('Hide Columns').isExisting())
            .toBe(false);
        await takeScreenshotByElement(
            agGridVisualization.contextMenu,
            'TC98727_2_03',
            'Context menu should not have option "Hide Columns"'
        );
        await dossierAuthoringPage.closeDossierWithoutSaving();
    });

    // Dashboard location: "Shared Report">"_automated">"AgGrid">"% based column width"
    it('[TC98727_3] Xfun on hide column', async () => {
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridHideColumn.project.id,
            dossierId: gridConstants.AGGridHideColumn.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Simple' });

        // 1. Duplicate/copy/move --> the hide column should preserved
        await agGridVisualization.openContextMenuItemForHeader('Account Level', 'Hide Column', 'Simple');
        await agGridVisualization.openContextMenuItemForHeader('Account Executive', 'Hide Column', 'Simple');

        await since('The header cell "Account Level" in ag-grid "Simple" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account Level', 'Simple').isExisting())
            .toBe(false);
        await since('The header cell "Account Executive" in ag-grid "Simple" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account Executive', 'Simple').isExisting())
            .toBe(false);

        // Duplicate container "Simple" through the context menu
        await agGridVisualization.duplicateContainer('Simple');

        //The container "Simple copy" should be selected
        await since('The container "Simple copy" should be selected')
            .expect(await agGridVisualization.getSelectedContainer('Simple copy').isExisting())
            .toBe(true);

        // The header cell "Account Level" and "Account Executive"in ag-grid "Simple copy" is not present
        await since('The header cell "Account Level" in ag-grid "Simple copy" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account Level', 'Simple copy').isExisting())
            .toBe(false);
        await since('Header cell "Account Executive" in ag-grid "Simple copy" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account Executive', 'Simple copy').isExisting())
            .toBe(false);

        // Copy container "Simple copy" to "Crosstab" through the context menu
        await agGridVisualization.copytoContainer('Simple copy', 'Crosstab');

        // Column "Account Level" and "Account Executive" in ag-grid "Simple copy copy" is not present
        await since('Header cell "Account Level" in ag-grid "Simple copy copy" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account Level', 'Simple copy copy').isExisting())
            .toBe(false);
        await since('Header cell "Account Executive" in ag-grid "Simple copy copy" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account Executive', 'Simple copy copy').isExisting())
            .toBe(false);

        // When I move container "Simple copy copy" to "New Page" through the context menu
        await agGridVisualization.movetoContainer('Simple copy copy', 'New Page');

        // Then Page "Page 1" in chapter "Chapter 1" is the current page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });

        // Column "Account Level" and "Account Executive" in ag-grid "Simple copy copy" are not present
        await since('Header cell "Account Level" in ag-grid "Simple copy copy" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account Level', 'Simple copy copy').isExisting())
            .toBe(false);
        await since('Header cell "Account Executive" in ag-grid "Simple copy copy" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account Executive', 'Simple copy copy').isExisting())
            .toBe(false);

        await agGridVisualization.openContextMenu('Simple copy copy');
        await agGridVisualization.selectContextMenuOption('Unhide All Columns');
        // Column "Account Level" and "Account Executive" in ag-grid "Simple copy copy" are present
        await since('Header cell "Account Level" in ag-grid "Simple copy copy" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account Level', 'Simple copy copy').isExisting())
            .toBe(true);
        await since('Header cell "Account Executive" in ag-grid "Simple copy copy" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account Executive', 'Simple copy copy').isExisting())
            .toBe(true);

        // 2. pause mode
        // Right click on elements "Profit" and select "Hide Column" from ag-grid "Simple copy copy"
        await agGridVisualization.openContextMenuItemForHeader('Profit', 'Hide Column', 'Simple copy copy');
        // The header cell "Profit" in ag-grid "Simple copy copy" is not present
        await since('Header cell "Profit" in ag-grid "Simple copy copy" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Profit', 'Simple copy copy').isDisplayed())
            .toBe(false);

        // Select "Pause Data Retrieval" from toolbar
        await dossierAuthoringPage.actionOnToolbar('Pause Data Retrieval');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Click on the context menu of selected container and select option "Unhide All Columns"
        await agGridVisualization.openContextMenu('Simple copy copy');
        await agGridVisualization.selectContextMenuOption('Unhide All Columns');

        // Select "Resume Data Retrieval" from toolbar
        await dossierAuthoringPage.actionOnToolbar('Resume Data Retrieval');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Then the header cell "Profit" in ag-grid "Simple copy copy" is present
        await since('Header cell "Profit" in ag-grid "Simple copy copy" should be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Profit', 'Simple copy copy').isDisplayed())
            .toBe(true);

        // 3. hide pinned column
        // Pin column "Account Level" to the left
        await agGridVisualization.openContextSubMenuItemForHeader('Account Level', 'Pin Column', 'to the Left', 'Simple copy copy');
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Simple copy copy'),
            'TC98727_3_01',
            'Account Level Column is Pinned to left'
        );

        // Hide column "Account Level"
        await agGridVisualization.openContextMenuItemForHeader('Account Level', 'Hide Column', 'Simple copy copy');

        // Then the header cell "Account Level" in ag-grid "Simple copy copy" is not present
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Simple copy copy'),
            'TC98727_3_02',
            'Pinned Column Account Level is Hidden'
        );
        await since('Header cell "Account Level" in ag-grid "Simple copy copy" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Account Level', 'Simple copy copy').isExisting())
            .toBe(false);

        // When I click on the context menu of selected container and select option "Unhide All Columns"
        await agGridVisualization.openContextMenu('Simple copy copy');
        await agGridVisualization.selectContextMenuOption('Unhide All Columns');

        // Then the visible indicator of "left" pin area of ag-grid "Simple copy copy" is on "Account Level"
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Simple copy copy'),
            'TC98727_3_03',
            'Show Hidden Column of Pinned Column'
        );

        // 4. hide frozen column (DE314569)
        // When I right click on elements "Profit" and select "Freeze Up to This Column" from ag-grid "Simple copy copy"
        await agGridVisualization.openContextMenuItemForHeader(
            'Profit',
            'Freeze Up to This Column',
            'Simple copy copy'
        );
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Simple copy copy'),
            'TC98727_3_04',
            'Freeze Up to Profit Column'
        );

        // When I right click on elements "Profit" and select "Hide Column" from ag-grid "Simple copy copy"
        await agGridVisualization.openContextMenuItemForHeader('Profit', 'Hide Column', 'Simple copy copy');
        await since('Header cell "Profit" in ag-grid "Simple copy copy" should not be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Profit', 'Simple copy copy').isExisting())
            .toBe(false);
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Simple copy copy'),
            'TC98727_3_05',
            'Hide Frozen Column_ Profit'
        );
        await dossierAuthoringPage.closeDossierWithoutSaving();
    });
});
