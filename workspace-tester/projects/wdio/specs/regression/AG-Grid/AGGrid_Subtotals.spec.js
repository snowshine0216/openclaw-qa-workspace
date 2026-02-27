import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import resetDossierState from '../../../api/resetDossierState.js';

describe('[AG Grid Subtotals]', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        formatPanel,
        contentsPanel,
        agGridVisualization,
        toc,
        dossierPage,
        loadingDialog,
        editorPanelForGrid,
        editorPanel,
        vizPanelForGrid,
        baseFormatPanel,
        newFormatPanelForGrid,
        baseFormatPanelReact,
        dashboardSubtotalsEditor,
    } = browsers.pageObj1;


    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        if (await dossierPage.isAccountIconPresent()) {
            await dossierPage.openUserAccountMenu();
            await dossierPage.logout();
            await dossierPage.sleep(2000);
        } else {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
    });

    afterEach(async () => {

    });

    it('[TC76157] Validate Subtotals for AG Grid with 3 Attributes in Rows and 2 Metrics in Columns', async () => {
        await loginPage.login(gridConstants.gridUser);
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Subtotals.project.id,
            dossierId: gridConstants.AGGrid_Subtotals.id,
        });

        // Switch to "Page 1" in "Chapter 2"
        await contentsPanel.goToPage({ chapterName: 'TC2696', pageName: 'Page 1' });

        // Step 2: Show subtotals
        await agGridVisualization.toggleShowTotalsByContextMenu('Visualization 1');
        await since('The grid cell at row 2, column 1 should have text "Total"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Total');
        await since('The grid cell at row 2, column 4 should have text "$165,880,424"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 4, 'Visualization 1'))
            .toBe('$165,880,424');
        await since('The grid cell at row 2, column 5 should have text "$246,389,148"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('$246,389,148');

        // Step 3: Remove subtotals from the first attribute
        await agGridVisualization.toggleShowTotalsFromAttribute('Month', 'Visualization 1', 'Total');
        await since('The grid cell at row 2, column 1 should have text "Jan"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Jan');
        await since('The grid cell at row 2, column 4 should have text "$12,538,995"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 4, 'Visualization 1'))
            .toBe('$12,538,995');
        await since('The grid cell at row 2, column 5 should have text "$18,572,183"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('$18,572,183');
        await since('The grid cell at row 3, column 2 should have text "Action Movies"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Action Movies');

        // Step 4: Add other totals for the second attribute
        await agGridVisualization.toggleShowTotalsFromAttribute(
            'Item Category',
            'Visualization 1',
            'Average,Maximum,Minimum,Mode'
        );
        await since('The grid cell at row 2, column 2 should have text "Total"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('Total');
        await since('The grid cell at row 3, column 2 should have text "Average"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Average');
        await since('The grid cell at row 3, column 4 should have text "$125,390"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'Visualization 1'))
            .toBe('$125,390');
        await since('The grid cell at row 4, column 2 should have text "Maximum"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'Visualization 1'))
            .toBe('Maximum');
        await since('The grid cell at row 4, column 4 should have text "$389,333"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'Visualization 1'))
            .toBe('$389,333');
        await since('The grid cell at row 5, column 2 should have text "Minimum"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 2, 'Visualization 1'))
            .toBe('Minimum');
        await since('The grid cell at row 5, column 4 should have text "$15,709"')
            .expect(await agGridVisualization.getGridCellTextByPosition(5, 4, 'Visualization 1'))
            .toBe('$15,709');
        await since('The grid cell at row 6, column 2 should have text "Mode"')
            .expect(await agGridVisualization.getGridCellTextByPosition(6, 2, 'Visualization 1'))
            .toBe('Mode');

        // Step 5: Toggle show totals from metric context menu (remove totals)
        await agGridVisualization.openContextSubMenuItemForHeader('Cost', 'Show Totals', null, 'Visualization 1');

        await since('The grid cell at row 2, column 1 should have text "Jan"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Jan');
        await since('The grid cell at row 2, column 4 should have text "$22,386"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 4, 'Visualization 1'))
            .toBe('$22,386');

        // Step 6: Click on show totals again
        await agGridVisualization.openContextSubMenuItemForHeader('Cost', 'Show Totals', null, 'Visualization 1');
        await since('The grid cell at row 2, column 2 should have text "Total"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('Total');
        await since('The grid cell at row 8, column 3 should have text "20th Century Fox"')
            .expect(await agGridVisualization.getGridCellTextByPosition(8, 3, 'Visualization 1'))
            .toBe('20th Century Fox');

        // Step 7: Move totals to the bottom
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(
            2,
            2,
            'Visualization 1',
            'Move to bottom'
        );

        await since('The grid cell at row 8, column 3 should have text "Total"')
            .expect(await agGridVisualization.getGridCellTextByPosition(8, 3, 'Visualization 1'))
            .toBe('Total');
        await since('The grid cell at row 8, column 4 should have text "$907,249"')
            .expect(await agGridVisualization.getGridCellTextByPosition(8, 4, 'Visualization 1'))
            .toBe('$907,249');

        await editorPanel.switchToEditorPanel();
        await editorPanelForGrid.removeFromDropZone('Supplier', 'Rows');
        await vizPanelForGrid.dragDSObjectToColumnSetDZwithPosition(
            'Supplier',
            'attribute',
            'retail-sample-data.xls',
            'Column Set 1',
            'above',
            'Cost'
        );
        await agGridVisualization.scrollHorizontally('right', 3000, 'Visualization 1');
        await agGridVisualization.scrollHorizontally('right', 3000, 'Visualization 1');
        await agGridVisualization.scrollHorizontally('right', 3000, 'Visualization 1');

        await agGridVisualization.openContextSubMenuItemForHeader('Total', 'Move to left', null, 'Visualization 1');
        // Step 9: Move totals to the left
        await agGridVisualization.scrollHorizontally('left', 3000, 'Visualization 1');
        await agGridVisualization.scrollHorizontally('left', 3000, 'Visualization 1');
        await agGridVisualization.scrollHorizontally('left', 3000, 'Visualization 1');

        await since('The grid cell at row 3, column 1 should have text "Jan"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Jan');
        await since('The grid cell at row 3, column 2 should have text "Action Movies"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Action Movies');
        await since('The grid cell at row 3, column 3 should have text "$907,249"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('$907,249');
        await since('The grid cell at row 3, column 4 should have text "$1,308,419"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'Visualization 1'))
            .toBe('$1,308,419');

        // Step 10: Format subtotal values
        await formatPanel.switchToFormatPanel();
        // And I switch to the General Settings section on new format panel
        await baseFormatPanelReact.switchToGeneralSettingsTab();
        // * I expand "Layout" section
        await newFormatPanelForGrid.expandLayoutSection();
        // change arrangement to "Flat"
        // await newFormatPanelForGrid.setArrangement('Flat');
        await newFormatPanelForGrid.switchToTextFormatTab();

        await agGridVisualization.moveMouse(50, 0);
        await since('The segment control dropdown should be "Entire Grid" in the new format panel')
            .expect(await newFormatPanelForGrid.gridSegmentDropDown.getText())
            .toBe('Entire Grid');
        await newFormatPanelForGrid.selectGridSegment('Subtotal Values');
        await since('The segment control dropdown should be "Subtotal Values" in the new format panel')
            .expect(await newFormatPanelForGrid.gridSegmentDropDown.getText())
            .toBe('Subtotal Values');
        await since('The checkbox for "Same as Values" is unchecked in the new format panel')
            .expect(await newFormatPanelForGrid.isCheckBoxChecked('Same as Values'))
            .toBeFalse();

        await since(
            'The grid cell at row 3, column 1 should have style "font-family" with value  #{expected}, instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellStyle(3, 1, 'Visualization 1', 'font-family'))
            .toBe('open sans');
        await since(
            'The grid cell at row 3, column 3 should have style "font-family" with value #{expected}, instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellStyle(3, 3, 'Visualization 1', 'font-family'))
            .toBe('open sans');

        await newFormatPanelForGrid.selectTextFont('Noto Sans');
        await browser.pause(20000);
        await since(
            'The grid cell at row 3, column 3 should have style "font-family" with value  #{expected}, instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellStyle(3, 3, 'Visualization 1', 'font-family'))
            .toBe('noto sans');

        // Step 11: Subtotal row headers should be unchecked
        await newFormatPanelForGrid.selectGridSegment('Subtotal Row Headers');
        await since('The checkbox for "Same as Row Headers" is unchecked in the new format panel')
            .expect(await newFormatPanelForGrid.isCheckBoxChecked('Same as Row Headers'))
            .toBeFalse();

        // Step 12: Formatting subtotal headers should be the same as normal row headers
        await newFormatPanelForGrid.selectFontAlign('center');
        await since('The grid cell at row 27, column 2 should have style "text-align" with value "center"')
            .expect(await agGridVisualization.getGridCellStyle(27, 2, 'Visualization 1', 'text-align'))
            .toBe('center');

        await newFormatPanelForGrid.selectTextFont('Oleo Script');
        await browser.pause(20000);

        await since(
            'The grid cell at row 27, column 2 should have style "font-family" with value  #{expected}, instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellStyle(27, 2, 'Visualization 1', 'font-family'))
            .toBe('oleo script');

        await newFormatPanelForGrid.setTextFontSize('28');
        await since(
            'The grid cell at row 27, column 2 should have style "font-size" with value with value #{expected}, instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellStyle(27, 2, 'Visualization 1', 'font-size'))
            .toBe('37.33px');

        await newFormatPanelForGrid.clickCheckBox('Same as Row Headers');
        await since('The checkbox for "Same as Row Headers" is checked in the new format panel')
            .expect(await newFormatPanelForGrid.isCheckBoxChecked('Same as Row Headers'))
            .toBeTrue();
        await since('The font and cells section in the new format panel is hidden')
            .expect(await newFormatPanelForGrid.cellsSection.isExisting())
            .toBeFalse();
        await since(
            'The grid cell at row 27, column 2 should have style "font-family" with value  #{expected}, instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellStyle(27, 2, 'Visualization 1', 'font-family'))
            .toBe('open sans');
        await since(
            'The grid cell at row 27, column 2 should have style "font-size" with value #{expected}, instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellStyle(27, 2, 'Visualization 1', 'font-size'))
            .toBe('10.67px');
        await since('The grid cell at row 27, column 2 should have style "text-align" with value "left"')
            .expect(await agGridVisualization.getGridCellStyle(27, 2, 'Visualization 1', 'text-align'))
            .toBe('left');

        // Verify values are unaffected
        await since(
            'The grid cell at row 3, column 3 should have style "font-family" with value  #{expected}, instead we have #{actual}'
        )
            .expect(await agGridVisualization.getGridCellStyle(3, 3, 'Visualization 1', 'font-family'))
            .toBe('noto sans');

        // Step 13: Toggle format panel visibility
        await formatPanel.disableFormatPanel();
        await browser.pause(2000);
        await since('The format panel is hidden')
            .expect(await baseFormatPanel.formatPanelTab.isExisting())
            .toBeFalse();

        await formatPanel.enableFormatPanel();
        await browser.pause(2000);
        await since('The format panel is shown')
            .expect(await baseFormatPanel.formatPanelTab.isExisting())
            .toBeTrue();

        await newFormatPanelForGrid.switchToTextFormatTab();
        await agGridVisualization.moveMouse(50, 0);

        await since('The checkbox for "Same as Row Headers" is checked in the new format panel')
            .expect(await newFormatPanelForGrid.isCheckBoxChecked('Same as Row Headers'))
            .toBeTrue();
        await since('The font and cells section in the new format panel is hidden')
            .expect(await newFormatPanelForGrid.cellsSection.isExisting())
            .toBeFalse();

        await newFormatPanelForGrid.selectGridSegment('Subtotal Values');
        await browser.pause(5000);
        await since('The checkbox for "Same as Values" is unchecked in the new format panel')
            .expect(await newFormatPanelForGrid.isCheckBoxChecked('Same as Values'))
            .toBeFalse();

        await since('The font and cells section in the new format panel is visible')
            .expect(await newFormatPanelForGrid.cellsSection.isExisting())
            .toBeTrue();
    });

    it('[TC76159_1] Validate Subtotals for Multiple Attributes in AG Grid', async () => {
        await loginPage.login(gridConstants.gridUser);
        // Step 1: Switch to "Grid 1" in "TC55031"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Subtotals.project.id,
            dossierId: gridConstants.AGGrid_Subtotals.id,
        });

        await contentsPanel.goToPage({ chapterName: 'TC55031', pageName: 'Grid 1' });

        // Step 2: Enable subtotals for "Month"
        await agGridVisualization.toggleShowTotalsFromAttribute('Month', 'Visualization 1', 'Total');

        // Step 3: Enable subtotals for "Supplier"
        await agGridVisualization.toggleShowTotalsFromAttribute('Supplier', 'Visualization 1', 'Average');

        // Step 4: Enable subtotals for "Item Category"
        await agGridVisualization.toggleShowTotalsFromAttribute('Item Category', 'Visualization 1', 'Maximum');

        // Step 5: Verify grid cell values
        await since('The grid cell at row 2, column 1 should have text "Total"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Total');
        await since('The grid cell at row 2, column 4 should have text "$165,880,424"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 4, 'Visualization 1'))
            .toBe('$165,880,424');
        await since('The grid cell at row 2, column 5 should have text "$246,389,148"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('$246,389,148');

        await since('The grid cell at row 3, column 2 should have text "Average"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Average');
        await since('The grid cell at row 3, column 4 should have text "$125,390"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'Visualization 1'))
            .toBe('$125,390');
        await since('The grid cell at row 3, column 5 should have text "$185,722"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 5, 'Visualization 1'))
            .toBe('$185,722');

        await since('The grid cell at row 4, column 3 should have text "Maximum"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'Visualization 1'))
            .toBe('Maximum');
        await since('The grid cell at row 4, column 4 should have text "$152,035"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'Visualization 1'))
            .toBe('$152,035');
        await since('The grid cell at row 4, column 5 should have text "$231,490"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 5, 'Visualization 1'))
            .toBe('$231,490');
    });

    it('[TC76159_2] Validate Attributes and Subtotals in AG Grid', async () => {
        await loginPage.login(gridConstants.gridUser);
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Subtotals.project.id,
            dossierId: gridConstants.AGGrid_Subtotals.id,
        });

        // Step 1: Switch to "Grid 3" in "TC55031"
        await contentsPanel.goToPage({ chapterName: 'TC55031', pageName: 'Grid 3' });

        // Step 2: Verify initial grid cell values
        await since('The grid cell at row 3, column 1 should have text "Jan"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Jan');
        await since('The grid cell at row 3, column 3 should have text "$22,386"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('$22,386');
        await since('The grid cell at row 3, column 4 should have text "$34,854"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'Visualization 1'))
            .toBe('$34,854');

        // Step 3: Enable subtotals for "Month"
        await agGridVisualization.toggleShowTotalsFromAttribute('Month', 'Visualization 1', 'Total');
        await since('The grid cell at row 3, column 1 should have text "Total"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Total');
        await since('The grid cell at row 3, column 3 should have text "$10,719,702"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'Visualization 1'))
            .toBe('$10,719,702');
        await since('The grid cell at row 3, column 4 should have text "$15,897,317"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'Visualization 1'))
            .toBe('$15,897,317');

        // Step 4: Enable subtotals for "Supplier"
        await agGridVisualization.toggleShowTotalsFromAttribute('Supplier', 'Visualization 1', 'Average');
        await since('The grid cell at row 4, column 2 should have text "Average"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'Visualization 1'))
            .toBe('Average');
        await since('The grid cell at row 4, column 3 should have text "$151,208"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 3, 'Visualization 1'))
            .toBe('$151,208');
        await since('The grid cell at row 4, column 4 should have text "$218,070"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'Visualization 1'))
            .toBe('$218,070');

        // Step 5: Enable subtotals for "Item Category"
        await agGridVisualization.toggleShowTotalsFromAttribute('Item Category', 'Visualization 1', 'Maximum');

        // Step 6: Scroll to the right to handle column virtualization
        await agGridVisualization.scrollHorizontally('right', 3000, 'Visualization 1');
        await agGridVisualization.scrollHorizontally('right', 3000, 'Visualization 1');
        await agGridVisualization.scrollHorizontally('right', 3000, 'Visualization 1');
        // Step 7: Verify the "Maximum" header is present
        await since('The header cell "Maximum" in ag-grid "Visualization 1" should be present')
            .expect(await agGridVisualization.getGroupHeaderCell('Maximum', 'Visualization 1').isExisting())
            .toBeTrue();

        // Step 1: Switch to "Grid 7" in "TC55031"
        await contentsPanel.goToPage({ chapterName: 'TC55031', pageName: 'Grid 7' });

        // Step 2: Verify initial grid cell values
        await since('The grid cell at row 2, column 1 should have text "Jan"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Jan');
        await since('The grid cell at row 2, column 2 should have text "$12,538,995"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('$12,538,995');

        // Step 3: Enable subtotals for "Month"
        await agGridVisualization.toggleShowTotalsFromAttribute('Month', 'Visualization 1', 'Total');

        // Step 4: Verify grid cell values after enabling subtotals
        await since('The grid cell at row 2, column 1 should have text "Total"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Total');
        await since('The grid cell at row 2, column 2 should have text "$165,880,424"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Visualization 1'))
            .toBe('$165,880,424');
    });

    it('[TC76159_3] Validate Calculation Methods and Attribute Forms in AG Grid', async () => {
        await loginPage.login(gridConstants.gridUser);
        // Step 1: Open the dossier by its ID
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_DE281317.project.id,
            dossierId: gridConstants.AGGrid_DE281317.id,
        });

        // Step 8: Switch to "modern grid" in "Chapter 1"
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'modern grid' });
        await editorPanel.switchToEditorPanel();

        // Step 9: Enable subtotal "Average" for attribute "Subcategory"
        await editorPanelForGrid.createSubtotalsFromEditorPanel('Subcategory', 'attribute', 'Average');
        await browser.pause(2000);
        await since('The grid cell at row 3, column 1 should have text "Books (Average)"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'modern'))
            .toBe('Books (Average)');
        await since('The grid cell at row 3, column 3 should have text "$345,136"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'modern'))
            .toBe('$345,136');

        // Step 10: Turn on ID form for attribute "Category"
        await editorPanelForGrid.openDisplayAttributeFormsMenu('Category', 'attribute');
        await since('Display form "ID" should not be selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBeFalse();
        await since('Display form "DESC" should be selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBeTrue();
        await editorPanelForGrid.multiSelectDisplayForms('ID');
        await since('The grid cell at row 3, column 1 should have text "Books 1 (Average)"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'modern'))
            .toBe('Books 1 (Average)');
        await since('The grid cell at row 3, column 4 should have text "$345,136"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'modern'))
            .toBe('$345,136');
        await since('The grid cell at row 10, column 1 should have text "Electronics 2 (Average)"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 1, 'modern'))
            .toBe('Electronics 2 (Average)');
    });

    it('[TC76159_4] Validate subtotals edit entry', async () => {
        await loginPage.login(gridConstants.gridUser);
        // C41039104E4267E2B9CB868BF56DA9AD AGGrid Custom Subtotal
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Custom_Subtotals.project.id,
            dossierId: gridConstants.AGGrid_Custom_Subtotals.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'sanity' });
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        // context menu for attribute/metric in dropzone
        await editorPanel.switchToEditorPanel();
        await editorPanelForGrid.rightClickOnEditorPanel('Airline Name');
        // take screenshot of context menu
        await takeScreenshotByElement(
            await editorPanelForGrid.common.contextMenu,
            'TC76159_4_1',
            '"Edit Totals..." should shown in context menu for attribute in dropzone' 
        );
        // dismiss context menu
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        await editorPanelForGrid.rightClickOnEditorPanel('Flights Cancelled');
        // assert that "Edit Totals..." is not shown in context menu for metric in dropzone
        since('"Edit Totals..." should show in context menu for metric in dropzone')
            .expect(await editorPanelForGrid.common.getContextMenuItem('Edit Totals...').isExisting())
            .toBeTrue();
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
    
        // context menu for attribute header in grid
        await agGridVisualization.openContextMenuItemForHeader('Airline Name', 'Edit Totals...', 'Visualization 1');
        await dashboardSubtotalsEditor.waitForSubtotalEditorVisible();
        // take screenshot of subtotal editor panel
        await takeScreenshotByElement(
            await dashboardSubtotalsEditor.getSubtotalEditorDialog(),
            'TC76159_4_2',
            'Subtotal Editor dialog opened from attribute header context menu'
        );
        await dashboardSubtotalsEditor.selectTypeCheckbox('Total');
        await takeScreenshotByElement(
            await dashboardSubtotalsEditor.getSubtotalEditorDialog(),
            'TC76159_4_3',
            'Check "Total" in subtotal Editor dialog'
        );
        await dashboardSubtotalsEditor.expandAcrossLevelSelector('Total');
        await takeScreenshotByElement(
            await dashboardSubtotalsEditor.getSubtotalEditorDialog(),
            'TC76159_4_4',
            'Expand "Across Level" selector in subtotal Editor dialog'
        );
        await dashboardSubtotalsEditor.selectAttributeAcrossLevel('Airline Name');
        await dashboardSubtotalsEditor.saveAndCloseSubtotalEditor();
        // take screenshot of grid with applied subtotals
        await takeScreenshotByElement(
            await agGridVisualization.getContainer('Visualization 1'),
            'TC76159_4_5',
            'Grid with applied "Total" subtotals for "Airline Name"'
        );
        await agGridVisualization.openContextMenuItemForHeader('Flights Cancelled', 'Edit Totals...', 'Visualization 1');
        await dashboardSubtotalsEditor.closeSubtotalEditorByCancel();

        // open subtotal editor from subtotal header
        await agGridVisualization.openContextMenuItemForValue('Total', 'Edit Totals...', 'Visualization 1');
        await takeScreenshotByElement(
        await agGridVisualization.getContainer('Visualization 1'),
            'TC76159_4_6',
            '"Total" enabled for "Airline Name" in subtotal Editor dialog'
        );
        await dashboardSubtotalsEditor.closeSubtotalEditorByCancel();
        // open subtotal editor from subtotal value
        await agGridVisualization.openContextMenuItemForValue('1709', 'Edit Totals...', 'Visualization 1');
        await dashboardSubtotalsEditor.closeSubtotalEditorByCancel();
    });

    it('[TC76159_5] Validate add/edit/delete Custom Subtotal for Multiple Attributes in AG Grid', async () => {
        await loginPage.login(gridConstants.gridUser);
        // C41039104E4267E2B9CB868BF56DA9AD AGGrid Custom Subtotal
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Custom_Subtotals.project.id,
            dossierId: gridConstants.AGGrid_Custom_Subtotals.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'sanity' });
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        await agGridVisualization.openContextMenuItemForHeader('Airline Name', 'Edit Totals...', 'Visualization 1');
        await dashboardSubtotalsEditor.waitForSubtotalEditorVisible();
        await dashboardSubtotalsEditor.clickAddCustomSubtotalButton();
        // take screenshot of custom subtotal dialog
        await takeScreenshotByElement(
            await dashboardSubtotalsEditor.getCustomSubtotalEditorDialog(),
            'TC76159_5_1',
            'Custom Subtotal dialog opened from Subtotal Editor'
        );
        await dashboardSubtotalsEditor.renameCustomSubtotalsName('Auto Custom');
        await dashboardSubtotalsEditor.clickSubtotalSelector('Flights Cancelled');
        // take screenshot of subtotal editor dropdown
        await takeScreenshotByElement(
            await dashboardSubtotalsEditor.getSubTotalDropdown(),
            'TC76159_5_2',
            'Aggregation dropdown in Custom Subtotal Editor dialog'
        );
        await dashboardSubtotalsEditor.setSubtotalTypeTo('Flights Cancelled', 'Average');
        await dashboardSubtotalsEditor.setSubtotalTypeTo('Flights Delayed', 'Maximum');
        // take screenshot of configured custom subtotal
        await takeScreenshotByElement(
            await dashboardSubtotalsEditor.getCustomSubtotalEditorDialog(),
            'TC76159_5_3',
            'Configured Custom Subtotal in Custom Subtotal Editor dialog'
        );
        await dashboardSubtotalsEditor.customSubtotalsClickButton('OK');
        // take screenshot of subtotal editor with added custom subtotal
        await takeScreenshotByElement(
            await dashboardSubtotalsEditor.getSubtotalEditorDialog(),
            'TC76159_5_4',
            'Subtotal Editor dialog with added Custom Subtotal'
        );
        await dashboardSubtotalsEditor.selectTypeCheckbox('Auto Custom');
        await dashboardSubtotalsEditor.expandAcrossLevelSelector('Auto Custom');
        // take screenshot of across level selector
        await takeScreenshotByElement(
            await dashboardSubtotalsEditor.getSubtotalEditorDialog(),
            'TC76159_5_5',
            'Expand "Across Level" selector for Custom Subtotal in Subtotal Editor dialog'
        );
        await dashboardSubtotalsEditor.selectAttributeAcrossLevel('All Attributes');
        await dashboardSubtotalsEditor.saveAndCloseSubtotalEditor();
        // take screenshot of grid with applied custom subtotal
        await takeScreenshotByElement(
            await agGridVisualization.getContainer('Visualization 1'),
            'TC76159_5_6',
            'Grid with applied Custom Subtotal for all attributes'
        );
        // rename custom subtotal
        await agGridVisualization.openContextMenuItemForValue('Auto Custom', 'Edit Totals...', 'Visualization 1');
        await dashboardSubtotalsEditor.waitForSubtotalEditorVisible();
        await dashboardSubtotalsEditor.hoverOverCustomSubtotalOptions('Auto Custom');
        await dashboardSubtotalsEditor.editCustomSubtotal('Auto Custom');
        await dashboardSubtotalsEditor.renameCustomSubtotalsName('Renamed Custom');
        await dashboardSubtotalsEditor.customSubtotalsClickButton('OK');
        // take screenshot of renamed custom subtotal in subtotal editor
        await takeScreenshotByElement(
            await dashboardSubtotalsEditor.getSubtotalEditorDialog(),
            'TC76159_5_7',
            'Renamed Custom Subtotal in Subtotal Editor dialog'
        );
        await dashboardSubtotalsEditor.saveAndCloseSubtotalEditor();
        // take screenshot of grid with renamed custom subtotal
        await takeScreenshotByElement(
            await agGridVisualization.getContainer('Visualization 1'),
            'TC76159_5_8',
            'Grid with renamed Custom Subtotal'
        );
        // delete custom subtotal
        await agGridVisualization.openContextMenuItemForValue('Renamed Custom', 'Edit Totals...', 'Visualization 1');
        await dashboardSubtotalsEditor.waitForSubtotalEditorVisible();
        await dashboardSubtotalsEditor.hoverOverCustomSubtotalOptions('Renamed Custom');
        await dashboardSubtotalsEditor.removeCustomSubtotal('Renamed Custom');
        // take screenshot of subtotal editor after deleting custom subtotal
        await takeScreenshotByElement(
            await dashboardSubtotalsEditor.getSubtotalEditorDialog(),
            'TC76159_5_9',
            'Subtotal Editor dialog after deleting Custom Subtotal'
        );
        await dashboardSubtotalsEditor.saveAndCloseSubtotalEditor();
        // take screenshot of grid after deleting custom subtotal
        await takeScreenshotByElement(
            await agGridVisualization.getContainer('Visualization 1'),
            'TC76159_5_10',
            'Grid after deleting Custom Subtotal'
        );
    });

    it('[TC76159_6] Validate show/hide/move to bottom Custom Subtotal in consumption mode (not outline)', async () => {
        await loginPage.login(gridConstants.gridUser);
        // C41039104E4267E2B9CB868BF56DA9AD AGGrid Custom Subtotal
        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: gridConstants.AGGrid_Custom_Subtotals,
        });
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_Custom_Subtotals.project.id,
            dossierId: gridConstants.AGGrid_Custom_Subtotals.id,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'consumption' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC76159_6_1',
            'Grid with Custom Subtotal shown in consumption mode'
        );
        // move custom subtotal to bottom in consumption mode
        await agGridVisualization.openContextMenuItemForValue('Custom Auto', 'Move to bottom', 'Visualization 1');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC76159_6_2',
            'Grid with Custom Subtotal moved to bottom in consumption mode'
        );
        // hide subtotals in consumption mode
        await agGridVisualization.openContextMenuItemForHeader('Flights Cancelled', 'Show Totals', 'Visualization 1');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC76159_6_3',
            'Grid with Custom Subtotal hidden in consumption mode'
        );
    });

    it('[TC76159_7] Validate show/hide/move to bottom Custom Subtotal in consumption mode (outline)', async () => {
        await loginPage.login(gridConstants.gridUser);
        // C41039104E4267E2B9CB868BF56DA9AD AGGrid Custom Subtotal
        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: gridConstants.AGGrid_Custom_Subtotals,
        });
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_Custom_Subtotals.project.id,
            dossierId: gridConstants.AGGrid_Custom_Subtotals.id,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'consumption outline' });
        await dossierPage.hidePageIndicator();
        // expand outline cell
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1'));
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC76159_7_1',
            'Grid with Custom Subtotal shown in consumption mode'
        );
        // move custom subtotal to bottom in consumption mode
        await agGridVisualization.openContextMenuItemForValue('Custom Auto', 'Move to bottom', 'Visualization 1');
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1'));
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC76159_7_2',
            'Grid with Custom Subtotal moved to bottom in consumption mode'
        );
        // hide subtotals in consumption mode
        await agGridVisualization.openContextMenuItemForHeader('Flights Cancelled', 'Show Totals', 'Visualization 1');
        await agGridVisualization.expandGroupCell(await agGridVisualization.getGridCellByPos(0, 0, 'Visualization 1'));
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC76159_7_3',
            'Grid with Custom Subtotal hidden in consumption mode'
        );
    });

    it('[TC76159_8] Validate Custom Subtotal x-func with formatting in AG Grid', async () => {
        await loginPage.login(gridConstants.gridUser);
        // C41039104E4267E2B9CB868BF56DA9AD AGGrid Custom Subtotal
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Custom_Subtotals.project.id,
            dossierId: gridConstants.AGGrid_Custom_Subtotals.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'sanity' });
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        await agGridVisualization.openContextMenuItemForHeader('Airline Name', 'Edit Totals...', 'Visualization 1');
        await dashboardSubtotalsEditor.waitForSubtotalEditorVisible();
        await dashboardSubtotalsEditor.clickAddCustomSubtotalButton();
        await dashboardSubtotalsEditor.renameCustomSubtotalsName('Auto Custom');
        await dashboardSubtotalsEditor.clickSubtotalSelector('Flights Cancelled');
        await dashboardSubtotalsEditor.setSubtotalTypeTo('Flights Cancelled', 'Average');
        await dashboardSubtotalsEditor.setSubtotalTypeTo('Flights Delayed', 'Maximum');
        await dashboardSubtotalsEditor.customSubtotalsClickButton('OK');
        await dashboardSubtotalsEditor.selectTypeCheckbox('Auto Custom');
        await dashboardSubtotalsEditor.expandAcrossLevelSelector('Auto Custom');
        await dashboardSubtotalsEditor.selectAttributeAcrossLevel('All Attributes');
        await dashboardSubtotalsEditor.saveAndCloseSubtotalEditor();

        // switch to format panel
        await formatPanel.switchToFormatPanel();
        await baseFormatPanelReact.switchToGeneralSettingsTab();
        await newFormatPanelForGrid.expandLayoutSection();
        await newFormatPanelForGrid.switchToTextFormatTab();
        await newFormatPanelForGrid.selectGridSegment('Subtotal Row Headers');
        await newFormatPanelForGrid.setTextFontSize('12');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await newFormatPanelForGrid.clickFontColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#834FBD');
        await baseFormatPanelReact.dismissColorPicker();
        await newFormatPanelForGrid.selectFontAlign('right');

        await newFormatPanelForGrid.selectGridSegment('Subtotal Values');
        await newFormatPanelForGrid.selectTextFont('Monoton');
        await newFormatPanelForGrid.selectVerticalAlign('bottom');
        await newFormatPanelForGrid.clickFontColorBtn();
        await newFormatPanelForGrid.clickBuiltInColor('#DB6657');
        await baseFormatPanelReact.dismissColorPicker();
        // take screenshot of grid with applied formatting to custom subtotal
        await takeScreenshotByElement(
            await agGridVisualization.getContainer('Visualization 1'),
            'TC76159_8_1',
            'Grid with applied formatting to Custom Subtotal'
        );
    });

    it('[TC76159_9] Validate Subtotal Edit privilege check', async () => {
        await loginPage.login(gridConstants.noCustomSubtotalPriUser);
        // C41039104E4267E2B9CB868BF56DA9AD AGGrid Custom Subtotal
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGrid_Custom_Subtotals.project.id,
            dossierId: gridConstants.AGGrid_Custom_Subtotals.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'consumption' });
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        // context menu for attribute/metric in dropzone
        await editorPanel.switchToEditorPanel();
        await editorPanelForGrid.rightClickOnEditorPanel('Airline Name');
        // take screenshot of context menu
        await takeScreenshotByElement(
            await editorPanelForGrid.common.contextMenu,
            'TC76159_9_1',
            '"Edit Totals..." should not shown in context menu for user without privilege' 
        );
        // dismiss context menu
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        await editorPanelForGrid.rightClickOnEditorPanel('Flights Cancelled');
        since('"Edit Totals..." should show in context menu for metric in dropzone')
            .expect(await editorPanelForGrid.common.getContextMenuItem('Edit Totals...').isExisting())
            .toBeFalse();
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
    
        // context menu for attribute header in grid
        await agGridVisualization.RMConColumnHeaderElement('Airline Name', 'Visualization 1');
        since('"Edit Totals..." should not shown in context menu for user without privilege')
            .expect(await agGridVisualization.getContextMenuItem('Edit Totals...').isExisting())
            .toBeFalse();
        await agGridVisualization.RMConColumnHeaderElement('Flights Cancelled', 'Visualization 1');
        since('"Edit Totals..." should not shown in context menu for user without privilege')
            .expect(await agGridVisualization.getContextMenuItem('Edit Totals...').isExisting())
            .toBeFalse();

        await agGridVisualization.openRMCMenuForValue('Custom Auto', 'Visualization 1');
        since('"Edit Totals..." should not shown in context menu for user without privilege')
            .expect(await agGridVisualization.getContextMenuItem('Edit Totals...').isExisting())
            .toBeFalse();
    })

    it('[BCIN-6387] Incorrect row height after enable subtotal, grid values are truncated ', async () => {
        await loginPage.login(gridConstants.gridUser);
        // 1860E2AD864483BB18320DAB9432B03A Custom Subtotal_xfun
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_Subtotals_Rowheight.project.id,
            dossierId: gridConstants.AGGrid_Subtotals_Rowheight.id,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-6387_1',
            'The grid value should not be truncated in consumption mode'
        );
        // go to edit mode
        await dossierPage.clickEditIcon();
        await dossierPage.waitForDossierLoading();
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-6387_2',
            'The grid value should not be truncated in edit mode'
        );
    });
});
