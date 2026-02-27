import setWindowSize from '../../../config/setWindowSize.js';
import { AGGridHideColumn, AGGrid_ZeroColumnWidth, gridUser, AGGrid_ResizeColumnHeader } from '../../../constants/grid.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';

describe('AG Grid - %-based, Min, Max Column Width (from GDC)', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };
    const tolerance = 3;

    let {
        loginPage,
        libraryPage,
        toc,
        contentsPanel,
        vizPanelForGrid,
        thresholdEditor,
        agGridVisualization,
        editorPanelForGrid,
        editorPanel,
        reportGridView,
        dossierAuthoringPage,
        baseFormatPanel,
        dossierPage,
        newFormatPanelForGrid,
        toolbar,
        grid,
        baseContainer,
        reportEditorPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {});

    it('[TC95080] sanity test on set min/max column size, reset column width', async () => {
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > HideColumn > % based column width
        await libraryPage.editDossierByUrl({
            projectId: AGGridHideColumn.project.id,
            dossierId: AGGridHideColumn.id,
        });
        // And Page "Simple" in chapter "Chapter 1" is the current page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Simple' });

        // # 1. verify that all column widths are evenly distributed (except for last column) when set to fit the container
        // And the grid cell in ag-grid "Simple" at "0", "1" has style "width" with value "173px"
        // And the grid cell in ag-grid "Simple" at "0", "3" has style "width" with value "173px"
        // And the grid cell in ag-grid "Simple" at "0", "4" has style "width" with value "173px"
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Simple'),
            'TC95080_01',
            'All columns are evenly distributed (except for last column) when set to fit the container'
        );

        // # 2. verify column header RMC context menu, "Reset Column width" is not avaiable, "Column Width Limit" is avaiable
        // When I right click on grid cell at "0", "1" from ag-grid "Simple"
        await reportGridView.openGridContextMenuByPos(0, 1);
        // Then The context menu should contain "Column Width Limit"
        await since(
            `After opening context menu on cell at "0", "1" from ag-grid "Simple", the context menu should contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Column Width Limit'))
            .toBe(true);
        // And The context menu should not contain "Reset Column Width"
        await since(
            `After opening context menu on cell at "0", "1" from ag-grid "Simple", the context menu should not contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Reset Column Widths'))
            .toBe(false);
        // And I click on column header element "Account" from ag-grid "Simple"
        await agGridVisualization.clickOnColumnHeaderElement('Account');

        // # 3. resize "Account Level" to the right for 100 px
        // When I resize column 2 in ag-grid visualization "Simple" 100 pixels to the "right"
        const columnWidth = await reportGridView.getGridCellStyleByPos(0, 1, 'width');
        const columnWidthInt = parseInt(columnWidth);
        await reportGridView.resizeColumnByMovingBorder('1', 100, 'right');
        const columnWidthNew = await reportGridView.getGridCellStyleByPos(0, 1, 'width');
        // remove px from columnWidthBefore and return int
        const columnWidthNewInt = parseInt(columnWidthNew);
        const expectedWidth = columnWidthInt + 100;
        const withinRange =
            columnWidthNewInt >= expectedWidth - tolerance && columnWidthNewInt <= expectedWidth + tolerance;
        await since(
            `After resize column by moving border, Column 2 is 100 pixels more, expect to be around ${expectedWidth} (between ${
                expectedWidth - tolerance
            } and ${expectedWidth + tolerance}), instead we have ${columnWidthNewInt}`
        )
            .expect(withinRange)
            .toBe(true);
        // Then the grid cell in ag-grid "Simple" at "0", "1" has style "width" with value "273px"
        // And the grid cell in ag-grid "Simple" at "0", "0" has style "width" with value "173px"
        // # the columns on the right of the "Account Level" evenly distributed again
        // And the grid cell in ag-grid "Simple" at "0", "3" has style "width" with value "152px"
        // And the grid cell in ag-grid "Simple" at "0", "4" has style "width" with value "152px"
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Simple'),
            'TC95080_02',
            'The columns on the right of the "Account Level" evenly distributed again'
        );
        // # 4. reset the column width
        // When I right click on element "Account Level" and select "Reset Column Widths" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Account Level', 'Reset Column Widths', 'Simple');
        await takeScreenshotByElement(vizPanelForGrid.getContainer('Simple'), 'TC95080_03', 'Reset Column Widths');
        // Then the grid cell in ag-grid "Simple" at "0", "1" has style "width" with value "173px"
        // And the grid cell in ag-grid "Simple" at "0", "3" has style "width" with value "173px"
        // And the grid cell in ag-grid "Simple" at "0", "4" has style "width" with value "173px"

        // # 5. set the max column width to 4 inches
        // When I right click on element "Account Level" and select "Column Width Limit" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Account Level', 'Column Width Limit', 'Simple');
        // Then the column limit editor is displayed
        // And the min column width limit is "0.5in" in column limit editor
        // And the max column width limit input box is empty
        // take screenshot of column limit editor
        await takeScreenshotByElement(
            agGridVisualization.columnLimitEditor,
            'TC95080_04',
            'Column limit editor, min:0.5in, max:empty'
        );
        // When I set the max column width limit as "4in" in column limit editor
        await agGridVisualization.setColumnLimitInputBox('max', '4in');
        // Then the max column width limit is "4in" in column limit editor
        // When I click on button "OK" in column limit editor
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');

        // # 6. resize "Account Level" to the right for 150 px
        // When I resize column 2 in ag-grid visualization "Simple" 150 pixels to the "right"
        const columnWidthBefore = await reportGridView.getGridCellStyleByPos(0, 1, 'width');
        const columnWidthBeforeInt = parseInt(columnWidthBefore);
        await reportGridView.resizeColumnByMovingBorder('1', 150, 'right');
        const columnWidthAfter = await reportGridView.getGridCellStyleByPos(0, 1, 'width');
        const columnWidthAfterInt = parseInt(columnWidthAfter);
        const expectedWidth2 = columnWidthBeforeInt + 150;
        const withinRange2 =
            columnWidthAfterInt >= expectedWidth2 - tolerance && columnWidthAfterInt <= expectedWidth2 + tolerance;
        await since(
            `After resize column by moving border, Column 2 is 150 pixels more, expect to be around ${expectedWidth2} (between ${
                expectedWidth2 - tolerance
            } and ${expectedWidth2 + tolerance}), instead we have ${columnWidthAfterInt}`
        )
            .expect(withinRange2)
            .toBe(true);
        // Then the grid cell in ag-grid "Simple" at "0", "1" has style "width" with value "323px"
        // And the grid cell in ag-grid "Simple" at "0", "0" has style "width" with value "173px"
        // And the grid cell in ag-grid "Simple" at "0", "3" has style "width" with value "142px"
        // And the grid cell in ag-grid "Simple" at "0", "4" has style "width" with value "142px"
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Simple'),
            'TC95080_05',
            'The columns on the right of the "Account Level" evenly distributed again'
        );

        // # 7. resize "Account Level" to the right for 150 px, which exceed the max column limit
        // When I resize column 2 in ag-grid visualization "Simple" 150 pixels to the "right"
        await reportGridView.resizeColumnByMovingBorder('1', 87, 'right');
        // await reportGridView.resizeColumnByMovingBorder('1', 50, 'right');
        const columnWidthAfter2 = await reportGridView.getGridCellStyleByPos(0, 1, 'width');
        const columnWidthAfterInt2 = parseInt(columnWidthAfter2);
        await since(
            'After resize column by moving border, Column 2 get the max column limit #{expected}, instead we have #{actual}'
        )
            .expect(columnWidthAfterInt2)
            .toBe(383);
        // Then the grid cell in ag-grid "Simple" at "0", "1" has style "width" with value "376px"
        // And the grid cell in ag-grid "Simple" at "0", "0" has style "width" with value "173px"
        // And the grid cell in ag-grid "Simple" at "0", "3" has style "width" with value "132px"
        // And the grid cell in ag-grid "Simple" at "0", "4" has style "width" with value "132px"
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Simple'),
            'TC95080_06',
            'The columns "Account Level" reach the max column limit 4in'
        );

        // set the min column width to 2 inches
        // When I right click on element "Account Level" and select "Column Width Limit" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Account Level', 'Column Width Limit', 'Simple');
        // Then the column limit editor is displayed
        // When I set the min column width limit as "2in" in column limit editor
        await agGridVisualization.setColumnLimitInputBox('min', '2in');
        // Then the min column width limit is "2in" in column limit editor
        // When I click on button "OK" in column limit editor
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');

        // # 9. resize "Account Level" to the left for 150 px, which reaches the min column limit
        // When I resize column 2 in ag-grid visualization "Simple" 150 pixels to the "left"
        await reportGridView.resizeColumnByMovingBorder('1', 100, 'left');
        await reportGridView.resizeColumnByMovingBorder('1', 90, 'left');
        const columnWidthAfter3 = await reportGridView.getGridCellStyleByPos(0, 1, 'width');
        const columnWidthAfterInt3 = parseInt(columnWidthAfter3);
        await since(
            'After resize column by moving border, Column 2 get the min column limit #{expected}, instead we have #{actual}'
        )
            .expect(columnWidthAfterInt3)
            .toBe(192);
        // Then the grid cell in ag-grid "Simple" at "0", "1" has style "width" with value "228px"
        // And the grid cell in ag-grid "Simple" at "0", "0" has style "width" with value "173px"
        // And the grid cell in ag-grid "Simple" at "0", "3" has style "width" with value "161px"
        // And the grid cell in ag-grid "Simple" at "0", "4" has style "width" with value "161px"
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Simple'),
            'TC95080_07',
            'The columns "Account Level" reach the min column limit 2in'
        );

        // # 10. set the min limit back to 0.5in, reset the column width
        // When I right click on element "Account Level" and select "Column Width Limit" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Account Level', 'Column Width Limit', 'Simple');
        // Then the column limit editor is displayed
        // When I set the min column width limit as "0.5in" in column limit editor
        await agGridVisualization.setColumnLimitInputBox('min', '0.5in');
        // Then the min column width limit is "0.5in" in column limit editor
        // When I click on button "OK" in column limit editor
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');
        // And I right click on element "Account Level" and select "Reset Column Widths" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Account Level', 'Reset Column Widths', 'Simple');
        // Then the grid cell in ag-grid "Simple" at "0", "0" has style "width" with value "173px"
        // And the grid cell in ag-grid "Simple" at "0", "1" has style "width" with value "173px"
        // And the grid cell in ag-grid "Simple" at "0", "3" has style "width" with value "173px"
        // And the grid cell in ag-grid "Simple" at "0", "4" has style "width" with value "173px"
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Simple'),
            'TC95080_08',
            'Reset Column Widths after set the min limit back to 0.5in'
        );
    });

    it('[TC95081_01] regression case: when all the columns reach their minimum limits, generate a horizontal scrollbar and layout is still fit to container', async () => {
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > HideColumn > % based column width
        await libraryPage.editDossierByUrl({
            projectId: AGGridHideColumn.project.id,
            dossierId: AGGridHideColumn.id,
        });
        // And Page "Simple" in chapter "Chapter 1" is the current page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Simple' });
        // # 1. set min column limit to 2in for all columns
        // When I right click on element "Account" and select "Column Width Limit" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Account', 'Column Width Limit', 'Simple');
        // Then the column limit editor is displayed
        // When I set the min column width limit as "2in" in column limit editor
        await agGridVisualization.setColumnLimitInputBox('min', '2in');
        // Then the min column width limit is "2in" in column limit editor
        // When I click on button "OK" in column limit editor
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');
        // Then the grid cell in ag-grid "Simple" at "0", "0" has style "width" with value "192px"

        // When I right click on element "Account Level" and select "Column Width Limit" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Account Level', 'Column Width Limit', 'Simple');
        // Then the column limit editor is displayed
        // When I set the min column width limit as "2in" in column limit editor
        await agGridVisualization.setColumnLimitInputBox('min', '2in');
        // Then the min column width limit is "2in" in column limit editor
        // When I click on button "OK" in column limit editor
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');
        // Then the grid cell in ag-grid "Simple" at "0", "1" has style "width" with value "192px"

        // When I right click on element "Account Executive" and select "Column Width Limit" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Account Executive', 'Column Width Limit', 'Simple');
        // Then the column limit editor is displayed
        // When I set the min column width limit as "2in" in column limit editor
        await agGridVisualization.setColumnLimitInputBox('min', '2in');
        // Then the min column width limit is "2in" in column limit editor
        // When I click on button "OK" in column limit editor
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');
        // Then the grid cell in ag-grid "Simple" at "0", "2" has style "width" with value "192px"

        // When I right click on element "Profit" and select "Column Width Limit" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Profit', 'Column Width Limit', 'Simple');
        // Then the column limit editor is displayed
        // When I set the min column width limit as "2in" in column limit editor
        await agGridVisualization.setColumnLimitInputBox('min', '2in');
        // Then the min column width limit is "2in" in column limit editor
        // When I click on button "OK" in column limit editor
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');
        // Then the grid cell in ag-grid "Simple" at "0", "3" has style "width" with value "192px"

        // When I right click on element "Forecast ($)" and select "Column Width Limit" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Forecast ($)', 'Column Width Limit', 'Simple');
        // Then the column limit editor is displayed
        // When I set the min column width limit as "2in" in column limit editor
        await agGridVisualization.setColumnLimitInputBox('min', '2in');
        // Then the min column width limit is "2in" in column limit editor
        // When I click on button "OK" in column limit editor
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');
        // Then the grid cell in ag-grid "Simple" at "0", "4" has style "width" with value "192px"

        // When I right click on element "Maintenance ($)" and select "Column Width Limit" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Maintenance ($)', 'Column Width Limit', 'Simple');
        // Then the column limit editor is displayed
        // When I set the min column width limit as "2in" in column limit editor
        await agGridVisualization.setColumnLimitInputBox('min', '2in');
        // Then the min column width limit is "2in" in column limit editor
        // When I click on button "OK" in column limit editor
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');
        // Then the grid cell in ag-grid "Simple" at "0", "5" has style "width" with value "192px"

        // When I right click on element "Parts ($)" and select "Column Width Limit" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Parts ($)', 'Column Width Limit', 'Simple');
        // Then the column limit editor is displayed
        // When I set the min column width limit as "2in" in column limit editor
        await agGridVisualization.setColumnLimitInputBox('min', '2in');
        // Then the min column width limit is "2in" in column limit editor
        // When I click on button "OK" in column limit editor
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');
        // Then the grid cell in ag-grid "Simple" at "0", "6" has style "width" with value "192px"

        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Simple'),
            'TC95081_01_01',
            'All columns reach their min limits, generate a horizontal scrollbar'
        );

        // # 2. horizonal scrollbar appears on grid
        // When I scroll ag-grid "Simple" 200 pixels to the "right"
        await agGridVisualization.scrollHorizontally('right', 200, 'Simple');
        // Then the grid cell in ag-grid "Simple" at "0", "6" has text "Parts ($)"
        await since('The grid cell at "0", "6" should have text #{expected}", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 6))
            .toBe('Parts ($)');

        // # 3. verify the grid layout, it should still be fit to container
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();

        // And I expand "Spacing" section
        await newFormatPanelForGrid.expandSpacingSection();
        // Then the current grid column size is "Fit to Container" under Spacing section
        await since('The current grid column size should be "Fit to Container"')
            .expect(await newFormatPanelForGrid.getCurrentColumnSizeFit('Fit to Container').isDisplayed())
            .toBe(true);
    });

    it('[TC95081_02] regression case: when all the columns reach their max limits, there might be white space at the end, layout is still fit to container', async () => {
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > HideColumn > % based column width
        await libraryPage.editDossierByUrl({
            projectId: AGGridHideColumn.project.id,
            dossierId: AGGridHideColumn.id,
        });
        // And Page "Simple" in chapter "Chapter 1" is the current page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Simple' });
        // # 1. set max column limit to 1in for all columns
        // When I right click on element "Account" and select "Column Width Limit" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Account', 'Column Width Limit', 'Simple');
        // Then the column limit editor is displayed
        // When I set the max column width limit as "1in" in column limit editor
        await agGridVisualization.setColumnLimitInputBox('max', '1in');
        // Then the max column width limit is "1in" in column limit editor
        // When I click on button "OK" in column limit editor
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');
        // Then the grid cell in ag-grid "Simple" at "0", "0" has style "width" with value "192px"

        // When I right click on element "Account Level" and select "Column Width Limit" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Account Level', 'Column Width Limit', 'Simple');
        // Then the column limit editor is displayed
        // When I set the max column width limit as "1in" in column limit editor
        await agGridVisualization.setColumnLimitInputBox('max', '1in');
        // Then the max column width limit is "1in" in column limit editor
        // When I click on button "OK" in column limit editor
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');
        // Then the grid cell in ag-grid "Simple" at "0", "1" has style "width" with value "192px"

        // When I right click on element "Account Executive" and select "Column Width Limit" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Account Executive', 'Column Width Limit', 'Simple');
        // Then the column limit editor is displayed
        // When I set the max column width limit as "1in" in column limit editor
        await agGridVisualization.setColumnLimitInputBox('max', '1in');
        // Then the max column width limit is "1in" in column limit editor
        // When I click on button "OK" in column limit editor
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');
        // Then the grid cell in ag-grid "Simple" at "0", "2" has style "width" with value "192px"

        // When I right click on element "Profit" and select "Column Width Limit" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Profit', 'Column Width Limit', 'Simple');
        // Then the column limit editor is displayed
        // When I set the max column width limit as "1in" in column limit editor
        await agGridVisualization.setColumnLimitInputBox('max', '1in');
        // Then the max column width limit is "1in" in column limit editor
        // When I click on button "OK" in column limit editor
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');
        // Then the grid cell in ag-grid "Simple" at "0", "3" has style "width" with value "192px"

        // When I right click on element "Forecast ($)" and select "Column Width Limit" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Forecast ($)', 'Column Width Limit', 'Simple');
        // Then the column limit editor is displayed
        // When I set the max column width limit as "1in" in column limit editor
        await agGridVisualization.setColumnLimitInputBox('max', '1in');
        // Then the max column width limit is "1in" in column limit editor
        // When I click on button "OK" in column limit editor
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');
        // Then the grid cell in ag-grid "Simple" at "0", "4" has style "width" with value "192px"

        // When I right click on element "Maintenance ($)" and select "Column Width Limit" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Maintenance ($)', 'Column Width Limit', 'Simple');
        // Then the column limit editor is displayed
        // When I set the max column width limit as "1in" in column limit editor
        await agGridVisualization.setColumnLimitInputBox('max', '1in');
        // Then the max column width limit is "1in" in column limit editor
        // When I click on button "OK" in column limit editor
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');
        // Then the grid cell in ag-grid "Simple" at "0", "5" has style "width" with value "192px"

        // When I right click on element "Parts ($)" and select "Column Width Limit" from ag-grid "Simple"
        await agGridVisualization.openContextMenuItemForHeader('Parts ($)', 'Column Width Limit', 'Simple');
        // Then the column limit editor is displayed
        // When I set the max column width limit as "1in" in column limit editor
        await agGridVisualization.setColumnLimitInputBox('max', '1in');
        // Then the max column width limit is "1in" in column limit editor
        // When I click on button "OK" in column limit editor
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');
        // Then the grid cell in ag-grid "Simple" at "0", "6" has style "width" with value "192px"

        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Simple'),
            'TC95081_02_01',
            'All columns reach their max limits, there might be white space at the end'
        );

        // # 2. verify the grid layout, it should still be fit to container
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I expand "Spacing" section
        await newFormatPanelForGrid.expandSpacingSection();
        // Then the current grid column size is "Fit to Container" under Spacing section
        await since('The current grid column size should be "Fit to Container"')
            .expect(await newFormatPanelForGrid.getCurrentColumnSizeFit('Fit to Container').isDisplayed())
            .toBe(true);
    });

    it('[TC95081_03] regression x-fun cases', async () => {
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid > HideColumn > % based column width
        await libraryPage.editDossierByUrl({
            projectId: AGGridHideColumn.project.id,
            dossierId: AGGridHideColumn.id,
        });
        // When I switch to page "Simple with limits" in chapter "Chapter 2" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Simple with limits' });
        // Then Page "Simple with limits" in chapter "Chapter 2" is the current page
        // And the grid cell in ag-grid "Simple with limits" at "0", "1" has style "width" with value "172px"
        // And the grid cell in ag-grid "Simple with limits" at "0", "2" has style "width" with value "480px"
        // And the grid cell in ag-grid "Simple with limits" at "0", "3" has style "width" with value "96px"
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Simple with limits'),
            'TC95081_03_01',
            'Initial column width'
        );
        // click container to make sure it's selected
        await agGridVisualization.clickOnContainerTitle('Simple with limits');

        // # 1. change the column size to fit to content or fixed, the set column limit option should not avaiable
        // # the feature only avaiable for fit to container
        // When I switch to the Format Panel tab
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        // And I expand "Spacing" section
        await newFormatPanelForGrid.expandSpacingSection();
        // And I change ag-grid column size fit to "Fit to Content" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Content');
        // Then the current grid column size is "Fit to Content" under Spacing section
        await since('The current grid column size should be "Fit to Content"')
            .expect(await newFormatPanelForGrid.getCurrentColumnSizeFit('Fit to Content').isDisplayed())
            .toBe(true);
        // When I right click on grid cell at "0", "2" from ag-grid "Simple with limits"
        await reportGridView.openGridContextMenuByPos(0, 2);
        // Then The context menu should not contain "Reset Column Width"
        await since(
            `After opening context menu on cell at "0", "2" from ag-grid "Simple with limits", the context menu should not contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Reset Column Widths'))
            .toBe(false);
        // And The context menu should not contain "Column Width Limit"
        await since(
            `After opening context menu on cell at "0", "2" from ag-grid "Simple with limits", the context menu should not contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Column Width Limit'))
            .toBe(false);
        // And I click on column header element "Account" from ag-grid "Simple with limits"
        await agGridVisualization.clickOnColumnHeaderElement('Account');
        // When I switch to microcharts tab in Format Panel
        await newFormatPanelForGrid.switchToTab('microcharts');
        // And I change ag-grid column size fit to "Fixed" under Spacing section
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fixed');
        // Then the current grid column size is "Fixed" under Spacing section
        await since('The current grid column size should be "Fixed"')
            .expect(await newFormatPanelForGrid.getCurrentColumnSizeFit('Fixed').isDisplayed())
            .toBe(true);
        // When I right click on grid cell at "0", "2" from ag-grid "Simple with limits"
        await reportGridView.openGridContextMenuByPos(0, 2);
        // Then The context menu should not contain "Reset Column Width"
        await since(
            `After opening context menu on cell at "0", "2" from ag-grid "Simple with limits", the context menu should not contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Reset Column Widths'))
            .toBe(false);
        // And The context menu should not contain "Column Width Limit"
        await since(
            `After opening context menu on cell at "0", "2" from ag-grid "Simple with limits", the context menu should not contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Column Width Limit'))
            .toBe(false);
        // And I click on column header element "Account" from ag-grid "Simple with limits"
        await agGridVisualization.clickOnColumnHeaderElement('Account');

        // # 2. duplicate ag grid
        await libraryPage.editDossierByUrl({
            projectId: AGGridHideColumn.project.id,
            dossierId: AGGridHideColumn.id,
        });
        // When I switch to page "Simple with limits" in chapter "Chapter 2" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Simple with limits' });

        // When I duplicate container "Simple with limits" through the context menu
        await agGridVisualization.duplicateContainer('Simple with limits');
        // Then The container "Simple with limits copy" should be selected
        await since('The container "Simple with limits copy" should be selected')
            .expect(await grid.isContainerSelected('Simple with limits copy'))
            .toBe(true);
        // When I delete container "Simple with limits" through the context menu
        await agGridVisualization.deleteContainer('Simple with limits');
        // Then The container "Simple with limits" should be deleted

        // # verify the width for duplicated ag grid
        // And the grid cell in ag-grid "Simple with limits copy" at "0", "1" has style "width" with value "172px"
        // And the grid cell in ag-grid "Simple with limits copy" at "0", "2" has style "width" with value "480px"
        // And the grid cell in ag-grid "Simple with limits copy" at "0", "3" has style "width" with value "96px"
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Simple with limits copy'),
            'TC95081_03_02',
            'Duplicated ag grid'
        );

        // # 3. convert ag grid to normal grid or compound grid, column width format and RMC options should be gone
        // When I change visualization "Simple with limits copy" to "Grid" from context menu
        await baseContainer.changeViz('Grid', 'Simple with limits copy', true);
        // Then the grid cell in visualization "Simple with limits copy" at "1", "3" has style "width" with value "164.695px"

        // When I right click on element "Account" from visualization "Simple with limits copy" to open context menu
        await vizPanelForGrid.rightClick({
            elem: await vizPanelForGrid.getGridObject('Account', 'Simple with limits copy'),
            checkClickable: false,
        });
        // Then The context menu should not contain "Reset Column Width"
        await since(
            `After opening context menu on element "Account" from visualization "Simple with limits copy", the context menu should not contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Reset Column Widths'))
            .toBe(false);
        // And The context menu should not contain "Column Width Limit"
        await since(
            `After opening context menu on element "Account" from visualization "Simple with limits copy", the context menu should not contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Column Width Limit'))
            .toBe(false);

        // When I select "Undo" from toolbar
        await toolbar.clickButtonFromToolbar('Undo');
        await toolbar.waitForElementInvisible(dossierAuthoringPage.getMojoLoadingIndicator());
        // Then the grid cell in ag-grid "Simple with limits copy" at "0", "2" has style "width" with value "480px"
        // take screenshot
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Simple with limits copy'),
            'TC95081_03_03',
            'Undo to ag grid, column width format should be back'
        );

        // When I change visualization "Simple with limits copy" to "Compound Grid" from context menu
        await baseContainer.changeViz('Compound Grid', 'Simple with limits copy', true);
        // Then the grid cell in visualization "Simple with limits copy" at "1", "3" has style "width" with value "164.695px"
        // When I right click on element "Account" from visualization "Simple with limits copy" to open context menu
        await vizPanelForGrid.rightClick({
            elem: await vizPanelForGrid.getGridObject('Account', 'Simple with limits copy'),
            checkClickable: false,
        });
        // Then The context menu should not contain "Reset Column Width"
        await since(
            `After opening context menu on element "Account" from visualization "Simple with limits copy", the context menu should not contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Reset Column Widths'))
            .toBe(false);
        // And The context menu should not contain "Column Width Limit"
        await since(
            `After opening context menu on element "Account" from visualization "Simple with limits copy", the context menu should not contain #{expected}, instead we have #{actual}`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Column Width Limit'))
            .toBe(false);
    });

    it('[TC95081_04] Change column width should be persist after saving and reopening', async () => {
        await libraryPage.editDossierByUrl({
            projectId: AGGrid_ZeroColumnWidth.project.id,
            dossierId: AGGrid_ZeroColumnWidth.id,
        });
        await agGridVisualization.clickOnContainerTitle('Scorecard (Net of Fees)');
        // resize column 'One Month' to 0 px
        await reportGridView.resizeColumnByMovingBorderMultiLayer('1', '7', 120, 'left');
        // save and open
        await dossierAuthoringPage.saveAndOpen();
        await dossierPage.waitForDossierLoading();
        await browser.pause(10000);
        await dossierPage.hidePageIndicator();
        // take screenshot 
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Scorecard (Net of Fees)'),
            'TC95081_04_01',
            'After changing column width'
        );
        // Change back column width
        await dossierPage.clickEditIcon();
        await reportGridView.resizeColumnByMovingBorderMultiLayer('1', '7', 120, 'right');
        // save and open
        await dossierAuthoringPage.saveAndOpen();

    });

    it('[BCIN-7338] Resize the 2nd layer column header should be kept', async () => {
        await resetDossierState({
            credentials: gridUser,
            dossier: AGGrid_ResizeColumnHeader,
        });
        await libraryPage.openDossierById({
            projectId: AGGrid_ResizeColumnHeader.project.id,
            dossierId: AGGrid_ResizeColumnHeader.id,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Fix' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Hide RowHeader - F2W'),
            'BCIN-7338_01',
            'The column header is displayed correctly for grid with the 2nd layer column header resized'
        );
        //resize the browser window
        await browser.setWindowSize(1500, 1200);
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Hide RowHeader - F2W'),
            'BCIN-7338_02',
            'The column header is displayed correctly after resizing the browser window'
        );
        // go to edit mode
        await dossierPage.clickEditIcon();
        // reset column width from context menu
        await agGridVisualization.openContextMenuItemForHeader('Quarter', 'Reset Column Widths', 'Hide RowHeader - F2W');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Hide RowHeader - F2W'),
            'BCIN-7338_03',
            'The column header is displayed correctly after resetting column width'
        );
        // resize the column header of 2nd layer column
        await reportGridView.resizeColumnByMovingBorderMultiLayer('1', '2', 400, 'left');
        // check the context menu should have reset column width option after resizing the 2nd layer column header
        await reportGridView.openGridContextMenuByPos(0, 0);
        await since(
            `The context menu should contain 'Reset Column Widths'`
        )
            .expect(await reportEditorPanel.contextMenuContainsOption('Reset Column Widths'))
            .toBe(true);
        await reportGridView.resizeColumnByMovingBorderMultiLayer('1', '9', 50, 'left');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Hide RowHeader - F2W'),
            'BCIN-7338_04',
            'The column header is displayed correctly after resize the 2nd layer column header in authoring mode'
        );
        //resize the browser window
        await browser.setWindowSize(1600, 1200);
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Hide RowHeader - F2W'),
            'BCIN-7338_05',
            'The column header is displayed correctly after resizing the browser window in authoring mode'
        );

    });
});
