import * as reportConstants from '../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';

describe('Subtotals in report editor', () => {
    let { loginPage, libraryPage, reportToolbar, reportGridView, reportSubtotalsEditor, reportPageBy } =
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

    it('[TC85744] Create Report, add custom subtotals', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TC84646_e2e_subtotals.id,
            projectId: reportConstants.TC84646_e2e_subtotals.project.id,
        });
        await reportToolbar.switchToDesignMode();
        // And I open Show Totals from "Country" header cell context menu in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Country');
        await reportGridView.clickContextMenuOption('Show Totals');

        // And I click on Custom button in subtotals editor
        await reportSubtotalsEditor.clickCustomSubtotalsButton();

        // And I change the Custom Subtotals name to "Custom_Subtotals"
        await reportSubtotalsEditor.renameCustomSubtotalsName('Custom_Subtotals');

        // And I expand subtotals selector from "Cost" metric and I select "(None)" subtotal type in order "1"
        await reportSubtotalsEditor.clickSubtotalsSelector('Cost');
        await reportSubtotalsEditor.selectSubtotalsType('(None)', '1');

        // And I expand subtotals selector from "Profit" metric and I select "Total" subtotal type in order "2"
        await reportSubtotalsEditor.clickSubtotalsSelector('Profit');
        await reportSubtotalsEditor.selectSubtotalsType('Total', '2');

        // And I expand subtotals selector from "Revenue" metric and I select "Average" subtotal type in order "3"
        await reportSubtotalsEditor.clickSubtotalsSelector('Revenue');
        await reportSubtotalsEditor.selectSubtotalsType('Average', '3');

        // And I click "Add" button in custom subtotals editor
        await reportSubtotalsEditor.customSubtotalsClickButton('Add');

        // And I select "Custom_Subtotals" type in subtotals editor
        await reportSubtotalsEditor.selectTypeCheckbox('Custom_Subtotals');
        // And I click "Done" button in subtotals editor
        await reportSubtotalsEditor.saveAndCloseSubtotalsEditor();

        // Then the grid cell at "3", "3" has text "--"
        await since('The grid cell at "3", "3" should have "--", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('--');

        // And the grid cell at "3", "4" has text "$764,323"
        await since('The grid cell at "3", "4" should have "$764,323", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 4))
            .toBe('$764,323');

        // And the grid cell at "3", "5" has text "$2,514,683"
        await since('The grid cell at "3", "5" should have "$2,514,683", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 5))
            .toBe('$2,514,683');

        // And the grid cell at "25", "1" has text "Custom_Subtotals"
        await since('The grid cell at "25", "1" should have "Custom_Subtotals", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(25, 1))
            .toBe('Custom_Subtotals');

        // And the grid cell at "25", "5" has text "$3,902,762"
        await since('The grid cell at "25", "5" should have "$3,902,762", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(25, 5))
            .toBe('$3,902,762');

        // // When I open context menu from cell "Custom_Subtotals" from grid view in Report Editor
        // await reportGridView.openGridCellContextMenu('Custom_Subtotals');

        // // And I click "Move to top" option from grid view context menu in Report Editor
        // await reportGridView.clickContextMenuOption('Move to top');
        await reportGridView.moveTotalToTop('Custom_Subtotals');

        // Then the grid cell at "1", "0" has text "Custom_Subtotals"
        await since('The grid cell at "1", "0" should have "Custom_Subtotals", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Custom_Subtotals');

        // And the grid cell at "1", "5" has text "$2,334,914"
        await since('The grid cell at "1", "5" should have "$2,334,914", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('$2,334,914');

        // When I open context menu from the column header "Cost" from grid view in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Cost');

        // And I click "Edit Totals" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Edit Totals');

        // And I hover over By Position options
        await reportSubtotalsEditor.hoverOverCustomSubtotalOptions();

        // And I click Edit button from Custom Subtotal
        await reportSubtotalsEditor.editButtonCustomSubtotals();

        // And I expand subtotals selector from "Cost" metric and I select "Average" subtotal type in order "1"
        await reportSubtotalsEditor.clickSubtotalsSelector('Cost');
        await reportSubtotalsEditor.selectSubtotalsType('Average', '1');

        // And I expand subtotals selector from "Profit" metric and I select "Maximum" subtotal type in order "2"
        await reportSubtotalsEditor.clickSubtotalsSelector('Profit');
        await reportSubtotalsEditor.selectSubtotalsType('Maximum', '2');

        // And I expand subtotals selector from "Revenue" metric and I select "Minimum" subtotal type in order "3"
        await reportSubtotalsEditor.clickSubtotalsSelector('Revenue');
        await reportSubtotalsEditor.selectSubtotalsType('Minimum', '3');

        // And I click "Edit" button in custom subtotals editor
        await reportSubtotalsEditor.customSubtotalsClickButton('Edit');

        // And I click on By Position options
        await reportSubtotalsEditor.clickByPositionOptions();

        // And I expand subtotal By Position from "Row" and I select "Grand Total" subtotal in order "1"
        await reportSubtotalsEditor.clickSubtotalsPositionOption('Row');
        await reportSubtotalsEditor.selectSubtotalsOption('Grand Total', '1');
        // And I expand subtotal By Position from "Column" and I select "Grand Total" subtotal in order "2"
        await reportSubtotalsEditor.clickSubtotalsPositionOption('Column');
        await reportSubtotalsEditor.selectSubtotalsOption('Grand Total', '2');

        // And I click "Done" button in Subtotals by Position editor
        await reportSubtotalsEditor.saveAndCloseSubtotalsByPositionEditor();

        // And I click "Done" button in subtotals editor
        await reportSubtotalsEditor.saveAndCloseSubtotalsEditor();

        await since('The grid cell at "1", "5" should have "$4,182,139", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('$4,182,139');

        await since('The grid cell at "3", "3" should have "$2,662,083", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('$2,662,083');

        await since('The grid cell at "3", "4" should have "$764,323", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 4))
            .toBe('$473,200');

        // // And I open context menu from the column header "Country" from grid view in Report Editor
        // await reportGridView.openGridColumnHeaderContextMenu('Country');

        // // And I click "Remove" option from grid view context menu in Report Editor
        // await reportGridView.clickContextMenuOption('Remove');

        // // And I switch to "In Report" tab in dataset panel in Report Editor
        // await reportDatasetPanel.switchToInReportTab();

        // // And I add the object "Country" to Columns from In Report tab in Report Editor
        // await reportDatasetPanel.addObjectToColumns('Country');
    });

    it('[TC84646_1] Add subtotals in report with attribute in Page_By', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TC85744_Page_By_Subtotals.id,
            projectId: reportConstants.TC85744_Page_By_Subtotals.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportPageBy.openSelectorContextMenu('Supplier');
        await reportGridView.clickContextMenuOption('Show Totals');
        await reportSubtotalsEditor.selectTypeCheckbox('Total');
        await reportSubtotalsEditor.saveAndCloseSubtotalsEditor();
        // Then the grid cell at "1", "5" has text "Total"
        await since('The grid cell at "1", "5" should have text "Total", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('Total');

        // And the grid cell at "4", "5" has text "$156,367"
        await since('The grid cell at "4", "5" should have text "$156,367", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 5))
            .toBe('$156,367');

        // And the grid cell at "0", "6" has text "Total"
        await since('The grid cell at "0", "6" should have text "Total", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 6))
            .toBe('Total');

        // And the grid cell at "4", "6" has text "$156,367"
        await since('The grid cell at "4", "6" should have text "$156,367", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 6))
            .toBe('$156,367');

        // // And I scroll ag-grid "Visualization 1" down 2000px pixels
        // await reportGridView.scrollAgGrid('Visualization 1', 2000, 'down');

        // // And the grid cell at "26", "0" has text "Total"
        // await since('The grid cell at "26", "0" should have text "Total", instead we have #{actual}')
        //     .expect(await reportGridView.getGridCellTextByPos(26, 0))
        //     .toBe('Total');

        // // And the grid cell at "26", "4" has text "$5,293,624"
        // await since('The grid cell at "26", "4" should have text "$5,293,624", instead we have #{actual}')
        //     .expect(await reportGridView.getGridCellTextByPos(26, 4))
        //     .toBe('$5,293,624');

        // When I open Edit Totals from "Region" header cell context menu in Report Editor
        await reportPageBy.openSelectorContextMenu('Supplier');
        await reportGridView.clickContextMenuOption('Edit Totals');

        // And I select "Average" type in subtotals editor
        await reportSubtotalsEditor.selectTypeCheckbox('Average');

        // And I apply "Across Level" level for "Average" subtotal in subtotals editor
        await reportSubtotalsEditor.setAppliedLevel('Across Level', 'Average');

        // And I expand Across Level selector in subtotals editor
        await reportSubtotalsEditor.expandAcrossLevelSelector();

        // And I select "Country" attribute for Across Level in subtotals editor
        await reportSubtotalsEditor.selectAttributeAcrossLevel('Subcategory');

        // // And I select "Region" attribute for Across Level in subtotals editor
        // await reportSubtotalsEditor.selectAttributeAcrossLevel('Region');

        // And I click "Done" button in subtotals editor
        await reportSubtotalsEditor.saveAndCloseSubtotalsEditor();

        // Then the grid cell at "1", "6" has text "Average"
        await since('The grid cell at "1", "6" should have text "Average", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 6))
            .toBe('Average');

        // And the grid cell at "4", "6" has text "$39,092"
        await since('The grid cell at "4", "6" should have text "$39,092", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 6))
            .toBe('$39,092');

        // When I open context menu for page by selector "Supplier" in Report Editor
        await reportPageBy.openSelectorContextMenu('Supplier');

        // And I click option "Move Totals to Top" in context menu for page by selector in Report Editor
        await reportGridView.clickContextMenuOption('Move Totals to Top', true);

        // Then The current selection for page by selector "Supplier" should be "Total"
        await since(
            'The current selection for page by selector "Supplier" should be "Total", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Supplier'))
            .toBe('Total');

        // When I open the dropdown list for page by selector "Supplier"
        await reportPageBy.openDropdownFromSelector('Supplier');

        // Then The index of element "Total" is 0 in page by selector
        await since('The index of element "Total" is 0 in page by selector')
            .expect(await reportPageBy.getIndexForElementFromPopupList('Total'))
            .toBe('0');

        // When I select element "Bantam Books" from Page by selector "Supplier"
        await reportPageBy.changePageByElement('Supplier', 'Bantam Books');

        // Then The current selection for page by selector "Supplier" should be "Bantam Books"
        await since('The current selection for page by selector "Supplier" should be "Bantam Books"')
            .expect(await reportPageBy.getPageBySelectorText('Supplier'))
            .toBe('Bantam Books');

        // When I open context menu for page by selector "Supplier" in Report Editor
        await reportPageBy.openSelectorContextMenu('Supplier');

        // And I click option "Move Totals to Bottom" in context menu for page by selector in Report Editor
        await reportGridView.clickContextMenuOption('Move Totals to Bottom');

        // And I open the dropdown list for page by selector "Supplier"
        await reportPageBy.openDropdownFromSelector('Supplier');

        // Then The index of element "Total" is 36 in page by selector
        await since('The index of element "Total" is 36 in page by selector')
            .expect(await reportPageBy.getIndexForElementFromPopupList('Total'))
            .toBe('36');

        // // When I open context menu for "attribute" "Supplier" in "pageby" dropzone from the Editor Panel in Report Editor
        await reportPageBy.openSelectorContextMenu('Supplier');

        // // And I click context menu item "Hide All Totals" in Editor Panel
        await reportGridView.clickContextMenuOption('Hide All Totals', true);

        // Then the grid cell at "2", "5" is not present
        await since('The grid cell at "2", "5" should not be present, instead we have #{actual}')
            .expect(await reportGridView.getGridCellByPos(2, 5).isExisting())
            .toBe(false);

        // And the grid cell at "3", "5" is not present
        await since('The grid cell at "3", "5" should not be present, instead we have #{actual}')
            .expect(await reportGridView.getGridCellByPos(3, 5).isExisting())
            .toBe(false);

        // When I open context menu for "attribute" "Supplier" in "pageby" dropzone from the Editor Panel in Report Editor
        await reportPageBy.openSelectorContextMenu('Supplier');

        // And I click context menu item "Show Totals" in Editor Panel
        await reportGridView.clickContextMenuOption('Show Totals', true);

        // Then the grid cell at "1", "5" has text "Total"
        await since('The grid cell at "1", "5" should have text "Total", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('Total');

        // And the grid cell at "4", "5" has text "$156,367"
        await since('The grid cell at "4", "5" should have text "$156,367", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 5))
            .toBe('$156,367');

        // And the grid cell at "0", "7" has text "Total"
        await since('The grid cell at "1", "5" should have text "Total", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 5))
            .toBe('Total');

        // And the grid cell at "4", "7" has text "$156,367"
        await since('The grid cell at "4", "7" should have text "$156,367", instead we have #{actual}   ')
            .expect(await reportGridView.getGridCellTextByPos(4, 7))
            .toBe('$156,367');

        // And the grid cell at "1", "6" has text "Average"
        await since('The grid cell at "1", "6" should have text "Average", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 6))
            .toBe('Average');

        // And the grid cell at "4", "6" has text "$39,092"
        await since('The grid cell at "4", "6" should have text "$39,092", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 6))
            .toBe('$39,092');
    });

    it('[TC84646_2] Add different kinds of subtotals', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TC84646_e2e_subtotals.id,
            projectId: reportConstants.TC84646_e2e_subtotals.project.id,
        });
        await reportToolbar.switchToDesignMode();
        // And I open Show Totals from "Cost" header cell context menu in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Cost');
        await reportGridView.clickContextMenuOption('Show Totals');

        // And I select "Total" type in subtotals editor
        await reportSubtotalsEditor.selectTypeCheckbox('Total');

        // And I click "Done" button in subtotals editor
        await reportSubtotalsEditor.saveAndCloseSubtotalsEditor();

        // Then the grid cell at "3", "2" has text "Total"
        await since('The grid cell at "3", "2" should have text "Total", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 2))
            .toBe('Total');

        // And the grid cell at "3", "3" has text "$4,265,043"
        await since('The grid cell at "3", "3" should have text "$4,265,043", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('$4,265,043');

        // And the grid cell at "22", "1" has text "Total"
        await since('The grid cell at "22", "1" should have text "Total", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(22, 1))
            .toBe('Total');

        // And the grid cell at "22", "5" has text "$31,120,946"
        await since('The grid cell at "22", "5" should have text "$31,120,946", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(22, 5))
            .toBe('$31,120,946');

        // And I scroll ag-grid "Visualization 1" down 2000px pixels
        await reportGridView.scrollAgGrid('Visualization 1', 2000, 'down');

        // And the grid cell at "26", "0" has text "Total"
        await since('The grid cell at "26", "0" should have text "Total", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(26, 0))
            .toBe('Total');

        // And the grid cell at "26", "4" has text "$5,293,624"
        await since('The grid cell at "26", "4" should have text "$5,293,624", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(26, 4))
            .toBe('$5,293,624');

        // When I open Edit Totals from "Region" header cell context menu in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Region');
        await reportGridView.clickContextMenuOption('Edit Totals');

        // And I select "Average" type in subtotals editor
        await reportSubtotalsEditor.selectTypeCheckbox('Average');

        // And I apply "Across Level" level for "Average" subtotal in subtotals editor
        await reportSubtotalsEditor.setAppliedLevel('Across Level', 'Average');

        // And I expand Across Level selector in subtotals editor
        await reportSubtotalsEditor.expandAcrossLevelSelector();

        // And I select "Country" attribute for Across Level in subtotals editor
        await reportSubtotalsEditor.selectAttributeAcrossLevel('Country');

        // And I select "Region" attribute for Across Level in subtotals editor
        await reportSubtotalsEditor.selectAttributeAcrossLevel('Region');

        // And I click "Done" button in subtotals editor
        await reportSubtotalsEditor.saveAndCloseSubtotalsEditor();

        // Then the grid cell at "23", "1" has text "Average"
        await since('The grid cell at "23", "1" should have text "Average", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(23, 1))
            .toBe('Average');

        // And the grid cell at "23", "3" has text "$1,886,490"
        await since('The grid cell at "23", "3" should have text "$1,886,490", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(23, 3))
            .toBe('$1,886,490');

        // And I scroll ag-grid "Visualization 1" down 2000px pixels
        await reportGridView.scrollGridToBottom('Visualization 1');

        // And the grid cell at "29", "0" has text "Average"
        await since('The grid cell at "29", "0" should have text "Average", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(29, 0))
            .toBe('Average');

        // And the grid cell at "29", "5" has text "$2,334,914"
        await since('The grid cell at "29", "5" should have text "$2,334,914", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(29, 5))
            .toBe('$2,334,914');

        // When I open blank cell context menu at "3", "3" from grid view context menu in Report Editor
        await reportGridView.openGridContextMenuByPos(3, 3);

        // And I click "Edit Totals" option from grid view context menu in Report Editor
        await reportGridView.clickContextMenuOption('Edit Totals');

        // And I select "Maximum" type in subtotals editor
        await reportSubtotalsEditor.selectTypeCheckbox('Maximum');

        // And I apply "Group By" level for "Maximum" subtotal in subtotals editor
        await reportSubtotalsEditor.setAppliedLevel('Group By', 'Maximum');

        // And I click Create Group button for "Maximum" subtotal in subtotals editor
        await reportSubtotalsEditor.setAppliedLevelValueSelector('Maximum');

        // And I select "Region" attribute for group by in subtotals editor
        await reportSubtotalsEditor.selectAttributeGroupByCheckbox('Region');

        // And I select "Call Center" attribute for group by in subtotals editor
        await reportSubtotalsEditor.selectAttributeGroupByCheckbox('Call Center');

        // And I click "Done" button in group by editor in subtotals editor
        await reportSubtotalsEditor.clickGroupByEditorButton('Done');

        // And I click "Done" button in subtotals editor
        await reportSubtotalsEditor.saveAndCloseSubtotalsEditor();

        // And I scroll ag-grid "Visualization 1" down 2000px pixels
        await reportGridView.scrollGridToBottom('Visualization 1');

        // Then the grid cell at "28", "0" has text "Maximum"
        await since('The grid cell at "28", "0" should have text "Maximum", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(28, 0))
            .toBe('Maximum');

        // And the grid cell at "28", "3" has text "$3,544,594"
        await since('The grid cell at "28", "3" should have text "$3,544,594", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(28, 3))
            .toBe('$3,544,594');

        // And the grid cell at "42", "0" has text "Maximum"
        await since('The grid cell at "42", "0" should have text "Maximum", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(42, 0))
            .toBe('Maximum');

        // And the grid cell at "42", "5" has text "$3,902,762"
        await since('The grid cell at "42", "5" should have text "$3,902,762", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(42, 5))
            .toBe('$3,902,762');

        // When I Hide Totals from "Country" header cell context menu in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Country');
        await reportGridView.clickContextMenuOption('Hide All Totals');

        // Then the grid has 15 rows of data
        await since(
            'After hide all totals for Country, The grid should have 15 rows of data, instead we have #{actual}'
        )
            .expect(await reportGridView.getRowCounts())
            .toBe(15);

        // When I open Show Totals from "Cost" header cell context menu in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Cost');
        await reportGridView.clickContextMenuOption('Show Totals');

        // And I scroll ag-grid "Visualization 1" down 2000px pixels
        await reportGridView.scrollGridToBottom('Visualization 1');

        // Then the grid cell at "42", "0" has text "Maximum"
        await since('The grid cell at "42", "0" should have text "Maximum", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(42, 0))
            .toBe('Maximum');

        // And the grid cell at "42", "5" has text "$3,902,762"
        await since('The grid cell at "42", "5" should have text "$3,902,762", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(42, 5))
            .toBe('$3,902,762');

        // When I Hide Totals from "Cost" header cell context menu in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Cost');
        await reportGridView.clickContextMenuOption('Hide All Totals');

        // Then the grid has 15 rows of data
        await since('The grid should have 15 rows of data, instead we have #{actual}')
            .expect(await reportGridView.getRowCounts())
            .toBe(15);

        // When I open Show Totals from "Country" header cell context menu in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Country');
        await reportGridView.clickContextMenuOption('Show Totals');

        // Then the grid cell at "23", "1" has text "Average"
        await since('The grid cell at "23", "1" should have text "Average", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(23, 1))
            .toBe('Average');

        // And the grid cell at "23", "3" has text "$1,886,490"
        await since('The grid cell at "23", "3" should have text "$1,886,490", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(23, 3))
            .toBe('$1,886,490');

        // When I open Edit Totals from "Region" header cell context menu in Report Editor
        await reportGridView.openGridColumnHeaderContextMenu('Region');
        await reportGridView.clickContextMenuOption('Edit Totals');

        // And I click "Remove Subtotals" button in subtotals editor
        await reportSubtotalsEditor.clickButton('Remove Subtotals');

        // Then the grid has 15 rows of data
        await since(
            ' After remove subtatls for Region, The grid should have 15 rows of data, instead we have #{actual}'
        )
            .expect(await reportGridView.getRowCounts())
            .toBe(15);
    });
});
