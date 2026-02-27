import * as reportConstants from '../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';

describe('Report editor number text formatting', () => {
    let { loginPage, libraryPage, reportDatasetPanel, reportToolbar, reportGridView, reportEditorPanel } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(reportConstants.reportUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC86187] Functional [Workstation][Report Editor] Report editor number text formatting', async () => {
        await libraryPage.createNewReportByUrl({});
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Customers']);
        await reportDatasetPanel.addMultipleObjectsToRows(['Customer', 'Customer Birth Date']);
        await reportDatasetPanel.clickFolderUpMultipleTimes(1);
        await reportDatasetPanel.selectItemInObjectList('Time');
        await reportDatasetPanel.addObjectToRows('Year');
        await reportDatasetPanel.clickFolderUpMultipleTimes(3);
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
        await reportDatasetPanel.addMultipleObjectsToColumns(['Profit']);
        await reportToolbar.switchToDesignMode();
        // await takeScreenshotByElement(reportGridView.grid, 'TC86189_1', 'grid');
        await since(
            'After adding the "Profit" metric, the grid cell at "1", "2" has text "12/19/1941", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('12/19/1941');
        await since(
            'After adding the "Profit" metric, the grid cell at "1", "3" has text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('2014');
        // #2 RMC on Customer in Drop Zone, verify that there is no Number Format.
        await reportEditorPanel.openObjectContextMenu('Rows', 'attribute', 'Customer');
        await since(
            'After open the context menu, The Number Format showing up in context menu should be #{expected} instead we have #{actual}'
        )
            .expect(await (await reportEditorPanel.getContextMenuItem('Number Format')).isDisplayed())
            .toBe(false);

        // #3 RMC on the Profit on the grid, verify there is no Special Format under Number Formatting
        await reportGridView.openGridColumnHeaderContextMenu('Profit');
        await reportGridView.clickContextMenuOption('Number Format');
        await since(
            'After open the context menu, Special Type showing up in submenu should be #{expected} instead we have #{actual}'
        )
            .expect(await (await reportEditorPanel.getSubmenuItem('Special Type')).isDisplayed())
            .toBe(false);
        // // #4 RMC on Customer Birth Date in Drop Zone, verify there is Number Format
        // await reportEditorPanel.openAttributeContextMenuInRowsDropzone('Customer Birth Date');
        // await reportEditorPanel.clickContextMenuItem('Number Format');
        // await reportNumberTextFormatting.selectCategoryFromNumberTextFormatting('Date');
        // await reportNumberTextFormatting.subCategoryOption('16-Apr-20');
        // await reportNumberTextFormatting.saveAndCloseContextMenu();
        await reportEditorPanel.changeNumberFormatForAttributeInRowsDropzone(
            'Customer Birth Date',
            'Date',
            '16-Apr-20'
        );
        await since(
            'After change the number format to Date, The grid cell at 1, 2 has text  #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('19-Dec-41');

        //  #6 RMC on Year in the grid and select Number Format > Special Format > Zip code, verify the value is 12345
        // await reportEditorPanel.openObjectContextMenu('Rows', 'attribute', 'Year');
        // await reportEditorPanel.clickContextMenuItem('Number Format');
        // await reportNumberTextFormatting.selectCategoryFromNumberTextFormatting('Special');
        // await reportNumberTextFormatting.subCategoryOption('Postcode');
        // await reportNumberTextFormatting.saveAndCloseContextMenu();
        await reportEditorPanel.changeNumberFormatForAttributeInRowsDropzone('Year', 'Special');
        await since(
            'After change the number format to Special, The grid cell at 1, 3 has text  #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('02014');
        //  #7 RMC on Profit in the dataset panel and select Number Format > Change to any format option
        // await reportEditorPanel.openObjectContextMenu('Metrics', 'metric', 'Profit');
        // await reportGridView.clickContextMenuOption('Number Format');
        // await reportNumberTextFormatting.selectCategoryFromNumberTextFormatting('Percentage');
        // await reportNumberTextFormatting.saveAndCloseContextMenu();
        // await reportGridView.changeNumberFormat('', 'Profit', 'Percentage');
        await reportEditorPanel.changeNumberFormatForMetricInMetricsDropZone('Profit', 'Percentage');
        await since(
            'After change the number format to Percentage, The grid cell at 1, 4 has text  #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('28366%');
        //  #8 Remove Year from the grid
        await reportEditorPanel.removeAttributeInRowsDropZone('Year');
        //  #9 Add Year attribute back to Grid, verify the formatting is still the same as in #6
        await reportDatasetPanel.clickFolderUpMultipleTimes(3);
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Time']);
        await reportDatasetPanel.addObjectToRows('Year');
        await since(
            'After adding the "Year" attribute, The grid cell at 1, 3 has text  #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('02014');
        //  #Steps 10-14 are not executable on component level
        // #10 Save the dossier as TC86187_Saved1 and reopen the Report
        // #11 RMC on Customer Birth Date in Drop Zone and select Number Formatting > Date, verify the option is Date and the value in the grid is still in that format
        // #12 RMC on Year in Grid and select Number Format, verify the option is Zip code and the value in the grid is still in that format >> Set to Automatic
        // #13 RMC on Profit in Dataset panel and select Number Format, verify the option is the same as in #7
        // #14 Change the Year formatting to Number Format > Special Format > Social Security Number, verify the formatting
        // await reportGridView.openGridColumnHeaderContextMenu('Year');
        // await reportGridView.clickContextMenuOption('Number Format');
        // await reportNumberTextFormatting.selectNumberTextFormatFromDropdown('Special');
        // await reportNumberTextFormatting.subCategoryOption('Social Security Number');
        // await reportNumberTextFormatting.saveAndCloseContextMenu();
        await reportEditorPanel.changeNumberFormatForAttributeInRowsDropzone(
            'Year',
            'Special',
            'Social Security Number'
        );
        await since(
            'After change the number format to Special, The grid cell at 1, 3 has text  #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('000-00-2014');
        //  #15 Change the Customer Birthdate to a different Date format and verify the formatting
        // await reportGridView.openGridColumnHeaderContextMenu('Customer Birth Date');
        // await reportGridView.clickContextMenuOption('Number Format');
        // await reportNumberTextFormatting.selectNumberTextFormatFromDropdown('Date');
        // await reportNumberTextFormatting.subCategoryOption('Apr 16, 20');
        // await reportNumberTextFormatting.saveAndCloseContextMenu();
        await reportEditorPanel.changeNumberFormatForAttributeInRowsDropzone(
            'Customer Birth Date',
            'Date',
            'Apr 16, 20'
        );
        await since(
            'After change the number format to Date, The grid cell at 1, 2 has text  #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Dec 19, 41');
        // #16 RMC on Profit header on the Grid and select Number Format > Change to any format option
        // await reportGridView.openGridColumnHeaderContextMenu('Profit');
        // await reportGridView.clickContextMenuOption('Number Format');
        // await reportNumberTextFormatting.selectNumberTextFormatFromDropdown('Scientific');
        // await reportNumberTextFormatting.saveAndCloseContextMenu();
        await reportEditorPanel.changeNumberFormatForMetricInMetricsDropZone('Profit', 'Scientific');
        await since(
            'After change the number format to Scientific, The grid cell at 1, 4 has text  #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('3E+02');
    });
});
