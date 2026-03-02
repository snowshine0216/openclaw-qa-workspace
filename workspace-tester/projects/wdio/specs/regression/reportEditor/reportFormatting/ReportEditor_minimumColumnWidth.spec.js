import * as reportConstants from '../../../../constants/report.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';

describe('Report Editor - Minimum Column Width', () => {
    let {
        loginPage,
        libraryPage,
        reportDatasetPanel,
        reportToolbar,
        reportTOC,
        newFormatPanelForGrid,
        reportFormatPanel,
        reportGridView,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(reportConstants.reportUser);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC86499] E2E [Report Editor][Component Level] Minimum Column Width', async () => {
        await libraryPage.createNewReportByUrl({});
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Products']);
        await reportDatasetPanel.addObjectToRows('Category');
        await reportDatasetPanel.clickFolderUpIcon();
        await reportDatasetPanel.selectItemInObjectList('Time');
        await reportDatasetPanel.addObjectToRows('Year');
        await reportDatasetPanel.clickFolderUpIcon();
        await reportDatasetPanel.selectItemInObjectList('Geography');
        await reportDatasetPanel.addObjectToRows('Country');
        await reportDatasetPanel.clickFolderUpMultipleTimes(3);
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
        await reportDatasetPanel.addMultipleObjectsToColumns(['Cost', 'Profit']);
        await reportToolbar.switchToDesignMode();
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();
        await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Merge repetitive cells');
        // # 2. Go to Format Panel - Spacing - Fit to Container.
        await newFormatPanelForGrid.expandSpacingSection();
        await reportFormatPanel.openColumnSizeFitSelectionBox();
        await reportFormatPanel.selectOptionFromDropdown('Fit to Container');
        // # 3. Add minimum column width option for 2 attributes and 2 metrics.
        // # 4. Enter values.
        await reportFormatPanel.openMinimumColumnWidthMenu();
        await reportFormatPanel.addMinimumColumnWidthOption('Category');
        await reportFormatPanel.setMinimumColumnWidthValue('Category', '250');
        //  Then the grid cell at "0", "0" has text "Category"
        //  And the grid cells at "0"-"24", "0" have style "width" with value "250"
        await since(
            'After adding minimum column width option for "Category" with value "250", the grid cell at "0", "0" has text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');
        await since(
            'After adding minimum column width option for "Category" with value "250", the grid cells at "0"-"24", "0" have style "width" with value "#{expected}", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 0, 'width'))
            .toBe(JSON.stringify(Array(25).fill('250px')));
        // And I verify the minimum column width input value for "Category" is "250" pixels in Report Editor
        await since(
            'the minimum column width input value for "Category" is "250" pixels in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getMinimumColumnWithInputValue('Category'))
            .toBe('250px');
        await reportFormatPanel.openMinimumColumnWidthMenu();
        await reportFormatPanel.addMinimumColumnWidthOption('Year');
        await reportFormatPanel.setMinimumColumnWidthValue('Year', '250');
        await since(
            'After adding minimum column width option for "Year" with value "250", the grid cell at "0", "1" has text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Year');
        await since(
            'After adding minimum column width option for "Year" with value "250", the grid cells at "0"-"24", "1" have style "width" with value "#{expected}", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 1, 'width'))
            .toBe(JSON.stringify(Array(25).fill('250px')));
        await since(
            'the minimum column width input value for "Year" is "250" pixels in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getMinimumColumnWithInputValue('Year'))
            .toBe('250px');
        await reportFormatPanel.openMinimumColumnWidthMenu();
        await reportFormatPanel.addMinimumColumnWidthOption('Profit');
        await reportFormatPanel.setMinimumColumnWidthValue('Profit', '250');
        await since(
            'After adding minimum column width option for "Profit" with value "250", the grid cell at "0", "4" has text "Profit", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Profit');
        await since(
            'After adding minimum column width option for "Profit" with value "250", the grid cells at "0"-"24", "4" have style "width" with value "#{expected}", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 4, 'width'))
            .toBe(JSON.stringify(Array(25).fill('250px')));
        await since(
            'the minimum column width input value for "Profit" is "250" pixels in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getMinimumColumnWithInputValue('Profit'))
            .toBe('250px');
        await since(
            'After adding minimum column width option for "Profit" with value "250", the grid cell at "0", "3" has text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Profit');
        await since(
            'After adding minimum column width option for "Profit" with value "250", the grid cells at "0"-"24", "4" have style "width" with value "#{expected}", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 4, 'width'))
            .toBe(JSON.stringify(Array(25).fill('250px')));
        //  # 5. Add minimum column width option for 1 attribute and 1 metric.
        await reportFormatPanel.openMinimumColumnWidthMenu();
        await reportFormatPanel.addMinimumColumnWidthOption('Country');
        await reportFormatPanel.setMinimumColumnWidthValue('Country', '100');
        const minColumnWidth = '148px';
        await since(
            'After adding minimum column width option for "Country" with value "100", the grid cell at "0", "2" has text "Country", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Country');
        await since(
            'After adding minimum column width option for "Country" with value "100", the grid cells at "0"-"24", "2" have style "width" with value "#{expected}", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 2, 'width'))
            .toBe(JSON.stringify(Array(25).fill(minColumnWidth)));
        await since(
            'the minimum column width input value for "Country" is "100" pixels in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getMinimumColumnWithInputValue('Country'))
            .toBe('100px');
        //   # 5. Add minimum column width option for 1 attribute and 1 metric.
        await reportFormatPanel.openMinimumColumnWidthMenu();
        await reportFormatPanel.addMinimumColumnWidthOption('Cost');
        await reportFormatPanel.setMinimumColumnWidthValue('Cost', '75');
        // await reportGridView.scrollAgGrid('Visualization 1', 750, 'right');
        await since(
            'After adding minimum column width option for "Cost" with value "75", the grid cell at "0", "3" has text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');
        await since(
            'After adding minimum column width option for "Cost" with value "75", the grid cells at "0"-"24", "3" have style "width" with value "120", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 3, 'width'))
            .toBe(JSON.stringify(Array(25).fill(minColumnWidth)));
        await since(
            'the minimum column width input value for "Cost" is "75" pixels in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getMinimumColumnWithInputValue('Cost'))
            .toBe('75px');
        // # 6. Remove minimum column width option for 1 attribute and 1 metric.
        // await reportGridView.scrollAgGrid('Visualization 1', 750, 'left');
        await reportFormatPanel.deleteMinimumColumnWidthOption('Country');
        await since(
            'After removing minimum column width option for "Country", the grid cell at "0", "2" has text "Country", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Country');
        await since(
            'After removing minimum column width option for "Country", the grid cells at "0"-"24", "2" have style "width" with value "#{expected}", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 2, 'width'))
            .toBe(JSON.stringify(Array(25).fill(minColumnWidth)));
        await reportFormatPanel.deleteMinimumColumnWidthOption('Cost');
        // await reportGridView.scrollGridHorizontally('Visualization 1', 750);
        await since(
            'After removing minimum column width option for "Cost", the grid cell at "0", "3" has text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');
        await since(
            'After removing minimum column width option for "Cost", the grid cells at "0"-"24", "3" have style "width" with value "120", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 3, 'width'))
            .toBe(JSON.stringify(Array(25).fill(minColumnWidth)));
    });

    it('[TC86500] FUN [Report Editor][Workstation] Minimum Column Width', async () => {
        await libraryPage.createNewReportByUrl({});
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Products']);
        await reportDatasetPanel.addObjectToRows('Category');
        await reportDatasetPanel.clickFolderUpIcon();
        await reportDatasetPanel.selectItemInObjectList('Time');
        await reportDatasetPanel.addObjectToRows('Year');
        await reportDatasetPanel.clickFolderUpIcon();
        await reportDatasetPanel.selectItemInObjectList('Geography');
        await reportDatasetPanel.addObjectToRows('Country');
        await reportDatasetPanel.clickFolderUpMultipleTimes(3);
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
        await reportDatasetPanel.addMultipleObjectsToColumns(['Cost', 'Profit', 'Revenue']);
        await reportToolbar.switchToDesignMode();
        // # 2. Go to Format Panel - Spacing - Fit to Container.
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();
        await reportFormatPanel.clickCheckBoxForOption('Row headers', 'Merge repetitive cells');
        await newFormatPanelForGrid.expandLayoutSection(); // collapse layout section
        await newFormatPanelForGrid.expandSpacingSection();
        await reportFormatPanel.openColumnSizeFitSelectionBox();
        await reportFormatPanel.selectOptionFromDropdown('Fit to Container');
        //  # 3. Add minimum column width option.
        await reportFormatPanel.openMinimumColumnWidthMenu();
        await reportFormatPanel.addMinimumColumnWidthOption('Category');
        await reportFormatPanel.setMinimumColumnWidthValue('Category', '250');
        await since(
            'After adding minimum column width option for "Category" with value "250", the grid cells at "0"-"24", "0" have style "width" with value "#{expected}", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 0, 'width'))
            .toBe(JSON.stringify(Array(25).fill('250px')));
        // Then the grid cell at "0", "0" has text "Category"
        await since(
            'After adding minimum column width option for "Category" with value "250", the grid cell at "0", "0" has text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');
        // # 4. Enter different values.
        await reportFormatPanel.setMinimumColumnWidthValue('Category', '500');
        await since(
            'After adding minimum column width option for "Category" with value "500", the grid cell at "0", "0" has text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');
        await since(
            'After adding minimum column width option for "Category" with value "500", the grid cells at "0"-"24", "0" have style "width" with value "#{expected}", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 0, 'width'))
            .toBe(JSON.stringify(Array(25).fill('500px')));
        await since(
            'the minimum column width input value for "Category" should be #{expected} in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getMinimumColumnWithInputValue('Category'))
            .toBe('500px');
        await reportFormatPanel.setMinimumColumnWidthValue('Category', '-@@@');
        await since(
            'After adding minimum column width option for "Category" with value "-@@@", the grid cell at "0", "0" has text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');
        await since(
            'After adding minimum column width option for "Category" with value "-@@@", the grid cells at "0"-"24", "0" have style "width" with value "500", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 0, 'width'))
            .toBe(JSON.stringify(Array(25).fill('500px')));
        await since(
            'the minimum column width input value for "Category" should be #{expected} in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getMinimumColumnWithInputValue('Category'))
            .toBe('500px');
        await reportFormatPanel.setMinimumColumnWidthValue('Category', '-100');
        await since(
            'After adding minimum column width option for "Category" with value "-100", the grid cell at "0", "0" has text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');
        await since(
            'After adding minimum column width option for "Category" with value "-100", the grid cells at "0"-"24", "0" have style "width" with value #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 0, 'width'))
            .toBe(JSON.stringify(Array(25).fill('172px')));
        await reportFormatPanel.setMinimumColumnWidthValue('Category', '444.4');
        await since(
            'After adding minimum column width option for "Category" with value "444.4", the grid cell at "0", "0" has text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');
        await since(
            'After adding minimum column width option for "Category" with value "444.4", the grid cells at "0"-"24", "0" have style "width" with value "444", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 0, 'width'))
            .toBe(JSON.stringify(Array(25).fill('444px')));
        await since(
            'the minimum column width input value for "Category" should be #{expected} in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getMinimumColumnWithInputValue('Category'))
            .toBe('444px');
        await reportFormatPanel.setMinimumColumnWidthValue('Category', '0');
        await since(
            'After adding minimum column width option for "Category" with value "0", the grid cell at "0", "0" has text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');
        await since(
            'After adding minimum column width option for "Category" with value "0", the grid cells at "0"-"24", "0" have style "width" with value #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 0, 'width'))
            .toBe(JSON.stringify(Array(25).fill('172px')));
        await reportFormatPanel.setMinimumColumnWidthValue('Category', '99999');
        await since(
            'After adding minimum column width option for "Category" with value "99999", the grid cell at "0", "0" has text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');
        await since(
            'After adding minimum column width option for "Category" with value "99999", the grid cells at "0"-"24", "0" have style "width" with value "99999", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 0, 'width'))
            .toBe(JSON.stringify(Array(25).fill('99999px')));
    });
});
